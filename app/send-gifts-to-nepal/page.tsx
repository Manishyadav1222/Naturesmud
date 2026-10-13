import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Gift,
  Heart,
  Truck,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  CreditCard,
  Building,
  Package,
  Calendar,
  ArrowRight,
  MapPin,
  Check,
} from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { products } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Send Gifts to Nepal from Abroad | NaturesMud Natural Food Hampers',
  description:
    'Send pure Himalayan superfoods, dry fruit hampers & wellness gift boxes to family in Nepal from USA, UK, Australia & Gulf. 24h Kathmandu Valley delivery.',
  alternates: {
    canonical: `${siteConfig.url}/send-gifts-to-nepal`,
  },
  openGraph: {
    title: 'Send Gifts to Nepal from Abroad | NaturesMud Natural Food Hampers',
    description:
      'Send healthy gift packages, premium nuts, and superfood hampers to parents & relatives across Nepal. Express delivery in Kathmandu, Pokhara, Chitwan & 77 districts.',
    url: `${siteConfig.url}/send-gifts-to-nepal`,
    type: 'website',
    images: [
      {
        url: '/images/posters/dashain-offer-poster.jpg',
        width: 1200,
        height: 630,
        alt: 'Send Healthy Gifts to Nepal — NaturesMud Pure Hampers',
      },
    ],
  },
};

const GIFT_HAMPERS = [
  {
    id: 'parents-wellness-hamper',
    name: "Parents' Daily Wellness Hamper",
    nepaliTitle: 'बुबाआमाको स्वास्थ्य उपहार',
    price: 3490,
    originalPrice: 3890,
    badge: 'Most Popular for Parents',
    description:
      'A thoughtful care package designed for aging parents: heart-healthy nuts, unrefined natural sweeteners, and digestive Himalayan rock salts.',
    items: [
      'Raw Himalayan Mountain Almonds (200 GM)',
      'Dry Figs / Anjeer (200 GM Glass Jar)',
      'Dates Powder Natural Sweetener (100 GM Glass Jar)',
      'Himalayan Pink Rock Salt (200 GM)',
      'Pure Mountain Himalayan Shilajit Resin (20 GM Glass Jar)',
    ],
    suitableFor: 'Mothers, fathers & elderly relatives seeking natural food nutrition.',
  },
  {
    id: 'himalayan-grand-festival-box',
    name: 'Himalayan Grand Festival Hamper',
    nepaliTitle: 'चाडपर्व विशेष उपहार बाकस',
    price: 4990,
    originalPrice: 5600,
    badge: 'Dashain & Tihar Favorite',
    description:
      'The complete luxury natural food gift box featuring premium tree nuts, exotic dehydrated fruit slices, and cold-pressed extra virgin coconut oil in glass jars.',
    items: [
      'Raw Himalayan Almonds (200 GM)',
      'Roasted Cashews (200 GM)',
      'Premium Pistachio Roasted & Salted (200 GM)',
      'Dehydrated Apple Slices (100 GM)',
      'Dehydrated Sweet Papaya (100 GM)',
      'Extra Virgin Coconut Oil (180 ML Glass Jar)',
    ],
    suitableFor: 'Festive celebrations, Dashain blessings, Bhai Tika, and family milestones.',
  },
  {
    id: 'new-mother-baby-care-hamper',
    name: 'New Mother & Baby Nutrition Box',
    nepaliTitle: 'सुत्केरी आमा र शिशु आहार बाकस',
    price: 2990,
    originalPrice: 3350,
    badge: 'Pediatric-Friendly Weaning',
    description:
      'Gentle, single-ingredient whole-food powders for weaning babies (from 6 months, as advised by your pediatrician) alongside lactation-supporting wholesome nuts for new mothers.',
    items: [
      'Sweet Potato Powder (100 GM Glass Jar)',
      'Banana Powder (100 GM Glass Jar)',
      'Dates Powder (100 GM Glass Jar)',
      'Raw Himalayan Mountain Almonds (200 GM)',
      'Cold-Pressed Virgin Coconut Oil (180 ML Glass Jar)',
    ],
    suitableFor: 'Sisters, sister-in-laws, and new mothers celebrating Pasni (rice-feeding ceremony).',
  },
];

