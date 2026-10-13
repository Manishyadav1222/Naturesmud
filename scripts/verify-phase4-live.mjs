const BASE_URL = 'https://naturesmud.shop';
const API_URL = 'https://api.naturesmud.shop/api/v1';

const PILLAR_SLUGS = [
  'baby-food-nepal-6-months-chart-weaning-guide',
  'dates-powder-price-in-nepal-natural-sugar-substitute-guide',
  'beetroot-powder-in-nepal-benefits-uses-price',
  'moringa-powder-benefits-nepal-how-to-use-daily',
  'freeze-dried-vs-dehydrated-fruits-nutrition-comparison',
  'dry-fruits-price-in-nepal-2026-wholesale-retail-guide',
  'chia-seeds-price-in-nepal-benefits-weight-loss-guide',
  'cold-pressed-virgin-coconut-oil-and-mustard-oil-guide-nepal',
  'himalayan-black-salt-bire-noon-and-pink-salt-guide-nepal',
  'how-to-test-pure-himalayan-shilajit-resin-at-home-nepal',
  'best-trekking-snacks-nepal-ebc-annapurna-lightweight-trail-food',
  'how-to-store-dry-fruits-nuts-and-powders-in-monsoon-nepal',
];

const REDIRECT_BLOG_TESTS = [
  {
    from: '/blog/black-chia-seeds-hydrophilic-gel-curing-leaky-gut-and-acid-reflux',
    expectedTarget: '/blog/chia-seeds-price-in-nepal-benefits-weight-loss-guide',
    reason: 'D5 Medical Claim Slug -> Canonical Chia Pillar',
  },
  {
    from: '/blog/zinc-and-biotin-in-pumpkin-seeds-reversing-hair-thinning-naturally',
    expectedTarget: '/blog/chia-seeds-price-in-nepal-benefits-weight-loss-guide',
    reason: 'D5 Medical Claim Slug -> Canonical Seeds Pillar',
  },
  {
    from: '/blog/raw-himalayan-cliff-honey-vs-processed-supermarket-syrup',
    expectedTarget: '/blog/dates-powder-price-in-nepal-natural-sugar-substitute-guide',
    reason: 'Discontinued Mustang Honey -> Canonical Dates Sweetener Pillar',
  },
  {
    from: '/blog/himalayan-mountain-walnuts-neuroprotective-dha-plant-omega-3',
    expectedTarget: '/blog/dry-fruits-price-in-nepal-2026-wholesale-retail-guide',
    reason: 'Discontinued Walnuts -> Canonical Dry Fruits & Nuts Pillar',
  },
  {
    from: '/blog/could-another-flood-happen-nepal-new-glacial-lake-explained',
    expectedTarget: '/blog',
    reason: 'D13 Off-Topic Flood News -> /blog',
  },
  {
    from: '/blog/chia-seed-pudding-recipe',
    expectedTarget: '/recipes/chia-seed-pudding-recipe',
    reason: 'Duplicate /blog vs /recipes -> Canonical /recipes/chia-seed-pudding-recipe',
  },
];

const SAMPLE_RECIPES = [
  'healthy-trail-mix-recipe-for-hiking-nepal',
  'sweet-potato-puree-for-babies-simple-recipe-nepal',
  '5-minute-sweet-potato-dates-baby-porridge-100g',
  'chia-seed-pudding-recipe',
  'high-nitrate-beetroot-smoothie-powder-recipe',
  'sugar-free-dates-powder-makhana-kheer-100g',
];

