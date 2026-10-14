# Master Test Plan — Perfex CRM · Release 1.0

## Kiểm soát tài liệu

### Thông tin tài liệu

| | |
|---|---|
| Mã tài liệu | `test_plan_release_1.0` |
| Phiên bản tài liệu | v1.3 |
| Trạng thái | 🟨 Draft — còn 12 ô chờ thông tin |
| Mức phân loại | ❓ Chờ Anh Tester chọn: công khai · nội bộ · mật (ô treo 8) |
| Ngày lập | 17-09-2026 |
| Ngày hiệu lực | — (chưa duyệt) |
| Người lập | Anh Tester — QA Lead (agent hỗ trợ) |
| Người review | ❓ Chưa chỉ định (ô treo 8) |
| Người phê duyệt | Anh Tester — QA Lead · ❓ Product Owner — chữ ký ở mục 11 |
| Hệ thống · Build | Perfex CRM · `v1.0.0` |
| Phiếu đầu vào | `docs/test-plans/test_plan_release_1.0.input.yaml` (bản lưu của `test_plan.config.yaml`) |
| Cấu trúc tài liệu | Biên soạn **theo cấu trúc** ISO/IEC/IEEE 29119-3 — Test Plan · phủ đủ nội dung điển hình của ISTQB CTFL v4.0 mục 5.1.1 · ánh xạ ở mục 12 |

> **Trạng thái hợp lệ:** 🟨 Draft → 🟦 Chờ duyệt → 🟩 Đã duyệt → ⬛ Hết hiệu lực.

> **Ô còn treo (12)** — gom theo người trả lời:
>
> **Anh Tester — QA Lead**
>
> - **4.** Mức độc lập kiểm thử thể hiện ở đâu (QA báo cáo cho ai, có review TC chéo không) (3.4)
> - **5.** Công sức **automation** (dựng framework, viết script Smoke và regression) chưa có hạng mục trong ước lượng (7.2)
> - **6.** Công cụ CI ghi `GitLab Actions CI` — là GitLab CI hay GitHub Actions (3.7 · 5.3)
> - **7.** Nhu cầu đào tạo DevTools cho tester `LOGIN` (6)
> - **8.** Người review plan · mức phân loại tài liệu (Kiểm soát tài liệu)
> - **10.** Chiến lược tự động hoá: mục tiêu · tầng kiểm thử · tiêu chí chọn TC · phần không tự động · khi nào chạy từng bộ (3.7)
>
> **Anh Tester và Product Owner**
>
> - **1.** Mục tiêu kiểm thử O1–O4 là **đề xuất của agent** — cần duyệt (1.1)
> - **2.** Tên Product Owner — người duyệt plan, làm UAT và cùng chấp nhận dừng kiểm thử (2.4 · 4.2 · 11)
> - **9.** Bốn loại phi chức năng **Tương thích · Khả năng truy cập · Khả dụng · Độ tin cậy & phục hồi** — đợt này có làm không, ngưỡng chấp nhận là bao nhiêu (3.2.1)
>
> **Đội DEV (cùng Anh Tester)**
>
> - **3.** Dữ liệu kiểm thử trên môi trường mới: dữ liệu nền · nguồn dữ liệu · có dữ liệu thật của khách hàng không · ai dọn, bao lâu làm mới · tài khoản 3 vai trò (5.2 · 4.1)
> - **11.** Quản lý lỗi: dùng quy trình và thang Severity/Priority mặc định hay workflow Jira · ai phân loại lỗi · họp bao lâu một lần · thời hạn phản hồi/sửa theo Severity (9)
>
> **Khi đem đi audit/nghiệm thu**
>
> - **12.** Đối chiếu tên mục ISO/IEC/IEEE 29119-3 ở mục 12.1 với bản chuẩn

### Lịch sử thay đổi

| Phiên bản | Ngày | Người sửa | Mục thay đổi | Nội dung | Người duyệt |
|---|---|---|---|---|---|
| v1.3 | 17-09-2026 | Anh Tester (agent hỗ trợ) | Kiểm soát tài liệu · 3.2 · **3.2.1** · 3.6 · **3.7** · **5.1 · 5.2 · 5.3** · 8.1 · **9** · 10 · 11 · 12 | Chuyển sang cấu trúc mới của template: đầu tài liệu thành mục **Kiểm soát tài liệu** (người review, mức phân loại, ngày hiệu lực) · thêm **3.2.1 Kiểm thử phi chức năng** (đối chiếu TC phi chức năng đã có của `LOGIN`) · thêm **3.7 Chiến lược tự động hoá** · tách mục 5 thành **Môi trường · Dữ liệu kiểm thử · Công cụ** · thêm **9 Quản lý lỗi** · Sản phẩm bàn giao, Phê duyệt, Ánh xạ chuẩn thành mục 10, 11, 12 · chuyển plan và bản lưu phiếu sang `docs/test-plans/`. Phiếu thêm 5 nhóm mới, đều còn trống → **4 ô treo mới** (8 · 9 · 10 · 11); ô treo cũ 8 thành 12. Rủi ro: thêm R13. **Không** đổi phạm vi, lịch, nhân lực, ước lượng, tiêu chí exit | ❓ Chờ Anh Tester và Product Owner duyệt |
| v1.2 | 17-09-2026 | Anh Tester (agent hỗ trợ) | Đầu tài liệu · 2.1 · 2.4 · 3.1 · 3.2 · 3.4 · 4.1 · 4.2 · 4.3 · 5 · 6 · 7.1 · 7.2 · 7.3 · 8.1 · 10 · 11.2 *(số mục theo cấu trúc v1.2)* | Cập nhật theo phiếu đã bổ sung: build `v1.0.0` · **đưa lại 5 REQ ⚪** bị loại vì môi trường dùng chung vào phạm vi · chốt cấp độ kiểm thử, mức độc lập, UAT do PO/BA nội bộ · **lịch mới**: môi trường 27-09 → 05-10, bắt đầu thực thi 30-09 → 06-10, thêm duyệt plan 21-09, xong TC 02-10, code freeze 19-11, hồi quy 20→25-11, UAT 30-11→04-12, báo cáo tổng hợp 10-12, release 15-12, báo cáo tiến độ hằng tuần thứ Sáu · Anh Tester kiêm automation · ước lượng ba điểm 19,0 người-ngày · không ngân sách riêng · nguồn chính khi lệch · trình duyệt Chrome và Firefox · người chấp nhận dừng · xác nhận ngưỡng tạm dừng · thêm PO vào bên liên quan và phê duyệt · không có Test Policy · chuyển plan và bản lưu phiếu từ `docs/executions/` sang `docs/testplan/`. Rủi ro: cập nhật R1, R5, R6, R7; đóng R10; thêm R11, R12. **Không** đổi tiêu chí exit | ❓ Chờ Anh Tester và Product Owner duyệt |
| v1.1 | 17-09-2026 | Anh Tester (agent hỗ trợ) | Cấu trúc toàn tài liệu · 1.2 · 3.1 · 3.4 · 3.6 · 4.1 · 7.2 · 7.3 · 8.1 · 8.2 · 11 | Chuyển sang cấu trúc mới của template (ISO/IEC/IEEE 29119-3 + nội dung điển hình ISTQB CTFL v4.0 mục 5.1.1): thêm mục tiêu đo được, cơ sở kiểm thử, cấp độ và mức độc lập kiểm thử, ước lượng công sức, ngân sách, tóm tắt rủi ro sản phẩm, mẫu tài liệu dùng trong đợt; nhóm lại tiêu chí vào và chỉ số theo ISTQB; rủi ro dự án thành mục 8.1, thêm R10; sửa số ngày làm việc còn lại ở R1 từ 9 thành 8. Lập phiếu `test_plan.config.json` từ câu trả lời ngày 17-09-2026. **Không** đổi phạm vi, lịch, nhân lực, tiêu chí exit so với v1.0 | ❓ Chờ Anh Tester duyệt |
| v1.0 | 17-09-2026 | Anh Tester (agent hỗ trợ) | Toàn bộ | Lập mới | — (được thay bằng v1.1 trước khi duyệt) |

---

## 1. Mục tiêu & Cơ sở kiểm thử

### 1.1 Mục tiêu kiểm thử

> ❓ **Đề xuất của agent** từ phạm vi đợt — chờ Anh Tester và Product Owner duyệt (ô treo 1).

