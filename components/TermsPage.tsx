import React from 'react';
import { Language, View } from '../types';
import { buildSeoUrl } from '../data/seoRoutes';
import { ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';

interface TermsPageProps {
  lang: Language;
  title: string;
  content: string;
  setView: (view: View) => void;
  homeLabel: string;
}

const TermsPage: React.FC<TermsPageProps> = ({ lang, title, content, setView, homeLabel }) => {
  return (
    <section className="pt-40 pb-32 min-h-screen bg-[#F5F6F8]">
      <div className="container mx-auto px-4 max-w-3xl">
        <a
          href={buildSeoUrl(lang, 'home')}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            setView('home');
          }}
          className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-12"
        >
          <ArrowLeft size={16} /> {homeLabel}
        </a>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-12 tracking-tight">{title}</h1>
        
        <div className="bg-white p-10 md:p-16 shadow-sm border border-stone-100 rounded-[2rem]">
          <div className="text-lg text-stone-600 leading-relaxed font-light">
            <Markdown
              components={{
                p: ({node, ...props}) => <p className="mb-6" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-stone-900" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-3xl font-serif font-bold mb-6 mt-10 text-stone-900" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-serif font-bold mb-4 mt-8 text-stone-900" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-serif font-bold mb-3 mt-6 text-stone-900" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="" {...props} />,
                a: ({node, ...props}) => <a className="text-primary underline hover:text-accent transition-colors" {...props} />
              }}
            >
              {content}
            </Markdown>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsPage;