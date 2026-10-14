# Code Templates — Base Classes

> Code mẫu **chạy được ngay** cho các thành phần lõi của framework. Agent copy & điều chỉnh theo project, **KHÔNG** viết lại từ đầu.
>
> Nguyên tắc chung áp dụng cho mọi template:
> - Viewport `1920x1080` · headless đọc từ env, không hardcode
> - Smart waits — **không** `Thread.sleep()` / `waitForTimeout()`
> - Logger thay cho `System.out.println()` / `console.log()`
> - Credentials đọc từ `.env`, không commit

---

## 1. Playwright + TypeScript

### `src/utils/env.config.ts`

```typescript
import * as dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${key}. Kiểm tra file .env`);
  }
  return value;
}

export const env = {
  baseURL: required('BASE_URL'),
  username: required('TEST_USERNAME'),
  password: required('TEST_PASSWORD'),
  headless: process.env.HEADLESS !== 'false',
  timeout: Number(process.env.TIMEOUT ?? 30_000),
} as const;
```

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';
import { env } from './src/utils/env.config';

export default defineConfig({
  testDir: './src/tests',
  timeout: env.timeout,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  // Parallel LUÔN bật — đổi số luồng ở .env (WORKERS), không sửa file này
  workers: Number(process.env.WORKERS ?? 5),
  // Mọi output gom vào reports/ — xem reporting_rules.md mục 6
  outputDir: 'reports/test-artifacts',
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['list'],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }],
  ],
  use: {
    baseURL: env.baseURL,
    headless: env.headless,
    viewport: { width: 1920, height: 1080 },
    // 'off' vì ảnh được attach thủ công ở afterEach cho CẢ pass lẫn fail — xem § 7.1
    screenshot: 'off',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

### `src/pages/base.page.ts`

```typescript
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = ''): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Click sau khi element đã sẵn sàng — dựa vào auto-waiting của Playwright */
  protected async clickWhenReady(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  /** Điền text, xoá giá trị cũ trước */
  protected async fillField(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }

  protected async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async waitForUrl(pattern: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }
}
```

### `src/fixtures/base.fixture.ts`

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
```

### `src/utils/test-data.ts`

```typescript
/** Sinh data unique + traceable: nhìn vào DB biết ngay test nào tạo ra */
export class TestData {
  private static stamp(): string {
    return `${Date.now()}`;
  }

  static email(testName: string): string {
    return `auto_${testName}_${this.stamp()}@auto.test`;
  }

  static username(testName: string): string {
    return `auto_${testName}_${this.stamp()}`;
  }

  static code(prefix: string): string {
    return `${prefix}_${this.stamp()}`;
  }
}
```

---

## 2. Playwright + Java (Maven + TestNG)

### `src/main/java/com/project/factory/PlaywrightFactory.java`

```java
package com.project.factory;

import com.microsoft.playwright.*;
import com.project.config.ConfigReader;

/**
 * Playwright objects KHÔNG thread-safe — mỗi thread giữ instance riêng
 * để TestNG chạy parallel không giẫm chân nhau.
 */
public class PlaywrightFactory {

    private static final ThreadLocal<Playwright> PLAYWRIGHT = new ThreadLocal<>();
    private static final ThreadLocal<Browser> BROWSER = new ThreadLocal<>();
    private static final ThreadLocal<BrowserContext> CONTEXT = new ThreadLocal<>();
    private static final ThreadLocal<Page> PAGE = new ThreadLocal<>();

    public Page initBrowser() {
        ConfigReader config = ConfigReader.getInstance();

        PLAYWRIGHT.set(Playwright.create());
        BROWSER.set(PLAYWRIGHT.get().chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(config.isHeadless())));

        CONTEXT.set(BROWSER.get().newContext(new Browser.NewContextOptions()
                .setViewportSize(1920, 1080)));

        PAGE.set(CONTEXT.get().newPage());
        PAGE.get().navigate(config.getBaseUrl());
        return PAGE.get();
    }

    public static Page getPage() {
        return PAGE.get();
    }

    public void closeBrowser() {
        if (PAGE.get() != null)       { PAGE.get().close();       PAGE.remove(); }
        if (CONTEXT.get() != null)    { CONTEXT.get().close();    CONTEXT.remove(); }
        if (BROWSER.get() != null)    { BROWSER.get().close();    BROWSER.remove(); }
        if (PLAYWRIGHT.get() != null) { PLAYWRIGHT.get().close(); PLAYWRIGHT.remove(); }
    }
}
```

### `src/main/java/com/project/config/ConfigReader.java`

```java
package com.project.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/** Singleton đọc config.properties, cho phép override bằng system property. */
public class ConfigReader {

    private static ConfigReader instance;
    private final Properties properties = new Properties();

    private ConfigReader() {
        try (InputStream input = getClass().getClassLoader()
                .getResourceAsStream("config.properties")) {
            if (input == null) {
                throw new IllegalStateException("Không tìm thấy config.properties trong classpath");
            }
            properties.load(input);
        } catch (IOException e) {
            throw new IllegalStateException("Không đọc được config.properties", e);
        }
    }

    public static synchronized ConfigReader getInstance() {
        if (instance == null) {
            instance = new ConfigReader();
        }
        return instance;
    }

    /** System property thắng file — tiện truyền -Dheadless=true trên CI. */
    public String get(String key) {
        return System.getProperty(key, properties.getProperty(key));
    }

    public String getBaseUrl()  { return get("base.url"); }
    public boolean isHeadless() { return Boolean.parseBoolean(get("headless")); }
    public int getTimeout()     { return Integer.parseInt(get("timeout")); }
}
```

### `src/main/java/com/project/pages/BasePage.java`

```java
package com.project.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.WaitForSelectorState;

public abstract class BasePage {

    protected final Page page;

    protected BasePage(Page page) {
        this.page = page;
    }

    protected void click(Locator locator) {
        locator.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.VISIBLE));
        locator.click();
    }

    protected void fill(Locator locator, String value) {
        locator.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.VISIBLE));
        locator.fill(value);
    }

    protected String getText(Locator locator) {
        locator.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.VISIBLE));
        return locator.textContent();
    }

    public String getCurrentUrl() {
        return page.url();
    }
}
```

### `src/test/java/com/project/base/BaseTest.java`

```java
package com.project.base;

import com.microsoft.playwright.Page;
import com.project.factory.PlaywrightFactory;
import com.project.utils.ScreenshotUtil;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class BaseTest {

    protected PlaywrightFactory factory;
    protected Page page;

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        factory = new PlaywrightFactory();
        page = factory.initBrowser();
    }

    /** Đính ảnh trạng thái cuối cho MỌI test — cả PASS lẫn FAIL. Xem § 7.3. */
    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        String name = result.isSuccess()
                ? "trang_thai_cuoi_cua_test"
                : "trang_thai_khi_that_bai";
        ScreenshotUtil.captureAndAttach(page, name);
        factory.closeBrowser();
    }
}
```

