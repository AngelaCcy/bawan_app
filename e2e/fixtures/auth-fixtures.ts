import { test as base, expect } from '@playwright/test';

/**
 * Test data for authentication
 */
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'testPassword123',
    name: 'Test User',
    phone: '0912345678',
    gender: '女生' as const,
    birth: '1990-01-01',
  },
  invalidEmail: {
    email: 'invalid-email',
    password: 'testPassword123',
  },
  invalidPassword: {
    email: 'test@example.com',
    password: 'short',
  },
};

/**
 * Auth fixtures
 */
export const test = base.extend({
  // Authenticated page fixture
  authenticatedPage: async ({ page, baseURL }, use) => {
    // Navigate to sign in page
    await page.goto(`${baseURL}/signin`);
    
    // Fill in sign in form (adjust selectors based on your actual form)
    await page.fill('input[name="email"]', testUsers.validUser.email);
    // If there's a password field
    // await page.fill('input[name="password"]', testUsers.validUser.password);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for successful sign in (adjust based on your auth flow)
    await page.waitForURL(`${baseURL}/**`, { timeout: 10000 });
    
    // Use the authenticated page
    await use(page);
    
    // Cleanup: sign out if needed
    // await page.goto(`${baseURL}/api/auth/signout`);
  },
});

export { expect };

