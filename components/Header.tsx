import React, { useState, useEffect } from 'react';
import { Language, Content, View } from '../types';
import { ServiceSectionId } from '../data/seoRoutes';
import { Menu, X, Phone, Instagram, Facebook, Download } from 'lucide-react';
import { generateUrl } from '../App';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  content: Content;
  view: View;
  setView: (view: View) => void;
  serviceId?: ServiceSectionId;
  articleId?: string;
}

const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  content,
  view,
  setView,
  serviceId,
  articleId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
    });
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAnchorLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    actionType: 'view' | 'scroll',
    target: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setIsOpen(false);

    setTimeout(() => {
      if (actionType === 'scroll') {
        if (target === 'contacts') {
          document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        setView('home');
        setTimeout(() => {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        return;
      }

      if (actionType === 'view') {
        setView(target as View);
        window.scrollTo(0, 0);
      }
    }, 80);
  };

  const homeHref = generateUrl(lang, 'home');
  const navLinks: Array<{
    name: string;
    type: 'view' | 'scroll';
    target: string;
    href: string;
  }> = [
    { name: content.nav.home, type: 'view', target: 'home', href: homeHref },
    {
      name: content.nav.services,
      type: 'scroll',
      target: 'services',
      href: `${homeHref === '/' ? '' : homeHref}/#services`
    },
    { name: content.nav.prices, type: 'view', target: 'prices', href: generateUrl(lang, 'prices') },
    { name: content.nav.gallery, type: 'view', target: 'gallery', href: generateUrl(lang, 'gallery') },
    {
      name: content.nav.contacts,
      type: 'scroll',
      target: 'contacts',
      href: '#contacts'
    }
  ];

  const isLight = !scrolled && view === 'home';

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${!isLight ? 'bg-white/95 backdrop-blur-xl border-b border-stone-100 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Crawlable Brand Home Link */}
        <a
          href={homeHref}
          onClick={(e) => handleAnchorLink(e, 'view', 'home')}
          className="group flex flex-col items-start leading-none focus:outline-none z-[110]"
          aria-label="Salons Aneri Home"
        >
          <span className={`text-3xl md:text-4xl font-serif font-bold transition-colors ${!isLight ? 'text-primary' : 'text-white'}`}>
            Salons <span className={!isLight ? 'text-stone-900' : 'text-stone-100'}>Aneri</span>
          </span>
        </a>

        {/* Desktop Nav using real <a> links for crawlers */}
        <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleAnchorLink(e, link.type, link.target)}
              className={`text-[11px] uppercase tracking-[0.2em] font-semibold hover:text-primary transition-all focus:outline-none ${!isLight ? 'text-stone-600' : 'text-white/90 hover:text-white'}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Contact & Language */}
        <div className="hidden lg:flex items-center space-x-10">
          <div className="flex flex-col items-end">
            <a
              href="tel:+37127580047"
              className={`flex items-center gap-2 text-xl font-sans font-bold tracking-tight transition-all hover:text-primary ${!isLight ? 'text-stone-900' : 'text-white'}`}
              aria-label="Call Salons Aneri"
            >
              <Phone size={18} className="text-primary" />
              <span className="tabular-nums font-sans tracking-wider">+371 27580047</span>
            </a>
            <div className="flex gap-4 mt-1">
              {(['lv', 'ru', 'en'] as Language[]).map((l) => {
                const href = generateUrl(l, view, articleId, serviceId);
                return (
                  <a
                    key={l}
                    href={href}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      setLang(l);
                    }}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-100 focus:outline-none ${lang === l ? 'text-primary' : !isLight ? 'text-stone-400 opacity-60' : 'text-white/40 opacity-40'}`}
                    aria-label={`Switch language to ${l}`}
                  >
                    {l}
                  </a>
                );
              })}
            </div>
          </div>
          <a
            href="tel:+37127580047"
            className="bg-primary text-white px-8 py-3 rounded-full text-[12px] font-bold uppercase tracking-wider hover:bg-stone-900 transition-colors shadow-lg focus:outline-none"
            aria-label="Book an appointment"
          >
            {content.nav.bookBtn}
          </a>
        </div>

        {/* Mobile Burger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden transition-colors focus:outline-none relative z-[110] p-2 -mr-2 ${isOpen ? 'text-stone-900' : (!isLight ? 'text-stone-900' : 'text-white')}`}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-[105] flex flex-col pt-24 px-8 space-y-8 animate-in fade-in slide-in-from-right duration-300 overflow-y-auto h-screen">
          <nav className="flex flex-col space-y-6" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              if (link.target === 'gallery') {
                return (
                  <div key={link.name} className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorLink(e, link.type, link.target)}
                      className="text-2xl font-serif font-bold text-stone-900 text-left active:text-primary"
                    >
                      {link.name}
                    </a>
                    <div className="flex items-center gap-6">
                      <a
                        href="https://www.instagram.com/salons_aneri/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-800 hover:text-[#E1306C] transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Instagram size={28} />
                      </a>
                      <a
                        href="https://www.facebook.com/61568612101531/about/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-800 hover:text-[#1877F2] transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Facebook size={28} />
                      </a>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleAnchorLink(e, link.type, link.target)}
                  className="text-2xl font-serif font-bold text-stone-900 text-left border-b border-stone-100 pb-4 active:text-primary"
                >
                  {link.name}
                </a>
              );
            })}

            {deferredPrompt && (
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 animate-in fade-in slide-in-from-right duration-500 delay-100">
                <button
                  onClick={handleInstallClick}
                  className="text-2xl font-serif font-bold text-stone-900 text-left active:text-primary"
                >
                  {content.nav.installApp}
                </button>
                <button
                  onClick={handleInstallClick}
                  className="text-stone-800 hover:text-primary transition-colors p-2"
                  aria-label="Install App"
                >
                  <Download size={28} />
                </button>
              </div>
            )}
          </nav>

          <div className="pt-4 space-y-6 pb-24">
            <a href="tel:+37127580047" className="flex items-center justify-center gap-3 w-full bg-primary text-white py-5 rounded-2xl font-sans font-bold text-2xl shadow-xl">
              <Phone size={24} /> <span className="tabular-nums">+371 27580047</span>
            </a>
            <div className="flex justify-center gap-8">
              {(['lv', 'ru', 'en'] as Language[]).map((l) => {
                const href = generateUrl(l, view, articleId, serviceId);
                return (
                  <a
                    key={l}
                    href={href}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      setLang(l);
                      setIsOpen(false);
                    }}
                    className={`text-lg font-bold uppercase tracking-widest ${lang === l ? 'text-primary' : 'text-stone-300'}`}
                  >
                    {l}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
