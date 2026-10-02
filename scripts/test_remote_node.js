const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== NODE VERSION ===\\n";
  passthru('/home8/kathma13/nodevenv/naturesmud.shop/20/bin/node -v 2>&1');
  
  echo "\\n=== TEST REQUIRE NEXT IN ROOT ===\\n";
  passthru('cd /home8/kathma13/naturesmud.shop && /home8/kathma13/nodevenv/naturesmud.shop/20/bin/node -e "console.log(require(\\"next/package.json\\").version)" 2>&1');

  echo "\\n=== TEST REQUIRE NEXT IN STANDALONE ===\\n";
  passthru('cd /home8/kathma13/naturesmud.shop/.next/standalone && /home8/kathma13/nodevenv/naturesmud.shop/20/bin/node -e "console.log(require(\\"next/package.json\\").version)" 2>&1');
  `;
  fs.writeFileSync('test_node.php', php);
  await client.uploadFrom('test_node.php', '/api.naturesmud.shop/public/test_node.php');
  
  const req = https.get('https://api.naturesmud.shop/test_node.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/test_node.php');
      client.close();
      if (fs.existsSync('test_node.php')) fs.unlinkSync('test_node.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
