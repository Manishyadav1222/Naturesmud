'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, PackageCheck, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useOrderStore, CustomerOrder } from '@/lib/store/order-store';
import { formatPrice } from '@/lib/utils';
import { api } from '@/lib/api';

export function OrdersHeaderWidget() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeOrders = mounted ? orders : [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Poll / Sync live backend status for active orders politely
  useEffect(() => {
    if (!mounted) return;

    const syncStatuses = async () => {
      const activeOrders = useOrderStore
        .getState()
        .orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
        .slice(0, 3);

      if (activeOrders.length === 0) return;

      for (const order of activeOrders) {
        try {
          const { data } = await api.get<{ status: string }>(`/orders/${order.orderNumber}/status`);
          if (data && data.status) {
            const normStatus = data.status.toLowerCase() as CustomerOrder['status'];
            if (normStatus !== order.status) {
              useOrderStore.getState().updateOrderStatus(order.orderNumber, normStatus);
            }
          }
        } catch {
          // Ignore polling errors
        }
      }
    };

    syncStatuses();
    const interval = setInterval(syncStatuses, 30000);
    return () => clearInterval(interval);
  }, [mounted]);

  const latestOrder: CustomerOrder | undefined = safeOrders[0];

  const getStatusBadge = (status: CustomerOrder['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Awaiting Admin Approval ⏳',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          step: 1,
        };
      case 'confirmed':
        return {
          label: 'Approved by Admin ✅',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
          step: 2,
        };
      case 'packed':
      case 'ready':
        return {
          label: 'Packed & Ready 📦',
          color: 'bg-blue-50 text-blue-800 border-blue-200',
          step: 3,
        };
      case 'shipped':
        return {
          label: 'In Transit 🚚',
          color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          step: 4,
        };
      case 'delivered':
        return {
          label: 'Delivered 🎉',
          color: 'bg-[#3A6B35]/15 text-[#3A6B35] border-[#3A6B35]/30',
          step: 5,
        };
      case 'cancelled':
        return {
          label: 'Cancelled ❌',
          color: 'bg-red-50 text-red-700 border-red-200',
          step: 0,
        };
      default:
        return {
          label: 'Processing',
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          step: 1,
        };
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* ── Header Actions Toolbar Button ── */}
      <motion.button
        whileHover={{ scale: 1.06, y: -1 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
          safeOrders.length > 0
            ? 'bg-gradient-to-r from-primary to-emerald-700 text-white shadow-md shadow-emerald-950/20 ring-2 ring-primary/40 hover:shadow-lg'
            : 'text-ink/80 hover:text-primary hover:bg-black/5'
        }`}
        aria-label="View active orders status"
      >
        {/* Animated Pulse Dot for Active Orders */}
        {safeOrders.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-500"></span>
          </span>
        )}

        {/* Truck / Package Icon */}
        <motion.div
          animate={safeOrders.length > 0 ? { x: [0, 2, 0, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="flex items-center justify-center"
        >
          {safeOrders.length > 0 ? (
            <Truck className="w-4 h-4 text-gold-300" />
          ) : (
            <PackageCheck className="w-4 h-4" />
          )}
        </motion.div>

        {/* Label: Orders count or Track Order */}
        <span className="font-semibold tracking-wide whitespace-nowrap">
          {safeOrders.length > 0 ? (
            <span>Orders ({safeOrders.length})</span>
          ) : (
            <span>Track Order</span>
          )}
        </span>
      </motion.button>

      {/* ── Dropdown Orders Status Popover ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 w-80 sm:w-96 z-50 rounded-2xl bg-white shadow-2xl border border-gray-100 p-5 overflow-hidden"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-gray-900">Your Orders</h3>
                  <p className="text-[11px] text-gray-500">Live approval & delivery status</p>
                </div>
              </div>
              {safeOrders.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {safeOrders.length} Active
                </span>
              )}
            </div>

            {/* Orders Content */}
            {safeOrders.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-3 text-[#3A6B35]">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <p className="font-semibold text-sm text-gray-800">No recent orders</p>
                <p className="text-xs text-gray-500 mt-1 max-w-[220px] mx-auto">
                  When you place an order, live status tracking will appear here.
                </p>
                <Link
                  href="/track-order"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3A6B35] hover:text-[#2d5429]"
                >
                  Track an order <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {safeOrders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  return (
                    <div
                      key={order.orderNumber}
                      className="rounded-xl border border-gray-100 bg-cream-50/50 p-4 transition-all hover:bg-cream-100/60"
                    >
                      {/* Order Info Bar */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                            Order Number
                          </span>
                          <p className="text-sm font-bold text-gray-900">{order.orderNumber}</p>
                        </div>
                        <span className="text-xs font-bold text-[#3A6B35] bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gold-500" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className={`font-semibold px-2.5 py-1 rounded-full border text-[11px] ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="mb-4">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(statusInfo.step / 5) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[#3A6B35] to-[#7AA95C] rounded-full"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
                          <span className={statusInfo.step >= 1 ? 'text-[#3A6B35] font-bold' : ''}>Placed</span>
                          <span className={statusInfo.step >= 2 ? 'text-emerald-700 font-bold' : ''}>Admin Approved</span>
                          <span className={statusInfo.step >= 4 ? 'text-[#3A6B35] font-bold' : ''}>Shipped</span>
                          <span className={statusInfo.step >= 5 ? 'text-[#3A6B35] font-bold' : ''}>Delivered</span>
                        </div>
                      </div>

                      {/* Action Link: Track Order */}
                      <div className="pt-2 border-t border-gray-200/60">
                        <Link
                          href={`/track-order?number=${order.orderNumber}`}
                          onClick={() => setIsOpen(false)}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#3A6B35] text-white rounded-lg text-xs font-semibold hover:bg-[#2d5429] transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5" /> View Order Status Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
