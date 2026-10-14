> 📘 **TÀI LIỆU MẪU — bám hệ thống THẬT của repo.** Đây là một Master Test Plan **đã điền kín và đã duyệt**, sinh bởi `/generate-master-test-plan` từ phiếu [`test_plan_crm_example.yaml`](test_plan_crm_example.yaml). Dùng để tham khảo **cách viết và độ chi tiết từng mục**.
>
> **Số liệu hệ thống là thật** — module, prefix, số REQ, số TC, số bug, mã `AMB`/`RISK` đều đọc từ `docs/` ngày **20-09-2026**, đối chiếu được từng con số. **Tên người (trừ Anh Tester), ngày tháng, công sức, ngân sách là giả định** để minh hoạ — **không** chép sang dự án thật.
>
> Plan thật nằm ở `docs/test-plans/test_plan_<slug>.md`, sinh từ phiếu `plans/master-test-plan/test_plan.config.yaml`. Plan mới lập thường còn ô `❓` — bản mẫu này là trạng thái **sau khi** đã trả lời hết.

---

# Master Test Plan — Perfex CRM · Release 2.0

## Kiểm soát tài liệu

### Thông tin tài liệu

| | |
|---|---|
| Mã tài liệu | `test_plan_crm_example` |
| Phiên bản tài liệu | v1.1 |
| Trạng thái | 🟩 Đã duyệt — v1.1 ngày 25-09-2026 |
| Mức phân loại | Nội bộ |
| Ngày lập | 21-09-2026 |
| Ngày hiệu lực | 25-09-2026 |
| Người lập | Anh Tester — QA Lead |
| Người review | Lê Thu Hà — Product Owner, review mục 1, 2, 4 · Nguyễn Hoàng Vũ — Dev Lead, review mục 5, 9 |
| Người phê duyệt | Anh Tester — QA Lead · Lê Thu Hà — Product Owner · Phạm Đức Long — Project Manager — chữ ký ở mục 11 |
| Hệ thống · Build | Perfex CRM (Anh Tester Demo) · `v2.0.0-rc1` |
| Phiếu đầu vào | `plans/master-test-plan/test_plan_crm_example.yaml` (bản mẫu — plan thật lưu phiếu ở `docs/test-plans/test_plan_<slug>.input.yaml`) |
| Cấu trúc tài liệu | Biên soạn **theo cấu trúc** ISO/IEC/IEEE 29119-3 — Test Plan · phủ đủ nội dung điển hình của ISTQB CTFL v4.0 mục 5.1.1 · ánh xạ ở mục 12 |

> **Trạng thái hợp lệ:** 🟨 Draft (đang soạn / còn ô treo) → 🟦 Chờ duyệt (đã review, không còn ô treo chặn) → 🟩 Đã duyệt (đủ chữ ký mục 11) → ⬛ Hết hiệu lực (có bản mới thay thế). Sửa nội dung bản 🟩 → quay về 🟨, tăng phiên bản.

> **Ô còn treo:** không còn. Tên mục 29119-3 ở mục 12.1 đã được đối chiếu với bản chuẩn công ty đang dùng ngày 24-09-2026 (Phạm Đức Long).

### Lịch sử thay đổi

| Phiên bản | Ngày | Người sửa | Mục thay đổi | Nội dung | Người duyệt |
|---|---|---|---|---|---|
| v1.1 | 24-09-2026 | Anh Tester | 4.2 · 5.1 · 7.1 · 7.3 · 8.1 | Theo ý kiến review: thêm **tiêu chí ra bổ sung #9** (bộ Smoke 3 module đã automate và chạy xanh trên CI) · thêm **Microsoft Edge** vào danh sách trình duyệt · dời *Môi trường sẵn sàng* từ 19-10 lên **12-10-2026** để có 5 ngày đệm trước khi thực thi (đóng R7 của v1.0) · thêm dòng **dự phòng 10%** vào ngân sách · thêm R9 về chi phí bảo trì suite UI. **Không** đổi phạm vi, nhân lực, ước lượng | Lê Thu Hà · Phạm Đức Long · Anh Tester — 25-09-2026 |
| v1.0 | 21-09-2026 | Anh Tester | Toàn bộ | Lập mới từ phiếu `test_plan_crm_example.yaml`. Dữ liệu hệ thống đọc từ `docs/requirements/README.md`, `docs/testcases/README.md`, `docs/bugs/README.md` ngày 20-09-2026 | — (được thay bằng v1.1 trước khi duyệt) |

---

## 1. Mục tiêu & Cơ sở kiểm thử

### 1.1 Mục tiêu kiểm thử

| # | Mục tiêu | Đo bằng |
|---|---|---|
| O1 | Xác nhận 3 vai trò `Admin` · `Project Manager` · `Customer` đăng nhập và bị chặn đúng ranh giới phân quyền trên môi trường test riêng | Tiêu chí exit #3, #4 — cặp `LOGIN` × Web · ma trận phân quyền của `CUST`, `PRJ` |
| O2 | Xác nhận vòng đời khách hàng và dự án hoạt động đúng đặc tả, dự án gắn đúng khách hàng | Tiêu chí exit #3, #4 — cặp `CUST` × Web, `PRJ` × Web · kiểm thử tích hợp cross-module (3.2) |
| O3 | Không còn bug Critical và Major mở ở cả 3 module trước ngày phát hành | Tiêu chí exit #1, #2 |
| O4 | Cả 3 cặp module × nền tảng đều có TC đã review và đã chạy ít nhất một lượt đầy đủ | Tiêu chí exit #7 |
| O5 | Có bộ Smoke tự động chạy được trên CI trước ngày bắt đầu thực thi | Tiêu chí exit bổ sung #9 · chỉ số Automation (3.6) |

> Mục tiêu do Anh Tester đề xuất 21-09-2026, Lê Thu Hà duyệt 25-09-2026. Mục tiêu nào không đo được bằng tiêu chí exit hay chỉ số ở 3.6 thì viết lại hoặc bỏ — O5 được giữ vì đã có tiêu chí bổ sung #9 chống lưng.

### 1.2 Cơ sở kiểm thử (Test basis)

| Tài liệu | Phiên bản / ngày cập nhật | Module | Ghi chú |
|---|---|---|---|
| `docs/requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md` | Nhật ký thay đổi 19-09-2026 | `LOGIN` | 44 REQ · 40 trong phạm vi TC · **0** AMB 🔴 treo |
| `docs/requirements/customers/REQUIREMENTS_CUSTOMERS_SUMMARY.md` | Nhật ký thay đổi 19-09-2026 | `CUST` | 84 REQ · **0** AMB 🔴 treo · 2 REQ 🟡 ghi kỳ vọng đúng mà hệ thống chưa đạt |
| `docs/requirements/projects/REQUIREMENTS_PROJECTS_SUMMARY.md` | Nhật ký thay đổi 14-08-2026 | `PRJ` | 104 REQ · **6 AMB 🔴 treo** (`AMB-PRJ-01` · `02` · `03` · `04` · `06` · `14`) |
| `docs/requirements/_discovery/system_map.md` | 14-08-2026 | Cả 3 | Phụ thuộc giữa module · Vùng loại khỏi phạm vi |
| `docs/testcases/login/TEST_CASES_LOGIN_SUMMARY.md` | 19-09-2026 | `LOGIN` | 51 TC · 71 biến thể · bảng ISO/IEC 25010 · bộ chạy đề xuất |
| `docs/testcases/customers/TEST_CASES_CUSTOMERS_SUMMARY.md` | 19-09-2026 | `CUST` | 129 TC · 155 biến thể · 5 part · bảng ISO/IEC 25010 |

> ⚠️ Tài liệu của cả 3 module được khảo sát trên **bản demo dùng chung** `crm.anhtester.com`, không phải môi trường test riêng của đợt này — xem rủi ro R2. Cơ sở kiểm thử đổi giữa đợt (ticket sửa yêu cầu) → cập nhật bằng `/update-requirements-from-ticket` rồi tăng phiên bản plan; TC viết theo cơ sở cũ là TC sai.

## 2. Phạm vi

### 2.1 Trong phạm vi

> Mỗi dòng là **một module × một nền tảng** — đơn vị báo cáo tiến độ theo dõi và báo cáo tổng hợp chấm tiêu chí exit #7. Perfex CRM chỉ có mặt **Web** trong `system_map.md`; không có app mobile và QA chưa có quyền gọi API (2.3).

| Module | Prefix | Nền tảng | Số REQ | Số TC hiện có | Đã từng chạy? | Ghi chú |
|---|---|---|---|---|---|---|
| Đăng nhập / Xác thực | `LOGIN` | Web | 44 · **40 trong phạm vi TC** | 51 (độ hạt GỘP · 71 biến thể) | ✅ 2 lần — `run_1787215085` (TC_001→041) · `run_1789759574` (13 TC còn lại, 100% PASS) | Kết quả cũ chạy trên **bản demo**, không tự áp sang môi trường mới · 5 bug đang mở phải retest |
| Khách hàng | `CUST` | Web | 84 | 129 (độ hạt GỘP · 155 biến thể · 5 part) | ❌ chưa lần nào | 2 TC (`TC_040`, `TC_041`) **thiết kế để FAIL** theo `REQ-CUST-42`, `43` — FAIL là đúng kỳ vọng, phải mở bug chứ không sửa TC |
| Dự án | `PRJ` | Web | 104 · 100 🟢 + 4 ⚪ **đưa lại** | **0** | ❌ | ⚠️ Phải sinh + review TC trước 16-10-2026 · còn **6 AMB 🔴** treo · module lớn nhất |

**REQ cần quyết định lại** — bị loại **chỉ vì** lần khảo sát chạy trên môi trường dùng chung; đợt này có **môi trường riêng**:

| REQ | Nội dung | Lý do bị loại trước đây | Quyết định theo phiếu |
|---|---|---|---|
| `REQ-CUST-82` | Chặn xoá khách hàng còn dữ liệu liên quan | Cần môi trường riêng mới thử xoá được | ✅ Đưa lại vào phạm vi |
| `REQ-PRJ-89` · `91` · `94` | CRUD mốc tiến độ / tệp / thảo luận của dự án | Không chạy CRUD trên môi trường dùng chung | ✅ Đưa lại vào phạm vi |
| `REQ-PRJ-104` | Nội dung tệp `Export project data` | Không tải tệp về từ môi trường dùng chung | ✅ Đưa lại vào phạm vi |
| `REQ-CUST-81` | Khách hàng `Inactive` bị loại khỏi mọi dropdown | **Không phải** lý do môi trường — cần rà 11 module tham chiếu tới khách hàng | ❌ Giữ ⚪ ngoài phạm vi — chờ các module đó được recon |

