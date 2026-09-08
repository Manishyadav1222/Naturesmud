'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Heart, ShoppingBag, Award, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from 'sonner';

const SIGNATURE_ITEMS = [
  {
    id: 'dehydrated-mango',
    slug: 'dehydrated-mango',
    title: 'Sun-Dehydrated Mango',
    subtitle: 'Zero Added Sugar · 100% Pura',
    price: 595,
    compareAtPrice: 650,
    weight: '100 GM',
    image: '/products/authentic-dehydrated-mango.jpg',
    tag: 'Bestseller',
    color: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-400/30',
  },
  {
    id: 'roasted-cashews',
    slug: 'roasted-cashews',
    title: 'Royal Roasted Cashews',
    subtitle: 'Himalayan Rock Salted · Mountain Grown',
    price: 750,
    compareAtPrice: 850,
    weight: '150 GM',
    image: '/products/authentic-cashewnuts-roasted.jpg',
    tag: 'Mountain Harvest',
    color: 'from-amber-600/10 to-yellow-600/10',
    borderColor: 'border-yellow-400/30',
  },
  {
    id: 'pure-shilajit-resin',
    slug: 'pure-shilajit-resin',
    title: 'Mustang Shilajit Resin',
    subtitle: '60%+ Fulvic Acid · Surya Tapi',
    price: 890,
    compareAtPrice: 990,
    weight: '15 GM',
    image: '/products/shilajit.jpg',
    tag: 'Ancient Elixir',
    color: 'from-emerald-600/10 to-amber-700/10',
    borderColor: 'border-emerald-400/30',
  },
];

export default function GoldenSignatureShowcase() {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section className="relative w-full py-12 sm:py-16 bg-[#FBF7EE] text-[#2C1802]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EADCC1] text-[#4A2E05] text-xs font-heading font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Signature Harvest Selection
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#2B1702] tracking-tight">
            Crafted by Nature, Perfected by Tradition
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#614217] font-medium">
            Experience our top three hand-harvested organic staples cherished by over 25,000 families across Nepal.
          </p>
        </div>

        {/* 3-Card Signature Showcase Grid (Image 1 Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SIGNATURE_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-[28px] p-5 sm:p-6 bg-gradient-to-b ${item.color} bg-white border ${item.borderColor} shadow-[0_12px_28px_rgba(71,37,0,0.06)] hover:shadow-[0_20px_40px_rgba(71,37,0,0.12)] transition-all duration-300 flex flex-col justify-between group overflow-hidden`}
            >
              {/* Top Tag */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-heading font-extrabold uppercase tracking-wider bg-[#2C1802] text-white">
                  {item.tag}
                </span>
                <span className="text-xs font-mono font-bold text-[#6B4B1B] bg-white/80 px-2.5 py-1 rounded-full border border-amber-200/60 shadow-2xs">
                  {item.weight}
                </span>
              </div>

              {/* Product Image Stage */}
              <Link
                href={`/products/${item.slug}`}
                className="relative block w-full aspect-square my-2 rounded-2xl overflow-hidden bg-white/60 p-4 group-hover:bg-white transition-colors duration-300"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Details & Action */}
              <div className="pt-4 border-t border-amber-200/40">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-heading font-black text-lg text-[#2C1802] group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs text-[#6B4B1B] font-medium mt-1 line-clamp-1">{item.subtitle}</p>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-heading font-extrabold text-xl text-[#2C1802]">
                      {formatPrice(item.price)}
                    </span>
                    {item.compareAtPrice && (
                      <span className="text-xs text-gray-400 line-through ml-2">
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      addItem({
                        id: item.id,
                        slug: item.slug,
                        name: item.title,
                        price: item.price,
                        compareAtPrice: item.compareAtPrice,
                        image: item.image,
                        weight: item.weight,
                        category: 'Signature',
                      });
                      toast.success(`${item.title} added to cart`);
                    }}
                    className="px-4 py-2.5 rounded-full bg-[#E5AA28] hover:bg-[#D49816] text-[#2B1702] font-heading font-extrabold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Quick Order</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Provenance Strip from Image 1 */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#F4EBD7] border border-[#E5D7BC] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-amber-200/50">
              <Award className="w-7 h-7 text-[#7A3F00]" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-[#2C1802]">
                Traditional Ayurvedic Heritage
              </h4>
              <p className="text-xs sm:text-sm text-[#5C3B0D] font-medium">
                Sustainably harvested using 40-day sun purification and gentle low-temperature dehydration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:border-l md:border-[#DECDB0] md:pl-6">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-amber-200/50">
              <ShieldCheck className="w-7 h-7 text-[#2D5A27]" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-[#2C1802]">
                100% Certified Heavy Metal Free
              </h4>
              <p className="text-xs sm:text-sm text-[#5C3B0D] font-medium">
                Third-party laboratory tested for microbial safety, heavy metals, and maximum phytochemical bio-vitality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
