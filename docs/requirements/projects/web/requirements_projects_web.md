# Đặc tả Yêu cầu — Module Dự án (`PRJ`) · Nền tảng **Web**

> File nền tảng của module `PRJ`. **Điểm vào là index** [../REQUIREMENTS_PROJECTS_SUMMARY.md](../REQUIREMENTS_PROJECTS_SUMMARY.md) — metadata, phạm vi, Story, ma trận phân quyền/trạng thái, AMB/RISK và Nhật ký thay đổi nằm ở đó. Bảng REQ chi tiết nằm ở [stories/](stories/).
>
> Đánh số mục **giữ nguyên** như index trước 19-09-2026 (mục 2 · 6 · 8) để các tham chiếu cũ không gãy.

| Mục | Giá trị |
|---|---|
| **Nền tảng** | Web — khu quản trị `/admin` |
| **Trình duyệt khảo sát** | Google Chrome qua Playwright MCP, headed, viewport `1600×750` |
| **Tầng network** | Quan sát thụ động request do UI tự phát sinh — không gọi API trực tiếp |
| **REQ** | `REQ-PRJ-01` → `REQ-PRJ-104` (104) — nằm ở 10 file [stories/](stories/) |

---

## 2. Bản đồ phủ tài liệu

**Không có tài liệu nào cho module này** — toàn bộ REQ sinh từ khảo sát UI thực tế, đọc DOM và quan sát tầng network. Không có spec, ticket, file field hay mockup nào được cung cấp.

| Vùng chức năng | Tài liệu phủ | Mức phủ | REQ liên quan |
|---|---|---|---|
| Toàn module | — | ⬜ Trắng | `REQ-PRJ-01` → `REQ-PRJ-104` |

---

## 6. Yêu cầu Phi chức năng (quan sát được)

| Mã | Yêu cầu | Căn cứ |
|---|---|---|
| NFR-PRJ-01 | Bảng danh sách nạp **bất đồng bộ phía máy chủ** qua `POST /admin/projects/table`, kèm `csrf_token_name` ở mọi request | Tầng network |
| NFR-PRJ-02 | Hệ thống **không có REST API `/api/`** — là ứng dụng server-render (CodeIgniter) + DataTables server-side. Không khai thác được schema entity từ network như hệ thống SPA | Tầng network · trùng kết luận cấp hệ thống ở `system_map.md` mục 4 |
| NFR-PRJ-03 | Mọi request thay đổi dữ liệu đều mang **CSRF token**; automation gọi thẳng HTTP sẽ hỏng nếu không lấy token trước | Tầng network |
| NFR-PRJ-04 | Trang chi tiết nạp **toàn bộ danh sách dự án** vào ô chuyển nhanh `#project_top` (118 mục) ngay khi mở trang | Đọc DOM |
| NFR-PRJ-05 | Biểu mẫu dùng TinyMCE cho `Description` và ô chọn ajax cho `Customer` — cả hai **không** phản hồi với thao tác gán `value` trực tiếp, phải gõ từng phím | Đọc DOM · kiểm chứng thực tế |
| NFR-PRJ-06 | Trang Gantt tổng phát sinh **4 lỗi console** khi mở | Console log |
| NFR-PRJ-07 | Ngày hiển thị và nhập theo định dạng **`dd-mm-yyyy`** trên toàn module | Kiểm chứng thực tế |

---

## 8. Danh mục Evidence

Toàn bộ ảnh chụp full-page, lưu tại [`evidence/`](evidence/).

