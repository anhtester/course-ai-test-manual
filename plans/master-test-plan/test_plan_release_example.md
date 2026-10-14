> 📘 **TÀI LIỆU MẪU — DỮ LIỆU HƯ CẤU.** Hệ thống *ShopMini*, tên người, ngày tháng, số liệu đều là giả định để minh hoạ một Master Test Plan **đã điền đủ và đã duyệt**, sinh bởi `/generate-master-test-plan` từ phiếu [`test_plan.template.yaml`](test_plan.template.yaml). Dùng để tham khảo cách viết từng mục — **không** chép số liệu sang dự án thật.
>
> Plan thật nằm ở `docs/test-plans/test_plan_<slug>.md`, sinh từ phiếu `plans/master-test-plan/test_plan.config.yaml`. Plan mới lập thường còn ô `❓` — bản mẫu này là trạng thái **sau khi** đã trả lời hết (phiên bản v1.2).

---

# Master Test Plan — ShopMini · Release 2.0

## Kiểm soát tài liệu

### Thông tin tài liệu

| | |
|---|---|
| Mã tài liệu | `test_plan_release_example` |
| Phiên bản tài liệu | v1.2 |
| Trạng thái | 🟩 Đã duyệt — v1.2 ngày 12-10-2026 |
| Mức phân loại | Nội bộ |
| Ngày lập | 05-10-2026 |
| Ngày hiệu lực | 12-10-2026 |
| Người lập | Trần Minh Quân — QA Lead |
| Người review | Hoàng Văn Nam — kiểm thử viên, review chéo toàn tài liệu · Võ Quốc Bảo — DevOps, review mục 5 |
| Người phê duyệt | Lê Thu Hà — Product Owner · Phạm Đức Long — Project Manager — chữ ký ở mục 11 |
| Hệ thống · Build | ShopMini — hệ thống quản lý bán hàng · Web `2.0.0-rc1` · App Android `2.0.0 (build 200)` · API `v2` |
| Phiếu đầu vào | `docs/test-plans/test_plan_release_example.input.yaml` (bản lưu của `test_plan.config.yaml`) |
| Cấu trúc tài liệu | Biên soạn **theo cấu trúc** ISO/IEC/IEEE 29119-3 — Test Plan · phủ đủ nội dung điển hình của ISTQB CTFL v4.0 mục 5.1.1 · ánh xạ ở mục 12 |

> **Ô còn treo:** không còn. Tên mục 29119-3 ở mục 12.1 đã được bộ phận QA đối chiếu với bản chuẩn công ty đang dùng ngày 08-10-2026.

### Lịch sử thay đổi

| Phiên bản | Ngày | Người sửa | Mục thay đổi | Nội dung | Người duyệt |
|---|---|---|---|---|---|
| v1.2 | 12-10-2026 | Trần Minh Quân | Kiểm soát tài liệu · 3.2.1 · 3.7 · 5 · 9 · 10 · 11 · 12 | Chuyển sang cấu trúc mới: thêm kiểm soát tài liệu (người review, mức phân loại), kiểm thử phi chức năng, chiến lược tự động hoá, tách môi trường · dữ liệu · công cụ, thêm quản lý lỗi theo workflow Jira. **Không** đổi phạm vi, lịch, nhân lực, tiêu chí exit | Lê Thu Hà · Phạm Đức Long — 12-10-2026 |
| v1.1 | 08-10-2026 | Trần Minh Quân | 2.1 · 2.2 · 6 · 7.1 · 7.2 · 12.2 | Đưa `RPT` × Web vào phạm vi; iOS của `ORD` chuyển ra ngoài phạm vi (chưa có bản build); chốt lịch code freeze và release; bổ sung người phụ trách automation; ước lượng lại công sức theo phạm vi mới | Lê Thu Hà · Phạm Đức Long — 09-10-2026 |
| v1.0 | 05-10-2026 | Trần Minh Quân | Toàn bộ | Lập mới | — (được thay bằng v1.1 trước khi duyệt) |

---

## 1. Mục tiêu & Cơ sở kiểm thử

### 1.1 Mục tiêu kiểm thử

| # | Mục tiêu | Đo bằng |
|---|---|---|
| O1 | Luồng đặt hàng từ tạo đơn đến hoàn tất chạy đúng đặc tả trên Web, Android và API | Tiêu chí exit #3, #4, #7 |
| O2 | Không còn lỗi Critical ở đăng nhập, đặt hàng, thanh toán trước ngày release | Tiêu chí exit #1 |
| O3 | Số liệu báo cáo doanh thu khớp với tổng giá trị đơn hàng Hoàn tất trong cùng kỳ | Tiêu chí exit #6 — REQ Critical `REQ-RPT-04`, `REQ-RPT-05` có TC PASS |
| O4 | 120 cửa hàng đang dùng bản 1.x chuyển sang 2.0 mà không mất dữ liệu đơn hàng | Tiêu chí ra cấp Acceptance (mục 3.1) — biên bản UAT |

### 1.2 Cơ sở kiểm thử (Test basis)

| Tài liệu | Phiên bản / ngày cập nhật | Module | Ghi chú |
|---|---|---|---|
| `docs/requirements/auth/REQUIREMENTS_AUTH_SUMMARY.md` + tầng `web/` · `mobile/` · `api/` | Nhật ký thay đổi 30-09-2026 | `AUTH` | 32 REQ · 0 AMB 🔴 |
| `docs/requirements/products/requirements_products.md` + `web/` · `api/` | 28-09-2026 | `PROD` | 45 REQ · 0 AMB 🔴 |
| `docs/requirements/orders/requirements_orders.md` + `web/` · `mobile/` · `api/` | 02-10-2026 | `ORD` | 68 REQ · 2 AMB 🟡 PO chấp nhận treo |
| `docs/requirements/reports/requirements_reports.md` + `web/` | 06-10-2026 | `RPT` | 21 REQ |
| Spec API `docs/requirements/_discovery/sources/openapi_2026-10-11.json` | `info.version` `2.0.0` | `AUTH` · `PROD` · `ORD` | |
| Thiết kế giao diện Figma *ShopMini 2.0* | Bản chốt 25-09-2026 | Cả 4 module | Đối chiếu bố cục, không thay requirements |

