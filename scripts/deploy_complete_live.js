const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('archiver');

const config = {
  host: '167.235.9.123',
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13',
  rootDir: path.resolve(__dirname, '..')
};

async function main() {
  console.log('====================================================');
  console.log('🚀 NATURE\'S MUD FAST & COMPLETE LIVE DEPLOYMENT');
  console.log('====================================================\n');

  const localBuildId = fs.readFileSync(path.join(config.rootDir, '.next', 'BUILD_ID'), 'utf8').trim();
  console.log(`[1/5] 🔍 Local compiled BUILD_ID: ${localBuildId}`);

  // 1. Package slim .next build (server, static, manifests)
  console.log('\n[2/5] 📦 Creating slim frontend-build-update.zip (~4.5 MB)...');
  const zipPath = path.join(config.rootDir, 'frontend-build-update.zip');
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    archive.directory(path.join(config.rootDir, '.next', 'server'), '.next/server');
    archive.directory(path.join(config.rootDir, '.next', 'static'), '.next/static');
    if (fs.existsSync(path.join(config.rootDir, '.next', 'types'))) {
      archive.directory(path.join(config.rootDir, '.next', 'types'), '.next/types');
    }

    const nextRootFiles = fs.readdirSync(path.join(config.rootDir, '.next'));
    nextRootFiles.forEach((f) => {
      const full = path.join(config.rootDir, '.next', f);
      if (fs.statSync(full).isFile()) {
        archive.file(full, { name: '.next/' + f });
      }
    });

    archive.finalize();
  });

  const zipStats = fs.statSync(zipPath);
  console.log(`✅ Package created: ${(zipStats.size / 1024 / 1024).toFixed(2)} MB`);

  // 2. FTP Upload
  console.log('\n[3/5] 🌐 Connecting via FTP...');
  const client = new ftp.Client();
  client.timeout = 180000;

  async function connectFtp() {
    if (!client.closed) {
      try { client.close(); } catch(e) {}
    }
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
  }

  async function safeUpload(localPath, remotePath) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        if (client.closed) await connectFtp();
        await client.ensureDir(path.posix.dirname(remotePath));
        await client.uploadFrom(localPath, remotePath);
        return;
      } catch (err) {
        console.warn(`  ⚠️ Retry ${attempt}/3 for ${remotePath}: ${err.message}`);
        try { client.close(); } catch(e) {}
        await new Promise(r => setTimeout(r, 2000));
        await connectFtp();
      }
    }
    throw new Error(`Failed to upload ${remotePath}`);
  }

  await connectFtp();
  console.log('✅ FTP Connected!');

  console.log('  -> Uploading frontend-build-update.zip to /naturesmud.shop/ ...');
  await safeUpload(zipPath, '/naturesmud.shop/frontend-build-update.zip');
  console.log('✅ Build zip uploaded!');

  // Upload new images to root public, standalone public, and public_html
  const targetImages = [
    // Almonds
    'products/nm-almond-jar-v2.jpg',
    'products/nm-almond-jar.jpeg',
    'products/almonds.jpg',
    'products/almonds.jpeg',
    'products/almonds-2.jpg',
    'products/authentic-almonds.jpg',
    'products/almond-jar.jpeg',
    'products/posters/almonds-explosion-2k-v2.jpg',
    'products/posters/almonds-explosion-2k.jpg',
    'products/posters/almonds-surrounded-2k.jpg',
    // Avocado
    'products/avocado-powder-v2.jpg',
    'products/avocado-powder.jpg',
    'products/freeze-dried-avocado-powder.jpg',
    'products/nm-avocado-powder-new.jpg',
    'products/avocado-powder-square.jpg',
    'products/posters/avocado-powder-display-2k-v2.jpg',
    'products/posters/avocado-powder-photoshoot-2k.jpg',
    'products/posters/avocado-powder-scene-1.jpg',
    'products/posters/avocado-powder-display-2k.jpg',
    // Strawberry
    'products/strawberry-powder-v2.jpg',
    'products/strawberry-powder.jpg',
    'products/nm-strawberry-powder-new.jpg',
    'products/strawberry-powder-square.jpg',
    'products/posters/strawberry-powder-berries-2k-v2.jpg',
    'products/posters/strawberry-powder-photoshoot-2k.jpg',
    'products/posters/strawberry-powder-berries-2k.jpg',
    'products/posters/strawberry-powder-roses-2k.jpg',
    // Dehydrated fruits
    'products/authentic-dehydrated-mango.jpg',
    'products/nm-mango-pouch.jpeg',
    'products/dehydrated-mango.jpg'
  ];

  console.log('  -> Syncing new images to /public/, /.next/standalone/public/ & /public_html/ ...');
  for (const relPath of targetImages) {
    const local = path.join(config.rootDir, 'public', relPath);
    if (fs.existsSync(local)) {
      await safeUpload(local, `/naturesmud.shop/public/${relPath}`);
      await safeUpload(local, `/naturesmud.shop/.next/standalone/public/${relPath}`);
      await safeUpload(local, `/public_html/${relPath}`);
      console.log(`     ✅ Synced ${relPath} (${(fs.statSync(local).size / 1024).toFixed(1)} KB)`);
    }
  }

  // 3. Extraction, Dual Sync & Passenger Restart
  console.log('\n[4/5] ⚙️ Uploading dual-target PHP extractor...');
  const phpScript = `<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

$home = '${config.homeDir}';
$destDir = $home . '/naturesmud.shop';
$standaloneDir = $destDir . '/.next/standalone';
$zipFile = $destDir . '/frontend-build-update.zip';

if (!file_exists($zipFile)) {
    echo json_encode(['success' => false, 'error' => 'Zip not found']);
    exit;
}

$results = [];

// 1. Extract to root naturesmud.shop/
$out1 = [];
$c1 = 0;
exec("unzip -o " . escapeshellarg($zipFile) . " -d " . escapeshellarg($destDir) . " 2>&1", $out1, $c1);
$results['root_extract'] = ($c1 === 0);

// 2. Extract to standalone/
$out2 = [];
$c2 = 0;
exec("unzip -o " . escapeshellarg($zipFile) . " -d " . escapeshellarg($standaloneDir) . " 2>&1", $out2, $c2);
$results['standalone_extract'] = ($c2 === 0);

@unlink($zipFile);

// 3. Deep clear all caches (root & standalone)
function deleteDir($dir) {
    if (!is_dir($dir)) return;
    $files = array_diff(scandir($dir), ['.', '..']);
    foreach ($files as $file) {
        $target = "$dir/$file";
        is_dir($target) ? deleteDir($target) : @unlink($target);
    }
    @rmdir($dir);
}

deleteDir($destDir . '/.next/cache');
deleteDir($standaloneDir . '/.next/cache');
$results['cache_cleared'] = true;

// 4. Update Database
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Make almond products featured and use v2 images
    $pdo->exec("UPDATE products SET images = '[\"/products/nm-almond-jar-v2.jpg\", \"/products/nm-almond-jar.jpeg\"]', is_featured = 1, is_best_seller = 1 WHERE slug IN ('roasted-almonds', 'raw-himalayan-almonds')");
    // Make avocado & strawberry featured with v2 images
    $pdo->exec("UPDATE products SET images = '[\"/products/avocado-powder-v2.jpg\", \"/products/avocado-powder.jpg\"]', is_featured = 1, is_best_seller = 1 WHERE slug = 'freeze-dried-avocado-powder'");
    $pdo->exec("UPDATE products SET images = '[\"/products/strawberry-powder-v2.jpg\", \"/products/strawberry-powder.jpg\"]', is_featured = 1, is_best_seller = 1 WHERE slug = 'strawberry-powder'");
    // Unfeature dry figs
    $pdo->exec("UPDATE products SET is_featured = 0, is_best_seller = 0 WHERE slug = 'dry-figs-anjeer'");

    $results['db_updated'] = true;
} catch (Exception $e) {
    $results['db_updated'] = false;
    $results['db_error'] = $e->getMessage();
}

// 5. Restart Passenger & kill old next-server
$restartFile = $destDir . '/tmp/restart.txt';
@mkdir(dirname($restartFile), 0755, true);
file_put_contents($restartFile, date('Y-m-d H:i:s'));
@chmod($restartFile, 0644);

$pkillOut = [];
exec("pkill -9 -f next-server 2>&1", $pkillOut);
$results['pkill_output'] = $pkillOut;

// Check standalone BUILD_ID
$buildIdFile = $standaloneDir . '/.next/BUILD_ID';
$serverBuildId = file_exists($buildIdFile) ? trim(file_get_contents($buildIdFile)) : 'unknown';

echo json_encode([
    'success' => true,
    'results' => $results,
    'server_build_id' => $serverBuildId,
    'restarted_at' => date('c')
], JSON_PRETTY_PRINT);
`;

  const localPhp = path.join(config.rootDir, 'scripts', 'deploy_dual_helper.php');
  fs.writeFileSync(localPhp, phpScript, 'utf8');
  await client.uploadFrom(localPhp, '/api.naturesmud.shop/public/deploy_dual_helper.php');

  console.log('  -> Executing extraction via https://api.naturesmud.shop/deploy_dual_helper.php ...');
  const extractResult = await new Promise((resolve, reject) => {
    https.get('https://api.naturesmud.shop/deploy_dual_helper.php', { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve({ raw: data });
        }
      });
    }).on('error', reject);
  });

  console.log('Server response:', JSON.stringify(extractResult, null, 2));

  try {
    await client.remove('/api.naturesmud.shop/public/deploy_dual_helper.php');
  } catch(e) {}

  client.close();
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  if (fs.existsSync(localPhp)) fs.unlinkSync(localPhp);

  // 4. Live Verification
  console.log('\n[5/5] 🧪 Verifying live server response...');
  console.log('  -> Waiting 7 seconds for Phusion Passenger to spawn new Node workers...');
  await new Promise(r => setTimeout(r, 7000));

  const verifyAvoV2 = await new Promise(r => {
    https.get('https://naturesmud.shop/products/avocado-powder-v2.jpg', { rejectUnauthorized: false }, res => {
      r({ status: res.statusCode, size: Number(res.headers['content-length'] || 0) });
    });
  });
  console.log(`  -> Avocado Powder V2 Image: status=${verifyAvoV2.status}, size=${verifyAvoV2.size} bytes (Expected: 245400) ${verifyAvoV2.size === 245400 ? '✅ MATCH' : '❌ MISMATCH'}`);

  const verifyStrawV2 = await new Promise(r => {
    https.get('https://naturesmud.shop/products/strawberry-powder-v2.jpg', { rejectUnauthorized: false }, res => {
      r({ status: res.statusCode, size: Number(res.headers['content-length'] || 0) });
    });
  });
  console.log(`  -> Strawberry Powder V2 Image: status=${verifyStrawV2.status}, size=${verifyStrawV2.size} bytes (Expected: 242460) ${verifyStrawV2.size === 242460 ? '✅ MATCH' : '❌ MISMATCH'}`);

  const verifyAlmondV2 = await new Promise(r => {
    https.get('https://naturesmud.shop/products/nm-almond-jar-v2.jpg', { rejectUnauthorized: false }, res => {
      r({ status: res.statusCode, size: Number(res.headers['content-length'] || 0) });
    });
  });
  console.log(`  -> Almond Jar V2 Image: status=${verifyAlmondV2.status}, size=${verifyAlmondV2.size} bytes (Expected: 174020) ${verifyAlmondV2.size === 174020 ? '✅ MATCH' : '❌ MISMATCH'}`);

  const homepageHtml = await new Promise(r => {
    https.get('https://naturesmud.shop/', { rejectUnauthorized: false }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => r(b));
    });
  });

  const catSectionIdx = homepageHtml.indexOf('Shop by Category');
  const catSectionHtml = catSectionIdx !== -1 ? homepageHtml.substring(catSectionIdx, catSectionIdx + 2000) : '';

  const hasDryFigsInCat = catSectionHtml.includes('dry-figs-anjeer.jpg');
  const hasMangoInCat = catSectionHtml.includes('authentic-dehydrated-mango.jpg');

  console.log(`  -> Dried Fruits Category Card contains dry figs: ${hasDryFigsInCat} ${!hasDryFigsInCat ? '✅ REMOVED' : '❌ STILL PRESENT'}`);
  console.log(`  -> Dried Fruits Category Card contains authentic mango: ${hasMangoInCat} ${hasMangoInCat ? '✅ ACTIVE' : '❌ MISSING'}`);

  console.log('\n====================================================');
  console.log('✨ DUAL DEPLOYMENT COMPLETED!');
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('❌ Deployment error:', err);
  process.exit(1);
});
