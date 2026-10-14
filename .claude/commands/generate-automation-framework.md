---
description: Thiết kế và scaffold automation framework hoàn chỉnh. Hỗ trợ Playwright, Selenium, Appium — Web, Mobile, API.
skills:
  - skills-framework-architect
  - skills-qa-automation-engineer
---

# Workflow: Thiết Kế Automation Framework

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-framework-architect`** (tại `.claude/skills/skills-framework-architect/SKILL.md`) trước khi bắt đầu. Ngoài ra, tham khảo thêm skill **`skills-qa-automation-engineer`** để nắm các quy tắc automation chung.

Workflow này giúp agent thiết kế, scaffold và triển khai một automation framework hoàn chỉnh từ đầu, phù hợp với nhu cầu cụ thể của project.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **KHÔNG đoán** tech stack — phải hỏi user xác nhận trước khi scaffold
- **PHẢI tạo artifact `task.md`** để theo dõi tiến độ
- Mỗi file sinh ra phải **biên dịch/chạy được ngay** — không để placeholder `// TODO`
- Framework phải tuân thủ design principles trong skill `skills-framework-architect`

## Stacks hỗ trợ

| Platform | Stack | Ngôn ngữ | Runner | Report |
|---|---|---|---|---|
| 🌐 Web | Playwright | TypeScript | Playwright Test | HTML Report, Allure |
| 🌐 Web | Playwright | Java | TestNG / JUnit5 | Allure |
| 🌐 Web | Playwright | Python | Pytest | pytest-html, Allure |
| 🌐 Web | Selenium | Java | TestNG | Allure, ExtentReports |
| 🌐 Web | Selenium | Python | Pytest | pytest-html, Allure |
| 📱 Mobile | Appium | Java | TestNG | Allure, ExtentReports |
| 📱 Mobile | Appium | Python | Pytest | Allure |
| 🔌 API | REST Assured | Java | TestNG | Allure |
| 🔌 API | Playwright API | TypeScript | Playwright Test | HTML Report |

## Các bước thực hiện

### Bước 1: Thu thập yêu cầu (Requirements Gathering — ⏸️ CHECKPOINT)

1. **Hỏi user** các thông tin cần thiết:

   | Câu hỏi | Mục đích | Mặc định nếu không trả lời |
   |---|---|---|
   | Ứng dụng cần test là gì? (Web / Mobile / API / Hybrid) | Chọn platform | Web |
   | Framework nào? (Playwright / Selenium / Appium) | Chọn tool | Playwright |
   | Ngôn ngữ? (TypeScript / Java / Python) | Chọn language | TypeScript (Playwright), Java (Selenium/Appium) |
   | Project name? | Đặt tên thư mục | `automation-framework` |
   | Reporting tool? | Tích hợp report | Mặc định theo stack |
   | Có test API song song không? | Thêm API testing layer | Không |

   **KHÔNG hỏi 3 mục sau — luôn bật, không có tuỳ chọn tắt:**

   | Mục | Giá trị cố định | Vì sao không hỏi |
   |---|---|---|
   | **Parallel execution** | ✅ **LUÔN BẬT** — mặc định **5 luồng** | Suite viết theo kiểu chạy tuần tự thì về sau bật parallel là lộ hàng loạt test phụ thuộc nhau. Bật từ đầu ép test độc lập ngay từ dòng code đầu tiên |
   | **Số luồng chỉnh được ở 1 chỗ** | Biến `WORKERS` / `thread-count` / `-n`, khai **một nơi duy nhất** | Rải số luồng ở nhiều file là lúc cần hạ tải trên CI sẽ sửa sót |
   | **CI/CD GitHub Actions** | ✅ **LUÔN sinh** | Framework không chạy được trên CI thì chỉ là script chạy tay |

2. **Xác nhận lại** với user trước khi scaffold:
   ```
   📋 Tóm tắt framework sẽ tạo:
   - Platform: Web
   - Framework: Playwright
   - Language: TypeScript
   - Runner: Playwright Test
   - Report: HTML Report + Allure (CLI cài trong project)
   - Parallel: BẬT — 5 luồng (đổi bằng biến WORKERS)
   - CI/CD: GitHub Actions (luôn có)
   - Project name: my-automation

   Bạn xác nhận để tôi bắt đầu scaffold không?
   ```

