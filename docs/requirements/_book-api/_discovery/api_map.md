# Bản đồ API — AnhTester Book Management API

> **TẦNG KHÁM PHÁ — cấp hệ thống.** Tài liệu này **KHÔNG chứa mã REQ**, chỉ cấp **mã module** và ghi lại những gì quan sát được từ spec + gọi thật.
> Mã REQ chi tiết sinh ở tầng module: `docs/requirements/_book-api/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`.
>
> Danh mục hệ thống: [`../README.md`](../README.md) · Spec gốc đã snapshot: [`sources/openapi_2026-09-19.json`](sources/openapi_2026-09-19.json) (mới nhất) · [`sources/openapi_2026-08-14.json`](sources/openapi_2026-08-14.json)

| Mục | Giá trị |
|---|---|
| Hệ thống | AnhTester Book Management API |
| Loại | REST API. Từ 19-09-2026 hệ thống có thêm **mặt Android** — bản đồ màn hình ở [`system_map.md`](system_map.md); bảng module của file đó là nơi **duy nhất** ghép prefix ↔ màn hình app (cột `Nền tảng`). 8 module ở mục 1 dưới đây giữ nguyên prefix; `DASH` chỉ có trên app, không có operation |
| Spec | OpenAPI **3.0.0** · version `1.0.0` |
| Nguồn spec | `https://book.anhtester.com/swagger/json` (trang `/swagger` là Scalar renderer, không phải spec) · snapshot mới nhất 19-09-2026 `sha256 32bb8b39…3f09` |
| Base URL | `https://book.anhtester.com` — 1 server duy nhất, **Production** |
| Auth | `BearerAuth` — HTTP bearer, JWT **HS256** |
| Tổng endpoint | **35 operations** / 8 nhóm |
| Ngày khám phá | 14-08-2026 |
| Phương pháp | Parse spec + **gọi thật 20 request** để kiểm chứng (không tin spec suông) · 19-09-2026: thêm 101 request ở tầng module `AUTH` |

---

## 1. Bảng module & prefix

Hệ thống dùng mã hệ thống **`BK`** để không đụng dải prefix của Perfex CRM trong cùng repo.

| Mã module | Nhóm tag trong spec | Số op | 🌐 Công khai | 🔒 Cần token | Dải REQ | Dải TC ID |
|---|---|---|---|---|---|---|
| `AUTH` | Authentication Management | 6 | 3 | 3 | `REQ-BK-AUTH-01 → 48` ✅ [tài liệu](../auth/REQUIREMENTS_AUTH_SUMMARY.md) | `BK_AUTH_TC_nnn` |
| `USER` | User Management | 5 | 2 | 3 | `REQ-BK-USER-01 → 119` ✅ [tài liệu](../user/REQUIREMENTS_USER_SUMMARY.md) | `BK_USER_TC_nnn` |
| `BOOK` | Book Management | 5 | 2 | 3 | `REQ-BK-BOOK-01 → 146` ✅ [tài liệu](../book/REQUIREMENTS_BOOK_SUMMARY.md) | `BK_BOOK_TC_nnn` |
| `CAT` | Category Management | 4 | 1 | 3 | `REQ-BK-CAT-nn` | `BK_CAT_TC_nnn` |
| `PROMO` | Promotion Management | 5 | 2 | 3 | `REQ-BK-PROMO-nn` | `BK_PROMO_TC_nnn` |
| `FILE` | File Management | 7 | 2 | 5 | `REQ-BK-FILE-nn` | `BK_FILE_TC_nnn` |
| `ADDR` | Address Management | 2 | 2 | 0 | `REQ-BK-ADDR-nn` | `BK_ADDR_TC_nnn` |
| `SYS` | System (tiện ích test) | 1 | 1 | 0 | `REQ-BK-SYS-nn` | `BK_SYS_TC_nnn` |
| | **Tổng** | **35** | **15** | **20** | | |

---

## 2. Danh mục endpoint

Cột **Auth** lấy từ `security` của **từng operation**, không phải `security` toàn cục. Spec khai global `BearerAuth`, nhưng **15 operation ghi đè bằng `security: []`** → thành công khai. Đây là chi tiết dễ bỏ sót nhất khi đọc Swagger UI.

### 2.1. `AUTH` — Authentication Management

| Method | Path | Auth | Status codes khai | Mô tả |
|---|---|---|---|---|
| POST | `/api/login` | 🌐 Không | 200/400/403/404/422 | Đăng nhập, trả `accessToken` + set 2 cookie |
| POST | `/api/register` | 🌐 Không | 201/400/422 | Tự đăng ký tài khoản |
| POST | `/api/refetch-token` | 🌐 Không | 200/400/404/422 | Làm mới token — đọc `refetchToken` từ **cookie** |
| PATCH | `/api/profile` | 🔒 Có | 200/400/401/403/404/422 | Cập nhật hồ sơ, có `password` + `password_old` |
| GET | `/api/me` | 🔒 Có | 200/401/403/404/422 | Thông tin user hiện tại |
| DELETE | `/api/logout` | 🔒 Có | 200/400/401/403/404/422 | Đăng xuất |