### `src/main/java/com/project/utils/ScreenshotUtil.java` (bản Playwright Java)

```java
package com.project.utils;

import com.microsoft.playwright.Page;
import io.qameta.allure.Allure;

import java.io.ByteArrayInputStream;

public final class ScreenshotUtil {

    private ScreenshotUtil() {}

    public static void captureAndAttach(Page page, String name) {
        byte[] png = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment(name, new ByteArrayInputStream(png));
    }
}
```

> Bản Selenium dùng `WebDriver` thay cho `Page` — xem § 3.

---

## 3. Selenium + Java (Maven + TestNG)

### `src/main/java/com/project/drivers/DriverFactory.java`

```java
package com.project.drivers;

import com.project.config.ConfigReader;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.time.Duration;

public class DriverFactory {

    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    public static WebDriver initDriver() {
        ConfigReader config = ConfigReader.getInstance();

        ChromeOptions options = new ChromeOptions();
        if (config.isHeadless()) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--disable-gpu", "--no-sandbox");

        // Selenium 4.6+ tự quản lý driver binary — không cần WebDriverManager
        WebDriver driver = new ChromeDriver(options);
        driver.manage().window().setSize(new Dimension(1920, 1080));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(config.getTimeout()));

        DRIVER.set(driver);
        return driver;
    }

    public static WebDriver getDriver() {
        return DRIVER.get();
    }

    public static void quitDriver() {
        if (DRIVER.get() != null) {
            DRIVER.get().quit();
            DRIVER.remove();
        }
    }
}
```

### `src/main/java/com/project/pages/BasePage.java`

```java
package com.project.pages;

import com.project.config.ConfigReader;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public abstract class BasePage {

    protected final WebDriver driver;
    protected final WebDriverWait wait;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver,
                Duration.ofSeconds(ConfigReader.getInstance().getTimeout()));
    }

    protected WebElement waitForVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected void click(By locator) {
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
    }

    protected void type(By locator, String value) {
        WebElement element = waitForVisible(locator);
        element.clear();
        element.sendKeys(value);
    }

    protected String getText(By locator) {
        return waitForVisible(locator).getText();
    }

    protected boolean isDisplayed(By locator) {
        try {
            return waitForVisible(locator).isDisplayed();
        } catch (org.openqa.selenium.TimeoutException e) {
            return false;
        }
    }

    protected void waitForUrlContains(String fragment) {
        wait.until(ExpectedConditions.urlContains(fragment));
    }
}
```

### `src/main/java/com/project/utils/TestDataGenerator.java`

```java
package com.project.utils;

/** Data unique + traceable — truy ngược được test nào sinh ra. */
public final class TestDataGenerator {

    private TestDataGenerator() {}

    private static long stamp() {
        return System.currentTimeMillis();
    }

    public static String email(String testName) {
        return String.format("auto_%s_%d@auto.test", testName, stamp());
    }

    public static String username(String testName) {
        return String.format("auto_%s_%d", testName, stamp());
    }

    public static String code(String prefix) {
        return String.format("%s_%d", prefix, stamp());
    }
}
```

### `src/main/java/com/project/utils/ScreenshotUtil.java`

```java
package com.project.utils;

import io.qameta.allure.Allure;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.ByteArrayInputStream;

public final class ScreenshotUtil {

    private ScreenshotUtil() {}

    public static void captureAndAttach(WebDriver driver, String name) {
        byte[] png = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment(name, new ByteArrayInputStream(png));
    }
}
```

---

## 4. Appium + Java (Maven + TestNG)

### `src/main/java/com/project/drivers/AppiumDriverFactory.java`

```java
package com.project.drivers;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.MalformedURLException;
import java.net.URL;

public class AppiumDriverFactory {

    private static final ThreadLocal<AppiumDriver> DRIVER = new ThreadLocal<>();

    public static AppiumDriver initDriver(String platform, String deviceKey) {
        DesiredCapabilities caps = CapabilitiesManager.load(platform, deviceKey);
        URL serverUrl = appiumServerUrl();

        AppiumDriver driver = "android".equalsIgnoreCase(platform)
                ? new AndroidDriver(serverUrl, caps)
                : new IOSDriver(serverUrl, caps);

        DRIVER.set(driver);
        return driver;
    }

    private static URL appiumServerUrl() {
        String url = System.getProperty("appium.server", "http://127.0.0.1:4723");
        try {
            return new URL(url);
        } catch (MalformedURLException e) {
            throw new IllegalStateException("Appium server URL không hợp lệ: " + url, e);
        }
    }

    public static AppiumDriver getDriver() {
        return DRIVER.get();
    }

    public static void quitDriver() {
        if (DRIVER.get() != null) {
            DRIVER.get().quit();
            DRIVER.remove();
        }
    }
}
```

### `src/main/java/com/project/screens/BaseScreen.java`

```java
package com.project.screens;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public abstract class BaseScreen {

    protected final AppiumDriver driver;
    protected final WebDriverWait wait;

    protected BaseScreen(AppiumDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    protected WebElement waitForVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected void tap(By locator) {
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
    }

    protected void type(By locator, String value) {
        WebElement element = waitForVisible(locator);
        element.clear();
        element.sendKeys(value);
    }

    /** Scroll tới element theo text (Android) — thay cho việc tap mù vào vùng off-screen. */
    protected WebElement scrollToText(String text) {
        return driver.findElement(AppiumBy.androidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true))"
                        + ".scrollIntoView(new UiSelector().text(\"" + text + "\"))"));
    }
}
```

---

## 5. Playwright + Python (Pytest)

### `conftest.py`

```python
import os

import pytest
from dotenv import load_dotenv
from playwright.sync_api import Browser, Page, Playwright, sync_playwright

load_dotenv()


@pytest.fixture(scope="session")
def playwright_instance() -> Playwright:
    with sync_playwright() as p:
        yield p


@pytest.fixture(scope="session")
def browser(playwright_instance: Playwright) -> Browser:
    headless = os.getenv("HEADLESS", "true").lower() != "false"
    browser = playwright_instance.chromium.launch(headless=headless)
    yield browser
    browser.close()


@pytest.fixture
def page(browser: Browser) -> Page:
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()
    page.goto(os.environ["BASE_URL"])
    yield page
    context.close()


@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    """Đính ảnh trạng thái cuối cho MỌI test — cả PASS lẫn FAIL. Xem § 7.2."""
    outcome = yield
    report = outcome.get_result()

    if report.when != "call":
        return

    page = item.funcargs.get("page")
    if page is None:
        return

    import allure
    name = "trang_thai_cuoi_cua_test" if report.passed else "trang_thai_khi_that_bai"
    allure.attach(
        page.screenshot(full_page=True),
        name=name,
        attachment_type=allure.attachment_type.PNG,
    )
```

