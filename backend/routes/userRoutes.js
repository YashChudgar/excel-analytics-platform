const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { getUserActivities } = require("../controllers/userActivityController");
const {
  getUserFiles,
  deleteFile,
  getFileById,
  updateFileAnalysis,
} = require("../controllers/userFileController");

// Activity routes
router.get("/activities", auth, getUserActivities);

// File routes
router.get("/files", auth, getUserFiles);
router.get("/files/:fileId", auth, getFileById);
router.delete("/files/:fileId", auth, deleteFile);
router.post("/files/:fileId/analyze", auth, updateFileAnalysis);

module.exports = router;
