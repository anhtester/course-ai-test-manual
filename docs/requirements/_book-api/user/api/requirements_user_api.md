# Đặc tả Yêu cầu — Module Người dùng (`USER`) · Nền tảng API

> Index module (metadata dải mã · REQ dùng chung · phân quyền · Story · AMB/RISK · Nhật ký): [../REQUIREMENTS_USER_SUMMARY.md](../REQUIREMENTS_USER_SUMMARY.md) · Danh mục hệ thống: [../../README.md](../../README.md) · Bản đồ API: [../../_discovery/api_map.md](../../_discovery/api_map.md) mục 2.2

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management API (mã hệ thống `BK`) |
| **Module** | Người dùng — tag `User Management` (`/api/user` · `/api/user/{id}`). Hồ sơ **của chính mình** (`/api/me` · `/api/profile`) thuộc module `AUTH` |
| **Nền tảng** | API |
| **Nguồn spec** | `https://book.anhtester.com/swagger/json` (trang `/swagger` là Scalar renderer) · snapshot 19-09-2026 [`openapi_2026-09-19.json`](../../_discovery/sources/openapi_2026-09-19.json) · `openapi: 3.0.0` · `info.version: 1.0.0` · `sha256 32bb8b39…3f09` — **tải lại 25-09-2026: `sha256` trùng, không thêm/bỏ/đổi operation nào** |
| **Môi trường gọi thử** | Production — 1 server duy nhất · **không** dùng chung (user chốt 14-08-2026) · `Gọi API: ✅` (user xác nhận 19-09-2026) · base URL + tài khoản ở `.env`, không ghi vào tài liệu |
| **Phương pháp** | Parse spec + **≈ 360 request gọi thật** ngày 25-09-2026 (4 lượt) trên **40 tài khoản do phiên tự tạo** `auto_userapi_<timestamp>_*` — đã xoá đủ 40 (mục 12.2). Không sửa/xoá bản ghi có sẵn nào; dữ liệu của người dùng có sẵn chỉ được **đọc** và **không** ghi lại vào tài liệu (danh sách công khai chứa email · điện thoại · địa chỉ thật) |
| **REQ trong file này** | **77** — `REQ-BK-USER-43` → `REQ-BK-USER-119` (`116` → `119` thêm sau khi chốt AMB — `DEMO-AMB-2509B`). 4 REQ `01` · `33` · `35` · `38` kiểm chứng khớp trên API → **chuyển lên index** (dùng chung `Web · API`), mã giữ nguyên |

---

## 2. Bản đồ phủ tài liệu

Không có tài liệu nghiệp vụ — toàn bộ REQ sinh từ **spec OpenAPI** và **kiểm chứng bằng gọi thật**; hành vi phía web đã có ở [`../web/requirements_user_web.md`](../web/requirements_user_web.md) được dùng để **đối chiếu** (tài liệu = ý định nghiệp vụ, spec = lời khai kỹ thuật, response thật = sự thật — skill 3.3).

| Vùng chức năng | Nguồn phủ | Mức phủ | REQ liên quan |
|---|---|---|---|
| Hình dạng request/response · tham số phân trang/sắp xếp/lọc | Spec — schema inline từng operation (`components.schemas` rỗng) | 🟩 Đầy đủ | 43 → 68 · 91 → 115 |
| Thông báo lỗi nguyên văn | Chỉ quan sát khi gọi thật — spec chỉ khai `msg: string` | 🟨 Thực tế | 47 · 49 · 51 · 52 · 55 · 56 · 65 · 73 → 81 · 84 · 87 · 94 · 96 · 117 |
| Bộ lọc JSON của `search` (`AND` · `OR` · toán tử) | **Không có trong spec** (`search` chỉ khai `type: string`) — web gửi khi dùng bộ lọc nâng cao, API nhận được | 🟨 Thực tế | 59 → 65 · 116 · `AMB-BK-USER-08` |
| Giới hạn độ dài thật | Spec **không** khai `maxLength` — server chặn ở 191 ký tự (`name`) | 🟨 Thực tế | 76 · 108 · `AMB-BK-USER-09` |
| Vòng đời phiên khi sửa/xoá người dùng | Spec có 1 câu mô tả mỗi operation (*"revoke old refresh tokens"* · *"remove all related refresh tokens"*) | 🟨 Thực tế — 1 vế khớp, 1 vế lệch | 109 · 113 · `AMB-BK-USER-11` |
| Phân quyền theo vai trò | Không có — `AMB-BK-01` ✅ chốt 25-09-2026: hệ thống **không** có mô hình vai trò | ⬜ Không áp dụng | 104 · 114 |

---

## Endpoint Catalog

| Method | Path | Auth (theo operation) | Status khai trong spec | Status thực tế đã quan sát | REQ bao phủ |
|---|---|---|---|---|---|
| GET | `/api/user` | 🌐 `security: []` | 200 · 400 · 422 · 500 | 200 · 400 · 422 — **500 chưa quan sát** | 01 (dùng chung) · 43 → 65 · 67 · 115 |
| POST | `/api/user` | 🔒 `BearerAuth` (kế thừa cấp gốc) | 201 · 400 · 422 — **spec không khai 401** | 201 · 400 · 401 · 422 | 33 · 35 (dùng chung) · 69 → 90 · 115 |
| GET | `/api/user/{id}` | 🌐 `security: []` | 200 · 404 | 200 · 404 | 66 → 68 |
| PATCH | `/api/user/{id}` | 🔒 `BearerAuth` (kế thừa cấp gốc) | 200 · 400 · 404 · 422 — **spec không khai 401** | 200 · 400 · 401 · 404 · 422 | 38 (dùng chung) · 91 → 109 · 115 |
| DELETE | `/api/user/{id}` | 🔒 `BearerAuth` (kế thừa cấp gốc) | 200 · 400 · 404 · 422 — **spec không khai 401** | 200 · 401 · 404 | 110 → 114 |

**5/5 operation có REQ.** Status `400` khai ở `PATCH`/`DELETE`/`POST` chỉ quan sát được ở điều kiện *"độ dài vượt giới hạn / JSON hỏng / mật khẩu rỗng"* (REQ 76 · 80 · 87 · 108) — không có điều kiện nào khác phát sinh 400 với `DELETE` (`AMB-BK-USER-17` ✅ — spec khai thừa). Status `500` của `GET /api/user` chưa quan sát được điều kiện phát sinh.

---

## 3. Yêu cầu Chức năng

> **Thang `Nguồn`** (skill 3.4.5): `Spec · …` (chưa gọi) · `Spec + kiểm chứng thực tế · … → <status>` · `Thực tế — spec không nói · … → <status>` · `Spec — ❌ lệch thực tế (F-nn)`. Mã `K-nn` trỏ tới request trong Nhật ký kiểm chứng (mục 12).
>
> **Trạng thái 🟢 là vòng đời của REQ, không phải kết quả test.** REQ ghi `❌ lệch thực tế` vẫn 🟢 — TC viết theo REQ sẽ FAIL cho tới khi PO trả lời AMB tương ứng (`@KnownBug`).
>
> Danh sách người dùng là **công khai** (`AMB-BK-02` ✅ cố ý) — mọi request đọc không gửi token. `<userA>` · `<userB>` = 2 tài khoản do TC tự tạo (BOLA — skill 3.4.4).

