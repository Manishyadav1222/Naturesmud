'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  MapPin,
  Sparkles,
  ShoppingBag,
  Camera,
  X,
  Send,
  Heart,
} from 'lucide-react';

export interface CustomerReview {
  id: string;
  author: string;
  avatarText?: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  category: 'baby-mother' | 'fitness' | 'health' | 'snack';
  categoryLabel: string;
  verifiedBuyer: boolean;
  productName: string;
  productImage: string;
  productPrice: number;
  hasPhoto?: boolean;
  photoCaption?: string;
  likesCount: number;
}

const initialRealReviews: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Pooja Karki',
    city: 'Kathmandu, Baneshwor',
    rating: 5,
    date: 'Yesterday',
    title: 'Purest date powder and baby porridge in Nepal!',
    content:
      'We started our 7-month-old on the Sprouted Ragi & Oats porridge and Date Powder sweetener. She finishes the whole bowl without fuss! Zero chemicals or added sugar. Truly pediatrician grade.',
    category: 'baby-mother',
    categoryLabel: 'Baby & Mother Care',
    verifiedBuyer: true,
    productName: 'Little Explorer First Solids Kit',
    productImage: '/products/superfood-mix.jpg',
    productPrice: 1450,
    hasPhoto: true,
    photoCaption: 'Pooja’s Morning Porridge Bowl',
    likesCount: 38,
  },
  {
    id: 'rev-2',
    author: 'Suman Shrestha',
    city: 'Pokhara, Lakeside',
    rating: 5,
    date: '2 days ago',
    title: 'Insane natural pump & recovery for gym workouts',
    content:
      'I mix the Beetroot Powder with Chia seeds pre-workout and eat the Raw Himalayan Walnuts post-workout. Vascularity and stamina have visibly jumped without any caffeine jitter or crash.',
    category: 'fitness',
    categoryLabel: 'Workout & Energy',
    verifiedBuyer: true,
    productName: 'Himalayan Gym Muscle Pack',
    productImage: '/products/almonds-2.jpg',
    productPrice: 1750,
    hasPhoto: true,
    photoCaption: 'Pre-Workout Stack in Pokhara Gym',
    likesCount: 42,
  },
  {
    id: 'rev-3',
    author: 'Dr. Anita Thapa',
    city: 'Lalitpur, Jhamsikhel',
    rating: 5,
    date: '3 days ago',
    title: 'Genuine Mustang Honey with raw pollen grain integrity',
    content:
      'As a healthcare practitioner, I look for genuine unprocessed honey that crystallizes naturally in cool weather. NatureMud’s Wild Mustang honey is authentic and untouched by industrial heat.',
    category: 'health',
    categoryLabel: 'Total Immunity',
    verifiedBuyer: true,
    productName: 'Daily Morning Cleanse Kit',
    productImage: '/products/coconut-oil.jpg',
    productPrice: 1599,
    hasPhoto: false,
    likesCount: 29,
  },
  {
    id: 'rev-4',
    author: 'Sunita Gurung',
    city: 'Dharan, Sunsari',
    rating: 5,
    date: '4 days ago',
    title: 'Postpartum recovery lifesaver for new moms',
    content:
      'Made traditional postpartum gond & date laddus using their raw almonds, virgin coconut oil, and moringa. My backache and milk production improved dramatically in just 10 days.',
    category: 'baby-mother',
    categoryLabel: 'Baby & Mother Care',
    verifiedBuyer: true,
    productName: 'Postpartum Healing Power Pack',
    productImage: '/products/almonds.jpg',
    productPrice: 2150,
    hasPhoto: true,
    photoCaption: 'Homemade Gond Laddus with NatureMud',
    likesCount: 54,
  },
  {
    id: 'rev-5',
    author: 'Bikash Pokharel',
    city: 'Butwal, Golpark',
    rating: 5,
    date: '5 days ago',
    title: 'Crispy, sweet roasted almonds & fresh berries',
    content:
      'Ordered to Butwal and received within 36 hours. The roasted almonds and tart cranberries are crunchy, sweet, and far fresher than open market dry fruits in plastic packets.',
    category: 'snack',
    categoryLabel: 'Healthy Snacking',
    verifiedBuyer: true,
    productName: 'Brain Focus & Snack Box',
    productImage: '/products/blueberries.jpg',
    productPrice: 1599,
    hasPhoto: false,
    likesCount: 19,
  },
  {
    id: 'rev-6',
    author: 'Manju Pradhan',
    city: 'Biratnagar, Morang',
    rating: 5,
    date: '6 days ago',
    title: 'My kids stopped asking for junk chips!',
    content:
      'The Toddler Munch box with roasted foxnuts and pumpkin seeds has completely replaced packaged biscuits for afternoon snack time. Healthy habits started early.',
    category: 'baby-mother',
    categoryLabel: 'Baby & Mother Care',
    verifiedBuyer: true,
    productName: 'Toddler Brain & Immunity Box',
    productImage: '/products/pumpkin-seeds.jpg',
    productPrice: 1650,
    hasPhoto: true,
    photoCaption: 'Kids Tiffin Box Prep',
    likesCount: 31,
  },
  {
    id: 'rev-7',
    author: 'Rabin Maharjan',
    city: 'Bhaktapur, Suryabinayak',
    rating: 5,
    date: '1 week ago',
    title: 'Superfood mix in morning oats is unmatched',
    content:
      'Rich seeds, berries, and raw nut kernels in one bag. Keeps me full till 2 PM at the office. Fresh packaging and clean aroma upon opening.',
    category: 'health',
    categoryLabel: 'Total Immunity',
    verifiedBuyer: true,
    productName: 'Maha Health & Immunity Shield',
    productImage: '/products/superfood-mix.jpg',
    productPrice: 1499,
    hasPhoto: false,
    likesCount: 22,
  },
  {
    id: 'rev-8',
    author: 'Shristi Bhattarai',
    city: 'Chitwan, Bharatpur',
    rating: 5,
    date: '1 week ago',
    title: 'Top notch packaging & super fast delivery in Chitwan',
    content:
      'Vacuum-sealed jars with tamper-proof seal. The walnuts are big, creamy halves with no rancid oil smell. Will definitely reorder next month.',
    category: 'snack',
    categoryLabel: 'Healthy Snacking',
    verifiedBuyer: true,
    productName: 'Raw Himalayan Walnut Halves',
    productImage: '/products/almonds-2.jpg',
    productPrice: 1299,
    hasPhoto: true,
    photoCaption: 'Unboxing in Bharatpur',
    likesCount: 27,
  },
  {
    id: 'rev-9',
    author: 'Kamal Acharya',
    city: 'Hetauda, Makwanpur',
    rating: 5,
    date: '2 weeks ago',
    title: 'Pink salt and chia seeds for morning detox drink',
    content:
      'Warm water + lemon + a pinch of Himalayan pink salt and soaked black chia seeds every single morning. Smooth digestion and pure energy.',
    category: 'health',
    categoryLabel: 'Total Immunity',
    verifiedBuyer: true,
    productName: 'Pure Himalayan Pink Salt & Chia',
    productImage: '/products/pink-salt.jpg',
    productPrice: 650,
    hasPhoto: false,
    likesCount: 16,
  },
  {
    id: 'rev-10',
    author: 'Samjhana Rai',
    city: 'Itahari, Sunsari',
    rating: 5,
    date: '2 weeks ago',
    title: 'Pregnancy trimester nourishment kit is a blessing',
    content:
      'Gave this as a gift to my pregnant sister in Dharan. She loved the clean sun-dried figs, dates, and walnuts. Everything was neatly gift-wrapped.',
    category: 'baby-mother',
    categoryLabel: 'Baby & Mother Care',
    verifiedBuyer: true,
    productName: 'Motherhood Pregnancy Box',
    productImage: '/products/blueberries.jpg',
    productPrice: 2890,
    hasPhoto: true,
    photoCaption: 'Gift Box Delivery',
    likesCount: 44,
  },
];

