const http = require('http');

async function checkUrl(url, method = 'GET', postData = null) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: postData ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } : {},
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, error: err.message });
    });

    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('🧪 Starting Full System Verification...\n');

  // 1. Next.js Storefront & Pages
  console.log('1️⃣ Checking Storefront Pages:');
  const pages = ['/', '/products', '/checkout', '/offers', '/admin/orders', '/admin/dashboard'];
  for (const page of pages) {
    const res = await checkUrl(`http://localhost:3000${page}`);
    console.log(`   ${res.status === 200 ? '✅' : '❌'} http://localhost:3000${page} -> HTTP ${res.status}`);
  }

  // 2. WhatsApp Notification API
  console.log('\n2️⃣ Testing /api/orders/notify route (WhatsApp & Real-Time):');
  const notifyPayload = JSON.stringify({
    orderNumber: 'NM-TEST9999',
    customerName: 'Aarav Sharma',
    customerPhone: '9841000000',
    customerEmail: 'aarav@example.com',
    shippingAddress: 'Lazimpat, Kathmandu',
    shippingCity: 'Kathmandu',
    items: [
      { name: 'Pure Himalayan Shilajit Resin (20g)', quantity: 1, price: 2450 },
      { name: 'Organic Chia Seeds (250g)', quantity: 2, price: 450 }
    ],
    total: 3350,
    paymentMethod: 'fonepay',
    isValley: true,
    hasReceipt: true,
    receiptUrl: 'http://localhost:8000/storage/receipts/test.jpg'
  });

  const notifyRes = await checkUrl('http://localhost:3000/api/orders/notify', 'POST', notifyPayload);
  console.log(`   ${notifyRes.status === 200 ? '✅' : '❌'} /api/orders/notify -> HTTP ${notifyRes.status}`);
  if (notifyRes.status === 200) {
    const parsed = JSON.parse(notifyRes.data);
    console.log(`   📱 Generated WhatsApp Link:\n   ${parsed.whatsappLink.substring(0, 120)}...`);
  }

  // 3. Admin Backend Orders API
  console.log('\n3️⃣ Checking Admin API Orders endpoint:');
  const adminOrdersRes = await checkUrl('http://localhost:4001/api/admin/orders');
  console.log(`   ${adminOrdersRes.status === 200 ? '✅' : '❌'} http://localhost:4001/api/admin/orders -> HTTP ${adminOrdersRes.status}`);

  console.log('\n✨ Verification complete!');
}

run();
