export const formatPrice = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
};

export const parseNepalDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return isNaN(date.getTime()) ? null : date;
  const str = String(date).trim();
  if (!str) return null;

  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/.test(str)) {
    if (str.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(str)) {
      const parsed = new Date(str);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    const parsed = new Date(`${str.replace(' ', 'T')}+05:45`);
    return isNaN(parsed.getTime()) ? new Date(str) : parsed;
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (date: string | Date | null | undefined): string => {
  const d = parseNepalDate(date);
  if (!d) return 'N/A';
  return d.toLocaleDateString('en-NP', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  const d = parseNepalDate(date);
  if (!d) return 'N/A';
  return d.toLocaleString('en-NP', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const calculateDiscount = (price: number, compareAtPrice?: number): number | null => {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const classNames = (...classes: (string | false | null | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

const IMAGE_ALIAS_MAP: Record<string, string> = {
  '/products/dehydrated-mango.jpg': '/products/authentic-dehydrated-mango.jpg',
  '/products/mango.jpg': '/products/authentic-dehydrated-mango.jpg',
  '/products/dehydrated-apple.jpg': '/products/authentic-dehydrated-apple.jpg',
  '/products/apple.jpg': '/products/authentic-dehydrated-apple.jpg',
  '/products/apples.jpg': '/products/authentic-dehydrated-apple.jpg',
  '/products/dehydrated-pineapple.jpg': '/products/authentic-dehydrated-pineapple.jpg',
  '/products/pineapple.jpg': '/products/authentic-dehydrated-pineapple.jpg',
  '/products/almonds.jpg': '/products/authentic-almonds.jpg',
  '/products/raw-almonds.jpg': '/products/authentic-almonds.jpg',
  '/products/cashewnuts-roasted.jpg': '/products/authentic-cashewnuts-roasted.jpg',
  '/products/cashews-roasted.jpg': '/products/authentic-cashewnuts-roasted.jpg',
  '/products/cashews.jpg': '/products/authentic-cashewnuts-roasted.jpg',
  '/products/cashew.jpg': '/products/authentic-cashewnuts-roasted.jpg',
  '/products/cashewnuts.jpg': '/products/authentic-cashewnuts-roasted.jpg',
  '/products/dates.jpg': '/products/dates-powder-100g.jpg',
  '/products/flaxseed.jpg': '/products/flax-seeds.jpg',
  '/products/apricots.jpg': '/products/papaya.jpg',
  '/products/yarsagumba.jpg': '/products/shilajit.jpg',
  '/products/honey.jpg': '/products/raw-honey.jpg',
  '/products/trail-mix.jpg': '/products/superfood-mix.jpg',
  '/products/turmeric.jpg': '/products/carrot-powder-marble.jpg',
  '/products/ginger.jpg': '/products/sweet-potato-powder-100g.jpg',
  '/products/mustard-seeds.jpg': '/products/chia-seeds.jpg',
  '/products/chia.jpg': '/products/chia-seeds.jpg',
  '/products/chia-seed.jpg': '/products/chia-seeds.jpg',
  '/products/beetroot.jpg': '/products/beetroot-powder-100g.jpg',
  '/products/blueberries.jpg': '/products/dried-blueberries-orchard.jpg',
  '/products/dried-blueberries.jpg': '/products/dried-blueberries-orchard.jpg',
  '/products/dried-blueberries-100g.jpg': '/products/dried-blueberries-orchard.jpg',
  '/products/pista.jpg': '/products/pistachios.jpg',
  '/products/coconut-chips.jpg': '/products/dehydrated-coconut-chips.jpg',
  '/products/black-salt.jpg': '/products/himalayan-black-salt-digestive.jpg',
  '/products/black-salt-jar.jpg': '/products/himalayan-black-salt-digestive.jpg',
  '/products/pink-salt-jar.jpg': '/products/pink-salt.jpg',
};

export const resolveImageUrl = (
  img?: any,
  fallback = '/products/sweet-potato-powder-100g.jpg'
): string => {
  if (!img) return fallback;

  let raw = '';
  if (typeof img === 'string') {
    raw = img.trim();
  } else if (typeof img === 'object' && img !== null) {
    raw = String(img.url || img.secure_url || img.preview || img.src || img.path || '').trim();
  }

  if (!raw) return fallback;

  // Handle JSON stringified arrays or objects
  if (raw.startsWith('[') || raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return resolveImageUrl(parsed[0], fallback);
      }
      if (parsed && typeof parsed === 'object') {
        return resolveImageUrl(parsed, fallback);
      }
    } catch {
      // not JSON, continue
    }
  }

  if (IMAGE_ALIAS_MAP[raw]) {
    return IMAGE_ALIAS_MAP[raw];
  }

  // Full URLs (Cloudinary, external CDN, full domain, data URI, blob URL)
  if (
    raw.startsWith('http://') ||
    raw.startsWith('https://') ||
    raw.startsWith('data:') ||
    raw.startsWith('blob:')
  ) {
    return raw;
  }

  // Handle /uploads/ or uploads/
  if (raw.startsWith('uploads/')) {
    return `/${raw}`;
  }

  // Absolute path within public
  if (raw.startsWith('/')) {
    return raw;
  }

  // Relative image filename fallback to /products/
  const resolved = `/products/${raw}`;
  return IMAGE_ALIAS_MAP[resolved] || resolved;
};