### 3.1. Danh sách · tìm kiếm · sắp xếp · phân trang (STORY-BK-USER-07)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-43 | Danh sách trả `list` và `pagination` đúng hình dạng | Response 200 của `GET /api/user` | Body có `list` (mảng) và `pagination` (object). Mỗi phần tử `list` có đủ 9 khoá `id` · `name` · `email` · `avatarUrl` · `phone` · `address` (string) · `isActive` (boolean) · `createdAt` · `updatedAt` (string ngày giờ). `pagination` có đủ 4 khoá `total` · `totalPage` · `currentPage` · `lengthData` (number) | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 200 (K-01) |
| REQ-BK-USER-44 | Danh sách và chi tiết không lộ mật khẩu hay khoá ngoài schema | Spec khai response chỉ có 9 khoá | Mỗi phần tử `list` (REQ-43) và body của `GET /api/user/{id}` (REQ-66) **chỉ** gồm 9 khoá đã liệt kê · **không** có khoá `password` hay bất kỳ khoá nào khác | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 200 (K-01 · K-27) |
| REQ-BK-USER-45 | Mặc định `limit`=10 · `page`=1 · sắp `updatedAt` giảm dần | Spec khai `default` cho 4 tham số | `GET /api/user` **không** tham số → **200** · `list` có **đúng 10** phần tử (khi tổng ≥ 10) · `pagination.currentPage` = `1` · `updatedAt` của các phần tử **không tăng** dọc theo `list` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 200 (K-02) |
| REQ-BK-USER-46 | `limit` cắt đúng số bản ghi và tính `totalPage` | | `limit=2&page=1` → **200** · `list` có **đúng 2** phần tử · `pagination.totalPage` = `⌈pagination.total / 2⌉` (đọc `total` từ chính response, **không** assert con số cụ thể — dữ liệu thay đổi) | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 200 (K-03) |
| REQ-BK-USER-47 | `limit` ngoài khoảng [1 ; 10000] bị từ chối | Spec khai `minimum: 1` · `maximum: 10000` | `limit=0` · `limit=-1` → **422** · `fields._` chứa `Expected number to be greater or equal to 1`. `limit=10001` → **422** · `fields._` chứa `Expected number to be less or equal to 10000`. Khoá lỗi là **`_`**, không phải `limit` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 422 (K-04 · K-05) |
| REQ-BK-USER-48 | `limit` = 10000 hợp lệ (biên trên) | | `limit=10000` → **200** · `list.length` = số người dùng hiện có (khi ≤ 10000) · `pagination.totalPage` = `1`. ⚠️ Trả **toàn bộ** người dùng kèm email · điện thoại · địa chỉ trong một request (`RISK-BK-USER-06`) — TC **không** ghi nội dung | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 200 (K-06) |
| REQ-BK-USER-49 | `limit` sai kiểu bị từ chối | Spec khai `numeric` hoặc `number` | `limit=abc` → **422** · `fields.limit` chứa `Property 'limit' should be one of: 'numeric', 'number'` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 422 (K-07) |
| REQ-BK-USER-50 | `page` chuyển sang trang khác trả bản ghi khác | | `limit=2&page=1` rồi `limit=2&page=2` → cả hai **200** · mỗi trang 2 phần tử · **không** có `id` nào xuất hiện ở cả hai trang · `pagination.currentPage` của lần 2 = `2` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 200 (K-09) |
| REQ-BK-USER-51 | `page` < 1 bị từ chối | Spec khai `minimum: 1` | `page=0` · `page=-1` → **422** · `fields._` chứa `Expected number to be greater or equal to 1` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 422 (K-10) |
| REQ-BK-USER-52 | `page` sai kiểu bị từ chối | | `page=abc` → **422** · `fields.page` chứa `Property 'page' should be one of: 'numeric', 'number'` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 422 (K-11) |
| REQ-BK-USER-53 | `page` vượt tổng số trang trả danh sách rỗng, không lỗi | Spec không khai | `page=999999&limit=5` → **200** · `list` là mảng **rỗng** · `pagination.currentPage` = `999999` | 🟢 | — | Thực tế — spec không nói · GET /api/user → 200 (K-12) |
| REQ-BK-USER-54 | `sort` nhận 7 giá trị, `sortBy` sắp đúng chiều | Spec khai `enum` | Với mỗi `sort` ∈ {`name` · `email` · `isActive` · `phone` · `address` · `createdAt` · `updatedAt`} × `sortBy` ∈ {`asc` · `desc`} → **200**. Chiều sắp **đã đối chiếu** với `createdAt` · `updatedAt` (4 tổ hợp) và `isActive` (`asc` → người dùng `false` đứng trước · `desc` → `false` đứng sau). 3 cột chuỗi `name` · `email` · `phone` · `address` mới đối chiếu **status**, chưa đối chiếu thứ tự (đối chiếu chuỗi phụ thuộc collation của máy chủ) | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 200 ×14 (K-13) |
| REQ-BK-USER-55 | `sort` ngoài enum bị từ chối | Kể cả cột nhạy cảm (`password`) hay khoá chính (`id`) | `sort=khong_hop_le` · `sort=password` · `sort=id` → **422** · `fields.sort` chứa `Expected kind 'UnionEnum'` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 422 (K-14) |
| REQ-BK-USER-56 | `sortBy` chỉ nhận `asc` hoặc `desc` | | `sortBy=up` → **422** · `fields.sortBy` chứa `Expected kind 'UnionEnum'` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 422 (K-15) |
| REQ-BK-USER-57 | `search` chuỗi thường khớp tên · email · điện thoại · địa chỉ, không phân biệt hoa thường | Chuỗi **không** phải JSON. Ô tìm kiếm của web dùng đúng cơ chế này (REQ-BK-USER-08) | `search=<email đầy đủ của userA>` → **200** · `list` có **đúng 1** phần tử, là `userA`. Lặp với email viết HOA toàn bộ, một phần **tên** (`Auto userapi_a <T>`), **điện thoại** duy nhất, **địa chỉ** duy nhất → mỗi lần `list` có đúng 1 phần tử là người dùng tương ứng | 🟢 | — | Thực tế — spec chỉ khai `type: string` · GET /api/user → 200 (K-16) |
| REQ-BK-USER-58 | `search` không có kết quả trả danh sách rỗng, không lỗi | | `search=khong_ton_tai_<T>` → **200** · `list` rỗng · `pagination.total` = `0`. `search=` (rỗng) → **200** · như không truyền `search` | 🟢 | — | Thực tế — spec không nói · GET /api/user → 200 (K-17) |
| REQ-BK-USER-59 | `search` JSON: một điều kiện với 5 toán tử | Bộ lọc nâng cao của web (REQ-BK-USER-13 · 15) gửi đúng dạng này | `search={"AND":[{"email":{"<op>":"…"}}]}` (URL-encode) với `<op>` ∈ {`equals` · `not` · `contains` · `startsWith` · `endsWith`} → **200** · kết quả đúng ngữ nghĩa toán tử: `equals` trả đúng `userA` · `startsWith` / `endsWith` / `contains` trả người dùng có email khớp tiền tố / hậu tố / chuỗi con (không phân biệt hoa thường với `contains`) · `not` **loại** `userA` | 🟢 | — | Thực tế — spec không nói · GET /api/user → 200 (K-18) |
| REQ-BK-USER-60 | `search` JSON: `AND` nhiều điều kiện là giao | | `search={"AND":[{"email":{"contains":"_<T>@auto.test"}},{"name":{"contains":"userapi_a"}}]}` → **200** · chỉ còn người dùng thoả **cả hai** (`userA`) | 🟢 | — | Thực tế — spec không nói · GET /api/user → 200 (K-19) |
| REQ-BK-USER-61 | `search` JSON: `OR` là hợp | | `search={"OR":[{"email":{"equals":"<email userA>"}},{"email":{"equals":"<email userB>"}}]}` → **200** · `list` có **đúng 2** phần tử (`userA` và `userB`) | 🟢 | — | Thực tế — spec không nói · GET /api/user → 200 (K-20) |
| REQ-BK-USER-62 | `search` JSON: lọc theo `isActive` (boolean) | | Điều kiện `{"isActive":{"equals":true}}` kết hợp `email contains _<T>@auto.test` → **200** · trả mọi người dùng `Active` của phiên; `{"isActive":{"equals":false}}` → `list` rỗng khi phiên không có người dùng Inactive | 🟢 | — | Thực tế — spec không nói · GET /api/user → 200 (K-21) |
| REQ-BK-USER-63 | `search` JSON: lọc theo ngày `createdAt` | | Điều kiện `{"createdAt":{"gte":"<ISO cách đây 1 giờ>"}}` kết hợp `email contains _<T>@auto.test` → **200** · trả người dùng vừa tạo. Chỉ đã thử `gte`; `lte` · `gt` · `lt` **chưa** thử | 🟢 | — | Thực tế — spec không nói · GET /api/user → 200 (K-22) |
| REQ-BK-USER-64 | `search` JSON sai cú pháp được coi là chuỗi thường | | `search={"AND":[{"email":` (JSON cắt cụt) → **200** · `list` rỗng · `pagination.total` = `0` — **không** lỗi 4xx | 🟢 | — | Thực tế — spec không nói · GET /api/user → 200 (K-23) |
| REQ-BK-USER-65 | `search` JSON tham chiếu trường hoặc toán tử không tồn tại bị từ chối | Spec khai `400` với `{msg, error}` | `search={"AND":[{"khong_co":{"contains":"a"}}]}` · `search={"AND":[{"email":{"regex":".*"}}]}` → **400** · body có đúng 2 khoá `msg` = `Invalid filter or query syntax` và `error` (string). ⚠️ Nội dung `error` **lộ chi tiết nội bộ** — xem `AMB-BK-USER-12` · F-33; TC **không** assert nội dung `error`, **không** chép vào báo cáo | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user → 400 (K-24) |

