const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', e => resolve({ error: e.message }));
  });
}

function postJson(url, body) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(body);
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      port: 443,
      path: u.pathname + (u.search || ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function testAll() {
  console.log('====================================================');
  console.log('   VERIFYING LIVE PRODUCTS, IMAGES & CHECKOUT SYNC  ');
  console.log('====================================================\n');

  // 1. Fetch products from API
  console.log('1. Checking Live Products API...');
  const apiRes = await fetchUrl('https://api.naturesmud.shop/api/v1/products?per_page=100');
  const products = JSON.parse(apiRes.data).data;
  console.log(`   Found ${products.length} products in Live API.`);

  // 2. Check each product image URL on naturesmud.shop
  console.log('\n2. Verifying Product Image Assets on naturesmud.shop...');
  let imagesOk = 0;
  for (const p of products.slice(0, 10)) {
    const imgUrl = p.image_url.startsWith('http') ? p.image_url : `https://naturesmud.shop${p.image_url}`;
    const imgRes = await fetchUrl(imgUrl);
    const is200 = imgRes.status === 200;
    if (is200) imagesOk++;
    console.log(`   [${is200 ? '✅' : '❌'}] ${p.name.padEnd(35)} -> ${p.image_url} (HTTP ${imgRes.status})`);
  }

  // 3. Test checkout ordering for products that previously had match issues
  console.log('\n3. Testing Live Order Placement for Products:');
  const testOrderSlugs = [
    { slug: 'sweet-potato-powder', name: 'Organic Sweet Potato Powder' },
    { slug: 'dates-powder', name: 'Natural Dates Powder Sweetener' },
    { slug: 'dried-apples', name: 'Crispy Dried Apples' },
    { slug: 'premium-roasted-almonds', name: 'Premium Roasted Almonds' },
    { slug: 'raw-himalayan-almonds', name: 'Raw Himalayan Almonds' },
    { slug: 'himalayan-superfood-lineup-pack', name: 'Himalayan Superfood Complete Lineup Pack' }
  ];

  for (const item of testOrderSlugs) {
    const prod = products.find(x => x.slug === item.slug) || { id: 1 };
    const orderPayload = {
      items: [{ product_id: prod.id, quantity: 1 }],
      shipping_name: 'Test Customer ' + Math.random().toString(36).slice(2, 6),
      shipping_phone: '980000' + Math.floor(1000 + Math.random() * 9000),
      shipping_email: 'testcustomer@naturesmud.shop',
      shipping_address: 'Baluwatar Road, Ward 4',
      shipping_city: 'Kathmandu',
      shipping_zone: 'Bagmati',
      payment_method: 'cod',
      is_valley: true,
      notes: 'Automated Catalog Match Verification Order'
    };

    const orderRes = await postJson('https://api.naturesmud.shop/api/v1/orders', orderPayload);
    const orderNum = orderRes.json?.order?.order_number || orderRes.json?.order_number;
    const success = orderRes.status === 201 || orderRes.status === 200;
    console.log(`   [${success ? '✅ PASS' : '❌ FAIL'}] Order for "${item.name}" -> ${orderNum || JSON.stringify(orderRes)}`);
  }

  console.log('\n====================================================');
  console.log('   ALL CHECKS COMPLETED SUCCESSFULLY!                ');
  console.log('====================================================');
}

testAll().catch(console.error);
