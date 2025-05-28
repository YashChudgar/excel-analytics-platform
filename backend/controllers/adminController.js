// backend/controllers/adminController.js

const adminCreateHandler = async (req, res) => {
  try {
    // Example response — replace with actual logic later
    res.status(200).json({ success: true, message: "Admin-only route accessed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { adminCreateHandler };
