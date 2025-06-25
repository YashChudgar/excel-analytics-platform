const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { generateAIInsights } = require("../controllers/insightController");

// AI analysis route
router.post("/ai-insights/:fileId", auth, generateAIInsights);

module.exports = router;
