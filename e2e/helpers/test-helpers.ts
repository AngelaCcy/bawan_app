import { Page, expect } from '@playwright/test';

/**
 * Wait for the page to be fully loaded
 */
export async function waitForPageLoad(page: Page, timeout = 30000) {
  try {
    await page.waitForLoadState('domcontentloaded', { timeout });
    // Wait for network idle with shorter timeout to avoid hanging
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      // Network idle can be flaky, so we don't fail if it times out
    });
  } catch (error) {
    // If page load fails, log but don't throw - let tests handle it
    console.warn('Page load timeout, continuing anyway');
  }
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, url: string) {
  await page.waitForURL(url, { timeout: 10000 });
  await waitForPageLoad(page);
}

/**
 * Click and wait for navigation
 */
export async function clickAndWaitForNavigation(
  page: Page,
  selector: string,
  expectedUrl: string
) {
  await Promise.all([
    page.waitForURL(expectedUrl),
    page.click(selector),
  ]);
  await waitForPageLoad(page);
}

/**
 * Fill form field with validation
 */
export async function fillFormField(
  page: Page,
  name: string,
  value: string
) {
  const field = page.getByLabel(name).or(page.locator(`[name="${name}"]`));
  await field.fill(value);
  await expect(field).toHaveValue(value);
}

/**
 * Check if element is visible and clickable
 */
export async function expectElementVisibleAndClickable(
  page: Page,
  selector: string
) {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  await expect(element).toBeEnabled();
}

/**
 * Wait for toast message to appear
 */
export async function waitForToast(page: Page, message?: string) {
  const toastSelector = '[role="status"], [data-toast]';
  const toast = page.locator(toastSelector).first();
  await expect(toast).toBeVisible({ timeout: 5000 });
  if (message) {
    await expect(toast).toContainText(message);
  }
}

/**
 * Select option from select dropdown
 */
export async function selectOption(
  page: Page,
  selectName: string,
  optionValue: string
) {
  const select = page.locator(`[name="${selectName}"]`).or(page.getByLabel(selectName));
  await select.click();
  await page.getByRole('option', { name: optionValue }).click();
}

/**
 * Take screenshot for debugging
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  fullPage = false
) {
  await page.screenshot({
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage,
  });
}

