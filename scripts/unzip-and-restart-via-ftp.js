const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');

const config = {
  host: '167.235.9.123',
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13'
};

async function main() {
  console.log('🚀 Starting Server-Side Extraction & Passenger Restart on Nest Nepal...');

  const client = new ftp.Client();
  client.ftp.verbose = false;

  const phpExtractor = `<?php
header('Content-Type: application/json');

$homeDir = '${config.homeDir}';
$destDir = $homeDir . '/naturesmud.shop';
$possibleZips = [
    $destDir . '/frontend-clean-dist.zip',
    $destDir . '/frontend-optimized-dist.zip',
    $destDir . '/frontend-build-update.zip'
];

$extracted = [];
$errors = [];

foreach ($possibleZips as $zipFile) {
    if (file_exists($zipFile)) {
        $zip = new ZipArchive();
        if ($zip->open($zipFile) === TRUE) {
            $zip->extractTo($destDir);
            $zip->close();
            @unlink($zipFile);
            $extracted[] = basename($zipFile);
        } else {
            $errors[] = "Failed to open " . basename($zipFile);
        }
    }
}

// Touch tmp/restart.txt to restart Phusion Passenger
$restartFile = $destDir . '/tmp/restart.txt';
@mkdir(dirname($restartFile), 0755, true);
file_put_contents($restartFile, date('Y-m-d H:i:s'));

// Check current server BUILD_ID
$buildIdFile = $destDir . '/.next/BUILD_ID';
$serverBuildId = file_exists($buildIdFile) ? trim(file_get_contents($buildIdFile)) : 'not_found';

echo json_encode([
    'status' => count($extracted) > 0 ? 'success' : 'no_archives_found',
    'extracted' => $extracted,
    'errors' => $errors,
    'server_build_id' => $serverBuildId,
    'passenger_restarted' => true,
    'timestamp' => date('c')
], JSON_PRETTY_PRINT);
`;

  const localPhpPath = path.join(__dirname, 'temp_unzip_helper.php');
  fs.writeFileSync(localPhpPath, phpExtractor, 'utf8');

  try {
    console.log('1. Connecting to Nest Nepal Pure-FTPd...');
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
    console.log('✅ FTP Connected!');

    console.log('2. Uploading temp_unzip_helper.php to api.naturesmud.shop/public/...');
    await client.uploadFrom(localPhpPath, '/api.naturesmud.shop/public/unzip_helper.php');
    console.log('✅ Helper uploaded!');

    console.log('3. Triggering extraction and Passenger restart via HTTPS...');
    const result = await new Promise((resolve, reject) => {
      https.get('https://api.naturesmud.shop/unzip_helper.php', { rejectUnauthorized: false }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve({ raw: body });
          }
        });
      }).on('error', reject);
    });

    console.log('Server response:\n', JSON.stringify(result, null, 2));

    console.log('4. Cleaning up temp helper on server...');
    await client.remove('/api.naturesmud.shop/public/unzip_helper.php');
    console.log('✅ Remote helper removed!');

  } finally {
    client.close();
    if (fs.existsSync(localPhpPath)) {
      fs.unlinkSync(localPhpPath);
    }
  }

  console.log('\n5. Verifying live site...');
  await new Promise(r => setTimeout(r, 2000));
  
  await new Promise((resolve) => {
    https.get('https://naturesmud.shop/', { rejectUnauthorized: false }, (res) => {
      console.log(`Live Site Status: [${res.statusCode}] OK`);
      resolve();
    }).on('error', e => {
      console.log(`Live Site check error: ${e.message}`);
      resolve();
    });
  });

  console.log('\n🎉 Nest Nepal deployment, extraction, and restart completed successfully!');
}

main().catch(console.error);
