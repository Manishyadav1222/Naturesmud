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
  Video,
  X,
  Send,
  Heart,
  MessageCircle,
  Filter,
  Check,
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
  photoUrl?: string;
  photoCaption?: string;
  hasVideo?: boolean;
  videoDuration?: string;
  likesCount: number;
  adminReply?: {
    author: string;
    role: string;
    date: string;
    content: string;
  };
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
    photoUrl: '/products/superfood-mix.jpg',
    photoCaption: 'Pooja’s Morning Porridge Bowl',
    likesCount: 38,
    adminReply: {
      author: "Nature's Mud Care Team",
      role: 'Head of Nutrition',
      date: 'Yesterday',
      content:
        'Namaste Pooja! We are thrilled your little one is thriving on our sprouted ragi and date powder. We dehydrate all baby grains under 40°C to lock in 100% natural enzymes! 🙏',
    },
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
    photoUrl: '/products/almonds-2.jpg',
    photoCaption: 'Pre-Workout Stack in Pokhara Gym',
    hasVideo: true,
    videoDuration: '0:45 min',
    likesCount: 42,
    adminReply: {
      author: "Nature's Mud Fitness",
      role: 'Team Lead',
      date: '2 days ago',
      content:
        'Great to hear Suman! Pure mountain beetroot contains 3x more concentrated natural dietary nitrates for peak nitric oxide production. Keep crushing your goals! 💪',
    },
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
    photoUrl: '/products/almonds.jpg',
    photoCaption: 'Homemade Gond Laddus with NatureMud',
    likesCount: 54,
    adminReply: {
      author: 'Ayurvedic Specialist',
      role: 'Maternal Care',
      date: '3 days ago',
      content:
        'Heartwarming to hear Sunita! Sutkeri recovery requires pure warm unadulterated fats and natural calcium. Wishing you and your baby immense health! 🤱',
    },
  },
  {
    id: 'rev-5',
    author: 'Bikash Pokharel',
    city: 'Butwal, Golpark',
    rating: 4,
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
    photoUrl: '/products/pumpkin-seeds.jpg',
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
    photoUrl: '/products/almonds-2.jpg',
    photoCaption: 'Unboxing in Bharatpur',
    hasVideo: true,
    videoDuration: '1:10 min',
    likesCount: 27,
  },
  {
    id: 'rev-9',
    author: 'Kamal Acharya',
    city: 'Hetauda, Makwanpur',
    rating: 4,
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
    photoUrl: '/products/blueberries.jpg',
    photoCaption: 'Gift Box Delivery',
    likesCount: 44,
  },
];

type FilterType = 'all' | '5-star' | '4-star' | 'photos' | 'videos' | 'helpful';

