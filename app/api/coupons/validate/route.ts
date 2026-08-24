import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal = 0 } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Coupon code is required.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Connect to database
    let conn;
    try {
      conn = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USERNAME || 'naturesmud',
        password: process.env.DB_PASSWORD || 'secret',
        database: process.env.DB_DATABASE || 'natures_mud',
      });
    } catch {
      // Fallback
      return NextResponse.json({
        success: false,
        message: 'Could not connect to coupon verification service.',
      });
    }

    const [rows]: any = await conn.query(
      'SELECT * FROM coupons WHERE UPPER(code) = ? LIMIT 1',
      [cleanCode]
    );
    await conn.end();

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: `Invalid coupon code "${cleanCode}".`,
      });
    }

    const coupon = rows[0];

    // Check active status
    if (Number(coupon.is_active) !== 1) {
      return NextResponse.json({
        success: false,
        message: `Coupon "${cleanCode}" is currently inactive or deactivated.`,
      });
    }

    const now = new Date();

    // Check starts_at
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return NextResponse.json({
        success: false,
        message: `Coupon "${cleanCode}" offer has not started yet.`,
      });
    }

    // Check expires_at
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return NextResponse.json({
        success: false,
        message: `Coupon "${cleanCode}" has expired.`,
      });
    }

    // Check usage limit
    if (coupon.usage_limit && Number(coupon.used_count || 0) >= Number(coupon.usage_limit)) {
      return NextResponse.json({
        success: false,
        message: `Coupon "${cleanCode}" has reached its maximum usage limit.`,
      });
    }

    const numSubtotal = Number(subtotal) || 0;
    const minOrder = Number(coupon.min_order_amount) || 0;

    if (minOrder > 0 && numSubtotal < minOrder) {
      return NextResponse.json({
        success: false,
        message: `Minimum order amount of Rs. ${minOrder.toLocaleString()} required for coupon "${cleanCode}".`,
      });
    }

    const type = (coupon.type || coupon.discount_type || 'percentage') === 'percentage' ? 'percentage' : 'fixed';
    const value = Number(coupon.value || coupon.discount_value || 0);
    const maxDiscount = coupon.max_discount ? Number(coupon.max_discount) : null;

    let discount = 0;
    if (type === 'percentage') {
      discount = Math.round((numSubtotal * value) / 100);
      if (maxDiscount && discount > maxDiscount) {
        discount = maxDiscount;
      }
    } else {
      discount = Math.min(value, numSubtotal);
    }

    return NextResponse.json({
      success: true,
      message: `Coupon "${cleanCode}" applied successfully!`,
      coupon: {
        code: cleanCode,
        type,
        value,
        discount,
        minOrderAmount: minOrder,
        maxDiscount,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error validating coupon.' },
      { status: 500 }
    );
  }
}
