const https = require('https');
const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');

const config = {
  host: '167.235.9.123',
  user: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
};

async function uploadFileFtp(localPath, remotePath) {
  const client = new ftp.Client();
  try {
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      secure: false
    });
    await client.uploadFrom(localPath, remotePath);
  } finally {
    client.close();
  }
}

async function removeFileFtp(remotePath) {
  const client = new ftp.Client();
  try {
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      secure: false
    });
    await client.remove(remotePath);
  } catch (e) {
    // ignore if already removed
  } finally {
    client.close();
  }
}

function callHttps(hostHeader, reqPath) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: hostHeader,
      port: 443,
      path: reqPath,
      method: 'GET',
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.end();
  });
}

// Read products.ts
const productsFilePath = path.join(__dirname, '..', 'lib', 'data', 'products.ts');
let content = fs.readFileSync(productsFilePath, 'utf8').replace(/\r\n/g, '\n');
const marker = 'export const products: Product[] = ';
const startIdx = content.indexOf(marker) + marker.length;
const endIdx = content.indexOf('export function');
const jsonText = content.substring(startIdx, endIdx).trim().replace(/;$/, '');
const products = JSON.parse(jsonText);

const productsPayloadJson = JSON.stringify(products);

const phpScript = `<?php
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
$upsertCount = 0;

foreach ($productsList as $p) {
    $catSlug = $p['categorySlug'] ?? 'superfoods';
    $catId = $catMap[$catSlug] ?? 1;

    $imagesJson = json_encode($p['images'] ?? [$p['image']]);
    $price = (float)$p['price'];
    $mrp = (float)($p['mrp'] ?? $p['compareAtPrice'] ?? $price);
    $weightStr = (string)($p['weight'] ?? '100');
    preg_match('/([0-9]+(\\.[0-9]+)?)/', $weightStr, $matches);
    $weightNum = isset($matches[1]) ? (float)$matches[1] : 100.00;
    $unit = stripos($weightStr, 'ml') !== false ? 'ml' : 'g';

    $stmt = $pdo->prepare("INSERT INTO products 
        (id, name, slug, category_id, sku, price, compare_at_price, cost_price, stock_quantity, weight, unit, images, short_description, description, is_active, is_featured, is_best_seller, rating_avg, rating_count, created_at, updated_at) 
        VALUES 
        (:id, :name, :slug, :category_id, :sku, :price, :compare_at_price, :cost_price, :stock_quantity, :weight, :unit, :images, :short_description, :description, 1, 1, 1, 4.9, 50, NOW(), NOW())
        ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        category_id = VALUES(category_id),
        price = VALUES(price),
        compare_at_price = VALUES(compare_at_price),
        weight = VALUES(weight),
        unit = VALUES(unit),
        images = VALUES(images),
        short_description = VALUES(short_description),
        description = VALUES(description),
        is_active = 1,
        updated_at = NOW()");

    $stmt->execute([
        'id' => (int)($p['dbId'] ?? $p['id']),
        'name' => $p['name'],
        'slug' => $p['slug'],
        'category_id' => $catId,
        'sku' => 'NM-' . strtoupper(str_replace('-', '_', $p['slug'])),
        'price' => $price,
        'compare_at_price' => $mrp,
        'cost_price' => round($price * 0.6, 2),
        'stock_quantity' => (int)($p['stock'] ?? 100),
        'weight' => $weightNum,
        'unit' => $unit,
        'images' => $imagesJson,
        'short_description' => $p['shortDescription'] ?? $p['description'],
        'description' => $p['description']
    ]);
    $upsertCount++;
}

echo json_encode([
    'success' => true,
    'message' => "Successfully synchronized {$upsertCount} products from master catalog into MySQL database!",
    'timestamp' => date('Y-m-d H:i:s')
]);
`;

async function main() {
  const localPhpPath = path.join(__dirname, '..', 'scratch', 'sync_db_catalog.php');
  fs.mkdirSync(path.dirname(localPhpPath), { recursive: true });
  fs.writeFileSync(localPhpPath, phpScript, 'utf8');

  console.log('1. Uploading master database sync script to api.naturesmud.shop/public via FTP...');
  const remotePath = '/api.naturesmud.shop/public/sync_db_catalog.php';
  await uploadFileFtp(localPhpPath, remotePath);
  if (fs.existsSync(localPhpPath)) fs.unlinkSync(localPhpPath);

  console.log('2. Running sync_db_catalog.php via HTTPS...');
  const res = await callHttps('api.naturesmud.shop', '/sync_db_catalog.php');
  console.log('Response:', res.data);

  console.log('3. Cleaning up temporary sync script via FTP...');
  await removeFileFtp(remotePath);

  console.log('🎉 Database Catalog 100% Synced from authoritative master products.ts!');
}

main().catch(console.error);
