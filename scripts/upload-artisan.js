const https = require('https');
const fs = require('fs');
const path = require('path');
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

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const artisanContent = fs.readFileSync(path.join(rootDir, 'backend', 'artisan'), 'utf8');
  const composerContent = fs.readFileSync(path.join(rootDir, 'backend', 'composer.json'), 'utf8');

  console.log('1. Uploading artisan file...');
  const res1 = await saveFile(`${config.homeDir}/api.naturesmud.shop`, 'artisan', artisanContent);
  console.log('   artisan:', res1.status === 1 ? '✅ Saved' : JSON.stringify(res1));

  console.log('2. Uploading composer.json...');
  const res2 = await saveFile(`${config.homeDir}/api.naturesmud.shop`, 'composer.json', composerContent);
  console.log('   composer.json:', res2.status === 1 ? '✅ Saved' : JSON.stringify(res2));
}

main().catch(console.error);
