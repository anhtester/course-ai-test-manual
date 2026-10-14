---
name: skills-test-summary-reporter
description: Skill tổng hợp kết quả kiểm thử toàn dự án tại một mốc (release/sprint/UAT) thành báo cáo gửi PM, PO, khách hàng — gộp nhiều execution report, bug đang mở, độ phủ RTM, và đưa khuyến nghị go/no-go có căn cứ.
---

# Test Summary Reporter

Purpose: Biến hàng chục file kết quả rời rạc thành **một báo cáo người không đọc code cũng hiểu**, trả lời đúng câu hỏi mà PM/khách hàng hỏi: *"Đã test những gì, còn lỗi gì, có release được không?"*

---

## When to Use

- Sắp release / kết thúc sprint / bàn giao UAT — cần báo cáo tổng hợp
- PM, PO, khách hàng hỏi *"tình hình test thế nào rồi"*
- Cần bằng chứng cho quyết định release (audit, nghiệm thu hợp đồng)
- Tổng kết một đợt regression dài trải nhiều module

> **KHÔNG** dùng skill này để phân tích **một** lần chạy — đó là `skills-test-report-analyzer`. Ranh giới: skill kia phân tích **một phạm vi chạy**, skill này tổng hợp **toàn dự án tại một mốc**.

---

## Ranh giới nghề nghiệp — đọc trước khi viết bất cứ dòng nào

> ### QA **khuyến nghị**, không **quyết định** release.

Báo cáo này đưa ra **khuyến nghị go/no-go kèm căn cứ**. Quyết định release là của PM/PO/business owner — họ cân thêm áp lực thị trường, hợp đồng, chi phí trễ hạn mà QA không nắm.

| ✅ Viết thế này | ❌ Không viết thế này |
|---|---|
| *"Khuyến nghị **NO-GO**: còn 2 bug Critical chưa fix ở luồng thanh toán (BUG_x, BUG_y). Nếu vẫn release, rủi ro là khách hàng mất tiền không đối soát được."* | *"Cấm release."* |
| *"Khuyến nghị **GO có điều kiện**: đạt tiêu chí, trừ module Báo cáo chưa test (0 TC). Chấp nhận được nếu module đó chưa mở cho người dùng."* | *"OK release thoải mái."* |

**Luôn nêu rủi ro kèm khuyến nghị GO.** Khuyến nghị GO không kèm rủi ro tồn đọng là báo cáo vô trách nhiệm — sau này có sự cố thì không ai biết QA đã cảnh báo hay chưa.

---

## Nguyên tắc số liệu

1. **Mọi con số phải truy được về file nguồn.** Mỗi bảng có cột link tới `execution_report.md` / `bug_*.md` tương ứng. Không gõ số từ trí nhớ
2. **Không gộp số manual với automation.** Hai phạm vi khác nhau — báo riêng, có thể để cạnh nhau nhưng không cộng
3. **Vùng chưa test đứng TRƯỚC mọi tỷ lệ.** Cùng nguyên tắc với RTM: module chưa có TC thì không có gì để fail, pass rate vẫn đẹp trong khi cả vùng đó chưa ai chạm tới
4. **BLOCKED không phải PASS.** Trừ khỏi phần đã kiểm chứng, nêu riêng
5. **Số liệu mâu thuẫn giữa các nguồn → báo ra, không tự chọn số đẹp hơn**
6. **Không gộp kết quả checklist với kết quả bộ TC.** Mục checklist là đơn vị rà nhanh, không phải TC — 12 mục smoke cộng vào 36 TC thì cả tổng lẫn pass rate đều vô nghĩa. Phân loại từng lần chạy theo ô `Loại nguồn` ở header execution report (thiếu ô → `Nguồn TC` nằm trong `docs/checklists/` là checklist, còn lại là bộ TC). Kết quả checklist báo ở **bảng riêng** (mục 4b)
7. **Số của một module × nền tảng = kết quả mới nhất của TỪNG TC**, không phải "lần chạy mới nhất". Lần chạy sau thường chỉ chạy lại vài TC BLOCKED/FAIL — lấy nguyên lần đó làm số chính là báo 3 TC thay cho 36. Gộp mọi lần chạy **bộ TC** cùng `Nguồn TC`, mỗi TC lấy kết quả của lần chạy mới nhất có chạy TC đó (cùng cách `scripts/execution-viewer` gộp)

