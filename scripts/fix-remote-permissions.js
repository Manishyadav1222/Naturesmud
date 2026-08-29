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

const fixPermsPhp = `<?php
header('Content-Type: application/json');

$dir = '/home8/kathma13/naturesmud.shop';

function chmod_r($path) {
    $dir = new DirectoryIterator($path);
    foreach ($dir as $item) {
        if ($item->isDot()) continue;
        if ($item->isDir()) {
            chmod($item->getPathname(), 0755);
            chmod_r($item->getPathname());
        } else {
            chmod($item->getPathname(), 0644);
        }
    }
}

// Fix permissions
chmod($dir, 0755);
chmod_r($dir);

// Create tmp/restart.txt to restart LiteSpeed / Passenger Node app
if (!file_exists($dir . '/tmp')) {
    mkdir($dir . '/tmp', 0755, true);
}
file_put_contents($dir . '/tmp/restart.txt', time());

echo json_encode([
    'success' => true,
    'message' => 'Permissions recursively updated to 0755 (dirs) / 0644 (files)',
    'restarted_via' => 'tmp/restart.txt'
], JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('1. Uploading permission fixer...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'fix_perms.php', fixPermsPhp);

  console.log('2. Running permission fixer...');
  const res = await runPhpEndpoint('/fix_perms.php');
  console.log('Response:\n', res.body);
}

main().catch(console.error);
