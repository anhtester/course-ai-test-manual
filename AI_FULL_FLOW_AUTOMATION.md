# 🤖 AI Full Flow — Automation Testing

> Quy trình đầy đủ dùng AI cho **Automation Testing**, từ chưa có dòng code nào → khung dự án → script chạy xanh → bảo trì khi UI/requirements đổi → chứng minh độ phủ.
>
> **Nối tiếp** [`AI_FULL_FLOW_MANUAL.md`](AI_FULL_FLOW_MANUAL.md): flow manual dừng ở bộ test case đã review; flow này biến bộ đó thành script.

---

## Điểm nối với flow Manual

| `AI_FULL_FLOW_MANUAL.md` | | `AI_FULL_FLOW_AUTOMATION.md` (file này) |
|---|:---:|---|
| chặng 1 — requirements → REQ ID | | chặng 1 — sinh POM + test class, PASS 2 lần |
| chặng 2 — test cases → TC ID | ──▶ | chặng 2 — review automation code |
| chặng 3 — review TC | | chặng 6 — RTM nối REQ → TC → script |
| **REQ ID là mắt xích** | | **TC ID là mắt xích** |

**Automation nối vào chuỗi truy vết bằng `TC ID`**, không phải bằng tên file test. Mỗi script phải mang label `testId` đúng mã TC gốc (`allure.label('testId', 'CRM_LOGIN_TC_001')`). Đứt mắt xích này thì chặng 6 không map được script về requirement — coverage automation trở thành số đoán.

**Điều kiện vào flow này:**

| Tình huống | Vào từ đâu |
|---|---|
| Đã có bộ TC review xong (flow manual chặng 3) | ✅ Đường chính — chặng 0 → 1 |
| Chưa có TC, chỉ biết "vào trang này click cái kia" (web) hoặc "mở app, đăng nhập, tạo đơn" (mobile) | Chặng 1 · `/generate-automation-web` hoặc `/generate-automation-mobile` **mode FLOW** — script mang `testId` = `FLOW_<MODULE>_<nnn>`, RTM sẽ báo test mồ côi ⚪ |
| Hệ thống API, mới có spec (Swagger / Scalar / Postman) | Sinh TC trước bằng `/generate-testcases-api` (flow manual chặng 2) → rồi chặng 1 · `/generate-automation-api`. Không sinh code thẳng từ spec. Muốn TC có REQ neo vào thì chạy `/generate-requirements-from-api` trước nữa |

> ⚠️ **Đừng automate bộ TC chưa qua `/review-testcases`.** TC mơ hồ sinh ra script sai kỳ vọng, và cái sai đó chạy tự động mỗi ngày. Sửa TC thì rẻ, sửa script đã viết xong thì đắt gấp nhiều lần.

---

## Toàn cảnh 8 chặng

```
┌─ DỰNG KHUNG ─────────────────────────────────────────────────────┐
│  0. /generate-automation-framework      → project + base + CI    │  1 lần / dự án
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ SINH SCRIPT ────────────────────────────────────────────────────┐
│  1. /generate-automation-from-testcases → tự nhận nền tảng file  │  N lần = số module
│     ├─ /generate-automation-web         → POM + test (Playwright)│  × số nền tảng
│     ├─ /generate-automation-mobile      → Screen Object + Appium │
│     └─ /generate-automation-api         → client + API test      │
│     PASS 2 lần liên tiếp mới xong                                │
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ KIỂM CHẤT LƯỢNG CODE ───────────────────────────────────────────┐
│  2. /review-automation-code             → rubric 6 nhóm, bắt pass│  1 lần / bộ script
│                                            giả & hard sleep      │
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ CHẠY & XỬ LÝ ĐỎ ────────────────────────────────────────────────┐
│  3. /run-and-fix-tests                  → chạy, phân loại, tự sửa│  Mỗi đợt regression
│  4. /analyze-test-report                → gom nhóm root cause    │
│     /create-bug-report                  → bug app, KHÔNG sửa test│  ↻ tới khi hết bug
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ BẢO TRÌ ────────────────────────────────────────────────────────┐
│  5. /heal-locators               (UI đổi)                        │  Khi có tín hiệu
│     /analyze-flaky-tests         (lúc pass lúc fail)             │  tương ứng
│     /update-automation-from-impact (TC đã đồng bộ)               │
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ CHỨNG MINH & BÁO CÁO ───────────────────────────────────────────┐
│  6. /generate-traceability-matrix       → cột automation của RTM │  Trước release
│  7. /import-test-results-xray           → đẩy kết quả lên Xray   │  Nếu dùng Jira/Xray
└──────────────────────────────────────────────────────────────────┘
```

