const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

const {
  getUserStats,
  getUserActivities,
  updateUserProfile,
} = require("../controllers/userController");

const {
  getUserFiles,
  deleteFile,
  getFileById,
  updateFileAnalysis,
} = require("../controllers/userFileController");

// 📊 User statistics
router.get("/stats", auth, getUserStats);

// 🧠 Activities
router.get("/activities", auth, getUserActivities);

// 📝 Profile Update (✅ This is the key route you're debugging)
router.put("/profile", auth, (req, res, next) => {
  console.log("🔥 Route hit: /api/user/profile");
  next();
}, updateUserProfile);

// 📁 File routes
router.get("/files", auth, getUserFiles);
router.get("/files/:fileId", auth, getFileById);
router.delete("/files/:fileId", auth, deleteFile);
router.post("/files/:fileId/analyze", auth, updateFileAnalysis);

module.exports = router;
