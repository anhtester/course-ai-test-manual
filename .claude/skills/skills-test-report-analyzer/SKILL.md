---
name: skills-test-report-analyzer
description: Skill phân tích test report sau mỗi lần chạy — automation (Playwright/Allure/JUnit/TestNG) và manual (execution_report.md, retest_report.md). Tổng hợp PASS/FAIL/BLOCKED, gom nhóm failure theo root cause, so sánh trend giữa các lần chạy, và đề xuất thứ tự xử lý.
---

# Test Report Analyzer

Purpose: Đọc và phân tích test report sau khi chạy suite, biến dữ liệu thô thành insight hành động được.

---

## When to Use

Sử dụng skill này khi:

- Vừa chạy xong regression/smoke suite và cần tổng hợp kết quả
- User đưa file report (HTML/JSON/XML) và hỏi "kết quả thế nào", "tại sao fail"
- Cần so sánh kết quả giữa các lần chạy (trend analysis)
- CI/CD pipeline đỏ và cần biết nên fix cái gì trước
- **Vừa chạy xong manual** bằng `/execute-test-cases` hoặc `/retest-fixed-bugs`, cần gom nhóm FAIL theo nguyên nhân và biết lần chạy đó có đủ tin cậy để kết luận không

> Gộp nhiều module thành **một báo cáo gửi PM/khách kèm khuyến nghị go/no-go** thì đó là việc của `skills-test-summary-reporter`, không phải skill này. Skill này phân tích **một phạm vi chạy**; skill kia tổng hợp **toàn dự án tại một mốc**.

---

## Supported Report Formats

> **Ưu tiên tìm trong `reports/`** — theo `.claude/rules/reporting_rules.md` mục 6, framework sinh từ repo này gom toàn bộ output vào `reports/`. Các vị trí mặc định của tool chỉ dùng cho project cũ chưa chuẩn hoá.

| Framework | Format | Vị trí chuẩn (`reports/`) | Vị trí mặc định của tool |
|---|---|---|---|
| Playwright | JSON (`--reporter=json`), HTML | `reports/html/`, `reports/test-artifacts/` | `playwright-report/`, `test-results/` |
| Allure | JSON results | `reports/allure-results/`, `reports/allure-report/` | `allure-results/`, `allure-report/` |
| JUnit / Surefire | XML | `reports/surefire/` | `target/surefire-reports/` |
| TestNG | XML (`testng-results.xml`) | `reports/surefire/` | `test-output/` |
| Pytest | JUnit XML (`--junitxml`), HTML | `reports/html/` | do user cấu hình |

### Report Manual (Markdown) — nguồn khác hẳn, đọc mục riêng bên dưới

| Nguồn | Format | Vị trí |
|---|---|---|
| `/execute-test-cases` | Markdown | `docs/executions/<module>/<nền-tảng>/run_*/execution_report.md` |
| `/retest-fixed-bugs` | Markdown | `docs/executions/<module>/<nền-tảng>/retest_*/retest_report.md` |

⚠️ **Không áp bảng Failure Categories của automation cho report manual.** Report manual **không có** stack trace, không có retry, không có tên page object — mọi tín hiệu dùng để phân loại failure của automation đều vắng mặt. Dùng bảng riêng ở mục **Phân tích Report Manual**.

---

## Responsibilities

1. **Parse report** — đọc đúng format, trích xuất: tên test, status, duration, error message, retry count
2. **Tổng hợp số liệu** — PASS / FAIL / SKIP / FLAKY (pass sau retry), tổng thời gian chạy
3. **Gom nhóm failure** theo root cause category (bảng bên dưới) — KHÔNG liệt kê từng test rời rạc
4. **Phát hiện pattern** — nhiều test fail cùng 1 nguyên nhân (VD: cùng 1 page object, cùng 1 API down)
5. **So sánh trend** — nếu có report cũ: test nào mới fail, test nào fail liên tục, test nào vừa được fix
6. **Đề xuất hành động** — thứ tự xử lý theo mức ảnh hưởng

---

## Failure Categories

| Category | Dấu hiệu | Hành động đề xuất |
|---|---|---|
| 🐛 **Application Bug** | Assertion fail với data đúng, hành vi app sai spec | Báo bug → dùng skill `skills-bug-reporter` |
| 🎯 **Locator hỏng** | `ElementNotFound`, `strict mode violation` | Dùng skill `skills-locator-healer-agent` |
| ⏱️ **Flaky / Timing** | Pass sau retry, timeout ngẫu nhiên | Dùng skill `skills-flaky-test-analyzer` |
| 📊 **Test data** | `Duplicate`, `Not found`, conflict parallel | Sửa data generation |
| 🌐 **Environment** | `ECONNREFUSED`, `502/503`, toàn bộ suite fail | Kiểm tra env trước, KHÔNG sửa test |
| 🧪 **Test script lỗi** | Syntax error, import fail, assertion viết sai | Sửa test code |

