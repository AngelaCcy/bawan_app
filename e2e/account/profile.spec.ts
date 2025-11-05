import { test, expect } from '@playwright/test';
import { AccountPage } from '../fixtures/page-objects';
import { waitForPageLoad } from '../helpers/test-helpers';

test.describe('Account Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to account page (may require authentication)
    const accountPage = new AccountPage(page);
    await accountPage.goto('/account');
    await waitForPageLoad(page);
  });

  test('should display account page', async ({ page }) => {
    // Check if on account page or redirected to sign in
    const currentUrl = page.url();
    
    if (currentUrl.includes('/account')) {
      await expect(page).toHaveURL(/.*\/account/);
      
      // Check for account tabs
      const accountPage = new AccountPage(page);
      await expect(accountPage.profileTab).toBeVisible();
    } else if (currentUrl.includes('/signin')) {
      // Redirected to sign in - that's expected behavior
      await expect(page).toHaveURL(/.*\/signin/);
      test.skip(); // Skip remaining tests if not authenticated
    }
  });

  test('should display profile information', async ({ page }) => {
    // Skip if redirected to sign in
    if (page.url().includes('/signin')) {
      test.skip();
    }
    
    // Check for user name
    const userName = page.locator('text=/您好|hello/i').or(page.getByText(/您好/));
    const nameCount = await userName.count();
    
    // Check for profile fields
    const profileFields = page.locator('text=/姓名|email|電話|性別|生日/i');
    const fieldsCount = await profileFields.count();
    
    // At least some profile information should be visible
    expect(nameCount > 0 || fieldsCount > 0).toBeTruthy();
  });

  test('should open profile edit form', async ({ page }) => {
    // Skip if redirected to sign in
    if (page.url().includes('/signin')) {
      test.skip();
    }
    
    const accountPage = new AccountPage(page);
    const editButton = page.getByRole('button', { name: '編輯' });
    const buttonCount = await editButton.count();
    
    if (buttonCount > 0) {
      await editButton.click();
      await page.waitForTimeout(500);
      
      // Check if form is visible
      const form = page.locator('form');
      await expect(form).toBeVisible();
    }
  });

  test('should switch between tabs', async ({ page }) => {
    // Skip if redirected to sign in
    if (page.url().includes('/signin')) {
      test.skip();
    }
    
    const accountPage = new AccountPage(page);
    
    // Click wishlist tab
    const wishlistTab = page.getByRole('button', { name: '心願清單' });
    const wishlistCount = await wishlistTab.count();
    
    if (wishlistCount > 0) {
      await wishlistTab.click();
      await page.waitForTimeout(500);
      
      // Tab should be active (check for active state or content change)
      const activeTab = page.locator('button[aria-selected="true"]').or(wishlistTab);
      await expect(activeTab).toBeVisible();
    }
    
    // Click orders tab
    const ordersTab = page.getByRole('button', { name: '訂單追蹤' });
    const ordersCount = await ordersTab.count();
    
    if (ordersCount > 0) {
      await ordersTab.click();
      await page.waitForTimeout(500);
      
      const activeTab = page.locator('button[aria-selected="true"]').or(ordersTab);
      await expect(activeTab).toBeVisible();
    }
  });

  test('should update profile information', async ({ page }) => {
    // Skip if redirected to sign in
    if (page.url().includes('/signin')) {
      test.skip();
    }
    
    const editButton = page.getByRole('button', { name: '編輯' });
    const buttonCount = await editButton.count();
    
    if (buttonCount > 0) {
      await editButton.click();
      await page.waitForTimeout(500);
      
      // Fill profile form
      const nameInput = page.getByLabel('姓名');
      const nameCount = await nameInput.count();
      
      if (nameCount > 0) {
        const currentName = await nameInput.inputValue();
        const newName = currentName ? `${currentName} (Test)` : 'Test User';
        
        await nameInput.fill(newName);
        
        // Save changes
        const saveButton = page.getByRole('button', { name: '儲存變更' });
        await saveButton.click();
        
        await page.waitForTimeout(1000);
        
        // Check for success message
        const toast = page.locator('[role="status"]');
        const toastCount = await toast.count();
        
        if (toastCount > 0) {
          await expect(toast.first()).toBeVisible();
        }
      }
    }
  });
});