> Bổ sung sau khi chốt `AMB-BK-USER-08` · `12` · `14` (`DEMO-AMB-2509B`) — nối tiếp mã, cùng Story 07:

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-116 | Bộ lọc `search` chỉ nhận 9 trường công khai của người dùng | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-USER-08` ✅ chốt là **lỗi bảo mật**, F-32) | `search` JSON có điều kiện trên trường **không thuộc** 9 khoá của REQ-43 (kể cả trường nội bộ của bản ghi) → **400** · `msg` = `Invalid filter or query syntax` (như REQ-65). **Hiện tại:** trường nội bộ được chấp nhận và điều kiện được áp dụng (**200**) — **cần Dev xác minh**. TC chỉ kiểm **status**, **không** đọc / ghi lại nội dung trả về, **không** dò giá trị | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-32) · GET /api/user → 200 (K-25) |
| REQ-BK-USER-117 | Body lỗi 400 của bộ lọc không lộ thông tin nội bộ | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-USER-12` ✅ chốt là **lỗi**, F-33) | Body `400` của REQ-65: `error` **không** chứa đường dẫn thư mục của máy chủ (chuỗi bắt đầu bằng `/var/` · `/home/` · `/usr/` hoặc chứa `\`) và **không** chứa tên thư viện truy cập dữ liệu. **Hiện tại:** `error` chứa cả hai. TC **không** chép nội dung `error` vào báo cáo | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch (F-33) · GET /api/user → 400 (K-24) |
| REQ-BK-USER-118 | `lengthData` bằng số phần tử thực trả về | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-USER-14` ✅) | `pagination.lengthData` = `list.length` trong **mọi** response 200. **Hiện tại:** bằng `limit` yêu cầu (`limit=10000` → `10000`; `page` vượt tổng với `limit=5` → `5` trong khi `list` rỗng) — khác `GET /api/book` (đúng) | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch · GET /api/user → 200 (K-06 · K-12) |
| REQ-BK-USER-119 | `limit` phải là số nguyên | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-USER-14` ✅) | `limit=1.5` → **422** · `fields.limit` báo sai kiểu (như REQ-49). **Hiện tại:** **200**, `list` 1 phần tử, `lengthData` = `1.5` | 🟢 | 25-09-2026 · DEMO-AMB-2509B | Quyết định PO · DEMO-AMB-2509B — ❌ lệch · GET /api/user → 200 (K-08) |

### 3.2. Chi tiết người dùng (STORY-BK-USER-08)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-66 | Chi tiết người dùng trả đủ 9 khoá | | `GET /api/user/<id của userA>` **không** gửi `Authorization` → **200** · body có đủ 9 khoá như REQ-43 · `id` **bằng** `id` đã dùng · `email` **bằng** email của `userA` | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user/{id} → 200 (K-27) |
| REQ-BK-USER-67 | Endpoint đọc công khai bỏ qua header `Authorization` | Cả `GET /api/user` lẫn `GET /api/user/{id}` khai `security: []` | Gửi kèm `Authorization: Bearer abc.def.ghi` (token **không hợp lệ**) → vẫn **200** ở cả hai endpoint (**không** 401) | 🟢 | — | Spec (`security: []`) + kiểm chứng thực tế · → 200 (K-26 · K-29) |
| REQ-BK-USER-68 | `id` không tồn tại trả 404 | | `GET /api/user/khong_ton_tai_<T>` → **404** · `msg` = `User not found.`. Cùng kết quả với `id` chứa ký tự SQL (`' OR 1=1 --`) và `id` = một dấu cách (`%20`) — **không** 500, **không** lộ dữ liệu | 🟢 | — | Spec + kiểm chứng thực tế · GET /api/user/{id} → 404 (K-28) |

