# Quy Tắc Dành Riêng Cho Appium (Mobile Automation)

> Áp dụng khi tự động hóa ứng dụng mobile với Java và Appium — **Native Android · Native iOS · Flutter**.
>
> Quy trình recon và thu locator: skill [`skills-mobile-debug-agent`](../skills/skills-mobile-debug-agent/SKILL.md) · Code mẫu: [`CODE_TEMPLATES.md`](../skills/skills-framework-architect/references/CODE_TEMPLATES.md) § 9.

---

## 0. Chọn driver theo loại app — quyết định TRƯỚC mọi thứ khác

**Không xác định được app thuộc loại nào thì không viết được locator.** Đây là bước đầu tiên, không phải chi tiết kỹ thuật cuối cùng.

| Loại app | `automationName` | Element tree nhìn thấy được? |
|---|---|---|
| **Native Android** (Kotlin/Java) | `UiAutomator2` | ✅ Đầy đủ — `resource-id`, `text`, `content-desc` |
| **Native iOS** (Swift/ObjC) | `XCUITest` | ✅ Đầy đủ — `XCUIElementType*`, `name`, `label` |
| **Flutter** | `UiAutomator2` / `XCUITest` (qua semantics) **hoặc** `Flutter` / `FlutterIntegration` | ⚠️ **Chỉ khi bật semantics** — xem mục 3 |
| **Hybrid / có WebView** | `UiAutomator2` / `XCUITest` + đổi context | ✅ Native tree + DOM sau khi `context` sang `WEBVIEW_*` |

### Cách nhận biết ngay trên hierarchy

```
Dump page source ra thấy:
├── Nhiều node android.widget.* / XCUIElementType*  → NATIVE
├── Một node FlutterView / FlutterSurfaceView duy nhất, rỗng bên trong  → FLUTTER, semantics CHƯA bật
├── FlutterView + node con có content-desc                              → FLUTTER, semantics ĐÃ bật
└── android.webkit.WebView / XCUIElementTypeWebView                     → HYBRID
```

---

## 1. Native Android — thứ tự ưu tiên locator

1. `accessibility id` (`content-desc`) — cross-platform, ổn định nhất
2. `resource-id` — thuộc tính native Android
3. `AndroidUIAutomator` với `text` / `description` — khi không có id
4. `xpath` tương đối — lựa chọn cuối cùng (chậm nhất)

```java
// 1 — Accessibility id
driver.findElement(AppiumBy.accessibilityId("login_button"));

// 2 — resource-id (ghi đủ package)
driver.findElement(AppiumBy.id("com.application.xyz:id/login_button"));

// 3 — UiSelector theo text
driver.findElement(AppiumBy.androidUIAutomator(
    "new UiSelector().text(\"Đăng nhập\")"));

// 4 — XPath TƯƠNG ĐỐI, bám thuộc tính chứ không bám vị trí
driver.findElement(AppiumBy.xpath("//android.widget.Button[@text='Đăng nhập']"));
```

---

## 2. Native iOS — thứ tự ưu tiên locator

1. `accessibility id` — map tới `accessibilityIdentifier` do dev đặt
2. `iOS predicate string` — nhanh, lọc theo nhiều thuộc tính
3. `iOS class chain` — khi cần đi theo cấu trúc cha–con
4. `xpath` — chậm nhất trên iOS, tránh tối đa

```java
// 1 — Accessibility id
driver.findElement(AppiumBy.accessibilityId("login_button"));

// 2 — Predicate string
driver.findElement(AppiumBy.iOSNsPredicateString(
    "type == 'XCUIElementTypeButton' AND label == 'Đăng nhập'"));

// 3 — Class chain (`**/` = tìm ở mọi cấp)
driver.findElement(AppiumBy.iOSClassChain(
    "**/XCUIElementTypeButton[`label == 'Đăng nhập'`]"));
```

### Phân biệt `name` / `label` / `value` — hay nhầm nhất trên iOS