### 2.2. `USER` — User Management

| Method | Path | Auth | Status codes khai | Mô tả |
|---|---|---|---|---|
| GET | `/api/user` | 🌐 **Không** | 200/400/422/500 | Danh sách user — `limit`/`page`/`search`/`sort`/`sortBy` |
| POST | `/api/user` | 🔒 Có | 201/400/422 | Tạo user |
| GET | `/api/user/{id}` | 🌐 **Không** | 200/404 | Chi tiết user |
| PATCH | `/api/user/{id}` | 🔒 Có | 200/400/404/422 | Sửa user + thu hồi refresh token cũ |
| DELETE | `/api/user/{id}` | 🔒 Có | 200/400/404/422 | Xoá user + xoá refresh token liên quan |

### 2.3. `BOOK` — Book Management

| Method | Path | Auth | Status codes khai | Mô tả |
|---|---|---|---|---|
| GET | `/api/book` | 🌐 Không | 200/400/422 | Danh sách sách — phân trang / lọc / sắp xếp |
| POST | `/api/book` | 🔒 Có | 201/400/401/403/422 | Tạo sách |
| GET | `/api/book/{id}` | 🌐 Không | 200/400/404 | Chi tiết sách — có query `view` |
| PATCH | `/api/book/{id}` | 🔒 Có | **201**/400/401/403/404/422 | Sửa sách |
| DELETE | `/api/book/{id}` | 🔒 Có | 200/400/404/422 | Xoá sách |

### 2.4. `CAT` — Category Management

| Method | Path | Auth | Status codes khai | Mô tả |
|---|---|---|---|---|
| GET | `/api/category-book` | 🌐 Không | 200 | Danh sách danh mục — trả kèm `bookCount` |
| POST | `/api/category-book` | 🔒 Có | 201/400/422 | Tạo danh mục — body `{name}` |
| PUT | `/api/category-book` | 🔒 Có | 200/400/422 | Đổi tên — body `{name, newName}` |
| DELETE | `/api/category-book/{name}` | 🔒 Có | 200/400/404/422 | Xoá theo **tên**, không theo id |

### 2.5. `PROMO` — Promotion Management

| Method | Path | Auth | Status codes khai | Mô tả |
|---|---|---|---|---|
| GET | `/api/promotion-book` | 🌐 Không | 200/400/422/500 | Danh sách — `limit`/`page`/`sort`/`sortBy` khai **required** |
| POST | `/api/promotion-book` | 🔒 Có | 201/400/404/422/500 | Tạo khuyến mãi |
| GET | `/api/promotion-book/{id}` | 🌐 Không | 200/400/404 | Chi tiết |
| PATCH | `/api/promotion-book/{id}` | 🔒 Có | 200/400/404/422/500 | Sửa |
| DELETE | `/api/promotion-book/{id}` | 🔒 Có | 200/400/404/422/500 | Xoá |

### 2.6. `FILE` — File Management

| Method | Path | Auth | Status codes khai | Mô tả |
|---|---|---|---|---|
| GET | `/api/file` | 🌐 Không | 200/400/404 | Liệt kê file theo `path` |
| POST | `/api/file` | 🔒 Có | 200/400/422 | Upload — `multipart/form-data`, field `files` |
| DELETE | `/api/file` | 🔒 Có | 200/400/403/404/422 | Xoá theo query `path` |
| GET | `/api/file/info` | 🌐 Không | **(không khai)** | Dung lượng đã dùng / tối đa |
| PUT | `/api/file/rename` | 🔒 Có | 200/400/404/422 | Đổi tên |
| POST | `/api/file/copy` | 🔒 Có | 200/400/404/422 | Sao chép |
| PUT | `/api/file/move` | 🔒 Có | 200/400/404/422 | Di chuyển |

### 2.7. `ADDR` — Address Management

| Method | Path | Auth | Status codes khai | Mô tả |
|---|---|---|---|---|
| GET | `/api/address` | 🌐 Không | 200/400 | Danh sách đơn vị hành chính VN |
| GET | `/api/address/{divname}` | 🌐 Không | 200/400/422 | Phường/xã theo đơn vị |

### 2.8. `SYS` — System

| Method | Path | Auth | Status codes khai | Mô tả |
|---|---|---|---|---|
| POST | `/api/status` | 🌐 Không | **(không khai)** | Ép server trả status code tuỳ ý — body `{code, msg, time}` |

> `POST /api/status` là **công cụ test có sẵn của hệ thống**: ép trả status code bất kỳ, có `time` để giả lập độ trễ. Dùng nó để test nhánh xử lý lỗi phía client (500 / timeout) mà không cần mock.

---

## 3. Kết quả kiểm chứng bằng gọi thật

20 request thật ngày 14-08-2026. Cột **Spec khai** vs **Thực tế** cho thấy chỗ nào không được tin spec.

