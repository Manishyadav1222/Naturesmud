import {
  sendOrderInvoiceWhatsAppNotification,
  SendWhatsAppResult,
  getWhatsAppConfig,
  formatWhatsAppRecipient,
  sendMetaCloudApiMessage,
} from './whatsapp-service';
import { InvoiceOrderInput } from './invoice-pdf';
import { saveWhatsAppLog, getWhatsAppLogByOrder, WhatsAppDeliveryStatus } from './whatsapp-log-store';

export class NotificationService {
  /**
   * Official WhatsApp Business Platform Notifications
   */
  static WhatsApp = {
    /**
     * Sends new order notification with attached PDF invoice to business WhatsApp
     */
    async sendNewOrder(order: InvoiceOrderInput, options?: { forceResend?: boolean }): Promise<SendWhatsAppResult> {
      return sendOrderInvoiceWhatsAppNotification(order, options);
    },

    /**
     * Sends payment confirmation notification
     */
    async sendPaymentConfirmation(
      order: InvoiceOrderInput,
      options?: { recipientOverride?: string }
    ): Promise<SendWhatsAppResult> {
      const config = getWhatsAppConfig();
      const recipient = formatWhatsAppRecipient(options?.recipientOverride || order.customerPhone);
      const text = [
        `*💳 Payment Verified — Nature's Mud Nepal*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Namaste ${order.customerName}!`,
        `Your payment of *Rs. ${Number(order.total).toLocaleString()}* for order *#${order.orderNumber}* has been verified.`,
        `Our mountain co-op team is preparing your fresh harvest for dispatch. 🙏`,
      ].join('\n');

      return this.sendCustomMessage(order.orderNumber, recipient, 'PAYMENT_CONFIRMATION', text);
    },

    /**
     * Sends order dispatched / shipping tracking WhatsApp message
     */
    async sendOrderShipped(
      order: InvoiceOrderInput,
      trackingInfo?: string,
      options?: { recipientOverride?: string }
    ): Promise<SendWhatsAppResult> {
      const recipient = formatWhatsAppRecipient(options?.recipientOverride || order.customerPhone);
      const text = [
        `*🚚 Order Dispatched — Nature's Mud Nepal*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Namaste ${order.customerName}!`,
        `Your order *#${order.orderNumber}* has been dispatched.`,
        `Courier / Tracking: ${trackingInfo || 'Kathmandu Valley Express 24h'}`,
        `Track live here: https://naturesmud.shop/track-order?orderId=${order.orderNumber}`,
      ].join('\n');

      return this.sendCustomMessage(order.orderNumber, recipient, 'ORDER_SHIPPED', text);
    },

    /**
     * Sends order delivered WhatsApp message
     */
    async sendOrderDelivered(
      order: InvoiceOrderInput,
      options?: { recipientOverride?: string }
    ): Promise<SendWhatsAppResult> {
      const recipient = formatWhatsAppRecipient(options?.recipientOverride || order.customerPhone);
      const text = [
        `*🏠 Order Delivered — Nature's Mud Nepal*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Namaste ${order.customerName}!`,
        `Your order *#${order.orderNumber}* has been safely delivered.`,
        `Enjoy your 100% pure Himalayan superfoods! 🌿`,
      ].join('\n');

      return this.sendCustomMessage(order.orderNumber, recipient, 'ORDER_DELIVERED', text);
    },

    /**
     * Helper to send and log custom WhatsApp notifications
     */
    async sendCustomMessage(
      orderNumber: string,
      recipientPhone: string,
      messageType: 'PAYMENT_CONFIRMATION' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'CUSTOM',
      text: string
    ): Promise<SendWhatsAppResult> {
      const config = getWhatsAppConfig();
      try {
        let messageId: string | undefined;
        let apiResponse: any = null;

        if (config.accessToken && config.phoneNumberId) {
          const payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipientPhone,
            type: 'text',
            text: { preview_url: true, body: text },
          };
          apiResponse = await sendMetaCloudApiMessage(recipientPhone, payload, config);
          messageId = apiResponse?.messages?.[0]?.id;
        } else {
          console.log(`[WHATSAPP NOTIFICATION MOCK] -> ${recipientPhone}\n${text}`);
          messageId = `mock-${Date.now()}`;
          apiResponse = { mock: true, messageId };
        }

        saveWhatsAppLog({
          id: `wa-${Date.now()}`,
          orderNumber,
          recipientPhone,
          messageType,
          status: 'SENT',
          whatsappMessageId: messageId,
          apiResponse,
          sentAt: new Date().toISOString(),
          retryCount: 1,
          lastAttemptAt: new Date().toISOString(),
        });

        return { success: true, status: 'SENT', messageId, rawResponse: apiResponse };
      } catch (err: any) {
        saveWhatsAppLog({
          id: `wa-${Date.now()}`,
          orderNumber,
          recipientPhone,
          messageType,
          status: 'FAILED',
          errorMessage: err?.message,
          retryCount: 1,
          lastAttemptAt: new Date().toISOString(),
        });

        return { success: false, status: 'FAILED', error: err?.message };
      }
    },
  };

  /**
   * Future-ready Email Provider
   */
  static Email = {
    async sendOrderConfirmation(order: InvoiceOrderInput) {
      console.log(`[EMAIL DISPATCH] Order confirmation to ${order.customerEmail || order.customerPhone}`);
      return { success: true };
    },
  };

  /**
   * Future-ready SMS Provider (Sparrow / Aakash SMS Nepal)
   */
  static SMS = {
    async sendOrderSms(phone: string, text: string) {
      console.log(`[SMS DISPATCH] To: ${phone} | Text: ${text}`);
      return { success: true };
    },
  };
}
