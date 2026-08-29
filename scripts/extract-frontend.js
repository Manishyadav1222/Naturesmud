const https = require('https');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13'
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function callApi(apiPath) {
  return new Promise((resolve, reject) => {
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
    req.end();
  });
}

async function main() {
  console.log('1. Extracting frontend-optimized-dist.zip using Fileman/extract_files...');
  const res1 = await callApi(`/execute/Fileman/extract_files?dir=${encodeURIComponent(config.homeDir + '/naturesmud.shop')}&file=frontend-optimized-dist.zip`);
  console.log('Extract Result:', JSON.stringify(res1, null, 2));

  console.log('\n2. Restarting Next.js app...');
  await callApi(`/execute/Fileman/save_file_content?dir=${encodeURIComponent(config.homeDir + '/naturesmud.shop/tmp')}&file=restart.txt&content=${encodeURIComponent(new Date().toISOString())}`);
  console.log('Restart triggered!');
}

main().catch(console.error);