### 3.1. Phát hiện mức 🔴 — chặn việc viết TC nếu chưa chốt

| Mã | Phát hiện | Bằng chứng | Ảnh hưởng |
|---|---|---|---|
| **F-01** | `GET /api/user` và `GET /api/user/{id}` **công khai**, trả về `email` + `phone` + `address` của **mọi** user | `GET /api/user?limit=2` không token → **200**, body chứa `anhtester@example.com`, `0939206009`, địa chỉ đầy đủ | Rò rỉ PII toàn hệ thống. Là nguồn `id` để tấn công các endpoint khác |
| **F-02** | **Không có mô hình phân quyền.** Tài khoản vừa `register` (user thường, mới tinh) làm được mọi thứ | Cùng 1 token user thường: `POST /api/book` → 200 · `PATCH /api/user/{id_người_khác}` → 200 · `DELETE /api/user/{id_người_khác}` → 200 · `POST /api/user` → 201 | BOLA + BFLA toàn diện. Spec khai `403` ở nhiều endpoint nhưng **không quan sát được trường hợp nào phát sinh 403** |
| **F-03** | Cookie `accessToken` set **không có** `HttpOnly`, `Secure`, `SameSite` | `Set-Cookie: accessToken=eyJ...; Path=/` — trong khi `refetchToken` cùng response có đủ `HttpOnly; Secure; SameSite=Strict` | XSS đọc được access token. Hai cookie cùng luồng nhưng chuẩn bảo mật lệch nhau. *19-09-2026: tái xác nhận — quy về `AMB-BK-AUTH-04`* |
| **F-16** *(19-09-2026)* | `PATCH /api/profile` **không dùng được** — mọi body hợp lệ (JSON · form · multipart · có/không bọc `fields`) đều 422 | `{"msg":"Invalid data.","fields":{"fields":["Property 'fields' is missing","Expected object"]}}` · `GET /api/me` sau đó: dữ liệu không đổi. Riêng `email` sai định dạng vẫn ra đúng lỗi `should be email` | Không cập nhật được hồ sơ, không đổi được mật khẩu. `AMB-BK-AUTH-01` |
| **F-17** *(19-09-2026)* | **Đăng xuất không thu hồi refresh token** phía server | `DELETE /api/logout` → 200, rồi `POST /api/refetch-token` với **cùng** cookie `refetchToken` → **200** (cả khi logout có gửi cookie và nhận `Set-Cookie` xoá) | Cookie bị lộ vẫn sinh token mới sau khi người dùng đã đăng xuất. `AMB-BK-AUTH-02` |

### 3.2. Phát hiện mức 🟠 — sai lệch dữ liệu

| Mã | Phát hiện | Bằng chứng |
|---|---|---|
| **F-04** | `price` **âm** được chấp nhận | `POST /api/book` với `price: -99999` → **200 Book created successfully**. Spec chỉ khai `maximum: 9000000000000`, **không có `minimum`** |
| **F-05** | `categories` trỏ tới danh mục **không tồn tại** vẫn tạo được sách | `POST /api/book` với `categories: ["khong_ton_tai_zzz"]` → **200**. Không kiểm tra khoá ngoại |
| **F-06** | Xoá user làm **mồ côi** sách của user đó | Sau khi xoá user, `GET /api/book/{id}` của sách cũ trả `auth: null`. Không chặn xoá, không gán lại chủ sở hữu |
| **F-07** | `POST /api/user` **không nhận** password → gán mặc định `anhtester.com` | Tạo user không truyền password, sau đó `POST /api/login` với password `anhtester.com` → **200**. Mọi user tạo qua endpoint này có mật khẩu đoán được |
| **F-18** *(19-09-2026)* | Refresh token **không xoay vòng** | Cùng một cookie `refetchToken` gọi `POST /api/refetch-token` 2 lần liên tiếp → 200 cả hai; response không `Set-Cookie` mới |
| **F-19** *(19-09-2026)* | `default` của `email` **thay cho field bắt buộc bị thiếu** | Snapshot 19-09-2026 thêm `email.default: "user@example.com"` ở 5 operation. Thực tế: `POST /api/register` thiếu `email` → 422 `Email already exists.`; `POST /api/login` thiếu `email` → 400 `Invalid password.`; body `{}` của register **không** có lỗi `email`. `user@example.com` là một tài khoản có thật (không do QA tạo) |
| **F-20** *(19-09-2026)* | Đăng nhập lộ email nào đã đăng ký | Sai mật khẩu → **400** `Invalid password.` · email không tồn tại → **404** `Email not found, please register.` |
| **F-23** *(19-09-2026)* | Access token **vẫn dùng được sau đăng xuất** | `GET /api/me` với token vừa logout → **200** (JWT không trạng thái, `exp` 6 ngày — F-11) |

### 3.3. Phát hiện mức 🟡 — sai lệch spec / lộ thông tin

