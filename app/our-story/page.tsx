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
    beltName: '🌾 Terai Lowlands',
    nepaliName: 'तराई उर्वर फाँट (१००–३०० मिटर)',
    altitude: '100m – 300m Altitude',
    locations: 'Chitwan · Jhapa · Nawalpur · Sarlahi',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    primaryProducts: [
      { name: 'Dehydrated Himalayan Mango (100g)', image: '/products/authentic-dehydrated-mango.jpg', slug: 'dehydrated-mango' },
      { name: 'Sweet Potato Powder (100g)', image: '/products/sweet-potato-powder-100g.jpg', slug: 'sweet-potato-powder' },
      { name: 'Dehydrated Sweet Papaya (100g)', image: '/products/papaya.jpg', slug: 'dehydrated-papaya' },
      { name: 'Natural Dates Powder (100g)', image: '/products/dates-powder-100g.jpg', slug: 'dates-powder' },
    ],
    farmerCount: '110+ Smallholder Farming Families',
    impactStory:
      'In the fertile alluvial soils of Chitwan, Jhapa, and Nawalpur, we partner directly with smallholder root and fruit growers. Tree-ripened mangoes, papayas, and sweet potatoes are gently processed at low temperatures within hours of harvesting. Farmers receive 35% above market rates with zero middlemen, guaranteeing complete dignity and zero crop wastage.',
    farmerQuote:
      '"With NaturesMud, our harvest is cleaned, sliced, gently dehydrated within hours, and we get paid on the spot with complete transparency and fair dignity."',
    farmerName: 'Ram Bahadur Chaudhary',
    farmerRole: 'Chitwan Root & Fruit Growers Cooperative',
    stats: [
      { label: 'Fair Trade Premium', value: '+35% Above Market' },
      { label: 'Crop Waste Saved', value: '18 Tons/Year' },
      { label: 'Women Harvesters', value: '72% Majority' },
    ],
  },
  {
    id: 'hilly',
    beltName: '⛰️ Midland Terraced Green Valleys',
    nepaliName: 'पहाडी उपत्यका (८००–२,२०० मिटर)',
    altitude: '800m – 2,200m Altitude',
    locations: 'Kavre · Sindhupalchok · Palpa · Ilam',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    primaryProducts: [
      { name: 'Pure Himalayan Beetroot Powder (100g)', image: '/products/beetroot-powder-100g.jpg', slug: 'beetroot-powder' },
      { name: 'Carrot Powder (100g)', image: '/products/carrot-powder.jpg', slug: 'carrot-powder' },
      { name: 'Flax Seeds (100g)', image: '/products/flax-seeds.jpg', slug: 'flax-seeds' },
      { name: 'Chia Seeds (100g)', image: '/products/chia-seeds.jpg', slug: 'chia-seeds' },
    ],
    farmerCount: '95+ Hill Collectives',
    impactStory:
      'The pristine terraced hills of Kavre and Palpa are blessed with mineral-rich mountain soil free from industrial runoff. We work hand-in-hand with female-led agricultural groups who cultivate deep-crimson beetroots, heirloom carrots, and seeds with natural mountain spring irrigation and zero chemical sprays.',
    farmerQuote:
      '"Our beetroots and carrots grow slowly in the cool hill mist. NaturesMud cold-grinds them into fine powder without heat, preserving every ounce of life with 0 additives and 0 preservatives."',
    farmerName: 'Sita Maya Tamang',
    farmerRole: 'Sindhupalchok Hill Women’s Agriculture Co-op',
    stats: [
      { label: 'Additives & Preservatives', value: '0.0% Zero' },
      { label: 'Middlemen Cut', value: '0% Direct' },
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
      { name: 'Dehydrated Himalayan Apple Rings', image: '/products/dehydrated-apple.jpg', slug: 'dehydrated-apple' },
      { name: 'Pure Mustang Wild Cliff Honey', image: '/products/authentic-cliff-honey.jpg', slug: 'raw-honey' },
      { name: 'Raw Himalayan Mountain Almonds (200g)', image: '/products/almonds.jpg', slug: 'raw-himalayan-almonds' },
      { name: 'Ancient Himalayan Pink Rock Salt', image: '/products/pink-salt.jpg', slug: 'himalayan-pink-salt' },
    ],
    farmerCount: '75+ Indigenous Foragers & Harvesters',
    impactStory:
      'At 3,000 meters altitude in Mustang, Jumla, and Dolpa, nature thrives in its purest state. Here, wild bees harvest multi-floral nectar from high-altitude flora on vertical cliffs, and mountain orchards yield crisp, pectin-rich apples. We supply safety ropes and fair forward contracts to indigenous foragers.',
    farmerQuote:
      '"Foraging wild honey from cliff hives is our ancestral tradition. NaturesMud tests every batch for purity and ensures we receive respectful livelihood compensation without middlemen."',
    farmerName: 'Pasang Norbu Gurung',
    farmerRole: 'Mustang Wild Cliff Honey Harvesters Collective',
    stats: [
      { label: 'Altitude Range', value: '3,000m – 3,800m' },
      { label: 'Middlemen Eliminated', value: '100% Direct' },
      { label: 'Enzymes Preserved', value: '98.5% Live' },
    ],
  },
];