---

## Chặng 0 — Dựng khung Automation Framework

> **Chạy 1 lần cho cả dự án.** Dự án đã có framework thì **bỏ qua chặng này**, vào thẳng chặng 1.

```
/generate-automation-framework
```

📋 Prompt mẫu: [`prompt_03_create_framework_playwright.txt`](prompts/prompt_03_create_framework_playwright.txt) · [`selenium`](prompts/prompt_03_create_framework_selenium.txt) · [`appium`](prompts/prompt_03_create_framework_appium.txt)

**⏸️ Checkpoint** — AI hỏi và **chờ xác nhận** trước khi scaffold: platform (Web/Mobile/API) · framework · ngôn ngữ · reporting. Đây là chỗ duy nhất trong flow được chọn stack; chốt sai thì chặng 1 trở đi phải làm lại từ đầu.

**Ba thứ AI KHÔNG hỏi vì luôn bật:** **parallel** (mặc định 5 luồng) · **số luồng chỉnh ở 1 chỗ** (`WORKERS` / `thread-count` / `-n`) · **CI/CD GitHub Actions**. Bật parallel từ đầu ép test độc lập ngay từ dòng code đầu tiên — bật sau là lộ hàng loạt test phụ thuộc nhau.

**Đầu ra:** project structure + build config + `BasePage`/`BaseTest` + `DriverFactory` thread-safe + `TestDataGenerator` + example test + **workflow GitHub Actions** + `README.md`.

### Kiểm trước khi sang chặng 1

- [ ] Framework **build được** (`npm install && npx playwright test --list` / `mvn clean compile`)
- [ ] Example test chạy được — hoặc ghi rõ trong README lý do chưa chạy được
- [ ] Base class có **smart wait**, không hard sleep
- [ ] **Parallel bật sẵn 5 luồng** — chạy thử thấy nhiều worker/thread trong log; example test PASS khi chạy song song 2 lần liên tiếp
- [ ] Driver/browser **theo thread** (`ThreadLocal` với Java), không static mutable dùng chung
- [ ] **`.github/workflows/` có workflow chạy được** — headless, `WORKERS` khai ở cấp workflow, upload `reports/` với `if: always()`
- [ ] Base class đánh dấu **step API** (`test.step` / `@Step` / `@allure.step`) → sub-step tự sinh trong report
- [ ] Teardown attach ảnh trạng thái cuối cho **MỌI** test (PASS lẫn FAIL)
- [ ] Toàn bộ output trỏ vào **`reports/`** — root sạch, không có `allure-results/` · `test-results/` · `playwright-report/` lạc ra ngoài
- [ ] **Allure cài cục bộ trong project** — `npm run report` / `mvn allure:serve` mở được report trên máy **chưa từng cài Allure**. Không ai phải `scoop`/`brew`/`choco install allure`
- [ ] `.gitignore` đã chặn `reports/` và `.allure/`
- [ ] Locator placeholder (nếu chưa có URL) đã đánh `⚠️ PLACEHOLDER` **và** liệt kê trong README

> Chi tiết chuẩn report: [`.claude/rules/reporting_rules.md`](.claude/rules/reporting_rules.md).

---

## Chặng 1 — Sinh Automation Scripts

> **Chạy lặp, mỗi lần một module × một nền tảng.** Cửa vào chung là `/generate-automation-from-testcases` — nó đọc đường dẫn file TC (`<module>/web/` · `mobile/` · `api/`) rồi chuyển sang đúng command nền tảng. Biết rõ nền tảng thì gọi thẳng command đó cũng được.

