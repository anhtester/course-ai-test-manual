---
name: skills-mobile-debug-agent
description: Skill inspect ứng dụng mobile thật (Native Android, Native iOS, Flutter, Hybrid) qua Appium MCP — dump UI hierarchy, nhận diện loại app, thu locator ổn định cho từng nền tảng, và debug lỗi không tìm thấy element. Dành cho Appium; KHÔNG dùng cho web.
---

# Mobile Debug Agent

## Description

Skill inspect ứng dụng mobile **trên device/emulator thật** qua Appium MCP, thu thập locator đã verify, và chẩn đoán lỗi "không tìm thấy element" theo đúng loại app.

Đây là bản mobile của [`skills-ui-debug-agent`](../skills-ui-debug-agent/SKILL.md) (web/DOM). Hai skill **không thay thế nhau**: DOM và UI hierarchy của mobile là hai thứ khác nhau, và Flutter thì khác cả hai.

Agent có thể:

- Chọn device, mở phiên Appium đúng `automationName` theo loại app
- Dump UI hierarchy → **nhận diện Native / Flutter / Hybrid** trước khi tìm locator
- Thu locator ổn định riêng cho Android và iOS, verify bằng cách tìm và thao tác thật
- Phát hiện app Flutter **chưa bật semantics** và báo đúng việc cần dev làm
- Đổi context native ↔ webview cho app hybrid
- Chẩn đoán `NoSuchElementException` theo nguyên nhân thật, không đoán

---

## When to Use

- Khảo sát màn hình mobile mới, chưa có Screen Object
- Cần locator cho element trên app Android/iOS/Flutter
- Test mobile fail `NoSuchElementException` / `StaleElement` cần tìm nguyên nhân
- App Flutter mở Inspector lên **không thấy element nào**
- Cần biết app đang test là Native hay Flutter hay Hybrid

Trigger: "inspect app mobile", "tìm locator Android", "locator iOS", "app Flutter không thấy element", "dump hierarchy"

> Web/trình duyệt → dùng `skills-ui-debug-agent`. Đừng dùng skill này cho web.

---

## Quy tắc bất di bất dịch

1. **KHÔNG ĐOÁN locator** — mọi locator phải lấy từ hierarchy thật và **verify bằng `appium_find_element`**
2. **Nhận diện loại app TRƯỚC khi tìm locator** — làm ngược thứ tự là nguồn gốc của mọi bế tắc với Flutter
3. **KHÔNG dùng toạ độ** (`tap(x, y)`) để thay cho locator — kể cả khi bí
4. **KHÔNG sinh XPath tuyệt đối bám vị trí**
5. Hierarchy chỉ có `FlutterView` rỗng → **DỪNG, báo user**, không bịa locator
6. Mỗi locator ghi rõ **đã verify hay chưa**, và verify trên **device nào**

---

## Quy trình chuẩn (BẮT BUỘC theo thứ tự)

```
select_device → session(create) → get_page_source → NHẬN DIỆN LOẠI APP
      → find_element (verify) → generate_locators → ghi bảng Locator Collection
```

### Bước 1 — Chọn device & mở phiên

| Việc | Tool |
|---|---|
| Liệt kê / chọn device, emulator | `select_device` (`platform` bắt buộc) |
| Chuẩn bị simulator iOS (chỉ macOS) | `prepare_ios_simulator` |
| Chuẩn bị real device iOS — WDA, signing (chỉ macOS + Xcode 16+) | `appium_prepare_ios_real_device` |
| Mở / đóng phiên | `appium_session_management` `action=create` / `delete` |

Tham số chi tiết từng tool, chế độ nhúng vs `remoteServerUrl`, và giới hạn iOS trên Windows: xem **Bảng tool Appium MCP theo việc** bên dưới.

`automationName` chọn theo loại app — xem [`appium_rules.md`](../../rules/appium_rules.md) mục 0, truyền qua `capabilities` dạng `appium:automationName`. Chưa biết loại app thì mở mặc định (`UiAutomator2` / `XCUITest`) rồi dump hierarchy để nhận diện.

### Bước 2 — Dump hierarchy & nhận diện loại app

`appium_get_page_source` → đối chiếu bảng sau **trước khi làm gì tiếp**:

