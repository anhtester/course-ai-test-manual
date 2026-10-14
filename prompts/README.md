# Prompt Templates — Dùng Nhanh với Claude Code

Thư mục này chứa các prompt mẫu dùng nhanh (copy → paste → gửi) đã được thiết kế tối ưu cho **Claude Code**. Các prompt này hỗ trợ gọi trực tiếp slash command hoặc thực thi đơn lẻ theo tiêu chuẩn chất lượng cao.

> **📌 Nguyên tắc thiết kế prompt:** Prompt chỉ chứa **INPUT của lần chạy** (slash command + context + data + lựa chọn per-run như Mode, format output). KHÔNG lặp lại CONSTRAINTS / OUTPUT FORMAT / quy trình — những phần đó đã được định nghĩa duy nhất trong `.claude/skills/` và `.claude/commands/`, agent tự nạp khi gọi command. Lặp lại sẽ gây drift khi nâng cấp skill.
>
> **📌 KHÔNG khai báo thứ agent tự đọc được từ repo.** Bỏ hẳn các dòng kiểu `Dự án`, `Stack`, `Framework`, `Language`, `Build tool`, `Design Pattern`, `Test Runner` — agent mở `package.json` / `pom.xml` / source code là biết. Điền tay chỉ tốn công và sai lệch khi dự án đổi.
>
> **Chỉ giữ thứ agent KHÔNG suy ra được:** URL · tài khoản test · môi trường (Dev/Staging/Prod, có dùng chung không) · Mode · phạm vi chạy · trọng tâm · dữ liệu dán trực tiếp.
>
> *Ngoại lệ duy nhất:* `03_create_framework_*` và `04_generate_script_*` vẫn ghi công nghệ, vì hai bộ này có nhánh **chưa có project — agent tự scaffold**. Lúc đó chưa có code để đọc, dòng công nghệ chính là lựa chọn cần chốt. Đã có project sẵn thì xoá dòng đó đi.

---

## Danh Sách Prompt Mẫu

> **Số thứ tự file = ID cố định**, không phải thứ tự chạy. Các nhóm dưới đây chỉ để tra cứu cho nhanh — cần thứ tự chạy thực tế thì xem [`AI_FULL_FLOW_MANUAL.md`](../AI_FULL_FLOW_MANUAL.md) (nhánh Manual) hoặc [`AI_FULL_FLOW_AUTOMATION.md`](../AI_FULL_FLOW_AUTOMATION.md) (nhánh Automation).

### 🔍 Khảo sát & Requirements

| # | File | Command Tương Ứng | Skill Tích Hợp | Mô Tả & Cải Tiến Mới |
|---|------|-------------------|----------------|----------------------|
| 00 | `prompt_00_discover_system.txt` | `/discover-system` | `skills-requirements-analyzer` | **[Mới]** Chạy **đầu tiên** khi hệ thống không có tài liệu — tự nhận diện mặt **web / app mobile / API**, lập bản đồ module, gán prefix chung mọi nền tảng, khởi tạo danh mục. 3 modes UI/HYBRID/DOC |
| 01 | `prompt_01_generate_requirements.txt` | `/generate-requirements-from-website` | `skills-requirements-analyzer` | Phân tích website/sơ đồ để sinh tài liệu Yêu cầu |
| 30 | `prompt_30_generate_requirements_from_mobile.txt` | `/generate-requirements-from-mobile` | `skills-requirements-analyzer` · `skills-mobile-debug-agent` | **[Mới]** Sinh REQ cho module trên **app mobile** (Native Android/iOS, Flutter, Hybrid) qua Appium MCP — mỗi nền tảng một lượt, ghi vào `<module>/mobile/`, chung prefix và dải REQ với web/API, xét đủ 8 nhóm yêu cầu riêng mobile |
| 29 | `prompt_29_generate_requirements_from_api.txt` | `/generate-requirements-from-api` | `skills-requirements-analyzer` | **[Mới]** Sinh REQ cho module **API** từ Swagger UI / Scalar / Redoc / OpenAPI / Postman / tài liệu API `.docx` — kiểm chứng bằng gọi thật, không cần Ticket ID, ghi vào `<module>/api/`, chung prefix và dải REQ với web/mobile cùng nghiệp vụ |
| 20 | `prompt_20_analyze_requirement_document.txt` | `/analyze-requirement-document` | `skills-requirements-analyzer` | **[Mới]** Phân tích ticket/tài liệu (.docx/.xlsx/.pdf/mockup) → `analysis_<TICKET-ID>.md` kèm REQ ID + Ambiguity/Risk. **KHÔNG** sinh test cases |
| 21 | `prompt_21_update_requirements_from_ticket.txt` | `/update-requirements-from-ticket` | `skills-requirements-analyzer` | **[Mới]** Delta mode cho requirements — sửa tại chỗ tài liệu module, giữ nguyên REQ ID, ghi Nhật ký thay đổi, xuất **Impact Report** (input cho `prompt_27`) |