### 3.3. Tạo người dùng (STORY-BK-USER-09)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-69 | Tạo người dùng thành công | Body tối thiểu `name` + `email` | `POST /api/user` · `Authorization: Bearer <token hợp lệ>` · body `{name, email, password, phone, address}` → **201** · `msg` = `Created successfully.` · body **chỉ** có `msg` (**không** trả `id` — muốn `id` phải tra lại qua `GET /api/user?search=<email>`) | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/user → 201 (K-33) |
| REQ-BK-USER-70 | Người dùng vừa tạo đọc lại được với đúng dữ liệu | Tác tạo phải dùng được (skill 4.3.8) | Sau REQ-69 → `GET /api/user/<id>` → **200** · `name` · `email` · `phone` · `address` **bằng** giá trị đã gửi · `avatarUrl` = `""` khi không gửi · `createdAt` khác rỗng. Đăng nhập được bằng mật khẩu đã đặt là **REQ-35** (dùng chung) | 🟢 | — | Thực tế — spec không nói · GET /api/user/{id} → 200 (K-34) |
| REQ-BK-USER-71 | Tạo người dùng khi không có header xác thực hợp lệ bị từ chối | Spec **không khai** 401 ở operation này | Body **hợp lệ**, **không** gửi `Authorization` → **401** · `msg` = `Missing or invalid Authorization header` · không tạo tài khoản (`GET /api/user?search=<email>` → `pagination.total` = `0`). Cùng kết quả khi scheme không phải Bearer (`Authorization: Basic abc`) | 🟢 | — | Thực tế — spec không nói · POST /api/user → 401 (K-30 · K-32) |
| REQ-BK-USER-72 | Tạo người dùng với token không hợp lệ bị từ chối | | `Authorization: Bearer abc.def.ghi` hoặc `Authorization: Bearer ` (rỗng) → **401** · `msg` = `Unauthorized`. Khác REQ-71 ở `msg` | 🟢 | — | Thực tế — spec không nói · POST /api/user → 401 (K-32) |
| REQ-BK-USER-73 | Thiếu `name` bị từ chối | `name` là field bắt buộc | Body có `email` + `password`, **không** có khoá `name` (kể cả body `{}` hay không có body) → **422** · `fields.name` chứa `Expected property 'name' to be string but found: undefined` · không tạo tài khoản | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/user → 422 (K-36) |
| REQ-BK-USER-74 | `name` sai kiểu bị từ chối | | `name` = `123` (số) → **422** · `fields.name` chứa `to be string but found: 123` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/user → 422 (K-37) |
| REQ-BK-USER-75 | `name` rỗng bị từ chối | Kỳ vọng — **web đã chặn** (REQ-BK-USER-26 `Name is required.`), API **không** chặn (`AMB-BK-USER-10`) | `name` = `""` (các field khác hợp lệ) → **không** phải 201 (mặc định nghi là **lỗi**: hai nền tảng lệch nhau) · không tạo tài khoản. **Hiện tại:** **201** — tạo được tài khoản có tên rỗng | 🟢 | — | Thực tế — ❌ lệch web (`AMB-BK-USER-10`) · POST /api/user → 201 (K-38) |
| REQ-BK-USER-76 | `name` tối đa 191 ký tự | Spec **không khai** `maxLength`. **Web cho tới 250** (REQ-BK-USER-30) — `AMB-BK-USER-09` | `name` dài 1 · 50 · 100 · 120 · 191 ký tự → **201**. `name` dài ≥ 192 ký tự (đã đo 192 · 193 · 195 · 199 · 200 · 240 · 250 · 255 · 1000 · 5000 · 10000) → **400** · body **chỉ** `{"msg":"Invalid data."}` — **không** có `fields` (khác REQ-73 · 74 dùng 422 + `fields`) | 🟢 | — | Thực tế — spec không nói · POST /api/user → 201 / 400 (K-55) |
| REQ-BK-USER-77 | Thiếu `email` bị từ chối với lỗi thiếu field | `email` là field bắt buộc (`required`) | Body có `name` + `password`, **không** có khoá `email` → **422** · `fields.email` báo **thiếu field** · **không** tạo tài khoản | 🟢 | — | Spec — ❌ lệch thực tế (F-19): server gán `default` `user@example.com` rồi trả **422** `Email already exists.` vì tài khoản này có sẵn (K-39). **Chạy đúng 1 lần / lượt** |
| REQ-BK-USER-78 | `email` sai định dạng bị từ chối | `format: email` | `email` ∈ {`khong-phai-email` · `auto@` · `@auto.test` · `a@b@auto.test` · `co khoang@auto.test`} (các field khác hợp lệ) → **422** · `fields.email` chứa `Property 'email' should be email` · không tạo tài khoản. `email` = `null` → **422** · `fields.email` chứa `to be string but found: null` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/user → 422 (K-40 · K-41) |
| REQ-BK-USER-79 | Thiếu `password` bị từ chối | Kỳ vọng — **PO đã chốt** web đúng, API gán mật khẩu mặc định là lỗi (`AMB-BK-USER-02` ✅ · F-07) | Body có `name` + `email`, **không** có khoá `password` → **không** phải 201 · không tạo tài khoản. **Hiện tại:** **201**, và đăng nhập được bằng mật khẩu `anhtester.com` (đoán được — `default` khai trong spec) | 🟢 | — | Spec — ❌ lệch quyết định PO (F-07 · `AMB-BK-USER-02` ✅) · POST /api/user → 201 · POST /api/login → 200 (K-43) |
| REQ-BK-USER-80 | `password` rỗng không tạo được tài khoản | | `password` = `""` → **không** phải 201 · không tạo tài khoản. **Quan sát:** **400** · body chỉ `{"msg":"Invalid data."}` (không `fields`) — khác `422` của các lỗi kiểu ở REQ-81 (`4.3.9`: chưa loại trừ khả năng lỗi phát sinh sau tầng kiểm tra dữ liệu — AC **không** assert mã 400) | 🟢 | — | Thực tế — spec không nói · POST /api/user → 400 (K-44) |
| REQ-BK-USER-81 | `password` sai kiểu bị từ chối | | `password` = `null` hoặc `123456` (số) → **422** · `fields.password` chứa `to be string but found:` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/user → 422 (K-45) |
| REQ-BK-USER-82 | `isActive` mặc định là `true` | Spec **không khai** `default` cho `isActive` | Body **không** có `isActive` → **201** · `GET /api/user/<id>` → `isActive` = `true` · đăng nhập được | 🟢 | — | Thực tế — spec không nói · POST /api/user → 201 (K-34 · K-35) |
| REQ-BK-USER-83 | Tạo người dùng với `isActive=false` cho người dùng Inactive | Tác dụng: REQ-BK-AUTH-100 | Body có `isActive: false` → **201** · `GET /api/user/<id>` → `isActive` = `false` · `POST /api/login` với đúng mật khẩu → **403** · `msg` = `User account is disabled.` | 🟢 | — | Thực tế — spec không nói · POST /api/user → 201 · POST /api/login → 403 (K-47) |
| REQ-BK-USER-84 | `isActive` sai kiểu bị từ chối | | `isActive` = `"abc"` → **422** · `fields.isActive` chứa `Expected boolean` | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/user → 422 (K-48) |
| REQ-BK-USER-85 | `phone` · `address` · `avatarUrl` là chuỗi tự do, lưu nguyên | Không có kiểm định định dạng | `phone` = `chu-khong-phai-so` (hoặc 100 ký tự) · `address` 250 / 1000 / 2000 ký tự · `avatarUrl` = `not a url` → **201** · `GET /api/user/<id>` trả đúng giá trị đã gửi. **Không** có REQ về định dạng số điện thoại | 🟢 | — | Thực tế — spec không nói · POST /api/user → 201 (K-49) |
| REQ-BK-USER-86 | Tạo người dùng nhận đủ 3 content-type khai trong spec | Spec khai `application/json` · `application/x-www-form-urlencoded` · `multipart/form-data` | Cùng body hợp lệ theo từng content-type → **201** · `msg` = `Created successfully.` (`json` ✅ K-33 · `x-www-form-urlencoded` ✅ · `multipart/form-data` ✅). `Content-Type: text/plain` **không** được đọc — trả **422** như không có body | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/user → 201 (K-33 · K-50 · K-51) |
| REQ-BK-USER-87 | Body JSON sai cú pháp bị từ chối, body lỗi **không** phải JSON | Spec khai `400` với `{msg: string}` | Body `{"name":` (cắt cụt) → **400** · body là **chuỗi** `Bad Request` (không phải object JSON — **không** đọc được `msg`) | 🟢 | — | Spec — ❌ lệch thực tế: spec khai body `{msg}` nhưng thật là văn bản (K-52) |
| REQ-BK-USER-88 | Trường ngoài schema bị bỏ qua | Chống Mass Assignment | Body có thêm `id` = `custom-<T>` · `role` = `admin` · `isAdmin` = `true` · `createdAt` = `2000-01-01T00:00:00.000Z` → **201** · `GET /api/user/<id>`: `id` **do server sinh** (khác `custom-<T>`) · body **không** có khoá `role` / `isAdmin` · `createdAt` là thời điểm tạo (**không** phải năm 2000) | 🟢 | — | Thực tế — spec không nói · POST /api/user → 201 (K-53) |
| REQ-BK-USER-89 | Chuỗi tấn công và Unicode ở `name` lưu nguyên văn | Kiểm chống hồi quy (XSS · SQL injection) | `name` = `<script>alert(1)</script><T>` · `Robert'); DROP TABLE users;--<T>` · `Nguyễn Văn Ấn <T>` → **201** · `GET /api/user/<id>` → `name` **bằng đúng** chuỗi đã gửi (không mã hoá `&lt;`, không cắt, không mất dấu). **Không** 500 | 🟢 | — | Thực tế — spec không nói · POST /api/user → 201 (K-54) |
| REQ-BK-USER-90 | Không có token thì bị từ chối trước cả kiểm tra dữ liệu | Kỳ vọng — hiện **chưa đạt** (F-26, `AMB-BK-USER-15`) | **Không** gửi `Authorization` + body **sai** (`{}`) → **401** · `msg` = `Missing or invalid Authorization header` (REQ-71). **Hiện tại:** **422** `fields.name` — validate chạy **trước** rào xác thực. Body **hợp lệ** không token thì **đúng** 401 (REQ-71) | 🟢 | — | Thực tế — spec không nói — ❌ lệch (F-26) · POST /api/user → 422 (K-31) |

