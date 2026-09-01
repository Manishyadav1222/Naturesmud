'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  ShoppingBag,
  Star,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Flame,
  Award,
  Zap,
  Eye,
  Heart,
  ChevronRight,
  ChevronLeft,
  Baby,
  Users,
  Check,
  MessageCircle,
} from 'lucide-react';
import { HERO_SHOWCASE_PRODUCTS } from '@/components/HeroProductShowcase';
import { products, normalizeProduct } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import { useUIStore } from '@/lib/store/ui-store';
import { useCartStore } from '@/lib/store/cart-store';
import { resolveImageUrl, formatPrice, calculateDiscount } from '@/lib/utils';
import ReelsSection from '@/components/ReelsSection';
import BabyMotherCombosSection from '@/components/BabyMotherCombosSection';
import RealCustomerReviewsSection from '@/components/RealCustomerReviewsSection';
import AnimatedCounter from '@/components/AnimatedCounter';

// Category Story Avatars for Mobile Top Bar
const STORY_CATEGORIES = [
  { name: 'Fruits', label: 'Dried Fruits', slug: 'dried-fruits', icon: '🥭', img: '/products/authentic-dehydrated-mango.jpg' },
  { name: 'Powders', label: 'Super Powders', slug: 'powders', icon: '🥔', img: '/products/dates-powder-100g.jpg' },
  { name: 'Baby Food', label: 'Baby Weaning', slug: 'baby-care', icon: '👶', img: '/products/sweet-potato-powder-100g.jpg' },
  { name: 'Berries', label: 'Super Berries', slug: 'berries', icon: '🫐', img: '/products/dried-blueberries-100g.jpg' },
  { name: 'Seeds', label: 'Super Seeds', slug: 'seeds', icon: '🌱', img: '/products/chia-seeds.jpg' },
  { name: 'Nuts', label: 'Mountain Nuts', slug: 'nuts', icon: '🌰', img: '/products/authentic-cashewnuts-roasted.jpg' },
  { name: 'Offers', label: 'Combos & Packs', slug: 'offers', icon: '🎁', img: '/products/superfood-mix.jpg' },
];

// Product poster images that serve as animated full-section backgrounds
const HERO_BG_IMAGES = [
  { img: '/images/posters/papaya-pop.jpg', overlayFrom: 'rgba(234,88,12,0.42)', overlayTo: 'rgba(80,15,0,0.78)', accent: '#FB923C', primary: '#EA580C' },
  { img: '/images/posters/tropical-crunch.jpg', overlayFrom: 'rgba(202,138,4,0.42)', overlayTo: 'rgba(60,20,0,0.78)', accent: '#EAB308', primary: '#CA8A04' },
  { img: '/images/posters/chia-power.jpg', overlayFrom: 'rgba(13,148,136,0.45)', overlayTo: 'rgba(2,44,34,0.80)', accent: '#14B8A6', primary: '#0D9488' },
  { img: '/images/posters/blueberry-bite.jpg', overlayFrom: 'rgba(109,40,217,0.45)', overlayTo: 'rgba(20,5,50,0.80)', accent: '#8B5CF6', primary: '#7C3AED' },
  { img: '/images/posters/sweet-vibes.jpg', overlayFrom: 'rgba(190,24,93,0.44)', overlayTo: 'rgba(60,0,30,0.78)', accent: '#EC4899', primary: '#BE185D' },
  { img: '/images/posters/chia-power.jpg', overlayFrom: 'rgba(13,148,136,0.42)', overlayTo: 'rgba(2,44,34,0.78)', accent: '#14B8A6', primary: '#0D9488' },
  { img: '/images/posters/papaya-pop.jpg', overlayFrom: 'rgba(225,29,72,0.42)', overlayTo: 'rgba(80,0,30,0.78)', accent: '#FB7185', primary: '#E11D48' },
  { img: '/images/posters/tropical-crunch.jpg', overlayFrom: 'rgba(100,116,139,0.42)', overlayTo: 'rgba(15,23,42,0.78)', accent: '#94A3B8', primary: '#475569' },
  { img: '/images/posters/sweet-vibes.jpg', overlayFrom: 'rgba(5,150,105,0.42)', overlayTo: 'rgba(2,44,34,0.78)', accent: '#34D399', primary: '#059669' },
  { img: '/images/posters/blueberry-bite.jpg', overlayFrom: 'rgba(217,119,6,0.42)', overlayTo: 'rgba(60,20,0,0.78)', accent: '#F59E0B', primary: '#D97706' },
];

