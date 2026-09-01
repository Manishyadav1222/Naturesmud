const fs = require('fs');
const content = fs.readFileSync('./lib/data/products.ts', 'utf8');

// Match each product block
const blocks = content.split(/\{\s*"id":/);

blocks.forEach((block, i) => {
  if (i === 0) return;
  const slugMatch = block.match(/"slug":\s*"([^"]+)"/);
  const nameMatch = block.match(/"name":\s*"([^"]+)"/);
  const imageMatch = block.match(/"image":\s*"([^"]+)"/);
  const idMatch = block.match(/^\s*"([^"]+)"/);

  if (slugMatch && nameMatch && imageMatch) {
    console.log(
      (idMatch ? idMatch[1] : '?').padEnd(5),
      '|',
      slugMatch[1].padEnd(35),
      '|',
      nameMatch[1].padEnd(42),
      '|',
      imageMatch[1]
    );
  }
});
