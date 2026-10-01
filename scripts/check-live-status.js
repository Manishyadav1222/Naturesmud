const https = require('https');
const fs = require('fs');
const path = require('path');

const localBuildId = fs.readFileSync(path.join(__dirname, '..', '.next', 'BUILD_ID'), 'utf8').trim();
console.log('Local BUILD_ID:', localBuildId);

https.get('https://naturesmud.shop/about', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('About status:', res.statusCode);
    const m = body.match(/\"buildId\":\"([^\"]+)\"/);
    console.log('Live server buildId:', m ? m[1] : 'not found');
    console.log('Matches local buildId?', m && m[1] === localBuildId);
    
    // Check if "Authenticity On Every Table" is in the HTML
    const hasAuthenticity = body.includes('Authenticity On Every Table');
    console.log('Has "Authenticity On Every Table" text?', hasAuthenticity);
  });
});
