// ============================================================
// Production entry point for cPanel Phusion Passenger / Node.js
// ============================================================
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const fs = require('fs');
const path = require('path');

// Ensure environment variables are loaded for Phusion Passenger on cPanel
try {
  const dotenv = require('dotenv');
  const envPath = path.resolve(__dirname, '.env');
  const envProdPath = path.resolve(__dirname, '.env.production');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else if (fs.existsSync(envProdPath)) {
    dotenv.config({ path: envProdPath });
  }
} catch (e) {
  // Ignore if dotenv is unavailable
}

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Nature's Mud Next.js ready on port ${port}`);
    });
});
