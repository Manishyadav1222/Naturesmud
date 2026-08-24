import Link from 'next/link';
import { Handshake, TrendingUp, MapPin, Award, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Become a Distributor | Nature\'s Mud',
  description: 'Join Nature\'s Mud as an official distributor. Grow your business with Nepal\'s premium organic food brand.',
};

const steps = [
  { number: '01', title: 'Apply Online', description: 'Submit your application with your business details and target region.' },
  { number: '02', title: 'Review & Interview', description: 'Our team reviews your application and schedules a call to discuss partnership.' },
  { number: '03', title: 'Agreement & Training', description: 'Sign the distributor agreement and receive full product training.' },
  { number: '04', title: 'Start Distributing', description: 'Receive your first stock and start growing your territory.' },
];

export default function BecomeDistributorPage() {
  return (
    <>
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#3A6B35] font-medium">Become a Distributor</li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B]">Become a Distributor</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Grow your business with Nepal's fastest-growing organic food brand.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Handshake, title: 'Exclusive Territories', description: 'Protected regions for dedicated distributors.' },
              { icon: TrendingUp, title: 'High Margins', description: 'Competitive distributor pricing with volume bonuses.' },
              { icon: MapPin, title: 'Nationwide Reach', description: 'Distribution network across all 7 provinces of Nepal.' },
              { icon: Award, title: 'Brand Support', description: 'Marketing materials, training, and promotional support.' },
            ].map((item) => (
              <div key={item.title} className="bg-[#F8F4EC] rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-[#3A6B35]/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#3A6B35]" />
                </div>
                <h2 className="font-heading font-semibold text-lg mb-2">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-6">How It Works</h2>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-4 bg-[#F8F4EC] rounded-2xl p-5">
                    <span className="font-heading font-bold text-2xl text-[#3A6B35] shrink-0">{step.number}</span>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F8F4EC] rounded-3xl p-6 sm:p-8">
              <h2 className="font-heading font-bold text-2xl mb-6">Distributor Application</h2>
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1.5">Company Name *</label>
                  <input id="company" required className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="Company name" />
                </div>
                <div>
                  <label htmlFor="person" className="block text-sm font-medium mb-1.5">Contact Person *</label>
                  <input id="person" required className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="Full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email *</label>
                  <input id="email" type="email" required className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="you@company.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1.5">Phone *</label>
                  <input id="phone" required className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="+977..." />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="region" className="block text-sm font-medium mb-1.5">Target Region *</label>
                  <select id="region" className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]">
                    <option>Bagmati Province</option>
                    <option>Gandaki Province</option>
                    <option>Lumbini Province</option>
                    <option>Karnali Province</option>
                    <option>Sudurpashchim Province</option>
                    <option>Koshi Province</option>
                    <option>Madhesh Province</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="experience" className="block text-sm font-medium mb-1.5">Distribution Experience</label>
                  <textarea id="experience" rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]" placeholder="Tell us about your distribution experience and network." />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-[#3A6B35] text-white rounded-full font-semibold hover:bg-[#2d5429] transition-colors">
                    Apply Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}