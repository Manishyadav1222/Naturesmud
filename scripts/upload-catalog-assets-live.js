const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

const config = {
  host: '167.235.9.123',
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  rootDir: path.resolve(__dirname, '..')
};

async function uploadAssets() {
  const client = new ftp.Client();
  client.timeout = 180000;

  try {
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });

    const filesToUpload = [
      { local: 'public/Nature_Mud_Product_Catalog.pdf', remote: '/naturesmud.shop/public/Nature_Mud_Product_Catalog.pdf' },
      { local: 'public/catalog.pdf', remote: '/naturesmud.shop/public/catalog.pdf' },
      { local: 'public/Nature_Mud_Magazine_Catalog.pdf', remote: '/naturesmud.shop/public/Nature_Mud_Magazine_Catalog.pdf' },
      { local: 'public/official-product-catalog.jpg', remote: '/naturesmud.shop/public/official-product-catalog.jpg' },
      { local: 'public/images/official-product-catalog.jpg', remote: '/naturesmud.shop/public/images/official-product-catalog.jpg' },
      { local: 'public/images/posters/naturesmud-authenticity-table-cover.jpg', remote: '/naturesmud.shop/public/images/posters/naturesmud-authenticity-table-cover.jpg' },
      { local: 'public/images/posters/naturesmud-master-catalog-cover-4k.jpg', remote: '/naturesmud.shop/public/images/posters/naturesmud-master-catalog-cover-4k.jpg' }
    ];

    console.log('Uploading updated PDFs, posters, and cover assets...');
    for (const item of filesToUpload) {
      const fullLocal = path.join(config.rootDir, item.local);
      if (fs.existsSync(fullLocal)) {
        console.log(`  -> Uploading ${item.local} -> ${item.remote}`);
        await client.ensureDir(path.dirname(item.remote));
        await client.uploadFrom(fullLocal, item.remote);
      } else {
        console.warn(`  ⚠️ Missing local file: ${item.local}`);
      }
    }
    console.log('✅ All assets uploaded successfully!');
  } finally {
    client.close();
  }
}

uploadAssets().catch(console.error);
