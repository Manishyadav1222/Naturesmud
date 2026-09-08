'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  Award,
  Users,
  UtensilsCrossed,
  Heart,
  CheckCircle2,
  CalendarDays,
  CreditCard,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from 'sonner';

interface MainstayItem {
  id: string;
  slug: string;
  name: string;
  sub: string;
  rating: string;
  stars: number;
  price: number;
  image: string;
}

const MAINSTAY_ITEMS: MainstayItem[] = [
  {
    id: 'dehydrated-mango',
    slug: 'dehydrated-mango',
    name: 'Sun-Dehydrated Mango',
    sub: 'with pure mountain sweetness',
    rating: '9.8',
    stars: 5,
    price: 595,
    image: '/products/authentic-dehydrated-mango.jpg',
  },
  {
    id: 'roasted-cashews',
    slug: 'roasted-cashews',
    name: 'Royal Roasted Cashews',
    sub: 'with Himalayan rock salt',
    rating: '9.9',
    stars: 5,
    price: 750,
    image: '/products/authentic-cashewnuts-roasted.jpg',
  },
  {
    id: 'shilajit-resin',
    slug: 'pure-shilajit-resin',
    name: 'Mustang Shilajit Resin',
    sub: 'with 60%+ fulvic acid',
    rating: '9.9',
    stars: 5,
    price: 890,
    image: '/products/shilajit.jpg',
  },
];

export default function ArtisanEditorialHero() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (item: MainstayItem) => {
    addItem({
      id: item.slug,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image,
      category: 'Mainstay Superfoods',
      weight: '100 GM',
    });
    toast.success('Added to Cart', {
      description: `${item.name} has been added.`,
    });
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#FAF1E4] via-[#F4E4D0] to-[#EAD8C2] text-[#2C1704] py-12 sm:py-16 lg:py-20 overflow-hidden font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. Top Navigation Branding Pill ── */}
        <div className="flex items-center justify-between pb-8 sm:pb-12 border-b border-[#2C1704]/10">
          <Link href="/" className="font-serif font-black text-2xl sm:text-3xl tracking-wide text-[#2C1704]">
            NATURESMUD
          </Link>
          <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-[#2C1704]/80">
            <Link href="/" className="hover:text-[#2C1704] font-semibold transition-colors">Home</Link>
            <Link href="/products" className="hover:text-[#2C1704] font-semibold transition-colors">Products</Link>
            <Link href="/about" className="hover:text-[#2C1704] font-semibold transition-colors">About</Link>
          </div>
        </div>

        {/* ── 2. Editorial Hero: "Delicious Pure Food Is Waiting For You" ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 sm:py-14">
          {/* Left Column Text */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#2C1704] leading-[1.12] tracking-tight mb-4"
            >
              Delicious Pure Food <br />
              Is Waiting <br />
              For You
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-sm sm:text-base text-[#2C1704]/75 max-w-md leading-relaxed mb-8 font-sans"
            >
              Quality Himalayan harvest and 100% natural pure taste, always delivering a satisfying, wholesome experience.
            </motion.p>

            {/* CTA Pill Buttons matching exact reference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Link
                href="/products"
                className="px-7 py-3 rounded-full bg-[#E08447] hover:bg-[#D37335] text-white font-medium text-sm sm:text-base shadow-sm transition-all duration-200 active:scale-95"
              >
                Products Menu
              </Link>
              <Link
                href="/our-story"
                className="px-7 py-3 rounded-full bg-[#E4D5C3] hover:bg-[#D8C7B3] text-[#2C1704] font-medium text-sm sm:text-base shadow-2xs transition-all duration-200 active:scale-95"
              >
                Our Ritual
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Hero Ceramic Feast Bowl */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex items-center justify-center relative"
          >
            <div className="relative w-[280px] sm:w-[360px] lg:w-[400px] aspect-square rounded-full overflow-hidden shadow-[0_24px_48px_rgba(44,23,4,0.22)] border-8 border-white/60">
              <Image
                src="/products/naturesmud-all-products-100g.jpg"
                alt="Delicious Himalayan Feast Bowl"
                fill
                priority
                sizes="(max-width: 768px) 320px, 400px"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* ── 3. Top List – Our Mainstay Harvest (3-Card Layout) ── */}
        <div className="pt-8 pb-12 sm:pb-16 border-t border-[#2C1704]/10">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#2C1704] mb-8">
            Top List – Our mainstay menu
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MAINSTAY_ITEMS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="rounded-[28px] bg-[#FDF7EE] p-5 shadow-[0_8px_20px_rgba(44,23,4,0.06)] border border-[#2C1704]/5 flex flex-col justify-between group hover:shadow-[0_12px_28px_rgba(44,23,4,0.12)] transition-all duration-300"
              >
                {/* Circular Dish Image */}
                <Link
                  href={`/products/${item.slug}`}
                  className="relative w-full aspect-square max-w-[220px] mx-auto rounded-full overflow-hidden my-2 shadow-[0_8px_20px_rgba(44,23,4,0.12)] border-4 border-white bg-white group-hover:scale-105 transition-transform duration-300 block"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 200px, 220px"
                    className="object-contain p-2"
                  />
                </Link>

                {/* Details & Rating */}
                <div className="mt-4 pt-3 border-t border-[#2C1704]/5">
                  <div className="flex items-baseline justify-between gap-2">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C1704] group-hover:text-[#E08447] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                    <span className="font-serif font-bold text-base text-[#D37335] shrink-0">
                      {item.rating}
                    </span>
                  </div>

                  <p className="text-xs text-[#2C1704]/60 mt-0.5 line-clamp-1">
                    {item.sub}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    {/* 3 Stars */}
                    <div className="flex items-center gap-0.5 text-[#E08447]">
                      {[...Array(item.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#E08447]" />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif font-black text-lg text-[#2C1704]">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        onClick={() => handleAdd(item)}
                        className="w-8 h-8 rounded-full bg-[#E08447] hover:bg-[#D37335] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 4. Feature Spotlight: "Best Sweet Potatoes & Mountain Crisps" ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10 sm:py-14 border-t border-[#2C1704]/10">
          <div className="lg:col-span-7">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#2C1704] leading-tight mb-3">
              Best Organic Roots <br />
              For Vital Living
            </h2>
            <p className="text-sm sm:text-base text-[#2C1704]/75 max-w-lg leading-relaxed mb-6 font-sans">
              Naturally harvested from rich Himalayan soil, sun-cured and gently milled into nutrient-dense powders and crispy wholefood slices. Ideal for vitality and daily stamina.
            </p>
            <Link
              href="/products/sweet-potato-powder"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D37335] hover:underline"
            >
              <span>Explore Root Harvest</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-[240px] sm:w-[300px] aspect-square rounded-full overflow-hidden shadow-[0_20px_40px_rgba(44,23,4,0.18)] border-6 border-white/70">
              <Image
                src="/products/authentic-dehydrated-pineapple.jpg"
                alt="Golden Dried Pineapple Slices"
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* ── 5. Minimalist Service & Booking Strip ── */}
        <div className="pt-8 border-t border-[#2C1704]/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[#2C1704]/80 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-4 h-4 text-[#D37335]" />
            <span>Online ordering</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#D37335]" />
            <span>Express delivery</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-[#D37335]" />
            <span>VIP Membership</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#D37335]" />
            <span>100% Pure certified</span>
          </div>
        </div>

      </div>
    </section>
  );
}
