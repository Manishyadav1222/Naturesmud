// ============================================================
// Production entry point for cPanel Phusion Passenger / Node.js
// ============================================================
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '2';
process.env.NODE_ENV = 'production';

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

  server.once('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> Nature's Mud Next.js ready on port ${port}`);
  });

  // Graceful shutdown to prevent orphaned zombie processes
  const shutdown = (signal) => {
    console.log(`Received ${signal}, shutting down Next.js server...`);
    setTimeout(() => process.exit(0), 2000).unref();
    try {
      server.close(() => process.exit(0));
    } catch (e) {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}).catch(err => {
  console.error('Error during app.prepare():', err);
  process.exit(1);
});