> Cơ sở kiểm thử **đổi giữa đợt** (ticket sửa yêu cầu) → cập nhật bằng `/update-requirements-from-ticket` rồi tăng phiên bản plan.

## 2. Phạm vi

### 2.1 Trong phạm vi

> Mỗi dòng là **một module × một nền tảng** — đơn vị báo cáo tiến độ theo dõi và báo cáo tổng hợp chấm tiêu chí exit #7.

| Module | Prefix | Nền tảng | Số REQ | Số TC hiện có | Đã từng chạy? | Ghi chú |
|---|---|---|---|---|---|---|
| Đăng nhập | `AUTH` | Web | 32 (18 chung 3 nền tảng) | 38 | ✅ `run_1791100200` | |
| Đăng nhập | `AUTH` | Mobile (Android) | 32 (chung) | 22 | ✅ automation `reports/` | |
| Đăng nhập | `AUTH` | API | 32 (chung) | 26 | ✅ automation `reports/` | |
| Sản phẩm | `PROD` | Web | 45 | 52 | ✅ `run_1791100900` | |
| Sản phẩm | `PROD` | API | 45 (chung) | 31 | — | Automation sẵn sàng 15-10-2026 |
| Đơn hàng | `ORD` | Web | 68 | 74 | — | Rủi ro cao nhất — chạy ngay sau `AUTH` |
| Đơn hàng | `ORD` | Mobile (Android) | 68 (chung) | 40 | — | |
| Đơn hàng | `ORD` | API | 68 (chung) | 45 | — | |
| Báo cáo doanh thu | `RPT` | Web | 21 | 24 | — | Bổ sung ở v1.1 |
| **Tổng** | | **9 cặp** | **166** | **352** | | |

> Không có REQ ⚪ nào bị loại vì hạn chế môi trường — không cần bảng *REQ cần quyết định lại*.

### 2.2 NGOÀI phạm vi (out of scope)

| Không kiểm thử | Lý do | Ai chịu trách nhiệm | Nguồn quyết định |
|---|---|---|---|
| `ORD` × Mobile (iOS) | Chưa có bản build iOS cho Release 2.0 | Kiểm ở Release 2.1 | Lê Thu Hà — PO, 08-10-2026 (v1.1) |
| Module Khuyến mãi `PROMO` | Không thay đổi ở Release 2.0 — chỉ chạy lại bộ Smoke 8 TC | — | Lê Thu Hà — PO, 05-10-2026 |
| Giao dịch thật qua cổng thanh toán bên thứ ba | Dùng sandbox của nhà cung cấp; giao dịch thật do nhà cung cấp chịu theo hợp đồng dịch vụ | Nhà cung cấp cổng thanh toán | Phạm Đức Long — PM, 05-10-2026 |
| Pentest · quét lỗ hổng | Thuê đơn vị đánh giá độc lập | Công ty đánh giá bảo mật đối tác | Phạm Đức Long — PM, 05-10-2026 |
| Kiểm thử tải · đo ngưỡng thời gian phản hồi | Chưa có công cụ tải. QA chỉ kiểm mức thô: danh sách 1.000 đơn hàng không treo | Đội Hạ tầng — đợt kiểm thử hiệu năng tháng 11/2026 | `test_cases_orders_web.md` — bảng ISO/IEC 25010 |
| Rà soát WCAG đầy đủ | Cần công cụ chuyên dụng. QA chỉ kiểm điều hướng bàn phím và nhãn trường | Đội Dev frontend | `test_cases_auth_web.md` — bảng ISO/IEC 25010 |
| Truy vấn CSDL kiểm tồn kho | QA không có quyền truy cập CSDL | Đội Dev backend xác minh | `docs/requirements/README.md` — Năng lực kiểm thử của QA |
| Khả năng bảo trì (Maintainability) | Đặc tính của mã nguồn | Đội Dev — code review, phân tích tĩnh | Bảng ISO/IEC 25010 của cả 4 module |
| `REQ-ORD-61` — xuất hoá đơn điện tử | Tính năng hoãn sang Release 2.1 | — | Trạng thái REQ ⚪ — quyết định PO 28-09-2026 |

> Mục này đã được thống nhất với PO và PM ngày 09-10-2026. Thay đổi phạm vi phải cập nhật tài liệu, tăng phiên bản và thông báo lại.

### 2.3 Giả định & Ràng buộc

| Loại | Nội dung | Ảnh hưởng tới kiểm thử | Nguồn |
|---|---|---|---|
| Ràng buộc | Staging **dùng chung** với đội Dev | TC phá huỷ (6 TC xoá hàng loạt) chạy khung 18:00–21:00 | `docs/requirements/README.md` · phiếu `moi_truong` |
| Ràng buộc | QA **không** có quyền truy cập CSDL | Nhánh Vòng 3 · Database do đội Dev backend xác minh | `docs/requirements/README.md` — Năng lực kiểm thử của QA |
| Ràng buộc | QA **có** quyền gọi API bằng token test | Chạy được toàn bộ TC API, kể cả kiểm tra quyền truy cập chéo giữa 2 tài khoản | `docs/requirements/README.md` — Năng lực kiểm thử của QA |
| Ràng buộc | Ngân sách kiểm thử 26.000.000 VND, không có khoản cho công cụ tải | Kiểm thử tải tách sang đợt riêng — mục 12.2 | Phiếu `ngan_sach` |
| Giả định | Mỗi build bàn giao đã qua smoke test tự động của Dev | Sai giả định → kích hoạt tiêu chí tạm dừng 4.3 | Dev Lead xác nhận 06-10-2026 |
| Giả định | Dữ liệu nền được nạp lại mỗi sáng thứ Hai | Kết quả các lần chạy trong tuần so sánh được với nhau | DevOps xác nhận 06-10-2026 |
| Giả định | Số TC không tăng quá 10% so với ngày 05-10-2026 | Vượt → ước lượng 7.2 không còn đúng, phải ước lượng lại | Phiếu `uoc_luong.gia_dinh` |

