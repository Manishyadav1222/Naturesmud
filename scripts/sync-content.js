const mysql = require('mysql2/promise');
const fs = require('fs');

async function syncContent() {
  const c = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'naturesmud',
    password: 'secret',
    database: 'natures_mud',
  });

  // 1. Sync Blog Posts
  const blogCode = fs.readFileSync('lib/data/content.ts', 'utf8');
  const cleanBlogJs = blogCode
    .replace(/import .*/g, '')
    .replace('export const blogPosts: BlogPost[] =', 'return');
  const blogs = new Function(cleanBlogJs)();
  console.log(`Found ${blogs.length} blog posts to sync.`);

  await c.query('SET FOREIGN_KEY_CHECKS = 0');
  await c.query('TRUNCATE TABLE blog_posts');

  for (let i = 0; i < blogs.length; i++) {
    const b = blogs[i];
    await c.query(
      `INSERT INTO blog_posts (
        id, title, slug, excerpt, content, featured_image, author, category, tags,
        is_published, published_at, meta_title, meta_description, views_count,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), ?, ?, 0, NOW(), NOW())`,
      [
        i + 1,
        b.title,
        b.slug,
        b.excerpt,
        Array.isArray(b.content) ? b.content.join('\n\n') : b.content,
        b.image,
        b.author || "Nature's Mud Nepal",
        b.category || 'Health & Nutrition',
        JSON.stringify(b.tags || []),
        `${b.title} | Nature's Mud Nepal`,
        b.excerpt.slice(0, 160),
      ]
    );
  }
  const [blogCount] = await c.query('SELECT COUNT(*) as c FROM blog_posts');
  console.log(`✅ Synced ${blogCount[0].c} blog posts into MySQL!`);

  // 2. Sync Recipes
  const recipeCode = fs.readFileSync('lib/data/recipes.ts', 'utf8');
  const cleanRecipeJs = recipeCode
    .replace(/import .*/g, '')
    .replace('export const recipes: Recipe[] =', 'return');
  const recipes = new Function(cleanRecipeJs)();
  console.log(`Found ${recipes.length} recipes to sync.`);

  await c.query('TRUNCATE TABLE recipes');

  for (let i = 0; i < recipes.length; i++) {
    const r = recipes[i];
    await c.query(
      `INSERT INTO recipes (
        id, title, slug, excerpt, content, featured_image, category,
        prep_time, cook_time, servings, difficulty, ingredients, instructions,
        nutrition, is_published, meta_title, meta_description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, NOW(), NOW())`,
      [
        i + 1,
        r.title,
        r.slug,
        r.excerpt,
        r.excerpt,
        r.image,
        r.category || 'Breakfast',
        r.prepTime || 10,
        r.cookTime || 0,
        r.servings || 2,
        r.difficulty || 'Easy',
        JSON.stringify(r.ingredients || []),
        JSON.stringify(r.instructions || []),
        JSON.stringify({ calories: '250 kcal', protein: '6g', fiber: '5g' }),
        `${r.title} | Nature's Mud Recipe`,
        r.excerpt.slice(0, 160),
      ]
    );
  }
  const [recipeCount] = await c.query('SELECT COUNT(*) as c FROM recipes');
  console.log(`✅ Synced ${recipeCount[0].c} recipes into MySQL!`);

  await c.query('SET FOREIGN_KEY_CHECKS = 1');
  await c.end();
}

syncContent().catch(console.error);
