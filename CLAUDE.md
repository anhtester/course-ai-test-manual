# CLAUDE AI - GLOBAL AUTOMATION AGENT RULES

> **Scope:** Áp dụng cho mọi tác vụ Test Automation do Claude (Claude Code) hoạt động trong dự án này.
> **Mục tiêu:** Sinh ra test scripts hiệu quả, ổn định – dễ debug – dễ scale – CI friendly.

---

## Được phép lấy thông tin tài khoản mật khẩu từ .env để nhập liệu trong quá trình chạy.
Tôi cho phép Claude đọc file `.env` trong root project để lấy thông tin tài khoản, mật khẩu, token, cookie xác thực, session id, API key… phục vụ cho việc chạy test automation. File `.env` **không** được commit lên git (đã `.gitignore`) — Claude chỉ đọc để dùng, không ghi lại hay hiển thị ra log.

---

## Git Pull Restriction Rule

* Tuyệt đối KHÔNG dùng lệnh GIT làm thay đổi trạng thái code (như `git pull`, `git checkout`, `git merge`, `git rebase`, `git reset`) để lấy code hoặc thay đổi nhánh.
* Vì có nhiều trường hợp code trên server chưa được cập nhật, việc pull code về sẽ ghi đè và làm sai toàn bộ phần code đang chỉnh sửa ở máy local.
* Luôn giữ nguyên trạng thái code local hiện tại để làm việc.
* Nếu cần file hoặc nội dung mới, hãy yêu cầu người dùng cung cấp thay vì tự ý dùng git.
* **Được phép** dùng lệnh read-only: `git status`, `git diff`, `git log` — để kiểm tra trạng thái mà không thay đổi code.

---

## Browser Rules (MANDATORY)

### 🖥️ Viewport & Mode

* Tất cả **UI debugging** phải chạy ở **desktop viewport**
* Bắt buộc **mở browser thật** khi debug (headed mode)
* **Headless mode** chỉ được sử dụng **sau khi test đã debug PASS trên UI**
* CI/CD pipeline **được phép chạy headless mặc định**

#### Kích thước viewport theo chế độ

| Chế độ | Viewport | Lý do |
|---|---|---|
| **Headed (debug)** | **`1600×750`** — đúng bằng `--viewport-size` lúc khởi chạy | Cửa sổ **không nở được sau khi launch**. Đặt viewport lớn hơn cửa sổ → trang bị **cắt**, tester không nhìn thấy phần bên phải |
| **Headless (CI)** | `1920×1080` | Không có khung trình duyệt nên đặt bao nhiêu cũng đúng |

> ⚠️ **KHÔNG gọi `browser_resize` để phóng viewport vượt cửa sổ.** `browser_resize` chỉ đổi **viewport**, **không** đổi cửa sổ OS. Ép lên 1920×1080 khi cửa sổ chỉ 1614 → mất **306px bên phải** khỏi tầm nhìn tester (ảnh chụp vẫn đủ, nhưng hỏng mục đích của headed mode). Mặc định **không cần resize** — viewport đã đúng từ lúc launch.
>
> 📊 **Số đo thực tế** (Windows, màn hình 1920×1080, Google Chrome): viewport `1600×750` → cửa sổ `1614×885`. Khung chiếm **+135 dọc** (ổn định) và **+14…17 ngang** (dao động theo scrollbar của trang). Muốn cửa sổ vừa màn hình `W×H` → viewport ≈ `(W−17) × (H−135)` — trừ 17 cho chắc.
>
> 📌 **Đổi viewport headed ở đâu:** `--viewport-size` của MCP server `playwright` trong **`.mcp.json` ở gốc project** (cấu hình riêng của project này, đè lên `%APPDATA%\Claude\claude_desktop_config.json`). **Phải khởi động lại Claude Code** mới có hiệu lực.
>
> 📂 **Vì sao dùng `.mcp.json` riêng:** server khai ở đây chạy với cwd = gốc project, nên snapshot / console log / screenshot rơi đúng vào `.playwright-mcp/` của project. Dùng server global thì cwd bám theo project nào khởi động server trước — evidence sẽ lạc sang project khác. File không chứa đường dẫn tuyệt đối nên mang sang máy khác vẫn chạy.
>
> 🚫 Màn hình 1920×1080 **không thể** cho viewport headed 1920×1080 — thanh tab + thanh địa chỉ chiếm mất chiều cao. Cần đúng 1920×1080 thì chạy **headless**.

### 🔄 Thứ Tự Debug Bắt Buộc (Playwright MCP)

Khi dùng Playwright MCP để debug UI, **LUÔN** tuân theo thứ tự:

```
navigate → (kiểm viewport) → wait_for(page_load) → snapshot → interact → screenshot(on_fail)
```

* **KHÔNG** gọi `browser_navigate` lại nếu đã đang ở đúng trang — tránh reload ngoài ý muốn
* **KHÔNG** gọi `browser_resize` để phóng viewport vượt cửa sổ (xem bảng viewport ở trên). Viewport đã đúng từ `--viewport-size` lúc launch — mặc định **không cần resize**
* Nếu nghi ngờ lệch, **đo trước khi sửa**:
  ```js
  browser_evaluate: () => ({ inner:[innerWidth,innerHeight], outer:[outerWidth,outerHeight] })
  ```
  `inner` > `outer` → trang đang bị cắt, phải hạ viewport xuống hoặc sửa `--viewport-size` rồi khởi động lại
* **LUÔN** verify page đã load xong trước khi lấy snapshot hoặc tương tác

### 📸 Screenshot & Snapshot

* Dùng **`snapshot`** để phân tích DOM và xác định locator
* Dùng **`screenshot`** để lưu bằng chứng khi test fail hoặc để báo cáo
* Chụp **screenshot ngay khi assertion fail** để hỗ trợ truy vết lỗi
* **KHÔNG** chụp screenshot tràn lan — chỉ khi cần thiết (fail / milestone quan trọng)

---

## Tools

### 🛠️ Ưu Tiên Sử Dụng

* Ưu tiên sử dụng **Playwright MCP** cho tất cả tác vụ debug UI
* Tham chiếu rule chi tiết: [Quy tắc Playwright](.claude/rules/playwright_rules.md)

### 🔍 Inspect & Debug

* Mở browser thật để debug (headed mode)
* Inspect **DOM / HTML thực tế** trên trình duyệt — **KHÔNG đoán locator**
* Execute và debug test trực tiếp trên UI trước khi sinh code
* **KHÔNG** generate code khi chưa inspect DOM

### ⚡ Nguyên Tắc

* Một locator phải được **verify chạy được** trên browser hiện tại trước khi đưa vào code
* Nếu locator lấy từ code cũ → **bắt buộc verify lại** trước khi dùng

---

## Cleanup & Delivery

### ✅ Điều kiện bàn giao (Definition of Done)

Test chỉ được coi là **hoàn thành** khi đáp ứng **toàn bộ** các tiêu chí sau:

#### 🧹 Code Cleanup

- [ ] Xoá toàn bộ `print()`, `console.log()`, debug log tạm thời
- [ ] Xoá locator không còn sử dụng
- [ ] Không để lại commented-out code
- [ ] Không có `waitForTimeout` / `Thread.sleep` hardcoded
- [ ] Không có test data hardcoded (email, username, ID phải random/traceable)

#### 🏗️ Cấu trúc & POM

- [ ] Tuân thủ mô hình **Page Object Model** — tách biệt Page class, Test class, Utils
- [ ] Locator được định nghĩa trong Page class, không viết inline trong test
- [ ] Tên file, class, method đặt theo convention rõ ràng và nhất quán
- [ ] Import không còn thừa (unused imports)