> Lê Thu Hà quyết định đưa lại 4 dòng đầu ngày 21-09-2026. 5 REQ này vẫn mang trạng thái ⚪ trong tài liệu requirements → phải **khảo sát bổ sung trên môi trường mới** bằng `/update-requirements-from-ticket` trước khi sinh TC cho chúng (rủi ro R4).

### 2.2 NGOÀI phạm vi (out of scope)

| Không kiểm thử | Lý do | Ai chịu trách nhiệm | Nguồn quyết định |
|---|---|---|---|
| 20 module CRM còn lại: `CONT` · `LEAD` · `TASK` · `EST` · `PROP` · `INV` · `PAY` · `CN` · `SUB` · `CTR` · `EXP` · `ITEM` · `TICK` · `ESTREQ` · `KB` · `REP` · `DASH` · `TODO` · `REM` · `PROF` | Chưa recon requirements — 20/23 module còn trắng tài liệu | Đợt sau | Lê Thu Hà — Product Owner, 21-09-2026 |
| Hệ thống **AnhTester Book Management** (namespace `_book-api/` — 9 module, API + app Android) | Hệ thống riêng, có đợt kiểm thử riêng | Đợt Book Release 1.0 | Lê Thu Hà — Product Owner, 21-09-2026 |
| **Cổng khách hàng** (khu front-end ngoài `/admin`) | Chưa chốt phạm vi. Hệ quả: `STORY-PRJ-03` (11 REQ về `Visible Tabs` và công tắc quyền khách hàng) chỉ kiểm được mức *biểu mẫu ghi nhận đúng*, **không** kiểm tác dụng thật phía khách hàng (`AMB-PRJ-14`). Riêng REQ *tài khoản khách hàng bị chặn ở khu `/admin`* **vẫn trong phạm vi** | Chưa xếp đợt — chờ PO chốt | Lê Thu Hà — Product Owner, 21-09-2026 |
| Khu **Quản trị hệ thống** (Setup: Settings · Staff · Roles · Departments · Taxes · Currencies · Payment Modes · Custom Fields · Email Templates) | Trả 403 với mọi tài khoản hiện có, kể cả `Project Manager`. Hệ quả: danh sách giá trị hợp lệ của nhiều dropdown chỉ suy được, không kiểm chứng được | Cần tài khoản quyền cao hơn — đợt sau | `system_map.md` — Vùng loại khỏi phạm vi (14-08-2026) |
| Calendar · Media · Bulk PDF Export | Loại khỏi phạm vi khảo sát từ đầu | — | `system_map.md` — Vùng loại khỏi phạm vi (14-08-2026) |
| `REQ-LOGIN-27` — gửi mail đặt lại mật khẩu tới email có thật | Không kiểm chứng luồng gửi mail thật (`AMB-LOGIN-04`) | — | Quyết định PO 18-08-2026 |
| `REQ-LOGIN-34` · `35` — cookie ghi nhớ không bị xoá / đọc được bằng JavaScript | Ghi nhận hiện trạng, không viết TC · rủi ro đã chấp nhận `RISK-LOGIN-02` | Đội Dev | Quyết định PO 18-08-2026 |
| `REQ-LOGIN-40` — tự đăng nhập bằng cookie ghi nhớ | PO xác nhận tính năng Ghi nhớ đăng nhập **không hoạt động** (`AMB-LOGIN-15`) | Đội Dev | Quyết định PO 18-08-2026 |
| `REQ-CUST-81` — khách hàng `Inactive` bị loại khỏi mọi dropdown | Cần rà 11 module tham chiếu tới khách hàng, 10 trong số đó chưa recon | Đợt sau | Bảng *REQ cần quyết định lại* (2.1) |
| **Kiểm thử tải · đo ngưỡng thời gian phản hồi** | Chưa mua công cụ tải. Chỉ kiểm mức thô: `CUST` `TC_128` (danh sách hơn 2.000 dòng không treo) · `LOGIN` `TC_041` (đường truyền chậm) | Đội Hạ tầng — đợt kiểm thử hiệu năng riêng tháng 01/2027 | Phạm Đức Long — PM, 21-09-2026 · điểm làm khác 12.2 |
| **Pentest · quét lỗ hổng** | Ngoài năng lực kiểm thử thủ công. QA vẫn kiểm phân quyền, CSRF, XSS/SQLi mức đầu vào ở Vòng 3 (3.2) | Đội Security / đối tác đánh giá độc lập | Bảng ISO/IEC 25010 của `LOGIN` và `CUST` — ô ➖ |
| **Rà soát WCAG đầy đủ** | Cần công cụ chuyên dụng và chuyên gia. Chỉ kiểm điều hướng bàn phím (`LOGIN` `TC_038` · `CUST` `TC_126`) | Đội Dev / chuyên gia a11y | Bảng ISO/IEC 25010 — ô ➖ |
| **Khả năng bảo trì (Maintainability)** | Đặc tính của mã nguồn, không quan sát được từ giao diện | Đội Dev — code review, phân tích tĩnh | Bảng ISO/IEC 25010 — ô ➖ |
| Trình duyệt **Safari** | Công ty không cam kết hỗ trợ | — | Bảng ISO/IEC 25010 của `CUST` — ô ➖ |
| Kiểm chứng tầng **API · CSDL · tích hợp · nhật ký hoạt động** | QA không có quyền: gọi API ❌ · truy vấn CSDL ❌ · kiểm tầng tích hợp ❌ · `Utilities → Activity Log` trả *Từ chối truy cập* với tài khoản `Admin` demo | **Đội Dev** xác minh và báo kết quả cho QA | `docs/requirements/README.md` — Năng lực kiểm thử của QA (11-09-2026) |

> Bảng ISO/IEC 25010 của `PRJ` chưa có vì module chưa sinh TC. Sinh xong → ô `➖` mới phải **bổ sung vào mục này và tăng phiên bản plan**.
>
> Mục này được thống nhất ngày 21-09-2026 và ký ở mục 11. Thay đổi phạm vi phải cập nhật tài liệu, tăng phiên bản và thông báo lại cho toàn bộ bên liên quan ở 2.4.

### 2.3 Giả định & Ràng buộc

| Loại | Nội dung | Ảnh hưởng tới kiểm thử | Nguồn |
|---|---|---|---|
| Giả định | Đợt này chạy trên **môi trường test riêng** do đội DEV dựng — **không** dùng chung | Được chạy TC phá huỷ dữ liệu (xoá, nhập CSV, CRUD tab dự án) → kiểm chứng được 5 REQ được đưa lại ở 2.1 | Phiếu `Môi trường` |
| Giả định | Build `v2.0.0-rc1` bàn giao đã qua smoke test của đội DEV | Sai giả định → kích hoạt tiêu chí tạm dừng 4.3 | Nguyễn Hoàng Vũ — Dev Lead cam kết 21-09-2026 |
| Giả định | Ước lượng 7.2 **không** tính công sức PO/BA làm UAT và thời gian Dev sửa bug | Hai phần này trễ không làm sai ước lượng QA nhưng vẫn đẩy lùi lịch 7.1 | Phiếu `Ước lượng` |
| Ràng buộc | Requirements và TC của cả 3 module được khảo sát trên **bản demo dùng chung** | Cấu hình, dữ liệu nền, phiên bản có thể khác → một số REQ có thể lệch khi chạy trên môi trường mới. Xem R2 | `docs/requirements/README.md` |
| Ràng buộc | QA **không** có quyền gọi API · truy vấn CSDL · kiểm tầng tích hợp · xem nhật ký hoạt động | Nhánh Vòng 3 tương ứng do đội Dev xác minh — **không phải vùng trắng**, xem 2.2 · automation chỉ đặt được ở tầng UI (3.7) | `docs/requirements/README.md` — Năng lực kiểm thử của QA |
| Ràng buộc | Tester có DevTools trình duyệt | Chạy được phần 🔧 của TC gắn `@TechCheck` — `LOGIN` 25 TC, trong đó `TC_025` và `TC_041` **bắt buộc** biết DevTools mới chạy được từ đầu | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| Ràng buộc | Còn **6 AMB 🔴** treo, toàn bộ thuộc `PRJ`: `AMB-PRJ-01` (28 ô ma trận phân quyền chưa kiểm chứng) · `02` (số đếm tổng quan lệch 7 dòng) · `03` (xoá dự án thành công nhưng chuyển tới trang lỗi) · `04` (Deadline sớm hơn Start Date vẫn lưu) · `06` (dự án 0 công việc hiển thị tiến độ 100%) · `14` (`Visible Tabs` tác động tới đâu) | TC của `PRJ` viết trong vùng này có thể phải sửa giữa đợt. `AMB-PRJ-03` khiến tester dễ **chấm FAIL nhầm** nếu chưa đọc tài liệu | `docs/requirements/README.md` — mục 3.1 |
| Ràng buộc | Ma trận phân quyền của `PRJ` còn **28 ô `❔`** — module được khảo sát trước khi có tài khoản `Project Manager` | Phải chạy lại phần phân quyền bằng tài khoản PM **trước** khi sinh TC Vòng 3 của `PRJ` | `docs/requirements/README.md` — mục 3.2 |
| Ràng buộc | Repo **chưa có** project automation — không có `package.json`, không có file CI, 0 script | Automation phải dựng framework Playwright + TypeScript từ đầu trong chính đợt này — xem R5 | Kiểm tra repo 20-09-2026 |
| Ràng buộc | Dữ liệu nền là **bản sao production đã che** | Ảnh evidence vẫn có thể lộ cấu trúc dữ liệu thật → áp quy tắc chụp đúng phạm vi đối tượng, không chụp full-page màn hình nghiệp vụ. Xem R8 | Phiếu `Dữ liệu kiểm thử` |

### 2.4 Các bên liên quan & Giao tiếp

