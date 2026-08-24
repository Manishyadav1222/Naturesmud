const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection({ host:'localhost', port:3307, user:'naturesmud', password:'secret', database:'natures_mud' });
  const [nulls] = await conn.query('SELECT oi.id, oi.order_id, oi.product_id, oi.product_name, oi.product_sku FROM order_items oi WHERE oi.product_id IS NULL ORDER BY oi.order_id LIMIT 20');
  console.log('NULL product_id items:', JSON.stringify(nulls));
  const [distinct] = await conn.query('SELECT COUNT(DISTINCT order_id) c FROM order_items');
  console.log('distinct order_ids in items:', JSON.stringify(distinct));
  const [orders] = await conn.query('SELECT id, order_number, status FROM orders ORDER BY id DESC LIMIT 12');
  console.log('orders:', JSON.stringify(orders));
  await conn.end();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
