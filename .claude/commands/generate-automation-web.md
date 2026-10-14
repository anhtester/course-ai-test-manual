---
description: Sinh automation web (Playwright / Selenium) — 2 mode TC (từ file test case web, mặc định) và FLOW (chưa có TC, chạy thật UI flow trên browser). Inspect DOM thật, sinh POM + test, chạy và tự sửa đến khi PASS 2 lần liên tiếp.
skills:
  - skills-qa-automation-engineer
  - skills-ui-debug-agent
  - skills-smart-locator-agent
  - skills-test-data-generator
---

# Workflow: Sinh Automation Web

> **BẮT BUỘC (MANDATORY SKILLS):** Bạn PHẢI nạp và đọc kỹ nội dung các skills sau trước khi bắt đầu:
> - **`skills-qa-automation-engineer`** (`.claude/skills/skills-qa-automation-engineer/SKILL.md`) — Quy tắc automation chung + workflow routing
> - **`skills-ui-debug-agent`** (`.claude/skills/skills-ui-debug-agent/SKILL.md`) — Inspect DOM, thu thập locators
> - **`skills-smart-locator-agent`** (`.claude/skills/skills-smart-locator-agent/SKILL.md`) — Sinh locator ổn định
> - **`skills-test-data-generator`** (`.claude/skills/skills-test-data-generator/SKILL.md`) — Sinh test data unique, traceable

Workflow đọc test case web (hoặc mô tả flow), tự mở browser inspect UI, thu thập locator thực tế, sinh automation script hoàn chỉnh (POM + Test), chạy và tự sửa lỗi cho đến khi PASS ổn định.

> Được gọi thẳng, hoặc qua bộ định tuyến `/generate-automation-from-testcases` khi file TC thuộc tầng `web/`. App mobile → `/generate-automation-mobile` · API → `/generate-automation-api`.

---

## 2 Chế độ (Mode)

| Mode | Đầu vào | Khi nào dùng | Neo RTM |
|---|---|---|---|
| **TC** (mặc định) | File test case web — `docs/testcases/<module>/web/test_cases_<module>_web.md` (hoặc file TC ngoài: MD/Excel/JSON) | Đã có TC — mỗi TC thành 1 test | ✅ `testId` = TC ID |
| **FLOW** | URL + mô tả thao tác bằng lời · hoặc video / ảnh chụp từng bước · hoặc chỉ URL | Chưa có TC, chỉ biết *"vào trang này, click cái kia"* | ⚪ Test mồ côi — xem Bước 5 |

**Agent tự chọn mode từ đầu vào** — có file TC → TC; chỉ có mô tả flow / URL → FLOW. User chỉ định thì theo user. **Công bố mode ở câu đầu**, kèm lý do một dòng.

## ⚠️ Nguyên tắc thực thi

- **Vai trò:** Agent đóng vai Senior Automation Engineer — tuân thủ Clean Code + POM
- **Tất cả output bằng Tiếng Việt**
- **TUYỆT ĐỐI KHÔNG ĐOÁN locator** — phải inspect DOM thực tế bằng MCP browser tools
- **Mode FLOW: phải chạy từng bước UI trên browser thật** trước khi sinh code
- **Desktop viewport headed theo `--viewport-size` lúc launch** — KHÔNG gọi `browser_resize` (xem `.claude/rules/playwright_rules.md` mục 1)
- ⚠️ **Rule E3 (CRITICAL):** Khi test FAIL → tự đọc log → phân tích → sửa code → chạy lại. **CẤM hỏi user trong quá trình fix lỗi.** Chỉ hỏi khi gặp business rule mâu thuẫn hoặc hết 5 vòng auto-heal
- **Artifact `task.md`** — PHẢI tạo để theo dõi tiến độ

## Input cần thu thập

| Input | Mode | Cách lấy | Độ ưu tiên |
|---|---|---|---|
| **File test cases** (MD/Excel/JSON/URL) | TC | User cung cấp path hoặc URL. Đưa file **index** `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → theo `## Bản đồ tài liệu` chỉ lấy file `web/` | ⭐ Bắt buộc |
| **Mô tả flow** (lời · video · ảnh) | FLOW | User cung cấp. Chỉ có URL → agent tự khám phá flow chính | ⭐ Bắt buộc |
| **URL ứng dụng** | Cả hai | User cung cấp hoặc trong TC | ⭐ Bắt buộc |
| **Credentials** (nếu cần login) | Cả hai | User cung cấp hoặc dùng fixture sẵn | Tùy chọn |
| **Tech stack** | Cả hai | Detect từ project; project mới thì hỏi (mặc định Playwright + TypeScript) | Tùy chọn |

