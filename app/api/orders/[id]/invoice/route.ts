import { NextRequest, NextResponse } from 'next/server';
import { generateInvoicePdfBuffer, InvoiceOrderInput } from '@/lib/invoice-pdf';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(req.url);

    // Optional query params to populate invoice dynamically if not in DB
    const name = url.searchParams.get('name') || 'Valued Customer';
    const phone = url.searchParams.get('phone') || '+977 9800000000';
    const address = url.searchParams.get('address') || 'Kathmandu Valley';
    const total = Number(url.searchParams.get('total')) || 1500;

    const orderInput: InvoiceOrderInput = {
      orderNumber: id,
      customerName: name,
      customerPhone: phone,
      shippingAddress: address,
      shippingCity: 'Kathmandu',
      isValley: true,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      subtotal: total,
      total: total,
      items: [{ name: 'Himalayan Superfood Harvest Package', quantity: 1, price: total }],
    };

    const pdfBuffer = await generateInvoicePdfBuffer(orderInput);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Invoice-${id}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
