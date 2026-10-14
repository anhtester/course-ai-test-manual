# Đặc tả Yêu cầu — Module Sách (`BOOK`) · Nền tảng API

> Index module (metadata dải mã · REQ dùng chung · phân quyền · Story · AMB/RISK · Nhật ký): [../REQUIREMENTS_BOOK_SUMMARY.md](../REQUIREMENTS_BOOK_SUMMARY.md) · Danh mục hệ thống: [../../README.md](../../README.md) · Bản đồ API: [../../_discovery/api_map.md](../../_discovery/api_map.md) mục 2.3

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management API (mã hệ thống `BK`) |
| **Module** | Sách — tag `Book Management` (`/api/book` · `/api/book/{id}`). Danh mục (`/api/category-book`) thuộc `CAT`, khuyến mãi thuộc `PROMO`, tệp thuộc `FILE` — chỉ **đọc** ở mức cần để đối chiếu |
| **Nền tảng** | API |
| **Nguồn spec** | `https://book.anhtester.com/swagger/json` · snapshot 19-09-2026 [`openapi_2026-09-19.json`](../../_discovery/sources/openapi_2026-09-19.json) · `openapi: 3.0.0` · `info.version: 1.0.0` · `sha256 32bb8b39…3f09` — **tải lại 25-09-2026: `sha256` trùng, không thêm/bỏ/đổi operation nào** |
| **Môi trường gọi thử** | Production — 1 server duy nhất · **không** dùng chung (user chốt 14-08-2026) · `Gọi API: ✅` (user xác nhận 19-09-2026) · base URL + tài khoản ở `.env`, không ghi vào tài liệu |
| **Phương pháp** | Parse spec + **≈ 445 request gọi thật** ngày 25-09-2026 (4 lượt) trên **5 tài khoản · 46 sách · 40 danh mục do phiên tự tạo** (`auto_bookapi_*` · `Auto BookAPI <tag> <timestamp>`) — đã xoá đủ (mục 12.2). Không sửa/xoá sách hay danh mục có sẵn. Khuyến mãi (`/api/promotion-book`) chỉ **đọc** để giải thích `currentPrice` — **không** tạo khuyến mãi (khuyến mãi tác động lên giá bán của **mọi** sách, xem REQ-137) |
| **REQ trong file này** | **94** — `REQ-BK-BOOK-53` → `REQ-BK-BOOK-146`. 4 REQ `01` · `42` · `51` · `52` kiểm chứng khớp trên API → **chuyển lên index** (dùng chung `Web · API`), mã giữ nguyên |

---

## 2. Bản đồ phủ tài liệu

Không có tài liệu nghiệp vụ — toàn bộ REQ sinh từ **spec OpenAPI** và **kiểm chứng bằng gọi thật**; hành vi web ([`../web/requirements_book_web.md`](../web/requirements_book_web.md)) dùng để **đối chiếu**.

| Vùng chức năng | Nguồn phủ | Mức phủ | REQ liên quan |
|---|---|---|---|
| Hình dạng request/response · tham số phân trang/sắp xếp | Spec — schema inline | 🟩 Đầy đủ | 53 → 66 · 77 · 83 → 136 |
| Bộ lọc JSON của `search` | **Không có trong spec** (`search` chỉ khai `type: string`) — web gửi, API nhận | 🟨 Thực tế | 67 → 76 · 146 |
| Giá bán `currentPrice` · khuyến mãi | Spec chỉ khai `currentPrice: number`; công thức **không** có | 🟨 Thực tế — lệch | 51 (dùng chung) · 137 · 138 · 139 · `AMB-BK-BOOK-18` · `19` · `20` |
| Giới hạn cột lưu trữ | Spec **không** khai `maxLength` — `name` ≤ 191 · `description` ≤ 65.535 · tên danh mục ≤ 191 | 🟨 Thực tế | 93 · 100 · 106 |
| Danh mục sinh tự động khi tạo sách | Không có trong spec | 🟨 Thực tế | 52 (dùng chung) · 141 |
| Phân quyền theo vai trò | Không có — `AMB-BK-01` ✅: hệ thống **không** có vai trò | ⬜ Không áp dụng | 128 · 134 |

---

## Endpoint Catalog

| Method | Path | Auth (theo operation) | Status khai trong spec | Status thực tế đã quan sát | REQ bao phủ |
|---|---|---|---|---|---|
| GET | `/api/book` | 🌐 `security: []` | 200 · 400 · 422 | 200 · 400 · 422 | 01 (dùng chung) · 53 → 76 · 79 · 144 → 146 |
| POST | `/api/book` | 🔒 `BearerAuth` (kế thừa cấp gốc) | **201** · 400 · 401 · 403 · 422 | **200** · 400 · 401 · 404 · 422 — **403 chưa quan sát** | 52 (dùng chung) · 83 → 113 · 137 · 139 · 140 · 142 · 143 · 136 |
| GET | `/api/book/{id}` | 🌐 `security: []` | 200 · 400 · 404 | 200 · 404 · **422** (khi `view` sai kiểu) — **400 chưa quan sát** | 42 (dùng chung) · 77 → 82 |
| PATCH | `/api/book/{id}` | 🔒 `BearerAuth` (kế thừa cấp gốc) | **201** · 400 · 401 · 403 · 404 · 422 | **200** · 400 · 401 · 404 · 422 — **403 chưa quan sát** | 114 → 130 · 138 · 141 · 136 |
| DELETE | `/api/book/{id}` | 🔒 `BearerAuth` (kế thừa cấp gốc) | 200 · 400 · 404 · 422 | 200 · 401 · 404 | 131 → 135 |

**5/5 operation có REQ.** Status `403` (POST · PATCH) **không** phát sinh vì hệ thống không có vai trò (`AMB-BK-01` ✅). `POST` khai `404` nhờ khuyến mãi không tồn tại (REQ-109). `GET /api/book/{id}` khai `400` nhưng `view` sai kiểu thực tế trả `422` (`AMB-BK-BOOK-31` ✅ — spec khai sai).

---

## 3. Yêu cầu Chức năng

> **Thang `Nguồn`** (skill 3.4.5): `Spec + kiểm chứng thực tế · …` · `Thực tế — spec không nói · …` · `Spec — ❌ lệch thực tế (F-nn)` · `Quyết định PO · DEMO-AMB-2509B — ❌ lệch` (REQ ghi hành vi **kỳ vọng** do PO chốt, hệ thống chưa đạt → TC `@KnownBug`). Mã `K-nn` trỏ tới Nhật ký kiểm chứng (mục 12).
>
> Danh sách và chi tiết sách là **công khai**. `<userA>` · `<userB>` = 2 tài khoản do TC tự tạo; `bookA` = sách do TC tạo (`Auto BookAPI <tag> <T>`). Danh mục dùng cho TC luôn là tên riêng `auto_bookapi_cat_<tag>_<T>` (mỗi lần tạo sách với tên danh mục **chưa có** là sinh ra một danh mục thật — REQ-52 — nên phải dọn, `RISK-BK-BOOK-07`).

