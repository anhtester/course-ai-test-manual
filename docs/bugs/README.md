# Danh mục Bug Report — Perfex CRM (Anh Tester Demo)

> **Điểm vào tầng bug.** Mọi workflow đụng tới bug đọc file này **trước tiên**: bug nào đang mở · mã nào đã chiếm · bug nào đã fix nhưng chưa retest.
>
> Đây là **mắt xích thứ tư** của chuỗi truy vết: `requirements → testcases → executions → bugs`.

| Mục | Giá trị |
|---|---|
| Hệ thống | Perfex CRM — Anh Tester Demo (`https://crm.anhtester.com`) |
| Quy ước mã bug | `BUG_<module>_<timestamp>_<TC_ID>` — `timestamp` epoch giây lúc sinh (đảm bảo không trùng), `TC_ID` là mã TC ngắn (VD `TC004`) để nhìn tên là biết ngay thuộc TC nào, không phải mở file/tra bảng |
| Đường dẫn file | `docs/bugs/<module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md` — `<nền-tảng>` chỉ nhận `web` · `mobile` · `api` |
| Ngày cập nhật | 19-09-2026 |

---

## 1. Danh mục bug

| Mã bug | Module | Tiêu đề ngắn | Severity | Priority | Trạng thái | TC liên quan | Ngày phát hiện |
|---|---|---|---|---|---|---|---|
| [BUG_login_1785678750_TC039](login/web/BUG_login_1785678750_TC039.md) | `LOGIN` | Trang đăng nhập phục vụ được qua HTTP thuần, không ép chuyển sang HTTPS, không có HSTS | 🔴 Critical | P1 | 🔴 **Đang mở** | `CRM_LOGIN_TC_039` | 02-08-2026 |
| [BUG_login_1787226513_TC004](login/web/BUG_login_1787226513_TC004.md) | `LOGIN` | Bấm logo không dẫn về trang chủ công khai (root URL luôn redirect sang cổng đăng nhập khách hàng) | 🟡 Minor | P3 | 🔴 **Đang mở** | `CRM_LOGIN_TC_004` | 20-08-2026 |
| [BUG_login_1787226514_TC016](login/web/BUG_login_1787226514_TC016.md) | `LOGIN` | Ô Email không giữ lại giá trị sau khi đăng nhập thất bại | 🟡 Minor | P2 | 🔴 **Đang mở** | `CRM_LOGIN_TC_016` | 20-08-2026 |
| [BUG_login_1787226515_TC018](login/web/BUG_login_1787226515_TC018.md) | `LOGIN` | Email quá dài (260 ký tự) trả thông báo lỗi khác thông báo chuẩn `Invalid email or password` | 🟢 Trivial | P3 | ⚪ **Đã đóng — không phải lỗi** (19-09-2026) | `CRM_LOGIN_TC_018-a` | 20-08-2026 |
| [BUG_login_1787226516_TC028](login/web/BUG_login_1787226516_TC028.md) | `LOGIN` | Bỏ trống email ở Quên mật khẩu báo sai bản chất lỗi (`Email not found` thay vì trường bắt buộc) | 🟡 Minor | P2 | 🔴 **Đang mở** | `CRM_LOGIN_TC_028` | 20-08-2026 |
| [BUG_login_1787226517_TC029](login/web/BUG_login_1787226517_TC029.md) | `LOGIN` | Ô Email ở Quên mật khẩu không tự reset sau khi submit email không tồn tại | 🟢 Trivial | P3 | 🔴 **Đang mở** | `CRM_LOGIN_TC_029` | 20-08-2026 |

> `BUG_login_1785678750_TC039` đã được **rà lại và sửa xong** ngày 20-08-2026: tham chiếu TC ID/REQ ID lệch nghĩa đã sửa đúng (`CRM_LOGIN_TC_039` / `REQ-LOGIN-01`), evidence gốc đã mất được bổ sung evidence xác nhận lại từ `run_1787215085`, và đã ghi 1 dòng Lịch sử retest (`❌ NOT_FIXED` — lỗi vẫn còn). Xem chi tiết trong file bug.

---

## 2. Thống kê theo trạng thái

| Trạng thái | Số lượng | Ý nghĩa |
|---|---|---|
| 🔴 Đang mở | 5 | Đã xác nhận, chưa fix |
| 🟡 Đã fix, chờ retest | 0 | Dev báo fix xong → chạy `/retest-fixed-bugs` |
| 🟢 Đã đóng | 0 | Retest FIXED |
| ⚪ Đóng — không phải lỗi | 1 | Kiểm chứng lại cho thấy là hành vi đúng thiết kế — không cần fix |
| ⚠️ Cần rà lại | 0 | Tham chiếu lệch hoặc evidence mất — chưa dùng được |

---

## 3. Cấu trúc thư mục chuẩn

```
docs/bugs/
├── README.md                                   ← FILE NÀY — danh mục toàn hệ thống
└── <module>/
    └── <nền-tảng>/                             ← web · mobile · api — luôn có, kể cả module một nền tảng
        └── BUG_<module>_<timestamp>_<TC_ID>.md ← mỗi bug 1 file
```

**Quy tắc bất biến:**

