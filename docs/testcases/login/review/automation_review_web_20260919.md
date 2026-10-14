# Đánh Giá Khả Năng Automation — `LOGIN` · Web

## Tổng quan

- **Nguồn:** [web/test_cases_login_web.md](../web/test_cases_login_web.md) · **Số TC:** 51 (`CRM_LOGIN_TC_001` → `CRM_LOGIN_TC_051`)
- **Tiêu chí:** `.claude/skills/skills-rbt-manual-testing/references/automation_criteria.md`
- **Ngày chấm:** 19-09-2026 · `/review-testcases` Mode AUTOMATION
- **Stack giả định khi chấm:** Playwright (Chromium · Firefox · kênh `msedge`). Selenium vẫn làm được mọi TC `Yes` bên dưới, riêng `TC_040` (mất mạng) và `TC_041` (mạng chậm) phải đi qua CDP của ChromeDriver
- **Kết quả:** ✅ Yes 44 (trong đó ⏸️ Hoãn 2) · 🟡 Partial 4 · ⛔ No 3 · ❓ Chưa chấm được 0
- **Automate được ngay:** 42/51 · **khi đủ điều kiện và chốt xong 2 bug:** 48/51

> 📌 **Về tính độc lập:** file TC để cột `Automation` chung bảng với nội dung, nên cột này hiện ra ngay lúc đọc. Mọi kết luận dưới đây chấm theo tiêu chí và có căn cứ riêng. Kết quả lệch với cột hiện có ở **11 TC**, theo cả hai chiều.

### Căn cứ môi trường đã dùng

| Nguồn | Nội dung | Ảnh hưởng tới kết quả chấm |
|---|---|---|
| `docs/requirements/README.md` — Năng lực QA | Gọi API ❌ · CSDL ❌ · Tích hợp ❌ · DevTools ✅ | Không TC nào cần API/CSDL phía sau. Phần 🔧 của các TC chỉ đọc **dữ liệu của chính trình duyệt** (cookie, request, DOM, header), script đọc trực tiếp được, không cần quyền gì thêm |
| `docs/requirements/README.md` — Môi trường | **Dùng chung** | Trục 2 #3–#4: những TC mà dữ liệu của người khác có thể làm đổi kết quả thì hạ xuống `Partial` |
| `.env` (chỉ xem tên khoá) | Có `ADMIN_*`, `PM_*`, `CUSTOMER_*` · **không có** `TC014_EMAIL` / `TC014_PASSWORD` | `TC_014` thiếu tiền đề → `Partial` |
| `docs/bugs/login/web/` | Bug `TC004`, `TC029` **chưa có kết luận của PO** (chính bug report cũng ghi "có thể là thiết kế có chủ đích") | Chưa biết Expected nào đúng → `⏸️ Hoãn` |

---

## Điều kiện cần chuẩn bị (xếp theo số TC mở khoá)

| # | Điều kiện | Ai cấp | Trạng thái | Số TC | TC phụ thuộc |
|---|---|---|---|---|---|
| 1 | **Tài khoản staff riêng cho automation, có quyền Tasks.** Bộ đếm giờ gắn theo từng staff, mà `admin@example.com` thì nhiều người dùng chung. Ai đó để timer chạy trên tài khoản này là huy hiệu không còn là `1` và hộp xác nhận bật lên sai lúc | Admin hệ thống / PO | ❓ Chưa rõ. Có thể dùng lại tài khoản của `TC_014` nếu tài khoản đó có quyền Tasks | 2 | TC_034, TC_035 |
| 2 | **Khai `TC014_EMAIL` / `TC014_PASSWORD` vào `.env`.** Tài khoản đã có (người dùng chạy tay ở `run_1789759574`) nhưng `.env` chưa có khoá | QA (người dùng) | ⏳ Chưa có trong `.env` | 1 | TC_014 |
| 3 | **PO chốt bug `TC004` và `TC029`: lỗi thật hay hành vi chấp nhận được** | PO | ⏳ Chưa chốt | 2 (Hoãn) | TC_004, TC_029 |

> Điều kiện #1 chỉ mở khoá 2 TC nhưng **không** phải dựng hạ tầng mới, chỉ cần một tài khoản, nên chưa đủ lý do hạ xuống `No` theo Trục 3.

---

## Chi tiết từng TC

