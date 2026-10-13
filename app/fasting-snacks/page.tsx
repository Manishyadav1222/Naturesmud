import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  Sun,
  Heart,
  Package,
} from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { getProductBySlug } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Pure Vrat & Fasting Snacks Nepal | Satvik Upavas Foods | NaturesMud',
  description:
    'Pure satvik foods for Vrat & Upavas in Nepal: Himalayan Makhana (Fox Nuts), Sendha Namak (Sidhe Noon Pink Salt), Raw Mountain Almonds & Dry Figs.',
  alternates: {
    canonical: `${siteConfig.url}/fasting-snacks`,
  },
  openGraph: {
    title: 'Pure Vrat & Fasting Snacks Nepal | Satvik Upavas Foods | NaturesMud',
    description:
      'Zero regular table salt, zero grain fillers. 100% pure Himalayan Sidhe Noon, raw Makhana, whole nuts & dry fruits for Ekadashi, Teej, Shivaratri & Navratri fasting.',
    url: `${siteConfig.url}/fasting-snacks`,
    type: 'website',
  },
};

const FASTING_ITEMS = [
  {
    slug: 'makhana-fox-nuts',
    nepaliName: 'हिमाली मखाना',
    badge: 'Essential Vrat Snack',
    detail: 'Light, crunchy puffed lotus lily seeds. 100% natural, unroasted, and unsalted — ready to roast in pure cow ghee with Himalayan Sidhe Noon.',
    useCase: 'Light fasting snack for Ekadashi, Navratri, Teej, and Shrawan Sombar.',
  },
  {
    slug: 'himalayan-pink-salt',
    nepaliName: 'हिमाली गुलाबी नुन (सिधे नुन)',
    badge: 'Pure Fasting Salt (Sendha Namak)',
    detail: 'Ancient rock crystal salt containing 84+ trace minerals. The traditional, prescribed salt permitted during religious fasts and satvik meals.',
    useCase: 'Seasoning makhana, fruit salads, boiled potatoes, and aloo jeera during fasts.',
  },
  {
    slug: 'pure-himalayan-black-salt-bire-noon',
    nepaliName: 'हिमाली बिरे नुन',
    badge: 'Ayurvedic Digestive Rock Salt',
    detail: 'Traditional mineral salt with characteristic volcanic aroma and gentle cooling properties. Aids digestive comfort during periods of fasting.',
    useCase: 'Fruit chaat, digestive warm water, and fresh lassi.',
  },
  {
    slug: 'raw-himalayan-almonds',
    nepaliName: 'काँचो बदाम',
    badge: 'Satvik Energy',
    detail: 'Unroasted, unpeeled whole almonds rich in natural plant fats and protein to sustain energy levels through day-long fasts.',
    useCase: 'Soak 8–10 almonds overnight for early-morning satvik sustenance.',
  },
  {
    slug: 'dry-figs-anjeer',
    nepaliName: 'सुकाएको अन्जीर',
    badge: 'Natural Fasting Sweetness',
    detail: 'Sun-dried whole figs providing concentrated natural fruit sugars, dietary calcium, and fiber without processed sugar.',
    useCase: 'Sustained energy during fasting days; pair with a glass of warm milk.',
  },
  {
    slug: 'premium-cashewnuts',
    nepaliName: 'काँचो काजु',
    badge: 'Creamy Satvik Snack',
    detail: '100% raw, unsalted, unroasted whole cashew nuts. Packed in airtight glass jars to prevent humidity spoilage during monsoon.',
    useCase: 'Roast lightly in pure ghee or blend into rich fasting gravies.',
  },
];

const FASTING_PRODUCTS = FASTING_ITEMS.map((item) => {
  const p = getProductBySlug(item.slug);
  return {
    ...item,
    name: p?.official_label_name || p?.name || item.slug,
    weight: p?.weight || '100 GM',
    price: p?.price || 500,
    packing: p?.packing || 'Glass Jar',
    image: p?.image || '/products/makhana-fox-nuts-product-shot.jpg',
  };
});

export default function FastingSnacksPage() {
  return (
    <main className="bg-[#FAF8F5] text-[#2B2B2B] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#3E2723] via-[#4E342E] to-[#2E1C18] text-white pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-6">
              <Sun className="w-4 h-4 text-[#D9A441]" />
              <span>Satvik &amp; Pure Upavas Nutrition</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
              Pure Satvik Foods for{' '}
              <span className="text-[#D9A441]">Vrat &amp; Upavas in Nepal</span>
            </h1>

            <p className="mt-6 text-amber-100/90 text-base sm:text-lg leading-relaxed font-light">
              Fasting in Nepal calls for unquestioned purity: zero regular table salt, zero grain starches,
              and 100% natural ingredients. NaturesMud provides Himalayan Makhana, authentic Sidhe Noon (Sendha Namak),
              raw mountain almonds, and sun-dried figs for Ekadashi, Teej, Shivaratri, Navratri, and Sombar fasts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c49235] text-[#2E1C18] font-bold text-sm shadow-xl transition-transform active:scale-95 cursor-pointer"
              >
                <span>View Fasting Snacks</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/products/makhana-fox-nuts"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-sm transition-all"
              >
                <span>Himalayan Makhana (Rs. 390)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fasting Snacks Catalog */}
      <section id="catalog" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
            100% Unadulterated Satvik Produce
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A3826] mt-2">
            Permitted Whole Foods for Upavas
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Hand-sorted and packaged in hygienic food-grade containers to ensure complete ritual purity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FASTING_PRODUCTS.map((prod) => (
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
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#3E2723] text-amber-200 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                  {prod.badge}
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
                    <strong className="text-[#1A3826] block mb-0.5">Vrat Preparation:</strong>
                    {prod.useCase}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="w-full py-3 rounded-full bg-[#3E2723] hover:bg-[#4E342E] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>View Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D9A441]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Fasting Recipe Idea: Ghee-Roasted Makhana */}
      <section className="py-16 bg-[#F3EFEA] border-y border-[#EAE3D6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
              Traditional Upavas Recipe
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A3826] mt-2">
              Crispy Ghee-Roasted Makhana with Sidhe Noon
            </h2>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#EAE3D6] shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#EAE3D6] text-xs">
              <div>
                <strong className="text-[#1A3826] block">Preparation Time:</strong>
                <span className="text-stone-600">2 minutes</span>
              </div>
              <div>
                <strong className="text-[#1A3826] block">Cooking Time:</strong>
                <span className="text-stone-600">6–8 minutes on low flame</span>
              </div>
              <div>
                <strong className="text-[#1A3826] block">Religious Suitability:</strong>
                <span className="text-stone-600">100% Satvik for all Vrats</span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <p>
                <strong>Step 1:</strong> Heat 1 to 2 tablespoons of pure cow ghee in a heavy-bottomed pan or kadai on low flame.
              </p>
              <p>
                <strong>Step 2:</strong> Add 50 GM of NaturesMud Himalayan Makhana to the warm ghee. Roast continuously on low heat for 6 to 8 minutes until the lotus seeds turn crisp and snap cleanly between two fingers.
              </p>
              <p>
                <strong>Step 3:</strong> Turn off the stove. Immediately sprinkle 1/2 teaspoon of finely powdered NaturesMud Himalayan Pink Salt (Sidhe Noon / Sendha Namak) and a pinch of black pepper (if allowed in your fasting tradition). Toss well so the warm ghee binds the salt evenly to every kernel.
              </p>
              <p>
                <strong>Step 4:</strong> Enjoy warm as a high-satiety, light fasting snack that keeps you energized without stomach heaviness.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
