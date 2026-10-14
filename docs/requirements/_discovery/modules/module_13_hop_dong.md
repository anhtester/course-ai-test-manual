# Khám phá module: Hợp đồng (`CTR`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Contracts |
| Bí danh | Hợp đồng |
| Prefix | `CTR` |
| Route | `/admin/contracts` · tạo mới/chi tiết `/admin/contracts/contract/{id}` |
| Loại màn hình | Danh sách + form có soạn thảo nội dung + chữ ký |
| CRUD | ✅ **New Contract** · Sửa · Xoá · **Export** |
| Status flow | Cột **Signature** (đã ký / chưa ký) — trạng thái ký, không phải status thường |
| Ước độ lớn | Form + editor + ký + đính kèm + bình luận · ~25–35 REQ |
| Risk | 🟡 Trung bình — cam kết pháp lý với khách hàng, có luồng ký từ phía khách |

## Màn hình danh sách

- Cột: `#` · Subject · Customer · Contract Type · Contract Value · Start Date · End Date · Project · Signature
- Thanh công cụ: **New Contract** · **Export** · bộ lọc **Add Rule** / **Apply**

## Phát hiện từ thông báo hệ thống

- *"New comment from customer on contract …"* → khách hàng **bình luận** được trên hợp đồng.
- *"Contract with subject 21 has been signed by the customer"* → khách hàng **ký điện tử** từ cổng khách hàng.

Hai luồng này bắt nguồn từ ngoài khu `/admin` → khi recon phải ghi rõ phần nào kiểm chứng được, phần nào không.

## Vùng chưa xác minh

- Danh sách **Contract Types** — dữ liệu master trong khu Setup (403, ngoài phạm vi đợt này).
- Form tạo hợp đồng: field, nội dung mẫu (template), ngày hết hạn, nhắc hết hạn.
- Luồng gửi hợp đồng cho khách ký và huỷ chữ ký.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [contracts_list_fullpage.png](../evidence/contracts_list_fullpage.png) | Danh sách hợp đồng | Mặc định, có dữ liệu |
