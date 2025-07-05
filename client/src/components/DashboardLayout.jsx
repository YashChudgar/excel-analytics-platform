import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "./Logo";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HistoryIcon from "@mui/icons-material/History";
import InsightsIcon from "@mui/icons-material/Insights";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../features/auth/authSlice";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 4 }}>
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
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                my: 0.5,
                mx: 2,
                borderRadius: 2,
                background: location.pathname === item.path ? "#fff" : "none",
                fontWeight: location.pathname === item.path ? 700 : 500,
                color: location.pathname === item.path ? "#4f46e5" : "#fff",
                "&:hover": {
                  background:
                    location.pathname === item.path
                      ? "#fff"
                      : "rgba(255,255,255,0.10)",
                  color: "#000",
                },
                transition: "background 0.2s, color 0.2s",
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path ? "#4f46e5" : "#fff",
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
            </ListItemButton>
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
    </Box>
  );

 return (
  <Box sx={{ display: "flex", minHeight: "100vh" }}>
    {/* Responsive Drawer */}
    <Box
      component="nav"
      sx={{ width: { md: sidebarWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: sidebarWidth,
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              color: "#fff",
              borderTopRightRadius: 32,
              borderBottomRightRadius: 32,
              boxShadow: "2px 0 16px 0 rgba(79,70,229,0.08)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
            color: "#fff",
            borderTopRightRadius: 32,
            borderBottomRightRadius: 32,
            boxShadow: "2px 0 16px 0 rgba(79,70,229,0.08)",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>

    {/* Main Content */}
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        pt: 4,
        mt: 2,
        width: { sm: `calc(100% - ${sidebarWidth}px)` },
        position: "relative",
      }}
    >
      {/* Attractive Hamburger Menu Icon (Visible only if Drawer is closed) */}
      {isMobile && !mobileOpen && (
        <Box sx={{ position: "fixed", top: 8, left: 15, zIndex: 1300 }}>
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                color: "#fff",
                borderRadius: "50%",
                width: 44,
                height: 44,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                },
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </motion.div>
        </Box>
      )}

      {children}
    </Box>
  </Box>
);


};

export default DashboardLayout;

