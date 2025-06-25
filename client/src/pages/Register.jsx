import React, { useState ,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authActions";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

// import {jwt_decode, jwtDecode} from "jwt-decode"; // If you want to decode it on client (optional)
import axiosInstance from "../api/axiosInstance"; // your existing axios setup
import {
  Typography,
  Button,
  Box,
} from "@mui/material";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: authError, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  // const decoded=jwtDecode(response.credential);
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };
const [message, setMessage] = useState("");

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

    setMessage("Registration successful!");
    setError("");

    navigate("/dashboard");
  } catch (err) {
    console.error("Google registration failed:", err);
    setError(
      err.response?.data?.message || "Google registration failed. Please try again."
    );
    setMessage("");
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
      const resultAction = await dispatch(registerUser({ username, email, password }));
      if (registerUser.fulfilled.match(resultAction)) navigate("/dashboard");
      else setError(resultAction.payload || "Registration failed");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };


function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start mb-4">
      <div className="bg-white text-indigo-600 p-3 rounded-xl shadow mr-4 ">
        <Icon style={{ fontSize: 28 }} />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </div>
  );
}

  return (
    <div className="mt-15 min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-900 py-0 relative overflow-hidden">
      {/* Floating Icons */}
      <motion.div
        className="absolute top-[5%] left-[2%] w-[60px] h-[60px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center z-0"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <EmojiObjectsIcon style={{ fontSize: 30, color: "white" }} />
      </motion.div>
      <motion.div
        className="absolute top-[15%] right-[2%] w-[50px] h-[50px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center z-0"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <PsychologyIcon style={{ fontSize: 25, color: "white" }} />
      </motion.div>
      <motion.div
        className="absolute bottom-[5%] left-[2%] w-[45px] h-[45px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center z-0"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <AutoGraphIcon style={{ fontSize: 22, color: "white" }} />
      </motion.div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 items-stretch h-full w-full">
    {/* Left Section */}
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-full"
    >
      <div className="text-white">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Welcome to Excellytics
        </h1>
        <p className="text-lg opacity-90 leading-relaxed mb-6 max-w-xl">
          Unlock the full potential of your Excel data with our intelligent analytics platform.
          Transform complex spreadsheets into actionable insights and make data-driven decisions with confidence.
        </p>
        <div className="space-y-4">
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
        </div>
      </div>
    </motion.div>



          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full"
          >
            <div className="flex flex-col items-center h-full">
              <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-xl w-full max-w-xl relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center mb-4 shadow-lg rotate-[-10deg] relative">
                  <AnalyticsIcon className="text-white text-4xl rotate-[10deg]" />
                  <motion.div
                    className="absolute -top-2 -right-2 text-2xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}

                  >
                    ✨
                  </motion.div>
                </div>

                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800 mb-1 flex items-center gap-2">
                  Join Excellytics
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🔄
                  </motion.span>
                </h1>
                <h2 className="text-xl font-medium text-indigo-600 mb-4 flex items-center gap-2">
                  Begin Your Data Journey
                  <motion.span
                    animate={{ rotate: [0, -20, 20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🚀
                  </motion.span>
                </h2>

                {error && (
                  <div className="bg-red-100 text-red-700 border border-red-200 rounded-lg p-3 w-full mb-3 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition duration-300"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </motion.button>
                </form>

                <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                  <Divider sx={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
                  <Typography sx={{ mx: 2, color: "#888", fontWeight: 500 }}>or</Typography>
                  <Divider sx={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    m: 0,
                  }}
                >
                  <div id="googleSignInDiv" style={{ margin: "1rem 0" }}></div>
                </Box>

                <p className="text-center mt-4">
                  <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                    Already have an account? Sign In
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


export default Register;