### 📝 Manual Test Cases

| # | File | Command Tương Ứng | Skill Tích Hợp | Mô Tả & Cải Tiến Mới |
|---|------|-------------------|----------------|----------------------|
| 02 | `prompt_02_generate_test_cases.txt` | `/generate-testcases-manual-rbt` | `skills-rbt-manual-testing` | **[Nâng cấp mới]** Sinh Manual TCs chuẩn RBT, Checklist 15 loại input fields, Race condition, Session, A11y, AI Self-Quality Gate & Automation Metadata |
| 27 | `prompt_27_update_testcases_from_impact.txt` | `/update-testcases-from-impact` | `skills-rbt-manual-testing` (Mode DELTA) | **[Mới]** Delta mode cho test cases — mắt xích **giữa** của chuỗi delta 3 tầng. Nhận Impact Report (`prompt_21`), sửa TC stale tại chỗ, giữ nguyên TC ID, đánh dấu 🗑️ Deprecated TC bị gỡ, mode APPLY ghi **Delta TC List** ra `impact/delta_tc_<TICKET-ID>.md` có cột nền tảng (input cho `prompt_19`). 2 modes PLAN/APPLY |
| 22 | `prompt_22_generate_testcases_quick.txt` | `/generate-testcases-from-requirements` | `skills-rbt-manual-testing` | **[Mới]** Sinh Manual TCs **QUICK mode** — 1 lượt, không dừng hỏi. Dành cho module đơn giản, requirements đã rõ (bản đầy đủ 6 bước xem `prompt_02`) |
| 15 | `prompt_15_generate_checklist.txt` | `/generate-checklist-test` | `skills-rbt-manual-testing` | Sinh checklist tick tay (CHECKLIST mode) — 4 loại Smoke/Post-hotfix/Regression/Release-readiness, nguồn TC-based hoặc REQ-based |
| 12 | `prompt_12_review_testcases.txt` | `/review-testcases` | `skills-testcase-reviewer` | Review chất lượng manual TCs theo rubric 6 tiêu chí — 3 modes REVIEW/FIX/AUTOMATION (AUTOMATION: chấm TC nào làm automation được) |
| 16 | `prompt_16_execute_test_cases.txt` | `/execute-test-cases` | `skills-manual-test-executor` | Thực thi manual TC qua Playwright MCP — chấm PASS/FAIL/BLOCKED/SKIPPED, thu evidence, xuất execution report |

### 🏗️ Framework & Sinh Script Automation

