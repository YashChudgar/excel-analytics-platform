import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from "@mui/material";
import { format } from "date-fns";
import axiosInstance from "../api/axiosInstance";
import DashboardLayout from "../components/DashboardLayout";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const themeColor = "#4f46e5";

const iconBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "8px",
  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
};

const History = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityLimit, setActivityLimit] = useState(5);

  useEffect(() => {
    fetchActivities();
  }, [activityLimit]);

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/activities?limit=${activityLimit}`
      );
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Error fetching activities");
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return <Box sx={{ display: "flex", alignItems: "center" }}>🔐</Box>;
      case "upload":
        return (
          <Box sx={iconBoxStyle}>
            <CloudUploadIcon sx={{ color: themeColor, fontSize: 18 }} />
          </Box>
        );
      case "analyze":
        return (
          <Box sx={iconBoxStyle}>
            <AnalyticsIcon sx={{ color: themeColor, fontSize: 18 }} />
          </Box>
        );
      case "delete":
        return <Box sx={{ display: "flex", alignItems: "center" }}>🗑️</Box>;
      default:
        return <Box sx={{ display: "flex", alignItems: "center" }}>📝</Box>;
    }
  };

  const getChipStyle = (type) => {
    if (type === "upload" || type === "analyze") {
      return {
        color: themeColor,
        borderColor: themeColor,
        fontWeight: 600,
        background: "#f5f7ff",
      };
    }
    return {};
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 7, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Recent Activities
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="activity-limit-label">Show</InputLabel>
            <Select
              labelId="activity-limit-label"
              id="activity-limit"
              value={activityLimit}
              label="Show"
              onChange={(e) => setActivityLimit(e.target.value)}
            >
              <MenuItem value={5}>Last 5</MenuItem>
              <MenuItem value={10}>Last 10</MenuItem>
              <MenuItem value={20}>Last 20</MenuItem>
              <MenuItem value={50}>Last 50</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
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
                {activities.map((activity) => (
                  <TableRow key={activity._id}>
                    <TableCell>
                      <Chip
                        icon={getActivityIcon(activity.type)}
                        label={activity.type}
                        color={
                          activity.type === "upload" ||
                          activity.type === "analyze"
                            ? "default"
                            : "primary"
                        }
                        variant="outlined"
                        sx={getChipStyle(activity.type)}
                      />
                    </TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>
                      {format(
                        new Date(activity.createdAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default History;
