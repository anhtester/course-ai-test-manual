# Bản đồ hệ thống — AnhTester Book Management (mặt Mobile)

> **TẦNG KHÁM PHÁ — cấp hệ thống.** Tài liệu này **KHÔNG chứa mã REQ**, chỉ ghi màn hình nào tồn tại, nằm ở đâu, ghép vào module nào.
> Mã REQ sinh ở tầng module: `docs/requirements/_book-api/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`.
>
> Danh mục hệ thống: [`../README.md`](../README.md) — **nơi duy nhất** giữ `Trạng thái recon`.
> Mặt API: [`api_map.md`](api_map.md) — danh mục operation, ma trận auth, phát hiện `F-nn`. File này **không** nhân bản nội dung đó, chỉ tham chiếu.

## 1. Bối cảnh khảo sát

| Mục | Giá trị |
|---|---|
| Ngày | 19-09-2026 |
| Mode | **ADD** — thêm **mặt Mobile (Android)** cho hệ thống đã có bản đồ mặt API (14-08-2026) |
| Mặt đã khám phá ở file này | Android. Web: không trong phạm vi. iOS: **chưa khảo sát** (máy Windows, không có bản build iOS) |
| App | `book.anhtester.com` · tên hiển thị "Book Anhtester" · `versionName 1.0` · `versionCode 1` · bản **debug** (`DEBUGGABLE`) · `minSdk 23` · `targetSdk 35` |
| Loại app | **Hybrid — Capacitor.** Toàn bộ giao diện là web app React chạy trong một `android.webkit.WebView`. Context `WEBVIEW_book.anhtester.com` có nhưng **không đọc được DOM** (`css selector` không tìm được `#root`) → khảo sát bằng cây `NATIVE_APP` (accessibility tree của WebView), đủ text/hint/`password`/`clickable` |
| Backend | `https://book.anhtester.com` — cùng server với mặt API. Tiêu đề trang Sign in: *"Sign in - Book UI for api-book.anhtester.com"* |
| Thiết bị | Emulator `Pixel_10_Pro_XL_API_37` · Android 17 · màn hình `1344×2992` · dọc · `UiAutomator2` qua Appium MCP (chế độ nhúng) |
| Quyền khai trong Manifest | Chỉ `INTERNET` (+ quyền nội bộ `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`) |
| Deep link | **Không có** — `MainActivity` chỉ có `intent-filter` `MAIN`/`LAUNCHER` (đọc bằng `aapt2 dump xmltree`) |
| Tầng network | ❌ **Không quan sát được** — chưa dựng proxy. Validation server-side lấy từ mặt API (`api_map.md`) |
| Tài khoản dùng | Chưa đăng nhập + **1 tài khoản tự đăng ký trên app** (`auto_discover_<timestamp>@auto.test`, đã xoá cuối phiên). Hệ thống không có khái niệm role (AMB-BK-01) |
| Môi trường dùng chung | **KHÔNG** (chốt 14-08-2026). Đã tạo 1 bản ghi user — xem mục 7 |
| Dữ liệu app | Được phép xoá (user chốt 19-09-2026). Đã `clear` 1 lần: **không** có màn hình giới thiệu, **không** hỏi quyền lúc mở lần đầu — vào thẳng Dashboard |
| Phạm vi crawl | 5 tab bottom navigation · menu avatar (chưa / đã đăng nhập) · Sign in · Sign up · Profile · Settings · nút Back hệ thống |

## 2. Sơ đồ điều hướng — Android

