const mysql = require('mysql2/promise');
const { recipes } = require('../lib/data/recipes');

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

    const [rows] = await connection.query('SELECT count(*) as count FROM recipes');
    console.log('Current recipes count in MySQL:', rows[0].count);

    let inserted = 0;
    let updated = 0;

    for (const rec of recipes) {
      const ingredientsJson = JSON.stringify(rec.ingredients || []);
      const instructionsJson = JSON.stringify(rec.instructions || []);
      const contentStr = Array.isArray(rec.instructions) ? rec.instructions.join('\n\n') : '';

      const [existing] = await connection.query('SELECT id FROM recipes WHERE slug = ?', [rec.slug]);

      if (existing.length > 0) {
        await connection.query(
          `UPDATE recipes SET 
            title = ?, 
            category = ?, 
            featured_image = ?,
            prep_time = ?, 
            cook_time = ?, 
            servings = ?, 
            difficulty = ?, 
            excerpt = ?, 
            content = ?,
            ingredients = ?, 
            instructions = ?, 
            is_published = 1,
            meta_title = ?,
            meta_description = ?,
            updated_at = NOW()
          WHERE slug = ?`,
          [
            rec.title,
            rec.category,
            rec.image,
            rec.prepTime || 10,
            rec.cookTime || 5,
            rec.servings || 2,
            rec.difficulty || 'Easy',
            rec.excerpt || '',
            contentStr,
            ingredientsJson,
            instructionsJson,
            rec.title + " | Nature's Mud Recipes Nepal",
            rec.excerpt || '',
            rec.slug,
          ]
        );
        updated++;
      } else {
        await connection.query(
          `INSERT INTO recipes 
            (title, slug, category, featured_image, prep_time, cook_time, servings, difficulty, excerpt, content, ingredients, instructions, is_published, meta_title, meta_description, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, NOW(), NOW())`,
          [
            rec.title,
            rec.slug,
            rec.category,
            rec.image,
            rec.prepTime || 10,
            rec.cookTime || 5,
            rec.servings || 2,
            rec.difficulty || 'Easy',
            rec.excerpt || '',
            contentStr,
            ingredientsJson,
            instructionsJson,
            rec.title + " | Nature's Mud Recipes Nepal",
            rec.excerpt || '',
          ]
        );
        inserted++;
      }
    }

    console.log(`✅ Finished seeding all recipes to MySQL! Inserted: ${inserted}, Updated: ${updated}`);
    const [finalRows] = await connection.query('SELECT count(*) as count FROM recipes');
    console.log('🎉 Final recipes count in database:', finalRows[0].count);

    await connection.end();
  } catch (err) {
    console.error('Database sync error:', err.message);
    if (connection) await connection.end();
  }
}

main();
