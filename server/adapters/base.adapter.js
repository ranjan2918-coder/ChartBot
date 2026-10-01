/**
 * Base Abstraction for any LLM Provider
 */
class ILLMProvider {
  async generateResponse(query, context, history) {
    throw new Error('Method generateResponse() must be implemented');
  }
}

module.exports = ILLMProvider;
