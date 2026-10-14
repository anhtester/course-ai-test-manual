# Quy Tắc Report (Allure & tương đương)

> Áp dụng cho **mọi** script automation sinh ra, bất kể framework (Playwright, Selenium, Appium) hay ngôn ngữ.
>
> **Nguyên tắc gốc:** Report phải đọc hiểu được bởi người **không xem code** — QA lead, BA, PM. Nhìn vào Test Body là biết test đã làm gì, ở bước nào, kết quả ra sao.

---

## 1. Metadata Bắt Buộc Cho Mỗi Test

Mỗi test case **PHẢI** khai báo đủ 5 mục sau. Thiếu bất kỳ mục nào = chưa đạt Definition of Done.

| Mục | Nội dung | Ví dụ |
|---|---|---|
| **Tên test (title)** | Mô tả hành vi bằng **Tiếng Việt**, không phải tên hàm | `Đăng nhập thành công với tài khoản admin hợp lệ` |
| **Description** | 1–2 câu: test kiểm tra gì, điều kiện gì, kỳ vọng gì | `Kiểm tra người dùng đăng nhập bằng email và mật khẩu hợp lệ thì được chuyển vào Dashboard và thấy menu điều hướng.` |
| **Severity** | `blocker` / `critical` / `normal` / `minor` / `trivial` | `blocker` cho luồng login |
| **Tags / Labels** | Nhóm chạy: `smoke`, `regression`, tên module | `smoke`, `login` |
| **TC ID** | Mã manual test case để truy vết ngược | `CRM_LOGIN_TC_001` |

**KHÔNG** để tên test hiển thị trong report là tên hàm kiểu `test_login_with_valid_credentials` — đó là tên code, không phải tên test case.

**TC ID** gắn qua label riêng (không nhét vào title) để skill `skills-coverage-traceability` map được RTM.

---

## 2. Test Body — Mô Tả Từng Bước

Toàn bộ thân test **PHẢI** được bọc trong các **step có tên mô tả bằng Tiếng Việt**.

### Cấu trúc chuẩn — bám theo Arrange / Act / Assert

```
▼ Test body
  ▸ Arrange: Mở trang Login
  ▸ Act: Đăng nhập bằng tài khoản admin
  ▸ Assert: Hệ thống chuyển vào Dashboard
  ▸ trang_thai_cuoi_cua_test  (ảnh)
```

### Quy tắc đặt tên step

| ✅ Đúng | ❌ Sai |
|---|---|
| `Act: Đăng nhập bằng tài khoản admin` | `login()` |
| `Assert: Hệ thống chuyển vào Dashboard` | `check url` |
| `Arrange: Mở trang Login` | `step 1` |

- Bắt đầu bằng tiền tố `Arrange:` / `Act:` / `Assert:` để người đọc biết đang ở giai đoạn nào
- Tên step mô tả **hành vi nghiệp vụ**, không mô tả thao tác DOM
- Step con (sub-step) sinh tự động từ method của Page Object — đánh dấu method POM bằng step API tương ứng

### Không được để test body rỗng step

Test mà Test Body chỉ hiện 1 dòng phẳng = **fail review**. Tối thiểu phải có 3 step Arrange / Act / Assert.

---

## 3. Screenshot — Đính Kèm Ở Cuối MỌI Test

**Bắt buộc** đính kèm ảnh chụp màn hình ở **cuối mỗi test case**, **không phân biệt PASS hay FAIL**.

| Trường hợp | Ảnh đính kèm | Tên attachment |
|---|---|---|
| Test **PASSED** | Ảnh trạng thái cuối cùng — bằng chứng test đã chạy thật | `trang_thai_cuoi_cua_test` |
| Test **FAILED** | Ảnh tại thời điểm fail | `trang_thai_khi_that_bai` |

Lý do bắt buộc cả khi PASS: report có ảnh mới chứng minh được test **thực sự chạy trên UI** chứ không phải pass giả do assertion yếu.

**Quy tắc:**
- Chụp trong teardown (`afterEach` / `@AfterMethod` / fixture finalizer) — **không** rải lệnh chụp trong thân test
- Mỗi test **1 ảnh cuối** là đủ; chụp thêm chỉ ở milestone thật sự quan trọng
- Tên attachment giữ **cố định** để so sánh giữa các lần chạy
- Ảnh full-page nếu nội dung cần kiểm tra nằm ngoài viewport

