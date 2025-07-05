import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authActions";
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
import axiosInstance from "../api/axiosInstance";

// import {jwt_decode, jwtDecode} from "jwt-decode"; // If you want to decode it on client (optional)

function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start mb-6">
      <div className="bg-white text-indigo-600 p-3 rounded-xl shadow mr-4">
        <Icon style={{ fontSize: 28 }} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        <p className="text-sm text-white/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleGoogleLogin = async (response) => {
    if (!response || !response.credential) {
      console.error("Google register: No credential received");
      setError("Google registration failed. No credential received.");
      return;
    }

    const tokenId = response.credential;
    // console.log("Google credential:", tokenId);

    try {
      const res = await axiosInstance.post("/auth/google/register", {
        token: tokenId,
      });

      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "auth/loginUser/fulfilled",
        payload: { user, token },
      });

      setError("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google registration failed:", err);
      setError(
        err.response?.data?.message ||
          "Google registration failed. Please try again."
      );
    }
  };

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: "250",
        }
      );
    } else {
      console.error("Google Identity not loaded");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const { username, email, password } = formData;
    try {
      const resultAction = await dispatch(
        registerUser({ username, email, password })
      );
      if (registerUser.fulfilled.match(resultAction)) navigate("/dashboard");
      else setError(resultAction.payload || "Registration failed");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
        py: 6,
        overflowY: "auto",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={4}
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
        >
          {/* Left Side - Written Content */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="pt-0 mt-0"
              style={{ marginTop: -125, paddingTop: 0 }}
            >
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight pt-48">
                Welcome to Excellytics
              </h1>
              <p className="text-white/85 mb-8 max-w-xl leading-relaxed">
                Unlock the full potential of your Excel data with our
                intelligent analytics platform. Transform complex spreadsheets
                into actionable insights and make data-driven decisions with
                confidence.
              </p>

              <FeatureItem
                icon={BarChartIcon}
                title="Smart Analytics"
                description="AI-powered insights that automatically detect patterns and trends in your Excel data."
              />
              <FeatureItem
                icon={TableChartIcon}
                title="Seamless Integration"
                description="One-click import from Excel with automatic data validation and cleaning."
              />
              <FeatureItem
                icon={SpeedIcon}
                title="Real-time Processing"
                description="Instant analysis of large datasets with cloud-powered processing capabilities."
              />
              <FeatureItem
                icon={SecurityIcon}
                title="Data Protection"
                description="Enterprise-grade security with automatic backups and version control."
              />
            </motion.div>
          </Grid>

          {/* Right Side - Register Form */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ paddingTop: 40 }}
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
                    padding: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "490px",
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
                      width: 70,
                      height: 70,
                      borderRadius: "18px",
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)",
                      transform: "rotate(-10deg)",
                      position: "relative",
                    }}
                  >
                    <AnalyticsIcon
                      sx={{
                        color: "white",
                        fontSize: 35,
                        transform: "rotate(10deg)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        fontSize: "1.2rem",
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
                      mb: 2,
                      color: "#4f46e5",
                      fontWeight: 500,
                      letterSpacing: "-0.5px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Join Our Platform
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
                      🚀
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
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      value={formData.username}
                      onChange={handleChange}
                      sx={{
                        mb: 1,
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
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      sx={{
                        mb: 1,
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
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      sx={{
                        mb: 1,
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      sx={{
                        mb: 1,
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
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                              sx={{ color: "#4f46e5" }}
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

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        mt: 2,
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
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>

                    {/* Divider with OR */}
                    <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                      <Divider
                        sx={{ flex: 1, height: 1, backgroundColor: "#ccc" }}
                      />
                      <Typography
                        sx={{ mx: 2, color: "#888", fontWeight: 500 }}
                      >
                        or
                      </Typography>
                      <Divider
                        sx={{ flex: 1, height: 1, backgroundColor: "#ccc" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        mb: 2,
                      }}
                    >
                      <div
                        id="googleSignInDiv"
                        style={{ margin: "1rem 0" }}
                      ></div>
                    </Box>
                    <Box sx={{ textAlign: "center", pt: 1 }}>
                      <Link
                        to="/login"
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
                          Already have an account? Sign In
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

export default Register;
