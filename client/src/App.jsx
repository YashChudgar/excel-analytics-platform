import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { useSelector } from "react-redux";
import theme from "./theme";

import Navbar from "./components/Navbar";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ExcelAnalytics from "./pages/ExcelAnalytics";
import Profile from "./pages/Profile";
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';

// Components & routes
import Unauthorized from "./components/Unauthorized";
import UserManagement from "./pages/UserManagement";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <Box sx={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<RoleBasedDashboard />} />
                <Route path="/user-route" element={<UserRoute />} />
                <Route path="/excel-analytics" element={<ExcelAnalytics />} />
                <Route path="/admin/users" element={<UserManagement /> } />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin-only routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Catch-all NotFound */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
    </ThemeProvider>
  );
}

// Role-based dashboard component using Redux
const RoleBasedDashboard = () => {
  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }
  return <UserDashboard />;
};

export default App;