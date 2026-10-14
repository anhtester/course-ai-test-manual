# Báo Cáo Tổng Hợp Kiểm Thử — Perfex CRM · Release v1.0

| | |
|---|---|
| Phạm vi báo cáo | **Đăng nhập (`LOGIN`) × Web** · **Khách hàng (`CUST`) × Web**, theo phạm vi người yêu cầu khai ngày 09-10-2026. ⚠️ Master Test Plan v1.3 còn tính thêm **Dự án (`PRJ`) × Web**, xem mục 2 |
| Build / Version | `20261009` (theo người yêu cầu). ⚠️ **Không** execution report nào ghi build này, xem mục 2 |
| Môi trường | Staging (theo người yêu cầu). ⚠️ **Mọi** lần chạy đều ghi môi trường là **bản demo dùng chung**, không phải Staging hay môi trường test riêng mà plan cam kết. Chi tiết ở mục 2 |
| Khoảng thời gian | 20-08-2026 → 09-10-2026 (lần chạy bộ TC đầu tiên → lần chạy checklist gần nhất) |
| Ngày lập | 09-10-2026 22:56 |
| Người nhận | PM nội bộ |
| Người lập | Anh Tester — QA Lead (agent hỗ trợ) |
| Kế hoạch đối chiếu | [test_plan_release_1.0.md](../test-plans/test_plan_release_1.0.md) v1.3, **🟨 Draft, chưa duyệt** |
| Nguồn dữ liệu | 3 execution report (2 bộ TC · 1 checklist) · 0 retest report · 6 bug report · 1 RTM (`LOGIN`) · 1 báo cáo tiến độ · 1 báo cáo automation |
| Cấu trúc tài liệu | Biên soạn **theo cấu trúc** ISO/IEC/IEEE 29119-3 — Test Completion Report · ánh xạ ở mục 9 |

> ⚠️ **Báo cáo lập sớm hơn lịch.** Plan mục 7.1 hẹn báo cáo tổng hợp ngày **10-12-2026**, sau code freeze (19-11), hồi quy (20→25-11) và UAT (30-11→04-12). Hôm nay các mốc đó **chưa diễn ra**. Báo cáo này phản ánh tình trạng tại 09-10-2026, **không** thay cho báo cáo cuối đợt.

---

## 1. Khuyến nghị

> ## 🔴 NO-GO
>
> Đạt **2/7** tiêu chí exit. Có 3 điểm chặn release, đều nêu đích danh dưới đây.

**Điểm chặn:**

1. **[BUG_login_1785678750_TC039](../bugs/login/web/BUG_login_1785678750_TC039.md)** (🔴 Critical · P1) **vẫn mở**: trang đăng nhập phục vụ được qua `http://`, không tự chuyển sang HTTPS. Lần retest gần nhất ngày 20-08-2026 ra `NOT_FIXED`. Theo RTM, ngày 19-09-2026 đo lại vẫn còn lỗi.
   *Rủi ro nếu vẫn release:* người dùng gõ địa chỉ không có `https://` sẽ gửi email và mật khẩu dưới dạng chưa mã hoá.
2. **Module Khách hàng chưa được kiểm thử.** Đã có 129 TC (sinh 19-09-2026, review 24-09-2026) nhưng **chưa chạy TC nào**. Khách hàng là dữ liệu trung tâm, hơn 10 module khác tham chiếu tới (`RISK-CUST-01`). PO đã xác nhận module này có **2 lỗi** (`REQ-CUST-42`, `REQ-CUST-43`) nhưng chưa lập bug report.
3. **Không có bằng chứng kiểm thử trên build `20261009` / Staging.** Lần chạy duy nhất trong ngày 09-10-2026 là checklist smoke 14 mục, ghi `Build: Không có thông tin` và chạy trên bản demo dùng chung. Hai lần chạy bộ TC Đăng nhập là ngày 20-08-2026 và 19-09-2026, đều trên bản demo.

**Việc cần làm để gỡ NO-GO:**

