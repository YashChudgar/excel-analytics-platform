import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Button
} from "@mui/material";
import Logo from "./Logo";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HistoryIcon from "@mui/icons-material/History";
import InsightsIcon from "@mui/icons-material/Insights";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../features/auth/authSlice"; // adjust path


const sidebarItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Upload Excel", icon: <CloudUploadIcon />, path: "/excel-analytics" },
  { text: "History", icon: <HistoryIcon />, path: "/history" },
  { text: "AI Insights", icon: <InsightsIcon />, path: "/ai-insights" },
  { text: "Chat With File", icon: <ChatIcon />, path: "/chat" },
  { text: "Profile", icon: <PersonIcon />, path: "/profile" },
];


const sidebarWidth = 250;

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


const handleLogout = () => {
  dispatch(logoutAction());
  navigate("/"); // or redirect to login
};

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarWidth,
            boxSizing: "border-box",
            background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
            color: "#fff",
            border: "none",
            borderTopRightRadius: 32,
            borderBottomRightRadius: 32,
            boxShadow: "2px 0 16px 0 rgba(79,70,229,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            minHeight: "100vh",
          },
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 4 }}
        >
          <Logo size={44} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, letterSpacing: 1, color: "#fff" }}
          >
            Excellytics
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mx: 2, mb: 2 }} />
        <List sx={{ flex: 1 }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                my: 0.5,
                mx: 2,
                borderRadius: 2,
                background: location.pathname === item.path ? "#fff" : "none",
                fontWeight: location.pathname === item.path ? 700 : 500,
                color: location.pathname === item.path ? "#4f46e5" : "#fff",
                cursor: "pointer",
                "&:hover": {
                  background:
                    location.pathname === item.path
                      ? "#fff"
                      : "rgba(255,255,255,0.10)",
                  color: "#000",
                },
                transition: "background 0.2s, color 0.2s",
                minHeight: 44,
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? "#4f46e5" : "#fff",
                  minWidth: 36,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 700 : 500,
                }}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mx: 2, my: 2 }} />

<Box sx={{ px: 3, pb: 4 }}>
  <Button
    variant="contained"
    fullWidth
    onClick={handleLogout}
    startIcon={<LogoutIcon />}
    sx={{
      background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
      color: "#fff",
      fontWeight: 600,
      textTransform: "none",
      borderRadius: 2,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      "&:hover": {
        background: "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)",
      },
    }}
  >
    Logout
  </Button>
</Box>

      </Drawer>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 4,
          mt: 2,
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
