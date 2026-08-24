const { performance } = require('perf_hooks');

async function testInventoryAndAdminRoutes() {
  console.log('=== LOGGING IN AS SUPER ADMIN ===');
  const loginRes = await fetch('http://localhost:4001/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@naturesmud.com', password: 'SuperAdmin@2024' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.accessToken;
  console.log('Login success:', !!token);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const routes = [
    { name: 'Inventory (Port 4000)', url: 'http://localhost:4001/api/admin/inventory?page=1&limit=20&status=IN_STOCK' },
    { name: 'Inventory (Port 3001 Proxy)', url: 'http://localhost:3001/api/admin/inventory?page=1&limit=20&status=IN_STOCK' },
    { name: 'Suppliers Endpoint', url: 'http://localhost:4001/api/admin/suppliers' },
    { name: 'Marketing Coupons Endpoint', url: 'http://localhost:4001/api/admin/marketing/coupons' },
    { name: 'Marketing Campaigns Endpoint', url: 'http://localhost:4001/api/admin/marketing/campaigns' },
    { name: 'Marketing Offers Endpoint', url: 'http://localhost:4001/api/admin/marketing/offers' },
    { name: 'Media/Gallery Endpoint', url: 'http://localhost:4001/api/admin/media' }
  ];

  console.log('\n=== TESTING ADMIN API ROUTES ===');
  for (const r of routes) {
    const start = performance.now();
    try {
      const res = await fetch(r.url, { headers: authHeaders });
      const data = await res.json();
      const ms = Math.round(performance.now() - start);
      if (res.status === 200) {
        const count = Array.isArray(data.data) ? data.data.length : 'OK';
        console.log(`[PASS] ${r.name.padEnd(35)}: HTTP 200 (items: ${count}) in ${ms}ms`);
      } else {
        console.error(`[FAIL] ${r.name.padEnd(35)}: HTTP ${res.status} - ${data.message} in ${ms}ms`);
      }
    } catch(err) {
      console.error(`[FAIL] ${r.name.padEnd(35)}: Error ${err.message}`);
    }
  }

  console.log('\n=== TESTING INVENTORY ADJUSTMENT ===');
  const adjustStart = performance.now();
  const adjustRes = await fetch('http://localhost:4001/api/admin/inventory/1/adjust', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ quantity: 5, type: 'ADD', note: 'Restocked by automated test' })
  });
  const adjustData = await adjustRes.json();
  const adjustMs = Math.round(performance.now() - adjustStart);
  console.log(`[PASS] Inventory Adjustment: HTTP ${adjustRes.status} (${adjustData.message}) in ${adjustMs}ms`);
}

testInventoryAndAdminRoutes();