| # | Việc | Gỡ điểm chặn |
|---|---|---|
| 1 | Dev sửa cấu hình máy chủ để ép HTTPS (+ HSTS), sau đó QA retest bằng `/retest-fixed-bugs` mode FULL | 1 |
| 2 | Chạy bộ 129 TC Khách hàng trên build `20261009` · Staging bằng `/execute-test-cases`. Lập bug cho mọi TC FAIL, gồm cả hai lỗi đã biết (`TC_040`, `TC_041`, `TC_047`) | 2 |
| 3 | Chạy lại bộ 51 TC Đăng nhập trên build `20261009` · Staging. Execution report **phải** ghi rõ build và môi trường | 3 |
| 4 | Lập lại báo cáo này bằng `/generate-test-summary-report` | — |

**Mức tin cậy của khuyến nghị: thấp.** Có ba lý do. (a) Mọi kết quả đều đo trên bản demo dùng chung, không phải build đang xét. (b) Plan quy định Jira là nguồn chính cho trạng thái bug, nhưng báo cáo này **chưa đối chiếu Jira** (R6). (c) Bộ tiêu chí exit chưa được duyệt.

> ⚠️ Quyết định release thuộc về PM/PO. Báo cáo này cung cấp căn cứ, không thay thế quyết định đó.

---

## 2. Vùng CHƯA được kiểm thử

> **Đọc mục này trước mọi tỷ lệ ở các mục sau.** Mọi tỷ lệ ở mục 4 chỉ tính trên phần **đã chạy**, và phần đó chỉ có module Đăng nhập.

### 2.1 Trong phạm vi release

| Module × nền tảng | Trạng thái | Vì sao chưa test | Rủi ro |
|---|---|---|---|
| **Khách hàng × Web** | 🟥 Có 129 TC · **0 lần chạy** | Không có execution report nào trong `docs/executions/customers/`. Không file nào ghi lý do | **Cao.** Entity trung tâm (`RISK-CUST-01`). Có 2 lỗi đã biết chưa lập bug. Thao tác xoá dùng GET, mở thẳng URL là xoá (`RISK-CUST-06`). 51 TC `@NeedsVerify` có bước chưa có evidence |
| **Đăng nhập × Web trên build `20261009` / Staging** | 🟨 Chỉ rà checklist smoke (14 mục) | Bộ 51 TC chưa chạy trên build này. 38/51 TC có kết quả từ **20-08-2026**, 13 TC còn lại từ 19-09-2026 | **Trung bình.** Smoke 14/14 PASS chưa thay được regression. Không kết luận được build mới có làm vỡ chức năng nào ngoài luồng smoke hay không |
| Đăng nhập, phần 🔧 của 25 TC `@TechCheck` (cần DevTools) | ⬜ Chưa chạy lần nào | Mọi lần chạy đều bỏ phần 🔧 | **Trung bình.** Với `TC_008`, `TC_009` (cookie ghi nhớ) và `TC_024` (mã CSRF), phần 🔧 mới là kiểm chứng thật của REQ. Cả ba đang chấm PASS chỉ dựa trên phần quan sát bằng mắt |
| Đăng nhập: 4 TC PASS **không có ảnh evidence** | 🟨 Người dùng chạy tay, tự báo kết quả | `TC_014` · `TC_026` · `TC_044` · `TC_051`: agent không được thao tác mật khẩu thật, và 2 TC `@PersonalOnly` do QA tự chạy | Thấp. Kết quả đúng là PASS, nhưng không có bằng chứng để người nghiệm thu đối chiếu |

**Nợ kiểm thử:** sau khi gộp, không còn TC nào BLOCKED hay SKIPPED. Tuy vậy, cả 6 TC FAIL và toàn bộ bộ TC Đăng nhập **chưa** được chạy lại trên môi trường mới (plan 3.5 yêu cầu).

### 2.2 Lệch phạm vi so với Master Test Plan — cần PM xác nhận

| Module × nền tảng | Plan v1.3 (mục 2.1) | Người yêu cầu (09-10-2026) | Hiện trạng | Xử lý trong báo cáo |
|---|---|---|---|---|
| **Dự án (`PRJ`) × Web** | ✅ Trong phạm vi | ❌ Không nêu | 104 REQ · **0 TC** · 6 AMB 🔴 treo | **Không** tính vào tiêu chí #7, theo phạm vi người yêu cầu khai. ⚠️ Plan chưa được cập nhật để bỏ `PRJ`. Nếu tính `PRJ`, tiêu chí #7 còn **1/3** |