| Có gì trong tay | Command | Prompt mẫu | Chạy trên |
|---|---|---|---|
| **File TC, nền tảng nào cũng được** (đường chính) | `/generate-automation-from-testcases` — bộ định tuyến, mode WEB (mặc định) / MOBILE / API | [`prompt_05`](prompts/prompt_05_convert_manual_to_automation.txt) | Tự nhận từ đường dẫn file TC |
| File TC **web** | `/generate-automation-web` mode TC | [`prompt_04 PW`](prompts/prompt_04_generate_script_playwright.txt) · [`prompt_04 SE`](prompts/prompt_04_generate_script_selenium.txt) | Playwright MCP |
| File TC **mobile** | `/generate-automation-mobile` mode TC | [`prompt_26`](prompts/prompt_26_generate_automation_mobile_flow.txt) | Appium MCP — Native Android/iOS, **Flutter**, Hybrid |
| File TC **API** | `/generate-automation-api` | [`prompt_31`](prompts/prompt_31_generate_automation_api.txt) | REST Assured / Playwright API / Pytest / Supertest |
| **Chưa có TC** — web | `/generate-automation-web` mode FLOW | — | Mô tả thao tác bằng lời hoặc chỉ URL |
| **Chưa có TC** — app | `/generate-automation-mobile` mode FLOW | [`prompt_26`](prompts/prompt_26_generate_automation_mobile_flow.txt) | App (`.apk`/`.ipa`) + flow mô tả |
| **Chưa có TC** — API | Sinh TC trước: `/generate-testcases-api` | [`prompt_09`](prompts/prompt_09_generate_api_tests.txt) | Rồi quay lại dòng *File TC API* |

> 📱 **App Flutter:** việc đầu tiên là nhận diện app đã bật **semantics** chưa — chưa bật thì hierarchy chỉ có một node `FlutterView` rỗng và **không có element nào để tìm**. Đây là thoả thuận với dev, không phải việc QA xoay được bằng locator giỏi. Xem [`appium_rules.md`](.claude/rules/appium_rules.md) mục 3.

**AI làm gì:**

| Nền tảng | Các bước |
|---|---|
| **Web** | đọc & parse TC → mở browser MCP **inspect DOM thật** thu locator → thiết kế POM → sinh test data unique/traceable → sinh test class kèm Allure metadata → chạy + **auto-heal** đến khi PASS **2 lần liên tiếp** |
| **Mobile** | mở phiên Appium → **nhận diện loại app** (Native / Flutter / Hybrid) → đi theo từng bước TC trên thiết bị, thu locator từ hierarchy → Screen Object **tách Android/iOS** → test + Allure metadata → chạy + auto-heal, PASS 2 lần |
| **API** | đọc TC API + `api_map.md` + snapshot spec → client · DTO · fixture token · **fixture 2 tài khoản** cho BOLA → mỗi TC một test, attach request/response đã che → chạy + auto-heal → **dọn dữ liệu** đã tạo |

**⚠️ Ba luật của chặng này**

| Luật | Vì sao |
|---|---|
| **TUYỆT ĐỐI KHÔNG đoán locator** | Mọi locator phải verify trên DOM thực tế. Locator đoán ra chạy được hôm nay chỉ là may |
| **Rule E3 — test FAIL thì AI tự sửa, KHÔNG hỏi user** | Tối đa 5 vòng auto-heal. Chỉ được hỏi khi business rule mâu thuẫn (TC nói A, app hiện B), app không truy cập được, hoặc hết 5 vòng |
| **PASS 1 lần chưa tính là xong** | Phải PASS **2 lần liên tiếp** (`--repeat-each=2 --retries=0`) mới coi là ổn định |

