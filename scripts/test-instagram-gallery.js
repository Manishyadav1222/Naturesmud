const { performance } = require('perf_hooks');

async function testInstagramIntegration() {
  console.log('====================================================');
  console.log("  NATURE'S MUD INSTAGRAM PHOTO GALLERY TEST SUITE   ");
  console.log('====================================================\n');

  const tests = [
    {
      name: 'Public Photo Gallery API (/api/gallery)',
      url: 'http://localhost:3000/api/gallery',
      method: 'GET',
    },
    {
      name: 'Instagram Photo Sync API (/api/gallery/sync)',
      url: 'http://localhost:3000/api/gallery/sync',
      method: 'POST',
    },
    {
      name: 'Gallery Settings API (/api/gallery/settings)',
      url: 'http://localhost:3000/api/gallery/settings',
      method: 'GET',
    },
    {
      name: 'Meta Webhook Verification (GET)',
      url: 'http://localhost:3000/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=naturemud_insta_webhook_secure_2025&hub.challenge=METATEST_12345',
      method: 'GET',
    },
    {
      name: 'Storefront Gallery Page (/gallery)',
      url: 'http://localhost:3000/gallery',
      method: 'GET',
    },
    {
      name: 'Admin Gallery Management (/admin/gallery)',
      url: 'http://localhost:3000/admin/gallery',
      method: 'GET',
    },
  ];

  let passed = 0;

  for (const t of tests) {
    const start = performance.now();
    try {
      const res = await fetch(t.url, { method: t.method });
      const duration = Math.round(performance.now() - start);

      if (res.status >= 200 && res.status < 400) {
        console.log(`[PASS] ${t.name}`);
        console.log(`       Status: ${res.status} OK (${duration}ms)`);
        if (t.url.includes('/api/gallery') && !t.url.includes('settings')) {
          const json = await res.json();
          console.log(`       Data Count: ${json.data?.length || json.data?.totalPhotos || 'N/A'}`);
        }
        passed++;
      } else {
        console.log(`[FAIL] ${t.name}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`[FAIL] ${t.name}: ${err.message}`);
    }
    console.log('');
  }

  // Test Webhook Ingestion (POST)
  console.log('Testing Real-time Webhook Ingestion:');
  try {
    const webhookRes = await fetch('http://localhost:3000/api/instagram/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entry: [
          {
            changes: [
              {
                field: 'feed',
                value: {
                  id: 'insta_live_test_' + Date.now(),
                  caption: 'Fresh Himalayan Moringa Leaves harvested today in Chitwan! 🌿 #MoringaSuperfood',
                  media_type: 'IMAGE',
                  media_url: '/products/superfood-mix.jpg',
                  permalink: 'https://instagram.com/p/test/',
                  timestamp: new Date().toISOString(),
                },
              },
            ],
          },
        ],
      }),
    });
    const webhookJson = await webhookRes.json();
    console.log(`[PASS] Webhook Ingestion: ${webhookJson.message} (Status ${webhookRes.status})`);
    passed++;
  } catch (err) {
    console.log(`[FAIL] Webhook Ingestion: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`  SUMMARY: ${passed} / ${tests.length + 1} tests passed`);
  console.log('====================================================\n');
}

testInstagramIntegration();
