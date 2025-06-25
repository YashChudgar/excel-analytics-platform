import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";
import {
  PaperAirplaneIcon,
  SparklesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import DashboardLayout from "../components/DashboardLayout";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");

  // Fetch uploaded files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axiosInstance.get("/user/files");
        setFiles(res.data.files || res.data); // fallback for both formats
      } catch (err) {
        console.error("❌ Failed to fetch files:", err.response || err);
      }
    };

    fetchFiles();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || !selectedFileId) return;

    try {
      setLoading(true);
      setResponse("");
      const res = await axiosInstance.post(`/chat/${selectedFileId}`, { message });

      if (res.data?.response) {
        setResponse(res.data.response);
      } else {
        console.warn("⚠️ Unexpected response from AI:", res.data);
        setResponse("❌ No response from AI. Check server logs.");
      }
    } catch (err) {
      console.error("❌ AI request error:", err.response?.data || err.message || err);
      const serverError = err.response?.data?.error || "Failed to get AI response.";
      const details = err.response?.data?.details || "";
      setResponse(`❌ ${serverError}\n${details}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4 py-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-center text-indigo-700 flex items-center gap-2"
        >
          <SparklesIcon className="h-8 w-8 text-indigo-600 animate-pulse" />
          AI Chat Insights
        </motion.div>

        <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-6">
          {/* File Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="file" className="text-lg font-medium text-gray-700 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-indigo-500" />
              Select an uploaded Excel file:
            </label>
            <select
              id="file"
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm outline-none"
            >
              <option value="">-- Choose a file --</option>
              {files.map((file) => (
                <option key={file._id} value={file._id}>
                  {file.originalName}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Question Input */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="message" className="text-lg font-medium text-gray-700">
              Ask a question about the selected file:
            </label>
            <div className="flex mt-2 rounded-xl border border-gray-300 shadow-sm overflow-hidden">
              <input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., What patterns do you notice?"
                className="flex-1 px-4 py-3 outline-none text-gray-800"
              />
              <button
                onClick={handleSend}
                disabled={loading || !selectedFileId}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-3 text-white transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </motion.div>

          {/* AI Response */}
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-gray-50 border border-indigo-200 rounded-xl p-5 text-gray-800 whitespace-pre-wrap leading-relaxed"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-3">💡 Gemini AI Insight</h3>
              {response}
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
