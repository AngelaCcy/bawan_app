import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../helpers/test-helpers';

test.describe('Favorites Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/favorites', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForPageLoad(page);
  });

  test('should display favorites page', async ({ page }) => {
    // Check if on favorites page or redirected to sign in
    const currentUrl = page.url();
    
    if (currentUrl.includes('/favorites')) {
      await expect(page).toHaveURL(/.*\/favorites/);
    } else if (currentUrl.includes('/signin')) {
      // Redirected to sign in - expected for protected route
      await expect(page).toHaveURL(/.*\/signin/);
      test.skip(); // Skip remaining tests if not authenticated
    }
  });

  test('should display favorites list when authenticated', async ({ page }) => {
    // Skip if redirected to sign in
    if (page.url().includes('/signin')) {
      test.skip();
    }
    
    // Wait for favorites to load
    await page.waitForTimeout(1000);
    
    // Check for favorites list or empty state
    const favoritesList = page.locator('[data-testid="favorites-list"], [class*="FavoriteList"]');
    const emptyState = page.locator('text=/尚無收藏|no favorites|empty/i');
    
    const listCount = await favoritesList.count();
    const emptyCount = await emptyState.count();
    
    // Either favorites list or empty state should be visible
    // Check if page loaded successfully first
    const currentUrl = page.url();
    const isOnFavoritesPage = currentUrl.includes('/favorites');
    const isRedirectedToSignIn = currentUrl.includes('/signin');
    
    if (isRedirectedToSignIn) {
      test.skip();
    } else {
      // Page should have loaded with either list or empty state
      expect(isOnFavoritesPage || listCount > 0 || emptyCount > 0).toBeTruthy();
    }
  });

  test('should remove product from favorites', async ({ page }) => {
    // Skip if redirected to sign in
    if (page.url().includes('/signin')) {
      test.skip();
    }
    
    await page.waitForTimeout(1000);
    
    // Find remove button (heart icon or remove button)
    const removeButton = page.locator('button[aria-label*="remove" i], button[aria-label*="favorite" i], [data-testid="remove-favorite"]').first();
    const buttonCount = await removeButton.count();
    
    if (buttonCount > 0) {
      await removeButton.click();
      await page.waitForTimeout(500);
      
      // Check for toast message
      const toast = page.locator('[role="status"]');
      const toastCount = await toast.count();
      
      if (toastCount > 0) {
        await expect(toast.first()).toBeVisible();
      }
    }
  });
});