### 3.4. Sửa người dùng (STORY-BK-USER-10)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-91 | Cập nhật thành công khi gửi kèm `email` hiện tại | | `PATCH /api/user/<id>` · Bearer hợp lệ · body `{name: <tên mới>, email: <email hiện tại>}` → **200** · `msg` = `Updated successfully.` · `GET /api/user/<id>` → `name` = tên mới · `updatedAt` **khác** `createdAt` | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/user/{id} → 200 (K-62) |
| REQ-BK-USER-92 | Cập nhật một phần không cần gửi `email` | Spec khai **không** field nào `required` ở PATCH | Body **chỉ** `{name: <tên mới>}` → **200** và **chỉ** `name` đổi. Body `{}` → **200** (không đổi gì) | 🟢 | — | Spec — ❌ lệch thực tế (F-27): server gán `default` `user@example.com` → **422** `Email already exists.` cho **cả** hai body, dữ liệu **không** đổi (K-61) |
| REQ-BK-USER-93 | Đổi email sang email mới | | Body `{name, email: <email chưa dùng>}` → **200** · đăng nhập bằng email mới → **200** · đăng nhập bằng email **cũ** → **404** | 🟢 | — | Spec + kiểm chứng thực tế · PATCH → 200 · POST /api/login → 200 / 404 (K-66) |
| REQ-BK-USER-94 | Đổi sang email của người dùng khác bị từ chối | | `email` = email của `userB` → **422** · `msg` = `Email already exists.` · `fields.email` chứa `Email already exists.` | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/user/{id} → 422 (K-64) |
| REQ-BK-USER-95 | Gửi lại email của chính mình khác hoa/thường được chấp nhận | Kiểm trùng không tính chính bản ghi | `email` = email hiện tại viết **HOA** toàn bộ → **200** (**không** báo trùng với chính mình) | 🟢 | — | Thực tế — spec không nói · PATCH /api/user/{id} → 200 (K-65) |
| REQ-BK-USER-96 | `email` sai định dạng bị từ chối | `format: email` | `email` = `khong-phai-email` → **422** · `fields.email` chứa `Property 'email' should be email` · dữ liệu không đổi | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/user/{id} → 422 (K-63) |
| REQ-BK-USER-97 | Đổi mật khẩu: mật khẩu mới đăng nhập được | Người đổi **không cần biết mật khẩu cũ** (không có `password_old` ở operation này) | Body `{name, email, password: <mới>}` → **200** · `POST /api/login` với mật khẩu **mới** → **200** | 🟢 | — | Thực tế — spec không nói · PATCH /api/user/{id} → 200 · POST /api/login → 200 (K-68) |
| REQ-BK-USER-98 | Mật khẩu cũ bị từ chối sau khi đổi | Tác tạo phải dùng được (4.3.8) | Sau REQ-97 → `POST /api/login` với mật khẩu **cũ** → **400** · `msg` = `Invalid password.` | 🟢 | — | Thực tế — spec không nói · POST /api/login → 400 (K-68) |
| REQ-BK-USER-99 | `isActive=false` khoá đăng nhập | Tác dụng: REQ-BK-AUTH-100 | Body `{name, email, isActive: false}` → **200** · `GET /api/user/<id>` → `isActive` = `false` · `POST /api/login` đúng mật khẩu → **403** · `msg` = `User account is disabled.` | 🟢 | — | Thực tế — spec không nói · PATCH → 200 · POST /api/login → 403 (K-69) |
| REQ-BK-USER-100 | `isActive=true` mở lại đăng nhập | | Người dùng Inactive → body `{name, email, isActive: true}` → **200** · `POST /api/login` → **200** | 🟢 | — | Thực tế — spec không nói · PATCH → 200 · POST /api/login → 200 (K-69) |
| REQ-BK-USER-101 | `phone` · `address` · `avatarUrl` cập nhật được | | Body có `phone` = `0911111111` · `address` = `HCM` · `avatarUrl` → **200** · `GET /api/user/<id>` → `phone` · `address` **bằng** giá trị đã gửi | 🟢 | — | Thực tế — spec không nói · PATCH /api/user/{id} → 200 (K-70) |
| REQ-BK-USER-102 | Sửa người dùng khi không có / sai token bị từ chối | Spec **không khai** 401 | **Không** `Authorization` → **401** · `msg` = `Missing or invalid Authorization header`. `Bearer abc.def.ghi` → **401** · `msg` = `Unauthorized`. `GET /api/user/<id>` sau đó → dữ liệu **không đổi** | 🟢 | — | Thực tế — spec không nói · PATCH /api/user/{id} → 401 (K-60) |
| REQ-BK-USER-103 | Sửa `id` không tồn tại trả 404 | Kiểm `id` **trước** kiểm dữ liệu | Body đủ `{name, email}` **và** body chỉ `{name}` → cả hai **404** · `msg` = `User not found.` (**không** phải 422 của F-27) | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/user/{id} → 404 (K-71) |
| REQ-BK-USER-104 | Người dùng đã đăng nhập sửa được người dùng khác | Hành vi hiện tại — **thiết kế** (`AMB-BK-01` ✅: hệ thống không có vai trò · F-02) | Token của `userB` · `PATCH /api/user/<id của target do userA tạo>` body `{name, email}` → **200** · `GET` → `name` đã đổi | 🟢 | — | Thực tế — spec không nói · PATCH /api/user/{id} → 200 (K-74) · chỉ trên tài khoản do phiên tạo |
| REQ-BK-USER-105 | Người dùng sửa được chính mình qua API | **Web khoá** Edit chính mình (REQ-BK-USER-22) — `AMB-BK-USER-13` | Token của `userA` · `PATCH /api/user/<id của userA>` body `{name, email}` → **200** · token của `userA` **vẫn dùng được** (`GET /api/me` → **200**) | 🟢 | — | Thực tế — spec không nói · PATCH /api/user/{id} → 200 (K-75) |
| REQ-BK-USER-106 | Trường ngoài schema bị bỏ qua khi sửa | Chống Mass Assignment | Body có thêm `id` = `hacked` · `role` = `admin` → **200** · `GET /api/user/<id>`: `id` **không đổi** | 🟢 | — | Thực tế — spec không nói · PATCH /api/user/{id} → 200 (K-73) |
| REQ-BK-USER-107 | Sửa người dùng nhận đủ 3 content-type | | Cùng body `{name, email}` theo `application/json` · `x-www-form-urlencoded` · `multipart/form-data` → **200** · `msg` = `Updated successfully.` (cả 3 ✅) | 🟢 | — | Spec + kiểm chứng thực tế · PATCH /api/user/{id} → 200 (K-62 · K-72) |
| REQ-BK-USER-108 | `name` tối đa 191 ký tự khi sửa | Cùng giới hạn REQ-76 (`AMB-BK-USER-09`) | `name` dài 191 → **200**. `name` dài 192 · 250 → **400** · body chỉ `{"msg":"Invalid data."}` | 🟢 | — | Thực tế — spec không nói · PATCH /api/user/{id} → 200 / 400 (K-76) |
| REQ-BK-USER-109 | Sửa người dùng thu hồi refresh token cũ của họ | Spec: *"Update user information by ID **and revoke old refresh tokens**"* | **Trạng thái sạch (4.3.2):** (1) đăng nhập người dùng đích → giữ cookie `refetchToken` · (2) `POST /api/refetch-token` với cookie đó → **200** (cookie đang sống) · (3) `PATCH /api/user/<id>` (đổi mật khẩu; lặp với `isActive=false`) · (4) `POST /api/refetch-token` với **cùng** cookie → **không** phải 200 (kỳ vọng **404** `Invalid token.` như REQ-BK-AUTH-28) | 🟢 | — | Spec (`revoke old refresh tokens`) — ❌ lệch thực tế (F-34): bước 4 vẫn **200** và cấp access token mới — kể cả sau đổi mật khẩu và sau khoá tài khoản (K-77) |

### 3.5. Xoá người dùng (STORY-BK-USER-11)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-110 | Xoá người dùng thành công | | `DELETE /api/user/<id>` · Bearer hợp lệ → **200** · `msg` = `Deleted successfully.` · `GET /api/user/<id>` → **404** `User not found.` · `GET /api/user?search=<email>` → `pagination.total` = `0` | 🟢 | — | Spec + kiểm chứng thực tế · DELETE /api/user/{id} → 200 (K-82) |
| REQ-BK-USER-111 | Xoá người dùng khi không có / sai token bị từ chối | Spec **không khai** 401 | **Không** `Authorization` → **401** · `msg` = `Missing or invalid Authorization header`. `Bearer abc.def.ghi` → **401** · `msg` = `Unauthorized`. `GET /api/user/<id>` → **200** (người dùng **vẫn tồn tại**) | 🟢 | — | Thực tế — spec không nói · DELETE /api/user/{id} → 401 (K-80) |
| REQ-BK-USER-112 | Xoá `id` không tồn tại, và xoá lần thứ hai, trả 404 | | `DELETE /api/user/khong_ton_tai_<T>` → **404** · `msg` = `User not found.`. `DELETE` **lần 2** cùng `id` vừa xoá → **404** · `msg` = `User not found.` | 🟢 | — | Spec + kiểm chứng thực tế · DELETE /api/user/{id} → 404 (K-81 · K-83) |
| REQ-BK-USER-113 | Xoá người dùng xoá luôn refresh token của họ | Spec: *"Delete a user by ID **and remove all related refresh tokens**"* | **Trạng thái sạch (4.3.2):** (1) đăng nhập người dùng đích → giữ cookie `refetchToken` + access token · (2) `POST /api/refetch-token` → **200** · (3) xoá người dùng đó · (4) `POST /api/refetch-token` với **cùng** cookie → **404** · `msg` = `Invalid token.`. Kèm: `GET /api/me` với access token cũ → **401** · `msg` = `User no longer exists` (REQ-BK-AUTH-40) · `POST /api/login` → **404** | 🟢 | — | Spec + kiểm chứng thực tế · POST /api/refetch-token → 404 (K-84) |
| REQ-BK-USER-114 | Người dùng đã đăng nhập xoá được người dùng khác | Hành vi hiện tại — **thiết kế** (`AMB-BK-01` ✅ · F-02) | Token của `userB` · `DELETE /api/user/<id của target do userA tạo>` → **200** · `GET` → **404**. Chỉ dùng tài khoản do TC tự tạo — 🚫 không xoá tài khoản có sẵn | 🟢 | — | Thực tế — spec không nói · DELETE /api/user/{id} → 200 (K-82) |

### 3.6. Quy ước chung của module (STORY-BK-USER-12)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-115 | Body lỗi kiểm tra dữ liệu có hình dạng `msg` + `fields` | Error envelope dùng chung cho 422 của `GET /api/user` · `POST /api/user` · `PATCH /api/user/{id}` | Mọi response **422** ở REQ-47 · 49 · 51 · 52 · 55 · 56 · 73 · 74 · 78 · 81 · 84 · 94 · 96 là object có `msg` (string) và `fields` (object) · mỗi khoá của `fields` là **tên field vi phạm** (hoặc `_` khi giá trị không gắn field cụ thể — REQ-47 · 51) và giá trị là **mảng string**. `msg` = `Invalid data.` với lỗi kiểu/thiếu field; là câu riêng với lỗi nghiệp vụ (`Email already exists.`). **Ngoại lệ đã biết:** `400` chỉ có `msg` (REQ-76 · 80 · 108) hoặc là chuỗi `Bad Request` (REQ-87) | 🟢 | — | Spec + kiểm chứng thực tế (K-04 · K-05 · K-07 · K-10 · K-11 · K-14 · K-15 · K-36 · K-37 · K-41 · K-45 · K-48 · K-64 · K-63) |