| Thấy trong hierarchy | Kết luận | Làm gì tiếp |
|---|---|---|
| Nhiều `android.widget.*` / `XCUIElementType*` | **Native** | Sang Bước 3 |
| **Chỉ một** `FlutterView` / `FlutterSurfaceView`, bên trong rỗng | **Flutter — semantics CHƯA bật** | 🛑 Dừng, báo user (xem mục Flutter bên dưới) |
| `FlutterView` + node con có `content-desc` | **Flutter — semantics đã bật** | Sang Bước 3, locator dùng `accessibilityId` |
| `android.webkit.WebView` / `XCUIElementTypeWebView` | **Hybrid** | Đổi context bằng `appium_context` rồi lấy locator web |

### Bước 3 — Thu & verify locator

1. Với mỗi element cần thao tác, lấy locator theo thứ tự ưu tiên của nền tảng (mục dưới)
2. **Verify từng cái** bằng `appium_find_element` — phải khớp **đúng element cần thao tác**. ⚠️ Tool chỉ trả **phần tử đầu tiên** khớp, không báo trùng → **tính duy nhất kiểm bằng page source**: đếm số node trong XML mang đúng giá trị đó (`content-desc` / `resource-id` / `name`). Nhiều hơn 1 → locator chưa đạt, dù `appium_find_element` vẫn trả kết quả
3. Element ngoài màn hình → `appium_gesture` với `action=scroll_to_element`, **không** tăng timeout
4. Đọc thuộc tính kiểm chứng bằng `appium_get_element_attribute` — tên thuộc tính khác theo nền tảng (Android `enabled` · `displayed` · `text` · `content-desc` · `bounds` — iOS `enabled` · `visible` · `label` · `name` · `rect`)
5. `generate_locators` để lấy đề xuất, nhưng **kết quả của nó là gợi ý, không phải kết luận** — vẫn phải verify

### Bước 4 — Ghi bảng Locator Collection

| Screen | Element | Platform | Locator | Loại | Verified |
|---|---|---|---|---|---|
| LoginScreen | Ô email | Android | `AppiumBy.accessibilityId("email_input")` | a11y id | ✅ |
| LoginScreen | Ô email | iOS | `AppiumBy.accessibilityId("email_input")` | a11y id | ✅ |
| LoginScreen | Nút đăng nhập | Android | `AppiumBy.id("com.app:id/btn_login")` | resource-id | ✅ |

**Locator khác nhau giữa 2 nền tảng thì ghi thành 2 dòng** — không gộp rồi để người viết code tự đoán.

---

## Thứ tự ưu tiên locator

**Native Android:** `accessibilityId` (content-desc) → `id` (resource-id) → `androidUIAutomator` theo text → xpath tương đối

**Native iOS:** `accessibilityId` → `iOSNsPredicateString` → `iOSClassChain` → xpath (chậm nhất, tránh)

**Flutter (semantics đã bật):** `accessibilityId` từ `Semantics(label:)` — **chỉ dùng cái này**

Chi tiết + ví dụ code: [`appium_rules.md`](../../rules/appium_rules.md) mục 1–3.

---

## Flutter — xử lý khi hierarchy rỗng

Đây là tình huống gặp nhiều nhất và hay bị chẩn đoán sai nhất.

**Triệu chứng:** dump hierarchy chỉ ra một node `FlutterView`, không có gì bên trong. Mọi locator đều `NoSuchElementException`.

**KHÔNG phải** do: locator sai · timeout ngắn · Appium version · thiếu quyền.

**Nguyên nhân:** Flutter vẽ UI lên canvas. Không bật semantics thì **không tồn tại element native nào** để tìm.

**Việc agent phải làm — theo đúng thứ tự:**

1. **Dừng ngay**, không sinh locator, không thử XPath, không dùng toạ độ
2. Báo user chính xác 3 điều cần xác nhận với dev:

   | Câu hỏi cho dev | Vì sao hỏi |
   |---|---|
   | App đã bọc `Semantics(label: ...)` cho widget cần test chưa? | Không có thì Appium native không thấy gì |
   | Đã gọi `SemanticsBinding.instance.ensureSemantics()` chưa? | Semantics chỉ sinh khi được bật |
   | Có bản build **debug/profile** không? | Quyết định có dùng được Đường B (flutter driver) hay không |

