# Master Framework for E2E Automation (Generalized)

> **📍 NGUỒN DUY NHẤT** của project structure. Mọi thay đổi cấu trúc thư mục chỉ sửa ở file này — không sao chép sang nơi khác.

**Skill:** `skills-framework-architect`
**Workflow dùng file này:** `/generate-automation-framework` · `/generate-automation-web` · `/generate-automation-mobile` · `/generate-automation-api` (và bộ định tuyến `/generate-automation-from-testcases`)

---

## Mục tiêu

Xây dựng hệ thống Automation có khả năng mở rộng, dễ bảo trì và báo cáo chuyên nghiệp. Thay vì "viết test đơn lẻ", chúng ta xây dựng **Framework gốc** vững chãi từ đầu.

## Cách sử dụng

Agent xác định cấu trúc thư mục **trước khi sinh file mã nguồn đầu tiên**.
- **Project mới:** dùng template bên dưới để scaffold.
- **Project có sẵn:** đọc cấu trúc hiện tại của repo và tuân theo, KHÔNG áp template đè lên.

Code mẫu cho các file trong cấu trúc (BasePage, DriverFactory, ConfigReader, CI workflow…) nằm ở [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md) cùng thư mục.

---

## Supported Stacks

### 🌐 Web Automation

| Stack | Ngôn ngữ | Runner | Report | Build Tool |
|---|---|---|---|---|
| **Playwright + TypeScript** | TypeScript | Playwright Test | HTML Report, Allure | npm |
| **Playwright + Java** | Java | TestNG / JUnit5 | Allure | Maven / Gradle |
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

## Kiến Trúc Chuẩn

### 1. Playwright + TypeScript

```text
project-root/
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies + npm scripts
├── .env.example                  # Environment template (KHÔNG chứa credentials thật)
├── .gitignore
├── README.md
├── src/
│   ├── pages/                    # Page Object classes
│   │   ├── base.page.ts          # Base page — common methods (wait, click, type, screenshot)
│   │   ├── login.page.ts
│   │   └── dashboard.page.ts
│   ├── fixtures/                 # Custom fixtures
│   │   ├── auth.fixture.ts       # Authentication fixture
│   │   └── base.fixture.ts       # Extended test with all fixtures
│   ├── utils/                    # Helpers & utilities
│   │   ├── test-data.ts          # Data generators (unique + traceable)
│   │   ├── env.config.ts         # Environment config reader
│   │   └── helpers.ts            # Common helper functions
│   └── tests/                    # Test specs (grouped by feature)
│       ├── auth/
│       │   └── login.spec.ts
│       └── dashboard/
│           └── dashboard.spec.ts
├── reports/                      # TOÀN BỘ output report (git-ignored) — xem mục "Thư Mục Output"
│   ├── allure-results/           # raw results
│   ├── allure-report/            # HTML report
│   ├── allure-report-single/     # report gộp 1 file
│   ├── html/                     # HTML report của runner
│   ├── logs/                     # log thực thi
│   └── screenshots/              # ảnh chụp lưu đĩa
├── test-data/                    # External test data (JSON/YAML)
│   └── users.json
└── .github/
    └── workflows/
        └── playwright.yml        # CI pipeline template
```

### 2. Playwright + Java (Maven + TestNG)

```text
project-root/
├── pom.xml                       # Maven config — playwright-java, testng, allure-testng
├── testng.xml                    # TestNG suite config
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── main/java/
│   │   └── com/project/
│   │       ├── pages/            # Page Object classes
│   │       │   ├── BasePage.java         # Base page — nhận Page, common methods
│   │       │   ├── LoginPage.java
│   │       │   └── DashboardPage.java
│   │       ├── factory/          # Playwright lifecycle management
│   │       │   ├── PlaywrightFactory.java   # ThreadLocal<Playwright/Browser/Page>
│   │       │   └── BrowserOptions.java      # Headed/headless, viewport 1920x1080
│   │       ├── config/
│   │       │   └── ConfigReader.java
│   │       └── utils/
│   │           ├── ScreenshotUtil.java
│   │           └── TestDataGenerator.java
│   └── test/java/
│       └── com/project/
│           ├── base/
│           │   └── BaseTest.java         # @BeforeMethod tạo Page, @AfterMethod đóng
│           └── tests/
│               ├── LoginTest.java
│               └── DashboardTest.java
├── reports/                      # TOÀN BỘ output report (git-ignored) — xem mục "Thư Mục Output"
│   ├── allure-results/           # raw results
│   ├── allure-report/            # HTML report
│   ├── allure-report-single/     # report gộp 1 file
│   ├── html/                     # HTML report của runner
│   ├── logs/                     # log thực thi
│   └── screenshots/              # ảnh chụp lưu đĩa
├── test-data/
│   └── users.json
└── .github/
    └── workflows/
        └── playwright-java.yml
```

