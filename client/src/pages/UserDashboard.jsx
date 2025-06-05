import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as reduxLogout } from "../features/auth/authSlice"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { format } from "date-fns";

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

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

  // State for user activities and files
  const [activities, setActivities] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityLimit, setActivityLimit] = useState(5);

  useEffect(() => {
    fetchActivities();
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityLimit]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `/api/user/activities?limit=${activityLimit}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setActivities(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Error fetching activities");
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get("/api/user/files", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFiles(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching files:", error);
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
      setError("");
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Error deleting file");
    }
  };

  const handleAnalyzeFile = (fileId) => {
    navigate(`/excel-analytics?fileId=${fileId}`);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return <Box sx={{ display: "flex", alignItems: "center" }}>🔐</Box>;
      case "upload":
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CloudUploadIcon sx={{ fontSize: 18 }} />
          </Box>
        );
      case "analyze":
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AnalyticsIcon sx={{ fontSize: 18 }} />
          </Box>
        );
      case "delete":
        return <Box sx={{ display: "flex", alignItems: "center" }}>🗑️</Box>;
      default:
        return <Box sx={{ display: "flex", alignItems: "center" }}>📝</Box>;
    }
  };

  const handleActivityLimitChange = (event) => {
    setActivityLimit(event.target.value);
  };

  const handleLogout = () => {
    dispatch(reduxLogout());
    navigate("/login");
  };

  const features = [
    {
      title: "Excel Analytics",
      description: "Upload and analyze your Excel files with advanced analytics tools",
      icon: <TableChartIcon sx={{ fontSize: 60, color: "#4f46e5", mb: 2 }} />,
      onClick: () => navigate("/excel-analytics"),
    },
    {
      title: "Data Analysis",
      description: "Analyze your Excel data with powerful tools",
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: "Visualizations",
      description: "Create beautiful charts and graphs",
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar + Logout */}
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Excel Analytics Platform
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome + Features Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              color: "white",
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.username}!
            </Typography>
            <Typography variant="subtitle1">
              Here's an overview of your analytics and activities
            </Typography>
          </Paper>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Features
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      cursor: feature.onClick ? "pointer" : "default",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      p: 3,
                    }}
                    onClick={feature.onClick}
                    component={feature.onClick ? "button" : "div"}
                  >
                    {feature.icon}
                    <Typography variant="h6" component="h2" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Activities Section */}
        <Grid item xs={12} sx={{ mt: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Recent Activities</Typography>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="activity-limit-label">Show</InputLabel>
              <Select
                labelId="activity-limit-label"
                id="activity-limit"
                value={activityLimit}
                label="Show"
                onChange={handleActivityLimitChange}
                size="small"
              >
                <MenuItem value={5}>Last 5</MenuItem>
                <MenuItem value={10}>Last 10</MenuItem>
                <MenuItem value={20}>Last 20</MenuItem>
                <MenuItem value={50}>Last 50</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No activities found.
                    </TableCell>
                  </TableRow>
                )}
                {activities.map((activity) => (
                  <TableRow key={activity._id}>
                    <TableCell>
                      <Chip
                        icon={<span>{getActivityIcon(activity.type)}</span>}
                        label={activity.type}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{format(new Date(activity.createdAt), "MMM d, yyyy h:mm a")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Files Section */}
        <Grid item xs={12} sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Your Files
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : files.length === 0 ? (
            <Typography>No files uploaded yet.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Last Analyzed</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file._id}>
                      <TableCell>{file.originalName}</TableCell>
                      <TableCell>{(file.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                      <TableCell>{format(new Date(file.createdAt), "MMM d, yyyy h:mm a")}</TableCell>
                      <TableCell>
                        {file.lastAnalyzed ? format(new Date(file.lastAnalyzed), "MMM d, yyyy h:mm a") : "Never"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleAnalyzeFile(file._id)}
                          title="Analyze"
                        >
                          <AnalyticsIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteFile(file._id)}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
