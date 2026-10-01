import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { Mic, Send, ExternalLink, ShieldCheck, RefreshCcw, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentChecklist from './DocumentChecklist';
import TrustPanel from './TrustPanel';
import ClarificationQuestion from './ClarificationQuestion';
import { FeedbackRow, SupportBlock } from './FeedbackSupport';
import { strings } from '../../data/translations';
import { trackEvent, analyticsEvents } from '../../hooks/useAnalytics';
import { chatApi } from '../../utils/api';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import './ChatView.css';

let messageCounter = 0;
const nextId = () => `msg-${++messageCounter}-${Math.random().toString(36).slice(2, 7)}`;

const getWelcomeMessage = (language) => ({
  id: nextId(),
  type: 'bot',
  text: language === 'en'
    ? "Namaste! 🙏 I'm your Mera Adhikar Guide. Tell me about yourself or your problem, and I'll find government benefits you may be eligible for."
    : "नमस्ते! 🙏 मैं आपका मेरा अधिकार गाइड हूँ। मुझे अपनी समस्या बताएं, और मैं उन सरकारी लाभों को खोजूंगा जिनके लिए आप पात्र हो सकते हैं।",
  timestamp: new Date().toISOString()
});

const ChatView = ({ initialQuery, language }) => {
  const t = strings[language];
  const [messages, setMessages] = useState(() => [getWelcomeMessage(language)]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTrust, setShowTrust] = useState(false);
  const [connError, setConnError] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState('');

  const scrollRef = useRef(null);
  const inputId = useId();

  const handleSend = useCallback(async (text) => {
    const query = typeof text === 'string' ? text : inputValue;
    if (!query.trim()) return;

    const newUserMsg = { id: nextId(), type: 'user', text: query, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);
    setConnError(false);
    setLastFailedQuery(query);

    // Demo/Mock mode
    if (demoMode) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: nextId(),
          type: 'bot',
          text: "DEMO MODE: I found a scholarship for you.",
          card: { title: "National Scholarship", benefit: "₹10,000", match: "High", link: "#" },
          checklist: ["Aadhaar", "Mark Sheet"]
        }]);
      }, 1000);
      return;
    }

    try {
      const data = await chatApi.sendMessage(
        query,
        { platform: 'web', location: 'India', language },
        messages.slice(-5).map(m => ({ role: m.type, content: m.text }))
      );

      trackEvent(analyticsEvents.QUERY_SUBMIT, { query });

      setMessages(prev => [...prev, {
        id: nextId(),
        type: 'bot',
        text: data.text,
        card: data.schemeCard,
        checklist: data.checklist,
        clarification: data.clarification,
        showSupport: data.showSupport,
        confidence: data.confidence
      }]);
    } catch {
      setConnError(true);
      trackEvent('CONNECTION_FAILURE');
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, demoMode, messages, language]);

  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecorder((transcript) => {
    handleSend(transcript);
  });

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping, connError]);

  // Send initial query if provided
  useEffect(() => {
    if (initialQuery) {
      const timer = setTimeout(() => handleSend(initialQuery), 400);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const msgVariants = {
    initial: { opacity: 0, y: 12, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
  };

  return (
    <div className="chat-view">
      <div className="message-stream" ref={scrollRef}>
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`message-wrapper ${msg.type}`}
              variants={msgVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
            >
              <div className="message-bubble">
                <p>{msg.text}</p>
                {msg.card && <SchemeCard card={msg.card} onShowTrust={() => setShowTrust(true)} />}
                {msg.checklist && <DocumentChecklist schemeName={msg.card?.title} docs={msg.checklist} />}
                {msg.clarification && <ClarificationQuestion {...msg.clarification} onSelect={(opt) => handleSend(opt.label || opt)} />}
                {msg.showSupport && <SupportBlock />}
                {msg.type === 'bot' && <FeedbackRow onFeedback={(val) => trackEvent(analyticsEvents.FEEDBACK_GIVEN, { value: val })} />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="typing-indicator"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span></span><span></span><span></span>
          </motion.div>
        )}

        {isProcessing && (
          <motion.div className="processing-badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Mic size={14} className="processing-mic" />
            <span>{t.thinking}</span>
          </motion.div>
        )}

        {connError && (
          <motion.div
            className="connection-error-block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <WifiOff size={24} />
            <div className="error-info">
              <h4>Unable to connect to AI</h4>
              <p>The backend server might be offline.</p>
            </div>
            <div className="error-actions">
              <button className="retry-btn" onClick={() => handleSend(lastFailedQuery)}>
                <RefreshCcw size={14} /> Retry
              </button>
              <button className="demo-toggle-btn" onClick={() => { setDemoMode(true); setConnError(false); setIsTyping(false); }}>
                Try Demo Mode
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="input-area">
        {demoMode && <div className="demo-banner">⚡ Demo Mode — Responses are simulated</div>}
        <div className="input-container">
          <input
            id={inputId}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.searchPlaceholder}
            className="chat-input"
            autoComplete="off"
          />
          <div className="input-actions">
            {inputValue ? (
              <button className="send-btn-new" onClick={() => handleSend()} aria-label="Send message">
                <Send size={18} />
              </button>
            ) : (
              <button
                className={`mic-btn-new ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? t.stopListening : t.listening}
              >
                <Mic size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <TrustPanel isOpen={showTrust} onClose={() => setShowTrust(false)} />
    </div>
  );
};

const SchemeCard = ({ card, onShowTrust }) => (
  <div className="scheme-card">
    <div className="card-header">
      <span className={`card-tag match-${(card.match || '').toLowerCase()}`}>{card.match}</span>
      <button className="why-btn" onClick={onShowTrust}><ShieldCheck size={14} /> Why?</button>
    </div>
    <h4 className="card-title">{card.title}</h4>
    <div className="card-benefit"><b>Benefit:</b> {card.benefit}</div>
    <a href={card.link} target="_blank" rel="noopener noreferrer" className="card-cta">
      Visit Portal <ExternalLink size={14} />
    </a>
  </div>
);

export default ChatView;
