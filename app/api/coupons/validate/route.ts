import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Coupon code is required.' },
        { status: 400 }
      );
    }

    // All coupons are currently deactivated for the Raksha Bandhan Festive Sale
    return NextResponse.json({
      success: false,
      message: 'Special 5% Storewide Discount is automatically applied across all festival offers and combos at checkout!',
    }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Error processing coupon.' },
      { status: 500 }
    );
  }
}
