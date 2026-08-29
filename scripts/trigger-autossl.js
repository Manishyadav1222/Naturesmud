const https = require('https');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz'
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function callApi(apiPath, method = 'GET') {
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
  console.log('1. Checking SSL status for all installed hosts...');
  const res1 = await callApi('/execute/SSL/installed_hosts');
  console.log('Installed hosts:', JSON.stringify(res1.data?.map(h => ({ cert_id: h.certificate?.id, domains: h.certificate?.domains })), null, 2));

  console.log('\n2. Triggering AutoSSL check for user kathma13...');
  const res2 = await callApi('/execute/SSL/start_autossl_check', 'POST');
  console.log('Start AutoSSL status:', JSON.stringify(res2, null, 2));
}

main().catch(console.error);
