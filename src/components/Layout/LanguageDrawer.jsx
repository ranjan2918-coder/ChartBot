import { X, Globe } from 'lucide-react';
import './LanguageDrawer.css';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

const LanguageDrawer = ({ isOpen, onClose, currentLang, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="language-drawer" onClick={e => e.stopPropagation()}>
        <header className="drawer-header">
          <div className="drawer-title">
            <Globe size={20} />
            <h2>Select Language</h2>
          </div>
          <button onClick={onClose} aria-label="Close"><X size={24} /></button>
        </header>
        
        <div className="language-grid">
          {languages.map((l) => (
            <button 
              key={l.code} 
              className={`lang-option ${currentLang === l.code ? 'active' : ''}`}
              onClick={() => {
                onSelect(l.code);
                onClose();
              }}
            >
              <span className="lang-native">{l.native}</span>
              <span className="lang-english">{l.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageDrawer;
