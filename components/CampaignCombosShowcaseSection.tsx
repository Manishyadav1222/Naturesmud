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

        {/* Interactive Bundle Highlight Card */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-white border border-ink/8 p-4 sm:p-6 lg:p-8 shadow-sm relative overflow-hidden group min-h-[auto] flex flex-col justify-between"
        >
          {/* Top Auto-Cycle Progress Indicator */}
          <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-primary/10 overflow-hidden">
            <motion.div
              key={activeId}
              initial={{ width: '0%' }}
              animate={{ width: isHovered ? '100%' : '100%' }}
              transition={{ duration: isHovered ? 0 : 5, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-primary via-gold to-primary"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentOffer.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full"
            >
              <div className="grid md:grid-cols-12 gap-5 md:gap-6 lg:gap-8 items-center">
                {/* Left Column: Offer Details & Benefits */}
                <div className="md:col-span-7 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold-900 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide border border-gold/40">
                      {currentOffer.badge}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {currentOffer.festivalName}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-extrabold text-lg sm:text-2xl lg:text-3xl text-ink leading-tight">
                      {currentOffer.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/70 mt-1 leading-relaxed">
                      {currentOffer.subtitle}
                    </p>
                  </div>

                  {/* Highlights (Compact on mobile) */}
                  <div className="grid sm:grid-cols-2 gap-1.5 pt-1">
                    {currentOffer.highlights.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-ink/80 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5 text-xs text-ink/80 font-medium">
                      <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Free Delivery Across Nepal</span>
                    </div>
                  </div>

                  {/* Pricing & Action Row */}
                  <div className="pt-3 border-t border-ink/8 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-primary">
                          Rs. {currentOffer.offerPrice.toLocaleString()}
                        </span>
                        <span className="text-xs sm:text-sm text-ink/40 line-through">
                          Rs. {currentOffer.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          SAVE {currentOffer.discountPercentage}%
                        </span>
                      </div>
                      <p className="text-[10px] text-ink/50 font-medium mt-0.5">100% Pure Himalayan Whole Foods</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleClaimCombo(currentOffer)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
                          addedId === currentOffer.id
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-cream-100 hover:bg-cream-200 text-ink/90 border border-ink/10'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{addedId === currentOffer.id ? 'Added ✓' : 'Add to Cart'}</span>
                      </button>

                      <button
                        onClick={() => handleBuyNowCombo(currentOffer)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                        <span>Buy Bundle Now</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: 3-Product Stack */}
                <div className="md:col-span-5 bg-gradient-to-br from-cream-50 via-white to-cream-100/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-ink/8 shadow-inner">
                  <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-ink/50 mb-2 flex items-center justify-between">
                    <span>Included in Bundle ({currentOffer.items.length} Full Packs):</span>
                    <span className="text-primary font-bold">100% Himalayan</span>
                  </p>

                  <div className="space-y-2">
                    {currentOffer.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-white border border-ink/6 shadow-2xs hover:shadow-xs transition-all"
                      >
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                          <Image
                            src={item.image || '/products/superfood-mix.jpg'}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-ink truncate">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-ink/50 font-mono mt-0.2">
                            {item.weight && /^\d+(\.00)?$/.test(item.weight.trim()) ? `${parseFloat(item.weight)} GM` : item.weight}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-ink">Rs. {item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