---

## 4. Đặc tả Trường Dữ liệu (Field Spec)

`components.schemas` của spec **rỗng** — mọi schema khai inline. Cả 3 content-type của một operation dùng **cùng** schema.

### 4.1. Request

| Field (JSON path) | Vị trí | Kiểu | Required | Ràng buộc (spec) · Ràng buộc quan sát thêm | Operation dùng | REQ liên quan |
|---|---|---|---|---|---|---|
| `limit` | query | `number` hoặc chuỗi `numeric` | ❌ | `default 10` · `minimum 1` · `maximum 10000`. Phải là số nguyên (REQ-119 — hiện nhận số lẻ `1.5` → 200) | GET /api/user | 45 → 49 · 119 |
| `page` | query | `number` hoặc chuỗi `numeric` | ❌ | `default 1` · `minimum 1` | GET /api/user | 45 · 50 → 53 |
| `search` | query | string | ❌ | Spec chỉ khai `type: string`. **Quan sát:** chuỗi thường (khớp tên · email · điện thoại · địa chỉ) **hoặc** JSON điều kiện `{"AND":[…]}` / `{"OR":[…]}` với toán tử `equals` · `not` · `contains` · `startsWith` · `endsWith` · `gte`…. Trường được phép lọc: **chỉ 9 khoá công khai** (REQ-116 — hiện chưa được thực thi, `AMB-BK-USER-08` · F-32) | GET /api/user | 57 → 65 · 116 |
| `sort` | query | string enum | ❌ | `default updatedAt` · `name` · `email` · `isActive` · `phone` · `address` · `createdAt` · `updatedAt` | GET /api/user | 45 · 54 · 55 |
| `sortBy` | query | string enum | ❌ | `default desc` · `asc` · `desc` | GET /api/user | 45 · 54 · 56 |
| `id` | path | string | ✅ | cuid (F-15) | GET · PATCH · DELETE /api/user/{id} | 66 · 68 · 91 · 103 · 110 · 112 |
| `Authorization` | header | `Bearer <JWT>` | ✅ (POST · PATCH · DELETE) | `BearerAuth` · ⚠️ spec **không khai** 401 cho 3 operation này | POST · PATCH · DELETE | 71 · 72 · 102 · 111 |
| `name` | body | string | ✅ (POST) · ❌ (PATCH) | Spec không khai `minLength`/`maxLength`. **Quan sát:** rỗng được nhận (`AMB-BK-USER-10`) · tối đa **191** ký tự (`AMB-BK-USER-09`) | POST · PATCH | 73 → 76 · 91 · 108 |
| `email` | body | string | ✅ (POST) · ❌ (PATCH) | `format: email` · `default: "user@example.com"` ⚠️ (nguồn của F-19 · F-27) · so khớp không phân biệt hoa thường | POST · PATCH | 77 · 78 · 92 → 96 · 33 |
| `password` | body | string | ❌ | Spec (POST) khai `default: "anhtester.com"` ⚠️ (F-07) · PATCH không khai `default`. **Quan sát:** rỗng bị từ chối (400) · 1 ký tự và 1000 ký tự được nhận — **không** có chính sách (`AMB-BK-USER-16` · F-22) | POST · PATCH | 79 → 81 · 97 · 98 · 38 |
| `isActive` | body | boolean | ❌ | Không khai `default`; **quan sát** mặc định `true` | POST · PATCH | 82 → 84 · 99 · 100 |
| `avatarUrl` · `phone` · `address` | body | string | ❌ | Không ràng buộc; quan sát: `phone` 100 ký tự và `address` 2000 ký tự được nhận | POST · PATCH | 85 · 101 |

### 4.2. Response thành công

| Field (JSON path) | Kiểu | Operation · status | Ghi chú | REQ liên quan |
|---|---|---|---|---|
| `list[]` | mảng object | GET /api/user 200 | 9 khoá của REQ-43 | 43 · 44 |
| `pagination.total` · `totalPage` · `currentPage` · `lengthData` | number | GET /api/user 200 | `totalPage = ⌈total / limit⌉` · `lengthData` phải bằng số phần tử thực (REQ-118) — hiện bằng `limit` yêu cầu (`limit=10000` → `10000`; `page` vượt → `5` khi `limit=5`), khác `BOOK` | 43 · 46 · 53 · 118 |
| `id` · `name` · `email` · `avatarUrl` · `phone` · `address` · `isActive` · `createdAt` · `updatedAt` | string · boolean | GET /api/user/{id} 200 | `createdAt` · `updatedAt` là chuỗi ngày giờ ISO | 66 |
| `msg` | string | POST 201 · PATCH 200 · DELETE 200 | `Created successfully.` · `Updated successfully.` · `Deleted successfully.` — body **chỉ** có `msg` | 69 · 91 · 110 |

---

## 5. Business Rules & Validation Messages

Body lỗi **nguyên văn** từ gọi thật 25-09-2026. Email của tài khoản test là hình thái `auto_userapi_<T>_<x>@auto.test`.

| REQ | Điều kiện | Status | Body lỗi nguyên văn |
|---|---|---|---|
| 47 | `limit=0` · `limit=-1` | 422 | `{"msg":"Invalid data.","fields":{"_":["Expected number to be greater or equal to 1"]}}` |
| 47 | `limit=10001` | 422 | `{"msg":"Invalid data.","fields":{"_":["Expected number to be less or equal to 10000"]}}` |
| 49 | `limit=abc` | 422 | `{"msg":"Invalid data.","fields":{"limit":["Property 'limit' should be one of: 'numeric', 'number'"]}}` |
| 52 | `page=abc` | 422 | `{"msg":"Invalid data.","fields":{"page":["Property 'page' should be one of: 'numeric', 'number'"]}}` |
| 55 | `sort` ngoài enum | 422 | `{"msg":"Invalid data.","fields":{"sort":["Expected kind 'UnionEnum'"]}}` |
| 65 | `search` JSON trường / toán tử lạ | 400 | `{"msg":"Invalid filter or query syntax","error":"<chuỗi ≈ 1 nghìn ký tự — lộ chi tiết nội bộ, KHÔNG chép>"}` |
| 68 · 103 · 112 | `id` không tồn tại | 404 | `{"msg":"User not found."}` |
| 71 | không `Authorization` / scheme khác Bearer | 401 | `{"msg":"Missing or invalid Authorization header"}` |
| 72 | `Bearer <rác>` / `Bearer ` rỗng | 401 | `{"msg":"Unauthorized"}` |
| 73 | thiếu `name` | 422 | `{"msg":"Invalid data.","fields":{"name":["Expected property 'name' to be string but found: undefined"]}}` |
| 74 | `name` = `123` | 422 | `{"msg":"Invalid data.","fields":{"name":["Expected property 'name' to be string but found: 123"]}}` |
| 76 · 80 · 108 | `name` ≥ 192 ký tự · `password` rỗng | 400 | `{"msg":"Invalid data."}` |
| 77 | thiếu `email` | **thực tế 422** (lệch) | `{"msg":"Email already exists.","fields":{"email":["Email already exists."]}}` — do `default` `user@example.com` trùng tài khoản có sẵn (F-19) |
| 78 | `email` sai định dạng | 422 | `{"msg":"Invalid data.","fields":{"email":["Property 'email' should be email"]}}` |
| 78 | `email` = `null` | 422 | `{"msg":"Invalid data.","fields":{"email":["Expected property 'email' to be string but found: null"]}}` |
| 33 · 94 | email đã tồn tại (kể cả viết HOA) | 422 | `{"msg":"Email already exists.","fields":{"email":["Email already exists."]}}` |
| 81 | `password` = `null` | 422 | `{"msg":"Invalid data.","fields":{"password":["Expected property 'password' to be string but found: null"]}}` |
| 84 | `isActive` = `"abc"` | 422 | `{"msg":"Invalid data.","fields":{"isActive":["Expected boolean"]}}` |
| 87 | body JSON cắt cụt | 400 | `Bad Request` (chuỗi, không phải JSON) |
| 92 | PATCH thiếu `email` / body `{}` | **thực tế 422** (lệch) | `{"msg":"Email already exists.","fields":{"email":["Email already exists."]}}` (F-27) |
| 99 | đăng nhập tài khoản Inactive (`POST /api/login`) | 403 | `{"msg":"User account is disabled."}` |
| 109 | `GET /api/me` bằng access token của tài khoản đã bị khoá | 403 | `{"msg":"User account is disabled"}` — **không** có dấu chấm cuối, khác câu của login (không assert cả hai giống nhau) |
| 113 | `POST /api/refetch-token` với cookie của người dùng đã xoá | 404 | `{"msg":"Invalid token."}` |
| 113 | `GET /api/me` với access token của người dùng đã xoá | 401 | `{"msg":"User no longer exists"}` |