const tenNepaliProducts = [
  {
    id: 1,
    name: 'Dehydrated Mango Slices (100g)',
    place: 'Tarai Lowlands — Jhapa, Chitwan & Nawalpur',
    altitude: '120m – 250m Altitude',
    image: '/products/authentic-dehydrated-mango.jpg',
    slug: 'dehydrated-mango',
    badge: 'Tarai Hero Product',
    howCollected:
      'Harvested tree-ripened from indigenous orchards across the fertile Tarai plains. Farmers hand-select peak ripe mangoes, wash them in clean spring water, slice them evenly, and gently dehydrate them at low temperatures below 42°C with 0 additives and 0 preservatives.',
    keyTrait: '0 Additives · 0 Preservatives · Rich in Vitamins A & C',
  },
  {
    id: 2,
    name: 'Sweet Potato Powder (100g)',
    place: 'Chitwan & Nawalpur Alluvial Valleys',
    altitude: '150m – 300m Altitude',
    image: '/products/sweet-potato-powder-100g.jpg',
    slug: 'sweet-potato-powder',
    badge: 'Tarai Root Superfood',
    howCollected:
      'Grown in deep alluvial riverbed soils without synthetic chemicals. The tubers are harvested, peeled, sliced, low-temperature dehydrated, and stone-pulverized into silky, lump-free powder that mothers trust for baby weaning.',
    keyTrait: 'Natural Beta-Carotene · Easy Digestibility',
  },
  {
    id: 3,
    name: 'Dehydrated Papaya Spears (100g)',
    place: 'Sarlahi & Chitwan Orchards',
    altitude: '100m – 200m Altitude',
    image: '/products/papaya.jpg',
    slug: 'dehydrated-papaya',
    badge: 'Tarai Tropical Harvest',
    howCollected:
      'Picked fresh at optimal enzyme maturity from smallholder fruit groves. Cut into tender spears and slowly dehydrated at low temperature to preserve active papain digestive enzymes without sulfur or chemical syrup.',
    keyTrait: 'Live Papain Enzymes · Gut Wellness',
  },
  {
    id: 4,
    name: 'Natural Dates Powder Sweetener (100g)',
    place: 'Kathmandu Processing & Packaging Hub',
    altitude: 'Kathmandu Valley Facility',
    image: '/products/dates-powder-100g.jpg',
    slug: 'dates-powder',
    badge: 'Healthy Natural Sweetener',
    howCollected:
      'Carefully selected whole premium dates, gently dehydrated and micro-milled with zero refined sugar. Pediatrician recommended as a wholesome 1:1 replacement for white sugar in baby porridge, kheer, and milk.',
    keyTrait: '0 Refined Sugar · Iron & Potassium Rich',
  },
  {
    id: 5,
    name: 'Beetroot Powder (100g)',
    place: 'Terraced Hills of Sindhupalchok & Palpa',
    altitude: '1,200m – 1,800m Altitude',
    image: '/products/beetroot-powder-100g.jpg',
    slug: 'beetroot-powder',
    badge: 'Midland Hill Harvest',
    howCollected:
      'Cultivated on cool terraced mountain slopes irrigated by natural spring water. Harvested at full color density, sliced thinly, low-temperature dried and micro-pulverized for athletic stamina and cardiovascular nitric oxide support.',
    keyTrait: 'Natural Nitrates · Deep Crimson Color',
  },
  {
    id: 6,
    name: 'Carrot Powder (100g)',
    place: 'Kavre & Sindhupalchok Hill Farms',
    altitude: '1,000m – 1,600m Altitude',
    image: '/products/carrot-powder.jpg',
    slug: 'carrot-powder',
    badge: 'Hill Valley Vegetable',
    howCollected:
      'Grown in chemical-free hill soil by women farmer cooperatives. Freshly pulled carrots are cleaned, gently dehydrated, and stone-ground to preserve heat-sensitive provitamin A and natural sweetness.',
    keyTrait: 'Provitamin A · Glowing Complexion',
  },
  {
    id: 7,
    name: 'Dehydrated Himalayan Apple Rings (100g)',
    place: 'Jumla & Mustang High Orchards',
    altitude: '2,400m – 2,800m Altitude',
    image: '/products/dehydrated-apple.jpg',
    slug: 'dehydrated-apple',
    badge: 'High Alpine Fruit',
    howCollected:
      'Hand-picked from remote mountain orchards in Jumla and Mustang where crisp alpine winds and intense sunlight nurture sweet, tart apples. Hand-cored and slowly dehydrated into chewy, pectin-rich rings.',
    keyTrait: 'Soluble Pectin Fiber · 0 Additives',
  },
  {
    id: 8,
    name: 'Pure Mustang Wild Cliff Honey',
    place: 'Mustang Annapurna Foothills',
    altitude: '3,000m – 3,500m Altitude',
    image: '/products/authentic-cliff-honey.jpg',
    slug: 'raw-honey',
    badge: 'Sacred High Cliff Nectar',
    howCollected:
      'Harvested sustainably once a year by ancestral Gurung honey hunters using rope ladders on vertical cliffs. Never pasteurized or micro-filtered, preserving live bee pollen, propolis, and bio-active enzymes.',
    keyTrait: 'Raw & Unheated · High Altitude Flora',
  },
  {
    id: 9,
    name: 'Raw Himalayan Mountain Almonds (200g)',
    place: 'High Altitude Valleys of Jumla & Dolpa',
    altitude: '2,200m – 2,900m Altitude',
    image: '/products/almonds.jpg',
    slug: 'raw-himalayan-almonds',
    badge: 'Mountain Harvest',
    howCollected:
      'Gathered from hardy mountain almond trees that brave harsh Himalayan winters. Cured in pure alpine air, producing dense, nutrient-heavy kernels rich in healthy fats and plant protein.',
    keyTrait: 'Cold Climate Density · Vitamin E & Protein',
  },
  {
    id: 10,
    name: 'Ancient Himalayan Pink Rock Salt',
    place: 'Himalayan Foothills Mineral Strata',
    altitude: 'Sub-Himalayan Geological Belts',
    image: '/products/pink-salt.jpg',
    slug: 'himalayan-pink-salt',
    badge: 'Pure Mineral Salt',
    howCollected:
      'Mined from unpolluted primordial salt beds formed over millions of years. Hand-selected, stone-crushed, and packed unrefined with 84+ essential trace minerals and zero anti-caking chemical agents.',
    keyTrait: '84 Trace Minerals · Unrefined & Pure',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Peak Ripeness Harvesting',
    desc: 'Handpicked at absolute peak nutritional ripeness by local farmer cooperatives across Terai, Hilly, and Alpine regions of Nepal.',
    icon: Sprout,
  },
  {
    number: '02',
    title: 'Low-Temperature Dehydration',
    desc: 'Gently dehydrated below 42°C in closed sanitary chambers to preserve 98% of natural vitamins, live enzymes, and vibrant pigments with 0 additives and 0 preservatives.',
    icon: Sun,
  },
  {
    number: '03',
    title: 'Cold Micro-Pulverization',
    desc: 'Milled using friction-free stone and cold micro-milling technology into silky, lump-free powders suitable for baby weaning and daily vitality.',
    icon: Layers,
  },
  {
    number: '04',
    title: '100g Reusable Glass Jar Sealing',
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
                NaturesMud was born out of a profound mission: connecting Nepali families with 0 additive, 0 preservative pure whole foods while ensuring rural farming families in Terai, Hilly, and Himalayan regions earn fair, dignified livelihoods.
              </p>

              {/* Trust Metric Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">280+</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">Farmer Families</div>
                </div>
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">0%</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">Additives / Preservatives</div>
                </div>
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">3 Belts</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">Terai · Hills · Peaks</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#mango-story"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c49235] text-[#1C3317] font-bold text-sm shadow-xl transition-transform active:scale-95"
                >
                  <span>Discover Tarai Mango</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#nepal-10-products"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#D9A441]" />
                  <span>10 Nepal Products</span>
                </a>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-stone-900 group">
                <Image
                  src="/products/naturesmud-all-products-100g.jpg"
                  alt="NaturesMud 100g authentic pure product lineup from Nepal"
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
              Where Our Pure Superfoods Grow
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

      {/* 2.5 Individual Product Spotlight: Tarai Mango */}
      <section id="mango-story" className="py-20 bg-gradient-to-br from-[#FFF9E8] via-[#FAF6ED] to-[#F5EEDC] border-b border-amber-200/60 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mango Image Showcase */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/40 bg-amber-950 group">
                <Image
                  src="/products/authentic-dehydrated-mango.jpg"
                  alt="NaturesMud Dehydrated Mango sourced directly from Tarai, Nepal"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441]">
                    Tarai Tree-Ripened Harvest
                  </span>
                  <p className="text-sm font-semibold text-white/95 mt-1">
                    Jhapa · Chitwan · Nawalpur (120m–250m)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Mango Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
                🥭 Direct Tarai Provenance
              </div>

              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight">
                The Story of Our Tarai Mango: <br />
                <span className="text-[#3A6B35]">Tree-Ripened & 0 Additives</span>
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-light">
                Our Dehydrated Mango is sourced directly from the sun-drenched fertile plains of Tarai—primarily smallholder orchards across <strong>Jhapa, Chitwan, and Nawalpur</strong>. In these warm lowlands, native mango varieties soak in uninterrupted tropical sunshine, developing exceptional natural sugars and dense beta-carotene without artificial ripening chemicals.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                  <div className="font-heading font-bold text-sm text-[#3A6B35] mb-1">
                    🌳 Tree-Ripened Harvesting
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Harvested only when naturally ripe on the branch—never treated with calcium carbide or artificial ripening gases.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                  <div className="font-heading font-bold text-sm text-[#3A6B35] mb-1">
                    ❄️ Low-Temp Dehydration
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Gently dehydrated below 42°C to lock in vibrant tropical flavor, live enzymes, and Vitamin C with zero sulfur dioxide.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                  <div className="font-heading font-bold text-sm text-[#3A6B35] mb-1">
                    🚫 0 Additives & Preservatives
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    0 added sugar, 0 preservatives, 0 chemical colorants. Just 100% pure sun-kissed Nepali mango slices.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                  <div className="font-heading font-bold text-sm text-[#3A6B35] mb-1">
                    🤝 Direct Farmer Dignity
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    By purchasing directly from Tarai farming families at 35% above wholesale rates, we eliminate post-harvest distress selling.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/products/dehydrated-mango"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#3A6B35] hover:bg-[#2e552a] text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Explore 100g Dehydrated Mango</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.6 Dedicated Section: 10 Products from Different Places of Nepal */}
      <section id="nepal-10-products" className="py-20 bg-white border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-emerald-50 px-4 py-1.5 rounded-full mb-3">
              Seed to Jar Provenance
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              10 Genuine Products Sourced Across Nepal
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              Every NaturesMud creation has a clear geographic origin. From the tropical Tarai alluvial plains (100m) to the high Himalayan mountain cliffs (3,500m), explore how our 10 genuine whole foods are collected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenNepaliProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#FAF8F5] rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-stone-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#3A6B35] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      {product.badge}
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-stone-900 mb-1 group-hover:text-[#3A6B35] transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#3A6B35] shrink-0" />
                    <span>{product.place}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {product.howCollected}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#3A6B35]">
                    {product.keyTrait}
                  </span>
                  <Link
                    href={`/products/${product.slug}`}
                    className="w-8 h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#3A6B35] hover:text-white hover:border-[#3A6B35] transition-all"
                    aria-label={`View ${product.name}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The 4-Step Zero-Preservative Dehydration Flow */}
      <section className="py-20 bg-[#F4EFE6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-white px-4 py-1.5 rounded-full shadow-xs mb-3">
              0 Additives · Gentle Science
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              How We Dehydrate & Mill Without Damaging Nutrients
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              Commercial drying often uses high heat or chemical fumes. Here is why our gentle low-temperature dehydration locks in 98% bioactive nutrients with 0 additives and 0 preservatives.
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
            Free express shipping on all orders over <strong>Rs. 10,000</strong> across Nepal. 100% pure whole foods with 0 additives and 0 preservatives.
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