| Bên | Vai trò trong đợt | Liên quan tới kiểm thử | Nhận gì | Tần suất | Kênh |
|---|---|---|---|---|---|
| Anh Tester | QA Lead · kiêm phụ trách automation | Lập plan, duyệt TC, lập báo cáo tiến độ và tổng hợp, dựng framework automation, cùng Dev Lead phân loại lỗi | Kế hoạch · báo cáo tiến độ · báo cáo tổng hợp · báo cáo lỗi | Hằng tuần thứ Sáu · cuối đợt | Jira · repo |
| Lê Thu Hà | Product Owner | Duyệt plan · trả lời AMB 🔴 · chốt phạm vi REQ · chủ trì UAT · cùng PM chấp nhận dừng kiểm thử (4.2) | Kế hoạch · báo cáo tiến độ · báo cáo tổng hợp | Hằng tuần thứ Sáu · cuối đợt | Email · Jira |
| Phạm Đức Long | Project Manager | Duyệt lịch và ngân sách · nhận khuyến nghị go/no-go · quyết định phát hành | Kế hoạch · báo cáo tiến độ · báo cáo tổng hợp | Hằng tuần thứ Sáu · cuối đợt | Email |
| Nguyễn Hoàng Vũ | Dev Lead | Dựng và duy trì môi trường test riêng · nạp dữ liệu nền đã che · sửa bug · xác minh nhánh Vòng 3 mà QA không có quyền · cùng QA Lead phân loại lỗi | Báo cáo lỗi · báo cáo tiến độ | Khi phát sinh · họp phân loại lỗi hằng ngày 9h30 | Jira |
| Hồng · Lan · Huệ | Kiểm thử viên | Viết, review chéo và chạy TC theo module phụ trách · mở bug | Kế hoạch · báo cáo tiến độ | Khi plan hoặc TC đổi phiên bản | Jira · repo |

**Mẫu tài liệu dùng trong đợt:**

| Tài liệu | Mẫu | Workflow sinh |
|---|---|---|
| Test case | Mẫu của `skills-rbt-manual-testing` | `/generate-testcases-manual-rbt` |
| Execution report | Mẫu của `skills-manual-test-executor` | `/execute-test-cases` |
| Bug report | Mẫu của `skills-bug-reporter` — đồng bộ Jira | `/create-bug-report` |
| Báo cáo tiến độ | Mẫu của `skills-test-progress-reporter` | `/generate-test-progress-report` |
| Báo cáo tổng hợp | Mẫu của `skills-test-summary-reporter` | `/generate-test-summary-report` |

> Phiếu `Mẫu tài liệu` → `Dùng mẫu có sẵn của repo: có` — không có mẫu riêng của khách.

## 3. Chiến lược kiểm thử (Test approach)

### 3.1 Cấp độ kiểm thử

| Cấp độ | Trong đợt? | Ai thực hiện | Tiêu chí vào/ra |
|---|---|---|---|
| Component (unit) | ❌ Không thuộc đợt | Đội Dev — ngoài phạm vi báo cáo của QA | Theo quy trình Dev |
| Component integration | ❌ Không thuộc đợt | Đội Dev — ngoài phạm vi báo cáo của QA | Theo quy trình Dev |
| System | ✅ | QA — Hồng · Lan · Huệ | Bộ chung mục 4 |
| System integration | ✅ | QA — luồng `LOGIN` → `CUST` → `PRJ` | Bộ chung mục 4 |
| Acceptance (UAT) | ✅ | PO/BA nội bộ, QA hỗ trợ chuẩn bị dữ liệu và ghi nhận lỗi | **Tiêu chí riêng:** 100% kịch bản nghiệp vụ chính PASS **và** không còn bug Critical/Major mở trên vùng UAT |

> Hai cấp độ Component không thuộc đợt và plan **không** có căn cứ về chất lượng đầu vào từ đó — chất lượng build chỉ được kiểm ở tiêu chí vào #9, #10.

### 3.2 Loại kiểm thử

| Loại test | Nền tảng | Có làm? | Cách làm | Ghi chú |
|---|---|---|---|---|
| Kiểm thử chức năng | Web | ✅ | Manual theo TC — `/execute-test-cases` | 3 module · `PRJ` phải sinh TC trước |
| Regression | Web | ✅ | `LOGIN`: bộ Regression đầy đủ 49 TC (~3 giờ 40 phút) · `CUST`: 129 TC theo 5 part · `PRJ`: xác định khi sinh TC | Cộng thêm suite tự động (3.7) |
| Retest bug | Web | ✅ | `/retest-fixed-bugs` — Critical/Major chạy **mode FULL**, Minor/Trivial mode RETEST | 5 bug `LOGIN` đang mở phải retest trên môi trường mới |
| Tích hợp cross-module | Web | ✅ | `/generate-cross-module-test-plan` | Luồng `LOGIN` → `CUST` → `PRJ` — dự án gắn với khách hàng · hơn 10 module tham chiếu tới `CUST` (`RISK-CUST-01`) |
| Automation | Web | ✅ | `/generate-automation-framework` dựng Playwright + TypeScript + Allure → `/generate-automation-web` từ TC đã review | Chi tiết 3.7 · repo chưa có project automation (R5) |
| Vòng 3 — Permission · Security mức đầu vào | Web | ✅ | Manual với 3 vai trò `Admin` · `Project Manager` · `Customer` — CSRF, XSS/SQLi ở ô nhập, xoá qua đường dẫn | `LOGIN` `TC_017`, `TC_019`→`TC_025` · `CUST` `TC_113`→`TC_124` |
| Vòng 3 — API · CSDL · tích hợp · nhật ký | — | ❌ QA không có quyền | Đội Dev xác minh và báo kết quả | Không phải vùng trắng — mục 2.2 |
| UAT | Web | ✅ | PO/BA nội bộ chạy theo kịch bản nghiệp vụ, QA chuẩn bị dữ liệu và ghi nhận lỗi | 07-12-2026 → 11-12-2026 |
| Phi chức năng | Web | 🟨 một phần | Tương thích · Khả dụng · Độ tin cậy ✅ · Hiệu năng · Bảo mật chuyên sâu · Khả năng truy cập ❌ | Chi tiết 3.2.1 |
| Kiểm thử chức năng | Mobile · API | ❌ | Ngoài phạm vi — Perfex CRM không có app mobile trong `system_map.md`; QA chưa có quyền gọi API | Phiếu `Cách chạy mobile` · `Cách chạy API` = ngoài phạm vi |

**Tỷ trọng manual/automation:** chạy manual toàn bộ TC trên web · automate bộ Smoke 3 module trước 19-10-2026 và bộ regression Priority High trước 30-11-2026 — chi tiết 3.7.

**Thứ tự ưu tiên thực thi** (theo rủi ro sản phẩm — 8.2): `LOGIN` → `CUST` → `PRJ`. Trong mọi bộ chạy, **nhóm B của `LOGIN` (đăng nhập thành công) chạy đầu tiên** — hỏng ở đây là chặn toàn bộ đợt (`RISK-LOGIN-06`). `CUST` chạy trước `PRJ` vì dự án gắn với khách hàng.

#### 3.2.1 Kiểm thử phi chức năng

> Đủ 6 dòng, kể cả loại không làm. Cột *TC đã có* đọc từ bảng ISO/IEC 25010 của `TEST_CASES_LOGIN_SUMMARY.md` và `TEST_CASES_CUSTOMERS_SUMMARY.md`; `PRJ` chưa có TC. TC lẻ đã có **không** tự biến một loại thành `có` — chúng chạy như TC chức năng trong bộ Regression.

| Loại | Có làm? | Mục tiêu đo | Ngưỡng chấp nhận | Cách làm · công cụ | Môi trường | Ai thực hiện | TC đã có |
|---|---|---|---|---|---|---|---|
| Hiệu năng | ❌ | — | — | Đợt kiểm thử tải riêng tháng 01/2027 — mục 2.2 · điểm làm khác 12.2 | — | Đội Hạ tầng | Mức thô: `CUST` `TC_128` (hơn 2.000 dòng) · `LOGIN` `TC_041` (đường truyền chậm) |
| Bảo mật | ❌ chuyên sâu | — | — | Pentest ngoài phạm vi — mục 2.2. QA vẫn kiểm phân quyền 3 vai trò, CSRF, XSS/SQLi ở Vòng 3 (3.2) | — | Đội Security / đối tác | `LOGIN` `TC_017`, `TC_019`→`TC_025`, `TC_036`, `TC_037`, `TC_039` · `CUST` `TC_113`→`TC_124` |
| Tương thích | ✅ | Bộ Smoke của 3 module chạy đúng trên Google Chrome, Mozilla Firefox, Microsoft Edge ở 5 kích thước màn hình đã khảo sát | 100% TC bộ Smoke PASS trên từng trình duyệt · **0** lỗi bố cục che mất nút hoặc thông báo lỗi | Chạy tay bộ Smoke trên 3 trình duyệt cài sẵn; dùng lại `LOGIN` `TC_049` (5 kích thước), `TC_050` (trình duyệt), `CUST` `TC_125`, `TC_127` | Môi trường test riêng | Hồng (`LOGIN`) · Lan (`CUST`) · Huệ (`PRJ`) | `LOGIN` `TC_049`, `TC_050` · `CUST` `TC_125`, `TC_127` |
| Khả năng truy cập | ❌ | — | — | Rà soát WCAG đầy đủ ngoài phạm vi — mục 2.2 | — | Đội Dev / chuyên gia a11y | `LOGIN` `TC_038` · `CUST` `TC_126` (điều hướng bàn phím) |
| Khả dụng | ✅ | Nhân viên kinh doanh tự tạo khách hàng và dự án gắn với khách hàng đó, không cần hướng dẫn | 3/3 người tham gia UAT hoàn tất kịch bản trong **≤ 8 phút** ở lần thử đầu · không ai phải hỏi lại cách làm | Quan sát trong tuần UAT, ghi vào biên bản UAT | Môi trường test riêng | Lê Thu Hà chủ trì · Lan ghi nhận | `LOGIN` `TC_011`, `TC_013` · `CUST` `TC_039`, `TC_084` (thông báo lỗi, trạng thái rỗng) |
| Độ tin cậy & phục hồi | ✅ | Không mất dữ liệu đang nhập khi phiên hết hạn, mất mạng giữa chừng, bấm đúp hoặc mở 2 tab | **0** bản ghi trùng và **0** lần mất dữ liệu đã nhập trong 10 lần thử mỗi tình huống | Chạy tay theo TC đã có; ngắt mạng bằng DevTools chế độ Offline | Môi trường test riêng | Hồng · Lan | `LOGIN` `TC_026` (hết hạn phiên, `@Slow` 65 phút), `TC_040` · `CUST` `TC_107`→`TC_111` |

