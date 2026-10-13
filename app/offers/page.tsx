'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Timer,
  ShoppingBag,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Flame,
  Truck,
  Gift,
  Phone,
  Layers,
  HeartHandshake,
  Star,
  Zap,
} from 'lucide-react';
import { initialFestivalOffers, FestivalOffer, getActiveCampaignOffers } from '@/lib/data/offers';
import { useCartStore } from '@/lib/store/cart-store';
import FeaturesStrip from '@/components/FeaturesStrip';
import DashainOfferShowcaseSection from '@/components/DashainOfferShowcaseSection';
import { ProductCard } from '@/components/ProductCard';
import { products as staticProducts, normalizeProduct } from '@/lib/data/products';
import { Product } from '@/lib/types';

export default function FestivalOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<FestivalOffer[]>(() => getActiveCampaignOffers(initialFestivalOffers));
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const [soloProducts, setSoloProducts] = useState<Product[]>(() =>
    staticProducts.map((p) => normalizeProduct(p))
  );

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('/api/admin/marketing/offers');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            const activeOnly = getActiveCampaignOffers(json.data);
            if (activeOnly.length > 0) setOffers(activeOnly);
          }
        }
      } catch {
        // Fallback
      }
    }
    fetchOffers();
  }, []);

  useEffect(() => {
    async function fetchDynamicProducts() {
      try {
        const res = await fetch('/api/products?limit=100');
        if (res.ok) {
          const json = await res.json();
          const prods = json.data || json.products || (Array.isArray(json) ? json : null);
          if (Array.isArray(prods) && prods.length > 0) {
            setSoloProducts(prods.map((p) => normalizeProduct(p)));
          }
        }
      } catch {
        // Fallback to static
      }
    }
    fetchDynamicProducts();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleClaimCombo = (offer: FestivalOffer) => {
    useCartStore.getState().addItem(
      {
        id: offer.id,
        slug: offer.items[0]?.productId || offer.id,
        name: offer.title,
        price: offer.offerPrice,
        compareAtPrice: offer.originalPrice,
        image: offer.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Festival Bundle',
        category: offer.categoryLabel || 'Festival Combo',
      },
      1
    );
    setAddedId(offer.id);
    openDrawer();
    setTimeout(() => setAddedId(null), 2500);
  };

  const handleBuyComboNow = (offer: FestivalOffer) => {
    useCartStore.getState().addItem(
      {
        id: offer.id,
        slug: offer.items[0]?.productId || offer.id,
        name: offer.title,
        price: offer.offerPrice,
        compareAtPrice: offer.originalPrice,
        image: offer.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Festival Bundle',
        category: offer.categoryLabel || 'Festival Combo',
      },
      1
    );
    useCartStore.getState().closeDrawer();
    router.push('/checkout');
  };

  const filteredOffers = offers.filter((o) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'FESTIVAL') return o.isFestival;
    return o.categoryLabel?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B] flex flex-col font-sans">
      <main className="flex-1">
        {/* 🎉 Grand Dashain Offer Showcase with Poster, Glowing Text, 3 Tiers & All Products */}
        <DashainOfferShowcaseSection products={soloProducts} defaultShowAll={true} />

        {/* 4 Core Animated Trust Features Strip */}
        <FeaturesStrip className="my-0 shadow-xs" />

        {/* Master Showcase Banner: Authenticity On Every Table */}
        <section className="py-6 container-nm px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#C9982A]/30 bg-stone-900 aspect-[16/8] sm:aspect-[21/9] flex items-end">
            <Image
              src="/images/posters/authenticity-on-every-table.jpg"
              alt="Authenticity On Every Table - NaturesMud Himalayan Collection"
              fill
              priority
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white z-10">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#EBC164]">
                🏔️ Authenticity On Every Table
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-3xl text-white mt-1">
                Pure Himalayan Whole Food Collection
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-2xl mt-1 hidden sm:block">
                Wild Blueberries · Himalayan Beetroot · Crisp Dehydrated Apple · Pure Dates Powder · Ancient Pink Salt · Cold-Pressed Virgin Coconut Oil
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href="/catalog"
                  className="px-5 py-2.5 rounded-xl bg-[#C9982A] hover:bg-[#B88720] text-[#1B3D2F] font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Master Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
                >
                  Our Farmer Roots
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Offers Grid Section */}
        <section className="py-12 lg:py-16 container-nm px-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 pb-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'ALL'
                  ? 'bg-[#2D5A27] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              🌟 All Special Combos ({offers.length})
            </button>
            <button
              onClick={() => setActiveCategory('FESTIVAL')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'FESTIVAL'
                  ? 'bg-[#2D5A27] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              🇳🇵 Festival Dhamaka Deals
            </button>
            {Array.from(new Set(offers.map((o) => o.categoryLabel).filter(Boolean))).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat || 'ALL')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#2D5A27] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Offers Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOffers.map((offer) => {
              const savings = Math.max(0, offer.originalPrice - offer.offerPrice);
              const isAdded = addedId === offer.id;
              const isCopied = copiedCode === offer.couponCode;

              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Top Bar with Badge & Category */}
                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#C9982A]/15 text-[#9E7319] text-xs font-black uppercase tracking-wide border border-[#C9982A]/30">
                          {offer.badge}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                          {offer.categoryIcon} {offer.categoryLabel || offer.festivalName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          🎁 3-Product Value Bundle
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                        <span>CODE: {offer.couponCode}</span>
                        <button
                          onClick={() => handleCopyCode(offer.couponCode)}
                          className="hover:text-primary p-0.5 ml-1 transition-colors"
                          title="Copy Code"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-heading group-hover:text-[#2D5A27] transition-colors">
                        {offer.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{offer.subtitle}</p>
                    </div>

                    {/* Products Grid inside Combo styled with full-bleed product images */}
                    <div className="p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-50/70 via-[#FFFDF7] to-amber-50/70 border border-amber-200/60 shadow-xs">
                      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                        {offer.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="group/item relative flex flex-col items-center text-center rounded-xl sm:rounded-2xl bg-white border border-amber-100 shadow-2xs hover:border-amber-300 transition-all overflow-hidden"
                          >
                            <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden bg-amber-50/40">
                              <Image
                                src={item.image || '/products/superfood-mix.jpg'}
                                alt={item.name.replace(/\s*\(\d+\s*GM\)/i, '')}
                                fill
                                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 240px"
                                className="object-cover object-center transition-transform duration-500 group-hover/item:scale-105"
                              />
                            </div>
                            <div className="w-full px-2 py-2 sm:px-3 sm:py-2.5 bg-white">
                              <p className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight line-clamp-1 w-full">
                                {item.name.replace(/\s*\(\d+\s*GM\)/i, '')}
                              </p>
                            </div>

                            {/* Red plus connector between items */}
                            {idx < 2 && (
                              <div className="flex absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 text-white items-center justify-center text-[9px] sm:text-[11px] font-black shadow-xs pointer-events-none">
                                +
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selling Points */}
                    {offer.highlights && offer.highlights.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-gray-100">
                        {offer.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer with BOTH Add and Buy Now */}
                  <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-[#1E3A18] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-[#EBC164] font-heading">
                          Rs. {offer.offerPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-white/50 line-through">
                          Rs. {offer.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        Save Rs. {savings.toLocaleString()} ({offer.discountPercentage}% OFF)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                      {/* Direct WhatsApp Order */}
                      <a
                        href={`https://wa.me/9779713888002?text=${encodeURIComponent(
                          `Hello Nature's Mud Nepal! I want to order the combo: ${offer.title} (Discounted Price: Rs. ${offer.offerPrice}). Please deliver to my address.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                        title="Order via WhatsApp"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>

                      {/* Add Combo to Cart */}
                      <button
                        onClick={() => handleClaimCombo(offer)}
                        className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer border ${
                          isAdded
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:scale-[1.02]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" /> Add
                          </>
                        )}
                      </button>

                      {/* Instant Direct Buy Now */}
                      <button
                        onClick={() => handleBuyComboNow(offer)}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer bg-gradient-to-r from-[#C9982A] via-[#D9A441] to-[#B88720] hover:brightness-105 text-gray-950 hover:scale-[1.02] active:scale-95"
                      >
                        <Zap className="w-4 h-4 fill-current text-gray-950" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SOLO SUPERFOOD DEALS (Dates Powder, Avocado, Shilajit, etc) */}
        {/* ========================================================= */}
        <section className="py-12 lg:py-16 bg-[#F5EFE4] border-t border-[#E5DAC5]">
          <div className="container-nm px-4">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Single-Ingredient Pure Botanical Nutrition
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#143020] font-heading tracking-tight">
                Flash Deals on Solo Superfoods &amp; Natural Sweeteners
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
                Prefer single jars? Explore 100% natural, whole food nutrition with 0 additives and zero refined sugar — crafted in recyclable glass jars with express delivery across all 77 districts of Nepal.
              </p>
            </div>

            {/* Solo Product Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {soloProducts.map((prod, idx) => (
                <ProductCard key={prod.id || prod.slug} product={prod} index={idx} />
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#143020] hover:bg-[#1f4831] text-white font-heading font-bold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <span>Browse All 30+ Single Superfoods</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-heading font-bold text-sm transition-all shadow-sm"
              >
                <span>View Master Catalog &amp; PDF</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

