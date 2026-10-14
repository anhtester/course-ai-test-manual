# STORY-PRJ-04 — Kiểm tra dữ liệu đầu vào & thông báo lỗi

> Về index: [../../REQUIREMENTS_PROJECTS_SUMMARY.md](../../REQUIREMENTS_PROJECTS_SUMMARY.md) · File nền tảng: [../requirements_projects_web.md](../requirements_projects_web.md) · Prefix `PRJ` · REQ bao phủ: `REQ-PRJ-53` → `REQ-PRJ-59` (7 REQ)
>
> AMB liên quan: `AMB-PRJ-04`, `AMB-PRJ-05`, `AMB-PRJ-08`, `AMB-PRJ-09`, `AMB-PRJ-10`

**Mô tả Story:** Là nhân sự vận hành, tôi muốn hệ thống chặn dữ liệu thiếu hoặc sai ngay tại biểu mẫu, để không tạo ra dự án hỏng.

---

## 1. Yêu cầu Chức năng

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-PRJ-53 | Bắt buộc nhập tên dự án | Không lưu được dự án khi để trống tên | Bấm `Save` với `name` rỗng → không gửi biểu mẫu, URL không đổi; sinh phần tử `<p id="name-error" class="text-danger">` với nội dung **`This field is required.`**; khối bọc trường mang lớp `has-error` | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-54 | Bắt buộc chọn khách hàng | Không lưu được dự án khi chưa chọn khách hàng | Bấm `Save` với `clientid` rỗng → sinh `<p id="clientid-error" class="text-danger">` với nội dung **`Select and begin typing`**; khối bọc mang lớp `has-error` | 🟢 | — | Kiểm chứng thực tế · xem `AMB-PRJ-05` |
| REQ-PRJ-55 | Bắt buộc nhập ngày bắt đầu | Không lưu được dự án khi xoá trắng ngày bắt đầu | Xoá `start_date` rồi bấm `Save` → sinh `<p id="start_date-error">` với nội dung **`This field is required.`** | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-56 | Bắt buộc chọn kiểu tính phí | Không lưu được dự án khi bỏ trống kiểu tính phí | Đặt `billing_type` về mục rỗng rồi bấm `Save` → sinh `<p id="billing_type-error">` với nội dung **`This field is required.`** | 🟢 | — | Kiểm chứng thực tế |
| REQ-PRJ-57 | Kiểm tra chạy trước khi gửi biểu mẫu | Biểu mẫu không được gửi đi khi còn lỗi | Với biểu mẫu rỗng, sau khi bấm `Save`: URL vẫn là `/admin/projects/project`, **không** phát sinh request `POST` nào tới máy chủ | 🟢 | — | Kiểm chứng thực tế · tầng network |
| REQ-PRJ-58 | Hạn chót sớm hơn ngày bắt đầu | Hệ thống **không** chặn hạn chót nằm trước ngày bắt đầu | Kiểm chứng 14-08-2026: `Start Date = 20-08-2026`, `Deadline = 01-08-2026` → **không** sinh thông báo lỗi nào, biểu mẫu gửi đi và tạo dự án thành công (id `2695`). Trang chi tiết hiển thị băng cảnh báo **`This project is overdue by 13 days`** | 🟢 | — | Kiểm chứng thực tế · xem `AMB-PRJ-04` |
| REQ-PRJ-59 | Tên dự án trùng nhau | Hệ thống **không** chặn và **không** cảnh báo khi tên dự án trùng | Danh sách hiện có 2 dự án cùng tên `Dgrey Project` (id `2394`, `2395`) và hơn 10 dự án cùng tên `Mua hàng qua app`. Biểu mẫu **không** phát sinh request kiểm tra trùng tên nào khi rời ô `name` | 🟢 | — | Kiểm chứng thực tế · tầng network · xem `AMB-PRJ-08` |

---

## 2. Business Rules & Validation Messages

| REQ ID | Rule / Trigger | Thông báo lỗi mong đợi (nguyên văn) |
|---|---|---|
| REQ-PRJ-53 | `Project Name` để trống → bấm `Save` | `This field is required.` |
| REQ-PRJ-54 | `Customer` chưa chọn → bấm `Save` | `Select and begin typing` ⚠️ (là chuỗi gợi ý của ô chọn, không phải câu báo lỗi — `AMB-PRJ-05`) |
| REQ-PRJ-55 | `Start Date` để trống → bấm `Save` | `This field is required.` |
| REQ-PRJ-56 | `Billing Type` để trống → bấm `Save` | `This field is required.` |
| REQ-PRJ-58 | `Deadline` < `Start Date` → bấm `Save` | *(không có thông báo — lưu thành công)* |
| REQ-PRJ-59 | Tên trùng dự án đã có → bấm `Save` | *(không có thông báo — lưu thành công)* |

### 2.1. Bốn trường bắt buộc — tổng hợp

| Trường | Có dấu `*` | Bị bắt lỗi lúc mở biểu mẫu? | Lý do |
|---|---|---|---|
| `Project Name` | Có | **Có** | Không có giá trị mặc định |
| `Customer` | Có | **Có** | Không có giá trị mặc định |
| `Start Date` | Có | Không | **Điền sẵn ngày hôm nay** — chỉ báo lỗi khi người dùng chủ động xoá trắng |
| `Billing Type` | Có | Không | **Chọn sẵn `Fixed Rate`** — chỉ báo lỗi khi người dùng chủ động đặt về rỗng |

> 📌 Hệ quả cho test: bấm `Save` ngay trên biểu mẫu rỗng chỉ ra **2 lỗi**, không phải 4. Muốn kiểm chứng đủ 4 trường bắt buộc thì phải **chủ động xoá** `Start Date` và đặt `Billing Type` về rỗng.

### 2.2. Quy tắc nghiệp vụ ngầm (rút ra từ hành vi thực tế)

- **Kiểm tra chỉ có ở phía client.** Không quan sát được tầng kiểm tra phía máy chủ nào vì biểu mẫu không bao giờ được gửi đi khi còn lỗi. Rule chỉ tồn tại ở máy chủ (nếu có) **chưa kiểm chứng được** bằng thao tác UI thông thường.
- **Không có ràng buộc logic giữa hai ngày.** Cả `Start Date` và `Deadline` đều được nhận độc lập; hệ quả sai lệch chỉ hiện ra ở trang chi tiết dưới dạng cảnh báo quá hạn và số `Days Left` âm (xem `REQ-PRJ-81`, `AMB-PRJ-07`).
- **Không có ràng buộc định dạng hay độ dài** trên bất kỳ trường chữ nào; không có `min`/`max` trên bất kỳ trường số nào. Xem `AMB-PRJ-09`, `AMB-PRJ-10`.

---

## 3. Luồng xử lý — Kiểm chứng bộ kiểm tra dữ liệu

```
1. Mở /admin/projects/project
2. Bấm "Save" ngay
   → 2 lỗi hiện ra: name-error, clientid-error
   → URL không đổi, không có request nào gửi đi
3. Nhập Project Name → bấm "Save"
   → còn 1 lỗi: clientid-error
4. Xoá trắng Start Date → bấm "Save"
   → thêm lỗi start_date-error
5. Đặt Billing Type về mục rỗng → bấm "Save"
   → thêm lỗi billing_type-error
6. Điền đủ 4 trường bắt buộc, đặt Deadline SỚM HƠN Start Date → bấm "Save"
   → KHÔNG có lỗi, dự án được tạo
   → trang chi tiết hiện băng "This project is overdue by N days"
```
