import React from 'react';
import { Content } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface AdvantagesProps {
  content: Content;
}

const Advantages: React.FC<AdvantagesProps> = ({ content }) => {
  return (
    <section id="advantages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
         <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-800 mb-4">{content.advantages.title}</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {content.advantages.items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-rose-50 transition-colors border border-slate-100">
              <div className="mb-4 text-accent">
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </div>
              <p className="text-lg font-medium text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;