| # | File | Command Tương Ứng | Skill Tích Hợp | Mô Tả & Cải Tiến Mới |
|---|------|-------------------|----------------|----------------------|
| 03 | `prompt_03_create_framework_playwright.txt` | `/generate-automation-framework` | `skills-framework-architect` | Dựng khung dự án Automation Playwright TypeScript |
| 03 | `prompt_03_create_framework_selenium.txt` | `/generate-automation-framework` | `skills-framework-architect` | Dựng khung dự án Automation Selenium Java |
| 03 | `prompt_03_create_framework_appium.txt` | `/generate-automation-framework` | `skills-framework-architect` | Dựng khung dự án Automation Appium Java (Mobile) |
| 04 | `prompt_04_generate_script_playwright.txt` | `/generate-automation-from-testcases` | `skills-qa-automation-engineer` | Viết kịch bản tự động Playwright TypeScript theo POM |
| 04 | `prompt_04_generate_script_selenium.txt` | `/generate-automation-from-testcases` | `skills-qa-automation-engineer` | Viết kịch bản tự động Selenium Java theo POM |
| 05 | `prompt_05_convert_manual_to_automation.txt` | `/generate-automation-from-testcases` | — (bộ định tuyến) | Chuyển Manual Test Cases sang Automation Script — **tự nhận nền tảng** của file TC (`web/` · `mobile/` · `api/`) rồi chuyển sang `/generate-automation-web` · `-mobile` · `-api` |
| 26 | `prompt_26_generate_automation_mobile_flow.txt` | `/generate-automation-mobile` | `skills-mobile-debug-agent` | **[Mới]** Sinh automation Appium — **Native Android/iOS, Flutter, Hybrid** — mode TC (có file TC mobile) hoặc FLOW (chỉ có mô tả flow). Nhận diện loại app trước, thu locator từ UI hierarchy, Screen Object tách Android/iOS |
| 09 | `prompt_09_generate_api_tests.txt` | `/generate-testcases-api` | `skills-requirements-analyzer` | **[Nâng cấp mới]** Sinh **API test cases** từ Swagger UI / Scalar / Redoc / OpenAPI / Postman — tự nhận nguồn URL hay file, kiểm chứng gọi thật, 12 HTTP Status Codes, OWASP API Security (BOLA/IDOR, Mass Assignment, ReDoS). KHÔNG sinh code |
| 31 | `prompt_31_generate_automation_api.txt` | `/generate-automation-api` | `skills-qa-automation-engineer` | **[Mới]** Sinh automation API **từ file TC API** — REST Assured / Playwright API / Pytest / Supertest, fixture 2 tài khoản BOLA, dọn dữ liệu, attach request/response đã che |
| 14 | `prompt_14_generate_api_mocks.txt` | `/generate-api-mocks` | `skills-api-mocking` | Sinh API mocks (Playwright route / WireMock) + tests cho edge cases |

### 🔧 Bảo trì Automation

| # | File | Command Tương Ứng | Skill Tích Hợp | Mô Tả & Cải Tiến Mới |
|---|------|-------------------|----------------|----------------------|
| 06 | `prompt_06_review_automation_code.txt` | `/review-automation-code` | `skills-automation-code-reviewer` | **[Mới]** Review chất lượng automation code theo Definition of Done — rubric 6 nhóm, bắt hard sleep / locator inline / thiếu Allure metadata / assertion yếu (pass giả). 2 modes REVIEW/FIX |
| 17 | `prompt_17_run_and_fix_tests.txt` | `/run-and-fix-tests` | `skills-test-report-analyzer` | **[Mới]** Chạy suite có sẵn → phân loại failure theo root cause → tự sửa nhóm sửa được → chạy lại. 2 modes RUN/FIX. Bug app giữ nguyên đỏ, không sửa test để né |
| 18 | `prompt_18_heal_locators.txt` | `/heal-locators` | `skills-locator-healer-agent` | **[Mới]** Rà locator trong Page Object đối chiếu DOM thực tế sau khi UI đổi — bắt cả locator gãy, mong manh và sai element. 2 modes SCAN/HEAL |
| 19 | `prompt_19_update_automation_from_impact.txt` | `/update-automation-from-impact` | `skills-coverage-traceability` · `skills-ui-debug-agent` · `skills-mobile-debug-agent` | **[Mới]** Delta mode cho automation — mắt xích **cuối** của chuỗi delta 3 tầng. Đọc `delta_tc_<TICKET-ID>.md` (`prompt_27`), map TC đã đổi sang script **web · mobile · API**, sửa đúng phần đổi, chạy lại từng nền tảng, không sinh lại cả module. 2 modes PLAN/APPLY |
| 08 | `prompt_08_analyze_flaky_tests.txt` | `/analyze-flaky-tests` | `skills-flaky-test-analyzer` | Phân tích và khắc phục Flaky Tests |

### 🔗 Xuyên suốt Manual ↔ Automation

