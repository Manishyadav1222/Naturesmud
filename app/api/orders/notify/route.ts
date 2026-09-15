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

    const cleanOrderNumber = String(orderNumber).replace(/[^a-zA-Z0-9_-]/g, '');
    let itemsText = '';
    if (Array.isArray(items) && items.length > 0) {
      itemsText = items
        .map((it: any, i: number) => {
          const name = it.name || it.product_name || `Item ${i + 1}`;
          let rawWeight = it.weight ? String(it.weight).trim() : '';
          if (rawWeight && /^\d+(\.00)?$/.test(rawWeight)) {
            rawWeight = `${parseFloat(rawWeight)} GM`;
          }
          const weightStr = rawWeight ? ` (${rawWeight})` : '';
          const qty = it.quantity || 1;
          const price = it.price || it.unit_price || 0;
          return `  ${i + 1}. *${name}${weightStr}* x${qty} = Rs. ${(price * qty).toLocaleString()}`;
        })
        .join('\n');
    }

    // Format rich WhatsApp message
    const waLines = [
      `*🌿 NATURE'S MUD NEPAL — OFFICIAL ORDER NOTIFICATION*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 *Order Reference:* #${cleanOrderNumber}`,
      `👤 *Customer Name:* ${customerName}`,
      `📱 *Mobile Phone:* ${customerPhone}`,
      customerEmail ? `📧 *Email:* ${customerEmail}` : null,
      `📍 *Destination:* ${destination}`,
      fullAddress ? `🏠 *Address:* ${fullAddress}` : null,
      ``,
      itemsText ? `🛒 *Items Ordered:*\n${itemsText}\n` : null,
      `━━━━━━━━━━━━━━━━━━━━`,
      `💰 *Subtotal:* Rs. ${Number(subtotal || total).toLocaleString()}`,
      discount && discount > 0 ? `🏷️ *Discount:* - Rs. ${Number(discount).toLocaleString()}` : null,
      `🚚 *Delivery Fee:* ${!shippingFee || Number(shippingFee) === 0 ? 'FREE (Order > Rs. 3,000)' : `Rs. ${Number(shippingFee).toLocaleString()}`}`,
      `💵 *FINAL TOTAL:* *Rs. ${Number(total).toLocaleString()}*`,
      `💳 *Payment Method:* ${formattedPayment}`,
      hasReceipt ? `🧾 *Payment Receipt Slip:* ${receiptUrl || 'Attached'}` : null,
      paymentReference ? `🔢 *Reference ID:* ${paymentReference}` : null,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📄 *Download Official PDF Invoice:* https://naturesmud.shop/api/orders/${encodeURIComponent(cleanOrderNumber)}/invoice`,
      `🚚 *Track Order Live:* https://naturesmud.shop/track-order?number=${encodeURIComponent(cleanOrderNumber)}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Please confirm my order and share the dispatch tracking details. Dhanyabad! 🙏`,
    ]
      .filter(Boolean)
      .join('\n');

    let rawNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9779713888002').replace(/[^0-9]/g, '');
    if (rawNumber.startsWith('977977')) {
      rawNumber = rawNumber.substring(3);
    }
    if (rawNumber.length === 10 && (rawNumber.startsWith('98') || rawNumber.startsWith('97'))) {
      rawNumber = '977' + rawNumber;
    }
    const whatsappNumber = rawNumber;
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

    // Trigger Official WhatsApp Business Platform Cloud API Invoice Notification
    try {
      const { NotificationService } = await import('@/lib/notification-service');
      const orderInput = {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        shippingCity,
        isValley,
        paymentMethod,
        paymentStatus: hasReceipt ? 'PAID' : 'PENDING',
        paymentReference,
        subtotal: Number(subtotal || total),
        discount: Number(discount || 0),
        shippingFee: Number(shippingFee || 0),
        total: Number(total),
        items: Array.isArray(items)
          ? items.map((it: any) => ({
              name: it.name || it.product_name || 'Himalayan Superfood Item',
              quantity: Number(it.quantity || 1),
              price: Number(it.price || it.unit_price || 0),
            }))
          : [],
      };

      // Non-blocking trigger
      NotificationService.WhatsApp.sendNewOrder(orderInput).catch((waErr) => {
        console.error('Non-blocking WhatsApp Cloud API error:', waErr);
      });
    } catch (waServiceErr) {
      console.error('Non-blocking WhatsApp Notification Service error:', waServiceErr);
    }

    // Trigger Notification Automations (Customer confirmation + Admin order alert)
    try {
      const { triggerNotification } = await import('@/lib/notifications');
      await triggerNotification({
        event: 'ORDER_RECEIVED',
        recipient: { name: customerName, phone: customerPhone, email: customerEmail },
        orderNumber,
        amount: Number(total),
        items: items,
      });
      await triggerNotification({
        event: 'ADMIN_NEW_ORDER',
        recipient: { name: customerName, phone: customerPhone, email: customerEmail },
        orderNumber,
        amount: Number(total),
        items: items,
      });
    } catch (notifErr) {
      console.error('Non-blocking notification trigger error:', notifErr);
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


