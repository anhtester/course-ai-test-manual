# STORY-PRJ-02 — Tạo dự án: thông tin chính (tab `Project`)

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-24` → `REQ-PRJ-41` (18 REQ)
>
> AMB liên quan: `AMB-PRJ-06`, `AMB-PRJ-09`, `AMB-PRJ-10` · RISK liên quan: `RISK-PRJ-06`

**Mô tả Story:** Là nhân sự vận hành, tôi muốn tạo một dự án mới gắn với khách hàng, chọn kiểu tính phí và mốc thời gian, để bắt đầu quản lý công việc cho khách hàng đó.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-24 | Truy cập biểu mẫu tạo dự án | Người dùng mở biểu mẫu thêm dự án mới | Bấm `New Project` ở danh sách → mở `/admin/projects/project`, tiêu đề trang `Add new project`; biểu mẫu `#project_form` gửi `POST` về chính URL đó | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-25 | Biểu mẫu chia đúng 2 tab | Thông tin chính và cấu hình tách thành hai tab | Có đúng 2 tab: `Project` (mặc định mở) và `Project Settings` (`#tab_settings`) | 🟢 | — | Đọc DOM |
| REQ-PRJ-26 | Nhập tên dự án | Tên dự án là trường bắt buộc | Trường `name`, kiểu chữ, có dấu `*`; để trống thì không lưu được (xem REQ-PRJ-53) | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-27 | Chọn khách hàng của dự án | Mỗi dự án phải thuộc về một khách hàng | Ô chọn `clientid` kiểu tìm kiếm bất đồng bộ (`ajax-search`), gợi ý `Type to search...`; danh sách **rỗng** cho tới khi người dùng gõ | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-28 | Tìm khách hàng theo từ khoá | Gõ từ khoá thì hệ thống trả về danh sách khách hàng khớp | Gõ `GM` → phát sinh `POST /admin/misc/get_relation_data`, ô chọn nạp danh sách khách hàng khớp (kiểm chứng: có `9150 | Công ty GM`) | 🟢 | — | API · POST /admin/misc/get_relation_data |
| REQ-PRJ-29 | Chọn cách tính tiến độ dự án | Tiến độ tính tự động theo công việc, hoặc đặt tay | Công tắc `progress_from_tasks` **mặc định BẬT**; kèm thanh trượt tiến độ và ô ẩn `progress` giá trị `0` | 🟢 | — | Đọc DOM |
| REQ-PRJ-30 | Khoá thanh tiến độ khi tính theo công việc | Bật tính tự động thì không đặt tay tiến độ được | `progress_from_tasks` bật → thanh trượt mang lớp `ui-slider-disabled ui-state-disabled`; tắt → hai lớp này biến mất, thanh trượt kéo được | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-31 | Chọn kiểu tính phí | Dự án phải có một kiểu tính phí | Ô chọn `billing_type` bắt buộc, **4 lựa chọn kể cả mục rỗng**: `` · `1` Fixed Rate · `2` Project Hours · `3` Task Hours; mặc định chọn **`1` Fixed Rate** | 🟢 | — | Đọc DOM |
| REQ-PRJ-32 | Trường giá hiện theo kiểu tính phí | Chọn kiểu tính phí nào thì chỉ hiện trường giá tương ứng | Kiểm chứng bằng cách đổi lần lượt: `1` Fixed Rate → `Total Rate` **hiện**, `Rate Per Hour` **ẩn** · `2` Project Hours → `Total Rate` **ẩn**, `Rate Per Hour` **hiện** · `3` Task Hours → **cả hai đều ẩn** | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-33 | Chọn trạng thái ban đầu | Dự án được đặt trạng thái ngay khi tạo | Ô chọn `status` có **đúng 5 lựa chọn** `1` `2` `3` `5` `4`; mặc định chọn **`2` In Progress**. Trường **không** bắt buộc (không có dấu `*`) | 🟢 | — | Đọc DOM |
| REQ-PRJ-34 | Nhập tổng giá dự án | Áp dụng khi tính phí theo `Fixed Rate` | Trường `project_cost`, nhãn `Total Rate`, kiểu số, **không** khai báo `min`/`max`/`step`, không bắt buộc | 🟢 | — | Đọc DOM |
| REQ-PRJ-35 | Nhập đơn giá theo giờ | Áp dụng khi tính phí theo `Project Hours` | Trường `project_rate_per_hour`, nhãn `Rate Per Hour`, kiểu số, **không** khai báo `min`/`max`/`step`, không bắt buộc | 🟢 | — | Đọc DOM |
| REQ-PRJ-36 | Nhập số giờ ước tính | Ghi nhận khối lượng dự kiến của dự án | Trường `estimated_hours`, kiểu số, **luôn hiển thị** với cả 3 kiểu tính phí, không bắt buộc | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-37 | Chọn thành viên dự án | Gán nhân sự tham gia dự án | Ô chọn nhiều `project_members[]` với **3 lựa chọn** theo đúng thứ tự DOM: `3` Project Manager · `1` Admin Anh Tester · `2` Admin Example. **Mặc định chọn sẵn `2` (chính người đang đăng nhập)**; có nút `Select All` / `Deselect All` | 🟢 | — | Đọc DOM |
| REQ-PRJ-38 | Nhập ngày bắt đầu | Ngày bắt đầu là trường bắt buộc | Trường `start_date`, lớp `datepicker`, có dấu `*`, **điền sẵn ngày hôm nay** theo định dạng `dd-mm-yyyy` (kiểm chứng: `14-08-2026`) | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-39 | Nhập hạn chót | Hạn chót là trường tuỳ chọn | Trường `deadline`, lớp `datepicker`, **không** có dấu `*`, **để trống** khi mở biểu mẫu | 🟢 | — | Đọc DOM |
| REQ-PRJ-40 | Gắn thẻ và mô tả dự án | Phân loại dự án bằng thẻ và ghi mô tả có định dạng | Trường `tags` dùng thành phần nhập thẻ (`tagsinput` + ô gợi ý `Tag`); trường `description` là trình soạn thảo TinyMCE với đủ thanh công cụ File/Edit/View/Insert/Format/Tools/Table. Cả hai **không** bắt buộc | 🟢 | — | Đọc DOM |
| REQ-PRJ-41 | Lưu dự án và chuyển sang trang chi tiết | Lưu thành công thì mở luôn dự án vừa tạo | Bấm `Save` với dữ liệu hợp lệ → hệ thống tạo dự án và chuyển tới `/admin/projects/view/{id}` (kiểm chứng: tạo `RECON_PRJ_1786652163351` → chuyển tới `/admin/projects/view/2695`, tiêu đề trang bằng đúng tên dự án) | 🟢 | — | Kiểm chứng thực tế |

