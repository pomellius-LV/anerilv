import React, { useState, useEffect } from 'react';
import { Content, Language, View } from '../types';
import { ServiceSectionId, THEMATIC_SERVICES_SEO, buildSeoUrl } from '../data/seoRoutes';
import { ArrowLeft, ArrowUpRight, Phone } from 'lucide-react';

interface PricePageProps {
  lang: Language;
  content: Content;
  onNavigate: (
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => void;
  onBookingCall?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const PRICE_UI: Record<Language, { eyebrow: string; categoriesLabel: string }> = {
  lv: { eyebrow: 'Pakalpojumi un Cenas · Rīga', categoriesLabel: 'Kategorijas' },
  ru: { eyebrow: 'Услуги и Цены · Рига', categoriesLabel: 'Разделы' },
  en: { eyebrow: 'Services & Pricing · Riga', categoriesLabel: 'Categories' }
};

const PricePage: React.FC<PricePageProps> = ({ lang, content, onNavigate, onBookingCall }) => {
  const sections = content.prices.sections;
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || 'hair');
  const ui = PRICE_UI[lang] || PRICE_UI.lv;

  useEffect(() => {
    const handleScroll = () => {
      const offset = 190;
      let current = sections[0]?.id || 'hair';
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= offset) {
            current = sec.id;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(view, options);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveId(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="min-h-screen bg-[#F5F6F8]">
      {/* Metallic Signboard Page Header */}
      <div className="bg-signboard-metal relative overflow-hidden pt-28 md:pt-36 pb-12 border-b border-slate-500/40">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <a
            href={buildSeoUrl(lang, 'home')}
            onClick={(e) => handleLink(e, 'home')}
            className="inline-flex items-center gap-2 text-[#E3E7ED] hover:text-white text-xs font-semibold uppercase tracking-[0.2em] mb-8 transition-colors"
          >
            <ArrowLeft size={15} className="text-[#E33955]" />
            <span>{content.nav.home}</span>
          </a>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#C7CDD6] font-semibold mb-3">
                {ui.eyebrow}
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-semibold text-white mb-4 tracking-tight leading-[1.02]">
                {content.prices.title}
              </h1>
              <p className="text-base sm:text-lg text-[#E3E7ED]/90 font-light leading-relaxed max-w-2xl">
                {content.prices.description}
              </p>
            </div>

            <a
              href="tel:+37127580047"
              onClick={onBookingCall}
              className="shrink-0 inline-flex items-center justify-center gap-3 bg-[#8E1B32] hover:bg-white hover:text-[#25282E] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-colors shadow-lg border border-white/15 whitespace-nowrap"
            >
              <Phone size={15} />
              <span className="tabular-nums">+371 27580047</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Category Jump Bar (Sticky on tablet/desktop only) */}
      <div className="md:sticky md:top-[60px] z-40 bg-[#F5F6F8]/95 backdrop-blur-md border-b border-slate-200/90">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <nav
            aria-label={ui.categoriesLabel}
            className="flex items-center gap-2 py-3 overflow-x-auto"
          >
            {sections.map((section, idx) => {
              const sId = section.id as ServiceSectionId;
              const shortLabel =
                THEMATIC_SERVICES_SEO[sId]?.cardLabels[lang]?.split(' ')[0] ||
                section.sectionTitle.replace(/^\d+\.\s*/, '');
              const isActive = activeId === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-[#8E1B32] text-white border-[#8E1B32] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#8E1B32]/50 hover:text-[#8E1B32]'
                  }`}
                >
                  <span
                    className={`tabular-nums text-[10px] ${
                      isActive ? 'text-white/85' : 'text-slate-400'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span>{shortLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tabular D1 Price Sections */}
      <div className="container mx-auto px-4 md:px-6 max-w-6xl py-14 md:py-20">
        <div className="space-y-20">
          {sections.map((section, sIdx) => {
            const sId = section.id as ServiceSectionId;
            const serviceHref = buildSeoUrl(lang, 'service', { serviceId: sId });
            const serviceLabel = THEMATIC_SERVICES_SEO[sId]?.cardLabels[lang];

            return (
              <div key={section.id} id={section.id} className="space-y-8 scroll-mt-40">
                {/* Editorial Section Split Header with Mini Thumbnail */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border border-slate-300/80 bg-[#3A3E45] shrink-0 shadow-xs">
                      <img
                        src={`/assets/services/${sId}.jpg`}
                        alt={section.sectionTitle}
                        width={192}
                        height={128}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8E1B32] tabular-nums mb-1">
                        0{sIdx + 1}
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-serif font-semibold text-[#25282E] tracking-tight">
                        <a
                          href={serviceHref}
                          onClick={(e) => handleLink(e, 'service', { serviceId: sId })}
                          className="hover:text-[#8E1B32] transition-colors inline-flex items-baseline gap-2"
                        >
                          <span>{section.sectionTitle.replace(/^\d+\.\s*/, '')}</span>
                          <ArrowUpRight size={18} className="text-[#8E1B32]/70 shrink-0" />
                        </a>
                      </h2>
                    </div>
                  </div>

                  {serviceLabel && (
                    <a
                      href={serviceHref}
                      onClick={(e) => handleLink(e, 'service', { serviceId: sId })}
                      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-600 hover:text-[#8E1B32] transition-colors shrink-0"
                    >
                      <span className="border-b border-slate-300 hover:border-[#8E1B32] pb-0.5">
                        {serviceLabel}
                      </span>
                      <ArrowUpRight size={13} className="text-[#8E1B32]" />
                    </a>
                  )}
                </div>

                {/* Tabular Menu Cards */}
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                  {section.categories.map((category, cIdx) => (
                    <div
                      key={cIdx}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
                    >
                      <div className="bg-[#ECEFF3] px-6 sm:px-7 py-4 border-b border-slate-200/80 flex items-center justify-between gap-3">
                        <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#25282E]">
                          {category.title}
                        </h3>
                        <span className="text-xs font-semibold text-[#8E1B32] tabular-nums">
                          {category.services.length}
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {category.services.map((service, iIdx) => (
                          <div
                            key={iIdx}
                            className="px-6 sm:px-7 py-3.5 flex justify-between items-baseline gap-4 hover:bg-[#F5F6F8]/70 transition-colors"
                          >
                            <span className="text-slate-700 font-normal text-sm sm:text-base leading-snug">
                              {service.name}
                            </span>
                            <span className="text-[#25282E] font-sans font-bold tabular-nums whitespace-nowrap text-sm sm:text-base">
                              {service.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* SEO Article Cross-Links */}
                {section.seoLinks && section.seoLinks.length > 0 && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                    {section.seoLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={buildSeoUrl(lang, 'article', { articleId: link.articleId })}
                        onClick={(e) => handleLink(e, 'article', { articleId: link.articleId })}
                        className="text-xs text-slate-500 hover:text-[#8E1B32] transition-colors underline decoration-slate-300 hover:decoration-[#8E1B32]"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Metallic Signboard Callout */}
        <div className="mt-20 p-8 sm:p-12 bg-signboard-metal rounded-2xl border border-slate-500/40 text-center max-w-4xl mx-auto shadow-lg relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
            aria-hidden="true"
          />
          <p className="text-[#E3E7ED] text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
            {content.prices.disclaimer}
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="tel:+37127580047"
              onClick={onBookingCall}
              className="inline-flex items-center gap-3 bg-[#8E1B32] text-white px-9 py-4 rounded-full font-semibold uppercase tracking-[0.16em] text-xs sm:text-sm hover:bg-white hover:text-[#25282E] transition-colors shadow-xl"
            >
              <Phone size={16} />
              <span>{content.nav.bookBtn}</span>
              <span className="tabular-nums">+371 27580047</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricePage;
