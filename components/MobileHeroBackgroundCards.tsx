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
  overlayFrom: string;
  overlayTo: string;
}

export const POSTER_THEMES: PosterTheme[] = [
  {
    id: 'papaya-pop',
    title: 'Papaya Pop',
    image: '/images/posters/papaya-pop.jpg',
    primary: '#EA580C',
    secondary: '#C2410C',
    accent: '#FB923C',
    headingColor: '#C2410C',
    btnGradient: 'linear-gradient(135deg, #EA580C 0%, #9A3412 100%)',
    btnShadow: 'rgba(234, 88, 12, 0.45)',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-900',
    badgeBorder: 'border-orange-300/60',
    pillBg: 'bg-orange-500/10 text-orange-900 border-orange-500/20',
    overlayFrom: 'rgba(234,88,12,0.45)',
    overlayTo: 'rgba(80,15,0,0.82)',
  },
  {
    id: 'chia-power',
    title: 'Chia Power',
    image: '/images/posters/chia-power.jpg',
    primary: '#0D9488',
    secondary: '#0F766E',
    accent: '#14B8A6',
    headingColor: '#0F766E',
    btnGradient: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
    btnShadow: 'rgba(15, 118, 110, 0.45)',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-900',
    badgeBorder: 'border-teal-300/60',
    pillBg: 'bg-teal-500/10 text-teal-900 border-teal-500/20',
    overlayFrom: 'rgba(13,148,136,0.48)',
    overlayTo: 'rgba(2,44,34,0.84)',
  },
  {
    id: 'blueberry-bite',
    title: 'Blueberry Bite',
    image: '/images/posters/blueberry-bite.jpg',
    primary: '#7C3AED',
    secondary: '#6D28D9',
    accent: '#8B5CF6',
    headingColor: '#6D28D9',
    btnGradient: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
    btnShadow: 'rgba(109, 40, 217, 0.45)',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-900',
    badgeBorder: 'border-purple-300/60',
    pillBg: 'bg-purple-500/10 text-purple-900 border-purple-500/20',
    overlayFrom: 'rgba(109,40,217,0.48)',
    overlayTo: 'rgba(20,5,50,0.84)',
  },
  {
    id: 'sweet-vibes',
    title: 'Sweet Vibes',
    image: '/images/posters/sweet-vibes.jpg',
    primary: '#BE185D',
    secondary: '#9D174D',
    accent: '#EC4899',
    headingColor: '#9D174D',
    btnGradient: 'linear-gradient(135deg, #BE185D 0%, #831843 100%)',
    btnShadow: 'rgba(190, 24, 93, 0.45)',
    badgeBg: 'bg-pink-50',
    badgeText: 'text-pink-900',
    badgeBorder: 'border-pink-300/60',
    pillBg: 'bg-pink-500/10 text-pink-900 border-pink-500/20',
    overlayFrom: 'rgba(190,24,93,0.45)',
    overlayTo: 'rgba(60,0,30,0.82)',
  },
  {
    id: 'tropical-crunch',
    title: 'Tropical Crunch',
    image: '/images/posters/tropical-crunch.jpg',
    primary: '#D97706',
    secondary: '#B45309',
    accent: '#F59E0B',
    headingColor: '#B45309',
    btnGradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
    btnShadow: 'rgba(217, 119, 6, 0.45)',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300/60',
    pillBg: 'bg-amber-500/10 text-amber-900 border-amber-500/20',
    overlayFrom: 'rgba(217,119,6,0.45)',
    overlayTo: 'rgba(60,20,0,0.82)',
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
    // Only run poster cycling on mobile & tablet
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) return;

    const timer = setInterval(() => {
      const nextIdx = (activeIdx + 1) % POSTER_THEMES.length;
      if (onIndexChange) {
        onIndexChange(nextIdx);
      } else {
        setInternalIdx(nextIdx);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIdx, onIndexChange]);

  const currentPoster = POSTER_THEMES[activeIdx] || POSTER_THEMES[0];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none lg:hidden rounded-[inherit]">
      {/* Full-bleed animated poster image background with 3-second cycle — ONLY on Mobile and Tablet */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-img-${currentPoster.id}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={currentPoster.image}
            alt={currentPoster.title}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 0px"
            className="object-cover object-center opacity-90"
            style={{ filter: 'saturate(1.25) brightness(0.85)' }}
          />
          {/* Gradient overlay to keep text readable while showing the poster colors */}
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `linear-gradient(165deg, ${currentPoster.overlayFrom} 0%, ${currentPoster.overlayTo} 100%)`,
            }}
          />
          {/* Bottom fade to cream page background */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Floating ambient aura dots matching theme color */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`aura-${currentPoster.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute -top-10 -right-10 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: currentPoster.accent }}
        />
        <motion.div
          key={`aura2-${currentPoster.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, delay: 0.15 }}
          className="absolute -bottom-6 -left-6 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: currentPoster.primary }}
        />
      </AnimatePresence>
    </div>
  );
}
