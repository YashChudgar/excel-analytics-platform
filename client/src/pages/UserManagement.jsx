import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
import DashboardLayout from "../components/DashboardLayout";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.3 } },
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, newUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", role: "user" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data.users);
      setStats({
        totalUsers: res.data.stats.total,
        activeUsers: res.data.stats.active,
        newUsers: res.data.users.filter(
          (u) => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
      });
    } catch {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role });
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/users/${userToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess("User deleted successfully");
      setUserToDelete(null);
      setOpenDeleteDialog(false);
      fetchUsers();
    } catch {
      setError("Failed to delete user");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        `/admin/users/${selectedUser._id}`,
        {
        username: formData.username,
        email: formData.email,
        role: "user", // 🔐 Force role to 'user'
      });
      setSuccess("User updated successfully");
      setOpenDialog(false);
      fetchUsers();
    } catch {
      setError("Failed to update user");
    }
  };

  const StatCard = ({ icon: Icon, title, value, bg }) => (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r ${bg} text-white p-5 rounded-2xl shadow-md`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <Icon className="w-6 h-6" />
        <h4 className="text-lg font-semibold">{title}</h4>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 pt-0">
        <motion.div {...fadeIn}>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">User Management</h1>
          <p className="text-gray-500 mb-6">Monitor and manage all users within the platform.</p>
        </motion.div>

        {error && <motion.div {...fadeIn} className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</motion.div>}
        {success && <motion.div {...fadeIn} className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</motion.div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard icon={UserIcon} title="Total Users" value={stats.totalUsers} bg="from-indigo-600 to-indigo-500" />
          <StatCard icon={EnvelopeIcon} title="Active Users" value={stats.activeUsers} bg="from-sky-500 to-blue-400" />
          <StatCard icon={CalendarDaysIcon} title="New Users (7d)" value={stats.newUsers} bg="from-emerald-500 to-green-400" />
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading...</div>
          ) : (
            <motion.table className="w-full text-left border-collapse" {...fadeIn}>
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.tr key={user._id} {...fadeIn} exit={{ opacity: 0 }}>
                      <td className="p-4">{user.username}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4 capitalize">{user.role}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-sm rounded-full ${
                            user.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 space-x-2">
                        <button onClick={() => handleEdit(user)} className="cursor-pointer text-blue-500 hover:text-blue-700">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setOpenDeleteDialog(true);
                          }}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </motion.table>
          )}
        </div>

        {/* Edit Dialog */}
        <AnimatePresence>
  {openDialog && (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 max-h-screen overflow-y-auto"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <h2 className="text-xl font-bold mb-2 text-indigo-700">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-text"
            required
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-text"
            required
          />
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setOpenDialog(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

        {/* Delete Dialog */}
        <AnimatePresence>
  {openDeleteDialog && (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 max-h-screen overflow-y-auto"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <h2 className="text-xl font-bold text-red-600 mb-2">Confirm Deletion</h2>
        <p className="text-gray-700">
          Are you sure you want to delete <strong>{userToDelete?.username}</strong>?
        </p>
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={() => setOpenDeleteDialog(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
      </DashboardLayout>
  );
};

export default UserManagement;
