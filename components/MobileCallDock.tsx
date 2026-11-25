import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { useRigaSalonStatus } from '../utils/salonHours';
import { Clock, Phone, X } from 'lucide-react';

interface MobileCallDockProps {
  lang: Language;
  callLabel: string;
  onBookingCall?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const INVITE_HINT: Record<Language, { open: string; closed: string }> = {
  lv: { open: 'Zvanīt pierakstam', closed: 'Pieraksts · P.–S. 09:00' },
  ru: { open: 'Позвонить администратору', closed: 'Запись · Пн–Сб с 09:00' },
  en: { open: 'Call to book', closed: 'Book · Mon–Sat 09:00' }
};

const MobileCallDock: React.FC<MobileCallDockProps> = ({
  lang,
  callLabel,
  onBookingCall
}) => {
  const status = useRigaSalonStatus(lang);
  const hint = INVITE_HINT[lang] || INVITE_HINT.lv;

  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [dwellElapsed, setDwellElapsed] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [desktopDismissed, setDesktopDismissed] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setScrolledEnough(window.scrollY > 140);
    };
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });

    const dwellTimer = window.setTimeout(() => {
      setDwellElapsed(true);
    }, 6000);

    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.clearTimeout(dwellTimer);
    };
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

  const triggered = scrolledEnough || dwellElapsed;
  const mobileBarVisible = triggered && !footerVisible && !navDrawerOpen;
  const desktopInviteVisible = triggered && !footerVisible && !desktopDismissed;

  return (
    <>
      {/* Mobile Smart Call Invitation: full bottom dock once cookies dismissed, or clean floating pill above cookie bar */}
      {cookieBannerVisible ? (
        <div
          id="mobile-call-dock"
          data-visible={mobileBarVisible ? 'true' : 'false'}
          aria-hidden={!mobileBarVisible}
          className={`md:hidden fixed bottom-28 right-4 z-[60] transition-all duration-300 ${
            mobileBarVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-6 opacity-0 pointer-events-none'
          }`}
        >
          <a
            href="tel:+37127580047"
            onClick={onBookingCall}
            tabIndex={mobileBarVisible ? 0 : -1}
            className="inline-flex items-center gap-2.5 bg-[#8E1B32] active:bg-[#6E1225] text-white px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.14em] border border-white/25 shadow-2xl whitespace-nowrap"
          >
            <Phone size={15} />
            <span>{callLabel}</span>
            <span className="tabular-nums opacity-90">· 27580047</span>
          </a>
        </div>
      ) : (
        <div
          id="mobile-call-dock"
          data-visible={mobileBarVisible ? 'true' : 'false'}
          aria-hidden={!mobileBarVisible}
          className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
            mobileBarVisible
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
              tabIndex={mobileBarVisible ? 0 : -1}
              className="shrink-0 inline-flex items-center gap-2 bg-[#8E1B32] active:bg-[#6E1225] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] border border-white/15 shadow-md whitespace-nowrap"
            >
              <Phone size={14} />
              <span>{callLabel}</span>
            </a>
          </div>
        </div>
      )}

      {/* Tablet / Desktop Subtle Floating Call Invite (bottom-left so never collides with Snow HUD on bottom-right) */}
      <div
        aria-hidden={!desktopInviteVisible}
        className={`hidden md:flex fixed left-5 z-40 items-center gap-2 transition-all duration-300 ${
          cookieBannerVisible ? 'bottom-24' : 'bottom-5'
        } ${
          desktopInviteVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-6 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-signboard-metal border border-slate-500/45 rounded-full pl-4 pr-2 py-1.5 shadow-2xl flex items-center gap-3 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
            aria-hidden="true"
          />
          <a
            href="tel:+37127580047"
            onClick={onBookingCall}
            tabIndex={desktopInviteVisible ? 0 : -1}
            className="flex items-center gap-2.5 text-white hover:text-[#E33955] transition-colors py-1"
          >
            <span className="w-7 h-7 rounded-full bg-[#8E1B32] text-white flex items-center justify-center shrink-0">
              <Phone size={13} />
            </span>
            <span className="text-left leading-tight pr-1">
              <span className="block text-[10px] uppercase tracking-[0.14em] text-[#C7CDD6]">
                {status.isOpen ? hint.open : hint.closed}
              </span>
              <span className="block text-xs font-sans font-bold tabular-nums text-white">
                +371 27580047
              </span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setDesktopDismissed(true)}
            aria-label="Hide call prompt"
            tabIndex={desktopInviteVisible ? 0 : -1}
            className="w-6 h-6 rounded-full text-[#C7CDD6] hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileCallDock;