| # | Mục tiêu | Đo bằng |
|---|---|---|
| O1 | Đăng nhập bằng 3 vai trò `Admin` · `Project Manager` · `Customer` và phân quyền truy cập khu `/admin` hoạt động đúng đặc tả trên Web | Tiêu chí exit #3, #4 — cặp `LOGIN` × Web |
| O2 | Tạo, sửa, tìm kiếm khách hàng và dự án đúng đặc tả; dự án gắn đúng khách hàng | Tiêu chí exit #3, #4 — cặp `CUST` × Web, `PRJ` × Web · kiểm thử tích hợp cross-module |
| O3 | Không còn lỗi Critical ở 3 module trước ngày release | Tiêu chí exit #1 |
| O4 | Cả 3 cặp module × nền tảng đều có TC đã review và đã chạy | Tiêu chí exit #7 |

### 1.2 Cơ sở kiểm thử (Test basis)

| Tài liệu | Phiên bản / ngày cập nhật | Module | Ghi chú |
|---|---|---|---|
| [`REQUIREMENTS_LOGIN_SUMMARY.md`](../requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md) | Rà soát và kiểm chứng lại 18-08-2026 | `LOGIN` | 43 REQ · 39 trong phạm vi · 0 AMB 🔴 |
| [`REQUIREMENTS_CUSTOMERS_SUMMARY.md`](../requirements/customers/REQUIREMENTS_CUSTOMERS_SUMMARY.md) | 14-08-2026 | `CUST` | 79 REQ · 4 AMB 🔴 treo |
| [`REQUIREMENTS_PROJECTS_SUMMARY.md`](../requirements/projects/REQUIREMENTS_PROJECTS_SUMMARY.md) | 14-08-2026 | `PRJ` | 104 REQ · 6 AMB 🔴 treo |
| [`system_map.md`](../requirements/_discovery/system_map.md) | 14-08-2026 | Cả 3 | Phụ thuộc giữa module · vùng loại khỏi phạm vi |

> ⚠️ Cả ba tài liệu được khảo sát trên **bản demo dùng chung**, không phải môi trường test của đợt này — xem rủi ro R2. Cơ sở kiểm thử đổi giữa đợt → cập nhật bằng `/update-requirements-from-ticket` rồi tăng phiên bản plan.

## 2. Phạm vi

### 2.1 Trong phạm vi

> Mỗi dòng là **một module × một nền tảng** — đơn vị báo cáo tiến độ theo dõi và báo cáo tổng hợp chấm tiêu chí exit #7. Perfex CRM chỉ có mặt **Web** trong `system_map.md`.

| Module | Prefix | Nền tảng | Số REQ | Số TC hiện có | Đã từng chạy? | Ghi chú |
|---|---|---|---|---|---|---|
| Đăng nhập / Xác thực | `LOGIN` | Web | 43 · **39 trong phạm vi** | 50 (độ hạt GỘP · 70 biến thể) | ✅ `run_1787215085` — **41/50 TC** | 9 TC bổ sung ngày 11-09-2026 (`TC_042`→`TC_050`) chưa chạy lần nào · 6 bug đang mở |
| Khách hàng | `CUST` | Web | 79 · 78 🟢 + 1 ⚪ **đưa lại** | **0** | — | ⚠️ Phải sinh + review TC trước 02-10-2026 · 4 AMB 🔴 treo |
| Dự án | `PRJ` | Web | 104 · 100 🟢 + 4 ⚪ **đưa lại** | **0** | — | ⚠️ Phải sinh + review TC trước 02-10-2026 · 6 AMB 🔴 treo |

**REQ cần quyết định lại** — bị loại **chỉ vì** lần khảo sát chạy trên môi trường dùng chung; đợt này có **môi trường riêng**:

| REQ | Nội dung | Lý do bị loại trước đây | Quyết định theo phiếu |
|---|---|---|---|
| `REQ-CUST-79` | Kết quả nhập tệp CSV (`AMB-CUST-12`) | Không tải tệp lên môi trường dùng chung | ✅ Đưa lại vào phạm vi |
| `REQ-PRJ-89` · `91` · `94` | CRUD mốc tiến độ / tệp / thảo luận của dự án (`AMB-PRJ-13`) | Không chạy CRUD trên môi trường dùng chung | ✅ Đưa lại vào phạm vi |
| `REQ-PRJ-104` | Nội dung tệp `Export project data` (`AMB-PRJ-12`) | Không tải tệp về | ✅ Đưa lại vào phạm vi |

> Anh Tester quyết định đưa lại ngày 17-09-2026. 5 REQ này vẫn mang trạng thái ⚪ trong tài liệu requirements — phải **khảo sát bổ sung trên môi trường mới** bằng `/update-requirements-from-ticket` trước khi sinh TC cho chúng (rủi ro R11). ⚠️ Danh mục `docs/requirements/README.md` ghi REQ ⚪ của `PRJ` là `89, 91, 94`, còn mục `AMB-PRJ-13` trong tài liệu `PRJ` ghi `89, 91, 93` — plan theo danh mục; cần rà lại khi khảo sát bổ sung.

### 2.2 NGOÀI phạm vi (out of scope)

| Không kiểm thử | Lý do | Ai chịu trách nhiệm | Nguồn quyết định |
|---|---|---|---|
| 20 module CRM còn lại: `CONT` · `LEAD` · `TASK` · `EST` · `PROP` · `INV` · `PAY` · `CN` · `SUB` · `CTR` · `EXP` · `ITEM` · `TICK` · `ESTREQ` · `KB` · `REP` · `DASH` · `TODO` · `REM` · `PROF` | Không thuộc Release 1.0 · 20/20 module chưa khảo sát requirements | Đợt sau | Anh Tester — QA Lead, 17-09-2026 |
| Hệ thống **Book API** (8 module, namespace `_book-api/`) | Không thuộc Release 1.0 · chưa có REQ, chưa có TC | Đợt sau | Anh Tester — QA Lead, 17-09-2026 |
| **Cổng khách hàng** (khu front-end ngoài `/admin`) | Loại khỏi phạm vi. Hệ quả: `STORY-PRJ-03` (11 REQ về `Visible Tabs` và công tắc quyền khách hàng) chỉ kiểm được mức *biểu mẫu ghi nhận đúng*, **không** kiểm tác dụng thật phía khách hàng (`AMB-PRJ-14`). Riêng `REQ-LOGIN-43` — tài khoản khách hàng bị chặn ở khu `/admin` — **vẫn trong phạm vi** | Chưa xếp đợt — chờ PO chốt phạm vi cổng khách hàng | Anh Tester — QA Lead, 17-09-2026 |
| Khu Quản trị hệ thống (Setup: Settings · Staff · Roles · Departments · Taxes · Currencies · Payment Modes · Custom Fields · Email Templates) | 403 với tài khoản hiện có, kể cả `Project Manager` | Cần tài khoản quyền cao hơn — đợt sau | `system_map.md` — Vùng loại khỏi phạm vi (14-08-2026) |
| Calendar · Media · Bulk PDF Export | Loại khỏi phạm vi khảo sát | — | `system_map.md` — Vùng loại khỏi phạm vi (14-08-2026) |
| `REQ-LOGIN-27` — gửi mail đặt lại mật khẩu với email có thật | Không kiểm chứng luồng gửi mail thật (`AMB-LOGIN-04`) | — | Quyết định PO 18-08-2026 |
| `REQ-LOGIN-34` · `35` — cookie ghi nhớ không bị xoá / đọc được bằng JavaScript | Ghi nhận hiện trạng, không viết TC (`AMB-LOGIN-06` · `AMB-LOGIN-07`) · rủi ro đã chấp nhận `RISK-LOGIN-02` | — | Quyết định PO 18-08-2026 |
| `REQ-LOGIN-40` — tự đăng nhập bằng cookie ghi nhớ | PO xác nhận tính năng Ghi nhớ đăng nhập **không hoạt động** (`AMB-LOGIN-15`) | — | Quyết định PO 18-08-2026 |
| Kiểm thử tải · đo ngưỡng thời gian phản hồi | Chưa có công cụ tải. Chỉ kiểm mức thô (đường truyền chậm — `TC_041`) | Đội Hạ tầng, đợt sau | `TEST_CASES_LOGIN_SUMMARY.md` — bảng ISO/IEC 25010 |
| Pentest · quét lỗ hổng | Ngoài năng lực manual TC | Đội bảo mật / đối tác đánh giá độc lập | `TEST_CASES_LOGIN_SUMMARY.md` — bảng ISO/IEC 25010 |
| Rà soát WCAG đầy đủ | Cần công cụ chuyên dụng. Chỉ kiểm điều hướng bàn phím (`TC_038`) | Đội Dev / chuyên gia a11y | `TEST_CASES_LOGIN_SUMMARY.md` — bảng 4 vòng |
| Khả năng bảo trì (Maintainability) | Đặc tính của mã nguồn | Đội Dev — code review, phân tích tĩnh | `TEST_CASES_LOGIN_SUMMARY.md` — bảng ISO/IEC 25010 |
| An toàn (Safety) | Ứng dụng nghiệp vụ, lỗi không gây tổn hại vật lý | — (không áp dụng) | `TEST_CASES_LOGIN_SUMMARY.md` — bảng ISO/IEC 25010 |
| Kiểm chứng tầng API · CSDL · tích hợp | QA không có quyền | **Đội Dev** xác minh | `docs/requirements/README.md` — Năng lực kiểm thử của QA (11-09-2026) |
| Ghi vết nhật ký hoạt động (Activity Log) | Tài khoản demo bị Từ chối truy cập. Được cấp Super Admin trước 06-10-2026 → đưa vào | Đề nghị PO / đội Dev cấp tài khoản | `docs/requirements/README.md` — Năng lực kiểm thử của QA |
| Đổi ngôn ngữ giao diện | Thuộc module Hồ sơ cá nhân (`PROF`), ngoài đợt | Đợt sau | `TEST_CASES_LOGIN_SUMMARY.md` — bảng ISO/IEC 25010 |

