# STORY-PRJ-03 — Cấu hình dự án & quyền khách hàng (tab `Project Settings`)

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-42` → `REQ-PRJ-52` (11 REQ)
>
> AMB liên quan: `AMB-PRJ-14`, `AMB-PRJ-15`

**Mô tả Story:** Là nhân sự vận hành, tôi muốn chọn tab nào và thao tác nào khách hàng được thấy trong dự án, để chỉ chia sẻ đúng phần thông tin mình muốn.

> ⚠️ **Giới hạn kiểm chứng của toàn Story này.** Cổng khách hàng (front-end ngoài `/admin`) **nằm ngoài phạm vi** của dự án khảo sát. Vì vậy mọi REQ dưới đây được kiểm chứng ở mức **biểu mẫu ghi nhận đúng cấu hình**, **không** kiểm chứng được rằng cấu hình đó thực sự tác động tới thứ khách hàng nhìn thấy. Xem `AMB-PRJ-14`.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-42 | Cấu hình gửi thông báo cho liên hệ | Chọn nhóm liên hệ nào nhận thông báo về dự án | Ô chọn `contact_notification` chỉ **hiện khi** đã bật `send_created_email`; có **đúng 3 lựa chọn**: `1` To all contacts with notifications for projects enabled · `2` Specific contacts · `0` Do not send notifications; mặc định chọn **`1`** | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-43 | Chọn từng liên hệ cụ thể | Chọn `Specific contacts` thì mở ô chọn danh sách liên hệ | Đổi `contact_notification` sang `2` → khối `notify_contacts_wrapper` chuyển từ ẩn sang hiện; ô chọn nhiều `notify_contacts[]` kiểu tìm kiếm bất đồng bộ | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-44 | Khoá ô chọn liên hệ khi chưa có khách hàng | Chưa chọn khách hàng thì không chọn liên hệ được | Ô `notify_contacts` ở trạng thái `disabled` khi biểu mẫu vừa mở; nút mở danh sách mang lớp `disabled` | 🟢 | — | Đọc DOM |
| REQ-PRJ-45 | Chọn tab hiển thị của dự án | Cấu hình dự án hiển thị những tab nào | Ô chọn nhiều `settings[available_features][]` (`#available_features`) có **đúng 17 lựa chọn**: `project_overview` Overview · `project_tasks` · `project_timesheets` · `project_milestones` · `project_files` · `project_discussions` · `project_gantt` · `project_tickets` · `project_contracts` · `project_proposals` · `project_estimates` · `project_invoices` · `project_subscriptions` · `project_expenses` · `project_credit_notes` · `project_notes` · `project_activity` | 🟢 | — | Đọc DOM |
| REQ-PRJ-46 | Mặc định bật toàn bộ 17 tab | Dự án mới hiển thị đủ mọi tab | Khi mở biểu mẫu tạo mới, **cả 17 lựa chọn đều ở trạng thái được chọn** | 🟢 | — | Đọc DOM |
| REQ-PRJ-47 | Không bỏ chọn được tab `Overview` | Tab tổng quan luôn hiển thị, không tắt được | Lựa chọn `project_overview` mang thuộc tính `disabled=true` và luôn `selected=true`. Nhãn tóm tắt trên nút chỉ liệt kê **16 tab còn lại**, không có `Overview` | 🟢 | — | Đọc DOM |
| REQ-PRJ-48 | Chọn / bỏ chọn nhanh toàn bộ tab | Người dùng bật hoặc tắt tất cả tab bằng một thao tác | Danh sách `Visible Tabs` có nút `Select All` và `Deselect All` | 🟢 | — | Đọc DOM |
| REQ-PRJ-49 | `Allow customer to view tasks` là công tắc cổng | Cho khách hàng xem công việc mới mở được các quyền con về công việc | `settings[view_tasks]` **mặc định TẮT**; khi tắt thì **8 công tắc con bị khoá** (`create_tasks` · `edit_tasks` · `comment_on_tasks` · `view_task_comments` · `view_task_attachments` · `view_task_checklist_items` · `upload_on_tasks` · `view_task_total_logged_time`). Bật `view_tasks` → cả 8 chuyển sang `disabled=false`, vẫn giữ trạng thái chưa tích | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-50 | Tám quyền khách hàng mặc định bật | Một số quyền được mở sẵn cho khách hàng | **8 công tắc mặc định BẬT**: `view_finance_overview` · `upload_files` · `open_discussions` · `view_milestones` · `view_gantt` · `view_timesheets` · `view_activity_log` · `view_team_members` | 🟢 | — | Đọc DOM |
| REQ-PRJ-51 | Tổng cộng 18 công tắc quyền | Tab cấu hình có đúng 18 công tắc | Đếm được **18** ô tích trong `#tab_settings`: 8 bật sẵn (REQ-PRJ-50) + 8 bị khoá (REQ-PRJ-49) + `view_tasks` + `hide_tasks_on_main_tasks_table` | 🟢 | — | Đọc DOM |
| REQ-PRJ-52 | Ẩn công việc của dự án khỏi bảng công việc chính | Không cho công việc của dự án lẫn vào danh sách công việc chung của khu quản trị | Công tắc `settings[hide_tasks_on_main_tasks_table]`, nhãn `Hide project tasks on main tasks table (admin area)`, **mặc định TẮT**, không bị khoá | 🟢 | — | Đọc DOM |

