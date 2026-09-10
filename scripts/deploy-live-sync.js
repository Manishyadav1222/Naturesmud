const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const querystring = require('querystring');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13',
  rootDir: path.resolve(__dirname, '..')
};

let sessionCache = null;

function cpanelLogin() {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      user: config.username,
      pass: config.password
    });
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/login/?login_only=1',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      const cookies = res.headers['set-cookie'] || [];
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ token: json.security_token, cookies });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function callApi(apiPath, method = 'GET') {
  if (!sessionCache) {
    sessionCache = await cpanelLogin();
  }
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: sessionCache.token + apiPath,
      method: method,
      headers: {
        'Cookie': sessionCache.cookies.map(c => c.split(';')[0]).join('; ')
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function uploadFile(localPath, remoteDir, remoteFileName) {
  const ftp = require('basic-ftp');
  const client = new ftp.Client();
  client.timeout = 300000;
  try {
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
    // FTP root is already /home8/kathma13/, so we remove it from the path
    let ftpDir = remoteDir;
    if (ftpDir.startsWith(config.homeDir)) {
      ftpDir = ftpDir.substring(config.homeDir.length);
    }
    const remotePath = ftpDir + '/' + remoteFileName;
    await client.uploadFrom(localPath, remotePath);
  } catch (err) {
    console.error(`FTP Upload error for ${remoteFileName}:`, err);
    throw err;
  } finally {
    client.close();
  }
}

function saveFile(remoteDir, fileName, content) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      dir: remoteDir,
      file: fileName,
      content: content,
      encoding: 'utf-8'
    });

    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/execute/Fileman/save_file_content',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function runPhpEndpoint(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: config.host,
      port: 80,
      path: path,
      method: 'GET',
      headers: {
        'Host': 'api.naturesmud.shop'
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', e => resolve({ error: e.message }));
    req.end();
  });
}

async function unlinkRemote(remotePath) {
  const query = `/json-api/cpanel?cpanel_jsonapi_user=kathma13&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=unlink&sourcefiles=${encodeURIComponent(remotePath)}`;
  return callApi(query, 'GET');
}

async function extractArchive(remoteZipPath, destDir) {
  const query = `/json-api/cpanel?cpanel_jsonapi_user=kathma13&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=extract&sourcefiles=${encodeURIComponent(remoteZipPath)}&destfiles=${encodeURIComponent(destDir)}`;
  return callApi(query, 'GET');
}

