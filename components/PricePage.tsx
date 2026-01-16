
import React from 'react';
import { Content, View } from '../types';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface PricePageProps {
  content: Content;
  setView: (view: View) => void;
}

const PricePage: React.FC<PricePageProps> = ({ content, setView }) => {
  return (
    <section className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <button 
          onClick={() => setView('home')} 
          className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-12 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft size={16} /> {content.nav.home}
        </button>

        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-900 mb-6 tracking-tight">
            {content.prices.title}
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed italic">
            {content.prices.description}
          </p>
        </div>

        <div className="space-y-24">
          {content.prices.sections.map((section, sIdx) => (
            <div key={sIdx} id={section.id} className="space-y-12 scroll-mt-32">
              <div className="flex items-center gap-6">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 whitespace-nowrap">
                  {section.sectionTitle}
                </h2>
                <div className="h-px w-full bg-stone-200"></div>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                {section.categories.map((category, cIdx) => (
                  <div 
                    key={cIdx} 
                    className="bg-white p-10 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-shadow duration-500"
                  >
                    <h3 className="text-2xl font-serif font-bold text-primary mb-8 flex items-center gap-3">
                      <CheckCircle size={20} className="text-primary/40" />
                      {category.title}
                    </h3>
                    
                    <div className="space-y-6">
                      {category.services.map((service, iIdx) => (
                        <div key={iIdx} className="flex justify-between items-baseline group">
                          <span className="text-stone-700 font-light text-lg pr-4 group-hover:text-stone-900 transition-colors">
                            {service.name}
                          </span>
                          <div className="flex-grow border-b border-dotted border-stone-200 h-px mx-2"></div>
                          <span className="text-stone-900 font-sans font-bold tabular-nums whitespace-nowrap text-lg">
                            {service.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-white rounded-[3rem] border border-stone-100 text-center max-w-4xl mx-auto shadow-sm">
          <p className="text-stone-500 italic text-lg font-light leading-relaxed">
            {content.prices.disclaimer}
          </p>
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8">
            <a 
              href="tel:+37127580047" 
              className="bg-primary text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-900 transition-colors shadow-xl"
            >
              {content.nav.bookBtn} +371 27580047
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricePage;