---

## 4. CẤM Đính Kèm stdout / stderr

Report **KHÔNG** được chứa attachment `stdout`, `stderr`.

| Framework | Cách tắt |
|---|---|
| **pytest + allure-pytest** | Thêm `--allure-no-capture` vào `addopts` trong `pyproject.toml` / `pytest.ini` |
| **Playwright TS** | Không attach mặc định — chỉ cần **không** dùng `console.log` trong test |
| **TestNG + allure-testng** | Không attach mặc định — chỉ cần **không** dùng `System.out.println` |

> ⚠️ `--allure-no-capture` tắt luôn cả attachment `log`. Nếu vẫn cần log nghiệp vụ, attach thủ công một khối log đã chọn lọc — **không** đổ toàn bộ output thô vào report.

Ghi log dùng **logger framework** (Log4j / logging / winston), không dùng `print` / `console.log` — đây cũng là anti-pattern đã cấm ở `automation_rules.md`.

---

## 5. Bảng API Theo Framework

| Mục | Playwright + TS | Pytest (Python) | TestNG (Java) |
|---|---|---|---|
| Tên test | `allure.displayName()` | `@allure.title(...)` | `@Description` + `ITestListener` |
| Description | `allure.description()` | `@allure.description(...)` | `@Description(...)` |
| Severity | `allure.severity()` | `@allure.severity(...)` | `@Severity(SeverityLevel.X)` |
| Tag / Label | `allure.tags()` | `@allure.tag(...)` | `@Story` / `@Feature` |
| TC ID | `allure.label('testId', ...)` | `@allure.label('testId', ...)` | `Allure.label("testId", ...)` |
| Step | `test.step('...', async () => {})` | `with allure.step('...')` | `@Step("...")` / `Allure.step(...)` |
| Attach ảnh | `testInfo.attach(name, {body, contentType})` | `allure.attach(png, name, PNG)` | `Allure.addAttachment(name, stream)` |

Code mẫu đầy đủ chạy được: [`.claude/skills/skills-framework-architect/references/CODE_TEMPLATES.md`](../skills/skills-framework-architect/references/CODE_TEMPLATES.md) mục **7. Allure Reporting**.

---

## 6. Thư Mục Output — Gom Hết Vào `reports/`

**Toàn bộ** sản phẩm sinh ra khi chạy test PHẢI nằm trong **một thư mục `reports/` duy nhất** ở gốc project. **CẤM** rải file report ra root.

```text
project-root/
└── reports/                      # ← Toàn bộ output nằm trong đây
    ├── allure-results/           # Raw results (JSON) — input cho allure generate
    ├── allure-report/            # HTML report nhiều file (mở bằng allure open)
    ├── allure-report-single/     # Report gộp 1 file — tiện gửi qua chat/email
    ├── html/                     # HTML report của runner (pytest-html / Playwright HTML)
    ├── logs/                     # Log file thực thi
    └── screenshots/              # Ảnh chụp lưu ra đĩa
```

Thư mục con khác (video, trace…) **được phép thêm**, miễn nằm trong `reports/`.

### Cấu hình theo stack

| Stack | Nơi khai báo | Giá trị |
|---|---|---|
| **Playwright TS** | `playwright.config.ts` | `['html', { outputFolder: 'reports/html' }]` · `['allure-playwright', { resultsDir: 'reports/allure-results' }]` · `outputDir: 'reports/test-artifacts'` |
| **Pytest** | `pyproject.toml` → `addopts` | `--alluredir=reports/allure-results --html=reports/html/index.html` |
| **TestNG + Maven** | `pom.xml` → surefire `systemPropertyVariables` | `allure.results.directory` = `${project.basedir}/reports/allure-results` · surefire `reportsDirectory` = `${project.basedir}/reports/surefire` |
| **Log file** | Log4j2 / `logging` / winston | Ghi vào `reports/logs/` |
| **Screenshot lưu đĩa** | `ScreenshotUtil` | Ghi vào `reports/screenshots/` |

