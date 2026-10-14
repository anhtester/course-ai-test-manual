# Khám phá module: Dự án (`PRJ`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Projects |
| Bí danh | Dự án |
| Prefix | `PRJ` |
| Route | `/admin/projects` · chi tiết `/admin/projects/view/{id}` · tạo mới `/admin/projects/project` |
| Loại màn hình | Danh sách + màn hình chi tiết **17 tab** |
| CRUD | ✅ **New Project** · Sửa · Xoá · **Copy Project** · **Export** |
| Status flow | ✅ Cột **Status**; Dashboard có chỉ số **Projects In Progress 67 / 125** |
| Số tab chi tiết | **17** |
| Ước độ lớn | Form nhiều field + 17 tab · ~60–80 REQ |
| Risk | 🔴 Cao — module lớn nhất hệ thống, nhiều tab, nhiều phụ thuộc (khách hàng, công việc, tài chính) |

## Màn hình danh sách

- Cột: `#` · Project Name · Customer · Tags · Start Date · Deadline · Members · Status
- Thanh công cụ: **New Project** · **Copy Project** · **Export** · bộ lọc điều kiện (**Add Rule** / **Apply**) · ô chọn kiểu "Select and begin typing"

## Màn hình chi tiết — 17 tab

`Overview` · `Tasks` · `Timesheets` · `Milestones` · `Files` · `Discussions` · `Gantt` · `Tickets` · `Contracts` · `Proposals` · `Estimates` · `Invoices` · `Subscriptions` · `Expenses` · `Credit Notes` · `Notes` · `Activity`

Điều hướng: `/admin/projects/view/{id}?group=project_<tên_tab>`.
Tab Overview còn có bộ lọc biểu đồ: `this_week` · `last_week` · `this_month` · `last_month`.

> **Không tách** các tab này thành module riêng: `Milestones`, `Timesheets`, `Discussions`, `Files`, `Gantt`, `Notes`, `Activity` không tồn tại ngoài dự án. Các tab `Tasks` / `Tickets` / `Invoices`… là **view chiếu** của module khác.

## Phát hiện tầng network

- Danh sách nạp qua `POST /admin/projects/table`; danh sách công việc trong dự án qua `POST /admin/tasks/table`.

## Vùng chưa xác minh

> ✅ **Đã recon cấp module ngày 14-08-2026** — tài liệu đầy đủ: [../../projects/REQUIREMENTS_PROJECTS_SUMMARY.md](../../projects/REQUIREMENTS_PROJECTS_SUMMARY.md) (104 REQ, tách 10 file story).

- ~~Field spec form tạo dự án~~ → đã gỡ, xem `STORY-PRJ-02`
- ~~Danh sách trạng thái đầy đủ và quy tắc chuyển trạng thái~~ → đã gỡ, xem ma trận trạng thái ở index. Lưu ý mã giá trị **không** liên tục: `Cancelled`=`5`, `Finished`=`4`
- ~~Cơ chế **Visible Tabs**~~ → đã gỡ ở mức biểu mẫu, xem `STORY-PRJ-03`. **Còn treo:** cấu hình tác động tới khu quản trị hay chỉ cổng khách hàng (`AMB-PRJ-14`)
- **Hành vi Copy Project** — vẫn treo, chưa chạy thật vì môi trường dùng chung (`AMB-PRJ-11`)

## ⚠️ Ghi chú môi trường dùng chung

Danh sách dự án đang lẫn **rất nhiều dữ liệu rác từ automation cũ** (`AUTO_POM_ADD_PROJECT_*`, `AUTO_POM_DELETE_PROJECT_*`). Khi recon và khi viết test case, phải dùng dữ liệu có tiền tố truy vết riêng và dọn sau khi chạy.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [projects_list_fullpage.png](../evidence/projects_list_fullpage.png) | Danh sách dự án | Mặc định, có dữ liệu |
| [project_detail_tabs_fullpage.png](../evidence/project_detail_tabs_fullpage.png) | Chi tiết dự án (id 2364) | Tab Overview, thấy đủ 17 tab |
