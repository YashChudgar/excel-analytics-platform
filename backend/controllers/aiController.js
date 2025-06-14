const UserFile = require("../models/UserFile");
const { createActivity } = require("./userActivityController");

// Generate AI insights for a file
const generateInsights = async (req, res) => {
  try {
    const file = await UserFile.findOne({
      _id: req.params.fileId,
      user: req.user._id,
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // TODO: Implement actual AI analysis here
    // For now, return mock insights
    const insights = {
      summary:
        "Based on the analysis of your Excel file, we've identified several key patterns and trends in your data.",
      trends:
        "The data shows a consistent upward trend in performance metrics over the last quarter, with notable spikes in weeks 3 and 7.",
      recommendations:
        "Consider focusing on the areas that showed the highest growth rates. Implementing similar strategies in other departments could yield similar results.",
    };

    // Log activity
    await createActivity(
      req.user._id,
      "ai_analysis",
      `Generated AI insights for file: ${file.originalName}`,
      file._id
    );

    res.json(insights);
  } catch (error) {
    console.error("Error generating AI insights:", error);
    res.status(500).json({ error: "Error generating AI insights" });
  }
};

module.exports = {
  generateInsights,
};