```
App mở → Dashboard (tab 1, mặc định)
│
├── Bottom navigation (5 tab, luôn hiện trừ Sign in / Sign up)
│   ├── Dashboard ........ tổng quan 4 bộ đếm + thẻ "Book management sign in" / "Welcome <tên>"
│   ├── User ............. User Management — danh sách · tìm kiếm · lọc · phân trang
│   │   ├── [đã đăng nhập] nút "New user" · menu ⋮ mỗi dòng
│   │   ├── My Profile .......... (breadcrumb "User management / Change my profile")
│   │   └── Setting account ..... (breadcrumb "User management / Setting account")
│   ├── Book ............. Book Management — Filter · Sort By · tab danh mục · thẻ sách
│   │   └── [đã đăng nhập] nút "New book" · icon bút trên thẻ · icon ⚙ cuối hàng tab danh mục
│   ├── Promotion ........ Promotion Management — tìm kiếm · lọc · bảng CODE/Name · phân trang
│   │   └── [đã đăng nhập] nút "New Promotion"
│   └── File ............. File management — dung lượng · Preview/Small · tìm kiếm · cây thư mục
│       └── [đã đăng nhập] nút "Upload file"
│
├── Nút avatar (góc phải header, KHÔNG có text/content-desc)
│   ├── Chưa đăng nhập → Sign in
│   └── Đã đăng nhập  → menu: <tên> · <email> · Home · Profile · Settings · Exit app · Logout
│
└── Sign in  (lối vào: nút avatar · thẻ "Book management sign in" trên Dashboard)
    ├── "Get started" → Sign up  ─(Register thành công)→ Sign in + thông báo "Register successfully."
    ├── "Need help?"  → không phản hồi (AMB-BK-11)
    └── Login thành công → Dashboard + thông báo "Login successfully."

Nút Back hệ thống: Sign up → Sign in → màn hình trước khi mở Sign in (tab đang đứng)
```

## 3. Bảng module tổng

**Tổng: 9 module** = 8 module có từ mặt API + `DASH` mới (chỉ có trên Android). 8/9 module có màn hình trên app; `SYS` chỉ có ở API.

| Module | Prefix | Nền tảng | Tên trên app (bí danh) | File khám phá | Loại màn hình | Risk | Ước REQ mặt Android |
|---|---|---|---|---|---|---|---|
| Xác thực & Phiên đăng nhập | `AUTH` | Android · API | Sign in · Sign up · My Profile · Setting account · menu avatar | [module_01](modules/module_01_xac_thuc_dia_chi.md) | Form · Menu | 🔴 | 30–45 |
| Địa chỉ hành chính | `ADDR` | Android · API | Ô Division / Ward trong Sign up, Profile | [module_01](modules/module_01_xac_thuc_dia_chi.md) | Dropdown phụ thuộc | 🟡 | 5–8 |
| Người dùng | `USER` | Android · API | User Management | [module_02](modules/module_02_nguoi_dung.md) | Danh sách + CRUD | 🔴 | 25–35 |
| Sách | `BOOK` | Android · API | Book Management | [module_03](modules/module_03_sach_danh_muc.md) | Lưới thẻ + CRUD | 🔴 | 30–45 |
| Danh mục sách | `CAT` | Android · API | Tab danh mục trong Book · icon ⚙ | [module_03](modules/module_03_sach_danh_muc.md) | Tab lọc · (❔ màn hình quản lý) | 🟡 | 8–12 |
| Khuyến mãi | `PROMO` | Android · API | Promotion Management | [module_04](modules/module_04_khuyen_mai.md) | Bảng + CRUD | 🟡 | 20–30 |
| Tệp tin | `FILE` | Android · API | File management · "Upload photo" trong Profile | [module_05](modules/module_05_tep_tin.md) | Cây thư mục + upload | 🟡 | 20–30 |
| Tổng quan | `DASH` | Android | Dashboard | [module_06](modules/module_06_tong_quan_tien_ich.md) | Dashboard chỉ đọc | 🟢 | 5–8 |
| Tiện ích hệ thống | `SYS` | API | — (không có UI) | [module_06](modules/module_06_tong_quan_tien_ich.md) | — | 🟢 | — |

## 4. Bản đồ entity & phụ thuộc

```
AUTH ──(token)──► mọi thao tác ghi của USER · BOOK · CAT · PROMO · FILE
AUTH (Sign up, Profile) ──► ADDR  (Division → Ward phụ thuộc)
AUTH (Profile "Upload photo") ──► FILE  (thư mục $avatar-image)
BOOK ──► CAT   (sách gắn danh mục; tab danh mục là bộ lọc của Book)
BOOK ──► FILE  (thư mục $book-image)
BOOK ──► PROMO (biểu tượng khuyến mãi trên thẻ sách)
DASH ──► USER · BOOK · CAT · PROMO  (chỉ đọc bộ đếm tổng)
```

- **Chưa đăng nhập vẫn đọc được** danh sách User (kèm email), Book, Promotion, File — cùng bản chất F-01 của mặt API (`GET` công khai). Không mở AMB mới, nối vào **AMB-BK-02**.
- Thẻ sách hiển thị giá **"-1.000 ₫"** — giá âm lọt lên UI, cùng bản chất **F-04** → nối vào **AMB-BK-03**.

## 5. Ma trận phân quyền sơ bộ — Android

