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

function checkHttp(path) {
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

const testIndexPhp = `<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';
    
    $kernel = $app->make(Illuminate\\Contracts\\Http\\Kernel::class);
    $response = $kernel->handle(
        $request = Illuminate\\Http\\Request::capture()
    );
    $response->send();
    $kernel->terminate($request, $response);
} catch (Throwable $e) {
    header('Content-Type: text/plain');
    echo "CAUGHT ERROR: " . $e->getMessage() . "\\n";
    echo "FILE: " . $e->getFile() . " LINE: " . $e->getLine() . "\\n";
    echo $e->getTraceAsString();
}
`;

async function main() {
  console.log('1. Uploading test-index.php...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'test-index.php', testIndexPhp);

  console.log('2. Requesting test-index.php...');
  const res = await checkHttp('/test-index.php');
  console.log('Status:', res.status);
  console.log('Body:\n', res.body);
}

main().catch(console.error);
