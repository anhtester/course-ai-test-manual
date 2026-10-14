# STORY-PRJ-01 — Danh sách, tìm kiếm, lọc, xuất dữ liệu

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-01` → `REQ-PRJ-23` (23 REQ)
>
> AMB liên quan: `AMB-PRJ-02` · RISK liên quan: `RISK-PRJ-02`, `RISK-PRJ-04`, `RISK-PRJ-05`

**Mô tả Story:** Là nhân sự vận hành, tôi muốn xem toàn bộ dự án trong một bảng lọc/tìm/sắp xếp được, để tìm nhanh dự án cần xử lý và nắm tình hình theo trạng thái.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-01 | Truy cập danh sách dự án | Người dùng mở mục `Projects` trên thanh điều hướng để vào danh sách | Mở `/admin/projects` → hiển thị trang tiêu đề `Projects` kèm bảng dữ liệu | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-02 | Bảng danh sách có 8 cột cố định | Bảng hiển thị đúng 8 cột theo thứ tự quy định | Hàng tiêu đề đọc được đúng: `#` · `Project Name` · `Customer` · `Tags` · `Start Date` · `Deadline` · `Members` · `Status` | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-03 | Bảng nạp dữ liệu phía máy chủ | Dữ liệu nạp bất đồng bộ, không render sẵn trong HTML | Mọi thao tác lọc/tìm/phân trang phát sinh `POST /admin/projects/table` kèm `csrf_token_name`; phản hồi `200` | 🟢 | — | API · POST /admin/projects/table |
| REQ-PRJ-04 | Sắp xếp mặc định theo `Deadline` tăng dần | Lần mở đầu tiên, bảng sắp theo cột Deadline từ sớm tới muộn | Request đầu tiên mang `order[0][column]=5` và `order[0][dir]=asc` (cột chỉ số 5 = `Deadline`) | 🟢 | — | API · POST /admin/projects/table |
| REQ-PRJ-05 | Mọi cột đều sắp xếp được | Người dùng bấm tiêu đề cột để đổi chiều sắp xếp | Cả 8 cột đều gửi `columns[n][orderable]=true` trong request | 🟢 | — | API · POST /admin/projects/table |
| REQ-PRJ-06 | Chọn số dòng mỗi trang | Người dùng đổi số bản ghi hiển thị trên một trang | Ô chọn `projects_length` có **đúng 5 lựa chọn**: `10` · `25` · `50` · `100` · `All` (`value=-1`); mặc định chọn **`25`** | 🟢 | — | Đọc DOM |
| REQ-PRJ-07 | Nhảy nhanh tới một trang | Người dùng chọn số trang thay vì bấm từng trang | Ô chọn `dt-page-jump-projects` liệt kê đủ số trang hiện có (118 bản ghi ÷ 25 = **5 trang**) | 🟢 | — | Đọc DOM |
| REQ-PRJ-08 | Bảng tổng quan theo trạng thái | Phía trên bảng hiển thị số lượng dự án theo từng trạng thái | Hiển thị đúng **5 ô đếm** theo thứ tự: `Not Started` · `In Progress` · `On Hold` · `Cancelled` · `Finished`, mỗi ô kèm số và màu riêng | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-09 | Bấm ô đếm để lọc theo trạng thái | Bấm một ô đếm thì bảng chỉ còn dự án thuộc trạng thái đó | Bấm `On Hold` → dòng trạng thái đổi từ `Showing 1 to 25 of 118 entries` sang `Showing 1 to 2 of 2 entries`, mọi dòng đều có nhãn `On Hold` | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-10 | Số đếm tổng quan phải khớp số bản ghi khi lọc | Số hiển thị ở ô đếm phải bằng số dòng bảng trả về khi lọc đúng trạng thái đó | ⚠️ **Đang KHÔNG đạt.** Kiểm chứng 14-08-2026: `Not Started` 53 ↔ 53 ✅ · **`In Progress` 67 ↔ 60 ❌** · `On Hold` 2 ↔ 2 ✅ · `Cancelled` 2 ↔ 2 ✅ · `Finished` 1 ↔ 1 ✅. Tổng số dòng thật 53+60+2+2+1 = **118** = tổng bảng | 🟢 | — | Kiểm chứng thực tế · xem `AMB-PRJ-02` |
| REQ-PRJ-11 | Tìm kiếm nhanh trên bảng | Người dùng gõ từ khoá để lọc nhanh toàn bảng | Ô tìm kiếm gửi `search[value]` trong request tới `/admin/projects/table`; `search[regex]=false` | 🟢 | — | API · đọc DOM |
| REQ-PRJ-12 | Nhóm hành động trên mỗi dòng | Mỗi dòng có 4 hành động hiện ra khi trỏ chuột | Nhóm `row-options` chứa đúng: `View` · `Copy Project` · `Edit` · `Delete`, ngăn nhau bằng dấu `|` | 🟢 | — | Đọc DOM |
| REQ-PRJ-13 | Liên kết tới trang chi tiết | Cả mã số và tên dự án đều mở được trang chi tiết | Ô cột `#` và ô cột `Project Name` cùng trỏ tới `/admin/projects/view/{id}` | 🟢 | — | Đọc DOM |
| REQ-PRJ-14 | Liên kết tới hồ sơ khách hàng | Tên khách hàng ở mỗi dòng mở được hồ sơ khách hàng | Ô cột `Customer` trỏ tới `/admin/clients/client/{clientid}` | 🟢 | — | Đọc DOM |
| REQ-PRJ-15 | Cột `Members` hiển thị ảnh đại diện | Thành viên dự án hiển thị dạng ảnh tròn chồng nhau, trỏ chuột hiện tên | Mỗi ảnh mang `data-title` là tên nhân sự và trỏ tới `/admin/profile/{staffid}`; kèm một khối ẩn chứa danh sách tên dạng chữ | 🟢 | — | Đọc DOM |
| REQ-PRJ-16 | Cột `Status` hiển thị nhãn màu | Trạng thái hiển thị bằng nhãn có màu riêng | Nhãn mang lớp `project-status-{mã}` và màu nền/viền tương ứng — `Not Started` `#475569` · `In Progress` `#2563eb` · `On Hold` `#f97316` · `Cancelled` `#94a3b8` · `Finished` `#16a34a` | 🟢 | — | Đọc DOM |
| REQ-PRJ-17 | Tải lại bảng | Người dùng làm mới dữ liệu bảng mà không tải lại cả trang | Nút `btn-dt-reload` trên thanh công cụ phát sinh lại `POST /admin/projects/table` | 🟢 | — | Đọc DOM |
| REQ-PRJ-18 | Mở Gantt tổng từ danh sách | Người dùng mở biểu đồ Gantt của toàn bộ dự án | Nút biểu tượng trên thanh công cụ trỏ tới `/admin/projects/gantt`; trang có 3 bộ lọc: `status[]` (5 trạng thái) · `member` (3 nhân sự) · `gantt_view` (`Days` · `Weeks` · `Months` · `Years` View) | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-19 | Mở hộp thoại tạo bộ lọc | Người dùng mở trình dựng điều kiện lọc | Bấm `New Filter` → mở hộp thoại tiêu đề `Create Filter` | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-20 | Bộ lọc hỗ trợ đúng 6 tiêu chí | Trình dựng điều kiện chỉ cho lọc theo 6 trường | Ô chọn `projectsRules` có **đúng 6 lựa chọn**: `name` Project Name · `start_date` Start Date · `deadline` Deadline · `billing_type` Billing Type · `status` Status · `members` Members | 🟢 | — | Đọc DOM |
| REQ-PRJ-21 | Thêm nhiều điều kiện lọc | Người dùng thêm bao nhiêu điều kiện tuỳ ý bằng `Add Rule` | Mỗi lần chọn một trường ở `Add Rule` sinh thêm một dòng điều kiện. Kiểu ô nhập theo trường: `Status` → chọn nhiều (`in`, 5 lựa chọn) · `Members` → chọn nhiều (`in`, 3 lựa chọn) · `Billing Type` → chọn một (`equal`, 3 lựa chọn) · `Project Name` / `Start Date` / `Deadline` → nhập tay (`equal`) | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-22 | Chọn cách ghép các điều kiện | Người dùng chọn ghép điều kiện theo `and` hoặc `or` | Nhóm nút `match_projects` có 2 lựa chọn `match_type_and` / `match_type_or`; mặc định chọn **`or`** | 🟢 | — | Đọc DOM |
| REQ-PRJ-23 | Xuất dữ liệu danh sách | Người dùng xuất bảng đang hiển thị ra tệp | Nút `Export` mở danh sách **đúng 4 định dạng**: `Excel` · `CSV` · `PDF` · `Print` | 🟢 | — | Kiểm chứng thực tế |

