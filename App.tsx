import React, { useState, useEffect, useRef } from 'react';
import { Language, View } from './types';
import {
  parseSeoRoute,
  buildSeoUrl,
  THEMATIC_SERVICES_SEO,
  STATIC_PAGES_SEO,
  ServiceSectionId
} from './data/seoRoutes';
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
import ServiceLandingPage from './components/ServiceLandingPage';
import AdminPanel from './components/AdminPanel';
import SnowOverlay from './components/SnowOverlay';
import OffHoursCallModal from './components/OffHoursCallModal';
import MobileCallDock from './components/MobileCallDock';
import { dataService } from './services/dataService';
import { isSalonOpenInRigaNow } from './utils/salonHours';

export const generateUrl = (
  lang: Language,
  view: View,
  articleId?: string,
  serviceId?: ServiceSectionId
): string => {
  return buildSeoUrl(lang, view, { articleId, serviceId });
};

const App: React.FC = () => {
  const initialRoute = parseSeoRoute(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [lang, setLangInternal] = useState<Language>(initialRoute.lang);
  const [view, setViewInternal] = useState<View>(initialRoute.view);
  const [articleId, setArticleId] = useState<string | undefined>(initialRoute.articleId);
  const [serviceId, setServiceId] = useState<ServiceSectionId | undefined>(initialRoute.serviceId);
  const [offHoursModalOpen, setOffHoursModalOpen] = useState(false);

  const handleBookingCall = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!isSalonOpenInRigaNow()) {
      e.preventDefault();
      setOffHoursModalOpen(true);
    }
  };

  const homeScrollRef = useRef(0);
  const prevViewRef = useRef<View>('home');
  const isHistoryInitialized = useRef(false);

  // Initial History Setup
  useEffect(() => {
    if (!isHistoryInitialized.current && typeof window !== 'undefined' && window.history) {
      try {
        if (!window.history.state) {
          const url = buildSeoUrl(lang, view, { articleId, serviceId });
          window.history.replaceState({ view, lang, articleId, serviceId }, '', url);
        }
      } catch {
        console.warn('History API not available or restricted');
      }
      isHistoryInitialized.current = true;
    }
  }, [lang, view, articleId, serviceId]);

  const navigateTo = (
    newView: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => {
    const nextServiceId = newView === 'service' ? options?.serviceId : undefined;
    const nextArticleId = newView === 'article' ? options?.articleId : undefined;

    if (
      newView === view &&
      nextServiceId === serviceId &&
      nextArticleId === articleId
    ) {
      return;
    }

    if (view === 'home') {
      homeScrollRef.current = window.scrollY;
    }

    if (typeof window !== 'undefined' && window.history) {
      try {
        const url = buildSeoUrl(lang, newView, {
          serviceId: nextServiceId,
          articleId: nextArticleId
        });
        window.history.pushState(
          { view: newView, lang, serviceId: nextServiceId, articleId: nextArticleId },
          '',
          url
        );
      } catch {
        console.warn('History pushState failed');
      }
    }

    setServiceId(nextServiceId);
    setArticleId(nextArticleId);
    setViewInternal(newView);
  };

  // Backwards-compatible view setter
  const setView = (newView: View) => {
    navigateTo(newView);
  };

  const setLang = (newLang: Language) => {
    if (newLang === lang) return;

    if (typeof window !== 'undefined' && window.history) {
      try {
        const url = buildSeoUrl(newLang, view, { serviceId, articleId });
        window.history.pushState({ view, lang: newLang, serviceId, articleId }, '', url);
      } catch {
        console.warn('History pushState failed');
      }
    }

    setLangInternal(newLang);
  };

  // Handle browser Back/Forward
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseSeoRoute(window.location.pathname);

      if (view === 'home') {
        homeScrollRef.current = window.scrollY;
      }

      setLangInternal(parsed.lang);
      setViewInternal(parsed.view);
      setArticleId(parsed.articleId);
      setServiceId(parsed.serviceId);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [view]);

  // Reactive subscription to live dataService (D1 sync)
  const [, setContentTick] = useState(0);
  useEffect(() => {
    return dataService.subscribe(() => {
      setContentTick(t => t + 1);
    });
  }, []);

  useEffect(() => {
    dataService.fetchLiveServices(lang);
  }, [lang]);

  useEffect(() => {
    dataService.fetchPublicSettings();
  }, []);

  // Dynamic Client SEO Metadata & Scroll Restoration
  useEffect(() => {
    const data = dataService.getMergedContent(lang);
    if (!data) return;

    let pageTitle = STATIC_PAGES_SEO.home[lang].title;
    let pageDesc = STATIC_PAGES_SEO.home[lang].description;
    let pageKeywords = data.meta.keywords;

    if (view === 'admin') {
      pageTitle = 'Salons Aneri — Slēgtā Administratora Sistēma | aneri.lv';
      pageDesc = 'Salons Aneri administrācijas sistēma: pakalpojumu, cenu un satura pārvaldība.';
    } else if (view === 'service' && serviceId && THEMATIC_SERVICES_SEO[serviceId]) {
      const svcSeo = THEMATIC_SERVICES_SEO[serviceId];
      pageTitle = svcSeo.titles[lang];
      pageDesc = svcSeo.descriptions[lang];
      pageKeywords = svcSeo.keywords[lang];
    } else if (view === 'faq') {
      pageTitle = STATIC_PAGES_SEO.faq[lang].title;
      pageDesc = STATIC_PAGES_SEO.faq[lang].description;
    } else if (view === 'prices') {
      pageTitle = STATIC_PAGES_SEO.prices[lang].title;
      pageDesc = STATIC_PAGES_SEO.prices[lang].description;
    } else if (view === 'gallery') {
      pageTitle = STATIC_PAGES_SEO.gallery[lang].title;
      pageDesc = STATIC_PAGES_SEO.gallery[lang].description;
    } else if (view === 'terms') {
      pageTitle = STATIC_PAGES_SEO.terms[lang].title;
      pageDesc = STATIC_PAGES_SEO.terms[lang].description;
    } else if (view === 'privacy') {
      pageTitle = STATIC_PAGES_SEO.privacy[lang].title;
      pageDesc = STATIC_PAGES_SEO.privacy[lang].description;
    } else if (view === 'article' && articleId) {
      const article = data.articles?.find(a => a.id === articleId);
      if (article) {
        pageTitle = article.metaTitle;
        pageDesc = article.metaDescription;
      }
    }

    document.title = pageTitle;
    document.documentElement.lang = lang;

    const updateOrCreateMeta = (property: string, content: string, isName = false) => {
      const selector = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(isName ? 'name' : 'property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateOrCreateMeta('description', pageDesc, true);
    updateOrCreateMeta('keywords', pageKeywords, true);
    updateOrCreateMeta('robots', view === 'admin' ? 'noindex, nofollow' : 'index, follow', true);

    const baseUrl = 'https://aneri.lv';
    const currentUrl = baseUrl + buildSeoUrl(lang, view, { serviceId, articleId });
    const ogType = view === 'article' ? 'article' : 'website';
    const ogImage =
      view === 'service' && serviceId
        ? `${baseUrl}/assets/services/${serviceId}.jpg`
        : `${baseUrl}/assets/services/hair.jpg`;

    updateOrCreateMeta('og:type', ogType);
    updateOrCreateMeta('og:title', pageTitle);
    updateOrCreateMeta('og:description', pageDesc);
    updateOrCreateMeta('og:url', currentUrl);
    updateOrCreateMeta('og:image', ogImage);
    updateOrCreateMeta('twitter:title', pageTitle, true);
    updateOrCreateMeta('twitter:description', pageDesc, true);
    updateOrCreateMeta('twitter:url', currentUrl, true);
    updateOrCreateMeta('twitter:image', ogImage, true);

    if (view !== 'admin') {
      document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());

      const languages: Language[] = ['lv', 'ru', 'en'];
      languages.forEach(l => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', l);
        link.setAttribute('href', baseUrl + buildSeoUrl(l, view, { serviceId, articleId }));
        document.head.appendChild(link);
      });

      const xDefault = document.createElement('link');
      xDefault.setAttribute('rel', 'alternate');
      xDefault.setAttribute('hreflang', 'x-default');
      xDefault.setAttribute('href', baseUrl + buildSeoUrl('lv', view, { serviceId, articleId }));
      document.head.appendChild(xDefault);

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', currentUrl);
    }

    if (view === 'home' && prevViewRef.current !== 'home') {
      setTimeout(() => {
        window.scrollTo({ top: homeScrollRef.current, behavior: 'auto' });
      }, 0);
    } else if (view !== 'home') {
      window.scrollTo(0, 0);
    } else if (view === 'home' && prevViewRef.current === 'home') {
      window.scrollTo(0, 0);
    }

    prevViewRef.current = view;
  }, [lang, view, articleId, serviceId]);

  if (view === 'admin') {
    return <AdminPanel setView={setView} />;
  }

  const currentContent = dataService.getMergedContent(lang);
  if (!currentContent) return null;

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#25282E] selection:bg-slate-200 selection:text-[#8E1B32]">
      <SchemaMarkup
        content={currentContent}
        lang={lang}
        view={view}
        serviceId={serviceId}
        articleId={articleId}
      />
      <Header
        lang={lang}
        setLang={setLang}
        content={currentContent}
        view={view}
        setView={setView}
        serviceId={serviceId}
        articleId={articleId}
        onBookingCall={handleBookingCall}
      />

      <main id="main-content">
        {view === 'home' && (
          <>
            <Hero content={currentContent} lang={lang} onBookingCall={handleBookingCall} />
            <Services lang={lang} content={currentContent} onNavigate={navigateTo} />
            <Advantages content={currentContent} lang={lang} onBookingCall={handleBookingCall} />
          </>
        )}
        {view === 'service' && serviceId && (
          <ServiceLandingPage
            serviceId={serviceId}
            lang={lang}
            content={currentContent}
            onNavigate={navigateTo}
            onBookingCall={handleBookingCall}
          />
        )}
        {view === 'prices' && (
          <PricePage
            lang={lang}
            content={currentContent}
            onNavigate={navigateTo}
            onBookingCall={handleBookingCall}
          />
        )}
        {view === 'faq' && <FAQPage lang={lang} content={currentContent} setView={setView} />}
        {view === 'gallery' && <GalleryPage lang={lang} content={currentContent} setView={setView} />}
        {view === 'article' && articleId && (
          <ArticlePage
            articleId={articleId}
            lang={lang}
            content={currentContent}
            onNavigate={navigateTo}
            onBookingCall={handleBookingCall}
          />
        )}
        {view === 'terms' && (
          <TermsPage
            lang={lang}
            title={currentContent.terms.title}
            content={currentContent.terms.content}
            setView={setView}
            homeLabel={currentContent.nav.home}
          />
        )}
        {view === 'privacy' && (
          <TermsPage
            lang={lang}
            title={currentContent.privacy.title}
            content={currentContent.privacy.content}
            setView={setView}
            homeLabel={currentContent.nav.home}
          />
        )}
      </main>

      <Footer
        lang={lang}
        content={currentContent}
        onNavigate={navigateTo}
        onBookingCall={handleBookingCall}
      />
      <CookieConsent content={currentContent} />
      <MobileCallDock
        lang={lang}
        callLabel={currentContent.nav.bookBtn}
        onBookingCall={handleBookingCall}
      />
      <OffHoursCallModal
        isOpen={offHoursModalOpen}
        lang={lang}
        onClose={() => setOffHoursModalOpen(false)}
      />
      <SnowOverlay config={dataService.getSnowConfig()} lang={lang} />
    </div>
  );
};

export default App;
