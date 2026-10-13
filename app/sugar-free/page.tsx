import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Apple,
  Info,
  Layers,
  Leaf,
} from 'lucide-react';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: '0% Added Sugar Foods & Natural Sweeteners Nepal | NaturesMud',
  description:
    'Shop 100% natural, 0% added sugar foods in Nepal: Pure Dates Powder natural sweetener, Dehydrated Apples, Mangoes, Figs & Papaya. 0 preservatives.',
  alternates: {
    canonical: `${siteConfig.url}/sugar-free`,
  },
  openGraph: {
    title: '0% Added Sugar Foods & Natural Sweeteners Nepal | NaturesMud',
    description:
      'Ditch refined white sugar and artificial sweeteners. Replace them with single-ingredient whole foods: Dates Powder, solar-dehydrated fruits, and mineral-rich dried figs.',
    url: `${siteConfig.url}/sugar-free`,
    type: 'website',
  },
};

const SUGAR_FREE_PRODUCTS = [
  {
    name: 'Natural Dates Powder Sweetener',
    nepaliName: 'खजुरको धुलो',
    slug: 'dates-powder',
    weight: '100 GM',
    price: 400,
    packing: 'Airtight Glass Jar',
    image: '/products/dates-powder-100g.jpg',
    badge: '1:1 Cane Sugar Replacement',
    detail: '100% whole dried dates milled into fine powder. Unlike refined sugar that has 0 fiber, dates powder preserves natural dietary fiber, potassium, and magnesium.',
    useCase: 'Tea, coffee, kheer, porridge, baking cakes, and infant food.',
  },
  {
    name: 'Dehydrated Himalayan Apple Slices',
    nepaliName: 'सुकाएको हिमाली स्याउ',
    slug: 'dehydrated-apple',
    weight: '100 GM',
    price: 420,
    packing: 'Food-Grade Pack',
    image: '/products/dehydrated-apple.jpg',
    badge: '0% Sulphur & 0% Sugar',
    detail: 'Fresh crisp apples thinly sliced and gently dried at low heat. Concentrated natural fruit pectin and sweet-tart flavor with zero added syrup.',
    useCase: 'Guilt-free desktop snacking, trail mix, or oatmeal topping.',
  },
  {
    name: 'Dehydrated Sweet Papaya Slices',
    nepaliName: 'सुकाएको गुलियो मेवा',
    slug: 'dehydrated-papaya',
    weight: '100 GM',
    price: 400,
    packing: 'Food-Grade Pack',
    image: '/products/papaya.jpg',
    badge: 'Natural Digestive Enzymes',
    detail: 'Naturally sweet ripe Terai papayas dried below 45°C. Retains natural papain enzymes and carotenoids with zero confectioner glaze.',
    useCase: 'Digestive after-meal chew or lunchbox fruit snack.',
  },
  {
    name: 'Dry Figs (Himalayan Anjeer)',
    nepaliName: 'सुकाएको अन्जीर',
    slug: 'dry-figs-anjeer',
    weight: '200 GM',
    price: 750,
    packing: 'Airtight Glass Jar',
    image: '/products/anjeer-jar.jpg',
    badge: 'High Soluble Fiber',
    detail: 'Sun-dried whole figs providing natural sweetness alongside dense dietary calcium, iron, and gut-friendly prebiotic fiber.',
    useCase: 'Soak 2 figs in water overnight for a gentle morning bowel routine.',
  },
  {
    name: 'Dehydrated Ripe Mango Slices',
    nepaliName: 'सुकाएको आँप',
    slug: 'dehydrated-mango',
    weight: '100 GM',
    price: 450,
    packing: 'Food-Grade Pack',
    image: '/products/mango.jpg',
    badge: 'Chewy Fruit Leather Alternative',
    detail: 'Pure tree-ripened mango slices dehydrated to perfection. Tropical sunshine flavor without glucose syrup or artificial color.',
    useCase: 'Healthy whole-food sweet cravings for kids and adults.',
  },
  {
    name: 'Dehydrated Raw Coconut Chips',
    nepaliName: 'सुकाएको नरिवल चिप्स',
    slug: 'dehydrated-coconut-chips',
    weight: '100 GM',
    price: 350,
    packing: 'Food-Grade Pack',
    image: '/products/coconut-chips.jpg',
    badge: '0g Added Sugar Crunch',
    detail: 'Toasted unsweetened coconut flakes rich in medium-chain fatty acids (MCTs). 100% natural crunch without sugar coating.',
    useCase: 'Keto-friendly crunch for smoothies, yogurts, and desk snacking.',
  },
];

