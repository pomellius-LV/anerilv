import React, { useState, useEffect, useCallback } from 'react';
import { Content, Language, View } from '../types';
import { buildSeoUrl } from '../data/seoRoutes';
import { ArrowLeft, Instagram, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryPhotos } from '../data/photos';

interface GalleryPageProps {
  lang: Language;
  content: Content;
  setView: (view: View) => void;
}

const GALLERY_UI: Record<Language, { eyebrow: string; worksCount: string; closeLabel: string }> = {
  lv: { eyebrow: 'Meistaru Darbu Portfelis · Rīga', worksCount: 'fotogrāfijas', closeLabel: 'Aizvērt' },
  ru: { eyebrow: 'Портфолио Мастеров · Рига', worksCount: 'работ в галерее', closeLabel: 'Закрыть' },
  en: { eyebrow: 'Master Stylists Portfolio · Riga', worksCount: 'works captured', closeLabel: 'Close' }
};

const GalleryPage: React.FC<GalleryPageProps> = ({ lang, content, setView }) => {
  const [visibleCount, setVisibleCount] = useState(16);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ui = GALLERY_UI[lang] || GALLERY_UI.lv;

  const visiblePhotos = galleryPhotos.slice(0, visibleCount);

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 16, galleryPhotos.length));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  const showPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + galleryPhotos.length) % galleryPhotos.length
    );
  }, []);

  const showNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % galleryPhotos.length
    );
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  return (
    <section className="min-h-screen bg-[#F5F6F8]">
      {/* Metallic Signboard Header Banner */}
      <div className="bg-signboard-metal relative overflow-hidden pt-28 md:pt-36 pb-12 border-b border-slate-500/40">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
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
            <span>{content.nav.home}</span>
          </a>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#C7CDD6] font-semibold mb-3">
                {ui.eyebrow}
                <span aria-hidden="true" className="mx-2 text-white/30">
                  ·
                </span>
                <span className="tabular-nums text-white">
                  {galleryPhotos.length} {ui.worksCount}
                </span>
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-semibold text-white mb-4 tracking-tight leading-[1.02]">
                {content.gallery.title}
              </h1>
              <p className="text-base sm:text-lg text-[#E3E7ED]/90 font-light leading-relaxed max-w-2xl">
                {content.gallery.description}
              </p>
            </div>

            <a
              href="https://www.instagram.com/salons_aneri/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-2.5 bg-[#8E1B32] hover:bg-white hover:text-[#25282E] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-colors shadow-lg border border-white/15 whitespace-nowrap"
            >
              <Instagram size={16} />
              <span>{content.gallery.instagramBtn}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Metallic-Framed Masonry Photo Showcase */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-14 md:py-20">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {visiblePhotos.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => openLightbox(index)}
              className="break-inside-avoid w-full text-left relative group rounded-2xl overflow-hidden bg-gradient-to-br from-[#4D525B] to-[#35383F] p-1.5 border border-slate-300/90 hover:border-[#8E1B32] shadow-sm hover:shadow-[0_18px_45px_rgba(37,40,46,0.16)] transition-all duration-300 block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E1B32]"
            >
              <div className="relative rounded-xl overflow-hidden bg-[#3A3E45]">
                <img
                  src={url}
                  alt={`Salons Aneri — ${index + 1}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#25282E]/70 via-transparent to-[#25282E]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-11 h-11 rounded-full bg-[#8E1B32] text-white flex items-center justify-center shadow-lg">
                    <Maximize2 size={18} />
                  </span>
                </div>
                <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold tabular-nums tracking-widest text-white/90 bg-[#25282E]/65 backdrop-blur-sm px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Show More Action */}
        {visibleCount < galleryPhotos.length && (
          <div className="mt-14 text-center">
            <button
              type="button"
              onClick={showMore}
              className="bg-signboard-metal border border-slate-500/40 text-white px-10 py-4 rounded-full font-semibold uppercase tracking-[0.18em] text-xs hover:border-[#8E1B32] transition-all shadow-md"
            >
              {content.gallery.showMore}{' '}
              <span className="tabular-nums text-[#C7CDD6] ml-1">
                ({visibleCount}/{galleryPhotos.length})
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Graphite Metallic Lightbox with Keyboard & Arrow Navigation */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-[#1F2228]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-white/90 z-20 pointer-events-none">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] tabular-nums bg-[#35383F]/85 border border-white/15 px-3.5 py-1.5 rounded-full">
              {lightboxIndex + 1} / {galleryPhotos.length}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label={ui.closeLabel}
              className="pointer-events-auto w-10 h-10 rounded-full bg-[#35383F]/90 hover:bg-[#8E1B32] border border-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <button
            type="button"
            onClick={showPrev}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-[#35383F]/85 hover:bg-[#8E1B32] border border-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={22} />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] rounded-2xl bg-[#3A3E45] p-1.5 border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryPhotos[lightboxIndex]}
              alt={`Salons Aneri — ${lightboxIndex + 1}`}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[82vh] object-contain rounded-xl"
            />
          </div>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-[#35383F]/85 hover:bg-[#8E1B32] border border-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </section>
  );
};

export default GalleryPage;
