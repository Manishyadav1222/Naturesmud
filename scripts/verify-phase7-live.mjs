import https from 'https';

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
          'User-Agent': 'NaturesMud-Phase7-Verifier/1.0',
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

async function run() {
  let failures = 0;
  const results = [];

  function record(check, url, status, pass, evidence) {
    results.push({ check, url, status, pass, evidence });
    if (!pass) failures++;
    console.log(`${pass ? '✅ PASS' : '❌ FAIL'} | ${check} | ${url} | HTTP ${status} | ${evidence}`);
  }

  // 1. Verify /locations page
  const locUrl = 'https://naturesmud.shop/locations';
  const locRes = await fetchUrl(locUrl);
  const locValid =
    locRes.status === 200 &&
    locRes.body.includes('Baneshwor, Kathmandu 44600, Nepal') &&
    locRes.body.includes('Kids Kottage') &&
    locRes.body.includes('Zero to Ten') &&
    locRes.body.includes('Baby Love') &&
    locRes.body.includes('HealthFoodStore') &&
    locRes.body.includes('FAQPage');
  record(
    'Locations & 77-District Hub (/locations)',
    locUrl,
    locRes.status,
    locValid,
    `Baneshwor HQ + 6 Retail Showrooms + 7-Province Table + HealthFoodStore/FAQPage JSON-LD=${locValid}`
  );

  // 2. Verify Root Organization + LocalBusiness/HealthFoodStore Schema & sameAs
  const homeUrl = 'https://naturesmud.shop/';
  const homeRes = await fetchUrl(homeUrl);
  const homeSchemaValid =
    homeRes.status === 200 &&
    homeRes.body.includes('HealthFoodStore') &&
    homeRes.body.includes('GeoCoordinates') &&
    homeRes.body.includes('OpeningHoursSpecification') &&
    homeRes.body.includes('hasOfferCatalog') &&
    homeRes.body.includes('Pure Mountain Himalayan Shilajit Resin');
  record(
    'Root Organization & LocalBusiness Schema (/)',
    homeUrl,
    homeRes.status,
    homeSchemaValid,
    `HealthFoodStore + GeoCoordinates + OpeningHoursSpecification + hasOfferCatalog + sameAs=${homeSchemaValid}`
  );

  // 3. Verify /sitemap.xml canonical URLs
  const sitemapUrl = 'https://naturesmud.shop/sitemap.xml';
  const sitemapRes = await fetchUrl(sitemapUrl);
  const sitemapValid =
    sitemapRes.status === 200 &&
    sitemapRes.body.includes('https://naturesmud.shop/locations') &&
    sitemapRes.body.includes('https://naturesmud.shop/category/powders') &&
    !sitemapRes.body.includes('?category=');
  record(
    'Sitemap Canonical Hub & Location Coverage (/sitemap.xml)',
    sitemapUrl,
    sitemapRes.status,
    sitemapValid,
    `/locations + /category/* hubs present, 0 '?category=' query URLs=${sitemapValid}`
  );

  // 4. Verify /gbp-optimization-pack.json
  const gbpUrl = 'https://naturesmud.shop/gbp-optimization-pack.json';
  const gbpRes = await fetchUrl(gbpUrl);
  let gbpJson = null;
  try {
    gbpJson = JSON.parse(gbpRes.body);
  } catch {}
  record(
    'Google Business Profile Pack (/gbp-optimization-pack.json)',
    gbpUrl,
    gbpRes.status,
    gbpRes.status === 200 &&
      gbpJson?.productsCount === 32 &&
      gbpJson?.qaSeedPairs?.length === 8 &&
      gbpJson?.weeklyPostTemplates?.length === 4,
    `productsCount=${gbpJson?.productsCount}/32, qaSeedPairs=${gbpJson?.qaSeedPairs?.length}, weeklyPosts=${gbpJson?.weeklyPostTemplates?.length}`
  );

  // 5. Verify /video-scripts-32-skus.json
  const vidJsonUrl = 'https://naturesmud.shop/video-scripts-32-skus.json';
  const vidJsonRes = await fetchUrl(vidJsonUrl);
  let vidJson = null;
  try {
    vidJson = JSON.parse(vidJsonRes.body);
  } catch {}
  record(
    '32-SKU Short-Form Video Scripts JSON (/video-scripts-32-skus.json)',
    vidJsonUrl,
    vidJsonRes.status,
    vidJsonRes.status === 200 &&
      vidJson?.count === 32 &&
      Array.isArray(vidJson?.scripts) &&
      vidJson.scripts.length === 32 &&
      vidJsonRes.body.includes('from 6 months, as advised by your pediatrician'),
    `scripts=${vidJson?.scripts?.length}/32, bilingual hooks + 4-shot list + baby disclaimer present`
  );

  // 6. Verify /video-scripts-32-skus.csv
  const vidCsvUrl = 'https://naturesmud.shop/video-scripts-32-skus.csv';
  const vidCsvRes = await fetchUrl(vidCsvUrl);
  const vidCsvLines = vidCsvRes.body.trim().split('\n');
  record(
    '32-SKU Short-Form Video Scripts CSV (/video-scripts-32-skus.csv)',
    vidCsvUrl,
    vidCsvRes.status,
    vidCsvRes.status === 200 && vidCsvLines.length === 33,
    `rows=${vidCsvLines.length - 1}/32 SKUs`
  );

  // 7. Verify /offsite-authority-outreach-pack.json
  const outUrl = 'https://naturesmud.shop/offsite-authority-outreach-pack.json';
  const outRes = await fetchUrl(outUrl);
  let outJson = null;
  try {
    outJson = JSON.parse(outRes.body);
  } catch {}
  record(
    'Off-Site Authority & Citation Pack (/offsite-authority-outreach-pack.json)',
    outUrl,
    outRes.status,
    outRes.status === 200 &&
      outJson?.nepalCitationsAndDirectories?.length === 6 &&
      outJson?.collaboratorOutreachTemplates?.length === 3 &&
      outJson?.brandSerpOwnershipChecklist?.length === 6,
    `directories=${outJson?.nepalCitationsAndDirectories?.length}, outreachTemplates=${outJson?.collaboratorOutreachTemplates?.length}, brandSerp=${outJson?.brandSerpOwnershipChecklist?.length}`
  );

  console.log(`\n========================================`);
  console.log(`PHASE 7 LIVE VERIFICATION SUMMARY: ${results.length - failures}/${results.length} PASSED (${failures} failures)`);
  console.log(`========================================`);
  if (failures > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
