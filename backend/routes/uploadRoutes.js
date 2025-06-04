const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require("path");
const uploadController = require("../controllers/uploadController");
const { auth } = require("../middlewares/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload file route
router.post("/upload", auth, upload.single("file"), uploadController.uploadFile);

module.exports = router;
