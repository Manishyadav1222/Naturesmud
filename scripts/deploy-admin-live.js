const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const querystring = require('querystring');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13',
  rootDir: path.resolve(__dirname, '..'),
  adminRemoteDir: '/home8/kathma13/admin-api.naturesmud.shop'
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
  const ftp = require('basic-ftp');
  const client = new ftp.Client();
  client.timeout = 300000;
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
  } catch (err) {
    console.error(`FTP Upload error for ${remoteFileName}:`, err);
    throw err;
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

const fixPermsPhp = `<?php
header('Content-Type: application/json');
$dir = '/home8/kathma13/admin-api.naturesmud.shop';

function chmod_r($path) {
    $dir = new DirectoryIterator($path);
    foreach ($dir as $item) {
        if ($item->isDot()) continue;
        if ($item->isDir()) {
            chmod($item->getPathname(), 0755);
            chmod_r($item->getPathname());
        } else {
            chmod($item->getPathname(), 0644);
        }
    }
}

// Fix permissions
chmod($dir, 0755);
chmod_r($dir);

// Create tmp/restart.txt to restart LiteSpeed / Passenger Node app
if (!file_exists($dir . '/tmp')) {
    mkdir($dir . '/tmp', 0755, true);
}
file_put_contents($dir . '/tmp/restart.txt', time());

echo json_encode([
    'success' => true,
    'message' => 'Admin API Permissions recursively updated to 0755 (dirs) / 0644 (files)',
    'restarted_via' => 'tmp/restart.txt'
], JSON_PRETTY_PRINT);
`;

function runPhpEndpoint(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: config.host,
      port: 80,
      path: path,
      method: 'GET',
      headers: {
        'Host': 'admin-api.naturesmud.shop' // Must match the domain for the php execution
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

async function main() {
  console.log('====================================================');
  console.log('🚀 NATURE\'S MUD ADMIN-SERVER LIVE DEPLOY');
  console.log('====================================================');

  console.log('\n[1/4] Building Admin Server (TypeScript -> JavaScript)...');
  execSync('npm --prefix admin-server run build', { cwd: config.rootDir, stdio: 'inherit' });
  console.log('✅ Admin server build successful!');

  console.log('\n[2/4] Packaging dist with ZipArchive...');
  const outZip = path.join(config.rootDir, 'admin-server-dist.zip');
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  await new Promise((resolve, reject) => {
    const { ZipArchive } = require('archiver');
    const output = fs.createWriteStream(outZip);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    archive.directory(
      path.join(config.rootDir, 'admin-server', 'dist'),
      'dist',
      (entry) => {
        if (entry.name.endsWith('/') || entry.stats?.isDirectory?.()) {
          entry.mode = 0o755;
        } else {
          entry.mode = 0o644;
        }
        return entry;
      }
    );
    archive.finalize();
  });
  console.log(`✅ Build package created (${(fs.statSync(outZip).size / 1024 / 1024).toFixed(2)} MB)`);

  console.log('\n[3/4] Uploading & extracting to cPanel (admin-api.naturesmud.shop)...');
  await unlinkRemote(`${config.adminRemoteDir}/dist`);
  await uploadFile(outZip, config.adminRemoteDir, 'admin-server-dist.zip');
  await extractArchive(`${config.adminRemoteDir}/admin-server-dist.zip`, config.adminRemoteDir);
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);
  
  // Create public directory for temp fix_perms
  console.log('\n[4/4] Restarting Passenger & Fixing Permissions...');
  // Since admin-api is a Node app, it doesn't process PHP easily in its root unless routed. 
  // Passenger overrides it. We can just use the FTP to touch tmp/restart.txt directly!
  
  const ftp = require('basic-ftp');
  const client = new ftp.Client();
  try {
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
    
    // Create tmp dir if not exists
    await client.ensureDir('/admin-api.naturesmud.shop/tmp');
    
    // Upload a dummy restart.txt
    const restartFile = path.join(config.rootDir, 'restart.txt');
    fs.writeFileSync(restartFile, Date.now().toString());
    await client.uploadFrom(restartFile, '/admin-api.naturesmud.shop/tmp/restart.txt');
    fs.unlinkSync(restartFile);
    
    console.log('✅ Passenger Restart triggered successfully (tmp/restart.txt updated)');
  } catch(e) {
    console.error('Failed to restart passenger via FTP:', e);
  } finally {
    client.close();
  }

  console.log('\n====================================================');
  console.log('🎉 ADMIN SERVER DEPLOYMENT COMPLETE!');
  console.log('====================================================\n');
}

main().catch(console.error);