### `src/pages/base_page.py`

```python
from playwright.sync_api import Locator, Page, expect


class BasePage:
    def __init__(self, page: Page) -> None:
        self.page = page

    def goto(self, path: str = "") -> None:
        self.page.goto(path)
        self.page.wait_for_load_state("domcontentloaded")

    def click(self, locator: Locator) -> None:
        expect(locator).to_be_enabled()
        locator.click()

    def fill(self, locator: Locator, value: str) -> None:
        expect(locator).to_be_visible()
        locator.fill(value)

    def get_text(self, locator: Locator) -> str:
        expect(locator).to_be_visible()
        return locator.inner_text()
```

### `src/utils/test_data.py`

```python
import time


def _stamp() -> int:
    return int(time.time() * 1000)


def email(test_name: str) -> str:
    return f"auto_{test_name}_{_stamp()}@auto.test"


def username(test_name: str) -> str:
    return f"auto_{test_name}_{_stamp()}"


def code(prefix: str) -> str:
    return f"{prefix}_{_stamp()}"
```

---

## 6. CI/CD — GitHub Actions

### Playwright + TypeScript — `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

env:
  # Số luồng song song — hạ xuống 2–3 nếu runner 2 vCPU chạy chập chờn.
  # Sửa đúng dòng này, KHÔNG đụng playwright.config.ts
  WORKERS: 5

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npx playwright install --with-deps chromium

      - name: Run tests
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
          HEADLESS: 'true'
        run: npx playwright test

      - name: Sinh Allure report
        if: always()
        # CLI đã nằm trong devDependencies (§ 7.5) — CI không cài Allure riêng
        run: npx allure generate reports/allure-results

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-reports
          path: reports/
          retention-days: 14
```

### Selenium / Playwright Java — `.github/workflows/java-tests.yml`

```yaml
name: Java Automation Tests

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 40
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'
          cache: maven

      - name: Run tests
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
        run: mvn clean test -Dheadless=true

      - name: Sinh Allure report
        if: always()
        # allure-maven tự tải CLI về project — CI không cài Allure riêng
        run: mvn allure:report

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-reports
          path: reports/
          retention-days: 14
```

---

## 7. Allure Reporting

> Tuân thủ [`.claude/rules/reporting_rules.md`](../../../rules/reporting_rules.md): metadata đầy đủ · step Tiếng Việt · ảnh cuối **mọi** test · **không** stdout.

### 7.1 Playwright + TypeScript

**`src/tests/auth/login.spec.ts`** — test mẫu đủ metadata + step + ảnh cuối

```typescript
import { allure } from 'allure-playwright';
import { test, expect } from '../../fixtures/base.fixture';
import { env } from '../../utils/env.config';

