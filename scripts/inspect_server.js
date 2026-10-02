const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== CURRENT DIRECTORY LISTING OF naturesmud.shop ===\\n";
  passthru('ls -la /home8/kathma13/naturesmud.shop 2>&1');
  
  echo "\\n=== NODE & PASSENGER PROCESSES ===\\n";
  passthru('ps aux | grep kathma13 | grep -v grep 2>&1');

  echo "\\n=== LAST 40 LINES OF stderr.log ===\\n";
  passthru('tail -n 40 /home8/kathma13/logs/naturesmud.shop_stderr.log 2>&1');
  
  echo "\\n=== CHECK SERVER.JS HEAD ===\\n";
  passthru('head -n 25 /home8/kathma13/naturesmud.shop/server.js 2>&1');
  `;
  fs.writeFileSync('inspect.php', php);
  await client.uploadFrom('inspect.php', '/api.naturesmud.shop/public/inspect.php');
  https.get('https://api.naturesmud.shop/test_inspect.php', res => {});
  
  const req = https.get('https://api.naturesmud.shop/inspect.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/inspect.php');
      client.close();
      if (fs.existsSync('inspect.php')) fs.unlinkSync('inspect.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
