# Đặc tả Yêu cầu — Module Xác thực & Phiên đăng nhập (`AUTH`) · Nền tảng Mobile

> Index module (metadata dải mã · REQ dùng chung · phân quyền · Story · AMB/RISK · Nhật ký): [../REQUIREMENTS_AUTH_SUMMARY.md](../REQUIREMENTS_AUTH_SUMMARY.md) · Danh mục hệ thống: [../../README.md](../../README.md) · Bản đồ app: [../../_discovery/system_map.md](../../_discovery/system_map.md) · [module_01](../../_discovery/modules/module_01_xac_thuc_dia_chi.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management (mã hệ thống `BK`) |
| **Module** | Xác thực & Phiên đăng nhập — lượt 1 (19-09-2026): **Đăng ký · Đăng nhập · Đăng xuất** · lượt 2 (26-09-2026): **My Profile · Setting account · Exit app** |
| **Nền tảng** | **Android** ✅ · iOS ❔ chưa khảo sát (máy Windows, chưa có bản build iOS) |
| **Thiết bị khảo sát** | Emulator `Pixel_10_Pro_XL_API_37` · Android 17 · màn hình `1344×2992` · hướng **dọc** (trừ REQ-85) · locale `en-US` · app `book.anhtester.com` `1.0 (versionCode 1)` bản **debug** · `UiAutomator2` qua Appium MCP · loại app **Hybrid (Capacitor)**, khảo sát bằng cây `NATIVE_APP`. WebView: `149.0.7827.5` (lượt 1) · `153.0.8010.36` (lượt 2). Lượt 2: context `WEBVIEW_*` **không** còn liệt kê, cổng DevTools của WebView không mở |
| **Tầng network** | ❌ Không quan sát được — chưa dựng proxy, WebView không bật gỡ lỗi. Rule phía server lấy từ [api/requirements_auth_api.md](../api/requirements_auth_api.md) và web |
| **Phương pháp** | Thao tác thật trên app ngày 19-09-2026 và 26-09-2026 — nhập thử từng ô để lấy message, đọc thuộc tính phần tử (`enabled` · `selected` · `password` · `bounds` · text), tắt mạng bằng `adb shell svc wifi/data disable`. Lượt 2: **agent không nhập mật khẩu** trên hệ thống thật — ô mật khẩu do tester gõ tay, agent đọc kết quả |
| **Tài khoản** | Lượt 1: 1 tài khoản **tự đăng ký trên app** `auto_discover_<timestamp>@auto.test` — đã xoá. Lượt 2: tài khoản test `auto_demo_account_<timestamp>@auto.test` do tester đăng nhập sẵn (dùng chung Web · API · Android), user cho phép sửa hồ sơ. Mục 10 |
| **REQ trong file này** | **14** — `60 → 64` · `82` · `84 → 86` (lượt 1) · `122 → 126` (lượt 2) — chỉ áp Android. Lượt 2 chuyển 11 REQ web (`101` · `102` · `105 → 108` · `113` · `116 → 119`) lên [index mục 3.3](../REQUIREMENTS_AUTH_SUMMARY.md#33-my-profile--setting-account-android--web). 29 REQ khác của đợt Android (`49 → 59` · `65 → 81` · `83`) đã **chuyển lên index** mục 3.2 ngày 25-09-2026 vì kiểm khớp trên Web (`Android · Web`). Cộng 8 REQ dùng chung `Android · API · Web` ở index mục 3.1 (`01` · `03` · `08` · `09` · `11` · `14` · `15` · `16`) |

> **Thang `Nguồn`:** `Kiểm chứng thực tế` = đã thao tác trên app và xác nhận bằng ảnh (tên ảnh ở cột Nguồn, danh mục mục 9) hoặc số liệu thuộc tính ghi trong AC. Mọi AC chỉ đúng với **thiết bị + hướng màn hình** ở bảng trên.

---

## 2. Bản đồ phủ tài liệu

Không có tài liệu nào cho app — toàn bộ REQ sinh từ khảo sát thực tế. Rule đã có ở mặt API / Web được **đối chiếu** trên app: khớp thì chuyển REQ lên index, không sinh REQ song song.

**Lượt 2 (26-09-2026) — My Profile · Setting account · Exit app:** đối chiếu 26 REQ web (`101 → 120`):

| Kết quả | REQ | Ghi chú |
|---|---|---|
| ✅ Khớp → chuyển lên index mục 3.3 (`Android · Web`) | `101` · `102` · `105 → 108` · `113` · `116 → 119` (11) | `118` kỳ vọng, cả hai nền tảng chưa đạt |
| ❌ Android chạy khác → REQ riêng ở file này | `103` → `REQ-122` | Save Profile thất bại trên Android — `AMB-BK-AUTH-34` |
| ❔ **Chưa kiểm được trên Android** — giữ ở `web/` | `103` · `104` · `109 → 112` · `114` · `120` | Đều cần Save Profile thành công (Android đang lỗi, REQ-122) và/hoặc gõ mật khẩu cũ/mới — agent không nhập mật khẩu trên hệ thống thật. Tester chạy khi REQ-122 được sửa |
| ➖ Không áp dụng | `115` | Mở thẳng URL — app không có thanh địa chỉ |

---

## 3. Yêu cầu Chức năng

> ↗️ **REQ đã chuyển lên index (25-09-2026):** `49 → 59` · `65 → 81` · `83` — kiểm khớp trên Web, nay là REQ dùng chung `Android · Web` ở [index mục 3.2](../REQUIREMENTS_AUTH_SUMMARY.md#32-giao-diện-sign-in--sign-up-android--web). AC Android giữ nguyên văn ở đó. Field Spec, Validation, Danh mục Evidence dưới đây vẫn nhắc các mã này vì mô tả giao diện Android.

### 3.1. Đăng nhập (STORY-BK-AUTH-02)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-AUTH-60 | Menu avatar khi đã đăng nhập | Android | | Đã đăng nhập → bấm avatar → menu hiện Name + email của tài khoản · các mục `Home` · `Profile` · `Settings` · `Exit app` · `Logout` | 🟢 | — | Kiểm chứng thực tế · [`../../_discovery/evidence/android_auth_account_menu.png`](../../_discovery/evidence/android_auth_account_menu.png) |
| REQ-BK-AUTH-61 | Phiên đăng nhập được giữ sau khi tắt hẳn app | Android | Vòng đời app | Đã đăng nhập → buộc dừng app (`appium_app_lifecycle terminate`) → mở lại → vào Dashboard ở trạng thái **đã đăng nhập** (`Welcome <tên>`, avatar chữ cái), **không** phải đăng nhập lại | 🟢 | — | Kiểm chứng thực tế · `android_session_kept_after_relaunch.png` |
| REQ-BK-AUTH-63 | Mất mạng khi đăng nhập: không vào hệ thống, giữ dữ liệu | Android | Mất mạng | (1) Tắt Wi-Fi + dữ liệu di động (`adb shell svc wifi disable` · `svc data disable`) · xác nhận `ping` tới server thất bại → (2) nhập email + mật khẩu → bấm `Login account` 2 lần → (3) sau ≥ 5 giây: vẫn ở Sign in · email và mật khẩu còn nguyên. **Không** assert nội dung thông báo lỗi mạng — hiện **không có** (`AMB-BK-AUTH-16`). Đối chứng: bật mạng lại, bấm **1 lần** → có phản hồi server ngay | 🟢 | — | Kiểm chứng thực tế · `android_signin_offline_no_message.png` (thanh trạng thái có biểu tượng mất sóng) |
| REQ-BK-AUTH-64 | Back hệ thống ở Sign in quay về màn hình trước | Android | Nút Back | Đứng ở tab File → bấm avatar → Sign in → nút Back hệ thống → về lại tab File | 🟢 | — | Kiểm chứng thực tế · `android_signin_back_to_previous_tab.png` |

### 3.2. Đăng xuất (STORY-BK-AUTH-03)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-AUTH-62 | Đăng xuất từ menu avatar đưa về Sign in | Android | | Đã đăng nhập → avatar → `Logout` → mục Logout hiện vòng xoay chờ → chuyển sang Sign in với ô Email và Password **trống** | 🟢 | — | Kiểm chứng thực tế · `android_logout_in_progress.png` · `android_signin_default.png` |

### 3.3. Đăng ký (STORY-BK-AUTH-01)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-AUTH-82 | Back hệ thống ở Sign up về Sign in, không hỏi xác nhận | Android | | Nhập dữ liệu vào Sign up → nút Back → hiển thị Sign in ngay, **không** có hộp thoại xác nhận | 🟢 | — | Kiểm chứng thực tế · `android_signup_back_no_confirm.png` |
| REQ-BK-AUTH-84 | Dữ liệu form giữ nguyên khi app xuống nền | Android | Vòng đời app | Nhập Name + Email trên Sign up → đưa app xuống nền 5 giây (`appium_app_lifecycle background`) → quay lại → Name và Email giữ nguyên | 🟢 | — | Kiểm chứng thực tế · đọc text 2 ô sau khi quay lại |
| REQ-BK-AUTH-85 | Xoay ngang được, dữ liệu form giữ nguyên | Android | Xoay màn hình | Sign up có dữ liệu → xoay `LANDSCAPE` → giao diện xoay theo (ảnh `2992×1344`) · Name giữ nguyên | 🟢 | — | Kiểm chứng thực tế · `android_signup_landscape.png` · đọc text ô Name |
| REQ-BK-AUTH-86 | Bàn phím không che ô đang nhập | Android | Bàn phím | Chạm ô Password Confirmation → bàn phím mở (`keyboardShown=true`, vùng bàn phím từ `y=1723`) → ô ở `[195,1113][1011,1281]` — nằm **trên** bàn phím. Quan sát thêm: nút Register cũng nằm trên bàn phím | 🟢 | — | Kiểm chứng thực tế · `android_signup_keyboard_open.png` · `dumpsys input_method` |

### 3.4. My Profile · Setting account · Exit app (lượt 2 — 26-09-2026)

| REQ ID | Tên yêu cầu | Nền tảng | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|---|
| REQ-BK-AUTH-122 | Save Profile trên Android cập nhật hồ sơ thành công | Android | Kỳ vọng — hiện **chưa đạt** (`AMB-BK-AUTH-34` ✅ chốt là lỗi). Cùng hành vi web REQ-103 | Sửa Name → `Save Profile` → thông báo `Updated profile successfully.` · thẻ Dashboard `Welcome <Name mới>`. **Hiện tại:** thông báo lỗi `Error in processing request` · Name **không** đổi (Dashboard, menu avatar, mở lại My Profile vẫn tên cũ). Tái hiện **3/3** — kể cả khi gõ bằng bàn phím thật và khi điền đủ Division · Ward · Address. Không quan sát được request (không proxy) | 🟢 | — | Kiểm chứng thực tế — ❌ lệch · `android_profile_save_error_toast.png` |
| REQ-BK-AUTH-123 | Back hệ thống ở My Profile quay về màn hình trước | Android | Nút Back | Đứng ở Dashboard → avatar → `Profile` → nút Back hệ thống → về Dashboard (`Welcome <tên>`, tab `Dashboard` `selected=true`) | 🟢 | — | Kiểm chứng thực tế · đọc cây phần tử sau Back |
| REQ-BK-AUTH-124 | Reset ở Setting account trả về theme đang áp dụng lúc mở màn hình | Android | Bổ sung REQ-119: Reset **không** luôn về `System` | (1) Chọn `Dark` → rời màn hình → mở lại Setting account (tab `Dark` `selected=true`) → (2) chọn `Light` → `Reset` → tab `Dark` được chọn lại · (3) bấm `Reset` lần nữa → vẫn `Dark`. Web chưa kiểm trường hợp mở màn hình khi theme khác `System` | 🟢 | — | Kiểm chứng thực tế · đọc `selected` 3 tab |
| REQ-BK-AUTH-125 | Theme và màu vừa chọn áp dụng toàn app, giữ khi rời màn hình | Android | Lưu phía máy — không cần Save (Save không phản hồi — REQ-118) | Setting account → `Dark` + một ô màu → sang tab `Book` → nền tối, màu chủ đạo mới ở tab đang chọn · quay lại Setting account → `Dark` vẫn được chọn | 🟢 | — | Kiểm chứng thực tế · `android_settings_theme_kept_other_tab.png` |
| REQ-BK-AUTH-126 | Exit app đưa về màn hình chính của máy, mở lại vẫn đăng nhập | Android | Mục menu chỉ có trên app | Đã đăng nhập → avatar → `Exit app` → màn hình chính của máy (launcher) hiện ra; tiến trình app **vẫn chạy** · mở lại app từ biểu tượng → Dashboard, `Welcome <tên>` — **không** phải đăng nhập lại | 🟢 | — | Kiểm chứng thực tế · `android_exit_app_result.png` · `android_exit_app_reopen.png` · `dumpsys activity` + `pidof` |

**Tổng trong file: 14 REQ** — lượt 1: 9 · lượt 2: 5 (`122 → 126`). Lượt 1 — Đăng nhập 4 (`60` · `61` · `63` · `64`) · Đăng xuất 1 (`62`) · Đăng ký 4 (`82` · `84 → 86`) → `4 + 1 + 4 = 9 ✔`. Đợt Android sinh 38 REQ (`49 → 86`): 9 ở đây + 29 ở [index mục 3.2](../REQUIREMENTS_AUTH_SUMMARY.md#32-giao-diện-sign-in--sign-up-android--web) = 38 ✔

---

## 4. Đặc tả Trường Dữ liệu (Field Spec)

| Màn hình | Field (Label) | Loại UI (class) | Required | Ràng buộc quan sát được | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|---|
| Sign in | Email address | `android.widget.EditText` · `input-type=1` | ✅ | Định dạng email (kiểm phía app) | 52 · 54 · 55 | `input-type=1` là bàn phím chữ thường, **không** phải bàn phím email |
| Sign in | Password | `EditText` · `password=true` · `input-type=225` | ✅ | — | 53 · 56 | Nút con mắt: `android.widget.Button` không nhãn, anh em ngay sau ô |
| Sign up | Name | `EditText` · `input-type=1` | ✅ | ≤ 250 ký tự (kiểm phía app) | 68 · 73 | Ô không tự cắt — nhận đủ 300 ký tự rồi báo lỗi |
| Sign up | Phone | `EditText` · `input-type=1` | ❌ | Không kiểm định dạng — `abc-xyz` không báo lỗi | 72 | `AMB-BK-AUTH-15` |
| Sign up | Division | `EditText` dạng combobox · `resource-id=address-division` · nút `Open` | ❌ | Chọn từ danh sách | 76 · 77 · 80 | Có nút `Clear` (×) khi đã chọn |
| Sign up | Ward | `EditText` combobox · `resource-id=address-ward` | ❌ | Khoá khi Division trống | 77 · 78 · 80 | |
| Sign up | Address | `EditText` nhiều dòng · `resource-id=address` | ❌ | Khoá khi Ward trống | 79 | |
| Sign up | Email | `EditText` · `input-type=1` | ✅ | Định dạng email (app) · không trùng (server — REQ-08 · 09) | 69 · 74 · 81 | |
| Sign up | Password | `EditText` · `password=true` | ✅ | **Không** có độ dài tối thiểu phía app — `a` không báo lỗi | 70 · 75 | Cùng kết luận API `AMB-BK-AUTH-08` |
| Sign up | Password Confirmation | `EditText` · `password=true` | ✅ | Phải bằng Password | 71 · 75 | |
| My Profile | Name · Phone | `EditText` | Name ✅ | Điền sẵn | 101 · 105 · 122 | `resource-id` tự sinh |
| My Profile | Division · Ward · Address | `EditText` `address-division` · `address-ward` · `address` | ❌ | Ward/Address `enabled=false` khi ô trước trống | 101 | Cùng thành phần Sign up |
| My Profile | Email | `EditText` | ✅ | Định dạng email (app) | 101 · 106 | |
| My Profile | Old Password · Password · Password Confirmation | `EditText` · `password=true` | Old Password ✅ khi Password có giá trị | Confirmation phải bằng Password | 107 · 108 · 113 | Nút con mắt không nhãn sau mỗi ô |
| My Profile | Reset · Save Profile | `Button` | — | `enabled=false` khi chưa sửa | 102 · 113 | |
| Setting account | Light · Dark · System | `android.view.View` · `selected` | — | Mặc định `System` | 116 · 117 · 119 · 124 | |
| Setting account | Ô màu (133) | **Không có** trong cây phần tử | — | — | 116 · 117 | Chỉ bấm được theo toạ độ — RISK-BK-AUTH-11 |
| Setting account | Reset · Save | `Button` | — | Luôn `enabled=true` | 118 · 119 · 124 | |

---

## 5. Validation Messages (nguyên văn trên app)

| REQ | Màn hình | Điều kiện | Thông báo | Vị trí |
|---|---|---|---|---|
| 52 · 69 | Sign in · Sign up | Email trống | `Email is required.` | Dưới ô |
| 53 · 70 | Sign in · Sign up | Password trống | `Password is required.` | Dưới ô |
| 54 · 74 | Sign in · Sign up | Email sai định dạng | `Invalid email address` (không có dấu chấm cuối) | Dưới ô |
| 68 | Sign up | Name trống | `Name is required.` | Dưới ô |
| 71 | Sign up | Confirmation trống | `Password confirmation is required.` | Dưới ô |
| 73 | Sign up | Name > 250 ký tự | `Name must be less than 250 characters.` | Dưới ô |
| 75 | Sign up | Confirmation ≠ Password | `Password confirmation does not match.` | Dưới ô |
| 08 · 09 · 81 | Sign up | Email đã tồn tại (không phân biệt hoa thường) | `Email already exists.` | Dưới ô Email **và** thông báo nổi |
| 15 | Sign in | Sai mật khẩu | `Invalid password.` | Thông báo nổi — **không** hiện câu `fields.password` (`Invalid password, please try again.`) của API |
| 16 | Sign in | Email chưa đăng ký | `User not found.` | Thông báo nổi — **không** hiện câu `fields.email` (`Email not found, please register.`) của API |
| 01 | Sign up | Đăng ký thành công | `Register successfully.` | Thông báo nổi trên Sign in |
| 11 · 14 | Sign in | Đăng nhập thành công | `Login successfully.` | Thông báo nổi trên Dashboard |
| 63 | Sign in | Mất mạng | *(không có thông báo)* | `AMB-BK-AUTH-16` |
| 105 | My Profile | Name trống | `Name is required.` | Dưới ô |
| 106 | My Profile | Email sai định dạng | `Invalid email address` | Dưới ô |
| 107 | My Profile | Password có, Old Password trống | `Old Password is required.` | Dưới ô |
| 108 | My Profile | Confirmation ≠ Password | `Password confirmation does not match.` | Dưới ô |
| 122 | My Profile | Save Profile (mọi lần thử) | `Error in processing request` | Thông báo nổi, biểu tượng ! đỏ — lệch web (`Updated profile successfully.`) |
| 118 | Setting account | Save | *(không có phản hồi)* | Web: `Invalid data.` — `AMB-BK-AUTH-35` |

> Thông báo nổi hiện ở cuối màn hình, biểu tượng ✓ xanh (thành công) hoặc ! đỏ (lỗi), có nút × — phần tử **không** tìm thấy được bằng `text` sau vài giây vì đã tự đóng (REQ-58). Lỗi phía server trên Sign in chỉ ở thông báo nổi; trên Sign up lỗi email trùng hiện cả dưới ô.

---

## 6. Yêu cầu riêng của mobile (skill 3.5.3)

| Nhóm | Kết quả | REQ / AMB |
|---|---|---|
| Quyền runtime | **Không áp dụng** — Manifest chỉ khai `INTERNET` (quyền thường, không hỏi lúc chạy). Mở app lần đầu sau khi xoá dữ liệu: **không** có hộp thoại xin quyền | — |
| Vòng đời app | Phiên giữ sau khi tắt hẳn app · dữ liệu form giữ khi xuống nền 5 giây | REQ-61 · 84 |
| Mất mạng | Không vào hệ thống, giữ dữ liệu · **không có thông báo** | REQ-63 · `AMB-BK-AUTH-16` |
| Xoay màn hình | Có hỗ trợ ngang, dữ liệu giữ nguyên | REQ-85 |
| Bàn phím | Không che ô đang nhập | REQ-86 |
| Deep link | **Không áp dụng** — `MainActivity` chỉ có `intent-filter` `MAIN`/`LAUNCHER`, không khai scheme/host | — |
| Push notification | **Không áp dụng** — Manifest không khai `POST_NOTIFICATIONS`; không quan sát thấy thông báo đẩy trong luồng đăng ký / đăng nhập | — |
| Phiên bản tối thiểu / cập nhật bắt buộc | ❔ `minSdk 23` — chưa có căn cứ về chặn phiên bản cũ | `AMB-BK-AUTH-19` |

**Lượt 2 — My Profile · Setting account:** vòng đời — `Exit app` giữ phiên (REQ-126), theme giữ khi rời màn hình (REQ-125); nút Back — REQ-123; mất mạng · xoay · bàn phím **không thử lại** ở 2 màn hình này (đã có REQ-63 · 85 · 86 cho form cùng khung); quyền runtime · deep link · push — **không áp dụng**, cùng lý do lượt 1. Ô `Upload photo` mở trình chọn ảnh của hệ thống — **chưa thử** (để ngoài phạm vi như web, `AMB-BK-USER-05`).

---

## 7. Luồng người dùng

```
Chưa đăng nhập ─ avatar / thẻ Dashboard ─► Sign in ─ Get started ─► Sign up
                                             ▲                        │ Register OK
                                             └── "Register successfully." ◄┘
Sign in ─ Login OK ─► Dashboard "Welcome <tên>" + "Login successfully."
Đã đăng nhập ─ avatar ─► menu ─ Logout ─► Sign in (ô trống)
Tắt hẳn app / mở lại ─► vẫn đăng nhập
```

---

## 8. Ghi chú kỹ thuật cho automation

| Vấn đề | Chi tiết |
|---|---|
| `resource-id` của ô nhập **tự sinh** | `_r_k_` → `_r_bv_` giữa 2 lần render cùng màn hình — **CẤM** dùng. Ngoại lệ ổn định: `address-division` · `address-ward` · `address` |
| `hint` bị nối câu lỗi | Ô đang lỗi có `hint` = `<nhãn> <câu lỗi>` (VD `Email address Email is required.`) → locator phải là `//android.widget.EditText[starts-with(@hint,'Email address')]`, **không** `@hint='Email address'` |
| Phân biệt Password và Password Confirmation | `starts-with(@hint,'Password')` khớp cả hai → dùng thêm `not(starts-with(@hint,'Password Confirmation'))` |
| Câu lỗi dưới ô | `TextView` có `resource-id` kết thúc bằng `-helper-text` (tiền tố tự sinh) → tìm theo `text` |
| `resource-id` qua Appium | Strategy `id` tự thêm tiền tố package → **không** tìm được `address-division`; dùng `-android uiautomator` `new UiSelector().resourceId("address-division")` |
| Nhập liệu | `setValue` **có lúc nối thêm** vào giá trị cũ (quan sát ở ô Name) → xoá trắng (`setValue("")`) trước khi nhập |
| Bấm nút gửi | 2 lần quan sát (đang có mạng) bấm `Login account` không gửi form, lần bấm kế tiếp mới gửi — `RISK-BK-AUTH-08`. Ẩn bàn phím trước khi bấm, assert theo **kết quả** (chờ thông báo / đổi màn hình) |
| Có `content-desc` | `Get started` · `Sign in` (trên Sign up) · `Need help?` · `Book management sign in` · `Open` / `Clear` (combobox) |
| Không nhãn | Nút avatar · nút con mắt — bắt theo quan hệ với ô nhập / vị trí trong header. Lượt 2: nút avatar mang `text` = **chữ cái đầu tên** tài khoản (VD `A`) — đổi theo tài khoản, không dùng làm locator cố định |
| Cây phần tử của WebView rỗng lúc mới mở phiên | Lượt 2: `appium_get_page_source` đầu tiên chỉ có 1 node `WebView` rỗng; cây đầy đủ chỉ xuất hiện sau thao tác chạm đầu tiên — RISK-BK-AUTH-11 |
| Ô màu Setting account | Không có node — chỉ bấm được theo toạ độ trong khung `Select color`. Đề nghị dev thêm `aria-label` cho từng ô |
| Menu avatar | `android.view.MenuItem` `text` = `Home` · `Profile` · `Settings` · `Exit app`; `Logout` là `android.widget.Button` |
| Ẩn bàn phím | **Không** dùng phím Back khi bàn phím đã tự đóng — Back sẽ điều hướng về màn hình trước. Kiểm `mInputShown` trước, hoặc chạm vào tiêu đề |

---

## 9. Danh mục Evidence

Thư mục [`evidence/`](evidence/). Mọi ảnh đã mở lại xác nhận đúng trạng thái. Ảnh chứa tên / email của **tài khoản test tự tạo** (`auto_*@auto.test`), không chứa mật khẩu thật (ảnh hiện mật khẩu dùng giá trị giả `Wrong@123`).

| Ảnh | Màn hình | Trạng thái | REQ |
|---|---|---|---|
| `android_signin_default.png` | Sign in | Mặc định, ngay sau Logout | 49 · 62 |
| `android_signin_from_dashboard_card.png` | Sign in | Mở từ thẻ Dashboard | 51 |
| `android_signin_empty_submit.png` | Sign in | Gửi form trống | 52 · 53 |
| `android_signin_live_validation.png` | Sign in | Đang gõ sau lần gửi đầu | 55 |
| `android_signin_invalid_email.png` | Sign in | Email sai định dạng | 54 |
| `android_signin_wrong_password_snackbar.png` | Sign in | Thông báo `Invalid password.` | 15 · 57 |
| `android_signin_email_not_found_snackbar.png` | Sign in | Thông báo `User not found.` | 16 |
| `android_signin_password_shown.png` | Sign in | Mật khẩu hiện rõ | 56 |
| `android_signin_offline_no_message.png` | Sign in | Mất mạng, đã bấm Login | 58 · 63 |
| `android_signin_success_dashboard.png` | Dashboard | `Welcome <tên>` + `Login successfully.` | 03 · 11 · 59 |
| `android_signin_uppercase_email_success.png` | Dashboard | Đăng nhập bằng email viết hoa | 14 |
| `android_signin_back_to_previous_tab.png` | Tab File | Sau Back từ Sign in | 64 |
| `android_session_kept_after_relaunch.png` | Dashboard | Sau khi tắt hẳn và mở lại app | 61 |
| `android_logout_in_progress.png` | Menu avatar | Logout đang xử lý | 62 |
| `android_signup_default_part1.png` · `android_signup_default_part2.png` | Sign up | Mặc định (2 phần — cuộn) | 65 · 66 |
| `android_signup_empty_submit.png` | Sign up | Gửi form trống | 68 → 72 |
| `android_signup_invalid_fields.png` | Sign up | Name 300 ký tự · Phone chữ · Email sai · Confirmation lệch | 73 · 74 · 75 |
| `android_signup_division_open.png` | Sign up | Danh sách Division | 76 |
| `android_signup_ward_open.png` | Sign up | Danh sách Ward của Hà Nội | 78 |
| `android_signup_division_changed_ward_cleared.png` | Sign up | Đổi Division → Ward trống | 80 |
| `android_signup_email_exists.png` | Sign up | Email trùng | 08 · 81 |
| `android_signup_email_exists_uppercase.png` | Sign up | Email trùng viết hoa | 09 |
| `android_signup_success_snackbar.png` | Sign in | `Register successfully.` | 01 |
| `android_signup_back_no_confirm.png` | Sign in | Sau Back từ Sign up có dữ liệu | 82 |
| `android_signup_reopen_data_retained.png` | Sign up | Mở lại, dữ liệu còn | 83 |
| `android_signup_landscape.png` | Sign up | Xoay ngang | 85 |
| `android_signup_keyboard_open.png` | Sign up | Bàn phím mở ở Password Confirmation | 86 |

| `android_profile_default_part1.png` · `android_profile_default_part2.png` | My Profile | Mặc định (2 phần — cuộn) | 101 · 102 |
| `android_profile_invalid_fields.png` | My Profile | Name trống + Email sai | 105 · 106 |
| `android_profile_old_password_required.png` | My Profile | Old Password trống, Password có giá trị | 107 · 108 |
| `android_profile_save_error_toast.png` | My Profile | Save → `Error in processing request` | 122 |
| `android_settings_default_part1.png` · `android_settings_default_part2.png` | Setting account | Mặc định (2 phần) | 116 |
| `android_settings_dark_theme.png` | Setting account | Chọn Dark | 117 |
| `android_settings_save_no_feedback.png` | Setting account | Dark + màu vàng, sau khi Save — không thông báo | 117 · 118 |
| `android_settings_reset_back_to_loaded.png` | Setting account | Sau Reset → System | 119 |
| `android_settings_theme_kept_other_tab.png` | Tab Book | Theme tối + màu vàng giữ | 125 |
| `android_exit_app_result.png` · `android_exit_app_reopen.png` | Launcher · Dashboard | Sau Exit app · mở lại | 126 |

REQ không có ảnh riêng, truy bằng số liệu thuộc tính trong AC: 113 · 123 · 124 · 67 (đọc phần tử) · 77 · 79 (`enabled`) · 84 (text sau khi quay lại). Ảnh ở tầng khám phá: 50 · 60.

---

## 10. Dữ liệu test — tạo / dọn

| Bản ghi | Tạo bởi | Dùng cho | Dọn |
|---|---|---|---|
| User `auto_discover_<timestamp>@auto.test` | Đăng ký trên app (REQ-01) | Mọi REQ đăng nhập | ✅ Đã xoá 19-09-2026 bằng `DELETE /api/user/<id>` với token **của chính tài khoản đó** → 200 · đăng nhập lại → 404. Tạo 1 · dọn 1 · còn sót 0 |
| Các lần đăng ký trùng email (REQ-08 · 09) | — | — | Bị server từ chối, **không** tạo bản ghi |

| Hồ sơ tài khoản `auto_demo_account_<timestamp>@auto.test` (lượt 2) | Tester tạo trước | REQ-101 → 122 | Save Profile thất bại 3/3 → **không** thay đổi gì; form đã Reset. Theme `System`, màu chủ đạo đổi thành vàng — lưu **trên máy** (không lên server) |

Không bản ghi có sẵn nào bị sửa hay xoá.
