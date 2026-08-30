'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Baby,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
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
  purityNote: string;
}

export const babyMotherCombos: BabyMotherCombo[] = [
  {
    id: 'combo-baby-solids',
    title: 'First Solids Whole Food Starter Kit',
    subtitle: 'Sweet Potato, Carrot & Dates Powders',
    stageName: '🍼 6–24m First Solids',
    badge: '5% OFF · Single-Ingredient',
    categoryIcon: '🍼',
    categoryLabel: 'First Solids',
    discountPercentage: 5,
    originalPrice: 1350,
    offerPrice: 1283,
    couponCode: 'STORE5',
    tag: 'Single-Ingredient',
    purityNote: 'Pure whole vegetables and dried fruit with zero added sugar, zero salt, and zero preservatives.',
    items: [
      {
        productId: '25',
        name: 'Sweet Potato Powder',
        weight: '100g',
        image: '/products/sweet-potato-powder-100g.jpg',
        price: 510,
      },
      {
        productId: '24',
        name: 'Carrot Powder',
        weight: '100g',
        image: '/products/carrot-powder.jpg',
        price: 490,
      },
      {
        productId: '8',
        name: 'Dates Powder Sweetener',
        weight: '100g',
        image: '/products/dates-powder-100g.jpg',
        price: 350,
      },
    ],
    highlights: [
      'Naturally Rich in Beta-Carotene',
      'Gentle Single-Ingredient Foods',
      '0 Added Sugar · 0 Preservatives',
      'Finely Milled Powder',
    ],
  },
  {
    id: 'combo-pregnancy-nourish',
    title: 'Motherhood Pregnancy Complete Box',
    subtitle: 'Sun-Dried Figs, Chia Seeds & Mountain Almonds',
    stageName: '🤰 Pregnancy Trimesters 1, 2 & 3',
    badge: '5% OFF · Maternal Nourish',
    categoryIcon: '🤰',
    categoryLabel: 'Pregnancy',
    discountPercentage: 5,
    originalPrice: 1680,
    offerPrice: 1596,
    couponCode: 'STORE5',
    tag: 'Folate & Iron Rich',
    purityNote: 'Lab-tested organic mountain superfoods for maternal energy and fetal development.',
    items: [
      {
        productId: '4',
        name: 'Sun-Dried Himalayan Figs',
        weight: '200g',
        image: '/products/dehydrated-fig.jpg',
        price: 690,
      },
      {
        productId: '12',
        name: 'Organic Black Chia Seeds',
        weight: '300g',
        image: '/products/chia-seeds.jpg',
        price: 390,
      },
      {
        productId: '18',
        name: 'Raw Mountain Almonds',
        weight: '200g',
        image: '/products/almonds.jpg',
        price: 600,
      },
    ],
    highlights: [
      'High Dietary Folate & Iron',
      'Omega-3 ALA for Fetal Development',
      'Calcium for Bone Density',
      'Natural Fiber for Digestion',
    ],
  },
  {
    id: 'combo-sutkeri-care',
    title: 'Sutkeri Postpartum Recovery Pack',
    subtitle: 'Jumla Walnuts, Dates Powder & Coconut Oil',
    stageName: '🤱 Sutkeri Postpartum Care',
    badge: '5% OFF · Traditional Care',
    categoryIcon: '🤱',
    categoryLabel: 'Sutkeri Care',
    discountPercentage: 5,
    originalPrice: 1520,
    offerPrice: 1444,
    couponCode: 'STORE5',
    tag: 'Lactation & Healing',
    purityNote: 'Traditional Ayurvedic postpartum nutrition for deep pelvic strength and breastmilk supply.',
    items: [
      {
        productId: '21',
        name: 'Whole Jumla Walnuts',
        weight: '200g',
        image: '/products/walnuts.jpg',
        price: 520,
      },
      {
        productId: '8',
        name: 'Dates Powder Sweetener',
        weight: '100g',
        image: '/products/dates-powder-100g.jpg',
        price: 350,
      },
      {
        productId: '22',
        name: 'Extra Virgin Coconut Oil',
        weight: '250ml',
        image: '/products/coconut-oil.jpg',
        price: 650,
      },
    ],
    highlights: [
      'Healthy Fats for Breastmilk Quality',
      'Natural Iron for Postpartum Strength',
      'Pure Cold-Pressed Recovery MCTs',
      'Ayurvedic Sutkeri Recipe Base',
    ],
  },
  {
    id: 'combo-toddler-growth',
    title: 'Toddler Super-Snack & Brain Bites',
    subtitle: 'Dehydrated Apples, Pumpkin Seeds & Cranberries',
    stageName: '🌱 2y+ Toddler Growth',
    badge: '5% OFF · Smart Snacking',
    categoryIcon: '🌱',
    categoryLabel: 'Toddler Bites',
    discountPercentage: 5,
    originalPrice: 1480,
    offerPrice: 1406,
    couponCode: 'STORE5',
    tag: '100% Whole Fruit',
    purityNote: 'Zero refined sugar or artificial colorings for energetic and healthy kids.',
    items: [
      {
        productId: '3',
        name: 'Sun-Dried Mountain Apple Slices',
        weight: '100g',
        image: '/products/dehydrated-apple.jpg',
        price: 415,
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
      'High-Protein Crunchy Mountain Snack',
      'Natural Dietary Zinc & Magnesium',
      'Antioxidants from Sun-Dried Berries',
      '0 Added Sugar · 0 Flavours',
    ],
  },
];

export default function BabyMotherCombosSection() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const currentCombo = babyMotherCombos[activeIdx] || babyMotherCombos[0];

  // Auto-cycle through combo tabs every 4s unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % babyMotherCombos.length);
      setIsAdded(false);
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered]);

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
      className="w-full max-w-[580px] relative group mt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Ambient decorative glow */}
      <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/20 via-primary/15 to-gold/20 blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />

      {/* Main Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-ink/8 p-3.5 sm:p-5 shadow-sm overflow-hidden">
        {/* Top Auto-Cycle Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-[#EAE3D6]/60 overflow-hidden">
          <motion.div
            key={activeIdx}
            initial={{ width: '0%' }}
            animate={{ width: isHovered ? '100%' : '100%' }}
            transition={{ duration: isHovered ? 0 : 4.5, ease: 'linear' }}
            className="h-full bg-[#1A3826]"
          />
        </div>

        {/* Top Header Row: Stage Ribbon & Controls */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 border-b border-[#242220]/8 pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F1EA] border border-[#EAE3D6]">
            <Baby className="w-3 h-3 text-[#7A5230]" />
            <span className="text-[11px] sm:text-xs font-semibold text-[#242220] font-sans">
              {currentCombo.stageName}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Next/Prev Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevTab}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#F5F1EA] hover:bg-[#EAE3D6] text-[#242220]/70 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous combo"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={nextTab}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#F5F1EA] hover:bg-[#EAE3D6] text-[#242220]/70 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next combo"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Whole Food Guarantee Badge */}
            <div className="hidden sm:flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-[#1A3826] bg-[#F5F1EA] border border-[#EAE3D6] px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-[#1A3826]" />
              <span>100% Pure · 0 Additives</span>
            </div>
          </div>
        </div>

        {/* 4 Stage Switcher Tabs */}
        <div className="relative z-10 flex items-center gap-1 pt-2 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {babyMotherCombos.map((combo, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={combo.id}
                onClick={() => {
                  setActiveIdx(idx);
                  setIsAdded(false);
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1 cursor-pointer border shrink-0 font-sans ${
                  isSelected
                    ? 'bg-[#1A3826] text-[#FAF7F2] border-[#1A3826] shadow-2xs'
                    : 'bg-[#F5F1EA] hover:bg-[#EAE3D6] text-[#242220]/70 border-transparent'
                }`}
              >
                <span>{combo.categoryIcon}</span>
                <span>{combo.categoryLabel}</span>
                <span
                  className={`text-[9px] px-1 py-0.1 rounded-full font-semibold ${
                    isSelected ? 'bg-white/20 text-[#FAF7F2]' : 'bg-[#7A5230]/10 text-[#7A5230]'
                  }`}
                >
                  -{combo.discountPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Offer Content Area with Compact Min-Height */}
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
              {/* Title & Tagline */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.2 rounded-full bg-[#F5F1EA] text-[#1A3826] border border-[#EAE3D6] font-sans text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase">
                    {currentCombo.badge}
                  </span>
                  <span className="text-[10px] text-[#242220]/60 font-normal">✨ {currentCombo.tag}</span>
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1A3826] mt-1 leading-snug">
                  {currentCombo.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#242220]/70 mt-0.5 line-clamp-1 font-sans">
                  {currentCombo.subtitle}
                </p>
              </div>

              {/* Multi-Product Thumbnail Stack (Compact) */}
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6]/70">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {currentCombo.items.map((item, i) => (
                    <div
                      key={item.productId}
                      className="group/item relative flex flex-col items-center text-center p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white border border-[#EAE3D6]/60 shadow-2xs transition-all"
                    >
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden mb-1 bg-[#FAF7F2]">
                        <Image
                          src={item.image || '/products/superfood-mix.jpg'}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-[#242220] leading-tight line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-[#242220]/50 font-mono mt-0.2">
                        {item.weight && /^\d+(\.00)?$/.test(item.weight.trim()) ? `${parseFloat(item.weight)} GM` : item.weight}
                      </p>

                      {/* Plus connector between images */}
                      {i < currentCombo.items.length - 1 && (
                        <div className="hidden sm:flex absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 w-3 h-3 rounded-full bg-[#1A3826] text-white items-center justify-center text-[8px] font-bold">
                          +
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Combo Benefits Checklist (Visible on tablet/desktop, compact single line on mobile) */}
              <div className="hidden sm:grid grid-cols-2 gap-1 py-0.5">
                {currentCombo.highlights.slice(0, 2).map((hl, i) => (
                  <div key={i} className="flex items-center gap-1 text-[11px] text-[#242220]/80 font-sans">
                    <CheckCircle2 className="w-3 h-3 text-[#1A3826] shrink-0" />
                    <span className="line-clamp-1">{hl}</span>
                  </div>
                ))}
              </div>

              {/* Pricing & Action Buttons */}
              <div className="pt-2 border-t border-[#242220]/8 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-[#1A3826]">
                      Rs. {currentCombo.offerPrice.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#242220]/40 line-through">
                      Rs. {currentCombo.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-[#242220]/60 font-sans">
                    ✓ Free Delivery in Nepal
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClaimCombo}
                    className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold bg-[#FAF7F2] hover:bg-[#EAE3D6] text-[#1A3826] border border-[#EAE3D6] transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{isAdded ? 'Added!' : 'Add'}</span>
                  </button>

                  <button
                    onClick={handleBuyNowCombo}
                    className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-heading font-bold bg-[#1A3826] hover:bg-[#2A4D38] text-white transition-all active:scale-95 cursor-pointer shadow-2xs"
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
