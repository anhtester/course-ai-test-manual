# Khám phá module: Chi phí (`EXP`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Expenses |
| Bí danh | Chi phí |
| Prefix | `EXP` |
| Route | `/admin/expenses` · tạo mới `/admin/expenses/expense` |
| Loại màn hình | Danh sách + form |
| CRUD | ✅ **Record Expense** · Sửa · Xoá · **Import Expenses** · **Export** · **Bulk Actions** |
| Status flow | Không có cột trạng thái; có cột **Invoice** (chi phí đã xuất hoá đơn lại cho khách hay chưa) |
| Ước độ lớn | Danh sách 11 cột + form + đính kèm hoá đơn chứng từ · ~20–28 REQ |
| Risk | 🟡 Trung bình — ảnh hưởng báo cáo lợi nhuận (*Expenses vs Income*) và tái xuất hoá đơn cho khách |

## Màn hình danh sách

- Cột: `` · Category · Amount · **Receipt** · Name · Date · Project · Customer · Invoice · Reference # · Payment Mode
- Thanh công cụ: **Record Expense** · **Import Expenses** · **Export** · **Bulk Actions** (2 dropdown chọn) · modal xác nhận

## Vùng chưa xác minh

- Danh sách **Expense Categories** và **Payment Modes** — master data trong khu Setup (403, ngoài phạm vi đợt này).
- Luồng **chi phí lặp lại** (recurring expense) — Perfex có tính năng này, chưa xác minh trên UI.
- Luồng **convert expense → invoice** (tái xuất hoá đơn cho khách, cột Invoice).
- Upload **Receipt** (ảnh/PDF chứng từ).

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [expenses_list_fullpage.png](../evidence/expenses_list_fullpage.png) | Danh sách chi phí | Mặc định |