### 2.4 Các bên liên quan & Giao tiếp

| Bên | Vai trò trong đợt | Liên quan tới kiểm thử | Nhận gì | Tần suất | Kênh |
|---|---|---|---|---|---|
| Lê Thu Hà | Product Owner | Duyệt plan · trả lời câu hỏi nghiệp vụ · quyết định release | Plan · báo cáo tiến độ · báo cáo tổng hợp | Hằng tuần thứ Sáu · cuối đợt | Email + họp 30 phút |
| Phạm Đức Long | Project Manager | Duyệt plan · điều phối lịch, nguồn lực · chấp nhận rủi ro khi dừng sớm | Plan · báo cáo tiến độ · báo cáo tổng hợp | Hằng tuần thứ Sáu · cuối đợt | Email |
| Đội Dev | Fix bug · kiểm thử cấp component · xác minh CSDL | Chất lượng build bàn giao quyết định tiêu chí vào | Bug report | Khi phát sinh · họp bug 15 phút mỗi ngày | Jira |
| Võ Quốc Bảo | DevOps | Dựng và duy trì Staging | — | Khi phát sinh | Kênh chat `#shopmini-env` |
| Đại diện 3 cửa hàng thí điểm | Thực hiện UAT | Người quyết định tiêu chí ra cấp Acceptance | Báo cáo tổng hợp | Tuần UAT | Họp trực tiếp |

**Mẫu tài liệu dùng trong đợt:**

| Tài liệu | Mẫu | Workflow sinh |
|---|---|---|
| Test case | Mẫu của `skills-rbt-manual-testing` | `/generate-testcases-manual-rbt` |
| Execution report | Mẫu của `skills-manual-test-executor` | `/execute-test-cases` |
| Bug report | Mẫu của `skills-bug-reporter` — đẩy lên Jira | `/create-bug-report` |
| Báo cáo tiến độ | Mẫu của `skills-test-progress-reporter` | `/generate-test-progress-report` |
| Báo cáo tổng hợp | Mẫu của `skills-test-summary-reporter` | `/generate-test-summary-report` |
| Biên bản UAT | Mẫu biên bản nghiệm thu của công ty — thư mục dự án trên Google Drive | Cửa hàng ký tay |

## 3. Chiến lược kiểm thử (Test approach)

### 3.1 Cấp độ kiểm thử

| Cấp độ | Trong đợt? | Ai thực hiện | Tiêu chí vào/ra |
|---|---|---|---|
| Component (unit) | ✅ | Đội Dev | Riêng: độ phủ unit test ≥ 70% dòng lệnh trên pipeline CI |
| Component integration | ✅ | Đội Dev | Riêng: 100% contract test API pass trên pipeline CI |
| System | ✅ | QA | Bộ chung mục 4 |
| System integration | ✅ | QA | Bộ chung mục 4 — gồm tích hợp cổng thanh toán sandbox |
| Acceptance (UAT) | ✅ | 3 cửa hàng thí điểm, QA hỗ trợ | Riêng — **Vào:** đã đạt tiêu chí exit cấp System. **Ra:** 3/3 cửa hàng ký biên bản UAT, không còn lỗi Critical do UAT phát hiện |

### 3.2 Loại kiểm thử

| Loại test | Nền tảng | Có làm? | Cách làm | Ghi chú |
|---|---|---|---|---|
| Kiểm thử chức năng | Web | ✅ | Manual theo TC — `/execute-test-cases` | |
| Kiểm thử chức năng | Mobile (Android) | ✅ | Automation — `/generate-automation-mobile` | Repo chưa có workflow chạy tay mobile |
| Kiểm thử chức năng | API | ✅ | Automation — `/generate-automation-api` từ TC `/generate-testcases-api` | |
| Regression | Web · Android · API | ✅ | Automation suite chạy mỗi đêm + checklist regression | `/generate-checklist-test` |
| Retest bug | Mọi nền tảng | ✅ | Web: `/retest-fixed-bugs` · Android, API: chạy lại automation | Critical/Major chạy mode FULL |
| Tích hợp cross-module | Web | ✅ | `/generate-cross-module-test-plan` | Luồng `PROD` → `ORD` → `RPT` |
| Automation | Android · API · 60% regression Web | ✅ | Appium + REST Assured (Java, TestNG) | Bùi Anh Tuấn phụ trách |
| Vòng 3 — Permission · Security · API | Web · API | ✅ | Manual + automation — 3 vai trò Chủ cửa hàng · Thu ngân · Kho | |
| Vòng 3 — Database | — | ❌ QA không có quyền | Đội Dev backend xác minh | Mục 2.2 |
| UAT | Web · Android | ✅ | 3 cửa hàng thí điểm, QA hỗ trợ | Tuần 02-11-2026 |
| Phi chức năng | Web · Android | ✅ một phần | Tương thích · khả dụng · độ tin cậy & phục hồi — chi tiết 3.2.1 | Hiệu năng (tải) · bảo mật chuyên sâu ngoài phạm vi — mục 2.2 |

**Tỷ trọng manual/automation:** Web chạy manual toàn bộ và automate 60% bộ regression · Android và API automation 100% — chi tiết 3.7.

**Thứ tự ưu tiên thực thi** (theo rủi ro sản phẩm — mục 8.2): `AUTH` → `ORD` → `PROD` → `RPT`. `AUTH` là cổng vào của mọi module; `ORD` có 4 rủi ro sản phẩm mức Cao.

#### 3.2.1 Kiểm thử phi chức năng

