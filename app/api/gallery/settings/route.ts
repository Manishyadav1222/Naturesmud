import { NextResponse } from 'next/server';
import {
  getInstagramSettings,
  saveInstagramSettings,
  getInstagramGalleryPosts,
  saveInstagramGalleryPosts,
} from '@/lib/instagram-gallery';

export async function GET() {
  try {
    const settings = getInstagramSettings();
    const allPosts = getInstagramGalleryPosts(false);

    // Hide full secret token for security preview
    const maskedToken = settings.access_token
      ? `${settings.access_token.slice(0, 6)}...${settings.access_token.slice(-4)}`
      : '';

    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        has_token: Boolean(settings.access_token),
        masked_token: maskedToken,
        total_photos_count: allPosts.length,
        visible_photos_count: allPosts.filter((p) => p.is_visible).length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = saveInstagramSettings({
      instagram_handle: body.instagram_handle,
      access_token: body.access_token !== undefined ? body.access_token : undefined,
      user_id: body.user_id,
      auto_sync: body.auto_sync,
      sync_interval_hours: body.sync_interval_hours,
      webhook_verify_token: body.webhook_verify_token,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Instagram settings saved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}

// Support updating individual posts (visibility or tagged product)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { postId, is_visible, tagged_product_slug, tagged_product_name, category } = body;

    if (!postId) {
      return NextResponse.json({ success: false, message: 'postId is required' }, { status: 400 });
    }

    const posts = getInstagramGalleryPosts(false);
    const index = posts.findIndex((p) => p.id === postId);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    if (is_visible !== undefined) posts[index].is_visible = is_visible;
    if (tagged_product_slug !== undefined) posts[index].tagged_product_slug = tagged_product_slug;
    if (tagged_product_name !== undefined) posts[index].tagged_product_name = tagged_product_name;
    if (category !== undefined) posts[index].category = category;

    saveInstagramGalleryPosts(posts);

    return NextResponse.json({
      success: true,
      data: posts[index],
      message: 'Gallery item updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}