#### ✔️ Chất lượng Test

- [ ] Test **PASS ổn định** ít nhất **2 lần liên tiếp** trên UI (headed mode)
- [ ] Assertion có message rõ ràng, dễ debug khi fail
- [ ] Mỗi test case độc lập — không phụ thuộc thứ tự chạy
- [ ] Test data được sinh động (timestamp/random) và traceable

#### 📊 Chất Lượng Report (Allure / tương đương)

> Chi tiết: [`.claude/rules/reporting_rules.md`](.claude/rules/reporting_rules.md)

- [ ] Tên test hiển thị bằng **Tiếng Việt** mô tả hành vi — KHÔNG phải tên hàm
- [ ] Có **Description**, **Severity**, **Tags**, **TC ID** cho mỗi test
- [ ] Test Body có step `Arrange:` / `Act:` / `Assert:` đọc hiểu được, không phẳng
- [ ] Có screenshot đính kèm ở cuối **MỌI** test — cả PASS lẫn FAIL
- [ ] **KHÔNG** có attachment `stdout` / `stderr` trong report
- [ ] Toàn bộ output report gom trong **`reports/`** — root project sạch, `.gitignore` đã chặn `reports/`

#### 📁 File Output

- [ ] Source code được lưu đúng vị trí trong project structure
- [ ] Không có file tạm, file test thừa trong thư mục source
- [ ] File cấu hình (config, .env) không chứa credentials thật

#### 📋 Báo Cáo Kết Quả

- [ ] Tóm tắt kết quả: số test PASS / FAIL / SKIP
- [ ] Nêu rõ các TC đã implement và TC nào bị skip (kèm lý do)
- [ ] Ghi chú các known issues hoặc limitation nếu có

---

## 1. Ngôn Ngữ & Giao Tiếp

- Luôn giao tiếp, giải thích ý tưởng và báo cáo bằng **Tiếng Việt**.
- Diễn giải **ngắn gọn, rõ ràng, dễ hiểu**.
- Tránh suy đoán lập trình hoặc giải thích mơ hồ về lỗi mà cần có căn cứ trực tiếp.

## 2. Quy Trình Làm Việc (Workflow)

- **Recon (Điều tra):** Luôn inspect giao diện thực tế hoặc DOM/HTML/XML trước khi viết automation. Tuyệt đối KHÔNG ĐOÁN locator.
- **Implementation:** Giữ vững mô hình **Page Object Model (POM)**. Phân tách rõ Page objects, Test execution và Utils/Test data.
- **Execution & Self-fix:** Chạy test ngay sau khi code xong. Nếu test FAIL → tự đọc log → phân tích root cause → sửa code → chạy lại → đến khi PASS ổn định. Chỉ hỏi User khi gặp business rule mâu thuẫn.
- **Cleanup:** Gỡ bỏ debug logs, code thừa, locator không dùng trước khi deliver.

## 3. Tech Stack Hỗ Trợ

| Loại             | Công nghệ                                     |
| ----------------- | ----------------------------------------------- |
| Ngôn ngữ        | Java, TypeScript                                |
| Web Automation    | Playwright (TS/Java), Selenium WebDriver (Java) |
| Mobile Automation | Appium (Java)                                   |
| API Automation    | REST Assured                                    |
| Test Framework    | TestNG, Playwright Test                         |
| Build Tool        | Maven, npm                                      |

## 4. Tham Chiếu Rules Chi Tiết

Agent phải tham chiếu quy tắc chi tiết trong `.claude/rules/`:

- [Quy tắc chung Automation](.claude/rules/automation_rules.md) — POM, Test Data, Naming, Assertions
- [Quy tắc Report (Allure)](.claude/rules/reporting_rules.md) — Metadata test, step Tiếng Việt, screenshot, cấm stdout
- [Chiến lược chọn Locator](.claude/rules/locator_strategy.md) — Thứ tự ưu tiên locator
- [Quy tắc Playwright](.claude/rules/playwright_rules.md) — Browser setup, locator semantic, wait strategy
- [Quy tắc Selenium](.claude/rules/selenium_rules.md) — WebDriverWait, TestNG structure
- [Quy tắc Appium](.claude/rules/appium_rules.md) — Chọn driver theo loại app · locator Android/iOS · **Flutter (semantics vs flutter-driver)** · WebView · gesture · parallel multi-device

## 5. Tham Chiếu Skills

Agent sử dụng skills trong `.claude/skills/` tùy theo nhiệm vụ:

| Skill                      | Vai trò                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `skills-qa-automation-engineer` | Master skill cho automation — điều phối toàn bộ quy trình                          |
| `skills-rbt-manual-testing`     | Master skill cho manual testing — 4 modes: QUICK (sinh TC nhanh), FULL RBT (6 bước), CHECKLIST (checklist tick tay) và **DELTA** (cập nhật bộ TC đã có theo Impact Report, giữ nguyên TC ID). Mọi mode sinh TC đi theo **khung 4 vòng** Smoke → Functional → Technical → Non-functional |
| `skills-framework-architect`     | Thiết kế & scaffold automation framework — project structure, base classes, reporting, CI/CD |
| `skills-requirements-analyzer`  | Phân tích requirements từ website · app mobile · đặc tả API (Swagger/Scalar/Postman/.docx) · tài liệu — một prefix cho mỗi nghiệp vụ trên mọi nền tảng |
| `skills-ui-debug-agent`         | Inspect UI/DOM **web**, thu thập locators                                                |
| `skills-mobile-debug-agent`     | Inspect app **mobile** thật qua Appium MCP — Native Android/iOS, **Flutter**, Hybrid; nhận diện loại app, thu locator theo nền tảng |
| `skills-smart-locator-agent`    | Sinh locator mới ổn định                                                              |
| `skills-locator-healer-agent`   | Sửa locator hỏng                                                                        |
| `skills-test-data-generator`    | Sinh test data unique, traceable — hỗ trợ multi-step pipeline & combinatorial data       |
| `skills-flaky-test-analyzer`    | Phân tích và khắc phục flaky tests                                                   |
| `skills-automation-code-reviewer` | Review chất lượng automation code theo Definition of Done — hard sleep, POM, Allure metadata, assertion yếu |
| `skills-jira-integration`       | Tích hợp Jira/Xray — lấy requirements, đẩy test results                             |
| `skills-bug-reporter`           | Sinh bug report chuẩn từ test FAIL — evidence, severity/priority, đẩy Jira            |
| `skills-manual-test-executor`   | Thực thi manual TC trên browser thật qua Playwright MCP — chấm PASS/FAIL/BLOCKED/SKIPPED, xuất execution report |
| `skills-test-report-analyzer`   | Phân tích test report **một lần chạy** — automation lẫn manual, gom nhóm failure theo root cause, đề xuất thứ tự xử lý |
| `skills-test-progress-reporter` | Báo cáo tiến độ **một kỳ trong đợt** (ngày/tuần) — so thực tế với lịch plan, chỉ số trong kỳ, trở ngại, rủi ro mới, đề xuất điều chỉnh — ISTQB CTFL v4.0 mục 5.3.2 |
| `skills-test-summary-reporter`  | Tổng hợp **toàn dự án tại một mốc** — gộp nhiều execution report + bug + RTM, đối chiếu tiêu chí exit, khuyến nghị go/no-go |
| `skills-testcase-reviewer`      | Review chất lượng manual test cases — rubric 6 tiêu chí, coverage gaps · Mode AUTOMATION chấm TC nào làm automation được theo bảng tiêu chí |
| `skills-coverage-traceability`  | Sinh ma trận truy vết RTM — Requirements ↔ Test Cases ↔ Automation                    |
| `skills-api-mocking`            | Sinh mock/stub API (Playwright route, WireMock) — test UI độc lập backend             |
| `skills-user-guide-writer`      | Sinh Hướng dẫn sử dụng cho người dùng cuối — viết theo việc cần làm, bám cấu trúc ISO/IEC/IEEE 26514 · 82079-1. 3 mode DOC · LIVE · **VIDEO**, ngôn ngữ `lang` (vi/en…), mọi ảnh/video **có highlight** (khung đỏ + số thứ tự click), luôn xuất HTML nhúng ảnh + video — công cụ `scripts/user-guide/` |