---

## 2. Đặc tả Trường Dữ liệu — biểu mẫu dự án, tab `Project Settings`

### 2.1. Cấu hình thông báo

| Field (Label) | Loại UI | Required | Ràng buộc / Mặc định | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|
| `Send contacts notifications` | Select một — `contact_notification` | **Có** `*` | 3 lựa chọn `1` `2` `0`; mặc định `1` | REQ-PRJ-42 | **Chỉ hiện** khi `send_created_email` được bật ở tab `Project` |
| `Select contacts to notify` | Select nhiều tìm kiếm bất đồng bộ — `notify_contacts[]` | **Có** `*` khi áp dụng | 0 lựa chọn khi mở; `disabled` cho tới khi có khách hàng | REQ-PRJ-43, 44 | Khối bọc `notify_contacts_wrapper` chỉ hiện khi chọn `2` Specific contacts |

### 2.2. Tab hiển thị

| Field (Label) | Loại UI | Required | Ràng buộc / Mặc định | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|
| `Visible Tabs` | Select nhiều — `settings[available_features][]` | Không | **17 lựa chọn, mặc định chọn hết 17** | REQ-PRJ-45, 46, 47, 48 | `project_overview` bị `disabled` — luôn được chọn, không bỏ ra được |

### 2.3. Mười tám công tắc quyền khách hàng

| # | Nhãn hiển thị | Tên trường | Mặc định | Bị khoá lúc mở | REQ |
|---|---|---|---|---|---|
| 1 | Allow customer to view tasks | `settings[view_tasks]` | Tắt | Không | REQ-PRJ-49 |
| 2 | Allow customer to create tasks | `settings[create_tasks]` | Tắt | **Có** | REQ-PRJ-49 |
| 3 | Allow customer to edit tasks (only tasks created from contact) | `settings[edit_tasks]` | Tắt | **Có** | REQ-PRJ-49 |
| 4 | Allow customer to comment on project tasks | `settings[comment_on_tasks]` | Tắt | **Có** | REQ-PRJ-49 |
| 5 | Allow customer to view task comments | `settings[view_task_comments]` | Tắt | **Có** | REQ-PRJ-49 |
| 6 | Allow customer to view task attachments | `settings[view_task_attachments]` | Tắt | **Có** | REQ-PRJ-49 |
| 7 | Allow customer to view task checklist items | `settings[view_task_checklist_items]` | Tắt | **Có** | REQ-PRJ-49 |
| 8 | Allow customer to upload attachments on tasks | `settings[upload_on_tasks]` | Tắt | **Có** | REQ-PRJ-49 |
| 9 | Allow customer to view task total logged time | `settings[view_task_total_logged_time]` | Tắt | **Có** | REQ-PRJ-49 |
| 10 | Allow customer to view finance overview | `settings[view_finance_overview]` | **Bật** | Không | REQ-PRJ-50 |
| 11 | Allow customer to upload files | `settings[upload_files]` | **Bật** | Không | REQ-PRJ-50 |
| 12 | Allow customer to open discussions | `settings[open_discussions]` | **Bật** | Không | REQ-PRJ-50 |
| 13 | Allow customer to view milestones | `settings[view_milestones]` | **Bật** | Không | REQ-PRJ-50 |
| 14 | Allow customer to view Gantt | `settings[view_gantt]` | **Bật** | Không | REQ-PRJ-50 |
| 15 | Allow customer to view timesheets | `settings[view_timesheets]` | **Bật** | Không | REQ-PRJ-50 |
| 16 | Allow customer to view activity log | `settings[view_activity_log]` | **Bật** | Không | REQ-PRJ-50 |
| 17 | Allow customer to view team members | `settings[view_team_members]` | **Bật** | Không | REQ-PRJ-50 |
| 18 | Hide project tasks on main tasks table (admin area) | `settings[hide_tasks_on_main_tasks_table]` | Tắt | Không | REQ-PRJ-52 |

