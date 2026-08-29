const https = require('https');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz'
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function callApi(apiPath) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: apiPath,
      method: 'GET',
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

    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

async function main() {
  console.log('1. Checking cPanel DNS Zone for naturesmud.shop...');
  const res = await callApi('/execute/DNS/parse_zone?zone=naturesmud.shop');
  console.log('Zone parsed:', JSON.stringify(res, null, 2));
}

main().catch(console.error);