| Mã | Phát hiện | Bằng chứng |
|---|---|---|
| **F-08** | `POST /api/book` trả **200**, spec khai **201** | Quan sát trực tiếp |
| **F-09** | `PATCH /api/book/{id}` spec khai **201** — sai chuẩn REST, PATCH nên trả 200 | Đọc spec |
| **F-10** | Header `Server: nginx/1.24.0 (Ubuntu)` lộ phiên bản web server và OS | Response header mọi endpoint |
| **F-11** | JWT `exp` = **6 ngày** cho access token | `{"exp":"6d"}` trong response login. Access token sống 6 ngày là dài bất thường |
| **F-21** *(19-09-2026)* | Cookie `refetchToken` có `Max-Age` mang **mốc epoch** thay vì khoảng thời gian | `Max-Age=1790403538` khi gọi lúc epoch ≈ `1789798737` — chênh ≈ 604 800 s = 7 ngày → trình duyệt giữ cookie ~56 năm |
| **F-22** *(19-09-2026)* | Không có chính sách mật khẩu; chuỗi rỗng gây body lỗi bất thường | `POST /api/register` với `password: "1"` → 201 · `name: ""` + `password: ""` → 422 với body `fields.fields` như F-16 |
| **F-27** *(25-09-2026)* | `PATCH /api/user/{id}` **không cập nhật một phần được** — body thiếu khoá `email` → server dùng `default` `user@example.com` → `422` `{"msg":"Email already exists.",…}`. Phải gửi kèm `email` (giá trị hiện tại) mới `200`. Cùng lớp lỗi với F-16 (`PATCH /api/profile`) và F-19 | `PATCH /api/user/{id}` body `{"name":"…"}` → **422** `Email already exists.` · body `{"name":"…","email":"<email hiện tại>"}` → **200** `Updated successfully.` (kiểm trên user do phiên tạo) |

### 3.3b. Phát hiện mức 🟡 bổ sung *(25-09-2026 — kiểm chứng cho `USER` · `BOOK`)*

| Mã | Phát hiện | Bằng chứng |
|---|---|---|
| **F-26** | Endpoint 🔒 lộ **lỗi validation trước khi kiểm auth**: `POST /api/user` **không token + body sai** → `422` (chạy validate rồi mới tới rào auth); cùng endpoint **không token + body hợp lệ** → `401` đúng | `POST /api/user` không `Authorization`, body `{}` → **422** `{"fields":{"name":[…]}}` · body hợp lệ đủ `name`+`email` → **401** `Missing or invalid Authorization header` |
| **F-28** | `POST /api/book` khai `price` **required** nhưng server có `default 50000` → thiếu `price` **vẫn** tạo được | `POST /api/book` body đủ `name`/`status`/`categories`, **không** `price` → **200** `Book created successfully.` |
| **F-29** | Tên sách **phải duy nhất** (spec không khai) — tạo trùng tên → `400` | `POST /api/book` với `name` đã tồn tại → **400** `{"msg":"Book name already exists."}` |

### 3.3c. Phát hiện bổ sung — kiểm chứng module API `USER` · `BOOK` *(25-09-2026 — `/generate-requirements-from-api`, ≈ 800 request, dữ liệu tự tạo đã dọn)*

| Mã | Mức | Phát hiện | Bằng chứng (đã che) | REQ · AMB |
|---|---|---|---|---|
| **F-32** | 🔴 | Bộ lọc JSON của `GET /api/user?search=` (**công khai**) chấp nhận điều kiện trên **trường nội bộ** của bản ghi, không chỉ 9 khoá công khai. **Cần Dev xác minh** — chi tiết kỹ thuật cố ý không ghi trong tài liệu | Chỉ kiểm **status** — không đọc, không ghi lại nội dung, không dò giá trị | REQ-BK-USER-116 · `AMB-BK-USER-08` |
| **F-33** | 🟠 | Body `400` của bộ lọc sai cú pháp (`GET /api/user` · `GET /api/book`) có `error` dài ≈ 1 nghìn ký tự chứa **đường dẫn thư mục máy chủ** và **tên thư viện truy cập dữ liệu** | `{"msg":"Invalid filter or query syntax","error":"<…>"}` — không chép `error` | REQ-BK-USER-117 · REQ-BK-BOOK-146 · `AMB-BK-USER-12` · `AMB-BK-BOOK-32` |
| **F-34** | 🟠 | `PATCH /api/user/{id}` **không** thu hồi refresh token cũ dù spec mô tả *"revoke old refresh tokens"* — sau đổi mật khẩu / khoá tài khoản, cookie `refetchToken` cũ vẫn `POST /api/refetch-token` → 200 (token mới bị `403` ở `/api/me` khi tài khoản đã khoá). Nhánh **xoá** người dùng thì đúng (refetch → 404) | Đăng nhập → giữ cookie → PATCH → refetch cookie cũ → 200 | REQ-BK-USER-109 · `AMB-BK-USER-11` |
| **F-35** | 🔴 | `currentPrice` của **mọi** sách mới = `price × (1 − ΣPERCENTAGE/100) − ΣFIXED_AMOUNT` của **mọi khuyến mãi đang hiệu lực toàn hệ thống** (24 khuyến mãi lúc đo: Σ% ≈ 8193,5 · Σ cố định = 289.000), kể cả sách `promotions: []` → **âm**. Khớp chính xác với 4 mức `price` (0 · 50.000 · 70.000 · 1.000.000). Đây là nguyên nhân gốc của giá âm ở web (REQ-BK-BOOK-51) | `price 50000` → `currentPrice` −4.335.750 | REQ-BK-BOOK-137 · 51 · `AMB-BK-BOOK-18` |
| **F-36** | 🟠 | `PATCH price` **không** tính lại `currentPrice` | `price` 50.000 → 70.000: `currentPrice` giữ nguyên | REQ-BK-BOOK-138 · `AMB-BK-BOOK-19` |
| **F-37** | 🟠 | `PATCH categories` **cộng dồn** vào danh sách cũ, không thay thế — không gỡ được danh mục | `[c1]` → PATCH `[c2]` → `[c2, c1]` | REQ-BK-BOOK-141 · `AMB-BK-BOOK-21` |
| **F-38** | 🟡 | `GET /api/book/{id}` trả `picture` có **1 phần tử rỗng** (`name`/`path` = `""`) khi sách không có ảnh; danh sách trả `[]` | | REQ-BK-BOOK-82 · `AMB-BK-BOOK-25` |
| **F-39** | 🟡 | Trùng **slug** báo `Book name already exists.` (sai đối tượng); slug tự đặt không kiểm định dạng | | REQ-BK-BOOK-88 · `AMB-BK-BOOK-24` |
| **F-40** | 🟡 | `POST /api/book` khai `status` **required** nhưng thiếu vẫn tạo được (`default AVAILABLE`) — cùng lớp F-28 (`price`) | | REQ-BK-BOOK-95 · 101 · `AMB-BK-BOOK-30` |
| **F-41** | 🟡 | `x-www-form-urlencoded` · `multipart/form-data` **không dùng được** cho `POST /api/book` và `PATCH price`: giá trị số đến dạng chuỗi → 422 `Expected number` (spec khai 3 content-type) | | REQ-BK-BOOK-111 · 130 · `AMB-BK-BOOK-28` |
| **F-42** | 🟠 | Giới hạn **cột lưu trữ** không khai trong spec: `name` ≤ **191** (user · book · `POST /api/register`) · `description` ≤ 65.535 · tên danh mục ≤ 191 → vượt thì `400` `{"msg":"Invalid data."}` **không** `fields`. `price` ≥ 27.000.000 → 400 vì giá bán tràn số 32 bit (phụ thuộc F-35) | | REQ-BK-USER-76 · 108 · REQ-BK-BOOK-93 · 100 · 106 · 139 · REQ-BK-AUTH-73 · `AMB-BK-USER-09` · `AMB-BK-BOOK-20` · `27` · `AMB-BK-AUTH-33` |
| **F-43** | 🟡 | `pagination.lengthData` **không nhất quán**: `USER` = `limit` yêu cầu, `BOOK` = số phần tử thực; `limit=1.5` được nhận (cả hai) | `limit=10000` → `lengthData` 10000 (user) · 747 (book) | REQ-BK-USER-118 · 119 · REQ-BK-BOOK-144 · 145 · `AMB-BK-USER-14` · `AMB-BK-BOOK-33` |
| **F-44** | 🟡 | Slug tự sinh **bỏ** chữ `Đ`/`đ` (`Đặc` → `ac`) | `Sách Đặc Biệt Ấn Bản` → `sach-ac-biet-an-ban` | REQ-BK-BOOK-85 · `AMB-BK-BOOK-26` |
| **F-45** | 🟠 | `price` số lẻ bị **cắt** phần thập phân | 1500.5 · 1500.7 · 1500.2 → 1500 | REQ-BK-BOOK-140 · `AMB-BK-BOOK-22` |
| **F-46** | 🟡 | Chuỗi rỗng được nhận ở chỗ phải bị chặn: `POST /api/user` `name: ""` → 201 · `POST /api/book` `categories: [""]` → 200 (sinh danh mục tên rỗng, không xoá được qua API) | | REQ-BK-USER-75 · REQ-BK-BOOK-143 · 142 · `AMB-BK-USER-10` · `AMB-BK-BOOK-29` |

### 3.4. Điểm hệ thống làm ĐÚNG — vẫn phải có TC để chống hồi quy