Nếu user chưa cung cấp đủ → hỏi trước khi bắt đầu.

## Các bước thực hiện

### Bước 1: Khởi tạo, Phân tích & Lên Kế Hoạch

**Mode TC:**

1. **Đọc file test cases** do user cung cấp:
   - File local → `Read`
   - URL (Google Sheets, Confluence…) → lấy **bản gốc** (export CSV/XLSX rồi ủy quyền skill `xlsx`; Confluence thì nhờ user export). **KHÔNG** dùng `WebFetch` — kết quả đã qua xử lý, bảng TC dài bị cắt âm thầm. Không lấy được bản gốc → báo user và dừng
   - Xác định format: Markdown table, Excel, JSON, hoặc free-form text
2. **Parse test cases** và trích xuất:
   - Danh sách TC (ID, Title, Steps, Expected Results, Test Data, Priority)
   - Các page mà TC đi qua
   - Pre-conditions (login, setup data, navigate...)
   - Dependencies giữa các TC (nếu có)

**Mode FLOW:**

1. **Parse UI steps** từ user input — chuyển mô tả bằng lời thành danh sách bước có cấu trúc:
   ```
   Step 1: Navigate to https://example.com/login
   Step 2: Enter username "admin@test.com"
   Step 3: Enter password "***"
   Step 4: Click Login button
   Step 5: Verify dashboard is displayed
   ```

**Cả hai mode:**

3. **Xác định tech stack** (nếu chưa rõ):

   | Framework | Ngôn ngữ | Runner | Khi nào chọn |
   |---|---|---|---|
   | Playwright | TypeScript | Playwright Test | Mặc định cho web |
   | Playwright | Python | Pytest | Khi project dùng Python |
   | Selenium | Java | TestNG | Khi user yêu cầu Java |

4. **Tạo artifact `task.md`** để theo dõi tiến độ:
   ```markdown
   # Automation Web — Progress (mode TC)
   - [x] Bước 1: Phân tích test cases
   - [ ] Bước 2: Khảo sát UI (MCP Recon)
   - [ ] Bước 3: Thiết kế POM
   - [ ] Bước 4: Chuẩn bị test data
   - [ ] Bước 5: Sinh automation scripts
   - [ ] Bước 6: Chạy test + Auto-heal

   ## Test Cases to Automate
   | TC ID | Title | Pages | Priority | Status |
   |---|---|---|---|---|
   | TC01 | Login thành công | LoginPage, DashboardPage | P1 | ⏳ |
   | TC02 | Login sai password | LoginPage | P1 | ⏳ |
   ```

### Bước 2: Khảo sát UI bằng MCP (Recon)

1. **Mở browser** bằng MCP:
   ```
   browser_navigate → URL ứng dụng
   browser_wait_for → page load hoàn tất
   browser_snapshot → thu thập DOM
   ```

2. **Mode TC — với mỗi page trong test cases:**
   - `browser_snapshot` → đọc accessibility tree
   - Xác định tất cả elements cần tương tác (inputs, buttons, links, dropdowns...)
   - Thu thập locator tốt nhất cho mỗi element (theo priority trong skill `skills-smart-locator-agent`)
   - Verify locator bằng cách thử tương tác (`browser_click`, `browser_type`)

   **Mode FLOW — thực thi từng bước theo danh sách, với mỗi bước:**
   ```
   a. browser_snapshot → đọc DOM, xác định element cần tương tác
   b. Xác định locator tốt nhất (theo locator priority)
   c. Thực thi action (click / type / select / hover)
   d. browser_snapshot → xác nhận kết quả action
   e. Ghi nhận vào bảng Locator Collection
   ```
   Chụp screenshot evidence ở các mốc: sau khi login thành công · sau khi hoàn thành flow chính · khi gặp lỗi/unexpected state.

3. **Ghi nhận vào bảng Locator Collection:**

   | Page | Element | Action | Primary Locator | Fallback Locator | Verified |
   |---|---|---|---|---|---|
   | LoginPage | Email input | Type | `getByLabel('Email')` | `#email` | ✅ |
   | LoginPage | Password input | Type | `getByLabel('Password')` | `#password` | ✅ |
   | LoginPage | Login button | Click | `getByRole('button', {name: 'Login'})` | `button[type=submit]` | ✅ |
   | DashboardPage | Welcome text | Assert | `getByRole('heading', {name: /Welcome/})` | `.welcome-header` | ✅ |

