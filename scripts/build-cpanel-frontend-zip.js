const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building clean CloudLinux-compatible frontend-deploy.zip...');

// 1. Read root package.json and extract ONLY runtime dependencies
const rootPkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

const prodPkg = {
  name: 'natures-mud-frontend',
  version: '1.0.0',
  private: true,
  scripts: {
    start: 'node server.js'
  },
  dependencies: rootPkg.dependencies
};

const stagingDir = path.join(__dirname, '..', 'scratch', 'frontend-staging');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy .next (excluding cache to keep zip tiny and fast)
const nextDest = path.join(stagingDir, '.next');
fs.mkdirSync(nextDest, { recursive: true });
const nextSrc = path.join(__dirname, '..', '.next');
for (const item of fs.readdirSync(nextSrc)) {
  if (item !== 'cache' && item !== 'standalone') {
    copyRecursiveSync(path.join(nextSrc, item), path.join(nextDest, item));
  }
}

// Copy public directory
copyRecursiveSync(path.join(__dirname, '..', 'public'), path.join(stagingDir, 'public'));

// Write clean production package.json (no devDependencies!)
fs.writeFileSync(path.join(stagingDir, 'package.json'), JSON.stringify(prodPkg, null, 2), 'utf8');

// Write universal cPanel Passenger server.js
const serverJsContent = `const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = '0.0.0.0';

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
      console.log(\`> Nature's Mud Next.js Server Ready on port \${port}\`);
    });
}).catch((err) => {
  console.error('Error starting Next.js application:', err);
  process.exit(1);
});
`;

fs.writeFileSync(path.join(stagingDir, 'server.js'), serverJsContent, 'utf8');

const targetZip = path.join(__dirname, '..', 'frontend-deploy.zip');
if (fs.existsSync(targetZip)) {
  fs.unlinkSync(targetZip);
}

execSync(`tar -a -c -f "${targetZip}" -C "${stagingDir}" .next public package.json server.js`, { stdio: 'inherit' });

const stats = fs.statSync(targetZip);
console.log(`Created clean CloudLinux frontend-deploy.zip (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