3. 🚨 **Cảnh báo bắt buộc nêu ra:** dev trả lời *"đã thêm `Key('login_btn')` rồi"* → **vẫn không dùng được**. `Key`/`ValueKey` chỉ flutter driver thấy, **không** sinh ra `content-desc`. Đây là hiểu nhầm phổ biến nhất giữa QA và dev Flutter — nói rõ ngay, đừng để mất thêm một vòng trao đổi.

4. Semantics đã bật → locator dùng `accessibilityId` với đúng chuỗi trong `Semantics(label:)`

**Danh sách Flutter cuộn được:** item chưa cuộn tới thì **chưa render** ⇒ chưa có trong semantics tree. Đây **không** phải locator sai — cuộn từng bước bằng `appium_gesture` rồi tìm lại.

---

## Hybrid / WebView

```
appium_context action=list                          → xem có WEBVIEW_* nào
appium_context action=switch context=WEBVIEW_<...>  → sang WebView
   → locator web (id, css)
appium_context action=switch context=NATIVE_APP     → BẮT BUỘC quay lại trước khi thao tác native
```

Quên quay lại `NATIVE_APP` → mọi locator native sau đó fail, và log **không** chỉ ra nguyên nhân. Gặp chuỗi fail khó hiểu sau một đoạn WebView thì kiểm context đầu tiên.

---

## Bảng tool Appium MCP theo việc (NGUỒN DUY NHẤT — đối chiếu schema thật của server `appium-mcp`)

Mọi command mobile (`/discover-system` Bước 3-M · `/generate-requirements-from-mobile` · `/generate-automation-mobile`) gọi tool theo bảng này. Tên `action` sai là tool báo lỗi, không phải lỗi app.

