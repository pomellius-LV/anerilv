import React from 'react';
import { Content, Language } from '../types';
import { Clock, MapPin, Phone, Star, ArrowUpRight, Car } from 'lucide-react';
import { useRigaSalonStatus } from '../utils/salonHours';
import { dataService } from '../services/dataService';

interface AdvantagesProps {
  content: Content;
  lang?: Language;
}

const TRUST_UI: Record<
  Language,
  {
    eyebrow: string;
    parkingLine: string;
    hoursHeading: string;
    scheduleMonSat: string;
    scheduleSun: string;
    googleReviewsSingular: string;
    googleReviewsPlural: string;
    googleVerifiedFallback: string;
    experienceFallback: string;
    openGoogleBtn: string;
    brandsEyebrow: string;
  }
> = {
  lv: {
    eyebrow: 'Uzticība un Komforts · Rīga',
    parkingLine: 'Bezmaksas privātā stāvvieta pie ieejas un ērts 7. tramvajs no centra',
    hoursHeading: 'Darba laiks (Rīga)',
    scheduleMonSat: 'P.–S.',
    scheduleSun: 'Sv.',
    googleReviewsSingular: 'atsauksme Google',
    googleReviewsPlural: 'atsauksmes Google',
    googleVerifiedFallback: 'Pārbaudīts Google Maps profils · Latgales iela 264',
    experienceFallback: '15+ gadu pieredze Rīgā',
    openGoogleBtn: 'Skatīt Google Maps atsauksmes',
    brandsEyebrow: 'Profesionālās kosmētikas zīmoli salonā'
  },
  ru: {
    eyebrow: 'Доверие и Комфорт · Рига',
    parkingLine: 'Бесплатная частная парковка у входа и прямой 7-й трамвай из центра',
    hoursHeading: 'Время работы (Рига)',
    scheduleMonSat: 'Пн–Сб',
    scheduleSun: 'Вс',
    googleReviewsSingular: 'отзыв в Google',
    googleReviewsPlural: 'отзывов в Google',
    googleVerifiedFallback: 'Профиль в Google Maps · ул. Латгалес 264',
    experienceFallback: 'Более 15 лет опыта в Риге',
    openGoogleBtn: 'Открыть отзывы в Google Maps',
    brandsEyebrow: 'Профессиональная косметика и бренды салона'
  },
  en: {
    eyebrow: 'Trust & Hospitality · Riga',
    parkingLine: 'Complimentary private parking at the entrance & direct Tram 7 from city center',
    hoursHeading: 'Opening Hours (Riga)',
    scheduleMonSat: 'Mon–Sat',
    scheduleSun: 'Sun',
    googleReviewsSingular: 'Google review',
    googleReviewsPlural: 'Google reviews',
    googleVerifiedFallback: 'Verified Google Maps location · Latgales iela 264',
    experienceFallback: '15+ Years Serving Riga',
    openGoogleBtn: 'View on Google Maps',
    brandsEyebrow: 'Authentic professional salon brands'
  }
};

const SALON_BRANDS = [
  { name: "L'ORÉAL", sub: 'Professionnel Paris', isMatrix: false },
  { name: 'MATRIX', sub: 'Professional Haircare', isMatrix: true },
  { name: 'GLOBAL', sub: 'Keratin System', isMatrix: false },
  { name: 'GELISH', sub: 'Soak-Off Gel Polish', isMatrix: false },
  { name: 'PRX-T33', sub: 'Biorevitalization', isMatrix: false },
  { name: 'COSMO & MELA PEEL', sub: 'Dermaceutics', isMatrix: false }
] as const;

