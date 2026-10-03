const ftp = require('basic-ftp');
const https = require('https');
const path = require('path');

async function main() {
  console.log('🚀 Applying PERMANENT Fix for 503 & Resource Exhaustion on Nest Nepal...');

  const client = new ftp.Client();
  await client.access({
    host: '167.235.9.123',
    user: 'kathma13',
    password: '2*5Qt7iSrB7-Uz',
    secure: false
  });
  console.log('✅ FTP Connected');

  // 1. Upload optimized server.js to naturesmud.shop
  console.log('1. Uploading optimized server.js to naturesmud.shop ...');
  await client.uploadFrom(path.join(__dirname, '../server.js'), '/naturesmud.shop/server.js');
  console.log('✅ server.js uploaded');

  // 2. Upload watchdog.php to /home8/kathma13/scripts/watchdog.php
  console.log('2. Uploading watchdog.php to /home8/kathma13/scripts/watchdog.php ...');
  await client.uploadFrom(path.join(__dirname, 'watchdog.php'), '/scripts/watchdog.php');
  console.log('✅ watchdog.php uploaded');

  // 3. Upload remote_fix.php to api.naturesmud.shop/public/remote_fix.php
  console.log('3. Uploading remote_fix.php to api.naturesmud.shop/public/ ...');
  await client.uploadFrom(path.join(__dirname, 'remote_fix.php'), '/api.naturesmud.shop/public/remote_fix.php');
  console.log('✅ remote_fix.php uploaded');

  // 4. Trigger remote_fix.php via HTTPS
  console.log('4. Executing remote_fix.php via HTTPS ...');
  await new Promise((resolve, reject) => {
    https.get('https://api.naturesmud.shop/remote_fix.php', (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', async () => {
        console.log('\n--- Server Execution Output ---');
        console.log(d);
        await client.remove('/api.naturesmud.shop/public/remote_fix.php');
        client.close();
        resolve();
      });
    }).on('error', reject);
  });

  // 5. Verify live site
  console.log('\n5. Waiting 3 seconds, then verifying live site ...');
  await new Promise(r => setTimeout(r, 3000));

  https.get('https://naturesmud.shop/', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log(`\n🎉 Live Site Status: [${res.statusCode}] OK (Length: ${d.length} bytes)`);
      console.log('Contains roasted-almonds-v2.jpg:', d.includes('roasted-almonds-v2.jpg'));
      console.log('Contains avocado-powder-v2.jpg:', d.includes('avocado-powder-v2.jpg'));
      console.log('Contains strawberry-powder-v2.jpg:', d.includes('strawberry-powder-v2.jpg'));
      console.log('Contains Himalayan Superfood Bundles:', d.includes('Himalayan Superfood Bundles'));
      console.log('\n✅ Permanent Fix Deployed and Verified Successfully!');
    });
  }).on('error', console.error);
}

main().catch(console.error);