| Việc | Tool · tham số | Lưu ý |
|---|---|---|
| Chọn thiết bị | `select_device` — `platform` (bắt buộc) · `iosDeviceType` = `simulator`/`real` khi iOS · `deviceUdid` khi có nhiều máy | Nhiều máy → hỏi user chọn, không tự chọn |
| Mở phiên | `appium_session_management` `action=create` · `platform` · `capabilities` = **chuỗi JSON**, khoá có tiền tố `appium:` (`appium:app`, `appium:appPackage`, `appium:bundleId`, `appium:autoGrantPermissions`…) | Tool chuẩn bị (`prepare_ios_simulator`, `appium_prepare_ios_real_device`) trả `capabilitiesHint` → gộp nguyên vào `capabilities`. Server có `CAPABILITIES_CONFIG` thì khối theo `platform` được nạp sẵn — xem mục *Cấu hình server `appium-mcp`* |
| Đóng phiên | `appium_session_management` `action=delete` | Bắt buộc trước khi chạy bộ test bằng `mvn test` — xem mục *Hai loại phiên* |
| Đọc màn hình | `appium_get_page_source` | XML — nguồn để nhận diện loại app và **đếm tính duy nhất** của locator |
| Tìm phần tử | `appium_find_element` — `strategy` (`accessibility id` · `id` · `-android uiautomator` · `-ios predicate string` · `-ios class chain` · `xpath`) + `selector` | ⚠️ Chỉ trả **phần tử đầu tiên** khớp, **không** báo trùng |
| Gợi ý locator hàng loạt | `generate_locators` | Chỉ để tham khảo, vẫn phải verify |
| Đọc thuộc tính | `appium_get_element_attribute` — `elementUUID` + `attribute` | Tên thuộc tính **khác theo nền tảng**: Android `displayed` · `enabled` · `bounds` · `content-desc` · `resource-id` — iOS `visible` · `enabled` · `rect` · `name` · `label` · `value`. Đọc sai tên trả về rỗng — **không** có nghĩa là `false` |
| Chạm · nhấn giữ · vuốt · cuộn · Back | `appium_gesture` `action` = `tap` · `long_press` · `double_tap` · `swipe` · `scroll` · `scroll_to_element` (+ `strategy`/`selector`) · `back` | Chạm **luôn** theo `elementUUID` — tool nhận được `x`/`y` nhưng repo này **CẤM** dùng toạ độ |
| Nhập chữ | `appium_set_value` — `elementUUID` + `text` | |
| Bàn phím | `appium_mobile_keyboard` `action` = `is_shown` · `hide` | Kiểm bàn phím có che ô nhập trước khi kết luận "không bấm được" |
| Hộp thoại hệ thống | `appium_alert` `action` = `get_text` · `accept` · `dismiss` (+ `buttonLabel`) | Chuỗi do hệ điều hành sinh — ghi tham khảo, **không** làm assertion |
| Quyền | `appium_mobile_permissions` — Android: `action=get` · `action=update` + `permissions` + `permissionChangeAction` = `grant`/`revoke` · iOS **Simulator**: `action=update` + `access` · `action=reset` + `service` | `reset` chỉ có trên iOS. iOS **máy thật**: tool không hỗ trợ — nhờ user đổi quyền trong Cài đặt |
| Đưa app xuống nền / mở lại | `appium_app_lifecycle` `action=background` (+ `seconds`) · `action=activate` | |
| Xoá dữ liệu app (xem lại màn hình lần đầu) | `appium_app_lifecycle` `action=clear` | **Chỉ khi user đã cho phép** — mất phiên đăng nhập trên máy |
| Deep link | `appium_app_lifecycle` `action=deep_link` + `url` | Chỉ mở link **đọc** |
| Xoay màn hình | `appium_orientation` `action=set` + `orientation` = `LANDSCAPE`/`PORTRAIT` | |
| Nút cứng | `appium_mobile_press_key` `key` = `BACK` · `HOME` · `APP_SWITCH` (Android) | |
| Mở bảng thông báo | `appium_mobile_device_control` `action=open_notifications` (chỉ Android) | Tool này **chỉ** có `lock` · `unlock` · `shake` · `open_notifications` |
| WebView | `appium_context` `action=list` · `action=switch` + `context` | Tên action là **`switch`**, không phải `set` |
| Chụp ảnh | `appium_screenshot` (+ `elementUUID` để chụp riêng một phần tử · `maxWidth`) | Tool **không** nhận đường dẫn — nó tự lưu file và **trả về đường dẫn**. Copy file đó vào thư mục evidence với tên chuẩn rồi `Read` lại. Tool báo lỗi / không trả đường dẫn → chụp bằng lệnh nền tảng (xem *Bảng chẩn đoán lỗi*) |
| ❌ Tắt / bật mạng | **Appium MCP không có tool này** | Android có `adb`: `adb shell svc wifi disable` + `adb shell svc data disable` (bật lại bằng `enable`). iOS hoặc máy không có `adb`: nhờ user bật chế độ máy bay. Trong code test: `mobile: setConnectivity` (UiAutomator2). **Không** ghi REQ/TC là "đã kiểm" khi chưa tắt mạng được thật |
| ⚠️ `appium_generate_tests` | Không dùng để sinh code cuối | Code của nó không theo Screen Object · Allure · `testId` của repo — chỉ tham khảo chuỗi bước |

### Hai loại phiên — đừng để chúng giành nhau một thiết bị

| | Phiên khảo sát (Appium MCP) | Phiên chạy bộ test (`mvn test`) |
|---|---|---|
| Ai tạo | `appium_session_management action=create` | Code Java qua `AppiumDriverFactory` |
| Server | **Nhúng sẵn trong MCP** — không cần chạy Appium riêng. **KHÔNG** truyền `remoteServerUrl`, **KHÔNG** tự bịa `http://127.0.0.1:4723` | **Appium server thật phải đang chạy** ở URL của tham số `appium.server` (mặc định `http://127.0.0.1:4723`) |
| Khi nào dùng `remoteServerUrl` | Chỉ khi user đưa server riêng / cloud (BrowserStack, Sauce, Mac từ xa). Khi đó **bỏ** `select_device` | — |

⚠️ Hai phiên cùng một thiết bị sẽ tranh nhau (Android chỉ cho **một** UiAutomator2 instrumentation chạy tại một thời điểm) → lỗi kiểu *instrumentation process is not running* / *could not proxy command* — trông như lỗi locator nhưng **không phải**. Luật: **đóng phiên MCP trước mỗi lần `mvn test`**; cần soi lại màn hình khi auto-heal thì mở phiên MCP mới, soi xong đóng lại rồi mới chạy test.