test.describe('Đăng nhập', () => {
  test.afterEach(async ({ page }, testInfo) => {
    const name = testInfo.status === 'passed'
      ? 'trang_thai_cuoi_cua_test'
      : 'trang_thai_khi_that_bai';

    await testInfo.attach(name, {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });

  test('Đăng nhập thành công với tài khoản admin hợp lệ', async ({ loginPage, dashboardPage }) => {
    await allure.description(
      'Kiểm tra người dùng đăng nhập bằng email và mật khẩu hợp lệ '
      + 'thì được chuyển vào Dashboard và thấy menu điều hướng.',
    );
    await allure.severity('blocker');
    await allure.tags('smoke', 'login');
    await allure.label('testId', 'CRM_LOGIN_TC_001');

    await test.step('Arrange: Mở trang Login', async () => {
      await loginPage.goto('/login');
    });

    await test.step('Act: Đăng nhập bằng tài khoản admin', async () => {
      await loginPage.login(env.username, env.password);
    });

    await test.step('Assert: Hệ thống chuyển vào Dashboard', async () => {
      await expect(dashboardPage.navigationMenu).toBeVisible();
      await dashboardPage.waitForUrl(/dashboard/);
    });
  });
});
```

**Page Object — sub-step sinh tự động**

```typescript
import { test } from '@playwright/test';

export class LoginPage extends BasePage {
  readonly emailInput = this.page.getByLabel('Email');
  readonly passwordInput = this.page.getByLabel('Mật khẩu');
  readonly submitButton = this.page.getByRole('button', { name: 'Đăng nhập' });

  /** test.step lồng trong POM → hiện thành sub-step trong report */
  async login(email: string, password: string): Promise<void> {
    await test.step(`Nhập email: ${email}`, () => this.fillField(this.emailInput, email));
    await test.step('Nhập mật khẩu', () => this.fillField(this.passwordInput, password));
    await test.step('Bấm nút Đăng nhập', () => this.clickWhenReady(this.submitButton));
  }
}
```

> Ảnh đính kèm cả khi PASS → **không** dùng `screenshot: 'only-on-failure'` trong `playwright.config.ts`.
> Để `screenshot: 'off'` và attach thủ công ở `afterEach` như trên, tránh ảnh bị đính 2 lần.

### 7.2 Pytest + Python

**`pyproject.toml`** — tắt attachment stdout/stderr + gom output vào `reports/`

```toml
[tool.pytest.ini_options]
addopts = """
    --alluredir=reports/allure-results
    --allure-no-capture
    --html=reports/html/index.html
    --self-contained-html
    -n 5
    -v
"""
testpaths = ["src/tests"]
log_file = "reports/logs/pytest.log"
log_file_level = "INFO"
```

**`conftest.py`** — hook đính ảnh cuối **mọi** test

```python
import allure
import pytest


@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    """Đính ảnh trạng thái cuối cho mọi test — cả PASS lẫn FAIL."""
    outcome = yield
    report = outcome.get_result()

    if report.when != "call":
        return

    page = item.funcargs.get("page")
    if page is None:
        return

    name = "trang_thai_cuoi_cua_test" if report.passed else "trang_thai_khi_that_bai"
    allure.attach(
        page.screenshot(full_page=True),
        name=name,
        attachment_type=allure.attachment_type.PNG,
    )
```

**`src/tests/test_login.py`**

```python
import allure
import pytest

from src.pages.login_page import LoginPage
from src.pages.dashboard_page import DashboardPage


@allure.feature("Đăng nhập")
class TestLogin:

    @allure.title("Đăng nhập thành công với tài khoản admin hợp lệ")
    @allure.description(
        "Kiểm tra người dùng đăng nhập bằng email và mật khẩu hợp lệ "
        "thì được chuyển vào Dashboard và thấy menu điều hướng."
    )
    @allure.severity(allure.severity_level.BLOCKER)
    @allure.tag("smoke", "login")
    @allure.label("testId", "CRM_LOGIN_TC_001")
    def test_login_with_valid_credentials(self, page, config):
        login_page = LoginPage(page)
        dashboard_page = DashboardPage(page)

        with allure.step("Arrange: Mở trang Login"):
            login_page.goto("/login")

        with allure.step("Act: Đăng nhập bằng tài khoản admin"):
            login_page.login(config.username, config.password)

        with allure.step("Assert: Hệ thống chuyển vào Dashboard"):
            assert dashboard_page.is_navigation_visible(), \
                "Menu điều hướng phải hiển thị sau khi đăng nhập thành công"
```

**Page Object — sub-step bằng decorator**

```python
import allure


class LoginPage(BasePage):

    @allure.step("Nhập email: {email}")
    def enter_email(self, email: str) -> None:
        self.fill(self.email_input, email)

    @allure.step("Nhập mật khẩu")
    def enter_password(self, password: str) -> None:
        self.fill(self.password_input, password)

    @allure.step("Bấm nút Đăng nhập")
    def submit(self) -> None:
        self.click(self.submit_button)

    def login(self, email: str, password: str) -> None:
        self.enter_email(email)
        self.enter_password(password)
        self.submit()
```

### 7.3 TestNG + Java (Selenium / Playwright / Appium)

**`BaseTest.java`** — đính ảnh cuối **mọi** test

```java
@AfterMethod(alwaysRun = true)
public void tearDown(ITestResult result) {
    String name = result.isSuccess()
            ? "trang_thai_cuoi_cua_test"
            : "trang_thai_khi_that_bai";
    ScreenshotUtil.captureAndAttach(DriverFactory.getDriver(), name);
    DriverFactory.quitDriver();
}
```

**`LoginTest.java`**

```java
package com.project.tests;

import com.project.base.BaseTest;
import com.project.pages.DashboardPage;
import com.project.pages.LoginPage;
import io.qameta.allure.*;
import org.testng.Assert;
import org.testng.annotations.Test;

@Feature("Đăng nhập")
public class LoginTest extends BaseTest {

    @Test(groups = {"smoke", "login"}, description = "Đăng nhập thành công với tài khoản admin hợp lệ")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Kiểm tra người dùng đăng nhập bằng email và mật khẩu hợp lệ "
            + "thì được chuyển vào Dashboard và thấy menu điều hướng.")
    public void testLoginWithValidCredentials() {
        Allure.label("testId", "CRM_LOGIN_TC_001");

        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = new DashboardPage(driver);

        Allure.step("Arrange: Mở trang Login", () -> loginPage.open());

        Allure.step("Act: Đăng nhập bằng tài khoản admin",
                () -> loginPage.login(config.getUsername(), config.getPassword()));

        Allure.step("Assert: Hệ thống chuyển vào Dashboard", () ->
                Assert.assertTrue(dashboardPage.isNavigationDisplayed(),
                        "Menu điều hướng phải hiển thị sau khi đăng nhập thành công"));
    }
}
```

**Page Object — sub-step bằng `@Step`**

```java
public class LoginPage extends BasePage {

    @Step("Nhập email: {email}")
    public void enterEmail(String email) {
        type(EMAIL_INPUT, email);
    }

    @Step("Nhập mật khẩu")
    public void enterPassword(String password) {
        type(PASSWORD_INPUT, password);
    }

    @Step("Bấm nút Đăng nhập")
    public void submit() {
        click(SUBMIT_BUTTON);
    }

    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        submit();
    }
}
```

### 7.4 Gom output vào `reports/`

**Maven (`pom.xml`)** — trỏ allure-results + surefire vào `reports/`

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <version>3.2.5</version>
  <configuration>
    <suiteXmlFiles>
      <suiteXmlFile>testng.xml</suiteXmlFile>
    </suiteXmlFiles>
    <reportsDirectory>${project.basedir}/reports/surefire</reportsDirectory>
    <systemPropertyVariables>
      <allure.results.directory>${project.basedir}/reports/allure-results</allure.results.directory>
    </systemPropertyVariables>
  </configuration>
</plugin>
```

**Log4j2 (`log4j2.xml`)** — ghi log vào `reports/logs/`

```xml
<Appenders>
  <File name="FileAppender" fileName="reports/logs/test-execution.log">
    <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%t] %-5level %logger{36} - %msg%n"/>
  </File>
</Appenders>
```

**`.gitignore`** — không commit output test

```gitignore
# Test output — gom hết trong reports/
reports/

# Thư mục mặc định của tool (phòng khi config bị bỏ sót)
allure-results/
test-results/
playwright-report/
target/
__pycache__/
.env
```

**Lệnh sinh report** — chạy bằng CLI **cài trong project**, xem § 7.5

```bash
npm run report        # Node · Python
mvn allure:serve      # Java + Maven
```

> ⚠️ Sau khi chạy test, kiểm tra root project **không** còn `allure-results/` / `test-results/` / `playwright-report/` lạc ra ngoài. Nếu còn nghĩa là config output chưa ăn.

---

### 7.5 Allure CLI cài cục bộ — máy KHÔNG cần cài gì

> **Mục tiêu:** clone project → `npm install` (hoặc `mvn`) → mở được report. Không `scoop install allure`, không `brew install allure`, không tải zip thêm vào `PATH`.

| Stack | Cài vào project | Máy cần sẵn | Cần Java? |
|---|---|---|---|
| Node (Playwright TS/JS) | devDependency `allure` — Allure 3, viết bằng TypeScript | Node.js | ❌ Không |
| Java + Maven | **giải nén hẳn bộ Allure 2 vào `.allure/`** — `maven-dependency-plugin` + `allure-maven` trỏ về đó | JDK | ✅ Đã có sẵn |
| Python + Pytest | `package.json` tối giản + devDependency `allure` | Node.js | ❌ Không |

**Node/Python — vì sao không dùng `allure-commandline`:** gói npm đó chỉ **bọc** CLI Allure 2 viết bằng Java — máy vẫn phải có JRE. Allure 3 (`allure`) chạy thuần Node và vẫn đọc được `allure-results` do `allure-playwright` / `allure-pytest` / `allure-testng` sinh ra.

**Java — vì sao không để `allure-maven` tự tải:** mặc định nó tải CLI từ Internet lúc chạy goal. Máy không mạng, hoặc sau proxy công ty, là hỏng. Giải nén sẵn từ Maven Central vào `.allure/` thì bộ CLI nằm **hẳn trong project**, gọi được cả khi không qua Maven — xem mục B.

