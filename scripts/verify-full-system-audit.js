const https = require('https');
const http = require('http');

async function getUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, length: data.length, body: data }));
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function audit() {
  console.log('===========================================================');
  console.log('🚀 NATURE\'S MUD COMPREHENSIVE SYSTEM & STOREFRONT AUDIT');
  console.log('===========================================================\n');

  const urls = [
    { name: 'Storefront Homepage', url: 'https://naturesmud.shop/' },
    { name: 'Products Catalog', url: 'https://naturesmud.shop/products' },
    { name: 'Product Detail - Sweet Potato Powder', url: 'https://naturesmud.shop/products/sweet-potato-powder' },
    { name: 'Product Detail - Dates Powder', url: 'https://naturesmud.shop/products/dates-powder' },
    { name: 'Product Detail - Beetroot Powder', url: 'https://naturesmud.shop/products/beetroot-powder' },
    { name: 'Product Detail - Himalayan Shilajit', url: 'https://naturesmud.shop/products/pure-himalayan-shilajit' },
    { name: 'Product Detail - Wild Himalayan Honey', url: 'https://naturesmud.shop/products/wild-himalayan-raw-honey' },
    { name: 'Blog Index (100 Blogs + See More)', url: 'https://naturesmud.shop/blog' },
    { name: 'Blog Article - Dates Powder Sugar Detox', url: 'https://naturesmud.shop/blog/refined-sugar-detox-natural-dates-powder-nepal' },
    { name: 'Blog Article - Himalayan Shilajit Fulvic Acid', url: 'https://naturesmud.shop/blog/pure-himalayan-shilajit-resin-fulvic-acid-testosterone-cellular-energy' },
    { name: 'Blog Article - Sweet Potato Beta Carotene', url: 'https://naturesmud.shop/blog/beta-carotene-superfood-organic-sweet-potato-powder-guide' },
    { name: 'Recipes Directory', url: 'https://naturesmud.shop/recipes' },
    { name: 'Photo Gallery', url: 'https://naturesmud.shop/gallery' },
    { name: 'Offers & Campaigns', url: 'https://naturesmud.shop/offers' },
    { name: 'Cart Page', url: 'https://naturesmud.shop/cart' },
    { name: 'Checkout Page', url: 'https://naturesmud.shop/checkout' },
    { name: 'Order Tracking Page', url: 'https://naturesmud.shop/track-order' },
    { name: 'Backend API - Products List', url: 'https://api.naturesmud.shop/api/v1/products' },
    { name: 'Backend API - Categories List', url: 'https://api.naturesmud.shop/api/v1/categories' },
    { name: 'Backend API - Blogs List', url: 'https://api.naturesmud.shop/api/v1/blogs' }
  ];

  let passed = 0;
  let failed = 0;

  for (const item of urls) {
    const res = await getUrl(item.url);
    const ok = res.status === 200;
    if (ok) passed++;
    else failed++;
    const icon = ok ? '✅' : '❌';
    console.log(`${icon} [HTTP ${res.status || 'ERR'}] ${item.name} (${item.url}) - ${res.length || 0} bytes`);
  }

  console.log('\n-----------------------------------------------------------');
  console.log(`Audit Summary: ${passed}/${urls.length} Passed, ${failed} Failed`);
  console.log('-----------------------------------------------------------\n');
}

audit();
