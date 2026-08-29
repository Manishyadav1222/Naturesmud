'use client';

import { useState, useEffect } from 'react';
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
  CheckCircle2,
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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
    if (isHovered || offers.length === 0) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % offers.length);
      setIsAdded(false);
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, offers.length]);

  const currentOffer = offers[activeIdx] || offers[0];

  // Ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return { days: 2, hours: 14, minutes: 42, seconds: 18 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClaimCombo = () => {
    useCartStore.getState().addItem(
      {
        id: currentOffer.id,
        slug: currentOffer.items[0]?.productId || currentOffer.id,
        name: currentOffer.title,
        price: currentOffer.offerPrice,
        compareAtPrice: currentOffer.originalPrice,
        image: currentOffer.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Care Pack Bundle',
        category: currentOffer.categoryLabel || 'Superfood Combo',
      },
      1
    );
    setIsAdded(true);
    openDrawer();
    setTimeout(() => setIsAdded(false), 2400);
  };

  const handleBuyNowCombo = () => {
    useCartStore.getState().addItem(
      {
        id: currentOffer.id,
        slug: currentOffer.items[0]?.productId || currentOffer.id,
        name: currentOffer.title,
        price: currentOffer.offerPrice,
        compareAtPrice: currentOffer.originalPrice,
        image: currentOffer.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Care Pack Bundle',
        category: currentOffer.categoryLabel || 'Superfood Combo',
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
      className="w-full max-w-[580px] relative group mt-0 overflow-hidden sm:overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Ambient decorative glow around offer card */}
      <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-r from-gold/30 via-primary/25 to-secondary/30 blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

      {/* Main Offer Card */}
      <div className="relative rounded-[2.2rem] bg-white border border-ink/8 p-5 sm:p-6 shadow-[0_15px_40px_rgba(58,107,53,0.08)] overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-gold/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl pointer-events-none" />

        {/* Top Auto-Cycle Subtle Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold/20 overflow-hidden">
          <motion.div
            key={activeIdx}
            initial={{ width: '0%' }}
            animate={{ width: isHovered ? '100%' : '100%' }}
            transition={{ duration: isHovered ? 0 : 4.5, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-gold-500 to-primary"
          />
        </div>

        {/* Top Header Row: Lifestyle Combo Ribbon & Live Timer */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-ink/8 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-gold/20 via-gold/15 to-primary/10 border border-gold/30 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-600 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-600" />
            </span>
            <span className="text-xs font-bold tracking-wide text-ink flex items-center gap-1.5 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              {currentOffer.festivalName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Next/Prev Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevTab}
                className="w-6 h-6 rounded-full bg-cream-100 hover:bg-cream-200 text-ink/70 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous offer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextTab}
                className="w-6 h-6 rounded-full bg-cream-100 hover:bg-cream-200 text-ink/70 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next offer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-primary-700 bg-primary/8 border border-primary/15 px-2.5 py-0.5 rounded-full">
              <Timer className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>Ends:</span>
              <span className="font-bold text-ink">
                {String(timeLeft.days).padStart(2, '0')}d :{' '}
                {String(timeLeft.hours).padStart(2, '0')}h :{' '}
                {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                <span className="text-gold-700">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </span>
            </div>
          </div>
        </div>

        {/* 5 Lifestyle Category Switcher Tabs */}
        <div className="relative z-10 flex items-center gap-1.5 pt-3 pb-2 overflow-x-auto no-scrollbar">
          {offers.map((offer, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={offer.id}
                onClick={() => {
                  setActiveIdx(idx);
                  setIsAdded(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-primary-700 text-white border-primary shadow-md shadow-primary/20 scale-[1.02]'
                    : 'bg-cream-100/70 hover:bg-cream-200 text-ink/70 hover:text-ink border-transparent'
                }`}
              >
                <span>{offer.categoryIcon || '🌿'}</span>
                <span>{offer.categoryLabel || offer.title.split(' ')[0]}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}
                >
                  -{offer.discountPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Offer Content Area with Fixed Min-Height to Prevent CLS / Scroll Jumping */}
        <div className="relative min-h-[385px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOffer.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 pt-2 space-y-3.5 flex flex-col justify-between h-full"
            >
            {/* Title & Tagline */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-gold/15 text-gold-800 font-heading text-[10px] font-extrabold uppercase tracking-wider">
                  {currentOffer.badge}
                </span>
                <span className="text-[11px] text-ink/50 font-medium">✨ {currentOffer.tag}</span>
              </div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-dark mt-1 leading-snug">
                {currentOffer.title}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{currentOffer.subtitle}</p>
            </div>

            {/* Multi-Product Thumbnail Stack */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-cream-50 via-white to-cream-50 border border-ink/8 shadow-inner">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink/50 mb-2 flex items-center justify-between">
                <span>Included in this Combo (3 Full Packs):</span>
                <span className="text-primary font-bold">100% Himalayan Whole Foods</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {currentOffer.items.map((item, i) => (
                  <div
                    key={item.productId}
                    className="group/item relative flex flex-col items-center text-center p-2 rounded-xl bg-white border border-ink/5 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden mb-1 shadow-xs bg-gray-50">
                      <Image
                        src={item.image || '/products/superfood-mix.jpg'}
                        alt={item.name}
                        fill
                        sizes="60px"
                        className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-dark leading-tight line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {item.weight && /^\d+(\.00)?$/.test(item.weight.trim()) ? `${parseFloat(item.weight)} GM` : item.weight}
                    </p>

                    {/* Plus connector between images */}
                    {i < currentOffer.items.length - 1 && (
                      <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-3.5 h-3.5 rounded-full bg-primary text-white items-center justify-center shadow text-[9px] font-bold">
                        +
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Combo Benefits Checklist */}
            <div className="grid sm:grid-cols-2 gap-1.5 py-0.5">
              {currentOffer.highlights.map((hl, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="line-clamp-1">{hl}</span>
                </div>
              ))}
            </div>

            {/* Pricing, Coupon & High-Conversion Action Button */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              {/* Prices */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-black text-2xl text-primary">
                    Rs. {currentOffer.offerPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through font-medium">
                    Rs. {currentOffer.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    SAVE {currentOffer.discountPercentage}%
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                  ✓ Free Delivery Across Nepal
                </p>
              </div>

              {/* 1-Click Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(currentOffer.couponCode)}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Click to copy voucher"
                >
                  {copiedCode === currentOffer.couponCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 text-[11px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-700" />
                      <span className="text-[11px]">Code: {currentOffer.couponCode}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleClaimCombo}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                      : 'bg-cream-200 hover:bg-cream-300 text-ink/90 border border-ink/10'
                  }`}
                  title="Add to cart and continue shopping"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isAdded ? 'Added ✓' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNowCombo}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-[0_4px_16px_rgba(58,107,53,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
                  title="Buy instantly and proceed to checkout"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
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
