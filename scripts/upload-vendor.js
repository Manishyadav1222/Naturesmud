const https = require('https');
const fs = require('fs');
const path = require('path');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13'
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

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

function extractFile(remoteZipPath, destDir) {
  return new Promise((resolve) => {
    const url = `/json-api/cpanel?cpanel_jsonapi_user=kathma13&cpanel_jsonapi_apiversion=1&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=extract&arg-0=${encodeURIComponent(remoteZipPath)}&arg-1=${encodeURIComponent(destDir)}`;
    https.get({
      hostname: config.host,
      port: config.port,
      path: url,
      headers: { 'Authorization': 'Basic ' + auth },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(data));
    });
  });
}

async function main() {
  console.log('1. Uploading laravel-vendor.zip (45 MB)...');
  const uploadRes = await uploadFile(path.join(__dirname, '..', 'laravel-vendor.zip'), `${config.homeDir}/api.naturesmud.shop`, 'laravel-vendor.zip');
  console.log('   Upload result:', uploadRes.status === 1 ? '✅ Uploaded' : JSON.stringify(uploadRes));

  console.log('2. Extracting vendor into api.naturesmud.shop...');
  const extractRes = await extractFile(`${config.homeDir}/api.naturesmud.shop/laravel-vendor.zip`, `${config.homeDir}/api.naturesmud.shop`);
  console.log('   Extract result:', extractRes);

  console.log('Done!');
}

main().catch(console.error);
