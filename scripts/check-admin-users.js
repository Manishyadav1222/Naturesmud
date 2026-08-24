const mysql = require('mysql2/promise');

async function checkAdminUsers() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'natures_mud_admin',
    port: 3306,
  });

  const [users] = await connection.query('SELECT id, email, name, role FROM users');
  console.log('Admin Users in DB:', users);
  await connection.end();
}

checkAdminUsers().catch(console.error);
