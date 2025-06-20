const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile, googleLogin, checkUserExists,  resetPasswordDirect } = require("../controllers/authController");
const { auth } = require("../middlewares/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);

router.post("/google", googleLogin);
router.post('/check-user', checkUserExists);
router.post('/reset-password-direct', resetPasswordDirect);

// Authenticated user routes
router.get("/profile", auth, getProfile);
router.patch("/profile", auth, updateProfile);

module.exports = router;