> ⚠️ Playwright Java **không** dùng `playwright.config.ts`. Toàn bộ cấu hình browser (headless, viewport, timeout, trace) nằm trong `PlaywrightFactory` + `BrowserOptions`, đọc giá trị từ `ConfigReader`.
> Playwright object **không thread-safe** — bắt buộc dùng `ThreadLocal` nếu chạy parallel qua TestNG.

### 3. Playwright + Python (Pytest)

```text
project-root/
├── pyproject.toml                # Python project config
├── requirements.txt              # Dependencies
├── conftest.py                   # Root fixtures + browser setup
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── pages/
│   │   ├── base_page.py          # Base page — common methods
│   │   ├── login_page.py
│   │   └── dashboard_page.py
│   ├── utils/
│   │   ├── config.py             # Env config reader
│   │   ├── test_data.py          # Data generators
│   │   └── helpers.py
│   └── tests/
│       ├── conftest.py           # Test-level fixtures
│       ├── test_login.py
│       └── test_dashboard.py
├── reports/                      # TOÀN BỘ output report (git-ignored) — xem mục "Thư Mục Output"
│   ├── allure-results/           # raw results
│   ├── allure-report/            # HTML report
│   ├── allure-report-single/     # report gộp 1 file
│   ├── html/                     # HTML report của runner
│   ├── logs/                     # log thực thi
│   └── screenshots/              # ảnh chụp lưu đĩa
├── test-data/
│   └── users.json
└── .github/
    └── workflows/
        └── playwright.yml
```

### 4. Selenium + Java (Maven + TestNG)

```text
project-root/
├── pom.xml                       # Maven config + dependencies
├── testng.xml                    # TestNG suite config
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── main/java/
│   │   └── com/project/
│   │       ├── pages/            # Page Object classes
│   │       │   ├── BasePage.java         # Base page — common methods
│   │       │   ├── LoginPage.java
│   │       │   └── DashboardPage.java
│   │       ├── drivers/          # Driver management
│   │       │   └── DriverFactory.java
│   │       ├── config/           # Configuration
│   │       │   └── ConfigReader.java
│   │       └── utils/            # Utilities
│   │           ├── WaitHelper.java
│   │           ├── ScreenshotUtil.java
│   │           └── TestDataGenerator.java
│   └── test/java/
│       └── com/project/
│           ├── base/
│           │   └── BaseTest.java         # Test lifecycle hooks
│           └── tests/
│               ├── LoginTest.java
│               └── DashboardTest.java
├── reports/                      # TOÀN BỘ output report (git-ignored) — xem mục "Thư Mục Output"
│   ├── allure-results/           # raw results
│   ├── allure-report/            # HTML report
│   ├── allure-report-single/     # report gộp 1 file
│   ├── html/                     # HTML report của runner
│   ├── logs/                     # log thực thi
│   └── screenshots/              # ảnh chụp lưu đĩa
├── test-data/
│   └── users.json
└── .github/
    └── workflows/
        └── selenium.yml
```

### 5. Selenium + Python (Pytest)

```text
project-root/
├── pyproject.toml
├── requirements.txt
├── conftest.py                   # Root fixtures + driver setup
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── pages/
│   │   ├── base_page.py
│   │   ├── login_page.py
│   │   └── dashboard_page.py
│   ├── drivers/
│   │   └── driver_factory.py     # WebDriver factory
│   ├── utils/
│   │   ├── config.py
│   │   ├── test_data.py
│   │   ├── wait_helper.py
│   │   └── screenshot_util.py
│   └── tests/
│       ├── conftest.py
│       ├── test_login.py
│       └── test_dashboard.py
├── reports/                      # TOÀN BỘ output report (git-ignored) — xem mục "Thư Mục Output"
│   ├── allure-results/           # raw results
│   ├── allure-report/            # HTML report
│   ├── allure-report-single/     # report gộp 1 file
│   ├── html/                     # HTML report của runner
│   ├── logs/                     # log thực thi
│   └── screenshots/              # ảnh chụp lưu đĩa
├── test-data/
│   └── users.json
└── .github/
    └── workflows/
        └── selenium.yml
```

