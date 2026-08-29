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
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Flame,
  Truck,
  Gift,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { initialFestivalOffers, FestivalOffer } from '@/lib/data/offers';
import { useCartStore } from '@/lib/store/cart-store';

export default function CampaignCombosShowcaseSection() {
  const router = useRouter();
  const [offers, setOffers] = useState<FestivalOffer[]>(initialFestivalOffers);
  const [activeId, setActiveId] = useState(initialFestivalOffers[0].id);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-cream-50 via-white to-cream-50">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(58,107,53,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(217,164,65,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="container-nm relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-number block tracking-widest text-primary-600 text-xs font-bold uppercase mb-2">
              04 — Special Campaigns & Combos
            </span>
            <div className="flex items-center gap-3">
              <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-ink">
                Himalayan Superfood Bundles
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold-800 text-xs font-bold font-heading border border-gold/30">
                <Flame className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
                Up to 35% OFF
              </span>
            </div>
            <p className="section-subtitle text-ink/70 text-base sm:text-lg max-w-2xl mt-3 leading-relaxed">
              Curated daily wellness packs for fitness recovery, morning cleansing, total immunity, and festive celebrations.
            </p>
          </div>

          {/* Live countdown timer badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-soft border border-ink/8 shrink-0">
            <Timer className="w-4 h-4 text-primary animate-pulse" />
            <div className="text-xs font-mono">
              <span className="text-ink/60 mr-1.5">Flash Deals End:</span>
              <span className="font-bold text-ink">
                {String(timeLeft.days).padStart(2, '0')}d :{' '}
                {String(timeLeft.hours).padStart(2, '0')}h :{' '}
                {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                <span className="text-primary font-black">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </span>
            </div>
          </div>
        </div>

        {/* Category & Campaign Tabs with auto-scroll ticker */}
        <div className="flex items-center gap-2 pb-6 overflow-x-auto no-scrollbar w-full max-w-full">
          {offers.map((offer) => {
            const isSelected = offer.id === currentOffer.id;
            return (
              <button
                key={offer.id}
                onClick={() => setActiveId(offer.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-primary-700 text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-white hover:bg-cream-100 text-ink/80 hover:text-ink border-ink/10 shadow-xs'
                }`}
              >
                <span>{offer.categoryIcon || '🌿'}</span>
                <span>{offer.categoryLabel || offer.title}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
                  }`}
                >
                  SAVE {offer.discountPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive 3D Bundle Highlight Card */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="rounded-[2.5rem] bg-white border border-ink/8 p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(43,43,43,0.08)] relative overflow-hidden group min-h-[460px] flex flex-col justify-between"
        >
          {/* Top Auto-Cycle Progress Indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/10 overflow-hidden">
            <motion.div
              key={activeId}
              initial={{ width: '0%' }}
              animate={{ width: isHovered ? '100%' : '100%' }}
              transition={{ duration: isHovered ? 0 : 5, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-primary via-gold to-primary"
            />
          </div>

          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-gold/15 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentOffer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full"
            >
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Offer Details & Benefits */}
                <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-gold/20 text-gold-900 text-xs font-extrabold uppercase tracking-wide border border-gold/40">
                    {currentOffer.badge}
                  </span>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {currentOffer.festivalName}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight">
                    {currentOffer.title}
                  </h3>
                  <p className="text-sm sm:text-base text-ink/70 mt-2 leading-relaxed">
                    {currentOffer.subtitle}
                  </p>
                </div>

                {/* Highlights */}
                <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
                  {currentOffer.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-ink/80 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-ink/80 font-medium">
                    <Truck className="w-4 h-4 text-primary shrink-0" />
                    <span>Free Doorstep Delivery Across Nepal</span>
                  </div>
                </div>

                {/* Pricing & Voucher Row */}
                <div className="pt-4 border-t border-ink/8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading font-black text-3xl sm:text-4xl text-primary">
                        Rs. {currentOffer.offerPrice.toLocaleString()}
                      </span>
                      <span className="text-base sm:text-lg text-ink/40 line-through font-medium">
                        Rs. {currentOffer.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                        SAVE {currentOffer.discountPercentage}%
                      </span>
                    </div>
                    <p className="text-xs text-ink/50 font-medium mt-1">100% Pure Himalayan Whole Foods</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => handleCopyCode(currentOffer.couponCode)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-full text-xs sm:text-sm font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {copiedCode === currentOffer.couponCode ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-amber-700" />
                          <span>Code: {currentOffer.couponCode}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleClaimCombo(currentOffer)}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer ${
                        addedId === currentOffer.id
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                          : 'bg-cream-200 hover:bg-cream-300 text-ink/90 border border-ink/10'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{addedId === currentOffer.id ? 'Added ✓' : 'Add to Cart'}</span>
                    </button>

                    <button
                      onClick={() => handleBuyNowCombo(currentOffer)}
                      className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-[0_4px_16px_rgba(58,107,53,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Buy Bundle Now</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: 3-Product Interactive Visual Stack */}
              <div className="lg:col-span-5 bg-gradient-to-br from-cream-50 via-white to-cream-100/80 rounded-3xl p-5 sm:p-6 border border-ink/8 shadow-inner">
                <p className="text-xs font-black uppercase tracking-wider text-ink/50 mb-3 flex items-center justify-between">
                  <span>Included Products ({currentOffer.items.length} Full Packs):</span>
                  <span className="text-primary font-bold">100% Himalayan</span>
                </p>

                <div className="space-y-3">
                  {currentOffer.items.map((item, idx) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-ink/6 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-300 group/card"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 shadow-xs">
                        <Image
                          src={item.image || '/products/superfood-mix.jpg'}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-sm text-ink truncate group-hover/card:text-primary transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-ink/50 font-mono mt-0.5">
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
