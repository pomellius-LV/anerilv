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
}

const Footer: React.FC<FooterProps> = ({ lang, content, onNavigate }) => {
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
    <footer id="contacts" className="bg-stone-100/50 border-t border-stone-200 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-16 lg:gap-20 mb-16">
          {/* Logo & About */}
          <div className="col-span-1">
            <a
              href={buildSeoUrl(lang, 'home')}
              onClick={(e) => handleLink(e, 'home')}
              className="inline-block text-4xl font-serif font-bold text-stone-900 mb-8 tracking-tight focus:outline-none"
            >
              Salons <span className="text-primary">Aneri</span>
            </a>
            <p className="leading-relaxed mb-10 text-stone-600 font-light text-lg">
              Mūsu mērķis ir sniegt Jums visaugstākās kvalitātes skaistumkopšanas pakalpojumus Rīgā, Ķengarāgā.
            </p>
            <div className="flex gap-6">
              <a
                href={instagramUrl}
                target="_blank"
                rel="nofollow noreferrer noopener"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-stone-200 text-[#E1306C] hover:scale-110 hover:shadow-lg transition-all duration-300"
                aria-label="Visit our Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="nofollow noreferrer noopener"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-stone-200 text-[#1877F2] hover:scale-110 hover:shadow-lg transition-all duration-300"
                aria-label="Visit our Facebook"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer Navigation">
            <h3 className="text-stone-900 font-serif font-bold mb-10 text-xl tracking-wider uppercase flex items-center gap-3">
              {footer.quickLinks}
              <span className="h-px w-8 bg-primary/30"></span>
            </h3>
            <ul className="space-y-4 text-sm font-semibold text-stone-600">
              <li>
                <a
                  href={buildSeoUrl(lang, 'home')}
                  onClick={(e) => handleLink(e, 'home')}
                  className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  {nav.home}
                </a>
              </li>
              <li>
                <a
                  href={buildSeoUrl(lang, 'faq')}
                  onClick={(e) => handleLink(e, 'faq')}
                  className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  {nav.faq}
                </a>
              </li>
              <li>
                <a
                  href={buildSeoUrl(lang, 'prices')}
                  onClick={(e) => handleLink(e, 'prices')}
                  className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  {nav.prices}
                </a>
              </li>
              <li>
                <a
                  href={buildSeoUrl(lang, 'gallery')}
                  onClick={(e) => handleLink(e, 'gallery')}
                  className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  {nav.gallery}
                </a>
              </li>
              <li>
                <a
                  href="https://5plus.lv"
                  rel="dofollow"
                  className="flex items-center gap-2 hover:text-primary hover:translate-x-2 transition-all duration-300 focus:outline-none w-full text-left"
                >
                  Noderīgas saites
                </a>
              </li>
            </ul>
          </nav>

          {/* Contacts */}
          <div>
            <h3 className="text-stone-900 font-serif font-bold mb-10 text-xl tracking-wider uppercase flex items-center gap-3">
              {footer.addressLabel}
              <span className="h-px w-8 bg-primary/30"></span>
            </h3>
            <div className="space-y-8">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-5 group"
                aria-label="View our location on Google Maps"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-stone-900 font-medium text-lg leading-snug group-hover:text-primary transition-colors">Latgales iela 264</span>
                  <span className="text-stone-500 text-sm font-light">Rīga, Ķengarags</span>
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-primary mt-2 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Atvērt kartē <ArrowUpRight size={10} />
                  </span>
                </div>
              </a>
              <a
                href="tel:+37127580047"
                className="flex items-center gap-5 group"
                aria-label="Call us"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Phone size={18} />
                </div>
                <span className="text-2xl font-sans font-bold tracking-tight tabular-nums text-stone-900 group-hover:text-primary transition-colors">+371 27580047</span>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-stone-900 font-serif font-bold mb-10 text-xl tracking-wider uppercase flex items-center gap-3">
              {footer.hoursLabel}
              <span className="h-px w-8 bg-primary/30"></span>
            </h3>
            <div className="flex items-start gap-5">
              <div className="shrink-0 w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-primary">
                <Clock size={18} />
              </div>
              <div className="space-y-4 font-light text-lg w-full">
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <span className="text-stone-600">P.-S.</span>
                  <span className="text-stone-900 font-medium tabular-nums">09:00 - 20:00</span>
                </div>
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <span className="text-stone-600">Sv.</span>
                  <span className="text-stone-900 font-medium tabular-nums">10:00 - 16:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Crawl Links to 6 Thematic Riga Service Pages */}
        <nav
          aria-label="Services in Riga"
          className="pt-8 pb-8 border-t border-stone-200/80 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-stone-500"
        >
          {SERVICE_SECTION_IDS.map(sId => (
            <a
              key={sId}
              href={buildSeoUrl(lang, 'service', { serviceId: sId })}
              onClick={(e) => handleLink(e, 'service', { serviceId: sId })}
              className="hover:text-primary transition-colors"
            >
              {THEMATIC_SERVICES_SEO[sId].cardLabels[lang]}
            </a>
          ))}
        </nav>

        <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.25em] font-bold text-stone-500">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {footer.copyright}</span>
            <span className="opacity-50 normal-case tracking-normal">v1.24</span>
            <button
              onClick={() => onNavigate('admin')}
              title="Administratora panelis"
              className="opacity-30 hover:opacity-100 hover:text-primary transition-opacity p-1 ml-1 focus:outline-none"
              aria-label="Admin panel"
            >
              <Lock size={12} />
            </button>
          </div>
          <div className="flex gap-10">
            <a
              href={buildSeoUrl(lang, 'terms')}
              onClick={(e) => handleLink(e, 'terms')}
              className="hover:text-primary transition-colors focus:outline-none"
            >
              {footer.termsLabel}
            </a>
            <a
              href={buildSeoUrl(lang, 'privacy')}
              onClick={(e) => handleLink(e, 'privacy')}
              className="hover:text-primary transition-colors focus:outline-none"
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
