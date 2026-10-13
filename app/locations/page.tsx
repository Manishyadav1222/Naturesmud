import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Clock,
  Truck,
  Store,
  Building2,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'NaturesMud Nepal Locations, Showrooms & 77-District Delivery Hub',
  description:
    'Find NaturesMud in Baneshwor, Kathmandu 44600, partner retail showrooms (Kids Kottage, Zero to Ten, Baby Love), and 24-hour Kathmandu Valley & 77-district COD delivery rates.',
  alternates: {
    canonical: `${siteConfig.url}/locations`,
  },
  openGraph: {
    title: 'NaturesMud Nepal Locations, Showrooms & 77-District Delivery Hub',
    description:
      'Visit our Baneshwor Kathmandu dispatch hub, authorized retail stockists across Nepal, or order online with 24h Kathmandu Valley delivery and nationwide COD.',
    url: `${siteConfig.url}/locations`,
    type: 'website',
  },
};

const RETAIL_PARTNERS = [
  {
    name: 'NaturesMud Main Dispatch & Quality Hub (HQ)',
    city: 'Baneshwor, Kathmandu 44600',
    province: 'Bagmati Province',
    type: 'Official Brand Headquarters & Direct Dispatch',
    address: 'Baneshwor, Kathmandu 44600, Nepal',
    hours: 'Sunday – Friday: 9:00 AM – 6:00 PM NPT (Saturday Closed)',
    phone: '+977-9713888002',
    highlights: [
      'Full 32-product canonical catalog in stock',
      'Same-day / 24-hour express dispatch across Kathmandu, Lalitpur & Bhaktapur',
      'Direct WhatsApp & phone order desk (+977-9713888002)',
    ],
    mapQuery: 'Baneshwor+Kathmandu+44600+Nepal',
  },
  {
    name: 'Kids Kottage — Gongabu Showroom',
    city: 'Gongabu, Kathmandu',
    province: 'Bagmati Province',
    type: 'Authorized Retail Partner',
    address: 'Arya Complex, Gongabu, Kathmandu, Nepal',
    hours: 'Sunday – Friday: 10:00 AM – 7:00 PM NPT',
    phone: 'In-store retail partner',
    highlights: [
      'Baby weaning powders (Dates Powder, Carrot Powder, Sweet Potato Powder, Banana Powder)',
      'Extra Virgin Coconut Oil & family superfood range',
    ],
    mapQuery: 'Kids+Kottage+Gongabu+Kathmandu+Nepal',
  },
  {
    name: 'Kids Kottage — Kupondol & Kapan Outlets',
    city: 'Kupondol (Lalitpur) & Kapan (Kathmandu)',
    province: 'Bagmati Province',
    type: 'Authorized Retail Partner',
    address: 'Kupondol, Lalitpur & Kapan, Kathmandu, Nepal',
    hours: 'Sunday – Friday: 10:00 AM – 7:00 PM NPT',
    phone: 'In-store retail partner',
    highlights: [
      'Single-ingredient vegetable & fruit powders for family and infant weaning (from 6 months, as advised by your pediatrician)',
      'Dehydrated fruit snacks & cold-pressed coconut oil',
    ],
    mapQuery: 'Kupondol+Lalitpur+Nepal',
  },
  {
    name: 'Zero to Ten — Chabahil',
    city: 'Chabahil, Kathmandu',
    province: 'Bagmati Province',
    type: 'Authorized Retail Partner',
    address: 'Chabahil, Kathmandu, Nepal',
    hours: 'Sunday – Friday: 10:00 AM – 7:00 PM NPT',
    phone: 'In-store retail partner',
    highlights: [
      'Whole-food powders, dehydrated fruits, and cold-pressed coconut oil jars',
    ],
    mapQuery: 'Chabahil+Kathmandu+Nepal',
  },
  {
    name: 'Kids Kottage — Pokhara Showroom',
    city: 'Pokhara, Kaski',
    province: 'Gandaki Province',
    type: 'Regional Retail Stockist',
    address: 'Pokhara Showroom, Gandaki Province, Nepal',
    hours: 'Sunday – Friday: 10:00 AM – 7:00 PM NPT',
    phone: 'In-store retail partner',
    highlights: [
      'Selected NaturesMud baby weaning powders & superfoods in Pokhara',
    ],
    mapQuery: 'Pokhara+Nepal',
  },
  {
    name: 'Kids Kottage — Surkhet Branch',
    city: 'Birendranagar, Surkhet',
    province: 'Karnali Province',
    type: 'Regional Retail Stockist',
    address: 'Surkhet Branch, Birendranagar, Karnali Province, Nepal',
    hours: 'Sunday – Friday: 10:00 AM – 6:30 PM NPT',
    phone: 'In-store retail partner',
    highlights: [
      'Selected NaturesMud single-ingredient powders & dry fruits in Karnali Province',
    ],
    mapQuery: 'Birendranagar+Surkhet+Nepal',
  },
  {
    name: 'Baby Love — Hetauda Showroom',
    city: 'Hetauda, Makwanpur',
    province: 'Bagmati Province',
    type: 'Regional Retail Stockist',
    address: 'Hetauda Showroom, Makwanpur, Nepal',
    hours: 'Sunday – Friday: 10:00 AM – 7:00 PM NPT',
    phone: 'In-store retail partner',
    highlights: [
      'Selected NaturesMud baby weaning powders & Virgin Coconut Oil in Hetauda',
    ],
    mapQuery: 'Hetauda+Nepal',
  },
];

