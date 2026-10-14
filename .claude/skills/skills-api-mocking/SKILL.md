---
name: skills-api-mocking
description: Skill sinh mock/stub cho API — Playwright route interception, WireMock stubs — để test UI độc lập với backend, tái hiện edge case khó (lỗi 500, timeout, data rỗng, danh sách lớn).
---

# API Mocking

Purpose: Sinh mock/stub API để test UI không phụ thuộc backend, và tái hiện các trạng thái backend khó dựng thật.

---

## When to Use

Sử dụng skill này khi:

- Backend chưa sẵn sàng nhưng cần test UI trước
- Cần test edge case khó tái hiện thật: API trả 500, timeout, data rỗng, danh sách 1000+ items, response chậm
- Test third-party API (payment, maps...) không thể gọi thật trong test
- Cần test suite chạy ổn định, không flaky vì backend/network

**KHÔNG mock khi:** đang chạy E2E verification cuối cùng trước release — E2E thật phải đi qua backend thật. Mock dùng cho UI-level tests và edge cases.

---

## Chiến Lược Mock Theo Layer

| Layer | Công cụ | Khi nào dùng |
|---|---|---|
| **Trong test (network intercept)** | Playwright `page.route()` | Mock nhanh cho từng test case UI |
| **Mock server độc lập** | WireMock (Java/standalone) | Nhiều test/nhiều team dùng chung; contract cố định |
| **Trong app (env config)** | Feature flag / mock service của dev | Khi FE có sẵn cơ chế mock — phối hợp với dev |

---

## Playwright Route Interception

### Mock response thành công
```typescript
await page.route('**/api/products', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { id: 1, name: 'Product A', price: 100000 },
    ]),
  });
});
```

### Các edge cases cần cover (BẮT BUỘC cân nhắc đủ bộ)
```typescript
// 1. Server error
await route.fulfill({ status: 500, body: JSON.stringify({ message: 'Internal Server Error' }) });

// 2. Danh sách rỗng — verify empty state UI
await route.fulfill({ status: 200, body: JSON.stringify([]) });

// 3. Unauthorized — verify redirect về login
await route.fulfill({ status: 401, body: JSON.stringify({ message: 'Unauthorized' }) });

// 4. Response chậm — verify loading state (KHÔNG dùng để thay smart wait)
await new Promise((resolve) => setTimeout(resolve, 3000)); // chỉ được phép trong mock handler
await route.fulfill({ status: 200, body: '...' });

// 5. Network fail — verify error handling
await route.abort('failed');

// 6. Danh sách lớn — verify pagination/performance UI
const bigList = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
```

### Nguyên tắc trong POM
- Mock setup đặt trong **test file hoặc fixture**, KHÔNG đặt trong Page class
- Tạo helper tái sử dụng: `mocks/api-mocks.ts` chứa các hàm `mockProductsSuccess(page)`, `mockProductsError(page)`...
- Route pattern dùng glob cụ thể (`**/api/products`), tránh pattern quá rộng (`**/*`) chặn nhầm request khác

---

## WireMock Stubs (Java / standalone)

```java
stubFor(get(urlPathEqualTo("/api/products"))
    .willReturn(aResponse()
        .withStatus(200)
        .withHeader("Content-Type", "application/json")
        .withBodyFile("products-list.json")));

// Simulate delay
stubFor(get(urlPathEqualTo("/api/slow"))
    .willReturn(aResponse().withStatus(200).withFixedDelay(3000)));

// Fault injection
stubFor(get(urlPathEqualTo("/api/broken"))
    .willReturn(aResponse().withFault(Fault.CONNECTION_RESET_BY_PEER)));
```

- Stub files đặt trong `src/test/resources/__files/` và `mappings/`
- Response mẫu lấy từ **API thật hoặc Swagger spec** — không bịa cấu trúc

---

## Workflow

1. **Xác định API cần mock** — từ yêu cầu test hoặc quan sát network thực tế (browser MCP: `read_network_requests` / Playwright: `page.on('response')`)
2. **Thu thập response mẫu THẬT** — capture response từ API thật hoặc lấy schema từ Swagger. KHÔNG tự bịa cấu trúc JSON
3. **Chọn layer mock** — theo bảng chiến lược
4. **Sinh mock code** — response mẫu + đủ bộ edge cases cần thiết cho yêu cầu test
5. **Viết test dùng mock** — mỗi edge case 1 test, assertion verify đúng hành vi UI (empty state, error message, loading...)
6. **Verify** — chạy test với mock, xác nhận route được intercept đúng (không lọt request thật)

---

## Quality Checklist

- [ ] Cấu trúc response mock khớp API thật/Swagger (đã capture, không bịa)
- [ ] Route pattern đủ cụ thể, không chặn nhầm request khác
- [ ] Mock setup nằm ngoài Page class (fixture/helper/test file)
- [ ] Mỗi edge case có test + assertion riêng cho hành vi UI tương ứng
- [ ] Test có mock được đánh dấu rõ (tag/describe `[mocked]`) để phân biệt với E2E thật
- [ ] Không dùng mock delay để "sửa" flaky test — flaky phải fix bằng smart wait

---

## Rules References

- `.claude/rules/playwright_rules.md` — Wait strategy (mock delay ≠ wait strategy)
- `.claude/rules/automation_rules.md` — POM, cấu trúc helper
- `.claude/skills/skills-test-data-generator/SKILL.md` — Sinh data cho response body lớn