### 3.8. Danh sách · tìm kiếm · sắp xếp · phân trang (STORY-BK-BOOK-08)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-53 | Danh sách trả `list` và `pagination` đúng hình dạng | | `GET /api/book?limit=2&page=1` **không** token → **200** · `list` (mảng) có 2 phần tử, mỗi phần tử đủ 14 khoá `id` · `name` · `description` · `slug` · `categories` (mảng string) · `picture` (mảng) · `auth` · `status` · `createdAt` · `updatedAt` · `price` · `currentPrice` · `viewCount` (number) · `promotions` (mảng). `pagination` đủ 4 khoá number `total` · `totalPage` · `currentPage` · `lengthData` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 200 (K-01) |
| REQ-BK-BOOK-54 | `auth` là chủ sách hoặc `null` | Spec khai `auth` nullable | `auth` là object có đủ 3 khoá `name` · `email` · `avatarUrl` (sách do `userA` tạo → `auth.email` = email `userA`), **hoặc** `null` (sách mồ côi — REQ-135). Không khoá `auth` nào khác (**không** có `id` hay mật khẩu) | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 200 (K-02) |
| REQ-BK-BOOK-55 | Mặc định `limit`=10 · `page`=1 · sắp `updatedAt` giảm dần | Spec khai `default` | `GET /api/book` **không** tham số → **200** · `list` **đúng 10** phần tử (khi tổng ≥ 10) · `currentPage` = `1` · `updatedAt` **không tăng** dọc theo `list`. ⚠️ Khác web (web mặc định `viewCount` giảm dần — REQ-BK-BOOK-04) | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 200 (K-03) |
| REQ-BK-BOOK-56 | `limit` cắt đúng số bản ghi và tính `totalPage` | | `limit=2` → **200** · `list` **đúng 2** phần tử · `totalPage` = `⌈total / 2⌉` (đọc từ response, không assert con số cụ thể) | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 200 (K-04) |
| REQ-BK-BOOK-57 | `limit` ngoài khoảng [1 ; 10000] bị từ chối | Spec khai `minimum 1` · `maximum 10000` | `limit=0` · `limit=-1` → **422** · `fields._` chứa `Expected number to be greater or equal to 1`. `limit=10001` → **422** · `fields._` chứa `Expected number to be less or equal to 10000` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 422 (K-05) |
| REQ-BK-BOOK-58 | `limit` = 10000 hợp lệ (biên trên) | | `limit=10000` → **200** · `list.length` = số sách hiện có (khi ≤ 10000) · `totalPage` = `1` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 200 (K-06) |
| REQ-BK-BOOK-59 | `limit` sai kiểu bị từ chối | | `limit=abc` → **422** · `fields.limit` chứa `Property 'limit' should be one of: 'numeric', 'number'` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 422 (K-07) |
| REQ-BK-BOOK-60 | `page` chuyển sang trang khác trả bản ghi khác | | `limit=2&page=1` rồi `page=2` → cả hai **200** · mỗi trang 2 phần tử · **không** `id` nào ở cả hai trang · `currentPage` của lần 2 = `2` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 200 (K-09) |
| REQ-BK-BOOK-61 | `page` < 1 bị từ chối | | `page=0` → **422** · `fields._` chứa `Expected number to be greater or equal to 1` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 422 (K-10) |
| REQ-BK-BOOK-62 | `page` sai kiểu bị từ chối | | `page=abc` → **422** · `fields.page` chứa `Property 'page' should be one of: 'numeric', 'number'` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 422 (K-11) |
| REQ-BK-BOOK-63 | `page` vượt tổng số trang trả danh sách rỗng, không lỗi | | `page=999999&limit=5` → **200** · `list` rỗng · `currentPage` = `999999` · `lengthData` = `0` | 🟢 | — | Thực tế — spec không nói · GET /api/book → 200 (K-12) |
| REQ-BK-BOOK-64 | `sort` nhận 9 giá trị, `sortBy` sắp đúng chiều | Spec khai `enum` | Với `sort` ∈ {`name` · `description` · `status` · `createdAt` · `updatedAt` · `slug` · `price` · `currentPrice` · `viewCount`} × `sortBy` ∈ {`asc` · `desc`} → **200**. Chiều sắp **đã đối chiếu** với `createdAt` · `updatedAt` · `price` · `currentPrice` · `viewCount` (10 tổ hợp). 4 cột chuỗi mới đối chiếu **status** (thứ tự chuỗi phụ thuộc collation) | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 200 ×18 (K-13) |
| REQ-BK-BOOK-65 | `sort` ngoài enum bị từ chối | | `sort=khong_hop_le` · `sort=id` · `sort=categories` → **422** · `fields.sort` chứa `Expected kind 'UnionEnum'` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 422 (K-14) |
| REQ-BK-BOOK-66 | `sortBy` chỉ nhận `asc` hoặc `desc` | | `sortBy=up` → **422** · `fields.sortBy` chứa `Expected kind 'UnionEnum'` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 422 (K-15) |
| REQ-BK-BOOK-67 | `search` JSON: lọc theo `name` chứa chuỗi, không phân biệt hoa thường | Web gửi đúng dạng này (REQ-BK-BOOK-13 · 14) | `search={"name":{"contains":"cp50 <T>"}}` (URL-encode) → **200** · `list` **đúng 1** phần tử là sách có tên chứa chuỗi. Viết **HOA** toàn bộ chuỗi tìm → cùng kết quả | 🟢 | — | Thực tế — spec chỉ khai `type: string` · GET /api/book → 200 (K-16) |
| REQ-BK-BOOK-68 | `search` JSON: lọc theo `description` và `slug` | | `{"description":{"contains":"<chuỗi duy nhất>"}}` · `{"slug":{"contains":"<slug>"}}` → **200** · mỗi lần trả đúng sách chứa chuỗi đó | 🟢 | — | Thực tế — spec không nói · GET /api/book → 200 (K-17) |
| REQ-BK-BOOK-69 | `search` JSON: lọc theo danh mục | Web dùng cho tab danh mục (REQ-BK-BOOK-11) | `{"categories":{"some":{"name":{"in":["<tên danh mục>"]}}}}` → **200** · mọi phần tử có `categories` chứa danh mục đó | 🟢 | — | Thực tế — spec không nói · GET /api/book → 200 (K-18) |
| REQ-BK-BOOK-70 | `search` JSON: lọc theo `status` | | `{"AND":[{"status":{"equals":"AVAILABLE"}},{"name":{"contains":"<T>"}}]}` → **200** · chỉ sách `AVAILABLE`; `equals: "UNAVAILABLE"` → chỉ sách `UNAVAILABLE` (rỗng nếu không có) | 🟢 | — | Thực tế — spec không nói · GET /api/book → 200 (K-19) |
| REQ-BK-BOOK-71 | `search` JSON: lọc theo giá gốc `price` (`gte` · `gte` + `lte`) | | `{"price":{"gte":70000}}` → mọi phần tử `price` ≥ 70000. `{"price":{"gte":1000,"lte":70000}}` → mọi phần tử `1000 ≤ price ≤ 70000` (kết hợp với `name contains <T>` để giới hạn trong sách của phiên) | 🟢 | — | Thực tế — spec không nói · GET /api/book → 200 (K-20) |
| REQ-BK-BOOK-72 | `search` JSON: lọc `currentPrice` đủ hai đầu `gte` + `lte` | **Ở API, lọc đúng** — lỗi mất cận dưới của REQ-BK-BOOK-17 nằm ở **web** (web chỉ gửi `lte`) | `{"currentPrice":{"gte":-500000,"lte":0}}` → **200** · **mọi** phần tử có `-500000 ≤ currentPrice ≤ 0` | 🟢 | — | Thực tế — spec không nói · GET /api/book → 200 (K-21) |
| REQ-BK-BOOK-73 | `search` JSON: `OR` là hợp | | `{"OR":[{"name":{"contains":"cp50 <T>"}},{"name":{"contains":"cp70 <T>"}}]}` → **200** · `list` **đúng 2** phần tử | 🟢 | — | Thực tế — spec không nói · GET /api/book → 200 (K-22) |
| REQ-BK-BOOK-74 | `search` chuỗi thường khớp tên · mô tả · slug, không phân biệt hoa thường | Chuỗi **không** phải JSON | `search=AUTO BOOKAPI DESC <T>` (HOA) · `search=<mô tả duy nhất>` · `search=<slug duy nhất>` → **200** · mỗi lần `list` **đúng 1** phần tử là sách tương ứng. `search=<tên danh mục>` → **200** · `list` **rỗng** (chuỗi thường **không** khớp danh mục) | 🟢 | — | Thực tế — spec không nói · GET /api/book → 200 (K-23) |
| REQ-BK-BOOK-75 | `search` JSON sai cú pháp được coi là chuỗi thường | | `search={"name":` (JSON cắt cụt) → **200** · `list` rỗng · `total` = `0`. `search=` (rỗng) → **200** · như không truyền | 🟢 | — | Thực tế — spec không nói · GET /api/book → 200 (K-24) |
| REQ-BK-BOOK-76 | `search` JSON tham chiếu trường hoặc toán tử không tồn tại bị từ chối | Spec khai `400` với `{msg, error?}` | `{"khong_co":{"contains":"a"}}` · `{"name":{"regex":".*"}}` → **400** · body có `msg` = `Invalid filter or query syntax` và `error` (string) | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book → 400 (K-25) |
| REQ-BK-BOOK-144 | `lengthData` bằng số phần tử thực trả về | `AMB-BK-USER-14` ✅ chốt là **quy ước chung** cho các endpoint danh sách | `pagination.lengthData` = `list.length` trong mọi response 200 (`limit=10` → `10` · `page` vượt tổng → `0` · `limit=10000` → số sách hiện có). ✅ đúng ở `BOOK` (`USER` chưa đúng — REQ-BK-USER-118) | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Thực tế — spec không nói · GET /api/book → 200 (K-03 · K-06 · K-12) |
| REQ-BK-BOOK-145 | `limit` phải là số nguyên | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-33` ✅) | `limit=1.5` → **422** · `fields.limit` báo sai kiểu (như REQ-59). **Hiện tại:** **200**, `list` 1 phần tử | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch · GET /api/book → 200 (K-08) |
| REQ-BK-BOOK-146 | Body lỗi 400 của bộ lọc không lộ thông tin nội bộ | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-32` ✅ · F-33) | Body `400` của REQ-76: `error` **không** chứa đường dẫn thư mục của máy chủ (bắt đầu bằng `/var/` · `/home/` · `/usr/` hoặc chứa `\`) và **không** chứa tên thư viện truy cập dữ liệu. **Hiện tại:** chứa cả hai. TC **không** chép nội dung `error` vào báo cáo | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-33) · GET /api/book → 400 (K-25) |

### 3.9. Chi tiết sách (STORY-BK-BOOK-09)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-77 | Chi tiết sách trả đủ 13 khoá | Spec: **không** có `slug` trong response chi tiết | `GET /api/book/<id bookA>` **không** token → **200** · body đủ `id` · `name` · `description` · `price` · `currentPrice` · `viewCount` · `status` · `createdAt` · `updatedAt` · `picture` (mảng object `name` · `path` · `isFile` · `size` · `type` · `modified` · `created`) · `auth` · `categories` · `promotions` (mảng, mỗi phần tử có thêm `id`). **Không** có khoá `slug`. `id` bằng `id` đã dùng | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book/{id} → 200 (K-27) |
| REQ-BK-BOOK-78 | `{id}` nhận cả `id` lẫn `slug` | Web mở trang chi tiết bằng slug (REQ-BK-BOOK-41) | `GET /api/book/<slug của bookA>` → **200** · `id` của body **bằng** `id` của `bookA`. `GET /api/book/<slug>?view=true` tăng `viewCount` đúng như REQ-42 | 🟢 | — | Thực tế — spec khai path `id` · GET /api/book/{id} → 200 (K-28) |
| REQ-BK-BOOK-79 | Endpoint đọc công khai bỏ qua header `Authorization` | Cả `GET /api/book` lẫn `GET /api/book/{id}` khai `security: []` | Gửi `Authorization: Bearer abc.def.ghi` (token **không hợp lệ**) → vẫn **200** ở cả hai (**không** 401) | 🟢 | — | Spec (`security: []`) + kiểm chứng thực tế · → 200 (K-29) |
| REQ-BK-BOOK-80 | `view` sai kiểu bị từ chối | Spec khai `400`, **thực tế `422`** (`AMB-BK-BOOK-31` ✅: spec khai sai) | `view` = `abc` · `1` · `TRUE` · `` (rỗng) → **422** · `fields.view` chứa `Property 'view' should be one of: 'boolean'…` · `viewCount` **không** đổi | 🟢 | — | Thực tế — spec khai 400 nhưng thật 422 · GET /api/book/{id} → 422 (K-30) |
| REQ-BK-BOOK-81 | `id` không tồn tại trả 404 | | `GET /api/book/khong_ton_tai_<T>` (có và không `?view=true`) → **404** · `msg` = `Book not found.` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/book/{id} → 404 (K-31) |
| REQ-BK-BOOK-82 | Sách không có ảnh có `picture` = `[]` ở cả chi tiết lẫn danh sách | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-25` ✅ chốt là **lỗi**, F-38) | Sách tạo **không** có `pictures` → `list[].picture` = `[]` **và** chi tiết `picture` = `[]`. **Hiện tại:** danh sách `[]` nhưng chi tiết trả **1 phần tử rỗng** (`name` = `""` · `path` = `""` · `isFile` = `true`) | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-38) · GET /api/book/{id} → 200 (K-32) |

