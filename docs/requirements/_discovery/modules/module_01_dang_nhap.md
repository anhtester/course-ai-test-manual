# Khám phá module: Đăng nhập / Xác thực (`LOGIN`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Login |
| Bí danh | Đăng nhập, Xác thực |
| Prefix | `LOGIN` |
| Route | `/admin/authentication` · `/admin/authentication/forgot_password` · `/admin/authentication/logout` · `/admin/authentication/reset_password/<id>/<key>` *(phát hiện thêm khi recon chi tiết)* |
| Loại màn hình | Form |
| CRUD | Không áp dụng |
| Status flow | Không có ở mức entity — nhưng **phiên đăng nhập** có vòng đời trạng thái (phát hiện khi recon chi tiết) |
| Số tab | 0 |
| Ước độ lớn | 2 form · 5 field · ~12–18 REQ — ⚠️ **ước sai: thực tế 40 REQ** (gấp ~2,5 lần). Nguyên nhân: tầng khám phá chỉ đếm form và field, không lường được lượng REQ sinh từ bảo vệ phiên, CSRF, vòng đời cookie ghi nhớ và điều hướng |
| Risk | 🔴 Cao — cổng vào toàn hệ thống, mọi module khác phụ thuộc; sai là chặn toàn bộ đợt test |

## Màn hình quan sát được

| Màn hình | Route | Thành phần |
|---|---|---|
| Đăng nhập | `/admin/authentication` | Email Address · Password · checkbox **Remember me** · nút **Login** · link **Forgot Password?** · logo dẫn về `https://crm.anhtester.com/` |
| Quên mật khẩu | `/admin/authentication/forgot_password` | ❔ Chưa mở — chỉ ghi nhận link tồn tại |
| Đăng xuất | `/admin/authentication/logout` | Có link Logout trong dropdown hồ sơ |

## Phát hiện khác

- Trang login **không** có nút đăng nhập mạng xã hội, **không** có CAPTCHA hiển thị ở trạng thái mặc định.
- Sau khi đăng nhập thành công → chuyển thẳng `/admin/` (Dashboard).
- Tên hiển thị của tài khoản test: **Admin Example** (`/admin/profile/2`).

## Vùng chưa xác minh

> ✅ **Đã recon chi tiết ngày 14-08-2026, rà soát và kiểm chứng lại 18-08-2026** → [../../login/REQUIREMENTS_LOGIN_SUMMARY.md](../../login/REQUIREMENTS_LOGIN_SUMMARY.md) (**40 REQ**). Phần dưới đây giữ nguyên trạng lúc khám phá; những gì đã được giải quyết ghi ở cột ghi chú.

| Vùng | Trạng thái sau recon |
|---|---|
| Nội dung form Quên mật khẩu | ✅ Đã xác minh — `REQ-LOGIN-23` → `28` |
| Luồng email đặt lại mật khẩu | ❌ **Vẫn chưa xác minh** — không gửi mail cho tài khoản thật trên môi trường dùng chung (`AMB-LOGIN-04`, `REQ-LOGIN-27` ⚪) |
| Cơ chế khoá tài khoản sau N lần sai | ❌ **Vẫn chưa xác minh** — cố ý không thử (`AMB-LOGIN-02`, `RISK-LOGIN-03`) |
| Thông báo lỗi nguyên văn | ✅ Đã thu đủ — xem mục 5 của tài liệu module |
| Vai trò thật của `admin@example.com` | ❌ **Vẫn chưa xác minh** — màn hình Roles 403 (`AMB-LOGIN-01`) |
| Cookie ghi nhớ có tự đăng nhập không | ⚠️ **Một nửa** — đã xác minh **không** tự đăng nhập sau khi đăng xuất chủ động (`REQ-LOGIN-39`); còn trường hợp phiên hết hạn tự nhiên thì chưa (`REQ-LOGIN-40` ⚪, `AMB-LOGIN-15`) |
| Lối đăng xuất ở viewport mobile | ❌ **Chưa xác minh** — recon chỉ chạy ở desktop `1600×750`, nơi lối đăng xuất trong `mobile-navbar` bị `display:none` (`AMB-LOGIN-16`) |

## Nhật ký khám phá

| Ngày | Ghi nhận |
|---|---|
| 18-08-2026 | Rà soát chất lượng tài liệu module phát hiện **ước độ lớn sai đáng kể** (12–18 → 40 REQ) và bổ sung route `reset_password` mà tầng khám phá bỏ sót. Phiên đăng nhập có vòng đời trạng thái, khác với ghi nhận ban đầu "Status flow: Không có" |

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [login_overview_fullpage.png](../evidence/login_overview_fullpage.png) | Đăng nhập | Mặc định |
