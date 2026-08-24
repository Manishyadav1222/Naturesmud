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