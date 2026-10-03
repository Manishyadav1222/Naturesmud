'use client';

import { useState, useEffect } from 'react';
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
  glowColor: string;
  recommendedSlugs: string[];
  reason: string;
}

const PERSONAS: QuizPersona[] = [
  {
    id: 'baby',
    title: 'Baby / Child Weaning',
    subtitle: '0% added sugar, pure single-ingredient first solids, banana & dates',
    icon: Baby,
    accent: 'from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-300',
    glowColor: 'rgba(251,191,36,0.35)',
    recommendedSlugs: [
      'dates-powder',
      'banana-powder',
      'sweet-potato-powder',
      'carrot-powder',
    ],
    reason: 'Gentle single-ingredient whole food powders with zero preservatives, synthetic fillers, or added cane sugar.',
  },
  {
    id: 'family',
    title: 'Family Daily Wellness',
    subtitle: 'Mountain nuts, super seeds & everyday kitchen goodness',
    icon: Users,
    accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 border-emerald-300',
    glowColor: 'rgba(16,185,129,0.35)',
    recommendedSlugs: [
      'raw-himalayan-almonds',
      'chia-seeds',
      'roasted-cashewnuts',
      'superfood-trail-mix',
    ],
    reason: 'Rich in bio-available polyphenols, omega-3 fatty acids, and essential micronutrients for the entire household.',
  },
  {
    id: 'fitness',
    title: 'Fitness & Stamina',
    subtitle: 'Natural nitric oxide, pre-workout endurance & plant recovery',
    icon: Dumbbell,
    accent: 'from-rose-500/20 to-red-500/20 text-rose-600 border-rose-300',
    glowColor: 'rgba(244,63,94,0.35)',
    recommendedSlugs: [
      'beetroot-powder',
      'pure-mountain-himalayan-shilajit-resin',
      'pumpkin-seeds',
      'freeze-dried-avocado-powder',
    ],
    reason: 'Supports natural cellular oxygenation, clean stamina, and post-workout recovery without caffeine crashes.',
  },
  {
    id: 'cooking',
    title: 'Healthy Cooking & Baking',
    subtitle: 'Natural date sweeteners, cold-pressed oils & mineral salts',
    icon: ChefHat,
    accent: 'from-yellow-500/20 to-amber-500/20 text-yellow-700 border-yellow-300',
    glowColor: 'rgba(234,179,8,0.35)',
    recommendedSlugs: [
      'dates-powder',
      'virgin-coconut-oil',
      'himalayan-pink-salt',
      'pure-himalayan-black-salt-bire-noon',
    ],
    reason: '100% natural, unrefined mountain harvest packed with authentic aroma, trace minerals, and clean flavor.',
  },
  {
    id: 'gift',
    title: 'Gifts & Festive Combos',
    subtitle: 'Curated mountain dry fruits, berries & premium roasted nuts',
    icon: Gift,
    accent: 'from-purple-500/20 to-indigo-500/20 text-purple-600 border-purple-300',
    glowColor: 'rgba(139,92,246,0.35)',
    recommendedSlugs: [
      'dried-blueberries',
      'premium-pistachios',
      'dry-figs-anjeer',
      'dehydrated-mango',
    ],
    reason: 'Elegantly packaged artisanal Himalayan dry fruits and nuts that convey genuine care, health, and festive warmth.',
  },
  {
    id: 'first-time',
    title: 'First-Time Superfood Buyer',
    subtitle: 'Our all-time top bestsellers to start your journey',
    icon: Compass,
    accent: 'from-blue-500/20 to-cyan-500/20 text-blue-600 border-blue-300',
    glowColor: 'rgba(59,130,246,0.35)',
    recommendedSlugs: [
      'dates-powder',
      'beetroot-powder',
      'dehydrated-mango',
      'chia-seeds',
    ],
    reason: 'The foundational starter kit loved by over 25,000+ happy homes across Kathmandu, Pokhara, and Nepal.',
  },
];

const DIETARY_GOALS = [
  { id: 'all', label: 'All Health Goals', icon: Sparkles },
  { id: 'immunity', label: 'Immunity & Energy', icon: Zap },
  { id: 'zero-sugar', label: '0% Refined Sugar', icon: Heart },
  { id: 'pediatric', label: 'Baby-Friendly Pure', icon: Baby },
];

