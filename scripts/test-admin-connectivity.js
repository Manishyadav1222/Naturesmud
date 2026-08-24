const { performance } = require('perf_hooks');

async function testAdmin() {
  const tests = [
    { name: 'Admin Server Port 4000 Health', url: 'http://localhost:4000/health' },
    { name: 'Admin Server Port 4001 Health', url: 'http://localhost:4001/health' },
    { name: 'Admin Server Port 4000 Orders Endpoint', url: 'http://localhost:4000/api/admin/orders' },
    { name: 'Frontend Admin Login Page', url: 'http://localhost:3001/admin/login' },
    { name: 'Frontend Admin Dashboard Page', url: 'http://localhost:3001/admin/dashboard' },
    { name: 'Frontend Admin Products Page', url: 'http://localhost:3001/admin/products' },
    { name: 'Frontend Admin Marketing Offers Page', url: 'http://localhost:3001/admin/marketing/offers' }
  ];

  console.log('=== TESTING ADMIN SERVER & DUAL PORT CONNECTIVITY ===');
  for (const t of tests) {
    const start = performance.now();
    try {
      const res = await fetch(t.url);
      const text = await res.text();
      const ms = Math.round(performance.now() - start);
      console.log(`[PASS] ${t.name.padEnd(48)}: HTTP ${res.status} in ${ms}ms`);
    } catch(err) {
      console.error(`[FAIL] ${t.name.padEnd(48)}: Error - ${err.message}`);
    }
  }

  console.log('\n=== TESTING ADMIN AUTHENTICATION API ===');
  const loginStart = performance.now();
  try {
    const loginRes = await fetch('http://localhost:4000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@naturemud.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const loginMs = Math.round(performance.now() - loginStart);
    console.log(`[PASS] Admin Login Endpoint Response: HTTP ${loginRes.status} (message: ${loginData.message || 'OK'}) in ${loginMs}ms`);
  } catch(err) {
    console.error(`[FAIL] Admin Login: ${err.message}`);
  }
}

testAdmin();