| Mã | Ghi nhận | Bằng chứng |
|---|---|---|
| **F-12** | `status` ngoài enum bị chặn đúng | `status: "HACKED"` → **422** `{"fields":{"status":["Expected kind 'UnionEnum'"]}}` |
| **F-13** | Gọi endpoint cần token mà không có token bị chặn đúng | `POST /api/book` không token → **401** `Missing or invalid Authorization header` |
| **F-14** | `refetchToken` cookie bảo vệ đúng chuẩn | `HttpOnly; Secure; SameSite=Strict; Max-Age` |
| **F-24** *(19-09-2026)* | Email so khớp **không phân biệt hoa thường** ở cả đăng nhập lẫn kiểm trùng khi đăng ký | Login bằng email viết hoa → 200 · register email đã có viết hoa → 422 `Email already exists.` |
| **F-25** *(19-09-2026)* | `GET /api/me` không lộ khoá ngoài schema; endpoint 🔒 chỉ nhận token qua header | Body đúng 7 khoá, không có `password` · chỉ gửi cookie `accessToken` → 401 |
| **F-30** *(25-09-2026)* | Ràng buộc `categories.minItems: 1` được **thực thi** ở server | `POST /api/book` với `categories: []` → **422** `{"fields":{"categories":["Expected array length to be greater or equal to 1"]}}` |
| **F-31** *(25-09-2026)* | `PATCH`/`DELETE` `/api/user/{id}` và `/api/book/{id}` không token đều **chặn đúng** `401`; not found đều `404` | `PATCH`/`DELETE` không `Authorization` → **401** · id không tồn tại (có token) → **404** `User/Book not found.` |
| **F-47** *(25-09-2026)* | `DELETE /api/user/{id}` **xoá refresh token** liên quan; token cũ → 401, đăng nhập → 404 (đúng spec) | `refetch-token` cookie cũ → **404** `Invalid token.` · `GET /api/me` → **401** `User no longer exists` |
| **F-48** *(25-09-2026)* | Mass Assignment bị chặn: `id` · `role` · `isAdmin` · `viewCount` · `currentPrice` · `createdAt` · `auth` gửi kèm đều bị bỏ qua (`POST` · `PATCH` của `USER` · `BOOK`) | Đọc lại: `id` do server sinh · không khoá `role`/`isAdmin` · `viewCount` 0 |
| **F-49** *(25-09-2026)* | Chuỗi tấn công (`<script>`, SQL) và Unicode tiếng Việt ở `name`/`description` **lưu nguyên văn**, không 500 | Đọc lại **bằng đúng** chuỗi đã gửi |
| **F-15** | ID dùng **cuid** (`cmiyq38a30002...`), không phải số tăng dần | Không đoán tuần tự được — giảm mức độ khai thác của F-01/F-02, nhưng `GET /api/user` công khai đã phát ID sẵn nên lợi thế này mất tác dụng |

---

## 4. Khoảng trống của spec (AMB) — cần chốt trước khi sinh TC

> ✅ **25-09-2026 — toàn bộ AMB cấp hệ thống đã chốt** (`DEMO-AMB-2509` — quyết định giả lập cho dữ liệu dạy học demo). Tiêu đề mục giữ nguyên để không gãy link neo từ các tài liệu khác.

| Mã | Câu hỏi | Vì sao spec không trả lời được | Chặn cái gì | Kết luận (✅ chốt 25-09-2026 · `DEMO-AMB-2509`) |
|---|---|---|---|---|
| **AMB-BK-01** 🔴 | Hệ thống **có** mô hình vai trò không? Nếu có thì gồm những vai trò nào, ai được gọi endpoint nào? | Spec không có khái niệm role ở bất kỳ đâu, nhưng khai `403` ở 6 operation | Toàn bộ TC nhóm Auth/Permission của **mọi** module. Không chốt thì không biết F-02 là **lỗi** hay **thiết kế** | ✅ **Không có** mô hình vai trò — mọi người dùng đã đăng nhập ngang quyền. F-02 là **thiết kế** của hệ thống thực hành; `403` trong spec chỉ còn hiệu lực ở login khi tài khoản bị khoá. Ma trận phân quyền bỏ cột *Vai trò khác* (→ không áp dụng) |
| **AMB-BK-02** 🔴 | `GET /api/user` công khai là **cố ý** hay lỗi cấu hình? | `security: []` là khai báo tường minh, không phải quên | Quyết định F-01 được viết thành TC bug hay TC xác nhận hành vi | ✅ **Cố ý** — hệ thống thực hành công khai. F-01 viết thành TC xác nhận hành vi (`REQ-BK-USER-01`) |
| **AMB-BK-03** 🟠 | `price` có chặn âm không? Sàn là bao nhiêu? | Spec chỉ khai `maximum` | Bộ TC boundary của `BOOK` | ✅ Giá gốc (`price`) ≥ 1.000 như web; giá bán sau khuyến mãi phải **≥ 0**. F-04 là **lỗi** (`REQ-BK-BOOK-51`) |
| **AMB-BK-04** 🟠 | Khuyến mãi `PERCENTAGE` thì `value` giới hạn 0–100? `endDate` bắt buộc sau `startDate`? | Spec khai `value: number` trần, không ràng buộc; 2 ngày chỉ có `default` | Bộ TC boundary + logic của `PROMO` | ✅ `PERCENTAGE` → `value` trong **0 – 100**; `endDate` **phải sau** `startDate`. Áp dụng khi sinh REQ `PROMO` |
| **AMB-BK-05** 🟠 | Xoá danh mục **đang có sách** (`bookCount > 0`) thì sách xử lý thế nào? | Spec khai 400/404 nhưng không nói trường hợp nào | TC `BK_CAT` nhánh xoá | ✅ Xoá danh mục đang có sách bị **chặn** (`400`). Áp dụng khi sinh REQ `CAT` |
| **AMB-BK-06** 🟠 | Đổi mật khẩu qua `PATCH /api/profile` có **bắt buộc** `password_old` không? | Cả hai field đều optional trong spec | TC bảo mật `AUTH` — **→ chuyển thành `AMB-BK-AUTH-05`** (19-09-2026) | ↪️ Đã chuyển thành `AMB-BK-AUTH-05` — ✅ chốt 25-09-2026: bắt buộc, thiếu/sai → `422` |
| **AMB-BK-07** 🟡 | Upload file giới hạn dung lượng / định dạng gì? | Spec không khai. Chỉ biết `maxStorage` = 1 GB qua `GET /api/file/info` | TC 413 / 415 của `FILE` | ✅ Tối đa **3.0 MB / tệp**, định dạng ảnh 7 loại như dòng chữ trên UI. Áp dụng khi sinh REQ `FILE` |
| **AMB-BK-08** 🟡 | Hệ thống có **rate limiting** không? | Không endpoint nào khai `429` | TC 429 — hiện **không có căn cứ** để viết | ✅ **Không có** rate limiting — không viết TC `429` |
| **AMB-BK-09** 🟡 | `GET /api/promotion-book` khai `limit`/`page`/`sort`/`sortBy` là **required**, trong khi `/api/book` và `/api/user` khai **optional** — cố ý hay lỗi spec? | Bất nhất giữa 3 endpoint cùng dạng list | TC pagination của `PROMO` | ✅ **Lỗi spec** — 4 tham số là optional như `/api/book` · `/api/user` |
| **AMB-BK-10** 🟡 | `config` (trong `/api/me`, `PATCH /api/profile`) và `configFe` (trong `PROMO`) chứa gì? | Khai kiểu tự do, không có schema | TC của 2 field này | ✅ `config` = `{ theme: light \| dark \| system, mainColor: <mã màu> }` · `configFe` (`PROMO`) là cấu hình hiển thị tự do — không kiểm nội dung |

