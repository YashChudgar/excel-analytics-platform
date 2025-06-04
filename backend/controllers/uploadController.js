const path = require("path");
const fs = require("fs");
const Upload = require("../models/Upload"); // Make sure this path is correct

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create an Upload document and associate it with the logged-in user
    const upload = new Upload({
      filename: req.file.filename,
      path: req.file.path,
      user: req.user._id, // assuming auth middleware sets req.user
    });

    await upload.save();

    res.status(200).json({
      message: "File uploaded and saved to DB",
      upload,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};
