import React from 'react';
import { Content, Language } from '../types';
import { Phone, ArrowRight, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useRigaSalonStatus } from '../utils/salonHours';

interface HeroProps {
  content: Content;
  lang: Language;
  onBookingCall?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HERO_UI: Record<
  Language,
  {
    mapLabel: string;
    interiorCaption: string;
  }
> = {
  lv: {
    mapLabel: 'Skatīt Google kartē',
    interiorCaption: 'Latgales iela 264 · t/c Mego · Bezmaksas stāvvieta pie ieejas'
  },
  ru: {
    mapLabel: 'Открыть на карте Google',
    interiorCaption: 'ул. Латгалес 264 · т/ц Mego · Бесплатная парковка у входа'
  },
  en: {
    mapLabel: 'View on Google Maps',
    interiorCaption: 'Latgales iela 264 · TC Mego · Free private entrance parking'
  }
};

const Hero: React.FC<HeroProps> = ({ content, lang, onBookingCall }) => {
  const { hero } = content;
  const status = useRigaSalonStatus(lang);
  const ui = HERO_UI[lang] || HERO_UI.lv;
  const bgImage = "url('/photos/facade.jpg')";
  const mapUrl =
    "https://www.google.com/maps/place/56%C2%B054'30.6%22N+24%C2%B010'56.3%22E/@56.9085003,24.1822941,17z/";

  return (
    <section className="relative flex flex-col bg-[#F5F6F8]">
      {/* Architectural Facade Backdrop with Metallic Graphite-Gray Signboard Scrim */}
      <div className="relative min-h-[86vh] flex flex-col items-center justify-center overflow-hidden bg-[#464B53]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom"
          style={{ backgroundImage: bgImage }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-signboard-scrim backdrop-blur-[1.5px]"
          aria-hidden="true"
        />

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center max-w-5xl pt-28 pb-28 md:pb-36">
          {/* Unboxed Silver Location Kicker */}
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#E3E7ED] font-medium mb-6">
            Latgales iela 264 · Rīga, Ķengarags
          </p>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.25rem] font-serif font-semibold text-white mb-7 tracking-tight leading-[0.98] drop-shadow-xl">
            {hero.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-100/95 mb-11 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            {hero.subText}
          </p>

          {/* Clean Direct Call CTA — No unnecessary explanation copy */}
          <div className="flex flex-col items-center gap-3.5 mb-14">
            <a
              href="tel:+37127580047"
              onClick={onBookingCall}
              className="group inline-flex items-center gap-3.5 bg-[#8E1B32] text-white px-9 py-4 sm:px-10 sm:py-4.5 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-[0.18em] hover:bg-white hover:text-[#25282E] transition-all duration-300 transform hover:-translate-y-0.5 shadow-2xl border border-white/15"
            >
              <Phone size={17} className="shrink-0" />
              <span>{hero.cta}</span>
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform shrink-0" />
            </a>
            <a
              href="tel:+37127580047"
              onClick={onBookingCall}
              className="text-sm font-sans font-semibold text-white/95 hover:text-white tracking-wider tabular-nums transition-colors"
            >
              +371 27580047
            </a>
          </div>

          {/* Minimalist Live Status, Hours & Address Strip */}
          <div className="flex flex-col items-center">
            <div className="h-px w-20 bg-[#D62847]/70 mb-6" />

            {/* Live Open Status (Europe/Riga) — Zero pulsing dots */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/95 tracking-wide mb-5">
              <span className="inline-flex items-center gap-2 font-medium">
                <Clock
                  size={14}
                  className={status.isOpen ? 'text-[#E33955]' : 'text-[#C7CDD6]'}
                />
                <span>{status.statusText}</span>
              </span>
              <span aria-hidden="true" className="text-white/35">
                ·
              </span>
              <span className="tabular-nums text-white/85">
                P.–S. 09:00–20:00
              </span>
              <span aria-hidden="true" className="text-white/35">
                ·
              </span>
              <span className="tabular-nums text-white/85">
                Sv. 10:00–16:00
              </span>
            </div>

            {/* Direct Google Maps Location Link */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[11px] text-[#E3E7ED] hover:text-white uppercase tracking-[0.22em] font-medium transition-colors"
            >
              <MapPin size={13} className="text-[#E33955]" />
              <span>{ui.mapLabel}</span>
              <ExternalLink size={11} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>

      {/* Architectural Interior Showcase Photo Framed in Signboard Metallic Steel */}
      <div className="relative z-20 -mt-12 md:-mt-20 px-4 pb-8">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-[0_24px_65px_rgba(37,40,46,0.16)] border border-slate-300/70 bg-[#3A3E45] relative">
          <div className="aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#4D525B] to-[#363A40]">
            <img
              src="https://aneri-icon.pages.dev/photo/Salons%20aneri%202030.jpeg"
              alt="Salons Aneri — Rīga, Latgales iela 264"
              width={1280}
              height={720}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div className="bg-signboard-metal px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[11px] tracking-[0.14em] uppercase text-[#E3E7ED] border-t border-white/15">
            <span>{ui.interiorCaption}</span>
            <a
              href="tel:+37127580047"
              onClick={onBookingCall}
              className="text-white hover:text-[#E33955] transition-colors font-semibold tabular-nums"
            >
              +371 27580047
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
