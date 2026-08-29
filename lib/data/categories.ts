import { Category } from '@/lib/types';

export const categories: Category[] = [
  {
    id: 'c1',
    slug: 'dried-fruits',
    name: 'Dried Fruits',
    description: 'Naturally sweet sun-dried mango, pineapple, apple, papaya, berries & figs',
    image: '/products/authentic-dehydrated-mango.jpg',
    productCount: 8,
  },
  {
    id: 'c2',
    slug: 'powders',
    name: 'Powders',
    description: 'Pure solar-dehydrated superfoods — sweet potato, dates, beetroot & carrot',
    image: '/products/sweet-potato-powder-100g.jpg',
    productCount: 4,
  },
  {
    id: 'c3',
    slug: 'nuts',
    name: 'Nuts',
    description: 'Premium whole cashews, almonds, pistachios, macadamias & energy trail mix',
    image: '/products/authentic-almonds.jpg',
    productCount: 7,
  },
  {
    id: 'c4',
    slug: 'seeds',
    name: 'Seeds',
    description: 'Nutrient-dense black chia seeds & green pumpkin seed pepitas',
    image: '/products/pumpkin-seeds.jpg',
    productCount: 2,
  },
  {
    id: 'c5',
    slug: 'oils',
    name: 'Oils',
    description: 'Cold-pressed extra virgin coconut oil (500ml & 180ml)',
    image: '/products/coconut-oil.jpg',
    productCount: 2,
  },
  {
    id: 'c6',
    slug: 'salts-spices',
    name: 'Salts & Spices',
    description: 'Pristine ancient Himalayan pink rock salt & Ayurvedic black salt (Bire Noon)',
    image: '/products/pink-salt.jpg',
    productCount: 2,
  },
];

export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
