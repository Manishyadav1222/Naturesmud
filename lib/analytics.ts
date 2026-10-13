export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
}

export type EcommerceEventName =
  | 'view_item'
  | 'view_item_list'
  | 'select_item'
  | 'search'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'
  | 'purchase'
  | 'coupon_apply'
  | 'whatsapp_click';

const recentEvents = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1000;

export function trackEcommerceEvent(
  eventName: EcommerceEventName,
  payload: Record<string, any> = {}
): void {
  if (typeof window === 'undefined') return;

  // Session-level deduplication for purchase events by transaction_id
  if (eventName === 'purchase' && payload.transaction_id) {
    try {
      const storageKey = `nm_tracked_purchase_${payload.transaction_id}`;
      if (window.sessionStorage.getItem(storageKey)) {
        return;
      }
      window.sessionStorage.setItem(storageKey, String(Date.now()));
    } catch {
      // Ignore storage errors in private browsing
    }
  }

  const dedupeKey = `${eventName}:${JSON.stringify(payload)}`;
  const now = Date.now();
  const lastFired = recentEvents.get(dedupeKey) || 0;
  if (now - lastFired < DEDUPE_WINDOW_MS) {
    return;
  }
  recentEvents.set(dedupeKey, now);

  try {
    const w = window as any;
    const normalizedPayload = {
      currency: 'NPR',
      ...payload,
    };

    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: eventName,
      ecommerce: normalizedPayload,
    });

    w.__nmAnalyticsEvents = w.__nmAnalyticsEvents || [];
    if (w.__nmAnalyticsEvents.length >= 50) {
      w.__nmAnalyticsEvents.shift();
    }
    w.__nmAnalyticsEvents.push({
      event: eventName,
      timestamp: new Date(now).toISOString(),
      payload: normalizedPayload,
    });

    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, normalizedPayload);
    }

    if (typeof w.clarity === 'function') {
      w.clarity('event', eventName);
      if (eventName === 'purchase' && payload.transaction_id) {
        w.clarity('set', 'transaction_id', String(payload.transaction_id));
      }
    }
  } catch {
    // Non-blocking analytics
  }
}

