# Execution Report — Login / Xác thực · Bổ sung các TC chưa có kết quả

| Thông tin | Nội dung |
|---|---|
| Run ID | run_1789759574 |
| Nền tảng | `web` |
| Nguồn TC | [docs/testcases/login/web/test_cases_login_web.md](../../../../testcases/login/web/test_cases_login_web.md) — Nhóm H, I, K |
| Phạm vi | **13 TC** — 9 TC `CRM_LOGIN_TC_042` → `CRM_LOGIN_TC_050` (nhóm bổ sung 11-09-2026) + 4 TC còn thiếu kết quả `TC_014`, `TC_026`, `TC_034`, `TC_051`. Nhóm 042→050 nhóm TC bổ sung 11-09-2026, chưa chạy lần nào. `TC_001`→`TC_041` đã chạy ở [run_1787215085](../run_1787215085/execution_report.md). **`TC_026`, `TC_051`** (`@PersonalOnly` — QA tự chạy) ghi kết quả người dùng báo. **`TC_014`, `TC_034`** (BLOCKED ở run_1787215085) bổ sung sau buổi chạy — `TC_014` người dùng chạy tay, `TC_034` agent chạy (19-09-2026 02:48 → 02:51). Bỏ phần 🔧 (`@TechCheck`) |
| Môi trường | https://crm.anhtester.com — **Dùng chung** — auto-skip TC phá huỷ đang BẬT |
| Tài khoản | Admin (`admin@example.com`) — mật khẩu thật do **người dùng tự gõ** ở các bước cần đăng nhập thật; agent không nhập mật khẩu thật |
| Trình duyệt | Chrome (Playwright MCP, headed, viewport `1600×750`) · Edge · Firefox (TC_050) |
| Người thực hiện | Anh Tester (agent hỗ trợ — Claude Code) |
| Bắt đầu → Kết thúc | 19-09-2026 02:26 → 02:33 (~7 phút, gồm thời gian chờ người dùng gõ mật khẩu) |

## 1. Tổng kết

| Trạng thái | Số lượng | Tỷ lệ |
|---|---|---|
| ✅ PASS | 13 | 100% |
| ❌ FAIL | 0 | 0% |
| ⚠️ BLOCKED | 0 | 0% |
| ⏭️ SKIPPED | 0 | 0% |
| **Tổng** | **13** | 100% |

> **Pass rate (không tính SKIPPED):** 13/13 = 100%. `TC_014`, `TC_026`, `TC_044`, `TC_051` do **người dùng chạy tay** xác nhận PASS (agent không tạo được tài khoản test · `@PersonalOnly` do QA tự chạy · không được thao tác mật khẩu đã lưu). `TC_048-b` chấm PASS theo **số đo DOM** (300/300 ký tự) vì bước sao chép-đếm của TC không làm được trên trình duyệt thật.

## 2. Kết quả từng TC

