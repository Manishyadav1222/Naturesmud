'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Star,
  ArrowRight,
  Eye,
  ShoppingBag,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import { products } from '@/lib/data/products';
import { resolveImageUrl, formatPrice, calculateDiscount } from '@/lib/utils';
import { useUIStore } from '@/lib/store/ui-store';
import { useCartStore } from '@/lib/store/cart-store';

// 10 Flagship Products for the Hero Right-Side Infinite Looping Animation Showcase
export const HERO_SHOWCASE_PRODUCTS = [
  {
    slug: 'dehydrated-mango',
    name: 'Dehydrated Mango',
    subheading: 'Tarai Sun-Ripened Slices',
    weight: '100 GM',
    packing: 'Standup Ziplock Pouch',
    price: 395,
    compareAtPrice: 450,
    rating: 4.9,
    reviews: 68,
    category: 'Dried Fruits',
    image: '/products/authentic-dehydrated-mango.jpg',
    description: 'Golden, intensely sweet dried mango slices with 0 added sugar and 0 preservatives.',
    badge: 'Bestseller · 100% Pure',
    theme: {
      primary: '#D97706',
      secondary: '#B45309',
      accent: '#F59E0B',
      portalBg: 'radial-gradient(circle at 45% 45%, #FBBF24 0%, #D97706 50%, #92400E 100%)',
      glow: 'rgba(217, 119, 6, 0.40)',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      ringColor: '#D97706',
      leafColor: '#84CC16',
    },
  },
  {
    slug: 'dehydrated-pineapple',
    name: 'Dehydrated Pineapple',
    subheading: 'Bromelain-Rich Mountain Rings',
    weight: '100 GM',
    packing: 'Standup Ziplock Pouch',
    price: 495,
    compareAtPrice: 550,
    rating: 4.9,
    reviews: 45,
    category: 'Dried Fruits',
    image: '/products/authentic-dehydrated-pineapple.jpg',
    description: 'Tangy-sweet pineapple slices with active bromelain enzyme for smooth digestion.',
    badge: 'Enzyme Powerhouse',
    theme: {
      primary: '#CA8A04',
      secondary: '#A16207',
      accent: '#EAB308',
      portalBg: 'radial-gradient(circle at 45% 45%, #FDE047 0%, #CA8A04 55%, #78350F 100%)',
      glow: 'rgba(202, 138, 4, 0.40)',
      badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      ringColor: '#CA8A04',
      leafColor: '#65A30D',
    },
  },
  {
    slug: 'dehydrated-apple',
    name: 'Dehydrated Apple',
    subheading: 'Mustang Alpine Crisp Rings',
    weight: '100 GM',
    packing: 'Standup Ziplock Pouch',
    price: 510,
    compareAtPrice: 580,
    rating: 4.8,
    reviews: 42,
    category: 'Dried Fruits',
    image: '/products/authentic-dehydrated-apple.jpg',
    description: 'Crisp dehydrated apple rings rich in soluble pectin fiber from Jumla orchards.',
    badge: 'Himalayan Harvest',
    theme: {
      primary: '#E11D48',
      secondary: '#BE123C',
      accent: '#FB7185',
      portalBg: 'radial-gradient(circle at 45% 45%, #FDA4AF 0%, #E11D48 55%, #881337 100%)',
      glow: 'rgba(225, 29, 72, 0.40)',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      ringColor: '#E11D48',
      leafColor: '#10B981',
    },
  },
  {
    slug: 'dried-blueberries',
    name: 'Dried Blueberries',
    subheading: 'Wild Alpine Anthocyanin Berries',
    weight: '100 GM',
    packing: 'Glass Jar',
    price: 650,
    compareAtPrice: 720,
    rating: 5.0,
    reviews: 78,
    category: 'Dried Fruits',
    image: '/products/dried-blueberries-100g.jpg',
    description: '3,200m alpine foraged wild berries packed with anthocyanins for brain focus.',
    badge: '3,200m Wild Alpine',
    theme: {
      primary: '#4F46E5',
      secondary: '#3730A3',
      accent: '#6366F1',
      portalBg: 'radial-gradient(circle at 45% 45%, #818CF8 0%, #4338CA 55%, #1E1B4B 100%)',
      glow: 'rgba(79, 70, 229, 0.40)',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      ringColor: '#4F46E5',
      leafColor: '#34D399',
    },
  },
  {
    slug: 'dates-powder',
    name: 'Dates Powder',
    subheading: '100% Unrefined Natural Sweetener',
    weight: '100 GM',
    packing: 'Glass Jar',
    price: 350,
    compareAtPrice: 400,
    rating: 4.9,
    reviews: 84,
    category: 'Powders',
    image: '/products/dates-powder-100g.jpg',
    description: '100% pure date powder. Pediatrician-trusted sugar replacement for children & milk.',
    badge: '0% White Sugar · Baby Safe',
    theme: {
      primary: '#92400E',
      secondary: '#78350F',
      accent: '#B45309',
      portalBg: 'radial-gradient(circle at 45% 45%, #D97706 0%, #92400E 55%, #451A03 100%)',
      glow: 'rgba(146, 64, 14, 0.40)',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
      ringColor: '#92400E',
      leafColor: '#A3E635',
    },
  },
  {
    slug: 'beetroot-powder',
    name: 'Beetroot Powder',
    subheading: 'Nitric Oxide Blood Vitality',
    weight: '100 GM',
    packing: 'Glass Jar',
    price: 430,
    compareAtPrice: 490,
    rating: 4.9,
    reviews: 62,
    category: 'Powders',
    image: '/products/beetroot-powder-100g.jpg',
    description: 'Dietary nitrates booster for nitric oxide vascular pump, stamina and glowing skin.',
    badge: 'Natural Nitric Oxide',
    theme: {
      primary: '#BE185D',
      secondary: '#9D174D',
      accent: '#DB2777',
      portalBg: 'radial-gradient(circle at 45% 45%, #F472B6 0%, #BE185D 55%, #500724 100%)',
      glow: 'rgba(190, 24, 93, 0.40)',
      badgeBg: 'bg-pink-100 text-pink-950 border-pink-300',
      ringColor: '#BE185D',
      leafColor: '#10B981',
    },
  },
  {
    slug: 'carrot-powder',
    name: 'Carrot Powder',
    subheading: 'Pure Beta-Carotene Eye Health',
    weight: '100 GM',
    packing: 'Glass Jar',
    price: 440,
    compareAtPrice: 500,
    rating: 4.8,
    reviews: 39,
    category: 'Powders',
    image: '/products/carrot-powder.jpg',
    description: 'Cold-dehydrated Nepali carrots loaded with provitamin A for ocular health.',
    badge: 'Provitamin A Rich',
    theme: {
      primary: '#EA580C',
      secondary: '#C2410C',
      accent: '#FB923C',
      portalBg: 'radial-gradient(circle at 45% 45%, #FDBA74 0%, #EA580C 55%, #7C2D12 100%)',
      glow: 'rgba(234, 88, 12, 0.40)',
      badgeBg: 'bg-orange-100 text-orange-950 border-orange-300',
      ringColor: '#EA580C',
      leafColor: '#84CC16',
    },
  },
  {
    slug: 'sweet-potato-powder',
    name: 'Sweet Potato Powder',
    subheading: 'Sakharkhanda Complex Energy',
    weight: '100 GM',
    packing: 'Glass Jar',
    price: 420,
    compareAtPrice: 480,
    rating: 4.9,
    reviews: 58,
    category: 'Powders',
    image: '/products/sweet-potato-powder-100g.jpg',
    description: 'Single-ingredient dehydrated sweet potato for infant porridge and clean workout fuel.',
    badge: 'Baby Porridge Essential',
    theme: {
      primary: '#D97706',
      secondary: '#B45309',
      accent: '#F59E0B',
      portalBg: 'radial-gradient(circle at 45% 45%, #FDE68A 0%, #D97706 55%, #78350F 100%)',
      glow: 'rgba(217, 119, 6, 0.40)',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
      ringColor: '#D97706',
      leafColor: '#22C55E',
    },
  },
  {
    slug: 'chia-seeds',
    name: 'Organic Chia Seeds',
    subheading: 'Plant Omega-3 & Soluble Fiber',
    weight: '300 GM',
    packing: 'Plastic Jar',
    price: 495,
    compareAtPrice: 560,
    rating: 4.9,
    reviews: 65,
    category: 'Seeds',
    image: '/products/chia-seeds.jpg',
    description: 'Whole raw chia seeds rich in plant Omega-3 ALA and mucilage fiber for hydration.',
    badge: 'Omega-3 Powerhouse',
    theme: {
      primary: '#166534',
      secondary: '#14532D',
      accent: '#22C55E',
      portalBg: 'radial-gradient(circle at 45% 45%, #86EFAC 0%, #166534 55%, #052E16 100%)',
      glow: 'rgba(22, 101, 52, 0.40)',
      badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      ringColor: '#166534',
      leafColor: '#15803D',
    },
  },
  {
    slug: 'pumpkin-seeds',
    name: 'Raw Pumpkin Seeds',
    subheading: 'AAA-Grade Zinc & Magnesium',
    weight: '300 GM',
    packing: 'Plastic Jar',
    price: 650,
    compareAtPrice: 720,
    rating: 4.9,
    reviews: 57,
    category: 'Seeds',
    image: '/products/pumpkin-seeds.jpg',
    description: 'Raw green pepitas packed with natural zinc, magnesium, and L-tryptophan for sleep.',
    badge: 'Zinc & Deep Sleep',
    theme: {
      primary: '#15803D',
      secondary: '#166534',
      accent: '#84CC16',
      portalBg: 'radial-gradient(circle at 45% 45%, #BEF264 0%, #15803D 55%, #14532D 100%)',
      glow: 'rgba(21, 128, 61, 0.40)',
      badgeBg: 'bg-lime-100 text-lime-950 border-lime-300',
      ringColor: '#15803D',
      leafColor: '#16A34A',
    },
  },
];

