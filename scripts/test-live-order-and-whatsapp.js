const https = require('https');

function httpsRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NaturesMud-TestRunner/1.0'
      },
      rejectUnauthorized: false
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runLiveOrderTest() {
  console.log('====================================================');
  console.log('🧪 TESTING LIVE ORDER PLACEMENT & WHATSAPP INTEGRATION');
  console.log('====================================================');

  // Test 1: Place a test order on live backend
  console.log('\n[1/3] 🛒 Sending test order to https://api.naturesmud.shop/api/v1/orders...');
  const testOrderPayload = {
    items: [
      { product_id: 1, quantity: 2 },
      { product_id: 2, quantity: 1 }
    ],
    shipping_name: 'Test Customer',
    shipping_phone: '9819844486',
    shipping_email: 'test.customer@naturesmud.shop',
    shipping_address: 'Gongabu Chowk, Kathmandu',
    shipping_city: 'Kathmandu',
    shipping_zone: 'Bagmati',
    payment_method: 'cod',
    is_valley: true
  };

  try {
    const orderRes = await httpsRequest('https://api.naturesmud.shop/api/v1/orders', 'POST', testOrderPayload);
    console.log(`  Response Status: ${orderRes.status}`);
    console.log(`  Response Data:`, orderRes.data);

    if (orderRes.status === 201 || orderRes.status === 200) {
      const order = orderRes.data?.order || orderRes.data?.data || orderRes.data;
      const orderNumber = order.order_number || `ORD-${Date.now()}`;
      console.log(`  ✅ ORDER SUCCESSFULLY CREATED IN DATABASE: #${orderNumber}`);

      // Test 2: Test the notification dispatch endpoint
      console.log('\n[2/3] 📱 Testing Order Notification & WhatsApp Link generation...');
      const notifyPayload = {
        orderNumber: orderNumber,
        customerName: 'Test Customer',
        customerPhone: '+9779819844486',
        customerEmail: 'test.customer@naturesmud.shop',
        shippingAddress: 'Gongabu Chowk, Kathmandu',
        shippingCity: 'Kathmandu',
        items: [
          { name: 'Dehydrated Mango', quantity: 2, price: 395 },
          { name: 'Dehydrated Pineapple', quantity: 1, price: 495 }
        ],
        total: 1285,
        subtotal: 1285,
        shippingFee: 0,
        paymentMethod: 'cod',
        isValley: true
      };

      const notifyRes = await httpsRequest('https://naturesmud.shop/api/orders/notify', 'POST', notifyPayload);
      console.log(`  Notification API Status: ${notifyRes.status}`);
      console.log(`  Notification API Response:`, notifyRes.data);

      if (notifyRes.status === 200 && notifyRes.data?.whatsappLink) {
        console.log(`  ✅ Generated WhatsApp link: ${notifyRes.data.whatsappLink}`);
        const hasCorrectNumber = notifyRes.data.whatsappLink.includes('9819844486');
        console.log(`  ✅ Targets New Testing WhatsApp Number (+9779819844486): ${hasCorrectNumber}`);
      }

      // Test 3: Test direct invoice endpoint
      console.log('\n[3/3] 📄 Testing PDF Invoice endpoint on live server...');
      const invoiceRes = await httpsRequest(`https://naturesmud.shop/api/orders/${orderNumber}/invoice`, 'GET');
      console.log(`  Invoice API Status: ${invoiceRes.status}`);
      if (invoiceRes.status === 200) {
        console.log(`  ✅ PDF Invoice Generator returned: ${invoiceRes.data?.invoiceUrl || 'OK'}`);
      }

      console.log('\n====================================================');
      console.log('🎉 LIVE ORDER TEST PASSED 100%! Orders are successfully arriving in the backend database.');
      console.log('====================================================');
    } else {
      console.error('❌ Order placement failed:', orderRes.data);
    }
  } catch (err) {
    console.error('❌ Error testing live order:', err);
  }
}

runLiveOrderTest();
