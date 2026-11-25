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
  onBookingCall?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  content,
  view,
  setView,
  serviceId,
  articleId,
  onBookingCall
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        !isLight
          ? 'bg-[#F5F6F8]/95 backdrop-blur-xl border-b border-slate-200/80 py-3.5 shadow-[0_1px_18px_rgba(37,40,46,0.06)]'
          : 'bg-gradient-to-b from-[#2F333B]/75 via-[#3F444E]/35 to-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex justify-between items-center gap-6">
        {/* Zone 1: Signboard Wordmark (White/Graphite 'Salons' + Deep Crimson 'Aneri') */}
        <a
          href={homeHref}
          onClick={(e) => handleAnchorLink(e, 'view', 'home')}
          className="group flex items-baseline gap-1.5 leading-none focus:outline-none z-[110] shrink-0 whitespace-nowrap"
          aria-label="Salons Aneri Home"
        >
          <span
            className={`text-2xl sm:text-3xl font-serif font-semibold tracking-tight transition-colors whitespace-nowrap ${
              !isLight ? 'text-[#25282E]' : 'text-white'
            }`}
          >
            Salons{' '}
            <span
              className={
                !isLight
                  ? 'text-[#8E1B32]'
                  : 'text-[#E33955] drop-shadow-[0_1px_10px_rgba(20,22,26,0.5)]'
              }
            >
              Aneri
            </span>
          </span>
        </a>

        {/* Zone 2: Minimalist Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleAnchorLink(e, link.type, link.target)}
              className={`relative py-1 text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors whitespace-nowrap focus:outline-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:transition-all after:duration-300 hover:after:w-full ${
                !isLight
                  ? 'text-slate-600 hover:text-[#25282E] after:bg-[#8E1B32]'
                  : 'text-white/90 hover:text-white after:bg-[#E33955]'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Switcher & Direct Call CTA */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2.5">
            {(['lv', 'ru', 'en'] as Language[]).map((l, idx) => {
              const href = generateUrl(l, view, articleId, serviceId);
              const active = lang === l;
              return (
                <React.Fragment key={l}>
                  {idx > 0 && (
                    <span
                      aria-hidden="true"
                      className={`text-[10px] ${!isLight ? 'text-slate-300' : 'text-white/25'}`}
                    >
                      /
                    </span>
                  )}
                  <a
                    href={href}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      setLang(l);
                    }}
                    className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors whitespace-nowrap focus:outline-none ${
                      active
                        ? !isLight
                          ? 'text-[#8E1B32] font-bold'
                          : 'text-white font-bold underline decoration-[#E33955] underline-offset-4'
                        : !isLight
                        ? 'text-slate-400 hover:text-slate-800'
                        : 'text-white/60 hover:text-white'
                    }`}
                    aria-label={`Switch language to ${l}`}
                  >
                    {l}
                  </a>
                </React.Fragment>
              );
            })}
          </div>

          <a
            href="tel:+37127580047"
            onClick={onBookingCall}
            className={`inline-flex items-center gap-2.5 text-sm font-sans font-semibold tracking-tight transition-colors whitespace-nowrap ${
              !isLight
                ? 'text-[#25282E] hover:text-[#8E1B32]'
                : 'text-white hover:text-[#E3E7ED]'
            }`}
            aria-label="Call Salons Aneri"
          >
            <Phone size={15} className={!isLight ? 'text-[#8E1B32]' : 'text-[#E33955]'} />
            <span className="tabular-nums tracking-wider">+371 27580047</span>
          </a>

          <a
            href="tel:+37127580047"
            onClick={onBookingCall}
            className={`px-6 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] transition-all whitespace-nowrap focus:outline-none ${
              !isLight
                ? 'bg-[#8E1B32] text-white hover:bg-[#3A3E45] shadow-sm'
                : 'bg-[#8E1B32] text-white border border-white/20 hover:bg-white hover:text-[#25282E] shadow-sm'
            }`}
            aria-label="Book an appointment by phone"
          >
            {content.nav.bookBtn}
          </a>
        </div>

        {/* Mobile Burger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden transition-colors focus:outline-none relative z-[110] p-2 -mr-2 ${
            isOpen ? 'text-[#25282E]' : !isLight ? 'text-[#25282E]' : 'text-white'
          }`}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#F5F6F8] z-[105] flex flex-col pt-24 px-8 space-y-8 animate-in fade-in slide-in-from-right duration-300 overflow-y-auto h-screen">
          <nav className="flex flex-col space-y-6" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              if (link.target === 'gallery') {
                return (
                  <div key={link.name} className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorLink(e, link.type, link.target)}
                      className="text-2xl font-serif font-semibold text-[#25282E] text-left active:text-primary"
                    >
                      {link.name}
                    </a>
                    <div className="flex items-center gap-6">
                      <a
                        href="https://www.instagram.com/salons_aneri/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700 hover:text-[#E1306C] transition-colors"
                        onClick={() => setIsOpen(false)}
                        aria-label="Instagram"
                      >
                        <Instagram size={24} />
                      </a>
                      <a
                        href="https://www.facebook.com/61568612101531/about/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700 hover:text-[#1877F2] transition-colors"
                        onClick={() => setIsOpen(false)}
                        aria-label="Facebook"
                      >
                        <Facebook size={24} />
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
                  className="text-2xl font-serif font-semibold text-[#25282E] text-left border-b border-slate-200/80 pb-4 active:text-primary"
                >
                  {link.name}
                </a>
              );
            })}

            {deferredPrompt && (
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 animate-in fade-in slide-in-from-right duration-500">
                <button
                  onClick={handleInstallClick}
                  className="text-2xl font-serif font-semibold text-[#25282E] text-left active:text-primary"
                >
                  {content.nav.installApp}
                </button>
                <button
                  onClick={handleInstallClick}
                  className="text-slate-700 hover:text-primary transition-colors p-2"
                  aria-label="Install App"
                >
                  <Download size={24} />
                </button>
              </div>
            )}
          </nav>

          <div className="pt-4 space-y-6 pb-24">
            <a
              href="tel:+37127580047"
              onClick={(e) => {
                setIsOpen(false);
                onBookingCall?.(e);
              }}
              className="flex items-center justify-center gap-3 w-full bg-[#8E1B32] hover:bg-[#3A3E45] text-white py-5 rounded-full font-sans font-bold text-xl shadow-lg transition-colors"
            >
              <Phone size={22} /> <span className="tabular-nums">+371 27580047</span>
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
                    className={`text-base font-bold uppercase tracking-widest ${
                      lang === l ? 'text-[#8E1B32]' : 'text-slate-400'
                    }`}
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