### 6. Appium + Java (Maven + TestNG)

```text
project-root/
├── pom.xml
├── testng.xml                    # parallel="tests" — MỖI <test> LÀ MỘT DEVICE
├── .env.example
├── .gitignore
├── README.md
├── capabilities/
│   └── devices.json              # caps từng device: udid, systemPort/wdaLocalPort riêng
│                                 # tách khối riêng cho native vs Flutter — xem CODE_TEMPLATES § 9.1
├── src/
│   ├── main/java/
│   │   └── com/project/
│   │       ├── screens/          # Screen Objects (tương đương Page Objects)
│   │       │   ├── BaseScreen.java       # Base screen — common mobile methods + byPlatform()
│   │       │   ├── LoginScreen.java
│   │       │   └── HomeScreen.java
│   │       ├── drivers/          # Appium driver management
│   │       │   ├── AppiumDriverFactory.java   # ThreadLocal — parallel luôn bật
│   │       │   └── CapabilitiesManager.java
│   │       ├── config/
│   │       │   └── AppConfig.java
│   │       └── utils/
│   │           ├── MobileGestures.java   # Swipe, scroll, tap helpers
│   │           ├── ScreenshotUtil.java
│   │           └── TestDataGenerator.java
│   └── test/java/
│       └── com/project/
│           ├── base/
│           │   └── BaseTest.java
│           └── tests/
│               ├── LoginTest.java
│               └── HomeTest.java
├── apps/                         # APK/IPA files
│   └── .gitkeep
├── reports/                      # TOÀN BỘ output report (git-ignored) — xem mục "Thư Mục Output"
│   ├── allure-results/           # raw results
│   ├── allure-report/            # HTML report
│   ├── allure-report-single/     # report gộp 1 file
│   ├── html/                     # HTML report của runner
│   ├── logs/                     # log thực thi
│   └── screenshots/              # ảnh chụp lưu đĩa
├── test-data/
│   └── users.json
└── .github/
    └── workflows/
        └── appium.yml
```

### 7. Appium + Python (Pytest)

```text
project-root/
├── pyproject.toml
├── requirements.txt
├── conftest.py                   # Root fixtures + Appium driver setup
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── screens/
│   │   ├── base_screen.py
│   │   ├── login_screen.py
│   │   └── home_screen.py
│   ├── drivers/
│   │   ├── appium_driver_factory.py
│   │   └── capabilities_manager.py
│   ├── utils/
│   │   ├── config.py
│   │   ├── test_data.py
│   │   ├── mobile_gestures.py
│   │   └── screenshot_util.py
│   └── tests/
│       ├── conftest.py
│       ├── test_login.py
│       └── test_home.py
├── apps/
│   └── .gitkeep
├── reports/                      # TOÀN BỘ output report (git-ignored) — xem mục "Thư Mục Output"
│   ├── allure-results/           # raw results
│   ├── allure-report/            # HTML report
│   ├── allure-report-single/     # report gộp 1 file
│   ├── html/                     # HTML report của runner
│   ├── logs/                     # log thực thi
│   └── screenshots/              # ảnh chụp lưu đĩa
├── test-data/
│   └── users.json
└── .github/
    └── workflows/
        └── appium.yml
```

### 8. REST Assured (Java + TestNG)

```text
project-root/
├── pom.xml
├── testng.xml
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── main/java/
│   │   └── com/project/
│   │       ├── api/              # API client classes
│   │       │   ├── BaseApi.java          # Base API — common request methods
│   │       │   ├── AuthApi.java
│   │       │   └── UserApi.java
│   │       ├── models/           # POJO / DTO classes
│   │       │   ├── UserRequest.java
│   │       │   └── UserResponse.java
│   │       ├── config/
│   │       │   └── ApiConfig.java
│   │       └── utils/
│   │           ├── TestDataGenerator.java
│   │           └── JsonHelper.java
│   └── test/java/
│       └── com/project/
│           ├── base/
│           │   └── BaseApiTest.java
│           └── tests/
│               ├── AuthApiTest.java
│               └── UserApiTest.java
├── reports/                      # TOÀN BỘ output report (git-ignored) — xem mục "Thư Mục Output"
│   ├── allure-results/           # raw results
│   ├── allure-report/            # HTML report
│   ├── allure-report-single/     # report gộp 1 file
│   ├── html/                     # HTML report của runner
│   ├── logs/                     # log thực thi
│   └── screenshots/              # ảnh chụp lưu đĩa
├── test-data/
│   ├── payloads/                 # Request body templates (JSON)
│   │   └── create_user.json
│   └── schemas/                  # JSON Schema validation
│       └── user_response_schema.json
└── .github/
    └── workflows/
        └── api-tests.yml
```