> Ngưỡng của 3 loại `có` đã được xem xét cho bảng tiêu chí ra bổ sung (4.2); Phạm Đức Long chọn **không** đưa vào tiêu chí ra — kết quả ghi trong báo cáo tổng hợp dạng thông tin, không chặn release.
>
> ⚠️ `LOGIN` `TC_050` được viết khi danh sách trình duyệt chưa chốt. Phiếu đã chốt **3** trình duyệt → cập nhật `TC_050` bằng `/update-testcases-from-impact` trước ngày bắt đầu thực thi.

### 3.3 Kỹ thuật thiết kế test

> Liệt kê theo bộ TC **đã thực sự có** (`LOGIN`, `CUST`). Dòng của `LOGIN` đọc thẳng từ **bảng 4 vòng** trong `TEST_CASES_LOGIN_SUMMARY.md`; dòng của `CUST` **suy từ nội dung từng nhóm TC** vì tài liệu đó chưa có mục kỹ thuật riêng — ghi rõ như vậy để người duyệt biết mức chắc chắn của từng dòng. Kỹ thuật của `PRJ` bổ sung sau khi sinh TC.

| Kỹ thuật | Áp dụng ở đâu |
|---|---|
| Khung 4 vòng Smoke → Functional → Technical → Non-functional | Mọi bộ TC — `LOGIN` và `CUST` đã chấm đủ bảng 4 vòng |
| Phân vùng tương đương | `LOGIN` `TC_012`, `TC_013`, `TC_045`, `TC_046` · `CUST` `TC_043`→`TC_047` (ô `Company`) |
| Phân tích giá trị biên | `LOGIN` `TC_045`→`TC_048` (mốc 64 ký tự phần trước `@`) · `CUST` `TC_045`, `TC_046` (min/max) |
| Bảng quyết định | `CUST` `TC_113`→`TC_124` — ma trận phân quyền 3 vai trò × thao tác |
| Quy tắc nghiệp vụ | `LOGIN` `TC_013`, `TC_015`, `TC_019` · `CUST` `TC_129` (khoá đổi tiền tệ khi đã có giao dịch) |
| Kịch bản sử dụng | Chuỗi đăng nhập → tạo khách hàng → tạo dự án gắn khách hàng |
| Đoán lỗi (Error guessing) | `LOGIN` `TC_010`, `TC_016`, `TC_018`, `TC_036`, `TC_040` · `CUST` `TC_107`→`TC_111` (bấm đúp, Back, 2 tab, F5) |
| Kiểm thử dựa trên rủi ro (RBT) | `PRJ` — sẽ sinh bằng `/generate-testcases-manual-rbt` |
| Output-Class Coverage / Pairwise | Tổ hợp cross-module — `/generate-cross-module-test-plan` |

### 3.4 Mức độc lập của kiểm thử

| | |
|---|---|
| Mức độ | **Đội QA riêng trong tổ chức** |
| Thể hiện ở đâu | QA báo cáo cho Trưởng phòng Chất lượng, **không** báo cáo cho trưởng nhóm Dev · TC được review chéo giữa 3 tester — người viết TC không review TC của chính mình · bug do QA mở, Severity do QA đề xuất, Priority chốt ở họp phân loại có cả hai bên (9.4) |
| Giới hạn | QA Lead vừa lập plan, vừa phụ trách automation, vừa duyệt TC — việc tự duyệt giảm tính độc lập, nên plan có thêm chữ ký PO và PM (mục 11). UAT do PO/BA **nội bộ** thực hiện, không phải người dùng cuối hay khách hàng |

### 3.5 Retest & Regression

- Bug đã fix → `/retest-fixed-bugs`: **Critical/Major mode FULL** (verify + regression quanh vùng fix), Minor/Trivial mode RETEST
- Mỗi build mới → chạy lại **bộ Smoke** trước khi thực thi tiếp: `LOGIN` 9 TC (~12 phút) · `CUST` 16 TC (part 01) · `PRJ` xác định khi sinh TC
- **5 bug `LOGIN` đang mở** được xác nhận trên bản demo — phải retest lại toàn bộ trên môi trường mới, kết quả cũ **không** tự áp sang (R2 · R3)
- Regression trước release → bộ Regression đầy đủ của 3 module + suite tự động, chạy trong cửa sổ 30-11 → 04-12-2026

### 3.6 Chỉ số theo dõi

> Nhóm theo ISTQB CTFL v4.0 mục 5.3.1. `/generate-test-progress-report` báo cáo **đúng các chỉ số này** mỗi kỳ.

| Nhóm | Chỉ số | Nguồn | Dùng để |
|---|---|---|---|
| Tiến độ kiểm thử | TC đã viết / đã review · TC đã chạy / chưa chạy · PASS · FAIL · BLOCKED — tách theo từng cặp module × nền tảng | `docs/testcases/` · `execution_report.md` | Báo cáo tiến độ · tiêu chí exit #3, #4, #5, #7 |
| Tiến độ dự án | Công sức thực tế so với ước lượng 7.2 (E = 66,5 người-ngày) · mốc thực tế so với lịch 7.1 | Báo cáo tiến độ | Phát hiện trễ sớm |
| Lỗi | Bug mới / đã fix / đang mở theo Severity · regression phát sinh · **bug quá thời hạn xử lý 9.4** | `docs/bugs/` · Jira | Tiêu chí exit #1, #2 · mục trở ngại của báo cáo tiến độ |
| Độ phủ | REQ có TC · REQ mức Critical có TC PASS | `traceability_matrix.md` | Tiêu chí exit #6 |
| Rủi ro | Trạng thái từng rủi ro ở 8.1 | Báo cáo tiến độ | Kiểm soát rủi ro |
| Automation | Số TC đã automate · kết quả suite trên CI · số test chập chờn | `reports/` · GitHub Actions | Tiêu chí exit bổ sung #9 — **báo riêng**, không cộng vào pass rate manual |

### 3.7 Chiến lược tự động hoá

| | |
|---|---|
| Mục tiêu | Rút thời gian một vòng regression 3 module từ khoảng 2 ngày công xuống **dưới 1 giờ chạy máy**, và có Smoke tự động chặn build hỏng trước khi tester đụng vào |
| Hiện trạng | **Chưa có gì** — repo không có `package.json` / `pom.xml`, không có file CI, 0 script (kiểm tra 20-09-2026) |
| Tầng kiểm thử (kim tự tháp) | Đợt này QA **chỉ đặt được ở tầng UI**: cấp Component do Dev làm ngoài đợt (3.1), QA chưa có quyền gọi API (2.3) → kim tự tháp bị lộn ngược. Giữ suite nhỏ, chỉ phủ luồng chính; đã đề nghị Dev bổ sung test tầng API cho `CUST` và `PRJ` ở Release 2.1 — xem R6 và điểm làm khác 12.2 |
| Tiêu chí chọn TC để tự động | Cột `Automation` của tài liệu TC ghi `Yes` · Priority High · chạy lặp mỗi build · không cần mắt người đánh giá · dữ liệu sinh được bằng script |
| Framework · report | Playwright + TypeScript · Allure Report — toàn bộ output trong `reports/`, `.gitignore` đã chặn |
| Hệ thống CI | **GitHub Actions** |
| Người bảo trì | Anh Tester — **kiêm** vai trò QA Lead (R5) |

**Phạm vi:**

| Tự động | Không tự động | Lý do không tự động |
|---|---|---|
| Bộ Smoke `LOGIN` × Web — 9 TC | `LOGIN` `TC_026` (hết hạn phiên, 65 phút) · `TC_051` (`@PersonalOnly`, 70 phút) | Chạy quá lâu cho pipeline — giữ ở dạng QA tự chạy theo lịch riêng |
| Bộ Smoke `CUST` × Web — 16 TC (part 01) | TC gắn `@NeedsVerify` · `CUST` `TC_040`, `TC_041` (2 TC thiết kế để FAIL theo `REQ-CUST-42`, `43`) | Hành vi chưa chốt hoặc đang chờ fix — script sẽ khoá cứng kết quả sai thành kỳ vọng |
| Bộ Smoke `PRJ` × Web — xác định khi sinh TC | Kịch bản khả dụng trong UAT | Cần mắt người đánh giá, không có tiêu chí máy chấm được |
| TC Priority High của bộ regression 3 module có cột `Automation: Yes` | `LOGIN` `TC_034` (hộp thoại xác nhận đăng xuất) · `TC_044` | Cột `Automation` của tài liệu TC đã chấm `No` |

**Kích hoạt chạy:**

| Bộ chạy | Khi nào | Môi trường | Ai xem kết quả | Fail thì |
|---|---|---|---|---|
| Smoke 3 module | Mỗi build lên môi trường test | Môi trường test riêng | Anh Tester · Nguyễn Hoàng Vũ | **Chặn thực thi manual** — tiêu chí tạm dừng 4.3 |
| Regression Priority High | Hằng đêm | Môi trường test riêng | Anh Tester | Phân loại bằng `/run-and-fix-tests` — **không** sửa test để né bug |
| Regression đầy đủ đã automate | Trước phát hành — phải chạy xong **trước 04-12-2026** (hết cửa sổ hồi quy, 7.1) | Môi trường test riêng | Anh Tester · Phạm Đức Long | Kết quả vào báo cáo tổng hợp; bug mới mở như bug manual |

**Nguyên tắc:**
- Script chỉ tính là xong khi đạt Definition of Done của `CLAUDE.md` — PASS ổn định ≥ 2 lần liên tiếp, đủ Allure metadata (tên Tiếng Việt, Severity, Tags, TC ID) và screenshot cuối mọi test
- Kết quả automation **báo riêng**, không cộng vào pass rate manual của tiêu chí exit #3, #4
- Automation **chưa sẵn sàng không phải lý do dừng thực thi manual** (R5) — chỉ Smoke tự động **đã chạy được** mà fail mới chặn
- Test chập chờn → `/analyze-flaky-tests`, **không** chạy lại tới khi xanh · UI đổi → `/heal-locators` · yêu cầu đổi → `/update-automation-from-impact`

## 4. Tiêu chí Vào / Ra

### 4.1 Tiêu chí VÀO (Entry) — chưa đủ thì CHƯA bắt đầu test

> Nhóm theo ISTQB CTFL v4.0 mục 5.1.3. Trạng thái tại ngày duyệt **25-09-2026**. Chỉ giữ dòng của nền tảng Web. ⏳ = điều kiện tương lai **đã có người chịu và ngày cam kết** — không phải ô treo.

