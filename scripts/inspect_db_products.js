const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function inspectProducts() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  try {
    $pdo = new PDO('mysql:host=localhost;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $stmt = $pdo->query("SELECT id, slug, name, is_featured, is_best_seller, images FROM products WHERE slug IN ('roasted-almonds', 'raw-himalayan-almonds', 'dry-figs-anjeer', 'freeze-dried-avocado-powder', 'strawberry-powder')");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  } catch(Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
  }
  `;
  const localFile = path.join(__dirname, 'temp_inspect.php');
  fs.writeFileSync(localFile, php);
  await client.uploadFrom(localFile, '/api.naturesmud.shop/public/temp_inspect.php');

  https.get('https://api.naturesmud.shop/temp_inspect.php', { rejectUnauthorized: false }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Products:', JSON.stringify(JSON.parse(d), null, 2));
      try {
        await client.remove('/api.naturesmud.shop/public/temp_inspect.php');
      } catch(e) {}
      client.close();
      if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
    });
  });
}
inspectProducts().catch(console.error);
