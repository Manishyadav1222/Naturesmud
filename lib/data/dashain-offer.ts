export const DASHAIN_OFFER_CONFIG = {
  title: 'Dashain Blessings & Health',
  subtitle: 'Bada Dashain 2083 Maha Festival Offer — Pure Himalayan Superfoods',
  badge: '🇳🇵 DASHAIN MAHA OFFER · VALID TILL DASHAIN END',
  couponCode: 'DASHAIN',
  discountPercent: 10,
  freeDeliveryThreshold: 3000,
  freePinkSaltThreshold: 5000,
  posterImage: '/images/posters/dashain-offer-poster.jpg',
  startDate: '2026-10-01T00:00:00+05:45',
  // Dashain 2083 (2026) concludes after Kojagrat Purnima; keep valid through Dashain end
  endDate: '2026-11-05T23:59:59+05:45',
  endDateLabel: 'Valid Till Dashain End (Kojagrat Purnima)',
  freeGiftProduct: {
    id: 'free-dashain-pink-salt',
    slug: 'himalayan-pink-salt',
    name: 'FREE GIFT: Himalayan Pink Salt (200 GM)',
    weight: '200 GM',
    image: '/products/pink-salt.jpg',
    originalPrice: 250,
    price: 0,
  },
  perks: [
    {
      id: 'perk-free-delivery',
      badge: 'FREE DELIVERY > 3000',
      title: 'Free Delivery Over Rs. 3,000',
      description: '100% Free express doorstep delivery across Kathmandu Valley & all 77 districts of Nepal on orders above Rs. 3,000.',
      highlight: 'FREE DELIVERY > 3000',
    },
    {
      id: 'perk-free-pink-salt',
      badge: 'EXCLUSIVE GIFT > 5000',
      title: 'Free Delivery + Free Pink Salt Over Rs. 5,000',
      description: 'Get Free Delivery PLUS a complimentary 200g jar of pure Himalayan Pink Salt (worth Rs. 250) on orders of Rs. 5,000+!',
      highlight: 'FREE PINK SALT ON 5000+',
    },
  ],
};

export function isDashainOfferActive(now: Date = new Date()): boolean {
  const endMs = new Date(DASHAIN_OFFER_CONFIG.endDate).getTime();
  return Number.isNaN(endMs) ? true : now.getTime() <= endMs;
}

export function getDashainDiscountedPrice(price: number): number {
  const clean = Number(price) || 0;
  return clean > 0 ? clean : 0;
}

export function getDashainCountdown(now: Date = new Date()): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const endMs = new Date(DASHAIN_OFFER_CONFIG.endDate).getTime();
  const diff = Math.max(0, endMs - now.getTime());
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isExpired: false };
}
