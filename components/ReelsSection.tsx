'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { reelsApi } from '@/lib/api';
import type { Reel } from '@/lib/types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  Eye,
  Flame,
  ExternalLink,
  Share2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { getProductBySlug } from '@/lib/data/products';

export interface BrandReel {
  id: number;
  title: string;
  description: string;
  video_url: string;
  facebook_url?: string;
  cover_image: string;
  product_name: string;
  product_url: string;
  product_price?: number;
  views?: string;
  likes?: string;
  is_active: boolean;
  sort_order: number;
}

const initialReels: BrandReel[] = [
  {
    id: 1,
    title: 'Pure Himalayan Superfoods Collection — 0 Additives · 0 Preservatives',
    description: 'Farm-fresh Dehydrated Sweet Potato, Dates Powder, Beetroot Powder & Tarai Mango in 100g glass jars! 🌿🏔️',
    video_url: '/videos/sweet-potato-powder-video.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/naturesmud-all-products-100g.jpg',
    product_name: 'Sweet Potato Powder (100 GM)',
    product_url: '/products/sweet-potato-powder',
    product_price: 510,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 2,
    title: 'Freeze Dried Avocado Powder (80 GM) — Creamy Hass Avocado Nutrition',
    description: '100% pure vacuum freeze-dried avocado powder packed with healthy plant fats, potassium & fiber! 🥑✨',
    video_url: '/videos/avocado-powder-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/avocado-powder-holding-jar.jpg',
    product_name: 'Freeze Dried Avocado Powder (80 GM)',
    product_url: '/products/freeze-dried-avocado-powder',
    product_price: 790,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 3,
    title: 'Freeze Dried Strawberry Powder (80 GM) — Real Berry Aroma & Vitamin C',
    description: 'Vibrant ruby freeze-dried strawberries milled into a 100% single-ingredient berry powder for milk, smoothies & baking! 🍓🥛',
    video_url: '/videos/strawberry-powder-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/strawberry-powder-holding-jar.jpg',
    product_name: 'Freeze Dried Strawberry Powder (80 GM)',
    product_url: '/products/strawberry-powder',
    product_price: 1395,
    is_active: true,
    sort_order: 3,
  },
  {
    id: 4,
    title: 'Dates Powder (100 GM) — 0% White Sugar Natural Sweetener',
    description: '100% whole dehydrated dates milled into a gentle sweetener for baby porridge (from 6 months, as advised by your pediatrician), milk & baking! 🌴🍯',
    video_url: '/videos/dates-powder-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/dates-powder-healthy-sweetness.jpg',
    product_name: 'Dates Powder (100 GM)',
    product_url: '/products/dates-powder',
    product_price: 400,
    is_active: true,
    sort_order: 4,
  },
  {
    id: 5,
    title: 'Pure Himalayan Beetroot Powder — Cold-Milled in Nepal',
    description: 'Concentrated dietary nitrates from whole dehydrated Nepali beetroots with 0 additives! 🍷⚡',
    video_url: '/videos/beetroot-powder-promo.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/beetroot-powder-ad.jpg',
    product_name: 'Beetroot Powder (100 GM)',
    product_url: '/products/beetroot-powder',
    product_price: 430,
    is_active: true,
    sort_order: 5,
  },
  {
    id: 6,
    title: 'Dried Cranberries (100 GM) — Whole Plump Ruby Berries',
    description: 'Tangy-sweet whole dried cranberries for yogurt bowls, salads, baking, and antioxidant snacking! 🍒🥣',
    video_url: '/videos/dried-cranberries-pro.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/dried-cranberries-holding-jar-1.jpg',
    product_name: 'Dried Cranberries (100 GM)',
    product_url: '/products/dried-cranberries',
    product_price: 550,
    is_active: true,
    sort_order: 6,
  },
  {
    id: 7,
    title: 'Dried Blueberries (100 GM) — Whole Plump Berries',
    description: 'Naturally dried plump blueberries for morning oats, yogurt bowls, and kids tiffin! 🫐🏔️',
    video_url: '/videos/blueberries-harvest-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/dried-blueberries-holding-jar-1.jpg',
    product_name: 'Dried Blueberries (100 GM)',
    product_url: '/products/dried-blueberries',
    product_price: 650,
    is_active: true,
    sort_order: 7,
  },
  {
    id: 8,
    title: 'Roasted Cashew Nuts (150 GM) — Golden Oil-Free Crunch',
    description: 'Jumbo whole W240 cashew kernels slow dry-roasted to a buttery golden crunch! 🥜✨',
    video_url: '/videos/roasted-cashews-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/cashews-floating-ad.jpg',
    product_name: 'Roasted Cashew Nuts (150 GM)',
    product_url: '/products/roasted-cashewnuts',
    product_price: 750,
    is_active: true,
    sort_order: 8,
  },
  {
    id: 9,
    title: 'Himalayan Fox Nuts (Makhana) — Light & Crunchy Lotus Seeds',
    description: 'Hand-graded popped lotus seeds for clean roasting, fasting snacks, and high-calcium munching! 🍿🌿',
    video_url: '/videos/makhana-fox-nuts-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/makhana-100g.jpg',
    product_name: 'Himalayan Fox Nuts (Makhana) (100 GM)',
    product_url: '/products/fox-nuts-makhana',
    product_price: 500,
    is_active: true,
    sort_order: 9,
  },
  {
    id: 10,
    title: 'Banana, Sweet Potato & Cranberry — Family Superfood Trio',
    description: 'Pure Banana Powder, Sweet Potato Powder & Dried Cranberries for baby weaning (from 6 months, as advised by your pediatrician) and smoothies! 🍌🍠',
    video_url: '/videos/banana-sweet-potato-cranberry-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/banana-powder-100g.jpg',
    product_name: 'Banana Powder (100 GM)',
    product_url: '/products/banana-powder',
    product_price: 590,
    is_active: true,
    sort_order: 10,
  },
  {
    id: 11,
    title: 'Moringa Leaf Powder, Pumpkin Seeds & Banana Powder — Daily Vitality',
    description: 'Shade-dried Moringa Leaf Powder paired with raw green Pumpkin Seeds and Banana Powder for daily plant iron & zinc! 🌿🎃',
    video_url: '/videos/moringa-pumpkin-banana-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/moringa-powder-100g.jpg',
    product_name: 'Moringa Leaf Powder (100 GM)',
    product_url: '/products/moringa-leaf-powder',
    product_price: 475,
    is_active: true,
    sort_order: 11,
  },
  {
    id: 12,
    title: 'Dehydrated Mango, Papaya & Banana Smoothie Prep',
    description: 'Sun-ripened Tarai Dehydrated Mango, Sweet Papaya & Banana Powder blended into a tropical smoothie! 🥭🍹',
    video_url: '/videos/mango-papaya-banana-smoothie.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/dehydrated-mango-slices.jpg',
    product_name: 'Dehydrated Mango (100 GM)',
    product_url: '/products/dehydrated-mango',
    product_price: 595,
    is_active: true,
    sort_order: 12,
  },
  {
    id: 13,
    title: 'Dehydrated Apple (100 GM) — Crisp Mustang & Jumla Apple Rings',
    description: 'High-altitude Himalayan apples sliced skin-on and gently air-dehydrated with 0% added sugar! 🍎🏔️',
    video_url: '/videos/dehydrated-apple-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/dehydrated-apple-100g.jpg',
    product_name: 'Dehydrated Apple (100 GM)',
    product_url: '/products/dehydrated-apple',
    product_price: 550,
    is_active: true,
    sort_order: 13,
  },
  {
    id: 14,
    title: 'Carrot Powder (100 GM) — Provitamin A & Beta-Carotene',
    description: '100% pure dehydrated Nepali carrot powder for baby jaulo (from 6 months, as advised by your pediatrician), soups & rotis! 🥕🍲',
    video_url: '/videos/clip-21.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/carrot-powder-100g.jpg',
    product_name: 'Carrot Powder (100 GM)',
    product_url: '/products/carrot-powder',
    product_price: 490,
    is_active: true,
    sort_order: 14,
  },
  {
    id: 15,
    title: 'Chia Seeds (300 GM) — Hydration & Plant Omega-3',
    description: 'Triple-cleaned hydrophilic black chia seeds for morning hydration and overnight pudding! 🌱💧',
    video_url: '/videos/chia-seed-ad.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/chia-seeds.jpg',
    product_name: 'Chia Seeds (300 GM)',
    product_url: '/products/chia-seeds',
    product_price: 495,
    is_active: true,
    sort_order: 15,
  },
  {
    id: 16,
    title: 'Pumpkin Seeds (300 GM) — Raw Green Pepita Kernels',
    description: 'High zinc and magnesium crunch for oatmeal, salads, and clean desk snacking! 🎃💪',
    video_url: '/videos/pumpkin-seeds-crunch.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/pumpkin-seeds-power-poster.jpg',
    product_name: 'Pumpkin Seeds (300 GM)',
    product_url: '/products/pumpkin-seeds',
    product_price: 650,
    is_active: true,
    sort_order: 16,
  },
  {
    id: 17,
    title: 'Raw Cashew Nuts (150 GM) — Selected Jumbo Kernels',
    description: 'Unblemished whole raw cashew nuts for snacking, homemade kaju milk, and festive gifting! 🥜👑',
    video_url: '/videos/cashews-crunch-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/cashews-holding-jar-1.jpg',
    product_name: 'Raw Cashew Nuts (150 GM)',
    product_url: '/products/premium-cashewnuts',
    product_price: 750,
    is_active: true,
    sort_order: 17,
  },
  {
    id: 18,
    title: 'Raw Almonds (200 GM) — Whole Sweet Himalayan Kernels',
    description: '100% unroasted whole sweet almonds rich in Vitamin E for morning soaked badam and homemade almond milk! 🌰✨',
    video_url: '/videos/almonds.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/raw-almonds-holding-jar.jpg',
    product_name: 'Raw Almonds (200 GM)',
    product_url: '/products/raw-himalayan-almonds',
    product_price: 750,
    is_active: true,
    sort_order: 18,
  },
  {
    id: 19,
    title: 'Freeze Dried Strawberry Craft — From Fresh Berries to Fine Powder',
    description: 'See how fresh strawberries are freeze-dried and cold-milled with 0% artificial dye or sugar! 🍓🔬',
    video_url: '/videos/strawberry-powder-craft.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/strawberry-powder-100g.jpg',
    product_name: 'Freeze Dried Strawberry Powder (80 GM)',
    product_url: '/products/strawberry-powder',
    product_price: 1395,
    is_active: true,
    sort_order: 19,
  },
  {
    id: 20,
    title: 'Dried Cranberries & Yogurt Bowl — Tangy Antioxidant Crunch',
    description: 'Layer whole ruby Dried Cranberries over morning curd, muesli, or chia pudding! 🍒🥄',
    video_url: '/videos/cranberries-yogurt-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/images/lifestyle/dried-cranberries-holding-jar-2.jpg',
    product_name: 'Dried Cranberries (100 GM)',
    product_url: '/products/dried-cranberries',
    product_price: 415,
    is_active: true,
    sort_order: 20,
  },
  {
    id: 21,
    title: 'Coconut Chips (100 GM) — Lightly Toasted Tropical Crunch',
    description: 'Crisp dehydrated coconut ribbons with 0% trans fat and 0% refined sugar! 🥥✨',
    video_url: '/videos/snaptik-reel-2.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/coconut-chips-100g.jpg',
    product_name: 'Coconut Chips (100 GM)',
    product_url: '/products/dehydrated-coconut-chips',
    product_price: 475,
    is_active: true,
    sort_order: 21,
  },
  {
    id: 22,
    title: 'Cold-Pressed Extra Virgin Coconut Oil (500 ML) — Raw Centrifuged',
    description: 'Unrefined, zero-heat virgin coconut oil pressed from fresh coconut milk for cooking, baby massage & hair care! 🥥💧',
    video_url: '/videos/coconut-oil.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/virgin-coconut-oil-500ml.jpg',
    product_name: 'Cold-Pressed Extra Virgin Coconut Oil (500 ML)',
    product_url: '/products/virgin-coconut-oil-500ml',
    product_price: 1750,
    is_active: true,
    sort_order: 22,
  },
];

