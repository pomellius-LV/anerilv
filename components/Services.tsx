import React from 'react';
import { Content, Language, View } from '../types';
import { ServiceSectionId, buildSeoUrl } from '../data/seoRoutes';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface ServicesProps {
  lang: Language;
  content: Content;
  onNavigate?: (
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => void;
}

const SERVICES_UI: Record<
  Language,
  {
    eyebrow: string;
    subtitle: string;
    allPrices: string;
    explore: string;
    fromPrefix: string;
  }
> = {
  lv: {
    eyebrow: 'Skaistumkopšanas Virzieni · Rīga',
    subtitle: 'Seši profesionāli virzieni ar pārbaudītu Eiropas kosmētiku un caurspīdīgām cenām.',
    allPrices: 'Pilns cenrādis',
    explore: 'Skatīt cenas un detaļas',
    fromPrefix: 'no'
  },
  ru: {
    eyebrow: 'Направления Салона · Рига',
    subtitle: 'Шесть профильных направлений на проверенной европейской косметике с честными ценами.',
    allPrices: 'Полный прайс-лист',
    explore: 'Подробнее и цены',
    fromPrefix: 'от'
  },
  en: {
    eyebrow: 'Curated Studio Disciplines · Riga',
    subtitle: 'Six specialized beauty departments delivered with European clinical and salon formulations.',
    allPrices: 'Full price list',
    explore: 'Explore & view prices',
    fromPrefix: 'from'
  }
};

const BENTO_SPAN_BY_ID: Record<ServiceSectionId, string> = {
  hair: 'md:col-span-2 lg:col-span-7 min-h-[340px] lg:min-h-[420px]',
  nails: 'lg:col-span-5 min-h-[340px] lg:min-h-[420px]',
  cosmetology: 'lg:col-span-5 min-h-[320px] lg:min-h-[360px]',
  permanent: 'md:col-span-2 lg:col-span-7 min-h-[320px] lg:min-h-[360px]',
  waxing: 'lg:col-span-6 min-h-[290px] lg:min-h-[320px]',
  solarium: 'lg:col-span-6 min-h-[290px] lg:min-h-[320px]'
};

const IMAGE_DIMENSIONS: Record<ServiceSectionId, { w: number; h: number }> = {
  hair: { w: 1280, h: 720 },
  nails: { w: 1040, h: 780 },
  cosmetology: { w: 1040, h: 780 },
  permanent: { w: 1280, h: 720 },
  waxing: { w: 1040, h: 780 },
  solarium: { w: 1040, h: 780 }
};

function getStartingPrice(content: Content, sectionId: ServiceSectionId): string | null {
  const section = content.prices?.sections?.find((s) => s.id === sectionId);
  if (!section) return null;

  let minVal = Infinity;
  for (const cat of section.categories) {
    for (const srv of cat.services) {
      const match = srv.price.match(/(\d+(?:[.,]\d+)?)/);
      if (!match) continue;
      const numeric = parseFloat(match[1].replace(',', '.'));
      if (Number.isFinite(numeric) && numeric > 0 && numeric < minVal) {
        minVal = numeric;
      }
    }
  }

  if (!Number.isFinite(minVal)) return null;
  return `${minVal.toFixed(2)} €`;
}

const Services: React.FC<ServicesProps> = ({ lang, content, onNavigate }) => {
  const { services } = content;
  const ui = SERVICES_UI[lang] || SERVICES_UI.lv;

  const handleServiceClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: ServiceSectionId
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (onNavigate) {
      e.preventDefault();
      onNavigate('service', { serviceId: id });
    }
  };

  const handlePricesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (onNavigate) {
      e.preventDefault();
      onNavigate('prices');
    }
  };

  return (
    <section id="services" className="relative py-20 md:py-28 bg-[#F5F6F8]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Editorial Asymmetric Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-slate-200/80">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#8E1B32] font-semibold mb-3">
              {ui.eyebrow}
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold text-[#25282E] tracking-tight leading-[1.05]">
              {services.title}
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-3 max-w-md">
            <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed md:text-right">
              {ui.subtitle}
            </p>
            <a
              href={buildSeoUrl(lang, 'prices')}
              onClick={handlePricesClick}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#25282E] hover:text-[#8E1B32] transition-colors"
            >
              <span className="border-b border-slate-300 group-hover:border-[#8E1B32] pb-0.5 transition-colors">
                {ui.allPrices}
              </span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform text-[#8E1B32]"
              />
            </a>
          </div>
        </div>

        {/* Asymmetric 12-Column Metallic Photo Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6">
          {services.items.map((item, idx) => {
            const serviceId = item.id as ServiceSectionId;
            const href = buildSeoUrl(lang, 'service', { serviceId });
            const startingPrice = getStartingPrice(content, serviceId);
            const spanClass =
              BENTO_SPAN_BY_ID[serviceId] || 'lg:col-span-4 min-h-[300px]';
            const dims = IMAGE_DIMENSIONS[serviceId] || { w: 1040, h: 780 };
            const indexLabel = String(idx + 1).padStart(2, '0');

            return (
              <a
                key={item.id}
                href={href}
                onClick={(e) => handleServiceClick(e, serviceId)}
                className={`group relative overflow-hidden rounded-2xl border border-slate-300/70 bg-gradient-to-br from-[#4D525B] via-[#3E424A] to-[#2F333B] flex flex-col justify-between p-7 sm:p-8 shadow-sm hover:shadow-[0_24px_60px_rgba(37,40,46,0.16)] transition-all duration-500 ${spanClass}`}
              >
                {/* Bespoke Editorial Service Photo */}
                <img
                  src={`/assets/services/${serviceId}.jpg`}
                  alt={item.title}
                  width={dims.w}
                  height={dims.h}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Metallic Graphite Photo Scrim */}
                <div
                  className="absolute inset-0 bg-bento-scrim transition-opacity duration-500"
                  aria-hidden="true"
                />

                {/* Top Row: Cool Silver Index + Action Arrow */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-sans text-[11px] font-semibold tracking-[0.26em] text-[#E3E7ED] tabular-nums">
                    {indexLabel}
                  </span>
                  <span className="w-9 h-9 rounded-full border border-white/30 bg-[#3A3E45]/55 backdrop-blur-sm text-white flex items-center justify-center group-hover:bg-[#8E1B32] group-hover:border-[#8E1B32] transition-all duration-300">
                    <ArrowUpRight
                      size={16}
                      className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                    />
                  </span>
                </div>

                {/* Bottom Row: Starting Price + White Serif Heading */}
                <div className="relative z-10 mt-14 max-w-xl">
                  {startingPrice && (
                    <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#E3E7ED] mb-2 tabular-nums flex items-center gap-2">
                      <span className="inline-block w-3 h-[2px] bg-[#D62847]" aria-hidden="true" />
                      <span>
                        {ui.fromPrefix} {startingPrice}
                      </span>
                    </p>
                  )}

                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-white mb-2.5 tracking-tight leading-tight transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-100/90 font-light text-sm leading-relaxed line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/95 group-hover:text-white transition-colors">
                    <span className="border-b border-white/35 group-hover:border-[#E33955] pb-0.5 transition-colors">
                      {ui.explore}
                    </span>
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-1 transition-transform text-[#E33955]"
                    />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