3. **Chờ user xác nhận** trước khi sang Bước 2

   > User nói "chưa cần parallel" / "bỏ CI đi" → vẫn **sinh đủ**, nhưng để mức thấp nhất (`WORKERS=1`, workflow có `workflow_dispatch`). Gỡ hẳn thì sau này thêm lại tốn công gấp nhiều lần, còn hạ số luồng chỉ là sửa 1 biến.

### Bước 2: Scaffold Project Structure (Foundation)

1. **Tạo artifact `task.md`** để theo dõi checklist:
   ```markdown
   # Framework Setup Progress
   - [x] Bước 1: Thu thập yêu cầu
   - [ ] Bước 2: Scaffold project structure
   - [ ] Bước 3: Sinh base classes
   - [ ] Bước 4: Sinh example tests
   - [ ] Bước 5: Cấu hình reporting & CI/CD
   - [ ] Bước 6: Verify & Deliver
   ```

2. **Tạo thư mục project** theo template chuẩn:
   - **Nguồn duy nhất:** `.claude/skills/skills-framework-architect/references/PROJECT_STRUCTURE.md` — chọn đúng mục § tương ứng stack (8 stacks)
   - **Code mẫu base classes:** `.claude/skills/skills-framework-architect/references/CODE_TEMPLATES.md` — copy & sửa, KHÔNG viết lại từ đầu
   - Tạo toàn bộ thư mục + file cấu hình gốc

3. **Sinh file cấu hình build** (tuỳ stack):

   **Playwright + TypeScript:**
   - `package.json` — dependencies: `@playwright/test`, `allure-playwright`, **`allure`** (CLI cục bộ — xem Bước 5 mục 2)
   - `playwright.config.ts` — baseURL, viewport (1920x1080), timeout, retries, reporter, **`fullyParallel` + `workers`**
   - `allurerc.mjs` — `output` trỏ vào `reports/allure-report`
   - `tsconfig.json` — paths, strict mode
   - `.env.example` — template environment variables, **có `WORKERS=5`**

   **Selenium + Java:**
   - `pom.xml` — dependencies: selenium-java, testng, webdrivermanager, allure-testng, log4j · plugin: **`allure-maven`** (CLI cục bộ)
   - `testng.xml` — suite configuration, listeners, **`parallel="methods" thread-count="5"`**
   - `log4j2.xml` — logging configuration

   **Appium + Java:**
   - `pom.xml` — dependencies: appium-java-client, selenium-java, testng, allure · plugin: **`allure-maven`** (CLI cục bộ)
   - `testng.xml` — suite configuration, **`parallel="tests"` — mỗi `<test>` một device**
   - Capabilities config file (JSON/YAML) cho Android + iOS, **`systemPort` / `wdaLocalPort` riêng từng device**

   **Playwright + Python:**
   - `requirements.txt` — playwright, pytest, pytest-playwright, allure-pytest, **`pytest-xdist`**
   - `pyproject.toml` — pytest config, **`-n 5` trong `addopts`**
   - `conftest.py` — root fixtures, browser setup
   - `package.json` tối giản + `allurerc.mjs` — chỉ để chứa CLI `allure` cục bộ (PyPI **không** có gói nào ship Allure CLI)

4. **Cấu hình Parallel Execution (BẮT BUỘC — mặc định 5 luồng):**

   | Stack | Khai ở đâu | Giá trị mặc định | Đổi số luồng |
   |---|---|---|---|
   | Playwright TS | `playwright.config.ts` | `fullyParallel: true` · `workers: Number(process.env.WORKERS ?? 5)` | Sửa `WORKERS` trong `.env`, hoặc `WORKERS=2 npx playwright test` |
   | Pytest | `pyproject.toml` → `addopts` | `-n 5` (pytest-xdist) | `python -m pytest -n 2` — cờ dòng lệnh thắng `addopts` |
   | TestNG (Selenium / Playwright Java) | `testng.xml` | `parallel="methods" thread-count="5"` | Sửa `thread-count` — **một chỗ duy nhất** |
   | Appium | `testng.xml` | `parallel="tests"`, **thread-count = số device thật** | Thêm/bớt khối `<test>` theo số device |

   **⚠️ Appium là ngoại lệ:** không thể chạy 5 luồng trên 1 emulator. Số luồng = **số device/emulator đang chạy thật**. Mỗi device phải có `systemPort` (Android) / `wdaLocalPort` (iOS) **riêng**, trùng port là hai phiên giẫm chân nhau.

   **Điều kiện để parallel không sinh flaky** — sinh code phải đảm bảo ngay từ đầu:
   - Driver/browser instance **theo thread** — `ThreadLocal` (Java) / fixture theo worker (Python) / context riêng mỗi test (Playwright)
   - **KHÔNG** biến static mutable dùng chung giữa test
   - Test data **unique theo từng test** (timestamp + random), không dùng chung 1 tài khoản để sửa/xoá
   - Không phụ thuộc thứ tự chạy — mỗi test tự dựng tiền đề của nó

   Config đầy đủ từng stack: CODE_TEMPLATES.md **§ 8**.

