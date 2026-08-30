import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      shippingCity,
      items,
      total,
      subtotal,
      discount,
      shippingFee,
      paymentMethod,
      isValley,
      hasReceipt,
      receiptUrl,
      paymentReference,
    } = body;

    const formattedPayment = paymentMethod ? String(paymentMethod).toUpperCase() : 'COD';
    const destination = isValley ? 'Inside Kathmandu Valley (1-2 Days)' : 'Outside Valley Courier (2-4 Days)';
    const fullAddress = [shippingAddress, shippingCity].filter(Boolean).join(', ');

    console.log(`\n========================================`);
    console.log(`📦 [REAL-TIME ORDER NOTIFICATION] #${orderNumber}`);
    console.log(`👤 Customer: ${customerName} (${customerPhone})`);
    console.log(`📍 Delivery: ${destination} — ${fullAddress}`);
    console.log(`💳 Payment: ${formattedPayment} | Total: Rs. ${total}`);
    if (hasReceipt && receiptUrl) {
      console.log(`🧾 Payment Receipt: ${receiptUrl}`);
    }
    console.log(`========================================\n`);

    // Build line items breakdown for WhatsApp message
    let itemsText = '';
    if (Array.isArray(items) && items.length > 0) {
      itemsText = items
        .map((it: any, i: number) => {
          const name = it.name || it.product_name || `Item ${i + 1}`;
          const qty = it.quantity || 1;
          const price = it.price || it.unit_price || 0;
          return `  ${i + 1}. ${name} x${qty} - Rs. ${(price * qty).toLocaleString()}`;
        })
        .join('\n');
    }

    // Format rich WhatsApp message
    const waLines = [
      `*🌿 Namaste NaturesMud Nepal!*`,
      ``,
      `I have just placed an order on your website:`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 *Order:* #${orderNumber}`,
      `👤 *Customer:* ${customerName}`,
      `📱 *Phone:* ${customerPhone}`,
      customerEmail ? `📧 *Email:* ${customerEmail}` : null,
      `📍 *Destination:* ${destination}`,
      fullAddress ? `🏠 *Address:* ${fullAddress}` : null,
      ``,
      itemsText ? `🛒 *Items Ordered:*\n${itemsText}\n` : null,
      `💳 *Payment Method:* ${formattedPayment}`,
      hasReceipt ? `🧾 *Payment Receipt Slip:* ${receiptUrl || 'Attached'}` : null,
      paymentReference ? `🔢 *Reference ID:* ${paymentReference}` : null,
      `💰 *Total Amount:* Rs. ${Number(total).toLocaleString()}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Please confirm my order and share the dispatch tracking details. Dhanyabad! 🙏`,
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9779713888002';
    const waText = encodeURIComponent(waLines);
    const waLink = `https://wa.me/${whatsappNumber}?text=${waText}`;

    // Optionally notify admin backend if active
    try {
      const adminBase = process.env.INTERNAL_ADMIN_API_URL || process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://127.0.0.1:4001/api/admin';
      await fetch(`${adminBase}/orders/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: 'Order notification registered.',
      whatsappLink: waLink,
      whatsappNumber,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