export default function ReelsSection() {
  const [reels] = useState<BrandReel[]>(initialReels);
  const [playingReelId, setPlayingReelId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isHoveredStream, setIsHoveredStream] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setIsHoveredStream(true);
      setTimeout(() => setIsHoveredStream(false), 3000);
    }
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDraggingState(true);
    setIsHoveredStream(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDraggingState(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
        setIsHoveredStream(false);
      }, 2500);
    }
  };

  const handleReelHover = useCallback((uniqueKey: string, reelId: number) => {
    if (isDraggingRef.current) return;
    setPlayingReelId(reelId);
    Object.entries(videoRefs.current).forEach(([k, vid]) => {
      if (!vid) return;
      if (k === uniqueKey) {
        vid.currentTime = vid.currentTime || 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, []);

  const handleReelLeave = useCallback((uniqueKey: string, reelId: number) => {
    const vid = videoRefs.current[uniqueKey];
    if (vid) {
      vid.pause();
    }
    setPlayingReelId((prev) => (prev === reelId ? null : prev));
  }, []);

  const handleAddToCart = (reel: BrandReel, e: React.MouseEvent) => {
    e.stopPropagation();
    useCartStore.getState().addItem(
      {
        id: String(reel.id),
        slug: reel.product_url.replace('/products/', ''),
        name: reel.product_name,
        price: reel.product_price || 650,
        image: reel.cover_image,
        weight: '100g',
        category: 'Superfood',
      },
      1
    );
    openDrawer();
  };

  return (
    <section className="section-padding bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] overflow-hidden relative select-none">
      {/* Background ambient glowing textures */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(45,90,39,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(201,152,42,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="container-nm relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="section-number tracking-widest text-[#2D5A27] text-xs font-bold uppercase">
                02 — Live Himalayan Stories
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Facebook Reels & Videos
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900">
                NaturesMud in Action
              </h2>
              <a
                href="https://www.facebook.com/profile.php?id=61589084257990"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2] text-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#166fe5] transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Follow on Facebook
              </a>
            </div>

            <p className="section-subtitle text-gray-600 text-base sm:text-lg max-w-2xl mt-2.5 leading-relaxed">
              Harvest footage, recipes, child nutrition tips, and customer unboxings directly from our Nepal farms.
            </p>
          </div>

          {/* Sound & Scroll Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Scroll Left & Right buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-gray-200 shadow-xs">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:text-[#2D5A27] hover:bg-gray-100 transition-colors cursor-pointer active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:text-[#2D5A27] hover:bg-gray-100 transition-colors cursor-pointer active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-xs ${
                isMuted
                  ? 'bg-white text-gray-700 hover:text-gray-900 border-gray-200'
                  : 'bg-[#2D5A27] text-white border-[#2D5A27]'
              }`}
              title={isMuted ? 'Turn Sound On' : 'Mute Videos'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted (Audio Off)' : '🔊 Audio Active'}</span>
              <span className="sm:hidden">{isMuted ? 'Mute' : 'Audio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Touch-Friendly, Drag-to-Scroll & User-Scrollable Reel Carousel */}
      <div className="relative w-full max-w-full overflow-hidden group/carousel">
        {/* Floating Left Navigation Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-gray-900 shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 opacity-90 hover:opacity-100 cursor-pointer"
          aria-label="Scroll reels left"
        >
          <ChevronLeft className="w-6 h-6 text-[#2D5A27]" />
        </button>

        {/* Floating Right Navigation Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-gray-900 shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 opacity-90 hover:opacity-100 cursor-pointer"
          aria-label="Scroll reels right"
        >
          <ChevronRight className="w-6 h-6 text-[#2D5A27]" />
        </button>

        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={() => {
            handleMouseUpOrLeave();
            setIsHoveredStream(false);
          }}
          onMouseEnter={() => setIsHoveredStream(true)}
          className={`w-full relative overflow-x-auto overflow-y-hidden py-3 px-4 sm:px-8 touch-pan-y touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isDraggingState ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          onTouchStart={() => setIsHoveredStream(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsHoveredStream(false), 2500);
          }}
        >
          <div className="flex gap-4 sm:gap-5 w-max">
            {reels.map((reel, index) => {
              const uniqueKey = `stream-${reel.id}-${index}`;
              const isThisPlaying = playingReelId === reel.id;

              return (
                <div
                  key={uniqueKey}
                  onClick={() => {
                    if (hasDraggedRef.current) return;
                    if (playingReelId === reel.id) {
                      handleReelLeave(uniqueKey, reel.id);
                    } else {
                      handleReelHover(uniqueKey, reel.id);
                    }
                  }}
                  className="w-[210px] sm:w-[250px] md:w-[260px] h-[370px] sm:h-[430px] md:h-[445px] rounded-3xl overflow-hidden relative shrink-0 shadow-md border border-gray-200/80 bg-gray-950 group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between select-none"
                >
                {/* Background Video / Image Thumbnail Facade */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={reel.cover_image}
                    alt={reel.title}
                    fill
                    sizes="(max-width: 640px) 230px, 280px"
                    className={`object-cover transition-opacity duration-300 ${
                      isThisPlaying ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  {isThisPlaying && (
                    <video
                      ref={(el) => {
                        videoRefs.current[uniqueKey] = el;
                        if (el) {
                          el.play().catch(() => {});
                        }
                      }}
                      src={reel.video_url}
                      muted={isMuted}
                      loop
                      playsInline
                      autoPlay
                      onError={(e) => {
                        const el = e.currentTarget;
                        if (el) el.style.display = 'none';
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35" />
                </div>

                {/* Top Bar with Facebook Badge */}
                <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[10px] sm:text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span>Reel #{reel.id}</span>
                  </div>

                  <a
                    href={reel.facebook_url || 'https://www.facebook.com/profile.php?id=61589084257990'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-sm transition-transform hover:scale-110"
                    title="Watch on Facebook"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Center Play Indicator */}
                {!isThisPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 border border-white/40 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Bottom Card Content */}
                <div className="relative z-10 p-3.5 sm:p-4 space-y-2">
                  <div>
                    <h3 className="text-white text-xs sm:text-sm md:text-base font-bold line-clamp-1 font-heading leading-tight">
                      {reel.title}
                    </h3>
                    <p className="text-white/80 text-[11px] sm:text-xs line-clamp-2 mt-0.5 leading-snug">
                      {reel.description}
                    </p>
                  </div>

                  {/* Shop Product Action */}
                  {(() => {
                    const slug = reel.product_url.replace('/products/', '');
                    const prod = getProductBySlug(slug);
                    const displayName = prod ? `${prod.official_label_name || prod.name} (${prod.weight})` : reel.product_name;
                    const displayPrice = prod ? prod.price : (reel.product_price || 650);
                    return (
                      <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
                        <Link
                          href={reel.product_url}
                          className="text-xs font-bold text-[#EBC164] hover:underline truncate flex-1 min-w-0"
                          onClick={(e) => e.stopPropagation()}
                          title={displayName}
                        >
                          <span className="truncate block font-heading">{displayName}</span>
                          <span className="text-[10px] text-white/70 block font-sans">Rs. {displayPrice}</span>
                        </Link>

                        <button
                          onClick={(e) => handleAddToCart(reel, e)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBC164] text-gray-900 text-xs font-black flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#2D5A27]" />
                          <span>Shop</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}