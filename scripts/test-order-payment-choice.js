const https = require('https');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

async function testPaymentChoices() {
  console.log('=== Testing Admin Order Payment Choices (COD, Online Pay, Confirmed after deliver) ===\n');

  // 1. Admin Login
  console.log('[1/4] Logging in as admin...');
  const loginRes = await request({
    hostname: '167.235.9.123',
    port: 443,
    path: '/api/admin/auth/login',
    method: 'POST',
    headers: {
      'Host': 'admin-api.naturesmud.shop',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    rejectUnauthorized: false
  }, {
    email: 'admin@naturesmud.shop',
    password: 'NatureMud@Admin2026!'
  });

  const token = loginRes.data?.data?.accessToken || loginRes.data?.accessToken;
  if (!token) {
    throw new Error('Failed to obtain admin token: ' + JSON.stringify(loginRes.data));
  }
  console.log('✅ Admin authenticated successfully!');

  const headers = {
    'Host': 'admin-api.naturesmud.shop',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 2. Fetch Latest Order
  console.log('\n[2/4] Fetching latest order to test payment choices...');
  const ordersRes = await request({
    hostname: '167.235.9.123',
    port: 443,
    path: '/api/admin/orders?limit=1',
    method: 'GET',
    headers,
    rejectUnauthorized: false
  });

  const order = ordersRes.data?.data?.[0];
  if (!order) {
    console.log('No orders found to test.');
    return;
  }
  console.log(`✅ Found order #${order.orderNumber} (ID: ${order.id})`);
  console.log(`   Initial State: Method=${order.paymentMethod}, Status=${order.paymentStatus}, OrderStatus=${order.status}`);

  // 3. Test "Confirmed after the deliver"
  console.log('\n[3/4] Updating order to "Confirmed after the deliver" (COD delivered & paid)...');
  const patchRes = await request({
    hostname: '167.235.9.123',
    port: 443,
    path: `/api/admin/orders/${order.id}/payment`,
    method: 'PATCH',
    headers,
    rejectUnauthorized: false
  }, {
    paymentStatus: 'CONFIRMED_AFTER_DELIVERY',
    paymentMethod: 'cod',
    status: 'DELIVERED',
    comment: 'Payment confirmed after delivery (COD received upon courier delivery).'
  });

  console.log('PATCH Response:', patchRes.data);

  // 4. Verify by GET /orders/:id
  console.log('\n[4/4] Verifying order detail from database...');
  const verifyRes = await request({
    hostname: '167.235.9.123',
    port: 443,
    path: `/api/admin/orders/${order.id}`,
    method: 'GET',
    headers,
    rejectUnauthorized: false
  });

  const updated = verifyRes.data?.data;
  console.log(`✅ Order #${updated.orderNumber} Verified:`);
  console.log(`   Payment Method: ${updated.paymentMethod}`);
  console.log(`   Payment Status: ${updated.paymentStatus}`);
  console.log(`   Order Status:   ${updated.status}`);
  console.log(`   Status History entries: ${updated.statusHistory?.length}`);
  const latestHistory = updated.statusHistory?.[updated.statusHistory.length - 1];
  console.log(`   Latest Note:    ${latestHistory?.comment}`);

  if (updated.paymentStatus === 'CONFIRMED_AFTER_DELIVERY' && updated.paymentMethod === 'cod') {
    console.log('\n🎉 ALL CHECKS PASSED: "Confirmed after delivery" and "COD" are functioning 100% correctly!');
  } else {
    console.log('\n⚠️ Unexpected payment status:', updated.paymentStatus);
  }
}

testPaymentChoices().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
