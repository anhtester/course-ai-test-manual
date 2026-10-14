# Đặc tả Yêu cầu — Module Sách (`BOOK`)

> Điểm vào cấp hệ thống: [../README.md](../README.md) · Bản đồ API: [../_discovery/api_map.md](../_discovery/api_map.md) mục 2.3 · API: [api/requirements_book_api.md](api/requirements_book_api.md) · Android: [mobile/requirements_book_mobile.md](mobile/requirements_book_mobile.md) · Bản đồ app: [../_discovery/modules/module_03_sach_danh_muc.md](../_discovery/modules/module_03_sach_danh_muc.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management — mã hệ thống `BK` (namespace `_book-api/`) |
| **Module** | Sách — danh sách công khai, lọc/sắp xếp, tạo · xem chi tiết · sửa · xoá sách. Quản lý danh mục (icon ⚙) thuộc `CAT`, khuyến mãi thuộc `PROMO`, kho ảnh thuộc `FILE` |
| **Prefix** | `BOOK` → mã REQ `REQ-BK-BOOK-<nn>` · TC ID `BK_BOOK_TC_<nnn>` |
| **Nền tảng** | **Web** ✅ (25-09-2026) · **API** ✅ (25-09-2026 — 5 operation `GET/POST /api/book` · `GET/PATCH/DELETE /api/book/{id}`) · **Android** 🟨 (26-09-2026 — danh sách · lọc · form · validation ✅; tạo sách **lỗi** (REQ-147), sửa/xoá thành công ❔) · iOS ❔ |
| **Nguồn phân tích** | Web: thao tác thật trên `https://book.anhtester.com/book-management` (Chrome, Playwright MCP) ngày 25-09-2026 · API: spec OpenAPI (snapshot 19-09-2026, `sha256` trùng bản tải lại 25-09-2026) + ≈ 445 request gọi thật ngày 25-09-2026 — chi tiết ở file nền tảng |
| **Ngày phân tích** | 25-09-2026 (Web · API) · 26-09-2026 (Android — emulator Android 17, app `book.anhtester.com` 1.0) |
| **Tài khoản dùng khảo sát** | Web: khách + tài khoản tự tạo `auto_web_<timestamp>_a@auto.test` (đã xoá cuối phiên) · Android: tài khoản test `auto_demo_account_<timestamp>` (tester đăng nhập sẵn) — không sách nào được tạo, không sửa/xoá sách có sẵn |
| **Môi trường dùng chung** | **KHÔNG** (user chốt 14-08-2026) — vẫn chỉ ghi/xoá bản ghi do phiên tạo |
| **Tổng số REQ** | **154** — `web/` 14 · `api/` 94 · `mobile/` 8 · dùng chung 38 (3 `Web · API` · 1 `Android · Web · API` · 34 `Android · Web`) |
| **Dải mã đã dùng** | `REQ-BK-BOOK-01` → `REQ-BK-BOOK-154` (đợt 1 Web `01 → 50` · đợt 2 chốt AMB `DEMO-AMB-2509` `51 → 52`) · đợt 3 API `53 → 146` (`53 → 136` sinh từ spec + gọi thật · `137 → 146` sinh khi chốt AMB `DEMO-AMB-2509B`) · đợt 4 Android `147 → 154` · `AMB-BK-BOOK-01` → `AMB-BK-BOOK-37` · `RISK-BK-BOOK-01` → `RISK-BK-BOOK-10` · `STORY-BK-BOOK-01` → `13` |
| **Mã kế tiếp** | Đợt phân tích sau bắt đầu từ `REQ-BK-BOOK-155` · `AMB-BK-BOOK-38` · `RISK-BK-BOOK-11` — **KHÔNG đánh lại từ 01** |
| **Ambiguity còn treo** | **0** — 37/37 AMB đã chốt (`34 → 37` ngày 26-09-2026 theo `DEMO-AMB-2609`) · 33 chốt 25-09-2026 (`01 → 17`: `DEMO-AMB-2509` · `18 → 33`: `DEMO-AMB-2509B` — cùng là dữ liệu dạy học demo) · AMB cấp hệ thống tham chiếu (`AMB-BK-01` · `02` · `03` · `05`) cũng đã chốt |

---

## 1. Tổng quan

`Book Management` là **cửa hàng sách công khai**: khách xem được toàn bộ sách, lọc theo danh mục, tìm theo từ khoá, lọc theo khoảng giá và sắp xếp; danh sách tự tải thêm khi cuộn. Người đã đăng nhập tạo sách (ảnh, giá, danh mục, khuyến mãi, trạng thái bán) và sửa/xoá được **mọi** sách — kể cả sách của người khác (F-02).

Giá hiển thị là **giá bán** `currentPrice` = giá gốc sau khuyến mãi; khuyến mãi lớn hơn giá gốc cho ra **giá âm** hiển thị công khai (F-04 · `AMB-BK-BOOK-01`). Web chặn giá gốc < 1.000 ngay trên form, nhưng không chặn được giá bán âm do khuyến mãi.

Mặt **API** (`/api/book*`) có thêm hai điều mà giao diện che đi: **giá bán `currentPrice` của mọi sách mới bị áp toàn bộ khuyến mãi đang hiệu lực của hệ thống** (nên âm — nguyên nhân gốc của giá âm ở REQ-51, `AMB-BK-BOOK-18`) và **sửa `categories` cộng dồn thay vì thay thế** (`AMB-BK-BOOK-21`). Chi tiết ở [api/requirements_book_api.md](api/requirements_book_api.md).

### Trong phạm vi

- Danh sách: thẻ sách, nhãn New, 4 kiểu sắp xếp, cuộn tải thêm, tab danh mục, tìm kiếm, lọc khoảng giá, trạng thái URL
- Nút thao tác theo trạng thái đăng nhập · tạo sách (validation, slug, ảnh, danh mục, khuyến mãi, trạng thái) · trang chi tiết · sửa · xoá

### Ngoài phạm vi

| Vùng | Lý do |
|---|---|
| Quản lý danh mục (icon ⚙ cạnh hàng tab) | Module `CAT` — chưa khảo sát |
| Nội dung bảng chọn khuyến mãi · áp khuyến mãi vào sách | Chỉ quan sát request (REQ-37) — cần khảo sát cùng module `PROMO` |
| Mở khoá slug bằng `Change` · nhiều ảnh · giới hạn dung lượng ảnh · mô tả dài | Chưa thử ở lượt 25-09-2026 |
| Câu lỗi khi bỏ trống Book name | Chưa lấy được — nút Create khoá khi form chưa đổi, lúc thử luôn có tên |
| Mở trang chi tiết sách của người khác | Cố ý không làm — mỗi lần mở tăng lượt xem thật |
| Android: khách · tạo/sửa/xoá thành công · lượt xem · Price: High to Low · khối Promotion (REQ-01 · 03 · 07 · 20 · 37 · 39 · 40 · 42 · 46 · 47 · 50 · 52) | Chưa kiểm ở lượt 26-09-2026 — tạo sách trên Android thất bại (REQ-147), không sửa/xoá sách không do phiên tạo. Chi tiết [mobile/ mục 2](mobile/requirements_book_mobile.md#2-bản-đồ-phủ-tài-liệu) |
| Tạo / sửa / xoá **khuyến mãi** (để đối chiếu công thức giá) | Module `PROMO` — chỉ **đọc** danh sách khuyến mãi; không tạo vì khuyến mãi tác động lên giá bán của **mọi** sách |

---

## Bản đồ tài liệu

| Nền tảng | File | Story | REQ bao phủ |
|---|---|---|---|
| Chung `Web · API` (`51` thêm Android) | Index — mục 3.1 | STORY-BK-BOOK-01 · 04 · 05 | `REQ-BK-BOOK-01` · `42` · `51` · `52` (4) |
| Chung `Android · Web` | Index — mục 3.2 | STORY-BK-BOOK-01 → 07 | `02` · `04 → 06` · `09 → 18` · `21 → 34` · `38` · `41` · `44` · `45` · `48` · `49` (34) |
| Web | [web/requirements_book_web.md](web/requirements_book_web.md) | STORY-BK-BOOK-01 · 02 · 03 · 04 · 05 · 06 · 07 | `03` · `07` · `08` · `19` · `20` · `35` · `36` · `37` · `39` · `40` · `43` · `46` · `47` · `50` (14) |
| Mobile (Android) | [mobile/requirements_book_mobile.md](mobile/requirements_book_mobile.md) | STORY-BK-BOOK-01 · 02 · 04 · 06 | `REQ-BK-BOOK-147` → `154` (8) |
| API | [api/requirements_book_api.md](api/requirements_book_api.md) | STORY-BK-BOOK-08 → 13 | `REQ-BK-BOOK-53` → `REQ-BK-BOOK-146` (94) |

Tự kiểm: `4 + 34 + 14 + 94 + 8 = 154` = dải `01 → 154` ✔ — mỗi REQ nằm ở đúng 1 file.

| Nội dung | Ở đâu |
|---|---|
| Metadata · Tổng quan & phạm vi (1) · REQ dùng chung (3) · Ma trận phân quyền (6) · Ma trận trạng thái (7) · Phân rã Story (10) · AMB & RISK (11) · Nhật ký (13) | **File này** |
| Trình duyệt khảo sát · Bảng REQ · Field Spec · Validation · Luồng · Phi chức năng · Ghi chú automation · Danh mục Evidence · Dữ liệu test | [web/requirements_book_web.md](web/requirements_book_web.md) |
| Thiết bị khảo sát · Bản đồ đối chiếu web ↔ Android · Bảng REQ Android · Field Spec · Validation · Yêu cầu riêng mobile · Ghi chú automation · Danh mục Evidence | [mobile/requirements_book_mobile.md](mobile/requirements_book_mobile.md) |
| Endpoint Catalog · Bảng REQ · Field Spec JSON · Validation (body lỗi nguyên văn) · Luồng · Phi chức năng · Nhật ký kiểm chứng request · Dữ liệu tạo/dọn | [api/requirements_book_api.md](api/requirements_book_api.md) |

---

## 3. Yêu cầu dùng chung

### 3.1. Web · API (`REQ-51` thêm Android)

Bốn REQ dưới đây sinh ở đợt Web (25-09-2026), **chuyển lên index** cùng ngày khi kiểm khớp trên API; mã giữ nguyên, AC viết lại ở mức **rule** rồi thêm vế **Web** / **API**. Ảnh evidence ở lại `web/evidence/`.

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-BOOK-01 | Không cần đăng nhập vẫn xem được danh sách sách | Web · API | Danh sách sách công khai | Chưa đăng nhập / không gửi token → danh sách sách trả về. **Web:** `/book-management` → lưới thẻ sách hiển thị; network `GET /api/book?search=…&sortBy=desc&sort=viewCount&page=1&limit=36` → 200 (không token). **API:** `GET /api/book?limit=2&page=1` không `Authorization` → **200** · `list` đủ 14 khoá (REQ-53) | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · `web_book_list_guest_viewport.png` · API: Spec (`security: []`) + kiểm chứng thực tế · GET /api/book → 200 (K-01) |
| REQ-BK-BOOK-42 | Mở chi tiết sách với `view=true` tăng lượt xem đúng 1 | Web · API | Tác dụng của tham số `view` | (1) Đọc `viewCount` của sách tự tạo → (2) lấy chi tiết **kèm** `view=true` → (3) đọc lại → `viewCount` **tăng đúng 1** cho mỗi lần; lấy chi tiết **không** có `view=true` (hoặc `view=false`) thì **không** tăng. **Web:** mở trang chi tiết (request `GET /api/book/<slug>?view=true`) → quay lại danh sách → tăng đúng 1. **API:** `GET /api/book/<id>?view=true` ×3 → `viewCount` 0 → 1 → 3 (sau lần hai và ba); `view=false` và không `view` → giữ nguyên; response của lần gọi mang giá trị **sau** khi tăng | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · đợt khảo sát chỉ đọc **sau** khi mở — TC phải đo đủ trước/sau · API: Spec + kiểm chứng thực tế · GET /api/book/{id} → 200 (K-33) |
| REQ-BK-BOOK-51 | Giá bán hiển thị không âm | Android · Web · API | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-01` ✅ chốt là lỗi) | Giá bán (`currentPrice`) của mọi sách **≥ 0 ₫**; khuyến mãi lớn hơn giá gốc thì giá bán = `0 ₫`. **Web:** `Sort By: Price: Low to High` → thẻ **đầu tiên** có giá ≥ `0 ₫`. **API:** mọi phần tử `GET /api/book` và `GET /api/book/{id}` có `currentPrice` ≥ 0. **Hiện tại:** web — thẻ đầu có giá âm (VD `-12.194.250 ₫`) · API — **mọi** sách tạo mới đều có `currentPrice` âm (nguyên nhân: `REQ-BK-BOOK-137`, F-35) · **Android:** `Sort By: Price: Low to High` → thẻ đầu giá `-12.194.250 ₫` — **chưa đạt** như web | 🟢 | 25-09-2026 · DEMO-AMB-2509 · + API · 26-09-2026 · + Android | Web: Kiểm chứng thực tế — ❌ lệch (`AMB-BK-BOOK-01`) · đọc giá 5 thẻ đầu (REQ-06) · API: Kiểm chứng thực tế — ❌ lệch · GET /api/book/{id} → 200 (K-73) · Android: Kiểm chứng thực tế — ❌ lệch · `android_book_sort_price_low_high.png` |
| REQ-BK-BOOK-52 | Tạo sách với tên danh mục chưa có sinh danh mục mới | Web · API | Chip ngôi sao trên web = danh mục mới (`AMB-BK-BOOK-06` ✅) | Tạo sách với **một** tên danh mục **chưa tồn tại** → thành công · danh mục đó xuất hiện trong danh sách danh mục với **1** sách. **Web:** chip tự gõ `Auto Cat <timestamp>` → `Book created successfully.` · hàng tab có thêm tab kèm số `1` · ô Categories liệt kê tên đó. **API:** `POST /api/book` với `categories: ["auto_bookapi_cat_<tag>_<T>"]` → `GET /api/category-book` có mục `name` đó với `bookCount` = `1`; xoá sách **không** xoá danh mục (`RISK-BK-BOOK-07`) | 🟢 | 25-09-2026 · DEMO-AMB-2509 · + API | Web: Quyết định PO — **chưa kiểm chứng thực tế** · API: Thực tế — spec không nói · POST /api/book → 200 · GET /api/category-book → 200 (K-42 · K-43) |

### 3.2. Dùng chung Android · Web

REQ sinh ở đợt Web (25-09-2026), **chuyển lên index** ngày 26-09-2026 khi kiểm khớp trên app Android; mã giữ nguyên, AC Web giữ nguyên văn và thêm vế **Android**. Ảnh Web ở lại `web/evidence/`, ảnh Android ở `mobile/evidence/`. REQ Web chưa kiểm được trên Android (khách · URL · tạo/sửa/xoá thành công — tạo sách trên Android thất bại, REQ-BK-BOOK-147) vẫn ở `web/` — lý do ở [mobile/requirements_book_mobile.md mục 2](mobile/requirements_book_mobile.md#2-bản-đồ-phủ-tài-liệu).

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-BOOK-02 | Thẻ sách hiển thị thông tin chính | Android · Web |  | **Web:** Mỗi thẻ có: ảnh bìa · avatar người đăng · ngày tạo (`dd ThMM yyyy`) · tên sách (link tới trang chi tiết) · lượt xem (biểu tượng mắt) · **giá bán** (`currentPrice`, định dạng `50.000 ₫`). Sách có khuyến mãi hiện thêm **giá gốc gạch ngang** phía trên giá bán **Android:** thẻ xếp 1 cột (dọc) · ảnh bìa (`img-book-<id>`) · avatar · ngày · tên (`content-desc` = tên, id `book-<id>`) · lượt xem · giá bán và giá gốc gạch ngang (đọc được thành một chuỗi `<giá bán> <giá gốc>`) · nút bút | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_list_logged_in_viewport.png` · Android: Kiểm chứng thực tế · android_book_list_logged_in.png |
| REQ-BK-BOOK-04 | Mặc định sắp theo lượt xem giảm dần | Android · Web |  | **Web:** Mở trang → nút hiển thị `Sort By: Feature` · request `sort=viewCount&sortBy=desc` · lượt xem giảm dần từ trái sang phải, trên xuống dưới **Android:** nút hiển thị `Sort By: Feature`. Không quan sát được request | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_list_logged_in_viewport.png` · API · GET /api/book (tham số) · Android: Kiểm chứng thực tế · android_book_list_logged_in.png |
| REQ-BK-BOOK-05 | Sort By: Newest sắp theo ngày tạo mới nhất | Android · Web |  | **Web:** Mở `Sort By` → menu có đúng 4 mục `Feature` · `Newest` · `Price: Low to High` · `Price: High to Low` → chọn `Newest` → request `sort=createdAt&sortBy=desc` **Android:** mở `Sort By` → 4 `MenuItem` `Feature` · `Newest` · `Price: Low to High` · `Price: High to Low` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_sort_menu_open_viewport.png` · API · GET /api/book (tham số) · Android: Kiểm chứng thực tế · android_book_sort_menu_open.png |
| REQ-BK-BOOK-06 | Price: Low to High sắp theo giá bán tăng dần | Android · Web |  | **Web:** Chọn `Price: Low to High` → request `sort=currentPrice&sortBy=asc` · giá bán tăng dần (giá âm đứng đầu — `AMB-BK-BOOK-01`) **Android:** chọn `Price: Low to High` → nút `Sort By: Price: Low to High` · giá bán không giảm khi cuộn · thẻ đầu giá âm | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · API · GET /api/book (tham số) · đọc giá 5 thẻ đầu · Android: Kiểm chứng thực tế · android_book_sort_price_low_high.png · đọc giá khi cuộn |
| REQ-BK-BOOK-09 | Cuộn tới cuối tải thêm sách | Android · Web | Không có thanh phân trang | **Web:** Trang đầu có 36 thẻ · cuộn tới cuối → hiện `Loading more book...` → tải `page=2&limit=36` → thêm 36 thẻ (72) **Android:** cuộn liên tục → đếm được **41** thẻ khác nhau (> 36) — trang 2 đã được tải. Chưa bắt được dòng `Loading more book...` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đếm `.MuiCard-root` + API · GET /api/book?…&page=2 · Android: Kiểm chứng thực tế · đếm id `book-<id>` khi cuộn |
| REQ-BK-BOOK-10 | Hàng tab danh mục kèm số sách | Android · Web |  | **Web:** Dưới thanh Filter/Sort có hàng tab cuộn ngang: `All` (mặc định chọn) rồi các danh mục, mỗi tab kèm **số sách** (VD `Test 11`). Chỉ liệt kê danh mục có sách (49 tab lúc khảo sát trong khi hệ thống có 197 danh mục — không assert con số) **Android:** tab `All` (`selected=true`) + tab danh mục kèm số, cuộn ngang · icon ⚙ (id `setting-category`) cuối hàng | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_list_logged_in_viewport.png` · đếm `role=tab` · Android: Kiểm chứng thực tế · android_book_list_logged_in.png |
| REQ-BK-BOOK-11 | Chọn tab danh mục lọc sách theo danh mục | Android · Web |  | **Web:** Bấm tab `Test 11` → tab được chọn · URL `?category=+Test` · chỉ còn **11** thẻ = số trên tab. Network: `search={"categories":{"some":{"name":{"in":[" Test"]}}}}` **Android:** bấm tab `Test 11` → tab `selected=true` · đếm được **11** thẻ | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_category_tab_selected_viewport.png` · đếm thẻ · Android: Kiểm chứng thực tế · android_book_category_tab_selected.png · đếm id thẻ |
| REQ-BK-BOOK-12 | Nút Filter mở khu lọc | Android · Web |  | **Web:** Bấm `Filter` → hiện ô `Search book...` và cặp ô `Price from` → `Price to`, dòng chữ `Price not specified` · URL thêm `isFilter=true` · bấm lại thì khu lọc đóng **Android:** `Filter` → ô `Search book...` · `Price from` → `Price to` · `Price not specified`; bấm lại → khu lọc đóng. Vế URL **không áp dụng** — app không có thanh địa chỉ | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_filter_search_uppercase_viewport.png` · đọc URL · Android: Kiểm chứng thực tế · android_book_filter_search_uppercase.png |
| REQ-BK-BOOK-13 | Tìm sách theo từ khoá | Android · Web |  | **Web:** Gõ `doraemon` vào `Search book...` → chỉ còn sách khớp (2 cuốn lúc khảo sát). Network: `search={"OR":[{"name":{"contains":…}},{"description":{"contains":…}},{"slug":{"contains":…}}]}` — tìm trong tên, mô tả và slug **Android:** `doraemon` → 2 sách | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · API · GET /api/book (tham số search) · Android: Kiểm chứng thực tế · đọc `content-desc` thẻ khi cuộn |
| REQ-BK-BOOK-14 | Tìm sách không phân biệt hoa thường | Android · Web |  | **Web:** Gõ `DORAEMON` → cùng kết quả như `doraemon` **Android:** `DORAEMON` → cùng 2 sách | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_filter_search_uppercase_viewport.png` · Android: Kiểm chứng thực tế · android_book_filter_search_uppercase.png |
| REQ-BK-BOOK-15 | Ô khoảng giá có gợi ý | Android · Web |  | **Web:** Bấm `Price from` (hoặc `Price to`) → gợi ý `10.000` · `100.000` · `1.000.000` · `10.000.000`; ô nhận số tự do (`type=number`) **Android:** bấm `Price from` → 4 gợi ý `10.000` · `100.000` · `1.000.000` · `10.000.000` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc `role=option` + `type` · Android: Kiểm chứng thực tế · đọc danh sách gợi ý |
| REQ-BK-BOOK-16 | Lọc giá từ một mức trở lên | Android · Web |  | **Web:** Chỉ chọn `Price from` = `10.000` → URL `from=10000` · request `search={"currentPrice":{"gte":10000}}` **Android:** chọn `Price from` = `10.000` → thẻ đầu giá `60.000 ₫` · dòng mô tả REQ-153 | 🟢 | 26-09-2026 · + Android | Web: API · GET /api/book (tham số) — chưa đối chiếu từng thẻ · Android: Kiểm chứng thực tế · đọc giá + dòng mô tả |
| REQ-BK-BOOK-17 | Lọc giá trong khoảng Từ – Đến | Android · Web | Kỳ vọng — hiện **chưa đạt** | **Web:** `Price from` 10.000 + `Price to` 100.000 → phải lọc `10.000 ≤ giá bán ≤ 100.000`. **Hiện tại:** request **chỉ** còn `{"currentPrice":{"lte":100000}}` — mất cận dưới, danh sách vẫn có sách giá `-8.382.500 ₫` **Hiện tại — Android:** như web — `Price from` 10.000 + `Price to` 100.000 → thẻ đầu vẫn giá `-1.000 ₫` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế — ❌ lệch (`AMB-BK-BOOK-02`) · `web_book_filter_price_range_lost_from_viewport.png` · Android: Kiểm chứng thực tế · android_book_filter_price_range_lost_from.png |
| REQ-BK-BOOK-18 | Dòng mô tả khoảng giá | Android · Web |  | **Web:** Chưa nhập giá → `Price not specified` · nhập cả 2 đầu → `Price between 10.000 ₫ and 100.000 ₫` **Android:** như web (`Price not specified` · `Price between 10.000 ₫ and 100.000 ₫`). Chỉ có `Price from` → REQ-153 | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_filter_search_uppercase_viewport.png` · `web_book_filter_price_range_lost_from_viewport.png` · Android: Kiểm chứng thực tế · android_book_filter_price_range_lost_from.png |
| REQ-BK-BOOK-21 | Đã đăng nhập có New book, bút sửa trên mọi thẻ và icon ⚙ | Android · Web | Hành vi hiện tại — **cùng bản chất F-02** (`AMB-BK-BOOK-15` 🔴) | **Web:** Đăng nhập tài khoản tự tạo → nút `New book` góc phải tiêu đề · **mọi** thẻ sách (kể cả sách người khác đăng) có nút bút · icon ⚙ cuối hàng tab **Android:** đã đăng nhập → `New book` · nút bút trên mọi thẻ (kể cả sách người khác) · icon ⚙ | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_list_logged_in_viewport.png` · chỉ **bấm** bút trên sách do phiên tạo · Android: Kiểm chứng thực tế · android_book_list_logged_in.png |
| REQ-BK-BOOK-22 | Form Create a new book có đủ thành phần | Android · Web |  | **Web:** `New book` → `/book-management/handle?name=Create-new-book&query=<bộ lọc hiện tại>` · tiêu đề `Create a new book` · breadcrumb `Book management / Create a new book` · khối *Detail* (`Book name *` · `Slug name book *` + ô `Change` · `Description` · `Picture *` vùng kéo-thả) · khối *Property* (`Regular price` hậu tố `VNĐ` · `Categories *`) · khối *Promotion* (`Select promotion`, thu gọn) · công tắc `Available book` · nút `Reset` · `Create book` **Android:** `New book` → tiêu đề `Create a new book` · breadcrumb `Book management / Create a new book` · cùng các khối và ô · ô slug có ô tick `Change` · `Reset` · `Create book` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_create_default_fullpage.png` · Android: Kiểm chứng thực tế · android_book_create_default_part1.png · _part2 · _part3 |
| REQ-BK-BOOK-23 | Create book khoá khi form chưa có thay đổi | Android · Web |  | **Web:** Mở form, chưa nhập gì → `Create book` `disabled` · gõ Book name → `Create book` bật **Android:** chưa nhập → `Create book` `enabled=false` · gõ Book name → `enabled=true` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc thuộc tính `disabled` · Android: Kiểm chứng thực tế · đọc `enabled` |
| REQ-BK-BOOK-24 | Slug tự sinh từ tên sách | Android · Web |  | **Web:** Book name `Auto Web Book <timestamp> Tiếng Việt` → Slug `auto-web-book-<timestamp>-tieng-viet` — chữ thường, **bỏ dấu tiếng Việt**, khoảng trắng thành `-` **Android:** `Auto Mobile Book <timestamp> Tiếng Việt` → Slug `auto-mobile-book-<timestamp>-tieng-viet` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_create_filled_fullpage.png` · đọc `value` · Android: Kiểm chứng thực tế · đọc `text` ô Slug |
| REQ-BK-BOOK-25 | Ô slug khoá mặc định | Android · Web |  | **Web:** Ô `Slug name book` có `disabled=true`, ô `Change` chưa tick **Android:** ô Slug `enabled=false` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc `disabled` · chưa thử tick `Change` · Android: Kiểm chứng thực tế · đọc `enabled` |
| REQ-BK-BOOK-26 | Thiếu ảnh bị chặn | Android · Web |  | **Web:** Không chọn ảnh → `Create book` → vùng Picture viền đỏ + `You must upload at least 1 file` · không gửi request **Android:** `You must upload at least 1 file` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_create_missing_required_fullpage.png` · Android: Kiểm chứng thực tế · android_book_create_missing_required_part2.png |
| REQ-BK-BOOK-27 | Thiếu giá bị chặn | Android · Web | Nhãn `Regular price` **không** có dấu `*` | **Web:** Giá trống (hoặc nhập chữ — ô số trả về rỗng) → `Price is required.` **Android:** `Price is required.` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_create_missing_required_fullpage.png` · Android: Kiểm chứng thực tế · android_book_create_missing_required_part2.png |
| REQ-BK-BOOK-28 | Thiếu danh mục bị chặn | Android · Web |  | **Web:** Không chọn danh mục → `Please select at least one category` **Android:** `Please select at least one category` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_create_missing_required_fullpage.png` · Android: Kiểm chứng thực tế · android_book_create_missing_required_part2.png |
| REQ-BK-BOOK-29 | Giá tối thiểu 1.000 | Android · Web | Câu chữ lệch biên (`AMB-BK-BOOK-04`) | **Web:** `-1000` · `0` · `999` → `Price must be greater than 1000 VNĐ.` · `1000` → hợp lệ (dưới ô hiện `1.000 VNĐ`) **Android:** `-1000` · `0` · `999` → `Price must be greater than 1000 VNĐ.` · `1000` → `1.000 VNĐ`. Ô số **không** nhận `setValue` — nhập bằng bàn phím | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc lỗi bằng DOM (6 giá trị) · Android: Kiểm chứng thực tế · đọc `text` + lỗi (8 giá trị) |
| REQ-BK-BOOK-30 | Giá tối đa 100.000.000.000 | Android · Web | Câu chữ lệch biên (`AMB-BK-BOOK-05`) | **Web:** `100000000000` → hợp lệ · `100000000001` → `Price must be less than 1 billion VNĐ.` (biên đo bằng chia đôi khoảng) **Android:** `100000000000` → `100.000.000.000 VNĐ` · `100000000001` → `Price must be less than 1 billion VNĐ.` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc lỗi bằng DOM · Android: Kiểm chứng thực tế · đọc lỗi |
| REQ-BK-BOOK-31 | Giá hợp lệ hiển thị định dạng dưới ô | Android · Web |  | **Web:** Nhập `50000` → dưới ô hiện `50.000 VNĐ` · nhập `1500.5` → `1.500,5 VNĐ` (số lẻ được chấp nhận) **Android:** `50000` → `50.000 VNĐ` · `1500.5` → `1.500,5 VNĐ` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_create_filled_fullpage.png` · đọc DOM · Android: Kiểm chứng thực tế · đọc lỗi |
| REQ-BK-BOOK-32 | Categories liệt kê mọi danh mục kèm số sách | Android · Web |  | **Web:** Bấm ô `Categories` → danh sách toàn bộ danh mục (197 lúc khảo sát), mỗi mục có huy hiệu số sách · gõ `Technology` → chỉ còn `5 Technology` · chọn → chip `Technology` **Android:** bấm ô Categories → danh sách danh mục kèm số · gõ `Technology` → chỉ còn `5 Technology` · chọn → chip `5 Technology` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_create_categories_open_viewport.png` · Android: Kiểm chứng thực tế · android_book_create_filled_part1.png |
| REQ-BK-BOOK-33 | Categories cho thêm tên tự gõ | Android · Web | Cùng bản chất F-05 (`AMB-BK-BOOK-06`) | **Web:** Gõ tên chưa có (không còn gợi ý) → `Enter` → thêm chip mới mang biểu tượng ngôi sao (khác chip danh mục có sẵn) **Android:** gõ tên chưa có → `Enter` → chip mang biểu tượng ngôi sao | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_create_freetext_category_chip_viewport.png` · **chưa** gửi tạo sách với chip này · Android: Kiểm chứng thực tế · android_book_create_freetext_category_chip.png |
| REQ-BK-BOOK-34 | Tên danh mục tự gõ tối đa 24 ký tự | Android · Web | Biên chốt: ≤ 24 hợp lệ, ≥ 25 bị chặn (`AMB-BK-BOOK-06` ✅) | **Web:** Chip tự gõ **24** ký tự → **không** có lỗi · **25** ký tự → dưới ô `Each category name must be less than 25 characters` · 28 ký tự → cùng câu (đã quan sát) **Android:** chip tự gõ **24** ký tự → `Create book` → **không** lỗi · thêm chip **25** ký tự → `Each category name must be less than 25 characters` — **biên 24/25 đã kiểm chứng trên Android** | 🟡 | 25-09-2026 · DEMO-AMB-2509 · 26-09-2026 · + Android | Web: Kiểm chứng thực tế (28 ký tự) · `web_book_create_freetext_category_chip_viewport.png` · biên 24/25: quyết định PO — **chưa kiểm chứng** · Android: Kiểm chứng thực tế · android_book_create_freetext_category_chip.png · đọc lỗi |
| REQ-BK-BOOK-38 | Available book mặc định bật | Android · Web |  | **Web:** Mở form → công tắc `Available book` bật · tạo sách → body `status: "AVAILABLE"` **Android:** công tắc `Available book` **hiển thị bật**; `checked` của `Switch` luôn `false` (RISK-BK-BOOK-09) | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_create_default_fullpage.png` · API · POST /api/book (body) · Android: Kiểm chứng thực tế · android_book_create_default_part3.png — chỉ quan sát ảnh |
| REQ-BK-BOOK-41 | Trang chi tiết sách | Android · Web |  | **Web:** Bấm tên/ảnh trên thẻ → `/book-management/detail/<slug>` · nút `Back` · ảnh bìa với bộ đếm `1/1` và nút trước/sau · nhãn `NEW` (sách mới) · tên danh mục (link) · tên sách · giá bán · khối `Author by` có tên **và email** người đăng (`AMB-BK-BOOK-13`) **Android:** bấm tên thẻ → trang chi tiết: nút `Back` · ảnh với `1/1` và 2 nút trước/sau `enabled=false` · `NEW` · danh mục · tên · giá · khối `Author by`. Sách khảo sát có tác giả đã bị xoá nên `Author by` trống (REQ-135) — vế **email tác giả chưa kiểm** trên Android | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_detail_own_viewport.png` · Android: Kiểm chứng thực tế · android_book_detail.png |
| REQ-BK-BOOK-44 | Form Modify book điền sẵn dữ liệu | Android · Web |  | **Web:** Bấm bút trên thẻ → `/book-management/handle?name=Modify-book&id=<id>&query=…` · tiêu đề `Modify book` · Book name · Slug · giá · danh mục · ảnh · `Available book` **điền sẵn** · `Save changes` và `Reset` `disabled` cho tới khi sửa · có thêm nút `Delete` cuối trang **Android:** nút bút → `Modify book` · Book name · Slug · giá · danh mục · ảnh điền sẵn · `Save changes` và `Reset` `enabled=false` · nút `Delete` cuối trang. Breadcrumb sai — REQ-154 | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_book_modify_default_fullpage.png` · đọc `value` + `disabled` · Android: Kiểm chứng thực tế · android_book_modify_default_part1.png · android_book_modify_default_part2.png |
| REQ-BK-BOOK-45 | Sửa tên sinh lại slug | Android · Web | Hành vi quan sát (`AMB-BK-BOOK-07`) | **Web:** Sửa Book name → Slug đổi theo tên mới (`…-edited`) · `Save changes` bật **Android:** sửa Book name thêm ` edited` → Slug `…-edited`. Rời form **không** lưu (`Reset` → tên và slug về cũ) | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc `value` ô Slug · Android: Kiểm chứng thực tế · đọc `text` ô Slug |
| REQ-BK-BOOK-48 | Xoá cần xác nhận, hiển thị đúng tên sách | Android · Web | Kỳ vọng — hiện **chưa đạt** | **Web:** Modify book → `Delete` → hộp `Confirm delete` nội dung `Do you want delete <tên>, after delete you can't undo` · nút `Cancel` · `Delete`. `<tên>` phải là tên **hiện tại**. **Hiện tại:** hiển thị tên **lúc tạo** dù đã đổi tên **Hiện tại — Android:** hộp `Confirm delete` hiển thị tên của **một form khác** mở trước đó trong phiên (tên sách đang tạo dở `Auto Mobile Book <timestamp> Tiếng Việt`) thay vì sách đang sửa — `AMB-BK-BOOK-35` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế — ❌ lệch (`AMB-BK-BOOK-08`) · `web_book_delete_confirm_stale_name_viewport.png` · Android: Kiểm chứng thực tế · android_book_delete_confirm.png |
| REQ-BK-BOOK-49 | Cancel không xoá | Android · Web |  | **Web:** Hộp `Confirm delete` → `Cancel` → hộp đóng · vẫn ở Modify book · **không** có request `DELETE` **Android:** `Cancel` → hộp đóng · vẫn ở `Modify book` · sách còn trong danh sách | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc DOM + network · Android: Kiểm chứng thực tế · đọc cây phần tử sau Cancel |

**Mục 3.2: 34 REQ** — mọi dòng `Nền tảng` = `Android · Web`.

---

## 6. Ma trận Phân quyền

| Hành động (Web) | Khách | Đã đăng nhập (tài khoản tự tạo) | Vai trò khác (nếu có) |
|---|---|---|---|
| Xem danh sách · lọc · sắp xếp | ✅ (REQ-01) | ✅ | — |
| Tạo sách | ❌ — không có nút; mở URL bị chuyển Sign in (REQ-20 · AUTH-96) | ✅ (REQ-39) | — |
| Sửa sách **của mình** | ❌ — không có bút (REQ-20) | ✅ (REQ-46) | — |
| Sửa sách **người khác** | ❌ — không có bút (REQ-20) | ⚠️✅ — bút hiện trên mọi thẻ (REQ-21), chưa lưu thử | — |
| Xoá sách **của mình** | ❌ — không vào được Modify | ✅ (REQ-50) | — |
| Quản lý danh mục (⚙) | ❌ — không có icon (REQ-20) | ⚠️✅ — icon hiện, chưa bấm (module `CAT`) | — |

```
Tổng 18 ô = Đã kiểm chứng 10 · Suy diễn 2 · Chưa rõ 0 · Không áp dụng 6
Ô suy diễn: [Sửa sách người khác · Quản lý danh mục] × Đã đăng nhập — suy từ nút hiện trên giao diện
(và F-02 của mặt API), chưa bấm/lưu vì không thao tác trên dữ liệu người khác.
Ô "không áp dụng" là cột "Vai trò khác" × 6 hành động — hệ thống không có vai trò nào khác (AMB-BK-BOOK-15 · AMB-BK-01 ✅ 25-09-2026).
Chưa thử: khách mở trang chi tiết sách (ngoài ma trận).
```


### Ma trận phân quyền — mặt Android

| Hành động (Android) | Khách | Đã đăng nhập (tài khoản test) | Vai trò khác |
|---|---|---|---|
| Xem · lọc · sắp xếp · xem chi tiết | ❔ (bản đồ khám phá 19-09-2026 thấy được) | ✅ (REQ-02 → 18 · 41) | — |
| Thấy `New book` · bút trên **mọi** thẻ · ⚙ | ❔ | ✅ (REQ-21) | — |
| Mở `Modify book` sách **người khác** | ❔ | ✅ mở được, **không** lưu (REQ-44) | — |
| Tạo sách | ❔ | ❌ thất bại — lỗi, không phải phân quyền (REQ-147) | — |

```
Tổng 12 ô = Đã kiểm chứng 4 · Suy diễn 0 · Chưa rõ 4 · Không áp dụng 4
Ô "chưa rõ": cột Khách — lượt 26-09-2026 chỉ có phiên đã đăng nhập.
Ô "không áp dụng": cột "Vai trò khác" × 4 (AMB-BK-01 ✅).
```

### Ma trận phân quyền — mặt API

| Operation (API) | Không token | Token hợp lệ (tài khoản tự tạo) | Vai trò khác (nếu có) |
|---|---|---|---|
| `GET /api/book` · `GET /api/book/{id}` | ✅ 200 (REQ-01 · 79) | ✅ 200 | — |
| `POST /api/book` | ❌ 401 (REQ-89 · 90) | ✅ (REQ-83) | — |
| `PATCH /api/book/{id}` — sách **của mình** | ❌ 401 (REQ-126) | ✅ (REQ-114) | — |
| `PATCH /api/book/{id}` — sách **người khác** | ❌ 401 (REQ-126) | ✅ — chủ sách **không** đổi (REQ-128) | — |
| `DELETE /api/book/{id}` — sách **của mình** | ❌ 401 (REQ-132) | ✅ 200 (REQ-131) | — |
| `DELETE /api/book/{id}` — sách **người khác** | ❌ 401 (REQ-132) | ✅ 200 (REQ-134) | — |

```
Tổng 18 ô = Đã kiểm chứng 12 · Suy diễn 0 · Chưa rõ 0 · Không áp dụng 6
Ô "không áp dụng" là cột "Vai trò khác" × 6 hành động — hệ thống không có vai trò (AMB-BK-01 ✅).
Mọi ô ghi/xoá chỉ thử trên sách và tài khoản do chính lượt chạy tạo.
```

---

## 7. Ma trận Trạng thái

Entity sách có `status` (`AVAILABLE` / `UNAVAILABLE`) — điều khiển bằng công tắc `Available book`.

| Trạng thái hiện tại | Hành động cho phép | Trạng thái kế tiếp | Ai được thực hiện | Hệ quả quan sát |
|---|---|---|---|---|
| — (chưa có) | Create book, `Available book` bật (mặc định) | AVAILABLE | Người dùng đã đăng nhập | Hiện trên danh sách (REQ-40) |
| — (chưa có) | Create book, `Available book` tắt | UNAVAILABLE | Người dùng đã đăng nhập | ❔ Chưa thử |
| AVAILABLE | Modify → tắt `Available book` → Save changes | UNAVAILABLE | Người dùng đã đăng nhập (kể cả không phải người đăng — ⚠️ F-02) | **Vẫn** hiện trên danh sách, không có dấu hiệu (`AMB-BK-BOOK-09`) |
| UNAVAILABLE | Modify → bật `Available book` | AVAILABLE | Như trên | ❔ Chưa thử |
| AVAILABLE · UNAVAILABLE | Modify → Delete → xác nhận | (đã xoá) | Như trên | Biến mất; URL chi tiết → `Book not found.` (REQ-43 · 50) |


### Bổ sung mặt API

| Trạng thái hiện tại | Hành động (API) | Trạng thái kế tiếp | Hệ quả quan sát |
|---|---|---|---|
| — (chưa có) | `POST /api/book` không `status` | AVAILABLE | Tạo được dù spec khai `status` required (REQ-95 ❌ F-40) |
| AVAILABLE | `PATCH` `status: "UNAVAILABLE"` | UNAVAILABLE | Lưu đúng (REQ-119) · **vẫn** có trong danh sách công khai (`AMB-BK-BOOK-09` ✅) — lọc `status` thì tách được (REQ-70) |
| AVAILABLE · UNAVAILABLE | `DELETE` | (đã xoá) | `404` khi đọc lại (REQ-131) · danh mục của sách **còn** (REQ-52) |
| bất kỳ | Xoá **chủ sách** | (giữ nguyên) | Sách còn với `auth` = `null` (REQ-135 · F-06) |

---

## 10. Phân rã Epic / Story

| Story ID | Tên Story | REQ bao phủ | Số REQ | AMB / RISK liên quan | Ghi chú phạm vi |
|---|---|---|---|---|---|
| STORY-BK-BOOK-01 | Danh sách & sắp xếp | REQ-BK-BOOK-01 → 09 · 51 · 149 · 151 · 152 | 13 | AMB-BK-BOOK-01 · 03 · 09 · 36 · RISK-BK-BOOK-01 · 02 | Thẻ sách · nhãn New · Sort By · cuộn tải thêm · Android: mất mạng, xoay |
| STORY-BK-BOOK-02 | Danh mục & bộ lọc | REQ-BK-BOOK-10 → 19 · 153 | 11 | AMB-BK-BOOK-02 · 14 | Tab danh mục · Search · khoảng giá · URL |
| STORY-BK-BOOK-03 | Quyền thao tác theo trạng thái đăng nhập | REQ-BK-BOOK-20 → 21 | 2 | AMB-BK-BOOK-15 | New book · bút sửa · ⚙ |
| STORY-BK-BOOK-04 | Tạo sách | REQ-BK-BOOK-22 → 40 · 52 · 147 · 150 | 22 | AMB-BK-BOOK-04 · 05 · 06 · 12 · 34 · RISK-BK-BOOK-03 · 09 | Form, slug, giá, danh mục, ảnh, khuyến mãi, trạng thái · Android: tạo lỗi, Photo Picker |
| STORY-BK-BOOK-05 | Trang chi tiết | REQ-BK-BOOK-41 → 43 | 3 | AMB-BK-BOOK-13 · 17 | Chi tiết · lượt xem · sách không tồn tại |
| STORY-BK-BOOK-06 | Sửa sách | REQ-BK-BOOK-44 → 47 · 148 · 154 | 6 | AMB-BK-BOOK-07 · 10 · 37 | Modify book · slug sinh lại · trạng thái · Android: điều hướng, breadcrumb |
| STORY-BK-BOOK-07 | Xoá sách | REQ-BK-BOOK-48 → 50 | 3 | AMB-BK-BOOK-08 · 11 · 16 | Confirm delete |
| STORY-BK-BOOK-08 | Danh sách · tìm kiếm · sắp xếp · phân trang — API | REQ-BK-BOOK-53 → 76 · 144 → 146 | 27 | AMB-BK-BOOK-32 · 33 | `GET /api/book` — mặt API |
| STORY-BK-BOOK-09 | Chi tiết sách — API | REQ-BK-BOOK-77 → 82 | 6 | AMB-BK-BOOK-25 · 31 | `GET /api/book/{id}` |
| STORY-BK-BOOK-10 | Tạo sách — API | REQ-BK-BOOK-83 → 113 · 137 · 139 · 140 · 142 · 143 | 36 | AMB-BK-BOOK-18 · 20 · 22 · 23 · 24 · 26 · 27 · 28 · 29 · 30 · RISK-BK-BOOK-06 · 07 · 08 | `POST /api/book` |
| STORY-BK-BOOK-11 | Sửa sách — API | REQ-BK-BOOK-114 → 130 · 138 · 141 | 19 | AMB-BK-BOOK-19 · 21 · 23 · 28 | `PATCH /api/book/{id}` |
| STORY-BK-BOOK-12 | Xoá sách — API | REQ-BK-BOOK-131 → 135 | 5 | — | `DELETE /api/book/{id}` |
| STORY-BK-BOOK-13 | Quy ước chung của module — API | REQ-BK-BOOK-136 | 1 | — | Error envelope 422 |

**Tổng: 13 Story / 154 REQ** — Web · Android `13 + 11 + 2 + 22 + 3 + 6 + 3 = 60` · API `27 + 6 + 36 + 19 + 5 + 1 = 94` → `60 + 94 = 154 ✔` · mọi REQ thuộc đúng một Story, không mồ côi, không trùng.

### Đối chiếu AMB / RISK

| Nhóm | Mã | Nằm ở đâu |
|---|---|---|
| AMB thuộc Story | AMB-BK-BOOK-01 → 34 · 36 · 37 | phân bổ ở bảng Story |
| AMB cấp Epic | AMB-BK-BOOK-35 | Hộp Confirm delete trên Android hiện tên của form khác — cắt ngang Story 06 · 07 (form Create/Modify dùng chung trạng thái) |
| RISK thuộc Story | RISK-BK-BOOK-01 → 03 · 06 · 07 · 08 · 09 | phân bổ ở bảng Story |
| RISK cấp Epic | RISK-BK-BOOK-04 · 05 · 10 | `04` ảnh hỏng / lỗi console — ảnh hưởng mọi TC web · `05` email chủ sách công khai — ảnh hưởng mọi TC đọc danh sách / chi tiết |

### Hạng mục cấp Epic (cố ý không gán vào Story nào)

| Hạng mục | Lý do |
|---|---|
| Ma trận phân quyền (6) · Ma trận trạng thái (7) | Cắt ngang Story 03 · 04 · 06 · 07 |
| `RISK-BK-BOOK-04` | Cắt ngang mọi màn hình có ảnh bìa |
| Tham chiếu `AMB-BK-01` · `AMB-BK-02` · `AMB-BK-03` | AMB **cấp hệ thống** — module chỉ tham chiếu |

### Thứ tự triển khai đề xuất

1. **STORY-BK-BOOK-04 Tạo sách** — sinh dữ liệu test riêng cho mọi Story còn lại (không đụng sách của người khác)
2. **STORY-BK-BOOK-07 Xoá sách** — dùng để dọn cuối mỗi TC; `REQ-48` kỳ vọng FAIL (`AMB-BK-BOOK-08` ✅ lỗi — `@KnownBug`)
3. **STORY-BK-BOOK-01 Danh sách** · **STORY-BK-BOOK-05 Chi tiết** · **STORY-BK-BOOK-06 Sửa**
4. **STORY-BK-BOOK-02 Danh mục & lọc** — `REQ-17` kỳ vọng FAIL (`AMB-BK-BOOK-02` ✅ lỗi — `@KnownBug`) · `REQ-51` (Story 01) kỳ vọng FAIL (`AMB-BK-BOOK-01` ✅ lỗi)
5. **Mặt API (Story 08 → 13):** `10 Tạo` trước để có sách riêng cho `09` · `11` · `12`; `08` (đọc) chạy song song; REQ ghi `❌ lệch` chạy như `@KnownBug`; dọn **cả danh mục** do việc tạo sách sinh ra (REQ-52)
6. **STORY-BK-BOOK-03 Quyền** — `AMB-BK-BOOK-15` ✅ chốt: không có vai trò, hành vi hiện tại là thiết kế — TC viết theo hiện trạng


**Android:** cùng thứ tự Story. `REQ-147` (tạo sách) kỳ vọng FAIL — **chặn** việc kiểm trên Android các REQ `39` · `40` · `46` · `47` · `50` · `52` (cần sách do phiên tạo); `148` · `154` · `48` kỳ vọng FAIL — TC `@KnownBug`.
---

## 11. Điểm Mơ Hồ & Rủi Ro

### 11.1. Ambiguities

| Mã | Câu hỏi | Nguy cơ | Mức độ | Assumption tạm | Trạng thái | Kết luận |
|---|---|---|---|---|---|---|
| AMB-BK-BOOK-01 | Giá bán (`currentPrice`) **âm** hiển thị công khai và đứng đầu khi sắp giá tăng dần (`-12.194.250 ₫`) — do khuyến mãi lớn hơn giá gốc. Hệ thống có phải chặn giá bán < 0 (hoặc < 1.000 như giá gốc)? *(Cùng gốc `AMB-BK-03` · F-04.)* | Người mua thấy giá âm; sắp xếp/lọc theo giá vô nghĩa | 🟠 | Là **lỗi** — giá bán phải ≥ 0; không cấp REQ cho tới khi PO chốt ngưỡng | ✅ Đã chốt 25-09-2026 | **Lỗi cần báo** — giá bán phải **≥ 0 ₫** (khuyến mãi lớn hơn giá gốc thì giá bán = 0). **Sinh `REQ-BK-BOOK-51`** (kỳ vọng, hiện chưa đạt). Cùng kết luận `AMB-BK-03` (DEMO-AMB-2509) |
| AMB-BK-BOOK-02 | Chọn cả `Price from` và `Price to` thì request chỉ gửi `lte` — **mất cận dưới** (REQ-17), dòng chữ vẫn báo `Price between …` | Kết quả lọc sai mà người dùng tin là đúng | 🟠 | Là **lỗi** — REQ-17 ghi kỳ vọng lọc đủ 2 đầu | ✅ Đã chốt 25-09-2026 | **Lỗi cần báo** — trùng Assumption. REQ-17 giữ kỳ vọng, TC gắn `@KnownBug` (DEMO-AMB-2509) |
| AMB-BK-BOOK-03 | Nhãn `New` dựa trên tiêu chí nào (bao nhiêu ngày kể từ tạo)? | Không viết được TC biên cho nhãn New | 🟡 | Sách tạo trong ngày có New — REQ-03 chỉ assert trường hợp này | ✅ Đã chốt 25-09-2026 | Nhãn `New` hiện với sách tạo **trong vòng 7 ngày**. **Sửa `REQ-BK-BOOK-03`** 🟡: thêm vế sách tạo quá 7 ngày không có `New` (DEMO-AMB-2509) |
| AMB-BK-BOOK-04 | Câu lỗi `Price must be greater than 1000 VNĐ.` nhưng **1.000 hợp lệ** (REQ-29) — biên đúng là ≥ 1.000 hay > 1.000? | Câu lỗi lệch biên thật; TC biên chấm sai | 🟡 | Biên đúng là **≥ 1.000** như đang chạy | ✅ Đã chốt 25-09-2026 | Biên đúng **≥ 1.000** — câu `greater than 1000` là lỗi câu chữ, chấp nhận giữ nguyên ở bản 1.0. REQ-29 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-BOOK-05 | Câu lỗi `Price must be less than 1 billion VNĐ.` nhưng giới hạn thật là **100.000.000.000** (100 tỷ — REQ-30); spec API khai `maximum 9.000.000.000.000`. Giới hạn đúng là bao nhiêu? | Web, câu lỗi và API — ba con số khác nhau cho cùng một trường | 🟡 | Theo web đang chạy (100 tỷ); câu lỗi sai | ✅ Đã chốt 25-09-2026 | Giới hạn đúng là **100.000.000.000** (web đang chạy). Câu `less than 1 billion` là lỗi câu chữ, chấp nhận giữ nguyên ở bản 1.0; `maximum` của spec API là lỗi spec. REQ-30 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-BOOK-06 | Ô Categories cho **gõ tên danh mục mới** (chip ngôi sao — REQ-33). Tạo sách với chip này sẽ tạo danh mục mới hay chỉ gắn chuỗi (F-05: API nhận danh mục không tồn tại)? Biên độ dài đúng là < 25 hay ≤ 25 (REQ-34)? | Sinh danh mục rác / sách gắn danh mục không tồn tại | 🟠 | Chưa gửi thử — không cấp REQ cho kết quả tạo; REQ-34 chỉ assert 28 ký tự bị chặn | ✅ Đã chốt 25-09-2026 | Chip tự gõ **tạo danh mục mới** khi tạo sách (thiết kế). Biên tên: **≤ 24** ký tự hợp lệ, **≥ 25** bị chặn. **Sửa `REQ-BK-BOOK-34`** 🟡 · **sinh `REQ-BK-BOOK-52`** (DEMO-AMB-2509) |
| AMB-BK-BOOK-07 | Sửa tên sách **sinh lại slug** (REQ-45) → URL chi tiết cũ thành `Book not found.`. Cố ý? | Link đã chia sẻ bị hỏng sau mỗi lần sửa tên | 🟡 | Cố ý — REQ-45 theo quan sát | ✅ Đã chốt 25-09-2026 | **Cố ý** — slug luôn theo tên. REQ-45 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-BOOK-08 | Hộp xác nhận xoá hiển thị **tên lúc tạo**, không phải tên hiện tại (REQ-48) | Người dùng xoá nhầm vì tên không khớp | 🟡 | Là **lỗi** — REQ-48 ghi kỳ vọng tên hiện tại | ✅ Đã chốt 25-09-2026 | **Lỗi cần báo** — trùng Assumption. REQ-48 giữ kỳ vọng, TC gắn `@KnownBug` (DEMO-AMB-2509) |
| AMB-BK-BOOK-09 | Sách `UNAVAILABLE` vẫn hiện trên danh sách công khai, **không** có dấu hiệu gì (`web_book_unavailable_card_no_mark_element.png`). Trạng thái này có tác dụng gì với người xem? | Tính năng "ngừng bán" không có tác dụng quan sát được | 🟡 | Không cấp REQ về tác dụng hiển thị — chỉ REQ-47 (lưu được) | ✅ Đã chốt 25-09-2026 | `UNAVAILABLE` chỉ là **trạng thái quản lý nội bộ**, không yêu cầu hiển thị khác trên danh sách công khai — chấp nhận hiện trạng, không cấp REQ (DEMO-AMB-2509) |
| AMB-BK-BOOK-10 | Trang Modify book: breadcrumb ghi `Create a new book`; vùng Delete có đoạn chữ *"This book, previously part of your business inventory, is no longer in active commerce…"* không khớp ngữ cảnh | Người dùng nhầm đang tạo sách mới | 🟢 | Lỗi nội dung — không cấp REQ | ✅ Đã chốt 25-09-2026 | **Lỗi nội dung**, chấp nhận ở bản 1.0 — không cấp REQ; TC không assert breadcrumb / đoạn chữ vùng Delete của Modify book (DEMO-AMB-2509) |
| AMB-BK-BOOK-11 | Thông báo `Deleted successfully.` dùng biểu tượng **lỗi** (đỏ, dấu !) | Người dùng tưởng xoá thất bại | 🟢 | Lỗi hiển thị — REQ-50 chỉ assert nội dung câu | ✅ Đã chốt 25-09-2026 | **Lỗi hiển thị**, chấp nhận ở bản 1.0 — REQ-50 chỉ assert nội dung câu (DEMO-AMB-2509) |
| AMB-BK-BOOK-12 | Chọn tệp không phải ảnh bị bỏ qua **không có thông báo** (REQ-35) | Người dùng không biết vì sao ảnh không lên | 🟡 | Giữ hành vi hiện tại | ✅ Đã chốt 25-09-2026 | **Chấp nhận** — trùng Assumption. REQ-35 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-BOOK-13 | Trang chi tiết hiển thị **email** người đăng cho mọi người xem (REQ-41). *(Cùng gốc `AMB-BK-02`.)* | Lộ dữ liệu cá nhân | 🟡 | Giữ hiện trạng — TC chỉ chụp sách tự tạo | ✅ Đã chốt 25-09-2026 | **Cố ý** — hệ thống thực hành công khai (cùng kết luận `AMB-BK-02`). TC chỉ mở chi tiết sách tự tạo (DEMO-AMB-2509) |
| AMB-BK-BOOK-14 | Hàng tab có danh mục **trùng tên hiển thị** (`Phương Nam 1` và `Phương Nam 55`, `Test 11` và `Test 16`) do tên có khoảng trắng đầu (`" Phương Nam"`, `" Test"`). Tên danh mục có được cắt khoảng trắng? | Người dùng không phân biệt được tab; lọc nhầm danh mục | 🟡 | Là lỗi dữ liệu danh mục (module `CAT`) — REQ-11 dùng đúng tên có khoảng trắng | ✅ Đã chốt 25-09-2026 | **Lỗi dữ liệu** thuộc module `CAT` (tên danh mục phải cắt khoảng trắng) — REQ-11 giữ nguyên, xử lý khi sinh REQ `CAT` (DEMO-AMB-2509) |
| AMB-BK-BOOK-15 | Người dùng tự đăng ký có được **sửa/xoá sách của người khác** (bút hiện trên mọi thẻ — REQ-21)? Có vai trò nào khác? Xin tài khoản vai trò khác (nếu có) để kiểm 6 ô `❔`. *(Cùng gốc `AMB-BK-01` · F-02.)* | Ai cũng sửa/xoá được mọi sách | 🔴 | Hành vi hiện tại là thiết kế hệ thống thực hành — TC theo hiện trạng, gắn `assumption-based` | ✅ Đã chốt 25-09-2026 | Hệ thống **không có** mô hình vai trò (theo `AMB-BK-01`) — sửa/xoá sách người khác là **thiết kế**. REQ-21 giữ nguyên; cột *Vai trò khác* → **Không áp dụng** (DEMO-AMB-2509) |
| AMB-BK-BOOK-16 | Xoá sách có xoá ảnh bìa đã tải lên (`$book-image/<slug>/…`) không? | Kho tệp đầy rác (giới hạn 1 GB — module `FILE`) | 🟡 | Không xoá — cần xác minh ở module `FILE` | ✅ Đã chốt 25-09-2026 | **Không** xoá ảnh bìa — chấp nhận; dọn định kỳ ở module `FILE`. Giữ `RISK-BK-BOOK-03` (DEMO-AMB-2509) |
| AMB-BK-BOOK-17 | Tiêu đề tab của trang chi tiết giữ `API RESTful miễn phí dành cho Tester kiểm thử` thay vì tên sách | TC assert tiêu đề sẽ đỏ | 🟢 | Không cấp REQ về tiêu đề (cùng `AMB-BK-AUTH-32`) | ✅ Đã chốt 25-09-2026 | Trùng Assumption — không cấp REQ về tiêu đề tab (DEMO-AMB-2509) |
| AMB-BK-BOOK-18 | `currentPrice` của sách **không gắn khuyến mãi** khác `price`: bằng `price × (1 − ΣPERCENTAGE/100) − ΣFIXED_AMOUNT` của **mọi** khuyến mãi đang hiệu lực toàn hệ thống (khớp chính xác 4 mức giá) → âm cho mọi sách mới. Đây là nguyên nhân gốc của giá âm ở REQ-51 (F-35) | Mọi sách mới có giá bán âm công khai | 🔴 | Lỗi — chỉ khuyến mãi gắn với sách mới được áp | ✅ Đã chốt 25-09-2026 | **Lỗi** — giá bán chỉ áp khuyến mãi **gắn với sách**, sách không gắn có `currentPrice` = `price`, không bao giờ âm. **Sinh `REQ-BK-BOOK-137`** (kỳ vọng, chưa đạt) · `REQ-51` mở rộng `Web · API`. TC **không** assert số tiền cụ thể (DEMO-AMB-2509B) |
| AMB-BK-BOOK-19 | `PATCH price` **không** tính lại `currentPrice` (F-36) | Giá hiển thị sai sau khi sửa giá | 🟠 | Lỗi | ✅ Đã chốt 25-09-2026 | **Lỗi**. **Sinh `REQ-BK-BOOK-138`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-20 | Ngưỡng `price` thực tế: từ 27.000.000 trở lên → 400 `Invalid data.` (giá bán tràn số 32 bit, đổi theo khuyến mãi hiện hành); spec khai 9 × 10¹², web cho 100 tỷ, câu lỗi web nói 1 tỷ (F-42) | Không tạo được sách giá hợp lệ theo web | 🟠 | Giới hạn đúng là 100 tỷ | ✅ Đã chốt 25-09-2026 | Giới hạn đúng **100.000.000.000** (theo `AMB-BK-BOOK-05`). **Sinh `REQ-BK-BOOK-139`** (kỳ vọng, chưa đạt) · `REQ-BK-BOOK-103` (> 100 tỷ bị từ chối) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-21 | `PATCH categories` **cộng thêm** vào danh sách cũ thay vì thay thế — không gỡ được danh mục (F-37) | Sách giữ mãi danh mục đã bỏ | 🟠 | Lỗi | ✅ Đã chốt 25-09-2026 | **Lỗi**. **Sinh `REQ-BK-BOOK-141`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-22 | `price` số lẻ (`1500.5`) bị cắt thành `1500`; web nhận và hiển thị `1.500,5` (REQ-31) (F-45) | Giá lưu khác giá nhập | 🟠 | Lưu đúng giá trị đã gửi | ✅ Đã chốt 25-09-2026 | **Lỗi API** — lưu nguyên số lẻ. **Sinh `REQ-BK-BOOK-140`** (kỳ vọng, chưa đạt); `REQ-31` (web) giữ nguyên (DEMO-AMB-2509B) |
| AMB-BK-BOOK-23 | `POST` · `PATCH /api/book` trả **200**, spec khai **201** (F-08 · F-09) | TC theo spec đỏ; TC theo thực tế trái spec | 🟡 | Spec đúng | ✅ Đã chốt 25-09-2026 | **Spec đúng** — kỳ vọng **201**. **Sinh `REQ-BK-BOOK-83`** · **`114`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-24 | Trùng slug báo `Book name already exists.`; slug tự đặt không kiểm định dạng (nhận khoảng trắng · chữ hoa · tiếng Việt) (F-39) | Thông báo sai đối tượng | 🟡 | Thông báo phải nói về slug; định dạng slug chấp nhận | ✅ Đã chốt 25-09-2026 | **Lỗi thông báo** — **sinh `REQ-BK-BOOK-88`** (kỳ vọng, chưa đạt). Slug tự đặt **chấp nhận** — `REQ-BK-BOOK-86` (DEMO-AMB-2509B) |
| AMB-BK-BOOK-25 | Chi tiết sách không có ảnh trả `picture` có 1 phần tử rỗng, danh sách trả `[]` (F-38) | Client hiển thị ảnh trống | 🟡 | Lỗi | ✅ Đã chốt 25-09-2026 | **Lỗi**. **Sinh `REQ-BK-BOOK-82`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-26 | Slug tự sinh **bỏ** chữ `Đ`/`đ` (`Đặc` → `ac`) thay vì đổi thành `d` (F-44) | Slug sai, có thể trùng | 🟡 | Lỗi | ✅ Đã chốt 25-09-2026 | **Lỗi**. **Sinh `REQ-BK-BOOK-85`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-27 | Giới hạn cột lưu trữ không khai: `name` ≤ 191 · `description` ≤ 65.535 · tên danh mục ≤ 191 (web giới hạn tên danh mục tự gõ ở 25) | TC biên không có căn cứ | 🟡 | Giới hạn thật là chính thức; giới hạn 25 của web là riêng giao diện | ✅ Đã chốt 25-09-2026 | **Chấp nhận**. **Sinh `REQ-BK-BOOK-93`** · `100` · `106`; `REQ-BK-BOOK-34` (web, ≤ 24) **giữ nguyên** (DEMO-AMB-2509B) |
| AMB-BK-BOOK-28 | `x-www-form-urlencoded` · `multipart/form-data` không dùng được cho `POST /api/book` và `PATCH price` — giá trị số luôn đến dạng chuỗi và bị 422 (F-41) | Spec khai 3 content-type nhưng chỉ JSON dùng được | 🟡 | Spec đúng | ✅ Đã chốt 25-09-2026 | **Lỗi**. **Sinh `REQ-BK-BOOK-111`** · **`130`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-29 | `name` rỗng · `categories` chứa chuỗi rỗng: có bị từ chối không? (`categories: [""]` tạo được sách và có thể sinh danh mục tên rỗng) (F-46) | Danh mục rác không xoá được | 🟡 | Bị từ chối | ✅ Đã chốt 25-09-2026 | **Bị từ chối**. **Sinh `REQ-BK-BOOK-142`** (`@NeedsVerify` — đã có sách tên rỗng nên chỉ thấy lỗi trùng) · **`REQ-BK-BOOK-143`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-30 | `status` · `price` khai `required` nhưng thiếu vẫn tạo được (server dùng `default`) (F-40 · F-28) | TC "thiếu field" cho kết quả khác spec | 🟡 | Spec đúng | ✅ Đã chốt 25-09-2026 | **Spec đúng** — thiếu → 422. **Sinh `REQ-BK-BOOK-95`** · **`101`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-31 | `view` sai kiểu → **422**, spec khai **400** | Spec lệch thực tế | 🟢 | Thực tế đúng, spec khai sai | ✅ Đã chốt 25-09-2026 | **Spec khai sai** — `REQ-BK-BOOK-80` theo thực tế (422) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-32 | Body 400 của bộ lọc sai cú pháp lộ đường dẫn máy chủ và tên thư viện (F-33) | Lộ thông tin nội bộ | 🟡 | Lỗi | ✅ Đã chốt 25-09-2026 | **Lỗi**. **Sinh `REQ-BK-BOOK-146`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-33 | `limit=1.5` được nhận (`GET /api/book`) | Tham số phân trang không nguyên | 🟢 | `limit` phải là số nguyên | ✅ Đã chốt 25-09-2026 | Theo Assumption. **Sinh `REQ-BK-BOOK-145`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-BOOK-34 | Tạo sách trên **Android**: `Uploading image...` hiện rồi mất, không thông báo thành công/lỗi, sách không được tạo (2/2) — web tạo được với cùng dữ liệu (REQ-39) | Người dùng app không tạo được sách, không biết vì sao | 🔴 | Là **lỗi app Android** (nghi bước tải ảnh lên) | ✅ Đã chốt 26-09-2026 | **Lỗi Android** — trùng Assumption. **Sinh `REQ-BK-BOOK-147`** (kỳ vọng, chưa đạt). Nguyên nhân **cần Dev xác minh** — không quan sát được request; cùng dạng lỗi ghi của Save Profile (`AMB-BK-AUTH-34`) (DEMO-AMB-2609) |
| AMB-BK-BOOK-35 | Hộp `Confirm delete` ở `Modify book` trên Android hiện tên của **form khác** mở trước đó trong phiên (tên sách đang tạo dở), không phải sách đang xoá — nặng hơn lỗi web (tên cũ của cùng sách) | Người dùng xác nhận xoá dựa trên tên sai — xoá nhầm sách | 🟠 | Cùng rule REQ-48 (hiển thị đúng tên hiện tại) | ✅ Đã chốt 26-09-2026 | **Lỗi** — REQ-48 (`Android · Web`) giữ kỳ vọng, AC ghi hiện trạng từng nền tảng. Không cấp REQ mới (DEMO-AMB-2609) |
| AMB-BK-BOOK-36 | Mất mạng trên Android: danh sách sách hiện `No Data`, không có thông báo lỗi mạng | Người dùng tưởng không có sách | 🟡 | Chấp nhận — cùng kết luận `AMB-BK-AUTH-16` | ✅ Đã chốt 26-09-2026 | **Chấp nhận hiện trạng** — REQ-151 ghi hành vi quan sát (DEMO-AMB-2609) |
| AMB-BK-BOOK-37 | Breadcrumb của `Modify book` trên Android ghi `Book management / Create a new book` | Người dùng tưởng đang tạo sách mới | 🟢 | Là lỗi câu chữ | ✅ Đã chốt 26-09-2026 | **Lỗi** — **sinh `REQ-BK-BOOK-154`** (kỳ vọng `Modify book`, chưa đạt). Web chưa kiểm breadcrumb này (DEMO-AMB-2609) |

**AMB cấp hệ thống tham chiếu** (sở hữu ở [`api_map.md` mục 4](../_discovery/api_map.md#4-khoảng-trống-của-spec-amb--cần-chốt-trước-khi-sinh-tc)) — **đều đã chốt 25-09-2026**: `AMB-BK-01` không có mô hình vai trò · `AMB-BK-02` dữ liệu công khai là cố ý · `AMB-BK-03` giá bán âm là lỗi (→ REQ-51).

### 11.2. Risks

| Mã | Rủi ro | Mô tả | Mitigation |
|---|---|---|---|
| RISK-BK-BOOK-01 | Dữ liệu rác lớn trên server duy nhất | ≈ 746 sách, nhiều sách test cũ, giá âm, danh mục trùng tên — thứ tự thay đổi theo lượt xem | Mọi TC tạo sách riêng `auto_book_<timestamp>` và assert trên sách đó; không assert tổng số / vị trí sách của người khác |
| RISK-BK-BOOK-02 | Danh sách cuộn vô tận | Không có phân trang — sách cần tìm có thể nằm ngoài 36 thẻ đầu | Tìm bằng `Search book...` thay vì cuộn |
| RISK-BK-BOOK-03 | Ảnh tải lên tồn đọng | Mỗi lần tạo sách tải 1 ảnh lên `$book-image/…`; xoá sách có thể không xoá ảnh (`AMB-BK-BOOK-16`) | Dùng ảnh rất nhỏ (vài trăm byte); gom dọn thư mục `$book-image/auto-*` định kỳ ở module `FILE` |
| RISK-BK-BOOK-04 | Lỗi console từ ảnh hỏng | Nhiều `GET /api/file?path=…` → 404 do dữ liệu cũ | Automation **không** fail TC vì lỗi console của ảnh không thuộc sách test |
| RISK-BK-BOOK-05 | Email chủ sách công khai lọt vào evidence | `auth.email` trong danh sách / chi tiết là dữ liệu cá nhân của người thật | Không chụp / in `auth` của sách **không** do phiên tạo; đọc bằng `search` theo tên sách của phiên |
| RISK-BK-BOOK-06 | Khuyến mãi hiện hành đổi → giá bán đổi | `currentPrice` phụ thuộc mọi khuyến mãi đang hiệu lực (F-35); ngưỡng `price` tràn (F-42) đổi theo | TC **không** assert số tiền cụ thể; chỉ assert dấu (≥ 0) và quan hệ với `price` (REQ-137 · 138) · TC biên giá dùng giá nhỏ (≤ 1.000.000) |
| RISK-BK-BOOK-07 | Danh mục sinh tự động phải dọn | Mỗi tên danh mục mới trong `categories` tạo danh mục thật, xoá sách không xoá danh mục (REQ-52) | Danh mục của TC mang `auto_bookapi_cat_<tag>_<T>`; teardown xoá sách **trước**, rồi `DELETE /api/category-book/{name}` — chỉ tên chứa `<T>` |
| RISK-BK-BOOK-08 | Danh mục tên rỗng không dọn được | `categories: [""]` (REQ-143) có thể sinh danh mục `""`; không có đường dẫn để xoá | TC `@KnownBug` REQ-143 chạy **một lần**, ghi vào báo cáo và nhờ Dev dọn; **không** chạy trong regression |

| RISK-BK-BOOK-09 | Automation form sách trên Android | Ô giá không nhận `setValue` · lần bấm `Create book` đầu đôi khi không có tác dụng · chọn ảnh phải qua trình chọn ảnh hệ thống (cần đẩy ảnh test vào máy) · `Switch.checked` luôn `false` | Nhập giá bằng bàn phím · assert theo kết quả · chuẩn bị ảnh test trong `setUp` · không assert công tắc qua thuộc tính |
| RISK-BK-BOOK-10 | Sách test mồ côi còn sót | `Auto BKAPI NoPrice <timestamp>` (đợt API 25-09-2026) vẫn còn, tác giả đã bị xoá — không còn token của chủ để dọn qua API; xoá qua giao diện vướng REQ-48 (hộp xác nhận hiện sai tên) | Tester xoá thủ công trên **web** (hộp xác nhận web hiện đúng tên sách chưa đổi tên) và ghi lại; TC tạo sách phải dọn bằng token của chính tài khoản tạo **trước** khi xoá tài khoản |

---

## 13. Nhật ký Thay đổi

| Ngày | Nguồn | REQ ảnh hưởng | Loại | Tóm tắt thay đổi | TC cần xử lý |
|---|---|---|---|---|---|
| 26-09-2026 | UI recon Android · `/generate-requirements-from-mobile` · DEMO-AMB-2609 | REQ-BK-BOOK-147 → 154 | 🟢 Thêm | Khởi tạo mặt Android: 8 REQ ở `mobile/` (`147` tạo sách lỗi — kỳ vọng · `148` tab Book không về danh sách — kỳ vọng · `149` Sort về Feature · `150` Photo Picker · `151` mất mạng · `152` xoay ngang · `153` mô tả chỉ cận dưới · `154` breadcrumb Modify sai — kỳ vọng) · 20 ảnh · chốt `AMB-BK-BOOK-34 → 37` · thêm `RISK-BK-BOOK-09` · `10` | viết mới cho Android (tag `@Android`) · `147` · `148` · `154` `@KnownBug` |
| 26-09-2026 | UI recon Android | REQ-BK-BOOK-02 · 04 → 06 · 09 → 18 · 21 → 34 · 38 · 41 · 44 · 45 · 48 · 49 · 51 | 🟢 Thêm | **Mở rộng nền tảng: + Android** — chuyển 34 dòng từ `web/` lên index mục 3.2 (`Android · Web`); `51` thành `Android · Web · API`. Mã giữ nguyên, AC web giữ nguyên + thêm vế Android. `34` biên 24/25 lần đầu **kiểm chứng thực tế** (Android) · `48` Android hiện tên của form khác (`AMB-BK-BOOK-35`) | viết mới cho Android · TC web giữ nguyên · review TC `34` (bỏ nhãn chưa kiểm chứng) |
| 26-09-2026 | UI recon Android | — | ✏️ Biên tập | Mục 3 tách `3.1 Web · API` · `3.2 Android · Web` · thêm ma trận phân quyền Android · Bản đồ tài liệu · bảng Story (01 → 13 · 02 → 11 · 04 → 22 · 06 → 6 REQ) | — |
| 25-09-2026 | DEMO-AMB-2509B (chốt AMB giả lập — dữ liệu dạy học demo) | REQ-BK-BOOK-137 → 146 | 🟢 Thêm | Chốt `AMB-BK-BOOK-18` → `33`. **Thêm** `137` (sách không gắn khuyến mãi có giá bán = giá gốc) · `138` (sửa giá tính lại giá bán) · `139` (giá 100 tỷ được chấp nhận) · `140` (giá số lẻ lưu nguyên) · `141` (sửa danh mục thay thế) · `142` (tên rỗng bị từ chối) · `143` (danh mục rỗng bị từ chối) · `144` (`lengthData`) · `145` (`limit` số nguyên) · `146` (body 400 không lộ nội bộ) — trừ `144` (đã đúng) đều kỳ vọng chưa đạt. `REQ-83` · `88` · `95` · `101` · `104` · `111` · `114` · `123` · `130` cũng ghi kỳ vọng chưa đạt (`@KnownBug`) | viết mới (`@KnownBug`) — 30 TC API hiện có (`BK_BOOK_TC_060` → `089`) chỉnh lại: neo REQ API · `066` · `081` sang **201** |
| 25-09-2026 | `/generate-requirements-from-api` (spec không đổi — `sha256` trùng) | REQ-BK-BOOK-01 · 42 · 51 · 52 | 🟢 Thêm | **Mở rộng nền tảng: + API** — chuyển lên index (mục 3), `Nền tảng` = `Web · API`, mã giữ nguyên. `REQ-52` được API **kiểm chứng** (web vẫn chưa) | viết mới cho API (TC web giữ nguyên) |
| 25-09-2026 | `/generate-requirements-from-api` — 5 operation `/api/book*`, ≈ 445 request gọi thật | REQ-BK-BOOK-53 → 136 | 🟢 Thêm | Khởi tạo mặt API: 84 REQ / 6 Story (`08 → 13`) · 16 AMB (`18 → 33`, 1 🔴) · 4 RISK (`05 → 08`). Phát hiện **F-35 → F-46** (1 🔴 · 3 🟠 · 8 🟡) — đáng chú ý: **giá bán âm là do áp mọi khuyến mãi hệ thống** (F-35). Dọn 5 tài khoản · 46 sách · 40 danh mục (có thể sót 1 danh mục tên rỗng — `RISK-BK-BOOK-08`) | viết mới — 30 TC API hiện có neo tạm vào REQ Web → neo lại theo REQ API |
| 25-09-2026 | DEMO-AMB-2509 (chốt AMB giả lập — dữ liệu dạy học demo) | REQ-BK-BOOK-51 · 52 | 🟢 Thêm | `51` giá bán hiển thị không âm (giải quyết `AMB-BK-BOOK-01`, kỳ vọng — **chưa đạt**) · `52` tạo sách với danh mục tự gõ sinh danh mục mới (giải quyết `AMB-BK-BOOK-06`, **chưa kiểm chứng**). Story 01 → 10 REQ · Story 04 → 20 REQ | viết mới (`51` `@KnownBug` · `52` `@NeedsVerify`) |
| 25-09-2026 | DEMO-AMB-2509 | REQ-BK-BOOK-03 · 34 | 🟡 Sửa | `03` nhãn New = tạo trong vòng **7 ngày** (thêm vế > 7 ngày không có New) · `34` biên tên danh mục tự gõ chốt **≤ 24** hợp lệ / **≥ 25** bị chặn | viết mới (module chưa có TC) — vế mới gắn `@NeedsVerify` |
| 25-09-2026 | DEMO-AMB-2509 | — (REQ không đổi) | ✏️ Chốt AMB | Chốt toàn bộ `AMB-BK-BOOK-01` → `17`. Lỗi cần báo: `01` · `02` · `08`. Ma trận phân quyền: cột *Vai trò khác* → không áp dụng (`AMB-BK-01` · `15`) | — chi tiết [impact/impact_DEMO-AMB-2509.md](impact/impact_DEMO-AMB-2509.md) |
| 25-09-2026 | UI recon Web · `/generate-requirements-from-website` | REQ-BK-BOOK-01 → 50 | 🟢 Thêm | Khởi tạo tài liệu module từ khảo sát web: 50 REQ / 7 Story · 17 AMB (1 🔴) · 4 RISK · 19 ảnh evidence. `REQ-17` · `48` ghi kỳ vọng mà hệ thống **chưa đạt**. Mặt API/Android chưa có REQ | — (viết TC mới, tag `@Web`) · `17` · `48` kỳ vọng FAIL → mở bug sau khi PO trả lời AMB 02 · 08 |