## 6. Kế Hoạch Kiểm Thử (Plan Templates)

Các bộ prompt template sẵn dùng trong `plans/`:

- **`plans/manual/`** — Quy trình sinh Manual Test Cases (2 modes: QUICK + FULL RBT)

  - Xem `plans/manual/QUICK_START.md` để bắt đầu nhanh
  - Workflow QUICK: `/generate-testcases-from-requirements`
  - Workflow FULL RBT: `/generate-testcases-manual-rbt`
- **`plans/automation/`** — Quy trình 6 bước sinh Automation Scripts

  - Xem `plans/automation/QUICK_START.md` để bắt đầu nhanh
  - One-click: Copy `plans/automation/prompt_automation.txt`
  - Workflow: `/generate-automation-from-testcases`
- **`plans/cross-module/`** — Quy trình phân tích Cross-Module & Ma trận kết hợp

  - Xem `plans/cross-module/QUICK_START.md` để bắt đầu nhanh
  - Workflow phân tích: `/generate-cross-module-test-plan`
  - Workflow sinh data: `/generate-combinatorial-test-data`

## 6b. Cấu Trúc Thư Mục `docs/` (BẮT BUỘC)

Toàn bộ tài liệu tổ chức **theo thư mục từng module**. Mỗi nhánh có một **file danh mục `README.md`** — **đọc file này đầu tiên** khi cần biết module nào đã có tài liệu, prefix nào đã bị chiếm, mã kế tiếp bắt đầu từ đâu.

```
docs/
├── requirements/
│   ├── README.md                              ← DANH MỤC requirements
│   ├── _discovery/                            ← TẦNG KHÁM PHÁ — cấp hệ thống
│   │   ├── system_map.md                      ← INDEX — TÊN FILE BẤT BIẾN (mặt web + mobile)
│   │   ├── api_map.md                         ← INDEX mặt API — khi hệ thống có spec API
│   │   ├── modules/module_NN_<slug>.md        ← chỉ khi > 8 module; module liên quan gộp chung 1 file
│   │   ├── doc_inventory.md                   ← bản đồ phủ tài liệu (khi QA có đưa tài liệu)
│   │   ├── sources/                           ← bản gốc tài liệu QA cung cấp · snapshot spec API
│   │   └── evidence/*.png                     ← 1 ảnh tổng quan mỗi module (mỗi nền tảng)
│   └── <module>/
│       ├── REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md ← INDEX — TÊN FILE BẤT BIẾN: phần CHUNG mọi nền tảng + Bản đồ tài liệu
│       ├── web/                               ← TẦNG NỀN TẢNG — chỉ 3 tên: web · mobile · api
│       │   ├── requirements_<module>_web.md   ← REQ chỉ áp web · Field Spec · Validation · Trình duyệt khảo sát
│       │   ├── evidence/*.png                 ← bằng chứng khảo sát web
│       │   └── stories/story_NN_<slug>.md     ← chỉ khi file nền tảng vượt ngưỡng tách
│       ├── mobile/
│       │   ├── requirements_<module>_mobile.md ← REQ Android/iOS · Yêu cầu riêng mobile · Thiết bị khảo sát
│       │   └── evidence/android_*.png · ios_*.png
│       ├── api/
│       │   └── requirements_<module>_api.md   ← Endpoint Catalog · REQ chỉ API · Field Spec JSON · Nguồn spec
│       ├── analysis/analysis_<TICKET-ID>.md   ← phân tích ticket — CẤP MODULE (ticket cắt ngang nền tảng)
│       └── impact/impact_<TICKET-ID>.md       ← Impact Report — CẤP MODULE, input cho tầng test case
│
├── testcases/
│   ├── README.md                              ← DANH MỤC test cases
│   └── <module>/
│       ├── TEST_CASES_<TÊN_MODULE>_SUMMARY.md ← INDEX — TÊN FILE BẤT BIẾN: tổng hợp + Bản đồ tài liệu, KHÔNG chứa dòng TC
│       ├── web/test_cases_<module>_web.md     ← TC chạy trên web
│       ├── mobile/test_cases_<module>_mobile.md ← TC chạy trên app (tag @Android / @iOS)
│       ├── api/test_cases_<module>_api.md     ← TC gọi API
│       ├── <nền-tảng>/parts/part_NN_<nền-tảng>_<slug>.md ← khi file nền tảng > 40 TC
│       ├── impact/impact_plan_<TICKET-ID>.md  ← /update-testcases-from-impact — kế hoạch, trước khi duyệt
│       ├── impact/delta_tc_<TICKET-ID>.md     ← /update-testcases-from-impact APPLY — TC đã sửa theo nền tảng, input của automation
│       ├── impact/automation_plan_<TICKET-ID>.md ← /update-automation-from-impact — script đã sửa theo ticket
│       ├── review/testcase_review_report_<nền-tảng>_<YYYYMMDD>.md ← /review-testcases — mode FIX sửa TC TẠI CHỖ, không sinh bản `_improved`
│       └── review/automation_review_<nền-tảng>_<YYYYMMDD>.md ← /review-testcases mode AUTOMATION — TC nào làm automation được
│
├── checklists/                                  ← /generate-checklist-test — ảnh chụp tại một thời điểm, KHÔNG sửa tại chỗ
│   ├── <module>/<nền-tảng>/checklist_<loại>_<YYYYMMDD>.md ← smoke · regression
│   ├── <module>/<nền-tảng>/checklist_post-hotfix_<TICKET-ID>.md
│   └── _release/<nền-tảng>/checklist_release_<mốc>.md ← release-readiness, cắt ngang module (có cột Module) — cùng slug <mốc> với test plan
│
├── test-plans/                                  ← kế hoạch kiểm thử — lập TRƯỚC đợt
│   ├── test_plan_<mốc>.md                      ← Master Test Plan — công bố phạm vi + tiêu chí exit TRƯỚC đợt
│   └── test_plan_<mốc>.input.yaml              ← bản lưu phiếu plans/master-test-plan/test_plan.config.yaml đã dùng
│
├── executions/                                 ← kết quả thực thi
│   ├── test_progress_<mốc>_<YYYYMMDD>.md       ← báo cáo tiến độ từng kỳ TRONG đợt
│   ├── test_summary_<mốc>_<timestamp>.md       ← báo cáo tổng hợp, CẮT NGANG mọi module và mọi nền tảng — chấm lại tiêu chí của plan
│   ├── _release/<nền-tảng>/run_<timestamp>/    ← chạy checklist release-readiness — `_release` là module giả
│   └── <module>/<nền-tảng>/                    ← mỗi lần chạy thuộc ĐÚNG MỘT nền tảng
│       ├── run_<timestamp>/
│       │   ├── execution_report.md             ← ô `Loại nguồn`: Bộ TC / Checklist <loại> — mục checklist mang mã CL-<…>-<nn>
│       │   └── evidence/<TC_ID>_<mô_tả>.png
│       ├── retest_<timestamp>/                 ← /retest-fixed-bugs
│       │   ├── retest_report.md
│       │   └── evidence/*.png
│       └── analysis_<timestamp>.md             ← /analyze-test-report nhánh MANUAL
│
├── traceability/                               ← /generate-traceability-matrix — ghi đè tại chỗ, bản cũ tra git
│   ├── traceability_matrix.md                  ← FILE CHUNG — TÊN FILE BẤT BIẾN: độ phủ theo module, ⬛ ngoài tầm nhìn, việc cần làm, Bản đồ tài liệu. Workflow phía sau đọc file này trước
│   └── <module>/traceability_matrix_<module>.md ← chi tiết từng module — ma trận theo Story. Sinh 1 module chỉ thay dòng của module đó trong file chung
│
├── bugs/                                       ← bug sinh từ TC FAIL
│   ├── README.md                               ← DANH MỤC bug — có cột Nền tảng
│   └── <module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md  ← mỗi bug 1 file, hậu tố TC_ID để nhìn tên biết ngay thuộc TC nào
│
└── user-guides/                                 ← Hướng dẫn sử dụng cho NGƯỜI DÙNG CUỐI
    ├── README.md                                ← DANH MỤC — module × role × phiên bản phần mềm
    └── <module>/
        ├── user_guide_<module>.md               ← INDEX — TÊN FILE BẤT BIẾN
        ├── user_guide_<module>.html             ← LUÔN xuất sau bản .md — ảnh + video nhúng sẵn (scripts/user-guide/md2html.py --standalone)
        ├── images/*.png                          ← ảnh có highlight (khung đỏ + số thứ tự click), tên ASCII theo phần–việc–bước
        ├── video/*.mp4                           ← Mode VIDEO: mỗi phần 1 video + full_walkthrough.mp4
        └── parts/part_NN_<slug>.md               ← chỉ khi > 15 việc
```

