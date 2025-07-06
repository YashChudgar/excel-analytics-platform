import React, { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  useMediaQuery,
  useTheme,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import Logo from "./Logo";
import { logout as logoutAction } from "../features/auth/authSlice"; // Adjust path as per your redux slice


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Get user from redux state
  const user = useSelector((state) => state.auth.user);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    dispatch(logoutAction()); // Dispatch logout action to Redux
    handleCloseUserMenu();
    navigate("/");
  };

  const loggedOutNavItems = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/#features" },
  ];

  const loggedInNavItems = [{ label: "Dashboard", path: "/dashboard" }];

  const isAdminDashboard = location.pathname === "/admin-dashboard";
  
  const [showNavbar, setShowNavbar] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (!isAuthPage) {
    setShowNavbar(true); // always show navbar on other pages
    return;
  }

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 10) {
      setShowNavbar(true);
    } else if (currentScrollY > lastScrollY) {
      setShowNavbar(false); // scroll down
    } else {
      setShowNavbar(true); // scroll up
    }

    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);

//navbar should be visible only on landing page
const allowedPaths = ["/", "/login", "/register","/forgot-password","/unauthorized","/about","/careers","/contact"];
const isVisiblePage = allowedPaths.includes(location.pathname);
if (!isVisiblePage) return null;


  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
  top: 0,
  left: 0,
  right: 0,
  transform:
    location.pathname === "/login" || location.pathname === "/register"
      ? (showNavbar ? "translateY(0%)" : "translateY(-100%)")
      : "translateY(0%)",
  transition: "transform 0.3s ease-in-out",
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  zIndex: 1201,
}}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 70 },
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Logo for desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              cursor: "pointer",
              mr: 4,
            }}
            onClick={() => navigate(user ? "/dashboard" : "/")}
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Logo size={44} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.5rem",
              }}
            >
              Excellytics
            </Typography>
          </Box>

          {/* Mobile menu */}
          
          {/* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiPaper-root": {
                  borderRadius: 2,
                  mt: 1.5,
                  minWidth: 180,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {(user ? loggedInNavItems : loggedOutNavItems)
                .filter(
                  (item) =>
                    !isAdminDashboard ||
                    (item.path !== "/dashboard" &&
                      item.path !== "/excel-analytics")
                )
                .map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&.Mui-selected": {
                        backgroundColor: "rgba(79, 70, 229, 0.08)",
                        "&:hover": {
                          backgroundColor: "rgba(79, 70, 229, 0.12)",
                        },
                      },
                    }}
                  >
                    <Typography textAlign="center">{item.label}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box> */}

          {/* Logo for mobile */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate(user ? "/dashboard" : "/")}
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Logo size={36} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.25rem",
              }}
            >
              Excellytics
            </Typography>
          </Box>

          {/* Desktop menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              ml: 4,
              gap: 1,
            }}
          ></Box>

          {/* Auth buttons or user menu */}
          {user ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexGrow: 0,
              }}
            >
              {/* User info and logout */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {loggedInNavItems
                  .filter(
                    (item) =>
                      !isAdminDashboard ||
                      (item.path !== "/dashboard" &&
                        item.path !== "/excel-analytics")
                  )
                  .map((item) => (
                    <Button
                      key={item.label}
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        my: 2,
                        color: "text.primary",
                        display: "block",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        transition: "all 0.2s",
                        "&:hover": {
                          color: "primary.main",
                          backgroundColor: "rgba(79, 70, 229, 0.08)",
                        },
                        ...(location.pathname === item.path && {
                          color: "primary.main",
                          backgroundColor: "rgba(79, 70, 229, 0.08)",
                        }),
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Button
                    key="profile-button"
                    onClick={() => navigate("/profile")}
                    sx={{
                      my: 2,
                      color: "text.primary",
                      display: "block",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      transition: "all 0.2s",
                      "&:hover": {
                        color: "primary.main",
                        backgroundColor: "rgba(79, 70, 229, 0.08)",
                      },
                      ...(location.pathname === "/profile" && {
                        color: "primary.main",
                        backgroundColor: "rgba(79, 70, 229, 0.08)",
                      }),
                    }}
                  >
                    Profile
                  </Button>

                  <Button
                    key="logout-button"
                    onClick={handleLogout}
                    variant="contained"
                    sx={{
                       display: { xs: "none", sm: "block" },
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                  fontWeight: 500,
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                    boxShadow: "0 6px 20px rgba(79, 70, 229, 0.35)",
                  },
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
  sx={{
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 2, // spacing between buttons
    justifyContent: "center", // center buttons
    flexShrink: 0,
    flexGrow: 0,
    width: "100%",
    overflowX: "auto", // prevent overflow issues on tiny screens
    // pr: { xs: 2, sm: 0 },
  }}
>
  <Button
    variant="outlined"
    onClick={() => navigate("/login")}
    sx={{
      fontSize: { xs: "0.8rem", sm: "0.95rem" },
      px: { xs: 2, sm: 3 },
      py: { xs: 1, sm: 1 },
      borderRadius: 2,
      fontWeight: 500,
      borderWidth: 2,
      textTransform: "none",
      whiteSpace: "nowrap", // prevent breaking into new lines
    }}
  >
    Log In
  </Button>

  <Button
    variant="contained"
    onClick={() => navigate("/register")}
    sx={{
      fontSize: { xs: "0.8rem", sm: "0.95rem" },
      px: { xs: 2, sm: 3 },
      py: { xs: 1, sm: 1 },
      borderRadius: 2,
      fontWeight: 500,
      background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
      boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
      textTransform: "none",
      whiteSpace: "nowrap",
      "&:hover": {
        background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
        boxShadow: "0 6px 20px rgba(79, 70, 229, 0.35)",
      },
    }}
  >
    Register
  </Button>
</Box>


            // <Box sx={{ display: "flex", gap: 2 }}>
            //   <Button
            //     variant="outlined"
            //     onClick={() => navigate("/login")}
            //     sx={{
            //       display: "block",
            //       borderRadius: 2,
            //       px: 3,
            //       py: 1,
            //       borderWidth: 2,
            //       fontWeight: 500,
            //       "&:hover": {
            //         borderWidth: 2,
            //       },
            //     }}
            //   >
            //     Log In
            //   </Button>
            //   <Button
            //     variant="contained"
            //     onClick={() => navigate("/register")}
            //     sx={{
            //       display: "block",
            //       borderRadius: 2,
            //       px: 3,
            //       py: 1,
            //       background:
            //         "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
            //       fontWeight: 500,
            //       boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
            //       "&:hover": {
            //         background:
            //           "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
            //         boxShadow: "0 6px 20px rgba(79, 70, 229, 0.35)",
            //       },
            //     }}
            //   >
            //     Register
            //   </Button>
            // </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;