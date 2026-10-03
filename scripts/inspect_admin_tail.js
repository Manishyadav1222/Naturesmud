const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== ADMIN-API ENTRYPOINT (tail 50) ===\\n";
  passthru('tail -n 50 /home8/kathma13/admin-api.naturesmud.shop/dist/index.js 2>&1');
  `;
  fs.writeFileSync('inspect_admin_tail.php', php);
  await client.uploadFrom('inspect_admin_tail.php', '/api.naturesmud.shop/public/inspect_admin_tail.php');
  
  const req = https.get('https://api.naturesmud.shop/inspect_admin_tail.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/inspect_admin_tail.php');
      client.close();
      if (fs.existsSync('inspect_admin_tail.php')) fs.unlinkSync('inspect_admin_tail.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
