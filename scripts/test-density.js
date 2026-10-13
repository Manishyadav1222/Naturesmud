const sharp = require('sharp');

const testSvg = '<svg width="1600" height="3450" viewBox="0 0 1600 3450" xmlns="http://www.w3.org/2000/svg"><rect width="1600" height="3450" fill="#fff"/><text x="100" y="100" font-size="40">Test</text></svg>';

sharp(Buffer.from(testSvg), { density: 144 })
  .jpeg({ quality: 95 })
  .toBuffer()
  .then(b => {
    sharp(b).metadata().then(meta => {
      console.log('density: 144 -> width:', meta.width, 'height:', meta.height, 'size:', b.length);
    });
  })
  .catch(console.error);