| Loại | Có làm? | Mục tiêu đo | Ngưỡng chấp nhận | Cách làm · công cụ | Môi trường | Ai thực hiện | TC đã có |
|---|---|---|---|---|---|---|---|
| Hiệu năng | ❌ | — | — | Đợt kiểm thử tải riêng tháng 11/2026 — mục 2.2 · 12.2 | — | Đội Hạ tầng | 1 TC mức thô: danh sách 1.000 đơn hàng không treo (`ORD` × Web) |
| Bảo mật | ❌ chuyên sâu | — | — | Pentest thuê đối tác — mục 2.2. QA vẫn kiểm phân quyền ở Vòng 3 (3.2) | — | Công ty đánh giá bảo mật đối tác | Ma trận phân quyền `AUTH` × Web · API |
| Tương thích | ✅ | Web thao tác đúng trên 3 trình duyệt · app chạy đúng trên 2 máy Android 13–14 | 100% TC bộ Smoke PASS trên từng trình duyệt và từng máy | Smoke Web chạy tay trên Edge, Safari qua dịch vụ trình duyệt đám mây · Smoke Android chạy Appium trên 2 máy | Staging | Đỗ Thị Lan · Bùi Anh Tuấn | Bộ Smoke 42 TC |
| Khả năng truy cập | ❌ | — | — | Rà soát WCAG đầy đủ ngoài phạm vi — mục 2.2 | — | Đội Dev frontend | Điều hướng bàn phím · nhãn trường (`AUTH` × Web) |
| Khả dụng | ✅ | Nhân viên cửa hàng tự tạo đơn trên Android không cần hướng dẫn | 3/3 cửa hàng hoàn tất kịch bản tạo đơn trong ≤ 5 phút ở lần thử đầu | Quan sát trong tuần UAT, ghi vào biên bản UAT | Staging | 3 cửa hàng thí điểm · Đỗ Thị Lan ghi nhận | — |
| Độ tin cậy & phục hồi | ✅ | App Android không mất đơn nháp khi mất mạng giữa chừng | 0 đơn nháp bị mất trong 10 lần ngắt mạng lúc đang tạo đơn | Appium `mobile: setConnectivity` tắt/bật wifi và dữ liệu di động | Staging | Bùi Anh Tuấn | 2 TC `ORD` × Mobile |

### 3.3 Kỹ thuật thiết kế test

| Kỹ thuật | Áp dụng ở đâu |
|---|---|
| Kiểm thử dựa trên rủi ro (RBT) | Cả 4 module — xếp ưu tiên TC |
| Khung 4 vòng Smoke → Functional → Technical → Non-functional | Mọi bộ TC |
| Phân vùng tương đương · Phân tích giá trị biên | Số lượng, đơn giá, mã giảm giá ở `ORD` · giá và tồn kho ở `PROD` |
| Bảng quyết định | Phí vận chuyển theo khu vực × khối lượng × hạng khách hàng ở `ORD` |
| Chuyển trạng thái | Vòng đời đơn hàng: Mới → Đã xác nhận → Đang giao → Hoàn tất / Đã huỷ |
| Output-Class Coverage | Tổ hợp loại sản phẩm × phương thức thanh toán × trạng thái đơn — `/generate-cross-module-test-plan` |

### 3.4 Mức độc lập của kiểm thử

| | |
|---|---|
| Mức độ | Đội QA riêng trong tổ chức |
| Thể hiện ở đâu | Đội QA thuộc phòng Đảm bảo chất lượng, báo cáo trực tiếp PM, **không** báo cáo cho Dev Lead · TC được review chéo giữa các tester |
| Giới hạn | Kiểm thử cấp component do chính Dev viết code thực hiện — độc lập thấp, bù bằng tiêu chí độ phủ trên CI. UAT do cửa hàng thực hiện — độc lập bên ngoài tổ chức, nhưng không kiểm khía cạnh kỹ thuật |

### 3.5 Retest & Regression

- Bug đã fix → `/retest-fixed-bugs`: Critical/Major chạy **mode FULL** (verify + regression quanh vùng fix), Minor/Trivial chạy mode RETEST
- Mỗi build mới → chạy bộ Smoke 42 TC trên cả 3 nền tảng trước khi thực thi tiếp
- Automation regression chạy mỗi đêm lúc 22:00 trên Staging; kết quả đọc lúc 08:30 sáng hôm sau
- Regression đầy đủ lần cuối sau code freeze, 26-10-2026 → 30-10-2026

### 3.6 Chỉ số theo dõi

> Nhóm theo ISTQB CTFL v4.0 mục 5.3.1. Báo cáo tiến độ hằng tuần báo đúng các chỉ số này.

| Nhóm | Chỉ số | Nguồn | Dùng để |
|---|---|---|---|
| Tiến độ kiểm thử | TC đã viết / đã review · TC đã chạy / chưa chạy · PASS · FAIL · BLOCKED | `docs/testcases/` · `execution_report.md` · `reports/` | Báo cáo tiến độ · tiêu chí exit #3, #4, #5, #7 |
| Tiến độ dự án | Công sức thực tế so với ước lượng 7.2 | Báo cáo tiến độ | Phát hiện trễ sớm |
| Lỗi | Bug mới / đã fix / đang mở theo Severity · regression phát sinh | Jira (nguồn chính) · `docs/bugs/` | Tiêu chí exit #1, #2 |
| Độ phủ | REQ có TC · REQ Critical có TC PASS · TC regression High đã automate | `traceability_matrix.md` | Tiêu chí exit #6, #8 |
| Rủi ro | Trạng thái từng rủi ro ở 8.1 | Báo cáo tiến độ | Kiểm soát rủi ro |
| Chi phí | Chi tiêu so với ngân sách 7.3 | PM | Báo cáo tổng hợp |

### 3.7 Chiến lược tự động hoá

