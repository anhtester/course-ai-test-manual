---
description: Sinh automation Appium cho app mobile — Native Android/iOS, Flutter, Hybrid — 2 mode TC (từ file test case mobile, mặc định) và FLOW (chưa có TC, chạy thật flow trên device). Thu locator từ UI hierarchy thật, Screen Object tách Android/iOS, chạy và tự sửa đến khi PASS 2 lần liên tiếp.
skills:
  - skills-mobile-debug-agent
  - skills-smart-locator-agent
  - skills-qa-automation-engineer
  - skills-test-data-generator
---

# Workflow: Sinh Automation Mobile

> **BẮT BUỘC (MANDATORY SKILLS):** Nạp và đọc kỹ trước khi bắt đầu:
> - **`skills-mobile-debug-agent`** (`.claude/skills/skills-mobile-debug-agent/SKILL.md`) — phiên Appium, nhận diện loại app, thu locator từ hierarchy
> - **`skills-smart-locator-agent`** — sinh locator ổn định
> - **`skills-qa-automation-engineer`** — quy tắc automation chung
> - **`skills-test-data-generator`** — test data unique, traceable
>
> Và tuân thủ **`.claude/rules/appium_rules.md`** — locator theo nền tảng, gesture, Flutter, parallel multi-device.

Workflow chạy trên **device/emulator thật** qua Appium MCP: thu locator từ UI hierarchy, sinh Screen Object + test class, chạy và tự sửa đến khi PASS ổn định.

> Được gọi thẳng, hoặc qua bộ định tuyến `/generate-automation-from-testcases` khi file TC thuộc tầng `mobile/`. Web → `/generate-automation-web` · API → `/generate-automation-api`.

---

## 2 Chế độ (Mode)

| Mode | Đầu vào | Khi nào dùng | Neo RTM |
|---|---|---|---|
| **TC** (mặc định) | File test case mobile — `docs/testcases/<module>/mobile/test_cases_<module>_mobile.md` (tag `@Android` / `@iOS`) | Đã có TC — mỗi TC thành 1 test | ✅ `testId` = TC ID |
| **FLOW** | App + flow mô tả bằng lời (*"mở app, đăng nhập, tạo đơn"*) | Chưa có TC | ⚪ Test mồ côi — xem Bước 5 |

**Agent tự chọn mode từ đầu vào** — có file TC → TC; chỉ có mô tả flow → FLOW. User chỉ định thì theo user. **Công bố mode ở câu đầu** cùng kết luận loại app (Bước 2).

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **TUYỆT ĐỐI KHÔNG ĐOÁN locator** — lấy từ hierarchy thật, verify bằng `appium_find_element`
- **KHÔNG dùng toạ độ** `tap(x, y)` thay cho locator, kể cả khi bí
- **Nhận diện loại app TRƯỚC khi tìm locator** — Native / Flutter / Hybrid quyết định toàn bộ cách làm phía sau
- Hierarchy chỉ có `FlutterView` rỗng → **DỪNG, báo user**, không bịa locator (xem Bước 2)
- **Không suy locator nền tảng này từ nền tảng kia** — Android và iOS thu riêng
- ⚠️ **Rule E3:** test FAIL → tự đọc log → phân tích → sửa → chạy lại, **KHÔNG hỏi user**. Chỉ hỏi khi business rule mâu thuẫn, app/device không truy cập được, hoặc hết 5 vòng auto-heal
- **Artifact `task.md`** — PHẢI tạo để theo dõi tiến độ

## Input cần thu thập

| Input | Mode | Bắt buộc? | Ghi chú |
|---|---|---|---|
| **File test cases mobile** | TC | ⭐ | Đưa file **index** `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → theo `## Bản đồ tài liệu` chỉ lấy file `mobile/` |
| **Flow cần automate** | FLOW | ⭐ | Mô tả từng bước bằng lời |
| **File app** (`.apk` / `.ipa` / `.app`) hoặc app đã cài trên device | Cả hai | ⭐ | Kèm `appPackage`/`appActivity` (Android) hoặc `bundleId` (iOS) nếu app đã cài |
| **Device/emulator** | Cả hai | ⭐ | Tên device, hoặc để agent liệt kê bằng `select_device` |
| **Loại app** | Cả hai | ⭕ | Không biết cũng được — Bước 2 tự nhận diện. Biết trước thì nhanh hơn |
| **Tài khoản test** | Cả hai | ⭕ | Nếu flow cần đăng nhập |
| **Appium server cho bộ test** | Cả hai | ⭐ khi chạy test | URL server để `mvn test` kết nối (mặc định `http://127.0.0.1:4723`). **Không** dùng cho phiên khảo sát — phiên MCP chạy nhúng |
| **Build mode (Flutter)** | Cả hai | ⭕ | debug/profile hay release — quyết định chọn Đường A hay B |

