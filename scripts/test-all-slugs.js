const axios = require('axios');
const fs = require('fs');

const productsTs = fs.readFileSync('lib/data/products.ts', 'utf8');
const slugs = [];
const regex = /"slug":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(productsTs)) !== null) {
  if (!slugs.includes(m[1])) slugs.push(m[1]);
}

async function checkSlugs() {
  console.log('Testing ' + slugs.length + ' slugs against https://api.naturesmud.shop/api/v1/products/:slug ...');
  const results = [];
  for (const s of slugs) {
    try {
      const res = await axios.get('https://api.naturesmud.shop/api/v1/products/' + s, { timeout: 10000 });
      results.push({ slug: s, status: res.status });
    } catch (err) {
      results.push({ slug: s, status: err.response?.status || err.message });
    }
  }
  const failed = results.filter(r => r.status !== 200);
  console.log('Total checked: ' + results.length + ' | Failed: ' + failed.length);
  if (failed.length > 0) {
    console.table(failed);
  } else {
    console.log('ALL SLUGS RETURNED 200 OK!');
  }
}
checkSlugs();
