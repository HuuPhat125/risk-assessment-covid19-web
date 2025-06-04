"use client";

import { useState } from "react";
import {
  Activity,
  Brain,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const modelOptions = [
  { value: "logistic_regression", label: "Logistic Regression" },
  { value: "knn", label: "K-Nearest Neighbors (KNN)" },
  { value: "decision_tree", label: "Decision Tree" },
  { value: "mlp", label: "Multi Layer Perceptron (MLP)" },
  { value: "naive_bayes", label: "Naive Bayes" },
  { value: "random_forest", label: "Random Forest" },
];

const formFields = [
  {
    section: "Basic Information",
    fields: [
      {
        name: "SEX",
        label: "Sex",
        type: "select",
        defaultValue: "2", // Default: Male
        options: [
          { value: "1", label: "Female" },
          { value: "2", label: "Male" },
        ],
        required: true,
      },
      {
        name: "AGE",
        label: "Age",
        type: "number",
        defaultValue: 30,
        min: 0,
        max: 120,
        required: true,
      },
      {
        name: "PREGNANT",
        label: "Pregnancy",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
    ],
  },
  {
    section: "Medical Conditions",
    fields: [
      {
        name: "PNEUMONIA",
        label: "Pneumonia",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "DIABETES",
        label: "Diabetes",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "COPD",
        label: "COPD (Chronic Obstructive Pulmonary Disease)",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "ASTHMA",
        label: "Asthma",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "INMSUPR",
        label: "Immunosuppressed",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "HIPERTENSION",
        label: "Hypertension",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "CARDIOVASCULAR",
        label: "Cardiovascular Disease",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "RENAL_CHRONIC",
        label: "Chronic Renal Disease",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "OTHER_DISEASE",
        label: "Other Disease",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "OBESITY",
        label: "Obesity",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "TOBACCO",
        label: "Tobacco User",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
    ],
  },
  {
    section: "Medical Care Information",
    fields: [
      {
        name: "USMER",
        label: "Medical Unit Level (USMER)",
        type: "select",
        defaultValue: "1",
        options: [
          { value: "1", label: "First Level" },
          { value: "2", label: "Second Level" },
          { value: "3", label: "Third Level" },
          { value: "97", label: "Unknown" },
        ],
        required: true,
      },
      {
        name: "CLASIFFICATION_FINAL",
        label: "Final Classification",
        type: "select",
        defaultValue: "3", // Default: Lab-confirmed COVID-19
        options: [
          { value: "1", label: "COVID-19 Case by Association" },
          { value: "2", label: "COVID-19 Case by Dictamen Committee" },
          { value: "3", label: "COVID-19 Case by Laboratory" },
          { value: "4", label: "Invalid by Laboratory" },
          { value: "5", label: "Not COVID-19 Case by Laboratory" },
          { value: "6", label: "COVID-19 Case by SARS-CoV-2 Antigen" },
          { value: "7", label: "Suspect Case" },
        ],
        required: true,
      },
    ],
  },
];

export default function PredictionPage() {
  const initialFormData = {};
  formFields.forEach((section) => {
    section.fields.forEach((field) => {
      initialFormData[field.name] = field.defaultValue ?? "";
    });
  });

  const [formData, setFormData] = useState(initialFormData);
  const [selectedModel, setSelectedModel] = useState("logistic_regression");

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [batchResults, setBatchResults] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    const requiredFields = Object.keys(formData);
    for (let field of requiredFields) {
      if (!formData[field]) {
        const fieldLabel =
          formFields
            .flatMap((section) => section.fields)
            .find((f) => f.name === field)?.label || field;
        setError(`Please fill in the required field: ${fieldLabel}`);
        return false;
      }
    }
    return true;
  };

  const parseCSV = (text) => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",");
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || "";
        });
        if (Object.values(row).some((v) => v !== "")) {
          data.push(row);
        }
      }
    }
    return data;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPrediction(null);
    setError("");
    setSelectedModel("logistic_regression");
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => row[header] || "").join(",")),
    ].join("\n");
    return csvContent;
  };

  const hasValidProbability = (confidence) => {
    return confidence !== null && confidence !== undefined && !isNaN(confidence);
  };

  const handleBatchFile = async (e) => {
    setBatchError('');
    setBatchResults([]);
    setDownloadUrl('');
    const file = e.target.files[0];
    if (!file) return;

    setBatchLoading(true);

    try {
      let records = [];
      const text = await file.text();
      if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        if (Array.isArray(json)) records = json;
        else if (typeof json === 'object') records = [json];
      } else if (file.name.endsWith('.csv')) {
        records = parseCSV(text);
      } else {
        setBatchError('Only CSV or JSON files are supported.');
        setBatchLoading(false);
        return;
      }

      if (records.length === 0) {
        setBatchError('No valid records found in file.');
        setBatchLoading(false);
        return;
      }

      const inputs = records.map((rec) => ({
        USMER: parseInt(rec.USMER),
        SEX: parseInt(rec.SEX),
        PNEUMONIA: parseInt(rec.PNEUMONIA),
        AGE: parseInt(rec.AGE),
        PREGNANT: parseInt(rec.PREGNANT),
        DIABETES: parseInt(rec.DIABETES),
        COPD: parseInt(rec.COPD),
        ASTHMA: parseInt(rec.ASTHMA),
        INMSUPR: parseInt(rec.INMSUPR),
        HIPERTENSION: parseInt(rec.HIPERTENSION),
        OTHER_DISEASE: parseInt(rec.OTHER_DISEASE),
        CARDIOVASCULAR: parseInt(rec.CARDIOVASCULAR),
        OBESITY: parseInt(rec.OBESITY),
        RENAL_CHRONIC: parseInt(rec.RENAL_CHRONIC),
        TOBACCO: parseInt(rec.TOBACCO),
        CLASIFFICATION_FINAL: parseInt(rec.CLASIFFICATION_FINAL),
      }));

      const batchRequestBody = {
        data: inputs,
        model_config: selectedModel,
      };

      const response = await fetch(process.env.NEXT_PUBLIC_PREDICT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchRequestBody),
      });
      
      const responseText = await response.text();
      if (!response.ok) throw new Error(`API Error: ${response.status} - ${responseText}`);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Failed to parse API response: ${responseText}`);
      }

      const results = (result.predictions || []).map((risk, idx) => {
        const highProb = result.probabilities && Array.isArray(result.probabilities) && hasValidProbability(result.probabilities[idx])
          ? result.probabilities[idx]
          : null;
        return {
          index: idx + 1,
          risk_level: risk || 'UNKNOWN',
          high_probability: highProb,
          low_probability: highProb !== null ? 1 - highProb : null,
          input: records[idx],
        };
      });

      setBatchResults(results.slice(0, 10));

      const output = results.map((r) => ({
        ...r.input,
        risk_level: r.risk_level,
        high_probability: hasValidProbability(r.high_probability) ? r.high_probability : 'N/A',
        low_probability: hasValidProbability(r.low_probability) ? r.low_probability : 'N/A',
        model_used: selectedModel,
      }));
      const csv = convertToCSV(output);
      const blob = new Blob([csv], { type: 'text/csv' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      setBatchError('Batch prediction failed: ' + err.message);
    } finally {
      setBatchLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const modelInput = {
        USMER: parseInt(formData.USMER),
        SEX: parseInt(formData.SEX),
        PNEUMONIA: parseInt(formData.PNEUMONIA),
        AGE: parseInt(formData.AGE),
        PREGNANT: parseInt(formData.PREGNANT),
        DIABETES: parseInt(formData.DIABETES),
        COPD: parseInt(formData.COPD),
        ASTHMA: parseInt(formData.ASTHMA),
        INMSUPR: parseInt(formData.INMSUPR),
        HIPERTENSION: parseInt(formData.HIPERTENSION),
        OTHER_DISEASE: parseInt(formData.OTHER_DISEASE),
        CARDIOVASCULAR: parseInt(formData.CARDIOVASCULAR),
        OBESITY: parseInt(formData.OBESITY),
        RENAL_CHRONIC: parseInt(formData.RENAL_CHRONIC),
        TOBACCO: parseInt(formData.TOBACCO),
        CLASIFFICATION_FINAL: parseInt(formData.CLASIFFICATION_FINAL),
        model_config: selectedModel,
      };

      const response = await fetch(process.env.NEXT_PUBLIC_PREDICT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelInput),
      });
      // const response = {
      //     ok: true,
      //     status: 200,
      //     json: async () => ({
      //       predictions: ["LOW"],
      //       probabilities: [0.3002267088826256],
      //       model_config: "logistic_regression",
      //       endpoint_name: "logistic-regression-endpoint"
      //     }),
      //     text: async () => JSON.stringify({
      //       predictions: ["LOW"],
      //       probabilities: null,
      //       model_config: "logistic_regression",
      //       endpoint_name: "logistic-regression-endpoint"
      //     })
      //   };


      const responseText = await response.text();
      if (!response.ok) throw new Error(`API Error: ${response.status} - ${responseText}`);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Failed to parse API response: ${responseText}`);
      }

      const highProb = result.probabilities && Array.isArray(result.probabilities) && hasValidProbability(result.probabilities[0])
        ? result.probabilities[0]
        : null;

      const processedResult = {
        risk_level: result.predictions && result.predictions[0] ? result.predictions[0] : 'UNKNOWN',
        high_probability: highProb,
        low_probability: highProb !== null ? 1 - highProb : null,
        model_used: selectedModel,
        raw_response: result,
      };

      setPrediction(processedResult);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Failed to get prediction: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                COVID-19 Risk Assessment
              </h2>

              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Machine Learning Model Selection
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-800">
                    Choose Prediction Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {modelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-blue-700 mt-1">
                    Selected: <span className="font-semibold">
                      {modelOptions.find((m) => m.value === selectedModel)?.label}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Batch Prediction (CSV/JSON)
                </h3>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleBatchFile}
                  className="block mb-2"
                  disabled={batchLoading}
                />
                <p className="text-xs text-gray-600 mb-2">
                  Using model: <span className="font-semibold">
                    {modelOptions.find((m) => m.value === selectedModel)?.label}
                  </span>
                </p>
                {batchLoading && (
                  <div className="text-blue-600 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing batch with{' '}
                    {modelOptions.find((m) => m.value === selectedModel)?.label}...
                  </div>
                )}
                {batchError && (
                  <div className="text-red-600 mb-2">{batchError}</div>
                )}
                {batchResults.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 font-medium">
                      Top 10 Results (Model: {modelOptions.find((m) => m.value === selectedModel)?.label}):
                    </div>
                    <table className="min-w-full text-xs border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-2 py-1">#</th>
                          <th className="border px-2 py-1">Risk Level</th>
                          <th className="border px-2 py-1">HIGH Prob</th>
                          <th className="border px-2 py-1">LOW Prob</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchResults.map((r, idx) => (
                          <tr key={idx}>
                            <td className="border px-2 py-1">{r.index}</td>
                            <td
                              className={`border px-2 py-1 font-bold ${
                                r.risk_level === 'HIGH' ? 'text-red-600' : 'text-green-600'
                              }`}
                            >
                              {r.risk_level}
                            </td>
                            <td className="border px-2 py-1">
                              {hasValidProbability(r.high_probability)
                                ? `${(r.high_probability * 100).toFixed(1)}%`
                                : 'N/A'}
                            </td>
                            <td className="border px-2 py-1">
                              {hasValidProbability(r.low_probability)
                                ? `${(r.low_probability * 100).toFixed(1)}%`
                                : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        download="batch_prediction_results.csv"
                        className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Download Full Results (CSV)
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {formFields.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                      {section.section}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              value={formData[field.name]}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required={field.required}
                            >
                              <option value="">Select...</option>
                              {field.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              value={formData[field.name]}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              min={field.min}
                              max={field.max}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required={field.required}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing with{' '}
                        {modelOptions.find((m) => m.value === selectedModel)?.label}...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        Get Risk Prediction
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                About This Model
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• ML model for COVID-19 risk assessment</p>
                <p>• 16 medical features analyzed</p>
                <p>• Multiple algorithms available</p>
                <p>• Returns probability scores</p>
                <p>• Based on clinical data patterns</p>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-sm font-medium text-blue-900">Current Model:</p>
                <p className="text-sm text-blue-700">
                  {modelOptions.find((m) => m.value === selectedModel)?.label}
                </p>
              </div>
            </div>

            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Processing...</h3>
                    <p className="text-sm text-blue-700">
                      Analyzing with{' '}
                      {modelOptions.find((m) => m.value === selectedModel)?.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {prediction && (
              <div
                className={`rounded-lg border p-6 ${
                  prediction.risk_level === 'HIGH'
                    ? 'bg-red-50 border-red-200'
                    : prediction.risk_level === 'LOW'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {prediction.risk_level === 'HIGH' ? (
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  ) : prediction.risk_level === 'LOW' ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-gray-500" />
                  )}
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        prediction.risk_level === 'HIGH'
                          ? 'text-red-900'
                          : prediction.risk_level === 'LOW'
                          ? 'text-green-900'
                          : 'text-gray-900'
                      }`}
                    >
                      {prediction.risk_level} RISK
                    </h3>
                    {hasValidProbability(prediction.high_probability) && (
                      <p
                        className={`text-sm ${
                          prediction.risk_level === 'HIGH'
                            ? 'text-red-700'
                            : 'text-green-700'
                        }`}
                      >
                        HIGH Probability: {(prediction.high_probability * 100).toFixed(1)}%
                      </p>
                    )}
                    {hasValidProbability(prediction.low_probability) && (
                      <p
                        className={`text-sm ${
                          prediction.risk_level === 'HIGH'
                            ? 'text-red-700'
                            : 'text-green-700'
                        }`}
                      >
                        LOW Probability: {(prediction.low_probability * 100).toFixed(1)}%
                      </p>
                    )}
                    <p
                      className={`text-xs ${
                        prediction.risk_level === 'HIGH'
                          ? 'text-red-600'
                          : prediction.risk_level === 'LOW'
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      Using: {modelOptions.find((m) => m.value === prediction.model_used)?.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Medical Disclaimer</p>
                  <p>
                    This tool is for informational purposes only and should not
                    replace professional medical advice, diagnosis, or treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
