const https = require('https');

function fetchHead(url) {
  return new Promise((resolve, reject) => {
    https.request(url, { method: 'HEAD' }, res => {
      resolve({ status: res.statusCode, headers: res.headers });
    }).on('error', reject).end();
  });
}

function fetchGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('--- 1. Checking Live Poster Assets ---');
  const posterHead = await fetchHead('https://naturesmud.shop/official-product-catalog.jpg');
  console.log('official-product-catalog.jpg:', posterHead.status, `${posterHead.headers['content-length']} bytes`);

  const posterImgHead = await fetchHead('https://naturesmud.shop/images/official-product-catalog.jpg');
  console.log('images/official-product-catalog.jpg:', posterImgHead.status, `${posterImgHead.headers['content-length']} bytes`);

  console.log('\n--- 2. Checking Live Catalog Page ---');
  const catalogRes = await fetchGet('https://naturesmud.shop/catalog');
  console.log('Catalog Page Status:', catalogRes.status);
  const html = catalogRes.data;

  console.log('Contains Himalayan Pink Salt:', html.includes('Himalayan Pink Salt'));
  console.log('Contains Himalayan Black Salt:', html.includes('Himalayan Black Salt'));
  console.log('Contains 200 GM:', html.includes('200 GM'));
  console.log('Contains 60 GM (Makhana):', html.includes('60 GM'));
  console.log('Contains 80 GM (Papaya):', html.includes('80 GM'));
  console.log('Contains Makhana:', html.includes('Makhana'));
  console.log('Contains Shilajit:', html.includes('Shilajit'));
  console.log('Contains View Master Flyer Poster:', html.includes('View Master Flyer Poster'));

  console.log('\n✅ Verification Finished!');
}

verify().catch(console.error);
