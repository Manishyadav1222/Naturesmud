const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== TOTAL THREADS / PROCESSES FOR kathma13 ===\\n";
  passthru('ps -u kathma13 -L -o pid,tid,nlwp,args | wc -l 2>&1');
  
  echo "\\n=== PROCESS TREE ===\\n";
  passthru('pstree -p kathma13 2>&1 || ps -u kathma13 -o pid,ppid,nlwp,args 2>&1');
  `;
  fs.writeFileSync('check_threads.php', php);
  await client.uploadFrom('check_threads.php', '/api.naturesmud.shop/public/check_threads.php');
  
  const req = https.get('https://api.naturesmud.shop/check_threads.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/check_threads.php');
      client.close();
      if (fs.existsSync('check_threads.php')) fs.unlinkSync('check_threads.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
