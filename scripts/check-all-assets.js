const https = require('https');
const fs = require('fs');
const path = require('path');

const config = {
  host: '167.235.9.123'
};

function headCheck(imgSrc) {
  return new Promise((resolve) => {
    let cleanPath = imgSrc.startsWith('http') ? new URL(imgSrc).pathname : imgSrc;
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

    const req = https.request({
      hostname: config.host,
      port: 443,
      path: cleanPath,
      method: 'HEAD',
      headers: { Host: 'naturesmud.shop' },
      rejectUnauthorized: false
    }, (res) => {
      resolve({ path: cleanPath, status: res.statusCode });
    });

    req.on('error', (err) => resolve({ path: cleanPath, status: 'ERROR: ' + err.message }));
    req.end();
  });
}

async function auditImages() {
  console.log('=== AUDITING ALL IMAGES ON NATURESMUD.SHOP ===\n');

  // Find all image references in code
  const productData = fs.readFileSync(path.join(__dirname, '../lib/data/products.ts'), 'utf8');
  const recipeData = fs.readFileSync(path.join(__dirname, '../lib/data/recipes.ts'), 'utf8');
  const contentData = fs.readFileSync(path.join(__dirname, '../lib/data/content.ts'), 'utf8');

  const regex = /['"](\/(?:products|images|recipes|icons|assets)[^'"]+\.(?:jpg|jpeg|png|webp|svg|gif))['"]/g;
  const imageSet = new Set();

  let match;
  while ((match = regex.exec(productData)) !== null) imageSet.add(match[1]);
  while ((match = regex.exec(recipeData)) !== null) imageSet.add(match[1]);
  while ((match = regex.exec(contentData)) !== null) imageSet.add(match[1]);

  console.log(`Found ${imageSet.size} unique image paths referenced in content data.\nChecking on live server...`);

  let missing = 0;
  let ok = 0;

  for (const img of imageSet) {
    const res = await headCheck(img);
    if (res.status === 200) {
      ok++;
    } else {
      console.log(`❌ [${res.status}] ${img}`);
      missing++;
    }
  }

  console.log(`\nImage Check Results: ${ok} OK, ${missing} MISSING`);
}

auditImages().catch(console.error);
