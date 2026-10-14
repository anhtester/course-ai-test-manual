# Test Cases — Module Sách (`BOOK`) · Book — tổng 180 TC · 3 nền tảng (Web · API · Mobile Android) · độ hạt GỘP

| Thông tin | Nội dung |
|---|---|
| **Hệ thống** | AnhTester Book Management — mã hệ thống `BK` (namespace `_book-api/`) · danh mục TC: [../README.md](../README.md) |
| **Module** | Sách — `Book Management` · prefix `BOOK` |
| **Nguồn requirement** | Index [REQUIREMENTS_BOOK_SUMMARY.md](../../../requirements/_book-api/book/REQUIREMENTS_BOOK_SUMMARY.md) (dùng chung: 4 REQ mục 3.1 — `REQ-51` là `Android · Web · API` · 34 REQ `Android · Web` mục 3.2) · [web/requirements_book_web.md](../../../requirements/_book-api/book/web/requirements_book_web.md) (14 REQ) · [api/requirements_book_api.md](../../../requirements/_book-api/book/api/requirements_book_api.md) (94 REQ) · [mobile/requirements_book_mobile.md](../../../requirements/_book-api/book/mobile/requirements_book_mobile.md) (8 REQ) — **0 AMB treo** (chốt 25-09-2026 `DEMO-AMB-2509` · `DEMO-AMB-2509B` · 26-09-2026 `DEMO-AMB-2609`) |
| **Mode sinh** | QUICK (`/generate-testcases-from-requirements`) · độ hạt **GỘP** (mặc định) · Mobile: chế độ **BỔ SUNG** (module đã có bộ TC Web + API) |
| **Ngày sinh** | Web · API 25-09-2026 · Mobile 26-09-2026 |
| **Dải TC ID** | `BK_BOOK_TC_001` → `BK_BOOK_TC_180` (Web `001`→`059` · API `060`→`135` · **Mobile `136`→`180`**; `090`→`135` bổ sung 25-09-2026 khi có REQ mặt API — nối tiếp, không chèn giữa) |
| **Mã kế tiếp** | `BK_BOOK_TC_181` — **KHÔNG đánh lại từ 001** |
| **Phạm vi REQ** | Web: 52/52 REQ (14 chỉ Web + 34 `Android · Web` + 4 mục 3.1). API: **98/98** REQ (94 riêng API + 4 dùng chung) — 5 endpoint `/api/book*`. **Mobile (Android): 43/43** REQ (34 `Android · Web` + `REQ-51` + 8 chỉ Android). Ngoài phạm vi viết TC: quản lý danh mục ⚙ (module `CAT`) · **tạo / sửa khuyến mãi** (module `PROMO` — khuyến mãi tác động lên giá bán của **mọi** sách nên TC **không** tạo) · tải ảnh bìa (module `FILE`) · mở khoá slug bằng `Change` · Android: REQ **chưa khai** nền tảng Android — `01` · `42` · `52` (mục 3.1) · `03` · `07` · `08` · `19` · `20` · `35` → `37` · `39` · `40` · `43` · `46` · `47` · `50` (chỉ Web — tạo sách Android lỗi / cần URL / chưa thử, [requirements mobile mục 2](../../../requirements/_book-api/book/mobile/requirements_book_mobile.md#2-bản-đồ-phủ-tài-liệu)) · iOS chưa khảo sát |
| **Mức rủi ro · độ sâu** | `Cao` → **Đầy đủ** — đủ 6 nhánh V1, mọi nhánh V2 có điều kiện kích hoạt, V3/V4 chấm từng nhánh.<br>Căn cứ chấm Cao: đụng **giá tiền** (giá gốc, giá bán sau khuyến mãi — đang có lỗi giá âm) · thao tác **không hồi lại được** (xoá sách) · mọi người dùng sửa/xoá được sách người khác.<br>**Hạ xuống Tiêu chuẩn khi:** không bao giờ — module có tiền luôn giữ mức Cao |
| **Môi trường** | `https://book.anhtester.com` — **production, server duy nhất**. **Không** dùng chung (user chốt 14-08-2026) nhưng chỉ ghi/xoá sách do chính lượt chạy tạo |
| **Trình duyệt chuẩn** | Google Chrome (desktop) · viewport `1600×750` · `en-US` |
| **Thiết bị chuẩn (Mobile)** | Emulator `Pixel_10_Pro_XL_API_37` · Android 17 · `1344×2992` · dọc (trừ TC_180) · locale `en-US` · app `book.anhtester.com` `1.0 (versionCode 1)` bản debug (Hybrid — Capacitor). **iOS chưa khảo sát** — bộ TC Mobile **không** áp cho iOS |

## Cách đọc bộ TC này

Cùng quy ước với module `AUTH` — xem [TEST_CASES_AUTH_SUMMARY.md › Cách đọc bộ TC này](../auth/TEST_CASES_AUTH_SUMMARY.md#cách-đọc-bộ-tc-này): biến thể `a`/`b`/`c`, **Bảng kiểm**, `🔧 Ghi chú kỹ thuật` (`@TechCheck` — ở Mobile là phần cần Appium Inspector / `adb`), `⚠️ chưa có evidence` (`@NeedsVerify`), `🐞 Kỳ vọng FAIL` (`@KnownBug`). Tag nền tảng: `@Web` · `@API` · `@Android`.

---

## Dữ liệu dùng chung

### Trạng thái xuất phát

| Ký hiệu | Trạng thái | Cách đưa về |
|---|---|---|
| `B0` | **Khách**, ở `https://book.anhtester.com/book-management`, tab `All`, `Sort By: Feature` | Avatar → `Logout`, rồi menu trái `Book` |
| `B1` | **`TK-B` đang đăng nhập**, ở `/book-management` | Từ `B0`: avatar → đăng nhập `TK-B` → menu trái `Book` |

### Tài khoản & sách test

| Ký hiệu | Dữ liệu | Tạo bởi | Dùng cho |
|---|---|---|---|
| `TK-B` | Name `Auto Book Owner 1790150600` · `auto_book_1790150600@auto.test` · `Auto@12345` | Sign up ở setup (hoặc `POST /api/register`) | `B1` |
| `S-A` | `Auto Book 1790150601 Tiếng Việt` · slug `auto-book-1790150601-tieng-viet` · `Technology` · `50000` | `TC_027` | TC_002 · 007 · 016 · 028 · 029 · 051 |
| `S-B` | `Auto Book 1790150602` · `Technology` · `50000` | setup (`New book`) | TC_030 · 031 · 053 · 054 |
| `S-C` | `Auto Book 1790150603` · `Technology` · `50000` — **đổi tên** thành `Auto Book 1790150603 Renamed` trước `TC_055` | setup | TC_055 → 056 → 032 (xoá) |
| Tệp | `auto_book_cover.png` (PNG ≈ 1 KB) · `auto_note.txt` (văn bản) | QA chuẩn bị sẵn | Mọi TC tạo sách · TC_047 |

Số `17901506xx` = mốc mẫu `1790150600` + độ lệch — khi chạy thay bằng `T + xx`, ghi `T` vào đầu execution report.

### Thứ tự chạy

```
Setup   : Sign up TK-B → đăng nhập → New book S-B · S-C (đổi tên S-C thành "… Renamed")
Part 02 V1: TC_024 → 026 → 027 (tạo S-A) → 028 → 029 → 030 → 031 → (055 → 056 →) 032 (xoá S-C)
Part 01   : TC_001 → 023   (cần S-A cho 002 · 007 · 016)
Part 02 V2: TC_033 → 054 · 057 → 059
Teardown: xoá qua Modify → Delete mọi sách `Auto Book 17901506xx` còn lại · xoá danh mục `Auto Cat …` qua ⚙ (module CAT)
          → xoá TK-B bằng API (token của chính nó) → báo số tạo / số dọn / còn sót (kể cả ảnh bìa — RISK-BK-BOOK-03)
```

### Dọn dữ liệu — BẮT BUỘC sau mỗi lượt (`RISK-BK-BOOK-01` · `03`)

| Độ lệch | Bản ghi | Tạo bởi |
|---|---|---|
| `00` | `TK-B` | setup — xoá cuối bằng API |
| `01` · `02` · `03` | `S-A` · `S-B` · `S-C` | TC_027 · setup (`S-C` đã xoá ở TC_032) |
| `04` | Sách `Auto Book 1790150604 Cat` + danh mục **mới** `Auto Cat 1790150604` | TC_050 |
| `05` | `Auto Book 1790150605 Flow` — tự xoá trong TC | TC_059 |
| `06` · `07` | `… Twice` (có thể 2 bản) · tên chuỗi tấn công | TC_057 · 058 |
| `98` · `99` | Chip danh mục tự gõ / sách lỗi — chỉ tồn tại nếu form **cho qua** ngoài dự kiến | TC_035 → 046 |
| — | Ảnh bìa `$book-image/auto-book-17901506xx…` — xoá sách **không** xoá ảnh (`AMB-BK-BOOK-16` ✅) | Mọi TC tạo sách — dọn ở module `FILE` |

🚫 **Không** bấm bút / mở chi tiết / xoá sách nào không có tiền tố `Auto Book 17901506`.

---

## Dữ liệu dùng chung (API)

| Ký hiệu | Cách tạo | Dùng cho |
|---|---|---|
| `userA` | `POST /api/register` `…_a_<T>@auto.test` → `POST /api/login` → `tokenA` · `GET /api/me` → `id` | Chủ sở hữu sách · thao tác ghi |
| `userB` | như `userA` (`…_b_<T>@auto.test`) → `tokenB` | Mục tiêu BOLA (`TC_085` · `089`) |
| `userC` | như `userA` (`…_c_<T>@auto.test`) | Chủ sách bị xoá — `TC_134` |
| Sách của lượt chạy | `POST /api/book` (tokenA) `name:"Auto BookAPI <tag> <T>"` · `categories:["auto_bookapi_cat_<tag>_<T>"]` · `price` 50.000 (trừ khi TC nêu) → tra `id`/`slug` bằng `GET /api/book?search={"name":{"equals":"<tên>"}}` | `bookA` (`ok`) · `bookB` (`desc`) · `bookD` · `bookS` · `bookU` · `bookP1` `bookP2` `bookP3` (giá 1.000 · 70.000 · 1.000.000) · `bookN` · `bookA2` · … — **mỗi TC ghi/xoá dùng sách đích riêng** |

`<T>` = Unix timestamp lúc bắt đầu lượt, ghi vào đầu execution report. Tên sách và danh mục mang `<T>` để truy vết **và** né ràng buộc trùng tên (F-29).

**Thứ tự chạy (API):** Setup `userA` · `userB` · `userC` → tạo sách nền (`bookA` · `bookB` · `bookD` · `bookS` · `bookU` · `bookP1–3`) → nhóm đọc công khai (`060`→`065` · `090`→`101` · `078`→`080`) → `POST` (`066`→`077` · `102`→`121`, mỗi TC tên sách riêng) → `PATCH` (`081`→`085` · `122`→`133`) → `DELETE` (`086`→`089` · `134`) → `135` → Teardown. `TC_121` (`@RunOnce`) **chạy tay, một lần** — không nằm trong regression.

**Dọn dữ liệu — BẮT BUỘC (API), theo thứ tự:** (1) `DELETE /api/book/{id}` **mọi** sách `Auto BookAPI *<T>*` do phiên tạo (tìm bằng `search` theo `name contains <T>` **và** theo `categories some name contains <T>` để bắt sách tên rỗng / tên lạ) · (2) `DELETE /api/category-book/{name}` **từng** danh mục có tên chứa `<T>` (`GET /api/category-book` → lọc) — **sau** khi sách đã xoá, vì xoá danh mục còn sách bị chặn · (3) xoá `userA` · `userB` · `userC` bằng token của chính nó · (4) báo **tạo / dọn / còn sót** cho **từng loại** (sách · danh mục · tài khoản). 🚫 Không xoá sách / danh mục / tài khoản có sẵn — kể cả danh mục tên rỗng có sẵn (`RISK-BK-BOOK-08`). Lượt kiểm chứng 25-09-2026: sách **46/46** · danh mục **40/40** · tài khoản **5/5** · sót **0**.

🔒 **Chống lộ dữ liệu:** `auth.email` của sách khác là dữ liệu người thật — không in / đính vào báo cáo (`RISK-BK-BOOK-05`). `TC_097`: **không** chép chuỗi `error`.

---

## Dữ liệu dùng chung (Android)

### Trạng thái xuất phát

| Ký hiệu | Trạng thái | Cách đưa app về |
|---|---|---|
| `N1` | **`TK-MB` đang đăng nhập** trên app, hướng dọc, có mạng, tab `Book` · `All` · `Sort By: Feature` · khu lọc đóng | Mở app → avatar → đăng nhập `TK-MB` → tab `Book` (rời tab rồi quay lại để trả sort về `Feature` — REQ-149) |
| `N1f` | Như `N1` + đã bấm `+ New book` — form `Create a new book` **vừa mở**, chưa nhập gì | Từ `N1`: bấm `+ New book`. Form đang dở dang → bấm tab `Dashboard` rồi quay lại, mở form mới |

### Tài khoản · sách · tệp test

| Ký hiệu | Dữ liệu | Tạo bởi | Dùng cho |
|---|---|---|---|
| `TK-MB` | Name `Auto Mobile Book Owner 1790150800` · `auto_mobile_book_1790150800@auto.test` · `Auto@12345` | `POST /api/register` ở setup — **tester** đăng nhập trên app | `N1` · `N1f` |
| `SM-A` | `Auto Mobile Book 1790150801 Tiếng Việt` · slug `auto-mobile-book-1790150801-tieng-viet` · `Technology` · `50000` · 1 ảnh · `Available book` bật | **Trên web** (`New book` bằng `TK-MB`) **hoặc** `POST /api/book` bằng token `TK-MB` — ⚠️ **không** tạo trên app (REQ-147 đang lỗi) | TC_137 · 144 → 146 · 167 · 168-b · 174 → 177 |
| Ảnh | `auto_mobile_book_cover.png` (PNG ≈ 1 KB) | QA đẩy vào máy: `adb push auto_mobile_book_cover.png /sdcard/Download/` rồi quét media để trình chọn ảnh thấy | TC_142 · 143 · 151 · 152 |

Số `17901508xx` = mốc mẫu `1790150800` + độ lệch `xx` — khi chạy thay bằng `T + xx`, ghi `T` vào đầu execution report. Tên sách trên form tạo (`…02` → `…07`) **không** lưu được (form bị chặn hoặc bị REQ-147) — chỉ để truy vết nếu lỡ lưu.

### Chuẩn bị & thứ tự chạy

```
Setup    : POST /api/register TK-MB → tạo SM-A (web hoặc API) → adb push ảnh test → tester đăng nhập TK-MB trên app (gom 1 lượt)
V1       : TC_136 → 141 → 142 → 143 (@KnownBug) → 144 → 145 → 146
V2       : TC_147 → 159 (form tạo — mỗi TC mở form mới) → 160 → 173 (danh sách / lọc) → 174 → 177 (Modify SM-A — không lưu)
V3 · V4  : TC_178 → 179 (tắt / bật mạng) → 180 (xoay — trả về dọc khi xong)
Teardown : xoá SM-A trên WEB (Modify → Delete — hộp xác nhận web hiện đúng tên sách chưa đổi tên) hoặc DELETE /api/book/{id} bằng token TK-MB
           → tìm sách chứa `17901508` (chỉ tồn tại nếu TC_143 / form tạo lưu được ngoài dự kiến) → xoá danh mục `amcat17901508…` nếu có (module CAT)
           → xoá TK-MB bằng API (token của chính nó) → báo số tạo / dọn / còn sót (kể cả ảnh bìa — RISK-BK-BOOK-03)
```

🚫 **Không** bấm `Save changes` / `Delete` trên sách nào qua app — hộp `Confirm delete` trên Android hiện **sai tên** (REQ-48 · `AMB-BK-BOOK-35`), dễ xoá nhầm. **Không** bấm bút / mở chi tiết sách không có tiền tố `Auto Mobile Book 17901508` (mở chi tiết làm tăng lượt xem thật). Sách `Auto BKAPI NoPrice …` còn sót từ đợt API (`RISK-BK-BOOK-10`) — **không** dùng làm dữ liệu TC.

---

## Bản đồ tài liệu

> File này là **index** — không chứa dòng TC.

| Nền tảng | File | Nhóm chức năng | Số TC | TC ID | REQ bao phủ |
|---|---|---|---|---|---|
| Web | [web/parts/part_01_web_danh_sach.md](web/parts/part_01_web_danh_sach.md) | Danh sách · sắp xếp · tab danh mục · Filter (từ khoá, khoảng giá) · quyền khách / đăng nhập | 23 | 001–023 | `01 → 21` · `51` |
| Web | [web/parts/part_02_web_tao_sua_xoa.md](web/parts/part_02_web_tao_sua_xoa.md) | Tạo sách (validation, slug, giá, danh mục, ảnh, khuyến mãi) · chi tiết · sửa · xoá | 36 | 024–059 | `22 → 50` · `52` |
| API | [api/parts/part_01_api_doc_danh_sach_chi_tiet.md](api/parts/part_01_api_doc_danh_sach_chi_tiet.md) | `GET /api/book` · `GET /api/book/{id}` (đọc công khai) | 21 | 060–065 · 078–080 · 090–101 | `REQ-BK-BOOK-01` · `42` · `53 → 82` · `144 → 146` |
| API | [api/parts/part_02_api_tao.md](api/parts/part_02_api_tao.md) | `POST /api/book` | 32 | 066–077 · 102–121 | `REQ-BK-BOOK-51` · `52` · `83 → 113` · `137` · `139` · `140` · `142` · `143` |
| API | [api/parts/part_03_api_sua_xoa.md](api/parts/part_03_api_sua_xoa.md) | `PATCH` · `DELETE /api/book/{id}` · quy ước chung | 23 | 081–089 · 122–135 | `REQ-BK-BOOK-114 → 136` (trừ `137+`) · `138` · `141` |
| Mobile (Android) | [mobile/test_cases_book_mobile.md](mobile/test_cases_book_mobile.md) | Danh sách · thẻ · sắp xếp · tab danh mục · Filter · form Create (Photo Picker, validation) · chi tiết · Modify · Confirm delete · điều hướng · mất mạng · xoay ngang | 45 | 136–180 | `REQ-BK-BOOK-02` · `04 → 06` · `09 → 18` · `21 → 34` · `38` · `41` · `44` · `45` · `48` · `49` · `51` · `147 → 154` |
| iOS | — | Chưa khảo sát — không sinh TC | — | — | — |

Tổng Web: **59 TC · 73 biến thể** + **10 mục Bảng kiểm**. Tổng API: **76 TC** (`060`→`135`, 3 part vì > 40 TC). Tổng Mobile: **45 TC · 58 biến thể** + **33 mục Bảng kiểm** (1 file — dưới ngưỡng 50 TC của độ hạt GỘP). Toàn module **180 TC**.

> **Neo REQ mặt API:** từ 25-09-2026 module `BOOK` **có REQ mặt API** (94 REQ + 4 dùng chung) — mọi TC API neo **1:1** vào REQ API. TC gộp nhiều REQ (`TC_061` · `064` · `065` · `073` · `098` · `108` · `109` · `126` …) ghi **biến thể → REQ** ở cột Expected; biến thể FAIL map về đúng REQ. 20 TC `@KnownBug` (`068` · `070` · `073` · `097` · `098` · `101` · `102` · `103` · `105` · `107` · `116` · `117` · `118` · `119` · `121` · `122` · `127` · `131` · `132` · `133`) theo kỳ vọng đã chốt bằng `DEMO-AMB-2509B`; 1 TC `@NeedsVerify` (`120`).

---

## Assumptions đã áp dụng

| Mã | Điểm chưa rõ | Giả định đã áp dụng | TC bị ảnh hưởng |
|---|---|---|---|
| ASM-BK-BOOK-01 | Slug với nhiều khoảng trắng liền nhau / ký tự đặc biệt — chỉ khảo sát tên có dấu tiếng Việt | Gộp khoảng trắng thành **một** `-` và bỏ ký tự đặc biệt | TC_033 `b` `c` |
| ASM-BK-BOOK-02 | Biên "7 ngày" của nhãn `New` — không tạo được sách lùi ngày trên production để thử đúng biên | Chỉ kiểm 2 lớp: tạo **hôm nay** (có New) và **quá 7 ngày** (không New, dùng sách có sẵn). Ngày thứ 7 **không** kiểm | TC_007 |
| ASM-BK-BOOK-03 | `Price from` gõ chữ — chỉ biết ô là ô số | Ô **không** nhận ký tự chữ | TC_018 bước 3 |
| ASM-BK-BOOK-04 | Tạo sách với danh mục tự gõ (`REQ-52`) — quyết định PO chưa kiểm chứng | Danh mục mới xuất hiện ở hàng tab và ô Categories, số sách `1` | TC_050 |

| ASM-BK-BOOK-05 | Danh sách từ khoá "tên thư viện truy cập dữ liệu" dùng cho `TC_097` (REQ-146) | **Dev cung cấp**; TC đọc từ cấu hình, không ghi vào `docs/` | TC_097 |
| ASM-BK-BOOK-06 | `TC_120` (`name` rỗng) — hệ thống đã có sách tên rỗng nên chỉ thấy lỗi trùng | Giữ kỳ vọng "không phải 2xx"; gắn `@NeedsVerify` cho tới khi có thể kiểm nhánh "rỗng, chưa trùng" | TC_120 |
| ASM-BK-BOOK-07 | Android: tạo sách trên app lỗi (REQ-147) — các TC đọc / sửa cần một sách của phiên | `SM-A` tạo **trên web hoặc API** ở setup, app chỉ đọc / mở form sửa rồi huỷ | TC_137 · 144 → 146 · 167 · 174 → 177 |
| ASM-BK-BOOK-08 | Android: trang chi tiết — REQ-41 ghi có nút `Back` nhưng ảnh `android_book_detail.png` **không** thấy nút này (ảnh bắt đầu từ vùng ảnh bìa); vế **tên / email tác giả** chưa kiểm (sách khảo sát có tác giả đã xoá) | Nút `Back` nằm phía trên, bị cuộn khuất; khối `Author by` hiện tên + email như web | TC_144 (mục `6` · bước 4) |
| ASM-BK-BOOK-09 | Android: dòng định dạng dưới ô giá — ảnh cho thấy **cập nhật ngay khi gõ** (`0 VNĐ` → `50.000 VNĐ`); câu **lỗi** giá (`< 1.000`, `> 100 tỷ`) có hiện ngay hay phải bấm `Create book` — chưa rõ | TC bấm `Create book` trước khi đọc lỗi (như web); dòng định dạng hợp lệ đọc ngay khi gõ | TC_153 → 155 |
| ASM-BK-BOOK-10 | Android: chuỗi tấn công / emoji ở `Search book...` — không có REQ riêng · trạng thái "không có sách khớp" chưa chụp trên Android | Cho kết quả rỗng như từ khoá không khớp (vùng thẻ trống / `No Data` như khi mất mạng); app không chạy mã, không lộ toàn bộ sách | TC_178 |
| ASM-BK-BOOK-11 | Android: nút `Sort By: Newest` sau khi chọn · danh sách gợi ý của `Price to` · chip 28 ký tự — chỉ khảo sát phương án tương tự | Hành vi giống phương án đã thấy (`Sort By: Price: Low to High` · gợi ý `Price from` · chip 25 ký tự) | TC_160 · 169-b · 159-b |

**Không** phát hiện xung đột tài liệu ↔ ảnh. Ảnh `web_book_category_tab_selected_viewport.png` (sách `13 Th08 2026` **không** có `New`) và `web_book_filter_price_range_lost_from_viewport.png` (sách `21 Th09 2026` **có** `New`) **khớp** quyết định 7 ngày của `AMB-BK-BOOK-03` → TC_007-c có evidence.

**Mobile:** không phát hiện xung đột tài liệu ↔ ảnh. `android_book_detail.png` không thấy nút `Back` mà REQ-41 ghi có — là **thiếu góc chụp**, không mâu thuẫn nội dung (`ASM-BK-BOOK-08`, TC_144 `@NeedsVerify`).

---

## Bảng Đối Soát Coverage (Web 52/52 REQ)

| REQ ID | Mô tả ngắn | TC IDs (số biến thể) | Loại case |
|---|---|---|---|
| REQ-BK-BOOK-01 | Khách xem danh sách | TC_001 | P |
| REQ-BK-BOOK-02 | Thẻ sách đủ thông tin | TC_002 | UI (Bảng kiểm 5 mục) |
| REQ-BK-BOOK-03 🟡 | Nhãn New — trong 7 ngày | TC_007 (3) | P · N · EP |
| REQ-BK-BOOK-04 | Mặc định sắp theo lượt xem | TC_005 | P |
| REQ-BK-BOOK-05 | Menu Sort 4 mục + Newest | TC_008 | UI · P |
| REQ-BK-BOOK-06 | Giá tăng dần | TC_009 | P |
| REQ-BK-BOOK-07 | Giá giảm dần | TC_010 | P |
| REQ-BK-BOOK-08 | Sort ghi lên URL | TC_011 | P |
| REQ-BK-BOOK-09 | Cuộn tải thêm | TC_012 | P |
| REQ-BK-BOOK-10 | Tab danh mục kèm số | TC_006 | UI |
| REQ-BK-BOOK-11 | Chọn tab lọc | TC_014 | P |
| REQ-BK-BOOK-12 | Filter mở / đóng | TC_015 | UI Behavior |
| REQ-BK-BOOK-13 | Tìm theo từ khoá | TC_016 (3) | P · EP |
| REQ-BK-BOOK-14 | Không phân biệt hoa thường | TC_017 | P |
| REQ-BK-BOOK-15 | Gợi ý khoảng giá | TC_018 | UI |
| REQ-BK-BOOK-16 | Lọc giá từ | TC_019 | P |
| REQ-BK-BOOK-17 | Lọc khoảng giá | TC_020 | P · 🐞 `@KnownBug` |
| REQ-BK-BOOK-18 | Dòng mô tả khoảng giá | TC_021 | UI |
| REQ-BK-BOOK-19 | Từ khoá + giá lên URL | TC_022 | P |
| REQ-BK-BOOK-20 | Khách không có nút ghi | TC_003 · 023 (2) | Permission · Security |
| REQ-BK-BOOK-21 | Đã đăng nhập có nút ghi | TC_004 | Permission |
| REQ-BK-BOOK-22 | Form Create đủ thành phần | TC_024 | UI (Bảng kiểm 5 mục) |
| REQ-BK-BOOK-23 | Create khoá khi chưa đổi | TC_026 | UI Behavior |
| REQ-BK-BOOK-24 | Slug tự sinh | TC_033 (3) | P · EP |
| REQ-BK-BOOK-25 | Slug khoá mặc định | TC_034 | UI |
| REQ-BK-BOOK-26 | Thiếu ảnh | TC_035 | N |
| REQ-BK-BOOK-27 | Thiếu giá | TC_036 (2) | N |
| REQ-BK-BOOK-28 | Thiếu danh mục | TC_037 | N |
| REQ-BK-BOOK-29 | Giá tối thiểu 1.000 | TC_038 (3) · 039 (2) | **B** — `-1000` · `0` · **`999`** · **`1000`** · `1001` |
| REQ-BK-BOOK-30 | Giá tối đa 100 tỷ | TC_040 · 041 (2) | **B** — **`100000000000`** · **`100000000001`** · rất lớn |
| REQ-BK-BOOK-31 | Định dạng giá | TC_042 (2) | P |
| REQ-BK-BOOK-32 | Categories liệt kê + lọc | TC_043 | P |
| REQ-BK-BOOK-33 | Chip tự gõ | TC_044 | P |
| REQ-BK-BOOK-34 🟡 | Tên danh mục ≤ 24 ký tự | TC_045 · 046 (2) | **B** — **`24`** · **`25`** · `28` |
| REQ-BK-BOOK-35 | Tệp không phải ảnh | TC_047 | N |
| REQ-BK-BOOK-36 | Ảnh hợp lệ xem trước | TC_048 | P |
| REQ-BK-BOOK-37 | Khuyến mãi còn hiệu lực | TC_049 | P · `@TechCheck` |
| REQ-BK-BOOK-38 | Available mặc định bật | TC_025 | UI |
| REQ-BK-BOOK-39 | Tạo sách thành công | TC_027 · 057 · 058 · 059 | P · Error Guessing · Security |
| REQ-BK-BOOK-40 | Sách mới đầu Newest | TC_028 | P |
| REQ-BK-BOOK-41 | Trang chi tiết | TC_029 · 059 | P |
| REQ-BK-BOOK-42 | Lượt xem tăng 1 | TC_051 | P |
| REQ-BK-BOOK-43 | Sách không tồn tại | TC_052 · 059 | N |
| REQ-BK-BOOK-44 | Modify điền sẵn | TC_030 | UI |
| REQ-BK-BOOK-45 | Sửa tên sinh lại slug | TC_053 | Dependency |
| REQ-BK-BOOK-46 | Lưu thay đổi | TC_031 · 059 | P |
| REQ-BK-BOOK-47 | Tắt Available → UNAVAILABLE | TC_054 | State |
| REQ-BK-BOOK-48 | Hộp xoá ghi tên hiện tại | TC_055 | P · 🐞 `@KnownBug` |
| REQ-BK-BOOK-49 | Cancel không xoá | TC_056 | N |
| REQ-BK-BOOK-50 | Xác nhận xoá | TC_032 · 059 | P |
| REQ-BK-BOOK-51 🆕 | Giá bán không âm | TC_013 | N · 🐞 `@KnownBug` |
| REQ-BK-BOOK-52 🆕 | Danh mục tự gõ sinh danh mục mới | TC_050 | P · `@NeedsVerify` |

**Tổng:** 52/52 REQ có ≥ 1 TC ✅. Phép thử 6b: TC gánh ≥ 2 REQ duy nhất là `TC_059` (5 REQ) — mọi REQ có TC khác chống lưng ✅.

### Bảng trạng thái — sách (`AVAILABLE` / `UNAVAILABLE`)

| Từ \ Hành động | Create (bật) | Create (tắt) | Modify tắt | Modify bật | Delete |
|---|---|---|---|---|---|
| — (chưa có) | ✅ → AVAILABLE · TC_025 · 027 | ⏭️ chưa có REQ — ma trận ghi *chưa thử*, rà lại khi khảo sát bổ sung | — | — | — |
| AVAILABLE | — | — | ✅ → UNAVAILABLE · TC_054 | — | ✅ · TC_032 · 059 |
| UNAVAILABLE | — | — | — | ⏭️ chưa có REQ (*chưa thử*) | ✅ · xoá `S-B` ở teardown |

---

## Bảng Đối Soát Coverage (API 98/98 REQ)

| REQ ID | Mô tả ngắn | TC IDs | Loại case |
|---|---|---|---|
| REQ-BK-BOOK-01 | Không cần đăng nhập vẫn xem được danh sách sách (dùng chung — TC Web: TC_001) | TC_060 | P |
| REQ-BK-BOOK-42 | Mở chi tiết sách với `view=true` tăng lượt xem đúng 1 (dùng chung — TC Web: TC_051) | TC_079 | P |
| REQ-BK-BOOK-51 | Giá bán hiển thị không âm (dùng chung — TC Web: TC_013) | TC_117 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-52 | Tạo sách với tên danh mục chưa có sinh danh mục mới (dùng chung — TC Web: TC_050) | TC_074 | P |
| REQ-BK-BOOK-53 | Danh sách trả `list` và `pagination` đúng hình dạng | TC_060 | P |
| REQ-BK-BOOK-54 | `auth` là chủ sách hoặc `null` | TC_060 | P |
| REQ-BK-BOOK-55 | Mặc định `limit`=10 · `page`=1 · sắp `updatedAt` giảm dần | TC_090 | P |
| REQ-BK-BOOK-56 | `limit` cắt đúng số bản ghi và tính `totalPage` | TC_065 | P |
| REQ-BK-BOOK-57 | `limit` ngoài khoảng [1 ; 10000] bị từ chối | TC_065 | P |
| REQ-BK-BOOK-58 | `limit` = 10000 hợp lệ (biên trên) | TC_065 | P |
| REQ-BK-BOOK-59 | `limit` sai kiểu bị từ chối | TC_065 | P |
| REQ-BK-BOOK-60 | `page` chuyển sang trang khác trả bản ghi khác | TC_065 | P |
| REQ-BK-BOOK-61 | `page` < 1 bị từ chối | TC_065 | P |
| REQ-BK-BOOK-62 | `page` sai kiểu bị từ chối | TC_065 | P |
| REQ-BK-BOOK-63 | `page` vượt tổng số trang trả danh sách rỗng, không lỗi | TC_065 | P |
| REQ-BK-BOOK-64 | `sort` nhận 9 giá trị, `sortBy` sắp đúng chiều | TC_061 | P |
| REQ-BK-BOOK-65 | `sort` ngoài enum bị từ chối | TC_061 | P |
| REQ-BK-BOOK-66 | `sortBy` chỉ nhận `asc` hoặc `desc` | TC_061 | P |
| REQ-BK-BOOK-67 | `search` JSON: lọc theo `name` chứa chuỗi, không phân biệt hoa thường | TC_062 | P |
| REQ-BK-BOOK-68 | `search` JSON: lọc theo `description` và `slug` | TC_091 | P |
| REQ-BK-BOOK-69 | `search` JSON: lọc theo danh mục | TC_063 | P |
| REQ-BK-BOOK-70 | `search` JSON: lọc theo `status` | TC_092 | P |
| REQ-BK-BOOK-71 | `search` JSON: lọc theo giá gốc `price` (`gte` · `gte` + `lte`) | TC_064 | P |
| REQ-BK-BOOK-72 | `search` JSON: lọc `currentPrice` đủ hai đầu `gte` + `lte` | TC_064 | P |
| REQ-BK-BOOK-73 | `search` JSON: `OR` là hợp | TC_093 | P |
| REQ-BK-BOOK-74 | `search` chuỗi thường khớp tên · mô tả · slug, không phân biệt hoa thường | TC_094 | P |
| REQ-BK-BOOK-75 | `search` JSON sai cú pháp được coi là chuỗi thường | TC_095 | P |
| REQ-BK-BOOK-76 | `search` JSON tham chiếu trường hoặc toán tử không tồn tại bị từ chối | TC_096 | P |
| REQ-BK-BOOK-77 | Chi tiết sách trả đủ 13 khoá | TC_078 | P |
| REQ-BK-BOOK-78 | `{id}` nhận cả `id` lẫn `slug` | TC_099 | P |
| REQ-BK-BOOK-79 | Endpoint đọc công khai bỏ qua header `Authorization` | TC_078 | P |
| REQ-BK-BOOK-80 | `view` sai kiểu bị từ chối | TC_100 | P |
| REQ-BK-BOOK-81 | `id` không tồn tại trả 404 | TC_080 | P |
| REQ-BK-BOOK-82 | Sách không có ảnh có `picture` = `[]` ở cả chi tiết lẫn danh sách | TC_101 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-83 | Tạo sách thành công trả **201** | TC_102 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-84 | Sách vừa tạo đọc lại đúng dữ liệu | TC_066 | P |
| REQ-BK-BOOK-85 | Slug tự sinh từ tên: chữ thường, bỏ dấu, nối `-` | TC_103 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-86 | Slug tự đặt được lưu nguyên văn | TC_104 | P |
| REQ-BK-BOOK-87 | Trùng tên sách bị từ chối, không phân biệt hoa thường | TC_075 | P |
| REQ-BK-BOOK-88 | Trùng slug bị từ chối với thông báo nói về slug | TC_105 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-89 | Tạo sách khi không có / sai scheme xác thực bị từ chối | TC_067 | P |
| REQ-BK-BOOK-90 | Tạo sách với token không hợp lệ bị từ chối | TC_067 | P |
| REQ-BK-BOOK-91 | Thiếu `name` bị từ chối | TC_069 | P |
| REQ-BK-BOOK-92 | `name` sai kiểu bị từ chối | TC_069 | P |
| REQ-BK-BOOK-93 | `name` tối đa 191 ký tự | TC_106 | P |
| REQ-BK-BOOK-94 | `status` ngoài enum bị từ chối | TC_072 | P |
| REQ-BK-BOOK-95 | Thiếu `status` bị từ chối | TC_107 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-96 | Thiếu `categories` bị từ chối | TC_108 | P |
| REQ-BK-BOOK-97 | `categories` rỗng bị từ chối | TC_071 | P |
| REQ-BK-BOOK-98 | `categories` sai kiểu bị từ chối | TC_108 | P |
| REQ-BK-BOOK-99 | Danh mục trùng lặp trong mảng được gộp | TC_109 | P |
| REQ-BK-BOOK-100 | Tên danh mục tối đa 191 ký tự | TC_109 | P |
| REQ-BK-BOOK-101 | Thiếu `price` bị từ chối | TC_070 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-102 | `price` sai kiểu bị từ chối | TC_110 | P |
| REQ-BK-BOOK-103 | `price` lớn hơn 100.000.000.000 bị từ chối | TC_111 | P |
| REQ-BK-BOOK-104 | Giá gốc dưới 1.000 (kể cả âm) bị từ chối | TC_073 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-105 | Giá gốc đúng bằng 1.000 (biên dưới) được chấp nhận | TC_073 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-106 | `description` tối đa 65.535 ký tự | TC_112 | P |
| REQ-BK-BOOK-107 | `pictures` sai kiểu bị từ chối | TC_113 | P |
| REQ-BK-BOOK-108 | `pictures` trỏ tệp không tồn tại vẫn tạo được sách, không sinh ảnh | TC_113 | P |
| REQ-BK-BOOK-109 | `promotions` chứa id không tồn tại bị từ chối | TC_114 | P |
| REQ-BK-BOOK-110 | Trường ngoài schema và trường server tự tính bị bỏ qua | TC_076 | P |
| REQ-BK-BOOK-111 | Tạo sách nhận đủ 3 content-type khai trong spec | TC_068 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-112 | Body JSON sai cú pháp bị từ chối, body lỗi **không** phải JSON | TC_115 | P |
| REQ-BK-BOOK-113 | Chuỗi tấn công và Unicode ở `name` · `description` lưu nguyên văn | TC_077 | P |
| REQ-BK-BOOK-114 | Sửa sách thành công trả **201** | TC_122 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-115 | Cập nhật một phần: chỉ gửi field cần đổi | TC_081 | P |
| REQ-BK-BOOK-116 | Body `{}` không đổi gì và không lỗi | TC_123 | P |
| REQ-BK-BOOK-117 | Đổi `name` không sinh lại `slug` | TC_081 | P |
| REQ-BK-BOOK-118 | Đổi sang tên của sách khác bị từ chối; giữ nguyên tên thì được | TC_124 | P |
| REQ-BK-BOOK-119 | Đổi `status` được lưu | TC_082 | P |
| REQ-BK-BOOK-120 | `status` ngoài enum khi sửa bị từ chối | TC_125 | P |
| REQ-BK-BOOK-121 | Đổi `price` được lưu | TC_126 | P |
| REQ-BK-BOOK-122 | `price` sai kiểu hoặc quá lớn khi sửa bị từ chối | TC_126 | P |
| REQ-BK-BOOK-123 | Giá gốc dưới 1.000 (kể cả âm) khi sửa bị từ chối | TC_127 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-124 | `categories` rỗng khi sửa bị từ chối | TC_128 | P |
| REQ-BK-BOOK-125 | Đổi `slug` được lưu | TC_129 | P |
| REQ-BK-BOOK-126 | Sửa sách khi không có / sai token bị từ chối | TC_083 | P |
| REQ-BK-BOOK-127 | Sửa `id` không tồn tại trả 404 | TC_084 | P |
| REQ-BK-BOOK-128 | Người dùng đã đăng nhập sửa được sách của người khác, chủ sách không đổi | TC_085 | P |
| REQ-BK-BOOK-129 | Trường ngoài schema bị bỏ qua khi sửa | TC_130 | P |
| REQ-BK-BOOK-130 | Sửa sách nhận `form-urlencoded` · `multipart` cho field chuỗi; field số bị từ chối | TC_131 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-131 | Xoá sách thành công | TC_086 | P |
| REQ-BK-BOOK-132 | Xoá sách khi không có / sai token bị từ chối | TC_087 | P |
| REQ-BK-BOOK-133 | Xoá `id` không tồn tại, và xoá lần thứ hai, trả 404 | TC_088 | P |
| REQ-BK-BOOK-134 | Người dùng đã đăng nhập xoá được sách của người khác | TC_089 | P |
| REQ-BK-BOOK-135 | Sách của người dùng đã bị xoá vẫn tồn tại với `auth` = `null` | TC_134 | P |
| REQ-BK-BOOK-136 | Body lỗi kiểm tra dữ liệu có hình dạng `msg` + `fields` | TC_135 | P |
| REQ-BK-BOOK-137 | Sách không gắn khuyến mãi có giá bán bằng giá gốc | TC_116 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-138 | Sửa `price` tính lại giá bán | TC_132 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-139 | `price` = 100.000.000.000 được chấp nhận | TC_118 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-140 | `price` số lẻ được lưu nguyên | TC_119 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-141 | Sửa `categories` thay thế toàn bộ danh sách | TC_133 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-142 | `name` rỗng bị từ chối | TC_120 | P · `@NeedsVerify` |
| REQ-BK-BOOK-143 | Tên danh mục rỗng bị từ chối | TC_121 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-144 | `lengthData` bằng số phần tử thực trả về | TC_098 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-145 | `limit` phải là số nguyên | TC_098 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-BOOK-146 | Body lỗi 400 của bộ lọc không lộ thông tin nội bộ | TC_097 | Kỳ vọng chưa đạt · `@KnownBug` |

**Tổng:** 98/98 REQ có ≥ 1 TC ✅ · không REQ nào 🔴. TC gộp nhiều REQ — biến thể → REQ: `TC_060` (bước 1–2→`53` · bước 3→`54`) · `TC_061` (`a·b`→`64` · `c`→`65` · `d`→`66`) · `TC_064` (`a·b`→`71` · `c`→`72`) · `TC_065` (`a`→`56` · `b`→`60` · `c·f`→`57·61` · `d`→`57` · `e`→`59` · `g`→`62` · `h`→`63` · `i`→`58`) · `TC_067` (`a`→`89` · `b·c`→`90`) · `TC_069` (`a`→`91` · `b`→`92`) · `TC_073` (`a·b·c`→`104` · `d`→`105`) · `TC_078` (`a·b`→`77·79`) · `TC_098` (`a·b`→`144` · `c`→`145`) · `TC_108` (`a`→`96` · `b·c`→`98`) · `TC_109` (`a`→`99` · `b→e`→`100`) · `TC_113` (`a`→`107` · `b`→`108`) · `TC_126` (`a`→`121` · `b·c`→`122`) · `TC_081` (bước 3→`115` · bước 3–4 slug→`117`).

---

## Bảng Đối Soát Coverage (Mobile Android 43/43 REQ)

REQ dùng chung có TC ở **mọi** nền tảng đã khai — cột Web dẫn TC web hiện có.

| REQ ID | Mô tả ngắn | Mobile — TC IDs (số biến thể) | Loại case (Mobile) | Web — TC |
|---|---|---|---|---|
| REQ-BK-BOOK-02 | Thẻ sách đủ thông tin (Android: 1 cột) | TC_137 (Bảng kiểm 7 mục) | UI · Display | TC_002 |
| REQ-BK-BOOK-04 | Mặc định `Sort By: Feature` | TC_138 | UI | TC_005 |
| REQ-BK-BOOK-05 | Menu Sort By 4 mục | TC_160 | UI | TC_008 |
| REQ-BK-BOOK-06 | Price: Low to High tăng dần | TC_161 | P | TC_009 |
| REQ-BK-BOOK-09 | Cuộn tải thêm | TC_164 | P | TC_012 |
| REQ-BK-BOOK-10 | Hàng tab danh mục kèm số | TC_139 | UI | TC_006 |
| REQ-BK-BOOK-11 | Chọn tab lọc theo danh mục | TC_165 | P | TC_014 |
| REQ-BK-BOOK-12 | Filter mở / đóng khu lọc | TC_166 | UI Behavior | TC_015 |
| REQ-BK-BOOK-13 | Tìm theo từ khoá | TC_167 (3) · 178 (3) | P · EP · Security | TC_016 |
| REQ-BK-BOOK-14 | Tìm không phân biệt hoa thường | TC_168 (2) | P · EP | TC_017 |
| REQ-BK-BOOK-15 | Gợi ý khoảng giá | TC_169 (2) | UI | TC_018 |
| REQ-BK-BOOK-16 | Lọc giá từ một mức | TC_170 | P | TC_019 |
| REQ-BK-BOOK-17 | Lọc giá trong khoảng | TC_173 | Kỳ vọng chưa đạt · `@KnownBug` | TC_020 |
| REQ-BK-BOOK-18 | Dòng mô tả khoảng giá | TC_172 | UI | TC_021 |
| REQ-BK-BOOK-21 | Đã đăng nhập: New book · bút mọi thẻ · ⚙ | TC_136 (Bảng kiểm 5 mục) | UI · Permission | TC_004 |
| REQ-BK-BOOK-22 | Form Create đủ thành phần | TC_140 (Bảng kiểm 8 mục) | UI | TC_024 |
| REQ-BK-BOOK-23 | Create book khoá khi chưa đổi | TC_147 | UI Behavior | TC_026 |
| REQ-BK-BOOK-24 | Slug tự sinh | TC_148 | Dependency | TC_033 |
| REQ-BK-BOOK-25 | Slug khoá mặc định | TC_149 | UI | TC_034 |
| REQ-BK-BOOK-26 | Thiếu ảnh bị chặn | TC_150 · 142 (bước 3) | N | TC_035 |
| REQ-BK-BOOK-27 | Thiếu giá bị chặn | TC_151 | N | TC_036 |
| REQ-BK-BOOK-28 | Thiếu danh mục bị chặn | TC_152 | N | TC_037 |
| REQ-BK-BOOK-29 | Giá tối thiểu 1.000 | TC_153 (3) · 155-a | **B** — `-1000` · `0` · `999` · **`1000`** | TC_038 · 039 |
| REQ-BK-BOOK-30 | Giá tối đa 100 tỷ | TC_154 (2) · 155-b | **B** — **`100000000000`** · `100000000001` | TC_040 · 041 |
| REQ-BK-BOOK-31 | Định dạng giá dưới ô | TC_155 (4) | P · Display | TC_042 |
| REQ-BK-BOOK-32 | Categories kèm số, lọc, chip | TC_156 | P | TC_043 |
| REQ-BK-BOOK-33 | Chip tự gõ ngôi sao | TC_157 | P | TC_044 |
| REQ-BK-BOOK-34 | Tên danh mục tự gõ ≤ 24 (🟡) | TC_158 · 159 (2) | **B** — **`24`** · `25` · `28` | TC_045 · 046 |
| REQ-BK-BOOK-38 | Available book bật sẵn | TC_141 | UI | TC_025 |
| REQ-BK-BOOK-41 | Trang chi tiết | TC_144 (Bảng kiểm 6 mục) | UI · Display | TC_029 |
| REQ-BK-BOOK-44 | Modify điền sẵn | TC_145 (Bảng kiểm 7 mục) | UI | TC_030 |
| REQ-BK-BOOK-45 | Sửa tên sinh lại slug | TC_174 | Dependency | TC_053 |
| REQ-BK-BOOK-48 | Confirm delete đúng tên | TC_175 | Kỳ vọng chưa đạt · `@KnownBug` | TC_055 |
| REQ-BK-BOOK-49 | Cancel không xoá | TC_146 | N (huỷ) | TC_056 |
| REQ-BK-BOOK-51 | Giá bán không âm (`Android · Web · API`) | TC_162 | Kỳ vọng chưa đạt · `@KnownBug` | TC_013 (API: TC_117) |
| REQ-BK-BOOK-147 | Tạo sách thành công trên Android | TC_143 | Kỳ vọng chưa đạt · `@KnownBug` | — (chỉ Android) |
| REQ-BK-BOOK-148 | Tab Book từ Modify về danh sách | TC_177 | Kỳ vọng chưa đạt · `@KnownBug` | — |
| REQ-BK-BOOK-149 | Sort về Feature khi rời tab | TC_163 | P | — |
| REQ-BK-BOOK-150 | Chọn ảnh qua Photo Picker | TC_142 | P | — |
| REQ-BK-BOOK-151 | Mất mạng: `No Data` | TC_179 | Reliability | — |
| REQ-BK-BOOK-152 | Xoay ngang: lưới 4 cột | TC_180 | UI Stability | — |
| REQ-BK-BOOK-153 | Mô tả chỉ cận dưới | TC_171 | UI | — |
| REQ-BK-BOOK-154 | Breadcrumb Modify đúng tên | TC_176 | Kỳ vọng chưa đạt · `@KnownBug` | — |
| REQ-BK-BOOK-01 · 03 · 07 · 08 · 19 · 20 · 35 · 36 · 37 · 39 · 40 · 42 · 43 · 46 · 47 · 50 · 52 | Khách · New 7 ngày · High to Low · URL · file `.txt` · Promotion · tạo / sửa / xoá thành công · lượt xem · danh mục mới | — | ⚪ **Chưa khai Android** — giữ ở `web/` hoặc mục 3.1 (tạo sách Android lỗi REQ-147 · app không có thanh địa chỉ · chưa thử — [requirements mobile mục 2](../../../requirements/_book-api/book/mobile/requirements_book_mobile.md#2-bản-đồ-phủ-tài-liệu)). Không phải thiếu TC — sinh bổ sung khi REQ chuyển lên `Android · Web` | TC web hiện có |

**Tổng Mobile:** 43/43 REQ có ≥ 1 TC ✅ · không REQ nào 🔴 · 6 TC `@KnownBug` (`143` · `162` · `173` · `175` · `176` · `177`). Phép thử 6b trên file Mobile: TC gánh ≥ 2 REQ duy nhất là `TC_155` (`29` · `30` · `31`) — `29` và `30` có TC_153 · 154 chống lưng, chỉ `31` dựa vào riêng TC_155 ✅.

### Bảng trạng thái — sách (mặt Android)

➖ Không sinh — tạo / đổi `Available book` / xoá sách chưa khai Android (REQ-147 lỗi chặn mọi luồng ghi). Luồng huỷ xoá có ở TC_146.

---

## Bảng Đối Soát Evidence

Đã mở **19/19** ảnh ở [`requirements/_book-api/book/web/evidence/`](../../../requirements/_book-api/book/web/evidence/).

| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| `web_book_list_guest_viewport.png` | Khách — không New book / bút / ⚙ | TC_001 · 003 | ✅ |
| `web_book_list_logged_in_viewport.png` | Đã đăng nhập — New book, bút, ⚙ | TC_002 · 004 · 005 · 006 | ✅ |
| `web_book_sort_menu_open_viewport.png` | Menu Sort By 4 mục | TC_008 | ✅ |
| `web_book_category_tab_selected_viewport.png` | Tab `Test 11` chọn · thẻ `13 Th08 2026` không có New | TC_014 · 007-c | ✅ |
| `web_book_filter_search_uppercase_viewport.png` | Tìm `DORAEMON` · `Price not specified` | TC_015 · 016-c · 017 · 021 | ✅ |
| `web_book_filter_price_range_lost_from_viewport.png` | Khoảng giá — vẫn có giá âm · thẻ `21 Th09 2026` có New | TC_020 · 021 · 013 | ✅ |
| `web_book_create_default_fullpage.png` | Form tạo mặc định | TC_024 · 025 · 026 | ✅ |
| `web_book_create_missing_required_fullpage.png` | Thiếu ảnh · giá · danh mục | TC_035 · 036-a · 037 | ✅ |
| `web_book_create_categories_open_viewport.png` | Danh sách Categories | TC_043 | ✅ |
| `web_book_create_freetext_category_chip_viewport.png` | Chip ngôi sao 28 ký tự + lỗi | TC_044 · 046-b | ✅ |
| `web_book_create_filled_fullpage.png` | Form đủ, slug tự sinh, ảnh xem trước | TC_033-a · 042-a · 048 | 🟡 Ảnh thu nhỏ bị header dính che một phần |
| `web_book_create_success_toast_viewport.png` | `Book created successfully.` giữ tab `Test` | TC_027 | ✅ |
| `web_book_detail_own_viewport.png` | Chi tiết sách tự tạo | TC_029 · 007-b | ✅ |
| `web_book_modify_default_fullpage.png` | Modify điền sẵn | TC_030 | ✅ |
| `web_book_modify_success_toast_viewport.png` | `Book updated successfully.` | TC_031 · 028 · 007-a | ✅ |
| `web_book_unavailable_card_no_mark_element.png` | Thẻ UNAVAILABLE không dấu hiệu | TC_054 (ghi chú) | ✅ |
| `web_book_delete_confirm_stale_name_viewport.png` | Hộp xoá hiện tên cũ | TC_055 | ✅ |
| `web_book_delete_success_toast_viewport.png` | `Deleted successfully.` | TC_032 | ✅ |
| `web_book_detail_deleted_not_found_viewport.png` | `No Data` sau xoá | TC_052 · 059 | 🟡 Không bắt kịp thông báo `Book not found.` — câu đọc bằng DOM |
| *(đọc DOM / network, không ảnh)* | Sort giá · URL sort · cuộn 36→72 · lọc giá từ · slug khoá · giá biên · file `.txt` · khuyến mãi · lượt xem · slug sinh lại · `status` · Cancel xoá | TC_009 · 011 · 012 · 019 · 034 · 038 · 040 · 041-a · 047 · 049 · 051 · 053 · 054 · 056 | ✅ theo số liệu ghi trong AC |

### Vùng chưa có evidence — TC / biến thể gắn `@NeedsVerify`

| TC | Phần chưa có evidence | Đề xuất recon bổ sung |
|---|---|---|
| TC_010 · 012 · 019 | Giá giảm dần · đếm 72 thẻ · giá từng thẻ khi lọc `from` | Chụp + đếm |
| TC_016-b · 018 | Tìm theo slug · ô giá không nhận chữ | 1 ảnh / trạng thái |
| TC_023-b · 033 `b` `c` · 036-b · 039-b · 041-b | URL sửa sách khi là khách · slug đặc biệt · giá chữ · `1001` · giá rất lớn | Chốt `ASM-BK-BOOK-01` · `03` |
| TC_045 · 046-a · 050 | Biên danh mục 24 / 25 · tạo danh mục mới (quyết định PO) | Chạy thật, chụp ảnh |
| TC_047 · 049 · 057 · 058 | Tệp `.txt` · bảng khuyến mãi · Create 2 lần · tên chuỗi tấn công | 1 ảnh / trạng thái |

### Bảng Đối Soát Evidence — Mobile (Android)

Đã mở **20/20** ảnh ở [`requirements/_book-api/book/mobile/evidence/`](../../../requirements/_book-api/book/mobile/evidence/) — ảnh chỉ có sách công khai và dữ liệu test, không có email người dùng.

| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| `android_book_list_logged_in.png` | Danh sách mặc định, đã đăng nhập | TC_136 · 137 · 138 · 139 | ✅ |
| `android_book_sort_menu_open.png` | Menu Sort By mở | TC_160 (bước 2) | ✅ |
| `android_book_sort_price_low_high.png` | Low to High — thẻ đầu giá âm | TC_161 (bước 2) · 162 · 163 (bước 1) | ✅ |
| `android_book_category_tab_selected.png` | Tab `Test 11` được chọn | TC_165 | ✅ |
| `android_book_filter_search_uppercase.png` | Khu lọc mở, tìm `DORAEMON` | TC_166 · 168-a · 172 (bước 1) | ✅ |
| `android_book_filter_price_range_lost_from.png` | Khoảng 10.000 – 100.000, thẻ đầu `-1.000 ₫` | TC_172 · 173 | ✅ |
| `android_book_create_default_part1.png` · `_part2` · `_part3` | Create a new book mặc định (3 phần) | TC_140 · 141 · 147 (bước 1) · 149 | ✅ |
| `android_book_create_missing_required_part2.png` | Thiếu ảnh · giá · danh mục | TC_150 → 152 · 142 (bước 3) | 🟡 Chỉ trạng thái **thiếu cả 3** — ca thiếu **từng** ô suy từ cùng ảnh |
| `android_book_create_freetext_category_chip.png` | 2 chip tự gõ 24 + 25 ký tự — lỗi độ dài | TC_157 · 158 · 159-a | ✅ |
| `android_book_create_filled_part1.png` | Đã chọn ảnh · giá · Technology | TC_142 (bước 6) · 155-c · 156 | ✅ |
| `android_book_create_uploading_no_result.png` | `Uploading image...` ngay sau Create book | TC_143 (hiện trạng) | ✅ |
| `android_book_modify_default_part1.png` · `…_part2.png` | Modify book điền sẵn, breadcrumb sai | TC_145 · 176 | ✅ |
| `android_book_delete_confirm.png` | Confirm delete hiện tên form khác | TC_146 · 175 (hiện trạng) | ✅ |
| `android_book_modify_tab_book_stays.png` | Bấm tab Book khi ở Modify — vẫn Modify | TC_177 | ✅ |
| `android_book_detail.png` | Trang chi tiết | TC_144 | 🟡 Không thấy nút `Back` · khối `Author by` trống (tác giả đã xoá) — `ASM-BK-BOOK-08` |
| `android_book_list_offline.png` | Mất mạng — `No Data`, chỉ tab `All` | TC_179 · (hình mẫu cho 178) | ✅ |
| `android_book_list_landscape.png` | Xoay ngang — 4 cột, nút `>` | TC_180 | ✅ |
| *(đọc thuộc tính, không ảnh — số liệu ghi trong AC)* | Cuộn > 36 thẻ · tìm `doraemon` · gợi ý giá · lọc giá từ · Create book bật · slug · slug khoá · giá biên · sửa tên → slug · Cancel xoá · Sort về Feature · mô tả cận dưới | TC_164 · 167 `a` `b` · 169-a · 170 · 147 (bước 4) · 148 · 149 · 153 · 154-a · 155 `a` `b` `d` · 174 · 146 · 163 · 171 | ✅ theo số liệu trong AC |

**Vùng chưa có evidence (Mobile) — gắn `@NeedsVerify`:** TC_144 (nút `Back` · tên / email tác giả) · 154-b · 159-b (28 ký tự) · 160 (bước 4 `Sort By: Newest`) · 167-c (tìm theo slug) · 169-b (`Price to`) · 178 (chuỗi tấn công). Đề xuất recon bổ sung: 1 ảnh / trạng thái — đặc biệt trang chi tiết của `SM-A` chụp **từ đầu trang** để thấy nút `Back` và khối `Author by` có tên.

---

## Đối soát loại kiểm thử (4 vòng)

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_001 · 002 · 006 · 024 · 025 · 030 (6 TC · 10 mục Bảng kiểm) |
| 1 | Open form | ✅ | TC_024 (`New book`) · 030 (bút) · 029 (chi tiết) · khách mở URL: TC_023 |
| 1 | Display | ✅ | TC_002 (giá `50.000 ₫`, giá gạch, ngày `dd ThMM yyyy`) · 042 (định dạng `VNĐ`) · 052 (trạng thái rỗng `No Data`) |
| 1 | Input valid data | ✅ | TC_027 (đủ ô bắt buộc) · 059 (vòng đời) |
| 1 | Save | ✅ | TC_027 · 031 · 032 — thông báo + điều hướng giữ bộ lọc |
| 1 | Verify data | ✅ | TC_028 (danh sách) · 029 (chi tiết) · 031 bước 4 |
| 2 | UI Behavior | ✅ | TC_015 · 026 · 034 · 048 · 053 |
| 2 | Required | ✅ | TC_035 · 036 · 037 (3 TC · 4 biến thể) — Book name: ⏭️ câu lỗi chưa lấy được (ngoài phạm vi requirements) |
| 2 | Validation | ✅ | TC_038 → 047 (10 TC · 16 biến thể) — đối soát bảng 15 loại bên dưới |
| 2 | Equivalence Partitioning | ✅ | TC_007 (lớp ngày) · 016 (lớp nơi khớp từ khoá) · 033 (lớp tên → slug) |
| 2 | Boundary Value Analysis | ✅ | Giá TC_038 · 039 · 040 · 041 (`999`/`1000` · `100000000000`/`100000000001`) · tên danh mục TC_045 · 046 (`24`/`25`) |
| 2 | Business Rule | ✅ | Giá bán không âm TC_013 · lọc 2 đầu TC_020 · lượt xem +1 TC_051 · New 7 ngày TC_007 |
| 2 | Decision Table | ➖ | Không có quy tắc ≥ 3 điều kiện kết hợp — các lỗi bắt buộc của form tạo là độc lập từng ô |
| 2 | State Transition | ✅ | Bảng trạng thái ở mục Coverage — 4 chuyển có REQ ✅ · 2 chuyển ⏭️ chưa có REQ |
| 2 | Dependency | ✅ | TC_033 · 053 (tên → slug) · 050 (chip → danh mục) · 059 (xoá → link chi tiết chết) |
| 2 | Use Case / Scenario | ✅ | TC_059 |
| 2 | Save / Edit / Delete | ✅ | TC_027 · 031 · 054 · 032 · 056 (huỷ xoá) · 055 |
| 2 | Error Guessing | ✅ | TC_057 (Create 2 lần) · 047 (tệp sai loại) · 036-b (chữ vào ô số) |
| 3 | Permission | ✅ | TC_003 · 004 · 023 — đủ **10/10** ô *đã kiểm chứng* của ma trận Web. 2 ô *suy diễn* (sửa sách người khác · ⚙): 🚫 cố ý **không** thao tác trên dữ liệu người khác. Cột *Vai trò khác*: ➖ không có vai trò (`AMB-BK-01` ✅) |
| 3 | Security | ✅ | TC_003 · 023 · 058 (XSS tên sách) · email người đăng công khai: PO chốt là cố ý (`AMB-BK-BOOK-13`) — TC_029 xác nhận |
| 3 | API | ✅ (25-09-2026) | Mặt API có **76 TC** ở [`api/parts/`](api/parts/) — 5 endpoint, phủ **98/98** REQ. Gồm: auth 401 (`067` · `083` · `087`) · BOLA F-02 (`085` · `089`) · giá bán bất thường F-35 (`116` · `117` `@KnownBug`) · giá không tính lại F-36 (`132`) · giá gốc âm F-04 (`073` · `127`) · danh mục cộng dồn F-37 (`133`) · danh mục sinh tự động (`074`) · bộ lọc JSON (`062` → `064` · `091` → `096`) · Mass Assignment (`076` · `130`) · sách mồ côi F-06 (`134`) · content-type F-41 (`068` · `131`) |
| 3 | Database | ➖ | QA **không** có quyền truy vấn CSDL — đội Dev xác minh |
| 3 | Integration | ➖ | Không có tích hợp bên thứ ba — ảnh lưu ở module `FILE`, khuyến mãi ở `PROMO` cùng hệ thống |
| 3 | Logging / Audit | ➖ | Requirements không có yêu cầu nhật ký thao tác |
| 4 | Compatibility | ⏭️ Cố ý bỏ | Chỉ Chrome desktop. **Quyết định:** phạm vi khảo sát 25-09-2026 — QA lead chốt danh sách trình duyệt. **Rà lại khi:** có cam kết đa trình duyệt |
| 4 | Responsive / UI Stability | ⏭️ Cố ý bỏ | Chỉ viewport `1600×750`; bố cục khách khác đăng nhập (ghi nhận, chưa có REQ). **Rà lại khi:** chốt danh sách breakpoint |
| 4 | Accessibility | ⏭️ Cố ý bỏ | Chưa có REQ trợ năng; nút bút / ⚙ **không** có nhãn truy cập (ghi chú automation). **Quyết định:** đề xuất bỏ ở đợt này — cần QA lead / PO xác nhận. **Rà lại khi:** PO chốt yêu cầu trợ năng |
| 4 | Performance | ➖ | Không có ngưỡng cam kết — đội hiệu năng (chưa phân công). Cuộn vô tận 750+ sách chỉ quan sát ở TC_012 |
| 4 | Regression | ➖ | `docs/bugs/_book-api/` chưa có bug nào được đóng |
| 4 | E2E | ✅ | TC_023 (Book → Sign in — xuyên `AUTH`) · 050 (Book → danh mục `CAT`) · 059 |

### Đối soát Validation theo bảng 15 loại field (form tạo sách)

| Ô | Loại | Mục của bảng | Kết quả |
|---|---|---|---|
| Book name | Text | Bắt buộc ⏭️ câu lỗi chưa lấy được (Create khoá khi form trống — TC_026) · Ký tự đặc biệt / XSS ✅ 058 · Unicode ✅ 033-a · Max length · SQLi · khoảng trắng đầu/cuối ➖ chưa có REQ | 2 ✅ · 1 ⏭️ · 3 ➖ |
| Slug name book | Text (khoá) | Tự sinh ✅ 033 · Khoá ✅ 034 · Sửa tay qua `Change` ➖ ngoài phạm vi requirements | 2 ✅ |
| Regular price | Number / Currency | Bắt buộc ✅ 036 · Min / Max ✅ 038 → 041 · Số âm ✅ 038-a · Số 0 ✅ 038-b · Thập phân ✅ 042-b · Ký tự không phải số ✅ 036-b · Định dạng tiền ✅ 042 · Leading zeros ➖ không có REQ | 7/8, 1 ➖ |
| Categories | Multi-Select / Tag | Bắt buộc ✅ 037 · Chọn có sẵn ✅ 043 · Tag tự gõ ✅ 044 · Độ dài tag ✅ 045 · 046 · Xoá tag bằng `×` ✅ 044 · Giới hạn số tag · tag trùng ➖ không có REQ | 5 ✅ · 2 ➖ |
| Picture | File Upload | Bắt buộc ✅ 035 · Loại không hợp lệ ✅ 047 · Hợp lệ ✅ 048 · Dung lượng tối đa · nhiều tệp · kéo thả · tệp 0 KB ➖ ngoài phạm vi requirements (*chưa thử*) | 3 ✅ · 4 ➖ |
| Description | Textarea | ➖ chưa có REQ giới hạn (ngoài phạm vi) | — |
| Available book | Checkbox | Mặc định ✅ 025 · Tắt / lưu ✅ 054 | 2/2 |
| Price from / to | Number | Gợi ý ✅ 018 · Chỉ nhận số ✅ 018 · Từ ✅ 019 · Khoảng ✅ 020 | 4/4 |

### Đối soát loại kiểm thử (4 vòng) — mặt Mobile (Android)

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_136 · 137 · 138 · 139 · 140 · 141 · 145 (7 TC · 27 mục Bảng kiểm) — nhãn nguyên văn, thứ tự khối / ô, trạng thái mặc định (`Sort By: Feature`, tab `All`, `0 VNĐ`, `Create book` · `Reset` mờ, `Available book` bật) |
| 1 | Open form | ✅ | TC_140 (`+ New book`) · 145 (bút) · 144 (chi tiết) · 146 (Confirm delete — đóng bằng `Cancel`) |
| 1 | Display | ✅ | TC_137 (giá `₫`, giá gạch ngang, ngày `dd ThMM yyyy`) · 144 (`NEW`, `1/1`) · 155 (định dạng `VNĐ`) · 179 (trạng thái rỗng `No Data`) |
| 1 | Input valid data | ✅ | TC_142 (chọn ảnh) · 143 (bộ tối thiểu: tên · ảnh · giá · danh mục) |
| 1 | Save | ✅ `@KnownBug` | TC_143 — tạo sách **dự kiến FAIL** (REQ-147). Sửa / xoá thành công: ⏭️ REQ-46 · 50 chưa khai Android (tạo lỗi nên không có sách của phiên trên app). **Quyết định:** phạm vi REQ `/generate-requirements-from-mobile` 26-09-2026. **Rà lại khi:** Dev sửa REQ-147 và recon lượt 2 |
| 1 | Verify data | ✅ / ⏭️ | TC_137 · 144 · 145 — dữ liệu `SM-A` (tạo trên web / API) hiện đúng ở danh sách · chi tiết · form sửa. Verify sau khi **tạo trên app**: ⏭️ chặn bởi REQ-147 |
| 2 | UI Behavior | ✅ | TC_147 (nút khoá / mở) · 166 (khu lọc mở / đóng) · 142 (lỗi ảnh biến mất khi chọn ảnh) |
| 2 | Required | ✅ | TC_150 · 151 · 152 (3 TC — từng ô). Book name: ⏭️ câu lỗi chưa có REQ (như web) |
| 2 | Validation | ✅ | TC_153 → 159 (7 TC · 16 biến thể) + Required — đối soát theo bảng 15 loại bên dưới |
| 2 | Equivalence Partitioning | ✅ | TC_167 (lớp nơi khớp: tên đủ · một phần · slug) · 168 (lớp chữ hoa / thường) · 155 (lớp giá hợp lệ: biên · thường · số lẻ) |
| 2 | Boundary Value Analysis | ✅ | Giá TC_153 · 154 · 155 (`999` / **`1000`** · **`100000000000`** / `100000000001`) · tên danh mục TC_158 · 159 (**`24`** / `25`) |
| 2 | Business Rule | ✅ | Giá bán không âm TC_162 `@KnownBug` · lọc 2 đầu TC_173 `@KnownBug` · sort về Feature TC_163 · slug theo tên TC_174 |
| 2 | Decision Table | ➖ | Không có quy tắc ≥ 3 điều kiện kết hợp — lỗi bắt buộc của form tạo là độc lập từng ô |
| 2 | State Transition | ➖ | Đổi `Available book` / xoá chưa khai Android (REQ-47 · 50) |
| 2 | Dependency | ✅ | TC_148 · 174 (tên → slug) · 171 · 172 (ô giá → dòng mô tả) · 142 (ảnh → hết lỗi) |
| 2 | Use Case / Scenario | ⏭️ Cố ý bỏ | Chuỗi tạo → sửa → xoá bị chặn ở bước tạo (REQ-147). **Rà lại khi:** như nhánh Save |
| 2 | Save / Edit / Delete | ✅ / ⏭️ | Tạo: TC_143 `@KnownBug` · Sửa không lưu + `Reset`: TC_174 · Huỷ xoá: TC_146. Lưu sửa / xoá thật: ⏭️ như nhánh Save — **cố ý không** bấm `Delete` trên app vì hộp xác nhận hiện sai tên (REQ-48) |
| 2 | Error Guessing | ✅ | TC_175 (mở form tạo dở rồi xoá sách khác — `@KnownBug`) · 177 (tab khi đang sửa — `@KnownBug`) · 143 (bấm `Create book` lần 2 khi lần đầu không phản hồi) · 163 (rời tab mất sort) |
| 3 | Permission | ✅ | TC_136 — đủ **4/4** ô *đã kiểm chứng* của ma trận Android (bút trên mọi thẻ = sửa được sách người khác — thiết kế, `AMB-BK-BOOK-15` ✅; chỉ **quan sát**, không lưu). Cột *Khách*: ⏭️ lượt khảo sát chỉ có phiên đăng nhập (REQ-20 chưa khai Android). *Vai trò khác*: ➖ (`AMB-BK-01` ✅) |
| 3 | Security | ✅ | TC_178 (chuỗi tấn công ở ô tìm) · 175 (hộp xoá sai tên → rủi ro xoá nhầm) · 136 (bút trên sách người khác) |
| 3 | API | ✅ (mặt API riêng) | Không kiểm lại qua app — mặt API có 76 TC (`060` → `135`) |
| 3 | Database | ➖ | QA **không** có quyền truy vấn CSDL — đội Dev xác minh |
| 3 | Integration | ➖ | Không có tích hợp bên thứ ba. Photo Picker là thành phần hệ điều hành — kiểm ở mức "mở được, chọn được" (TC_142) |
| 3 | Logging / Audit | ➖ | Requirements không có yêu cầu nhật ký thao tác |
| 4 | Compatibility | ⏭️ Cố ý bỏ | Chỉ 1 emulator Android 17 — iOS chưa khảo sát. **Quyết định:** phạm vi khảo sát 26-09-2026 — cần QA lead chốt danh sách máy. **Rà lại khi:** có máy thật / bản build iOS |
| 4 | Responsive / UI Stability | ✅ / ⏭️ | TC_180 (xoay ngang) · 137 (1 cột dọc). Bàn phím che ô ở form sách: ⏭️ chưa đo lúc khảo sát (đã có ở Add user — `BK_USER_TC_149`). **Rà lại khi:** recon lượt 2 |
| 4 | Accessibility | ⏭️ Cố ý bỏ | Chưa có REQ trợ năng; nút bút · ⚙ **không** có nhãn truy cập. **Quyết định:** cần QA lead / PO xác nhận. **Rà lại khi:** dev thêm nhãn truy cập |
| 4 | Performance | ➖ | Không có ngưỡng cam kết — đội hiệu năng (chưa phân công). Cuộn vô tận chỉ quan sát ở TC_164 |
| 4 | Regression | ➖ | `docs/bugs/_book-api/` chưa có bug nào được đóng |
| 4 | E2E | ✅ / ⏭️ | Setup tạo `SM-A` trên web / API → đọc trên app (TC_137 · 144 · 145 — xuyên nền tảng). Tạo trên app → thấy trên web: ⏭️ chặn bởi REQ-147 |
| — | Đặc thù mobile (mất mạng · xoay · quyền) | ✅ | TC_179 · 180 · 142 (Photo Picker không xin quyền bộ nhớ). Vòng đời app ở form sách · deep link · push: ⏭️ / ➖ ([requirements mobile mục 6](../../../requirements/_book-api/book/mobile/requirements_book_mobile.md#6-yêu-cầu-riêng-của-mobile-skill-353)) |

#### Đối soát Validation theo bảng 15 loại field — form tạo sách (Android)

| Ô | Loại | Mục của bảng | Kết quả |
|---|---|---|---|
| Book name | Text | Bắt buộc ⏭️ câu lỗi chưa có REQ (`Create book` khoá khi trống — TC_147) · Unicode ✅ 148 (dấu tiếng Việt → slug) · XSS / ký tự đặc biệt / max length / khoảng trắng ⏭️ cần **lưu thành công** mới kiểm được (REQ-147 lỗi — web: `BK_BOOK_TC_058`) | 1 ✅ · ⏭️ có dẫn chứng |
| Slug name book | Text (khoá) | Tự sinh ✅ 148 · Khoá ✅ 149 · Sinh lại khi sửa ✅ 174 · Sửa tay qua `Change` ➖ ngoài phạm vi requirements | 3 ✅ |
| Regular price | Number / Currency | Bắt buộc ✅ 151 · Min / Max ✅ 153 · 154 · 155 · Số âm ✅ 153-a · Số 0 ✅ 153-b · Thập phân ✅ 155-d · Định dạng tiền ✅ 155 · Ký tự không phải số ➖ bàn phím số của Android không có chữ · Leading zeros ➖ không có REQ | 7 ✅ · 2 ➖ |
| Categories | Multi-Select / Tag | Bắt buộc ✅ 152 · Chọn có sẵn ✅ 156 · Tag tự gõ ✅ 157 · Độ dài tag ✅ 158 · 159 · Xoá tag bằng `×` · giới hạn số tag · tag trùng ➖ chưa có REQ Android | 5 ✅ · 3 ➖ |
| Picture | File Upload | Bắt buộc ✅ 150 · Chọn qua Photo Picker ✅ 142 · Loại không hợp lệ ➖ Photo Picker chỉ liệt kê ảnh (REQ-35 không áp dụng Android) · Nhiều ảnh · dung lượng · `Remove all` ➖ chưa có REQ | 2 ✅ · ➖ có lý do |
| Available book | Checkbox | Mặc định ✅ 141 · Tắt / lưu ⏭️ chặn bởi REQ-147 | 1 ✅ |
| Search book · Price from / to | Text · Number | Khớp ✅ 167 · Hoa thường ✅ 168 · Chuỗi tấn công / emoji ✅ 178 · Gợi ý ✅ 169 · Từ ✅ 170 · Khoảng ✅ 173 `@KnownBug` · Mô tả ✅ 171 · 172 | 8 ✅ |

---

## Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)

| Đặc tính | Trạng thái | TC ID / Lý do |
|---|---|---|
| Functional Suitability | ✅ Có TC | TC_001 → TC_059 |
| Performance Efficiency | ➖ Ngoài phạm vi | Không có ngưỡng cam kết — đội hiệu năng (chưa phân công) |
| Compatibility | ➖ Ngoài phạm vi | Chỉ Chrome desktop — QA lead chốt danh sách trình duyệt |
| Interaction Capability | ✅ Có TC | TC_026 (chặn thao tác khi form trống) · 035 → 037 (lỗi trỏ đúng ô) · 052 (trạng thái rỗng) · 056 (huỷ xoá). Trợ năng: ➖ QA lead / PO |
| Reliability | ✅ Có TC (một phần) | TC_057 (Create 2 lần). Mất mạng khi tải ảnh / tạo sách: ➖ chưa có REQ — QA lead |
| Security | ✅ Có TC | TC_003 · 023 · 058. Pentest / BOLA mặt API: ➖ chờ REQ API — QA lead |
| Maintainability | ➖ Không áp dụng | Đặc tính của mã nguồn |
| Flexibility | ➖ Ngoài phạm vi | Responsive / đổi ngôn ngữ chưa khảo sát — QA lead |
| Safety | ✅ Có TC | Có xác nhận trước thao tác không hồi lại được (xoá): TC_055 · 056. Giá bán âm hiển thị công khai là rủi ro tài chính → TC_013 `@KnownBug` |

**Mặt Mobile (Android) — chấm bổ sung 26-09-2026:**

| Đặc tính | Trạng thái | TC ID / Lý do |
|---|---|---|
| Functional Suitability | ✅ Có TC | TC_136 → TC_177 |
| Performance Efficiency | ➖ Ngoài phạm vi | Không có ngưỡng cam kết — đội hiệu năng (chưa phân công) |
| Compatibility | ➖ Ngoài phạm vi | 1 emulator Android 17; iOS chưa khảo sát — QA lead chốt danh sách máy |
| Interaction Capability | ✅ Có TC | TC_147 (chặn khi form trống) · 150 → 152 (lỗi trỏ đúng ô) · 179 (trạng thái rỗng) · 146 (huỷ xoá) · 176 (breadcrumb sai — `@KnownBug`) |
| Reliability | ✅ Có TC | TC_179 (mất mạng) · 143 (tạo sách không phản hồi — `@KnownBug`) |
| Security | ✅ Có TC | TC_178 · 175 · 136 |
| Maintainability | ➖ Không áp dụng | Đặc tính của mã nguồn |
| Flexibility | ✅ Có TC | TC_180 (xoay ngang — lưới 4 cột) |
| Safety | ✅ Có TC | Hộp xác nhận xoá hiện **sai tên** trên Android → rủi ro xoá nhầm: TC_175 `@KnownBug` · huỷ xoá TC_146. Giá bán âm: TC_162 `@KnownBug` |

---

## Đối soát cột Automation

| Nền tảng | Yes | Partial | No | ⏸️ Hoãn |
|---|---|---|---|---|
| Web | 57 | 2 | 0 | 17 (`@NeedsVerify` — nằm trong Yes / Partial) |
| API | 75 | 1 | 0 | 1 (`TC_120` `@NeedsVerify`) — 20 TC `@KnownBug` chạy được, **dự kiến FAIL** |
| Mobile (Android) | 44 | 1 | 0 | 7 (`@NeedsVerify` — nằm trong Yes) · 6 TC `@KnownBug` vẫn automate |

### Điều kiện cần chuẩn bị

| # | Điều kiện | Ai cấp | Trạng thái | TC phụ thuộc |
|---|---|---|---|---|
| 1 | Tệp `auto_book_cover.png` (≈ 1 KB) · `auto_note.txt` trong thư mục test data | QA | ⏳ Cần tạo khi dựng automation | Mọi TC tạo sách · TC_047 |
| 2 | Xoá danh mục `Auto Cat …` (module `CAT`) và ảnh bìa (module `FILE`) ở teardown | QA | ⏳ Chưa có REQ `CAT` / `FILE` — tạm ghi *còn sót* | TC_050 · mọi TC tạo sách |
| 4 | Danh sách từ khoá "tên thư viện truy cập dữ liệu" (`ASM-BK-BOOK-05`) | Dev | ⏳ Chưa có | TC_097 |
| 5 | Dev dọn sách tên rỗng và danh mục tên rỗng có sẵn (nếu muốn kiểm nhánh "rỗng, chưa trùng") | Dev | ⏳ Chưa có | TC_120 · 121 |
| 3 | Nhãn truy cập cho nút bút / ⚙ (hiện không có) | Dev | ⏳ Chưa có — tạm bắt theo thẻ chứa tên sách (Android: thẻ có id ổn định `book-<id>` / `img-book-<id>`) | TC_004 · 030 · 031 · 053 → 056 · 059 · Mobile: 145 · 146 · 174 → 177 |
| 6 | Mobile: Appium + UiAutomator2 · `SM-A` tạo qua API trong `setUp` · ảnh test đẩy vào máy (`adb push` + quét media) · nhập giá bằng bàn phím (`mobile: type`) vì ô số không nhận `setValue` · chọn ảnh trong `com.google.android.photopicker` | QA | ⏳ Cần dựng khi làm automation | TC_136 → 180 |

### TC Partial · No · Hoãn

| TC ID | Automation | Trục chặn | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|
| BK_BOOK_TC_049 | Partial | 1 · Expected cốt lõi nằm ở request | Automation đọc tham số request (bắt `page.on('request')`); nội dung bảng khuyến mãi kiểm tay · ⏸️ Hoãn — `@NeedsVerify` |
| BK_BOOK_TC_057 | Partial | 2 · Chạy lại có cùng kết quả | Hai lần bấm dưới 1 giây phụ thuộc tốc độ công cụ — assert số thẻ sau cùng · ⏸️ Hoãn — `@NeedsVerify` |
| BK_BOOK_TC_010 · 012 · 016 · 018 · 019 · 023 · 033 · 036 · 039 · 041 · 045 · 046 · 047 · 050 · 058 | Yes · ⏸️ Hoãn | — | `@NeedsVerify` — biến thể đã có evidence automate ngay |

| BK_BOOK_TC_121 | Partial | 2 · Không chạy lại được | `@RunOnce` — tạo danh mục tên rỗng **không xoá được**; chạy tay một lần, không đưa vào regression |
| BK_BOOK_TC_141 | Partial | 1 · Expected cốt lõi chỉ đọc được bằng mắt | Công tắc `Available book`: `checked` luôn `false` trên Appium (`RISK-BK-BOOK-09`) → so ảnh vùng công tắc trên **một** emulator cố định |
| BK_BOOK_TC_144 · 154 · 159 · 160 · 167 · 169 · 178 | Yes · ⏸️ Hoãn | — | `@NeedsVerify` (Mobile) — biến thể đã có evidence automate ngay |

ℹ️ 3 TC Web `@KnownBug` (TC_013 · 020 · 055), 20 TC API `@KnownBug` và 6 TC Mobile `@KnownBug` (TC_143 · 162 · 173 · 175 · 176 · 177) **vẫn automate** — test FAIL chính là thứ phơi bug.

---

## Bộ chạy đề xuất

| Bộ | TC | Thời gian ước tính | Ghi chú |
|---|---|---|---|
| **Smoke** (V1) | TC_024 → 032 (tạo `S-A` trước) → TC_001 → 006 | ~25 phút | Fail ở đây → dừng |
| **Smoke API** | TC_060 · 066 · 081 · 086 | ~3 phút | `@Smoke` mặt API |
| API đầy đủ | TC_060 → 135 (trừ `121`) | ~25 phút | Teardown (sách → danh mục → tài khoản) bắt buộc; `@KnownBug` dự kiến FAIL |
| API `@KnownBug` | TC_068 · 070 · 073 · 097 · 098 · 101 · 102 · 103 · 105 · 107 · 116 · 117 · 118 · 119 · 122 · 127 · 131 · 132 · 133 | ~4 phút | Chạy riêng để tách khỏi kết quả hồi quy |
| Regression đầy đủ | TC_001 → 059 theo *Thứ tự chạy* | ~2,5 giờ | Kết thúc bằng teardown |
| Bảo mật & quyền | TC_003 · 004 · 023 · 058 | ~10 phút | `@Security` |
| Lỗi đã biết | TC_013 · 020 · 055 | ~10 phút | `@KnownBug` — mở bug bằng `/create-bug-report` |
| `@TechCheck` | TC_005 · 025 · 048 · 049 · 054 · 056 | — | Phần 🔧 cần DevTools → Network |
| **Smoke Mobile** (V1 Android) | TC_136 → 146 | ~25 phút | Cần `SM-A` + ảnh test trong máy từ setup · TC_143 dự kiến FAIL |
| Regression Mobile | TC_136 → 180 | ~1 giờ 30 phút | Teardown xoá `SM-A` trên web / API rồi `TK-MB` |
| Mobile `@KnownBug` | TC_143 · 162 · 173 · 175 · 176 · 177 | ~12 phút | Chạy riêng — dự kiến FAIL · mở bug bằng `/create-bug-report` |

---

## Nhật ký thay đổi

| Ngày | Thay đổi | Mốc git |
|---|---|---|
| 26-09-2026 | `/generate-testcases-from-requirements` Mode QUICK chế độ **BỔ SUNG** — thêm mặt **Mobile (Android)**: **45 TC · 58 biến thể · 33 mục Bảng kiểm** (`BK_BOOK_TC_136` → `180`, 1 file `mobile/test_cases_book_mobile.md`), độ hạt GỘP giữ theo bộ đang có, rủi ro Cao → Đầy đủ. Phủ **43/43** REQ khai Android (34 `Android · Web` + `REQ-51` + 8 chỉ Android). Đã mở 20/20 ảnh evidence Android — không xung đột nội dung (ảnh chi tiết thiếu góc chụp nút `Back` → `ASM-BK-BOOK-08`). 6 TC `@KnownBug` (`143` · `162` · `173` · `175` · `176` · `177`) · 7 `@NeedsVerify` · 5 `@TechCheck`. Thêm `ASM-BK-BOOK-07` → `11`, trạng thái `N1` / `N1f`, dữ liệu `TK-MB` · `SM-A` (tạo trên web / API vì tạo trên app lỗi). **Không** chạm TC Web / API | `1c4898d` (trước khi ghi) |
| 25-09-2026 | **Chỉnh bộ TC API theo REQ mặt API** (`/generate-requirements-from-api book` + `DEMO-AMB-2509B`): 30 → **76 TC** (`BK_BOOK_TC_060` → `135`; thêm `090` → `135` = 46 TC), tách `api/test_cases_book_api.md` thành **3 part** ở `api/parts/` (> 40 TC). Neo **1:1** REQ API — bỏ mọi dòng `⚠️ Chưa có REQ`. Phủ **98/98** REQ. **Sửa kỳ vọng:** `TC_066` · `081` bỏ ràng buộc status `200` → **2xx** (kiểm `201` riêng ở `102` · `122` `@KnownBug` — spec đúng); `TC_064` **hết `@KnownBug`** (API lọc đúng hai đầu — lỗi mất cận dưới ở **web**); `TC_070` (thiếu `price`) · `073` (giá âm) đổi thành `@KnownBug` theo quyết định PO; `TC_074` (danh mục không tồn tại) đổi thành kiểm **sinh danh mục mới** (thiết kế, `REQ-52`). `TC_075` thêm biến thể HOA. `TC_077` bỏ biến thể description 10.000 ký tự (→ `112`). Thêm 20 TC `@KnownBug` (`068` · `070` · `073` · `097` · `098` · `101` · `102` · `103` · `105` · `107` · `116` → `119` · `121` · `122` · `127` · `131` → `133`), 1 `@NeedsVerify` (`120`). Bỏ `@NeedsVerify` ở các biến thể đã gọi thật | `b30eb57` (trước khi sửa) |
| 25-09-2026 | `/generate-testcases-api book` — thêm mặt **API**: **30 TC** (`BK_BOOK_TC_060` → `089`, 1 file `api/`), độ hạt GỘP. Kiểm chứng ~15 request thật (dữ liệu tự tạo + dọn sạch). Neo tạm REQ Web (20 REQ) · 14 TC `⚠️ Chưa có REQ`. Phát hiện mới F-28 (thiếu price vẫn tạo) · F-29 (trùng tên sách) · F-30 (minItems categories) ghi `api_map.md`. @KnownBug: `064` (lọc khoảng giá F-17) · `073` (giá âm F-04). Module `BOOK` **89 TC** | `b30eb57` (trước khi tạo) |
| 25-09-2026 | Khởi tạo bộ TC **Web** bằng `/generate-testcases-from-requirements` Mode QUICK, độ hạt GỘP, rủi ro Cao → Đầy đủ. **59 TC · 73 biến thể · 10 mục Bảng kiểm**, 2 part, chiếm dải `BK_BOOK_TC_001` → `059`. Phủ **52/52** REQ Web (gồm `REQ-51` · `52` mới và `03` · `34` 🟡 của `DEMO-AMB-2509`). Đã mở 19/19 ảnh evidence, không xung đột. 3 TC `@KnownBug` · 17 TC `@NeedsVerify` · 6 TC `@TechCheck` · 4 Assumption | `b30eb57` (trước khi tạo) |
