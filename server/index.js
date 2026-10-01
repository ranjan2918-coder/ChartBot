require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const orchestrator = require("./services/orchestrator");
const WisprAdapter = require("./adapters/wispr.adapter");

const app = express();
const upload = multer(); // For handling voice audio blobs
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const wispr = new WisprAdapter(process.env.WISPRFLOW_API_KEY);

// --- ROUTES ---

// 1. Text Message Endpoint
app.post("/api/chat/message", async (req, res) => {
  const { text, context, history } = req.body;
  try {
    const response = await orchestrator.handleMessage(text, context, history);
    res.json(response);
  } catch (error) {
    res.status(500).json({ text: error.message, error: true });
  }
});

// 2. Voice Transcription Endpoint
app.post("/api/chat/voice/transcribe", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file provided" });
    
    // In a real scenario, you'd send req.file.buffer to Wispr
    // Simulation for now to avoid crashing without active keys
    if (process.env.WISPRFLOW_API_KEY === "your_wispr_key_here") {
       return res.json({ text: "I want to apply for a student scholarship.", confidence: 1.0 });
    }

    const transcription = await wispr.transcribe(req.file.buffer, req.file.originalname);
    res.json(transcription);
  } catch (error) {
    res.status(500).json({ error: "Transcription failed" });
  }
});

// 3. Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", provider: "gemini" });
});

app.listen(port, () => {
  console.log(`[Mera Adhikar Server] Listening at http://localhost:${port}`);
});
