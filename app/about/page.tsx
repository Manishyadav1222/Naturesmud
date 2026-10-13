'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Leaf,
  Layers,
  Play,
  Store,
  Building2,
  FileCheck2,
  Package,
} from 'lucide-react';
import BlogLanguageSwitcher from '@/components/BlogLanguageSwitcher';

const regionsData = [
  {
    id: 'terai',
    beltNameEn: '🌾 Terai Lowland Farms',
    beltNameNp: '🌾 तराई कृषि फाँट',
    nepaliSubtitle: '१००–३०० मिटर उचाइ (चितवन, झापा, नवलपुर, सर्लाही)',
    altitudeEn: '100m – 300m Altitude',
    altitudeNp: '१००–३०० मिटर उचाइ',
    locationsEn: 'Chitwan · Jhapa · Nawalpur · Sarlahi',
    locationsNp: 'चितवन · झापा · नवलपुर · सर्लाही',
    primaryProducts: [
      { nameEn: 'Sweet Potato Powder', nameNp: 'सखरखण्ड पाउडर', image: '/products/sweet-potato-powder-100g.jpg', slug: 'sweet-potato-powder' },
      { nameEn: 'Carrot Powder', nameNp: 'गाजर पाउडर', image: '/products/carrot-powder-100g.jpg', slug: 'carrot-powder' },
      { nameEn: 'Dehydrated Sweet Papaya', nameNp: 'डिहाइड्रेटेड मेवा', image: '/products/papaya.jpg', slug: 'dehydrated-papaya' },
      { nameEn: 'Dates Powder', nameNp: 'खजुर पाउडर', image: '/products/dates-powder-100g.jpg', slug: 'dates-powder' },
    ],
    impactStoryEn:
      'From the warm alluvial plains of the Terai, we source ripe root vegetables and tropical fruits including sweet potatoes, carrots, bananas, papayas, pineapples, and mangoes. Crops are selected at full ripeness, washed thoroughly, and gently dehydrated at low temperatures to preserve their natural color, aroma, and whole-food nutrients without added sugar or preservatives.',
    impactStoryNp:
      'तराईको मलिलो माटोमा उब्जिएका ताजा सखरखण्ड, गाजर, केरा, मेवा र आँप जस्ता फलफूल तथा कन्दमूलहरू पूर्ण पाकेको अवस्थामा सङ्कलन गरिन्छ। तिनलाई सफा गरी कम तापक्रममा सुकाएर बिना चिनी र बिना प्रिजर्भेटिभ प्राकृतिक रूपमै तयार गरिन्छ।',
    sourcingStandardEn:
      'Every Terai harvest batch is cleaned, sliced, and dehydrated in closed sanitary trays with 0% sulphur dioxide, 0% added sugar, and 0% artificial color.',
    sourcingStandardNp:
      'तराईबाट सङ्कलित प्रत्येक बालीलाई सफा गरी बन्द ट्रेमा ०% सल्फर, ०% चिनी र ०% कृत्रिम रङ बिना स्वच्छ रूपमा सुकाइन्छ।',
    sourcingFocusEn: 'Root Vegetables & Tropical Fruits',
    sourcingFocusNp: 'कन्दमूल तथा उष्णप्रदेशीय फलफूल',
    stats: [
      { labelEn: 'Added Sugar', labelNp: 'थप चिनी', value: '0% Added' },
      { labelEn: 'Preservatives', labelNp: 'प्रिजर्भेटिभ', value: '0% Zero' },
      { labelEn: 'Processing', labelNp: 'प्रशोधन विधि', value: 'Low-Heat Dried' },
    ],
  },
  {
    id: 'hilly',
    beltNameEn: '⛰️ Mid-Hill Terraced Valleys',
    beltNameNp: '⛰️ पहाडी उपत्यका',
    nepaliSubtitle: '८००–२,२०० मिटर उचाइ (काभ्रे, सिन्धुपाल्चोक, पाल्पा, इलाम)',
    altitudeEn: '800m – 2,200m Altitude',
    altitudeNp: '८००–२,२०० मिटर उचाइ',
    locationsEn: 'Kavre · Sindhupalchok · Palpa · Ilam',
    locationsNp: 'काभ्रे · सिन्धुपाल्चोक · पाल्पा · इलाम',
    primaryProducts: [
      { nameEn: 'Beetroot Powder', nameNp: 'चुकन्दर पाउडर', image: '/products/beetroot-powder-100g.jpg', slug: 'beetroot-powder' },
      { nameEn: 'Extra Virgin Coconut Oil', nameNp: 'भर्जिन नरिवल तेल', image: '/products/coconut-oil.jpg', slug: 'virgin-coconut-oil-500ml' },
      { nameEn: 'Flax Seeds', nameNp: 'आलस दाना', image: '/products/flax-seeds.jpg', slug: 'flax-seeds' },
      { nameEn: 'Chia Seeds', nameNp: 'चिया सिड्स', image: '/products/chia-seeds.jpg', slug: 'chia-seeds' },
    ],
    impactStoryEn:
      'The cool terraced hills of Kavre, Sindhupalchok, Palpa, and Ilam provide mineral-rich soil for slow-growing root crops, leafy greens, and oilseeds. Beetroots, moringa leaves, rosemary, flax seeds, and chia seeds are harvested cleanly and cold-milled in small batches so families receive pure single-ingredient nutrition.',
    impactStoryNp:
      'काभ्रे, सिन्धुपाल्चोक, पाल्पा र इलामका पहाडी फाँटहरूमा चिसो हावापानीमा हुर्किएका चुकन्दर, शीतलचिनी (मोरिङ्गा), रोजमेरी, आलस र चिया सिड्स सङ्कलन गरिन्छ। यिनलाई सानो ब्याचमा कोल्ड-मिलिङ विधिबाट शुद्ध रूपमा तयार गरिन्छ।',
    sourcingStandardEn:
      'Mid-hill roots and greens are shade-dried or low-temperature dehydrated before fine milling to retain natural pigments and earthy flavor.',
    sourcingStandardNp:
      'पहाडी जरा र सागपातलाई प्राकृतिक रङ र स्वाद जोगाउन कम तापक्रममा सुकाएर मसिनो पाउडर बनाइन्छ।',
    sourcingFocusEn: 'Beetroot, Culinary Herbs & Nutrient-Dense Seeds',
    sourcingFocusNp: 'चुकन्दर, जडीबुटी र पोषणयुक्त दानाहरू',
    stats: [
      { labelEn: 'Ingredients', labelNp: 'सामग्री', value: 'Single-Ingredient' },
      { labelEn: 'Fillers or Starch', labelNp: 'मिसावट वा स्टार्च', value: '0% Zero' },
      { labelEn: 'Batch Size', labelNp: 'उत्पादन ब्याच', value: 'Small-Batch Milled' },
    ],
  },
  {
    id: 'himalaya',
    beltNameEn: '🏔️ High Himalayan Alpine Belt',
    beltNameNp: '🏔️ उच्च हिमाली भेग',
    nepaliSubtitle: '२,५००–३,५००+ मिटर उचाइ (मुस्ताङ, जुम्ला, मनाङ, डोल्पा)',
    altitudeEn: '2,500m – 3,500m+ Altitude',
    altitudeNp: '२,५००–३,५००+ मिटर उचाइ',
    locationsEn: 'Mustang · Jumla · Manang · Dolpa',
    locationsNp: 'मुस्ताङ · जुम्ला · मनाङ · डोल्पा',
    primaryProducts: [
      { nameEn: 'Dehydrated Apple', nameNp: 'डिहाइड्रेटेड स्याउ', image: '/products/dehydrated-apple.jpg', slug: 'dehydrated-apple' },
      { nameEn: 'Pure Mountain Himalayan Shilajit Resin', nameNp: 'शुद्ध हिमाली शिलाजीत', image: '/products/nm-shilajit-jar.jpeg', slug: 'pure-mountain-himalayan-shilajit-resin' },
      { nameEn: 'Raw Almonds', nameNp: 'काँचो बदाम', image: '/products/almonds.jpg', slug: 'raw-himalayan-almonds' },
      { nameEn: 'Himalayan Pink Salt', nameNp: 'हिमाली गुलाबी नुन', image: '/products/pink-salt.jpg', slug: 'himalayan-pink-salt' },
    ],
    impactStoryEn:
      'From the high-altitude orchards and alpine rocks of Mustang, Jumla, Manang, and Dolpa come crisp mountain apples, nuts, mineral rock salts, and purified Himalayan shilajit resin. Cold mountain nights and intense alpine sunlight create dense flavor and natural mineral richness.',
    impactStoryNp:
      'मुस्ताङ, जुम्ला, मनाङ र डोल्पाका उच्च हिमाली बगैँचा र चट्टानहरूबाट रसिलो हिमाली स्याउ, बदाम, प्राकृतिक नुन र शुद्ध हिमाली शिलाजीत सङ्कलन गरिन्छ। हिमाली हावापानीले यी उत्पादनहरूमा विशिष्ट स्वाद र प्राकृतिक खनिज प्रदान गर्छ।',
    sourcingStandardEn:
      'High-altitude fruits, nuts, mineral salts, and traditional shilajit resin are hygienically sorted and packed in food-grade containers.',
    sourcingStandardNp:
      'उच्च हिमाली फलफूल, ड्राइ फ्रुट्स, खनिज नुन र शिलाजीतलाई स्वच्छताका साथ छनोट गरी फुड-ग्रेड प्याकिङमा सुरक्षित गरिन्छ।',
    sourcingFocusEn: 'Orchard Apples, Mountain Nuts, Salts & Shilajit',
    sourcingFocusNp: 'हिमाली स्याउ, ड्राइ फ्रुट्स, नुन र शिलाजीत',
    stats: [
      { labelEn: 'Altitude Range', labelNp: 'सङ्कलन उचाइ', value: '2,500m – 3,500m+' },
      { labelEn: 'Purity Standard', labelNp: 'शुद्धता मापदण्ड', value: '100% Unadulterated' },
      { labelEn: 'Preservatives', labelNp: 'प्रिजर्भेटिभ', value: '0% Zero' },
    ],
  },
];

