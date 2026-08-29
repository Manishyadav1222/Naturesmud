import Link from 'next/link';
import { Leaf, ArrowRight, ShoppingBag, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="max-w-lg w-full text-center bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-2">
          <Leaf className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441]">
            404 Error · Page Not Found
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900">
            Lost in the Himalayan Trails?
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            The page or product you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/products"
            className="flex-1 py-3.5 px-5 rounded-full bg-[#3A6B35] hover:bg-[#2e552a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore All Products</span>
          </Link>

          <Link
            href="/"
            className="flex-1 py-3.5 px-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Popular Categories Links */}
        <div className="pt-6 border-t border-gray-100 space-y-3 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 text-center">
            Popular Categories to Explore
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { name: 'Superfood Powders', href: '/products?category=powders' },
              { name: 'Dehydrated Fruits', href: '/products?category=dried-fruits' },
              { name: 'Mountain Nuts & Seeds', href: '/products?category=nuts-seeds' },
              { name: 'Festival Offers', href: '/offers' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-3 py-1.5 rounded-full bg-cream-100 hover:bg-primary hover:text-white text-xs font-semibold text-gray-700 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
