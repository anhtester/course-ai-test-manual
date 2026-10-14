# Khám phá module: Hồ sơ cá nhân & Chấm công (`PROF`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | My Profile · Edit Profile · My Timesheets |
| Bí danh | Hồ sơ cá nhân, Chấm công cá nhân |
| Prefix | `PROF` |
| Route | `/admin/profile` · `/admin/profile/{staff_id}` · `/admin/staff/edit_profile` · `/admin/staff/timesheets` · `/admin/profile?notifications=true` |
| Loại màn hình | Trang hồ sơ + form sửa + danh sách chấm công |
| CRUD | Sửa hồ sơ cá nhân · đổi mật khẩu · đổi ngôn ngữ |
| Status flow | Không có |
| Ước độ lớn | 3 màn hình · ~15–20 REQ |
| Risk | 🟡 Trung bình — có đổi mật khẩu (bảo mật) và giờ công (ảnh hưởng hoá đơn theo giờ) |

## Màn hình quan sát được

| Màn hình | Route | Ghi nhận |
|---|---|---|
| Hồ sơ của tôi | `/admin/profile` · `/admin/profile/2` | Tài khoản test hiển thị **Admin Example** |
| Sửa hồ sơ | `/admin/staff/edit_profile` | Chưa mở form |
| Chấm công của tôi | `/admin/staff/timesheets` | Tiêu đề trang **Today** — có bộ lọc theo kỳ |
| Thông báo | `/admin/profile?notifications=true` | Danh sách thông báo hệ thống |
| Đổi ngôn ngữ | `/admin/staff/change_language/<lang>` | **26 ngôn ngữ** + System Default |

> `/admin/staff/timesheets?view=all` (Timesheets overview) thuộc module **`REP`**, không thuộc `PROF` — cùng route gốc nhưng khác phạm vi dữ liệu (tất cả nhân viên vs cá nhân).

## Ranh giới với khu Quản trị hệ thống

`PROF` là phần **tự phục vụ** mà mọi nhân viên đều vào được. Quản lý nhân viên (`/admin/staff`), vai trò (`/admin/roles`) thuộc khu Setup — **403 với tài khoản hiện tại, ngoài phạm vi đợt này**.

## Vùng chưa xác minh

- Field spec form sửa hồ sơ, quy tắc đổi mật khẩu (độ dài, xác nhận mật khẩu cũ).
- Chức năng bật/tắt loại thông báo, xác thực 2 lớp (nếu có).
- Cách ghi nhận giờ công thủ công vs từ timer của `TASK`.
- Hành vi khi đổi ngôn ngữ (26 ngôn ngữ — dễ vỡ layout, ứng viên cho kiểm thử i18n).

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [profile_overview_fullpage.png](../evidence/profile_overview_fullpage.png) | Hồ sơ của tôi | Mặc định |
| [timesheets_list_fullpage.png](../evidence/timesheets_list_fullpage.png) | Chấm công của tôi | Kỳ **Today** |
