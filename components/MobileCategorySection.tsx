'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';
import { categories } from '@/lib/data/categories';
import { resolveImageUrl } from '@/lib/utils';

const CATEGORY_META: Record<string, { tag: string; bgGradient: string; badgeColor: string }> = {
  'dried-fruits': {
    tag: 'Sun-Dried & Raw',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
  },
  'powders': {
    tag: '0% White Sugar',
    bgGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
  },
  'nuts': {
    tag: 'Grade-A Whole',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  },
  'seeds': {
    tag: 'Omega-3 Rich',
    bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
  },
  'oils': {
    tag: '100% Cold-Pressed',
    bgGradient: 'from-cyan-500/10 via-teal-500/5 to-transparent',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
  },
  'salts-spices': {
    tag: 'Ancient Mineral',
    bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
  },
};

export default function MobileCategorySection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-12 mt-4 sm:mt-6 lg:mt-8 pt-2 pb-2">
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-[#EAE3D6] shadow-sm">
        {/* Header Row */}
        <div className="flex items-end justify-between mb-3.5 px-1">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] lg:text-xs font-bold uppercase tracking-[0.18em] text-[#7A5230]">
              <Sparkles className="w-3.5 h-3.5 text-[#1A3826]" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-heading font-extrabold text-[#242220] tracking-tight mt-0.5">
              Shop by Category
            </h2>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-1 text-xs lg:text-sm font-bold text-[#1A3826] hover:text-primary transition-colors py-1 pl-2"
          >
            <span>View All ({categories.length})</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Category Grid: 3 cols on mobile, 6 cols on tablet & laptop */}
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug] || {
              tag: 'Single Origin',
              bgGradient: 'from-amber-500/10 to-transparent',
              badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
            };

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative flex flex-col justify-between bg-[#FAF7F2] rounded-2xl p-2 sm:p-3 lg:p-3.5 border border-[#EAE3D6]/70 shadow-2xs hover:shadow-md hover:border-[#1A3826]/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                {/* Subtle Ambient Color Glow Behind Image */}
                <div className={`absolute inset-0 bg-gradient-to-b ${meta.bgGradient} opacity-60 pointer-events-none`} />

                {/* Category Image */}
                <div className="relative aspect-square w-full rounded-xl lg:rounded-2xl overflow-hidden bg-white mb-2 z-10">
                  <Image
                    src={resolveImageUrl(cat.image)}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 16vw, 180px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Arrow Icon in Top Right */}
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                    <ArrowUpRight className="w-3 h-3 text-[#1A3826]" />
                  </div>
                </div>

                {/* Category Name & Count */}
                <div className="relative z-10 text-center">
                  <h3 className="font-heading font-extrabold text-[11px] sm:text-xs lg:text-sm text-[#242220] leading-tight line-clamp-1 group-hover:text-[#1A3826] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="inline-block text-[9px] sm:text-[10px] lg:text-[11px] text-[#242220]/60 font-medium mt-0.5">
                    {cat.productCount} {cat.productCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
