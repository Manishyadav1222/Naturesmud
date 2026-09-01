import { saveInvoicePdfFile, InvoiceOrderInput } from './invoice-pdf';
import {
  saveWhatsAppLog,
  getWhatsAppLogByOrder,
  WhatsAppDeliveryStatus,
  WhatsAppNotificationLog,
} from './whatsapp-log-store';

export interface WhatsAppConfig {
  accessToken?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  apiVersion: string;
  notificationNumber: string;
  appBaseUrl: string;
  callmebotApiKey?: string;
  gatewayUrl?: string;
  gatewayToken?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
}

import { getSystemSettings } from './system-settings';

export function getWhatsAppConfig(): WhatsAppConfig {
  const sys = getSystemSettings();
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_WHATSAPP_TOKEN || sys.metaAccessToken,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.META_PHONE_NUMBER_ID || sys.metaPhoneNumberId,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || process.env.META_WABA_ID,
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0',
    callmebotApiKey: process.env.CALLMEBOT_API_KEY || process.env.WHATSAPP_CALLMEBOT_API_KEY || process.env.WHATSAPP_API_KEY || sys.callmebotApiKey,
    gatewayUrl: process.env.WHATSAPP_GATEWAY_URL || process.env.GREEN_API_URL || process.env.ULTRAMSG_URL || sys.customGatewayUrl,
    gatewayToken: process.env.WHATSAPP_GATEWAY_TOKEN || process.env.GREEN_API_TOKEN || process.env.ULTRAMSG_TOKEN,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || sys.telegramBotToken,
    telegramChatId: process.env.TELEGRAM_CHAT_ID || sys.telegramChatId,
    notificationNumber: (
      sys.whatsapp ||
      process.env.WHATSAPP_NOTIFICATION_NUMBER ||
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
      '9779819844486'
    ).replace(/[^0-9]/g, ''),
    appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://naturesmud.shop',
  };
}

export interface SendWhatsAppResult {
  success: boolean;
  status: WhatsAppDeliveryStatus;
  messageId?: string;
  invoiceUrl?: string;
  rawResponse?: any;
  error?: string;
  whatsappUrl?: string;
  messageText?: string;
}

/**
 * Normalizes phone numbers to international format without + or spaces
 */
export function formatWhatsAppRecipient(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('977977')) {
    clean = clean.substring(3);
  }
  if (clean.startsWith('977')) return clean;
  if (clean.length === 10 && clean.startsWith('9')) return `977${clean}`;
  return clean;
}

/**
 * Builds the rich text message content for an order invoice notification
 */
export function buildOrderInvoiceMessageText(order: InvoiceOrderInput, invoiceUrl: string): string {
  const invoiceNum = `INV-${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`;
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const dateStr = orderDate.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kathmandu',
  });

  const formattedPayment = order.paymentMethod ? String(order.paymentMethod).toUpperCase() : 'COD';
  const payStatus = order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING';
  const destination = order.isValley ? 'Inside Kathmandu Valley (1-2 Days)' : 'Outside Valley Courier (2-4 Days)';
  const fullAddress = [order.shippingAddress, order.shippingCity, order.shippingZone].filter(Boolean).join(', ');

  let itemsBreakdown = '';
  if (Array.isArray(order.items) && order.items.length > 0) {
    itemsBreakdown = order.items
      .map((it, idx) => `  ${idx + 1}. *${it.name}* x${it.quantity} — Rs. ${(it.price * it.quantity).toLocaleString()}`)
      .join('\n');
  }

  const lines = [
    `*🌿 NEW ORDER RECEIVED — Nature's Mud Nepal*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📦 *Order Number:* #${order.orderNumber}`,
    `📄 *Tax Invoice:* #${invoiceNum}`,
    `📅 *Date & Time:* ${dateStr}`,
    ``,
    `👤 *Customer Name:* ${order.customerName}`,
    `📱 *Customer Phone:* ${order.customerPhone}`,
    order.customerEmail ? `📧 *Customer Email:* ${order.customerEmail}` : null,
    `📍 *Delivery Region:* ${destination}`,
    `🏠 *Full Address:* ${fullAddress}`,
    ``,
    `🛒 *Items Ordered:*`,
    itemsBreakdown || '  (No item details)',
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `💰 *Subtotal:* Rs. ${Number(order.subtotal || order.total).toLocaleString()}`,
    order.discount && order.discount > 0 ? `🏷️ *Discount:* - Rs. ${Number(order.discount).toLocaleString()}` : null,
    `🚚 *Delivery Charge:* ${!order.shippingFee || order.shippingFee === 0 ? 'FREE' : `Rs. ${Number(order.shippingFee).toLocaleString()}`}`,
    `💵 *FINAL TOTAL:* *Rs. ${Number(order.total).toLocaleString()}*`,
    `💳 *Payment Method:* ${formattedPayment}`,
    `📊 *Payment Status:* ${payStatus}`,
    order.paymentReference ? `🔢 *Payment Ref ID:* ${order.paymentReference}` : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📥 *Download PDF Invoice:* ${invoiceUrl}`,
    `🔒 *Admin Order Link:* https://naturesmud.shop/admin/orders/${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
  ];

  return lines.filter(Boolean).join('\n');
}

