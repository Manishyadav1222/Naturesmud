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
  const query = `/json-api/cpanel?cpanel_jsonapi_user=kathma13&cpanel_jsonapi_apiversion=1&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=extract&arg-0=${encodeURIComponent(remoteZipPath)}&arg-1=${encodeURIComponent(destDir)}`;
  return callApi(query, 'GET');
}

async function main() {
  console.log('=== Nature\'s Mud — Automated cPanel Deployment ===');
  console.log(`Connecting to: ${config.host} (User: ${config.username})...`);

  // Package fresh zips first
  console.log('\nPackaging dist zips...');
  require('./package-for-cpanel.js');

  // 1. Upload Backend ZIP
  console.log('\n[1/4] Uploading Backend (naturesmud-backend.zip)...');
  const backendLocal = path.join(__dirname, '..', 'naturesmud-backend.zip');
  const uploadBackendRes = await uploadFile(backendLocal, `${config.homeDir}/api.naturesmud.shop`, 'naturesmud-backend.zip');
  console.log('  Upload Status:', uploadBackendRes.status === 1 ? '✅ Success' : JSON.stringify(uploadBackendRes));

  // 2. Extract Backend
  console.log('[2/4] Extracting Backend into api.naturesmud.shop...');
  const extractBackendRes = await extractArchive(`${config.homeDir}/api.naturesmud.shop/naturesmud-backend.zip`, `${config.homeDir}/api.naturesmud.shop`);
  console.log('  Extract Status:', extractBackendRes.event?.result === 1 || extractBackendRes.status === 1 ? '✅ Success' : JSON.stringify(extractBackendRes));

  // 3. Upload Admin API ZIP
  console.log('\n[3/4] Uploading Admin API (naturesmud-admin.zip)...');
  const adminLocal = path.join(__dirname, '..', 'naturesmud-admin.zip');
  const uploadAdminRes = await uploadFile(adminLocal, `${config.homeDir}/admin-api.naturesmud.shop`, 'naturesmud-admin.zip');
  console.log('  Upload Status:', uploadAdminRes.status === 1 ? '✅ Success' : JSON.stringify(uploadAdminRes));

  // 4. Extract Admin API
  console.log('[4/4] Extracting Admin API into admin-api.naturesmud.shop...');
  const extractAdminRes = await extractArchive(`${config.homeDir}/admin-api.naturesmud.shop/naturesmud-admin.zip`, `${config.homeDir}/admin-api.naturesmud.shop`);
  console.log('  Extract Status:', extractAdminRes.event?.result === 1 || extractAdminRes.status === 1 ? '✅ Success' : JSON.stringify(extractAdminRes));

  // 5. Trigger Passenger restart for admin-api
  console.log('\n[5/5] Restarting Admin API Passenger application...');
  await callApi(`/execute/Fileman/save_file_content?dir=${encodeURIComponent(config.homeDir + '/admin-api.naturesmud.shop/tmp')}&file=restart.txt&content=${encodeURIComponent(new Date().toISOString())}`, 'GET');
  console.log('  Passenger Admin API Restart Triggered! ✅');

  console.log('\n============================================================');
  console.log('🎉 Remote Upload & Extraction Completed Successfully!');
  console.log('============================================================');
}

main().catch(console.error);

