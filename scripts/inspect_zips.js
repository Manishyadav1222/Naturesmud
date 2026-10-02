const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== CHECK BACKUP ZIPS IN /home8/kathma13/naturesmud.shop ===\\n";
  passthru('ls -la /home8/kathma13/naturesmud.shop/*.zip 2>&1');
  
  echo "\\n=== CHECK BACKUP ZIPS IN /home8/kathma13 ===\\n";
  passthru('ls -la /home8/kathma13/*.zip 2>&1');

  echo "\\n=== CHECK IF .next/standalone EXISTS ===\\n";
  passthru('ls -la /home8/kathma13/naturesmud.shop/.next/standalone 2>&1');

  echo "\\n=== CHECK GIT LOG OR COMMITS ON SERVER IF .git EXISTS ===\\n";
  passthru('ls -la /home8/kathma13/naturesmud.shop/.git 2>&1');
  `;
  fs.writeFileSync('inspect_zip.php', php);
  await client.uploadFrom('inspect_zip.php', '/api.naturesmud.shop/public/inspect_zip.php');
  
  const req = https.get('https://api.naturesmud.shop/inspect_zip.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/inspect_zip.php');
      client.close();
      if (fs.existsSync('inspect_zip.php')) fs.unlinkSync('inspect_zip.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
