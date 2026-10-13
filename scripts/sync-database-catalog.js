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

// Remove dried-figs or old mismatched records, deactivate consolidated premium-pistachios, and remove off-topic blog posts
$pdo->exec("DELETE FROM products WHERE slug IN ('dried-figs', 'premium-coconut-oil', 'flaxseed-crackers') OR id = 160");
$pdo->exec("UPDATE products SET is_active = 0 WHERE slug IN ('premium-pistachios')");
try {
    $pdo->exec("DELETE FROM blogs WHERE slug IN (
        'could-another-flood-happen-nepal-new-glacial-lake-explained',
        'nepal-hydropower-crisis-after-flood-which-projects-damaged',
        'what-happened-gyirong-port-nepal-china-border-disaster-explained',
        'august-2026-nepal-glacier-avalanche-bhotekoshi-trishuli-flood'
    )");
} catch (Exception $e) {}


// Ensure reviews table supports order-tied guest/customer reviews & clear any non-text / unverified seed reviews
try {
    $cols = $pdo->query("SHOW COLUMNS FROM reviews")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('customer_name', $cols)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN customer_name VARCHAR(191) NULL AFTER user_id");
    }
    if (!in_array('order_number', $cols)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN order_number VARCHAR(100) NULL AFTER order_id");
    }
    if (!in_array('customer_phone', $cols)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN customer_phone VARCHAR(60) NULL AFTER customer_name");
    }
    // Remove any synthetic or empty-body reviews so D4 is strictly enforced
    $pdo->exec("DELETE FROM reviews WHERE body IS NULL OR TRIM(body) = '' OR (order_id IS NULL AND (order_number IS NULL OR TRIM(order_number) = ''))");
} catch (Exception $e) {}

