const UserFile = require("../models/UserFile");
const Activity = require("../models/UserActivity");
const User = require("../models/User"); // Import your user model
const bcrypt = require("bcryptjs"); // For password hashing

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalFiles = await UserFile.countDocuments({ user: userId });
    const totalAnalyses = await Activity.countDocuments({
      user: userId,
      type: "analyze",
    });
    const lastActivity = await Activity.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .select("createdAt");

    res.json({
      totalFiles,
      totalAnalyses,
      lastActive: lastActivity?.createdAt || new Date(),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Error fetching user statistics" });
  }
};

// Get user activities
const getUserActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;
    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(activities);
  } catch (error) {
    console.error("Error fetching user activities:", error);
    res.status(500).json({ error: "Error fetching user activities" });
  }
};

// ✅ Update user profile
const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, email, currentPassword, newPassword, confirmPassword } =
    req.body;

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update username/email if provided
    if (username) user.username = username;
    if (email) user.email = email;

    // Handle password change if any password fields are present
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res
          .status(400)
          .json({ message: "All password fields are required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      // Set the new password — pre-save hook will hash it
      user.password = newPassword;
    }

    const updatedUser = await user.save();

    // ✅ Include a message in the success response
    res.status(200).json({
      message: currentPassword ? "Password updated successfully" : "Profile updated successfully",
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (err) {
    console.error("❌ Error in updateUserProfile:", err.stack || err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getUserStats,
  getUserActivities,
  updateUserProfile, 
};
