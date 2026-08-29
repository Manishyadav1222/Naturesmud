'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Baby,
  ShoppingBag,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';

export interface BabyMotherProductItem {
  productId: string;
  name: string;
  weight: string;
  image: string;
  price: number;
}

export interface BabyMotherCombo {
  id: string;
  title: string;
  subtitle: string;
  stageName: string;
  badge: string;
  categoryIcon: string;
  categoryLabel: string;
  discountPercentage: number;
  originalPrice: number;
  offerPrice: number;
  couponCode: string;
  tag: string;
  highlights: string[];
  items: BabyMotherProductItem[];
  doctorGuarantee: string;
}

export const babyMotherCombos: BabyMotherCombo[] = [
  {
    id: 'combo-baby-solids',
    title: 'Little Explorer First Solids Superfood Kit',
    subtitle: 'Organic Sweet Potato Powder, Carrot Powder & Pure Date Sweetener',
    stageName: '🍼 6–24m First Solids Care',
    badge: '22% OFF · Pediatrician Approved',
    categoryIcon: '🍼',
    categoryLabel: '6-24m Solids',
    discountPercentage: 22,
    originalPrice: 1350,
    offerPrice: 1050,
    couponCode: 'BABYFIRST10',
    tag: 'Gentle on Little Tumtum',
    doctorGuarantee: 'Zero added refined sugar, salt, or preservatives. Micro-pulverized for gentle infant swallowing.',
    items: [
      {
        productId: '25',
        name: 'Organic Sweet Potato Powder',
        weight: '100g',
        image: '/products/sweet-potato-powder-100g.jpg',
        price: 510,
      },
      {
        productId: '24',
        name: 'Organic Carrot Powder',
        weight: '100g',
        image: '/products/carrot-powder.jpg',
        price: 490,
      },
      {
        productId: '8',
        name: 'Natural Dates Powder Sweetener',
        weight: '100g',
        image: '/products/dates-powder-100g.jpg',
        price: 350,
      },
    ],
    highlights: [
      'High Beta-Carotene for Infant Eyesight Growth',
      'Gentle Hypoallergenic Carbohydrates for First Weaning',
      '100% Sugar-Free & Preservative-Free',
      'Micro-Pulverized for Easy Swallowing',
    ],
  },
  {
    id: 'combo-pregnancy-nourish',
    title: 'Motherhood Pregnancy Complete Nourishment Box',
    subtitle: 'High-Iron Sun-Dried Figs, Chia Seeds & Mountain Almonds',
    stageName: '🤰 Pregnancy Trimesters 1, 2 & 3',
    badge: '20% OFF · Gynecologist Pick',
    categoryIcon: '🤰',
    categoryLabel: 'Pregnancy',
    discountPercentage: 20,
    originalPrice: 1935,
    offerPrice: 1548,
    couponCode: 'MOMCARE10',
    tag: 'Folate & Iron Rich',
    doctorGuarantee: 'Natural whole food nutrition packed with organic folates, iron, magnesium, and essential fatty acids.',
    items: [
      {
        productId: '16',
        name: 'Premium Whole Dried Figs (Anjeer)',
        weight: '200g',
        image: '/products/dates-powder-product-shot.jpg',
        price: 690,
      },
      {
        productId: '12',
        name: 'Premium Black Chia Seeds',
        weight: '300g',
        image: '/products/chia-seeds.jpg',
        price: 495,
      },
      {
        productId: '18',
        name: 'Raw Himalayan Mountain Almonds',
        weight: '200g',
        image: '/products/almonds.jpg',
        price: 750,
      },
    ],
    highlights: [
      'Natural Plant-Based Folate & Organic Iron',
      'Helps Prevent Morning Sickness & Fatigue',
      'Strengthens Fetal Brain & Neural Spine',
      'Gentle on Maternal Digestion',
    ],
  },
  {
    id: 'combo-postpartum-recovery',
    title: 'Sutkeri Postpartum Recovery & Lactation Support Pack',
    subtitle: 'Virgin Coconut Oil, Roasted Almonds & Dates Powder',
    stageName: '🤱 Sutkeri Postpartum Recovery',
    badge: '25% OFF · Traditional Sutkeri Care',
    categoryIcon: '🤱',
    categoryLabel: 'Postpartum',
    discountPercentage: 25,
    originalPrice: 1750,
    offerPrice: 1310,
    couponCode: 'SUTKERI15',
    tag: 'Boosts Breastmilk Supply',
    doctorGuarantee: 'Time-tested Himalayan lactation galactagogues. Restores maternal core strength, pelvic tone, and hormonal balance.',
    items: [
      {
        productId: '23',
        name: 'Cold-Pressed Extra Virgin Coconut Oil',
        weight: '180ml',
        image: '/products/coconut-oil-product.jpg',
        price: 650,
      },
      {
        productId: '17',
        name: 'Premium Roasted Himalayan Almonds',
        weight: '100g',
        image: '/products/almonds-2.jpg',
        price: 750,
      },
      {
        productId: '8',
        name: 'Natural Dates Powder Sweetener',
        weight: '100g',
        image: '/products/dates-powder-100g.jpg',
        price: 350,
      },
    ],
    highlights: [
      'Natural Lauric Acid for Breastmilk Immunity',
      'Fast-Tracks Postpartum Uterine Recovery',
      'High Omega-3 Fatty Acids for Baby Brain DHA',
      'Restores Maternal Bone Calcium & Stamina',
    ],
  },
  {
    id: 'combo-kids-crunch',
    title: 'Super-Kids Brain & Immunity Crunch Box',
    subtitle: 'Superfood Mix Dry Nuts, Raw Pumpkin Seeds & Whole Cranberries',
    stageName: '🧒 Toddlers & Kids (2+ Years)',
    badge: '21% OFF · School Snack',
    categoryIcon: '🧒',
    categoryLabel: 'Toddler 2y+',
    discountPercentage: 21,
    originalPrice: 1755,
    offerPrice: 1380,
    couponCode: 'KIDCRUNCH10',
    tag: '100% Oil-Free Healthy Snack',
    doctorGuarantee: '100% oil-free dry snacking. Replaces junk chips and biscuits with nutrient-dense mountain superfoods.',
    items: [
      {
        productId: '20',
        name: 'Himalayan Superfood Mix Dry Nuts',
        weight: '300g',
        image: '/products/superfood-mix.jpg',
        price: 690,
      },
      {
        productId: '13',
        name: 'Organic Himalayan Pumpkin Seeds',
        weight: '300g',
        image: '/products/pumpkin-seeds.jpg',
        price: 650,
      },
      {
        productId: '7',
        name: 'Whole Dried Cranberries',
        weight: '100g',
        image: '/products/cranberries.jpg',
        price: 415,
      },
    ],
    highlights: [
      'High Calcium & Protein Crunchy Snack',
      'Zinc & Magnesium for Restful Sleep & Growth',
      'Antioxidants for Active Seasonal Immunity',
      'Kid-Approved Natural Crunch & Taste',
    ],
  },
];

