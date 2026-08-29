'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Root Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#FAF7F2' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', background: '#ffffff', borderRadius: '24px', padding: '36px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FDF6B2', color: '#723B13', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>
              🌿
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: '0 0 10px' }}>
              Nature&apos;s Mud Nepal
            </h1>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6', margin: '0 0 24px' }}>
              We encountered a temporary connection issue. Please refresh or return to the main store.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => reset()}
                style={{ background: '#3A6B35', color: '#ffffff', border: 'none', borderRadius: '9999px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Reload Store
              </button>
              <Link
                href="/"
                style={{ background: '#F3F4F6', color: '#1F2937', textDecoration: 'none', borderRadius: '9999px', padding: '12px 24px', fontSize: '14px', fontWeight: '700' }}
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
