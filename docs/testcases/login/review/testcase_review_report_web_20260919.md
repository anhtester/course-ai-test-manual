# Báo Cáo Review Test Cases — `LOGIN` · Web

## Tổng quan

| Mục | Giá trị |
|---|---|
| **Nguồn** | [web/test_cases_login_web.md](../web/test_cases_login_web.md) — 51 TC · index [TEST_CASES_LOGIN_SUMMARY.md](../TEST_CASES_LOGIN_SUMMARY.md) |
| **Requirements đối chiếu** | [REQUIREMENTS_LOGIN_SUMMARY.md](../../../requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md) — 43 REQ, 0 AMB treo |
| **Kết quả chạy đối chiếu** | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md) (20-08-2026) · [run_1789759574](../../../executions/login/web/run_1789759574/execution_report.md) (19-09-2026) |
| **Ngày review** | 19-09-2026 · Mode **FIX** |
| **Kết quả** | 🟢 46 tốt · 🟡 5 cần sửa · 🔴 0 viết lại |
| **Điểm trung bình** | **11.2 / 12** |

> 📌 Bộ TC viết tốt — lỗi chính **không** nằm ở cách viết mà ở **ghi chú đã cũ**: 10 TC còn mang `@NeedsVerify` / `⚠️ chưa có evidence` / `⚠️ chưa chạy được` trong khi hai lượt chạy đã kiểm chứng xong. Người chạy lượt sau đọc cảnh báo cũ sẽ tưởng TC chưa tin được. Riêng `TC_018-a` có **Expected sai** so với hành vi đã chốt.

## Chi tiết từng TC

Tiêu chí: ① Rõ ràng · ② Expected đo được · ③ Độc lập · ④ Test data · ⑤ Truy vết · ⑥ Trọng tâm

### TC 🟡 — cần sửa

