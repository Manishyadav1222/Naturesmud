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
  const res = await callApi('/execute/SSL/installed_hosts');
  console.log('Active SSL Hosts:', JSON.stringify(res.data?.map(h => h.certificate?.domains), null, 2));
}

main().catch(console.error);
