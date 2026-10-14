# Khám phá — Người dùng (`USER`)

> Tầng khám phá — **không** chứa mã REQ. Index: [`../system_map.md`](../system_map.md) · Mặt API: [`../api_map.md` mục 2.2](../api_map.md#2-danh-mục-endpoint) · Trạng thái recon: [`../../README.md`](../../README.md)

## Mặt Android

| Màn hình | Đường đi | Thành phần quan sát được |
|---|---|---|
| **User Management** | Tab 2 "User" | Ô tìm kiếm *"Search user (name, email, phone or a…"* (bị cắt) · icon lọc · cột `Name` (avatar + tên + email + biểu tượng khoá xanh) · phân trang: chọn số dòng (mặc định **5**), `< 1 2 3 4 5 … 535 >` |
| Đã đăng nhập | | Nút **"New user"** · menu **⋮** trên mỗi dòng · dòng của chính mình có nhãn **"You"** |
| My Profile · Setting account | Menu avatar | Nằm dưới breadcrumb "User management" nhưng thuộc `AUTH` — xem module_01 |

- **Chưa đăng nhập vẫn thấy toàn bộ danh sách kèm email** — cùng bản chất F-01 (`GET /api/user` công khai). Nối AMB-BK-02.
- Ở My Profile / Setting account, bấm tab User **không** quay về danh sách — AMB-BK-12.
- Chưa mở: bộ lọc · menu ⋮ · form New user · chi tiết user. → **26-09-2026: đã khảo sát ở tầng module** — [`user/mobile/requirements_user_mobile.md`](../../user/mobile/requirements_user_mobile.md)

Evidence: [android_user_overview.png](../evidence/android_user_overview.png) — **cắt chỉ giữ header + ô tìm kiếm**, bỏ các dòng danh sách vì chứa email người dùng khác.
