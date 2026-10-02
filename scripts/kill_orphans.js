const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== KILLING ORPHAN ADMIN-API PROCESSES (3516097, 2226006) ===\\n";
  passthru('kill -9 3516097 2226006 2>&1');
  
  sleep(1);
  echo "\\n=== PROCESSES AFTER KILL ===\\n";
  passthru('ps -u kathma13 -o pid,ppid,nlwp,args 2>&1');

  echo "\\n=== TOTAL THREADS NOW ===\\n";
  passthru('ps -u kathma13 -L -o pid,tid,nlwp,args | wc -l 2>&1');
  `;
  fs.writeFileSync('kill_orphans.php', php);
  await client.uploadFrom('kill_orphans.php', '/api.naturesmud.shop/public/kill_orphans.php');
  
  const req = https.get('https://api.naturesmud.shop/kill_orphans.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/kill_orphans.php');
      client.close();
      if (fs.existsSync('kill_orphans.php')) fs.unlinkSync('kill_orphans.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