> `test_plan_<mốc>.md` nằm ở **`docs/test-plans/`** — plan là tài liệu **lập và duyệt trước đợt**, không phải kết quả thực thi. `test_progress_<mốc>_*.md` · `test_summary_<mốc>_*.md` nằm ở **gốc `executions/`**. Cả ba không thuộc module nào — chúng cắt ngang mọi module tại một mốc release. **Cùng slug `<mốc>`** (chữ thường, không dấu, VD `release_2.0`) là mối nối: báo cáo tiến độ theo dõi lịch của plan, báo cáo tổng hợp chấm lại đúng bộ tiêu chí exit đã công bố.
>
> **Tầng nền tảng `<nền-tảng>/`** — chỉ nhận đúng 3 tên `web` · `mobile` · `api` (Android và iOS chung `mobile/`, phân biệt bằng tiền tố ảnh `android_`/`ios_` và cột/tag nền tảng). Áp cho 5 nhánh `requirements/` · `testcases/` · `checklists/` · `executions/` · `bugs/`, **luôn có** kể cả module mới chỉ có một nền tảng — thêm nền tảng thứ hai về sau không phải di chuyển file nào. File index `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` / `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` **giữ nguyên tên và vị trí**; workflow phía sau đọc index trước, rồi theo `## Bản đồ tài liệu` sang file nền tảng. Tài liệu cũ chưa có tầng này: **không** di chuyển lịch sử (`run_*`, `BUG_*` giữ nguyên chỗ) — workflow đọc quét cả `<module>/<nền-tảng>/` lẫn `<module>/`; requirements/testcases cũ chuyển sang tầng nền tảng **một lần**, ở lần đầu một workflow sinh/cập nhật chạm lại module đó (ID giữ nguyên, ghi Nhật ký).
>
> `docs/user-guides/` là nhánh **duy nhất** viết cho người ngoài đọc — khách hàng, người dùng cuối. Nó **dùng lại** kết quả recon của `requirements/` nhưng **không** chép nội dung sang: requirements nói *hệ thống phải làm gì*, hướng dẫn nói *người dùng làm thế nào*. 🔒 Ảnh trong nhánh này phải dùng **dữ liệu mẫu** — tài liệu được phát ra ngoài.
>
> `docs/bugs/` là **mắt xích thứ tư** của chuỗi truy vết `requirements → testcases → executions → bugs`. Evidence của bug **không** nhân bản sang đây — bug report chỉ **link tới** ảnh trong `executions/<module>/<nền-tảng>/run_*/evidence/`, giữ đúng một nguồn sự thật.

### Xem kết quả bằng web viewer

Các trang tĩnh trong `scripts/`, mở bằng cách double-click, chạy offline, không cần cài gì:

| Trang | Nạp file gì | Dùng khi |
|---|---|---|
| `scripts/testcases-viewer/bundle.html` | `test_cases_*.md` | Duyệt, lọc, xuất Excel test case |
| `scripts/execution-viewer/bundle.html` | `execution_report.md` · `retest_report.md` | Xem kết quả chạy (bộ TC lẫn checklist — nhãn `CHECKLIST` riêng), so sánh giữa các lần chạy, xuất CSV/Excel |
| `scripts/traceability-viewer/bundle.html` | cả thư mục `docs/traceability/` (file chung + file từng module) | Xem độ phủ REQ theo module · Story, lọc 🔴 🟠 🟡 🟣 ✅ ⏭️, TC chưa automate, gap, việc cần làm, xuất CSV/Excel |
| `scripts/user-guide/md2html.py` (chạy bằng Python) | `user_guide_<module>.md` | Xuất User Guide thành HTML 1 file nhúng ảnh + video (`--standalone --lang <vi\|en> [--release]`) — cùng thư mục có công cụ quay video/highlight, xem `scripts/user-guide/README.md` |
| `scripts/bugs-viewer/bundle.html` | `docs/bugs/README.md` (danh mục) · `docs/bugs/<module>/<nền-tảng>/BUG_*.md` | Lọc bug theo Severity/Priority/Trạng thái, xem Lịch sử retest, xuất CSV/Excel |

### Quy tắc bất biến

