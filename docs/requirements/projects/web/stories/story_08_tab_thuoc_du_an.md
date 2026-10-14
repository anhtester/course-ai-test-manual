# STORY-PRJ-08 — Các tab nghiệp vụ thuộc dự án

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-87` → `REQ-PRJ-97` (11 REQ)
>
> AMB liên quan: `AMB-PRJ-13`, `AMB-PRJ-16`

**Mô tả Story:** Là nhân sự vận hành, tôi muốn quản lý mốc tiến độ, tệp, thảo luận, ghi chú và theo dõi chấm công ngay trong dự án, để mọi thứ liên quan tới dự án nằm cùng một chỗ.

Bảy tab dưới đây **chỉ tồn tại bên trong dự án**, không có màn hình độc lập ngoài module — đúng như tầng khám phá đã ghi nhận.

> ⚠️ **Giới hạn kiểm chứng.** Khảo sát chạy trên một dự án **mới tạo, hoàn toàn rỗng**, nên mọi tab đều ở trạng thái không có dữ liệu. Cấu trúc biểu mẫu và cột bảng đã đọc đầy đủ từ DOM, nhưng **thao tác CRUD chưa chạy thật** (không tạo mốc, không tải tệp, không mở thảo luận) vì môi trường dùng chung. Xem `AMB-PRJ-13`.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-87 | Xem danh sách mốc tiến độ | Tab `Milestones` liệt kê mốc tiến độ của dự án | Mở `?group=project_milestones` → bảng có 4 cột: `Name` · `Start Date` · `Due date` · `Description`. Dự án rỗng hiển thị bảng không có dòng nào | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-88 | Biểu mẫu tạo/sửa mốc tiến độ | Người dùng thêm hoặc sửa một mốc tiến độ | Hộp thoại `#milestone` dùng chung cho hai chế độ (`Edit Milestone` / `New Milestone`), chứa: `project_id` (ẩn, bằng id dự án) · `name` `*` · `start_date` `*` (**điền sẵn hôm nay**) · `due_date` `*` (trống) · `description` · `description_visible_to_customer` (tắt) · `hide_from_customer` (tắt) · `milestone_order` kiểu số (**mặc định `1`**) | 🟢 | — | Đọc DOM |
| REQ-PRJ-89 | Lưu mốc tiến độ | Mốc tiến độ được ghi nhận vào dự án | Chưa kiểm chứng — không chạy thao tác tạo trên môi trường dùng chung | ⚪ | — | Xem `AMB-PRJ-13` |
| REQ-PRJ-90 | Xem danh sách tệp của dự án | Tab `Files` liệt kê tệp đính kèm | Mở `?group=project_files` → bảng có 8 cột: `Filename` · `File type` · `Last Activity` · `Total Comments` · `Visible to Customer` · `Uploaded by` · `Date uploaded` · `Options`; kèm thanh công cụ `Export` · `Bulk Actions` · `Download All` | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-91 | Tải tệp lên dự án | Người dùng đính kèm tệp vào dự án | Vùng kéo thả (`form.dropzone`) với dòng chữ **`Drop files here to upload`**; bấm vào vùng cũng mở hộp chọn tệp (lớp `dz-clickable`). **Không** khai báo `accept` → không đọc được giới hạn định dạng từ DOM. Thao tác tải lên **chưa kiểm chứng** | ⚪ | — | Đọc DOM · xem `AMB-PRJ-13` |
| REQ-PRJ-92 | Xem bảng chấm công của dự án | Tab `Timesheets` liệt kê thời gian đã ghi nhận | Mở `?group=project_timesheets` → bảng có 10 cột: `Member` · `Task` · `Timesheet Tags` · `Start Time` · `End Time` · `Note` · `Time (h)` · `Time (decimal)` · `Options`; kèm `Export` và chọn số dòng mỗi trang | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-93 | Xem danh sách thảo luận | Tab `Discussions` liệt kê chủ đề thảo luận của dự án | Mở `?group=project_discussions` → bảng có 4 cột: `Subject` · `Last Activity` · `Total Comments` · `Visible to Customer` | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-94 | Biểu mẫu tạo/sửa thảo luận | Người dùng mở một chủ đề thảo luận mới | Hộp thoại `#discussion` dùng chung hai chế độ (`Edit Discussion` / `Create Discussion`), chứa: `project_id` (ẩn) · `subject` `*` · `description` · `show_to_customer` (**mặc định BẬT**). Thao tác lưu **chưa kiểm chứng** | ⚪ | — | Đọc DOM · xem `AMB-PRJ-13` |
| REQ-PRJ-95 | Xem Gantt của riêng dự án | Tab `Gantt` vẽ biểu đồ tiến độ công việc trong dự án | Mở `?group=project_gantt` → có 2 bộ lọc: `gantt_type` với 3 lựa chọn `milestones` Milestones · `members` Members · `status` Status; và `gantt_task_status` với 6 lựa chọn `` All · `1` Not Started · `4` In Progress · `3` Testing · `2` Awaiting Feedback · `5` Complete | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-96 | Ghi chú cá nhân trên dự án | Mỗi nhân sự có vùng ghi chú riêng cho dự án | Mở `?group=project_notes` → tiêu đề **`Personal notes`**, trình soạn thảo TinyMCE và nút **`Save note`**; biểu mẫu gửi `POST /admin/projects/save_note/{id}` với đúng 2 trường `csrf_token_name` và `content` | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-97 | Nhật ký hoạt động của dự án | Tab `Activity` ghi lại mọi thay đổi trên dự án | Mở `?group=project_activity` → danh sách dòng thời gian, mỗi dòng gồm mốc thời gian tương đối, người thực hiện, mô tả hành động và nhãn `Visible to customer`. Kiểm chứng ngay sau khi tạo dự án `2695`: đúng **2 dòng** — `Admin Example - Added new team member Admin Example` và `Admin Example - Created the project` | 🟢 | — | Kiểm chứng thực tế |