export default function HeroProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  const { openQuickView } = useUIStore();
  const { addItem, openDrawer } = useCartStore();

  const current = HERO_SHOWCASE_PRODUCTS[currentIndex];
  const catalogProduct = products.find((p) => p.slug === current.slug);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to pause temporarily and auto-resume loop after 4 seconds
  const pauseTemporarily = useCallback(() => {
    setIsPlaying(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, 4000);
  }, []);

  // Unlimited infinite loop: auto-rotate every 5 seconds
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_SHOWCASE_PRODUCTS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_SHOWCASE_PRODUCTS.length) % HERO_SHOWCASE_PRODUCTS.length);
  }, []);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    pauseTemporarily();
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  // Touch gesture handling for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    pauseTemporarily();
  };

  // Keep active thumbnail in view
  useEffect(() => {
    if (thumbnailScrollRef.current) {
      const container = thumbnailScrollRef.current;
      const activeEl = container.children[currentIndex] as HTMLElement | undefined;
      if (activeEl) {
        const offsetLeft = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
        container.scrollTo({ left: offsetLeft, behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetProduct = catalogProduct || {
      id: current.slug,
      slug: current.slug,
      name: current.name,
      price: current.price,
      compareAtPrice: current.compareAtPrice,
      image: current.image,
      weight: current.weight,
      category: current.category || 'Superfood',
    };
    addItem(targetProduct as any, 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
    openDrawer();
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const p = catalogProduct || products.find((p) => p.slug === current.slug);
    if (p) {
      openQuickView(p.id);
    }
  };

  const discountPercent = calculateDiscount(current.price, current.compareAtPrice);

  return (
    <div
      className="relative w-full max-w-[500px] lg:max-w-[520px] xl:max-w-[540px] flex flex-col items-center justify-center mx-auto select-none overflow-visible touch-pan-y"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient Dynamic Background Glow */}
      <motion.div
        key={`glow-${current.slug}`}
        initial={false}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[440px] lg:w-[500px] h-[340px] sm:h-[440px] lg:h-[500px] rounded-full blur-[80px] pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${current.theme.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Main Expansive Circular Stage — Centered */}
      <div className="relative w-[290px] xs:w-[330px] sm:w-[380px] md:w-[420px] lg:w-[440px] xl:w-[470px] aspect-square flex items-center justify-center mx-auto">
        
        {/* Dynamic Glowing Radial Color Portal with Smooth Color Morphing */}
        <motion.div
          key={`portal-${current.slug}`}
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 rounded-full shadow-2xl transition-all duration-700 transform-gpu"
          style={{
            background: current.theme.portalBg,
            boxShadow: `0 35px 80px -15px ${current.theme.glow}, inset 0 0 60px rgba(255,255,255,0.25)`,
          }}
        />

        {/* Concentric Decorative Rings */}
        <div className="absolute inset-3 sm:inset-5 rounded-full border border-white/40 pointer-events-none" />
        <div className="absolute inset-7 sm:inset-10 rounded-full border-2 border-dashed border-white/30 animate-spin-slow pointer-events-none" />
        <div className="absolute inset-12 sm:inset-16 rounded-full bg-white/10 backdrop-blur-2xs pointer-events-none" />

        {/* Floating Organic Botanical Elements */}
        
        {/* Floating Botanical Leaf 1 (Top Left) */}
        <motion.div
          animate={{
            y: [-6, 8, -6],
            rotate: [-8, 12, -8],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 -left-2 sm:-top-5 sm:left-3 z-20 pointer-events-none drop-shadow-md"
        >
          <div
            className="w-10 h-10 sm:w-13 sm:h-13 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-xs p-2.5 shadow-md border border-white"
            style={{ color: current.theme.leafColor }}
          >
            <Leaf className="w-full h-full fill-current" />
          </div>
        </motion.div>

        {/* Floating Sparkle / Mote (Bottom Right) */}
        <motion.div
          animate={{
            y: [8, -8, 8],
            rotate: [15, -5, 15],
          }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -bottom-3 -right-2 sm:-bottom-5 sm:right-5 z-20 pointer-events-none drop-shadow-md"
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-xs p-2.5 shadow-md border border-white"
            style={{ color: current.theme.primary }}
          >
            <Sparkles className="w-full h-full fill-current" />
          </div>
        </motion.div>

        {/* Floating Badge 1: 0 Additives (Top Right) */}
        <motion.div
          animate={{
            y: [-8, 6, -8],
            x: [3, -3, 3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-6 right-0 sm:top-12 sm:-right-4 z-20 pointer-events-none"
        >
          <div className="px-2.5 py-1.5 rounded-full bg-white/95 text-ink shadow-lg border border-ink/5 flex items-center gap-1.5 text-[11px] sm:text-xs font-bold">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
            <span>0 Additives</span>
          </div>
        </motion.div>

        {/* Floating Badge 2: Packaging (Bottom Left) */}
        <motion.div
          animate={{
            y: [6, -8, 6],
            x: [-3, 3, -3],
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute bottom-6 left-0 sm:bottom-12 sm:-left-4 z-20 pointer-events-none"
        >
          <div className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white/95 text-ink shadow-lg border border-ink/5 flex items-center gap-1.5 text-[11px] sm:text-xs font-bold">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>{current.weight} {current.packing.includes('Glass') ? 'Glass Jar' : 'Pouch'}</span>
          </div>
        </motion.div>

        {/* Giant 3D Hero Product Image (Popping Out with Silky Motion) */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`product-hero-${current.slug}`}
            initial={{
              opacity: 0,
              scale: 0.85,
              y: direction === 1 ? 30 : -30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              y: direction === 1 ? -30 : 30,
            }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-2 sm:inset-3 z-10 flex items-center justify-center cursor-pointer transform-gpu will-change-transform"
            onClick={handleQuickView}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden p-2 sm:p-3 group/hero">
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.28)] ring-4 sm:ring-6 ring-white/85 bg-white/10 group-hover/hero:scale-105 transition-transform duration-500">
                <Image
                  src={resolveImageUrl(current.image)}
                  alt={current.name}
                  fill
                  priority
                  className="object-cover"
                  onError={(e: any) => {
                    e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Quick View Hover Pill */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-dark/85 text-white text-xs font-semibold backdrop-blur-xs shadow-lg">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Quick View</span>
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Dynamic Product Card Below Circle (Aligned & Overlapping) */}
      <div className="w-full max-w-[420px] -mt-6 sm:-mt-8 z-30 relative px-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`card-${current.slug}`}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-ink/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.16)] transition-all duration-300"
          >
            {/* Top row: Badge + Rating */}
            <div className="flex items-center justify-between gap-2 pb-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${current.theme.badgeBg}`}>
                {current.badge}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-ink">{current.rating}</span>
                <span className="text-[10px] text-ink/50">({current.reviews})</span>
              </div>
            </div>

            {/* Product Name & Subheading */}
            <div className="mt-1">
              <Link href={`/products/${current.slug}`}>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-ink hover:text-primary transition-colors leading-tight">
                  {current.name}
                </h3>
              </Link>
              <p className="text-xs text-ink/65 line-clamp-1 mt-0.5 font-sans">
                {current.description}
              </p>
            </div>

            {/* Price & Action Buttons */}
            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-ink/8">
              <div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-heading font-extrabold text-xl sm:text-2xl"
                    style={{ color: current.theme.primary }}
                  >
                    {formatPrice(current.price)}
                  </span>
                  {current.compareAtPrice && current.compareAtPrice > current.price && (
                    <span className="text-xs text-ink/40 line-through font-heading">
                      {formatPrice(current.compareAtPrice)}
                    </span>
                  )}
                </div>
                {discountPercent && (
                  <span className="text-[10px] font-bold text-emerald-700">
                    Save {discountPercent}% off
                  </span>
                )}
              </div>

              {/* Order / Add to Cart Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickView}
                  className="p-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-ink/75 hover:text-ink transition-colors"
                  aria-label="Quick View"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-white font-heading font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${current.theme.primary} 0%, ${current.theme.secondary} 100%)`,
                  }}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 10-Product Thumbnail Selector Carousel Below Card */}
      <div className="w-full mt-3 pt-2">
        <div className="flex items-center justify-between px-1 mb-1.5 text-xs font-semibold text-ink/60">
          <span className="text-[11px] uppercase tracking-wider">
            All 10 Flagship Products ({currentIndex + 1}/10):
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevSlide}
              className="w-5 h-5 rounded-full bg-white border border-ink/15 flex items-center justify-center hover:bg-primary-50 text-ink/70 hover:text-primary transition-all"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="w-5 h-5 rounded-full bg-white border border-ink/15 flex items-center justify-center hover:bg-primary-50 text-ink/70 hover:text-primary transition-all"
              aria-label="Next product"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Thumbnail Cards Strip */}
        <div
          ref={thumbnailScrollRef}
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth px-1"
        >
          {HERO_SHOWCASE_PRODUCTS.map((prod, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={prod.slug}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`group relative flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-white shadow-sm scale-105 border-2'
                    : 'bg-white/60 hover:bg-white border border-ink/10 opacity-70 hover:opacity-100'
                }`}
                style={{
                  borderColor: isActive ? prod.theme.ringColor : undefined,
                }}
              >
                <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                  <Image
                    src={resolveImageUrl(prod.image)}
                    alt={prod.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left pr-0.5">
                  <div className="text-[10px] font-heading font-bold text-ink leading-tight line-clamp-1">
                    {prod.name}
                  </div>
                  <div
                    className="text-[9px] font-bold"
                    style={{ color: prod.theme.primary }}
                  >
                    Rs. {prod.price}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {HERO_SHOWCASE_PRODUCTS.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => goToSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-5' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
              }`}
              style={{
                backgroundColor: i === currentIndex ? p.theme.primary : undefined,
              }}
              aria-label={`Show ${p.name}`}
            />
          ))}
        </div>

        {/* Auto-rotation progress bar */}
        {isPlaying && (
          <div className="w-full mt-2.5 h-0.5 rounded-full bg-ink/10 overflow-hidden">
            <motion.div
              key={`progress-${currentIndex}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-full rounded-full"
              style={{ backgroundColor: current.theme.primary }}
            />
          </div>
        )}
      </div>
    </div>
  );
}