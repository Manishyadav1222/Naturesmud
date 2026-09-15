import { NextRequest, NextResponse } from 'next/server';
import { generateInvoicePdfBuffer, InvoiceOrderInput, InvoiceItemInput } from '@/lib/invoice-pdf';
import { products } from '@/lib/data/products';

function resolveItemWeightAndName(rawName: string, rawWeight?: string, sku?: string) {
  const query = (rawName || '').trim().toLowerCase();
  const matched = products.find(
    (p) =>
      p.name.toLowerCase() === query ||
      p.slug.toLowerCase() === query ||
      p.id.toLowerCase() === query ||
      (sku && (p.slug.toLowerCase() === sku.toLowerCase() || p.id === sku))
  );

  const finalName = rawName || matched?.name || 'Himalayan Superfood Product';
  let weight = rawWeight || matched?.weight || '100 GM';
  if (weight && /^\d+(\.00)?$/.test(String(weight).trim())) {
    weight = `${parseFloat(String(weight))} GM`;
  }
  return { name: finalName, weight };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cleanId = id.trim();
    const url = new URL(req.url);

    const isDownload =
      url.searchParams.get('download') === '1' ||
      url.searchParams.get('download') === 'true';

    // 1. Check if client passed rich serialized order payload in query param `data`
    let passedOrder: any = null;
    const dataParam = url.searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = dataParam.startsWith('{')
          ? dataParam
          : Buffer.from(dataParam, 'base64').toString('utf-8');
        passedOrder = JSON.parse(decoded);
      } catch {
        // Continue to fallback
      }
    }

    // 2. If no serialized payload, attempt to look up the order from backend API
    let dbOrder: any = null;
    if (!passedOrder) {
      try {
        const backendUrls = [
          `https://api.naturesmud.shop/api/v1/orders/lookup/${encodeURIComponent(cleanId)}`,
          `http://localhost:8000/api/v1/orders/lookup/${encodeURIComponent(cleanId)}`,
        ];

        for (const endpoint of backendUrls) {
          try {
            const res = await fetch(endpoint, {
              headers: { Accept: 'application/json' },
              next: { revalidate: 0 },
            });
            if (res.ok) {
              dbOrder = await res.json();
              if (dbOrder && (dbOrder.order_number || dbOrder.id)) {
                break;
              }
            }
          } catch {
            // Try next endpoint
          }
        }
      } catch {
        // Backend lookup non-blocking
      }
    }

    // 3. Extract items and details with full product information
    const source = passedOrder || dbOrder;

    const customerName =
      source?.customerName ||
      source?.shipping_name ||
      url.searchParams.get('name') ||
      'Valued Customer';

    const customerPhone =
      source?.customerPhone ||
      source?.shipping_phone ||
      url.searchParams.get('phone') ||
      '+977-9713888002';

    const customerEmail =
      source?.customerEmail ||
      source?.shipping_email ||
      url.searchParams.get('email') ||
      undefined;

    const shippingAddress =
      source?.shippingAddress ||
      source?.shipping_address ||
      url.searchParams.get('address') ||
      'Kathmandu Valley';

    const shippingCity =
      source?.shippingCity ||
      source?.shipping_city ||
      url.searchParams.get('city') ||
      'Kathmandu';

    const paymentMethod =
      source?.paymentMethod ||
      source?.payment_method ||
      url.searchParams.get('paymentMethod') ||
      url.searchParams.get('payment') ||
      'COD';

    const paymentStatus =
      source?.paymentStatus ||
      source?.payment_status ||
      url.searchParams.get('paymentStatus') ||
      (paymentMethod.toLowerCase() === 'fonepay' ? 'PAID' : 'PENDING');

    const paymentReference =
      source?.paymentReference ||
      source?.payment_reference ||
      url.searchParams.get('paymentReference') ||
      url.searchParams.get('ref') ||
      undefined;

    const isValley =
      typeof source?.isValley !== 'undefined'
        ? Boolean(source.isValley)
        : typeof source?.is_valley !== 'undefined'
        ? Boolean(source.is_valley)
        : shippingCity.toLowerCase().includes('kathmandu') ||
          shippingCity.toLowerCase().includes('lalitpur') ||
          shippingCity.toLowerCase().includes('bhaktapur');

    let subtotal = Number(
      source?.subtotal || url.searchParams.get('subtotal') || 0
    );
    let shippingFee = Number(
      source?.shippingFee ||
        source?.shipping_fee ||
        url.searchParams.get('shipping') ||
        (isValley ? 100 : 200)
    );
    const discount = Number(
      source?.discount || url.searchParams.get('discount') || 0
    );
    let total = Number(source?.total || url.searchParams.get('total') || 0);

    // Build line items
    let rawItems: any[] = [];
    if (source && Array.isArray(source.items) && source.items.length > 0) {
      rawItems = source.items;
    } else {
      const itemsParam = url.searchParams.get('items');
      if (itemsParam) {
        try {
          rawItems = JSON.parse(itemsParam);
        } catch {
          // invalid items json
        }
      }
    }

    let items: InvoiceItemInput[] = [];

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      items = rawItems.map((it: any) => {
        const rawName =
          it.name ||
          it.product_name ||
          it.productName ||
          'Himalayan Superfood Item';
        const rawWeight = it.weight || it.product?.weight;
        const sku = it.product_sku || it.sku;
        const { name, weight } = resolveItemWeightAndName(
          rawName,
          rawWeight,
          sku
        );
        const qty = Number(it.quantity || 1);
        const price = Number(it.price || it.unit_price || it.unitPrice || 0);

        return {
          name,
          weight,
          sku: sku || undefined,
          quantity: qty,
          price,
        };
      });
    }

    // If still no items, fallback gracefully to catalog item with actual name
    if (items.length === 0) {
      const calculatedTotal = total > 0 ? total : 1500;
      items = [
        {
          name: 'NaturesMud Himalayan Pure Organic Superfoods Package',
          weight: '100 GM',
          quantity: 1,
          price: calculatedTotal,
        },
      ];
      if (subtotal === 0) subtotal = calculatedTotal;
      if (total === 0) total = calculatedTotal;
    }

    if (subtotal === 0) {
      subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    }
    if (subtotal >= 3000) {
      shippingFee = 0;
    }
    if (total === 0) {
      total = Math.max(0, subtotal - discount + shippingFee);
    }

    const orderInput: InvoiceOrderInput = {
      orderNumber: cleanId.startsWith('#') ? cleanId : `#${cleanId}`,
      createdAt: source?.created_at || source?.createdAt || new Date(),
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      shippingCity,
      isValley,
      paymentMethod,
      paymentStatus,
      paymentReference,
      subtotal,
      discount,
      shippingFee,
      total,
      items,
    };

    const pdfBuffer = await generateInvoicePdfBuffer(orderInput);

    const dispositionType = isDownload ? 'attachment' : 'inline';
    const filenameClean = cleanId.replace(/[^a-zA-Z0-9_-]/g, '');

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${dispositionType}; filename="NaturesMud-Invoice-${filenameClean}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
