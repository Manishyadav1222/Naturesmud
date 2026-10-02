const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('archiver');

async function deployNow() {
  console.log('=== Starting Fast Deployment ===');
  const rootDir = path.resolve(__dirname, '..');
  const buildId = fs.readFileSync(path.join(rootDir, '.next', 'BUILD_ID'), 'utf8').trim();
  console.log('Local BUILD_ID:', buildId);

  // 1. Create ZIP
  const zipPath = path.join(rootDir, 'frontend-build-update.zip');
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  console.log('Creating frontend-build-update.zip...');
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    archive.directory(path.join(rootDir, '.next', 'server'), '.next/server');
    archive.directory(path.join(rootDir, '.next', 'static'), '.next/static');
    if (fs.existsSync(path.join(rootDir, '.next', 'types'))) {
      archive.directory(path.join(rootDir, '.next', 'types'), '.next/types');
    }

    const nextFiles = fs.readdirSync(path.join(rootDir, '.next'));
    nextFiles.forEach(f => {
      const full = path.join(rootDir, '.next', f);
      if (fs.statSync(full).isFile()) {
        archive.file(full, { name: '.next/' + f });
      }
    });

    if (fs.existsSync(path.join(rootDir, '.next', 'standalone', 'server.js'))) {
      archive.file(path.join(rootDir, '.next', 'standalone', 'server.js'), { name: 'server.js' });
    }

    archive.finalize();
  });

  const stats = fs.statSync(zipPath);
  console.log(`ZIP created: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  // 2. Upload via FTP
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  console.log('Uploading frontend-build-update.zip to /naturesmud.shop/...');
  await client.uploadFrom(zipPath, '/naturesmud.shop/frontend-build-update.zip');
  console.log('Upload complete.');

  // 3. PHP remote extractor and passenger restart
  const php = `<?php
  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  $zip = '/home8/kathma13/naturesmud.shop/frontend-build-update.zip';
  $dest = '/home8/kathma13/naturesmud.shop';
  $standalone = '/home8/kathma13/naturesmud.shop/.next/standalone';

  $out1 = [];
  $ret1 = 0;
  exec("/bin/unzip -o $zip -d $dest 2>&1", $out1, $ret1);
  echo "Unzip to dest code: $ret1, lines: " . count($out1) . "\\n";

  $out2 = [];
  $ret2 = 0;
  exec("/bin/unzip -o $zip -d $standalone 2>&1", $out2, $ret2);
  echo "Unzip to standalone code: $ret2, lines: " . count($out2) . "\\n";

  echo "Dest BUILD_ID: " . @file_get_contents($dest . '/.next/BUILD_ID') . "\\n";
  echo "Standalone BUILD_ID: " . @file_get_contents($standalone . '/.next/BUILD_ID') . "\\n";

  // Wipe cache
  exec("rm -rf /home8/kathma13/naturesmud.shop/.next/cache /home8/kathma13/naturesmud.shop/.next/standalone/.next/cache 2>&1");
  echo "Cache wiped\\n";

  // Touch restart & kill next-server
  @mkdir('/home8/kathma13/naturesmud.shop/tmp', 0755, true);
  file_put_contents('/home8/kathma13/naturesmud.shop/tmp/restart.txt', time());
  exec("pkill -9 -f next-server 2>&1");
  echo "Passenger restarted and next-server killed\\n";

  @unlink($zip);
  echo "Zip deleted\\n";
  `;

  fs.writeFileSync('do_deploy.php', php);
  await client.uploadFrom('do_deploy.php', '/api.naturesmud.shop/public/do_deploy.php');

  https.get('https://api.naturesmud.shop/do_deploy.php', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Server deployment response:\n' + d);
      await client.remove('/api.naturesmud.shop/public/do_deploy.php');
      client.close();
      fs.unlinkSync('do_deploy.php');
      console.log('=== Deployment Completed Successfully ===');
    });
  });
}

deployNow().catch(console.error);