Hệ thống **không có khái niệm role** trên UI (không thấy chọn role khi đăng ký, không có màn hình phân quyền) — khớp F-02 của mặt API. Chỉ phân biệt được 2 trạng thái:

| Hành động | Chưa đăng nhập | Đã đăng nhập (tài khoản tự đăng ký) |
|---|---|---|
| Xem danh sách User / Book / Promotion / File | ✅ | ✅ |
| Thấy nút tạo mới (New user · New book · New Promotion · Upload file) | ❌ | ✅ |
| Mở My Profile · Setting account | ❌ (menu avatar dẫn tới Sign in) | ✅ |

Tổng 9 ô = Đã kiểm chứng 9 · Suy diễn 0 · Chưa rõ 0 · Không áp dụng 0. Chỉ kiểm **sự hiện diện** của nút, **chưa** bấm tạo/sửa/xoá — việc của tầng module.

## 6. Thứ tự khảo sát đã chốt

| # | Module | Mặt còn thiếu | Lý do thứ tự |
|---|---|---|---|
| 1 | `AUTH` (+ `ADDR` phần dùng trong Sign up) | Android | User yêu cầu Register + Login trước; mọi thao tác ghi cần đăng nhập |
| 2 | `USER` | Android | Chứa Profile/Settings, rủi ro 🔴 lộ dữ liệu cá nhân |
| 3 | `BOOK` · `CAT` | Android | Nghiệp vụ chính, rủi ro 🔴 giá âm |
| 4 | `PROMO` | Android | |
| 5 | `FILE` | Android | |
| 6 | `DASH` | Android | Chỉ đọc, phụ thuộc số liệu các module trên |

Không module nào `BLOCKED`. iOS: chưa có lịch — cần máy Mac hoặc cloud.

## 7. Nhật ký khám phá

| Ngày | Nguồn | Thay đổi |
|---|---|---|
| 26-09-2026 | `/generate-requirements-from-mobile` (AUTH lượt 2 · USER · BOOK) | Lệch so với bản đồ: (1) context `WEBVIEW_book.anhtester.com` **không** còn liệt kê (chỉ `NATIVE_APP`), WebView hệ thống lên `153.0.8010.36`; cây phần tử WebView **rỗng** tới lần chạm đầu tiên. (2) Nút avatar giờ mang `text` = chữ cái đầu tên tài khoản (không còn rỗng hoàn toàn). (3) Lỗi điều hướng `AMB-BK-12` gặp **cả ở tab Book** khi đang ở `Modify book` (REQ-BK-BOOK-148), không riêng tab User. (4) Mục `Exit app` đưa app về launcher, tiến trình vẫn chạy. Sơ đồ điều hướng không đổi. REQ Android đã sinh cho `USER` · `BOOK`, bổ sung cho `AUTH` |
| 25-09-2026 | `/generate-requirements-from-website` (AUTH · USER · BOOK) | Lệch so với bản đồ: hệ thống **có mặt Web** tại `https://book.anhtester.com` (mục 1 ghi "Web: không trong phạm vi") — cùng web app React mà Android bọc lại, điều hướng bằng **sidebar** thay cho bottom navigation: `Dashboard` `/` · `User` `/user-management` (+ `/my-profile` · `/setting-account`) · `Book` `/book-management` (+ `/handle` · `/detail/<slug>`) · `Promotion` `/promotion-book-management` · `File` `/file-management` · **`Database` `/db-management`** — mục này **không có** trên Android và **chưa thuộc module/prefix nào** → cần `/discover-system` mode ADD (mặt Web) trước khi recon. Web khác Android: menu tài khoản **không** có `Exit app`; User hiển thị dạng bảng 6 cột + bộ lọc nâng cao. REQ Web đã sinh cho `AUTH` · `USER` · `BOOK` |
| 19-09-2026 | User bổ sung mặt Mobile | Tạo file. Khám phá app Android `book.anhtester.com` 1.0 (Hybrid Capacitor, debug). Ghép 8/9 module vào module đã có của mặt API, **cấp prefix mới `DASH`** (user chốt). Không deep link, không quyền runtime, không màn hình lần đầu. Tách bản đồ thành 6 file (9 module > ngưỡng 8). **Dữ liệu tạo ra:** 1 user `auto_discover_<timestamp>@auto.test` (dùng tiếp cho recon `AUTH`) — **đã xoá** cuối phiên bằng token của chính tài khoản đó (tạo 1 · dọn 1 · sót 0) · **không** sửa/xoá bản ghi có sẵn nào. Mở `AMB-BK-11` · `AMB-BK-12` |

