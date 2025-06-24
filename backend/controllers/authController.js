const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bcrypt = require("bcryptjs");

const generateToken = (userId) => 
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email or username already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({ success: true, user: formatUser(user), token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password"); // ✅ select password

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password); // this calls bcrypt.compare internally
    console.log("Comparing:", password, "with:", user.password);
    console.log("Match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({ success: true, user: formatUser(user), token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "password"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ success: false, message: "Invalid updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.json({ success: true, user: formatUser(req.user) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const googleLoginHandler = async (req, res, mode) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    const existingUser = await User.findOne({ email });

    if (mode === "login") {
      if (!existingUser) {
        return res.status(404).json({ message: "User not registered. Please sign up first." });
      }
    }

    if (mode === "register") {
      if (existingUser) {
        return res.status(400).json({ message: "User already registered. Please login." });
      }

      const generatedUsername = email.split('@')[0] + Math.floor(Math.random() * 1000);

      const newUser = await User.create({
        username: generatedUsername,
        email,
        profilePic: picture,
        googleId: sub,
        password: Math.random().toString(36).slice(-8), // dummy
      });

      const tokenJWT = generateToken(newUser._id);
      return res.status(201).json({ user: formatUser(newUser), token: tokenJWT });
    }

    // mode === "login", and user exists
    const tokenJWT = generateToken(existingUser._id);
    return res.status(200).json({ user: formatUser(existingUser), token: tokenJWT });

  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
const googleLogin = (req, res) => googleLoginHandler(req, res, "login");
const googleRegister = (req, res) => googleLoginHandler(req, res, "register");


const checkUserExists = async (req, res) => {
  const { email } = req.body;
  console.log("Checking email:", email);

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(404).json({ message: "No user found with this email" });

    res.json({ message: "User verified" });
  } catch (err) {
    console.error("Error in checkUserExists:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const resetPasswordDirect = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ DON'T hash manually
    user.password = password;

    await user.save();

    console.log("✅ Password updated for:", user.email);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error in resetPasswordDirect:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { register, login, getProfile, updateProfile, googleLogin, checkUserExists, resetPasswordDirect, googleRegister };