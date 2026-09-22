'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles, Camera, Eye } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';

interface ProductVisualsGalleryProps {
  images: string[];
  productName: string;
  productSlug?: string;
}

export default function ProductVisualsGallery({
  images,
  productName,
  productSlug,
}: ProductVisualsGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!images || images.length <= 1) {
    return null;
  }

  const cleanImages = images.map((img) => resolveImageUrl(img));

  const getPerspectiveLabel = (idx: number, url: string) => {
    const lower = url.toLowerCase();
    if (idx === 0) return 'Primary Authentic Angle';
    if (lower.includes('display') || lower.includes('studio')) return 'Studio & Packaging Display';
    if (lower.includes('process') || lower.includes('creation')) return 'Artisanal Creation Journey';
    if (lower.includes('poster') || lower.includes('ad')) return 'Official Product Poster';
    if (lower.includes('label') || lower.includes('jar')) return 'Jar & Seal Perspective';
    if (lower.includes('shoot') || lower.includes('purple')) return 'Real Color & Texture';
    return `Perspective View ${idx + 1}`;
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx === 0 ? cleanImages.length - 1 : selectedIdx - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx === cleanImages.length - 1 ? 0 : selectedIdx + 1);
  };

  return (
    <section className="mt-16 bg-[#FAF9F5] border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#3A6B35]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3A6B35]/10 text-[#3A6B35] text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Authentic Visual Showcase</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#2B2B2B]">
            All Perspectives & Secondary Images
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Detailed close-ups, packaging views, and real product visuals for{' '}
            <strong className="text-stone-900 font-semibold">{productName}</strong>. Click any image to view in high resolution.
          </p>
        </div>

        {/* Visuals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {cleanImages.map((imgUrl, idx) => {
            const label = getPerspectiveLabel(idx, imgUrl);
            const isPrimary = idx === 0;

            return (
              <motion.div
                key={imgUrl + idx}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedIdx(idx)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={`${productName} - ${label}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-108"
                    onError={(e: any) => {
                      e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                    }}
                  />

                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-md ${
                        isPrimary
                          ? 'bg-[#3A6B35] text-white'
                          : 'bg-white/90 text-stone-800 border border-stone-200/80'
                      }`}
                    >
                      {isPrimary ? '★ Primary View' : `View #${idx + 1}`}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                    <Eye className="w-4 h-4" />
                    <span>Enlarge</span>
                  </div>
                </div>

                {/* Caption Footer */}
                <div className="p-3 bg-white border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-stone-700 truncate" title={label}>
                    {label}
                  </span>
                  <Maximize2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#3A6B35] shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedIdx(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
              aria-label="Close high-res view"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Image Container */}
            <div
              className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh] sm:h-[75vh]">
                <Image
                  src={cleanImages[selectedIdx]}
                  alt={`${productName} - View ${selectedIdx + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Caption */}
              <div className="mt-4 text-center text-white space-y-1">
                <p className="text-sm font-semibold tracking-wide text-[#D9A441]">
                  {getPerspectiveLabel(selectedIdx, cleanImages[selectedIdx])}
                </p>
                <p className="text-xs text-stone-300">
                  {productName} &bull; Image {selectedIdx + 1} of {cleanImages.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
