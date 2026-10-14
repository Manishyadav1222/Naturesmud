'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Truck,
  Gift,
  Percent,
  Clock,
  Check,
  Copy,
  ShoppingBag,
  ArrowRight,
  Flame,
  Search,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { products as staticProducts } from '@/lib/data/products';
import {
  DASHAIN_OFFER_CONFIG,
  getDashainCountdown,
  getDashainDiscountedPrice,
} from '@/lib/data/dashain-offer';
import { ProductCard } from '@/components/ProductCard';
import { useUIStore } from '@/lib/store/ui-store';
import { toast } from 'sonner';

interface DashainOfferShowcaseSectionProps {
  products?: Product[];
  defaultShowAll?: boolean;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Products' },
  { id: 'powders', label: 'Organic Powders' },
  { id: 'nuts', label: 'Mountain Nuts' },
  { id: 'dried-fruits', label: 'Dried Fruits & Berries' },
  { id: 'seeds', label: 'Seeds, Salts & Oils' },
];

export default function DashainOfferShowcaseSection({
  products = staticProducts,
  defaultShowAll = false,
}: DashainOfferShowcaseSectionProps) {
  const [countdown, setCountdown] = useState(() => getDashainCountdown());
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(defaultShowAll);
  const openDashainModal = useUIStore((s) => s.openDashainModal);

  const catalogList = products && products.length > 0 ? products : staticProducts;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getDashainCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyPromo = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(DASHAIN_OFFER_CONFIG.couponCode).catch(() => {});
    }
    setCopiedCode(true);
    toast.success(`Dashain code ${DASHAIN_OFFER_CONFIG.couponCode} copied!`, {
      description: '10% OFF is automatically applied across all products + Free Delivery >3000 & Free Pink Salt >5000!',
    });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const filteredProducts = useMemo(() => {
    return catalogList.filter((p) => {
      const catStr =
        typeof p.category === 'object' && p.category !== null
          ? ((p.category as any).slug || (p.category as any).name || '').toLowerCase()
          : String(p.category || '').toLowerCase();

      const matchesCategory =
        activeCategory === 'all' ||
        (activeCategory === 'powders' && (catStr.includes('powder') || p.name.toLowerCase().includes('powder'))) ||
        (activeCategory === 'nuts' && (catStr.includes('nut') || p.name.toLowerCase().includes('almond') || p.name.toLowerCase().includes('cashew') || p.name.toLowerCase().includes('walnut') || p.name.toLowerCase().includes('pistachio') || p.name.toLowerCase().includes('peanut') || p.name.toLowerCase().includes('hazelnut') || p.name.toLowerCase().includes('makhana'))) ||
        (activeCategory === 'dried-fruits' && (catStr.includes('dried') || catStr.includes('fruit') || p.name.toLowerCase().includes('fig') || p.name.toLowerCase().includes('raisin') || p.name.toLowerCase().includes('apricot') || p.name.toLowerCase().includes('date') || p.name.toLowerCase().includes('cranberr') || p.name.toLowerCase().includes('blueberr') || p.name.toLowerCase().includes('mango') || p.name.toLowerCase().includes('kiwi') || p.name.toLowerCase().includes('pineapple') || p.name.toLowerCase().includes('papaya') || p.name.toLowerCase().includes('goji'))) ||
        (activeCategory === 'seeds' && (catStr.includes('seed') || catStr.includes('salt') || catStr.includes('oil') || catStr.includes('ghee') || p.name.toLowerCase().includes('seed') || p.name.toLowerCase().includes('salt') || p.name.toLowerCase().includes('oil') || p.name.toLowerCase().includes('ghee')));

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription || '').toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [catalogList, activeCategory, searchQuery]);

  const displayedProducts = showAllProducts || searchQuery.trim() !== '' || activeCategory !== 'all'
    ? filteredProducts
    : filteredProducts.slice(0, 12);

  return (
    <section
      id="dashain-mega-offer"
      className="relative py-10 sm:py-14 lg:py-18 overflow-hidden bg-gradient-to-b from-[#3d0606] via-[#5c0d0d] to-[#1a3826] text-white border-y-4 border-amber-400/60"
    >
      {/* Decorative Festive Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-red-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 relative z-10">
        {/* ── Top Hero Banner: Uploaded Dashain Poster + Glowing Offer Details ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-black/30 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-amber-400/50 shadow-[0_0_50px_rgba(251,191,36,0.25)]">
          {/* Left: Client's Static Dashain Poster Image */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              onClick={openDashainModal}
              className="relative w-full max-w-[440px] aspect-square rounded-2xl overflow-hidden border-2 border-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.45)] cursor-pointer group"
            >
              <Image
                src={DASHAIN_OFFER_CONFIG.posterImage}
                alt="NaturesMud Dashain Blessings & Health Offer - 10% OFF on Our Products, Free Delivery Over 3000, Free Delivery & Pink Salt Free Over 5000+"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-300/60 text-[11px] font-black uppercase tracking-wider text-amber-300 dashain-glow-text">
                🪔 Valid Till Chhath Puja
              </div>
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-amber-400 text-[#4a0808] text-[11px] font-black uppercase tracking-wider shadow-lg">
                Click to Enlarge ✨
              </div>
            </div>
          </div>

          {/* Right: Glowing Text + Countdown + Attractive Offer Tiers */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-200 text-xs font-black uppercase tracking-widest mb-3 dashain-glow-box">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Nepal&apos;s Grand Festival Celebration · Valid Till Chhath Puja (Late Nov)</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                <span className="dashain-glow-gold block">
                  DASHAIN, TIHAR &amp; CHHATH BLESSINGS
                </span>
                <span className="text-white dashain-glow-text text-xl sm:text-3xl lg:text-4xl mt-1 block">
                  Bhai Masala &amp; Puja Gifts · Free Delivery &gt; 3,000 + Free Pink Salt &gt; 5,000+!
                </span>
              </h2>

              <p className="mt-2.5 text-amber-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                Celebrate Dashain, Tihar (Bhai Tika Masala) and sacred Chhath Puja with 100% pure Himalayan superfoods, raw nuts, dried fruits, and natural sweeteners. Enjoy Free Delivery over Rs. 3,000 and a complimentary Himalayan Pink Salt jar on orders over Rs. 5,000+ valid through Chhath Puja!
              </p>
            </div>

            {/* Attractive Glowing Offer Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Tier 1: Free Delivery Over 3000 */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/25 via-emerald-950/60 to-teal-600/20 border-2 border-emerald-300/70 p-4 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#0c2e1c] flex items-center justify-center font-black mb-2.5 shadow-md">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-300 text-[#0c2e1c] mb-1">
                  Orders Over Rs. 3,000
                </span>
                <h3 className="font-heading text-lg font-black text-emerald-200 dashain-glow-text leading-snug">
                  FREE DELIVERY OVER 3,000
                </h3>
                <p className="text-xs text-emerald-100/85 mt-1">
                  100% Free express home delivery across Kathmandu &amp; all 77 districts!
                </p>
              </div>

              {/* Tier 2: Free Delivery + Free Pink Salt Over 5000+ */}
              <div className="rounded-2xl bg-gradient-to-br from-rose-500/30 via-pink-950/60 to-amber-500/25 border-2 border-rose-300/80 p-4 shadow-lg dashain-glow-box">
                <div className="w-10 h-10 rounded-xl bg-rose-300 text-[#4a0808] flex items-center justify-center font-black mb-2.5 shadow-md">
                  <Gift className="w-5 h-5" />
                </div>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-300 text-[#4a0808] mb-1">
                  Orders Over Rs. 5,000+
                </span>
                <h3 className="font-heading text-lg font-black text-rose-200 dashain-glow-text leading-snug">
                  FREE DELIVERY + PINK SALT FREE
                </h3>
                <p className="text-xs text-rose-100/85 mt-1">
                  Get Free Delivery + a FREE 200g Jar of Pure Himalayan Pink Salt!
                </p>
              </div>
            </div>

            {/* Live Countdown Till Dashain End (Dynamic Expiry Handled) */}
            {countdown.isExpired ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-black/40 rounded-2xl p-3.5 border border-emerald-400/40">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Festival Offer Concluded · Regular Express Delivery Active Across All 77 Districts</span>
                </div>
                <Link
                  href="/products"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-stone-950 font-heading font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" /> Shop Whole-Food Collection
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-black/40 rounded-2xl p-3.5 border border-amber-400/40">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>Offer Ends In:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[
                      { label: 'Days', val: countdown.days },
                      { label: 'Hrs', val: countdown.hours },
                      { label: 'Min', val: countdown.minutes },
                      { label: 'Sec', val: countdown.seconds },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="bg-amber-400/20 border border-amber-300/50 rounded-lg px-2 py-1 text-center min-w-[44px]"
                      >
                        <span className="block font-heading text-sm font-black text-amber-200 leading-none">
                          {String(unit.val).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-amber-100/75">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/products"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#4a0808] font-heading font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" /> Shop Festive Collection
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── All Products Festive Offer Catalog Grid ── */}
        <div className="mt-10 sm:mt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-[#4a0808] text-xs font-black uppercase tracking-wider mb-2 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>All {catalogList.length} Products Included in Festive Offer</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-white dashain-glow-text">
                Shop All Pure Himalayan Products
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/85 mt-1">
                Every product below counts toward <strong>Free Delivery (&gt;Rs. 3,000)</strong> and <strong>Free Delivery + Free Himalayan Pink Salt (&gt;Rs. 5,000)</strong>!
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any product in festive offer..."
                className="w-full pl-9 pr-4 py-2.5 rounded-full bg-black/35 border border-amber-300/50 text-xs sm:text-sm text-white placeholder:text-amber-200/60 focus:outline-none focus:border-amber-300"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-5">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-heading font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-[#4a0808] shadow-lg scale-105'
                      : 'bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-300/30'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'all' ? ` (${catalogList.length})` : ''}
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* Show All / View All Toggle */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {!showAllProducts && filteredProducts.length > displayedProducts.length && (
              <button
                type="button"
                onClick={() => setShowAllProducts(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#4a0808] font-heading font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(251,191,36,0.5)] hover:brightness-110 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Show All {filteredProducts.length} Festive Offer Products</span>
              </button>
            )}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-amber-300/50 font-heading font-bold text-sm transition-all"
            >
              <span>Explore Full Shop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
