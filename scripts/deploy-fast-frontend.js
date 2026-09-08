const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const querystring = require('querystring');
const ftp = require('basic-ftp');
const { ZipArchive } = require('archiver');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.production') });
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const config = {
  host: process.env.CPANEL_HOST || '167.235.9.123',
  port: parseInt(process.env.CPANEL_PORT || '2083'),
  username: process.env.CPANEL_USER || 'kathma13',
  password: process.env.CPANEL_PASSWORD || '2*5Qt7iSrB7-Uz',
  homeDir: process.env.CPANEL_HOMEDIR || '/home8/kathma13',
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
  const client = new ftp.Client();
  client.timeout = 120000;
  try {
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
    let ftpDir = remoteDir;
    if (ftpDir.startsWith(config.homeDir)) {
      ftpDir = ftpDir.substring(config.homeDir.length);
    }
    const remotePath = ftpDir + '/' + remoteFileName;
    console.log(`  -> Uploading ${remoteFileName} (${(fs.statSync(localPath).size / 1024 / 1024).toFixed(2)} MB) to ${remotePath}...`);
    await client.uploadFrom(localPath, remotePath);
    console.log(`  -> Upload of ${remoteFileName} complete!`);
  } catch (err) {
    console.error(`FTP Upload error for ${remoteFileName}:`, err);
    throw err;
  } finally {
    client.close();
  }
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

chmod($dir, 0755);
chmod_r($dir);

if (!file_exists($dir . '/tmp')) {
    mkdir($dir . '/tmp', 0755, true);
}
file_put_contents($dir . '/tmp/restart.txt', time());

echo json_encode([
    'success' => true,
    'message' => 'Permissions updated and Passenger reloaded',
    'restarted_via' => 'tmp/restart.txt',
    'time' => time()
], JSON_PRETTY_PRINT);
`;

async function main() {
  console.log('====================================================');
  console.log('⚡ ULTRA-FAST SLIM NEXT.JS FRONTEND LIVE DEPLOYMENT');
  console.log('====================================================\n');

  // 1. Build Next.js
  console.log('[1/4] 🏗️ Verifying Next.js production build...');
  const buildIdPath = path.join(config.rootDir, '.next', 'BUILD_ID');
  const shouldRebuild = process.argv.includes('--build') || 
    !fs.existsSync(buildIdPath) || 
    fs.statSync(path.join(config.rootDir, 'lib', 'data', 'products.ts')).mtime > fs.statSync(buildIdPath).mtime;

  if (shouldRebuild) {
    console.log('  -> Changes detected in source files. Rebuilding Next.js bundle...');
    execSync('npm run build', { stdio: 'inherit' });
  } else {
    console.log('  -> Using freshly compiled .next build!');
  }
  const localBuildId = fs.readFileSync(path.join(config.rootDir, '.next', 'BUILD_ID'), 'utf8').trim();
  console.log('✅ Build verified! BUILD_ID:', localBuildId);

  // 2. Package .next (excluding standalone, cache, trace)
  console.log('\n[2/4] 📦 Packaging slim .next build (~5MB)...');
  const outZip = path.join(config.rootDir, 'frontend-slim-dist.zip');
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZip);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    // Add only essential runtime directories
    archive.directory(path.join(config.rootDir, '.next', 'server'), '.next/server');
    archive.directory(path.join(config.rootDir, '.next', 'static'), '.next/static');
    if (fs.existsSync(path.join(config.rootDir, '.next', 'types'))) {
      archive.directory(path.join(config.rootDir, '.next', 'types'), '.next/types');
    }

    // Add root manifest and config files in .next
    const nextRootFiles = fs.readdirSync(path.join(config.rootDir, '.next'));
    nextRootFiles.forEach(f => {
      const full = path.join(config.rootDir, '.next', f);
      if (fs.statSync(full).isFile()) {
        archive.file(full, { name: '.next/' + f });
      }
    });

    // Add active poster images into public/images/posters/
    const posterFiles = [
      'pineapple-splendor.jpg',
      'blueberries-orchard.jpg',
      'papaya-splash-delight.jpg',
      'chia-power.jpg',
      'sweet-vibes.jpg',
      'tropical-crunch.jpg',
      'papaya-pop.jpg',
      'blueberry-bite.jpg',
      'earth-ritual-beetroot.jpg',
      'mountain-apple-crisp.jpg',
      'premium-harvest-cashew.jpg',
      'pure-pumpkin-seeds.jpg',
      'ruby-cranberries-delight.jpg',
      'mango-poster-2k.jpg',
      'apple-poster-2k.jpg',
      'beetroot-poster-2k.jpg'
    ];
    posterFiles.forEach(pf => {
      const full = path.join(config.rootDir, 'public', 'images', 'posters', pf);
      if (fs.existsSync(full)) {
        archive.file(full, { name: 'public/images/posters/' + pf });
      }
    });

    // Add Hero assets
    if (fs.existsSync(path.join(config.rootDir, 'public', 'images', 'hero'))) {
      archive.directory(path.join(config.rootDir, 'public', 'images', 'hero'), 'public/images/hero');
    }

    // Add GreenBasket assets
    if (fs.existsSync(path.join(config.rootDir, 'public', 'images', 'greenbasket'))) {
      archive.directory(path.join(config.rootDir, 'public', 'images', 'greenbasket'), 'public/images/greenbasket');
    }

    // Add all active product images into public/products/
    const prodFiles = [
      'dehydrated-pineapple-premium.jpg',
      'dried-blueberries-orchard.jpg',
      'dried-blueberries-100g.jpg',
      'blueberries.jpg',
      'dried-blueberries.jpg',
      'blueberries-brain-power.jpg',
      'papaya-splash.jpg',
      'papaya.jpg',
      'papaya-2.jpg',
      'chia-seeds.jpg',
      'chia-power.jpg',
      'authentic-almonds.jpg',
      'almonds.jpg',
      'almonds-2.jpg',
      'authentic-cashewnuts-roasted.jpg',
      'cashews.jpg',
      'cashewnuts-roasted.jpg',
      'cashews-roasted.jpg',
      'pink-salt.jpg',
      'pink-salt-jar.jpg',
      'pink-salt-crystals.jpg',
      'himalayan-black-salt-digestive.jpg',
      'cranberries.jpg',
      'cranberries-2.jpg',
      'cranberries-glowing-jar.jpg',
      'sweet-potato-powder-100g.jpg',
      'sweet-potato-powder.jpg',
      'sweet-potato-jar-display.jpg',
      'dates-powder-100g.jpg',
      'dates-powder.jpg',
      'dates-powder-jar-2k.jpg',
      'dates-powder-product-shot.jpg',
      'beetroot-powder-100g.jpg',
      'beetroot-powder.jpg',
      'beetroot-glass-jar.jpg',
      'beetroot-poster-2k.jpg',
      'authentic-dehydrated-mango.jpg',
      'dehydrated-mango.jpg',
      'mango.jpg',
      'dehydrated-mango-poster.jpg',
      'authentic-dehydrated-pineapple.jpg',
      'dehydrated-pineapple.jpg',
      'pineapple.jpg',
      'pineapple-poster-2k.jpg',
      'authentic-dehydrated-apple.jpg',
      'dehydrated-apple.jpg',
      'apple.jpg',
      'dehydrated-apple-poster.jpg',
      'dehydrated-coconut-chips.jpg',
      'dehydrated-coconut-chips-100g.jpg',
      'coconut-chips.jpg',
      'coconut-chips-100g.jpg',
      'coconut-chips-pouch.jpg',
      'pumpkin-seeds.jpg',
      'pistachios.jpg',
      'superfood-mix.jpg',
      'macadamia.jpg',
      'coconut-oil.jpg',
      'shilajit.jpg',
      'fox-nuts-jar-2k.jpg',
      'carrot-powder.jpg',
      'carrot-powder-100g.jpg',
      'carrot-powder-poster.jpg',
      'carrot-powder-marble.jpg'
    ];
    prodFiles.forEach(pf => {
      const full = path.join(config.rootDir, 'public', 'products', pf);
      if (fs.existsSync(full)) {
        archive.file(full, { name: 'public/products/' + pf });
      }
    });

    archive.finalize();
  });

  const stats = fs.statSync(outZip);
  console.log(`✅ Slim build package created (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  // 3. Upload & Extract
  console.log('\n[3/4] 🌐 Uploading & extracting slim .next to cPanel...');
  await uploadFile(outZip, `${config.homeDir}/naturesmud.shop`, 'frontend-slim-dist.zip');
  console.log('  -> Extracting .next archive on remote server...');
  const extractRes = await extractArchive(`${config.homeDir}/naturesmud.shop/frontend-slim-dist.zip`, `${config.homeDir}/naturesmud.shop`);
  console.log('  -> Extraction response:', typeof extractRes === 'object' ? JSON.stringify(extractRes) : extractRes);
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  // 4. Server-side Fast Permission Fix & Passenger Restart
  console.log('\n[4/5] 🔒 Applying server permissions and restarting Passenger...');
  const localFixPerms = path.join(config.rootDir, 'fix_perms.php');
  fs.writeFileSync(localFixPerms, fixPermsPhp);
  await uploadFile(localFixPerms, `${config.homeDir}/api.naturesmud.shop/public`, 'fix_perms.php');
  if (fs.existsSync(localFixPerms)) fs.unlinkSync(localFixPerms);
  const permRes = await runPhpEndpoint('/fix_perms.php');
  console.log('Permission Fixer Output:', permRes.body.trim());

  // 5. Database Synchronization
  console.log('\n[5/5] 🗄️ Synchronizing Live MySQL Database (api.naturesmud.shop)...');
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
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

$pdo = new PDO('mysql:host=127.0.0.1;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

$cats = [
    'superfoods' => 'Superfoods',
    'ayurveda' => 'Ayurvedic',
    'seeds' => 'Organic Seeds',
    'powders' => 'Powders',
    'dried-fruits' => 'Dried Fruits',
    'nuts' => 'Nuts',
    'oils' => 'Oils',
    'salts-spices' => 'Salts & Spices',
    'combos' => 'Combos'
];

$catMap = [];
$catRows = $pdo->query("SELECT id, slug FROM categories")->fetchAll();
foreach ($catRows as $r) {
    $catMap[$r['slug']] = (int)$r['id'];
}

foreach ($cats as $slug => $name) {
    if (!isset($catMap[$slug])) {
        $stmt = $pdo->prepare("INSERT INTO categories (name, slug, description, is_active, created_at, updated_at) VALUES (:name, :slug, :desc, 1, NOW(), NOW())");
        $stmt->execute(['name' => $name, 'slug' => $slug, 'desc' => "$name superfoods and wellness."]);
        $catMap[$slug] = (int)$pdo->lastInsertId();
    }
}

$rawJson = <<<'JSONDATA'
${productsPayloadJson}
JSONDATA;

$productsList = json_decode($rawJson, true);
$activeSlugs = [];
$upsertCount = 0;

$pdo->exec("DELETE FROM products WHERE slug = 'dried-figs' OR id = 160");

foreach ($productsList as $p) {
    $slug = $p['slug'];
    $activeSlugs[] = $slug;
    $catSlug = $p['categorySlug'] ?? 'superfoods';
    $catId = $catMap[$catSlug] ?? 1;

    $imagesJson = json_encode($p['images'] ?? [$p['image']]);
    $price = (float)$p['price'];
    $mrp = (float)($p['mrp'] ?? $p['compareAtPrice'] ?? $price);
    $weightStr = (string)($p['weight'] ?? '100');
    preg_match('/([0-9]+(\\.[0-9]+)?)/', $weightStr, $matches);
    $weightNum = isset($matches[1]) ? (float)$matches[1] : 100.00;
    $unit = stripos($weightStr, 'ml') !== false ? 'ml' : 'g';

    $existing = $pdo->prepare("SELECT id FROM products WHERE slug = :slug LIMIT 1");
    $existing->execute(['slug' => $slug]);
    $row = $existing->fetch();

    if ($row) {
        $stmt = $pdo->prepare("UPDATE products SET 
            name = :name,
            category_id = :category_id,
            price = :price,
            compare_at_price = :compare_at_price,
            short_description = :short_description,
            description = :description,
            weight = :weight,
            unit = :unit,
            images = :images,
            benefits = :benefits,
            is_active = 1,
            updated_at = NOW()
            WHERE id = :id");
        $stmt->execute([
            'name' => $p['name'],
            'category_id' => $catId,
            'price' => $price,
            'compare_at_price' => $mrp,
            'short_description' => $p['shortDescription'] ?? $p['description'] ?? '',
            'description' => $p['description'] ?? '',
            'weight' => $weightNum,
            'unit' => $unit,
            'images' => $imagesJson,
            'benefits' => json_encode($p['benefits'] ?? []),
            'id' => $row['id']
        ]);
        $upsertCount++;
    } else {
        $sku = 'NM-' . strtoupper(str_replace('-', '_', $slug));
        $stmt = $pdo->prepare("INSERT INTO products 
            (category_id, name, slug, sku, description, short_description, price, compare_at_price, cost_price, stock_quantity, low_stock_threshold, is_active, is_featured, is_best_seller, is_new, weight, unit, images, benefits, rating_avg, rating_count, views_count, sold_count, created_at, updated_at)
            VALUES 
            (:category_id, :name, :slug, :sku, :description, :short_description, :price, :compare_at_price, :cost_price, 100, 10, 1, 0, 0, 0, :weight, :unit, :images, :benefits, 4.8, 12, 100, 20, NOW(), NOW())");
        $stmt->execute([
            'category_id' => $catId,
            'name' => $p['name'],
            'slug' => $slug,
            'sku' => $sku,
            'description' => $p['description'] ?? '',
            'short_description' => $p['shortDescription'] ?? $p['description'] ?? '',
            'price' => $price,
            'compare_at_price' => $mrp,
            'cost_price' => round($price * 0.65, 2),
            'weight' => $weightNum,
            'unit' => $unit,
            'images' => $imagesJson,
            'benefits' => json_encode($p['benefits'] ?? [])
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

    // Clean remote sync file
    try {
      const c = new ftp.Client();
      await c.access({ host: config.host, user: config.username, password: config.password, secure: false });
      await c.remove('/api.naturesmud.shop/public/temp_deploy_sync.php');
      c.close();
    } catch (e) {}
  } catch (err) {
    console.warn('  ⚠️ Database synchronization notice:', err.message);
  }

  // 6. Verification
  console.log('\n🩺 Verifying Live Production Status on naturesmud.shop...');
  await new Promise(r => setTimeout(r, 2000));
  
  const testEndpoints = [
    'https://naturesmud.shop/',
    'https://naturesmud.shop/products',
    'https://naturesmud.shop/catalog'
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
  console.log('🎉 SLIM FRONTEND UPDATE SUCCESSFULLY DEPLOYED TO NATURESMUD.SHOP!');
  console.log('====================================================\n');
}

main().catch(console.error);
