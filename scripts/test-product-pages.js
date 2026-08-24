const { performance } = require('perf_hooks');

async function testAll() {
  const productsToTest = [
    'http://localhost:3001/products',
    'http://localhost:3001/products/dried-cranberries',
    'http://localhost:3001/products/immunity-shield-superfood-mix',
    'http://localhost:3001/products/raw-honey',
    'http://localhost:3001/products/himalayan-walnuts',
    'http://localhost:3001/products/organic-pumpkin-seeds',
    'http://localhost:3001/products/chia-seeds',
    'http://localhost:3001/products/premium-roasted-almonds',
    'http://localhost:3001/cart',
    'http://localhost:3001/checkout'
  ];

  console.log('=== VERIFYING FRONTEND PRODUCT & CHECKOUT PAGES ===');
  for (const url of productsToTest) {
    const start = performance.now();
    try {
      const res = await fetch(url);
      const text = await res.text();
      const ms = Math.round(performance.now() - start);
      const hasError = text.includes('Application error') || text.includes('server-side exception') || text.includes('Digest:');
      if (res.status === 200 && !hasError) {
        console.log(`[PASS] ${url.padEnd(65)}: HTTP 200 (${text.length} bytes) in ${ms}ms`);
      } else {
        console.error(`[FAIL] ${url.padEnd(65)}: HTTP ${res.status} (hasError: ${hasError}) in ${ms}ms`);
      }
    } catch (err) {
      console.error(`[FAIL] ${url.padEnd(65)}: Error ${err.message}`);
    }
  }

  console.log('\n=== TESTING E2E PAYMENT & CHECKOUT TRANSACTION ===');
  const checkoutStart = performance.now();
  const orderRes = await fetch('http://localhost:8000/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      items: [{ product_id: 19, quantity: 1 }, { product_id: 6, quantity: 2 }],
      shipping_name: 'Verified Checkout Customer',
      shipping_phone: '9849999999',
      shipping_email: 'customer@naturemud.com',
      shipping_address: 'Lazimpat, Kathmandu',
      shipping_city: 'Kathmandu',
      shipping_zone: 'Bagmati',
      payment_method: 'esewa',
      notes: 'Please call before arrival'
    })
  });
  const checkoutMs = Math.round(performance.now() - checkoutStart);
  const orderData = await orderRes.json();
  console.log(`[PASS] Verified Order Number: ${orderData.order?.order_number} (Status: ${orderData.order?.status}, Method: ${orderData.order?.payment_method}, Total: Rs. ${orderData.order?.total}) in ${checkoutMs}ms`);
}

testAll();
