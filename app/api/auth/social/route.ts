/**
 * POST /api/auth/social
 *
 * Server-side handler for Google & Meta social login.
 * Verifies the OAuth token with the provider, then
 * forwards the verified identity to the admin-server social-login endpoint.
 *
 * Body:
 *   { provider: 'google', credential: '<Google ID token>' }
 *   { provider: 'meta',   accessToken: '<Meta access token>' }
 */
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SERVER =
  process.env.INTERNAL_ADMIN_API_URL ||
  process.env.NEXT_PUBLIC_ADMIN_API_URL ||
  'http://localhost:4001/api/admin';

const BASE = ADMIN_SERVER.replace(/\/+$/, '');

// ─── Google verification ────────────────────────────────────────────────────
async function verifyGoogleToken(credential: string) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('Google Client ID not configured on server');

  // Use Google's tokeninfo endpoint to verify the ID token
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );
  if (!res.ok) {
    throw new Error('Invalid Google credential');
  }
  const payload = await res.json();

  // Validate the audience matches our app
  if (payload.aud !== clientId) {
    throw new Error('Google token audience mismatch');
  }
  if (!payload.email_verified || payload.email_verified === 'false') {
    throw new Error('Google account email is not verified');
  }

  return {
    email: payload.email as string,
    name: (payload.name || payload.email.split('@')[0]) as string,
    avatar: (payload.picture || null) as string | null,
  };
}

// ─── Meta / Facebook verification ───────────────────────────────────────────
async function verifyMetaToken(accessToken: string) {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const appSecret = process.env.META_APP_SECRET; // Server-only secret

  // If we have an app secret, use the app access token for debug_token (more secure)
  let inspectUrl: string;
  if (appId && appSecret) {
    const appAccessToken = `${appId}|${appSecret}`;
    inspectUrl = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appAccessToken)}`;
  } else {
    // Fallback: use the user token itself to fetch /me (less secure but works without app secret)
    const meRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${encodeURIComponent(accessToken)}`
    );
    if (!meRes.ok) throw new Error('Invalid Meta access token');
    const meData = await meRes.json();
    if (!meData.email) throw new Error('Meta account has no public email. Please use a different sign-in method.');
    return {
      email: meData.email as string,
      name: (meData.name || meData.email.split('@')[0]) as string,
      avatar: (meData.picture?.data?.url || null) as string | null,
    };
  }

  const debugRes = await fetch(inspectUrl);
  if (!debugRes.ok) throw new Error('Failed to verify Meta token');
  const debugData = await debugRes.json();

  if (!debugData.data?.is_valid) throw new Error('Meta access token is invalid or expired');
  if (debugData.data?.app_id !== appId) throw new Error('Meta token app_id mismatch');

  // Fetch user profile
  const meRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${encodeURIComponent(accessToken)}`
  );
  if (!meRes.ok) throw new Error('Failed to fetch Meta user profile');
  const meData = await meRes.json();

  if (!meData.email) {
    throw new Error('Meta account has no public email. Please use a different sign-in method.');
  }

  return {
    email: meData.email as string,
    name: (meData.name || meData.email.split('@')[0]) as string,
    avatar: (meData.picture?.data?.url || null) as string | null,
  };
}

// ─── Main handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, credential, accessToken } = body;

    if (!provider || !['google', 'meta'].includes(provider)) {
      return NextResponse.json({ success: false, message: 'Invalid provider' }, { status: 400 });
    }

    // Verify token with the social provider
    let identity: { email: string; name: string; avatar: string | null };
    if (provider === 'google') {
      if (!credential) {
        return NextResponse.json({ success: false, message: 'Google credential is required' }, { status: 400 });
      }
      identity = await verifyGoogleToken(credential);
    } else {
      if (!accessToken) {
        return NextResponse.json({ success: false, message: 'Meta access token is required' }, { status: 400 });
      }
      identity = await verifyMetaToken(accessToken);
    }

    // Forward verified identity to admin server
    const upstream = await fetch(`${BASE}/auth/social-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        email: identity.email,
        name: identity.name,
        avatar: identity.avatar,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Social login failed on server' },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error('[social-auth] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: err?.message || 'Social authentication failed' },
      { status: 401 }
    );
  }
}
