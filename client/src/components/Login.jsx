import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authActions";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
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
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #4f46e5 0%, #3730a3 100%)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <AnalyticsIcon sx={{ color: "white", fontSize: 32 }} />
                </Box>

                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    mb: 1,
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Excel Analytics
                </Typography>
                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ mb: 3, color: "text.secondary" }}
                >
                  Welcome Back
                </Typography>

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      width: "100%",
                      mb: 2,
                      borderRadius: "8px",
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box
                  component="form"
                  onSubmit={onSubmit}
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
                    value={formData.email}
                    onChange={onChange}
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
                    value={formData.password}
                    onChange={onChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
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
                    sx={{ mt: 3, mb: 2, height: 48, fontSize: "1.1rem" }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Sign In"}
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
                          },
                        }}
                      >
                        Don't have an account? Sign Up
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