> Bảng ISO/IEC 25010 của `CUST` và `PRJ` chưa có vì chưa sinh TC. Sinh xong → ô `➖` mới của hai module phải bổ sung vào mục này, **tăng phiên bản plan**.
>
> Mục này do QA Lead thống nhất ngày 17-09-2026. Thay đổi phạm vi phải cập nhật tài liệu, tăng phiên bản và thông báo lại.

### 2.3 Giả định & Ràng buộc

| Loại | Nội dung | Ảnh hưởng tới kiểm thử | Nguồn |
|---|---|---|---|
| Giả định | Đợt này chạy trên **môi trường test riêng** do đội DEV dựng — **không** dùng chung | Được chạy TC phá huỷ dữ liệu (xoá, nhập CSV, CRUD tab dự án). Kiểm chứng được `AMB-CUST-11` · `AMB-CUST-12` · `AMB-PRJ-11` · `AMB-PRJ-13` | Phiếu `Môi trường` — Anh Tester 17-09-2026 |
| Ràng buộc | Requirements của cả 3 module được khảo sát trên **bản demo dùng chung**, không phải môi trường test đợt này | Cấu hình, dữ liệu nền, phiên bản có thể khác → một số REQ có thể lệch khi chạy trên môi trường mới. Xem rủi ro R2 | `docs/requirements/README.md` |
| Ràng buộc | QA **không** có quyền gọi API · truy vấn CSDL · kiểm tầng tích hợp | Nhánh Vòng 3 tương ứng do đội Dev xác minh | `docs/requirements/README.md` — Năng lực kiểm thử của QA |
| Ràng buộc | Tester có DevTools trình duyệt | Chạy được phần 🔧 của TC gắn `@TechCheck` (25 TC ở `LOGIN`) | `docs/requirements/README.md` — Năng lực kiểm thử của QA |
| Ràng buộc | Còn **10 AMB 🔴** treo: `CUST` 4 (`AMB-CUST-01` · `16` · `17` · `25`) · `PRJ` 6 (`AMB-PRJ-01` · `29` · `30` · `31` · `33` · `41`) | TC của vùng đó có thể phải sửa giữa đợt | `docs/requirements/README.md` |
| Ràng buộc | Ma trận phân quyền của `CUST` (24 ô) và `PRJ` (28 ô) chưa kiểm chứng — hai module khảo sát trước khi có tài khoản `Project Manager` | Phải chạy lại phần phân quyền trước khi sinh TC Vòng 3 · Permission | `docs/requirements/README.md` — mục 3.2 |
| Ràng buộc | Repo **chưa có** project automation | Automation phải dựng framework Playwright + TypeScript từ đầu — xem R5 | Kiểm tra repo 17-09-2026 |
| Ràng buộc | Không có ngân sách riêng cho kiểm thử | Không thuê thêm công cụ, thiết bị hay nhân lực ngoài — mọi việc dùng nguồn lực sẵn có | Phiếu `Ngân sách` |
| Giả định | Ước lượng 7.2 **không** tính công sức PO/BA làm UAT và thời gian Dev sửa bug | Hai phần này trễ không làm sai ước lượng QA nhưng vẫn đẩy lùi lịch 7.1 | Phiếu `Ước lượng` |
| Giả định | Build bàn giao đã qua smoke test của đội DEV | Sai giả định → kích hoạt tiêu chí tạm dừng 4.3 | ❓ Chờ DEV xác nhận |

### 2.4 Các bên liên quan & Giao tiếp

| Bên | Vai trò trong đợt | Liên quan tới kiểm thử | Nhận gì | Tần suất | Kênh |
|---|---|---|---|---|---|
| Anh Tester | QA Lead · phụ trách automation | Duyệt plan và TC · lập báo cáo tiến độ, báo cáo tổng hợp · dựng automation | Plan · báo cáo tiến độ · báo cáo tổng hợp | Hằng tuần thứ Sáu · cuối đợt | Jira · repo |
| Hồng · Lan · Huệ | Tester | Viết/chạy TC theo module phụ trách · báo bug | Plan · TC | Khi plan hoặc TC đổi phiên bản | Jira · repo |
| Đội DEV | Sửa bug · dựng và duy trì môi trường test riêng · xác minh nhánh Vòng 3 QA không có quyền | Chất lượng build bàn giao quyết định tiêu chí vào | Báo cáo lỗi | Khi phát sinh | Jira |
| ❓ Product Owner / BA (ô treo 2) | Duyệt plan · trả lời AMB 🔴 · chốt phạm vi REQ · **thực hiện UAT** · cùng QA Lead chấp nhận dừng kiểm thử | Quyết định phạm vi REQ ảnh hưởng trực tiếp bộ TC; nhận khuyến nghị go/no-go cuối đợt | Plan · báo cáo tiến độ · báo cáo tổng hợp | Hằng tuần thứ Sáu · cuối đợt | Email · Jira |

**Mẫu tài liệu dùng trong đợt:**

| Tài liệu | Mẫu | Workflow sinh |
|---|---|---|
| Test case | Mẫu của `skills-rbt-manual-testing` | `/generate-testcases-manual-rbt` |
| Execution report | Mẫu của `skills-manual-test-executor` | `/execute-test-cases` |
| Bug report | Mẫu của `skills-bug-reporter` — đồng bộ Jira | `/create-bug-report` |
| Báo cáo tiến độ | Mẫu của `skills-test-progress-reporter` | `/generate-test-progress-report` |
| Báo cáo tổng hợp | Mẫu của `skills-test-summary-reporter` | `/generate-test-summary-report` |

## 3. Chiến lược kiểm thử (Test approach)

### 3.1 Cấp độ kiểm thử

| Cấp độ | Trong đợt? | Ai thực hiện | Tiêu chí vào/ra |
|---|---|---|---|
| Component (unit) | ❌ Không | — | Không áp dụng |
| Component integration | ❌ Không | — | Không áp dụng |
| System | ✅ | QA — Hồng · Lan · Huệ | Bộ chung mục 4 |
| System integration | ✅ | QA — luồng `LOGIN` → `CUST` → `PRJ` | Bộ chung mục 4 |
| Acceptance (UAT) | ✅ | PO/BA nội bộ, QA hỗ trợ | Bộ chung mục 4 |

> Hai cấp độ Component **không** thuộc đợt: plan không có căn cứ nào cho thấy Dev có unit test hay contract test — chất lượng build chỉ được kiểm ở tiêu chí vào #9, #10.

### 3.2 Loại kiểm thử

