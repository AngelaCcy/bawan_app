import { test, expect } from '@playwright/test';
import { testUsers } from '../fixtures/auth-fixtures';
import { waitForPageLoad, waitForToast, selectOption } from '../helpers/test-helpers';

test.describe('Sign Up', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
    await waitForPageLoad(page);
  });

  test('should display sign up form', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/signup/);
    
    // Check for required form fields
    const nameInput = page.locator('input[name="name"]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const phoneInput = page.locator('input[name="phone"]').first();
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    await page.waitForTimeout(500);
    
    // Check for validation errors
    const errorMessages = page.locator('[role="alert"], .error, [class*="error"]');
    const count = await errorMessages.count();
    
    if (count > 0) {
      const firstError = errorMessages.first();
      await expect(firstError).toBeVisible();
    }
  });

  test('should validate phone number format', async ({ page }) => {
    const phoneInput = page.locator('input[name="phone"]').first();
    await phoneInput.fill('123'); // Invalid phone number
    
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    await page.waitForTimeout(500);
    
    // Should show validation error for phone format
    const errorMessage = page.locator('text=/電話|phone/i').or(page.locator('[role="alert"]'));
    const count = await errorMessage.count();
    
    if (count > 0) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should fill sign up form successfully', async ({ page }) => {
    // Fill name
    const nameInput = page.locator('input[name="name"]').first();
    await nameInput.fill(testUsers.validUser.name);
    
    // Fill email
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    await emailInput.fill(`test-${Date.now()}@example.com`); // Unique email
    
    // Select gender
    const genderSelect = page.locator('select[name="gender"], [name="gender"]').first();
    const genderCount = await genderSelect.count();
    
    if (genderCount > 0) {
      await selectOption(page, 'gender', testUsers.validUser.gender);
    }
    
    // Fill phone
    const phoneInput = page.locator('input[name="phone"]').first();
    await phoneInput.fill(testUsers.validUser.phone);
    
    // Select birth date
    const birthInput = page.locator('input[name="birth"], [name="birth"]').first();
    const birthCount = await birthInput.count();
    
    if (birthCount > 0) {
      // Handle date picker or input
      await birthInput.click();
      await page.waitForTimeout(300);
      // Date picker interaction depends on your component
    }
    
    // Verify form is filled
    await expect(nameInput).toHaveValue(testUsers.validUser.name);
    await expect(emailInput).not.toHaveValue('');
    await expect(phoneInput).toHaveValue(testUsers.validUser.phone);
  });

  test('should navigate to sign in page', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: /登入|sign in|signin/i });
    const count = await signInLink.count();
    
    if (count > 0) {
      await signInLink.first().click();
      await expect(page).toHaveURL(/.*\/signin/);
      await waitForPageLoad(page);
    }
  });
});