| TC ID | Test Scenario | Kết quả | Bước fail | Ghi chú |
|---|---|---|---|---|
| CRM_LOGIN_TC_014 | Mật khẩu đúng nhưng sai kiểu chữ hoa/thường thì bị từ chối | ✅ PASS | — | **Người dùng chạy tay** và chốt PASS (19-09-2026) — agent không tạo được tài khoản test có mật khẩu chứa chữ cái. Không có ảnh evidence. Bổ sung cho kết quả BLOCKED ở [run_1787215085](../run_1787215085/execution_report.md) |
| CRM_LOGIN_TC_026 | Phiên hết hạn sau 1 giờ không thao tác | ✅ PASS | — | `@PersonalOnly` — **người dùng (QA) tự chạy** và báo PASS (19-09-2026). Không có ảnh evidence. Bổ sung cho kết quả SKIPPED ở [run_1787215085](../run_1787215085/execution_report.md) |
| CRM_LOGIN_TC_034 | Đăng xuất khi còn bộ đếm giờ đang chạy thì phải xác nhận trước | ✅ PASS | — | Dựng pre-condition: tạo task `Auto_LOGIN_TC034_1789760948` (ID 2060) rồi bật timer. 1. Thanh đầu trang: biểu tượng đồng hồ có huy hiệu **1**, danh sách hiện đúng task "Started at 19-09-2026 02:49". 2. Ảnh đại diện → `Logout`. 3–4. Bật lớp phủ xác nhận **toàn màn hình**, nội dung nằm giữa, nguyên văn `Started tasks timers found!` / `Are you sure you want to logout without stopping the timers?`, có nút `Logout` ([ảnh](evidence/TC_034_logout_confirm_dialog.png)). 5. URL vẫn `/admin/` — **chưa** đăng xuất. **Lần đầu kiểm chứng đầu-cuối** — trước đây chỉ có bằng chứng đọc mã hàm `logout()` (`@AssumptionBased`). Mật khẩu admin do người dùng tự gõ |
| CRM_LOGIN_TC_042 | Ô Mật khẩu che ký tự, dán được, không có nút hiện/ẩn | ✅ PASS | — | Gõ `Abc12345` → 8 dấu chấm ([ảnh](evidence/TC_042_password_masked.png)); không có con mắt / chữ Show·Hiện. Người dùng dán `ADMIN_PASSWORD` bằng Ctrl+V → ô nhận đủ 6 ký tự, vẫn che ([ảnh](evidence/TC_042_pasted.png)); Login → vào `https://crm.anhtester.com/admin/` (Dashboard) |
| CRM_LOGIN_TC_043 | Nút Login luôn bấm được, không tự khoá | ✅ PASS | — | Cả 3 biến thể `a`/`b`/`c`: nút nền xanh đậm, chữ trắng, không mờ; con trỏ hình bàn tay; bấm được, trang nạp lại có dải báo lỗi (`a`: 2 dải · `b`: `The Password field is required.` · `c`: `The Email Address field is required.`) — [ảnh `a`](evidence/TC_043_a_after_click.png) |
| CRM_LOGIN_TC_044 | Biểu mẫu không chặn tự điền / đề nghị lưu mật khẩu | ✅ PASS | — | **Người dùng chạy tay** trên Chrome thường (19-09-2026) — agent không được thao tác mật khẩu đã lưu, hộp `Lưu mật khẩu?` nằm ngoài trang. Người dùng báo PASS toàn bộ 7 bước, gồm bước 7 dọn mục đã lưu. Không có ảnh evidence |
| CRM_LOGIN_TC_045 | Phần trước @ dài đúng mốc 64 ký tự vẫn đúng định dạng | ✅ PASS | — | `a` (63 → tổng 75) và `b` (64 → tổng 76): ô giữ đủ ký tự, không vào Dashboard, đúng 1 dải `Invalid email or password` — [ảnh `b`](evidence/TC_045-b_message.png) |
| CRM_LOGIN_TC_046 | Phần trước @ vượt 64 ký tự bị chặn ở bước định dạng | ✅ PASS | — | `a` (65) · `b` (100) · `c` (250 + `@auto.test`): đúng 1 dải `The Email Address field must contain a valid email address.` — khác hẳn dải của TC_045 — [ảnh `a`](evidence/TC_046-a_message.png). Biến thể `c` = ca của `BUG_login_1787226515_TC018` → xác nhận lại đây là ranh giới RFC 5321 |
| CRM_LOGIN_TC_047 | Mật khẩu rất dài không làm hệ thống lỗi | ✅ PASS | — | `a` (`p×256`) và `b` (`p×1000`): trang nạp lại về đúng trang đăng nhập, không trang lỗi/trắng/treo; đúng 1 dải `Invalid email or password` — [ảnh `b`](evidence/TC_047-b_message.png). Bỏ phần 🔧 |
| CRM_LOGIN_TC_048 | Hai ô nhập không tự cắt ký tự khi dán chuỗi dài | ✅ PASS | — | `a` (ô Email): agent dán 300 ký tự → `Ctrl+A`/`Ctrl+C` → đếm được **300** ✅. `b` (ô Password): agent dán được nhưng trình duyệt **không cho sao chép ra từ ô mật khẩu** nên không làm được bước 3–4 theo đúng TC — người dùng thử copy tay cũng bị chặn (hành vi chuẩn của trình duyệt với mọi ô mật khẩu, **không** chứng minh được độ dài). **Căn cứ chấm PASS:** agent đo độ dài giá trị ô Password qua DOM = **đúng 300 ký tự** → ô không cắt bớt. Đây là kiểm chứng cấp kỹ thuật (🔧), không phải quan sát bằng mắt theo Test Steps. ⚠️ Bước 3–4 của biến thể `b` vẫn cần sửa lại trong TC. Bỏ phần 🔧 |
| CRM_LOGIN_TC_049 | Trang đăng nhập giữ đúng bố cục ở mọi kích thước đã chốt | ✅ PASS | — | Cả 5 biến thể: không cuộn ngang được, đủ 7 thành phần, không đè nhau, khung nằm giữa (lề trái = lề phải), nút `Login` rộng bằng ô nhập. Rộng ô nhập/nút: `a` 336 · `b` 336 · `c` 336 · `d` 336 · `e` 311 px. Ảnh: [a 1920×1080](evidence/TC_049-a_1920x1080.png) · [b 1600×750](evidence/TC_049-b_1600x750.png) · [c 1366×700](evidence/TC_049-c_1366x700.png) · [d 768×1024](evidence/TC_049-d_768x1024.png) · [e 375×700](evidence/TC_049-e_375x700.png) — **đã bổ sung evidence cho `a`, `c`, `d`** (`@NeedsVerify`). `a`, `d` lớn hơn cửa sổ headed nên chạy **headless** Chrome đúng kích thước; `b`, `c`, `e` chạy headed |
| CRM_LOGIN_TC_050 | Luồng đăng nhập chạy được trên các trình duyệt cam kết | ✅ PASS | — | `a` Chrome `153.0.8010.53` · `b` Edge `153.0.4234.32` (bản cài trên máy) · `c` Firefox `140.0.2` (bản Firefox đi kèm Playwright — **không** phải bản Firefox cài trên máy). Mỗi trình duyệt dùng ngữ cảnh sạch (tương đương ẩn danh). Cả 3: đủ 7 thành phần, không cuộn ngang, bố cục không vỡ → người dùng gõ mật khẩu thật → vào `https://crm.anhtester.com/admin/` (Dashboard) → đăng xuất → mật khẩu sai `SaiMatKhau_20260911` → đúng 1 dải `Invalid email or password`. Ảnh: [a](evidence/TC_050-a_wrong_password.png) · [b](evidence/TC_050-b_wrong_password.png) · [c](evidence/TC_050-c_wrong_password.png). Danh sách trình duyệt do **người dùng chốt 19-09-2026**: Chrome, Edge, Firefox |
| CRM_LOGIN_TC_051 | Đang thao tác thì phiên được gia hạn, không bị đăng xuất dù quá 1 giờ | ✅ PASS | — | `@PersonalOnly` — **người dùng (QA) tự chạy** và báo PASS (19-09-2026). Không có ảnh evidence. Lần chạy đầu tiên của TC này |

