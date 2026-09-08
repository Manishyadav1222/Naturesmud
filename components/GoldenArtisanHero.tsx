'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Star, Heart, Award } from 'lucide-react';

export default function GoldenArtisanHero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F7BF38] via-[#F4AA18] to-[#EF9C08] text-[#2C1802] pt-6 pb-20 sm:pt-10 sm:pb-28">
      {/* Background Decorative Sunburst & Texture */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#804b00_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#FFE58F]/30 blur-2xl pointer-events-none" />

      {/* Floating Organic Garnish (Berries, Leaves, Nuts) */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 left-6 sm:left-16 w-14 sm:w-20 aspect-square pointer-events-none z-10 drop-shadow-lg"
      >
        <Image
          src="/products/authentic-dehydrated-apple.jpg"
          alt="Apple Chips"
          width={80}
          height={80}
          className="rounded-full object-cover border-2 border-white/60 shadow-md rotate-[-12deg]"
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-20 right-8 sm:right-24 w-16 sm:w-24 aspect-square pointer-events-none z-10 drop-shadow-xl"
      >
        <Image
          src="/products/cranberries-dried.jpg"
          alt="Ruby Cranberries"
          width={90}
          height={90}
          className="rounded-full object-cover border-2 border-white/70 shadow-lg rotate-[15deg]"
        />
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Main Grid: Content Left, Hero Bowl Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Action Pills */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#7A3F00]" />
              <span className="text-xs sm:text-sm font-heading font-extrabold uppercase tracking-wider text-[#472500]">
                Single-Origin Himalayan Harvest · Est. 2019
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-[#2B1702] tracking-tight leading-[1.08]"
            >
              Pure Food.{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#472200]">Real Nature.</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-white/40 -rotate-1 rounded-sm -z-0" />
              </span>{' '}
              0 Additives.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#4A2E05] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Naturally dehydrated organic fruits, wild cliff shilajit, raw honey, and wholefood superfood powders sourced directly from 180+ small Himalayan family farms.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <Link
                href="/products"
                className="px-7 py-3.5 rounded-full bg-[#3D2000] hover:bg-[#271400] text-white font-heading font-bold text-sm sm:text-base shadow-[0_8px_20px_rgba(61,32,0,0.3)] hover:shadow-[0_12px_28px_rgba(61,32,0,0.4)] transition-all duration-300 active:scale-95 flex items-center gap-2 group"
              >
                <span>Explore Harvest</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/offers"
                className="px-6 py-3.5 rounded-full bg-white/40 hover:bg-white/60 text-[#3D2000] font-heading font-bold text-sm sm:text-base border border-white/60 backdrop-blur-md transition-all duration-300 active:scale-95 flex items-center gap-2"
              >
                <span>Festival Offers 🔥</span>
              </Link>
            </motion.div>

            {/* Floating Mini Highlight Badges (Image 1 Style) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 text-left"
            >
              <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-[#2C1802]" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs text-[#2C1802]">Daily Ritual</h4>
                  <p className="text-[11px] text-[#523306] font-medium">100% Lab Tested Purity</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5 text-[#2C1802]" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs text-[#2C1802]">Karnali 3,500m</h4>
                  <p className="text-[11px] text-[#523306] font-medium">Single-Origin Sourced</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Superfood Bowl Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Background Disc */}
            <div className="absolute w-[320px] sm:w-[460px] aspect-square rounded-full bg-gradient-to-tr from-white/30 to-white/10 blur-xl pointer-events-none" />

            {/* The Main Hero Bowl & Fresh Harvest */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-full max-w-[480px] aspect-square flex items-center justify-center"
            >
              <div className="relative w-[92%] h-[92%] rounded-3xl overflow-hidden shadow-[0_24px_50px_rgba(71,37,0,0.35)] border-4 border-white/80 bg-white/20 backdrop-blur-md">
                <Image
                  src="/products/naturesmud-all-products-100g.jpg"
                  alt="NaturesMud Himalayan Superfood Feast"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Floating Product Spotlight Pill 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 sm:left-2 p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white shadow-xl flex items-center gap-3 z-30"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-amber-50">
                  <Image
                    src="/products/authentic-dehydrated-mango.jpg"
                    alt="Dehydrated Mango"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>4.9 / 5.0</span>
                  </div>
                  <h4 className="font-heading font-extrabold text-xs text-[#2C1802]">Sun-Dehydrated Mango</h4>
                  <p className="text-[11px] text-gray-500 font-semibold">Rs. 595 · Standup Pouch</p>
                </div>
              </motion.div>

              {/* Floating Product Spotlight Pill 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-4 -right-4 sm:right-2 p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white shadow-xl flex items-center gap-3 z-30"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-emerald-50">
                  <Image
                    src="/products/shilajit.jpg"
                    alt="Shilajit Resin"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    60%+ Fulvic
                  </span>
                  <h4 className="font-heading font-extrabold text-xs text-[#2C1802]">Mustang Shilajit Resin</h4>
                  <p className="text-[11px] text-gray-500 font-semibold">Rs. 890 · 100% Pure</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 📜 RUSTIC TORN-PAPER BOTTOM DIVIDER (Image 1 Signature Effect) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-10 sm:h-14 text-[#07190F]"
        >
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,110 900,-20 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
