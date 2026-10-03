const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== ADMIN-API PACKAGE.JSON ===\\n";
  passthru('cat /home8/kathma13/admin-api.naturesmud.shop/package.json 2>&1');
  
  echo "\\n=== ADMIN-API ENTRYPOINT (dist/index.js head) ===\\n";
  passthru('head -n 40 /home8/kathma13/admin-api.naturesmud.shop/dist/index.js 2>&1');

  echo "\\n=== CHECK PRISMA IN ADMIN-API ===\\n";
  passthru('ls -la /home8/kathma13/admin-api.naturesmud.shop/node_modules/.prisma 2>&1');
  `;
  fs.writeFileSync('inspect_admin.php', php);
  await client.uploadFrom('inspect_admin.php', '/api.naturesmud.shop/public/inspect_admin.php');
  
  const req = https.get('https://api.naturesmud.shop/inspect_admin.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/inspect_admin.php');
      client.close();
      if (fs.existsSync('inspect_admin.php')) fs.unlinkSync('inspect_admin.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
