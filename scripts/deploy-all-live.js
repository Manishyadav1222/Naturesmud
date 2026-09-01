const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const querystring = require('querystring');
const ftp = require('basic-ftp');
const { ZipArchive } = require('archiver');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13',
  rootDir: path.resolve(__dirname, '..')
};

let sessionCache = null;

function cpanelLogin() {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      user: config.username,
      pass: config.password
    });
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/login/?login_only=1',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      const cookies = res.headers['set-cookie'] || [];
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ token: json.security_token, cookies });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function callApi(apiPath, method = 'GET') {
  if (!sessionCache) {
    sessionCache = await cpanelLogin();
  }
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: sessionCache.token + apiPath,
      method: method,
      headers: {
        'Cookie': sessionCache.cookies.map(c => c.split(';')[0]).join('; ')
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
    req.end();
  });
}

async function uploadFile(localPath, remoteDir, remoteFileName) {
  const client = new ftp.Client();
  client.timeout = 120000;
  try {
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
    let ftpDir = remoteDir;
    if (ftpDir.startsWith(config.homeDir)) {
      ftpDir = ftpDir.substring(config.homeDir.length);
    }
    const remotePath = ftpDir + '/' + remoteFileName;
    await client.uploadFrom(localPath, remotePath);
  } finally {
    client.close();
  }
}

async function extractArchive(remoteZipPath, destDir) {
  const query = `/json-api/cpanel?cpanel_jsonapi_user=kathma13&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=extract&sourcefiles=${encodeURIComponent(remoteZipPath)}&destfiles=${encodeURIComponent(destDir)}`;
  return callApi(query, 'GET');
}

