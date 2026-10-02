const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function debugExtractor() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  const rootDir = path.resolve(__dirname, '..');
  const zipPath = path.join(rootDir, 'frontend-build-update.zip');

  console.log('Uploading frontend-build-update.zip ...');
  await client.uploadFrom(zipPath, '/naturesmud.shop/frontend-build-update.zip');
  console.log('Zip uploaded!');

  const php = `<?php
  ini_set('display_errors', 1);
  error_reporting(E_ALL);
  header('Content-Type: text/plain');

  $zip = '/home8/kathma13/naturesmud.shop/frontend-build-update.zip';
  echo "Zip exists: " . (file_exists($zip) ? "YES (" . filesize($zip) . " bytes)" : "NO") . "\\n";

  $dest = '/home8/kathma13/naturesmud.shop';
  $standalone = '/home8/kathma13/naturesmud.shop/.next/standalone';

  if (file_exists($zip)) {
    $out1 = [];
    $ret1 = 0;
    exec("unzip -o $zip -d $dest 2>&1", $out1, $ret1);
    echo "Unzip to dest: exit code $ret1, lines: " . count($out1) . "\\n";
    echo implode("\\n", array_slice($out1, 0, 4)) . "\\n";

    $out2 = [];
    $ret2 = 0;
    exec("unzip -o $zip -d $standalone 2>&1", $out2, $ret2);
    echo "Unzip to standalone: exit code $ret2, lines: " . count($out2) . "\\n";
    echo implode("\\n", array_slice($out2, 0, 4)) . "\\n";

    @unlink($zip);
  }

  echo "\\nWiping cache...\\n";
  exec("rm -rf /home8/kathma13/naturesmud.shop/.next/cache /home8/kathma13/naturesmud.shop/.next/standalone/.next/cache 2>&1");

  echo "Updating PDO...\\n";
  try {
    $pdo = new PDO('mysql:host=localhost;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("UPDATE products SET images = '[\"/products/nm-almond-jar-v2.jpg\", \"/products/nm-almond-jar.jpeg\"]', is_featured = 1, is_best_seller = 1 WHERE slug IN ('roasted-almonds', 'raw-himalayan-almonds')");
    $pdo->exec("UPDATE products SET images = '[\"/products/avocado-powder-v2.jpg\", \"/products/avocado-powder.jpg\"]', is_featured = 1, is_best_seller = 1 WHERE slug = 'freeze-dried-avocado-powder'");
    $pdo->exec("UPDATE products SET images = '[\"/products/strawberry-powder-v2.jpg\", \"/products/strawberry-powder.jpg\"]', is_featured = 1, is_best_seller = 1 WHERE slug = 'strawberry-powder'");
    $pdo->exec("UPDATE products SET is_featured = 0, is_best_seller = 0 WHERE slug = 'dry-figs-anjeer'");
    echo "PDO success!\\n";
  } catch(Exception $e) {
    echo "PDO Error: " . $e->getMessage() . "\\n";
  }

  echo "Restarting passenger and killing next-server...\\n";
  @mkdir('/home8/kathma13/naturesmud.shop/tmp', 0755, true);
  file_put_contents('/home8/kathma13/naturesmud.shop/tmp/restart.txt', time());
  exec("pkill -9 -f next-server 2>&1", $pkill);
  echo "Pkill done.\\n";
  `;

  const localFile = path.join(__dirname, 'debug_extract.php');
  fs.writeFileSync(localFile, php);
  await client.uploadFrom(localFile, '/api.naturesmud.shop/public/debug_extract.php');

  console.log('Calling extractor...');
  https.get('https://api.naturesmud.shop/debug_extract.php', { rejectUnauthorized: false }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('--- Debug Output ---');
      console.log(d);
      try {
        await client.remove('/api.naturesmud.shop/public/debug_extract.php');
      } catch(e) {}
      client.close();
      if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
      if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    });
  });
}

debugExtractor().catch(console.error);
