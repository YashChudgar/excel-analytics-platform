const UserFile = require("../models/UserFile");
const { createActivity } = require("./userActivityController");
const xlsx = require("xlsx");
const axios = require("axios");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const crypto = require("crypto");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ⚡ Simple in-memory cache (for demonstration; replace with Mongo/Redis if needed)
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
  const fileId = req.params.fileId;
  const message = req.body.message?.trim();
  const requestId = crypto.randomUUID(); // For tracing

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

    // 📦 Check cache
    const cacheKey = `${req.user._id}_${fileId}_${message}`;
    if (cache.has(cacheKey)) {
      console.log(`⚡ [${requestId}] Responding from cache`);
      return res.json({ response: cache.get(cacheKey) });
    }

    const data = await readExcelFile(file.cloudinaryUrl);
    const formattedData = formatDataForAI(data);

    const prompt = `
You are an AI assistant analyzing Excel data.

Data Summary:
${formattedData}

User Query:
"${message}"

Please provide:
1. Direct Answer
2. Supporting Observations
3. Trends/Outliers
4. Business Insights

Respond clearly in markdown.
`.trim();

    let fullText = "";

    // 🔮 Try OpenAI first
    try {
      const openaiRes = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      fullText = openaiRes.choices?.[0]?.message?.content || "";
    } catch (err) {
      if (err.status === 429) {
        console.warn(`⚠️ [${requestId}] OpenAI rate limit hit. Falling back to Gemini...`);

        // 🔁 Fallback to Gemini
        try {
          const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
          const result = await model.generateContentStream({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          });

          for await (const chunk of result.stream) {
            fullText += chunk.text();
          }
        } catch (geminiErr) {
          const retryInfo = geminiErr?.errorDetails?.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
          const delaySeconds = retryInfo?.retryDelay?.replace("s", "") || "10";

          console.error(`❌ [${requestId}] Gemini fallback failed. Retry after: ${delaySeconds} seconds`);
          return res.status(429).json({
            error: "Gemini quota exceeded",
            details: `Please wait ${delaySeconds} seconds before retrying.`,
          });
        }
      } else {
        console.error(`❌ [${requestId}] OpenAI Error:`, err);
        return res.status(500).json({
          error: "OpenAI error",
          details: err.message,
        });
      }
    }

    if (!fullText.trim()) {
      console.error(`❌ [${requestId}] Both AI models returned empty response`);
      return res.status(502).json({
        error: "Empty response from AI",
        details: "Both OpenAI and Gemini failed.",
      });
    }

    // ✅ Cache and log
    cache.set(cacheKey, fullText);

    await createActivity(
      req.user._id,
      "chat",
      `AI chat generated insights for file: ${file.originalName}`,
      file._id
    );

    console.log(`✅ [${requestId}] AI response ready`);
    return res.json({ response: fullText });
  } catch (err) {
    console.error(`❌ [${requestId}] Server Error:`, err);

    if (err.message.includes("Excel")) {
      return res.status(400).json({
        error: "Error reading Excel file",
        details: err.message,
      });
    }

    return res.status(500).json({
      error: "AI chat processing failed",
      details: err.message || "Unexpected server error",
    });
  }
};

module.exports = {
  handleChatMessage,
};