> Chỉ TC khác `Yes`, và TC `Yes` cần kỹ thuật không hiển nhiên, mới có ghi chú ở cột cuối. Ghi chú kỹ thuật là gợi ý để viết script, không phải điều kiện.

### Nhóm A — Giao diện trang đăng nhập

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_001 | Mở trang đăng nhập khi chưa có phiên | Yes | — | — | HTTP `200` đọc từ `response.status()` |
| CRM_LOGIN_TC_002 | Biểu mẫu đủ thành phần, đúng trạng thái mặc định | Yes | — | — | Assert **trạng thái** (`toBeFocused`, `not.toBeChecked`, `toBeEnabled`, `type=password`), **không** assert màu. Mục `6` bấm vào `<label>` |
| CRM_LOGIN_TC_003 | Không CAPTCHA, không đăng nhập bên thứ ba, không JS | Yes | — | — | Đếm phần tử bằng locator. Mục `3`: đếm `<script>` + lắng nghe request loại `script` = 0 |
| CRM_LOGIN_TC_004 | Bấm logo thì về trang chủ công khai | Yes · ⏸️ Hoãn | — | *"Thanh địa chỉ dừng ở `https://crm.anhtester.com/`"* | Đo lại 19-09-2026: `/` trả `303` → `/authentication/login`. Bug [TC004](../../../bugs/login/web/BUG_login_1787226513_TC004.md) chưa có kết luận của PO → **chờ điều kiện #3** |

### Nhóm B — Đăng nhập thành công & Ghi nhớ đăng nhập

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_005 | Đăng nhập Admin → Dashboard | Yes | — | — | — |
| CRM_LOGIN_TC_006 | Đăng nhập PM → menu rút gọn | Yes | — | — | `PM_*` đã có trong `.env` |
| CRM_LOGIN_TC_007 | Email chuẩn hoá hoa/thường, khoảng trắng | Yes | — | — | 4 biến thể → 1 test tham số hoá |
| CRM_LOGIN_TC_008 | Tích Remember me → phát hành cookie ghi nhớ | Yes | — | — | Phần chấm thật nằm ở dòng 🔧, và script đọc được: `context.cookies()` → có `autologin`, `key` khớp `/^[0-9a-f]{16}$/`. Context mới luôn sạch cookie nên tiền đề xoá cookie tự thoả. 🔒 Chỉ assert hình thái, không log giá trị |
| CRM_LOGIN_TC_009 | Không tích → không có cookie ghi nhớ | Yes | — | — | Như `TC_008`: sau khi gửi form, `context.cookies()` không có `autologin` |
| CRM_LOGIN_TC_010 | Bấm Login hai lần liên tiếp | Yes | — | — | Tiêu chí 3B xếp *"bấm Lưu hai lần"* vào Error Guessing, chấm `Yes`. Dùng `dblclick()`; assertion vẫn đúng dù khe tranh chấp mỗi lần một khác |

### Nhóm C — Dữ liệu đầu vào & Đăng nhập thất bại

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_011 | Trường bắt buộc | Yes | — | — | 4 biến thể, assert đúng thứ tự dải báo lỗi |
| CRM_LOGIN_TC_012 | Email sai định dạng bị trình duyệt chặn | Yes | — | — | Assert `input.validity.valid === false` và **không** có request `POST`. Không assert nội dung bong bóng, đúng như TC dặn |
| CRM_LOGIN_TC_013 | Thông báo chung, không lộ email có thật | Yes | — | — | So 2 bộ (text · số dải · URL) trong cùng test |
| CRM_LOGIN_TC_014 | Mật khẩu sai hoa/thường bị từ chối | Partial | 2 · Tiền đề | *"Đã có tài khoản staff test … khai trong `.env` bằng `TC014_EMAIL` / `TC014_PASSWORD`"* | `.env` hiện **không** có hai khoá này → **điều kiện #2**. Khai xong thì lên `Yes` |
| CRM_LOGIN_TC_015 | Sai nhiều lần không khoá tài khoản / IP | Yes | — | — | `REQ-LOGIN-41` đã chốt không khoá, chạy an toàn trên môi trường dùng chung. Có thể kiểm thêm phần 🔧: không phản hồi nào trả `429` |
| CRM_LOGIN_TC_016 | 🐞 Ô Email giữ email sau khi đăng nhập lỗi | Yes | — | — | `@KnownBug`, **không** hoãn: test FAIL chính là thứ phơi bug. Context mới không có tự điền nên không bị PASS giả như khi chạy tay |
| CRM_LOGIN_TC_017 | Chuỗi XSS / SQLi ở ô Password | Yes | — | — | `page.on('dialog')` phải không bắn lần nào |
| CRM_LOGIN_TC_018 | Mật khẩu đa ngôn ngữ + emoji | Yes | — | — | — |
| CRM_LOGIN_TC_019 | Tài khoản khách hàng bị từ chối ở khu quản trị | Yes | — | — | `CUSTOMER_*` đã có trong `.env` |
| CRM_LOGIN_TC_020 | Phiên cổng khách hàng không mở được `/admin` | Yes | — | — | — |

