import { useState, useEffect } from 'react';
import { Globe, Menu, Bookmark, CheckCircle } from 'lucide-react';
import LanguageDrawer from './LanguageDrawer';
import './Layout.css';

const Layout = ({ children, currentLanguage, onLanguageSelect }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    // Check if backend is alive
    const checkServer = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/health`).catch(() => null);
        if (res && res.ok) setServerStatus('online');
        else setServerStatus('offline');
      } catch {
        setServerStatus('offline');
      }
    };
    checkServer();
  }, []);

  const langDisplay = {
    en: 'English', hi: 'हिन्दी', ta: 'தமிழ்', te: 'తెలుగు', kn: 'ಕನ್ನಡ', ml: 'മലയാളം'
  };

  return (
    <div className="app-container">
      {/* LEFT SIDEBAR: PROFILE & CONTEXT (DESKTOP ONLY) */}
      <aside className="sidebar sidebar-left">
        <div className="sidebar-group">
          <h3 className="sidebar-title">Profile Context</h3>
          <div className="profile-summary-card">
            <div className="profile-item">
              <span className="label">Location:</span>
              <span className="value">Uttar Pradesh</span>
            </div>
            <div className="profile-item">
              <span className="label">Category:</span>
              <span className="value">Farmer</span>
            </div>
            <div className="profile-item">
              <span className="label">Language:</span>
              <span className="value">{langDisplay[currentLanguage]}</span>
            </div>
            <button className="edit-btn">Edit Details</button>
          </div>
        </div>

        <div className="sidebar-group">
          <h3 className="sidebar-title">System Status</h3>
          <div className={`status-pill ${serverStatus}`}>
             <div className="status-dot"></div>
             <span>Server is {serverStatus}</span>
          </div>
          {serverStatus === 'offline' && (
            <p className="status-tip">Using Mock Mode for UI testing.</p>
          )}
        </div>
      </aside>

      {/* CENTER: MAIN CHAT AREA */}
      <div className="app-shell">
        <header className="main-header">
          <div className="header-content">
            <div className="brand">
              <div className="brand-logo">
                <div className="emblem-circle"></div>
              </div>
              <div className="brand-text">
                <h1>Mera Adhikar</h1>
              </div>
            </div>
            
            <nav className="header-actions">
              <button 
                className="lang-toggle" 
                onClick={() => setIsLangOpen(true)}
              >
                <Globe size={18} />
                <span>{langDisplay[currentLanguage]}</span>
              </button>
              <button className="icon-menu">
                <Menu size={24} />
              </button>
            </nav>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>

      {/* RIGHT SIDEBAR: SAVED & CHECKLIST (DESKTOP ONLY) */}
      <aside className="sidebar sidebar-right">
        <div className="sidebar-group">
           <h3 className="sidebar-title">Saved Benefits</h3>
           <div className="empty-sidebar-state">
              <Bookmark size={32} opacity={0.2} />
              <p>Your saved schemes will appear here.</p>
           </div>
        </div>
        
        <div className="sidebar-group">
           <h3 className="sidebar-title">Latest Documents</h3>
           <div className="doc-mini-card">
              <CheckCircle size={14} color="#2E7D32" />
              <span>Aadhaar Card</span>
           </div>
        </div>
      </aside>

      <LanguageDrawer 
        isOpen={isLangOpen} 
        onClose={() => setIsLangOpen(false)}
        currentLang={currentLanguage}
        onSelect={onLanguageSelect}
      />
    </div>
  );
};

export default Layout;
