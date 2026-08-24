const http = require('http');

async function testAuthAdmin() {
  const loginData = JSON.stringify({ email: 'superadmin@naturesmud.com', password: 'SuperAdmin@2024' });
  const loginRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 4001,
      path: '/api/admin/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers }));
    });
    req.write(loginData);
    req.end();
  });

  console.log(`Admin Login Status: HTTP ${loginRes.status}`);
  const token = loginRes.data?.data?.accessToken || loginRes.data?.accessToken;
  console.log(`Access Token Obtained: ${Boolean(token)}`);

  if (token) {
    const ordersRes = await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 4001,
        path: '/api/admin/orders',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
      });
      req.end();
    });

    console.log(`Admin Authenticated Orders: HTTP ${ordersRes.status}`);
    console.log(`Orders Data Received: ${ordersRes.data?.data?.length ?? 0} orders`);
  }
}

testAuthAdmin();
