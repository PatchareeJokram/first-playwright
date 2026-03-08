import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly productList: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly cartIcon: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page         = page;
    this.pageTitle    = page.locator('.title');
    this.productList  = page.locator('.inventory_item');
    this.cartBadge    = page.locator('.shopping_cart_badge');
    this.cartIcon     = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenu   = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink   = page.getByRole('link', { name: 'Logout' });
  }

  // ── Actions ──
  async addToCartByName(productName: string) {
    // filter() กรองให้เหลือแค่ card ของสินค้าที่ต้องการ
    const product = this.page.locator('.inventory_item')
                         .filter({ hasText: productName });
    await product.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeFromCartByName(productName: string) {
    const product = this.page.locator('.inventory_item')
                         .filter({ hasText: productName });
    await product.getByRole('button', { name: /remove/i }).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async goToCart() { await this.cartIcon.click(); }

  async logout() {
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }

  // ── Assertions ──
  async expectOnInventoryPage() {
    await expect(this.page).toHaveURL('/inventory.html');
    await expect(this.pageTitle).toHaveText('Products');
  }

  async expectProductCount(count: number) {
    await expect(this.productList).toHaveCount(count);
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartBadgeNotVisible() {
    await expect(this.cartBadge).not.toBeVisible();
  }
}