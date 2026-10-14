# STORY-PRJ-07 — Trang chi tiết dự án & thao tác nhanh

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-75` → `REQ-PRJ-86` (12 REQ)
>
> AMB liên quan: `AMB-PRJ-06`, `AMB-PRJ-07`

**Mô tả Story:** Là nhân sự vận hành, tôi muốn mở một dự án và thấy ngay tình hình tổng quan cùng các thao tác thường dùng, để nắm việc và xử lý mà không phải đi vòng qua nhiều màn hình.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-75 | Truy cập trang chi tiết dự án | Mở một dự án cụ thể để xem toàn bộ thông tin | Mở `/admin/projects/view/{id}` → tiêu đề trang bằng **đúng tên dự án**; thanh tiêu đề hiển thị `<tên dự án> - <tên khách hàng>` kèm nhãn trạng thái | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-76 | Điều hướng giữa các tab bằng tham số URL | Mỗi tab có địa chỉ riêng, mở thẳng được | Mỗi tab trỏ tới `/admin/projects/view/{id}?group=<mã tab>`; 17 mã tab đúng bằng 17 giá trị của `Visible Tabs` (`project_overview` … `project_activity`) | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-77 | Thanh tab gom 6 tab bán hàng vào nhóm `Sales` | Thanh tab không dàn phẳng 17 mục | Thanh tab hiển thị 12 mục: `Overview` · `Tasks` · `Timesheets` · `Milestones` · `Files` · `Discussions` · `Gantt` · `Tickets` · `Contracts` · **`Sales`** · `Notes` · `Activity`. Mục `Sales` (`href="#"`) là danh sách thả xuống chứa 6 tab: `Proposals` · `Estimates` · `Invoices` · `Subscriptions` · `Expenses` · `Credit Notes` | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-78 | Chuyển nhanh sang dự án khác | Đổi dự án đang xem mà không quay lại danh sách | Ô chọn `#project_top` ở đầu trang liệt kê **toàn bộ dự án** dạng `#<id> - <tên>`, dự án đang xem nằm đầu danh sách dạng `<khách hàng> <tên dự án>` | 🟢 | — | Đọc DOM |
| REQ-PRJ-79 | Khối thông tin tổng quan | Tab `Overview` tóm tắt thông tin cốt lõi của dự án | Khối `Overview` hiển thị đúng **10 mục**: `Project #` · `Customer` · `Billing Type` · `Total Rate` · `Status` · `Date Created` · `Start Date` · `Deadline` · `Total Logged Hours` · `Description`. Dự án không có mô tả hiển thị **`No description for this project`** | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-80 | Thanh tiến độ dự án | Hiển thị phần trăm hoàn thành của dự án | Khối `Project Progress` hiển thị phần trăm dạng số kèm thanh tiến độ | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-81 | Tiến độ của dự án không có công việc | Dự án 0 công việc phải cho tiến độ đúng | ⚠️ **Đang KHÔNG đạt.** Kiểm chứng trên dự án id `2695` (0 công việc, bật `Calculate progress through tasks`): hiển thị **`Project Progress 100%`**, trong khi thẻ công việc cùng trang ghi `0 / 0 Open Tasks 0%` | 🟢 | — | Kiểm chứng thực tế · xem `AMB-PRJ-06` |
| REQ-PRJ-82 | Thẻ số liệu nhanh | Trang tổng quan có các thẻ tóm tắt số liệu | Hiển thị 3 nhóm thẻ: `Open Tasks` (`0 / 0`, kèm `0%`) · `Days Left` (`0 / N Days Left`, kèm `0%`) · khối chi phí gồm `Total Expenses` · `Billable Expenses` · `Billed Expenses` · `Unbilled Expenses`, mỗi mục kèm số tiền | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-83 | Số ngày còn lại khi dự án quá hạn | Dự án đã qua hạn chót thì thẻ `Days Left` phản ánh tình trạng | Kiểm chứng trên dự án hạn chót `01-08-2026` xem ngày `14-08-2026`: hiển thị **`0 / -19 Days Left`** — số ngày còn lại là **số âm** | 🟢 | — | Kiểm chứng thực tế · xem `AMB-PRJ-07` |
| REQ-PRJ-84 | Cảnh báo dự án quá hạn | Dự án qua hạn chót hiển thị băng cảnh báo ở đầu trang | Băng cảnh báo hiển thị nguyên văn **`This project is overdue by 13 days`** (số ngày = ngày hiện tại − `Deadline`); băng hiện ở **mọi** tab của trang chi tiết, không riêng `Overview` | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-85 | Quản lý thành viên dự án | Thêm hoặc bớt thành viên mà không mở biểu mẫu sửa | Hộp thoại `#add-edit-members` tiêu đề `Members` chứa ô chọn nhiều 3 nhân sự (`3` Project Manager · `1` Admin Anh Tester · `2` Admin Example) kèm `Select All` / `Deselect All` và nút `Save`. Ngoài ra mỗi thành viên trên thanh tiêu đề có liên kết gỡ nhanh `/admin/projects/remove_team_member/{project_id}/{staff_id}` | 🟢 | — | Đọc DOM |
| REQ-PRJ-86 | Lập hoá đơn cho dự án | Tạo hoá đơn từ dữ liệu dự án | Nút `Invoice Project` gọi `pre_invoice_project({id})` → phát sinh `GET /admin/projects/get_pre_invoice_project_info/{id}?csrf_token_name=…` → mở hộp thoại `#pre_invoice_project_settings` tiêu đề **`Project Invoice Info`** với 3 lựa chọn `invoice_data_type`: `single_line` **Single line [ Fixed Rate ]** (mặc định) · `task_per_item` Task per item · `timesheets_individualy` All timesheets individually; thêm công tắc `timesheets_include_notes`. Dự án 0 công việc hiển thị dòng **`No tasks to bill. Feel free to add whatever you want in the invoice items.`** | 🟢 | — | Kiểm chứng thực tế · API |