const processSteps = [
  {
    number: '01',
    titleEn: 'Ripe Crop Selection',
    titleNp: 'उचित समयमा बाली छनोट',
    descEn: 'Selected at nutritional ripeness across Terai, Mid-Hill, and Alpine regions for clean whole-food processing.',
    descNp: 'नेपालका तराई, पहाड र हिमाली क्षेत्रबाट पाकेको र स्वच्छ अवस्थामा छनोट गरिएको।',
    icon: Sprout,
  },
  {
    number: '02',
    titleEn: 'Gentle Low-Temperature Dehydration',
    titleNp: 'कम तापक्रम डिहाइड्रेसन',
    descEn: 'Gently dehydrated in closed sanitary dehydrators to retain natural vitamins, color, and flavor with 0 additives and 0 preservatives.',
    descNp: 'बन्द डिहाइड्रेटरमा कम तापक्रममा सुकाइन्छ, जसले केमिकल बिना प्राकृतिक पोषक तत्व र रङ सुरक्षित राख्छ।',
    icon: Sun,
  },
  {
    number: '03',
    titleEn: 'Fine Cold Micro-Milling',
    titleNp: 'कोल्ड माइक्रो-मिलिङ प्रविधि',
    descEn: 'Milled into smooth, fine whole-food powders suitable for smoothies, family recipes, and baby weaning porridges (from 6 months, as advised by your pediatrician).',
    descNp: 'मसिनो गरी पिँधिन्छ, जसले गर्दा पारिवारिक परिकार र ६ महिना माथिका शिशुको लिटोमा (बालरोग विशेषज्ञको सल्लाह अनुसार) सजिलै मिसाउन सकिन्छ।',
    icon: Layers,
  },
  {
    number: '04',
    titleEn: 'Hygienic Airtight Packaging',
    titleNp: 'एयरटाइट स्वच्छ प्याकिङ',
    descEn: 'Hygienically sealed in food-grade glass jars, BPA-free food-grade PET jars, and resealable standup pouches to lock in freshness during Nepal’s monsoon.',
    descNp: 'आर्द्रताबाट जोगाउन र ताजापन सुरक्षित राख्न फुड-ग्रेड काँचका जार, फुड-ग्रेड पीईटी जार तथा एयरटाइट पाउचमा सिल गरिन्छ।',
    icon: ShieldCheck,
  },
];

