import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../components/DashboardLayout";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const AIInsights = () => {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axiosInstance.get("/user/files");
        setFiles(res.data.files);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("❌ Failed to fetch your files.");
      }
    };

    fetchFiles();
  }, []);

  const generateInsights = async () => {
    if (!selectedFileId) {
      setError("⚠️ Please select a file.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.post(`/ai-insights/${selectedFileId}`);
      setInsights(res.data.insights || "No insights generated.");
    } catch (err) {
      console.error("AI Insights Error:", err);
      setError("⚠️ Something went wrong while generating insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-4xl mx-auto px-6 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          📊 Generate AI Insights
        </h1>

        <div className="space-y-6">
          {/* File selector dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose an uploaded Excel file:
            </label>
            <select
              className="cursor-pointer block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
            >
              <option value="">-- Select a file --</option>
              {files.map((file) => (
                <option key={file._id} value={file._id}>
                  {file.originalName}
                </option>
              ))}
            </select>
          </div>

          {/* Generate button */}
          <div className="flex justify-center">
            <button
              onClick={generateInsights}
              className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              {loading ? "Generating..." : "Generate Insights"}
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="text-red-500 text-center font-medium">{error}</div>
          )}

          {/* AI insights display */}
          {insights && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.6 }}
    className="relative mt-6 rounded-2xl shadow-xl border border-indigo-200 overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-white"
  >
    {/* Header */}
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-white font-semibold text-lg flex items-center justify-between">
      <span>💡 AI Insights</span>
    </div>

    {/* Content */}
    <div className="prose prose-indigo max-w-none p-6 overflow-y-auto max-h-[500px] scroll-smooth scrollbar-thin scrollbar-thumb-indigo-400">
      <ReactMarkdown>{insights}</ReactMarkdown>
    </div>

    {/* Bottom gradient fade for overflow effect */}
    <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none" />
  </motion.div>
)}

        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AIInsights;
