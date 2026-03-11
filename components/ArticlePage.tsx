import React from 'react';
import { Article, Content, View } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ArticlePageProps {
  articleId: string;
  content: Content;
  setView: (view: View) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ articleId, content, setView }) => {
  const article = content.articles.find(a => a.id === articleId);

  if (!article) {
    return (
      <section className="pt-32 pb-24 min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-stone-800 mb-4">Article not found</h1>
          <button onClick={() => setView('home')} className="text-primary underline">
            {content.nav.home}
          </button>
        </div>
      </section>
    );
  }

  const handleServiceClick = (e: React.MouseEvent, serviceId: string) => {
    e.preventDefault();
    setView('prices');
    setTimeout(() => {
      const el = document.getElementById(serviceId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <button 
          onClick={() => setView('prices')} 
          className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-12 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft size={16} /> {content.nav.prices}
        </button>

        <article className="bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-stone-100">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-8 leading-tight">
            {article.title}
          </h1>
          <div className="h-px w-24 bg-primary/20 mb-8"></div>
          <div className="prose prose-stone prose-lg max-w-none text-stone-600 font-light leading-relaxed">
            {article.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6">{paragraph}</p>
            ))}
          </div>

          {article.relatedService && (
            <div className="mt-12 pt-8 border-t border-stone-100">
              <a 
                href={`#${article.relatedService.id}`}
                onClick={(e) => handleServiceClick(e, article.relatedService!.id)}
                className="inline-flex items-center gap-3 bg-stone-100 hover:bg-stone-200 text-stone-800 px-6 py-4 rounded-2xl font-medium transition-colors group"
              >
                {article.relatedService.text}
                <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          )}
        </article>
      </div>
    </section>
  );
};

export default ArticlePage;
