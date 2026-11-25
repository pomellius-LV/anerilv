import React from 'react';
import { Content, Language, View } from '../types';
import {
  SERVICE_SECTION_IDS,
  THEMATIC_SERVICES_SEO,
  ServiceSectionId,
  buildSeoUrl
} from '../data/seoRoutes';
import { MapPin, Phone, Clock, Instagram, Facebook, ArrowUpRight, Lock } from 'lucide-react';

interface FooterProps {
  lang: Language;
  content: Content;
  onNavigate: (
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => void;
  onBookingCall?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Footer: React.FC<FooterProps> = ({ lang, content, onNavigate, onBookingCall }) => {
  const { footer, nav } = content;
  const mapUrl = "https://www.google.com/maps/place/56%C2%B054'30.6%22N+24%C2%B010'56.3%22E/@56.9085003,24.1822941,17z/";
  const instagramUrl = "https://www.instagram.com/salons_aneri/";
  const facebookUrl = "https://www.facebook.com/61568612101531/about/";

  const handleLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(view, options);
  };

  return (
    <footer
      id="contacts"
      className="bg-signboard-metal border-t border-slate-500/40 pt-20 pb-12 overflow-hidden relative text-white"
    >
      {/* Signature Matrix Crimson Hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 lg:gap-14 mb-16">
          {/* Logo & About */}
          <div className="col-span-1">
            <a
              href={buildSeoUrl(lang, 'home')}
              onClick={(e) => handleLink(e, 'home')}
              className="inline-block text-4xl font-serif font-bold text-white mb-6 tracking-tight focus:outline-none"
            >
              Salons <span className="text-[#E33955]">Aneri</span>
            </a>
            <p className="leading-relaxed mb-8 text-[#E3E7ED]/90 font-light text-base">
              Mūsu mērķis ir sniegt Jums visaugstākās kvalitātes skaistumkopšanas pakalpojumus Rīgā, Ķengarāgā.
            </p>
            <div className="flex gap-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="nofollow noreferrer noopener"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-[#E3E7ED] hover:bg-[#8E1B32] hover:border-[#E33955] hover:text-white transition-all duration-300"
                aria-label="Visit our Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="nofollow noreferrer noopener"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-[#E3E7ED] hover:bg-[#8E1B32] hover:border-[#E33955] hover:text-white transition-all duration-300"
                aria-label="Visit our Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer Navigation">
            <h3 className="text-white font-serif font-semibold mb-8 text-lg tracking-wider uppercase flex items-center gap-3">
              {footer.quickLinks}
              <span className="h-px w-8 bg-[#E33955]/70" />
            </h3>
            <ul className="space-y-3.5 text-sm font-medium text-[#E3E7ED]">
              <li>
                <a
                  href={buildSeoUrl(lang, 'home')}
                  onClick={(e) => handleLink(e, 'home')}
                  className="flex items-center gap-2 hover:text-white hover:translate-x-1.5 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  {nav.home}
                </a>
              </li>
              <li>
                <a
                  href={buildSeoUrl(lang, 'faq')}
                  onClick={(e) => handleLink(e, 'faq')}
                  className="flex items-center gap-2 hover:text-white hover:translate-x-1.5 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  {nav.faq}
                </a>
              </li>
              <li>
                <a
                  href={buildSeoUrl(lang, 'prices')}
                  onClick={(e) => handleLink(e, 'prices')}
                  className="flex items-center gap-2 hover:text-white hover:translate-x-1.5 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  {nav.prices}
                </a>
              </li>
              <li>
                <a
                  href={buildSeoUrl(lang, 'gallery')}
                  onClick={(e) => handleLink(e, 'gallery')}
                  className="flex items-center gap-2 hover:text-white hover:translate-x-1.5 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  {nav.gallery}
                </a>
              </li>
              <li>
                <a
                  href="https://5plus.lv"
                  rel="dofollow"
                  className="flex items-center gap-2 hover:text-white hover:translate-x-1.5 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  Noderīgas saites
                </a>
              </li>
            </ul>
          </nav>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-serif font-semibold mb-8 text-lg tracking-wider uppercase flex items-center gap-3">
              {footer.addressLabel}
              <span className="h-px w-8 bg-[#E33955]/70" />
            </h3>
            <div className="space-y-7">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
                aria-label="View our location on Google Maps"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[#E33955] group-hover:bg-[#8E1B32] group-hover:text-white transition-colors duration-300">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-white font-medium text-base leading-snug group-hover:text-[#E33955] transition-colors">
                    Latgales iela 264
                  </span>
                  <span className="text-[#C7CDD6] text-sm font-light">Rīga, Ķengarags</span>
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#E33955] mt-1.5 tracking-widest opacity-85 group-hover:opacity-100 transition-opacity">
                    Atvērt kartē <ArrowUpRight size={11} />
                  </span>
                </div>
              </a>
              <a
                href="tel:+37127580047"
                onClick={onBookingCall}
                className="flex items-center gap-4 group"
                aria-label="Call us"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[#E33955] group-hover:bg-[#8E1B32] group-hover:text-white transition-colors duration-300">
                  <Phone size={18} />
                </div>
                <span className="text-xl sm:text-2xl font-sans font-bold tracking-tight tabular-nums text-white group-hover:text-[#E33955] transition-colors">
                  +371 27580047
                </span>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-serif font-semibold mb-8 text-lg tracking-wider uppercase flex items-center gap-3">
              {footer.hoursLabel}
              <span className="h-px w-8 bg-[#E33955]/70" />
            </h3>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[#E33955]">
                <Clock size={18} />
              </div>
              <div className="space-y-3.5 font-light text-base w-full">
                <div className="flex justify-between items-center border-b border-white/15 pb-2">
                  <span className="text-[#C7CDD6]">P.-S.</span>
                  <span className="text-white font-medium tabular-nums">09:00 - 20:00</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/15 pb-2">
                  <span className="text-[#C7CDD6]">Sv.</span>
                  <span className="text-white font-medium tabular-nums">10:00 - 16:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Crawl Links to 6 Thematic Riga Service Pages */}
        <nav
          aria-label="Services in Riga"
          className="pt-8 pb-8 border-t border-white/15 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#C7CDD6]"
        >
          {SERVICE_SECTION_IDS.map(sId => (
            <a
              key={sId}
              href={buildSeoUrl(lang, 'service', { serviceId: sId })}
              onClick={(e) => handleLink(e, 'service', { serviceId: sId })}
              className="hover:text-white transition-colors"
            >
              {THEMATIC_SERVICES_SEO[sId].cardLabels[lang]}
            </a>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/15 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C7CDD6]">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {footer.copyright}</span>
            <span className="opacity-70 normal-case tracking-normal">v2.20</span>
            <button
              onClick={() => onNavigate('admin')}
              title="Administratora panelis"
              className="opacity-45 hover:opacity-100 hover:text-[#E33955] transition-opacity p-1 ml-1 focus:outline-none"
              aria-label="Admin panel"
            >
              <Lock size={12} />
            </button>
          </div>
          <div className="flex gap-10">
            <a
              href={buildSeoUrl(lang, 'terms')}
              onClick={(e) => handleLink(e, 'terms')}
              className="hover:text-white transition-colors focus:outline-none"
            >
              {footer.termsLabel}
            </a>
            <a
              href={buildSeoUrl(lang, 'privacy')}
              onClick={(e) => handleLink(e, 'privacy')}
              className="hover:text-white transition-colors focus:outline-none"
            >
              {footer.privacyLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
