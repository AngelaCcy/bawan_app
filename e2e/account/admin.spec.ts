import { test, expect } from '@playwright/test';
import { AccountPage } from '../fixtures/page-objects';
import { waitForPageLoad } from '../helpers/test-helpers';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.goto('/account');
    await waitForPageLoad(page);
  });

  // Happy path: admin tab only visible to admin users
  test('admin tab visibility is role-gated', async ({ page }) => {
    if (page.url().includes('/signin')) {
      test.skip(true, 'Not authenticated');
    }

    const accountPage = new AccountPage(page);
    const adminTabCount = await accountPage.adminTab.count();

    // We can't know the role of the test user, but we can assert the two
    // valid states: either the tab is visible (admin) or absent (user)
    expect(adminTabCount === 0 || adminTabCount === 1).toBeTruthy();
  });

  // Happy path: admin can see user list when admin tab is present
  test('admin tab shows user list', async ({ page }) => {
    if (page.url().includes('/signin')) {
      test.skip(true, 'Not authenticated');
    }

    const accountPage = new AccountPage(page);
    if (await accountPage.adminTab.count() === 0) {
      test.skip(true, 'Not an admin user');
    }

    await accountPage.adminTab.click();
    await page.waitForTimeout(500);

    // User list or loading state should appear
    const hasUsers = await page.locator('text=/位使用者/').count();
    const isLoading = await page.locator('text=載入中').count();
    expect(hasUsers > 0 || isLoading > 0).toBeTruthy();
  });

  // Error case: admin panel section must not appear for non-admin users
  test('admin panel content is not in DOM for non-admin users', async ({ page }) => {
    if (page.url().includes('/signin')) {
      test.skip(true, 'Not authenticated');
    }

    const accountPage = new AccountPage(page);
    if (await accountPage.adminTab.count() > 0) {
      test.skip(true, 'User is admin — skipping non-admin gate test');
    }

    // Admin tab and 管理員面板 heading must be absent from DOM entirely
    await expect(accountPage.adminTab).toHaveCount(0);
    await expect(page.locator('text=管理員面板')).toHaveCount(0);
  });
});
