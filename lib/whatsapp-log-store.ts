import fs from 'fs';
import path from 'path';

export type WhatsAppDeliveryStatus = 'NOT_SENT' | 'QUEUED' | 'SENT' | 'FAILED';

export interface WhatsAppNotificationLog {
  id: string;
  orderNumber: string;
  recipientPhone: string;
  messageType: 'NEW_ORDER_INVOICE' | 'PAYMENT_CONFIRMATION' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'CUSTOM';
  invoiceFile?: string;
  status: WhatsAppDeliveryStatus;
  whatsappMessageId?: string;
  apiResponse?: any;
  errorMessage?: string;
  sentAt?: string;
  retryCount: number;
  lastAttemptAt: string;
}

const LOGS_FILE = path.join(process.cwd(), 'data', 'whatsapp_notification_logs.json');

function ensureDataDir(): void {
  const dir = path.dirname(LOGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getAllWhatsAppLogs(): WhatsAppNotificationLog[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(LOGS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LOGS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getWhatsAppLogByOrder(orderNumber: string): WhatsAppNotificationLog | undefined {
  const normalized = orderNumber.replace('#', '').trim();
  const logs = getAllWhatsAppLogs();
  return logs.find((l) => l.orderNumber.replace('#', '').trim() === normalized);
}

export function saveWhatsAppLog(entry: WhatsAppNotificationLog): void {
  try {
    ensureDataDir();
    const logs = getAllWhatsAppLogs();
    const normalized = entry.orderNumber.replace('#', '').trim();
    const existingIndex = logs.findIndex((l) => l.orderNumber.replace('#', '').trim() === normalized);

    if (existingIndex >= 0) {
      logs[existingIndex] = {
        ...logs[existingIndex],
        ...entry,
        retryCount: entry.retryCount ?? (logs[existingIndex].retryCount + 1),
        lastAttemptAt: new Date().toISOString(),
      };
    } else {
      logs.unshift(entry);
    }

    // Keep last 500 records
    const trimmed = logs.slice(0, 500);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save WhatsApp notification log:', err);
  }
}
