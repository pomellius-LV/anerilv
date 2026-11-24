import React, { useState } from 'react';
import { Content, Language, View } from '../types';
import { buildSeoUrl } from '../data/seoRoutes';
import { ChevronDown, MapPin, Navigation, ArrowLeft, TramFront } from 'lucide-react';

interface FAQPageProps {
  lang: Language;
  content: Content;
  setView: (view: View) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ lang, content, setView }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const mapUrl =
    "https://www.google.com/maps/place/56%C2%B054'30.6%22N+24%C2%B010'56.3%22E/@56.9085003,24.1822941,17z/";

  return (
    <section className="min-h-screen bg-[#F5F6F8]">
      {/* Metallic Signboard Header Banner */}
      <div className="bg-signboard-metal relative overflow-hidden pt-28 md:pt-36 pb-12 border-b border-slate-500/40">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <a
            href={buildSeoUrl(lang, 'home')}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              setView('home');
            }}
            className="inline-flex items-center gap-2 text-[#E3E7ED] hover:text-white text-xs font-semibold uppercase tracking-[0.2em] mb-8 transition-colors"
          >
            <ArrowLeft size={15} className="text-[#E33955]" />
            <span>{content.nav.home}</span>
          </a>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-semibold text-white mb-4 tracking-tight leading-[1.02]">
            {content.faq.title}
          </h1>
          <p className="text-base sm:text-lg text-[#E3E7ED]/90 max-w-2xl font-light leading-relaxed">
            {content.faq.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8 space-y-14">
            {content.faq.categories.map((category, catIdx) => (
              <div key={catIdx} className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#25282E] pb-4 border-b border-slate-200">
                  {category.categoryTitle}
                </h2>
                <div className="space-y-3">
                  {category.items.map((item, itemIdx) => {
                    const id = `${catIdx}-${itemIdx}`;
                    const isOpen = openId === id;
                    return (
                      <div
                        key={id}
                        className={`bg-white rounded-2xl border transition-all duration-300 ${
                          isOpen
                            ? 'border-[#8E1B32]/40 shadow-md'
                            : 'border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : id)}
                          className="w-full flex justify-between items-center p-6 sm:p-7 text-left group"
                        >
                          <span
                            className={`text-lg sm:text-xl font-serif font-semibold pr-4 transition-colors ${
                              isOpen ? 'text-[#8E1B32]' : 'text-[#25282E] group-hover:text-[#8E1B32]'
                            }`}
                          >
                            {item.question}
                          </span>
                          <ChevronDown
                            size={20}
                            className={`shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180 text-[#8E1B32]' : 'text-slate-400'
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-6 sm:px-7 pb-7 pt-2 text-base text-slate-600 leading-relaxed font-light border-t border-slate-100">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-signboard-metal border border-slate-500/40 text-white p-9 sticky top-28 rounded-2xl shadow-xl relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
                aria-hidden="true"
              />
              <h3 className="text-3xl font-serif font-semibold mb-8">Informācija</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <MapPin className="text-[#E33955] shrink-0" size={22} />
                  <div>
                    <p className="font-semibold text-lg mb-1">Latgales iela 264</p>
                    <p className="text-[#C7CDD6] text-sm">Rīga, Ķengarags (blakus TC Dole)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <TramFront className="text-[#E33955] shrink-0" size={22} />
                  <div>
                    <p className="font-semibold mb-1.5 uppercase tracking-widest text-xs text-[#C7CDD6]">
                      Transports:
                    </p>
                    <p className="text-[#E3E7ED] text-sm leading-relaxed">
                      7. tramvajs
                      <br />
                      Autobusi: 15, 18, 31, 49, 60
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/15 text-center">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 bg-[#8E1B32] text-white px-7 py-3.5 rounded-full font-semibold uppercase tracking-widest text-xs hover:bg-white hover:text-[#25282E] transition-all"
                  >
                    <Navigation size={14} /> Atvērt kartē
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQPage;