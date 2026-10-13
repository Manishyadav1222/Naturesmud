const fs = require('fs');

const poster = fs.readFileSync('scripts/generate-catalog-poster.js', 'utf8');

const regex = /<!--\s*(?:Row\s*)?(\d+):\s*([^>]+)-->([\s\S]*?)<\/g>/g;
let m;
while ((m = regex.exec(poster)) !== null) {
  const sn = m[1];
  const block = m[3];
  const nameM = block.match(/class="title"[^>]*>([^<]+)<\/text>/);
  const qtyM = block.match(/<text x="375"[^>]*>([^<]+)<\/text>/);
  const priceM = block.match(/Rs\.\s*([^<]+)<\/text>/);
  if (nameM && qtyM && priceM) {
    console.log(`${sn}. ${nameM[1].trim()} | QTY: ${qtyM[1].trim()} | PRICE: Rs. ${priceM[1].trim()}`);
  }
}
