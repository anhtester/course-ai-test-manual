# Khám phá module: Báo giá sơ bộ — Estimates (`EST`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Estimates |
| Bí danh | Báo giá sơ bộ, Dự toán |
| Prefix | `EST` |
| Route | `/admin/estimates` · tạo mới `/admin/estimates/estimate` · chi tiết `/admin/estimates/list_estimates/{id}` |
| Loại màn hình | Danh sách + form chứng từ nhiều dòng (line items) |
| CRUD | ✅ **Create New Estimate** · Sửa · Xoá · **Export** |
| Status flow | ✅ **Draft · Not Sent · Sent · Expired · Declined · Accepted** (đọc từ widget Estimate overview trên Dashboard) |
| Ước độ lớn | Form chứng từ + bảng item + thuế · ~30–40 REQ |
| Risk | 🔴 Cao — chứng từ có tiền và thuế, là đầu vào để chuyển thành Hoá đơn |

## Màn hình danh sách

- Cột: Estimate # · Amount · Total Tax · Customer · Project · Tags · Date · Expiry Date · Reference # · Status
- Thanh công cụ: **Create New Estimate** · **Export** · bộ lọc **Add Rule** / **Apply**

## Trạng thái quan sát được (Dashboard — widget *Estimate overview*)

| Trạng thái | Số liệu tại thời điểm khảo sát |
|---|---|
| Draft | 0 |
| Not Sent | 3 |
| Sent | 0 |
| Expired | 3 |
| Declined | 0 |
| Accepted | 0 |

## Vùng chưa xác minh

- Form tạo báo giá: cấu trúc dòng item, thuế, chiết khấu, tiền tệ, điều khoản.
- Luồng **chuyển Estimate → Invoice** và **Estimate → Proposal**.
- Quy tắc tự sinh số chứng từ (`EST-00xxxx`) và ảnh hưởng khi xoá.
- Gửi email cho khách hàng, xem PDF, chữ ký.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [estimates_list_fullpage.png](../evidence/estimates_list_fullpage.png) | Danh sách Estimates | Mặc định |
| [dashboard_overview_fullpage.png](../evidence/dashboard_overview_fullpage.png) | Widget *Estimate overview* | Thấy đủ 6 trạng thái |
