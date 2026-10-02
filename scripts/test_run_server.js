const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== TEST RUN CURRENT SERVER.JS ===\\n";
  passthru('cd /home8/kathma13/naturesmud.shop && timeout 5 /home8/kathma13/nodevenv/naturesmud.shop/20/bin/node server.js 2>&1');
  `;
  fs.writeFileSync('test_run_server.php', php);
  await client.uploadFrom('test_run_server.php', '/api.naturesmud.shop/public/test_run_server.php');
  
  const req = https.get('https://api.naturesmud.shop/test_run_server.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/test_run_server.php');
      client.close();
      if (fs.existsSync('test_run_server.php')) fs.unlinkSync('test_run_server.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
