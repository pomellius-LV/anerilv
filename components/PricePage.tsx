import React from 'react';
import { Content, Language, View } from '../types';
import { ServiceSectionId, THEMATIC_SERVICES_SEO, buildSeoUrl } from '../data/seoRoutes';
import { ArrowLeft, ArrowUpRight, CheckCircle } from 'lucide-react';

interface PricePageProps {
  lang: Language;
  content: Content;
  onNavigate: (
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => void;
}

const PricePage: React.FC<PricePageProps> = ({ lang, content, onNavigate }) => {
  const handleLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    view: View,
    options?: { serviceId?: ServiceSectionId; articleId?: string }
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(view, options);
  };

  return (
    <section className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <a
          href={buildSeoUrl(lang, 'home')}
          onClick={(e) => handleLink(e, 'home')}
          className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-12 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft size={16} /> {content.nav.home}
        </a>

        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-900 mb-6 tracking-tight">
            {content.prices.title}
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed italic">
            {content.prices.description}
          </p>
        </div>

        <div className="space-y-24">
          {content.prices.sections.map((section, sIdx) => {
            const sId = section.id as ServiceSectionId;
            const serviceHref = buildSeoUrl(lang, 'service', { serviceId: sId });
            const serviceLabel = THEMATIC_SERVICES_SEO[sId]?.cardLabels[lang];

            return (
              <div key={sIdx} id={section.id} className="space-y-12 scroll-mt-32">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 whitespace-nowrap">
                    <a
                      href={serviceHref}
                      onClick={(e) => handleLink(e, 'service', { serviceId: sId })}
                      className="hover:text-primary transition-colors inline-flex items-baseline gap-2"
                    >
                      <span>{section.sectionTitle}</span>
                      {serviceLabel && (
                        <ArrowUpRight size={20} className="text-primary/50 shrink-0" />
                      )}
                    </a>
                  </h2>
                  <div className="h-px w-full bg-stone-200"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                  {section.categories.map((category, cIdx) => (
                    <div
                      key={cIdx}
                      className="bg-white p-10 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-shadow duration-500"
                    >
                      <h3 className="text-2xl font-serif font-bold text-primary mb-8 flex items-center gap-3">
                        <CheckCircle size={20} className="text-primary/40" />
                        {category.title}
                      </h3>

                      <div className="space-y-6">
                        {category.services.map((service, iIdx) => (
                          <div key={iIdx} className="flex justify-between items-baseline group">
                            <span className="text-stone-700 font-light text-lg pr-4 group-hover:text-stone-900 transition-colors">
                              {service.name}
                            </span>
                            <div className="flex-grow border-b border-dotted border-stone-200 h-px mx-2"></div>
                            <span className="text-stone-900 font-sans font-bold tabular-nums whitespace-nowrap text-lg">
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
                  <div className="mt-8 flex flex-wrap gap-4 justify-center opacity-50 hover:opacity-100 transition-opacity">
                    {section.seoLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={buildSeoUrl(lang, 'article', { articleId: link.articleId })}
                        onClick={(e) => handleLink(e, 'article', { articleId: link.articleId })}
                        className="text-[11px] text-stone-500 hover:text-primary transition-colors underline decoration-stone-300"
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

        <div className="mt-24 p-12 bg-white rounded-[3rem] border border-stone-100 text-center max-w-4xl mx-auto shadow-sm">
          <p className="text-stone-500 italic text-lg font-light leading-relaxed">
            {content.prices.disclaimer}
          </p>
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8">
            <a
              href="tel:+37127580047"
              className="bg-primary text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-900 transition-colors shadow-xl"
            >
              {content.nav.bookBtn} +371 27580047
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricePage;
