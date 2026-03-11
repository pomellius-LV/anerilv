
import React, { useState, useEffect, useRef } from 'react';
import { Language, View } from './types';
import { contentData } from './data/content';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import PricePage from './components/PricePage';
import Advantages from './components/Advantages';
import FAQPage from './components/FAQPage';
import TermsPage from './components/TermsPage';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import SchemaMarkup from './components/SchemaMarkup';
import GalleryPage from './components/GalleryPage';

import ArticlePage from './components/ArticlePage';

const parseUrl = (pathname: string): { lang: Language; view: View; articleId?: string } => {
  const parts = pathname.split('/').filter(Boolean);
  let lang: Language = 'lv';
  let viewStr = '';
  let articleId = '';

  if (parts[0] === 'ru' || parts[0] === 'en' || parts[0] === 'lv') {
    lang = parts[0] as Language;
    viewStr = parts[1] || 'home';
    if (viewStr === 'article') {
      articleId = parts[2] || '';
    }
  } else {
    viewStr = parts[0] || 'home';
    if (viewStr === 'article') {
      articleId = parts[1] || '';
    }
  }

  const validViews: View[] = ['home', 'prices', 'faq', 'gallery', 'terms', 'privacy', 'article'];
  const view: View = validViews.includes(viewStr as View) ? (viewStr as View) : 'home';

  return { lang, view, articleId };
};

export const generateUrl = (lang: Language, view: View, articleId?: string): string => {
  const langPrefix = lang === 'lv' ? '' : `/${lang}`;
  let viewPath = view === 'home' ? '' : `/${view}`;
  if (view === 'article' && articleId) {
    viewPath += `/${articleId}`;
  }
  return `${langPrefix}${viewPath}` || '/';
};

