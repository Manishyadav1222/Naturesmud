const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  
  // Create a diagnostic server.js
  const diagServer = `
const http = require('http');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'passenger_debug.log');
function log(msg) {
  fs.appendFileSync(logFile, new Date().toISOString() + ' ' + msg + '\\n');
}

log('Server starting... PORT=' + process.env.PORT + ' PASSENGER_APP_ENV=' + process.env.PASSENGER_APP_ENV);

const server = http.createServer((req, res) => {
  log('Received request: ' + req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Passenger Diagnostic! PORT=' + process.env.PORT);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  log('Server listening on ' + port);
});
`;

  fs.writeFileSync('diag_server.js', diagServer);
  await client.uploadFrom('diag_server.js', '/naturesmud.shop/server.js');
  fs.unlinkSync('diag_server.js');

  // Touch tmp/restart.txt
  const php = `<?php
  file_put_contents('/home8/kathma13/naturesmud.shop/tmp/restart.txt', time());
  @unlink('/home8/kathma13/naturesmud.shop/passenger_debug.log');
  echo "Restart touched\\n";
  `;
  fs.writeFileSync('touch_restart.php', php);
  await client.uploadFrom('touch_restart.php', '/api.naturesmud.shop/public/touch_restart.php');
  
  await new Promise(res => {
    https.get('https://api.naturesmud.shop/touch_restart.php', r => {
      r.on('data', () => {});
      r.on('end', res);
    });
  });
  await client.remove('/api.naturesmud.shop/public/touch_restart.php');
  fs.unlinkSync('touch_restart.php');

  // Now make a request to https://naturesmud.shop/
  console.log('Requesting https://naturesmud.shop/ ...');
  https.get('https://naturesmud.shop/', async (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Response Status:', res.statusCode);
      console.log('Response Body:', d.slice(0, 300));
      client.close();
    });
  });
}
run().catch(console.error);
