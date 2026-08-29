const https = require('https');
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
  return new Promise((resolve) => {
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

    req.write(postData);
    req.end();
  });
}

async function main() {
  const blank = '<?php http_response_code(404);';
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'npm_runner.php', blank);
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'npm_runner2.php', blank);
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'find_npm.php', blank);
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'list_frontend.php', blank);
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'admin_install.php', blank);
  console.log('✅ All temporary helper files neutralized.');
}

main().catch(console.error);
