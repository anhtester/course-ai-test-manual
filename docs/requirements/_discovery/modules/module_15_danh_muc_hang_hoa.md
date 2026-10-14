# Khám phá module: Danh mục hàng hoá / dịch vụ — Items (`ITEM`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Items · Invoice Items |
| Bí danh | Danh mục hàng hoá, Sản phẩm/Dịch vụ |
| Prefix | `ITEM` |
| Route | `/admin/invoice_items` |
| Loại màn hình | Danh sách + form dạng modal + quản lý **Groups** |
| CRUD | ✅ **New Item** · Sửa · Xoá · **Import Items** · **Export** · **Bulk Actions** · **Groups** (nhóm hàng hoá) |
| Status flow | Không có |
| Ước độ lớn | Danh sách 8 cột + form 7 field + nhóm · ~15–22 REQ |
| Risk | 🟡 Trung bình — dữ liệu nền cho mọi chứng từ bán hàng; sai đơn giá/thuế lan sang hoá đơn |

## Màn hình danh sách

- Cột: `` · Description · Long Description · **Rate** · **Tax 1** · **Tax 2** · Unit · Group Name
- Bảng phụ (Groups): ID · Group Name
- Thanh công cụ: **New Item** · **Import Items** · **Groups** · **Export** · **Bulk Actions** · modal xác nhận (**Close** / **Confirm**)
- Dropdown thuế mặc định quan sát được: **No Tax** (2 select thuế trên form)

## Vùng chưa xác minh

- Field spec form thêm item (bắt buộc/không, độ dài, định dạng số Rate).
- Danh sách **Taxes** đầy đủ — master data trong khu Setup (403, ngoài phạm vi đợt này).
- Luồng Import Items (mẫu file, cột bắt buộc, xử lý dòng lỗi).

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [items_list_fullpage.png](../evidence/items_list_fullpage.png) | Danh sách Items + bảng Groups | Mặc định |
