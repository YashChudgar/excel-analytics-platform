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
import axios from "axios";

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
        const response = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        setStats({ totalUsers: data.totalUsers, activeUsers: data.activeUsers });
        setUserGrowthData(data.userGrowthData);
        setUserDistributionData(data.userDistributionData);
        setUsersList(data.users);
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
        const response = await axios.delete(
          `http://localhost:5000/api/admin/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsersList(usersList.filter((user) => user.id !== userId));
        setSuccessMessage("User deleted successfully!");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete user");
      }
    }
  };

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <motion.div
        className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-xl shadow-lg mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-semibold mb-1">Welcome back, {user?.username}!</h1>
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl"
            >
              <p className="text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold">{stats.totalUsers || "N/A"}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl"
            >
              <p className="text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold">{stats.activeUsers || "N/A"}</p>
            </motion.div>
            <div></div>
          </div>

          {/* Charts */}
          <div className="py-20 px-4 bg-white">
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
          <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* User Distribution Chart */}
  <div className="max-w-4xl mx-auto">
    <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
      Active vs Inactive Users
    </h3>
    <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={userDistributionData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={true}
          >
            {userDistributionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} users`, name]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

          {/* User Management */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <SearchIcon className="absolute top-2.5 left-3 text-gray-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="py-2 px-4">ID</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Role</th>
                    <th className="py-2 px-4">Last Activity</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{user.id}</td>
                      <td className="py-2 px-4">{user.name}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2 px-4">{user.lastActivity}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
