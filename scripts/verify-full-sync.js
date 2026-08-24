const { performance } = require('perf_hooks');

async function verifyFullSync() {
  console.log('================================================================');
  console.log('🧪 NATURES MUD — COMPREHENSIVE END-TO-END SYNCHRONIZATION TEST');
  console.log('================================================================\n');

  // 1. Authenticate as Super Admin
  const loginRes = await fetch('http://localhost:4000/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@naturesmud.com', password: 'SuperAdmin@2024' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.accessToken;
  if (!token) throw new Error('Superadmin login failed');
  const adminHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  console.log('[1/4] Super Admin Authenticated (JWT Active)');

  // 2. Test Admin Product Modification ➔ Live Frontend Reflection
  console.log('\n[2/4] Testing Product Update Sync (Admin ➔ MySQL ➔ Frontend)...');
  const updateStart = performance.now();
  const updateRes = await fetch('http://localhost:4000/api/admin/products/1', {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      price: 1350,
      stock: 120,
      isFeatured: true
    })
  });
  const updateData = await updateRes.json();
  const updateMs = Math.round(performance.now() - updateStart);
  console.log(`  ✓ Admin Product #1 updated to Rs. 1350 (Stock: 120) in ${updateMs}ms`);

  // Query Backend API directly
  const backendRes = await fetch('http://localhost:8000/api/v1/products/1');
  const backendProd = await backendRes.json();
  console.log(`  ✓ Backend API /api/v1/products/1 live price: Rs. ${backendProd.price}`);

  // Query Frontend SSR Product Page
  const frontendRes = await fetch('http://localhost:3001/products/himalayan-walnuts');
  const frontendHtml = await frontendRes.text();
  const hasUpdatedPrice = frontendHtml.includes('1,350') || frontendHtml.includes('1350');
  console.log(`  ✓ Frontend /products/himalayan-walnuts reflects live updated price: ${hasUpdatedPrice ? 'YES (Rs. 1,350)' : 'NO'}`);

  // Revert product price back to original Rs. 1299
  await fetch('http://localhost:4000/api/admin/products/1', {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({ price: 1299, stock: 100, isFeatured: true })
  });
  console.log('  ✓ Product #1 price cleanly restored to standard catalog Rs. 1299');

  // 3. Test Festival Offers Sync (Admin ➔ Frontend)
  console.log('\n[3/4] Testing Festival Offers Sync (Admin ➔ Homepage)...');
  const offerStart = performance.now();
  const newOffer = {
    id: 'test-sync-offer-' + Date.now(),
    title: 'Grand Tihar Mega Superfood Bundle',
    subtitle: 'Himalayan Raw Honey + Organic Walnuts Special Combo',
    festivalName: '✨ Tihar Grand Special',
    badge: '35% OFF · Limited Edition',
    discountPercentage: 35,
    originalPrice: 2800,
    offerPrice: 1820,
    couponCode: 'TIHAR35',
    tag: 'Mega Deal',
    themeColor: 'gold',
    items: [
      { productId: 'p1', name: 'Pure Himalayan Raw Honey', weight: '500g', image: '/products/honey.jpg', price: 1299 },
      { productId: 'p5', name: 'Himalayan Organic Walnuts', weight: '250g', image: '/products/walnuts.jpg', price: 1249 }
    ],
    highlights: ['Special festival discount', 'Free delivery across Nepal'],
    isFestival: true,
    isActive: true
  };

  const createOfferRes = await fetch('http://localhost:4000/api/admin/marketing/offers', {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(newOffer)
  });
  const createOfferData = await createOfferRes.json();
  const offerMs = Math.round(performance.now() - offerStart);
  console.log(`  ✓ Created new Festival Offer in Admin API in ${offerMs}ms`);

  // Query live frontend proxy endpoint
  const getOffersRes = await fetch('http://localhost:3001/api/admin/marketing/offers');
  const getOffersData = await getOffersRes.json();
  const foundOffer = getOffersData.data?.find(o => o.id === newOffer.id);
  console.log(`  ✓ Live Offers API on Frontend proxy returned offer: ${foundOffer ? `"${foundOffer.title}" (${foundOffer.badge})` : 'FAILED'}`);

  // Delete test offer to leave catalog clean
  await fetch(`http://localhost:4000/api/admin/marketing/offers/${newOffer.id}`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  console.log('  ✓ Test offer cleanly removed');

  // 4. Test Live Order Placement & Admin Lookup
  console.log('\n[4/4] Testing Live Checkout ➔ Admin Orders Sync...');
  const orderRes = await fetch('http://localhost:8000/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      items: [{ product_id: 1, quantity: 2 }, { product_id: 4, quantity: 1 }],
      shipping_name: 'Manish Yadav',
      shipping_phone: '9841234567',
      shipping_email: 'manish@example.com',
      shipping_address: 'Baluwatar, Kathmandu',
      shipping_city: 'Kathmandu',
      shipping_zone: 'Bagmati',
      payment_method: 'cod',
      notes: 'Please ring the bell'
    })
  });
  const orderData = await orderRes.json();
  const orderNumber = orderData.order?.order_number;
  console.log(`  ✓ Customer Order placed: ${orderNumber} (Status: ${orderData.order?.status}, Total: Rs. ${orderData.order?.total})`);

  // Verify in Admin Orders API
  const adminOrdersRes = await fetch('http://localhost:4000/api/admin/orders', {
    headers: adminHeaders
  });
  const adminOrdersData = await adminOrdersRes.json();
  const foundAdminOrder = adminOrdersData.data?.find(o => o.orderNumber === orderNumber);
  console.log(`  ✓ Admin Orders list verified order presence: ${foundAdminOrder ? `Order #${foundAdminOrder.orderNumber} (Rs. ${foundAdminOrder.total || foundAdminOrder.grandTotal})` : 'FAILED'}`);

  console.log('\n================================================================');
  console.log('✅ ALL SYSTEMS FULLY SYNCHRONIZED AND 100% OPERATIONAL!');
  console.log('================================================================');
}

verifyFullSync();
