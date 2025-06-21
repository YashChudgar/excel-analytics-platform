import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authActions"; // Redux action, optional to keep
import {useNavigate, Link } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// function FeatureItem({ icon: Icon, title, description }) {
//   return (
//     <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
//       <Box
//         sx={{
//           backgroundColor: "#fff",
//           color: "#4f46e5",
//           borderRadius: "12px",
//           p: 1.5,
//           mr: 2,
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//         }}
//       >
//         <Icon sx={{ fontSize: 28 }} />
//       </Box>
//       <Box>
//         <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//           {title}
//         </Typography>
//         <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
//           {description}
//         </Typography>
//       </Box>
//     </Box>
//   );
// }
function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start mb-4">
      <div className="bg-white text-indigo-600 p-3 rounded-xl shadow mr-4">
        <Icon style={{ fontSize: 28 }} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </div>
  );
}


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux auth state (optional)
  const { loading: reduxLoading, error: reduxError, user: reduxUser } = useSelector(
  (state) => state.auth
);


  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // Dispatch the redux loginUser thunk and wait for result
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      // Login succeeded, loading will be set to false by redux slice
      // Navigation handled in useEffect watching reduxUser
    } else {
      // Login failed
      setError(resultAction.payload || "Login failed");
      setLoading(false);
    }
  } catch (error) {
    setError(error.message || "Login failed");
    setLoading(false);
  }
};

  // Watch for reduxUser to redirect after login (if Redux is used)
  useEffect(() => {
    if (reduxUser) {
      setLoading(false);
      if (reduxUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [reduxUser, navigate]);

  // Watch for context login error and loading to sync UI
  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
      setLoading(false);
    }
  }, [reduxError]);



  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
        py: 6,
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="space-between" direction="row" wrap="nowrap">
          {/* Left Side - Written Content */}
          <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full md:w-1/2 px-6"
    >
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
        Unlock Insights with Excellytics
      </h1>
      <p className="text-white/85 mb-6 max-w-xl">
        Upload, visualize, and analyze your Excel data in seconds. Intelligent
        insights, beautiful charts, and powerful tools at your fingertips.
      </p>

      <FeatureItem
        icon={BarChartIcon}
        title="Interactive Charts"
        description="Generate 2D and 3D charts from your uploaded Excel files."
      />
      <FeatureItem
        icon={TableChartIcon}
        title="Smart Data Parsing"
        description="Advanced parsing to structure and analyze data seamlessly."
      />
      <FeatureItem
        icon={SpeedIcon}
        title="Fast Performance"
        description="Optimized backend ensures smooth and fast processing."
      />
      <FeatureItem
        icon={SecurityIcon}
        title="Secure Access"
        description="Your data is protected with end-to-end encryption and JWT auth."
      />
    </motion.div>
          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "24px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "20px",
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)",
                      transform: "rotate(-10deg)",
                      position: "relative",
                    }}
                  >
                    <AnalyticsIcon
                      sx={{
                        color: "white",
                        fontSize: 40,
                        transform: "rotate(10deg)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        fontSize: "1.5rem",
                        animation: "bounce 2s infinite",
                        "@keyframes bounce": {
                          "0%, 100%": { transform: "translateY(0)" },
                          "50%": { transform: "translateY(-10px)" },
                        },
                      }}
                    >
                      ✨
                    </Box>
                  </Box>

                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                      mb: 1,
                      fontWeight: 800,
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.5px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Excellytics
                    <Box
                      component="span"
                      sx={{
                        fontSize: "1.5rem",
                        animation: "spin 3s linear infinite",
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    >
                      🔄
                    </Box>
                  </Typography>
                  <Typography
                    component="h2"
                    variant="h5"
                    sx={{
                      mb: 3,
                      color: "#4f46e5",
                      fontWeight: 500,
                      letterSpacing: "-0.5px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Welcome Back
                    <Box
                      component="span"
                      sx={{
                        animation: "wave 2s infinite",
                        "@keyframes wave": {
                          "0%, 100%": { transform: "rotate(0deg)" },
                          "25%": { transform: "rotate(-20deg)" },
                          "75%": { transform: "rotate(20deg)" },
                        },
                      }}
                    >
                      👋
                    </Box>
                  </Typography>

                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        width: "100%",
                        mb: 2,
                        borderRadius: "12px",
                        backgroundColor: "rgba(211, 47, 47, 0.1)",
                        color: "#d32f2f",
                        border: "1px solid rgba(211, 47, 47, 0.2)",
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 1, width: "100%" }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover fieldset": {
                            borderColor: "#4f46e5",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4f46e5",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#4f46e5",
                        },
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover fieldset": {
                            borderColor: "#4f46e5",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4f46e5",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#4f46e5",
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: "#4f46e5" }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 3,
                        mb: 2,
                        height: 50,
                        fontSize: "1.1rem",
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                        textTransform: "none",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                        },
                      }}
                      component={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign In
                    </Button>
                    <Box sx={{ textAlign: "center" }}>
                      <Link
                        to="/register"
                        style={{
                          textDecoration: "none",
                          color: "#4f46e5",
                          fontWeight: 500,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            "&:hover": {
                              textDecoration: "underline",
                              color: "#3730a3",
                            },
                          }}
                        >
                          Don't have an account? Sign Up
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
