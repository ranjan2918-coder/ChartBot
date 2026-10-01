import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Phone, MapPin } from 'lucide-react';
import './FeedbackSupport.css';

export const FeedbackRow = ({ onFeedback }) => {
  const [voted, setVoted] = useState(null);

  const handleVote = (val) => {
    setVoted(val);
    onFeedback(val);
  };

  return (
    <div className="feedback-row">
      <span className="feedback-label">Was this helpful?</span>
      <div className="feedback-actions">
        <button 
          className={`feedback-btn ${voted === 'up' ? 'active' : ''}`}
          onClick={() => handleVote('up')}
          aria-label="Yes, helpful"
        >
          <ThumbsUp size={16} />
        </button>
        <button 
          className={`feedback-btn ${voted === 'down' ? 'active' : ''}`}
          onClick={() => handleVote('down')}
          aria-label="No, not helpful"
        >
          <ThumbsDown size={16} />
        </button>
      </div>
    </div>
  );
};

export const SupportBlock = () => {
  return (
    <div className="support-block">
      <h4 className="support-title">Need human help?</h4>
      <p className="support-desc">Talk to a government operator or find your nearest service center.</p>
      <div className="support-grid">
        <button className="support-card">
          <Phone size={20} />
          <span>Call Helpline</span>
        </button>
        <button className="support-card">
          <MessageSquare size={20} />
          <span>WhatsApp Help</span>
        </button>
        <button className="support-card">
          <MapPin size={20} />
          <span>Near Me</span>
        </button>
      </div>
    </div>
  );
};