| Quy tắc | Lý do |
|---|---|
| Tên file index **luôn** `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` / `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` (IN HOA — `<TÊN_MODULE>` = tên thư mục module viết HOA, `-` đổi thành `_` (VD `login` → `LOGIN`, `customers` → `CUSTOMERS`) — **không phải** prefix REQ (`CUST`)) / `user_guide_<module>.md` | Mọi workflow phía sau đọc theo mẫu `docs/<nhánh>/<module>/<file>`. Đổi tên là vỡ chuỗi RTM. IN HOA để file tổng **khác hẳn** file nền tảng `requirements_<module>_<nền-tảng>.md` / `test_cases_<module>_<nền-tảng>.md` — trước đây `test_cases_login.md` và `web/test_cases_login_web.md` trông gần như nhau, dễ mở nhầm. Giữ tên module trong tên file để tab editor / kết quả tìm kiếm vẫn biết đang ở module nào |
| Tài liệu cũ còn index tên `requirements_<module>.md` / `test_cases_<module>.md` (quy ước trước 21-09-2026) | Workflow đọc **nhận cả hai tên**. Lần đầu một workflow sinh/cập nhật chạm lại module → đổi tên **một lần** sang tên mới, sửa mọi link trỏ tới, ghi Nhật ký. Không tự đổi hàng loạt khi chỉ đọc |
| **KHÔNG** nhét số phiên bản vào tên index (`_v2`, `_new`, `_index`…) | Bản mới **thay thế** index tại chỗ; bản cũ tra bằng **lịch sử git** — `docs/` **không** có thư mục `archive/` |
| Mỗi module một prefix **duy nhất** (`LOGIN`, `CUST`, `PRJ`…) | Chống trùng mã giữa các module — tra ở danh mục trước khi đặt |
| **Một nghiệp vụ = một prefix trên mọi nền tảng** — web, app Android/iOS, API của cùng nghiệp vụ chung prefix, chung **thư mục module**, chung **dải REQ ID / TC ID**; nội dung riêng từng nền tảng nằm ở tầng `web/` · `mobile/` · `api/`, REQ áp ≥ 2 nền tảng nằm ở index. ❌ `LOGIN_APP`, `MCUST`, `docs/requirements/login_mobile/` | Tách prefix theo nền tảng là nhân đôi REQ cho cùng một rule — sửa ở web quên sửa ở app, RTM vẫn báo phủ đủ. Namespace `_<hệ-thống>/` **chỉ** dành cho hệ thống khác nghiệp vụ, không cho app/API của cùng hệ thống |
| **KHÔNG đánh lại mã REQ từ `01`** khi module đã có tài liệu | Đụng mã là vỡ toàn bộ traceability |
| **AMB / RISK mang prefix module, đánh số riêng từng module**: `AMB-<MODULE>-<nn>` · `RISK-<MODULE>-<nn>` (VD `AMB-CUST-01`). Module mới bắt đầu từ `01`, **không** nối số của module khác. Cấp hệ thống (cắt ngang, chưa quy về module): `AMB-SYS-<nn>` — `SYS` là prefix dành riêng | Mã trần `AMB-15` do hai module tự đánh số sẽ va nhau — một mã, hai câu hỏi. Có prefix thì grep ra đúng một nghĩa |
| **KHÔNG xoá dòng REQ** — tính năng gỡ thì đổi trạng thái 🔴 Deprecated | Xoá dòng là mất dấu vết |
| **KHÔNG đổi / đánh lại TC ID** khi cập nhật TC theo ticket — sửa tại chỗ, ghi **mốc git** (hash commit trước khi sửa) vào Nhật ký, TC bị gỡ gắn tag `@Deprecated` ở cột `Tags` + tiền tố `🗑️ Deprecated (<TICKET-ID>, <ngày>) —` ở `Test Scenario` (bảng TC không có cột trạng thái) — `/execute-test-cases`, RTM, Bảng Đối Soát Coverage lọc theo tag này | TC ID là khoá nối sang `allure.label('testId', ...)` trong script, cột TC ID của RTM và execution report cũ. Đổi là cắt cả ba mối nối, không có cách phát hiện tự động |
| Mọi thay đổi requirements phải ghi **Nhật ký thay đổi** ở cuối tài liệu module | Bộ nhớ liền mạch giữa các phiên, và là nơi báo TC nào đã stale |
| Evidence nằm **cùng** tài liệu sinh ra nó (recon → `<module>/<nền-tảng>/evidence/`, execution → `<module>/<nền-tảng>/run_*/evidence/`) | Di chuyển/xoá không lạc file; link tương đối không gãy |
| 🔒 **KHÔNG ghi giá trị bí mật thật vào `docs/`** — mật khẩu, token, cookie xác thực, session id, API key. Ghi **hình thái** (`<16 ký tự hex>`) thay cho giá trị | `docs/` được commit và **lịch sử git không xoá được bằng cách sửa file**. Credentials sống ở `.env` (đã `.gitignore`); tài liệu chỉ mô tả *hình dạng* |
| 📸 **Evidence chụp đúng phạm vi đối tượng cần chứng minh, không chụp thừa** — đối tượng nằm trọn trong viewport thì chụp viewport, đừng full-page kéo theo cả trang dữ liệu nghiệp vụ | Ảnh full-page của màn hình nghiệp vụ kéo theo tên khách hàng, số tiền, nhật ký hoạt động — không liên quan gì tới REQ mà vẫn bị commit |
| 🔍 **Chụp xong phải mở lại ảnh xác nhận đúng trạng thái** trước khi ghi vào Danh mục Evidence | Thao tác mở dropdown/tab có thể thất bại âm thầm. Dòng danh mục sai **nguy hiểm hơn không có ảnh** — nó tạo cảm giác REQ đã có bằng chứng |
| Bug report sống ở **`docs/bugs/<module>/<nền-tảng>/`**, KHÔNG ở gốc repo | Bug là mắt xích thứ tư của chuỗi truy vết; để ngoài `docs/` thì lệnh dọn dự án bỏ sót, để lại bug mồ côi trỏ vào TC/REQ đã đổi nghĩa |
| Bug **phải trỏ về TC ID và REQ ID đang có hiệu lực**; evidence chỉ **link** tới `executions/`, không nhân bản | Bug trỏ vào mã đã đổi nghĩa còn tệ hơn không trỏ — người đọc tin nhầm. Nhân bản ảnh là tạo hai nguồn sự thật |
| Mục checklist khi đi ra khỏi file checklist mang **mã mục `CL-<phần tên file sau checklist_>-<nn>`**, không dùng `#3` trần · kết quả checklist **không** cộng vào số của bộ TC (RTM xếp REQ chỉ có checklist là 🟠, báo cáo tổng hợp tách bảng riêng) | `#3` trùng giữa mọi checklist — viewer, RTM, bug, báo cáo nối nhầm mà không ai biết. 12 mục smoke cộng vào 36 TC là pass rate vô nghĩa |
| Thêm module = thêm thư mục + 1 dòng ở `README.md` danh mục | Không đụng gì khác trong repo |
| 📅 **Ngày trong nội dung tài liệu viết `DD-MM-YYYY`** (VD `17-09-2026`) hoặc `DD/MM/YYYY`; có giờ thì `17-09-2026 14:10`. Áp cho mọi file trong `docs/`, mẫu trong `.claude/`, `plans/`, `prompts/` và phiếu nhập. **Tên file giữ dạng cũ**: `run_<timestamp>`, `test_progress_<mốc>_<YYYYMMDD>.md`, `openapi_<YYYY-MM-DD>.json` · mã có ngày như `PO-2026-08-18` giữ nguyên · dữ liệu nhập vào hệ thống (payload API, giá trị field) viết đúng **định dạng hệ thống yêu cầu**, không đổi theo quy tắc này | Người đọc tài liệu là QA/PM/khách Việt Nam. Tên file cần năm đứng đầu để xếp đúng thứ tự thời gian. Đọc tài liệu cũ (trước 17-09-2026) vẫn gặp `YYYY-MM-DD` → **nhận cả hai**, năm đứng đầu không thể nhầm; **không** bao giờ hiểu `05-10-2026` theo kiểu Mỹ |
| `_discovery/` **không được** chứa mã `REQ-XXX-NN` — chỉ cấp **prefix** | Tầng khám phá chưa mở form, chưa trigger validation; cấp số REQ ở đó là chắc chắn phải đánh lại |
| Bản đồ khám phá tách file thì index **vẫn** là `_discovery/system_map.md` + có mục `## Bản đồ tài liệu` | Cùng hợp đồng đọc với `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` — workflow sau chỉ nhớ một đường dẫn |
| Gộp module vào chung 1 file khám phá **KHÔNG** gộp prefix, **KHÔNG** gộp `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` | Gộp là để đọc cho gọn; ranh giới truy vết vẫn là prefix. 3 module chung file khám phá vẫn ra 3 tài liệu requirements riêng |

Chi tiết: skill `skills-requirements-analyzer` mục 2.1 (nối tiếp mã), 5.3 (thư mục), 5.7 (danh mục), 6.9 (nhật ký) · skill `skills-rbt-manual-testing` mục "Quy Tắc Xuất File" phần 2 và 4.

