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
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';

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
    title: 'Pure Himalayan 100% Organic Superfoods Collection',
    description: 'Farm-fresh Dehydrated Sweet Potato, Dates Powder, Beetroot Powder & Wild Blueberries in 100g glass jars! 🌿🏔️',
    video_url: '/videos/sweet-potato-powder-video.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/naturesmud-all-products-100g.jpg',
    product_name: "Nature's Mud 100g Range",
    product_url: '/products/sweet-potato-powder',
    product_price: 380,
    views: '58.4K',
    likes: '5.2K',
    is_active: true,
    sort_order: 1,
  },
  {
    id: 2,
    title: 'Organic Sweet Potato Powder — Baby Weaning & Energy',
    description: '100% dehydrated pure Nepali Sweet Potato Powder — rich in beta-carotene with 0% added sugar! 🍠✨',
    video_url: '/videos/naturesmud-screen-reel.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/sweet-potato-powder-100g.jpg',
    product_name: 'Sweet Potato Powder (100g)',
    product_url: '/products/sweet-potato-powder',
    product_price: 380,
    views: '44.8K',
    likes: '3.9K',
    is_active: true,
    sort_order: 2,
  },
  {
    id: 3,
    title: 'Pure Himalayan Nitric Oxide Beetroot Power',
    description: 'Concentrated dietary nitrates for endurance, stamina, and cardiovascular blood flow! 🍷⚡',
    video_url: '/videos/beetroot-stamina-drink.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/beetroot-powder-100g.jpg',
    product_name: 'Beetroot Powder (100g)',
    product_url: '/products/beetroot-powder',
    product_price: 380,
    views: '41.2K',
    likes: '3.8K',
    is_active: true,
    sort_order: 3,
  },
  {
    id: 4,
    title: 'Premium Black Chia Seeds — Hydration & Omega-3',
    description: '12x hydrophilic water retention for sustained athletic hydration and healthy digestion! 🌱💧',
    video_url: '/videos/chia-seed-ad.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/chia-seeds.jpg',
    product_name: 'Black Chia Seeds (100g)',
    product_url: '/products/black-chia-seeds',
    product_price: 240,
    views: '36.7K',
    likes: '2.9K',
    is_active: true,
    sort_order: 4,
  },
  {
    id: 5,
    title: 'Whole Dried Cranberries — PACs for Bladder Defense',
    description: 'Naturally tart whole cranberries with Type-A proanthocyanidins to support urinary tract wellness! 🍒✨',
    video_url: '/videos/cranberries-product-reveal.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/cranberries.jpg',
    product_name: 'Whole Dried Cranberries (100g)',
    product_url: '/products/whole-dried-cranberries',
    product_price: 380,
    views: '31.5K',
    likes: '2.6K',
    is_active: true,
    sort_order: 5,
  },
  {
    id: 6,
    title: 'Roasted Himalayan Almonds — Brain Power & Vitamin E',
    description: 'Dry slow-roasted mountain almonds for sustained cognitive memory and acetylcholine! 🧠🥜',
    video_url: '/videos/almonds-mental-edge.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/almonds.jpg',
    product_name: 'Roasted Almonds (100g)',
    product_url: '/products/roasted-almonds',
    product_price: 360,
    views: '28.4K',
    likes: '2.4K',
    is_active: true,
    sort_order: 6,
  },
  {
    id: 7,
    title: 'Ditch Refined White Sugar! Natural Dates Powder',
    description: 'Micro-ground pure dates — the healthiest unrefined sweetener for baby cereal, tea, & kheer! 🍯',
    video_url: '/videos/dates-powder-energy.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/dates-powder-100g.jpg',
    product_name: 'Dates Powder Sweetener (100g)',
    product_url: '/products/dates-powder',
    product_price: 390,
    views: '38.2K',
    likes: '3.1K',
    is_active: true,
    sort_order: 7,
  },
  {
    id: 8,
    title: 'Wild Himalayan Dried Blueberries for Focus',
    description: 'High-altitude dark anthocyanin berries to defend eye strain and boost cognitive memory! 🫐💜',
    video_url: '/videos/blueberries-stress.mp4',
    facebook_url: 'https://www.facebook.com/profile.php?id=61589084257990',
    cover_image: '/products/dried-blueberries-100g.jpg',
    product_name: 'Dried Blueberries (100g)',
    product_url: '/products/dried-blueberries',
    product_price: 650,
    views: '33.6K',
    likes: '2.8K',
    is_active: true,
    sort_order: 8,
  },
];

