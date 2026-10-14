# Tiêu Chí Chấm Cột `Automation` — TC nào làm automation được

> **Nguồn:** lõi mục 3A lấy từ bài *Những chức năng không nên làm Automation Test* — Anh Tester, 13-01-2023 (<https://anhtester.com/blog/nhung-chuc-nang-khong-nen-lam-automation-test>). Bổ sung ngày 19-09-2026: tách từng mục thành `Partial` / `No` theo năng lực tool hiện nay (Playwright, Appium), thêm trục **TC có sẵn sàng** và trục **có đáng làm**. Dòng đánh dấu ➕ là mục bổ sung ngoài bài gốc.

| Nơi dùng file này | Làm gì |
|---|---|
| `skills-rbt-manual-testing` — QUICK · FULL RBT · DELTA | Chấm cột `Automation` cho TC vừa sinh / vừa sửa |
| `/review-testcases` **Mode AUTOMATION** (`skills-testcase-reviewer`) | Chấm độc lập một bộ TC bất kỳ — kể cả file Excel/CSV khách gửi không có cột `Automation` |

---

## 1. Ba giá trị của cột

| Giá trị | Nghĩa | Bắt buộc ghi kèm |
|---|---|---|
| `Yes` | Viết script được **ngay** với môi trường hiện có, chạy lại cho cùng kết quả | — |
| `Partial` | Tự động được khi có **điều kiện** mà dev/môi trường phải cấp (OTP cố định, hộp thư test, sandbox…), **hoặc** chỉ một phần Expected máy chấm được, phần còn lại kiểm tay | **Điều kiện** cần có, hoặc **phần nào kiểm tay** |
| `No` | Không tự động được, hoặc được nhưng không đáng | **Lý do** — trục nào chặn |

- Ô `Automation` ghi **đúng một từ** `Yes` / `Partial` / `No`. `scripts/testcases-viewer` lọc theo giá trị chính xác — ghi thêm chữ vào ô là TC rơi khỏi bộ lọc. Điều kiện, lý do ghi vào mục **Đối soát cột Automation** (mục 7)
- Điều kiện của `Partial` **đã có sẵn** trên môi trường (user xác nhận, hoặc ghi ở bảng năng lực của `docs/requirements/README.md`) → chấm `Yes`, vẫn liệt kê điều kiện đó ở mục 7 với trạng thái ✅ để biết TC phụ thuộc vào gì
- Cột chấm **tính khả thi lâu dài**, không chấm tình trạng hôm nay. Vướng **tạm thời** không hạ cột — xem mục 6

---

## 2. Cách chấm — 3 trục, lấy mức thấp nhất

```
Trục 1 — Kỹ thuật : tính năng / loại kiểm thử có tự động được không?   (mục 3)
Trục 2 — Sẵn sàng : bản thân TC có đủ để máy chạy và máy chấm không?   (mục 4)
Trục 3 — Đáng làm : công dựng có bù được bằng số lần chạy lại không?  (mục 5)

Kết quả = mức THẤP NHẤT của 3 trục        No < Partial < Yes
```

- **Chấm theo Expected cốt lõi** — mục tiêu chính mà TC sinh ra để kiểm. Expected cốt lõi bị chặn `No` → cả TC `No`. Chỉ **bước phụ / Expected phụ** bị chặn (VD bước cuối "mở email xác nhận") → `Partial`, ghi rõ bước nào kiểm tay — **không** chấm `No` cả TC
- TC chạm nhiều tính năng (đăng ký có OTP rồi xem biểu đồ) → tra từng dòng, lấy mức thấp nhất
- **TC viết mơ hồ** (bước không cụ thể, Expected kiểu "hoạt động đúng") → **không chấm được**. Khi sinh TC: sửa TC trước. Khi review độc lập: ghi `❓ Chưa chấm được`, đề xuất `/review-testcases` Mode REVIEW — đó là lỗi cách viết, không phải giới hạn automation

---

## 3. Trục 1 — Khả thi kỹ thuật

### 3A. Theo tính năng

Cột **Dấu hiệu** dùng khi review một bộ TC bất kỳ: đọc Title / Steps / Expected / Test Data, gặp các từ này thì tra đúng dòng.

| Tính năng | Dấu hiệu trong TC | Mặc định | Cách làm / điều kiện để chạy được | Còn `No` khi |
|---|---|---|---|---|
| **Drag and Drop HTML5** | kéo, thả, sắp xếp bằng chuột, kanban | Playwright: `Yes` · Selenium: `Partial` | Playwright `dragTo()` phát được sự kiện HTML5. Selenium `Actions` thường không kích hoạt được `dragstart`/`drop` → giả lập bằng JS | Kéo thả trên canvas |
| **Captcha / reCAPTCHA** | captcha, "tôi không phải người máy", chọn ảnh | `Partial` | Môi trường test tắt CAPTCHA, hoặc dùng test key của reCAPTCHA (luôn qua). TC chỉ kiểm CAPTCHA **có hiện** (sau N lần sai) → `Yes` | Môi trường chỉ có CAPTCHA thật. 🚫 **Không bao giờ** giải CAPTCHA bằng OCR hay dịch vụ giải |
| **SMS / OTP** | OTP, mã xác thực gửi về điện thoại, SMS | `Partial` | OTP cố định trên môi trường test · API nội bộ trả OTP · số ảo nhận SMS qua API. OTP kiểu app xác thực (TOTP) mà tài khoản test có sẵn secret → sinh mã bằng thư viện TOTP → `Yes` | OTP về SIM thật của người dùng thật |
| ➕ **Email** | gửi email, link xác nhận, quên mật khẩu, email thông báo | `Partial` | Hộp thư test đọc được qua API (Mailpit, MailHog, Mailosaur…) hoặc môi trường test trả mail qua API/log | Mail về hộp thư cá nhân · kiểm email hiển thị đẹp trên Gmail/Outlook |
| **Chart** | biểu đồ, đồ thị, chart | Số liệu: `Partial` · Hình vẽ: `No` | Kiểm **số liệu** qua API / tooltip / bảng dữ liệu đi kèm. Biểu đồ vẽ bằng SVG → đọc được nhãn, số từ màn hình | Kiểm hình dạng, màu, tỷ lệ cột bằng mắt · biểu đồ vẽ canvas không có nguồn số liệu nào khác |
| **Calendar** | chọn ngày, lịch, datepicker | `Yes` | Điền thẳng ô ngày hoặc chọn ngày theo nhãn. Ngày tương đối ("hôm nay", "7 ngày tới") → cố định đồng hồ (Playwright `page.clock`), đừng phụ thuộc ngày chạy | Kéo-thả sự kiện trên lịch lưới → theo dòng Drag and Drop |
| **PDF** | xuất PDF, tải hoá đơn, xem PDF | Nội dung chữ: `Yes` · Bố cục: `No` | Tải file về, đọc text bằng thư viện PDF (pdf-parse, Apache PDFBox) | Kiểm bố cục, font, hiển thị trong trình xem PDF |
| **Print** | in, bản in, Ctrl+P | Hộp thoại in: `No` · Nội dung khi in: `Partial` | Giả lập media print (Playwright `emulateMedia({ media: 'print' })`) → kiểm bản in đủ nội dung, đã ẩn menu | Hộp thoại in, máy in, bản in giấy |
| **Compare Images** | ảnh hiển thị đúng, giống thiết kế, đúng logo | `Partial` | Visual regression (`toHaveScreenshot`) trên **một** môi trường cố định (cùng OS, font, trình duyệt — thường là Docker); ảnh gốc phải được người duyệt. Chỉ kiểm ảnh **có hiện** / đúng file → `Yes` | Chạy lẫn nhiều máy (lệch pixel, flaky) · so với bản thiết kế Figma |
| **Canvas / Flash / Flex** | canvas, bảng vẽ, game, ô ký tên | `No` | App expose trạng thái qua JS / test hook / lớp accessibility → `Partial` | Flash/Flex: đã khai tử (Adobe ngừng hỗ trợ Flash Player từ 31-12-2020) |
| **Map** | bản đồ, vị trí, chỉ đường, marker | `Partial` | Giả lập vị trí (Playwright `setGeolocation` / Appium geolocation) · kiểm dữ liệu vị trí qua API · marker là phần tử DOM thì đọc được | Kiểm bản đồ vẽ đúng, tuyến đường đúng trên hình |
| **Chat / Real-time** | chat, tin nhắn, cập nhật tức thì | `Yes` | Mở **2 browser context** (2 người dùng) trong cùng test, chờ tin nhắn hiện bằng auto-wait — không sleep | Đo độ trễ, nhiều người dùng đồng thời → công cụ hiệu năng |
| **Video / Camera** | quay video, chụp ảnh, gọi video | Web: `Partial` · Mobile máy thật: `No` | Web: Chrome giả lập camera bằng file (`--use-fake-device-for-media-stream` + `--use-file-for-fake-video-capture`). Phát video → kiểm trạng thái player (đang phát, thời lượng). Mobile cho chọn ảnh từ thư viện → đẩy ảnh vào thiết bị → `Partial` | Chất lượng hình / tiếng · camera máy thật |
| **QR scan** | quét QR, scan mã | `Partial` | Web: nạp ảnh QR qua camera giả lập · Mobile: chọn ảnh QR từ thư viện · hoặc đi thẳng đường dẫn / deep link mà QR mã hoá. App **sinh** QR → giải mã ảnh chụp (jsQR, ZXing) → `Yes` | Chỉ quét được bằng camera máy thật |
| **Biometrics** | vân tay, Face ID, Touch ID, sinh trắc | Emulator/simulator: `Partial` · Máy thật: `No` | Android emulator: Appium `fingerPrint` / `adb -e emu finger touch <id>` · iOS simulator: `mobile: enrollBiometric` + `mobile: sendBiometricMatch` | Máy thật · kiểm độ chính xác nhận diện |
| **eKYC** | eKYC, chụp CCCD, xác thực khuôn mặt, liveness | `No` | Luồng **sau** eKYC: mock phản hồi hoặc sandbox của nhà cung cấp → `Partial` | Độ chính xác OCR giấy tờ, so khớp khuôn mặt, liveness — việc của nhà cung cấp |
| **Login Google / Facebook / SSO** | đăng nhập bằng Google, SSO, Microsoft | `Partial` | Đăng nhập qua API/token rồi nạp phiên (Playwright `storageState`) · môi trường test cho tài khoản thường · SSO nội bộ có realm test | Tự động **màn hình đăng nhập của Google/Facebook** — nhà cung cấp phát hiện trình duyệt tự động, chặn hoặc đòi xác minh thêm |
| ➕ **Thanh toán** | thanh toán, cổng thanh toán, thẻ, ví | `Partial` | Sandbox của cổng (thẻ test của Stripe, sandbox VNPay / MoMo) | Cổng thật, tiền thật — 🚫 không bao giờ |
| ➕ **Phụ thuộc thời gian thật** | sau 30 phút, hết hạn, lúc 0h, cuối tháng, sau 24 giờ | `Partial` | Phía trình duyệt: cố định/tua đồng hồ (`page.clock`). Phía **server** (hết phiên, job định kỳ) `page.clock` **không** tác động → cần thời hạn ngắn trên môi trường test hoặc API kích hoạt job | Phải chờ thời gian thật (hàng giờ, qua đêm) |
| ➕ **Push notification** | thông báo đẩy, notification | Android: `Partial` · iOS: `No` | Android: mở khay thông báo (`openNotifications`) rồi đọc nội dung; cần cách bắn push trên môi trường test | iOS — không có đường đọc khay thông báo ổn định |
| ➕ **Mất mạng** | mất kết nối, offline, chế độ máy bay | Web · Android: `Yes` · iOS: `No` | Web: `context.setOffline(true)` · Android: `mobile: setConnectivity` | iOS không có API tắt mạng ([`appium_rules.md`](../../../rules/appium_rules.md) §10) |
| ➕ **Chọn file / tải file / hộp thoại quyền** | tải lên, chọn file, tải về, cho phép quyền | `Yes` | Web: `setInputFiles` không cần mở hộp thoại; tải về → bắt sự kiện download · Mobile: `autoGrantPermissions` / thao tác hộp thoại quyền | Hộp thoại của hệ điều hành không gắn với ô tải lên |

### 3B. Theo loại kiểm thử — khớp Bản Đồ 4 Vòng

TC không chạm tính năng nào ở 3A → chấm theo nhánh của nó:

| Vòng · Nhánh | Mặc định | Ghi chú |
|---|---|---|
| V1 · UI cơ bản · Open form · Display · Input valid data · Save · Verify data | `Yes` | Nhãn nguyên văn, thứ tự field, giá trị mặc định, định dạng hiển thị đều đọc được từ màn hình |
| V2 · Required · Validation · EP · BVA · Decision Table | `Yes` | **ROI cao nhất** — nhiều biến thể chạy bằng một test tham số hoá |
| V2 · Business Rule · State Transition · Dependency · Use Case · Save/Edit/Delete | `Yes` | Tiền đề phải dựng được bằng script — xem Trục 2 |
| V2 · UI Behavior | `Yes` | Field bật/tắt, nút khoá/mở đọc được. Hiệu ứng "mượt", animation → phần đó kiểm tay |
| V2 · Error Guessing | `Yes` | TC cụ thể (bấm Lưu hai lần, dán ký tự lạ) chấm như TC thường |
| V3 · Permission | `Yes` | Cần tài khoản test cho từng role |
| V3 · Security | Payload cố định vào field (XSS, SQLi), truy cập khi chưa đăng nhập: `Yes` · Quét lỗ hổng / pentest: `No` | Quét lỗ hổng dùng công cụ chuyên (OWASP ZAP…), không phải script chức năng |
| V3 · API | `Yes` | `Auto Type` = `API` |
| V3 · Database | `Partial` | Cần quyền truy vấn CSDL — ô năng lực QA ở `docs/requirements/README.md` |
| V3 · Integration | `Partial` | Cần môi trường test của bên thứ ba, hoặc mock (`/generate-api-mocks`) |
| V3 · Logging / Audit | Màn hình nhật ký trong app: `Yes` · Log server: `Partial` | Log server cần quyền đọc |
| V4 · Compatibility | `Yes` | Chạy lại cùng test trên nhiều trình duyệt / thiết bị |
| V4 · Responsive | Phần tử hiện/ẩn theo kích thước: `Yes` · "Bố cục không vỡ, cân đối": `No` | Visual regression → `Partial` theo dòng Compare Images |
| V4 · Accessibility | Thứ tự Tab, focus, nhãn field: `Yes` · Quét quy tắc (axe-core): `Partial` · Trải nghiệm với trình đọc màn hình: `No` | Công cụ quét chỉ bắt được một phần lỗi a11y |
| V4 · Performance | Ngưỡng quan sát được ("tải xong trong 3 giây"): `Partial` · Tải / chịu tải: `No` (`Auto Type` = `N/A`) | Đo thời gian trong script chức năng dao động theo máy và mạng — chỉ để cảnh báo. Tải thật dùng công cụ riêng (k6, JMeter) |
| V4 · Regression | Chấm theo TC gốc | TC tái hiện bug đã đóng là ứng viên automate **ưu tiên** — xem mục 5 |
| V4 · E2E | Theo tính năng yếu nhất trên đường đi | Tra từng bước ở 3A |
| Ngoài 4 vòng · Usability, cảm nhận ("dễ dùng", "đẹp", "thân thiện") | `No` | Cần người phán đoán |

---

## 4. Trục 2 — TC có sẵn sàng cho máy không

| # | Câu hỏi | Trượt thì | Ví dụ |
|---|---|---|---|
| 1 | **Máy chấm được Expected không?** Mỗi Expected cốt lõi phải quy về thứ máy đọc được: chữ trên màn hình, trạng thái phần tử, URL, dữ liệu qua API/CSDL, file tải về | Expected cốt lõi cần mắt người → `No`. Chỉ Expected phụ → `Partial` | ❌ "Giao diện cân đối, dễ nhìn" · ✅ "Nút Lưu bị khoá, dòng báo `Email is required` hiện dưới ô Email" |
| 2 | **Script tự dựng được tiền đề không?** Dữ liệu và trạng thái tạo được qua UI, API hoặc seed | Cần người khác thao tác, cần thiết bị vật lý, dữ liệu không tái tạo được → `Partial` (ghi cách dựng cần có) hoặc `No` | "Có khách hàng nợ quá hạn 90 ngày" mà không có cách đặt ngày tạo → `Partial`, cần seed dữ liệu |
| 3 | **Chạy lại có cho cùng kết quả không?** | Kết quả phụ thuộc ngẫu nhiên, thời điểm chạy, dữ liệu người khác đang sửa → `Partial`: assert cấu trúc thay vì nội dung, cố định đồng hồ, dùng dữ liệu riêng của test | "Mục Gợi ý hiển thị đúng sản phẩm" — thuật toán gợi ý thay đổi theo thời gian |
| 4 | **Chạy được trên môi trường hiện có không?** Môi trường **dùng chung** (bảng năng lực ở `docs/requirements/README.md`) cấm phá dữ liệu người khác | TC phải xoá hàng loạt, đổi cấu hình toàn hệ thống, khoá tài khoản dùng chung → `Partial`, điều kiện "cần môi trường riêng" | "Đổi cấu hình SMTP toàn hệ thống rồi gửi thử" |

---

## 5. Trục 3 — Có đáng làm không

TC đạt `Yes` / `Partial` ở hai trục trên **hạ xuống `No`** khi:

| Tình huống | Vì sao |
|---|---|
| Chạy **một lần** rồi thôi — kiểm migration dữ liệu một lần, kiểm cấu hình khởi tạo lúc bàn giao | Công viết script không bao giờ thu hồi |
| Điều kiện `Partial` chỉ mở khoá 1–2 TC mà phải dựng **hạ tầng mới** (hộp thư test, sandbox riêng), và TC chỉ chạy vài lần mỗi đợt | Chạy tay rẻ hơn. Ghi rõ lý do — khi có thêm TC dùng chung điều kiện đó thì chấm lại |

**Thứ tự ưu tiên automate** trong số TC `Yes` — ghi vào báo cáo / mục đối soát, **không** đổi cột:

1. `@Smoke` · `@CriticalPath` — chạy mỗi build
2. TC có nhiều biến thể (độ hạt GỘP) ở Validation · BVA · EP — một test tham số hoá thay hàng chục lần nhập tay
3. TC tái hiện bug đã đóng (nhánh Regression) — chặn lỗi quay lại
4. TC phải chạy trên nhiều trình duyệt / thiết bị
5. `@Regression` Priority High → phần còn lại

---

## 6. Vướng tạm thời — KHÔNG hạ cột, ghi `⏸️ Hoãn`

| Vướng | Xử lý |
|---|---|
| AMB 🔴 **chưa chốt** — chưa biết Expected đúng là gì | Hoãn tới khi chốt |
| `@NeedsVerify` — Expected chưa có evidence | Hoãn tới khi recon xong |
| Màn hình đang thiết kế lại, REQ đổi liên tục trong sprint | Hoãn — locator và Expected sẽ đổi |
| Tính năng chưa lên môi trường test | Hoãn |
| ✅ **Không phải vướng:** TC đang FAIL vì bug (`@KnownBug`, AMB đã kết luận là lỗi) | **Vẫn automate** — test FAIL chính là thứ phơi bug |

Cột `Automation` giữ nguyên giá trị thật (`Yes`/`Partial`/`No`); trạng thái `⏸️ Hoãn` chỉ ghi ở mục đối soát / báo cáo.

---

## 7. Ghi kết quả vào đâu

### 7.1 Khi sinh TC — mục `## Đối soát cột Automation` ở file index

Đặt trong `TEST_CASES_<TÊN_MODULE>_SUMMARY.md`, **sau** mục `## Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)`:

```markdown
## Đối soát cột Automation

| Nền tảng | Yes | Partial | No | ⏸️ Hoãn |
|---|---|---|---|---|
| Web | 38 | 9 | 4 | 2 |

### Điều kiện cần chuẩn bị
| # | Điều kiện | Ai cấp | Trạng thái | TC phụ thuộc |
|---|---|---|---|---|
| 1 | OTP cố định trên môi trường test | Dev backend | ⏳ Chưa có | TC_012, TC_013, TC_027 |
| 2 | Hộp thư test đọc được qua API | DevOps | ✅ Đã có | TC_031, TC_032 |

### TC Partial · No · Hoãn
| TC ID | Nền tảng | Automation | Trục chặn | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|
| CRM_LOGIN_TC_012 | Web | Partial | 1 · SMS/OTP | Điều kiện #1 |
| CRM_LOGIN_TC_044 | Web | No | 2 · Expected cần mắt người | "Bố cục cân đối ở 1366px" — kiểm tay |
| CRM_LOGIN_TC_050 | Web | Yes · ⏸️ Hoãn | — | Chờ chốt AMB-LOGIN-03 |
```

- TC `Yes` không vướng gì → **không** liệt kê, bảng chỉ chứa ngoại lệ
- TC `@Deprecated` (chức năng đã gỡ) **không** đếm vào bảng số lượng — giữ nguyên giá trị cột `Automation` cũ, script tương ứng đánh dấu skip ở tầng automation
- 🚨 Bảng có cột `TC ID` nhưng **không** có cột nội dung TC → viewer bỏ qua, không đếm trùng. **Không** đặt tên cột chứa `Expected` / `Scenario` / `Test Steps` / `Test Title` trong bảng này — viewer sẽ nhận nhầm thành dòng TC

### 7.2 Khi review độc lập — báo cáo riêng

`/review-testcases` Mode AUTOMATION ghi báo cáo `review/automation_review_<nền-tảng>_<YYYYMMDD>.md` — mẫu ở skill `skills-testcase-reviewer`, mục *Mode AUTOMATION*.

---

## 8. Ví dụ chấm

| TC | Trục 1 | Trục 2 | Trục 3 | Kết quả |
|---|---|---|---|---|
| Nhập sai mật khẩu 5 lần → tài khoản bị khoá, hiện thông báo khoá | `Yes` (V2 · Business Rule) | `Yes` — tài khoản test tự tạo | `Yes` | **`Yes`** |
| Đăng ký → nhập OTP gửi qua SMS → vào Dashboard | `Partial` (SMS/OTP) | `Yes` | `Yes` | **`Partial`** — cần OTP cố định |
| Quên mật khẩu → mở email → bấm link → đặt mật khẩu mới | `Partial` (Email) | `Yes` | `Yes` | **`Partial`** — cần hộp thư test |
| Dashboard hiển thị biểu đồ doanh thu đúng số liệu tháng | `Partial` (Chart) | `Yes` | `Yes` | **`Partial`** — kiểm số qua API/tooltip, hình vẽ kiểm tay |
| Đăng nhập bằng Google | `Partial` (SSO) | `Yes` | `Yes` | **`Partial`** — đăng nhập qua token, không tự động màn hình Google |
| Form hiển thị cân đối ở màn hình 1366px | `Yes` (V4 · Responsive) | `No` — cần mắt người | — | **`No`** |
| In hoá đơn ra máy in đúng khổ A5 | `No` (Print) | — | — | **`No`** |
| Kiểm dữ liệu khách hàng sau migration một lần từ hệ thống cũ | `Yes` | `Yes` | `No` — chạy một lần | **`No`** |
