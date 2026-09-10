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
  console.log('🚀 NATURE\'S MUD PRODUCTION LIVE DEPLOYMENT PIPELINE');
  console.log('====================================================\n');

  // 1. Verify local BUILD_ID
  const localBuildIdPath = path.join(config.rootDir, '.next', 'BUILD_ID');
  if (!fs.existsSync(localBuildIdPath)) {
    throw new Error('.next/BUILD_ID not found. Run npm run build first!');
  }
  const localBuildId = fs.readFileSync(localBuildIdPath, 'utf8').trim();
  console.log(`[1/5] 🔍 Local compiled BUILD_ID: ${localBuildId}`);

  // 2. Package .next into zip
  console.log('\n[2/5] 📦 Packaging slim .next build into zip...');
  const zipPath = path.join(config.rootDir, 'frontend-build-update.zip');
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    // Add server & static directories
    archive.directory(path.join(config.rootDir, '.next', 'server'), '.next/server');
    archive.directory(path.join(config.rootDir, '.next', 'static'), '.next/static');
    if (fs.existsSync(path.join(config.rootDir, '.next', 'types'))) {
      archive.directory(path.join(config.rootDir, '.next', 'types'), '.next/types');
    }

    // Add root manifest files in .next
    const nextRootFiles = fs.readdirSync(path.join(config.rootDir, '.next'));
    nextRootFiles.forEach((f) => {
      const full = path.join(config.rootDir, '.next', f);
      if (fs.statSync(full).isFile()) {
        archive.file(full, { name: '.next/' + f });
      }
    });

    archive.finalize();
  });

  const stats = fs.statSync(zipPath);
  console.log(`✅ Package created: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  // 3. FTP Upload
  console.log('\n[3/5] 🌐 Connecting via FTP and uploading archive to Nest Nepal...');
  const client = new ftp.Client();
  client.timeout = 180000;
  client.ftp.verbose = false;

  await client.access({
    host: config.host,
    user: config.username,
    password: config.password,
    secure: false
  });
  console.log('✅ FTP Connected!');

  console.log('  -> Uploading frontend-build-update.zip to /naturesmud.shop/ ...');
  await client.uploadFrom(zipPath, '/naturesmud.shop/frontend-build-update.zip');
  console.log('✅ Zip Upload completed!');

  // Upload magazine catalog PDFs directly to public directory
  const pdfs = [
    'Nature_Mud_Product_Catalog.pdf',
    'catalog.pdf',
    'Nature_Mud_Magazine_Catalog.pdf'
  ];
  for (const pdf of pdfs) {
    const localPdfPath = path.join(config.rootDir, 'public', pdf);
    if (fs.existsSync(localPdfPath)) {
      console.log(`  -> Uploading ${pdf} (${(fs.statSync(localPdfPath).size / 1024 / 1024).toFixed(2)} MB) to /naturesmud.shop/public/ ...`);
      await client.uploadFrom(localPdfPath, `/naturesmud.shop/public/${pdf}`);
      console.log(`  ✅ ${pdf} uploaded successfully!`);
    }
  }

  // 4. Create and upload PHP extractor
  console.log('\n[4/5] ⚙️ Uploading PHP extraction & Passenger restart helper...');
  const phpScript = `<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

$home = '${config.homeDir}';
$destDir = $home . '/naturesmud.shop';
$zipFile = $destDir . '/frontend-build-update.zip';

if (!file_exists($zipFile)) {
    echo json_encode(['success' => false, 'error' => 'Zip file not found: ' . $zipFile]);
    exit;
}

$zip = new ZipArchive();
if ($zip->open($zipFile) !== TRUE) {
    echo json_encode(['success' => false, 'error' => 'Could not open zip archive']);
    exit;
}

$zip->extractTo($destDir);
$zip->close();
@unlink($zipFile);

function chmod_r($path) {
    if (!is_dir($path)) return;
    $dir = new DirectoryIterator($path);
    foreach ($dir as $item) {
        if ($item->isDot()) continue;
        if ($item->isDir()) {
            chmod($item->getPathname(), 0755);
            chmod_r($item->getPathname());
        } else {
            chmod($item->getPathname(), 0644);
        }
    }
}

chmod_r($destDir . '/.next');

// Restart Phusion Passenger
$restartFile = $destDir . '/tmp/restart.txt';
if (!file_exists(dirname($restartFile))) {
    mkdir(dirname($restartFile), 0755, true);
}
file_put_contents($restartFile, date('Y-m-d H:i:s'));
chmod($restartFile, 0644);

// Check server BUILD_ID
$buildIdFile = $destDir . '/.next/BUILD_ID';
$serverBuildId = file_exists($buildIdFile) ? trim(file_get_contents($buildIdFile)) : 'unknown';

echo json_encode([
    'success' => true,
    'message' => 'Frontend updated and Passenger restarted successfully',
    'server_build_id' => $serverBuildId,
    'restarted_at' => date('c')
], JSON_PRETTY_PRINT);
`;

  const localPhp = path.join(config.rootDir, 'scripts', 'deploy_helper.php');
  fs.writeFileSync(localPhp, phpScript, 'utf8');

  await client.uploadFrom(localPhp, '/api.naturesmud.shop/public/deploy_helper.php');
  console.log('✅ Helper uploaded to /api.naturesmud.shop/public/deploy_helper.php');

  // Trigger helper via HTTPS
  console.log('  -> Executing extraction on live server via https://api.naturesmud.shop/deploy_helper.php ...');
  const extractResult = await new Promise((resolve, reject) => {
    https.get('https://api.naturesmud.shop/deploy_helper.php', { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data });
        }
      });
    }).on('error', reject);
  });

  console.log('Extract Result:', extractResult);

  // Clean remote helper & local temp files
  try {
    await client.remove('/api.naturesmud.shop/public/deploy_helper.php');
    console.log('✅ Remote helper cleaned up');
  } catch (e) {
    console.warn('Could not remove remote helper:', e.message);
  }
  client.close();

  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  if (fs.existsSync(localPhp)) fs.unlinkSync(localPhp);

  // 5. Live Verification
  console.log('\n[5/5] 🧪 Verifying live server response...');
  if (extractResult.server_build_id === localBuildId) {
    console.log(`🎉 MATCH CONFIRMED! Server BUILD_ID is now: ${extractResult.server_build_id}`);
  } else {
    console.warn(`⚠️ Warning: Server reported BUILD_ID ${extractResult.server_build_id}, expected ${localBuildId}`);
  }

  // Wait 6 seconds for Passenger to recycle worker
  console.log('  -> Waiting 6 seconds for Phusion Passenger to spawn new Node worker...');
  await new Promise(r => setTimeout(r, 6000));

  const checkLiveCatalog = await new Promise((resolve) => {
    https.get('https://naturesmud.shop/catalog', { rejectUnauthorized: false }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, bodyLength: body.length }));
    }).on('error', e => resolve({ error: e.message }));
  });
  console.log('  -> Live https://naturesmud.shop/catalog status:', checkLiveCatalog.status, `(length: ${checkLiveCatalog.bodyLength})`);

  const checkDownloadApi = await new Promise((resolve) => {
    https.get('https://naturesmud.shop/api/catalog/download', { rejectUnauthorized: false }, (res) => {
      let len = 0;
      res.on('data', c => len += c.length);
      res.on('end', () => resolve({
        status: res.statusCode,
        contentType: res.headers['content-type'],
        contentDisposition: res.headers['content-disposition'],
        bytesReceived: len
      }));
    }).on('error', e => resolve({ error: e.message }));
  });
  console.log('  -> Live /api/catalog/download status:', checkDownloadApi.status, `Content-Type: ${checkDownloadApi.contentType}, Bytes: ${checkDownloadApi.bytesReceived}`);

  const checkDirectPdf = await new Promise((resolve) => {
    https.get('https://naturesmud.shop/Nature_Mud_Product_Catalog.pdf', { rejectUnauthorized: false }, (res) => {
      let len = 0;
      res.on('data', c => len += c.length);
      res.on('end', () => resolve({
        status: res.statusCode,
        contentType: res.headers['content-type'],
        bytesReceived: len
      }));
    }).on('error', e => resolve({ error: e.message }));
  });
  console.log('  -> Live /Nature_Mud_Product_Catalog.pdf status:', checkDirectPdf.status, `Bytes: ${checkDirectPdf.bytesReceived} (${(checkDirectPdf.bytesReceived / 1024 / 1024).toFixed(2)} MB)`);

  console.log('\n====================================================');
  console.log('✨ DEPLOYMENT TO LIVE SERVER FINISHED SUCCESSFULLY!');
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('❌ Deployment failed:', err);
  process.exit(1);
});
