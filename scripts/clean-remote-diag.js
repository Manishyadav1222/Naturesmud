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

async function main() {
  console.log('Cleaning up remote diagnostic files...');
  const res = await callApi(`/execute/Fileman/delete_files?dir=${encodeURIComponent(config.homeDir + '/api.naturesmud.shop/public')}&file-1=diag.php&file-2=extract_runner.php`);
  console.log('Cleanup status:', res.status === 1 ? '✅ Cleaned' : JSON.stringify(res));
}

main().catch(console.error);
