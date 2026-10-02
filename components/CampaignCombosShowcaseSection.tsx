'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Timer,
  ShoppingBag,
  CheckCircle2,
  Flame,
  Truck,
  Zap,
} from 'lucide-react';
import { initialFestivalOffers, FestivalOffer } from '@/lib/data/offers';
import { useCartStore } from '@/lib/store/cart-store';

export default function CampaignCombosShowcaseSection() {
  const router = useRouter();
  const [offers, setOffers] = useState<FestivalOffer[]>(initialFestivalOffers);
  const [activeId, setActiveId] = useState(initialFestivalOffers[0].id);
  const [isHovered, setIsHovered] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const openDrawer = useCartStore((s) => s.openDrawer);

  // Time remaining state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    async function fetchAdminOffers() {
      try {
        const res = await fetch('/api/admin/marketing/offers');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            const activeOffers = json.data.filter((o: any) => o.isActive !== false);
            if (activeOffers.length > 0) {
              setOffers(activeOffers);
            }
          }
        }
      } catch {
        // Use initialFestivalOffers
      }
    }
    fetchAdminOffers();
  }, []);

  // Auto-cycle through campaigns every 5s unless hovered
  useEffect(() => {
    if (isHovered || offers.length === 0) return;
    const interval = setInterval(() => {
      setActiveId((currentId) => {
        const currentIdx = offers.findIndex((o) => o.id === currentId);
        const nextIdx = (currentIdx + 1) % offers.length;
        return offers[nextIdx].id;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, offers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 2, hours: 14, minutes: 42, seconds: 18 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentOffer = offers.find((o) => o.id === activeId) || offers[0];

  const handleClaimCombo = (offer: FestivalOffer) => {
    useCartStore.getState().addItem(
      {
        id: offer.id,
        slug: offer.items[0]?.productId || offer.id,
        name: offer.title,
        price: offer.offerPrice,
        compareAtPrice: offer.originalPrice,
        image: offer.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Combo Bundle',
        category: offer.categoryLabel || 'Superfood Combo',
      },
      1
    );
    setAddedId(offer.id);
    openDrawer();
    setTimeout(() => setAddedId(null), 2400);
  };

  const handleBuyNowCombo = (offer: FestivalOffer) => {
    useCartStore.getState().addItem(
      {
        id: offer.id,
        slug: offer.items[0]?.productId || offer.id,
        name: offer.title,
        price: offer.offerPrice,
        compareAtPrice: offer.originalPrice,
        image: offer.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Combo Bundle',
        category: offer.categoryLabel || 'Superfood Combo',
      },
      1
    );
    useCartStore.getState().closeDrawer();
    router.push('/checkout');
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-cream-50 via-white to-cream-50">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-[radial-gradient(circle,rgba(58,107,53,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(217,164,65,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="container-nm relative z-10">
        {/* Section Header (Clean luxury badge without numbered prefix) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#7A5230] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1A3826]" />
              <span>Special Campaigns & Bundles</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-ink tracking-tight">
                Himalayan Superfood Bundles
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold-800 text-[11px] font-bold font-heading border border-gold/30">
                <Flame className="w-3 h-3 text-gold-600 animate-pulse" />
                Flat 5% OFF
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink/70 max-w-xl mt-1 leading-relaxed">
              Curated daily wellness packs for fitness recovery, morning cleansing, total immunity, and festive celebrations.
            </p>
          </div>

          {/* Live countdown timer badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-2xs border border-ink/8 shrink-0 self-start sm:self-auto">
            <Timer className="w-3.5 h-3.5 text-primary animate-pulse" />
            <div className="text-[11px] sm:text-xs font-mono">
              <span className="text-ink/60 mr-1">Flash Deals:</span>
              <span className="font-bold text-ink">
                {String(timeLeft.days).padStart(2, '0')}d:{String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:
                <span className="text-primary font-black">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </span>
            </div>
          </div>
        </div>

        {/* Category & Campaign Tabs with auto-scroll ticker */}
        <div className="flex items-center gap-1.5 pb-4 overflow-x-auto no-scrollbar w-full max-w-full">
          {offers.map((offer) => {
            const isSelected = offer.id === currentOffer.id;
            return (
              <button
                key={offer.id}
                onClick={() => setActiveId(offer.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-primary-700 text-white border-primary shadow-sm shadow-primary/20 scale-[1.02]'
                    : 'bg-white hover:bg-cream-100 text-ink/80 hover:text-ink border-ink/10 shadow-2xs'
                }`}
              >
                <span>{offer.categoryIcon || '🌿'}</span>
                <span>{offer.categoryLabel || offer.title.split(' ')[0]}</span>
                <span
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
                  }`}
                >
                  -{offer.discountPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Bundle Highlight Card styled like the picture */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E8] border border-amber-200/70 p-4 sm:p-6 lg:p-8 shadow-sm relative overflow-hidden group min-h-[auto] flex flex-col justify-between"
        >
          {/* Subtle festive diagonal pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #B91C1C 0, #B91C1C 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}
          />

          {/* Top Auto-Cycle Progress Indicator */}
          <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-red-100 overflow-hidden">
            <motion.div
              key={activeId}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: isHovered ? 0 : 5, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600"
            />
          </div>

          {/* Top Header Row with Category Ribbon, Controls & Countdown */}
          <div className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b border-amber-200/60 pt-0.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-red-800">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-bold font-heading">
                {currentOffer.festivalName || '✨ Himalayan Special Bundle'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const idx = offers.findIndex((o) => o.id === currentOffer.id);
                    const prevIdx = (idx - 1 + offers.length) % offers.length;
                    setActiveId(offers[prevIdx].id);
                  }}
                  className="w-6 h-6 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous combo"
                >
                  <span className="text-xs font-bold">‹</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idx = offers.findIndex((o) => o.id === currentOffer.id);
                    const nextIdx = (idx + 1) % offers.length;
                    setActiveId(offers[nextIdx].id);
                  }}
                  className="w-6 h-6 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next combo"
                >
                  <span className="text-xs font-bold">›</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-mono font-semibold text-red-800 bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full">
                <Timer className="w-3 h-3 text-red-600 animate-pulse" />
                <span className="font-bold">
                  {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:{String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentOffer.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full pt-3 space-y-3.5"
            >
              {/* Badge & Date Tag Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-100/90 text-amber-950 font-heading text-[10px] sm:text-xs font-extrabold uppercase tracking-wide border border-amber-300">
                    {currentOffer.badge}
                  </span>
                  <span className="text-[11px] sm:text-xs text-amber-900 font-semibold flex items-center gap-1">
                    🌾 {currentOffer.tag}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-amber-950 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                  📅 Oct 2–20, 2026
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-ink leading-tight">
                  {currentOffer.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink/70 mt-1 leading-relaxed">
                  {currentOffer.subtitle}
                </p>
              </div>

              {/* 3 Horizontal Products Box connected by red plus (+) signs */}
              <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-50/70 via-[#FFFDF7] to-amber-50/70 border border-amber-200/60 shadow-xs">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {currentOffer.items.slice(0, 3).map((item, i) => (
                    <div
                      key={item.productId || i}
                      className="group/item relative flex flex-col items-center text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-amber-100 shadow-2xs hover:border-amber-300 transition-all"
                    >
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl overflow-hidden mb-1.5 bg-amber-50/50">
                        <Image
                          src={item.image || '/products/superfood-mix.jpg'}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 60px, 90px"
                          className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                      <p className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight line-clamp-1 w-full">
                        {item.name.replace(/\s*\(\d+\s*GM\)/i, '')}
                      </p>
                      <p className="text-[10px] sm:text-xs text-amber-800 font-mono mt-0.5">
                        {item.weight || 'Full Pack'}
                      </p>

                      {/* Red plus connector between items */}
                      {i < 2 && (
                        <div className="flex absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-red-600 text-white items-center justify-center text-[9px] sm:text-[10px] font-black shadow-xs pointer-events-none">
                          +
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 py-0.5">
                {currentOffer.highlights.slice(0, 2).map((hl, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-ink/80 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span className="line-clamp-1">{hl}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Pricing & Action Row */}
              <div className="pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-extrabold text-2xl sm:text-3xl text-red-700">
                      Rs. {currentOffer.offerPrice.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm text-ink/40 line-through">
                      Rs. {currentOffer.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                      SAVE {currentOffer.discountPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 font-medium mt-0.5 flex items-center gap-1">
                    🎁 Free Festive Wrapping + Delivery
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleClaimCombo(currentOffer)}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border transition-all shadow-2xs active:scale-95 cursor-pointer ${
                      addedId === currentOffer.id
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-amber-400 text-amber-900 bg-amber-50 hover:bg-amber-100'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{addedId === currentOffer.id ? 'Added ✓' : 'Add'}</span>
                  </button>

                  <button
                    onClick={() => handleBuyNowCombo(currentOffer)}
                    className="inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
