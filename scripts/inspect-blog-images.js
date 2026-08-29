const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.join(__dirname, '..', 'lib', 'data', 'blogs-database.ts'), 'utf8');

// Extract all blog definitions
const posts = [];
const lines = file.split('\n');
let current = {};
for (let line of lines) {
  let mSlug = line.match(/slug:\s*['"]([^'"]+)['"]/);
  let mTitle = line.match(/title:\s*['"]([^'"]+)['"]/);
  let mImg = line.match(/image:\s*['"]([^'"]+)['"]/);
  let mCat = line.match(/category:\s*['"]([^'"]+)['"]/);

  if (mSlug) current.slug = mSlug[1];
  if (mTitle) current.title = mTitle[1];
  if (mImg) current.image = mImg[1];
  if (mCat) current.category = mCat[1];

  if (line.includes('}') && current.slug) {
    posts.push({...current});
    current = {};
  }
}

console.log('Total extracted posts:', posts.length);
const images = posts.map(p => p.image).filter(Boolean);
const uniqueImages = [...new Set(images)];
console.log('Unique images used count:', uniqueImages.length);
console.log('Images list:', uniqueImages);

// Also check topics list
const topicMatches = [...file.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total topic slugs found:', topicMatches.length);