| Thuộc tính | Là gì | Dùng để |
|---|---|---|
| `name` | `accessibilityIdentifier`, hoặc rơi về label nếu dev không đặt | Locator **ưu tiên** — dev đặt cố định, không đổi theo ngôn ngữ |
| `label` | Text người dùng đọc được | Assert nội dung. **Đổi theo ngôn ngữ** — app đa ngữ thì không dùng làm locator |
| `value` | Giá trị hiện tại (text đã nhập, trạng thái switch) | Assert trạng thái |

### Ghi chú môi trường iOS

- **Real device** cần WebDriverAgent đã ký (`xcodeOrgId`, `xcodeSigningId`, `updatedWDABundleId`) — chưa ký thì phiên không mở được, lỗi này **không** phải lỗi locator
- Dialog xin quyền: `autoAcceptAlerts: true` (hoặc `autoDismissAlerts`) trong capabilities
- Chạy song song nhiều device: mỗi device một `wdaLocalPort` riêng — xem mục 8
- **iOS (simulator lẫn máy thật) chỉ chạy được trên macOS.** Máy Windows / Linux phải dùng Appium server trên Mac hoặc dịch vụ cloud

---

## 3. Flutter — mục quan trọng nhất, đọc kỹ trước khi viết dòng code đầu tiên

### 3.1 Vì sao Flutter khác hẳn native

Flutter **vẽ toàn bộ giao diện lên một canvas**. Không có `android.widget.Button` hay `XCUIElementTypeButton` thật nào tồn tại. Mở Appium Inspector lên app Flutter thường **chỉ thấy đúng một node `FlutterView` rỗng**.

Element tree chỉ xuất hiện khi **accessibility bridge của Flutter sinh ra semantics node**. Không bật semantics thì **không có gì để tìm** — và đây là nguyên nhân số một khiến team tưởng "Appium không chạy được với Flutter".

### 3.2 Hai đường đi — chọn TRƯỚC khi viết code

| | **Đường A — Semantics + driver native** ⭐ mặc định cho Java | **Đường B — Flutter driver** |
|---|---|---|
| `automationName` | `UiAutomator2` / `XCUITest` | `Flutter` (appium-flutter-driver) hoặc `FlutterIntegration` |
| Build app cần | **Release cũng chạy** được | **Bắt buộc debug/profile** — release KHÔNG chạy |
| Locator | `accessibilityId` từ `Semantics` | `byValueKey`, `bySemanticsLabel`, `byText`, `byType` |
| Thấy được `Key('...')` trong code Flutter? | ❌ Không | ✅ Có |
| Client Java | ✅ Dùng java-client bình thường | ⚠️ Mỏng — hệ sinh thái chính là JS/Python |
| Hợp khi | **Đa số dự án Java**, test trên bản build như thật | Team Flutter chủ động, chấp nhận build riêng để test |

> **Mặc định chọn Đường A** cho stack Java. Chỉ sang Đường B khi dev cam kết cung cấp bản debug/profile **và** chấp nhận rủi ro client Java hạn chế. Chọn đường nào phải **ghi vào tài liệu framework**, không để mỗi người làm một kiểu.

### 3.3 Đường A — thoả thuận bắt buộc với dev

Đây là **việc phải chốt với dev trước**, không phải việc QA tự xoay được bằng locator giỏi:

```dart
// Dev PHẢI bọc widget cần test bằng Semantics
Semantics(
  label: 'login_button',        // → content-desc (Android) · accessibility label (iOS)
  child: ElevatedButton(...),
)
```

```java
// QA lấy được bằng accessibility id — chung cho cả 2 nền tảng
driver.findElement(AppiumBy.accessibilityId("login_button"));
```

**Ba điều phải nói rõ với dev:**

