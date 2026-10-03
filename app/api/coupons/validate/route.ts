import { NextRequest, NextResponse } from 'next/server';
import { validateCouponCode } from '@/lib/coupons';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body?.code || '').trim();
    const subtotal = Number(body?.subtotal ?? body?.order_amount ?? 0);

    const result = validateCouponCode(code, subtotal);

    if (!result.valid || !result.coupon) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 }
      );
    }

    const mappedType = result.coupon.type === 'percent' ? 'percentage' : 'fixed';

    return NextResponse.json({
      success: true,
      message: result.message,
      coupon: {
        code: result.coupon.code,
        type: mappedType,
        value: result.coupon.value,
        minOrderAmount: result.coupon.minOrderAmount,
        maxDiscountAmount: result.coupon.maxDiscountAmount,
        discountAmount: result.discountAmount,
        description: result.coupon.description,
      },
      data: {
        code: result.coupon.code,
        discount_type: result.coupon.type,
        discount_value: result.coupon.value,
        discount_amount: result.discountAmount,
        min_order_amount: result.coupon.minOrderAmount,
        description: result.coupon.description,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to validate coupon code.',
      },
      { status: 500 }
    );
  }
}
