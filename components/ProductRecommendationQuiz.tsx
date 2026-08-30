'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Baby,
  Users,
  Dumbbell,
  ChefHat,
  Gift,
  Compass,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Heart,
  X,
  Star,
  Zap,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { products } from '@/lib/data/products';

interface QuizPersona {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  accent: string;
  recommendedSlugs: string[];
  reason: string;
}

const PERSONAS: QuizPersona[] = [
  {
    id: 'baby',
    title: 'Baby / Child Weaning',
    subtitle: '0% sugar, pediatrician-grade first solids, ragi & dates',
    icon: Baby,
    accent: 'from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-300',
    recommendedSlugs: [
      'date-powder-natural-sweetener',
      'sprouted-ragi-porridge-mix',
      'sweet-potato-powder',
      'organic-apple-powder',
    ],
    reason: 'Gentle on infant digestive systems with zero preservatives, synthetic fillers, or added cane sugar.',
  },
  {
    id: 'family',
    title: 'Family Daily Wellness',
    subtitle: 'Immunity honey, crunchy nuts & everyday kitchen goodness',
    icon: Users,
    accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 border-emerald-300',
    recommendedSlugs: [
      'wild-mustang-raw-honey',
      'chia-seeds-high-fiber',
      'almonds-california-jumbo',
      'immunity-shield-superfood-mix',
    ],
    reason: 'Rich in bio-available polyphenols, raw pollen, and essential micronutrients for the entire household.',
  },
  {
    id: 'fitness',
    title: 'Fitness & Stamina',
    subtitle: 'Natural nitric oxide, pre-workout pumps & plant recovery',
    icon: Dumbbell,
    accent: 'from-rose-500/20 to-red-500/20 text-rose-600 border-rose-300',
    recommendedSlugs: [
      'beetroot-nitric-oxide-powder',
      'moringa-leaf-powder-organic',
      'raw-himalayan-walnuts-jumla',
      'spinach-supergreen-powder',
    ],
    reason: 'Boosts natural cellular oxygenation, clean stamina, and anti-inflammatory recovery without caffeine crashes.',
  },
  {
    id: 'cooking',
    title: 'Healthy Cooking & Baking',
    subtitle: 'Natural date sweeteners, mountain turmeric & pure spices',
    icon: ChefHat,
    accent: 'from-yellow-500/20 to-amber-500/20 text-yellow-700 border-yellow-300',
    recommendedSlugs: [
      'date-powder-natural-sweetener',
      'turmeric-high-curcumin-powder',
      'ginger-root-powder-nepal',
      'wild-mustang-raw-honey',
    ],
    reason: '100% natural, unbleached mountain harvest packed with deep aroma, flavor, and high active curcuminoids.',
  },
  {
    id: 'gift',
    title: 'Gifts & Festive Combos',
    subtitle: 'Curated mountain gift boxes & pregnancy care hampers',
    icon: Gift,
    accent: 'from-purple-500/20 to-indigo-500/20 text-purple-600 border-purple-300',
    recommendedSlugs: [
      'wild-mustang-raw-honey',
      'almonds-california-jumbo',
      'raw-himalayan-walnuts-jumla',
      'date-powder-natural-sweetener',
    ],
    reason: 'Elegantly packaged artisanal Himalayan gift hampers that convey genuine care, health, and luxury.',
  },
  {
    id: 'first-time',
    title: 'First-Time Superfood Buyer',
    subtitle: 'Our all-time top bestsellers to start your journey',
    icon: Compass,
    accent: 'from-blue-500/20 to-cyan-500/20 text-blue-600 border-blue-300',
    recommendedSlugs: [
      'wild-mustang-raw-honey',
      'date-powder-natural-sweetener',
      'beetroot-nitric-oxide-powder',
      'chia-seeds-high-fiber',
    ],
    reason: 'The foundational starter kit loved by over 25,000+ happy homes across Kathmandu, Pokhara, and Nepal.',
  },
];

