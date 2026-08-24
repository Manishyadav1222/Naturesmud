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
  return new Promise((resolve) => {
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
      res.on('end', () => resolve(data));
    });

    req.write(postData);
    req.end();
  });
}

function runPhp(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: config.host,
      port: 80,
      path: path,
      method: 'GET',
      headers: {
        'Host': 'api.naturesmud.shop',
        'Accept': 'application/json'
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
$root = realpath(__DIR__ . '/..');

function fixDir($dir) {
    @chmod($dir, 0755);
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $dir . '/' . $item;
        if (is_dir($path)) {
            fixDir($path);
        } else {
            @chmod($path, 0644);
        }
    }
}

fixDir($root);
@unlink(__DIR__ . '/fix-perms.php');
echo json_encode(['status' => 'Permissions fixed across ' . $root]);
`;

async function main() {
  console.log('1. Uploading fix-perms.php...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'fix-perms.php', fixPermsPhp);

  console.log('2. Running fix-perms...');
  const res1 = await runPhp('/fix-perms.php');
  console.log('   Fix result:', res1.body);

  console.log('3. Retesting http://api.naturesmud.shop/api/v1/products...');
  const res2 = await runPhp('/api/v1/products');
  console.log('   Status:', res2.status);
  console.log('   Body:', res2.body.substring(0, 500));
}

main().catch(console.error);
