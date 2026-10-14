# STORY-PRJ-10 — Xoá dự án & xuất dữ liệu dự án

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-102` → `REQ-PRJ-104` (3 REQ)
>
> AMB liên quan: `AMB-PRJ-03`, `AMB-PRJ-12` · RISK liên quan: `RISK-PRJ-03`

**Mô tả Story:** Là nhân sự vận hành, tôi muốn xoá dự án không còn dùng và xuất dữ liệu dự án ra tệp, để dọn hệ thống và lưu trữ hồ sơ.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-102 | Xoá dự án có hỏi lại | Hệ thống xác nhận trước khi xoá | Liên kết `Delete` (ở dòng danh sách) và `Delete Project` (trong menu `More`) đều mang lớp `_delete` và trỏ tới `/admin/projects/delete/{id}`. Bấm vào → hiện hộp thoại xác nhận của trình duyệt với nội dung nguyên văn **`Are you sure you want to perform this action?`**. Bấm Huỷ → không xoá | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-103 | Xoá dự án thành công | Dự án bị xoá khỏi hệ thống và người dùng được đưa về danh sách kèm thông báo thành công | ⚠️ **Đang KHÔNG đạt.** Kiểm chứng trên dự án id `2695`: sau khi xác nhận, dự án **bị xoá thật** (mở lại `/admin/projects/view/2695` → chuyển tới `/admin/not_found`, hiển thị `Project not found`) nhưng hệ thống **không** đưa về `/admin/projects` mà chuyển thẳng tới `/admin/not_found` kèm thông báo **`Something went wrong. Try again`**. Không có thông báo thành công nào | 🟢 | — | Kiểm chứng thực tế · xem `AMB-PRJ-03` |
| REQ-PRJ-104 | Xuất dữ liệu của một dự án | Người dùng tải về toàn bộ dữ liệu của dự án | Menu `More` có mục `Export project data` trỏ tới `/admin/projects/export_project_data/{id}`. Định dạng tệp và nội dung **chưa kiểm chứng** — không tải tệp về trong đợt khảo sát | ⚪ | — | Đọc DOM · xem `AMB-PRJ-12` |

---

## 2. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Thông báo mong đợi (nguyên văn) |
|---|---|---|
| REQ-PRJ-102 | Bấm `Delete` / `Delete Project` | `Are you sure you want to perform this action?` (hộp thoại xác nhận của trình duyệt) |
| REQ-PRJ-102 | Bấm Huỷ ở hộp thoại xác nhận | Không xoá, ở nguyên trang hiện tại |
| REQ-PRJ-103 | Xác nhận xoá | ⚠️ Hiện `Something went wrong. Try again` + `Project not found` tại `/admin/not_found` — **mặc dù xoá đã thành công**. Xem `AMB-PRJ-03` |
| REQ-PRJ-103 | Mở lại URL của dự án đã xoá | `Project not found` |

**Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế):**

- **Thông báo sai kết quả thật.** Đây là điểm nguy hiểm nhất của Story: người dùng thấy chữ *"Something went wrong"* sẽ tin là xoá thất bại và có thể thao tác lại hoặc báo lỗi nhầm. Test thủ công theo đúng câu chữ trên màn hình sẽ chấm FAIL cho một thao tác thực ra đã thành công.
- **Xoá dùng phương thức GET.** `/admin/projects/delete/{id}` xoá ngay khi URL được mở; hộp thoại xác nhận chỉ là lớp chặn phía trình duyệt do lớp CSS `_delete` gắn vào. Mở thẳng URL bằng thanh địa chỉ, hoặc để automation điều hướng nhầm vào đó, đều xoá dữ liệu thật mà không hỏi gì. Xem `RISK-PRJ-03`.
- **Không có thao tác xoá hàng loạt.** Bảng danh sách dự án không có cột chọn hàng và không có `Bulk Actions` — khác module `CUST`. Muốn dọn nhiều dự án phải xoá từng cái một.
- **Chưa kiểm chứng** hành vi khi xoá dự án **đang có** công việc, hoá đơn hoặc hợp đồng gắn vào: chặn, xoá lan hay để lại bản ghi mồ côi. Dự án dùng để kiểm chứng là dự án rỗng hoàn toàn. Đây là cùng loại rủi ro với `AMB-CUST-11` của module `CUST` và cần môi trường riêng để thử.

---

## 3. Luồng xử lý

### 3.1. Xoá dự án

```
1. Từ danh sách: trỏ chuột vào dòng → bấm "Delete"
   hoặc từ trang chi tiết: More → "Delete Project"
2. Hộp thoại xác nhận của trình duyệt:
   "Are you sure you want to perform this action?"
3. Bấm Huỷ  → không xoá, ở nguyên trang
   Bấm OK   → GET /admin/projects/delete/{id}
              → dự án BỊ XOÁ THẬT
              ⚠️ nhưng chuyển tới /admin/not_found kèm
                 "Something went wrong. Try again" + "Project not found"
4. Muốn xác nhận đã xoá: quay lại /admin/projects và tìm lại dự án
   → không còn trong danh sách
```

### 3.2. Xuất dữ liệu dự án

```
1. Mở /admin/projects/view/{id}
2. More → "Export project data"
   → GET /admin/projects/export_project_data/{id}
   → nội dung tệp chưa kiểm chứng (AMB-PRJ-12)
```

---

## 4. Ghi chú cho automation

| Vấn đề | Cách xử lý |
|---|---|
| Không có mốc nào để khẳng định xoá thành công | Khẳng định bằng cách **quay lại danh sách và kiểm tra dự án không còn**, hoặc mở lại URL chi tiết và kiểm tra chuyển hướng tới `/admin/not_found`. **Không** khẳng định theo thông báo trên màn hình |
| Hộp thoại xác nhận là hộp thoại gốc của trình duyệt | Phải bắt sự kiện `dialog` của trình điều khiển; không tìm thấy phần tử DOM nào cho hộp thoại này |
| URL xoá là GET | **Cấm** đưa `/admin/projects/delete/{id}` vào bất kỳ bước điều hướng nào. Chỉ xoá qua liên kết + hộp thoại xác nhận, và chỉ với dự án do chính test tạo ra |
| Môi trường dùng chung | Mọi dự án test phải mang tiền tố truy vết riêng kèm dấu thời gian và **phải xoá sau khi chạy** — danh sách hiện đã tồn hơn 50 bản ghi rác từ các đợt automation trước (`RISK-PRJ-02`) |
