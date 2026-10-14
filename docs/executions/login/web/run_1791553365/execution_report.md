# Execution Report — Login · Checklist Smoke

| Thông tin | Nội dung |
|---|---|
| Run ID | `run_1791553365` |
| Nền tảng | `web` |
| Loại nguồn | `Checklist smoke` · `CL-smoke_20261009` |
| Nguồn checklist | [`docs/checklists/login/web/checklist_smoke_20261009.md`](../../../../checklists/login/web/checklist_smoke_20261009.md) (bản HTML cùng thư mục) |
| Phạm vi | 14 mục (toàn bộ checklist) |
| Môi trường | `https://crm.anhtester.com` — Perfex CRM demo |
| Build / Version | Không có thông tin |
| Tài khoản | Mục 9: `projectmanager@example.com` (Project Manager), mật khẩu **sai cố ý** · Mục 6, 12, 13, 14: Admin do người dùng tự đăng nhập · Mục 7: Project Manager do người dùng tự đăng nhập |
| Người thực hiện | Agent hỗ trợ (Playwright MCP) · bước đăng nhập do người dùng làm |
| Bắt đầu → Kết thúc | 09-10-2026 20:42 → 21:08 (hai đợt: 20:42–20:43 chạy các mục không cần đăng nhập · 21:06–21:08 chạy sau khi người dùng đăng nhập) |
| Môi trường dùng chung? | Có — auto-skip TC phá huỷ đang BẬT (checklist không có mục phá huỷ) |

## 1. Tổng kết

| Trạng thái | Số lượng | Tỷ lệ |
|---|---|---|
| ✅ PASS | 14 | 100% |
| ❌ FAIL | 0 | 0% |
| ⚠️ BLOCKED | 0 | 0% |
| ⏭️ SKIPPED | 0 | 0% |
| **Tổng** | **14** | 100% |

> **Pass rate (không tính SKIPPED):** 14/14 = 100%. Đợt 1 có 9 mục PASS và 5 mục BLOCKED (cần đăng nhập thật); đợt 2 chạy nốt 5 mục đó, đều PASS.

## 2. Kết quả từng mục

