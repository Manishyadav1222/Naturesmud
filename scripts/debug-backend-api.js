const https = require('https');
const http = require('http');
const querystring = require('querystring');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13'
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function saveFile(remoteDir, fileName, content) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      dir: remoteDir,
      file: fileName,
      content: content,
      encoding: 'utf-8'
    });

    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/execute/Fileman/save_file_content',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function checkHttp(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: config.host,
      port: 80,
      path: path,
      method: 'GET',
      headers: {
        'Host': 'api.naturesmud.shop',
        'Accept': 'application/json'
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
  console.log('1. Setting APP_DEBUG=true in .env...');
  const envContent = `APP_NAME="Nature's Mud"
APP_ENV=production
APP_KEY=base64:sOlym3kcCRjqMijjGtn3eHW5cD/HFCBhQHfqhqwDDKw=
APP_DEBUG=true
APP_TIMEZONE=Asia/Kathmandu
APP_URL=https://api.naturesmud.shop
FRONTEND_URL=https://naturesmud.shop

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kathma13_natures_mud
DB_USERNAME=kathma13_muduser
DB_PASSWORD=2*5Qt7iSrB7-Uz

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.naturesmud.shop

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync

CACHE_STORE=file
CACHE_PREFIX=naturesmud_

SANCTUM_STATEFUL_DOMAINS=naturesmud.shop,www.naturesmud.shop
`;

  await saveFile(`${config.homeDir}/api.naturesmud.shop`, '.env', envContent);

  console.log('2. Requesting /api/v1/products with Accept: application/json...');
  const res = await checkHttp('/api/v1/products');
  console.log('Status:', res.status);
  console.log('Body:', res.body);
}

main().catch(console.error);
