'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Timer,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { initialFestivalOffers, FestivalOffer } from '@/lib/data/offers';
import { useCartStore } from '@/lib/store/cart-store';

export default function HeroOfferSection() {
  const router = useRouter();
  const [offers, setOffers] = useState<FestivalOffer[]>(initialFestivalOffers);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const openDrawer = useCartStore((s) => s.openDrawer);

  // Time remaining state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 18,
  });

  // Try to load any dynamic active offers from admin/backend
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
        // Fallback to initialFestivalOffers
      }
    }
    fetchAdminOffers();
  }, []);

  // Auto-cycle through offer tabs every 4.5s unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % offers.length);
      setIsAdded(false);
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, offers.length]);

  // Live countdown timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentOffer = offers[activeIdx] || initialFestivalOffers[0];

  const handleClaimOffer = () => {
    useCartStore.getState().addItem(
      {
        id: currentOffer.id,
        slug: currentOffer.items[0]?.productId || currentOffer.id,
        name: currentOffer.title,
        price: currentOffer.offerPrice,
        compareAtPrice: currentOffer.originalPrice,
        image: currentOffer.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Combo Bundle',
        category: 'Festive Combos',
      },
      1
    );
    setIsAdded(true);
    openDrawer();
    setTimeout(() => setIsAdded(false), 2400);
  };

  const handleBuyNow = () => {
    useCartStore.getState().addItem(
      {
        id: currentOffer.id,
        slug: currentOffer.items[0]?.productId || currentOffer.id,
        name: currentOffer.title,
        price: currentOffer.offerPrice,
        compareAtPrice: currentOffer.originalPrice,
        image: currentOffer.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Combo Bundle',
        category: 'Festive Combos',
      },
      1
    );
    useCartStore.getState().closeDrawer();
    router.push('/checkout');
  };

  const nextTab = () => {
    setActiveIdx((prev) => (prev + 1) % offers.length);
  };

  const prevTab = () => {
    setActiveIdx((prev) => (prev - 1 + offers.length) % offers.length);
  };

  return (
    <div
      className="w-full max-w-[580px] relative group mt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Ambient decorative glow */}
      <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-gold/20 via-primary/15 to-secondary/20 blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />

      {/* Main Offer Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-ink/8 p-3.5 sm:p-5 shadow-sm overflow-hidden">
        {/* Top Auto-Cycle Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gold/20 overflow-hidden">
          <motion.div
            key={activeIdx}
            initial={{ width: '0%' }}
            animate={{ width: isHovered ? '100%' : '100%' }}
            transition={{ duration: isHovered ? 0 : 4.5, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-gold-500 to-primary"
          />
        </div>

        {/* Top Header Row: Lifestyle Combo Ribbon & Live Timer */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-ink/8 pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-gold/15 via-gold/10 to-primary/10 border border-gold/30">
            <Sparkles className="w-3 h-3 text-gold-600" />
            <span className="text-[11px] sm:text-xs font-bold text-ink font-heading">
              {currentOffer.festivalName}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Next/Prev Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevTab}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cream-100 hover:bg-cream-200 text-ink/70 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous offer"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={nextTab}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cream-100 hover:bg-cream-200 text-ink/70 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next offer"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Countdown Clock (Compact on mobile) */}
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-semibold text-primary-700 bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-full">
              <Timer className="w-3 h-3 text-primary animate-pulse" />
              <span className="font-bold text-ink">
                {String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:{String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* 5 Lifestyle Category Switcher Tabs */}
        <div className="relative z-10 flex items-center gap-1 pt-2 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {offers.map((offer, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={offer.id}
                onClick={() => {
                  setActiveIdx(idx);
                  setIsAdded(false);
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-primary-700 text-white border-primary shadow-2xs'
                    : 'bg-cream-100/70 hover:bg-cream-200 text-ink/70 border-transparent'
                }`}
              >
                <span>{offer.categoryIcon || '🌿'}</span>
                <span>{offer.categoryLabel || offer.title.split(' ')[0]}</span>
                <span
                  className={`text-[9px] px-1 py-0.1 rounded-full font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}
                >
                  -{offer.discountPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Offer Content Area with Compact Min-Height */}
        <div className="relative min-h-[210px] sm:min-h-[260px] lg:min-h-[290px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOffer.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 pt-1 space-y-2.5 flex flex-col justify-between h-full"
            >
              {/* Title & Tagline */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.2 rounded-md bg-gold/15 text-gold-800 font-heading text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">
                    {currentOffer.badge}
                  </span>
                  <span className="text-[10px] text-ink/50 font-medium">✨ {currentOffer.tag}</span>
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-dark mt-1 leading-snug">
                  {currentOffer.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5 line-clamp-1">{currentOffer.subtitle}</p>
              </div>

              {/* Multi-Product Thumbnail Stack (Compact) */}
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cream-50 via-white to-cream-50 border border-ink/8 shadow-2xs">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {currentOffer.items.map((item, i) => (
                    <div
                      key={item.productId}
                      className="group/item relative flex flex-col items-center text-center p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white border border-ink/5 shadow-2xs transition-all"
                    >
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden mb-1 bg-gray-50">
                        <Image
                          src={item.image || '/products/superfood-mix.jpg'}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-dark leading-tight line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-gray-500 font-mono mt-0.2">
                        {item.weight && /^\d+(\.00)?$/.test(item.weight.trim()) ? `${parseFloat(item.weight)} GM` : item.weight}
                      </p>

                      {/* Plus connector between images */}
                      {i < currentOffer.items.length - 1 && (
                        <div className="hidden sm:flex absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 w-3 h-3 rounded-full bg-primary text-white items-center justify-center text-[8px] font-bold">
                          +
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Combo Benefits Checklist (Visible on tablet/desktop) */}
              <div className="hidden sm:grid grid-cols-2 gap-1 py-0.5">
                {currentOffer.highlights.slice(0, 2).map((hl, i) => (
                  <div key={i} className="flex items-center gap-1 text-[11px] text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="line-clamp-1">{hl}</span>
                  </div>
                ))}
              </div>

              {/* Pricing & Action Buttons */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-primary">
                      Rs. {currentOffer.offerPrice.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      Rs. {currentOffer.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
                    ✓ Free Delivery in Nepal
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClaimOffer}
                    className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold bg-cream-100 hover:bg-cream-200 text-ink border border-ink/10 transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{isAdded ? 'Added!' : 'Add'}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold bg-primary hover:bg-primary-700 text-white transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