| Tệp | Màn hình | Trạng thái | REQ làm bằng chứng |
|---|---|---|---|
| `projects_list_default_fullpage.png` | Danh sách dự án | Mặc định, 118 bản ghi, bảng tổng quan 5 trạng thái | REQ-PRJ-01 → 16 |
| `projects_list_filter_modal_fullpage.png` | Hộp thoại `Create Filter` | Đã thêm 5 điều kiện lọc | REQ-PRJ-17 → 22 |
| `projects_copy_project_modal_fullpage.png` | Hộp thoại `Copy Project` | Mở từ dòng danh sách, điền sẵn tên gốc | REQ-PRJ-69 → 74 |
| `projects_gantt_global_fullpage.png` | Gantt tổng | Mặc định | REQ-PRJ-16 |
| `project_new_form_tab_project_default_fullpage.png` | Thêm dự án — tab `Project` | Mặc định | REQ-PRJ-24 → 41 |
| `project_new_form_send_email_notification_fullpage.png` | Thêm dự án — tab `Project` | Đã bật `Send project created email` | REQ-PRJ-40, 42, 43 |
| `project_new_form_tab_settings_default_fullpage.png` | Thêm dự án — tab `Project Settings` | Mặc định, 8 công tắc bị khoá | REQ-PRJ-42 → 52 |
| `project_new_form_tab_settings_viewtasks_on_fullpage.png` | Thêm dự án — tab `Project Settings` | Đã bật `Allow customer to view tasks`, 8 công tắc mở khoá | REQ-PRJ-49, 50 |
| `project_new_form_validation_required_fullpage.png` | Thêm dự án — tab `Project` | Sau khi bấm Save với biểu mẫu rỗng | REQ-PRJ-53 → 56 |
| `project_edit_form_tab_project_fullpage.png` | Sửa dự án — tab `Project` | Nạp sẵn giá trị dự án `2695` | REQ-PRJ-60, 61 |
| `project_edit_form_status_finished_fullpage.png` | Sửa dự án — tab `Project` | Đã đổi `Status` sang `Finished` | REQ-PRJ-62, 63 |
| `project_detail_tab_overview_fullpage.png` | Chi tiết — tab `Overview` | Dự án mới, 0 công việc, quá hạn 13 ngày | REQ-PRJ-75 → 82 |
| `project_detail_tab_tasks_fullpage.png` | Chi tiết — tab `Tasks` | Rỗng, có bảng tóm tắt 5 trạng thái công việc | REQ-PRJ-98 |
| `project_detail_tab_timesheets_fullpage.png` | Chi tiết — tab `Timesheets` | Rỗng | REQ-PRJ-92 |
| `project_detail_tab_milestones_fullpage.png` | Chi tiết — tab `Milestones` | Rỗng | REQ-PRJ-87, 88 |
| `project_detail_tab_files_fullpage.png` | Chi tiết — tab `Files` | Rỗng, có vùng kéo thả | REQ-PRJ-90, 91 |
| `project_detail_tab_discussions_fullpage.png` | Chi tiết — tab `Discussions` | Rỗng | REQ-PRJ-93, 94 |
| `project_detail_tab_gantt_fullpage.png` | Chi tiết — tab `Gantt` | Rỗng | REQ-PRJ-95 |
| `project_detail_tab_notes_fullpage.png` | Chi tiết — tab `Notes` | Rỗng, có trình soạn thảo | REQ-PRJ-96 |
| `project_detail_tab_activity_fullpage.png` | Chi tiết — tab `Activity` | 2 dòng nhật ký sau khi tạo dự án | REQ-PRJ-97 |
| `project_detail_tab_tickets_fullpage.png` | Chi tiết — tab `Tickets` | Rỗng | REQ-PRJ-99 |
| `project_detail_tab_contracts_fullpage.png` | Chi tiết — tab `Contracts` | Rỗng | REQ-PRJ-100 |
| `project_detail_tab_proposals_fullpage.png` | Chi tiết — tab `Proposals` | Rỗng | REQ-PRJ-101 |
| `project_detail_tab_estimates_fullpage.png` | Chi tiết — tab `Estimates` | Rỗng | REQ-PRJ-101 |
| `project_detail_tab_invoices_fullpage.png` | Chi tiết — tab `Invoices` | Rỗng | REQ-PRJ-101 |
| `project_detail_tab_subscriptions_fullpage.png` | Chi tiết — tab `Subscriptions` | Rỗng | REQ-PRJ-101 |
| `project_detail_tab_expenses_fullpage.png` | Chi tiết — tab `Expenses` | Rỗng | REQ-PRJ-101 |
| `project_detail_tab_credit_notes_fullpage.png` | Chi tiết — tab `Credit Notes` | Rỗng | REQ-PRJ-101 |
| `project_detail_mark_as_finished_modal_fullpage.png` | Chi tiết — hộp thoại `Additional action required!` | Sau khi bấm `Mark as Finished` | REQ-PRJ-64 → 66 |
| `project_detail_invoice_project_modal_fullpage.png` | Chi tiết — hộp thoại `Project Invoice Info` | Dự án 0 công việc | REQ-PRJ-85, 86 |
| `project_delete_after_confirm_notfound_fullpage.png` | Sau khi xác nhận xoá | Trang `/admin/not_found` kèm thông báo lỗi | REQ-PRJ-102, 103 · AMB-PRJ-03 |

**Tổng: 31 ảnh.** Dữ kiện mà ảnh không thể hiện được (số `<option>` thật, `disabled` vs `checked`, `value` của option, phần tử ẩn nhưng còn trong DOM) đã đọc bằng `browser_evaluate` và **chép nguyên số liệu vào Acceptance Criteria** của REQ tương ứng ở các file story.
