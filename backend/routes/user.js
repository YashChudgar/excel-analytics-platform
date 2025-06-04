const express = require("express");
const router = express.Router();
const {
  getUserStats,
  getUserActivities,
  // getUserFiles,
  // deleteUserFile,
  // getUserFileById,
} = require("../controllers/userController");
const {
  getUserFiles,
  getFileById,
  deleteFile,
  updateFileAnalysis
} = require("../controllers/userFileController");
const { auth } = require("../middlewares/auth");

// Get user statistics
router.get("/stats", auth, getUserStats);

// Get user activities
router.get("/activities", auth, getUserActivities);

// Get user files
router.get("/files", auth, getUserFiles);

// Delete user file
router.delete("/files/:id", auth, deleteFile);

// Get single user file by ID
router.get("/files/:id", auth, getFileById);

module.exports = router;
