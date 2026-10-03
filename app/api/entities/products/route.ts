import { NextResponse } from 'next/server';
import { products, PRODUCT_SEARCH_SYNONYMS } from '@/lib/data/products';
import { siteConfig } from '@/lib/site';

export async function GET() {
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';
  const activeProducts = products.filter((p) => p.isActive !== false && p.isPublished !== false);

  const entityGraph = {
    '@context': 'https://schema.org',
    '@id': `${baseUrl}/api/entities/products#catalog`,
    '@type': 'DataCatalog',
    name: 'NaturesMud Nepal Official First-Party Product Entity Graph',
    description:
      'Authoritative first-party product knowledge graph for NaturesMud Nepal. Every product name matches the official physical packaging label (official_label_name).',
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'NaturesMud',
      url: baseUrl,
      telephone: '+977-9713888002',
      email: 'naturesmud@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Gaurighat',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati Province',
        postalCode: '44600',
        addressCountry: 'NP',
      },
    },
    productCount: activeProducts.length,
    entities: activeProducts.map((p) => {
      const officialName = p.official_label_name || p.name;
      return {
        '@type': 'Product',
        '@id': `${baseUrl}/products/${p.slug}#product`,
        id: p.id,
        slug: p.slug,
        official_label_name: officialName,
        name: officialName,
        seo_title: p.seo_title || `${officialName} (${p.weight}) | NaturesMud Nepal`,
        meta_description: p.meta_description || p.shortDescription,
        url: `${baseUrl}/products/${p.slug}`,
        category: p.category,
        categorySlug: p.categorySlug,
        sku: `NM-${p.slug.toUpperCase()}`,
        weight: p.weight,
        packaging: p.packing || 'Airtight Food-Grade Pack',
        price: p.price,
        compareAtPrice: p.compareAtPrice || p.mrp || p.price,
        priceCurrency: 'NPR',
        availability: p.stock > 0 ? 'InStock' : 'OutOfStock',
        image: p.image?.startsWith('http') ? p.image : `${baseUrl}${p.image}`,
        ingredients: p.ingredients || [],
        keyBenefits: p.benefits || [],
        nutritionPer100g: p.nutrition || [],
        usageInstructions: p.usage || '',
        storageInstructions: p.storage || '',
        bilingualSearchAliases: PRODUCT_SEARCH_SYNONYMS[p.slug] || [],
      };
    }),
  };

  return NextResponse.json(entityGraph, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
