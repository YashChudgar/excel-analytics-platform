// Converted from MUI to Tailwind CSS with same content, improved layout and animations
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as reduxLogout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { format } from "date-fns";

import MenuIcon from "@mui/icons-material/Menu";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityLimit, setActivityLimit] = useState(5);

  useEffect(() => {
    fetchActivities();
    fetchFiles();
  }, [activityLimit]);

  const fetchActivities = async () => {
  try {
    const response = await axios.get(
      `/api/user/activities?limit=${activityLimit}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = response.data;
    // Log to debug structure
    console.log("Activities response:", data);

    // Assume it may return { activities: [...] } or just [...]
    if (Array.isArray(data)) {
      setActivities(data);
    } else if (Array.isArray(data.activities)) {
      setActivities(data.activities);
    } else {
      setActivities([]);
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
    setError("Error fetching activities");
    setActivities([]);
  }
};


  const fetchFiles = async () => {
    try {
      const response = await axios.get("/api/user/files", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFiles(response.data);
    } catch (error) {
      setError("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`/api/user/files/${fileId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchFiles();
      fetchActivities();
    } catch {
      setError("Error deleting file");
    }
  };

  const handleAnalyzeFile = (fileId) => {
    navigate(`/excel-analytics?fileId=${fileId}`);
  };

  const features = [
    {
      title: "Excel Analytics",
      description: "Upload and analyze your Excel files with advanced analytics tools",
      icon: <TableChartIcon className="text-indigo-600 w-12 h-12 mb-2" />,
      onClick: () => navigate("/excel-analytics"),
    },
    {
      title: "Data Analysis",
      description: "Analyze your Excel data with powerful tools",
      icon: <AnalyticsIcon className="w-10 h-10" />,
    },
    {
      title: "Visualizations",
      description: "Create beautiful charts and graphs",
      icon: <BarChartIcon className="w-10 h-10" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MenuIcon />
            <h1 className="text-xl font-semibold">Excel Analytics Platform</h1>
          </div>
          <button
            onClick={() => {
              dispatch(reduxLogout());
              navigate("/login");
            }}
            className="bg-white text-indigo-700 px-4 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h2>
          <p className="text-lg">Here's an overview of your analytics and activities</p>
        </motion.div>

        <h3 className="text-2xl font-semibold mt-10 mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 bg-white rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl transition duration-300 ${feature.onClick ? 'cursor-pointer' : ''}`}
              onClick={feature.onClick}
            >
              {feature.icon}
              <h4 className="text-lg font-bold mt-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <section className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Recent Activities</h3>
            <select
              value={activityLimit}
              onChange={(e) => setActivityLimit(e.target.value)}
              className="border rounded px-3 py-1"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  Last {num}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
                <tbody>
  {!Array.isArray(activities) || activities.length === 0 ? (
    <tr>
      <td colSpan="3" className="text-center p-4">
        No activities found.
      </td>
    </tr>
  ) : (
    activities.map((activity) => (
      <tr key={activity._id} className="hover:bg-gray-50">
        <td className="p-3 flex items-center gap-2">{activity.type}</td>
        <td className="p-3">{activity.description}</td>
        <td className="p-3">
          {format(new Date(activity.createdAt), "MMM d, yyyy h:mm a")}
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Your Files</h3>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="loader">Loading...</div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
          ) : files.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">File Name</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Upload Date</th>
                    <th className="p-3">Last Analyzed</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file._id} className="hover:bg-gray-50">
                      <td className="p-3">{file.originalName}</td>
                      <td className="p-3">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                      <td className="p-3">{format(new Date(file.createdAt), "MMM d, yyyy h:mm a")}</td>
                      <td className="p-3">{file.lastAnalyzed ? format(new Date(file.lastAnalyzed), "MMM d, yyyy h:mm a") : "Never"}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleAnalyzeFile(file._id)}
                          className="text-blue-600 hover:underline"
                        >
                          <AnalyticsIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file._id)}
                          className="text-red-600 hover:underline"
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
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
