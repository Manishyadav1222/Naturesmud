const https = require('https');

const testUrls = [
  'https://naturesmud.shop/blog/could-another-flood-happen-nepal-new-glacial-lake-explained',
  'https://naturesmud.shop/blog/nepal-hydropower-crisis-after-flood-which-projects-damaged',
  'https://naturesmud.shop/blog/healthy-raksha-bandhan-gifting-guide-nepal-superfood-hampers',
  'https://naturesmud.shop/blog/himalayan-superfood-lineup-pack-5-jar-complete-starter-kit',
  'https://naturesmud.shop/cart',
  'https://naturesmud.shop/'
];

async function run() {
  for (const url of testUrls) {
    await new Promise((resolve) => {
      https.get(url, { rejectUnauthorized: false }, (res) => {
        let d = '';
        res.on('data', chunk => d += chunk);
        res.on('end', () => {
          console.log(`[${res.statusCode}] ${url} (${d.length} bytes)`);
          resolve();
        });
      }).on('error', (e) => {
        console.log(`[ERROR] ${url}: ${e.message}`);
        resolve();
      });
    });
  }
}

run();
