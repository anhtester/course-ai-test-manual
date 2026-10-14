# Khám phá module: Liên hệ khách hàng (`CONT`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Contacts |
| Bí danh | Liên hệ, Người liên hệ của khách hàng |
| Prefix | `CONT` |
| Route | `/admin/clients/all_contacts` · trong khách hàng: `/admin/clients/client/{id}?group=contacts` |
| Loại màn hình | Danh sách toàn hệ thống + danh sách/form trong tab của khách hàng |
| CRUD | ✅ (tạo/sửa/xoá thực hiện trong tab Contacts của khách hàng) · **Export** ở màn hình danh sách chung |
| Status flow | Cột **Active** (Active / Inactive) |
| Số tab | 0 |
| Ước độ lớn | 1 form + 1 danh sách · ~20–30 REQ |
| Risk | 🔴 Cao — liên hệ là **tài khoản đăng nhập cổng khách hàng** (có cột **Last Login**), dính trực tiếp tới xác thực và phân quyền phía khách hàng |

## Vì sao tách khỏi `CUST`

| Căn cứ | Quan sát |
|---|---|
| Có màn hình danh sách cấp hệ thống riêng | `/admin/clients/all_contacts` |
| Có vòng đời riêng | Cột **Last Login** → liên hệ đăng nhập được vào cổng khách hàng |
| Có trạng thái riêng | Cột **Active** độc lập với trạng thái khách hàng |

## Màn hình danh sách chung

- Cột: First Name · Last Name · Email · Company · Phone · Position · Last Login · Active
- Thanh công cụ: **Export** (không có nút tạo mới ở đây — tạo từ trong khách hàng)
- Khách hàng id 317 có **287 liên hệ** → dữ liệu lớn, thích hợp kiểm tra phân trang/tìm kiếm

## Vùng chưa xác minh

- Form tạo/sửa liên hệ: field spec, quyền cấp cho liên hệ (permissions), tuỳ chọn gửi email chào mừng.
- Ràng buộc "liên hệ chính" (Primary Contact) — cách chỉ định và điều kiện.
- Luồng đăng nhập cổng khách hàng (front-end site) — **ngoài phạm vi khu `/admin`**, chưa khảo sát.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [contacts_list_fullpage.png](../evidence/contacts_list_fullpage.png) | Danh sách liên hệ toàn hệ thống | Mặc định, có dữ liệu |
| [customer_detail_tabs_fullpage.png](../evidence/customer_detail_tabs_fullpage.png) | Tab Contacts trong khách hàng | Thấy nhãn "Contacts 287" |
