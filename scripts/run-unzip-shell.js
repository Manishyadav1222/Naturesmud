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

function callHttps(hostHeader, path) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: config.host,
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Host': hostHeader
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', e => resolve({ error: e.message }));
    req.end();
  });
}

async function main() {
  const phpCode = `<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$zip = '${config.homeDir}/naturesmud.shop/frontend-optimized-dist.zip';
$dest = '${config.homeDir}/naturesmud.shop';

$out = shell_exec("unzip -o $zip -d $dest 2>&1");
echo "SHELL_EXEC UNZIP RESULT:\n" . $out;

// Fix permissions
shell_exec("chmod -R 755 $dest/.next");
shell_exec("touch $dest/tmp/restart.txt");
`;

  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'test_exec_unzip.php', phpCode);
  const res = await callHttps('api.naturesmud.shop', '/test_exec_unzip.php');
  console.log('Result:\n', res.data);
  await saveFile(`${config.homeDir}/api.naturesmud.shop/public`, 'test_exec_unzip.php', '<?php echo "ok"; ?>');
}

main().catch(console.error);