### Allure CLI phải cài TRONG project — máy không cài gì

> **Người dùng clone project về, chạy `npm install` (hoặc `mvn`) là mở được report.**
>
> 🚫 **CẤM** hướng dẫn cài Allure lên máy: `scoop install allure` · `brew install allure` · `choco install allure` · tải zip thêm vào `PATH`. Cài vào máy thì đổi máy là hỏng, và CI phải cài lại lần nữa.

| Stack | Cài vào project | Cần Java? |
|---|---|---|
| **Node** (Playwright TS/JS) | devDependency `allure` (Allure 3 — chạy thuần Node) | ❌ |
| **Java + Maven** | `maven-dependency-plugin` giải nén `allure-commandline:zip` vào **`.allure/`** + `allure-maven` trỏ `installDirectory` về đó | ✅ đã có sẵn |
| **Python + Pytest** | `package.json` tối giản + devDependency `allure` | ❌ |

Gói npm `allure-commandline` chỉ **bọc** CLI Allure 2 viết bằng Java → máy vẫn phải có JRE. Chỉ dùng cho project Node khi team bắt buộc giao diện Allure 2 cổ điển, và **phải ghi rõ yêu cầu JRE trong README**.

**Java: KHÔNG dựa vào cơ chế tự tải của `allure-maven`** — nó tải từ Internet lúc chạy goal, máy không mạng / sau proxy là hỏng. Phải giải nén sẵn bộ CLI vào `.allure/` để nó nằm hẳn trong project.

**Máy không có JDK** thì không chạy được test Java (Maven cũng là app Java) — đây là ràng buộc của stack, không phải của Allure. Vẫn **xem** report được bằng: máy có Node → `npx allure generate reports/allure-results`; máy không có gì → gửi bản **single-file HTML**.

### Lệnh sinh report

```bash
npm run report        # Node · Python — allure generate + allure open
mvn allure:serve      # Java + Maven — sinh và mở luôn
```

```bash
# Java — gọi thẳng CLI trong project, không cần Maven
.allure\allure-2.45.0\bin\allure.bat generate reports\allure-results -o reports\allure-report --clean
```

Thư mục output khai trong `allurerc.mjs` (`output: "reports/allure-report"`) hoặc trong `<configuration>` của `allure-maven`.

Config đầy đủ từng stack: [`CODE_TEMPLATES.md`](../skills/skills-framework-architect/references/CODE_TEMPLATES.md) § 7.5.

### Quy tắc kèm theo

- **`.gitignore` PHẢI có dòng `reports/`** — không commit output test lên repo
- **`.gitignore` cũng phải chặn `.allure/`** — nơi `allure-maven` tải CLI về
- **CI upload artifact** trỏ vào `reports/` (1 artifact duy nhất, không upload lẻ từng thư mục)
- **KHÔNG** để thư mục mặc định của tool nằm ở root: `allure-results/`, `test-results/`, `playwright-report/`, `target/surefire-reports/` — phải trỏ lại vào `reports/`
- Ảnh trong `reports/screenshots/` chụp hệ thống thật, **thường chứa dữ liệu khách hàng** — thêm lý do nữa để không commit

---

## 7. Checklist Review Report

Trước khi bàn giao script, mở report lên và kiểm:

- [ ] Tên test hiển thị bằng Tiếng Việt, **không** phải tên hàm
- [ ] Có Description giải thích test kiểm tra gì
- [ ] Có Severity + Tags + TC ID
- [ ] Test Body có step Arrange / Act / Assert, tên step đọc hiểu được
- [ ] Có ảnh `trang_thai_cuoi_cua_test` ở cuối **mọi** test PASSED
- [ ] Test FAILED có ảnh tại thời điểm fail
- [ ] **Không** có attachment `stdout` / `stderr`
- [ ] Toàn bộ output nằm trong `reports/` — root project sạch, không có `allure-results/` / `test-results/` / `playwright-report/` lạc ra ngoài
- [ ] `.gitignore` đã có `reports/`
- [ ] Mở report bằng CLI **cài trong project** (`npm run report` / `mvn allure:serve`) — máy chưa cài Allure vẫn chạy được
