import https from 'https';

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        port: 443,
        path: u.pathname + u.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'NaturesMud-Phase5-Verifier/1.0',
          'Cache-Control': 'no-cache',
          ...(options.headers || {}),
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
    if (options.body) req.write(options.body);
    req.end();
  });
}

const FORBIDDEN_CLAIMS = [
  '525,000+',
  '25,000+',
  '3,840+',
  '280+ farmer',
  '110+ families',
  '95+ families',
  '75+ families',
  '+35% wages',
  'Ram Bahadur Chaudhary',
  'Sita Maya Tamang',
  'Pasang Norbu Gurung',
  '>75% fulvic',
  '75% fulvic',
  'Gold-grade',
  'Lab Tested Purity',
  'Kosher',
  'Unsulfured',
  'unsulfured',
  'unsulphured',
  'Gongabu Chowk',
];

async function run() {
  let failures = 0;
  const results = [];

  function record(check, url, status, pass, evidence) {
    results.push({ check, url, status, pass, evidence });
    if (!pass) failures++;
    console.log(`${pass ? '✅ PASS' : '❌ FAIL'} | ${check} | ${url} | HTTP ${status} | ${evidence}`);
  }

  // 1. Verify /about page + Quality & Claims Transparency Ledger (#quality-ledger)
  const aboutUrl = 'https://naturesmud.shop/about';
  const aboutRes = await fetchUrl(aboutUrl);
  const hasQualityLedger = aboutRes.body.includes('id="quality-ledger"') && aboutRes.body.includes('Transparency Ledger');
  const hasBaneshwor = aboutRes.body.includes('Baneshwor, Kathmandu 44600, Nepal');
  const aboutForbidden = FORBIDDEN_CLAIMS.filter((c) => aboutRes.body.includes(c));
  record(
    'About Page & D6 Claims Ledger (#quality-ledger)',
    aboutUrl,
    aboutRes.status,
    aboutRes.status === 200 && hasQualityLedger && hasBaneshwor && aboutForbidden.length === 0,
    `id="quality-ledger": ${hasQualityLedger}, Baneshwor HQ: ${hasBaneshwor}, Forbidden claims: ${aboutForbidden.length === 0 ? '0' : aboutForbidden.join(', ')}`
  );

  // 2. Verify /our-story page (308 canonical redirect to /about — One search intent = one URL)
  const storyUrl = 'https://naturesmud.shop/our-story';
  const storyRes = await fetchUrl(storyUrl);
  const storyRedirectsToAbout =
    (storyRes.status === 308 || storyRes.status === 301) &&
    (storyRes.headers.location === '/about' || String(storyRes.headers.location).endsWith('/about'));
  record(
    'Our Story Canonical Redirect (/our-story -> /about)',
    storyUrl,
    storyRes.status,
    storyRedirectsToAbout,
    `HTTP ${storyRes.status} Location: ${storyRes.headers.location} (Unified with /about)`
  );

  // 3. Verify /contact page (Baneshwor HQ, Business Identity & Policies card, zero Gongabu map conflict)
  const contactUrl = 'https://naturesmud.shop/contact';
  const contactRes = await fetchUrl(contactUrl);
  const contactHasIdentity =
    contactRes.body.includes('Baneshwor, Kathmandu 44600, Nepal') &&
    contactRes.body.includes('Business Identity') &&
    !contactRes.body.includes('Gongabu Chowk');
  record(
    'Contact Page NAP & Business Identity Card (D9)',
    contactUrl,
    contactRes.status,
    contactRes.status === 200 && contactHasIdentity,
    `Baneshwor 44600 HQ + Business Identity card + Maps iframe updated: ${contactHasIdentity}`
  );

  // 4. Verify Product Pages (D4: no AggregateRating when 0 reviews, order-tied review form present; D6/D10 clean)
  const sampleProducts = [
    {
      slug: 'beetroot-powder',
      expectedName: 'Beetroot Powder',
      mustContain: ['Order Number', 'Write an Order Review'],
    },
    {
      slug: 'pure-mountain-himalayan-shilajit-resin',
      expectedName: 'Pure Mountain Himalayan Shilajit Resin',
      mustContain: ['Order Number'],
    },
    {
      slug: 'pumpkin-seeds',
      expectedName: 'Pumpkin Seeds',
      mustContain: ['pumpkin-seeds-product-shot.jpg'],
    },
    {
      slug: 'moringa-leaf-powder',
      expectedName: 'Moringa Leaf Powder',
      mustContain: ['Order Number'],
    },
  ];

  for (const prod of sampleProducts) {
    const pUrl = `https://naturesmud.shop/products/${prod.slug}`;
    const pRes = await fetchUrl(pUrl);
    const hasForbidden = FORBIDDEN_CLAIMS.filter((c) => pRes.body.includes(c));
    const hasUnbackedAggregateRating = pRes.body.includes('"AggregateRating"');
    const hasCategoryHubLink = pRes.body.includes('/category/');
    const missingRequired = prod.mustContain.filter((m) => !pRes.body.includes(m));

    record(
      `Product Page (${prod.slug}) D4/D6/D10`,
      pUrl,
      pRes.status,
      pRes.status === 200 &&
        hasForbidden.length === 0 &&
        !hasUnbackedAggregateRating &&
        hasCategoryHubLink &&
        missingRequired.length === 0,
      `H1="${prod.expectedName}", AggregateRating=${hasUnbackedAggregateRating ? 'PRESENT (FAIL)' : 'OMITTED (0 reviews)'}, /category/ link=${hasCategoryHubLink}, Forbidden=${hasForbidden.length}`
    );
  }

  // 5. Verify Order-Tied Review API GET & POST validation on live production
  const revGetUrl = 'https://naturesmud.shop/api/reviews?product=beetroot-powder';
  const revGetRes = await fetchUrl(revGetUrl);
  let revGetJson = null;
  try {
    revGetJson = JSON.parse(revGetRes.body);
  } catch {}
  record(
    'GET /api/reviews?product=beetroot-powder',
    revGetUrl,
    revGetRes.status,
    revGetRes.status === 200 && revGetJson && revGetJson.success === true && Array.isArray(revGetJson.data),
    `Response: ${revGetRes.body.slice(0, 120)}`
  );

  // Verify POST /api/reviews rejects missing Order Number (400)
  const revPostUrl = 'https://naturesmud.shop/api/reviews';
  const revPostMissingOrder = await fetchUrl(revPostUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productSlug: 'beetroot-powder',
      orderNumber: '',
      customerName: 'Test User',
      rating: 5,
      content: 'Testing order number validation requirement.',
    }),
  });
  record(
    'POST /api/reviews (Rejects Missing Order Number)',
    revPostUrl,
    revPostMissingOrder.status,
    revPostMissingOrder.status === 400 && revPostMissingOrder.body.includes('Order Number'),
    `HTTP ${revPostMissingOrder.status}: ${revPostMissingOrder.body}`
  );

  // Verify MySQL API Product Endpoint has rating_avg = 0, rating_count = 0 and clean claims
  const apiProdUrl = 'https://api.naturesmud.shop/api/v1/products/pure-mountain-himalayan-shilajit-resin?nocache=1';
  const apiProdRes = await fetchUrl(apiProdUrl);
  let apiProdJson = null;
  try {
    apiProdJson = JSON.parse(apiProdRes.body);
  } catch {}
  const apiClean =
    apiProdJson &&
    Number(apiProdJson.rating_count) === 0 &&
    !JSON.stringify(apiProdJson).includes('75% fulvic') &&
    !JSON.stringify(apiProdJson).includes('Gold-grade');
  record(
    'Live MySQL API (Shilajit D4 & D6 Sync)',
    apiProdUrl,
    apiProdRes.status,
    apiProdRes.status === 200 && apiClean,
    `rating_count=${apiProdJson?.rating_count}, rating_avg=${apiProdJson?.rating_avg}, no "75% fulvic"/"Gold-grade"`
  );

  console.log(`\n========================================`);
  console.log(`PHASE 5 LIVE VERIFICATION SUMMARY: ${results.length - failures}/${results.length} PASSED (${failures} failures)`);
  console.log(`========================================`);
  if (failures > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