4. **Locator Priority** (tuân thủ `.claude/rules/locator_strategy.md`):
   - **Playwright:** `getByRole()` → `getByLabel()` → `getByPlaceholder()` → `getByText()` → `getByTestId()` → CSS → XPath
   - **Selenium:** `id` → `data-testid` → `name` → CSS selector → XPath

5. **Xử lý tình huống:**

   | Tình huống | Cách xử lý |
   |---|---|
   | URL bị chặn / cần VPN | Thông báo user |
   | Cần đăng nhập | Dùng fixture sẵn có hoặc hỏi user credentials |
   | Element không tìm thấy | Snapshot lại → thử locator khác → báo user nếu DOM thay đổi |
   | Page chưa load xong | `browser_wait_for` text/element → retry |
   | Modal/popup xuất hiện | Xử lý popup trước → tiếp tục flow |
   | Redirect/navigation | `browser_snapshot` lại ở page mới |
   | Cần scroll | `browser_evaluate` → scrollIntoView |
   | CAPTCHA / 2FA | Thông báo user — không thể automate |
   | Dynamic content / SPA | `browser_wait_for` text cụ thể trước khi snapshot |

6. **TUYỆT ĐỐI KHÔNG SUY ĐOÁN selector** — mọi locator phải verified trên DOM thực tế.

### Bước 3: Thiết kế POM (Page Object Model)

1. **Xác định danh sách Page classes** cần tạo:
   - Mỗi page trong test flow → 1 Page class
   - Xem xét tạo `BasePage` nếu chưa có trong project

2. **Sinh Page Object classes:**

   **Cấu trúc mỗi Page class:**
   ```
   - Locators (khai báo ở đầu class — từ Bước 2)
   - Constructor (nhận page/driver instance)
   - Action methods (mô tả hành vi user, không mô tả DOM)
   - Verification methods (kiểm tra state/text sau action)
   ```

   **Playwright TypeScript:**
   ```typescript
   // src/pages/login.page.ts
   import { Page, Locator } from '@playwright/test';

   export class LoginPage {
     readonly page: Page;
     readonly emailInput: Locator;
     readonly passwordInput: Locator;
     readonly loginButton: Locator;

     constructor(page: Page) {
       this.page = page;
       this.emailInput = page.getByLabel('Email');
       this.passwordInput = page.getByLabel('Password');
       this.loginButton = page.getByRole('button', { name: 'Login' });
     }

     async login(email: string, password: string) {
       await this.emailInput.fill(email);
       await this.passwordInput.fill(password);
       await this.loginButton.click();
     }
   }
   ```

   **Selenium Java:**
   ```java
   // src/main/java/.../pages/LoginPage.java
   public class LoginPage extends BasePage {
     @FindBy(id = "email")
     private WebElement emailInput;

     @FindBy(id = "password")
     private WebElement passwordInput;

     @FindBy(css = "button[type='submit']")
     private WebElement loginButton;

     public void login(String email, String password) {
       waitAndType(emailInput, email);
       waitAndType(passwordInput, password);
       waitAndClick(loginButton);
     }
   }
   ```

   **Nguyên tắc:**
   - Method name mô tả hành vi: `login()`, `fillRegistrationForm()`, không phải `clickButton()`
   - Không hardcode waits — chỉ smart waits
   - Locator lấy từ Bước 2 (đã verify) — KHÔNG ĐOÁN
   - Return `this` hoặc next page object cho method chaining (nếu phù hợp)

3. **Kiểm tra project structure hiện tại:**
   - Nếu project đã có `pages/` → sinh file vào đúng thư mục
   - Nếu project mới → tạo structure theo skill `skills-framework-architect`
   - Không tạo duplicate — kiểm tra page đã tồn tại chưa trước khi tạo mới

### Bước 4: Chuẩn bị Dữ liệu (Test Data Strategy)

1. **Phân tích test data** từ test cases / flow:
   - Data nào cần **unique per run** (email, username, ID) → sinh random + traceable
   - Data nào **cố định** (URL, config values) → đọc từ env/config
   - Data nào cần **nhiều bộ** (data-driven) → tạo file external (JSON/YAML)