### Nhiều hệ thống trong cùng repo — namespace `_<hệ-thống>/`

Mặc định `docs/` phục vụ **một** hệ thống. Khi cần chứa **hệ thống thứ hai** mà không đụng hệ thống đang có, tách bằng namespace có dấu `_` đứng đầu:

```
docs/requirements/README.md          ← hệ thống MẶC ĐỊNH (hệ thống đầu tiên của repo)
docs/requirements/login/ ...         ← module của hệ thống mặc định
docs/requirements/_book-api/         ← HỆ THỐNG THỨ HAI
├── README.md                        ← danh mục riêng — prefix, TC ID, AMB riêng
├── _discovery/api_map.md            ← hoặc system_map.md nếu là hệ thống có UI
└── <module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md
docs/testcases/_book-api/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md
```

| Quy tắc | Lý do |
|---|---|
| Dấu `_` đầu tên = **không phải module** | Cùng quy ước với `_discovery/`. Workflow quét thư mục module sẽ bỏ qua, không nhầm namespace thành module |
| Mỗi namespace có **`README.md` danh mục riêng** | Prefix, dải REQ, dải TC ID, AMB của hai hệ thống **không** dùng chung sổ |
| Mã REQ mang **mã hệ thống**: `REQ-<HỆ_THỐNG>-<MODULE>-<nn>` · `AMB-<HỆ_THỐNG>-<MODULE>-<nn>` · TC ID `<HỆ_THỐNG>_<MODULE>_TC_<nnn>` | Grep một mã ra đúng một hệ thống. Hệ thống mặc định giữ dạng cũ `REQ-<MODULE>-<nn>`, không phải đánh lại |
| Hệ thống mặc định **không bị đụng vào** khi thêm namespace | Thêm hệ thống mới = thêm 1 thư mục, không sửa file nào đang có |
| Chuyển dự án mới: xoá `docs/` là xoá **tất cả** hệ thống | Muốn giữ một cái thì sao lưu namespace đó trước |

### Nhánh API & Mobile — mặt khác của hệ thống

Một hệ thống có thể có nhiều **mặt** — web, app mobile, API. **Chung bản đồ, chung prefix** (bảng quy tắc bất biến ở trên). Mặt API **chỉ** mở namespace `_<hệ-thống>/` khi nó là hệ thống **chỉ có API** và là hệ thống thứ hai của repo.

Mặt API khác mặt UI 3 chỗ:

| | Hệ thống UI | Hệ thống API |
|---|---|---|
| File index tầng khám phá | `_discovery/system_map.md` | `_discovery/api_map.md` |
| Bằng chứng khảo sát | `evidence/*.png` — screenshot | `_discovery/sources/openapi_<ngày>.json` — snapshot spec + request/response nguyên văn chép trong tài liệu |
| Ranh giới module | Menu điều hướng | `tags` của spec — hệ thống đã có UI thì **ghép tag vào module UI**, dùng prefix cũ |

**Chuỗi workflow của mặt API:**

```
/discover-system (nhánh API) ──→ /generate-requirements-from-api ──→ /generate-testcases-api ──→ /generate-automation-api
      api_map.md                     REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md        test_cases_<module>_api.md    code + reports/
```

- Nguồn nhận được: Swagger UI (kể cả nhiều spec) · Scalar (URL hoặc spec nhúng inline) · Redoc · Stoplight · RapiDoc · OpenAPI JSON/YAML · Postman collection · **tài liệu API dạng `.docx`/`.pdf`**. Cách lấy từng loại: skill `skills-requirements-analyzer` mục 3.4.1
- Spec **tải thô bằng `curl`**, không dùng `WebFetch` — kết quả `WebFetch` đã qua xử lý, spec lớn bị cắt âm thầm
- `/generate-testcases-api` vẫn chạy thẳng được khi chưa có hai tầng trước (tự làm tầng khám phá), nhưng TC sẽ không có REQ để neo — `/generate-traceability-matrix` sẽ báo mồ côi
- `/generate-automation-api` **chỉ** nhận file TC API — không sinh code thẳng từ spec

**Mặt Mobile:** khám phá bằng `/discover-system` (Bước 3-M, Appium MCP) · sinh REQ bằng `/generate-requirements-from-mobile` vào tầng `mobile/` của **cùng** thư mục module web · luật chi tiết ở skill `skills-requirements-analyzer` mục 3.5 và 7.5. App Flutter chưa bật semantics thì chỉ khảo sát được mức hình ảnh — báo dev, **không** bấm theo toạ độ.

> ⚠️ **Spec không phải hành vi.** Swagger khai `403` không có nghĩa hệ thống trả `403`; khai `required` không có nghĩa server chặn. Bắt buộc gọi thật kiểm chứng (khi QA có quyền gọi API) — chi tiết ở skill `skills-requirements-analyzer` mục 3.4.4. Lệch spec ↔ thực tế: REQ theo spec + `AMB` 🔴 ghi cả hai, không tự hạ REQ theo hành vi thật.
>
> ⚠️ **Test BOLA/IDOR phải tự tạo 2 tài khoản của mình.** CẤM lấy `id` từ API danh sách rồi `PATCH`/`DELETE` — đó là dữ liệu thật của người khác, kể cả khi được cho phép thao tác phá huỷ.

### Mở phiên trên dự án đã có nhiều tài liệu

Dự án lớn dần lên hàng chục module — **agent KHÔNG đọc hết `docs/`**, cũng không cần user paste tài liệu vào chat. Đọc theo **chuỗi 3 tầng**, mở rộng dần theo nhu cầu:

| Tầng | File | Trả lời câu hỏi | Khi nào đọc |
|---|---|---|---|
| **1** | `docs/requirements/README.md` | Hệ thống có module nào · prefix đã chiếm · mã REQ kế tiếp · AMB 🔴 còn treo | **Luôn** — mọi tác vụ đụng `docs/` |
| **2** | `docs/requirements/_discovery/system_map.md` (+ `api_map.md` nếu có mặt API) | Module nằm ở route / màn hình app nào · có ở nền tảng nào · phụ thuộc giữa module · risk · vùng chưa xác minh | Khi cần bối cảnh cấp hệ thống hoặc sắp recon module mới |
| **3** | `docs/<nhánh>/<module>/<file index>` | Từng field · từng rule · từng message | **Chỉ module đang làm** — 1–2 file, không hơn |

**Quy tắc:** đọc tầng 1 → định vị được module cần → mở thẳng tầng 3 của **đúng module đó**. Không glob toàn bộ `docs/requirements/*/` để "đọc cho chắc" — đó là cách nhanh nhất làm tràn ngữ cảnh và trả lời sai chi tiết.

**Câu mở phiên chuẩn** (dán vào chat khi bắt đầu phiên mới trên dự án đã có tài liệu):

```
Đọc docs/requirements/README.md và docs/requirements/_discovery/system_map.md để nắm bối cảnh dự án. Liệt kê: module đã có tài liệu / chưa recon / còn ambiguity 🔴 treo. Chưa cần mở file module nào.
```

Agent nhận câu này thì **chỉ** đọc 2 file tầng 1–2 rồi báo cáo, **không** tự động đi recon hay sinh tài liệu.

### Chuyển sang dự án mới — dọn gì

```bash
rm -rf docs .playwright-mcp task.md .claude/settings.local.json
```

| | |
|---|---|
| **Xoá** | `docs/` (gồm cả `docs/bugs/`) · `.playwright-mcp/` · `task.md` · `.claude/settings.local.json` |
| **Giữ nguyên** | `.claude/` (trừ `settings.local.json`) · `plans/` (xoá hết giá trị trong `plans/master-test-plan/test_plan.config.yaml`, giữ tên ô và chú thích) · `prompts/` · `scripts/` · `CLAUDE.md` · `README.md` · `.gitignore` — khung dùng lại được, không hardcode hệ thống nào |

