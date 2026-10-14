# Khám phá module: Hỗ trợ — Support Tickets (`TICK`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Support · Support Tickets |
| Bí danh | Hỗ trợ, Ticket |
| Prefix | `TICK` |
| Route | `/admin/tickets` · tạo mới `/admin/tickets/add` |
| Loại màn hình | Danh sách + màn hình hội thoại (ticket + reply) |
| CRUD | ✅ **New Ticket** · Trả lời · Đổi trạng thái · **Bulk Actions** · **Export** |
| Status flow | ✅ Cột **Status** (quan sát được giá trị **Open**) + cột **Priority** |
| Ước độ lớn | Danh sách 11 cột + form + hội thoại + đính kèm · ~30–40 REQ |
| Risk | 🟡 Trung bình — kênh giao tiếp với khách hàng, có phân công theo phòng ban/dịch vụ |

## Màn hình danh sách

- Cột: `` · `#` · Subject · Tags · **Department** · **Service** · Contact · **Status** · **Priority** · Last Reply · Created
- Thanh công cụ: **New Ticket** · **Export** · **Bulk Actions** (5 dropdown lọc: Department / Service / Status / Priority / Assigned) · modal xác nhận

## Vùng chưa xác minh

- Danh sách đầy đủ **Status**, **Priority**, **Departments**, **Services** — master data nằm trong khu Setup (403, ngoài phạm vi đợt này). Một phần suy ra được từ dropdown lọc khi recon cấp module.
- Luồng tạo ticket thay khách hàng, gán nhân viên, trả lời có đính kèm.
- Ticket đến từ email (email piping) — không kiểm chứng được từ UI.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [tickets_list_fullpage.png](../evidence/tickets_list_fullpage.png) | Danh sách ticket | Mặc định |
