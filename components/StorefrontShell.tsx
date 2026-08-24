'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CartDrawer from '@/components/CartDrawer';
import SearchOverlay from '@/components/SearchOverlay';
import QuickViewModal from '@/components/QuickViewModal';

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Admin routes get NO storefront chrome - just the raw children
  if (isAdmin) {
    return <>{children}</>;
  }

  // Storefront routes get the full storefront layout
  return (
    <div className="relative min-h-screen bg-[#fafaf5] flex flex-col">
      <Header />
      <div className="flex-1 w-full">{children}</div>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
      <SearchOverlay />
      <QuickViewModal />
    </div>
  );
}