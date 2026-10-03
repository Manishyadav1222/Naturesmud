export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
}

const recentEvents = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1000;

export function trackEcommerceEvent(
  eventName:
    | 'view_item'
    | 'search'
    | 'add_to_cart'
    | 'remove_from_cart'
    | 'begin_checkout'
    | 'add_shipping_info'
    | 'add_payment_info'
    | 'purchase'
    | 'coupon_apply'
    | 'whatsapp_click',
  payload: Record<string, any> = {}
): void {
  if (typeof window === 'undefined') return;

  const dedupeKey = `${eventName}:${JSON.stringify(payload)}`;
  const now = Date.now();
  const lastFired = recentEvents.get(dedupeKey) || 0;
  if (now - lastFired < DEDUPE_WINDOW_MS) {
    return;
  }
  recentEvents.set(dedupeKey, now);

  try {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: eventName,
      ecommerce: {
        currency: 'NPR',
        ...payload,
      },
    });
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, {
        currency: 'NPR',
        ...payload,
      });
    }
  } catch {
    // Non-blocking analytics
  }
}