| # | File | Command Tương Ứng | Skill Tích Hợp | Mô Tả & Cải Tiến Mới |
|---|------|-------------------|----------------|----------------------|
| 07 | `prompt_07_generate_test_data.txt` | `/generate-test-data` | `skills-test-data-generator` | Sinh dữ liệu kiểm thử có cấu trúc |
| 10 | `prompt_10_create_bug_report.txt` | `/create-bug-report` | `skills-bug-reporter` | Sinh bug report chuẩn từ test FAIL — evidence, severity/priority, tùy chọn đẩy Jira |
| 11 | `prompt_11_analyze_test_report.txt` | `/analyze-test-report` | `skills-test-report-analyzer` | **[Nâng cấp]** Phân tích test report — **2 nhánh AUTOMATION / MANUAL**. Gom nhóm failure theo root cause, so sánh trend, đề xuất thứ tự xử lý |
| 13 | `prompt_13_generate_traceability_matrix.txt` | `/generate-traceability-matrix` | `skills-coverage-traceability` | Sinh ma trận truy vết RTM 3 tầng — tìm requirement chưa cover, orphan tests |
| 23 | `prompt_23_retest_fixed_bugs.txt` | `/retest-fixed-bugs` | `skills-manual-test-executor`, `skills-bug-reporter` | **[Mới]** Retest bug đã fix trên build mới — chấm FIXED/NOT_FIXED/PARTIAL/CANNOT_VERIFY, chạy regression quanh vùng fix, ghi Lịch sử retest vào bug gốc. 2 modes RETEST/FULL |

### 📊 Kế Hoạch & Báo Cáo Cấp Quản Lý

| # | File | Command Tương Ứng | Skill Tích Hợp | Mô Tả & Cải Tiến Mới |
|---|------|-------------------|----------------|----------------------|
| 25 | `prompt_25_generate_master_test_plan.txt` | `/generate-master-test-plan` | `skills-test-summary-reporter` | **[Mới]** Master Test Plan — đầu vào là phiếu YAML `plans/master-test-plan/test_plan.config.yaml`. Phạm vi **module × nền tảng**, cấp độ · loại · độc lập kiểm thử, phi chức năng, chiến lược tự động hoá, tiêu chí vào/ra, dữ liệu kiểm thử, quản lý lỗi, lịch · **ước lượng · ngân sách**, rủi ro dự án + sản phẩm. Xuất `docs/test-plans/`. Bám 29119-3, phủ đủ nội dung ISTQB CTFL v4.0 mục 5.1.1 |
| 32 | `prompt_32_generate_test_progress_report.txt` | `/generate-test-progress-report` | `skills-test-progress-reporter` | **[Mới]** Báo cáo tiến độ **một kỳ** (ngày/tuần) — so thực tế với lịch plan, chỉ số trong kỳ, trở ngại, rủi ro mới, kế hoạch kỳ tới, đề xuất điều chỉnh. Bám ISTQB CTFL v4.0 mục 5.3.2. **Không** khuyến nghị go/no-go |
| 24 | `prompt_24_generate_test_summary_report.txt` | `/generate-test-summary-report` | `skills-test-summary-reporter` | **[Mới]** Báo cáo tổng hợp tại một mốc — gộp nhiều execution report + bug + RTM, đối chiếu tiêu chí exit, **khuyến nghị go/no-go có căn cứ** |

> 📌 Hai prompt này đi thành cặp: `25` công bố tiêu chí exit **trước** khi test, `24` chấm lại đúng bộ đó **sau** khi test. Dùng lệch bộ tiêu chí là lúc release sẽ cãi nhau về chuẩn.

### 📘 Tài liệu cho Người dùng cuối

| # | File | Command Tương Ứng | Skill Tích Hợp | Mô Tả & Cải Tiến Mới |
|---|------|-------------------|----------------|----------------------|
| 28 | `prompt_28_generate_user_guide.txt` | `/generate-user-guide` | `skills-user-guide-writer` | **[Mới]** Hướng dẫn sử dụng cho **người dùng cuối** — tổ chức theo **việc cần làm**, bám cấu trúc ISO/IEC/IEEE 26514 · 82079-1. 2 modes DOC/LIVE |

> 📌 Đây là loại tài liệu **duy nhất** trong repo viết cho người ngoài đọc. Nó **dùng lại** kết quả recon của `prompt_01` nhưng **không** chép nội dung sang: requirements nói *hệ thống phải làm gì*, hướng dẫn nói *người dùng làm thế nào*. Module **chưa recon** thì chạy `prompt_01` trước — skill từ chối viết hướng dẫn cho màn hình chưa từng nhìn thấy.

## Cách Sử Dụng Trong Claude Code

1. Chọn prompt phù hợp với nhu cầu.
2. Mở file `.txt` và thay thế các thông tin trong ngoặc vuông `[...]` bằng dữ liệu thực tế dự án của bạn.
3. Copy toàn bộ nội dung file → Paste vào ô chat của **Claude Code**.
4. Agent sẽ tự động nạp skill, nhận diện command và thực thi quy trình theo đúng chuẩn tiêu chuẩn cao.
