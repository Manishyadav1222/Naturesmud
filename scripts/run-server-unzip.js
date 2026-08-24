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
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function runPhpEndpoint(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: config.host,
      port: 80,
      path: path,
      method: 'GET',
      headers: {
        'Host': 'api.naturesmud.shop'
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

const unzipPhp = `<?php
header('Content-Type: application/json');
$zipFile = realpath(__DIR__ . '/../laravel-vendor.zip');
$dest = realpath(__DIR__ . '/..');

$out = [];
$return_var = 0;
exec("unzip -o $zipFile -d $dest 2>&1", $out, $return_var);

echo json_encode([
    'return_var' => $return_var,
    'output_lines' => count($out),
    'vendor_exists' => file_exists($dest . '/vendor/autoload.php')
], JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('1. Uploading exec unzipper to public...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'unzip.php', unzipPhp);

  console.log('2. Running exec unzipper...');
  const res = await runPhpEndpoint('/unzip.php');
  console.log('   Response:', res.body);
}

main().catch(console.error);
