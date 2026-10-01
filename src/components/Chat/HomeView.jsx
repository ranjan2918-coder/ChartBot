import { Mic, Search, GraduationCap, Tractor, UserCheck, Briefcase } from 'lucide-react';
import { strings } from '../../data/translations';
import './HomeView.css';

const HomeView = ({ onStartChat, language }) => {
  const t = strings[language];

  const categories = [
    { id: 'farmer', name: language === 'en' ? 'Farmer' : 'किसान', icon: <Tractor size={24} />, color: '#E8F5E9' },
    { id: 'student', name: language === 'en' ? 'Student' : 'छात्र', icon: <GraduationCap size={24} />, color: '#E3F2FD' },
    { id: 'senior', name: language === 'en' ? 'Senior Citizen' : 'वरिष्ठ नागरिक', icon: <UserCheck size={24} />, color: '#FFF3E0' },
    { id: 'business', name: language === 'en' ? 'Small Business' : 'छोटा व्यवसाय', icon: <Briefcase size={24} />, color: '#F3E5F5' },
  ];

  const suggestions = [
    language === 'en' ? "Scholarships for my daughter" : "मेरी बेटी के लिए छात्रवृत्ति",
    language === 'en' ? "Pension help for my father" : "मेरे पिता के लिए पेंशन सहायता",
    language === 'en' ? "Damaged crops money help" : "खराब फसलों के लिए धन सहायता",
  ];

  return (
    <div className="home-view">
      <div className="hero">
        <h2 className="greeting">{t.welcome}</h2>
        <p className="hero-sub">{t.heroSub}</p>
        <div className="trust-badge">
          <div className="dot-pulse"></div>
          <span>{t.officialData}</span>
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              className="search-input"
              onClick={() => onStartChat()}
            />
          </div>
          <button 
            className="voice-cta" 
            onClick={() => onStartChat('voice')}
            aria-label="Search by Voice"
          >
            <Mic size={24} />
          </button>
        </div>
      </div>

      <div className="suggestions-section">
        <h3 className="section-title">{t.tryAsking}</h3>
        <div className="suggestion-chips">
          {suggestions.map((s, idx) => (
            <button key={idx} className="suggestion-chip" onClick={() => onStartChat(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="categories-section">
        <h3 className="section-title">{t.categories}</h3>
        <div className="category-grid">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              className="category-card" 
              style={{ backgroundColor: cat.color }}
              onClick={() => onStartChat(cat.id)}
            >
              <div className="category-icon">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="home-footer">
        <p>{t.verified}</p>
      </footer>
    </div>
  );
};

export default HomeView;
