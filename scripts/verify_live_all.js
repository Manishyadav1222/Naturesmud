const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          length: data.length,
          data
        });
      });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    });
  });
}

async function verifyAll() {
  console.log('=== VERIFYING ALL LIVE ROUTES & ASSETS ===\n');

  // 1. Assets
  const assets = [
    'https://naturesmud.shop/products/roasted-almonds-v2.jpg',
    'https://naturesmud.shop/products/avocado-powder-v2.jpg',
    'https://naturesmud.shop/products/strawberry-powder-v2.jpg',
    'https://naturesmud.shop/products/banana-powder.jpg',
  ];

  console.log('--- Checking Product Image Assets ---');
  for (const assetUrl of assets) {
    const res = await fetchUrl(assetUrl);
    console.log(`[${res.status}] ${assetUrl} (${res.length} bytes)`);
  }

  // 2. Pages
  const pages = [
    {
      url: 'https://naturesmud.shop/',
      checks: [
        'roasted-almonds-v2.jpg',
        'avocado-powder-v2.jpg',
        'strawberry-powder-v2.jpg',
        'Himalayan Superfood Bundles',
        'Special Offers &amp; Bundles',
        '3iY81QdV77XYu4qaMEtY4'
      ]
    },
    {
      url: 'https://naturesmud.shop/products/roasted-almonds',
      checks: [
        'roasted-almonds-v2.jpg',
        'Himalayan Roasted Almonds'
      ]
    },
    {
      url: 'https://naturesmud.shop/products/freeze-dried-avocado-powder',
      checks: [
        'avocado-powder-v2.jpg',
        'Freeze-Dried Avocado Powder'
      ]
    },
    {
      url: 'https://naturesmud.shop/products/strawberry-powder',
      checks: [
        'strawberry-powder-v2.jpg',
        'Freeze Dried Strawberry Powder'
      ]
    },
    {
      url: 'https://naturesmud.shop/products/raw-himalayan-almonds',
      checks: [
        'nm-almond-jar-v2.jpg',
        'Raw Himalayan Almonds'
      ]
    },
    {
      url: 'https://naturesmud.shop/offers',
      checks: [
        'Himalayan Superfood Bundles',
        'roasted-almonds-v2.jpg',
        'avocado-powder-v2.jpg',
        'strawberry-powder-v2.jpg'
      ]
    },
    {
      url: 'https://naturesmud.shop/blog',
      checks: [
        'freeze-dried-avocado-powder-benefits-recipes-nepal',
        'freeze-dried-strawberry-powder-antioxidant-skin-health-nepal',
        'raw-green-banana-powder-resistant-starch-gut-health-nepal'
      ]
    },
    {
      url: 'https://naturesmud.shop/blog/freeze-dried-avocado-powder-benefits-recipes-nepal',
      checks: [
        'avocado-powder-v2.jpg',
        'Avocado Powder'
      ]
    },
    {
      url: 'https://naturesmud.shop/blog/freeze-dried-strawberry-powder-antioxidant-skin-health-nepal',
      checks: [
        'strawberry-powder-v2.jpg',
        'Strawberry Powder'
      ]
    },
    {
      url: 'https://naturesmud.shop/blog/raw-green-banana-powder-resistant-starch-gut-health-nepal',
      checks: [
        'banana-powder.jpg',
        'Banana Powder'
      ]
    }
  ];

  console.log('\n--- Checking Live Site Pages ---');
  for (const page of pages) {
    const res = await fetchUrl(page.url);
    console.log(`\nURL: ${page.url} -> Status: [${res.status}], Length: ${res.length}`);
    if (page.checks) {
      for (const check of page.checks) {
        const found = res.data && res.data.includes(check);
        console.log(`  - Contains "${check}": ${found}`);
      }
    }
  }

  console.log('\n✅ Verification Complete!');
}

verifyAll().catch(console.error);