// Floating particle component
function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(134,88,50,0.5) 0%, transparent 70%)',
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 3 + delay,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

// Glowing orb background
function GlowOrb({ x, y, color, size }: { x: string; y: string; color: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

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
      {/* Inject keyframes for glow animation */}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 8px rgba(134,88,50,0.6), 0 0 20px rgba(134,88,50,0.3), 0 0 40px rgba(134,88,50,0.15); }
          50% { text-shadow: 0 0 15px rgba(134,88,50,0.9), 0 0 35px rgba(134,88,50,0.5), 0 0 60px rgba(134,88,50,0.25); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(134,88,50,0.3), 0 0 30px rgba(134,88,50,0.1), inset 0 0 15px rgba(134,88,50,0.05); }
          50% { box-shadow: 0 0 25px rgba(134,88,50,0.5), 0 0 50px rgba(134,88,50,0.2), inset 0 0 25px rgba(134,88,50,0.08); }
        }
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .glow-text {
          animation: glowPulse 2.5s ease-in-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #865832 0%, #f5c842 30%, #865832 50%, #f5c842 80%, #865832 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .float-card {
          animation: floatUpDown 4s ease-in-out infinite;
        }
        .border-glow {
          animation: borderGlow 2.5s ease-in-out infinite;
        }
        .persona-card-hover:hover {
          box-shadow: 0 0 20px var(--card-glow), 0 8px 32px rgba(0,0,0,0.12);
          transform: translateY(-4px) scale(1.02);
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-line::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(134,88,50,0.8), transparent);
          animation: scanLine 2s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Quiz Container */}
      <motion.div
        className="rounded-3xl border relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fdf8f3 0%, #ffffff 40%, #f9f5f0 70%, #fef9f0 100%)',
          borderColor: 'rgba(134,88,50,0.2)',
        }}
        animate={{
          boxShadow: [
            '0 0 30px rgba(134,88,50,0.15), 0 20px 60px rgba(0,0,0,0.08)',
            '0 0 50px rgba(134,88,50,0.25), 0 20px 60px rgba(0,0,0,0.1)',
            '0 0 30px rgba(134,88,50,0.15), 0 20px 60px rgba(0,0,0,0.08)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Floating glow orbs */}
        <GlowOrb x="-5%" y="-10%" color="rgba(134,88,50,0.2)" size={300} />
        <GlowOrb x="70%" y="60%" color="rgba(245,200,66,0.15)" size={250} />
        <GlowOrb x="80%" y="-5%" color="rgba(134,88,50,0.12)" size={200} />

        {/* Floating particles */}
        <FloatingParticle delay={0} x="10%" y="20%" size={6} />
        <FloatingParticle delay={0.7} x="85%" y="15%" size={4} />
        <FloatingParticle delay={1.4} x="50%" y="80%" size={5} />
        <FloatingParticle delay={2} x="25%" y="70%" size={3} />
        <FloatingParticle delay={2.5} x="75%" y="50%" size={4} />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(134,88,50,1) 1px, transparent 1px), linear-gradient(90deg, rgba(134,88,50,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative p-5 sm:p-8 lg:p-10">
          {/* ===== HEADER ===== */}
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6 mb-6" style={{ borderColor: 'rgba(134,88,50,0.12)' }}>
            <div>
              {/* 🔥 GLOWING BADGE */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 relative overflow-hidden cursor-default select-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,88,50,0.12) 0%, rgba(245,200,66,0.1) 100%)',
                  border: '1px solid rgba(134,88,50,0.35)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(134,88,50,0.3), 0 0 20px rgba(134,88,50,0.1)',
                    '0 0 20px rgba(134,88,50,0.5), 0 0 40px rgba(134,88,50,0.2)',
                    '0 0 10px rgba(134,88,50,0.3), 0 0 20px rgba(134,88,50,0.1)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Badge shimmer sweep */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                />
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: '#865832', filter: 'drop-shadow(0 0 4px rgba(134,88,50,0.8))' }} />
                </motion.div>
                <span
                  className="font-extrabold text-xs uppercase tracking-widest"
                  style={{
                    background: 'linear-gradient(90deg, #865832 0%, #d4a053 40%, #f5c842 60%, #865832 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer 2.5s linear infinite',
                    filter: 'drop-shadow(0 0 2px rgba(134,88,50,0.4))',
                  }}
                >
                  ⚡ 30-Second Superfood Matcher
                </span>
              </motion.div>

              {/* Main heading with glow */}
              <motion.h2
                className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold"
                style={{ color: '#1a1a1a' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Find Your{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #865832 0%, #d4a053 50%, #f5c842 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 8px rgba(134,88,50,0.4))',
                    animation: 'glowPulse 2.5s ease-in-out infinite',
                  }}
                >
                  Perfect
                </span>{' '}
                Himalayan Match
              </motion.h2>
              <motion.p
                className="text-xs sm:text-sm text-ink-muted mt-1.5 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                Answer 1 quick question to discover the freshest pure dehydrated superfoods for your family.
              </motion.p>
            </div>

            {selectedPersona && (
              <motion.button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(134,88,50,0.3)',
                  color: '#865832',
                  boxShadow: '0 0 10px rgba(134,88,50,0.15)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(134,88,50,0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Restart Quiz
              </motion.button>
            )}
          </div>

          {/* ===== STEP 1: Persona Selection ===== */}
          {!selectedPersona ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.h3
                className="text-sm sm:text-base font-bold mb-5 flex items-center gap-2"
                style={{ color: '#1a1a1a' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, #865832, #d4a053)',
                    boxShadow: '0 0 12px rgba(134,88,50,0.5)',
                  }}
                >
                  1
                </span>
                What are you looking for today?
              </motion.h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {PERSONAS.map((persona, i) => {
                  const Icon = persona.icon;
                  return (
                    <motion.button
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona.id)}
                      className="flex flex-col text-left p-4 sm:p-5 rounded-2xl relative overflow-hidden group"
                      style={{
                        background: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(134,88,50,0.12)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        // @ts-ignore
                        '--card-glow': persona.glowColor,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{
                        y: -5,
                        scale: 1.02,
                        boxShadow: `0 0 25px ${persona.glowColor}, 0 10px 40px rgba(0,0,0,0.1)`,
                        borderColor: 'rgba(134,88,50,0.4)',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Card inner glow on hover */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${persona.glowColor} 0%, transparent 70%)`,
                        }}
                      />

                      {/* Shimmer sweep */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                        style={{
                          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
                          transition: 'opacity 0.2s',
                        }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                      />

                      <div className="relative flex items-center gap-3 mb-2.5">
                        <motion.span
                          className={`flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${persona.accent} shrink-0`}
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          style={{
                            boxShadow: `0 4px 15px ${persona.glowColor}`,
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.span>
                        <h4 className="font-heading font-bold text-ink text-sm sm:text-base group-hover:text-primary transition-colors relative">
                          {persona.title}
                        </h4>
                      </div>
                      <p className="text-xs text-ink-muted leading-relaxed relative">
                        {persona.subtitle}
                      </p>
                      <motion.span
                        className="mt-3 inline-flex items-center gap-1 text-xs font-bold"
                        style={{ color: '#865832' }}
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 inline-flex items-center gap-1">
                          View Recommended Packs <ArrowRight className="w-3 h-3" />
                        </span>
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ===== STEP 2 & RESULTS ===== */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Active Persona Banner */}
              <motion.div
                className="p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,88,50,0.06) 0%, rgba(245,200,66,0.05) 100%)',
                  border: '1px solid rgba(134,88,50,0.2)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(134,88,50,0.2)',
                    '0 0 30px rgba(134,88,50,0.35)',
                    '0 0 15px rgba(134,88,50,0.2)',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                {/* Banner shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.25) 50%, transparent 65%)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />

                <div className="relative flex items-center gap-3.5">
                  <motion.span
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${currentPersona?.accent}`}
                    style={{
                      boxShadow: `0 0 20px ${currentPersona?.glowColor}`,
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentPersona && <currentPersona.icon className="w-5 h-5" />}
                  </motion.span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-ink text-base sm:text-lg">
                        {currentPersona?.title}
                      </h3>
                      <motion.span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-white"
                        style={{
                          background: 'linear-gradient(90deg, #865832, #d4a053)',
                          boxShadow: '0 0 12px rgba(134,88,50,0.5)',
                        }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🎯 Match Found
                      </motion.span>
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5 max-w-xl relative">
                      {currentPersona?.reason}
                    </p>
                  </div>
                </div>

                {/* Dietary Filter Pills */}
                <div className="relative flex flex-wrap gap-1.5 shrink-0">
                  {DIETARY_GOALS.map((goal) => (
                    <motion.button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all`}
                      style={
                        selectedGoal === goal.id
                          ? {
                              background: 'linear-gradient(90deg, #865832, #d4a053)',
                              color: '#fff',
                              boxShadow: '0 0 12px rgba(134,88,50,0.4)',
                            }
                          : {
                              background: 'rgba(255,255,255,0.8)',
                              color: '#6b7280',
                              border: '1px solid rgba(134,88,50,0.15)',
                            }
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {goal.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {matchedProducts.map((product: any, idx: number) => {
                  const isAdded = addedItem === product.id;
                  return (
                    <motion.div
                      key={product.id || idx}
                      className="rounded-2xl flex flex-col justify-between group relative overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid rgba(134,88,50,0.12)',
                        backdropFilter: 'blur(10px)',
                        padding: '14px 16px',
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{
                        y: -6,
                        boxShadow: '0 0 25px rgba(134,88,50,0.25), 0 15px 40px rgba(0,0,0,0.1)',
                        borderColor: 'rgba(134,88,50,0.4)',
                      }}
                    >
                      {/* Card hover glow */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle at 50% 0%, rgba(134,88,50,0.06) 0%, transparent 70%)',
                        }}
                      />

                      <div className="relative">
                        {/* Product Thumbnail */}
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3" style={{ background: 'rgba(134,88,50,0.05)' }}>
                          <Image
                            src={product.image || product.images?.[0] || '/products/superfood-mix.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Glow vignette on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(134,88,50,0.15) 100%)' }}
                          />
                          <motion.span
                            className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-white text-[10px] font-extrabold"
                            style={{
                              background: 'linear-gradient(90deg, #865832, #d4a053)',
                              boxShadow: '0 0 10px rgba(134,88,50,0.5)',
                            }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                          >
                            98% Match
                          </motion.span>
                        </div>

                        <h4 className="font-heading font-bold text-ink text-xs sm:text-sm line-clamp-1 group-hover:text-primary transition-colors relative">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-ink-muted line-clamp-2 mt-1 relative">
                          {product.tagline || product.description || '100% natural pure mountain harvest.'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 flex items-center justify-between gap-2 relative" style={{ borderTop: '1px solid rgba(134,88,50,0.08)' }}>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">Price</p>
                          <p className="font-heading font-extrabold text-sm sm:text-base" style={{ color: '#865832' }}>
                            Rs. {Number(product.price).toLocaleString()}
                          </p>
                        </div>

                        <motion.button
                          onClick={() => handleAddToCart(product)}
                          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all`}
                          style={
                            isAdded
                              ? {
                                  background: 'linear-gradient(90deg, #059669, #10b981)',
                                  color: '#fff',
                                  boxShadow: '0 0 15px rgba(5,150,105,0.4)',
                                }
                              : {
                                  background: 'linear-gradient(135deg, #865832, #d4a053)',
                                  color: '#fff',
                                  boxShadow: '0 0 12px rgba(134,88,50,0.35)',
                                }
                          }
                          whileHover={{ scale: 1.05, boxShadow: isAdded ? '0 0 20px rgba(5,150,105,0.5)' : '0 0 20px rgba(134,88,50,0.5)' }}
                          whileTap={{ scale: 0.92 }}
                        >
                          {isAdded ? (
                            <>Added ✓</>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" /> Add
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Action Footer */}
              <motion.div
                className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p>🚚 Free delivery on orders over Rs. 3,000. 100% Pure Himalayan Guarantee.</p>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link
                    href="/products"
                    className="w-full sm:w-auto text-center px-4 py-2 rounded-xl text-xs font-bold transition-all hover:shadow-md"
                    style={{
                      border: '1px solid rgba(134,88,50,0.25)',
                      color: '#865832',
                      background: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    Browse Full Catalog
                  </Link>
                  <motion.button
                    onClick={() => openDrawer()}
                    className="w-full sm:w-auto text-center px-4 py-2 rounded-xl text-xs font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #1a1a1a, #333)',
                      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
                    }}
                    whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    View Cart & Checkout
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
