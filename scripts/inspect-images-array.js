const fs = require('fs');

const content = fs.readFileSync('lib/data/products.ts', 'utf8');
const prods = [...content.matchAll(/"slug":\s*"([^"]+)"[\s\S]*?"images":\s*(\[[^\]]+\])/g)];

prods.forEach(p => {
  try {
    const arr = JSON.parse(p[2]);
    console.log(p[1].padEnd(35) + ' (' + arr.length + ' imgs): ' + arr.join(', '));
  } catch(e) {
    console.log(p[1] + ' error: ' + e.message);
  }
});