### 3.10. Tạo sách (STORY-BK-BOOK-10)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-83 | Tạo sách thành công trả **201** | Spec khai `201`; **thực tế `200`** (F-08 · `AMB-BK-BOOK-23` ✅ chốt: spec đúng) | `POST /api/book` · Bearer hợp lệ · body `{name, status, categories, price}` → **201** · `msg` = `Book created successfully.` · body **chỉ** có `msg` (không trả `id` — tra qua `GET /api/book?search=<JSON name>`). **Hiện tại:** **200** | 🟢 | — | Spec — ❌ lệch thực tế (F-08) · POST /api/book → 200 (K-42) |
| REQ-BK-BOOK-84 | Sách vừa tạo đọc lại đúng dữ liệu | Tác tạo phải dùng được (4.3.8) | Sau REQ-83: chi tiết → `name` · `description` · `status` · `price` **bằng** đã gửi · `categories` chứa danh mục đã gửi · `viewCount` = `0` · `promotions` = `[]` · `auth.email` = email người tạo · `id` khác rỗng | 🟢 | — | Thực tế — spec không nói · GET /api/book/{id} → 200 (K-43) |
| REQ-BK-BOOK-85 | Slug tự sinh từ tên: chữ thường, bỏ dấu, nối `-` | Cùng quy tắc web (REQ-BK-BOOK-24) | Không gửi `slug`; `name` = `Auto BookAPI ok <T>` → slug = `auto-bookapi-ok-<T>`. `name` = `Sách Đặc Biệt Ấn Bản <T>` → slug = `sach-dac-biet-an-ban-<T>` (`Đ`/`đ` → `d`). **Hiện tại:** `sach-ac-biet-an-ban-<T>` — chữ `Đ` bị **bỏ** thay vì đổi thành `d` (F-44) | 🟢 | — | Thực tế — ❌ lệch (F-44 · `AMB-BK-BOOK-26` ✅ lỗi) · GET /api/book → 200 (K-44) |
| REQ-BK-BOOK-86 | Slug tự đặt được lưu nguyên văn | Không có kiểm định định dạng slug (`AMB-BK-BOOK-24` ✅ chấp nhận) | Body có `slug` = `auto-bookapi-slug-<T>` và `Slug Có Dấu <T>` → **200/201** · slug đọc lại **bằng đúng** chuỗi đã gửi (không chuẩn hoá) | 🟢 | — | Thực tế — spec khai `slug` không ràng buộc · POST /api/book → 200 (K-45) |
| REQ-BK-BOOK-87 | Trùng tên sách bị từ chối, không phân biệt hoa thường | Tên sách là duy nhất (F-29) | Tạo sách với `name` **đã có** (đúng · viết HOA toàn bộ) → **400** · `msg` = `Book name already exists.` · không tạo bản thứ hai | 🟢 | — | Thực tế — spec không nói · POST /api/book → 400 (K-46) |
| REQ-BK-BOOK-88 | Trùng slug bị từ chối với thông báo nói về slug | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-24` ✅ · F-39) | Tạo sách **tên mới** nhưng `slug` **đã có** → **400** · `msg` **chứa** `slug` (không phân biệt hoa thường). **Hiện tại:** **400** · `msg` = `Book name already exists.` — sai đối tượng | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-39) · POST /api/book → 400 (K-47) |
| REQ-BK-BOOK-89 | Tạo sách khi không có / sai scheme xác thực bị từ chối | Spec khai `401` | Body **hợp lệ**, **không** `Authorization` → **401** · `msg` = `Missing or invalid Authorization header` · không tạo sách (tìm theo tên → `total` = `0`) | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 401 (K-40) |
| REQ-BK-BOOK-90 | Tạo sách với token không hợp lệ bị từ chối | | `Bearer abc.def.ghi` · `Bearer ` (rỗng) → **401** · `msg` = `Unauthorized` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 401 (K-41) |
| REQ-BK-BOOK-91 | Thiếu `name` bị từ chối | | Thiếu khoá `name` → **422** · `fields.name` chứa `Expected property 'name' to be string but found: undefined` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 422 (K-48) |
| REQ-BK-BOOK-92 | `name` sai kiểu bị từ chối | | `name` = `123` → **422** · `fields.name` chứa `to be string but found: 123` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 422 (K-49) |
| REQ-BK-BOOK-93 | `name` tối đa 191 ký tự | Spec **không khai** `maxLength` (`AMB-BK-BOOK-27` ✅ chấp nhận là giới hạn chính thức) | `name` dài 191 ký tự → **200/201**. `name` dài ≥ 192 (đã đo 192 · 255 · 1000) → **400** · body chỉ `{"msg":"Invalid data."}` (không `fields`) | 🟢 | — | Thực tế — spec không nói · POST /api/book → 200 / 400 (K-51) |
| REQ-BK-BOOK-94 | `status` ngoài enum bị từ chối | Spec khai `AVAILABLE` · `UNAVAILABLE` | `status` = `HACKED` · `1` · `available` (chữ thường) → **422** · `fields.status` chứa `Expected kind 'UnionEnum'` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 422 (K-52) |
| REQ-BK-BOOK-95 | Thiếu `status` bị từ chối | Spec khai `status` **required**; server dùng `default` (F-40 · `AMB-BK-BOOK-30` ✅ chốt: spec đúng) | Thiếu khoá `status` → **422** · `fields.status` báo thiếu. **Hiện tại:** **200**, sách tạo với `status` = `AVAILABLE` | 🟢 | — | Spec — ❌ lệch thực tế (F-40) · POST /api/book → 200 (K-53) |
| REQ-BK-BOOK-96 | Thiếu `categories` bị từ chối | | Thiếu khoá `categories` → **422** · `fields.categories` chứa `Expected array` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 422 (K-54) |
| REQ-BK-BOOK-97 | `categories` rỗng bị từ chối | Spec khai `minItems: 1` | `categories` = `[]` → **422** · `fields.categories` chứa `Expected array length to be greater or equal to 1` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 422 (K-55) |
| REQ-BK-BOOK-98 | `categories` sai kiểu bị từ chối | | `categories` = `"abc"` (chuỗi) → **422** · `fields.categories` chứa `Expected array`. `categories` = `[123]` → **422** · `fields` có khoá **`categories/0`** chứa `to be string but found: 123` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 422 (K-54 · K-56) |
| REQ-BK-BOOK-99 | Danh mục trùng lặp trong mảng được gộp | | `categories` = `[c1, c1]` → **200/201** · sách đọc lại có `categories.length` = `1` | 🟢 | — | Thực tế — spec không nói · POST /api/book → 200 (K-58) |
| REQ-BK-BOOK-100 | Tên danh mục tối đa 191 ký tự | **Web chặn ở 25** (REQ-BK-BOOK-34 — giới hạn riêng của giao diện, `AMB-BK-BOOK-27` ✅ chấp nhận) | Tên danh mục dài 100 · 191 ký tự → **200/201**. Dài 192 · 300 → **400** · `{"msg":"Invalid data."}` | 🟢 | — | Thực tế — spec không nói · POST /api/book → 200 / 400 (K-59) |
| REQ-BK-BOOK-101 | Thiếu `price` bị từ chối | Spec khai `price` **required**; server dùng `default 50000` (F-28 · `AMB-BK-BOOK-30` ✅) | Thiếu khoá `price` → **422** · `fields.price` báo thiếu. **Hiện tại:** **200**, sách có `price` = `50000` | 🟢 | — | Spec — ❌ lệch thực tế (F-28) · POST /api/book → 200 (K-60) |
| REQ-BK-BOOK-102 | `price` sai kiểu bị từ chối | | `price` = `"abc"` · `"50000"` (chuỗi số) · `null` → **422** · `fields.price` chứa `Expected number` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 422 (K-61) |
| REQ-BK-BOOK-103 | `price` lớn hơn 100.000.000.000 bị từ chối | Giới hạn đúng = **100 tỷ** theo web (`AMB-BK-BOOK-05` ✅: `maximum 9.000.000.000.000` của spec là **lỗi spec**) | `price` = `100000000001` → **không** phải 200/201 (đã đo **400** · `{"msg":"Invalid data."}`). `price` = `9000000000001` · `1e20` → **422** · `fields.price` chứa `Expected number to be less or equal to 9000000000000` | 🟢 | — | Thực tế — spec khai ngưỡng khác · POST /api/book → 400 / 422 (K-62 · K-65) |
| REQ-BK-BOOK-104 | Giá gốc dưới 1.000 (kể cả âm) bị từ chối | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-03` ✅ · F-04) | `price` = `999` · `0` · `-99999` → **422/400** · không tạo sách. **Hiện tại:** cả ba giá trị đều **200** và được lưu | 🟢 | — | Spec — ❌ lệch quyết định PO (F-04 · `AMB-BK-03` ✅) · POST /api/book → 200 (K-63) |
| REQ-BK-BOOK-105 | Giá gốc đúng bằng 1.000 (biên dưới) được chấp nhận | Cùng biên với web (REQ-BK-BOOK-29: 1.000 hợp lệ) | `price` = `1000` → **200/201** · đọc lại `price` = `1000` | 🟢 | — | Thực tế — spec không nói · POST /api/book → 200 (K-63) |
| REQ-BK-BOOK-106 | `description` tối đa 65.535 ký tự | Spec không khai `maxLength` | `description` dài 65.535 → **200/201**. Dài 65.536 → **400** · `{"msg":"Invalid data."}` | 🟢 | — | Thực tế — spec không nói · POST /api/book → 200 / 400 (K-66) |
| REQ-BK-BOOK-107 | `pictures` sai kiểu bị từ chối | Spec khai `pictures` là mảng string | `pictures` = `"abc"` → **422** · `fields.pictures` chứa `Expected array` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 422 (K-67) |
| REQ-BK-BOOK-108 | `pictures` trỏ tệp không tồn tại vẫn tạo được sách, không sinh ảnh | | `pictures` = `["/$book-image/auto-<T>/khong_co.png"]` → **200/201** · chi tiết `picture` = `[]` (**không** kiểm tra tệp tồn tại) | 🟢 | — | Thực tế — spec không nói · POST /api/book → 200 (K-67) |
| REQ-BK-BOOK-109 | `promotions` chứa id không tồn tại bị từ chối | Spec khai `404` cho `POST` | `promotions` = `["khong_ton_tai_<T>"]` → **404** · `msg` = `Promotion not found.` · không tạo sách | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/book → 404 (K-68) |
| REQ-BK-BOOK-110 | Trường ngoài schema và trường server tự tính bị bỏ qua | Chống Mass Assignment | Body có thêm `id` = `custom-<T>` · `viewCount` = `9999` · `currentPrice` = `1` · `createdAt` = `2000-01-01T00:00:00.000Z` · `auth` = `"hacked"` → **200/201** · đọc lại: `id` **do server sinh** · `viewCount` = `0` · `createdAt` là hiện tại · `auth.email` = email người tạo. (`currentPrice` **không** nhận giá trị gửi lên — giá trị của nó xem REQ-137) | 🟢 | — | Thực tế — spec không nói · POST /api/book → 200 (K-69) |
| REQ-BK-BOOK-111 | Tạo sách nhận đủ 3 content-type khai trong spec | Spec khai `application/json` · `x-www-form-urlencoded` · `multipart/form-data` (`AMB-BK-BOOK-28` ✅ chốt: spec đúng) | Cùng body hợp lệ theo từng content-type → **200/201**. **Hiện tại:** chỉ `json` ✅; `x-www-form-urlencoded` · `multipart/form-data` → **422** · `fields.price` = `Expected number` (giá trị số luôn đến dưới dạng chuỗi, **không** được đổi kiểu) — kể cả khi `categories` gửi đúng dạng khoá lặp (F-41) | 🟢 | — | Spec — ❌ lệch thực tế (F-41) · POST /api/book → 422 (K-70) |
| REQ-BK-BOOK-112 | Body JSON sai cú pháp bị từ chối, body lỗi **không** phải JSON | Spec khai `400` với `{msg}` | Body `{"name":` → **400** · body là chuỗi `Bad Request` (không đọc được `msg`) | 🟢 | — | Spec — ❌ lệch thực tế: body lỗi là văn bản (K-71) |
| REQ-BK-BOOK-113 | Chuỗi tấn công và Unicode ở `name` · `description` lưu nguyên văn | Kiểm chống hồi quy | `name` = `<script>alert(1)</script><T>` · `description` = `Robert'); DROP TABLE books;--` → **200/201** · đọc lại **bằng đúng** chuỗi đã gửi. **Không** 500 | 🟢 | — | Thực tế — spec không nói · POST /api/book → 200 (K-72) |
| REQ-BK-BOOK-137 | Sách không gắn khuyến mãi có giá bán bằng giá gốc | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-18` ✅ chốt là **lỗi**, F-35). Nguyên nhân gốc của giá âm ở REQ-51 | Tạo sách **không** gửi `promotions`, `price` = `50000` → `promotions` = `[]` **và** `currentPrice` = `50000` (ở cả danh sách lẫn chi tiết). **Hiện tại:** `currentPrice` = `price × (1 − ΣPERCENTAGE/100) − ΣFIXED_AMOUNT` của **mọi** khuyến mãi đang hiệu lực toàn hệ thống (đối chiếu khớp chính xác 4 mức giá, K-73) → **âm**. TC **không** assert số cụ thể — giá trị đổi theo khuyến mãi hiện hành (`RISK-BK-BOOK-06`) | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-35) · GET /api/book/{id} → 200 (K-73) |
| REQ-BK-BOOK-139 | `price` = 100.000.000.000 được chấp nhận | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-20` ✅; giới hạn đúng 100 tỷ theo REQ-103) | `price` = `100000000000` → **200/201** · đọc lại `price` bằng giá trị đã gửi. **Hiện tại:** **400** `{"msg":"Invalid data."}` với **mọi** `price` ≥ 27.000.000 (đã đo: 26.000.000 → 200 · 27.000.000 → 400) — do `currentPrice` (REQ-137) vượt giới hạn số nguyên 32 bit; ngưỡng đổi theo khuyến mãi hiện hành (F-42) | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-42) · POST /api/book → 400 (K-65) |
| REQ-BK-BOOK-140 | `price` số lẻ được lưu nguyên | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-22` ✅ chốt: lưu đúng; web nhận `1.500,5` — REQ-BK-BOOK-31) | `price` = `1500.5` → **200/201** · đọc lại `price` = `1500.5`. **Hiện tại:** `1500` (phần thập phân bị cắt — `1500.7` và `1500.2` cũng đều thành `1500`, F-45) | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-45) · POST /api/book → 200 (K-64) |
| REQ-BK-BOOK-142 | `name` rỗng bị từ chối | Kỳ vọng — hiện **chưa xác nhận được** (`AMB-BK-BOOK-29` ✅ chốt: bị từ chối, F-46) | `name` = `""` → **không** phải 200/201 · không tạo sách. **Quan sát:** **400** · `Book name already exists.` — vì hệ thống **đang có sẵn** một sách tên rỗng nên chỉ bị chặn vì trùng, **không** phải vì rỗng → chưa kiểm chứng được nhánh "rỗng, chưa trùng". TC gắn `@NeedsVerify` | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — **chưa kiểm chứng** · POST /api/book → 400 (K-50) |
| REQ-BK-BOOK-143 | Tên danh mục rỗng bị từ chối | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-29` ✅, F-46) | `categories` = `[""]` → **422** · không tạo sách. **Hiện tại:** **200** — tạo được sách và (có khả năng) một danh mục tên rỗng; danh mục tên rỗng đã xuất hiện trong `GET /api/category-book` với `bookCount` = `0` (không rõ có sẵn hay do lần thử tạo ra) | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-46) · POST /api/book → 200 (K-57) |

