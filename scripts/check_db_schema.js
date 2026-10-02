const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function checkCols() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  const php = `<?php
  try {
    $pdo = new PDO('mysql:host=localhost;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $stmt = $pdo->query('SHOW COLUMNS FROM products');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  } catch(Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
  }
  `;
  const localFile = path.join(__dirname, 'temp_cols.php');
  fs.writeFileSync(localFile, php);
  await client.uploadFrom(localFile, '/api.naturesmud.shop/public/temp_cols.php');

  https.get('https://api.naturesmud.shop/temp_cols.php', { rejectUnauthorized: false }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Columns:', d);
      try {
        await client.remove('/api.naturesmud.shop/public/temp_cols.php');
      } catch(e) {}
      client.close();
      if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
    });
  });
}
checkCols().catch(console.error);