**Đầu ra:**
```
src/pages/<module>.page.ts        ← POM web, locator đã verify
src/screens/<Module>Screen.java   ← Screen Object mobile, locator tách Android/iOS
src/api/<Resource>Client.java     ← API client + DTO
src/tests/…                       ← test có label testId = TC ID, step Arrange/Act/Assert
src/utils/…                       ← test data generator
task.md                           ← checklist tiến độ + bảng kết quả từng TC
```

**Phụ trợ khi cần:**

| Cần gì | Command | Prompt mẫu |
|---|---|---|
| Locator cho 1 element cụ thể | `/generate-locator` | — |
| Bộ test data nhiều biến thể | `/generate-test-data` | [`prompt_07`](prompts/prompt_07_generate_test_data.txt) |
| Test UI độc lập backend, tái hiện lỗi 500/timeout/data rỗng | `/generate-api-mocks` | [`prompt_14`](prompts/prompt_14_generate_api_mocks.txt) |

---

## Chặng 2 — Review Automation Code

```
/review-automation-code
```

📋 Prompt mẫu: [`prompts/prompt_06_review_automation_code.txt`](prompts/prompt_06_review_automation_code.txt)

| Mode | Làm gì |
|---|---|
| **REVIEW** (mặc định) | Chấm rubric 6 nhóm: Sạch · POM & cấu trúc · Wait strategy · Test data · Report (Allure) · Assertion & độc lập. Mỗi điểm trừ kèm `file:line` + trích nguyên văn |
| **FIX** | Như trên + sửa code sau khi user duyệt danh sách, rồi **chạy lại** để chứng minh không làm hỏng test đang xanh |

Nói *"sửa luôn"* / *"dọn giùm"* → AI tự chuyển sang **FIX**.

> **Suite xanh không chứng minh được chất lượng.** Chặng này tồn tại để bắt đúng thứ màu xanh che đi: assertion yếu (**pass giả**), hard sleep, locator inline trong test, report rỗng không có step/screenshot, test phụ thuộc thứ tự chạy.

---

## Chặng 3 — Chạy suite & tự sửa

```
/run-and-fix-tests
```

📋 Prompt mẫu: [`prompts/prompt_17_run_and_fix_tests.txt`](prompts/prompt_17_run_and_fix_tests.txt)

| Mode | Làm gì |
|---|---|
| **RUN** (mặc định) | Chạy suite (toàn bộ / theo tag / theo module) → phân loại failure theo root cause → đề xuất |
| **FIX** | Như RUN + tự sửa nhóm sửa được + chạy lại (tối đa 3 vòng, không hỏi lại giữa chừng) |

**Headless được phép** ở chặng này — suite đã debug PASS từ chặng 1. Chỉ mở headed khi cần inspect DOM.

### 🚨 Luật quan trọng nhất của cả flow

> **CẤM sửa test cho xanh khi nguyên nhân là bug của app.**
>
> Không nới lỏng assertion · không đổi expected theo actual · không thêm retry để né · không `skip` / `.only` / `@Ignore` để giấu.
>
> Nhóm 🐛 App Bug **luôn giữ nguyên đỏ** và chuyển sang `/create-bug-report`.

Lỗi 🌐 Environment (mạng, môi trường sập, thiếu credential) → **DỪNG, báo user**. Không sửa test để né môi trường hỏng.

---

## Chặng 4 — Xử lý FAIL

| Tình huống | Command | Prompt mẫu | Ghi chú |
|---|---|---|---|
| **Đã có report**, nhiều test đỏ chưa rõ nguyên nhân | `/analyze-test-report` nhánh AUTOMATION | [`prompt_11`](prompts/prompt_11_analyze_test_report.txt) | Đọc report có sẵn, **không chạy lại** — 20 test đỏ thường chỉ 2–3 nguyên nhân |
| Đã rõ là bug app | `/create-bug-report` | [`prompt_10`](prompts/prompt_10_create_bug_report.txt) | Tự lấy evidence từ `reports/`, tùy chọn đẩy Jira |
| Đỏ vì locator gãy hàng loạt | `/heal-locators` | [`prompt_18`](prompts/prompt_18_heal_locators.txt) | Xem chặng 5 |
| Lúc pass lúc fail | `/analyze-flaky-tests` | [`prompt_08`](prompts/prompt_08_analyze_flaky_tests.txt) | Xem chặng 5 |

