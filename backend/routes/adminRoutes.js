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





// const express = require("express");
// const router = express.Router();
// const { auth, isAdmin } = require("../middlewares/auth");
// const adminController = require("../controllers/adminController");

// router.get(
//   "/dashboard",
//   auth,
//   isAdmin,
//   adminController.getDashboardData
// );

// // Add new user
// router.post("/users", auth, isAdmin, adminController.addUser);

// // Delete user by ID
// router.delete(
//   "/users/:userId",
//   auth,
//   isAdmin,
//   adminController.deleteUser
// );

// module.exports = router;
