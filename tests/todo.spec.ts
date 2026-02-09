import { test, expect } from '@playwright/test';
test.describe('Todo App', () => {

  // ก่อนแต่ละ Test ให้เปิดหน้า Todo App
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
  });

  test('should add a new todo item', async ({ page }) => {
    // ค้นหา Input field แล้วพิมพ์ข้อความ
    const inputBox = page.getByPlaceholder('What needs to be done?');
    await inputBox.fill('Learn Playwright');
    await inputBox.press('Enter');

    // ตรวจสอบว่า Todo item แสดงในรายการ
    await expect(
      page.getByTestId('todo-title')
    ).toHaveText('Learn Playwright');
  });

  test('should mark todo as completed', async ({ page }) => {
    // เพิ่ม Todo item
    const inputBox = page.getByPlaceholder('What needs to be done?');
    await inputBox.fill('Buy groceries');
    await inputBox.press('Enter');

    // คลิก Checkbox เพื่อ Mark เป็น Completed
    await page.getByRole('checkbox').click();

    // ตรวจสอบว่า Item มี class "completed"
    await expect(
      page.getByTestId('todo-item')
    ).toHaveClass(/completed/);
  });

});