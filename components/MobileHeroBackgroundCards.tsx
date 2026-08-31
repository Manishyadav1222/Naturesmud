'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface PosterTheme {
  id: string;
  title: string;
  image: string;
  primary: string;
  secondary: string;
  accent: string;
  headingColor: string;
  btnGradient: string;
  btnShadow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  pillBg: string;
}

export const POSTER_THEMES: PosterTheme[] = [
  {
    id: 'chia-power',
    title: 'Chia Power',
    image: '/images/posters/chia-power.jpg',
    primary: '#0D9488', // Emerald Teal
    secondary: '#0F766E',
    accent: '#14B8A6',
    headingColor: '#0F766E',
    btnGradient: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
    btnShadow: 'rgba(15, 118, 110, 0.45)',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-900',
    badgeBorder: 'border-teal-300/60',
    pillBg: 'bg-teal-500/10 text-teal-900 border-teal-500/20',
  },
  {
    id: 'tropical-crunch',
    title: 'Tropical Crunch',
    image: '/images/posters/tropical-crunch.jpg',
    primary: '#D97706', // Golden Amber
    secondary: '#B45309',
    accent: '#F59E0B',
    headingColor: '#B45309',
    btnGradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
    btnShadow: 'rgba(217, 119, 6, 0.45)',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300/60',
    pillBg: 'bg-amber-500/10 text-amber-900 border-amber-500/20',
  },
  {
    id: 'blueberry-bite',
    title: 'Blueberry Bite',
    image: '/images/posters/blueberry-bite.jpg',
    primary: '#7C3AED', // Deep Royal Berry
    secondary: '#6D28D9',
    accent: '#8B5CF6',
    headingColor: '#6D28D9',
    btnGradient: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
    btnShadow: 'rgba(109, 40, 217, 0.45)',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-900',
    badgeBorder: 'border-purple-300/60',
    pillBg: 'bg-purple-500/10 text-purple-900 border-purple-500/20',
  },
  {
    id: 'papaya-pop',
    title: 'Papaya Pop',
    image: '/images/posters/papaya-pop.jpg',
    primary: '#EA580C', // Vibrant Papaya Orange
    secondary: '#C2410C',
    accent: '#FB923C',
    headingColor: '#C2410C',
    btnGradient: 'linear-gradient(135deg, #EA580C 0%, #9A3412 100%)',
    btnShadow: 'rgba(234, 88, 12, 0.45)',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-900',
    badgeBorder: 'border-orange-300/60',
    pillBg: 'bg-orange-500/10 text-orange-900 border-orange-500/20',
  },
];

interface MobileHeroBackgroundCardsProps {
  activeIdx?: number;
  onIndexChange?: (idx: number) => void;
}

export default function MobileHeroBackgroundCards({
  activeIdx: controlledIdx,
  onIndexChange,
}: MobileHeroBackgroundCardsProps) {
  const [internalIdx, setInternalIdx] = useState(0);
  const activeIdx = controlledIdx !== undefined ? controlledIdx : internalIdx;

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIdx = (activeIdx + 1) % POSTER_THEMES.length;
      if (onIndexChange) {
        onIndexChange(nextIdx);
      } else {
        setInternalIdx(nextIdx);
      }
    }, 4500); // Transitions every 4.5 seconds
    return () => clearInterval(timer);
  }, [activeIdx, onIndexChange]);

  const currentPoster = POSTER_THEMES[activeIdx];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none rounded-3xl lg:hidden">
      {/* Dynamic Animated Poster Cross-Fader at 100% Opacity */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentPoster.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full flex items-center justify-center p-2 sm:p-4"
        >
          {/* Ambient blurred backdrop for rich, saturated depth */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={currentPoster.image}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center blur-2xl opacity-90 scale-110"
            />
          </div>

          {/* 100% Opacity Vibrant Poster Image */}
          <div className="relative w-full h-full max-w-full max-h-full">
            <Image
              src={currentPoster.image}
              alt={currentPoster.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain object-center opacity-100"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Subtle Transparent Contrast Gradients for Crystal Clear Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[#FAF7F2]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/10 to-transparent" />
    </div>
  );
}
