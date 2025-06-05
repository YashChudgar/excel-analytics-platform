const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Unified authentication middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.header("Authorization");
    const token = authHeader && authHeader.replace("Bearer ", "").split(" ")[0];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user without password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Admin check middleware
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  auth,
  isAdmin,
};