const qualityLedgerRows = [
  {
    standard: 'Ingredient Purity (0% Additives / 0% Refined Sugar)',
    verification: 'Verified via Physical Ingredient Label & Batch Processing Protocol',
    details: 'Every powder and dried fruit SKU is a single-ingredient whole food with 0% maltodextrin, 0% cornstarch, 0% added cane sugar, and 0% sulphur dioxide (E220).',
  },
  {
    standard: 'Packaging Materials (Glass Jars, Food-Grade PET Jars & Pouches)',
    verification: 'Verified per SKU Specification (Transparency Standard)',
    details: 'Powders, oils, figs, berries, macadamia, trail mix, and shilajit are packed in Glass Jars. High-volume seeds and nuts (300 GM Chia, Flax, Pumpkin, Sunflower, Watermelon) use shatter-resistant food-grade PET jars; dehydrated fruit slices use resealable ziplock pouches.',
  },
  {
    standard: 'Pediatric & Infant Food Guidance',
    verification: 'Standard Pediatric Weaning Compliance',
    details: 'All baby weaning porridges (Sweet Potato, Banana, Carrot, Dates, Avocado powders) state clearly: "suitable from 6 months, as advised by your pediatrician".',
  },
  {
    standard: 'Third-Party Lab COA, Organic Certificates & DFTQC License',
    verification: 'OWNER MUST SUPPLY (Unverified Claims Removed)',
    details: 'Third-party organic certificates, DFTQC registration numbers, and batch laboratory assay reports are published on this ledger only after official PDF documents are uploaded by the owner. No unverified certification badges or percentage assay claims are displayed anywhere on our store.',
  },
];

