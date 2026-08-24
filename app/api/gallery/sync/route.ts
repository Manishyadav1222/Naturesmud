import { NextResponse } from 'next/server';
import { syncInstagramPhotoPosts } from '@/lib/instagram-gallery';

export async function POST() {
  try {
    const result = await syncInstagramPhotoPosts();
    return NextResponse.json({
      success: true,
      data: result,
      message: result.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Instagram sync failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
