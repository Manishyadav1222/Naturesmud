'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Sprout,
  Recycle,
  Leaf,
  Sparkles,
  MapPin,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Flag,
  Heart,
  Droplets,
  Zap,
  Globe,
  Compass,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function OurPromisesSection() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showLabModal, setShowLabModal] = useState<boolean>(false);

  const promises = [
    {
      id: 'purity',
      number: '01',
      tag: 'Certified Purity',
      title: '100% Raw Himalayan Purity',
      subtitle: 'Zero Chemicals. Zero Additives. Unprocessed High-Altitude Potency.',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 via-primary/15 to-emerald-600/10',
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300/60',
      borderColor: 'group-hover:border-emerald-500/40',
      glowColor: 'from-emerald-500/20 via-primary/20 to-emerald-700/10',
      image: '/products/superfood-mix-2.jpg',
      metrics: [
        { label: 'Purity Tested', value: '100% Pure', icon: Droplets },
        { label: 'Synthetic Chemicals', value: '0.0%', icon: Zap },
        { label: 'Lab Parameters', value: '40+ Tested', icon: Award },
      ],
      points: [
        '3rd-Party Certified for 40+ pesticide residues and heavy metals',
        'Sun-dried at low temperatures to lock in delicate antioxidants',
        'Strictly free from refined sugars, preservatives, or artificial dyes',
      ],
      interactivePill: '🧪 Lab Report Batch #NM-2026 Verified',
    },
    {
      id: 'fairtrade',
      number: '02',
      tag: 'Direct Provenance',
      title: '180+ Smallholder Organic Farms',
      subtitle: 'Direct Fair-Trade Across Mustang, Jumla & The Himalayan Foothills.',
      icon: Sprout,
      color: 'from-amber-500/20 via-gold/15 to-amber-600/10',
      accentColor: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300/60',
      borderColor: 'group-hover:border-amber-500/40',
      glowColor: 'from-amber-500/20 via-gold/20 to-amber-700/10',
      image: '/products/walnuts.jpg',
      metrics: [
        { label: 'Organic Partners', value: '180+ Farms', icon: Users },
        { label: 'Middlemen Cut', value: '0%', icon: ShieldCheck },
        { label: 'Women-Led Co-ops', value: '68%', icon: Heart },
      ],
      points: [
        'Direct fair-wage contracts with mountain smallholder cooperatives',
        'Full seed-to-shelf traceability: know exactly which region grew your food',
        'Supporting regenerative organic agriculture across 7 provinces of Nepal',
      ],
      interactivePill: '🏔️ Direct Sourced from Mustang & Jumla',
    },
    {
      id: 'sustainability',
      number: '03',
      tag: 'Earth Regenerative',
      title: 'Zero-Plastic Circular Lifecycle',
      subtitle: 'Amber Glass, Natural Jute & 100% Biodegradable Packaging.',
      icon: Recycle,
      color: 'from-primary/20 via-lime-500/15 to-primary-700/10',
      accentColor: 'text-primary-700',
      badgeBg: 'bg-primary-100 text-primary-900 border-primary-300/60',
      borderColor: 'group-hover:border-primary-500/40',
      glowColor: 'from-primary/20 via-lime-500/20 to-primary-700/10',
      image: '/products/pumpkin-seeds.jpg',
      metrics: [
        { label: 'Plastic Eliminated', value: '50K+ Jars', icon: Globe },
        { label: 'Recyclable Glass', value: '100%', icon: Recycle },
        { label: 'Seed Paper Tags', value: 'Plantable', icon: Leaf },
      ],
      points: [
        'UV-blocking recyclable amber glass jars keep delicate superfoods fresh',
        'Biodegradable natural jute outer sacks handmade by local artisans',
        'Circular Jar Return Program: Get Rs. 50 off when returning empty jars',
      ],
      interactivePill: '🌱 100% Plastic-Free & Reusable',
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-cream-50 via-white to-cream-50/80">
      {/* Background ambient decorative elements */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-nm relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-14 lg:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/15 via-gold/15 to-emerald-500/15 border border-primary/20 text-primary font-bold text-xs sm:text-sm tracking-wide shadow-xs mb-4">
            <Sparkles className="w-4 h-4 text-gold-600 animate-pulse" />
            <span>03 — Sacred Himalayan Promises</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-ink/70 font-semibold">Unbroken Integrity</span>
          </div>

          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-ink leading-tight">
            From Soil to Soul, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-emerald-700 to-primary-700 bg-clip-text text-transparent">
              Guarded by Pure Integrity
            </span>
          </h2>

          <p className="section-subtitle text-ink/70 text-base sm:text-lg mt-4 leading-relaxed max-w-2xl mx-auto">
            We don&apos;t just sell organic food — we nurture an unbroken covenant between Himalayan nature,
            honest smallholder farmers, and your family&apos;s daily vitality.
          </p>
        </ScrollReveal>

        {/* 3 Interactive Master Promise Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {promises.map((promise, index) => {
            const Icon = promise.icon;
            return (
              <ScrollReveal
                key={promise.id}
                direction={index === 0 ? 'left' : index === 2 ? 'right' : 'up'}
                delay={index * 0.12}
                duration={0.8}
                className="h-full"
              >
                <div
                  className={`group relative h-full rounded-[2.2rem] bg-white border border-ink/8 p-6 sm:p-7 shadow-[0_15px_45px_rgba(43,43,43,0.06)] hover:shadow-[0_25px_65px_rgba(58,107,53,0.14)] transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-default ${promise.borderColor}`}
                >
                  {/* Subtle Top Glow on Hover */}
                  <div
                    className={`absolute -top-24 -right-24 w-52 h-52 bg-gradient-to-bl ${promise.glowColor} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div>
                    {/* Top Pill Row: Big Number & Badge */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className="font-heading font-black text-3xl sm:text-4xl text-ink/20 group-hover:text-primary transition-colors duration-300">
                        {promise.number}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-2xs flex items-center gap-1.5 ${promise.badgeBg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {promise.tag}
                      </span>
                    </div>

                    {/* Card Title & Subtitle */}
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-ink group-hover:text-primary transition-colors duration-300 leading-snug">
                      {promise.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/65 mt-2 leading-relaxed">
                      {promise.subtitle}
                    </p>

                    {/* Interactive 3-Metric Strip */}
                    <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-2xl bg-cream-50/90 border border-ink/5">
                      {promise.metrics.map((m, mIdx) => {
                        const MetricIcon = m.icon;
                        return (
                          <div key={mIdx} className="text-center">
                            <div className="flex justify-center mb-1 text-primary">
                              <MetricIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="font-heading font-extrabold text-xs sm:text-sm text-ink leading-tight">
                              {m.value}
                            </div>
                            <div className="text-[10px] text-ink/55 font-medium mt-0.5 truncate">
                              {m.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Key Checklist Points */}
                    <ul className="space-y-2.5 my-4">
                      {promise.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink/80 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Interactive Trigger Pill */}
                  <div className="pt-4 border-t border-ink/6 mt-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-ink/75 group-hover:text-primary transition-colors">
                      <span className="inline-flex items-center gap-1.5">
                        {promise.interactivePill}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Master Guarantee Ribbon / Interactive Seal */}
        <ScrollReveal direction="up" delay={0.3} distance={25} className="mt-12 lg:mt-16">
          <div className="relative rounded-[2.2rem] bg-gradient-to-r from-[#173a1d] via-[#21522a] to-[#123524] p-7 sm:p-9 text-white shadow-[0_20px_50px_rgba(23,58,29,0.3)] overflow-hidden">
            {/* Ambient gold/emerald glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Shield Icon & Nepal Guarantee */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-white shadow-xs backdrop-blur-md">
                    <Flag className="w-3.5 h-3.5 text-gold-300" />
                    Himalayan Origin Promise
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold/25 border border-gold/40 text-xs font-black text-gold-200">
                    <Award className="w-3.5 h-3.5" />
                    100% Money-Back Guarantee
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                  Taste the Pure Himalayan Difference, Risk-Free
                </h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  If any Nature&apos;s Mud product does not delight your senses with unmatched freshness,
                  purity, and mountain potency, we will refund 100% of your payment or deliver a fresh replacement with zero hassles.
                </p>
              </div>

              {/* Right Column: Actions */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3">
                <Link
                  href="/our-story"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-400 via-gold to-gold-500 text-[#173a1d] font-heading font-bold text-sm shadow-[0_4px_16px_rgba(217,164,65,0.4)] hover:shadow-[0_8px_24px_rgba(217,164,65,0.5)] hover:scale-[1.02] active:scale-98 transition-all duration-300"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Farm Stories</span>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-heading font-semibold text-sm backdrop-blur-md transition-all duration-300"
                >
                  <span>Shop Pure Harvest</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
