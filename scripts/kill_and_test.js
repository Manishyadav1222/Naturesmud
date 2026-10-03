const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== KILLING DUPLICATE/ORPHAN ADMIN-API PROCESSES (2097486, 2140950) ===\\n";
  passthru('kill -9 2097486 2140950 2>&1');
  
  sleep(1);
  echo "\\n=== PROCESSES AFTER KILL ===\\n";
  passthru('ps -u kathma13 -o pid,ppid,nlwp,args 2>&1');

  echo "\\n=== TOTAL THREADS NOW ===\\n";
  passthru('ps -u kathma13 -L -o pid,tid,nlwp,args | wc -l 2>&1');

  // Touch restart for naturesmud.shop
  file_put_contents('/home8/kathma13/naturesmud.shop/tmp/restart.txt', time());
  echo "\\nRestart touched for naturesmud.shop\\n";
  `;
  fs.writeFileSync('kill_and_test.php', php);
  await client.uploadFrom('kill_and_test.php', '/api.naturesmud.shop/public/kill_and_test.php');
  
  const req = https.get('https://api.naturesmud.shop/kill_and_test.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/kill_and_test.php');
      client.close();
      if (fs.existsSync('kill_and_test.php')) fs.unlinkSync('kill_and_test.php');

      console.log('Testing https://naturesmud.shop/ ...');
      setTimeout(() => {
        https.get('https://naturesmud.shop/', r => {
          let body = '';
          r.on('data', c => body += c);
          r.on('end', () => {
            console.log('Live Site Status:', r.statusCode, 'Body length:', body.length);
          });
        }).on('error', e => console.error('Error:', e.message));
      }, 2000);
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
