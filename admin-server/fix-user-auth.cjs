const mysql = require('mysql2/promise');
(async () => {
  const c = await mysql.createConnection({ host: 'localhost', port: 3307, user: 'root', password: 'root_secret' });
  try {
    await c.query("ALTER USER 'naturesmud_admin'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'admin_secret_2024'");
    await c.query("ALTER USER 'naturesmud_admin'@'127.0.0.1' IDENTIFIED WITH caching_sha2_password BY 'admin_secret_2024'");
    const [r] = await c.query("SELECT user, host, plugin FROM mysql.user WHERE user = 'naturesmud_admin'");
    console.log(JSON.stringify(r));
    console.log('AUTH FIXED');
  } catch (e) {
    console.error('FAILED:', e.message);
  } finally {
    await c.end();
  }
})();