const DIASPORA_COUNTRIES = [
  { name: 'Australia 🇦🇺', popularCities: 'Sydney, Melbourne, Brisbane, Perth' },
  { name: 'United States 🇺🇸', popularCities: 'Dallas, New York, San Francisco, Denver' },
  { name: 'United Kingdom 🇬🇧', popularCities: 'London, Aldershot, Reading, Manchester' },
  { name: 'Canada 🇨🇦', popularCities: 'Toronto, Vancouver, Calgary, Edmonton' },
  { name: 'Gulf Countries 🇦🇪 🇶🇦', popularCities: 'Dubai, Doha, Kuwait, Riyadh' },
  { name: 'Japan 🇯🇵', popularCities: 'Tokyo, Osaka, Nagoya, Fukuoka' },
];

export default function SendGiftsToNepalPage() {
  return (
    <main className="bg-[#FAF8F5] text-[#2B2B2B] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C3317] via-[#24451D] to-[#3A6B35] text-white pt-16 pb-24 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-6">
              <Globe2 className="w-4 h-4 text-[#D9A441]" />
              <span>Diaspora Gifting Portal — From Abroad to Nepal</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
              Send Pure Natural Food Gifts to{' '}
              <span className="text-[#D9A441]">Family in Nepal</span>
            </h1>

            <p className="mt-6 text-emerald-100/90 text-base sm:text-lg leading-relaxed font-light">
              Living in Australia, USA, UK, Canada, or the Gulf? Send your parents and relatives in Nepal
              100% pure Himalayan dry fruits, wholesome whole-food powders, and healthy festive hampers.
              Delivered safely to their doorstep across Kathmandu Valley (24 hours) and all 77 districts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#hampers"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9A441] hover:bg-[#c49235] text-[#1C3317] font-bold text-sm shadow-xl transition-transform active:scale-95 cursor-pointer"
              >
                <span>Browse Gift Hampers</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/9779713888002?text=Hello%20NaturesMud!%20I%20am%20living%20abroad%20and%20want%20to%20send%20a%20gift%20hamper%20to%20my%20family%20in%20Nepal."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 backdrop-blur-md border border-emerald-400/30 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>WhatsApp Concierge (+977-9713888002)</span>
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-[#D9A441] shrink-0" />
                <span className="text-xs text-emerald-100/90 font-medium">24h Kathmandu Express</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-[#D9A441] shrink-0" />
                <span className="text-xs text-emerald-100/90 font-medium">Free Handwritten Note</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#D9A441] shrink-0" />
                <span className="text-xs text-emerald-100/90 font-medium">0% Sugar / 0% Additives</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[#D9A441] shrink-0" />
                <span className="text-xs text-emerald-100/90 font-medium">All 77 Districts Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Gift Hampers Section */}
      <section id="hampers" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
            Curated For Family Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A3826] mt-2">
            Pre-Packaged Natural Health Hampers
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Hand-packed in eco-friendly reusable gift boxes with airtight glass jars, festive ribbons, and your personalized message card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {GIFT_HAMPERS.map((hamper) => (
            <div
              key={hamper.id}
              className="rounded-3xl bg-white border border-[#EAE3D6] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-[#FAF7F2] to-white border-b border-[#EAE3D6]">
                <div className="inline-block px-3 py-1 rounded-full bg-[#1A3826]/10 text-[#1A3826] font-bold text-xs uppercase tracking-wider mb-3">
                  {hamper.badge}
                </div>
                <h3 className="font-heading font-bold text-2xl text-[#1A3826]">
                  {hamper.name}
                </h3>
                <p className="text-xs text-[#7A5230] font-semibold mt-0.5">
                  {hamper.nepaliTitle}
                </p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-heading font-extrabold text-[#1A3826]">
                    Rs. {hamper.price}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    Rs. {hamper.originalPrice}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save Rs. {hamper.originalPrice - hamper.price}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {hamper.description}
                  </p>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A5230] mt-5 mb-3">
                    Hamper Contents:
                  </h4>
                  <ul className="space-y-2.5">
                    {hamper.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] text-[11px] text-[#7A5230]">
                    <span className="font-bold">Best suited for: </span>
                    <span>{hamper.suitableFor}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <a
                    href={`https://wa.me/9779713888002?text=Hello%20NaturesMud!%20I%20want%20to%20order%20the%20${encodeURIComponent(
                      hamper.name
                    )}%20(Rs.%20${hamper.price})%20for%20delivery%20to%20my%20family%20in%20Nepal.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-full bg-[#1A3826] hover:bg-[#254d35] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Gift className="w-4 h-4 text-[#D9A441]" />
                    <span>Order This Hamper via WhatsApp</span>
                  </a>

                  <Link
                    href="/catalog"
                    className="w-full py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Or Custom Pick Any of 32 Products</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How Gifting from Abroad Works (4-Step Flow) */}
      <section className="py-16 bg-[#F3EFEA] border-y border-[#EAE3D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
              Seamless International Ordering
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A3826] mt-2">
              How to Send Gifts to Nepal in 4 Easy Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1A3826] text-[#D9A441] font-bold font-heading flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-[#1A3826]">Select Your Hamper or SKUs</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Choose a pre-curated hamper above, or browse our 32-product catalog to build a custom box.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1A3826] text-[#D9A441] font-bold font-heading flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-[#1A3826]">Add Recipient &amp; Personal Note</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Provide your recipient’s name, phone number, and address in Nepal. Type your gift message; we handwrite it on a card for free.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1A3826] text-[#D9A441] font-bold font-heading flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-[#1A3826]">Easy Payment From Abroad</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pay online using remittance apps, bank transfer, international debit/credit cards, or have local relatives pay via eSewa / FonePay / COD.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D6] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1A3826] text-[#D9A441] font-bold font-heading flex items-center justify-center text-lg">
                4
              </div>
              <h3 className="font-bold text-base text-[#1A3826]">Doorstep Delivery &amp; Photo Proof</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We deliver to their door in Kathmandu Valley within 24 hours (or 2–4 days outside valley). We can send you delivery confirmation photos on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Serving Global Nepali Communities */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5230]">
              Global Reach
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A3826]">
              Trusted by Nepalis in Australia, America, Britain, and the Middle East
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Thousands of Nepalese living away from home miss Dashain Tika, Tihar Bhai Dooj, birthdays,
              anniversaries, and mother’s day. Instead of sending sugar-laden sweets or chocolates, sending
              NaturesMud Himalayan whole foods conveys genuine care for your parents’ long-term health.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {DIASPORA_COUNTRIES.map((country, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#EAE3D6]">
                  <div className="font-bold text-sm text-[#1A3826]">{country.name}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{country.popularCities}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-stone-900">
              <Image
                src="/images/posters/dashain-offer-poster.jpg"
                alt="Dashain and Tihar Gift Hampers for Family in Nepal"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
                  Festive Blessings Delivered
                </span>
                <p className="text-sm font-semibold text-white/95 mt-1">
                  Freshly sealed in airtight glass jars to protect against Nepal’s weather and humidity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Gifting FAQs */}
      <section className="py-16 bg-white border-t border-[#EAE3D6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A3826]">
              Frequently Asked Questions (Overseas Gifting)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6]">
              <h3 className="font-bold text-sm text-[#1A3826]">
                Can I pay with an Australian / US / UK credit card or remittance?
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Yes. You can complete your order directly through our WhatsApp concierge desk (+977-9713888002). We provide multiple payment options including international card payment links, direct remittance/SWIFT transfer, or payment through your local family members in Nepal via eSewa, Khalti, or FonePay QR.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6]">
              <h3 className="font-bold text-sm text-[#1A3826]">
                How long does delivery take inside Kathmandu and outside the valley?
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur) orders are dispatched within 24 hours. Deliveries outside the valley (Pokhara, Chitwan, Butwal, Biratnagar, Dharan, etc.) typically take 2 to 4 business days via verified courier partners.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6]">
              <h3 className="font-bold text-sm text-[#1A3826]">
                Is a personalized handwritten note included?
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Yes, completely free. When ordering via WhatsApp or during checkout, provide your message (in English or Nepali), and our team will handwrite it on an elegant NaturesMud gift card placed inside the box.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6]">
              <h3 className="font-bold text-sm text-[#1A3826]">
                Will my recipient be charged anything upon delivery?
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Never. Since you pre-pay the entire order (including delivery fee), your recipient simply receives their beautifully packaged gift hamper with zero collection charges.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center p-8 rounded-3xl bg-[#FAF7F2] border border-[#EAE3D6]">
            <h3 className="font-heading font-bold text-xl text-[#1A3826]">
              Need Help Customizing a Family Gift Box?
            </h3>
            <p className="text-xs text-stone-600 mt-1.5 max-w-lg mx-auto">
              Our Baneshwor dispatch team is ready to help you assemble custom gift boxes for weddings, birthdays, Dashain, Tihar, and Chhath.
            </p>
            <div className="mt-5 flex justify-center gap-4">
              <a
                href="https://wa.me/9779713888002?text=Hello%20NaturesMud!%20I%20am%20calling%20from%20abroad%20to%20customize%20a%20family%20gift%20hamper."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A3826] hover:bg-[#254d35] text-white font-bold text-xs uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4 text-[#D9A441]" />
                <span>Chat on WhatsApp (+977-9713888002)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
