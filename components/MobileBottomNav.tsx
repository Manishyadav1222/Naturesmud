'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Flame, Heart, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { classNames } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeCartCount = mounted ? cartCount : 0;
  const safeWishlistCount = mounted ? wishlistCount : 0;

  // Don't show bottom nav in admin dashboard or checkout
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Shop',
      href: '/products',
      icon: ShoppingBag,
      isActive: pathname.startsWith('/products'),
    },
    {
      label: 'Offers',
      href: '/offers',
      icon: Flame,
      isActive: pathname.startsWith('/offers'),
      isSpecial: true,
    },
    {
      label: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
      isActive: pathname.startsWith('/wishlist'),
      badge: safeWishlistCount,
    },
    {
      label: 'Account',
      href: '/account',
      icon: User,
      isActive: pathname.startsWith('/account') || pathname.startsWith('/login'),
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-safe">
      <nav
        className="mx-auto max-w-md w-full px-3 pb-2 pt-1 pointer-events-auto"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="bg-white border border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-3xl px-2 py-1.5 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={classNames(
                  'relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 select-none min-w-[56px]',
                  item.isActive
                    ? 'text-[#3A6B35] font-bold'
                    : 'text-gray-500 hover:text-gray-900 active:scale-95'
                )}
              >
                {/* Active Indicator Background */}
                {item.isActive && (
                  <motion.div
                    layoutId="mobileNavActiveTab"
                    className="absolute inset-0 bg-[#3A6B35]/10 rounded-2xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative">
                  <Icon
                    className={classNames(
                      'w-5 h-5 transition-transform',
                      item.isActive ? 'scale-110' : '',
                      item.isSpecial ? 'text-amber-600 animate-pulse' : ''
                    )}
                  />

                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#D9A441] text-white text-[9px] font-black rounded-full min-w-[15px] h-[15px] px-0.5 flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] mt-0.5 font-medium tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Quick Floating Cart Button */}
          <button
            type="button"
            onClick={() => openCart()}
            className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl text-gray-700 hover:text-[#3A6B35] active:scale-95 transition-all select-none min-w-[56px] cursor-pointer"
            aria-label={`Open Cart with ${safeCartCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {safeCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#3A6B35] text-white text-[9px] font-black rounded-full min-w-[15px] h-[15px] px-0.5 flex items-center justify-center shadow-xs animate-bounce">
                  {safeCartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">Cart</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
