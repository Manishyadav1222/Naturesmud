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

const artisanPhp = `<?php
header('Content-Type: application/json');
$base = realpath(__DIR__ . '/..');

$phpBin = '/opt/cpanel/ea-php84/root/usr/bin/php';
if (!file_exists($phpBin)) {
    $phpBin = '/opt/cpanel/ea-php83/root/usr/bin/php';
}

$commands = [
    'key:generate --force',
    'migrate --force',
    'db:seed --force',
    'storage:link',
    'config:cache',
    'route:cache'
];

$results = [
    'php_binary_used' => $phpBin,
    'commands' => []
];

foreach ($commands as $cmd) {
    $out = [];
    $code = 0;
    exec("cd $base && $phpBin artisan $cmd 2>&1", $out, $code);
    $results['commands'][$cmd] = [
        'code' => $code,
        'output' => implode("\\n", $out)
    ];
}

@unlink(__DIR__ . '/artisan.php');
echo json_encode($results, JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('1. Uploading ea-php84 artisan.php runner...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'artisan.php', artisanPhp);

  console.log('2. Running Laravel migrations with ea-php84...');
  const res = await runPhpEndpoint('/artisan.php');
  console.log('   Response:\n', res.body);
}

main().catch(console.error);
