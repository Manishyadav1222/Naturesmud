const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== LSNODE.JS HEAD ===\\n";
  passthru('head -n 50 /usr/local/lsws/fcgi-bin/lsnode.js 2>&1');
  
  echo "\\n=== CHECK ADMIN-API SERVER.JS OR STARTUP FILE ===\\n";
  passthru('cat /home8/kathma13/admin-api.naturesmud.shop/.htaccess 2>&1');
  passthru('head -n 30 /home8/kathma13/admin-api.naturesmud.shop/* 2>&1');
  `;
  fs.writeFileSync('inspect_lsnode.php', php);
  await client.uploadFrom('inspect_lsnode.php', '/api.naturesmud.shop/public/inspect_lsnode.php');
  
  const req = https.get('https://api.naturesmud.shop/inspect_lsnode.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/inspect_lsnode.php');
      client.close();
      if (fs.existsSync('inspect_lsnode.php')) fs.unlinkSync('inspect_lsnode.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
