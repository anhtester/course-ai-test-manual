---
description: Phân tích test report — automation (Playwright/Allure/JUnit/TestNG) hoặc manual (execution_report.md / retest_report.md). Tổng hợp PASS/FAIL, gom nhóm failure theo root cause, so sánh trend, đề xuất thứ tự xử lý.
skills:
  - skills-test-report-analyzer
  - skills-bug-reporter
  - skills-flaky-test-analyzer
  - skills-locator-healer-agent
---

# Workflow: Phân Tích Test Report

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-test-report-analyzer`** (tại `.claude/skills/skills-test-report-analyzer/SKILL.md`) trước khi bắt đầu.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **KHÔNG đoán category failure** — automation phải đọc error message/stack trace thực tế; manual phải đọc Expected vs Actual thực tế
- Số liệu trong báo cáo phải khớp chính xác với report gốc
- Chỉ phân tích và báo cáo — KHÔNG tự sửa test/code/TC trong workflow này (đề xuất command tiếp theo cho từng nhóm)

## 2 Nhánh — xác định TRƯỚC KHI parse

Hai nguồn report khác nhau về bản chất; chọn nhầm nhánh là phân loại sai toàn bộ:

| Nhánh | Nguồn | Nhận biết |
|---|---|---|
| **AUTOMATION** | Playwright JSON · Allure · JUnit/Surefire XML · TestNG XML | File trong `reports/`, đuôi `.json` / `.xml` / `.html` |
| **MANUAL** | `/execute-test-cases` · `/retest-fixed-bugs` | File `.md` trong `docs/executions/<module>/<nền-tảng>/run_*/` hoặc `retest_*/` |

> User đưa **cả hai** loại → chạy hai nhánh riêng, xuất **hai file phân tích riêng**. Cộng số PASS của manual vào automation là sai: hai bên đo hai phạm vi khác nhau, con số gộp không có ý nghĩa.

---

## Nhánh AUTOMATION

### Input

| Input | Cách lấy |
|---|---|
| **Test report** | User cung cấp path, HOẶC agent tự tìm — **ưu tiên `reports/`** (`reports/allure-results/`, `reports/html/`, `reports/surefire/`), sau đó mới đến vị trí mặc định của tool: `playwright-report/`, `allure-results/`, `target/surefire-reports/`, `test-output/` |
| **Report lần chạy trước** (tùy chọn) | Để so sánh trend — hỏi user nếu cần |

> Không tìm thấy report → hỏi user path hoặc đề nghị chạy suite để sinh report mới.

### Các bước

**Bước 1: Parse Report**
1. Xác định format (Playwright JSON / Allure / JUnit XML / TestNG XML)
2. Trích xuất từng test: tên, status, duration, error message, retry count
3. Tách FLAKY (pass sau retry) riêng khỏi FAIL thật

**Bước 2: Phân Loại Failure**
1. Đọc error message + stack trace của TỪNG test fail
2. Gán category theo bảng **Failure Categories** trong skill: 🐛 App Bug / 🎯 Locator / ⏱️ Flaky / 📊 Data / 🌐 Environment / 🧪 Script
3. Gom nhóm failure có chung root cause (cùng page object, cùng API, cùng thời điểm)

**Bước 3: So Sánh Trend** (nếu có report cũ) — New failures / Recurring (≥3 lần) / Fixed

**Bước 4: Báo Cáo**
1. Xuất `test_report_analysis.md` theo template trong skill
2. Thứ tự xử lý: Environment → App Bugs (`/create-bug-report`) → Locator (`/heal-locators`) → Flaky (`/analyze-flaky-tests`)
3. User muốn **sửa luôn cho suite xanh lại** thay vì chỉ đọc report → chuyển sang `/run-and-fix-tests`

---

## Nhánh MANUAL

> Dùng mục **Phân tích Report Manual** của skill. ⚠️ **KHÔNG** áp bảng Failure Categories của automation — report manual không có stack trace, không có retry, không có tên page object.

### Input

| Input | Cách lấy |
|---|---|
| **Report manual** | User cung cấp path, HOẶC glob `docs/executions/<module>/<nền-tảng>/run_*/execution_report.md` và `docs/executions/<module>/<nền-tảng>/retest_*/retest_report.md` (và `docs/executions/<module>/run_*/` của lần chạy cũ chưa có tầng nền tảng; checklist Release-readiness ở `docs/executions/_release/<nền-tảng>/run_*/`). Đọc ô `Loại nguồn` ở header — trend chỉ so các lần chạy **cùng `Nguồn TC`**, không so lần chạy checklist với lần chạy bộ TC. **Không** gộp lần chạy của hai nền tảng vào một chuỗi trend — TC ID khác nhau, so sánh vô nghĩa |
| **Nguồn TC gốc** (khuyến nghị) | `docs/testcases/<module>/` — cần khi phải phân biệt "bug ứng dụng" với "TC viết sai" |
| **Các lần chạy trước cùng module** | Tự glob — có ≥ 2 run thì làm luôn phần trend, không cần hỏi |

### Các bước

**Bước 1: Parse Report Manual**

Trích theo bảng "Trích xuất gì" trong skill: header (module · build · môi trường · dùng chung?) → mục 1 Tổng kết → mục 2 Kết quả từng TC → mục 3 Chi tiết FAIL → mục 4 BLOCKED → mục 5 Dữ liệu đã dọn.

⚠️ **Đọc mục 4 (BLOCKED) TRƯỚC mục 3 (FAIL).** BLOCKED quyết định lần chạy này có đủ tư cách kết luận hay không — đọc sau thì đã lỡ viết kết luận dựa trên pass rate rồi.

**Bước 2: Kiểm 3 tín hiệu riêng của manual (BẮT BUỘC)**

Theo mục "Ba tín hiệu riêng của manual" trong skill:

1. **Tỷ lệ BLOCKED** — > 20% thì ⛔ **không kết luận chất lượng**, ghi rõ lần chạy này thiếu dữ liệu và đề nghị dựng lại môi trường rồi chạy lại
2. **SKIPPED do auto-skip** — gom thành danh sách "nợ kiểm thử, cần chạy tay có giám sát", không để lẫn vào phần đã xong
3. **Data chưa dọn** — mục 5 có dòng `Đã xoá? ❌` → cảnh báo môi trường bẩn cho lần chạy sau

**Bước 3: Phân Loại Failure — bản manual**

Với **từng** TC FAIL, đọc Expected vs Actual rồi gán category:
🐛 Bug ứng dụng · 📝 TC viết sai/mơ hồ · 📄 Requirement đã lệch · 🌐 Môi trường/pre-condition · 📊 Test data · 🔁 Regression sau fix

⚠️ **Ranh giới quan trọng nhất — bug ứng dụng vs TC viết sai:**

| Câu hỏi | Nếu… | Kết luận |
|---|---|---|
| Expected có căn cứ REQ ID không? | Có, và app làm khác | 🐛 Bug ứng dụng → `/create-bug-report` |
| | Không — Expected là suy đoán của người viết TC | 📝 TC viết sai → `/review-testcases` |
| TC mang `@NeedsVerify` (Expected chưa có evidence)? | Có, và app làm khác | 📝 Xét **TC viết sai trước** — đối chiếu lại bằng recon/`/review-testcases`, chưa báo bug |
| TC gộp FAIL ở vài biến thể? | Có | Phân loại **từng biến thể** (`<TC ID>-<mã>`), không gán một category cho cả TC |
| App làm đúng logic **mới**, TC theo logic **cũ**? | Đúng vậy | 📄 Requirement lệch → `/update-requirements-from-ticket` → `/update-testcases-from-impact` |

Báo nhầm "TC viết sai" thành bug là gửi dev đi sửa thứ không hỏng — mất uy tín của cả bảng báo cáo.

**Bước 4: So Sánh Trend** (khi có ≥ 2 run cùng module)

Theo bảng trend trong skill: 🆕 Mới fail (ưu tiên cao nhất) · 🔁 Fail liên tục · ✅ Vừa được fix · ⚠️ Chuyển sang BLOCKED.

Nguồn TC đã đổi giữa 2 lần chạy → nêu rõ, **không** so số thô rồi kết luận "chất lượng giảm".

**Bước 5: Báo Cáo**

Xuất `docs/executions/<module>/<nền-tảng>/analysis_<timestamp>.md` (lần chạy checklist release: `docs/executions/_release/<nền-tảng>/analysis_<timestamp>.md`, nhóm theo cột `Module`):

```markdown
# Phân Tích Kết Quả Manual — <Module>

