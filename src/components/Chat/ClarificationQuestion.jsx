import { ChevronRight } from 'lucide-react';
import './ClarificationQuestion.css';

const ClarificationQuestion = ({ question, options, onSelect, type = 'radio' }) => {
  return (
    <div className="clarification-block">
      <p className="question-text">{question}</p>
      
      <div className={`options-container ${type}-grid`}>
        {options.map((opt, idx) => (
          <button 
            key={idx} 
            className="option-card"
            onClick={() => onSelect(opt)}
          >
            <div className="option-content">
              <span className="option-label">{opt.label || opt}</span>
              {opt.subtext && <span className="option-sub">{opt.subtext}</span>}
            </div>
            <ChevronRight size={16} className="chevron" />
          </button>
        ))}
      </div>

      <div className="skip-actions">
        <button className="skip-btn" onClick={() => onSelect('skip')}>Skip for now</button>
        <button className="skip-btn" onClick={() => onSelect('idk')}>I don't know</button>
      </div>
    </div>
  );
};

export default ClarificationQuestion;
