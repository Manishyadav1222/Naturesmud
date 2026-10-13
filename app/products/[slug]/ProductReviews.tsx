'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, Camera, X, ShieldCheck, PackageCheck, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/admin/Button';

export interface PublicReviewItem {
  id: string;
  author: string;
  title: string;
  content: string;
  rating: number;
  images: string[];
  isVerified?: boolean;
  orderNumber?: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  productSlug?: string;
  productName?: string;
  initialReviews?: PublicReviewItem[];
}

export default function ProductReviews({
  productId,
  productSlug = '',
  productName = 'this product',
  initialReviews = [],
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<PublicReviewItem[]>(initialReviews);
  const [loading, setLoading] = useState(initialReviews.length === 0);

  // Order-tied review form state
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imgUrlInput, setImgUrlInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-detect ?orderId=NM-... from post-delivery WhatsApp/SMS review link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlOrder = params.get('orderId') || params.get('order') || params.get('order_number');
      const urlName = params.get('name') || '';
      if (urlOrder) {
        setOrderNumber(urlOrder.trim().toUpperCase());
        if (urlName) setCustomerName(urlName.trim());
        setShowForm(true);
      }
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const queryKey = productSlug || productId;
      const res = await fetch(`/api/reviews?product=${encodeURIComponent(queryKey)}`);
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        const mapped: PublicReviewItem[] = data.data
          .filter(
            (r: any) =>
              r &&
              typeof (r.content || r.body) === 'string' &&
              (r.content || r.body).trim().length > 0
          )
          .map((r: any) => ({
            id: String(r.id),
            author: r.customerName || r.customer_name || r.author || 'Customer',
            title: r.title || '',
            content: (r.content || r.body || '').trim(),
            rating: Number(r.rating) || 5,
            images: Array.isArray(r.images)
              ? r.images.map((img: any) => (typeof img === 'string' ? img : img?.url || '')).filter(Boolean)
              : [],
            isVerified: Boolean(r.isVerified ?? r.is_verified),
            orderNumber: r.orderNumber || r.order_number || undefined,
            createdAt: r.createdAt || r.created_at || new Date().toISOString(),
          }));
        setReviews(mapped);
      }
    } catch {
      // Keep initial SSR reviews if fetch fails
    } finally {
      setLoading(false);
    }
  }, [productId, productSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Compress uploaded photo on client so customers can attach real product photos directly from phone
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length >= 2) {
      setErrorMsg('You can attach up to 2 photos per review.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 720;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
          setImages((prev) => [...prev, dataUrl]);
        }
      };
      if (typeof ev.target?.result === 'string') {
        img.src = ev.target.result;
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const clean = imgUrlInput.trim();
    if (clean && !images.includes(clean) && images.length < 2) {
      setImages([...images, clean]);
      setImgUrlInput('');
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!rating || !content.trim() || !customerName.trim() || !orderNumber.trim()) {
      setErrorMsg('Please enter your Order Number, Name, Rating, and Review.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productSlug,
          orderNumber: orderNumber.trim().toUpperCase(),
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          rating,
          title: title.trim(),
          content: content.trim(),
          images,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) {
        setErrorMsg(json.message || 'Could not submit review. Please check your Order Number and try again.');
      } else {
        setSuccessMsg(
          json.message ||
            'Thank you! Your order-tied review has been recorded and will appear on this page once verified.'
        );
        setShowForm(false);
        setRating(5);
        setTitle('');
        setContent('');
        setImages([]);
        fetchReviews();
      }
    } catch {
      setErrorMsg('Network error while submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading font-bold text-2xl text-[#2B2B2B]">
            Customer Reviews for {productName}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Every published review is tied to a real NaturesMud Order Number (NM-...). We never display synthetic ratings or unverified review counts.
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#3A6B35] hover:bg-[#2b5227] inline-flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write an Order Review</span>
          </Button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#3A6B35] shrink-0 mt-0.5" />
          <div>{successMsg}</div>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submitReview}
          className="bg-[#FAF8F5] rounded-2xl p-6 mb-8 border border-stone-200 shadow-xs"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#1A3826]">
                Submit Your Order-Verified Review
              </h3>
              <p className="text-xs text-stone-500">
                Enter the Order ID from your invoice or WhatsApp delivery message (e.g., NM-420417).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close review form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Order Number *
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono focus:border-[#3A6B35] focus:outline-none focus:ring-1 focus:ring-[#3A6B35]"
                  placeholder="e.g. NM-420417"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#3A6B35] focus:outline-none focus:ring-1 focus:ring-[#3A6B35]"
                  placeholder="Full Name on Order"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Phone on Order (Optional)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#3A6B35] focus:outline-none focus:ring-1 focus:ring-[#3A6B35]"
                  placeholder="98XXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Your Rating *
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none p-0.5"
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        rating >= star ? 'fill-[#D9A441] text-[#D9A441]' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#3A6B35] focus:outline-none focus:ring-1 focus:ring-[#3A6B35]"
                placeholder="How did you use this product in your kitchen?"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Your Review *
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm min-h-[100px] focus:border-[#3A6B35] focus:outline-none focus:ring-1 focus:ring-[#3A6B35]"
                placeholder="Share your honest experience with taste, texture, packaging, and how you prepared it..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Add Product Photos (Up to 2 Photos — Upload from Phone or Paste URL)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-stone-300 hover:border-[#3A6B35] text-xs font-semibold text-stone-700 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-[#3A6B35]" />
                  <span>Upload Photo from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="hidden"
                  />
                </label>

                <div className="flex flex-1 min-w-[220px] gap-2">
                  <input
                    type="url"
                    value={imgUrlInput}
                    onChange={(e) => setImgUrlInput(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-[#3A6B35] focus:outline-none"
                    placeholder="Or paste photo URL (https://...)"
                  />
                  <Button type="button" variant="outline" onClick={handleAddImageUrl}>
                    Add URL
                  </Button>
                </div>
              </div>

              {images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`Customer review upload ${idx + 1}`}
                        className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1"
                        aria-label="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3A6B35] hover:bg-[#2b5227]"
            >
              {isSubmitting ? 'Verifying Order & Submitting...' : 'Submit Order-Verified Review'}
            </Button>
          </div>
        </form>
      )}

      {loading && reviews.length === 0 ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-100 rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#F8F4EC] rounded-2xl p-5 flex flex-col h-full border border-stone-200/70">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#3A6B35] text-white flex items-center justify-center text-sm font-semibold">
                    {r.author.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-[#2B2B2B]">{r.author}</p>
                    {r.isVerified && (
                      <p className="text-[11px] text-[#3A6B35] font-medium flex items-center gap-1">
                        <PackageCheck className="w-3 h-3" />
                        <span>Order-Linked Review</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex text-[#D9A441]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'fill-[#D9A441]' : 'text-gray-300 fill-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {r.title && <h3 className="font-semibold text-sm text-[#1A3826] mb-1">{r.title}</h3>}
              <p className="text-sm text-gray-700 mb-3 flex-1 leading-relaxed">{r.content}</p>

              {r.images && Array.isArray(r.images) && r.images.length > 0 && (
                <div className="flex gap-2 mb-3 mt-auto flex-wrap">
                  {r.images.map((img: any, idx: number) => (
                    <img
                      key={idx}
                      src={typeof img === 'string' ? img : img?.url}
                      alt={`${productName} customer photo ${idx + 1}`}
                      className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              )}

              <div className="mt-auto pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                <span>{new Date(r.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          ))}
          {reviews.length === 0 && !showForm && (
            <div className="col-span-2 bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-6 text-center">
              <p className="text-sm font-semibold text-stone-800">
                No verified customer reviews published for {productName} yet.
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-xl mx-auto">
                Have you ordered {productName}? Click <strong>Write an Order Review</strong> above and enter your NaturesMud Order Number (from your invoice or WhatsApp delivery link) to share your text and photo review.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