#### A. Node — `package.json`

```json
{
  "scripts": {
    "test": "playwright test",
    "report": "allure generate reports/allure-results && allure open reports/allure-report",
    "report:watch": "allure watch reports/allure-results"
  },
  "devDependencies": {
    "@playwright/test": "^1.56.0",
    "allure-playwright": "^3.10.2",
    "allure": "^3.15.0"
  }
}
```

> Trong `scripts` gọi thẳng `allure` được — npm tự tìm binary trong `node_modules/.bin`. Gõ ngoài terminal thì dùng `npx allure ...`.

**`allurerc.mjs`** — nơi khai `output`, thay cho cờ `-o` của CLI Allure 2

```js
import { defineConfig } from "allure";

export default defineConfig({
  name: "Automation Report",
  output: "reports/allure-report",
  plugins: {
    awesome: {
      options: {
        singleFile: false,
        reportLanguage: "en",
      },
    },
  },
});
```

- `singleFile: true` → report gộp **1 file HTML** duy nhất, tiện gửi qua chat/email
- `reportLanguage` chưa hỗ trợ `vi` — để `en`. Tên test và step vẫn hiện Tiếng Việt vì đó là dữ liệu, không phải giao diện

#### B. Java + Maven — tải hẳn bộ Allure 2 vào thư mục project

Allure 2 CLI được publish trên **Maven Central** như một artifact bình thường: `io.qameta.allure:allure-commandline:<version>:zip` (~30 MB). Dùng `maven-dependency-plugin` giải nén nó vào **`.allure/`** ngay trong project — CLI về theo đúng đường của Maven (dùng được mirror/proxy nội bộ, cache ở `~/.m2`), không phụ thuộc bất kỳ thứ gì cài sẵn trên máy.

**`pom.xml`**

```xml
<properties>
  <!-- Một chỗ duy nhất khai version CLI — dùng lại ở cả 2 plugin bên dưới -->
  <allure.cli.version>2.45.0</allure.cli.version>
  <allure.home>${project.basedir}/.allure</allure.home>
</properties>

<build>
  <plugins>
    <!-- 1) Tải & giải nén bộ Allure 2 vào .allure/allure-<version>/ -->
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-dependency-plugin</artifactId>
      <version>3.8.1</version>
      <executions>
        <execution>
          <id>unpack-allure-cli</id>
          <phase>validate</phase>
          <goals><goal>unpack</goal></goals>
          <configuration>
            <artifactItems>
              <artifactItem>
                <groupId>io.qameta.allure</groupId>
                <artifactId>allure-commandline</artifactId>
                <version>${allure.cli.version}</version>
                <type>zip</type>
                <outputDirectory>${allure.home}</outputDirectory>
              </artifactItem>
            </artifactItems>
            <!-- Marker để ngoài target/ → mvn clean KHÔNG bắt giải nén lại -->
            <markersDirectory>${allure.home}/.markers</markersDirectory>
          </configuration>
        </execution>
      </executions>
    </plugin>

    <!-- 2) Goal tiện dụng — trỏ về bộ CLI vừa giải nén, KHÔNG tải lại lần nữa -->
    <plugin>
      <groupId>io.qameta.allure</groupId>
      <artifactId>allure-maven</artifactId>
      <version>2.15.2</version>
      <configuration>
        <reportVersion>${allure.cli.version}</reportVersion>
        <installDirectory>${allure.home}</installDirectory>
        <resultsDirectory>${project.basedir}/reports/allure-results</resultsDirectory>
        <reportDirectory>${project.basedir}/reports/allure-report</reportDirectory>
      </configuration>
    </plugin>
  </plugins>
</build>
```

`allure-maven` kiểm tra `installDirectory/allure-<reportVersion>/bin/allure` **trước khi** tải. Trỏ đúng vào bộ đã giải nén ở bước 1 thì nó dùng luôn — **không** có bước tải riêng nào nữa. Hai chỗ phải **cùng** `${allure.cli.version}`, lệch version là nó tải lại.

**Cấu trúc sau khi chạy `mvn validate`**

```text
project-root/
├── .allure/
│   ├── .markers/                      # dấu đã giải nén — sống sót qua mvn clean
│   └── allure-2.45.0/
│       ├── bin/allure                 # Linux · macOS
│       ├── bin/allure.bat             # Windows
│       ├── lib/  config/  plugins/
└── reports/
```

**Cách mở report — 2 đường, chọn cái nào cũng được**

```bash
# Đường 1 — qua Maven
mvn allure:report            # sinh vào reports/allure-report
mvn allure:serve             # sinh + mở browser luôn

# Đường 2 — gọi thẳng CLI trong project, không cần Maven
.allure\allure-2.45.0\bin\allure.bat generate reports\allure-results -o reports\allure-report --clean
.allure\allure-2.45.0\bin\allure.bat open reports\allure-report

# macOS / Linux — cấp quyền chạy một lần sau khi giải nén
chmod +x .allure/allure-2.45.0/bin/allure
./.allure/allure-2.45.0/bin/allure generate reports/allure-results -o reports/allure-report --clean
```

**Bản 1 file HTML để gửi cho người không cài gì** — `allure-maven` không có tham số single-file, phải gọi thẳng CLI:

```bash
.allure\allure-2.45.0\bin\allure.bat generate reports\allure-results -o reports\allure-report-single --single-file --clean
```

**Ghi chú bắt buộc**

- `resultsDirectory` phải trùng `allure.results.directory` đã khai ở surefire (§ 7.3) — lệch là report rỗng
- `.gitignore` thêm `.allure/` — 30 MB, không commit
- **Máy không có mạng:** bộ CLI vẫn về được nếu `~/.m2` đã có artifact (copy `~/.m2/repository/io/qameta/allure/allure-commandline/` sang máy đó), hoặc chép nguyên thư mục `.allure/` sang. Cần cam kết chạy được offline tuyệt đối thì **bỏ `.allure/` khỏi `.gitignore` và commit thẳng vào repo** — đổi 30 MB lấy việc clone về là chạy được ngay
- Thêm **Maven Wrapper** để người khác khỏi cài Maven: `mvn -N wrapper:wrapper` → commit `mvnw`, `mvnw.cmd`, `.mvn/`. Sau đó dùng `./mvnw allure:serve`

#### C. Python + Pytest — `package.json` tối giản

PyPI **không** có gói nào ship Allure CLI (`allure-pytest` chỉ sinh results; `allure-combine` chỉ gộp report đã sinh). Nên dùng CLI Node, đặt cạnh project:

```json
{
  "name": "pytest-allure-cli",
  "private": true,
  "scripts": {
    "report": "allure generate reports/allure-results && allure open reports/allure-report"
  },
  "devDependencies": {
    "allure": "^3.15.0"
  }
}
```