### 3.11. Sửa sách (STORY-BK-BOOK-11)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-114 | Sửa sách thành công trả **201** | Spec khai `201`; **thực tế `200`** (F-09 · `AMB-BK-BOOK-23` ✅ chốt: spec đúng) | `PATCH /api/book/<id>` · Bearer hợp lệ · body `{name: <mới>}` → **201** · `msg` = `Book updated successfully.` · chi tiết → `name` = tên mới. **Hiện tại:** **200** | 🟢 | — | Spec — ❌ lệch thực tế (F-09) · PATCH /api/book/{id} → 200 (K-81) |
| REQ-BK-BOOK-115 | Cập nhật một phần: chỉ gửi field cần đổi | Khác `PATCH /api/user` (F-27) — sách **không** đòi field khác | Body chỉ `{name}` → thành công · chỉ `name` đổi (các field khác giữ nguyên) | 🟢 | — | Thực tế — spec không nói · PATCH /api/book/{id} → 200 (K-82) |
| REQ-BK-BOOK-116 | Body `{}` không đổi gì và không lỗi | | `PATCH` body `{}` → thành công (**200/201**) · dữ liệu không đổi | 🟢 | — | Thực tế — spec không nói · PATCH /api/book/{id} → 200 (K-83) |
| REQ-BK-BOOK-117 | Đổi `name` không sinh lại `slug` | **Web** gửi `slug` mới khi sửa tên (REQ-BK-BOOK-45); API **không** tự sinh | `PATCH` chỉ `name` → `slug` **giữ nguyên** · `GET /api/book/<slug cũ>` vẫn **200**. Muốn đổi slug phải gửi `slug` (REQ-125) | 🟢 | — | Thực tế — spec không nói · PATCH → 200 · GET → 200 (K-81) |
| REQ-BK-BOOK-118 | Đổi sang tên của sách khác bị từ chối; giữ nguyên tên thì được | | `name` = tên của sách khác → **400** · `msg` = `Book name already exists.`. `name` = tên **hiện tại** của chính sách → thành công | 🟢 | — | Thực tế — spec không nói · PATCH /api/book/{id} → 400 / 200 (K-84) |
| REQ-BK-BOOK-119 | Đổi `status` được lưu | | Body `{status: "UNAVAILABLE"}` → thành công · chi tiết → `status` = `UNAVAILABLE` | 🟢 | — | Thực tế — spec không nói · PATCH /api/book/{id} → 200 (K-85) |
| REQ-BK-BOOK-120 | `status` ngoài enum khi sửa bị từ chối | | `status` = `HACKED` → **422** · `fields.status` chứa `Expected kind 'UnionEnum'` | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/book/{id} → 422 (K-86) |
| REQ-BK-BOOK-121 | Đổi `price` được lưu | | Body `{price: 70000}` → thành công · chi tiết → `price` = `70000` | 🟢 | — | Thực tế — spec không nói · PATCH /api/book/{id} → 200 (K-87) |
| REQ-BK-BOOK-122 | `price` sai kiểu hoặc quá lớn khi sửa bị từ chối | | `price` = `"abc"` → **422** · `fields.price` chứa `Expected number`. `price` = `9000000000001` → **422** · `Expected number to be less or equal to 9000000000000` · giá cũ **không** đổi | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/book/{id} → 422 (K-88) |
| REQ-BK-BOOK-123 | Giá gốc dưới 1.000 (kể cả âm) khi sửa bị từ chối | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-03` ✅ · F-04) | `price` = `-1` → **422/400** · giá cũ không đổi. **Hiện tại:** **200** — `price` = `-1` được lưu | 🟢 | — | Spec — ❌ lệch quyết định PO (F-04) · PATCH /api/book/{id} → 200 (K-88) |
| REQ-BK-BOOK-124 | `categories` rỗng khi sửa bị từ chối | Spec khai `minItems: 1` | `categories` = `[]` → **422** · `fields.categories` chứa `Expected array length to be greater or equal to 1` | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/book/{id} → 422 (K-89) |
| REQ-BK-BOOK-125 | Đổi `slug` được lưu | | Body `{slug: "auto-bookapi-patched-<T>"}` → thành công · đọc lại `slug` bằng đúng chuỗi đã gửi | 🟢 | — | Thực tế — spec không nói · PATCH /api/book/{id} → 200 (K-91) |
| REQ-BK-BOOK-126 | Sửa sách khi không có / sai token bị từ chối | Spec khai `401` | **Không** `Authorization` → **401** · `msg` = `Missing or invalid Authorization header`. `Bearer abc.def.ghi` → **401** · `msg` = `Unauthorized`. Sách **không** đổi | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/book/{id} → 401 (K-80) |
| REQ-BK-BOOK-127 | Sửa `id` không tồn tại trả 404 | | `PATCH /api/book/khong_ton_tai_<T>` → **404** · `msg` = `Book not found.` | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/book/{id} → 404 (K-92) |
| REQ-BK-BOOK-128 | Người dùng đã đăng nhập sửa được sách của người khác, chủ sách không đổi | Hành vi hiện tại — **thiết kế** (`AMB-BK-01` ✅ · F-02) | Token `userB` · `PATCH` sách do `userA` tạo `{name: <mới>}` → thành công · `name` đổi · `auth.email` vẫn là email **`userA`** | 🟢 | — | Thực tế — spec không nói · PATCH /api/book/{id} → 200 (K-93) · chỉ trên sách do phiên tạo |
| REQ-BK-BOOK-129 | Trường ngoài schema bị bỏ qua khi sửa | Chống Mass Assignment | Body `{id: "hacked", viewCount: 777, currentPrice: 1}` → thành công · `id` **không đổi** · `viewCount` **không** thành `777` | 🟢 | — | Thực tế — spec không nói · PATCH /api/book/{id} → 200 (K-94) |
| REQ-BK-BOOK-130 | Sửa sách nhận `form-urlencoded` · `multipart` cho field chuỗi; field số bị từ chối | Spec khai 3 content-type (F-41 · `AMB-BK-BOOK-28` ✅) | Body `{description}` theo `x-www-form-urlencoded` · `multipart/form-data` → thành công (2/2). Body `{price: 80000}` theo `x-www-form-urlencoded` → kỳ vọng thành công; **hiện tại:** **422** · `fields.price` = `Expected number` | 🟢 | — | Spec — ❌ lệch thực tế (F-41) · PATCH /api/book/{id} → 200 / 422 (K-95) |
| REQ-BK-BOOK-138 | Sửa `price` tính lại giá bán | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-19` ✅ chốt là **lỗi**, F-36) | Sách không gắn khuyến mãi, `price` = `50000` → `PATCH {price: 70000}` → chi tiết `currentPrice` = `70000` (bằng `currentPrice` của sách **tạo thẳng** với `price` = `70000`). **Hiện tại:** `currentPrice` **giữ nguyên** giá trị lúc tạo | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-36) · PATCH → 200 · GET → 200 (K-87 · K-73) |
| REQ-BK-BOOK-141 | Sửa `categories` thay thế toàn bộ danh sách | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-BOOK-21` ✅ chốt là **lỗi**, F-37) | Sách có `categories` = `[c1]` → `PATCH {categories: [c2]}` → đọc lại `categories` = `[c2]` (**không** còn `c1`). **Hiện tại:** `[c2, c1]` — mảng gửi lên được **cộng thêm**, không thay thế; gửi lại cùng mảng vẫn 2 phần tử | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-37) · PATCH /api/book/{id} → 200 (K-90) |

### 3.12. Xoá sách (STORY-BK-BOOK-12)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-131 | Xoá sách thành công | | `DELETE /api/book/<id>` · Bearer hợp lệ → **200** · `msg` = `Deleted successfully.` · `GET /api/book/<id>` → **404** `Book not found.` · tìm theo tên → `total` = `0` | 🟢 | — | Spec + kiểm chứng thực tế · DELETE /api/book/{id} → 200 (K-102) |
| REQ-BK-BOOK-132 | Xoá sách khi không có / sai token bị từ chối | Spec **không khai** 401 cho `DELETE` | **Không** `Authorization` → **401** · `Missing or invalid Authorization header`. `Bearer abc.def.ghi` → **401** · `Unauthorized`. `GET /api/book/<id>` → **200** (sách còn) | 🟢 | — | Thực tế — spec không nói · DELETE /api/book/{id} → 401 (K-100) |
| REQ-BK-BOOK-133 | Xoá `id` không tồn tại, và xoá lần thứ hai, trả 404 | | `DELETE /api/book/khong_ton_tai_<T>` → **404** `Book not found.`. `DELETE` lần 2 cùng `id` vừa xoá → **404** | 🟢 | — | Spec + kiểm chứng thực tế · DELETE /api/book/{id} → 404 (K-101 · K-103) |
| REQ-BK-BOOK-134 | Người dùng đã đăng nhập xoá được sách của người khác | Hành vi hiện tại — **thiết kế** (`AMB-BK-01` ✅ · F-02) | Token `userB` · `DELETE` sách do `userA` tạo → **200** · `GET` → **404** | 🟢 | — | Thực tế — spec không nói · DELETE /api/book/{id} → 200 (K-102) · chỉ trên sách do phiên tạo |
| REQ-BK-BOOK-135 | Sách của người dùng đã bị xoá vẫn tồn tại với `auth` = `null` | Spec khai `auth` nullable (F-06) | (1) `userB` tạo sách · (2) xoá `userB` bằng token của chính nó · (3) danh sách **và** chi tiết của sách đó → **200** · `auth` = `null` · sách **không** bị xoá theo | 🟢 | — | Spec (`auth` nullable) + kiểm chứng thực tế · GET /api/book/{id} → 200 (K-104) |

### 3.13. Quy ước chung của module (STORY-BK-BOOK-13)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-BOOK-136 | Body lỗi kiểm tra dữ liệu có hình dạng `msg` + `fields` | Error envelope dùng chung cho 422 của `GET /api/book` · `POST /api/book` · `PATCH /api/book/{id}` · `GET /api/book/{id}` | Mọi response **422** ở REQ-57 · 59 · 61 · 62 · 65 · 66 · 80 · 91 · 92 · 94 · 96 → 98 · 102 · 103 · 107 · 120 · 122 · 124 là object có `msg` = `Invalid data.` (string) và `fields` (object) · mỗi khoá là **tên field vi phạm** (`_` khi không gắn field — REQ-57 · 61; `categories/0` khi lỗi ở phần tử mảng — REQ-98) và giá trị là **mảng string**. **Ngoại lệ đã biết:** `400` chỉ có `msg` (REQ-93 · 100 · 106 · 103) hoặc là chuỗi `Bad Request` (REQ-112) | 🟢 | — | Spec + kiểm chứng thực tế (K-05 · K-07 · K-10 · K-11 · K-14 · K-15 · K-30 · K-48 · K-49 · K-52 · K-54 · K-56 · K-61 · K-62 · K-86 · K-88 · K-89) |

---

## 4. Đặc tả Trường Dữ liệu (Field Spec)

`components.schemas` của spec **rỗng** — mọi schema khai inline.

### 4.1. Request

| Field (JSON path) | Vị trí | Kiểu | Required | Ràng buộc (spec) · Ràng buộc quan sát thêm | Operation dùng | REQ liên quan |
|---|---|---|---|---|---|---|
| `limit` | query | `number` / chuỗi `numeric` | ❌ | `default 10` · `minimum 1` · `maximum 10000` · phải là số nguyên (REQ-145 — hiện nhận `1.5`) | GET /api/book | 55 → 59 · 145 |
| `page` | query | `number` / chuỗi `numeric` | ❌ | `default 1` · `minimum 1` | GET /api/book | 55 · 60 → 63 |
| `search` | query | string | ❌ | `default ""`. Chuỗi thường (khớp tên · mô tả · slug) **hoặc** JSON điều kiện `AND` · `OR` · toán tử `contains` · `equals` · `in` · `some` · `gte` · `lte` trên `name` · `description` · `slug` · `status` · `price` · `currentPrice` · `categories` | GET /api/book | 67 → 76 · 146 |
| `sort` | query | string enum | ❌ | `default updatedAt` · 9 giá trị (REQ-64) | GET /api/book | 55 · 64 · 65 |
| `sortBy` | query | string enum | ❌ | `default desc` · `asc` · `desc` | GET /api/book | 55 · 66 |
| `id` | path | string | ✅ | cuid **hoặc** `slug` (REQ-78) | GET · PATCH · DELETE /api/book/{id} | 77 · 78 · 81 · 114 · 127 · 131 · 133 |
| `view` | query | boolean | ❌ | `true` · `false`; giá trị khác → 422 (REQ-80) | GET /api/book/{id} | 42 · 80 |
| `Authorization` | header | `Bearer <JWT>` | ✅ (POST · PATCH · DELETE) | ⚠️ spec **không khai** 401 cho `DELETE` | POST · PATCH · DELETE | 89 · 90 · 126 · 132 |
| `name` | body | string | ✅ (POST) · ❌ (PATCH) | Không khai `minLength`/`maxLength`. Quan sát: ≤ 191 ký tự · duy nhất không phân biệt hoa thường · rỗng phải bị từ chối (REQ-142) | POST · PATCH | 87 · 91 → 93 · 118 · 142 |
| `slug` | body | string | ❌ | Tự sinh từ `name` khi vắng · duy nhất · không kiểm định dạng | POST · PATCH | 85 → 88 · 125 |
| `description` | body | string | ❌ | Quan sát: ≤ 65.535 ký tự | POST · PATCH | 106 · 113 |
| `status` | body | enum `AVAILABLE` · `UNAVAILABLE` | ✅ (POST) · ❌ (PATCH) | `default AVAILABLE` ⚠️ (F-40) | POST · PATCH | 94 · 95 · 119 · 120 |
| `pictures` | body | mảng string | ❌ | Không kiểm tra tệp tồn tại | POST · PATCH | 107 · 108 |
| `categories` | body | mảng string | ✅ (POST) · ❌ (PATCH) | `minItems 1` · gộp trùng · mỗi tên ≤ 191 ký tự · tên **chưa có** sinh danh mục mới (REQ-52) · tên rỗng phải bị từ chối (REQ-143) · PATCH phải **thay thế** (REQ-141) | POST · PATCH | 52 · 96 → 100 · 124 · 141 · 143 |
| `price` | body | number | ✅ (POST) · ❌ (PATCH) | Spec: `default 50000` ⚠️ · `maximum 9e12` (sai). Đúng: **1.000 ≤ giá ≤ 100.000.000.000** (`AMB-BK-03` · `05` ✅), số lẻ giữ nguyên | POST · PATCH | 101 → 104 · 121 → 123 · 139 · 140 |
| `promotions` | body | mảng string (id khuyến mãi) | ❌ | Id không tồn tại → 404 | POST · PATCH | 109 |

### 4.2. Response thành công

| Field (JSON path) | Kiểu | Operation · status | Ghi chú | REQ liên quan |
|---|---|---|---|---|
| `list[]` | mảng object | GET /api/book 200 | 14 khoá (REQ-53) | 53 · 54 |
| `pagination.*` | number | GET /api/book 200 | `lengthData` = `list.length` (REQ-144) | 53 · 144 |
| `id` … `promotions` | — | GET /api/book/{id} 200 | 13 khoá, không `slug` (REQ-77) | 77 |
| `currentPrice` | number | GET 200 | = `price` khi không gắn khuyến mãi (REQ-137); không âm (REQ-51) | 51 · 137 · 138 |
| `auth` | object hoặc `null` | GET 200 | REQ-54 · REQ-135 | 54 · 135 |
| `msg` | string | POST · PATCH · DELETE | `Book created successfully.` · `Book updated successfully.` · `Deleted successfully.` | 83 · 114 · 131 |

---

## 5. Business Rules & Validation Messages

Body lỗi **nguyên văn** từ gọi thật 25-09-2026.

| REQ | Điều kiện | Status | Body lỗi nguyên văn |
|---|---|---|---|
| 57 | `limit=0` · `-1` · `page=0` | 422 | `{"msg":"Invalid data.","fields":{"_":["Expected number to be greater or equal to 1"]}}` |
| 57 | `limit=10001` | 422 | `{"msg":"Invalid data.","fields":{"_":["Expected number to be less or equal to 10000"]}}` |
| 59 · 62 | `limit=abc` · `page=abc` | 422 | `{"msg":"Invalid data.","fields":{"limit":["Property 'limit' should be one of: 'numeric', 'number'"]}}` |
| 65 | `sort` ngoài enum | 422 | `{"msg":"Invalid data.","fields":{"sort":["Expected kind 'UnionEnum'"]}}` |
| 76 | `search` trường / toán tử lạ | 400 | `{"msg":"Invalid filter or query syntax","error":"<chuỗi dài — lộ chi tiết nội bộ, KHÔNG chép>"}` |
| 80 | `view` sai kiểu | 422 | `{"msg":"Invalid data.","fields":{"view":["Property 'view' should be one of: 'boolean'…"]}}` |
| 81 · 127 · 133 | `id` không tồn tại | 404 | `{"msg":"Book not found."}` |
| 87 · 118 | trùng tên (kể cả HOA) | 400 | `{"msg":"Book name already exists."}` |
| 88 | trùng slug | **thực tế 400** (lệch) | `{"msg":"Book name already exists."}` |
| 89 · 126 · 132 | không `Authorization` | 401 | `{"msg":"Missing or invalid Authorization header"}` |
| 90 | `Bearer <rác>` · `Bearer ` | 401 | `{"msg":"Unauthorized"}` |
| 91 | thiếu `name` | 422 | `{"msg":"Invalid data.","fields":{"name":["Expected property 'name' to be string but found: undefined"]}}` |
| 92 | `name` = `123` | 422 | `…"name":["Expected property 'name' to be string but found: 123"]` |
| 93 · 100 · 103 · 106 · 139 | vượt giới hạn cột lưu trữ / giá tràn | 400 | `{"msg":"Invalid data."}` |
| 94 · 120 | `status` ngoài enum | 422 | `{"msg":"Invalid data.","fields":{"status":["Expected kind 'UnionEnum'"]}}` |
| 96 · 98 | thiếu `categories` · `categories` = chuỗi | 422 | `{"msg":"Invalid data.","fields":{"categories":["Expected array"]}}` |
| 97 · 124 | `categories` = `[]` | 422 | `{"msg":"Invalid data.","fields":{"categories":["Expected array length to be greater or equal to 1"]}}` |
| 98 | `categories` = `[123]` | 422 | `{"msg":"Invalid data.","fields":{"categories/0":["Expected property 'categories.0' to be string but found: 123"]}}` |
| 102 · 122 | `price` sai kiểu | 422 | `{"msg":"Invalid data.","fields":{"price":["Expected number"]}}` |
| 103 | `price` > 9.000.000.000.000 | 422 | `{"msg":"Invalid data.","fields":{"price":["Expected number to be less or equal to 9000000000000"]}}` |
| 107 | `pictures` = chuỗi | 422 | `{"msg":"Invalid data.","fields":{"pictures":["Expected array"]}}` |
| 109 | `promotions` id không tồn tại | 404 | `{"msg":"Promotion not found."}` |
| 112 | body JSON cắt cụt | 400 | `Bad Request` (chuỗi, không phải JSON) |
| 111 · 130 | `form` / `multipart` gửi `price` | 422 | `{"msg":"Invalid data.","fields":{"price":["Expected number"]}}` |

**Quy luật quan sát được:** lỗi kiểu/thiếu field → `422` + `Invalid data.` + `fields` · lỗi nghiệp vụ → `msg` là câu riêng · **giá trị vượt giới hạn cột lưu trữ** → `400` + `{"msg":"Invalid data."}` không `fields` (giống module `USER`). Mọi thông báo bằng **tiếng Anh**.

---

## 8. Luồng xử lý chính

### 8.1. Vòng đời sách qua API

```
POST /api/book (Bearer bất kỳ) ──200 (spec 201)──▶ {msg} (không trả id)
   │  categories chưa có → tạo danh mục mới (REQ-52)        │ tra id: GET /api/book?search={"name":{"contains":"<tên>"}}
   │  currentPrice = price áp MỌI khuyến mãi hiệu lực ⚠️      ▼
   ▼                                                  GET /api/book/{id|slug}[?view=true]  (công khai)
