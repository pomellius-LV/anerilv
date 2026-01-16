import React from 'react';
import { View } from '../types';
import { ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  title: string;
  content: string;
  setView: (view: View) => void;
  homeLabel: string;
}

const TermsPage: React.FC<TermsPageProps> = ({ title, content, setView, homeLabel }) => {
  return (
    <section className="pt-40 pb-32 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => setView('home')} className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-12">
          <ArrowLeft size={16} /> {homeLabel}
        </button>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-12 tracking-tight">{title}</h1>
        
        <div className="bg-white p-10 md:p-16 shadow-sm border border-stone-100 rounded-[2rem]">
          <div className="prose prose-stone max-w-none">
            {content.split('\n').map((line, i) => (
              <p key={i} className="text-lg text-stone-600 leading-relaxed mb-6 font-light">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsPage;