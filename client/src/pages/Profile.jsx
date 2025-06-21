import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/auth/authActions";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { FaDatabase, FaChartBar, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(null);

  const stats = {
    totalFiles: 15,
    totalAnalyses: 27,
    lastActive: new Date(),
  };

  // Sync formData with user data
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser({
      username: formData.username,
      email: formData.email,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    }));
    setSuccess("Profile updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 py-12 px-4 pt-25">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Activity Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<FaDatabase />} title="Total Files" value={stats.totalFiles} color="text-indigo-600" />
          <StatCard icon={<FaChartBar />} title="Analyses" value={stats.totalAnalyses} color="text-sky-500" />
          <StatCard icon={<FaUser />} title="Last Active" value={format(new Date(stats.lastActive), "MMM d")} color="text-blue-500" />
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">{success}</div>}

        {isEditing && (
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-semibold mb-4">Edit Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Username"
                name="username"
                icon={<FaUser />}
                value={formData.username}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                icon={<FaEnvelope />}
                value={formData.email}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <hr className="my-4 border-t border-gray-300" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">🔐 Change Password</h4>
              </div>
              <InputField
                label="Current Password"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                icon={<FaLock />}
                value={formData.currentPassword}
                onChange={handleChange}
                toggleVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
                visible={showCurrentPassword}
              />
              <InputField
                label="New Password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                icon={<FaLock />}
                value={formData.newPassword}
                onChange={handleChange}
                toggleVisibility={() => setShowNewPassword(!showNewPassword)}
                visible={showNewPassword}
              />
              <InputField
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                icon={<FaLock />}
                value={formData.confirmPassword}
                onChange={handleChange}
                toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                visible={showConfirmPassword}
              />
            </div>

            {loading && <div className="text-indigo-500 mb-4 animate-pulse text-right">Updating profile...</div>}

            <div className="flex justify-end gap-4 mt-2">
              <button
                type="button"
                className="block px-4 py-2 rounded-[16px] text-[0.95rem] font-medium transition-all duration-200 hover:text-indigo-600 bg-indigo-100"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    username: user.username,
                    email: user.email,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`py-3 px-6 text-lg rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-900 hover:to-indigo-600 transition ${
                  loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {!isEditing && (
          <div className="text-right mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="py-3 px-6 text-lg rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-900 hover:to-indigo-600 transition"
            >
              ✏️ Edit Profile
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-xl p-5 shadow hover:shadow-md text-center"
  >
    <div className={`text-3xl mb-2 ${color}`}>{icon}</div>
    <div className="text-sm font-medium text-gray-500">{title}</div>
    <div className="text-xl font-bold text-gray-800">{value}</div>
  </motion.div>
);

const InputField = ({ label, name, type = "text", icon, value, onChange, toggleVisibility, visible }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col"
  >
    <label className="text-sm font-semibold mb-1 text-gray-700">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-300 transition-all duration-200">
      <div className="text-indigo-500 mr-2">{icon}</div>
      <input
        className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
      />
      {toggleVisibility && (
        <button type="button" onClick={toggleVisibility} className="text-gray-400 ml-2">
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  </motion.div>
);

export default Profile;