| Loại test | Nền tảng | Có làm? | Cách làm | Ghi chú |
|---|---|---|---|---|
| Kiểm thử chức năng | Web | ✅ | Manual theo TC — `/execute-test-cases` | 3 module |
| Automation | Web | ✅ | `/generate-automation-framework` dựng framework Playwright + TypeScript + Allure → `/generate-automation-web` từ TC đã review | Chi tiết 3.7 · repo chưa có project automation — R5 |
| Regression | Web | ✅ | Bộ Regression đầy đủ của `LOGIN` (49 TC, ~3 giờ 40 phút) + automation suite | `CUST`/`PRJ` xác định sau khi sinh TC |
| Retest bug | Web | ✅ | `/retest-fixed-bugs` | Bug Critical/Major chạy mode FULL |
| Tích hợp cross-module | Web | ✅ | `/generate-cross-module-test-plan` | Luồng `LOGIN` → `CUST` → `PRJ` (dự án gắn với khách hàng) |
| Vòng 3 — Permission · Security | Web | ✅ | Manual — 3 vai trò `Admin` · `Project Manager` · `Customer` | |
| Vòng 3 — API · CSDL · tích hợp · nhật ký | — | ❌ QA không có quyền | Đội Dev xác minh | Không phải vùng trắng — mục 2.2 |
| UAT | Web | ✅ | PO/BA nội bộ chạy theo luồng nghiệp vụ, QA hỗ trợ chuẩn bị dữ liệu và ghi nhận lỗi | 30-11-2026 → 04-12-2026 |
| Phi chức năng | Web | 🟨 | Hiệu năng (tải) · bảo mật chuyên sâu ❌ ngoài phạm vi — mục 2.2 · 4 loại còn lại ❓ chờ chốt | Chi tiết 3.2.1 |
| Mobile · API | — | ❌ | Ngoài phạm vi — Perfex CRM chỉ có mặt Web trong `system_map.md` | |

**Tỷ trọng manual/automation:** chạy manual toàn bộ TC trên web · automate bộ Smoke và regression của `LOGIN`, `CUST`, `PRJ` bằng Playwright — chi tiết 3.7.

**Thứ tự ưu tiên thực thi** (theo rủi ro sản phẩm — mục 8.2): `LOGIN` → `CUST` → `PRJ`. Trong mọi bộ chạy, **nhóm B của `LOGIN` (đăng nhập thành công) chạy đầu tiên** — hỏng ở đây là chặn toàn bộ đợt (`RISK-LOGIN-06`). `CUST` chạy trước `PRJ` vì dự án gắn với khách hàng.

#### 3.2.1 Kiểm thử phi chức năng

> Hiệu năng và bảo mật chuyên sâu: phiếu ghi `không`. Bốn loại còn lại phiếu **để trống** → `❓` (ô treo 9). Cột *TC đã có* đọc từ bảng ISO/IEC 25010 của `TEST_CASES_LOGIN_SUMMARY.md` — `CUST` và `PRJ` chưa có TC. TC lẻ đã có **không** tự biến một loại thành `có`: chúng chạy như TC chức năng trong bộ Regression, nhưng chưa có ai chốt **ngưỡng đạt** cho cả loại.

| Loại | Có làm? | Mục tiêu đo | Ngưỡng chấp nhận | Cách làm · công cụ | Môi trường | Ai thực hiện | TC đã có (`LOGIN`) |
|---|---|---|---|---|---|---|---|
| Hiệu năng | ❌ | — | — | Kiểm thử tải ngoài phạm vi — mục 2.2 | — | Đội Hạ tầng, đợt sau | `TC_041` đường truyền chậm (mức thô, `@NeedsVerify`) |
| Bảo mật | ❌ chuyên sâu | — | — | Pentest ngoài phạm vi — mục 2.2. QA vẫn kiểm phân quyền 3 vai trò, CSRF, vòng đời phiên ở Vòng 3 (3.2) | — | Đội bảo mật / đối tác | `TC_017` · `TC_019`→`TC_025` · `TC_036` · `TC_037` · `TC_039` |
| Tương thích | ❓ | ❓ | ❓ | Gợi ý: chạy `TC_049`, `TC_050` trên Google Chrome và Firefox (5.1) | Môi trường test riêng | ❓ | `TC_049` 5 kích thước màn hình · `TC_050` trình duyệt |
| Khả năng truy cập | ❓ | ❓ | ❓ | Rà soát WCAG đầy đủ ngoài phạm vi — mục 2.2 | Môi trường test riêng | ❓ | `TC_038` điều hướng bàn phím |
| Khả dụng | ❓ | ❓ | ❓ | Gợi ý: ghi nhận trong UAT do PO/BA thực hiện | Môi trường test riêng | ❓ | `TC_011` · `TC_013` thông báo lỗi · `TC_042`→`TC_044` hành vi ô nhập và nút |
| Độ tin cậy & phục hồi | ❓ | ❓ | ❓ | ❓ | Môi trường test riêng | ❓ | `TC_026` hết hạn phiên (`@Slow`, 65 phút) · `TC_040` mất mạng giữa chừng · `TC_047` dữ liệu bất thường |

> ⚠️ `TC_050` ghi *3 trình duyệt — chờ PO chốt danh sách*, còn phiếu đã chốt **2** trình duyệt (Google Chrome, Firefox) — cập nhật `TC_050` bằng `/update-testcases-from-impact` trước khi chạy.

### 3.3 Kỹ thuật thiết kế test

> Liệt kê theo bộ TC đã có (`LOGIN`). Kỹ thuật của `CUST` và `PRJ` bổ sung sau khi sinh TC.

| Kỹ thuật | Áp dụng ở đâu |
|---|---|
| Khung 4 vòng Smoke → Functional → Technical → Non-functional | Mọi bộ TC — `LOGIN` đã chấm đủ bảng 4 vòng |
| Phân vùng tương đương | `LOGIN` — TC_012, TC_013, TC_045, TC_046 |
| Phân tích giá trị biên | `LOGIN` — TC_045 → TC_048 (mốc 64 ký tự phần trước `@`) |
| Quy tắc nghiệp vụ | `LOGIN` — TC_013, TC_015, TC_019 |
| Kịch bản sử dụng | `LOGIN` — chuỗi đăng nhập → dùng → đăng xuất |
| Đoán lỗi (Error guessing) | `LOGIN` — TC_010, TC_016, TC_018, TC_036, TC_040 |
| Kiểm thử dựa trên rủi ro (RBT) | `CUST` · `PRJ` — `/generate-testcases-manual-rbt` |
| Output-Class Coverage / Pairwise | Tổ hợp cross-module — `/generate-cross-module-test-plan` |

> `LOGIN` không dùng Bảng quyết định và Chuyển trạng thái — module không đủ điều kiện kích hoạt (ghi rõ ở bảng 4 vòng).

### 3.4 Mức độc lập của kiểm thử

| | |
|---|---|
| Mức độ | Đội QA riêng trong tổ chức |
| Thể hiện ở đâu | ❓ QA báo cáo cho ai, TC có được review chéo không (ô treo 4) |
| Giới hạn | QA Lead vừa lập plan, vừa phụ trách automation, vừa là người duyệt phía QA — việc tự duyệt giảm tính độc lập, nên plan cần thêm chữ ký Product Owner (mục 11). UAT do PO/BA **nội bộ** thực hiện, không phải người dùng cuối hay khách hàng |

### 3.5 Retest & Regression

- Bug đã fix → `/retest-fixed-bugs`: Critical/Major chạy **mode FULL** (verify + regression quanh vùng fix), Minor/Trivial chạy mode RETEST
- Mỗi build mới → chạy lại **bộ Smoke** trước khi thực thi tiếp (`LOGIN`: 9 TC, ~12 phút)
- 6 bug `LOGIN` đang mở phải **retest trên môi trường mới** — kết quả trên bản demo không tự áp dụng sang
- Regression trước release → bộ Regression đầy đủ của 3 module + automation suite

### 3.6 Chỉ số theo dõi

> Nhóm theo ISTQB CTFL v4.0 mục 5.3.1. `/generate-test-progress-report` báo cáo đúng các chỉ số này mỗi kỳ.

| Nhóm | Chỉ số | Nguồn | Dùng để |
|---|---|---|---|
| Tiến độ kiểm thử | TC đã viết / đã review · TC đã chạy / chưa chạy · PASS · FAIL · BLOCKED | `docs/testcases/` · `execution_report.md` | Báo cáo tiến độ · tiêu chí exit #3, #4, #5, #7 |
| Tiến độ dự án | Công sức thực tế so với ước lượng 7.2 (E = 19,0 người-ngày) · mốc thực tế so với lịch 7.1 | Báo cáo tiến độ | Phát hiện trễ sớm |
| Lỗi | Bug mới / đã fix / đang mở theo Severity · regression phát sinh · bug quá thời hạn xử lý (9.4) | `docs/bugs/` · Jira | Tiêu chí exit #1, #2 |
| Độ phủ | REQ có TC · REQ Critical có TC PASS | `traceability_matrix.md` | Tiêu chí exit #6 |
| Rủi ro | Trạng thái từng rủi ro ở 8.1 | Báo cáo tiến độ | Kiểm soát rủi ro |
| Automation | Kết quả suite — báo riêng, không cộng với manual | `reports/` | Tham khảo cho quyết định release |

