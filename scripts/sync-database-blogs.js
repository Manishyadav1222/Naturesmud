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
    // ignore
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

const phpScript = `<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$pdo = new PDO('mysql:host=127.0.0.1;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

// Check if blogs table exists
$tables = $pdo->query("SHOW TABLES LIKE 'blogs'")->fetchAll();
if (empty($tables)) {
    echo json_encode(['success' => true, 'message' => 'No blogs table present in backend. Handled by frontend SSG catalog.']);
    exit;
}

$blogs = [
    [
        'title' => "Himalayan Shilajit & Mountain Endurance: Why Nepal's Ancient Resin is Kathmandu's #1 Clean Fitness Fuel in 2026",
        'slug' => "himalayan-shilajit-mountain-endurance-clean-fitness-nepal-kathmandu",
        'excerpt' => "From gym athletes in Jhamsikhel to marathon runners in Pokhara, pure Himalayan Shilajit resin with 84+ ionic minerals and fulvic acid is replacing artificial caffeine and synthetic supplements across Nepal.",
        'content' => "Shilajit contains 60%+ fulvic acid, transporting 84+ ionic trace minerals directly into cell mitochondria for sustained ATP energy production without jitters or blood pressure spikes. Harvested from 16,000+ feet in the pristine rock cliffs of Mustang and Dolpa, Himalayan shilajit is solar-cured and purified to remove heavy metals.",
        'category' => "Ayurveda & High-Altitude Energy",
        'featured_image' => "/products/pink-salt-moss.jpg",
        'author' => "Dr. Ananda Sharma, MD (Himalayan Botanical Medicine)",
        'read_time' => 8,
        'is_published' => 1,
        'tags' => json_encode(["himalayan shilajit nepal", "pure shilajit kathmandu", "natural pre workout nepal", "fulvic acid benefits kathmandu"])
    ],
    [
        'title' => "The Great Nepali Sugar Detox: Why Kathmandu Families Are Replacing Refined Sugar with Dates Powder & Sweet Potato Powder",
        'slug' => "nepali-sugar-detox-dates-sweet-potato-powder-baby-food-diabetes",
        'excerpt' => "With rising lifestyle diabetes and modern baby weaning awareness, Nepali parents and health-conscious households are replacing refined white sugar with 100% dehydrated whole dates powder and sweet potato flour for daily tea, porridge (lito), and festive treats.",
        'content' => "Unlike refined white sugar which provides empty sucrose with zero minerals, NaturesMud Dates Powder is made exclusively from whole dehydrated dates rich in dietary iron, potassium, and magnesium. Micro-pulverized Sweet Potato Powder and Dates Powder provide slow-burning complex carbohydrates and natural sweetness for baby lito, preventing infant colic and constipation.",
        'category' => "Baby Nutrition & Clean Eating",
        'featured_image' => "/products/dates-powder-product-shot.jpg",
        'author' => "Pooja Karki, Senior Clinical Nutritionist (Kathmandu University)",
        'read_time' => 9,
        'is_published' => 1,
        'tags' => json_encode(["baby weaning food nepal", "dates powder kathmandu", "sweet potato powder baby food nepal", "sugar substitute diabetes nepal"])
    ]
];

$inserted = 0;
foreach ($blogs as $b) {
    $stmt = $pdo->prepare("INSERT INTO blogs (title, slug, excerpt, content, category, featured_image, author, read_time, is_published, tags, created_at, updated_at) 
        VALUES (:title, :slug, :excerpt, :content, :category, :featured_image, :author, :read_time, :is_published, :tags, NOW(), NOW())
        ON DUPLICATE KEY UPDATE 
        title = VALUES(title),
        excerpt = VALUES(excerpt),
        content = VALUES(content),
        category = VALUES(category),
        featured_image = VALUES(featured_image),
        author = VALUES(author),
        read_time = VALUES(read_time),
        is_published = 1,
        updated_at = NOW()");
    $stmt->execute($b);
    $inserted++;
}

echo json_encode([
    'success' => true,
    'message' => "Successfully synchronized {$inserted} trending blogs into backend database!",
    'timestamp' => date('Y-m-d H:i:s')
]);
`;

async function main() {
  const localPhpPath = path.join(__dirname, '..', 'scratch', 'sync_db_blogs.php');
  fs.mkdirSync(path.dirname(localPhpPath), { recursive: true });
  fs.writeFileSync(localPhpPath, phpScript, 'utf8');

  console.log('1. Uploading sync_db_blogs.php to API backend...');
  const remotePhpPath = '/api.naturesmud.shop/public/sync_db_blogs.php';
  await uploadFileFtp(localPhpPath, remotePhpPath);

  console.log('2. Triggering database blogs sync via HTTPS...');
  const res = await callHttps('api.naturesmud.shop', '/sync_db_blogs.php');
  console.log('   Response:', JSON.stringify(res.data));

  console.log('3. Cleaning up temporary remote script...');
  await removeFileFtp(remotePhpPath);
  console.log('   Done.');
}

main().catch(console.error);