**Quy luật quan sát được:** lỗi kiểu/thiếu field → `422` + `msg` = `Invalid data.` + `fields` · lỗi nghiệp vụ → `msg` là câu riêng · lỗi **giá trị vượt giới hạn cột lưu trữ** (độ dài, mật khẩu rỗng) → `400` + `{"msg":"Invalid data."}` **không** `fields`. Mọi thông báo bằng **tiếng Anh**.

---

## 8. Luồng xử lý chính

### 8.1. Vòng đời người dùng qua API

```
POST /api/user (Bearer bất kỳ) ──201──▶ {msg} (không trả id)
        │                                   │ tra id: GET /api/user?search=<email>
        ▼                                   ▼
 isActive = true (mặc định)          PATCH /api/user/{id}  ──200──▶ đổi name/email/password/isActive/phone/address
        │                                   │  ⚠️ cần gửi kèm `email` (F-27) · ⚠️ KHÔNG thu hồi refresh token (F-34)
        │                                   ▼
        │                            isActive=false ──▶ POST /api/login → 403 · GET /api/me (token cũ) → 403
        ▼
 DELETE /api/user/{id} ──200──▶ refresh token bị xoá (refetch → 404) · access token cũ → 401 `User no longer exists`
                                 ⚠️ sách của người dùng đó còn lại với `auth: null` (F-06 — module BOOK)
```

### 8.2. Ai làm được gì

| Thao tác | Không token | Có token hợp lệ (bất kỳ người dùng đã đăng nhập) | Ghi chú |
|---|---|---|---|
| `GET /api/user` · `GET /api/user/{id}` | ✅ 200 (REQ-01 · 67) | ✅ | Công khai — lộ email · điện thoại · địa chỉ (F-01 · `AMB-BK-02` ✅ cố ý) |
| `POST /api/user` | ❌ 401 (REQ-71) | ✅ 201 | Không kiểm vai trò |
| `PATCH /api/user/{id}` | ❌ 401 (REQ-102) | ✅ 200 — **kể cả người dùng khác và đổi mật khẩu của họ** (REQ-97 · 104) | F-02 · `AMB-BK-01` ✅ thiết kế |
| `DELETE /api/user/{id}` | ❌ 401 (REQ-111) | ✅ 200 — kể cả người dùng khác (REQ-114) | F-02 |

---

## 9. Yêu cầu Phi chức năng (quan sát được)

| Hạng mục | Quan sát | Liên kết |
|---|---|---|
| Lộ dữ liệu cá nhân công khai | `GET /api/user` trả email · điện thoại · địa chỉ của **mọi** người dùng; `limit=10000` lấy toàn bộ trong 1 request (≈ 0,3 s) | F-01 · `AMB-BK-02` ✅ · `RISK-BK-USER-06` |
| Trường nội bộ trong bộ lọc | Bộ lọc JSON của `search` chấp nhận cả trường **không thuộc** 9 khoá công khai của response — **cần Dev xác minh** (chi tiết kỹ thuật cố ý không ghi trong tài liệu) | F-32 · `AMB-BK-USER-08` ✅ · REQ-116 |
| Chi tiết nội bộ trong body lỗi | Body `400` của bộ lọc sai cú pháp mang chuỗi `error` dài (≈ 1 nghìn ký tự) có thông tin về máy chủ và thư viện truy cập dữ liệu | F-33 · `AMB-BK-USER-12` ✅ · REQ-117 |
| Thu hồi refresh token | Xoá người dùng thu hồi đúng; sửa người dùng (đổi mật khẩu · khoá tài khoản) **không** thu hồi | F-34 · `AMB-BK-USER-11` ✅ · REQ-109 · 113 |
| Chính sách mật khẩu | Không có — mật khẩu 1 ký tự và 1000 ký tự đều tạo được | F-22 · `AMB-BK-USER-16` ✅ |
| Giới hạn cột lưu trữ | `name` ≤ 191 ký tự; vượt → `400` không `fields` | `AMB-BK-USER-09` ✅ · REQ-76 · 108 |
| Thời gian phản hồi | Mọi thao tác đơn lẻ ≈ 10 – 40 ms; thao tác có băm mật khẩu (POST tạo · PATCH đổi mật khẩu) ≈ 150 – 250 ms; `limit=10000` ≈ 0,3 s. **Không** đặt ngưỡng thời gian trong TC (chưa có yêu cầu hiệu năng) | — |
| Giới hạn tần suất | Không kiểm (không có căn cứ) | `AMB-BK-08` ✅ không có rate limiting |

---

## 12. Nhật ký kiểm chứng (Evidence)

Nhánh API thay ảnh bằng **request/response nguyên văn** (skill 3.4.7). Token · cookie · `id` đã che. `<T>` = timestamp của lượt chạy; `<userA>` · `<userB>` = tài khoản do lượt chạy tự tạo. Dữ liệu cá nhân của người dùng có sẵn **không** ghi lại (chỉ hình dạng và số lượng).

### 12.1. Request đã gọi