### 3.7 Chiến lược tự động hoá

> Phiếu `Loại kiểm thử` → `Tự động hoá: có`, nhưng nhóm `Chiến lược tự động hoá` **còn trống** (ô treo 10). Dòng có dữ liệu dưới đây lấy từ các nhóm khác của phiếu hoặc đọc từ repo.

| | |
|---|---|
| Mục tiêu | ❓ (ô treo 10) |
| Hiện trạng | **Chưa có gì** — repo không có `package.json` / `pom.xml`, không có file CI, 0 script (kiểm tra 17-09-2026) |
| Tầng kiểm thử (kim tự tháp) | ❓ (ô treo 10). Dữ liệu đã biết: cấp Component **không** thuộc đợt (3.1) và QA **không** có quyền gọi API (2.3) → automation của QA đợt này chỉ đặt được ở **tầng UI** — xem R13 |
| Tiêu chí chọn TC để tự động | ❓ (ô treo 10). Gợi ý: dùng cột `Automation` sẵn có của tài liệu TC — `LOGIN` có 38 TC `Yes` · 10 `Partial` · 2 `No` (`TC_034`, `TC_044`) |
| Framework · report | Playwright + TypeScript · Allure Report — output trong `reports/` |
| Hệ thống CI | ❓ `GitLab Actions CI` — GitLab CI hay GitHub Actions (ô treo 6) |
| Người bảo trì | Anh Tester — theo phiếu `Nhân lực`, vai trò tự động hoá, **kiêm** QA Lead (R5) |

**Phạm vi:**

| Tự động | Không tự động | Lý do không tự động |
|---|---|---|
| Bộ Smoke `LOGIN` · `CUST` · `PRJ` × Web — `LOGIN` 9 TC | ❓ (ô treo 10) | ❓ |
| Bộ regression `LOGIN` · `CUST` · `PRJ` × Web — `LOGIN` 49 TC trừ `@Slow` | *Gợi ý:* `TC_026` (`@Slow`, 65 phút) · 12 TC `@NeedsVerify` cho tới khi khảo sát bổ sung | Chạy quá lâu cho pipeline · hành vi chưa kiểm chứng — script sẽ khoá cứng kết quả chưa đúng |

**Kích hoạt chạy:**

| Bộ chạy | Khi nào | Môi trường | Ai xem kết quả | Fail thì |
|---|---|---|---|---|
| Smoke | ❓ (ô treo 10) — gợi ý: mỗi build lên môi trường test | Môi trường test riêng | ❓ | Chặn thực thi manual — tiêu chí tạm dừng 4.3 |
| Regression | ❓ (ô treo 10) — phải chạy được **trước 20-11-2026** (bắt đầu hồi quy, 7.1) | Môi trường test riêng | ❓ | Phân loại bằng `/run-and-fix-tests` — **không** sửa test để né bug |

**Nguyên tắc:**
- Script chỉ tính là xong khi đạt Definition of Done của `CLAUDE.md` — PASS ổn định ≥ 2 lần liên tiếp, đủ Allure metadata và screenshot
- Kết quả automation **báo riêng**, không cộng vào pass rate manual của tiêu chí exit #3, #4
- Automation **chưa sẵn sàng** không phải lý do dừng thực thi manual (R5) — chỉ Smoke tự động **đã chạy được** mà fail mới chặn
- Test chập chờn → `/analyze-flaky-tests` · UI đổi → `/heal-locators` · yêu cầu đổi → `/update-automation-from-impact`

## 4. Tiêu chí Vào / Ra

### 4.1 Tiêu chí VÀO (Entry) — chưa đủ thì CHƯA bắt đầu test

> Nhóm theo ISTQB CTFL v4.0 mục 5.1.3. Trạng thái tại ngày 17-09-2026. Chỉ giữ dòng của nền tảng Web.

| # | Nhóm | Điều kiện | Trạng thái |
|---|---|---|---|
| 1 | Nguồn lực | Nhân lực đã phân công đủ 3 cặp module × nền tảng | ✅ Hồng · Lan · Huệ |
| 2 | Nguồn lực | Môi trường test riêng sẵn sàng, có dữ liệu nền | ❓ DEV cam kết 05-10-2026 · dữ liệu nền chưa mô tả — 5.2 (ô treo 3) |
| 3 | Nguồn lực | Tài khoản test đủ 3 vai trò `Admin` · `Project Manager` · `Customer` **trên môi trường mới** | ❓ Tài khoản hiện có thuộc bản demo (ô treo 3) |
| 4 | Nguồn lực | Công cụ sẵn sàng: Jira · project automation | 🟨 Jira ✅ · automation chưa có project — **không chặn** thực thi manual |
| 5 | Nguồn lực | Ngân sách đã duyệt *(khi có ngân sách riêng)* | Không áp dụng — không có ngân sách riêng |
| 6 | Testware | Tài liệu requirements của 3 module trong phạm vi đã có | ✅ 3/3 |
| 7 | Testware | AMB 🔴 của module trong phạm vi đã được giải đáp hoặc QA Lead chấp nhận treo | 🟨 còn 10 🔴 (`CUST` 4 · `PRJ` 6) |
| 8 | Testware | Test case đã viết và đã review — đủ 3 module | 🟨 1/3 — `LOGIN` đã có 50 TC · `CUST`, `PRJ` chưa có |
| 9 | Chất lượng ban đầu | Build `v1.0.0` đã deploy lên môi trường test riêng và truy cập được | ❓ 05-10-2026 |
| 10 | Chất lượng ban đầu | Smoke test của DEV đã pass · Smoke `LOGIN` chạy PASS trên môi trường mới — xác nhận requirements khảo sát trên bản demo vẫn đúng | ❓ Chỉ còn 05-10-2026 — cùng ngày môi trường sẵn sàng (R7) |

> ⚠️ Bắt đầu test khi chưa đạt tiêu chí vào là nguyên nhân số một khiến kết quả kiểm thử không dùng được — BLOCKED tràn lan, phải chạy lại từ đầu. Thiếu điều kiện nào thì báo QA Lead, đừng bắt đầu rồi chữa sau.

### 4.2 Tiêu chí RA (Exit)

> Bảng mặc định lấy **nguyên văn** từ `skills-test-summary-reporter`. `/generate-test-summary-report` sẽ đọc mục này và chấm lại đúng bộ này.

| # | Tiêu chí | Ngưỡng |
|---|---|---|
| 1 | Bug **Critical** đang mở | **0** |
| 2 | Bug **Major** đang mở | 0, hoặc có workaround được PM chấp nhận bằng văn bản |
| 3 | Pass rate TC **Priority High** | **≥ 95%** |
| 4 | Pass rate toàn bộ TC đã chạy | ≥ 90% |
| 5 | Tỷ lệ **BLOCKED** | ≤ 5% |
| 6 | REQ mức Critical có ít nhất 1 TC **PASS** | 100% |
| 7 | Module trong phạm vi release đã có TC và đã chạy — tính trên **từng cặp module × nền tảng** trong phạm vi | 100% |

Phiếu không khai tiêu chí bổ sung.

☑ Bộ mặc định — Anh Tester chọn ngày 17-09-2026, hiệu lực khi plan được duyệt  ☐ Bộ mặc định + bổ sung  ☐ Bộ tiêu chí riêng của dự án

> ⚠️ Tại ngày lập plan, tiêu chí **#1 chưa đạt**: `BUG_login_1785678750_TC039` (🔴 Critical — trang đăng nhập phục vụ qua HTTP, không ép sang HTTPS) đang mở, lần retest gần nhất `NOT_FIXED`. Lỗi này phụ thuộc cấu hình máy chủ → phải retest trên môi trường mới.
>
> ⚠️ **Dừng kiểm thử khi hết thời gian hoặc ngân sách** (ISTQB CTFL v4.0 mục 5.1.3): được coi là hợp lệ **chỉ khi** **Product Owner cùng Anh Tester — QA Lead** đã xem xét và **chấp nhận bằng văn bản** rủi ro phát hành mà chưa đạt đủ tiêu chí. Báo cáo tổng hợp khi đó ghi rõ tiêu chí nào chưa đạt và ai chấp nhận — **không** chấm lại thành "Đạt".

