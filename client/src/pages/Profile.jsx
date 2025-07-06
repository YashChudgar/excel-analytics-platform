import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/auth/authActions";
import { format } from "date-fns";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../components/DashboardLayout";
import {
  Avatar,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as CloudUploadIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
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
  const [localError, setLocalError] = useState(null);

  // Fetch user stats from backend
  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axiosInstance.get("/user/stats");
      setUserStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setLocalError("Failed to load user statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

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
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");

    // 🔒 Validate password fields if any are filled
  const {
    username,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
  } = formData;
  
    // Validate password fields if any are filled
    
  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setLocalError("All password fields are required when changing password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("New passwords do not match");
      return;
    }
  }

    const payload = {
    username,
    email,
  };

 if (currentPassword && newPassword && confirmPassword) {
    payload.currentPassword = currentPassword;
    payload.newPassword = newPassword;
    payload.confirmPassword = confirmPassword;
  }

try {
    const res = await dispatch(updateUser(payload)).unwrap();

    setSuccess(res.message || "Profile updated successfully");
    setIsEditing(false);
    setFormData({
      username,
      email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update profile";
    setLocalError(msg);
  }
};

  const handleCancel = () => {
    setIsEditing(false);
    setLocalError(null);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const StatCard = ({ icon, title, value, color, loading }) => (
    <Card
      sx={{
        height: "100%",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        border: "1px solid #e2e8f0",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        },
        transition: "all 0.3s ease",
      }}
    >
      <CardContent sx={{ textAlign: "center", p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            color: color,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 1, color: "#1e293b" }}
        >
          {loading ? <CircularProgress size={24} /> : value}
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: "lg", mx: "auto", p: 3, pt:0 }}>
        {/* Header Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-6 mb-8 text-white text-center">
  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center text-3xl font-semibold">
    {user?.username?.charAt(0)?.toUpperCase() || "U"}
  </div>
  <h2 className="text-2xl font-bold">{user?.username || "User"}</h2>
  <p className="text-white/90">{user?.email || "user@example.com"}</p>
  <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full font-semibold text-sm">
    {user?.role || "User"}
  </span>
</div>

        {/* Stats Section */}
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Your Analytics Overview</h3>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
  <StatCard
    icon={<CloudUploadIcon className="text-4xl" />}
    title="Total Files"
    value={userStats?.totalFiles || 0}
    color="#4f46e5"
    loading={statsLoading}
  />
  <StatCard
    icon={<AnalyticsIcon className="text-4xl" />}
    title="Total Analyses"
    value={userStats?.totalAnalyses || 0}
    color="#10b981"
    loading={statsLoading}
  />
  <StatCard
    icon={<ScheduleIcon className="text-4xl" />}
    title="Last Active"
    value={
      userStats?.lastActive
        ? format(new Date(userStats.lastActive), "MMM d")
        : "Today"
    }
    color="#f59e0b"
    loading={statsLoading}
  />
</div>

        {/* Error and Success Messages */}
        {(error || localError) && (
  <div className="mb-4 text-sm p-4 bg-red-100 border border-red-300 rounded text-red-800">
    {localError || error}
  </div>
)}

{success && (
  <div className="mb-4 text-sm p-4 bg-green-100 border border-green-300 rounded text-green-800">
    {success}
  </div>
)}

        {/* Profile Form Section */}
<div className="bg-white rounded-2xl shadow-md overflow-visible p-6">
  {/* Header with Edit / Save / Cancel Buttons */}
  <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
    <h4 className="text-xl font-bold text-slate-800">Profile Information</h4>

    <div className="flex gap-2">
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold px-4 py-2 rounded-md hover:from-indigo-800 hover:to-indigo-600 transition"
        >
          <EditIcon className="mr-2" /> Edit Profile
        </button>
      ) : (
        <>
          <button
            onClick={handleCancel}
            className="cursor-pointer border border-slate-400 text-slate-600 px-4 py-2 rounded-md"
          >
            <CancelIcon className="mr-1" /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold px-4 py-2 rounded-md hover:from-emerald-700 hover:to-emerald-500 transition"
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <>
                <SaveIcon className="mr-1" /> Save Changes
              </>
            )}
          </button>
        </>
      )}
    </div>
  </div>

  {/* Profile Inputs */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
      <div className="flex items-center border rounded px-3 py-2 shadow-sm">
        <PersonIcon className="text-slate-500 mr-2" />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full outline-none bg-transparent"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <div className="flex items-center border rounded px-3 py-2 shadow-sm">
        <EmailIcon className="text-slate-500 mr-2" />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full outline-none bg-transparent"
        />
      </div>
    </div>
  </div>

  {/* Password Fields */}
  {isEditing && (
    <>
      <hr className="my-6 border-gray-300" />
      <h5 className="text-lg font-semibold text-slate-800 mb-4">🔐 Change Password</h5>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <div className="flex items-center border rounded px-3 py-2 shadow-sm">
            <LockIcon className="text-slate-500 mr-2" />
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="ml-2"
            >
              {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="flex items-center border rounded px-3 py-2 shadow-sm">
            <LockIcon className="text-slate-500 mr-2" />
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="ml-2"
            >
              {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <div className="flex items-center border rounded px-3 py-2 shadow-sm">
            <LockIcon className="text-slate-500 mr-2" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="ml-2"
            >
              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
        </div>
      </div>
    </>
  )}
</div>

        {/* Refresh Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUserStats}
            disabled={statsLoading}
            sx={{
              borderColor: "#4f46e5",
              color: "#4f46e5",
              "&:hover": {
                borderColor: "#3730a3",
                backgroundColor: "rgba(79, 70, 229, 0.04)",
              },
            }}
          >
            Refresh Stats
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Profile;