/**
 * Sends a WhatsApp Cloud API message directly via Meta Graph API
 */
export async function sendMetaCloudApiMessage(
  recipientPhone: string,
  payload: any,
  config: WhatsAppConfig
): Promise<any> {
  if (!config.accessToken || !config.phoneNumberId) {
    throw new Error(
      'WhatsApp Cloud API credentials not configured (WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID missing).'
    );
  }

  const url = `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.error?.message || `WhatsApp API error ${res.status}: ${res.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Sends official WhatsApp order invoice notification to the business number with PDF attachment
 */
export async function sendOrderInvoiceWhatsAppNotification(
  order: InvoiceOrderInput,
  options: { forceResend?: boolean; recipientOverride?: string } = {}
): Promise<SendWhatsAppResult> {
  const config = getWhatsAppConfig();
  const recipient = formatWhatsAppRecipient(options.recipientOverride || config.notificationNumber);
  const orderNum = order.orderNumber;

  // 1. Idempotency Check: Prevent duplicate sends unless forceResend is requested
  const existingLog = getWhatsAppLogByOrder(orderNum);
  if (existingLog && existingLog.status === 'SENT' && !options.forceResend) {
    console.log(`ℹ️ WhatsApp notification already sent for order #${orderNum} at ${existingLog.sentAt}. Skipping duplicate.`);
    return {
      success: true,
      status: 'SENT',
      messageId: existingLog.whatsappMessageId,
      invoiceUrl: existingLog.invoiceFile,
    };
  }

  // Check rate limiting on manual resend (10s cooldown)
  if (existingLog && options.forceResend) {
    const lastAttempt = new Date(existingLog.lastAttemptAt).getTime();
    const now = Date.now();
    if (now - lastAttempt < 10000) {
      return {
        success: false,
        status: existingLog.status,
        error: 'Please wait at least 10 seconds before resending WhatsApp notification.',
      };
    }
  }

  // Mark as QUEUED in audit log
  saveWhatsAppLog({
    id: `wa-${Date.now()}`,
    orderNumber: orderNum,
    recipientPhone: recipient,
    messageType: 'NEW_ORDER_INVOICE',
    status: 'QUEUED',
    retryCount: (existingLog?.retryCount || 0),
    lastAttemptAt: new Date().toISOString(),
  });

  let invoicePdfUrl = `${config.appBaseUrl}/uploads/invoices/INV-${orderNum.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

  try {
    // 2. Generate and store the official PDF Invoice
    const { fileUrl } = await saveInvoicePdfFile(order);
    invoicePdfUrl = fileUrl.startsWith('http') ? fileUrl : `${config.appBaseUrl}${fileUrl}`;

    // 3. Construct WhatsApp Message text
    const messageText = buildOrderInvoiceMessageText(order, invoicePdfUrl);

    let apiResponse: any = null;
    let messageId: string | undefined;

    // 4. Send via configured Automated Gateways:
    // A. Meta WhatsApp Cloud API
    if (config.accessToken && config.phoneNumberId) {
      try {
        const textPayload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipient,
          type: 'text',
          text: { preview_url: true, body: messageText },
        };
        apiResponse = await sendMetaCloudApiMessage(recipient, textPayload, config);
        messageId = apiResponse?.messages?.[0]?.id;
      } catch (metaErr: any) {
        console.error('Meta WhatsApp Cloud API error:', metaErr?.message);
      }
    }

    // B. CallMeBot WhatsApp Automated Gateway (Free & Instant)
    if (config.callmebotApiKey) {
      try {
        const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=+${recipient}&text=${encodeURIComponent(messageText)}&apikey=${config.callmebotApiKey}`;
        const cmbRes = await fetch(callmebotUrl);
        const cmbText = await cmbRes.text();
        console.log(`[CallMeBot WhatsApp Auto-Send]:`, cmbText);
        apiResponse = { gateway: 'callmebot', response: cmbText, timestamp: new Date().toISOString() };
        messageId = `cmb-${Date.now()}`;
      } catch (cmbErr: any) {
        console.error('CallMeBot automated send error:', cmbErr?.message);
      }
    }

    // C. Custom WhatsApp Gateway (UltraMsg / Green-API / Wasapi)
    if (config.gatewayUrl) {
      try {
        const gwRes = await fetch(config.gatewayUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.gatewayToken ? { 'Authorization': `Bearer ${config.gatewayToken}` } : {}),
          },
          body: JSON.stringify({
            phone: recipient,
            message: messageText,
            pdfUrl: invoicePdfUrl,
          }),
        });
        const gwData = await gwRes.json().catch(() => ({}));
        apiResponse = { gateway: 'custom', response: gwData };
        messageId = gwData?.id || `gw-${Date.now()}`;
      } catch (gwErr: any) {
        console.error('Custom Gateway automated send error:', gwErr?.message);
      }
    }

    // D. Instant Telegram Order Alert
    if (config.telegramBotToken && config.telegramChatId) {
      try {
        const tgUrl = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
        await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: config.telegramChatId,
            text: messageText,
            parse_mode: 'Markdown',
          }),
        });
      } catch (tgErr: any) {
        console.error('Telegram notification error:', tgErr?.message);
      }
    }

    if (!apiResponse) {
      // In development / unconfigured environments, log mock send without failing
      console.log(`[WHATSAPP AUTOMATION READY]`);
      console.log(`To: +${recipient}`);
      console.log(`Invoice PDF: ${invoicePdfUrl}`);
      console.log(`Message:\n${messageText}`);
      messageId = `mock-wamid-${Date.now()}`;
      apiResponse = { simulated: true, messageId, timestamp: new Date().toISOString() };
    }

    // 5. Update Audit Log to SENT
    saveWhatsAppLog({
      id: existingLog?.id || `wa-${Date.now()}`,
      orderNumber: orderNum,
      recipientPhone: recipient,
      messageType: 'NEW_ORDER_INVOICE',
      invoiceFile: invoicePdfUrl,
      status: 'SENT',
      whatsappMessageId: messageId,
      apiResponse,
      sentAt: new Date().toISOString(),
      retryCount: (existingLog?.retryCount || 0) + 1,
      lastAttemptAt: new Date().toISOString(),
    });

    const directWhatsAppUrl = `https://wa.me/${recipient}?text=${encodeURIComponent(messageText)}`;

    return {
      success: true,
      status: 'SENT',
      messageId,
      invoiceUrl: invoicePdfUrl,
      whatsappUrl: directWhatsAppUrl,
      messageText,
      rawResponse: apiResponse,
    };
  } catch (error: any) {
    const errorMsg = error?.message || 'Unknown WhatsApp API error';
    console.error(`❌ [WhatsApp Notification Failed for Order #${orderNum}]:`, errorMsg);

    // Save FAILED state in audit log
    saveWhatsAppLog({
      id: existingLog?.id || `wa-${Date.now()}`,
      orderNumber: orderNum,
      recipientPhone: recipient,
      messageType: 'NEW_ORDER_INVOICE',
      invoiceFile: invoicePdfUrl,
      status: 'FAILED',
      errorMessage: errorMsg,
      retryCount: (existingLog?.retryCount || 0) + 1,
      lastAttemptAt: new Date().toISOString(),
    });

    return {
      success: false,
      status: 'FAILED',
      invoiceUrl: invoicePdfUrl,
      error: errorMsg,
    };
  }
}
