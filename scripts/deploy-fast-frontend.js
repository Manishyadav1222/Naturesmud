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
    console.log(`  -> Uploading ${remoteFileName} (${(fs.statSync(localPath).size / 1024 / 1024).toFixed(2)} MB) to ${remotePath}...`);
    await client.uploadFrom(localPath, remotePath);
    console.log(`  -> Upload of ${remoteFileName} complete!`);
  } catch (err) {
    console.error(`FTP Upload error for ${remoteFileName}:`, err);
    throw err;
  } finally {
    client.close();
  }
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

async function unlinkRemote(remotePath) {
  const query = `/json-api/cpanel?cpanel_jsonapi_user=kathma13&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=unlink&sourcefiles=${encodeURIComponent(remotePath)}`;
  return callApi(query, 'GET');
}

async function extractArchive(remoteZipPath, destDir) {
  const query = `/json-api/cpanel?cpanel_jsonapi_user=kathma13&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=extract&sourcefiles=${encodeURIComponent(remoteZipPath)}&destfiles=${encodeURIComponent(destDir)}`;
  return callApi(query, 'GET');
}

const fixPermsPhp = `<?php
header('Content-Type: application/json');
$dir = '/home8/kathma13/naturesmud.shop';

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

chmod($dir, 0755);
chmod_r($dir);

if (!file_exists($dir . '/tmp')) {
    mkdir($dir . '/tmp', 0755, true);
}
file_put_contents($dir . '/tmp/restart.txt', time());

echo json_encode([
    'success' => true,
    'message' => 'Permissions updated and Passenger reloaded',
    'restarted_via' => 'tmp/restart.txt',
    'time' => time()
], JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('====================================================');
  console.log('⚡ ULTRA-FAST SLIM NEXT.JS FRONTEND LIVE DEPLOYMENT');
  console.log('====================================================\n');

  // 1. Build Next.js
  console.log('[1/4] 🏗️ Compiling Next.js production build...');
  execSync('npm run build', { stdio: 'inherit' });
  const localBuildId = fs.readFileSync(path.join(config.rootDir, '.next', 'BUILD_ID'), 'utf8').trim();
  console.log('✅ Build successful! BUILD_ID:', localBuildId);

  // 2. Package .next (excluding standalone, cache, trace)
  console.log('\n[2/4] 📦 Packaging slim .next build (~5MB)...');
  const outZip = path.join(config.rootDir, 'frontend-slim-dist.zip');
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZip);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    archive.directory(
      path.join(config.rootDir, '.next'),
      '.next',
      (entry) => {
        const norm = entry.name.replace(/\\/g, '/');
        // Exclude huge standalone, cache and trace dirs
        if (
          norm.startsWith('.next/standalone') ||
          norm.startsWith('.next/cache') ||
          norm.startsWith('.next/trace')
        ) {
          return false;
        }

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

  const stats = fs.statSync(outZip);
  console.log(`✅ Slim build package created (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  // 3. Upload & Extract
  console.log('\n[3/4] 🌐 Uploading & extracting slim .next to cPanel...');
  await uploadFile(outZip, `${config.homeDir}/naturesmud.shop`, 'frontend-slim-dist.zip');
  console.log('  -> Extracting .next archive on remote server...');
  const extractRes = await extractArchive(`${config.homeDir}/naturesmud.shop/frontend-slim-dist.zip`, `${config.homeDir}/naturesmud.shop`);
  console.log('  -> Extraction response:', typeof extractRes === 'object' ? JSON.stringify(extractRes) : extractRes);
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  // 4. Server-side Fast Permission Fix & Passenger Restart
  console.log('\n[4/4] 🔒 Applying server permissions and restarting Passenger...');
  const localFixPerms = path.join(config.rootDir, 'fix_perms.php');
  fs.writeFileSync(localFixPerms, fixPermsPhp);
  await uploadFile(localFixPerms, `${config.homeDir}/api.naturesmud.shop/public`, 'fix_perms.php');
  if (fs.existsSync(localFixPerms)) fs.unlinkSync(localFixPerms);
  const permRes = await runPhpEndpoint('/fix_perms.php');
  console.log('Permission Fixer Output:', permRes.body.trim());

  // 5. Verification
  console.log('\n🩺 Verifying Live Production Status on naturesmud.shop...');
  await new Promise(r => setTimeout(r, 2000));
  
  const testEndpoints = [
    'https://naturesmud.shop/',
    'https://naturesmud.shop/products',
    'https://naturesmud.shop/catalog'
  ];

  for (const url of testEndpoints) {
    await new Promise(resolve => {
      const client = url.startsWith('https') ? https : http;
      client.get(url, { rejectUnauthorized: false }, res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => {
          console.log(`  [${res.statusCode === 200 ? '✅ 200 OK' : '❌ ' + res.statusCode}] ${url} (${d.length} bytes)`);
          resolve();
        });
      }).on('error', e => {
        console.log(`  [❌ ERROR] ${url} -> ${e.message}`);
        resolve();
      });
    });
  }

  console.log('\n====================================================');
  console.log('🎉 SLIM FRONTEND UPDATE SUCCESSFULLY DEPLOYED TO NATURESMUD.SHOP!');
  console.log('====================================================\n');
}

main().catch(console.error);
