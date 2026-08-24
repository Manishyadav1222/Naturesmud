import Link from 'next/link';
import { Package, Truck, BadgePercent, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Wholesale | Nature\'s Mud',
  description: 'Partner with Nature\'s Mud for wholesale organic products. Premium quality, competitive pricing, and reliable supply across Nepal.',
};

const benefits = [
  { icon: Package, title: 'Premium Products', description: 'Access our full range of organic superfoods, nuts, seeds, and healthy snacks.' },
  { icon: BadgePercent, title: 'Wholesale Pricing', description: 'Tiered pricing structures that reward volume and long-term partnerships.' },
  { icon: Truck, title: 'Reliable Delivery', description: 'Consistent supply chain with scheduled deliveries across Nepal.' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', description: 'Every batch quality-tested and certified for your customers\' trust.' },
];

export default function WholesalePage() {
  return (
    <>
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#3A6B35] font-medium">Wholesale</li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B]">Wholesale Partnership</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Bring premium organic nutrition to your customers with Nature's Mud wholesale.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-[#F8F4EC] rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-[#3A6B35]/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-[#3A6B35]" />
                </div>
                <h2 className="font-heading font-semibold text-lg mb-2">{benefit.title}</h2>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-[#F8F4EC] rounded-3xl p-6 sm:p-8">
              <h2 className="font-heading font-bold text-2xl mb-6">Request Wholesale Pricing</h2>
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="business" className="block text-sm font-medium mb-1.5">Business Name *</label>
                  <input id="business" required className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="Your business" />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium mb-1.5">Contact Person *</label>
                  <input id="contact" required className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="Full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email *</label>
                  <input id="email" type="email" required className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="you@business.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1.5">Phone *</label>
                  <input id="phone" required className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="+977..." />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="type" className="block text-sm font-medium mb-1.5">Business Type *</label>
                  <select id="type" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]">
                    <option>Retail Store</option>
                    <option>Supermarket</option>
                    <option>Restaurant / Café</option>
                    <option>Online Store</option>
                    <option>Distributor</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium mb-1.5">Products of Interest</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="Tell us which products and estimated quantities you need." />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-[#3A6B35] text-white rounded-full font-semibold hover:bg-[#2d5429] transition-colors">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F8F4EC] rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-lg mb-3">Why Partner With Us?</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#3A6B35] mt-0.5 shrink-0" /> Direct sourcing from Nepali farmers — authentic, traceable origin.</li>
                  <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#3A6B35] mt-0.5 shrink-0" /> Consistent quality with batch-level testing and certification.</li>
                  <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#3A6B35] mt-0.5 shrink-0" /> Flexible minimum order quantities for growing businesses.</li>
                  <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#3A6B35] mt-0.5 shrink-0" /> Marketing support, product training, and POS materials.</li>
                  <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#3A6B35] mt-0.5 shrink-0" /> Dedicated account manager for your business.</li>
                </ul>
              </div>
              <div className="bg-[#3A6B35] text-white rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Ready to start?</h3>
                <p className="text-sm text-white/90 mb-4">Our wholesale team will get back to you within 24 hours.</p>
                <a href="https://wa.me/9779713888002?text=Hello%20Nature%27s%20Mud!%20I%27m%20interested%20in%20wholesale%20partnership." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#3A6B35] rounded-full font-semibold hover:bg-[#F8F4EC] transition-colors">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}