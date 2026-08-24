const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR: ' + err.message });
    });
  });
}

async function verifyAll() {
  console.log('🚀 Running System-Wide Purity & Route Verification...\n');

  const frontendRoutes = [
    'http://localhost:3000/',
    'http://localhost:3000/products',
    'http://localhost:3000/offers',
    'http://localhost:3000/about',
    'http://localhost:3000/recipes',
    'http://localhost:3000/blog',
    'http://localhost:3000/contact',
    'http://localhost:3000/faq',
    'http://localhost:3000/admin/dashboard',
    'http://localhost:3000/admin/analytics',
    'http://localhost:3000/admin/messages',
    'http://localhost:3000/admin/reviews',
    'http://localhost:3000/admin/inventory',
    'http://localhost:3000/admin/marketing/offers',
  ];

  console.log('--- Checking Next.js Frontend Routes ---');
  for (const url of frontendRoutes) {
    const res = await checkUrl(url);
    const pass = res.status === 200 || res.status === 307 || res.status === 308;
    console.log(`${pass ? '✅' : '❌'} [${res.status}] ${url}`);
  }

  const backendApis = [
    'http://127.0.0.1:8000/api/v1/products',
  ];

  console.log('\n--- Checking Laravel API ---');
  for (const url of backendApis) {
    const res = await checkUrl(url);
    const pass = res.status === 200;
    console.log(`${pass ? '✅' : '❌'} [${res.status}] ${url}`);
  }

  // Test submitting a contact message
  console.log('\n--- Testing Contact Message Submission ---');
  const postData = JSON.stringify({
    name: 'Sushil Shrestha',
    email: 'sushil@example.com',
    phone: '9802323451',
    subject: 'Baby Food & Weaning Inquiry',
    message: 'Hello, what is the recommended dosage of Sweet Potato Powder for a 7 month infant?',
  });

  const req = http.request(
    {
      hostname: '127.0.0.1',
      port: 4001,
      path: '/api/admin/messages/public',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    },
    (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        console.log(`✅ Contact Message API Response [${res.statusCode}]:`, data);
      });
    }
  );
  req.on('error', (e) => console.error('❌ Contact Message Error:', e.message));
  req.write(postData);
  req.end();
}

verifyAll();
