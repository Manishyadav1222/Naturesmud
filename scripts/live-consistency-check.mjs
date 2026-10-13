/**
 * NaturesMud Live Consistency & Phase 0 Audit Script
 */

import fs from 'fs';
import path from 'path';

const LIVE_SITE = 'https://naturesmud.shop';
const LIVE_API = 'https://api.naturesmud.shop/api/v1';

async function fetchJson(url) {
  const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' },
    signal: AbortSignal.timeout(20000),
  });
  return { status: res.status, text: await res.text() };
}

function parseLocalProducts() {
  const rawFile = fs.readFileSync(path.join(process.cwd(), 'lib/data/products.ts'), 'utf8');
  const startMarker = 'export const products: Product[] = [';
  const startIdx = rawFile.indexOf(startMarker);
  const endIdx = rawFile.indexOf('export function getProductBySlug');
  const arrayStr = rawFile.slice(startIdx + 'export const products: Product[] = '.length, endIdx).trim().replace(/;$/, '');
  return JSON.parse(arrayStr);
}

async function main() {
  console.log('=== NATURESMUD LIVE CONSISTENCY CHECK ===');
  const localProducts = parseLocalProducts();
  console.log(`Local products count: ${localProducts.length}`);

  // 1. Live MySQL API
  const apiRes = await fetchJson(`${LIVE_API}/products?per_page=100`);
  const apiProducts = apiRes.data || [];
  console.log(`Live API products count: ${apiProducts.length}`);

  // 2. Live Merchant Feed JSON & XML
  const feedJson = await fetchJson(`${LIVE_SITE}/api/merchant-feed?format=json`);
  const feedItems = feedJson.products || [];
  const feedXmlRes = await fetchText(`${LIVE_SITE}/api/merchant-feed`);
  console.log(`Live Merchant Feed count: ${feedItems.length} (XML status: ${feedXmlRes.status})`);

  // 3. Live Entities Endpoint
  const entitiesJson = await fetchJson(`${LIVE_SITE}/api/entities/products`);
  const entityGraph = entitiesJson.entities || entitiesJson['@graph'] || [];
  const entityProducts = entityGraph.filter((n) =>
    Array.isArray(n['@type']) ? n['@type'].includes('Product') : n['@type'] === 'Product'
  );
  console.log(`Live Entities products count: ${entityProducts.length}`);

  // 4. Live llms.txt
  const llmsRes = await fetchText(`${LIVE_SITE}/llms.txt`);
  const llmsLines = llmsRes.text.split('\n');

  // 5. Fetch all live product pages with concurrency 4 and 20s timeout
  const liveProductPages = {};
  const slugs = localProducts.map((p) => p.slug);
  console.log(`Fetching ${slugs.length} live product detail pages...`);
  for (let i = 0; i < slugs.length; i += 4) {
    const batch = slugs.slice(i, i + 4);
    await Promise.all(
      batch.map(async (slug) => {
        try {
          const { status, text } = await fetchText(`${LIVE_SITE}/products/${slug}`);
          const h1Match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
          const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : null;
          const jsonLdMatches = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
          let schemaProduct = null;
          for (const m of jsonLdMatches) {
            try {
              const parsed = JSON.parse(m[1]);
              const graph = parsed['@graph'] || [parsed];
              const found = graph.find((node) => node['@type'] === 'Product');
              if (found) schemaProduct = found;
            } catch {}
          }
          const reviewsMatch = text.match(/\(([\d,]+)\s+reviews\)/i);
          liveProductPages[slug] = {
            status,
            h1,
            schemaName: schemaProduct?.name || null,
            schemaPrice: schemaProduct?.offers?.price ?? null,
            schemaWeight: schemaProduct?.weight ? `${schemaProduct.weight.value} ${schemaProduct.weight.unitText}` : null,
            schemaRating: schemaProduct?.aggregateRating?.ratingValue ?? null,
            schemaReviewCount: schemaProduct?.aggregateRating?.reviewCount ?? null,
            visibleReviewCount: reviewsMatch ? Number(reviewsMatch[1].replace(/,/g, '')) : null,
          };
        } catch (e) {
          liveProductPages[slug] = { error: e.message };
        }
      })
    );
  }

  // 6. Check old/unstocked slugs on live site
  const unstockedSlugs = [
    'dehydrated-kiwi',
    'walnuts',
    'sunflower-seeds',
    'raw-cashewnuts',
    'mixed-fruits',
    'dehydrated-banana',
    'dehydrated-strawberries',
    'blueberry',
    'premium-pistachios',
  ];
  const unstockedChecks = {};
  await Promise.all(
    unstockedSlugs.map(async (s) => {
      try {
        const { status, text } = await fetchText(`${LIVE_SITE}/products/${s}`);
        const isNotFound = text.includes('Product Not Found');
        unstockedChecks[s] = { httpStatus: status, rendersProductNotFound: isNotFound };
      } catch (e) {
        unstockedChecks[s] = { error: e.message };
      }
    })
  );

  // 7. Build comprehensive comparison per SKU
  const report = [];
  for (const local of localProducts) {
    const slug = local.slug;
    const apiItem = apiProducts.find((a) => a.slug === slug || String(a.id) === String(local.dbId));
    const feedItem = feedItems.find((f) => f.link?.endsWith(`/products/${slug}`));
    const entityItem = entityProducts.find((e) => e.url?.endsWith(`/products/${slug}`) || e.slug === slug);
    const llmsLine = llmsLines.find((l) => l.includes(`/products/${slug}`));
    const pageItem = liveProductPages[slug];

    const diffs = [];
    if (!apiItem) {
      diffs.push('MISSING_IN_LIVE_API');
    } else {
      if (String(apiItem.id) !== String(local.id) || String(apiItem.id) !== String(local.dbId)) {
        diffs.push(`ID_MISMATCH: API=${apiItem.id} vs Local id=${local.id}/dbId=${local.dbId}`);
      }
      if (Number(apiItem.price) !== Number(local.price)) {
        diffs.push(`PRICE: API=${apiItem.price} vs Local=${local.price}`);
      }
      if (Number(apiItem.compare_at_price || 0) !== Number(local.compareAtPrice || 0)) {
        diffs.push(`COMPARE_AT: API=${apiItem.compare_at_price} vs Local=${local.compareAtPrice}`);
      }
      const normApiUnit = (apiItem.unit || '').toLowerCase() === 'g' ? 'GM' : (apiItem.unit || '').toUpperCase();
      const apiWeightStr = `${Math.round(Number(apiItem.weight || 0))} ${normApiUnit}`.trim();
      if (apiWeightStr !== local.weight) {
        diffs.push(`WEIGHT/UNIT: API="${apiItem.weight} ${apiItem.unit}" (${apiWeightStr}) vs Local="${local.weight}"`);
      }
      if ((apiItem.name || '').trim() !== (local.name || '').trim()) {
        diffs.push(`NAME: API="${apiItem.name}" vs Local="${local.name}"`);
      }
      if ((apiItem.category?.slug || '') !== (local.categorySlug || '')) {
        diffs.push(`CATEGORY_SLUG: API="${apiItem.category?.slug}" vs Local="${local.categorySlug}"`);
      }
      if (Number(apiItem.rating_count || 0) !== Number(local.reviewCount || 0)) {
        diffs.push(`REVIEW_COUNT: API=${apiItem.rating_count} vs Local=${local.reviewCount}`);
      }
    }

    if (!pageItem || pageItem.status !== 200) {
      diffs.push(`PAGE_STATUS: ${pageItem?.status || pageItem?.error}`);
    } else {
      if (Number(pageItem.schemaPrice) !== Number(local.price)) {
        diffs.push(`PAGE_SCHEMA_PRICE: ${pageItem.schemaPrice} vs Local=${local.price}`);
      }
      if ((pageItem.h1 || '').trim() !== (local.official_label_name || local.name).trim()) {
        diffs.push(`PAGE_H1: "${pageItem.h1}" vs Local="${local.official_label_name || local.name}"`);
      }
    }

    if (!feedItem) {
      diffs.push('MISSING_IN_MERCHANT_FEED');
    } else {
      const feedSalePrice = Number(String(feedItem.sale_price || feedItem.price).replace(/[^0-9.]/g, ''));
      if (feedSalePrice !== Number(local.price)) {
        diffs.push(`FEED_PRICE: ${feedSalePrice} vs Local=${local.price}`);
      }
    }

    if (!entityItem) {
      diffs.push('MISSING_IN_ENTITIES_API');
    } else if (Number(entityItem.price) !== Number(local.price)) {
      diffs.push(`ENTITY_PRICE: ${entityItem.price} vs Local=${local.price}`);
    }

    if (!llmsLine) {
      diffs.push('MISSING_IN_LLMS_TXT');
    }

    report.push({
      slug,
      local: {
        id: local.id,
        dbId: local.dbId,
        name: local.name,
        official_label_name: local.official_label_name,
        price: local.price,
        compareAtPrice: local.compareAtPrice,
        weight: local.weight,
        categorySlug: local.categorySlug,
        rating: local.rating,
        reviewCount: local.reviewCount,
        image: local.image,
      },
      api: apiItem
        ? {
            id: apiItem.id,
            name: apiItem.name,
            price: Number(apiItem.price),
            compare_at_price: Number(apiItem.compare_at_price),
            weight: apiItem.weight,
            unit: apiItem.unit,
            categorySlug: apiItem.category?.slug,
            rating_avg: apiItem.rating_avg,
            rating_count: apiItem.rating_count,
            is_featured: apiItem.is_featured,
          }
        : null,
      livePage: pageItem,
      feed: feedItem
        ? {
            id: feedItem.id,
            title: feedItem.title,
            price: feedItem.price,
            sale_price: feedItem.sale_price,
            weight: feedItem.weight,
          }
        : null,
      entity: entityItem
        ? {
            id: entityItem.id,
            name: entityItem.name,
            price: entityItem.price,
            ratingCount: entityItem.aggregateRating?.reviewCount,
          }
        : null,
      llmsLine: llmsLine || null,
      diffs,
    });
  }

  const extraApiProducts = apiProducts.filter(
    (a) => !localProducts.some((l) => l.slug === a.slug || String(l.dbId) === String(a.id))
  );

  const output = {
    checkedAt: new Date().toISOString(),
    counts: {
      local: localProducts.length,
      api: apiProducts.length,
      feed: feedItems.length,
      entities: entityProducts.length,
      extraApiProducts: extraApiProducts.length,
    },
    extraApiProducts,
    unstockedChecks,
    productsWithDiffsCount: report.filter((r) => r.diffs.length > 0).length,
    report,
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'scripts/live-consistency-report.json'),
    JSON.stringify(output, null, 2)
  );
  console.log(`Saved full report to scripts/live-consistency-report.json`);
  console.log(`Products with API vs Local/Page/Feed diffs: ${output.productsWithDiffsCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