PATCH /api/book/{id} ──200 (spec 201)──▶ đổi name/status/price/slug/… 
   ⚠️ categories cộng dồn (F-37) · ⚠️ currentPrice không tính lại (F-36) · name đổi KHÔNG đổi slug
   ▼
DELETE /api/book/{id} ──200──▶ 404 khi đọc lại
   Xoá chủ sách (DELETE /api/user/{id}) ──▶ sách còn, auth = null (F-06)
```

### 8.2. Ai làm được gì

| Thao tác | Không token | Có token hợp lệ (bất kỳ người dùng đã đăng nhập) |
|---|---|---|
| `GET /api/book` · `GET /api/book/{id}` | ✅ 200 (REQ-01 · 79) | ✅ |
| `POST /api/book` | ❌ 401 (REQ-89) | ✅ |
| `PATCH /api/book/{id}` | ❌ 401 (REQ-126) | ✅ — kể cả sách của người khác (REQ-128) |
| `DELETE /api/book/{id}` | ❌ 401 (REQ-132) | ✅ — kể cả sách của người khác (REQ-134) |

---

## 9. Yêu cầu Phi chức năng (quan sát được)

| Hạng mục | Quan sát | Liên kết |
|---|---|---|
| Giá bán bất thường | `currentPrice` của **mọi** sách mới bị áp toàn bộ khuyến mãi đang hiệu lực (24 khuyến mãi lúc đo; tổng `PERCENTAGE` ≈ 8193,5 · tổng `FIXED_AMOUNT` = 289.000) → âm. Đối chiếu công thức khớp chính xác với 4 mức `price` | F-35 · `AMB-BK-BOOK-18` ✅ · REQ-51 · 137 |
| Giá bán không cập nhật | `PATCH price` không tính lại `currentPrice` | F-36 · REQ-138 |
| Ngưỡng `price` phụ thuộc khuyến mãi | `price` ≥ 27.000.000 → 400 (giá bán vượt giới hạn 32 bit) — ngưỡng đổi khi khuyến mãi đổi | F-42 · REQ-139 · `RISK-BK-BOOK-06` |
| Danh mục sinh tự động | Mỗi tên danh mục mới trong `categories` tạo một danh mục thật; xoá sách **không** xoá danh mục | REQ-52 · `RISK-BK-BOOK-07` |
| Chi tiết nội bộ trong body lỗi | Body `400` của bộ lọc mang thông tin máy chủ và thư viện truy cập dữ liệu | F-33 · REQ-146 |
| Giới hạn cột lưu trữ | `name` ≤ 191 · `description` ≤ 65.535 · tên danh mục ≤ 191 | REQ-93 · 100 · 106 |
| Thời gian phản hồi | Thao tác đơn lẻ ≈ 10 – 60 ms; `limit=10000` ≈ 0,2 s. **Không** đặt ngưỡng trong TC | — |
| Giới hạn tần suất | Không kiểm (không có căn cứ) | `AMB-BK-08` ✅ không có rate limiting |

---

## 12. Nhật ký kiểm chứng (Evidence)

Token · cookie · `id` đã che. `<T>` = timestamp của lượt chạy. Dữ liệu của sách có sẵn **không** ghi lại (chỉ hình dạng và số lượng).

### 12.1. Request đã gọi

| K | Request | Status | Trích body / header đáng chú ý | Dùng cho |
|---|---|---|---|---|
| K-01 | GET /api/book?limit=2&page=1 (không token) | 200 | `list` 2 phần tử · 14 khoá · `pagination` 4 khoá | 01 · 53 |
| K-02 | (như K-01) — đọc `auth` | 200 | phần tử 1: `null` · phần tử 2: `{name,email,avatarUrl}` | 54 |
| K-03 | GET /api/book (không tham số) | 200 | 10 phần tử · `currentPage` 1 · `lengthData` 10 · `updatedAt` giảm dần | 55 · 144 |
| K-04 | GET ?limit=2 | 200 | `totalPage` = ⌈total/2⌉ | 56 |
| K-05 | GET ?limit=0 · `-1` · `10001` | 422 | `fields._` (2 câu) | 57 · 136 |
| K-06 | GET ?limit=10000 | 200 | `list` = toàn bộ · `lengthData` = số sách · ≈ 0,2 s | 58 · 144 |
| K-07 | GET ?limit=abc | 422 | `fields.limit` | 59 |
| K-08 | GET ?limit=1.5 | 200 | `list` 1 phần tử | 145 |
| K-09 | GET ?limit=2&page=1 · `page=2` | 200 ×2 | giao nhau 0 · `currentPage` 2 | 60 |
| K-10 | GET ?page=0 | 422 | `fields._` | 61 |
| K-11 | GET ?page=abc | 422 | `fields.page` | 62 |
| K-12 | GET ?page=999999&limit=5 | 200 | `list` rỗng · `currentPage` 999999 · `lengthData` 0 | 63 · 144 |
| K-13 | GET ?sort=<9 giá trị>&sortBy=asc/desc | 200 ×18 | đúng chiều với 5 cột số / ngày | 64 |
| K-14 | GET ?sort=khong_hop_le · `id` · `categories` | 422 | `Expected kind 'UnionEnum'` | 65 |
| K-15 | GET ?sortBy=up | 422 | | 66 |
| K-16 | search `name contains` (thường · HOA) | 200 ×2 | 1 phần tử | 67 |
| K-17 | search `description` · `slug contains` | 200 ×2 | 1 phần tử | 68 |
| K-18 | search `categories some in` | 200 | 1 phần tử | 69 |
| K-19 | search `status equals` AVAILABLE · UNAVAILABLE | 200 ×2 | 4 · 0 | 70 |
| K-20 | search `price gte` · `gte+lte` | 200 ×2 | 3 · 2 | 71 |
| K-21 | search `currentPrice gte+lte` | 200 | mọi phần tử trong khoảng | 72 |
| K-22 | search `OR` 2 tên | 200 | 2 phần tử | 73 |
| K-23 | search chuỗi thường: tên HOA · mô tả · slug · danh mục | 200 ×4 | 1 · 1 · 1 · **0** | 74 |
| K-24 | search `{"name":` · `search=` | 200 ×2 | 0 · tất cả | 75 |
| K-25 | search trường lạ · toán tử `regex` | 400 ×2 | `{msg:"Invalid filter or query syntax", error:<string>}` — `error` chứa đường dẫn máy chủ và tên thư viện | 76 · 146 |
| K-27 | GET /api/book/<id> | 200 | 13 khoá · **không** `slug` · `promotions[]` có `id` | 77 |
| K-28 | GET /api/book/<slug> · `?view=true` | 200 | `id` khớp · `viewCount` +1 | 78 |
| K-29 | GET list · detail + `Bearer abc.def.ghi` | 200 ×2 | | 79 |
| K-30 | GET /api/book/<id>?view=abc · `1` · `TRUE` · `` | 422 ×4 | `fields.view` | 80 |
| K-31 | GET /api/book/khong_ton_tai_<T> (± `?view=true`) | 404 ×2 | `Book not found.` | 81 |
| K-32 | GET chi tiết sách không có `pictures` | 200 | `picture` 1 phần tử rỗng · danh sách `[]` | 82 |
| K-33 | GET ?view=true ×3 · `view=false` · không `view` | 200 | `viewCount` 0 → 1 → 3 → 3 → 3; response của lần `view=true` mang giá trị **sau** khi tăng | 42 |
| K-40 | POST /api/book không token — body hợp lệ · `{}` | 401 · 422 | `Missing…` · `fields.name` + `fields.categories` · không tạo sách | 89 |
| K-41 | POST /api/book — `Bearer abc.def.ghi` · `Bearer ` | 401 ×2 | `Unauthorized` | 90 |
| K-42 | POST /api/book hợp lệ | **200** | `{"msg":"Book created successfully."}` — không `id` | 83 · 52 |
| K-43 | GET chi tiết + danh sách sách vừa tạo · `GET /api/category-book` | 200 | dữ liệu khớp · `viewCount` 0 · `promotions` [] · `auth.email` = người tạo · danh mục tự gõ có mặt với `bookCount` 1 | 84 · 52 |
| K-44 | POST — không `slug`: tên thường · tên tiếng Việt | 200 ×2 | `auto-bookapi-ok-<T>` · `sach-ac-biet-an-ban-<T>` | 85 |
| K-45 | POST — `slug` tự đặt (thường · có dấu cách/HOA) | 200 ×2 | lưu nguyên văn | 86 |
| K-46 | POST — trùng tên (đúng · HOA) | 400 ×2 | `Book name already exists.` | 87 |
| K-47 | POST — tên mới, trùng slug | 400 | `Book name already exists.` | 88 |
| K-48 | POST — thiếu `name` | 422 | | 91 |
| K-49 | POST — `name: 123` | 422 | | 92 |
| K-50 | POST — `name: ""` | 400 | `Book name already exists.` (đã có sách tên rỗng) | 142 |
| K-51 | POST — `name` 191 · 192 · 255 · 1000 ký tự | 200 · 400 ×3 | `{"msg":"Invalid data."}` | 93 |
| K-52 | POST — `status` HACKED · `1` · `available` | 422 ×3 | | 94 |
| K-53 | POST — thiếu `status` | 200 | `status` = `AVAILABLE` | 95 |
| K-54 | POST — thiếu `categories` · `categories: "abc"` | 422 ×2 | `Expected array` | 96 · 98 |
| K-55 | POST — `categories: []` | 422 | | 97 |
| K-56 | POST — `categories: [123]` | 422 | khoá `categories/0` | 98 |
| K-57 | POST — `categories: [""]` | 200 | tạo được; `GET /api/category-book` có danh mục tên rỗng `bookCount` 0 | 143 |
| K-58 | POST — `categories: [c1, c1]` | 200 | 1 phần tử | 99 |
| K-59 | POST — tên danh mục 100 · 191 · 192 · 300 ký tự | 200 · 200 · 400 · 400 | | 100 |
| K-60 | POST — thiếu `price` | 200 | `price` = `50000` | 101 |
| K-61 | POST — `price` `"abc"` · `"50000"` · `null` | 422 ×3 | `Expected number` | 102 |
| K-62 | POST — `price` 9e12+1 · 1e20 | 422 ×2 | `…less or equal to 9000000000000` | 103 |
| K-63 | POST — `price` 0 · 999 · 1000 · −99999 | 200 ×4 | tạo được cả bốn | 104 |
| K-64 | POST — `price` 1500.5 · 1500.7 · 1500.2 | 200 ×3 | đọc lại `1500` (cả ba) | 140 |
| K-65 | POST — `price` 26.000.000 · 27.000.000 · 30.000.000 · 100.000.000 · 2.147.483.647 · 100.000.000.000 · −1.000.000.000 | 200 · 400 ×6 | 26.000.000 tạo được (`currentPrice` ≈ −2,1 tỷ) · từ 27.000.000 trở lên → `Invalid data.` | 103 · 139 |
| K-66 | POST — `description` 20.000 · 50.000 · 65.535 · 65.536 ký tự | 200 ×3 · 400 | | 106 |
| K-67 | POST — `pictures: "abc"` · `pictures: [đường dẫn không tồn tại]` | 422 · 200 | `picture` = `[]` | 107 · 108 |
| K-68 | POST — `promotions: ["khong_ton_tai_<T>"]` | 404 | `Promotion not found.` | 109 |
| K-69 | POST — thêm `id` · `viewCount` · `currentPrice` · `createdAt` · `auth` | 200 | đều bị bỏ qua | 110 |
| K-70 | POST — `x-www-form-urlencoded` · `multipart` (khoá lặp · `[]` · JSON) | 422 ×5 | `fields.price` = `Expected number` (thêm `categories` khi không phải khoá lặp) | 111 |
| K-71 | POST — JSON cắt cụt | 400 | `Bad Request` | 112 |
| K-72 | POST — `name` XSS · `description` SQL | 200 ×2 | lưu nguyên văn | 113 |
| K-73 | POST `price` 0 · 50.000 · 70.000 · 1.000.000 → đọc `currentPrice` · GET `/api/promotion-book` (chỉ đọc, tổng hợp số) | 200 | `currentPrice` = −289.000 · −4.335.750 · −5.954.450 · −81.224.000 → tuyến tính, khớp công thức với Σ khuyến mãi hiệu lực; sau `PATCH price 70000` sách 50.000 vẫn −4.335.750 | 137 · 138 · 51 |
| K-80 | PATCH không token · `Bearer abc.def.ghi` | 401 ×2 | sách không đổi | 126 |
| K-81 | PATCH `{name}` → đọc | 200 | `Book updated successfully.` · `name` đổi · `slug` giữ nguyên · GET theo slug cũ → 200 | 114 · 117 |
| K-82 | PATCH chỉ `name` | 200 | | 115 |
| K-83 | PATCH `{}` | 200 | | 116 |
| K-84 | PATCH — trùng tên sách khác · giữ nguyên tên | 400 · 200 | | 118 |
| K-85 | PATCH `status: UNAVAILABLE` | 200 | lưu `UNAVAILABLE` | 119 |
| K-86 | PATCH `status: HACKED` | 422 | | 120 |
| K-87 | PATCH `price: 70000` | 200 | `price` 70000 · `currentPrice` giữ nguyên | 121 · 138 |
| K-88 | PATCH `price` −1 · 9e12+1 · `"abc"` | 200 · 422 · 422 | `price` = −1 được lưu | 122 · 123 |
| K-89 | PATCH `categories: []` | 422 | | 124 |
| K-90 | PATCH `categories: [mới]` (2 lần) | 200 ×2 | `categories` = [mới, cũ] (2 phần tử) | 141 |
| K-91 | PATCH `slug` | 200 | lưu nguyên | 125 |
| K-92 | PATCH id không tồn tại | 404 | | 127 |
| K-93 | PATCH bằng token `userB` trên sách của `userA` | 200 | `name` đổi · `auth` vẫn là `userA` | 128 |
| K-94 | PATCH thêm `id` · `viewCount` · `currentPrice` | 200 | `id` · `viewCount` không đổi | 129 |
| K-95 | PATCH `description` form · multipart · `price` form | 200 · 200 · 422 | | 130 |
| K-100 | DELETE không token · `Bearer abc.def.ghi` | 401 ×2 | sách còn (GET 200) | 132 |
| K-101 | DELETE id không tồn tại | 404 | | 133 |
| K-102 | DELETE bằng token `userB` trên sách của `userA` → GET | 200 · 404 | `Deleted successfully.` | 131 · 134 |
| K-103 | DELETE lần 2 | 404 | | 133 |
| K-104 | `userB` tạo sách → xoá `userB` → GET danh sách · chi tiết | 200 ×2 | `auth` = `null` | 135 |

### 12.2. Dữ liệu test — tạo / dọn

| Lượt | Tạo | Dọn | Còn sót | Cách xác nhận |
|---|---|---|---|---|
| 1 (K-01 → K-104 chính) | 2 tài khoản · 25 sách · 26 danh mục | 2 · 25 · 26 | 0 | `GET /api/book?search={"name":{"contains":"<T>"}}` → `total` 0 · `GET /api/category-book` không còn tên chứa `<T>` |
| 2 · 3 · 5 (bổ sung: công thức giá · biên · slug) | 3 tài khoản · 21 sách · 14 danh mục | 3 · 21 · 14 | 0 | như trên |
| **Tổng** | **5 tài khoản · 46 sách · 40 danh mục** | **5 · 46 · 40** | **0 (danh mục tạo có tên chứa `<T>`)** | |

⚠️ **Có thể còn sót 1 danh mục tên rỗng** (`bookCount` = `0`) sinh ra từ lần thử `categories: [""]` (REQ-143): không xác định được nó đã có từ trước hay do lượt kiểm chứng tạo, và **không xoá được** qua `DELETE /api/category-book/{name}` (tên rỗng không tạo được đường dẫn) — đã ghi `RISK-BK-BOOK-08`; đội Dev xác minh. Không có sách hay danh mục **có sẵn** nào bị sửa/xoá. Khuyến mãi chỉ được đọc.
