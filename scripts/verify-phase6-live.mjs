import https from 'https';
import fs from 'fs';
import path from 'path';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        port: 443,
        path: u.pathname + (u.search ? u.search + '&' : '?') + '_t=' + Date.now(),
        method: 'GET',
        headers: {
          'User-Agent': 'NaturesMud-Phase6-Verifier/1.0',
          'Cache-Control': 'no-cache',
        },
        rejectUnauthorized: false,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function parseLocalProducts() {
  const rawFile = fs.readFileSync(path.join(process.cwd(), 'lib/data/products.ts'), 'utf8');
  const startMarker = 'export const products: Product[] = [';
  const startIdx = rawFile.indexOf(startMarker);
  const endIdx = rawFile.indexOf('export function getProductBySlug');
  const arrayStr = rawFile
    .slice(startIdx + 'export const products: Product[] = '.length, endIdx)
    .trim()
    .replace(/;$/, '');
  return JSON.parse(arrayStr).filter((p) => p.isActive !== false && p.isPublished !== false);
}

const FORBIDDEN_CLAIMS = [
  '525,000+',
  '25,000+',
  '3,840+',
  '280+ farmer',
  '>75% fulvic',
  '75% fulvic',
  'Gold-grade',
  'Lab Tested Purity',
  'Kosher',
  'Unsulfured',
  'unsulfured',
  'unsulphured',
];