2. **Sinh test data utilities** (dùng skill `skills-test-data-generator`):
   ```
   Format: <prefix>_<testName>_<timestamp>
   Ví dụ:
   - Email:    auto_login_1712049200@test.com
   - Username: auto_user_1712049200
   - Code:     TC_REG_1712049200
   ```

3. **Sensitive data** (credentials):
   - Đọc từ env variables hoặc config file
   - **KHÔNG hardcode** trong test code
   - **KHÔNG đọc .env trực tiếp** (quy tắc bảo mật)

### Bước 5: Sinh Automation Scripts (Test Classes)

1. **Tạo test classes** — mỗi TC (mode TC) hoặc mỗi flow (mode FLOW) → 1 test; nhóm TC liên quan chung 1 file:

   ```
   Setup (Arrange):
   - Khởi tạo page objects
   - Chuẩn bị test data
   - Navigate đến trang cần test
   - Login (nếu cần, qua fixture)

   Execution (Act):
   - Thực hiện các bước theo test case / flow
   - Gọi methods từ Page Objects

   Verification (Assert):
   - Assert kết quả với expected results
   - Assertion message rõ ràng, dễ debug khi fail
   ```

2. **Assertions bắt buộc:**
   - Mỗi test PHẢI có ít nhất 1 assertion
   - Assert message mô tả rõ: `"Expected dashboard to show after login"`
   - Dùng soft assertions khi cần check nhiều điểm
   - Timeout phù hợp (không để default quá ngắn)

3. **Nguyên tắc code:**
   - Không `waitForTimeout()` / `Thread.sleep()` — chỉ smart waits
   - Không inline locator trong test — locator trong Page class
   - Import gọn gàng — không unused imports
   - Test independent — không phụ thuộc thứ tự chạy
   - Cleanup/teardown nếu test tạo data

4. **Tích hợp Report (BẮT BUỘC — tuân thủ `.claude/rules/reporting_rules.md`):**

   | Mục | Mode TC — lấy từ manual TC | Mode FLOW |
   |---|---|---|
   | **Tên test** (Tiếng Việt) | Tiêu đề của TC — KHÔNG dùng tên hàm | Mô tả hành vi của flow |
   | **Description** | Mục tiêu / Điều kiện tiên quyết của TC | Flow làm gì, kỳ vọng gì |
   | **Severity** | Mức độ ưu tiên của TC (`blocker`/`critical`/`normal`/`minor`) | Agent đề xuất theo mức rủi ro của flow |
   | **Tags** | Nhóm chạy (`smoke`, `regression`) + tên module | Như bên trái |
   | **TC ID** (label `testId`) | Mã TC gốc → phục vụ RTM | `FLOW_<MODULE>_<nnn>` — xem cảnh báo dưới |

   ⚠️ **Mode FLOW KHÔNG cấp mã theo mẫu TC ID thật** (`<HỆ_THỐNG>_<MODULE>_TC_<nnn>`). Dải đó thuộc tầng test case — cấp tạm ở đây là **đụng mã** khi TC thật được sinh sau, mà TC ID là bất biến. Dùng `FLOW_<MODULE>_<nnn>` để RTM nhận ra ngay đây là test mồ côi ⚪, và báo user ở bàn giao: muốn neo RTM thì sinh TC cho flow này rồi đổi label sang TC ID thật.

   - **Test Body:** bọc mỗi giai đoạn bằng step có tên Tiếng Việt — `Arrange: ...` / `Act: ...` / `Assert: ...`. Mode TC: mỗi **Step** trong manual TC → 1 step trong report. Mode FLOW: mỗi bước đã chạy ở Bước 2 → 1 step
   - **Method của Page Object** đánh dấu step API (`@Step` / `test.step` / `@allure.step`) để sinh sub-step tự động
   - **Screenshot:** đính kèm ảnh trạng thái cuối trong teardown cho **MỌI** test — PASS đặt tên `trang_thai_cuoi_cua_test`, FAIL đặt `trang_thai_khi_that_bai`
   - **KHÔNG** để report sinh attachment `stdout` / `stderr` (pytest: thêm `--allure-no-capture`)
   - **Output gom vào `reports/`:** allure-results · allure-report · allure-report-single · html · logs · screenshots. Nếu project đã có framework, tuân theo cấu hình sẵn có; nếu output đang rải ở root thì gom lại

   Code mẫu đầy đủ: `.claude/skills/skills-framework-architect/references/CODE_TEMPLATES.md` § 7.

