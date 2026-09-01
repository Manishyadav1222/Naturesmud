const fs = require('fs');

const content = fs.readFileSync('./lib/data/products.ts', 'utf8');
const slugs = ['chia-seeds', 'raw-himalayan-almonds', 'roasted-almonds', 'roasted-cashewnuts', 'premium-cashewnuts', 'dried-figs', 'himalayan-pink-salt', 'dried-cranberries'];

const blocks = content.split(/\{\s*"id":/);
blocks.forEach((block) => {
  slugs.forEach(s => {
    if (block.includes('"slug": "' + s + '"')) {
      console.log('===============================');
      console.log('SLUG:', s);
      const lines = block.split('\n').slice(0, 25).join('\n');
      console.log(lines);
    }
  });
});