async function run() {
  const localProducts = parseLocalProducts();
  let failures = 0;
  const results = [];

  function record(check, url, status, pass, evidence) {
    results.push({ check, url, status, pass, evidence });
    if (!pass) failures++;
    console.log(`${pass ? '✅ PASS' : '❌ FAIL'} | ${check} | ${url} | HTTP ${status} | ${evidence}`);
  }

  // 1. Verify /merchant-feed.xml
  const gmcXmlUrl = 'https://naturesmud.shop/merchant-feed.xml';
  const gmcXmlRes = await fetchUrl(gmcXmlUrl);
  const gmcItemCount = (gmcXmlRes.body.match(/<item>/g) || []).length;
  const gmcHasUnitPricing =
    gmcXmlRes.body.includes('<g:unit_pricing_measure>') &&
    gmcXmlRes.body.includes('<g:unit_pricing_base_measure>') &&
    gmcXmlRes.body.includes('<g:identifier_exists>no</g:identifier_exists>') &&
    gmcXmlRes.body.includes('<g:return_policy_label>7_day_return</g:return_policy_label>');
  const gmcForbidden = FORBIDDEN_CLAIMS.filter((c) => gmcXmlRes.body.includes(c));
  record(
    'Google Merchant XML Feed (/merchant-feed.xml)',
    gmcXmlUrl,
    gmcXmlRes.status,
    gmcXmlRes.status === 200 && gmcItemCount === 32 && gmcHasUnitPricing && gmcForbidden.length === 0,
    `<item> count=${gmcItemCount}/32, unit_pricing+identifier_exists+return_policy=${gmcHasUnitPricing}, Forbidden=${gmcForbidden.length}`
  );

  // 2. Verify /api/merchant-feed?format=json
  const gmcJsonUrl = 'https://naturesmud.shop/api/merchant-feed?format=json';
  const gmcJsonRes = await fetchUrl(gmcJsonUrl);
  let gmcJson = null;
  try {
    gmcJson = JSON.parse(gmcJsonRes.body);
  } catch {}
  record(
    'Google Merchant JSON Feed (/api/merchant-feed?format=json)',
    gmcJsonUrl,
    gmcJsonRes.status,
    gmcJsonRes.status === 200 && gmcJson?.count === 32 && Boolean(gmcJson?.gmc_nepal_note),
    `count=${gmcJson?.count}/32, gmc_nepal_note=${Boolean(gmcJson?.gmc_nepal_note)}`
  );

  // 3. Verify /meta-catalog-feed.xml
  const metaXmlUrl = 'https://naturesmud.shop/meta-catalog-feed.xml';
  const metaXmlRes = await fetchUrl(metaXmlUrl);
  const metaItemCount = (metaXmlRes.body.match(/<item>/g) || []).length;
  const metaHasFields =
    metaXmlRes.body.includes('<g:fb_product_category>') &&
    metaXmlRes.body.includes('<g:availability>in stock</g:availability>') &&
    metaXmlRes.body.includes('<g:custom_label_0>');
  const metaForbidden = FORBIDDEN_CLAIMS.filter((c) => metaXmlRes.body.includes(c));
  record(
    'Meta Catalog XML Feed (/meta-catalog-feed.xml)',
    metaXmlUrl,
    metaXmlRes.status,
    metaXmlRes.status === 200 && metaItemCount === 32 && metaHasFields && metaForbidden.length === 0,
    `<item> count=${metaItemCount}/32, fb_product_category+in_stock+custom_labels=${metaHasFields}, Forbidden=${metaForbidden.length}`
  );

  // 4. Verify /meta-catalog-feed.csv
  const metaCsvUrl = 'https://naturesmud.shop/meta-catalog-feed.csv';
  const metaCsvRes = await fetchUrl(metaCsvUrl);
  const metaCsvLines = metaCsvRes.body.trim().split('\n');
  const metaCsvHeaderOk = metaCsvLines[0]?.startsWith(
    'id,title,description,availability,condition,price,link,image_link,additional_image_link,brand'
  );
  record(
    'Meta Catalog CSV Feed (/meta-catalog-feed.csv)',
    metaCsvUrl,
    metaCsvRes.status,
    metaCsvRes.status === 200 && metaCsvLines.length === 33 && metaCsvHeaderOk,
    `rows=${metaCsvLines.length - 1}/32 products, header valid=${metaCsvHeaderOk}`
  );

  // 5. Verify /daraz-top-10-listings.json
  const darazJsonUrl = 'https://naturesmud.shop/daraz-top-10-listings.json';
  const darazJsonRes = await fetchUrl(darazJsonUrl);
  let darazData = null;
  try {
    darazData = JSON.parse(darazJsonRes.body);
  } catch {}
  const darazListings = darazData?.listings || [];
  let darazPriceMismatches = 0;
  for (const item of darazListings) {
    const localProd = localProducts.find((p) => p.slug === item.slug);
    if (!localProd || Number(localProd.price) !== Number(item.priceNpr)) {
      darazPriceMismatches++;
    }
  }
  const darazForbidden = FORBIDDEN_CLAIMS.filter((c) => darazJsonRes.body.includes(c));
  const darazHasBabyNote = darazJsonRes.body.includes('from 6 months, as advised by your pediatrician');
  record(
    'Daraz Top 10 JSON Pack (/daraz-top-10-listings.json)',
    darazJsonUrl,
    darazJsonRes.status,
    darazJsonRes.status === 200 &&
      darazListings.length === 10 &&
      darazPriceMismatches === 0 &&
      darazForbidden.length === 0 &&
      darazHasBabyNote,
    `listings=${darazListings.length}/10, priceMismatches=${darazPriceMismatches}, babyNote=${darazHasBabyNote}, Forbidden=${darazForbidden.length}`
  );

  // 6. Verify /daraz-top-10-listings.csv
  const darazCsvUrl = 'https://naturesmud.shop/daraz-top-10-listings.csv';
  const darazCsvRes = await fetchUrl(darazCsvUrl);
  const darazCsvLines = darazCsvRes.body.trim().split('\n');
  const darazCsvHeaderOk = darazCsvLines[0]?.startsWith(
    'Rank,SellerSKU,OfficialLabelName,DarazProductTitle,DarazCategoryPath,PriceNPR'
  );
  record(
    'Daraz Top 10 CSV Pack (/daraz-top-10-listings.csv)',
    darazCsvUrl,
    darazCsvRes.status,
    darazCsvRes.status === 200 && darazCsvLines.length === 11 && darazCsvHeaderOk,
    `rows=${darazCsvLines.length - 1}/10 SKUs, header valid=${darazCsvHeaderOk}`
  );

  // 7. Verify /llms.txt canonical alignment
  const llmsUrl = 'https://naturesmud.shop/llms.txt';
  const llmsRes = await fetchUrl(llmsUrl);
  const llmsForbidden = FORBIDDEN_CLAIMS.filter((c) => llmsRes.body.includes(c));
  const llmsHasFeeds =
    llmsRes.body.includes('/merchant-feed.xml') &&
    llmsRes.body.includes('/meta-catalog-feed.xml') &&
    llmsRes.body.includes('/daraz-top-10-listings.csv') &&
    llmsRes.body.includes('/category/powders');
  record(
    'LLMs.txt Canonical Alignment (/llms.txt)',
    llmsUrl,
    llmsRes.status,
    llmsRes.status === 200 && llmsForbidden.length === 0 && llmsHasFeeds,
    `Feeds + /category/ hubs present=${llmsHasFeeds}, Forbidden=${llmsForbidden.length === 0 ? '0' : llmsForbidden.join(', ')}`
  );

  console.log(`\n========================================`);
  console.log(`PHASE 6 LIVE VERIFICATION SUMMARY: ${results.length - failures}/${results.length} PASSED (${failures} failures)`);
  console.log(`========================================`);
  if (failures > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
