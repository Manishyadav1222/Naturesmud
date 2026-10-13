const BASE = 'https://naturesmud.shop';

async function check() {
  console.log('=== PHASE 9 LIVE VERIFICATION (https://naturesmud.shop) ===\n');
  let passed = 0;
  let failed = 0;

  function record(ok, label, detail = '') {
    if (ok) {
      passed++;
      console.log(`✅ PASS: ${label}${detail ? ` — ${detail}` : ''}`);
    } else {
      failed++;
      console.error(`❌ FAIL: ${label}${detail ? ` — ${detail}` : ''}`);
    }
  }

  // 1. Sitemap & Robots for Search Console / Bing Webmaster Tools
  try {
    const [smRes, rbRes] = await Promise.all([
      fetch(`${BASE}/sitemap.xml`, { headers: { 'Cache-Control': 'no-cache' } }),
      fetch(`${BASE}/robots.txt`, { headers: { 'Cache-Control': 'no-cache' } }),
    ]);
    const smText = await smRes.text();
    const rbText = await rbRes.text();
    const locMatches = smText.match(/<loc>/g) || [];
    record(
      smRes.status === 200 && locMatches.length === 99,
      'Search Console & Bing Sitemap (/sitemap.xml)',
      `status=${smRes.status}, urls=${locMatches.length}`
    );
    record(
      rbRes.status === 200 && rbText.includes('Sitemap: https://naturesmud.shop/sitemap.xml'),
      'Robots.txt Sitemap & Crawler Directives (/robots.txt)',
      `status=${rbRes.status}, bytes=${rbText.length}`
    );
  } catch (err) {
    record(false, 'Search Console & Bing Sitemap / Robots', err.message);
  }

  // 2. AI Grounding Endpoints (/llms.txt & /api/entities/products)
  try {
    const [llmsRes, entRes] = await Promise.all([
      fetch(`${BASE}/llms.txt`, { headers: { 'Cache-Control': 'no-cache' } }),
      fetch(`${BASE}/api/entities/products`, { headers: { 'Cache-Control': 'no-cache' } }),
    ]);
    const llmsText = await llmsRes.text();
    const entJson = await entRes.json();
    const entityGraph = entJson.entities || entJson['@graph'] || [];
    const entProducts = entityGraph.filter((n) =>
      Array.isArray(n['@type']) ? n['@type'].includes('Product') : n['@type'] === 'Product'
    );
    record(
      llmsRes.status === 200 && llmsText.includes('Dates Powder') && llmsText.includes('Rs. 400'),
      'AI Grounding Directory (/llms.txt)',
      `status=${llmsRes.status}, bytes=${llmsText.length}`
    );
    record(
      entRes.status === 200 && entProducts.length === 32,
      'AI Entity Graph (/api/entities/products)',
      `status=${entRes.status}, products=${entProducts.length}`
    );
  } catch (err) {
    record(false, 'AI Grounding Endpoints', err.message);
  }

  // 3. GA4 Ecommerce Events & Microsoft Clarity Tracker on Live Storefront
  try {
    const [homeRes, prodRes] = await Promise.all([
      fetch(`${BASE}/`, { headers: { 'Cache-Control': 'no-cache' } }),
      fetch(`${BASE}/products/dates-powder`, { headers: { 'Cache-Control': 'no-cache' } }),
    ]);
    const homeHtml = await homeRes.text();
    const prodHtml = await prodRes.text();
    const hasMetaHome = homeHtml.includes('view_item,add_to_cart,remove_from_cart,begin_checkout,coupon_apply,purchase,whatsapp_click');
    const hasMetaProd = prodHtml.includes('view_item,add_to_cart,remove_from_cart,begin_checkout,coupon_apply,purchase,whatsapp_click');
    record(
      homeRes.status === 200 && prodRes.status === 200 && hasMetaHome && hasMetaProd,
      'Live GA4 Ecommerce & Clarity Analytics Tracker Mounted (/ & /products/dates-powder)',
      `home=${hasMetaHome}, product=${hasMetaProd}`
    );
  } catch (err) {
    record(false, 'Live GA4 Ecommerce & Clarity Analytics Tracker', err.message);
  }

  // 4. 60-Query Weekly Rank Sheet (JSON & CSV)
  try {
    const [jsonRes, csvRes] = await Promise.all([
      fetch(`${BASE}/weekly-rank-tracker-60-queries.json`, { headers: { 'Cache-Control': 'no-cache' } }),
      fetch(`${BASE}/weekly-rank-tracker-60-queries.csv`, { headers: { 'Cache-Control': 'no-cache' } }),
    ]);
    const rows = await jsonRes.json();
    const csvText = await csvRes.text();
    const prodCount = rows.filter((r) => r.bucket === 'product_sku').length;
    const catCount = rows.filter((r) => r.bucket === 'category_cluster').length;
    const bgfCount = rows.filter((r) => r.bucket === 'baby_gift_fitness').length;
    record(
      jsonRes.status === 200 &&
        csvRes.status === 200 &&
        rows.length === 60 &&
        prodCount === 32 &&
        catCount === 15 &&
        bgfCount === 13,
      'Weekly Rank Sheet (/weekly-rank-tracker-60-queries.json & .csv)',
      `total=${rows.length} (product=${prodCount}, category=${catCount}, baby_gift_fitness=${bgfCount}), csvBytes=${csvText.length}`
    );
  } catch (err) {
    record(false, 'Weekly Rank Sheet (60 Queries)', err.message);
  }

  // 5. 25-Prompt AI Citation Tracker (JSON & CSV)
  try {
    const [jsonRes, csvRes] = await Promise.all([
      fetch(`${BASE}/ai-citation-tracker-25-prompts.json`, { headers: { 'Cache-Control': 'no-cache' } }),
      fetch(`${BASE}/ai-citation-tracker-25-prompts.csv`, { headers: { 'Cache-Control': 'no-cache' } }),
    ]);
    const prompts = await jsonRes.json();
    const csvText = await csvRes.text();
    record(
      jsonRes.status === 200 && csvRes.status === 200 && prompts.length === 25,
      'Weekly AI Citation Tracker (/ai-citation-tracker-25-prompts.json & .csv)',
      `prompts=${prompts.length}, csvBytes=${csvText.length}`
    );
  } catch (err) {
    record(false, 'Weekly AI Citation Tracker (25 Prompts)', err.message);
  }

  // 6. Phase 9 Measurement & 30/60/90-Day Target Pack
  try {
    const res = await fetch(`${BASE}/phase9-measurement-pack.json`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    const pack = await res.json();
    const kpiCount = pack?.baselineAnd30_60_90DayTargets?.kpis?.length || 0;
    const gaEventsCount = pack?.analyticsAndHeatmapSetup?.ga4?.implementedEvents?.length || 0;
    record(
      res.status === 200 && kpiCount >= 7 && gaEventsCount === 7,
      'Phase 9 Measurement & 30/60/90-Day Targets Pack (/phase9-measurement-pack.json)',
      `kpis=${kpiCount}, ga4Events=${gaEventsCount}`
    );
  } catch (err) {
    record(false, 'Phase 9 Measurement & 30/60/90-Day Targets Pack', err.message);
  }

  console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

check();
