const mysql = require('mysql2/promise');

async function test() {
  const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3307,
    user: 'naturesmud',
    password: 'secret',
    database: 'natures_mud',
  });

  try {
    const id = '1';
    const [userRows] = await pool.query(
      `SELECT u.*, 
        (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_count,
        (SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE o.user_id = u.id) as total_spent
      FROM users u WHERE u.id = ?`,
      [id]
    );
    console.log(userRows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();
