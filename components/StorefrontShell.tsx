'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import CartDrawer from '@/components/CartDrawer';
import SearchOverlay from '@/components/SearchOverlay';
import QuickViewModal from '@/components/QuickViewModal';
import MobileBottomNav from '@/components/MobileBottomNav';
import ErrorBoundary from '@/components/ErrorBoundary';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Admin routes get NO storefront chrome - just the raw children
  if (isAdmin) {
    return <>{children}</>;
  }

  // Storefront routes get the full storefront layout
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#fafaf5] flex flex-col w-full max-w-full pb-16 lg:pb-0">
        <ErrorBoundary name="Header">
          <Header />
        </ErrorBoundary>
        <div className="flex-1 w-full max-w-full">
          <ErrorBoundary name="Main Content">
            {children}
          </ErrorBoundary>
        </div>
        <ErrorBoundary name="Footer">
          <Footer />
        </ErrorBoundary>
        <BackToTopButton />
        <WhatsAppButton />
        <CartDrawer />
        <SearchOverlay />
        <QuickViewModal />
        <MobileBottomNav />
      </div>
    </SmoothScrollProvider>
  );
}