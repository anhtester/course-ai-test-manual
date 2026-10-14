# Khám phá module: Khách hàng tiềm năng (`LEAD`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Leads |
| Bí danh | Khách hàng tiềm năng |
| Prefix | `LEAD` |
| Route | `/admin/leads` |
| Loại màn hình | Danh sách + Kanban (theo trạng thái) + form chi tiết dạng modal |
| CRUD | ✅ **New Lead** · Sửa · Xoá · **Import** (qua Bulk/menu) · **Export** · **Bulk Actions** |
| Status flow | ✅ Có — cột **Status** + cột **Source**; Dashboard có chỉ số **Converted Leads** |
| Số tab | ❔ Chưa mở form chi tiết |
| Ước độ lớn | Danh sách 13 cột + form nhiều field · ~30–40 REQ |
| Risk | 🟡 Trung bình — đầu phễu bán hàng, có luồng **chuyển đổi Lead → Customer** cần kiểm kỹ |

## Màn hình danh sách

- Cột: `` · `#` · Name · Company · Email · Phone · Value · Tags · Assigned · Status · Source · Last Contact · Created
- Thanh công cụ: **New Lead** · **Export** · **Bulk Actions** · 3 dropdown lọc (**Nothing selected** × 3) · modal xác nhận (**Close** / **Confirm**) · modal có nút **Save**

## Vùng chưa xác minh

- Danh sách trạng thái đầy đủ và **quy tắc chuyển trạng thái** (kéo thả Kanban).
- Danh sách **Lead Source** và **Lead Status** — dữ liệu master nằm trong khu Setup (đang 403, ngoài phạm vi đợt này).
- Luồng **Convert to Customer**: field nào được mang sang, có tạo liên hệ không.
- Form chi tiết (modal) chưa mở → chưa biết có tab con (Profile / Proposals / Tasks / Attachments / Reminders / Notes) hay không.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [leads_list_fullpage.png](../evidence/leads_list_fullpage.png) | Danh sách Leads | Mặc định |
