const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDeploy = path.join(rootDir, 'cpanel-deploy');

console.log('=== Nature\'s Mud — Packaging for cPanel + Vercel (naturesmud.shop) ===');

// 1. Build Admin Server TypeScript first
console.log('\n[1/3] Building fresh Admin Server (TypeScript -> JavaScript)...');
try {
  execSync('npm --prefix admin-server run build', { cwd: rootDir, stdio: 'inherit' });
} catch (e) {
  console.error('Failed to build admin-server:', e.message);
}

// Clean & recreate deploy folder
if (fs.existsSync(distDeploy)) {
  fs.rmSync(distDeploy, { recursive: true, force: true });
}
fs.mkdirSync(path.join(distDeploy, 'admin-server'), { recursive: true });
fs.mkdirSync(path.join(distDeploy, 'backend'), { recursive: true });

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      if (['.git', 'node_modules', 'vendor', '.next', 'cache'].some(ignore => file === ignore)) continue;
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('\n[2/3] Preparing Admin Server package...');
const adminFiles = ['package.json', 'package-lock.json'];
adminFiles.forEach(f => {
  const p = path.join(rootDir, 'admin-server', f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(distDeploy, 'admin-server', f));
});
if (fs.existsSync(path.join(rootDir, 'admin-server', '.env.production'))) {
  fs.copyFileSync(path.join(rootDir, 'admin-server', '.env.production'), path.join(distDeploy, 'admin-server', '.env'));
}
copyRecursive(path.join(rootDir, 'admin-server', 'dist'), path.join(distDeploy, 'admin-server', 'dist'));
copyRecursive(path.join(rootDir, 'admin-server', 'prisma'), path.join(distDeploy, 'admin-server', 'prisma'));

console.log('\n[3/3] Preparing Laravel Backend package...');
const backendFolders = ['app', 'bootstrap', 'config', 'database', 'public', 'resources', 'routes', 'storage'];
backendFolders.forEach(f => {
  copyRecursive(path.join(rootDir, 'backend', f), path.join(distDeploy, 'backend', f));
});
const backendFiles = ['artisan', 'composer.json', 'composer.phar'];
backendFiles.forEach(f => {
  const p = path.join(rootDir, 'backend', f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(distDeploy, 'backend', f));
});
if (fs.existsSync(path.join(rootDir, 'backend', '.env.production'))) {
  fs.copyFileSync(path.join(rootDir, 'backend', '.env.production'), path.join(distDeploy, 'backend', '.env'));
}

// Ensure necessary Laravel cache & log directories exist
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
  const fullPath = path.join(distDeploy, 'backend', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

console.log('\nGenerating ZIP packages for cPanel...');
const zips = [
  { src: path.join(distDeploy, 'backend'), out: path.join(rootDir, 'naturesmud-backend.zip') },
  { src: path.join(distDeploy, 'admin-server'), out: path.join(rootDir, 'naturesmud-admin.zip') },
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
  console.log(`  -> Created ${path.basename(z.out)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

console.log('\n============================================================');
console.log('✅ CPANEL PACKAGES READY:');
console.log('1. naturesmud-backend.zip  -> Upload to cPanel (api.naturesmud.shop)');
console.log('2. naturesmud-admin.zip    -> Upload to cPanel (admin-api.naturesmud.shop)');
console.log('3. Frontend (Next.js)      -> Deploy directly to Vercel via GitHub!');
console.log('============================================================\n');
