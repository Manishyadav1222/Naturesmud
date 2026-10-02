const https = require('https');
const ftp = require('basic-ftp');
const fs = require('fs');

async function checkBlogsTable() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  const php = `<?php
  try {
    $pdo = new PDO('mysql:host=localhost;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $stmt = $pdo->query('DESCRIBE blog_posts');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
  } catch(Exception $e) {
    echo $e->getMessage();
  }
  `;

  fs.writeFileSync('check_blogs.php', php);
  await client.uploadFrom('check_blogs.php', '/api.naturesmud.shop/public/check_blogs.php');

  https.get('https://api.naturesmud.shop/check_blogs.php', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Blogs schema:\n', d);
      await client.remove('/api.naturesmud.shop/public/check_blogs.php');
      client.close();
      fs.unlinkSync('check_blogs.php');
    });
  });
}
checkBlogsTable().catch(console.error);
