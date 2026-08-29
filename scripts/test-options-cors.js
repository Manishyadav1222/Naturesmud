const http = require('http');

const config = {
  host: '167.235.9.123',
  port: 80
};

function testOptions() {
  const req = http.request({
    hostname: config.host,
    port: config.port,
    path: '/api/v1/register',
    method: 'OPTIONS',
    headers: {
      'Host': 'api.naturesmud.shop',
      'Origin': 'https://naturesmud.shop',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type,accept,authorization'
    }
  }, (res) => {
    let data = '';
    console.log('OPTIONS Status Code:', res.statusCode);
    console.log('OPTIONS Headers:', JSON.stringify(res.headers, null, 2));
    res.on('data', d => data += d);
    res.on('end', () => console.log('OPTIONS Body:', data));
  });

  req.on('error', e => console.error('OPTIONS Error:', e.message));
  req.end();
}

testOptions();