## 8. Ambiguity cấp hệ thống phát sinh ở mặt Mobile

Nối tiếp dải `AMB-BK-nn` của [`api_map.md` mục 4](api_map.md#4-khoảng-trống-của-spec-amb--cần-chốt-trước-khi-sinh-tc) (đang dùng tới `AMB-BK-10`).

| Mã | Câu hỏi | Chặn cái gì | Mức | Kết luận (✅ chốt 25-09-2026 · `DEMO-AMB-2509`) |
|---|---|---|---|---|
| **AMB-BK-11** | Link "Need help?" ở header Sign in / Sign up bấm vào không có phản ứng gì — tính năng chưa làm hay lỗi? | TC cho link này ở `AUTH` | 🟡 | ✅ Tính năng **chưa làm** ở bản 1.0 — link để ngoài phạm vi kiểm thử, không cấp REQ |
| **AMB-BK-12** | Đang ở My Profile / Setting account, bấm tab **User** ở bottom navigation không quay về danh sách (chỉ breadcrumb "User management" làm được) — cố ý hay lỗi? | TC điều hướng của `USER` | 🟡 | ✅ **Lỗi** điều hướng Android — đã cấp `REQ-BK-USER-120` (26-09-2026). Cùng lỗi ở tab Book từ `Modify book` → `REQ-BK-BOOK-148` |

## 9. Ghi chú kỹ thuật cho automation

| Vấn đề | Chi tiết |
|---|---|
| `resource-id` của ô nhập **tự sinh** | Ô nhập mang `resource-id` dạng `_r_k_`, `_r_l_` (id tự sinh của React) — đổi theo thứ tự render, **CẤM** dùng làm locator. Dùng `hint` (`//android.widget.EditText[@hint='Email address']`) hoặc đề nghị dev thêm định danh ổn định |
| Nút avatar không nhãn | `android.widget.Button` không `text`, không `content-desc` → chỉ bắt được theo vị trí trong cây. Đề nghị dev thêm `aria-label` |
| Có `content-desc` dùng được | `Book management sign in` · `Get started` · `Need help?` · `anhtester_logo_512` · `Free API for Testing` |
| Tab bottom navigation | `android.view.View` có `text` = tên tab, `clickable=true`, tab đang chọn `selected=true` |
| App tải chậm hơn khung | Mở app lần đầu: màn hình trắng trước khi Dashboard hiện. Bộ đếm Dashboard hiện `0` rồi mới ra số thật — phải chờ theo điều kiện |
| WebView context | 19-09-2026: `WEBVIEW_book.anhtester.com` liệt kê được nhưng không đọc được DOM · 26-09-2026: không còn liệt kê. Automation dùng `NATIVE_APP` |
| Cây phần tử rỗng lúc đầu phiên | 26-09-2026: `page source` đầu tiên chỉ có 1 `WebView` rỗng — chạm một vùng trung tính rồi mới đọc cây |
| `appium_screenshot` lỗi schema | Chụp bằng `adb shell screencap` + `adb pull` |

## Bản đồ tài liệu

| File | Module bao phủ | Prefix |
|---|---|---|
| [modules/module_01_xac_thuc_dia_chi.md](modules/module_01_xac_thuc_dia_chi.md) | Xác thực & Phiên đăng nhập · Địa chỉ hành chính | `AUTH` · `ADDR` |
| [modules/module_02_nguoi_dung.md](modules/module_02_nguoi_dung.md) | Người dùng | `USER` |
| [modules/module_03_sach_danh_muc.md](modules/module_03_sach_danh_muc.md) | Sách · Danh mục sách | `BOOK` · `CAT` |
| [modules/module_04_khuyen_mai.md](modules/module_04_khuyen_mai.md) | Khuyến mãi | `PROMO` |
| [modules/module_05_tep_tin.md](modules/module_05_tep_tin.md) | Tệp tin | `FILE` |
| [modules/module_06_tong_quan_tien_ich.md](modules/module_06_tong_quan_tien_ich.md) | Tổng quan · Tiện ích hệ thống | `DASH` · `SYS` |

Tự kiểm: 2 + 1 + 2 + 1 + 1 + 2 = **9 module** = bảng mục 3 ✔ · mỗi module thuộc đúng 1 file ✔