---

## 5. Ghi chú kỹ thuật cho khâu automation

| Vấn đề | Chi tiết | Xử lý khi dựng framework |
|---|---|---|
| **`components.schemas` RỖNG** | Toàn bộ request/response body khai **inline**, không có model tái sử dụng | Không sinh DTO tự động từ spec được. Phải tự viết model cho 8 nhóm |
| **Auth 2 kênh song song** | Login trả `accessToken` **trong body** *và* set cookie `accessToken` + `refetchToken` | Chọn 1 kênh và nhất quán. `POST /api/refetch-token` **chỉ** đọc từ cookie → client phải giữ cookie jar |
| **3 content-type mỗi endpoint** | Hầu hết POST/PUT/PATCH nhận `application/json`, `x-www-form-urlencoded`, `multipart/form-data` | Nhân 3 bề mặt test. Chốt `application/json` làm mặc định, để riêng TC 415 cho content-type sai |
| **Tiếng Việt trong body** | Field `address` chứa dấu tiếng Việt | Ép `charset=utf-8`. Gửi qua shell Windows dễ hỏng mã — dùng file JSON, không nhúng thẳng vào lệnh |
| **Danh mục định danh bằng `name`** | `DELETE /api/category-book/{name}` — tên có dấu cách, tiếng Việt | Phải URL-encode. Dữ liệu thật đang có danh mục tên `" Phương Nam"` (**có khoảng trắng đầu**) |
| **Dữ liệu rác sẵn có** | 744 sách, nhiều bản ghi `auto_*`, `Parallel Test Book *`, `TestBook-*` từ các đợt automation trước | Mọi khẳng định theo **tổng số bản ghi** đều không tin được. TC phải tự tạo data rồi tự dọn |
| **`POST /api/status`** | Ép status code + độ trễ tuỳ ý | Dùng thay mock cho TC xử lý lỗi phía client |
| **`sha256` spec đổi mỗi lần server khởi động lại** *(19-09-2026)* | `startDate`/`endDate` của `PROMO` khai `default` = **thời điểm server khởi động** (snapshot 14-08 mang `2025-12-16T17:55…`, snapshot 19-09 mang `2026-08-23T20:40…`) | So spec giữa hai lần chạy phải **so theo cấu trúc, bỏ qua `default` dạng ngày** — so `sha256` thô sẽ báo đổi giả |
| **Endpoint 🔒 chỉ đọc header `Authorization`** *(19-09-2026)* | Cookie `accessToken` do login set **không** được endpoint nào đọc; `refetch-token` chỉ đọc cookie `refetchToken`, không trả cookie mới | Client dùng `body.accessToken` làm Bearer; giữ cookie jar chỉ để gọi `refetch-token` |

---

## 6. Nhật ký khám phá

