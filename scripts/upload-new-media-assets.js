const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');

const config = {
  host: '167.235.9.123',
  user: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  secure: false,
};

const newVideos = [
  'avocado-powder-reel.mp4',
  'strawberry-powder-reel.mp4',
  'strawberry-powder-craft.mp4',
  'dried-cranberries-pro.mp4',
  'cranberries-yogurt-reel.mp4',
  'blueberries-harvest-reel.mp4',
  'blueberries-kitchen-reel.mp4',
  'makhana-fox-nuts-reel.mp4',
  'roasted-cashews-reel.mp4',
  'cashews-crunch-reel.mp4',
  'beetroot-powder-promo.mp4',
  'banana-sweet-potato-cranberry-reel.mp4',
  'moringa-pumpkin-banana-reel.mp4',
  'mango-papaya-banana-smoothie.mp4',
  'dehydrated-apple-reel.mp4',
];

async function main() {
  const client = new ftp.Client();
  client.timeout = 300000;
  try {
    await client.access(config);
    console.log('Connected to FTP server.');

    // 1. Upload all 29 lifestyle images
    const lifestyleDir = path.join(__dirname, '..', 'public', 'images', 'lifestyle');
    const lifestyleFiles = fs.readdirSync(lifestyleDir).filter((f) => f.endsWith('.jpg'));
    await client.ensureDir('/naturesmud.shop/public/images/lifestyle');
    console.log(`Uploading ${lifestyleFiles.length} lifestyle images...`);
    for (const file of lifestyleFiles) {
      const localPath = path.join(lifestyleDir, file);
      const remotePath = `/naturesmud.shop/public/images/lifestyle/${file}`;
      await client.uploadFrom(localPath, remotePath);
      console.log(`  [IMG] Uploaded ${file}`);
    }

    // 2. Upload all 15 new videos
    const videosDir = path.join(__dirname, '..', 'public', 'videos');
    await client.ensureDir('/naturesmud.shop/public/videos');
    console.log(`Uploading ${newVideos.length} product reel videos...`);
    for (const file of newVideos) {
      const localPath = path.join(videosDir, file);
      if (!fs.existsSync(localPath)) {
        console.warn(`  [WARN] Missing local video: ${file}`);
        continue;
      }
      const sizeMb = (fs.statSync(localPath).size / 1024 / 1024).toFixed(2);
      const remotePath = `/naturesmud.shop/public/videos/${file}`;
      console.log(`  [VID] Uploading ${file} (${sizeMb} MB)...`);
      await client.uploadFrom(localPath, remotePath);
      console.log(`  [VID] Uploaded ${file}`);
    }

    console.log('All new lifestyle images and product videos uploaded to cPanel!');
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
