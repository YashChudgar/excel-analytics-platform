import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
// import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import axios from "axios";

const AdminDashboard = () => {
  // const { user } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({});
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userDistributionData, setUserDistributionData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const COLORS = ["#0088FE", "#FF8042", "#00C49F"]; // Default colors, can potentially use theme colors here too

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        // Using explicit URL for now, can be changed later if a proxy is set up
        const response = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        console.log("Admin dashboard data received:", data);
        setStats({
          totalUsers: data.totalUsers,
          activeUsers: data.activeUsers,
        });
        setUserGrowthData(data.userGrowthData);
        setUserDistributionData(data.userDistributionData);
        setUsersList(data.users);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
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
        setError(null); // Clear previous errors
        setSuccessMessage(null); // Clear previous success messages
        const response = await axios.delete(
          `http://localhost:5000/api/admin/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Delete user response:", response.data);
        // Remove the deleted user from the list
        setUsersList(usersList.filter((user) => user.id !== userId));
        setSuccessMessage("User deleted successfully!");
      } catch (err) {
        console.error("Failed to delete user:", err);
        setError(err.response?.data?.error || "Failed to delete user");
      }
    }
  };

  // Filter users based on search query
  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by ID
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) // Search by Role
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)", // User dashboard theme color
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
              Manage your platform and monitor analytics
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats, Charts, and User Management Section - Render only when not loading and no error */}
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : error ? (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ mt: 4 }}>
              {error}
            </Alert>
          </Grid>
        ) : (
          <>
            {/* Quick Stats Section */}
            <Grid item xs={12} container spacing={3}>
              {" "}
              {/* Use a container grid for quick stats */}
              <Grid item xs={12} md={4}>
                {" "}
                {/* Total Users Card - md=4 for width */}
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalUsers || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                {" "}
                {/* Active Users Card - md=4 for width */}
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Active Users
                    </Typography>
                    <Typography variant="h4">
                      {stats.activeUsers || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Empty Grid items to maintain layout */}
              <Grid item xs={12} md={4}></Grid>
              <Grid item xs={12} md={4}></Grid>
            </Grid>

            {/* Charts and User Management Section */}
            <Grid item xs={12} container spacing={3} sx={{ mt: 2 }}>
              {" "}
              {/* Use a nested grid for charts and table */}
              {/* User Growth Chart */}
              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    User Growth
                  </Typography>
                  <ResponsiveContainer>
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="users"
                        fill="#4f46e5"
                        name="Total Users"
                      />{" "}
                      {/* User dashboard primary color */}
                      <Bar
                        dataKey="active"
                        fill="#3730a3"
                        name="Active Users"
                      />{" "}
                      {/* User dashboard darker primary color */}
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              {/* User Distribution */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    User Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
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
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              {/* User Management Section */}
              <Grid item xs={12}>
                {" "}
                {/* Full width for the table */}
                <Paper sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">User Management</Typography>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Last Activity</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Chip
                                label={user.role}
                                color={
                                  user.role === "admin" ? "primary" : "default"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{user.lastActivity}</TableCell>
                            <TableCell>
                              <Chip
                                label={user.status}
                                color={
                                  user.status === "active" ? "success" : "error"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