| TC ID | Hạng mục kiểm tra | Kết quả | Priority | REQ ID | TC ID liên quan | Ghi chú |
|---|---|---|---|---|---|---|
| CL-smoke_20261009-01 | Mở trang đăng nhập (cửa sổ sạch) | ✅ PASS | P1 | REQ-LOGIN-01 | CRM_LOGIN_TC_001 | URL giữ nguyên, tab `Perfex CRM \| Anh Tester Demo - Login`, tiêu đề `Login` |
| CL-smoke_20261009-02 | Đủ thành phần, trạng thái mặc định | ✅ PASS | P1 | REQ-LOGIN-02 | CRM_LOGIN_TC_002 | Đủ 3 nhãn, ô vuông rỗng và không khoá, nút `Login` bấm được, 1 liên kết `Forgot Password?` |
| CL-smoke_20261009-03 | Gõ ngay khi trang vừa tải | ✅ PASS | P2 | REQ-LOGIN-03 | CRM_LOGIN_TC_002 | Bấm phím `a` không click chuột → ô Email nhận ký tự `a` |
| CL-smoke_20261009-04 | Ô Password che ký tự | ✅ PASS | P2 | REQ-LOGIN-02 | CRM_LOGIN_TC_002 | Gõ 8 ký tự, ô là loại mật khẩu (hiện chấm) |
| CL-smoke_20261009-05 | Bấm chữ `Remember me` | ✅ PASS | P3 | REQ-LOGIN-02 | CRM_LOGIN_TC_002 | Ô vuông chuyển sang tích |
| CL-smoke_20261009-06 | Đăng nhập Admin | ✅ PASS | P1 | REQ-LOGIN-06 | CRM_LOGIN_TC_005 | Vào `/admin/`, tab `Dashboard`, có menu trái và ảnh đại diện. Lệch bước: người dùng **có tích** `Remember me` (checklist ghi không tích), kết quả vẫn đúng kỳ vọng |
| CL-smoke_20261009-07 | Đăng nhập Project Manager | ✅ PASS | P1 | REQ-LOGIN-06 | CRM_LOGIN_TC_006 | Vào `/admin/`, menu trái đếm được 9 mục (Dashboard, Customers, Projects, Tasks, Contracts, Sales, Support, Leads, Utilities); không có `Reports`, `Subscriptions`, `Expenses`, `Estimate Request`, `Knowledge Base` |
| CL-smoke_20261009-08 | Bỏ trống cả hai ô | ✅ PASS | P1 | REQ-LOGIN-10, 11, 12 | CRM_LOGIN_TC_011 (a) | 2 dải đỏ đúng thứ tự: `The Password field is required.` rồi `The Email Address field is required.` · vẫn ở trang đăng nhập |
| CL-smoke_20261009-09 | PM + mật khẩu sai | ✅ PASS | P1 | REQ-LOGIN-14 | CRM_LOGIN_TC_013 (a) | 1 dải `Invalid email or password` · gửi sai đúng 1 lần |
| CL-smoke_20261009-10 | Mở `/admin/clients` khi chưa đăng nhập | ✅ PASS | P1 | REQ-LOGIN-17 | CRM_LOGIN_TC_021 (a) | Bị đưa về `/admin/authentication`, có biểu mẫu đăng nhập, trang không có bảng dữ liệu nào |
| CL-smoke_20261009-11 | Mở Quên mật khẩu (không bấm Confirm) | ✅ PASS | P2 | REQ-LOGIN-23 | CRM_LOGIN_TC_027 | Tới `/admin/authentication/forgot_password`, tiêu đề `Forgot Password`, 1 ô `Email Address`, nút `Confirm` nền xanh |
| CL-smoke_20261009-12 | Menu ảnh đại diện | ✅ PASS | P1 | REQ-LOGIN-29 | CRM_LOGIN_TC_032 | Menu 5 mục theo thứ tự `My Profile`, `My Timesheets`, `Edit Profile`, `Language`, `Logout`; `Logout` là mục cuối, chỉ có 1 lối Logout nhìn thấy |
| CL-smoke_20261009-13 | Logout khi không có bộ đếm giờ | ✅ PASS | P1 | REQ-LOGIN-31, 32 | CRM_LOGIN_TC_035, CRM_LOGIN_TC_036 (a) | Huy hiệu bộ đếm giờ = 0. Bấm `Logout` → về `/admin/authentication`, hai ô rỗng, không hộp thoại, không dải thông báo |
| CL-smoke_20261009-14 | Sau Logout: mở `/admin/clients` và Back | ✅ PASS | P1 | REQ-LOGIN-32, 33 | CRM_LOGIN_TC_036 (a) | Mở `/admin/clients` → về `/admin/authentication`; Back vẫn ở trang đăng nhập, không có dữ liệu khách hàng. Giới hạn: Back làm trong tab mới, chưa kiểm trường hợp `/admin/clients` đã nằm sẵn trong lịch sử trình duyệt (bước 4–5 của `TC_036-a`) |

Chưa kiểm: màu "nút xanh" của mục 2 chỉ đối chiếu theo cùng kiểu nút ở trang Quên mật khẩu (nền `rgb(37, 99, 235)`), không đo riêng ở trang đăng nhập.

## 3. Chi tiết mục FAIL

Không có mục FAIL.

## 4. Mục BLOCKED

Không còn mục BLOCKED. Đợt 1 có 5 mục bị chặn (6, 7, 12, 13, 14) vì cần đăng nhập thật; người dùng đã tự đăng nhập Admin và Project Manager, đợt 2 chạy nốt cả 5 mục.

## 5. Dữ liệu đã tạo & dọn dẹp

Không tạo dữ liệu nghiệp vụ nào. Không bấm `Confirm` ở trang Quên mật khẩu nên không có email nào được gửi. Mật khẩu sai chỉ gửi 1 lần (giới hạn ≤ 4). Phiên đăng nhập đã lưu vào `.auth/admin.json` và `.auth/pm.json` (nằm trong `.gitignore`, không ghi nội dung vào tài liệu); phiên Admin đã bị huỷ phía máy chủ sau mục 13.

## 6. Đề xuất bước tiếp theo

- Không có mục FAIL nên chưa cần `/create-bug-report`.
- Muốn phủ rộng hơn Smoke: chạy checklist Regression hoặc bộ TC chi tiết (`/execute-test-cases` với `docs/testcases/login/web/test_cases_login_web.md`).
- Chạy lại mục Logout ở lần sau cần đăng nhập Admin lại, vì phiên đã lưu bị huỷ sau mục 13.
