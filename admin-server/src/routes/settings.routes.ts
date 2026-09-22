import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';

const router = Router();
router.use(authenticate);

// Persist settings to a local JSON file in the admin server's data directory
const SETTINGS_FILE = path.resolve(process.cwd(), 'data', 'settings.json');

function ensureSettingsDir() {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const defaultSettings = {
  storeName: "NaturesMud",
  tagline: "Pure Food · Real Nature · 0 Additives · 0 Preservatives",
  supportEmail: "support@naturesmud.com",
  supportPhone: "+977-9713888002",
  address: "Kathmandu, Nepal",
  whatsapp: "+977-9713888002",
  facebook: "https://facebook.com/naturesmud",
  instagram: "https://instagram.com/naturesmud",
  tiktok: "https://tiktok.com/@naturesmud",
  currency: "NPR",
  taxRate: "13",
  shippingFee: "150",
  freeShippingThreshold: "3000",
  lowStockThreshold: "10",
  orderPrefix: "NM",
  maintenance: "false",
  analytics: "true",
  seoTitle: "NaturesMud — Pure Himalayan Superfoods & Whole Food Nutrition Nepal",
  seoDescription: "Authentic pure Himalayan superfoods, whole food powders, and dehydrated fruits with 0 additives and 0 preservatives.",
  announcement: "Free shipping on orders over Rs. 3,000!",
  callmebotApiKey: "",
  metaAccessToken: "",
  metaPhoneNumberId: "",
  telegramBotToken: "",
  telegramChatId: "",
  customGatewayUrl: "",
};

function readSettings(): Record<string, any> {
  try {
    ensureSettingsDir();
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore read errors — fall back to defaults
  }
  return { ...defaultSettings };
}

function writeSettings(data: Record<string, any>): void {
  ensureSettingsDir();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/admin/settings
router.get('/', requireMinRole('VIEWER'), (_req, res) => {
  const settings = readSettings();
  res.json({ success: true, data: settings });
});

// POST /api/admin/settings
router.post('/', requireMinRole('ADMIN'), (req, res) => {
  try {
    const current = readSettings();
    // Merge with existing — only update provided keys, never allow setting unknown dangerous keys
    const allowedKeys = Object.keys(defaultSettings);
    const updates: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    const merged = { ...current, ...updates };
    writeSettings(merged);
    res.json({ success: true, data: merged, message: 'Settings saved successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to save settings' });
  }
});

export default router;
