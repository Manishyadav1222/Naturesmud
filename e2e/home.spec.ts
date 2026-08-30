import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage and display the logo', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Nature's Mud/i);
    const logoLink = page.getByRole('link', { name: /Nature's Mud — Home/i });
    await expect(logoLink).toBeVisible();
    const shopNowLink = page.getByRole('link', { name: /Shop/i }).first();
    await expect(shopNowLink).toBeVisible();
  });

  test('should be able to navigate to products page', async ({ page }) => {
    await page.goto('/');
    const shopLink = page.getByRole('link', { name: /^Shop$/i }).first();
    if (await shopLink.isVisible()) {
      await shopLink.click();
      await expect(page).toHaveURL(/.*\/products.*/i);
    }
  });

  test('should display featured products section', async ({ page }) => {
    await page.goto('/');
    const featuredHeading = page.getByRole('heading', { name: /Featured|Best Sellers|New Arrivals/i }).first();
    await expect(featuredHeading).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Products Page', () => {
  test('should load products page and display products', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/.*\/products/);
    
    const productGrid = page.locator('[data-testid="product-grid"], .product-grid, [role="list"]').first();
    await expect(productGrid).toBeVisible({ timeout: 10000 });
    
    const productCard = page.locator('[data-testid="product-card"], .product-card, article').first();
    await expect(productCard).toBeVisible({ timeout: 10000 });
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products');
    
    const categoryFilter = page.getByRole('button', { name: /Category|Filter/i }).first();
    if (await categoryFilter.isVisible({ timeout: 5000 })) {
      await categoryFilter.click();
      const categoryOption = page.getByRole('option', { name: /Organic|Nuts|Seeds/i }).first();
      if (await categoryOption.isVisible({ timeout: 3000 })) {
        await categoryOption.click();
        await expect(page).toHaveURL(/category/);
      }
    }
  });

  test('should sort products', async ({ page }) => {
    await page.goto('/products');
    
    const sortSelect = page.getByLabel(/Sort|Sort by/i).first();
    if (await sortSelect.isVisible({ timeout: 5000 })) {
      await sortSelect.selectOption({ label: 'Price: Low to High' });
      await expect(page).toHaveURL(/sort=/);
    }
  });
});

test.describe('Product Detail Page', () => {
  test('should load product detail page', async ({ page }) => {
    await page.goto('/products');
    
    const firstProductLink = page.locator('a[href*="/products/"]').first();
    if (await firstProductLink.isVisible({ timeout: 10000 })) {
      await firstProductLink.click();
      await expect(page).toHaveURL(/\/products\/[^/]+$/);
      
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByText(/Rs\.\s*\d+/)).toBeVisible();
    }
  });

  test('should add product to cart from detail page', async ({ page }) => {
    await page.goto('/products');
    
    const firstProductLink = page.locator('a[href*="/products/"]').first();
    if (await firstProductLink.isVisible({ timeout: 10000 })) {
      await firstProductLink.click();
      await expect(page).toHaveURL(/\/products\/[^/]+$/);
      
      const addToCartButton = page.getByRole('button', { name: /Add to Cart|Add/i }).first();
      if (await addToCartButton.isVisible({ timeout: 5000 })) {
        await addToCartButton.click();
        const cartDrawer = page.getByRole('dialog', { name: /Cart/i });
        const toast = page.locator('[data-testid="toast"], .toast').first();
        await expect(cartDrawer.or(toast)).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

test.describe('Cart Functionality', () => {
  test('should open cart drawer and show items', async ({ page }) => {
    await page.goto('/');
    
    const cartIcon = page.getByRole('button', { name: /Cart|Shopping Bag/i }).first();
    if (await cartIcon.isVisible({ timeout: 5000 })) {
      await cartIcon.click();
      const cartDrawer = page.getByRole('dialog', { name: /Cart/i });
      await expect(cartDrawer).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Navigation', () => {
  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    const navLinks = [
      { name: /Home/i, url: '/' },
      { name: /Shop|Products/i, url: /\/products/ },
      { name: /About/i, url: /\/about/ },
      { name: /Contact/i, url: /\/contact/ },
    ];
    
    for (const link of navLinks) {
      const navLink = page.getByRole('link', { name: link.name }).first();
      if (await navLink.isVisible({ timeout: 3000 })) {
        await navLink.click();
        await expect(page).toHaveURL(link.url);
        await page.goBack();
      }
    }
  });
});
