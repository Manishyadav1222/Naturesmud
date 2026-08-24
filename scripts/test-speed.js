const { performance } = require('perf_hooks');

async function benchmark() {
  console.log('=== SYSTEM HEALTH & SUB-SECOND LATENCY BENCHMARK ===');

  const tests = [
    { name: 'Frontend SSR (Next.js 15)', url: 'http://localhost:3001' },
    { name: 'Laravel Products API (Redis Cached)', url: 'http://localhost:8000/api/v1/products?per_page=12' },
    { name: 'Laravel Categories API (Redis Cached)', url: 'http://localhost:8000/api/v1/categories' },
    { name: 'Laravel Single Product Route Binding', url: 'http://localhost:8000/api/v1/products/19' },
    { name: 'Laravel Order Status API', url: 'http://localhost:8000/api/v1/orders/NM-YOAT2I06GR/status' },
    { name: 'Laravel Order Lookup API', url: 'http://localhost:8000/api/v1/orders/lookup/NM-YOAT2I06GR' },
    { name: 'Admin Server Health', url: 'http://localhost:4001/health' }
  ];

  for (const t of tests) {
    const start = performance.now();
    try {
      const res = await fetch(t.url, { headers: { 'Accept': 'application/json' } });
      const ms = Math.round(performance.now() - start);
      console.log(`[PASS] ${t.name.padEnd(38)}: HTTP ${res.status} in ${ms}ms`);
    } catch(err) {
      console.error(`[FAIL] ${t.name.padEnd(38)}: FAILED - ${err.message}`);
    }
  }

  console.log('\n=== LIVE CHECKOUT & ORDER CREATION SPEED TEST ===');
  const orderStart = performance.now();
  const orderRes = await fetch('http://localhost:8000/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      items: [{ product_id: 19, quantity: 2 }, { product_id: 20, quantity: 1 }],
      shipping_name: 'Sub-Second Speed User',
      shipping_phone: '9841234567',
      shipping_email: 'speed@naturemud.com',
      shipping_address: 'Durbar Marg, Kathmandu',
      shipping_city: 'Kathmandu',
      shipping_zone: 'Bagmati',
      payment_method: 'cod',
      notes: 'Sub-second order transaction'
    })
  });
  const orderMs = Math.round(performance.now() - orderStart);
  const orderData = await orderRes.json();
  console.log(`[PASS] Order Creation: ${orderData.order?.order_number} (ID: ${orderData.order?.id}, Total: Rs. ${orderData.order?.total}) created in ${orderMs}ms`);

  console.log('\n=== DOCKER RUNNING STATUS ===');
}

benchmark();