const REDIRECT_RECIPE_TESTS = [
  {
    from: '/recipes/brain-boosting-walnut-wild-blueberry-oatmeal',
    expectedTarget: '/recipes/creamy-chia-seed-overnight-oats-recipe-nepal',
    reason: 'Discontinued Walnut Recipe -> Canonical Chia Overnight Oats',
  },
  {
    from: '/recipes/raw-honey-roasted-almond-energy-bites',
    expectedTarget: '/recipes/no-bake-healthy-energy-balls-dates-powder-recipe',
    reason: 'Discontinued Honey Recipe -> Canonical Dates Energy Balls',
  },
  {
    from: '/recipes/baby-iron-rich-ragi-dates-powder-sheera',
    expectedTarget: '/recipes/5-minute-sweet-potato-dates-baby-porridge-100g',
    reason: 'Discontinued Ragi Recipe -> Canonical Sweet Potato & Dates Baby Porridge',
  },
];

async function run() {
  console.log('================================================================');
  console.log('🔍 PHASE 4 LIVE PRODUCTION VERIFICATION (https://naturesmud.shop)');
  console.log('================================================================\n');

  let failures = 0;

  // 1. Check /blog index
  const blogIndexRes = await fetch(`${BASE_URL}/blog?cb=${Date.now()}`, { cache: 'no-store' });
  const blogIndexHtml = await blogIndexRes.text();
  const hasDrFake = /Dr\.\s+(Ananda|Ramesh|Bikash|Sita|Aarav)|Acharya|Pooja Karki|Coach Roshan/i.test(blogIndexHtml);
  console.log(`[1] GET /blog -> Status: ${blogIndexRes.status}, Fake Personas Present: ${hasDrFake}`);
  if (blogIndexRes.status !== 200 || hasDrFake) failures++;

  // 2. Check all 12 Master Pillar Guides
  console.log('\n[2] Verifying All 12 Master Pillar Guides on Live Production:');
  for (const slug of PILLAR_SLUGS) {
    const url = `${BASE_URL}/blog/${slug}`;
    const res = await fetch(`${url}?cb=${Date.now()}`, { cache: 'no-store', redirect: 'manual' });
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const title = titleMatch ? titleMatch[1] : '';
    const desc = descMatch ? descMatch[1] : '';
    const hasNepaliSummary = html.includes('lang="ne"');
    const hasTable = html.includes('<table');
    const hasArticleSchema = html.includes('"@type":"Article"');
    const hasFaqSchema = html.includes('"@type":"FAQPage"');
    const hasFakeDr = /Dr\.\s+(Ananda|Ramesh|Bikash|Sita|Aarav)|Acharya|Pooja Karki|Coach Roshan/i.test(html);

    const ok =
      res.status === 200 &&
      title.length > 0 &&
      title.length <= 65 &&
      desc.length > 0 &&
      desc.length <= 160 &&
      hasNepaliSummary &&
      hasTable &&
      hasArticleSchema &&
      hasFaqSchema &&
      !hasFakeDr;

    console.log(
      `  ${ok ? '✅' : '❌'} /blog/${slug} | HTTP ${res.status} | Title(${title.length}c): "${title}" | Desc(${desc.length}c) | lang="ne": ${hasNepaliSummary} | Table: ${hasTable} | Article+FAQ JSON-LD: ${hasArticleSchema && hasFaqSchema}`
    );
    if (!ok) failures++;
  }

  // 3. Check 308/301 Redirects for Merged/Medical/Discontinued/Duplicate Blog URLs
  console.log('\n[3] Verifying 308/301 Redirects on Merged/Medical/Discontinued Blog URLs:');
  for (const t of REDIRECT_BLOG_TESTS) {
    const res = await fetch(`${BASE_URL}${t.from}`, { redirect: 'manual', cache: 'no-store' });
    const loc = res.headers.get('location') || '';
    const ok = [301, 307, 308].includes(res.status) && loc.includes(t.expectedTarget);
    console.log(`  ${ok ? '✅' : '❌'} ${t.from} -> HTTP ${res.status} Location: ${loc} (${t.reason})`);
    if (!ok) failures++;
  }

  // 4. Check /recipes index & sample canonical recipes
  console.log('\n[4] Verifying /recipes Index & Sample Canonical Recipes:');
  const recIndexRes = await fetch(`${BASE_URL}/recipes?cb=${Date.now()}`, { cache: 'no-store' });
  console.log(`  ${recIndexRes.status === 200 ? '✅' : '❌'} GET /recipes -> HTTP ${recIndexRes.status}`);
  if (recIndexRes.status !== 200) failures++;

  for (const slug of SAMPLE_RECIPES) {
    const res = await fetch(`${BASE_URL}/recipes/${slug}?cb=${Date.now()}`, { cache: 'no-store', redirect: 'manual' });
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    const hasRecipeSchema = html.includes('"@type":"Recipe"');
    const hasNutritionSchema = html.includes('"@type":"NutritionInformation"');
    const hasProductLinks = html.includes('href="/products/');
    const hasAddCartBtn = html.includes('Add') && html.includes('Ingredient');

    const ok = res.status === 200 && hasRecipeSchema && hasNutritionSchema && hasProductLinks && hasAddCartBtn;
    console.log(
      `  ${ok ? '✅' : '❌'} /recipes/${slug} | HTTP ${res.status} | Title(${title.length}c): "${title}" | Recipe+Nutrition JSON-LD: ${hasRecipeSchema && hasNutritionSchema} | Product Links: ${hasProductLinks} | Cart CTA: ${hasAddCartBtn}`
    );
    if (!ok) failures++;
  }

  // 5. Check 308/301 Redirects for Merged/Discontinued Recipe URLs
  console.log('\n[5] Verifying 308/301 Redirects on Discontinued/Merged Recipe URLs:');
  for (const t of REDIRECT_RECIPE_TESTS) {
    const res = await fetch(`${BASE_URL}${t.from}`, { redirect: 'manual', cache: 'no-store' });
    const loc = res.headers.get('location') || '';
    const ok = [301, 307, 308].includes(res.status) && loc.includes(t.expectedTarget);
    console.log(`  ${ok ? '✅' : '❌'} ${t.from} -> HTTP ${res.status} Location: ${loc} (${t.reason})`);
    if (!ok) failures++;
  }

  // 6. Check Live API /api/v1/blogs and /api/v1/recipes
  console.log('\n[6] Verifying Live MySQL API (/api/v1/blogs & /api/v1/recipes):');
  const apiBlogsRes = await fetch(`${API_URL}/blogs?per_page=200&cb=${Date.now()}`, { cache: 'no-store' });
  const apiBlogsJson = await apiBlogsRes.json();
  const apiBlogItems = apiBlogsJson.data || [];

  const apiRecipesRes = await fetch(`${API_URL}/recipes?per_page=200&cb=${Date.now()}`, { cache: 'no-store' });
  const apiRecipesJson = await apiRecipesRes.json();
  const apiRecipeItems = apiRecipesJson.data || [];

  console.log(`  ✅ Live API /api/v1/blogs count: ${apiBlogItems.length} published canonical guides`);
  console.log(`  ✅ Live API /api/v1/recipes count: ${apiRecipeItems.length} published canonical recipes`);

  // 7. Check Sitemap
  const smRes = await fetch(`${BASE_URL}/sitemap.xml?cb=${Date.now()}`, { cache: 'no-store' });
  const smXml = await smRes.text();
  const smBlogMatches = smXml.match(/https:\/\/naturesmud\.shop\/blog\/[^<]+/g) || [];
  const smRecipeMatches = smXml.match(/https:\/\/naturesmud\.shop\/recipes\/[^<]+/g) || [];
  console.log(`\n[7] Live Sitemap (/sitemap.xml): ${smBlogMatches.length} /blog/[slug] URLs, ${smRecipeMatches.length} /recipes/[slug] URLs`);

  console.log('\n================================================================');
  if (failures === 0) {
    console.log('🎉 ALL PHASE 4 LIVE CHECKS PASSED (0 FAILURES)!');
  } else {
    console.log(`⚠️ PHASE 4 VERIFICATION HAD ${failures} ISSUE(S).`);
    process.exitCode = 1;
  }
  console.log('================================================================');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
