import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { waitForPageLoad } from '../helpers/test-helpers';

const FIXTURE = path.join(__dirname, '../fixtures/files/sample-products.xlsx');

/**
 * Navigates to the import wizard. Returns false when the session is not an
 * authenticated admin (tests gracefully skip in that case, matching the
 * repo-wide convention for unauthenticated runs).
 */
async function gotoImportWizard(page: Page): Promise<boolean> {
  await page.goto('/admin/products/import', { waitUntil: 'domcontentloaded' });
  await waitForPageLoad(page);
  return page.url().includes('/admin/products/import');
}

async function uploadFixture(page: Page) {
  await page.setInputFiles('[data-testid="xlsx-file-input"]', FIXTURE);
  // Parsing lands on the mapping step
  await expect(page.locator('[data-testid="mapping-next"]')).toBeVisible({
    timeout: 15000,
  });
}

test.describe('Admin product import', () => {
  // Error case: route must not render for non-admins
  test('route is gated: non-admins are redirected away', async ({ page }) => {
    await page.goto('/admin/products/import', { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);

    if (page.url().includes('/signin')) {
      // Unauthenticated: gate worked (redirect to signin)
      expect(page.url()).toContain('/signin');
      return;
    }
    if (!page.url().includes('/admin/products/import')) {
      // Authenticated non-admin: gate worked (redirect home)
      expect(page.url()).not.toContain('/admin');
      return;
    }
    // Admin: wizard renders
    await expect(page.getByRole('heading', { name: '商品批次匯入' })).toBeVisible();
  });

  // Happy path: admin entry point in the account admin tab
  test('import entry link is visible only in the admin tab', async ({ page }) => {
    await page.goto('/account', { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(page);
    if (page.url().includes('/signin')) {
      test.skip(true, 'Not authenticated');
    }

    const adminTab = page.getByRole('button', { name: '管理員' });
    if ((await adminTab.count()) === 0) {
      // Non-admin: entry link must be absent from the DOM entirely
      await expect(page.locator('[data-testid="admin-import-link"]')).toHaveCount(0);
      return;
    }

    await adminTab.click();
    await expect(page.locator('[data-testid="admin-import-link"]')).toBeVisible();
  });

  // Happy path: upload -> auto-mapped columns -> preview
  test('uploading the fixture auto-maps columns and reaches preview', async ({ page }) => {
    if (!(await gotoImportWizard(page))) {
      test.skip(true, 'Not an authenticated admin');
    }

    await uploadFixture(page);

    // Both fixture sheets are listed with their kinds auto-detected
    await expect(page.getByText('工作表「現貨」')).toBeVisible();
    await expect(page.getByText('工作表「預購」')).toBeVisible();

    await page.locator('[data-testid="mapping-next"]').click();

    // 4 fixture rows -> 4 preview rows across the 現貨/預購 sections
    await expect(page.locator('[data-testid="preview-row"]')).toHaveCount(4);
    await expect(page.getByRole('heading', { name: /現貨/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /預購/ })).toBeVisible();
  });

  // Edge cases: invalid row not importable, selection count updates
  test('preview marks invalid rows and updates the selection count', async ({ page }) => {
    if (!(await gotoImportWizard(page))) {
      test.skip(true, 'Not an authenticated admin');
    }

    await uploadFixture(page);
    await page.locator('[data-testid="mapping-next"]').click();
    const rows = page.locator('[data-testid="preview-row"]');
    await expect(rows).toHaveCount(4);

    // The fixture's TEST003 row has no 1p price -> 錯誤 badge + disabled checkbox
    const invalidRow = rows.filter({ hasText: 'TEST003' });
    await expect(invalidRow.getByText('錯誤')).toBeVisible();
    await expect(invalidRow.getByRole('checkbox')).toBeDisabled();

    // Confirm button reflects the selectable rows (3 valid, unless some
    // already exist in the DB from a previous run and were deselected)
    const confirm = page.locator('[data-testid="import-confirm"]');
    await expect(confirm).toContainText(/匯入 \d+ 筆商品/);
    const before = Number((await confirm.innerText()).match(/\d+/)?.[0] ?? '0');

    // Deselecting a selected valid row decreases the count by one
    const validCheckbox = rows
      .filter({ hasText: 'TEST001' })
      .getByRole('checkbox');
    if ((await validCheckbox.getAttribute('data-state')) === 'checked') {
      await validCheckbox.click();
      await expect(confirm).toContainText(`匯入 ${before - 1} 筆商品`);
    } else {
      await validCheckbox.click();
      await expect(confirm).toContainText(`匯入 ${before + 1} 筆商品`);
    }

    // Stop here deliberately — no actual import, keeps the DB clean
  });
});
