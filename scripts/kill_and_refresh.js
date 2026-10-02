const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function restartLive() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  const php = `<?php
  header('Content-Type: application/json');
  $res = [];

  // 1. Update MySQL Database
  try {
    $pdo = new PDO('mysql:host=localhost;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("UPDATE products SET is_featured = 1, is_best_seller = 1 WHERE slug IN ('raw-himalayan-almonds', 'roasted-almonds', 'freeze-dried-avocado-powder', 'strawberry-powder')");
    $pdo->exec("UPDATE products SET is_featured = 0, is_best_seller = 0 WHERE slug = 'dry-figs-anjeer'");

    $res['db_updated'] = true;
  } catch(Exception $e) {
    $res['db_updated'] = false;
    $res['db_error'] = $e->getMessage();
  }

  // 2. Clear all .next/cache
  function rrmdir($dir) {
    if (!is_dir($dir)) return;
    $objects = scandir($dir);
    foreach ($objects as $object) {
      if ($object != "." && $object != "..") {
        if (is_dir($dir. DIRECTORY_SEPARATOR .$object) && !is_link($dir . "/" . $object))
          rrmdir($dir. DIRECTORY_SEPARATOR .$object);
        else
          @unlink($dir. DIRECTORY_SEPARATOR .$object);
      }
    }
    @rmdir($dir);
  }

  rrmdir('/home8/kathma13/naturesmud.shop/.next/cache');
  rrmdir('/home8/kathma13/naturesmud.shop/.next/standalone/.next/cache');
  $res['cache_wiped'] = true;

  // 3. Touch restart.txt
  @mkdir('/home8/kathma13/naturesmud.shop/tmp', 0755, true);
  file_put_contents('/home8/kathma13/naturesmud.shop/tmp/restart.txt', time());

  // 4. Kill existing next-server processes
  $out = [];
  exec("pkill -9 -f next-server 2>&1", $out);
  $res['pkill_output'] = $out;

  echo json_encode($res, JSON_PRETTY_PRINT);
  `;

  const localFile = path.join(__dirname, 'temp_restart.php');
  fs.writeFileSync(localFile, php);
  await client.uploadFrom(localFile, '/api.naturesmud.shop/public/temp_restart.php');

  const result = await new Promise(resolve => {
    https.get('https://api.naturesmud.shop/temp_restart.php', { rejectUnauthorized: false }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', async () => {
        try {
          resolve(JSON.parse(d));
        } catch(e) {
          resolve({ raw: d });
        }
        try {
          await client.remove('/api.naturesmud.shop/public/temp_restart.php');
        } catch(e) {}
        client.close();
        if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
      });
    });
  });

  console.log('Restart Result:', result);
}

restartLive().catch(console.error);
