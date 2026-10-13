import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dumbbell,
  Zap,
  ShieldCheck,
  Flame,
  HeartPulse,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { getProductBySlug } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Clean Gym & Fitness Nutrition Nepal | Natural Whole Food Fuel | NaturesMud',
  description:
    'Power your workouts with 100% natural fuel in Nepal: Pure Himalayan Shilajit, Beetroot Nitrate Powder, Raw Almonds, Chia Seeds & Superfood Trail Mix.',
  alternates: {
    canonical: `${siteConfig.url}/gym-fitness`,
  },
  openGraph: {
    title: 'Clean Gym & Fitness Nutrition Nepal | Natural Whole Food Fuel | NaturesMud',
    description:
      'Zero artificial fillers, zero maltodextrin. Pure plant-powered pre-workout and post-workout whole-food fuel delivered across Kathmandu and all 77 districts.',
    url: `${siteConfig.url}/gym-fitness`,
    type: 'website',
  },
};

const FITNESS_ITEMS = [
  {
    slug: 'pure-mountain-himalayan-shilajit-resin',
    nepaliName: 'शुद्ध हिमाली शिलाजीत',
    benefit: 'Traditional Himalayan Mineral Resin',
    detail: 'Purified alpine shilajit resin rich in natural fulvic acid and 80+ trace ionic minerals. Supports cellular vitality and recovery.',
    howToUse: 'Dissolve a pea-sized amount (300–500 mg) in warm water or milk in the morning.',
  },
  {
    slug: 'beetroot-powder',
    nepaliName: 'चुकन्दर पाउडर',
    benefit: 'Natural Dietary Nitrates',
    detail: 'Dietary nitrates in beetroot convert into nitric oxide in the body, supporting healthy blood flow and cardiovascular stamina during intense training.',
    howToUse: 'Mix 1–2 teaspoons into your pre-workout shaker bottle 30–45 minutes before exercise.',
  },
  {
    slug: 'raw-himalayan-almonds',
    nepaliName: 'काँचो हिमाली बदाम',
    benefit: 'Clean Plant Protein & Vitamin E',
    detail: 'Cold-shelled, unroasted almonds delivering plant protein, monounsaturated healthy fats, and natural antioxidant alpha-tocopherol.',
    howToUse: 'Consume 10–15 almonds post-workout or soak overnight for easy morning digestion.',
  },
  {
    slug: 'chia-seeds',
    nepaliName: 'चिया सिड्स',
    benefit: 'Plant Omega-3 & Hydration Gel',
    detail: 'Absorbs up to 10x its weight in water to create a soothing mucilage gel. Provides plant ALA omega-3 and soluble dietary fiber.',
    howToUse: 'Soak 1 tablespoon in 250ml water, lemonade, or electrolyte drink for sustained workout hydration.',
  },
  {
    slug: 'pumpkin-seeds',
    nepaliName: 'फर्सीको बिया',
    benefit: 'Zinc, Magnesium & Muscle Recovery',
    detail: 'Naturally dense in dietary magnesium, essential for muscle protein synthesis, electrolyte balance, and neuromuscular recovery.',
    howToUse: 'Add 2 tablespoons to post-workout oats, smoothie bowls, or consume raw.',
  },
  {
    slug: 'superfood-trail-mix',
    nepaliName: 'सुपरफुड मिक्स नट्स',
    benefit: 'Instant Portable Clean Energy',
    detail: 'A balanced blend of energy-dense raw nuts and antioxidant-rich dried berries with 0% added sugar or confectioner glaze.',
    howToUse: 'Keep a jar in your gym bag for an instant, whole-food energy replenishment.',
  },
];

const FITNESS_PRODUCTS = FITNESS_ITEMS.map((item) => {
  const p = getProductBySlug(item.slug);
  return {
    ...item,
    name: p?.official_label_name || p?.name || item.slug,
    weight: p?.weight || '100 GM',
    price: p?.price || 500,
    packing: p?.packing || 'Glass Jar',
    image: p?.image || '/products/shilajit.jpg',
  };
});

export default function GymFitnessPage() {
  return (
    <main className="bg-[#FAF8F5] text-[#2B2B2B] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111827] via-[#1E293B] to-[#0F172A] text-white pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-6">
              <Dumbbell className="w-4 h-4 text-[#D9A441]" />
              <span>Clean Whole-Food Performance Nutrition</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
              Fuel Your Training with{' '}
              <span className="text-[#D9A441]">Pure Mountain Whole Foods</span>
            </h1>

            <p className="mt-6 text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              Skip the artificial sweeteners, maltodextrin, and synthetic fillers. NaturesMud delivers
              authentic whole-food nutrition for athletes in Nepal: natural nitric oxide from pure beetroot,
              Himalayan shilajit resin, nutrient-dense tree nuts, and hydration-supporting superfood seeds.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#fitness-catalog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c49235] text-[#111827] font-bold text-sm shadow-xl transition-transform active:scale-95 cursor-pointer"
              >
                <span>Browse Fitness Staples</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/products/pure-mountain-himalayan-shilajit-resin"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-sm transition-all"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Explore Pure Shilajit (20g)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fitness Products Catalog */}
      <section id="fitness-catalog" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
            0% Fillers · 0% Added Sugar
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A3826] mt-2">
            Athletic Staples for Strength &amp; Endurance
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Every product is a verified single-ingredient natural food packed in airtight glass jars or food-grade containers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FITNESS_PRODUCTS.map((prod) => (
            <div
              key={prod.slug}
              className="rounded-3xl bg-white border border-[#EAE3D6] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="relative aspect-square bg-[#FAF7F2] p-8 flex items-center justify-center">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  unoptimized
                  className="object-contain p-6"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#111827] text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                  {prod.benefit}
                </span>
                <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-amber-50 text-[11px] font-bold text-[#7A5230] border border-amber-200">
                  {prod.packing}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-heading font-bold text-xl text-[#1A3826]">
                      {prod.name}
                    </h3>
                    <span className="font-heading font-extrabold text-xl text-[#1A3826]">
                      Rs. {prod.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A5230] font-semibold mt-0.5">
                    {prod.nepaliName} · {prod.weight}
                  </p>

                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    {prod.detail}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] text-[11px] text-stone-700 leading-normal">
                    <strong className="text-[#1A3826] block mb-0.5">Fitness Routine:</strong>
                    {prod.howToUse}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="w-full py-3 rounded-full bg-[#111827] hover:bg-[#1E293B] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>View Details &amp; Order</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D9A441]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Pre & Post Workout Whole Food Protocol */}
      <section className="py-16 bg-[#F3EFEA] border-y border-[#EAE3D6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
              Whole-Food Meal Timing
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A3826] mt-2">
              The NaturesMud Clean Fitness Routine
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4 text-rose-600" />
                <span>Pre-Workout Protocol</span>
              </div>
              <h3 className="font-bold text-lg text-[#1A3826]">Endurance &amp; Stamina Pump</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                45 minutes before hitting the gym or trail, shake 1 tablespoon of Beetroot Powder and 1 teaspoon of Chia Seeds into 300ml cold water. Beetroot nitrates support healthy circulation, while chia seeds provide sustained cellular hydration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>Post-Workout Protocol</span>
              </div>
              <h3 className="font-bold text-lg text-[#1A3826]">Muscle Recovery &amp; Replenishment</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Within 60 minutes after intense training, consume 15 raw mountain almonds and 2 tablespoons of pumpkin seeds alongside your protein meal. Provides clean natural magnesium, zinc, and healthy lipids to support muscle repair without digestive heaviness.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
