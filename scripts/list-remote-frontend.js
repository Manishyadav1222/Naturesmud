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

const listPhp = `<?php
header('Content-Type: application/json');

$dir = '/home8/kathma13/naturesmud.shop';
$files = file_exists($dir) ? scandir($dir) : [];

$nodevenvDir = '/home8/kathma13/nodevenv/naturesmud.shop/20';
$nodevenvFiles = file_exists($nodevenvDir) ? scandir($nodevenvDir) : [];

echo json_encode([
    'naturesmud_shop_files' => $files,
    'nodevenv_files' => $nodevenvFiles,
    'package_json_exists' => file_exists($dir . '/package.json'),
    'package_json_content' => file_exists($dir . '/package.json') ? substr(file_get_contents($dir . '/package.json'), 0, 300) : null
], JSON_PRETTY_PRINT);
`;

async function main() {
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'list_frontend.php', listPhp);
  const res = await runPhpEndpoint('/list_frontend.php');
  console.log('Response:\n', res.body);
}

main().catch(console.error);
