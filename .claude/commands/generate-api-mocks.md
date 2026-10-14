---
description: Sinh mock/stub cho API (Playwright route / WireMock) từ response thực tế hoặc Swagger spec — kèm test cho các edge cases (500, timeout, data rỗng, danh sách lớn).
skills:
  - skills-api-mocking
  - skills-test-data-generator
---

# Workflow: Sinh API Mocks

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-api-mocking`** (tại `.claude/skills/skills-api-mocking/SKILL.md`) trước khi bắt đầu.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **KHÔNG bịa cấu trúc response** — phải capture từ API thật (qua browser network) hoặc lấy từ Swagger spec
- Mock setup KHÔNG đặt trong Page class — đặt trong fixture/helper/test file
- Route pattern phải đủ cụ thể — không dùng pattern quá rộng chặn nhầm request khác
- Test dùng mock phải được đánh dấu rõ (tag `[mocked]`) để phân biệt với E2E thật

## Input cần thu thập

| Input | Bắt buộc? |
|---|---|
| API endpoints cần mock (URL pattern) | ⭐ Bắt buộc — user cung cấp HOẶC agent quan sát network khi thao tác UI |
| Nguồn response mẫu: Swagger spec URL / response capture / API chạy được | ⭐ Bắt buộc (1 trong 3) |
| Framework đích (Playwright TS / WireMock Java) | ⭐ Bắt buộc — hỏi nếu chưa rõ |
| Các edge cases cần cover | Mặc định: success + empty + 500 + 401; hỏi user nếu cần thêm timeout/network fail/big list |

## Các bước thực hiện

### Bước 1: Thu thập Response Mẫu
1. Nếu có Swagger → đọc schema của từng endpoint — dùng snapshot ở `_discovery/sources/` nếu đã có; chưa có thì lấy spec bản gốc theo skill `skills-requirements-analyzer` mục 3.4.1 (tải thô bằng `curl`, trang Swagger UI/Scalar là renderer không phải spec)
2. Nếu app chạy được → mở browser (Playwright MCP: `navigate → wait_for(page_load)`), thao tác UI, capture response thật từ network
3. Lưu response mẫu làm baseline cho mock

### Bước 2: Thiết Kế Bộ Mock (CHECKPOINT)
1. Lập bảng: endpoint × edge cases sẽ mock (success / empty / 500 / 401 / timeout / abort / big list)
2. **⏸️ DỪNG LẠI** — trình bày bảng cho user xác nhận phạm vi trước khi sinh code

### Bước 3: Sinh Mock Code
1. **Playwright:** helper `mocks/api-mocks.ts` với các hàm mock tái sử dụng theo mẫu trong skill
2. **WireMock:** stub mappings + `__files/` response JSON
3. Data cho response lớn → dùng skill `skills-test-data-generator` (unique, traceable)

### Bước 4: Sinh Test Sử Dụng Mock
1. Mỗi edge case 1 test, assertion verify hành vi UI tương ứng (empty state, error message, loading, redirect login...)
2. Tag test rõ ràng: `test.describe('[mocked] Products API', ...)`

### Bước 5: Verify
1. Chạy test với mock — xác nhận PASS và route được intercept đúng (không lọt request thật)
2. Chạy 2 lần liên tiếp để đảm bảo ổn định
3. Cleanup theo Definition of Done trong `CLAUDE.md`

## Output

- Helper mock code (`mocks/api-mocks.ts` hoặc WireMock `mappings/` + `__files/`)
- Test file sử dụng mock cho từng edge case (đã chạy PASS)
- Bảng tóm tắt: endpoint × edge case × test tương ứng × kết quả
