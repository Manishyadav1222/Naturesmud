/**
 * Next.js App Router catch-all API route for admin server proxy.
 * 
 * This replaces the next.config.mjs rewrite for /api/admin/* because
 * rewrites silently return Next.js HTML error pages when the upstream
 * server is unreachable — causing the "Expected JSON" error.
 * 
 * This route always returns JSON, even on connection failure.
 */
import { NextRequest, NextResponse } from 'next/server';

// The real admin server URL (server-side only — never exposed to browser)
const ADMIN_SERVER =
  process.env.INTERNAL_ADMIN_API_URL ||
  process.env.NEXT_PUBLIC_ADMIN_API_URL ||
  'http://localhost:4001/api/admin';

// Strip trailing slash for clean URL construction
const BASE = ADMIN_SERVER.replace(/\/+$/, '');

const TIMEOUT_MS = 15_000;

async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  const subPath = params.path?.join('/') ?? '';
  const search = req.nextUrl.search || '';
  const targetUrl = `${BASE}/${subPath}${search}`;

  // Forward the original headers — but strip Host (causes upstream rejection)
  const forwardHeaders = new Headers();
  for (const [key, value] of req.headers.entries()) {
    const lower = key.toLowerCase();
    if (
      lower === 'host' ||
      lower === 'connection' ||
      lower === 'transfer-encoding'
    ) {
      continue;
    }
    forwardHeaders.set(key, value);
  }

  let body: BodyInit | null = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.arrayBuffer();
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
      signal: controller.signal,
      // @ts-ignore — Node 18+ fetch option
      duplex: 'half',
    });

    clearTimeout(timer);

    const responseHeaders = new Headers();
    for (const [key, value] of upstream.headers.entries()) {
      const lower = key.toLowerCase();
      // Don't forward encoding and length headers — Next.js handles compression & chunking
      if (
        lower === 'transfer-encoding' ||
        lower === 'connection' ||
        lower === 'keep-alive' ||
        lower === 'content-encoding' ||
        lower === 'content-length'
      ) {
        continue;
      }
      responseHeaders.set(key, value);
    }

    // Always ensure JSON content-type for admin API responses
    if (!responseHeaders.get('content-type')?.includes('application/json')) {
      const text = await upstream.text();
      // If upstream returned HTML (error page), wrap it as a JSON error
      if (text.trim().startsWith('<') || !text.trim().startsWith('{')) {
        return NextResponse.json(
          {
            success: false,
            message: `Admin server error (HTTP ${upstream.status}). The admin backend may be starting up.`,
            status: upstream.status,
          },
          { status: upstream.status >= 400 ? upstream.status : 502 }
        );
      }
      return new NextResponse(text, {
        status: upstream.status,
        headers: responseHeaders,
      });
    }

    const upstreamBody = await upstream.arrayBuffer();
    return new NextResponse(upstreamBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    clearTimeout(timer);

    const isTimeout = err?.name === 'AbortError';
    const isConnRefused =
      err?.cause?.code === 'ECONNREFUSED' ||
      err?.message?.includes('ECONNREFUSED') ||
      err?.message?.includes('fetch failed');

    console.error('[admin-proxy] Upstream error:', err?.message);

    return NextResponse.json(
      {
        success: false,
        message: isTimeout
          ? 'Admin server request timed out. Please try again.'
          : isConnRefused
          ? `Cannot connect to admin server at ${BASE}. Make sure the admin backend is running (npm run dev inside admin-server/).`
          : `Admin server unavailable: ${err?.message || 'Unknown error'}`,
        error: isTimeout ? 'TIMEOUT' : isConnRefused ? 'ECONNREFUSED' : 'PROXY_ERROR',
      },
      { status: 503 }
    );
  }
}

export async function GET(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(req, params);
}

export async function POST(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(req, params);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(req, params);
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(req, params);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(req, params);
}