> Muốn bỏ `PRJ` khỏi Release v1.0 thì cập nhật plan bằng `/generate-master-test-plan` (mục 2.1, 2.2, tăng phiên bản) **trước** khi PM ra quyết định. Bỏ ngầm trong báo cáo là che đi một vùng trắng 104 REQ.

### 2.3 Ngoài phạm vi (đã chốt trong plan 2.2, nhắc lại để không hiểu nhầm độ phủ)

- **20/23 module** của hệ thống chưa khảo sát requirements, gồm Liên hệ, Công việc, Hoá đơn, Thanh toán, Báo cáo và các module khác. Nguồn: [`docs/requirements/README.md`](../requirements/README.md) mục 1
- Cổng khách hàng (khu ngoài `/admin`) · Khu Quản trị hệ thống (Setup)
- Kiểm thử tải · pentest · rà WCAG đầy đủ
- Kiểm chứng tầng API, CSDL, tích hợp: QA không có quyền, **đội Dev** xác minh. Repo **không** có bằng chứng Dev đã xác minh

---

## 3. Đối chiếu tiêu chí Exit

> **Bộ tiêu chí đang dùng:** bảng mặc định ở mục 4.2 của [Master Test Plan](../test-plans/test_plan_release_1.0.md). Anh Tester chọn ngày 17-09-2026, *"hiệu lực khi plan được duyệt"*. Plan **chưa được duyệt** (v1.3 Draft, mục 11 chưa có chữ ký) → bộ tiêu chí **chưa được xác nhận chính thức**. Lịch sử thay đổi của plan cho thấy tiêu chí exit **không** bị đổi sau khi bắt đầu thực thi.

| # | Tiêu chí | Ngưỡng | Thực tế | Kết quả |
|---|---|---|---|---|
| 1 | Bug **Critical** đang mở | 0 | **1**: `BUG_login_1785678750_TC039` | ❌ Không đạt |
| 2 | Bug **Major** đang mở | 0 / có workaround PM chấp nhận | **0** trong số bug đã lập. ⚠️ 2 lỗi `CUST` đã được PO xác nhận nhưng **chưa lập bug, chưa phân loại Severity** (mục 5.3) | ✅ Đạt, nhưng chỉ tính trên bug đã lập |
| 3 | Pass rate TC **Priority High** | ≥ 95% | `LOGIN`: chỉ tính `High` **14/18 = 77,8%** · gộp `Critical` + `High` **24/28 = 85,7%** · `CUST`: chưa chạy | ❌ Không đạt, cả hai cách tính |
| 4 | Pass rate toàn bộ TC đã chạy | ≥ 90% | **45/51 = 88,2%** theo execution report · **46/51 = 90,2%** theo RTM (mục 4, ghi chú ¹) · chỉ có `LOGIN` | ❌ Không đạt, theo kết quả ghi trong execution report |
| 5 | Tỷ lệ **BLOCKED** | ≤ 5% | **0/51 = 0%** (chỉ `LOGIN`) | ✅ Đạt |
| 6 | REQ mức Critical có ≥ 1 TC **PASS** | 100% | `CUST`: **0 REQ** có TC PASS (chưa chạy) · `LOGIN`: 14/14 REQ gắn TC Priority `Critical` có TC PASS | ❌ Không đạt |
| 7 | Cặp module × nền tảng trong phạm vi đã có TC **và** đã chạy | 100% | **1/2 = 50%**: `LOGIN` × Web ✅ · `CUST` × Web ❌ (có TC, chưa chạy). Tính theo plan v1.3 thì **1/3** | ❌ Không đạt |

**Ghi chú chấm:**

- **#3:** bộ TC dùng 4 mức Priority (`Critical` · `High` · `Medium` · `Low`). Báo cáo tiến độ kỳ 1 đã đề nghị làm rõ tiêu chí này có tính cả `Critical` không, nhưng chưa ai chốt. Cả hai cách tính đều **không đạt**. 4 TC `High` FAIL là `TC_016` · `TC_028` · `TC_029` · `TC_039`
- **#4:** hai nguồn lệch nhau chỉ ở `TC_018`, xem ghi chú ¹ mục 4. Báo cáo chấm theo con số **ghi trong execution report**, không chọn con số đẹp hơn. Muốn chốt thì chạy lại `TC_018` theo bản TC hiện hành
- **#6:** tài liệu requirements **không có cột mức độ quan trọng** của REQ, nên "REQ mức Critical" chưa có định nghĩa chính xác. Dù định nghĩa thế nào, `CUST` có 0 TC PASS nên kết quả vẫn là **không đạt**. Phía `LOGIN`, đang tạm dùng "REQ gắn với TC Priority `Critical`" (`REQ-LOGIN-01`, `02`, `03`, `06`, `10`, `11`, `12`, `14`, `15`, `17`, `22`, `29`, `32`, `33`). ⚠️ `REQ-LOGIN-44` (ép HTTPS) gắn bug 🔴 Critical nhưng TC của nó là Priority `High`, nên không nằm trong danh sách này
- **#5:** đạt vì `LOGIN` không còn TC BLOCKED. Con số này không nói gì về `CUST`, vì `CUST` chưa chạy TC nào