5. **Tạo file .gitignore** — BẮT BUỘC có `reports/` (toàn bộ output test), kèm node_modules, target, __pycache__, .env
6. **Tạo README.md** với hướng dẫn:
   - Prerequisites (Node.js, Java, Python version)
   - Installation steps
   - Cách chạy test — kèm **cách đổi số luồng** (1 dòng, 1 chỗ)
   - Cách mở report (CLI trong project — xem Bước 5)
   - Project structure overview
   - Conventions (naming, coding standards)

### Bước 3: Sinh Core Classes (Base Layer)

1. **Configuration Management:**

   | Stack | File | Nội dung |
   |---|---|---|
   | Playwright TS | `src/utils/env.config.ts` | Đọc `.env`, export typed config object |
   | Selenium Java | `src/main/.../config/ConfigReader.java` | Đọc properties file, singleton pattern |
   | Appium Java | `src/main/.../config/AppConfig.java` | Đọc capabilities JSON, env variables |
   | Playwright Python | `src/utils/config.py` | Đọc `.env` bằng `python-dotenv` |

2. **Browser / Driver Management:**

   | Stack | File | Nội dung |
   |---|---|---|
   | Playwright TS | `playwright.config.ts` + fixtures | Browser config trong config, auth trong fixtures |
   | Selenium Java | `DriverFactory.java` | Factory pattern, **`ThreadLocal<WebDriver>` — bắt buộc vì parallel luôn bật** |
   | Appium Java | `AppiumDriverFactory.java` + `CapabilitiesManager.java` | Appium server URL, capabilities per device, **`ThreadLocal` + port riêng mỗi device** |
   | Playwright Python | `conftest.py` | Fixtures cho browser, context, page — mỗi worker xdist một browser riêng |

   🚨 **Parallel luôn bật → driver KHÔNG được là biến static dùng chung.** Java phải `ThreadLocal` và `remove()` trong teardown (rò rỉ ThreadLocal làm worker sau nhận driver đã đóng). Đây không phải tuỳ chọn tối ưu, là điều kiện để suite chạy đúng.

3. **Base Page / Screen class:**
   - Common methods: `navigate()`, `click()`, `type()`, `getText()`, `isVisible()`
   - Built-in smart waits (KHÔNG có hard sleep)
   - Method đánh dấu **step API** (`@Step` / `test.step` / `@allure.step`) → sinh sub-step trong report
   - Logging mỗi action

4. **Base Test class:**
   - Setup: khởi tạo browser/driver, navigate to baseURL
   - Teardown: attach screenshot trạng thái cuối cho **MỌI** test (PASS → `trang_thai_cuoi_cua_test`, FAIL → `trang_thai_khi_that_bai`), rồi đóng browser/driver
   - Test lifecycle hooks (beforeAll, afterAll, beforeEach, afterEach)

5. **Utilities:**
   - `TestDataGenerator` — sinh email, username, phone unique + traceable
   - `WaitHelper` — custom wait conditions (nếu cần ngoài built-in)
   - `ScreenshotUtil` — capture + attach to report
   - `Logger` — structured logging (Log4j / winston / Python logging)

### Bước 4: Sinh Example Tests (Validation Layer)

