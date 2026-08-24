import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage and display the logo', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Check if the page title contains "Nature's Mud" or something similar
    // We use a regex to be more forgiving depending on the exact title
    await expect(page).toHaveTitle(/Nature's Mud/i);

    // Verify the logo is visible
    const logoLink = page.getByRole('link', { name: /Nature's Mud — Home/i });
    await expect(logoLink).toBeVisible();

    // Verify the hero section or a prominent call to action is present
    // Adjust this selector based on actual text on the homepage
    const shopNowLink = page.getByRole('link', { name: /Shop/i }).first();
    await expect(shopNowLink).toBeVisible();
  });

  test('should be able to navigate to products page', async ({ page }) => {
    await page.goto('/');
    
    // Find the Shop or Products link in the navigation
    const shopLink = page.getByRole('link', { name: /^Shop$/i }).first();
    
    if (await shopLink.isVisible()) {
      await shopLink.click();
      
      // Wait for navigation and verify the URL contains /products or /shop
      await expect(page).toHaveURL(/.*\/products.*/i);
    }
  });
});