| Quy tắc | Lý do |
|---|---|
| Mỗi bug **một file**, đặt trong thư mục của **module phát sinh** | Dự án nhiều module thì thư mục phẳng dồn hàng trăm file, không tra được |
| Mã bug mang **timestamp epoch giây** + **hậu tố TC ID**, không đánh số tuần tự | Timestamp đảm bảo nhiều người sinh bug song song không đụng mã nhau; hậu tố TC ID (VD `_TC004`) để nhìn tên file là biết ngay thuộc TC nào, không phải mở file hay tra bảng danh mục |
| Bug liên quan **nhiều TC cùng lúc** thì hậu tố lấy TC ID **đầu tiên/quan trọng nhất**, TC còn lại ghi ở cột "TC liên quan" trong danh mục | Hậu tố chỉ để nhận diện nhanh, không phải danh sách đầy đủ |
| **KHÔNG xoá file bug** — bug đóng thì đổi trạng thái trong file và trong danh mục | Lịch sử bug là bằng chứng chất lượng qua các đợt; xoá là mất dấu vết |
| **KHÔNG đổi hậu tố TC ID** sau khi đã bàn giao, kể cả khi bug hoá ra liên quan TC khác nữa | Đổi tên file là gãy mọi link đã trỏ tới (danh mục, execution report, TC doc) — thêm TC liên quan vào cột danh mục thay vì đổi tên |
| Bug **phải trỏ về TC ID và REQ ID** đang có hiệu lực | Đây là mắt xích cuối của chuỗi truy vết. Trỏ vào mã đã đổi nghĩa còn tệ hơn không trỏ — xem `BUG_login_1785678750_TC039` ở mục 1 |
| Retest thì **thêm dòng lên đầu** mục "Lịch sử retest", không sửa nội dung cũ | So sánh được giữa các lần retest |
| Evidence của bug nằm ở **`docs/executions/<module>/<nền-tảng>/run_*/evidence/`**, bug report chỉ **link tới** | Ảnh sinh ra từ lần chạy nào thì ở cùng lần chạy đó; nhân bản ảnh sang `docs/bugs/` là tạo hai nguồn sự thật |

> 🔒 Bug report thường nhúng hoặc link screenshot hệ thống thật — **chứa dữ liệu khách hàng**. Cùng mức nhạy cảm với `docs/executions/`; cân nhắc kỹ trước khi commit lên repo công khai.

---

## 4. Quy trình sử dụng

| Tình huống | Workflow | Ghi chú |
|---|---|---|
| TC FAIL → cần mở bug | `/create-bug-report` | Tự thu evidence, phân loại severity/priority, tuỳ chọn đẩy Jira |
| Dev báo đã fix → cần verify | `/retest-fixed-bugs` | Chấm FIXED/NOT_FIXED/PARTIAL, chạy regression quanh vùng fix, ghi **Lịch sử retest** vào file bug |
| Tổng hợp bug đang mở cho báo cáo release | `/generate-test-summary-report` | Đọc `docs/bugs/<module>/<nền-tảng>/BUG_*.md` để lấy Severity + Lịch sử retest |
| Lập Master Test Plan | `/generate-master-test-plan` | Đọc `docs/bugs/` để đối chiếu tiêu chí vào |

---

## 5. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 19-09-2026 | **Chuyển sang tầng nền tảng.** 6 bug `LOGIN` chuyển từ `bugs/login/` vào `bugs/login/web/` (tên file giữ nguyên); link tương đối bên trong và danh mục mục 1 đã sửa. Execution run `run_1787215085` được đưa vào `executions/login/web/` cùng đợt, nên evidence của 6 bug trỏ sang đường dẫn mới. Mục 3 cập nhật cấu trúc `<module>/<nền-tảng>/` |
| 19-09-2026 | Đóng `BUG_login_1787226515_TC018` — **không phải lỗi**: mốc 64 ký tự phần trước `@` là chuẩn RFC 5321, xác nhận bởi `CRM_LOGIN_TC_046-c` ở `run_1789759574`. Thêm trạng thái ⚪ *Đóng — không phải lỗi* |
| 20-08-2026 | `/create-bug-report` sau lần chạy `run_1787215085` (regression đầy đủ module Login): mở 5 bug mới (`TC_004`, `TC_016`, `TC_018-a`, `TC_028`, `TC_029`) và **rà lại xong** `BUG_login_1785678750` — sửa tham chiếu TC/REQ lệch nghĩa, bổ sung evidence mới, ghi Lịch sử retest xác nhận lỗi vẫn còn (`NOT_FIXED`). Tổng 6 bug đang mở |
| 20-08-2026 | **Chuyển `bug_reports/` ở gốc repo vào `docs/bugs/<module>/`.** Lý do: bug là mắt xích thứ tư của chuỗi truy vết, ba tầng còn lại đều nằm trong `docs/` và đều có danh mục — riêng bug đứng ngoài nên không có danh mục và **bị sót khi dọn dự án** (`rm -rf docs` không chạm tới nó). Chính lỗ hổng đó để lại `BUG_login_1785678750` mồ côi với tham chiếu TC/REQ đã lệch nghĩa. Khởi tạo file danh mục này |
