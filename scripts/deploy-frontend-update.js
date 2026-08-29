const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const FormData = require('form-data');
const querystring = require('querystring');

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
  const outZip = path.join(config.rootDir, 'deploy_frontend_update.zip');
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  console.log('1. Zipping .next and server files with PowerShell...');
  const psCmd = `powershell -Command "Compress-Archive -Path '${config.rootDir}\\.next', '${config.rootDir}\\server.js', '${config.rootDir}\\package.json', '${config.rootDir}\\public' -DestinationPath '${outZip}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });

  const stats = fs.statSync(outZip);
  console.log(`Package created: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  console.log('2. Uploading update to Nest Nepal /naturesmud.shop...');
  const upRes = await uploadFile(`${config.homeDir}/naturesmud.shop`, outZip);
  console.log('Upload status:', upRes.status === 1 ? '✅ Uploaded' : JSON.stringify(upRes));

  console.log('3. Extracting archive on server...');
  const extRes = await extractRemoteZip(`${config.homeDir}/naturesmud.shop`, 'deploy_frontend_update.zip');
  console.log('Extraction status:', extRes.status === 1 ? '✅ Extracted' : JSON.stringify(extRes));

  console.log('4. Restarting Phusion Passenger Next.js App...');
  const rstRes = await restartFrontend();
  console.log('Restart trigger:', rstRes.status === 1 ? '✅ Restarted' : JSON.stringify(rstRes));

  // Clean local temp zip
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);
  console.log('🎉 Frontend successfully updated with live API endpoints on Nest Nepal!');
}

main().catch(console.error);