| Điều | Chi tiết |
|---|---|
| 🚨 `Key('login_btn')` **KHÔNG** ra `content-desc` | `Key` / `ValueKey` chỉ flutter driver (Đường B) thấy được. Dev đặt `Key` rồi báo "đã thêm id" là hiểu nhầm phổ biến nhất — Appium native vẫn không thấy gì |
| Semantics phải bật | Flutter chỉ sinh accessibility tree khi có a11y service, hoặc app gọi `SemanticsBinding.instance.ensureSemantics()`. Không bật thì hierarchy rỗng |
| Label đặt như id, không đặt như câu chữ | Dùng `login_button`, **không** dùng `'Đăng nhập'` — label kiểu text sẽ đổi khi app đa ngữ, và trùng với text hiển thị |

> Bản Flutter mới có `Semantics(identifier: ...)` map sang `resource-id` (Android) / `accessibilityIdentifier` (iOS) — tách bạch hơn `label` (vốn để cho screen reader đọc). **Kiểm chứng trên đúng version Flutter của dự án trước khi yêu cầu dev dùng**, đừng ghi vào tài liệu như mặc định.

### 3.4 Đường B — Flutter driver

- `automationName: 'Flutter'` cần app nhúng `flutter_driver` extension → **chỉ build debug/profile**
- `automationName: 'FlutterIntegration'` dựa trên `integration_test` → cũng cần build riêng
- Finder: `byValueKey('login_btn')` · `bySemanticsLabel(...)` · `byText(...)` · `byType('ElevatedButton')`
- Phải **đổi context sang `FLUTTER`** trước khi dùng finder; thao tác native (permission dialog, notification) vẫn phải quay về `NATIVE_APP`
- ⚠️ Java client cho đường này mỏng — trước khi cam kết với dự án, **dựng thử một test chạy được đã** rồi mới chốt

### 3.5 CẤM với Flutter

- ❌ Sinh locator khi hierarchy chỉ có `FlutterView` rỗng → **dừng lại, báo dev bật semantics**, không đoán XPath
- ❌ Dùng XPath đi vào trong `FlutterView` — cấu trúc semantics đổi theo mỗi lần render
- ❌ Dựa vào toạ độ (`tap(x, y)`) vì "không tìm được element" — đổi màn hình/độ phân giải là hỏng toàn bộ
- ❌ Trộn hai đường A và B trong cùng một suite

---

## 4. Hybrid / WebView — đổi context

App native nhúng WebView: element bên trong WebView **không** nằm trong native tree.

```java
// Xem có những context nào
Set<String> contexts = driver.getContextHandles();   // [NATIVE_APP, WEBVIEW_com.app]

// Sang WebView → dùng locator web (id, css)
driver.context("WEBVIEW_com.app");
driver.findElement(By.cssSelector("#submit")).click();

// BẮT BUỘC quay lại trước khi thao tác native
driver.context("NATIVE_APP");
```

- Quên `context("NATIVE_APP")` → mọi locator native sau đó fail, và log **không** chỉ ra nguyên nhân
- Android cần Chrome driver khớp version WebView của thiết bị

---

## 5. NGHIÊM CẤM (mọi loại app)

- **XPath tuyệt đối bám vị trí** — thay đổi layout nhỏ nhất cũng gãy:
  ```java
  // NGHIÊM CẤM
  driver.findElement(By.xpath(
      "//android.widget.FrameLayout[1]/android.widget.LinearLayout[2]/android.widget.Button[1]"));
  ```
- **`Thread.sleep()`** trong mọi trường hợp
- **Toạ độ cứng** `tap(540, 1200)` — khác độ phân giải là sai chỗ
- Truy vấn element ngoài màn hình mà **chưa scroll**
- Tương tác element `enabled=false` mà không kiểm tra trạng thái trước
- Dùng `label`/`text` hiển thị làm locator ở **app đa ngôn ngữ**

---

## 6. Chiến lược chờ đợi (Wait Strategy)

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

wait.until(ExpectedConditions.visibilityOfElementLocated(
    AppiumBy.accessibilityId("welcome_text")));

wait.until(ExpectedConditions.elementToBeClickable(
    AppiumBy.accessibilityId("submit_button")));
