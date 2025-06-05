const UserActivity = require("../models/UserActivity");
const UserFile = require("../models/UserFile");

// Get user activities
const getUserActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // Default to 5 if not specified
    const activities = await UserActivity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("fileId", "originalName")
      .limit(limit);

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Error fetching activities" });
  }
};

// Create activity log
const createActivity = async (userId, type, description, fileId = null) => {
  try {
    const activity = new UserActivity({
      user: userId,
      type,
      description,
      fileId,
    });
    await activity.save();
    return activity;
  } catch (error) {
    console.error("Error creating activity:", error);
  }
};

module.exports = {
  getUserActivities,
  createActivity,
};
