
import React, { useState, useEffect } from 'react';
import { Language, Content, View } from '../types';
import { Menu, X, Phone, Instagram, Facebook, Download } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  content: Content;
  view: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, content, view, setView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // State to store the install prompt event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to capture the PWA install prompt event
  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log("PWA Install Prompt captured");
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Function to handle the install click
  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Reset the deferred prompt variable, it can only be used once
      setDeferredPrompt(null);
    });
    
    setIsOpen(false); // Close menu after clicking
  };

  // Fix: Lock body scroll when mobile menu is open to prevent "freezing" sensation
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

  // Updated navigation handler
  const handleNavigation = (actionType: 'view' | 'scroll' | 'external', target: string) => {
    // Close menu first to ensure smooth transition
    setIsOpen(false);
    
    // Small delay to allow menu close animation to start before heavy rendering
    setTimeout(() => {
      if (actionType === 'external') {
        window.open(target, '_blank', 'noopener,noreferrer');
        return;
      }

      if (actionType === 'scroll') {
        setView('home');
        setTimeout(() => {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        return;
      }

      if (actionType === 'view') {
        setView(target as View);
        // Scroll to top when switching views via mobile menu
        window.scrollTo(0, 0);
      }
    }, 100);
  };

  const navLinks = [
    { name: content.nav.home, type: 'view', target: 'home' },
    { name: content.nav.services, type: 'scroll', target: 'services' },
    { name: content.nav.prices, type: 'view', target: 'prices' },
    { name: content.nav.gallery, type: 'view', target: 'gallery' },
    { name: content.nav.contacts, type: 'scroll', target: 'contacts' },
  ];

  const isLight = !scrolled && view === 'home';

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${!isLight ? 'bg-white/95 backdrop-blur-xl border-b border-stone-100 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <button 
          onClick={() => handleNavigation('view', 'home')} 
          className="group flex flex-col items-start leading-none focus:outline-none z-[110]"
          aria-label="Salons Aneri Home"
        >
          <span className={`text-3xl md:text-4xl font-serif font-bold transition-colors ${!isLight ? 'text-primary' : 'text-white'}`}>
            Salons <span className={!isLight ? 'text-stone-900' : 'text-stone-100'}>Aneri</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10" aria-label="Main Navigation">
          {navLinks.map((link) => (
            link.type === 'external' ? (
              <a
                key={link.name}
                href={link.target}
                target="_blank"
                rel="nofollow noreferrer noopener"
                className={`text-[11px] uppercase tracking-[0.2em] font-semibold hover:text-primary transition-all focus:outline-none ${!isLight ? 'text-stone-600' : 'text-white/90 hover:text-white'}`}
              >
                {link.name}
              </a>
            ) : (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.type as any, link.target)}
                className={`text-[11px] uppercase tracking-[0.2em] font-semibold hover:text-primary transition-all focus:outline-none ${!isLight ? 'text-stone-600' : 'text-white/90 hover:text-white'}`}
              >
                {link.name}
              </button>
            )
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
              {(['lv', 'ru', 'en'] as Language[]).map((l) => (
                <button 
                  key={l} 
                  onClick={() => setLang(l)} 
                  className={`text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-100 focus:outline-none ${lang === l ? 'text-primary' : !isLight ? 'text-stone-400 opacity-60' : 'text-white/40 opacity-40'}`}
                  aria-label={`Switch language to ${l}`}
                >
                  {l}
                </button>
              ))}
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

        {/* Mobile Burger - Enhanced click area and z-index */}
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
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => {
              // Special handling for Gallery Item in Mobile Menu to include Social Icons
              if (link.target === 'gallery') {
                return (
                  <div key={link.name} className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <button
                      onClick={() => handleNavigation(link.type as any, link.target)}
                      className="text-2xl font-serif font-bold text-stone-900 text-left active:text-primary"
                    >
                      {link.name}
                    </button>
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

              return link.type === 'external' ? (
                <a
                  key={link.name}
                  href={link.target}
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="text-2xl font-serif font-bold text-stone-900 text-left border-b border-stone-100 pb-4 active:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link.type as any, link.target)}
                  className="text-2xl font-serif font-bold text-stone-900 text-left border-b border-stone-100 pb-4 active:text-primary"
                >
                  {link.name}
                </button>
              );
            })}
            
            {/* Install App Button (Restored & Styled) */}
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
               {(['lv', 'ru', 'en'] as Language[]).map((l) => (
                <button key={l} onClick={() => { setLang(l); setIsOpen(false); }} className={`text-lg font-bold uppercase tracking-widest ${lang === l ? 'text-primary' : 'text-stone-300'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
