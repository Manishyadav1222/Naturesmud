import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/data/products';
import { PRODUCT_SEO_DOSSIERS } from '@/lib/data/product-seo-dossier';
import { getDarazTop10Listings } from '@/lib/data/daraz-top-10';
import { siteConfig } from '@/lib/site';

function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeCsv(val: string | number | undefined | null): string {
  const s = String(val ?? '').replace(/\r?\n/g, ' ');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function normalizeUnitMeasure(weightStr: string): { measure: string; baseMeasure: string } {
  const raw = String(weightStr || '100 GM').trim().toUpperCase();
  const match = raw.match(/([0-9]+(?:\.[0-9]+)?)\s*(GM|G|KG|ML|L)/i);
  if (!match) {
    return { measure: '100g', baseMeasure: '100g' };
  }
  const num = parseFloat(match[1]);
  const unitRaw = match[2].toUpperCase();
  if (unitRaw === 'ML') {
    return { measure: `${num}ml`, baseMeasure: '100ml' };
  }
  if (unitRaw === 'L') {
    return { measure: `${num * 1000}ml`, baseMeasure: '100ml' };
  }
  if (unitRaw === 'KG') {
    return { measure: `${num * 1000}g`, baseMeasure: '100g' };
  }
  return { measure: `${num}g`, baseMeasure: '100g' };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get('format') || 'xml').toLowerCase();
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';

  const activeProducts = products.filter((p) => p.isActive !== false && p.isPublished !== false);

  // 1. JSON Format (used by live-consistency-check.mjs & AI/shopping indexers)
  if (format === 'json') {
    const items = activeProducts.map((p) => {
      const officialName = p.official_label_name || p.name;
      const primaryImage = p.image?.startsWith('http') ? p.image : `${baseUrl}${p.image}`;
      const dossier = PRODUCT_SEO_DOSSIERS[p.slug];
      return {
        id: `NM-${p.slug.toUpperCase()}`,
        slug: p.slug,
        official_label_name: officialName,
        title: officialName,
        seo_title: p.seo_title || `${officialName} (${p.weight}) | NaturesMud Nepal`,
        nepali_name: dossier?.nepaliNameDevanagari || '',
        nepali_romanized: dossier?.nepaliNameRoman || '',
        description: p.description || p.shortDescription,
        link: `${baseUrl}/products/${p.slug}`,
        image_link: primaryImage,
        additional_image_links: (p.images || [])
          .slice(1)
          .map((img) => (img.startsWith('http') ? img : `${baseUrl}${img}`)),
        availability: p.stock > 0 ? 'in_stock' : 'out_of_stock',
        price: `${p.price} NPR`,
        price_value: p.price,
        compare_at_price: p.compareAtPrice || p.mrp || p.price,
        currency: 'NPR',
        brand: 'NaturesMud',
        condition: 'new',
        identifier_exists: 'no',
        weight: p.weight,
        packing: p.packing || 'Airtight Food-Grade Pack',
        category: p.category,
        category_slug: p.categorySlug,
        ingredients: p.ingredients || [],
        benefits: p.benefits || [],
        rating: p.rating,
        review_count: p.reviewCount,
      };
    });

    return NextResponse.json(
      {
        brand: 'NaturesMud',
        country: 'NP',
        currency: 'NPR',
        gmc_nepal_note:
          'Google Merchant Center does not currently list Nepal (NP/NPR) as a supported target country for direct GMC account registration; this feed + on-page Product/Offer/MerchantReturnPolicy/OfferShippingDetails JSON-LD powers Google Search organic product snippets, AI Overviews, and Meta Commerce Manager.',
        updated_at: new Date().toISOString(),
        count: items.length,
        products: items,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  // 2. Meta (Facebook & Instagram Commerce Manager) CSV Feed
  if (format === 'meta_csv' || format === 'csv') {
    const headers = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'additional_image_link',
      'brand',
      'google_product_category',
      'fb_product_category',
      'custom_label_0',
      'custom_label_1',
      'custom_label_2',
      'custom_label_3',
    ];

    const rows = activeProducts.map((p) => {
      const officialName = p.official_label_name || p.name;
      const dossier = PRODUCT_SEO_DOSSIERS[p.slug];
      const primaryImage = p.image?.startsWith('http') ? p.image : `${baseUrl}${p.image}`;
      const additionalImages = (p.images || [])
        .slice(1)
        .map((img) => (img.startsWith('http') ? img : `${baseUrl}${img}`))
        .join(',');

      return [
        escapeCsv(`NM-${p.slug.toUpperCase()}`),
        escapeCsv(`${officialName} (${p.weight})`),
        escapeCsv(p.description || p.shortDescription),
        escapeCsv(p.stock > 0 ? 'in stock' : 'out of stock'),
        escapeCsv('new'),
        escapeCsv(`${p.price}.00 NPR`),
        escapeCsv(`${baseUrl}/products/${p.slug}`),
        escapeCsv(primaryImage),
        escapeCsv(additionalImages),
        escapeCsv('NaturesMud'),
        escapeCsv('Food, Beverages & Tobacco > Food Items'),
        escapeCsv('food & beverages > food'),
        escapeCsv(p.categorySlug || 'superfoods'),
        escapeCsv(p.weight || '100 GM'),
        escapeCsv(p.packing || 'Airtight Food-Grade Container'),
        escapeCsv(dossier?.nepaliNameDevanagari || officialName),
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'inline; filename="naturesmud-meta-catalog-feed.csv"',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  // 3. Daraz Nepal Brand Store Top 10 SKUs JSON & CSV
  if (format === 'daraz_json') {
    const listings = getDarazTop10Listings();
    return NextResponse.json(
      {
        brand: 'NaturesMud',
        marketplace: 'Daraz Nepal (daraz.com.np)',
        strategy:
          'Top 10 high-velocity SKUs listed on Daraz Nepal to capture marketplace brand/category searches while preserving full 32-SKU catalog exclusivity and bundles on naturesmud.shop.',
        count: listings.length,
        listings,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  if (format === 'daraz_csv') {
    const listings = getDarazTop10Listings();
    const headers = [
      'Rank',
      'SellerSKU',
      'OfficialLabelName',
      'DarazProductTitle',
      'DarazCategoryPath',
      'PriceNPR',
      'CompareAtPriceNPR',
      'NetWeight',
      'PackingType',
      'ShippingPackageWeightKg',
      'PackageDimensionsCm',
      'ShelfLife',
      'PrimaryImageURL',
      'GalleryImageURLs',
      'BulletHighlights',
      'SearchKeywords',
      'CanonicalWebsiteURL',
      'HTMLDescription',
    ];
    const rows = listings.map((item) =>
      [
        escapeCsv(item.rank),
        escapeCsv(item.sellerSku),
        escapeCsv(item.officialLabelName),
        escapeCsv(item.darazTitle),
        escapeCsv(item.darazCategoryPath),
        escapeCsv(item.priceNpr),
        escapeCsv(item.compareAtPriceNpr),
        escapeCsv(item.netWeight),
        escapeCsv(item.packingType),
        escapeCsv(item.shippingPackageWeightKg),
        escapeCsv(item.packageDimensionsCm),
        escapeCsv(item.shelfLife),
        escapeCsv(item.primaryImageUrl),
        escapeCsv(item.galleryImageUrls.join(' | ')),
        escapeCsv(item.shortHighlights.join(' • ')),
        escapeCsv(item.searchKeywords.join(', ')),
        escapeCsv(item.canonicalProductUrl),
        escapeCsv(item.htmlDescription),
      ].join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'inline; filename="naturesmud-daraz-top-10-listings.csv"',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  // 4. XML Format (Default Google Merchant Center RSS 2.0 XML & Meta Catalog XML)
  const isMetaXml = format === 'meta_xml';
  const xmlItems = activeProducts
    .map((p) => {
      const officialName = p.official_label_name || p.name;
      const dossier = PRODUCT_SEO_DOSSIERS[p.slug];
      const primaryImage = p.image?.startsWith('http') ? p.image : `${baseUrl}${p.image}`;
      const additionalImagesXml = (p.images || [])
        .slice(1, 5)
        .map((img) => {
          const fullUrl = img.startsWith('http') ? img : `${baseUrl}${img}`;
          return `      <g:additional_image_link>${escapeXml(fullUrl)}</g:additional_image_link>`;
        })
        .join('\n');
      const { measure, baseMeasure } = normalizeUnitMeasure(p.weight || '100 GM');
      const insideValleyShipping = p.price >= siteConfig.freeShippingThreshold ? '0.00 NPR' : '100.00 NPR';
      const outsideValleyShipping = p.price >= siteConfig.freeShippingThreshold ? '0.00 NPR' : '150.00 NPR';
      const displayTitle = isMetaXml ? `${officialName} (${p.weight})` : officialName;

      return `    <item>
      <g:id>${escapeXml(`NM-${p.slug.toUpperCase()}`)}</g:id>
      <title>${escapeXml(displayTitle)}</title>
      <description>${escapeXml(p.description || p.shortDescription)}</description>
      <link>${escapeXml(`${baseUrl}/products/${p.slug}`)}</link>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
${additionalImagesXml ? additionalImagesXml + '\n' : ''}      <g:condition>new</g:condition>
      <g:availability>${p.stock > 0 ? (isMetaXml ? 'in stock' : 'in_stock') : isMetaXml ? 'out of stock' : 'out_of_stock'}</g:availability>
      <g:price>${p.price} NPR</g:price>
      <g:brand>NaturesMud</g:brand>
      <g:mpn>${escapeXml(`NM-${p.id || p.slug.toUpperCase()}`)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:unit_pricing_measure>${escapeXml(measure)}</g:unit_pricing_measure>
      <g:unit_pricing_base_measure>${escapeXml(baseMeasure)}</g:unit_pricing_base_measure>
      <g:google_product_category>Food, Beverages &amp; Tobacco &gt; Food Items</g:google_product_category>
      <g:fb_product_category>food &amp; beverages &gt; food</g:fb_product_category>
      <g:product_type>${escapeXml(`Food, Beverages & Tobacco > Food Items > ${p.category}`)}</g:product_type>
      <g:custom_label_0>${escapeXml(p.categorySlug || 'superfoods')}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(p.weight || '100 GM')}</g:custom_label_1>
      <g:custom_label_2>${escapeXml(p.packing || 'Airtight Food-Grade Container')}</g:custom_label_2>
      <g:custom_label_3>${escapeXml(dossier?.nepaliNameDevanagari || officialName)}</g:custom_label_3>
      <g:shipping_weight>${escapeXml(measure)}</g:shipping_weight>
      <g:return_policy_label>7_day_return</g:return_policy_label>
      <g:shipping>
        <g:country>NP</g:country>
        <g:region>Bagmati</g:region>
        <g:service>Kathmandu Valley Express Delivery (24 Hours)</g:service>
        <g:price>${insideValleyShipping}</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>NP</g:country>
        <g:service>All-Nepal Courier Delivery (2-5 Days)</g:service>
        <g:price>${outsideValleyShipping}</g:price>
      </g:shipping>
    </item>`;
    })
    .join('\n');

  const feedTitle = isMetaXml
    ? 'NaturesMud Nepal — Official Meta (Facebook & Instagram) Product Catalog Feed'
    : 'NaturesMud Nepal — Official Google Merchant & Product Feed';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Official first-party product feed for NaturesMud Nepal — 32 canonical single-ingredient dehydrated fruits, superfood powders, nuts, seeds, cold-pressed oils, and Himalayan salts.</description>
${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
