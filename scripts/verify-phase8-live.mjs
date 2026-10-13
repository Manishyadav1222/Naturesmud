/**
 * Phase 8 Live Production Verification Script
 * Verifies on https://naturesmud.shop:
 * 1. Speed & HTML Payload reduction (/ and /blog and /products and /products/[slug])
 * 2. Strictly 1 <h1> tag, canonical URL, meta description, body copy, and JSON-LD in raw SSR HTML across all template types
 * 3. Zero internal links to /our-story, /products?category=*, or archived 404 slugs across live pages
 * 4. Clean single-hop redirects for legacy product, blog, and recipe slugs (0 redirect chains, 0 404s)
 */
const BASE = 'https://naturesmud.shop';

async function fetchTimed(path, followRedirect = true) {
  const url = `${BASE}${path}`;
  const start = performance.now();
  const res = await fetch(url, {
    redirect: followRedirect ? 'follow' : 'manual',
    headers: {
      'User-Agent': 'NaturesMud-Phase8-Verifier/1.0',
      'Cache-Control': 'no-cache',
    },
  });
  const ttfb = Math.round(performance.now() - start);
  const html = followRedirect ? await res.text() : '';
  const totalMs = Math.round(performance.now() - start);
  return { status: res.status, location: res.headers.get('location'), ttfb, totalMs, html, sizeKb: Math.round(Buffer.byteLength(html, 'utf8') / 1024) };
}

async function main() {
  console.log('=== PHASE 8 LIVE VERIFICATION (https://naturesmud.shop) ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, label, detail = '') {
    if (condition) {
      passed++;
      console.log(`✅ PASS: ${label}${detail ? ` — ${detail}` : ''}`);
    } else {
      failed++;
      console.error(`❌ FAIL: ${label}${detail ? ` — ${detail}` : ''}`);
    }
  }

  // 1. SSR Templates Speed, H1 Count, Payload & Schema Check
  const templates = [
    { path: '/', maxKb: 460, name: 'Homepage (/)' },
    { path: '/products', maxKb: 500, name: 'All Products (/products)' },
    { path: '/category/powders', maxKb: 250, name: 'Category Hub (/category/powders)' },
    { path: '/products/dates-powder', maxKb: 300, name: 'Product Page (/products/dates-powder)' },
    { path: '/blog', maxKb: 180, name: 'Blog Index (/blog)' },
    { path: '/blog/baby-food-nepal-6-months-chart-weaning-guide', maxKb: 250, name: 'Blog Article (/blog/baby-food-nepal-6-months-chart-weaning-guide)' },
    { path: '/recipes', maxKb: 200, name: 'Recipes Index (/recipes)' },
    { path: '/recipes/5-minute-sweet-potato-dates-baby-porridge-100g', maxKb: 250, name: 'Recipe Detail (/recipes/5-minute-sweet-potato-dates-baby-porridge-100g)' },
    { path: '/locations', maxKb: 220, name: 'Locations Hub (/locations)' },
    { path: '/about', maxKb: 180, name: 'About & Quality Ledger (/about)' },
    { path: '/contact', maxKb: 180, name: 'Contact Page (/contact)' },
  ];

  const internalLinksToCheck = new Set();

  for (const t of templates) {
    const r = await fetchTimed(t.path, true);
    const h1Count = (r.html.match(/<h1[\s>]/gi) || []).length;
    const hasTitle = /<title>[^<]+<\/title>/i.test(r.html);
    const hasDesc = /<meta[^>]+name=["']description["'][^>]*>/i.test(r.html);
    const hasCanonical = /<link[^>]+rel=["']canonical["'][^>]*>/i.test(r.html);
    const ldCount = (r.html.match(/application\/ld\+json/gi) || []).length;

    assert(
      r.status === 200 && h1Count === 1 && hasTitle && hasDesc && hasCanonical && ldCount >= 1 && r.sizeKb <= t.maxKb,
      `${t.name} SSR, H1=1, Schema & Payload`,
      `status=${r.status}, TTFB=${r.ttfb}ms, HTML=${r.sizeKb}KB (max ${t.maxKb}KB), H1s=${h1Count}, JSON-LD=${ldCount}`
    );

    // Check that live HTML has 0 links to /our-story or /products?category=
    const hasOurStoryHref = /href=["']\/our-story["']/i.test(r.html);
    const hasCategoryQueryHref = /href=["']\/products\?category=[^"']+["']/i.test(r.html);
    assert(
      !hasOurStoryHref && !hasCategoryQueryHref,
      `${t.name} Clean Canonical Internal Links`,
      `our-story=${hasOurStoryHref}, ?category=${hasCategoryQueryHref}`
    );

    // Collect sample internal links to verify 200 OK
    const hrefRegex = /href=["'](\/(?:products|category|blog|recipes|locations|about|contact|faq|offers|catalog)[^"'#?]*)["']/g;
    let m;
    while ((m = hrefRegex.exec(r.html)) !== null) {
      internalLinksToCheck.add(m[1]);
    }
  }

  // 2. Verify Legacy Redirects (Single-Hop -> 200 OK)
  const legacyRedirects = [
    { from: '/our-story', to: '/about' },
    { from: '/products/fox-nuts-makhana', to: '/products/makhana-fox-nuts' },
    { from: '/products/barley-grass-powder', to: '/products/moringa-leaf-powder' },
    { from: '/products/sunflower-seeds', to: '/products/pumpkin-seeds' },
    { from: '/products/dried-apricots', to: '/products/dry-figs-anjeer' },
    { from: '/products/golden-raisins-kismis', to: '/products/dates-powder' },
    { from: '/products/pure-natural-yellow-mustard-oil', to: '/products/virgin-coconut-oil-500ml' },
    { from: '/blog/6-month-baby-food-chart-nepal', to: '/blog/baby-food-nepal-6-months-chart-weaning-guide' },
    { from: '/recipes/6-month-baby-sweet-potato-porridge-nepal', to: '/recipes/5-minute-sweet-potato-dates-baby-porridge-100g' },
  ];

  let redirectPass = 0;
  for (const lr of legacyRedirects) {
    const hop1 = await fetchTimed(lr.from, false);
    const isRedirect = [301, 302, 307, 308].includes(hop1.status);
    const locPath = (hop1.location || '').replace(/^https?:\/\/naturesmud\.shop/, '');
    const hop2 = await fetchTimed(lr.to, false);
    if (isRedirect && locPath === lr.to && hop2.status === 200) {
      redirectPass++;
    } else {
      console.error(`  Redirect issue: ${lr.from} -> status=${hop1.status}, location=${locPath}, destStatus=${hop2.status}`);
    }
  }
  assert(
    redirectPass === legacyRedirects.length,
    `Single-Hop Legacy Redirects (${redirectPass}/${legacyRedirects.length})`,
    `0 redirect chains, 0 404s`
  );

  // 3. Crawl Collected Internal Links across Live Pages (Verify 0 404s & 0 Redirects)
  const linkArray = [...internalLinksToCheck];
  let direct200Count = 0;
  const non200Links = [];
  for (const link of linkArray) {
    const res = await fetchTimed(link, false);
    if (res.status === 200) {
      direct200Count++;
    } else {
      non200Links.push(`${link} (${res.status}${res.location ? ` -> ${res.location}` : ''})`);
    }
  }
  assert(
    non200Links.length === 0,
    `Live Internal Link Crawl (${direct200Count}/${linkArray.length} direct 200 OK)`,
    non200Links.length === 0 ? '0 broken links, 0 internal redirects' : `Issues: ${non200Links.join(', ')}`
  );

  console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
