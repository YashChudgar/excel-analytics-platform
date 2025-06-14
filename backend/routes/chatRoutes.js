const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { handleChatMessage } = require("../controllers/chatController");

// Chat route
router.post("/:fileId", auth, handleChatMessage);

module.exports = router;
