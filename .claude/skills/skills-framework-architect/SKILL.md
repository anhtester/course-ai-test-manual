---
name: skills-framework-architect
description: Skill thiết kế và scaffold automation framework hoàn chỉnh cho Playwright, Selenium, và Appium — bao gồm project structure, base classes, config management, reporting, và CI/CD integration.
---

# Framework Architect

## Description

Skill chuyên biệt giúp agent thiết kế, scaffold và triển khai automation framework từ đầu. Hỗ trợ đa nền tảng (Web, Mobile, API) với các framework phổ biến nhất.

Agent có thể:

- Thiết kế project structure theo best practices
- Sinh base classes, config management, driver/browser management
- Tích hợp reporting (Allure, HTML Report, Playwright Report)
- Cấu hình CI/CD pipeline (GitHub Actions, GitLab CI, Jenkins)
- Sinh template Page Object Model, fixtures, helpers
- Tạo file cấu hình (package.json, pom.xml, build.gradle, playwright.config.ts)

---

## When to Use

Sử dụng skill này khi:

- User yêu cầu tạo/thiết kế automation framework mới
- User cần scaffold project structure cho test automation
- User muốn chuẩn hóa framework hiện tại
- User cần tích hợp reporting hoặc CI/CD vào framework
- User hỏi về best practices cho framework design

Trigger keywords: "create framework", "design framework", "scaffold project", "thiết kế framework", "tạo project mới"

---

## Supported Stacks

### 🌐 Web Automation

| Stack | Ngôn ngữ | Runner | Report | Build Tool |
|---|---|---|---|---|
| **Playwright + TypeScript** | TypeScript | Playwright Test | HTML Report, Allure | npm |
| **Playwright + Java** | Java | TestNG / JUnit5 | Allure Report | Maven / Gradle |
| **Playwright + Python** | Python | Pytest | Allure, pytest-html | pip |
| **Selenium + Java** | Java | TestNG | Allure, ExtentReports | Maven / Gradle |
| **Selenium + Python** | Python | Pytest | Allure, pytest-html | pip |

### 📱 Mobile Automation

| Stack | Ngôn ngữ | Runner | Report | Build Tool |
|---|---|---|---|---|
| **Appium + Java** | Java | TestNG | Allure, ExtentReports | Maven / Gradle |
| **Appium + Python** | Python | Pytest | Allure, pytest-html | pip |

### 🔌 API Automation

| Stack | Ngôn ngữ | Runner | Report |
|---|---|---|---|
| **REST Assured** | Java | TestNG | Allure |
| **Playwright API** | TypeScript | Playwright Test | HTML Report |
| **Requests + Pytest** | Python | Pytest | Allure |

---

## Framework Components

Mỗi framework PHẢI bao gồm các thành phần sau (tùy chỉnh theo stack):

### 1. Project Structure (Mandatory)
- Cấu trúc thư mục rõ ràng, phân tách pages/tests/utils/config
- File README.md hướng dẫn setup + chạy test
- File .gitignore phù hợp

### 2. Configuration Management (Mandatory)
- Quản lý environment (dev/staging/prod) qua config file hoặc .env
- Centralized config — không hardcode giá trị trong test
- Sensitive data (credentials) qua environment variables, KHÔNG commit vào repo

### 3. Browser / Driver Management (Mandatory)
- **Playwright:** playwright.config.ts / conftest.py với browser setup
- **Selenium:** WebDriverManager hoặc Driver Factory pattern — **`ThreadLocal`, có `remove()` ở teardown**
- **Appium:** Desired Capabilities factory, Appium server config — **port riêng từng device**
- Driver **KHÔNG** được là static dùng chung — parallel luôn bật nên đây là điều kiện đúng/sai, không phải tối ưu

### 4. Base Classes (Mandatory)
- Base Page — chứa common methods (wait, click, type, screenshot)
- Base Test — chứa setup/teardown, test lifecycle hooks
- Không hardcode waits — chỉ dùng smart waits

### 5. Page Object Model (Mandatory)
- Mỗi page/screen → 1 Page class
- Locators khai báo ở đầu class, không inline trong test
- Methods mô tả hành vi người dùng (không phải thao tác DOM)

### 6. Test Data Management (Mandatory)
- Data factory / builder pattern cho test data
- Data external (JSON/YAML/CSV) cho data-driven tests
- Data unique + traceable (timestamp/random prefix)

### 7. Utilities (Mandatory)
- Wait helpers (smart waits, custom conditions)
- Screenshot utilities (capture cuối MỌI test — cả PASS lẫn FAIL)
- Logger (structured logging, không dùng print/console.log)
- Date/Time helpers, String generators

### 8. Reporting (Mandatory)
- Tích hợp ít nhất 1 reporting tool (Allure ưu tiên)
- **Metadata mỗi test:** tên Tiếng Việt · Description · Severity · Tags · label `testId`
- **Test Body có step** `Arrange:` / `Act:` / `Assert:` — Base Page dùng step API để sinh sub-step
- **Screenshot attach cuối MỌI test** — cả PASS lẫn FAIL, không chỉ khi fail
- **KHÔNG** attachment `stdout` / `stderr`
- **Allure CLI cài CỤC BỘ trong project** — devDependency `allure` (Node/Python) hoặc giải nén `allure-commandline:zip` vào `.allure/` bằng `maven-dependency-plugin` (Java). User clone về chạy `npm install`/`mvn` là mở được report; **CẤM** bắt cài Allure lên máy qua `scoop`/`brew`/`choco`/`PATH`
- Test execution summary (pass/fail/skip counts)

> Chi tiết bắt buộc: [`.claude/rules/reporting_rules.md`](../../rules/reporting_rules.md) · Code mẫu: [`references/CODE_TEMPLATES.md`](references/CODE_TEMPLATES.md) § 7 (§ 7.5 — cài Allure cục bộ)

### 9. Parallel Execution (Mandatory — LUÔN bật)
- **Mặc định 5 luồng**, khai đúng **một chỗ**: `WORKERS` (Playwright) · `-n 5` (pytest-xdist) · `thread-count="5"` (TestNG)
- Playwright thêm `fullyParallel: true` — song song cả trong cùng một file
- **Appium là ngoại lệ:** số luồng = **số device thật**, mỗi device có `systemPort`/`wdaLocalPort` riêng
- Điều kiện đi kèm: driver theo thread · không static mutable dùng chung · test data unique từng test · không phụ thuộc thứ tự chạy
- 🚨 Test đỏ khi bật parallel = **test sai**, sửa test chứ không hạ số luồng để giấu

### 10. CI/CD Pipeline (Mandatory — luôn sinh GitHub Actions)
- File `.github/workflows/<framework>.yml`: `push` · `pull_request` · `workflow_dispatch`
- Chạy **headless + parallel**, số luồng lấy từ `WORKERS` khai ở cấp workflow
- Sinh report bằng **CLI Allure trong project** — CI không cài Allure riêng
- Upload **1 artifact** trỏ `reports/` với `if: always()`; secrets từ GitHub Secrets; job có `timeout-minutes`

> Code mẫu: [`references/CODE_TEMPLATES.md`](references/CODE_TEMPLATES.md) § 8 (parallel) · § 6 (GitHub Actions)

---

## Project Structure Templates

> **📍 NGUỒN DUY NHẤT:** Toàn bộ cấu trúc thư mục cho **8 stacks** nằm ở [`references/PROJECT_STRUCTURE.md`](references/PROJECT_STRUCTURE.md).
> **KHÔNG** sao chép template vào file này — mọi thay đổi cấu trúc chỉ sửa ở một nơi để tránh drift.

| # | Stack | Mục trong `PROJECT_STRUCTURE.md` |
|---|---|---|
| 1 | Playwright + TypeScript | § 1 |
| 2 | Playwright + Java | § 2 |
| 3 | Playwright + Python | § 3 |
| 4 | Selenium + Java | § 4 |
| 5 | Selenium + Python | § 5 |
| 6 | Appium + Java | § 6 |
| 7 | Appium + Python | § 7 |
| 8 | REST Assured (Java) | § 8 |

