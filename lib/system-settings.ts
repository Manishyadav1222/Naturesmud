import fs from 'fs';
import path from 'path';

export interface SystemSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  currency: string;
  taxRate: string;
  shippingFee: string;
  freeShippingThreshold: string;
  lowStockThreshold: string;
  orderPrefix: string;
  maintenance: string;
  analytics: string;
  seoTitle: string;
  seoDescription: string;
  announcement: string;
  // Automation settings
  callmebotApiKey?: string;
  metaAccessToken?: string;
  metaPhoneNumberId?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  customGatewayUrl?: string;
  autoSendWhatsApp?: boolean;
}

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'system_settings.json');

const DEFAULT_SETTINGS: SystemSettings = {
  storeName: 'NaturesMud',
  tagline: 'Pure Food · Real Nature · 0 Additives · 0 Preservatives',
  supportEmail: 'support@naturesmud.com',
  supportPhone: '+977-1-5550123',
  address: 'Kathmandu, Nepal',
  whatsapp: '+977-9819844486',
  facebook: 'https://facebook.com/naturesmud',
  instagram: 'https://instagram.com/naturesmud',
  tiktok: 'https://tiktok.com/@naturesmud',
  currency: 'NPR',
  taxRate: '13',
  shippingFee: '150',
  freeShippingThreshold: '3000',
  lowStockThreshold: '10',
  orderPrefix: 'NM',
  maintenance: 'false',
  analytics: 'true',
  seoTitle: 'NaturesMud — Pure Himalayan Superfoods & Whole Food Nutrition Nepal',
  seoDescription: 'Authentic pure Himalayan superfoods, whole food powders, and dehydrated fruits with 0 additives and 0 preservatives.',
  announcement: 'Free shipping on orders over Rs. 3,000!',
  autoSendWhatsApp: true,
};

function ensureDir(): void {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getSystemSettings(): SystemSettings {
  try {
    ensureDir();
    if (!fs.existsSync(SETTINGS_FILE)) {
      return DEFAULT_SETTINGS;
    }
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSystemSettings(updates: Partial<SystemSettings>): SystemSettings {
  try {
    ensureDir();
    const current = getSystemSettings();
    const merged = { ...current, ...updates };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf8');
    return merged;
  } catch (err) {
    console.error('Failed to save system settings:', err);
    return getSystemSettings();
  }
}