### iOS cần máy Mac

`prepare_ios_simulator` và `appium_prepare_ios_real_device` chỉ chạy trên **macOS** (máy thật cần thêm Xcode 16+ và thiết bị đã bật Developer Mode). Máy **Windows / Linux** chỉ khảo sát được **Android**; iOS phải qua Appium server trên Mac hoặc cloud (`remoteServerUrl`). Nói rõ với user ngay ở bước chọn nền tảng, đừng để tới lúc mở phiên mới báo lỗi.

### Cấu hình server `appium-mcp` — biến môi trường

Server `appium-mcp` đọc 2 biến môi trường từ khối `env` nơi khai server (config MCP của client — global hoặc `.mcp.json` của project):

| Biến | Vai trò | Bẫy thường gặp |
|---|---|---|
| `ANDROID_HOME` (hoặc `ANDROID_SDK_ROOT`) | Thư mục Android SDK — driver nhúng tìm `adb`, `build-tools` ở đây | Config mẫu trong README của `appium-mcp` ghi `"ANDROID_HOME": "/path/to/android/sdk"`. Chép nguyên mà không thay → giá trị mẫu **đè** lên biến hệ thống, kể cả khi máy đã khai `ANDROID_HOME` đúng. `adb devices` ở terminal vẫn thấy máy bình thường nên rất dễ đổ nhầm cho thiết bị |
| `CAPABILITIES_CONFIG` | Đường dẫn file JSON chứa capabilities mặc định, chia khối `android` · `ios` · `general` | File không tồn tại **chỉ ghi cảnh báo vào log** — phiên vẫn tạo được với capabilities mặc định, người dùng tưởng file đã được áp |

**Quy tắc:**

- Driver nhúng **chỉ** đọc SDK root từ biến môi trường của tiến trình MCP — **không** có capability nào thay thế. `ANDROID_HOME` sai thì không có cách né trong phiên đang chạy
- Khai `ANDROID_HOME` **tường minh** trong `env`, đừng trông vào biến hệ thống — có client MCP chỉ chuyển một số biến mặc định sang tiến trình server
- Ghi **đường dẫn tuyệt đối** cho cả hai biến — thư mục làm việc của tiến trình MCP không cố định
- Biến `env` chỉ có hiệu lực khi **tiến trình MCP khởi động lại**. Server khai ở config của ứng dụng desktop: phải **thoát hẳn ứng dụng** rồi mở lại — đóng cửa sổ thì tiến trình cũ vẫn chạy với giá trị cũ
- Chọn khối trong `CAPABILITIES_CONFIG` theo `platform` của lệnh `create`. Thứ tự gộp: mặc định của server → khối trong file → `udid` từ `select_device` → `capabilities` truyền trong lệnh (sau đè trước)
- Khối **`general` chỉ dùng cho `platform=general` kèm `remoteServerUrl`**. ❌ Khai `appium:appPackage` trong `general` rồi tạo phiên `platform=android` → app **không** mở, vì phiên nhúng Android chỉ đọc khối `android`
- Khối `android` / `ios` đã có `appium:udid` → bỏ qua được `select_device`
- File không có `appium:app` / `appium:appPackage` → phiên chỉ gắn vào thiết bị ở màn hình đang hiển thị, **không** mở app nào

```json
{
  "android": {
    "platformName": "Android",
    "appium:automationName": "UiAutomator2",
    "appium:udid": "<udid lấy từ adb devices>",
    "appium:appPackage": "<package của app cần test>",
    "appium:appActivity": "<launcher activity>",
    "appium:noReset": true
  }
}
```

> Chưa chắc launcher activity: `adb shell cmd package resolve-activity --brief <package>` — lấy từ máy thật, không đoán.

---

