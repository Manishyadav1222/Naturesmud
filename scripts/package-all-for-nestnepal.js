const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDeploy = path.join(rootDir, 'cpanel-deploy');

console.log('============================================================');
console.log('🚀 Nature\'s Mud — Nest Nepal Complete Package Builder');
console.log('============================================================\n');

// Helper to copy recursively
function copyRecursiveSync(src, dest, ignoreList = []) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      if (ignoreList.includes(file)) continue;
      copyRecursiveSync(path.join(src, file), path.join(dest, file), ignoreList);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Build Next.js Frontend
console.log('[1/4] Building Next.js Frontend (Production)...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Frontend build succeeded.');
} catch (e) {
  console.error('❌ Frontend build failed:', e.message);
  process.exit(1);
}

// 2. Build Admin Server
console.log('\n[2/4] Building Admin Server (TypeScript -> JavaScript)...');
try {
  execSync('npm --prefix admin-server run build', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Admin server build succeeded.');
} catch (e) {
  console.error('❌ Admin server build failed:', e.message);
  process.exit(1);
}

// Clean & prepare staging directory
console.log('\n[3/4] Preparing Deployment Packages...');
if (fs.existsSync(distDeploy)) {
  fs.rmSync(distDeploy, { recursive: true, force: true });
}
const frontendStage = path.join(distDeploy, 'frontend');
const adminStage = path.join(distDeploy, 'admin-server');
const backendStage = path.join(distDeploy, 'backend');

fs.mkdirSync(frontendStage, { recursive: true });
fs.mkdirSync(adminStage, { recursive: true });
fs.mkdirSync(backendStage, { recursive: true });

// --- PACKAGE 1: Frontend ---
console.log('  -> Assembling Frontend package...');
// Copy .next (excluding cache)
const nextDest = path.join(frontendStage, '.next');
fs.mkdirSync(nextDest, { recursive: true });
const nextSrc = path.join(rootDir, '.next');
for (const item of fs.readdirSync(nextSrc)) {
  if (item !== 'cache' && item !== 'standalone') {
    copyRecursiveSync(path.join(nextSrc, item), path.join(nextDest, item));
  }
}
// Copy public
copyRecursiveSync(path.join(rootDir, 'public'), path.join(frontendStage, 'public'));
// Copy root package files
const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const frontendProdPkg = {
  name: 'natures-mud-frontend',
  version: '1.0.0',
  private: true,
  scripts: {
    start: 'node server.js'
  },
  dependencies: rootPkg.dependencies
};
fs.writeFileSync(path.join(frontendStage, 'package.json'), JSON.stringify(frontendProdPkg, null, 2), 'utf8');
if (fs.existsSync(path.join(rootDir, 'package-lock.json'))) {
  fs.copyFileSync(path.join(rootDir, 'package-lock.json'), path.join(frontendStage, 'package-lock.json'));
}
fs.copyFileSync(path.join(rootDir, 'server.js'), path.join(frontendStage, 'server.js'));
fs.copyFileSync(path.join(rootDir, 'next.config.mjs'), path.join(frontendStage, 'next.config.mjs'));

// Production .env for Frontend
if (fs.existsSync(path.join(rootDir, '.env.production'))) {
  fs.copyFileSync(path.join(rootDir, '.env.production'), path.join(frontendStage, '.env'));
}

// --- PACKAGE 2: Admin Server ---
console.log('  -> Assembling Admin Server package...');
copyRecursiveSync(path.join(rootDir, 'admin-server', 'dist'), path.join(adminStage, 'dist'));
copyRecursiveSync(path.join(rootDir, 'admin-server', 'prisma'), path.join(adminStage, 'prisma'));
const adminPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'admin-server', 'package.json'), 'utf8'));
const adminProdPkg = {
  name: 'natures-mud-admin-server',
  version: '1.0.0',
  main: 'dist/index.js',
  scripts: {
    start: 'node dist/index.js',
    "prisma:generate": "prisma generate",
    "prisma:deploy": "prisma migrate deploy",
    "seed": "node dist/seeders/run.js"
  },
  dependencies: adminPkg.dependencies
};
fs.writeFileSync(path.join(adminStage, 'package.json'), JSON.stringify(adminProdPkg, null, 2), 'utf8');
if (fs.existsSync(path.join(rootDir, 'admin-server', 'package-lock.json'))) {
  fs.copyFileSync(path.join(rootDir, 'admin-server', 'package-lock.json'), path.join(adminStage, 'package-lock.json'));
}
if (fs.existsSync(path.join(rootDir, 'admin-server', '.env.production'))) {
  fs.copyFileSync(path.join(rootDir, 'admin-server', '.env.production'), path.join(adminStage, '.env'));
}

// --- PACKAGE 3: Laravel Backend ---
console.log('  -> Assembling Laravel Backend package...');
const backendFolders = ['app', 'bootstrap', 'config', 'database', 'public', 'resources', 'routes', 'storage'];
backendFolders.forEach(f => {
  copyRecursiveSync(path.join(rootDir, 'backend', f), path.join(backendStage, f), ['.git', 'node_modules', 'cache']);
});
const backendFiles = ['artisan', 'composer.json', 'composer.phar'];
backendFiles.forEach(f => {
  const p = path.join(rootDir, 'backend', f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(backendStage, f));
});
if (fs.existsSync(path.join(rootDir, 'backend', '.env.production'))) {
  fs.copyFileSync(path.join(rootDir, 'backend', '.env.production'), path.join(backendStage, '.env'));
}
// Ensure Laravel directory structure exists
const laravelDirs = [
  'storage/framework/cache/data',
  'storage/framework/sessions',
  'storage/framework/views',
  'storage/framework/testing',
  'storage/logs',
  'storage/app/public',
  'bootstrap/cache'
];
laravelDirs.forEach(dir => {
  const fullPath = path.join(backendStage, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});
// Create root .htaccess to route to public/
const backendHtaccess = `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
`;
fs.writeFileSync(path.join(backendStage, '.htaccess'), backendHtaccess, 'utf8');

// 4. Create ZIPs
console.log('\n[4/4] Creating ZIP archives...');
const zips = [
  { src: frontendStage, out: path.join(rootDir, 'naturesmud-frontend.zip'), name: 'Frontend (Next.js 15)' },
  { src: adminStage, out: path.join(rootDir, 'naturesmud-admin.zip'), name: 'Admin Server (Node.js API)' },
  { src: backendStage, out: path.join(rootDir, 'naturesmud-backend.zip'), name: 'Backend API (Laravel 11)' },
];

for (const z of zips) {
  if (fs.existsSync(z.out)) fs.unlinkSync(z.out);
  console.log(`  Compressing ${path.basename(z.out)}...`);
  try {
    execSync(`tar -a -c -f "${z.out}" -C "${z.src}" .`, { stdio: 'inherit' });
  } catch (err) {
    execSync(`powershell -Command "Compress-Archive -Path '${z.src}\\*' -DestinationPath '${z.out}' -Force"`, { stdio: 'inherit' });
  }
  const stats = fs.statSync(z.out);
  console.log(`  ✅ ${z.name} -> ${path.basename(z.out)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

console.log('\n============================================================');
console.log('🎉 ALL PACKAGES CREATED SUCCESSFULLY FOR NEST NEPAL HOSTING!');
console.log('============================================================\n');
