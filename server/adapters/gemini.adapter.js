const { GoogleGenerativeAI } = require("@google/generative-ai");
const ILLMProvider = require("./base.adapter");

class GeminiAdapter extends ILLMProvider {
  constructor(apiKey, modelName) {
    super();
    if (!apiKey) {
      console.warn("[GeminiAdapter] WARNING: No API key provided. The adapter will fail on requests.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName || "gemini-1.5-pro" });
  }

  async generateResponse(query, context, history) {
    try {
      const systemPrompt = `You are "Mera Adhikar Guide", an AI assistant that helps Indian citizens discover government schemes, subsidies, pensions, and benefits they may be eligible for.

RULES:
- Be empathetic, warm, and easy to understand.
- Always respond in the language the user speaks.
- If unsure, ask a clarification question instead of guessing.
- Never invent schemes. Only mention real government programs.
- If you mention a scheme, always include the official portal link.

USER CONTEXT: ${JSON.stringify(context || {})}
CONVERSATION HISTORY: ${JSON.stringify((history || []).slice(-6))}

USER QUERY: ${query}

RESPOND IN VALID JSON FORMAT ONLY with these keys:
{
  "text": "Your conversational reply text",
  "schemeCard": { "title": "Scheme Name", "benefit": "₹Amount or description", "match": "High/Medium/Low", "link": "https://..." } or null,
  "checklist": ["Document 1", "Document 2"] or null,
  "clarification": { "question": "Clarifying question?", "options": [{"label": "Option A"}, {"label": "Option B"}] } or null,
  "confidence": 0.0 to 1.0
}`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const rawText = response.text();

      return this._parseResponse(rawText);
    } catch (error) {
      console.error("[GeminiAdapter] Error:", error.message);
      throw error;
    }
  }

  /**
   * Robustly extracts JSON from LLM output, handling markdown fences,
   * trailing text, and partial responses gracefully.
   */
  _parseResponse(rawText) {
    // Step 1: Try to extract JSON from markdown code blocks
    const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonCandidate = fenceMatch ? fenceMatch[1].trim() : rawText.trim();

    // Step 2: Try to find the outermost JSON object
    const firstBrace = jsonCandidate.indexOf('{');
    const lastBrace = jsonCandidate.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const extracted = jsonCandidate.substring(firstBrace, lastBrace + 1);
      try {
        const parsed = JSON.parse(extracted);
        // Validate minimum required field
        if (parsed.text) return parsed;
      } catch (e) {
        console.warn("[GeminiAdapter] JSON parse attempt failed, falling back to text response.");
      }
    }

    // Step 3: Fallback — return raw text as a plain message
    console.warn("[GeminiAdapter] Could not parse structured JSON. Returning raw text.");
    return {
      text: rawText.replace(/```json|```/g, "").trim(),
      schemeCard: null,
      checklist: null,
      clarification: null,
      confidence: 0.5
    };
  }
}

module.exports = GeminiAdapter;
