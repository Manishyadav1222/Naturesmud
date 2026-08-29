'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Award,
  Leaf,
  ShieldCheck,
  TrendingUp,
  User,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useUIStore } from '@/lib/store/ui-store';
import { classNames } from '@/lib/utils';
import { Logo } from './Logo';
import { OrdersHeaderWidget } from './OrdersHeaderWidget';

const MotionLink = motion.create(Link);

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop', hasMegaMenu: true },
  { href: '/catalog', label: 'Catalog' },
  { href: '/offers', label: 'Offers', isSpecial: true },
  { href: '/about', label: 'About Us', hideOnLg: true },
  { href: '/blog', label: 'Blog', hideOnLg: true },
  { href: '/recipes', label: 'Recipes', hideOnLg: true },
  { href: '/faq', label: 'FAQ', hideOnLg: true },
];

const featuredCategories = [
  { name: 'Dried Fruits', slug: 'dried-fruits', image: '/products/authentic-dehydrated-mango.jpg', count: '8 items' },
  { name: 'Organic Powders', slug: 'powders', image: '/products/sweet-potato-powder-100g.jpg', count: '4 items' },
  { name: 'Mountain Nuts', slug: 'nuts', image: '/products/authentic-almonds.jpg', count: '7 items' },
  { name: 'Seeds & Salts', slug: 'seeds', image: '/products/pumpkin-seeds.jpg', count: '4 items' },
];

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const cartTotal = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openSearch = useUIStore((s) => s.openSearch);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeCartTotal = mounted ? cartTotal : 0;
  const safeWishlistCount = mounted ? wishlistCount : 0;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={classNames(
          'sticky top-0 z-50 w-full max-w-full transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-ink/8 shadow-sm py-2 sm:py-2.5'
            : 'bg-transparent pt-3 sm:pt-4 pb-1 pointer-events-none'
        )}
      >
        <div
          className={classNames(
            'mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4',
            !isScrolled ? 'pointer-events-auto' : ''
          )}
        >
          {/* ── Left Zone: Brand Logo Capsule ── */}
          <MotionLink
            href="/"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={classNames(
              'flex items-center gap-2.5 px-4 py-2 sm:py-2.5 rounded-full border transition-all duration-300 shrink-0',
              isScrolled
                ? 'bg-transparent border-transparent hover:bg-black/5'
                : 'bg-white/95 border-white/80 hover:bg-white shadow-soft'
            )}
          >
            <Logo asLink={false} />
            <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold-800 rounded-full border border-gold/30">
              <Leaf className="w-2.5 h-2.5 text-primary" /> 100% Organic
            </span>
          </MotionLink>

          {/* ── Center Zone: Navigation Links & Actions Capsule ── */}
          <div
            className={classNames(
              'flex items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2 rounded-full border transition-all duration-300',
              isScrolled
                ? 'bg-cream-50/80 border-ink/5'
                : 'bg-white/95 border-white/80 hover:bg-white shadow-soft'
            )}
          >
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 mr-4" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.hasMegaMenu) {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => setIsShopHovered(true)}
                      onMouseLeave={() => setIsShopHovered(false)}
                    >
                      <Link
                        href={link.href}
                        className={classNames(
                          'relative px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 group',
                          isActive
                            ? 'text-primary bg-primary/10 font-bold'
                            : 'text-ink/80 hover:text-primary hover:bg-black/5'
                        )}
                      >
                        {link.label}
                        <ChevronDown
                          className={classNames(
                            'w-3.5 h-3.5 transition-transform duration-200',
                            isShopHovered ? 'rotate-180 text-primary' : 'text-ink/50'
                          )}
                        />
                      </Link>

                      {/* Mega Menu Dropdown */}
                      <AnimatePresence>
                        {isShopHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-[520px] rounded-3xl bg-white border border-ink/10 shadow-2xl p-5 overflow-hidden z-50 pointer-events-auto"
                          >
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink/5">
                              <div>
                                <p className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-gold-500" /> Featured Categories
                                </p>
                                <p className="text-[11px] text-ink/50">Ethically harvested from pristine Himalayan valleys</p>
                              </div>
                              <Link
                                href="/products"
                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                              >
                                View All <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {featuredCategories.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/products?category=${cat.slug}`}
                                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-cream-50 hover:bg-cream-100 transition-all group"
                                >
                                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 bg-cream-100">
                                    <Image
                                      src={cat.image || '/products/naturesmud-all-products-100g.jpg'}
                                      alt={cat.name}
                                      fill
                                      sizes="48px"
                                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-heading font-semibold text-xs text-ink group-hover:text-primary transition-colors">
                                      {cat.name}
                                    </p>
                                    <p className="text-[10px] text-ink/50">{cat.count}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>

                            <div className="pt-3 border-t border-ink/5 flex items-center justify-between text-[11px] text-ink/60 bg-cream-50/50 -mx-5 -mb-5 px-5 py-3">
                              <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 100% Lab Certified
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-gold-600" /> Nepal Origin
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Free Shipping &gt; Rs. 10,000
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }



                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={classNames(
                      'px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 items-center gap-1.5',
                      (link as any).hideOnLg ? 'hidden xl:flex' : 'flex',
                      isActive
                        ? 'text-primary bg-primary/10 font-bold'
                        : link.isSpecial
                        ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 font-bold'
                        : 'text-ink/80 hover:text-primary hover:bg-black/5'
                    )}
                  >
                    {link.isSpecial && <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Interactive Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Search trigger */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={openSearch}
                className="p-2 rounded-full text-ink/80 hover:text-primary hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {/* Orders Status Widget — desktop only, between Search and Wishlist */}
              <div className="hidden lg:flex items-center">
                <OrdersHeaderWidget />
              </div>

              {/* Wishlist */}
              <MotionLink
                href="/wishlist"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-full text-ink/80 hover:text-primary hover:bg-black/5 transition-colors relative"
                aria-label={`Wishlist (${safeWishlistCount} items)`}
              >
                <Heart className="w-4 h-4" />
                {safeWishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] font-bold rounded-full min-w-[16px] min-h-[16px] px-1 flex items-center justify-center animate-[bounce_0.4s_ease]">
                    {safeWishlistCount}
                  </span>
                )}
              </MotionLink>

              {/* Account Shortcut */}
              <MotionLink
                href="/account"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="p-2 rounded-full text-ink/80 hover:text-primary hover:bg-black/5 transition-colors hidden sm:inline-flex"
                aria-label="Account"
              >
                <User className="w-4 h-4" />
              </MotionLink>

              {/* Cart Drawer Trigger */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => useCartStore.getState().openDrawer()}
                className="p-2 rounded-full text-ink/80 hover:text-primary hover:bg-black/5 transition-colors relative cursor-pointer"
                aria-label={`Cart (${safeCartTotal} items)`}
              >
                <ShoppingBag className="w-4 h-4" />
                {safeCartTotal > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full min-w-[16px] min-h-[16px] px-1 flex items-center justify-center animate-[bounce_0.4s_ease]">
                    {safeCartTotal}
                  </span>
                )}
              </motion.button>

              {/* Mobile Hamburger Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full text-ink hover:text-primary hover:bg-black/5 transition-colors lg:hidden cursor-pointer"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* ── Right Zone: Spacer for balance ── */}
          <div className="hidden lg:flex w-[140px] shrink-0 z-20"></div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-2xl overflow-hidden pointer-events-auto w-full max-w-full"
              aria-label="Mobile navigation"
            >
              <div className="px-4 py-4 space-y-1.5">
                {/* Mobile Live Track Order & Status Card */}
                <div className="pb-2">
                  <Link
                    href="/track-order"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-primary/10 via-amber-500/5 to-gold/10 border border-primary/20 text-primary font-bold text-sm shadow-xs hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-4 h-4 text-gold-300" />
                      </div>
                      <div>
                        <p className="font-heading text-sm text-gray-900 leading-tight">Live Order Tracking</p>
                        <p className="text-[11px] text-gray-500 font-normal">Check delivery progress & invoice</p>
                      </div>
                    </div>
                    <span className="flex items-center text-xs text-primary font-bold group-hover:translate-x-1 transition-transform">
                      Track <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </Link>
                </div>

                {/* Mobile Search Button */}
                <button
                  key="mobile-search-btn"
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    openSearch();
                  }}
                  className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium bg-primary/5 text-primary border border-primary/20 transition-all duration-200"
                >
                  <span className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-primary" /> Search Superfoods &amp; Recipes
                  </span>
                  <kbd className="text-[10px] bg-white border border-primary/20 rounded px-1.5 py-0.5 text-primary font-mono">
                    Tap
                  </kbd>
                </button>

                {navLinks.map((link) => {

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={classNames(
                        'block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        pathname === link.href
                          ? 'bg-primary/10 text-primary font-bold'
                          : link.isSpecial
                          ? 'text-amber-900 bg-amber-50 font-bold border border-amber-200/60'
                          : 'text-ink/80 hover:bg-gray-50 hover:pl-4'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                
                <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href="/account"
                    onClick={closeMobileMenu}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-ink/80 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 text-primary" /> My Account
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={closeMobileMenu}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-ink/80 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500" /> Wishlist ({safeWishlistCount})
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}