Dùng chung `allurerc.mjs` ở mục A. Ghi vào README: `npm install` **một lần**, sau đó `npm run report`.

#### D. Máy người nhận không có JDK — mở report kiểu gì

> **Nói thẳng:** project Java + Maven **không thể chạy test** trên máy không có JDK — Maven cũng chạy trên JVM, và CLI Allure 2 cũng là app Java. Đây là ràng buộc của stack Java, không phải của Allure. **Không** gói JDK vào project: mỗi OS/kiến trúc một bản, ~180 MB, và phải cập nhật bảo mật.
>
> Nhưng **xem report thì không cần JDK**. Chọn theo đúng thứ máy người nhận đang có:

| Máy người nhận có | Họ cần làm gì | Cách |
|---|---|---|
| **JDK** (bắt buộc nếu muốn chạy test) | Chạy test + mở report | Bộ CLI đã nằm trong `.allure/` (mục B) → `./mvnw allure:serve` hoặc gọi thẳng `bin/allure`. Kèm Maven Wrapper thì khỏi cài cả Maven |
| **Chỉ có Node**, không có Java | Sinh + mở report từ `reports/allure-results` đã có | `npx allure generate reports/allure-results` — Allure 3 chạy thuần Node và **đọc được results của project Java** (`allure-testng` ghi ra đúng định dạng Allure 2) |
| **Không có gì**, chỉ có browser | Chỉ xem report | Gửi file **single-file HTML** — mở bằng browser, không cài gì |

**Máy chỉ có Node** — thêm `package.json` nhỏ vào project Java, không đụng gì tới Maven:

```json
{
  "name": "allure-viewer",
  "private": true,
  "scripts": {
    "report": "allure generate reports/allure-results && allure open reports/allure-report"
  },
  "devDependencies": {
    "allure": "^3.15.0"
  }
}
```

⚠️ Đường này ra giao diện **Awesome** của Allure 3, không phải giao diện Allure 2 mà `mvn allure:serve` sinh ra. Cùng dữ liệu, khác giao diện — nói trước để người xem khỏi tưởng sai report.

**Người chỉ xem** — sinh 1 file rồi gửi thẳng file đó:

```bash
.allure\allure-2.45.0\bin\allure.bat generate reports\allure-results -o reports\allure-report-single --single-file --clean
# → gửi reports/allure-report-single/index.html
```

⚠️ File này chứa **ảnh chụp hệ thống thật** — thường có dữ liệu khách hàng. Kiểm nội dung trước khi gửi ra ngoài team.

#### E. Kiểm chứng (bắt buộc trước khi bàn giao)

**Node / Python:**

```bash
npx allure --version                        # in ra version = đạt
npx allure generate reports/allure-results
npx allure open reports/allure-report
```

**Java + Maven** — kiểm đúng thứ tự này:

```bash
mvn validate                                # phải sinh ra .allure/allure-<version>/
dir .allure\allure-2.45.0\bin               # ls .allure/allure-2.45.0/bin trên macOS/Linux
.allure\allure-2.45.0\bin\allure.bat --version
mvn allure:report                           # KHÔNG được thấy dòng "Downloading allure commandline"
```

| Dấu hiệu | Nghĩa | Sửa |
|---|---|---|
| `.allure/` không sinh ra sau `mvn validate` | execution `unpack-allure-cli` chưa gắn đúng phase | Kiểm lại `<phase>validate</phase>` |
| Log hiện `Downloading allure commandline` | `allure-maven` không thấy bộ đã giải nén | `reportVersion` lệch `${allure.cli.version}`, hoặc `installDirectory` sai |
| `allure: command not found` / `is not recognized` | Đang gọi CLI global chứ không phải CLI trong project | Gọi theo đường dẫn `.allure/...`, hoặc `npx allure` với Node |
| `mvn` báo lỗi `JAVA_HOME` | Máy chưa có JDK | Xem mục D — máy đó không chạy được test Java, chỉ xem report được |

#### F. Ngoại lệ — project Node/Python nhưng team bắt buộc giao diện Allure 2 cổ điển

Allure 3 mặc định render giao diện **Awesome**; plugin `classic` / `allure2` còn thử nghiệm. Bắt buộc dùng đúng giao diện cũ thì đổi sang:

```json
{ "devDependencies": { "allure-commandline": "^2.43.0" } }
```

```bash
npx allure generate reports/allure-results -o reports/allure-report --clean
npx allure generate reports/allure-results -o reports/allure-report-single --single-file --clean
npx allure open reports/allure-report
```

⚠️ Đường này **cần JRE 8+ trên máy** — phải ghi rõ ở đầu README, đừng để user cài xong mới phát hiện.

#### G. `.gitignore` bổ sung

```gitignore
reports/
.allure/          # bộ Allure 2 CLI giải nén trong project (~30 MB)
node_modules/
```

> Muốn clone về là chạy được **không cần mạng** → **bỏ dòng `.allure/`** và commit thẳng bộ CLI vào repo. Đổi 30 MB dung lượng lấy việc người mới khỏi chờ tải. Repo public thì cân nhắc — 30 MB nằm vĩnh viễn trong lịch sử git.

---

## 8. Parallel Execution — luôn bật, mặc định 5 luồng

> **Nguyên tắc:** parallel bật **từ ngày đầu**, không phải tính năng thêm sau. Suite viết trong chế độ tuần tự rồi mới bật song song thì lộ ra hàng loạt test phụ thuộc nhau — sửa lúc đó đắt hơn nhiều.
>
> **Số luồng khai đúng MỘT chỗ** cho mỗi stack. Rải ra nhiều file là lúc cần hạ tải sẽ sửa sót.

| Stack | Khai ở | Mặc định | Đổi lúc chạy |
|---|---|---|---|
| Playwright TS | `playwright.config.ts` ← `.env` | `workers: 5` | `WORKERS=2 npx playwright test` |
| Pytest | `pyproject.toml` → `addopts` | `-n 5` | `pytest -n 2` (cờ dòng lệnh thắng) |
| TestNG | `testng.xml` | `thread-count="5"` | Sửa `thread-count` |
| Appium | `testng.xml` | **= số device thật** | Thêm/bớt khối `<test>` |

### 8.1 Playwright + TypeScript

```typescript
// playwright.config.ts — xem bản đầy đủ ở § 1
export default defineConfig({
  fullyParallel: true,                          // song song cả trong 1 file
  workers: Number(process.env.WORKERS ?? 5),
});
```

```bash
# .env / .env.example
WORKERS=5
```

