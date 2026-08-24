'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
} from 'lucide-react';
import { initialFestivalOffers, FestivalOffer } from '@/lib/data/offers';
import { useCartStore } from '@/lib/store/cart-store';

export default function FestivalOffersPage() {
  const [offers, setOffers] = useState<FestivalOffer[]>(initialFestivalOffers);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('/api/admin/marketing/offers');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            const activeOnly = json.data.filter((o: any) => o.isActive !== false);
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
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 3, hours: 12, minutes: 45, seconds: 30 };
      });
    }, 1000);
    return () => clearInterval(timer);
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

  const filteredOffers = offers.filter((o) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'FESTIVAL') return o.isFestival;
    return o.categoryLabel?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B] flex flex-col font-sans">
      <main className="flex-1">
        {/* Top Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A18] via-[#2D5A27] to-[#1E3A18] text-white py-16 lg:py-24">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9982A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container-nm relative z-10 text-center max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9982A]/20 text-[#EBC164] border border-[#C9982A]/40 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
              <Sparkles className="w-4 h-4 text-[#C9982A]" />
              Nepal Festival Dhamaka & Himalayan Combos
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading leading-tight tracking-tight">
              Curated Festival Combos & Wellness Packs
            </h1>

            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-body">
              Celebrate with 100% natural, chemical-free Himalayan superfoods. Exclusive festival combo savings up to 35% OFF with free express delivery across Nepal.
            </p>

            {/* Live Ticker */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/15 shadow-xl">
              <div className="flex items-center gap-2 text-xs text-white/80 font-bold uppercase tracking-wide">
                <Timer className="w-4 h-4 text-[#C9982A] animate-pulse" />
                <span>Limited Festival Deals End In:</span>
              </div>
              <div className="flex items-center gap-2 font-mono font-black text-sm sm:text-base text-white">
                <span className="bg-white/15 px-2.5 py-1 rounded-lg border border-white/20">
                  {String(timeLeft.days).padStart(2, '0')}d
                </span>
                <span>:</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-lg border border-white/20">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-white/15 px-2.5 py-1 rounded-lg border border-white/20">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-[#C9982A] text-black px-2.5 py-1 rounded-lg shadow-sm">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantees Bar */}
        <section className="bg-white border-b border-gray-200/80 py-4 shadow-xs">
          <div className="container-nm px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700">
                <Truck className="w-4 h-4 text-[#2D5A27]" />
                <span>Free Doorstep Delivery Across Nepal</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700">
                <Gift className="w-4 h-4 text-[#C9982A]" />
                <span>Special Festive Gift Packaging</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700">
                <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
                <span>100% Organic & Chemical-Free</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700">
                <HeartHandshake className="w-4 h-4 text-[#C9982A]" />
                <span>Cash On Delivery (COD) Available</span>
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

                    {/* Products Grid inside Combo */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#2D5A27]" />
                        <span>Included in this Bundle ({offer.items.length} Premium Items):</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {offer.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF7F2] border border-gray-200/80 hover:bg-white transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg relative overflow-hidden shrink-0 border border-gray-200">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                              <p className="text-[11px] text-gray-500 font-semibold">{item.weight}</p>
                            </div>
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

                  {/* Bottom Action Footer */}
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

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      {/* Direct WhatsApp Order */}
                      <a
                        href={`https://wa.me/9779713888002?text=${encodeURIComponent(
                          `Hello Nature's Mud! I want to order the Festival Combo: "${offer.title}" (Rs. ${offer.offerPrice}). Coupon: ${offer.couponCode}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        title="Order via WhatsApp"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>

                      {/* Add Combo to Cart */}
                      <button
                        onClick={() => handleClaimCombo(offer)}
                        className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gradient-to-r from-[#C9982A] to-[#EBC164] hover:from-[#d4a333] hover:to-[#f0ca75] text-gray-950 hover:scale-[1.02]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" /> Added to Cart!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" /> Claim Festival Offer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
