import { Metadata } from 'next';
import CatalogClient from './CatalogClient';
import { products } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: "Official Product Catalog & Price List 2026 | Nature's Mud Nepal",
  description:
    "Explore the complete official 2026 product catalog and price list for Nature's Mud Nepal. Download the master catalog, browse 25 certified dehydrated fruits, organic superfood powders, mountain nuts, seeds, and cold-pressed virgin oils.",
  keywords: [
    "Nature's Mud catalog",
    "Nature's Mud price list",
    "Nepal organic food catalog",
    "dehydrated fruit price list Nepal",
    "sweet potato powder price Nepal",
    "beetroot powder Nepal",
    "dates powder sweetener Nepal",
    "naturesmud catalog",
  ],
  alternates: {
    canonical: 'https://naturesmud.shop/catalog',
  },
  openGraph: {
    title: "Official Product Catalog & Price List 2026 | Nature's Mud Nepal",
    description:
      "Browse 25 certified organic superfoods, dehydrated fruits, mountain nuts, and cold-pressed virgin oils from Nature's Mud Nepal. Download the complete master catalog.",
    url: 'https://naturesmud.shop/catalog',
    siteName: "Nature's Mud (naturesmud.shop)",
    images: [
      {
        url: '/products/naturesmud-all-products-100g.jpg',
        width: 1200,
        height: 630,
        alt: "Nature's Mud Nepal Product Catalog",
      },
    ],
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CatalogPage() {
  return <CatalogClient initialProducts={products} categories={categories} />;
}
