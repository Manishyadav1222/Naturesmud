const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13',
  rootDir: path.resolve(__dirname, '..')
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function callApi(apiPath, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: apiPath,
      method: method,
      headers: {
        'Authorization': 'Basic ' + auth
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

function uploadFile(localPath, remoteDir, remoteFileName) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const fileData = fs.readFileSync(localPath);
    
    const header = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="dir"\r\n\r\n` +
      `${remoteDir}\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="overwrite"\r\n\r\n` +
      `1\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file-1"; filename="${remoteFileName}"\r\n` +
      `Content-Type: application/zip\r\n\r\n`
    );
    
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const contentLength = header.length + fileData.length + footer.length;
    
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/execute/Fileman/upload_files',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': contentLength
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
    req.write(header);
    req.write(fileData);
    req.write(footer);
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

async function main() {
  const cacheDir = path.join(config.rootDir, '.next', 'cache');
  if (fs.existsSync(cacheDir)) {
    console.log('Cleaning local .next/cache before packaging...');
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }

  const localBuildId = fs.readFileSync(path.join(config.rootDir, '.next', 'BUILD_ID'), 'utf8').trim();
  console.log('Local BUILD_ID to deploy:', localBuildId);

  const outZip = path.join(config.rootDir, 'frontend-optimized-dist.zip');
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  console.log('1. Zipping production .next build folder using ZipArchive with POSIX modes (0755 / 0644)...');
  await new Promise((resolve, reject) => {
    const { ZipArchive } = require('archiver');
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
  console.log(`Optimized Package size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  console.log('2. Removing previous .next folder from server...');
  await unlinkRemote(`${config.homeDir}/naturesmud.shop/.next`);

  console.log('3. Uploading frontend-optimized-dist.zip to /home8/kathma13/naturesmud.shop...');
  const upRes = await uploadFile(outZip, `${config.homeDir}/naturesmud.shop`, 'frontend-optimized-dist.zip');
  console.log('Upload status:', upRes.status === 1 ? '✅ Uploaded' : JSON.stringify(upRes));

  console.log('4. Extracting archive on server...');
  const extRes = await extractArchive(`${config.homeDir}/naturesmud.shop/frontend-optimized-dist.zip`, `${config.homeDir}/naturesmud.shop`);
  console.log('Extraction status:', extRes.status === 1 || extRes.event ? '✅ Extracted' : JSON.stringify(extRes));

  console.log('5. Verifying server BUILD_ID...');
  const serverBuildIdRes = await callApi(`/execute/Fileman/get_file_content?dir=${encodeURIComponent(config.homeDir + '/naturesmud.shop/.next')}&file=BUILD_ID`);
  const serverBuildId = serverBuildIdRes.data ? serverBuildIdRes.data.content.trim() : null;
  console.log('Server BUILD_ID:', serverBuildId);

  if (serverBuildId === localBuildId) {
    console.log('✅ BUILD_ID verified successfully on production!');
  } else {
    console.warn('⚠️ BUILD_ID mismatch or not readable:', serverBuildId, 'vs local:', localBuildId);
  }

  console.log('6. Triggering Passenger restart...');
  await callApi(`/execute/Fileman/save_file_content?dir=${encodeURIComponent(config.homeDir + '/naturesmud.shop/tmp')}&file=restart.txt&content=${encodeURIComponent(new Date().toISOString())}`, 'GET');
  console.log('Passenger restart triggered!');

  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);
  console.log('🎉 Production frontend build successfully deployed & restarted on Nest Nepal!');
}

main().catch(console.error);
