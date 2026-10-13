const BASE_URL = 'https://naturesmud.shop';

const SAMPLE_PRODUCTS = [
  { slug: 'beetroot-powder', expectVideo: true, expectVariant: false },
  { slug: 'moringa-leaf-powder', expectVideo: false, expectVariant: false },
  { slug: 'virgin-coconut-oil-500ml', expectVideo: true, expectVariant: true },
  { slug: 'virgin-coconut-oil-180ml', expectVideo: true, expectVariant: true },
  { slug: 'raw-himalayan-almonds', expectVideo: true, expectVariant: true },
  { slug: 'premium-cashewnuts', expectVideo: false, expectVariant: true },
  { slug: 'himalayan-pink-salt', expectVideo: false, expectVariant: true },
  { slug: 'pure-mountain-himalayan-shilajit-resin', expectVideo: false, expectVariant: false },
  { slug: 'premium-pistachio-roasted-salted', expectVideo: false, expectVariant: false },
];

const CATEGORIES = [
  'dried-fruits',
  'powders',
  'nuts',
  'seeds',
  'oils',
  'salts-spices',
];

function decodeHtml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function checkProduct(item) {
  const url = `${BASE_URL}/products/${item.slug}?_t=${Date.now()}`;
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
  const html = await res.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

  const title = titleMatch ? decodeHtml(titleMatch[1].trim()) : '';
  const desc = descMatch ? decodeHtml(descMatch[1].trim()) : '';
  const h1 = h1Match ? decodeHtml(h1Match[1].replace(/<[^>]+>/g, '').trim()) : '';

  const hasUnitPrice = /Rs\.\s*[\d.]+\s*\/\s*(100g|100ml|1g)/i.test(html);
  const hasNepaliKitchen = /Nepali Kitchen Guide/i.test(html);
  const hasComparisonTable = /Typical Commercial Alternative/i.test(html);
  const hasMonsoonStorage = /Monsoon Storage in Nepal/i.test(html);
  const hasLabelProof = /Batch Transparency/i.test(html);
  const hasUsdaAttribution = /USDA FoodData Central/i.test(html);
  const hasVideoTag = /<video\b/i.test(html);
  const hasVariantSwitcher = /Choose Bottle Size|Choose Almond Style|Choose Cashew Style|Choose Himalayan Salt/i.test(html);

  return {
    slug: item.slug,
    status: res.status,
    title,
    titleLen: title.length,
    desc,
    descLen: desc.length,
    h1,
    hasUnitPrice,
    hasNepaliKitchen,
    hasComparisonTable,
    hasMonsoonStorage,
    hasLabelProof,
    hasUsdaAttribution,
    hasVideoTag,
    videoExpected: item.expectVideo,
    hasVariantSwitcher,
    variantExpected: item.expectVariant,
  };
}

async function checkCategory(cat) {
  const url = `${BASE_URL}/products?category=${cat}&_t=${Date.now()}`;
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
  const html = await res.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

  const title = titleMatch ? decodeHtml(titleMatch[1].trim()) : '';
  const desc = descMatch ? decodeHtml(descMatch[1].trim()) : '';
  const h1 = h1Match ? decodeHtml(h1Match[1].replace(/<[^>]+>/g, '').trim()) : '';
  const hasComparisonTable = /Price, Net Weight &amp; Unit Price Comparison in Nepal/i.test(html);
  const hasFaqSchema = /"@type":"FAQPage"/i.test(html);

  return {
    category: cat,
    status: res.status,
    title,
    titleLen: title.length,
    desc,
    descLen: desc.length,
    h1,
    hasComparisonTable,
    hasFaqSchema,
  };
}

async function run() {
  console.log('=== VERIFYING PHASE 2 LIVE PRODUCT PAGES ===');
  for (const item of SAMPLE_PRODUCTS) {
    const r = await checkProduct(item);
    console.log(JSON.stringify(r, null, 2));
  }

  console.log('\n=== VERIFYING PHASE 2 LIVE CATEGORY HUBS ===');
  for (const cat of CATEGORIES) {
    const r = await checkCategory(cat);
    console.log(JSON.stringify(r, null, 2));
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
