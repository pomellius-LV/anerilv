import React from 'react';
import { Content, Language, View } from '../types';
import { ServiceSectionId, buildSeoUrl } from '../data/seoRoutes';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Markdown from 'react-markdown';

interface ArticlePageProps {
  articleId: string;
  lang: Language;
  content: Content;
  onNavigate: (
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ articleId, lang, content, onNavigate }) => {
  const article = content.articles.find(a => a.id === articleId);

  const handleLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(view, options);
  };

  if (!article) {
    return (
      <section className="pt-32 pb-24 min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-stone-800 mb-4">Article not found</h1>
          <a
            href={buildSeoUrl(lang, 'home')}
            onClick={(e) => handleLink(e, 'home')}
            className="text-primary underline"
          >
            {content.nav.home}
          </a>
        </div>
      </section>
    );
  }

  const relatedServiceId = article.relatedService?.id as ServiceSectionId | undefined;
  const relatedHref = relatedServiceId
    ? buildSeoUrl(lang, 'service', { serviceId: relatedServiceId })
    : buildSeoUrl(lang, 'prices');

  return (
    <section className="pt-32 pb-24 min-h-screen bg-[#F5F6F8]">
      <div className="container mx-auto px-4 max-w-3xl">
        <a
          href={buildSeoUrl(lang, 'prices')}
          onClick={(e) => handleLink(e, 'prices')}
          className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-12 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft size={16} /> {content.nav.prices}
        </a>

        <article className="bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-stone-100">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-8 leading-tight">
            {article.title}
          </h1>
          <div className="h-px w-24 bg-primary/20 mb-8"></div>
          <div className="text-stone-600 font-light leading-relaxed text-lg">
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
              {article.content}
            </Markdown>
          </div>

          {article.relatedService && (
            <div className="mt-12 pt-8 border-t border-stone-100">
              <a
                href={relatedHref}
                onClick={(e) =>
                  handleLink(
                    e,
                    relatedServiceId ? 'service' : 'prices',
                    relatedServiceId ? { serviceId: relatedServiceId } : undefined
                  )
                }
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
