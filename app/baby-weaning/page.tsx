import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Baby,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Heart,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Package,
  BookOpen,
} from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { getProductBySlug } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Baby Weaning Foods & Natural Porridge Powders Nepal | NaturesMud',
  description:
    'Pediatric-guided baby weaning powders in Nepal: Pure Banana, Sweet Potato, Dates & Carrot powders for 6+ months infant lito. 0% added sugar, 0% preservatives.',
  alternates: {
    canonical: `${siteConfig.url}/baby-weaning`,
  },
  openGraph: {
    title: 'Baby Weaning Foods & Natural Porridge Powders Nepal | NaturesMud',
    description:
      'Single-ingredient vegetable and fruit powders for healthy infant porridge (lito/jaulo) from 6 months, as advised by your pediatrician. 100% pure food in glass jars.',
    url: `${siteConfig.url}/baby-weaning`,
    type: 'website',
  },
};

const WEANING_ITEMS = [
  {
    slug: 'sweet-potato-powder',
    nepaliName: 'सखरखण्ड पाउडर',
    badge: 'Gentle on Little Stomachs',
    pediatricNote: 'Naturally sweet and easy to digest; provides dietary fiber and beta-carotene when mixed into lito or jaulo.',
    intro: 'Single-ingredient steamed and gently dehydrated sweet potatoes, cold-milled into a fine golden powder.',
  },
  {
    slug: 'banana-powder',
    nepaliName: 'केराको धुलो',
    badge: 'Traditional Weaning Staple',
    pediatricNote: 'Rich in potassium and gentle resistant starch; a trusted base for wholesome baby porridge and smooth puddings.',
    intro: '100% unripe and mature raw bananas gently dried and finely milled without added starch or maltodextrin.',
  },
  {
    slug: 'dates-powder',
    nepaliName: 'खजुरको धुलो',
    badge: '0% Added Cane Sugar',
    pediatricNote: '100% dried Arabian dates milled into fine powder. The ideal natural sweetener for porridge, kheer, and halwa.',
    intro: 'Pure pitted dates dried and milled. Replaces refined white sugar in infant cereal and family recipes.',
  },
  {
    slug: 'carrot-powder',
    nepaliName: 'गाजरको धुलो',
    badge: 'Beta-Carotene Rich',
    pediatricNote: 'Wholesome orange root goodness to gently introduce earthy vegetable flavors into baby soups, jaulo, and lito.',
    intro: 'Single-ingredient garden-fresh carrots cleaned, dehydrated, and cold-pulverized with 0% artificial color.',
  },
  {
    slug: 'freeze-dried-avocado-powder',
    nepaliName: 'एभोकाडो पाउडर',
    badge: 'Healthy Monounsaturated Fats',
    pediatricNote: 'Provides natural plant fats and folate supporting infant growth and brain development during complementary feeding.',
    intro: 'Gently freeze-dried ripe avocados capturing healthy lipids in an instant, scoopable powder.',
  },
];

const WEANING_PRODUCTS = WEANING_ITEMS.map((item) => {
  const p = getProductBySlug(item.slug);
  return {
    ...item,
    name: p?.official_label_name || p?.name || item.slug,
    weight: p?.weight || '100 GM',
    price: p?.price || 500,
    packing: p?.packing || 'Glass Jar',
    image: p?.image || '/products/banana-powder.jpg',
  };
});

