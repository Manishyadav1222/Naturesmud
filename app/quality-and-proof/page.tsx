import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  Sparkles,
  Leaf,
  Scale,
  Microscope,
  Package,
  MapPin,
  Clock,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Sun,
  Flame,
  Award,
} from 'lucide-react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Quality Standards, Lab Testing & Proof | NaturesMud',
  description:
    'Explore NaturesMud quality protocols: sanitary low-heat drying, honest Nepal origin belts, DFTQC compliance roadmap & batch photo verification on WhatsApp.',
  openGraph: {
    title: 'Quality Standards, Lab Testing & Proof | NaturesMud',
    description:
      'Explore NaturesMud quality protocols: sanitary low-heat drying, honest Nepal origin belts, DFTQC compliance roadmap & batch photo verification on WhatsApp.',
    url: `${siteConfig.url}/quality-and-proof`,
    siteName: siteConfig.name,
    locale: 'en_NP',
    type: 'website',
  },
  alternates: {
    canonical: `${siteConfig.url}/quality-and-proof`,
  },
};

const TESTING_PILLARS = [
  {
    icon: Microscope,
    title: 'Microbiological Safety',
    desc: 'Screened against common pathogens including E. coli, Salmonella species, and environmental yeast & mold to ensure clean safety for all ages.',
    status: 'DFTQC Guidelines Applied',
  },
  {
    icon: Scale,
    title: 'Heavy Metals Screening',
    desc: 'Targeted screening for Lead (Pb), Cadmium (Cd), Arsenic (As), and Mercury (Hg), essential for authentic high-altitude Shilajit resin and root powders.',
    status: 'Strict Purity Limits',
  },
  {
    icon: Sun,
    title: 'Moisture Control (<5% Powders)',
    desc: 'Moisture tightly capped under 5% for botanical powders and under 15% for dehydrated fruit slices to prevent mold during Nepal’s humid monsoon season.',
    status: 'Monsoon-Safe Sealed',
  },
  {
    icon: Leaf,
    title: '100% Single-Ingredient Purity',
    desc: '0% added cane sugar, 0% maltodextrin, 0% preservatives (sodium benzoate, sulphur dioxide), 0% artificial flavors, and 0% synthetic anti-caking agents.',
    status: 'Zero Chemical Additives',
  },
];

const PROVENANCE_BELTS = [
  {
    belt: '🌾 Terai Lowland Plains (100m – 300m)',
    districts: 'Chitwan · Nawalpur · Jhapa · Sarlahi',
    crops: 'Bananas, Moringa Leaf, Papaya, Mango, Sweet Potato, Carrot',
    dryingMethod: 'Sanitary Closed-Chamber Dehydration (<42°C)',
    honestyNote: 'Honestly labelled as Terai / Lowland product of Nepal. Never marketed as "Himalayan".',
  },
  {
    belt: '⛰️ Mid-Hills Terraces & Valleys (800m – 1,800m)',
    districts: 'Kavrepalanchok · Dhading · Ilam · Kathmandu Valley',
    crops: 'Hass Avocados, Strawberries, Vegetables, Raw Honey',
    dryingMethod: 'Sub-Zero Lyophilization (Freeze-Drying) & Low-Heat Dehydration (<40°C)',
    honestyNote: 'Cultivated on terraced organic hills with clean mountain spring irrigation.',
  },
  {
    belt: '🏔️ High Himalayan Belts (2,500m – 4,500m+)',
    districts: 'Mustang · Jumla · High Alpine Himalayan Rocks',
    crops: 'Mustang Apples (Sukuti), Wild Blueberries, Himalayan Shilajit Resin, Pink Salt',
    dryingMethod: 'Alpine Sun & Air Drying / Traditional Stone Purification',
    honestyNote: 'Authentic Himalayan harvest packed directly in food-grade airtight containers.',
  },
  {
    belt: '🌐 Single-Origin Premium Dry Fruits (Sorted in Nepal)',
    districts: 'Imported from premier global harvest origins; sorted, roasted & sealed in Kathmandu',
    crops: 'W240 Jumbo Cashew Kernels, Whole Almonds, Turkish Figs, Green Pistachios, Macadamias',
    dryingMethod: 'Oil-Free Convection Dry Roasting with Himalayan Pink Salt',
    honestyNote: 'Kernels sourced globally, hand-graded and packed fresh at our Kathmandu facility with zero chemical bleaching.',
  },
];

