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
  Award,
  HeartHandshake,
  SunMedium,
  Mountain,
  Zap,
  Users,
  Sprout,
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
    id: 'pineapple-splendor',
    name: 'Pineapple Splendor',
    subname: 'Naturally Sweet Sun-Dried Himalayan Pineapple',
    slug: 'dehydrated-pineapple',
    image: '/images/posters/pineapple-splendor.jpg',
    price: 480,
    originalPrice: 560,
    weight: '100g',
    badge: '100% Natural',
    primary: '#D97706',
    secondary: '#B45309',
    accent: '#F59E0B',
    bgTint: 'rgba(217, 119, 6, 0.08)',
    overlayFrom: 'rgba(217,119,6,0.30)',
    overlayTo: 'rgba(45,20,0,0.80)',
  },
  {
    id: 'blueberry-orchard',
    name: 'Blueberry Orchard',
    subname: 'Antioxidant-Rich Wild Himalayan Blueberries',
    slug: 'dried-blueberries',
    image: '/images/posters/blueberries-orchard.jpg',
    price: 650,
    originalPrice: 750,
    weight: '100g',
    badge: 'Antioxidant Rich',
    primary: '#6366F1',
    secondary: '#4338CA',
    accent: '#818CF8',
    bgTint: 'rgba(99, 102, 241, 0.08)',
    overlayFrom: 'rgba(67,56,202,0.30)',
    overlayTo: 'rgba(15,10,50,0.80)',
  },

  {
    id: 'papaya-splash',
    name: 'Papaya Splash',
    subname: 'Hand-Cut Pure Naturally Delicious Papaya',
    slug: 'dehydrated-papaya',
    image: '/images/posters/papaya-splash-delight.jpg',
    price: 380,
    originalPrice: 450,
    weight: '100g',
    badge: 'Sun-Ripened',
    primary: '#EA580C',
    secondary: '#C2410C',
    accent: '#FB923C',
    bgTint: 'rgba(234, 88, 12, 0.08)',
    overlayFrom: 'rgba(234,88,12,0.30)',
    overlayTo: 'rgba(60,15,0,0.80)',
  },
  {
    id: 'chia-power',
    name: 'Chia Power',
    subname: 'Himalayan High-Altitude Organic Chia Seeds',
    slug: 'chia-seeds',
    image: '/images/posters/chia-power.jpg',
    price: 495,
    originalPrice: 495,
    weight: '250g',
    badge: 'Omega-3 Rich',
    primary: '#0D9488',
    secondary: '#0F766E',
    accent: '#14B8A6',
    bgTint: 'rgba(13, 148, 136, 0.08)',
    overlayFrom: 'rgba(13,148,136,0.30)',
    overlayTo: 'rgba(2,44,34,0.80)',
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
    overlayFrom: 'rgba(190,24,93,0.30)',
    overlayTo: 'rgba(60,0,30,0.80)',
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
    overlayFrom: 'rgba(217,119,6,0.30)',
    overlayTo: 'rgba(60,20,0,0.80)',
  },
];

export const ANIMATED_STATEMENTS = [
  {
    badge: 'PURE COLD DEHYDRATION',
    title: '40°C Low-Temperature Dried',
    highlight: 'Locks 98% Natural Vitamins',
    sub: 'Solar dehydrated whole fruits with crisp natural texture, zero additives, and maximum antioxidant retention.',
    color: 'from-amber-600 via-orange-600 to-amber-700',
    icon: SunMedium,
  },
  {
    badge: 'SINGLE ORIGIN BOTANICALS',
    title: 'High-Altitude Himalayan Sourcing',
    highlight: 'Direct Partner Farms',
    sub: 'Directly sourced from Mustang, Jumla, Kavre, and Terai smallholder co-operatives with fair farmer wages.',
    color: 'from-emerald-700 via-teal-700 to-green-800',
    icon: Mountain,
  },
  {
    badge: 'ZERO REFINED SUGAR',
    title: '100% Whole Food Ingredients',
    highlight: 'Naturally Delicious Sweetness',
    sub: 'Sweetened only by whole dates and sun-ripened fruit — 0 cane sugar, 0 preservatives, 0 artificial flavors.',
    color: 'from-rose-600 via-pink-600 to-purple-700',
    icon: Zap,
  },
  {
    badge: 'DOCTOR & PEDIATRIC APPROVED',
    title: 'Gentle Whole Foods for Family',
    highlight: 'From 6m Babies to Athletes',
    sub: 'Clean nutrition tailored for baby first solids, maternal nourishment, student focus, and workout recovery.',
    color: 'from-purple-700 via-indigo-700 to-blue-800',
    icon: Award,
  },
];

