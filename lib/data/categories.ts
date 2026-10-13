import { Category } from '@/lib/types';
import { products } from '@/lib/data/products';

export const categories: Category[] = [
  {
    id: 'c1',
    slug: 'dried-fruits',
    name: 'Dried Fruits',
    description: 'Naturally sweet sun-dried mango, pineapple, apple, papaya, figs, dates & berries',
    image: '/products/authentic-dehydrated-mango.jpg',
    productCount: products.filter((p) => p.categorySlug === 'dried-fruits').length,
  },
  {
    id: 'c2',
    slug: 'powders',
    name: 'Powders',
    description: 'Pure dehydrated superfoods with 0 additives — Avocado, Banana, Strawberry, Moringa, Sweet Potato & Beetroot',
    image: '/products/strawberry-powder-v2.jpg',
    productCount: products.filter((p) => p.categorySlug === 'powders').length,
  },
  {
    id: 'c3',
    slug: 'nuts',
    name: 'Nuts',
    description: 'Premium whole cashews, almonds, pistachios, macadamias & energy trail mix',
    image: '/products/nm-roasted-cashew-new.jpg',
    productCount: products.filter((p) => p.categorySlug === 'nuts').length,
  },
  {
    id: 'c4',
    slug: 'seeds',
    name: 'Seeds',
    description: 'Nutrient-dense black chia seeds, green pumpkin seeds, flax seeds (Alash) & makhana',
    image: '/products/pumpkin-seeds.jpg',
    productCount: products.filter((p) => p.categorySlug === 'seeds').length,
  },
  {
    id: 'c5',
    slug: 'oils',
    name: 'Oils',
    description: 'Cold-pressed extra virgin coconut oil (500ml & 180ml)',
    image: '/products/coconut-oil.jpg',
    productCount: products.filter((p) => p.categorySlug === 'oils').length,
  },
  {
    id: 'c6',
    slug: 'salts-spices',
    name: 'Salts & Spices',
    description: 'Himalayan pink rock salt, Ayurvedic black salt (Bire Noon) & pure Himalayan Shilajit resin',
    image: '/products/pink-salt.jpg',
    productCount: products.filter((p) => p.categorySlug === 'salts-spices').length,
  },
];

export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
