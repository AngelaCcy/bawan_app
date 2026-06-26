import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('hero section loads with CTA button linking to /products', async ({ page }) => {
    const cta = page.getByRole('link', { name: '探索商品' });
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute('href');
    expect(href).toContain('/products');
  });

  test('TOP 10 carousel shows at least one product with price', async ({ page }) => {
    await expect(page.getByText('TOP 10')).toBeVisible();
    const priceText = page.locator('text=/NT\\$\\s*[\\d,]+/').first();
    await expect(priceText).toBeVisible();
  });

  test('category showcase has BEAUTY, BODY, HAIR tiles linking to /products', async ({ page }) => {
    for (const label of ['BEAUTY', 'BODY', 'HAIR']) {
      const link = page.getByRole('link', { name: label });
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).toContain('/products');
    }
  });
});