foreach ($productsList as $p) {
    $slug = $p['slug'];
    $activeSlugs[] = $slug;
    $catSlug = $p['categorySlug'] ?? 'superfoods';
    $catId = $catMap[$catSlug] ?? 1;

    $imagesJson = json_encode($p['images'] ?? [$p['image']]);
    $officialName = $p['official_label_name'] ?? $p['name'];
    $ingredientsJson = json_encode($p['ingredients'] ?? []);
    $benefitsJson = json_encode($p['benefits'] ?? []);
    $nutritionJson = json_encode($p['nutrition'] ?? []);
    $usageText = $p['usage'] ?? '';
    $storageText = $p['storage'] ?? '';
    $metaTitle = $p['seo_title'] ?? ($officialName . ' | NaturesMud Nepal');
    $metaDesc = $p['meta_description'] ?? ($p['shortDescription'] ?? '');

    $price = (float)$p['price'];
    $mrp = (float)($p['compareAtPrice'] ?? $p['mrp'] ?? $price);
    $ratingAvg = 0.0;
    $ratingCount = 0;
    $isFeatured = !empty($p['isFeatured']) ? 1 : 0;
    $isBestSeller = !empty($p['isBestseller']) ? 1 : 0;
    $weightStr = (string)($p['weight'] ?? '100');
    preg_match('/([0-9]+(\\.[0-9]+)?)/', $weightStr, $matches);
    $weightNum = isset($matches[1]) ? (float)$matches[1] : 100.00;
    $unit = stripos($weightStr, 'ml') !== false ? 'ml' : 'g';

    // Check if product exists by slug
    $existing = $pdo->prepare("SELECT id FROM products WHERE slug = :slug LIMIT 1");
    $existing->execute(['slug' => $slug]);
    $row = $existing->fetch();

    if ($row) {
        // Compute real verified text review stats if any exist
        try {
            $revStmt = $pdo->prepare("SELECT COUNT(*) AS cnt, COALESCE(AVG(rating), 0) AS avg_rating FROM reviews WHERE product_id = :pid AND is_approved = 1 AND body IS NOT NULL AND TRIM(body) != ''");
            $revStmt->execute(['pid' => $row['id']]);
            $revStats = $revStmt->fetch();
            if ($revStats && (int)$revStats['cnt'] > 0) {
                $ratingCount = (int)$revStats['cnt'];
                $ratingAvg = round((float)$revStats['avg_rating'], 2);
            }
        } catch (Exception $e) {}

        // Ensure canonical catalog product is active and fully synchronized in MySQL
        $upd = $pdo->prepare("UPDATE products SET
            name = :name,
            category_id = :category_id,
            description = :description,
            short_description = :short_description,
            is_active = 1,
            is_featured = :is_featured,
            is_best_seller = :is_best_seller,
            price = :price,
            compare_at_price = :compare_at_price,
            weight = :weight,
            unit = :unit,
            rating_avg = :rating_avg,
            rating_count = :rating_count,
            images = :images,
            ingredients = :ingredients,
            benefits = :benefits,
            nutrition_facts = :nutrition_facts,
            usage_instructions = :usage_instructions,
            storage_instructions = :storage_instructions,
            meta_title = :meta_title,
            meta_description = :meta_description,
            updated_at = NOW()
            WHERE id = :id");
        $upd->execute([
            'name' => $officialName,
            'category_id' => $catId,
            'description' => $p['description'] ?? '',
            'short_description' => $p['shortDescription'] ?? $p['description'] ?? '',
            'is_featured' => $isFeatured,
            'is_best_seller' => $isBestSeller,
            'price' => $price,
            'compare_at_price' => $mrp,
            'weight' => $weightNum,
            'unit' => $unit,
            'rating_avg' => $ratingAvg,
            'rating_count' => $ratingCount,
            'images' => $imagesJson,
            'ingredients' => $ingredientsJson,
            'benefits' => $benefitsJson,
            'nutrition_facts' => $nutritionJson,
            'usage_instructions' => $usageText,
            'storage_instructions' => $storageText,
            'meta_title' => $metaTitle,
            'meta_description' => $metaDesc,
            'id' => $row['id']
        ]);
        try {
            $updDel = $pdo->prepare("UPDATE products SET deleted_at = NULL WHERE id = :id");
            $updDel->execute(['id' => $row['id']]);
        } catch (Exception $e) {}
        $upsertCount++;
    } else {
        $stmt = $pdo->prepare("INSERT INTO products 
            (name, slug, category_id, sku, price, compare_at_price, cost_price, stock_quantity, weight, unit, images, ingredients, benefits, nutrition_facts, usage_instructions, storage_instructions, meta_title, meta_description, short_description, description, is_active, is_featured, is_best_seller, rating_avg, rating_count, created_at, updated_at) 
            VALUES 
            (:name, :slug, :category_id, :sku, :price, :compare_at_price, :cost_price, :stock_quantity, :weight, :unit, :images, :ingredients, :benefits, :nutrition_facts, :usage_instructions, :storage_instructions, :meta_title, :meta_description, :short_description, :description, 1, :is_featured, :is_best_seller, :rating_avg, :rating_count, NOW(), NOW())");
        $stmt->execute([
            'name' => $officialName,
            'slug' => $slug,
            'category_id' => $catId,
            'sku' => $p['sku'] ?? ('NM-' . strtoupper(str_replace('-', '_', $slug))),
            'price' => $price,
            'compare_at_price' => $mrp,
            'cost_price' => round($price * 0.6, 2),
            'stock_quantity' => (int)($p['stock'] ?? 100),
            'weight' => $weightNum,
            'unit' => $unit,
            'images' => $imagesJson,
            'ingredients' => $ingredientsJson,
            'benefits' => $benefitsJson,
            'nutrition_facts' => $nutritionJson,
            'usage_instructions' => $usageText,
            'storage_instructions' => $storageText,
            'meta_title' => $metaTitle,
            'meta_description' => $metaDesc,
            'short_description' => $p['shortDescription'] ?? $p['description'],
            'description' => $p['description'],
            'is_featured' => $isFeatured,
            'is_best_seller' => $isBestSeller,
            'rating_avg' => $ratingAvg,
            'rating_count' => $ratingCount
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

const reviewsApiPhp = `<?php
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $productParam = isset($_GET['product']) ? trim((string)$_GET['product']) : '';
    if ($productParam === '') {
        echo json_encode(['success' => true, 'data' => []]);
        exit;
    }

    $prodStmt = $pdo->prepare("SELECT id, slug FROM products WHERE slug = :slug OR id = :id LIMIT 1");
    $prodStmt->execute(['slug' => $productParam, 'id' => is_numeric($productParam) ? (int)$productParam : -1]);
    $prod = $prodStmt->fetch();

    if (!$prod) {
        echo json_encode(['success' => true, 'data' => []]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT r.id, r.product_id, r.order_id, r.order_number, r.customer_name, r.rating, r.title, r.body, r.is_verified, r.is_approved, r.images, r.created_at,
               u.name AS user_name
        FROM reviews r
        LEFT JOIN users u ON u.id = r.user_id
        WHERE r.product_id = :pid
          AND r.is_approved = 1
          AND r.body IS NOT NULL
          AND TRIM(r.body) != ''
        ORDER BY r.created_at DESC
        LIMIT 50
    ");
    $stmt->execute(['pid' => $prod['id']]);
    $rows = $stmt->fetchAll();

    $reviews = [];
    foreach ($rows as $row) {
        $imgs = [];
        if (!empty($row['images'])) {
            $decoded = json_decode($row['images'], true);
            if (is_array($decoded)) {
                $imgs = $decoded;
            }
        }
        $reviews[] = [
            'id' => (string)$row['id'],
            'productId' => (string)$row['product_id'],
            'userName' => !empty($row['customer_name']) ? $row['customer_name'] : (!empty($row['user_name']) ? $row['user_name'] : 'Customer'),
            'rating' => (int)$row['rating'],
            'title' => (string)($row['title'] ?? ''),
            'content' => (string)$row['body'],
            'date' => substr((string)$row['created_at'], 0, 10),
            'verified' => !empty($row['is_verified']),
            'orderNumber' => !empty($row['order_number']) ? substr((string)$row['order_number'], 0, 6) . '***' : null,
            'images' => $imgs
        ];
    }

    echo json_encode(['success' => true, 'data' => $reviews]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON payload']);
        exit;
    }

    $productSlug = trim((string)($body['productSlug'] ?? ''));
    $productIdParam = trim((string)($body['productId'] ?? ''));
    $orderNumber = strtoupper(trim((string)($body['orderNumber'] ?? '')));
    $customerName = trim((string)($body['customerName'] ?? ''));
    $customerPhone = trim((string)($body['customerPhone'] ?? ''));
    $rating = (int)($body['rating'] ?? 5);
    $title = trim((string)($body['title'] ?? ''));
    $content = trim((string)($body['content'] ?? ''));
    $images = isset($body['images']) && is_array($body['images']) ? array_slice($body['images'], 0, 2) : [];

    if ($orderNumber === '' || strlen($orderNumber) < 4) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Order Number is required to submit a review.']);
        exit;
    }
    if ($customerName === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Customer Name is required.']);
        exit;
    }
    if ($content === '' || strlen($content) < 10) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please write at least 10 characters in your review.']);
        exit;
    }
    if ($rating < 1 || $rating > 5) {
        $rating = 5;
    }

    $prodStmt = $pdo->prepare("SELECT id, slug FROM products WHERE slug = :slug OR id = :id LIMIT 1");
    $prodStmt->execute([
        'slug' => $productSlug !== '' ? $productSlug : $productIdParam,
        'id' => is_numeric($productIdParam) ? (int)$productIdParam : -1
    ]);
    $prod = $prodStmt->fetch();
    if (!$prod) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product not found.']);
        exit;
    }

    // Check if orderNumber exists in orders table
    $cleanOrd = ltrim($orderNumber, '#');
    $ordStmt = $pdo->prepare("SELECT id, user_id, order_number, status FROM orders WHERE order_number = :o1 OR order_number = :o2 LIMIT 1");
    $ordStmt->execute(['o1' => $cleanOrd, 'o2' => '#' . $cleanOrd]);
    $ordRow = $ordStmt->fetch();

    $orderId = $ordRow ? (int)$ordRow['id'] : null;
    $userId = ($ordRow && !empty($ordRow['user_id'])) ? (int)$ordRow['user_id'] : null;
    $isVerified = $ordRow ? 1 : 0;

    // Fallback user_id if reviews.user_id is NOT NULL in schema
    if ($userId === null) {
        $uStmt = $pdo->query("SELECT id FROM users ORDER BY id ASC LIMIT 1");
        $uRow = $uStmt ? $uStmt->fetch() : null;
        if ($uRow) {
            $userId = (int)$uRow['id'];
        }
    }

    $ins = $pdo->prepare("
        INSERT INTO reviews
            (user_id, customer_name, customer_phone, product_id, order_id, order_number, rating, title, body, is_verified, is_approved, images, created_at, updated_at)
        VALUES
            (:user_id, :customer_name, :customer_phone, :product_id, :order_id, :order_number, :rating, :title, :body, :is_verified, 0, :images, NOW(), NOW())
    ");
    $ins->execute([
        'user_id' => $userId,
        'customer_name' => $customerName,
        'customer_phone' => $customerPhone !== '' ? $customerPhone : null,
        'product_id' => $prod['id'],
        'order_id' => $orderId,
        'order_number' => $cleanOrd,
        'rating' => $rating,
        'title' => $title !== '' ? $title : null,
        'body' => $content,
        'is_verified' => $isVerified,
        'images' => !empty($images) ? json_encode($images) : null
    ]);

    echo json_encode([
        'success' => true,
        'verifiedOrderMatch' => (bool)$isVerified,
        'message' => 'Thank you! Your review for Order ' . $cleanOrd . ' has been recorded and queued for order verification before publishing.'
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
`;

async function main() {
  const localPhpPath = path.join(__dirname, '..', 'scratch', 'sync_db_catalog.php');
  const localReviewsApiPath = path.join(__dirname, '..', 'scratch', 'reviews-api.php');
  fs.mkdirSync(path.dirname(localPhpPath), { recursive: true });
  fs.writeFileSync(localPhpPath, phpScript, 'utf8');
  fs.writeFileSync(localReviewsApiPath, reviewsApiPhp, 'utf8');

  console.log('1. Uploading sync_db_catalog.php and reviews-api.php to API backend...');
  const remotePhpPath = '/api.naturesmud.shop/public/sync_db_catalog.php';
  const remoteReviewsApiPath = '/api.naturesmud.shop/public/reviews-api.php';
  await uploadFileFtp(localPhpPath, remotePhpPath);
  await uploadFileFtp(localReviewsApiPath, remoteReviewsApiPath);
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

