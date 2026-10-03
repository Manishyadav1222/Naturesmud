'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Gift,
  ShoppingBag,
  CheckCircle2,
  Timer,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';

export interface FestivalComboItem {
  productId: string;
  name: string;
  weight: string;
  image: string;
  price: number;
}

export interface FestivalCombo {
  id: string;
  title: string;
  subtitle: string;
  festivalLabel: string;
  badge: string;
  categoryIcon: string;
  categoryLabel: string;
  discountPercentage: number;
  originalPrice: number;
  offerPrice: number;
  couponCode: string;
  tag: string;
  highlights: string[];
  items: FestivalComboItem[];
}

export const festivalCombos: FestivalCombo[] = [
  {
    id: 'festival-himalayan-celebration',
    title: 'Himalayan Festive Celebration Box',
    subtitle: 'Sun-Dried Apples, Raw Mountain Almonds & Dates Powder',
    festivalLabel: '🎉 Dashain & Tihar Festival Special',
    badge: '5% OFF · Sacred Gift Box',
    categoryIcon: '🎁',
    categoryLabel: 'Gift Box',
    discountPercentage: 5,
    originalPrice: 1660,
    offerPrice: 1577,
    couponCode: 'STORE5',
    tag: 'Best Festival Pick',
    items: [
      {
        productId: 'dehydrated-apple',
        name: 'Dehydrated Apple',
        weight: '100 GM',
        image: '/products/dehydrated-apple.jpg',
        price: 510,
      },
      {
        productId: 'raw-himalayan-almonds',
        name: 'Raw Mountain Almonds',
        weight: '200 GM',
        image: '/products/nm-almond-jar-v2.jpg',
        price: 750,
      },
      {
        productId: 'dates-powder',
        name: 'Dates Powder',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      },
    ],
    highlights: [
      '100% Preservative-Free Sacred Gifting',
      'Reusable Glass Jars + Free Festive Note',
      'Same-Day Delivery Inside Kathmandu Valley',
      'Naturally Dehydrated Himalayan Fruits',
    ],
  },
  {
    id: 'festival-superfood-launch',
    title: 'Himalayan Superfood Trio: Avocado, Strawberry & Almonds',
    subtitle: 'Freeze-Dried Avocado, Strawberry Powder & Crunchy Roasted Almonds',
    festivalLabel: '✨ Superfood Nutrition Trio · Festival Edition',
    badge: '10% OFF · Superfoods',
    categoryIcon: '🌟',
    categoryLabel: 'Superfoods',
    discountPercentage: 10,
    originalPrice: 2935,
    offerPrice: 2640,
    couponCode: 'SUPERFOOD10',
    tag: 'Festival Trending',
    items: [
      {
        productId: 'freeze-dried-avocado-powder',
        name: 'Avocado Powder',
        weight: '80 GM',
        image: '/products/avocado-powder-v2.jpg',
        price: 790,
      },
      {
        productId: 'strawberry-powder',
        name: 'Strawberry Powder',
        weight: '80 GM',
        image: '/products/strawberry-powder-v2.jpg',
        price: 1395,
      },
      {
        productId: 'roasted-almonds',
        name: 'Roasted Almonds',
        weight: '200 GM',
        image: '/products/roasted-almonds-v2.jpg',
        price: 750,
      },
    ],
    highlights: [
      'Freeze-Dried Avocado — 100% Nepal Origin',
      'Pure Strawberry Powder — Zero Added Sugar',
      'Crispy Roasted Mountain Almonds Rich in Vitamin E & Protein',
      'Premium Gift-Ready Foil Pouches & Glass Jars',
    ],
  },
  {
    id: 'festival-wellness-box',
    title: 'Maha Wellness & Immunity Festival Box',
    subtitle: 'Mix Dry Nuts, Roasted Almonds & Beetroot Powder',
    festivalLabel: '🧘 Total Health Festive Combo',
    badge: '5% OFF · Family Wellness',
    categoryIcon: '🧘',
    categoryLabel: 'Wellness',
    discountPercentage: 5,
    originalPrice: 1870,
    offerPrice: 1777,
    couponCode: 'STORE5',
    tag: 'Family Favourite',
    items: [
      {
        productId: 'superfood-trail-mix',
        name: 'Mix Dry Nuts',
        weight: '300 GM',
        image: '/products/superfood-mix.jpg',
        price: 690,
      },
      {
        productId: 'roasted-almonds',
        name: 'Roasted Almonds',
        weight: '200 GM',
        image: '/products/roasted-almonds-v2.jpg',
        price: 750,
      },
      {
        productId: 'beetroot-powder',
        name: 'Beetroot Powder',
        weight: '100 GM',
        image: '/products/beetroot-powder-100g.jpg',
        price: 430,
      },
    ],
    highlights: [
      'Full Mineral & Vitamin Spectrum Daily',
      'Blood Flow & Heart Health Support',
      'Handpicked Organic from Nepal Co-ops',
      'Perfect for Elders & Parents Festival Gift',
    ],
  },
  {
    id: 'festival-gym-pack',
    title: 'Festival Gym & Workout Muscle Pack',
    subtitle: 'Premium Cashews, Zinc Pumpkin Seeds & Chia Omega-3',
    festivalLabel: '🏋️ Festival Workout Combo',
    badge: '5% OFF · Athlete Special',
    categoryIcon: '💪',
    categoryLabel: 'Gym Pack',
    discountPercentage: 5,
    originalPrice: 1895,
    offerPrice: 1800,
    couponCode: 'STORE5',
    tag: "Athletes' Festival Pick",
    items: [
      {
        productId: 'premium-cashewnuts',
        name: 'Premium Cashews',
        weight: '200 GM',
        image: '/products/nm-cashew-new-jar.jpg',
        price: 750,
      },
      {
        productId: 'pumpkin-seeds',
        name: 'Raw Pumpkin Seeds',
        weight: '300 GM',
        image: '/products/pumpkin-seeds.jpg',
        price: 650,
      },
      {
        productId: 'chia-seeds',
        name: 'Chia Seeds',
        weight: '300 GM',
        image: '/products/chia-seeds.jpg',
        price: 495,
      },
    ],
    highlights: [
      'High Plant Protein & Zinc for Muscle Repair',
      'Plant Omega-3 to Reduce Joint Inflammation',
      'Clean Pre/Post-Workout Zero Sugar Nutrition',
      'Gift-Ready Festive Pack for the Gym Lover',
    ],
  },
];

