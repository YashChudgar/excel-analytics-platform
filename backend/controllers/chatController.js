const UserFile = require("../models/UserFile");
const { createActivity } = require("./userActivityController");
const xlsx = require("xlsx");
const axios = require("axios");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
  const summary = {
    rows: data.length,
    columns,
    sample: data.slice(0, 2),
  };
  return JSON.stringify(summary);
};

const handleChatMessage = async (req, res) => {
  try {
    const file = await UserFile.findOne({
      _id: req.params.fileId,
      user: req.user._id,
    });

    if (!file || !file.cloudinaryUrl) {
      return res.status(404).json({ error: "Valid file not found" });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const fileData = await readExcelFile(file.cloudinaryUrl);
    const formattedData = formatDataForAI(fileData);

    const prompt = `Analyze this Excel data structure:\n${formattedData}\n\nUser question: ${message}\n\nRespond with:\n1. Direct answer\n2. Key data patterns\n3. Notable insights/trends\n4. Recommendations\n\nKeep the tone professional and concise.`;

    let fullText = "";

    // ✅ Try OpenAI first
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      fullText = completion.choices[0]?.message?.content;
    } catch (openaiErr) {
      if (openaiErr.status === 429) {
        console.warn("⚠️ OpenAI rate limit hit. Falling back to Gemini.");

        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

        const result = await model.generateContentStream({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        for await (const chunk of result.stream) {
          fullText += chunk.text();
        }
      } else {
        throw openaiErr;
      }
    }

    if (!fullText) {
      return res.status(502).json({
        error: "Both AI providers failed",
        details: "Empty response from both OpenAI and Gemini.",
      });
    }

    await createActivity(
      req.user._id,
      "chat",
      `Chat interaction with file: ${file.originalName}`,
      file._id
    );

    res.json({ response: fullText });
  } catch (error) {
    console.error("❌ Error in handleChatMessage:", error);

    if (error.message.includes("Excel")) {
      return res.status(400).json({
        error: "Error reading Excel file",
        details: error.message,
      });
    }

    return res.status(500).json({
      error: "AI chat processing failed",
      details: error.message || "Unexpected server error",
    });
  }
};

module.exports = {
  handleChatMessage,
};
