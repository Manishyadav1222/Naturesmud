'use client';

import React, { useState, useEffect } from 'react';
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
  Store,
  Building2,
  Globe,
} from 'lucide-react';
import BlogLanguageSwitcher from '@/components/BlogLanguageSwitcher';

const regionsData = [
  {
    id: 'terai',
    beltNameEn: '🌾 Terai Organic Lowlands',
    beltNameNp: '🌾 तराई जैविक फाँट',
    nepaliSubtitle: '१००–३०० मिटर उचाइ (चितवन, झापा, नवलपुर, सर्लाही)',
    altitudeEn: '100m – 300m Altitude',
    altitudeNp: '१००–३०० मिटर उचाइ',
    locationsEn: 'Chitwan · Jhapa · Nawalpur · Sarlahi',
    locationsNp: 'चितवन · झापा · नवलपुर · सर्लाही',
    primaryProducts: [
      { nameEn: 'Organic Sweet Potato Powder (100g)', nameNp: 'अर्ग्यानिक सखरखण्ड पाउडर (१००g)', image: '/products/sweet-potato-powder-100g.jpg', slug: 'sweet-potato-powder' },
      { nameEn: 'Organic Carrot Powder (100g)', nameNp: 'अर्ग्यानिक गाजर पाउडर (१००g)', image: '/products/carrot-powder.jpg', slug: 'carrot-powder' },
      { nameEn: 'Sun-Dried Sweet Papaya (100g)', nameNp: 'डिहाइड्रेटेड गुलियो मेवा (१००g)', image: '/products/papaya.jpg', slug: 'dehydrated-papaya' },
      { nameEn: 'Natural Dates Powder (100g)', nameNp: 'प्राकृतिक खजुर पाउडर (१००g)', image: '/products/dates-powder-100g.jpg', slug: 'dates-powder' },
    ],
    farmerCountEn: '110+ Smallholder Farming Families',
    farmerCountNp: '११०+ साना किसान परिवारहरू',
    impactStoryEn:
      'In the fertile alluvial soils of Chitwan and Nawalpur, we partner with smallholder root and vegetable growers. Before our direct partnership, post-harvest perishability forced farmers to sell at distress prices. By introducing solar micro-dehydration hubs directly at farm sites, farmers receive 35% above market prices, and zero fresh crop is wasted.',
    impactStoryNp:
      'चितवन र नवलपुरको मलिलो माटोमा हामी साना किसानहरूसँग प्रत्यक्ष सहकार्य गर्छौं। पहिले बजार नपाउँदा किसानहरूले सस्तोमा बेच्नुपर्थ्यो। नेचर्स मडले फार्म नजिकै सौर्य डिहाइड्रेसन केन्द्र स्थापना गरेपछि किसानहरूले बजारभन्दा ३५% बढी मूल्य पाउँछन् र बाली खेर जाँदैन।',
    farmerQuoteEn:
      '"We used to lose 40% of our sweet potato crop to market distress. With Nature\'s Mud, our harvest is cleaned, sliced, and solar-dried within 6 hours, and we get paid on the spot with dignity."',
    farmerQuoteNp:
      '"हाम्रो सखरखण्ड पहिले ४०% कुहिएर जान्थ्यो। नेचर्स मडसँग जोडिएपछि बाली टिपेको ६ घण्टामै सफा गरी सुकाइन्छ र उचित मूल्य तुरुन्तै हात पर्छ।"',
    farmerNameEn: 'Ram Bahadur Chaudhary',
    farmerNameNp: 'रामबहादुर चौधरी',
    farmerRoleEn: 'Chitwan Organic Root Growers Cooperative',
    farmerRoleNp: 'चितवन अर्ग्यानिक कृषि सहकारी',
    stats: [
      { labelEn: 'Fair Trade Premium', labelNp: 'उचित किसान मूल्य', value: '+35% Above Market' },
      { labelEn: 'Crop Waste Saved', labelNp: 'बाली संरक्षण', value: '18 Tons/Year' },
      { labelEn: 'Women Harvesters', labelNp: 'महिला सहभागिता', value: '72% Majority' },
    ],
  },
  {
    id: 'hilly',
    beltNameEn: '⛰️ Midland Terraced Green Valleys',
    beltNameNp: '⛰️ पहाडी जैविक उपत्यका',
    nepaliSubtitle: '८००–२,२०० मिटर उचाइ (काभ्रे, सिन्धुपाल्चोक, पाल्पा, इलाम)',
    altitudeEn: '800m – 2,200m Altitude',
    altitudeNp: '८००–२,२०० मिटर उचाइ',
    locationsEn: 'Kavre · Sindhupalchok · Palpa · Ilam',
    locationsNp: 'काभ्रे · सिन्धुपाल्चोक · पाल्पा · इलाम',
    primaryProducts: [
      { nameEn: 'Pure Himalayan Beetroot Powder (100g)', nameNp: 'हिमाली चुकन्दर पाउडर (१००g)', image: '/products/beetroot-powder-100g.jpg', slug: 'beetroot-powder' },
      { nameEn: 'Cold-Pressed Virgin Coconut Oil', nameNp: 'भर्जिन नरिवल तेल', image: '/products/coconut-oil.jpg', slug: 'premium-coconut-oil' },
      { nameEn: 'Organic Flax Seeds (100g)', nameNp: 'अर्ग्यानिक आलस दाना (१००g)', image: '/products/flax-seeds.jpg', slug: 'flax-seeds' },
      { nameEn: 'Organic Chia Seeds (100g)', nameNp: 'अर्ग्यानिक चिया सिड्स (१००g)', image: '/products/chia-seeds.jpg', slug: 'chia-seeds' },
    ],
    farmerCountEn: '95+ Organic Hill Collectives',
    farmerCountNp: '९५+ पहाडी महिला समूहहरू',
    impactStoryEn:
      'The pristine terraced hills of Kavre and Palpa are blessed with mineral-rich mountain soil free from industrial pesticide runoff. We work hand-in-hand with female-led agricultural groups who cultivate deep-crimson beetroots, heirloom turmeric, and ginger with pure organic compost and natural mountain spring irrigation.',
    impactStoryNp:
      'काभ्रे र पाल्पाका पहाडी फाँटहरूमा रासायनिक विषादीरहित अर्ग्यानिक माटो छ। यहाँका महिला कृषक समूहहरूले परम्परागत प्राङ्गारिक मल र हिमाली मुहानको पानी प्रयोग गरी रातो चुकन्दर, बेसार र अदुवा उब्जाउँछन्।',
    farmerQuoteEn:
      '"Our beetroots grow slowly in the cool hill mist, packing dense nitrates and earthy sweetness. Nature\'s Mud cold-grinds them into fine powder without heat, preserving every ounce of natural life."',
    farmerQuoteNp:
      '"हाम्रा चुकन्दर पहाडको चिसो हावापानीमा प्राकृतिक रूपमा हुर्कन्छन्। नेचर्स मडले ताप उत्पन्न नहुने विधिबाट पिँधेर यसको सम्पूर्ण पौष्टिकता जस्ताको तस्तै राख्छ।"',
    farmerNameEn: 'Sita Maya Tamang',
    farmerNameNp: 'सीतामाया तामाङ',
    farmerRoleEn: 'Sindhupalchok Hill Women’s Agriculture Co-op',
    farmerRoleNp: 'सिन्धुपाल्चोक महिला कृषि समूह',
    stats: [
      { labelEn: 'Organic Compost', labelNp: 'प्राङ्गारिक मल', value: '100% Traditional' },
      { labelEn: 'Synthetic Chemicals', labelNp: 'विषादी मिसावट', value: '0.0% Zero' },
      { labelEn: 'Community Seed Fund', labelNp: 'सामुदायिक कोष', value: 'Rs. 4.5L Seed Fund' },
    ],
  },
  {
    id: 'himalaya',
    beltNameEn: '🏔️ High Himalayan Alpine Peaks',
    beltNameNp: '🏔️ उच्च हिमाली भेग',
    nepaliSubtitle: '२,५००–३,५००+ मिटर उचाइ (मुस्ताङ, जुम्ला, मनाङ, डोल्पा)',
    altitudeEn: '2,500m – 3,500m+ Altitude',
    altitudeNp: '२,५००–३,५००+ मिटर उचाइ',
    locationsEn: 'Mustang · Jumla · Manang · Dolpa',
    locationsNp: 'मुस्ताङ · जुम्ला · मनाङ · डोल्पा',
    primaryProducts: [
      { nameEn: 'Wild Mustang Cliff Raw Honey', nameNp: 'मुस्ताङको काँचो भिर मह', image: '/products/raw-honey.jpg', slug: 'raw-honey' },
      { nameEn: 'Wild Dried Himalayan Blueberries (100g)', nameNp: 'हिमाली जंगली ब्लुबेरी (१००g)', image: '/products/dried-blueberries-100g.jpg', slug: 'dried-blueberries' },
      { nameEn: 'Raw Himalayan Walnut Halves', nameNp: 'हिमाली काँचो ओखर', image: '/products/walnuts.jpg', slug: 'himalayan-walnuts' },
      { nameEn: 'Pure Himalayan Shilajit Resin', nameNp: 'शुद्ध हिमाली शिलाजीत', image: '/products/shilajit.jpg', slug: 'pure-shilajit-resin' },
    ],
    farmerCountEn: '75+ Indigenous Foragers & Harvesters',
    farmerCountNp: '७५+ हिमाली जडीबुटी सङ्कलक',
    impactStoryEn:
      'At 3,000 meters altitude in Mustang and Jumla, nature thrives in its purest state. Here, wild bees harvest nectar from high-altitude medicinal flora, and wild blueberries absorb intense ultraviolet alpine light to develop unmatched antioxidant anthocyanin levels. We supply safety gear and fair forward contracts directly to indigenous foragers.',
    impactStoryNp:
      'मुस्ताङ र जुम्लाका ३,००० मिटर अग्ला भिरपाखामा जंगली मौरीले बहुमूल्य हिमाली जडीबुटीबाट मह बनाउँछन्। उच्च उचाइका ब्लुबेरीमा भरपूर एन्टिअक्सिडेन्ट हुन्छ। हामी हिमाली सङ्कलकहरूलाई सुरक्षा उपकरण र उचित पारिश्रमिक उपलब्ध गराउँछौं।',
    farmerQuoteEn:
      '"Foraging wild cliff honey is our ancestral heritage. Nature\'s Mud lab-tests every batch for purity and ensures we receive respectful livelihood compensation without middlemen."',
    farmerQuoteNp:
      '"भिर मह काढ्ने हाम्रो पुख्र्यौली पेशा हो। नेचर्स मडले प्रत्येक ब्याचको शुद्धता परीक्षण गर्छ र बिचौलिया बिना हामीलाई उचित आम्दानी दिन्छ।"',
    farmerNameEn: 'Pasang Norbu Gurung',
    farmerNameNp: 'पासाङ नोर्बु गुरुङ',
    farmerRoleEn: 'Mustang Wild Cliff Honey Harvesters Collective',
    farmerRoleNp: 'मुस्ताङ भिर मह सङ्कलक समूह',
    stats: [
      { labelEn: 'Altitude Range', labelNp: 'सङ्कलन उचाइ', value: '3,000m – 3,800m' },
      { labelEn: 'Middlemen Cut', labelNp: 'बिचौलिया रहित', value: '100% Direct' },
      { labelEn: 'Live Enzymes', labelNp: 'सक्रिय इन्जाइम', value: '98.5% Preserved' },
    ],
  },
];

