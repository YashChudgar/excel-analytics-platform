import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
// import { useAuth } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { logout , updateUser } from "../features/auth/authSlice";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SecurityIcon from "@mui/icons-material/Security";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import StorageIcon from "@mui/icons-material/Storage";
import { format } from "date-fns";

const Profile = () => {
  // const { user, updateUser } = useAuth();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalAnalyses: 0,
    lastActive: new Date(),
  });
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

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username,
        email: user.email,
      }));
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form data
      if (!formData.username || !formData.email) {
        setError("Username and email are required");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Validate passwords if changing password
      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          setError("New password must be at least 6 characters long");
          setLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError("New passwords do not match");
          setLoading(false);
          return;
        }
        if (!formData.currentPassword) {
          setError("Current password is required to change password");
          setLoading(false);
          return;
        }
      }

      // Prepare update data
      const updateData = {
        username: formData.username,
        email: formData.email,
      };

      // Only include password fields if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.patch(
        "http://localhost:5000/api/auth/profile",
        updateData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // updateUser(response.data);
      dispatch(updateUser(response.data));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.response?.data?.error || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: "white",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        pt: 6,
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: "100%",
                background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "primary.main",
                    fontSize: "3rem",
                    mx: "auto",
                    mb: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h4" gutterBottom>
                  {user?.username}
                </Typography>
                <Chip
                  icon={<SecurityIcon />}
                  label={user?.role?.toUpperCase()}
                  color={user?.role === 'admin' ? 'primary' : 'default'}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Stack spacing={1} sx={{ width: '100%' }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                     <PersonIcon color="action" sx={{ mr: 1 }} />
                     <Typography variant="body1" color="text.secondary">Username: {user?.username}</Typography>
                   </Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                     <EmailIcon color="action" sx={{ mr: 1 }} />
                     <Typography variant="body1" color="text.secondary">Email: {user?.email}</Typography>
                   </Box>
                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                     <Typography variant="body1" color="text.secondary">
                       Last Login: {user?.lastLogin ? format(new Date(user.lastLogin), 'PPPpp') : 'Never logged in'}
                     </Typography>
                   </Box>
                </Stack>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
                fullWidth
                sx={{ mt: "auto" }}
              >
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </Button>
            </Paper>
          </Grid>

          {/* Main Content Section */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
                borderRadius: 2,
              }}
            >
              {/* Stats Section */}
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Activity Overview
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <StatCard
                    icon={<StorageIcon />}
                    title="Total Files"
                    value={stats.totalFiles}
                    color="#4f46e5"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StatCard
                    icon={<AnalyticsIcon />}
                    title="Analyses"
                    value={stats.totalAnalyses}
                    color="#0ea5e9"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StatCard
                    icon={<PersonIcon />}
                    title="Last Active"
                    value={format(new Date(stats.lastActive), "MMM d")}
                    color="#10b981"
                  />
                </Grid>
              </Grid>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              {isEditing && (
                <form onSubmit={handleSubmit}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Edit Profile Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
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
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Change Password
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
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
                              <SecurityIcon color="action" />
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
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                                edge="end"
                              >
                                {showNewPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                edge="end"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData((prev) => ({
                              ...prev,
                              username: user.username,
                              email: user.email,
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            }));
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          startIcon={loading && <CircularProgress size={20} />}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Profile;