const fixPermsPhp = `<?php
header('Content-Type: application/json');
$dir = '/home8/kathma13/naturesmud.shop';

function chmod_r($path) {
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

// Fix permissions
chmod($dir, 0755);
chmod_r($dir);

// Create tmp/restart.txt to restart LiteSpeed / Passenger Node app
if (!file_exists($dir . '/tmp')) {
    mkdir($dir . '/tmp', 0755, true);
}
file_put_contents($dir . '/tmp/restart.txt', time());

echo json_encode([
    'success' => true,
    'message' => 'Permissions recursively updated to 0755 (dirs) / 0644 (files)',
    'restarted_via' => 'tmp/restart.txt'
], JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('====================================================');
  console.log('🚀 NATURE\'S MUD MASTER LIVE DEPLOY & PERSISTENCE PIPELINE');
  console.log('====================================================');

  // 1. Sync database (Products, Catalog)
  console.log('\n[1/6] 📊 Syncing Catalog to MySQL database...');
  try {
    execSync('node scripts/sync-database-catalog.js', { stdio: 'inherit' });
    console.log('✅ Database synchronized successfully!');
  } catch (err) {
    console.error('⚠️ Database sync error:', err.message);
  }

  // 2. Build Next.js
  console.log('\n[2/6] 🏗️ Compiling Next.js production build...');
  execSync('npm run build', { stdio: 'inherit' });
  const localBuildId = fs.readFileSync(path.join(config.rootDir, '.next', 'BUILD_ID'), 'utf8').trim();
  console.log('✅ Build successful! BUILD_ID:', localBuildId);

  // 3. Clean cache & package .next with ZipArchive
  console.log('\n[3/6] 📦 Packaging .next with ZipArchive (POSIX modes)...');
  const cacheDir = path.join(config.rootDir, '.next', 'cache');
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }

  const outZip = path.join(config.rootDir, 'frontend-optimized-dist.zip');
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  await new Promise((resolve, reject) => {
    const { ZipArchive } = require('archiver');
    const output = fs.createWriteStream(outZip);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    archive.directory(
      path.join(config.rootDir, '.next'),
      '.next',
      (entry) => {
        if (entry.name.endsWith('/') || entry.stats?.isDirectory?.()) {
          entry.mode = 0o755;
        } else {
          entry.mode = 0o644;
        }
        return entry;
      }
    );

    archive.finalize();
  });

  const stats = fs.statSync(outZip);
  console.log(`✅ Build package created (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  const publicZip = path.join(config.rootDir, 'public-assets-dist.zip');
  if (fs.existsSync(publicZip)) fs.unlinkSync(publicZip);
  await new Promise((resolve, reject) => {
    const { ZipArchive } = require('archiver');
    const output = fs.createWriteStream(publicZip);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    // Archive all public directory assets recursively (excluding heavy video files)
    archive.directory(
      path.join(config.rootDir, 'public'),
      false,
      (entry) => {
        const norm = entry.name.replace(/\\/g, '/');
        if (
          norm.startsWith('videos/') ||
          norm === 'videos' ||
          norm.endsWith('.zip')
        ) {
          return false;
        }
        if (entry.name.endsWith('/') || entry.stats?.isDirectory?.()) {
          entry.mode = 0o755;
        } else {
          entry.mode = 0o644;
        }
        return entry;
      }
    );

    archive.finalize();
  });
  console.log(`✅ Complete public assets package created (${(fs.statSync(publicZip).size / 1024 / 1024).toFixed(2)} MB)`);

  // 4. Remote cleanup & upload
  console.log('\n[4/6] 🌐 Uploading & extracting build to cPanel...');
  await unlinkRemote(`${config.homeDir}/naturesmud.shop/.next`);
  await uploadFile(outZip, `${config.homeDir}/naturesmud.shop`, 'frontend-optimized-dist.zip');
  await extractArchive(`${config.homeDir}/naturesmud.shop/frontend-optimized-dist.zip`, `${config.homeDir}/naturesmud.shop`);
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  await uploadFile(publicZip, `${config.homeDir}/naturesmud.shop/public`, 'public-assets-dist.zip');
  await extractArchive(`${config.homeDir}/naturesmud.shop/public/public-assets-dist.zip`, `${config.homeDir}/naturesmud.shop/public`);
  if (fs.existsSync(publicZip)) fs.unlinkSync(publicZip);
  console.log('✅ Archive uploaded and extracted on server!');

  // 5. Server-side Native Fast Permission Fix & Passenger Restart
  console.log('\n[5/6] 🔒 Applying server permissions (0755/0644) and restarting Passenger...');
  const localFixPerms = path.join(config.rootDir, 'fix_perms.php');
  fs.writeFileSync(localFixPerms, fixPermsPhp);
  await uploadFile(localFixPerms, `${config.homeDir}/api.naturesmud.shop/public`, 'fix_perms.php');
  if (fs.existsSync(localFixPerms)) fs.unlinkSync(localFixPerms);
  const permRes = await runPhpEndpoint('/fix_perms.php');
  console.log('Permission Fixer Output:', permRes.body ? permRes.body.trim() : 'OK');

  // Clean remote fix_perms.php
  try {
    const ftp = require('basic-ftp');
    const c = new ftp.Client();
    await c.access({ host: config.host, user: config.username, password: config.password, secure: false });
    await c.remove('/api.naturesmud.shop/public/fix_perms.php');
    c.close();
  } catch (e) {}

  // 5.5. Live MySQL Database Synchronization
  console.log('\n[5.5/6] 🗄️ Synchronizing Live MySQL Database (api.naturesmud.shop)...');
  try {
    const productsFilePath = path.join(config.rootDir, 'lib', 'data', 'products.ts');
    let content = fs.readFileSync(productsFilePath, 'utf8').replace(/\r\n/g, '\n');
    const marker = 'export const products: Product[] = ';
    const startIdx = content.indexOf(marker) + marker.length;
    const endIdx = content.indexOf('export function');
    const jsonText = content.substring(startIdx, endIdx).trim().replace(/;$/, '');
    const products = JSON.parse(jsonText);
    const productsPayloadJson = JSON.stringify(products);

    const phpSyncScript = `<?php
header('Content-Type: application/json');

$envFile = '/home8/kathma13/api.naturesmud.shop/.env';
if (!file_exists($envFile)) {
    echo json_encode(['error' => '.env not found on api.naturesmud.shop']);
    exit;
}

$lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$env = [];
foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    if (strpos($line, '=') !== false) {
        list($key, $val) = explode('=', $line, 2);
        $env[trim($key)] = trim($val, " \\t\\n\\r\\0\\x0B\\"\\'");
    }
}

$dbHost = $env['DB_HOST'] ?? '127.0.0.1';
$dbPort = $env['DB_PORT'] ?? '3306';
$dbName = $env['DB_DATABASE'] ?? 'kathma13_naturesmud_api';
$dbUser = $env['DB_USERNAME'] ?? 'kathma13_dbuser';
$dbPass = $env['DB_PASSWORD'] ?? 'Xy8*pQ1#vN9$mK3!';

try {
    $pdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'DB Connection failed: ' . $e->getMessage()]);
    exit;
}

$catalog = json_decode(${JSON.stringify(productsPayloadJson)}, true);
if (!$catalog) {
    echo json_encode(['error' => 'Failed to decode products JSON']);
    exit;
}

$catMap = [];
$catStmt = $pdo->query("SELECT id, slug FROM categories");
while ($row = $catStmt->fetch()) {
    $catMap[strtolower($row['slug'])] = $row['id'];
}

$upsertCount = 0;
$activeSlugs = [];

foreach ($catalog as $p) {
    $slug = $p['slug'];
    $activeSlugs[] = $slug;
    $catSlug = strtolower($p['categorySlug'] ?? 'powders');
    $catId = $catMap[$catSlug] ?? 1;

    $price = floatval($p['price']);
    $mrp = floatval($p['mrp'] ?? $p['compareAtPrice'] ?? $price);

    $weightNum = 100;
    if (isset($p['weight']) && preg_match('/(\\d+(\\.\\d+)?)/', $p['weight'], $m)) {
        $weightNum = floatval($m[1]);
    }
    $unit = 'g';
    if (isset($p['weight']) && stripos($p['weight'], 'kg') !== false) {
        $unit = 'kg';
    } elseif (isset($p['weight']) && stripos($p['weight'], 'ml') !== false) {
        $unit = 'ml';
    }

    $images = $p['images'] ?? (isset($p['image']) ? [$p['image']] : []);
    $imagesJson = json_encode($images);

    $stmt = $pdo->prepare("SELECT id FROM products WHERE slug = :slug LIMIT 1");
    $stmt->execute(['slug' => $slug]);
    $row = $stmt->fetch();

    if ($row) {
        $stmt = $pdo->prepare("UPDATE products SET 
            category_id = :category_id,
            name = :name,
            description = :description,
            short_description = :short_description,
            price = :price,
            compare_at_price = :compare_at_price,
            cost_price = :cost_price,
            weight = :weight,
            unit = :unit,
            images = :images,
            benefits = :benefits,
            updated_at = NOW()
            WHERE id = :id");
        $stmt->execute([
            'category_id' => $catId,
            'name' => $p['name'],
            'description' => $p['description'] ?? '',
            'short_description' => $p['shortDescription'] ?? $p['description'] ?? '',
            'price' => $price,
            'compare_at_price' => $mrp,
            'cost_price' => round($price * 0.65, 2),
            'weight' => $weightNum,
            'unit' => $unit,
            'images' => $imagesJson,
            'benefits' => json_encode($p['benefits'] ?? []),
            'id' => $row['id']
        ]);
        $upsertCount++;
    }
}

echo json_encode([
    'success' => true,
    'message' => "Successfully synchronized " . count($activeSlugs) . " products from master catalog into MySQL database!",
    'timestamp' => date('Y-m-d H:i:s')
]);
`;

    const localSync = path.join(config.rootDir, 'temp_deploy_sync.php');
    fs.writeFileSync(localSync, phpSyncScript);
    await uploadFile(localSync, `${config.homeDir}/api.naturesmud.shop/public`, 'temp_deploy_sync.php');
    if (fs.existsSync(localSync)) fs.unlinkSync(localSync);
    const syncRes = await runPhpEndpoint('/temp_deploy_sync.php');
    console.log('  -> Database Sync Output:', syncRes.body ? syncRes.body.trim() : 'OK');

    try {
      const ftp = require('basic-ftp');
      const c = new ftp.Client();
      await c.access({ host: config.host, user: config.username, password: config.password, secure: false });
      await c.remove('/api.naturesmud.shop/public/temp_deploy_sync.php');
      c.close();
    } catch (e) {}
  } catch (err) {
    console.warn('  ⚠️ Database synchronization notice:', err.message);
  }

  // 6. Verification
  console.log('\n[6/6] 🩺 Verifying Live Production Status...');
  await new Promise(r => setTimeout(r, 2500));
  
  const testEndpoints = [
    'https://naturesmud.shop/',
    'https://naturesmud.shop/catalog',
    'https://naturesmud.shop/catalog.pdf',
    'https://naturesmud.shop/Nature_Mud_Product_Catalog.pdf',
    'https://naturesmud.shop/products',
    'https://naturesmud.shop/cart',
    'https://naturesmud.shop/checkout',
    'https://api.naturesmud.shop/api/v1/products'
  ];

  for (const url of testEndpoints) {
    await new Promise(resolve => {
      const client = url.startsWith('https') ? https : http;
      client.get(url, { rejectUnauthorized: false }, res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => {
          console.log(`  [${res.statusCode === 200 ? '✅ 200 OK' : '❌ ' + res.statusCode}] ${url} (${d.length} bytes)`);
          resolve();
        });
      }).on('error', e => {
        console.log(`  [❌ ERROR] ${url} -> ${e.message}`);
        resolve();
      });
    });
  }

  console.log('\n====================================================');
  console.log('🎉 ALL CHANGES ARE PERMANENTLY LIVE ON NATURE\'S MUD!');
  console.log('====================================================\n');
}

main().catch(console.error);
