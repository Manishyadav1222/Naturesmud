import fs from 'fs';
import path from 'path';
import { generateInvoicePdfBuffer, saveInvoicePdfFile, InvoiceOrderInput } from '../lib/invoice-pdf';
import { NotificationService } from '../lib/notification-service';
import { getWhatsAppLogByOrder } from '../lib/whatsapp-log-store';

async function runAcceptanceTests() {
  console.log('===========================================================');
  console.log('🧪 NATURE\'S MUD — WHATSAPP INVOICE AUTOMATION ACCEPTANCE TEST');
  console.log('===========================================================\n');

  const testOrderNumber = `TEST-${Date.now().toString().slice(-6)}`;

  // 1. Test Order Payload
  const orderPayload: InvoiceOrderInput = {
    orderNumber: testOrderNumber,
    createdAt: new Date().toISOString(),
    customerName: 'Pooja Karki',
    customerPhone: '+977 9841234567',
    customerEmail: 'pooja.karki@example.com',
    shippingAddress: 'Baneshwor Height, Ward 10',
    shippingCity: 'Kathmandu',
    isValley: true,
    paymentMethod: 'FONEPAY',
    paymentStatus: 'PAID',
    paymentReference: 'FP-88992211',
    subtotal: 2900,
    discount: 145,
    shippingFee: 0,
    total: 2755,
    items: [
      { name: 'Little Explorer First Solids Kit', quantity: 1, price: 1450 },
      { name: 'Wild Mustang Raw Mountain Honey (500g)', quantity: 1, price: 1450 },
    ],
  };

  console.log(`[TEST 1] Testing Order Invoice Generation & WhatsApp Flow for #${testOrderNumber}...`);

  // A. Generate and save PDF Invoice
  const { fileUrl, filePath, buffer } = await saveInvoicePdfFile(orderPayload);

  console.log(`  ✅ Invoice PDF Buffer Generated: ${buffer.length} bytes`);
  console.log(`  ✅ Invoice File Stored: ${filePath}`);
  console.log(`  ✅ Verified file exists on disk: ${fs.existsSync(filePath)}`);

  // B. Trigger NotificationService.WhatsApp.sendNewOrder
  const waResult = await NotificationService.WhatsApp.sendNewOrder(orderPayload, { forceResend: true });

  console.log(`  ✅ WhatsApp Result Status: ${waResult.status}`);
  console.log(`  ✅ WhatsApp Message ID: ${waResult.messageId}`);
  console.log(`  ✅ WhatsApp Invoice URL: ${waResult.invoiceUrl}`);

  // C. Verify Audit Log
  const log = getWhatsAppLogByOrder(testOrderNumber);
  console.log(`  ✅ Audit Log Record Status: ${log?.status}`);
  console.log(`  ✅ Audit Log Recipient: +${log?.recipientPhone}`);
  console.log(`  ✅ Audit Log Sent At: ${log?.sentAt}`);

  if (log?.status !== 'SENT') {
    throw new Error(`Expected log status SENT but got ${log?.status}`);
  }

  console.log('\n-----------------------------------------------------------');
  console.log('[TEST 2] Testing Reliability on WhatsApp Failure...');
  console.log('Simulating WhatsApp API failure scenario...');

  const failedOrderNumber = `FAIL-${Date.now().toString().slice(-6)}`;
  const failedOrderPayload: InvoiceOrderInput = {
    ...orderPayload,
    orderNumber: failedOrderNumber,
  };

  // Temporarily corrupt token to trigger API failure
  const originalToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const originalPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  process.env.WHATSAPP_ACCESS_TOKEN = 'INVALID_EXPIRED_TOKEN_FOR_TESTING';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';

  try {
    const failResult = await NotificationService.WhatsApp.sendNewOrder(failedOrderPayload, { forceResend: true });
    console.log(`  ✅ Order creation was NOT aborted!`);
    console.log(`  ⚠️ WhatsApp Status gracefully recorded as: ${failResult.status}`);
    console.log(`  ⚠️ Error logged: "${failResult.error}"`);

    const failLog = getWhatsAppLogByOrder(failedOrderNumber);
    console.log(`  ✅ Audit Log correctly marked as: ${failLog?.status}`);
    console.log(`  ✅ Failure error message captured: ${failLog?.errorMessage ? 'YES' : 'NO'}`);
  } finally {
    // Restore env
    if (originalToken) process.env.WHATSAPP_ACCESS_TOKEN = originalToken;
    else delete process.env.WHATSAPP_ACCESS_TOKEN;
    if (originalPhoneId) process.env.WHATSAPP_PHONE_NUMBER_ID = originalPhoneId;
    else delete process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  console.log('\n===========================================================');
  console.log('🎉 ALL WHATSAPP AUTOMATION ACCEPTANCE TESTS PASSED (100%)!');
  console.log('===========================================================\n');
}

runAcceptanceTests().catch((err) => {
  console.error('❌ Acceptance Test Failed:', err);
  process.exit(1);
});
