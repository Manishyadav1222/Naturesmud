const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function verifyCss() {
  console.log('Fetching homepage: https://naturesmud.shop/');
  const home = await fetchUrl('https://naturesmud.shop/');
  console.log('Homepage status:', home.status);

  const cssRegex = /href="(\/_next\/static\/css\/[^"]+\.css)"/g;
  let match;
  const cssUrls = [];
  while ((match = cssRegex.exec(home.body)) !== null) {
    cssUrls.push(match[1]);
  }
  console.log('CSS files found on homepage:', cssUrls);

  for (const url of cssUrls) {
    const fullUrl = 'https://naturesmud.shop' + url;
    const res = await fetchUrl(fullUrl);
    console.log(`Checking ${url} (Status: ${res.status}):`);
    console.log('  -> Includes Arial:', res.body.includes('Arial'));
    console.log('  -> Includes post-title:', res.body.includes('post-title'));
    console.log('  -> Includes 26px:', res.body.includes('26px'));
  }

  // Check blog page
  const blogUrl = 'https://naturesmud.shop/blog/nepali-sugar-detox-dates-sweet-potato-powder-baby-food-diabetes';
  const blogRes = await fetchUrl(blogUrl);
  console.log('\nChecking blog article:', blogUrl);
  console.log('  -> Article status:', blogRes.status);
  console.log('  -> Contains post-title class:', blogRes.body.includes('post-title'));
}

verifyCss().catch(console.error);