| | |
|---|---|
| Mục tiêu | Rút regression Android + API từ 3 ngày chạy tay xuống dưới 2 giờ chạy máy |
| Hiện trạng | Project `shopmini-automation` đã có 88 script Android + API từ Release 1.5 · pipeline Jenkins chạy hằng đêm |
| Tầng kiểm thử (kim tự tháp) | Unit do Dev (độ phủ ≥ 70%) · QA dồn phần lớn vào API · UI chỉ giữ luồng chính — ISTQB CTFL v4.0 mục 5.1.6 |
| Tiêu chí chọn TC để tự động | Priority High · chạy lại mỗi build · kết quả không cần mắt người đánh giá |
| Framework · report | Appium + REST Assured (Java, TestNG) · Allure Report · output trong `reports/` |
| Hệ thống CI | Jenkins |
| Người bảo trì | Bùi Anh Tuấn |

**Phạm vi:**

| Tự động | Không tự động | Lý do không tự động |
|---|---|---|
| TC Android của `AUTH` và `ORD` | `RPT` × Web | Giao diện báo cáo còn đổi liên tục trong Release 2.0 — script sẽ vỡ mỗi build |
| TC API của `AUTH` · `PROD` · `ORD` | Kịch bản UAT | Cần người dùng thật đánh giá |
| 60% bộ regression Web — TC Priority High | | |

**Kích hoạt chạy:**

| Bộ chạy | Khi nào | Môi trường | Ai xem kết quả | Fail thì |
|---|---|---|---|---|
| Smoke API | Mỗi merge request | Staging | Dev tạo merge request | Chặn merge |
| Smoke Android + API | Mỗi build lên môi trường test | Staging | Bùi Anh Tuấn | Chặn thực thi manual — tiêu chí tạm dừng 4.3 |
| Regression đầy đủ | Hằng đêm 22:00 | Staging | Bùi Anh Tuấn, 08:30 sáng hôm sau | Phân loại bằng `/run-and-fix-tests` — **không** sửa test để né bug |

**Nguyên tắc:**
- Script chỉ tính là xong khi PASS ổn định ≥ 2 lần liên tiếp, đủ Allure metadata và screenshot
- Kết quả automation **báo riêng**, không cộng vào pass rate manual của tiêu chí exit #3, #4
- Test chập chờn → `/analyze-flaky-tests` · UI đổi → `/heal-locators` · yêu cầu đổi → `/update-automation-from-impact`

## 4. Tiêu chí Vào / Ra

### 4.1 Tiêu chí VÀO (Entry) — chưa đủ thì CHƯA bắt đầu test

> Nhóm theo ISTQB CTFL v4.0 mục 5.1.3. Trạng thái tại ngày bắt đầu thực thi 13-10-2026.

| # | Nhóm | Điều kiện | Trạng thái |
|---|---|---|---|
| 1 | Nguồn lực | Nhân lực ở mục 6 đã được phân công, đủ người cho 9 cặp module × nền tảng | ✅ |
| 2 | Nguồn lực | Staging sẵn sàng, có dữ liệu nền | ✅ 12-10-2026 |
| 3 | Nguồn lực | Tài khoản test đủ 3 vai trò | ✅ |
| 4 | Nguồn lực | Công cụ sẵn sàng: Jira · Appium + REST Assured · Allure · 2 thiết bị Android | ✅ 09-10-2026 |
| 5 | Nguồn lực | Ngân sách 26.000.000 VND đã duyệt | ✅ 07-10-2026 |
| 6 | Testware | Tài liệu requirements của 9 cặp module × nền tảng đã có | ✅ 9/9 |
| 7 | Testware | AMB 🔴 đã được giải đáp hoặc PO chấp nhận treo | ✅ 0 🔴 — 2 🟡 PO chấp nhận treo |
| 8 | Testware | Test case đã viết và đã review — đủ từng nền tảng | ✅ 352 TC · review xong 09-10-2026 |
| 9 | Chất lượng ban đầu | Build đã deploy lên Staging và truy cập được | ✅ Web `2.0.0-rc1` · API `v2` — 12-10-2026 |
| 10 | Chất lượng ban đầu | Smoke test đã pass | ✅ 12-10-2026 |
| 11 | Chất lượng ban đầu | Bản build Android cài được trên 2 thiết bị | ✅ build 200 — 12-10-2026 |
| 12 | Chất lượng ban đầu | Snapshot spec API khớp build đang test · có token gọi thử | ✅ `openapi` `2.0.0` — 11-10-2026 |

### 4.2 Tiêu chí RA (Exit) — áp cho cấp System và System integration

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
| 8 | TC Priority High của bộ regression đã được automate | 100% |
| 9 | Requirements và TC của 4 module đã qua review tĩnh | 100% — có biên bản review |

☐ Bộ mặc định  ☑ Bộ mặc định + bổ sung — PO và PM xác nhận ngày 09-10-2026  ☐ Bộ tiêu chí riêng của dự án

> ⚠️ **Dừng kiểm thử khi hết thời gian hoặc ngân sách** (ISTQB CTFL v4.0 mục 5.1.3): được coi là hợp lệ **chỉ khi** Lê Thu Hà — PO cùng Phạm Đức Long — PM đã xem xét và **chấp nhận bằng văn bản** rủi ro phát hành mà chưa đạt đủ tiêu chí. Báo cáo tổng hợp khi đó ghi rõ tiêu chí nào chưa đạt và ai chấp nhận — **không** chấm lại thành "Đạt".

### 4.3 Tiêu chí TẠM DỪNG (Suspension) & tiếp tục

**Tạm dừng kiểm thử khi:** Staging sập > 4 giờ · build lỗi không đăng nhập được · > 30% TC BLOCKED cùng một nguyên nhân · phát hiện bug Critical chặn luồng đặt hàng · bản build Android không cài hoặc không mở được trên thiết bị.

**Tiếp tục khi:** nguyên nhân đã xử lý, có build mới, và đã chạy lại bộ Smoke.