Thiếu app hoặc device → **hỏi trước khi bắt đầu**, không tự tạo emulator mà không báo.

## Các bước thực hiện

### Bước 1: Chuẩn bị phiên (Session Setup)

1. Tạo `task.md` theo dõi 7 bước
2. **Mode TC — đọc file TC mobile:**
   - Lọc TC theo nền tảng lượt này bằng tag: `@Android` → phiên Android · `@iOS` → phiên iOS. TC gắn cả hai tag → chạy trên **cả hai**, mỗi nền tảng một phiên
   - Lập bảng TC → màn hình đi qua (Screen) → Priority → nền tảng, ghi vào `task.md`
   - TC không có tag nền tảng (bộ TC cũ) → hỏi user nền tảng, không tự đoán
3. `select_device` → liệt kê device/emulator sẵn có, chốt với user nếu có nhiều
4. iOS: `prepare_ios_simulator` (simulator) hoặc `appium_prepare_ios_real_device` (real device — cần WDA đã ký)
5. `appium_session_management` `action=create` — `platform` + `capabilities` **dạng chuỗi JSON** (`appium:app` hoặc `appium:appPackage`/`appium:bundleId`, `appium:automationName`, cộng nguyên `capabilitiesHint` nếu tool chuẩn bị trả về). **Chế độ nhúng mặc định** — không truyền `remoteServerUrl`, không tự bịa `127.0.0.1:4723`; chỉ dùng khi user đưa server/cloud riêng. Máy Windows/Linux chỉ làm được Android — iOS cần Mac hoặc cloud (skill `skills-mobile-debug-agent`, mục *iOS cần máy Mac*). `automationName` theo loại app:

   | Loại app | `automationName` |
   |---|---|
   | Native Android | `UiAutomator2` |
   | Native iOS | `XCUITest` |
   | Chưa rõ / Flutter Đường A | `UiAutomator2` / `XCUITest` |
   | Flutter Đường B | `Flutter` hoặc `FlutterIntegration` (cần build debug/profile) — ⚠️ chưa xác nhận chế độ nhúng của Appium MCP có sẵn driver này: mở phiên thử trước, lỗi thiếu driver thì cần Appium server riêng đã cài driver Flutter (`remoteServerUrl`) |

6. Capabilities nên bật sẵn: `appium:autoGrantPermissions` (Android) / `appium:autoAcceptAlerts` (iOS) — tránh dialog quyền chặn flow. **Ngoại lệ:** TC kiểm chính hộp thoại xin quyền (nhóm yêu cầu *Quyền runtime*) → tắt capability này cho test đó

### Bước 2: Nhận diện loại app (⏸️ CHECKPOINT nếu là Flutter)

`appium_get_page_source` → đối chiếu:

| Hierarchy | Kết luận | Hành động |
|---|---|---|
| Nhiều `android.widget.*` / `XCUIElementType*` | **Native** | Sang Bước 3 |
| **Chỉ** `FlutterView` rỗng | **Flutter, semantics chưa bật** | 🛑 **DỪNG** — xem dưới |
| `FlutterView` + node có `content-desc` | **Flutter, semantics đã bật** | Sang Bước 3, locator dùng `accessibilityId` |
| Có `WebView` | **Hybrid** | Ghi nhận, Bước 3 sẽ đổi context |

**Nếu Flutter chưa bật semantics — DỪNG và báo user đúng 3 việc cần hỏi dev:**

1. Đã bọc `Semantics(label: '...')` cho widget cần test chưa?
2. Đã gọi `SemanticsBinding.instance.ensureSemantics()` chưa?
3. Có bản build debug/profile không? (quyết định dùng được Đường B hay không)

🚨 **Nói rõ ngay:** dev trả lời *"đã thêm `Key('login_btn')`"* thì **vẫn chưa dùng được** — `Key`/`ValueKey` chỉ flutter driver thấy, không sinh `content-desc`. Nêu trước để khỏi mất thêm một vòng trao đổi.

**Công bố kết luận ở đầu output**, ví dụ: *"Mode TC · 18 TC `@Android` · App Flutter, semantics đã bật → đi Đường A, locator qua accessibility id."*

### Bước 3: Chạy thật & thu locator (Recon)

