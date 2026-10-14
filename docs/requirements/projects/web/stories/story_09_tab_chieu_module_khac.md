# STORY-PRJ-09 — Tab chiếu dữ liệu từ module khác

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-98` → `REQ-PRJ-101` (4 REQ)
>
> RISK liên quan: `RISK-PRJ-01`

**Mô tả Story:** Là nhân sự vận hành, tôi muốn thấy công việc, phiếu hỗ trợ, hợp đồng và toàn bộ chứng từ bán hàng gắn với dự án ngay trong dự án, để không phải sang từng module lọc lại theo dự án.

> ⚠️ **Phạm vi có chủ ý hẹp.** Chín tab trong Story này **chiếu dữ liệu của module khác** đã lọc sẵn theo dự án. Nghiệp vụ của từng loại bản ghi (tạo công việc, phát hành hoá đơn, ký hợp đồng…) thuộc về module gốc với prefix riêng — `TASK`, `TICK`, `CTR`, `PROP`, `EST`, `INV`, `SUB`, `EXP`, `CN`. Ở đây chỉ đặc tả tới mức **màn hình tồn tại và hiển thị đúng cột**.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-98 | Xem công việc của dự án | Tab `Tasks` liệt kê công việc thuộc dự án kèm bảng tóm tắt theo trạng thái | Mở `?group=project_tasks` → bảng có 9 cột (kể cả cột chọn hàng loạt): `☐` · `#` · `Name` · `Status` · `Start Date` · `Due Date` · `Assigned to` · `Tags` · `Priority`; kèm `Bulk Actions` và `Export`. Phía trên bảng có khối **`Tasks Summary`** đếm theo **5 trạng thái công việc**: `Not Started` · `In Progress` · `Testing` · `Awaiting Feedback` · `Complete`, mỗi mục kèm dòng phụ `Tasks assigned to me: <N>`. Nút `New Task` ở thanh thao tác gọi `new_task_from_relation(undefined,'project',{id})` | 🟢 | — | Kiểm chứng thực tế · đọc DOM |
| REQ-PRJ-99 | Xem phiếu hỗ trợ của dự án | Tab `Tickets` liệt kê phiếu hỗ trợ gắn với dự án | Mở `?group=project_tickets` → bảng có 10 cột: `#` · `Subject` · `Tags` · `Department` · `Service` · `Contact` · `Status` · `Priority` · `Last Reply` · `Created` | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-100 | Xem hợp đồng của dự án | Tab `Contracts` liệt kê hợp đồng gắn với dự án | Mở `?group=project_contracts` → bảng có 8 cột: `#` · `Subject` · `Customer` · `Contract Type` · `Contract Value` · `Start Date` · `End Date` · `Signature` | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-101 | Xem chứng từ bán hàng của dự án | Nhóm `Sales` gom 6 tab chứng từ, mỗi tab một bảng riêng | Sáu tab mở được qua `?group=<mã>`, mỗi bảng có đúng bộ cột dưới đây | 🟢 | — | Kiểm chứng thực tế |

### 1.1. Sáu tab trong nhóm `Sales` (REQ-PRJ-101)

| Tab | Mã tab | Cột của bảng |
|---|---|---|
| `Proposals` | `project_proposals` | `Proposal #` · `Subject` · `To` · `Total` · `Date` · `Open Till` · `Tags` · `Date Created` · `Status` |
| `Estimates` | `project_estimates` | `Estimate #` · `Amount` · `Total Tax` · `Customer` · `Project` · `Tags` · `Date` · `Expiry Date` · `Reference #` · `Status` |
| `Invoices` | `project_invoices` | `Invoice #` · `Amount` · `Total Tax` · `Date` · `Customer` · `Project` · `Tags` · `Due Date` · `Status` |
| `Subscriptions` | `project_subscriptions` | `#` · `Subscription Name` · `Customer` · `Project` · `Status` · `Next Billing Cycle` · `Date Subscribed` · `Last Sent` |
| `Expenses` | `project_expenses` | `Category` · `Amount` · `Name` · `Receipt` · `Date` · `Invoice` · `Reference #` · `Payment Mode` |
| `Credit Notes` | `project_credit_notes` | `Credit Note #` · `Credit Note Date` · `Customer` · `Status` · `Reference #` · `Amount` · `Remaining Amount` |

