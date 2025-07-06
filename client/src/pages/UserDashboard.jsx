import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";
import { format } from "date-fns";
import DashboardLayout from "../components/DashboardLayout";

import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DeleteIcon from "@mui/icons-material/Delete";

const Dashboard = ({ children, hideNavbar = false }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(false);
  const [error, setError] = useState("");
  const [activityLimit, setActivityLimit] = useState(5);

  useEffect(() => {
    Promise.all([fetchActivities(), fetchFiles()]).finally(() =>
      setLoading(false)
    );
  }, [activityLimit]);

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const response = await axiosInstance.get(
        `/user/activities?limit=${activityLimit}`
      );
      const data = response.data;
      setActivities(Array.isArray(data) ? data : data.activities || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Error fetching activities");
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const response = await axiosInstance.get("/user/files");
      const data = response.data;
      setFiles(Array.isArray(data) ? data : data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Error fetching files");
      setFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await axiosInstance.delete(`/user/files/${fileId}`);
        fetchFiles();
        fetchActivities();
      } catch (error) {
        console.error("Error deleting file:", error);
        setError("Error deleting file");
      }
    }
  };

  const handleAnalyzeFile = (fileId) => {
    navigate(`/excel-analytics?fileId=${fileId}`);
  };

  const refreshData = () => {
    setError("");
    fetchActivities();
    fetchFiles();
  };

  const features = [
    {
      title: "Excel Analytics",
      description: "Upload and analyze your Excel files",
      icon: <TableChartIcon className="text-indigo-400 w-10 h-10 sm:w-12 sm:h-12 mb-2" />,
      onClick: () => navigate("/excel-analytics"),
    },
    {
      title: "Data Analysis",
      description: "Analyze Excel data with powerful tools",
      icon: <AnalyticsIcon className="text-indigo-400 w-10 h-10" />,
      onClick: () => navigate("/excel-analytics"),
    },
    {
      title: "Visualizations",
      description: "Create interactive charts and graphs",
      icon: <BarChartIcon className="text-indigo-400 w-10 h-10" />,
      onClick: () => navigate("/excel-analytics"),
    },
  ];

  return (
    <DashboardLayout hideNavbar={hideNavbar}>
      <main className="min-h-screen max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-0">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 rounded-3xl shadow-2xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome {user?.username}!</h2>
          <p className="text-base sm:text-lg">
            Here's an overview of your analytics and activities
          </p>
        </motion.div>

        <h3 className="text-2xl font-semibold mt-10 mb-6 text-indigo-700">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`flex flex-col justify-between h-full p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ${feature.onClick ? "cursor-pointer" : ""}`}
              onClick={feature.onClick}
            >
              {feature.icon}
              <h4 className="text-xl font-semibold mt-3 text-indigo-700">{feature.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Activities */}
        <section className="mt-14">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h3 className="text-2xl font-semibold text-indigo-700">
              Recent Activities
            </h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={refreshData}
                className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Refresh
              </button>
              <select
                value={activityLimit}
                onChange={(e) => setActivityLimit(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 rounded px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[5, 10, 20, 50].map((num) => (
                  <option key={num} value={num}>
                    Last {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="min-h-[250px] overflow-x-auto bg-white rounded-2xl shadow-lg">
            {activitiesLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-indigo-100 text-indigo-700 font-semibold">
                  <tr>
                    <th className="p-4">Type</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {!Array.isArray(activities) || activities.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center p-6 text-gray-400">
                        No activities found.
                      </td>
                    </tr>
                  ) : (
                    activities.map((activity) => (
                      <tr
                        key={activity._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.type === "upload"
                                ? "bg-blue-100 text-blue-800"
                                : activity.type === "analyze"
                                ? "bg-green-100 text-green-800"
                                : activity.type === "delete"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {activity.type}
                          </span>
                        </td>
                        <td className="p-4">{activity.description}</td>
                        <td className="p-4">
                          {format(
                            new Date(activity.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Files */}
        <section className="mt-14">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h3 className="text-2xl font-semibold text-indigo-700">
              Your Files
            </h3>
            <button
              onClick={refreshData}
              className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Refresh
            </button>
          </div>

          <div className="min-h-[250px]">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : filesLoading ? (
              <div className="text-center p-6 text-indigo-600 font-medium">
                Loading files...
              </div>
            ) : files.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-2xl text-center">
                <p className="text-gray-500 text-lg">No files uploaded yet.</p>
                <button
                  onClick={() => navigate("/excel-analytics")}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Upload Your First File
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-indigo-100 text-indigo-700 font-semibold">
                    <tr>
                      <th className="p-4">File Name</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Upload Date</th>
                      <th className="p-4">Last Analyzed</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr
                        key={file._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="p-4 font-medium">{file.originalName}</td>
                        <td className="p-4">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </td>
                        <td className="p-4">
                          {format(
                            new Date(file.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </td>
                        <td className="p-4">
                          {file.lastAnalyzed
                            ? format(
                                new Date(file.lastAnalyzed),
                                "MMM d, yyyy h:mm a"
                              )
                            : "Never"}
                        </td>
                        <td className="p-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleAnalyzeFile(file._id)}
                            className="text-blue-600 hover:text-blue-800 transition p-1 rounded hover:bg-blue-50"
                            title="Analyze File"
                          >
                            <AnalyticsIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file._id)}
                            className="text-red-500 hover:text-red-700 transition p-1 rounded hover:bg-red-50"
                            title="Delete File"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
