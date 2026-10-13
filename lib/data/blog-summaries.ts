export interface HomeBlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  rawDate: string;
  readTime: number;
  author: string;
}

export const HOME_LATEST_BLOG_SUMMARIES: HomeBlogSummary[] = [
  {
    id: 'pillar-01',
    slug: 'baby-food-nepal-6-months-chart-weaning-guide',
    title: 'Baby First Foods in Nepal (6–12 Months): Sweet Potato, Banana, Carrot and Dates Powder Guide',
    excerpt:
      'A practical month-by-month weaning guide for Nepali parents introducing single-ingredient Sweet Potato Powder, Banana Powder, Carrot Powder, and Dates Powder from 6 months, as advised by your pediatrician.',
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    category: 'Infant & Maternal Nutrition',
    author: 'NaturesMud Editorial & Kitchen Team',
    date: 'Oct 1, 2026',
    rawDate: '2026-10-01',
    readTime: 14,
  },
  {
    id: 'pillar-02',
    slug: 'dates-powder-price-in-nepal-natural-sugar-substitute-guide',
    title: 'Dates Powder in Nepal (Khajur Powder): Price, Uses, Baby Porridge and Sugar-Free Baking Guide',
    excerpt:
      'Compare Dates Powder (Rs. 400 / 100 GM) vs white sugar, jaggery, and honey in Nepal, with exact conversion ratios for tea, baking, and baby porridge (from 6 months, as advised by your pediatrician).',
    image: '/products/dates-powder-100g.jpg',
    category: 'Superfood Powders',
    author: 'NaturesMud Editorial & Kitchen Team',
    date: 'Sep 29, 2026',
    rawDate: '2026-09-29',
    readTime: 13,
  },
  {
    id: 'pillar-06',
    slug: 'dry-fruits-price-in-nepal-2026-wholesale-retail-guide',
    title: 'Dry Fruits Price in Nepal (2026 Guide): Almonds, Cashews, Pistachios, Figs, Dates and Berries',
    excerpt:
      'Updated 2026 retail price list and quality grading guide for Raw Almonds, Roasted Cashews, Pistachios, Macadamia Nuts, Dry Figs (Anjeer), Khajoor, and Dehydrated Fruits across Kathmandu and Nepal.',
    image: '/products/nm-almond-jar-v2.jpg',
    category: 'Nuts & Dry Fruits',
    author: 'NaturesMud Editorial & Kitchen Team',
    date: 'Sep 25, 2026',
    rawDate: '2026-09-25',
    readTime: 15,
  },
];