---

## 4. Kết quả kiểm thử theo module

### 4a. Manual — bộ TC

| Module | Nền tảng | Tổng TC | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | ⏭️ SKIP | Chưa chạy | Pass rate | Nguồn |
|---|---|---|---|---|---|---|---|---|---|
| Đăng nhập | Web | 51 | 45 | 6 | 0 | 0 | 0 | **88,2%** ¹ | [run_1787215085](login/web/run_1787215085/execution_report.md) (20-08-2026, `001`→`041`) · [run_1789759574](login/web/run_1789759574/execution_report.md) (19-09-2026, `014` · `026` · `034` · `042`→`051`) |
| Khách hàng | Web | 129 | — | — | — | — | **129** | — | Chưa có lần chạy. ⚠️ *Chưa kiểm trên Web* |
| **Tổng đã chạy** | | **51 / 180** | **45** | **6** | **0** | **0** | **129** | **88,2%** | |

> Mỗi TC lấy **kết quả mới nhất** trong mọi lần chạy bộ TC. Ví dụ: `TC_014` BLOCKED ở lần chạy 20-08 rồi PASS ở lần chạy 19-09, nên tính PASS. Pass rate = PASS / (PASS + FAIL + BLOCKED).
>
> ¹ **Hai nguồn lệch nhau ở `TC_018`.** Execution report 20-08-2026 ghi **FAIL** (biến thể `a`, email 260 ký tự). Ngày 19-09-2026, biến thể `a` bị bỏ khỏi TC và bug `TC018` được đóng là *không phải lỗi*. [RTM `LOGIN`](../traceability/login/traceability_matrix_login.md) vì vậy tính `TC_018` là PASS, thành **46 PASS / 5 FAIL = 90,2%**. Báo cáo giữ cả hai con số. `TC_018` theo bản TC hiện hành **chưa được chạy lại**.

**Đăng nhập × Web — theo Priority:**

| Priority | Số TC | ✅ PASS | ❌ FAIL | Pass rate | TC FAIL |
|---|---|---|---|---|---|
| Critical | 10 | 10 | 0 | 100% | — |
| High | 18 | 14 | 4 | 77,8% | `016` · `028` · `029` · `039` |
| Medium | 19 | 18 | 1 | 94,7% | `018` ¹ |
| Low | 4 | 3 | 1 | 75,0% | `004` |

Nguồn Priority: cột `Priority` của [test_cases_login_web.md](../testcases/login/web/test_cases_login_web.md).

**⚠️ Kết quả cũ hơn bản TC hiện hành:** sau lần chạy 20-08-2026, `TC_011`, `TC_018`, `TC_024`, `TC_025` và `TC_039` đã được sửa ngày 19-09-2026 (theo RTM). Riêng `TC_039` đã đo lại cùng ngày, các TC còn lại chưa chạy lại.

### 4b. Kết quả rà checklist (báo riêng, không cộng vào bảng 4a)

| Checklist | Loại | Module · Nền tảng | Build | Số mục | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | ⏭️ SKIP | Mục P1 FAIL | Nguồn |
|---|---|---|---|---|---|---|---|---|---|---|
| `CL-smoke_20261009` | Smoke | Đăng nhập · Web | ⚠️ Không có thông tin | 14 (10 P1 · 3 P2 · 1 P3) | 14 | 0 | 0 | 0 | 0 | [run_1791553365](login/web/run_1791553365/execution_report.md) · 09-10-2026 |