1. **Tạo ít nhất 1 example Page Object:**
   - `LoginPage` (hoặc `LoginScreen` cho mobile) với locators + methods thực tế

   **Nếu user đã cung cấp URL hệ thống** (khuyến nghị — cho locator dùng được ngay):
   - Mở browser qua Playwright MCP: `navigate` → `wait_for(page_load)` → `snapshot`
   - Lấy locator **từ DOM thực tế**, ưu tiên theo `.claude/rules/locator_strategy.md`
   - Locator sinh ra là locator thật, không cần comment REPLACE

   **Nếu chưa có URL** (framework scaffold thuần):
   - Dùng placeholder + comment cảnh báo bắt buộc:
     ```typescript
     // ⚠️ PLACEHOLDER — chưa inspect DOM. Chạy /generate-locator hoặc mở
     // Playwright MCP inspect trang thật rồi thay thế trước khi chạy test.
     readonly usernameInput = this.page.getByLabel('Username');
     readonly passwordInput = this.page.getByLabel('Password');
     readonly loginButton = this.page.getByRole('button', { name: 'Login' });
     ```
   - **Ghi rõ trong README.md** mục "Việc cần làm trước khi chạy test": danh sách file chứa locator placeholder

2. **Tạo ít nhất 1 example Test:**
   - `LoginTest` — demo happy path (login thành công)
   - Có đầy đủ: Arrange → Act → Assert
   - Assertion có message rõ ràng
   - Test data dùng TestDataGenerator (nếu applicable)

3. **Tạo 1 example data-driven test** (nếu phù hợp):
   - Đọc data từ file JSON/YAML/CSV
   - Parameterized test với nhiều bộ data

### Bước 5: Cấu hình Reporting & CI/CD (Integration Layer)

1. **Reporting setup:**

   | Stack | Report | Cấu hình |
   |---|---|---|
   | Playwright TS | HTML + Allure | `reporter` trong playwright.config.ts |
   | Selenium Java | Allure | `allure-testng` dependency + `@Step`, `@Attachment` annotations |
   | Appium Java | Allure + ExtentReports | `allure-testng` + `ExtentManager` singleton |
   | Playwright Python | pytest-html + Allure | `conftest.py` hooks + pytest addopts |

   **Chuẩn report BẮT BUỘC** — tuân thủ `.claude/rules/reporting_rules.md`:

   - **Metadata:** framework phải hỗ trợ khai báo tên test Tiếng Việt, Description, Severity, Tags, label `testId`
   - **Step API:** Base Page/Screen đánh dấu step (`@Step` / `test.step` / `@allure.step`) → sub-step tự sinh trong Test Body
   - **Screenshot:** teardown attach ảnh trạng thái cuối cho **MỌI** test — `trang_thai_cuoi_cua_test` (PASS) / `trang_thai_khi_that_bai` (FAIL). KHÔNG chỉ chụp khi fail
   - **Tắt stdout:** pytest thêm `--allure-no-capture` vào `addopts`; Playwright TS để `screenshot: 'off'` (attach thủ công ở `afterEach`, tránh đính 2 lần)
   - Example test sinh ở Bước 4 phải **demo đủ** các mục trên để làm mẫu cho test sau

   **Thư mục output — gom hết vào `reports/`:**

   ```text
   reports/
   ├── allure-results/         # raw results
   ├── allure-report/          # HTML report
   ├── allure-report-single/   # report gộp 1 file
   ├── html/                   # HTML report của runner
   ├── logs/                   # log thực thi
   └── screenshots/            # ảnh chụp lưu đĩa
   ```

   - Trỏ **mọi** đường dẫn output vào `reports/` — CẤM để `allure-results/` / `test-results/` / `playwright-report/` nằm ở root
   - `.gitignore` phải chặn `reports/`

   Code mẫu + config từng stack: `.claude/skills/skills-framework-architect/references/CODE_TEMPLATES.md` § 7 (§ 7.4 cho thư mục output).

