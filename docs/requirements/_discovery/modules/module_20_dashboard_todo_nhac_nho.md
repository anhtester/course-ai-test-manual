# Khám phá module: Dashboard · To Do · Nhắc nhở (`DASH` · `TODO` · `REM`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)
>
> ⚠️ File này chứa **3 module** vì đều là màn hình cá nhân/tổng quan cỡ nhỏ. **Gộp file KHÔNG gộp prefix** — về sau vẫn sinh ra 3 thư mục và 3 file `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` riêng.

---

## 1. Dashboard (`DASH`)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Dashboard |
| Route | `/admin/` |
| Loại màn hình | Dashboard — widget kéo thả |
| CRUD | Không · có **Dashboard Options** và **Reset Dashboard** (`/admin/staff/reset_dashboard`) |
| Ước độ lớn | ~10 widget · ~8–12 REQ |
| Risk | 🟢 Thấp — chỉ hiển thị, nhưng là nơi lộ nhiều số liệu tổng hợp cần đối chiếu |

**Widget quan sát được:** Invoices Awaiting Payment (3/6) · Converted Leads (0/0) · Projects In Progress (67/125) · Tasks Not Finished (232/233) · *Invoice overview* · *Estimate overview* · *Proposal overview* · My To Do Items · thống kê tài chính theo năm (Outstanding / Past Due / Paid Invoices) · danh sách task của tôi · dự án · hợp đồng sắp hết hạn.

Widget kéo thả được (có tay nắm kéo) → cần kiểm việc lưu bố cục theo người dùng.

---

## 2. Việc cần làm — To Do (`TODO`)

| Mục | Giá trị |
|---|---|
| Tên trên UI | My To Do Items |
| Route | `/admin/todo` |
| Loại màn hình | Danh sách kéo thả (Latest to do's / Latest finished to do's) |
| CRUD | ✅ **New To Do** · Sửa · Xoá · đánh dấu hoàn thành |
| Status flow | Chưa xong / Đã xong (gạch ngang) |
| Ước độ lớn | ~8–12 REQ |
| Risk | 🟢 Thấp — dữ liệu cá nhân, không ảnh hưởng module khác |

⚠️ Danh sách đang lẫn dữ liệu rác từ automation cũ (`Auto_Todo_*`).

---

## 3. Nhắc nhở (`REM`)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Reminders |
| Route | `/admin/misc/reminders` |
| Loại màn hình | Danh sách |
| CRUD | ✅ (nhắc nhở được tạo từ tab Reminders của khách hàng / dự án / hợp đồng…) |
| Ước độ lớn | ~8–12 REQ |
| Risk | 🟢 Thấp |

Nhắc nhở là **tính năng cắt ngang**: xuất hiện dưới dạng tab trong `CUST`, `PRJ`, `CTR`, `LEAD`… và tổng hợp về `/admin/misc/reminders`.

---

## Vùng chưa xác minh (cả 3 module)

- Cấu hình **Dashboard Options** (ẩn/hiện widget) và hành vi **Reset Dashboard**.
- Form tạo To Do và Reminder: field, ngày nhắc, gửi email thông báo.
- Cơ chế bắn thông báo khi tới hạn nhắc nhở.

## Evidence

| Tệp | Màn hình | Trạng thái | Module |
|---|---|---|---|
| [dashboard_overview_fullpage.png](../evidence/dashboard_overview_fullpage.png) | Dashboard | Mặc định, có dữ liệu | `DASH` |
| [todo_overview_fullpage.png](../evidence/todo_overview_fullpage.png) | My To Do Items | Mặc định | `TODO` |
| [reminders_list_fullpage.png](../evidence/reminders_list_fullpage.png) | Danh sách nhắc nhở | Mặc định | `REM` |
