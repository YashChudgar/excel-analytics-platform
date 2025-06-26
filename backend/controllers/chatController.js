const UserFile = require("../models/UserFile");
const { createActivity } = require("./userActivityController");
const xlsx = require("xlsx");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const crypto = require("crypto");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cache = new Map();

const readExcelFile = async (fileUrl) => {
  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      timeout: 10000,
    });
    const workbook = xlsx.read(response.data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  } catch (error) {
    throw new Error(`Failed to read Excel file: ${error.message}`);
  }
};

const formatDataForAI = (data) => {
  if (!data || data.length === 0) return "No data available";
  const columns = Object.keys(data[0]);
  return JSON.stringify({
    totalRows: data.length,
    columns,
    sampleRows: data.slice(0, 3),
  });
};

const handleChatMessage = async (req, res) => {
  const { message } = req.body;
  const { fileId } = req.params;
  const requestId = crypto.randomUUID();

  console.log(`📩 [${requestId}] Chat request for file ${fileId}: ${message?.slice(0, 30)}...`);

  try {
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const file = await UserFile.findOne({
      _id: fileId,
      user: req.user._id,
    });

    if (!file || !file.cloudinaryUrl) {
      return res.status(404).json({ error: "Valid file not found" });
    }

    const cacheKey = `${req.user._id}_${fileId}_${message}`;
    if (cache.has(cacheKey)) {
      console.log(`⚡ [${requestId}] Responding from cache`);
      return res.json({ response: cache.get(cacheKey) });
    }

    const data = await readExcelFile(file.cloudinaryUrl);
    const formattedData = formatDataForAI(data);

    const prompt = `
You are a highly skilled data analyst.
Here is an Excel dataset:
${formattedData}

Now respond to this user query:
"${message}"

Respond clearly in Markdown with:
1. Key insights
2. Trends or patterns
3. Anomalies
4. Business interpretation
`.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();

    if (!reply) {
      return res.status(502).json({
        error: "Empty response from Gemini",
        details: "Gemini returned no data",
      });
    }

    cache.set(cacheKey, reply);

    await createActivity(
      req.user._id,
      "chat",
      `AI chat insights generated for: ${file.originalName}`,
      file._id
    );

    console.log(`✅ [${requestId}] Insight ready`);
    return res.json({ response: reply });
  } catch (err) {
    console.error(`❌ [${requestId}] Server error:`, err);
    return res.status(500).json({
      error: "Failed to process AI chat",
      details: err.message || "Unexpected error",
    });
  }
};

module.exports = {
  handleChatMessage,
};
