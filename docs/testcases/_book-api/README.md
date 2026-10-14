# Danh mục Test Cases — AnhTester Book Management (`BK`)

> **Điểm vào tầng test case của hệ thống Book.** Đọc file này trước khi đụng tới `docs/testcases/_book-api/`: module nào đã có TC · dải TC ID nào đã chiếm · mã kế tiếp · độ phủ so với requirements.
>
> ⚠️ Hệ thống **riêng**, không liên quan Perfex CRM — danh mục CRM ở [../README.md](../README.md), **không** dùng chung dải TC ID.

| Mục | Giá trị |
|---|---|
| Hệ thống | AnhTester Book Management — `https://book.anhtester.com` (production, server duy nhất) |
| Tiền tố TC ID | `BK_` → `BK_<MODULE>_TC_<3 số>` — dải **chung mọi nền tảng** của module |
| Nguồn requirements | [`docs/requirements/_book-api/README.md`](../../requirements/_book-api/README.md) |
| Nền tảng | API · Android (`AUTH` 20-09-2026 · `USER` · `BOOK` 26-09-2026) · **Web** (thêm 25-09-2026) · iOS chưa khảo sát |
| Môi trường | **Không** dùng chung (user chốt 14-08-2026) — TC vẫn chỉ ghi/xoá bản ghi do chính lượt chạy tạo, **dọn** sau khi chạy |
| Ngày cập nhật | 26-09-2026 |

---

## 1. Danh mục module đã có test cases

| Module | Prefix TC ID | Dải đã dùng | Mã kế tiếp | Số TC | Nền tảng | Độ hạt | REQ bao phủ | Tài liệu | Cập nhật |
|---|---|---|---|---|---|---|---|---|---|
| Xác thực & Phiên (`AUTH`) | `BK_AUTH_TC_` | `001` → `193` | `194` | 193 | Mobile 58 · API 50 · Web 85 | GỘP | Mobile 46/46 · API 48/48 · Web 72/72 | [TEST_CASES_AUTH_SUMMARY.md](auth/TEST_CASES_AUTH_SUMMARY.md) | 25-09-2026 |
| Người dùng (`USER`) | `BK_USER_TC_` | `001` → `149` | `150` | 149 | Web 50 · API 57 · Mobile 42 | GỘP | Web 42/42 · API 81/81 · Mobile 40/40 | [TEST_CASES_USER_SUMMARY.md](user/TEST_CASES_USER_SUMMARY.md) | 26-09-2026 |
| Sách (`BOOK`) | `BK_BOOK_TC_` | `001` → `180` | `181` | 180 | Web 59 · API 76 · Mobile 45 | GỘP | Web 52/52 · API 98/98 · Mobile 43/43 | [TEST_CASES_BOOK_SUMMARY.md](book/TEST_CASES_BOOK_SUMMARY.md) | 26-09-2026 |

## 2. Độ phủ so với requirements

| Module | REQ có tài liệu | REQ đã có ≥ 1 TC | Độ phủ | Ghi chú |
|---|---|---|---|---|
| `AUTH` | 121 (API 40 · Android 9 · Web 35 · dùng chung `Android · API · Web` 8 · `Android · Web` 29) | Mobile 46 · API 48 · Web 72 | **100%** (121/121) | REQ dùng chung có TC ở **mọi** nền tảng đã khai · `@KnownBug`: API 7 · Mobile 1 · Web 5 · ⚠️ TC API chờ `/update-testcases-from-impact` theo `DEMO-AMB-2509` |
| `USER` | 128 (Web 7 · API 77 · Android 9 · dùng chung `Web · API` 4 · `Android · Web` 31 · `30` 🟡) | Web 42 · API 81 · Mobile 40 | **100%** (128/128) | API 57 TC (3 part) neo 1:1 REQ API · 9 `@KnownBug` API · Mobile 42 TC (1 file) · 3 `@KnownBug` Mobile (`139` · `141` · `142`) · REQ chưa khai Android (`01` · `19` · `32` → `35` · `37` → `40` · `42`) không tính vào cột Mobile |
| `BOOK` | 154 (Web 14 · API 94 · Android 8 · dùng chung `Web · API` 3 · `Android · Web · API` 1 · `Android · Web` 34 · `03` · `34` 🟡) | Web 52 · API 98 · Mobile 43 | **100%** (154/154) | API 76 TC (3 part) · 20 `@KnownBug` API · Web 3 `@KnownBug` · Mobile 45 TC (1 file) · 6 `@KnownBug` Mobile (`143` · `162` · `173` · `175` → `177`) — tạo sách Android lỗi (REQ-147) nên `SM-A` tạo trên web / API |
| `CAT` · `PROMO` · `FILE` · `ADDR` · `SYS` · `DASH` | 0 | 0 | — | Chưa sinh REQ |

