const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, text: data }));
    }).on('error', reject);
  });
}

async function verifyLive() {
  console.log('======================================================');
  console.log('🔎 THOROUGH LIVE SITE VERIFICATION: https://naturesmud.shop');
  console.log('======================================================\n');

  // 1. Check /api/products
  console.log('[1/4] Checking live /api/products...');
  const apiRes = await fetchJson('https://naturesmud.shop/api/products');
  console.log(`  -> API Status: ${apiRes.status}`);

  const products = Array.isArray(apiRes.data) ? apiRes.data : (apiRes.data?.products || apiRes.data?.data || []);
  console.log(`  -> Total products returned: ${products.length}`);

  const makhana = products.find(p => p.slug === 'makhana-fox-nuts');
  console.log('  -> Makhana (Fox Nuts):', makhana ? `FOUND! Weight: ${makhana.weight}, Price: Rs. ${makhana.price}, Image: ${makhana.image}` : '❌ NOT FOUND');

  const roastedAlmonds = products.find(p => p.slug === 'roasted-almonds');
  console.log('  -> Roasted Almonds:', roastedAlmonds ? `FOUND! Weight: ${roastedAlmonds.weight}, Image: ${roastedAlmonds.image}` : '❌ NOT FOUND');

  const rawAlmonds = products.find(p => p.slug === 'raw-himalayan-almonds');
  console.log('  -> Raw Almonds:', rawAlmonds ? `FOUND! Weight: ${rawAlmonds.weight}, Image: ${rawAlmonds.image}` : '❌ NOT FOUND');

  const shilajit = products.find(p => p.slug === 'pure-mountain-himalayan-shilajit-resin');
  console.log('  -> Shilajit Resin:', shilajit ? `FOUND! Weight: ${shilajit.weight}, Price: Rs. ${shilajit.price}` : '❌ NOT FOUND');

  // 2. Check Homepage HTML
  console.log('\n[2/4] Checking live Homepage (https://naturesmud.shop/)...');
  const homeRes = await fetchText('https://naturesmud.shop/');
  console.log(`  -> Homepage Status: ${homeRes.status}`);
  const hasNmImages = homeRes.text.includes('/products/nm-') || homeRes.text.includes('nm-');
  const hasMakhana = homeRes.text.includes('Makhana') || homeRes.text.includes('makhana');
  console.log(`  -> Contains NM animated poster images: ${hasNmImages ? '✅ YES' : '❌ NO'}`);
  console.log(`  -> Contains Makhana references: ${hasMakhana ? '✅ YES' : '❌ NO'}`);

  // 3. Check Individual Product Pages
  console.log('\n[3/4] Checking live product pages...');
  const testSlugs = [
    'makhana-fox-nuts',
    'roasted-almonds',
    'raw-himalayan-almonds',
    'pure-mountain-himalayan-shilajit-resin',
    'chia-seeds',
    'beetroot-powder'
  ];

  for (const slug of testSlugs) {
    const page = await fetchText(`https://naturesmud.shop/products/${slug}`);
    console.log(`  -> /products/${slug} -> Status: ${page.status} (${(page.text.length / 1024).toFixed(1)} KB)`);
  }

  // 4. Verify Almond Weights
  console.log('\n[4/4] Verifying almond weights on live site...');
  if (roastedAlmonds && String(roastedAlmonds.weight).includes('200')) {
    console.log('  ✅ Roasted Almonds is 200 GM');
  } else {
    console.log(`  ❌ Roasted Almonds is NOT 200 GM (is ${roastedAlmonds?.weight})`);
  }
  if (rawAlmonds && String(rawAlmonds.weight).includes('200')) {
    console.log('  ✅ Raw Almonds is 200 GM');
  } else {
    console.log(`  ❌ Raw Almonds is NOT 200 GM (is ${rawAlmonds?.weight})`);
  }

  console.log('\n======================================================');
  console.log('🎉 LIVE SITE AUDIT COMPLETE!');
  console.log('======================================================');
}

verifyLive().catch(console.error);
