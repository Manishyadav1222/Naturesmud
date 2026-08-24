import { NextResponse } from 'next/server';
import { getInstagramGalleryPosts, getInstagramSettings } from '@/lib/instagram-gallery';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    let posts = getInstagramGalleryPosts(true);

    if (category && category !== 'all') {
      posts = posts.filter((p) => p.category === category);
    }

    const total = posts.length;
    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + limit);

    const settings = getInstagramSettings();

    return NextResponse.json({
      success: true,
      data: paginatedPosts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        instagram_handle: settings.instagram_handle,
        last_synced_at: settings.last_synced_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch gallery posts' },
      { status: 500 }
    );
  }
}
