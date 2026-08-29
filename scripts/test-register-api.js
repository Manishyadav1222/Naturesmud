const http = require('http');

const config = {
  host: '167.235.9.123',
  port: 80
};

const postData = JSON.stringify({
  name: 'Test Customer',
  email: 'test' + Date.now() + '@example.com',
  phone: '9800000000',
  password: 'Password123!',
  password_confirmation: 'Password123!'
});

function testRegister() {
  const req = http.request({
    hostname: config.host,
    port: config.port,
    path: '/api/v1/register',
    method: 'POST',
    headers: {
      'Host': 'api.naturesmud.shop',
      'Origin': 'https://naturesmud.shop',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let data = '';
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    res.on('data', d => data += d);
    res.on('end', () => console.log('Response Body:\n', data));
  });

  req.on('error', e => console.error('Request Error:', e.message));
  req.write(postData);
  req.end();
}

testRegister();
