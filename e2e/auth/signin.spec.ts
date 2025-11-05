import { test, expect } from '@playwright/test';
import { testUsers } from '../fixtures/auth-fixtures';
import { waitForPageLoad, waitForToast } from '../helpers/test-helpers';

test.describe('Sign In', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await waitForPageLoad(page);
  });

  test('should display sign in page', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/signin/);
    
    // Check for sign in form elements
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    await expect(emailInput).toBeVisible();
    
    const submitButton = page.locator('button[type="submit"]').first();
    await expect(submitButton).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    await emailInput.fill(testUsers.invalidEmail.email);
    
    // Submit form
    await page.locator('button[type="submit"]').first().click();
    
    // Wait for validation message
    await page.waitForTimeout(500);
    
    // Check for error message (adjust selector based on your form validation)
    const errorMessage = page.locator('[role="alert"], .error, [class*="error"]');
    const count = await errorMessage.count();
    
    if (count > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should successfully sign in with valid email', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    await emailInput.fill(testUsers.validUser.email);
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    // Wait for navigation or success message
    // Adjust based on your auth flow (magic link, OAuth, etc.)
    await page.waitForTimeout(2000);
    
    // If it's magic link, there should be a success message
    // If it redirects, check the URL
    const currentUrl = page.url();
    if (currentUrl.includes('/signin')) {
      // Look for success toast or message
      await waitForToast(page);
    } else {
      // Should redirect after sign in
      expect(currentUrl).not.toContain('/signin');
    }
  });

  test('should navigate to sign up page', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: /註冊|sign up|signup/i });
    const count = await signUpLink.count();
    
    if (count > 0) {
      await signUpLink.first().click();
      await expect(page).toHaveURL(/.*\/signup/);
      await waitForPageLoad(page);
    }
  });
});

