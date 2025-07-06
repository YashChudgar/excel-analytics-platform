const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { auth, isAdmin } = require("../middlewares/auth");

// Middleware combo for admin routes
const adminAuth = [auth, isAdmin];

// Admin Dashboard
router.get("/dashboard",adminAuth,adminController.getDashboardData);


// Get all users
router.get("/users", adminAuth, adminController.getAllUsers);

// Add new user
router.post("/users", adminAuth, adminController.addUser);

// Update user by ID
router.put("/users/:id", adminAuth, adminController.updateUser);

// Delete user by ID
router.delete("/users/:id", adminAuth, adminController.deleteUser);

module.exports = router;





