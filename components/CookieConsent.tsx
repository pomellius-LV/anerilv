
import React, { useState, useEffect } from 'react';
import { Content } from '../types';

interface CookieConsentProps {
  content: Content;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch (e) {
      // localStorage might be blocked or unavailable
      console.warn('CookieConsent: localStorage not available');
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie-consent', 'true');
    } catch (e) {
      console.warn('CookieConsent: Could not save consent');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-rose-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 md:p-6 z-50 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-500">
      <div className="text-slate-700 text-sm md:text-base text-center md:text-left">
        {content.cookie.text}
      </div>
      <button
        onClick={handleAccept}
        className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
      >
        {content.cookie.btn}
      </button>
    </div>
  );
};

export default CookieConsent;
