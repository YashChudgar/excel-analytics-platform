const UserFile = require("../models/UserFile");
const cloudinary = require("../config/cloudinary");
const { createActivity } = require("./userActivityController");

// Get user files
const getUserFiles = async (req, res) => {
  try {
    const files = await UserFile.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Error fetching files" });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const file = await UserFile.findOne({
      _id: req.params.fileId,
      user: req.user._id,
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.cloudinaryId);

    // Delete from database using findByIdAndDelete
    await UserFile.findByIdAndDelete(file._id);

    // Log activity
    await createActivity(
      req.user._id,
      "delete",
      `Deleted file: ${file.originalName}`,
      file._id
    );

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
};

// Update file analysis timestamp
const updateFileAnalysis = async (req, res) => {
  try {
    const file = await UserFile.findOne({
      _id: req.params.fileId,
      user: req.user._id,
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const updatedFile = await UserFile.findByIdAndUpdate(
      file._id,
      { lastAnalyzed: new Date() },
      { new: true }
    );

    // Log activity
    await createActivity(
      req.user._id,
      "analyze",
      `Analyzed file: ${file.originalName}`,
      file._id
    );

    res.json(updatedFile);
  } catch (error) {
    console.error("Error updating file analysis:", error);
    res.status(500).json({ error: "Error updating file analysis" });
  }
};

// Get single file by ID
const getFileById = async (req, res) => {
  try {
    const file = await UserFile.findOne({
      _id: req.params.fileId,
      user: req.user._id,
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Error fetching file" });
  }
};

module.exports = {
  getUserFiles,
  deleteFile,
  updateFileAnalysis,
  getFileById,
};
