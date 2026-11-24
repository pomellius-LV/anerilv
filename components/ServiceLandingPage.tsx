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
  onBookingCall?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
  onNavigate,
  onBookingCall
}) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const seo = THEMATIC_SERVICES_SEO[serviceId];
  const labels = LABELS[lang];
  const priceSection =
    content.prices.sections.find((s) => s.id === serviceId) ||
    content.prices.sections[0];

  const relatedArticles = (content.articles || []).filter((art) =>
    seo.relatedArticleIds.includes(art.id)
  );
  const otherServices = SERVICE_SECTION_IDS.filter((id) => id !== serviceId);

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
    <article className="min-h-screen bg-[#F5F6F8]">
      {/* Metallic Signboard Split Cover */}
      <header className="bg-signboard-metal relative overflow-hidden pt-28 md:pt-36 pb-14 border-b border-slate-500/40">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Crawlable Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#C7CDD6] mb-8"
          >
            <a
              href={buildSeoUrl(lang, 'home')}
              onClick={(e) => handleLinkClick(e, 'home')}
              className="text-white hover:text-[#E33955] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} className="text-[#E33955]" /> {content.nav.home}
            </a>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <a
              href={buildSeoUrl(lang, 'prices')}
              onClick={(e) => handleLinkClick(e, 'prices')}
              className="hover:text-white transition-colors"
            >
              {content.nav.prices}
            </a>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <span className="text-white/90">{seo.cardLabels[lang]}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-semibold text-white mb-4 tracking-tight leading-[1.06]">
                  {seo.h1[lang]}
                </h1>
                <p className="text-lg sm:text-xl text-[#E3E7ED] font-serif italic mb-5">
                  {seo.subtitles[lang]}
                </p>
                <p className="text-[#C7CDD6] font-light text-sm sm:text-base leading-relaxed mb-8">
                  {seo.intro[lang]}
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="tel:+37127580047"
                    onClick={onBookingCall}
                    className="inline-flex items-center gap-3 bg-[#8E1B32] hover:bg-white hover:text-[#25282E] text-white px-7 py-3.5 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-[0.16em] transition-colors shadow-lg border border-white/15 whitespace-nowrap"
                  >
                    <Phone size={15} />
                    <span>{content.nav.bookBtn}:</span>
                    <span className="tabular-nums">+371 27580047</span>
                  </a>

                  <a
                    href={buildSeoUrl(lang, 'prices')}
                    onClick={(e) => handleLinkClick(e, 'prices')}
                    className="inline-flex items-center gap-2 text-[#E3E7ED] hover:text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                  >
                    <span className="border-b border-white/30 hover:border-[#E33955] pb-0.5">
                      {labels.fullPriceLink}
                    </span>
                    <ArrowRight size={14} className="text-[#E33955]" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#E3E7ED]/90 pt-4 border-t border-white/15">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={14} className="text-[#E33955] shrink-0" />
                    {labels.addressShort}
                  </span>
                  <span aria-hidden="true" className="text-white/30">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Car size={14} className="text-[#E33955] shrink-0" />
                    {labels.parkingBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column Framed Service Photo */}
            <div className="lg:col-span-5">
              <div className="h-full min-h-[240px] rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-[#4D525B] to-[#35383F] shadow-2xl">
                <img
                  src={`/assets/services/${serviceId}.jpg`}
                  alt={seo.cardLabels[lang]}
                  width={1040}
                  height={780}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl py-16 md:py-20">
        {/* 3 Concrete Riga Highlights */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {seo.highlights[lang].map((hl, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5"
            >
              <span className="block text-[11px] font-semibold tracking-[0.22em] text-[#8E1B32] tabular-nums">
                0{idx + 1}
              </span>
              <h2 className="text-xl font-serif font-semibold text-[#25282E]">
                {hl.title}
              </h2>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {hl.text}
              </p>
            </div>
          ))}
        </section>

        {/* Live D1-synced Prices for this Service Section */}
        {priceSection && (
          <section className="mb-16">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#25282E] whitespace-nowrap">
                {priceSection.sectionTitle}
              </h2>
              <div className="h-px w-full bg-slate-200" />
            </div>

            <div className="grid lg:grid-cols-2 gap-7 items-start">
              {priceSection.categories.map((category, cIdx) => (
                <div
                  key={cIdx}
                  className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden"
                >
                  <div className="bg-[#ECEFF3] px-7 py-4 border-b border-slate-200/80 flex items-center justify-between">
                    <h3 className="text-2xl font-serif font-semibold text-[#25282E]">
                      {category.title}
                    </h3>
                    <span className="text-xs font-semibold text-[#8E1B32] tabular-nums">
                      {category.services.length}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {category.services.map((srv, sIdx) => (
                      <div
                        key={sIdx}
                        className="px-7 py-3.5 flex justify-between items-baseline gap-4 hover:bg-[#F5F6F8]/70 transition-colors"
                      >
                        <span className="text-slate-700 font-normal text-sm md:text-base">
                          {srv.name}
                        </span>
                        <span className="text-[#25282E] font-sans font-bold tabular-nums whitespace-nowrap text-sm md:text-base">
                          {srv.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs md:text-sm text-slate-500 italic text-center">
              {content.prices.disclaimer}
            </p>
          </section>
        )}

        {/* Service-Specific FAQ */}
        {seo.faqs[lang].length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-semibold text-[#25282E] mb-6">
              {labels.faqHeading}
            </h2>
            <div className="space-y-3">
              {seo.faqs[lang].map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border overflow-hidden shadow-xs transition-colors ${
                      isOpen ? 'border-[#8E1B32]/40' : 'border-slate-200/90'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center p-6 text-left group"
                    >
                      <span
                        className={`text-lg font-serif font-semibold pr-4 transition-colors ${
                          isOpen ? 'text-[#8E1B32]' : 'text-[#25282E] group-hover:text-[#8E1B32]'
                        }`}
                      >
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#8E1B32]' : 'text-slate-400'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-slate-600 font-light leading-relaxed text-base border-t border-slate-100 pt-4">
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
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#25282E] mb-6 flex items-center gap-2.5">
              <BookOpen size={22} className="text-[#8E1B32]" />
              {labels.articlesHeading}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedArticles.map((art) => (
                <a
                  key={art.id}
                  href={buildSeoUrl(lang, 'article', { articleId: art.id })}
                  onClick={(e) => handleLinkClick(e, 'article', { articleId: art.id })}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-[#8E1B32]/40 hover:shadow-md transition-all flex items-center justify-between gap-4 group"
                >
                  <div>
                    <h3 className="font-serif font-semibold text-lg text-[#25282E] group-hover:text-[#8E1B32] transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {art.metaDescription}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-slate-300 group-hover:text-[#8E1B32] group-hover:translate-x-1 transition-all shrink-0"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Internal Cross-Linking to Other 5 Thematic Riga Pages */}
        <section className="pt-10 border-t border-slate-200">
          <h2 className="text-xl font-serif font-semibold text-[#25282E] mb-5">
            {labels.otherServicesHeading}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {otherServices.map((otherId) => {
              const other = THEMATIC_SERVICES_SEO[otherId];
              return (
                <a
                  key={otherId}
                  href={buildSeoUrl(lang, 'service', { serviceId: otherId })}
                  onClick={(e) => handleLinkClick(e, 'service', { serviceId: otherId })}
                  className="bg-white px-5 py-4 rounded-xl border border-slate-200/90 hover:border-[#8E1B32]/40 hover:text-[#8E1B32] text-[#25282E] font-semibold text-sm flex items-center justify-between transition-colors"
                >
                  <span>{other.cardLabels[lang]}</span>
                  <ArrowRight size={15} className="text-slate-400" />
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
