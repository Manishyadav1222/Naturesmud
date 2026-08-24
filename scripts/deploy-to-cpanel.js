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

function callApi(apiPath, method = 'GET', postData = null, isJson = false) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Authorization': 'Basic ' + auth
    };
    if (postData && isJson) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: apiPath,
      method: method,
      headers: headers,
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
    if (postData) req.write(postData);
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
  console.log('=== Nature\'s Mud — Automated cPanel Deployment ===');
  console.log(`Connecting to: ${config.host} (User: ${config.username})...`);

  // 1. Upload Backend ZIP
  console.log('\n[1/4] Uploading Backend (naturesmud-backend.zip)...');
  const backendLocal = path.join(__dirname, '..', 'naturesmud-backend.zip');
  const uploadBackendRes = await uploadFile(backendLocal, `${config.homeDir}/api.naturesmud.shop`, 'naturesmud-backend.zip');
  console.log('  Upload Status:', uploadBackendRes.status === 1 ? '✅ Success' : JSON.stringify(uploadBackendRes.errors));

  // 2. Extract Backend
  console.log('[2/4] Extracting Backend into api.naturesmud.shop...');
  const extractBackendRes = await extractArchive(`${config.homeDir}/api.naturesmud.shop/naturesmud-backend.zip`, `${config.homeDir}/api.naturesmud.shop`);
  console.log('  Extract Status:', extractBackendRes.status === 1 ? '✅ Success' : JSON.stringify(extractBackendRes.errors));

  // 3. Upload Admin API ZIP
  console.log('\n[3/4] Uploading Admin API (naturesmud-admin.zip)...');
  const adminLocal = path.join(__dirname, '..', 'naturesmud-admin.zip');
  const uploadAdminRes = await uploadFile(adminLocal, `${config.homeDir}/admin-api.naturesmud.shop`, 'naturesmud-admin.zip');
  console.log('  Upload Status:', uploadAdminRes.status === 1 ? '✅ Success' : JSON.stringify(uploadAdminRes.errors));

  // 4. Extract Admin API
  console.log('[4/4] Extracting Admin API into admin-api.naturesmud.shop...');
  const extractAdminRes = await extractArchive(`${config.homeDir}/admin-api.naturesmud.shop/naturesmud-admin.zip`, `${config.homeDir}/admin-api.naturesmud.shop`);
  console.log('  Extract Status:', extractAdminRes.status === 1 ? '✅ Success' : JSON.stringify(extractAdminRes.errors));

  console.log('\n============================================================');
  console.log('🎉 Remote Upload & Extraction Completed Successfully!');
  console.log('============================================================');
}

main().catch(console.error);
