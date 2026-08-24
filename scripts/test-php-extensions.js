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

function setVersion(ver) {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      version: ver,
      vhost: 'api.naturesmud.shop'
    });

    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/execute/LangPHP/php_set_vhost_versions',
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

function checkModules() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: config.host,
      port: 80,
      path: '/diag.php',
      headers: { 'Host': 'api.naturesmud.shop' }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(data));
    });
    req.on('error', e => resolve(e.message));
    req.end();
  });
}

const diagPhp = `<?php
header('Content-Type: application/json');
echo json_encode([
  'php' => PHP_VERSION,
  'mbstring' => extension_loaded('mbstring'),
  'dom' => class_exists('DOMDocument'),
  'pdo_mysql' => extension_loaded('pdo_mysql'),
  'zip' => class_exists('ZipArchive'),
  'curl' => extension_loaded('curl'),
  'fileinfo' => extension_loaded('fileinfo'),
  'openssl' => extension_loaded('openssl')
], JSON_PRETTY_PRINT);
`;

async function main() {
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'diag.php', diagPhp);

  const versions = ['ea-php83', 'ea-php82', 'alt-php83', 'alt-php82', 'ea-php84'];
  for (const v of versions) {
    await setVersion(v);
    await new Promise(r => setTimeout(r, 1000));
    const res = await checkModules();
    console.log(`\n=== ${v} ===\n`, res);
  }
}

main().catch(console.error);
