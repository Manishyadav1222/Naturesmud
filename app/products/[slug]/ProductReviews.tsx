'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, Upload, X } from 'lucide-react';
import { Button } from '@/components/admin/Button';

interface Review {
  id: string;
  author: string; // from userId / customerName
  title: string;
  content: string;
  rating: number;
  images: any[];
  helpfulCount: number;
  createdAt: string;
  status: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imgUrlInput, setImgUrlInput] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/reviews/public/${productId}`);
      const data = await res.json();
      if (data && data.data) {
        // Map data to our Review type
        const mapped = data.data.map((r: any) => ({
          ...r,
          author: r.customerName || 'Anonymous',
        }));
        setReviews(mapped);
      }
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAddImageUrl = () => {
    if (imgUrlInput && !images.includes(imgUrlInput)) {
      setImages([...images, imgUrlInput]);
      setImgUrlInput('');
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !content) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/admin/reviews/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          title,
          content,
          images,
          userId: 'guest',
        }),
      });
      setSuccessMsg('Review submitted successfully! It will appear once approved.');
      setShowForm(false);
      setRating(5);
      setTitle('');
      setContent('');
      setImages([]);
    } catch (err) {
      console.error(err);
      alert('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl">Customer Reviews</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-[#3A6B35] hover:bg-[#2b5227]">
            Write a Review
          </Button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
          {successMsg}
        </div>
      )}

      {showForm && (
        <form onSubmit={submitReview} className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Write your review</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${rating >= star ? 'fill-[#D9A441] text-[#D9A441]' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#3A6B35] focus:outline-none focus:ring-1 focus:ring-[#3A6B35]"
                placeholder="Brief summary of your review"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[100px] focus:border-[#3A6B35] focus:outline-none focus:ring-1 focus:ring-[#3A6B35]"
                placeholder="What did you like or dislike?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Photos (Optional URLs)</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imgUrlInput}
                  onChange={(e) => setImgUrlInput(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#3A6B35] focus:outline-none focus:ring-1 focus:ring-[#3A6B35]"
                  placeholder="https://example.com/image.jpg"
                />
                <Button type="button" variant="outline" onClick={handleAddImageUrl}>Add</Button>
              </div>
              {images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#3A6B35] hover:bg-[#2b5227]">
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#F8F4EC] rounded-2xl p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#3A6B35] text-white flex items-center justify-center text-sm font-semibold">
                    {r.author.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{r.author}</p>
                    {/* Assume verified if not pending in a real app, but for now just show a simple check */}
                    <p className="text-xs text-[#3A6B35]">✓ Natural & Pure Purchase</p>
                  </div>
                </div>
                <div className="flex text-[#D9A441]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-[#D9A441]' : 'text-gray-300 fill-transparent'}`} />
                  ))}
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1">{r.title}</h3>
              <p className="text-sm text-gray-600 mb-3 flex-1">{r.content}</p>
              
              {r.images && Array.isArray(r.images) && r.images.length > 0 && (
                <div className="flex gap-2 mb-3 mt-auto flex-wrap">
                  {r.images.map((img: any, idx: number) => (
                    <img key={idx} src={img.url || img} alt="Review attachment" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                  ))}
                </div>
              )}

              <div className="mt-auto pt-2 flex items-center gap-1 text-xs text-gray-400">
                <ThumbsUp className="h-3 w-3" />
                {r.helpfulCount || 0} found helpful
              </div>
            </div>
          ))}
          {reviews.length === 0 && !showForm && (
            <p className="text-gray-500 col-span-2">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      )}
    </div>
  );
}
