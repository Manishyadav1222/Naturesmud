const https = require('https');
const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: data
      }));
    }).on('error', err => resolve({ error: err.message, status: 0 }));
  });
}

function fetchHead(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', rejectUnauthorized: false }, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers
      });
    });
    req.on('error', err => resolve({ error: err.message, status: 0 }));
    req.end();
  });
}

async function verifyAll() {
  console.log('===============================================================');
  console.log('🔍 FULL VERIFICATION: NATURE\'S MUD CATALOG & PRODUCT UPDATES');
  console.log('===============================================================\n');

  // 1. Verify Cover Picture & Catalog Assets
  console.log('[1/4] 🖼️ Verifying Magazine Cover Picture & PDF Catalogs...');
  const coverHead = await fetchHead('https://naturesmud.shop/images/posters/naturesmud-authenticity-table-cover.jpg');
  console.log(`  • Authenticity Table Cover JPG: Status ${coverHead.status} (${coverHead.headers?.['content-length'] || 'N/A'} bytes)`);

  const magPdfHead = await fetchHead('https://naturesmud.shop/Nature_Mud_Product_Catalog.pdf');
  console.log(`  • Nature_Mud_Product_Catalog.pdf: Status ${magPdfHead.status} (${magPdfHead.headers?.['content-length'] || 'N/A'} bytes)`);

  const catalogPdfHead = await fetchHead('https://naturesmud.shop/catalog.pdf');
  console.log(`  • catalog.pdf: Status ${catalogPdfHead.status} (${catalogPdfHead.headers?.['content-length'] || 'N/A'} bytes)`);

  const posterJpgHead = await fetchHead('https://naturesmud.shop/official-product-catalog.jpg');
  console.log(`  • official-product-catalog.jpg: Status ${posterJpgHead.status} (${posterJpgHead.headers?.['content-length'] || 'N/A'} bytes)`);

  // 2. Verify API Products Endpoint
  console.log('\n[2/4] 📡 Verifying API Products (/api/v1/products and fallback)...');
  const apiRes = await fetchUrl('https://naturesmud.shop/api/products');
  console.log(`  • /api/products HTTP Status: ${apiRes.status}`);
  let apiProducts = [];
  try {
    const parsed = JSON.parse(apiRes.body);
    apiProducts = Array.isArray(parsed) ? parsed : (parsed.data || []);
  } catch (e) {
    console.log('  ⚠️ Failed to parse /api/products JSON');
  }

  // 3. Verify Specific Products Data
  console.log('\n[3/4] 🏷️ Checking Targeted Product Prices & Weights:');

  const checkTargets = [
    {
      slug: 'virgin-coconut-oil-500ml',
      nameExpected: 'Cold-Pressed Extra Virgin Coconut Oil (500ml)',
      expectedPrice: 1750,
      expectedWeight: '500 ML'
    },
    {
      slug: 'virgin-coconut-oil-180ml',
      nameExpected: 'Cold-Pressed Extra Virgin Coconut Oil (200ml)',
      expectedPrice: 650,
      expectedWeight: '200 ML'
    },
    {
      slug: 'dehydrated-papaya',
      nameExpected: 'Premium Dehydrated Papaya',
      expectedWeight: '80 GM'
    },
    {
      slug: 'himalayan-pink-salt',
      nameExpected: 'Fine Himalayan Pink Salt',
      expectedWeight: '200 GM'
    },
    {
      slug: 'pure-himalayan-black-salt-bire-noon',
      nameExpected: 'Pure Himalayan Black Salt (Bire Noon)',
      expectedWeight: '200 GM'
    }
  ];

  for (const target of checkTargets) {
    const item = apiProducts.find(p => p.slug === target.slug);
    console.log(`\n  Product: [${target.slug}]`);
    if (item) {
      console.log(`    - Name: "${item.name}"`);
      console.log(`    - Price: Rs. ${item.price} (Target: ${target.expectedPrice !== undefined ? 'Rs. ' + target.expectedPrice : 'Unchanged'})`);
      console.log(`    - Weight: ${item.weight} (Target: ${target.expectedWeight})`);
      
      const priceMatch = target.expectedPrice === undefined || item.price === target.expectedPrice;
      const weightMatch = item.weight.toUpperCase().includes(target.expectedWeight.toUpperCase()) || item.weight.toUpperCase() === target.expectedWeight.toUpperCase();
      console.log(`    - Status: ${priceMatch && weightMatch ? '✅ MATCH' : '⚠️ MISMATCH'}`);
    } else {
      console.log('    ⚠️ Not found in API /products response');
    }

    // Also test public product webpage HTML
    const pageRes = await fetchUrl(`https://naturesmud.shop/products/${target.slug}`);
    console.log(`    - Webpage /products/${target.slug}: Status ${pageRes.status}`);
    if (pageRes.status === 200) {
      if (target.expectedPrice !== undefined) {
        const hasPrice = pageRes.body.includes(String(target.expectedPrice));
        console.log(`      • Page contains price "${target.expectedPrice}": ${hasPrice ? '✅ YES' : '❌ NO'}`);
      }
      const hasWeight = pageRes.body.includes(target.expectedWeight) || pageRes.body.includes(target.expectedWeight.toLowerCase());
      console.log(`      • Page contains weight "${target.expectedWeight}": ${hasWeight ? '✅ YES' : '❌ NO'}`);
    }
  }

  // 4. Verify Catalog Webpage
  console.log('\n[4/4] 📖 Verifying Public /catalog Page...');
  const catPage = await fetchUrl('https://naturesmud.shop/catalog');
  console.log(`  • /catalog HTTP Status: ${catPage.status}`);
  const hasAuthTitle = catPage.body.includes('Authenticity') || catPage.body.includes('Master Magazine') || catPage.body.includes('Nature_Mud_Product_Catalog.pdf');
  console.log(`  • Catalog has authentic magazine link/embed: ${hasAuthTitle ? '✅ YES' : '❌ NO'}`);

  console.log('\n===============================================================');
  console.log('🎉 AUDIT COMPLETE!');
  console.log('===============================================================');
}

verifyAll().catch(console.error);
