const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== TEST RUN STANDALONE ON UNUSED PORT 3088 ===\\n";
  passthru('cd /home8/kathma13/naturesmud.shop && PORT=3088 timeout 5 /home8/kathma13/nodevenv/naturesmud.shop/20/bin/node .next/standalone/server.js 2>&1');
  `;
  fs.writeFileSync('test_standalone_port.php', php);
  await client.uploadFrom('test_standalone_port.php', '/api.naturesmud.shop/public/test_standalone_port.php');
  
  const req = https.get('https://api.naturesmud.shop/test_standalone_port.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/test_standalone_port.php');
      client.close();
      if (fs.existsSync('test_standalone_port.php')) fs.unlinkSync('test_standalone_port.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
