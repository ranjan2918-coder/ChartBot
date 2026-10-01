const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

class WisprAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = "https://api.wisprflow.ai/v1/transcribe"; // Placeholder for actual Wispr endpoint
  }

  async transcribe(audioBuffer, originalFilename) {
    try {
      const form = new FormData();
      form.append("file", audioBuffer, { filename: originalFilename });

      const response = await axios.post(this.apiUrl, form, {
        headers: {
          ...form.getHeaders(),
          "Authorization": `Bearer ${this.apiKey}`
        }
      });

      return {
        text: response.data.text,
        confidence: response.data.confidence || 1.0
      };
    } catch (error) {
      console.error("Wispr Error:", error.response?.data || error.message);
      throw new Error("Voice transcription failed");
    }
  }
}

module.exports = WisprAdapter;
