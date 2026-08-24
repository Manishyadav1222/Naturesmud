const BASE = 'http://localhost:4000/api/admin';
(async () => {
  const H = { 'Content-Type': 'application/json' };
  const login = await fetch(BASE + '/auth/login', { method: 'POST', headers: H, body: JSON.stringify({ email: 'superadmin@naturesmud.com', password: 'SuperAdmin@2024' }) });
  const lj = await login.json();
  const token = lj?.data?.accessToken;
  const rt = lj?.data?.refreshToken;
  console.log('login:', login.status, 'token?', !!token);
  const A = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };

  // 1. Refresh route now works
  const ref = await fetch(BASE + '/auth/refresh', { method: 'POST', headers: H, body: JSON.stringify({ refreshToken: rt }) });
  console.log('POST /auth/refresh:', ref.status, (await ref.text()).slice(0, 120));

  // 2. Products list (the reported 404 route)
  const plist = await fetch(BASE + '/products?page=1&limit=20&sortBy=createdAt&sortOrder=desc', { headers: A });
  const pj = await plist.json();
  console.log('GET /products:', plist.status, 'total:', pj?.pagination?.total, 'rows:', pj?.data?.length, 'err:', pj?.message || '');
  if (pj?.data?.[0]) console.log('  [0] keys:', Object.keys(pj.data[0]).join(','), '| status:', pj.data[0].status, '| cat:', pj.data[0].category?.name);

  // 3. Products detail
  const pdet = await fetch(BASE + '/products/1', { headers: A });
  const pd = await pdet.json();
  console.log('GET /products/1:', pdet.status, 'name:', pd?.data?.name, '| keys:', Object.keys(pd?.data || {}).join(','));

  // 4. Categories + tree + brands
  const cat = await fetch(BASE + '/categories?limit=100', { headers: A });
  console.log('GET /categories?limit=100:', cat.status, 'count:', (await cat.json())?.data?.length);
  const tree = await fetch(BASE + '/categories/tree', { headers: A });
  const tj = await tree.json();
  console.log('GET /categories/tree:', tree.status, 'roots:', tj?.data?.length);
  const brand = await fetch(BASE + '/brands', { headers: A });
  console.log('GET /brands:', brand.status);

  // 5. Orders still work
  const ord = await fetch(BASE + '/orders?page=1&limit=20&sortBy=createdAt&sortOrder=desc', { headers: A });
  const oj = await ord.json();
  console.log('GET /orders:', ord.status, 'total:', oj?.pagination?.total, 'rows:', oj?.data?.length);
  const odet = await fetch(BASE + '/orders/3', { headers: A });
  const od = await odet.json();
  console.log('GET /orders/3:', odet.status, 'item[0] productSku:', od?.data?.items?.[0]?.productSku, 'productId:', od?.data?.items?.[0]?.productId);

  // 6. Create -> update -> duplicate -> delete (cleanup)
  const created = await fetch(BASE + '/products', { method: 'POST', headers: A, body: JSON.stringify({ name: 'API Test Product', sku: 'TEST-API-' + Date.now().toString().slice(-6), price: 999, stock: 5, lowStockThreshold: 2, status: 'ACTIVE', unit: 'PC' }) });
  const cj = await created.json();
  const newId = cj?.data?.id;
  console.log('POST /products:', created.status, 'id:', newId);
  if (newId) {
    const upd = await fetch(BASE + '/products/' + newId, { method: 'PUT', headers: A, body: JSON.stringify({ status: 'DRAFT', isFeatured: true }) });
    const uj = await upd.json();
    console.log('PUT /products/' + newId + ':', upd.status, 'status:', uj?.data?.status, 'featured:', uj?.data?.isFeatured);
    const dup = await fetch(BASE + '/products/' + newId + '/duplicate', { method: 'POST', headers: A });
    const dj = await dup.json();
    console.log('POST /products/' + newId + '/duplicate:', dup.status, 'new id:', dj?.data?.id);
    if (dj?.data?.id) {
      await fetch(BASE + '/products/' + dj.data.id, { method: 'DELETE', headers: A });
      console.log('cleaned duplicate', dj.data.id);
    }
    const del = await fetch(BASE + '/products/' + newId, { method: 'DELETE', headers: A });
    console.log('DELETE /products/' + newId + ':', del.status);
    const gone = await fetch(BASE + '/products/' + newId, { headers: A });
    console.log('GET after delete:', gone.status);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
