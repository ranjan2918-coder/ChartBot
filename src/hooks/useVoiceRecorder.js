import { useState, useRef, useCallback } from 'react';
import { chatApi } from '../utils/api';

export const useVoiceRecorder = (onTranscriptionComplete) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef(null);
  const streamRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        // Stop all audio tracks to release the microphone
        streamRef.current?.getTracks().forEach(track => track.stop());

        setIsProcessing(true);
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });

        try {
          const data = await chatApi.transcribeVoice(audioBlob, 'speech.webm');
          if (data.text) {
            onTranscriptionComplete(data.text);
          }
        } catch (err) {
          console.error("[VoiceRecorder] Transcription Error:", err);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("[VoiceRecorder] Microphone Access Denied:", err);
      setIsRecording(false);
    }
  }, [onTranscriptionComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return { isRecording, isProcessing, startRecording, stopRecording };
};
