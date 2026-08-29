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

const diagPhp = `<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$logFile = realpath(__DIR__ . '/../storage/logs/laravel.log');
$logContent = file_exists($logFile) ? file_get_contents($logFile) : 'No log file found';

$errorLog = realpath(__DIR__ . '/error_log');
$errorLogContent = file_exists($errorLog) ? file_get_contents($errorLog) : 'No php error_log found';

echo json_encode([
    'php_version' => phpversion(),
    'extensions' => get_loaded_extensions(),
    'laravel_log_tail' => substr($logContent, -2000),
    'error_log_tail' => substr($errorLogContent, -2000)
], JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('1. Uploading diag.php to public...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'diag.php', diagPhp);

  console.log('2. Running diag.php...');
  const res = await checkHttp('/diag.php');
  console.log('   Response:\n', res.body);
}

main().catch(console.error);
