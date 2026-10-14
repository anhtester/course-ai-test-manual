# Đặc tả Yêu cầu — Module Xác thực & Phiên đăng nhập (`AUTH`) · Nền tảng API

> Index module (metadata dải mã · ma trận phân quyền · Story · AMB/RISK · Nhật ký): [../REQUIREMENTS_AUTH_SUMMARY.md](../REQUIREMENTS_AUTH_SUMMARY.md) · Danh mục hệ thống: [../../README.md](../../README.md) · Bản đồ API: [../../_discovery/api_map.md](../../_discovery/api_map.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management API (mã hệ thống `BK`) |
| **Module** | Xác thực & Phiên đăng nhập — tag `Authentication Management` |
| **Nền tảng** | API |
| **Nguồn spec** | `https://book.anhtester.com/swagger/json` (trang `/swagger` là Scalar renderer) · snapshot 19-09-2026 [`openapi_2026-09-19.json`](../../_discovery/sources/openapi_2026-09-19.json) · `openapi: 3.0.0` · `info.version: 1.0.0` · `sha256 32bb8b39…3f09` |
| **Môi trường gọi thử** | Production — 1 server duy nhất · **không** dùng chung (user chốt 14-08-2026) · `Gọi API: ✅` (user xác nhận 19-09-2026) · base URL + tài khoản ở `.env`, không ghi vào tài liệu |
| **Phương pháp** | Parse spec + **101 request gọi thật** ngày 19-09-2026 (2 vòng: `K-01 → K-55` · `K-101 → K-145`, cộng 1 request dò trạng thái mật khẩu không đánh số), dùng **5 tài khoản tự đăng ký** `auto_auth_<timestamp>_*` — đã dọn cả 5 (mục 12.2) |
| **REQ trong file này** | **40** — `REQ-BK-AUTH-02` · `04 → 07` · `10` · `12` · `13` · `17 → 48`. Từ 19-09-2026, 8 REQ `01` · `03` · `08` · `09` · `11` · `14` · `15` · `16` kiểm chứng khớp trên Android → **chuyển lên index** (dùng chung `Android · API`), mã giữ nguyên |

---

## 2. Bản đồ phủ tài liệu

Không có tài liệu nghiệp vụ — toàn bộ REQ sinh từ **spec OpenAPI** và **kiểm chứng bằng gọi thật**.

| Vùng chức năng | Nguồn phủ | Mức phủ | REQ liên quan |
|---|---|---|---|
| Hình dạng request/response · `required` · `format` | Spec — schema inline từng operation (`components.schemas` rỗng) | 🟩 Đầy đủ | 01 → 48 |
| Thông báo lỗi nguyên văn | Chỉ quan sát khi gọi thật — spec chỉ khai `msg: string` | 🟨 Thực tế | 04 → 09 · 15 → 19 · 27 · 28 · 37 → 40 · 44 |
| Cookie phiên (`Set-Cookie`, cờ bảo mật) | Chỉ quan sát khi gọi thật — spec không khai header response | 🟨 Thực tế | 20 → 22 · 32 |
| Vòng đời phiên (thu hồi token, xoay vòng) | Spec chỉ có mô tả 1 câu mỗi operation | ⬜ Trắng | 33 · `AMB-BK-AUTH-02` · `06` · `07` |
| Chính sách mật khẩu · phân quyền theo vai trò | Không có | ⬜ Trắng | `AMB-BK-AUTH-08` · `AMB-BK-01` |

---

## Endpoint Catalog

| Method | Path | Auth (theo operation) | Status khai trong spec | Status thực tế đã quan sát | REQ bao phủ |
|---|---|---|---|---|---|
| POST | `/api/register` | 🌐 `security: []` | 201 · 400 · 422 | 201 · 422 — **400 chưa quan sát** | 01 → 10 · 48 |
| POST | `/api/login` | 🌐 `security: []` | 200 · 400 · 403 · 404 · 422 | 200 · 400 · 404 · 422 — **403 chưa quan sát** | 11 → 23 · 48 |
| POST | `/api/refetch-token` | 🌐 `security: []` — đọc cookie `refetchToken` | 200 · 400 · 404 · 422 | 200 · 404 · 422 — **400 chưa quan sát** | 24 → 28 · 48 |
| DELETE | `/api/logout` | 🔒 `BearerAuth` (kế thừa cấp gốc) | 200 · 400 · 401 · 403 · 404 · 422 | 200 · 401 | 29 → 33 |
| GET | `/api/me` | 🔒 `BearerAuth` (kế thừa cấp gốc) | 200 · 401 · 403 · 404 · 422 | 200 · 401 | 34 → 40 |
| PATCH | `/api/profile` | 🔒 `BearerAuth` (kế thừa cấp gốc) | 200 · 400 · 401 · 403 · 404 · 422 | 401 · 422 — **200 không đạt được với mọi body đã thử (F-16)** | 41 → 47 · 48 |

**6/6 operation có REQ.** Status khai mà chưa quan sát được điều kiện phát sinh → `AMB-BK-AUTH-11`.

---

## 3. Yêu cầu Chức năng

> **Thang `Nguồn`** (skill 3.4.5): `Spec · …` (chưa gọi) · `Spec + kiểm chứng thực tế · … → <status>` · `Thực tế — spec không nói · … → <status>` · `Spec — ❌ lệch thực tế (F-nn)`. Mã `K-nn` trỏ tới request trong Nhật ký kiểm chứng (mục 12).
>
> **Trạng thái 🟢 là vòng đời của REQ, không phải kết quả test.** REQ ghi `❌ lệch thực tế` vẫn 🟢 — TC viết theo REQ sẽ FAIL cho tới khi PO trả lời AMB tương ứng.

### 3.1. Đăng ký tài khoản (STORY-BK-AUTH-01)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-AUTH-02 | Đăng ký không cần token | Operation công khai | Gọi REQ-01 **không** gửi header `Authorization` → **201** (không phải 401) | 🟢 | — | Spec (`security: []`) + kiểm chứng thực tế · → 201 (K-01) |
| REQ-BK-AUTH-04 | Thiếu `name` bị từ chối | `name` là field bắt buộc | Body có `email` + `password`, **không** có khoá `name` → **422** · `fields.name` là mảng có ≥ 1 chuỗi | 🟢 | — | Spec + kiểm chứng thực tế · → 422 (K-04) |
| REQ-BK-AUTH-05 | Thiếu `email` bị từ chối với lỗi thiếu field | `email` là field bắt buộc (`required`) | Body có `name` + `password`, **không** có khoá `email` → **422** · `fields.email` báo **thiếu field** · **không** tạo tài khoản | 🟢 | — | Spec — ❌ lệch thực tế (F-19): server gán `default` `user@example.com` rồi trả 422 `Email already exists.` (K-05 · K-08) |
| REQ-BK-AUTH-06 | Thiếu `password` bị từ chối | `password` là field bắt buộc | Body có `name` + `email`, **không** có khoá `password` → **422** · `fields.password` là mảng có ≥ 1 chuỗi | 🟢 | — | Spec + kiểm chứng thực tế · → 422 (K-06) |
| REQ-BK-AUTH-07 | `email` sai định dạng bị từ chối | `format: email` | `email` = `khong-phai-email` (các field khác hợp lệ) → **422** · `fields.email` **chứa** `should be email` | 🟢 | — | Spec + kiểm chứng thực tế · → 422 (K-07) |
| REQ-BK-AUTH-10 | Đăng ký nhận đủ 3 content-type khai trong spec | Spec khai `application/json` · `application/x-www-form-urlencoded` · `multipart/form-data` | Cùng body hợp lệ gửi theo từng content-type → **201**. Biến thể: `json` ✅ K-01 · `x-www-form-urlencoded` ✅ K-02 · `multipart/form-data` ❔ chưa gọi | 🟢 | — | Spec + kiểm chứng thực tế (2/3 biến thể) · → 201 (K-01 · K-02) |

> ↑ `REQ-BK-AUTH-01` · `03` · `08` · `09` **đã chuyển lên index** [`../REQUIREMENTS_AUTH_SUMMARY.md` mục 3](../REQUIREMENTS_AUTH_SUMMARY.md#3-yêu-cầu-dùng-chung-android--api) ngày 19-09-2026 — kiểm chứng khớp trên Android, `Nền tảng` = `Android · API`. Mã giữ nguyên.

### 3.2. Đăng nhập (STORY-BK-AUTH-02)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-AUTH-12 | Đăng nhập không cần token | Operation công khai | Gọi REQ-11 **không** gửi `Authorization` → **200** | 🟢 | — | Spec (`security: []`) + kiểm chứng thực tế · → 200 (K-09) |
| REQ-BK-AUTH-13 | Access token từ đăng nhập dùng được cho endpoint cần xác thực | Tác tạo phải dùng được (skill 4.3.8) | `accessToken` của REQ-11 gửi qua `Authorization: Bearer <token>` tới `GET /api/me` → **200** · `email` trong body = email vừa đăng nhập | 🟢 | — | Thực tế — spec không nói · GET /api/me → 200 (K-17) |
| REQ-BK-AUTH-17 | Thiếu `email` bị từ chối với lỗi thiếu field | `email` là field bắt buộc | Body chỉ có `password`, **không** có khoá `email` → **422** · `fields.email` báo thiếu field | 🟢 | — | Spec — ❌ lệch thực tế (F-19): server gán `default` `user@example.com`, trả **400** `Invalid password.` (K-13) |
| REQ-BK-AUTH-18 | Thiếu `password` bị từ chối | | Body chỉ có `email` → **422** · `fields.password` là mảng có ≥ 1 chuỗi | 🟢 | — | Spec + kiểm chứng thực tế · → 422 (K-14) |
| REQ-BK-AUTH-19 | `email` sai định dạng bị từ chối | `format: email` | `email` = `khong-phai-email` → **422** · `fields.email` **chứa** `should be email` | 🟢 | — | Spec + kiểm chứng thực tế · → 422 (K-15) |
| REQ-BK-AUTH-20 | Cookie `refetchToken` được set với đủ cờ bảo mật | Refresh token chỉ sống trong cookie | Response REQ-11 có `Set-Cookie` tên `refetchToken` mang **đủ** `HttpOnly` · `Secure` · `SameSite=Strict` · `Path=/` · có `Max-Age` (giá trị bất thường — xem `AMB-BK-AUTH-10`, **không** assert giá trị) | 🟢 | — | Thực tế — spec không nói · → 200 (K-09 · K-10) · F-14 |
| REQ-BK-AUTH-21 | Cookie `accessToken` mang cùng giá trị với `accessToken` trong body | Login trả token qua 2 kênh | Response REQ-11 có `Set-Cookie` tên `accessToken` · giá trị cookie **bằng** `accessToken` trong body của **cùng** response | 🟢 | — | Thực tế — spec không nói · → 200 (K-09) |
| REQ-BK-AUTH-22 | Cookie `accessToken` có cờ `HttpOnly` · `Secure` · `SameSite` | **Yêu cầu bảo mật — PO đã chốt áp dụng (`AMB-BK-AUTH-04` ✅ 20-09-2026)**. Cookie chứa token đăng nhập phải không đọc được bằng JavaScript | Response REQ-11 · `Set-Cookie: accessToken=…` có **đủ** `HttpOnly` · `Secure` · `SameSite` | 🟢 | — | Thực tế — spec không nói · → ❌ cookie chỉ có `Path=/` (K-09 · F-03) |
| REQ-BK-AUTH-23 | Đăng nhập nhận đủ 3 content-type khai trong spec | | Cùng body hợp lệ theo từng content-type → **200**. Biến thể: `json` ✅ K-09 · `multipart/form-data` ✅ K-10 · `x-www-form-urlencoded` ❔ chưa gọi | 🟢 | — | Spec + kiểm chứng thực tế (2/3 biến thể) · → 200 (K-09 · K-10) |

> ↑ `REQ-BK-AUTH-11` · `14` · `15` · `16` **đã chuyển lên index** [`../REQUIREMENTS_AUTH_SUMMARY.md` mục 3](../REQUIREMENTS_AUTH_SUMMARY.md#3-yêu-cầu-dùng-chung-android--api) ngày 19-09-2026 — kiểm chứng khớp trên Android, `Nền tảng` = `Android · API`. Mã giữ nguyên.

### 3.3. Làm mới token & Đăng xuất (STORY-BK-AUTH-03)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-AUTH-24 | Làm mới token thành công bằng cookie `refetchToken` | | `POST /api/refetch-token` gửi header `Cookie: refetchToken=<giá trị từ REQ-20>` → **200** · body có đủ 3 khoá string `msg` (**chứa** `Refetch token successfully`) · `accessToken` (JWT) · `exp` | 🟢 | — | Spec + kiểm chứng thực tế · → 200 (K-120) |
| REQ-BK-AUTH-25 | Access token mới từ làm mới token dùng được | Tác tạo phải dùng được (4.3.8) | `accessToken` của REQ-24 gửi qua Bearer tới `GET /api/me` → **200** · `email` = tài khoản sở hữu cookie | 🟢 | — | Thực tế — spec không nói · → 200 (K-122) |
| REQ-BK-AUTH-26 | Làm mới token không cần header `Authorization` | Operation công khai, chỉ dựa vào cookie | REQ-24 **không** gửi `Authorization` → **200** | 🟢 | — | Spec (`security: []`) + kiểm chứng thực tế · → 200 (K-120) |
| REQ-BK-AUTH-27 | Thiếu cookie `refetchToken` bị từ chối | Cookie là tham số `required: true` | Không gửi cookie `refetchToken` (kể cả khi có Bearer hợp lệ) → **422** · `fields.refetchToken` **chứa** `Property 'refetchToken' is missing` | 🟢 | — | Spec + kiểm chứng thực tế · → 422 (K-40 · K-123) |
| REQ-BK-AUTH-28 | Cookie `refetchToken` không hợp lệ bị từ chối | | `refetchToken` = chuỗi rác → **404** · `msg` = `Invalid token.` | 🟢 | — | Spec + kiểm chứng thực tế · → 404 (K-41 · K-42) |
| REQ-BK-AUTH-29 | Đăng xuất thành công | | `DELETE /api/logout` với Bearer hợp lệ → **200** · `msg` **chứa** `Logout successfully` | 🟢 | — | Spec + kiểm chứng thực tế · → 200 (K-125 · K-130) |
| REQ-BK-AUTH-30 | Đăng xuất không có token bị từ chối | | Không gửi `Authorization` → **401** · body là object rỗng `{}` (đúng schema 401 khai trong spec — khác các endpoint khác có `msg`) | 🟢 | — | Spec + kiểm chứng thực tế · → 401 (K-43) |
| REQ-BK-AUTH-31 | Đăng xuất với token không hợp lệ bị từ chối | | `Authorization: Bearer <chuỗi rác>` → **401** · body `{}` | 🟢 | — | Spec + kiểm chứng thực tế · → 401 (K-133) |
| REQ-BK-AUTH-32 | Đăng xuất yêu cầu trình duyệt xoá cookie `refetchToken` | Khi request có gửi cookie `refetchToken` | REQ-29 kèm `Cookie: refetchToken=<hợp lệ>` → response có `Set-Cookie: refetchToken=` giá trị rỗng · `Max-Age=0`. **Không** kỳ vọng xoá cookie `accessToken` (quan sát: không xoá — `AMB-BK-AUTH-13`) | 🟢 | — | Thực tế — spec không nói · → 200 (K-130) |
| REQ-BK-AUTH-33 | Sau đăng xuất, `refetchToken` của phiên không còn làm mới được token | Đăng xuất phải kết thúc phiên phía server | **Trạng thái sạch (4.3.2):** (1) đăng nhập → lấy `refetchToken` · (2) REQ-24 với cookie đó → 200 (xác nhận cookie đang sống) · (3) REQ-29 kèm cookie đó · (4) REQ-24 lại với **cùng** cookie → **không** phải 200 (kỳ vọng 404 `Invalid token.` như REQ-28) | 🟢 | — | Spec (`Logout from the system`) — ❌ lệch thực tế (F-17): bước 4 vẫn **200** (K-127 · K-131) |

### 3.4. Thông tin & Hồ sơ người dùng hiện tại (STORY-BK-AUTH-04)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-AUTH-34 | Lấy thông tin người dùng hiện tại | | `GET /api/me` với Bearer hợp lệ → **200** · body có đủ khoá `id` · `name` · `email` · `avatarUrl` · `phone` · `address` (string) · `config` | 🟢 | — | Spec + kiểm chứng thực tế · → 200 (K-17 · K-111) |
| REQ-BK-AUTH-35 | Thông tin người dùng hiện tại không lộ khoá ngoài danh sách | Spec khai `additionalProperties: false` — nhất là không trả mật khẩu/băm | Body REQ-34 **chỉ** gồm 7 khoá đã liệt kê · **không** có khoá `password` hay khoá nào khác | 🟢 | — | Spec + kiểm chứng thực tế · → 200 (K-17) |
| REQ-BK-AUTH-36 | Thông tin trả về khớp dữ liệu đã đăng ký | | Đăng ký với `name` · `email` · `phone` · `address` → đăng nhập → REQ-34: 4 trường này **bằng** giá trị đã gửi · `id` là chuỗi không rỗng | 🟢 | — | Thực tế — spec không nói · → 200 (K-17) |
| REQ-BK-AUTH-37 | Lấy thông tin khi không có token bị từ chối | | Không gửi `Authorization` → **401** · `msg` = `Missing or invalid Authorization header` | 🟢 | — | Spec + kiểm chứng thực tế · → 401 (K-18) |
| REQ-BK-AUTH-38 | Lấy thông tin với token không hợp lệ bị từ chối | | `Authorization: Bearer <chuỗi rác>` → **401** · `msg` = `Unauthorized` | 🟢 | — | Spec + kiểm chứng thực tế · → 401 (K-19) |
| REQ-BK-AUTH-39 | Endpoint cần xác thực chỉ nhận token qua header `Authorization` | Cookie `accessToken` (REQ-21) **không** thay được header | Chỉ gửi `Cookie: accessToken=<token hợp lệ>`, **không** gửi `Authorization` → **401** · `msg` = `Missing or invalid Authorization header` | 🟢 | — | Thực tế — spec không nói · → 401 (K-20) |
| REQ-BK-AUTH-40 | Token của tài khoản đã bị xoá không còn dùng được | | (1) đăng nhập → lấy token · (2) REQ-34 → 200 · (3) xoá tài khoản đó · (4) REQ-34 với **cùng** token → **401** · `msg` = `User no longer exists` | 🟢 | — | Thực tế — spec không nói · → 401 (K-49 · K-142). Spec khai 404 cho `/api/me` nhưng không nói điều kiện → `AMB-BK-AUTH-11` |
| REQ-BK-AUTH-41 | Cập nhật tên hiển thị qua hồ sơ | | `PATCH /api/profile` Bearer hợp lệ, body `{ "name": "<tên mới>" }` → **200** · body có `msg` (string) | 🟢 | — | Spec — ❌ lệch thực tế (F-16): mọi body đều **422** `fields.fields` (K-22 · K-114 → K-118) |
| REQ-BK-AUTH-42 | Thông tin người dùng phản ánh tên đã cập nhật | Tác tạo phải dùng được (4.3.8) | Sau REQ-41 → REQ-34: `name` = tên mới | 🟢 | — | Spec — ❌ lệch thực tế (F-16): `name` không đổi (K-23 · K-119) |
| REQ-BK-AUTH-43 | Cập nhật hồ sơ khi không có token bị từ chối | | Không gửi `Authorization` → **401** · `msg` = `Missing or invalid Authorization header` | 🟢 | — | Spec + kiểm chứng thực tế · → 401 (K-21) |
| REQ-BK-AUTH-44 | Cập nhật hồ sơ với `email` sai định dạng bị từ chối | `format: email` | Body `{ "email": "khong-phai-email" }` → **422** · `fields.email` **chứa** `should be email` | 🟢 | — | Spec + kiểm chứng thực tế · → 422 (K-24) |
| REQ-BK-AUTH-45 | Đổi mật khẩu qua hồ sơ | Body có `password` (mới) + `password_old` (hiện tại) | `PATCH /api/profile` Bearer hợp lệ, `password` mới + `password_old` đúng → **200** | 🟢 | — | Spec — ❌ lệch thực tế (F-16): **422** `fields.fields` (K-32) |
| REQ-BK-AUTH-46 | Đăng nhập được bằng mật khẩu mới sau khi đổi | Tác tạo phải dùng được (4.3.8) | Sau REQ-45 → `POST /api/login` với mật khẩu mới → **200** | 🟢 | — | Spec — ❌ lệch thực tế (F-16): **400** vì mật khẩu chưa đổi (K-33) |
| REQ-BK-AUTH-47 | Mật khẩu cũ bị từ chối sau khi đổi | | Sau REQ-45 → `POST /api/login` với mật khẩu cũ → **400** `Invalid password.` | 🟢 | — | Spec — ❌ lệch thực tế (F-16): mật khẩu cũ vẫn **200** (K-34) |

### 3.5. Quy ước chung của module (STORY-BK-AUTH-05)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-AUTH-48 | Body lỗi kiểm tra dữ liệu có hình dạng `msg` + `fields` | Error envelope dùng chung cho 400/404/422 của `register` · `login` · `refetch-token` · `profile` | Mọi response 422 ở REQ-04 · 06 · 07 · 18 · 19 · 27 · 44 là object có `msg` (string) và `fields` (object) · mỗi khoá của `fields` **là tên field vi phạm**, giá trị là mảng string. Ngoại lệ đã biết: 404 của `refetch-token` chỉ có `msg` (đúng spec) | 🟢 | — | Spec + kiểm chứng thực tế (K-04 · K-06 · K-07 · K-14 · K-15 · K-40 · K-24). Phản ví dụ: body `fields.fields` của F-16 → khoá **không** phải tên field |

---

## 4. Đặc tả Trường Dữ liệu (Field Spec)

`components.schemas` của spec **rỗng** — mọi schema khai inline. Cả 3 content-type của một operation dùng **cùng** schema.

### 4.1. Request

| Field (JSON path) | Vị trí | Kiểu | Required | Ràng buộc (spec) | Operation dùng | REQ liên quan |
|---|---|---|---|---|---|---|
| `name` | body | string | ✅ | — (không `minLength`/`maxLength`) | POST /api/register | 01 · 04 |
| `email` | body | string | ✅ | `format: email` · `default: "user@example.com"` ⚠️ (xuất hiện từ snapshot 19-09-2026 — nguồn của F-19) | POST /api/register | 01 · 05 · 07 · 08 · 09 |
| `password` | body | string | ✅ | — (không chính sách độ dài/độ mạnh — `AMB-BK-AUTH-08`) | POST /api/register | 01 · 06 |
| `avatarUrl` · `phone` · `address` | body | string | ❌ | — | POST /api/register | 36 |
| `email` | body | string | ✅ | `format: email` · `default: "user@example.com"` ⚠️ | POST /api/login | 11 · 14 · 16 · 17 · 19 |
| `password` | body | string | ✅ | — | POST /api/login | 11 · 15 · 18 |
| `refetchToken` · `accessToken` | cookie | string | ❌ | Spec khai là tham số cookie của login nhưng **không** thấy ảnh hưởng tới kết quả | POST /api/login | — |
| `refetchToken` | cookie | string | ✅ | — | POST /api/refetch-token | 24 · 27 · 28 |
| `Authorization` | header | `Bearer <JWT>` | ✅ | `BearerAuth` — HTTP bearer, `bearerFormat: JWT` | GET /api/me · PATCH /api/profile · DELETE /api/logout | 30 · 31 · 37 · 38 · 39 · 43 |
| `refetchToken` · `accessToken` | cookie | string | ❌ | Có `refetchToken` thì response xoá cookie đó (REQ-32) | DELETE /api/logout | 32 · 33 |
| `name` | body | string | ❌ | — | PATCH /api/profile | 41 |
| `email` | body | string | ❌ | `format: email` · `default: "user@example.com"` ⚠️ | PATCH /api/profile | 44 · `AMB-BK-AUTH-12` |
| `password` · `password_old` | body | string | ❌ | Cả hai optional — quan hệ bắt buộc đi kèm chưa rõ (`AMB-BK-AUTH-05`) | PATCH /api/profile | 45 → 47 |
| `avatarUrl` · `phone` · `address` | body | string | ❌ | — | PATCH /api/profile | — (chặn bởi F-16) |
| `config` | body | tự do (không khai `type`) | ❌ | — (`AMB-BK-10`) | PATCH /api/profile | — |

### 4.2. Response thành công

| Field (JSON path) | Kiểu | Operation · status | Ghi chú | REQ liên quan |
|---|---|---|---|---|
| `msg` | string | register 201 · login 200 · refetch 200 · logout 200 · profile 200 | Nội dung quan sát ở mục 5 | 01 · 11 · 24 · 29 · 41 |
| `accessToken` | string (JWT) | login 200 · refetch-token 200 | Giá trị biến thiên theo phiên — chỉ assert **hình thái** | 11 · 13 · 24 · 25 |
| `exp` | string | login 200 · refetch-token 200 | Quan sát `6d` (F-11) — cấu hình, không assert giá trị | 11 · 24 |
| `id` · `name` · `email` · `avatarUrl` · `phone` · `address` | string | me 200 | `id` là cuid (F-15) · field không nhập trả `""` | 34 · 36 |
| `config` | tự do | me 200 | Tài khoản mới trả `{}` | 34 |

---

## 5. Business Rules & Validation Messages

Body lỗi **nguyên văn** từ gọi thật 19-09-2026. Email/tên của tài khoản test đã thay bằng hình thái.

| REQ | Điều kiện | Status | Body lỗi nguyên văn |
|---|---|---|---|
| 04 | register — thiếu `name` | 422 | `{"msg":"Invalid data.","fields":{"name":["Expected property 'name' to be string but found: undefined"]}}` |
| 05 | register — thiếu `email` | **thực tế 422** (lệch) | `{"msg":"Email already exists.","fields":{"email":["Email already exists."]}}` — do `default` `user@example.com` trùng một tài khoản có sẵn (F-19) |
| 04 · 06 | register — body `{}` | 422 | `{"msg":"Invalid data.","fields":{"name":["Expected property 'name' to be string but found: undefined"],"password":["Expected property 'password' to be string but found: undefined"]}}` — **không** có lỗi `email` (bằng chứng F-19) |
| 06 | register — thiếu `password` | 422 | `{"msg":"Invalid data.","fields":{"password":["Expected property 'password' to be string but found: undefined"]}}` |
| 07 | register — `email` sai định dạng | 422 | `{"msg":"Invalid data.","fields":{"email":["Property 'email' should be email"]}}` |
| 08 · 09 | register — email đã tồn tại (cả biến thể viết hoa) | 422 | `{"msg":"Email already exists.","fields":{"email":["Email already exists."]}}` |
| 15 | login — sai mật khẩu | 400 | `{"msg":"Invalid password.","fields":{"password":["Invalid password, please try again."]}}` |
| 16 | login — email chưa đăng ký / tài khoản đã xoá | 404 | `{"msg":"User not found.","fields":{"email":["Email not found, please register."]}}` |
| 17 | login — thiếu `email` | **thực tế 400** (lệch) | `{"msg":"Invalid password.","fields":{"password":["Invalid password, please try again."]}}` (F-19) |
| 18 | login — thiếu `password` | 422 | `{"msg":"Invalid data.","fields":{"password":["Expected property 'password' to be string but found: undefined"]}}` |
| 19 | login — `email` sai định dạng | 422 | `{"msg":"Invalid data.","fields":{"email":["Property 'email' should be email"]}}` |
| 27 | refetch-token — thiếu cookie | 422 | `{"msg":"Invalid data.","fields":{"refetchToken":["Property 'refetchToken' is missing","Expected property 'refetchToken' to be string but found: undefined"]}}` |
| 28 | refetch-token — cookie rác | 404 | `{"msg":"Invalid token."}` |
| 30 · 31 | logout — không token / token rác | 401 | `{}` |
| 37 · 39 · 43 | me · profile — không có header `Authorization` | 401 | `{"msg":"Missing or invalid Authorization header"}` |
| 38 | me — token rác | 401 | `{"msg":"Unauthorized"}` |
| 40 | me — token của tài khoản đã xoá | 401 | `{"msg":"User no longer exists"}` |
| 44 | profile — `email` sai định dạng | 422 | `{"msg":"Invalid data.","fields":{"email":["Property 'email' should be email"]}}` |
| 41 · 45 | profile — **mọi** body hợp lệ đã thử (F-16) | 422 | `{"msg":"Invalid data.","fields":{"fields":["Property 'fields' is missing","Expected object"]}}` |
| — | register — `name` = `""` và `password` = `""` | 422 | Cùng body bất thường như F-16 (`fields.fields`) — `AMB-BK-AUTH-08` |

**Quy luật quan sát được:** lỗi kiểu/thiếu field → `msg` = `Invalid data.` · lỗi nghiệp vụ → `msg` là câu riêng (`Email already exists.`, `Invalid password.`, `User not found.`). Mọi thông báo bằng **tiếng Anh**.

---

## 8. Luồng xử lý chính

### 8.1. Vòng đời phiên

```
POST /api/register ──201──▶ POST /api/login ──200──▶ body.accessToken + Set-Cookie accessToken, refetchToken
                                                        │
                        ┌───────────────────────────────┤
                        ▼                               ▼
          GET /api/me · PATCH /api/profile       POST /api/refetch-token (Cookie refetchToken)
          (Authorization: Bearer — REQ-39)        ──200──▶ accessToken mới (không Set-Cookie mới)
                        │
                        ▼
          DELETE /api/logout (Bearer [+ Cookie refetchToken])
          ──200──▶ Set-Cookie xoá refetchToken (chỉ khi có gửi cookie)
                   ⚠️ refetchToken vẫn dùng được phía server (F-17) · accessToken vẫn dùng được (F-23)
```

### 8.2. Hai kênh token

| Kênh | Được set ở | Được đọc ở | Ghi chú |
|---|---|---|---|
| `body.accessToken` | login · refetch-token | Header `Authorization: Bearer` của mọi endpoint 🔒 | Kênh **duy nhất** được endpoint 🔒 chấp nhận (REQ-39) |
| Cookie `accessToken` | login | **Không** endpoint nào trong module đọc | Thiếu cờ bảo mật (F-03) — `AMB-BK-AUTH-13` hỏi mục đích |
| Cookie `refetchToken` | login | refetch-token · logout | `HttpOnly; Secure; SameSite=Strict` (F-14) · `Max-Age` bất thường (F-21) |

---

## 9. Yêu cầu Phi chức năng (quan sát được)

| Hạng mục | Quan sát | Liên kết |
|---|---|---|
| Thời hạn access token | `exp` = `6d` ở login và refetch-token | F-11 · `AMB-BK-AUTH-06` |
| Thời hạn cookie `refetchToken` | `Max-Age` ≈ `1.79 × 10⁹` giây — bằng **mốc epoch** hết hạn (≈ thời điểm gọi + 7 ngày), không phải khoảng thời gian → trình duyệt giữ cookie ~56 năm | F-21 · `AMB-BK-AUTH-10` |
| Thu hồi token | Không quan sát được thu hồi ở logout; đổi mật khẩu chưa kiểm được (F-16) | F-17 · F-23 · `AMB-BK-AUTH-02` · `06` |
| Xoay vòng refresh token | Cùng một `refetchToken` dùng lại nhiều lần đều 200; refetch không cấp cookie mới | F-18 · `AMB-BK-AUTH-07` |
| Chính sách mật khẩu | Mật khẩu 1 ký tự `1` đăng ký thành công | F-22 · `AMB-BK-AUTH-08` |
| Liệt kê tài khoản | Sai mật khẩu (400) và email không tồn tại (404) trả status + message khác nhau | F-20 · `AMB-BK-AUTH-09` |
| Giới hạn tần suất | Không kiểm (không có căn cứ trong spec) | `AMB-BK-08` (cấp hệ thống) |
| Header lộ phiên bản | `Server: nginx/1.24.0 (Ubuntu)` | F-10 (cấp hệ thống) |

---

## 12. Nhật ký kiểm chứng (Evidence)

Nhánh API thay ảnh bằng **request/response nguyên văn** (skill 3.4.7). Token, cookie, `id` đã che (`<JWT>` · `<Nch>` = chuỗi N ký tự · `<cuid>`). `<ts>` = timestamp của vòng chạy.

### 12.1. Request đã gọi

| K | Request | Status | Trích body / header đáng chú ý | Dùng cho |
|---|---|---|---|---|
| K-01 | POST /api/register [json] `name, email, password, phone, address` | 201 | `{"msg":"Register successfully."}` · không `Set-Cookie` | 01 · 02 · 10 |
| K-02 | POST /api/register [x-www-form-urlencoded] | 201 | `{"msg":"Register successfully."}` | 10 |
| K-03 | POST /api/register — email của K-01 | 422 | `Email already exists.` | 08 |
| K-04 | POST /api/register — thiếu `name` | 422 | `fields.name` | 04 · 48 |
| K-05 | POST /api/register — thiếu `email` | 422 | `Email already exists.` | 05 (lệch) |
| K-06 | POST /api/register — thiếu `password` | 422 | `fields.password` | 06 · 48 |
| K-07 | POST /api/register — `email: "khong-phai-email"` | 422 | `Property 'email' should be email` | 07 · 48 |
| K-08 | POST /api/register — body `{}` | 422 | lỗi `name` + `password`, **không** lỗi `email` | 05 (lệch) |
| K-09 | POST /api/login [json] đúng | 200 | body `{"msg":"Login successfully.","accessToken":"<JWT>","exp":"6d"}` · `Set-Cookie: refetchToken=<146ch>; Max-Age=1790403538; Path=/; HttpOnly; Secure; SameSite=Strict` · `Set-Cookie: accessToken=<JWT>; Path=/` · cookie `accessToken` **=** `body.accessToken` | 03 · 11 · 12 · 20 · 21 · 22 · 23 |
| K-10 | POST /api/login [multipart] đúng | 200 | như K-09 | 20 · 23 |
| K-11 | POST /api/login — sai mật khẩu | 400 | `Invalid password.` · không `Set-Cookie` | 15 |
| K-12 | POST /api/login — email chưa đăng ký | 404 | `User not found.` | 16 |
| K-13 | POST /api/login — thiếu `email` | 400 | `Invalid password.` | 17 (lệch) |
| K-14 | POST /api/login — thiếu `password` | 422 | `fields.password` | 18 · 48 |
| K-15 | POST /api/login — `email` sai định dạng | 422 | `should be email` | 19 · 48 |
| K-16 | POST /api/login — email viết hoa toàn bộ | 200 | như K-09 | 14 |
| K-17 | GET /api/me — Bearer của K-09 | 200 | 7 khoá `id,name,email,avatarUrl,phone,address,config` · 4 trường khớp K-01 | 13 · 34 · 35 · 36 |
| K-18 | GET /api/me — không token | 401 | `Missing or invalid Authorization header` | 37 |
| K-19 | GET /api/me — `Bearer abc.def.ghi` | 401 | `Unauthorized` | 38 |
| K-20 | GET /api/me — chỉ `Cookie: accessToken=<JWT>` | 401 | `Missing or invalid Authorization header` | 39 |
| K-21 | PATCH /api/profile — không token | 401 | `Missing or invalid Authorization header` | 43 |
| K-22 | PATCH /api/profile [json] `{name}` | 422 | `fields.fields` | 41 (lệch) |
| K-23 | GET /api/me sau K-22 | 200 | `name` **không** đổi | 42 (lệch) |
| K-24 | PATCH /api/profile `{email:"khong-phai-email"}` | 422 | `should be email` | 44 · 48 |
| K-25 | PATCH /api/profile `{email: <email tài khoản B>}` | 422 | `fields.fields` | `AMB-BK-AUTH-12` |
| K-27 | PATCH /api/profile `{password}` — không `password_old` | 422 | `fields.fields` | `AMB-BK-AUTH-05` |
| K-30 | PATCH /api/profile — `password_old` sai | 422 | `fields.fields` | `AMB-BK-AUTH-05` |
| K-32 | PATCH /api/profile — `password` + `password_old` đúng | 422 | `fields.fields` | 45 (lệch) |
| K-33 | POST /api/login — mật khẩu mới của K-32 | 400 | `Invalid password.` | 46 (lệch) |
| K-34 | POST /api/login — mật khẩu cũ | 200 | đăng nhập được | 47 (lệch) |
| K-40 | POST /api/refetch-token — không cookie | 422 | `fields.refetchToken` | 27 · 48 |
| K-41 | POST /api/refetch-token — `refetchToken=abc` | 404 | `{"msg":"Invalid token."}` | 28 |
| K-42 | POST /api/refetch-token — access token đặt vào cookie `refetchToken` | 404 | `{"msg":"Invalid token."}` | 28 |
| K-43 | DELETE /api/logout — không token | 401 | `{}` | 30 |
| K-49 | GET /api/me — token của tài khoản vừa xoá | 401 | `User no longer exists` | 40 |
| K-50 | POST /api/login — tài khoản vừa xoá | 404 | `User not found.` | 16 |
| K-111 | GET /api/me — tài khoản mới chỉ có `name,email,password` | 200 | `avatarUrl` · `phone` · `address` = `""` · `config` = `{}` | 34 |
| K-114 → K-118 | PATCH /api/profile — `{}` · `{fields:{name}}` · form `name` · multipart `name` · `{name, fields:{}}` | 422 ×5 | cùng body `fields.fields` | 41 (lệch) · F-16 |
| K-119 | GET /api/me sau K-114 → K-118 | 200 | `name` **không** đổi | 42 (lệch) |
| K-120 | POST /api/refetch-token — cookie của lần đăng nhập | 200 | `{"msg":"Refetch token successfully.","accessToken":"<JWT>","exp":"6d"}` · **không** `Set-Cookie` | 24 · 26 |
| K-121 | POST /api/refetch-token — **cùng** cookie lần 2 | 200 | như K-120 | F-18 |
| K-122 | GET /api/me — token của K-120 | 200 | đúng tài khoản · token **khác** token đăng nhập | 25 |
| K-123 | POST /api/refetch-token — chỉ Bearer, không cookie | 422 | `fields.refetchToken` | 27 |
| K-125 | DELETE /api/logout — Bearer, không cookie | 200 | `{"msg":"Logout successfully."}` · không `Set-Cookie` | 29 |
| K-126 | GET /api/me — access token vừa logout ở K-125 | 200 | vẫn dùng được | F-23 |
| K-127 | POST /api/refetch-token — cookie của phiên vừa logout ở K-125 | 200 | vẫn làm mới được | 33 (lệch) |
| K-130 | DELETE /api/logout — Bearer + `Cookie: refetchToken` | 200 | `Set-Cookie: refetchToken=<0ch>; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT` · **không** xoá `accessToken` | 29 · 32 |
| K-131 | POST /api/refetch-token — cookie của phiên vừa logout ở K-130 | 200 | vẫn làm mới được | 33 (lệch) |
| K-132 | GET /api/me — access token vừa logout ở K-130 | 200 | vẫn dùng được | F-23 |
| K-133 | DELETE /api/logout — `Bearer abc.def.ghi` | 401 | `{}` | 31 |
| K-134 | POST /api/register — email đã có, viết hoa toàn bộ | 422 | `Email already exists.` | 09 |
| K-108 | POST /api/register — `password: "1"` | 201 | tạo được | F-22 |
| K-109 | POST /api/register — `name: ""`, `password: ""` | 422 | `fields.fields` | F-22 |
| K-142 | GET /api/me — token của tài khoản vừa xoá | 401 | `User no longer exists` | 40 |

### 12.2. Dữ liệu test — tạo / dọn

| Vòng | Tạo | Dọn | Còn sót | Cách xác nhận |
|---|---|---|---|---|
| 1 (`K-01 → K-55`) | 2 tài khoản `auto_auth_<ts>_a` · `_b` | 2 — `_b` dọn ở vòng 1, `_a` dọn ở đầu vòng 2 (K-101 → K-104) do lỗi trình tự của kịch bản vòng 1 | 0 | `GET /api/user?search=auto_auth_<ts>` → `total: 0` (K-145) |
| 2 (`K-101 → K-145`) | 3 tài khoản `auto_auth_<ts>_p` · `_q` · `_w` | 3 | 0 | `GET /api/user?search=auto_auth_<ts>` → `total: 0` (K-144) |

Mọi thao tác ghi/xoá chỉ nhắm vào tài khoản do phiên này tạo, dùng **token của chính tài khoản đó**. Không có bản ghi có sẵn nào bị sửa/xoá. Tài khoản `user@example.com` (không do phiên này tạo) chỉ được **đọc** để xác nhận tồn tại (nguyên nhân K-05 · K-13).