| # | Nhóm | Điều kiện | Trạng thái |
|---|---|---|---|
| 1 | Nguồn lực | Nhân lực ở mục 6 đã phân công đủ 3 cặp module × nền tảng | ✅ Hồng · Lan · Huệ · Anh Tester |
| 2 | Nguồn lực | Môi trường test riêng sẵn sàng, có dữ liệu nền đã che | ⏳ Nguyễn Hoàng Vũ cam kết **12-10-2026** |
| 3 | Nguồn lực | Tài khoản test đủ 3 vai trò `Admin` · `Project Manager` · `Customer` **trên môi trường mới** | ⏳ Nguyễn Hoàng Vũ cam kết **12-10-2026** — bàn giao qua `.env`, không ghi vào tài liệu |
| 4 | Nguồn lực | Công cụ sẵn sàng: Jira · project automation · CI | 🟨 Jira ✅ · automation và CI dựng trong đợt (3.7) — **không chặn** thực thi manual |
| 5 | Nguồn lực | Ngân sách đã duyệt | ✅ 14.190.000 ₫ — Phạm Đức Long duyệt 25-09-2026 (7.3) |
| 6 | Testware | Tài liệu requirements của 3 module trong phạm vi đã có | ✅ 3/3 |
| 7 | Testware | AMB 🔴 đã được giải đáp hoặc người duyệt chấp nhận treo | 🟨 `LOGIN` ✅ 0 · `CUST` ✅ 0 · `PRJ` còn **6** — Lê Thu Hà chấp nhận treo `AMB-PRJ-02`, `03`, `04`, `06` (ghi nhận là hiện trạng, TC viết theo hành vi thật + ghi chú), **phải trả lời trước 09-10-2026**: `AMB-PRJ-01` (ma trận phân quyền) và `AMB-PRJ-14` (`Visible Tabs`) |
| 8 | Testware | Test case đã viết và đã review — đủ 3 module | 🟨 2/3 — `LOGIN` 51 TC ✅ · `CUST` 129 TC ✅ · `PRJ` ⏳ **16-10-2026** (Huệ) |
| 9 | Chất lượng ban đầu | Build `v2.0.0-rc1` đã deploy lên môi trường test riêng và truy cập được | ⏳ **12-10-2026** |
| 10 | Chất lượng ban đầu | Smoke của Dev đã pass · Smoke `LOGIN` chạy PASS trên môi trường mới — xác nhận tài liệu khảo sát trên bản demo vẫn đúng | ⏳ **13-10-2026** → còn 4 ngày đệm trước ngày bắt đầu thực thi 19-10-2026 |

> ⚠️ Bắt đầu test khi chưa đạt tiêu chí vào là nguyên nhân số một khiến kết quả kiểm thử không dùng được — BLOCKED tràn lan, phải chạy lại từ đầu. Thiếu điều kiện nào thì báo QA Lead, **đừng bắt đầu rồi chữa sau**.

### 4.2 Tiêu chí RA (Exit)

> Bảng mặc định lấy **nguyên văn** từ `skills-test-summary-reporter`. `/generate-test-summary-report` chấm lại **cả bảng mặc định lẫn bảng bổ sung**.

| # | Tiêu chí | Ngưỡng |
|---|---|---|
| 1 | Bug **Critical** đang mở | **0** |
| 2 | Bug **Major** đang mở | 0, hoặc có workaround được PM chấp nhận bằng văn bản |
| 3 | Pass rate TC **Priority High** | **≥ 95%** |
| 4 | Pass rate toàn bộ TC đã chạy | ≥ 90% |
| 5 | Tỷ lệ **BLOCKED** | ≤ 5% |
| 6 | REQ mức Critical có ít nhất 1 TC **PASS** | 100% |
| 7 | Module trong phạm vi release đã có TC và đã chạy — tính trên **từng cặp module × nền tảng** trong phạm vi | 100% |

**Tiêu chí bổ sung của dự án:**

| # | Tiêu chí | Ngưỡng |
|---|---|---|
| 8 | Mọi lỗi tìm thấy đã được báo cáo và đã phân loại Severity/Priority | 100% — không còn TC FAIL nào chưa có bug tương ứng |
| 9 | Bộ Smoke của 3 module đã automate và chạy xanh trên CI | 3/3 module · 2 lần chạy liên tiếp xanh |

☐ Bộ mặc định  ☑ **Bộ mặc định + bổ sung** — chốt ngày 24-09-2026, hiệu lực từ khi plan được duyệt 25-09-2026  ☐ Bộ tiêu chí riêng của dự án

> ⚠️ Tại ngày duyệt plan, tiêu chí **#1 chưa đạt**: `BUG_login_1785678750_TC039` (🔴 Critical — trang đăng nhập phục vụ được qua HTTP thuần, không ép sang HTTPS, không có HSTS) đang mở, lần retest gần nhất `NOT_FIXED`. Lỗi phụ thuộc cấu hình máy chủ → phải retest ngay khi môi trường mới sẵn sàng (R3).
>
> ⚠️ **Dừng kiểm thử khi hết thời gian hoặc ngân sách** (ISTQB CTFL v4.0 mục 5.1.3): được coi là hợp lệ **chỉ khi** **Lê Thu Hà — Product Owner cùng Phạm Đức Long — Project Manager** đã xem xét và **chấp nhận bằng văn bản** rủi ro phát hành mà chưa đạt đủ tiêu chí. Báo cáo tổng hợp khi đó ghi rõ tiêu chí nào chưa đạt và ai chấp nhận — **không** chấm lại thành "Đạt".

### 4.3 Tiêu chí TẠM DỪNG (Suspension) & tiếp tục

**Tạm dừng kiểm thử khi:** môi trường sập > 4 giờ · build lỗi không đăng nhập được · > 30% TC BLOCKED cùng một nguyên nhân · phát hiện bug Critical chặn luồng chính · Smoke tự động fail sau khi nạp build mới.

**Tiếp tục khi:** nguyên nhân đã xử lý, có build mới, và đã chạy lại bộ Smoke PASS.

> Ngưỡng trên là đề xuất của agent — **đã xác nhận** theo phiếu (`Dùng ngưỡng tạm dừng đề xuất: có`). Người công bố tạm dừng và tiếp tục: Anh Tester — QA Lead, thông báo ngay cho PM và Dev Lead.

## 5. Môi trường, Dữ liệu & Công cụ

### 5.1 Môi trường kiểm thử

| | |
|---|---|
| Môi trường | Môi trường test riêng cho Release 2.0 — URL và tài khoản lưu ở `.env`, **không** ghi vào tài liệu này |
| Dùng chung với đội khác? | **Không** — được chạy TC phá huỷ (xoá khách hàng, nhập CSV, CRUD tab dự án) |
| Khác môi trường đã khảo sát? | **Có** — requirements và TC được khảo sát trên bản demo **dùng chung**; thuộc tính `Môi trường dùng chung: CÓ` trong `docs/requirements/README.md` mô tả bản demo đó, **không** mô tả môi trường đợt này. Rủi ro lệch tài liệu: R2 |
| Web — trình duyệt | **Google Chrome** (chính) · **Mozilla Firefox** · **Microsoft Edge**. Tài liệu requirements khảo sát trên Google Chrome, viewport desktop `1600×750` |
| Người dựng · ngày sẵn sàng | Đội DEV — Nguyễn Hoàng Vũ · **12-10-2026** (thứ Hai) |

### 5.2 Quản lý dữ liệu kiểm thử

| | |
|---|---|
| Dữ liệu nền | Bản sao production **đã che** — khoảng 2.000 khách hàng, 125 dự án đủ 5 trạng thái, 305 nhóm khách hàng, 3 tài khoản nhân sự cho 3 vai trò |
| Nguồn dữ liệu | Bản sao production đã che (dữ liệu nền) + tự sinh khi chạy (bản ghi do test tạo) |
| Tài khoản test | 3 vai trò `Admin` · `Project Manager` · `Customer` — **chỉ** tên vai trò ghi ở đây, mật khẩu ở `.env` |
| Dữ liệu thật của khách hàng | **Có → đã che**: script của đội DEV chạy trước khi nạp — tên, email, số điện thoại, địa chỉ thay bằng dữ liệu giả; giữ nguyên phân bố số tiền và ngày để báo cáo vẫn giống thật |
| Quy tắc sinh dữ liệu | Random + traceable theo `CLAUDE.md` mục 7 — nhìn bản ghi biết test nào tạo, VD `auto_createCustomer_20261019_A3F2@test.com` |
| Dọn dữ liệu sau khi chạy | **Có** — tester dọn cuối mỗi buổi chạy. **Chỉ** xoá bản ghi do test tạo, **chỉ** qua nút `Delete`: thao tác xoá của `CUST` và `PRJ` dùng GET, mở thẳng URL là xoá không hỏi lại (`RISK-CUST-06`, `RISK-PRJ-03`) |
| Làm mới dữ liệu nền | Trước mỗi vòng regression và sau mỗi lần nạp build mới — Nguyễn Hoàng Vũ |
| Người cung cấp | Đội DEV — Nguyễn Hoàng Vũ |

> 🔒 Dữ liệu đã che vẫn giữ nguyên cấu trúc nghiệp vụ. Evidence chụp **đúng phạm vi đối tượng cần chứng minh**, không chụp full-page màn hình danh sách kéo theo cả trang dữ liệu — xem R8.

### 5.3 Công cụ

| Mục đích | Công cụ | Ghi chú |
|---|---|---|
| Quản lý lỗi | Jira · file markdown trong `docs/bugs/` | **Nguồn chính khi lệch:** Jira cho trạng thái bug · repo cho execution report |
| Quản lý kết quả kiểm thử | Jira · file markdown trong `docs/executions/` | Execution report sinh bằng `/execute-test-cases` |
| Tự động hoá | Playwright + TypeScript · Allure Report | Chưa có project — dựng bằng `/generate-automation-framework` · chi tiết 3.7 |
| CI | **GitHub Actions** | Workflow chạy Smoke mỗi build, regression Priority High hằng đêm |

## 6. Nhân lực & Phân công

