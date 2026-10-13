/**
 * Phase 1 Live Production Verification Script
 * Re-fetches live URLs from https://naturesmud.shop & https://api.naturesmud.shop/api/v1
 * and extracts exact status codes, JSON-LD, and HTML snippets.
 */

const LIVE = 'https://naturesmud.shop';
const API = 'https://api.naturesmud.shop/api/v1';

async function fetchLive(url) {
  const sep = url.includes('?') ? '&' : '?';
  const res = await fetch(`${url}${sep}_v=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' },
    signal: AbortSignal.timeout(15000),
  });
  return { status: res.status, text: await res.text() };
}

async function main() {
  console.log('=== PHASE 1 LIVE PRODUCTION VERIFICATION ===\n');

  // 1. D10: Real HTTP 404 for unknown/discontinued product slugs
  const fourOhFourUrls = [
    `${LIVE}/products/walnuts`,
    `${LIVE}/products/dehydrated-kiwi`,
    `${LIVE}/products/raw-honey`,
    `${LIVE}/products/non-existent-slug-xyz`,
  ];
  console.log('--- [D10] HTTP 404 Check for Discontinued / Unknown Product Slugs ---');
  for (const u of fourOhFourUrls) {
    const r = await fetchLive(u);
    const hasCategories = r.text.includes('Superfood Powders') && r.text.includes('Dehydrated Fruits');
    console.log(`URL: ${u} -> HTTP ${r.status} | 6 Category Links in 404 body: ${hasCategories}`);
  }

  // 2. D2 & D4: Check JSON-LD and visible rating markup on sample product pages + API entities
  const sampleProducts = [
    'freeze-dried-avocado-powder',
    'beetroot-powder',
    'raw-himalayan-almonds',
    'pure-mountain-himalayan-shilajit-resin',
  ];
  console.log('\n--- [D2 & D4] JSON-LD & Review Integrity on Live Product Pages ---');
  for (const slug of sampleProducts) {
    const u = `${LIVE}/products/${slug}`;
    const r = await fetchLive(u);
    const jsonLdMatches = [...r.text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    let productNode = null;
    let breadcrumbNode = null;
    let faqNode = null;
    for (const m of jsonLdMatches) {
      try {
        const parsed = JSON.parse(m[1]);
        const graph = parsed['@graph'] || [parsed];
        for (const n of graph) {
          if (n['@type'] === 'Product') productNode = n;
          if (n['@type'] === 'BreadcrumbList') breadcrumbNode = n;
          if (n['@type'] === 'FAQPage') faqNode = n;
        }
      } catch {}
    }
    const hasAggregateRating = Boolean(productNode?.aggregateRating);
    const hasWriteFirstReview = r.text.includes('Write the first review');
    console.log(
      `URL: ${u} -> HTTP ${r.status} | Product.name="${productNode?.name}" | Offer.price=${productNode?.offers?.price} (${productNode?.offers?.priceCurrency}) | aggregateRating=${hasAggregateRating ? JSON.stringify(productNode.aggregateRating) : 'OMITTED (0 reviews)'} | BreadcrumbList=${Boolean(breadcrumbNode)} | FAQPage=${Boolean(faqNode)} | Visible "Write the first review"=${hasWriteFirstReview}`
    );
  }

  // Check /api/entities/products
  const entRes = await fetchLive(`${LIVE}/api/entities/products`);
  const entJson = JSON.parse(entRes.text);
  const entGraph = entJson['@graph'] || [];
  const entWithRating = entGraph.filter((n) => n['@type'] === 'Product' && n.aggregateRating);
  console.log(
    `URL: ${LIVE}/api/entities/products -> HTTP ${entRes.status} | Total Product entities: ${entGraph.filter((n) => n['@type'] === 'Product').length} | Entities with unbacked aggregateRating: ${entWithRating.length}`
  );

  // 3. D2 & D5: Homepage & /about check for fake reviews, unverified stats, and fakefarmer quotes
  console.log('\n--- [D2 & D5] Homepage & /about Trust & Unverified Claims Check ---');
  const homeRes = await fetchLive(`${LIVE}/`);
  const forbiddenHomeStrings = [
    'Pooja Karki',
    'Dr. Anita Thapa',
    'Shristi Bhattarai',
    '3,840+ verified orders',
    '25,000+ Nepalis',
    '280+ local farming',
  ];
  for (const s of forbiddenHomeStrings) {
    console.log(`Homepage (${LIVE}/) contains "${s}": ${homeRes.text.includes(s)}`);
  }

  const aboutRes = await fetchLive(`${LIVE}/about`);
  const forbiddenAboutStrings = [
    'Ram Bahadur Chaudhary',
    'Sita Maya Tamang',
    'Pasang Norbu Gurung',
    'Wild Cliff Honey',
    '+35% Above Market',
    '18 Tons/Year',
    'Rs. 4.5L Seed Fund',
    'Lab Verified Safe',
    '280+',
  ];
  for (const s of forbiddenAboutStrings) {
    console.log(`About Page (${LIVE}/about) contains "${s}": ${aboutRes.text.includes(s)}`);
  }

  // 4. D3: Medical claims & baby pediatric disclaimer check across /, /products, /offers, API
  console.log('\n--- [D3] Medical / Disease Claims & Baby Pediatric Text Check ---');
  const productsPageRes = await fetchLive(`${LIVE}/products`);
  const offersPageRes = await fetchLive(`${LIVE}/offers`);
  const apiProdsRes = await fetchLive(`${API}/products?per_page=100`);
  const forbiddenMedical = [
    'diabetes-friendly',
    'Reduce Joint Inflammation',
    'liver detoxification',
    'prevent-uti',
    'urinary tract',
  ];
  for (const term of forbiddenMedical) {
    const inHome = homeRes.text.toLowerCase().includes(term.toLowerCase());
    const inProds = productsPageRes.text.toLowerCase().includes(term.toLowerCase());
    const inOffers = offersPageRes.text.toLowerCase().includes(term.toLowerCase());
    const inApi = apiProdsRes.text.toLowerCase().includes(term.toLowerCase());
    console.log(
      `Term "${term}" -> Home:${inHome} | /products:${inProds} | /offers:${inOffers} | API:${inApi}`
    );
  }
  const babyProdsRes = await fetchLive(`${LIVE}/products?category=baby`);
  console.log(
    `Baby Pediatric Disclaimer ("from 6 months, as advised by your pediatrician") -> Home:${homeRes.text.includes('from 6 months, as advised by your pediatrician')} | /products?category=baby:${babyProdsRes.text.includes('from 6 months, as advised by your pediatrician')}`
  );

  // 5. D7: Fake countdown timer check on / and /offers
  console.log('\n--- [D7] Fake Countdown Timer Check ---');
  console.log(`Homepage contains "Ends in" or fake timer: ${homeRes.text.includes('Ends in') || homeRes.text.includes('Offer Ends In')}`);
  console.log(`/offers contains "Ends in" or fake timer: ${offersPageRes.text.includes('Ends in') || offersPageRes.text.includes('Offer Ends In')}`);

  // 6. D11: Category filter crawlable <a href="/products?category=..."> links
  console.log('\n--- [D11] Crawlable Category Filter Links Check ---');
  const categoryLinks = [
    '/products?category=powders',
    '/products?category=dried-fruits',
    '/products?category=nuts',
    '/products?category=seeds',
    '/products?category=oils',
    '/products?category=salts-spices',
  ];
  for (const link of categoryLinks) {
    console.log(`/products contains <a href="${link}">: ${productsPageRes.text.includes(`href="${link}"`)}`);
  }

  // 7. D13: robots.txt & sitemap.xml check
  console.log('\n--- [D13] robots.txt & sitemap.xml Check ---');
  const robotsRes = await fetchLive(`${LIVE}/robots.txt`);
  console.log(`URL: ${LIVE}/robots.txt -> HTTP ${robotsRes.status}\n${robotsRes.text.trim()}`);
  const sitemapRes = await fetchLive(`${LIVE}/sitemap.xml`);
  const urlCount = (sitemapRes.text.match(/<loc>/g) || []).length;
  console.log(`URL: ${LIVE}/sitemap.xml -> HTTP ${sitemapRes.status} | Total <loc> URLs: ${urlCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
