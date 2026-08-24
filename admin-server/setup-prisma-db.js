const mysql = require('mysql2/promise');

const attempts = [
  { host: 'localhost', port: 3307, user: 'root', password: 'root_secret' },
  { host: 'localhost', port: 3307, user: 'root', password: 'secret' },
  { host: '127.0.0.1', port: 3307, user: 'root', password: 'root_secret' },
  { host: 'localhost', port: 3306, user: 'root', password: '' },
  { host: 'localhost', port: 3306, user: 'root', password: 'root' },
  { host: 'localhost', port: 3306, user: 'root', password: 'root_secret' },
  { host: 'localhost', port: 3306, user: 'root', password: 'password' },
  { host: 'localhost', port: 3306, user: 'root', password: 'admin' },
  { host: 'localhost', port: 3306, user: 'root', password: 'mysql' },
  { host: '127.0.0.1', port: 3306, user: 'root', password: '' },
  { host: '127.0.0.1', port: 3306, user: 'root', password: 'root' },
];

async function main() {
  let connected = false;
  
  for (const cfg of attempts) {
    try {
      const conn = await mysql.createConnection(cfg);
      const [rows] = await conn.query('SELECT VERSION() AS v');
      console.log(`✅ Connected: ${cfg.user}@${cfg.host}:${cfg.port} (MySQL ${rows[0].v})`);
      
      // List all databases
      const [dbs] = await conn.query('SHOW DATABASES');
      console.log('Databases:', dbs.map(d => Object.values(d)[0]).join(', '));
      
      // Create database
      await conn.query('CREATE DATABASE IF NOT EXISTS natures_mud_admin');
      console.log('✅ Database natures_mud_admin ready');
      
      // Create Prisma-compatible user (caching_sha2_password is the default in MySQL 8+/9+)
      await conn.query("CREATE USER IF NOT EXISTS 'naturesmud_admin'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'admin_secret_2024'");
      await conn.query("CREATE USER IF NOT EXISTS 'naturesmud_admin'@'127.0.0.1' IDENTIFIED WITH caching_sha2_password BY 'admin_secret_2024'");
      await conn.query("GRANT ALL PRIVILEGES ON natures_mud_admin.* TO 'naturesmud_admin'@'localhost'");
      await conn.query("GRANT ALL PRIVILEGES ON natures_mud_admin.* TO 'naturesmud_admin'@'127.0.0.1'");
      await conn.query('FLUSH PRIVILEGES');
      console.log('✅ Prisma user naturesmud_admin created with native password');
      
      await conn.end();
      connected = true;
      break;
    } catch (e) {
      // Try next
    }
  }
  
  if (!connected) {
    console.error('❌ Could not connect with any tried credentials.');
    console.error('Please provide the root MySQL password for your local MySQL97 service.');
  }
}

main();