export default function BabyWeaningPage() {
  return (
    <main className="bg-[#FAF8F5] text-[#2B2B2B] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C3317] via-[#24451D] to-[#3A6B35] text-white pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-6">
              <Baby className="w-4 h-4 text-[#D9A441]" />
              <span>Pediatric-Guided Infant &amp; Toddler Nutrition</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
              Gentle, Pure Whole Foods for{' '}
              <span className="text-[#D9A441]">Baby Weaning</span>
            </h1>

            <p className="mt-6 text-emerald-100/90 text-base sm:text-lg leading-relaxed font-light">
              Introducing solid foods is a milestone for your baby. NaturesMud provides single-ingredient,
              clean-milled vegetable and fruit powders — with 0% added sugar, 0% maltodextrin, and 0% preservatives.
              Freshly sealed in airtight glass jars across Nepal.
            </p>

            {/* MANDATORY PEDIATRIC ADVISORY BOX */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-amber-500/15 backdrop-blur-md border border-amber-300/40 text-amber-100 flex items-start gap-3.5 text-xs sm:text-sm leading-relaxed">
              <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block font-semibold mb-1">
                  Mandatory Pediatric Guidance (WHO &amp; Ministry of Health Standards):
                </strong>
                Suitable for infants <strong>from 6 months of age, as advised by your pediatrician</strong>.
                Never introduce honey to infants under 12 months. Introduce one new food at a time (the 3-day wait rule)
                to watch for allergic reactions. Complementary foods should supplement, never replace, exclusive
                breastfeeding or pediatrician-recommended infant formula during the first six months.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Products Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
            Single-Ingredient Purity
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A3826] mt-2">
            Pediatrician-Approved Weaning Staples
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Every jar contains 100% of the named whole food. Zero starch fillers, zero chemical drying agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WEANING_PRODUCTS.map((prod) => (
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
                    {prod.intro}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] text-[11px] text-stone-700 leading-normal">
                    <strong className="text-[#1A3826] block mb-0.5">Pediatric Use:</strong>
                    {prod.pediatricNote}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="w-full py-3 rounded-full bg-[#1A3826] hover:bg-[#254d35] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>View Product &amp; Add to Cart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Easy Porridge (Lito) Preparation Guide */}
      <section className="py-16 bg-[#F3EFEA] border-y border-[#EAE3D6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
              Simple Kitchen Routine
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A3826] mt-2">
              How to Prepare Weaning Porridge (Lito &amp; Jaulo)
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-[#1A3826] text-[#D9A441] font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </span>
              <div>
                <h4 className="font-bold text-sm text-[#1A3826]">Start with Clean Water or Cooked Grains</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Prepare a base of warm boiled water, cooked soft rice (jaulo), or traditional multigrain cereal porridge.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-[#1A3826] text-[#D9A441] font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </span>
              <div>
                <h4 className="font-bold text-sm text-[#1A3826]">Whisk in 1–2 Teaspoons of Powder</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Stir 1 to 2 teaspoons of Sweet Potato, Banana, or Carrot powder into the warm porridge until completely smooth. Since the powders are pre-cooked/dehydrated, they blend easily without lumps.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-[#1A3826] text-[#D9A441] font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </span>
              <div>
                <h4 className="font-bold text-sm text-[#1A3826]">Natural Sweetening (Dates Powder)</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Instead of white cane sugar or honey (never give honey under 12 months), add half a teaspoon of pure Dates Powder for mild, mineral-rich sweetness.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-[#1A3826] text-[#D9A441] font-bold flex items-center justify-center shrink-0 text-sm">
                4
              </span>
              <div>
                <h4 className="font-bold text-sm text-[#1A3826]">Check Temperature &amp; Serve Fresh</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Test the temperature on your wrist before feeding your child. Always prepare fresh servings and discard any leftovers after 2 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pediatric FAQs */}
      <section className="py-16 bg-white border-t border-[#EAE3D6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A3826]">
              Frequently Asked Questions by Nepali Parents
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6]">
              <h3 className="font-bold text-sm text-[#1A3826]">
                Can I give these powders to my 5-month-old infant?
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                The World Health Organization (WHO) and pediatric guidelines recommend exclusive breastfeeding or formula for the first 6 months. Please consult your pediatrician before introducing any complementary solid foods before 6 months.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6]">
              <h3 className="font-bold text-sm text-[#1A3826]">
                How should I store these powders during Kathmandu’s monsoon?
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                All NaturesMud weaning powders are packaged in airtight glass jars. Keep the lid tightly sealed immediately after each scoop. Store in a dry, cool kitchen pantry away from direct sunlight and stove steam. Never insert a wet spoon into the jar.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6]">
              <h3 className="font-bold text-sm text-[#1A3826]">
                Do these powders contain preservatives, salt, or artificial colors?
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                No. They are 100% pure single-ingredient dried produce. There is 0% added sodium, 0% added white sugar, 0% preservatives, and 0% artificial flavoring.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
