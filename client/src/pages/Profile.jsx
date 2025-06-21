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

    // Validate password fields if any are filled
    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        setLocalError(
          "All password fields are required when changing password"
        );
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setLocalError("New passwords do not match");
        return;
      }
    }

    try {
      await dispatch(
        updateUser({
          username: formData.username,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        })
      ).unwrap();

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setFormData({
        username: formData.username,
        email: formData.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setLocalError(error || "Failed to update profile");
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
      <Box sx={{ maxWidth: "lg", mx: "auto", p: 3 }}>
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
            borderRadius: 4,
            p: 4,
            mb: 4,
            color: "white",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              bgcolor: "rgba(255,255,255,0.2)",
              fontSize: "2rem",
            }}
          >
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {user?.username || "User"}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {user?.email || "user@example.com"}
          </Typography>
          <Chip
            label={user?.role || "User"}
            sx={{
              mt: 2,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>

        {/* Stats Section */}
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 3, color: "#1e293b" }}
        >
          Your Analytics Overview
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<CloudUploadIcon sx={{ fontSize: 40 }} />}
              title="Total Files"
              value={userStats?.totalFiles || 0}
              color="#4f46e5"
              loading={statsLoading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<AnalyticsIcon sx={{ fontSize: 40 }} />}
              title="Total Analyses"
              value={userStats?.totalAnalyses || 0}
              color="#10b981"
              loading={statsLoading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              icon={<ScheduleIcon sx={{ fontSize: 40 }} />}
              title="Last Active"
              value={
                userStats?.lastActive
                  ? format(new Date(userStats.lastActive), "MMM d")
                  : "Today"
              }
              color="#f59e0b"
              loading={statsLoading}
            />
          </Grid>
        </Grid>

        {/* Error and Success Messages */}
        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {localError || error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Profile Form Section */}
        <Card
          sx={{
            background: "white",
            borderRadius: 3,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#1e293b" }}
              >
                Profile Information
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      sx={{ borderColor: "#64748b", color: "#64748b" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            {isEditing && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 3, color: "#1e293b" }}
                >
                  🔐 Change Password
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              edge="end"
                            >
                              {showCurrentPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              edge="end"
                            >
                              {showNewPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </CardContent>
        </Card>

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
