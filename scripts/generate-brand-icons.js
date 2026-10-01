const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Generating brand icons and favicons...');
  const rootDir = path.resolve(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');
  const appDir = path.join(rootDir, 'app');

  // 1. First, make sure we have the high-quality transparent N emblem
  // Read tight N
  const rawN = await sharp(path.join(publicDir, 'n-emblem-transparent.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 2. We will generate both styles:
  // Style A: Green Squircle with Crisp White 'N' + Gold accent
  // Style B: Crisp White/Cream Squircle with Forest Green 'N' + Green border
  
  // Let's create White N buffer for dark background
  const whiteNBuf = Buffer.alloc(rawN.info.width * rawN.info.height * 4);
  for (let i = 0; i < rawN.info.width * rawN.info.height; i++) {
    const idx = i * 4;
    const a = rawN.data[idx + 3];
    if (a > 0) {
      whiteNBuf[idx] = 255;
      whiteNBuf[idx + 1] = 255;
      whiteNBuf[idx + 2] = 255;
      whiteNBuf[idx + 3] = a;
    }
  }

  // Generate 512x512 Master Badge:
  // Forest Green Background (#1C5B2E with gradient to #144222) with rounded squircle
  // The 'N' emblem in white + leaf in radiant emerald (#4ADE80 / #86EFAC)
  const greenBadgeSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#246F38" />
          <stop offset="50%" stop-color="#1C5B2E" />
          <stop offset="100%" stop-color="#123B1E" />
        </linearGradient>
        <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EAB308" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#CA8A04" stop-opacity="0.7" />
        </linearGradient>
      </defs>
      <!-- Squircle rounded background (Google / Apple standard) -->
      <rect x="8" y="8" width="496" height="496" rx="112" ry="112" fill="url(#forestGrad)" stroke="url(#goldBorder)" stroke-width="8"/>
    </svg>
  `;

  // Scale the white N emblem to 340x289
  const whiteNResized = await sharp(whiteNBuf, {
    raw: { width: rawN.info.width, height: rawN.info.height, channels: 4 }
  })
    .resize(340, 289, { fit: 'inside' })
    .png()
    .toBuffer();

  const whiteNMeta = await sharp(whiteNResized).metadata();
  const topA = Math.round((512 - whiteNMeta.height) / 2);
  const leftA = Math.round((512 - whiteNMeta.width) / 2);

  const masterBadgeGreen = await sharp(Buffer.from(greenBadgeSvg))
    .composite([{ input: whiteNResized, top: topA, left: leftA }])
    .png()
    .toBuffer();

  // Also create the Crisp White Squircle version with authentic Forest Green N
  const whiteBadgeSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="whiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#FAF7F2" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="496" height="496" rx="112" ry="112" fill="url(#whiteGrad)" stroke="#1C5B2E" stroke-width="14"/>
    </svg>
  `;

  const greenNResized = await sharp(path.join(publicDir, 'n-emblem-transparent.png'))
    .resize(340, 289, { fit: 'inside' })
    .toBuffer();

  const greenNMeta = await sharp(greenNResized).metadata();
  const topB = Math.round((512 - greenNMeta.height) / 2);
  const leftB = Math.round((512 - greenNMeta.width) / 2);

  const masterBadgeWhite = await sharp(Buffer.from(whiteBadgeSvg))
    .composite([{ input: greenNResized, top: topB, left: leftB }])
    .png()
    .toBuffer();

  // Save both 512x512 master badges
  await sharp(masterBadgeGreen).toFile(path.join(publicDir, 'icon-badge-green-512.png'));
  await sharp(masterBadgeWhite).toFile(path.join(publicDir, 'icon-badge-white-512.png'));

  // The Green badge is the standout choice for Google Search and Browser Tabs
  // (matches YouTube red & Instagram purple in images 1 and 2: rich, solid brand color)
  const masterIcon = masterBadgeGreen;

  // Generate all standard icon sizes:
  const sizes = [
    { name: 'icon-512x512.png', size: 512, dest: publicDir },
    { name: 'icon-192x192.png', size: 192, dest: publicDir },
    { name: 'icon-96x96.png', size: 96, dest: publicDir },
    { name: 'icon-48x48.png', size: 48, dest: publicDir },
    { name: 'icon-32x32.png', size: 32, dest: publicDir },
    { name: 'icon-16x16.png', size: 16, dest: publicDir },
    { name: 'icon.png', size: 32, dest: publicDir },
    { name: 'icon.png', size: 192, dest: appDir }, // Next.js app router icon
    { name: 'apple-touch-icon.png', size: 180, dest: publicDir },
    { name: 'apple-icon.png', size: 180, dest: appDir }, // Next.js app router apple-icon
    { name: 'apple-touch-icon-precomposed.png', size: 180, dest: publicDir }
  ];

  for (const s of sizes) {
    await sharp(masterIcon)
      .resize(s.size, s.size)
      .png()
      .toFile(path.join(s.dest, s.name));
    console.log(`Generated: ${path.relative(rootDir, path.join(s.dest, s.name))} (${s.size}x${s.size})`);
  }

  // Create real multi-resolution favicon.ico (containing 16x16, 32x32, 48x48)
  const buf16 = await sharp(masterIcon).resize(16, 16).png().toBuffer();
  const buf32 = await sharp(masterIcon).resize(32, 32).png().toBuffer();
  const buf48 = await sharp(masterIcon).resize(48, 48).png().toBuffer();

  // ICO header + directory
  function createIco(images) {
    const numImages = images.length;
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // type: 1 = ICO
    header.writeUInt16LE(numImages, 4); // count

    const dirEntries = [];
    let currentOffset = 6 + numImages * 16;

    for (const img of images) {
      const entry = Buffer.alloc(16);
      entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
      entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
      entry.writeUInt8(0, 2); // color count
      entry.writeUInt8(0, 3); // reserved
      entry.writeUInt16LE(1, 4); // color planes
      entry.writeUInt16LE(32, 6); // bits per pixel
      entry.writeUInt32LE(img.data.length, 8); // size of image data
      entry.writeUInt32LE(currentOffset, 12); // offset of image data
      dirEntries.push(entry);
      currentOffset += img.data.length;
    }

    return Buffer.concat([header, ...dirEntries, ...images.map(img => img.data)]);
  }

  const icoBuf = createIco([
    { width: 16, height: 16, data: buf16 },
    { width: 32, height: 32, data: buf32 },
    { width: 48, height: 48, data: buf48 }
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuf);
  console.log('Generated multi-resolution favicon.ico in public/ and app/');

  // Generate web app manifest (site.webmanifest)
  const manifest = {
    name: "NaturesMud Nepal — Pure Food. Real Nature.",
    short_name: "NaturesMud",
    description: "0 Additives · 0 Preservatives — Pure Himalayan organic superfoods, naturally dehydrated fruit powders, wild honey and mountain nuts.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#1C5B2E",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Generated public/site.webmanifest');

  // Generate high-resolution OpenGraph Card (1200x630) showcasing Image 3 Logo
  // This is used when searching on Google / sharing links on WhatsApp, Facebook, Twitter, LinkedIn
  const ogSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ogGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="60%" stop-color="#FAF7F2" />
          <stop offset="100%" stop-color="#EFE8DD" />
        </radialGradient>
        <pattern id="subtleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="#1C5B2E" fill-opacity="0.04"/>
        </pattern>
      </defs>
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#ogGlow)" />
      <rect width="1200" height="630" fill="url(#subtleGrid)" />

      <!-- Decorative Himalayan border framing -->
      <rect x="24" y="24" width="1152" height="582" rx="20" ry="20" fill="none" stroke="#1C5B2E" stroke-opacity="0.12" stroke-width="2"/>
      <rect x="36" y="36" width="1128" height="558" rx="14" ry="14" fill="none" stroke="#D4AF37" stroke-opacity="0.30" stroke-width="1.5"/>

      <!-- Top Tagline Pill -->
      <g transform="translate(600, 110)">
        <rect x="-180" y="-18" width="360" height="36" rx="18" ry="18" fill="#1C5B2E" fill-opacity="0.08" stroke="#1C5B2E" stroke-opacity="0.25"/>
        <text text-anchor="middle" y="6" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="3" fill="#1C5B2E">
          ORGANIC HIMALAYAN SUPERFOODS
        </text>
      </g>

      <!-- Bottom Taglines -->
      <g transform="translate(600, 480)">
        <text text-anchor="middle" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" fill="#242220" letter-spacing="1">
          0 Additives · 0 Preservatives · 100% Nepali Origin
        </text>
        <text text-anchor="middle" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#71717A" letter-spacing="2">
          naturesmud.com · Direct from 180+ Local Himalayan Farmers
        </text>
      </g>

      <!-- Quality Badges on Left and Right -->
      <g transform="translate(180, 520)">
        <circle cx="0" cy="0" r="28" fill="#1C5B2E" fill-opacity="0.1"/>
        <text text-anchor="middle" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1C5B2E">100% PURE</text>
      </g>
      <g transform="translate(1020, 520)">
        <circle cx="0" cy="0" r="28" fill="#1C5B2E" fill-opacity="0.1"/>
        <text text-anchor="middle" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1C5B2E">NEPAL</text>
      </g>
    </svg>
  `;

  // Scale the full transparent logo for the OG image
  // Logo is 733x205, scale to ~680 wide
  const ogLogo = await sharp(path.join(publicDir, 'logo-transparent.png'))
    .resize(680, 190, { fit: 'inside' })
    .toBuffer();

  const ogLogoMeta = await sharp(ogLogo).metadata();
  const ogTop = Math.round((630 - ogLogoMeta.height) / 2) - 30; // slightly above center
  const ogLeft = Math.round((1200 - ogLogoMeta.width) / 2);

  await sharp(Buffer.from(ogSvg))
    .composite([{ input: ogLogo, top: ogTop, left: ogLeft }])
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, 'naturesmud-og-image.jpg'));

  console.log('Generated public/naturesmud-og-image.jpg (1200x630 OpenGraph / Google preview card)');
}

main().catch(console.error);
