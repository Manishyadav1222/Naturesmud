const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== TESTING NEXT APP PREPARE NOW THAT THREADS ARE FREE ===\\n";
  passthru('cd /home8/kathma13/naturesmud.shop && timeout 15 /home8/kathma13/nodevenv/naturesmud.shop/20/bin/node -e "
    const next = require(\\"next\\");
    const app = next({ dev: false, dir: \\"/home8/kathma13/naturesmud.shop\\" });
    console.log(\\"Calling app.prepare()...\\");
    app.prepare().then(() => {
      console.log(\\"SUCCESS: APP PREPARED!\\");
      process.exit(0);
    }).catch(err => {
      console.error(\\"PREPARE FAILED:\\", err);
      process.exit(1);
    });
  " 2>&1');
  `;
  fs.writeFileSync('test_prepare_free.php', php);
  await client.uploadFrom('test_prepare_free.php', '/api.naturesmud.shop/public/test_prepare_free.php');
  
  const req = https.get('https://api.naturesmud.shop/test_prepare_free.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/test_prepare_free.php');
      client.close();
      if (fs.existsSync('test_prepare_free.php')) fs.unlinkSync('test_prepare_free.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
