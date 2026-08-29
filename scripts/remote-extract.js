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
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
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

const extractPhp = `<?php
header('Content-Type: application/json');

function extractZip($zipPath, $destDir) {
    if (!file_exists($zipPath)) {
        return ['success' => false, 'error' => "Zip file not found: $zipPath"];
    }
    if (!file_exists($destDir)) {
        mkdir($destDir, 0755, true);
    }
    
    $zip = new ZipArchive();
    $res = $zip->open($zipPath);
    if ($res === TRUE) {
        $zip->extractTo($destDir);
        $zip->close();
        return ['success' => true, 'message' => "Extracted to $destDir"];
    } else {
        // Fallback to exec unzip
        $out = [];
        $code = 0;
        exec("unzip -o '$zipPath' -d '$destDir' 2>&1", $out, $code);
        return ['success' => ($code === 0), 'return_code' => $code, 'output' => implode("\\n", array_slice($out, 0, 10))];
    }
}

$results = [
    'backend' => extractZip('/home8/kathma13/api.naturesmud.shop/naturesmud-backend.zip', '/home8/kathma13/api.naturesmud.shop'),
    'admin'   => extractZip('/home8/kathma13/admin-api.naturesmud.shop/naturesmud-admin.zip', '/home8/kathma13/admin-api.naturesmud.shop')
];

@unlink(__FILE__);
echo json_encode($results, JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('=== Remote Server-Side Extraction ===');
  console.log('1. Uploading extract helper to api.naturesmud.shop/public...');
  const saveRes = await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'extract_runner.php', extractPhp);
  console.log('   Upload status:', saveRes.status === 1 ? '✅ Saved' : JSON.stringify(saveRes));

  console.log('2. Triggering remote extraction via HTTP...');
  const res = await runPhpEndpoint('/extract_runner.php');
  console.log('   Extraction response:\n', res.body);
}

main().catch(console.error);
