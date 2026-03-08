import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page           = page;
    this.cartItems      = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button',
      { name: 'Checkout' });
    this.continueButton = page.getByRole('button',
      { name: 'Continue Shopping' });
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async removeItemByName(name: string) {
    const item = this.cartItems
                    .filter({ hasText: name });
    await item.getByRole('button',
      { name: /remove/i }).click();
  }

  async expectCartEmpty() {
    await expect(this.cartItems)
          .toHaveCount(0);
  }

  async expectItemInCart(name: string) {
    const item = this.cartItems
                    .filter({ hasText: name });
    await expect(item).toBeVisible();
  }
}