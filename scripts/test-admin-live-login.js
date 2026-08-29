const https = require('https');

const config = {
  host: '167.235.9.123'
};

const payload = JSON.stringify({
  email: 'admin@naturesmud.shop',
  password: 'NatureMud@Admin2026!'
});

const req = https.request({
  hostname: config.host,
  port: 443,
  path: '/api/admin/auth/login',
  method: 'POST',
  headers: {
    'Host': 'admin-api.naturesmud.shop',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  },
  rejectUnauthorized: false
}, (res) => {
  let data = '';
  console.log('Status Code:', res.statusCode);
  res.on('data', d => data += d);
  res.on('end', () => console.log('Response Body:\n', data));
});

req.on('error', e => console.error('Error:', e.message));
req.write(payload);
req.end();
