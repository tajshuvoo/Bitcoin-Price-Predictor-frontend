import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BTCChart from "./components/BTCChart";

const models = [
  { id: "fifteen_min", name: "Transformer Model 15-Minute" },
  { id: "one_hour", name: "Transformer Model 1-Hour" },
  { id: "six_hour", name: "Transformer Model 6-Hour" },
  { id: "twelve_hour", name: "Transformer Model 12-Hour" },
  { id: "eighteen_hour", name: "Transformer Model 18-Hour" },
  { id: "one_day", name: "Transformer Model 1-Day" },
  { id: "two_days", name: "Transformer Model 2-Day" },
  { id: "three_days", name: "Transformer Model 3-Day" },
  { id: "four_days", name: "Transformer Model 4-Day" },
  { id: "five_days", name: "Transformer Model 5-Day" },
  { id: "six_days", name: "Transformer Model 6-Day" },
  { id: "seven_days", name: "Transformer Model 7-Day" },
];

export default function App() {
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [actualData, setActualData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modelInfoMap, setModelInfoMap] = useState({}); // fetched model info
  const [modelMetricsMap, setModelMetricsMap] = useState({}); // <-- Added for metrics

  // Mapping React model IDs to metrics JSON keys <-- Added
  const modelIdToMetricsKey = {
    fifteen_min: "transformer_model_15min",
    one_hour: "transformer_model_1hour",
    six_hour: "transformer_model_6hour",
    twelve_hour: "transformer_model_12hour",
    eighteen_hour: "transformer_model_18hour",
    one_day: "transformer_model_1day",
    two_days: "transformer_model_2days",
    three_days: "transformer_model_3days",
    four_days: "transformer_model_4days",
    five_days: "transformer_model_5days",
    six_days: "transformer_model_6days",
    seven_days: "transformer_model_7days",
  };
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  // Fetch model info once on mount
  useEffect(() => {
    async function fetchModelInfo() {
      try {
        const res = await fetch(`${BASE_URL}/model_info`);
        if (!res.ok) throw new Error("Failed to fetch model info");
        const json = await res.json();
        setModelInfoMap(json);
      } catch (err) {
        console.error("Error fetching model info:", err);
        setModelInfoMap({});
      }
    }
    fetchModelInfo();
  }, []);

  // Fetch model metrics once on mount  <-- Added
  useEffect(() => {
    async function fetchModelMetrics() {
      try {
        const res = await fetch(`${BASE_URL}/model_metrics`);
        if (!res.ok) throw new Error("Failed to fetch model metrics");
        const json = await res.json();
        setModelMetricsMap(json);
      } catch (err) {
        console.error("Error fetching model metrics:", err);
        setModelMetricsMap({});
      }
    }
    fetchModelMetrics();
  }, []);

  // Fetch actual last 7 days and prediction on model change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch actual last 7 days
        const resActual = await fetch(`${BASE_URL}/fetch_last_seven_days`);
        if (!resActual.ok) throw new Error("Failed to fetch actual data");
        const jsonActual = await resActual.json();

        // Fetch predicted data for selected model
        const resPred = await fetch(`${BASE_URL}/predict/${selectedModel}`);
        if (!resPred.ok) throw new Error("Failed to fetch predicted data");
        const jsonPred = await resPred.json();

        setActualData(jsonActual.data || []);
        setPredictedData(jsonPred.data || []);
      } catch (err) {
        setError(err.message);
        setActualData([]);
        setPredictedData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedModel]);

  // Get model info object for currently selected model (from fetched data)
  const modelInfo = modelInfoMap[selectedModel] || null;

  // Get metrics key for selected model and fetch metrics <-- Added
  const metricsKey = modelIdToMetricsKey[selectedModel];
  const modelMetrics = metricsKey ? modelMetricsMap[metricsKey] : null;

  // Debug logs - remove or comment out after testing
  // console.log("Selected model:", selectedModel);
  // console.log("Metrics key:", metricsKey);
  // console.log("Model Metrics:", modelMetrics);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container py-4">
        <h2 className="mb-4 text-center">BTC Price Prediction</h2>

        {/* Model Selection */}
        <div className="mb-4 d-flex justify-content-center">
          <select
            className="form-select w-auto"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Model Info Display */}
        {modelInfo && (
          <div
            className="mb-4 mx-auto"
            style={{
              maxWidth: "700px",
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <h4 className="mb-2">{modelInfo.name}</h4>
            <p>
              <strong>Input Sequence:</strong> {modelInfo.input_sequence}
            </p>
            <p>
              <strong>Training Data:</strong> {modelInfo.training_data}
            </p>
            <p>
              <strong>Description:</strong> {modelInfo.description}
            </p>
            <p>
              <em>{modelInfo.note}</em>
            </p>
          </div>
        )}

        {/* --- Metrics Display (NEW) --- */}
        {modelMetrics ? (
          <div
            className="mb-4 mx-auto"
            style={{
              maxWidth: "700px",
              backgroundColor: "#eaf4ff",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <h5 className="mb-3">📊 Evaluation Metrics</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <strong>MAE:</strong> {modelMetrics.MAE}
              </li>
              <li>
                <strong>RMSE:</strong> {modelMetrics.RMSE}
              </li>
              <li>
                <strong>R²:</strong> {modelMetrics.R2}
              </li>
              <li>
                <strong>MAPE:</strong> {modelMetrics["MAPE (%)"]}%
              </li>
            </ul>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Metrics not available for this model.</p>
        )}

        {/* Loading / Error */}
        {loading && <p className="text-center">Loading data...</p>}
        {error && <p className="text-danger text-center">Error: {error}</p>}

        {/* Chart */}
        {!loading && !error && actualData.length && predictedData.length ? (
          <BTCChart actualData={actualData} predictedData={predictedData} />
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
