const https = require('https');
const ftp = require('basic-ftp');
const fs = require('fs');

async function inspectBlogPosts() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  const php = `<?php
  try {
    $pdo = new PDO('mysql:host=localhost;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $stmt = $pdo->query('SELECT id, slug, title, featured_image FROM blog_posts LIMIT 5');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
  } catch(Exception $e) {
    echo $e->getMessage();
  }
  `;

  fs.writeFileSync('inspect_blog_posts.php', php);
  await client.uploadFrom('inspect_blog_posts.php', '/api.naturesmud.shop/public/inspect_blog_posts.php');

  https.get('https://api.naturesmud.shop/inspect_blog_posts.php', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Blog posts in DB:\n', d);
      await client.remove('/api.naturesmud.shop/public/inspect_blog_posts.php');
      client.close();
      fs.unlinkSync('inspect_blog_posts.php');
    });
  });
}
inspectBlogPosts().catch(console.error);
