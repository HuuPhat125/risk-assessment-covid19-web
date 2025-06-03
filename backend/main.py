from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import hospitals, news, upload

import os
print("PORT env var:", os.getenv("PORT"))

app = FastAPI()

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(hospitals.router, prefix="/hospitals", tags=["hospitals"])
app.include_router(news.router)
app.include_router(upload.router, prefix="/api", tags=["upload"])

@app.get("/")
def read_root():
    return {"message": "Backend API is running."}
