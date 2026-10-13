'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { trackEcommerceEvent } from '@/lib/analytics';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '';

export default function AnalyticsTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.__nmAnalyticsEvents = w.__nmAnalyticsEvents || [];

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (href.includes('wa.me/') || href.includes('api.whatsapp.com')) {
        trackEcommerceEvent('whatsapp_click', {
          link_url: href,
          link_text: (anchor.textContent || '').trim().slice(0, 80),
          page_path: window.location.pathname,
        });
      }
    };

    document.addEventListener('click', handleGlobalClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <>
      <meta
        name="nm-analytics-events"
        content="view_item,add_to_cart,remove_from_cart,begin_checkout,coupon_apply,purchase,whatsapp_click"
      />
      {GA_MEASUREMENT_ID ? (
        <>
          <Script
            id="ga4-gtag-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                send_page_view: true,
                currency: 'NPR'
              });
            `}
          </Script>
        </>
      ) : (
        <Script id="ga4-datalayer-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.__nmAnalyticsEvents = window.__nmAnalyticsEvents || [];
          `}
        </Script>
      )}

      {CLARITY_PROJECT_ID ? (
        <Script id="ms-clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      ) : null}
    </>
  );
}
