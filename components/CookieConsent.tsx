
import React, { useState, useEffect } from 'react';
import { Content } from '../types';

interface CookieConsentProps {
  content: Content;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const CookieConsent: React.FC<CookieConsentProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (consent === 'granted') {
        // Apply granted state immediately if previously accepted
        if (typeof window.gtag === 'function') {
           window.gtag('consent', 'update', {
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'analytics_storage': 'granted'
           });
        }
      } else if (consent === 'denied') {
        // Do nothing, default is already denied in index.html
        setIsVisible(false);
      } else {
        // No choice made yet -> Show banner
        setIsVisible(true);
      }
    } catch (e) {
      console.warn('CookieConsent: localStorage not available');
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie-consent', 'granted');
      // Update Consent Mode to granted
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'analytics_storage': 'granted'
        });
        console.log('Google Consent Mode updated: Granted');
      }
    } catch (e) {
      console.warn('CookieConsent: Could not save consent');
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('cookie-consent', 'denied');
      // No need to call update, index.html sets it to denied by default
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