const Advantages: React.FC<AdvantagesProps> = ({ content, lang = 'lv' }) => {
  const status = useRigaSalonStatus(lang);
  const googleProfile = dataService.getGoogleProfile();
  const ui = TRUST_UI[lang] || TRUST_UI.lv;

  const hasNumericRating =
    Boolean(googleProfile.rating) && Number.isFinite(Number(googleProfile.rating));
  const numericReviewsCount = Number(googleProfile.reviewsCount || 0);

  return (
    <section
      id="advantages"
      className="relative py-20 md:py-28 bg-white border-t border-slate-200/80"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Top Architectural Grid: Advantages + Metallic Hours Card + Google Reputation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-16">
          {/* Left Column: Salon Advantages & Concierge Access */}
          <div className="lg:col-span-7 bg-[#F5F6F8] rounded-2xl border border-slate-200/90 p-8 sm:p-10 md:p-12 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#8E1B32] font-semibold mb-3">
                {ui.eyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#25282E] tracking-tight mb-8 leading-[1.08]">
                {content.advantages.title}
              </h2>

              <div className="divide-y divide-slate-200/90 border-y border-slate-200/90">
                {content.advantages.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-4 sm:py-5 flex items-baseline gap-5"
                  >
                    <span className="font-sans text-xs font-semibold tracking-[0.2em] text-[#8E1B32] tabular-nums shrink-0">
                      0{idx + 1}
                    </span>
                    <p className="text-[#25282E] text-base sm:text-lg font-normal leading-snug">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-3 text-sm text-slate-600 max-w-md">
                <Car size={18} className="text-[#8E1B32] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{ui.parkingLine}</span>
              </div>

              <a
                href="tel:+37127580047"
                className="shrink-0 inline-flex items-center justify-center gap-2.5 bg-[#8E1B32] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#3A3E45] transition-colors shadow-sm"
              >
                <Phone size={15} />
                <span className="tabular-nums">+371 27580047</span>
              </a>
            </div>
          </div>

          {/* Right Column: Signboard Metallic Hours Card + Google Maps Reputation */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Live Hours & Europe/Riga Status — Brushed Metallic Signboard Style */}
            <div className="bg-signboard-metal text-white rounded-2xl p-8 sm:p-9 border border-slate-500/40 flex-1 flex flex-col justify-between relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
                aria-hidden="true"
              />
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[#E3E7ED] font-semibold">
                    {ui.hoursHeading}
                  </span>
                  <Clock
                    size={18}
                    className={status.isOpen ? 'text-[#E33955]' : 'text-[#C7CDD6]'}
                  />
                </div>

                <p className="text-2xl sm:text-3xl font-serif font-semibold text-white mb-2 leading-tight">
                  {status.statusText}
                </p>
                <p className="text-xs sm:text-sm text-[#E3E7ED]/90 font-light">
                  {status.subText}
                </p>
              </div>

              <div className="mt-7 pt-5 border-t border-white/15 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#C7CDD6]">{ui.scheduleMonSat}</span>
                  <span className="font-medium tabular-nums text-white">09:00 – 20:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#C7CDD6]">{ui.scheduleSun}</span>
                  <span className="font-medium tabular-nums text-white">10:00 – 16:00</span>
                </div>
              </div>
            </div>

            {/* Google Maps Reviews & Verified Reputation */}
            <div className="bg-[#F5F6F8] rounded-2xl p-8 sm:p-9 border border-slate-200/90 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        className="text-[#8E1B32] fill-[#8E1B32]"
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                    <MapPin size={12} className="text-[#8E1B32]" />
                    Google Maps
                  </span>
                </div>

                {hasNumericRating ? (
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl sm:text-5xl font-serif font-semibold text-[#25282E] tabular-nums">
                      {googleProfile.rating}
                    </span>
                    <span className="text-sm text-slate-600 tabular-nums">
                      / 5.0
                      {numericReviewsCount > 0 && (
                        <>
                          {' · '}
                          {numericReviewsCount}{' '}
                          {numericReviewsCount === 1
                            ? ui.googleReviewsSingular
                            : ui.googleReviewsPlural}
                        </>
                      )}
                    </span>
                  </div>
                ) : (
                  <p className="text-2xl sm:text-3xl font-serif font-semibold text-[#25282E] mb-2 leading-tight">
                    {ui.experienceFallback}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-slate-600 font-light">
                  {ui.googleVerifiedFallback}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/90">
                <a
                  href={googleProfile.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#25282E] hover:text-[#8E1B32] transition-colors"
                >
                  <span className="border-b border-slate-300 group-hover:border-[#8E1B32] pb-0.5 transition-colors">
                    {ui.openGoogleBtn}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-[#8E1B32] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Authentic Partner Brands Band — Brushed Metallic + Matrix Crimson Red */}
        <div className="relative overflow-hidden rounded-2xl bg-signboard-metal border border-slate-500/40 px-6 py-8 sm:px-8 sm:py-10 shadow-md">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
            aria-hidden="true"
          />

          <p className="text-center text-[11px] uppercase tracking-[0.24em] text-[#E3E7ED] font-semibold mb-7">
            {ui.brandsEyebrow}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {SALON_BRANDS.map((brand) => (
              <div
                key={brand.name}
                className={`rounded-xl px-4 py-5 text-center flex flex-col items-center justify-center transition-colors border ${
                  brand.isMatrix
                    ? 'bg-[#2C2F36]/90 border-[#D62847]/70 hover:border-[#E33955]'
                    : 'bg-white/[0.06] border-white/15 hover:border-[#D62847]/70'
                }`}
              >
                <span
                  className={`font-serif text-lg sm:text-xl font-semibold tracking-[0.14em] text-white ${
                    brand.isMatrix ? 'pb-1 border-b-2 border-[#D62847]' : ''
                  }`}
                >
                  {brand.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#C7CDD6] mt-1.5">
                  {brand.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;