const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  header('Content-Type: text/plain');
  echo "=== ALL PROCESSES FOR kathma13 ===\\n";
  passthru('ps -u kathma13 -o pid,ppid,nlwp,pcpu,pmem,args 2>&1');
  
  echo "\\n=== ULIMIT -a ===\\n";
  passthru('ulimit -a 2>&1');
  `;
  fs.writeFileSync('test_ps.php', php);
  await client.uploadFrom('test_ps.php', '/api.naturesmud.shop/public/test_ps.php');
  
  const req = https.get('https://api.naturesmud.shop/test_ps.php', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      await client.remove('/api.naturesmud.shop/public/test_ps.php');
      client.close();
      if (fs.existsSync('test_ps.php')) fs.unlinkSync('test_ps.php');
    });
  });
  req.on('error', console.error);
}
run().catch(console.error);