---

## Tiêu chí Exit — chốt TRƯỚC, không chấm sau

⛔ **Bắt buộc xác định tiêu chí exit trước khi nhìn kết quả.** Nhìn số rồi mới đặt ngưỡng là hợp thức hoá kết quả, không phải đánh giá.

**Nguồn tiêu chí, theo thứ tự:**

1. **Master Test Plan của mốc** — `docs/test-plans/test_plan_<mốc>.md` mục **4.2**, gồm **cả bảng mặc định lẫn bảng *Tiêu chí bổ sung của dự án*** (#8 trở đi). Có plan thì lấy đúng bộ đã công bố, **không hỏi lại**. Plan đánh dấu *bộ mặc định chờ PM xác nhận* mà chưa có người duyệt → báo cáo vẫn ghi "chưa được xác nhận". Lịch sử thay đổi của plan cho thấy tiêu chí bị đổi **sau** ngày bắt đầu thực thi → nêu ra ở mục 3
2. Không có plan → hỏi user tiêu chí của dự án
3. Không có cả hai → dùng bộ mặc định dưới đây và **ghi rõ trong báo cáo là bộ mặc định của agent, cần PM xác nhận**

`/generate-master-test-plan` chép **nguyên văn** bảng này vào mục 4.2 của plan — sửa bảng ở đây thì plan lập sau tự theo:

| # | Tiêu chí mặc định | Ngưỡng |
|---|---|---|
| 1 | Bug **Critical** đang mở | **0** |
| 2 | Bug **Major** đang mở | 0, hoặc có workaround được PM chấp nhận bằng văn bản |
| 3 | Pass rate TC **Priority High** | **≥ 95%** |
| 4 | Pass rate toàn bộ TC đã chạy | ≥ 90% |
| 5 | Tỷ lệ **BLOCKED** | ≤ 5% |
| 6 | REQ mức Critical có ít nhất 1 TC **PASS** | 100% |
| 7 | Module trong phạm vi release đã có TC và đã chạy — tính trên **từng cặp module × nền tảng** trong phạm vi | 100% |

> Tiêu chí #7 chấm theo **cặp module × nền tảng**: module có web đã chạy nhưng mobile trong phạm vi chưa chạy thì cặp mobile là **chưa đạt** — không được tính đủ nhờ lần chạy web.

**Kết quả checklist trong các tiêu chí:**

| Tiêu chí | Checklist có được tính? |
|---|---|
| #3 · #4 · #5 — pass rate, tỷ lệ BLOCKED | ❌ Không — các tiêu chí này đo **bộ TC**. Plan có tiêu chí bổ sung riêng cho checklist (VD *"smoke 100% mục P1 PASS"*) thì chấm tiêu chí đó trên bảng 4b, quy đổi `P1` = High · `P2` = Medium · `P3` = Low |
| #6 — REQ Critical có TC PASS | ⚠️ Chỉ khi REQ **không có TC nào** (checklist REQ-based) — mục checklist có `REQ ID` đó PASS thì tính, và cột *Thực tế* ghi rõ số REQ đạt nhờ checklist (VD `12/12 · 2 REQ chỉ có checklist PASS`). REQ đã có TC thì phải có TC PASS |
| #7 — module × nền tảng đã có TC và đã chạy | ❌ Cặp chỉ có lần chạy checklist là **chưa đạt** — ghi *"chỉ rà checklist <loại>"* ở mục 2 |

> 🚨 **Checklist mới hơn mà FAIL, bộ TC cũ hơn mà PASS → tin checklist.** Mục checklist FAIL có `TC ID liên quan` đã PASS ở lần chạy bộ TC trước đó trên build cũ hơn = **build mới đã vỡ**. Nêu ở mục 5 như regression, ghi cả hai nguồn — **không** để con số PASS cũ của bộ TC che đi.

> **Dừng khi hết thời gian/ngân sách** (ISTQB CTFL v4.0 mục 5.1.3) — hợp lệ khi người có quyền đã **chấp nhận bằng văn bản** rủi ro phát hành. Báo cáo vẫn chấm tiêu chí nào **Không đạt**, và ghi thêm *ai chấp nhận, ngày nào, văn bản nào* — **không** đổi thành Đạt.

Mỗi tiêu chí chấm **Đạt / Không đạt / Không áp dụng**, kèm số thực tế. Chấm "gần đạt" là không được — 94.8% so với ngưỡng 95% là **không đạt**, có thể chấp nhận nhưng phải ghi là ngoại lệ có người duyệt.

---

## Input

| Nguồn | Lấy gì | Bắt buộc |
|---|---|---|
| `docs/test-plans/test_plan_<mốc>.md` | Tiêu chí exit đã công bố (mục 4.2) · mục tiêu kiểm thử (1.1) · phạm vi module × nền tảng (2.1) · ngoài phạm vi (2.2) · lịch & ước lượng công sức (7.1 · 7.2) · rủi ro dự án (8.1) | Nếu có |
| `docs/executions/test_progress_<mốc>_*.md` | Chỉ số từng kỳ · **thời lượng trở ngại** · rủi ro đã xảy ra · sai lệch lịch — ISTQB CTFL v4.0 mục 5.3.2: báo cáo tổng hợp *"uses test progress reports"* | Nếu có |
| `docs/executions/<module>/<nền-tảng>/run_*/execution_report.md` · kiểu cũ `docs/executions/<module>/run_*/` | PASS/FAIL/BLOCKED/SKIPPED từng module × nền tảng — phân loại **bộ TC / checklist** theo ô `Loại nguồn` | ✅ |
| `docs/executions/_release/<nền-tảng>/run_*/execution_report.md` | Kết quả checklist Release-readiness — chọn lần chạy có `Nguồn TC` là `checklist_release_<mốc>.md`, quy từng mục về module theo cột `Module` | Nếu có |
| `docs/executions/<module>/<nền-tảng>/retest_*/retest_report.md` · kiểu cũ `docs/executions/<module>/retest_*/` | Bug đã verify fix · regression phát sinh | Nếu có |
| `docs/bugs/README.md` + `docs/bugs/<module>/<nền-tảng>/BUG_*.md` · kiểu cũ `docs/bugs/<module>/BUG_*.md` | Bug đang mở theo Severity · Lịch sử retest | ✅ |
| `docs/requirements/README.md` | **Module chưa recon** — vùng mù, mục 1 của báo cáo | ✅ |
| `docs/traceability/traceability_matrix.md` — file chung: độ phủ theo module, ⬛ module ngoài RTM; chi tiết theo `## Bản đồ tài liệu` sang file module (không có file chung thì đọc thẳng `docs/traceability/<module>/traceability_matrix_<module>.md`; RTM kiểu cũ ở chỗ khác vẫn đọc) | Độ phủ REQ ↔ TC ↔ Automation · REQ 🟠 chỉ có checklist · REQ ⏭️ loại trừ (đã trừ khỏi mẫu số — nêu số lượng). **Kiểm `Ngày sinh` / `Mốc git` từng module ở Bản đồ tài liệu** — module có RTM sinh trước lần sửa TC cuối cùng thì ghi *"RTM đã cũ, sinh ngày …"* ở mục 6 | Nếu có |
| Report automation trong `reports/` | Kết quả suite tự động | Nếu có |

> Thiếu `docs/bugs/` (đội dùng Jira) → lấy qua `skills-jira-integration`, đừng bỏ trống mục bug.
>
> 📂 Tài liệu sinh trước khi có tầng nền tảng **không** bị di chuyển — quét **cả** `<module>/<nền-tảng>/` lẫn `<module>/`, nếu không báo cáo sẽ thiếu lần chạy và bug của module làm theo kiểu cũ. Lần chạy kiểu cũ không ghi nền tảng → tính là `web` nếu execution report chạy trên trình duyệt, ngược lại ghi `—` và nêu ở mục 2.

---

## Chuẩn tham chiếu

Báo cáo này tương ứng với **ISO/IEC/IEEE 29119-3 — Test Completion Report** (chuẩn hiện hành về tài liệu kiểm thử, thay thế họ IEEE 829 — bản 829-2008 đã bị thay thế, *superseded*). Cặp đôi của nó là Master Test Plan do `/generate-master-test-plan` sinh ra: **plan công bố tiêu chí trước, report chấm lại sau**.

| Mục báo cáo | ISO/IEC/IEEE 29119-3 — Test Completion Report |
|---|---|
| 1. Khuyến nghị | Test completion evaluation (kết luận) |
| 2. Vùng chưa kiểm thử | Deviations from planned testing · Residual risks |
| 3. Đối chiếu tiêu chí exit | Test completion evaluation |
| 4. Kết quả theo module | Testing performed · Test measures |
| 5. Tình hình lỗi | Test measures (defect metrics) · Residual risks |
| 6. Độ phủ yêu cầu | Test measures (coverage) |
| 7. Đề xuất hành động | Recommendations |
| 8. Yếu tố cản trở & Bài học | Factors blocking progress · Lessons learned · Reusable test assets |

> ⚠️ Ghi **tên mục** của chuẩn, **KHÔNG ghi số điều khoản** — số đổi giữa các bản phát hành, agent không có bản chuẩn để tra, ghi số là bịa.
>
> ⚠️ **KHÔNG tuyên bố "tuân thủ ISO/IEC/IEEE 29119"** — tuân thủ là kết luận của đánh giá viên. Câu đúng: *"biên soạn theo cấu trúc ISO/IEC/IEEE 29119-3 — Test Completion Report"*.

**Mục 8 là mục hay bị bỏ nhất và mất mát nhiều nhất.** Không ghi lại vì sao đợt này chậm (môi trường sập mấy ngày, chờ tài khoản role, build lỗi phải test lại), thì đợt sau lặp lại nguyên xi và không ai ước lượng đúng được.

---

## Report Template

```markdown
# Báo Cáo Tổng Hợp Kiểm Thử — <Dự án> · <Mốc: Release v2.4 / Sprint 12 / UAT đợt 2>

| | |
|---|---|
| Phạm vi báo cáo | <module nào, build nào> |
| Build / Version | v2.4.3 |
| Môi trường | Staging — `<URL>` |
| Khoảng thời gian | 01-08-2026 → 12-08-2026 |
| Người lập | <tên QA> (agent hỗ trợ) |
| Nguồn dữ liệu | 6 execution report (4 bộ TC · 2 checklist) · 2 retest report · 14 bug report |
| Cấu trúc tài liệu | Biên soạn **theo cấu trúc** ISO/IEC/IEEE 29119-3 — Test Completion Report · ánh xạ ở mục 9 |

---

## 1. Khuyến nghị

> ## 🟡 GO CÓ ĐIỀU KIỆN
>
> Đạt 5/7 tiêu chí exit. Có thể release **nếu** chấp nhận 2 điểm tồn đọng dưới đây.

**Điều kiện kèm theo:**
1. Module **Báo cáo** chưa được kiểm thử (0 TC) — chỉ release được nếu module này chưa mở cho người dùng cuối
2. BUG_customers_1785700456_TC012 (🟠 Major — search wildcard sai) chưa fix; workaround: người dùng tìm bằng từ khoá không chứa `%`

**Rủi ro nếu vẫn release:** người dùng dùng ký tự `%` trong tìm kiếm sẽ nhận kết quả rỗng và tưởng mất dữ liệu → nguy cơ ticket hỗ trợ tăng.

> ⚠️ Quyết định release thuộc về PM/PO. Báo cáo này cung cấp căn cứ, không thay thế quyết định đó.

---

## 2. Vùng CHƯA được kiểm thử

> Đọc mục này trước mọi tỷ lệ bên dưới. Mọi con số ở mục 4 chỉ tính trên phần **đã có test case**.

| Module | Trạng thái | Vì sao chưa test | Rủi ro |
|---|---|---|---|
| Báo cáo | ⬜ Chưa recon | Thiếu tài khoản role Manager | Không rõ — chưa khảo sát |
| Cấu hình hệ thống | 🟨 Đang recon | Đang viết TC | Trung bình |

**Nợ kiểm thử (TC bị SKIPPED):** 7 TC thao tác phá huỷ chưa chạy được trên môi trường dùng chung — cần môi trường riêng.

---

## 3. Đối chiếu tiêu chí Exit

| # | Tiêu chí | Ngưỡng | Thực tế | Kết quả |
|---|---|---|---|---|
| 1 | Bug Critical đang mở | 0 | 0 | ✅ Đạt |
| 2 | Bug Major đang mở | 0 / có workaround | 1 (có workaround) | 🟡 Ngoại lệ — chờ PM duyệt |
| 3 | Pass rate TC High | ≥ 95% | 97.2% | ✅ Đạt |
| 7 | Module trong phạm vi đã chạy | 100% | 5/6 | ❌ Không đạt |

> Bộ tiêu chí đang dùng: **mặc định của agent** — cần PM xác nhận hoặc thay bằng tiêu chí dự án.

---

## 4. Kết quả kiểm thử theo module

| Module | Nền tảng | Tổng TC | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | ⏭️ SKIP | Pass rate | Nguồn |
|---|---|---|---|---|---|---|---|---|
| Khách hàng | Web | 36 | 30 | 3 | 1 | 2 | 88.2% | [run_1785700456](docs/executions/customers/web/run_1785700456/execution_report.md) |
| Khách hàng | Mobile | 12 | 11 | 1 | 0 | 0 | 91.7% | [run_1785790000](…) |
| Đăng nhập | Web | 18 | 18 | 0 | 0 | 0 | 100% | [run_1785612000](…) |
| **Tổng** | | **66** | **59** | **4** | **1** | **2** | **92.2%** | |

> Mỗi dòng là **một module × một nền tảng**, chỉ tính lần chạy **bộ TC** — mỗi TC lấy kết quả mới nhất trong mọi lần chạy bộ TC ở `docs/executions/<module>/<nền-tảng>/` (Nguyên tắc số liệu #7). Cột Nguồn liệt kê đủ các lần chạy đã gộp. Module khai có nền tảng mà chưa có lần chạy nào ở nền tảng đó → vẫn ghi dòng, cột kết quả `—`, và đưa vào rủi ro: *chưa kiểm trên <nền tảng>*.

> Pass rate = PASS / (PASS + FAIL + BLOCKED). SKIPPED không tính vào mẫu số nhưng vẫn là **nợ kiểm thử** ở mục 2.

**Automation** (báo riêng, không cộng vào bảng trên): 120 test · 114 PASS · 6 FAIL · pass rate 95.0% — [reports/allure-report](…)

### 4b. Kết quả rà checklist (báo riêng, không cộng vào bảng trên)

| Checklist | Loại | Module · Nền tảng | Build | Số mục | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | ⏭️ SKIP | Mục P1 FAIL | Nguồn |
|---|---|---|---|---|---|---|---|---|---|---|
| CL-smoke_20261009 | Smoke | Khách hàng · Web | v2.4.3 | 12 | 11 | 1 | 0 | 0 | 1 — CL-smoke_20261009-04 | [run_1786000000](…) |
| CL-release_release_2.4 | Release-readiness | 4 module · Web | v2.4.3 | 38 | 37 | 0 | 1 | 0 | 0 | [run_1786100000](docs/executions/_release/web/run_1786100000/execution_report.md) |

> Checklist chạy **sau** lần chạy bộ TC, trên build mới hơn → đây là tín hiệu mới nhất về build. Mục FAIL có `TC ID liên quan` đã PASS ở bảng trên = regression, nêu lại ở mục 5.

---

## 5. Tình hình lỗi

| Severity | Đang mở | Đã fix & verify | Ghi chú |
|---|---|---|---|
| 🔴 Critical | 0 | 2 | Đã retest FIXED |
| 🟠 Major | 1 | 3 | 1 còn mở — xem mục 1 |
| 🟡 Minor | 4 | 1 | Đề nghị đưa sang sprint sau |
| 🟢 Trivial | 2 | 0 | Backlog |

**Bug đang mở, xếp theo mức ảnh hưởng:**

| Bug ID | Severity | Module | Tóm tắt | Workaround | Retest gần nhất |
|---|---|---|---|---|---|
| BUG_customers_1785700456_TC012 | 🟠 Major | Khách hàng | Search ký tự `%` trả 0 kết quả | Có | — (chưa fix) |

**⚠️ Regression phát sinh trong kỳ:** 1 — BUG_customers_1785700456_TC012 sinh ra từ chính bản fix của BUG_customers_1785612000_TC011.
Đây là tín hiệu cần chú ý: fix ở tầng search đang có tác dụng phụ, nên review kỹ vùng này trước khi release.

---

## 6. Độ phủ yêu cầu

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| REQ có ít nhất 1 TC | 48/52 = 92.3% | [traceability_matrix.md](docs/traceability/traceability_matrix.md) · sinh 08-08-2026 |
| REQ chỉ có checklist (🟠) | 1 | |
| REQ Critical có TC PASS | 12/12 = 100% | |
| TC đã automate | 30/54 = 55.6% | |

**4 REQ chưa có TC:** REQ-CUST-19, REQ-CUST-22, REQ-LOGIN-08, REQ-LOGIN-09 → đề nghị bổ sung trước release sau.

---

## 7. Đề xuất hành động

| Ưu tiên | Việc | Ai làm | Command |
|---|---|---|---|
| 🔴 Trước release | Fix BUG_customers_1785700456_TC012 hoặc PM duyệt ngoại lệ | Dev / PM | — |
| 🟠 Trước release | Xin tài khoản Manager để khảo sát module Báo cáo | QA | `/generate-requirements-from-website` |
| 🟡 Sprint sau | Bổ sung TC cho 4 REQ chưa phủ | QA | `/generate-testcases-from-requirements` |

---

## 8. Yếu tố cản trở tiến độ & Bài học

### 8.1 Điều gì làm chậm đợt này

| Yếu tố | Mất bao lâu | Ảnh hưởng | Đã xử lý thế nào |
|---|---|---|---|
| Không có tài khoản role Manager | Cả đợt | Module Báo cáo không kiểm được — 1 vùng trắng | Chưa — đã xin từ ngày <ngày>, chưa nhận |
| Môi trường staging bị đội khác reset data | 1.5 ngày | 8 TC phải chạy lại | Thoả thuận khung giờ chạy, ghi ID bản ghi đã tạo |
| Build v2.4.1 lỗi đăng nhập | 0.5 ngày | Toàn bộ test dừng | Dev vá trong ngày, phát hành v2.4.2 |

> ⚠️ Ghi cả **thời lượng thực tế**, không chỉ tên sự việc. Không có con số thì đợt sau vẫn ước lượng lịch sai y như đợt này.

### 8.2 Bài học rút ra

| Bài học | Áp dụng vào đâu |
|---|---|
| Tài khoản đủ mọi role phải là **tiêu chí VÀO**, không phải việc xin trong lúc test | Mục 4.1 của Master Test Plan đợt sau |
| Môi trường dùng chung cần chốt khung giờ **trước** khi bắt đầu | Mục 5 Master Test Plan |
| Bản fix vùng search gây regression → vùng này cần retest FULL, không chỉ retest bug | Chiến lược retest đợt sau |

### 8.3 Tài sản dùng lại được

| Tài sản | Nơi lưu | Dùng lại cho |
|---|---|---|
| Bộ TC module Khách hàng (36 TC) | `docs/testcases/customers/` | Regression các đợt sau |
| Checklist smoke 12 mục | `docs/checklists/customers/web/checklist_smoke_20260801.md` | Mọi build mới — sinh lại file theo ngày bằng `/generate-checklist-test` |

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
```

---

## Quality Checklist

- [ ] Khuyến nghị go/no-go có **căn cứ dẫn ra từng bug/tiêu chí cụ thể**, không phải cảm tính
- [ ] Khuyến nghị GO **luôn kèm rủi ro tồn đọng**
- [ ] Ghi rõ **quyết định release thuộc về PM/PO**
- [ ] **Vùng chưa test đặt TRƯỚC** mọi tỷ lệ
- [ ] Tiêu chí exit ghi rõ là của dự án hay bộ mặc định của agent
- [ ] Mọi số có link về file nguồn
- [ ] Manual và automation báo **riêng**, không cộng gộp
- [ ] Lần chạy **checklist** báo ở bảng 4b, **không** cộng vào bảng bộ TC; số bộ TC lấy kết quả mới nhất của **từng TC**, không lấy nguyên lần chạy mới nhất
- [ ] Mục checklist FAIL trên build mới mà TC liên quan PASS trên build cũ → đã nêu như regression ở mục 5
- [ ] BLOCKED và SKIPPED không bị tính lẫn vào phần đã kiểm chứng
- [ ] Regression phát sinh trong kỳ được nêu riêng — đây là tín hiệu chất lượng bản fix
- [ ] Không có credentials, không có dữ liệu khách hàng thật trong báo cáo
- [ ] Mục **8.1** ghi **thời lượng thực tế** của từng yếu tố cản trở, không chỉ tên sự việc
- [ ] Mục **8.2** mỗi bài học chỉ đích danh **áp dụng vào mục nào** của plan đợt sau — bài học không có nơi áp dụng là câu nói suông
- [ ] **Không** có số điều khoản chuẩn (`clause 7.x`); **không** có câu tuyên bố "tuân thủ ISO/IEC/IEEE 29119"

---

## Anti-Patterns (NGHIÊM CẤM)

| ❌ Sai | ✅ Đúng |
|---|---|
| Đặt ngưỡng exit sau khi đã xem kết quả | Chốt tiêu chí trước, chấm sau |
| "Pass rate 95%, ổn rồi" khi 2 module chưa test | Nêu vùng chưa test trước, tỷ lệ chỉ tính trên phần đã có TC |
| Cộng số manual + automation thành một tỷ lệ | Báo riêng hai bảng |
| Lấy lần chạy smoke 12 mục (mới nhất) làm số của cả module 36 TC | Lần chạy checklist vào bảng 4b; bảng bộ TC gộp kết quả mới nhất của từng TC |
| Tính BLOCKED vào PASS cho đẹp số | BLOCKED = chưa kiểm được, tách riêng |
| QA tự tuyên bố "không được release" | Khuyến nghị NO-GO + nêu rủi ro, quyết định là của PM |
| Khuyến nghị GO trơn, không nêu tồn đọng | GO luôn kèm danh sách rủi ro chấp nhận |
| Chép số từ trí nhớ / ước lượng | Mỗi số một link về file nguồn |

---

## Rules References

- Ranh giới với `skills-test-report-analyzer`: skill kia phân tích **một** lần chạy; skill này tổng hợp **toàn dự án tại một mốc**
- Vùng mù "module chưa recon" lấy từ `docs/requirements/README.md` — cùng cơ chế với `skills-coverage-traceability`
- Bug và Lịch sử retest theo template của `skills-bug-reporter`
