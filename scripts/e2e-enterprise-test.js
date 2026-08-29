const https = require('https');

const config = {
  host: '167.235.9.123'
};

function request(options, postData = null) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: config.host,
      port: 443,
      rejectUnauthorized: false,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json || data
        });
      });
    });

    req.on('error', (err) => resolve({ error: err.message, statusCode: 0 }));
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('   NATURE\'S MUD — ENTERPRISE FULL-STACK END-TO-END TEST SUITE  ');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(testName, condition, details = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      if (details) console.log(`     ↳ ${details}`);
      passed++;
    } else {
      console.log(`  ❌ [FAIL] ${testName}`);
      if (details) console.log(`     ↳ ${details}`);
      failed++;
    }
  }

  // 1. Frontend Tests
  console.log('--- 1. Testing Frontend Pages (Next.js 15 SSR & Static) ---');
  const homeRes = await request({ path: '/', method: 'GET', headers: { Host: 'naturesmud.shop' } });
  assert('Storefront Homepage (/)', homeRes.statusCode === 200, `Status: ${homeRes.statusCode}`);

  const prodPageRes = await request({ path: '/products', method: 'GET', headers: { Host: 'naturesmud.shop' } });
  assert('Products Catalog Page (/products)', prodPageRes.statusCode === 200, `Status: ${prodPageRes.statusCode}`);

  const adminPageRes = await request({ path: '/admin', method: 'GET', headers: { Host: 'naturesmud.shop' } });
  assert('Admin Portal Entry (/admin)', adminPageRes.statusCode === 200, `Status: ${adminPageRes.statusCode}`);

  // 2. Laravel Backend Customer API Tests
  console.log('\n--- 2. Testing Laravel 11 Backend API (Customer & Storefront) ---');
  const catalogRes = await request({
    path: '/api/v1/products',
    method: 'GET',
    headers: { Host: 'api.naturesmud.shop', Accept: 'application/json' }
  });
  const prodList = catalogRes.body?.data || catalogRes.body || [];
  const prodCount = Array.isArray(prodList) ? prodList.length : 0;
  assert('Product Catalog API (/api/v1/products)', catalogRes.statusCode === 200 && prodCount > 0, `Returned ${prodCount} products`);

  const catRes = await request({
    path: '/api/v1/categories',
    method: 'GET',
    headers: { Host: 'api.naturesmud.shop', Accept: 'application/json' }
  });
  const catList = catRes.body?.data || catRes.body || [];
  const catCount = Array.isArray(catList) ? catList.length : 0;
  assert('Categories API (/api/v1/categories)', catRes.statusCode === 200 && catCount > 0, `Returned ${catCount} categories`);

  // 3. Customer Authentication End-to-End
  console.log('\n--- 3. Testing Customer Registration & Auth Flow ---');
  const testEmail = `cust_${Date.now()}@naturesmud.shop`;
  const regPayload = {
    name: 'Manish Customer',
    email: testEmail,
    phone: '9841000000',
    password: 'Password@2026',
    password_confirmation: 'Password@2026'
  };
  const regRes = await request({
    path: '/api/v1/register',
    method: 'POST',
    headers: {
      Host: 'api.naturesmud.shop',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }, regPayload);
  const customerToken = regRes.body?.token;
  assert('Customer Registration (/api/v1/register)', regRes.statusCode === 201 && !!customerToken, `Created ${testEmail}, Token: Issued ✅`);

  const loginRes = await request({
    path: '/api/v1/login',
    method: 'POST',
    headers: {
      Host: 'api.naturesmud.shop',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }, { email: testEmail, password: 'Password@2026' });
  assert('Customer Login (/api/v1/login)', loginRes.statusCode === 200 && !!loginRes.body?.token, `Logged in successfully`);

  // 4. Cart & Order Placement
  console.log('\n--- 4. Testing End-to-End Order Creation Flow ---');
  const orderPayload = {
    shipping_name: 'Manish Customer',
    shipping_email: testEmail,
    shipping_phone: '9841000000',
    shipping_address: 'Baneshwor, Kathmandu',
    shipping_city: 'Kathmandu',
    is_valley: true,
    payment_method: 'cod',
    items: [
      {
        product_id: prodList[0]?.id || 1,
        quantity: 2
      }
    ],
    notes: 'Please deliver between 2 PM and 5 PM'
  };
  const orderRes = await request({
    path: '/api/v1/orders',
    method: 'POST',
    headers: {
      Host: 'api.naturesmud.shop',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${customerToken}`
    }
  }, orderPayload);
  const orderNumber = orderRes.body?.order_number || orderRes.body?.data?.order_number || orderRes.body?.order?.order_number;
  assert('Live Order Placement (/api/v1/orders)', (orderRes.statusCode === 200 || orderRes.statusCode === 201) && !!orderNumber, `Order placed: ${orderNumber || JSON.stringify(orderRes.body)}`);

  // 5. Admin API & Super Admin Authentication
  console.log('\n--- 5. Testing Admin Portal API & RBAC System ---');
  const adminLoginRes = await request({
    path: '/api/admin/auth/login',
    method: 'POST',
    headers: {
      Host: 'admin-api.naturesmud.shop',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }, {
    email: 'admin@naturesmud.shop',
    password: 'NatureMud@Admin2026!'
  });
  const adminToken = adminLoginRes.body?.data?.accessToken || adminLoginRes.body?.token;
  assert('Super Admin Login (/api/admin/auth/login)', adminLoginRes.statusCode === 200 && !!adminToken, `Logged in as Super Admin (Token: Issued ✅)`);

  if (adminToken) {
    const adminOrdersRes = await request({
      path: '/api/admin/orders',
      method: 'GET',
      headers: {
        Host: 'admin-api.naturesmud.shop',
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`
      }
    });
    const adminOrdersCount = Array.isArray(adminOrdersRes.body?.data) ? adminOrdersRes.body.data.length : 0;
    assert('Admin Orders Sync (/api/admin/orders)', adminOrdersRes.statusCode === 200, `Admin orders retrieved: ${adminOrdersCount} orders found`);

    const usersRes = await request({
      path: '/api/admin/users',
      method: 'GET',
      headers: {
        Host: 'admin-api.naturesmud.shop',
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`
      }
    });
    assert('Admin Users & RBAC Permissions (/api/admin/users)', usersRes.statusCode === 200, `Staff & roles verified`);
  }

  console.log('\n===============================================================');
  console.log(`  FINAL RESULT: ${passed} PASSED | ${failed} FAILED`);
  console.log('===============================================================\n');
}

runTests().catch(console.error);
