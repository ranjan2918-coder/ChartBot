require("dotenv").config();
const GeminiAdapter = require("../adapters/gemini.adapter");

class ChatOrchestrator {
  constructor() {
    this.model = new GeminiAdapter(process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL);
    this.timeout = parseInt(process.env.LLM_TIMEOUT_MS, 10) || 15000;
    console.log(`[Orchestrator] System initialized with Gemini (timeout: ${this.timeout}ms).`);
  }

  async handleMessage(query, context, history) {
    try {
      console.log(`[Orchestrator] Processing: "${query.substring(0, 60)}..."`);

      // Race the LLM call against a timeout
      const result = await Promise.race([
        this.model.generateResponse(query, context, history),
        this._createTimeout()
      ]);

      console.log(`[Orchestrator] Response generated (confidence: ${result.confidence || 'N/A'})`);
      return result;
    } catch (error) {
      console.error("[Orchestrator] Request failed:", error.message);

      // Distinguish between timeout and other failures
      if (error.message === "LLM_TIMEOUT") {
        throw new Error("The AI is taking too long to respond. Please try a shorter question.");
      }

      if (error.message?.includes("API key")) {
        throw new Error("API key is invalid or missing. Please check the server configuration.");
      }

      throw new Error("The AI service is currently unavailable. Please try again in a few seconds.");
    }
  }

  _createTimeout() {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("LLM_TIMEOUT")), this.timeout);
    });
  }
}

module.exports = new ChatOrchestrator();
