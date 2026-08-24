export interface OfferItem {
  productId: string;
  name: string;
  weight: string;
  image: string;
  price: number;
}

export interface FestivalOffer {
  id: string;
  title: string;
  subtitle: string;
  festivalName: string;
  badge: string;
  categoryIcon?: string;
  categoryLabel?: string;
  discountPercentage: number;
  originalPrice: number;
  offerPrice: number;
  couponCode: string;
  endsAt: string;
  items: OfferItem[];
  tag: string;
  highlights: string[];
  isFestival: boolean;
  isActive?: boolean;
  themeColor?: 'gold' | 'emerald' | 'amber' | 'crimson' | 'purple' | 'red';
}

export const initialFestivalOffers: FestivalOffer[] = [
  {
    id: 'offer-gym',
    title: 'Himalayan Gym & Workout Muscle Pack',
    subtitle: 'High-Protein Raw Walnuts, Zinc-Rich Pumpkin Seeds & Chia Omega-3',
    festivalName: '🏋️ Workout & Muscle Recovery Combo',
    badge: '32% OFF · High Plant Protein',
    categoryIcon: '🏋️‍♂️',
    categoryLabel: 'Gym & Workout',
    discountPercentage: 32,
    originalPrice: 2598,
    offerPrice: 1750,
    couponCode: 'GYMPOWER10',
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    tag: 'Athletes #1 Pick',
    themeColor: 'emerald',
    items: [
      {
        productId: '1',
        name: 'Raw Himalayan Walnut Halves',
        weight: '100g',
        image: '/products/almonds-2.jpg',
        price: 1299,
      },
      {
        productId: '21',
        name: 'Raw Organic Pumpkin Seeds',
        weight: '100g',
        image: '/products/pumpkin-seeds.jpg',
        price: 549,
      },
      {
        productId: '4',
        name: 'Organic Chia Seeds (Black)',
        weight: '100g',
        image: '/products/chia-seeds.jpg',
        price: 750,
      },
    ],
    highlights: [
      'High Plant Protein & Zinc for Muscle Repair',
      'Plant Omega-3 to Reduce Joint Inflammation',
      'Clean Pre/Post-Workout Nutrition (Zero Sugar)',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-morning',
    title: 'Daily Morning Diet & Breakfast Cleanse Kit',
    subtitle: 'Metabolism Kickstart with Raw Mustang Honey, Chia Seeds & Pink Salt',
    festivalName: '🌅 Morning Diet & Cleanse Combo',
    badge: '28% OFF · Clean Metabolism',
    categoryIcon: '🌅',
    categoryLabel: 'Morning Diet',
    discountPercentage: 28,
    originalPrice: 2250,
    offerPrice: 1599,
    couponCode: 'MORNING10',
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    tag: 'Morning Ritual',
    themeColor: 'amber',
    items: [
      {
        productId: '6',
        name: 'Raw Wild Mustang Forest Honey',
        weight: '100g',
        image: '/products/coconut-oil.jpg',
        price: 850,
      },
      {
        productId: '4',
        name: 'Organic Chia Seeds (Black)',
        weight: '100g',
        image: '/products/chia-seeds.jpg',
        price: 750,
      },
      {
        productId: '23',
        name: 'Pure Himalayan Pink Rock Salt',
        weight: '100g',
        image: '/products/pink-salt.jpg',
        price: 650,
      },
    ],
    highlights: [
      'Warm Water Morning Detox Electrolytes',
      'Gut Microbiome & Smooth Digestion Support',
      'Sustained Natural Energy Without Caffeine Spikes',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-health',
    title: 'Maha Daily Health & Immunity Shield',
    subtitle: '3-in-1 Himalayan Superfood Mix, Roasted Almonds & Beetroot Powder',
    festivalName: '🧘 Total Health & Immunity Combo',
    badge: '30% OFF · Complete Wellness',
    categoryIcon: '🧘',
    categoryLabel: 'Health & Vitality',
    discountPercentage: 30,
    originalPrice: 2169,
    offerPrice: 1499,
    couponCode: 'HEALTH10',
    endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
    tag: 'Family Favorite',
    themeColor: 'gold',
    items: [
      {
        productId: '20',
        name: 'Immunity Shield Superfood Mix',
        weight: '100g',
        image: '/products/superfood-mix.jpg',
        price: 999,
      },
      {
        productId: '13',
        name: 'Premium Roasted Almonds',
        weight: '100g',
        image: '/products/almonds.jpg',
        price: 750,
      },
      {
        productId: '15',
        name: 'Organic Beetroot Powder',
        weight: '100g',
        image: '/products/beetroot-powder-100g.jpg',
        price: 420,
      },
    ],
    highlights: [
      'Full Daily Spectrum of Minerals & Vitamins',
      'Blood Flow, Stamina & Heart Health Support',
      'Handpicked Organic Sourcing from Nepal Smallholders',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-focus',
    title: 'Brain Focus & Clean Energy Snack Box',
    subtitle: 'Sun-Dried Blueberries, Tart Cranberries & Raw Pumpkin Seeds',
    festivalName: '⚡ Student & Work Focus Combo',
    badge: '26% OFF · Brain Food',
    categoryIcon: '⚡',
    categoryLabel: 'Focus & Study',
    discountPercentage: 26,
    originalPrice: 2178,
    offerPrice: 1599,
    couponCode: 'FOCUS10',
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),
    tag: 'Zero Crash Snacking',
    themeColor: 'crimson',
    items: [
      {
        productId: '14',
        name: 'Antioxidant Dried Blueberries',
        weight: '100g',
        image: '/products/dried-blueberries-100g.jpg',
        price: 980,
      },
      {
        productId: '19',
        name: 'Tart Dried Cranberries',
        weight: '100g',
        image: '/products/cranberries.jpg',
        price: 649,
      },
      {
        productId: '21',
        name: 'Raw Organic Pumpkin Seeds',
        weight: '100g',
        image: '/products/pumpkin-seeds.jpg',
        price: 549,
      },
    ],
    highlights: [
      'High Anthocyanins for Cognitive Speed & Eye Strain',
      'Replaces Processed Sweets & Junk Snacks',
      'Crunchy, Nutritious & Rich in Healthy Lipids',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-festive',
    title: 'Dashain & Tihar Maha Utsav Deluxe Combo',
    subtitle: 'Himalayan Walnuts, Roasted Almonds & Wild Forest Mustang Honey',
    festivalName: '🇳🇵 Himalayan Festival Dhamaka Offer',
    badge: '35% OFF · Festive Special',
    categoryIcon: '🇳🇵',
    categoryLabel: 'Festival Dhamaka',
    discountPercentage: 35,
    originalPrice: 2899,
    offerPrice: 1890,
    couponCode: 'FESTIVE35',
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    tag: 'Limited Festive Stock',
    themeColor: 'gold',
    items: [
      {
        productId: '1',
        name: 'Raw Himalayan Walnut Halves',
        weight: '100g',
        image: '/products/almonds-2.jpg',
        price: 1299,
      },
      {
        productId: '13',
        name: 'Premium Roasted Almonds',
        weight: '100g',
        image: '/products/almonds.jpg',
        price: 750,
      },
      {
        productId: '6',
        name: 'Raw Wild Mustang Forest Honey',
        weight: '100g',
        image: '/products/coconut-oil.jpg',
        price: 850,
      },
    ],
    highlights: [
      'Free Express Delivery Across Nepal',
      'Special Festive Gift Packaging',
      '100% Natural Himalayan Wholesomeness',
    ],
    isFestival: true,
    isActive: true,
  },
  {
    id: 'offer-tihar-gift',
    title: 'Tihar Special Bhaitika Himalayan Gift Box',
    subtitle: 'Raw Mountain Honey + Organic Walnuts + Roasted Almonds in Festive Gift Box',
    festivalName: '✨ Tihar Bhaitika Gift Box Campaign',
    badge: '30% OFF · Premium Gift Edition',
    categoryIcon: '🎁',
    categoryLabel: 'Tihar Gift Box',
    discountPercentage: 30,
    originalPrice: 2798,
    offerPrice: 1950,
    couponCode: 'TIHARGIFT',
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
    tag: 'Bhai Tihar Bestseller',
    themeColor: 'gold',
    items: [
      {
        productId: '6',
        name: 'Raw Wild Mustang Forest Honey',
        weight: '100g',
        image: '/products/coconut-oil.jpg',
        price: 850,
      },
      {
        productId: '1',
        name: 'Raw Himalayan Walnut Halves',
        weight: '100g',
        image: '/products/almonds-2.jpg',
        price: 1299,
      },
      {
        productId: '13',
        name: 'Premium Roasted Almonds',
        weight: '100g',
        image: '/products/almonds.jpg',
        price: 750,
      },
    ],
    highlights: [
      'Traditional Himalayan Wooden Gift Box Packaging',
      'Handwritten Personalized Blessing & Greeting Card',
      'Free Express Doorstep Delivery Across Nepal',
    ],
    isFestival: true,
    isActive: true,
  },
];
