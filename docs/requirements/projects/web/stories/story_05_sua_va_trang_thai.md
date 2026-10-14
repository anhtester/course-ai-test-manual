# STORY-PRJ-05 — Sửa dự án & vòng đời trạng thái

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-60` → `REQ-PRJ-68` (9 REQ)
>
> Ma trận trạng thái đầy đủ nằm ở [index mục 5](../../REQUIREMENTS_PROJECTS_SUMMARY.md#5-ma-trận-trạng-thái)

**Mô tả Story:** Là nhân sự vận hành, tôi muốn sửa thông tin dự án và đổi trạng thái của nó, để phản ánh đúng tình hình thực tế và thông báo cho những người liên quan.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-60 | Truy cập biểu mẫu sửa dự án | Mở biểu mẫu sửa từ danh sách hoặc từ trang chi tiết | Cả liên kết `Edit` ở dòng danh sách lẫn `Edit Project` trong menu `More` ở trang chi tiết đều trỏ tới `/admin/projects/project/{id}`; tiêu đề trang là **`Edit Project`** | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-61 | Biểu mẫu sửa nạp sẵn dữ liệu hiện có | Mở sửa thì mọi trường đã điền giá trị đang lưu | Cùng cấu trúc 2 tab như biểu mẫu tạo. Ô chọn `clientid` **chỉ chứa đúng 1 lựa chọn** là khách hàng hiện tại (không phải danh sách rỗng như lúc tạo); `status`, `billing_type`, `project_members[]` đều nạp giá trị đang lưu | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-62 | Đổi trạng thái từ biểu mẫu sửa | Người dùng đổi trạng thái bằng ô chọn `Status` rồi lưu | Ô `status` cho chọn bất kỳ trong 5 trạng thái. **Không** có ràng buộc chiều chuyển — mọi trạng thái đều chuyển được sang mọi trạng thái còn lại | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-63 | Tuỳ chọn phụ khi đổi trạng thái | Biểu mẫu sửa có thêm hai tuỳ chọn không có ở biểu mẫu tạo | Biểu mẫu sửa chứa thêm 2 trường: `notify_project_members_status_change` (nhãn `Notify project members that status is changed`, **hiện sẵn**) và `mark_all_tasks_as_completed` (nhãn `Mark all tasks as completed and stop all timers (No notifications sent to project members)`, **ẩn** khi trạng thái chưa đổi). Cả hai mặc định TẮT | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-64 | Tuỳ chọn riêng khi chuyển sang `Finished` | Chuyển sang trạng thái hoàn thành thì mở thêm tuỳ chọn gửi email cho khách hàng | Đổi `status` sang `4` Finished → `project_marked_as_finished_email_to_contacts` (nhãn `Send Project Marked as Finished email to customer contacts`) chuyển từ **ẩn sang hiện**. Đổi sang trạng thái khác (`1` Not Started) → trường này **ẩn lại**, còn `mark_all_tasks_as_completed` vẫn hiện | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-65 | Đổi trạng thái nhanh từ trang chi tiết | Đổi trạng thái không cần mở biểu mẫu sửa | Menu `More` ở trang chi tiết chứa các mục `Mark as <trạng thái>`, mỗi mục gọi `project_mark_as_modal(<mã>, <id>, this)`. Kiểm chứng trên dự án `In Progress`: hiện đúng **4 mục** `Mark as Not Started` (mã `1`) · `Mark as On Hold` (`3`) · `Mark as Cancelled` (`5`) · `Mark as Finished` (`4`) | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-66 | Menu đổi trạng thái bỏ qua trạng thái hiện tại | Không hiện mục đổi sang chính trạng thái đang có | Dự án đang `In Progress` (mã `2`) → menu **không** có mục `Mark as In Progress`; chỉ liệt kê 4/5 trạng thái | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-67 | Hộp thoại xác nhận khi đổi trạng thái nhanh | Đổi trạng thái nhanh vẫn hỏi lại người dùng về hai tuỳ chọn phụ | Bấm `Mark as Finished` → mở hộp thoại tiêu đề **`Additional action required!`** chứa: công tắc `notify_project_members_status_change` (**mặc định TẮT**), công tắc `mark_all_tasks_as_completed` (**mặc định BẬT**), nút `Confirm` (`#project_mark_status_confirm`) | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-68 | Ghim dự án | Đánh dấu dự án để truy cập nhanh | Menu `More` có mục `Pin Project` trỏ tới `/admin/projects/pin_action/{id}` | 🟢 | — | Đọc DOM |

---

## 2. Đặc tả Trường Dữ liệu — khác biệt giữa biểu mẫu Sửa và biểu mẫu Tạo

Biểu mẫu sửa dùng lại toàn bộ trường của biểu mẫu tạo (xem [STORY-PRJ-02](story_02_tao_du_an.md) và [STORY-PRJ-03](story_03_cau_hinh_du_an.md)). Ba trường **chỉ có ở biểu mẫu sửa**:

