const UserActivity = require("../models/UserActivity");

// Get recent user activities
const getUserActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const activities = await UserActivity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("file", "originalName") // field is now "file"
      .limit(limit);

    res.json(activities);
  } catch (error) {
    console.error("❌ Error fetching activities:", error);
    res.status(500).json({ error: "Error fetching activities" });
  }
};

// Log a new activity
const createActivity = async (userId, type, description, file = null) => {
  try {
    const activity = new UserActivity({
      user: userId,
      type,
      description, 
      file,        
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
