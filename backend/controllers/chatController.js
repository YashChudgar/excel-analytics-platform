const UserFile = require("../models/UserFile");
const { createActivity } = require("./userActivityController");
const OpenAI = require("openai");
const xlsx = require("xlsx");
const axios = require("axios");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to read Excel file
const readExcelFile = async (fileUrl) => {
  try {
    console.log("Attempting to read Excel file from URL:", fileUrl);
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      timeout: 10000, // 10 second timeout
    });

    if (!response.data) {
      throw new Error("No data received from file URL");
    }

    console.log("Successfully downloaded file, size:", response.data.length);
    const workbook = xlsx.read(response.data, { type: "array" });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("No sheets found in Excel file");
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      throw new Error("No data found in Excel sheet");
    }

    console.log("Successfully parsed Excel file, rows:", data.length);
    return data;
  } catch (error) {
    console.error("Error reading Excel file:", {
      message: error.message,
      code: error.code,
      url: fileUrl,
    });
    throw new Error(`Failed to read Excel file: ${error.message}`);
  }
};

// Helper function to format data for AI
const formatDataForAI = (data) => {
  try {
    if (!data || data.length === 0) {
      return "No data available";
    }

    // Get column names
    const columns = Object.keys(data[0]);

    // Create a summary of the data
    const summary = {
      totalRows: data.length,
      columns: columns,
      sampleData: data.slice(0, 5), // First 5 rows as sample
    };

    return JSON.stringify(summary, null, 2);
  } catch (error) {
    console.error("Error formatting data for AI:", error);
    throw new Error("Failed to format data for analysis");
  }
};

// Handle chat messages for a specific file
const handleChatMessage = async (req, res) => {
  try {
    console.log("Processing chat message for file:", req.params.fileId);

    const file = await UserFile.findOne({
      _id: req.params.fileId,
      user: req.user._id,
    });

    if (!file) {
      console.log("File not found:", req.params.fileId);
      return res.status(404).json({ error: "File not found" });
    }

    if (!file.cloudinaryUrl) {
      console.log("File has no cloudinary URL:", file._id);
      return res.status(400).json({ error: "File URL not available" });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Reading Excel file data...");
    const fileData = await readExcelFile(file.cloudinaryUrl);
    console.log("Formatting data for AI...");
    const formattedData = formatDataForAI(fileData);

    // Create the prompt for the AI
    const prompt = `You are an AI assistant analyzing an Excel file. Here's the data structure:
${formattedData}

User question: ${message}

Please provide a detailed analysis based on the data. Include:
1. Direct answer to the question
2. Relevant data points or patterns
3. Any insights or trends you notice
4. Recommendations based on the data

Format your response in a clear, professional manner.`;

    console.log("Sending request to OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert data analyst assistant. Your role is to analyze Excel data and provide insights based on user questions. Be precise, professional, and data-driven in your responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content;
    console.log("Received response from OpenAI");

    // Log activity
    await createActivity(
      req.user._id,
      "chat",
      `Chat interaction with file: ${file.originalName}`,
      file._id
    );

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error in handleChatMessage:", {
      message: error.message,
      stack: error.stack,
      fileId: req.params.fileId,
    });

    // Send appropriate error response
    if (error.message.includes("Failed to read Excel file")) {
      return res.status(400).json({
        error: "Error reading Excel file",
        details: error.message,
      });
    }

    if (error.message.includes("OpenAI")) {
      return res.status(500).json({
        error: "Error communicating with AI service",
        details: error.message,
      });
    }

    res.status(500).json({
      error: "Error processing chat message",
      details: error.message,
    });
  }
};

module.exports = {
  handleChatMessage,
};
