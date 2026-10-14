# Đặc tả Yêu cầu — Module Người dùng (`USER`)

> Điểm vào cấp hệ thống: [../README.md](../README.md) · Bản đồ API: [../_discovery/api_map.md](../_discovery/api_map.md) mục 2.2 · API: [api/requirements_user_api.md](api/requirements_user_api.md) · Android: [mobile/requirements_user_mobile.md](mobile/requirements_user_mobile.md) · Bản đồ app: [../_discovery/modules/module_02_nguoi_dung.md](../_discovery/modules/module_02_nguoi_dung.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management — mã hệ thống `BK` (namespace `_book-api/`) |
| **Module** | Người dùng — quản lý tài khoản người dùng (danh sách, tìm/lọc, thêm, sửa, khoá/mở, xoá). Hồ sơ **của chính mình** (My Profile, Setting account) thuộc module `AUTH` |
| **Prefix** | `USER` → mã REQ `REQ-BK-USER-<nn>` · TC ID `BK_USER_TC_<nnn>` |
| **Nền tảng** | **Web** ✅ (25-09-2026) · **API** ✅ (25-09-2026 — 5 operation `GET/POST /api/user` · `GET/PATCH/DELETE /api/user/{id}`) · **Android** 🟨 (26-09-2026 — danh sách · lọc · validation ✅; thêm/sửa/khoá/xoá thành công ❔ — cần tester nhập mật khẩu) · iOS ❔ |
| **Nguồn phân tích** | Web: thao tác thật trên `https://book.anhtester.com/user-management` (Chrome, Playwright MCP) ngày 25-09-2026 · API: spec OpenAPI (snapshot 19-09-2026, `sha256` trùng bản tải lại 25-09-2026) + ≈ 360 request gọi thật ngày 25-09-2026 · Android: thao tác thật trên app `book.anhtester.com` 1.0 (emulator Android 17) ngày 26-09-2026 — chi tiết ở file nền tảng |
| **Ngày phân tích** | 25-09-2026 (Web · API) · 26-09-2026 (Android) |
| **Tài khoản dùng khảo sát** | Web: khách + 2 tài khoản tự tạo `auto_web_<timestamp>_a|b@auto.test` — sửa/xoá **chỉ** trên 2 tài khoản này · Android: tài khoản test `auto_demo_account_<timestamp>` (tester đăng nhập sẵn), không tạo/sửa/xoá tài khoản nào |
| **Môi trường dùng chung** | **KHÔNG** (user chốt 14-08-2026) — vẫn chỉ ghi/xoá bản ghi do phiên tạo |
| **Tổng số REQ** | **128** — `web/` 7 · `api/` 77 · `mobile/` 9 · dùng chung 35 (4 `Web · API` · 31 `Android · Web`) |
| **Dải mã đã dùng** | `REQ-BK-USER-01` → `REQ-BK-USER-128` (đợt 1 Web `01 → 42` · đợt 2 API `43 → 115` · đợt 3 chốt AMB `DEMO-AMB-2509B` `116 → 119` · đợt 4 Android `120 → 128`) · `AMB-BK-USER-01` → `AMB-BK-USER-20` · `RISK-BK-USER-01` → `RISK-BK-USER-09` · `STORY-BK-USER-01` → `12` |
| **Mã kế tiếp** | Đợt phân tích sau bắt đầu từ `REQ-BK-USER-129` · `AMB-BK-USER-21` · `RISK-BK-USER-10` — **KHÔNG đánh lại từ 01** |
| **Ambiguity còn treo** | **0** — 20/20 AMB đã chốt (`18 → 20` ngày 26-09-2026 theo `DEMO-AMB-2609`) · 17 chốt 25-09-2026 (`01 → 07`: `DEMO-AMB-2509` · `08 → 17`: `DEMO-AMB-2509B` — cùng là dữ liệu dạy học demo) · AMB cấp hệ thống tham chiếu (`AMB-BK-01` · `02` · `08` · `12`) cũng đã chốt |

---

## 1. Tổng quan

Màn hình `User Management` là **danh sách người dùng công khai**: khách chưa đăng nhập vẫn xem, tìm và lọc được toàn bộ người dùng kèm email, số điện thoại, địa chỉ (cùng bản chất F-01 của mặt API). Đăng nhập bằng **bất kỳ** tài khoản tự đăng ký nào cũng thêm, sửa, khoá, xoá được người dùng **khác** (F-02) — chỉ riêng dòng của chính mình bị khoá thao tác.

Mặt **API** (`/api/user*`) làm được đúng những việc đó và **hơn** — tạo không cần biết mật khẩu, đổi mật khẩu của người khác không cần mật khẩu cũ, tự sửa/xoá chính mình — vì không có mô hình vai trò (`AMB-BK-01` ✅). Chi tiết ở [api/requirements_user_api.md](api/requirements_user_api.md).

Người dùng có một trạng thái nghiệp vụ: **Active / Inactive** (công tắc `Active for login`). Inactive thì không đăng nhập được (REQ-BK-AUTH-100).

### Trong phạm vi

- Danh sách: cột, sắp xếp mặc định và theo cột, số dòng mỗi trang, phân trang
- Tìm kiếm theo từ khoá · bộ lọc nâng cao (Field · Operator · Value · AND/OR)
- Nút thao tác theo trạng thái đăng nhập · thêm · sửa · khoá/mở · xoá người dùng

### Ngoài phạm vi

| Vùng | Lý do |
|---|---|
| My Profile · Setting account | Thuộc module `AUTH` (REQ-BK-AUTH-101 → 119) dù nằm dưới breadcrumb `User management` |
| Tải ảnh đại diện (Upload photo) | Quy tắc đã chốt (3.0 MB · 7 định dạng) nhưng **để ngoài phạm vi** đợt kiểm thử web này — khảo sát cùng module `FILE` (`AMB-BK-USER-05` ✅) |
| Bộ lọc với Field kiểu ngày (`Created At` · `Updated At`) và `Is Active` | Chưa thử — chỉ thử `Email` và `Phone` |
| Android: khách chưa đăng nhập · thêm/sửa/khoá/xoá thành công · email trùng (REQ-01 · 19 · 32 · 33 · 34 · 35 · 37 → 40 · 42) | Chưa kiểm ở lượt 26-09-2026 — cần tester nhập mật khẩu / tạo tài khoản (agent không làm trên hệ thống thật). Chi tiết [mobile/ mục 2](mobile/requirements_user_mobile.md#2-bản-đồ-phủ-tài-liệu) |
| Tải lên ảnh đại diện qua API (`/api/file`) | Thuộc module `FILE` |
| Vai trò khác ngoài "người dùng tự đăng ký" | Hệ thống **không có** mô hình vai trò — `AMB-BK-01` · `AMB-BK-USER-01` ✅ chốt 25-09-2026 |

---

## Bản đồ tài liệu

| Nền tảng | File | Story | REQ bao phủ |
|---|---|---|---|
| Chung `Web · API` | Index — mục 3.1 | STORY-BK-USER-01 · 04 · 05 | `REQ-BK-USER-01` · `33` · `35` · `38` (4) |
| Chung `Android · Web` | Index — mục 3.2 | STORY-BK-USER-01 → 06 | `02 → 18` · `20 → 31` · `36` · `41` (31) |
| Web | [web/requirements_user_web.md](web/requirements_user_web.md) | STORY-BK-USER-03 → 06 | `19` · `32` · `34` · `37` · `39` · `40` · `42` (7) |
| Mobile (Android) | [mobile/requirements_user_mobile.md](mobile/requirements_user_mobile.md) | STORY-BK-USER-01 · 02 · 04 | `REQ-BK-USER-120` → `128` (9) |
| API | [api/requirements_user_api.md](api/requirements_user_api.md) | STORY-BK-USER-07 → 12 | `REQ-BK-USER-43` → `REQ-BK-USER-119` (77) |

Tự kiểm: `4 + 31 + 7 + 77 + 9 = 128` = dải `01 → 128` ✔ — mỗi REQ nằm ở đúng 1 file.

| Nội dung | Ở đâu |
|---|---|
| Metadata · Tổng quan & phạm vi (1) · REQ dùng chung (3) · Ma trận phân quyền (6) · Ma trận trạng thái (7) · Phân rã Story (10) · AMB & RISK (11) · Nhật ký (13) | **File này** |
| Trình duyệt khảo sát · Bảng REQ · Field Spec · Validation · Luồng · Phi chức năng · Ghi chú automation · Danh mục Evidence · Dữ liệu test | [web/requirements_user_web.md](web/requirements_user_web.md) |
| Thiết bị khảo sát · Bản đồ đối chiếu web ↔ Android · Bảng REQ Android · Field Spec · Validation · Yêu cầu riêng mobile · Ghi chú automation · Danh mục Evidence | [mobile/requirements_user_mobile.md](mobile/requirements_user_mobile.md) |
| Endpoint Catalog · Bảng REQ · Field Spec JSON · Validation (body lỗi nguyên văn) · Luồng · Phi chức năng · Nhật ký kiểm chứng request · Dữ liệu tạo/dọn | [api/requirements_user_api.md](api/requirements_user_api.md) |

---

## 3. Yêu cầu dùng chung

### 3.1. Web · API

Bốn REQ dưới đây sinh ở đợt Web (25-09-2026), **chuyển lên index** cùng ngày khi kiểm khớp trên API; mã giữ nguyên, AC viết lại ở mức **rule** rồi thêm vế **Web** / **API**. Ảnh evidence ở lại `web/evidence/`.

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-USER-01 | Không cần đăng nhập vẫn xem được danh sách người dùng | Web · API | Hành vi hiện tại — **cùng bản chất F-01** (`AMB-BK-02` ✅ cố ý) | Chưa đăng nhập / không gửi token → danh sách người dùng trả về, mỗi bản ghi có tên · **email** · **số điện thoại** · **địa chỉ**. **Web:** mở `/user-management` → bảng hiển thị; network `GET /api/user?sortBy=desc&sort=updatedAt&page=1&limit=5&search=` → 200 (không token). **API:** `GET /api/user?limit=2&page=1` không `Authorization` → **200** · `list` có đủ các khoá (REQ-43) | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · `web_user_list_guest_viewport.png` · API: Spec (`security: []`) + kiểm chứng thực tế · GET /api/user → 200 (K-01) |
| REQ-BK-USER-33 | Email đã tồn tại bị từ chối khi tạo người dùng | Web · API | Rule do server quyết định | Tạo người dùng với email của tài khoản **đã có** (kể cả viết HOA) → bị từ chối với thông báo `Email already exists.`, **không** tạo bản thứ hai. **Web:** `Save` → dưới ô Email `Email already exists.` + thông báo nổi cùng câu · hộp thoại **vẫn mở**, dữ liệu giữ nguyên · `POST /api/user` → **422**. **API:** `POST /api/user` (Bearer hợp lệ) → **422** · `msg` = `Email already exists.` · `fields.email` chứa cùng câu · mật khẩu của tài khoản có sẵn **không** đổi | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · `web_user_add_email_exists_viewport.png` · API: Spec + kiểm chứng thực tế · POST /api/user → 422 (K-42) |
| REQ-BK-USER-35 | Tài khoản vừa tạo đăng nhập được bằng mật khẩu đã đặt | Web · API | Tác tạo dùng được (skill 4.3.8) | Tài khoản tạo (Active bật) → đăng nhập đúng email + mật khẩu đã đặt lúc tạo → thành công. **Web:** Sign in → Dashboard · `Login successfully.` · **API:** `POST /api/login` → **200** | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · API · POST /api/login → 200 · API: Kiểm chứng thực tế · POST /api/login → 200 (K-35) |
| REQ-BK-USER-38 | Để trống mật khẩu khi cập nhật thì mật khẩu không đổi | Web · API | Rule do server quyết định | (1) Cập nhật người dùng với `password` rỗng → (2) đăng nhập bằng mật khẩu **cũ** → đăng nhập được. **Web:** 2 ô mật khẩu trống → request gửi `password: ""`. **API:** `PATCH /api/user/{id}` body `{name, email, password: ""}` → **200** → `POST /api/login` mật khẩu cũ → **200** | 🟢 | 25-09-2026 · + API | Web: Kiểm chứng thực tế · API · POST /api/login → 200 sau Update · API: Kiểm chứng thực tế · PATCH → 200 (K-67) |

### 3.2. Dùng chung Android · Web

REQ sinh ở đợt Web (25-09-2026), **chuyển lên index** ngày 26-09-2026 khi kiểm khớp trên app Android; mã giữ nguyên, AC Web giữ nguyên văn và thêm vế **Android**. Ảnh Web ở lại `web/evidence/`, ảnh Android ở `mobile/evidence/`. REQ Web chưa kiểm được trên Android (khách chưa đăng nhập · thêm/sửa/khoá/xoá thành công — cần tester nhập mật khẩu) vẫn ở `web/` — lý do ở [mobile/requirements_user_mobile.md mục 2](mobile/requirements_user_mobile.md#2-bản-đồ-phủ-tài-liệu).

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-USER-02 | Bảng có đủ các cột | Android · Web |  | **Web:** Tiêu đề cột theo thứ tự: `Name` (avatar + tên + email) · `Phone` · `Address` · `Active` (nhãn `Active` xanh / `Inactive` đỏ) · `Created` · `Updated` (ngày + giờ). Đã đăng nhập thêm 1 cột cuối không tiêu đề chứa nút ⋮ **Android:** bảng **cuộn ngang** — màn hình dọc chỉ thấy cột `Name` (và một phần `Phone`); vuốt ngang để thấy `Phone` · `Address` · `Active` · `Created` · `Updated`. Cột nút ⋮ luôn nằm ở mép phải (REQ-121) | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_list_guest_viewport.png` · `web_user_row_menu_other_enabled_viewport.png` · Android: Kiểm chứng thực tế · android_user_list_hscroll_end.png · đọc tiêu đề cột sau khi vuốt |
| REQ-BK-USER-03 | Mặc định sắp theo Updated giảm dần | Android · Web |  | **Web:** Mở trang → cột `Updated` mang biểu tượng sắp xếp · request `sort=updatedAt&sortBy=desc` · người dùng vừa tạo/sửa đứng đầu **Android:** tiêu đề `Updated` mang biểu tượng sắp xếp giảm dần · dòng cập nhật gần nhất đứng đầu. Không quan sát được request | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · API · GET /api/user (tham số) · `web_user_add_success_toast_viewport.png` · Android: Kiểm chứng thực tế · android_user_list_hscroll_end.png |
| REQ-BK-USER-04 | Số dòng mỗi trang mặc định 5, có 7 lựa chọn | Android · Web |  | **Web:** Ô chọn số dòng hiện `5` · mở ra có đúng 7 lựa chọn `5` · `10` · `15` · `20` · `25` · `50` · `100` (`5` đang chọn) **Android:** ô số dòng (`android.widget.Spinner`) hiện `5` · mở ra đúng 7 lựa chọn, `5` có `selected=true` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_pagesize_open_viewport.png` · đọc `role=option` · Android: Kiểm chứng thực tế · android_user_pagesize_open.png · đọc danh sách lựa chọn |
| REQ-BK-USER-05 | Đổi số dòng tải lại từ trang 1 | Android · Web |  | **Web:** Chọn `10` → bảng hiện 10 dòng · request `page=1&limit=10` · tổng số trang ở thanh phân trang tính lại (không assert con số — dữ liệu thay đổi) **Android:** chọn `10` → 10 dòng · số trang cuối tính lại (không assert con số) | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · API · GET /api/user?…&limit=10 · Android: Kiểm chứng thực tế · đếm dòng + đọc `content-desc` nút trang |
| REQ-BK-USER-06 | Thanh phân trang | Android · Web |  | **Web:** Ở trang 1: nút `Go to previous page` **khoá** · hiện nút trang `1` (đang chọn) `2` `3` `4` `5` · dấu `…` · nút trang cuối · nút `Go to next page` **Android:** trang 1: `Go to previous page` `enabled=false` · `page 1` · `Go to page 2…5` · `…` · trang cuối · `Go to next page` (đọc `content-desc`) | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc `aria-label` + `disabled` · Android: Kiểm chứng thực tế · đọc `content-desc` + `enabled` |
| REQ-BK-USER-07 | Số dòng mỗi trang trở về 5 khi rời trang rồi quay lại | Android · Web | Hành vi quan sát (`AMB-BK-USER-04`) | **Web:** Chọn `10` → sang trang khác → quay lại `User` → ô số dòng hiện `5` **Android:** chọn `10` → sang tab `Book` → quay lại tab `User` → ô số dòng hiện `5` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc ô số dòng sau điều hướng · Android: Kiểm chứng thực tế · đọc ô số dòng sau điều hướng |
| REQ-BK-USER-08 | Tìm kiếm theo từ khoá | Android · Web | Ô `Search user (name, email, phone or address)` | **Web:** Gõ `auto_web_<timestamp>` → chỉ còn dòng có email chứa chuỗi đó. Gõ từng ký tự nhưng chỉ phát **1** request sau khi ngừng gõ (`search=<từ khoá>`) **Android:** gõ email tài khoản test → chỉ còn dòng khớp. Không quan sát được số request. Rời tab rồi quay lại → ô tìm kiếm trống | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_search_result_viewport.png` · API · GET /api/user?…&search=… · Android: Kiểm chứng thực tế · android_user_search_self_you.png |
| REQ-BK-USER-09 | Tìm kiếm không có kết quả | Android · Web |  | **Web:** Gõ chuỗi không tồn tại → vùng bảng hiện hình minh hoạ + chữ `No Data` · không còn nút số trang · `Go to previous page` và `Go to next page` đều khoá **Android:** gõ chuỗi không tồn tại → vùng bảng `No Data` · không còn nút số trang · `Go to previous page` và `Go to next page` đều `enabled=false` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_search_no_data_viewport.png` · đọc DOM · Android: Kiểm chứng thực tế · android_user_search_no_data.png · đọc `enabled` |
| REQ-BK-USER-10 | Bấm tiêu đề cột để sắp xếp tăng rồi giảm | Android · Web |  | **Web:** Bấm `Name` lần 1 → request `sort=name&sortBy=asc` · lần 2 → `sort=name&sortBy=desc` · thứ tự dòng đổi theo **Android:** bấm `Name` lần 1 → tên xếp tăng dần · lần 2 → giảm dần (đọc 5 tên đầu). Không quan sát được request | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · API · GET /api/user (tham số sort) · Android: Kiểm chứng thực tế · đọc thứ tự tên — ảnh không lưu vì chứa email người khác |
| REQ-BK-USER-11 | Icon lọc mở bảng lọc thay chỗ ô tìm kiếm | Android · Web |  | **Web:** Bấm icon lọc cạnh ô tìm kiếm → hiện 1 dòng điều kiện `Field` · `Operator` · `Value` (kèm nút × đầu dòng) và 2 nút `Add filter` · `Clear filter`; ô `Search user…` **không** còn hiển thị (`AMB-BK-USER-06`) **Android:** icon lọc → hàng `Field` · `Operator` · `Value` (nút × đầu dòng, id `remove`) + `Add filter` (id `add-filter`) · `Clear filter` (id `clear-filter`); ô tìm kiếm ẩn. `Value` · `Add filter` · `Clear filter` nằm ngoài mép phải — phải vuốt ngang (REQ-122) | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_filter_field_open_viewport.png` · đọc DOM · Android: Kiểm chứng thực tế · android_user_filter_open.png · android_user_filter_hscroll.png (dòng dữ liệu đã làm mờ) |
| REQ-BK-USER-12 | Field có 7 lựa chọn, mặc định Name | Android · Web |  | **Web:** Mở `Field` → `Name` (đang chọn) · `Email` · `Phone` · `Address` · `Is Active` · `Created At` · `Updated At` **Android:** mở `Field` → 7 lựa chọn, `Name` `selected=true` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_filter_field_open_viewport.png` · đọc `role=option` · Android: Kiểm chứng thực tế · android_user_filter_field_open.png |
| REQ-BK-USER-13 | Operator có 5 lựa chọn, mặc định Equals | Android · Web |  | **Web:** Mở `Operator` → `Equals (=)` (đang chọn) · `Not equal to (!=)` · `Contains (∈)` · `Starts with (→)` · `Ends with (←)` **Android:** mở `Operator` → 5 lựa chọn, `Equals (=)` `selected=true` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc `role=option` · Android: Kiểm chứng thực tế · đọc danh sách lựa chọn |
| REQ-BK-USER-14 | Đổi Field đặt lại Operator về Equals | Android · Web |  | **Web:** Chọn Operator `Contains (∈)` → đổi Field sang `Email` → Operator hiển thị `Equals (=)` **Android:** Operator `Contains (∈)` → đổi Field `Email` → `Phone` → Operator `Equals (=)`. Value đã gõ cũng bị xoá — REQ-123 | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc giá trị combobox + request `…"email":{"equals":…}` · Android: Kiểm chứng thực tế · đọc `text` các ô |
| REQ-BK-USER-15 | Điều kiện lọc tự áp dụng khi nhập Value | Android · Web | Không có nút "Áp dụng" | **Web:** Field `Email` · Operator `Contains (∈)` · gõ Value `auto_web_<timestamp>` → bảng chỉ còn dòng có email chứa chuỗi đó, **không** cần bấm nút. Request mang `search` là điều kiện JSON `{"AND":[{"email":{"contains":"…"}}]}` **Android:** Field `Email` · Operator `Contains (∈)` · Value `auto_web_<timestamp>` → chỉ còn 1 dòng, không bấm nút nào | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_filter_email_contains_viewport.png` · API · GET /api/user (tham số search) · Android: Kiểm chứng thực tế · android_user_filter_email_contains.png |
| REQ-BK-USER-16 | Add filter thêm điều kiện nối AND/OR | Android · Web |  | **Web:** Bấm `Add filter` → thêm dòng điều kiện mới (Field `Name`, Operator `Equals (=)`) có ô nối ở đầu dòng mặc định `AND`, mở ra có `AND` · `OR` **Android:** `Add filter` → dòng mới `Name` · `Equals (=)` · ô nối `AND` (id `mui-component-select-mode`) — mở ra `AND` · `OR` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_filter_two_conditions_viewport.png` · đọc `role=option` · Android: Kiểm chứng thực tế · android_user_filter_two_conditions.png |
| REQ-BK-USER-17 | Clear filter xoá điều kiện và đóng bảng lọc | Android · Web |  | **Web:** Có điều kiện lọc → `Clear filter` → bảng lọc đóng · ô `Search user…` hiện lại · danh sách trở về đầy đủ (số trang như trước khi lọc) **Android:** `Clear filter` → bảng lọc đóng · ô tìm kiếm hiện lại · phân trang trở lại số trang ban đầu | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc DOM sau thao tác · Android: Kiểm chứng thực tế · đọc cây phần tử sau thao tác |
| REQ-BK-USER-18 | Icon cạnh tiêu đề cột mở bảng lọc theo cột đó | Android · Web |  | **Web:** Bấm icon lọc cạnh tiêu đề `Phone` → bảng lọc mở với Field = `Phone` **Android:** vuốt ngang bảng → icon lọc cạnh tiêu đề `Phone` → bảng lọc mở với Field `Phone` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc giá trị combobox Field · Android: Kiểm chứng thực tế · đọc `text` combobox Field |
| REQ-BK-USER-20 | Đã đăng nhập có nút New user và nút ⋮ mỗi dòng | Android · Web |  | **Web:** Đăng nhập → nút `New user` cạnh tiêu đề `User Management` · mỗi dòng có nút ⋮ ở cột cuối **Android:** đã đăng nhập → nút `New user` cạnh tiêu đề · mỗi dòng có nút ⋮ (không nhãn) | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_row_menu_other_enabled_viewport.png` · Android: Kiểm chứng thực tế · android_user_row_menu_other_enabled.png |
| REQ-BK-USER-21 | Dòng của chính mình có nhãn "You" | Android · Web |  | **Web:** Dòng của tài khoản đang đăng nhập hiện nhãn `You` cạnh tên **Android:** dòng của tài khoản đang đăng nhập hiện `You` cạnh tên | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_row_menu_self_disabled_viewport.png` · Android: Kiểm chứng thực tế · android_user_search_self_you.png |
| REQ-BK-USER-22 | Không sửa/xoá chính mình từ danh sách | Android · Web |  | **Web:** Dòng có nhãn `You` → bấm ⋮ → menu có `Edit` · `Delete` đều **khoá** (`aria-disabled=true`) **Android:** ⋮ ở dòng `You` → `Edit` · `Delete` (`android.view.MenuItem`) `enabled=false` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_row_menu_self_disabled_viewport.png` · đọc `aria-disabled` · Android: Kiểm chứng thực tế · android_user_row_menu_self_disabled.png · đọc `enabled` |
| REQ-BK-USER-23 | Menu của dòng người khác cho Edit và Delete | Android · Web | Hành vi hiện tại — **cùng bản chất F-02** (`AMB-BK-USER-01` 🔴) | **Web:** Tài khoản tự đăng ký → dòng của người dùng **khác** → bấm ⋮ → `Edit` · `Delete` **dùng được** (`aria-disabled` không có) **Android:** ⋮ ở dòng tài khoản test `auto_web_<timestamp>_b` → `Edit` · `Delete` `enabled=true`. Chỉ mở menu, không thao tác | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_row_menu_other_enabled_viewport.png` · chỉ thao tác trên tài khoản do phiên tạo · Android: Kiểm chứng thực tế · android_user_row_menu_other_enabled.png |
| REQ-BK-USER-24 | Hộp thoại Add user có đủ thành phần | Android · Web |  | **Web:** `New user` → hộp thoại tiêu đề `Add user`: nhóm *Infomation* (`Upload photo` + `Allowed *.jpeg,.jpg*.png*.gif*.webp*.bmp*.svg max size of 3.0 MB` · `Name *` · `Phone` · *Address*: `Division` · `Ward` · `Address`) · nhóm *Account* (`Email *` · `Password *` · `Password Confirmation *` · công tắc `Active for login`) · nút `Cancel` · `Save`. Ward và Address khoá khi chưa chọn Division / Ward **Android:** `New user` → hộp thoại toàn màn hình `Add user` cùng thành phần · Ward và Address `enabled=false` · `Cancel` · `Save` cố định ở đáy hộp thoại | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_add_dialog_default_viewport.png` · đọc `disabled` · Android: Kiểm chứng thực tế · android_user_add_dialog_default_part1.png · android_user_add_dialog_default_part2.png |
| REQ-BK-USER-25 | Active for login mặc định bật | Android · Web |  | **Web:** Mở Add user → công tắc `Active for login` đang **bật** (`checked=true`) **Android:** công tắc `Active for login` **hiển thị bật** (ảnh). Thuộc tính `checked` của `android.widget.Switch` luôn `false` — không đọc được trạng thái qua cây phần tử (RISK-BK-USER-09) | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_add_dialog_default_viewport.png` · đọc `checked` · Android: Kiểm chứng thực tế · android_user_add_dialog_default_part2.png — chỉ quan sát ảnh |
| REQ-BK-USER-26 | Add user: bỏ trống Name bị chặn | Android · Web |  | **Web:** `Save` với Name trống → dưới ô `Name is required.` · hộp thoại vẫn mở · **không** có request **Android:** `Save` với Name trống → `Name is required.` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_add_empty_submit_viewport.png` · Android: Kiểm chứng thực tế · android_user_add_empty_submit.png |
| REQ-BK-USER-27 | Add user: bỏ trống Email bị chặn | Android · Web |  | **Web:** Email trống → `Email is required.` **Android:** `Email is required.` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_add_empty_submit_viewport.png` · Android: Kiểm chứng thực tế · android_user_add_empty_submit.png |
| REQ-BK-USER-28 | Add user: Password bắt buộc | Android · Web | Web khác API: API cho bỏ trống và gán mật khẩu mặc định (F-07) — `AMB-BK-USER-02` | **Web:** Password trống → `Password is required.` **Android:** `Password is required.` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_add_empty_submit_viewport.png` · Android: Kiểm chứng thực tế · android_user_add_empty_submit.png |
| REQ-BK-USER-29 | Add user: bỏ trống Password Confirmation bị chặn | Android · Web |  | **Web:** Confirmation trống → `Password confirmation is required.` **Android:** `Password confirmation is required.` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_add_empty_submit_viewport.png` · Android: Kiểm chứng thực tế · android_user_add_empty_submit.png |
| REQ-BK-USER-30 | Add user: Name tối đa 191 ký tự | Android · Web | Giới hạn chính thức **191** — kỳ vọng, web hiện **chưa đạt** (`AMB-BK-USER-09` ✅ · DEMO-AMB-2509B). Cùng biên với Sign up (REQ-BK-AUTH-73) | **Web:** Name 191 ký tự → không lỗi · 192 ký tự → dưới ô có lỗi độ dài và **không** gửi request. **Hiện tại:** web cho tới 250 (251 ký tự → `Name must be less than 250 characters.`); Name 192 – 250 ký tự vượt kiểm tra của web nhưng server trả `400` (REQ-BK-USER-76) — cách web hiển thị lỗi này **chưa quan sát** **Hiện tại — Android:** như web — Name **192** ký tự → **không** lỗi · **251** ký tự → `Name must be less than 250 characters.` · ô nhận đủ 251 ký tự | 🟡 | 25-09-2026 · DEMO-AMB-2509B · 26-09-2026 · + Android | Web: Kiểm chứng thực tế (250 / 251) · đọc lỗi bằng DOM — biên 191 / 192: quyết định PO, **chưa kiểm chứng trên web** · Android: Kiểm chứng thực tế · android_user_add_invalid_fields.png · đọc `text` + lỗi |
| REQ-BK-USER-31 | Add user: Email sai định dạng bị chặn | Android · Web |  | **Web:** Email `khong-phai-email` → `Invalid email address` **Android:** `Invalid email address` | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · đọc lỗi bằng DOM · Android: Kiểm chứng thực tế · android_user_add_invalid_fields.png |
| REQ-BK-USER-36 | Hộp thoại Update user điền sẵn dữ liệu | Android · Web |  | **Web:** ⋮ → `Edit` → hộp thoại `Update user` cùng bố cục Add user: Name · Phone · Email · `Active for login` **điền sẵn** giá trị hiện tại · `Password` và `Password Confirmation` **trống, không có dấu `*`** · nút `Cancel` · `Update` **Android:** (app vừa mở lại) ⋮ → `Edit` → `Update user` điền sẵn Name · Phone · Email · Password và Password Confirmation trống, **không** `*` · công tắc hiển thị bật · `Cancel` · `Update`. Mở sau khi đã có lỗi ở Add user thì mang lỗi cũ — REQ-124 | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_update_dialog_default_viewport.png` · đọc `value` + `required` · Android: Kiểm chứng thực tế · android_user_update_dialog_default_part1.png · android_user_update_dialog_default_part2.png |
| REQ-BK-USER-41 | Xoá cần xác nhận | Android · Web |  | **Web:** ⋮ → `Delete` → hộp thoại `Confirm delete` nội dung `Confirm you want to delete user "<Name>".` (đúng Name hiện tại) · nút `Cancel` · `Delete` **Android:** ⋮ → `Delete` → `Confirm delete` · `Confirm you want to delete user "<Name>".` · `Cancel` (id `dialog-delete-cancel`) · `Delete` (id `dialog-delete-action`). Bấm `Cancel` → hộp đóng, dòng còn nguyên | 🟢 | 26-09-2026 · + Android | Web: Kiểm chứng thực tế · `web_user_delete_confirm_viewport.png` · Android: Kiểm chứng thực tế · android_user_delete_confirm.png |

**Mục 3.2: 31 REQ** — mọi dòng `Nền tảng` = `Android · Web`.

---

## 6. Ma trận Phân quyền

Hệ thống **không** lộ khái niệm vai trò trên web (không chọn vai trò khi tạo người dùng, không có màn hình phân quyền). Cột có căn cứ: **Khách** và **người dùng tự tạo** (đăng ký hoặc tạo qua Add user).

| Hành động (Web) | Khách | Đã đăng nhập (tài khoản tự tạo) | Vai trò khác (nếu có) |
|---|---|---|---|
| Xem danh sách (kèm email · phone · địa chỉ) | ✅ (REQ-01) | ✅ | — |
| Tìm kiếm · lọc · sắp xếp | ✅ (REQ-08 · 15 · 10) | ✅ (REQ-08) | — |
| Thêm người dùng (`New user`) | ❌ — không có nút (REQ-19) | ✅ (REQ-34) | — |
| Sửa người dùng **khác** | ❌ — không có ⋮ (REQ-19) | ✅ (REQ-23 · 37) | — |
| Xoá người dùng **khác** | ❌ — không có ⋮ (REQ-19) | ✅ (REQ-23 · 42) | — |
| Sửa / xoá **chính mình** từ danh sách | — | ❌ — Edit/Delete khoá (REQ-22) | — |

```
Tổng 18 ô = Đã kiểm chứng 11 · Suy diễn 0 · Chưa rõ 0 · Không áp dụng 7
Ô "không áp dụng" là [Sửa/xoá chính mình × Khách] — khách không có tài khoản.
Và cột "Vai trò khác" × 6 hành động — hệ thống không có vai trò nào khác (AMB-BK-USER-01 · AMB-BK-01 ✅ 25-09-2026).
Ô "Đã đăng nhập × Sửa/Xoá người dùng khác" chỉ thử trên tài khoản do chính phiên tạo.
```


### Ma trận phân quyền — mặt Android

| Hành động (Android) | Khách | Đã đăng nhập (tài khoản test) | Vai trò khác |
|---|---|---|---|
| Xem · tìm · lọc · sắp xếp danh sách | ❔ (bản đồ khám phá 19-09-2026 ghi thấy được — chưa kiểm ở mức REQ) | ✅ (REQ-02 → 18) | — |
| Thấy `New user` · nút ⋮ | ❔ | ✅ (REQ-20) | — |
| Edit · Delete người dùng **khác** (mở được) | ❔ | ✅ (REQ-23) | — |
| Edit · Delete **chính mình** | — | ❌ khoá (REQ-22) | — |

```
Tổng 12 ô = Đã kiểm chứng 4 · Suy diễn 0 · Chưa rõ 3 · Không áp dụng 5
Ô "chưa rõ": cột Khách — lượt 26-09-2026 chỉ có phiên đã đăng nhập (không mở AMB mới: web đã kiểm, bản đồ khám phá đã thấy).
Ô "không áp dụng": [chính mình × Khách] · cột "Vai trò khác" × 4 (AMB-BK-01 ✅).
Chỉ **mở** menu / hộp thoại trên dòng người khác, không lưu hay xoá.
```

### Ma trận phân quyền — mặt API

| Operation (API) | Không token | Token hợp lệ (tài khoản tự tạo) | Vai trò khác (nếu có) |
|---|---|---|---|
| `GET /api/user` · `GET /api/user/{id}` | ✅ 200 (REQ-01 · 67) | ✅ 200 | — |
| `POST /api/user` | ❌ 401 (REQ-71 · 72) | ✅ 201 (REQ-69) | — |
| `PATCH /api/user/{id}` — người dùng **khác** | ❌ 401 (REQ-102) | ✅ 200 — kể cả đổi mật khẩu của họ (REQ-97 · 104) | — |
| `PATCH /api/user/{id}` — **chính mình** | — | ✅ 200 (REQ-105) | — |
| `DELETE /api/user/{id}` — người dùng **khác** | ❌ 401 (REQ-111) | ✅ 200 (REQ-114) | — |
| `DELETE /api/user/{id}` — **chính mình** | — | ✅ 200 (REQ-110 — dùng ở bước dọn dữ liệu) | — |

```
Tổng 18 ô = Đã kiểm chứng 10 · Suy diễn 0 · Chưa rõ 0 · Không áp dụng 8
Ô "không áp dụng": cột "Vai trò khác" × 6 hành động (hệ thống không có vai trò — AMB-BK-01 ✅) và
[PATCH · DELETE chính mình] × Không token (không có tài khoản để gọi).
Mọi ô ghi/xoá chỉ thử trên tài khoản do chính lượt chạy tạo.
```

---

## 7. Ma trận Trạng thái

Entity người dùng có trạng thái `isActive` (hiển thị `Active` / `Inactive`).

| Trạng thái hiện tại | Hành động cho phép | Trạng thái kế tiếp | Ai được thực hiện | Hệ quả |
|---|---|---|---|---|
| — (chưa có) | Add user với `Active for login` bật (mặc định) | Active | Người dùng đã đăng nhập bất kỳ | Đăng nhập được (REQ-35) |
| — (chưa có) | Add user với `Active for login` tắt | Inactive | Người dùng đã đăng nhập bất kỳ | ❔ Chưa thử |
| — (chưa có) | Tự đăng ký (Sign up) | Active | Khách | Đăng nhập được (REQ-BK-AUTH-03) |
| Active | Update → tắt `Active for login` | Inactive | Người dùng đã đăng nhập, **trừ** chính tài khoản đó | Không đăng nhập được — `User account is disabled.` (REQ-39 · AUTH-100) |
| Inactive | Update → bật `Active for login` | Active | Như trên | Đăng nhập lại được (REQ-40) |
| Active · Inactive | Delete | (đã xoá) | Như trên | Biến mất khỏi danh sách (REQ-42) |

### Bổ sung mặt API

| Trạng thái hiện tại | Hành động (API) | Trạng thái kế tiếp | Hệ quả quan sát |
|---|---|---|---|
| — (chưa có) | `POST /api/user` không `isActive` | Active | Đăng nhập được (REQ-82 · 35) |
| — (chưa có) | `POST /api/user` `isActive: false` | Inactive | `POST /api/login` → 403 `User account is disabled.` (REQ-83) |
| Active | `PATCH` `isActive: false` | Inactive | Đăng nhập → 403 (REQ-99) · `GET /api/me` bằng token cũ → 403 · **refresh token vẫn cấp được access token mới** (REQ-109 ❌ F-34 — token mới cũng bị 403 ở `/api/me`) |
| Inactive | `PATCH` `isActive: true` | Active | Đăng nhập lại được (REQ-100) |
| Active · Inactive | `DELETE` | (đã xoá) | Refresh token bị xoá (REQ-113) · access token cũ → 401 `User no longer exists` · sách của họ còn với `auth` = `null` (REQ-BK-BOOK-135) |

Phiên **đang mở** của người dùng vừa bị chuyển Inactive **không** bị cắt — hết khi access token hết hạn (`AMB-BK-USER-03` ✅ chốt 25-09-2026). Không cấp REQ.

---

## 10. Phân rã Epic / Story

| Story ID | Tên Story | REQ bao phủ | Số REQ | AMB / RISK liên quan | Ghi chú phạm vi |
|---|---|---|---|---|---|
| STORY-BK-USER-01 | Danh sách · tìm kiếm · sắp xếp · phân trang | REQ-BK-USER-01 → 10 · 120 · 121 · 125 · 128 | 14 | AMB-BK-USER-04 · 07 · 20 · RISK-BK-USER-01 · 02 · 03 · 09 | Khách và người dùng đăng nhập · Android: cuộn ngang, điều hướng, mất mạng |
| STORY-BK-USER-02 | Bộ lọc nâng cao | REQ-BK-USER-11 → 18 · 122 · 123 | 10 | AMB-BK-USER-06 · 18 | Field · Operator · Value · AND/OR |
| STORY-BK-USER-03 | Quyền thao tác theo trạng thái đăng nhập | REQ-BK-USER-19 → 23 | 5 | AMB-BK-USER-01 | Nút New user · ⋮ · khoá thao tác trên chính mình |
| STORY-BK-USER-04 | Thêm người dùng | REQ-BK-USER-24 → 35 · 124 · 126 · 127 | 15 | AMB-BK-USER-02 · 05 · 19 | Hộp thoại Add user (Android: lỗi dính, xuống nền, bàn phím) |
| STORY-BK-USER-05 | Sửa người dùng · khoá/mở | REQ-BK-USER-36 → 40 | 5 | AMB-BK-USER-03 | Hộp thoại Update user · `Active for login` |
| STORY-BK-USER-06 | Xoá người dùng | REQ-BK-USER-41 → 42 | 2 | RISK-BK-USER-04 | Hộp thoại Confirm delete |
| STORY-BK-USER-07 | Danh sách · tìm kiếm · sắp xếp · phân trang — API | REQ-BK-USER-43 → 65 · 116 → 119 | 27 | AMB-BK-USER-08 · 12 · 14 · RISK-BK-USER-05 · 06 · 08 | `GET /api/user` — mặt API |
| STORY-BK-USER-08 | Chi tiết người dùng — API | REQ-BK-USER-66 → 68 | 3 | — | `GET /api/user/{id}` |
| STORY-BK-USER-09 | Tạo người dùng — API | REQ-BK-USER-69 → 90 | 22 | AMB-BK-USER-09 · 10 · 15 · 16 | `POST /api/user` |
| STORY-BK-USER-10 | Sửa người dùng — API | REQ-BK-USER-91 → 109 | 19 | AMB-BK-USER-09 · 11 · 13 | `PATCH /api/user/{id}` |
| STORY-BK-USER-11 | Xoá người dùng — API | REQ-BK-USER-110 → 114 | 5 | AMB-BK-USER-17 · RISK-BK-USER-07 | `DELETE /api/user/{id}` |
| STORY-BK-USER-12 | Quy ước chung của module — API | REQ-BK-USER-115 | 1 | — | Error envelope 422 |

**Tổng: 12 Story / 128 REQ** — Web · Android `14 + 10 + 5 + 15 + 5 + 2 = 51` · API `27 + 3 + 22 + 19 + 5 + 1 = 77` → `51 + 77 = 128 ✔` · mọi REQ thuộc đúng một Story, không mồ côi, không trùng.

### Đối chiếu AMB / RISK

| Nhóm | Mã | Nằm ở đâu |
|---|---|---|
| AMB thuộc Story | AMB-BK-USER-01 → 20 | phân bổ ở bảng Story |
| AMB cấp Epic | — | — |
| RISK thuộc Story | RISK-BK-USER-01 → 09 | phân bổ ở bảng Story |
| RISK cấp Epic | — | — |

### Hạng mục cấp Epic (cố ý không gán vào Story nào)

| Hạng mục | Lý do |
|---|---|
| Ma trận phân quyền (6) · Ma trận trạng thái (7) | Cắt ngang Story 03 · 04 · 05 · 06 |
| Tham chiếu `AMB-BK-01` · `AMB-BK-02` · `AMB-BK-12` | AMB **cấp hệ thống**, sở hữu ở `api_map.md` / `system_map.md` — module chỉ tham chiếu |

### Thứ tự triển khai đề xuất

1. **STORY-BK-USER-01 Danh sách** — nền cho mọi Story khác (tìm dòng dữ liệu test)
2. **STORY-BK-USER-04 Thêm** — tạo dữ liệu test cho Story 05 · 06 (tránh đụng dữ liệu người khác)
3. **STORY-BK-USER-05 Sửa · khoá/mở** — phụ thuộc Story 04; nối với REQ-BK-AUTH-100
4. **STORY-BK-USER-06 Xoá** — dùng để dọn dữ liệu cuối mỗi TC
5. **Mặt API (Story 07 → 12):** cùng thứ tự — `09 Tạo` trước để có dữ liệu cho `10` · `11` · `08`; `07` (đọc) chạy trước cùng với `08`; REQ ghi `❌ lệch` chạy như `@KnownBug`
6. **STORY-BK-USER-02 Bộ lọc** · **STORY-BK-USER-03 Quyền** — `AMB-BK-USER-01` ✅ chốt: không có vai trò, hành vi hiện tại là thiết kế — TC viết theo hiện trạng
7. **Android:** cùng thứ tự; Story 04 → 06 trên Android còn ❔ ở vế ghi dữ liệu (tester nhập mật khẩu). `REQ-120` · `124` kỳ vọng FAIL — TC `@KnownBug`

---

## 11. Điểm Mơ Hồ & Rủi Ro

### 11.1. Ambiguities

| Mã | Câu hỏi | Nguy cơ | Mức độ | Assumption tạm | Trạng thái | Kết luận |
|---|---|---|---|---|---|---|
| AMB-BK-USER-01 | Hệ thống có vai trò quản trị không? Người dùng tự đăng ký có được **sửa/xoá người dùng khác** như hiện tại (REQ-23)? Xin tài khoản vai trò khác (nếu có) để kiểm 6 ô `❔` của ma trận phân quyền. *(Cùng gốc `AMB-BK-01` · F-02.)* | Bất kỳ ai tự đăng ký cũng xoá/khoá được mọi tài khoản — kể cả tài khoản quản trị | 🔴 | Hành vi hiện tại là thiết kế của hệ thống thực hành — TC viết theo hiện trạng, gắn `assumption-based` | ✅ Đã chốt 25-09-2026 | Hệ thống **không có** mô hình vai trò (theo `AMB-BK-01`) — mọi người dùng đã đăng nhập ngang quyền; sửa/xoá người dùng khác là **thiết kế** của hệ thống thực hành. REQ-23 giữ nguyên; cột *Vai trò khác* của ma trận phân quyền → **Không áp dụng** (DEMO-AMB-2509) |
| AMB-BK-USER-02 | Add user trên web **bắt buộc** Password (REQ-28), trong khi `POST /api/user` cho bỏ trống và gán mật khẩu mặc định (F-07). Rule đúng là gì? | Tạo qua API ra tài khoản mật khẩu đoán được; hai nền tảng lệch nhau | 🟡 | Web đúng — Password bắt buộc; F-07 là lỗi API | ✅ Đã chốt 25-09-2026 | Web đúng — Password **bắt buộc**; F-07 (API gán mật khẩu mặc định) là **lỗi API**, xử lý khi sinh REQ mặt API. REQ-28 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-USER-03 | Chuyển người dùng sang Inactive có **cắt phiên đang mở** của họ không (spec: *"Sửa user + thu hồi refresh token cũ"*)? Bấm vào dòng (con trỏ hình bàn tay) không mở gì — có trang/hộp chi tiết người dùng không? | Người bị khoá vẫn thao tác tiếp tới khi token hết hạn (6 ngày); không viết được TC chi tiết người dùng | 🟡 | Không cắt phiên · không có trang chi tiết — không cấp REQ | ✅ Đã chốt 25-09-2026 | **Không** cắt phiên đang mở — phiên hết khi access token hết hạn (cùng `AMB-BK-AUTH-06`) · **không có** trang chi tiết người dùng. Trùng Assumption, không cấp REQ (DEMO-AMB-2509) |
| AMB-BK-USER-04 | Số dòng mỗi trang **không** được giữ khi rời trang rồi quay lại (REQ-07). Cố ý? | Người dùng phải chọn lại mỗi lần | 🟡 | Cố ý — REQ-07 theo quan sát | ✅ Đã chốt 25-09-2026 | **Cố ý** — REQ-07 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-USER-05 | Upload photo (Add/Update user, My Profile): giới hạn thật là 3.0 MB? Định dạng ngoài danh sách bị chặn thế nào? Ảnh cũ bị xoá khi đổi ảnh? | Không viết được TC tải ảnh; rác tệp trên server | 🟡 | Chưa cấp REQ — cần một lượt khảo sát riêng (liên quan module `FILE`) | ✅ Đã chốt 25-09-2026 | Giới hạn **3.0 MB**, đúng 7 định dạng ghi dưới ô; ảnh cũ **không** bị xoá khi đổi (dọn ở module `FILE`). Tải ảnh đại diện **để ngoài phạm vi** đợt kiểm thử web này — khảo sát cùng module `FILE` (DEMO-AMB-2509) |
| AMB-BK-USER-06 | Ô tìm kiếm và bộ lọc nâng cao **không dùng cùng lúc** được — mở bộ lọc thì ô tìm kiếm biến mất, cả hai dùng chung tham số `search` (REQ-11). Cố ý? | Người dùng tưởng đang lọc kết hợp với từ khoá cũ | 🟡 | Cố ý — hai chế độ loại trừ nhau | ✅ Đã chốt 25-09-2026 | **Cố ý** — hai chế độ loại trừ nhau. REQ-11 giữ nguyên (DEMO-AMB-2509) |
| AMB-BK-USER-07 | Ngày giờ hiển thị `25 Th09 2026` + `12:58 AM` — trộn tháng tiếng Việt với giờ 12h AM/PM, theo múi giờ trình duyệt. Quy ước hiển thị chuẩn là gì? | TC so ngày giờ lệch theo máy chạy | 🟡 | Giữ hiện trạng; TC chỉ so **ngày**, không so giờ | ✅ Đã chốt 25-09-2026 | Quy ước chuẩn: ngày `dd ThMM yyyy` + giờ 12h theo múi giờ trình duyệt — trùng hiện trạng. TC chỉ so **ngày** (DEMO-AMB-2509) |
| AMB-BK-USER-08 | Bộ lọc JSON của `GET /api/user?search=` chấp nhận điều kiện trên **trường nội bộ** của bản ghi (không thuộc 9 khoá công khai) — cố ý hay lỗi? (F-32) | Lộ dữ liệu nhạy cảm của mọi người dùng qua endpoint **công khai** | 🔴 | Là lỗi bảo mật — chỉ 9 khoá công khai được làm điều kiện lọc | ✅ Đã chốt 25-09-2026 | **Lỗi bảo mật** — chỉ 9 khoá công khai (REQ-43) được phép lọc; trường khác → 400. **Sinh `REQ-BK-USER-116`** (kỳ vọng, hiện chưa đạt — **cần Dev xác minh**). TC chỉ kiểm **status**, **không** đọc/ghi lại nội dung, không dò giá trị (DEMO-AMB-2509B) |
| AMB-BK-USER-09 | Độ dài tối đa của `name`: web cho tới **250** (REQ-30), API chặn từ **192** ký tự (400 `Invalid data.` không `fields`). Giới hạn đúng là bao nhiêu? (cùng `AMB-BK-AUTH-33`) | Người dùng nhập 200 ký tự, web cho qua, server báo lỗi khó hiểu | 🟠 | Giới hạn thật của cột lưu trữ (191) là chính thức | ✅ Đã chốt 25-09-2026 | Giới hạn chính thức **191** ký tự. **Sửa `REQ-BK-USER-30`** 🟡 (web phải chặn từ 192 — hiện chưa đạt) · sinh `REQ-BK-USER-76` · `108` (API) (DEMO-AMB-2509B) |
| AMB-BK-USER-10 | `name` rỗng: web chặn (`Name is required.`), API tạo được tài khoản tên rỗng (K-38) | Hai nền tảng lệch nhau; tài khoản không có tên | 🟠 | API lỗi (nghi lỗi mặc định) | ✅ Đã chốt 25-09-2026 | **Lỗi API** — `name` rỗng phải bị từ chối. **Sinh `REQ-BK-USER-75`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-USER-11 | `PATCH /api/user/{id}` **không** thu hồi refresh token cũ dù spec mô tả *"revoke old refresh tokens"* — sau đổi mật khẩu / khoá tài khoản cookie cũ vẫn làm mới được token (F-34) | Người bị khoá hoặc bị đổi mật khẩu vẫn giữ phiên làm mới | 🟠 | Spec đúng, hệ thống lỗi | ✅ Đã chốt 25-09-2026 | **Lỗi** — sửa người dùng phải thu hồi refresh token. **Sinh `REQ-BK-USER-109`** (kỳ vọng, chưa đạt). Nhánh xoá người dùng (`REQ-113`) **đã đúng** (DEMO-AMB-2509B) |
| AMB-BK-USER-12 | Body 400 của bộ lọc sai cú pháp mang chuỗi `error` có đường dẫn máy chủ và tên thư viện truy cập dữ liệu (F-33) | Lộ thông tin nội bộ giúp tấn công | 🟡 | Là lỗi | ✅ Đã chốt 25-09-2026 | **Lỗi** — body lỗi không được lộ chi tiết nội bộ. **Sinh `REQ-BK-USER-117`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-USER-13 | API cho người dùng **tự sửa / tự xoá chính mình** (`PATCH` · `DELETE` → 200), web khoá Edit/Delete dòng của chính mình (REQ-22) | Hai nền tảng lệch nhau | 🟡 | Cố ý — web khoá để tránh tự khoá/tự xoá nhầm, API không chặn | ✅ Đã chốt 25-09-2026 | **Cố ý** — không phải lỗi. `REQ-BK-USER-22` (web) và `REQ-BK-USER-105` (API) đều **giữ nguyên** (DEMO-AMB-2509B) |
| AMB-BK-USER-14 | `pagination.lengthData` ở `USER` bằng `limit` yêu cầu, ở `BOOK` bằng số phần tử thực; `limit=1.5` được nhận | Client tính số dòng sai; hai endpoint cùng dạng khác nghĩa | 🟡 | `lengthData` = số phần tử thực; `limit` phải là số nguyên | ✅ Đã chốt 25-09-2026 | Theo Assumption. **Sinh `REQ-BK-USER-118`** · **`REQ-BK-USER-119`** (kỳ vọng, chưa đạt) · `BOOK` chỉ lệch ở `limit` số lẻ (DEMO-AMB-2509B) |
| AMB-BK-USER-15 | `POST /api/user` kiểm dữ liệu **trước** kiểm token (không token + body sai → 422 thay vì 401) (F-26) | Lộ thông tin cấu trúc dữ liệu cho người chưa đăng nhập | 🟡 | Lỗi — xác thực phải chạy trước | ✅ Đã chốt 25-09-2026 | **Lỗi** — **sinh `REQ-BK-USER-90`** (kỳ vọng, chưa đạt) (DEMO-AMB-2509B) |
| AMB-BK-USER-16 | Không có chính sách mật khẩu (1 ký tự vẫn tạo được); `password` rỗng trả 400 (không phải 422) | TC biên mật khẩu không có căn cứ | 🟡 | Không có chính sách (trùng `AMB-BK-AUTH-08`) | ✅ Đã chốt 25-09-2026 | **Không có** chính sách độ dài/độ mạnh — không cấp REQ biên. `password` rỗng phải bị từ chối (**`REQ-BK-USER-80`**, AC không assert mã 400) (DEMO-AMB-2509B) |
| AMB-BK-USER-17 | Spec khai `400`/`422` cho `DELETE /api/user/{id}` nhưng không quan sát được điều kiện phát sinh | TC lỗi cho `DELETE` không có căn cứ | 🟢 | Khai thừa | ✅ Đã chốt 25-09-2026 | **Khai thừa** — không cấp REQ (DEMO-AMB-2509B) |
| AMB-BK-USER-18 | Trên Android hàng điều kiện lọc rộng hơn màn hình — `Value` chỉ lộ 24 px, `Add filter` · `Clear filter` nằm ngoài, phải vuốt ngang (REQ-122). Chấp nhận? | Người dùng không thấy ô Value, tưởng bộ lọc hỏng | 🟡 | Chấp nhận — cuộn ngang được | ✅ Đã chốt 26-09-2026 | **Chấp nhận hiện trạng** ở bản 1.0 — trùng Assumption. REQ-122 giữ nguyên (DEMO-AMB-2609) |
| AMB-BK-USER-19 | Trên Android, lỗi validation của Add user còn nguyên khi mở lại Add user và lan sang Update user (dữ liệu hợp lệ vẫn báo đỏ, kể cả `Password is required.`) | Người dùng không sửa được người dùng khác; tưởng dữ liệu sai | 🟠 | Là **lỗi** — mỗi lần mở hộp thoại phải sạch lỗi | ✅ Đã chốt 26-09-2026 | **Lỗi** — trùng Assumption. **Sinh `REQ-BK-USER-124`** (kỳ vọng, chưa đạt). Web chưa kiểm — cần tester thử trên web (DEMO-AMB-2609) |
| AMB-BK-USER-20 | Mất mạng trên Android: danh sách hiện `No Data` như khi không có kết quả, không có thông báo lỗi mạng | Người dùng tưởng hệ thống không còn người dùng nào | 🟡 | Chấp nhận — cùng kết luận `AMB-BK-AUTH-16` | ✅ Đã chốt 26-09-2026 | **Chấp nhận hiện trạng** ở bản 1.0 — REQ-125 ghi hành vi quan sát (DEMO-AMB-2609) |

**AMB cấp hệ thống tham chiếu** (sở hữu ở [`api_map.md` mục 4](../_discovery/api_map.md#4-khoảng-trống-của-spec-amb--cần-chốt-trước-khi-sinh-tc) · [`system_map.md` mục 8](../_discovery/system_map.md#8-ambiguity-cấp-hệ-thống-phát-sinh-ở-mặt-mobile)) — **đều đã chốt 25-09-2026**: `AMB-BK-01` không có mô hình vai trò · `AMB-BK-02` danh sách người dùng công khai là **cố ý** (REQ-01 là hành vi đúng) · `AMB-BK-12` lỗi điều hướng Android (không áp dụng web) — cấp `REQ-BK-USER-120` ngày 26-09-2026 như kết luận đã ghi.

### 11.2. Risks

| Mã | Rủi ro | Mô tả | Mitigation |
|---|---|---|---|
| RISK-BK-USER-01 | Dữ liệu cá nhân lọt vào evidence | Danh sách công khai hiện email · phone · địa chỉ của người thật; ảnh chụp bị commit vào repo | Làm mờ mọi dòng không phải dữ liệu test trước khi chụp (web mục 1) · TC chụp ảnh theo dòng đã lọc bằng email test |
| RISK-BK-USER-02 | Đếm dòng sai | Bảng chèn `<tr>` rỗng khi ít kết quả | Automation lọc `tr` có > 1 ô; assert theo nội dung dòng |
| RISK-BK-USER-03 | Dữ liệu rác lớn trên server duy nhất | ≈ 2.700 người dùng, phần lớn tài khoản test cũ; thứ tự thay đổi liên tục (sắp theo `Updated`) | Mọi TC tìm dữ liệu bằng email riêng `auto_user_<timestamp>`; không assert tổng số / số trang cụ thể |
| RISK-BK-USER-04 | Tài khoản test cuối cùng luôn sót | Không tự xoá chính mình từ giao diện (REQ-22) → tài khoản dùng để xoá người khác không tự dọn được | TC tạo 2 tài khoản và xoá chéo; tài khoản còn lại dọn ở teardown bằng API (token của chính nó) — việc của tầng automation, không phải recon UI |
| RISK-BK-USER-05 | Dữ liệu nhạy cảm qua bộ lọc công khai | Điều kiện lọc trên trường nội bộ (F-32, `AMB-BK-USER-08`) | TC của REQ-116 chỉ kiểm **status**, không đọc nội dung, không dò giá trị; không ghi chi tiết kỹ thuật vào báo cáo |
| RISK-BK-USER-06 | `limit=10000` kéo toàn bộ người dùng | Một request trả email · điện thoại · địa chỉ của mọi người (≈ 2,7 nghìn bản ghi) | TC chỉ đếm `list.length`, **không** lưu / in nội dung; ảnh chụp và log không chứa dữ liệu này |
| RISK-BK-USER-07 | Tài khoản Inactive khó dọn | Tài khoản bị khoá không đăng nhập được nên không xoá bằng token của chính nó | Teardown xoá bằng token của `userA` (cũng do phiên tạo) — **không** dùng token của tài khoản có sẵn |
| RISK-BK-USER-08 | Body lỗi 400 lộ thông tin máy chủ | `error` chứa đường dẫn thư mục và tên thư viện (F-33) | Không chép `error` vào report / Allure / evidence; assert theo `msg` |

| RISK-BK-USER-09 | Locator và trạng thái trên Android không đọc được | Nút ⋮ · icon lọc không nhãn · `Switch.checked` luôn `false` · XPath trong WebView đôi lúc không tìm thấy phần tử · Back khi bàn phím đã đóng làm rời màn hình | Bắt ⋮ theo quan hệ với dòng email test · dùng `UiSelector` · assert trạng thái qua nhãn `Active`/`Inactive` · kiểm `mInputShown` trước khi Back · đề nghị dev thêm `aria-label` |

---

## 13. Nhật ký Thay đổi

| Ngày | Nguồn | REQ ảnh hưởng | Loại | Tóm tắt thay đổi | TC cần xử lý |
|---|---|---|---|---|---|
| 26-09-2026 | UI recon Android · `/generate-requirements-from-mobile` · DEMO-AMB-2609 | REQ-BK-USER-120 → 128 | 🟢 Thêm | Khởi tạo mặt Android: 9 REQ ở `mobile/` (`120` tab User không về danh sách — kỳ vọng, `AMB-BK-12` · `121` bảng cuộn ngang · `122` bảng lọc cuộn ngang · `123` đổi Field xoá Value · `124` lỗi dính giữa các hộp thoại — kỳ vọng · `125` mất mạng · `126` xuống nền · `127` bàn phím · `128` Back) · 23 ảnh (dòng người khác làm mờ) · chốt `AMB-BK-USER-18 → 20` · thêm `RISK-BK-USER-09` | viết mới cho Android (tag `@Android`) · `120` · `124` `@KnownBug` |
| 26-09-2026 | UI recon Android | REQ-BK-USER-02 → 18 · 20 → 31 · 36 · 41 | 🟢 Thêm | **Mở rộng nền tảng: + Android** — chuyển 31 dòng từ `web/` lên index mục 3.2 (`Android · Web`), AC web giữ nguyên + thêm vế Android, mã giữ nguyên. `30` Android cũng chưa đạt biên 191 | viết mới cho Android · TC web giữ nguyên |
| 26-09-2026 | UI recon Android | — | ✏️ Biên tập | Mục 3 tách `3.1 Web · API` · `3.2 Android · Web` · thêm ma trận phân quyền Android · Bản đồ tài liệu · bảng Story (01 → 14 · 02 → 10 · 04 → 15 REQ) | — |
| 25-09-2026 | DEMO-AMB-2509B (chốt AMB giả lập — dữ liệu dạy học demo) | REQ-BK-USER-116 → 119 · 30 | 🟢 Thêm · 🟡 Sửa | Chốt `AMB-BK-USER-08` → `17`. **Thêm** `116` (bộ lọc chỉ nhận 9 trường công khai) · `117` (body 400 không lộ nội bộ) · `118` (`lengthData` = số phần tử thực) · `119` (`limit` số nguyên) — cả bốn kỳ vọng, hiện chưa đạt. **Sửa** `30` (web): Name tối đa 250 → **191** ký tự (web chưa đạt). Các REQ API `75` · `79` · `90` · `92` · `109` là kỳ vọng chưa đạt (`@KnownBug`) | `BK_USER_TC_036` · `037` → review (biên 250/251 → 191/192, `@KnownBug`) · TC API: neo lại REQ + thêm TC cho `116 → 119` (xem `docs/testcases/_book-api/user/`) |
| 25-09-2026 | `/generate-requirements-from-api` (spec không đổi — `sha256` trùng) | REQ-BK-USER-01 · 33 · 35 · 38 | 🟢 Thêm | **Mở rộng nền tảng: + API** — chuyển lên index (mục 3), `Nền tảng` = `Web · API`, mã giữ nguyên | viết mới cho API (TC web giữ nguyên) |
| 25-09-2026 | `/generate-requirements-from-api` — 5 operation `/api/user*`, ≈ 360 request gọi thật | REQ-BK-USER-43 → 115 | 🟢 Thêm | Khởi tạo mặt API: 73 REQ / 6 Story (`07 → 12`) · 10 AMB (`08 → 17`, 1 🔴) · 4 RISK (`05 → 08`). Phát hiện **F-32 → F-34** (1 🔴 · 2 🟠) và điểm đúng (xoá người dùng thu hồi refresh token; mass assignment bị chặn; ký tự đặc biệt lưu nguyên). Dọn 40/40 tài khoản tự tạo | viết mới — 31 TC API hiện có (`BK_USER_TC_051` → `081`) neo tạm vào REQ Web → neo lại theo REQ API |
| 25-09-2026 | DEMO-AMB-2509 (chốt AMB giả lập — dữ liệu dạy học demo) | — (REQ không đổi) | ✏️ Chốt AMB | Chốt toàn bộ `AMB-BK-USER-01` → `07` — cả 7 trùng Assumption, **không** REQ nào đổi. Ma trận phân quyền: cột *Vai trò khác* → không áp dụng (`AMB-BK-01`). Ma trận trạng thái: ghi kết luận phiên không bị cắt khi Inactive. Upload photo chốt quy tắc nhưng để ngoài phạm vi đợt này | — chi tiết [impact/impact_DEMO-AMB-2509.md](impact/impact_DEMO-AMB-2509.md) |
| 25-09-2026 | UI recon Web · `/generate-requirements-from-website` | REQ-BK-USER-01 → 42 | 🟢 Thêm | Khởi tạo tài liệu module từ khảo sát web: 42 REQ / 6 Story · 7 AMB (1 🔴) · 4 RISK · 17 ảnh evidence. Mặt API/Android chưa có REQ | — (viết TC mới, tag `@Web`) |
