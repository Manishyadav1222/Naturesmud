import { Metadata } from 'next';
import CatalogClient from './CatalogClient';
import { products as localProducts, normalizeProduct } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: "Official Product Catalog & Price List 2026 | NaturesMud Nepal",
  description:
    "Explore the complete official 2026 product catalog and price list for NaturesMud Nepal. Download the master catalog, browse certified single-origin dehydrated fruits, pure superfood powders, mountain nuts, seeds, and cold-pressed virgin oils.",
  keywords: [
    "NaturesMud catalog",
    "NaturesMud price list",
    "Nepal pure food catalog",
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
    title: 'Official Product Catalog & Price List 2026 | NaturesMud Nepal',
    description:
      'Browse single-origin pure superfoods, dehydrated fruits, mountain nuts, and cold-pressed virgin oils from NaturesMud Nepal. Download the complete master catalog.',
    url: 'https://naturesmud.shop/catalog',
    siteName: 'NaturesMud Nepal',
    images: [
      {
        url: 'https://naturesmud.shop/products/naturesmud-all-products-100g.jpg',
        width: 1200,
        height: 630,
        alt: 'NaturesMud Nepal Product Catalog',
      },
    ],
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CatalogPage() {
  const productsMap = new Map<string, Product>();

  // 1. Seed with all local products to guarantee all 34 products exist
  localProducts.forEach((p) => {
    const norm = normalizeProduct(p);
    productsMap.set(norm.slug, norm);
  });

  // 2. Fetch latest live database products and overlay real-time prices/weights
  try {
    const res = await api.get('/products', { params: { per_page: 100 } });
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      res.data.data
        .filter((p: any) => p.isActive !== false && p.is_active !== 0 && p.is_active !== false)
        .forEach((p: any) => {
          const norm = normalizeProduct(p);
          const existing = productsMap.get(norm.slug);
          // Keep authentic image if remote DB has placeholder
          if (existing && existing.image && (!norm.image || norm.image.includes('placeholder'))) {
            norm.image = existing.image;
          }
          productsMap.set(norm.slug, norm);
        });
    }
  } catch (error) {
    // Graceful fallback to local products
  }

  const allProducts = Array.from(productsMap.values());
  return <CatalogClient initialProducts={allProducts} categories={categories} />;
}
