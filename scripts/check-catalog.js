const fs = require('fs');
const content = fs.readFileSync('lib/data/products.ts', 'utf8');
const lines = content.split('\n');

let currentProduct = null;
const all = [];

for (const line of lines) {
  const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
  const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
  const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
  const imageMatch = line.match(/image:\s*['"]([^'"]+)['"]/);

  if (idMatch && line.includes('{')) {
    if (currentProduct) all.push(currentProduct);
    currentProduct = { id: idMatch[1] };
  } else if (idMatch && !currentProduct) {
    currentProduct = { id: idMatch[1] };
  }
  if (slugMatch && currentProduct) currentProduct.slug = slugMatch[1];
  if (nameMatch && currentProduct) currentProduct.name = nameMatch[1];
  if (imageMatch && currentProduct && !currentProduct.image) currentProduct.image = imageMatch[1];
}
if (currentProduct) all.push(currentProduct);

console.log('Total catalog products:', all.length);
all.forEach((p, idx) => {
  console.log(`${idx + 1}. ID: ${p.id} | Slug: ${p.slug} | Name: ${p.name} | Image: ${p.image}`);
});
