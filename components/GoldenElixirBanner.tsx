'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Leaf, Droplets } from 'lucide-react';

export default function GoldenElixirBanner() {
  return (
    <section className="relative w-full py-12 sm:py-16 bg-[#F5EFE0] text-[#2C1802]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Card: Organic Certification & Purity Specs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 rounded-[32px] p-6 sm:p-8 bg-[#EFE3C8] border border-[#DFCFA8] shadow-[0_12px_28px_rgba(71,37,0,0.06)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-[#2C1802] text-white">
                  <Leaf className="w-5 h-5" />
                </span>
                <span className="font-heading font-black text-lg sm:text-xl text-[#2C1802]">
                  NOCB Certified Organic
                </span>
              </div>

              <p className="text-sm text-[#5C3B0D] font-medium leading-relaxed mb-6">
                Cultivated in chemical-free Himalayan soils with glacial meltwater. Every harvest is strictly traceable back to our individual partner farmer families.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  '0 Preservatives, Colors, or Synthetic Additives',
                  'Surya Tapi 40-Day Sunlight Resin Purification',
                  'Low-Temperature Dehydration Retaining 98% Enzymes',
                  'Non-GMO & Single-Origin Verified by GPS',
                ].map((spec, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-[#3D2305]">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#DFCFA8] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#7A5319] uppercase tracking-wider block">Lab Batch</span>
                <span className="font-heading font-black text-sm text-[#2C1802]">HIM-2026-NOCB-99.8%</span>
              </div>
              <Link
                href="/about"
                className="text-xs font-heading font-extrabold text-[#7A3F00] hover:text-[#2C1802] flex items-center gap-1 transition-colors"
              >
                <span>Read Full Quality Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Card: Bottled Superfood Elixirs & Essences Showcase (Image 1 Style) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-[32px] p-6 sm:p-10 bg-gradient-to-br from-[#FAF0D4] via-[#F6E4BA] to-[#EDD295] border border-[#E3CCA0] shadow-[0_16px_36px_rgba(71,37,0,0.08)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 max-w-sm text-center md:text-left relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D2000] text-white text-[10px] font-heading font-extrabold uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Pure Vitality Series
              </span>

              <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#2B1702] tracking-tight leading-tight">
                Superfood Elixirs & Daily Essences
              </h3>

              <p className="text-xs sm:text-sm text-[#5C3B0D] font-medium leading-relaxed">
                Rejuvenate your cellular energy with wild Himalayan honey, moringa extract, and natural beetroot nitric-oxide vitality drinks.
              </p>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3D2000] hover:bg-[#241300] text-white font-heading font-extrabold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Product Pack Visual */}
            <div className="relative w-full max-w-[260px] aspect-square shrink-0">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 bg-white/40 backdrop-blur-md p-2">
                <Image
                  src="/products/raw-honey.jpg"
                  alt="Superfood Bottled Harvest"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
