const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth");
const adminController = require("../controllers/adminController");

router.get(
  "/dashboard",
  auth,
  isAdmin,
  adminController.getDashboardData
);

// Add new user
router.post("/users", auth, isAdmin, adminController.addUser);

// Delete user by ID
router.delete(
  "/users/:userId",
  auth,
  isAdmin,
  adminController.deleteUser
);

module.exports = router;