const PROVINCE_DELIVERY_TABLE = [
  {
    province: 'Bagmati Province (Inside Kathmandu Valley)',
    cities: 'Kathmandu, Lalitpur (Patan), Bhaktapur, Kirtipur, Madhyapur Thimi, Budhanilkantha',
    timeline: 'Within 24 Hours (Same/Next Business Day)',
    fee: 'Rs. 100 (FREE on orders ≥ Rs. 2,000)',
    payment: 'Cash on Delivery (COD), FonePay QR, eSewa, Khalti',
  },
  {
    province: 'Bagmati Province (Outside Valley)',
    cities: 'Bharatpur (Chitwan), Hetauda, Banepa, Dhulikhel, Bidur, Charikot, Sindhuli',
    timeline: '2 – 3 Business Days',
    fee: 'Rs. 150 (FREE on orders ≥ Rs. 2,000)',
    payment: 'Cash on Delivery (COD), FonePay QR, eSewa, Khalti',
  },
  {
    province: 'Gandaki Province',
    cities: 'Pokhara, Damauli, Kawasoti, Baglung, Beni, Gorkha, Walling, Syangja',
    timeline: '2 – 4 Business Days',
    fee: 'Rs. 150 (FREE on orders ≥ Rs. 2,000)',
    payment: 'Cash on Delivery (COD), FonePay QR, eSewa, Khalti',
  },
  {
    province: 'Lumbini Province',
    cities: 'Butwal, Bhairahawa (Siddharthanagar), Nepalgunj, Tulsipur, Ghorahi, Tansen, Taulihawa',
    timeline: '2 – 4 Business Days',
    fee: 'Rs. 150 (FREE on orders ≥ Rs. 2,000)',
    payment: 'Cash on Delivery (COD), FonePay QR, eSewa, Khalti',
  },
  {
    province: 'Koshi Province',
    cities: 'Biratnagar, Dharan, Itahari, Birtamod, Damak, Mechinagar, Ilam, Dhankuta, Inaruwa',
    timeline: '2 – 4 Business Days',
    fee: 'Rs. 150 (FREE on orders ≥ Rs. 2,000)',
    payment: 'Cash on Delivery (COD), FonePay QR, eSewa, Khalti',
  },
  {
    province: 'Madhesh Province',
    cities: 'Birgunj, Janakpur, Lahan, Rajbiraj, Kalaiya, Malangwa, Bardibas, Chandrapur',
    timeline: '2 – 4 Business Days',
    fee: 'Rs. 150 (FREE on orders ≥ Rs. 2,000)',
    payment: 'Cash on Delivery (COD), FonePay QR, eSewa, Khalti',
  },
  {
    province: 'Karnali & Sudurpashchim Provinces',
    cities: 'Birendranagar (Surkhet), Dhangadhi, Mahendranagar (Bhimdatta), Tikapur, Attariya, Jumla, Dailekh',
    timeline: '3 – 5 Business Days',
    fee: 'Rs. 150 (FREE on orders ≥ Rs. 2,000)',
    payment: 'Cash on Delivery (COD), FonePay QR, eSewa, Khalti',
  },
];

