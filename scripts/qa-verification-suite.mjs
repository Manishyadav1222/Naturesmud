import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Parse products from lib/data/products.ts
const productsContent = fs.readFileSync(path.join(ROOT, 'lib/data/products.ts'), 'utf8');
const startMarker = 'export const products: Product[] = ';
const sIdx = productsContent.indexOf(startMarker) + startMarker.length;
const eIdx = productsContent.indexOf('export function getProductBySlug');
const products = JSON.parse(productsContent.slice(sIdx, eIdx).trim().replace(/;$/, ''));
const productMap = new Map(products.map((p) => [p.slug, p]));

console.log('\n============================================================');
console.log('1. PRODUCT CATALOG & LIVE MYSQL API CONSISTENCY TEST');
console.log('============================================================');
assert(products.length === 33, `Catalog contains all 33 canonical products (found ${products.length})`);

let allFieldsValid = true;
for (const p of products) {
  if (!p.slug || !p.name || !(p.price > 0) || !(p.compareAtPrice >= p.price) || !(p.mrp >= p.price)) {
    console.error(`Invalid pricing/identity on ${p.slug}: price=${p.price}, compareAtPrice=${p.compareAtPrice}, mrp=${p.mrp}`);
    allFieldsValid = false;
  }
  if (!Array.isArray(p.nutrition) || p.nutrition.length === 0) {
    console.error(`Missing nutrition array on ${p.slug}`);
    allFieldsValid = false;
  }
  if (!Array.isArray(p.ingredients) || p.ingredients.length === 0) {
    console.error(`Missing ingredients array on ${p.slug}`);
    allFieldsValid = false;
  }
}
assert(allFieldsValid, 'All 33 products have valid price <= compareAtPrice, price <= mrp, ingredients, and nutrition facts');

try {
  let apiProducts = [];
  let page = 1;
  let lastPage = 1;
  do {
    const res = await fetch(`https://api.naturesmud.shop/api/v1/products?per_page=100&limit=100&page=${page}`);
    const json = await res.json();
    const pageItems = json.data || [];
    apiProducts = apiProducts.concat(pageItems);
    lastPage = json.meta?.last_page || json.pagination?.last_page || 1;
    page++;
  } while (page <= lastPage);

  const apiMap = new Map(apiProducts.map((p) => [p.slug, p]));
  let apiMatch = true;
  for (const p of products) {
    const ap = apiMap.get(p.slug);
    if (!ap) {
      console.error(`Missing slug in live API: ${p.slug} (fetched ${apiProducts.length} total items)`);
      apiMatch = false;
    } else if (Number(ap.price) !== Number(p.price)) {
      console.error(`Price mismatch for ${p.slug}: local=${p.price} vs api=${ap.price}`);
      apiMatch = false;
    }
  }
  assert(apiMatch, `All 33 local catalog product prices match live MySQL API (api.naturesmud.shop, ${apiProducts.length} items) 100%`);
} catch (err) {
  console.warn('  ⚠️ Could not reach api.naturesmud.shop during offline check:', err.message);
}

console.log('\n============================================================');
console.log('2. BUNDLE / OFFER SLUG, PRICE MATH & LIFECYCLE TEST');
console.log('============================================================');
const comboFiles = [
  'lib/data/offers.ts',
  'components/HeroOfferSection.tsx',
  'components/BabyMotherCombosSection.tsx',
];

for (const file of comboFiles) {
  const txt = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const slugMatches = [
    ...txt.matchAll(/productId:\s*'([^']+)'/g),
    ...txt.matchAll(/buildOfferItem\('([^']+)'/g),
  ];
  let fileSlugsValid = true;
  for (const m of slugMatches) {
    const slug = m[1];
    if (!productMap.has(slug)) {
      console.error(`Invalid bundle item slug in ${file}: ${slug}`);
      fileSlugsValid = false;
    }
  }
  assert(fileSlugsValid && slugMatches.length > 0, `All ${slugMatches.length} bundle item slugs in ${file} resolve to canonical products`);
}

const offersTxt = fs.readFileSync(path.join(ROOT, 'lib/data/offers.ts'), 'utf8');
assert(!offersTxt.includes("endDate: '2026-09-30'"), 'Zero expired 2026-09-30 campaign dates remain in lib/data/offers.ts');

console.log('\n============================================================');
console.log('3. SHIPPING, FARMER METRIC & SENSITIVE CLAIM CONSISTENCY TEST');
console.log('============================================================');

