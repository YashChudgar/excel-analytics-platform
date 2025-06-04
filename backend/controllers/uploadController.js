const UserFile = require("../models/UserFile");
const cloudinary = require("../config/cloudinary");
const { createActivity } = require("./userActivityController");
const fs = require("fs");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { path: localFilePath, originalname } = req.file;

    // Upload the file to Cloudinary as raw file
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw",
      folder: "excel-files",
      public_id: `${Date.now()}-${originalname.split('.')[0]}`,
    });

    // Remove file from local uploads folder after upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    // Save file info in database
    const newFile = new UserFile({
      user: req.user._id,
      originalName: originalname,
      filename: result.public_id, // Cloudinary public ID
      mimetype: req.file.mimetype,
      cloudinaryUrl: result.secure_url,
      cloudinaryId: result.public_id,
      size: req.file.size,
    });

    await newFile.save();

    // Log activity
    await createActivity(
      req.user._id,
      "upload",
      `Uploaded file: ${originalname}`,
      newFile._id
    );

    res.status(200).json({
      message: "File uploaded successfully to Cloudinary",
      upload: newFile,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

module.exports = {
  uploadFile,
};