> Ngưỡng tạm dừng là đề xuất của agent, đã được QA Lead và PM xác nhận ngày 09-10-2026.

## 5. Môi trường, Dữ liệu & Công cụ

### 5.1 Môi trường kiểm thử

| | |
|---|---|
| Môi trường | Staging — URL lưu ở `.env`, **không** ghi vào tài liệu này |
| Dùng chung với đội khác? | Có — dùng chung với đội Dev. TC phá huỷ chạy khung 18:00–21:00 |
| Khác môi trường đã khảo sát? | Không — requirements khảo sát trên chính Staging |
| Web — trình duyệt | Google Chrome (chính) · Microsoft Edge · Safari — bản ổn định mới nhất, viewport desktop |
| Mobile — thiết bị | Samsung Galaxy A54 · Android 14 · app `2.0.0 (build 200)` bản release · Native Android<br>Xiaomi Redmi Note 12 · Android 13 · cùng bản app |
| API — nguồn spec | `docs/requirements/_discovery/sources/openapi_2026-10-11.json` · môi trường gọi thử: Staging · QA có quyền gọi |
| Người dựng · ngày sẵn sàng | Võ Quốc Bảo — DevOps · 12-10-2026 |

### 5.2 Quản lý dữ liệu kiểm thử

| | |
|---|---|
| Dữ liệu nền | 200 sản phẩm · 3 cửa hàng · 5 tài khoản thuộc 3 vai trò |
| Nguồn dữ liệu | Nạp sẵn (dữ liệu nền) · tự sinh khi chạy (đơn hàng, sản phẩm mới) |
| Tài khoản test | 3 vai trò Chủ cửa hàng · Thu ngân · Kho — mật khẩu ở `.env` |
| Dữ liệu thật của khách hàng | Không |
| Quy tắc sinh dữ liệu | Random + traceable theo `CLAUDE.md` mục 7 — tiền tố `auto_<module>_<timestamp>` |
| Dọn dữ liệu sau khi chạy | Có — người chạy dọn ngay sau mỗi lần chạy, vì Staging dùng chung (R1) |
| Làm mới dữ liệu nền | DevOps nạp lại mỗi sáng thứ Hai |
| Người cung cấp | Võ Quốc Bảo — DevOps |

### 5.3 Công cụ

| Mục đích | Công cụ | Ghi chú |
|---|---|---|
| Quản lý lỗi | Jira | **Nguồn chính khi lệch:** Jira cho bug · repo cho execution report |
| Quản lý kết quả kiểm thử | File markdown trong repo · kết quả automation trong `reports/` | |
| Tự động hoá | Appium + REST Assured (Java, TestNG) · Allure Report | Chi tiết ở 3.7 |
| CI | Jenkins | |
| Khác | Kênh chat `#shopmini-qa` | |

## 6. Nhân lực & Phân công

| Vai trò | Người | Module × nền tảng phụ trách | Ghi chú |
|---|---|---|---|
| QA Lead | Trần Minh Quân | Toàn bộ | Duyệt TC · báo cáo tiến độ thứ Sáu · báo cáo tổng hợp |
| Tester | Nguyễn Thị Mai | `AUTH` × Web · `RPT` × Web | |
| Tester | Hoàng Văn Nam | `ORD` × Web · cross-module | Module rủi ro cao nhất |
| Tester | Đỗ Thị Lan | `PROD` × Web · hỗ trợ UAT | |
| Automation | Bùi Anh Tuấn | `AUTH` × Android · `ORD` × Android · `AUTH` × API · `PROD` × API · `ORD` × API | Bổ sung ở v1.1 |

**Nhu cầu đào tạo:** Đỗ Thị Lan — 1 buổi hướng dẫn DevTools ngày 08-10-2026 để chạy phần 🔧 của TC gắn `@TechCheck`. **Nhu cầu tuyển thêm:** không.

## 7. Lịch trình, Ước lượng & Ngân sách

### 7.1 Lịch trình & Mốc

| Mốc | Ngày | Điều kiện hoàn thành |
|---|---|---|
| Hoàn tất viết & review TC | 09-10-2026 (thứ Sáu) | TC đã review qua `/review-testcases` — đủ từng nền tảng |
| PO, PM duyệt plan | 09-10-2026 (thứ Sáu) | Mục 11 có chữ ký — ✅ |
| Staging sẵn sàng | 12-10-2026 (thứ Hai) | Tiêu chí vào #2, #3 |
| Bắt đầu thực thi | 13-10-2026 (thứ Ba) | Đạt toàn bộ tiêu chí vào 4.1 |
| Báo cáo tiến độ | Hằng tuần, thứ Sáu | `/generate-test-progress-report` — slug `release_example` |
| Code freeze | 23-10-2026 (thứ Sáu) | Sau mốc này chỉ nhận fix bug Critical/Major |
| Regression đầy đủ | 26-10-2026 → 30-10-2026 | Automation + manual trên build sau code freeze |
| UAT | 02-11-2026 → 06-11-2026 | 3/3 cửa hàng ký biên bản |
| Báo cáo tổng hợp | 09-11-2026 (thứ Hai) | `/generate-test-summary-report` — slug `release_example` |
| Release | 12-11-2026 (thứ Năm) | Theo quyết định của PO |

### 7.2 Ước lượng công sức

| | |
|---|---|
| Kỹ thuật (ISTQB CTFL v4.0 mục 5.1.4) | Three-point estimation — QA Lead và 3 tester cùng ước lượng |
| Giả định của ước lượng | Dựa trên Release 1.5 (tỷ lệ công sức kiểm thử/phát triển 1:3) · không tính thời gian cửa hàng làm UAT · số TC không tăng quá 10% so với ngày 05-10-2026 |

