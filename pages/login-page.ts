import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // ── ① Properties: Locator ทั้งหมดของหน้า Login ──────
  readonly usernameInput: Locator;    // ← ได้จาก Codegen
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // ใช้ getByPlaceholder เพราะ input ไม่มี label ที่ชัดเจน
    this.usernameInput    = page.getByPlaceholder('Username');
    this.passwordInput    = page.getByPlaceholder('Password');
    this.loginButton      = page.getByRole('button', { name: 'Login' });
    // ใช้ data-test attribute เพราะ dev ตั้งใจไว้สำหรับ Testing
    this.errorMessage     = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('.error-button');
  }

  // ── ② Actions ────────────────────────────────────────
  async goto() {
    await this.page.goto('/');  // baseURL ใน config ช่วยให้เขียนแค่ '/'
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clearError() {
    await this.errorCloseButton.click();
  }

  // ── ③ Assertions ──────────────────────────────────────
  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectLoginPageVisible() {
    await expect(this.loginButton).toBeVisible();
  }

  async expectUsernameFieldHighlighted() {
    // ตรวจสอบว่า input มี CSS class "error" เมื่อ login ผิด
    await expect(this.usernameInput).toHaveClass(/error/);
  }
}