| Ngày | Thay đổi |
|---|---|
| 25-09-2026 | `/generate-requirements-from-api` module `USER` + `BOOK` — tải lại spec: `sha256` **trùng** `32bb8b39…3f09`, 35 operation, **không** đổi (không cần snapshot mới, không cần Impact Report kiểu spec-delta). Kiểm chứng ≈ 800 request (8 lượt) trên 45 tài khoản · 46 sách · 40 danh mục tự tạo — đã dọn hết (có thể sót 1 danh mục tên rỗng, không xoá được qua API). Ghi nhận **F-32 → F-46** (2 🔴 · 5 🟠 · 8 🟡) + điểm đúng **F-47 → F-49**. Cấp dải `REQ-BK-USER-43 → 119` · `REQ-BK-BOOK-53 → 146` (mặt API). Chốt 26 AMB mới bằng quyết định giả lập `DEMO-AMB-2509B` |
| 25-09-2026 | `/generate-testcases-api` module `USER` + `BOOK` — kiểm chứng **~40 request thật** (2 lượt) cho 10 endpoint `/api/user*` · `/api/book*`, dữ liệu tự tạo + dọn sạch (tạo 3 sách + 5 user → xoá hết, 0 sót). Ghi nhận **F-26 → F-31** (1 🟠 F-27 · 4 🟡 F-26 · F-28 · F-29 + F-30/F-31 điểm đúng). Tái xác nhận F-01 · F-02 · F-04 · F-05 · F-07 · F-08 · F-09 còn nguyên. **Spec không đổi** (`sha256 32bb8b39…3f09` khớp). Chưa sinh REQ mặt API cho 2 module — TC neo tạm vào REQ Web, phần thuần-API ghi `⚠️ Chưa có REQ` |
| 19-09-2026 | `/discover-system` mode ADD — thêm mặt Android, **không** đụng spec hay gọi API. Bản đồ màn hình ở [`system_map.md`](system_map.md). Dải AMB cấp hệ thống nối tiếp: `AMB-BK-11` · `AMB-BK-12` ghi ở [`system_map.md` mục 8](system_map.md#8-ambiguity-cấp-hệ-thống-phát-sinh-ở-mặt-mobile) — số kế tiếp `AMB-BK-13` |
| 19-09-2026 | `/generate-requirements-from-api` module `AUTH`. Tải lại spec: `sha256` đổi `8d331833…2621` → `32bb8b39…3f09`, snapshot mới [`openapi_2026-09-19.json`](sources/openapi_2026-09-19.json). **35 op — không thêm/bỏ op nào.** 11 op đổi schema: thêm `email.default: "user@example.com"` (login · register · profile · `POST /api/user` · `PATCH /api/user/{id}`) · bỏ `additionalProperties: false` ở request/response của login và `/api/file` (GET · POST) · `POST /api/file/copy` response 200 thêm `newPath`/`newName` bắt buộc + khai thêm 500 · `PUT /api/file/move` khai thêm 403/500 · `default` ngày của `PROMO` (chỉ do server khởi động lại). Chưa module nào có REQ trước lượt này → **không** cần Impact Report. Kiểm chứng 101 request, ghi nhận **F-16 → F-25** (2 🔴 · 4 🟠 · 2 🟡 · 2 điểm đúng). Cấp dải `REQ-BK-AUTH-01 → 48` |
| 14-08-2026 | Khởi tạo bản đồ. Parse spec `openapi 3.0.0` (35 op / 8 nhóm) + kiểm chứng bằng **20 request thật**. Cấp 8 mã module, mã hệ thống `BK`. Ghi nhận **15 phát hiện** (3 🔴 · 4 🟠 · 4 🟡 · 4 điểm đúng) và **10 ambiguity**. Snapshot spec vào `sources/openapi_2026-08-14.json`. **Chưa cấp mã REQ** — đúng quy tắc tầng khám phá |

### Sự cố trong lúc khám phá

| Ngày | Sự cố | Khắc phục |
|---|---|---|
| 14-08-2026 | Khi kiểm chứng BOLA, đã dùng **bản ghi seed có sẵn** `anhtester@example.com` (id `cmiyq38a300027udmc9666cq1`) làm mục tiêu `PATCH` rồi `DELETE` → xoá mất tài khoản gốc của demo | Tạo lại tài khoản cùng `name`/`email`/`phone`/`address`/`avatarUrl`/`isActive`, mật khẩu về mặc định `anhtester.com` (đã kiểm chứng đăng nhập được). **Không khôi phục được:** ID mới `cmssozna6102s7uk1dda2ujja`, các sách thuộc tài khoản cũ nay mang `auth: null`. Đã bổ sung quy tắc chặn vào workflow `/generate-api-tests-from-swagger` mục "Quy tắc dữ liệu test" *(15-09-2026: workflow đó đã tách thành `/generate-testcases-api` + `/generate-automation-api`; bộ luật nay nằm ở skill `skills-requirements-analyzer` mục 3.4.4)* |