---

## 2. Đặc tả Trường Dữ liệu — biểu mẫu dự án, tab `Project`

| Field (Label) | Loại UI | Required | Ràng buộc (min/max/format/default) | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|
| `Project Name` | Ô nhập chữ — `name` | **Có** `*` | Không khai báo `maxlength` · không có mặc định | REQ-PRJ-26 | Giới hạn độ dài thật chưa rõ — `AMB-PRJ-09` |
| `Customer` | Select một tìm kiếm bất đồng bộ — `clientid` | **Có** `*` | 1 mục rỗng khi mở; nạp theo từ khoá gõ vào | REQ-PRJ-27, 28 | **Không** đặt giá trị bằng cách gán trực tiếp được — phải gõ từng phím để kích hoạt tìm kiếm |
| `Calculate progress through tasks` | Công tắc — `progress_from_tasks` | Không | **Mặc định BẬT** | REQ-PRJ-29, 30 | Bật thì khoá thanh trượt tiến độ |
| `Progress` | Thanh trượt + ô ẩn `progress` | Không | Mặc định `0` | REQ-PRJ-30 | Bị khoá khi `progress_from_tasks` bật |
| `Billing Type` | Select một — `billing_type` | **Có** `*` | 4 lựa chọn kể cả mục rỗng; **mặc định `1` Fixed Rate** | REQ-PRJ-31, 32 | Lựa chọn `3` mang `data-subtext="Based on task hourly rate"` — chính là nhãn hiển thị ở bộ lọc |
| `Status` | Select một — `status` | Không | 5 lựa chọn `1` `2` `3` `5` `4`; **mặc định `2` In Progress** | REQ-PRJ-33 | ⚠️ `Cancelled`=`5`, `Finished`=`4` |
| `Total Rate` | Ô nhập số — `project_cost` | Không | Không `min`/`max`/`step`; không mặc định | REQ-PRJ-32, 34 | **Chỉ hiện** khi `Billing Type` = `1`. Vẫn nằm trong DOM khi ẩn — `RISK-PRJ-06` |
| `Rate Per Hour` | Ô nhập số — `project_rate_per_hour` | Không | Không `min`/`max`/`step`; không mặc định | REQ-PRJ-32, 35 | **Chỉ hiện** khi `Billing Type` = `2`. Vẫn nằm trong DOM khi ẩn — `RISK-PRJ-06` |
| `Estimated Hours` | Ô nhập số — `estimated_hours` | Không | Không `min`/`max`/`step`; không mặc định | REQ-PRJ-36 | Luôn hiển thị |
| `Members` | Select nhiều — `project_members[]` | Không | 3 lựa chọn; **mặc định chọn `2` Admin Example** | REQ-PRJ-37 | Thứ tự trong DOM là `3` · `1` · `2`, **không** theo mã tăng dần |
| `Start Date` | Ô nhập ngày — `start_date` | **Có** `*` | Định dạng `dd-mm-yyyy`; **mặc định ngày hôm nay** | REQ-PRJ-38 | Có lịch chọn ngày |
| `Deadline` | Ô nhập ngày — `deadline` | Không | Định dạng `dd-mm-yyyy`; mặc định trống | REQ-PRJ-39 | **Không** ràng buộc phải sau `Start Date` — `AMB-PRJ-04` |
| `Tags` | Ô nhập thẻ — `tags` | Không | Không giới hạn số thẻ quan sát được | REQ-PRJ-40 | Ô thật bị ẩn (`tagit-hidden-field`), người dùng gõ vào ô gợi ý `Tag` |
| `Description` | Trình soạn thảo TinyMCE — `description` | Không | Không giới hạn quan sát được | REQ-PRJ-40 | Ô `<textarea>` gốc bị ẩn — automation phải thao tác qua API của TinyMCE |
| `Send project created email` | Công tắc — `send_created_email` | Không | **Mặc định TẮT** | REQ-PRJ-42 (Story 03) | Bật thì mở phần cấu hình thông báo ở tab `Project Settings` |
| `Save` | Nút gửi biểu mẫu | — | — | REQ-PRJ-41 | Nút duy nhất của biểu mẫu — **không có** nút Huỷ |