| Hạng mục | a (lạc quan) | m (khả năng nhất) | b (bi quan) | E = (a+4m+b)/6 | SD = (b−a)/6 |
|---|---|---|---|---|---|
| Viết & review TC cho 9 cặp module × nền tảng | 18 | 24 | 36 | 25,0 | 3,0 |
| Thực thi manual trên Web | 20 | 26 | 38 | 27,0 | 3,0 |
| Xây dựng và chạy automation Android + API | 15 | 20 | 31 | 21,0 | 2,7 |
| Retest bug và regression đầy đủ | 8 | 12 | 22 | 13,0 | 2,3 |
| Lập báo cáo, họp và quản lý đợt | 5 | 6 | 13 | 7,0 | 1,3 |
| **Tổng** | | | | **93,0 người-ngày** | **±12,3** |

> SD tổng lấy bằng **cộng SD các hạng mục** — cách cộng thận trọng. Đơn vị: người-ngày.

**Đối chiếu năng lực:** 5 người × 26 ngày làm việc (05-10-2026 → 09-11-2026) = 130 người-ngày. Kịch bản bi quan E + SD = 105,3 người-ngày → **đủ**, dư 24,7 người-ngày làm dự phòng cho hỗ trợ UAT và nghỉ phép.

### 7.3 Ngân sách

| Hạng mục | Số tiền | Ghi chú |
|---|---|---|
| Mua 2 thiết bị Android dùng cho kiểm thử | 14.000.000 VND | Samsung Galaxy A54 · Xiaomi Redmi Note 12 |
| Thuê dịch vụ thiết bị/trình duyệt đám mây 3 tháng | 12.000.000 VND | Kiểm Edge và Safari |
| **Tổng** | **26.000.000 VND** | Chi phí nhân sự nằm trong ngân sách dự án, không tính ở đây |

## 8. Rủi ro

### 8.1 Rủi ro DỰ ÁN & biện pháp

> Nhóm theo ISTQB CTFL v4.0 mục 5.2.2. Báo cáo tiến độ hằng tuần theo dõi trạng thái từng dòng.

| # | Nhóm | Rủi ro | Khả năng | Ảnh hưởng | Biện pháp | Nguồn phát hiện |
|---|---|---|---|---|---|---|
| R1 | Kỹ thuật | Staging dùng chung, dữ liệu bị đội Dev sửa trong lúc test | Cao | Kết quả sai lệch, phải chạy lại | TC phá huỷ chạy khung 18:00–21:00; ghi ID bản ghi đã tạo; dữ liệu nền nạp lại mỗi thứ Hai | `docs/requirements/README.md` |
| R2 | Tổ chức | Chưa có bản build iOS cho Release 2.0 | Cao | Người dùng iPhone của 120 cửa hàng chưa được kiểm | Đã chuyển iOS ra ngoài phạm vi (v1.1) · ghi rõ trong báo cáo tổng hợp · lên lịch Release 2.1 | PO 08-10-2026 |
| R3 | Nhà cung cấp | Cổng thanh toán sandbox chậm hoặc ngừng dịch vụ | Trung bình | TC thanh toán BLOCKED hàng loạt | Có mock cổng thanh toán — `/generate-api-mocks` — để chạy tiếp phần không phụ thuộc giao dịch thật | Họp kickoff 05-10-2026 |
| R4 | Tổ chức | Code freeze trễ vì còn nhiều bug Major | Trung bình | Dồn regression, rút ngắn UAT | Họp bug 15 phút mỗi ngày; PM quyết định cắt tính năng nếu trễ quá 2 ngày | Lịch sử Release 1.x |
| R5 | Kỹ thuật | Automation Android chưa ổn định trên máy Xiaomi | Trung bình | Kết quả mobile không tin được | `/analyze-flaky-tests` ngay tuần đầu; vẫn lỗi thì chạy tay trên Samsung làm nguồn chính | Automation dry-run 08-10-2026 |
| R6 | Con người | Chỉ 1 người làm automation cho 5 cặp module × nền tảng | Trung bình | Người đó nghỉ là regression đêm dừng | Tài liệu hoá cách chạy suite; Hoàng Văn Nam được hướng dẫn chạy lại suite | QA Lead 08-10-2026 |
| R7 | Tổ chức | Số TC tăng quá 10% do thay đổi yêu cầu giữa đợt | Thấp | Ước lượng 7.2 không còn đúng | Theo dõi số TC trong báo cáo tiến độ; vượt ngưỡng thì ước lượng lại và tăng phiên bản plan | Giả định 7.2 |

### 8.2 Rủi ro SẢN PHẨM — tóm tắt

> **Nguồn chính** là mục `RISK-<MODULE>-xx` của tài liệu requirements và đánh giá RBT trong tài liệu test case từng module — bảng này chỉ tóm tắt rủi ro cao nhất. Sửa ở tài liệu nguồn, **không** sửa ở đây.

| Module | Rủi ro | Mức | Kiểm soát bằng | Nguồn |
|---|---|---|---|---|
| `ORD` | Tính sai tổng tiền khi áp đồng thời mã giảm giá và phí vận chuyển | 🔴 Cao | Bảng quyết định 18 tổ hợp · automation API | `RISK-ORD-02` |
| `ORD` | Hai thu ngân cùng xác nhận một đơn → trừ tồn kho hai lần | 🔴 Cao | TC đồng thời trên API · Dev xác minh khoá CSDL | `RISK-ORD-05` |
| `ORD` | Đơn đã huỷ vẫn hiện trạng thái Đang giao trên app Android | 🔴 Cao | Chuyển trạng thái trên cả Web và Android | `RISK-ORD-07` |
| `ORD` | Dữ liệu đơn hàng bản 1.x mất khi chuyển sang 2.0 | 🔴 Cao | TC chuyển đổi dữ liệu · UAT tại 3 cửa hàng | `RISK-ORD-09` |
| `AUTH` | Thu ngân xem được báo cáo doanh thu của chủ cửa hàng | 🔴 Cao | Ma trận phân quyền 3 vai trò trên Web và API | `RISK-AUTH-03` |
| `RPT` | Doanh thu tính cả đơn Đã huỷ | 🟡 Trung bình | Đối chiếu tổng đơn Hoàn tất với báo cáo | `RISK-RPT-01` |
| `PROD` | Giá sản phẩm hiển thị khác giữa Web và API sau khi sửa | 🟡 Trung bình | TC chéo nền tảng cùng REQ ID | `RISK-PROD-04` |

