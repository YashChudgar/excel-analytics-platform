const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const uploadController = require("../controllers/uploadController");
const { auth } = require("../middlewares/auth");

// Upload route - protected with auth middleware
router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadController.uploadFile
);
// router.get("/uploads", auth, uploadController.getUserUploads);

module.exports = router;
