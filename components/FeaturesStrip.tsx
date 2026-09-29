'use client';

import React from 'react';
import { Truck, ShieldCheck, Recycle, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface FeaturesStripProps {
  className?: string;
  variant?: 'light' | 'dark' | 'glass';
}

export default function FeaturesStrip({ className = '', variant = 'light' }: FeaturesStripProps) {
  const isDark = variant === 'dark';

  const features = [
    {
      icon: Truck,
      badge: '🇳🇵 All 77 Districts',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      title: 'Free Shipping Over Rs. 3,000',
      desc: 'On all orders across Nepal · 24-48 hr Express Delivery',
      accentColor: 'from-emerald-500 to-teal-700',
      iconBg: 'bg-emerald-100 text-emerald-800',
      animation: 'truck-run'
    },
    {
      icon: ShieldCheck,
      badge: '✨ Lab Tested Purity',
      badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      title: '0 Additives · 0 Preservatives',
      desc: '100% Pure Himalayan Wholesomeness · Zero Cane Sugar',
      accentColor: 'from-amber-500 to-yellow-700',
      iconBg: 'bg-amber-100 text-amber-800',
      animation: 'shield-pulse'
    },
    {
      icon: Recycle,
      badge: '♻️ Zero Plastic',
      badgeColor: 'bg-lime-500/10 text-lime-700 border-lime-500/20',
      title: 'Earth-Friendly Packaging',
      desc: 'Recyclable amber glass jars & biodegradable pouches',
      accentColor: 'from-lime-500 to-green-700',
      iconBg: 'bg-lime-100 text-lime-800',
      animation: 'leaf-spin'
    },
    {
      icon: Sparkles,
      badge: '🏔️ Direct Mountain Sourcing',
      badgeColor: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
      title: 'Farm Fresh Daily',
      desc: 'Direct ethical sourcing from farmers, no middlemen',
      accentColor: 'from-rose-500 to-pink-700',
      iconBg: 'bg-rose-100 text-rose-800',
      animation: 'star-glow'
    },
  ];

  return (
    <ScrollReveal direction="up" distance={20}>
      <section
        className={`w-full overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-[#0F2417] via-[#143020] to-[#0E1F15] text-white py-8 border-y border-gold/20'
            : 'bg-gradient-to-b from-[#FCFBF8] via-[#FAF6ED] to-[#F5F0E4] py-8 sm:py-10 border-y border-ink/8 shadow-2xs'
        } ${className}`}
      >
        <div className="container-nm px-3 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/50 shadow-lg'
                      : 'bg-white/90 hover:bg-white border border-[#E8DEC9] hover:border-[#C5A059] shadow-soft hover:shadow-xl'
                  }`}
                >
                  {/* Subtle Shimmer Ray on Hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                  {/* Top Badge & Animated Icon */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${feature.badgeColor}`}>
                        {feature.badge}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${feature.iconBg} shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        <Icon className="w-6 h-6 transition-transform duration-500 group-hover:scale-110" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4
                          className={`font-heading font-extrabold text-sm sm:text-base leading-snug transition-colors ${
                            isDark ? 'text-white group-hover:text-gold-300' : 'text-[#143020] group-hover:text-[#235338]'
                          }`}
                        >
                          {feature.title}
                        </h4>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            isDark ? 'text-white/70' : 'text-ink/65'
                          }`}
                        >
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Micro Trust Indicator */}
                  <div
                    className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-medium ${
                      isDark ? 'border-white/10 text-gold-300/80' : 'border-ink/5 text-[#7A5230]'
                    }`}
                  >
                    <span className="flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Guarantee
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-xs font-bold">
                      Explore <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
