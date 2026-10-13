const fs = require('fs');

const pPath = 'lib/data/products.ts';
let content = fs.readFileSync(pPath, 'utf8');

// Parse products
const marker = 'export const products: Product[] = ';
const startIdx = content.indexOf(marker) + marker.length;
const endIdx = content.indexOf('export function');
const jsonText = content.substring(startIdx, endIdx).trim().replace(/;$/, '');
const products = JSON.parse(jsonText);

console.log('Original products count:', products.length);

// Apply Krisha Agriline Official Excel sheet updates:
// 1. Dehydrated Pineapple: Price Rs. 590, Weight 100 GM
// 2. Moringa Leaf Powder: Weight 200 GM, Price Rs. 690
// 3. Carrot Powder: Weight 80 GM, Price Rs. 490
// 4. Raw Cashew (premium-cashewnuts): Weight 150 GM, Price Rs. 750
// 5. Roasted Cashew (roasted-cashewnuts): Weight 200 GM, Price Rs. 750
// 6. Dry Figs (dry-figs-anjeer): Price Rs. 690, Weight 200 GM
// 7. Roasted Pista (premium-pistachio-roasted-salted): Price Rs. 895, Weight 200 GM
// 8. Coconut Oil 180ml: Weight 180 ML, Price Rs. 650
// 9. Mix Dry Nuts / Superfood Trail Mix (superfood-trail-mix): Price Rs. 690, Weight 200 GM

products.forEach(p => {
  if (p.slug === 'dehydrated-pineapple') {
    p.price = 590;
    p.compareAtPrice = 590;
    p.mrp = 590;
    p.weight = '100 GM';
    p.meta_description = p.meta_description.replace(/Rs\.\s*\d+/, 'Rs. 590');
    console.log('Updated dehydrated-pineapple: Rs.', p.price, p.weight);
  }
  if (p.slug === 'moringa-leaf-powder') {
    p.weight = '200 GM';
    p.shortDescription = p.shortDescription.replace(/100 GM/, '200 GM');
    console.log('Updated moringa-leaf-powder:', p.weight);
  }
  if (p.slug === 'carrot-powder') {
    p.weight = '80 GM';
    p.shortDescription = p.shortDescription.replace(/100g/, '80g');
    console.log('Updated carrot-powder:', p.weight);
  }
  if (p.slug === 'premium-cashewnuts') {
    p.weight = '150 GM';
    p.shortDescription = p.shortDescription.replace(/200g/, '150g');
    p.meta_description = p.meta_description.replace(/200 GM/, '150 GM');
    console.log('Updated premium-cashewnuts:', p.weight);
  }
  if (p.slug === 'roasted-cashewnuts') {
    p.weight = '200 GM';
    p.shortDescription = p.shortDescription.replace(/150g/, '200g');
    p.meta_description = p.meta_description.replace(/150 GM/, '200 GM');
    console.log('Updated roasted-cashewnuts:', p.weight);
  }
  if (p.slug === 'dry-figs-anjeer') {
    p.price = 690;
    p.compareAtPrice = 690;
    p.mrp = 690;
    p.weight = '200 GM';
    p.meta_description = p.meta_description.replace(/Rs\.\s*\d+/, 'Rs. 690');
    console.log('Updated dry-figs-anjeer: Rs.', p.price, p.weight);
  }
  if (p.slug === 'premium-pistachio-roasted-salted') {
    p.price = 895;
    p.compareAtPrice = 895;
    p.mrp = 895;
    p.weight = '200 GM';
    p.meta_description = p.meta_description.replace(/Rs\.\s*[\d,]+/, 'Rs. 895');
    console.log('Updated premium-pistachio-roasted-salted: Rs.', p.price, p.weight);
  }
  if (p.slug === 'virgin-coconut-oil-180ml') {
    p.weight = '180 ML';
    p.price = 650;
    p.compareAtPrice = 650;
    p.mrp = 650;
    p.shortDescription = p.shortDescription.replace(/180 GM/, '180 ML');
    console.log('Updated virgin-coconut-oil-180ml: Rs.', p.price, p.weight);
  }
  if (p.slug === 'superfood-trail-mix') {
    p.price = 690;
    p.compareAtPrice = 690;
    p.mrp = 690;
    p.weight = '200 GM';
    p.meta_description = p.meta_description.replace(/Rs\.\s*\d+/, 'Rs. 690');
    console.log('Updated superfood-trail-mix: Rs.', p.price, p.weight);
  }
});

const updatedJsonText = JSON.stringify(products, null, 2);
const newContent = content.substring(0, startIdx) + updatedJsonText + ';\n\n' + content.substring(endIdx);
fs.writeFileSync(pPath, newContent, 'utf8');
console.log('Successfully updated lib/data/products.ts!');
