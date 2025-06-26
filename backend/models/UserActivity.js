const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["login", "upload", "analyze", "delete", "chat"], // ✅ Added "chat"
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file: { // ✅ Renamed from fileId
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserFile",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserActivity", userActivitySchema);
