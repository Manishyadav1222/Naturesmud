const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const querystring = require('querystring');
const ftp = require('basic-ftp');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13',
  rootDir: path.resolve(__dirname, '..'),
  frontendRemoteDir: '/home8/kathma13/naturesmud.shop'
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

async function uploadFileFtp(localPath, remoteDir, remoteFileName) {
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
    console.log(`  -> Uploading ${localPath} to ${remotePath} via FTP...`);
    await client.uploadFrom(localPath, remotePath);
    console.log('  -> Upload complete.');
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

function copyRecursiveSync(src, dest, ignoreList = []) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      if (ignoreList.includes(childItemName)) return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName), ignoreList);
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function restartFrontend() {
  const client = new ftp.Client();
  try {
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
    const timestamp = Date.now().toString();
    const scratchDir = path.join(config.rootDir, 'scratch');
    if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
    const tempRestartFile = path.join(scratchDir, 'restart.txt');
    fs.writeFileSync(tempRestartFile, timestamp, 'utf8');
    await client.uploadFrom(tempRestartFile, '/naturesmud.shop/tmp/restart.txt');
    if (fs.existsSync(tempRestartFile)) fs.unlinkSync(tempRestartFile);
    return true;
  } finally {
    client.close();
  }
}

async function main() {
  console.log('====================================================');
  console.log('🚀 NATURE\'S MUD FRONTEND UPDATE PIPELINE');
  console.log('====================================================\n');

  const buildIdPath = path.join(config.rootDir, '.next', 'BUILD_ID');
  if (process.argv.includes('--rebuild') || !fs.existsSync(buildIdPath)) {
    console.log('[1/5] 🏗️ Compiling fresh Next.js production build...');
    execSync('npm run build', { stdio: 'inherit' });
  } else {
    console.log('[1/5] ⚡ Reusing existing fresh Next.js production build...');
  }
  const localBuildId = fs.readFileSync(buildIdPath, 'utf8').trim();
  console.log('✅ Local Build Ready. BUILD_ID:', localBuildId);

  // 2. Stage clean .next without cache or standalone
  console.log('\n[2/5] 📦 Staging clean update files...');
  const stagingDir = path.join(config.rootDir, 'scratch', 'frontend-update-staging');
  if (fs.existsSync(stagingDir)) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }
  fs.mkdirSync(stagingDir, { recursive: true });

  const nextStagingDir = path.join(stagingDir, '.next');
  fs.mkdirSync(nextStagingDir, { recursive: true });

  const nextSrc = path.join(config.rootDir, '.next');
  for (const item of fs.readdirSync(nextSrc)) {
    if (item !== 'cache' && item !== 'standalone') {
      copyRecursiveSync(path.join(nextSrc, item), path.join(nextStagingDir, item));
    }
  }

  // Also include next.config.mjs
  fs.copyFileSync(
    path.join(config.rootDir, 'next.config.mjs'),
    path.join(stagingDir, 'next.config.mjs')
  );

  // Also include public directory with brand icons, manifest, and logos (lightweight)
  console.log('  -> Staging public brand assets (favicons, icons, logos, manifest)...');
  const publicStagingDir = path.join(stagingDir, 'public');
  fs.mkdirSync(publicStagingDir, { recursive: true });

  const brandFiles = [
    'favicon.ico',
    'icon.png',
    'apple-touch-icon.png',
    'apple-icon.png',
    'apple-touch-icon-precomposed.png',
    'site.webmanifest',
    'naturesmud-og-image.jpg',
    'logo.png',
    'logo-white.png',
    'logo-transparent.png',
    'icon-16x16.png',
    'icon-32x32.png',
    'icon-48x48.png',
    'icon-96x96.png',
    'icon-192x192.png',
    'icon-512x512.png',
    'naturesmud-brand-logo.png'
  ];
  for (const f of brandFiles) {
    const srcF = path.join(config.rootDir, 'public', f);
    if (fs.existsSync(srcF)) {
      fs.copyFileSync(srcF, path.join(publicStagingDir, f));
    }
  }

  const outZip = path.join(config.rootDir, 'deploy_frontend_update.zip');
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  console.log('  -> Compressing staged files using tar/zip...');
  execSync(`tar -a -c -f "${outZip}" -C "${stagingDir}" .next next.config.mjs public`, { stdio: 'inherit' });
  const stats = fs.statSync(outZip);
  console.log(`✅ Build package created: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  // 3. Upload via FTP
  console.log('\n[3/5] 🌐 Uploading deploy_frontend_update.zip to /naturesmud.shop via FTP...');
  await uploadFileFtp(outZip, config.frontendRemoteDir, 'deploy_frontend_update.zip');

  // 4. Extract archive on server
  console.log('\n[4/5] 📦 Extracting archive on cPanel host...');
  const extractResult = await extractArchive(
    `${config.frontendRemoteDir}/deploy_frontend_update.zip`,
    config.frontendRemoteDir
  );
  console.log('  -> Extraction response:', JSON.stringify(extractResult?.cpanelresult?.data || extractResult));

  // 5. Restart Passenger
  console.log('\n[5/5] 🔄 Restarting Phusion Passenger Frontend Node.js App...');
  await restartFrontend();
  console.log('  -> tmp/restart.txt updated successfully');

  // Clean local temp files & remote zip
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);
  if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
  await unlinkRemote(`${config.frontendRemoteDir}/deploy_frontend_update.zip`).catch(() => {});

  console.log('\n====================================================');
  console.log('🎉 FRONTEND DEPLOYMENT COMPLETE! Verifying live site...');
  console.log('====================================================\n');

  // Wait 4 seconds for Passenger reload
  await new Promise(r => setTimeout(r, 4000));

  function verifyUrl(url) {
    return new Promise(resolve => {
      https.get(url, (res) => {
        let len = 0;
        res.on('data', d => len += d.length);
        res.on('end', () => {
          console.log(`[HTTP ${res.statusCode}] ${url} (${len} bytes, type: ${res.headers['content-type']})`);
          resolve(res.statusCode);
        });
      }).on('error', err => {
        console.error(`Error ${url}:`, err.message);
        resolve(500);
      });
    });
  }

  await verifyUrl('https://naturesmud.com');
  await verifyUrl('https://naturesmud.com/favicon.ico');
  await verifyUrl('https://naturesmud.com/icon-48x48.png');
  await verifyUrl('https://naturesmud.com/icon-192x192.png');
  await verifyUrl('https://naturesmud.com/site.webmanifest');
  await verifyUrl('https://naturesmud.com/naturesmud-og-image.jpg');
}

main().catch(console.error);
