import React, { useState } from 'react';
import { Content, Language, View } from '../types';
import {
  THEMATIC_SERVICES_SEO,
  SERVICE_SECTION_IDS,
  ServiceSectionId,
  buildSeoUrl
} from '../data/seoRoutes';
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  MapPin,
  Car,
  CheckCircle,
  ChevronDown,
  BookOpen
} from 'lucide-react';

interface ServiceLandingPageProps {
  serviceId: ServiceSectionId;
  lang: Language;
  content: Content;
  onNavigate: (
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => void;
}

const LABELS: Record<
  Language,
  {
    fullPriceLink: string;
    faqHeading: string;
    articlesHeading: string;
    otherServicesHeading: string;
    addressShort: string;
    parkingBadge: string;
  }
> = {
  lv: {
    fullPriceLink: 'Skatīt pilnu salona cenrādi',
    faqHeading: 'Biežie jautājumi par pakalpojumu',
    articlesHeading: 'Noderīgi padomi un ceļveži',
    otherServicesHeading: 'Citi Salons Aneri pakalpojumi Rīgā',
    addressShort: 'Latgales iela 264, Rīga (Ķengarags · pie TC Dole)',
    parkingBadge: 'Bezmaksas privātā stāvvieta klientiem'
  },
  ru: {
    fullPriceLink: 'Смотреть полный прайс-лист салона',
    faqHeading: 'Частые вопросы об услуге',
    articlesHeading: 'Полезные статьи и советы мастеров',
    otherServicesHeading: 'Другие услуги Salons Aneri в Риге',
    addressShort: 'ул. Латгалес 264, Рига (Кенгарагс · возле ТЦ Dole)',
    parkingBadge: 'Бесплатная частная парковка у входа'
  },
  en: {
    fullPriceLink: 'View full salon price list',
    faqHeading: 'Frequently Asked Questions',
    articlesHeading: 'Care Guides & Expert Tips',
    otherServicesHeading: 'Other Services at Aneri Salon Riga',
    addressShort: 'Latgales iela 264, Riga (near TC Dole)',
    parkingBadge: 'Free private parking right outside'
  }
};

const ServiceLandingPage: React.FC<ServiceLandingPageProps> = ({
  serviceId,
  lang,
  content,
  onNavigate
}) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const seo = THEMATIC_SERVICES_SEO[serviceId];
  const labels = LABELS[lang];
  const priceSection =
    content.prices.sections.find(s => s.id === serviceId) ||
    content.prices.sections[0];

