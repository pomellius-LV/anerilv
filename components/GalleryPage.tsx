
import React, { useState } from 'react';
import { Content, View } from '../types';
import { ArrowLeft, Instagram, X, Maximize2 } from 'lucide-react';
import { galleryPhotos } from '../data/photos';

interface GalleryPageProps {
  content: Content;
  setView: (view: View) => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ content, setView }) => {
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visiblePhotos = galleryPhotos.slice(0, visibleCount);

  const showMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, galleryPhotos.length));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  return (
    <section className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <button 
          onClick={() => setView('home')} 
          className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-12 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft size={16} /> {content.nav.home}
        </button>

        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-900 mb-6 tracking-tight">
            {content.gallery.title}
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed italic">
            {content.gallery.description}
          </p>
        </div>

        {/* Masonry Grid using CSS Columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {visiblePhotos.map((url, index) => (
            <div 
              key={index} 
              className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              onClick={() => openLightbox(index)}
            >
              <img 
                src={url} 
                alt={`Salons Aneri work ${index + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                <Maximize2 className="text-white drop-shadow-md" size={32} />
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {visibleCount < galleryPhotos.length && (
          <div className="mt-16 text-center">
            <button 
              onClick={showMore}
              className="bg-white border border-stone-200 text-stone-800 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all shadow-sm"
            >
              {content.gallery.showMore}
            </button>
          </div>
        )}

        {/* Instagram Button */}
        <div className="mt-20 flex justify-center">
          <a 
            href="https://www.instagram.com/salons_aneri/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:shadow-lg hover:scale-105 transition-all transform"
          >
            <Instagram size={20} />
            {content.gallery.instagramBtn}
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={closeLightbox}
          >
            <X size={40} />
          </button>
          
          <img 
            src={galleryPhotos[lightboxIndex]} 
            alt="Full view" 
            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
        </div>
      )}
    </section>
  );
};

export default GalleryPage;