> **Nguyên tắc phân loại:** Đọc error message + stack trace thực tế. KHÔNG đoán category khi chưa xem log.

---

## Phân tích Report Manual

> Áp dụng cho `execution_report.md` và `retest_report.md`. **Không** dùng bảng Failure Categories ở trên.

### Trích xuất gì

| Từ mục | Lấy ra |
|---|---|
| Header | Run ID · module · build · môi trường · môi trường dùng chung? · thời lượng · **`Loại nguồn`** (Bộ TC / Checklist) |
| `## 1. Tổng kết` | PASS / FAIL / BLOCKED / SKIPPED + pass rate |
| `## 2. Kết quả từng TC` | TC ID · kết quả · bước fail — lần chạy checklist: mã mục `CL-…-<nn>` · `TC ID liên quan` · `Module` (checklist release) |
| `## 3. Chi tiết TC FAIL` | REQ ID · Expected · Actual · priority · tái hiện được? |
| `## 4. TC BLOCKED` | nguyên nhân chặn — **đây là mục hay bị bỏ qua nhất** |
| `## 5. Dữ liệu đã tạo & dọn dẹp` | data còn sót → cảnh báo môi trường bẩn |

### Failure Categories — bản manual

Phân loại dựa trên **Expected vs Actual**, vì không có stack trace:

| Category | Dấu hiệu trong report | Hành động |
|---|---|---|
| 🐛 **Bug ứng dụng** | Actual lệch Expected, Expected có căn cứ REQ, tái hiện được | `/create-bug-report` |
| 📝 **TC viết sai / mơ hồ** | Expected không đo được, TC không nói rõ pre-condition, 2 TC cùng ID, **TC `@NeedsVerify` lệch Expected** (report ghi *"Expected chưa có evidence"* — Expected chưa từng được kiểm chứng, xét nhóm này **trước** khi kết luận bug) | `/review-testcases` — **KHÔNG** báo bug |
| 📄 **Requirement đã lệch** | App chạy đúng logic mới, TC dựa trên requirement cũ | `/update-requirements-from-ticket` → `/update-testcases-from-impact` (**KHÔNG** dùng `/review-testcases` — rubric không bắt được TC stale) |
| 🌐 **Môi trường / pre-condition** | Phần lớn BLOCKED, cùng lý do "không dựng được pre-condition", "không đăng nhập được" | Sửa môi trường trước, **KHÔNG** kết luận gì về chất lượng app |
| 📊 **Test data** | "không tìm thấy bản ghi", data bị người khác sửa (môi trường dùng chung) | Sinh lại data, cân nhắc `/generate-test-data` |
| 🔁 **Regression sau fix** | Xuất hiện trong `retest_report.md` mục "Regression phát sinh do fix" | Bug mới, priority cao — fix đã gây hỏng chỗ khác |

> TC gộp FAIL ở **một vài biến thể** (`<TC ID>-<mã>` trong dòng `Bước fail`) → phân loại **theo từng biến thể**, không theo cả TC: biến thể `b` có thể là bug ứng dụng trong khi biến thể `d` là TC viết sai.

### Ba tín hiệu riêng của manual — bắt buộc kiểm

Automation không có ba thứ này, nên rất dễ bị bỏ sót:

**1. Tỷ lệ BLOCKED cao = con số pass rate không có ý nghĩa**

BLOCKED nghĩa là **chưa test được**, không phải "test đạt". Report có 20 PASS / 15 BLOCKED thì pass rate 100% trên phần chạy được — nhưng gần nửa phạm vi chưa ai chạm tới.

| Tỷ lệ BLOCKED | Kết luận |
|---|---|
| ≤ 5% | Bình thường |
| 5–20% | Nêu rõ ở đầu báo cáo, liệt kê nguyên nhân chặn |
| **> 20%** | ⛔ **Không kết luận chất lượng** — lần chạy này không đủ dữ liệu. Đề nghị dựng lại môi trường rồi chạy lại |

**2. SKIPPED do auto-skip là nợ kiểm thử, không phải "đã xong"**

TC bị skip vì thao tác phá huỷ trên môi trường dùng chung **vẫn chưa được kiểm**. Gom riêng thành danh sách "cần chạy tay có giám sát trên môi trường riêng" — nếu không, chúng biến mất khỏi mọi báo cáo về sau.

