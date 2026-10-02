const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== Files in frontend-optimized-dist.zip ===\\n";
  passthru('unzip -l /home8/kathma13/naturesmud.shop/frontend-optimized-dist.zip | grep -E "server|package|app|index" | head -n 30 2>&1');
  `;
  fs.writeFileSync('inspect_zip_server.php', php);
  await client.uploadFrom('inspect_zip_server.php', '/api.naturesmud.shop/public/inspect_zip_server.php');
  
  const req = https.get('https://api.naturesmud.shop/inspect_zip_server.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/inspect_zip_server.php');
      client.close();
      if (fs.existsSync('inspect_zip_server.php')) fs.unlinkSync('inspect_zip_server.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