2. **Cài Allure CỤC BỘ trong project (BẮT BUỘC):**

   > **Mục tiêu:** người dùng clone project về, chạy `npm install` (hoặc `mvn`) là **mở được report ngay** — không phải cài gì lên Windows/macOS.
   >
   > 🚫 **CẤM** hướng dẫn user cài Allure vào máy: `scoop install allure` · `brew install allure` · `choco install allure` · tải zip rồi thêm vào `PATH`. Cài vào máy là đổi máy/đổi người là hỏng, và CI phải cài lại lần nữa.

   | Stack | Cài gì **vào project** | Máy cần sẵn | Lệnh mở report |
   |---|---|---|---|
   | **Node** (Playwright TS/JS) | devDependency `allure` (Allure 3) | Node.js — đã cần để chạy test | `npm run report` |
   | **Java + Maven** (Selenium / Appium / Playwright Java) | **giải nén hẳn bộ Allure 2 vào `.allure/`** bằng `maven-dependency-plugin` + `allure-maven` trỏ về đó | JDK — đã cần để chạy test | `mvn allure:serve` hoặc gọi thẳng `.allure/allure-<ver>/bin/allure` |
   | **Python + Pytest** | `package.json` tối giản + devDependency `allure` | Node.js | `npm run report` |

   **Vì sao dùng `allure` (Allure 3) cho Node/Python chứ không phải `allure-commandline`:** gói đó chỉ là lớp bọc npm của CLI Allure 2 viết bằng Java — máy **vẫn phải có JRE**, tức chưa giải quyết được vấn đề. Allure 3 viết bằng TypeScript, chạy thuần Node, **không cần Java**, và vẫn đọc được thư mục `allure-results` do `allure-playwright` / `allure-pytest` / `allure-testng` sinh ra.

   **Riêng Java + Maven — KHÔNG dựa vào cơ chế tự tải của `allure-maven`.** Mặc định plugin tải CLI từ Internet lúc chạy goal; máy không mạng / sau proxy công ty là hỏng. Thay vào đó **giải nén hẳn artifact `io.qameta.allure:allure-commandline:<ver>:zip` từ Maven Central vào `.allure/`** bằng `maven-dependency-plugin` (phase `validate`), rồi trỏ `installDirectory` của `allure-maven` về đúng thư mục đó — plugin kiểm tra thấy CLI có sẵn thì **không tải nữa**. Kết quả: bộ Allure 2 nằm **trong folder project**, chạy được cả khi gọi trực tiếp không qua Maven.

   ⚠️ **Ràng buộc phải nói thẳng với user:** project Java **không chạy test được nếu máy không có JDK** — Maven và CLI Allure 2 đều là app Java. Không gói JDK vào project (mỗi OS một bản, ~180 MB). Với máy không có JDK, chỉ có 2 đường **xem** report: máy có Node → `npx allure generate reports/allure-results` (Allure 3 đọc được results của Java); máy không có gì → gửi **single-file HTML**. Ghi cả 2 đường này vào README.

   ⚠️ **Khác biệt giao diện:** Allure 3 render giao diện **Awesome**, không phải Allure 2 cổ điển. Team bắt buộc giao diện cũ trên project Node → dùng `allure-commandline` và **ghi rõ README cần JRE 8+**. Đây là đánh đổi, phải nói ra chứ không tự quyết im lặng.

   **Việc phải làm:**
   - Thêm dependency/plugin + script `report` vào `package.json` / `pom.xml` — config đầy đủ chạy được ở CODE_TEMPLATES.md **§ 7.5**
   - Node/Python: tạo `allurerc.mjs` trỏ `output` vào `reports/allure-report`
   - Java: khai `<allure.cli.version>` **một chỗ**, dùng chung cho cả `maven-dependency-plugin` và `allure-maven` — lệch version là nó tải lại từ Internet
   - Thêm **Maven Wrapper** (`mvn -N wrapper:wrapper`) để người khác khỏi cài Maven
   - Viết mục **"Mở report"** trong `README.md` — vài dòng lệnh, **không** có bước cài đặt nào lên máy, kèm đường cho người chỉ xem
   - `.gitignore` thêm `.allure/` (hoặc commit hẳn nếu cần chạy offline tuyệt đối)
   - CI dùng **cùng** lệnh đó, không cài Allure riêng trong pipeline