const App: React.FC = () => {
  const initialRoute = parseUrl(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [lang, setLangInternal] = useState<Language>(initialRoute.lang);
  const [view, setViewInternal] = useState<View>(initialRoute.view);
  const [articleId, setArticleId] = useState<string | undefined>(initialRoute.articleId);
  
  // Ref to store the scroll position of the home page
  const homeScrollRef = useRef(0);
  // Ref to track the previous view to determine scroll behavior
  const prevViewRef = useRef<View>('home');
  // Ref to track if history has been initialized
  const isHistoryInitialized = useRef(false);

  // Initial History Setup
  useEffect(() => {
    if (!isHistoryInitialized.current && typeof window !== 'undefined' && window.history) {
      try {
        if (!window.history.state) {
          const url = generateUrl(lang, view, articleId);
          window.history.replaceState({ view, lang }, '', url);
        }
      } catch (e) {
        console.warn('History API not available or restricted');
      }
      isHistoryInitialized.current = true;
    }
  }, [lang, view, articleId]);

  // Wrapper for setView that handles History API and Scroll Saving
  const setView = (newView: View) => {
    if (newView === view) return;

    // If we are leaving the home page, save the current scroll position
    if (view === 'home') {
      homeScrollRef.current = window.scrollY;
    }

    // Push the new state to the browser history
    if (typeof window !== 'undefined' && window.history) {
      try {
        const url = generateUrl(lang, newView);
        window.history.pushState({ view: newView, lang }, '', url);
      } catch (e) {
        console.warn('History pushState failed');
      }
    }

    // Update internal state
    setViewInternal(newView);
  };

  const setLang = (newLang: Language) => {
    if (newLang === lang) return;
    
    if (typeof window !== 'undefined' && window.history) {
      try {
        const url = generateUrl(newLang, view, articleId);
        window.history.pushState({ view, lang: newLang }, '', url);
      } catch (e) {
        console.warn('History pushState failed');
      }
    }
    
    setLangInternal(newLang);
  };

  // Handle the native browser "Back" button (popstate event)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const { lang: newLang, view: newView, articleId: newArticleId } = parseUrl(window.location.pathname);
      
      // If we are currently at home and leaving via Back button (or forward), save scroll
      if (view === 'home') {
        homeScrollRef.current = window.scrollY;
      }

      setLangInternal(newLang);
      setViewInternal(newView);
      setArticleId(newArticleId);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [view]);

  // Handle SEO Metadata and Scroll Restoration on View Change
  useEffect(() => {
    const data = contentData[lang];
    if (!data) return; // Safety check

    let pageTitle = data.meta.title;
    let pageDesc = data.meta.description;
    
    if (view === 'faq') pageTitle = `${data.faq.title} | Salons Aneri`;
    if (view === 'prices') pageTitle = `${data.prices.title} | Salons Aneri`;
    if (view === 'gallery') pageTitle = `${data.gallery.title} | Salons Aneri`;
    if (view === 'terms') pageTitle = `${data.terms.title} | Salons Aneri`;
    if (view === 'privacy') pageTitle = `${data.privacy.title} | Salons Aneri`;
    if (view === 'article' && articleId) {
      const article = data.articles?.find(a => a.id === articleId);
      if (article) {
        pageTitle = article.metaTitle;
        pageDesc = article.metaDescription;
      }
    }
    
    document.title = pageTitle;
    document.documentElement.lang = lang;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute('content', data.meta.keywords);

    // --- DYNAMIC HREFLANG & CANONICAL ---
    const baseUrl = 'https://aneri.lv';
    
    // Remove old alternate links
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());

    // Add new alternate links for each language
    const languages: Language[] = ['lv', 'ru', 'en'];
    languages.forEach(l => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', l);
      link.setAttribute('href', baseUrl + generateUrl(l, view, articleId));
      document.head.appendChild(link);
    });
    
    // Add x-default
    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', baseUrl + generateUrl('lv', view, articleId));
    document.head.appendChild(xDefault);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', baseUrl + generateUrl(lang, view, articleId));

    // --- SCROLL LOGIC ---
    if (view === 'home' && prevViewRef.current !== 'home') {
       // Restore scroll on home with a tiny delay to ensure paint
       setTimeout(() => {
         window.scrollTo({ top: homeScrollRef.current, behavior: 'auto' });
       }, 0);
    } else if (view !== 'home') {
       // Scroll to top for new pages
       window.scrollTo(0, 0);
    } else if (view === 'home' && prevViewRef.current === 'home') {
       // Scroll to top if clicking home logo while on home
       window.scrollTo(0, 0);
    }
    
    prevViewRef.current = view;

  }, [lang, view, articleId]);

  const currentContent = contentData[lang];
  if (!currentContent) return null;

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-rose-200">
      <SchemaMarkup content={currentContent} lang={lang} />
      <Header 
        lang={lang} 
        setLang={setLang} 
        content={currentContent} 
        view={view}
        setView={setView}
      />
      
      <main id="main-content">
        {view === 'home' && (
          <>
            <Hero content={currentContent} lang={lang} />
            <Services content={currentContent} setView={setView} />
            <Advantages content={currentContent} />
          </>
        )}
        {view === 'prices' && <PricePage content={currentContent} setView={setView} />}
        {view === 'faq' && <FAQPage content={currentContent} setView={setView} />}
        {view === 'gallery' && <GalleryPage content={currentContent} setView={setView} />}
        {view === 'article' && articleId && <ArticlePage articleId={articleId} content={currentContent} setView={setView} />}
        {view === 'terms' && <TermsPage title={currentContent.terms.title} content={currentContent.terms.content} setView={setView} homeLabel={currentContent.nav.home} />}
        {view === 'privacy' && <TermsPage title={currentContent.privacy.title} content={currentContent.privacy.content} setView={setView} homeLabel={currentContent.nav.home} />}
      </main>
      
      <Footer content={currentContent} setView={setView} />
      <CookieConsent content={currentContent} />
    </div>
  );
};

export default App;
