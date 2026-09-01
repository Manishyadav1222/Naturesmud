'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useUIStore } from '@/lib/store/ui-store';
import { formatPrice } from '@/lib/utils';
import { products } from '@/lib/data/products';

export interface MobileHeroPoster {
  id: string;
  name: string;
  subname: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  weight: string;
  badge: string;
  primary: string;
  secondary: string;
  accent: string;
  bgTint: string;
  overlayFrom: string;
  overlayTo: string;
}

export const MOBILE_POSTERS: MobileHeroPoster[] = [
  {
    id: 'papaya-pop',
    name: 'Papaya Pop',
    subname: 'Sun-Ripened Himalayan Dehydrated Papaya',
    slug: 'dehydrated-papaya',
    image: '/images/posters/papaya-pop.jpg',
    price: 380,
    originalPrice: 450,
    weight: '100g',
    badge: '100% Sun Dried',
    primary: '#EA580C',
    secondary: '#C2410C',
    accent: '#FB923C',
    bgTint: 'rgba(234, 88, 12, 0.08)',
    overlayFrom: 'rgba(234,88,12,0.35)',
    overlayTo: 'rgba(80,15,0,0.75)',
  },
  {
    id: 'chia-power',
    name: 'Chia Power',
    subname: 'Himalayan High-Altitude Organic Chia Seeds',
    slug: 'chia-seeds',
    image: '/images/posters/chia-power.jpg',
    price: 420,
    originalPrice: 500,
    weight: '250g',
    badge: 'Omega-3 Rich',
    primary: '#0D9488',
    secondary: '#0F766E',
    accent: '#14B8A6',
    bgTint: 'rgba(13, 148, 136, 0.08)',
    overlayFrom: 'rgba(13,148,136,0.35)',
    overlayTo: 'rgba(2,44,34,0.75)',
  },
  {
    id: 'blueberry-bite',
    name: 'Blueberry Bite',
    subname: 'Premium Wild Himalayan Dried Blueberries',
    slug: 'dried-blueberries',
    image: '/images/posters/blueberry-bite.jpg',
    price: 650,
    originalPrice: 750,
    weight: '100g',
    badge: 'Antioxidant Rich',
    primary: '#7C3AED',
    secondary: '#6D28D9',
    accent: '#8B5CF6',
    bgTint: 'rgba(124, 58, 237, 0.08)',
    overlayFrom: 'rgba(109,40,217,0.35)',
    overlayTo: 'rgba(20,5,50,0.75)',
  },
  {
    id: 'sweet-vibes',
    name: 'Sweet Vibes',
    subname: 'Organic Sweet Potato Superfood Powder',
    slug: 'sweet-potato-powder',
    image: '/images/posters/sweet-vibes.jpg',
    price: 450,
    originalPrice: 520,
    weight: '100g',
    badge: 'Baby-Safe Weaning',
    primary: '#BE185D',
    secondary: '#9D174D',
    accent: '#EC4899',
    bgTint: 'rgba(190, 24, 93, 0.08)',
    overlayFrom: 'rgba(190,24,93,0.35)',
    overlayTo: 'rgba(60,0,30,0.75)',
  },
  {
    id: 'tropical-crunch',
    name: 'Tropical Crunch',
    subname: 'Solar Dehydrated Mango & Pineapple Mix',
    slug: 'dehydrated-mango',
    image: '/images/posters/tropical-crunch.jpg',
    price: 490,
    originalPrice: 580,
    weight: '100g',
    badge: '0 Additives',
    primary: '#D97706',
    secondary: '#B45309',
    accent: '#F59E0B',
    bgTint: 'rgba(217, 119, 6, 0.08)',
    overlayFrom: 'rgba(217,119,6,0.35)',
    overlayTo: 'rgba(60,20,0,0.75)',
  },
];

