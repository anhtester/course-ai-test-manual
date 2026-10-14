# Khám phá module: Khách hàng (`CUST`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Customers |
| Bí danh | Khách hàng, Client |
| Prefix | `CUST` |
| Route | `/admin/clients` · chi tiết `/admin/clients/client/{id}` |
| Loại màn hình | Danh sách + màn hình chi tiết **19 tab** |
| CRUD | ✅ Tạo (**New Customer**) · Sửa · Xoá · **Import Customers** · **Export** · **Bulk Actions** (gán nhóm) |
| Status flow | Cột **Active** (Active / Inactive) |
| Số tab chi tiết | **19** |
| Ước độ lớn | Form nhiều nhóm field + 19 tab · ~45–65 REQ |
| Risk | 🔴 Cao — entity trung tâm, 10+ module khác tham chiếu tới; chứa dữ liệu khách hàng thật |

## Màn hình danh sách

- Cột: `#` · Company · Primary Contact · Primary Email · Phone · Active · Groups · Date Created
- Thanh công cụ: **New Customer** · **Import Customers** · **Contacts** (dẫn sang module `CONT`) · **Export** · **Bulk Actions** · bộ lọc điều kiện (**Add Rule** / **Apply**)
- Có dropdown chọn số dòng/trang (10 / 25 / 50 / 100 / All)

## Màn hình chi tiết — 19 tab

`Profile` · `Contacts` · `Notes` · `Statement` · `Invoices` · `Payments` · `Proposals` · `Credit Notes` · `Estimates` · `Subscriptions` · `Expenses` · `Contracts` · `Projects` · `Tasks` · `Tickets` · `Files` · `Vault` · `Reminders` · `Map`

Điều hướng bằng query string: `/admin/clients/client/{id}?group=<tên_tab>`.

> Các tab này **không tách module** — chúng là **view chiếu** dữ liệu của module khác lọc theo khách hàng. Riêng `Contacts` tách thành `CONT` vì liên hệ có tài khoản đăng nhập cổng khách hàng riêng.

## Phát hiện tầng network

- Bảng danh sách nạp qua `POST /admin/clients/table` (DataTables server-side). **Không có REST API** `/api/`.
- Trang chi tiết có select `tax[15]` (15 option thuế) và select nhóm khách hàng — nguồn dữ liệu từ bảng master của khu Setup (đang 403).

## Vùng chưa xác minh

- Field spec của form tạo/sửa khách hàng (chưa mở form vì môi trường dùng chung — mở xem được, chưa làm ở tầng khám phá).
- Nội dung tab `Vault`, `Statement`, `Map`.
- Luồng Import Customers (cần upload file → không thực hiện trên môi trường dùng chung).

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [customers_list_fullpage.png](../evidence/customers_list_fullpage.png) | Danh sách khách hàng | Mặc định, có dữ liệu |
| [customer_detail_tabs_fullpage.png](../evidence/customer_detail_tabs_fullpage.png) | Chi tiết khách hàng (id 317) | Tab Profile, thấy đủ 19 tab |
