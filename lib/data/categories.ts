import { Category } from '@/lib/types';

export const categories: Category[] = [
  {
    id: 'c1',
    slug: 'dried-fruits',
    name: 'Dried Fruits',
    description: 'Naturally sweet sun-dried cranberries, blueberries, papaya & more',
    image: '/products/cranberries.jpg',
    productCount: 3,
  },
  {
    id: 'c2',
    slug: 'nuts',
    name: 'Nuts',
    description: 'Premium raw and roasted almonds, cashews & more',
    image: '/products/almonds.jpg',
    productCount: 1,
  },
  {
    id: 'c3',
    slug: 'seeds',
    name: 'Seeds',
    description: 'Nutrient-dense pumpkin seeds, chia seeds & more',
    image: '/products/pumpkin-seeds.jpg',
    productCount: 2,
  },
  {
    id: 'c4',
    slug: 'powders',
    name: 'Powders',
    description: 'Pure ground superfoods — beetroot, dates powder & more',
    image: '/products/beetroot-powder.jpg',
    productCount: 2,
  },
  {
    id: 'c5',
    slug: 'oils',
    name: 'Oils',
    description: 'Cold-pressed extra virgin coconut oil',
    image: '/products/coconut-oil.jpg',
    productCount: 1,
  },
  {
    id: 'c6',
    slug: 'superfoods',
    name: 'Superfoods',
    description: "Nature's most powerful immunity-boosting blends",
    image: '/products/superfood-mix.jpg',
    productCount: 1,
  },
];

export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