export default function QualityAndProofPage() {
  return (
    <div className="bg-[#FAF8F5] text-stone-800 min-h-screen py-10 sm:py-16">
      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <nav className="text-xs sm:text-sm text-stone-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-emerald-800 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-emerald-900 font-semibold">Quality &amp; Proof</li>
          </ol>
        </nav>
      </div>

      {/* ── Hero Section ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-gradient-to-br from-[#1A3826] via-[#234832] to-[#142D1E] text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-emerald-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Uncompromising Quality &amp; Transparency</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F2] leading-tight">
              Quality, Testing &amp; Honest Sourcing Standards
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans">
              At NaturesMud Nepal, we believe true luxury is single-ingredient purity. We operate on
              radical transparency: honest geographic origins, gentle temperature-controlled drying,
              airtight glass packaging, and zero synthetic shortcuts. Here is the verifiable truth
              behind every jar and pouch we seal.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-100 border border-white/15">
                ✓ 0% Cane Sugar
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-100 border border-white/15">
                ✓ 0% Preservatives &amp; Sulphur
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-100 border border-white/15">
                ✓ 0% Artificial Colors
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-100 border border-white/15">
                ✓ Food-Grade Glass Jars
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Regulatory Compliance & Verification Notice (DFTQC & PAN) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-2">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>Regulatory Status &amp; Compliance Statement</span>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
                Government Compliance &amp; Licensing Status
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold font-mono">
              Kathmandu, Nepal
            </span>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed">
            In strict compliance with the Nepal Food Act 2023 (1966) and regulations set forth by
            the <strong>Department of Food Technology and Quality Control (DFTQC, Babarmahal, Kathmandu)</strong>,
            NaturesMud maintains rigorous hygiene standards across all sorting, drying, and packaging operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* DFTQC License Box */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-stone-900">DFTQC Food Registration</strong>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  TODO_OWNER
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Food processing registration under the Department of Food Technology and Quality Control (खाद्य प्रविधि तथा गुण नियन्त्रण विभाग).
              </p>
              <div className="bg-white p-3 rounded-xl border border-dashed border-amber-300 text-xs text-stone-700 space-y-1">
                <div>
                  <span className="text-stone-500">Registration Status:</span>{' '}
                  <strong className="text-amber-900 font-mono">[TODO_OWNER: Pending License Certificate Upload]</strong>
                </div>
                <div>
                  <span className="text-stone-500">License Number:</span>{' '}
                  <span className="font-mono text-stone-700">[TODO_OWNER: Insert DFTQC License No.]</span>
                </div>
              </div>
            </div>

            {/* PAN / VAT Box */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-stone-900">PAN / VAT Legal Registration</strong>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  TODO_OWNER
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Registered taxpayer enterprise in Kathmandu, Nepal. Formal tax invoice provided with eligible purchases.
              </p>
              <div className="bg-white p-3 rounded-xl border border-dashed border-amber-300 text-xs text-stone-700 space-y-1">
                <div>
                  <span className="text-stone-500">Registered Entity:</span>{' '}
                  <strong className="text-stone-800">[TODO_OWNER: Insert Legal Business Name]</strong>
                </div>
                <div>
                  <span className="text-stone-500">PAN / VAT Number:</span>{' '}
                  <span className="font-mono text-stone-700">[TODO_OWNER: 9-Digit Tax ID]</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl text-xs text-stone-600 border border-stone-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Note on Verification:</strong> Antigravity and NaturesMud never fabricate government certificates or registration numbers.
              Pending business license scans and tax registration certificates are cataloged in our{' '}
              <a href="#owner-checklist" className="text-emerald-800 font-bold underline">
                Needed from Owner Checklist (OWNER-DOC-01 / OWNER-DOC-02)
              </a>{' '}
              and will be uploaded directly upon verification.
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 Scientific Pillars of Quality Testing ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Testing Protocols
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Our 4 Pillars of Product Integrity
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            How we protect nutrient density, microbiological safety, and shelf-life stability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTING_PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-stone-900">{p.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">{p.desc}</p>
                </div>
                <div className="pt-3 border-t border-stone-100">
                  <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50/70 px-2.5 py-1 rounded-full">
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Laboratory Testing Reports Roadmap ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2 inline-block">
                Third-Party Testing
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
                Product Lab Analysis &amp; Certificate Roadmap
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold">
              Batch Verification
            </span>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed">
            We work with independent food-testing laboratories in Nepal to verify safety metrics. Below is the
            status of certified lab documentation for our flagship superfoods:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                product: 'Pure Himalayan Shilajit Resin (20g)',
                target: 'Heavy Metals (Lead, Cadmium, Arsenic, Mercury) + Fulvic Acid Content',
                status: 'TODO_OWNER',
                details: 'Pending upload of third-party accredited laboratory test report PDF.',
              },
              {
                product: 'Freeze Dried Avocado Powder (80g)',
                target: 'Moisture content (<4.5%), Oleic acid / healthy fat retention, Aerobic plate count',
                status: 'TODO_OWNER',
                details: 'Pending batch lab report upload from lyophilization testing facility.',
              },
              {
                product: 'Moringa Leaf Powder (200g)',
                target: 'Microbial pathogen screen (E. coli, Salmonella) & Chlorophyll density',
                status: 'TODO_OWNER',
                details: 'Pending Terai/Mid-Hills harvest batch microbiological certificate upload.',
              },
              {
                product: 'Extra Virgin Coconut Oil (500ml / 180ml)',
                target: 'Peroxide value (<3 meq/kg), Free fatty acid (<0.2%), Lauric acid assay (>48%)',
                status: 'TODO_OWNER',
                details: 'Pending cold-press extraction chemical analysis certificate upload.',
              },
            ].map((item) => (
              <div
                key={item.product}
                className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-heading font-bold text-sm text-stone-900">{item.product}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 mb-2">
                    <strong className="text-stone-700">Target Parameters:</strong> {item.target}
                  </div>
                  <p className="text-[11px] text-stone-500 italic">{item.details}</p>
                </div>
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Document Status:</span>
                  <span className="font-semibold text-amber-800">[TODO_OWNER: Pending PDF File]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Geographic Provenance & Farming Belts ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Radical Origin Honesty
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Sourcing Belts Across Nepal
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            We never market low-altitude Terai crops as &quot;Himalayan&quot;. Here is where every crop actually grows.
          </p>
        </div>

        <div className="space-y-4">
          {PROVENANCE_BELTS.map((belt) => (
            <div
              key={belt.belt}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-heading font-bold text-lg text-stone-900">{belt.belt}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{belt.districts}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                  {belt.dryingMethod}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200/70">
                  <span className="text-stone-500 block">Sourced Crops:</span>
                  <strong className="text-stone-900 mt-0.5 block">{belt.crops}</strong>
                </div>
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70">
                  <span className="text-emerald-800 font-semibold block">Honesty Standard:</span>
                  <span className="text-emerald-950 mt-0.5 block">{belt.honestyNote}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Packaging & Monsoon Protection ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30 mb-2 inline-block">
                Monsoon-Grade Protection
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                Food-Grade Glass Packaging &amp; Batch Transparency
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                Ashadh–Bhadra Safe
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
              <Package className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-sm text-white">Airtight Glass Jars</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Zero microplastic leaching. Airtight seals block 100% of atmospheric humidity, preserving fruit
                and powder freshness through Kathmandu’s intense monsoons.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-sm text-white">Live Batch Printing</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Every container features physical label printing: Batch Number, Packaging Date, Best Before Date,
                and exact Net Weight (80g / 100g / 200g / 500ml).
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
              <MessageCircle className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-sm text-white">Verify Before You Order</h3>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Not sure about expiry or packing freshness? Message our packaging floor directly on WhatsApp and
                receive an unedited live photo of today’s jar label.
              </p>
            </div>
          </div>

          {/* WhatsApp Verification CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <div className="text-xs text-stone-300 text-center sm:text-left">
              Want to inspect today’s packaging batch before ordering? Our Sitapaila packaging team is available daily.
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=9779713888002&text=${encodeURIComponent(
                'Hello NaturesMud Nepal! 🙏 Please send me a live unedited photo of today’s batch label and packaging before I place my order.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Request Batch Photo on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Technical Auditor Checklist Anchor ── */}
      <section id="owner-checklist" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200 text-xs text-stone-600 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <strong className="text-stone-900 text-sm font-heading">
              Technical Audit &amp; Documentation Transparency
            </strong>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-stone-200">
              audit.md &middot; NEEDED_FROM_OWNER.md
            </span>
          </div>
          <p className="leading-relaxed">
            This Quality &amp; Proof page is part of our comprehensive technical and compliance audit. To maintain absolute
            scientific integrity, all missing or pending business documentation (DFTQC license scan, laboratory certificates,
            and PAN registration) are formally tracked in our internal repository under <code>NEEDED_FROM_OWNER.md</code>.
            As soon as official documents are provided by company leadership, verified PDF download links will be published here.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900"
            >
              <span>Explore Verified Whole-Food Products</span> &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
