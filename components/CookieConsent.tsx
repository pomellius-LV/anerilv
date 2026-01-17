
import React, { useState, useEffect } from 'react';
import { Content } from '../types';

interface CookieConsentProps {
  content: Content;
}

// Add types for Google Analytics to prevent TypeScript errors
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = 'G-HTJBX98E4Z';

const loadGoogleAnalytics = () => {
  // Prevent loading if already loaded
  if (document.getElementById('google-analytics')) return;

  // 1. Load the external script tag
  const script = document.createElement('script');
  script.id = 'google-analytics';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // 2. Initialize the DataLayer and Config
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  // Attach helper to window so it can be used elsewhere if needed
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
  
  console.log('Google Analytics loaded successfully');
};

const CookieConsent: React.FC<CookieConsentProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (consent === 'granted') {
        // Consent previously granted -> Load Analytics immediately
        loadGoogleAnalytics();
      } else if (consent === 'denied') {
        // Consent previously denied -> Do NOT load Analytics, do NOT show banner
        setIsVisible(false);
      } else {
        // No choice made yet -> Show banner
        setIsVisible(true);
      }
    } catch (e) {
      // localStorage might be blocked or unavailable
      console.warn('CookieConsent: localStorage not available');
      // If we can't check consent, show the banner
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie-consent', 'granted');
      // User clicked accept -> Load Analytics now
      loadGoogleAnalytics();
    } catch (e) {
      console.warn('CookieConsent: Could not save consent');
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('cookie-consent', 'denied');
      // User clicked decline -> Do NOT load Analytics, just close banner
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
      <div className="flex gap-4">
        <button
          onClick={handleDecline}
          className="text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base"
        >
          {content.cookie.declineBtn}
        </button>
        <button
          onClick={handleAccept}
          className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-2 rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm text-sm md:text-base"
        >
          {content.cookie.btn}
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
