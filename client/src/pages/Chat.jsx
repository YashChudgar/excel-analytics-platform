import React, { useState } from "react";
import { useFilesContext } from "../context/FileContext";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";
import {
  PaperAirplaneIcon,
  SparklesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import DashboardLayout from "../components/DashboardLayout";

const Chat = () => {
  const { files, selectedFileId, setSelectedFileId } = useFilesContext();
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !selectedFileId || cooldown) return;

    try {
      setLoading(true);
      setCooldown(true);
      setResponse("");

      const res = await axiosInstance.post(`/chat/${selectedFileId}`, {
        message,
      });

      setResponse(res.data?.response || "❌ No response from AI.");
      setTimeout(() => setCooldown(false), 15000);
    } catch (err) {
      const error = err.response?.data?.error || "Failed to get AI response.";
      const details = err.response?.data?.details || "";
      setResponse(`❌ ${error}\n${details}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4 py-10 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-10 text-center text-indigo-700 flex items-center gap-3"
        >
          <SparklesIcon className="h-8 w-8 text-indigo-600 animate-bounce" />
          AI Chat Insights
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl space-y-6"
        >
          {/* File Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-lg font-medium text-gray-700 flex items-center gap-2 mb-1">
              <DocumentTextIcon className="w-5 h-5 text-indigo-500" />
              Select uploaded Excel file:
            </label>
            <select
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="cursor-pointer w-full p-3 rounded-xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="">-- Choose a file --</option>
              {files.map((file) => (
                <option key={file._id} value={file._id}>
                  {file.originalName}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Message Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label htmlFor="message" className="text-lg font-medium text-gray-700">
              Ask a question:
            </label>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              <input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. What are the sales trends?"
                className="flex-1 px-4 py-3 outline-none text-gray-700 bg-white"
              />
              <button
                onClick={handleSend}
                disabled={loading || !selectedFileId || cooldown}
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-5 h-5 transform rotate-45" />
                {loading ? "Sending..." : cooldown ? "Wait..." : "Send"}
              </button>
            </div>
          </motion.div>

          {/* AI Response */}
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow-inner"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">💡 AI Insight</h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {response}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
