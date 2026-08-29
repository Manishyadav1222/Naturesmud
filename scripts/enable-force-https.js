const https = require('https');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz'
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function callApi(apiPath, method = 'POST') {
  return new Promise((resolve) => {
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

    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

async function main() {
  console.log('Enabling Force HTTPS for naturesmud.shop...');
  const res1 = await callApi('/execute/DomainInfo/set_force_https_redirect?domain=naturesmud.shop&enabled=1');
  console.log('naturesmud.shop Force HTTPS:', JSON.stringify(res1));

  console.log('Enabling Force HTTPS for api.naturesmud.shop...');
  const res2 = await callApi('/execute/DomainInfo/set_force_https_redirect?domain=api.naturesmud.shop&enabled=1');
  console.log('api.naturesmud.shop Force HTTPS:', JSON.stringify(res2));

  console.log('Enabling Force HTTPS for admin-api.naturesmud.shop...');
  const res3 = await callApi('/execute/DomainInfo/set_force_https_redirect?domain=admin-api.naturesmud.shop&enabled=1');
  console.log('admin-api.naturesmud.shop Force HTTPS:', JSON.stringify(res3));
}

main().catch(console.error);
