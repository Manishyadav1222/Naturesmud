const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function doUnzip() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  const php = `<?php
  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  $zip = '/home8/kathma13/naturesmud.shop/frontend-build-update.zip';
  $dest = '/home8/kathma13/naturesmud.shop';
  $standalone = '/home8/kathma13/naturesmud.shop/.next/standalone';

  $out1 = [];
  $ret1 = 0;
  exec("/bin/unzip -o $zip -d $dest 2>&1", $out1, $ret1);
  echo "Unzip to dest code: $ret1, lines: " . count($out1) . "\\n";

  $out2 = [];
  $ret2 = 0;
  exec("/bin/unzip -o $zip -d $standalone 2>&1", $out2, $ret2);
  echo "Unzip to standalone code: $ret2, lines: " . count($out2) . "\\n";

  // Check build id
  echo "Dest BUILD_ID: " . @file_get_contents($dest . '/.next/BUILD_ID') . "\\n";
  echo "Standalone BUILD_ID: " . @file_get_contents($standalone . '/.next/BUILD_ID') . "\\n";
  `;

  fs.writeFileSync('test_unzip.php', php);
  await client.uploadFrom('test_unzip.php', '/api.naturesmud.shop/public/test_unzip.php');

  https.get('https://api.naturesmud.shop/test_unzip.php', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Unzip Result:\\n' + d);
      await client.remove('/api.naturesmud.shop/public/test_unzip.php');
      client.close();
      fs.unlinkSync('test_unzip.php');
    });
  });
}

doUnzip().catch(console.error);