3. **CI/CD Pipeline — GitHub Actions (BẮT BUỘC, luôn sinh):**

   Sinh file `.github/workflows/<framework>.yml`. Template đầy đủ theo stack: CODE_TEMPLATES.md **§ 6**.

   | Thành phần | Yêu cầu |
   |---|---|
   | **Trigger** | `push` nhánh chính · `pull_request` · `workflow_dispatch` (chạy tay) · `schedule` nếu user muốn regression đêm |
   | **Cài dependency** | `npm ci` / `mvn -B` / `pip install -r requirements.txt` — có cache |
   | **Chạy test** | **Headless** + **parallel bật sẵn**, số luồng lấy từ biến `WORKERS` (mặc định 5) |
   | **Sinh report** | Dùng **CLI Allure trong project** (mục 2) — CI **không** cài Allure riêng |
   | **Artifact** | Upload **1 artifact duy nhất** trỏ vào `reports/`, `if: always()` để fail vẫn có report |
   | **Secrets** | `BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD` lấy từ GitHub Secrets — **không** hardcode |
   | **Timeout** | Đặt `timeout-minutes` cho job, tránh treo hết quota |

   ⚠️ **Runner GitHub-hosted mặc định chỉ 2 vCPU.** 5 luồng trên runner đó dễ làm test chậm và chập chờn hơn là nhanh hơn. Đặt `WORKERS` ở cấp workflow (`env:`) để hạ riêng cho CI mà **không** đụng cấu hình local — đúng một dòng:

   ```yaml
   env:
     WORKERS: 5      # hạ xuống 2–3 nếu runner 2 vCPU chạy chập chờn
   ```

4. **Docker support** (optional — chỉ nếu user yêu cầu):
   - Dockerfile cho test execution environment
   - docker-compose.yml nếu cần Selenium Grid / Appium server

### Bước 6: Verify & Deliver (Quality Gate)

1. **Kiểm tra framework build được:**
   ```bash
   # Playwright TS
   npm install && npx playwright install && npx playwright test --list

   # Selenium Java
   mvn clean compile

   # Appium Java
   mvn clean compile

   # Playwright Python
   pip install -r requirements.txt && playwright install
   ```

2. **Chạy example test** để verify framework hoạt động:
   - Nếu PASS → framework sẵn sàng
   - Nếu FAIL do thiếu app/URL → acceptable (ghi note trong README)
   - Nếu FAIL do lỗi code framework → sửa ngay

3. **Verify Allure cục bộ mở được report** — chạy thật, không chỉ khai trong README:

   ```bash
   # Node / Python
   npx allure --version          # phải in ra version, KHÔNG được "command not found"
   npx allure generate reports/allure-results
   npx allure open reports/allure-report

   # Java + Maven
   mvn validate                                    # phải sinh ra .allure/allure-<ver>/
   .allure\allure-2.45.0\bin\allure.bat --version  # gọi thẳng CLI trong project
   mvn allure:report                               # KHÔNG được in "Downloading allure commandline"
   ```

   - Lệnh chạy được **mà máy chưa từng cài Allure** → đạt
   - Báo `allure: command not found` / `is not recognized` → dependency chưa vào `package.json` hoặc plugin chưa vào `pom.xml`, **sửa ngay**
   - Java mà log hiện `Downloading allure commandline` → CLI **chưa** thực sự nằm trong project (version lệch hoặc `installDirectory` sai), **sửa ngay**
   - Chưa có `reports/allure-results` (chưa chạy test lần nào) → chạy example test trước rồi mới sinh report

4. **Verify Parallel thật sự chạy song song** — không chỉ khai trong config:

   ```bash
   npx playwright test --list          # Playwright: dòng đầu in ra số worker
   python -m pytest -n 5 --collect-only
   mvn test                            # TestNG: log in ra tên thread khác nhau
   ```

   - Nhìn log thấy **nhiều thread/worker khác nhau** cùng chạy → đạt
   - Chỉ thấy 1 thread → config parallel chưa ăn, **sửa ngay**
   - Example test **PASS khi chạy song song 2 lần liên tiếp** — parallel làm lộ test phụ thuộc nhau, phát hiện ở đây rẻ hơn nhiều so với phát hiện lúc suite đã 200 test

5. **Verify workflow CI hợp lệ:**
   - File `.github/workflows/*.yml` tồn tại, YAML parse được
   - Job có `timeout-minutes`, bước upload artifact có `if: always()`
   - Không có credential hardcode trong workflow

