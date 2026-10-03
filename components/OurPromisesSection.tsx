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
  X,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function OurPromisesSection() {
  const [selectedModal, setSelectedModal] = useState<'purity' | 'fairtrade' | 'sustainability' | null>(null);

  const promises = [
    {
      id: 'purity' as const,
      number: '01',
      tag: '0 Additives · 0 Preservatives',
      title: '100% Raw Himalayan Purity',
      subtitle: '0 Additives. 0 Preservatives. Unprocessed High-Altitude Potency.',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 via-primary/15 to-emerald-600/10',
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300/60',
      borderColor: 'group-hover:border-emerald-500/50',
      glowColor: 'from-emerald-500/25 via-primary/20 to-emerald-700/10',
      image: '/images/posters/authenticity-on-every-table.jpg',
      metrics: [
        { label: 'Purity Tested', value: '100% Pure', icon: Droplets },
        { label: '0 Additives', value: 'Verified', icon: Zap },
        { label: '0 Preservatives', value: 'Guaranteed', icon: Award },
      ],
      points: [
        'Strict quality-controlled small-batch dehydration for safety and hygiene',
        'Gently dehydrated below 42°C to lock in delicate antioxidants & enzymes',
        '0 Chemical additives, 0 synthetic preservatives, and zero artificial dyes',
      ],
      interactivePill: '🌿 100% Pure Whole-Food Standard',
      modalTitle: 'NaturesMud Quality & Purity Standards',
      modalSubtitle: 'Small-Batch Low-Temperature Dehydration (<42°C)',
    },
    {
      id: 'fairtrade' as const,
      number: '02',
      tag: 'Direct Provenance',
      title: '280+ Smallholder Farmer Families',
      subtitle: 'Direct Fair-Trade Across Terai, Midland Hills & Himalayan Peaks.',
      icon: Sprout,
      color: 'from-amber-500/20 via-gold/15 to-amber-600/10',
      accentColor: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300/60',
      borderColor: 'group-hover:border-amber-500/50',
      glowColor: 'from-amber-500/25 via-gold/20 to-amber-700/10',
      image: '/products/walnuts.jpg',
      metrics: [
        { label: 'Farm Partners', value: '280+ Families', icon: Users },
        { label: 'Middlemen Cut', value: '0%', icon: ShieldCheck },
        { label: 'Women-Led Co-ops', value: '68%', icon: Heart },
      ],
      points: [
        'Direct fair-wage contracts with smallholder cooperatives across Nepal',
        'Full seed-to-shelf traceability: know exactly which region grew your food',
        'Supporting regenerative agriculture across all ecological belts of Nepal',
      ],
      interactivePill: '🏔️ Direct Sourced from Terai, Hills & Himalayas',
      modalTitle: '280+ Smallholder Mountain Farm Provenance',
      modalSubtitle: 'Seed-to-Shelf Traceability Map · Nepal',
    },
    {
      id: 'sustainability' as const,
      number: '03',
      tag: 'Earth-Friendly',
      title: 'Zero-Plastic Circular Lifecycle',
      subtitle: 'Amber Glass, Natural Jute & Biodegradable Packaging.',
      icon: Recycle,
      color: 'from-primary/20 via-lime-500/15 to-primary-700/10',
      accentColor: 'text-primary-700',
      badgeBg: 'bg-primary-100 text-primary-900 border-primary-300/60',
      borderColor: 'group-hover:border-primary-500/50',
      glowColor: 'from-primary/25 via-lime-500/20 to-primary-700/10',
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
      interactivePill: '🌱 Earth-Friendly & Reusable Packaging',
      modalTitle: 'Circular Packaging & Jar Return Program',
      modalSubtitle: 'Zero-Plastic Philosophy · Earn Rs. 50 per Returned Jar',
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-cream-50 via-white to-cream-50/80">
      {/* Background ambient decorative elements with gentle floating animation */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(58,107,53,0.12)_0%,transparent_70%)] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,164,65,0.10)_0%,transparent_70%)] pointer-events-none animate-float-slower" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none animate-pulse-slow" />

      <div className="container-nm relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/15 via-gold/15 to-emerald-500/15 border border-primary/25 text-primary font-bold text-xs sm:text-sm tracking-wide shadow-xs mb-4">
            <Sparkles className="w-4 h-4 text-gold-600 animate-spin" style={{ animationDuration: '8s' }} />
            <span>03 — Sacred Himalayan Promises</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-ink/80 font-bold">Unbroken Integrity</span>
          </div>

          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-ink leading-tight">
            From Soil to Soul, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-emerald-700 to-primary-700 bg-clip-text text-transparent">
              Guarded by Pure Integrity
            </span>
          </h2>

          <p className="section-subtitle text-ink/75 text-base sm:text-lg mt-4 leading-relaxed max-w-2xl mx-auto">
            We don&apos;t just sell organic food — we nurture an unbroken covenant between Himalayan nature,
            honest smallholder farmers, and your family&apos;s daily vitality.
          </p>
        </ScrollReveal>

        {/* 3 Interactive Master Promise Cards with Framer Motion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-5 lg:gap-8">
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
                <motion.div
                  whileHover={{ y: -8, scale: 1.015 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  onClick={() => setSelectedModal(promise.id)}
                  className={`group relative h-full rounded-3xl lg:rounded-[2.2rem] bg-white border border-ink/10 p-5 sm:p-6 lg:p-7 shadow-[0_15px_45px_rgba(43,43,43,0.06)] hover:shadow-[0_25px_65px_rgba(58,107,53,0.18)] transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer ${promise.borderColor}`}
                >
                  {/* Subtle Dynamic Ambient Glow on Hover */}
                  <div
                    className={`absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-bl ${promise.glowColor} rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div>
                    {/* Visual Media Thumbnail Preview with Glassmorphic Gradient */}
                    <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden mb-5 border border-ink/8 shadow-xs">
                      <Image
                        src={promise.image}
                        alt={promise.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                      {/* Number Badge & Provenance Pill overlay on Image */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="font-heading font-black text-2xl text-white/90 drop-shadow-md">
                          {promise.number}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-xs flex items-center gap-1 backdrop-blur-md bg-white/90 ${promise.badgeBg}`}>
                          <Icon className="w-3 h-3" />
                          {promise.tag}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white/95 text-xs font-semibold">
                        <span className="truncate drop-shadow-xs">{promise.interactivePill}</span>
                        <span className="text-[10px] uppercase font-bold text-amber-300 drop-shadow-xs flex items-center gap-0.5">
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>

                    {/* Card Title & Subtitle */}
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-ink group-hover:text-primary transition-colors duration-300 leading-snug">
                      {promise.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/70 mt-2 leading-relaxed">
                      {promise.subtitle}
                    </p>

                    {/* Interactive 3-Metric Strip */}
                    <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-2xl bg-cream-50/90 group-hover:bg-cream-100/90 border border-ink/5 group-hover:border-primary/20 transition-colors">
                      {promise.metrics.map((m, mIdx) => {
                        const MetricIcon = m.icon;
                        return (
                          <div key={mIdx} className="text-center">
                            <div className="flex justify-center mb-1 text-primary">
                              <MetricIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="font-heading font-extrabold text-xs sm:text-sm text-ink leading-tight">
                              {m.value}
                            </div>
                            <div className="text-[10px] text-ink/60 font-medium mt-0.5 truncate">
                              {m.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Key Checklist Points with animated check icons */}
                    <ul className="space-y-2 my-4">
                      {promise.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink/80 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Interactive Trigger Pill */}
                  <div className="pt-3.5 border-t border-ink/8 mt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-ink/80 group-hover:text-primary transition-colors">
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
                        <span>Interactive Verification</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-primary group-hover:underline">
                        <span>Inspect Proof</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Master Guarantee Ribbon / Interactive Seal with Full Animation */}
        <ScrollReveal direction="up" delay={0.25} distance={25} className="mt-12 lg:mt-16">
          <div className="relative rounded-[2.2rem] bg-gradient-to-r from-[#173a1d] via-[#21522a] to-[#123524] p-7 sm:p-9 lg:p-10 text-white shadow-[0_20px_50px_rgba(23,58,29,0.35)] overflow-hidden border border-white/15">
            {/* Ambient gold/emerald moving aurora glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(217,164,65,0.18)_0%,transparent_70%)] pointer-events-none animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(52,211,153,0.15)_0%,transparent_70%)] pointer-events-none animate-float-slower" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Shield Icon & Nepal Guarantee */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-white shadow-xs backdrop-blur-xs">
                    <Flag className="w-3.5 h-3.5 text-gold-300" />
                    Himalayan Origin Promise
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/30 border border-gold/50 text-xs font-black text-gold-200 shadow-xs animate-pulse">
                    <Award className="w-3.5 h-3.5 text-gold-300" />
                    100% Money-Back Guarantee
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                  Taste the Pure Himalayan Difference, Risk-Free
                </h3>
                <p className="text-white/85 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl font-sans">
                  If any NaturesMud product does not delight your senses with unmatched freshness,
                  purity, and mountain potency, we will refund 100% of your payment or deliver a fresh replacement with zero hassles.
                </p>

                {/* 4 Interactive Guarantee Checkpoints */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    { title: '100% Sensory Delight', desc: 'Taste the real aroma or get a full instant refund', icon: Sparkles },
                    { title: 'Zero-Hassle Return', desc: 'Free doorstep pickup across Kathmandu Valley', icon: ShieldCheck },
                    { title: 'Single-Origin Harvest', desc: 'Direct smallholder mountain provenance', icon: Sprout },
                    { title: '24h Valley Support', desc: 'Instant WhatsApp & phone dedicated concierge', icon: Clock },
                  ].map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xs transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gold/25 border border-gold/40 flex items-center justify-center shrink-0 text-gold-300">
                          <ItemIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white leading-tight">{item.title}</div>
                          <div className="text-[10px] text-white/70 truncate">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Rotating Gold Seal + Actions */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-5">
                {/* 3D Animated Rotating Guarantee Seal */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                  {/* Rotating Circular Border Badge */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-dashed border-gold-300/60 animate-spin"
                    style={{ animationDuration: '20s' }}
                  />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold-500 via-amber-600 to-gold-700 shadow-[0_0_30px_rgba(217,164,65,0.5)] flex flex-col items-center justify-center text-center p-2 border-2 border-white/40">
                    <Award className="w-6 h-6 text-[#173a1d] drop-shadow-xs" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#173a1d] leading-none mt-1">
                      100%
                    </span>
                    <span className="text-[8px] font-extrabold uppercase tracking-tight text-[#173a1d] leading-none mt-0.5">
                      RISK-FREE
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch w-full sm:w-auto gap-3">
                  <Link
                    href="/our-story"
                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-gold to-gold-500 text-[#173a1d] font-heading font-extrabold text-sm shadow-[0_4px_16px_rgba(217,164,65,0.4)] hover:shadow-[0_8px_24px_rgba(217,164,65,0.6)] hover:scale-[1.02] active:scale-98 transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    <Compass className="w-4 h-4" />
                    <span>Explore Farm Stories</span>
                  </Link>

                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-heading font-semibold text-sm transition-all duration-300"
                  >
                    <span>Shop Pure Harvest</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Interactive Verification Proof Modal */}
      <AnimatePresence>
        {selectedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-ink/10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-5 border-b border-ink/8 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NaturesMud Official Guarantee</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-black text-ink">
                    {promises.find((p) => p.id === selectedModal)?.modalTitle}
                  </h3>
                  <p className="text-xs text-ink/65 font-medium mt-0.5">
                    {promises.find((p) => p.id === selectedModal)?.modalSubtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedModal(null)}
                  className="w-8 h-8 rounded-full bg-ink/5 hover:bg-ink/10 text-ink/70 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content conditional on promise ID */}
              {selectedModal === 'purity' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                    <div className="text-xs font-bold text-emerald-900 flex items-center justify-between">
                      <span>Whole-Food Processing Specifications</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black">100% PURE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-ink/60 block">Ingredient Standard</span>
                        <strong className="text-emerald-700 font-bold">100% Single-Origin Whole Food</strong>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-ink/60 block">Dehydration Temperature</span>
                        <strong className="text-emerald-700 font-bold">&lt; 42°C Gently Dried</strong>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-ink/60 block">Chemical Preservatives</span>
                        <strong className="text-emerald-700 font-bold">0.0% (Zero Added)</strong>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-ink/60 block">Refined Sugar / Fillers</span>
                        <strong className="text-emerald-700 font-bold">0.0% (Zero Added)</strong>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-ink/75 leading-relaxed">
                    Every batch of NaturesMud products is prepared in hygienic small batches and sealed in airtight glass jars or food-grade pouches.
                  </p>
                </div>
              )}

              {selectedModal === 'fairtrade' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
                    <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                      <span>Farmer Provenance Network</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600 text-white font-black">280+ FAMILIES</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-100">
                        <span className="font-semibold text-ink">Mustang High-Altitude Belt</span>
                        <span className="text-amber-800 font-bold">Organic Apples & Walnuts</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-100">
                        <span className="font-semibold text-ink">Jumla Mountain Valley</span>
                        <span className="text-amber-800 font-bold">Sun-Dried Beans & Shilajit</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-100">
                        <span className="font-semibold text-ink">Midland Hills (Kavre, Dhading)</span>
                        <span className="text-amber-800 font-bold">Beetroot, Sweet Potato & Carrots</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-100">
                        <span className="font-semibold text-ink">Terai Organic Co-ops</span>
                        <span className="text-amber-800 font-bold">Moringa Leaf & Herbal Extracts</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-ink/75 leading-relaxed">
                    We eliminate middlemen entirely, ensuring smallholder cooperatives receive +35% above standard local market rates.
                  </p>
                </div>
              )}

              {selectedModal === 'sustainability' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-200/80 space-y-2.5">
                    <div className="text-xs font-bold text-primary-900 flex items-center justify-between">
                      <span>Circular Jar Return Program</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-black">EARN RS. 50</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-primary-100">
                        <strong className="block text-primary font-bold">1. Keep Your Amber Glass Jars</strong>
                        <span className="text-ink/70 text-[11px]">UV-protected glass keeps spices, honey, or superfoods fresh indefinitely.</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-primary-100">
                        <strong className="block text-primary font-bold">2. Return 5+ Jars on Your Next Delivery</strong>
                        <span className="text-ink/70 text-[11px]">Our delivery rider collects empty clean jars at your doorstep.</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-primary-100">
                        <strong className="block text-primary font-bold">3. Receive Rs. 50 Discount per Jar</strong>
                        <span className="text-ink/70 text-[11px]">Direct store credit applied instantly to your account or order.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Close / Action footer */}
              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedModal(null)}
                  className="px-4 py-2 rounded-full border border-ink/15 text-ink text-xs font-bold hover:bg-ink/5 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/our-story"
                  onClick={() => setSelectedModal(null)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-700 transition-colors"
                >
                  <span>Learn Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