  const relatedArticles = (content.articles || []).filter(art =>
    seo.relatedArticleIds.includes(art.id)
  );
  const otherServices = SERVICE_SECTION_IDS.filter(id => id !== serviceId);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetView: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(targetView, options);
  };

  return (
    <article className="pt-28 md:pt-36 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Crawlable Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-400 mb-10"
        >
          <a
            href={buildSeoUrl(lang, 'home')}
            onClick={(e) => handleLinkClick(e, 'home')}
            className="text-primary hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> {content.nav.home}
          </a>
          <span aria-hidden="true">/</span>
          <a
            href={buildSeoUrl(lang, 'prices')}
            onClick={(e) => handleLinkClick(e, 'prices')}
            className="hover:text-primary transition-colors"
          >
            {content.nav.prices}
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-stone-600">{seo.cardLabels[lang]}</span>
        </nav>

        {/* Hero / Intro Block */}
        <header className="bg-white p-8 md:p-14 rounded-[2.5rem] shadow-sm border border-stone-200/80 mb-14">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-5 tracking-tight leading-tight">
            {seo.h1[lang]}
          </h1>
          <p className="text-xl text-primary font-serif italic mb-6">
            {seo.subtitles[lang]}
          </p>
          <p className="text-stone-600 font-light text-base md:text-lg leading-relaxed max-w-4xl mb-8">
            {seo.intro[lang]}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-stone-100">
            <a
              href="tel:+37127580047"
              className="inline-flex items-center gap-3 bg-primary hover:bg-stone-900 text-white px-8 py-4 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest transition-colors shadow-lg whitespace-nowrap"
            >
              <Phone size={16} />
              <span>{content.nav.bookBtn}:</span>
              <span className="tabular-nums">+371 27580047</span>
            </a>

            <a
              href={buildSeoUrl(lang, 'prices')}
              onClick={(e) => handleLinkClick(e, 'prices')}
              className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-6 py-4 rounded-full font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              {labels.fullPriceLink}
              <ArrowRight size={15} className="text-primary" />
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-stone-500 font-medium">
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} className="text-primary shrink-0" />
              {labels.addressShort}
            </span>
            <span className="inline-flex items-center gap-2">
              <Car size={15} className="text-primary shrink-0" />
              {labels.parkingBadge}
            </span>
          </div>
        </header>

        {/* 3 Concrete Riga Highlights */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {seo.highlights[lang].map((hl, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-[1.75rem] border border-stone-200/80 shadow-sm space-y-2.5"
            >
              <h2 className="text-xl font-serif font-bold text-stone-900">
                {hl.title}
              </h2>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                {hl.text}
              </p>
            </div>
          ))}
        </section>

        {/* Live D1-synced Prices for this Service Section */}
        {priceSection && (
          <section className="mb-16">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 whitespace-nowrap">
                {priceSection.sectionTitle}
              </h2>
              <div className="h-px w-full bg-stone-200" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {priceSection.categories.map((category, cIdx) => (
                <div
                  key={cIdx}
                  className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-stone-200/80"
                >
                  <h3 className="text-2xl font-serif font-bold text-primary mb-7 flex items-center gap-3">
                    <CheckCircle size={20} className="text-primary/40 shrink-0" />
                    {category.title}
                  </h3>
                  <div className="space-y-5">
                    {category.services.map((srv, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex justify-between items-baseline gap-2"
                      >
                        <span className="text-stone-700 font-light text-base md:text-lg pr-2">
                          {srv.name}
                        </span>
                        <div className="flex-grow border-b border-dotted border-stone-200 h-px" />
                        <span className="text-stone-900 font-sans font-bold tabular-nums whitespace-nowrap text-base md:text-lg">
                          {srv.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs md:text-sm text-stone-500 italic text-center">
              {content.prices.disclaimer}
            </p>
          </section>
        )}

        {/* Service-Specific FAQ */}
        {seo.faqs[lang].length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">
              {labels.faqHeading}
            </h2>
            <div className="space-y-3">
              {seo.faqs[lang].map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center p-6 text-left group"
                    >
                      <span className="text-lg font-serif font-bold text-stone-900 group-hover:text-primary transition-colors pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-primary' : 'text-stone-400'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-stone-600 font-light leading-relaxed text-base border-t border-stone-100 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2.5">
              <BookOpen size={22} className="text-primary" />
              {labels.articlesHeading}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedArticles.map(art => (
                <a
                  key={art.id}
                  href={buildSeoUrl(lang, 'article', { articleId: art.id })}
                  onClick={(e) => handleLinkClick(e, 'article', { articleId: art.id })}
                  className="bg-white p-6 rounded-2xl border border-stone-200/80 hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between gap-4 group"
                >
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-primary transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {art.metaDescription}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-stone-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Internal Cross-Linking to Other 5 Thematic Riga Pages */}
        <section className="pt-10 border-t border-stone-200">
          <h2 className="text-xl font-serif font-bold text-stone-800 mb-5">
            {labels.otherServicesHeading}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {otherServices.map(otherId => {
              const other = THEMATIC_SERVICES_SEO[otherId];
              return (
                <a
                  key={otherId}
                  href={buildSeoUrl(lang, 'service', { serviceId: otherId })}
                  onClick={(e) => handleLinkClick(e, 'service', { serviceId: otherId })}
                  className="bg-white px-5 py-4 rounded-2xl border border-stone-200/80 hover:border-primary/40 hover:text-primary text-stone-800 font-semibold text-sm flex items-center justify-between transition-colors"
                >
                  <span>{other.cardLabels[lang]}</span>
                  <ArrowRight size={15} className="text-stone-400" />
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </article>
  );
};

export default ServiceLandingPage;
