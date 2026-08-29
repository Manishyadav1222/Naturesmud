import { formatPrice, formatDate, calculateDiscount, getInitials, slugify, classNames } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats numbers to Indian Rupees', () => {
      expect(formatPrice(1000)).toBe('Rs. 1,000');
      expect(formatPrice(1000000)).toBe('Rs. 10,00,000');
    });
  });

  describe('formatDate', () => {
    it('formats date strings correctly to en-US/en-NP style', () => {
      expect(formatDate('2023-12-25')).toBe('Dec 25, 2023');
      expect(formatDate('2024-01-01T12:00:00Z')).toBe('Jan 1, 2024');
    });
  });

  describe('calculateDiscount', () => {
    it('returns null if compareAtPrice is less than or equal to price', () => {
      expect(calculateDiscount(100, 100)).toBeNull();
      expect(calculateDiscount(100, 90)).toBeNull();
      expect(calculateDiscount(100)).toBeNull();
    });

    it('calculates the correct percentage discount', () => {
      expect(calculateDiscount(80, 100)).toBe(20);
      expect(calculateDiscount(50, 100)).toBe(50);
      expect(calculateDiscount(75, 100)).toBe(25);
    });
  });

  describe('getInitials', () => {
    it('returns first letters of the first two words', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Alice')).toBe('A');
      expect(getInitials('Mary Jane Watson')).toBe('MJ');
    });

    it('returns upper case initials', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  describe('slugify', () => {
    it('converts strings to URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Nature\'s Mud')).toBe('natures-mud');
      expect(slugify('  Premium Products  ')).toBe('premium-products');
      expect(slugify('Product--Name')).toBe('product-name');
    });
  });

  describe('classNames', () => {
    it('joins truthy class names', () => {
      expect(classNames('bg-red', 'text-white')).toBe('bg-red text-white');
    });

    it('ignores falsy class names', () => {
      expect(classNames('bg-red', null, false, undefined, 'text-white')).toBe('bg-red text-white');
      expect(classNames('bg-red', Boolean(false) && 'hidden', 'text-white')).toBe('bg-red text-white');
    });
  });
});
