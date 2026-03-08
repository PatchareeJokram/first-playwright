import { test, expect } from '@playwright/test';

// ── TC-API-01: GET all products ──────────────────────────
test('TC-API-01: GET /products → 200 and returns array', async ({ request }) => {
  const response = await request.get('/products');

  // ✅ ตรวจ HTTP Status
  await expect(response).toBeOK();           // Status 200–299
  expect(response.status()).toBe(200);

  // ✅ ตรวจ Response Body
  const products = await response.json();
  expect(Array.isArray(products)).toBeTruthy();  // ต้องเป็น Array
  expect(products.length).toBeGreaterThan(0);   // ต้องมีสินค้า

  // ✅ ตรวจ Structure ของ Product แรก
  const first = products[0];
  expect(first).toHaveProperty('id');
  expect(first).toHaveProperty('title');
  expect(first).toHaveProperty('price');
  expect(first).toHaveProperty('category');
  expect(typeof first.price).toBe('number');    // price ต้องเป็น number
});

// ── TC-API-02: GET product by ID ─────────────────────────
test('TC-API-02: GET /products/1 → ได้ product ที่ถูกต้อง', async ({ request }) => {
  const response = await request.get('/products/1');
  expect(response.status()).toBe(200);

  const product = await response.json();
  expect(product.id).toBe(1);
  expect(product.title).toBeTruthy();
  expect(product.price).toBeGreaterThan(0);
});

// ── TC-API-03: GET product ที่ไม่มี → 400 ──────────────
test('TC-API-03: GET /products/99999 → ไม่พบสินค้า', async ({ request }) => {
  const response = await request.get('/products/99999');
  // Platzi API คืน 400 เมื่อ ID ไม่ถูกต้อง
  expect([400, 404]).toContain(response.status());
});

// ── TC-API-04: GET products with limit ──────────────────
test('TC-API-04: GET /products?limit=5 → ได้แค่ 5 รายการ', async ({ request }) => {
  const response = await request.get('/products?limit=5');
  expect(response.status()).toBe(200);

  const products = await response.json();
  expect(products.length).toBeLessThanOrEqual(5);
});

// ── TC-API-05: POST สร้าง Product ใหม่ ──────────────────
test('TC-API-05: POST /products → สร้าง product สำเร็จ', async ({ request }) => {
  const newProduct = {
    title: 'Test Product',
    price: 999,
    description: 'Created by Playwright test',
    categoryId: 1,
    images: ['https://placeimg.com/640/480/tech'],
  };

  const response = await request.post('/products', {
    data: newProduct,
  });

  expect(response.status()).toBe(201);           // 201 Created

  const created = await response.json();
  expect(created.id).toBeDefined();               // ได้ id กลับมา
  expect(created.title).toBe(newProduct.title);
  expect(created.price).toBe(newProduct.price);
});

// ── TC-API-06: PUT แก้ไข Product ────────────────────────
test('TC-API-06: PUT /products/1 → แก้ไขราคาสินค้า', async ({ request }) => {
  const response = await request.put('/products/1', {
    data: { price: 1500 },
  });

  expect(response.status()).toBe(200);
  const updated = await response.json();
  expect(updated.price).toBe(1500);
});

// ── TC-API-07: DELETE Product ────────────────────────────
test('TC-API-07: DELETE /products/:id → ลบสำเร็จ', async ({ request }) => {
  // สร้างก่อน แล้วค่อยลบ (เพื่อไม่กระทบ data จริง)
  const createRes = await request.post('/products', {
    data: { title: 'To Delete', price: 1, description: 'temp', categoryId: 1, images: ['https://placeimg.com/640/480/any'] },
  });
  const { id } = await createRes.json();

  const deleteRes = await request.delete(`/products/${id}`);
  expect(deleteRes.status()).toBe(200);

  // ยืนยันว่าลบแล้วจริง
  const getRes = await request.get(`/products/${id}`);
  expect([400, 404]).toContain(getRes.status());
});