export default function ReelsSection() {
  const [reels, setReels] = useState<BrandReel[]>(initialReels);
  const [playingReelId, setPlayingReelId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isHoveredStream, setIsHoveredStream] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    let mounted = true;
    reelsApi
      .getReels()
      .then((data: any) => {
        if (mounted && data && Array.isArray(data) && data.length > 0) {
          setReels(data);
        }
      })
      .catch(() => {
        // Fallback to initialReels
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleReelHover = useCallback((uniqueKey: string, reelId: number) => {
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
        weight: '250g',
        category: 'Superfood',
      },
      1
    );
    openDrawer();
  };

  return (
    <section className="section-padding bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] overflow-hidden relative">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#2D5A27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-[#C9982A]/5 rounded-full blur-3xl pointer-events-none" />

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
                Nature's Mud in Action
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

          {/* Sound Toggle Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-xs ${
                isMuted
                  ? 'bg-white text-gray-700 hover:text-gray-900 border-gray-200'
                  : 'bg-[#2D5A27] text-white border-[#2D5A27]'
              }`}
              title={isMuted ? 'Turn Sound On' : 'Mute Videos'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Muted (Click for Audio)' : '🔊 Audio Active'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Seamless Continuous Reel Conveyor Stream */}
      <div
        className="w-full relative overflow-hidden py-3"
        onMouseEnter={() => setIsHoveredStream(true)}
        onMouseLeave={() => setIsHoveredStream(false)}
        onTouchStart={() => setIsHoveredStream(true)}
        onTouchEnd={() => setIsHoveredStream(false)}
      >
        <motion.div
          animate={{
            x: isHoveredStream || playingReelId !== null ? undefined : ['0%', '-50%'],
          }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 48,
          }}
          className="flex gap-5 shrink-0 px-4 select-none"
        >
          {[...reels, ...reels].map((reel, index) => {
            const uniqueKey = `stream-${reel.id}-${index}`;
            const isThisPlaying = playingReelId === reel.id;

            return (
              <div
                key={uniqueKey}
                onMouseEnter={() => handleReelHover(uniqueKey, reel.id)}
                onMouseLeave={() => handleReelLeave(uniqueKey, reel.id)}
                className="w-[260px] sm:w-[280px] h-[460px] sm:h-[490px] rounded-3xl overflow-hidden relative shrink-0 shadow-lg border border-gray-200/80 bg-gray-950 group cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col justify-between"
              >
                {/* Background Video / Image Thumbnail */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={reel.cover_image}
                    alt={reel.title}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      isThisPlaying ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <video
                    ref={(el) => {
                      videoRefs.current[uniqueKey] = el;
                    }}
                    src={reel.video_url}
                    muted={isMuted}
                    loop
                    playsInline
                    preload="none"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      isThisPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />
                </div>

                {/* Top Bar with Facebook Badge */}
                <div className="relative z-10 p-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
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
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Bottom Card Content */}
                <div className="relative z-10 p-4 space-y-2.5">
                  <div>
                    <h3 className="text-white text-sm sm:text-base font-bold line-clamp-1 font-heading">
                      {reel.title}
                    </h3>
                    <p className="text-white/80 text-xs line-clamp-2 mt-0.5 leading-snug">
                      {reel.description}
                    </p>
                  </div>

                  {/* Shop Product Action */}
                  <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
                    <Link
                      href={reel.product_url}
                      className="text-xs font-bold text-[#EBC164] hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {reel.product_name}
                    </Link>

                    <button
                      onClick={(e) => handleAddToCart(reel, e)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBC164] text-gray-900 text-xs font-black flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Shop</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}