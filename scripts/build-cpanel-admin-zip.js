const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building clean CloudLinux-compatible admin-server-deploy.zip...');

const prodPkg = {
  name: 'natures-mud-admin-server',
  version: '1.0.0',
  main: 'dist/index.js',
  scripts: {
    start: 'node dist/index.js'
  },
  dependencies: {
    '@google/genai': '^2.17.0',
    '@prisma/client': '^5.22.0',
    'bcryptjs': '^2.4.3',
    'cloudinary': '^2.5.1',
    'compression': '^1.7.4',
    'cors': '^2.8.5',
    'dotenv': '^16.4.7',
    'express': '^4.21.2',
    'express-rate-limit': '^7.4.1',
    'helmet': '^8.0.0',
    'jsonwebtoken': '^9.0.2',
    'morgan': '^1.10.0',
    'multer': '^1.4.5-lts.1',
    'mysql2': '^3.23.2',
    'nanoid': '^5.0.9',
    'nodemailer': '^6.9.16',
    'otplib': '^12.0.1',
    'qrcode': '^1.5.4',
    'slugify': '^1.6.6',
    'zod': '^3.24.1'
  }
};

const stagingDir = path.join(__dirname, '..', 'scratch', 'admin-staging');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(path.join(__dirname, '..', 'admin-server', 'dist'), path.join(stagingDir, 'dist'));
copyRecursiveSync(path.join(__dirname, '..', 'admin-server', 'prisma'), path.join(stagingDir, 'prisma'));
fs.writeFileSync(path.join(stagingDir, 'package.json'), JSON.stringify(prodPkg, null, 2), 'utf8');

const targetZip = path.join(__dirname, '..', 'admin-server-deploy.zip');
if (fs.existsSync(targetZip)) {
  fs.unlinkSync(targetZip);
}

execSync(`tar -a -c -f "${targetZip}" -C "${stagingDir}" dist prisma package.json`, { stdio: 'inherit' });

const stats = fs.statSync(targetZip);
console.log(`Created clean CloudLinux admin-server-deploy.zip (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
