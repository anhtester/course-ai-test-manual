# Khám phá module: Giấy báo có — Credit Notes (`CN`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Credit Notes |
| Bí danh | Giấy báo có, Phiếu ghi có |
| Prefix | `CN` |
| Route | `/admin/credit_notes` · tạo mới `/admin/credit_notes/credit_note` |
| Loại màn hình | Danh sách + form chứng từ nhiều dòng |
| CRUD | ✅ **New Credit Note** · Sửa · Xoá · **Export** |
| Status flow | ✅ Có cột **Status** (giá trị chưa liệt kê được ở tầng khám phá) |
| Ước độ lớn | Form chứng từ + item + áp dụng vào hoá đơn · ~25–35 REQ |
| Risk | 🔴 Cao — điều chỉnh giảm công nợ, ảnh hưởng trực tiếp số tiền phải thu |

## Màn hình danh sách

- Cột: Credit Note # · Credit Note Date · Customer · Status · Project · Reference # · Amount · **Remaining Amount**
- Thanh công cụ: **New Credit Note** · **Export** · bộ lọc **Add Rule** / **Apply**

Cột **Remaining Amount** cho thấy giấy báo có được **áp dụng từng phần** vào hoá đơn → cần ma trận trạng thái riêng khi recon.

## Vùng chưa xác minh

- Giá trị đầy đủ của cột **Status** (Open / Closed / Void…).
- Luồng **áp dụng credit note vào hoá đơn** và hoàn tiền (refund).
- Quan hệ với Hoá đơn: một credit note áp cho nhiều hoá đơn được không.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [credit_notes_list_fullpage.png](../evidence/credit_notes_list_fullpage.png) | Danh sách Credit Notes | Mặc định |
