# Playwright E2E Tests

This directory contains end-to-end tests for the BAWAN application using Playwright.

## Test Structure

```
e2e/
├── auth/              # Authentication tests (signin, signup)
├── navigation/        # Navigation and UI tests
├── products/          # Product browsing and detail tests
├── account/           # Account and profile management tests
├── favorites/         # Favorites/wishlist tests
├── fixtures/          # Test fixtures and page objects
│   ├── auth-fixtures.ts
│   └── page-objects.ts
└── helpers/           # Helper functions
    └── test-helpers.ts
```

## Running Tests

### Run all tests
```bash
pnpm test:e2e
```

### Run tests in UI mode (interactive)
```bash
pnpm test:e2e:ui
```

### Run a specific test file
```bash
pnpm playwright test e2e/auth/signin.spec.ts
```

### Run tests in headed mode (see browser)
```bash
pnpm playwright test --headed
```

### Run tests with debug mode
```bash
pnpm playwright test --debug
```

### Run tests on specific browser
```bash
pnpm playwright test --project=chromium
```

## Test Configuration

- **Test Directory**: `./e2e`
- **Base URL**: `http://localhost:3000` (or set `PLAYWRIGHT_TEST_BASE_URL` env variable)
- **Default Browser**: Chromium
- **Screenshots**: On failure only
- **Traces**: On first retry

## Writing Tests

### Using Page Objects

We use Page Object Model pattern for better maintainability:

```typescript
import { ProductsPage } from '../fixtures/page-objects';

test('should display products', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await productsPage.goto('/products');
  // ...
});
```

### Using Helpers

```typescript
import { waitForPageLoad, fillFormField } from '../helpers/test-helpers';

test('should submit form', async ({ page }) => {
  await waitForPageLoad(page);
  await fillFormField(page, 'email', 'test@example.com');
  // ...
});
```

### Using Fixtures

```typescript
import { test } from '../fixtures/auth-fixtures';

test('authenticated user test', async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in
  await authenticatedPage.goto('/account');
});
```

## Best Practices

1. **Use data-testid attributes** in components for reliable selectors
2. **Wait for network idle** before assertions
3. **Use Page Objects** for reusable page interactions
4. **Handle async operations** properly with proper waits
5. **Skip tests** when prerequisites aren't met (e.g., no authentication)
6. **Take screenshots** on failure for debugging

## Notes

- Tests automatically start the dev server before running
- Some tests may skip if authentication is required
- Adjust selectors based on your actual component implementation
- Update page objects as components change

