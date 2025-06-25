const UserFile = require("../models/UserFile");
const xlsx = require("xlsx");
const axios = require("axios");

const readExcelFile = async (fileUrl) => {
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
    timeout: 10000,
  });
  const workbook = xlsx.read(response.data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
};

const formatDataForMock = (data) => {
  if (!data || data.length === 0) return "No data available";
  const columns = Object.keys(data[0]);
  return {
    rows: data.length,
    columns,
    sample: data.slice(0, 2),
  };
};

const generateAIInsights = async (req, res) => {
  try {
    const file = await UserFile.findOne({
      _id: req.params.fileId,
      user: req.user._id,
    });

    if (!file || !file.cloudinaryUrl) {
      return res.status(404).json({ error: "File not found" });
    }

    const data = await readExcelFile(file.cloudinaryUrl);
    const summary = formatDataForMock(data);

    // ✅ MOCK INSIGHTS (replace this later with real AI)
    const insights = `
### 📊 Mock Insights

- **File Name**: ${file.originalName}
- **Rows**: ${summary.rows}
- **Columns**: ${summary.columns.join(", ")}
- **Sample Data**: 
\`\`\`json
${JSON.stringify(summary.sample, null, 2)}
\`\`\`

---

### 📈 Trends:
- The dataset appears to track consistent metrics across rows.
- Values suggest increasing activity in later rows (see sample).

### 🧠 Insights:
- Column "${summary.columns[0]}" seems to be the primary identifier.
- Try segmenting data by "${summary.columns[1]}" for further analysis.

### ✅ Recommendations:
- Use Excel filtering on "${summary.columns[2]}" to extract key rows.
- Re-upload file with clearer column headers if needed.
`;

    res.json({ insights });
  } catch (error) {
    console.error("Mock AI Insights Error:", error);
    res.status(500).json({ error: "Failed to generate insights", details: error.message });
  }
};

module.exports = {
  generateAIInsights,
};
