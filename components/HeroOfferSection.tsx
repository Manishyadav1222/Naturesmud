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
  CheckCircle2,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';

export interface SpecializedComboItem {
  productId: string;
  name: string;
  weight: string;
  image: string;
  price: number;
}

export interface SpecializedCombo {
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
  items: [SpecializedComboItem, SpecializedComboItem, SpecializedComboItem]; // Strictly 3 products
}

export const specializedOffers: SpecializedCombo[] = [
  {
    id: 'combo-mountain-vitality-energy',
    title: 'Mountain Vitality & Athletic Energy Trio',
    subtitle: 'Pure Himalayan Shilajit, Raw Mountain Almonds & Black Chia Seeds',
    festivalLabel: '⚡ Peak Energy & Stamina',
    badge: '11% OFF · Peak Stamina',
    categoryIcon: '⚡',
    categoryLabel: 'Energy',
    discountPercentage: 11,
    originalPrice: 3240,
    offerPrice: 2890,
    couponCode: 'ENERGY11',
    tag: 'Athletes & Fitness',
    items: [
      {
        productId: 'pure-mountain-himalayan-shilajit-resin',
        name: 'Himalayan Shilajit',
        weight: '20 GM',
        image: '/products/shilajit.jpg',
        price: 1995,
      },
      {
        productId: 'raw-himalayan-almonds',
        name: 'Raw Almonds',
        weight: '200 GM',
        image: '/products/nm-almond-jar-v2.jpg',
        price: 750,
      },
      {
        productId: 'chia-seeds',
        name: 'Black Chia Seeds',
        weight: '300 GM',
        image: '/products/chia-seeds.jpg',
        price: 495,
      },
    ],
    highlights: [
      '84+ ionic minerals & 75% Fulvic Acid for ATP cellular stamina',
      'Cold-cleaned raw mountain almonds for rapid muscle recovery',
      'Hydrophilic plant Omega-3 ALA for long-lasting hydration',
      '100% natural, unadulterated Himalayan high-altitude harvest',
    ],
  },
  {
    id: 'combo-himalayan-skin-hair-beauty',
    title: 'Himalayan Glow, Hair & Skin Beauty Trio',
    subtitle: 'Zinc-Rich Pumpkin Seeds, Virgin Coconut Oil & Strawberry Powder',
    festivalLabel: '✨ Natural Radiance & Glow',
    badge: '10% OFF · Pure Beauty',
    categoryIcon: '✨',
    categoryLabel: 'Beauty',
    discountPercentage: 10,
    originalPrice: 2695,
    offerPrice: 2425,
    couponCode: 'BEAUTY10',
    tag: 'Collagen & Hair Care',
    items: [
      {
        productId: 'pumpkin-seeds',
        name: 'Raw Pumpkin Seeds',
        weight: '300 GM',
        image: '/products/pumpkin-seeds.jpg',
        price: 650,
      },
      {
        productId: 'virgin-coconut-oil-180ml',
        name: 'Extra Virgin Coconut Oil',
        weight: '180 GM',
        image: '/products/coconut-oil.jpg',
        price: 650,
      },
      {
        productId: 'strawberry-powder',
        name: 'Strawberry Powder',
        weight: '80 GM',
        image: '/products/strawberry-powder-v2.jpg',
        price: 1395,
      },
    ],
    highlights: [
      'Natural bioavailable Zinc & Magnesium for lustrous hair & strong nails',
      'Centrifuged cold-pressed Lauric acid for deep scalp & skin hydration',
      'Potent fruit Vitamin C antioxidants for natural collagen synthesis',
      'Zero artificial chemicals, parabens, preservatives, or added sugar',
    ],
  },
  {
    id: 'combo-cognitive-brain-memory',
    title: 'Cognitive Memory & Sharp Focus Trio',
    subtitle: 'Roasted Pistachios, Roasted Himalayan Cashews & Wild Blueberries',
    festivalLabel: '🧠 Mental Clarity & Focus',
    badge: '10% OFF · Brain Food',
    categoryIcon: '🧠',
    categoryLabel: 'Memory',
    discountPercentage: 10,
    originalPrice: 2280,
    offerPrice: 2052,
    couponCode: 'FOCUS10',
    tag: 'Focus & Brain Shield',
    items: [
      {
        productId: 'premium-pistachios',
        name: 'Roasted Pistachios',
        weight: '200 GM',
        image: '/products/pistachios.jpg',
        price: 880,
      },
      {
        productId: 'roasted-cashewnuts',
        name: 'Roasted Cashews',
        weight: '150 GM',
        image: '/products/nm-roasted-cashew-new.jpg',
        price: 750,
      },
      {
        productId: 'dried-blueberries',
        name: 'Dried Blueberries',
        weight: '100 GM',
        image: '/products/dried-blueberries-100g.jpg',
        price: 650,
      },
    ],
    highlights: [
      'High in Vitamin B6, Lutein & neuroprotective antioxidants',
      'Dry-roasted whole cashews rich in copper & healthy mono-fats',
      'Wild alpine blueberries packed with memory-supporting anthocyanins',
      'Pure, crisp brain food packed in airtight reusable glass jars',
    ],
  },
  {
    id: 'combo-ayurvedic-digestion-gut',
    title: 'Ayurvedic Digestion & Gut Health Trio',
    subtitle: 'Dehydrated Papaya, Bire Noon Black Salt & Himalayan Pink Salt',
    festivalLabel: '🌿 Gut Cleanse & Digestion',
    badge: '10% OFF · Ayurvedic Tonic',
    categoryIcon: '🌿',
    categoryLabel: 'Gut Health',
    discountPercentage: 10,
    originalPrice: 865,
    offerPrice: 780,
    couponCode: 'GUTHEALTH10',
    tag: 'Metabolism & Hydration',
    items: [
      {
        productId: 'dehydrated-papaya',
        name: 'Dehydrated Papaya',
        weight: '90 GM',
        image: '/products/nm-papaya-flat.jpeg',
        price: 395,
      },
      {
        productId: 'pure-himalayan-black-salt-bire-noon',
        name: 'Bire Noon Black Salt',
        weight: '200 GM',
        image: '/products/black-salt.jpg',
        price: 220,
      },
      {
        productId: 'himalayan-pink-salt',
        name: 'Fine Pink Salt',
        weight: '200 GM',
        image: '/products/pink-salt.jpg',
        price: 250,
      },
    ],
    highlights: [
      'Active papain enzymes to smoothly break down heavy festive meals',
      'Ayurvedic volcanic rock salt (Kala Namak) to kindle digestive Agni',
      '84+ ionic trace minerals for cellular electrolyte hydration & pH balance',
      '100% unbleached, chemical-free mineral rock salts in glass jars',
    ],
  },
  {
    id: 'combo-metabolic-sugar-detox',
    title: 'Metabolic Cleanse & Sugar Detox Trio',
    subtitle: 'Pure Dates Powder, Organic Moringa Leaf Powder & Roasted Makhana',
    festivalLabel: '🥗 Metabolic Cleanse & Snacks',
    badge: '11% OFF · Sugar Detox',
    categoryIcon: '🥗',
    categoryLabel: 'Detox',
    discountPercentage: 11,
    originalPrice: 1480,
    offerPrice: 1320,
    couponCode: 'DETOX11',
    tag: 'Diabetic-Friendly & Guilt-Free',
    items: [
      {
        productId: 'dates-powder',
        name: 'Pure Dates Powder',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      },
      {
        productId: 'moringa-leaf-powder',
        name: 'Moringa Leaf Powder',
        weight: '100 GM',
        image: '/products/moringa-leaf-powder.jpg',
        price: 690,
      },
      {
        productId: 'makhana-fox-nuts',
        name: 'Roasted Makhana',
        weight: '50 GM',
        image: '/products/nm-makhana-jar.jpeg',
        price: 390,
      },
    ],
    highlights: [
      'Low-glycemic whole-food fruit sweetener — perfect sugar alternative',
      '90+ natural nutrients & 46 antioxidants in shade-dried moringa',
      'Light, crunchy popped water lily seeds with zero trans-fats',
      'Supports steady blood glucose balance & natural liver detoxification',
    ],
  },
];

