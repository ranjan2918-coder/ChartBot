import { X, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import './TrustPanel.css';

const TrustPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="trust-panel-backdrop" onClick={onClose}>
      <div className="trust-panel" onClick={e => e.stopPropagation()}>
        <header className="panel-header">
          <div className="panel-title">
            <ShieldCheck className="icon-trust" size={20} />
            <h2>Why you see this scheme</h2>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </header>

        <div className="panel-content">
          <section className="confidence-section">
            <div className="confidence-score">
              <span className="score-label">Match Strength</span>
              <div className="score-bar">
                <div className="score-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="score-value">85% Likely</span>
            </div>
            <p className="confidence-text">
              We found a high match based on the details you shared. 
              The final decision is made by the Government department.
            </p>
          </section>

          <section className="factors-section">
            <h3 className="section-title">Factors used:</h3>
            <div className="factor-list">
              <div className="factor-item matched">
                <div className="factor-indicator"></div>
                <div className="factor-info">
                  <span className="factor-name">Occupation: Farmer</span>
                  <span className="factor-desc">Matches your profile</span>
                </div>
              </div>
              <div className="factor-item matched">
                <div className="factor-indicator"></div>
                <div className="factor-info">
                  <span className="factor-name">Location: Uttar Pradesh</span>
                  <span className="factor-desc">Matches your profile</span>
                </div>
              </div>
              <div className="factor-item unknown">
                <div className="factor-indicator"></div>
                <div className="factor-info">
                  <span className="factor-name">Annual Income: ?</span>
                  <span className="factor-desc">We assumed less than ₹2 Lakhs</span>
                </div>
              </div>
            </div>
          </section>

          <div className="data-source-info">
            <Info size={14} />
            <p>
              Information sourced from the National Portal of India (india.gov.in) 
              last updated on April 20, 2026.
            </p>
          </div>
        </div>

        <footer className="panel-footer">
          <button className="secondary-button" onClick={onClose}>Done</button>
          <button className="primary-button-ghost">Correct My Info <ChevronRight size={16} /></button>
        </footer>
      </div>
    </div>
  );
};

export default TrustPanel;
