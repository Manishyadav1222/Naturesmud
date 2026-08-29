const https = require('https');
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
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.write(postData);
    req.end();
  });
}

function callHttps(hostHeader, reqPath) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: hostHeader,
      port: 443,
      path: reqPath,
      method: 'GET',
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', e => resolve({ error: e.message }));
    req.end();
  });
}

async function main() {
  const phpCode = `<?php
$zipFile = '${config.homeDir}/naturesmud.shop/frontend-optimized-dist.zip';
$destDir = '${config.homeDir}/naturesmud.shop';

if (!file_exists($zipFile)) {
    die("Zip not found: " . $zipFile);
}

$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo($destDir);
    $zip->close();
    @unlink($zipFile);
    echo "SUCCESS: Extracted and cleaned up!";
} else {
    echo "ERROR: Failed to open zip";
}
`;

  console.log('1. Writing extract helper to api.naturesmud.shop/public/unzip_frontend.php...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'unzip_frontend.php', phpCode);

  console.log('2. Executing extract helper via HTTPS...');
  const res = await callHttps('api.naturesmud.shop', '/unzip_frontend.php');
  console.log('Extraction response:', res);

  console.log('3. Deleting temporary extract helper...');
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'unzip_frontend.php', '<?php echo "cleaned"; ?>');

  console.log('4. Restarting Passenger Next.js App...');
  await saveFile(`${config.homeDir}/naturesmud.shop/tmp`, 'restart.txt', new Date().toISOString());

  console.log('🎉 Extracted & Passenger restart complete!');
}

main().catch(console.error);