---

## 2. Đặc tả Trường Dữ liệu

### 2.1. Hộp thoại `New Milestone` / `Edit Milestone` (`#milestone`)

| Field (Label) | Loại UI | Required | Mặc định | REQ | Ghi chú |
|---|---|---|---|---|---|
| *(ẩn)* `project_id` | Ô ẩn | — | Id dự án đang mở | REQ-PRJ-88 | — |
| `Name` | Ô nhập chữ — `name` | **Có** `*` | Trống | REQ-PRJ-88 | Không khai báo `maxlength` |
| `Start Date` | Ô nhập ngày — `start_date` | **Có** `*` | **Ngày hôm nay** | REQ-PRJ-88 | Định dạng `dd-mm-yyyy` |
| `Due date` | Ô nhập ngày — `due_date` | **Có** `*` | Trống | REQ-PRJ-88 | Ràng buộc so với `Start Date` **chưa kiểm chứng** |
| `Description` | Ô nhập nhiều dòng — `description` | Không | Trống | REQ-PRJ-88 | — |
| `Show description to customer` | Công tắc — `description_visible_to_customer` | Không | **Tắt** | REQ-PRJ-88 | — |
| `Hide from customer` | Công tắc — `hide_from_customer` | Không | **Tắt** | REQ-PRJ-88 | ⚠️ Hai công tắc cùng nói về việc hiển thị cho khách hàng nhưng **ngược chiều nhau** — quan hệ giữa chúng chưa rõ |
| `Order` | Ô nhập số — `milestone_order` | Không | **`1`** | REQ-PRJ-88 | Quy tắc trùng số thứ tự — xem `AMB-PRJ-16` |
| `Save` | Nút gửi | — | — | REQ-PRJ-89 | — |

