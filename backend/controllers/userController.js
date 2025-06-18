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
  const { username, email, currentPassword, newPassword, confirmPassword } = req.body;

  console.log("➡️ Incoming profile update body:", req.body);
  console.log("➡️ Authenticated user ID:", userId);

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Fetched user:", user);

    // Update username/email if provided
    if (username) user.username = username;
    if (email) user.email = email;

    // Handle password change
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        console.log("❗ Missing password fields");
        return res.status(400).json({ message: "All password fields are required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      console.log("🔐 Password match result:", isMatch);

      if (!isMatch) {
        console.log("❌ Current password mismatch");
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      if (newPassword !== confirmPassword) {
        console.log("❌ New passwords do not match");
        return res.status(400).json({ message: "New passwords do not match" });
      }

      user.password = newPassword;
      user.markModified("password");

      console.log("🧪 Password field set (plain):", user.password);
      console.log("🧪 isModified(password):", user.isModified("password")); // ✅ should be true
    }

    console.log("📣 Saving user...");
    const updatedUser = await user.save();
    console.log("✅ User saved");
    console.log("📦 Updated password hash:", updatedUser.password);

    res.status(200).json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });

  } catch (err) {
    console.error("❌ Error in updateUserProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// const updateUserProfile = async (req, res) => {
//   const userId = req.user.id;
//   const { username, email, currentPassword, newPassword, confirmPassword } = req.body;

//   console.log("➡️ Incoming profile update body:", req.body);
//   console.log("➡️ Authenticated user ID:", userId);

//   try {
//     const user = await User.findById(userId).select("+password");

//     if (!user) {
//       console.log("❌ User not found in DB");
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("✅ Fetched user:", user);

//     if (username) user.username = username;
//     if (email) user.email = email;

//     if (currentPassword || newPassword || confirmPassword) {
//       if (!currentPassword || !newPassword || !confirmPassword) {
//         return res.status(400).json({ message: "All password fields are required" });
//       }

//       const isMatch = await bcrypt.compare(currentPassword, user.password);
//       console.log("🔐 Password match result:", isMatch);

//       if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

//       if (newPassword !== confirmPassword)
//         return res.status(400).json({ message: "New passwords do not match" });


//       // Don't hash here manually:
//       user.password = newPassword;

//       const salt = await bcrypt.genSalt(10);
      
//       const hashedPassword = await bcrypt.hash(newPassword, salt);
//       console.log("🔑 New hashed password:", hashedPassword);

//       // user.password = hashedPassword;
//     }

//     const updatedUser = await user.save();
//     console.log("✅ Updated user:", updatedUser);

//     res.status(200).json({
//       id: updatedUser._id,
//       username: updatedUser.username,
//       email: updatedUser.email,
//     });
//   } catch (err) {
//     console.error("❌ Error in updateUserProfile:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

module.exports = {
  getUserStats,
  getUserActivities,
  updateUserProfile, // ✅ export this
};
