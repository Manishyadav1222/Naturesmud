const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function test() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  fs.writeFileSync('test.php', '<?php echo "HELLO_FROM_PHP";');
  await client.uploadFrom('test.php', '/api.naturesmud.shop/public/test.php');
  https.get('https://api.naturesmud.shop/test.php', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Response:', res.statusCode, d);
      await client.remove('/api.naturesmud.shop/public/test.php');
      client.close();
      fs.unlinkSync('test.php');
    });
  });
}
test().catch(console.error);
