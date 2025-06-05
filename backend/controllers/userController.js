const UserFile = require("../models/UserFile");
const Activity = require("../models/UserActivity");

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total files
    const totalFiles = await UserFile.countDocuments({ user: userId });

    // Get total analyses
    const totalAnalyses = await Activity.countDocuments({
      user: userId,
      type: "analyze",
    });

    // Get last activity
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
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10
    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(activities);
  } catch (error) {
    console.error("Error fetching user activities:", error);
    res.status(500).json({ error: "Error fetching user activities" });
  }
};

// Get user files
// const getUserFiles = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const files = await UserFile.find({ user: userId }).sort({ createdAt: -1 });
//     res.json(files);
//   } catch (error) {
//     console.error("Error fetching user files:", error);
//     res.status(500).json({ error: "Error fetching user files" });
//   }
// };

// Delete user file
// const deleteUserFile = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const fileId = req.params.id;

//     const file = await UserFile.findOneAndDelete({ _id: fileId, user: userId });

//     if (!file) {
//       return res
//         .status(404)
//         .json({ error: "File not found or not authorized" });
//     }

//     // TODO: Add logic here to delete the file from Cloudinary or other storage
//     console.log(`File deleted from DB: ${file.filename}`);

//     res.json({ message: "File deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting file:", error);
//     res.status(500).json({ error: "Error deleting file" });
//   }
// };

// Get single user file by ID
// const getUserFileById = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const fileId = req.params.id;

//     const file = await UserFile.findOne({ _id: fileId, user: userId });

//     if (!file) {
//       return res
//         .status(404)
//         .json({ error: "File not found or not authorized" });
//     }

//     res.json(file);
//   } catch (error) {
//     console.error("Error fetching single file:", error);
//     res.status(500).json({ error: "Error fetching file data" });
//   }
// };

module.exports = {
  getUserStats,
  getUserActivities,
  // getUserFiles,
  // deleteUserFile,
  // getUserFileById,
};
