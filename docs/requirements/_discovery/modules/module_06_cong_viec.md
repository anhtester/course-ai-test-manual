# Khám phá module: Công việc (`TASK`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Tasks |
| Bí danh | Công việc, Nhiệm vụ |
| Prefix | `TASK` |
| Route | `/admin/tasks` · danh sách rút gọn `/admin/tasks/list_tasks` · chi tiết `/admin/tasks/view/{id}` |
| Loại màn hình | Danh sách + **Tasks Overview** (Kanban/biểu đồ) + chi tiết dạng modal |
| CRUD | ✅ **New Task** · Sửa · Xoá · **Bulk Actions** · **Export** |
| Status flow | ✅ Cột **Status** + **Priority**; Dashboard có **Tasks Not Finished 232 / 233** |
| Tính năng đặc thù | **Start Timer** trên từng dòng → bấm giờ làm việc (timesheet) |
| Ước độ lớn | Danh sách 9 cột + form + timer + comment/checklist · ~40–55 REQ |
| Risk | 🔴 Cao — gắn với chấm công/tính giờ (`Timesheets`), sai giờ là sai hoá đơn |

## Màn hình danh sách

- Cột: `` · `#` · Name · Status · Start Date · Due Date · Assigned to · Tags · Priority
- Thanh công cụ: **New Task** · **Tasks Overview** · **Export** · **Bulk Actions** (có dropdown **Status** + 3 dropdown chọn) · bộ lọc **Add Rule**
- Mỗi dòng có hành động: **Start Timer** · **Edit** · **Delete**

## Phát hiện tầng network

- `POST /admin/tasks/table` — nguồn dữ liệu bảng, dùng ở cả Dashboard và trong tab Tasks của dự án.

## Vùng chưa xác minh

- Danh sách trạng thái đầy đủ (quan sát được cột Status nhưng chưa liệt kê giá trị) và quy tắc chuyển trạng thái.
- Form tạo task: liên kết tới đối tượng nào (Project / Invoice / Customer / Lead / Contract…), checklist, người theo dõi (follower), lặp lại (recurring).
- Hành vi timer: cho phép chạy nhiều timer cùng lúc không, tính giờ ra sao.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [tasks_list_fullpage.png](../evidence/tasks_list_fullpage.png) | Danh sách công việc | Mặc định, có dữ liệu |
