'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Gift,
  Truck,
  Tag,
  Copy,
  Check,
  ArrowRight,
  Timer,
  ShoppingBag,
} from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import {
  DASHAIN_OFFER_CONFIG,
  getDashainCountdown,
  isDashainOfferActive,
} from '@/lib/data/dashain-offer';
import { toast } from 'sonner';

export default function DashainOfferPopup() {
  const router = useRouter();
  const { isDashainModalOpen, openDashainModal, closeDashainModal } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(() => getDashainCountdown());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCountdown(getDashainCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !isDashainOfferActive()) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DASHAIN_OFFER_CONFIG.couponCode);
    setCopied(true);
    toast.success(`Dashain Coupon "${DASHAIN_OFFER_CONFIG.couponCode}" copied!`, {
      description: '10% OFF is also auto-applied at Cart & Checkout!',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShopNow = (href: string) => {
    closeDashainModal();
    router.push(href);
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes dashainGoldGlow {
              0%, 100% {
                text-shadow: 0 0 10px rgba(251, 191, 36, 0.85), 0 0 22px rgba(245, 158, 11, 0.65), 0 0 35px rgba(217, 119, 6, 0.45);
              }
              50% {
                text-shadow: 0 0 16px rgba(254, 240, 138, 1), 0 0 32px rgba(251, 191, 36, 0.95), 0 0 50px rgba(234, 88, 12, 0.75);
              }
            }
            @keyframes dashainBorderPulse {
              0%, 100% {
                box-shadow: 0 0 20px rgba(251, 191, 36, 0.45), 0 0 45px rgba(185, 28, 28, 0.35);
              }
              50% {
                box-shadow: 0 0 35px rgba(251, 191, 36, 0.8), 0 0 70px rgba(220, 38, 38, 0.6);
              }
            }
            .dashain-glow-text {
              animation: dashainGoldGlow 2.4s infinite ease-in-out;
            }
            .dashain-glow-box {
              animation: dashainBorderPulse 3s infinite ease-in-out;
            }
          `,
        }}
      />

      {/* Floating Re-open Trigger Pill when Modal is Closed */}
      <AnimatePresence>
        {!isDashainModalOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={openDashainModal}
            type="button"
            className="fixed bottom-20 lg:bottom-6 left-3 sm:left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#881337] via-[#B91C1C] to-[#D97706] text-white border-2 border-amber-300 shadow-2xl cursor-pointer dashain-glow-box"
            aria-label="Open Dashain Blessings & Health Offer"
          >
            <span className="text-base animate-bounce">🎉</span>
            <div className="text-left leading-tight">
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-200 dashain-glow-text">
                Dashain Offer
              </p>
              <p className="text-xs font-extrabold text-white">
                Free Delivery + Free Pink Salt
              </p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Welcome Splash Modal */}
      <AnimatePresence>
        {isDashainModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Dashain Blessings and Health Special Offer"
          >
            {/* Backdrop click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDashainModal}
              className="fixed inset-0 cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden bg-gradient-to-br from-[#3B0712] via-[#5B0E1D] to-[#271206] border-2 border-amber-400/80 text-white dashain-glow-box my-auto max-h-[94vh] flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={closeDashainModal}
                className="absolute top-3 right-3 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-red-700 text-amber-200 hover:text-white border border-amber-300/60 flex items-center justify-center transition-all cursor-pointer shadow-lg"
                aria-label="Close Dashain Offer Popup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left / Top Column: Static Dashain Offer Poster Image Opening First */}
              <div className="relative w-full md:w-[52%] aspect-square bg-[#2A080E] shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-amber-400/40">
                <Image
                  src={DASHAIN_OFFER_CONFIG.posterImage}
                  alt="NaturesMud Dashain Blessings & Health - Free Delivery > 3000, Free Pink Salt on 5000+ Orders"
                  fill
                  priority
                  unoptimized
                  className="object-contain sm:object-cover"
                />
                {/* Top Left Live Validity Pill */}
                <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/70 text-[10px] sm:text-xs font-black text-amber-300 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>🇳🇵 Valid Till Dashain End</span>
                </div>
              </div>

              {/* Right / Bottom Column: Glowing Offer Details & Instant CTAs */}
              <div className="w-full md:w-[48%] p-4 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-4">
                <div className="space-y-3">
                  {/* Glowing Eyebrow */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/50 text-amber-200 text-[11px] font-black uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '5s' }} />
                    <span>Bada Dashain 2083 Maha Offer</span>
                  </div>

                  {/* Glowing Title */}
                  <div>
                    <h2 className="font-heading font-black text-2xl sm:text-3xl text-amber-300 tracking-tight leading-tight dashain-glow-text">
                      ✨ Dashain Blessings &amp; Health ✨
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-100/90 mt-1">
                      Celebrate Dashain with 100% Pure Himalayan Superfoods, Powders, Nuts &amp; Cold-Pressed Oils!
                    </p>
                  </div>

                  {/* Live Countdown Timer Till Dashain End */}
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-black/40 border border-amber-400/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
                      <Timer className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                      <span>Offer Ends In:</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black">
                      <span className="px-2 py-1 rounded-lg bg-amber-500/25 border border-amber-400/50 text-amber-200">
                        {countdown.days}d
                      </span>
                      <span className="text-amber-400">:</span>
                      <span className="px-2 py-1 rounded-lg bg-amber-500/25 border border-amber-400/50 text-amber-200">
                        {String(countdown.hours).padStart(2, '0')}h
                      </span>
                      <span className="text-amber-400">:</span>
                      <span className="px-2 py-1 rounded-lg bg-amber-500/25 border border-amber-400/50 text-amber-200">
                        {String(countdown.minutes).padStart(2, '0')}m
                      </span>
                      <span className="text-amber-400">:</span>
                      <span className="px-2 py-1 rounded-lg bg-amber-500/25 border border-amber-400/50 text-amber-200">
                        {String(countdown.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  </div>

                  {/* Glowing Offer Tiers */}
                  <div className="space-y-2.5">
                    {/* Tier 1: Free Delivery > 3000 */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-900/40 to-emerald-500/10 border border-emerald-400/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-400 text-emerald-950 font-black flex items-center justify-center shrink-0 shadow-md">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-black text-xs sm:text-sm text-emerald-200 dashain-glow-text">
                          FREE Delivery Over Rs. 3,000
                        </p>
                        <p className="text-[11px] text-emerald-100/85">
                          Fast doorstep delivery across Kathmandu &amp; all 77 districts of Nepal.
                        </p>
                      </div>
                    </div>

                    {/* Tier 2: Free Delivery + Free Pink Salt > 5000 */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/25 via-rose-900/40 to-amber-500/20 border border-pink-300/60 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-300 to-amber-300 text-red-950 font-black flex items-center justify-center shrink-0 shadow-md">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-black text-xs sm:text-sm text-pink-200 dashain-glow-text">
                          FREE Delivery + FREE Pink Salt Over Rs. 5,000+
                        </p>
                        <p className="text-[11px] text-pink-100/90">
                          Exclusive Gift: Free Himalayan Pink Salt Jar (worth Rs. 250) on 5,000+ orders!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2 border-t border-amber-400/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleShopNow('/offers')}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 text-red-950 font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Claim Dashain Offer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShopNow('/products')}
                      className="w-full py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-amber-300/50 font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <span>Shop All Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
