import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secretsauce');
  await page.locator('[data-test="login-button"]').click();
  const errorMessage = page.locator('[data-test="error"]');
  await expect(errorMessage).toBeVisible();

  await expect(errorMessage).toContainText('do not match');

  await expect(page.locator('[data-test="username"]')).toHaveClass(/error/);

  await page.locator('[data-test="error-button"]').click();
  await expect(errorMessage).not.toBeVisible();

  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
  await expect(page.locator('.inventory_item_price').first()).toHaveText('$7.99');
});