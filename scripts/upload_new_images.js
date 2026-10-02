const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function uploadImages() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  await client.access({
    host: '167.235.9.123',
    user: 'kathma13',
    password: '2*5Qt7iSrB7-Uz',
    secure: false,
  });

  const uploads = [
    { local: 'public/products/roasted-almonds-v2.jpg', name: 'roasted-almonds-v2.jpg' },
    { local: 'public/products/roasted-almonds-v2.jpg', name: 'roasted-almonds.jpg' },
    { local: 'public/products/roasted-almonds-v2.jpg', name: 'almonds-2.jpg' },
    { local: 'public/products/banana-powder.jpg', name: 'banana-powder.jpg' }
  ];

  const targetDirs = [
    '/naturesmud.shop/public/products',
    '/naturesmud.shop/.next/standalone/public/products',
    '/public_html/products'
  ];

  for (const dir of targetDirs) {
    await client.ensureDir(dir);
    for (const u of uploads) {
      if (fs.existsSync(u.local)) {
        console.log(`Uploading ${u.local} to ${dir}/${u.name}...`);
        await client.uploadFrom(u.local, `${dir}/${u.name}`);
      }
    }
  }

  client.close();
  console.log('All image uploads finished successfully!');
}

uploadImages().catch(console.error);