| TC ID | Điểm | ① ② ③ ④ ⑤ ⑥ | Vấn đề chính (trích nguyên văn) | Đề xuất sửa |
|---|---|---|---|---|
| TC_014 | 8/12 | 2 2 1 0 2 1 | Test Data: *"Password: `ADMIN_PASSWORD` đã đảo hoa/thường"* — mật khẩu admin chỉ có số, **không có chữ cái để đảo**. Expected kèm *"⚠️ Chưa chạy được trên tài khoản demo hiện tại"* dù 19-09-2026 đã chạy PASS | Đổi tài khoản sang biến `.env` riêng: Email `TC014_EMAIL` · Password `TC014_PASSWORD` (tài khoản staff test có mật khẩu chứa chữ cái). Pre-Condition thêm: *"Đã có tài khoản staff test mật khẩu chứa chữ cái, khai trong `.env`"*. Gỡ dòng ⚠️ và tag `@NeedsVerify` |
| TC_018 | 8/12 | 2 1 2 2 2 1 | Biến thể `a` (email 260 ký tự) kỳ vọng *"Dải báo lỗi ghi `Invalid email or password`"* — **sai** với hành vi đã chốt: phần trước `@` > 64 ký tự trả `The Email Address field must contain a valid email address.` (`TC_046`, `BUG_login_1787226515_TC018` đã đóng *không phải lỗi*). Biến thể `a` còn **trùng** `TC_046-c` | **Bỏ biến thể `a`** (đã phủ bởi `TC_046-c`), TC giữ biến thể `b` (mật khẩu đa ngôn ngữ). Đổi Test Scenario → *"Mật khẩu chứa ký tự đa ngôn ngữ và emoji không làm hệ thống lỗi máy chủ"*. Gỡ ghi chú gộp hai trường ở Pre-Condition |
| TC_034 | 7/12 | 2 2 0 1 2 2 | Pre-Condition: *"có ít nhất 1 bộ đếm giờ công việc đang chạy"* — **không** hướng dẫn cách dựng, không nói dọn. Expected: *"⚠️ Bằng chứng hiện dừng ở mức đọc mã nguồn…"* — đã chạy thật 19-09-2026. Expected *"Hộp thoại xác nhận bật lên giữa màn hình"* — thực tế là **lớp phủ trắng toàn màn hình** | Thêm bước dựng: *"0a. Vào `Tasks` → `+ New Task`, Subject `Auto_LOGIN_TC034_<timestamp>`, bỏ tích `Public`, Save. 0b. Trong cửa sổ task bấm `Start Timer`. 0c. Mở `/admin/`"*. Thêm bước dọn: *"6. Đóng lớp phủ bằng `×` (không bấm `Logout`) → đồng hồ đầu trang → `Stop Timer` → `Save` → xoá task"*. Expected bước 3 → *"Bật lớp phủ xác nhận che toàn màn hình, nội dung nằm giữa"*. Gỡ `@AssumptionBased`, `@NeedsVerify`, dòng ⚠️. `Automation` No → **Yes** (đã dựng được bằng giao diện) |
| TC_039 | 9/12 | 1 2 2 2 2 2 | Expected: *"🐞 Nhiều khả năng FAIL. Một bug report cũ … TC ID và REQ ID trong đó **không khớp** bộ tài liệu hiện tại — cần đo lại"* — bug đã **rà lại xong** 20-08-2026 và `run_1787215085` xác nhận FAIL. Ghi chú cũ làm người chạy hiểu sai | Thay đoạn 🐞 bằng: *"🐞 **Hiện trạng: FAIL** — xác nhận ở `run_1787215085`, bug [BUG_login_1785678750_TC039](../../../bugs/login/web/BUG_login_1785678750_TC039.md) đang mở. FAIL là kết quả đúng → **KHÔNG** sửa TC theo hiện trạng"*. Gỡ `@NeedsVerify` |
| TC_050 | 9/12 | 2 2 2 1 2 2 | Expected: *"⚠️ Danh sách trình duyệt chưa được PO chốt"* · *"`b` và `c` chưa chạy lần nào"* — người dùng đã chốt **Chrome, Edge, Firefox** 19-09-2026 và cả 3 đã PASS | Gỡ 2 dòng ⚠️/📌 và `@NeedsVerify`. Test Data ghi rõ: *"`c` Firefox — bản Playwright đóng gói chấp nhận được khi chạy tự động"*. `Automation` Partial → **Yes** (Playwright chạy được cả 3) |

### TC 🟢 — giữ nguyên nội dung, chỉ dọn ghi chú đã cũ

| TC ID | Điểm | Ghi chú cũ cần gỡ | Căn cứ |
|---|---|---|---|
| TC_011 | 11/12 | Biến thể `d`: *"⚠️ Biến thể `d` chưa có evidence…"* + tag `@NeedsVerify` | `run_1787215085`: 4/4 biến thể PASS, `d` có evidence thật |
| TC_025 | 11/12 | *"Biến thể `b` chưa có evidence"* + `@NeedsVerify` | `run_1787215085`: `a`,`b` đều ra `419 Page Expired!` |
| TC_031 | 11/12 | *"⚠️ Biến thể `b` chưa có evidence"* + `@NeedsVerify` | `run_1787215085`: 2/2 biến thể lỗi 500 |
| TC_033 | 10/12 | *"⚠️ Chưa có evidence và chưa recon ở viewport mobile"* + `@NeedsVerify` · `Automation` Partial | `run_1787215085`: đã recon thật ở `375×812`, PASS |
| TC_040 | 11/12 | *"⚠️ Chưa có evidence cho tình huống này"* + `@NeedsVerify` | `run_1787215085`: PASS, giả lập offline |
| TC_041 | 11/12 | *"⚠️ Chưa có evidence cho tình huống mạng chậm"* + `@NeedsVerify` | `run_1787215085`: PASS, giả lập Slow 3G |
| TC_046 | 11/12 | *"⚠️ Biến thể `c` chính là ca đang mở bug … đề nghị xem lại bug đó"* · tag `@KnownBug` | Bug đã đóng *không phải lỗi* 19-09-2026 → đổi thành *"✅ Biến thể `c` từng là ca của bug … — đã đóng, không phải lỗi (19-09-2026)"*, gỡ `@KnownBug` |
| TC_049 | 10/12 | *"⚠️ Ba biến thể `a`, `c`, `d` chưa có ảnh evidence"* + `@NeedsVerify` | `run_1789759574`: đủ ảnh 5 biến thể, PASS |

