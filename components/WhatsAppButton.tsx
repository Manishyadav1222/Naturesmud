'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/lib/site';

import { useOrderStore } from '@/lib/store/order-store';

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
    
    // Check if customer has a recent/active order to attach the invoice automatically
    const latestOrder = useOrderStore.getState().orders[0];
    let waMessage = siteConfig.whatsappMessage;

    if (latestOrder) {
      const isValley =
        latestOrder.deliveryRegion === 'inside_valley' ||
        (latestOrder.shippingCity || '').toLowerCase().includes('kathmandu');
      const invoiceNumber = `INV-${latestOrder.orderNumber.replace('#', '')}`;

      const itemsSummary = Array.isArray(latestOrder.items)
        ? latestOrder.items
            .map(
              (it, idx) =>
                `  ${idx + 1}. ${it.name} x${it.quantity} - Rs. ${(
                  (Number(it.price) || 0) * (it.quantity || 1)
                ).toLocaleString()}`
            )
            .join('\n')
        : '';

      const lines = [
        `*🧾 NaturesMud Nepal - Customer Inquiry & Order Invoice*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📄 *Invoice No:* #${invoiceNumber}`,
        `📦 *Order No:* ${latestOrder.orderNumber}`,
        `👤 *Customer:* ${latestOrder.customerName}`,
        `📱 *Phone:* ${latestOrder.customerPhone}`,
        `📍 *Destination:* ${latestOrder.shippingAddress}, ${latestOrder.shippingCity} (${
          isValley ? 'Inside Kathmandu Valley' : 'Outside Valley'
        })`,
        ``,
        itemsSummary ? `🛒 *Ordered Items:*\n${itemsSummary}\n` : null,
        `💳 *Payment:* ${
          latestOrder.paymentMethod === 'fonepay'
            ? 'FonePay QR Advance'
            : 'Cash on Delivery (COD)'
        }`,
        latestOrder.paymentReference ? `🔢 *Ref ID:* ${latestOrder.paymentReference}` : null,
        `💰 *Total Amount:* Rs. ${Number(latestOrder.total).toLocaleString()}`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Hello NaturesMud team! I have a question regarding my order and invoice above:`,
      ]
        .filter(Boolean)
        .join('\n');

      waMessage = lines;
    }

    const waLink = isMobile
      ? `whatsapp://send?phone=${siteConfig.whatsappNumber}&text=${encodeURIComponent(
          waMessage
        )}`
      : `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
          waMessage
        )}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 group"
          aria-label="Chat with us on WhatsApp"
        >
          <span className="hidden sm:block bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-dark border border-gray-100 group-hover:shadow-xl transition-shadow">
            Chat with us
          </span>
          <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30">
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-white relative z-10"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}