- `fullyParallel: true` → test **trong cùng một file** cũng chạy song song. Bỏ đi thì chỉ song song giữa các file
- Mỗi worker là **process riêng** với browser riêng → không chia sẻ state, nhưng cũng tốn RAM: 5 worker ≈ 5 Chrome
- `test.describe.serial()` chỉ dùng khi thật sự có chuỗi phụ thuộc — **mọi lần dùng phải kèm comment lý do**

### 8.2 Pytest + Python (`pytest-xdist`)

```txt
# requirements.txt
pytest-xdist>=3.6.0
```

```toml
# pyproject.toml → addopts
-n 5
```

- Fixture `scope="session"` chạy **một lần mỗi worker**, không phải một lần toàn suite — browser session-scoped ⇒ 5 browser
- Test cần chạy chung 1 worker → gom vào cùng file và dùng `--dist loadfile`
- Debug thì tắt song song: `pytest -n 0`

### 8.3 TestNG (Selenium / Playwright Java)

```xml
<!-- testng.xml — NGUỒN DUY NHẤT của số luồng -->
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Automation Suite" parallel="methods" thread-count="5"
       data-provider-thread-count="5">
  <listeners>
    <listener class-name="io.qameta.allure.testng.AllureTestNg"/>
  </listeners>
  <test name="Regression">
    <packages>
      <package name="com.project.tests.*"/>
    </packages>
  </test>
</suite>
```

| `parallel` | Nghĩa | Khi nào dùng |
|---|---|---|
| `methods` | Mỗi `@Test` một thread | **Mặc định** — mức song song cao nhất |
| `classes` | Mỗi class một thread, method trong class chạy tuần tự | Class có `@BeforeClass` nặng dùng chung |
| `tests` | Mỗi khối `<test>` một thread | Chia theo device/browser |

**Bắt buộc đi kèm** — thiếu là hỏng ngay ở luồng thứ 2:

```java
// DriverFactory — xem bản đầy đủ ở § 3
private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

public static void quitDriver() {
    if (DRIVER.get() != null) {
        DRIVER.get().quit();
        DRIVER.remove();      // BẮT BUỘC — không remove là rò rỉ sang test sau
    }
}
```

- **KHÔNG** để `WebDriver`, `WebDriverWait`, Page Object làm field static
- `data-provider-thread-count` điều khiển riêng luồng của `@DataProvider(parallel = true)`
- Muốn ghi đè số luồng từ dòng lệnh (`-Dparallel`, `-DthreadCount` của surefire): **kiểm chứng trên project thật trước**, tuỳ tổ hợp phiên bản surefire/TestNG mà cấu hình trong `testng.xml` có thể thắng — đừng ghi vào README như sự thật khi chưa thử

### 8.4 Appium — song song = nhiều device, không phải nhiều thread

```xml
<suite name="Mobile Suite" parallel="tests" thread-count="2">
  <test name="Pixel_7">
    <parameter name="deviceName"  value="Pixel_7"/>
    <parameter name="udid"        value="emulator-5554"/>
    <parameter name="systemPort"  value="8201"/>
    <classes><class name="com.project.tests.LoginMobileTest"/></classes>
  </test>
  <test name="Pixel_8">
    <parameter name="deviceName"  value="Pixel_8"/>
    <parameter name="udid"        value="emulator-5556"/>
    <parameter name="systemPort"  value="8202"/>
    <classes><class name="com.project.tests.LoginMobileTest"/></classes>
  </test>
</suite>
```

🚨 **Không thể chạy 5 luồng trên 1 emulator.** `thread-count` = **số device đang chạy thật**. Mỗi device phải có:

| Capability | Nền tảng | Vì sao |
|---|---|---|
| `udid` | cả hai | Chỉ đích danh device |
| `systemPort` | Android | Port của UiAutomator2 — trùng là 2 phiên giẫm nhau |
| `wdaLocalPort` | iOS | Port của WebDriverAgent — cùng lý do |

### 8.5 Điều kiện để parallel không đẻ ra flaky

| Yêu cầu | Vi phạm điển hình | Hậu quả |
|---|---|---|
| Driver/browser **theo thread** | `static WebDriver driver` | Luồng 2 cướp driver của luồng 1 |
| **Không** static mutable dùng chung | `static String currentUserId` | Test đọc nhầm dữ liệu của test khác |
| Test data **unique từng test** | 5 test cùng tạo `test@mail.com` | `Duplicate key` — fail ngẫu nhiên |
| Không sửa/xoá bản ghi dùng chung | 2 test cùng sửa 1 khách hàng | Assert lệch, không tái hiện được |
| Không phụ thuộc thứ tự | TC02 cần TC01 tạo data trước | Đảo thứ tự là đỏ |
| Cleanup theo phạm vi test | Xoá sạch bảng ở teardown | Xoá mất data của luồng đang chạy |

> 🚨 **Test đỏ khi bật parallel = test đang sai, không phải parallel sai.** Sửa test data / khử shared state, **KHÔNG** hạ `WORKERS=1` để giấu. Hạ số luồng chỉ hợp lệ khi giới hạn nằm ở **app** (không chịu nổi nhiều phiên) hoặc **hạ tầng** (runner 2 vCPU) — và phải ghi lý do vào README.

---

## 9. Mobile (Appium Java) — Native Android · Native iOS · Flutter

> Quy tắc đầy đủ: [`.claude/rules/appium_rules.md`](../../../rules/appium_rules.md) · Recon & thu locator: [`skills-mobile-debug-agent`](../../skills-mobile-debug-agent/SKILL.md)

### 9.1 Capabilities theo loại app — `capabilities/devices.json`

```json
{
  "android_native": {
    "platformName": "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": "Pixel_7",
    "appium:udid": "emulator-5554",
    "appium:systemPort": 8201,
    "appium:appPackage": "com.application.xyz",
    "appium:appActivity": "com.application.xyz.MainActivity",
    "appium:autoGrantPermissions": true,
    "appium:newCommandTimeout": 120
  },
  "ios_native": {
    "platformName": "iOS",
    "appium:automationName": "XCUITest",
    "appium:deviceName": "iPhone 15",
    "appium:platformVersion": "17.5",
    "appium:udid": "auto",
    "appium:wdaLocalPort": 8101,
    "appium:bundleId": "com.application.xyz",
    "appium:autoAcceptAlerts": true,
    "appium:newCommandTimeout": 120
  },
  "flutter_android": {
    "_comment": "Đường A — semantics + UiAutomator2. Chạy được cả bản RELEASE",
    "platformName": "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": "Pixel_7",
    "appium:systemPort": 8203,
    "appium:appPackage": "com.application.flutter",
    "appium:appActivity": ".MainActivity",
    "appium:autoGrantPermissions": true
  },
  "flutter_ios": {
    "_comment": "Đường A — semantics + XCUITest",
    "platformName": "iOS",
    "appium:automationName": "XCUITest",
    "appium:deviceName": "iPhone 15",
    "appium:wdaLocalPort": 8103,
    "appium:bundleId": "com.application.flutter",
    "appium:autoAcceptAlerts": true
  }
}
```