export const MARQUEE_ITEMS = [
  { text: '100% Himalayan Origin', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: '🏔️' },
  { text: '0 Preservatives', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: '✨' },
  { text: 'Gentle Low-Temp Dehydration', bg: 'bg-orange-50 text-orange-800 border-orange-200', icon: '☀️' },
  { text: 'Direct Farmer Sourcing', bg: 'bg-teal-50 text-teal-800 border-teal-200', icon: '🤝' },
  { text: 'No Added Sugar', bg: 'bg-pink-50 text-pink-800 border-pink-200', icon: '🍯' },
  { text: '24h Valley Delivery', bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: '⚡' },
  { text: 'Baby-Safe Weaning', bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: '👶' },
];

export default function MobileHeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [statementIdx, setStatementIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const openQuickView = useUIStore((s) => s.openQuickView);

  const currentPoster = MOBILE_POSTERS[activeIdx];
  const currentStatement = ANIMATED_STATEMENTS[statementIdx];

  const matchedCatalogProduct = products.find(
    (p) => p.slug === currentPoster.slug || p.id === currentPoster.id
  );

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % MOBILE_POSTERS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatementIdx((prev) => (prev + 1) % ANIMATED_STATEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
      className="relative w-full overflow-hidden transition-colors duration-1000 px-3 sm:px-4 md:px-8 lg:px-12 pt-1 sm:pt-2 md:pt-3 lg:pt-3 pb-4 md:pb-8 lg:pb-12"
      style={{
        backgroundColor: currentPoster.bgTint,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="absolute -top-12 -right-12 w-64 md:w-96 lg:w-[500px] h-64 md:h-96 lg:h-[500px] rounded-full blur-3xl pointer-events-none transition-colors duration-1000 opacity-30"
        style={{ backgroundColor: currentPoster.accent }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-60 md:w-96 lg:w-[460px] h-60 md:h-96 lg:h-[460px] rounded-full blur-3xl pointer-events-none transition-colors duration-1000 opacity-25"
        style={{ backgroundColor: currentPoster.primary }}
      />

      <div className="hidden md:grid md:grid-cols-12 md:gap-8 lg:gap-12 xl:gap-16 md:items-center max-w-7xl mx-auto relative z-10">
        <div className="md:col-span-7 lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left space-y-4 lg:space-y-5">
          {/* 1. Crest Eyebrow Badge - Positioned with minimal 1% margin from header */}
          <div className="mt-1 lg:mt-1.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EAE3D6] shadow-2xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A5230] font-sans">
              From the Himalayas
            </span>
            <span className="w-px h-3 bg-[#7A5230]/25" />
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A3826] font-sans">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              100% Single Origin
            </span>
          </div>

          {/* 2. Editorial Master Headline - Perfectly fitted Kinfolk luxury typography */}
          <div className="w-full">
            <h1 className="text-[34px] md:text-[38px] lg:text-[44px] xl:text-[50px] 2xl:text-[54px] leading-[1.05] lg:leading-[1.04] xl:leading-[1.02] font-normal tracking-[-0.03em] font-heading text-[#1C2820]">
              <span className="block font-serif italic text-[#1C2820] font-normal">
                Grown in Nepal.
              </span>
              <span className="block font-sans font-extrabold tracking-[-0.025em] text-[#1A3826]">
                Handled with care.
              </span>
              <span className="relative inline-block font-serif text-[#7A5230] font-normal">
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

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] lg:text-xs font-semibold text-[#7A5230] uppercase tracking-wider font-sans">
              <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-[#EAE3D6] shadow-2xs">Mustang</span>
              <span className="text-[#7A5230]/40">·</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-[#EAE3D6] shadow-2xs">Jumla</span>
              <span className="text-[#7A5230]/40">·</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-[#EAE3D6] shadow-2xs">Kavre</span>
              <span className="text-[#7A5230]/40">·</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-[#EAE3D6] shadow-2xs">Terai</span>
            </div>
          </div>

          <div className="w-full relative overflow-hidden p-4 lg:p-5 rounded-2xl lg:rounded-3xl bg-white/95 backdrop-blur-md border border-[#EAE3D6] shadow-sm text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EAE3D6] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#7A5230] shadow-2xs">
                {React.createElement(currentStatement.icon, { className: 'w-3.5 h-3.5 text-emerald-600' })}
                <span className="font-sans">{currentStatement.badge}</span>
              </div>
              <div className="flex items-center gap-1">
                {ANIMATED_STATEMENTS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStatementIdx(idx)}
                    className={`h-1.5 rounded-full transition-all duration-400 cursor-pointer ${
                      statementIdx === idx ? 'w-5 bg-emerald-600' : 'w-1.5 bg-stone-300'
                    }`}
                    aria-label={`Statement ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative min-h-[72px] lg:min-h-[78px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`statement-tab-${statementIdx}`}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-1 w-full"
                >
                  <p className="text-sm lg:text-base font-bold leading-snug font-sans text-stone-900">
                    <span className="bg-gradient-to-r from-[#1A3826] via-emerald-700 to-teal-800 bg-clip-text text-transparent font-extrabold text-base lg:text-lg">
                      {currentStatement.title}
                    </span>{' '}
                    <span className={`bg-gradient-to-r ${currentStatement.color} bg-clip-text text-transparent font-extrabold`}>
                      {currentStatement.highlight}
                    </span>
                  </p>
                  <p className="text-xs lg:text-sm text-stone-600 font-medium leading-normal font-sans">
                    {currentStatement.sub}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full pt-1">
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full text-[#FAF7F2] px-6 lg:px-8 py-3 lg:py-3.5 text-sm lg:text-base font-semibold tracking-wide bg-[#1A3826] hover:bg-[#234832] shadow-[0_8px_20px_-4px_rgba(26,56,38,0.45)] hover:shadow-[0_12px_24px_-4px_rgba(26,56,38,0.55)] hover:-translate-y-0.5 active:scale-[0.98] transition-all font-sans overflow-hidden cursor-pointer"
            >
              <span>Shop All Superfoods</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>

            <Link
              href="/our-story"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#7A5230]/40 bg-white/95 hover:bg-white text-[#7A5230] px-5 lg:px-7 py-3 lg:py-3.5 text-sm lg:text-base font-semibold tracking-wide shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:scale-[0.98] transition-all font-sans cursor-pointer"
            >
              <Leaf className="w-4 h-4 text-[#7A5230] transition-transform duration-300 group-hover:rotate-45" />
              <span>Farmer Provenance</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 lg:gap-3.5 pt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-[#EAE3D6] shadow-2xs">
              <div className="flex items-center text-[#7A5230]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#7A5230] text-[#7A5230]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#242220]">4.9 / 5</span>
              <span className="text-[11px] text-[#242220]/70 font-medium">· 25,000+ Happy Nepalis</span>
            </div>

            <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              100% Nepali Origin
            </span>

            <span className="inline-flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#EAE3D6] text-xs font-semibold text-[#242220] shadow-2xs">
              <Truck className="w-3.5 h-3.5 text-[#1A3826]" />
              24h Valley Delivery
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3 pt-1 w-full max-w-xl">
            {[
              { value: '25,000+', label: 'Happy Customers', highlight: true, icon: Users },
              { value: '100%', label: '0 Additives', highlight: false, icon: Sparkles },
              { value: '180+', label: 'Farm Partners', highlight: false, icon: Sprout },
              { value: '4.9★', label: 'Customer Rating', highlight: true, icon: Award },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-2.5 lg:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE3D6] text-center shadow-2xs hover:shadow-xs transition-all flex flex-col justify-center"
              >
                <div className={`text-sm lg:text-base font-heading font-extrabold ${stat.highlight ? 'text-[#1A3826]' : 'text-[#242220]'}`}>
                  {stat.value}
                </div>
                <div className="text-[10px] lg:text-[11px] text-[#242220]/65 font-medium mt-0.5 truncate font-sans">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center">
          <div
            className="relative w-full max-w-[390px] lg:max-w-[430px] xl:max-w-[450px] mx-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Card Showcase Frame */}
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/90 bg-stone-900 group">
              {MOBILE_POSTERS.map((poster, idx) => {
                const isCurrent = activeIdx === idx;
                return (
                  <div
                    key={poster.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                      isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                    onClick={() => openQuickView(matchedCatalogProduct?.id || poster.slug)}
                  >
                    <Image
                      src={poster.image}
                      alt={poster.name}
                      fill
                      priority={idx < 2}
                      sizes="(max-width: 1024px) 50vw, 420px"
                      className="object-cover object-center transition-transform duration-700 ease-out"
                      style={{ filter: 'saturate(1.18)' }}
                    />

                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 45%, ${poster.overlayFrom} 100%)`,
                      }}
                    />

                    {/* Top Badge Strip */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-md text-stone-900 shadow-sm border border-white/40 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {poster.badge}
                      </span>
                      <div className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[9px] font-bold shadow-sm flex items-center gap-1 backdrop-blur-xs border border-white/20">
                        <Flame className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                        <span>0 Additives</span>
                      </div>
                    </div>

                    {/* Bottom Info Glass Capsule */}
                    <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 text-left z-10 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-heading font-extrabold text-white leading-tight">
                            {poster.name}
                          </h3>
                          <p className="text-[11px] text-white/80 line-clamp-1 font-medium font-sans">
                            {poster.subname} · {poster.weight}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-heading font-extrabold text-white">
                            {formatPrice(poster.price)}
                          </div>
                          {poster.originalPrice && (
                            <div className="text-[10px] text-white/60 line-through">
                              {formatPrice(poster.originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={handleQuickAdd}
                          className="flex-1 py-2 px-3.5 rounded-xl font-heading font-bold text-xs text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          style={{
                            background: `linear-gradient(135deg, ${poster.primary} 0%, ${poster.secondary} 100%)`,
                          }}
                        >
                          {addedItem === poster.id ? (
                            <>
                              <Check className="w-4 h-4 animate-bounce" />
                              <span>Added to Cart!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Quick Add · {formatPrice(poster.price)}</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/products/${poster.slug}`}
                          className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs border border-white/30 active:scale-95 transition-all flex items-center justify-center"
                          aria-label="View Details"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Prev / Next Arrows */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/75 hover:bg-white text-stone-900 shadow-md backdrop-blur-md flex items-center justify-center z-20 active:scale-90 transition-transform cursor-pointer"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/75 hover:bg-white text-stone-900 shadow-md backdrop-blur-md flex items-center justify-center z-20 active:scale-90 transition-transform cursor-pointer"
                aria-label="Next Poster"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Smooth Indicator Pills */}
            <div className="flex items-center justify-center gap-1.5 pt-3">
              {MOBILE_POSTERS.map((poster, idx) => (
                <button
                  key={poster.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    activeIdx === idx ? 'w-7 bg-[#1A3826]' : 'w-2 bg-[#1A3826]/25'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          B. MOBILE PHONE LAYOUT (< 768px / md:hidden)
             - Vertical Stack Layout
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative z-10 flex flex-col items-center text-center space-y-4">
        {/* 1. Crest Eyebrow Badge */}
        <div className="mt-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EAE3D6] shadow-2xs">
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
        <div className="space-y-1.5 w-full px-2">
          <h1 className="text-[28px] xs:text-[32px] sm:text-[38px] leading-[1.22] font-normal tracking-[-0.02em] font-heading text-[#1C2820] space-y-1.5">
            <span className="block font-serif italic text-[#1C2820] font-normal pb-0.5">
              Grown in Nepal.
            </span>
            <span className="block font-sans font-bold tracking-[-0.015em] text-[#1A3826] pb-0.5">
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
        </div>

        {/* 3. Mobile Product Poster Showcase */}
        <div
          className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto pt-1 pb-1"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full aspect-[4/5] xs:aspect-[1/1.18] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-stone-900 group">
            {MOBILE_POSTERS.map((poster, idx) => {
              const isCurrent = activeIdx === idx;
              return (
                <div
                  key={poster.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                    isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  onClick={() => openQuickView(matchedCatalogProduct?.id || poster.slug)}
                >
                  <Image
                    src={poster.image}
                    alt={poster.name}
                    fill
                    priority={idx < 2}
                    sizes="(max-width: 768px) 90vw, 380px"
                    className="object-cover object-center transition-transform duration-700 ease-out"
                    style={{ filter: 'saturate(1.18)' }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 45%, ${poster.overlayFrom} 100%)`,
                    }}
                  />

                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-md text-stone-900 shadow-sm border border-white/40 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {poster.badge}
                    </span>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[9px] font-bold shadow-sm flex items-center gap-1 backdrop-blur-xs border border-white/20">
                      <Flame className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                      <span>0 Additives</span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 text-left z-10 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-heading font-extrabold text-white leading-tight">
                          {poster.name}
                        </h3>
                        <p className="text-[11px] text-white/80 line-clamp-1 font-medium font-sans">
                          {poster.subname} · {poster.weight}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-heading font-extrabold text-white">
                          {formatPrice(poster.price)}
                        </div>
                        {poster.originalPrice && (
                          <div className="text-[10px] text-white/60 line-through">
                            {formatPrice(poster.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={handleQuickAdd}
                        className="flex-1 py-2 px-3.5 rounded-xl font-heading font-bold text-xs text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                        style={{
                          background: `linear-gradient(135deg, ${poster.primary} 0%, ${poster.secondary} 100%)`,
                        }}
                      >
                        {addedItem === poster.id ? (
                          <>
                            <Check className="w-4 h-4 animate-bounce" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Quick Add · {formatPrice(poster.price)}</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/products/${poster.slug}`}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs border border-white/30 active:scale-95 transition-all flex items-center justify-center"
                        aria-label="View Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

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

          <div className="flex items-center justify-center gap-1.5 pt-2.5">
            {MOBILE_POSTERS.map((poster, idx) => (
              <button
                key={poster.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  activeIdx === idx ? 'w-6 bg-[#1A3826]' : 'w-1.5 bg-[#1A3826]/25'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 4. Mobile Kinetic Typography Hero Card */}
        <div className="w-full max-w-md mx-auto px-1 space-y-3">
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE3D6] shadow-sm text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE3D6] text-[10px] font-bold uppercase tracking-wider text-[#7A5230] mb-2 shadow-2xs">
              {React.createElement(currentStatement.icon, { className: 'w-3.5 h-3.5 text-emerald-600' })}
              <span className="font-sans">{currentStatement.badge}</span>
            </div>

            <div className="relative min-h-[108px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`statement-${statementIdx}`}
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-1.5 w-full"
                >
                  <p className="text-xs sm:text-sm font-bold leading-relaxed font-sans text-stone-900">
                    <span className="bg-gradient-to-r from-[#1A3826] via-emerald-700 to-teal-800 bg-clip-text text-transparent font-extrabold text-sm sm:text-base">
                      {currentStatement.title}
                    </span>{' '}
                    <span className={`bg-gradient-to-r ${currentStatement.color} bg-clip-text text-transparent font-extrabold`}>
                      {currentStatement.highlight}
                    </span>
                  </p>
                  
                  <p className="text-[11px] sm:text-xs text-stone-600 font-medium leading-normal font-sans pt-0.5">
                    {currentStatement.sub}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-1 pt-2">
              {ANIMATED_STATEMENTS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setStatementIdx(idx)}
                  className={`h-1 rounded-full transition-all duration-400 ${
                    statementIdx === idx ? 'w-5 bg-emerald-600' : 'w-1.5 bg-stone-300'
                  }`}
                  aria-label={`Statement ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden py-1.5 bg-white/70 backdrop-blur-xs rounded-xl border border-[#EAE3D6]/70 shadow-2xs">
            <div className="flex w-max animate-marquee space-x-2">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <div
                  key={i}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-2xs whitespace-nowrap ${item.bg}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Mobile Action Buttons */}
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

        {/* 6. Mobile Social Proof & Trust Capsule */}
        <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE3D6] shadow-sm space-y-2.5 w-full max-w-md mx-auto">
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
