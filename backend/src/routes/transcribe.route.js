import { Router } from "express";
import multer from "multer";
import { Client } from "@gradio/client";
import { checkApiKey } from "../middlewares/apiKey.js";  
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

const transcribeRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

let client;

async function initializeClient() {
  if (!client) {
    try {
      client = await Client.connect(process.env.DB_URI);
      console.log("✅ Connected to primary Gradio client");
    } catch (error) {
      console.error("❌ Failed to connect to primary Gradio client:", error);
      try {
        client = await Client.connect(process.env.FALLBACK_DB_URI);
        console.log("✅ Connected to fallback Gradio client");
      } catch (fallbackError) {
        console.error("❌ Failed to connect to fallback Gradio client:", fallbackError);
      }
    }
  }
}

async function correctTranscription(text) {
  try {
    const messages = [
new SystemMessage("You are an expert Sanskrit linguist. Please return only the grammatically correct Sanskrit version of the given text. Remove unnecessary characters such as numbers (e.g., २, १) or formatting symbols. Do not provide translations, explanations, markdown, or formatting — only the corrected Sanskrit text, in plain text."),
      new HumanMessage(`Correct this transcription: ${text}`)
    ];
    
    const response = await model.invoke(messages);
    return response.content.trim();
  } catch (error) {
    console.error("❌ Correction error:", error);
    return text;
  }
}

await initializeClient();

transcribeRouter
  .route("/transcribe")
  .post(checkApiKey, upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      console.log("📤 Processing audio:", {
        size: req.file.size,
        type: req.file.mimetype,
        time: new Date().toISOString(),
      });

      const audioBlob = new Blob([req.file.buffer], {
        type: req.file.mimetype,
      });

      const result = await client.predict("/predict", {
        audio_file: audioBlob,
      });

      const rawTranscription = result.data;
      const correctedTranscription = await correctTranscription(rawTranscription);

      console.log("Raw:", rawTranscription);
      console.log("Corrected:", correctedTranscription);

      res.json({
        transcription: correctedTranscription,
        raw_transcription: rawTranscription,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Transcription error:", error);
      res.status(500).json({
        error: "Transcription failed",
        details: error.message,
      });
    }
  });

export default transcribeRouter;
