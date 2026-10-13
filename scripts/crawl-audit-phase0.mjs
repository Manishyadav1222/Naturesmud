/**
 * Comprehensive Phase 0 Audit & Baseline Crawler
 * Audits https://naturesmud.shop & local source code
 */
import fs from 'fs';
import path from 'path';

const LIVE_SITE = 'https://naturesmud.shop';

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NaturesMudAuditBot/1.0)',
        'Cache-Control': 'no-cache',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(15000),
    });
    const status = res.status;
    const location = res.headers.get('location');
    const text = status === 200 ? await res.text() : '';
    return { url, status, location, text };
  } catch (err) {
    return { url, status: 0, error: err.message, text: '' };
  }
}

async function runAudit() {
  console.log('🚀 Starting Phase 0 Full Site Audit on ' + LIVE_SITE);

  const localProductsRaw = fs.readFileSync(path.join(process.cwd(), 'lib/data/products.ts'), 'utf8');
  const startMarker = 'export const products: Product[] = [';
  const startIdx = localProductsRaw.indexOf(startMarker);
  const endIdx = localProductsRaw.indexOf('export function getProductBySlug');
  const arrayStr = localProductsRaw.slice(startIdx + 'export const products: Product[] = '.length, endIdx).trim().replace(/;$/, '');
  const products = JSON.parse(arrayStr);

  const coreUrls = [
    '/',
    '/products',
    '/catalog',
    '/offers',
    '/about',
    '/blog',
    '/recipes',
    '/faq',
    '/contact',
    '/track-order',
    '/cart',
    '/checkout',
    '/wishlist',
    '/account',
    '/shipping-policy',
    '/return-refund-policy',
    '/return-policy',
    '/privacy-policy',
    '/terms',
    '/shipping', // in sitemap
    '/returns',  // in sitemap
    '/privacy',  // in sitemap
    '/robots.txt',
    '/sitemap.xml',
    '/llms.txt',
  ];

  const categoryUrls = [
    '/category/powders',
    '/category/dried-fruits',
    '/category/nuts',
    '/category/seeds',
    '/category/oils',
    '/category/salts-spices',
  ];

  const productUrls = products.map((p) => `/products/${p.slug}`);

  const allUrlsToTest = [...coreUrls, ...categoryUrls, ...productUrls];
  console.log(`Auditing ${allUrlsToTest.length} primary URLs...`);

  const results = [];
  const concurrency = 5;
  for (let i = 0; i < allUrlsToTest.length; i += concurrency) {
    const chunk = allUrlsToTest.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async (relativeUrl) => {
        const fullUrl = `${LIVE_SITE}${relativeUrl}`;
        const page = await fetchPage(fullUrl);

        let title = '';
        let metaDesc = '';
        let metaKeywords = '';
        let canonical = '';
        let ogType = '';
        let h1 = '';
        let missingAlts = 0;
        let imagesTotal = 0;
        let jsonLdCount = 0;
        let jsonLdTypes = [];
        let hasKeywordsMeta = false;
        let claims = [];

        if (page.status === 200 && page.text) {
          const tMatch = page.text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          title = tMatch ? tMatch[1].trim() : '';

          const dMatch = page.text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
          metaDesc = dMatch ? dMatch[1].trim() : '';

          const kMatch = page.text.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["']/i);
          if (kMatch) {
            hasKeywordsMeta = true;
            metaKeywords = kMatch[1].trim();
          }

          const cMatch = page.text.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
          canonical = cMatch ? cMatch[1].trim() : '';

          const ogMatch = page.text.match(/<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']*)["']/i);
          ogType = ogMatch ? ogMatch[1].trim() : '';

          const h1Match = page.text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
          h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

          const imgMatches = [...page.text.matchAll(/<img\s+([^>]+)>/gi)];
          imagesTotal = imgMatches.length;
          for (const m of imgMatches) {
            const attr = m[1];
            if (!attr.includes('alt=') || /alt=["']\s*["']/.test(attr)) {
              missingAlts++;
            }
          }

          const ldMatches = [...page.text.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
          jsonLdCount = ldMatches.length;
          for (const lm of ldMatches) {
            try {
              const parsed = JSON.parse(lm[1]);
              if (parsed['@type']) jsonLdTypes.push(parsed['@type']);
              if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
                parsed['@graph'].forEach((node) => {
                  if (node['@type']) jsonLdTypes.push(node['@type']);
                });
              }
            } catch (e) {
              jsonLdTypes.push('SYNTAX_ERROR');
            }
          }

          // Check compliance words
          if (/98%\s*(?:natural\s*)?vitamins/i.test(page.text)) claims.push('98%_VITAMINS_CLAIM');
          if (/\bpurity tested\b/i.test(page.text)) claims.push('PURITY_TESTED_BADGE');
          if (/\bverified guarantee\b/i.test(page.text)) claims.push('VERIFIED_GUARANTEE_BADGE');
          if (/\bfair trade\b/i.test(page.text)) claims.push('FAIR_TRADE_BADGE');
          if (/\borganic\b/i.test(page.text) && !/non-organic/i.test(page.text)) claims.push('ORGANIC_CLAIM');
          if (/baby/i.test(page.text) && !/pediatrician/i.test(page.text) && relativeUrl.includes('/products/')) {
            claims.push('BABY_WITHOUT_PEDIATRICIAN_ADVICE');
          }
        }

        return {
          path: relativeUrl,
          status: page.status,
          location: page.location,
          error: page.error,
          title,
          titleLength: title.length,
          metaDesc,
          metaDescLength: metaDesc.length,
          hasKeywordsMeta,
          canonical,
          ogType,
          h1,
          imagesTotal,
          missingAlts,
          jsonLdCount,
          jsonLdTypes: [...new Set(jsonLdTypes.flat())],
          claims,
        };
      })
    );
    results.push(...chunkResults);
    process.stdout.write(`Processed ${Math.min(i + concurrency, allUrlsToTest.length)}/${allUrlsToTest.length}\r`);
  }

  console.log('\nAudit complete! Generating summary report...');
  fs.writeFileSync('scripts/phase0-audit-results.json', JSON.stringify(results, null, 2));

  // Print summary statistics
  const brokenLinks = results.filter((r) => r.status >= 400 || r.status === 0);
  const redirects = results.filter((r) => r.status >= 300 && r.status < 400);
  const okPages = results.filter((r) => r.status === 200);
  const pagesWithKeywords = results.filter((r) => r.hasKeywordsMeta);
  const longTitles = results.filter((r) => r.titleLength > 60);
  const improperMetaDesc = results.filter((r) => r.status === 200 && (r.metaDescLength < 140 || r.metaDescLength > 165));
  const productPagesWithWrongOgType = results.filter((r) => r.path.startsWith('/products/') && r.ogType !== 'product');
  const pagesWithClaims = results.filter((r) => r.claims && r.claims.length > 0);

  console.log('\n=== PHASE 0 AUDIT METRICS ===');
  console.log(`Total URLs Audited: ${results.length}`);
  console.log(`200 OK Pages: ${okPages.length}`);
  console.log(`Broken Links (4xx/5xx/Error): ${brokenLinks.length}`);
  brokenLinks.forEach((b) => console.log(`  ❌ [${b.status}] ${b.path}`));
  console.log(`Redirects (3xx): ${redirects.length}`);
  console.log(`Pages with <meta name="keywords">: ${pagesWithKeywords.length}`);
  console.log(`Titles > 60 chars: ${longTitles.length}`);
  console.log(`Meta descriptions outside 140-165 chars: ${improperMetaDesc.length}`);
  console.log(`Product pages with og:type !== "product": ${productPagesWithWrongOgType.length}`);
  console.log(`Pages with unbacked / unhedged claims: ${pagesWithClaims.length}`);
}

runAudit().catch(console.error);
