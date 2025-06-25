import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../components/DashboardLayout";


const AIInsights = () => {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState("");
  const [error, setError] = useState("");

  // 🔹 1. Fetch user's uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axiosInstance.get("/user/files"); // make sure this endpoint exists
        setFiles(res.data.files);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to fetch your files.");
      }
    };

    fetchFiles();
  }, []);

  // 🔹 2. Generate Insights
  const generateInsights = async () => {
  if (!selectedFileId) {
    setError("Please select a file first.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setInsights(null);

    const response = await axiosInstance.post(`/ai-insights/${selectedFileId}`);
    setInsights(response.data); // ✅ res is response
  } catch (err) {
    console.error("AI Insights Error:", err);
    setError(err.response?.data?.error || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};


  return (
    <DashboardLayout>
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">AI Insights</h1>

      {/* 🔹 File Dropdown */}
      <select
        className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        value={selectedFileId}
        onChange={(e) => setSelectedFileId(e.target.value)}
      >
        <option value="">Select a file</option>
        {files.map((file) => (
          <option key={file._id} value={file._id}>
            {file.originalName}
          </option>
        ))}
      </select>

      <button
        onClick={generateInsights}
        disabled={loading || !selectedFileId}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
      >
        {loading ? "Generating..." : "Generate Insights"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {insights && (
  <div className="mt-6 space-y-4 bg-gray-100 p-4 rounded-lg">
    <div>
      <h2 className="text-xl font-semibold text-indigo-700">Summary</h2>
      <p>{insights.summary}</p>
    </div>
    <div>
      <h2 className="text-xl font-semibold text-indigo-700">Trends</h2>
      <p>{insights.trends}</p>
    </div>
    <div>
      <h2 className="text-xl font-semibold text-indigo-700">Recommendations</h2>
      <p>{insights.recommendations}</p>
    </div>
  </div>
)}
    </div>
    </DashboardLayout>
  );
};

export default AIInsights;