---

## Thư Mục Output — `reports/`

Mọi sản phẩm sinh ra khi chạy test gom vào **một** thư mục `reports/` ở gốc project. Cấu trúc này giống nhau cho **cả 8 stacks**:

```text
reports/
├── allure-results/           # Raw results (JSON) — input cho allure generate
├── allure-report/            # HTML report nhiều file
├── allure-report-single/     # Report gộp 1 file — tiện gửi qua chat/email
├── html/                     # HTML report của runner (pytest-html / Playwright HTML)
├── logs/                     # Log file thực thi
└── screenshots/              # Ảnh chụp lưu ra đĩa
```

- **`.gitignore` phải có `reports/`** — không commit output test
- **KHÔNG** để thư mục mặc định của tool nằm ở root (`allure-results/`, `test-results/`, `playwright-report/`, `target/surefire-reports/`) — trỏ lại vào `reports/`
- CI upload **1 artifact duy nhất** là `reports/`

Cấu hình cụ thể từng stack: [`.claude/rules/reporting_rules.md`](../../../rules/reporting_rules.md) mục 6.

---

## Component Checklist (Bắt Buộc)

Mỗi framework PHẢI bao gồm các thành phần sau:

| # | Component | Bắt buộc | Mô tả |
|---|-----------|----------|--------|
| 1 | **Project Structure** | ✅ | Thư mục rõ ràng, phân tách pages/tests/utils/config |
| 2 | **Config Management** | ✅ | Environment qua `.env` + config file — KHÔNG hardcode |
| 3 | **Browser / Driver Management** | ✅ | Factory pattern cho browser/driver setup |
| 4 | **Base Classes** | ✅ | BasePage/BaseScreen chứa common methods |
| 5 | **Page Object Model** | ✅ | Mỗi page → 1 class, locators khai báo ở đầu class |
| 6 | **Test Data Management** | ✅ | Data factory + external data (JSON/YAML) + unique/traceable |
| 7 | **Utilities** | ✅ | Wait helpers, screenshot utils, logger, string generators |
| 8 | **Reporting** | ✅ | Allure + metadata/step Tiếng Việt + screenshot cuối MỌI test — xem `.claude/rules/reporting_rules.md` |
| 9 | **CI/CD Pipeline** | 🟡 Khuyến khích | GitHub Actions / GitLab CI / Jenkins template |

---

## Design Principles

1. **DRY** — Mỗi logic chỉ viết 1 lần, tái sử dụng qua Base classes và Utils
2. **Single Responsibility** — Page chỉ chứa UI interaction, Test chỉ chứa test logic
3. **Open/Closed** — Dễ mở rộng (thêm page, thêm test) mà không sửa core
4. **Configuration over Code** — Env, browser, timeout quản lý qua config, không hardcode
5. **Fail Fast, Log Rich** — Screenshot cuối mọi test, structured logging, clear assertion messages

---

## Anti-Patterns (CẤM)

| ❌ Anti-Pattern | ✅ Đúng cách |
|---|---|
| Hardcode URL/credentials trong code | Đọc từ `.env` hoặc config file |
| Locator inline trong test | Khai báo trong Page class |
| `Thread.sleep()` / `waitForTimeout()` | Smart waits (`expect()`, `WebDriverWait`) |
| Global mutable state | Isolated fixtures/setup per test |
| Monolithic test file (1 file 500+ dòng) | Tách theo module/feature |
| `System.out.println()` / `console.log()` | Logger framework (Log4j, winston, logging) |
| Đoán locator không inspect DOM | Mở browser inspect DOM thực tế |

---

## Tham chiếu

- **Skill chi tiết:** [`SKILL.md`](../SKILL.md) — design principles, supported stacks, browser setup rules
- **Code mẫu base classes:** [`CODE_TEMPLATES.md`](CODE_TEMPLATES.md)
- **Rules:** [`automation_rules.md`](../../../rules/automation_rules.md) · [`locator_strategy.md`](../../../rules/locator_strategy.md)
- **Workflow scaffold:** `/generate-automation-framework`