export default function MobileHeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const { addItem, openDrawer } = useCartStore();
  const { openQuickView } = useUIStore();

  // Auto-cycle 3-second loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % MOBILE_POSTERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentPoster = MOBILE_POSTERS[activeIdx];
  const matchedCatalogProduct = products.find((p) => p.slug === currentPoster.slug);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % MOBILE_POSTERS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + MOBILE_POSTERS.length) % MOBILE_POSTERS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) handleNext();
    if (distance < -40) handlePrev();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const itemToAdd = matchedCatalogProduct || {
      id: currentPoster.id,
      name: currentPoster.name,
      slug: currentPoster.slug,
      price: currentPoster.price,
      image: currentPoster.image,
      weight: currentPoster.weight,
    };
    addItem(itemToAdd as any, 1);
    setAddedItem(currentPoster.id);
    setTimeout(() => setAddedItem(null), 1500);
    openDrawer();
  };

  return (
    <div
      className="lg:hidden relative w-full overflow-hidden transition-colors duration-1000 px-[1%] py-2"
      style={{
        backgroundColor: currentPoster.bgTint,
      }}
    >
      {/* Background Ambient Glow Orbs */}
      <motion.div
        key={`glow-top-${currentPoster.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.0 }}
        className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: currentPoster.accent }}
      />
      <motion.div
        key={`glow-bottom-${currentPoster.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.0, delay: 0.1 }}
        className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: currentPoster.primary }}
      />

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        
        {/* 1. Crest Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EAE3D6] shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#7A5230] font-sans">
            From the Himalayas
          </span>
          <span className="w-px h-3 bg-[#7A5230]/25" />
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#1A3826] font-sans">
            <Leaf className="w-3 h-3 text-emerald-600" />
            100% Single Origin
          </span>
        </div>

        {/* 2. Editorial Master Headline */}
        <div className="space-y-1 w-full px-2">
          <h1 className="text-[28px] xs:text-[32px] sm:text-[38px] leading-[1.12] font-normal tracking-[-0.02em] font-heading text-[#1C2820]">
            <span className="block font-serif italic text-[#1C2820] font-normal">
              Grown in Nepal.
            </span>
            <span className="block font-sans font-bold tracking-[-0.015em] text-[#1A3826]">
              Handled with care.
            </span>
            <span className="relative inline-block font-serif text-[#7A5230] font-normal pb-0.5">
              <span>Delivered to your home.</span>
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-[#7A5230]/35 pointer-events-none"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 9C75 3 185 2 298 7.5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Provenance Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[10px] sm:text-[11px] font-semibold text-[#7A5230] uppercase tracking-wider font-sans">
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-[#EAE3D6] shadow-2xs">Mustang</span>
            <span className="text-[#7A5230]/40">·</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-[#EAE3D6] shadow-2xs">Jumla</span>
            <span className="text-[#7A5230]/40">·</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-[#EAE3D6] shadow-2xs">Kavre</span>
            <span className="text-[#7A5230]/40">·</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-[#EAE3D6] shadow-2xs">Terai</span>
          </div>

          <p className="text-xs sm:text-sm text-[#242220]/85 font-medium leading-relaxed max-w-md font-sans pt-1 mx-auto">
            Pure, unadulterated whole foods cultivated across Himalayan valleys. Direct farmer partnerships, gentle low-temperature dehydration, and <span className="font-bold text-[#1A3826]">0 additives or preservatives</span>.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            3. HERO 3-SECOND LOOPING PRODUCT POSTER CARD
               - Animated Card Transition
               - Touch Swipeable
               - Quick Add & Price Tag
           ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto pt-1 pb-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card Carousel Box */}
          <div className="relative w-full aspect-[4/5] xs:aspect-[1/1.18] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-stone-900 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={`mobile-poster-${currentPoster.id}`}
                initial={{ opacity: 0, scale: 0.94, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.94, x: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 cursor-pointer"
                onClick={() => openQuickView(matchedCatalogProduct?.id || currentPoster.slug)}
              >
                {/* Poster Artwork */}
                <Image
                  src={currentPoster.image}
                  alt={currentPoster.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 380px"
                  className="object-cover object-center"
                  style={{ filter: 'saturate(1.2)' }}
                />

                {/* Subtle Dynamic Overlay Gradient */}
                <div
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, ${currentPoster.overlayFrom} 100%)`,
                  }}
                />

                {/* Top Badge Strip */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-stone-900 shadow-sm border border-white/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {currentPoster.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/40 backdrop-blur-md text-white border border-white/20">
                    {activeIdx + 1} / {MOBILE_POSTERS.length}
                  </span>
                </div>

                {/* Floating Additives Badge */}
                <div className="absolute top-12 left-3.5 z-10">
                  <div className="px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white text-[9px] font-bold shadow-sm flex items-center gap-1 backdrop-blur-xs">
                    <Flame className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                    <span>0 Preservatives</span>
                  </div>
                </div>

                {/* Bottom Product Info Glass Capsule */}
                <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-left z-10 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-heading font-extrabold text-white leading-tight">
                        {currentPoster.name}
                      </h3>
                      <p className="text-[11px] text-white/80 line-clamp-1 font-medium font-sans">
                        {currentPoster.subname} · {currentPoster.weight}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-heading font-extrabold text-white">
                        {formatPrice(currentPoster.price)}
                      </div>
                      {currentPoster.originalPrice && (
                        <div className="text-[10px] text-white/60 line-through">
                          {formatPrice(currentPoster.originalPrice)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className="flex-1 py-2 px-3.5 rounded-xl font-heading font-bold text-xs text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      style={{
                        background: `linear-gradient(135deg, ${currentPoster.primary} 0%, ${currentPoster.secondary} 100%)`,
                      }}
                    >
                      {addedItem === currentPoster.id ? (
                        <>
                          <Check className="w-4 h-4 animate-bounce" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Quick Add · {formatPrice(currentPoster.price)}</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/products/${currentPoster.slug}`}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs border border-white/30 active:scale-95 transition-all flex items-center justify-center"
                      aria-label="View Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Left / Right Nav Arrows */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-stone-900 shadow-md backdrop-blur-md flex items-center justify-center z-20 active:scale-90 transition-transform"
              aria-label="Previous Poster"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-stone-900 shadow-md backdrop-blur-md flex items-center justify-center z-20 active:scale-90 transition-transform"
              aria-label="Next Poster"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Second Loop Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-3">
            {MOBILE_POSTERS.map((poster, idx) => (
              <button
                key={poster.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIdx === idx ? 'w-6 bg-[#1A3826]' : 'w-1.5 bg-[#1A3826]/25'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2.5 w-full max-w-md px-2 pt-1">
          <Link
            href="/products"
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-full text-[#FAF7F2] px-6 py-3.5 text-sm font-semibold tracking-wide bg-[#1A3826] shadow-[0_8px_20px_-4px_rgba(26,56,38,0.45)] active:scale-[0.98] transition-all font-sans overflow-hidden"
          >
            <span>Shop All Superfoods</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/our-story"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#7A5230]/40 bg-white/95 hover:bg-white text-[#7A5230] px-5 py-3.5 text-sm font-semibold tracking-wide shadow-2xs active:scale-[0.98] transition-all font-sans"
          >
            <Leaf className="w-4 h-4 text-[#7A5230]" />
            <span>Farmer Provenance</span>
          </Link>
        </div>

        {/* 5. Social Proof & Trust Capsule */}
        <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE3D6] shadow-sm space-y-2.5 w-full max-w-md mx-auto">
          {/* Avatar + Rating Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#242220]/8">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {['👩‍🍼', '🧔', '🏃‍♂️', '👵'].map((emoji, idx) => (
                  <div
                    key={idx}
                    className="w-7 h-7 rounded-full bg-[#FAF7F2] border-2 border-white flex items-center justify-center text-xs shadow-2xs"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="text-[11px] leading-tight font-sans text-left">
                <div className="flex items-center text-[#7A5230]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#7A5230] text-[#7A5230]" />
                  ))}
                  <span className="font-bold text-[#242220] ml-1.5">4.9 / 5</span>
                </div>
                <span className="text-[#242220]/70 font-medium">25,000+ Happy Nepalis</span>
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs bg-emerald-50 text-emerald-800 border-emerald-200/80 flex-shrink-0">
              ⚡ 24h Valley Delivery
            </div>
          </div>

          {/* Micro-Trust Chips Strip */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="inline-flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#EAE3D6] text-[10px] font-semibold text-[#242220]/85 whitespace-nowrap flex-shrink-0 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A3826]" />
              100% Nepali Origin
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#EAE3D6] text-[10px] font-semibold text-[#242220]/85 whitespace-nowrap flex-shrink-0 font-sans">
              <Truck className="w-3.5 h-3.5 text-[#1A3826]" />
              Free Shipping &gt; Rs. 10,000
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#EAE3D6] text-[10px] font-semibold text-[#242220]/85 whitespace-nowrap flex-shrink-0 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#7A5230]" />
              0 Additives
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