---

## 2. Đặc tả Trường Dữ liệu — hộp thoại `Create Filter`

| Field (Label) | Loại UI | Required | Ràng buộc | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|
| *(chọn trường lọc)* | Select một — `projectsRules` | — | 6 lựa chọn cố định | REQ-PRJ-20 | Chọn xong thì sinh một dòng điều kiện mới |
| `Add Rule` | Nút mở danh sách | — | — | REQ-PRJ-21 | Bootstrap-select, không phải `<select>` thường |
| Điều kiện `Status` | Select nhiều — `multiSelectRulestatus` | — | 5 lựa chọn: `1` Not Started · `2` In Progress · `3` On Hold · **`5` Cancelled** · **`4` Finished` | REQ-PRJ-21 | Toán tử cố định `in`, không đổi được |
| Điều kiện `Members` | Select nhiều — `multiSelectRulemembers` | — | 3 lựa chọn: `1` Admin Anh Tester · `2` Admin Example · `3` Project Manager | REQ-PRJ-21 | Toán tử cố định `in` |
| Điều kiện `Billing Type` | Select một — `selectRulebilling_type` | — | 4 lựa chọn kể cả mục rỗng đầu danh sách: `` · `1` Fixed Rate · `2` Project Hours · `3` Based on task hourly rate | REQ-PRJ-21 | ⚠️ Nhãn ở đây là **`Based on task hourly rate`**, còn trên biểu mẫu dự án cùng mã `3` hiển thị **`Task Hours`** — hai chỗ dùng hai nhãn cho cùng một giá trị |
| Điều kiện `Project Name` / `Start Date` / `Deadline` | Ô nhập chữ | — | Không ràng buộc định dạng | REQ-PRJ-21 | Toán tử cố định `equal` |
| `and` / `or` | Nhóm nút chọn — `match_projects` | — | Mặc định `or` | REQ-PRJ-22 | — |
| `Save Filter` | Công tắc — `projectsSaveFilter` | Không | Mặc định tắt | REQ-PRJ-19 | Bật thì bộ lọc được lưu lại, xuất hiện ở danh sách bộ lọc trên thanh công cụ |
| `Apply` | Nút | — | — | REQ-PRJ-19 | Áp dụng điều kiện lên bảng |

**Thanh công cụ bộ lọc lưu sẵn:** ngoài `New Filter` còn có `Clear Filter` (xoá điều kiện đang áp) và `Edit` (sửa bộ lọc đã lưu), cùng một danh sách thả xuống chọn bộ lọc đã lưu.

---

## 3. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Thông báo / Kết quả mong đợi |
|---|---|---|
| REQ-PRJ-09 | Bấm ô đếm trạng thái | Bảng lọc ngay theo trạng thái đó, không tải lại trang |
| REQ-PRJ-10 | Đối chiếu số đếm với số dòng thật | ⚠️ Hiện **lệch 7** ở trạng thái `In Progress` — xem `AMB-PRJ-02`. Không có thông báo nào cho người dùng biết số liệu lệch |
| REQ-PRJ-22 | Không chọn `and`/`or` | Mặc định `or` — hệ thống không hỏi lại |

**Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế):**

- Bảng **không có** cột chọn hàng loạt và **không có** nút thao tác hàng loạt — khác với module `CUST` (có xoá hàng loạt và gán nhóm). Xoá dự án chỉ làm được từng cái một.
- Mã giá trị trạng thái **không** liên tục theo thứ tự hiển thị: `Cancelled` = `5`, `Finished` = `4`. Danh sách thả xuống ở bộ lọc trả về theo đúng thứ tự hiển thị (`1,2,3,5,4`), nên **chỉ số phần tử không bằng mã giá trị**.

---

## 4. Luồng xử lý — Lọc dự án theo điều kiện tuỳ biến

```
1. Mở /admin/projects
2. Bấm "New Filter" → hộp thoại "Create Filter"
3. Chọn trường ở "Add Rule" (VD: Status) → sinh dòng điều kiện
4. Chọn giá trị cho điều kiện (VD: On Hold, Cancelled)
5. Lặp bước 3–4 cho các điều kiện khác nếu cần
6. Chọn cách ghép: and / or   (mặc định or)
7. (Tuỳ chọn) Bật "Save Filter" để lưu bộ lọc dùng lại
8. Bấm "Apply"
   → POST /admin/projects/table kèm điều kiện
   → Bảng cập nhật, dòng "Showing … entries" đổi theo
```