---

## 2. Đặc tả — điểm chung của mọi tab chiếu

| Thuộc tính | Giá trị | Ghi chú |
|---|---|---|
| Chọn số dòng mỗi trang | `10` · `25` · `50` · `100` · `All` | Giống bảng danh sách dự án |
| Xuất dữ liệu | Nút `Export` | Có ở **mọi** tab chiếu |
| Thao tác hàng loạt | Chỉ tab `Tasks` và `Files` có `Bulk Actions` | Các tab bán hàng **không** có |
| Bảng rỗng | `No entries found` | — |
| Cột `Project` | Có ở `Estimates` · `Invoices` · `Subscriptions` | Dư thừa khi xem trong ngữ cảnh một dự án, nhưng vẫn hiển thị |

### 2.1. Mã trạng thái công việc (dùng ở `Tasks Summary`)

| Trạng thái công việc | Mã | Thứ tự hiển thị ở `Tasks Summary` |
|---|---|---|
| Not Started | `1` | 1 |
| In Progress | `4` | 2 |
| Testing | `3` | 3 |
| Awaiting Feedback | `2` | 4 |
| Complete | `5` | 5 |

> ⚠️ Bộ mã này **khác hoàn toàn** bộ mã trạng thái dự án (xem [index mục 5](../../REQUIREMENTS_PROJECTS_SUMMARY.md#5-ma-trận-trạng-thái)). Cùng bộ mã công việc này xuất hiện ở hộp thoại `Copy Project` (`REQ-PRJ-71`) và bộ lọc `gantt_task_status` (`REQ-PRJ-95`) — ba nơi khớp nhau, đã đối chiếu.

---

## 3. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Kết quả mong đợi |
|---|---|---|
| REQ-PRJ-98 → 101 | Dự án chưa có bản ghi loại đó | Bảng hiển thị `No entries found` |
| REQ-PRJ-98 | Bấm `New Task` từ trang chi tiết dự án | Mở hộp thoại tạo công việc đã gắn sẵn dự án hiện tại |

**Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế):**

- Tab nào hiển thị được điều khiển bởi `Visible Tabs` (`REQ-PRJ-45`). Bỏ chọn `Invoices` trong cấu hình dự án thì tab `Invoices` biến mất khỏi nhóm `Sales` — **chưa kiểm chứng** phạm vi tác động (khu quản trị hay chỉ cổng khách hàng), xem `AMB-PRJ-14`.
- `Tasks` là tab chiếu duy nhất có **điểm vào tạo bản ghi** ngay trong dự án (`New Task`). Năm loại chứng từ bán hàng và phiếu hỗ trợ **không** tạo được từ đây — chỉ xem.
- Cấu hình `Hide project tasks on main tasks table (admin area)` (`REQ-PRJ-52`) tác động ngược lại lên module `TASK`: công việc của dự án bị ẩn khỏi bảng công việc chung. Đây là **liên đới hai chiều** giữa `PRJ` và `TASK` — xem `AMB-PRJ-15` và `RISK-PRJ-01`.

---

## 4. Ánh xạ sang module gốc

Bảng dưới để chạy `/generate-traceability-matrix` và để biết khi sửa module nào thì phải chạy lại test của `PRJ`:

| Tab trong dự án | Module gốc | Prefix | Tài liệu module gốc |
|---|---|---|---|
| `Tasks` | Công việc | `TASK` | Chưa recon |
| `Tickets` | Hỗ trợ | `TICK` | Chưa recon |
| `Contracts` | Hợp đồng | `CTR` | Chưa recon |
| `Proposals` | Đề xuất | `PROP` | Chưa recon |
| `Estimates` | Báo giá sơ bộ | `EST` | Chưa recon |
| `Invoices` | Hoá đơn | `INV` | Chưa recon |
| `Subscriptions` | Đăng ký định kỳ | `SUB` | Chưa recon |
| `Expenses` | Chi phí | `EXP` | Chưa recon |
| `Credit Notes` | Giấy báo có | `CN` | Chưa recon |