> Đây là tín hiệu **mới nhất** về hệ thống (09-10-2026). Không có mục FAIL nên **không có regression** phát sinh trên luồng smoke. 11 TC liên quan được rà lại và đều khớp kết quả PASS cũ. Plan không có tiêu chí bổ sung riêng cho checklist. Không có checklist Release-readiness nào cho mốc này (`docs/executions/_release/` không tồn tại).

### 4c. Automation (báo riêng, không cộng vào 4a)

| Suite | Lượt chạy | Số test | ✅ PASS | ❌ FAIL | Pass rate | Nguồn |
|---|---|---|---|---|---|---|
| CRM Login — Chrome + Firefox | 08-10-2026, bản demo dùng chung | 20 test × 2 trình duyệt = 40 lượt | 35 | 5 | 87,5% | `D:\AI_Testing_Automation_Course\playwright-typescript-framework\reports\run_and_fix_report.md` (repo automation riêng, **không** nằm trong repo này) |

- 5 lượt đỏ gom về 3 nguyên nhân. `TC_016` đỏ do bug ứng dụng, đúng kỳ vọng. `TC_014` thiếu tài khoản test có mật khẩu chứa chữ cái. `TC_011-d` đỏ trên Firefox do khác biệt giữa trình duyệt, đang chờ chọn cách sửa
- Script phủ **20/51 TC** `LOGIN` (39,2%). `CUST` chưa có script
- ⚠️ Script `TC_004` **PASS** trên chính hành vi mà bug `TC004` coi là lỗi, vì script kiểm một kỳ vọng khác với TC (RTM mục ⚠️). Kết quả xanh này **không** xác nhận `REQ-LOGIN-04`

---

## 5. Tình hình lỗi

> ⚠️ Số liệu lấy từ `docs/bugs/`. Plan (mục 5.3) quy định **Jira là nguồn chính** cho trạng thái bug, nhưng báo cáo này **chưa đối chiếu Jira**. Bug đã được fix trên Jira mà chưa cập nhật repo thì sẽ không hiện ở đây.

### 5.1 Thống kê

| Severity | Đang mở | Đã fix & verify | Đóng — không phải lỗi | Ghi chú |
|---|---|---|---|---|
| 🔴 Critical | **1** | 0 | 0 | Chặn tiêu chí #1 |
| 🟠 Major | 0 | 0 | 0 | |
| 🟡 Minor | 3 | 0 | 0 | |
| 🟢 Trivial | 1 | 0 | 1 | `TC018` đóng 19-09-2026 |
| **Tổng** | **5** | **0** | **1** | Toàn bộ thuộc `LOGIN` × Web |

Nguồn: [`docs/bugs/README.md`](../bugs/README.md) (cập nhật 19-09-2026) · mục *Lịch sử retest* của từng file bug.

### 5.2 Bug đang mở, xếp theo mức ảnh hưởng

| Bug ID | Severity · Priority | Tóm tắt | Workaround | Retest gần nhất |
|---|---|---|---|---|
| [BUG_login_1785678750_TC039](../bugs/login/web/BUG_login_1785678750_TC039.md) | 🔴 Critical · P1 | Trang đăng nhập phục vụ qua HTTP, không ép sang HTTPS, không có HSTS | Người dùng tự gõ đủ `https://` (không ép buộc được) | 20-08-2026 · ❌ NOT_FIXED |
| [BUG_login_1787226514_TC016](../bugs/login/web/BUG_login_1787226514_TC016.md) | 🟡 Minor · P2 | Ô Email không giữ lại giá trị sau khi đăng nhập sai | Gõ lại email | Chưa retest lần nào |
| [BUG_login_1787226516_TC028](../bugs/login/web/BUG_login_1787226516_TC028.md) | 🟡 Minor · P2 | Bỏ trống email ở Quên mật khẩu báo `Email not found` thay vì báo trường bắt buộc | Nhập email trước khi bấm Confirm | Chưa retest lần nào |
| [BUG_login_1787226513_TC004](../bugs/login/web/BUG_login_1787226513_TC004.md) | 🟡 Minor · P3 | Bấm logo không về trang chủ công khai | Không cần | Chưa retest lần nào. ⚠️ Bug đang mâu thuẫn với script automation, mục 4c |
| [BUG_login_1787226517_TC029](../bugs/login/web/BUG_login_1787226517_TC029.md) | 🟢 Trivial · P3 | Ô Email ở Quên mật khẩu không tự xoá sau khi gửi email không tồn tại | Không cần | Chưa retest lần nào |