## 3. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 26-09-2026 | `/generate-testcases-from-requirements` Mode QUICK chế độ **BỔ SUNG** — thêm mặt **Mobile (Android)** cho `USER` **+42 TC** (`108` → `149`, `user/mobile/test_cases_user_mobile.md`, 58 biến thể) · `BOOK` **+45 TC** (`136` → `180`, `book/mobile/test_cases_book_mobile.md`, 58 biến thể). Độ hạt GỘP · rủi ro Cao → Đầy đủ. Phủ `USER` Mobile 40/40 · `BOOK` Mobile 43/43 REQ khai Android. Mở 43/43 ảnh evidence Android, không xung đột nội dung. 9 TC `@KnownBug` Mobile. Tổng hệ thống **522 TC** |
| 25-09-2026 | **Chỉnh bộ TC API `USER` · `BOOK` theo REQ mặt API** (`DEMO-AMB-2509B`): `USER` 31 → **57 TC** (`051` → `107`) · `BOOK` 30 → **76 TC** (`060` → `135`), mỗi module tách 3 part ở `api/parts/` (> 40 TC), bỏ file `api/test_cases_*_api.md` cũ. Neo **1:1** REQ API, hết dòng `⚠️ Chưa có REQ`. Phủ `USER` API 81/81 · `BOOK` API 98/98. 29 TC `@KnownBug` mới theo kỳ vọng PO chốt. Web: `BK_USER_TC_036` · `037` đổi biên Name 250 → 191. `AUTH`: **đã chỉnh** `BK_AUTH_TC_037` · `038` (Mobile) · `153` · `154` (Web) đổi biên Name 250 → 191 (`REQ-BK-AUTH-73` 🟡); `038` · `154` thêm `@KnownBug` |
| 25-09-2026 | `/generate-testcases-api` **USER + BOOK** mặt API: `USER` +31 TC (`051`→`081`) · `BOOK` +30 TC (`060`→`089`), mỗi module 1 file `api/`. Kiểm chứng gọi thật (dữ liệu tự tạo + dọn sạch, 0 sót). TC neo tạm REQ Web · 26 TC `⚠️ Chưa có REQ`. Phát hiện mới F-26 → F-31 ở `api_map.md`. Tổng hệ thống **363 TC**. **Việc tiếp:** `/generate-requirements-from-api user`·`book` để neo 1:1, rồi `/update-testcases-from-impact` |
| 25-09-2026 | Thêm **nền tảng Web**: `AUTH` +85 TC (`BK_AUTH_TC_109` → `193`, chế độ BỔ SUNG, 3 part ở `auth/web/parts/`) · `USER` khởi tạo **50 TC** (`user/web/`) · `BOOK` khởi tạo **59 TC** (2 part ở `book/web/parts/`). Sinh **sau** khi chốt toàn bộ AMB (`DEMO-AMB-2509`). Tổng hệ thống **302 TC** · phủ **215/215** REQ |
| 20-09-2026 | `AUTH`: tách `TC_069` · `TC_082` (gánh nhiều REQ không có TC chống lưng) → thêm `BK_AUTH_TC_106` → `108`. API **50 TC**, module **108 TC** |
| 20-09-2026 | `/generate-testcases-api auth`: thêm **47 TC API · 89 biến thể** (`BK_AUTH_TC_059` → `105`) ở `auth/api/parts/`. Module `AUTH` đủ **105 TC · 86/86 REQ** |
| 20-09-2026 | Khởi tạo danh mục. Sinh bộ TC **Mobile (Android)** module `AUTH` bằng `/generate-testcases-from-requirements` Mode QUICK, độ hạt GỘP — **58 TC · 95 biến thể**, 2 part ở `auth/mobile/parts/`, chiếm dải `BK_AUTH_TC_001` → `058`. Phủ 46/46 REQ Mobile. TC API chưa sinh — nối tiếp từ `BK_AUTH_TC_059` |