| Field (Label) | Loại UI | Required | Điều kiện hiển thị | Mặc định | REQ |
|---|---|---|---|---|---|
| `Notify project members that status is changed` | Công tắc — `notify_project_members_status_change` | Không | Hiện sẵn khi mở biểu mẫu sửa | Tắt | REQ-PRJ-63 |
| `Mark all tasks as completed and stop all timers (No notifications sent to project members)` | Công tắc — `mark_all_tasks_as_completed` | Không | Ẩn khi trạng thái chưa đổi; **hiện** ngay khi chọn trạng thái khác | Tắt | REQ-PRJ-63 |
| `Send Project Marked as Finished email to customer contacts` | Công tắc — `project_marked_as_finished_email_to_contacts` | Không | **Chỉ hiện** khi `status` = `4` Finished | Tắt | REQ-PRJ-64 |

> 📌 Trường `project_marked_as_finished_email_to_contacts` **cũng tồn tại trong DOM của biểu mẫu tạo** nhưng luôn ẩn ở đó. Automation đọc theo `id` mà không kiểm tra khả năng nhìn thấy sẽ tưởng nhầm biểu mẫu tạo cũng có trường này — xem `RISK-PRJ-06`.

### 2.1. Hộp thoại `Additional action required!`

| Field (Label) | Loại UI | Mặc định | Ghi chú |
|---|---|---|---|
| `Notify project members that status is changed` | Công tắc — `notify_project_members_status_change` | **Tắt** | Cùng tên trường với biểu mẫu sửa |
| `Mark all tasks as completed and stop all timers (No notifications sent to project members)` | Công tắc — `mark_all_tasks_as_completed` | **BẬT** ⚠️ | **Khác** biểu mẫu sửa (ở đó mặc định tắt) |
| `Confirm` | Nút gửi — `#project_mark_status_confirm` | — | Không có nút Huỷ; đóng bằng dấu `×` |

> ⚠️ **Cùng một tuỳ chọn, hai giá trị mặc định khác nhau** tuỳ lối đi: qua biểu mẫu sửa thì `mark_all_tasks_as_completed` **tắt**, qua hộp thoại nhanh thì **bật**. Người dùng đổi trạng thái qua menu nhanh mà không để ý sẽ vô tình đánh dấu hoàn thành **toàn bộ công việc** của dự án và dừng mọi đồng hồ đếm giờ.

---

## 3. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Kết quả mong đợi |
|---|---|---|
| REQ-PRJ-63 | Ở biểu mẫu sửa, chọn `Status` khác giá trị hiện tại | `mark_all_tasks_as_completed` chuyển từ ẩn sang hiện |
| REQ-PRJ-64 | Ở biểu mẫu sửa, chọn `Status` = `Finished` | Thêm `project_marked_as_finished_email_to_contacts` chuyển sang hiện |
| REQ-PRJ-64 | Đổi từ `Finished` sang trạng thái khác | `project_marked_as_finished_email_to_contacts` ẩn trở lại |
| REQ-PRJ-66 | Mở menu `More` của dự án đang ở trạng thái X | Menu liệt kê đúng 4 trạng thái, không có X |
| REQ-PRJ-67 | Bấm `Mark as <trạng thái>` | Mở hộp thoại `Additional action required!`, **chưa** đổi trạng thái cho tới khi bấm `Confirm` |

**Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế):**

- **Không có trạng thái cuối.** Dự án `Finished` hoặc `Cancelled` vẫn mở lại được về bất kỳ trạng thái nào. Không quan sát được ràng buộc chiều chuyển nào.
- **Khách hàng của dự án đổi được sau khi tạo** — ô `clientid` ở biểu mẫu sửa không bị khoá. Ảnh hưởng dây chuyền sang các chứng từ đã gắn dự án thì **chưa kiểm chứng**.
- Hộp thoại đổi trạng thái nhanh **luôn xuất hiện**, kể cả khi dự án chưa có công việc nào (kiểm chứng trên dự án 0 công việc) — tiêu đề `Additional action required!` gây hiểu nhầm là bắt buộc phải làm gì đó.

---

## 4. Luồng xử lý

### 4.1. Sửa dự án

```
1. Từ danh sách bấm "Edit", hoặc từ trang chi tiết mở More → "Edit Project"
   → /admin/projects/project/{id}, tiêu đề "Edit Project"
2. Mọi trường đã nạp sẵn giá trị đang lưu
3. Sửa thông tin cần đổi
4. Nếu đổi Status:
   → hiện "Mark all tasks as completed and stop all timers"
   → nếu chọn Finished, hiện thêm "Send Project Marked as Finished email…"
   → cân nhắc bật "Notify project members that status is changed"
5. Bấm "Save"
```

### 4.2. Đổi trạng thái nhanh từ trang chi tiết

```
1. Mở /admin/projects/view/{id}
2. Bấm "More" → chọn "Mark as <trạng thái>"   (không có trạng thái hiện tại)
3. Hộp thoại "Additional action required!" mở ra
   ⚠️ "Mark all tasks as completed…" ĐANG BẬT SẴN — tắt đi nếu không muốn
4. (Tuỳ chọn) Bật "Notify project members that status is changed"
5. Bấm "Confirm" → trạng thái được cập nhật
```