> Cả 5 bug được xác nhận trên **bản demo**, và chưa bug nào được retest trên build `20261009` hay trên môi trường mới (plan 3.5 · R8).

### 5.3 Lỗi đã biết nhưng chưa lập bug

| REQ | Lỗi | Ai xác nhận | TC sẽ FAIL | Severity |
|---|---|---|---|---|
| `REQ-CUST-43` | Ô Company nhập toàn khoảng trắng vẫn lưu được, tạo ra khách hàng không có tên. Bản ghi này hiện trống ở mọi dropdown của hơn 10 module tham chiếu | PO, 19-09-2026 (`AMB-CUST-02`) | `TC_040` · `TC_047` | **Chưa phân loại** |
| `REQ-CUST-42` | Lỗi bắt buộc nằm ở tab đang ẩn thì hệ thống không tự chuyển sang tab đó, người dùng không biết vì sao không lưu được | PO, 19-09-2026 (`AMB-CUST-03`) | `TC_041` | **Chưa phân loại** |

> Hai lỗi này chưa tính vào tiêu chí #1, #2 vì chưa có bug report. Nếu được phân loại là Major trở lên, tiêu chí #2 sẽ chuyển sang **không đạt**.

### 5.4 Regression phát sinh trong kỳ

**0**, nhưng con số này **không đo được đầy đủ**. Kỳ này không có retest report nào, tức là chưa có bản fix nào để sinh ra regression. Checklist smoke 09-10-2026 cũng không có mục FAIL.

---

## 6. Độ phủ yêu cầu

| Chỉ số | `LOGIN` | `CUST` | Nguồn |
|---|---|---|---|
| REQ trong phạm vi có ≥ 1 TC | 40/40 = 100% | 84/84 = 100% | [RTM `LOGIN`](../traceability/login/traceability_matrix_login.md) · [`docs/testcases/README.md`](../testcases/README.md) mục 2 |
| REQ có **mọi** TC PASS | 35/40 = 87,5% | 0/84 (chưa chạy) | RTM `LOGIN` |
| REQ chỉ có checklist (🟠) | 0 | — | RTM `LOGIN` |
| TC đã automate | 20/51 = 39,2% | 0/129 | RTM `LOGIN` |

- 5 REQ `LOGIN` chưa đạt: `REQ-LOGIN-04`, `16`, `25`, `26`, `44`. Cả 5 đều có bug đang mở
- RTM `LOGIN` sinh lúc **09-10-2026 21:47**, sau lần sửa TC cuối cùng (07-10-2026 20:16), nên **còn mới**. ⚠️ RTM ghi: `docs/` chưa commit sau mốc git `7bb9477`, nên mốc git không khoá được nội dung
- **Chưa có RTM** cho `CUST` và RTM toàn hệ thống (`docs/traceability/traceability_matrix.md`). Số `CUST` lấy từ danh mục test case

---

## 7. Đề xuất hành động

| Ưu tiên | Việc | Ai làm | Command |
|---|---|---|---|
| 🔴 Trước release | Sửa cấu hình máy chủ: ép HTTPS + HSTS (`TC039`), rồi retest mode FULL | Dev → QA | `/retest-fixed-bugs` |
| 🔴 Trước release | Chạy 129 TC Khách hàng trên build `20261009` · Staging. Ưu tiên bộ Smoke (`part_01`, 16 TC) rồi đến TC Priority Critical/High | Lan | `/execute-test-cases` |
| 🔴 Trước release | Chạy lại 51 TC Đăng nhập trên build `20261009` · Staging, gồm cả `TC_018` bản hiện hành. Execution report **bắt buộc** ghi build và môi trường | Hồng | `/execute-test-cases` |
| 🔴 Trước release | Lập bug cho mọi TC `CUST` FAIL, gồm `REQ-CUST-42` và `43`, và phân loại Severity | Lan | `/create-bug-report` |
| 🟠 Trước release | Retest 4 bug Minor/Trivial đang mở trên build mới | Hồng | `/retest-fixed-bugs` |
| 🟠 Trước release | Chốt phạm vi `PRJ` (mục 2.2), duyệt plan v1.3 và xác nhận cách tính tiêu chí #3, #6 | PM · Anh Tester | `/generate-master-test-plan` |
| 🟠 Trước release | Đối chiếu trạng thái 6 bug với Jira | Anh Tester | — |
| 🟠 Trước release | Chốt mâu thuẫn `REQ-LOGIN-04` / `TC_004` / bug `TC004`. Nếu hành vi hiện tại là đúng thì sửa REQ và đóng bug, ngược lại thì sửa script | PO · Anh Tester | `/update-requirements-from-ticket` |
| 🟡 Trước UAT | Chạy phần 🔧 của `TC_008`, `TC_009`, `TC_024` (DevTools). Bổ sung ảnh evidence cho 4 TC chạy tay | Hồng | `/execute-test-cases` |
| 🟡 Trước UAT | Cấp tài khoản staff có mật khẩu chứa chữ cái vào `.env`, để `TC_014` chạy được cả manual lẫn automation | Đội DEV | — |
| 🟡 Sau khi chạy `CUST` | Sinh RTM toàn hệ thống | Anh Tester | `/generate-traceability-matrix` |