✅ **Bug report nằm trong `docs/bugs/`** — xoá `docs/` là xoá luôn, không còn sót như cấu trúc `bug_reports/` ở gốc trước đây.

⚠️ **`.claude/settings.local.json`** là permission tích luỹ theo từng máy/phiên, thường chứa đường dẫn tuyệt đối của dự án cũ. Đã đưa vào `.gitignore` — nếu file còn bị git theo dõi từ trước, gỡ bằng: `git rm --cached .claude/settings.local.json`

⚠️ **Trước khi xoá, kiểm tra ảnh trong `docs/executions/*/run_*/evidence/` và `docs/user-guides/*/images/`** — screenshot chụp hệ thống thật, thường chứa dữ liệu khách hàng (tên, email, số tiền). Quan trọng hơn nữa: **đừng commit chúng lên repo công khai**.

Không cần dọn gì thêm. Agent tự tạo lại `docs/` và 2 file danh mục (`docs/requirements/README.md`, `docs/testcases/README.md`) ở lần chạy workflow đầu tiên — xem skill `skills-requirements-analyzer` mục 5.7.1.

**Chốt trước khi phân tích module đầu tiên** — agent **tự khám phá**, chỉ hỏi user thứ không suy ra được:

| Cần chốt | Ai xác định |
|---|---|
| **Prefix REQ** từng module (`LOGIN`, `CUST`…) — ngắn, HOA, không dấu | Agent tự đặt từ tên module đã recon, ghi vào `docs/requirements/README.md` |
| **Prefix TC ID** `<HỆ_THỐNG>_<MODULE>_TC_<3 số>` — `<HỆ_THỐNG>` đổi theo dự án (`CRM_` → `ERP_`, `HRM_`…) | Agent suy từ tên hệ thống, **xác nhận với user một câu** rồi dùng xuyên suốt. Đổi giữa chừng là phải sửa toàn bộ TC ID |
| **URL · tài khoản test** | User cung cấp lúc chat — lưu ở `.env`, KHÔNG ghi vào tài liệu |
| **Môi trường dùng chung không?** | **Hỏi user một lần** — không suy ra được từ UI. Nếu CÓ → bật quy tắc dọn dữ liệu test, cấm thao tác phá huỷ |
| **Năng lực kiểm thử của QA** — quyền gọi API · truy vấn CSDL · kiểm tích hợp · xem nhật ký hoạt động | **Hỏi user một lần**, kiểm chứng được thì đo luôn → ghi vào bảng thuộc tính đầu `docs/requirements/README.md`. Đây là đầu vào cho nhánh **Vòng 3** của mọi bộ TC — hỏi lại ở từng module là sai |
| Business rules ẩn (CAPTCHA, OTP, quy tắc sinh mã…) | Agent phát hiện khi recon → ghi ngay vào tài liệu module. Chỉ hỏi user khi mâu thuẫn |

> **Không có file hồ sơ dự án để điền tay.** Ngữ cảnh dự án nằm trong `docs/` do agent tự sinh — xem `skills-requirements-analyzer` mục 5.7.1.

📌 **Hệ thống mới, chưa biết có module nào → chạy `/discover-system` trước tiên** — đưa URL web, app mobile, spec API (Swagger/Scalar/Postman/`.docx`), hoặc cả ba; workflow tự nhận diện mặt. Workflow đó chốt luôn 5 mục trong bảng trên (prefix module · tiền tố TC ID · URL/tài khoản · môi trường dùng chung · business rules ẩn) và sinh sẵn `docs/requirements/README.md` + `_discovery/system_map.md`. QA có sẵn **một phần** tài liệu thì đưa vào cùng — chạy mode HYBRID, workflow sẽ lập Bản đồ phủ tài liệu để biết vùng nào tin được từ spec, vùng nào phải recon.

## 7. Test Data

- Tất cả field yêu cầu **unique** (Email, Username, Code/ID): **BẮT BUỘC** dùng dữ liệu random.
- Dữ liệu random phải **traceable / deterministic** — có thể truy ngược test gây lỗi.
- Format khuyến nghị: kết hợp `test name + timestamp + prefix`.

Ví dụ:

```
email:    test_login_1712049200@auto.test
username: auto_user_1712049200
code:     TC_LOGIN_1712049200
```

## 8. Code Quality (Smart Waits)

- **KHÔNG** dùng hard sleep (`waitForTimeout`, `Thread.sleep`, fixed delay).
- Chỉ sử dụng **smart waits** / auto-waiting:

| Framework  | Smart Wait                                                           |
| ---------- | -------------------------------------------------------------------- |
| Playwright | `expect().toBeVisible()`, `expect().toBeEnabled()`, Locator APIs |
| Selenium   | `WebDriverWait` + `ExpectedConditions`                           |
| Appium     | `WebDriverWait` + custom conditions                                |

- Hạn chế `waitForSelector` nếu `expect()` đáp ứng được.
- Mọi assertion phải có **timeout rõ ràng** hoặc dùng default timeout hợp lý.

## 9. Anti-Patterns (FORBIDDEN)

| ❌ Anti-Pattern                                   | ✅ Thay thế đúng                            |
| ------------------------------------------------- | ---------------------------------------------- |
| Guess selector / đoán locator                   | Inspect DOM thực tế trước khi code         |
| Hard sleep (`waitForTimeout`, `Thread.sleep`) | Smart waits (`expect()`, `WebDriverWait`)  |
| Copy selector từ code cũ không verify          | Luôn verify selector trên browser hiện tại |
| Viết test không chạy ngay                      | Chạy test ngay sau khi implement              |
| Commit test FAIL                                  | Chỉ commit khi test PASS ổn định           |
| Để debug log / commented code khi deliver       | Cleanup trước khi deliver                    |
| Dùng test data hardcoded trùng lặp             | Sinh data random + traceable                   |

## 10. Tham Chiếu Workflows

Agent sử dụng workflows trong `.claude/commands/` qua slash commands:

| Workflow                                  | Mô tả                                                     |
| ----------------------------------------- | ----------------------------------------------------------- |
| `/discover-system`                      | **Bước đầu tiên khi hệ thống không có tài liệu** — tự nhận diện mặt **web / app mobile / API** từ đầu vào, crawl navigation, lập bản đồ module (`system_map.md` · `api_map.md`), gán prefix chung mọi nền tảng, khởi tạo danh mục (3 modes: UI/HYBRID/DOC). KHÔNG sinh REQ ID |
| `/generate-requirements-from-website`   | Sinh requirements từ website đang chạy (nhánh UI Recon, Playwright MCP) |
| `/generate-requirements-from-mobile`    | Sinh requirements từ **app mobile** chạy thật — Native Android/iOS, Flutter, Hybrid (Appium MCP). Mỗi nền tảng một lượt, ghi vào `<module>/mobile/` — chung prefix và dải REQ với web/API cùng nghiệp vụ, xét đủ 8 nhóm yêu cầu riêng mobile. KHÔNG sinh TC |
| `/generate-requirements-from-api`       | Sinh requirements cho module **API** từ Swagger/Scalar/Redoc/OpenAPI/Postman/tài liệu API `.docx` — có kiểm chứng gọi thật, không cần Ticket ID, ghi vào `<module>/api/` — chung prefix và dải REQ với web/mobile cùng nghiệp vụ. KHÔNG sinh TC |
| `/analyze-requirement-document`         | Phân tích requirement document (Jira/.docx/.pdf/.xlsx/.csv) — sinh tài liệu phân tích, KHÔNG sinh TC |
| `/update-requirements-from-ticket`      | **Delta mode** — cập nhật tài liệu requirements đã có từ ticket mới: nhận diện THÊM/SỬA/BỎ, giữ nguyên REQ ID, ghi Nhật ký thay đổi, xuất Impact Report cho test cases |
| `/generate-testcases-manual-rbt`        | Sinh manual test cases theo AI-RBT 6 bước (FULL RBT mode) — sinh tuần tự theo **4 vòng** (Smoke → Functional → Technical → Non-functional), có bảng đối soát loại kiểm thử ở Quality Gate |
| `/generate-testcases-from-requirements` | Sinh test cases nhanh từ requirements (QUICK mode)         |
| `/generate-checklist-test`              | Sinh checklist test tick tay (CHECKLIST mode) — smoke / post-hotfix / regression / release-readiness. Chạy bằng `/execute-test-cases`, mỗi mục mang mã `CL-<…>-<nn>` |
| `/update-testcases-from-impact`         | **Delta mode cho test cases** — mắt xích giữa của chuỗi delta 3 tầng: từ Impact Report sửa TC stale tại chỗ, giữ nguyên TC ID, đánh dấu 🗑️ Deprecated TC bị gỡ, ghi Delta TC List ra `impact/delta_tc_<TICKET-ID>.md` có cột nền tảng (2 modes: PLAN/APPLY). KHÔNG sinh lại cả module |
| `/generate-automation-from-testcases`   | **Bộ định tuyến** — tự nhận nền tảng của file TC (`web/` · `mobile/` · `api/`) rồi chuyển sang command nền tảng. Mode WEB (mặc định) / MOBILE / API để chỉ định rõ. Không chứa logic sinh code |
| `/generate-automation-web`              | Sinh automation **web** (Playwright / Selenium) — mode TC (từ file TC web, mặc định) · mode FLOW (chưa có TC, chạy thật UI flow trên browser) |
| `/generate-automation-mobile`           | Sinh automation **Appium** — Native Android/iOS, **Flutter**, Hybrid — mode TC (từ file TC mobile, mặc định) · mode FLOW (chưa có TC). Nhận diện loại app trước, thu locator từ UI hierarchy |
| `/generate-automation-api`              | Sinh automation **API** từ file TC API — REST Assured / Playwright API / Pytest / Supertest, fixture 2 tài khoản BOLA, dọn dữ liệu, không hạ assertion để né bug |
| `/generate-application-test-plan`       | Khám phá app, sinh test plan (Mode PLAN) hoặc full suite (Mode FULL) |
| `/generate-automation-framework`        | Thiết kế automation framework                             |
| `/generate-locator`                     | Sinh locator ổn định cho UI element                      |
| `/generate-test-data`                   | Sinh test data có cấu trúc                               |
| `/generate-cross-module-test-plan`    | Phân tích cross-module (2 modes: DOCUMENT/BROWSER), sinh ma trận kết hợp — mặc định Output-Class Coverage, pairwise bằng script |
| `/generate-combinatorial-test-data`   | Sinh test data cho ma trận kết hợp — offline hoặc pipeline qua browser          |
| `/generate-testcases-api`               | Sinh **API test cases** từ Swagger/Scalar/Redoc/OpenAPI/Postman — neo vào REQ của `/generate-requirements-from-api`, kiểm chứng gọi thật, tự nhận nguồn URL hay file. Chưa có `api_map.md` thì tự làm tầng khám phá theo skill 3.4. KHÔNG sinh code |
| `/update-automation-from-impact`        | **Delta mode cho automation** — mắt xích cuối của chuỗi delta: đọc `delta_tc_<TICKET-ID>.md` của `/update-testcases-from-impact`, map TC đã đổi sang script **web · mobile · API** và sửa đúng phần đổi, mỗi nền tảng một lượt (2 modes: PLAN/APPLY). KHÔNG sinh lại cả module |
| `/run-and-fix-tests`                    | Chạy suite có sẵn, phân loại failure, tự sửa nhóm sửa được (2 modes: RUN/FIX). KHÔNG sửa test để né bug app |
| `/heal-locators`                        | Rà & sửa locator trong Page Object sau khi UI đổi (2 modes: SCAN/HEAL) |
| `/review-automation-code`               | Review chất lượng automation code theo Definition of Done (2 modes: REVIEW/FIX) |
| `/analyze-flaky-tests`                  | Phân tích và khắc phục flaky tests                     |
| `/fetch-jira-requirements`              | Lấy requirements/user stories từ Jira                     |
| `/import-test-results-xray`             | Đẩy kết quả test lên Xray                              |
| `/create-bug-report`                    | Sinh bug report chuẩn từ test FAIL (tùy chọn đẩy Jira)  |
| `/execute-test-cases`                   | Thực thi manual TC **hoặc checklist** trên browser thật — chấm PASS/FAIL/BLOCKED/SKIPPED, xuất execution report (ô `Loại nguồn` phân biệt bộ TC / checklist) |
| `/retest-fixed-bugs`                    | **Đóng vòng lặp bug** — retest bug đã fix trên build mới, chấm FIXED/NOT_FIXED/PARTIAL, chạy regression quanh vùng fix (2 modes: RETEST/FULL) |
| `/analyze-test-report`                  | Phân tích test report **một lần chạy** — 2 nhánh AUTOMATION / MANUAL, gom nhóm failure, đề xuất xử lý |
| `/generate-master-test-plan`            | Master Test Plan cấp quản lý — đầu vào phiếu YAML `plans/master-test-plan/test_plan.config.yaml`. Phạm vi **module × nền tảng**, cấp độ · loại · độc lập kiểm thử, chiến lược tự động hoá · phi chức năng, tiêu chí vào/ra, môi trường · dữ liệu kiểm thử, quản lý lỗi, lịch · ước lượng · ngân sách, rủi ro dự án + sản phẩm. Xuất `docs/test-plans/test_plan_<mốc>.md`, bám 29119-3, phủ đủ ISTQB CTFL v4.0 mục 5.1.1 |
| `/generate-test-progress-report`        | Báo cáo tiến độ **một kỳ** trong đợt — so thực tế với lịch plan, chỉ số trong kỳ, trở ngại, rủi ro mới, kế hoạch kỳ tới, đề xuất điều chỉnh. **Không** khuyến nghị go/no-go |
| `/generate-test-summary-report`         | Báo cáo tổng hợp tại một mốc release/sprint — gộp mọi kết quả, đối chiếu tiêu chí exit, **khuyến nghị go/no-go** |
| `/review-testcases`                     | Review chất lượng manual TCs (3 modes: REVIEW/FIX/AUTOMATION — AUTOMATION chấm độc lập TC nào làm automation được theo `skills-rbt-manual-testing/references/automation_criteria.md`) |
| `/generate-traceability-matrix`         | Sinh ma trận truy vết RTM 3 tầng (+ checklist, kết quả chạy, bug làm nguồn phụ) — file chung `docs/traceability/traceability_matrix.md` + file chi tiết từng module. Nhận danh sách module (`login, customers`) |
| `/generate-api-mocks`                   | Sinh API mocks + tests cho edge cases                        |
| `/generate-user-guide`                  | Sinh **Hướng dẫn sử dụng** cho người dùng cuối từ requirements + evidence đã khảo sát (3 modes: DOC/LIVE/VIDEO · `lang` vi/en) — ảnh/video có highlight, luôn xuất HTML 1 file nhúng media. KHÔNG phải tài liệu requirements viết lại giọng khác |
