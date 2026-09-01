const fs = require('fs');
const content = fs.readFileSync('lib/data/products.ts', 'utf8');
const prods = [];
const regex = /"id":\s*"([^"]+)",\s*"slug":\s*"([^"]+)",\s*"dbId":\s*(\d+),\s*"name":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(content)) !== null) {
  prods.push({ id: m[1], slug: m[2], dbId: m[3], name: m[4] });
}
console.log('Total products:', prods.length);
prods.forEach(p => console.log(`[${p.id}] ${p.slug} => "${p.name}"`));
