import feedparser
from dateutil import parser
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import requests
import html
import os
import json

class RSSReader:
    def __init__(self, keywords=None, cache_file='data/rss_cache.json'):
        self.keywords = [kw.lower() for kw in keywords] if keywords else []
        self.feeds = {
            'vnexpress': 'https://vnexpress.net/rss/suc-khoe.rss',
            'thanhnien': 'https://thanhnien.vn/rss/suc-khoe.rss',
            'suckhoedoisong': 'https://suckhoedoisong.vn/y-te.rss',
            'sggp': 'https://www.sggp.org.vn/rss/ytesuckhoe-212.rss',
        }
        self.cache_file = cache_file
        self.cache = self._load_cache()
        self.last_fetched = None

    def _load_cache(self):
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading cache: {e}")
        return []

    def _save_cache(self):
        cache_to_save = []
        for item in self.cache:
            copy_item = item.copy()
            # Chuyển datetime về chuỗi isoformat để json có thể lưu
            if isinstance(copy_item.get('published_dt'), datetime):
                copy_item['published_dt'] = copy_item['published_dt'].isoformat()
            cache_to_save.append(copy_item)

        with open(self.cache_file, 'w', encoding='utf-8') as f:
            json.dump(cache_to_save, f, ensure_ascii=False, indent=2)

    def clean_html(self, html_content):
        soup = BeautifulSoup(html_content, 'html.parser')
        text = soup.get_text().strip()
        img = soup.find('img')
        img_url = img['src'] if img and 'src' in img.attrs else ''
        return text, img_url

    def _parse_date(self, date_str):
        try:
            return parser.parse(date_str)
        except:
            return None

    def _fetch_custom_rss(self, url, source):
        try:
            res = requests.get(url, timeout=10)
            res.encoding = 'utf-8'
            soup = BeautifulSoup(res.text, 'xml')
            items = soup.find_all('item')
        except Exception as e:
            print(f"Error fetching {source}: {e}")
            return []

        results = []
        for item in items:
            title = html.unescape(item.title.text.strip())
            if self.keywords and not any(kw in title.lower() for kw in self.keywords):
                continue

            raw_desc = html.unescape(item.description.text.strip())
            description, extracted_img = self.clean_html(raw_desc)

            pub_date_str = item.pubDate.text.strip()
            pub_dt = self._parse_date(pub_date_str)
            published = pub_dt.strftime('%d/%m/%Y %H:%M') if pub_dt else ''
            image = item.find('enclosure')['url'] if item.find('enclosure') and item.find('enclosure').has_attr('url') else extracted_img

            results.append({
                'title': title,
                'description': description,
                'link': item.link.text.strip(),
                'published': published,
                'published_dt': pub_dt or datetime.min,
                'image': image,
                'source': source
            })

        return results

    def _fetch_standard_rss(self, url, source):
        try:
            response = requests.get(url, timeout=10)
            response.encoding = 'utf-8'
            feed = feedparser.parse(response.text)
        except Exception as e:
            print(f"Error fetching {source}: {e}")
            return []

        results = []
        for entry in feed.entries:
            title = html.unescape(entry.title)
            if self.keywords and not any(kw in title.lower() for kw in self.keywords):
                continue

            pub_str = entry.get('published', entry.get('updated', ''))
            pub_dt = self._parse_date(pub_str)
            published = pub_dt.strftime('%d/%m/%Y %H:%M') if pub_dt else ''

            raw_desc = entry.get('summary', entry.get('description', ''))
            description, extracted_img = self.clean_html(raw_desc)

            image = ''
            if 'media_content' in entry:
                image = entry.media_content[0].get('url', '')
            elif extracted_img:
                image = extracted_img

            results.append({
                'title': title,
                'link': entry.link,
                'description': description,
                'published': published,
                'published_dt': pub_dt or datetime.min,
                'source': source,
                'image': image
            })

        return results

    def fetch_and_cache(self):
        all_results = []

        for source, url in self.feeds.items():
            if source == 'suckhoedoisong':
                results = self._fetch_custom_rss(url, source)
            else:
                results = self._fetch_standard_rss(url, source)

            all_results.extend(results)

        existing_links = {item['link'] for item in self.cache}
        new_items = [item for item in all_results if item['link'] not in existing_links]

        # Chuẩn hoá cache cũ để đảm bảo có trường `published_dt`
        for item in self.cache:
            if 'published_dt' not in item:
                item['published_dt'] = self._parse_date(item.get('published', '')) or datetime.min

        # Gộp và sắp xếp lại
        self.cache.extend(new_items)
        self.cache.sort(key=lambda x: x['published_dt'], reverse=True)

        self._save_cache()
        self.last_fetched = datetime.utcnow()

    def get_news(self, source='all'):
        if not self.last_fetched or datetime.utcnow() - self.last_fetched > timedelta(hours=1):
            self.fetch_and_cache()

        if source != 'all':
            return [item for item in self.cache if item['source'] == source]

        return self.cache
