const https = require('https');
const http = require('http');
const querystring = require('querystring');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13'
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function saveFile(remoteDir, fileName, content) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      dir: remoteDir,
      file: fileName,
      content: content,
      encoding: 'utf-8'
    });

    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/execute/Fileman/save_file_content',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function checkHttp(hostHeader, path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: config.host,
      port: 80,
      path: path,
      method: 'GET',
      headers: {
        'Host': hostHeader
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', e => resolve({ error: e.message }));
    req.end();
  });
}

const phpScript = `<?php
header('Content-Type: application/json');
$res = [
    'php_version' => PHP_VERSION,
    'db' => 'testing',
];

try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=kathma13_natures_mud', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $res['db'] = 'CONNECTED_SUCCESSFULLY';
    $stmt = $pdo->query('SHOW TABLES');
    $res['tables'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
} catch (Exception $e) {
    $res['db'] = 'ERROR: ' . $e->getMessage();
}

$res['vendor_autoload_exists'] = file_exists(__DIR__ . '/../vendor/autoload.php');
echo json_encode($res, JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('Uploading diag.php to api.naturesmud.shop/public...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'diag.php', phpScript);
  
  console.log('Checking http://api.naturesmud.shop/diag.php...');
  const res = await checkHttp('api.naturesmud.shop', '/diag.php');
  console.log('Status:', res.status);
  console.log('Body:', res.body);
}

main().catch(console.error);
