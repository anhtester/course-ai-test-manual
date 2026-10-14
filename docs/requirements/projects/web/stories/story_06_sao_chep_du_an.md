# STORY-PRJ-06 — Sao chép dự án

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-69` → `REQ-PRJ-74` (6 REQ)
>
> AMB liên quan: `AMB-PRJ-11`

**Mô tả Story:** Là nhân sự vận hành, tôi muốn nhân bản một dự án đã có kèm công việc và mốc tiến độ, để mở dự án tương tự cho khách hàng khác mà không phải nhập lại từ đầu.

> ⚠️ **Giới hạn kiểm chứng.** Story này được đặc tả tới mức **biểu mẫu và giá trị mặc định** (đọc DOM). Thao tác sao chép **chưa chạy thật** vì môi trường dùng chung và vì một lần sao chép sinh ra hàng loạt bản ghi phái sinh (công việc, mốc tiến độ, thành viên) khó dọn sạch. Kết quả sau khi bấm `Copy Project` — xem `AMB-PRJ-11`.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-69 | Mở hộp thoại sao chép dự án | Người dùng mở chức năng sao chép từ danh sách hoặc từ trang chi tiết | Liên kết `Copy Project` ở dòng danh sách gọi `copy_project({id}, this)`; menu `More` ở trang chi tiết cũng có mục `Copy Project`. Cả hai mở hộp thoại `#copy_project` tiêu đề **`Copy Project`** | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-70 | Chọn thành phần được sao chép | Người dùng chọn sao chép kèm những gì | Hộp thoại có **đúng 6 công tắc**, **cả 6 đều BẬT sẵn**: `tasks` Tasks · `tasks_include_checklist_items` Copy checklist items · `task_include_assignees` Copy the same assignees · `task_include_followers` Copy the same followers · `milestones` Milestones · `members` Members | 🟢 | — | Đọc DOM |
| REQ-PRJ-71 | Chọn trạng thái cho công việc được sao chép | Công việc nhân bản sang được đặt lại về một trạng thái chọn trước | Nhóm nút chọn `copy_project_task_status` có **đúng 5 lựa chọn** theo mã công việc: `1` Not Started · `4` In Progress · `3` Testing · `2` Awaiting Feedback · `5` Complete; **mặc định chọn `1` Not Started** | 🟢 | — | Đọc DOM |
| REQ-PRJ-72 | Nhập thông tin cho dự án mới | Dự án sao chép cần tên, khách hàng và ngày bắt đầu riêng | Ba trường bắt buộc (có dấu `*`): `name` Project Name · `clientid_copy_project` Customer · `start_date` Start Date. Trường `deadline` Deadline **không** bắt buộc | 🟢 | — | Đọc DOM |
| REQ-PRJ-73 | Giá trị điền sẵn của hộp thoại sao chép | Hộp thoại điền sẵn một số giá trị để rút ngắn thao tác | Kiểm chứng khi mở từ dự án `Dgrey Project`: `name` = **`Dgrey Project`** (đúng tên gốc, **không** thêm hậu tố kiểu `- Copy`) · `start_date` = **ngày hôm nay** (`14-08-2026`) · `deadline` = **trống** · `clientid_copy_project` = **rỗng**, chỉ có 1 mục trống, phải tự chọn lại | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-74 | Chọn khách hàng cho dự án sao chép | Khách hàng của bản sao chọn độc lập với dự án gốc | Ô `clientid_copy_project` là ô chọn tìm kiếm bất đồng bộ kèm gợi ý `Select and begin typing` / `Start typing to search`, danh sách rỗng cho tới khi gõ — cùng cơ chế với ô `Customer` của biểu mẫu tạo | 🟢 | — | Đọc DOM |

---

## 2. Đặc tả Trường Dữ liệu — hộp thoại `Copy Project`

