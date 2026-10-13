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
      secure: false,
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
      secure: false,
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
    const req = https.request(
      {
        hostname: hostHeader,
        port: 443,
        path: reqPath,
        method: 'GET',
        rejectUnauthorized: false,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data });
          }
        });
      }
    );
    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

// Parse 28 canonical blogs from lib/data/blogs-database.ts
const blogsPath = path.join(__dirname, '..', 'lib', 'data', 'blogs-database.ts');
const blogsRaw = fs.readFileSync(blogsPath, 'utf8');
const blogJsonStr =
  blogsRaw
    .split('export const masterBlogCatalog: ExtendedBlogPost[] = ')[1]
    ?.split(/;\r?\n\r?\nexport const /)[0] || '[]';
const canonicalBlogs = JSON.parse(blogJsonStr);

// Parse 18 canonical recipes from lib/data/recipes.ts
const recipesPath = path.join(__dirname, '..', 'lib', 'data', 'recipes.ts');
const recipesRaw = fs.readFileSync(recipesPath, 'utf8');
const recipeJsonStr =
  recipesRaw
    .split('export const recipes: ExtendedRecipe[] = ')[1]
    ?.split(/;\r?\n\r?\nexport const RECIPE_REDIRECT_MAP/)[0] || '[]';
const canonicalRecipes = JSON.parse(recipeJsonStr);

const payloadJson = JSON.stringify({
  blogs: canonicalBlogs,
  recipes: canonicalRecipes,
});