### 4.3 Tiêu chí TẠM DỪNG (Suspension) & tiếp tục

**Tạm dừng kiểm thử khi:** môi trường sập > 4 giờ · build lỗi không đăng nhập được · > 30% TC BLOCKED cùng một nguyên nhân · phát hiện bug Critical chặn luồng chính.

**Tiếp tục khi:** nguyên nhân đã xử lý, có build mới, và đã chạy lại bộ Smoke.

> Ngưỡng tạm dừng trên là đề xuất của agent — **đã xác nhận** theo phiếu (`Dùng ngưỡng tạm dừng đề xuất: có`).

## 5. Môi trường, Dữ liệu & Công cụ

### 5.1 Môi trường kiểm thử

| | |
|---|---|
| Môi trường | Môi trường test riêng cho Release 1.0 — URL và tài khoản lưu ở `.env`, **không** ghi vào tài liệu này |
| Dùng chung với đội khác? | **Không** — được chạy TC phá huỷ (xoá, nhập CSV, CRUD tab dự án) |
| Khác môi trường đã khảo sát? | **Có** — requirements khảo sát trên bản demo **dùng chung**; thuộc tính `Môi trường dùng chung: CÓ` trong `docs/requirements/README.md` mô tả bản demo đó, **không** mô tả môi trường đợt này. Rủi ro lệch tài liệu: R2 |
| Web — trình duyệt | **Google Chrome** (chính) · **Firefox** — theo phiếu. Tài liệu requirements khảo sát trên Google Chrome, viewport desktop `1600×750` |
| Người dựng · ngày sẵn sàng | Đội DEV · **05-10-2026** (thứ Hai) |

### 5.2 Quản lý dữ liệu kiểm thử

> Nhóm `Dữ liệu kiểm thử` của phiếu **còn trống** (ô treo 3).

| | |
|---|---|
| Dữ liệu nền | ❓ Chờ DEV mô tả dữ liệu mẫu nạp sẵn |
| Nguồn dữ liệu | ❓ |
| Tài khoản test | 3 vai trò `Admin` · `Project Manager` · `Customer` — ❓ chưa có **trên môi trường mới** (tài khoản hiện có thuộc bản demo) · mật khẩu ở `.env` |
| Dữ liệu thật của khách hàng | ❓ — trả lời `có` thì phải nêu cách che trước khi chụp evidence |
| Quy tắc sinh dữ liệu | Random + traceable theo `CLAUDE.md` mục 7 — nhìn bản ghi biết test nào tạo |
| Dọn dữ liệu sau khi chạy | ❓ — gợi ý: có, để kết quả các lần chạy sau không bị nhiễu. **Chỉ** xoá bản ghi do test tạo, **chỉ** qua nút `Delete` — thao tác xoá của `CUST` và `PRJ` dùng GET, mở thẳng URL là xoá (`RISK-CUST-06`, `RISK-PRJ-03`) |
| Làm mới dữ liệu nền | ❓ |
| Người cung cấp | ❓ — Đội DEV dựng môi trường, chưa rõ ai nạp dữ liệu |

### 5.3 Công cụ

| Mục đích | Công cụ | Ghi chú |
|---|---|---|
| Quản lý lỗi | Jira · file markdown trong repo | **Nguồn chính khi lệch:** Jira cho trạng thái bug · repo cho execution report |
| Quản lý kết quả kiểm thử | Jira · file markdown trong repo | |
| Tự động hoá | Playwright + TypeScript · Allure Report | Chưa có project — dựng bằng `/generate-automation-framework` · chi tiết 3.7 |
| CI | ❓ `GitLab Actions CI` — GitLab CI hay GitHub Actions (ô treo 6) | |

## 6. Nhân lực & Phân công

| Vai trò | Người | Module × nền tảng phụ trách | Ghi chú |
|---|---|---|---|
| QA Lead | Anh Tester | Cả 3 module | Duyệt plan và TC, lập báo cáo tiến độ và báo cáo tổng hợp |
| Tester | Hồng | `LOGIN` × Web | Bộ TC đã có — trọng tâm chạy 9 TC chưa từng chạy + retest 6 bug trên môi trường mới |
| Tester | Lan | `CUST` × Web | Sinh + review TC trước 02-10-2026 · gồm `REQ-CUST-79` được đưa lại |
| Tester | Huệ | `PRJ` × Web | Sinh + review TC trước 02-10-2026 — module lớn nhất (104 REQ, gồm 4 REQ được đưa lại) |
| Automation | Anh Tester *(kiêm)* | `LOGIN` · `CUST` · `PRJ` × Web | Dựng framework, automate Smoke và regression — **kiêm cùng vai trò QA Lead** (R5) |

**Nhu cầu đào tạo:** ❓ — `LOGIN` có 25 TC gắn `@TechCheck`, trong đó `TC_025` và `TC_041` **bắt buộc** biết DevTools mới chạy được từ đầu (ô treo 7). **Nhu cầu tuyển thêm:** Không.

## 7. Lịch trình, Ước lượng & Ngân sách

### 7.1 Lịch trình & Mốc

| Mốc | Ngày | Điều kiện hoàn thành |
|---|---|---|
| Duyệt plan | **21-09-2026** (thứ Hai) | Mục 11 có chữ ký Anh Tester và Product Owner |
| Hoàn tất viết và review TC `CUST`, `PRJ` | **02-10-2026** (thứ Sáu) | TC đã review qua `/review-testcases` · đạt tiêu chí vào #8 |
| Môi trường test sẵn sàng | **05-10-2026** (thứ Hai) | Đạt tiêu chí vào #2, #3, #9 |
| Smoke xác nhận môi trường | 05-10-2026 (thứ Hai) — *suy từ lịch, không có ngày riêng* | Đạt tiêu chí vào #10 |
| Bắt đầu thực thi | **06-10-2026** (thứ Ba) | Đạt toàn bộ tiêu chí vào (mục 4.1) |
| Báo cáo tiến độ | **Hằng tuần — thứ Sáu** | `/generate-test-progress-report` — slug `release_1.0` |
| Code freeze | **19-11-2026** (thứ Năm) | 33 ngày làm việc thực thi tính từ 06-10-2026 |
| Regression | **20-11-2026** (thứ Sáu) → **25-11-2026** (thứ Tư) | 4 ngày làm việc · bộ Regression 3 module + automation suite |
| UAT | **30-11-2026** (thứ Hai) → **04-12-2026** (thứ Sáu) | PO/BA nội bộ ký nhận kết quả |
| Báo cáo tổng hợp | **10-12-2026** (thứ Năm) | `/generate-test-summary-report` — slug `release_1.0` |
| Release | **15-12-2026** (thứ Ba) | Người quyết định release nhận khuyến nghị go/no-go |

> Mọi mốc rơi vào ngày làm việc. Lịch đã thay đổi so với v1.1 (môi trường 27-09 → 05-10, bắt đầu thực thi 30-09 → 06-10) — báo cáo tiến độ `test_progress_release_1.0_20260917.md` lập theo lịch cũ.

### 7.2 Ước lượng công sức

| | |
|---|---|
| Kỹ thuật (ISTQB CTFL v4.0 mục 5.1.4) | Ước lượng ba điểm (Three-point estimation) |
| Giả định của ước lượng | `LOGIN` đã có 50 TC nên chủ yếu viết mới cho `CUST` (79 REQ) và `PRJ` (104 REQ) · **không** tính công sức PO/BA làm UAT · **không** tính thời gian Dev sửa bug |

Công thức: E = (a + 4m + b) / 6 · SD = (b − a) / 6. E tổng = cộng E các hạng mục · SD tổng = cộng SD các hạng mục (cộng thẳng — cách thận trọng, cho khoảng rộng hơn cộng theo căn bậc hai). Đơn vị người-ngày, làm tròn 1 chữ số thập phân.

| Hạng mục | a (lạc quan) | m (khả năng nhất) | b (bi quan) | E = (a+4m+b)/6 | SD = (b−a)/6 |
|---|---|---|---|---|---|
| Viết & review TC cho `LOGIN` · `CUST` · `PRJ` × Web | 7 | 8 | 9 | 8,0 | 0,3 |
| Thực thi manual trên Web | 5 | 6 | 7 | 6,0 | 0,3 |
| Retest bug và regression | 2 | 3 | 4 | 3,0 | 0,3 |
| Hỗ trợ UAT, lập báo cáo và quản lý đợt | 1 | 2 | 3 | 2,0 | 0,3 |
| Automation — dựng framework, script Smoke và regression | ❓ | ❓ | ❓ | ❓ | ❓ |
| **Tổng** (chưa gồm automation) | | | | **19,0 người-ngày** | **±1,3** |

