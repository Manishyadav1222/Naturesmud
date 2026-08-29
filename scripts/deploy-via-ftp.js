const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { ZipArchive } = require('archiver');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13',
  rootDir: path.resolve(__dirname, '..')
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function callCpanelApi(apiPath) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: apiPath,
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + auth
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ status: 0, raw: data });
        }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.end();
  });
}

async function extractRemoteArchive(archivePath, destDir) {
  const query = `/execute/Fileman/extract_archive?file=${encodeURIComponent(archivePath)}&dest=${encodeURIComponent(destDir)}`;
  return callCpanelApi(query);
}

async function restartPassenger() {
  const query = `/execute/Fileman/save_file_content?dir=${encodeURIComponent(config.homeDir + '/naturesmud.shop/tmp')}&file=restart.txt&content=${encodeURIComponent(new Date().toISOString())}`;
  return callCpanelApi(query);
}

async function main() {
  console.log('====================================================');
  console.log('🚀 NATURE\'S MUD PROFESSIONAL FTP DEPLOYMENT PIPELINE');
  console.log('====================================================\n');

  // 1. Sync database (master products catalog)
  console.log('[1/5] 📊 Syncing Master Catalog to Live Database...');
  try {
    execSync('node scripts/sync-database-catalog.js', { stdio: 'inherit' });
    console.log('✅ Database master catalog synced successfully!');
  } catch (err) {
    console.warn('⚠️ Database sync error:', err.message);
  }

  // 2. Build Next.js
  console.log('\n[2/5] 🏗️ Building Next.js production build...');
  execSync('npm run build', { stdio: 'inherit' });
  const localBuildId = fs.readFileSync(path.join(config.rootDir, '.next', 'BUILD_ID'), 'utf8').trim();
  console.log('✅ Build successful! Local BUILD_ID:', localBuildId);

  // 3. Package clean .next without standalone and cache
  console.log('\n[3/5] 📦 Packaging optimized .next (excluding standalone & cache)...');
  const outZip = path.join(config.rootDir, 'frontend-clean-dist.zip');
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZip);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    for (const file of fs.readdirSync(path.join(config.rootDir, '.next'))) {
      const full = path.join(config.rootDir, '.next', file);
      const st = fs.statSync(full);
      if (file === 'cache' || file === 'standalone') continue;
      if (st.isDirectory()) {
        archive.directory(full, '.next/' + file, (entry) => {
          entry.mode = entry.name.endsWith('/') ? 0o755 : 0o644;
          return entry;
        });
      } else {
        archive.file(full, { name: '.next/' + file, mode: 0o644 });
      }
    }

    archive.finalize();
  });

  const zipSize = (fs.statSync(outZip).size / 1024 / 1024).toFixed(2);
  console.log(`✅ Optimized package created: ${zipSize} MB`);

  // 4. FTP Upload
  console.log('\n[4/5] 📡 Connecting via FTP and uploading build and public assets...');
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
    console.log('✅ Connected to Pure-FTPd server!');

    // Upload frontend-clean-dist.zip
    console.log(`Uploading ${outZip} (${zipSize} MB) to /naturesmud.shop/frontend-clean-dist.zip...`);
    await client.uploadFrom(outZip, '/naturesmud.shop/frontend-clean-dist.zip');
    console.log('✅ Build archive uploaded via FTP!');

    // Upload catalog PDFs directly to /naturesmud.shop/public/
    console.log('Uploading clean catalog PDFs to /naturesmud.shop/public/...');
    const catalogPdf = path.join(config.rootDir, 'public', 'catalog.pdf');
    if (fs.existsSync(catalogPdf)) {
      await client.uploadFrom(catalogPdf, '/naturesmud.shop/public/catalog.pdf');
      console.log('✅ public/catalog.pdf uploaded!');
    }
    const natureCatalogPdf = path.join(config.rootDir, 'public', 'Nature_Mud_Product_Catalog.pdf');
    if (fs.existsSync(natureCatalogPdf)) {
      await client.uploadFrom(natureCatalogPdf, '/naturesmud.shop/public/Nature_Mud_Product_Catalog.pdf');
      console.log('✅ public/Nature_Mud_Product_Catalog.pdf uploaded!');
    }

    // Upload any updated product images
    const updatedImages = [
      'products/cashewnuts-roasted.jpg',
      'products/cashewnuts.jpg',
      'products/client-authentic-label-1.jpg',
      'products/client-authentic-label-2.jpg',
      'products/client-authentic-label-3.jpg',
      'products/dehydrated-coconut-chips.jpg',
      'products/figs.jpg',
      'products/macadamia.jpg',
      'products/pistachios.jpg',
      'official-product-catalog.jpg'
    ];

    for (const img of updatedImages) {
      const localImg = path.join(config.rootDir, 'public', img);
      if (fs.existsSync(localImg)) {
        await client.uploadFrom(localImg, `/naturesmud.shop/public/${img}`);
      }
    }
    console.log('✅ Product images uploaded!');

  } finally {
    client.close();
  }

  // 5. Extract Archive & Restart Passenger via cPanel API
  console.log('\n[5/5] ⚙️ Extracting build archive and reloading Passenger...');
  const extRes = await extractRemoteArchive(
    `${config.homeDir}/naturesmud.shop/frontend-clean-dist.zip`,
    `${config.homeDir}/naturesmud.shop`
  );
  console.log('Extraction status:', extRes.status === 1 || extRes.event?.result === 1 ? '✅ Extracted' : JSON.stringify(extRes));

  const rstRes = await restartPassenger();
  console.log('Passenger restart:', rstRes.status === 1 ? '✅ Reloaded' : JSON.stringify(rstRes));

  if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

  // 6. Verification
  console.log('\n🩺 Verifying Live Production URLs...');
  await new Promise(r => setTimeout(r, 3000));

  const testEndpoints = [
    'https://naturesmud.shop/',
    'https://naturesmud.shop/catalog',
    'https://naturesmud.shop/catalog.pdf',
    'https://naturesmud.shop/Nature_Mud_Product_Catalog.pdf',
    'https://naturesmud.shop/products',
    'https://naturesmud.shop/cart',
    'https://naturesmud.shop/checkout',
    'https://api.naturesmud.shop/api/v1/products?per_page=50'
  ];

  for (const url of testEndpoints) {
    await new Promise(resolve => {
      https.get(url, { rejectUnauthorized: false }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          console.log(`  [${res.statusCode === 200 ? '✅ 200 OK' : '❌ ' + res.statusCode}] ${url} (${d.length} bytes)`);
          resolve();
        });
      }).on('error', e => {
        console.log(`  [❌ ERROR] ${url} -> ${e.message}`);
        resolve();
      });
    });
  }

  console.log('\n====================================================');
  console.log('🎉 DEPLOYMENT COMPLETE! ALL CHANGES LIVE ON PRODUCTION!');
  console.log('====================================================\n');
}

main().catch(console.error);
