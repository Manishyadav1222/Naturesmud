'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mountain,
  Sun,
  Sprout,
  ShieldCheck,
  Award,
  Truck,
  Heart,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Leaf,
  Layers,
  Zap,
  Play,
  RotateCcw,
  BadgePercent,
} from 'lucide-react';

const regionsData = [
  {
    id: 'terai',
    beltName: '🌾 Terai Organic Lowlands',
    nepaliName: 'तराई जैविक फाँट (१००–३०० मिटर)',
    altitude: '100m – 300m Altitude',
    locations: 'Chitwan · Jhapa · Nawalpur · Sarlahi',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    primaryProducts: [
      { name: 'Organic Sweet Potato Powder (100g)', image: '/products/sweet-potato-powder-100g.jpg', slug: 'sweet-potato-powder' },
      { name: 'Organic Carrot Powder (100g)', image: '/products/carrot-powder.jpg', slug: 'carrot-powder' },
      { name: 'Sun-Dried Sweet Papaya (100g)', image: '/products/papaya.jpg', slug: 'dehydrated-papaya' },
      { name: 'Natural Dates Powder (100g)', image: '/products/dates-powder-100g.jpg', slug: 'dates-powder' },
    ],
    farmerCount: '110+ Smallholder Farming Families',
    impactStory:
      'In the fertile alluvial soils of Chitwan and Nawalpur, we partner with smallholder root and vegetable growers. Before our partnership, post-harvest perishability forced farmers to sell at distress prices. By introducing solar micro-dehydration hubs directly at farm sites, farmers receive 35% above market prices, and not a single fresh crop is wasted.',
    farmerQuote:
      '"We used to lose 40% of our sweet potato crop to market saturation. With Nature\'s Mud, our harvest is cleaned, sliced, solar-dried within 6 hours, and we get paid on the spot."',
    farmerName: 'Ram Bahadur Chaudhary',
    farmerRole: 'Chitwan Organic Root Growers Cooperative',
    stats: [
      { label: 'Fair Trade Premium', value: '+35% Above Market' },
      { label: 'Crop Waste Saved', value: '18 Tons/Year' },
      { label: 'Women Harvesters', value: '72% Majority' },
    ],
  },
  {
    id: 'hilly',
    beltName: '⛰️ Midland Terraced Green Valleys',
    nepaliName: 'पहाडी जैविक उपत्यका (८००–२,२०० मिटर)',
    altitude: '800m – 2,200m Altitude',
    locations: 'Kavre · Sindhupalchok · Palpa · Ilam',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    primaryProducts: [
      { name: 'Pure Himalayan Beetroot Powder (100g)', image: '/products/beetroot-powder-100g.jpg', slug: 'beetroot-powder' },
      { name: 'Cold-Pressed Virgin Coconut Oil', image: '/products/coconut-oil.jpg', slug: 'premium-coconut-oil' },
      { name: 'Organic Flax Seeds (100g)', image: '/products/flax-seeds.jpg', slug: 'flax-seeds' },
      { name: 'Organic Chia Seeds (100g)', image: '/products/chia-seeds.jpg', slug: 'chia-seeds' },
    ],
    farmerCount: '95+ Organic Hill Collectives',
    impactStory:
      'The pristine terraced hills of Kavre and Palpa are blessed with mineral-rich mountain soil free from industrial pesticide runoff. We work hand-in-hand with female-led agricultural groups who cultivate deep-crimson beetroots, heirloom turmeric, and ginger with pure organic compost and natural mountain spring irrigation.',
    farmerQuote:
      '"Our beetroots grow slowly in the cool hill mist, packing dense nitrates and earthy sweetness. Nature\'s Mud cold-grinds them into fine powder without heat, preserving every ounce of life."',
    farmerName: 'Sita Maya Tamang',
    farmerRole: 'Sindhupalchok Hill Women’s Agriculture Co-op',
    stats: [
      { label: 'Organic Compost Used', value: '100% Traditional' },
      { label: 'Synthetic Chemicals', value: '0.0% Zero' },
      { label: 'Community Funds', value: 'Rs. 4.5L Seed Fund' },
    ],
  },
  {
    id: 'himalaya',
    beltName: '🏔️ High Himalayan Alpine Peaks',
    nepaliName: 'उच्च हिमाली भेग (२,५००–३,५००+ मिटर)',
    altitude: '2,500m – 3,500m+ Altitude',
    locations: 'Mustang · Jumla · Manang · Dolpa',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    primaryProducts: [
      { name: 'Wild Mustang Cliff Raw Honey', image: '/products/raw-honey.jpg', slug: 'raw-honey' },
      { name: 'Wild Dried Himalayan Blueberries (100g)', image: '/products/dried-blueberries-100g.jpg', slug: 'dried-blueberries' },
      { name: 'Raw Himalayan Walnut Halves', image: '/products/walnuts.jpg', slug: 'himalayan-walnuts' },
      { name: 'Pure Himalayan Shilajit Resin', image: '/products/shilajit.jpg', slug: 'pure-shilajit-resin' },
    ],
    farmerCount: '75+ Indigenous Foragers & Harvesters',
    impactStory:
      'At 3,000 meters altitude in Mustang and Jumla, nature thrives in its purest state. Here, wild bees harvest nectar from high-altitude medicinal flora, and wild blueberries absorb intense ultraviolet alpine light to develop unmatched antioxidant anthocyanin levels. We supply safety ropes and fair forward contracts to indigenous foragers.',
    farmerQuote:
      '"Foraging wild honey from cliff hives is our ancestral tradition. Nature\'s Mud tests every batch for purity and ensures we receive respectful livelihood compensation without middlemen."',
    farmerName: 'Pasang Norbu Gurung',
    farmerRole: 'Mustang Wild Cliff Honey Harvesters Collective',
    stats: [
      { label: 'Altitude Range', value: '3,000m – 3,800m' },
      { label: 'Middlemen Eliminated', value: '100% Direct' },
      { label: 'Enzymes Preserved', value: '98.5% Live' },
    ],
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Pesticide-Free Harvesting',
    desc: 'Handpicked at absolute peak nutritional ripeness by local farmer cooperatives across Terai, Hilly, and Alpine regions of Nepal.',
    icon: Sprout,
  },
  {
    number: '02',
    title: 'Solar & Low-Temp Dehydration',
    desc: 'Gently dehydrated below 42°C in closed solar dehydrators to preserve 98% of natural vitamins, live enzymes, and vibrant pigments without sulfur.',
    icon: Sun,
  },
  {
    number: '03',
    title: 'Cold Micro-Pulverization',
    desc: 'Milled using friction-free stone and cold micro-milling technology into silky, lump-free powders suitable for baby weaning and fitness.',
    icon: Layers,
  },
  {
    number: '04',
    title: '100g Eco Glass Jar Sealing',
    desc: 'Hygienically sealed in airtight 100g glass jars with tamper-proof seals to preserve freshness and eliminate single-use plastics.',
    icon: ShieldCheck,
  },
];