```

- Mobile chậm hơn web → timeout mặc định **15s** hợp lý hơn 10s
- **Không** dùng implicit wait chung với explicit wait — cộng dồn timeout khó lường
- Chờ animation kết thúc bằng điều kiện trạng thái (element clickable), **không** bằng sleep

---

## 7. Gesture — viết đúng theo nền tảng

| Việc | Android | iOS |
|---|---|---|
| Scroll đến element | `UiScrollable.scrollIntoView` | `mobile: scroll` với `predicateString` |
| Swipe | W3C Actions | `mobile: swipe` |

```java
// Android — cuộn tới element theo text
driver.findElement(AppiumBy.androidUIAutomator(
    "new UiScrollable(new UiSelector().scrollable(true))"
  + ".scrollIntoView(new UiSelector().text(\"Đăng nhập\"))"));

// iOS — cuộn trong container tới element khớp predicate
driver.executeScript("mobile: scroll", Map.of(
    "direction", "down",
    "predicateString", "label == 'Đăng nhập'"));
```

**Scroll trong Flutter (Đường A):** danh sách Flutter thường **chỉ render item đang hiển thị** — item chưa cuộn tới thì **chưa tồn tại** trong semantics tree, không phải "locator sai". Cuộn từng bước rồi tìm lại, không tăng timeout.

---

## 8. Chạy song song nhiều device

Số luồng = **số device thật**, không phải con số tuỳ chọn. Mỗi device bắt buộc:

| Capability | Nền tảng | Vì sao |
|---|---|---|
| `udid` | cả hai | Chỉ đích danh device |
| `systemPort` | Android | Port UiAutomator2 — trùng là hai phiên giẫm nhau |
| `wdaLocalPort` | iOS | Port WebDriverAgent — cùng lý do |

Cấu hình `testng.xml` multi-device: [`CODE_TEMPLATES.md`](../skills/skills-framework-architect/references/CODE_TEMPLATES.md) § 8.4.

---

## 9. Cấu trúc test (TestNG)

```java
public class LoginMobileTest extends BaseTest {

    @Test(groups = {"mobile", "regression"})
    public void testLoginSuccess() {
        // Arrange
        LoginScreen loginScreen = new LoginScreen(driver);
        String email = DataGenerator.generateEmail("loginMobile");

        // Act
        loginScreen.login(email, "ValidPass@123");

        // Assert
        HomeScreen homeScreen = new HomeScreen(driver);
        Assert.assertTrue(homeScreen.isWelcomeDisplayed(),
            "Màn hình Home phải hiển thị sau khi đăng nhập");
    }
}
```

- Mobile dùng **Screen Objects** (tương đương Page Objects) — hậu tố `Screen`: `LoginScreen.java`, `HomeScreen.java`
- Locator **khác nhau giữa Android và iOS** thì tách theo nền tảng trong Screen class, **không** viết `if (isAndroid)` rải khắp test
- Driver dùng `ThreadLocal`, `remove()` ở teardown — parallel luôn bật

---

## 10. Đặc thù mobile phải test

| Tình huống | Cách làm |
|---|---|
| **Xoay màn hình** | `driver.rotate(ScreenOrientation.LANDSCAPE)` — test nếu app hỗ trợ |
| **Background → foreground** | `driver.runAppInBackground(Duration.ofSeconds(5))` — kiểm state có giữ không |
| **Dialog xin quyền** | Android: `autoGrantPermissions: true` · iOS: `autoAcceptAlerts: true` |
| **Mất mạng giữa chừng** | Android: `mobile: setConnectivity` (UiAutomator2 — tắt wifi/data) · iOS: không có API, cần thiết bị có Network Link Conditioner hoặc người bật chế độ máy bay. Kiểm app báo lỗi tử tế hay crash |
| **Bàn phím che input** | Ẩn bàn phím trước khi tìm element bên dưới |
| **Push notification** | Verify qua notification listener |
