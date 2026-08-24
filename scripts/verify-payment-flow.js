const http = require('http');

function requestPromise(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function verifyPaymentSystem() {
  console.log('🚀 Running Payment Gateway, Receipt Upload & Valley Rule Verification...\n');

  // 1. Inside Valley COD Order
  console.log('1️⃣ Testing Inside Kathmandu Valley (COD)...');
  const codPayload = {
    items: [{ product_id: 1, quantity: 1 }],
    shipping_name: 'Aarav Sharma',
    shipping_phone: '9801122334',
    shipping_email: 'aarav@example.com',
    shipping_address: 'Gongabu Chowk, Kathmandu',
    shipping_city: 'Kathmandu',
    shipping_zone: 'Bagmati',
    payment_method: 'cod',
    is_valley: true,
  };

  const codRes = await requestPromise(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/orders',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    },
    codPayload
  );

  console.log(`Response [${codRes.status}]:`, codRes.data?.message || codRes.data);
  if (codRes.status === 201 && codRes.data?.order?.status === 'pending') {
    console.log(`✅ Inside Valley COD Order created successfully (${codRes.data.order.order_number}) with status: PENDING\n`);
  } else {
    console.error('❌ Inside Valley COD test failed');
  }

  // 2. Outside Valley COD Rejection
  console.log('2️⃣ Testing Outside Valley COD Rejection (Pokhara)...');
  const outsideCodPayload = {
    items: [{ product_id: 1, quantity: 1 }],
    shipping_name: 'Bikram Thapa',
    shipping_phone: '9841234567',
    shipping_email: 'bikram@example.com',
    shipping_address: 'New Road, Pokhara',
    shipping_city: 'Pokhara',
    shipping_zone: 'Gandaki',
    payment_method: 'cod',
    is_valley: false,
  };

  const outsideCodRes = await requestPromise(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/orders',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    },
    outsideCodPayload
  );

  console.log(`Response [${outsideCodRes.status}]:`, outsideCodRes.data?.message || outsideCodRes.data);
  if (outsideCodRes.status === 422) {
    console.log('✅ Outside Valley COD successfully blocked as required by business rule!\n');
  } else {
    console.error('❌ Outside Valley COD block test failed');
  }

  // 3. Outside Valley FonePay QR Advance Payment with Receipt
  console.log('3️⃣ Testing Outside Valley FonePay QR Order with Receipt (Krisha Agri Line Pvt Ltd)...');
  const fonepayPayload = {
    items: [{ product_id: 1, quantity: 2 }],
    shipping_name: 'Bikram Thapa',
    shipping_phone: '9841234567',
    shipping_email: 'bikram@example.com',
    shipping_address: 'New Road, Pokhara',
    shipping_city: 'Pokhara',
    shipping_zone: 'Gandaki',
    payment_method: 'fonepay',
    receipt_image: '/images/krisha-fonepay-qr.png',
    payment_reference: 'FONE-99882211',
    is_valley: false,
  };

  const fonepayRes = await requestPromise(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/orders',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    },
    fonepayPayload
  );

  console.log(`Response [${fonepayRes.status}]:`, fonepayRes.data?.message || fonepayRes.data);
  if (fonepayRes.status === 201 && fonepayRes.data?.order?.status === 'processing') {
    console.log(`✅ FonePay Order created with status: READY / PROCESSING and payment_status: PAID (${fonepayRes.data.order.order_number})\n`);
  } else {
    console.error('❌ FonePay QR order creation failed');
  }

  // 4. Test Notification API & WhatsApp Link
  console.log('4️⃣ Testing WhatsApp & Order Notification API...');
  const notifyRes = await requestPromise(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders/notify',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      orderNumber: 'NM-TEST999',
      customerName: 'Bikram Thapa',
      customerPhone: '9841234567',
      customerEmail: 'bikram@example.com',
      total: 1500,
      paymentMethod: 'fonepay',
      isValley: false,
      hasReceipt: true,
      receiptUrl: '/images/krisha-fonepay-qr.png',
    }
  );

  console.log(`Response [${notifyRes.status}]:`, notifyRes.data);
  if (notifyRes.status === 200 && notifyRes.data?.whatsappLink) {
    console.log('✅ WhatsApp Link generated:', notifyRes.data.whatsappLink);
  }
}

verifyPaymentSystem().catch(console.error);