### Nhóm D — Bảo vệ phiên, điều hướng & CSRF

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_021 | URL nội bộ khi chưa đăng nhập → trang đăng nhập | Yes | — | — | — |
| CRM_LOGIN_TC_022 | Không giữ URL đích | Yes | — | — | — |
| CRM_LOGIN_TC_023 | Đang có phiên mở trang đăng nhập / Quên MK → Dashboard | Yes | — | — | 4 biến thể = 2 vai trò × 2 URL |
| CRM_LOGIN_TC_024 | Mã CSRF đúng hình thái, gửi kèm khi submit | Yes | — | — | Toàn bộ dòng 🔧 máy đọc được: `getAttribute('value')` khớp `/^[0-9a-f]{32}$/` · reload so sánh cùng giá trị · `request.postData()` có đủ 4 tham số. Ô tích thao tác theo `check()`, **không** theo `value="estimate"` (`AMB-LOGIN-11`) |
| CRM_LOGIN_TC_025 | Mã CSRF sai → `419 Page Expired!` | Yes | — | — | Sửa ô ẩn bằng `locator.evaluate(el => el.value = …)`. Chấm theo **chữ trên trang**, không theo mã HTTP (`AMB-LOGIN-08`) |
| CRM_LOGIN_TC_026 | Phiên hết hạn sau 1 giờ không thao tác | No | 1 · Thời gian thật · 3 · Không đáng làm | *"Để yên trình duyệt **65 phút**"* | Hết phiên là việc **phía server**, `page.clock` không tác động được. Muốn chạy nhanh phải rút ngắn thời hạn phiên, mà đó là cấu hình toàn hệ thống trên môi trường **dùng chung** (Trục 2 #4). Cần môi trường riêng, chỉ để mở 2 TC. Người dùng cũng đã quyết định QA tự chạy (`@PersonalOnly`) |
| CRM_LOGIN_TC_051 | Thao tác thì phiên được gia hạn | No | 1 · Thời gian thật · 3 · Không đáng làm | *"TC chạy mất khoảng 70 phút"* | Cùng lý do với `TC_026` |

### Nhóm E — Quên mật khẩu

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_027 | Trang Quên MK đủ thành phần, không có lối quay lại | Yes | — | — | Đếm `<a>` = 1 |
| CRM_LOGIN_TC_028 | 🐞 Bỏ trống email phải báo trường bắt buộc | Yes | — | — | `@KnownBug`, PO đã xác nhận là lỗi → automate, không hoãn |
| CRM_LOGIN_TC_029 | Email không tồn tại → `Email not found` | Yes · ⏸️ Hoãn | — | *"ô Email trở về rỗng"* | Hiện trạng: form gửi bằng AJAX nên ô **giữ nguyên** giá trị. Bug [TC029](../../../bugs/login/web/BUG_login_1787226517_TC029.md) tự ghi *"cần xác nhận với PO trước khi coi là bug"* → **chờ điều kiện #3**. Phần `Email not found` + URL đã ổn định, có thể viết trước và hoãn riêng assertion ô Email |
| CRM_LOGIN_TC_030 | Email sai định dạng ở Quên MK | Yes | — | — | Như `TC_012` |
| CRM_LOGIN_TC_031 | Link đặt lại mật khẩu không hợp lệ → `500` thân rỗng | Yes | — | — | `Auto Type` = `API`. Đây là GET một URL công khai, **không** thuộc diện "gọi API" trong bảng năng lực QA. `request.get()` → status `500`, `body().length === 0` |

### Nhóm F — Đăng xuất & cookie ghi nhớ

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_032 | Lối đăng xuất duy nhất ở viewport desktop | Yes | — | — | Locator đã chốt sẵn trong TC: `.dropdown-menu > li.header-logout`. **Không** dùng `li:last-child` |
| CRM_LOGIN_TC_033 | Đăng xuất ở viewport mobile | Yes | — | — | `setViewportSize({ width: 375, height: 812 })` rồi reload |
| CRM_LOGIN_TC_034 | Đăng xuất khi timer đang chạy phải xác nhận | Partial | 2 · Chạy lại cùng kết quả | *"Biểu tượng đồng hồ đầu trang có huy hiệu số `1`"* · *"danh sách ghi `No started timers found`"* | Timer gắn với tài khoản `admin@example.com`, mà tài khoản này dùng chung → **điều kiện #1**. Dữ liệu tự dựng + tự dọn thì đã đạt (run_1789759574 PASS) |
| CRM_LOGIN_TC_035 | Không có timer thì Logout đi thẳng | Partial | 2 · Chạy lại cùng kết quả | *"**không** có bộ đếm giờ công việc nào đang chạy"* | Script không tự đảm bảo được tiền đề: dừng timer của người khác là thao tác phá dữ liệu → **điều kiện #1** |
| CRM_LOGIN_TC_036 | Đăng xuất kết thúc phiên, Back không lộ dữ liệu | Yes | — | — | `page.goBack()` rồi assert URL + không có bảng khách hàng |
| CRM_LOGIN_TC_037 | Cookie ghi nhớ còn nhưng vô hiệu sau đăng xuất | Yes | — | — | Điểm TC muốn chứng minh là "cookie còn nhưng vô hiệu", và cả hai vế đều đọc được: `context.cookies()` vẫn có `autologin` + URL dừng ở `/admin/authentication` |

### Nhóm G — Phi chức năng

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_038 | Điều hướng bằng bàn phím, viền tiêu điểm rõ | Partial | 2 · Expected phụ cần mắt người | *"khác nhau rõ ràng bằng mắt"* | Script chấm được thứ tự Tab, `toBeFocused()`, `Space` tích ô, `Enter` gửi form, và **có khác biệt** `border-color` giữa ô có tiêu điểm và ô không. Viền **có đủ rõ** hay không vẫn phải kiểm tay |
| CRM_LOGIN_TC_039 | 🐞 HTTP thuần phải ép sang HTTPS | Yes | — | — | `@KnownBug` → automate. Chấm bằng `request.get('http://…', { maxRedirects: 0 })`: status `301`/`308` + header `Location` · bản HTTPS có `Strict-Transport-Security`. Không phụ thuộc HTTPS-Upgrades của Chrome, nên không PASS giả |
| CRM_LOGIN_TC_040 | Mất mạng giữa lúc gửi form | Yes | — | — | Tiêu chí 3A, dòng *Mất mạng*: Web → `Yes`. Dùng `context.setOffline(true)`, click → điều hướng lỗi `ERR_INTERNET_DISCONNECTED`, rồi `setOffline(false)` và mở `/admin/` |
| CRM_LOGIN_TC_041 | Đăng nhập trên mạng chậm | Yes | — | — | Không có ngưỡng thời gian nào để đo, Expected thuần chức năng. Giả lập `Slow 3G` bằng CDP `Network.emulateNetworkConditions` (**chỉ Chromium**) và nâng timeout riêng cho test này |

### Nhóm H — Hành vi ô nhập và nút bấm

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_042 | Ô Password che ký tự, dán được, không có nút hiện/ẩn | Yes | — | — | Cấp quyền `clipboard-read`/`clipboard-write` (Chromium), ghi clipboard rồi `Control+V`. Kiểm "không có nút hiện/ẩn" bằng số phần tử tương tác được trong form |
| CRM_LOGIN_TC_043 | Nút Login luôn bấm được | Yes | — | — | `toBeEnabled()` + `cursor: pointer` từ computed style. Assert trạng thái, không assert màu |
| CRM_LOGIN_TC_044 | Không chặn tự điền / đề nghị lưu mật khẩu | No | 1 · Giao diện của trình duyệt | *"quan sát hộp thoại nhỏ của trình duyệt ở đầu thanh địa chỉ"* | Hộp *Lưu mật khẩu?* là giao diện riêng của Chrome, không nằm trong DOM. Playwright mở trình duyệt với trình quản lý mật khẩu **đã tắt**. Muốn phủ bằng máy thì tách phần 🔧 (hai ô không đặt `autocomplete="off"`) thành một assertion trong `TC_002` |

### Nhóm I — Giới hạn độ dài

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_045 | Phần trước `@` đúng mốc 64 ký tự | Yes | — | — | Sinh chuỗi bằng `'a'.repeat(n)`. Bước "đếm số ký tự" → `inputValue().length` |
| CRM_LOGIN_TC_046 | Vượt mốc 64 ký tự bị chặn định dạng | Yes | — | — | Gộp `TC_045` + `TC_046` thành một test tham số hoá 63/64/65/100/250 |
| CRM_LOGIN_TC_047 | Mật khẩu rất dài không làm hệ thống lỗi | Yes | — | — | — |
| CRM_LOGIN_TC_048 | Ô Email không cắt chuỗi dài | Yes | — | — | `fill('a'.repeat(300))` → `inputValue().length === 300`. Ô Password đo được cùng cách, tiện phủ luôn |

### Nhóm K — Tương thích & đáp ứng màn hình

| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_049 | Bố cục đúng ở 5 kích thước màn hình | Yes | — | — | TC đã quy "bố cục không vỡ" ra các thuộc tính đo được: `scrollWidth <= clientWidth` · 7 thành phần hiển thị · khung căn giữa · nút rộng bằng ô nhập. Tất cả đọc được qua `boundingBox()`. "Chữ không đè" chấm bằng không giao nhau giữa 7 hộp đã liệt kê |
| CRM_LOGIN_TC_050 | Chạy trên Chrome · Edge · Firefox | Yes | — | — | 3 `projects` trong `playwright.config`: `chromium` · `channel: 'msedge'` · `firefox`. Runner CI phải cài Edge (`npx playwright install msedge`) |

---

## Lệch so với cột Automation hiện có

| TC ID | Cột hiện tại | Chấm lại | Vì sao |
|---|---|---|---|
| CRM_LOGIN_TC_008 | Partial | Yes | Cookie ghi nhớ là trạng thái của trình duyệt, `context.cookies()` đọc được. Người chạy tay mới cần DevTools, script thì không |
| CRM_LOGIN_TC_009 | Partial | Yes | Như `TC_008` |
| CRM_LOGIN_TC_010 | Partial | Yes | Tiêu chí 3B chấm *"bấm Lưu hai lần"* là Error Guessing → `Yes`. Assertion không phụ thuộc thời điểm cú bấm thứ hai rơi vào |
| CRM_LOGIN_TC_024 | Partial | Yes | Ô ẩn, việc giữ mã sau reload, và thân `POST` đều đọc được từ script. Mục 🔧`2` đã có evidence 19-09-2026 (`ASM-05` ✅) |
| CRM_LOGIN_TC_037 | Partial | Yes | Như `TC_008` |
| CRM_LOGIN_TC_040 | Partial | Yes | Tiêu chí 3A dòng *Mất mạng*: Web → `Yes` qua `context.setOffline()`. Không phải rút cáp mạng |
| CRM_LOGIN_TC_041 | Partial | Yes | Throttling qua CDP. Expected không có ngưỡng thời gian nên không rơi vào nhánh V4 · Performance |
| CRM_LOGIN_TC_014 | Yes | Partial | Tiền đề `TC014_EMAIL` / `TC014_PASSWORD` **chưa có trong `.env`** (điều kiện #2) |
| CRM_LOGIN_TC_034 | Yes | Partial | Trục 2 #3: tài khoản admin dùng chung, timer của người khác làm đổi huy hiệu `1` (điều kiện #1) |
| CRM_LOGIN_TC_035 | Yes | Partial | Trục 2 #3: script không tự dựng được tiền đề "không có timer nào chạy" mà không đụng dữ liệu người khác (điều kiện #1) |
| CRM_LOGIN_TC_038 | Yes | Partial | Trục 2 #1: *"khác nhau rõ ràng bằng mắt"*. Độ rõ của viền tiêu điểm là phần kiểm tay |

> Ba TC `No` (`TC_026`, `TC_044`, `TC_051`) **khớp** với cột hiện có.

---

## Thứ tự automate đề xuất (nhóm Yes)

1. **`@Smoke` · `@CriticalPath`**: `TC_005` → `TC_001`, `TC_002`, `TC_011-a`, `TC_013-a`, `TC_021-a`, `TC_032`, `TC_036-a`. Nhóm B đi đầu vì `RISK-LOGIN-06`: đây là cổng vào của 23 module còn lại. `TC_035` thuộc Smoke nhưng còn chờ điều kiện #1
2. **Nhiều biến thể, một test tham số hoá**: `TC_045`+`TC_046` (5 mốc độ dài) · `TC_012` (5) · `TC_049` (5 kích thước) · `TC_007` (4) · `TC_011` (4) · `TC_023` (4) · `TC_050` (3 trình duyệt) · `TC_047`, `TC_017`, `TC_015`, `TC_025`, `TC_031`
3. **Phơi bug / chặn lỗi quay lại**: `TC_016`, `TC_028`, `TC_039` (`@KnownBug`, FAIL cho tới khi dev sửa) · `TC_046-c` (bug `TC018` đã đóng)
4. **Kiểm cookie / CSRF**, loại tester nghiệp vụ không tự chạy được: `TC_008`, `TC_009`, `TC_024`, `TC_037`. Automation phủ nhóm này thì bộ `@TechCheck` bớt tải cho người
5. **Phần còn lại, Priority High trước**: `TC_006`, `TC_019`, `TC_020`, `TC_022`, `TC_027`, `TC_030`, `TC_033`, `TC_036-b`, `TC_010`, `TC_040`, `TC_041`, `TC_042`, `TC_043`, `TC_048`, `TC_003`, `TC_018`

> 🧪 **Test data khi viết script:** các chuỗi cố định như `notexist_20260820@auto.test` và `SaiMatKhau_20260820` phải sinh theo mẫu `test name + timestamp`, theo `CLAUDE.md` mục 7. Việc này không đổi kết quả chấm, vì chỉ là chuỗi đầu vào, không phải dữ liệu tạo ra trên hệ thống.

---

## Ghi chú ngoài phạm vi Mode AUTOMATION

Những mục dưới đây là lỗi cách viết hoặc tài liệu cũ, không ảnh hưởng kết quả chấm. Sửa bằng `/review-testcases` Mode FIX nếu cần:

| # | Chỗ | Vấn đề |
|---|---|---|
| 1 | Index `TEST_CASES_LOGIN_SUMMARY.md` · `## Bộ chạy đề xuất`, dòng *Chờ recon bổ sung* | Vẫn ghi `TC_024 (chỉ mục 🔧2)` là `@NeedsVerify`, trong khi mục *Vùng chưa có evidence* và Nhật ký 19-09-2026 đã ghi là đã đo xong. Hai mục mâu thuẫn nhau |
| 2 | File web · bảng *🐞 Ba TC nhiều khả năng FAIL* | Thiếu `TC_004` và `TC_029`, cả hai đang FAIL và có bug mở |
| 3 | `TC_004`, `TC_029` · cột Tags | Không có `@KnownBug` / 🐞 như `TC_016`, `TC_028`, `TC_039`, dù đều có bug đang mở |

---

## Kết luận & Khuyến nghị

1. **Bắt đầu ngay được 42/51 TC.** Làm Smoke trước (mục 1 thứ tự), rồi đến nhóm tham số hoá. Hai nhóm này chiếm phần lớn giá trị
2. **Khai `TC014_EMAIL` / `TC014_PASSWORD` vào `.env`.** Việc này làm trong một phút và mở khoá `TC_014`
3. **Xin một tài khoản staff riêng có quyền Tasks** (hoặc kiểm xem tài khoản `TC_014` có quyền đó không). Có tài khoản này thì `TC_034` và `TC_035` (Smoke) không còn phụ thuộc người dùng chung `admin@example.com`
4. **Đưa bug `TC004`, `TC029` cho PO chốt.** Chốt xong thì hai TC hết Hoãn: là lỗi thì automate như `@KnownBug`, là thiết kế thì sửa Expected trước rồi mới automate
5. **Automation sẽ phủ phần 🔧 của 25 TC `@TechCheck`.** Nhờ đó 4 TC cookie/CSRF (`008`, `009`, `024`, `037`) lên `Yes`, và bộ chạy tay không còn cần người biết DevTools cho nhóm này