**Đối chiếu năng lực:**

| Giai đoạn | Người | Ngày làm việc | Năng lực | Ước lượng E | Kết luận |
|---|---|---|---|---|---|
| Viết & review TC — 18-09 → 02-10-2026 | Lan · Huệ (+ Hồng) | 11 | 22–33 người-ngày | 8,0 | Đủ về số người-ngày |
| Thực thi — 06-10 → 19-11-2026 (bắt đầu thực thi tới code freeze) | Hồng · Lan · Huệ · Anh Tester | 33 | 132 người-ngày | 6,0 + 3,0 + 2,0 = 11,0 | Dư rất nhiều |

> ⚠️ Không thiếu người, nhưng ước lượng **thấp bất thường** so với khối lượng: 8 người-ngày cho 183 REQ chưa có TC, 6 người-ngày thực thi manual cho 3 module, trong khi riêng bộ Regression `LOGIN` đã mất ~3 giờ 40 phút một lượt. Giai đoạn thực thi dài 33 ngày làm việc mà chỉ dùng 11 người-ngày — ước lượng có thể chỉ tính một lượt chạy, chưa tính các vòng retest sau mỗi build. Xem rủi ro R12.

**Dữ liệu sẵn có trong repo để đối chiếu ước lượng:**

| Dữ liệu | Giá trị | Nguồn |
|---|---|---|
| Bộ Smoke `LOGIN` | 9 TC · ~12 phút | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| Bộ Regression đầy đủ `LOGIN` (trừ `@Slow`) | 49 TC · ~3 giờ 40 phút | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| Phần 🔧 của TC `@TechCheck` | 25 TC · ~55 phút | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| TC `@Slow` chạy riêng | `TC_026` · 65 phút | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| REQ cần viết TC | `CUST` 79 · `PRJ` 104 (đã gồm 5 REQ được đưa lại) | `docs/requirements/README.md` |

### 7.3 Ngân sách

**Không có ngân sách riêng — chi phí nằm trong ngân sách dự án** (phiếu `Ngân sách`, 17-09-2026).

## 8. Rủi ro

### 8.1 Rủi ro DỰ ÁN & biện pháp

> Rủi ro **của việc kiểm thử** — nhóm theo ISTQB CTFL v4.0 mục 5.2.2. Khả năng / Ảnh hưởng là **đề xuất của agent** dựa trên dữ liệu repo — QA Lead xác nhận khi duyệt. `/generate-test-progress-report` theo dõi trạng thái từng dòng.