const DIETARY_GOALS = [
  { id: 'all', label: 'All Health Goals', icon: Sparkles },
  { id: 'immunity', label: 'Immunity & Energy', icon: Zap },
  { id: 'zero-sugar', label: '0% Refined Sugar', icon: Heart },
  { id: 'pediatric', label: 'Pediatric Grade', icon: Baby },
];

export default function ProductRecommendationQuiz({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string>('all');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona);

  // Get matching products
  const matchedProducts = currentPersona
    ? currentPersona.recommendedSlugs
        .map((slug) => products.find((p) => p.slug === slug || p.id === slug))
        .filter(Boolean)
    : [];

  const handleAddToCart = (product: any) => {
    addItem(product.id, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const handleReset = () => {
    setSelectedPersona(null);
    setSelectedGoal('all');
  };

  return (
    <div className="w-full">
      {/* Quiz Container */}
      <div className="rounded-3xl bg-gradient-to-br from-cream-50 via-white to-primary-50/30 border border-primary/15 p-5 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-100/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary/10 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> 30-Second Superfood Matcher
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-ink">
              Find Your Perfect Himalayan Match
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-xl">
              Answer 1 quick question to discover the freshest pure dehydrated superfoods for your family.
            </p>
          </div>

          {selectedPersona && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-sand-300 text-xs font-semibold text-ink-muted hover:text-primary hover:border-primary transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restart Quiz
            </button>
          )}
        </div>

        {/* STEP 1: What are you looking for? */}
        {!selectedPersona ? (
          <div>
            <h3 className="text-sm sm:text-base font-bold text-ink mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">1</span>
              What are you looking for today?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {PERSONAS.map((persona) => {
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona.id)}
                    className="flex flex-col text-left p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 hover:border-primary hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${persona.accent} shrink-0 transition-transform group-hover:scale-110`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <h4 className="font-heading font-bold text-ink text-sm sm:text-base group-hover:text-primary transition-colors">
                        {persona.title}
                      </h4>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {persona.subtitle}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View Recommended Packs <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* STEP 2 & RESULTS: Recommended Products */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Active Persona Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className={`flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br ${currentPersona?.accent}`}>
                  {currentPersona && <currentPersona.icon className="w-5 h-5" />}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-ink text-base sm:text-lg">
                      {currentPersona?.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold">
                      Match Found 🎯
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5 max-w-xl">
                    {currentPersona?.reason}
                  </p>
                </div>
              </div>

              {/* Dietary Filter Pills */}
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {DIETARY_GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedGoal === goal.id
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-white text-ink-muted hover:text-ink border border-sand-200'
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {matchedProducts.map((product: any, idx: number) => {
                const isAdded = addedItem === product.id;
                return (
                  <div
                    key={product.id || idx}
                    className="rounded-2xl bg-white border border-sand-200 p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-lg hover:border-primary/40 transition-all group"
                  >
                    <div>
                      {/* Product Thumbnail & Badges */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-sand-100 mb-3">
                        <Image
                          src={product.image || product.images?.[0] || '/products/superfood-mix.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 backdrop-blur-xs text-white text-[10px] font-bold">
                          98% Match
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-ink text-xs sm:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-ink-muted line-clamp-2 mt-1">
                        {product.tagline || product.description || '100% natural pure mountain harvest.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold">Price</p>
                        <p className="font-heading font-bold text-primary text-sm sm:text-base">
                          Rs. {Number(product.price).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-primary hover:bg-primary-600 text-white shadow-xs active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>Added ✓</>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
              <p>🚚 Free valley delivery on orders over Rs. 10,000. 100% Pure Himalayan Guarantee.</p>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link
                  href="/products"
                  className="w-full sm:w-auto text-center px-4 py-2 rounded-xl border border-sand-300 hover:border-primary text-xs font-bold text-ink hover:text-primary transition-colors"
                >
                  Browse Full Catalog
                </Link>
                <button
                  onClick={() => openDrawer()}
                  className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-ink hover:bg-ink/90 text-xs font-bold text-white transition-colors"
                >
                  View Cart & Checkout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