---

## 2. Đặc tả Trường Dữ liệu

### 2.1. Thanh thao tác nhanh của trang chi tiết

| Thành phần | Loại | Đích / Hành vi | REQ liên quan |
|---|---|---|---|
| `New Task` | Nút | Gọi `new_task_from_relation(undefined,'project',{id})` → mở hộp thoại tạo công việc gắn sẵn dự án | REQ-PRJ-98 (Story 09) |
| `Invoice Project` | Nút | Gọi `pre_invoice_project({id})` | REQ-PRJ-86 |
| `More` | Danh sách thả xuống | Chứa 7 mục dưới đây | — |
| ├ `Pin Project` | Liên kết | `/admin/projects/pin_action/{id}` | REQ-PRJ-68 (Story 05) |
| ├ `Edit Project` | Liên kết | `/admin/projects/project/{id}` | REQ-PRJ-60 (Story 05) |
| ├ `Copy Project` | Liên kết | Mở hộp thoại `#copy_project` | REQ-PRJ-69 (Story 06) |
| ├ `Mark as <trạng thái>` ×4 | Liên kết | `project_mark_as_modal(<mã>,{id},this)` | REQ-PRJ-65 (Story 05) |
| ├ `Export project data` | Liên kết | `/admin/projects/export_project_data/{id}` | REQ-PRJ-104 (Story 10) |
| └ `Delete Project` | Liên kết lớp `_delete` | `/admin/projects/delete/{id}` | REQ-PRJ-102 (Story 10) |

### 2.2. Hộp thoại `Project Invoice Info`

| Field (Label) | Loại UI | Mặc định | Ghi chú |
|---|---|---|---|
| `Single line [ Fixed Rate ]` | Nút chọn — `invoice_data_type` giá trị `single_line` | **Chọn sẵn** | Nhãn hiển thị kèm kiểu tính phí đang dùng của dự án |
| `Task per item` | Nút chọn — `invoice_data_type` giá trị `task_per_item` | — | Mỗi công việc thành một dòng hoá đơn |
| `All timesheets individually` | Nút chọn — `invoice_data_type` giá trị `timesheets_individualy` | — | Mỗi bản ghi chấm công thành một dòng |
| `timesheets_include_notes` | Công tắc | Tắt | Kèm ghi chú của bản ghi chấm công vào hoá đơn |
| `Invoice Project` | Nút gửi | — | — |

