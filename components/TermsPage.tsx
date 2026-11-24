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

const LEGAL_EYEBROW: Record<Language, string> = {
  lv: 'Juridiskā informācija · Salons Aneri',
  ru: 'Правовая информация · Salons Aneri',
  en: 'Legal Information · Salons Aneri'
};

const TermsPage: React.FC<TermsPageProps> = ({ lang, title, content, setView, homeLabel }) => {
  return (
    <section className="min-h-screen bg-[#F5F6F8]">
      {/* Metallic Signboard Header Banner */}
      <div className="bg-signboard-metal relative overflow-hidden pt-28 md:pt-36 pb-12 border-b border-slate-500/40">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
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
            <span>{homeLabel}</span>
          </a>

          <p className="text-[11px] uppercase tracking-[0.26em] text-[#C7CDD6] font-semibold mb-3">
            {LEGAL_EYEBROW[lang] || LEGAL_EYEBROW.lv}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold text-white tracking-tight leading-[1.06]">
            {title}
          </h1>
        </div>
      </div>

      {/* Cool Slate Legal Sheet */}
      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-12 md:py-16">
        <div className="bg-white p-8 sm:p-12 md:p-14 shadow-xs border border-slate-200/90 rounded-2xl max-w-3xl mx-auto">
          <div className="h-[2px] w-20 bg-gradient-to-r from-[#8E1B32] to-[#E33955] mb-8" />
          <div className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            <Markdown
              components={{
                p: ({ node, ...props }) => <p className="mb-6" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-[#25282E]" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-3xl font-serif font-semibold mb-6 mt-10 text-[#25282E]" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-serif font-semibold mb-4 mt-8 text-[#25282E]" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-serif font-semibold mb-3 mt-6 text-[#25282E]" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 marker:text-[#8E1B32]" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 marker:text-[#8E1B32]" {...props} />,
                li: ({ node, ...props }) => <li className="" {...props} />,
                a: ({ node, ...props }) => (
                  <a
                    className="text-[#8E1B32] underline decoration-[#8E1B32]/40 hover:text-[#25282E] hover:decoration-[#25282E] transition-colors"
                    {...props}
                  />
                )
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