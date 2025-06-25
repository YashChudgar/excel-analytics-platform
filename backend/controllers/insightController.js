const UserFile = require("../models/UserFile");
const xlsx = require("xlsx");
const axios = require("axios");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

const formatDataForAI = (data) => {
  if (!data || data.length === 0) return "No data available";
  const columns = Object.keys(data[0]);
  return JSON.stringify({
    rows: data.length,
    columns,
    sample: data.slice(0, 2),
  });
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
    const formattedData = formatDataForAI(data);

    const prompt = `
Analyze the following Excel dataset and provide:
1. A brief description of what the data is about
2. Trends, patterns or correlations
3. Outliers or anomalies
4. Business insights and recommendations
Respond in markdown format:

${formattedData}
`;

    let insights = "";

    try {
      const result = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      insights = result.choices[0]?.message?.content;
    } catch (err) {
      if (err.status === 429) {
        console.warn("OpenAI rate limit hit. Using Gemini fallback.");
        const model = genAI.getGenerativeModel({
          model: "models/gemini-1.5-pro",
        });

        const result = await model.generateContentStream({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        for await (const chunk of result.stream) {
          insights += chunk.text();
        }
      } else {
        throw err;
      }
    }

    if (!insights) {
      return res.status(502).json({
        error: "AI failed to generate insights",
        details: "Empty response from OpenAI and Gemini",
      });
    }

    res.json({ insights });
  } catch (error) {
    console.error("AI Insights Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  generateAIInsights,
};
