# Khám phá — Xác thực & Phiên đăng nhập (`AUTH`) · Địa chỉ hành chính (`ADDR`)

> Tầng khám phá — **không** chứa mã REQ. Index: [`../system_map.md`](../system_map.md) · Mặt API: [`../api_map.md` mục 2.1 · 2.7](../api_map.md#2-danh-mục-endpoint) · Trạng thái recon: [`../../README.md`](../../README.md)

## `AUTH` — mặt Android

| Màn hình | Đường đi | Thành phần quan sát được |
|---|---|---|
| **Sign in** | Nút avatar (chưa đăng nhập) · thẻ "Book management sign in" trên Dashboard | Tiêu đề "Sign in" · "Don’t have an account? **Get started**" · ô `Email address *` (EditText, `input-type=1`) · ô `Password *` (EditText, `password=true`) + nút ẩn/hiện không nhãn · nút `Login account` · link "Need help?" ở header. **Không** có bottom navigation |
| **Sign up** | Sign in → "Get started" | Tiêu đề "Sign up" · "Already have an account? **Sign in**" · nhóm *Infomation* (sic): `Name *` · `Phone` · nhóm *Address*: `Division` ▾ · `Ward` ▾ · `Address` (nhiều dòng) · nhóm *Account*: `Email *` · `Password *` · `Password Confirmation *` (2 ô mật khẩu có nút ẩn/hiện) · nút `Register`. Form dài hơn 1 màn hình — nút Register phải cuộn mới thấy |
| **Menu avatar** (đã đăng nhập) | Nút avatar | Tên · email · Home · Profile · Settings · Exit app · **Logout** |
| **My Profile** | Menu avatar → Profile | Breadcrumb "User management / Change my profile" · "Upload photo" (*Allowed \*.jpeg,.jpg\*.png\*.gif\*.webp\*.bmp\*.svg max size of 3.0 MB*) · `Name *` · `Phone` · Division · Ward · Address · (phần dưới chưa cuộn tới) |
| **Setting account** | Menu avatar → Settings | Theme: Light / Dark / System (mặc định System) · "Select color" — bảng màu |

**Quan sát luồng (đã thử thật với dữ liệu hợp lệ, 1 lần):**

| Hành động | Kết quả |
|---|---|
| Register với Name + Email + Password + Password Confirmation, bỏ trống Phone/Address | Chuyển về **Sign in**, thông báo `Register successfully.` ở cuối màn hình; ô email **không** điền sẵn |
| Login bằng tài khoản vừa tạo | Vào **Dashboard**, thông báo `Login successfully.`; thẻ Dashboard đổi thành `Welcome <tên>`; avatar hiện chữ cái đầu tên |
| Back hệ thống ở Sign up | Về Sign in |
| Back hệ thống ở Sign in | Về tab đang đứng trước khi mở Sign in |
| "Need help?" | Không phản ứng (AMB-BK-11) |

**Chưa khảo sát ở tầng này (việc của `/generate-requirements-from-mobile auth`):** validation từng ô · message lỗi · sai mật khẩu · email trùng · mật khẩu xác nhận lệch · Logout · Exit app · lưu Profile · đổi Theme · app xuống nền / xoay màn hình / mất mạng · bàn phím che nút.

**Liên hệ mặt API:** `POST /api/register` · `POST /api/login` · `GET /api/me` · `PATCH /api/profile` (**F-16: mọi body đều 422** — chưa thử lưu Profile trên app) · `DELETE /api/logout` (F-17, F-23). Module đã có tài liệu REQ mặt API: [`../../auth/REQUIREMENTS_AUTH_SUMMARY.md`](../../auth/REQUIREMENTS_AUTH_SUMMARY.md).

Evidence: [android_auth_overview.png](../evidence/android_auth_overview.png) (Sign in) · [android_auth_account_menu.png](../evidence/android_auth_account_menu.png) (menu avatar khi đã đăng nhập — chứa tên/email của **tài khoản test tự tạo**)

## `ADDR` — mặt Android

| Màn hình | Đường đi | Thành phần |
|---|---|---|
| Ô địa chỉ | Trong Sign up và My Profile | `Division` ▾ → `Ward` ▾ (Ward viền xám đậm hơn — nghi phụ thuộc Division, chưa mở dropdown) · `Address` tự do |

Liên hệ API: `GET /api/address` · `GET /api/address/{divname}`. Evidence: [android_addr_overview.png](../evidence/android_addr_overview.png) (cắt đúng nhóm Address của Sign up)
