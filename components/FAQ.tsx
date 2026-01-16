import React, { useState } from 'react';
import { Content } from '../types';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQProps {
  content: Content;
}

const FAQ: React.FC<FAQProps> = ({ content }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-800 mb-6">{content.faq.title}</h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-stone-500 max-w-2xl mx-auto">
            Viss, kas jums jāzina par frizētavas, manikīra un skaistumkopšanas pakalpojumiem Rīgā, Ķengaragā.
          </p>
        </div>

        <div className="space-y-12">
          {content.faq.categories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-4">
              <h3 className="text-2xl font-serif font-bold text-primary flex items-center gap-3 mb-6">
                <HelpCircle className="text-primary" size={24} />
                {category.categoryTitle}
              </h3>
              
              <div className="grid gap-4">
                {category.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isOpen = openId === id;
                  
                  return (
                    <div 
                      key={id} 
                      className={`bg-white rounded-2xl transition-all duration-300 border ${isOpen ? 'border-primary/30 shadow-lg ring-1 ring-primary/5' : 'border-stone-100 shadow-sm hover:border-stone-200'}`}
                    >
                      <button
                        onClick={() => toggle(id)}
                        className="w-full flex justify-between items-center p-6 text-left focus:outline-none group"
                        aria-expanded={isOpen}
                      >
                        <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-primary' : 'text-stone-800 group-hover:text-primary'}`}>
                          {item.question}
                        </span>
                        <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-stone-400'}`}>
                          <ChevronDown size={24} />
                        </div>
                      </button>
                      
                      <div 
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 pb-8 pt-2 text-stone-600 leading-relaxed text-lg border-t border-stone-50">
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
      </div>
    </section>
  );
};

export default FAQ;