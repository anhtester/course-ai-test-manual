# Đăng nhập (`LOGIN`) · Web — Checklist Smoke (14 mục · ~15 phút)

| Thông tin | Nội dung |
|---|---|
| **Loại** | Smoke — chỉ Vòng 1: màn hình dựng được, luồng sống còn không vỡ |
| **Nguồn** | TC-based — [`docs/testcases/login/web/test_cases_login_web.md`](../../../testcases/login/web/test_cases_login_web.md) (bám bộ chạy `@Smoke` ở [index](../../../testcases/login/TEST_CASES_LOGIN_SUMMARY.md)) · REQ: [`REQUIREMENTS_LOGIN_SUMMARY.md`](../../../requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md) |
| **Scope** | Trang đăng nhập `/admin/authentication` · đăng nhập Admin + Project Manager · bảo vệ URL nội bộ · mở trang Quên mật khẩu · đăng xuất |
| **Mã checklist** | `CL-smoke_20261009` — mã mục khi chạy = `CL-smoke_20261009-<số mục 2 chữ số>` (VD mục 3 → `CL-smoke_20261009-03`) |
| **Môi trường** | `https://crm.anhtester.com` — Google Chrome, viewport desktop · **môi trường dùng chung** |
| **Ngày lập** | 09-10-2026 |
| **Báo cáo lượt chạy** | [execution_report.html](../../../executions/login/web/run_1791553365/execution_report.html) · `run_1791553365` |

## Lưu ý trước khi chạy

- Tài khoản lấy từ `.env`: Admin = `EMAIL_ADMIN` / `PASSWORD_ADMIN` · Project Manager = `EMAIL_PM` / `PASSWORD_PM`. **Không** ghi giá trị vào checklist hay báo cáo
- 🔒 **Mật khẩu sai chỉ thử bằng tài khoản Project Manager** (mục 9) — không gửi mật khẩu sai bằng Admin, Admin là tài khoản cả lớp dùng chung
- 🔒 **Không** bấm `Confirm` ở trang Quên mật khẩu với email có thật — hệ thống gửi mail thật tới hộp thư dùng chung
- Mục 13: tài khoản Admin dùng chung, người khác có thể đang chạy bộ đếm giờ công việc. Bấm `Logout` mà hiện hộp thoại `Started tasks timers found!` → đánh **Blocked**, **không** dừng bộ đếm giờ của người khác
- Mục 1–5 và 10 chạy trong **cửa sổ ẩn danh** (chưa có phiên)

---

### Nhóm: Giao diện trang đăng nhập

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Mô tả (Fail / Blocked) | Priority | REQ ID | TC ID liên quan | Lượt chạy | Thời gian chạy |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ✅ Pass | Mở `https://crm.anhtester.com/admin/authentication` trong cửa sổ ẩn danh | URL giữ nguyên, tab ghi `Perfex CRM \| Anh Tester Demo - Login`, khối biểu mẫu có tiêu đề `Login` | — | P1 | REQ-LOGIN-01 | CRM_LOGIN_TC_001 | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 20:42 |
| 2 | ✅ Pass | Nhìn biểu mẫu khi trang vừa tải, chưa bấm gì | Đủ ô `Email Address`, ô `Password`, ô vuông `Remember me` đang rỗng, nút xanh `Login`, liên kết `Forgot Password?` dưới nút | — | P1 | REQ-LOGIN-02 | CRM_LOGIN_TC_002 | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 20:42 |
| 3 | ✅ Pass | Gõ chữ ngay khi trang vừa tải, không bấm chuột | Chữ hiện trong ô `Email Address` — con trỏ đã đặt sẵn ở ô này | — | P2 | REQ-LOGIN-03 | CRM_LOGIN_TC_002 | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 20:42 |
| 4 | ✅ Pass | Gõ `Abc12345` vào ô `Password` | Ô hiện 8 dấu chấm tròn, không hiện chữ | — | P2 | REQ-LOGIN-02 | CRM_LOGIN_TC_002 | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 20:42 |
| 5 | ✅ Pass | Bấm vào **chữ** `Remember me` (không bấm ô vuông) | Ô vuông chuyển từ rỗng sang tích ✔ | — | P3 | REQ-LOGIN-02 | CRM_LOGIN_TC_002 | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 20:42 |

### Nhóm: Đăng nhập

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Mô tả (Fail / Blocked) | Priority | REQ ID | TC ID liên quan | Lượt chạy | Thời gian chạy |
|---|---|---|---|---|---|---|---|---|---|
| 6 | ✅ Pass | Đăng nhập bằng `EMAIL_ADMIN` / `PASSWORD_ADMIN`, không tích `Remember me` | Dừng ở `https://crm.anhtester.com/admin/`, tab có chữ `Dashboard`, thấy menu trái và ảnh đại diện góc phải | — | P1 | REQ-LOGIN-06 | CRM_LOGIN_TC_005 | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 21:07 |
| 7 | ✅ Pass | Đăng nhập bằng `EMAIL_PM` / `PASSWORD_PM` | Vào `/admin/`, menu trái có 9 mục, **không** có `Reports` và `Subscriptions` | — | P1 | REQ-LOGIN-06 | CRM_LOGIN_TC_006 | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 21:08 |
| 8 | ✅ Pass | Bỏ trống cả hai ô, bấm `Login` | Vẫn ở trang đăng nhập, 2 dải đỏ trên xuống: `The Password field is required.` rồi `The Email Address field is required.` | — | P1 | REQ-LOGIN-10, REQ-LOGIN-11, REQ-LOGIN-12 | CRM_LOGIN_TC_011 (`a`) | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 20:42 |
| 9 | ✅ Pass | Đăng nhập bằng `EMAIL_PM` với mật khẩu `SaiMatKhau_20261009` | Vẫn ở trang đăng nhập, đúng 1 dải đỏ `Invalid email or password` | — | P1 | REQ-LOGIN-14 | CRM_LOGIN_TC_013 (`a`) | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 20:42 |

