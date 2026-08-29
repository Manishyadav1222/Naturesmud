'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ShoppingBag } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error safely
    console.error('Storefront Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading font-black text-2xl text-gray-900">
            Something went momentarily wrong
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We encountered a temporary glitch loading this section. Your cart and data are completely safe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-full bg-[#3A6B35] hover:bg-[#2e552a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3A6B35] hover:underline"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Continue to Organic Shop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
