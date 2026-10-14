# Đặc tả Yêu cầu — Module Xác thực & Phiên đăng nhập (`AUTH`) · Nền tảng Web

> Index module (metadata dải mã · REQ dùng chung · phân quyền · Story · AMB/RISK · Nhật ký): [../REQUIREMENTS_AUTH_SUMMARY.md](../REQUIREMENTS_AUTH_SUMMARY.md) · Danh mục hệ thống: [../../README.md](../../README.md) · Bản đồ API: [../../_discovery/api_map.md](../../_discovery/api_map.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management (mã hệ thống `BK`) |
| **Module** | Xác thực & Phiên đăng nhập — phạm vi lượt này: **Đăng ký (Sign up) · Đăng nhập (Sign in) · Đăng xuất · My Profile · Setting account** |
| **Nền tảng** | **Web** ✅ — `https://book.anhtester.com` (React + MUI, cùng backend với API/Android) |
| **Trình duyệt khảo sát** | Google Chrome 153 (Playwright MCP, headed), viewport đo được `innerWidth × innerHeight = 1600 × 750`, `navigator.language = en-US`. Mọi AC về hiển thị/bố cục **chỉ đúng với trình duyệt + viewport này** |
| **Tầng network** | ✅ Quan sát **thụ động** request do UI phát sinh (`browser_network_requests`). **Không** gọi API trực tiếp |
| **Phương pháp** | Thao tác thật ngày 25-09-2026 — gửi form trống/sai để lấy message, đọc thuộc tính DOM (`type` · `required` · `disabled` · `aria-invalid` · `value`), đo thời gian sống của thông báo nổi bằng `MutationObserver` |
| **Tài khoản** | 2 tài khoản **tự tạo trong phiên**: `auto_web_<timestamp>_a@auto.test` (đăng ký qua Sign up) · `auto_web_<timestamp>_b@auto.test` (tạo qua Add user). Không đụng tài khoản có sẵn nào. Mục 10 |
| **REQ trong file này** | **24** — `REQ-BK-AUTH-87` → `REQ-BK-AUTH-121` trừ 11 REQ `101` · `102` · `105 → 108` · `113` · `116 → 119` — kiểm khớp trên Android ngày 26-09-2026, **chuyển lên** [index mục 3.3](../REQUIREMENTS_AUTH_SUMMARY.md#33-my-profile--setting-account-android--web) (`Android · Web`), mã giữ nguyên. Cộng **48 REQ dùng chung** ở index: 8 `Android · API · Web` + 40 `Android · Web` |

> **Thang `Nguồn`:** `Kiểm chứng thực tế` = đã thao tác trên web và xác nhận bằng ảnh (tên ảnh ở cột Nguồn, danh mục mục 9) hoặc số liệu DOM/network ghi trong AC. `API · <METHOD> <path> → <status>` = quan sát thụ động request do UI gửi. `❌ lệch (AMB-…)` = AC ghi hành vi **kỳ vọng**, hệ thống hiện chưa đạt.

---

## 2. Bản đồ phủ tài liệu

Không có tài liệu nào cho web — toàn bộ REQ sinh từ khảo sát thực tế. Rule đã có ở mặt API / Android được **đối chiếu** trên web: khớp thì mở rộng cột `Nền tảng` của REQ cũ ở index (37 REQ), không sinh REQ song song. File này chỉ chứa rule **riêng web** hoặc **chưa từng được ghi** ở nền tảng khác.

---

## 3. Yêu cầu Chức năng

### 3.1. Đăng nhập & phiên (STORY-BK-AUTH-02)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-AUTH-87 | Nhấn Enter trong form Sign in gửi đăng nhập | Form Sign in là thẻ `<form>` | Nhập email + mật khẩu đúng → con trỏ ở ô Password → nhấn `Enter` → gửi `POST /api/login` → chuyển sang Dashboard (`/`) · thông báo `Login successfully.` | 🟢 | — | Kiểm chứng thực tế · `web_signin_uppercase_email_enter_success_viewport.png` · API · POST /api/login → 200 |
| REQ-BK-AUTH-91 | Sign in giữ dữ liệu đã nhập khi rời trang trong ứng dụng rồi quay lại | Hành vi quan sát — PO chốt là thiết kế (`AMB-BK-AUTH-23` ✅) | (1) Sign in nhập Email `khong-phai-email` + Password bất kỳ → (2) bấm `Get started` sang Sign up → (3) quay lại Sign in (link `Sign in` hoặc sau khi đăng ký thành công) → ô Email **vẫn** chứa `khong-phai-email`, ô Password **vẫn** có ký tự (độ dài bằng lần nhập), lỗi `Invalid email address` vẫn hiện. Tải lại trang (F5) thì các ô trống | 🟢 | — | Kiểm chứng thực tế · `web_signup_success_redirect_signin_viewport.png` · đọc `value` 2 ô sau điều hướng |
| REQ-BK-AUTH-92 | Menu tài khoản trên web | Khác Android: không có `Exit app` | Đã đăng nhập → bấm nút avatar góc phải header (nhãn truy cập = chữ cái đầu của Name) → menu hiện Name + email của tài khoản · các mục `Home` · `Profile` · `Settings` · nút `Logout`. **Không** có mục `Exit app` | 🟢 | — | Kiểm chứng thực tế · `web_account_menu_open_viewport.png` |
| REQ-BK-AUTH-93 | Phiên đăng nhập được giữ khi tải lại trang | Vòng đời phiên trên trình duyệt | Đã đăng nhập → mở thẳng URL `/user-management` (tải lại toàn trang) → vẫn ở trạng thái đã đăng nhập: nút avatar hiện chữ cái đầu tên · có nút `New user` | 🟢 | — | Kiểm chứng thực tế · đọc DOM sau `goto` · API · GET /api/me → 200 |
| REQ-BK-AUTH-96 | Khách mở URL cần đăng nhập bị chuyển sang Sign in | Chặn truy cập trang ghi | Chưa đăng nhập → mở `/book-management/handle?name=Create-new-book` → chuyển sang `/sign-in?redirect=/book-management/handle` · thông báo `Please login first` | 🟢 | — | Kiểm chứng thực tế · `web_guest_protected_url_signin_viewport.png` · đọc URL + thông báo |
| REQ-BK-AUTH-97 | Đăng nhập từ trang có `redirect` quay về đúng URL gốc, giữ cả query | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-AUTH-25` ✅ chốt: phải giữ query) | Khách mở `/book-management/handle?name=Create-new-book` → bị chuyển sang Sign in (REQ-96) → đăng nhập đúng → phải tới **đúng URL gốc** `/book-management/handle?name=Create-new-book` (form `Create a new book`). **Hiện tại:** `redirect` chỉ lưu path → tới `/book-management/handle` (vẫn hiện form Create) — **mất** `?name=Create-new-book` | 🟡 | 25-09-2026 · DEMO-AMB-2509 | Kiểm chứng thực tế — ❌ lệch (`AMB-BK-AUTH-25`) · đọc URL + tiêu đề trang sau đăng nhập |
| REQ-BK-AUTH-98 | Đăng nhập không có `redirect` về Dashboard | | Khách đứng ở `/user-management` → bấm nút avatar → Sign in (`/sign-in`, không có `redirect`) → đăng nhập đúng → chuyển tới `/` (Dashboard), **không** quay lại `/user-management` | 🟢 | — | Kiểm chứng thực tế · đọc URL sau đăng nhập |
| REQ-BK-AUTH-99 | Đã đăng nhập vẫn mở được trang Sign in | Hành vi quan sát — PO chốt là thiết kế (`AMB-BK-AUTH-24` ✅) | Đã đăng nhập → mở `/sign-in` → vẫn hiển thị form Sign in (ô `Email address`), **không** tự chuyển về Dashboard. Phiên **không** bị huỷ (mở `/` vẫn thấy `Welcome <tên>`) | 🟢 | — | Kiểm chứng thực tế · đọc DOM sau `goto` |
| REQ-BK-AUTH-100 | Tài khoản bị khoá không đăng nhập được | Tác dụng của công tắc `Active for login` (module `USER` — REQ-BK-USER-39) | Tài khoản có `Active for login` **tắt** → Sign in với email + mật khẩu đúng → thông báo `User account is disabled.` · vẫn ở Sign in. Network: `POST /api/login` → **403** | 🟢 | — | Kiểm chứng thực tế · `../../user/web/evidence/web_user_inactive_login_blocked_viewport.png` · API · POST /api/login → 403 |
| REQ-BK-AUTH-121 | Tài khoản bị khoá được báo khoá trước khi kiểm mật khẩu | Chốt là thiết kế (`AMB-BK-AUTH-26` ✅) | Tài khoản có `Active for login` **tắt** → Sign in với email đúng + mật khẩu **sai** → thông báo `User account is disabled.` (**không** phải `Invalid password.`) · vẫn ở Sign in | 🟢 | 25-09-2026 · DEMO-AMB-2509 | Kiểm chứng thực tế — quan sát ở đợt recon 25-09-2026 (ghi tại `AMB-BK-AUTH-26`) · API · POST /api/login → 403 · chưa có ảnh riêng |

### 3.2. Đăng xuất (STORY-BK-AUTH-03)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-AUTH-94 | Đăng xuất đưa về Sign in kèm thông báo | | Đã đăng nhập → avatar → `Logout` → chuyển sang `/sign-in` · thông báo `Logout successfully.` · ô Email và Password **trống**. Network: `DELETE /api/logout` → 200 | 🟢 | — | Kiểm chứng thực tế · `web_logout_success_toast_viewport.png` |
| REQ-BK-AUTH-95 | Đăng xuất xoá token lưu trên trình duyệt | Tác tạo của đăng nhập phải bị gỡ (skill 4.3.8) | (1) Đăng nhập → xác nhận `localStorage` có khoá `accessToken` và `document.cookie` có `accessToken` → (2) Logout → (3) `localStorage` **không còn** khoá nào · `document.cookie` **không còn** `accessToken` | 🟢 | — | Kiểm chứng thực tế · đọc `localStorage` + `document.cookie` trước/sau |

### 3.3. Đăng ký (STORY-BK-AUTH-01)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-AUTH-88 | Nhấn Enter trong Sign up **không** gửi form | Nút `Register` nằm ngoài thẻ `<form>` — PO chấp nhận hiện trạng (`AMB-BK-AUTH-22` ✅) | Sign up điền đủ dữ liệu hợp lệ → con trỏ ở ô Password Confirmation → nhấn `Enter` → **không** có request `POST /api/register` · vẫn ở `/sign-up` | 🟢 | — | Kiểm chứng thực tế · network sau khi nhấn Enter · DOM: `Register` là `button[type=button]` không nằm trong `<form>` |
| REQ-BK-AUTH-89 | Địa chỉ gửi lên server là chuỗi ghép 3 ô | Cách lưu Address | Sign up chọn Division `Cao Bằng` + một Ward + Address `123 Auto Street` → Register → body `POST /api/register` có trường `address` = `"<Address>, <Ward>, <Division>"` · **không** gửi `password_confirmation` | 🟢 | — | API · POST /api/register → 201 (đọc request body) |
| REQ-BK-AUTH-90 | Đăng ký thành công thì form Sign up được làm trống | | Sau REQ-01 (web) → bấm `Get started` mở lại Sign up → cả 8 ô (Name · Phone · Division · Ward · Address · Email · Password · Password Confirmation) **trống**. Đối chứng: rời Sign up **khi chưa** đăng ký thì dữ liệu được giữ (REQ-83) | 🟢 | — | Kiểm chứng thực tế · đọc `value` 8 ô |

### 3.4. My Profile (STORY-BK-AUTH-04)

> ↗️ `101` · `102` · `105 → 108` · `113` **đã chuyển lên index** mục 3.3 ngày 26-09-2026 (kiểm khớp trên Android). REQ còn ở đây chưa kiểm được trên Android — lý do ở [../mobile/requirements_auth_mobile.md mục 2](../mobile/requirements_auth_mobile.md#2-bản-đồ-phủ-tài-liệu).

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-AUTH-103 | Cập nhật hồ sơ thành công | Đổi Name | Sửa Name → `Save Profile` → thông báo `Updated profile successfully.` · vẫn ở My Profile. Network: `PATCH /api/profile` → **200**, body JSON phẳng đủ 7 khoá `name` · `email` · `password_old` · `password` · `avatarUrl` · `phone` · `address` (xem `AMB-BK-AUTH-21`) | 🟢 | — | Kiểm chứng thực tế · `web_profile_save_name_viewport.png` · API · PATCH /api/profile → 200 |
| REQ-BK-AUTH-104 | Tên mới hiển thị ở Dashboard | Tác tạo của cập nhật hồ sơ dùng được (skill 4.3.8) | Sau REQ-103 → mở Dashboard → thẻ chào hiển thị `Welcome <Name mới>` · mở lại My Profile thấy Name mới | 🟢 | — | Kiểm chứng thực tế · đọc thẻ `Welcome …` sau khi điều hướng |
| REQ-BK-AUTH-109 | Old Password sai thì không đổi được mật khẩu | | Old Password sai + Password mới + Confirmation khớp → `Save Profile` → thông báo `Invalid data.` · vẫn đăng nhập · mật khẩu cũ vẫn dùng được. Network: `PATCH /api/profile` → **422**. Câu thông báo chung chung — `AMB-BK-AUTH-27` | 🟢 | — | Kiểm chứng thực tế · `web_profile_wrong_old_password_viewport.png` · API · PATCH /api/profile → 422 |
| REQ-BK-AUTH-110 | Đổi mật khẩu thành công thì tự đăng xuất | | Old Password đúng + Password mới + Confirmation khớp → `Save Profile` → `PATCH /api/profile` → 200 → ứng dụng gọi `DELETE /api/logout` → chuyển sang Sign in · thông báo `Please login first` | 🟢 | — | Kiểm chứng thực tế · `web_profile_change_password_logout_viewport.png` · network |
| REQ-BK-AUTH-111 | Sau khi đổi, mật khẩu cũ bị từ chối | Tác tạo của đổi mật khẩu có tác dụng | Sau REQ-110 → Sign in bằng mật khẩu **cũ** → thông báo `Invalid password.` | 🟢 | — | Kiểm chứng thực tế · API · POST /api/login → 400 |
| REQ-BK-AUTH-112 | Sau khi đổi, mật khẩu mới đăng nhập được | | Sau REQ-110 → Sign in bằng mật khẩu **mới** → Dashboard · `Login successfully.` | 🟢 | — | Kiểm chứng thực tế · API · POST /api/login → 200 |
| REQ-BK-AUTH-114 | Save Profile vẫn gửi được sau một lần bị server từ chối | Kỳ vọng tối thiểu của một form — hiện **chưa đạt** | Sau REQ-109 (422) → sửa Old Password thành đúng → `Save Profile` → phải gửi `PATCH /api/profile`. **Hiện tại:** bấm nhiều lần **không** có request nào, không thông báo — phải tải lại trang | 🟢 | — | Kiểm chứng thực tế — ❌ lệch (`AMB-BK-AUTH-28`) |
| REQ-BK-AUTH-115 | Mở thẳng URL My Profile khi đã đăng nhập hiển thị My Profile | Kỳ vọng — hiện **chưa đạt** | Đã đăng nhập → mở thẳng / tải lại `/user-management/my-profile` → phải hiển thị My Profile. **Hiện tại:** chuyển sang `/sign-in` trong khi phiên vẫn còn (`GET /api/me` → 200, mở `/` vẫn thấy `Welcome <tên>`). Đi qua menu avatar → `Profile` thì mở được | 🟢 | — | Kiểm chứng thực tế — ❌ lệch (`AMB-BK-AUTH-29`) · tái hiện 2/2 lần |
| REQ-BK-AUTH-120 | My Profile: đổi Email sang email đã có bị từ chối | Email là định danh duy nhất (`AMB-BK-AUTH-12` ✅) | Sửa Email thành email của **một tài khoản khác** đang tồn tại → `Save Profile` → thông báo `Email already exists.` · vẫn ở My Profile · email của tài khoản **không** đổi (menu avatar và My Profile sau khi tải lại vẫn hiện email cũ) | 🟢 | 25-09-2026 · DEMO-AMB-2509 | Quyết định PO · DEMO-AMB-2509 — **chưa kiểm chứng thực tế** (vị trí hiển thị thông báo chưa khảo sát) |

### 3.5. Setting account (STORY-BK-AUTH-06)

> ↗️ `116 → 119` **đã chuyển lên index** mục 3.3 ngày 26-09-2026 — cả 4 REQ kiểm khớp trên Android.

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|

**Tổng đợt Web: 35 REQ** (24 còn ở file này + 11 đã lên index) — Đăng nhập & phiên 10 (`87` · `91 → 93` · `96 → 100` · `121`) · Đăng xuất 2 (`94` · `95`) · Đăng ký 3 (`88 → 90`) · My Profile 16 (`101 → 115` · `120`) · Setting account 4 (`116 → 119`) → `10 + 2 + 3 + 16 + 4 = 35 ✔`

---

## 4. Đặc tả Trường Dữ liệu (Field Spec)

| Màn hình | Field (Label) | Loại UI (DOM) | Required | Ràng buộc quan sát được | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|---|
| Sign in | Email address | `input[type=text][name=email]` · `required` | ✅ | Định dạng email (kiểm phía client, **không** dùng validation HTML5 — `form[novalidate]`) | 52 · 54 · 55 | `id` tự sinh (`_r_16_`) — **cấm** dùng làm locator |
| Sign in | Password | `input[type=password][name=password]` · `required` | ✅ | — | 53 · 56 | Nút con mắt: `button[type=button]` không nhãn, cạnh ô |
| Sign up | Name | `input[name=name]` · `required` | ✅ | ≤ 250 ký tự (client). Ô **không** tự cắt ký tự | 68 · 73 | |
| Sign up | Phone | `input[name=phone]` | ❌ | Không kiểm định dạng — `abc-xyz` không báo lỗi | 72 | `AMB-BK-AUTH-15` |
| Sign up | Division | combobox MUI Autocomplete · `id=address-division` · nút `Open` / `Clear` | ❌ | Chọn từ 34 mục (`GET /api/address`), gõ để lọc | 76 · 77 · 80 | |
| Sign up | Ward | combobox · `id=address-ward` | ❌ | `disabled` khi Division trống; danh sách theo Division (`GET /api/address/<Division>`) | 77 · 78 · 80 | |
| Sign up | Address | `textarea#address` | ❌ | `disabled` khi Ward trống | 79 | Gửi server dạng ghép — REQ-89 |
| Sign up | Email | `input[name=email]` · `required` | ✅ | Định dạng email (client) · không trùng, không phân biệt hoa thường (server) | 69 · 74 · 81 · 08 · 09 | |
| Sign up | Password | `input[type=password][name=password]` | ✅ | **Không** có độ dài tối thiểu (`a` hợp lệ) | 70 · 75 | Cùng kết luận `AMB-BK-AUTH-08` |
| Sign up | Password Confirmation | `input[type=password][name=password_confirmation]` | ✅ | Phải bằng Password | 71 · 75 | Không gửi lên server |
| My Profile | Name / Phone / Division / Ward / Address / Email | như Sign up | Name ✅ · Email ✅ | như Sign up | 101 · 105 · 106 · 120 | Division/Ward/Address **bật sẵn** vì đã có giá trị · Email không được trùng tài khoản khác (REQ-120) |
| My Profile | Old Password | `input[type=password][name=oldPassword]` | ✅ khi Password có giá trị | — | 107 · 109 | Gửi server tên `password_old` |
| My Profile | Password / Password Confirmation | `input[type=password]` | ❌ | Confirmation phải khớp | 108 · 110 | Để trống = không đổi mật khẩu |
| My Profile | Upload photo | `input[type=file][name=avatar]` · `accept` 7 định dạng ảnh | ❌ | ≤ 3.0 MB (theo dòng chữ) | 101 | **Chưa** thử tải ảnh — `AMB-BK-USER-05` |
| Setting account | Theme | `tablist` 3 `tab` | — | `Light` · `Dark` · `System` | 116 → 119 | Lưu ở `localStorage` khoá `mui-mode` |
| Setting account | Select color | 133 ô màu (19 × 7) | — | — | 116 · 118 | Không có nhãn truy cập |

---

## 5. Validation & thông báo (nguyên văn trên web)

| REQ | Màn hình | Điều kiện | Thông báo | Vị trí |
|---|---|---|---|---|
| 52 · 69 | Sign in · Sign up | Email trống | `Email is required.` | Dưới ô |
| 53 · 70 | Sign in · Sign up | Password trống | `Password is required.` | Dưới ô |
| 54 · 74 · 106 | Sign in · Sign up · My Profile | Email sai định dạng | `Invalid email address` (không dấu chấm cuối) | Dưới ô |
| 68 · 105 | Sign up · My Profile | Name trống | `Name is required.` | Dưới ô |
| 71 | Sign up | Confirmation trống | `Password confirmation is required.` | Dưới ô |
| 73 | Sign up | Name > 250 ký tự | `Name must be less than 250 characters.` | Dưới ô |
| 75 · 108 | Sign up · My Profile | Confirmation ≠ Password | `Password confirmation does not match.` | Dưới ô |
| 107 | My Profile | Có Password, thiếu Old Password | `Old Password is required.` | Dưới ô |
| 08 · 09 · 81 | Sign up | Email đã tồn tại | `Email already exists.` | Dưới ô Email **và** thông báo nổi |
| 15 · 111 | Sign in | Sai mật khẩu | `Invalid password.` | Thông báo nổi |
| 16 | Sign in | Email chưa đăng ký | `User not found.` | Thông báo nổi |
| 100 · 121 | Sign in | Tài khoản bị khoá (mật khẩu đúng hoặc sai) | `User account is disabled.` | Thông báo nổi |
| 120 | My Profile | Email đã thuộc tài khoản khác | `Email already exists.` | ⚠️ chưa khảo sát vị trí (quyết định PO) |
| 01 | Sign up → Sign in | Đăng ký thành công | `Register successfully.` (trong lúc chờ có thông báo `Upload user...` — `AMB-BK-AUTH-31`) | Thông báo nổi |
| 11 · 14 · 87 · 112 | Sign in → Dashboard | Đăng nhập thành công | `Login successfully.` | Thông báo nổi |
| 94 | → Sign in | Đăng xuất | `Logout successfully.` | Thông báo nổi |
| 96 · 110 | → Sign in | Chưa đăng nhập / vừa đổi mật khẩu | `Please login first` (không dấu chấm cuối) | Thông báo nổi |
| 103 | My Profile | Cập nhật thành công | `Updated profile successfully.` | Thông báo nổi |
| 109 · 118 | My Profile · Setting account | Server trả 422 | `Invalid data.` | Thông báo nổi |

> **Thông báo nổi (toast)** hiện ở **góc trên bên phải**, có biểu tượng ✓ xanh (thành công) hoặc ! đỏ (lỗi) và nút ×; tự đóng sau **≈ 3,2 – 3,5 giây** (đo bằng `MutationObserver`, 3 lần). Nhiều thông báo có thể **xếp chồng** cùng lúc (VD `Login successfully.` + `Logout successfully.`). Lỗi server ở Sign in **chỉ** hiện ở thông báo nổi — **không** hiện câu `fields.*` của API dưới ô (khớp Android).

---

## 6. Luồng người dùng

```
Khách ─ avatar / thẻ "Book management sign in" ─► /sign-in ─ Get started ─► /sign-up
                                                   ▲                            │ Register OK
                                                   └─── "Register successfully." ◄┘
/sign-in ─ Login OK (Enter hoặc nút) ─► / (Dashboard) "Welcome <tên>" + "Login successfully."
Khách mở trang ghi ─► /sign-in?redirect=<path> + "Please login first" ─ Login OK ─► <path>
Đã đăng nhập ─ avatar ─► menu ─┬─ Profile ─► /user-management/my-profile ─ Save (đổi mật khẩu) ─► tự Logout ─► /sign-in
                               ├─ Settings ─► /user-management/setting-account
                               └─ Logout ─► /sign-in + "Logout successfully."
F5 / mở URL mới ─► vẫn đăng nhập (trừ /user-management/my-profile — REQ-115)
```

---

## 7. Yêu cầu phi chức năng quan sát được

| Hạng mục | Quan sát | Ghi chú |
|---|---|---|
| Lưu token phía trình duyệt | Access token nằm ở `localStorage['accessToken']` **và** cookie `accessToken` đọc được bằng JavaScript (`document.cookie`) | Cùng bản chất F-03 / `AMB-BK-AUTH-04` (đã chốt: phải có `HttpOnly`) → `RISK-BK-AUTH-09` |
| Tải trang khi chưa đăng nhập | Mỗi lần tải trang: `GET /api/me` → 401 và `POST /api/refetch-token` → 422, console ghi 2 lỗi + `Token refresh failed` | Không ảnh hưởng người dùng; automation **không** được coi lỗi console này là thất bại |
| Request thừa | Ngay sau đăng nhập có `GET /api/api/me` (lặp `/api`) → 200 nhưng trả **HTML** | Ghi chú kỹ thuật cho dev, không cấp REQ |
| Tiêu đề tab | Tiêu đề bắt đầu là `API RESTful miễn phí dành cho Tester kiểm thử` rồi đổi theo trang (`Sign in - Book UI for api-book.anhtester.com`…). Sau khi đăng nhập, Dashboard **giữ** `Sign in - …` | `AMB-BK-AUTH-32` — AC **không** assert khớp tuyệt đối tiêu đề (skill 4.3.7) |
| Link `Need help?` | Trỏ về chính trang đang đứng (`/sign-in` · `/sign-up`) — bấm không có tác dụng | Cùng `AMB-BK-11` cấp hệ thống (Android) |

---

## 8. Ghi chú kỹ thuật cho automation

| Vấn đề | Chi tiết |
|---|---|
| `id` ô nhập tự sinh | `_r_16_`, `_r_1c_`… đổi theo thứ tự render → **cấm** dùng. Dùng `getByRole('textbox', { name: 'Email address' })`, `input[name=email]` hoặc `#address-division` (id cố định) |
| Hai ô Password ở Sign up / Profile | `getByRole('textbox', { name: 'Password' })` khớp cả `Password Confirmation` → thêm `exact: true` hoặc dùng `input[name=password]` |
| `role=alert` ẩn | Trang có sẵn một `div[role=alert]` nội dung `This is an info Alert.` bị `display:none` — locator `getByRole('alert')` dễ bắt nhầm |
| Toast | Phần tử `[data-sonner-toast]` · sống ≈ 3 giây → assert ngay sau thao tác bằng `expect(...).toBeVisible()`, **không** chờ cố định |
| Nút avatar | Khách: `header button` không nhãn · đã đăng nhập: `getByRole('button', { name: '<chữ cái đầu>' })`. Header có thêm 1 nút ẩn (menu thu gọn) → dùng `:visible` |
| Nút `Register` | `getByRole('button', { name: 'Register' })` hoạt động. Không nằm trong `<form>` → **không** dùng `Enter` để gửi (REQ-88) |
| Chụp ảnh full-page | Header dính (`position: sticky`) bị ghép lặp giữa ảnh → phần bị che kiểm bằng DOM. Ưu tiên chụp viewport sau khi cuộn tới đối tượng |
| Mô phỏng nhập số lượng lớn | Nhập 250/251 ký tự: dùng `fill()` với chuỗi sinh động; **không** gõ tay |

---

## 9. Danh mục Evidence

Thư mục [`evidence/`](evidence/). **Mọi ảnh đã mở lại xác nhận đúng trạng thái.** Ảnh chứa tên/email của **tài khoản test tự tạo** (`auto_web_*@auto.test`), không chứa mật khẩu thật (ảnh hiện mật khẩu dùng giá trị giả `Wrong@123`). Ảnh chụp viewport trừ khi tên có `_fullpage` / `_element`.

| Ảnh | Màn hình | Trạng thái | REQ |
|---|---|---|---|
| `web_signin_default_viewport.png` | Sign in | Mặc định (mở từ thẻ Dashboard) | 49 · 51 |
| `web_signin_empty_submit_viewport.png` | Sign in | Gửi form trống | 52 · 53 |
| `web_signin_live_validation_viewport.png` | Sign in | Sau lần gửi đầu: nhập mật khẩu → lỗi Password mất; email sai → `Invalid email address` | 54 · 55 |
| `web_signin_password_shown_viewport.png` | Sign in | Bấm con mắt, mật khẩu hiện `Wrong@123` | 56 |
| `web_signin_wrong_password_toast_viewport.png` | Sign in | Thông báo `Invalid password.`, dữ liệu giữ nguyên | 15 · 57 · 58 |
| `web_signin_email_not_found_toast_viewport.png` | Sign in | Thông báo `User not found.` | 16 |
| `web_signin_success_dashboard_viewport.png` | Dashboard | `Login successfully.` | 03 · 11 |
| `web_dashboard_welcome_card_element.png` | Dashboard | Thẻ `Welcome Auto Web A <timestamp>` (ảnh phần tử, lề trái bị cắt) | 59 · 104 |
| `web_signin_uppercase_email_enter_success_viewport.png` | Dashboard | Đăng nhập bằng email viết hoa + phím Enter | 14 · 87 |
| `web_account_menu_open_viewport.png` | Dashboard | Menu tài khoản mở | 92 |
| `web_logout_success_toast_viewport.png` | Sign in | `Logout successfully.`, 2 ô trống | 94 |
| `web_guest_protected_url_signin_viewport.png` | Sign in | Khách mở URL tạo sách → về Sign in (URL + thông báo `Please login first` đọc bằng DOM, ảnh không thấy thanh URL) | 96 |
| `web_signup_default_fullpage.png` | Sign up | Mặc định | 65 · 66 |
| `web_signup_empty_submit_fullpage.png` | Sign up | Gửi form trống — header dính che ô Phone (kiểm bằng DOM: chỉ 4 lỗi) | 68 → 72 |
| `web_signup_invalid_fields_fullpage.png` | Sign up | Phone chữ · Email sai · Confirmation lệch — header dính che lỗi Name (kiểm Name 250/251/300 bằng DOM) | 73 · 74 · 75 |
| `web_signup_division_open_viewport.png` | Sign up | Danh sách Division mở | 76 |
| `web_signup_ward_open_viewport.png` | Sign up | Danh sách Ward của Hà Nội | 78 |
| `web_signup_division_changed_ward_cleared_viewport.png` | Sign up | Đổi Division → Ward trống, Address khoá | 79 · 80 |
| `web_signup_email_exists_fullpage.png` | Sign up | Email trùng — lỗi dưới ô + thông báo nổi | 08 · 81 |
| `web_signup_email_exists_uppercase_viewport.png` | Sign up | Email trùng viết hoa | 09 |
| `web_signup_success_redirect_signin_viewport.png` | Sign in | Sau đăng ký thành công — **không** bắt kịp thông báo (đọc bằng DOM: `Register successfully.`); Sign in còn dữ liệu cũ | 01 · 91 |
| `web_signup_reopen_data_retained_viewport.png` | Sign up | Rời rồi mở lại, Name còn giá trị (4 ô kiểm bằng DOM) | 83 |
| `web_profile_default_fullpage.png` | My Profile | Mặc định, dữ liệu điền sẵn, Save/Reset mờ | 101 · 102 |
| `web_profile_save_name_viewport.png` | My Profile | `Updated profile successfully.` | 103 |
| `web_profile_invalid_fields_fullpage.png` | My Profile | Name trống · Email sai · thiếu Old Password · Confirmation lệch | 105 → 108 |
| `web_profile_wrong_old_password_viewport.png` | My Profile | Old Password sai → `Invalid data.` | 109 |
| `web_profile_change_password_logout_viewport.png` | Sign in | Sau đổi mật khẩu → tự đăng xuất + `Please login first` | 110 |
| `web_settings_dark_theme_viewport.png` | Setting account | Chọn Dark — áp dụng ngay | 116 · 117 |
| `web_settings_save_invalid_data_viewport.png` | Setting account | Save → `Invalid data.` | 118 |

REQ không có ảnh riêng, truy bằng số liệu DOM/network ghi trong AC: 50 · 67 · 77 · 88 · 89 · 90 · 93 · 95 · 97 · 98 · 99 · 111 · 112 · 113 · 114 · 115 · 119 · 121. **Chưa kiểm chứng** (quyết định PO `DEMO-AMB-2509`): 120. Ảnh của REQ-100 nằm ở `user/web/evidence/`.

---

## 10. Dữ liệu test — tạo / dọn

Môi trường **không dùng chung** (chốt 14-08-2026), vẫn chỉ ghi/xoá bản ghi do phiên này tạo. Việc dọn được làm **qua giao diện** — nhánh UI Recon cấm gọi API trực tiếp.

| Bản ghi | Tạo bởi | Dùng cho | Dọn |
|---|---|---|---|
| User `auto_web_<timestamp>_a@auto.test` | Sign up (REQ-01) | Đăng nhập, Profile, đổi mật khẩu | ✅ Đã xoá 25-09-2026 bằng tài khoản B qua `User → ⋮ → Delete` |
| User `auto_web_<timestamp>_b@auto.test` | Add user (module `USER`) | Tài khoản bị khoá (REQ-100) | ⚠️ **Còn sót** — giao diện không cho tự xoá chính mình (REQ-BK-USER-22) và tài khoản A đã xoá trước. Dọn bằng `DELETE /api/user/<id>` với token của chính B ở nhánh API, hoặc đăng nhập một tài khoản khác để xoá |
| Các lần đăng ký/đăng nhập sai | — | 08 · 09 · 15 · 16 | Server từ chối, **không** tạo bản ghi |

Tạo 2 · dọn 1 · **còn sót 1** (xem thêm ảnh bìa sách ở `book/web/` mục 10).
