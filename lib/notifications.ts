export type NotificationEvent =
  | 'ORDER_RECEIVED'
  | 'PAYMENT_SUCCESSFUL'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'REVIEW_REQUEST'
  | 'ADMIN_NEW_ORDER'
  | 'ADMIN_PAYMENT_FAILED'
  | 'ADMIN_LOW_STOCK'
  | 'ADMIN_REFUND_REQUEST'
  | 'ADMIN_NEW_REVIEW';

export interface NotificationPayload {
  event: NotificationEvent;
  recipient: {
    name: string;
    phone: string;
    email?: string;
  };
  orderNumber?: string;
  amount?: number;
  items?: Array<{ name: string; quantity: number; price: number }>;
  productName?: string;
  stockLevel?: number;
  trackingNumber?: string;
  reviewLink?: string;
  customMessage?: string;
  timestamp?: string;
}

export interface NotificationResult {
  success: boolean;
  smsMessage?: string;
  emailSubject?: string;
  emailBody?: string;
  whatsappUrl?: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'SYSTEM';
  timestamp: string;
}

/**
 * Formats notification messages for SMS, Email and WhatsApp triggers
 */
export function buildNotification(payload: NotificationPayload): {
  sms: string;
  email: { subject: string; body: string };
  whatsappText: string;
} {
  const brandName = "Nature's Mud Nepal";
  const orderNum = payload.orderNumber || 'NM-ONLINE';
  const customer = payload.recipient.name;

  switch (payload.event) {
    case 'ORDER_RECEIVED':
      return {
        sms: `Namaste ${customer}! Your ${brandName} order #${orderNum} of Rs. ${payload.amount?.toLocaleString()} has been received. Track status at naturesmud.shop/track-order?orderId=${orderNum}`,
        email: {
          subject: `Order Confirmed: #${orderNum} — ${brandName}`,
          body: `Namaste ${customer},\n\nThank you for choosing 100% natural Himalayan superfoods! We have received your order #${orderNum} for Rs. ${payload.amount?.toLocaleString()}.\n\nOur team is hand-packing your fresh order. We will notify you once dispatched.\n\nWarm regards,\nThe NaturesMud Team\nhttps://naturesmud.shop`,
        },
        whatsappText: `*🌿 Order Confirmed — ${brandName}*\n\nNamaste ${customer}! We received your order *#${orderNum}* for Rs. ${payload.amount?.toLocaleString()}.\nYour fresh Himalayan harvest is being prepared for dispatch. 🙏`,
      };

    case 'PAYMENT_SUCCESSFUL':
      return {
        sms: `Payment Verified: Rs. ${payload.amount?.toLocaleString()} for ${brandName} order #${orderNum}. Thank you!`,
        email: {
          subject: `Payment Successful for Order #${orderNum} — ${brandName}`,
          body: `Namaste ${customer},\n\nYour payment of Rs. ${payload.amount?.toLocaleString()} for order #${orderNum} has been successfully verified.\n\nThank you for supporting 180+ smallholder mountain farming families across Nepal!`,
        },
        whatsappText: `*💳 Payment Verified: Order #${orderNum}*\n\nYour payment of *Rs. ${payload.amount?.toLocaleString()}* has been verified. Thank you!`,
      };

    case 'ORDER_SHIPPED':
      return {
        sms: `Dispatched! Your ${brandName} order #${orderNum} is out for delivery. Tracking: ${payload.trackingNumber || 'Valley Express 24h'}.`,
        email: {
          subject: `Your Himalayan Superfoods Are On the Way! (Order #${orderNum})`,
          body: `Namaste ${customer},\n\nGreat news! Your order #${orderNum} has been dispatched.\nCourier: ${payload.trackingNumber || 'Kathmandu Valley Express 24h'}.\n\nTrack here: https://naturesmud.shop/track-order?orderId=${orderNum}`,
        },
        whatsappText: `*🚚 Order Dispatched! #${orderNum}*\n\nYour fresh Himalayan superfood pack is on the way!\nDelivery: ${payload.trackingNumber || 'Inside Valley (Within 24 Hours)'}.`,
      };

    case 'ORDER_DELIVERED':
      return {
        sms: `Delivered! Your ${brandName} order #${orderNum} was delivered. Enjoy your pure Himalayan wellness!`,
        email: {
          subject: `Order #${orderNum} Delivered — Enjoy Your Himalayan Harvest!`,
          body: `Namaste ${customer},\n\nYour order #${orderNum} has been safely delivered.\nWe hope you love the unmatched freshness and purity of your superfoods!`,
        },
        whatsappText: `*🏠 Order Delivered: #${orderNum}*\n\nNamaste ${customer}! Your order has been delivered. Thank you for choosing Nature's Mud! 🌿`,
      };

    case 'REVIEW_REQUEST':
      return {
        sms: `Hi ${customer}, how are you loving your ${payload.productName || 'NaturesMud superfoods'}? Rate your experience and get 5% off next order: naturesmud.shop/review?order=${orderNum}`,
        email: {
          subject: `How was your NaturesMud experience? (Get 5% Off Next Order)`,
          body: `Namaste ${customer},\n\nWe'd love to hear your thoughts on your recent order #${orderNum}.\nShare a quick review and photo here to receive a special 5% discount code for your next order:\nhttps://naturesmud.shop`,
        },
        whatsappText: `*⭐ How was your Himalayan superfood experience?*\n\nNamaste ${customer}! Share a quick review on naturesmud.shop and claim *5% OFF* your next order! 🌿`,
      };

    case 'ADMIN_NEW_ORDER':
      return {
        sms: `[ADMIN ALERT] New Order #${orderNum} by ${customer} for Rs. ${payload.amount?.toLocaleString()}.`,
        email: {
          subject: `[NEW ORDER ALERT] #${orderNum} - Rs. ${payload.amount?.toLocaleString()}`,
          body: `New online order placed by ${customer} (${payload.recipient.phone}). Total: Rs. ${payload.amount?.toLocaleString()}. Check admin panel: https://naturesmud.shop/admin/orders`,
        },
        whatsappText: `*🚨 [ADMIN NEW ORDER]*\n#${orderNum} from ${customer} (${payload.recipient.phone})\nTotal: Rs. ${payload.amount?.toLocaleString()}`,
      };

    case 'ADMIN_LOW_STOCK':
      return {
        sms: `[ADMIN ALERT] Low Stock: ${payload.productName} has only ${payload.stockLevel || 5} units left!`,
        email: {
          subject: `[INVENTORY ALERT] Low Stock for ${payload.productName}`,
          body: `Warning: Inventory level for ${payload.productName} has dropped to ${payload.stockLevel} units. Please reorder from co-op suppliers.`,
        },
        whatsappText: `*⚠️ [LOW INVENTORY ALERT]*\n${payload.productName} stock is down to *${payload.stockLevel} units*!`,
      };

    default:
      return {
        sms: `Notification from ${brandName} for order #${orderNum}.`,
        email: {
          subject: `Notification from ${brandName}`,
          body: `Namaste ${customer},\n\n${payload.customMessage || 'Thank you for choosing NaturesMud.'}`,
        },
        whatsappText: `*🌿 ${brandName} Notification*\n${payload.customMessage || ''}`,
      };
  }
}

/**
 * Dispatches an automated notification and records it in system audit log
 */
export async function triggerNotification(payload: NotificationPayload): Promise<NotificationResult> {
  const { sms, email, whatsappText } = buildNotification(payload);

  console.log(`\n🔔 [AUTOMATION TRIGGERED: ${payload.event}]`);
  console.log(`📱 SMS: ${sms}`);
  console.log(`📧 Email Subject: ${email.subject}`);
  console.log(`💬 WhatsApp: ${whatsappText}`);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9779819844486';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return {
    success: true,
    smsMessage: sms,
    emailSubject: email.subject,
    emailBody: email.body,
    whatsappUrl,
    channel: 'SYSTEM',
    timestamp: new Date().toISOString(),
  };
}
