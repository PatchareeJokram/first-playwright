import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';

const VALID_USER     = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test.describe('🔐 Login Feature', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  // beforeEach: ทำก่อนทุก Test — ไม่ต้องเขียน goto() ซ้ำในทุก test
  test.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();  // ทุก Test เริ่มที่หน้า Login
  });

  test.describe('✅ Positive Cases', () => {
        test('TC-L-01 | Login สำเร็จด้วย standard_user', async () => {
            await loginPage.login(VALID_USER, VALID_PASSWORD);
            await inventoryPage.expectOnInventoryPage();
        });

        test('TC-L-02 | URL หลัง Login ต้องเป็น /inventory.html', async ({ page }) => {
            await loginPage.login(VALID_USER, VALID_PASSWORD);
            await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        })

        test('TC-L-03 | หน้า Products แสดงสินค้า 6 รายการ', async () => {
            await loginPage.login(VALID_USER, VALID_PASSWORD);
            await inventoryPage.expectProductCount(6);
        });

        test('TC-L-04 | Logout กลับหน้า Login', async ({ page }) => {
            await loginPage.login(VALID_USER, VALID_PASSWORD);
            await inventoryPage.logout();
            await expect(page).toHaveURL('/');
            await loginPage.expectLoginPageVisible();
        });

        test('TC-L-05 | Login ด้วย problem_user สำเร็จ', async () => {
            await loginPage.login(VALID_USER, VALID_PASSWORD);
            await inventoryPage.expectOnInventoryPage();
        })
    });

    test.describe('❌ Negative Cases', () => {
        test('TC-L-06 | ใส่รหัสผ่านผิด - "do not match any user"', async () => {
            await loginPage.login(VALID_USER, 'wrong_password');
            await loginPage.expectErrorMessage('do not match any user');
        })

        test('TC-L-07 | ใส่ username ผิด - "do not match any user"', async () => {
            await loginPage.login('invalid_user', VALID_PASSWORD);
            await loginPage.expectErrorMessage('do not match any user');
        })

        test('TC-L-08 | ไม่ใส่ Username — "Username is required"', async () => {
            await loginPage.login('', VALID_PASSWORD);
            await loginPage.expectErrorMessage('Username is required');
        });

        test('TC-L-09 | ไม่ใส่ Password — "Password is required"', async () => {
            await loginPage.login(VALID_PASSWORD, '');
            await loginPage.expectErrorMessage('Password is required');
        });

        test('TC-L-10 | ไม่ใส่ Password และ Username — "Username is required"', async () => {
            await loginPage.login('', '');
            await loginPage.expectErrorMessage('Username is required');
        });

        test('TC-L-11 | locked_out_user — แสดง locked out', async () => {
            await loginPage.login('locked_out_user', VALID_PASSWORD);
            await loginPage.expectErrorMessage('Sorry, this user has been locked out');
        });

        test('TC-L-12 | ปิด Error ด้วยปุ่ม X — Error ต้องหายไป', async ({ page }) => {
            await loginPage.login('', '');
            await loginPage.clearError();
            await expect(page.locator('[data-test="error"]')).not.toBeVisible();
        });

        test('TC-L-13 | ใส่ username ผิด - "do not match any user"', async () => {
            await loginPage.login(' ', VALID_PASSWORD);
            await loginPage.expectErrorMessage('do not match any user');
        })

        test('TC-L-14 | Field ต้องถูก Highlight สีแดงเมื่อ error', async () => {
            await loginPage.login('', '');
            await loginPage.expectUsernameFieldHighlighted();
        });
  });
});