**Mode TC:** đi theo **từng bước của từng TC**. **Mode FLOW:** đi theo từng bước của flow user mô tả. Với mỗi bước:

1. `appium_get_page_source` → đọc hierarchy màn hình hiện tại
2. Xác định element cần thao tác, lấy locator theo thứ tự ưu tiên của nền tảng
3. **Verify** bằng `appium_find_element` — đúng element cần thao tác. Tool chỉ trả phần tử **đầu tiên** khớp → **tính duy nhất kiểm bằng cách đếm trong page source**, >1 node là locator chưa đạt
4. Thao tác thật (`appium_gesture` tap/swipe, `appium_set_value` nhập liệu) → sang màn hình kế
5. `appium_screenshot` ở các màn hình mốc — tool tự lưu file và **trả về đường dẫn** (không nhận tham số path): copy file đó về thư mục ảnh recon của bộ test, đặt tên `<android|ios>_<màn_hình>_<trạng_thái>.png`, rồi `Read` lại xác nhận
6. Element ngoài màn hình → `appium_gesture` `action=scroll_to_element`, **không** tăng timeout

**Mode TC — kỳ vọng của TC là thứ phải kiểm, không phải thứ phải chiều:** thao tác theo TC mà app ra kết quả khác Expected → ghi lại (ảnh + mô tả), **không** sửa bước để app "đi qua". Đó là ứng viên bug, xử lý ở Bước 6.

**Chạy đủ 2 nền tảng nếu TC/dự án cần cả Android lẫn iOS** — locator thường khác nhau, đừng suy từ nền tảng này sang nền tảng kia.

**Bảng Locator Collection** (đầu ra bắt buộc của bước này):

| Screen | Element | Platform | Locator | Verified |
|---|---|---|---|---|
| LoginScreen | Ô email | Android | `AppiumBy.accessibilityId("email_input")` | ✅ |
| LoginScreen | Ô email | iOS | `AppiumBy.accessibilityId("email_input")` | ✅ |
| LoginScreen | Nút đăng nhập | Android | `AppiumBy.id("com.app:id/btn_login")` | ✅ |

**Xử lý tình huống:**

| Tình huống | Cách xử lý |
|---|---|
| Element không có id, không có content-desc | Báo user + đề xuất dev bổ sung. Tạm dùng locator theo text và **đánh dấu 🟡 mong manh** |
| Danh sách Flutter cuộn được | Item chưa cuộn tới thì chưa render — cuộn rồi tìm lại, không phải locator sai |
| Màn hình có WebView | `appium_context` sang `WEBVIEW_*`, lấy locator web, **quay lại `NATIVE_APP`** trước thao tác native |
| OTP / CAPTCHA / sinh trắc học | Không automate được — báo user, đánh dấu SKIP |
| App crash giữa flow | Chụp màn hình + log, báo user — **không** tự sửa flow để né |
| TC thuộc nhóm quyền · chạy nền · bàn phím · hộp thoại hệ thống · deep link · xoay màn hình | Tool theo **Bảng tool Appium MCP theo việc** của skill `skills-mobile-debug-agent` (`appium_mobile_permissions` · `appium_app_lifecycle` · `appium_mobile_keyboard` · `appium_alert` · `appium_orientation`), rồi chuyển đúng thao tác đó vào helper của `BaseScreen` |
| TC mất mạng | Appium MCP **không** có tool tắt mạng — khảo sát bằng `adb` (Android) hoặc nhờ user; trong code dùng `mobile: setConnectivity` (Android). iOS không tự động được → SKIP kèm lý do |

### Bước 4: Thiết kế Screen Objects

1. Mỗi màn hình → 1 **Screen class** (hậu tố `Screen`, không phải `Page`)
2. Cấu trúc: locator ở đầu class → constructor nhận driver → action method mô tả **hành vi nghiệp vụ** → verification method
3. **Locator khác nhau giữa Android/iOS thì tách theo nền tảng ngay trong Screen class** — cấm rải `if (isAndroid)` khắp test class
4. Method đánh dấu step API (`@Step`) → sinh sub-step trong report
5. Kế thừa `BaseScreen` (smart wait, gesture helper) — chưa có thì tạo theo CODE_TEMPLATES § 4

### Bước 5: Sinh Test + Test Data

