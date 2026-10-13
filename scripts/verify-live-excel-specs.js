const https = require('https');

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

async function verifyAllLive() {
  const data = await getJson('https://api.naturesmud.shop/api/v1/products?per_page=100');
  const items = data.data || data;

  const checks = [
    { slug: 'dehydrated-pineapple', price: 590, weight: 100 },
    { slug: 'moringa-leaf-powder', price: 690, weight: 200 },
    { slug: 'carrot-powder', price: 490, weight: 80 },
    { slug: 'premium-cashewnuts', price: 750, weight: 150 },
    { slug: 'roasted-cashewnuts', price: 750, weight: 200 },
    { slug: 'dry-figs-anjeer', price: 690, weight: 200 },
    { slug: 'premium-pistachio-roasted-salted', price: 895, weight: 200 },
    { slug: 'superfood-trail-mix', price: 690, weight: 200 },
    { slug: 'virgin-coconut-oil-180ml', price: 650, weight: 180 }
  ];

  console.log('=== VERIFYING LIVE PRODUCTION API ===');
  let allPass = true;
  checks.forEach(c => {
    const item = items.find(p => p.slug === c.slug);
    if (!item) {
      console.log('FAIL: Missing ' + c.slug);
      allPass = false;
      return;
    }
    const pOk = parseFloat(item.price) === c.price;
    const wOk = parseFloat(item.weight) === c.weight;
    console.log(c.slug + ': Price Rs. ' + item.price + ' (Target ' + c.price + '): ' + (pOk ? 'PASS' : 'FAIL') + ' | Weight: ' + item.weight + ' (Target ' + c.weight + '): ' + (wOk ? 'PASS' : 'FAIL'));
    if (!pOk || !wOk) allPass = false;
  });

  console.log('\nOVERALL LIVE STATUS: ' + (allPass ? '100% PERFECT MATCH' : 'HAS DISCREPANCIES'));
}

verifyAllLive().catch(console.error);