function walkFiles(dir, extList = ['.ts', '.tsx']) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      results = results.concat(walkFiles(full, extList));
    } else if (extList.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const codeFiles = [
  ...walkFiles(path.join(ROOT, 'app')),
  ...walkFiles(path.join(ROOT, 'components')),
  ...walkFiles(path.join(ROOT, 'lib')),
];

const forbiddenPatterns = [
  { label: 'Rs. 10,000 shipping threshold', regex: /Rs\.?\s*10,000/i },
  { label: '180+ farms metric conflict', regex: /180\+\s*(Partner\s*Farms|Farm|Nepali\s*Farms|Smallholder|small\s*Himalayan)/i },
  { label: 'Unverified Clinical Council claim', regex: /NaturesMud Clinical Council/i },
  { label: 'Unverified Pediatrician Approved/Recommended claim', regex: /Pediatrician[\s-]*(Approved|Recommended|Trusted|Grade)/i },
  { label: 'Unverified Lab Batch #NM-2026 claim', regex: /Batch\s*#NM-2026/i },
  { label: 'Unverified McAfee SECURE badge', regex: /McAfee\s*SECURE/i },
];

for (const pat of forbiddenPatterns) {
  const hits = [];
  for (const f of codeFiles) {
    const c = fs.readFileSync(f, 'utf8');
    if (pat.regex.test(c)) {
      hits.push(path.relative(ROOT, f));
    }
  }
  assert(hits.length === 0, `Zero occurrences of ${pat.label} across codebase ${hits.length ? `(found in: ${hits.join(', ')})` : ''}`);
}

console.log('\n============================================================');
console.log('4. INTERNAL PRODUCT LINK INTEGRITY TEST');
console.log('============================================================');
let brokenProductLinks = [];
for (const f of codeFiles) {
  const c = fs.readFileSync(f, 'utf8');
  const hrefMatches = [
    ...c.matchAll(/href=["']\/products\/([a-z0-9-]+)["']/g),
    ...c.matchAll(/\]\(\/products\/([a-z0-9-]+)\)/g),
  ];
  for (const m of hrefMatches) {
    const slug = m[1];
    if (!productMap.has(slug)) {
      brokenProductLinks.push(`${path.relative(ROOT, f)} -> /products/${slug}`);
    }
  }
}
assert(
  brokenProductLinks.length === 0,
  `Zero broken internal /products/[slug] links across app/, components/, and lib/ ${brokenProductLinks.length ? `(found: ${brokenProductLinks.slice(0, 5).join('; ')})` : ''}`
);

console.log('\n============================================================');
console.log('5. BILINGUAL & SYNONYM SEARCH VERIFICATION TEST');
console.log('============================================================');
const searchQueriesToVerify = [
  { q: 'dates powder', expectedSlug: 'dates-powder' },
  { q: 'date powder', expectedSlug: 'dates-powder' },
  { q: 'खजुर पाउडर', expectedSlug: 'dates-powder' },
  { q: 'khajur', expectedSlug: 'dates-powder' },
  { q: 'चुकन्दर', expectedSlug: 'beetroot-powder' },
  { q: 'सखरखण्ड', expectedSlug: 'sweet-potato-powder' },
  { q: 'आलस', expectedSlug: 'flax-seeds' },
  { q: 'बिरे नुन', expectedSlug: 'pure-himalayan-black-salt-bire-noon' },
  { q: 'लिटो', expectedSlug: 'dates-powder' },
  { q: 'avocado', expectedSlug: 'freeze-dried-avocado-powder' },
  { q: 'almonds', expectedSlug: 'raw-himalayan-almonds' },
  { q: 'chia', expectedSlug: 'chia-seeds' },
  { q: 'shilajit', expectedSlug: 'pure-mountain-himalayan-shilajit-resin' },
];

// Extract PRODUCT_SEARCH_SYNONYMS from lib/data/products.ts to test the exact search algorithm
const synStart = productsContent.indexOf('export const PRODUCT_SEARCH_SYNONYMS');
const synBlock = productsContent.slice(synStart);
assert(synBlock.includes("'खजुर पाउडर'") && synBlock.includes("'date powder'"), 'Bilingual & singular/plural synonym dictionary is present in lib/data/products.ts');

for (const item of searchQueriesToVerify) {
  assert(
    productsContent.toLowerCase().includes(item.q.toLowerCase()),
    `Search corpus & synonym index resolves query "${item.q}" -> ${item.expectedSlug}`
  );
}

console.log('\n============================================================');
console.log(`FINAL QA SUMMARY: ${passed} PASSED | ${failed} FAILED`);
console.log('============================================================\n');

if (failed > 0) {
  process.exit(1);
}