| Vai trò | Người | Module × nền tảng phụ trách | Ghi chú |
|---|---|---|---|
| QA Lead | Anh Tester | Cả 3 module | Lập plan, duyệt TC, báo cáo tiến độ và tổng hợp, cùng Dev Lead phân loại lỗi |
| Kiểm thử viên | Hồng | `LOGIN` × Web | Cập nhật 51 TC theo môi trường mới · retest 5 bug đang mở · chạy phần 🔧 của 25 TC `@TechCheck` |
| Kiểm thử viên | Lan | `CUST` × Web | Chạy lần đầu bộ 129 TC · theo dõi 2 TC thiết kế để FAIL (`TC_040`, `TC_041`) · ghi nhận UAT |
| Kiểm thử viên | Huệ | `PRJ` × Web | **Sinh + review TC trước 16-10-2026** — 104 REQ, module lớn nhất · chạy lại ma trận phân quyền bằng tài khoản PM trước khi sinh TC Vòng 3 |
| Tự động hoá | Anh Tester *(kiêm)* | `LOGIN` · `CUST` · `PRJ` × Web | Dựng framework, automate Smoke trước 19-10-2026 và regression Priority High trước 30-11-2026 — **kiêm cùng vai trò QA Lead** (R5) |

**Nhu cầu đào tạo:** buổi 2 giờ về DevTools cho Hồng — `LOGIN` có 25 TC gắn `@TechCheck`, riêng `TC_025` (sửa mã ẩn) và `TC_041` (giả lập mạng chậm) bắt buộc biết DevTools mới chạy được từ đầu. Anh Tester hướng dẫn, trước 16-10-2026.

**Nhu cầu tuyển thêm:** Không.

## 7. Lịch trình, Ước lượng & Ngân sách

### 7.1 Lịch trình & Mốc

| Mốc | Ngày | Điều kiện hoàn thành |
|---|---|---|
| Duyệt plan | **25-09-2026** (thứ Sáu) | Mục 11 đủ 3 chữ ký |
| Trả lời `AMB-PRJ-01` · `AMB-PRJ-14` | 09-10-2026 (thứ Sáu) | Lê Thu Hà trả lời · Huệ chạy lại ma trận phân quyền bằng tài khoản PM |
| Hoàn tất viết và review TC `PRJ` | **16-10-2026** (thứ Sáu) | TC đã review chéo qua `/review-testcases` · đạt tiêu chí vào #8 |
| Môi trường test sẵn sàng | **12-10-2026** (thứ Hai) | Đạt tiêu chí vào #2, #3, #9 |
| Smoke xác nhận môi trường | 13-10-2026 (thứ Ba) | Đạt tiêu chí vào #10 — còn 4 ngày đệm trước khi thực thi |
| Bắt đầu thực thi | **19-10-2026** (thứ Hai) | Đạt **toàn bộ** tiêu chí vào 4.1 |
| Báo cáo tiến độ | **Hằng tuần — thứ Sáu** | `/generate-test-progress-report` — slug `crm_example` |
| Đóng băng mã nguồn | **27-11-2026** (thứ Sáu) | 30 ngày làm việc thực thi tính từ 19-10-2026 |
| Hồi quy | **30-11-2026** (thứ Hai) → **04-12-2026** (thứ Sáu) | 5 ngày làm việc · bộ Regression 3 module + suite tự động |
| Nghiệm thu (UAT) | **07-12-2026** (thứ Hai) → **11-12-2026** (thứ Sáu) | PO/BA nội bộ ký biên bản UAT · đạt tiêu chí riêng ở 3.1 |
| Báo cáo tổng hợp | **15-12-2026** (thứ Ba) | `/generate-test-summary-report` — slug `crm_example` · có khuyến nghị go/no-go |
| Phát hành | **18-12-2026** (thứ Sáu) | Phạm Đức Long quyết định trên cơ sở khuyến nghị go/no-go |

> Mọi mốc rơi vào ngày làm việc. Môi trường sẵn sàng **trước** ngày bắt đầu thực thi 5 ngày làm việc — đây là thay đổi của v1.1 và là lý do R7 của v1.0 được đóng.

### 7.2 Ước lượng công sức

| | |
|---|---|
| Kỹ thuật (ISTQB CTFL v4.0 mục 5.1.4) | **Ước lượng ba điểm** (Three-point estimation) |
| Giả định của ước lượng | `LOGIN` và `CUST` đã có TC nên chỉ cập nhật; công sức viết mới dồn vào `PRJ` (104 REQ) · thực thi tính **1 lượt đầy đủ + 3 vòng theo build** · **không** tính công sức PO/BA làm UAT · **không** tính thời gian Dev sửa bug |

Công thức: **E = (a + 4m + b) / 6** · **SD = (b − a) / 6**. E tổng = cộng E các hạng mục · SD tổng = cộng SD các hạng mục (cộng thẳng — cách thận trọng, cho khoảng rộng hơn cộng theo căn bậc hai). Đơn vị người-ngày, làm tròn 1 chữ số thập phân.

| Hạng mục | a (lạc quan) | m (khả năng nhất) | b (bi quan) | E = (a+4m+b)/6 | SD = (b−a)/6 |
|---|---|---|---|---|---|
| Viết & review TC cho `PRJ` × Web (104 REQ) | 10 | 13 | 18 | 13,3 | 1,3 |
| Cập nhật TC `LOGIN` · `CUST` theo AMB đã chốt và môi trường mới | 2 | 3 | 5 | 3,2 | 0,5 |
| Thực thi manual 3 module × Web | 18 | 24 | 34 | 24,7 | 2,7 |
| Retest bug và regression | 5 | 7 | 11 | 7,3 | 1,0 |
| Automation — dựng framework, script Smoke và regression | 8 | 12 | 20 | 12,7 | 2,0 |
| Hỗ trợ UAT, lập báo cáo và quản lý đợt | 4 | 5 | 8 | 5,3 | 0,7 |
| **Tổng** | 47 | 64 | 96 | **66,5 người-ngày** | **±8,2** |

**Đối chiếu năng lực:**

| Giai đoạn | Người | Ngày làm việc | Năng lực | Ước lượng E | Kết luận |
|---|---|---|---|---|---|
| Viết & review TC — 28-09 → 16-10-2026 | Huệ (chính) · Hồng · Lan (cập nhật TC của mình + review chéo) | 15 | 45 người-ngày | 13,3 + 3,2 = 16,5 | Đủ về tổng, nhưng **riêng Huệ gánh 13,3 trong 15 ngày** — không còn đệm, xem R1 |
| Thực thi — 19-10 → 27-11-2026 | Hồng · Lan · Huệ | 30 | 90 người-ngày | 24,7 + 7,3 = 32,0 | Đủ, còn đệm cho các vòng retest phát sinh |
| Automation + quản lý đợt — 28-09 → 27-11-2026 | Anh Tester (dành 50% thời gian cho đợt) | 45 × 50% | 22,5 người-ngày | 12,7 + 5,3 = 18,0 | Đủ **sát** — chỉ còn 4,5 người-ngày đệm, trong khi riêng nhánh bi quan của automation đã là 20. Xem R5 |

**Dữ liệu sẵn có trong repo để đối chiếu ước lượng:**

| Dữ liệu | Giá trị | Nguồn |
|---|---|---|
| Bộ Smoke `LOGIN` | 9 TC · ~12 phút | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| Bộ Regression đầy đủ `LOGIN` (trừ `@Slow`) | 49 TC · ~3 giờ 40 phút | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| Phần 🔧 của TC `@TechCheck` | 25 TC · ~55 phút | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| TC chạy riêng (`@Slow` · `@PersonalOnly`) | `TC_026` ~65 phút · `TC_051` ~70 phút | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| Quy mô `CUST` | 129 TC · 155 biến thể · 5 part · Smoke 16 TC | `TEST_CASES_CUSTOMERS_SUMMARY.md` |
| REQ cần viết TC | `PRJ` 104 (gồm 4 REQ được đưa lại) | `docs/requirements/README.md` |
| Lần chạy `LOGIN` gần nhất | 13 TC trong ~7 phút (không gồm phần 🔧) | `run_1789759574/execution_report.md` |

### 7.3 Ngân sách

| Hạng mục | Số tiền | Ghi chú |
|---|---|---|
| Giấy phép Jira — 5 người × 3 tháng | 4.500.000 ₫ | QA 4 + Dev Lead 1 |
| Máy ảo dựng môi trường test riêng — 3 tháng | 5.400.000 ₫ | Đội DEV vận hành |
| Dịch vụ chạy trình duyệt đám mây cho tuần kiểm tương thích | 3.000.000 ₫ | Dự phòng khi máy tester không đủ cấu hình chạy 3 trình duyệt song song |
| Dự phòng 10% | 1.290.000 ₫ | Thêm ở v1.1 theo yêu cầu của PM |
| **Tổng** | **14.190.000 ₫** | Phạm Đức Long duyệt 25-09-2026 |

## 8. Rủi ro

### 8.1 Rủi ro DỰ ÁN & biện pháp

> Rủi ro **của việc kiểm thử** — nhóm theo ISTQB CTFL v4.0 mục 5.2.2: tổ chức · con người · kỹ thuật · nhà cung cấp. Khả năng / Ảnh hưởng do QA Lead đề xuất, đã được xác nhận khi duyệt plan. `/generate-test-progress-report` theo dõi trạng thái từng dòng mỗi kỳ.

