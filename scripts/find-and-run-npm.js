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

const findNpmPhp = `<?php
header('Content-Type: application/json');

$candidates = [
    '/opt/alt/alt-nodejs20/root/usr/bin/npm',
    '/opt/alt/alt-nodejs20/root/usr/bin/node',
    '/opt/alt/alt-nodejs18/root/usr/bin/npm',
    '/opt/cpanel/ea-nodejs20/bin/npm',
    '/usr/local/bin/npm',
    '/usr/bin/npm'
];

$found = [];
foreach ($candidates as $c) {
    $found[$c] = file_exists($c);
}

// Test running alt-nodejs20 npm
$frontendDir = '/home8/kathma13/naturesmud.shop';
$altNpm = '/opt/alt/alt-nodejs20/root/usr/bin/npm';
$altNode = '/opt/alt/alt-nodejs20/root/usr/bin/node';

$out = [];
$code = 0;
if (file_exists($altNpm)) {
    $nodeDir = dirname($altNode);
    $cmd = "export PATH=$nodeDir:\\$PATH && cd $frontendDir && $altNpm install --omit=dev 2>&1";
    exec($cmd, $out, $code);
}

echo json_encode([
    'binaries' => $found,
    'cmd' => $cmd ?? 'none',
    'code' => $code,
    'output' => array_slice($out, -15),
    'node_modules_count' => file_exists($frontendDir . '/node_modules') ? count(scandir($frontendDir . '/node_modules')) : 0
], JSON_PRETTY_PRINT);
`;

async function main() {
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'find_npm.php', findNpmPhp);
  const res = await runPhpEndpoint('/find_npm.php');
  console.log('Response:\n', res.body);
}

main().catch(console.error);
