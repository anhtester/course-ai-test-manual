# Khám phá module: Thanh toán (`PAY`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Payments |
| Bí danh | Thanh toán, Phiếu thu |
| Prefix | `PAY` |
| Route | `/admin/payments` |
| Loại màn hình | Danh sách (chỉ tra cứu) |
| CRUD | **Không tạo được từ màn hình này** — chỉ có **Export**. Thanh toán được ghi nhận từ Hoá đơn (`INV`) hoặc **Batch Payments** |
| Status flow | Không có |
| Ước độ lớn | 1 danh sách 7 cột + màn hình chi tiết phiếu thu · ~15–20 REQ |
| Risk | 🔴 Cao — dữ liệu tiền thật, đối chiếu công nợ; ghi sai là sai sổ |

## Màn hình danh sách

- Cột: Payment # · Invoice # · Payment Mode · Transaction ID · Customer · Amount · Date
- Thanh công cụ: **Export** (không có nút tạo mới)

## Vì sao vẫn là module riêng (không gộp vào `INV`)

Có **màn hình cấp hệ thống riêng**, mã chứng từ riêng (Payment #), và là nơi đối chiếu giao dịch (Transaction ID, Payment Mode) độc lập với từng hoá đơn.

## Vùng chưa xác minh

- Màn hình chi tiết phiếu thu (mở từ Payment #), tuỳ chọn gửi email biên nhận, xuất PDF.
- Danh sách **Payment Modes** — dữ liệu master nằm trong khu Setup (403, ngoài phạm vi đợt này).
- Hành vi khi xoá phiếu thu: hoá đơn có tự quay về *Unpaid* không.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [payments_list_fullpage.png](../evidence/payments_list_fullpage.png) | Danh sách thanh toán | Mặc định |