---

## 3. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Kết quả mong đợi |
|---|---|---|
| REQ-PRJ-30 | Bật `Calculate progress through tasks` | Thanh trượt tiến độ bị khoá, không kéo được |
| REQ-PRJ-30 | Tắt `Calculate progress through tasks` | Thanh trượt mở khoá, đặt tiến độ tay được |
| REQ-PRJ-32 | Đổi `Billing Type` sang `Fixed Rate` | Hiện `Total Rate`, ẩn `Rate Per Hour` |
| REQ-PRJ-32 | Đổi `Billing Type` sang `Project Hours` | Ẩn `Total Rate`, hiện `Rate Per Hour` |
| REQ-PRJ-32 | Đổi `Billing Type` sang `Task Hours` | Ẩn cả hai trường giá — đơn giá lấy theo giờ của từng công việc |
| REQ-PRJ-41 | Lưu thành công | Chuyển tới trang chi tiết dự án vừa tạo; tiêu đề trang bằng tên dự án |

**Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế):**

- Người tạo dự án **tự động** được thêm làm thành viên (`Members` điền sẵn chính mình). Nhật ký hoạt động ghi nhận đúng hai dòng: *"Added new team member Admin Example"* và *"Created the project"*.
- Biểu mẫu **không có nút Huỷ**. Người dùng muốn bỏ thì phải rời trang bằng điều hướng.
- **Không** kiểm tra trùng tên dự án ở bất kỳ tầng nào — khác hẳn module `CUST` (có `check_duplicate_customer_name`). Xem `AMB-PRJ-08`.

---

## 4. Luồng xử lý — Tạo dự án mới

```
1. Mở /admin/projects → bấm "New Project"
2. Nhập Project Name
3. Gõ từ khoá vào ô Customer → chờ POST /admin/misc/get_relation_data
   → chọn khách hàng từ danh sách
4. (Tuỳ chọn) Tắt "Calculate progress through tasks" → kéo thanh tiến độ
5. Chọn Billing Type
   → Fixed Rate     : nhập Total Rate
   → Project Hours  : nhập Rate Per Hour
   → Task Hours     : không nhập giá
6. (Tuỳ chọn) Chọn Status khác In Progress
7. (Tuỳ chọn) Nhập Estimated Hours, chọn thêm Members
8. Kiểm tra Start Date (điền sẵn hôm nay), nhập Deadline nếu có
9. (Tuỳ chọn) Gắn Tags, nhập Description
10. (Tuỳ chọn) Bật "Send project created email" → sang tab Project Settings cấu hình
    (xem STORY-PRJ-03)
11. Bấm "Save"
    → Tạo dự án, chuyển tới /admin/projects/view/{id}
    → Nhật ký hoạt động ghi 2 dòng: thêm thành viên + tạo dự án
```
