import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { useRigaSalonStatus } from '../utils/salonHours';
import { Clock, Phone } from 'lucide-react';

interface MobileCallDockProps {
  lang: Language;
  callLabel: string;
  onBookingCall?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const MobileCallDock: React.FC<MobileCallDockProps> = ({
  lang,
  callLabel,
  onBookingCall
}) => {
  const status = useRigaSalonStatus(lang);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setScrolledPastHero(window.scrollY > 380);
    };
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const checkOverlays = () => {
      setCookieBannerVisible(Boolean(document.getElementById('cookie-consent-banner')));
      setNavDrawerOpen(document.body.style.overflow === 'hidden');
    };

    checkOverlays();
    const domObserver = new MutationObserver(checkOverlays);
    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });

    const footerEl = document.getElementById('contacts');
    let io: IntersectionObserver | null = null;
    if (footerEl && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          setFooterVisible(Boolean(entries[0]?.isIntersecting));
        },
        { threshold: 0.05 }
      );
      io.observe(footerEl);
    }

    return () => {
      domObserver.disconnect();
      io?.disconnect();
    };
  }, []);

  const isVisible =
    scrolledPastHero && !cookieBannerVisible && !footerVisible && !navDrawerOpen;

  return (
    <div
      id="mobile-call-dock"
      data-visible={isVisible ? 'true' : 'false'}
      aria-hidden={!isVisible}
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-all duration-200 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-signboard-metal border-t border-slate-500/45 shadow-[0_-8px_28px_rgba(31,34,39,0.32)] px-4 py-2.5 flex items-center justify-between gap-3 relative">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
          aria-hidden="true"
        />

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#E3E7ED] truncate">
            <Clock
              size={12}
              className={`shrink-0 ${status.isOpen ? 'text-[#E33955]' : 'text-[#C7CDD6]'}`}
            />
            <span className="truncate">{status.statusText}</span>
          </div>
          <span className="block text-xs font-sans font-bold tabular-nums text-white tracking-wide">
            +371 27580047
          </span>
        </div>

        <a
          href="tel:+37127580047"
          onClick={onBookingCall}
          tabIndex={isVisible ? 0 : -1}
          className="shrink-0 inline-flex items-center gap-2 bg-[#8E1B32] active:bg-[#6E1225] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] border border-white/15 shadow-md whitespace-nowrap"
        >
          <Phone size={14} />
          <span>{callLabel}</span>
        </a>
      </div>
    </div>
  );
};

export default MobileCallDock;
