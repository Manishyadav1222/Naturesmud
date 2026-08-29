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

const runnerPhp = `<?php
header('Content-Type: application/json');

// Find virtualenv node / npm
$nodePaths = [
    '/home8/kathma13/nodevenv/naturesmud.shop/20/bin/npm',
    '/home8/kathma13/nodevenv/public_html/20/bin/npm',
    '/usr/local/bin/npm',
    '/usr/bin/npm'
];

$npmBin = null;
foreach ($nodePaths as $p) {
    if (file_exists($p)) {
        $npmBin = $p;
        break;
    }
}

$frontendDir = '/home8/kathma13/naturesmud.shop';
if (!file_exists($frontendDir)) {
    $frontendDir = '/home8/kathma13/public_html';
}

$out = [];
$code = 0;
// Run npm install in frontendDir using node virtualenv
$cmd = "export PATH=/home8/kathma13/nodevenv/naturesmud.shop/20/bin:\\$PATH && cd $frontendDir && npm install --omit=dev 2>&1";
exec($cmd, $out, $code);

echo json_encode([
    'cmd' => $cmd,
    'return_code' => $code,
    'output' => array_slice($out, -20),
    'node_modules_exists' => file_exists($frontendDir . '/node_modules')
], JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('1. Uploading npm install runner to api.naturesmud.shop/public...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'npm_runner.php', runnerPhp);

  console.log('2. Running npm install on server in background...');
  const res = await runPhpEndpoint('/npm_runner.php');
  console.log('   Response:\n', res.body);
}

main().catch(console.error);
