import { Metadata } from 'next';
import CatalogClient from './CatalogClient';
import { mergeLiveProductsWithCatalog } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Product Catalog & Price List 2026 | NaturesMud Nepal',
  description:
    'Browse the official 2026 product catalog & price list for NaturesMud Nepal. 32 pure dehydrated fruits, superfood powders & nuts. Delivery across Nepal.',
  alternates: {
    canonical: 'https://naturesmud.shop/catalog',
  },
  openGraph: {
    title: 'Product Catalog & Price List 2026 | NaturesMud Nepal',
    description:
      'Browse the official 2026 product catalog & price list for NaturesMud Nepal. 32 pure dehydrated fruits, superfood powders & nuts. Delivery across Nepal.',
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
  let allProducts: Product[] = mergeLiveProductsWithCatalog(null);

  try {
    const res = await api.get('/products', {
      params: { per_page: 100, nocache: 1, _t: Date.now() },
    });
    const rawList = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : [];
    if (rawList.length > 0) {
      allProducts = mergeLiveProductsWithCatalog(rawList);
    }
  } catch {
    // Graceful fallback to local products
  }

  return <CatalogClient initialProducts={allProducts} categories={categories} />;
}
