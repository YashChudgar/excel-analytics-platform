const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { generateInsights } = require("../controllers/aiController");

// AI analysis route
router.post("/analyze/:fileId", auth, generateInsights);

module.exports = router;