const LOCATION_FAQS = [
  {
    q: 'Where is NaturesMud located in Kathmandu, Nepal?',
    a: 'NaturesMud is headquartered in Baneshwor, Kathmandu 44600, Nepal. All online orders placed on naturesmud.shop or via WhatsApp (+977-9713888002) are inspected, packed, and dispatched directly from our Baneshwor hub.',
  },
  {
    q: 'How fast is NaturesMud delivery inside Kathmandu, Lalitpur, and Bhaktapur?',
    a: 'Orders inside Kathmandu Ring Road and surrounding valley areas (Kathmandu, Lalitpur, Bhaktapur) are delivered within 24 hours (same or next business day). Standard delivery is Rs. 100 and FREE on orders of Rs. 2,000 or more.',
  },
  {
    q: 'Which retail stores carry NaturesMud products in Nepal?',
    a: 'Selected NaturesMud products (especially our single-ingredient baby weaning powders and cold-pressed coconut oil) are stocked at Kids Kottage (Gongabu, Kupondol, Kapan, Pokhara, and Surkhet), Zero to Ten (Chabahil), and Baby Love (Hetauda). For the complete 32-product range and freshest batch dates, order directly at naturesmud.shop.',
  },
  {
    q: 'Does NaturesMud offer Cash on Delivery (COD) outside Kathmandu Valley?',
    a: 'Yes. We deliver to all 7 provinces and major cities across Nepal (including Pokhara, Chitwan, Butwal, Bhairahawa, Biratnagar, Dharan, Itahari, Birgunj, Janakpur, Hetauda, Nepalgunj, Surkhet, and Dhangadhi) within 2–5 business days with Cash on Delivery (COD), FonePay QR, eSewa, and Khalti.',
  },
];