**3. Data chưa dọn = lần chạy sau sẽ nhiễu**

Mục 5 của report có dòng `Đã xoá? ❌` → cảnh báo ngay. Môi trường dùng chung mà tồn data test thì lần chạy tiếp theo có thể fail vì lý do không liên quan gì đến app.

### So sánh trend giữa các lần chạy

Glob `docs/executions/<module>/<nền-tảng>/run_*/execution_report.md` (và `docs/executions/<module>/run_*/` của lần chạy cũ chưa có tầng nền tảng), sắp theo Run ID (timestamp tăng dần), so **cùng TC ID** giữa các lần — trend tính **riêng từng nền tảng** và **riêng từng nguồn** (cùng `Nguồn TC`): lần chạy bộ TC không so với lần chạy checklist, checklist này không so với checklist khác. Ngoại lệ duy nhất được nối chéo — mục checklist FAIL có `TC ID liên quan` đã PASS ở lần chạy bộ TC trước đó → xếp **🆕 Mới fail**, ghi cả hai nguồn:

| Nhóm | Nghĩa | Ưu tiên |
|---|---|---|
| 🆕 **Mới fail** | Lần trước PASS, lần này FAIL | **Cao nhất** — nghi regression từ build mới |
| 🔁 **Fail liên tục** | FAIL ≥ 2 lần liên tiếp | Kiểm xem bug đã báo chưa; chưa báo là đang rò rỉ |
| ✅ **Vừa được fix** | Lần trước FAIL, lần này PASS | Đối chiếu với `Lịch sử retest` của bug tương ứng |
| ⚠️ **Chuyển sang BLOCKED** | Trước chạy được, giờ chặn | Môi trường xuống cấp — báo sớm |

> So sánh chỉ hợp lệ khi **cùng nguồn TC**. Nguồn TC đã đổi (file TC được cập nhật giữa 2 lần chạy) → nêu rõ, đừng so số thô rồi kết luận "chất lượng giảm".

---

## Analysis Workflow

1. **Locate** — Tìm file report trong project (theo bảng vị trí mặc định) hoặc nhận từ user
2. **Parse** — Trích xuất dữ liệu từng test case
3. **Summarize** — Bảng tổng quan: tổng số test, PASS/FAIL/SKIP/FLAKY, pass rate, duration
4. **Classify** — Gán category cho từng failure dựa trên error message thực tế
5. **Detect patterns** — Gom failure có chung nguyên nhân gốc (cùng page, cùng API, cùng thời điểm)
6. **Compare** (nếu có lịch sử) — Diff với lần chạy trước: new failures / recurring / fixed
7. **Report** — Xuất báo cáo theo template bên dưới

---

## Report Template

```markdown
# Báo Cáo Phân Tích Test Run

## Tổng quan
| Chỉ số | Giá trị |
|---|---|
| Tổng số test | N |
| ✅ PASS | x (x%) |
| ❌ FAIL | y |
| ⏭️ SKIP | z |
| 🔁 FLAKY (pass sau retry) | w |
| Thời gian chạy | mm:ss |

## Phân loại Failure
| Category | Số test | Danh sách test | Đề xuất |
|---|---|---|---|
| 🐛 Application Bug | 2 | TC_x, TC_y | Báo bug (P1) |
| 🎯 Locator hỏng | 3 | ... | Chạy locator healer |

## Pattern phát hiện được
- <VD: 5 test cùng fail ở LoginPage.login() → nghi locator nút Login đổi>

## So sánh với lần chạy trước (nếu có)
- 🆕 Mới fail: ...
- 🔄 Fail liên tục (≥3 lần): ...
- ✅ Đã fix: ...

## Thứ tự xử lý đề xuất
1. <Environment issues trước — chặn toàn suite>
2. <Application bugs — cần báo dev sớm>
3. <Locator/script fixes — QA tự xử lý>
```

---

## Quality Checklist

- [ ] Mọi failure đều được gán category dựa trên log thực tế
- [ ] Failure có chung root cause được gom nhóm, không đếm trùng
- [ ] Flaky (pass sau retry) tách riêng khỏi FAIL thật
- [ ] Đề xuất hành động cụ thể cho từng nhóm, có skill/command liên quan
- [ ] Báo cáo bằng Tiếng Việt, số liệu chính xác khớp report gốc

---

## Rules References

- `.claude/skills/skills-bug-reporter/SKILL.md` — Báo bug từ failure là application bug
- `.claude/skills/skills-flaky-test-analyzer/SKILL.md` — Xử lý nhóm flaky
- `.claude/skills/skills-locator-healer-agent/SKILL.md` — Xử lý nhóm locator hỏng