const processSteps = [
  {
    number: '01',
    titleEn: 'Peak Nutrition Organic Harvest',
    titleNp: 'उचित समयमा अर्ग्यानिक बाली सङ्कलन',
    descEn: 'Handpicked at absolute peak nutritional ripeness by local farmer cooperatives across Terai, Hilly, and Alpine regions of Nepal.',
    descNp: 'नेपालका तराई, पहाड र हिमालका साना किसान समूहहरूद्वारा पूर्ण पाकेको र पोषणले भरिपूर्ण अवस्थामा हातले टिपिएको।',
    icon: Sprout,
  },
  {
    number: '02',
    titleEn: 'Solar & Low-Temp Dehydration (<42°C)',
    titleNp: 'सौर्य तथा कम तापक्रम डिहाइड्रेसन (<४२°C)',
    descEn: 'Gently dehydrated in closed solar dehydrators to preserve 98% of natural vitamins, live enzymes, and rich colors without sulfur chemicals.',
    descNp: '४२ डिग्री भन्दा कम तापक्रममा बन्द सौर्य डिहाइड्रेटरमा सुकाइन्छ, जसले सल्फर केमिकल बिना ९८% भिटामिन र इन्जाइम सुरक्षित राख्छ।',
    icon: Sun,
  },
  {
    number: '03',
    titleEn: 'Frictionless Cold Micro-Milling',
    titleNp: 'कोल्ड माइक्रो-मिलिङ प्रविधि',
    descEn: 'Milled using friction-free stone and cold micro-milling into silky, ultra-fine whole food powders ideal for baby food, fitness, and daily health.',
    descNp: 'ताप उत्पन्न नहुने चिसो प्रविधिबाट मसिनो गरी पिँधिन्छ, जसले गर्दा शिशुको लिटो र कसरत ड्रिंकमा सजिलै घुल्ने शुद्ध पाउडर तयार हुन्छ।',
    icon: Layers,
  },
  {
    number: '04',
    titleEn: '100g Airtight Eco Glass Jar Sealing',
    titleNp: '१००g इको ग्लास जारमा सुरक्षित सिल',
    descEn: 'Hygienically sealed in airtight 100g glass jars with tamper-proof seals to lock in mountain freshness and eliminate single-use plastics.',
    descNp: 'प्लास्टिकमुक्त १०० ग्रामका एयरटाइट ग्लास जारमा ताजापन सुरक्षित राख्न सिल गरिन्छ, जसले खाद्य स्वच्छता सुनिश्चित गर्छ।',
    icon: ShieldCheck,
  },
];

