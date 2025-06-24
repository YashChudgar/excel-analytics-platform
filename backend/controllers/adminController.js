const User = require("../models/User");

const adminController = {
  // Get dashboard data
  getDashboardData: async (req, res) => {
    try {
      // Get total users count (excluding admins)
      const totalUsers = await User.countDocuments({ role: "user" });

      // Get active users (users who have logged in within the last 7 days, excluding admins)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      // console.log(
      //   "Checking for active users since:",
      //   sevenDaysAgo,
      //   "excluding admins"
      // );

      const activeUsers = await User.countDocuments({
        lastLogin: { $gte: sevenDaysAgo },
        role: "user", // Exclude users with admin role
      });

      // Get user growth data for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const userGrowthData = await User.aggregate([
        {
          $match: {
            role: "user", // Exclude admins
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalUsersInMonth: { $sum: 1 },
            activeUsersInMonth: {
              $sum: { $cond: [{ $gte: ["$lastLogin", sevenDaysAgo] }, 1, 0] },
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      // Format user growth data
      const formattedUserGrowthData = userGrowthData.map((item) => ({
        month: new Date(item._id.year, item._id.month - 1).toLocaleString(
          "default",
          { month: "short" }
        ),
        users: item.totalUsersInMonth,
        active: item.activeUsersInMonth,
      }));

      // Get user distribution data
      const userDistributionData = [
        {
          name: "Active Users",
          value: activeUsers,
        },
        {
          name: "Inactive Users",
          value: totalUsers - activeUsers,
        },
      ];

      // Get users list with pagination and debug lastLogin (excluding admins)
      const users = await User.find({ role: "user" })
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(10);

      console.log(
        "User lastLogin timestamps:",
        users.map((u) => ({
          email: u.email,
          lastLogin: u.lastLogin,
          isActive: u.lastLogin >= sevenDaysAgo,
        }))
      );

      res.json({
        totalUsers,
        activeUsers,
        userGrowthData: formattedUserGrowthData,
        userDistributionData,
        users: users.map((user) => ({
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
          lastActivity: user.lastLogin
            ? new Date(user.lastLogin).toLocaleString()
            : "Never",
          status: user.lastLogin >= sevenDaysAgo ? "active" : "inactive",
        })),
      });
    } catch (error) {
      // console.error("Error fetching admin dashboard data:", error);
      res.status(500).json({ error: "Failed to fetch admin dashboard data" });
    }
  },

  // Add new user
  addUser: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email or username already exists" });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
        role: role || "user", // Default to "user"
        lastLogin: null, // Set lastLogin to null for new users
      });

      await user.save();

      // Return the newly created user (excluding password)
      const newUser = await User.findById(user._id).select("-password");
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({ error: "Failed to add user" });
    }
  },

  // Delete user by ID
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Find and delete user
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
       if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot delete admin users" });
    }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  },
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({ role: { $ne: "admin" } }, "-password");

      // Get active users count
      const activeUsersCount = await getActiveUsersCount();

      // Add isActive flag to each user
      const usersWithActiveStatus = users.map((user) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return {
          ...user.toObject(),
          isActive: user.lastLogin && user.lastLogin >= thirtyDaysAgo,
        };
      });

      res.json({
        users: usersWithActiveStatus,
        stats: {
          total: users.length,
          active: activeUsersCount,
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, isActive } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Prevent updating admin users
      if (user.role === "admin") {
        return res.status(403).json({ error: "Cannot modify admin users" });
      }

      // Update fields if provided
      if (username) user.username = username;
      if (email) user.email = email;
      if (typeof isActive === "boolean") user.isActive = isActive;

      await user.save();

      // Return updated user without password
      const updatedUser = await User.findById(id).select("-password");
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Error updating user" });
    }
  },

  // Get admin dashboard data
  getAdminDashboardData: async (req, res) => {
    try {
      // Get user statistics
      const totalUsers = await User.countDocuments({ role: "user" });
      const activeUsers = await User.countDocuments({
        role: "user",
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });
      const newUsers = await User.countDocuments({
        role: "user",
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });

      // Get file statistics
      const totalFiles = await File.countDocuments();
      const recentFiles = await File.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });

      // Get user growth data for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const userGrowth = await User.aggregate([
        {
          $match: {
            role: "user",
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      // Format user growth data
      const formattedGrowth = userGrowth.map((item) => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`,
        count: item.count,
      }));

      // Get recent users
      const recentUsers = await User.find({ role: "user" })
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        totalUsers,
        activeUsers,
        newUsers,
        totalFiles,
        recentFiles,
        userGrowthData: formattedGrowth,
        recentUsers: recentUsers.map((user) => ({
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
          lastActivity: user.lastLogin
            ? new Date(user.lastLogin).toLocaleString()
            : "Never",
          status:
            user.lastLogin >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ? "active"
              : "inactive",
        })),
      });
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      res.status(500).json({ error: "Error fetching dashboard data" });
    }
  },
};

// Helper function to get active users count (excluding admins)
const getActiveUsersCount = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return await User.countDocuments({
    lastLogin: { $gte: thirtyDaysAgo },
    role: { $ne: "admin" },
  });
};

module.exports = adminController;
