import { NextResponse } from 'next/server';
import {
  getInstagramSettings,
  ingestInstagramWebhookPost,
} from '@/lib/instagram-gallery';

/**
 * Meta / Instagram Webhook Verification (GET)
 * Meta sends hub.mode, hub.verify_token, and hub.challenge
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const settings = getInstagramSettings();

  if (mode === 'subscribe' && token === settings.webhook_verify_token) {
    console.log('Instagram Webhook verified successfully!');
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden: Invalid verification token', { status: 403 });
}

/**
 * Real-time Instagram Webhook Ingestion (POST)
 * Ingests newly published photo posts automatically into the Gallery
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('Received Instagram Webhook event:', JSON.stringify(payload));

    const entries = payload.entry || [];
    let ingestedCount = 0;

    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field === 'media' || change.field === 'feed') {
          const value = change.value;
          // STRICT FILTER: ONLY PHOTO POSTS!
          if (value && (value.media_type === 'IMAGE' || value.media_type === 'CAROUSEL_ALBUM')) {
            const ingested = ingestInstagramWebhookPost({
              id: value.id || `insta_webhook_${Date.now()}`,
              caption: value.caption || '',
              media_type: value.media_type,
              media_url: value.media_url || value.thumbnail_url,
              permalink: value.permalink,
              timestamp: value.timestamp || new Date().toISOString(),
            });
            if (ingested) ingestedCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed Instagram Webhook. Ingested ${ingestedCount} photo posts.`,
    });
  } catch (error: any) {
    console.error('Error processing Instagram Webhook:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
