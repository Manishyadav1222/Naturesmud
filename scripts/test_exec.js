const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function testExec() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  ini_set('display_errors', 1);
  error_reporting(E_ALL);
  $disabled = ini_get('disable_functions');
  echo "Disabled functions: " . ($disabled ? $disabled : "NONE") . "\\n";

  $out = [];
  $ret = 0;
  exec("which unzip 2>&1", $out, $ret);
  echo "which unzip: " . implode(" ", $out) . " (code: $ret)\\n";

  $zip = '/home8/kathma13/naturesmud.shop/frontend-build-update.zip';
  echo "Zip file: " . (file_exists($zip) ? "EXISTS (" . filesize($zip) . ")" : "NOT FOUND") . "\\n";
  `;
  fs.writeFileSync('test_exec.php', php);
  await client.uploadFrom('test_exec.php', '/api.naturesmud.shop/public/test_exec.php');
  https.get('https://api.naturesmud.shop/test_exec.php', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Result:\\n' + d);
      await client.remove('/api.naturesmud.shop/public/test_exec.php');
      client.close();
      fs.unlinkSync('test_exec.php');
    });
  });
}
testExec().catch(console.error);
