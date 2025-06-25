const express = require("express");
const router = express.Router();
const { auth,chatLimiter } = require("../middlewares/auth");
const { generateAIInsights } = require("../controllers/insightController");

// AI analysis route
router.post("/ai-insights/:fileId", auth,chatLimiter, generateAIInsights);

module.exports = router;