---

## 8. Yếu tố cản trở tiến độ & Bài học

### 8.1 Điều gì làm chậm đợt này

| Yếu tố | Mất bao lâu | Ảnh hưởng | Đã xử lý thế nào | Nguồn |
|---|---|---|---|---|
| Không có tài khoản test có mật khẩu chứa chữ cái | **30 ngày** (20-08 → 19-09-2026) với manual. Automation **vẫn đỏ** tới 08-10-2026 | `TC_014` BLOCKED ở lần chạy 20-08-2026 | Người dùng chạy tay ngày 19-09-2026 (không có ảnh). Automation chưa xử lý | run_1787215085 · run_1789759574 · báo cáo automation |
| Tiền đề của `TC_034` phụ thuộc module Công việc (cần task có bộ đếm giờ) | **30 ngày** (20-08 → 19-09-2026) | `TC_034` BLOCKED | Agent tự tạo task test, chạy xong thì dọn | run_1789759574 mục 5 |
| Agent không được nhập mật khẩu thật, phải chờ người dùng đăng nhập | Checklist 09-10-2026: **~23 phút** (20:43 → 21:06) | 5/14 mục BLOCKED ở đợt 1 | Người dùng tự đăng nhập, phiên được lưu lại cho lần sau | run_1791553365 |
| Không có môi trường test riêng. Plan cam kết sẵn sàng ngày 05-10-2026 | **Không có dữ liệu thời lượng.** Tới 09-10-2026, chưa lần chạy nào ghi môi trường riêng | Mọi kết quả vẫn đo trên bản demo dùng chung. TC phá huỷ của `CUST` không chạy được | — | Header các execution report · plan 5.1 · R7 |
| Plan chưa được duyệt (hạn 21-09-2026) | Quá hạn **18 ngày** tính đến 09-10-2026 | Bộ tiêu chí exit chưa có hiệu lực chính thức. Phạm vi `PRJ` lệch mà không được ghi nhận | Chưa xử lý | Plan mục 11 |
| Báo cáo tiến độ hằng tuần (thứ Sáu) không được lập | Thiếu kỳ 25-09 và 02-10-2026. Chỉ có kỳ 1 (17-09-2026) | Không có số liệu từng kỳ, nên không phát hiện sớm được việc `CUST` chưa chạy | Chưa xử lý | `docs/executions/test_progress_*` |
| TC bị sửa sau khi chạy mà không chạy lại | Từ 19-09-2026 tới nay (**20 ngày**) | Kết quả cũ không còn khớp bản TC hiện hành, dẫn tới hai con số pass rate khác nhau (88,2% và 90,2%) | Chưa xử lý | RTM `LOGIN` |

**Sai lệch so với lịch và ước lượng của plan (7.1 · 7.2):**

| Mốc | Plan | Thực tế | Sai lệch |
|---|---|---|---|
| Xong TC `CUST` | 02-10-2026 | Sinh 19-09, review 24-09-2026 | ✅ Sớm 8 ngày |
| Xong TC `PRJ` | 02-10-2026 | 0 TC | 🔴 Trễ 7 ngày, chưa bắt đầu |
| Duyệt plan | 21-09-2026 | Chưa duyệt | 🔴 Trễ 18 ngày |
| Môi trường sẵn sàng · bắt đầu thực thi | 05-10 · 06-10-2026 | Không có bằng chứng môi trường riêng. Từ 06-10 tới nay chỉ có 1 lần chạy checklist smoke `LOGIN` | 🔴 Chưa thực thi `CUST` sau 3 ngày làm việc |
| Công sức thực tế so với ước lượng 19,0 người-ngày | — | **Không có dữ liệu.** Không file nào ghi công sức thực tế | — |

