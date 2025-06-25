const express = require("express");
const router = express.Router();
const { auth, chatLimiter } = require("../middlewares/auth");
const { handleChatMessage } = require("../controllers/chatController");

// Chat route
router.post("/:fileId", auth, chatLimiter, handleChatMessage);

module.exports = router;
