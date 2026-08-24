const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        resolve({ url, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR: ' + err.message });
    });
  });
}

async function testPages() {
  console.log('🚀 Testing Product Detail Pages & Review API Endpoints...\n');

  const productSlugs = [
    'sweet-potato-powder',
    'beetroot-powder',
    'carrot-powder',
    'dates-powder',
    'dehydrated-papaya',
    'raw-honey',
  ];

  for (const slug of productSlugs) {
    const url = `http://localhost:3000/products/${slug}`;
    const res = await checkUrl(url);
    console.log(`${res.status === 200 ? '✅' : '❌'} [${res.status}] ${url} (${res.length} bytes)`);
  }

  console.log('\n--- Testing Public Review Endpoint via Next.js Proxy ---');
  const reviewRes = await checkUrl('http://localhost:3000/api/admin/reviews/public/1');
  console.log(`${reviewRes.status === 200 ? '✅' : '❌'} [${reviewRes.status}] Review endpoint status: ${reviewRes.status}`);

  console.log('\n--- Testing Cart & Checkout Pages ---');
  const cartRes = await checkUrl('http://localhost:3000/cart');
  const checkoutRes = await checkUrl('http://localhost:3000/checkout');
  console.log(`${cartRes.status === 200 ? '✅' : '❌'} [${cartRes.status}] /cart`);
  console.log(`${checkoutRes.status === 200 ? '✅' : '❌'} [${checkoutRes.status}] /checkout`);
}

testPages();