export default function HeroOfferSection() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const openDrawer = useCartStore((s) => s.openDrawer);

  // Time remaining state
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 36,
    seconds: 45,
  });

  // Auto-cycle through offer tabs every 4.5s unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % specializedOffers.length);
      setIsAdded(false);
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered]);

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

  const currentOffer = specializedOffers[activeIdx] || specializedOffers[0];

  const handleClaimOffer = () => {
    useCartStore.getState().addItem(
      {
        id: currentOffer.id,
        slug: currentOffer.items[0]?.productId || currentOffer.id,
        name: currentOffer.title,
        price: currentOffer.offerPrice,
        compareAtPrice: currentOffer.originalPrice,
        image: currentOffer.items[0]?.image || '/products/superfood-mix.jpg',
        weight: '3-Product Combo Box',
        category: 'Specialized Combos',
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
        weight: '3-Product Combo Box',
        category: 'Specialized Combos',
      },
      1
    );
    useCartStore.getState().closeDrawer();
    router.push('/checkout');
  };

  const nextTab = () => {
    setActiveIdx((prev) => (prev + 1) % specializedOffers.length);
    setIsAdded(false);
  };

  const prevTab = () => {
    setActiveIdx((prev) => (prev - 1 + specializedOffers.length) % specializedOffers.length);
    setIsAdded(false);
  };

  return (
    <div
      className="w-full max-w-[580px] md:max-w-none relative group mt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Festive ambient glow — crimson + gold matching left side */}
      <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-600/25 via-amber-400/20 to-yellow-500/25 blur-lg opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

      {/* Main Festive Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF3E8] border border-amber-200/60 p-3.5 sm:p-5 shadow-sm overflow-hidden">
        {/* Subtle festive diagonal pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #B91C1C 0, #B91C1C 1px, transparent 0, transparent 50%)',
            backgroundSize: '10px 10px',
          }}
        />

        {/* Top Auto-Cycle Progress Bar — crimson to amber */}
        <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-red-100 overflow-hidden">
          <motion.div
            key={activeIdx}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: isHovered ? 0 : 4.5, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-red-600 to-amber-500"
          />
        </div>

        {/* Header Row: Category Ribbon & Countdown */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-amber-200/60 pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600/10 via-amber-400/10 to-yellow-400/10 border border-red-300/40">
            <Sparkles className="w-3 h-3 text-red-600" />
            <span className="text-[11px] sm:text-xs font-bold text-red-800 font-heading truncate max-w-[150px] sm:max-w-none">
              {currentOffer.festivalLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev / Next controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevTab}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous offer"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={nextTab}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next offer"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-semibold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              <Timer className="w-3 h-3 text-red-600 animate-pulse" />
              <span className="font-bold">
                {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h:
                {String(timeLeft.minutes).padStart(2, '0')}m:
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* 5 Specialized Category Tabs */}
        <div className="relative z-10 flex items-center gap-1 pt-2 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {specializedOffers.map((offer, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={offer.id}
                onClick={() => {
                  setActiveIdx(idx);
                  setIsAdded(false);
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1 cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-red-500 shadow-sm'
                    : 'bg-amber-50/80 hover:bg-amber-100 text-amber-900 border-transparent'
                }`}
              >
                <span>{offer.categoryIcon}</span>
                <span>{offer.categoryLabel}</span>
                <span
                  className={`text-[9px] px-1 rounded-full font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                  }`}
                >
                  -{offer.discountPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Area */}
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
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-900 font-heading text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider border border-amber-300">
                      {currentOffer.badge}
                    </span>
                    <span className="text-[10px] text-amber-800/80 font-medium">
                      🎯 {currentOffer.tag}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
                    🗓️ Oct 2–20, 2026
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-red-900 mt-1 leading-snug">
                  {currentOffer.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-800/70 mt-0.5 line-clamp-1">
                  {currentOffer.subtitle}
                </p>
              </div>

              {/* Multi-Product 3-Thumbnail Stack */}
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200/50 shadow-sm">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {currentOffer.items.map((item, i) => (
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
                      <p className="text-[10px] sm:text-[11px] font-bold text-red-900 leading-tight line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-amber-700 font-mono mt-0.5">{item.weight}</p>

                      {/* Plus connector between images */}
                      {i < currentOffer.items.length - 1 && (
                        <div className="flex absolute -right-2 sm:-right-2.5 top-1/2 -translate-y-1/2 z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-red-600 text-white items-center justify-center text-[8px] sm:text-[9px] font-black shadow-xs pointer-events-none">
                          +
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 py-0.5">
                {currentOffer.highlights.slice(0, 2).map((hl, i) => (
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
                      Rs. {currentOffer.offerPrice.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      Rs. {currentOffer.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-amber-700 font-medium">
                    🎁 Free Festive Wrapping + Delivery
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClaimOffer}
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
