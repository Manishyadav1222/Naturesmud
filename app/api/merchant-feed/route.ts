import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/data/products';
import { siteConfig } from '@/lib/site';

function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get('format') || 'xml').toLowerCase();
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';

  const activeProducts = products.filter((p) => p.isActive !== false && p.isPublished !== false);

  if (format === 'json') {
    const items = activeProducts.map((p) => {
      const officialName = p.official_label_name || p.name;
      const primaryImage = p.image?.startsWith('http') ? p.image : `${baseUrl}${p.image}`;
      return {
        id: `NM-${p.slug.toUpperCase()}`,
        slug: p.slug,
        official_label_name: officialName,
        title: officialName,
        seo_title: p.seo_title || `${officialName} (${p.weight}) | NaturesMud Nepal`,
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
        weight: p.weight,
        packing: p.packing || 'Airtight Food-Grade Pack',
        category: p.category,
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

  const xmlItems = activeProducts
    .map((p) => {
      const officialName = p.official_label_name || p.name;
      const primaryImage = p.image?.startsWith('http') ? p.image : `${baseUrl}${p.image}`;
      const shippingPrice = p.price >= siteConfig.freeShippingThreshold ? '0 NPR' : '100 NPR';
      return `    <item>
      <g:id>${escapeXml(`NM-${p.slug.toUpperCase()}`)}</g:id>
      <title>${escapeXml(officialName)}</title>
      <description>${escapeXml(p.description || p.shortDescription)}</description>
      <link>${escapeXml(`${baseUrl}/products/${p.slug}`)}</link>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${p.stock > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${p.price} NPR</g:price>
      <g:brand>NaturesMud</g:brand>
      <g:mpn>${escapeXml(`NM-${p.id || p.slug.toUpperCase()}`)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${escapeXml(`Food, Beverages & Tobacco > Food Items > ${p.category}`)}</g:product_type>
      <g:shipping_weight>${escapeXml(p.weight || '100 GM')}</g:shipping_weight>
      <g:shipping>
        <g:country>NP</g:country>
        <g:service>Standard Nepal Delivery</g:service>
        <g:price>${shippingPrice}</g:price>
      </g:shipping>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>NaturesMud Nepal — Official Product &amp; Merchant Feed</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Official first-party product feed for NaturesMud Nepal — 100% pure single-ingredient dehydrated fruits, superfood powders, nuts, seeds, oils, and Himalayan salts.</description>
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
