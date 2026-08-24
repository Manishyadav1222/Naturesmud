'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Send,
  Building2,
  Store,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useOrderStore } from '@/lib/store/order-store';
import { siteConfig } from '@/lib/site';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/messages/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        });
      } else {
        setErrorMsg(data.message || 'Failed to send message. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please WhatsApp us at +977 9713888002.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B] flex flex-col font-sans">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-[#1E3A18] via-[#2D5A27] to-[#1E3A18] text-white py-14 lg:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9982A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="container-nm px-4 relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9982A]/20 text-[#EBC164] border border-[#C9982A]/40 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Nepal Sourcing Hub & Showrooms
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight">
              Get in Touch with Nature's Mud
            </h1>
            <p className="text-white/80 text-base sm:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
              Have questions about our dehydrated fruits, baby superfoods, or bulk wholesale? Visit our Kathmandu showroom or send us a message below.
            </p>
          </div>
        </section>

        {/* Contact Info & Showrooms Grid */}
        <section className="py-12 lg:py-16 container-nm px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Direct Contacts & Retail Outlets */}
            <div className="space-y-6">
              {/* Quick Contact Cards */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-heading font-black text-lg text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#2D5A27]" /> Main Headquarters & Hub
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#2D5A27] shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">Samakhushi / Gongabu Chowk</p>
                      <p className="text-xs text-gray-500">Near Kumari Bank, Arya Complex, Kathmandu, Nepal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#2D5A27] shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">+977 9713888002</p>
                      <p className="text-xs text-gray-500">Direct Orders & Customer Care (Sun–Fri, 9am–7pm)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#2D5A27] shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">info@naturesmud.com</p>
                      <p className="text-xs text-gray-500">Wholesale & Partnership Inquiries</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const latestOrder = useOrderStore.getState().orders[0];
                    let text = siteConfig.whatsappMessage;
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
                      text = [
                        `*🧾 Nature's Mud Nepal - Customer Inquiry & Order Invoice*`,
                        `━━━━━━━━━━━━━━━━━━━━`,
                        `📄 *Invoice No:* #${invoiceNumber}`,
                        `📦 *Order No:* ${latestOrder.orderNumber}`,
                        `👤 *Customer:* ${latestOrder.customerName || latestOrder.shippingName || ''}`,
                        `📱 *Phone:* ${latestOrder.customerPhone || ''}`,
                        `📍 *Destination:* ${latestOrder.shippingAddress || ''}, ${latestOrder.shippingCity || ''} (${
                          isValley ? 'Inside Valley' : 'Outside Valley'
                        })`,
                        ``,
                        itemsSummary ? `🛒 *Ordered Items:*\n${itemsSummary}\n` : null,
                        `💳 *Payment:* ${
                          latestOrder.paymentMethod === 'fonepay'
                            ? 'FonePay QR Advance'
                            : 'Cash on Delivery (COD)'
                        }`,
                        `💰 *Total Amount:* Rs. ${Number(latestOrder.total).toLocaleString()}`,
                        `━━━━━━━━━━━━━━━━━━━━`,
                        `Hello Nature's Mud team! I have a question regarding my order/invoice above:`,
                      ]
                        .filter(Boolean)
                        .join('\n');
                    }
                    window.open(
                      `https://wa.me/9779713888002?text=${encodeURIComponent(text)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </button>
              </div>

              {/* Retail Showcases Across Nepal */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-heading font-black text-lg text-gray-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#C9982A]" /> Retail Partner Showrooms
                </h3>
                <div className="space-y-2.5 text-xs text-gray-700">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="font-bold text-gray-900">Kids Kottage (Gongabu)</p>
                    <p className="text-gray-500">Arya Complex, Gongabu Chowk, Kathmandu</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="font-bold text-gray-900">Kids Kottage (Kupondol & Kapan)</p>
                    <p className="text-gray-500">Kupondol, Lalitpur & Kapan, Kathmandu</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="font-bold text-gray-900">Kids Kottage (Pokhara)</p>
                    <p className="text-gray-500">New Road, Pokhara, Gandaki</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="font-bold text-gray-900">Zero to Ten & Baby Love</p>
                    <p className="text-gray-500">Chabahil, Kathmandu & Hetauda Outlets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form & Live Map */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-black font-heading text-gray-900 mb-2">Send Us a Direct Message</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Our customer care and nutritionist team will respond via phone or email within 2 hours.
                </p>

                {isSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-900 font-heading">Thank You! Message Received</h3>
                    <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                      Your inquiry has been logged in our system. A Nature's Mud representative will contact you shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs font-bold text-emerald-900 underline mt-2 cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sushil Shrestha"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. sushil@gmail.com"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Phone / WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 9802323451"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Inquiry Subject
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                        >
                          <option value="General Inquiry">General Product Inquiry</option>
                          <option value="Baby Food & Weaning">Baby Food & Weaning Advice</option>
                          <option value="Order Status & Delivery">Order Status & Delivery</option>
                          <option value="Wholesale & Bulk Orders">Wholesale / B2B Distribution</option>
                          <option value="Festival Gift Hamper">Festival Gift Hamper Order</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Your Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us what you are looking for..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2D5A27] hover:bg-[#23471e] text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Embedded Google Map */}
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <MapPin className="w-4 h-4 text-[#2D5A27]" />
                    <span>Location: Gongabu Chowk & Samakhushi Hub, Kathmandu</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Gongabu+Chowk+Kathmandu+Nepal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#2D5A27] hover:underline flex items-center gap-1"
                  >
                    Open in Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="h-64 w-full bg-gray-100">
                  <iframe
                    title="Nature's Mud Kathmandu Location"
                    src="https://maps.google.com/maps?q=Gongabu%20Chowk,%20Kathmandu,%20Nepal&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}