**Rủi ro dự án của plan (8.1) đã thành hiện thực:** R1 (với `PRJ`) · R4 (bug Critical `TC039` vẫn mở) · R6 (chưa đối chiếu Jira) · R7 (chưa có môi trường riêng). R8 đã xử lý: `TC018` đóng là *không phải lỗi*. R5 giảm một phần: đã có 20 script automation cho `LOGIN` ở repo riêng.

### 8.2 Bài học rút ra

| Bài học | Áp dụng vào đâu |
|---|---|
| Execution report không ghi build thì không dùng được cho quyết định release. Phải coi đây là ô bắt buộc | Mẫu execution report của `skills-manual-test-executor` · tiêu chí vào #9 ở mục 4.1 Master Test Plan đợt sau |
| Sửa TC sau khi chạy thì phải chạy lại TC đó ngay, nếu không báo cáo sẽ có hai con số | Mục 3.5 *Retest & Regression* của Master Test Plan đợt sau |
| Tài khoản test đặc thù (mật khẩu chứa chữ cái) và tiền đề liên module phải chuẩn bị **trước** khi chạy. Hai việc này làm mất 30 ngày mỗi việc | Tiêu chí vào #3 ở mục 4.1 và mục 5.2 *Dữ liệu kiểm thử* của Master Test Plan đợt sau |
| Bỏ một module khỏi phạm vi phải đi qua cập nhật plan, không chỉ báo miệng lúc lập báo cáo | Mục 2.1 · 2.2 và *Lịch sử thay đổi* của Master Test Plan |
| Báo cáo tiến độ hằng tuần là cách duy nhất để thấy sớm một module chưa chạy | Mục 7.1 *Lịch trình* — gắn người chịu trách nhiệm cho từng kỳ báo cáo |

### 8.3 Tài sản dùng lại được

| Tài sản | Nơi lưu | Dùng lại cho |
|---|---|---|
| Bộ TC Đăng nhập: 51 TC · 71 biến thể | [`docs/testcases/login/`](../testcases/login/TEST_CASES_LOGIN_SUMMARY.md) | Regression mọi build |
| Bộ TC Khách hàng: 129 TC · 155 biến thể, đã review | [`docs/testcases/customers/`](../testcases/customers/TEST_CASES_CUSTOMERS_SUMMARY.md) | Chạy ngay cho Release v1.0 |
| Checklist smoke Đăng nhập: 14 mục, ~15 phút | [`checklist_smoke_20261009.md`](../checklists/login/web/checklist_smoke_20261009.md) | Rà nhanh mỗi build mới. Sinh lại file theo ngày bằng `/generate-checklist-test` |
| 20 script automation Đăng nhập (Chrome + Firefox) | Repo `playwright-typescript-framework` | Bộ smoke tự động. Còn thiếu 4 TC `@Smoke`: `021`, `032`, `035`, `036` |
| RTM Đăng nhập | [`traceability_matrix_login.md`](../traceability/login/traceability_matrix_login.md) | Mẫu cho RTM `CUST` và RTM toàn hệ thống |

---

## 9. Phụ lục — Ánh xạ chuẩn tài liệu

> Tài liệu này biên soạn **theo cấu trúc** ISO/IEC/IEEE 29119-3 — Test Completion Report. Bảng dưới để người duyệt/nghiệm thu đối chiếu; **không** phải tuyên bố đã được đánh giá tuân thủ.

| Mục | ISO/IEC/IEEE 29119-3 — Test Completion Report |
|---|---|
| 1 | Test completion evaluation (kết luận) |
| 2 | Deviations from planned testing · Residual risks |
| 3 | Test completion evaluation |
| 4 | Testing performed · Test measures |
| 5 | Test measures (defect metrics) · Residual risks |
| 6 | Test measures (coverage) |
| 7 | Recommendations |
| 8 | Factors blocking progress · Lessons learned · Reusable test assets |