| Field (Label) | Loại UI | Required | Mặc định | REQ | Ghi chú |
|---|---|---|---|---|---|
| `Tasks` | Công tắc — `tasks` (`#c_tasks`) | Không | **Bật** | REQ-PRJ-70 | — |
| `Copy checklist items` | Công tắc — `tasks_include_checklist_items` | Không | **Bật** | REQ-PRJ-70 | Không bị khoá khi tắt `Tasks` — hai công tắc độc lập trên DOM |
| `Copy the same assignees` | Công tắc — `task_include_assignees` | Không | **Bật** | REQ-PRJ-70 | — |
| `Copy the same followers` | Công tắc — `task_include_followers` (`#copy_project_task_include_followers`) | Không | **Bật** | REQ-PRJ-70 | ⚠️ Tên trường và `id` **không trùng nhau** — automation phải bám theo `id` |
| `Milestones` | Công tắc — `milestones` (`#c_milestones`) | Không | **Bật** | REQ-PRJ-70 | — |
| `Members` | Công tắc — `members` (`#c_members`) | Không | **Bật** | REQ-PRJ-70 | — |
| `Tasks Status` | Nhóm nút chọn — `copy_project_task_status` | — | `1` Not Started | REQ-PRJ-71 | 5 lựa chọn; mã trạng thái công việc **khác** mã trạng thái dự án |
| `Project Name` | Ô nhập chữ — `name` | **Có** `*` | Tên dự án gốc | REQ-PRJ-72, 73 | Không thêm hậu tố phân biệt |
| `Customer` | Select một tìm kiếm bất đồng bộ — `clientid_copy_project` | **Có** `*` | Rỗng | REQ-PRJ-72, 74 | Không kế thừa khách hàng của dự án gốc |
| `Start Date` | Ô nhập ngày — `start_date` | **Có** `*` | Ngày hôm nay | REQ-PRJ-72, 73 | Không kế thừa ngày bắt đầu của dự án gốc |
| `Deadline` | Ô nhập ngày — `deadline` | Không | Trống | REQ-PRJ-72 | Không kế thừa hạn chót của dự án gốc |
| `Close` | Nút | — | — | — | Đóng hộp thoại |
| `Copy Project` | Nút gửi | — | — | REQ-PRJ-69 | Thực hiện sao chép |

### 2.1. Mã trạng thái công việc (dùng trong hộp thoại này)

| Trạng thái công việc | Mã | Thứ tự hiển thị |
|---|---|---|
| Not Started | `1` | 1 |
| In Progress | **`4`** | 2 |
| Testing | **`3`** | 3 |
| Awaiting Feedback | **`2`** | 4 |
| Complete | `5` | 5 |

> ⚠️ **Đây là mã trạng thái của `TASK`, không phải của `PRJ`.** Hai bộ mã khác nhau hoàn toàn và cả hai đều không liên tục theo thứ tự hiển thị. Cùng bộ mã này xuất hiện lại ở bộ lọc `gantt_task_status` của tab Gantt (`REQ-PRJ-95`) và ở bảng tóm tắt công việc (`REQ-PRJ-98`).

---

## 3. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Kết quả mong đợi |
|---|---|---|
| REQ-PRJ-72 | Bấm `Copy Project` khi thiếu `Project Name` / `Customer` / `Start Date` | Chưa kiểm chứng — xem `AMB-PRJ-11` |
| REQ-PRJ-73 | Mở hộp thoại từ một dự án | `Project Name` điền đúng tên gốc, `Start Date` = hôm nay, `Customer` và `Deadline` để trống |

**Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế):**

- Bản sao **không kế thừa** khách hàng, ngày bắt đầu và hạn chót của dự án gốc — chỉ kế thừa **tên**. Đây là thiết kế "sao chép cấu trúc công việc, gán cho khách hàng khác".
- Tên bản sao **trùng hệt** tên gốc và hệ thống không chặn trùng tên (`REQ-PRJ-59`) → sao chép mà không sửa tên sẽ sinh ra hai dự án cùng tên. Hai dự án `Dgrey Project` (id `2394`, `2395`) đang có trong danh sách rất có thể sinh ra theo đúng đường này.
- Biểu mẫu **không** cho chọn trạng thái cho *dự án* mới, chỉ cho chọn trạng thái cho *công việc* được sao chép.

---

## 4. Luồng xử lý — Sao chép dự án

```
1. Từ danh sách: trỏ chuột vào dòng → bấm "Copy Project"
   hoặc từ trang chi tiết: More → "Copy Project"
2. Hộp thoại "Copy Project" mở ra với 6 công tắc BẬT sẵn
3. Tắt bớt thành phần không muốn sao chép
4. Chọn trạng thái cho công việc được sao chép (mặc định Not Started)
5. Sửa "Project Name" — mặc định trùng hệt tên gốc, nên đổi để phân biệt
6. Gõ từ khoá vào "Customer" → chọn khách hàng cho bản sao
7. Kiểm tra "Start Date" (mặc định hôm nay), nhập "Deadline" nếu có
8. Bấm "Copy Project"
   → kết quả chưa kiểm chứng (AMB-PRJ-11)
```
