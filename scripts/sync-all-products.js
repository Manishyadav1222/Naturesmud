const https = require('https');

function getApiProducts() {
  return new Promise((resolve) => {
    https.get('https://api.naturesmud.shop/api/v1/products?per_page=100', { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).data || []);
        } catch {
          resolve([]);
        }
      });
    });
  });
}

async function main() {
  const apiProducts = await getApiProducts();
  console.log('API Products Count:', apiProducts.length);
  apiProducts.forEach(p => {
    console.log(`ID: ${p.id} | Slug: "${p.slug}" | Name: "${p.name}" | image_url: "${p.image_url}"`);
  });
}

main();