export default function SugarFreePage() {
  return (
    <main className="bg-[#FAF8F5] text-[#2B2B2B] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C3317] via-[#2A4B20] to-[#3A6B35] text-white pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-6">
              <Leaf className="w-4 h-4 text-[#D9A441]" />
              <span>0% Refined Sugar · 0% Chemical Sweeteners</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
              Delicious Living with{' '}
              <span className="text-[#D9A441]">0% Added White Sugar</span>
            </h1>

            <p className="mt-6 text-emerald-100/90 text-base sm:text-lg leading-relaxed font-light">
              Refined white cane sugar is stripped of all natural fiber and minerals. NaturesMud helps
              Nepali households satisfy sweet cravings naturally: with pure milled dates powder,
              low-temperature dehydrated fruit slices, and prebiotic sun-dried figs.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c49235] text-[#1C3317] font-bold text-sm shadow-xl transition-transform active:scale-95 cursor-pointer"
              >
                <span>Explore 0% Added Sugar Range</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/products/dates-powder"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-sm transition-all"
              >
                <span>Check Dates Powder (Rs. 400)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sugar-Free Catalog */}
      <section id="catalog" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
            Pure Fruit Goodness
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A3826] mt-2">
            Wholesome Alternatives to Refined Sugar
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Every product below has 0% added sucrose, 0% glucose syrup, and 0% artificial colors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SUGAR_FREE_PRODUCTS.map((prod) => (
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
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-[10px] font-bold uppercase tracking-wider text-[#1A3826] border border-[#EAE3D6] shadow-2xs">
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
                    <strong className="text-[#1A3826] block mb-0.5">Kitchen Ideas:</strong>
                    {prod.useCase}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="w-full py-3 rounded-full bg-[#1A3826] hover:bg-[#254d35] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>View Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Honest Nutrition Comparison Table */}
      <section className="py-16 bg-[#F3EFEA] border-y border-[#EAE3D6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
              Nutrition Truth
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A3826] mt-2">
              White Sugar vs. Artificial Sweeteners vs. Dates Powder
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white border border-[#EAE3D6] shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#EAE3D6] text-[#1A3826]">
                  <th className="p-3.5 font-bold">Nutritional Attribute</th>
                  <th className="p-3.5 font-bold">Refined White Sugar</th>
                  <th className="p-3.5 font-bold">Artificial Sweeteners</th>
                  <th className="p-3.5 font-bold text-emerald-800 bg-emerald-50">NaturesMud Dates Powder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6] text-stone-700">
                <tr>
                  <td className="p-3.5 font-medium">Processing Method</td>
                  <td className="p-3.5 text-stone-500">Chemically bleached &amp; refined</td>
                  <td className="p-3.5 text-stone-500">Synthetic chemical synthesis</td>
                  <td className="p-3.5 font-semibold text-emerald-900 bg-emerald-50/50">100% dried dates gently milled</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Dietary Fiber Content</td>
                  <td className="p-3.5 text-rose-600 font-semibold">0% Zero Fiber</td>
                  <td className="p-3.5 text-rose-600 font-semibold">0% Zero Fiber</td>
                  <td className="p-3.5 font-semibold text-emerald-900 bg-emerald-50/50">~7–8g soluble &amp; insoluble fiber per 100g</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Micronutrients (Potassium, Iron)</td>
                  <td className="p-3.5 text-rose-600">None (empty calories)</td>
                  <td className="p-3.5 text-rose-600">None</td>
                  <td className="p-3.5 font-semibold text-emerald-900 bg-emerald-50/50">Natural potassium, magnesium &amp; iron</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Suitability for Infant Lito</td>
                  <td className="p-3.5 text-rose-600">Not recommended for babies</td>
                  <td className="p-3.5 text-rose-600">Not recommended for babies</td>
                  <td className="p-3.5 font-semibold text-emerald-900 bg-emerald-50/50">Suitable from 6 months (as advised by pediatrician)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[11px] text-stone-500 text-center leading-relaxed">
            *Nutritional note: Dates powder contains natural fruit carbohydrates (fructose and glucose). While it provides whole-food fiber and micronutrients, individuals managing diabetes should monitor overall carbohydrate intake in consultation with their physician.
          </p>
        </div>
      </section>
    </main>
  );
}
