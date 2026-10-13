const fs = require('fs');

console.log('=== CHECKING POSTER SCRIPT (scripts/generate-catalog-poster.js) ===');
const posterContent = fs.readFileSync('scripts/generate-catalog-poster.js', 'utf8');
const posterLines = posterContent.split('\n');
posterLines.forEach((l, idx) => {
  if (l.includes('Rs.') || (l.includes('<text') && (l.includes('GM') || l.includes('ML')))) {
    console.log(`Poster L${idx+1}: ${l.trim()}`);
  }
});

console.log('\n=== CHECKING PDF SCRIPT (scripts/generate-pdf-catalog.js) ===');
const pdfContent = fs.readFileSync('scripts/generate-pdf-catalog.js', 'utf8');
const pdfLines = pdfContent.split('\n');
pdfLines.slice(45, 87).forEach((l, idx) => {
  console.log(`PDF L${idx+46}: ${l.trim()}`);
});
