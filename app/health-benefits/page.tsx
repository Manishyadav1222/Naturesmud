import Link from 'next/link';
import { Heart, Brain, Zap, Shield, Leaf, Moon } from 'lucide-react';

export const metadata = {
  title: 'Health Benefits | Nature\'s Mud',
  description: 'Discover the health benefits of organic superfoods, nuts, seeds, and healthy snacks from Nature\'s Mud.',
};

const benefits = [
  { icon: Heart, title: 'Heart Health', description: 'Nuts and seeds rich in omega-3s and healthy fats support cardiovascular wellness.' },
  { icon: Brain, title: 'Brain Function', description: 'Antioxidants and essential fatty acids nourish cognitive health and focus.' },
  { icon: Zap, title: 'Natural Energy', description: 'Slow-release carbohydrates and proteins provide sustained, clean energy.' },
  { icon: Shield, title: 'Immune Support', description: 'Vitamins, minerals, and antioxidants strengthen your body\'s natural defenses.' },
  { icon: Leaf, title: 'Digestive Health', description: 'High fiber content promotes a healthy gut microbiome and regularity.' },
  { icon: Moon, title: 'Better Sleep', description: 'Magnesium-rich foods help relax muscles and improve sleep quality.' },
];

export default function HealthBenefitsPage() {
  return (
    <>
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#3A6B35] font-medium">Health Benefits</li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B]">Health Benefits</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            How Nature's Mud products support your wellness journey.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-[#F8F4EC] rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full bg-[#3A6B35]/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-[#3A6B35]" />
                </div>
                <h2 className="font-heading font-semibold text-lg mb-2">{benefit.title}</h2>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#3A6B35] text-white rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-4">Start Your Wellness Journey Today</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Explore our range of organic superfoods and healthy snacks designed to nourish your body naturally.
            </p>
            <Link href="/products" className="inline-flex items-center px-8 py-4 bg-white text-[#3A6B35] rounded-full font-semibold hover:bg-[#F8F4EC] transition-colors">
              Shop Healthy Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}