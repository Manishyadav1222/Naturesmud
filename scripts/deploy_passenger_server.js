const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');

async function run() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });
  
  const serverContent = `// ============================================================
// Production entry point for cPanel Phusion Passenger / Node.js
// ============================================================
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Ensure environment variables are loaded
try {
  const dotenv = require('dotenv');
  const envPath = path.resolve(__dirname, '.env');
  const envProdPath = path.resolve(__dirname, '.env.production');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else if (fs.existsSync(envProdPath)) {
    dotenv.config({ path: envProdPath });
  }
} catch (e) {}

process.env.NODE_ENV = 'production';
const dev = false;
const port = process.env.PORT || 3000;

const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, () => {
    console.log("> Nature's Mud Next.js ready on port " + port);
  });
}).catch(err => {
  console.error('Error during app.prepare():', err);
  process.exit(1);
});
`;

  fs.writeFileSync('prod_server.js', serverContent);
  await client.uploadFrom('prod_server.js', '/naturesmud.shop/server.js');
  fs.unlinkSync('prod_server.js');

  // Touch tmp/restart.txt
  const php = `<?php
  file_put_contents('/home8/kathma13/naturesmud.shop/tmp/restart.txt', time());
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

  console.log('Server restart touched. Waiting 3 seconds before testing live site...');
  await new Promise(r => setTimeout(r, 3000));

  console.log('Testing https://naturesmud.shop/ ...');
  https.get('https://naturesmud.shop/', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log('Homepage Status:', res.statusCode);
      console.log('Body length:', d.length);
      console.log('Contains roasted-almonds-v2.jpg:', d.includes('roasted-almonds-v2.jpg'));
      console.log('Contains avocado-powder-v2.jpg:', d.includes('avocado-powder-v2.jpg'));
      console.log('Contains strawberry-powder-v2.jpg:', d.includes('strawberry-powder-v2.jpg'));
      console.log('Contains Himalayan Superfood Bundles:', d.includes('Himalayan Superfood Bundles'));
      console.log('Snippet:', d.slice(0, 400));
      client.close();
    });
  }).on('error', (err) => {
    console.error('Request error:', err);
    client.close();
  });
}
run().catch(console.error);
