'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ChevronLeft, ChevronRight, Maximize2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  discount?: number;
  badges?: string[];
}

export default function ProductImageGallery({
  images,
  productName,
  discount = 0,
  badges = [],
}: ProductImageGalleryProps) {
  const rawList = Array.isArray(images) && images.length > 0
    ? images
    : ['/products/sweet-potato-powder-100g.jpg'];

  const galleryList = rawList.map((img) => resolveImageUrl(img));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(() => galleryList[0]);

  const activeImage = galleryList[activeIndex] || galleryList[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-stone-50 border border-stone-200/80 shadow-sm group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.4, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          >
            <Image
              src={activeImage}
              alt={`${productName} - Image ${activeIndex + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              onError={(e: any) => {
                e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
              }}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>

        {/* Badges Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          {discount > 0 && (
            <span className="bg-gradient-to-r from-red-600 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              Save {discount}%
            </span>
          )}
          {badges.includes('bestseller') && (
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Bestseller
            </span>
          )}
          {badges.includes('organic') && (
            <span className="bg-[#3A6B35] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> 100% Organic
            </span>
          )}
        </div>

        {/* Zoom trigger button */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-stone-700 shadow-md backdrop-blur-sm flex items-center justify-center transition-transform active:scale-95"
          aria-label="Enlarge image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation arrows (shown if multiple images) */}
        {galleryList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-lg backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-lg backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image index counter indicator */}
        {galleryList.length > 1 && (
          <div className="absolute bottom-3 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium pointer-events-none">
            {activeIndex + 1} / {galleryList.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {galleryList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          {galleryList.map((imgUrl, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-[#3A6B35] ring-2 ring-[#3A6B35]/20 shadow-md scale-105'
                    : 'border-stone-200 hover:border-stone-300 opacity-70 hover:opacity-100'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={imgUrl}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  onError={(e: any) => {
                    e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                  }}
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsZoomOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform active:scale-90 z-20"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-h-[80vh] aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={activeImage}
                  alt={productName}
                  fill
                  sizes="(max-width: 1200px) 90vw, 1000px"
                  onError={(e: any) => {
                    e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                  }}
                  className="object-contain"
                />
              </div>

              {galleryList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