export default function BabyMotherCombosSection() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentCombo = babyMotherCombos[activeIdx] || babyMotherCombos[0];

  // Auto-cycle through combo tabs every 4s unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % babyMotherCombos.length);
      setIsAdded(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);


  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClaimCombo = () => {
    useCartStore.getState().addItem(
      {
        id: currentCombo.id,
        slug: currentCombo.items[0]?.productId || currentCombo.id,
        name: currentCombo.title,
        price: currentCombo.offerPrice,
        compareAtPrice: currentCombo.originalPrice,
        image: currentCombo.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Care Pack Bundle',
        category: 'Baby & Mother Care',
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
        id: currentCombo.id,
        slug: currentCombo.items[0]?.productId || currentCombo.id,
        name: currentCombo.title,
        price: currentCombo.offerPrice,
        compareAtPrice: currentCombo.originalPrice,
        image: currentCombo.items[0]?.image || '/products/superfood-mix.jpg',
        weight: 'Care Pack Bundle',
        category: 'Baby & Mother Care',
      },
      1
    );
    useCartStore.getState().closeDrawer();
    router.push('/checkout');
  };

  const nextTab = () => {
    setActiveIdx((prev) => (prev + 1) % babyMotherCombos.length);
  };

  const prevTab = () => {
    setActiveIdx((prev) => (prev - 1 + babyMotherCombos.length) % babyMotherCombos.length);
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
      <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-r from-amber-500/25 via-primary/20 to-gold/30 blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

      {/* Main Card */}
      <div className="relative rounded-[2.2rem] bg-white border border-ink/8 p-5 sm:p-6 shadow-[0_15px_40px_rgba(58,107,53,0.08)] overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-amber-400/15 via-gold/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl pointer-events-none" />

        {/* Top Auto-Cycle Subtle Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-100/60 overflow-hidden">
          <motion.div
            key={activeIdx}
            initial={{ width: '0%' }}
            animate={{ width: isHovered ? '100%' : '100%' }}
            transition={{ duration: isHovered ? 0 : 4.0, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-amber-500 to-primary"
          />
        </div>

        {/* Top Header Row: Stage Ribbon & Pediatrician Social Proof */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-ink/8 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 via-amber-50 to-primary/10 border border-amber-300/40 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-600 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
            </span>
            <span className="text-xs font-bold tracking-wide text-ink flex items-center gap-1.5 font-heading">
              <Baby className="w-3.5 h-3.5 text-amber-700" />
              {currentCombo.stageName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Next/Prev Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevTab}
                className="w-6 h-6 rounded-full bg-cream-100 hover:bg-cream-200 text-ink/70 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous combo"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextTab}
                className="w-6 h-6 rounded-full bg-cream-100 hover:bg-cream-200 text-ink/70 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next combo"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pediatrician Guarantee Badge */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 px-3 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>⭐ 4.9/5 (1,420+ Moms)</span>
            </div>
          </div>
        </div>

        {/* 4 Stage Switcher Tabs with Horizontal Auto-Scroll */}
        <div
          ref={tabsRef}
          className="relative z-10 flex items-center gap-1.5 pt-3 pb-2 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {babyMotherCombos.map((combo, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={combo.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                onClick={() => {
                  setActiveIdx(idx);
                  setIsAdded(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-md shadow-amber-600/20 scale-[1.02]'
                    : 'bg-cream-100/70 hover:bg-cream-200 text-ink/70 hover:text-ink border-transparent'
                }`}
              >
                <span>{combo.categoryIcon}</span>
                <span>{combo.categoryLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-amber-600/10 text-amber-800'
                  }`}
                >
                  -{combo.discountPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Offer Content Area with Fixed Min-Height to Prevent CLS / Scroll Jumping */}
        <div className="relative min-h-[385px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCombo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 pt-2 space-y-3.5 flex flex-col justify-between h-full"
            >
            {/* Title & Tagline */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-heading text-[10px] font-extrabold uppercase tracking-wider">
                  {currentCombo.badge}
                </span>
                <span className="text-[11px] text-ink/50 font-medium">✨ {currentCombo.tag}</span>
              </div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-dark mt-1 leading-snug">
                {currentCombo.title}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{currentCombo.subtitle}</p>
            </div>

            {/* Multi-Product Thumbnail Stack */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-cream-50 via-white to-cream-50 border border-ink/8 shadow-inner">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink/50 mb-2 flex items-center justify-between">
                <span>Included in this Combo (3 Full Packs):</span>
                <span className="text-emerald-700 font-bold">100% Himalayan Whole Foods</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {currentCombo.items.map((item, i) => (
                  <div
                    key={item.productId}
                    className="group/item relative flex flex-col items-center text-center p-2 rounded-xl bg-white border border-ink/5 shadow-xs hover:shadow-md hover:border-amber-500/30 transition-all duration-300"
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
                    {i < currentCombo.items.length - 1 && (
                      <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-3.5 h-3.5 rounded-full bg-amber-600 text-white items-center justify-center shadow text-[9px] font-bold">
                        +
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Combo Benefits Checklist */}
            <div className="grid sm:grid-cols-2 gap-1.5 py-0.5">
              {currentCombo.highlights.map((hl, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="line-clamp-1">{hl}</span>
                </div>
              ))}
            </div>

            {/* Pricing, Coupon & High-Conversion Action Button */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              {/* Prices */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-black text-2xl text-amber-700">
                    Rs. {currentCombo.offerPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through font-medium">
                    Rs. {currentCombo.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    SAVE {currentCombo.discountPercentage}%
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                  ✓ Free Delivery Across Nepal
                </p>
              </div>

              {/* 1-Click Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(currentCombo.couponCode)}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Click to copy voucher"
                >
                  {copiedCode === currentCombo.couponCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 text-[11px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-700" />
                      <span className="text-[11px]">Code: {currentCombo.couponCode}</span>
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
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-800 shadow-[0_4px_16px_rgba(217,119,6,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
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