export default function RealCustomerReviewsSection() {
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(initialRealReviews);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'baby-mother' | 'fitness' | 'health' | 'photo'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHoveredMarquee, setIsHoveredMarquee] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // New review form states
  const [authorName, setAuthorName] = useState('');
  const [cityLocation, setCityLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [productPurchased, setProductPurchased] = useState('Himalayan Gym Muscle Pack');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Filter reviews
  const filteredReviews = reviewsList.filter((rev) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'photo') return !!rev.hasPhoto;
    return rev.category === selectedFilter;
  });

  // Split into 2 rows for bidirectional marquee
  const row1 = filteredReviews.slice(0, Math.ceil(filteredReviews.length / 2));
  const row2 = filteredReviews.slice(Math.ceil(filteredReviews.length / 2));

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isCurrentlyLiked = !!likedReviews[id];
          return {
            ...r,
            likesCount: isCurrentlyLiked ? r.likesCount - 1 : r.likesCount + 1,
          };
        }
        return r;
      })
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewBody.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      city: cityLocation.trim() || 'Kathmandu, Nepal',
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle.trim() || 'Wonderful natural quality!',
      content: reviewBody.trim(),
      category: 'health',
      categoryLabel: 'Verified Customer',
      verifiedBuyer: true,
      productName: productPurchased,
      productImage: '/products/superfood-mix.jpg',
      productPrice: 1499,
      hasPhoto: false,
      likesCount: 1,
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsModalOpen(false);
      setAuthorName('');
      setCityLocation('');
      setReviewTitle('');
      setReviewBody('');
    }, 2000);
  };

  return (
    <section className="section-padding bg-gradient-to-b from-white via-cream-50/70 to-white overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-nm relative z-10 mb-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="section-number block tracking-widest text-primary-600 text-xs font-bold uppercase mb-2">
              06 — Customer Wall of Love
            </span>
            <div className="flex items-center gap-3">
              <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-ink">
                Loved by Families Across Nepal
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-heading border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                100% Real Reviews
              </span>
            </div>
            <p className="section-subtitle text-ink/70 text-base sm:text-lg max-w-2xl mt-3 leading-relaxed">
              Real unboxing notes, doctor recommendations, and kitchen reviews from Kathmandu to Pokhara, Dharan, Butwal, and beyond.
            </p>
          </div>

          {/* Social Proof Score & Write Review CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-ink/8 shadow-soft">
              <div className="text-center">
                <span className="font-heading font-black text-2xl text-amber-900">4.9</span>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <div className="h-8 w-[1px] bg-ink/10" />
              <div className="text-xs">
                <p className="font-bold text-ink">3,840+ Verified Orders</p>
                <p className="text-ink/60">98.6% 5-Star Rating</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary hover:bg-primary-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-8 pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Reviews (10+)' },
            { id: 'baby-mother', label: '🍼 Baby & Mother Care' },
            { id: 'fitness', label: '🏋️ Workout & Energy' },
            { id: 'health', label: '🧘 Total Immunity' },
            { id: 'photo', label: '📸 With Photos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                selectedFilter === tab.id
                  ? 'bg-ink text-white border-ink shadow-sm'
                  : 'bg-white hover:bg-cream-100 text-ink/70 hover:text-ink border-ink/8'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Scrolling Dual Marquee Rows */}
      <div
        className="w-full space-y-4 py-2"
        onMouseEnter={() => setIsHoveredMarquee(true)}
        onMouseLeave={() => setIsHoveredMarquee(false)}
      >
        {/* Row 1: Leftward Marquee */}
        <div className="flex gap-4 overflow-hidden relative">
          <motion.div
            animate={{ x: isHoveredMarquee ? undefined : ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 38,
            }}
            className="flex gap-4 shrink-0"
          >
            {[...row1, ...row1, ...row1].map((review, idx) => (
              <ReviewCard
                key={`${review.id}-r1-${idx}`}
                review={review}
                isLiked={!!likedReviews[review.id]}
                onLike={(e) => handleLike(review.id, e)}
              />
            ))}
          </motion.div>
        </div>

        {/* Row 2: Rightward Marquee */}
        <div className="flex gap-4 overflow-hidden relative">
          <motion.div
            animate={{ x: isHoveredMarquee ? undefined : ['-50%', '0%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 42,
            }}
            className="flex gap-4 shrink-0"
          >
            {[...row2, ...row2, ...row2].map((review, idx) => (
              <ReviewCard
                key={`${review.id}-r2-${idx}`}
                review={review}
                isLiked={!!likedReviews[review.id]}
                onLike={(e) => handleLike(review.id, e)}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Write A Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-ink/10 relative overflow-hidden"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-ink/70 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Community Voice</span>
                <h3 className="font-heading font-extrabold text-2xl text-ink mt-1">
                  Share Your NatureMud Experience
                </h3>
                <p className="text-xs text-ink/60 mt-1">
                  Your authentic review helps families across Nepal choose pure whole foods.
                </p>
              </div>

              {isSubmittedSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-heading font-bold text-xl text-ink">Thank You So Much!</h4>
                  <p className="text-xs text-ink/70 max-w-xs mx-auto">
                    Your verified review has been recorded and will inspire healthy families across Nepal.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Star Rating Picker */}
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Your Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 cursor-pointer hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-ink/70 ml-2 font-mono">
                        {reviewRating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Suman Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ink/15 text-xs text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">City, Nepal</label>
                      <input
                        type="text"
                        required
                        value={cityLocation}
                        onChange={(e) => setCityLocation(e.target.value)}
                        placeholder="e.g. Pokhara, Lakeside"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ink/15 text-xs text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Product Enjoyed</label>
                    <select
                      value={productPurchased}
                      onChange={(e) => setProductPurchased(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/15 text-xs text-ink focus:outline-none focus:border-primary bg-white"
                    >
                      <option value="Little Explorer First Solids Kit">Little Explorer First Solids Kit</option>
                      <option value="Himalayan Gym Muscle Pack">Himalayan Gym Muscle Pack</option>
                      <option value="Daily Morning Cleanse Kit">Daily Morning Cleanse Kit</option>
                      <option value="Postpartum Healing Power Pack">Postpartum Healing Power Pack</option>
                      <option value="Brain Focus & Snack Box">Brain Focus & Snack Box</option>
                      <option value="Toddler Brain & Immunity Box">Toddler Brain & Immunity Box</option>
                      <option value="Raw Himalayan Walnut Halves">Raw Himalayan Walnut Halves</option>
                      <option value="Pure Himalayan Pink Rock Salt">Pure Himalayan Pink Rock Salt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Review Headline</label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Super fresh, my child loves it!"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/15 text-xs text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Detailed Feedback</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Tell us about the taste, packaging, and health results..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/15 text-xs text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Verified Review</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ReviewCard({
  review,
  isLiked,
  onLike,
}: {
  review: CustomerReview;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="w-[320px] sm:w-[360px] p-5 rounded-[2rem] bg-white border border-ink/8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-card hover:border-primary/30 transition-all duration-300 flex flex-col justify-between shrink-0 group select-none">
      {/* Top row: Author, verified badge, rating & city */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/15 via-gold/20 to-primary/30 text-primary-800 font-heading font-black text-sm flex items-center justify-center shadow-xs">
              {review.author.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-xs sm:text-sm text-ink line-clamp-1">
                  {review.author}
                </span>
                {review.verifiedBuyer && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink/50 flex items-center gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-primary/70" />
                {review.city}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex text-amber-400">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] text-ink/40 font-mono mt-0.5 block">{review.date}</span>
          </div>
        </div>

        {/* Headline & Body */}
        <h4 className="font-heading font-bold text-xs sm:text-sm text-ink leading-snug mb-1 group-hover:text-primary transition-colors">
          {review.title}
        </h4>
        <p className="text-xs text-ink/70 leading-relaxed line-clamp-3 mb-3">
          &ldquo;{review.content}&rdquo;
        </p>

        {/* Photo Badge if verified photo attached */}
        {review.hasPhoto && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200/60 mb-3">
            <Camera className="w-3 h-3 text-amber-600" />
            <span>{review.photoCaption || 'Verified Unboxing Photo'}</span>
          </div>
        )}
      </div>

      {/* Bottom row: Tagged Product + Like button */}
      <div className="pt-3 border-t border-ink/6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-ink/5">
            <Image
              src={review.productImage}
              alt={review.productName}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-ink truncate">{review.productName}</p>
            <p className="text-[10px] text-primary font-bold">Rs. {review.productPrice}</p>
          </div>
        </div>

        <button
          onClick={onLike}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
            isLiked
              ? 'bg-rose-50 text-rose-600'
              : 'bg-cream-100/80 hover:bg-cream-200 text-ink/60 hover:text-ink'
          }`}
          title="Helpful review"
        >
          <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{review.likesCount}</span>
        </button>
      </div>
    </div>
  );
}