export default function FestivalCombosSection() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const openDrawer = useCartStore((s) => s.openDrawer);

  // Countdown — ends at Tihar 2026 (Oct 20)
  const [timeLeft, setTimeLeft] = useState({ days: 21, hours: 8, minutes: 30, seconds: 0 });

  useEffect(() => {
    const endDate = new Date('2026-10-20T23:59:59');
    const tick = () => {
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) return;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-cycle
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % festivalCombos.length);
      setIsAdded(false);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentCombo = festivalCombos[activeIdx] || festivalCombos[0];

  const handleClaimCombo = () => {
    useCartStore.getState().addItem(
      {
        id: currentCombo.id,
        slug: currentCombo.items[0]?.productId || currentCombo.id,
        name: currentCombo.title,
        price: currentCombo.offerPrice,
        compareAtPrice: currentCombo.originalPrice,
        image: currentCombo.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Festival Gift Bundle',
        category: 'Festival Combos',
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
        id: currentCombo.id,
        slug: currentCombo.items[0]?.productId || currentCombo.id,
        name: currentCombo.title,
        price: currentCombo.offerPrice,
        compareAtPrice: currentCombo.originalPrice,
        image: currentCombo.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Festival Gift Bundle',
        category: 'Festival Combos',
      },
      1
    );
    useCartStore.getState().closeDrawer();
    router.push('/checkout');
  };

  const nextTab = () => setActiveIdx((prev) => (prev + 1) % festivalCombos.length);
  const prevTab = () => setActiveIdx((prev) => (prev - 1 + festivalCombos.length) % festivalCombos.length);

  return (
    <div
      className="w-full max-w-[580px] md:max-w-none relative group mt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Festive ambient glow — crimson + gold */}
      <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-600/25 via-amber-400/20 to-yellow-500/25 blur-lg opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

      {/* Main Festive Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E8] border border-amber-200/60 p-3.5 sm:p-5 shadow-sm overflow-hidden">

        {/* Subtle festive diagonal pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #B91C1C 0, #B91C1C 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}
        />

        {/* Top Auto-Cycle Progress Bar — crimson */}
        <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-red-100 overflow-hidden">
          <motion.div
            key={activeIdx}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: isHovered ? 0 : 4.5, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-red-600 to-amber-500"
          />
        </div>

        {/* Header Row: Festival Ribbon & Countdown */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-amber-200/60 pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600/10 via-amber-400/10 to-yellow-400/10 border border-red-300/40">
            <Sparkles className="w-3 h-3 text-red-600" />
            <span className="text-[11px] sm:text-xs font-bold text-red-800 font-heading truncate max-w-[150px] sm:max-w-none">
              {currentCombo.festivalLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev / Next */}
            <div className="flex items-center gap-1">
              <button onClick={prevTab} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors cursor-pointer" aria-label="Previous offer">
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button onClick={nextTab} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors cursor-pointer" aria-label="Next offer">
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-semibold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              <Timer className="w-3 h-3 text-red-600 animate-pulse" />
              <span className="font-bold">
                {timeLeft.days}d {String(timeLeft.hours).padStart(2,'0')}h:{String(timeLeft.minutes).padStart(2,'0')}m:{String(timeLeft.seconds).padStart(2,'0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Festival Category Tabs */}
        <div className="relative z-10 flex items-center gap-1 pt-2 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {festivalCombos.map((combo, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={combo.id}
                onClick={() => { setActiveIdx(idx); setIsAdded(false); }}
                className={`px-2 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1 cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-red-500 shadow-sm'
                    : 'bg-amber-50/80 hover:bg-amber-100 text-amber-900 border-transparent'
                }`}
              >
                <span>{combo.categoryIcon}</span>
                <span>{combo.categoryLabel}</span>
                <span className={`text-[9px] px-1 rounded-full font-extrabold ${isSelected ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'}`}>
                  -{combo.discountPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content */}
        <div className="relative min-h-[210px] sm:min-h-[260px] lg:min-h-[290px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCombo.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 pt-1 space-y-2.5 flex flex-col justify-between h-full"
            >
              {/* Title & Badge */}
              <div>
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600/15 to-amber-500/15 text-red-800 border border-red-200/60 font-heading text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">
                      {currentCombo.badge}
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">🪔 {currentCombo.tag}</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
                    🗓️ Oct 2–20, 2026
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-red-900 mt-1 leading-snug">
                  {currentCombo.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-800/70 mt-0.5 line-clamp-1">{currentCombo.subtitle}</p>
              </div>

              {/* Product Thumbnails */}
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200/50 shadow-sm">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {currentCombo.items.map((item, i) => (
                    <div
                      key={item.productId}
                      className="group/item relative flex flex-col items-center text-center p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white border border-amber-100 shadow-sm transition-all hover:border-amber-300"
                    >
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden mb-1 bg-amber-50">
                        <Image
                          src={item.image || '/products/superfood-mix.jpg'}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-red-900 leading-tight line-clamp-1">{item.name}</p>
                      <p className="text-[9px] text-amber-700 font-mono mt-0.5">{item.weight}</p>

                      {/* Plus connector */}
                      {i < currentCombo.items.length - 1 && (
                        <div className="flex absolute -right-2 sm:-right-2.5 top-1/2 -translate-y-1/2 z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-red-600 text-white items-center justify-center text-[8px] sm:text-[9px] font-black shadow-xs pointer-events-none">
                          +
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 py-0.5">
                {currentCombo.highlights.slice(0, 2).map((hl, i) => (
                  <div key={i} className="flex items-center gap-1 text-[11px] text-amber-900">
                    <CheckCircle2 className="w-3 h-3 text-red-600 shrink-0" />
                    <span className="line-clamp-1">{hl}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-red-700">
                      Rs. {currentCombo.offerPrice.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      Rs. {currentCombo.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-amber-700 font-medium">
                    🎁 Free Festive Wrapping + Delivery
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClaimCombo}
                    className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold bg-amber-50 hover:bg-amber-100 text-red-800 border border-amber-300 transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{isAdded ? 'Added! 🎉' : 'Add'}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-200" />
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