### Nhóm: Bảo vệ khu quản trị

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Mô tả (Fail / Blocked) | Priority | REQ ID | TC ID liên quan | Lượt chạy | Thời gian chạy |
|---|---|---|---|---|---|---|---|---|---|
| 10 | ✅ Pass | Chưa đăng nhập, gõ thẳng `https://crm.anhtester.com/admin/clients` | Bị đưa về `/admin/authentication`, hiện biểu mẫu đăng nhập, không thoáng thấy dữ liệu khách hàng | — | P1 | REQ-LOGIN-17 | CRM_LOGIN_TC_021 (`a`) | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 20:42 |

### Nhóm: Quên mật khẩu

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Mô tả (Fail / Blocked) | Priority | REQ ID | TC ID liên quan | Lượt chạy | Thời gian chạy |
|---|---|---|---|---|---|---|---|---|---|
| 11 | ✅ Pass | Bấm liên kết `Forgot Password?` trên trang đăng nhập — **không** bấm `Confirm` | Tới `/admin/authentication/forgot_password`, tiêu đề `Forgot Password`, 1 ô `Email Address`, nút xanh `Confirm` | — | P2 | REQ-LOGIN-23 | CRM_LOGIN_TC_027 | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 20:42 |

### Nhóm: Đăng xuất

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Mô tả (Fail / Blocked) | Priority | REQ ID | TC ID liên quan | Lượt chạy | Thời gian chạy |
|---|---|---|---|---|---|---|---|---|---|
| 12 | ✅ Pass | Đăng nhập Admin, bấm ảnh đại diện tròn góc trên bên phải | Menu mở: `My Profile` · `My Timesheets` · `Edit Profile` · `Language ▸` · `Logout` — `Logout` là mục cuối | — | P1 | REQ-LOGIN-29 | CRM_LOGIN_TC_032 | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 21:07 |
| 13 | ✅ Pass | Thanh đầu trang không có bộ đếm giờ nào, bấm `Logout` trong menu ảnh đại diện | Không hộp thoại nào bật lên, về `/admin/authentication` với hai ô rỗng | — | P1 | REQ-LOGIN-31, REQ-LOGIN-32 | CRM_LOGIN_TC_035, CRM_LOGIN_TC_036 (`a`) | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 21:07 |
| 14 | ✅ Pass | Ngay sau mục 13, gõ thẳng `/admin/clients`, rồi bấm Back của trình duyệt | Cả hai lần đều về `/admin/authentication`, không hiện dữ liệu khách hàng nào | — | P1 | REQ-LOGIN-32, REQ-LOGIN-33 | CRM_LOGIN_TC_036 (`a`) | [run_1791553365](../../../executions/login/web/run_1791553365/execution_report.html) | 09-10-2026 21:07 |

---

### Không áp dụng cho module này

| Component / nhóm trong bảng chuẩn | Lý do |
|---|---|
| Data Table / List | Module không có bảng hay danh sách dữ liệu |
| CRUD Lifecycle | Module không tạo / sửa / xoá bản ghi nghiệp vụ nào |
| Status Flow | Module không có luồng trạng thái |
| Modal / Dialog | Hộp thoại xác nhận khi còn bộ đếm giờ (`CRM_LOGIN_TC_034`) là nhánh Vòng 2 — Smoke chỉ rà nhánh **không** hỏi lại (mục 13) |
| Permission / Role (đầy đủ) | Smoke chỉ xác nhận hai vai trò vào được Dashboard (mục 6–7). Đối chiếu menu chi tiết, tài khoản khách hàng bị từ chối (`TC_019`, `TC_020`), đang có phiên mở lại trang đăng nhập (`TC_023`) thuộc Regression |
| Non-Functional — Race condition, Session hết hạn, Network, Localization, A11y bàn phím | Vòng 2–4, ngoài phạm vi Smoke — nằm ở `TC_010`, `TC_026`/`051`, `TC_040`/`041`, `TC_018`, `TC_038` |
| Validation chi tiết, CSRF, Remember me cookie, đặt lại mật khẩu | Vòng 2–3, cần DevTools hoặc gửi mail thật — để cho checklist Regression / bộ TC chi tiết |

> Ba TC đã biết chắc FAIL (`CRM_LOGIN_TC_016`, `028`, `039`) **không** nằm trong Smoke — không có mục nào ở đây được kỳ vọng FAIL.

### Ký nhận

| Môi trường | Build / Version | Người thực hiện | Ngày | Kết quả (Pass/Fail/Blocked) |
|---|---|---|---|---|
|  |  |  |  |  |
