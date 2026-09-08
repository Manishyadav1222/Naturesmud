'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShoppingBag,
  Leaf,
  CheckCircle2,
  Flame,
  ThumbsUp,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from 'sonner';

export interface HeroSlide {
  id: string;
  tag: string;
  tagIcon: 'leaf' | 'sparkles' | 'flame' | 'star';
  title: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  image: string;
  productSlug: string;
  productPrice: number;
  productComparePrice?: number;
  themeColor: {
    bgGradient: string;
    accent: string;
    glow: string;
    pillBg: string;
    pillBorder: string;
    textAccent: string;
    btnGradient: string;
  };
  features: string[];
  testimonials: {
    text: string;
    author: string;
    stars?: number;
    icon?: string;
    position: string;
  }[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'pineapple-simply-natural',
    tag: 'Tropical Wholefood',
    tagIcon: 'leaf',
    title: 'Simply Natural ·',
    titleHighlight: 'Himalayan Pineapple',
    subtitle: 'Pure Food. Real Nature.',
    description:
      'Sun-drenched golden pineapple rings slowly dehydrated at gentle low temperatures. Packed with natural bromelain digestive enzymes and zero added sugar.',
    image: '/images/hero/hero-pineapple-simply-natural.jpg',
    productSlug: 'dehydrated-pineapple',
    productPrice: 495,
    productComparePrice: 550,
    themeColor: {
      bgGradient: 'from-[#2D1B00] via-[#4A2D00] to-[#1F1200]',
      accent: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.35)',
      pillBg: 'rgba(245, 158, 11, 0.15)',
      pillBorder: 'rgba(245, 158, 11, 0.4)',
      textAccent: '#FDE68A',
      btnGradient: 'from-[#F59E0B] via-[#D97706] to-[#B45309]',
    },
    features: ['100% Sun-Dried Fruit', 'Natural Bromelain Enzyme', '0 Added Sugar & Preservatives'],
    testimonials: [
      {
        text: 'So delicious and healthy! ★★★★★',
        author: 'Verified Buyer',
        stars: 5,
        position: 'top-left',
      },
      {
        text: 'My go-to snack. Perfect! - Sara',
        author: 'Sara K.',
        stars: 5,
        position: 'top-right',
      },
      {
        text: 'Simply perfect. Nature’s Best.',
        author: 'Chef Anish',
        position: 'bottom-right',
      },
    ],
  },
  {
    id: 'beetroot-earths-ritual',
    tag: 'Daily Longevity Ritual',
    tagIcon: 'sparkles',
    title: "Earth's Ritual ·",
    titleHighlight: 'Beetroot Powder',
    subtitle: 'The Pure Essence of the Soil',
    description:
      'Deep crimson organic beetroot micronized to velvety perfection. Rich in dietary nitrates for increased nitric oxide, vital blood circulation, and stamina.',
    image: '/images/hero/hero-beetroot-earths-ritual.jpg',
    productSlug: 'beetroot-powder',
    productPrice: 550,
    productComparePrice: 650,
    themeColor: {
      bgGradient: 'from-[#2A050D] via-[#450A17] to-[#180206]',
      accent: '#E11D48',
      glow: 'rgba(225, 29, 72, 0.4)',
      pillBg: 'rgba(225, 29, 72, 0.18)',
      pillBorder: 'rgba(225, 29, 72, 0.45)',
      textAccent: '#FECDD3',
      btnGradient: 'from-[#E11D48] via-[#BE123C] to-[#9F1239]',
    },
    features: ['High Dietary Nitrates', 'Vital Oxygen & Blood Flow', 'Organic Himalayan Soil'],
    testimonials: [
      {
        text: 'Absolutely vibrant color! Perfect for smoothies.',
        author: 'Pooja S.',
        stars: 5,
        position: 'top-left',
      },
      {
        text: 'Pure, earthy, and natural. A real daily ritual.',
        author: 'Dr. Ramesh M.',
        position: 'center-right',
      },
      {
        text: 'Rich flavor and so many uses! Highly recommend. Net Wt 100g.',
        author: 'Kiran T.',
        stars: 5,
        position: 'bottom-right',
      },
    ],
  },
  {
    id: 'sweet-potato-pure-nature',
    tag: 'Anthocyanin Superfood',
    tagIcon: 'star',
    title: 'Pure Food. Real Nature. ·',
    titleHighlight: 'Sweet Potato Powder',
    subtitle: 'Vibrant Purple Energy Booster',
    description:
      'Grown in organic mountain loam, freeze-dried and ground into antioxidant-packed purple powder. Natural prebiotics and complex carbs for all-day energy.',
    image: '/images/hero/hero-sweet-potato-pure-nature.jpg',
    productSlug: 'sweet-potato-powder',
    productPrice: 650,
    productComparePrice: 750,
    themeColor: {
      bgGradient: 'from-[#1F0733] via-[#380E5A] to-[#120320]',
      accent: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.38)',
      pillBg: 'rgba(168, 85, 247, 0.18)',
      pillBorder: 'rgba(168, 85, 247, 0.45)',
      textAccent: '#E9D5FF',
      btnGradient: 'from-[#A855F7] via-[#9333EA] to-[#7E22CE]',
    },
    features: ['Rich in Purple Anthocyanins', 'Prebiotic Fiber for Gut Health', 'Natural Sustained Energy'],
    testimonials: [
      {
        text: 'Unbelievable color, great in my smoothies! 👍',
        author: 'Rina B.',
        position: 'top-left',
      },
      {
        text: 'Gives everything a unique, slightly sweet flavor. Love it. ❤️',
        author: 'Anjali D.',
        position: 'top-right',
      },
      {
        text: 'Clean ingredients, true natural energy booster. ⚡',
        author: 'Bikash K.',
        position: 'bottom-left',
      },
      {
        text: 'Best I’ve tried. Perfect texture. ⭐',
        author: 'Sunil G.',
        position: 'bottom-right',
      },
    ],
  },
  {
    id: 'pineapple-fun-in-sun',
    tag: 'Adventure Lifestyle',
    tagIcon: 'flame',
    title: 'Fun in the Sun ·',
    titleHighlight: "with Nature's Mud!",
    subtitle: 'Healthy Snack for Every Journey',
    description:
      'Lightweight, pocket-sized, and bursting with tropical vitality. The ultimate fuel for mountain trails, beach days, and office productivity.',
    image: '/images/hero/hero-pineapple-fun-in-sun.jpg',
    productSlug: 'dehydrated-pineapple',
    productPrice: 495,
    productComparePrice: 550,
    themeColor: {
      bgGradient: 'from-[#082F49] via-[#0C4A6E] to-[#041A29]',
      accent: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.35)',
      pillBg: 'rgba(56, 189, 248, 0.18)',
      pillBorder: 'rgba(56, 189, 248, 0.4)',
      textAccent: '#BAE6FD',
      btnGradient: 'from-[#0284C7] via-[#0369A1] to-[#075985]',
    },
    features: ['No Mess, Resealable Pouch', 'Supports Natural Immunity', 'Zero Artificial Flavoring'],
    testimonials: [
      {
        text: 'The best snack for hikes! Stays fresh in backpack.',
        author: 'Tenzing N.',
        stars: 5,
        position: 'top-left',
      },
      {
        text: 'Kids love it! Replaced candy completely.',
        author: 'Manita S.',
        stars: 5,
        position: 'top-right',
      },
      {
        text: '100% pure fruit sweetness without guilt.',
        author: 'Samir P.',
        position: 'bottom-right',
      },
    ],
  },
];

