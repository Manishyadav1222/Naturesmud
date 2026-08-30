const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'lib', 'data', 'recipes.ts'), 'utf8');
const lines = content.split('\n');
const images = [];

for (let line of lines) {
  let m = line.match(/image:\s*['"]([^'"]+)['"]/);
  if (m) images.push(m[1]);
}

console.log('Total recipe images in data:', images.length);
const unique = [...new Set(images)];
console.log('Unique recipe images count:', unique.length);

const missing = [];
unique.forEach(img => {
  const localPath = path.join(__dirname, '..', 'public', img.replace(/^\//, ''));
  const exists = fs.existsSync(localPath);
  if (!exists) missing.push(img);
  console.log(img, '->', exists ? '✅ EXISTS' : '❌ MISSING');
});

console.log('\nTotal missing images:', missing.length);