async function unlinkRemote(remotePath) {
  const query = `/json-api/cpanel?cpanel_jsonapi_user=kathma13&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=unlink&sourcefiles=${encodeURIComponent(remotePath)}`;
  return callApi(query, 'GET');
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

function chmod_r($path) {
    if (!file_exists($path)) return;
    $dir = new DirectoryIterator($path);
    foreach ($dir as $item) {
        if ($item->isDot()) continue;
        if ($item->isDir()) {
            @chmod($item->getPathname(), 0755);
            chmod_r($item->getPathname());
        } else {
            @chmod($item->getPathname(), 0644);
        }
    }
}

$dirs = [
  '/home8/kathma13/naturesmud.shop',
  '/home8/kathma13/admin-api.naturesmud.shop',
  '/home8/kathma13/api.naturesmud.shop'
];

foreach ($dirs as $dir) {
  if (file_exists($dir)) {
    @chmod($dir, 0755);
    chmod_r($dir);
    if (!file_exists($dir . '/tmp')) {
      @mkdir($dir . '/tmp', 0755, true);
    }
    @file_put_contents($dir . '/tmp/restart.txt', time());
  }
}

echo json_encode([
    'success' => true,
    'message' => 'Permissions updated and all apps restarted',
    'time' => time()
], JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('====================================================');
  console.log('🚀 NATURESMUD ENTERPRISE FULL LIVE SYSTEM SYNC');
  console.log('====================================================\n');

  // STEP 1: Compile Admin Server
  console.log('[1/5] 🏗️ Compiling Admin Server TypeScript...');
  execSync('npm --prefix admin-server run build', { stdio: 'inherit' });
  console.log('✅ Admin Server compiled successfully!');

  // STEP 2: Package Frontend & Assets
  console.log('\n[2/5] 📦 Packaging Next.js slim frontend & authentic assets...');
  const outFrontendZip = path.join(config.rootDir, 'frontend-sync.zip');
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outFrontendZip);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    archive.directory(path.join(config.rootDir, '.next', 'server'), '.next/server');
    archive.directory(path.join(config.rootDir, '.next', 'static'), '.next/static');
    if (fs.existsSync(path.join(config.rootDir, '.next', 'types'))) {
      archive.directory(path.join(config.rootDir, '.next', 'types'), '.next/types');
    }

    const nextRootFiles = fs.readdirSync(path.join(config.rootDir, '.next'));
    nextRootFiles.forEach(f => {
      const full = path.join(config.rootDir, '.next', f);
      if (fs.statSync(full).isFile()) {
        archive.file(full, { name: '.next/' + f });
      }
    });

    const posterFiles = [
      'pineapple-splendor.jpg',
      'blueberries-orchard.jpg',
      'papaya-splash-delight.jpg',
      'chia-power.jpg',
      'sweet-vibes.jpg',
      'tropical-crunch.jpg',
      'papaya-pop.jpg',
      'blueberry-bite.jpg'
    ];
    posterFiles.forEach(pf => {
      const full = path.join(config.rootDir, 'public', 'images', 'posters', pf);
      if (fs.existsSync(full)) {
        archive.file(full, { name: 'public/images/posters/' + pf });
      }
    });

    const prodFiles = [
      'dried-blueberries-orchard.jpg',
      'dried-blueberries-100g.jpg',
      'blueberries.jpg',
      'dried-blueberries.jpg',
      'dehydrated-pineapple-premium.jpg',
      'papaya-splash.jpg',
      'chia-seeds.jpg',
      'authentic-almonds.jpg',
      'authentic-cashewnuts-roasted.jpg',
      'pink-salt.jpg',
      'himalayan-black-salt-digestive.jpg',
      'cranberries.jpg'
    ];
    prodFiles.forEach(pf => {
      const full = path.join(config.rootDir, 'public', 'products', pf);
      if (fs.existsSync(full)) {
        archive.file(full, { name: 'public/products/' + pf });
      }
    });

    archive.finalize();
  });
  console.log(`✅ Frontend bundle ready: ${(fs.statSync(outFrontendZip).size / 1024 / 1024).toFixed(2)} MB`);

  // STEP 3: Package Admin Server
  console.log('\n[3/5] 📦 Packaging Admin Server dist bundle...');
  const outAdminZip = path.join(config.rootDir, 'admin-sync.zip');
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outAdminZip);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    archive.directory(path.join(config.rootDir, 'admin-server', 'dist'), 'dist');
    archive.finalize();
  });
  console.log(`✅ Admin Server bundle ready: ${(fs.statSync(outAdminZip).size / 1024).toFixed(1)} KB`);

  // STEP 4: Upload & Deploy via cPanel & FTP
  console.log('\n[4/5] 🌐 Uploading files to cPanel server...');
  
  // 4a. Upload and extract frontend
  console.log('  -> Uploading Frontend package to naturesmud.shop...');
  await uploadFile(outFrontendZip, `${config.homeDir}/naturesmud.shop`, 'frontend-sync.zip');
  console.log('  -> Extracting Frontend package...');
  await extractArchive(`${config.homeDir}/naturesmud.shop/frontend-sync.zip`, `${config.homeDir}/naturesmud.shop`);
  await unlinkRemote(`${config.homeDir}/naturesmud.shop/frontend-sync.zip`);

  // 4b. Upload and extract admin server
  console.log('  -> Uploading Admin Server package to admin-api.naturesmud.shop...');
  await uploadFile(outAdminZip, `${config.homeDir}/admin-api.naturesmud.shop`, 'admin-sync.zip');
  console.log('  -> Extracting Admin Server package...');
  await extractArchive(`${config.homeDir}/admin-api.naturesmud.shop/admin-sync.zip`, `${config.homeDir}/admin-api.naturesmud.shop`);
  await unlinkRemote(`${config.homeDir}/admin-api.naturesmud.shop/admin-sync.zip`);

  // 4c. Upload updated Laravel Backend files
  console.log('  -> Uploading Laravel Backend OrderController & OrderItem...');
  await uploadFile(
    path.join(config.rootDir, 'backend', 'app', 'Models', 'OrderItem.php'),
    `${config.homeDir}/api.naturesmud.shop/app/Models`,
    'OrderItem.php'
  );
  await uploadFile(
    path.join(config.rootDir, 'backend', 'app', 'Http', 'Controllers', 'Api', 'OrderController.php'),
    `${config.homeDir}/api.naturesmud.shop/app/Http/Controllers/Api`,
    'OrderController.php'
  );

  // STEP 5: Fix permissions & restart Passenger services
  console.log('\n[5/5] 🔄 Fixing permissions & restarting Passenger application pools...');
  const fixScriptPath = path.join(config.rootDir, 'fix-perms-temp.php');
  fs.writeFileSync(fixScriptPath, fixPermsPhp);
  await uploadFile(fixScriptPath, `${config.homeDir}/api.naturesmud.shop/public`, 'fix-perms.php');
  fs.unlinkSync(fixScriptPath);

  const restartResult = await runPhpEndpoint('/fix-perms.php');
  console.log('  -> Passenger restart response:', restartResult.body);

  // Clean up
  try {
    fs.unlinkSync(outFrontendZip);
    fs.unlinkSync(outAdminZip);
  } catch (e) {}

  console.log('\n✨ ALL SERVICES SYNCHRONIZED AND LIVE IN PRODUCTION!');
}

main().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