export default function DynamicHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = HERO_SLIDES[activeIndex];

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-advance timer (6 seconds per card, pause on hover)
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isPaused]);

  const handleQuickAdd = () => {
    addItem({
      id: currentSlide.productSlug,
      slug: currentSlide.productSlug,
      name: currentSlide.titleHighlight,
      price: currentSlide.productPrice,
      compareAtPrice: currentSlide.productComparePrice,
      image: currentSlide.image,
      category: 'Himalayan Superfoods',
      weight: '100 GM',
    });
    toast.success('Added to Cart', {
      description: `${currentSlide.titleHighlight} is ready in your cart.`,
    });
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#07130B] text-white pt-6 pb-12 sm:pb-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Himalayan Superfoods Carousel"
    >
      {/* 🌟 Dynamic Atmospheric Glow Backgrounds */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentSlide.themeColor.bgGradient} opacity-90 transition-opacity duration-1000`}
        />
        <div
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 transition-all duration-1000"
          style={{ backgroundColor: currentSlide.themeColor.accent }}
        />
        <div
          className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-30 transition-all duration-1000"
          style={{ backgroundColor: currentSlide.themeColor.accent }}
        />
        {/* Subtle Organic Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:32px_32px] opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Top Navigation Bar inside Hero ── */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-300 uppercase">
              Himalayan Harvest · 2026 Collection
            </span>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-white/70 px-1">
              0{activeIndex + 1} / 0{HERO_SLIDES.length}
            </span>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Main 2-Column Showcase Area with Ultra-Smooth 2-Sec Transitions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[560px] lg:min-h-[600px]">
          {/* ── LEFT COLUMN: Animated Typography & Value Stack ── */}
          <div className="lg:col-span-6 flex flex-col justify-center relative z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                {/* Category Pill Tag */}
                <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full border backdrop-blur-md mb-4 shadow-sm"
                  style={{
                    backgroundColor: currentSlide.themeColor.pillBg,
                    borderColor: currentSlide.themeColor.pillBorder,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
                  <span className="text-xs font-heading font-extrabold tracking-wider uppercase" style={{ color: currentSlide.themeColor.textAccent }}>
                    {currentSlide.tag}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white tracking-tight leading-[1.1] mb-3">
                  {currentSlide.title}{' '}
                  <span
                    className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400"
                    style={{
                      textShadow: `0 0 30px ${currentSlide.themeColor.glow}`,
                    }}
                  >
                    {currentSlide.titleHighlight}
                  </span>
                </h1>

                {/* Subtitle / Punchline */}
                <p className="text-base sm:text-lg font-heading font-bold text-white/90 mb-3 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentSlide.subtitle}</span>
                </p>

                {/* Description Body */}
                <p className="text-sm sm:text-base text-white/75 leading-relaxed font-sans max-w-xl mb-6">
                  {currentSlide.description}
                </p>

                {/* Value Props Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                  {currentSlide.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-medium text-white/90">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Price & CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono text-white/60 uppercase tracking-wider">Direct Farm Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-black text-2xl sm:text-3xl text-white">
                        {formatPrice(currentSlide.productPrice)}
                      </span>
                      {currentSlide.productComparePrice && (
                        <span className="text-sm text-white/40 line-through">
                          {formatPrice(currentSlide.productComparePrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleQuickAdd}
                      className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-heading font-extrabold text-sm text-[#07190F] bg-gradient-to-r ${currentSlide.themeColor.btnGradient} hover:brightness-110 shadow-[0_8px_24px_rgba(0,0,0,0.4)] active:scale-95 transition-all duration-200 cursor-pointer`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    <Link
                      href={`/products/${currentSlide.productSlug}`}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-heading font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all active:scale-95"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT COLUMN: High-Definition Artwork with 2-Sec Card Smooth Cross-Fade ── */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Card Frame with Smooth 2-Second Transition without Blinking */}
            <div className="relative w-full max-w-[500px] aspect-square rounded-[36px] overflow-hidden p-2 sm:p-3 bg-gradient-to-b from-white/20 via-white/10 to-white/5 border border-white/30 shadow-[0_24px_48px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black/40">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={currentSlide.image}
                      alt={currentSlide.titleHighlight}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center transform transition-transform duration-700 hover:scale-105"
                    />

                    {/* Subtle Gradient Shadow Vignette at Edges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* 💬 Floating Live Testimonial Badges matching uploaded images */}
                    {currentSlide.testimonials.map((t, tIdx) => {
                      let posClass = 'top-4 left-4';
                      if (t.position === 'top-right') posClass = 'top-4 right-4';
                      if (t.position === 'bottom-left') posClass = 'bottom-4 left-4';
                      if (t.position === 'bottom-right') posClass = 'bottom-4 right-4';
                      if (t.position === 'center-right') posClass = 'top-1/2 -translate-y-1/2 right-4';

                      return (
                        <motion.div
                          key={tIdx}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.4 + tIdx * 0.15, duration: 0.6 }}
                          className={`absolute ${posClass} max-w-[220px] sm:max-w-[240px] p-2.5 sm:p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/25 shadow-xl z-20 pointer-events-none`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            {t.stars ? (
                              <div className="flex text-amber-400">
                                {[...Array(t.stars)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                                Verified Customer
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs text-white/95 font-semibold leading-snug">
                            {t.text}
                          </p>
                          <p className="text-[10px] text-white/60 font-mono mt-0.5">{t.author}</p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: 4 Mini Interactive Card Switchers with Auto Progress Bar ── */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs font-mono font-semibold text-white/60 uppercase tracking-widest mb-3">
            Select Harvest Showcase (Auto-Playing Every 6s):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {HERO_SLIDES.map((slide, idx) => {
              const isCurrent = idx === activeIndex;

              return (
                <button
                  key={slide.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative p-3 rounded-2xl text-left border transition-all duration-300 flex items-center gap-3 overflow-hidden group cursor-pointer ${
                    isCurrent
                      ? 'bg-white/20 border-white/40 shadow-lg scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                    <Image
                      src={slide.image}
                      alt={slide.titleHighlight}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  {/* Thumbnail Info */}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider block truncate" style={{ color: slide.themeColor.textAccent }}>
                      0{idx + 1} · {slide.tag}
                    </span>
                    <h3 className="font-heading font-extrabold text-xs text-white truncate group-hover:text-amber-300 transition-colors">
                      {slide.titleHighlight}
                    </h3>
                    <p className="text-[10px] text-white/60 font-mono mt-0.5">
                      {formatPrice(slide.productPrice)}
                    </p>
                  </div>

                  {/* Active Progress Bar indicator */}
                  {isCurrent && (
                    <motion.div
                      layoutId="activeSlideIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
