import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object Model class
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (error) {
      // Network idle can be flaky, continue anyway
      console.warn('Network idle timeout, continuing');
    }
  }

  async getTitle() {
    return await this.page.title();
  }

  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector);
  }
}

/**
 * Navigation Page Object
 */
export class NavigationPage extends BasePage {
  readonly navbar: Locator;
  readonly userNav: Locator;
  readonly searchButton: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = page.locator('nav');
    this.userNav = page.locator('[data-testid="user-nav"]').or(page.getByRole('button', { name: /會員中心|登入/ }));
    this.searchButton = page.locator('button[aria-label*="search" i]').or(page.getByLabel(/search/i));
    this.cartButton = page.locator('button[aria-label*="cart" i]').or(page.getByLabel(/cart/i));
  }

  async goToAccount() {
    await this.userNav.click();
    await this.page.getByRole('link', { name: '會員中心' }).click();
  }

  async goToFavorites() {
    await this.page.getByRole('link', { name: /心願清單|favorites/i }).click();
  }

  async openSearch() {
    try {
      await this.searchButton.click({ timeout: 5000 });
      await this.page.waitForSelector('input[type="search"], input[placeholder*="search" i]', { 
        timeout: 5000 
      });
    } catch (error) {
      // Search might not open, re-throw to let the test handle it explicitly
      throw new Error(`Search input not visible after clicking search button: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Products Page Object
 */
export class ProductsPage extends BasePage {
  readonly productList: Locator;
  readonly filterBar: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.productList = page.locator('[data-testid="product-list"]').or(page.locator('.product-list, [class*="ProductList"]'));
    this.filterBar = page.locator('[data-testid="filter-bar"]').or(page.locator('[class*="filter"]'));
    this.productCards = page.locator('[data-testid="product-card"]').or(page.locator('article, [class*="ProductCard"]'));
  }

  async selectProduct(index: number) {
    const cards = await this.productCards.all();
    if (cards[index]) {
      await cards[index].click();
    }
  }

  async filterByCategory(category: string) {
    await this.page.getByRole('button', { name: category }).click();
  }
}

/**
 * Account Page Object
 */
export class AccountPage extends BasePage {
  readonly profileTab: Locator;
  readonly wishlistTab: Locator;
  readonly ordersTab: Locator;
  readonly addressTab: Locator;
  readonly paymentTab: Locator;
  readonly adminTab: Locator;
  readonly editButton: Locator;
  readonly profileForm: Locator;

  constructor(page: Page) {
    super(page);
    this.profileTab = page.getByRole('button', { name: '會員中心' });
    this.wishlistTab = page.getByRole('button', { name: '心願清單' });
    this.ordersTab = page.getByRole('button', { name: '訂單追蹤' });
    this.addressTab = page.getByRole('button', { name: '送貨資料' });
    this.paymentTab = page.getByRole('button', { name: '付款方式' });
    this.adminTab = page.getByRole('button', { name: '管理員' });
    this.editButton = page.getByRole('button', { name: '編輯' });
    this.profileForm = page.locator('form');
  }

  async editProfile() {
    await this.editButton.click();
    await this.page.waitForSelector('form');
  }

  async fillProfileForm(data: {
    name?: string;
    gender?: string;
    birth?: string;
    phone?: string;
  }) {
    if (data.name) {
      await this.page.getByLabel('姓名').fill(data.name);
    }
    if (data.gender) {
      await this.page.getByLabel('性別').click();
      await this.page.getByRole('option', { name: data.gender }).click();
    }
    if (data.birth) {
      // Handle date picker
      await this.page.getByLabel('生日').click();
      // Date picker implementation depends on your component
    }
    if (data.phone) {
      await this.page.getByLabel('電話').fill(data.phone);
    }
  }

  async saveProfile() {
    await this.page.getByRole('button', { name: '儲存變更' }).click();
  }
}