6. **Review checklist** trước khi bàn giao:
   - [ ] Project structure đúng template
   - [ ] Tất cả dependencies đã khai báo
   - [ ] Config management hoạt động (đọc .env)
   - [ ] Base Page/Test có đầy đủ common methods
   - [ ] POM pattern được tuân thủ
   - [ ] Smart waits — không có hard sleep
   - [ ] **Parallel BẬT sẵn, mặc định 5 luồng** — log chạy thấy nhiều worker/thread khác nhau
   - [ ] Số luồng chỉnh được ở **đúng 1 chỗ** (`WORKERS` / `thread-count` / `-n`), có ghi trong README
   - [ ] Driver/browser **theo thread** (`ThreadLocal` với Java), không có static mutable dùng chung
   - [ ] Example test PASS khi chạy **song song 2 lần liên tiếp**
   - [ ] **`.github/workflows/` có workflow chạy được** — headless, parallel, upload `reports/` với `if: always()`, secrets không hardcode
   - [ ] Example test chạy được (hoặc chạy được khi có app)
   - [ ] README.md hướng dẫn đầy đủ
   - [ ] .gitignore bao phủ đúng
   - [ ] Reporting tích hợp — mở report kiểm: tên test Tiếng Việt, Description, Severity, Tags, TC ID
   - [ ] Test Body có step `Arrange:` / `Act:` / `Assert:`, không phẳng
   - [ ] Có ảnh cuối test cho **cả** PASS lẫn FAIL; **không** có attachment `stdout`
   - [ ] Toàn bộ output nằm trong `reports/` — root project sạch, không có `allure-results/` / `test-results/` / `playwright-report/` lạc ra ngoài
   - [ ] `.gitignore` đã chặn `reports/`
   - [ ] **Allure cài cục bộ** — mở được report bằng `npm run report` / `mvn allure:serve` trên máy **chưa từng cài Allure**
   - [ ] Java: `mvn validate` sinh ra `.allure/allure-<ver>/bin/`, và `mvn allure:report` **không** in `Downloading allure commandline`
   - [ ] README có mục **"Mở report"**, và **không** hướng dẫn cài Allure lên máy (`scoop` / `brew` / `choco` / thêm `PATH`)
   - [ ] README ghi rõ đường xem report cho **máy không có JDK** (chỉ có Node → `npx allure`; không có gì → single-file HTML)
   - [ ] Không có debug log, commented code, `// TODO` bỏ ngỏ
   - [ ] Locator placeholder (nếu có) đã đánh dấu `⚠️ PLACEHOLDER` **và** liệt kê trong README

7. **Cập nhật `task.md`** với trạng thái hoàn thành

## Xử lý tình huống đặc biệt

| Tình huống | Cách xử lý |
|---|---|
| **Chỉ có 1 device/emulator (Appium)** | Số luồng = 1. **KHÔNG** đặt 5 — 5 thread trên 1 device là chắc chắn hỏng. Giữ nguyên cấu trúc parallel để thêm device sau là chạy được ngay |
| **App không chịu nổi 5 phiên đăng nhập cùng lúc** | Hạ `WORKERS` xuống và **ghi lý do vào README** — đây là giới hạn của app, không phải của framework. Đừng âm thầm tắt parallel |
| **Test dùng chung 1 tài khoản, chạy song song là đá nhau** | Sửa **test data** (mỗi luồng một tài khoản/bản ghi riêng), KHÔNG tắt parallel để né |
| **User muốn hybrid (Web + Mobile)** | Tạo shared layer (utils, config) + tách pages vs screens |
| **User muốn hybrid (Web + API)** | Thêm API layer song song (api helpers + api tests folder) |
| **User có framework cũ cần refactor** | Đọc code hiện tại → đề xuất migration plan → refactor từng phần |
| **User muốn multi-browser** | Config parallel projects trong playwright.config.ts hoặc test suite XML |
| **User muốn multi-device (Appium)** | CapabilitiesManager hỗ trợ load từ JSON per device (Android/iOS) |
| **User không biết chọn stack** | Gợi ý dựa trên: team skill, project type, CI infra |

## Output

- **Project structure** đầy đủ (tất cả thư mục + files)
- **Build config** (package.json / pom.xml / requirements.txt)
- **Framework config** (playwright.config.ts / testng.xml / conftest.py) — **parallel bật sẵn 5 luồng**
- **Base classes** (BasePage, BaseTest, DriverFactory thread-safe, ConfigReader)
- **Utilities** (TestDataGenerator, WaitHelper, ScreenshotUtil, Logger)
- **Example Page Object + Test** (LoginPage + LoginTest) — đã verify chạy song song
- **Reporting integration** (Allure CLI cài trong project — máy không cần cài gì)
- **CI/CD pipeline** (GitHub Actions — **luôn có**, headless + parallel + upload `reports/`)
- **README.md** (setup guide + project overview)
- **Artifact `task.md`** (checklist tiến độ)