const showrooms = [
  {
    typeEn: 'Central Dispatch Hub & HQ',
    typeNp: 'मुख्य कार्यालय तथा डिस्प्याच हब',
    nameEn: 'Baneshwor, Kathmandu',
    nameNp: 'बानेश्वर, काठमाडौँ',
    addressEn: 'Baneshwor, Kathmandu 44600, Nepal',
    addressNp: 'बानेश्वर, काठमाडौँ ४४६००, नेपाल',
    phone: '+977-9713888002',
    icon: Building2,
  },
  {
    typeEn: 'Authorized Store',
    typeNp: 'आधिकारिक शोरुम',
    nameEn: 'Kids Kottage Kupondol & Kapan',
    nameNp: 'किड्स कटेज कुपण्डोल र कपन',
    addressEn: 'Kupondol (Lalitpur) & Kapan Outlets, Kathmandu Valley',
    addressNp: 'कुपण्डोल ललितपुर तथा कपन, काठमाडौँ उपत्यका',
    phone: 'Direct in-store retail stockist',
    icon: Store,
  },
  {
    typeEn: 'Retail Stockist',
    typeNp: 'काठमाडौँ बिक्री केन्द्र',
    nameEn: 'Zero to Ten (Chabahil)',
    nameNp: 'जिरो टु टेन (चाबहिल)',
    addressEn: 'Chabahil, Kathmandu Valley',
    addressNp: 'चाबहिल, काठमाडौँ उपत्यका',
    phone: 'Baby & family nutrition shelves',
    icon: Store,
  },
  {
    typeEn: 'Regional Partner',
    typeNp: 'कर्णाली, गण्डकी र बागमती हब',
    nameEn: 'Kids Kottage (Pokhara & Surkhet) · Baby Love (Hetauda)',
    nameNp: 'किड्स कटेज (पोखरा र सुर्खेत) · बेबी लभ (हेटौँडा)',
    addressEn: 'Pokhara, Surkhet & Hetauda Partner Showrooms',
    addressNp: 'पोखरा, सुर्खेत र हेटौँडा साझेदार शोरुमहरू',
    phone: 'Regional retail availability',
    icon: Store,
  },
];