| K | Request | Status | Trích body / header đáng chú ý | Dùng cho |
|---|---|---|---|---|
| K-01 | GET /api/user?limit=2&page=1 (không token) | 200 | `list` 2 phần tử · 9 khoá · `pagination` 4 khoá number · không khoá `password` | 01 · 43 · 44 |
| K-02 | GET /api/user (không tham số) | 200 | `list` 10 phần tử · `currentPage` 1 · `updatedAt` giảm dần | 45 |
| K-03 | GET /api/user?limit=2 | 200 | `totalPage` = ⌈total/2⌉ | 46 |
| K-04 | GET /api/user?limit=0 · `limit=-1` · `page` tương tự | 422 | `fields._` = `Expected number to be greater or equal to 1` | 47 · 51 · 115 |
| K-05 | GET /api/user?limit=10001 | 422 | `fields._` = `Expected number to be less or equal to 10000` | 47 |
| K-06 | GET /api/user?limit=10000 | 200 | `list` = toàn bộ · `totalPage` 1 · `lengthData` 10000 · ≈ 0,3 s | 48 · 118 |
| K-07 | GET /api/user?limit=abc | 422 | `fields.limit` = `Property 'limit' should be one of: 'numeric', 'number'` | 49 |
| K-08 | GET /api/user?limit=1.5 | 200 | `list` 1 phần tử · `lengthData` = `1.5` | 119 |
| K-09 | GET ?limit=2&page=1 rồi `page=2` | 200 ×2 | mỗi trang 2 phần tử · giao nhau 0 · `currentPage` 2 | 50 |
| K-10 | GET /api/user?page=0 · `page=-1` | 422 | như K-04 | 51 |
| K-11 | GET /api/user?page=abc | 422 | `fields.page` = `Property 'page' should be one of: 'numeric', 'number'` | 52 |
| K-12 | GET /api/user?page=999999&limit=5 | 200 | `list` rỗng · `currentPage` 999999 · `lengthData` 5 | 53 · 118 |
| K-13 | GET ?sort=<7 giá trị>&sortBy=asc/desc | 200 ×14 | thứ tự đúng với `createdAt` · `updatedAt` · `isActive` | 54 |
| K-14 | GET ?sort=khong_hop_le · `password` · `id` | 422 | `fields.sort` = `Expected kind 'UnionEnum'` | 55 · 115 |
| K-15 | GET ?sortBy=up | 422 | `fields.sortBy` = `Expected kind 'UnionEnum'` | 56 |
| K-16 | GET ?search=<email · HOA · tên · phone · address của userA> | 200 ×5 | mỗi lần `list` 1 phần tử đúng người | 57 |
| K-17 | GET ?search=khong_ton_tai_<T> · `search=` | 200 | `total` 0 · `search` rỗng = như không truyền | 58 |
| K-18 | GET ?search={"AND":[{"email":{op:…}}]} × 5 toán tử | 200 | `equals` · `startsWith` · `contains` → userA · `endsWith` → 2 · `not` loại userA | 59 |
| K-19 | search JSON `AND` 2 điều kiện | 200 | 1 phần tử (userA) | 60 |
| K-20 | search JSON `OR` 2 email | 200 | 2 phần tử | 61 |
| K-21 | search JSON `isActive` true / false | 200 | true → 2 · false → 0 | 62 |
| K-22 | search JSON `createdAt gte` | 200 | 2 phần tử | 63 |
| K-23 | search=`{"AND":[{"email":` | 200 | `list` rỗng · `total` 0 | 64 |
| K-24 | search JSON trường lạ · toán tử `regex` | 400 | `{msg:"Invalid filter or query syntax", error:<string>}` | 65 · 117 |
| K-25 | search JSON có điều kiện trên trường không thuộc 9 khoá công khai | 200 | điều kiện được áp dụng — **cần Dev xác minh**, không ghi chi tiết | 116 · F-32 |
| K-26 | GET /api/user?limit=1 + `Bearer abc.def.ghi` | 200 | như K-01 | 67 |
| K-27 | GET /api/user/<id userA> (không token) | 200 | 9 khoá · `id` khớp · không `password` | 44 · 66 |
| K-28 | GET /api/user/khong_ton_tai_<T> · id SQL · `%20` | 404 | `{"msg":"User not found."}` | 68 |
| K-29 | GET /api/user/<id> + `Bearer abc.def.ghi` | 200 | | 67 |
| K-30 | POST /api/user — không token, body hợp lệ | 401 | `Missing or invalid Authorization header` · không tạo (total 0) | 71 |
| K-31 | POST /api/user — không token, body `{}` | 422 | `fields.name` | 90 |
| K-32 | POST /api/user — `Bearer abc.def.ghi` · `Bearer ` · `Basic abc` | 401 | `Unauthorized` · `Unauthorized` · `Missing or invalid Authorization header` | 71 · 72 |
| K-33 | POST /api/user [json] `name,email,password,phone,address,avatarUrl:""` | 201 | `{"msg":"Created successfully."}` — không `id` | 69 · 86 |
| K-34 | GET /api/user/<id> vừa tạo | 200 | dữ liệu khớp · `isActive` true · `avatarUrl` `""` · không `password` | 70 · 82 |
| K-35 | POST /api/login tài khoản vừa tạo | 200 | | 35 · 82 |
| K-36 | POST /api/user — thiếu `name` · body `{}` · không body | 422 | `fields.name` = `Expected property 'name' to be string but found: undefined` | 73 |
| K-37 | POST /api/user — `name: 123` | 422 | `…but found: 123` | 74 |
| K-38 | POST /api/user — `name: ""` | 201 | tạo được tài khoản tên rỗng | 75 |
| K-39 | POST /api/user — thiếu `email` | 422 | `Email already exists.` | 77 |
| K-40 | POST /api/user — `email: null` | 422 | `fields.email` = `…but found: null` | 78 |
| K-41 | POST /api/user — 5 email sai định dạng | 422 ×5 | `Property 'email' should be email` | 78 |
| K-42 | POST /api/user — email userA (đúng · HOA) | 422 ×2 | `Email already exists.` · userA vẫn đăng nhập được (200) | 33 |
| K-43 | POST /api/user — không `password` → login `anhtester.com` | 201 → 200 | | 79 |
| K-44 | POST /api/user — `password: ""` | 400 | `{"msg":"Invalid data."}` | 80 |
| K-45 | POST /api/user — `password: null` · `123456` | 422 | `fields.password` | 81 |
| K-46 | POST /api/user — `password` 1 · 73 · 1000 ký tự | 201 ×3 | không có chính sách | `AMB-BK-USER-16` |
| K-47 | POST /api/user — `isActive: false` → detail → login | 201 · 200 · 403 | `isActive` `false` · `User account is disabled.` | 83 |
| K-48 | POST /api/user — `isActive: "abc"` | 422 | `fields.isActive` = `Expected boolean` | 84 |
| K-49 | POST /api/user — phone/address/avatarUrl tự do (đủ độ dài đã nêu) | 201 ×4 | lưu nguyên | 85 |
| K-50 | POST /api/user — `x-www-form-urlencoded` · `multipart/form-data` | 201 ×2 | | 86 |
| K-51 | POST /api/user — `text/plain` | 422 | như không body | 86 |
| K-52 | POST /api/user — JSON cắt cụt | 400 | body `Bad Request` (chuỗi) | 87 |
| K-53 | POST /api/user — thêm `id` · `role` · `isAdmin` · `createdAt` | 201 | `id` do server sinh · không `role`/`isAdmin` · `createdAt` = hiện tại | 88 |
| K-54 | POST /api/user — `name` XSS · SQL · tiếng Việt | 201 ×3 | đọc lại bằng đúng nguyên văn | 89 |
| K-55 | POST /api/user — `name` 1…191 · 192…10000 ký tự | 201 · 400 | 400 = `{"msg":"Invalid data."}` (biên: 191 ✅ · 192 ❌) | 76 |
| K-60 | PATCH /api/user/<id> — không token · `Bearer abc.def.ghi` | 401 ×2 | `Missing…` · `Unauthorized` · dữ liệu không đổi | 102 |
| K-61 | PATCH — chỉ `name` · body `{}` | 422 ×2 | `Email already exists.` · `name` không đổi | 92 |
| K-62 | PATCH — `name` + `email` hiện tại | 200 | `{"msg":"Updated successfully."}` · `name` đổi · `updatedAt` đổi | 91 · 107 |
| K-63 | PATCH — `email` sai định dạng | 422 | | 96 |
| K-64 | PATCH — `email` của userB | 422 | `Email already exists.` | 94 |
| K-65 | PATCH — `email` HOA của chính nó | 200 | | 95 |
| K-66 | PATCH — email mới → login email mới · cũ | 200 · 200 · 404 | | 93 |
| K-67 | PATCH — `password: ""` → login mật khẩu cũ | 200 · 200 | | 38 |
| K-68 | PATCH — `password` mới → login mới · cũ | 200 · 200 · 400 | `Invalid password.` | 97 · 98 |
| K-69 | PATCH — `isActive` false → login → true → login | 200 · 403 · 200 · 200 | | 99 · 100 |
| K-70 | PATCH — phone/address/avatarUrl | 200 | detail khớp | 101 |
| K-71 | PATCH — id không tồn tại (body đủ · thiếu email) | 404 ×2 | `User not found.` | 103 |
| K-72 | PATCH — form · multipart | 200 ×2 | | 107 |
| K-73 | PATCH — thêm `id` · `role` | 200 | `id` không đổi | 106 |
| K-74 | PATCH — token userB sửa user do userA tạo | 200 | `name` đổi | 104 |
| K-75 | PATCH — userA sửa chính mình → `GET /api/me` | 200 · 200 | token còn dùng | 105 |
| K-76 | PATCH — `name` 191 · 192 · 250 | 200 · 400 · 400 | | 108 |
| K-77 | login → cookie `refetchToken` → PATCH (đổi mật khẩu · khoá) → refetch cookie cũ | 200 | vẫn 200 + access token mới; `GET /api/me` bằng token của tài khoản đã khoá → 403 `User account is disabled` | 109 |
| K-80 | DELETE — không token · `Bearer abc.def.ghi` | 401 ×2 | user còn tồn tại | 111 |
| K-81 | DELETE — id không tồn tại | 404 | `User not found.` | 112 |
| K-82 | DELETE — token userB xoá user do userA tạo → GET | 200 · 404 | `Deleted successfully.` | 110 · 114 |
| K-83 | DELETE lần 2 cùng id | 404 | | 112 |
| K-84 | login → cookie → DELETE → refetch cookie · `GET /api/me` · login | 404 · 401 · 404 | `Invalid token.` · `User no longer exists` | 113 |

### 12.2. Dữ liệu test — tạo / dọn

| Lượt | Tạo | Dọn | Còn sót | Cách xác nhận |
|---|---|---|---|---|
| 1 (K-01 → K-84 chính) | 18 tài khoản `auto_userapi_<T>_*` | 18 (1 tài khoản xoá bằng token userB trong K-82 · 17 dọn cuối lượt) | 0 | `GET /api/user?search=auto_userapi_<T>` → `total: 0` |
| 2 · 3 · 4 (bổ sung: bộ lọc · biên · thu hồi token) | 7 · 13 · 2 | 7 · 13 · 2 | 0 | tìm theo hậu tố `_<T>@auto.test` → `total: 0` |
| **Tổng** | **40** | **40** | **0** | |

Tài khoản **Inactive** không đăng nhập được nên xoá bằng token của `userA` (cũng do phiên tạo). Không có bản ghi có sẵn nào bị sửa/xoá; tài khoản `user@example.com` (không do phiên tạo) chỉ **được nhắc tới** ở K-39, không thao tác.