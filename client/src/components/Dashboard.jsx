// src/components/Dashboard.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import AnalyticsIcon from "@mui/icons-material/Analytics";


const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
  };
  const features = [
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
    {
      title: "Data Tables",
      description: "View and manage your data in tables",
      icon: <TableChartIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.username}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Your Excel data analytics dashboard
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        transition: "transform 0.2s ease-in-out",
                      },
                    }}
                  >
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard;
