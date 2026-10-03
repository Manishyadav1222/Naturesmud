export interface CouponRule {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  active: boolean;
  startDate: string;
  endDate: string;
  description: string;
  stackable: boolean;
}

export const COUPON_REGISTRY: Record<string, CouponRule> = {
  WELCOME5: {
    code: 'WELCOME5',
    type: 'percent',
    value: 5,
    minOrderAmount: 1000,
    maxDiscountAmount: 1500,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '5% welcome discount on orders of Rs. 1,000 or more',
    stackable: false,
  },
  STORE5: {
    code: 'STORE5',
    type: 'percent',
    value: 5,
    minOrderAmount: 1000,
    maxDiscountAmount: 1500,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '5% storewide discount on orders of Rs. 1,000 or more',
    stackable: false,
  },
  ENERGY11: {
    code: 'ENERGY11',
    type: 'percent',
    value: 11,
    minOrderAmount: 1500,
    maxDiscountAmount: 2000,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '11% off Daily Energy & Vitality orders (min Rs. 1,500)',
    stackable: false,
  },
  BEAUTY10: {
    code: 'BEAUTY10',
    type: 'percent',
    value: 10,
    minOrderAmount: 1500,
    maxDiscountAmount: 2000,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '10% off Skin Glow & Beauty orders (min Rs. 1,500)',
    stackable: false,
  },
  FOCUS10: {
    code: 'FOCUS10',
    type: 'percent',
    value: 10,
    minOrderAmount: 1500,
    maxDiscountAmount: 2000,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '10% off Brain Focus & Memory orders (min Rs. 1,500)',
    stackable: false,
  },
  GUTHEALTH10: {
    code: 'GUTHEALTH10',
    type: 'percent',
    value: 10,
    minOrderAmount: 1500,
    maxDiscountAmount: 2000,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '10% off Gut & Digestion Wellness orders (min Rs. 1,500)',
    stackable: false,
  },
  DETOX11: {
    code: 'DETOX11',
    type: 'percent',
    value: 11,
    minOrderAmount: 1500,
    maxDiscountAmount: 2000,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '11% off Green Detox & Immunity orders (min Rs. 1,500)',
    stackable: false,
  },
  FIRSTSOLIDS5: {
    code: 'FIRSTSOLIDS5',
    type: 'percent',
    value: 5,
    minOrderAmount: 1000,
    maxDiscountAmount: 1500,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '5% off Baby First Solids orders (min Rs. 1,000)',
    stackable: false,
  },
  MAMAHEAL5: {
    code: 'MAMAHEAL5',
    type: 'percent',
    value: 5,
    minOrderAmount: 1000,
    maxDiscountAmount: 1500,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '5% off Postpartum Recovery & Mother Care orders (min Rs. 1,000)',
    stackable: false,
  },
  TODDLER5: {
    code: 'TODDLER5',
    type: 'percent',
    value: 5,
    minOrderAmount: 1000,
    maxDiscountAmount: 1500,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '5% off Toddler Growth & Weight Gain orders (min Rs. 1,000)',
    stackable: false,
  },
  PREGNANCY5: {
    code: 'PREGNANCY5',
    type: 'percent',
    value: 5,
    minOrderAmount: 1000,
    maxDiscountAmount: 1500,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '5% off Pregnancy Folate & Iron Care orders (min Rs. 1,000)',
    stackable: false,
  },
  IMMUNITY5: {
    code: 'IMMUNITY5',
    type: 'percent',
    value: 5,
    minOrderAmount: 1000,
    maxDiscountAmount: 1500,
    active: true,
    startDate: '2026-01-01T00:00:00+05:45',
    endDate: '2027-12-31T23:59:59+05:45',
    description: '5% off Family Immunity & Gut Care orders (min Rs. 1,000)',
    stackable: false,
  },
};

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  coupon?: CouponRule;
  discountAmount: number;
}

export function validateCouponCode(
  rawCode: string,
  subtotalInput: number,
  now: Date = new Date()
): CouponValidationResult {
  const code = String(rawCode || '').trim().toUpperCase();
  const subtotal = Math.max(0, Number(subtotalInput) || 0);

  if (!code || !/^[A-Z0-9_-]{3,24}$/.test(code)) {
    return {
      valid: false,
      message: 'Please enter a valid coupon code.',
      discountAmount: 0,
    };
  }

  const rule = COUPON_REGISTRY[code];
  if (!rule) {
    return {
      valid: false,
      message: `Coupon code "${code}" is invalid or not recognized.`,
      discountAmount: 0,
    };
  }

  if (!rule.active) {
    return {
      valid: false,
      message: `Coupon code "${code}" is currently inactive.`,
      discountAmount: 0,
    };
  }

  const startMs = new Date(rule.startDate).getTime();
  const endMs = new Date(rule.endDate).getTime();
  const nowMs = now.getTime();

  if (!Number.isNaN(startMs) && nowMs < startMs) {
    return {
      valid: false,
      message: `Coupon code "${code}" is not active yet.`,
      discountAmount: 0,
    };
  }

  if (!Number.isNaN(endMs) && nowMs > endMs) {
    return {
      valid: false,
      message: `Coupon code "${code}" has expired.`,
      discountAmount: 0,
    };
  }

  if (subtotal < rule.minOrderAmount) {
    return {
      valid: false,
      message: `Coupon "${code}" requires a minimum order subtotal of Rs. ${rule.minOrderAmount.toLocaleString()}.`,
      discountAmount: 0,
    };
  }

  let discountAmount =
    rule.type === 'percent'
      ? Math.round((subtotal * rule.value) / 100)
      : Math.round(rule.value);

  if (rule.maxDiscountAmount && discountAmount > rule.maxDiscountAmount) {
    discountAmount = rule.maxDiscountAmount;
  }

  // Discount may never exceed cart subtotal
  discountAmount = Math.max(0, Math.min(discountAmount, subtotal));

  return {
    valid: true,
    message: `${rule.description} applied! You saved Rs. ${discountAmount.toLocaleString()}.`,
    coupon: rule,
    discountAmount,
  };
}