const phpScript = `<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

$envFile = '/home8/kathma13/api.naturesmud.shop/.env';
$dbHost = '127.0.0.1';
$dbName = 'kathma13_natures_mud';
$dbUser = 'kathma13_muduser';
$dbPass = '2*5Qt7iSrB7-Uz';

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($k, $v) = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v, " \\t\\n\\r\\0\\x0B\\"\\'");
            if ($k === 'DB_HOST') $dbHost = $v;
            if ($k === 'DB_DATABASE') $dbName = $v;
            if ($k === 'DB_USERNAME') $dbUser = $v;
            if ($k === 'DB_PASSWORD') $dbPass = $v;
        }
    }
}

$pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

$rawPayload = <<<'JSONPAYLOAD'
${payloadJson}
JSONPAYLOAD;

$data = json_decode($rawPayload, true);
$blogs = $data['blogs'] ?? [];
$recipes = $data['recipes'] ?? [];

$allTables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

$blogUpserted = 0;
$recipeUpserted = 0;

foreach (['blog_posts', 'blogs'] as $bTable) {
    if (!in_array($bTable, $allTables)) continue;

    // Unpublish non-canonical/merged/discontinued blog rows (safe non-destructive update)
    $pdo->exec("UPDATE {$bTable} SET is_published = 0");

    $cols = $pdo->query("SHOW COLUMNS FROM {$bTable}")->fetchAll(PDO::FETCH_COLUMN);
    $hasPublishedAt = in_array('published_at', $cols);
    $hasMetaTitle = in_array('meta_title', $cols);
    $hasReadTime = in_array('read_time', $cols);

    foreach ($blogs as $b) {
        $slug = $b['slug'];
        $title = $b['title'];
        $excerpt = $b['excerpt'] ?? '';
        $contentArr = $b['content'] ?? [];
        $contentStr = is_array($contentArr) ? implode("\\n\\n", $contentArr) : (string)$contentArr;
        if (!empty($b['nepaliSummary'])) {
            $contentStr = "<div lang=\\"ne\\">" . $b['nepaliSummary'] . "</div>\\n\\n" . $contentStr;
        }
        $img = $b['image'] ?? '/products/sweet-potato-powder-100g.jpg';
        $author = 'NaturesMud Editorial & Kitchen Team';
        $cat = $b['category'] ?? 'Guides';
        $tags = json_encode($b['tags'] ?? []);
        $metaTitle = $b['metaTitle'] ?? ($title . ' | NaturesMud');
        $metaDesc = $b['metaDescription'] ?? $excerpt;
        $readTime = (int)($b['readTime'] ?? 10);
        $pubDate = !empty($b['date']) ? ($b['date'] . ' 09:00:00') : date('Y-m-d H:i:s');

        $chk = $pdo->prepare("SELECT id FROM {$bTable} WHERE slug = :slug LIMIT 1");
        $chk->execute(['slug' => $slug]);
        $existing = $chk->fetch();

        if ($existing) {
            $sql = "UPDATE {$bTable} SET title = :title, excerpt = :excerpt, content = :content, featured_image = :img, author = :author, category = :cat, tags = :tags, is_published = 1, updated_at = NOW()";
            $params = [
                'title' => $title,
                'excerpt' => $excerpt,
                'content' => $contentStr,
                'img' => $img,
                'author' => $author,
                'cat' => $cat,
                'tags' => $tags,
                'id' => $existing['id']
            ];
            if ($hasMetaTitle) {
                $sql .= ", meta_title = :meta_title, meta_description = :meta_description";
                $params['meta_title'] = $metaTitle;
                $params['meta_description'] = $metaDesc;
            }
            if ($hasReadTime) {
                $sql .= ", read_time = :read_time";
                $params['read_time'] = $readTime;
            }
            if ($hasPublishedAt) {
                $sql .= ", published_at = :published_at";
                $params['published_at'] = $pubDate;
            }
            $sql .= " WHERE id = :id";
            $upd = $pdo->prepare($sql);
            $upd->execute($params);
        } else {
            if ($hasPublishedAt && $hasMetaTitle) {
                $ins = $pdo->prepare("INSERT INTO {$bTable} (title, slug, excerpt, content, featured_image, author, category, tags, is_published, published_at, meta_title, meta_description, created_at, updated_at) VALUES (:title, :slug, :excerpt, :content, :img, :author, :cat, :tags, 1, :published_at, :meta_title, :meta_description, NOW(), NOW())");
                $ins->execute([
                    'title' => $title,
                    'slug' => $slug,
                    'excerpt' => $excerpt,
                    'content' => $contentStr,
                    'img' => $img,
                    'author' => $author,
                    'cat' => $cat,
                    'tags' => $tags,
                    'published_at' => $pubDate,
                    'meta_title' => $metaTitle,
                    'meta_description' => $metaDesc
                ]);
            } else {
                $ins = $pdo->prepare("INSERT INTO {$bTable} (title, slug, excerpt, content, category, featured_image, author, read_time, is_published, tags, created_at, updated_at) VALUES (:title, :slug, :excerpt, :content, :cat, :img, :author, :read_time, 1, :tags, NOW(), NOW())");
                $ins->execute([
                    'title' => $title,
                    'slug' => $slug,
                    'excerpt' => $excerpt,
                    'content' => $contentStr,
                    'cat' => $cat,
                    'img' => $img,
                    'author' => $author,
                    'read_time' => $readTime,
                    'tags' => $tags
                ]);
            }
        }
        $blogUpserted++;
    }
}

if (in_array('recipes', $allTables)) {
    // Unpublish non-canonical/merged/discontinued recipe rows (safe non-destructive update)
    $pdo->exec("UPDATE recipes SET is_published = 0");

    foreach ($recipes as $r) {
        $slug = $r['slug'];
        $title = $r['title'];
        $cat = $r['category'] ?? 'Healthy Snack';
        $img = $r['image'] ?? '/products/sweet-potato-powder-100g.jpg';
        $prep = (int)($r['prepTime'] ?? 5);
        $cook = (int)($r['cookTime'] ?? 5);
        $servings = (int)($r['servings'] ?? 2);
        $diff = $r['difficulty'] ?? 'Easy';
        $excerpt = $r['excerpt'] ?? '';
        $ingJson = json_encode($r['ingredients'] ?? []);
        $instJson = json_encode($r['instructions'] ?? []);
        $contentStr = is_array($r['instructions'] ?? null) ? implode("\\n\\n", $r['instructions']) : '';
        $metaTitle = $r['metaTitle'] ?? ($title . ' | NaturesMud');
        $metaDesc = $r['metaDescription'] ?? $excerpt;

        $chk = $pdo->prepare("SELECT id FROM recipes WHERE slug = :slug LIMIT 1");
        $chk->execute(['slug' => $slug]);
        $existing = $chk->fetch();

        if ($existing) {
            $upd = $pdo->prepare("UPDATE recipes SET title = :title, category = :cat, featured_image = :img, prep_time = :prep, cook_time = :cook, servings = :servings, difficulty = :diff, excerpt = :excerpt, content = :content, ingredients = :ing, instructions = :inst, is_published = 1, meta_title = :meta_title, meta_description = :meta_desc, updated_at = NOW() WHERE id = :id");
            $upd->execute([
                'title' => $title,
                'cat' => $cat,
                'img' => $img,
                'prep' => $prep,
                'cook' => $cook,
                'servings' => $servings,
                'diff' => $diff,
                'excerpt' => $excerpt,
                'content' => $contentStr,
                'ing' => $ingJson,
                'inst' => $instJson,
                'meta_title' => $metaTitle,
                'meta_desc' => $metaDesc,
                'id' => $existing['id']
            ]);
        } else {
            $ins = $pdo->prepare("INSERT INTO recipes (title, slug, category, featured_image, prep_time, cook_time, servings, difficulty, excerpt, content, ingredients, instructions, is_published, meta_title, meta_description, created_at, updated_at) VALUES (:title, :slug, :cat, :img, :prep, :cook, :servings, :diff, :excerpt, :content, :ing, :inst, 1, :meta_title, :meta_desc, NOW(), NOW())");
            $ins->execute([
                'title' => $title,
                'slug' => $slug,
                'cat' => $cat,
                'img' => $img,
                'prep' => $prep,
                'cook' => $cook,
                'servings' => $servings,
                'diff' => $diff,
                'excerpt' => $excerpt,
                'content' => $contentStr,
                'ing' => $ingJson,
                'inst' => $instJson,
                'meta_title' => $metaTitle,
                'meta_desc' => $metaDesc
            ]);
        }
        $recipeUpserted++;
    }
}

echo json_encode([
    'success' => true,
    'canonical_blogs_published' => count($blogs),
    'canonical_recipes_published' => count($recipes),
    'blog_operations' => $blogUpserted,
    'recipe_operations' => $recipeUpserted,
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

  console.log('2. Triggering database blogs & recipes sync via HTTPS...');
  const res = await callHttps('api.naturesmud.shop', '/sync_db_blogs.php');
  console.log('   Response:', JSON.stringify(res.data, null, 2));

  console.log('3. Cleaning up temporary remote script...');
  await removeFileFtp(remotePhpPath);
  console.log('   Done.');
}

main().catch((err) => {
  console.error('Fatal blog/recipe sync error:', err);
  process.exit(1);
});
