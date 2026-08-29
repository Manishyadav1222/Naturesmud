const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

async function uploadDir(client, localDir, remoteDir) {
  if (!fs.existsSync(localDir)) return;
  
  // ensure remote dir exists
  try {
    await client.ensureDir(remoteDir);
  } catch(e) {}
  
  const files = fs.readdirSync(localDir);
  for (const f of files) {
    const fullPath = path.join(localDir, f);
    if (fs.statSync(fullPath).isFile()) {
      try {
        await client.uploadFrom(fullPath, `${remoteDir}/${f}`);
        console.log(`✅ Uploaded ${f} to ${remoteDir}`);
      } catch (err) {
        console.error(`❌ Failed to upload ${f}:`, err.message);
      }
    }
  }
}

(async () => {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: '167.235.9.123',
      user: 'kathma13',
      password: '2*5Qt7iSrB7-Uz',
      secure: false
    });
    
    console.log('Connected to FTP');

    await uploadDir(client, path.join(__dirname, 'public', 'images', 'blog'), '/naturesmud.shop/public/images/blog');
    await uploadDir(client, path.join(__dirname, 'public', 'products'), '/naturesmud.shop/public/products');
    await uploadDir(client, path.join(__dirname, 'public', 'images', 'products'), '/naturesmud.shop/public/images/products');

    client.close();
  } catch (e) {
    console.error('FTP Error:', e);
  }
})();
