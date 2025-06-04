const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile } = require("../controllers/authController");
const { auth } = require("../middlewares/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Authenticated user routes
router.get("/profile", auth, getProfile);
router.patch("/profile", auth, updateProfile);

module.exports = router;