**API testing bằng Playwright API** (TypeScript / Python) không có template riêng — dùng lại cấu trúc § 1 / § 3, thay thư mục `pages/` bằng `api/` (API client classes) và thêm `test-data/schemas/` cho JSON Schema validation.

---

## Browser Setup Rules (BẮT BUỘC)

Áp dụng cho mọi framework Web sinh ra từ skill này — kế thừa từ `CLAUDE.md > Browser Rules`.

> ⚠️ **Phân biệt hai loại viewport.** Bảng dưới là viewport của **suite chạy thật** (`playwright.config.ts`, CI) — giữ `1920×1080`. Viewport khi **debug bằng Playwright MCP** là chuyện khác: lấy từ `--viewport-size` lúc launch (mặc định `1600×750` vì cửa sổ headed không nở được sau launch), và **không** gọi `browser_resize`. Xem `.claude/rules/playwright_rules.md` mục 1.

| Quy tắc | Giá trị | Nơi cấu hình |
|---|---|---|
| **Viewport mặc định của suite** | `1920 x 1080` | `playwright.config.ts` · `BrowserOptions.java` · `DriverFactory.java` · `conftest.py` |
| **Headed mode** | Bật khi debug local | Đọc từ biến môi trường `HEADLESS=false` |
| **Headless mode** | Chỉ khi chạy CI | CI pipeline set `HEADLESS=true` |
| **Hard sleep** | ❌ CẤM tuyệt đối | Chỉ smart waits — xem bảng Anti-Patterns bên dưới |

Framework **phải** cho phép bật/tắt headless qua config, **không** hardcode trong code.

---

## Design Principles

1. **DRY (Don't Repeat Yourself)** — Mỗi logic chỉ viết 1 lần, tái sử dụng qua Base classes và Utils
2. **Single Responsibility** — Mỗi class/module làm 1 việc (Page chỉ chứa UI interaction, Test chỉ chứa test logic)
3. **Open/Closed** — Framework dễ mở rộng (thêm page, thêm test) mà không sửa core
4. **Configuration over Code** — Env, browser, timeout... quản lý qua config, không hardcode
5. **Fail Fast, Log Rich** — Screenshot cuối mọi test, structured logging, clear assertion messages

---

## Anti-Patterns (FORBIDDEN)

| ❌ Anti-Pattern | ✅ Đúng cách |
|---|---|
| Hardcode URL/credentials trong code | Đọc từ .env hoặc config file |
| Locator inline trong test | Khai báo trong Page class |
| `Thread.sleep()` / `waitForTimeout()` | Smart waits (`expect()`, `WebDriverWait`) |
| Global mutable state | Isolated fixtures/setup per test |
| Monolithic test file (1 file 500+ dòng) | Tách theo module/feature |
| `System.out.println()` / `console.log()` | Logger framework (Log4j, winston, logging) |

---

## Rules References

Agent PHẢI tuân thủ các rules chi tiết:

- `.claude/rules/automation_rules.md` — General automation best practices
- `.claude/rules/reporting_rules.md` — Allure report: metadata, step, screenshot, cấm stdout
- `.claude/rules/locator_strategy.md` — Locator selection priority
- `.claude/rules/playwright_rules.md` — Playwright-specific rules
- `.claude/rules/selenium_rules.md` — Selenium-specific rules
- `.claude/rules/appium_rules.md` — Appium mobile automation rules
- `CLAUDE.md` > "Browser Rules" — Bảng viewport headed/headless, quy tắc không resize khi dùng Playwright MCP
- `CLAUDE.md` > "Cleanup & Delivery" — Definition of Done trước khi bàn giao

---

## Related Files

| File | Vai trò |
|---|---|
| [`references/PROJECT_STRUCTURE.md`](references/PROJECT_STRUCTURE.md) | **Nguồn duy nhất** của project structure (8 stacks) |
| [`references/CODE_TEMPLATES.md`](references/CODE_TEMPLATES.md) | Code mẫu base classes / factory / config — copy & sửa, không viết lại từ đầu |
| `.claude/commands/generate-automation-framework.md` | Workflow 6 bước thực thi scaffold |