1. Test class TestNG theo `Arrange` / `Act` / `Assert`, mỗi test ≥ 1 assertion có message rõ ràng
2. **Allure metadata bắt buộc** (theo `.claude/rules/reporting_rules.md`): tên test Tiếng Việt · Description · Severity · Tags · label `testId`

   | Mục | Mode TC | Mode FLOW |
   |---|---|---|
   | Tên test / Description | Tiêu đề + mục tiêu của TC | Mô tả hành vi của flow |
   | Severity | Theo Priority của TC | Agent đề xuất theo mức rủi ro |
   | Tags | Nhóm chạy + module + nền tảng (`android` / `ios`) | Như bên trái |
   | label `testId` | **Đúng TC ID** trong file TC mobile — chung dải với web (skill `skills-requirements-analyzer` mục 2.2) | `FLOW_<MODULE>_<nnn>` — **KHÔNG** cấp mã theo mẫu TC ID thật, dải đó thuộc tầng test case và cấp tạm ở đây là đụng mã về sau |

   Mode FLOW: ghi rõ ở bàn giao là test chưa neo được vào RTM, đề xuất chạy `/generate-requirements-from-mobile` rồi sinh TC, sau đó đổi label sang TC ID thật.
3. Mode TC: mỗi **Step** trong manual TC → 1 step trong report
4. Screenshot trạng thái cuối đính ở teardown cho **mọi** test — PASS lẫn FAIL
5. Test data unique + traceable (`auto_<flow>_<timestamp>`), không hardcode
6. Driver theo `ThreadLocal`, `remove()` ở teardown — parallel luôn bật

### Bước 6: Chạy & Auto-Heal (RULE E3)

**Trước mỗi lần chạy — BẮT BUỘC:**
- **Đóng phiên Appium MCP** (`appium_session_management action=delete`). Phiên MCP và bộ test cùng một thiết bị sẽ tranh nhau — lỗi trông như locator hỏng nhưng không phải
- **Appium server phải đang chạy** ở URL của tham số `appium.server` (mặc định `http://127.0.0.1:4723`) — bộ test Java không dùng được server nhúng của MCP

```bash
mvn test -Dtest=<TestClass>
```

Test chạy lâu → `run_in_background: true`, nhận thông báo khi xong. Cần soi lại màn hình để sửa → mở phiên MCP mới, soi xong **đóng lại** rồi mới chạy lượt kế. Vòng lặp tối đa **5 vòng**:

| Lỗi | Hành động |
|---|---|
| `NoSuchElementException` | Dump hierarchy lại → verify/thay locator |
| Element không tương tác được | Kiểm `displayed`/`enabled`, scroll tới trước |
| Locator native fail hàng loạt | Kiểm context có đang kẹt ở WEBVIEW không |
| Timeout | Thêm điều kiện chờ trạng thái — **KHÔNG** thêm sleep |
| Phiên iOS không mở được | WDA chưa ký, hoặc đang ở máy không phải macOS — báo user, không phải lỗi code |
| *Connection refused* tới Appium server | Chưa chạy Appium server cho bộ test — lỗi môi trường: **dừng, báo user**, không sửa code |
| *instrumentation process is not running* / *could not proxy command* | Phiên MCP còn mở trên cùng thiết bị → đóng phiên MCP rồi chạy lại |
| Trùng port khi chạy nhiều device | Cấp `systemPort`/`wdaLocalPort` riêng |
| Test data trùng | Sinh data unique mới |
| Assertion fail vì app làm sai so với TC | **KHÔNG** sửa kỳ vọng cho xanh — giữ assertion, đánh dấu test đang phơi bug, đề xuất `/create-bug-report` |

**Verify ổn định:** test phải PASS **2 lần liên tiếp** mới coi là xong.

### Bước 7: Cleanup & Delivery

- [ ] Xoá debug log, commented code, locator không dùng
- [ ] Không còn `Thread.sleep()`, không còn toạ độ cứng
- [ ] Locator 🟡 mong manh đã liệt kê trong báo cáo kèm đề xuất cho dev
- [ ] Cập nhật `task.md`: TC nào PASS / FAIL (phơi bug) / SKIP (kèm lý do) — tách theo nền tảng
- [ ] Đóng phiên Appium (`appium_session_management` — delete)

## Output

- **Kết luận loại app** — Native / Flutter (semantics bật chưa) / Hybrid, công bố ngay đầu output
- **Bảng Locator Collection** — tách dòng theo nền tảng, có cột Verified
- **Screen Object classes** — locator đã verify, tách theo nền tảng khi cần
- **Test class** — Allure metadata đủ, đã PASS 2 lần liên tiếp
- **Ảnh recon** các màn hình mốc
- **Danh sách việc cần dev làm** — element thiếu id, Flutter chưa bật semantics
- **Artifact `task.md`**
