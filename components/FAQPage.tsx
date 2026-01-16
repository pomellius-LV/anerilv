import React, { useState } from 'react';
import { Content, View } from '../types';
import { ChevronDown, MapPin, Bus, Navigation, ArrowLeft, TramFront } from 'lucide-react';

interface FAQPageProps {
  content: Content;
  setView: (view: View) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ content, setView }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const mapUrl = "https://www.google.com/maps/place/56%C2%B054'30.6%22N+24%C2%B010'56.3%22E/@56.9085003,24.1822941,17z/";

  return (
    <section className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <button onClick={() => setView('home')} className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-12 hover:-translate-x-1 transition-transform">
          <ArrowLeft size={16} /> {content.nav.home}
        </button>

        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-900 mb-6 tracking-tight">{content.faq.title}</h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed italic">{content.faq.description}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16">
            {content.faq.categories.map((category, catIdx) => (
              <div key={catIdx} className="space-y-8">
                <h3 className="text-3xl font-serif font-bold text-stone-800 pb-4 border-b border-stone-200">{category.categoryTitle}</h3>
                <div className="space-y-4">
                  {category.items.map((item, itemIdx) => {
                    const id = `${catIdx}-${itemIdx}`;
                    const isOpen = openId === id;
                    return (
                      <div key={id} className={`bg-white transition-all duration-300 ${isOpen ? 'ring-1 ring-primary/10 shadow-xl' : 'hover:bg-stone-50'}`}>
                        <button onClick={() => setOpenId(isOpen ? null : id)} className="w-full flex justify-between items-center p-8 text-left group">
                          <span className={`text-xl font-serif font-bold transition-colors ${isOpen ? 'text-primary' : 'text-stone-800 group-hover:text-primary'}`}>{item.question}</span>
                          <ChevronDown className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : 'text-stone-300'}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="px-8 pb-10 text-lg text-stone-600 leading-relaxed font-light">{item.answer}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
             <div className="bg-stone-900 text-white p-10 sticky top-32 rounded-[2rem] shadow-2xl">
                <h4 className="text-3xl font-serif font-bold mb-8">Informācija</h4>
                <div className="space-y-10">
                   <div className="flex gap-5">
                      <MapPin className="text-primary shrink-0" size={24} />
                      <div>
                         <p className="font-bold text-xl mb-1">Latgales iela 264</p>
                         <p className="text-stone-400 text-sm">Rīga, Ķengarags (blakus TC Dole)</p>
                      </div>
                   </div>
                   <div className="flex gap-5">
                      <TramFront className="text-primary shrink-0" size={24} />
                      <div>
                         <p className="font-bold mb-2 uppercase tracking-widest text-xs">Transports:</p>
                         <p className="text-stone-300 text-sm leading-relaxed">
                            7. tramvajs<br/>Autobusi: 15, 18, 31, 49, 60
                         </p>
                      </div>
                   </div>
                   <div className="pt-8 border-t border-white/10 text-center">
                      <a href={mapUrl} target="_blank" className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-primary transition-all">
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