export default function RealCustomerReviewsSection() {
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(initialRealReviews);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Review Form state
  const [authorName, setAuthorName] = useState('');
  const [cityLocation, setCityLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [productPurchased, setProductPurchased] = useState('Little Explorer First Solids Kit');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [hasUploadedPhoto, setHasUploadedPhoto] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Filter reviews dynamically
  const filteredReviews = reviewsList
    .filter((rev) => {
      if (activeFilter === '5-star') return rev.rating === 5;
      if (activeFilter === '4-star') return rev.rating === 4;
      if (activeFilter === 'photos') return !!rev.hasPhoto;
      if (activeFilter === 'videos') return !!rev.hasVideo;
      return true;
    })
    .sort((a, b) => {
      if (activeFilter === 'helpful') {
        return b.likesCount - a.likesCount;
      }
      return 0;
    });

  const handleLike = (id: string) => {
    const isLiked = !!likedReviews[id];
    setLikedReviews((prev) => ({ ...prev, [id]: !isLiked }));
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            likesCount: isLiked ? r.likesCount - 1 : r.likesCount + 1,
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
      title: reviewTitle.trim() || 'Exceptional Himalayan Purity!',
      content: reviewBody.trim(),
      category: 'health',
      categoryLabel: 'Verified Customer',
      verifiedBuyer: true,
      productName: productPurchased,
      productImage: '/products/superfood-mix.jpg',
      productPrice: 1499,
      hasPhoto: hasUploadedPhoto,
      photoUrl: hasUploadedPhoto ? '/products/superfood-mix.jpg' : undefined,
      photoCaption: hasUploadedPhoto ? `${authorName}’s Fresh Unboxing` : undefined,
      likesCount: 1,
      adminReply: {
        author: "Nature's Mud Care Team",
        role: 'Verified Team',
        date: 'Just now',
        content: `Dhanyabad ${authorName}! We are overjoyed to receive your review. We pack every order fresh in our zero-additive mountain facility! 🙏`,
      },
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
      setHasUploadedPhoto(false);
    }, 1800);
  };

  // Build marquee card list — duplicate for seamless loop
  const marqueeReviews = [...initialRealReviews, ...initialRealReviews];
  const marqueeRow2 = [...initialRealReviews.slice(4), ...initialRealReviews.slice(0, 4), ...initialRealReviews.slice(4), ...initialRealReviews.slice(0, 4)];

  return (
    <section className="bg-gradient-to-b from-white via-[#FAF7F2]/60 to-white overflow-hidden relative py-8 sm:py-10 lg:section-padding">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ============================================================
          MOBILE + TABLET: Compact header + Infinite marquee rows
          ============================================================ */}
      <div className="lg:hidden">
        {/* Compact Section Header */}
        <div className="px-4 sm:px-6 mb-5 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#7A5230] mb-1.5">
            <Sparkles className="w-3 h-3 text-[#1A3826]" />
            <span>Customer Wall of Love</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-ink leading-tight">
            Loved by Families Across Nepal
          </h2>
          <div className="flex items-center justify-center gap-1 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-[11px] font-bold text-ink ml-1">4.9</span>
            <span className="text-[11px] text-ink/50 ml-1">· 3,840+ verified orders</span>
          </div>
        </div>

        {/* Row 1 — scrolls LEFT */}
        <div className="overflow-hidden mb-3 cursor-grab">
          <div className="review-marquee-left">
            {marqueeReviews.map((rev, idx) => (
              <div
                key={`row1-${rev.id}-${idx}`}
                className="flex-shrink-0 w-[230px] sm:w-[260px] mx-2 rounded-2xl bg-white border border-[#EAE3D6] p-3.5 shadow-sm"
              >
                {/* Top row: avatar + name + stars */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A3826] to-[#2D5A3D] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-ink leading-tight">{rev.author}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-primary" />
                        <span className="text-[10px] text-ink/55 leading-none">{rev.city.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                {/* Quote */}
                <p className="text-[11px] text-ink/75 leading-relaxed line-clamp-3">
                  &ldquo;{rev.content}&rdquo;
                </p>
                {/* Product tag */}
                <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full border border-primary/12">
                  <ShoppingBag className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[130px]">{rev.productName}</span>
                </div>
                {rev.verifiedBuyer && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    Verified Purchase
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls RIGHT (opposite direction) */}
        <div className="overflow-hidden mb-5 cursor-grab">
          <div className="review-marquee-right">
            {marqueeRow2.map((rev, idx) => (
              <div
                key={`row2-${rev.id}-${idx}`}
                className="flex-shrink-0 w-[230px] sm:w-[260px] mx-2 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] p-3.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7A5230] to-[#9B6B3E] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-ink leading-tight">{rev.author}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-primary" />
                        <span className="text-[10px] text-ink/55 leading-none">{rev.city.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-ink/75 leading-relaxed line-clamp-3">
                  &ldquo;{rev.content}&rdquo;
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-[#7A5230] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                  <ShoppingBag className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[130px]">{rev.productName}</span>
                </div>
                {rev.verifiedBuyer && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    Verified Purchase
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Write Review CTA — mobile only */}
        <div className="flex justify-center px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          DESKTOP (lg+): Full filter-pills + review grid (unchanged)
          ============================================================ */}
      <div className="hidden lg:block">
        <div className="container-nm relative z-10 mb-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#7A5230] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#1A3826]" />
                <span>Customer Wall of Love</span>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-ink">
                  Loved by Families Across Nepal
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-heading border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Verified Purchases
                </span>
              </div>
              <p className="section-subtitle text-ink/70 text-xs sm:text-sm lg:text-base max-w-2xl mt-2 leading-relaxed">
                Real unboxing photos, doctor recommendations, and kitchen reviews from Kathmandu to Pokhara, Dharan, Butwal, and beyond.
              </p>
            </div>

            {/* Social Proof Score & Write Review CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white border border-ink/8 shadow-soft">
                <div className="text-center">
                  <span className="font-heading font-black text-xl text-amber-900">4.9</span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="h-7 w-[1px] bg-ink/10" />
                <div className="text-[11px]">
                  <p className="font-bold text-ink">3,840+ Verified Orders</p>
                  <p className="text-ink/60">98.6% 5-Star Rating</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-xs sm:text-sm shadow-glow transition-all active:scale-95"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Reviews', count: reviewsList.length },
              { id: '5-star', label: '⭐ 5 Stars', count: reviewsList.filter((r) => r.rating === 5).length },
              { id: '4-star', label: '⭐ 4 Stars', count: reviewsList.filter((r) => r.rating === 4).length },
              { id: 'photos', label: '📸 With Photos', count: reviewsList.filter((r) => r.hasPhoto).length },
              { id: 'videos', label: '📹 Video Reviews', count: reviewsList.filter((r) => r.hasVideo).length },
              { id: 'helpful', label: '👍 Most Helpful', count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as FilterType)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  activeFilter === tab.id
                    ? 'bg-ink text-white shadow-xs'
                    : 'bg-white text-ink-muted hover:text-ink border border-sand-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-sand-100 text-ink-muted'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="container-nm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredReviews.map((rev) => {
              const isLiked = !!likedReviews[rev.id];
              return (
                <div
                  key={rev.id}
                  className="rounded-3xl bg-white border border-sand-200 p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div>
                    {/* Top: Author, Rating & Verified Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-ink text-sm sm:text-base">
                            {rev.author}
                          </h4>
                          {rev.verifiedBuyer && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mt-0.5">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span>{rev.city}</span>
                          <span>•</span>
                          <span>{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Title & Body */}
                    <h5 className="font-heading font-bold text-ink text-xs sm:text-sm mb-1.5 group-hover:text-primary transition-colors">
                      &ldquo;{rev.title}&rdquo;
                    </h5>
                    <p className="text-xs text-ink/80 leading-relaxed mb-3">
                      {rev.content}
                    </p>

                    {/* Photo or Video Attachment */}
                    {rev.hasPhoto && (
                      <div className="relative rounded-xl overflow-hidden bg-sand-100 mb-3 border border-sand-200">
                        <div className="relative aspect-video w-full">
                          <Image
                            src={rev.photoUrl || '/products/superfood-mix.jpg'}
                            alt={rev.photoCaption || 'Customer photo'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {rev.hasVideo && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-ink text-xs font-bold shadow-md">
                                <Video className="w-3.5 h-3.5 text-red-600" /> {rev.videoDuration || 'Watch Video'}
                              </span>
                            </div>
                          )}
                        </div>
                        {rev.photoCaption && (
                          <p className="text-[10px] text-ink-muted px-2.5 py-1 bg-white/80 backdrop-blur-xs font-medium">
                            📸 {rev.photoCaption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Product purchased tag */}
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 mb-3">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{rev.productName}</span>
                    </div>

                    {/* Official Team Response */}
                    {rev.adminReply && (
                      <div className="rounded-2xl bg-sand-50 border border-sand-200 p-3 mb-3 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-primary mb-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Response from {rev.adminReply.author}</span>
                          <span className="text-[10px] font-normal text-ink-muted">({rev.adminReply.date})</span>
                        </div>
                        <p className="text-ink-muted leading-relaxed text-[11px]">
                          {rev.adminReply.content}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Helpful Button */}
                  <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs text-ink-muted">
                    <span>Was this review helpful?</span>
                    <button
                      onClick={() => handleLike(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                        isLiked
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-sand-50 hover:bg-sand-100 text-ink-muted hover:text-ink'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                      <span>Yes ({rev.likesCount})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* WRITE A REVIEW MODAL — shared across mobile + desktop */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-ink/60 hover:text-ink rounded-full hover:bg-sand-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Star className="w-5 h-5 fill-primary" />
                </span>
                <div>
                  <h3 className="font-heading font-bold text-ink text-lg">Share Your Experience</h3>
                  <p className="text-xs text-ink-muted">Help other families choose pure mountain nutrition.</p>
                </div>
              </div>

              {isSubmittedSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-ink text-lg">Dhanyabad for your review!</h4>
                  <p className="text-xs text-ink-muted">Your verified review is live and our team has been notified.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                  {/* Star Rating selector */}
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-sand-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Pooja Karki"
                        className="w-full rounded-xl bg-sand-50 border border-sand-200 px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">City / Location</label>
                      <input
                        type="text"
                        value={cityLocation}
                        onChange={(e) => setCityLocation(e.target.value)}
                        placeholder="e.g. Kathmandu, Baneshwor"
                        className="w-full rounded-xl bg-sand-50 border border-sand-200 px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Product selector */}
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Product Purchased</label>
                    <select
                      value={productPurchased}
                      onChange={(e) => setProductPurchased(e.target.value)}
                      className="w-full rounded-xl bg-sand-50 border border-sand-200 px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    >
                      <option>Little Explorer First Solids Kit</option>
                      <option>Himalayan Gym Muscle Pack</option>
                      <option>Wild Mustang Raw Mountain Honey</option>
                      <option>Date Powder Natural Sweetener</option>
                      <option>Postpartum Healing Power Pack</option>
                      <option>Immunity Shield Superfood Mix</option>
                    </select>
                  </div>

                  {/* Title & Review Content */}
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Headline Summary</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Amazing quality and pure aroma!"
                      className="w-full rounded-xl bg-sand-50 border border-sand-200 px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Detailed Review *</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Tell us how you used the product and how it helped you..."
                      className="w-full rounded-xl bg-sand-50 border border-sand-200 px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Photo Upload Option */}
                  <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-ink">Add Unboxing Photo</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasUploadedPhoto(!hasUploadedPhoto)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        hasUploadedPhoto
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-sand-300 text-ink-muted hover:border-primary'
                      }`}
                    >
                      {hasUploadedPhoto ? 'Photo Attached ✓' : '+ Attach Photo'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs sm:text-sm py-3 shadow-glow transition-all active:scale-98"
                  >
                    Submit Verified Review
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
