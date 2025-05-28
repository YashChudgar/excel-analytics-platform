const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth");
const { adminCreateHandler } = require("../controllers/adminController");
const { register, login, getProfile, updateProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.post('/admin/create', auth, isAdmin, adminCreateHandler);
router.patch("/profile", auth, updateProfile);

module.exports = router;