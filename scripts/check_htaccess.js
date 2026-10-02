const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function checkHtaccess() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  const php = `<?php
  header('Content-Type: application/json');
  $res = [];
  $res['shop_htaccess'] = @file_get_contents('/home8/kathma13/naturesmud.shop/.htaccess');
  $res['public_html_htaccess'] = @file_get_contents('/home8/kathma13/public_html/.htaccess');
  echo json_encode($res, JSON_PRETTY_PRINT);
  `;

  const localFile = path.join(__dirname, 'temp_htaccess.php');
  fs.writeFileSync(localFile, php);
  await client.uploadFrom(localFile, '/api.naturesmud.shop/public/temp_htaccess.php');

  https.get('https://api.naturesmud.shop/temp_htaccess.php', { rejectUnauthorized: false }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log(d);
      try {
        await client.remove('/api.naturesmud.shop/public/temp_htaccess.php');
      } catch(e) {}
      client.close();
      if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
    });
  });
}
checkHtaccess().catch(console.error);
