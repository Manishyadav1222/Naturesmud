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

async function extractArchive(remoteZipPath, destDir) {
  const query = `/execute/Fileman/extract_archive?file=${encodeURIComponent(remoteZipPath)}&dest=${encodeURIComponent(destDir)}`;
  return callApi(query, 'GET');
}

async function main() {
  const outZip = path.join(config.rootDir, 'frontend-build-update.zip');
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  console.log('1. Packaging .next build folder...');
  const psCmd = `powershell -Command "Compress-Archive -Path '${config.rootDir}\\.next' -DestinationPath '${outZip}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });

  const stats = fs.statSync(outZip);
  console.log(`Package size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  console.log('2. Uploading frontend-build-update.zip to /home8/kathma13/naturesmud.shop...');
  const upRes = await uploadFile(outZip, `${config.homeDir}/naturesmud.shop`, 'frontend-build-update.zip');
  console.log('Upload status:', upRes.status === 1 ? '✅ Uploaded' : JSON.stringify(upRes));

  console.log('3. Extracting archive on server...');
  const extRes = await extractArchive(`${config.homeDir}/naturesmud.shop/frontend-build-update.zip`, `${config.homeDir}/naturesmud.shop`);
  console.log('Extraction status:', extRes.status === 1 ? '✅ Extracted' : JSON.stringify(extRes));

  console.log('4. Restarting Phusion Passenger Next.js App...');
  const rstRes = await callApi(`/execute/Fileman/save_file_content?dir=${encodeURIComponent(config.homeDir + '/naturesmud.shop/tmp')}&file=restart.txt&content=${encodeURIComponent(new Date().toISOString())}`, 'GET');
  console.log('Passenger restart triggered!');

  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);
  console.log('🎉 Production frontend updated and restarted on Nest Nepal!');
}

main().catch(console.error);