export default function OurStoryPage() {
  const [selectedBelt, setSelectedBelt] = useState(regionsData[0]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <main className="bg-[#FAF8F5] text-[#2B2B2B] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C3317] via-[#2A4D23] to-[#3A6B35] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background glow & organic elements */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D9A441]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#7AA95C]/30 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="text-sm text-emerald-200/80 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#D9A441] font-semibold">Our Story & Farmer Roots</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D9A441] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                Direct Sourced from Nepal’s 3 Ecological Belts
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                Pure Himalayan Food. <br />
                <span className="text-[#D9A441]">Real Farmer Dignity.</span>
              </h1>

              <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
                Nature’s Mud was born out of a profound mission: connecting Nepali families with 100% natural, chemical-free superfoods while ensuring rural farming families in Terai, Hilly, and Himalayan regions earn fair, dignified livelihoods.
              </p>

              {/* Trust Metric Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">280+</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">Farmer Families</div>
                </div>
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">100%</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">Zero Preservatives</div>
                </div>
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">3 Belts</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">Terai · Hills · Peaks</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#geographic-belts"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c49235] text-[#1C3317] font-bold text-sm shadow-xl transition-transform active:scale-95"
                >
                  <span>Explore Farmer Regions</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-sm transition-all"
                >
                  <Play className="w-4 h-4 text-[#D9A441] fill-[#D9A441]" />
                  <span>Watch Farm Story</span>
                </button>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-stone-900 group">
                <Image
                  src="/products/naturesmud-all-products-100g.jpg"
                  alt="Nature's Mud 100g authentic organic product lineup from Nepal"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441]">
                    100g Pure Food Collection
                  </span>
                  <p className="text-sm font-medium text-white/90 mt-1">
                    Sweet Potato · Dates Powder · Beetroot · Blueberries
                  </p>
                </div>
              </div>

              {/* Floating Nepal Map Pin Badge */}
              <div className="absolute -bottom-5 -left-4 bg-white text-stone-900 px-5 py-3 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#3A6B35]">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-xs font-bold text-stone-800">100% Nepali Origin</div>
                  <div className="text-[11px] text-stone-500">From 100m to 3,500m Altitudes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive 3-Belt Sourcing Ecosystem */}
      <section id="geographic-belts" className="py-20 bg-white border-b border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-emerald-50 px-4 py-1.5 rounded-full mb-3">
              Nepal’s 3 Agro-Ecological Belts
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Where Our Organic Superfoods Grow
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              Nepal offers one of the world’s most diverse microclimates. We harness the unique biological strengths of each altitude to collect nature’s purest, most potent crops.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {regionsData.map((region) => {
              const isSelected = selectedBelt.id === region.id;
              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setSelectedBelt(region)}
                  className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2.5 shadow-xs ${
                    isSelected
                      ? 'bg-[#3A6B35] text-white shadow-lg shadow-[#3A6B35]/25 scale-105'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span>{region.beltName}</span>
                </button>
              );
            })}
          </div>

          {/* Region Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBelt.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-md"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#3A6B35]/15 text-[#3A6B35]">
                      {selectedBelt.altitude}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      📍 {selectedBelt.locations}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
                    {selectedBelt.beltName}
                  </h3>
                  <p className="text-xs font-semibold text-stone-400 -mt-3">
                    {selectedBelt.nepaliName}
                  </p>

                  <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                    {selectedBelt.impactStory}
                  </p>

                  {/* Impact Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
                    {selectedBelt.stats.map((st, i) => (
                      <div key={i} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                        <div className="font-heading font-extrabold text-base sm:text-lg text-[#3A6B35]">
                          {st.value}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">{st.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Farmer Quote Box */}
                  <div className="bg-white p-5 rounded-2xl border-l-4 border-[#3A6B35] shadow-xs">
                    <p className="italic text-stone-700 text-sm leading-relaxed">
                      {selectedBelt.farmerQuote}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3A6B35] flex items-center justify-center font-bold text-xs">
                        👨‍🌾
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{selectedBelt.farmerName}</div>
                        <div className="text-[11px] text-stone-500">{selectedBelt.farmerRole}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Region Products Grid */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="font-heading font-bold text-base text-stone-800 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#3A6B35]" />
                    Featured 100g Crops from this Belt
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedBelt.primaryProducts.map((prod, idx) => (
                      <Link
                        key={idx}
                        href={`/products/${prod.slug}`}
                        className="group bg-white rounded-2xl p-3.5 border border-stone-200 hover:border-[#3A6B35]/40 hover:shadow-md transition-all flex flex-col items-center text-center"
                      >
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            sizes="200px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="font-heading font-bold text-xs text-stone-900 group-hover:text-[#3A6B35] line-clamp-2 leading-snug">
                          {prod.name}
                        </span>
                        <span className="text-[11px] text-[#3A6B35] font-semibold mt-1 inline-flex items-center gap-1">
                          View 100g Pack <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 3. The 4-Step Zero-Preservative Solar Dehydration Flow */}
      <section className="py-20 bg-[#F4EFE6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-white px-4 py-1.5 rounded-full shadow-xs mb-3">
              Zero Chemicals · Solar Science
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              How We Dehydrate & Mill Without Damaging Nutrients
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              Commercial drying often uses high oven heat or toxic sulfur fumes. Here is why our cold solar technology locks in 98% bioactive nutrients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#3A6B35] flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-heading font-black text-2xl text-stone-300">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-1 text-[11px] font-bold text-[#3A6B35]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lab Verified Safe</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Brand Video Reel Showcase Teaser */}
      <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D9A441] text-xs font-bold uppercase tracking-wider">
                <Play className="w-3.5 h-3.5 fill-current" /> Farm Story in Motion
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white leading-tight">
                See How Real Nepali Superfoods Are Prepared
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Watch our harvest and dehydrating journey — from whole farm sweet potatoes to micro-milled baby food powders and high-altitude wild honey jars.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c59336] text-[#1C3317] font-bold text-sm inline-flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Full Brand Reel</span>
                </button>
                <Link
                  href="/products"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div
                onClick={() => setVideoModalOpen(true)}
                className="relative w-full max-w-md aspect-[9/14] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 cursor-pointer group bg-black"
              >
                <video
                  src="/videos/naturesmud-product-reel.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 text-[#3A6B35] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call to Action */}
      <section className="py-16 bg-[#3A6B35] text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
            Taste the Purity of Nepal’s Soil
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto leading-relaxed">
            Free express shipping on all orders over <strong>Rs. 10,000</strong> across Nepal. 100% natural, 0% added sugar, 0% preservatives.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D9A441] hover:bg-[#c79537] text-[#1C3317] font-extrabold text-base shadow-xl hover:shadow-2xl transition-all"
            >
              <span>Shop All 100g Superfoods</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setVideoModalOpen(false)}
          >
            <div
              className="relative max-w-lg w-full aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src="/videos/naturesmud-product-reel.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}