**Phân biệt `run-and-fix-tests` với `analyze-test-report`:**

| | `/run-and-fix-tests` | `/analyze-test-report` |
|---|---|---|
| Điểm bắt đầu | Suite code, **chưa chạy** | Report **đã có** |
| Có chạy test không | ✅ Chạy, và chạy lại sau khi sửa | ❌ Chỉ đọc |
| Có sửa code không | ✅ Mode FIX | ❌ Chỉ đề xuất |

---

## Chặng 5 — Bảo trì

Ba workflow, **ba tín hiệu khác nhau**. Chọn sai là chữa nhầm bệnh:

| Tín hiệu bạn thấy | Command | Prompt mẫu | Mode |
|---|---|---|---|
| **UI vừa deploy bản mới**, locator gãy đồng loạt (chưa cần chạy test cũng biết) | `/heal-locators` | [`prompt_18`](prompts/prompt_18_heal_locators.txt) | SCAN → HEAL |
| **Test lúc pass lúc fail**, code không đổi | `/analyze-flaky-tests` | [`prompt_08`](prompts/prompt_08_analyze_flaky_tests.txt) | ANALYZE → FIX |
| **Requirements đổi** — TC đã đồng bộ bằng `/update-testcases-from-impact` | `/update-automation-from-impact` | [`prompt_19`](prompts/prompt_19_update_automation_from_impact.txt) | PLAN → APPLY |

### `/heal-locators` — UI đổi

Đối chiếu locator trong Page Object với DOM thực tế, bắt cả 3 loại: đã gãy · sắp gãy (dynamic class `css-1a2b3c`, XPath vị trí) · **match sai element** (nguy hiểm nhất — vẫn xanh nhưng test sai chỗ).

Chạy **headed** toàn bộ. Locator mới phải match **đúng 1 element** và **đúng element cần thao tác**.

### `/update-automation-from-impact` — requirements đổi

Mắt xích **cuối** của chuỗi delta 3 tầng:

```
/update-requirements-from-ticket   → requirements/<module>/impact/impact_<TICKET-ID>.md
/update-testcases-from-impact      → testcases/<module>/impact/delta_tc_<TICKET-ID>.md         ← BẮT BUỘC chạy trước (mode APPLY)
/update-automation-from-impact     → testcases/<module>/impact/automation_plan_<TICKET-ID>.md  ← workflow này
```

> ⚠️ **Bỏ tầng giữa là sửa script theo kỳ vọng cũ.** File test cases là nguồn sự thật của kỳ vọng mới; TC còn mô tả hành vi cũ thì script sửa xong vẫn sai — và test vẫn **xanh**, nên không ai phát hiện. Vì vậy workflow này **chỉ nhận `delta_tc_<TICKET-ID>.md`** — đưa Impact Report mà chưa có file đó thì nó dừng.

**Tách theo nền tảng.** Delta TC List có cột `Nền tảng` — workflow sửa và chạy lại **từng nền tảng một lượt**, gọi lại đúng bước recon của command nền tảng:

| Nền tảng | Recon phần bị đổi | Chạy lại |
|---|---|---|
| **web** | Playwright MCP inspect DOM (`/generate-automation-web` Bước 2) | PASS 2 lần + hồi quy mọi test dùng Page Object vừa sửa |
| **mobile** | Appium MCP — nhận diện lại loại app, thu locator **riêng Android / iOS** (`/generate-automation-mobile` Bước 1–3) | PASS 2 lần **mỗi nền tảng** TC gắn tag + hồi quy mọi test dùng Screen vừa sửa |
| **api** | DTO theo snapshot spec, gọi thật chỉ khi `Gọi API` ✅ (`/generate-automation-api`) | PASS 2 lần + hồi quy mọi test dùng client/DTO vừa sửa, dọn dữ liệu |

