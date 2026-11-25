import React from 'react';
import { Content, Language, View } from '../types';
import { ServiceSectionId, buildSeoUrl } from '../data/seoRoutes';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import Markdown from 'react-markdown';

interface ArticlePageProps {
  articleId: string;
  lang: Language;
  content: Content;
  onNavigate: (
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => void;
  onBookingCall?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const ARTICLE_UI: Record<Language, { eyebrow: string; notFound: string }> = {
  lv: { eyebrow: 'Ekspertu ceļvedis · Salons Aneri', notFound: 'Raksts nav atrasts' },
  ru: { eyebrow: 'Советы мастеров · Salons Aneri', notFound: 'Статья не найдена' },
  en: { eyebrow: 'Expert Guide · Salons Aneri', notFound: 'Article not found' }
};

const ArticlePage: React.FC<ArticlePageProps> = ({
  articleId,
  lang,
  content,
  onNavigate,
  onBookingCall
}) => {
  const article = content.articles.find(a => a.id === articleId);
  const ui = ARTICLE_UI[lang] || ARTICLE_UI.lv;

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
      <section className="min-h-screen bg-[#F5F6F8] flex flex-col">
        <div className="bg-signboard-metal relative overflow-hidden pt-28 md:pt-36 pb-12 border-b border-slate-500/40">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
            aria-hidden="true"
          />
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <a
              href={buildSeoUrl(lang, 'home')}
              onClick={(e) => handleLink(e, 'home')}
              className="inline-flex items-center gap-2 text-[#E3E7ED] hover:text-white text-xs font-semibold uppercase tracking-[0.2em] mb-6 transition-colors"
            >
              <ArrowLeft size={15} className="text-[#E33955]" />
              <span>{content.nav.home}</span>
            </a>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white tracking-tight">
              {ui.notFound}
            </h1>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl py-16 text-center">
          <a
            href={buildSeoUrl(lang, 'prices')}
            onClick={(e) => handleLink(e, 'prices')}
            className="inline-flex items-center gap-2 bg-[#8E1B32] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#25282E] transition-colors"
          >
            <ArrowLeft size={15} />
            <span>{content.nav.prices}</span>
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
    <section className="min-h-screen bg-[#F5F6F8]">
      {/* Metallic Signboard Page Header */}
      <div className="bg-signboard-metal relative overflow-hidden pt-28 md:pt-36 pb-12 border-b border-slate-500/40">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <a
            href={buildSeoUrl(lang, 'prices')}
            onClick={(e) => handleLink(e, 'prices')}
            className="inline-flex items-center gap-2 text-[#E3E7ED] hover:text-white text-xs font-semibold uppercase tracking-[0.2em] mb-8 transition-colors"
          >
            <ArrowLeft size={15} className="text-[#E33955]" />
            <span>{content.nav.prices}</span>
          </a>

          <p className="text-[11px] uppercase tracking-[0.26em] text-[#C7CDD6] font-semibold mb-3">
            {ui.eyebrow}
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-semibold text-white tracking-tight leading-[1.08]">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Editorial Reading Sheet */}
      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-12 md:py-16">
        <article className="bg-white p-8 sm:p-12 md:p-14 rounded-2xl shadow-xs border border-slate-200/90 max-w-3xl mx-auto">
          <div className="h-[2px] w-20 bg-gradient-to-r from-[#8E1B32] to-[#E33955] mb-8" />
          <div className="text-slate-600 font-light leading-relaxed text-base sm:text-lg">
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
              {article.content}
            </Markdown>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {article.relatedService ? (
              <a
                href={relatedHref}
                onClick={(e) =>
                  handleLink(
                    e,
                    relatedServiceId ? 'service' : 'prices',
                    relatedServiceId ? { serviceId: relatedServiceId } : undefined
                  )
                }
                className="inline-flex items-center justify-between sm:justify-start gap-3 bg-[#ECEFF3] hover:bg-[#E3E7ED] text-[#25282E] border border-slate-200 px-6 py-3.5 rounded-xl text-sm font-medium transition-colors group"
              >
                <span>{article.relatedService.text}</span>
                <ArrowRight size={16} className="text-[#8E1B32] group-hover:translate-x-1 transition-transform shrink-0" />
              </a>
            ) : (
              <span />
            )}

            <a
              href="tel:+37127580047"
              onClick={onBookingCall}
              className="inline-flex items-center justify-center gap-2.5 bg-[#8E1B32] hover:bg-[#25282E] text-white px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-colors shrink-0"
            >
              <Phone size={14} />
              <span className="tabular-nums">+371 27580047</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ArticlePage;
