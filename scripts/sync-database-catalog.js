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

// Remove dried-figs or old mismatched records and off-topic blog posts
$pdo->exec("DELETE FROM products WHERE slug IN ('dried-figs', 'premium-coconut-oil', 'flaxseed-crackers') OR id = 160");
try {
    $pdo->exec("DELETE FROM blogs WHERE slug IN (
        'could-another-flood-happen-nepal-new-glacial-lake-explained',
        'nepal-hydropower-crisis-after-flood-which-projects-damaged',
        'what-happened-gyirong-port-nepal-china-border-disaster-explained',
        'august-2026-nepal-glacier-avalanche-bhotekoshi-trishuli-flood'
    )");
} catch (Exception $e) {}


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

    // Check if product exists by slug
    $existing = $pdo->prepare("SELECT id FROM products WHERE slug = :slug LIMIT 1");
    $existing->execute(['slug' => $slug]);
    $row = $existing->fetch();

    if ($row) {
        // Ensure canonical catalog product is active in MySQL
        $upd = $pdo->prepare("UPDATE products SET is_active = 1 WHERE id = :id");
        $upd->execute(['id' => $row['id']]);
        try {
            $updDel = $pdo->prepare("UPDATE products SET deleted_at = NULL WHERE id = :id");
            $updDel->execute(['id' => $row['id']]);
        } catch (Exception $e) {}
    } else {
        $stmt = $pdo->prepare("INSERT INTO products 
            (name, slug, category_id, sku, price, compare_at_price, cost_price, stock_quantity, weight, unit, images, short_description, description, is_active, is_featured, is_best_seller, rating_avg, rating_count, created_at, updated_at) 
            VALUES 
            (:name, :slug, :category_id, :sku, :price, :compare_at_price, :cost_price, :stock_quantity, :weight, :unit, :images, :short_description, :description, 1, 1, 1, 4.9, 50, NOW(), NOW())");
        $stmt->execute([
            'name' => $p['name'],
            'slug' => $slug,
            'category_id' => $catId,
            'sku' => 'NM-' . strtoupper(str_replace('-', '_', $slug)),
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
}

// NOTE: Never deactivate other products! Products created in Admin Panel must remain active.

echo json_encode([
    'success' => true,
    'message' => "Successfully synchronized {$upsertCount} products from master catalog into MySQL database matching exact slugs!",
    'timestamp' => date('Y-m-d H:i:s')
]);
`;

async function main() {
  const localPhpPath = path.join(__dirname, '..', 'scratch', 'sync_db_catalog.php');
  fs.mkdirSync(path.dirname(localPhpPath), { recursive: true });
  fs.writeFileSync(localPhpPath, phpScript, 'utf8');

  console.log('1. Uploading sync_db_catalog.php to API backend...');
  const remotePhpPath = '/api.naturesmud.shop/public/sync_db_catalog.php';
  await uploadFileFtp(localPhpPath, remotePhpPath);
  console.log('   Uploaded successfully.');

  console.log('2. Triggering database sync via HTTPS...');
  const res = await callHttps('api.naturesmud.shop', '/sync_db_catalog.php');
  console.log('   Response status:', res.status);
  console.log('   Response data:', JSON.stringify(res.data, null, 2));

  console.log('3. Cleaning up temporary remote script...');
  await removeFileFtp(remotePhpPath);
  console.log('   Cleaned up successfully.');
}

main().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
