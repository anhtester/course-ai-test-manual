# Đặc tả Yêu cầu — Module Đăng nhập / Xác thực (`LOGIN`)

> Điểm vào cấp hệ thống: [../README.md](../README.md) · Bản đồ khám phá: [../_discovery/modules/module_01_dang_nhap.md](../_discovery/modules/module_01_dang_nhap.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | Perfex CRM — Anh Tester Demo |
| **Module** | Đăng nhập / Xác thực |
| **Prefix** | `LOGIN` |
| **Route** | `/admin/authentication` · `/admin/authentication/forgot_password` · `/admin/authentication/reset_password/<id>/<key>` · `/admin/authentication/logout` |
| **Nguồn phân tích** | Khảo sát UI thực tế + tầng network (Playwright MCP, headed 1600×750) |
| **Ngày phân tích** | 2026-08-14 · **rà soát và kiểm chứng lại 2026-08-18** |
| **Trình duyệt khảo sát** | Google Chrome (Playwright MCP), viewport `1600×750`. Mọi AC dựa trên thông báo mặc định của trình duyệt **chỉ đúng với Chrome** — xem `REQ-LOGIN-13` |
| **Tài khoản dùng khảo sát** | 1 tài khoản duy nhất — hiển thị "Admin Example", `user-id-2` |
| **Môi trường dùng chung** | **CÓ** — mọi thao tác đều chỉ đọc hoặc có thể hoàn tác; không gửi mail đặt lại mật khẩu cho tài khoản thật |
| **Tổng số REQ** | **43** — trong đó **39** nằm trong phạm vi viết TC; 4 REQ ra ngoài phạm vi theo quyết định PO 2026-08-18 (`27`, `34`, `35`, `40`) |
| **Dải mã đã dùng** | `REQ-LOGIN-01` → `REQ-LOGIN-43` · `AMB-01` → `AMB-19` · `RISK-01` → `RISK-08` |
| **Mã kế tiếp** | Đợt phân tích sau bắt đầu từ `REQ-LOGIN-44` · `AMB-20` · `RISK-09` — **KHÔNG đánh lại từ 01** |
| **Ambiguity còn treo** | **1** ❓ — chỉ còn `AMB-19` 🟡 (phiên 1 giờ tính theo cách nào). Đã xử lý 18/19 |
| **Tài khoản kiểm thử** | Đủ **3 vai trò** `Admin` · `Project Manager` · `Customer` — lưu ở `.env`, **KHÔNG** ghi vào tài liệu |

---

## 1. Tổng quan

Module Đăng nhập là **cổng vào duy nhất** của khu quản trị `/admin`. Mọi module nghiệp vụ khác đều nằm sau lớp xác thực này, nên module hỏng đồng nghĩa chặn toàn bộ đợt kiểm thử.

Module gồm **4 màn hình / điểm cuối**:

| Màn hình | Route | Vai trò |
|---|---|---|
| Đăng nhập | `/admin/authentication` | Nhập email + mật khẩu, tuỳ chọn ghi nhớ đăng nhập |
| Quên mật khẩu | `/admin/authentication/forgot_password` | Nhập email để nhận liên kết đặt lại |
| Đặt lại mật khẩu | `/admin/authentication/reset_password/<id>/<key>` | Liên kết gửi qua email |
| Đăng xuất | `/admin/authentication/logout` | Kết thúc phiên |

### Trong phạm vi

- Xác thực bằng email + mật khẩu, xử lý lỗi và thông báo
- Tuỳ chọn **Remember me** và cookie `autologin`
- Bảo vệ URL nội bộ khi chưa đăng nhập, điều hướng khi đã đăng nhập
- Bảo vệ CSRF trên biểu mẫu đăng nhập
- Luồng Quên mật khẩu (đến bước gửi biểu mẫu) và luồng Đăng xuất

### Ngoài phạm vi

| Vùng | Lý do |
|---|---|
| Đăng nhập cổng khách hàng (front-end ngoài `/admin`) | `system_map.md` mục 7 — chưa chốt phạm vi |
| **Luồng gửi mail đặt lại mật khẩu với email có thật** (`REQ-LOGIN-27`) | ⏭️ Quyết định PO 2026-08-18 — bỏ qua case này (`AMB-04`). Kéo theo `RISK-04` chuyển sang *đã chấp nhận* |
| **Tính năng Ghi nhớ đăng nhập** (`REQ-LOGIN-40`) | ⏭️ Quyết định PO 2026-08-18 — PO xác nhận **không hoạt động** (`AMB-15`). Ba REQ đã kiểm chứng về cookie (`08`, `09`, `39`) **vẫn trong phạm vi**; chỉ hành vi tự đăng nhập là ngoài phạm vi |
| **Kiểm chứng đầu-cuối popup cảnh báo timer** (`REQ-LOGIN-30`) | ⏭️ Quyết định 2026-08-18 — chuyển sang module `TASK` (`AMB-14`). Bản thân REQ **vẫn thuộc** module này |
| Quản lý tài khoản / vai trò (`/admin/staff`, `/admin/roles`) | 403 với tài khoản hiện tại — thuộc khu Setup ngoài phạm vi |
| Đổi ngôn ngữ giao diện sau đăng nhập | Thuộc module `PROF` |

---

## 2. Bản đồ phủ tài liệu

**Không có tài liệu nào cho module này** — toàn bộ 35 REQ sinh từ khảo sát UI thực tế và tầng network ngày 2026-08-14. Không có spec, ticket, file field hay mockup kèm theo.

---

## 3. Yêu cầu Chức năng

> Quy ước cột `Nguồn`: `Kiểm chứng thực tế` = đã tương tác và xác nhận trên UI · `UI thực tế` = chỉ quan sát, chưa tương tác · `DOM` = đọc bằng `browser_evaluate` · `Network` = quan sát thụ động request do UI phát sinh.

### 3.1. Giao diện trang đăng nhập (STORY-LOGIN-01)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-LOGIN-01 | Truy cập trang đăng nhập | Người dùng chưa đăng nhập mở `/admin/authentication` thì thấy biểu mẫu đăng nhập | Trang trả HTTP 200 · tiêu đề tab `Perfex CRM \| Anh Tester Demo - Login` · tiêu đề trang `Login` · `body` mang class `login_admin` | 🟢 | — | Kiểm chứng thực tế + DOM |
| REQ-LOGIN-02 | Thành phần biểu mẫu đăng nhập | Biểu mẫu gồm đúng 3 control nhập liệu, 1 nút gửi và 1 liên kết | Có `Email Address` (`input#email[type=email]`), `Password` (`input#password[type=password]`, hiển thị dạng chấm che), checkbox `Remember me` (`input#remember`), nút `Login` (`button[type=submit]`), liên kết `Forgot Password?`. Biểu mẫu `POST` về chính `/admin/authentication` | 🟢 | — | DOM |
| REQ-LOGIN-03 | Tự động đặt con trỏ vào ô Email | Mở trang thì con trỏ nằm sẵn ở ô Email Address | `input#email` mang thuộc tính `autofocus="1"` | 🟢 | — | DOM |
| REQ-LOGIN-04 | Logo dẫn về trang chủ | Bấm logo trên trang đăng nhập thì về trang chủ công khai | Liên kết bọc logo trỏ tới `https://crm.anhtester.com/` | 🟢 | — | DOM |
| REQ-LOGIN-05 | Không có CAPTCHA | Trang đăng nhập ở trạng thái mặc định không hiển thị CAPTCHA | Không tồn tại phần tử `.g-recaptcha`, `[class*=captcha]`, `iframe[src*=recaptcha]` | 🟡 | 2026-08-18 · rà soát | DOM |
| REQ-LOGIN-36 | Không có đăng nhập mạng xã hội | Trang đăng nhập không có nút đăng nhập bên thứ ba | Không tồn tại nút/liên kết đăng nhập qua Google, Facebook, Microsoft hay nhà cung cấp OAuth nào. Toàn trang chỉ có **1** `<form>` và **1** `<button[type=submit]>` | 🟢 | — | DOM |
| REQ-LOGIN-37 | Trang đăng nhập không nạp tệp JavaScript nào | Toàn bộ kiểm tra dữ liệu chạy ở máy chủ, trang không phụ thuộc script phía trình duyệt | Đếm được **0** `<script>` inline và **0** `<script src>` trên `/admin/authentication` | 🟢 | — | DOM |

### 3.2. Đăng nhập thành công (STORY-LOGIN-02)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-LOGIN-06 | Đăng nhập bằng thông tin hợp lệ | Nhập đúng email và mật khẩu thì vào được khu quản trị | `POST /admin/authentication` trả **303** với header `location: https://crm.anhtester.com/admin/` · trình duyệt dừng ở `/admin/` · tiêu đề tab **chứa** chuỗi `Dashboard` · `body.className` **chứa đủ** 4 token `app` `admin` `dashboard` `user-id-2` | 🟡 | 2026-08-18 · rà soát | Kiểm chứng thực tế + Network |
| REQ-LOGIN-07 | Email không phân biệt hoa thường | Nhập email khác kiểu chữ vẫn đăng nhập được | Nhập `ADMIN@Example.COM` kèm mật khẩu đúng → đăng nhập thành công, chuyển tới `/admin/` | 🟡 | 2026-08-18 · rà soát | Kiểm chứng thực tế |
| REQ-LOGIN-38 | Email bỏ qua khoảng trắng thừa đầu/cuối | Nhập email kèm khoảng trắng đầu/cuối vẫn đăng nhập được | Nhập `  admin@example.com  ` (2 khoảng trắng mỗi đầu) kèm mật khẩu đúng → đăng nhập thành công, chuyển tới `/admin/` | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-08 | Ghi nhớ đăng nhập sinh cookie `autologin` | Tích **Remember me** trước khi đăng nhập thì hệ thống phát hành cookie ghi nhớ | Từ trạng thái **không có** cookie `autologin`: tích Remember me rồi đăng nhập → xuất hiện cookie `autologin` chứa chuỗi PHP-serialize đúng hình thái `a:2:{s:7:"user_id";s:1:"<id>";s:3:"key";s:16:"<16 ký tự hex>";}` — kiểm **hình thái và độ dài key**, KHÔNG kiểm giá trị cụ thể | 🟢 | 2026-08-18 · kiểm chứng lại | Kiểm chứng thực tế + DOM |
| REQ-LOGIN-09 | Không tích Ghi nhớ thì không phát hành cookie `autologin` | Đăng nhập khi **Remember me** bỏ trống thì hoàn toàn không có cookie ghi nhớ | **Phép thử trạng thái sạch (bắt buộc theo đúng thứ tự):** (1) xoá cookie `autologin` khỏi trình duyệt, (2) đăng xuất, (3) xác nhận `document.cookie` **rỗng** và `#remember.checked = false`, (4) đăng nhập bằng thông tin đúng → sau khi vào `/admin/`, cookie `autologin` **không tồn tại** (`document.cookie` rỗng) | 🟡 | 2026-08-18 · sửa phép thử | Kiểm chứng thực tế + DOM |

### 3.3. Kiểm tra dữ liệu đầu vào & đăng nhập thất bại (STORY-LOGIN-03)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-LOGIN-10 | Bỏ trống cả hai trường | Gửi biểu mẫu rỗng thì hiện đủ hai thông báo bắt buộc | Trang nạp lại và hiển thị **2** banner `.alert.alert-danger.text-center`, thứ tự trên xuống: `The Password field is required.` rồi `The Email Address field is required.` | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-11 | Bỏ trống riêng Email | Nhập mật khẩu, để trống email thì báo thiếu email | Hiển thị **duy nhất 1** banner: `The Email Address field is required.` — không kiểm tra tiếp thông tin đăng nhập | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-12 | Bỏ trống riêng Mật khẩu | Nhập email, để trống mật khẩu thì báo thiếu mật khẩu | Hiển thị **duy nhất 1** banner: `The Password field is required.` — không kiểm tra tiếp thông tin đăng nhập | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-13 | Chặn email sai định dạng ngay tại trình duyệt | Email thiếu ký tự `@` thì trình duyệt chặn gửi biểu mẫu, không gọi tới máy chủ | Nhập `abc` → `input#email.checkValidity()` trả `false` · **không** phát sinh request POST · trang không nạp lại.<br>⚠️ **Nội dung `validationMessage` do TRÌNH DUYỆT sinh, không phải của ứng dụng — không dùng làm assertion cross-browser.** Trên **Google Chrome** (trình duyệt khảo sát): `Please include an '@' in the email address. 'abc' is missing an '@'.` · Firefox/Safari trả chuỗi khác. TC chỉ được assert `checkValidity() === false` | 🟡 | 2026-08-18 · rà soát | Kiểm chứng thực tế + DOM + Network |
| REQ-LOGIN-14 | Thông báo khi sai thông tin đăng nhập | Sai email hoặc sai mật khẩu đều trả về một thông báo chung | Hiển thị đúng 1 banner `.alert.alert-danger`: `Invalid email or password` · người dùng vẫn ở `/admin/authentication` | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-15 | Thông báo lỗi không tiết lộ email nào có thật | Email không tồn tại và email có thật nhưng sai mật khẩu phải cho cùng một thông báo | Gửi `notexist_20260814@auto.test` + mật khẩu bất kỳ → `Invalid email or password`. Gửi `admin@example.com` + mật khẩu sai → **cùng chuỗi** `Invalid email or password`. Không có khác biệt về nội dung, số lượng banner hay URL | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-41 | Không khoá tài khoản sau nhiều lần đăng nhập sai | Hệ thống **không có** cơ chế khoá tài khoản theo số lần đăng nhập thất bại | Đăng nhập sai mật khẩu nhiều lần liên tiếp với cùng một email → mọi lần đều nhận đúng banner `Invalid email or password`, **không** xuất hiện thông báo khoá hay hạn chế nào · ngay sau đó đăng nhập bằng mật khẩu đúng **vẫn thành công**. Không khoá theo email, không khoá theo IP | 🟢 | — | Quyết định PO 2026-08-18 — giải quyết `AMB-02` |
| REQ-LOGIN-16 | Máy chủ **phải** giữ lại email đã nhập sau khi đăng nhập thất bại | Sau lỗi đăng nhập, HTML do máy chủ trả về phải điền sẵn email người dùng vừa nhập | `input#email` trong HTML máy chủ trả về **phải** mang thuộc tính `value` bằng đúng email vừa gửi lên.<br>🐞 **Hiện trạng KHÔNG đạt:** `getAttribute('value')` = `null` — máy chủ không trả lại giá trị. PO xác nhận đây là **lỗi hệ thống** (`AMB-10` ✅). TC viết theo REQ này **sẽ FAIL** trên bản hiện tại — đó là kết quả đúng, phải mở bug chứ không sửa TC.<br>⚠️ Kiểm ở **tầng HTML máy chủ trả về**, không kiểm trên màn hình: trình duyệt tự điền lại giá trị cũ (nền xanh autofill ở `login_form_wrong_credentials_fullpage.png`) nên nhìn màn hình sẽ tưởng đã đạt | 🟡 | 2026-08-18 · PO xác nhận là lỗi (`AMB-10`) | Quyết định PO 2026-08-18 · hiện trạng đọc từ DOM |

### 3.4. Bảo vệ phiên & điều hướng (STORY-LOGIN-04)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-LOGIN-17 | Chặn URL nội bộ khi chưa đăng nhập | Mở thẳng một URL trong `/admin` khi chưa đăng nhập thì bị đưa về trang đăng nhập | `GET /admin/clients` khi chưa đăng nhập → bị chuyển hướng, trình duyệt dừng ở `/admin/authentication`.<br>⚠️ **Assert điểm dừng, KHÔNG assert mã chuyển hướng.** Đợt khảo sát ghi nhận **307** trên tab Network — giá trị bất thường cho chuyển hướng xác thực (thường là 302/303) và chưa loại trừ được khả năng là cách công cụ ghi nhận. Xem `AMB-17` | 🟡 | 2026-08-18 · rà soát | Kiểm chứng thực tế + Network |
| REQ-LOGIN-18 | Không ghi nhớ URL đích sau khi chuyển hướng | Bị đưa về trang đăng nhập thì URL đích ban đầu không được giữ lại | URL sau chuyển hướng là `/admin/authentication` **trần** — không có tham số `?redirect=`, `?return_url=` hay tương đương. Đăng nhập xong vào Dashboard, không quay lại `/admin/clients` | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-19 | Đã đăng nhập thì không vào lại trang đăng nhập | Người dùng đang có phiên mở `/admin/authentication` sẽ được đưa về Dashboard | Mở `/admin/authentication` khi đang đăng nhập → dừng ở `/admin/`, tiêu đề tab **chứa** `Dashboard` | 🟡 | 2026-08-18 · rà soát | Kiểm chứng thực tế |
| REQ-LOGIN-20 | Đã đăng nhập thì không vào trang Quên mật khẩu | Người dùng đang có phiên mở trang Quên mật khẩu sẽ được đưa về Dashboard | Mở `/admin/authentication/forgot_password` khi đang đăng nhập → dừng ở `/admin/`, tiêu đề tab **chứa** `Dashboard` | 🟡 | 2026-08-18 · rà soát | Kiểm chứng thực tế |
| REQ-LOGIN-43 | Tài khoản khách hàng không đăng nhập được vào khu quản trị | Tài khoản thuộc cổng khách hàng bị từ chối ở `/admin`, kể cả khi thông tin đăng nhập đúng | Gửi biểu mẫu `/admin/authentication` bằng tài khoản khách hàng **hợp lệ** → hiển thị đúng **1** banner `Invalid email or password`, vẫn ở `/admin/authentication`, **không** tạo phiên.<br>✅ Đã loại trừ khả năng sai mật khẩu: cùng tài khoản đó đăng nhập **thành công** ở `/login` (cổng khách hàng).<br>✅ Đang có phiên cổng khách hàng hợp lệ mà mở `/admin/clients` vẫn bị đưa về `/admin/authentication`.<br>🔒 Thông báo **giống hệt** trường hợp email không tồn tại (`REQ-LOGIN-15`) — không lộ ra rằng email này có tài khoản ở hệ thống khác | 🟢 | — | Kiểm chứng thực tế 2026-08-18 (3 tài khoản) |
| REQ-LOGIN-42 | Phiên đăng nhập hết hạn sau 1 giờ | Phiên sống **1 giờ**; hết hạn thì mọi URL nội bộ bị đưa về trang đăng nhập | Sau khi đăng nhập, để phiên quá **1 giờ** rồi mở một URL trong `/admin` → bị chuyển về `/admin/authentication` như trường hợp chưa đăng nhập (`REQ-LOGIN-17`).<br>⚠️ **Chưa rõ 1 giờ tính theo cách nào** — không hoạt động hay tổng thời gian từ lúc đăng nhập (`AMB-19`). TC gắn nhãn `assumption-based`, tạm hiểu là **thời gian không hoạt động**.<br>⏱️ TC này chạy **1 giờ**, không xếp vào bộ smoke | 🟢 | — | Quyết định PO 2026-08-18 — giải quyết `AMB-13` |
| REQ-LOGIN-21 | Biểu mẫu đăng nhập mang mã chống CSRF | Mỗi lần nạp trang đăng nhập, biểu mẫu chứa một trường ẩn chống giả mạo yêu cầu | Tồn tại `input[type=hidden][name=csrf_token_name]` với giá trị 32 ký tự hex · body của `POST /admin/authentication` chứa `csrf_token_name=<token>&email=…&password=…` | 🟢 | — | DOM + Network |
| REQ-LOGIN-22 | Từ chối yêu cầu có mã CSRF sai | Gửi biểu mẫu với mã CSRF bị sửa thì bị chặn, không xử lý đăng nhập | Sửa `csrf_token_name` thành giá trị tuỳ ý rồi gửi → máy chủ trả **HTTP 403**, tiêu đề tab `Error`, nội dung nguyên văn: `419 Page Expired!` và `Sorry, the page has expired, return to previous page and refresh to continue.` | 🟢 | — | Kiểm chứng thực tế + Network |

### 3.5. Quên mật khẩu (STORY-LOGIN-05)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-LOGIN-23 | Truy cập trang Quên mật khẩu | Bấm `Forgot Password?` trên trang đăng nhập thì mở biểu mẫu khôi phục | Liên kết trỏ tới `/admin/authentication/forgot_password` · trang có tiêu đề `Forgot Password` · gồm đúng 1 ô `Email Address` (`input#email[type=email]`) và nút `Confirm` · `POST` về chính URL đó · có trường ẩn `csrf_token_name` | 🟢 | — | Kiểm chứng thực tế + DOM |
| REQ-LOGIN-24 | Trang Quên mật khẩu không có lối quay lại đăng nhập | Trên trang Quên mật khẩu, liên kết duy nhất là logo về trang chủ | Toàn trang chỉ có **1** thẻ `<a>`, trỏ tới `https://crm.anhtester.com/`. Không có liên kết nào về `/admin/authentication` | 🟢 | — | DOM |
| REQ-LOGIN-25 | Gửi biểu mẫu Quên mật khẩu khi bỏ trống email | Bỏ trống ô email rồi bấm Confirm thì hệ thống **phải** báo thiếu trường bắt buộc | Hiển thị banner báo **trường bắt buộc** cho ô Email — nhất quán với trang đăng nhập (`The Email Address field is required.` ở `REQ-LOGIN-11`).<br>🐞 **Hiện trạng KHÔNG đạt:** hệ thống trả `Email not found`, tức báo sai bản chất lỗi và làm người dùng tưởng email của mình không tồn tại. PO xác nhận là **thiếu validate trường bắt buộc** (`AMB-05` ✅). TC viết theo REQ này **sẽ FAIL** trên bản hiện tại — phải mở bug chứ không sửa TC | 🟡 | 2026-08-18 · PO xác nhận là lỗi (`AMB-05`) | Quyết định PO 2026-08-18 · hiện trạng kiểm chứng thực tế |
| REQ-LOGIN-26 | Email không tồn tại trong hệ thống | Nhập email không có trong hệ thống thì báo không tìm thấy | Nhập `notexist_20260814@auto.test` → banner `Email not found` · vẫn ở `/admin/authentication/forgot_password` | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-27 | Email tồn tại thì gửi liên kết đặt lại mật khẩu | Nhập email có thật thì hệ thống gửi email chứa liên kết đặt lại | ❔ **Chưa kiểm chứng và sẽ KHÔNG kiểm chứng** — `AMB-04` ⏭️ bỏ qua theo quyết định 2026-08-18. Yêu cầu này ra **ngoài phạm vi kiểm thử**, không viết TC. Giữ dòng để không mất dấu vết | ⚪ | 2026-08-18 · ra ngoài phạm vi | Suy diễn từ sự tồn tại của route `reset_password` |
| REQ-LOGIN-28 | Liên kết đặt lại mật khẩu sai/hết hạn | Mở liên kết đặt lại với mã khoá không hợp lệ | `GET /admin/authentication/reset_password/<id>/<mã khoá sai>` → **HTTP 500**, thân phản hồi rỗng, người dùng thấy trang lỗi mặc định của trình duyệt. **Không** có trang thông báo thân thiện.<br>✅ **Đây là hành vi được chấp nhận**, không phải bug cần mở — `AMB-03` ⏭️ bỏ qua 2026-08-18. TC ghi nhận đúng hiện trạng (HTTP 500 + thân rỗng), **không** kỳ vọng trang thông báo thân thiện | 🟡 | 2026-08-18 · chốt chấp nhận hiện trạng (`AMB-03`) | Kiểm chứng thực tế + Network |

### 3.6. Đăng xuất (STORY-LOGIN-06)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-LOGIN-29 | Mỗi viewport có **một** lối đăng xuất dùng được | Desktop đăng xuất qua menu ảnh đại diện; mobile đăng xuất qua menu điều hướng thu gọn | DOM có **2** phần tử `li.header-logout`, mỗi cái phục vụ **một** viewport — không bao giờ dùng được cả hai cùng lúc:<br>• **Desktop** (`1600×750`, ✅ đã kiểm chứng) — dùng được cái trong `.dropdown-menu` của `li.header-user-profile`: hộp `160×64`, `offsetParent ≠ null`. Cái còn lại hộp `0×0`, `offsetParent === null` vì tổ tiên `div.mobile-navbar.collapse` + `div.mobile-menu` đều `display: none`<br>• **Mobile** (⚠️ **chưa recon**, nguồn là quyết định PO `AMB-16` ✅) — dùng được cái trong `ul.nav.navbar-nav` thuộc `div.mobile-navbar`<br>⚠️ Locator desktop phải là `.dropdown-menu > li.header-logout` (**con trực tiếp**): menu có **32** `<li>` lồng trong submenu Language, nên `.dropdown-menu li:last-child` trỏ nhầm sang một mục ngôn ngữ<br>🚧 **Muốn viết TC cho nhánh mobile thì phải recon ở viewport mobile trước** — hiện chưa có số liệu DOM nào cho nhánh đó | 🟡 | 2026-08-18 · bổ sung nhánh mobile (`AMB-16`) | Desktop: kiểm chứng thực tế + DOM · Mobile: quyết định PO 2026-08-18 |
| REQ-LOGIN-30 | Cảnh báo khi còn bộ đếm giờ đang chạy | Đăng xuất trong lúc còn timer công việc đang chạy thì phải xác nhận | Hàm `logout()` kiểm tra `$(".started-timers-top").find("li.timer").length > 0`; nếu có thì mở popup với nội dung nguyên văn `Started tasks timers found!` / `Are you sure you want to logout without stopping the timers?` kèm nút `Logout` trỏ tới `/admin/authentication/logout`, và **không** đăng xuất ngay.<br>🔗 **Kiểm chứng đầu-cuối thuộc module `TASK`** (`AMB-14` ⏭️ 2026-08-18) — module `TASK` sở hữu tính năng timer. Bằng chứng hiện tại dừng ở mức đọc mã nguồn; khi recon `TASK` phải chạy thật rồi **cập nhật ngược** REQ này | 🟡 | 2026-08-18 · chuyển việc kiểm chứng sang `TASK` | DOM (mã nguồn hàm `logout()` + template `#timers-logout-template-warning`) |
| REQ-LOGIN-31 | Đăng xuất ngay khi không có bộ đếm giờ | Không có timer nào chạy thì bấm Logout là đi thẳng | Hàm `logout()` gán `window.location.href = admin_url + "authentication/logout"` mà không hỏi lại | 🟢 | — | DOM (mã nguồn hàm `logout()`) |
| REQ-LOGIN-32 | Kết thúc phiên và về trang đăng nhập | Gọi điểm cuối đăng xuất thì phiên chấm dứt | `GET /admin/authentication/logout` → chuyển hướng, trình duyệt dừng ở `/admin/authentication` · không hiển thị banner thông báo nào | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-33 | URL nội bộ bị chặn lại sau khi đăng xuất | Sau khi đăng xuất, phiên cũ không dùng lại được | Đăng xuất rồi mở `/admin/clients` → bị đưa về `/admin/authentication`, mặc dù cookie `autologin` vẫn còn trong trình duyệt | 🟢 | — | Kiểm chứng thực tế |
| REQ-LOGIN-34 | Cookie `autologin` không bị xoá khỏi trình duyệt khi đăng xuất | Sau khi đăng xuất, cookie ghi nhớ vẫn nằm lại phía trình duyệt | `document.cookie` sau khi đăng xuất **vẫn** chứa `autologin` với nguyên giá trị trước đó. Cookie đã mất hiệu lực ở phía máy chủ (chứng minh bởi REQ-LOGIN-33) nhưng không được xoá phía trình duyệt.<br>🚫 **Ra ngoài phạm vi viết TC** — `AMB-06` ⏭️ bỏ qua 2026-08-18. Giữ dòng làm ghi nhận hiện trạng | 🟡 | 2026-08-18 · ngoài phạm vi TC (`AMB-06`) | Kiểm chứng thực tế + DOM |
| REQ-LOGIN-35 | Cookie `autologin` đọc được bằng JavaScript | Cookie ghi nhớ không được gắn cờ chống truy cập từ script | `document.cookie` trả về đầy đủ giá trị `autologin` → cookie **không** có cờ `HttpOnly`. (Cookie phiên của ứng dụng không xuất hiện trong `document.cookie` → có `HttpOnly`.)<br>🚫 **Ra ngoài phạm vi viết TC** — `AMB-07` ⏭️ bỏ qua 2026-08-18. Giữ dòng làm ghi nhận hiện trạng cho `RISK-02` (đã chấp nhận) | 🟡 | 2026-08-18 · ngoài phạm vi TC (`AMB-07`) | DOM |
| REQ-LOGIN-39 | Cookie `autologin` không tự đăng nhập lại sau khi đăng xuất chủ động | Đăng xuất rồi thì cookie ghi nhớ còn lại cũng không đưa người dùng vào khu quản trị | Đăng nhập có tích Remember me → xác nhận có cookie `autologin` → gọi `/admin/authentication/logout` → xác nhận cookie `autologin` **vẫn còn** → mở `/admin/` → bị đưa về `/admin/authentication`, **không** tự đăng nhập | 🟢 | — | Kiểm chứng thực tế + DOM |
| REQ-LOGIN-40 | Cookie `autologin` khi phiên hết hạn tự nhiên | Phiên tự hết hạn (không do đăng xuất) thì cookie ghi nhớ có đưa người dùng vào thẳng khu quản trị không | ❌ **PO xác nhận tính năng Ghi nhớ đăng nhập KHÔNG hoạt động** (`AMB-15` ⏭️ 2026-08-18). Ra **ngoài phạm vi kiểm thử** — không viết TC. Giữ dòng để không mất dấu vết, và vì checkbox vẫn hiển thị trên UI (`RISK-08`).<br>⚠️ Ba REQ đã kiểm chứng thật vẫn giữ nguyên hiệu lực: `REQ-08` (cookie **được cấp** khi tích) · `REQ-09` (**không** cấp khi bỏ trống) · `REQ-39` (**không** tự đăng nhập sau đăng xuất chủ động) | ⚪ | 2026-08-18 · ra ngoài phạm vi | Quyết định PO 2026-08-18 |

---

## 4. Đặc tả Trường Dữ liệu

### 4.1. Biểu mẫu Đăng nhập — `/admin/authentication`

| Field (Label) | Loại UI | Tên field gửi lên | Required | Ràng buộc (min/max/format/default) | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|---|
| Email Address | `input[type=email]` `#email` | `email` | **Có** — kiểm ở máy chủ | Không có `required`, `maxlength`, `minlength`, `pattern` trong HTML. Định dạng do `type=email` của trình duyệt kiểm. Mặc định rỗng. Không phân biệt hoa/thường, bỏ qua khoảng trắng đầu/cuối | REQ-LOGIN-02, 07, 11, 13, 16, 38 | Có `autofocus="1"`. **Không** có `autocomplete` → trình duyệt vẫn tự điền theo suy đoán riêng, đây là lý do ô Email trông như được giữ lại sau lỗi (REQ-LOGIN-16) |
| Password | `input[type=password]` `#password` | `password` | **Có** — kiểm ở máy chủ | Không có `required`, `maxlength`, `minlength`, `pattern`. Không ràng buộc độ mạnh ở màn hình đăng nhập. Mặc định rỗng | REQ-LOGIN-02, 12 | Hiển thị che ký tự. **Không** có nút hiện/ẩn mật khẩu. **Không** có `autocomplete` |
| Remember me | `input[type=checkbox]` `#remember` | `remember` | Không | Mặc định **không tích** (`checked = false`), `disabled = false`. Thuộc tính `value="estimate"` — giá trị gửi lên khi tích là chuỗi `estimate` | REQ-LOGIN-02, 08, 09 | Giá trị `estimate` không mang nghĩa nghiệp vụ nào ở màn hình này — xem `AMB-11` |
| (ẩn) csrf_token_name | `input[type=hidden]` | `csrf_token_name` | Có — hệ thống tự điền | Chuỗi 32 ký tự hex, đổi theo phiên | REQ-LOGIN-21, 22 | Bắt buộc với **mọi** POST |
| Login | `button[type=submit]` | — | — | Luôn ở trạng thái bật (`disabled = false`) kể cả khi biểu mẫu rỗng | REQ-LOGIN-02, 10 | Class `btn btn-primary btn-block` |

### 4.2. Biểu mẫu Quên mật khẩu — `/admin/authentication/forgot_password`

| Field (Label) | Loại UI | Tên field gửi lên | Required | Ràng buộc | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|---|
| Email Address | `input[type=email]` `#email` | `email` | Không kiểm "bắt buộc" — bỏ trống vẫn gửi được và rơi vào nhánh `Email not found` | Không có `required`, `maxlength`, `pattern`. Có `value=""` sẵn trong HTML. Không có `autofocus` | REQ-LOGIN-23, 25, 26 | Khác biểu mẫu đăng nhập ở chỗ **không** có thông báo trường bắt buộc |
| (ẩn) csrf_token_name | `input[type=hidden]` | `csrf_token_name` | Có — hệ thống tự điền | Chuỗi 32 ký tự hex | REQ-LOGIN-23 | — |
| Confirm | `button[type=submit]` | — | — | Luôn bật | REQ-LOGIN-23 | Class `btn btn-primary btn-block` |

---

## 5. Business Rules & Validation Messages

Toàn bộ thông báo dưới đây **ghi nguyên văn từ UI thực tế**, hiển thị bằng tiếng Anh trong khung `.alert.alert-danger.text-center` đặt phía trên các trường nhập.

| REQ ID | Rule / Trigger | Thông báo lỗi mong đợi (nguyên văn) |
|---|---|---|
| REQ-LOGIN-10 | Đăng nhập: bỏ trống cả Email và Password | `The Password field is required.` (banner 1) và `The Email Address field is required.` (banner 2) |
| REQ-LOGIN-11 | Đăng nhập: bỏ trống Email, có Password | `The Email Address field is required.` |
| REQ-LOGIN-12 | Đăng nhập: có Email, bỏ trống Password | `The Password field is required.` |
| REQ-LOGIN-13 | Đăng nhập: email thiếu ký tự `@` | ⚠️ **Không phải thông báo của ứng dụng** — tooltip do trình duyệt sinh, đổi theo trình duyệt và ngôn ngữ hệ điều hành. Trên **Chrome**: `Please include an '@' in the email address. 'abc' is missing an '@'.` **Cấm dùng làm assertion** — chỉ assert `checkValidity() === false` |
| REQ-LOGIN-14 | Đăng nhập: email không tồn tại, hoặc mật khẩu sai | `Invalid email or password` |
| REQ-LOGIN-22 | Đăng nhập: mã CSRF không hợp lệ | Trang lỗi HTTP 403 — `419 Page Expired!` / `Sorry, the page has expired, return to previous page and refresh to continue.` |
| REQ-LOGIN-25 | Quên mật khẩu: bỏ trống email | `Email not found` |
| REQ-LOGIN-26 | Quên mật khẩu: email không tồn tại | `Email not found` |
| REQ-LOGIN-28 | Đặt lại mật khẩu: mã khoá sai hoặc hết hạn | Không có thông báo — máy chủ trả HTTP 500 với thân phản hồi rỗng |
| REQ-LOGIN-30 | Đăng xuất khi còn timer đang chạy | `Started tasks timers found!` / `Are you sure you want to logout without stopping the timers?` |

**Quan sát chéo:** thông báo của trang Đăng nhập (`The … field is required.`) và trang Quên mật khẩu (`Email not found` cho cùng tình huống bỏ trống) **không nhất quán** — xem `AMB-05`.

---

## 6. Ma trận Phân quyền

Module Đăng nhập nằm **trước** lớp phân quyền: bản thân trang đăng nhập, trang Quên mật khẩu và điểm cuối Đăng xuất mở cho mọi người, không phụ thuộc vai trò. Phần phụ thuộc vai trò là **đích đến sau khi đăng nhập** và tập menu hiển thị — hiện chưa kiểm chứng được vì chỉ có một tài khoản.

Hệ thống có **3 vai trò**: `Admin` · `Project Manager` · `Customer` (`AMB-01` ✅ 2026-08-18). Đã được cấp tài khoản cả 3 vai trò và **kiểm chứng thật toàn bộ ma trận** ngày 2026-08-18.

| Vai trò | Điểm đăng nhập | Định danh quan sát được |
|---|---|---|
| `Admin` | `/admin/authentication` | "Admin Example", `user-id-2` · menu trái **14** mục |
| `Project Manager` | `/admin/authentication` | "Project Manager", `user-id-3` · menu trái **9** mục (thiếu Subscriptions · Expenses · Estimate Request · Knowledge Base · Reports) |
| `Customer` | **`/login`** — cổng khách hàng, KHÁC khu `/admin` | Đăng nhập xong dừng ở `/` (tiêu đề `HKD Anh Tester`) |

| Hành động (trong khu `/admin`) | Khách (chưa đăng nhập) | `Admin` | `Project Manager` | `Customer` |
|---|---|---|---|---|
| Mở trang đăng nhập `/admin/authentication` | ✅ | ❌ — bị chuyển về Dashboard (REQ-LOGIN-19) | ❌ — bị chuyển về Dashboard | ✅ — với khu `/admin`, Customer là **khách** |
| Mở trang Quên mật khẩu | ✅ | ❌ — bị chuyển về Dashboard (REQ-LOGIN-20) | ❌ — bị chuyển về Dashboard | ✅ |
| Gửi biểu mẫu đăng nhập | ✅ | — | — | ✅ gửi được nhưng **luôn bị từ chối** `Invalid email or password` (REQ-LOGIN-43) |
| Mở URL nội bộ `/admin/clients` | ❌ — chuyển về trang đăng nhập (REQ-LOGIN-17) | ✅ | ✅ | ❌ — **kể cả khi đang có phiên cổng khách hàng** |
| Vào Dashboard `/admin/` sau khi đăng nhập | ❌ | ✅ | ✅ | ❌ — không lấy được phiên `/admin` |
| Gọi điểm cuối đăng xuất | ✅ — không lỗi, dừng ở trang đăng nhập | ✅ | ✅ | ✅ |
| Mở khu Setup (`/admin/settings`, `/admin/staff`, `/admin/roles`) | ❌ | ❌ — chuyển tới `/admin/access_denied` | ❌ — chuyển tới `/admin/access_denied` | ❌ |

```
Tổng 28 ô = Đã kiểm chứng 26 · Suy diễn 0 · Chưa rõ 0 · Không áp dụng 2
Hai ô "không áp dụng" là [Gửi biểu mẫu đăng nhập × Admin] và [× Project Manager] — không tới được
biểu mẫu khi đã có phiên (REQ-LOGIN-19). Ma trận ĐẦY ĐỦ, không còn ô nào chưa kiểm chứng.
```

> ✅ **Ma trận này là ma trận duy nhất trong dự án hiện đã kiểm chứng 100%.** Đăng nhập thật bằng cả 3 tài khoản ngày 2026-08-18, thử từng URL, không ô nào suy diễn.
>
> 📌 **Ranh giới quan trọng:** `Customer` **không phải** một vai trò *thấp hơn* trong khu `/admin` — nó thuộc **hệ thống đăng nhập khác** (`/login`). Với khu `/admin`, Customer hành xử **y hệt khách chưa đăng nhập**, kể cả khi đang có phiên cổng khách hàng hợp lệ. Đừng mô hình hoá Customer như một cấp quyền của `/admin`.

> Ký hiệu: `✅`/`❌` = đã đăng nhập đúng vai trò và thử thật · `⚠️✅`/`⚠️❌` = suy từ màn hình cấu hình · `❔` = chưa có căn cứ.
> Ô `❔` **không** được hiểu là "không có quyền".

---

## 7. Ma trận Trạng thái

Module không có entity nghiệp vụ nào mang vòng đời trạng thái. Tuy nhiên **phiên đăng nhập** có chuyển trạng thái quan sát được, ghi lại ở đây vì mọi module khác đều phụ thuộc:

| Trạng thái hiện tại | Hành động cho phép | Trạng thái kế tiếp | Ai được thực hiện |
|---|---|---|---|
| Chưa đăng nhập | Gửi biểu mẫu đăng nhập với thông tin đúng | Đã đăng nhập | Bất kỳ ai có tài khoản hợp lệ |
| Chưa đăng nhập | Gửi biểu mẫu đăng nhập với thông tin sai / thiếu | Chưa đăng nhập (hiện thông báo lỗi) | Bất kỳ ai |
| Chưa đăng nhập | Mở URL nội bộ trong `/admin` | Chưa đăng nhập (bị đưa về trang đăng nhập) | Bất kỳ ai |
| Chưa đăng nhập | Gửi biểu mẫu Quên mật khẩu | Chưa đăng nhập (gửi mail đặt lại — ⚪ chưa kiểm chứng, `REQ-LOGIN-27`) | Bất kỳ ai |
| Đã đăng nhập | Mở trang đăng nhập hoặc Quên mật khẩu | Đã đăng nhập (bị đưa về Dashboard) | Người dùng đang có phiên |
| Đã đăng nhập | Bấm Logout khi **không** có timer chạy | Đã đăng xuất | Người dùng đang có phiên |
| Đã đăng nhập | Bấm Logout khi **có** timer chạy | Đã đăng nhập (hiện popup xác nhận) | Người dùng đang có phiên |
| Đã đăng nhập (popup xác nhận) | Bấm `Logout` trong popup | Đã đăng xuất | Người dùng đang có phiên |
| Đã đăng xuất | Mở URL nội bộ | Chưa đăng nhập (bị đưa về trang đăng nhập) | — |
| Đã đăng xuất **nhưng còn cookie `autologin`** | Mở `/admin/` | Chưa đăng nhập (bị đưa về trang đăng nhập) — cookie **không** tự đăng nhập lại (`REQ-LOGIN-39`) | — |
| Phiên hết hạn tự nhiên **và còn cookie `autologin`** | Mở URL nội bộ | ⚪ **Chưa xác định** — `REQ-LOGIN-40`, chặn bởi `AMB-13` + `AMB-15` | — |

> Thời gian sống của phiên và điều kiện tự hết hạn **chưa xác định** — xem `AMB-13`.
>
> ⚠️ Hai dòng cuối là **hai tình huống khác nhau**, đừng gộp: đăng xuất chủ động đã kiểm chứng là **không** tự đăng nhập lại; phiên hết hạn tự nhiên thì **chưa ai biết**. Toàn bộ công dụng của tính năng Ghi nhớ đăng nhập nằm ở dòng cuối và hiện chưa có bằng chứng nào.

---

## 8. Luồng xử lý chính

### 8.1. Đăng nhập thành công

```
1. Mở /admin/authentication          → biểu mẫu hiện ra, con trỏ ở ô Email
2. Nhập Email Address hợp lệ
3. Nhập Password đúng
4. (tuỳ chọn) Tích Remember me       → sẽ nhận cookie autologin
5. Bấm Login                          → POST /admin/authentication (kèm csrf_token_name)
6. Máy chủ trả 303 + location /admin/ → dừng ở Dashboard
```

### 8.2. Đăng nhập thất bại

```
1–3. Như trên nhưng sai email hoặc sai mật khẩu
4. Bấm Login                          → POST /admin/authentication
5. Trang nạp lại, banner "Invalid email or password"
6. Ô Email trả về rỗng                → người dùng phải gõ lại từ đầu
```

### 8.3. Quên mật khẩu

```
1. Ở trang đăng nhập, bấm "Forgot Password?"
2. Mở /admin/authentication/forgot_password
3. Nhập email → bấm Confirm
4a. Email không có trong hệ thống      → banner "Email not found"
4b. Email có thật                      → ⚪ chưa kiểm chứng (AMB-04)
5.  Không có lối quay lại trang đăng nhập — phải sửa URL thủ công (REQ-LOGIN-24)
```

### 8.4. Đăng xuất

```
1. Bấm Logout (thanh điều hướng hoặc menu ảnh đại diện) → gọi hàm logout()
2a. Có timer công việc đang chạy       → popup "Started tasks timers found!" → cần bấm Logout lần nữa
2b. Không có timer                     → đi thẳng bước 3
3. GET /admin/authentication/logout    → phiên kết thúc
4. Dừng ở /admin/authentication        → URL nội bộ không truy cập được nữa
```

---

## 9. Yêu cầu Phi chức năng (quan sát được)

| Mục | Ghi nhận | REQ / AMB liên quan |
|---|---|---|
| Giao thức | Toàn bộ qua HTTPS (`https://crm.anhtester.com`) | — |
| Tải trang đăng nhập | Trang **không nạp bất kỳ tệp JavaScript nào** — 0 script inline, 0 script ngoài. Toàn bộ kiểm tra dữ liệu chạy ở máy chủ | REQ-LOGIN-37, 13 |
| Máy chủ | `server: LiteSpeed`, ứng dụng server-render (CodeIgniter) | — |
| Không lưu đệm trang sau đăng nhập | Phản hồi mang `cache-control: no-store, no-cache, must-revalidate` và `pragma: no-cache` — bấm Back sau khi đăng xuất không xem lại được nội dung đã tải. ⚠️ Đây là chống **lưu đệm**, **không** phải chống tấn công phát lại (replay) — hệ thống không có nonce/timestamp nào được quan sát | — |
| Ngôn ngữ | Trang đăng nhập chỉ có tiếng Anh; bộ chọn ngôn ngữ (26 ngôn ngữ) chỉ xuất hiện **sau** khi đăng nhập, thuộc module `PROF` | — |
| Khả năng truy cập | Ba trường đều có `<label for>` khớp `id` — đọc được bằng trình đọc màn hình | REQ-LOGIN-02 |
| Chống dò tài khoản | Trang đăng nhập đạt (một thông báo chung); trang Quên mật khẩu **chưa rõ** | REQ-LOGIN-15, AMB-04 |
| Chống thử vét cạn | Không quan sát thấy CAPTCHA, không thấy dấu hiệu giới hạn tần suất | RISK-01, AMB-02 |
| Cookie | Cookie phiên có `HttpOnly`; cookie `autologin` **không có** | REQ-LOGIN-35, RISK-02 |

---

## 10. Phân rã Epic / Story

| Story ID | Tên Story | REQ bao phủ | Số REQ | AMB / RISK liên quan | Ghi chú phạm vi |
|---|---|---|---|---|---|
| STORY-LOGIN-01 | Giao diện trang đăng nhập | REQ-LOGIN-01 → 05 · **36** · **37** | 7 | AMB-11 · RISK-01 | Chỉ kiểm tra hiển thị và cấu trúc, không tương tác nghiệp vụ |
| STORY-LOGIN-02 | Đăng nhập thành công | REQ-LOGIN-06 → 09 · **38** | 5 | AMB-13 · RISK-07 | Gồm cả tuỳ chọn Ghi nhớ đăng nhập |
| STORY-LOGIN-03 | Kiểm tra dữ liệu & đăng nhập thất bại | REQ-LOGIN-10 → 16 · **41** · **43** | 9 | AMB-02 ✅ · AMB-09 ✅ · AMB-10 ✅ · RISK-01 · RISK-03 ✅ | ✅ Hết BLOCKED. ⚠️ Chứa `REQ-LOGIN-16` — TC **sẽ FAIL** vì hệ thống lỗi (`AMB-10`), phải mở bug |
| STORY-LOGIN-04 | Bảo vệ phiên & điều hướng | REQ-LOGIN-17 → 22 · **42** | 7 | AMB-08 ✅ · AMB-12 ⏭️ · AMB-17 ✅ · **AMB-19** | Gồm bảo vệ CSRF và hết hạn phiên. `REQ-LOGIN-42` chạy **1 giờ** — tách khỏi bộ smoke |
| STORY-LOGIN-05 | Quên mật khẩu | REQ-LOGIN-23 → REQ-LOGIN-28 | 6 | AMB-03 · AMB-04 ⏭️ · AMB-05 · RISK-04 ⚠️ · RISK-05 ⚠️ | ⏭️ **Thu hẹp phạm vi** — `REQ-LOGIN-27` ra ngoài phạm vi (`AMB-04` bỏ qua). 5 REQ còn lại vẫn test bình thường. `AMB-03` (HTTP 500 với mã khoá sai) **vẫn treo 🔴** |
| STORY-LOGIN-06 | Đăng xuất & vòng đời cookie ghi nhớ | REQ-LOGIN-29 → 35 · **39** · **40** | 9 | AMB-06 · AMB-07 · AMB-14 ⏭️ · AMB-15 ⏭️ · AMB-16 · RISK-02 · **RISK-08** | ⏭️ **Thu hẹp phạm vi** — `REQ-LOGIN-40` ra ngoài phạm vi (Remember Me không hoạt động) · `REQ-LOGIN-30` giữ nguyên nhưng việc kiểm chứng đầu-cuối chuyển sang module `TASK` |

**Tổng: 6 Story / 43 REQ** — mọi REQ thuộc đúng một Story, không mồ côi, không trùng (7+5+9+7+6+9 = 43 ✔).

**Phạm vi thực tế sẽ viết TC:** 43 REQ − 4 REQ ngoài phạm vi (`REQ-LOGIN-27`, `34`, `35`, `40`) = **39 REQ**.

**Đối chiếu AMB/RISK — mọi mã đều có chỗ đứng, không mã nào mồ côi:**

| Nhóm | Mã | Nằm ở đâu |
|---|---|---|
| AMB thuộc Story | AMB-02…19 (trừ 01, 18) | 17 mã, phân bổ ở bảng trên |
| AMB cấp Epic | AMB-01 · AMB-18 | Ma trận Phân quyền — cả hai đã ✅, xem bảng Epic bên dưới |
| RISK thuộc Story | RISK-01, 02, 03, 04, 05, 07, 08 | 7 mã, phân bổ ở bảng trên |
| RISK cấp Epic | RISK-06 | Cắt ngang toàn module — xem bảng Epic bên dưới |

### Hạng mục cấp Epic (cố ý không gán vào Story nào)

| Hạng mục | Lý do |
|---|---|
| Ma trận Phân quyền (mục 6) | Cắt ngang mọi Story. ✅ **Đã hoàn thiện 2026-08-18** — có đủ tài khoản 3 vai trò, kiểm chứng 100% (`AMB-01` ✅, `AMB-18` ✅) |
| Ma trận Trạng thái phiên (mục 7) | Cắt ngang STORY-LOGIN-02, 04, 06 |
| Yêu cầu phi chức năng (mục 9) | Áp cho toàn module |
| Bảng Ambiguity & Risk (mục 11) | Đánh số theo toàn module |
| `RISK-06` — module là cổng vào toàn hệ thống | Không thuộc Story nào vì rủi ro nằm ở **mức module**, không ở một luồng cụ thể; giảm thiểu bằng cách xếp thứ tự chạy (xem bảng dưới), không bằng thêm test case |

### Thứ tự triển khai đề xuất

| Thứ tự | Story | Lý do |
|---|---|---|
| 1 | STORY-LOGIN-02 | Đường đi thuận — mọi module khác cần đăng nhập được mới test tiếp; phải xanh trước tiên |
| 2 | STORY-LOGIN-01 | Rẻ, không rủi ro, chốt nền tảng locator cho automation |
| 3 | STORY-LOGIN-03 | ✅ **Hết BLOCKED** — `AMB-02` đã trả lời (không khoá tài khoản). TC thử sai lặp lại chạy được an toàn trên tài khoản thật |
| 4 | STORY-LOGIN-04 | Phụ thuộc STORY-LOGIN-02 (cần phiên hợp lệ để test điều hướng khi đã đăng nhập) |
| 5 | STORY-LOGIN-06 | Phụ thuộc STORY-LOGIN-02. Hết BLOCKED — `REQ-LOGIN-30` chấp nhận bằng chứng đọc mã nguồn (`AMB-14` ⏭️ chuyển `TASK`), `REQ-LOGIN-40` ra ngoài phạm vi (`AMB-15` ⏭️) |
| 6 | STORY-LOGIN-05 | Hết BLOCKED nhưng **thu hẹp** — `REQ-LOGIN-27` ra ngoài phạm vi (`AMB-04` ⏭️). 5 REQ còn lại test bình thường. ⚠️ `AMB-03` (HTTP 500 trắng trang khi mã khoá sai) **vẫn treo 🔴** và vẫn cần trả lời |

> ✅ **Sau quyết định PO 2026-08-18: không Story nào còn BLOCKED.** Có thể chạy sinh test case cho toàn module ngay.

---

## 11. Điểm Mơ Hồ & Rủi Ro

### 11.1. Ambiguities

| Mã | Câu hỏi | Nguy cơ | Mức độ | Assumption tạm | Trạng thái | Kết luận |
|---|---|---|---|---|---|---|
| AMB-01 | Hệ thống có bao nhiêu vai trò, tên là gì? Xin cấp tài khoản vai trò thấp hơn để kiểm chứng 7 ô đang `❔` ở ma trận phân quyền | Không dựng được ma trận phân quyền thật cho module này và **mọi** module còn lại | 🔴 | Chỉ test với tài khoản đang có; mọi kết luận về vai trò khác đều để `❔` | ✅ Đã trả lời 2026-08-18 | **Hệ thống có 3 vai trò: `Admin` · `Project Manager` · `Customer`.** Phần *tên vai trò* đã xong. Phần *xin tài khoản để kiểm chứng* **chưa** → tách thành `AMB-18`. Ma trận phân quyền vẫn giữ `❔` cho vai trò chưa có tài khoản |
| AMB-02 | Có khoá tài khoản sau N lần đăng nhập sai không? Ngưỡng bao nhiêu, khoá bao lâu, tính theo email hay theo IP? | Không biết ngưỡng thì không viết được test case khoá tài khoản; thử mò trên môi trường dùng chung có thể khoá cả team | 🔴 | Giả định **không** có cơ chế khoá; không viết TC khoá tài khoản cho tới khi có câu trả lời | ✅ Đã trả lời 2026-08-18 | **Không có cơ chế khoá tài khoản.** Kết luận **trùng** Giả định tạm → không TC nào phải sửa. Chốt thành `REQ-LOGIN-41`. Hệ quả: `RISK-03` đóng (không còn nguy cơ khoá cả đội), `RISK-01` chuyển từ *nghi ngờ* sang **xác nhận** |
| AMB-03 | `reset_password` với mã khoá sai trả HTTP 500 trắng trang — đúng thiết kế hay lỗi? | Người dùng bấm liên kết hết hạn sẽ thấy trang lỗi trình duyệt, không biết phải làm gì tiếp | 🔴 | Coi là **lỗi**; TC kỳ vọng phải có trang thông báo thân thiện | ⏭️ Bỏ qua 2026-08-18 | **Quyết định: bỏ qua.** ⚠️ Giả định tạm bị **huỷ** — TC **không còn** kỳ vọng trang thông báo thân thiện, mà ghi nhận đúng hiện trạng HTTP 500 (`REQ-LOGIN-28`). `RISK-05` chuyển sang **chấp nhận hoàn toàn** |
| AMB-04 | Trang Quên mật khẩu trả gì khi email **có thật**? Có khác `Email not found` không? Kiểm chứng luồng gửi mail bằng cách nào trên môi trường dùng chung? | Nếu khác nhau thì kẻ tấn công dò được email nào có tài khoản. Và luồng khôi phục mật khẩu hiện chưa test được đầu-cuối | 🔴 | Giả định email có thật cho thông báo thành công khác hẳn → **có** lộ danh sách tài khoản | ⏭️ Bỏ qua 2026-08-18 | **Quyết định: bỏ qua case này.** Không kiểm chứng luồng gửi mail với email có thật. Hệ quả: `REQ-LOGIN-27` giữ ⚪ và ra **ngoài phạm vi kiểm thử**; `RISK-04` (lộ email nào có tài khoản) chuyển sang **rủi ro đã chấp nhận** — không xác minh, không viết TC |
| AMB-05 | Bỏ trống email ở Quên mật khẩu ra `Email not found` thay vì thông báo trường bắt buộc như trang đăng nhập — cố ý hay thiếu validate? | Thông báo sai bản chất làm người dùng tưởng email của mình không tồn tại | 🟡 | Coi là **thiếu validate**; TC kỳ vọng thông báo trường bắt buộc | ✅ Đã trả lời 2026-08-18 | **Thiếu validate trường bắt buộc — là LỖI.** Trùng Giả định tạm. `REQ-LOGIN-25` đổi sang ghi **hành vi đúng** (báo trường bắt buộc); hiện trạng `Email not found` là sai → 🐞 **cần mở bug**. TC viết theo REQ sẽ FAIL trên hệ thống hiện tại — đó là kết quả đúng |
| AMB-06 | Cookie `autologin` còn nguyên trong trình duyệt sau khi đăng xuất — có cần xoá không? | Máy dùng chung: cookie chứa `user_id` và `key` nằm lại sau khi người dùng tưởng đã đăng xuất | 🟡 | Coi là **cần xoá**; TC kỳ vọng cookie biến mất sau khi đăng xuất | ⏭️ Bỏ qua 2026-08-18 | **Quyết định: bỏ qua, không viết TC.** Giả định tạm bị huỷ — không kỳ vọng cookie bị xoá. `REQ-LOGIN-34` giữ nguyên là ghi nhận hiện trạng, ra **ngoài phạm vi viết TC** |
| AMB-07 | Cookie `autologin` không có cờ `HttpOnly` — cố ý hay sót? | Bất kỳ lỗ hổng XSS nào ở khu `/admin` đều đọc được cookie này | 🟡 | Coi là **sót**; ghi thành `RISK-02` để đội bảo mật xử lý | ⏭️ Bỏ qua 2026-08-18 | **Quyết định: bỏ qua, không viết TC.** `REQ-LOGIN-35` giữ nguyên là ghi nhận hiện trạng, ra **ngoài phạm vi viết TC**. `RISK-02` chuyển sang **rủi ro đã chấp nhận** |
| AMB-08 | Mã CSRF sai trả HTTP **403** nhưng nội dung ghi **419 Page Expired!** — mã nào là đúng? | Automation và giám sát bắt theo mã trạng thái sẽ phân loại nhầm | 🟡 | Kiểm theo **403** (giá trị thực tế trên tab Network) và kiểm chuỗi `419 Page Expired!` trong nội dung | ✅ Đã trả lời 2026-08-18 | **Tạm chấp nhận `419 Page Expired!`.** Trùng Giả định tạm ở phần quan trọng: TC assert **chuỗi nội dung** `419 Page Expired!`, **không** assert mã HTTP (vì header thật trả 403, lệch với nội dung và chưa được sửa) |
| AMB-09 | Chính sách mật khẩu (độ dài tối thiểu, ký tự bắt buộc) quy định ở đâu? Màn hình đăng nhập không ràng buộc gì | Không viết được TC biên cho trường mật khẩu | 🟡 | Màn hình **đăng nhập** không ràng buộc độ dài — mọi ràng buộc thuộc màn hình đổi/đặt mật khẩu | ✅ Đã trả lời 2026-08-18 | **Không có chính sách mật khẩu nào được quy định.** Rộng hơn Giả định tạm (vốn chỉ nói màn hình đăng nhập). Hệ quả: **không viết TC biên cho trường mật khẩu** ở bất kỳ màn hình nào. Bổ sung vào `RISK-01` |
| AMB-10 | Sau khi đăng nhập thất bại, email đã nhập bị xoá — cố ý hay thiếu? | Người dùng phải gõ lại email mỗi lần sai mật khẩu | 🟡 | Coi là **thiếu**; TC ghi nhận hiện trạng và gắn nhãn cải thiện trải nghiệm | ✅ Đã trả lời 2026-08-18 | ⚠️ **KHÁC Giả định tạm.** Hành vi đúng là **phải giữ lại email**; hiện trạng xoá đi là **LỖI hệ thống**. `REQ-LOGIN-16` đảo từ *ghi nhận hiện trạng* sang *ghi kỳ vọng đúng* → 🐞 **cần mở bug**. TC viết theo REQ sẽ FAIL trên hệ thống hiện tại |
| AMB-11 | Checkbox Remember me mang `value="estimate"` — giá trị này có ý nghĩa gì không? | Automation dựa vào `value` có thể hiểu sai; nếu là lỗi sao chép mã thì có thể đổi bất ngờ | 🟢 | Coi là giá trị vô nghĩa còn sót lại; automation chỉ thao tác trạng thái tích/không tích, **không** dựa vào `value` | ✅ Đã trả lời 2026-08-18 | **Không mang ý nghĩa gì.** Trùng Giả định tạm → giữ nguyên luật: automation chỉ thao tác trạng thái tích/không tích, **cấm** dựa vào `value="estimate"` |
| AMB-12 | Bị chuyển về trang đăng nhập thì không giữ URL đích — có kế hoạch bổ sung không? | Người dùng mở liên kết sâu (từ email, từ chat) phải tự điều hướng lại sau khi đăng nhập | 🟡 | Ghi nhận hiện trạng: **không** giữ URL đích | ⏭️ Bỏ qua 2026-08-18 | **Quyết định: bỏ qua.** Trùng Giả định tạm nên không đổi gì — `REQ-LOGIN-18` giữ nguyên là ghi nhận hiện trạng và **vẫn trong phạm vi** viết TC |
| AMB-13 | Phiên đăng nhập sống bao lâu? Cookie `autologin` hết hạn khi nào? Có cho phép nhiều phiên song song không? | Không viết được TC hết phiên và TC đăng nhập nhiều nơi | 🟡 | Không viết TC hết phiên cho tới khi có ngưỡng cụ thể | ✅ Đã trả lời 2026-08-18 | **Phiên đăng nhập sống 1 giờ.** Chốt thành `REQ-LOGIN-42`. ⚠️ Chưa rõ 1 giờ tính theo **không hoạt động** hay theo **tổng thời gian từ lúc đăng nhập** → `AMB-19`. Hai vế còn lại (hạn cookie `autologin`, nhiều phiên song song) **không được trả lời** và nay không còn cần: Remember Me đã ra ngoài phạm vi (`AMB-15`) |
| AMB-14 | Dựng dữ liệu thế nào để có task với timer đang chạy, nhằm kiểm chứng popup cảnh báo khi đăng xuất? Môi trường dùng chung nên khởi động timer sẽ ảnh hưởng người khác | `REQ-LOGIN-30` chỉ mới đọc được từ mã nguồn hàm `logout()`, chưa chạy thật đầu-cuối | 🟡 | Chấp nhận bằng chứng ở mức đọc mã nguồn; đánh dấu TC tương ứng là `assumption-based` | ⏭️ Bỏ qua ở module này 2026-08-18 | **Quyết định: chuyển việc kiểm chứng sang module `TASK`** — nơi sở hữu tính năng timer. `REQ-LOGIN-30` giữ 🟢 ở mức bằng chứng đọc mã nguồn. ⚠️ **Phụ thuộc chéo module:** khi recon `TASK`, phải kiểm chứng đầu-cuối popup này và cập nhật ngược `REQ-LOGIN-30` |
| AMB-15 | Tính năng **Ghi nhớ đăng nhập** rốt cuộc có tác dụng gì? Đã kiểm chứng: cookie `autologin` được cấp đúng khi tích, và **không** tự đăng nhập lại sau khi đăng xuất chủ động. Vậy nó chỉ có tác dụng khi phiên hết hạn tự nhiên? Thời gian sống của cookie là bao lâu? | Cả tính năng hiện **không có bằng chứng nào cho thấy nó hoạt động**. Nếu hỏng, người dùng tích Remember me vẫn phải đăng nhập lại mỗi lần — không ai phát hiện vì không có TC nào phủ | 🔴 | Coi tính năng là **chưa kiểm chứng**; `REQ-LOGIN-40` giữ ⚪, không viết TC khẳng định tự đăng nhập cho tới khi biết thời gian sống của phiên (`AMB-13`) | ⏭️ Bỏ qua 2026-08-18 | **Quyết định: Remember Me không hoạt động — bỏ qua.** `REQ-LOGIN-40` chốt ở ⚪ với ghi chú *không hoạt động*, không viết TC. `REQ-LOGIN-08`, `09`, `39` **vẫn giữ 🟢** vì là sự kiện đã kiểm chứng thật (cookie được cấp / không được cấp / không tự đăng nhập sau đăng xuất). ⚠️ Checkbox vẫn hiển thị trên UI → `RISK-08` |
| AMB-16 | Lối đăng xuất trong `div.mobile-navbar` có thật sự dùng được ở viewport mobile không? Ở desktop `1600×750` nó bị `display:none`, hộp `0×0` | Đợt khảo sát đầu đã đếm 2 phần tử DOM rồi kết luận nhầm là "2 lối đăng xuất". Nếu mobile cũng hỏng thì người dùng mobile **không có** lối đăng xuất nào | 🟡 | Coi là **chỉ dùng được ở mobile**; cần một lượt recon riêng ở viewport mobile mới khẳng định được | ✅ Đã trả lời 2026-08-18 | **Dùng được ở viewport mobile.** Trùng Giả định tạm. `REQ-LOGIN-29` cập nhật: desktop 1 lối (dropdown avatar), mobile 1 lối (`mobile-navbar`). ⚠️ Nguồn là **quyết định PO**, chưa có lượt recon mobile nào — muốn viết TC mobile thì phải recon ở viewport mobile trước |
| AMB-17 | `GET /admin/clients` khi chưa đăng nhập ghi nhận mã **307** trên tab Network — chuyển hướng xác thực thường là 302/303. Mã thật là gì? | Automation và giám sát bắt theo mã trạng thái sẽ phân loại nhầm — cùng loại vấn đề với `AMB-08` | 🟡 | **Không** assert mã chuyển hướng; chỉ assert điểm dừng là `/admin/authentication` (`REQ-LOGIN-17`) | ✅ Đã trả lời 2026-08-18 | **Tạm chấp nhận `307`.** Assert **bắt buộc**: điểm dừng là `/admin/authentication`. Assert mã `307`: **tuỳ chọn**, đã được chấp nhận — nhưng vẫn khuyến nghị không dùng làm assert chính vì giá trị này do công cụ ghi nhận, chưa đối chiếu với header thật của máy chủ |
| AMB-18 | Xin cấp tài khoản vai trò **Project Manager** và **Customer** để kiểm chứng ma trận phân quyền. Kèm câu hỏi: vai trò `Customer` có đăng nhập vào khu `/admin` không, hay chỉ dùng cổng khách hàng? | Tên vai trò đã biết (`AMB-01`) nhưng **vẫn không dựng được ma trận thật** — 14 ô đang `❔`. Áp cho **mọi** module, không riêng `LOGIN` | 🔴 | Ma trận ghi đủ 3 cột theo tên vai trò thật, ô nào chưa kiểm chứng để `❔`. **Không** suy quyền của vai trò này từ vai trò khác | ✅ Đã trả lời 2026-08-18 | **Đã được cấp đủ 3 tài khoản** (lưu ở `.env`, không ghi vào tài liệu). Ma trận phân quyền của `LOGIN` nay **kiểm chứng 100%**, không còn ô `❔`. Trả lời câu hỏi kèm theo: **`Customer` KHÔNG đăng nhập được vào `/admin`** — chốt thành `REQ-LOGIN-43`. 🔑 Tài khoản này dùng được cho **mọi module còn lại** — đây là nút thắt cấp hệ thống đã được gỡ |
| AMB-19 | Phiên sống **1 giờ** (`AMB-13`) tính theo **thời gian không hoạt động** (mỗi thao tác gia hạn lại) hay theo **tổng thời gian từ lúc đăng nhập** (hết giờ là out dù đang dùng)? | Hai cách cho **hai TC khác hẳn nhau**: một cái phải để yên 1 giờ, cái kia phải thao tác liên tục suốt 1 giờ rồi kiểm. Chọn sai là TC đo nhầm thứ | 🟡 | Giả định là **thời gian không hoạt động** (phổ biến hơn ở PHP session); TC để yên 1 giờ rồi kiểm. Gắn nhãn `assumption-based` | ❓ Chờ trả lời | — |

### 11.2. Risks

| Mã | Rủi ro | Mô tả | Mitigation |
|---|---|---|---|
| RISK-01 | **XÁC NHẬN** — hệ thống không có bất kỳ lớp chống thử vét cạn nào | Bốn dữ kiện đã chốt, không còn là nghi ngờ: không CAPTCHA (`REQ-LOGIN-05`) · không giới hạn tần suất · **không khoá tài khoản** (`AMB-02` ✅) · **không có chính sách mật khẩu nào được quy định** (`AMB-09` ✅). Cộng với mật khẩu của các tài khoản demo đều rất yếu (6 ký tự số, giống nhau ở cả 3 vai trò) → tài khoản dò được không giới hạn số lần | Báo đội bảo mật: đây là quyết định thiết kế cần được biết, không phải phát hiện của QA. Trong phạm vi test: `REQ-LOGIN-41` chốt hành vi hiện tại; TC thử sai lặp lại **nay đã an toàn để chạy** vì không có cơ chế khoá |
| RISK-02 | Cookie `autologin` đọc được bằng JavaScript | Không có cờ `HttpOnly`; cookie chứa `user_id` và `key` dùng để tự đăng nhập | Báo đội phát triển (`AMB-07`). Khi kiểm thử bảo mật, ghép với mọi điểm nghi ngờ XSS trong khu `/admin` |
| RISK-03 | ✅ **ĐÓNG 2026-08-18** — môi trường dùng chung, thử khoá tài khoản có thể chặn cả đội | Rủi ro này dựa trên giả thiết *có thể có* cơ chế khoá. `AMB-02` đã trả lời: **không có khoá** → không còn nguy cơ khoá cả đội | Không cần giảm thiểu nữa. **Gỡ ràng buộc:** TC đăng nhập sai lặp lại nay chạy được bình thường trên tài khoản thật. Vẫn giữ thói quen dùng email không tồn tại khi chỉ cần lấy thông báo lỗi |
| RISK-04 | ⚠️ **ĐÃ CHẤP NHẬN 2026-08-18** — luồng Quên mật khẩu có thể lộ email nào có tài khoản | `Email not found` cho email không tồn tại; phản hồi với email có thật **sẽ không được kiểm chứng** vì `AMB-04` ⏭️ bỏ qua | Rủi ro được chấp nhận có ý thức, **không** giảm thiểu. Nếu sau này có đợt kiểm thử bảo mật riêng thì đây là mục đầu tiên cần mở lại |
| RISK-05 | ⚠️ **Chấp nhận một phần** — luồng khôi phục mật khẩu có thể hỏng hoàn toàn | Liên kết đặt lại với mã khoá sai trả HTTP 500 (`REQ-LOGIN-28`, `AMB-03` vẫn treo 🔴); liên kết **hợp lệ** không được kiểm chứng vì `AMB-04` ⏭️ | Phần liên kết hợp lệ: chấp nhận không kiểm chứng. Phần HTTP 500 với mã khoá sai: **vẫn cần trả lời `AMB-03`** — đây là lỗi người dùng thật chạm được |
| RISK-06 | Module là cổng vào của toàn hệ thống | Bất kỳ hỏng hóc nào ở đây đều chặn kiểm thử **23 module** còn lại | Xếp STORY-LOGIN-02 chạy đầu tiên trong mọi bộ smoke; đưa vào kiểm tra sức khoẻ hằng ngày |
| RISK-07 | Mật khẩu tài khoản demo rất yếu và dùng chung cho cả 3 vai trò | Mật khẩu chỉ **6 ký tự số** và **giống hệt nhau** ở `Admin`, `Project Manager`, `Customer` — ai biết URL và một email là đăng nhập được. Giá trị thật lưu ở `.env` | Không commit `.env` (đã có trong `.gitignore`). **KHÔNG** ghi giá trị mật khẩu / token vào `docs/` hay ảnh chụp màn hình — chỉ mô tả hình thái. Xem `skills-requirements-analyzer` mục 7.1 |
| RISK-08 | ⚠️ **ĐÃ CHẤP NHẬN 2026-08-18** — checkbox Ghi nhớ đăng nhập hiển thị nhưng không hoạt động | `AMB-15` ⏭️ chốt tính năng **không hoạt động**, nhưng checkbox `#remember` **vẫn hiển thị và tích được** trên trang đăng nhập, và hệ thống **vẫn cấp cookie `autologin`** khi tích (`REQ-LOGIN-08` đã kiểm chứng). Người dùng tích vào và tin rằng mình sẽ không phải đăng nhập lại. Cookie cấp ra còn mang `user_id` + `key` mà không có `HttpOnly` (`RISK-02`) — tức vẫn có bề mặt tấn công cho một tính năng không mang lại lợi ích nào | Rủi ro được chấp nhận theo quyết định "bỏ qua". **Ghi nhận để báo dev:** nếu tính năng không dùng thì nên **gỡ checkbox** và ngừng cấp cookie, thay vì để nguyên. Không viết TC cho tính năng này |

---

## 12. Danh mục Evidence

| Tệp | Màn hình | Trạng thái | REQ làm bằng chứng |
|---|---|---|---|
| [evidence/login_form_default_fullpage.png](evidence/login_form_default_fullpage.png) | Đăng nhập | Mặc định, các trường rỗng | REQ-LOGIN-01, 02, 04, 05 |
| [evidence/login_form_filled_remember_checked_fullpage.png](evidence/login_form_filled_remember_checked_fullpage.png) | Đăng nhập | Đã nhập đủ, **Remember me đang tích** | REQ-LOGIN-02, 08 |
| [evidence/login_form_empty_submit_error_fullpage.png](evidence/login_form_empty_submit_error_fullpage.png) | Đăng nhập | Gửi biểu mẫu rỗng — 2 banner lỗi | REQ-LOGIN-10 |
| [evidence/login_form_wrong_credentials_fullpage.png](evidence/login_form_wrong_credentials_fullpage.png) | Đăng nhập | Sai thông tin — banner `Invalid email or password` | REQ-LOGIN-14, 15 |
| [evidence/login_csrf_invalid_403_fullpage.png](evidence/login_csrf_invalid_403_fullpage.png) | Đăng nhập | Mã CSRF bị sửa — trang lỗi 403 | REQ-LOGIN-22 |
| [evidence/login_success_dashboard_viewport.png](evidence/login_success_dashboard_viewport.png) | Dashboard | Ngay sau khi đăng nhập thành công, dropdown đóng | REQ-LOGIN-06 |
| [evidence/logout_menu_open_viewport.png](evidence/logout_menu_open_viewport.png) | Dashboard | Menu ảnh đại diện **đang mở** — thấy Logout là mục cuối, và thanh đầu trang **không** có lối Logout thứ hai | REQ-LOGIN-29 |
| [evidence/forgot_password_form_default_fullpage.png](evidence/forgot_password_form_default_fullpage.png) | Quên mật khẩu | Mặc định | REQ-LOGIN-23, 24 |
| [evidence/forgot_password_empty_submit_error_fullpage.png](evidence/forgot_password_empty_submit_error_fullpage.png) | Quên mật khẩu | Gửi khi bỏ trống — banner `Email not found` | REQ-LOGIN-25 |

> ⚠️ **Đọc ảnh cho đúng:** ở các ảnh chụp trang đăng nhập, ô Email/Password đôi khi có sẵn nội dung với nền xanh nhạt — đó là **trình duyệt tự điền**, không phải máy chủ trả lại giá trị. Bằng chứng: `input#email` trong HTML trả về không hề có thuộc tính `value` (REQ-LOGIN-16).
>
> 📸 **Vì sao 2 ảnh Dashboard chụp viewport chứ không full-page:** ảnh full-page của Dashboard kéo theo bảng công việc, nhật ký hoạt động và tên khách hàng thật — dữ liệu không liên quan gì tới REQ mà chúng làm bằng chứng. Đối tượng cần chứng minh (thanh đầu trang, dropdown, tiêu đề) nằm trọn trong viewport, nên chụp viewport là **đủ và đúng phạm vi**. Xem quy tắc chung ở `skills-requirements-analyzer` mục 7.2.1.

**Dữ kiện đọc từ DOM, không thể hiện được trên ảnh** (ghi thẳng vào Acceptance Criteria ở mục 3):

| Dữ kiện | Giá trị đọc được | REQ |
|---|---|---|
| Số tệp script trên trang đăng nhập | **0** inline · **0** ngoài | REQ-LOGIN-37 |
| Thuộc tính ràng buộc của `#email` / `#password` | `required=false`, `maxLength=-1`, `minLength=-1`, `pattern=null` trên **cả hai** | REQ-LOGIN-02, mục 4.1 |
| `value` của checkbox Remember me | `"estimate"`, `checked=false`, `disabled=false` | REQ-LOGIN-02, AMB-11 |
| `input#email` sau khi đăng nhập lỗi | `getAttribute('value')` = `null` | REQ-LOGIN-16 |
| **Hình thái** cookie sau khi tích Remember me | `a:2:{s:7:"user_id";s:1:"<id>";s:3:"key";s:16:"<16 ký tự hex>";}` · độ dài key = **16**.<br>🔒 **Giá trị thật KHÔNG được ghi vào tài liệu** — đây là token tự đăng nhập, ghi ra là phát tán credential (xem `RISK-02`, `RISK-07`) | REQ-LOGIN-08, 35 |
| Cookie sau khi đăng nhập **không** tích Remember me (trạng thái sạch) | `document.cookie` **rỗng** — không có `autologin` | REQ-LOGIN-09 |
| Thân request `POST /admin/authentication` | `csrf_token_name=…&email=…&password=…&remember=estimate` | REQ-LOGIN-21 |
| Mã hàm `logout()` | Kiểm `$(".started-timers-top").find("li.timer").length > 0` → mở popup, ngược lại chuyển tới `authentication/logout` | REQ-LOGIN-30, 31 |
| Số thẻ `<a>` trên trang Quên mật khẩu | **1** — chỉ logo trỏ về trang chủ | REQ-LOGIN-24 |
| Hai phần tử `li.header-logout` ở desktop `1600×750` | Cái trong `ul.nav.navbar-nav`: hộp `0×0`, `offsetParent === null`, tổ tiên `div.mobile-navbar.collapse` + `div.mobile-menu` đều `display:none` · Cái trong `.dropdown-menu`: hộp `160×64`, `offsetParent ≠ null` | REQ-LOGIN-29, AMB-16 |
| Số `<li>` lồng trong `.dropdown-menu` hồ sơ | **32** (submenu Language) → `.dropdown-menu li:last-child` KHÔNG phải Logout; phải dùng `> li:last-child` | REQ-LOGIN-29 |
| `document.title` và `body.className` ở Dashboard | Title `(16) Dashboard` — có tiền tố **đếm thông báo động** · class `app admin dashboard invoices-total-manual user-id-2 chrome` — token `chrome` đổi theo trình duyệt | REQ-LOGIN-06, 19, 20 |

---

## 13. Nhật ký Thay đổi

| Ngày | Nguồn | REQ ảnh hưởng | Loại | Tóm tắt thay đổi | TC cần xử lý |
|---|---|---|---|---|---|
| 2026-08-18 | Quyết định PO + kiểm chứng thật (`PO-2026-08-18-B`) | REQ-LOGIN-43 · Ma trận Phân quyền | 🟢 Thêm | **Được cấp tài khoản đủ 3 vai trò** (`AMB-01` ✅, `AMB-18` ✅). Đăng nhập thật cả 3 → ma trận phân quyền **kiểm chứng 100%**, từ 7 ô `❔` xuống **0**. Phát hiện: `Customer` đăng nhập ở `/login` (cổng khách hàng) và **không** vào được `/admin` kể cả khi đang có phiên khách hàng hợp lệ → chốt `REQ-LOGIN-43`. `Project Manager` là `user-id-3`, menu trái 9 mục so với 14 của Admin | — (viết TC mới) |
| 2026-08-18 | Quyết định PO (`PO-2026-08-18-B`) | REQ-LOGIN-42 | 🟢 Thêm | `AMB-13` ✅ — phiên đăng nhập sống **1 giờ** → chốt `REQ-LOGIN-42`. Mở `AMB-19`: 1 giờ tính theo thời gian không hoạt động hay tổng thời gian từ lúc đăng nhập | — (viết TC mới, gắn `assumption-based`) |
| 2026-08-18 | Quyết định PO (`PO-2026-08-18-B`) | REQ-LOGIN-16, 25 | 🟡 Sửa | ⚠️ **Hai REQ đảo từ *ghi nhận hiện trạng* sang *ghi kỳ vọng đúng*** — PO xác nhận cả hai là **lỗi hệ thống**: `REQ-16` (`AMB-10` — phải giữ lại email sau đăng nhập lỗi) và `REQ-25` (`AMB-05` — phải báo trường bắt buộc thay vì `Email not found`). 🐞 TC viết theo hai REQ này **sẽ FAIL** trên bản hiện tại — đó là kết quả đúng, phải mở bug | — (viết TC mới, gắn kèm bug) |
| 2026-08-18 | Quyết định PO (`PO-2026-08-18-B`) | REQ-LOGIN-28, 29, 34, 35 | 🟡 Sửa | `REQ-28` chốt **chấp nhận** HTTP 500 hiện trạng (`AMB-03` ⏭️) · `REQ-29` bổ sung nhánh mobile dùng được (`AMB-16` ✅) · `REQ-34`, `REQ-35` ra **ngoài phạm vi viết TC** (`AMB-06`, `AMB-07` ⏭️) | — |
| 2026-08-18 | Quyết định PO (`PO-2026-08-18-B`) | — | ✏️ Biên tập | Đóng nốt `AMB-08` (chấp nhận `419 Page Expired!`), `AMB-09` (không có chính sách mật khẩu → không viết TC biên mật khẩu), `AMB-11` (`value="estimate"` vô nghĩa), `AMB-12` ⏭️, `AMB-17` (chấp nhận `307`). Ambiguity còn treo: **1** | — |
| 2026-08-18 | Quyết định PO (`PO-2026-08-18`) | REQ-LOGIN-41 | 🟢 Thêm | `AMB-02` được trả lời: **không có cơ chế khoá tài khoản**. Chốt thành `REQ-LOGIN-41`. Kết luận **trùng** Giả định tạm nên không TC nào phải sửa. Gỡ BLOCKED cho `STORY-LOGIN-03` | — (viết TC mới) |
| 2026-08-18 | Quyết định PO (`PO-2026-08-18`) | REQ-LOGIN-27, 40 | 🟡 Sửa | Hai REQ ra **ngoài phạm vi kiểm thử** theo quyết định bỏ qua: `REQ-27` (gửi mail đặt lại, `AMB-04` ⏭️) và `REQ-40` (Ghi nhớ đăng nhập không hoạt động, `AMB-15` ⏭️). **Giữ nguyên dòng và mã**, chỉ đổi ghi chú phạm vi — không phải 🔴 Deprecated vì tính năng chưa bị gỡ khỏi hệ thống | — (không viết TC cho 2 REQ này) |
| 2026-08-18 | Quyết định PO (`PO-2026-08-18`) | REQ-LOGIN-30 | 🟡 Sửa | `AMB-14` ⏭️ — việc kiểm chứng đầu-cuối popup cảnh báo timer **chuyển sang module `TASK`**. REQ vẫn thuộc module `LOGIN`, bằng chứng vẫn ở mức đọc mã nguồn. Ghi phụ thuộc chéo module để khi recon `TASK` phải cập nhật ngược | ⚠️ TC gắn nhãn `assumption-based` |
| 2026-08-18 | Quyết định PO (`PO-2026-08-18`) | — | 🟢 Thêm | `RISK-08` mới: checkbox Ghi nhớ đăng nhập **vẫn hiển thị và vẫn cấp cookie** dù tính năng không hoạt động. `RISK-01` chuyển từ *nghi ngờ* sang **xác nhận** · `RISK-03` **đóng** (không còn nguy cơ khoá cả đội) · `RISK-04` và `RISK-05` chuyển sang **rủi ro đã chấp nhận** | — |
| 2026-08-18 | Rà soát chất lượng + kiểm chứng lại trên UI | REQ-LOGIN-29 | 🟡 Sửa | **Sửa sai sót khảo sát.** Bản cũ ghi "hai lối đăng xuất" do đếm 2 phần tử `li.header-logout` trong DOM. Kiểm chứng lại: cái trong `ul.nav.navbar-nav` có hộp `0×0` và `offsetParent === null` (tổ tiên `div.mobile-navbar` `display:none` ở desktop) → ở desktop **chỉ có 1** lối dùng được. Bổ sung cảnh báo locator: `.dropdown-menu` có 32 `<li>` lồng nhau nên phải dùng `> li:last-child` | ⚠️ chưa có TC — viết theo bản mới |
| 2026-08-18 | Rà soát chất lượng | REQ-LOGIN-09 | 🟡 Sửa | **Phép thử cũ không chứng minh được kết luận.** Bản cũ kết luận "không cấp cookie mới" dựa trên "giá trị `key` không đổi" — không phân biệt được *không cấp* với *cấp lại trùng giá trị*, và bị nhiễu bởi cookie sót từ phiên trước. Thay bằng phép thử **trạng thái sạch**. Chạy lại thực tế: kết luận **đúng**, nhưng nay đã có bằng chứng hợp lệ. Gỡ giá trị token hardcode | ⚠️ chưa có TC — viết theo bản mới |
| 2026-08-18 | Rà soát chất lượng | REQ-LOGIN-06, 19, 20 | 🟡 Sửa | Tiêu đề tab thật là `(16) Dashboard` — có tiền tố **đếm thông báo động**; `body.className` thật còn có `invoices-total-manual` và `chrome`. AC cũ ghi khớp tuyệt đối → TC sinh ra sẽ đỏ. Đổi sang assert **chứa** | ⚠️ chưa có TC — viết theo bản mới |
| 2026-08-18 | Rà soát chất lượng | REQ-LOGIN-05, 07 | 🟡 Sửa | Tách rule gộp. `REQ-05` giữ lại **chỉ** phần CAPTCHA; `REQ-07` giữ lại **chỉ** phần hoa/thường. Phần tách ra thành `REQ-36`, `REQ-37`, `REQ-38` — **giữ nguyên mã cũ** cho phần ở lại | ⚠️ chưa có TC — viết theo bản mới |
| 2026-08-18 | Rà soát chất lượng | REQ-LOGIN-13, 16, 17 | 🟡 Sửa | `REQ-13`: `validationMessage` là chuỗi của **trình duyệt**, cấm dùng làm assertion cross-browser · `REQ-16`: đổi tên cho khớp AC (máy chủ không trả `value` ≠ người dùng thấy ô rỗng — autofill vẫn điền) · `REQ-17`: không assert mã `307`, chỉ assert điểm dừng | ⚠️ chưa có TC — viết theo bản mới |
| 2026-08-18 | Kiểm chứng thực tế | REQ-LOGIN-36 → 40 | 🟢 Thêm | `36` không có đăng nhập mạng xã hội · `37` trang nạp 0 script · `38` email bỏ qua khoảng trắng · `39` cookie `autologin` **không** tự đăng nhập lại sau khi đăng xuất chủ động (kiểm chứng thật) · `40` hành vi khi phiên hết hạn tự nhiên — ⚪ chưa kiểm chứng | — (viết TC mới) |
| 2026-08-18 | Rà soát chất lượng | — | 🟢 Thêm | Mở `AMB-15` (Ghi nhớ đăng nhập có tác dụng gì — 🔴), `AMB-16` (lối đăng xuất mobile), `AMB-17` (mã 307). Bổ sung 2 chuyển tiếp cookie ghi nhớ vào ma trận trạng thái. Gắn `RISK-06` vào hạng mục cấp Epic | — |
| 2026-08-18 | Rà soát chất lượng | — | ✏️ Biên tập | 🔒 **Gỡ token `autologin` thật khỏi 2 vị trí**, thay bằng hình thái. Thay 2 ảnh Dashboard full-page (chứa tên khách hàng, số tiền, nhật ký hoạt động) bằng ảnh viewport chỉ có phần cần làm bằng chứng. Sửa dòng danh mục evidence khai sai trạng thái menu. Sửa dòng tổng ma trận phân quyền (thiếu 1 ô "không áp dụng"). Đổi "Chống nghe lại" → "Không lưu đệm trang sau đăng nhập" | — |
| 2026-08-14 | UI recon | REQ-LOGIN-01 → 35 | 🟢 Thêm | Khởi tạo tài liệu từ khảo sát UI thực tế + tầng network. Ghi nhận `REQ-LOGIN-27` ở trạng thái ⚪ (chưa kiểm chứng luồng gửi mail đặt lại trên môi trường dùng chung). Mở 14 ambiguity, 7 risk | — (viết TC mới) |