## 9. Quản lý lỗi

> Nội dung theo ISTQB CTFL v4.0 mục 5.5. Mục này là **phần mở rộng** so với khung 29119-3 — xem 12.1.

### 9.1 Quy trình trạng thái lỗi

> Theo phiếu `Quy trình trạng thái: riêng` — workflow Jira của ShopMini.

```text
Mới ──phân loại──→ Đang sửa ──Dev sửa──→ Chờ retest ──retest FIXED──→ Đóng
 │                    ▲                      │
 │                    └──── NOT_FIXED ───────┘
 ├──→ Từ chối   (không phải lỗi — QA Lead xác nhận)
 └──→ Hoãn      (chuyển release sau — PO duyệt)
```

| Trạng thái | Ai chuyển | Điều kiện |
|---|---|---|
| Mới | Tester | Bug report đủ Build/Version · TC ID · REQ ID · evidence |
| Đang sửa | Người phân loại lỗi | Đã chốt Severity · Priority ở họp phân loại |
| Chờ retest | Dev | Có build chứa bản sửa |
| Đóng | Tester | Retest `FIXED` — lặp ≥ 2 lần theo Steps gốc |
| Từ chối | QA Lead | Hành vi đúng đặc tả — ghi REQ ID làm căn cứ |
| Hoãn | PO | Chấp nhận để lại cho release sau — **vẫn tính là đang mở** khi chấm tiêu chí exit #1, #2 |

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
| Người phân loại lỗi (triage) | Trần Minh Quân — QA Lead cùng Dev Lead |
| Họp phân loại lỗi | Hằng ngày 15 phút |
| Bug đang mở tại ngày lập | Critical 0 · Major 2 · Minor 5 · Trivial 3 — còn lại từ Release 1.5 |

| Severity | Thời hạn phản hồi | Thời hạn sửa xong |
|---|---|---|
| Critical | 2 giờ làm việc | 1 ngày làm việc |
| Major | 1 ngày làm việc | 3 ngày làm việc |
| Minor | 3 ngày làm việc | Trong Release 2.0 |
| Trivial | Họp phân loại kế tiếp | Backlog |

## 10. Sản phẩm bàn giao

| Sản phẩm | Nơi lưu | Workflow sinh ra |
|---|---|---|
| Master Test Plan + bản lưu phiếu | `docs/test-plans/test_plan_release_example.md` · `test_plan_release_example.input.yaml` | `/generate-master-test-plan` |
| Tài liệu requirements | `docs/requirements/<module>/` — tầng `web/` · `mobile/` · `api/` | `/generate-requirements-from-website` · `/generate-requirements-from-mobile` · `/generate-requirements-from-api` |
| Test cases | `docs/testcases/<module>/` — tầng `web/` · `mobile/` · `api/` | `/generate-testcases-manual-rbt` (web · mobile) · `/generate-testcases-api` (api) |
| Execution report | `docs/executions/<module>/web/run_*/` | `/execute-test-cases` |
| Retest report | `docs/executions/<module>/web/retest_*/` | `/retest-fixed-bugs` |
| Bug report | Jira (nguồn chính) · `docs/bugs/<module>/<nền-tảng>/` | `/create-bug-report` |
| Automation script + report | Project `shopmini-automation` · `reports/` | `/generate-automation-mobile` · `/generate-automation-api` |
| Ma trận truy vết | `traceability_matrix.md` | `/generate-traceability-matrix` |
| Báo cáo tiến độ hằng tuần | `docs/executions/test_progress_release_example_<YYYYMMDD>.md` | `/generate-test-progress-report` |
| Biên bản UAT | Thư mục dự án trên Google Drive | Cửa hàng thí điểm ký |
| **Báo cáo tổng hợp** | `docs/executions/test_summary_release_example_*.md` | `/generate-test-summary-report` |

## 11. Phê duyệt

| Vai trò | Tên | Phiên bản duyệt | Ngày | Ý kiến |
|---|---|---|---|---|
| QA Lead | Trần Minh Quân | v1.2 | 12-10-2026 | Lập và đề xuất duyệt |
| Product Owner | Lê Thu Hà | v1.2 | 12-10-2026 | Đồng ý — chỉ đổi cấu trúc, không đổi nội dung đã duyệt ở v1.1 |
| Project Manager | Phạm Đức Long | v1.2 | 12-10-2026 | Đồng ý thời hạn xử lý lỗi ở 9.4 |
| QA Lead | Trần Minh Quân | v1.1 | 08-10-2026 | Lập và đề xuất duyệt |
| Product Owner | Lê Thu Hà | v1.1 | 09-10-2026 | Đồng ý. iOS kiểm ở Release 2.1 |
| Project Manager | Phạm Đức Long | v1.1 | 09-10-2026 | Đồng ý lịch và ngân sách. Theo dõi sát mốc code freeze |

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
| Kiểm thử hiệu năng | **Test Strategy:** mọi release lớn phải có đợt kiểm thử tải trước khi phát hành | Tách sang đợt riêng tháng 11/2026, **sau** release | Công cụ tải chưa được cấp phép kịp; lượng người dùng 2.0 tăng không đáng kể so với 1.x | Phạm Đức Long — PM, 09-10-2026 |
| Nền tảng iOS | **Test Policy:** mọi release phải kiểm đủ các nền tảng đang phát hành | Không kiểm iOS ở Release 2.0 | Chưa có bản build iOS — mục 2.2 | Lê Thu Hà — PO, 09-10-2026 |