| Luật | Vì sao |
|---|---|
| 🚨 **CẤM sinh lại cả file/module** | Chỉ sửa đúng dòng liên quan TC đã đổi. Sinh lại là xoá sạch mọi fix đã tích luỹ |
| 🚨 **CẤM xoá file script** của TC 🗑️ Deprecated | Skip kèm lý do + mã ticket (vẫn hiện `SKIPPED` trong report), chờ user xác nhận mới gỡ |
| 🚨 **CẤM sửa script của TC `⏸️ @NeedsVerify`** | TC đó chưa được sửa vì thiếu bằng chứng màn hình mới — sửa script là đi trước TC |
| **Giữ nguyên `testId`** sau khi sửa | Đứt TC ID là vỡ RTM |
| TC **mới hoàn toàn** (`➕ Mới`) → route sang command nền tảng (hoặc `/generate-automation-from-testcases`) | Trộn hai việc là mất lý do tồn tại của delta mode |
| Nền tảng không chạy được trên máy này (iOS ngoài macOS, thiếu device) → ghi `⚠️ chưa chạy` | Không chạy thì không được tính là PASS |

---

## Chặng 6 — Ma trận truy vết (cột automation)

```
/generate-traceability-matrix
```

📋 Prompt mẫu: [`prompts/prompt_13_generate_traceability_matrix.txt`](prompts/prompt_13_generate_traceability_matrix.txt)

Cùng một command với flow manual, nhưng ở đây đọc **tầng 3**: REQ → TC → **script**.

| Ký hiệu | Nghĩa | Ai xử lý |
|---|---|---|
| 🔴 | REQ chưa có TC nào cover | Quay về flow manual chặng 2 |
| 🟡 | **TC chưa được automate** | Quay lại chặng 1 của flow này |
| ⚪ | **Test mồ côi** — script không map về TC/REQ nào | Gắn label `testId`, hoặc bổ sung TC gốc |

> ⚪ thường sinh ra từ **mode FLOW** của `/generate-automation-web` / `-mobile` (viết script khi chưa có TC — `testId` = `FLOW_<MODULE>_<nnn>`) hoặc từ script quên gắn `testId`. Cả hai đều làm coverage automation thành số không kiểm chứng được — sinh TC cho flow đó rồi đổi label sang TC ID thật.

Xem trực quan bằng [`scripts/execution-viewer/bundle.html`](scripts/execution-viewer/README.md) — kéo thả `docs/traceability/traceability_matrix.md` vào, nó chỉ ra REQ nào mới automate **một phần**.

---

## Chặng 7 — Đẩy kết quả lên Xray

```
/import-test-results-xray
```

Chỉ chạy khi dự án dùng Jira/Xray. Cần lấy requirements/ticket từ Jira thì dùng `/fetch-jira-requirements`.

---

## Bảng tra nhanh — chạy bao nhiêu lần