> **Real device iOS** thêm: `appium:xcodeOrgId`, `appium:xcodeSigningId`, `appium:updatedWDABundleId`. Chưa ký WDA thì phiên **không mở được** — lỗi này không liên quan gì tới locator.

### 9.2 Screen Object — locator tách theo nền tảng

```java
package com.project.screens;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.AppiumDriver;
import io.qameta.allure.Step;
import org.openqa.selenium.By;

public class LoginScreen extends BaseScreen {

    // Locator khai theo nền tảng NGAY TRONG Screen class.
    // KHÔNG rải if (isAndroid) khắp test class.
    private final By emailInput   = byPlatform(
            AppiumBy.accessibilityId("email_input"),
            AppiumBy.accessibilityId("email_input"));

    private final By passwordInput = byPlatform(
            AppiumBy.accessibilityId("password_input"),
            AppiumBy.accessibilityId("password_input"));

    private final By loginButton  = byPlatform(
            AppiumBy.id("com.application.xyz:id/btn_login"),
            AppiumBy.iOSNsPredicateString(
                    "type == 'XCUIElementTypeButton' AND name == 'btn_login'"));

    public LoginScreen(AppiumDriver driver) {
        super(driver);
    }

    @Step("Đăng nhập bằng tài khoản {email}")
    public HomeScreen login(String email, String password) {
        type(emailInput, email);
        type(passwordInput, password);
        tap(loginButton);
        return new HomeScreen(driver);
    }
}
```

**`byPlatform` trong `BaseScreen`** — một chỗ duy nhất phân nhánh nền tảng:

```java
protected By byPlatform(By android, By ios) {
    return isAndroid() ? android : ios;
}

protected boolean isAndroid() {
    return "android".equalsIgnoreCase(
            String.valueOf(driver.getCapabilities().getCapability("platformName")));
}
```

### 9.3 Flutter — Đường A (semantics), dùng cho stack Java

Dev bọc widget:

```dart
Semantics(
  label: 'login_button',      // → content-desc (Android) · accessibility label (iOS)
  child: ElevatedButton(onPressed: _login, child: const Text('Đăng nhập')),
)
```

QA lấy element — **một locator dùng chung cả 2 nền tảng**:

```java
private final By loginButton = AppiumBy.accessibilityId("login_button");
```

🚨 **`Key('login_button')` KHÔNG ra `content-desc`.** Chỉ flutter driver (Đường B) thấy `Key`. Dev báo "đã thêm Key" = **chưa dùng được** với Đường A.

**Cuộn trong danh sách Flutter** — item chưa cuộn tới thì chưa render, chưa tồn tại trong semantics tree:

```java
@Step("Cuộn tới mục {label}")
protected void scrollToInFlutterList(String label) {
    By target = AppiumBy.accessibilityId(label);
    for (int i = 0; i < 10 && driver.findElements(target).isEmpty(); i++) {
        swipeUp();          // cuộn từng bước rồi TÌM LẠI
    }
    waitForVisible(target); // không thấy sau 10 lần cuộn → fail thật, không tăng timeout
}
```

### 9.4 Gesture helper — đúng theo nền tảng

```java
@Step("Cuộn tới element")
protected void scrollToElement(String textOrLabel) {
    if (isAndroid()) {
        driver.findElement(AppiumBy.androidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true))"
              + ".scrollIntoView(new UiSelector().description(\"" + textOrLabel + "\"))"));
    } else {
        driver.executeScript("mobile: scroll", Map.of(
                "direction", "down",
                "predicateString", "name == '" + textOrLabel + "'"));
    }
}

@Step("Vuốt lên")
protected void swipeUp() {
    Dimension size = driver.manage().window().getSize();
    int startY = (int) (size.height * 0.7);
    int endY   = (int) (size.height * 0.3);
    int x      = size.width / 2;

    PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
    Sequence swipe = new Sequence(finger, 1)
            .addAction(finger.createPointerMove(Duration.ZERO,
                    PointerInput.Origin.viewport(), x, startY))
            .addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()))
            .addAction(finger.createPointerMove(Duration.ofMillis(600),
                    PointerInput.Origin.viewport(), x, endY))
            .addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

    driver.perform(List.of(swipe));
}
```

> Toạ độ ở đây tính **theo tỉ lệ màn hình** — chấp nhận được cho gesture. Nhưng **tap element bằng toạ độ cứng thì cấm** (xem `appium_rules.md` mục 5).

### 9.5 Hybrid — đổi context

```java
@Step("Thao tác trong WebView")
protected void inWebView(Runnable actions) {
    String original = driver.getContext();
    String webview = driver.getContextHandles().stream()
            .filter(c -> c.startsWith("WEBVIEW"))
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("Không tìm thấy WEBVIEW context"));
    driver.context(webview);
    try {
        actions.run();
    } finally {
        driver.context(original);   // BẮT BUỘC — quên là mọi locator native sau đó fail
    }
}
```

---

## Checklist khi dùng template

- [ ] Đổi `com.project` thành package thật của project
- [ ] Thay locator ví dụ bằng locator **đã inspect DOM thực tế** — không dùng nguyên placeholder
- [ ] Điền `.env.example` đầy đủ key, `.env` thật **không** commit
- [ ] Xoá phần code của stack không dùng đến
- [ ] Chạy build (`npm ci` / `mvn clean compile` / `pip install -r requirements.txt`) xác nhận không lỗi
- [ ] Allure CLI nằm **trong project** (§ 7.5) — `npx allure --version` / `.allure/allure-<ver>/bin/allure --version` chạy được mà máy chưa cài Allure
- [ ] Java: `mvn validate` sinh ra `.allure/`, và `mvn allure:report` **không** in dòng `Downloading allure commandline`
- [ ] README có mục "Mở report", **không** hướng dẫn cài Allure lên máy — có ghi rõ đường cho máy chỉ có Node và cho người chỉ xem (single-file HTML)
- [ ] **Parallel bật sẵn 5 luồng** (§ 8) — chạy thử thấy nhiều worker/thread trong log
- [ ] Số luồng khai **đúng 1 chỗ**; driver theo `ThreadLocal`, không có static mutable dùng chung
- [ ] Appium: `thread-count` = số device thật, mỗi device có `systemPort`/`wdaLocalPort` riêng
- [ ] `.github/workflows/` có workflow chạy được — headless, `WORKERS` khai ở cấp workflow, upload `reports/` với `if: always()`