export default function LocationsPage() {
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: 'Locations & Delivery Hub', item: `${siteConfig.url}/locations` },
        ],
      },
      {
        '@type': ['HealthFoodStore', 'LocalBusiness'],
        '@id': `${siteConfig.url}/#localbusiness`,
        name: 'NaturesMud Nepal',
        url: `${siteConfig.url}/locations`,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        priceRange: 'NPR 220 - NPR 1995',
        currenciesAccepted: 'NPR',
        paymentAccepted: 'Cash on Delivery, FonePay QR, eSewa, Khalti',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Baneshwor',
          addressLocality: 'Kathmandu',
          addressRegion: 'Bagmati Province',
          postalCode: '44600',
          addressCountry: 'NP',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 27.6915,
          longitude: 85.342,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
        ],
        sameAs: [
          siteConfig.social.facebook,
          siteConfig.social.instagram,
          siteConfig.social.tiktok,
          siteConfig.social.youtube,
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: LOCATION_FAQS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#172D13] via-[#24451D] to-[#3A6B35] text-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-emerald-200/90 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-semibold">Locations &amp; Nepal Delivery Hub</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-4">
              <MapPin className="w-3.5 h-3.5" />
              Baneshwor, Kathmandu 44600 · All 77 Districts Served
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight leading-tight">
              NaturesMud Kathmandu Hub, Partner Showrooms &amp; Nepal Delivery Network
            </h1>
            <p className="mt-4 text-emerald-50/90 text-base sm:text-lg leading-relaxed">
              Every NaturesMud jar and pouch is inspected and dispatched from our main hub in{' '}
              <strong>Baneshwor, Kathmandu 44600, Nepal</strong>. Order online for 24-hour Kathmandu
              Valley delivery, nationwide Cash on Delivery (COD), or visit our retail partner
              showrooms across Kathmandu, Lalitpur, Pokhara, Surkhet, and Hetauda.
            </p>
          </div>
        </div>
      </section>

      {/* Main Dispatch Hub & Partner Showrooms */}
      <section className="py-14 lg:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            1. Main Dispatch Hub &amp; Authorized Retail Showrooms
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            Our full 32-product catalog is always available online at{' '}
            <Link href="/products" className="text-[#2D5A27] font-bold underline">
              naturesmud.shop/products
            </Link>
            , while selected baby weaning powders and superfoods are stocked at partner outlets below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RETAIL_PARTNERS.map((loc, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-7 border shadow-xs flex flex-col justify-between ${
                idx === 0
                  ? 'bg-emerald-950 text-white border-emerald-800 md:col-span-2'
                  : 'bg-white text-stone-900 border-stone-200'
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      idx === 0
                        ? 'bg-[#C9982A]/25 text-[#F4D078] border border-[#C9982A]/40'
                        : 'bg-emerald-50 text-[#2D5A27]'
                    }`}
                  >
                    {idx === 0 ? <Building2 className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                    {loc.type}
                  </span>
                  <span className={`text-xs font-semibold ${idx === 0 ? 'text-emerald-200' : 'text-stone-500'}`}>
                    {loc.province}
                  </span>
                </div>

                <h3 className="font-heading font-black text-xl sm:text-2xl mb-2">{loc.name}</h3>
                <div className={`space-y-1.5 text-xs sm:text-sm mb-4 ${idx === 0 ? 'text-emerald-100' : 'text-stone-600'}`}>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{loc.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{loc.hours}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{loc.phone}</span>
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs sm:text-sm">
                  {loc.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${idx === 0 ? 'text-[#F4D078]' : 'text-[#2D5A27]'}`}
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-current/10 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`https://maps.google.com/?q=${loc.mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs font-bold underline inline-flex items-center gap-1 ${
                    idx === 0 ? 'text-[#F4D078]' : 'text-[#2D5A27]'
                  }`}
                >
                  Open in Google Maps <ArrowRight className="w-3.5 h-3.5" />
                </a>
                {idx === 0 && (
                  <a
                    href="https://api.whatsapp.com/send?phone=9779713888002&text=Hello%20NaturesMud%20Nepal!%20I%20would%20like%20to%20place%20an%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20bd5a] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Order via WhatsApp (+977-9713888002)
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7-Province Delivery Table */}
      <section className="py-14 bg-white border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2D5A27] bg-emerald-50 px-3 py-1 rounded-full mb-2">
              <Truck className="w-3.5 h-3.5" />
              All 7 Provinces · 77 Districts
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
              2. Nepal Delivery Timelines, Shipping Rates &amp; COD Coverage
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-stone-200 text-stone-800 font-bold">
                  <th className="p-4">Province / Zone</th>
                  <th className="p-4">Major Cities &amp; Hubs Covered</th>
                  <th className="p-4">Delivery Timeline</th>
                  <th className="p-4">Shipping Fee</th>
                  <th className="p-4">Payment Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {PROVINCE_DELIVERY_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/80">
                    <td className="p-4 font-bold text-stone-900">{row.province}</td>
                    <td className="p-4 text-stone-600">{row.cities}</td>
                    <td className="p-4 font-semibold text-[#2D5A27]">{row.timeline}</td>
                    <td className="p-4 font-semibold text-stone-800">{row.fee}</td>
                    <td className="p-4 text-stone-600">{row.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Shop By Category Hub Links */}
      <section className="py-14 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900 mb-6">
          3. Browse Our 6 Canonical Product Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Fruit & Vegetable Powders', href: '/category/powders', desc: 'Beetroot, Dates, Moringa, Carrot, Sweet Potato, Banana, Avocado & Strawberry Powders' },
            { name: 'Dehydrated Fruits & Berries', href: '/category/dried-fruits', desc: 'Mango, Pineapple, Apple, Dragon Fruit, Papaya, Coconut Chips, Blueberries, Cranberries, Figs & Dates' },
            { name: 'Premium Nuts & Dry Fruits', href: '/category/nuts', desc: 'Raw & Roasted Almonds, Cashewnuts, Pistachios, Macadamia Nuts & Mix Dry Nuts' },
            { name: 'Superfood Seeds & Makhana', href: '/category/seeds', desc: 'Chia Seeds, Pumpkin Seeds, Flax Seeds & Himalayan Makhana (Fox Nuts)' },
            { name: 'Cold-Pressed Oils & Rosemary', href: '/category/oils', desc: 'Extra Virgin Coconut Oil (500 ML), Virgin Coconut Oil (180 ML) & Dried Rosemary Leaves' },
            { name: 'Himalayan Salts & Shilajit Resin', href: '/category/salts-spices', desc: 'Himalayan Pink Salt, Black Salt (Bire Noon) & Pure Mountain Himalayan Shilajit Resin' },
          ].map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-[#2D5A27] transition-all group"
            >
              <div className="flex items-center justify-between font-heading font-bold text-base text-stone-900 group-hover:text-[#2D5A27]">
                <span>{cat.name}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{cat.desc}</p>
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-stone-900 mb-6">
            4. Frequently Asked Questions — Kathmandu Hub &amp; Nepal Delivery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LOCATION_FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-stone-200">
                <h3 className="font-heading font-bold text-base text-stone-900 mb-2 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2D5A27] shrink-0 mt-1" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
