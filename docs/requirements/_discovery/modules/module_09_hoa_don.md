# Khám phá module: Hoá đơn (`INV`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Invoices |
| Bí danh | Hoá đơn |
| Prefix | `INV` |
| Route | `/admin/invoices` · tạo mới `/admin/invoices/invoice` · chi tiết `/admin/invoices/list_invoices/{id}` |
| Loại màn hình | Danh sách + form chứng từ nhiều dòng + 2 màn hình phụ |
| CRUD | ✅ **Create New Invoice** · Sửa · Xoá · **Export** |
| Màn hình phụ (không tách module) | **Batch Payments** · **Recurring Invoices** |
| Status flow | ✅ **Draft · Not Sent · Unpaid · Partially Paid · Overdue · Paid** — có bộ lọc **Filter by status** lưu được (**Apply and Save**) |
| Ước độ lớn | Form chứng từ + item + thuế + thanh toán + lặp định kỳ · ~50–70 REQ |
| Risk | 🔴 Cao — trung tâm dòng tiền; sai số tiền/thuế/trạng thái là lỗi nghiêm trọng |

## Màn hình danh sách

- Cột: Invoice # · Amount · Total Tax · Date · Customer · Project · Tags · Due Date · Status
- Thanh công cụ: **Create New Invoice** · **Batch Payments** · **Recurring Invoices** · **Filter by status** · **Export** · bộ lọc **Add Rule**
- Bộ lọc trạng thái mặc định quan sát được: *Unpaid, Partially Paid* — nút **Apply and Save** cho thấy bộ lọc **được ghi nhớ theo người dùng** → cần kiểm khi test (trạng thái lọc còn giữ qua các phiên)

## Trạng thái quan sát được (Dashboard — widget *Invoice overview*)

| Trạng thái | Số liệu | Link lọc |
|---|---|---|
| Draft | 1 | `?status=6` |
| Not Sent | 4 | `?filter=not_sent` |
| Unpaid | 3 | `?status=1` |
| Partially Paid | 0 | `?status=3` |
| Overdue | 0 | `?status=4` |
| Paid | 3 | `?status=2` |

> Mã trạng thái trên URL (`status=1…6`) là dữ kiện quý cho automation — ghi lại nguyên trạng.

## Vùng chưa xác minh

- Form tạo hoá đơn: item, thuế, chiết khấu, tiền tệ, phương thức thanh toán cho phép.
- **Recurring Invoices** — chu kỳ, ngày sinh hoá đơn kế tiếp, dừng/tiếp tục.
- **Batch Payments** — ghi nhận thanh toán hàng loạt.
- Luồng gửi email, xem PDF, ghi nhận thanh toán từng phần.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [invoices_list_fullpage.png](../evidence/invoices_list_fullpage.png) | Danh sách hoá đơn | Đang áp bộ lọc *Unpaid, Partially Paid* |
| [dashboard_overview_fullpage.png](../evidence/dashboard_overview_fullpage.png) | Widget *Invoice overview* | Thấy đủ 6 trạng thái |