## Bảng chẩn đoán lỗi

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| `NoSuchElementException`, hierarchy **có** element | Locator sai kiểu / sai nền tảng | Dump lại, lấy đúng thuộc tính, verify |
| Hierarchy chỉ có `FlutterView` rỗng | Flutter chưa bật semantics | Xem mục Flutter — **không** đoán locator |
| Element có trong hierarchy nhưng không tương tác được | Bị che, `enabled=false`, ngoài viewport | Kiểm `displayed`/`enabled`, scroll tới trước |
| Tìm thấy trên Android, mất trên iOS | Locator không cross-platform | Tách locator theo nền tảng |
| Locator native fail hàng loạt sau một màn hình | Đang kẹt ở context WEBVIEW | `appium_context` về `NATIVE_APP` |
| Phiên không mở được trên iOS real device | WDA chưa ký | `appium_prepare_ios_real_device` — **không** phải lỗi locator |
| Chạy 1 device thì ổn, nhiều device thì loạn | Trùng `systemPort` / `wdaLocalPort` | Cấp port riêng từng device |
| `mvn test` báo *instrumentation process is not running* / *could not proxy command* | Phiên Appium MCP vẫn đang mở trên cùng thiết bị | `appium_session_management action=delete` rồi chạy lại — **không** phải lỗi locator |
| `mvn test` báo *Connection refused* tới `127.0.0.1:4723` | Chưa chạy Appium server cho bộ test | Lỗi môi trường — dừng, báo user khởi động Appium server; **không** sửa code |
| `appium_context` báo action không hợp lệ | Dùng `set` thay vì `switch` | `action=switch` |
| Element mất sau khi app quay lại foreground | Màn hình bị dựng lại | Tìm lại element, không giữ tham chiếu cũ |
| `select_device` / `create` báo *The Android SDK root folder '<đường dẫn>' does not exist* hoặc *Neither ANDROID_HOME nor ANDROID_SDK_ROOT…* | Biến `ANDROID_HOME` trong khối `env` của server `appium-mcp` sai, thường là giá trị mẫu `/path/to/android/sdk` chép từ README — nó đè biến hệ thống | Lỗi **cấu hình MCP**, không phải thiết bị hay `adb`. Đọc đường dẫn trong thông báo lỗi → sửa `env` thành SDK thật → khởi động lại tiến trình MCP (xem mục *Cấu hình server `appium-mcp`*). Không né được trong phiên đang chạy — báo user, **không** chuyển sang tự dựng Appium server để vòng qua |
| Phiên tạo được nhưng app không mở / capabilities trong file không được áp | `CAPABILITIES_CONFIG` sai đường dẫn (chỉ có cảnh báo trong log), hoặc khoá nằm ở khối `general` thay vì `android`/`ios` | Mở file, đối chiếu khối đúng `platform`. Cần gấp thì truyền thẳng khoá thiếu qua `capabilities` của lệnh `create` |
| `appium_screenshot` báo lỗi schema (vd. *Unrecognized key: "structuredContent"*), không trả đường dẫn file | Lỗi định dạng phản hồi của tool ở một số phiên bản `appium-mcp` — thiết bị vẫn bình thường (`appium_get_page_source` chạy được) | Chụp bằng lệnh nền tảng: Android `adb -s <udid> exec-out screencap -p > <file>.png` (Windows chạy qua `cmd /c` — pipe của PowerShell làm hỏng byte PNG) · iOS Simulator `xcrun simctl io <udid> screenshot <file>.png`. Mở lại ảnh xác nhận đúng màn hình |

---

## Output của skill

- **Bảng Locator Collection** — tách dòng theo nền tảng, có cột `Verified`
- **Kết luận loại app** — Native / Flutter (semantics bật hay chưa) / Hybrid
- **Ảnh chụp màn hình** (`appium_screenshot`) cho màn hình đã khảo sát
- **Danh sách việc cần dev làm** — nếu là Flutter chưa bật semantics
- Gợi ý cấu trúc **Screen Object** tương ứng

---

## Tham chiếu

- [`.claude/rules/appium_rules.md`](../../rules/appium_rules.md) — quy tắc locator, gesture, parallel multi-device
- [`.claude/rules/locator_strategy.md`](../../rules/locator_strategy.md) — nguyên tắc chung mọi framework
- [`skills-smart-locator-agent`](../skills-smart-locator-agent/SKILL.md) — sinh locator thay thế khi locator hiện tại mong manh
- [`CODE_TEMPLATES.md`](../skills-framework-architect/references/CODE_TEMPLATES.md) § 9 — capabilities + Screen Object mẫu cho Android/iOS/Flutter