> `TC_024` mục 🔧`2` (mã CSRF đổi sau F5) **vẫn chưa có evidence** — cả hai lượt chạy đều bỏ phần 🔧. **Giữ nguyên** `@NeedsVerify`.

### TC 🟢 còn lại — không cần sửa

| Điểm | TC ID |
|---|---|
| 12/12 | TC_001, 004, 005, 006, 007, 010, 012, 013, 015, 016, 017, 021, 022, 023, 026, 027, 028, 029, 030, 032, 036, 037, 038, 042, 043, 044, 045, 047, 048, 051 |
| 11/12 | TC_002, 003 (bảng kiểm nhiều mục — đúng độ hạt GỘP) · TC_019 · TC_035 |
| 10/12 | TC_008, 009, 024 (phần chính không chấm được mục tiêu — có lý do, đã tách xuống 🔧) · TC_020 (Pre-Condition *"nối tiếp `CRM_LOGIN_TC_019` bước 2"* → phụ thuộc TC khác. **Đề xuất nhẹ:** đổi thành *"Đăng nhập ở `https://crm.anhtester.com/login` bằng `CUSTOMER_EMAIL` / `CUSTOMER_PASSWORD` trong `.env`"* để chạy độc lập) |

> 📌 `TC_004` (logo) và `TC_029` (ô Email Quên mật khẩu không reset) đang FAIL, bug mở — theo nguyên tắc *TC là chuẩn*, **không** sửa Expected. Nếu PO quyết định đây là hành vi chấp nhận được thì đóng bug như `TC018` rồi mới sửa TC.

## Đối soát loại kiểm thử (4 vòng)

Chấm lại trên bảng hiện có ở index (11-09-2026) — **không** nhánh nào đổi trạng thái, chỉ một số ghi chú đã cũ.