### Bước 6: Chạy Thử Nghiệm & Tự Sửa Lỗi (Execution & Auto-Heal — RULE E3)

1. **Chạy test:**
   ```bash
   # Playwright TS
   npx playwright test <test_file> --headed

   # Playwright Python
   python -m pytest <test_file> --headed

   # Selenium Java
   mvn test -Dtest=<TestClass>
   ```
   Test chạy lâu → `run_in_background: true`, nhận thông báo khi xong. **KHÔNG** poll bằng `sleep`.

2. **Nếu PASS:** chạy lại **1 lần nữa** để confirm stability · cập nhật `task.md` · cleanup debug logs, commented code

   **Nếu FAIL → Vào vòng lặp Auto-Heal:**

   ```
   WHILE test FAIL (tối đa 5 vòng):
     1. Đọc error log / stack trace → xác định step fail
     2. Phân loại lỗi:

        | Lỗi | Hành động |
        |---|---|
        | Element not found | Mở MCP → snapshot → verify/thay locator |
        | Click intercepted | Chờ overlay biến mất → retry click |
        | Timeout | Thêm wait condition theo trạng thái — KHÔNG thêm sleep |
        | Assertion fail | Kiểm tra expected value vs actual — xem luật dưới |
        | Navigation error | Kiểm tra URL, redirect, page load |
        | Test data conflict | Sinh data unique mới |
        | Import/compile error | Sửa import, check class name |

     3. Sửa code
     4. Chạy lại test
     5. Ghi log vào task.md: "Vòng 2: Fix locator XYZ → PASS"
   ```

   ⚠️ **Assertion fail vì ứng dụng làm sai so với TC → KHÔNG sửa kỳ vọng cho xanh.** Giữ assertion, đánh dấu test đang phơi bug, đề xuất `/create-bug-report`. Chỉ sửa assertion khi chính test viết sai so với TC.

3. **⚠️ Rule E3 — CẤM HỎI USER khi fix lỗi.** Chỉ được hỏi khi:
   - Business logic mâu thuẫn (TC nói A nhưng app hiển thị B)
   - Server/app không accessible · cần CAPTCHA
   - Đã hết 5 vòng auto-heal mà vẫn fail

4. **Verify stability** — test phải PASS **2 lần liên tiếp**:
   ```bash
   # Playwright
   npx playwright test <test_file> --repeat-each=2 --retries=0

   # Pytest
   python -m pytest <test_file> --count=2
   ```

### Bước 7: Cleanup & Delivery

1. **Code cleanup** (bắt buộc):
   - [ ] Xóa `console.log()` / `print()` / debug log tạm
   - [ ] Xóa locator không còn sử dụng
   - [ ] Xóa commented-out code
   - [ ] Không còn `waitForTimeout()` / `Thread.sleep()`
   - [ ] Không còn hardcoded test data (email, password)
   - [ ] Import gọn gàng — không unused imports

2. **Cập nhật artifact `task.md`** với kết quả cuối:
   ```markdown
   ## Kết Quả
   | TC ID | Title | Status | Stability | Ghi chú |
   |---|---|---|---|---|
   | TC01 | Login thành công | ✅ PASS | 2/2 stable | — |
   | TC02 | Login sai password | ✅ PASS | 2/2 stable | — |
   | TC03 | Đăng ký tài khoản | ⚠️ SKIP | — | Cần CAPTCHA |

   ## Files Created
   - src/pages/login.page.ts
   - src/pages/dashboard.page.ts
   - src/tests/login.spec.ts
   ```

3. **Báo cáo** cho user:
   - Mode đã chạy · Tổng: X PASS / Y FAIL (phơi bug) / Z SKIP
   - Danh sách files đã tạo/sửa
   - Known issues / limitations
   - Bảng Locator Collection (reference)
   - Mode FLOW: danh sách test mồ côi `FLOW_*` + đề xuất sinh TC để neo RTM

## Output

- **Artifact `task.md`** — checklist tiến độ + kết quả chạy test
- **Page Object classes** — 1 file per page, locators verified từ DOM
- **Test classes** — automation scripts hoàn chỉnh, đã PASS 2 lần liên tiếp
- **Test data utilities** — generators cho data unique + traceable
- **Bảng Locator Collection** — tất cả elements + primary/fallback locators
- **Evidence screenshots** (mode FLOW) — chụp tại các milestone quan trọng
- **Báo cáo kết quả** — PASS/FAIL/SKIP summary
