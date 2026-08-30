import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notification-service';
import { getWhatsAppLogByOrder, getAllWhatsAppLogs } from '@/lib/whatsapp-log-store';
import { InvoiceOrderInput } from '@/lib/invoice-pdf';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const log = getWhatsAppLogByOrder(id);

    return NextResponse.json({
      success: true,
      data: log || {
        orderNumber: id,
        status: 'NOT_SENT',
        retryCount: 0,
        message: 'No WhatsApp notification has been triggered for this order yet.',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { forceResend = true, orderData } = body;

    // Use passed order details or construct minimal order
    const orderInput: InvoiceOrderInput = {
      orderNumber: id,
      customerName: orderData?.customerName || orderData?.shipping_name || 'Valued Customer',
      customerPhone: orderData?.customerPhone || orderData?.shipping_phone || '9800000000',
      customerEmail: orderData?.customerEmail || orderData?.shipping_email,
      shippingAddress: orderData?.shippingAddress || orderData?.shipping_address || 'Kathmandu, Nepal',
      shippingCity: orderData?.shippingCity || orderData?.shipping_city || 'Kathmandu',
      isValley: typeof orderData?.isValley !== 'undefined' ? orderData.isValley : true,
      paymentMethod: orderData?.paymentMethod || orderData?.payment_method || 'COD',
      paymentStatus: orderData?.paymentStatus || orderData?.payment_status || 'PENDING',
      paymentReference: orderData?.paymentReference || orderData?.payment_reference,
      subtotal: Number(orderData?.subtotal || orderData?.total || 1500),
      discount: Number(orderData?.discount || 0),
      shippingFee: Number(orderData?.shippingFee || orderData?.shipping_fee || 0),
      total: Number(orderData?.total || orderData?.grandTotal || 1500),
      items: Array.isArray(orderData?.items)
        ? orderData.items.map((it: any) => ({
            name: it.name || it.productName || it.product_name || 'Himalayan Superfood Item',
            quantity: Number(it.quantity || 1),
            price: Number(it.price || it.unitPrice || it.unit_price || 500),
          }))
        : [{ name: 'Himalayan Superfood Harvest', quantity: 1, price: 1500 }],
    };

    const result = await NotificationService.WhatsApp.sendNewOrder(orderInput, { forceResend });

    return NextResponse.json({
      success: result.success,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
