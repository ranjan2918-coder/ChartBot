const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const chatApi = {
  sendMessage: async (text, context, history) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, context, history }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.text || errorData.message || "API_COMMUNICATION_FAILURE");
      }
      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  },

  transcribeVoice: async (audioBlob, filename = 'speech.webm') => {
    const formData = new FormData();
    formData.append('file', audioBlob, filename);

    const response = await fetch(`${BASE_URL}/chat/voice/transcribe`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error("TRANSCRIPTION_FAILED");
    }
    return response.json();
  },

  healthCheck: async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) return { status: 'online' };
      return { status: 'offline' };
    } catch {
      return { status: 'offline' };
    }
  }
};
