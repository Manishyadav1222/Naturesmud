const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const FormData = require('form-data');
const querystring = require('querystring');
const { ZipArchive } = require('archiver');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13',
  rootDir: path.resolve(__dirname, '..')
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function callApi(apiPath, method = 'GET', data = null, contentType = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Authorization': 'Basic ' + auth
    };

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    if (data && Buffer.isBuffer(data)) {
      headers['Content-Length'] = data.length;
    }

    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: apiPath,
      method: method,
      headers: headers,
      rejectUnauthorized: false
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function uploadFile(remoteDir, localFilePath) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('dir', remoteDir);
    form.append('overwrite', '1');
    form.append('file-1', fs.createReadStream(localFilePath));

    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/execute/Fileman/upload_files',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        ...form.getHeaders()
      },
      rejectUnauthorized: false
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    form.pipe(req);
  });
}

async function extractRemoteZip(remoteDir, zipFileName) {
  const postData = querystring.stringify({
    dir: remoteDir,
    file: zipFileName,
    overwrite: 1
  });

  return callApi(
    '/execute/Fileman/extract_archive',
    'POST',
    Buffer.from(postData),
    'application/x-www-form-urlencoded'
  );
}

async function restartFrontend() {
  const postData = querystring.stringify({
    dir: `${config.homeDir}/naturesmud.shop/tmp`,
    file: 'restart.txt',
    content: `Restarted at ${new Date().toISOString()}`,
    encoding: 'utf-8'
  });

  return callApi(
    '/execute/Fileman/save_file_content',
    'POST',
    Buffer.from(postData),
    'application/x-www-form-urlencoded'
  );
}

async function main() {
  console.log('====================================================');
  console.log('🚀 NATURE\'S MUD RELIABLE REST API DEPLOYMENT PIPELINE');
  console.log('====================================================\n');

  // 1. Build Next.js
  console.log('[1/5] 🏗️ Compiling Next.js production build...');
  execSync('npm run build', { stdio: 'inherit' });
  const localBuildId = fs.readFileSync(path.join(config.rootDir, '.next', 'BUILD_ID'), 'utf8').trim();
  console.log('✅ Build successful! BUILD_ID:', localBuildId);

  // 2. Clean cache & package
  console.log('\n[2/5] 📦 Packaging .next (stripping cache)...');
  const cacheDir = path.join(config.rootDir, '.next', 'cache');
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }

  const outZip = path.join(config.rootDir, 'deploy_frontend_update.zip');
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
  console.log(`✅ Build package created (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  // 3. Upload via HTTPS cPanel API
  console.log('\n[3/5] 🌐 Uploading update to Nest Nepal /naturesmud.shop via HTTPS API...');
  const upRes = await uploadFile(`${config.homeDir}/naturesmud.shop`, outZip);
  console.log('  -> Upload response:', upRes.status === 1 ? '✅ Uploaded' : JSON.stringify(upRes));

  // 4. Extract archive
  console.log('\n[4/5] 📦 Extracting archive on server...');
  const extRes = await extractRemoteZip(`${config.homeDir}/naturesmud.shop`, 'deploy_frontend_update.zip');
  console.log('  -> Extraction response:', extRes.status === 1 ? '✅ Extracted' : JSON.stringify(extRes));

  // 5. Restart Passenger
  console.log('\n[5/5] 🔄 Restarting Phusion Passenger Node.js App...');
  const rstRes = await restartFrontend();
  console.log('  -> Restart trigger:', rstRes.status === 1 ? '✅ Restarted' : JSON.stringify(rstRes));

  // Clean local temp zip
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  console.log('\n====================================================');
  console.log('🎉 FRONTEND UPDATE SUCCESSFULLY DEPLOYED TO NATURESMUD.SHOP!');
  console.log('====================================================\n');
}

main().catch(console.error);
