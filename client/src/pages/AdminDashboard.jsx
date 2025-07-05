// AdminDashboardTailwind.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../components/DashboardLayout";

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({});
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userDistributionData, setUserDistributionData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        setStats({
          totalUsers: data.totalUsers || 0,
          activeUsers: data.activeUsers || 0,
        });
        setUserGrowthData(data.userGrowthData || []);
        setUserDistributionData(data.userDistributionData || []);
        setUsersList(data.users || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsersList((prev) => prev.filter((user) => user._id !== userId));
        setSuccessMessage("User deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete user");
      }
    }
  };

  const filteredUsers = usersList.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
    <div className="max-w-7xl mx-auto px-4 py-6 pt-0">
      <motion.div
        className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-xl shadow-lg mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-semibold mb-1">Welcome {user?.username}!</h1>
        <p className="text-sm">Manage your platform and monitor analytics</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
      ) : (
        <>
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center font-medium">
              {successMessage}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl"
            >
              <p className="text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold">{stats.totalUsers}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl"
            >
              <p className="text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold">{stats.activeUsers}</p>
            </motion.div>
            <div />
          </div>

          {/* Charts */}
          <div className="py-20 px-4 bg-white rounded-xl mb-6 shadow">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
              User Analytics Overview
            </h2>

            {/* User Growth Chart */}
            <div className="mb-16 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                User Growth Over Time
              </h3>
              <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#6366f1"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="w-full max-w-4xl mx-auto px-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Active vs Inactive Users
              </h3>
              <div className="bg-gray-50 rounded-2xl shadow-lg sm:p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      innerRadius="45%"
                      dataKey="value"
                      label
                      labelLine={window.innerWidth >= 768}
                    >
                      {userDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
      layout={window.innerWidth < 768 ? "horizontal" : "vertical"}
      verticalAlign={window.innerWidth < 768 ? "bottom" : "middle"}
      align={window.innerWidth < 768 ? "center" : "right"}
      iconType="circle"
    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* User Management */}
<motion.div
  className="bg-gradient-to-br from-white via-indigo-50 to-indigo-100 p-8 rounded-2xl shadow-2xl mt-10 flex flex-col items-center text-center transition-all duration-300 w-full sm:w-4/5 md:w-3/5 mx-auto"
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  whileHover={{ scale: 1.02 }}
>
  <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-2">
    User Management
  </h2>
  <p className="text-gray-600 mb-5 text-sm sm:text-base px-4">
    Manage user accounts, roles, and permissions with ease.
  </p>
  <motion.a
    href="/admin/users"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
  >
    Go to User Management
  </motion.a>
</motion.div>

        </>
      )}
    </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