| # | Nhóm | Rủi ro | Khả năng | Ảnh hưởng | Biện pháp | Nguồn phát hiện |
|---|---|---|---|---|---|---|
| R1 | Con người | **Một mình Huệ viết TC cho `PRJ` (104 REQ) trong 15 ngày làm việc** — ước lượng 13,3 người-ngày, gần hết năng lực cá nhân, lại phải chạy lại ma trận phân quyền trước | Cao | Trễ mốc 16-10-2026 → trễ ngày bắt đầu, hoặc chạy trên TC chưa review | Hồng và Lan review chéo theo từng batch thay vì dồn cuối · ưu tiên sinh TC Vòng 1–2 trước, Vòng 3–4 sau · không kịp thì chạy TC Priority High trước và ghi nợ kiểm thử trong báo cáo tiến độ | Mục 7.2 — đối chiếu năng lực |
| R2 | Kỹ thuật | Requirements và TC khảo sát trên **bản demo dùng chung**, đợt này chạy trên **môi trường riêng** — cấu hình, dữ liệu, phiên bản có thể khác | Trung bình | TC FAIL do tài liệu lệch chứ không do lỗi → mở bug sai, tốn công cả hai đội | Chạy Smoke `LOGIN` ngay khi môi trường sẵn sàng 12-10-2026 (tiêu chí vào #10); lệch thì cập nhật requirements bằng `/update-requirements-from-ticket` **trước khi** mở bug | `docs/requirements/README.md` |
| R3 | Kỹ thuật | Bug Critical `TC039` (HTTP không ép sang HTTPS, không HSTS) đang mở, lần retest gần nhất `NOT_FIXED` | Cao | Tiêu chí exit #1 không đạt → khuyến nghị không nên phát hành | Retest trên môi trường mới ngay ngày 13-10-2026; báo Dev Lead xử lý cấu hình máy chủ trong tuần đầu; theo dõi ở họp phân loại lỗi hằng ngày | `docs/bugs/README.md` |
| R4 | Kỹ thuật | 5 REQ được đưa lại vẫn ở trạng thái ⚪, chưa có hành vi đã kiểm chứng; môi trường chỉ sẵn sàng 12-10-2026 — **sau** khi Huệ bắt đầu viết TC | Trung bình | TC cho 5 REQ viết theo suy đoán, phải sửa lại sau khi khảo sát | Khảo sát bổ sung bằng `/update-requirements-from-ticket` ngay 12-10-2026; TC của 5 REQ này được phép hoàn tất sau 16-10-2026 và ghi rõ trong báo cáo tiến độ | Phiếu `Phạm vi` · `docs/requirements/README.md` |
| R5 | Con người | Repo chưa có project automation — phải dựng framework từ đầu, người phụ trách là **QA Lead kiêm nhiệm**; năng lực chỉ còn 4,5 người-ngày đệm so với ước lượng | Cao | Việc quản lý đợt chiếm mất thời gian dựng automation → tiêu chí bổ sung #9 không đạt, regression tự động không kịp cho cửa sổ hồi quy 30-11 → 04-12 | Automation **không** chặn manual · ưu tiên Smoke `LOGIN` xong trước 12-10-2026 · tới báo cáo tiến độ thứ Sáu đầu tiên sau 19-10-2026 mà Smoke tự động chưa chạy được trên CI → PM cân nhắc rút tiêu chí #9 hoặc bổ sung người | Phiếu `Nhân lực` · kiểm tra repo 20-09-2026 |
| R6 | Kỹ thuật | Automation của QA chỉ đặt được ở **tầng UI** — cấp Component ngoài đợt, QA chưa có quyền gọi API; kim tự tháp kiểm thử bị lộn ngược | Cao | Suite UI chạy chậm, dễ vỡ khi giao diện đổi; chi phí bảo trì dồn về sau | Giữ suite nhỏ: chỉ Smoke và TC Priority High có `Automation: Yes` · đã đề nghị cấp quyền gọi API cho QA và bổ sung test tầng API ở Release 2.1 — ghi ở điểm làm khác 12.2 | Mục 2.3 · 3.1 · 3.7 |
| R7 | Tổ chức | `PRJ` còn 6 AMB 🔴, trong đó `AMB-PRJ-03` khiến **xoá dự án thành công vẫn chuyển tới trang lỗi** | Trung bình | Tester chấm **FAIL nhầm**, mở bug trùng với hiện trạng đã biết | Huệ đọc mục Ambiguity trước khi chạy; TC của vùng này ghi rõ hành vi hiện tại trong phần kỳ vọng; PO trả lời `AMB-PRJ-01` và `14` trước 09-10-2026 | `docs/requirements/README.md` — mục 3.1 |
| R8 | Tổ chức | Dữ liệu nền là bản sao production đã che — evidence vẫn có thể lộ cấu trúc dữ liệu và giá trị nghiệp vụ thật | Thấp | Ảnh chụp bị commit vào repo, khó gỡ khỏi lịch sử git | Chụp **đúng phạm vi đối tượng cần chứng minh**, không full-page màn hình danh sách · QA Lead rà evidence trước khi commit · `.gitignore` đã chặn `reports/` | Phiếu `Dữ liệu kiểm thử` · `CLAUDE.md` mục 6b |
| R9 | Kỹ thuật | Suite UI dựng trong đợt sẽ phải bảo trì ngay trong đợt khi giao diện đổi theo bug fix | Trung bình | Thời gian sửa locator ăn vào thời gian viết script mới | `/heal-locators` chạy sau mỗi build lớn · locator lấy từ DOM thật, ưu tiên semantic theo `locator_strategy.md` · không đưa TC `@NeedsVerify` vào suite | Thêm ở v1.1 theo ý kiến review của Dev Lead |
| R10 | Tổ chức | Dùng song song Jira và file markdown — hai nguồn có thể lệch | Thấp | Báo cáo tổng hợp lấy số sai, bug trùng hoặc sót | Đã chốt nguồn chính: **Jira cho trạng thái bug · repo cho execution report** (5.3); bug đẩy Jira ngay khi tạo bằng `/create-bug-report` | Phiếu `Công cụ` |

### 8.2 Rủi ro SẢN PHẨM — tóm tắt

> **Nguồn chính** là mục `RISK-<MODULE>-xx` trong tài liệu requirements và đánh giá RBT của tài liệu test case từng module — bảng này chỉ tóm tắt rủi ro đang hiệu lực để người duyệt plan thấy ngay. Sửa ở tài liệu nguồn, **không** sửa ở đây.

| Module | Rủi ro | Mức | Kiểm soát bằng | Nguồn |
|---|---|---|---|---|
| `LOGIN` | Không có lớp chống thử vét cạn: không CAPTCHA, không giới hạn tần suất, không khoá tài khoản | Cao | Ghi nhận hiện trạng, đã báo đội phát triển · pentest ngoài phạm vi (2.2) | `RISK-LOGIN-01` |
| `LOGIN` | Cookie ghi nhớ đọc được bằng JavaScript (không có cờ `HttpOnly`) | Cao | Đã báo đội phát triển (`AMB-LOGIN-07`) · rủi ro được chấp nhận cho đợt này | `RISK-LOGIN-02` |
| `LOGIN` | Module là **cổng vào của 23 module còn lại** — hỏng là chặn kiểm thử toàn hệ thống | Cao | Nhóm B (đăng nhập thành công) chạy **đầu tiên** trong mọi bộ Smoke · Smoke tự động chặn build hỏng (3.7) | `RISK-LOGIN-06` |
| `LOGIN` | Tính năng Ghi nhớ đăng nhập không hoạt động nhưng checkbox vẫn hiển thị và vẫn cấp cookie | Trung bình | Ghi nhận hiện trạng; `REQ-LOGIN-40` ngoài phạm vi (2.2) | `RISK-LOGIN-08` |
| `CUST` | **Entity trung tâm** — hơn 10 module tham chiếu tới khách hàng | Cao | Kiểm thử cross-module với `PRJ` · sau mỗi lần sửa `CUST`, chạy kèm Smoke của module phụ thuộc | `RISK-CUST-01` |
| `CUST` | Thao tác xoá dùng GET — mở thẳng URL là xoá, không hộp thoại xác nhận | Cao | Cấm đưa URL xoá vào bước điều hướng của TC · chỉ xoá qua nút `Delete`, chỉ với bản ghi do test tạo (5.2) | `RISK-CUST-06` |
| `CUST` | `Project Manager` có giao diện xoá và `Mass Delete` như `Admin` (cấu hình cố ý theo PO) | Trung bình | Ma trận phân quyền `TC_113`→`TC_124` khoá hành vi này lại; đổi cấu hình phải cập nhật TC | `RISK-CUST-08` |
| `PRJ` | Module là **điểm gom của 9 module khác** qua 17 tab trang chi tiết | Cao | Kiểm thử cross-module · chạy Smoke module liên quan khi `PRJ` đổi | `RISK-PRJ-01` |
| `PRJ` | Thao tác xoá dùng GET | Cao | Như `RISK-CUST-06` | `RISK-PRJ-03` |
| `PRJ` | Số liệu tổng quan không khớp bảng — đếm `In Progress` lệch 7 dòng (`AMB-PRJ-02`) | Trung bình | Không viết khẳng định dựa trên số đếm tổng quan cho tới khi `AMB-PRJ-02` được trả lời | `RISK-PRJ-05` |

## 9. Quản lý lỗi

> Nội dung theo ISTQB CTFL v4.0 mục 5.5. Mục này là **phần mở rộng** so với khung 29119-3 — xem 12.1. Phiếu khai `Quy trình trạng thái: mặc định` · `Thang Severity: mặc định` · `Thang Priority: mặc định`.

### 9.1 Quy trình trạng thái lỗi

```text
TC FAIL ──/create-bug-report──→ 🔴 Đang mở ──Dev sửa──→ 🟡 Đã fix — chờ retest
                                    ▲                           │
                                    │                   /retest-fixed-bugs
                                    │                           │
                     NOT_FIXED ─────┤           ┌───────────────┼────────────────┐
                     PARTIAL   ─────┘         FIXED                      CANNOT_VERIFY
                                                │                   (giữ trạng thái, ghi lý do)
                                                ▼
                                            ⬛ Đóng
```

| Trạng thái | Ai chuyển | Điều kiện |
|---|---|---|
| 🔴 Đang mở | Tester | Bug report đủ Build/Version · TC ID · REQ ID · evidence |
| 🟡 Đã fix — chờ retest | Dev | Có build chứa bản sửa |
| ⬛ Đóng | Tester | Retest `FIXED` — lặp ≥ 2 lần theo Steps gốc |
| 🔴 Mở lại | Tester | Retest `NOT_FIXED` hoặc `PARTIAL` — **không** tạo bug trùng |
| ⚪ Đóng — không phải lỗi | Tester, có đồng thuận ở họp phân loại | Kiểm chứng lại cho thấy là hành vi đúng thiết kế — VD `BUG_login_1787226515_TC018` đóng ngày 19-09-2026 |

> Bug đồng bộ lên **Jira**, Jira là nguồn chính cho trạng thái bug (5.3). Bug *Hoãn* (nếu workflow Jira của công ty có) vẫn tính là **đang mở** khi chấm tiêu chí exit #1, #2 — trừ khi người có quyền ở 4.2 chấp nhận bằng văn bản.

### 9.2 Thang Severity

> Mặc định chép **nguyên văn** `skills-bug-reporter` — *Severity & Priority Guide*. Tiêu chí exit #1, #2 đếm theo thang này.

| Severity | Định nghĩa | Ví dụ |
|---|---|---|
| 🔴 **Critical** | Chặn luồng chính, mất data, crash, security | Không login được, thanh toán sai tiền |
| 🟠 **Major** | Chức năng chính sai nhưng có workaround | Filter sai kết quả, export thiếu cột |
| 🟡 **Minor** | Chức năng phụ sai, UI lệch ảnh hưởng sử dụng | Validation message sai, sort không đúng |
| 🟢 **Trivial** | Lỗi hiển thị nhỏ, không ảnh hưởng chức năng | Sai chính tả, lệch margin |

### 9.3 Thang Priority

| Priority | Định nghĩa |
|---|---|
| **P1** | Fix ngay trong sprint hiện tại / hotfix |
| **P2** | Fix trong sprint kế tiếp |
| **P3** | Fix khi có thời gian (backlog) |

> Severity đánh giá theo **mức ảnh hưởng kỹ thuật**; Priority theo **mức khẩn cấp business**. Hai giá trị độc lập nhau. Tester đề xuất Severity; **Priority do người phân loại lỗi chốt**.

### 9.4 Phân loại lỗi & thời hạn xử lý

| | |
|---|---|
| Người phân loại lỗi (triage) | Anh Tester — QA Lead cùng Nguyễn Hoàng Vũ — Dev Lead |
| Họp phân loại lỗi | Hằng ngày 15 phút, 9h30 |
| Bug đang mở tại ngày lập | **5** — 🔴 Critical 1 (`TC039`) · 🟠 Major 0 · 🟡 Minor 3 (`TC004`, `TC016`, `TC028`) · 🟢 Trivial 1 (`TC029`). Toàn bộ thuộc `LOGIN`, xác nhận trên **bản demo** → phải retest trên môi trường mới (R2 · R3). Ngoài ra 1 bug đã đóng *không phải lỗi* (`TC018`) — `docs/bugs/README.md` |

| Severity | Thời hạn phản hồi | Thời hạn sửa xong |
|---|---|---|
| Critical | 2 giờ làm việc | 1 ngày làm việc |
| Major | 1 ngày làm việc | 3 ngày làm việc |
| Minor | 3 ngày làm việc | Trong Release 2.0 |
| Trivial | Họp phân loại kế tiếp | Backlog |

> Bug quá hạn là dữ liệu cho mục *trở ngại* của báo cáo tiến độ (3.6).

## 10. Sản phẩm bàn giao

| Sản phẩm | Nơi lưu | Workflow sinh ra |
|---|---|---|
| Master Test Plan + bản lưu phiếu | `docs/test-plans/test_plan_crm_example.md` · `test_plan_crm_example.input.yaml` | `/generate-master-test-plan` |
| Tài liệu requirements bổ sung cho 5 REQ được đưa lại | `docs/requirements/<module>/web/` | `/update-requirements-from-ticket` |
| Test cases `PRJ` | `docs/testcases/projects/web/` | `/generate-testcases-manual-rbt` |
| TC `LOGIN` · `CUST` cập nhật theo AMB đã chốt | `docs/testcases/<module>/impact/delta_tc_<TICKET-ID>.md` | `/update-testcases-from-impact` |
| Execution report | `docs/executions/<module>/web/run_*/` | `/execute-test-cases` |
| Retest report | `docs/executions/<module>/web/retest_*/` | `/retest-fixed-bugs` |
| Bug report | `docs/bugs/<module>/web/` · Jira | `/create-bug-report` |
| Automation framework · script · report | Project automation · `reports/` | `/generate-automation-framework` · `/generate-automation-web` |
| Ma trận kết hợp cross-module | Theo workflow | `/generate-cross-module-test-plan` |
| Ma trận truy vết | `traceability_matrix.md` | `/generate-traceability-matrix` |
| Báo cáo tiến độ | `docs/executions/test_progress_crm_example_<YYYYMMDD>.md` | `/generate-test-progress-report` |
| **Báo cáo tổng hợp** | `docs/executions/test_summary_crm_example_*.md` | `/generate-test-summary-report` |

## 11. Phê duyệt

| Vai trò | Tên | Phiên bản duyệt | Ngày | Ý kiến |
|---|---|---|---|---|
| QA Lead | Anh Tester | v1.1 | 25-09-2026 | Lập và đề xuất duyệt |
| Product Owner | Lê Thu Hà | v1.1 | 25-09-2026 | Đồng ý. Sẽ trả lời `AMB-PRJ-01` và `AMB-PRJ-14` trước 09-10-2026; chấp nhận treo 4 AMB còn lại của `PRJ` |
| Project Manager | Phạm Đức Long | v1.1 | 25-09-2026 | Đồng ý lịch và ngân sách 14.190.000 ₫. Theo dõi sát R5 — Smoke tự động phải chạy được trước 19-10-2026 |
| QA Lead | Anh Tester | v1.0 | 21-09-2026 | Lập — được thay bằng v1.1 trước khi duyệt |

> Bản duyệt của một phiên bản **không** tự áp cho phiên bản sau. Sửa nội dung bản 🟩 → quay về 🟨 Draft, tăng phiên bản, ký lại.

## 12. Ánh xạ chuẩn tài liệu

### 12.1 Đối chiếu mục

> Tài liệu này biên soạn **theo cấu trúc** ISO/IEC/IEEE 29119-3 — Test Plan và phủ đủ nội dung điển hình của test plan theo **ISTQB CTFL v4.0 mục 5.1.1**. Cột IEEE 829 theo **khung Test Plan bản 1998**. Bảng dưới để người duyệt đối chiếu; **không** phải tuyên bố đã được đánh giá tuân thủ.

| Mục | ISO/IEC/IEEE 29119-3 — Test Plan | ISTQB CTFL v4.0 — 5.1.1 | IEEE 829-1998 — Test Plan |
|---|---|---|---|
| Kiểm soát tài liệu | Document-specific information — Unique identification · Issuing organization · Approval authority · Change history | — | Test plan identifier |
| 1.1 | Introduction — Scope · Context of the testing — Project/test sub-process | Context of testing — test objectives | Introduction |
| 1.2 | Context of the testing — Test item(s) | Context of testing — test basis | Introduction |
| 2.1 | Context of the testing — Test item(s) · Test scope | Context of testing — scope | Test items · Features to be tested |
| 2.2 | Context of the testing — Test scope (phần loại trừ) | Context of testing — scope | Features not to be tested |
| 2.3 | Context of the testing — Assumptions and constraints | Assumptions and constraints of the test project · Context of testing — constraints | — |
| 2.4 | Context of the testing — Stakeholders · Testing communication | Stakeholders — roles, relevance to testing · Communication — forms and frequency of communication, documentation templates | — |
| 3.1 | Test strategy — Test sub-processes | Test approach — test levels | Approach |
| 3.2 | Test strategy — Test sub-processes | Test approach — test types | Approach |
| 3.2.1 | Test strategy — Test sub-processes · Test design techniques | Test approach — test types | Approach |
| 3.3 | Test strategy — Test design techniques | Test approach — test techniques | Approach |
| 3.4 | Staffing — Roles, activities, and responsibilities | Test approach — independence of testing | Responsibilities |
| 3.5 | Test strategy — Retesting and regression testing | Test approach — test types | Approach |
| 3.6 | Test strategy — Metrics to be collected | Test approach — metrics to be collected | — |
| 3.7 | Test strategy — Test sub-processes | Test approach — test types *(kim tự tháp kiểm thử: CTFL v4.0 mục 5.1.6)* | Approach |
| 4.1 | Test strategy | Test approach — entry criteria | — |
| 4.2 | Test strategy — Test completion criteria | Test approach — exit criteria | Item pass/fail criteria |
| 4.3 | Test strategy — Suspension and resumption criteria | — | Suspension criteria and resumption requirements |
| 5.1 | Test strategy — Test environment requirements | Test approach — test environment requirements | Environmental needs |
| 5.2 | Test strategy — Test data requirements | Test approach — test data requirements | Environmental needs |
| 5.3 | Test strategy — Test environment requirements | — *(công cụ: CTFL v4.0 chương 6)* | Environmental needs |
| 6 | Staffing — Roles, activities, and responsibilities · Hiring needs · Training needs | Stakeholders — responsibilities, hiring and training needs | Responsibilities · Staffing and training needs |
| 7.1 | Schedule | Budget and schedule | Schedule |
| 7.2 | Testing activities and estimates | Budget and schedule | Testing tasks |
| 7.3 | Testing activities and estimates | Budget and schedule | — |
| 8.1 | Risk register — Project risks | Risk register — project risks | Risks and contingencies |
| 8.2 | Risk register — Product risks | Risk register — product risks | Risks and contingencies |
| 9 | — *(không có mục riêng trong Test Plan; báo cáo sự cố là tài liệu riêng — Incident Report)* | — *(quản lý lỗi: CTFL v4.0 mục 5.5)* | — *(Test incident report là tài liệu riêng)* |
| 10 | Test strategy — Test deliverables | Test approach — test deliverables | Test deliverables |
| 11 | Document-specific information — Approval authority | — | Approvals |
| 12.2 | Test strategy — Deviations from the Organizational Test Strategy | Test approach — deviations from the organizational test policy and test strategy | — |

**Rủi ro sản phẩm:** plan chỉ tóm tắt ở 8.2 — nguồn chính là tài liệu requirements và test case của từng module.

**Phần mở rộng ngoài khung chuẩn:** 3.7 Chiến lược tự động hoá · 9 Quản lý lỗi.

### 12.2 Điểm làm khác chính sách & chiến lược kiểm thử chung (Deviations)

| Làm khác ở đâu | Test Policy / Test Strategy quy định | Đợt này làm | Lý do | Ai duyệt |
|---|---|---|---|---|
| Kiểm thử hiệu năng | Mọi release lớn phải đo thời gian phản hồi của màn hình danh sách | Không đo — chỉ kiểm mức thô bằng `CUST` `TC_128` (danh sách hơn 2.000 dòng không treo) | Chưa mua công cụ tải; tách thành đợt kiểm thử hiệu năng riêng tháng 01/2027 | Phạm Đức Long — Project Manager, 21-09-2026 |
| Tỷ trọng tầng kiểm thử tự động | Automation ưu tiên tầng API, UI chỉ phủ luồng chính | Toàn bộ script ở tầng UI | QA chưa có quyền gọi API của CRM; đã đề nghị cấp quyền cho Release 2.1 | Anh Tester — QA Lead cùng Nguyễn Hoàng Vũ — Dev Lead, 21-09-2026 |