> 📌 **Ảnh không phân biệt được "bị khoá" với "chưa tích"** — cả hai đều hiện ô trống xám nhạt. Bảng trên lấy từ thuộc tính `disabled` và `checked` đọc bằng `browser_evaluate`, đây mới là nguồn tin cậy.

---

## 3. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Kết quả mong đợi |
|---|---|---|
| REQ-PRJ-42 | Bật `Send project created email` ở tab `Project` | Ô chọn `Send contacts notifications` chuyển từ ẩn sang hiện |
| REQ-PRJ-43 | Chọn `Specific contacts` | Khối chọn liên hệ chuyển từ ẩn sang hiện |
| REQ-PRJ-44 | Chưa chọn khách hàng | Ô chọn liên hệ vẫn bị khoá dù khối bọc đã hiện |
| REQ-PRJ-47 | Cố bỏ chọn `Overview` trong `Visible Tabs` | Không bỏ được — lựa chọn bị khoá |
| REQ-PRJ-49 | Tắt `Allow customer to view tasks` | 8 công tắc con về công việc bị khoá |
| REQ-PRJ-49 | Bật `Allow customer to view tasks` | 8 công tắc con mở khoá nhưng **không tự tích** |

**Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế):**

- Cấu hình gửi tài liệu cho khách hàng chia làm **hai tầng độc lập**: `Visible Tabs` quyết định *thấy tab nào*, 18 công tắc quyết định *làm được gì trong tab đó*. Bỏ chọn tab `Tasks` nhưng vẫn bật `Allow customer to view tasks` là cấu hình mâu thuẫn mà hệ thống **không** cảnh báo.
- Cụm 8 quyền về công việc là **quan hệ cha–con một chiều**: tắt cha thì khoá con, bật cha thì mở khoá con nhưng không bật con. Người dùng phải tích tay từng quyền con.

---

## 4. Luồng xử lý — Cấu hình quyền xem của khách hàng

```
1. Ở biểu mẫu tạo/sửa dự án, chuyển sang tab "Project Settings"
2. Chọn Visible Tabs: bỏ chọn những tab không muốn khách hàng thấy
   → Overview không bỏ được
   → hoặc dùng Select All / Deselect All
3. Bật "Allow customer to view tasks" nếu muốn khách hàng xem công việc
   → 8 công tắc con mở khoá
4. Tích từng quyền con muốn cấp (tạo/sửa/bình luận/tải tệp…)
5. Xem lại 8 quyền đang bật sẵn (tài chính, tệp, thảo luận, mốc, Gantt,
   chấm công, nhật ký, thành viên) — tắt bớt nếu không muốn chia sẻ
6. (Tuỳ chọn) Bật "Hide project tasks on main tasks table (admin area)"
7. Nếu đã bật "Send project created email" ở tab Project:
   → chọn nhóm liên hệ nhận thông báo
   → chọn "Specific contacts" thì chọn thêm từng liên hệ
8. Bấm "Save"
```
