const mysql = require('mysql2/promise');
const { masterBlogCatalog } = require('../lib/data/blogs-database');

const DB_CONFIG = {
  host: '167.235.9.123',
  port: 3306,
  user: 'kathma13_muduser',
  password: '2*5Qt7iSrB7-Uz',
  database: 'kathma13_natures_mud',
  connectTimeout: 20000,
};

async function main() {
  console.log('Connecting to remote MySQL database:', DB_CONFIG.database);
  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('Connected to MySQL successfully!');

    // Check existing count in blog_posts
    const [rows] = await connection.query('SELECT count(*) as count FROM blog_posts');
    console.log('Current blog_posts count in MySQL:', rows[0].count);

    let inserted = 0;
    let updated = 0;

    for (const post of masterBlogCatalog) {
      const contentStr = Array.isArray(post.content) ? post.content.join('\n\n') : (post.content || '');
      const tagsStr = JSON.stringify(post.tags || []);
      const publishedAt = post.date ? new Date(post.date) : new Date();

      const [res] = await connection.query(
        `INSERT INTO blog_posts 
          (title, slug, excerpt, content, featured_image, author, category, tags, is_published, published_at, meta_title, meta_description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          excerpt = VALUES(excerpt),
          content = VALUES(content),
          featured_image = VALUES(featured_image),
          author = VALUES(author),
          category = VALUES(category),
          tags = VALUES(tags),
          is_published = 1,
          meta_title = VALUES(meta_title),
          meta_description = VALUES(meta_description),
          updated_at = NOW()`,
        [
          post.title,
          post.slug,
          post.excerpt,
          contentStr,
          post.image,
          post.author,
          post.category,
          tagsStr,
          1,
          publishedAt,
          post.title + " | Nature's Mud Nepal",
          post.metaDescription || post.excerpt,
        ]
      );

      if (res.affectedRows === 1) inserted++;
      else if (res.affectedRows === 2) updated++;
    }

    console.log(`✅ Finished seeding 100 SEO Blogs to MySQL! Inserted: ${inserted}, Updated: ${updated}`);

    const [finalRows] = await connection.query('SELECT count(*) as count FROM blog_posts');
    console.log('🎉 Final blog_posts count in database:', finalRows[0].count);

  } catch (err) {
    console.error('Database Sync Error:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

main();
