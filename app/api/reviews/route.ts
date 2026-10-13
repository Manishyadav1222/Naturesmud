import { NextRequest, NextResponse } from 'next/server';

const REVIEWS_PHP_URL = 'https://api.naturesmud.shop/reviews-api.php';

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product') || '';
  if (!product) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const res = await fetch(`${REVIEWS_PHP_URL}?product=${encodeURIComponent(product)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ success: true, data: [] });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      productSlug,
      orderNumber,
      customerName,
      customerPhone,
      rating,
      title,
      content,
      images,
    } = body || {};

    if (!orderNumber || !customerName || !content || !rating) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order Number, Customer Name, Rating, and Review text are required.',
        },
        { status: 400 }
      );
    }

    const numRating = Math.max(1, Math.min(5, Number(rating) || 5));

    const res = await fetch(REVIEWS_PHP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: String(productId || ''),
        productSlug: String(productSlug || ''),
        orderNumber: String(orderNumber).trim().toUpperCase(),
        customerName: String(customerName).trim().slice(0, 100),
        customerPhone: String(customerPhone || '').trim().slice(0, 30),
        rating: numRating,
        title: String(title || '').trim().slice(0, 180),
        content: String(content).trim().slice(0, 3000),
        images: Array.isArray(images) ? images.slice(0, 2) : [],
      }),
    });

    const data = await res.json().catch(() => null);
    if (data) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      message:
        'Thank you! Your order-linked review has been received and queued for verification.',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || 'Unable to submit review at this time.',
      },
      { status: 500 }
    );
  }
}
