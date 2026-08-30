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

export default function MobileHomePage() {
  const { openSearch, openQuickView } = useUIStore();
  const { addItem, openDrawer } = useCartStore();

  const [heroIdx, setHeroIdx] = useState(0);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentHero = HERO_SHOWCASE_PRODUCTS[heroIdx];
  const catalogProduct = products.find((p) => p.slug === currentHero.slug);

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
    <div className="lg:hidden w-full bg-[#FAF7F2] min-h-screen pb-24 overflow-x-hidden">
      
      {/* 1. Mobile App Top Sticky Header Bar */}
      <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-4 pt-3 pb-2.5 border-b border-ink/8">
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

        {/* Mobile Search Bar (Interactive Trigger) */}
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
      <div className="py-3 px-3 overflow-x-auto no-scrollbar flex items-center gap-3 bg-white border-b border-ink/5">
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

      {/* 3. Dedicated Mobile Hero Showcase with 10-Product Swipe & Color Portal */}
      <section
        className="px-3 pt-3 pb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative rounded-3xl p-4 sm:p-5 overflow-hidden shadow-lg border border-white/40 transition-colors duration-700"
          style={{
            background: `linear-gradient(145deg, #FFFFFF 0%, ${currentHero.theme.portalBg.includes('#') ? '#FAF7F2' : '#FFFDF9'} 100%)`,
            boxShadow: `0 12px 30px -10px ${currentHero.theme.glow}`,
          }}
        >
          {/* Eyebrow & Badge */}
          <div className="flex items-center justify-between gap-2 pb-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${currentHero.theme.badgeBg}`}>
              {currentHero.badge}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-ink/60">
              <span>{heroIdx + 1}</span>
              <span>/</span>
              <span>10 Flagships</span>
            </div>
          </div>

          {/* Product Title & Subtitle */}
          <div className="pt-1">
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-ink leading-tight">
              {currentHero.name}
            </h2>
            <p className="text-xs text-ink/65 font-medium mt-0.5">
              {currentHero.subheading} · {currentHero.weight}
            </p>
          </div>

          {/* Central 3D Visual Stage with Dynamic Portal */}
          <div className="relative my-4 w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center">
            {/* Glowing Radial Color Portal */}
            <motion.div
              key={`mobile-portal-${currentHero.slug}`}
              initial={{ scale: 0.88, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full"
              style={{
                background: currentHero.theme.portalBg,
                boxShadow: `0 20px 50px -10px ${currentHero.theme.glow}`,
              }}
            />

            {/* Concentric subtle rings */}
            <div className="absolute inset-3 rounded-full border border-white/40 pointer-events-none" />
            <div className="absolute inset-6 rounded-full border border-dashed border-white/30 pointer-events-none animate-spin-slow" />

            {/* Floating Organic Accents */}
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

            {/* Main Product Image (Click to view) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`mobile-hero-img-${currentHero.slug}`}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -30 }}
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

          {/* Description snippet */}
          <p className="text-xs text-ink/75 font-sans text-center line-clamp-2 px-1">
            {currentHero.description}
          </p>

          {/* Price + Buy Now Row */}
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-ink/8">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="font-heading font-extrabold text-2xl"
                  style={{ color: currentHero.theme.primary }}
                >
                  {formatPrice(currentHero.price)}
                </span>
                {currentHero.compareAtPrice && currentHero.compareAtPrice > currentHero.price && (
                  <span className="text-xs text-ink/40 line-through font-heading">
                    {formatPrice(currentHero.compareAtPrice)}
                  </span>
                )}
              </div>
              {discountPercent && (
                <span className="text-[10px] font-bold text-emerald-700">
                  Save {discountPercent}% off
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openQuickView(catalogProduct?.id || currentHero.slug)}
                className="p-2.5 rounded-xl bg-cream-100 text-ink/75 active:scale-95 transition-all"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => handleQuickAdd(catalogProduct || currentHero, e)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-heading font-bold text-xs shadow-md active:scale-95 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${currentHero.theme.primary} 0%, ${currentHero.theme.secondary} 100%)`,
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

          {/* 10-Dot Progress Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-3 pt-1">
            {HERO_SHOWCASE_PRODUCTS.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setHeroIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === heroIdx ? 'w-5' : 'w-1.5 bg-ink/20'
                }`}
                style={{
                  backgroundColor: i === heroIdx ? p.theme.primary : undefined,
                }}
                aria-label={`Go to ${p.name}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Mobile Quick Value Proposition Chips (Horizontal Snap) */}
      <div className="px-3 py-2">
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

      {/* 5. Baby & Mother Combos (Special Mobile Spotlight) */}
      <section className="px-3 py-3">
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

      {/* 6. Top Flagship Bestsellers Grid (2-Column Mobile Feed) */}
      <section className="px-3 py-3">
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

      {/* 7. Reels Section in Mobile */}
      <div className="py-2">
        <ReelsSection />
      </div>

      {/* 8. Customer Reviews & Wall of Love */}
      <div className="py-2">
        <RealCustomerReviewsSection />
      </div>

      {/* 9. Direct WhatsApp Fast-Order Banner */}
      <section className="px-3 py-3">
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
            href="https://wa.me/9779713888002?text=Hello%20Nature%27s%20Mud!%20I%20would%20like%20to%20order%20superfoods."
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