| | |
|---|---|
| Phạm vi phân tích | 3 lần chạy: run_1785700456 · run_1785612000 · retest_1785350000 |
| Build | v2.4.3 |
| Nguồn TC | docs/testcases/customers/TEST_CASES_CUSTOMERS_SUMMARY.md |

## 0. Mức tin cậy của lần chạy

> ⚠️ BLOCKED 4/36 = 11.1% — nguyên nhân chặn ở mục 3. Kết luận vẫn dùng được nhưng **chưa phủ hết phạm vi**.

## 1. Tổng quan

| Trạng thái | Số lượng | Tỷ lệ |
|---|---|---|

## 2. Phân loại FAIL theo nguyên nhân gốc

| Category | Số TC | TC ID | Hành động | Command |
|---|---|---|---|---|
| 🐛 Bug ứng dụng | 2 | TC_011 · TC_024 | Báo bug | `/create-bug-report` |
| 📝 TC viết sai | 1 | TC_017 | Sửa TC | `/review-testcases` |

## 3. TC BLOCKED — gom theo nguyên nhân chặn

| Nguyên nhân | Số TC | Cần gì để chạy được |
|---|---|---|

## 4. Nợ kiểm thử (SKIPPED)

| TC ID | Lý do skip | Chạy được ở đâu |
|---|---|---|

## 5. Trend giữa các lần chạy

| Nhóm | TC ID | Ghi chú |
|---|---|---|
| 🆕 Mới fail | TC_012 | Lần trước PASS — nghi regression từ build v2.4.3 |

## 6. Cảnh báo môi trường

- Data chưa dọn: …

## 7. Thứ tự xử lý đề xuất

1. …
```

---

## Output

| Nhánh | File |
|---|---|
| AUTOMATION | `test_report_analysis.md` — tổng quan · phân loại failure · pattern · trend · thứ tự xử lý |
| MANUAL | `docs/executions/<module>/<nền-tảng>/analysis_<timestamp>.md` — theo template trên |

**Bước tiếp theo gợi ý cho user:**

- Cần gộp nhiều module thành báo cáo gửi PM/khách → `/generate-test-summary-report`
- Muốn xem trực quan, lọc/sắp xếp trên web → mở `scripts/execution-viewer/bundle.html` rồi kéo thả các file report vào
