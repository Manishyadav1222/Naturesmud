const ftp = require('basic-ftp');
const path = require('path');
const http = require('http');

const config = {
  host: '167.235.9.123',
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
};

function runPhpEndpoint(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: config.host,
      port: 80,
      path: path,
      method: 'GET',
      headers: {
        'Host': 'api.naturesmud.shop'
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

async function uploadEnv() {
  const client = new ftp.Client();
  client.timeout = 30000;
  try {
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
    console.log('Connected to FTP. Uploading .env to naturesmud.shop...');
    await client.uploadFrom(
      path.resolve(__dirname, '..', '.env.production'),
      'naturesmud.shop/.env'
    );
    console.log('✅ .env successfully uploaded to naturesmud.shop/.env!');
  } finally {
    client.close();
  }

  // Reload Passenger
  console.log('Reloading Passenger application...');
  const res = await runPhpEndpoint('/fix-perms.php');
  console.log('Passenger reload:', res.body);
}

uploadEnv().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