| Chặng | Command | Prompt mẫu | Số lần chạy |
|---|---|---|---|
| 0 | `/generate-automation-framework` | [`prompt_03`](prompts/prompt_03_create_framework_playwright.txt) | **1 lần** / dự án (bỏ qua nếu đã có framework) |
| 1 | `/generate-automation-from-testcases` | [`prompt_05`](prompts/prompt_05_convert_manual_to_automation.txt) | **N lần** = số module × nền tảng — tự chuyển tới 3 command dưới |
| 1 · web | `/generate-automation-web` | [`prompt_04`](prompts/prompt_04_generate_script_playwright.txt) | Mode TC · mode FLOW khi chưa có TC |
| 1 · mobile | `/generate-automation-mobile` | [`prompt_26`](prompts/prompt_26_generate_automation_mobile_flow.txt) | Mode TC · mode FLOW khi chưa có TC — Native / Flutter / Hybrid |
| 1 · API | `/generate-automation-api` | [`prompt_31`](prompts/prompt_31_generate_automation_api.txt) | Từ file TC API — TC sinh bằng `/generate-testcases-api` ([`prompt_09`](prompts/prompt_09_generate_api_tests.txt)) |
| 2 | `/review-automation-code` | [`prompt_06`](prompts/prompt_06_review_automation_code.txt) | 1 lần / bộ script (+ định kỳ) |
| 3 | `/run-and-fix-tests` | [`prompt_17`](prompts/prompt_17_run_and_fix_tests.txt) | **Mỗi đợt regression / mỗi build** |
| 4 | `/analyze-test-report` | [`prompt_11`](prompts/prompt_11_analyze_test_report.txt) | Khi nhiều test đỏ |
| 4 | `/create-bug-report` | [`prompt_10`](prompts/prompt_10_create_bug_report.txt) | Mỗi bug app |
| 5 | `/heal-locators` | [`prompt_18`](prompts/prompt_18_heal_locators.txt) | **Mỗi lần UI đổi** |
| 5 | `/analyze-flaky-tests` | [`prompt_08`](prompts/prompt_08_analyze_flaky_tests.txt) | Khi test chập chờn |
| 5 | `/update-automation-from-impact` | [`prompt_19`](prompts/prompt_19_update_automation_from_impact.txt) | Mỗi Impact Report — **sau** `/update-testcases-from-impact` |
| 6 | `/generate-traceability-matrix` | [`prompt_13`](prompts/prompt_13_generate_traceability_matrix.txt) | Định kỳ / trước release |
| 7 | `/import-test-results-xray` | — | Mỗi lần cần đồng bộ Xray |
| ⊹ | `/generate-test-data` | [`prompt_07`](prompts/prompt_07_generate_test_data.txt) | Khi cần bộ data nhiều biến thể |
| ⊹ | `/generate-api-mocks` | [`prompt_14`](prompts/prompt_14_generate_api_mocks.txt) | Khi cần test độc lập backend |

---

## Ba lỗi hay gặp nhất

**1. Automate bộ TC chưa review.**
TC mơ hồ → script sai kỳ vọng → chạy tự động mỗi ngày mà không ai biết nó đang kiểm sai. Chạy `/review-testcases` trước khi vào chặng 1.

**2. Sửa assertion cho test xanh trở lại.**
Đây là cách nhanh nhất biến cả suite thành vô dụng: nó vẫn chạy, vẫn xanh, và không còn phát hiện được gì. Bug app thì để đỏ và mở bug report — xem luật ở chặng 3.

**3. Quên label `testId`.**
Script chạy tốt nhưng RTM không map được về TC/REQ → chặng 6 xếp vào ⚪ mồ côi → không chứng minh được automation đang phủ cái gì. Gắn `testId` ngay lúc sinh script, không để dồn lại sửa sau.

---

## Tài liệu liên quan

| File | Nội dung |
|---|---|
| [`AI_FULL_FLOW_MANUAL.md`](AI_FULL_FLOW_MANUAL.md) | Flow 8 chặng Manual Testing — nguồn của bộ TC mà flow này tiêu thụ |
| [`CLAUDE.md`](CLAUDE.md) | Quy tắc bắt buộc · Definition of Done · danh sách đầy đủ workflows |
| [`.claude/rules/automation_rules.md`](.claude/rules/automation_rules.md) | POM · test data · naming · assertion |
| [`.claude/rules/reporting_rules.md`](.claude/rules/reporting_rules.md) | Allure metadata · step Tiếng Việt · screenshot · thư mục `reports/` |
| [`.claude/rules/locator_strategy.md`](.claude/rules/locator_strategy.md) | Thứ tự ưu tiên locator (mọi framework) |
| [`.claude/rules/playwright_rules.md`](.claude/rules/playwright_rules.md) · [`selenium`](.claude/rules/selenium_rules.md) · [`appium`](.claude/rules/appium_rules.md) | Quy tắc riêng từng framework |
| [`plans/automation/QUICK_START.md`](plans/automation/QUICK_START.md) | Luồng 6 bước bản copy-paste — dùng cho AI agent khác không có slash command của bộ này |
| [`prompts/README.md`](prompts/README.md) | 35 prompt mẫu copy-paste, chia 7 nhóm tra cứu |