const showrooms = [
  {
    typeEn: 'Central Sourcing Hub & HQ',
    typeNp: 'मुख्य कार्यालय तथा हब',
    nameEn: 'Gongabu & Samakhushi',
    nameNp: 'गोंगबु तथा सामाखुशी',
    addressEn: 'Arya Complex, Gongabu Chowk (near Kumari Bank), Kathmandu',
    addressNp: 'आर्या कम्प्लेक्स, गोंगबु चोक (कुमारी बैंक नजिक), काठमाडौँ',
    phone: '+977 9713888002',
    icon: Building2,
  },
  {
    typeEn: 'Authorized Store',
    typeNp: 'आधिकारिक शोरुम',
    nameEn: 'Kids Kottage Kupondol & Kapan',
    nameNp: 'किड्स कटेज कुपण्डोल र कपन',
    addressEn: 'Kupondol (Lalitpur) & Kapan Outlets, Kathmandu Valley',
    addressNp: 'कुपण्डोल ललितपुर तथा कपन, काठमाडौँ उपत्यका',
    phone: 'Direct in-store sample tasting',
    icon: Store,
  },
  {
    typeEn: 'Regional Partner',
    typeNp: 'गण्डकी प्रदेश हब',
    nameEn: 'Kids Kottage Pokhara',
    nameNp: 'किड्स कटेज पोखरा',
    addressEn: 'New Road, Pokhara, Gandaki Province',
    addressNp: 'न्यूरोड, पोखरा, गण्डकी प्रदेश',
    phone: 'All 100g products available',
    icon: Store,
  },
  {
    typeEn: 'Retail Stockists',
    typeNp: 'अन्य बिक्री केन्द्र',
    nameEn: 'Chabahil & Hetauda Outlets',
    nameNp: 'चाबहिल तथा हेटौँडा',
    addressEn: 'Zero to Ten (Chabahil, KTM) & Baby Love (Hetauda)',
    addressNp: 'जिरो टु टेन (चाबहिल) र बेबी लभ (हेटौँडा)',
    phone: 'Baby & organic nutrition shelves',
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
      {/* 1. Hero Section with Glow & Organic Particles */}
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
                  {isEn ? 'Our Story & Farmer Roots' : 'हाम्रो कथा र किसान सम्बन्ध'}
                </li>
              </ol>
            </nav>

            <BlogLanguageSwitcher currentLang={lang} onLanguageChange={handleLanguageChange} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D9A441] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                {isEn ? 'Direct Sourced from Nepal’s 3 Ecological Belts' : 'नेपालका ३ भौगोलिक भेगबाट सिधै सङ्कलन'}
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                {isEn ? (
                  <>
                    Pure Himalayan Food. <br />
                    <span className="text-[#D9A441]">Real Farmer Dignity.</span>
                  </>
                ) : (
                  <>
                    शुद्ध हिमाली खाना। <br />
                    <span className="text-[#D9A441]">वास्तविक किसान मर्यादा।</span>
                  </>
                )}
              </h1>

              <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
                {isEn
                  ? 'Nature’s Mud was born out of a profound mission: connecting Nepali families with 100% natural, chemical-free superfoods while ensuring rural farming families across Terai, Hilly, and Alpine regions receive fair, dignified livelihoods.'
                  : 'नेचर्स मडको एउटै मूल उद्देश्य छ: नेपाली परिवारहरूलाई १००% शुद्ध, रसायनरहित सुपरफुड उपलब्ध गराउँदै तराई, पहाड र हिमालका साना किसानहरूलाई उचित मूल्य र सम्मानजनक जीवनयापन सुनिश्चित गर्नु।'}
              </p>

              {/* Trust Metric Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">280+</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">
                    {isEn ? 'Farmer Families' : 'किसान परिवारहरू'}
                  </div>
                </div>
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#D9A441]">100%</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">
                    {isEn ? 'Zero Preservatives' : '०% केमिकल / प्रिजर्भेटिभ'}
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
                  <span>{isEn ? 'Explore Farmer Regions' : 'हाम्रा उत्पादन क्षेत्रहरू'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 text-[#D9A441] fill-[#D9A441]" />
                  <span>{isEn ? 'Watch Farm Story Video' : 'हाम्रो भिडियो कथा हेर्नुहोस्'}</span>
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
                    {isEn ? '100g Pure Food Collection' : '१०० ग्राम शुद्ध खाद्य सङ्ग्रह'}
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
                  <div className="text-xs font-bold text-stone-800">
                    {isEn ? '100% Nepali Origin' : '१००% नेपाली माटोको उपज'}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {isEn ? 'From 100m to 3,500m Altitudes' : '१०० देखि ३,५०० मिटर उचाइबाट'}
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
              {isEn ? 'Where Our Organic Superfoods Grow' : 'हाम्रा अर्ग्यानिक सुपरफुडहरू कहाँ उब्जन्छन्?'}
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              {isEn
                ? 'Nepal offers one of the world’s most diverse microclimates. We harness the unique biological strengths of each altitude to harvest nature’s purest, most potent crops.'
                : 'नेपालमा संसारकै दुर्लभ र विविध हावापानी पाइन्छ। हामी प्रत्येक उचाइको विशेष गुण अनुसार शुद्ध र पौष्टिक बाली सङ्कलन गर्छौं।'}
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

                  {/* Impact Stats Grid */}
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

                  {/* Farmer Quote Box */}
                  <div className="bg-white p-5 rounded-2xl border-l-4 border-[#3A6B35] shadow-xs">
                    <p className="italic text-stone-700 text-sm leading-relaxed">
                      {isEn ? selectedBelt.farmerQuoteEn : selectedBelt.farmerQuoteNp}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3A6B35] flex items-center justify-center font-bold text-xs">
                        👨‍🌾
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          {isEn ? selectedBelt.farmerNameEn : selectedBelt.farmerNameNp}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {isEn ? selectedBelt.farmerRoleEn : selectedBelt.farmerRoleNp}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Region Products Grid */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="font-heading font-bold text-base text-stone-800 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#3A6B35]" />
                    {isEn ? 'Featured 100g Crops from this Belt' : 'यस भेगका मुख्य १००g उत्पादनहरू'}
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
                          {isEn ? 'View 100g Pack' : 'विवरण हेर्नुहोस्'} <ArrowRight className="w-3 h-3" />
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
              {isEn ? 'Zero Chemicals · Solar Science' : 'रसायनरहित · सौर्य प्रविधि'}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              {isEn
                ? 'How We Dehydrate & Mill Without Damaging Nutrients'
                : 'पोषक तत्व नष्ट नहुने गरी हामी कसरी डिहाइड्रेट र पिसाइ गर्छौं?'}
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              {isEn
                ? 'Commercial drying often uses high oven heat or toxic sulfur fumes. Here is why our cold solar technology locks in 98% bioactive nutrients.'
                : 'बजारका उत्पादनहरू उच्च तापक्रम वा सल्फर केमिकल प्रयोग गरी सुकाइन्छन्। हाम्रो चिसो सौर्य प्रविधिले ९८% प्राकृतिक पोषक तत्व जस्ताको तस्तै राख्छ।'}
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
                    <span>{isEn ? 'Lab Verified Safe' : 'प्रयोगशाला प्रमाणित शुद्ध'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Physical Showrooms & Partner Retailers */}
      <section className="py-20 bg-white border-b border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-emerald-50 px-4 py-1.5 rounded-full mb-3">
              {isEn ? 'Visit Us In Person' : 'हाम्रो कार्यालय तथा शोरुमहरू'}
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              {isEn ? 'Our Sourcing Hub & Showrooms Across Nepal' : 'हाम्रो मुख्य हब तथा नेपालभरका आधिकारिक बिक्री केन्द्रहरू'}
            </h2>
            <p className="text-stone-600 mt-3 text-base leading-relaxed">
              {isEn
                ? 'Experience our product range in person, taste samples, and pick up fresh 100g batches directly from our central Kathmandu hub and partner stores.'
                : 'हाम्रा उत्पादनहरू प्रत्यक्ष अवलोकन गर्न, स्वाद चाख्न र ताजा ब्याच खरिद गर्न काठमाडौँस्थित मुख्य हब र साझेदार स्टोरहरूमा पाल्नुहोस्।'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showrooms.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
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

      {/* 5. Brand Video Reel Showcase Teaser */}
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
                  ? 'Watch our harvest and dehydrating journey — from whole farm sweet potatoes to micro-milled baby food powders and high-altitude wild honey jars.'
                  : 'हाम्रो बाली सङ्कलन र सौर्य डिहाइड्रेसन यात्रा हेर्नुहोस् — फार्मको ताजा सखरखण्डदेखि शिशुको लिटो पाउडर र हिमाली भिर महसम्म।'}
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
                  {isEn ? 'Browse 100g Catalog' : 'सबै उत्पादनहरू हेर्नुहोस्'}
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

      {/* 6. Call to Action */}
      <section className="py-16 bg-[#3A6B35] text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
            {isEn ? 'Taste the Purity of Nepal’s Soil' : 'नेपाली माटोको शुद्धता र पौष्टिकताको अनुभव गर्नुहोस्'}
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto leading-relaxed">
            {isEn ? (
              <>
                Free express shipping on all orders over <strong>Rs. 10,000</strong> across Nepal. 100% natural, 0% added sugar, 0% preservatives.
              </>
            ) : (
              <>
                नेपालभर <strong>रु. १०,०००</strong> भन्दा माथिका सबै अर्डरमा निःशुल्क एक्सप्रेस डेलिभरी। १००% शुद्ध, ०% चिनी, ०% केमिकल।
              </>
            )}
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D9A441] hover:bg-[#c79537] text-[#1C3317] font-extrabold text-base shadow-xl hover:shadow-2xl transition-all"
            >
              <span>{isEn ? 'Shop All 100g Superfoods' : 'सबै अर्ग्यानिक उत्पादनहरू अर्डर गर्नुहोस्'}</span>
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
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center text-lg font-bold hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Close modal"
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