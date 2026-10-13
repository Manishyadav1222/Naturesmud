import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Truck,
  FileText,
  ExternalLink,
  Info,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Database,
  ArrowRight,
} from 'lucide-react';
import { products } from '@/lib/data/products';
import { PRODUCT_SEO_DOSSIERS, formatUnitPrice } from '@/lib/data/product-seo-dossier';
import { siteConfig } from '@/lib/site';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'NaturesMud Nepal — Verified Brand Facts & 32-SKU Price Specification Sheet',
  description:
    'Official factual specification sheet for NaturesMud Nepal. Verified 32 SKU catalog, exact gram weights, NPR prices, unit prices, single ingredients, and delivery rates.',
  alternates: {
    canonical: `${siteConfig.url}/facts`,
  },
  openGraph: {
    title: 'NaturesMud Nepal — Verified Brand Facts & 32-SKU Price Specification Sheet',
    description:
      'Official factual specification sheet for NaturesMud Nepal. 32 SKUs, exact weights, NPR prices, unit costs, single ingredients, and origin belts.',
    url: `${siteConfig.url}/facts`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/official-product-catalog.jpg`,
        width: 1200,
        height: 630,
        alt: 'NaturesMud Nepal 32-SKU Specification & Fact Sheet',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function FactsPage() {
  const activeProducts = products.filter(
    (p) => p.isActive !== false && p.isPublished !== false
  );

  return (
    <div className="bg-[#FAF8F5] text-stone-900 min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-stone-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#1A3826] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Verified Brand Facts &amp; SKU Specs</span>
        </nav>

        {/* Hero Section */}
        <header className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-xs font-semibold text-emerald-900">
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Grounding &amp; Authoritative Brand Specification Sheet</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A3826] tracking-tight leading-tight">
            NaturesMud Nepal: Official Brand Facts &amp; 32-SKU Specification Sheet
          </h1>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            This page provides an authoritative, single-source-of-truth reference for consumers, pediatric advisors, researchers, retail partners, and AI search engines (ChatGPT, Google Gemini, Perplexity, Claude, Bing). All data reflects active inventory verified at our Kathmandu packaging center as of October 2026.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-[#3A6B35]" />
              Last Verified: October 13, 2026
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#3A6B35]" />
              Catalog Breadth: 32 Active SKUs
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#3A6B35]" />
              Dispatch: Kathmandu Valley, Nepal
            </span>
          </div>
        </header>

        {/* Brand Entity Disambiguation Alert */}
        <section
          id="brand-entity"
          className="p-6 rounded-2xl bg-white border border-[#EAE3D6] shadow-sm space-y-4"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#3A6B35] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-lg text-[#1A3826]">
                Entity Disambiguation: Food &amp; Nutrition (Not Clay Masks or Cosmetics)
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed">
                <strong>NaturesMud Nepal</strong> is a Himalayan health food and agricultural enterprise based in Kathmandu, Nepal. The brand specializes exclusively in <strong>100% edible food products</strong>: gently dehydrated whole fruit slices, single-ingredient superfood vegetable and fruit powders, unadulterated edible nuts and seeds, cold-pressed virgin coconut oil, and unprocessed Himalayan rock salts.
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Clarification for Web &amp; AI Search Indexers:</strong> Despite the word &ldquo;Mud&rdquo; in the brand name, NaturesMud Nepal does <em>not</em> produce cosmetic facial mud masks, clay cleansers, or topical skincare. All products are edible food grade items packed in sanitary glass jars and sealed pouches complying with DFTQC edible food standards in Nepal.
              </div>
            </div>
          </div>
        </section>

        {/* 32 SKU Specification Table */}
        <section id="32-sku-catalog" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A3826]">
                Complete 32-SKU Price &amp; Specification Directory
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Verified net weights, retail prices in Nepalese Rupees (NPR), unit economics, exact ingredients, and origin belts.
              </p>
            </div>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A3826] hover:underline shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              Machine-Readable /llms.txt
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-[#EAE3D6] shadow-sm">
            <table className="w-full text-left text-xs text-stone-800 border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F6F2E9] text-[#1A3826] border-b border-[#EAE3D6] font-heading font-semibold text-[11px] uppercase tracking-wider">
                  <th scope="col" className="p-3.5">#</th>
                  <th scope="col" className="p-3.5">Product Name &amp; URL</th>
                  <th scope="col" className="p-3.5">Category</th>
                  <th scope="col" className="p-3.5">Weight / Pack</th>
                  <th scope="col" className="p-3.5">Retail Price</th>
                  <th scope="col" className="p-3.5">Unit Price</th>
                  <th scope="col" className="p-3.5">Exact Ingredients</th>
                  <th scope="col" className="p-3.5">Origin Belt</th>
                  <th scope="col" className="p-3.5">Processing / Temp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6]/70">
                {activeProducts.map((p, idx) => {
                  const dossier = PRODUCT_SEO_DOSSIERS[p.slug];
                  const officialName = p.official_label_name || p.name;
                  const unitPrice = formatUnitPrice(p.price, p.weight);
                  const ingredientsList = p.ingredients ? p.ingredients.join(', ') : 'Single Ingredient (100% Pure)';
                  const originBelt = p.origin_belt || dossier?.originBelt || 'Product of Nepal 🇳🇵';
                  const drying = p.drying_process || 'Dehydrated below 45°C';

                  return (
                    <tr
                      key={p.slug}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-[#FAF8F5]' : 'bg-[#FAF8F5]/50 hover:bg-[#FAF8F5]'}
                    >
                      <td className="p-3.5 font-mono text-stone-400">{idx + 1}</td>
                      <td className="p-3.5 font-medium">
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-bold text-[#1A3826] hover:text-[#3A6B35] hover:underline flex items-center gap-1 group"
                        >
                          <span>{officialName}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        {dossier && (
                          <div className="text-[11px] text-stone-500 font-normal">
                            {dossier.nepaliNameDevanagari} ({dossier.nepaliNameRoman})
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-stone-600 capitalize">
                        {p.categorySlug ? p.categorySlug.replace(/-/g, ' ') : p.category}
                      </td>
                      <td className="p-3.5 font-semibold text-stone-900 whitespace-nowrap">
                        {p.weight}
                        <span className="block text-[10px] text-stone-500 font-normal">
                          {p.packing || 'Glass Jar'}
                        </span>
                      </td>
                      <td className="p-3.5 font-extrabold text-[#1A3826] whitespace-nowrap">
                        {formatPrice(p.price)}
                      </td>
                      <td className="p-3.5 text-stone-600 font-mono text-[11px] whitespace-nowrap">
                        {unitPrice}
                      </td>
                      <td className="p-3.5 text-stone-700 max-w-xs">
                        {ingredientsList}
                      </td>
                      <td className="p-3.5 text-stone-700 whitespace-nowrap">
                        {originBelt}
                      </td>
                      <td className="p-3.5 text-stone-600 max-w-xs">
                        {drying}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 77-District Delivery & Payment Schedule */}
        <section
          id="delivery-rates"
          className="p-6 sm:p-8 rounded-2xl bg-white border border-[#EAE3D6] shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-[#1A3826]" />
            <h2 className="font-heading text-2xl font-bold text-[#1A3826]">
              All-Nepal 77-District Delivery &amp; Payment Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full inline-block">
                Tier 1: Kathmandu Valley
              </span>
              <h3 className="font-heading font-bold text-base text-[#1A3826]">
                Kathmandu, Lalitpur, Bhaktapur
              </h3>
              <div className="text-2xl font-extrabold text-[#1A3826]">Rs. 100</div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Transit time: <strong>24–48 hours</strong>. Free delivery applies automatically to all orders exceeding <strong>Rs. 3,000</strong>.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100/70 px-2.5 py-0.5 rounded-full inline-block">
                Tier 2: Major Hubs
              </span>
              <h3 className="font-heading font-bold text-base text-[#1A3826]">
                Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Hetauda
              </h3>
              <div className="text-2xl font-extrabold text-[#1A3826]">Rs. 150</div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Transit time: <strong>2–4 business days</strong> via express parcel dispatch directly to your doorstep.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100/70 px-2.5 py-0.5 rounded-full inline-block">
                Tier 3: All 77 Districts
              </span>
              <h3 className="font-heading font-bold text-base text-[#1A3826]">
                All Other Districts Across Nepal
              </h3>
              <div className="text-2xl font-extrabold text-[#1A3826]">Rs. 200</div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Transit time: <strong>3–6 business days</strong>. Doorstep delivery available to all district headquarters and postal hubs.
              </p>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
            <div>
              <strong className="text-stone-900 block mb-1">Accepted Payment Methods:</strong>
              Cash on Delivery (COD available throughout Nepal), eSewa, Khalti, and Fonepay dynamic QR.
            </div>
            <div>
              <strong className="text-stone-900 block mb-1">Overseas Diaspora Gifting:</strong>
              Family living in USA, Australia, UK, and UAE can order gifts delivered to loved ones in Nepal via WhatsApp direct confirmation (+977-9713888002).
            </div>
          </div>
        </section>

        {/* Pediatric Advisory & Food Safety Guidelines */}
        <section
          id="baby-feeding-advisory"
          className="p-6 sm:p-8 rounded-2xl bg-amber-50/60 border border-amber-200/90 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <h2 className="font-heading text-xl font-bold">
              Mandatory Infant Weaning &amp; Complementary Feeding Advisory
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-amber-950/90 space-y-3 leading-relaxed">
            <p>
              NaturesMud powders (Banana, Sweet Potato, Dates, Carrot, Avocado) are single-ingredient foods with <strong>0% added cane sugar, 0% maltodextrin, and 0% artificial flavoring</strong>. However, complementary feeding must follow rigorous medical protocols:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-medium">
              <li>
                <strong>From 6 months onwards:</strong> Introduce solid or powder-enriched foods only after 6 months of age, in accordance with World Health Organization (WHO) infant feeding guidelines and after consultation with your pediatrician.
              </li>
              <li>
                <strong>No Honey Under 12 Months:</strong> Never give honey or bee products to infants younger than 1 year due to the clinical risk of infant botulism.
              </li>
              <li>
                <strong>3-Day Rule for Allergens:</strong> When introducing any new food (such as avocado, tree nuts, or seeds), introduce one single food at a time for 3 consecutive days to observe for any allergic reaction or intolerance.
              </li>
              <li>
                <strong>Never Replace Medical Advice:</strong> NaturesMud products are whole foods, not infant formula, and never substitute professional pediatric or clinical dietary advice.
              </li>
            </ul>
          </div>
        </section>

        {/* Quality, Standards & Compliance */}
        <section
          id="quality-compliance"
          className="p-6 sm:p-8 rounded-2xl bg-white border border-[#EAE3D6] shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#1A3826]" />
            <h2 className="font-heading text-2xl font-bold text-[#1A3826]">
              Quality Assurance, Standards &amp; Honest Lab Claims
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-700">
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-base text-[#1A3826]">
                Our Verifiable Quality Guarantees
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>100% Zero Added Sugar:</strong> No cane sugar, glucose syrup, or artificial sweeteners added to any powder or dried fruit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Sulphites / Chemical Bleaches:</strong> Fruits are dried naturally without sulphur dioxide preservatives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Sanitary Glass Jars:</strong> Powders packed in recyclable glass jars to prevent microplastic leaching and preserve aroma.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Closed Sanitary Dehydration (&lt;45°C):</strong> Gentle heat preserves vitamins, enzymes, and natural fiber.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-heading font-bold text-base text-[#1A3826]">
                Regulatory Disclosure &amp; Integrity Policy
              </h3>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] space-y-2 text-xs">
                <p>
                  <strong>Government Standards:</strong> NaturesMud complies with edible food processing directives outlined by the Department of Food Technology and Quality Control (DFTQC, Babarmahal, Kathmandu).
                </p>
                <p>
                  <strong>No Fabricated Proof:</strong> In accordance with our code of ethics, NaturesMud does not publish unverified awards or synthetic certificates. Document scans are cataloged in our{' '}
                  <Link href="/quality-and-proof" className="text-[#3A6B35] font-semibold underline">
                    Quality &amp; Proof Document Center
                  </Link>.
                </p>
                <p className="text-stone-500 text-[11px]">
                  DFTQC License Scan / Pan Certificate: Logged under owner verification register.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Machine-Readable AI Feeds & Resources */}
        <section
          id="ai-grounding-api"
          className="p-6 rounded-2xl bg-[#F6F2E9] border border-[#EAE3D6] space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#3A6B35]" />
            <h2 className="font-heading font-bold text-lg text-[#1A3826]">
              Direct Machine Feeds for AI &amp; Developer Integration
            </h2>
          </div>
          <p className="text-xs text-stone-700">
            For search crawlers, LLM agents, and marketplace integrations, NaturesMud maintains live machine-readable endpoints:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-[#EAE3D6] hover:border-[#1A3826] transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="block text-[#1A3826]">/llms.txt</strong>
                <span className="text-[11px] text-stone-500">Concise AI Catalog</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>

            <a
              href="/api/entities/products"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-[#EAE3D6] hover:border-[#1A3826] transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="block text-[#1A3826]">/api/entities/products</strong>
                <span className="text-[11px] text-stone-500">JSON-LD 32 SKUs</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>

            <a
              href="/merchant-feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-[#EAE3D6] hover:border-[#1A3826] transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="block text-[#1A3826]">/merchant-feed.xml</strong>
                <span className="text-[11px] text-stone-500">Google Shopping XML</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-[#EAE3D6] hover:border-[#1A3826] transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="block text-[#1A3826]">/sitemap.xml</strong>
                <span className="text-[11px] text-stone-500">XML Index (99+ URLs)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>
        </section>

        {/* Contact & Escalation */}
        <footer className="text-center pt-6 border-t border-stone-200 text-xs text-stone-600 space-y-2">
          <p>
            Have a wholesale, export, or pediatric inquiry? WhatsApp our Kathmandu team directly at{' '}
            <a
              href="https://wa.me/9779713888002?text=Hello%20NaturesMud%20Team%2C%20I%20have%20an%20inquiry%20from%20the%20Facts%20page."
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#1A3826] underline hover:text-[#3A6B35]"
            >
              +977-9713888002
            </a>
            .
          </p>
          <p className="text-stone-500">
            &copy; 2026 NaturesMud Nepal. All Rights Reserved. Kathmandu, Nepal.
          </p>
        </footer>
      </div>

      {/* Structured Data: Dataset & Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': `${siteConfig.url}/#organization`,
                name: 'NaturesMud Nepal',
                url: siteConfig.url,
                logo: `${siteConfig.url}/images/logo.png`,
                description:
                  'Producer and packager of Himalayan superfood powders, dehydrated fruits, nuts, seeds, and virgin coconut oil in Kathmandu, Nepal.',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Kathmandu',
                  addressCountry: 'NP',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+977-9713888002',
                  contactType: 'customer service',
                  areaServed: 'NP',
                  availableLanguage: ['Nepali', 'English'],
                },
              },
              {
                '@type': 'Dataset',
                '@id': `${siteConfig.url}/facts#dataset`,
                name: 'NaturesMud Nepal 32-SKU Product Catalog & Price Specification',
                description:
                  'Authoritative 32 SKU catalog specifications including retail prices in NPR, net weights in grams, single ingredients, and origin belts in Nepal.',
                url: `${siteConfig.url}/facts`,
                creator: {
                  '@id': `${siteConfig.url}/#organization`,
                },
                keywords: [
                  'NaturesMud Nepal',
                  'Baby Weaning Food Nepal',
                  'Dehydrated Fruits Nepal',
                  'Dates Powder Price Nepal',
                  'Banana Powder Nepal',
                  'Himalayan Superfoods Kathmandu',
                ],
              },
            ],
          }),
        }}
      />
    </div>
  );
}