| # | Nhóm | Rủi ro | Khả năng | Ảnh hưởng | Biện pháp | Nguồn phát hiện |
|---|---|---|---|---|---|---|
| R1 | Tổ chức | **Không kịp sinh và review TC cho `CUST` (79 REQ) và `PRJ` (104 REQ) trước 02-10-2026** — còn 11 ngày làm việc, trong đó 5 REQ phải khảo sát bổ sung trước (R11) | Cao | Trễ ngày bắt đầu, hoặc chạy trên TC chưa review | Lan và Huệ sinh TC song song ngay từ 18-09-2026; review theo từng batch thay vì dồn cuối; không kịp → chạy TC Priority High trước, phần còn lại ghi nợ kiểm thử | `docs/testcases/README.md` |
| R2 | Kỹ thuật | Requirements khảo sát trên **bản demo**, còn đợt này chạy trên **môi trường mới** — cấu hình, dữ liệu, phiên bản có thể khác | Trung bình | TC FAIL do tài liệu lệch chứ không do lỗi → mở bug sai | Chạy Smoke ngay khi môi trường sẵn sàng 05-10-2026 (tiêu chí vào #10); lệch thì cập nhật requirements bằng `/update-requirements-from-ticket` trước khi mở bug | `docs/requirements/README.md` |
| R3 | Tổ chức | 10 AMB 🔴 của `CUST`/`PRJ` chưa có câu trả lời, gồm 2 ma trận phân quyền chưa kiểm chứng (`AMB-CUST-01`, `AMB-PRJ-01`) | Cao | TC phân quyền viết theo suy đoán, phải sửa giữa đợt | Gửi danh sách AMB cho PO ngay; dùng tài khoản `Project Manager` trên môi trường mới chạy lại ma trận phân quyền trước khi sinh TC Vòng 3 | `docs/requirements/README.md` — mục 3 |
| R4 | Kỹ thuật | Bug Critical `TC_039` (HTTP không chuyển HTTPS) đang mở | Cao | Tiêu chí exit #1 không đạt → khuyến nghị không nên release | Retest trên môi trường mới ngay khi sẵn sàng; báo DEV xử lý cấu hình máy chủ sớm | `docs/bugs/README.md` |
| R5 | Con người | Repo **chưa có** project automation — phải dựng framework từ đầu, và người phụ trách là **QA Lead kiêm nhiệm** (Anh Tester) | Cao | Việc quản lý đợt (duyệt TC, báo cáo tuần, trả lời tester) chiếm thời gian dựng automation; automation không kịp phủ regression 20-11-2026 | Automation **không** chặn manual; ưu tiên automate bộ Smoke `LOGIN` trước; tới báo cáo tiến độ thứ Sáu đầu tiên sau 06-10-2026 mà chưa chạy được Smoke tự động → cân nhắc thu hẹp phạm vi automation | Phiếu `Nhân lực` · kiểm tra repo 17-09-2026 |
| R6 | Tổ chức | Dùng song song Jira và file markdown — hai nguồn lệch nhau | Thấp | Báo cáo tổng hợp lấy số sai, bug trùng hoặc sót | Đã chốt nguồn chính: **Jira cho trạng thái bug · repo cho execution report**; đồng bộ qua `/create-bug-report` (đẩy Jira) | Phiếu `Công cụ` |
| R7 | Tổ chức | Môi trường sẵn sàng 05-10-2026, **ngay trước** ngày bắt đầu thực thi 06-10-2026 — không còn ngày đệm cho smoke xác nhận môi trường | Cao | Môi trường trễ hoặc smoke fail là trễ ngày bắt đầu; bắt đầu khi chưa đạt tiêu chí vào #10 dễ tràn BLOCKED | DEV bàn giao sớm hơn nếu được; chuẩn bị sẵn tài khoản 3 vai trò và mô tả dữ liệu nền trước 05-10-2026; smoke fail → dời ngày bắt đầu, **không** bắt đầu rồi chữa sau | Phiếu `Lịch` |
| R8 | Tổ chức | 6 bug `LOGIN` xác nhận trên bản demo; trong đó `BUG_login_1787226515_TC018` nhiều khả năng **không phải lỗi** (ranh giới chuẩn RFC — phát hiện 11-09-2026) | Trung bình | Số bug mở bị thổi phồng trong báo cáo release | Retest cả 6 bug trên môi trường mới; xem xét đóng `TC018` với trạng thái *không phải lỗi* | `TEST_CASES_LOGIN_SUMMARY.md` — Nhật ký thay đổi |
| R9 | Con người | Tester `LOGIN` chưa chắc có kỹ năng DevTools cho 25 TC `@TechCheck` | Trung bình | Phần 🔧 bị bỏ qua, `TC_025` và `TC_041` không chạy được | Xác nhận kỹ năng (ô treo 7); không có thì giao phần 🔧 cho automation | `TEST_CASES_LOGIN_SUMMARY.md` — Bộ chạy đề xuất |
| ~~R10~~ | Tổ chức | ✅ **Đóng ở v1.2** — đã có ngày code freeze, release và ước lượng công sức | — | — | — | Phiếu `Lịch` · `Ước lượng` |
| R11 | Kỹ thuật | 5 REQ được đưa lại (`REQ-CUST-79` · `REQ-PRJ-89` · `91` · `94` · `104`) vẫn ở trạng thái ⚪, chưa có hành vi đã kiểm chứng; danh mục và tài liệu `PRJ` còn lệch số `94` / `93` | Trung bình | TC cho 5 REQ viết theo suy đoán; môi trường chỉ sẵn sàng 05-10-2026 — sau hạn xong TC 02-10-2026 | Khảo sát bổ sung bằng `/update-requirements-from-ticket` ngay khi có môi trường; TC của 5 REQ được phép hoàn tất sau 02-10-2026 và ghi rõ trong báo cáo tiến độ | Phiếu `Phạm vi` · `docs/requirements/README.md` |
| R12 | Tổ chức | Ước lượng 19,0 người-ngày **chưa gồm automation** và thấp so với khối lượng (183 REQ chưa có TC · nhiều vòng retest trong 33 ngày thực thi) | Trung bình | Báo cáo tiến độ so công sức thực tế với con số quá thấp → báo *trễ* sai, hoặc che mất việc thật sự thiếu | Bổ sung hạng mục automation (ô treo 5); rà lại con số viết TC và thực thi sau báo cáo tiến độ đầu tiên | Mục 7.2 |
| R13 | Kỹ thuật | Automation của QA chỉ đặt được ở **tầng UI**: cấp Component không thuộc đợt, QA không có quyền gọi API — kim tự tháp kiểm thử bị lộn ngược | Cao | Suite UI chạy chậm, dễ vỡ khi giao diện đổi; regression tự động không kịp chạy trong 4 ngày hồi quy 20→25-11-2026 | Giữ suite nhỏ: chỉ Smoke và TC Priority High có `Automation: Yes`; xin quyền gọi API cho QA hoặc đề nghị Dev bổ sung test tầng API cho `CUST`/`PRJ` | Mục 2.3 · 3.1 · 3.7 |

### 8.2 Rủi ro SẢN PHẨM — tóm tắt

> **Nguồn chính** là mục `RISK-xx` trong tài liệu requirements từng module — bảng này chỉ tóm tắt rủi ro đang hiệu lực, **bỏ** rủi ro đã đóng hoặc đã chấp nhận, và rủi ro chỉ ảnh hưởng cách viết automation. Sửa ở tài liệu nguồn, **không** sửa ở đây. Tài liệu nguồn chưa chấm mức rủi ro → cột *Mức* để `—`; chấm khi sinh TC theo RBT cho `CUST`/`PRJ`.

| Module | Rủi ro | Mức | Kiểm soát bằng | Nguồn |
|---|---|---|---|---|
| `LOGIN` | Không có lớp chống thử vét cạn: không CAPTCHA, không giới hạn tần suất, không khoá tài khoản | — | Ghi nhận hiện trạng, báo đội phát triển · pentest ngoài phạm vi (2.2) | [`RISK-LOGIN-01`](../requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md) |
| `LOGIN` | Cookie ghi nhớ đọc được bằng JavaScript (không có cờ `HttpOnly`) | — | Báo đội phát triển (`AMB-LOGIN-07`) · ghép vào kiểm thử bảo mật | [`RISK-LOGIN-02`](../requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md) |
| `LOGIN` | Module là cổng vào của toàn hệ thống — hỏng là chặn kiểm thử mọi module khác | — | Nhóm B chạy đầu tiên trong mọi bộ smoke | [`RISK-LOGIN-06`](../requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md) |
| `CUST` | Entity trung tâm — hơn 10 module tham chiếu tới khách hàng | — | Sau mỗi lần sửa `CUST`, chạy kèm smoke của module phụ thuộc · kiểm thử cross-module với `PRJ` | [`RISK-CUST-01`](../requirements/customers/REQUIREMENTS_CUSTOMERS_SUMMARY.md) |
| `CUST` | Thao tác xoá dùng GET — mở thẳng URL là xoá, không cần xác nhận | — | Cấm đưa URL xoá vào bước điều hướng; chỉ xoá qua nút `Delete` với bản ghi do test tạo | [`RISK-CUST-06`](../requirements/customers/REQUIREMENTS_CUSTOMERS_SUMMARY.md) |
| `PRJ` | Module là điểm gom của 9 module khác qua 17 tab trang chi tiết | — | Kiểm thử cross-module · chạy smoke module liên quan khi `PRJ` đổi | [`RISK-PRJ-01`](../requirements/projects/REQUIREMENTS_PROJECTS_SUMMARY.md) |
| `PRJ` | Thao tác xoá dùng GET | — | Như `RISK-CUST-06` | [`RISK-PRJ-03`](../requirements/projects/REQUIREMENTS_PROJECTS_SUMMARY.md) |
| `PRJ` | Số liệu tổng quan không khớp bảng — đếm `In Progress` lệch 7 dòng (`AMB-PRJ-02`) | — | Không viết khẳng định dựa trên số đếm tổng quan cho tới khi `AMB-PRJ-02` được trả lời | [`RISK-PRJ-05`](../requirements/projects/REQUIREMENTS_PROJECTS_SUMMARY.md) |

## 9. Quản lý lỗi

> Nội dung theo ISTQB CTFL v4.0 mục 5.5. Mục này là **phần mở rộng** so với khung 29119-3 — xem 12.1. Nhóm `Quản lý lỗi` của phiếu **còn trống** (ô treo 11) → quy trình và hai thang dưới đây là **mặc định của repo, chờ xác nhận**.

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

> ⚠️ Bug đồng bộ lên **Jira**, và Jira là nguồn chính cho trạng thái bug (5.3). Workflow Jira của dự án có trạng thái khác (VD *Từ chối* · *Trùng* · *Hoãn*) → khai `Quy trình trạng thái: riêng` và thay bảng này (ô treo 11). Liên quan trực tiếp: `BUG_login_1787226515_TC018` nhiều khả năng **không phải lỗi** (R8) — quy trình mặc định **chưa có** trạng thái để đóng loại này.

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
| Người phân loại lỗi (triage) | ❓ (ô treo 11) |
| Họp phân loại lỗi | ❓ (ô treo 11) |
| Bug đang mở tại ngày lập | **6** — 🔴 Critical 1 · 🟠 Major 0 · 🟡 Minor 3 · 🟢 Trivial 2 · toàn bộ thuộc `LOGIN`, xác nhận trên **bản demo** (R8) — [`docs/bugs/README.md`](../bugs/README.md) |

| Severity | Thời hạn phản hồi | Thời hạn sửa xong |
|---|---|---|
| Critical | ❓ | ❓ |
| Major | ❓ | ❓ |
| Minor | ❓ | ❓ |
| Trivial | ❓ | ❓ |

> Thời hạn **không có mặc định** — agent không đặt số. Chốt sớm thời hạn cho **Critical**: `BUG_login_1785678750_TC039` đang mở và chặn tiêu chí exit #1 (R4).

## 10. Sản phẩm bàn giao

| Sản phẩm | Nơi lưu | Workflow sinh ra |
|---|---|---|
| Master Test Plan + bản lưu phiếu | `docs/test-plans/test_plan_release_1.0.md` · `test_plan_release_1.0.input.yaml` | `/generate-master-test-plan` |
| Tài liệu requirements bổ sung cho 5 REQ được đưa lại | `docs/requirements/<module>/` | `/update-requirements-from-ticket` |
| Test cases `CUST`, `PRJ` | `docs/testcases/<module>/web/` | `/generate-testcases-manual-rbt` |
| Execution report | `docs/executions/<module>/web/run_*/` | `/execute-test-cases` |
| Retest report | `docs/executions/<module>/web/retest_*/` | `/retest-fixed-bugs` |
| Bug report | `docs/bugs/<module>/web/` · Jira | `/create-bug-report` |
| Automation framework · script · report | Project automation · `reports/` | `/generate-automation-framework` · `/generate-automation-web` |
| Ma trận kết hợp cross-module | Theo workflow | `/generate-cross-module-test-plan` |
| Ma trận truy vết | `traceability_matrix.md` | `/generate-traceability-matrix` |
| Báo cáo tiến độ | `docs/executions/test_progress_release_1.0_<YYYYMMDD>.md` | `/generate-test-progress-report` |
| **Báo cáo tổng hợp** | `docs/executions/test_summary_release_1.0_*.md` | `/generate-test-summary-report` |

## 11. Phê duyệt

| Vai trò | Tên | Phiên bản duyệt | Ngày | Ý kiến |
|---|---|---|---|---|
| QA Lead | Anh Tester | v1.3 | | |
| Product Owner | ❓ Tên — ô treo 2 | v1.3 | | |

> Bản v1.2 chưa được duyệt. Bản duyệt nào trước v1.3 **không** tự áp cho v1.3.

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

**Không áp dụng — tổ chức chưa có Test Policy và Test Strategy** (Anh Tester xác nhận 17-09-2026, phiếu `Chuẩn tổ chức`).