export default function AboutPage() {
  const [lang, setLang] = useState<'en' | 'np'>('en');
  const [selectedBelt, setSelectedBelt] = useState(regionsData[0]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('naturesmud_blog_lang');
    if (saved === 'en' || saved === 'np') {
      setLang(saved);
    }
  }, []);

  const handleLanguageChange = (newLang: 'en' | 'np') => {
    setLang(newLang);
    localStorage.setItem('naturesmud_blog_lang', newLang);
  };

  const isEn = lang === 'en';

  return (
    <main className="bg-[#FAF8F5] text-[#2B2B2B] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#172D13] via-[#24451D] to-[#3A6B35] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D9A441]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#7AA95C]/30 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Row: Breadcrumb & Bilingual Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <nav className="text-sm text-emerald-200/80" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-[#D9A441] font-semibold">
                  {isEn ? 'About NaturesMud & Sourcing Standards' : 'नेचर्स मडको परिचय र गुणस्तर मापदण्ड'}
                </li>
              </ol>
            </nav>

            <BlogLanguageSwitcher currentLang={lang} onLanguageChange={handleLanguageChange} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D9A441] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                {isEn ? 'Sourced Across Nepal’s 3 Agro-Ecological Belts' : 'नेपालका ३ भौगोलिक भेगबाट सङ्कलन'}
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                {isEn ? (
                  <>
                    Pure Himalayan Whole Foods. <br />
                    <span className="text-[#D9A441]">Transparent Quality.</span>
                  </>
                ) : (
                  <>
                    शुद्ध हिमाली सम्पूर्ण आहार। <br />
                    <span className="text-[#D9A441]">पारदर्शी गुणस्तर।</span>
                  </>
                )}
              </h1>

              <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
                {isEn
                  ? 'NaturesMud connects Nepali households with 32 single-ingredient superfood powders, dehydrated fruits, whole nuts, seeds, cold-pressed oils, and Himalayan mineral salts — prepared with 0% artificial preservatives and 0% added white sugar.'
                  : 'नेचर्स मडले नेपाली भान्सामा ३२ प्रकारका शुद्ध सुपरफुड पाउडर, डिहाइड्रेटेड फलफूल, ड्राइ फ्रुट्स, सिड्स, कोल्ड-प्रेस तेल र हिमाली नुन उपलब्ध गराउँछ — ०% प्रिजर्भेटिभ र ०% थप चिनी बिना।'}
              </p>

              {/* Factual Product & Sourcing Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">32 SKUs</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">
                    {isEn ? 'Whole-Food Catalog' : '३२ शुद्ध उत्पादनहरू'}
                  </div>
                </div>
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">0%</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">
                    {isEn ? 'Additives / Preservatives' : '०% केमिकल / प्रिजर्भेटिभ'}
                  </div>
                </div>
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">3 Belts</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">
                    {isEn ? 'Terai · Hills · Peaks' : 'तराई · पहाड · हिमाल'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#geographic-belts"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c49235] text-[#1C3317] font-bold text-sm shadow-xl transition-transform active:scale-95 cursor-pointer"
                >
                  <span>{isEn ? 'Explore Sourcing Regions' : 'उत्पादन क्षेत्रहरू हेर्नुहोस्'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#quality-ledger"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-[#D9A441]" />
                  <span>{isEn ? 'Quality & Claims Ledger' : 'गुणस्तर तथा पारदर्शिता विवरण'}</span>
                </a>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-stone-900 group">
                <Image
                  src="/images/posters/authenticity-on-every-table.jpg"
                  alt="Authenticity On Every Table - NaturesMud Pure Collection"
                  fill
                  priority
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441]">
                    {isEn ? 'Authenticity On Every Table' : 'प्रत्येक भान्सामा शुद्धता र प्रामाणिकता'}
                  </span>
                  <p className="text-sm font-medium text-white/90 mt-1">
                    {isEn
                      ? 'Dried Blueberries · Beetroot Powder · Dehydrated Apple · Dates Powder · Himalayan Pink Salt · Extra Virgin Coconut Oil'
                      : 'डिहाइड्रेटेड ब्लुबेरी · चुकन्दर पाउडर · स्याउ · खजुर · गुलाबी नुन · भर्जिन नरिवल तेल'}
                  </p>
                </div>
              </div>

              {/* Floating Nepal Map Pin Badge */}
              <div className="absolute -bottom-5 -left-4 bg-white text-stone-900 px-5 py-3 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#3A6B35]">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-xs font-bold text-stone-800">
                    {isEn ? 'Central Dispatch: Baneshwor, Kathmandu' : 'मुख्य हब: बानेश्वर, काठमाडौँ'}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {isEn ? 'Delivering Across All 77 Districts' : 'नेपालका ७७ वटै जिल्लामा डेलिभरी'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive 3-Belt Agro-Ecological Sourcing Ecosystem */}
      <section id="geographic-belts" className="py-20 bg-white border-b border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-emerald-50 px-4 py-1.5 rounded-full mb-3">
              {isEn ? 'Nepal’s 3 Agro-Ecological Belts' : 'नेपालका ३ भौगोलिक तथा जैविक क्षेत्रहरू'}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              {isEn ? 'Where Our Superfoods Grow' : 'हाम्रा सुपरफुडहरू कहाँ उब्जन्छन्?'}
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              {isEn
                ? 'Nepal offers one of the world’s most diverse microclimates. We source from the distinct agricultural strengths of each altitude to bring clean whole-food ingredients to your table.'
                : 'नेपालमा विविध हावापानी पाइन्छ। हामी प्रत्येक उचाइको विशेष गुण अनुसार स्वच्छ र पौष्टिक बाली सङ्कलन गर्छौं।'}
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
                  className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2.5 shadow-xs cursor-pointer ${
                    isSelected
                      ? 'bg-[#3A6B35] text-white shadow-lg shadow-[#3A6B35]/25 scale-105'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span>{isEn ? region.beltNameEn : region.beltNameNp}</span>
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
                      {isEn ? selectedBelt.altitudeEn : selectedBelt.altitudeNp}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      📍 {isEn ? selectedBelt.locationsEn : selectedBelt.locationsNp}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
                    {isEn ? selectedBelt.beltNameEn : selectedBelt.beltNameNp}
                  </h3>
                  <p className="text-xs font-semibold text-stone-500 -mt-3">
                    {selectedBelt.nepaliSubtitle}
                  </p>

                  <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                    {isEn ? selectedBelt.impactStoryEn : selectedBelt.impactStoryNp}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
                    {selectedBelt.stats.map((st, i) => (
                      <div key={i} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                        <div className="font-heading font-extrabold text-base sm:text-lg text-[#3A6B35]">
                          {st.value}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                          {isEn ? st.labelEn : st.labelNp}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Regional Sourcing Standard Box */}
                  <div className="bg-white p-5 rounded-2xl border-l-4 border-[#3A6B35] shadow-xs">
                    <p className="text-stone-700 text-sm leading-relaxed">
                      {isEn ? selectedBelt.sourcingStandardEn : selectedBelt.sourcingStandardNp}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3A6B35] flex items-center justify-center font-bold text-xs">
                        🌿
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          {isEn ? 'Regional Sourcing Focus' : 'क्षेत्रीय उत्पादन विशेषता'}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {isEn ? selectedBelt.sourcingFocusEn : selectedBelt.sourcingFocusNp}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Region Products Grid */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="font-heading font-bold text-base text-stone-800 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#3A6B35]" />
                    {isEn ? 'Featured Crops from this Belt' : 'यस भेगका मुख्य उत्पादनहरू'}
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
                            alt={isEn ? prod.nameEn : prod.nameNp}
                            fill
                            sizes="200px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="font-heading font-bold text-xs text-stone-900 group-hover:text-[#3A6B35] line-clamp-2 leading-snug">
                          {isEn ? prod.nameEn : prod.nameNp}
                        </span>
                        <span className="text-[11px] text-[#3A6B35] font-semibold mt-1 inline-flex items-center gap-1">
                          {isEn ? 'View Product' : 'विवरण हेर्नुहोस्'} <ArrowRight className="w-3 h-3" />
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

      {/* 3. The 4-Step Zero-Preservative Dehydration Flow */}
      <section className="py-20 bg-[#F4EFE6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-white px-4 py-1.5 rounded-full shadow-xs mb-3">
              {isEn ? '0 Additives · Gentle Processing' : '०% मिसावट · सुरक्षित प्रविधि'}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              {isEn
                ? 'How We Dehydrate, Mill & Pack Whole Foods'
                : 'हामी कसरी स्वच्छ डिहाइड्रेट, पिसाइ र प्याकिङ गर्छौं?'}
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              {isEn
                ? 'Commercial drying often uses high heat or sulphur fumes. Our gentle low-temperature dehydration preserves natural flavor, color, and whole-food nutrients with 0 additives and 0 preservatives.'
                : 'बजारका उत्पादनहरू उच्च तापक्रम वा सल्फर प्रयोग गरी सुकाइन्छन्। हाम्रो न्यून-तापक्रम प्रविधिले प्राकृतिक पोषक तत्व, स्वाद र रङ जोगाउँछ।'}
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
                      {isEn ? step.titleEn : step.titleNp}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {isEn ? step.descEn : step.descNp}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-1 text-[11px] font-bold text-[#3A6B35]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isEn ? '0% Additives · 0% Preservatives' : '०% मिसावट · ०% प्रिजर्भेटिभ'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Quality, Packaging & Claims Verification Ledger */}
      <section id="quality-ledger" className="py-20 bg-white border-b border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-emerald-50 px-4 py-1.5 rounded-full mb-3">
              <FileCheck2 className="w-3.5 h-3.5" />
              {isEn ? 'NaturesMud Transparency Ledger' : 'नेचर्स मड पारदर्शिता विवरण'}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              {isEn
                ? 'Quality, Packaging & Claims Verification Standards'
                : 'गुणस्तर, प्याकेजिङ र प्रामाणिकता मापदण्ड'}
            </h2>
            <p className="text-stone-600 mt-3 text-sm sm:text-base leading-relaxed">
              {isEn
                ? 'We believe Nepali families deserve complete honesty about how their food is processed, what container it arrives in, and which regulatory documents are on file.'
                : 'हामी विश्वास गर्छौं कि प्रत्येक नेपाली परिवारले आफूले खाने खाना कसरी तयार गरिन्छ र कुन प्याकिङमा आउँछ भन्ने स्पष्ट र सत्य जानकारी पाउनुपर्छ।'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qualityLedgerRows.map((row, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3A6B35] flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      {row.verification}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">
                    {row.standard}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {row.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Physical Showrooms & Partner Retailers */}
      <section className="py-20 bg-[#FAF8F5] border-b border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-emerald-50 px-4 py-1.5 rounded-full mb-3">
              {isEn ? 'Visit Us In Person' : 'हाम्रो कार्यालय तथा शोरुमहरू'}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              {isEn ? 'Our Dispatch Hub & Partner Showrooms Across Nepal' : 'हाम्रो मुख्य हब तथा नेपालभरका आधिकारिक बिक्री केन्द्रहरू'}
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              {isEn
                ? 'Order online for doorstep delivery or pick up fresh batches from our Baneshwor, Kathmandu dispatch hub and partner retail stores.'
                : 'अनलाइन अर्डर गर्नुहोस् वा बानेश्वर, काठमाडौँस्थित मुख्य हब र साझेदार स्टोरहरूबाट खरिद गर्नुहोस्।'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showrooms.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#3A6B35] text-xs font-bold uppercase tracking-wide">
                      <Icon className="w-4 h-4" />
                      <span>{isEn ? item.typeEn : item.typeNp}</span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-stone-900">
                      {isEn ? item.nameEn : item.nameNp}
                    </h4>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isEn ? item.addressEn : item.addressNp}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200/60 text-xs font-mono font-semibold text-[#D9A441]">
                    {item.phone}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Brand Video Reel Showcase Teaser */}
      <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D9A441] text-xs font-bold uppercase tracking-wider">
                <Play className="w-3.5 h-3.5 fill-current" /> {isEn ? 'Farm Story in Motion' : 'हाम्रो भिडियो यात्रा'}
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white leading-tight">
                {isEn ? 'See How Real Nepali Superfoods Are Prepared' : 'नेपाली सुपरफुड कसरी तयार गरिन्छ? प्रत्यक्ष हेर्नुहोस्'}
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                {isEn
                  ? 'Watch our harvest and dehydrating journey — from whole farm sweet potatoes to micro-milled baby food powders (from 6 months, as advised by your pediatrician) and dehydrated mountain fruit slices.'
                  : 'हाम्रो बाली सङ्कलन र डिहाइड्रेसन यात्रा हेर्नुहोस् — फार्मको ताजा सखरखण्डदेखि शिशुको लिटो पाउडर (६ महिनादेखि, बालरोग विशेषज्ञको सल्लाह अनुसार) र हिमाली फलफूलसम्म।'}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c59336] text-[#1C3317] font-bold text-sm inline-flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isEn ? 'Play Full Brand Reel' : 'पूरा भिडियो प्ले गर्नुहोस्'}</span>
                </button>
                <Link
                  href="/products"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
                >
                  {isEn ? 'Browse All 32 Products' : 'सबै ३२ उत्पादनहरू हेर्नुहोस्'}
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

      {/* 7. Call to Action */}
      <section className="py-16 bg-[#3A6B35] text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
            {isEn ? 'Taste the Purity of Nepal’s Soil' : 'नेपाली माटोको शुद्धता र पौष्टिकताको अनुभव गर्नुहोस्'}
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto leading-relaxed">
            {isEn ? (
              <>
                Free express shipping on all orders over <strong>Rs. 3,000</strong> across Nepal. 100% natural, 0% added sugar, 0% preservatives.
              </>
            ) : (
              <>
                नेपालभर <strong>रु. ३,०००</strong> भन्दा माथिका सबै अर्डरमा निःशुल्क एक्सप्रेस डेलिभरी। १००% शुद्ध, ०% चिनी, ०% केमिकल।
              </>
            )}
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D9A441] hover:bg-[#c79537] text-[#1C3317] font-extrabold text-base shadow-xl hover:shadow-2xl transition-all"
            >
              <span>{isEn ? 'Shop All 32 Superfoods' : 'सबै ३२ शुद्ध उत्पादनहरू अर्डर गर्नुहोस्'}</span>
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
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-black/70 text-white text-xs font-bold hover:bg-black cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}