export default function MobileHomePage() {
  const { openSearch, openQuickView } = useUIStore();
  const { addItem, openDrawer } = useCartStore();

  const [heroIdx, setHeroIdx] = useState(0);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentHero = HERO_SHOWCASE_PRODUCTS[heroIdx];
  const catalogProduct = products.find((p) => p.slug === currentHero.slug);
  const currentBg = HERO_BG_IMAGES[heroIdx] || HERO_BG_IMAGES[0];

  // Auto-cycle mobile hero every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % HERO_SHOWCASE_PRODUCTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setHeroIdx((prev) => (prev + 1) % HERO_SHOWCASE_PRODUCTS.length);
    }
    if (isRightSwipe) {
      setHeroIdx((prev) => (prev - 1 + HERO_SHOWCASE_PRODUCTS.length) % HERO_SHOWCASE_PRODUCTS.length);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleQuickAdd = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(p, 1);
    setAddedItem(p.slug || p.id);
    setTimeout(() => setAddedItem(null), 1500);
    openDrawer();
  };

  const discountPercent = calculateDiscount(currentHero.price, currentHero.compareAtPrice);

  return (
    <div className="lg:hidden w-full bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden" style={{ padding: '0 1%' }}>

      {/* 1. Mobile App Top Sticky Header Bar */}
      <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-[2%] pt-3 pb-2.5 border-b border-ink/8 mx-[-1%]">
        {/* Express Delivery Pill */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-ink/75 mb-2">
          <div className="flex items-center gap-1 text-[#7A5230]">
            <Truck className="w-3.5 h-3.5 text-[#1A3826]" />
            <span className="font-medium">Express Delivery Across Nepal</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
            24h Kathmandu
          </span>
        </div>

        {/* Mobile Search Bar */}
        <button
          type="button"
          onClick={() => openSearch()}
          className="w-full flex items-center justify-between bg-white border border-ink/12 rounded-2xl px-3.5 py-2.5 shadow-2xs text-left"
        >
          <div className="flex items-center gap-2.5 text-ink/50 text-xs font-sans">
            <Search className="w-4 h-4 text-primary" />
            <span>Search 50+ Himalayan superfoods, powders...</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-md">
            Find
          </span>
        </button>
      </div>

      {/* 2. Instagram-Style Story Categories Bar */}
      <div className="py-3 px-[1%] overflow-x-auto no-scrollbar flex items-center gap-3 bg-white border-b border-ink/5 mx-[-1%]">
        {STORY_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={cat.slug === 'offers' ? '/offers' : `/products?category=${cat.slug}`}
            className="flex flex-col items-center flex-shrink-0 group text-center"
          >
            {/* Story Avatar Bubble with Gradient Ring */}
            <div className="relative w-15 h-15 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-primary to-emerald-500 shadow-xs group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-cream-100 relative">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-0.5 text-xs bg-white rounded-full px-1 shadow-2xs border border-ink/10">
                {cat.icon}
              </span>
            </div>
            <span className="text-[10px] font-heading font-bold text-ink/80 mt-1 line-clamp-1 max-w-[64px]">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. HERO SHOWCASE — Full animated product poster background
         ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative mx-[-1%] overflow-hidden"
        style={{ minHeight: '88vw', maxHeight: '520px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Animated Full-Bleed Poster Background ── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`hero-bg-${heroIdx}`}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={currentBg.img}
              alt={currentHero.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              style={{ filter: 'saturate(1.2) brightness(0.82)' }}
            />
            {/* Color-matched gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${currentBg.overlayFrom} 0%, ${currentBg.overlayTo} 100%)`,
              }}
            />
            {/* Bottom fade-to-cream for smooth merge with cards below */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Ambient glow orbs */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`orb1-${heroIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute -top-8 -right-8 w-56 h-56 rounded-full blur-3xl pointer-events-none z-0"
            style={{ backgroundColor: currentBg.accent }}
          />
          <motion.div
            key={`orb2-${heroIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.15 }}
            className="absolute -bottom-4 -left-4 w-44 h-44 rounded-full blur-3xl pointer-events-none z-0"
            style={{ backgroundColor: currentBg.primary }}
          />
        </AnimatePresence>

        {/* ── Hero Content — centered on mobile/tablet ── */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-5 pb-10 text-center">

          {/* Eyebrow badge + counter */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm backdrop-blur-sm bg-white/20 text-white border-white/30`}
            >
              {currentHero.badge}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-white/80 backdrop-blur-xs bg-black/20 px-2 py-0.5 rounded-full">
              <span>{heroIdx + 1}</span>
              <span>/</span>
              <span>10 Flagships</span>
            </div>
          </div>

          {/* Product Title */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={`title-${currentHero.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight drop-shadow-lg mb-1"
            >
              {currentHero.name}
            </motion.h2>
          </AnimatePresence>
          <p className="text-xs text-white/75 font-medium mb-4">
            {currentHero.subheading} · {currentHero.weight}
          </p>

          {/* Central 3D Product Image Circle — CENTERED */}
          <div className="relative w-[56vw] max-w-[260px] aspect-square mx-auto flex items-center justify-center mb-4">
            {/* Glowing Radial Portal */}
            <motion.div
              key={`portal-${currentHero.slug}`}
              initial={{ scale: 0.88, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full"
              style={{
                background: currentHero.theme.portalBg,
                boxShadow: `0 20px 50px -10px ${currentHero.theme.glow}`,
              }}
            />
            {/* Concentric rings */}
            <div className="absolute inset-3 rounded-full border border-white/40 pointer-events-none" />
            <div className="absolute inset-6 rounded-full border border-dashed border-white/30 pointer-events-none animate-spin-slow" />

            {/* Floating accents */}
            <div className="absolute -top-1 -left-1 z-20">
              <div
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center p-1.5 border border-white"
                style={{ color: currentHero.theme.leafColor }}
              >
                <Leaf className="w-full h-full fill-current" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 z-20">
              <div className="px-2.5 py-1 rounded-full bg-white shadow-md border border-ink/5 flex items-center gap-1 text-[10px] font-bold">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>0 Additives</span>
              </div>
            </div>

            {/* Main Product Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`mobile-hero-img-${currentHero.slug}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full rounded-full overflow-hidden p-2 z-10"
                onClick={() => openQuickView(catalogProduct?.id || currentHero.slug)}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl ring-4 ring-white/90">
                  <Image
                    src={resolveImageUrl(currentHero.image)}
                    alt={currentHero.name}
                    fill
                    priority
                    className="object-cover"
                    onError={(e: any) => {
                      e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Description */}
          <p className="text-xs text-white/85 font-medium text-center line-clamp-2 px-4 mb-4 max-w-xs drop-shadow">
            {currentHero.description}
          </p>

          {/* Price + CTA — centered row */}
          <div className="flex items-center justify-center gap-4 w-full max-w-xs mx-auto">
            <div className="text-left">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-extrabold text-2xl text-white drop-shadow">
                  {formatPrice(currentHero.price)}
                </span>
                {currentHero.compareAtPrice && currentHero.compareAtPrice > currentHero.price && (
                  <span className="text-xs text-white/50 line-through font-heading">
                    {formatPrice(currentHero.compareAtPrice)}
                  </span>
                )}
              </div>
              {discountPercent && (
                <span className="text-[10px] font-bold text-emerald-300">
                  Save {discountPercent}% off
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openQuickView(catalogProduct?.id || currentHero.slug)}
                className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 active:scale-95 transition-all"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => handleQuickAdd(catalogProduct || currentHero, e)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-heading font-bold text-xs shadow-lg active:scale-95 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${currentHero.theme.primary} 0%, ${currentHero.theme.secondary} 100%)`,
                  boxShadow: `0 4px 20px -4px ${currentHero.theme.glow}`,
                }}
              >
                {addedItem === currentHero.slug ? (
                  <>
                    <Check className="w-3.5 h-3.5 animate-bounce" />
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

          {/* 10-Dot Progress Indicator — centered */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {HERO_SHOWCASE_PRODUCTS.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setHeroIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === heroIdx ? 'w-5' : 'w-1.5 bg-white/40'
                }`}
                style={{
                  backgroundColor: i === heroIdx ? '#ffffff' : undefined,
                }}
                aria-label={`Go to ${p.name}`}
              />
            ))}
          </div>
        </div>

        {/* Prev/Next nav arrows */}
        <button
          type="button"
          onClick={() => setHeroIdx((prev) => (prev - 1 + HERO_SHOWCASE_PRODUCTS.length) % HERO_SHOWCASE_PRODUCTS.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white active:scale-90 transition-all"
          aria-label="Previous product"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setHeroIdx((prev) => (prev + 1) % HERO_SHOWCASE_PRODUCTS.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white active:scale-90 transition-all"
          aria-label="Next product"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* 4. Quick Value Proposition Chips (Horizontal Snap) */}
      <div className="py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { icon: ShieldCheck, text: '100% Nepali Origin', color: 'text-primary' },
            { icon: Truck, text: 'Free Delivery > Rs. 10,000', color: 'text-primary' },
            { icon: Sparkles, text: '0 Additives or Preservatives', color: 'text-amber-600' },
            { icon: Star, text: '4.9★ (25,000+ Happy Nepalis)', color: 'text-amber-500' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink/8 shadow-2xs flex-shrink-0 text-xs font-semibold text-ink/80"
              >
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Baby & Mother Combos — full width centered */}
      <section className="py-3">
        <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border border-rose-200/60 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
              <Baby className="w-3 h-3" />
              Pediatrician Recommended
            </span>
            <Link href="/products?category=baby-care" className="text-xs font-bold text-rose-700 flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <h3 className="font-heading font-extrabold text-base text-ink">
            Baby Weaning & Pediatric Superfood Powders
          </h3>
          <p className="text-xs text-ink/70 mt-0.5">
            Sweet Potato, Dates & Beetroot Powders for infant porridge (लुटो) & toddlers. 0% refined sugar.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              { name: 'Sweet Potato Powder', slug: 'sweet-potato-powder', price: 420, img: '/products/sweet-potato-powder-100g.jpg' },
              { name: 'Dates Powder Sweetener', slug: 'dates-powder', price: 350, img: '/products/dates-powder-100g.jpg' },
            ].map((prod) => (
              <Link
                key={prod.slug}
                href={`/products/${prod.slug}`}
                className="bg-white rounded-2xl p-2.5 border border-rose-100 shadow-2xs flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-cream-100 mb-1.5">
                  <Image src={prod.img} alt={prod.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="text-xs font-heading font-bold text-ink line-clamp-1">{prod.name}</div>
                  <div className="text-xs font-bold text-primary mt-0.5">Rs. {prod.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Top Flagship Bestsellers Grid (2-Column, full width, centered) */}
      <section className="py-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Handpicked Harvests
            </span>
            <h2 className="font-heading font-extrabold text-lg text-ink">
              Top Trending Superfoods
            </h2>
          </div>
          <Link href="/products" className="text-xs font-bold text-primary flex items-center gap-0.5">
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {products.slice(0, 6).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl p-2.5 border border-ink/8 shadow-2xs flex flex-col justify-between"
            >
              <Link href={`/products/${prod.slug}`} className="block">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-cream-100 mb-2">
                  <Image
                    src={resolveImageUrl(prod.image)}
                    alt={prod.name}
                    fill
                    className="object-cover"
                  />
                  {prod.isBestSeller && (
                    <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="text-xs font-heading font-bold text-ink line-clamp-1">
                  {prod.name}
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-[10px] mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-ink">{prod.rating || 4.9}</span>
                </div>
              </Link>

              <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-ink/5">
                <span className="font-heading font-extrabold text-sm text-primary">
                  Rs. {prod.price}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(prod, e)}
                  className="p-2 rounded-xl bg-primary text-white active:scale-95 shadow-xs transition-all"
                  aria-label={`Add ${prod.name} to cart`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Reels Section */}
      <div className="py-2 mx-[-1%]">
        <ReelsSection />
      </div>

      {/* 8. Customer Reviews */}
      <div className="py-2 mx-[-1%]">
        <RealCustomerReviewsSection />
      </div>

      {/* 9. WhatsApp Fast-Order Banner */}
      <section className="py-3">
        <div className="bg-[#1A3826] text-white rounded-3xl p-4 shadow-md flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-300">
              Need Help or Custom Pack?
            </span>
            <h4 className="font-heading font-bold text-sm leading-tight">
              Order Directly on WhatsApp
            </h4>
            <p className="text-[11px] text-white/75">
              Chat with our wellness specialists in Kathmandu.
            </p>
          </div>
          <Link
            href="https://wa.me/9779819844486?text=Hello%20Nature%27s%20Mud!%20I%20would%20like%20to%20order%20superfoods."
            target="_blank"
            className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
