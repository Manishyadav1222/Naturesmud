const mysql = require('mysql2');
const attempts = [
  { user: 'root', password: '' },
  { user: 'root', password: 'root_secret' },
  { user: 'naturesmud', password: 'secret' },
  { user: 'naturesmud_admin', password: 'admin_secret_2024' },
];
function q(conn, sql) {
  return new Promise((res, rej) => conn.query(sql, (e, r) => (e ? rej(e) : res(r))));
}
(async () => {
  for (const a of attempts) {
    const conn = mysql.createConnection({ host: '127.0.0.1', port: 3306, user: a.user, password: a.password, connectTimeout: 4000 });
    try {
      await new Promise((res, rej) => conn.connect(e => (e ? rej(e) : res())));
      const dbs = await q(conn, 'SHOW DATABASES');
      console.log(`OK  user=${a.user}  databases: ${dbs.map(d => Object.values(d)[0]).join(', ')}`);
      conn.end();
      break;
    } catch (e) {
      console.log(`ERR user=${a.user}  -> ${e.message}`);
    }
  }
  process.exit(0);
})();