## 3. Chi tiết TC FAIL

Không có TC FAIL.

## 4. TC BLOCKED

Không có TC BLOCKED.

## 5. Dữ liệu đã tạo & dọn dẹp

| Dữ liệu | ID | Nơi tạo | Đã xoá? |
|---|---|---|---|
| Task `Auto_LOGIN_TC034_1789760948` (không public, chỉ giao Admin Example) | 2060 | `/admin/tasks` — dựng pre-condition TC_034 | ✅ Đã dừng timer rồi xoá task — tìm kiếm trả `No matching records found` |

> Đối chiếu timer đang chạy của admin: trước **0** → trong TC **1** → sau **0** ✅. Mọi phiên admin đã đăng xuất. Clipboard dùng cho TC_048 đã xoá trắng. Agent không lưu mật khẩu vào trình duyệt nào; mục người dùng lưu ở TC_044 đã được chính người dùng xoá (bước 7). Môi trường giữ nguyên trạng.

## 6. Đề xuất bước tiếp theo

- **TC_048-b** → ✅ đã xử lý 19-09-2026 sau buổi chạy: bỏ biến thể ô `Password` khỏi TC (quyết định người dùng), độ dài ô `Password` chuyển xuống 🔧. Kết quả `b` ở report này giữ nguyên làm lịch sử.
- **TC_049, TC_050** → đã có evidence cho `TC_049-a/c/d` và danh sách trình duyệt đã chốt → có thể gỡ `@NeedsVerify` qua `/review-testcases` (agent không sửa TC trong lúc chạy).
- **`BUG_login_1787226515_TC018`** → TC_046-c xác nhận lại lần nữa: phần trước `@` vượt 64 ký tự bị chặn ở bước định dạng, đúng chuẩn RFC 5321 → đề nghị đóng bug với trạng thái *không phải lỗi*.
- Gộp với [run_1787215085](../run_1787215085/execution_report.md) khi lập báo cáo tổng hợp: `/generate-test-summary-report`.
