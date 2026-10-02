const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function finishDeploy() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  const php = `<?php
  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  // 1. Wipe cache
  exec("rm -rf /home8/kathma13/naturesmud.shop/.next/cache /home8/kathma13/naturesmud.shop/.next/standalone/.next/cache 2>&1");
  echo "Cache wiped\\n";

  // 2. Database update
  try {
    $pdo = new PDO('mysql:host=localhost;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $almondImgs = json_encode(['/products/nm-almond-jar-v2.jpg', '/products/nm-almond-jar.jpeg']);
    $avoImgs = json_encode(['/products/avocado-powder-v2.jpg', '/products/avocado-powder.jpg']);
    $strawImgs = json_encode(['/products/strawberry-powder-v2.jpg', '/products/strawberry-powder.jpg']);

    $stmt1 = $pdo->prepare("UPDATE products SET images = ?, is_featured = 1, is_best_seller = 1 WHERE slug IN ('roasted-almonds', 'raw-himalayan-almonds')");
    $stmt1->execute([$almondImgs]);

    $stmt2 = $pdo->prepare("UPDATE products SET images = ?, is_featured = 1, is_best_seller = 1 WHERE slug = 'freeze-dried-avocado-powder'");
    $stmt2->execute([$avoImgs]);

    $stmt3 = $pdo->prepare("UPDATE products SET images = ?, is_featured = 1, is_best_seller = 1 WHERE slug = 'strawberry-powder'");
    $stmt3->execute([$strawImgs]);

    $stmt4 = $pdo->prepare("UPDATE products SET is_featured = 0, is_best_seller = 0 WHERE slug = 'dry-figs-anjeer'");
    $stmt4->execute();

    echo "DB updated successfully\\n";
  } catch(Exception $e) {
    echo "DB Error: " . $e->getMessage() . "\\n";
  }

  // 3. Restart passenger & kill old next-server
  @mkdir('/home8/kathma13/naturesmud.shop/tmp', 0755, true);
  file_put_contents('/home8/kathma13/naturesmud.shop/tmp/restart.txt', time());
  exec("pkill -9 -f next-server 2>&1");
  echo "Passenger restarted and next-server killed\\n";

  // 4. Delete uploaded zip
  @unlink('/home8/kathma13/naturesmud.shop/frontend-build-update.zip');
  echo "Zip cleaned up\\n";
  `;

  fs.writeFileSync('finish_deploy.php', php);
  await client.uploadFrom('finish_deploy.php', '/api.naturesmud.shop/public/finish_deploy.php');

  https.get('https://api.naturesmud.shop/finish_deploy.php', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Result:\\n' + d);
      await client.remove('/api.naturesmud.shop/public/finish_deploy.php');
      client.close();
      fs.unlinkSync('finish_deploy.php');
    });
  });
}

finishDeploy().catch(console.error);
