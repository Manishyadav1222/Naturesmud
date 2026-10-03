const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== .htaccess of admin-api.naturesmud.shop ===\\n";
  passthru('cat /home8/kathma13/admin-api.naturesmud.shop/.htaccess 2>&1');
  
  echo "\\n=== .htaccess of naturesmud.shop ===\\n";
  passthru('cat /home8/kathma13/naturesmud.shop/.htaccess 2>&1');

  echo "\\n=== CHECK CRON JOBS FOR kathma13 ===\\n";
  passthru('crontab -l 2>&1');

  echo "\\n=== CHECK LAST 50 LINES OF naturesmud.shop stderr.log ===\\n";
  passthru('tail -n 50 /home8/kathma13/naturesmud.shop/stderr.log 2>&1');

  echo "\\n=== CHECK LAST 50 LINES OF admin-api stderr.log ===\\n";
  passthru('tail -n 50 /home8/kathma13/admin-api.naturesmud.shop/stderr.log 2>&1');
  `;
  fs.writeFileSync('inspect_deep.php', php);
  await client.uploadFrom('inspect_deep.php', '/api.naturesmud.shop/public/inspect_deep.php');
  
  const req = https.get('https://api.naturesmud.shop/inspect_deep.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/inspect_deep.php');
      client.close();
      if (fs.existsSync('inspect_deep.php')) fs.unlinkSync('inspect_deep.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