### 2.2. Hộp thoại `Create Discussion` / `Edit Discussion` (`#discussion`)

| Field (Label) | Loại UI | Required | Mặc định | REQ |
|---|---|---|---|---|
| *(ẩn)* `project_id` | Ô ẩn | — | Id dự án đang mở | REQ-PRJ-94 |
| `Subject` | Ô nhập chữ — `subject` | **Có** `*` | Trống | REQ-PRJ-94 |
| `Description` | Ô nhập nhiều dòng — `description` | Không | Trống | REQ-PRJ-94 |
| `Visible to Customer` | Công tắc — `show_to_customer` | Không | **BẬT** | REQ-PRJ-94 |

> ⚠️ Thảo luận **mặc định hiển thị cho khách hàng**. Người dùng phải chủ động tắt nếu muốn thảo luận nội bộ — rủi ro lộ thông tin nếu thao tác vội.

### 2.3. Cột bảng của từng tab

| Tab | Cột | Thanh công cụ |
|---|---|---|
| `Milestones` | `Name` · `Start Date` · `Due date` · `Description` | `New Milestone` |
| `Timesheets` | `Member` · `Task` · `Timesheet Tags` · `Start Time` · `End Time` · `Note` · `Time (h)` · `Time (decimal)` · `Options` | `Export` · chọn số dòng/trang |
| `Files` | `Filename` · `File type` · `Last Activity` · `Total Comments` · `Visible to Customer` · `Uploaded by` · `Date uploaded` · `Options` | `Export` · `Bulk Actions` · `Download All` · vùng kéo thả |
| `Discussions` | `Subject` · `Last Activity` · `Total Comments` · `Visible to Customer` | `Export` · chọn số dòng/trang |

---

## 3. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Thông báo / Kết quả mong đợi |
|---|---|---|
| REQ-PRJ-87, 90, 92, 93 | Tab không có dữ liệu | `No entries found` |
| REQ-PRJ-91 | Vùng tải tệp ở trạng thái chờ | `Drop files here to upload` |
| REQ-PRJ-96 | Lưu ghi chú cá nhân | Gửi `POST /admin/projects/save_note/{id}`; thông báo kết quả **chưa kiểm chứng** |
| REQ-PRJ-89, 91, 94 | Lưu mốc / tải tệp / lưu thảo luận | **Chưa kiểm chứng** — xem `AMB-PRJ-13` |

**Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế):**

- Ba tab `Milestones`, `Files`, `Discussions` đều có cột hoặc công tắc `Visible to Customer` — việc chia sẻ được quyết định **ở từng bản ghi**, độc lập với 18 công tắc quyền ở cấp dự án (`STORY-PRJ-03`). Hai tầng cấu hình này chồng lên nhau và hệ thống **không** giải thích cái nào thắng.
- Tab `Notes` là **ghi chú cá nhân** (`Personal notes`), không phải ghi chú chung của dự án — mỗi nhân sự thấy nội dung của riêng mình. Đây là điểm dễ hiểu nhầm khi viết test.
- Tab `Gantt` trong dự án và trang Gantt tổng (`REQ-PRJ-18`) dùng **bộ lọc khác nhau**: trong dự án lọc theo trạng thái *công việc*, ngoài tổng lọc theo trạng thái *dự án*.

---

## 4. Luồng xử lý — Thêm một mốc tiến độ

```
1. Mở /admin/projects/view/{id}?group=project_milestones
2. Bấm "New Milestone" → hộp thoại #milestone
3. Nhập Name
4. Kiểm tra Start Date (điền sẵn hôm nay), nhập Due date
5. (Tuỳ chọn) Nhập Description
6. (Tuỳ chọn) Bật "Show description to customer" / "Hide from customer"
7. (Tuỳ chọn) Đổi Order (mặc định 1)
8. Bấm "Save"
   → kết quả chưa kiểm chứng (AMB-PRJ-13)
```