### 2.3. Khối `Overview` — 10 mục thông tin

| Mục | Nguồn giá trị | Ví dụ kiểm chứng (dự án `2695`) |
|---|---|---|
| `Project #` | Mã dự án | `2695` |
| `Customer` | Khách hàng đã chọn | `Công ty GM` |
| `Billing Type` | Kiểu tính phí | `Fixed Rate` |
| `Total Rate` | Tổng giá, định dạng tiền tệ | `$0.00` |
| `Status` | Trạng thái hiện tại | `In Progress` |
| `Date Created` | Ngày tạo, `dd-mm-yyyy` | `14-08-2026` |
| `Start Date` | Ngày bắt đầu | `20-08-2026` |
| `Deadline` | Hạn chót | `01-08-2026` |
| `Total Logged Hours` | Tổng giờ đã ghi nhận, `hh:mm` | `00:00` |
| `Description` | Mô tả, hoặc câu thay thế khi trống | `No description for this project` |

> 📌 Mục `Total Rate` hiển thị **kể cả khi kiểu tính phí không phải `Fixed Rate`** — chưa kiểm chứng nhãn đổi thành gì với `Project Hours` / `Task Hours`.

---

## 3. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Thông báo / Kết quả mong đợi |
|---|---|---|
| REQ-PRJ-79 | Dự án không có mô tả | `No description for this project` |
| REQ-PRJ-84 | Ngày hiện tại > `Deadline` | `This project is overdue by <N> days` |
| REQ-PRJ-86 | Mở hộp thoại lập hoá đơn cho dự án 0 công việc | `No tasks to bill. Feel free to add whatever you want in the invoice items.` |
| REQ-PRJ-81 | Dự án 0 công việc, bật tính tiến độ theo công việc | ⚠️ Hiện `100%` — kỳ vọng đúng phải là `0%`. Xem `AMB-PRJ-06` |

**Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế):**

- Băng cảnh báo quá hạn tính theo **`Deadline` so với ngày hiện tại**, hoàn toàn không xét `Start Date`. Dự án chưa tới ngày bắt đầu vẫn bị báo quá hạn nếu hạn chót đã qua — đúng tình huống dữ liệu sinh ra từ `REQ-PRJ-58`.
- Hai số liệu tiến độ trên **cùng một trang mâu thuẫn nhau**: khối `Project Progress` ghi `100%` trong khi thẻ `Open Tasks` ghi `0%`. Test nên khẳng định vào thẻ `Open Tasks` cho tới khi `AMB-PRJ-06` được trả lời.
- Người tạo dự án **tự động** thành thành viên; nhật ký hoạt động ghi nhận hai dòng riêng biệt ngay sau khi tạo (xem `REQ-PRJ-97`).

---

## 4. Luồng xử lý — Mở và nắm tình hình một dự án

```
1. Từ danh sách bấm mã dự án hoặc tên dự án
   → /admin/projects/view/{id}, mở sẵn tab Overview
2. Đọc thanh tiêu đề: <tên dự án> - <khách hàng> + nhãn trạng thái
3. Nếu quá hạn → băng cảnh báo "This project is overdue by N days"
4. Đọc khối Overview (10 mục) và các thẻ số liệu
   ⚠️ Đối chiếu Project Progress với thẻ Open Tasks — hai số có thể lệch
5. Chuyển tab bằng thanh tab, hoặc mở thẳng ?group=<mã tab>
   → 6 tab bán hàng nằm trong nhóm "Sales"
6. Thao tác nhanh: New Task · Invoice Project · More (7 mục)
7. Đổi sang dự án khác bằng ô chọn ở đầu trang
```
