const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

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
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
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

async function testAll() {
  console.log('=== NATURE\'S MUD COMPREHENSIVE SITE AUDIT ===\n');

  const staticPages = [
    '/',
    '/products',
    '/about',
    '/our-story',
    '/health-benefits',
    '/offers',
    '/recipes',
    '/blog',
    '/gallery',
    '/contact',
    '/faq',
    '/become-distributor',
    '/wholesale',
    '/privacy-policy',
    '/return-policy',
    '/shipping-policy',
    '/terms',
    '/cart',
    '/checkout',
    '/track-order',
    '/login',
    '/register',
    '/admin'
  ];

  console.log('--- 1. Testing Static Frontend Pages ---');
  let pageFailures = 0;
  for (const page of staticPages) {
    const res = await request({
      path: page,
      method: 'GET',
      headers: { Host: 'naturesmud.shop' }
    });
    if (res.statusCode === 200 || res.statusCode === 307 || res.statusCode === 308) {
      console.log(`✅ [${res.statusCode}] ${page}`);
    } else {
      console.log(`❌ [${res.statusCode}] ${page}`);
      pageFailures++;
    }
  }

  // Load products to test slugs
  console.log('\n--- 2. Testing Dynamic Product Detail Pages ---');
  const catRes = await request({
    path: '/api/v1/products',
    method: 'GET',
    headers: { Host: 'api.naturesmud.shop', Accept: 'application/json' }
  });
  let products = [];
  try {
    const parsed = JSON.parse(catRes.body);
    products = parsed.data || parsed || [];
  } catch (e) {}

  let prodFailures = 0;
  for (const prod of products.slice(0, 10)) {
    const slug = prod.slug;
    const res = await request({
      path: `/products/${slug}`,
      method: 'GET',
      headers: { Host: 'naturesmud.shop' }
    });
    if (res.statusCode === 200) {
      console.log(`✅ [200] /products/${slug}`);
    } else {
      console.log(`❌ [${res.statusCode}] /products/${slug}`);
      prodFailures++;
    }
  }

  console.log('\n--- 3. Testing Recipes & Blog Details ---');
  const sampleSlugs = [
    '/recipes/beetroot-pancakes',
    '/recipes/sweet-potato-baby-puree',
    '/recipes/himalayan-vitality-smoothie',
    '/blog/why-himalayan-superfoods-matter',
    '/blog/baby-weaning-guide-organic'
  ];
  for (const s of sampleSlugs) {
    const res = await request({
      path: s,
      method: 'GET',
      headers: { Host: 'naturesmud.shop' }
    });
    if (res.statusCode === 200) {
      console.log(`✅ [200] ${s}`);
    } else {
      console.log(`❌ [${res.statusCode}] ${s}`);
    }
  }

  console.log('\n--- 4. Checking SSL & Redirects ---');
  // Check HTTP to HTTPS redirect
  const httpReq = await new Promise((resolve) => {
    http.get({
      hostname: config.host,
      port: 80,
      path: '/',
      headers: { Host: 'naturesmud.shop' }
    }, (res) => {
      resolve({ statusCode: res.statusCode, location: res.headers.location });
    }).on('error', (err) => resolve({ error: err.message }));
  });
  console.log(`HTTP Port 80 Response: [${httpReq.statusCode}] Location: ${httpReq.location || 'None'}`);

  console.log('\n--- 5. Testing Admin Portal Routes ---');
  const adminRoutes = [
    '/admin/dashboard',
    '/admin/orders',
    '/admin/products',
    '/admin/inventory',
    '/admin/customers',
    '/admin/analytics',
    '/admin/messages',
    '/admin/reviews',
    '/admin/marketing/offers',
    '/admin/marketing/coupons',
    '/admin/gallery',
    '/admin/users',
    '/admin/settings'
  ];
  for (const ar of adminRoutes) {
    const res = await request({
      path: ar,
      method: 'GET',
      headers: { Host: 'naturesmud.shop' }
    });
    if (res.statusCode === 200 || res.statusCode === 307 || res.statusCode === 308) {
      console.log(`✅ [${res.statusCode}] ${ar}`);
    } else {
      console.log(`❌ [${res.statusCode}] ${ar}`);
    }
  }

  console.log('\nAudit complete!');
}

testAll().catch(console.error);
