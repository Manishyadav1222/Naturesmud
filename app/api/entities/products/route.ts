import { NextResponse } from 'next/server';
import { products, PRODUCT_SEARCH_SYNONYMS } from '@/lib/data/products';
import { siteConfig } from '@/lib/site';

export async function GET() {
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';
  const activeProducts = products.filter((p) => p.isActive !== false && p.isPublished !== false);

  const entities = activeProducts.map((p) => {
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
      mpn: `NM-${p.slug.toUpperCase()}`,
      weight: p.weight,
      packaging: p.packing || 'Airtight Food-Grade Pack',
      price: p.price,
      compareAtPrice: p.compareAtPrice || p.mrp || p.price,
      priceCurrency: 'NPR',
      availability: p.stock > 0 ? 'InStock' : 'OutOfStock',
      offers: {
        '@type': 'Offer',
        price: p.price,
        priceCurrency: 'NPR',
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${baseUrl}/products/${p.slug}`,
        seller: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: baseUrl,
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'NP',
          returnPolicyCountry: 'NP',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 7,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
          refundType: 'https://schema.org/FullRefund',
          returnShippingFeesAmount: {
            '@type': 'MonetaryAmount',
            value: 0,
            currency: 'NPR',
          },
        },
        shippingDetails: [
          {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: p.price >= siteConfig.freeShippingThreshold ? 0 : 100,
              currency: 'NPR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'NP',
              addressRegion: 'Bagmati (Kathmandu Valley)',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 1,
                unitCode: 'DAY',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
                unitCode: 'DAY',
              },
            },
          },
          {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: p.price >= siteConfig.freeShippingThreshold ? 0 : 150,
              currency: 'NPR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'NP',
              addressRegion: 'Outside Kathmandu Valley (All 7 Provinces)',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 1,
                unitCode: 'DAY',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 2,
                maxValue: 4,
                unitCode: 'DAY',
              },
            },
          },
        ],
      },
      ...(p.reviewCount && p.reviewCount > 0
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: p.rating,
              reviewCount: p.reviewCount,
            },
          }
        : {}),
      image: p.image?.startsWith('http') ? p.image : `${baseUrl}${p.image}`,
      ingredients: p.ingredients || [],
      keyBenefits: p.benefits || [],
      nutritionPer100g: p.nutrition || [],
      usageInstructions: p.usage || '',
      storageInstructions: p.storage || '',
      bilingualSearchAliases: PRODUCT_SEARCH_SYNONYMS[p.slug] || [],
    };
  });

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
      name: siteConfig.name,
      url: baseUrl,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Baneshwor',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati Province',
        postalCode: '44600',
        addressCountry: 'NP',
      },
    },
    productCount: activeProducts.length,
    entities,
    '@graph': entities,
  };

  return NextResponse.json(entityGraph, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