| Vòng | Nhánh | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_002 (6 mục), TC_003 |
| 1 | Open form · Display · Input valid · Save · Verify data | ✅ | TC_001, 005, 006, 008, 009, 027 |
| 2 | UI Behavior | ✅ | TC_042, 043, 044 |
| 2 | Required | ✅ | TC_011 (4 biến thể), TC_028 |
| 2 | Validation | 🟡 **nông 1 mục** | Email đủ 8/8 mục áp dụng. **Password thiếu 1 mục: khoảng trắng đầu/cuối mật khẩu** — xem Gap #1 |
| 2 | Equivalence Partitioning | ✅ | TC_012, 013, 045, 046 |
| 2 | Boundary Value Analysis | ✅ | TC_045, 046, 047, 048 |
| 2 | Business Rule | ✅ | TC_013, 015, 019 |
| 2 | Decision Table | ➖ | Không có tổ hợp ≥ 3 điều kiện |
| 2 | State Transition | ➖ | 2 trạng thái (có/không phiên) |
| 2 | Dependency | ✅ | TC_034 (**nay đã chạy thật**), TC_037 |
| 2 | Use Case | ✅ | TC_005 → TC_036 |
| 2 | Save/Edit/Delete | ➖ | Không có bản ghi nghiệp vụ |
| 2 | Error Guessing | ✅ | TC_010, 016, 018, 036, 040 |
| 3 | Permission | ✅ | TC_006, 019–023 (Admin / PM / Khách hàng) |
| 3 | Security | ✅ | TC_017, 024, 025, 026, 036, 037, 039, 047, 051 |
| 3 | API · Database · Integration | ➖ | QA không có quyền — đội Dev xác minh (chốt 11-09-2026) |
| 3 | Logging / Audit | ➖ | Tài khoản demo bị chặn `Activity Log`. ⚠️ Người dùng đã có tài khoản super admin — **có thể rà lại nhánh này** (Gap #2) |
| 4 | Compatibility | ✅ | TC_050 — **đã chốt** Chrome/Edge/Firefox |
| 4 | Responsive | ✅ | TC_033, TC_049 |
| 4 | Accessibility | ✅ | TC_038 |
| 4 | Performance | ✅ mức thô | TC_041 |
| 4 | Regression | ➖ | Chưa bug nào **được fix** (bug `TC018` đóng vì *không phải lỗi*, không phải fix) — ghi chú index *"6 bug đang mở"* đã cũ → **5** |
| 4 | E2E | ➖ | Trọn một màn hình |

## Đối soát bảng loại field

| Field | Loại | Mục đã phủ | Mục thiếu |
|---|---|---|---|
| Email (Đăng nhập) | Email | Bắt buộc · khoảng trắng · hoa/thường · định dạng · biên độ dài · ký tự tấn công · dán chuỗi dài · email không tồn tại | — (`email đã tồn tại` ➖ không tạo tài khoản) |
| Password (Đăng nhập) | Password | Bắt buộc · che ký tự · dán được · không có nút hiện/ẩn · phân biệt hoa/thường · rất dài · đa ngôn ngữ · ký tự tấn công | **Khoảng trắng đầu/cuối** — có bị cắt như Email (`REQ-LOGIN-38`) hay giữ nguyên? |
| Remember me | Checkbox | Mặc định rỗng · nhãn ăn khớp ô · tích bằng `Space` · có/không tích | — |
| Email (Quên mật khẩu) | Email | Bắt buộc · định dạng · không tồn tại | Email **tồn tại** → ➖ `REQ-LOGIN-27` ngoài phạm vi (quyết định PO 18-08-2026) |

## Coverage Gaps

| # | Kịch bản thiếu | Vòng / Nhánh | Priority đề xuất | Ghi chú |
|---|---|---|---|---|
| 1 | Mật khẩu đúng nhưng thêm **1 dấu cách ở đầu hoặc cuối** → hệ thống từ chối hay chấp nhận? | V2 · Validation (Password) | Medium | **Chưa có REQ** quy định. Chạy thử trước để biết hành vi → mở `AMB-LOGIN-20` hỏi PO → mới viết TC. Không tự đặt kỳ vọng |
| 2 | Đăng nhập thành công / thất bại có được ghi vào `Activity Log` | V3 · Logging / Audit | Low | Trước đây chặn vì thiếu quyền; nay có tài khoản super admin. Cần recon trước |

## TC trùng lặp — đề xuất merge

- `TC_018-a` ≈ `TC_046-c` (cùng email 250 ký tự `a` + `@auto.test`) → **giữ `TC_046-c`**, bỏ `TC_018-a` (đã nêu ở mục 🟡).

## Số biến thể

51 TC · **70 biến thể** — không bất thường so với 43 REQ. Sau khi bỏ `TC_018-a` còn **69**.

## Kết luận & Khuyến nghị

1. **Sửa 5 TC 🟡** — ưu tiên `TC_018` (Expected sai, lần chạy sau sẽ FAIL giả) và `TC_034` (thiếu bước dựng dữ liệu).
2. **Dọn ghi chú cũ ở 8 TC 🟢** — gỡ `@NeedsVerify` / `⚠️ chưa có evidence` đã được hai lượt chạy giải quyết.
3. **Đồng bộ index:** bảng *Vùng chưa có evidence* (còn 1 dòng thật: `TC_024` 🔧`2`), bộ chạy `@NeedsVerify`, số biến thể, số bug ở nhánh Regression.
4. **Gap #1** — chạy thử khoảng trắng mật khẩu, hỏi PO, rồi mới thêm TC.
5. **Gap #2** — recon `Activity Log` bằng tài khoản super admin khi thuận tiện.
