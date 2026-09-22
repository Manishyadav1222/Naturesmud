const https = require('https');
const fs = require('fs');
const path = require('path');

async function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    });
  });
}

async function verifyAllLiveImages() {
  const content = fs.readFileSync('components/MobileHeroSection.tsx', 'utf8');
  const matches = [...new Set([...content.matchAll(/image:\s*'([^']+)'/g)].map(m => m[1]))];
  console.log('Testing', matches.length, 'unique images on https://naturesmud.shop ...\n');

  let failed = 0;
  for (const img of matches) {
    const liveUrl = `https://naturesmud.shop${img}`;
    const res = await testUrl(liveUrl);
    if (res.status === 200) {
      console.log(`✅ ${res.status}: ${img}`);
    } else {
      console.log(`❌ ${res.status}: ${img} -> ${liveUrl}`);
      failed++;
    }
  }

  console.log(`\nResult: ${matches.length - failed}/${matches.length} images return HTTP 200 on live site.`);
}

verifyAllLiveImages().catch(console.error);
