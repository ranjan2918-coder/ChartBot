import { useState } from 'react';
import Layout from './components/Layout/Layout';
import HomeView from './components/Chat/HomeView';
import ChatView from './components/Chat/ChatView';
import { trackEvent, analyticsEvents } from './hooks/useAnalytics';
import './index.css';

function App() {
  const [view, setView] = useState('home');
  const [initialQuery, setInitialQuery] = useState('');
  const [lang, setLang] = useState('en');

  const startChat = (query = '') => {
    trackEvent(analyticsEvents.SESSION_START, { query });
    setInitialQuery(query === 'voice' ? '' : query);
    if (query === 'voice') trackEvent(analyticsEvents.VOICE_USED);
    setView('chat');
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    trackEvent(analyticsEvents.LANGUAGE_SWITCHED, { language: newLang });
  };

  return (
    <Layout currentLanguage={lang} onLanguageSelect={handleLanguageChange}>
      {view === 'home' ? (
        <HomeView onStartChat={startChat} language={lang} />
      ) : (
        <ChatView 
          initialQuery={initialQuery} 
          language={lang}
          onBack={() => setView('home')} 
        />
      )}
    </Layout>
  );
}

export default App;
