
import React from 'react';
import { Content, Language } from '../types';
import { Phone, ArrowRight, MapPin, ExternalLink } from 'lucide-react';

interface HeroProps {
  content: Content;
  lang: Language; // Added lang prop for localized text
}

const Hero: React.FC<HeroProps> = ({ content, lang }) => {
  const { hero } = content;
  const bgImage = "url('photos/facade.jpg')";
  const mapUrl = "https://www.google.com/maps/place/56%C2%B054'30.6%22N+24%C2%B010'56.3%22E/@56.9085003,24.1822941,17z/";

  const mapLabels: Record<Language, string> = {
    lv: "Skatīt kartē",
    ru: "Посмотреть на карте",
    en: "View on map"
  };

  return (
    <section className="relative flex flex-col bg-stone-300">
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] scale-105 animate-slow-zoom"
          style={{ backgroundImage: bgImage }}
        />
        <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl py-24">
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-8 tracking-tight leading-none drop-shadow-xl">
            {hero.title}
          </h1>
          
          <p className="text-lg md:text-2xl text-stone-100 mb-14 font-light tracking-wide max-w-2xl mx-auto opacity-90 leading-relaxed">
            {hero.subText}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-20">
            <a 
              href="tel:+37127580047"
              className="group inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-primary transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              {hero.cta}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Minimalist Working Hours & Location */}
          <div className="flex flex-col items-center">
            <div className="h-px w-24 bg-white/20 mb-6" />
            
            {/* Working Hours */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 text-white/80 font-medium tracking-[0.1em] text-xs uppercase mb-6">
              <span className="flex items-center gap-3">
                <span className="text-primary font-bold">P.-S.:</span> 09:00 - 20:00
              </span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span className="flex items-center gap-3">
                <span className="text-primary font-bold">Sv.:</span> 10:00 - 16:00
              </span>
            </div>

            {/* Clickable Address */}
            <a 
               href={mapUrl} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="group flex flex-col items-center transition-opacity hover:opacity-100 opacity-80"
            >
              <div className="flex items-center gap-2 text-[11px] text-white uppercase tracking-[0.25em] font-bold group-hover:text-primary transition-colors">
                <MapPin size={14} className="text-primary" />
                Latgales iela 264, Rīga
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/60 font-medium uppercase tracking-widest border-b border-white/20 pb-0.5 group-hover:text-white group-hover:border-white transition-all">
                 <span>{mapLabels[lang]}</span>
                 <ExternalLink size={10} />
              </div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Interior Photo - Attached to bottom of Hero */}
      <div className="relative z-20 -mt-10 md:-mt-20 pb-10">
         <img 
            src="https://aneri-icon.pages.dev/photo/Salons%20aneri%202030.jpeg"
            alt="Salons Aneri Interior"
            className="w-full md:max-w-[1000px] md:mx-auto md:rounded-[15px] md:shadow-2xl shadow-lg object-cover"
            loading="eager" 
         />
      </div>
    </section>
  );
};

export default Hero;
