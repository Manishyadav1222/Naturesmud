'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  CheckCircle2,
  MessageSquarePlus,
  ShieldCheck,
  Sparkles,
  Leaf,
  PackageCheck,
  Truck,
  X,
  Send,
} from 'lucide-react';
import { products } from '@/lib/data/products';

interface PublicReview {
  id: number | string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  productName?: string;
  productSlug?: string;
}

const QUALITY_PILLARS = [
  {
    icon: Leaf,
    title: '100% Single-Ingredient Whole Food',
    description:
      'Every powder, dehydrated fruit, nut, seed, oil, and mineral salt is packed from real whole food without fillers or maltodextrin.',
  },
  {
    icon: ShieldCheck,
    title: '0% Added Sugar · 0 Preservatives',
    description:
      'No refined cane sugar, no sulfur dioxide bleaching, no artificial coloring, and no synthetic flavorings.',
  },
  {
    icon: PackageCheck,
    title: 'Airtight Glass Jars & Food-Grade Pouches',
    description:
      'Sealed fresh in reusable glass jars or moisture-barrier standup pouches to protect natural aroma and nutrients in Nepal’s climate.',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery Across Nepal',
    description:
      '24–48 hour delivery inside Kathmandu Valley and express courier dispatch to Pokhara, Chitwan, Butwal, Biratnagar, and all 77 districts.',
  },
];

export default function RealCustomerReviewsSection() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review submission state (posts to real backend moderation queue)
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '166');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadApprovedReviews() {
      try {
        const featuredSlice = products.slice(0, 6);
        const results = await Promise.all(
          featuredSlice.map(async (prod) => {
            try {
              const res = await fetch(`/api/admin/reviews/public/${prod.id}`);
              if (!res.ok) return [];
              const json = await res.json();
              const list = Array.isArray(json.data) ? json.data : [];
              return list.map((item: any) => ({
                ...item,
                productName: prod.official_label_name || prod.name,
                productSlug: prod.slug,
              }));
            } catch {
              return [];
            }
          })
        );
        if (!cancelled) {
          setReviews(results.flat());
        }
      } catch {
        // Keep empty if none exist
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadApprovedReviews();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;
    setSubmitting(true);
    setSubmitMessage(null);
    try {
      const res = await fetch(`/api/admin/reviews/public/${selectedProductId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim() || undefined,
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }
      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your review has been submitted and will appear once verified.',
      });
      setCustomerName('');
      setCustomerEmail('');
      setRating(5);
      setComment('');
    } catch (err: any) {
      setSubmitMessage({
        type: 'error',
        text: err.message || 'Could not submit review right now. Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-white via-[#FAF7F2]/60 to-white overflow-hidden relative py-10 sm:py-14 lg:py-16 border-t border-[#EAE3D6]/60">
      <div className="container-nm relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#7A5230] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#1A3826]" />
              <span>Clean Label Standards &amp; Customer Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-ink tracking-tight">
              Our Purity Commitments &amp; Customer Reviews
            </h2>
            <p className="text-xs sm:text-sm text-ink/70 max-w-2xl mt-1.5 leading-relaxed">
              We publish only real customer reviews submitted by buyers in Nepal. Every NaturesMud product is backed by transparent ingredient labeling.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubmitMessage(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1A3826] hover:bg-[#254d35] text-white font-heading font-bold text-xs sm:text-sm transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Product Review</span>
          </button>
        </div>

        {/* If real approved reviews exist in DB, show them */}
        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {reviews.slice(0, 6).map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl bg-white border border-[#EAE3D6] p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-heading font-bold text-sm text-ink">{rev.customer_name}</span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-amber-400' : 'fill-gray-200 text-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-ink/80 leading-relaxed mb-3">&ldquo;{rev.comment}&rdquo;</p>
                </div>
                <div className="pt-3 border-t border-ink/8 flex items-center justify-between text-[11px] text-ink/60">
                  {rev.productSlug ? (
                    <Link href={`/products/${rev.productSlug}`} className="font-semibold text-primary hover:underline">
                      {rev.productName}
                    </Link>
                  ) : (
                    <span>NaturesMud Product</span>
                  )}
                  <span>{new Date(rev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4 Verifiable Quality Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {QUALITY_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#EAE3D6] p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1A3826] flex items-center justify-center mb-3.5 border border-emerald-200/60">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-ink mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-ink/70 leading-relaxed">{pillar.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-ink/5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Standard on All 32 Products</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-ink/10">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-5">
              <div>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-ink">
                  Share Your NaturesMud Review
                </h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Reviews are published after moderation to ensure authentic customer feedback.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitMessage && (
              <div
                className={`mb-4 p-3.5 rounded-xl text-xs font-medium ${
                  submitMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.official_label_name || prod.name} ({prod.weight})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Email (optional)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Rating *</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Your Review *</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How did you use this product and what did you think of the quality?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1A3826] hover:bg-[#254d35] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
