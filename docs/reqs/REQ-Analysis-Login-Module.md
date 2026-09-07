# Phân tích Requirement – Module Đăng nhập (Login / Authentication)

**Tài liệu nguồn:** [docs/SRS-Login-Module.md](../SRS-Login-Module.md) (v1.0 – 26/08/2026)
**Hệ thống:** Perfex CRM – Anh Tester Demo (`https://crm.anhtester.com/admin/authentication`)
**Người phân tích:** Senior QA Engineer
**Ngày phân tích:** 07/09/2026
**Phạm vi:** Login, Remember me, Forgot Password, Logout, CSRF

---

## 0. Tổng quan các luồng

| Nhóm luồng | Số lượng | Mã tham chiếu |
|---|---|---|
| Happy Path (luồng chính) | 4 | HP-01 → HP-04 |
| Alternate Path (luồng thay thế) | 7 | AP-01 → AP-07 |
| Exception Path (luồng lỗi/từ chối) | 12 | EP-01 → EP-12 |
| Điểm mơ hồ / thiếu sót / mâu thuẫn | 18 | Q-01 → Q-18 |

Actor chính: **Admin / Staff**. Điều kiện tiên quyết chung: hệ thống chạy trên HTTPS, trang `/admin/authentication` tải thành công, CSRF token được sinh mới mỗi lần tải trang.

---

## 1. HAPPY PATH – Luồng chính (thành công)

### HP-01: Đăng nhập thành công với thông tin hợp lệ (FR-01, UC-01)

**Tiền điều kiện:** Người dùng có tài khoản hợp lệ đang hoạt động; chưa đăng nhập; đang ở trang `/admin/authentication`.

**Các bước:**
1. Hệ thống hiển thị form Login gồm: Email Address, Password, checkbox Remember me, nút Login, link "Forgot Password?" và hidden input chứa CSRF token.
2. Người dùng nhập Email hợp lệ: `admin@example.com`.
3. Người dùng nhập Password đúng: `123456`.
4. Người dùng nhấn nút **Login**.
5. Hệ thống gửi request kèm CSRF token, xác thực thông tin đăng nhập ở phía server.

**Kết quả mong đợi:**
- Xác thực thành công, phiên đăng nhập được khởi tạo.
- Điều hướng đến trang **Bảng tin (Dashboard)** tại `/admin/`.
- Hiển thị đầy đủ menu điều hướng: Khách hàng, Dự án, Công việc, Hợp đồng, Doanh số, Thuê bao, Chi phí, Hỗ trợ, Khách tiềm năng, Yêu cầu báo giá, Kiến thức, Tiện ích, Báo cáo.
- Thời gian phản hồi < 3 giây (NFR-02).

**Hậu điều kiện:** Người dùng ở trạng thái đã đăng nhập, truy cập được các trang `/admin/*`.

---

### HP-02: Đăng nhập thành công có chọn "Remember me" (FR-04, UC-04)

**Tiền điều kiện:** Như HP-01.

**Các bước:**
1. Nhập Email và Password hợp lệ.
2. Tick chọn checkbox **Remember me**.
3. Nhấn **Login**.
4. Đóng hoàn toàn trình duyệt, mở lại và truy cập `/admin/`.

**Kết quả mong đợi:**
- Đăng nhập thành công, vào Dashboard (như HP-01).
- Hệ thống set thêm cookie ghi nhớ có thời hạn dài (persistent cookie), quan sát được ở DevTools → Application → Cookies.
- Sau khi đóng/mở lại trình duyệt, người dùng vẫn ở trạng thái đã đăng nhập, không phải nhập lại thông tin.

**Hậu điều kiện:** Phiên đăng nhập được duy trì vượt qua vòng đời của session cookie.

> ⚠️ **Cảnh báo phân tích:** SRS ghi rõ đây là yêu cầu **suy ra từ tên chức năng**, chưa được kiểm chứng thực tế. Thời hạn cookie cụ thể chưa được định nghĩa → xem **Q-04**.

---

### HP-03: Yêu cầu đặt lại mật khẩu thành công (FR-05, UC-05)

**Tiền điều kiện:** Người dùng đang ở trang Login; có email đã đăng ký trong hệ thống; hộp thư truy cập được.

**Các bước:**
1. Nhấn link **"Forgot Password?"**.
2. Hệ thống điều hướng đến `/admin/authentication/forgot_password`, hiển thị form gồm Email Address và nút **Confirm**.
3. Nhập email đã đăng ký.
4. Nhấn **Confirm**.

**Kết quả mong đợi:**
- Hệ thống hiển thị thông báo xác nhận đã gửi email hướng dẫn đặt lại mật khẩu.
- Email chứa liên kết/hướng dẫn đặt lại mật khẩu được gửi tới địa chỉ đã nhập.

**Hậu điều kiện:** Người dùng nhận được email khôi phục.

> ⚠️ **Cảnh báo phân tích:** Hành vi gửi mail **chưa được kiểm chứng trực tiếp** trong khảo sát. Nội dung thông báo, thời hạn hiệu lực link, và các bước sau khi click link (đặt mật khẩu mới) **hoàn toàn chưa được đặc tả** → xem **Q-06, Q-07, Q-08**.

---

### HP-04: Đăng xuất thành công (FR-06, UC-06)

**Tiền điều kiện:** Người dùng đang ở trạng thái đã đăng nhập, đang ở Dashboard.

**Các bước:**
1. Truy cập chức năng Đăng xuất (Logout).
2. Hệ thống hủy phiên làm việc phía server.

**Kết quả mong đợi:**
- Phiên làm việc kết thúc.
- Điều hướng người dùng trở lại trang **Login**.
- Truy cập lại bất kỳ URL `/admin/*` sau đó đều bị điều hướng về trang Login (BR-05).

**Hậu điều kiện:** Người dùng ở trạng thái chưa đăng nhập; cookie phiên bị xóa/vô hiệu hóa.

> ⚠️ **Cảnh báo phân tích:** Vị trí chính xác của nút/menu Logout trên UI **không được mô tả** trong SRS → xem **Q-09**. Việc redirect sau logout chưa kiểm thử trực tiếp.

---

## 2. ALTERNATE PATH – Luồng thay thế (vẫn hợp lệ, không phải lỗi)

### AP-01: Truy cập URL `/admin/*` khi chưa đăng nhập → redirect về Login
**Mô tả:** Người dùng chưa đăng nhập nhập trực tiếp URL `https://crm.anhtester.com/admin/clients` vào thanh địa chỉ.
**Kết quả mong đợi:** Hệ thống điều hướng về trang `/admin/authentication` (mục 2.1, BR-05).
**Điểm cần làm rõ:** Sau khi đăng nhập thành công, hệ thống có quay lại URL người dùng định truy cập ban đầu (deep-link / return URL) hay luôn về Dashboard? → **Q-01**

### AP-02: Đăng nhập KHÔNG chọn "Remember me" (luồng mặc định)
**Mô tả:** Đăng nhập thành công mà không tick Remember me, sau đó đóng trình duyệt và mở lại.
**Kết quả mong đợi:** Phiên hết hạn theo session cookie mặc định → người dùng bị yêu cầu đăng nhập lại (FR-04).

### AP-03: Điều hướng đến Forgot Password rồi quay lại Login
**Mô tả:** Người dùng nhấn "Forgot Password?" nhưng đổi ý, dùng nút Back của trình duyệt hoặc link quay lại để trở về form Login.
**Kết quả mong đợi:** Form Login hiển thị lại bình thường, CSRF token mới hợp lệ, đăng nhập vẫn thực hiện được.
**Điểm cần làm rõ:** Trang Forgot Password có link "Back to Login" hay không? SRS chỉ liệt kê 2 phần tử (Email Address, Confirm) → **Q-05**

### AP-04: Người dùng đã đăng nhập truy cập lại trang `/admin/authentication`
**Mô tả:** Đang có phiên đăng nhập hợp lệ, người dùng gõ lại URL trang Login.
**Kết quả mong đợi:** Hệ thống nên tự động điều hướng về Dashboard thay vì hiển thị form Login lần nữa.
**Điểm cần làm rõ:** Hành vi này **không được đặc tả** trong SRS → **Q-02**

### AP-05: Submit form bằng phím Enter thay vì click nút Login
**Mô tả:** Nhập Email, Password rồi nhấn phím **Enter** khi con trỏ đang ở trường Password.
**Kết quả mong đợi:** Form được submit tương đương với việc click nút Login, cho kết quả giống HP-01.
**Điểm cần làm rõ:** Không được đặc tả (usability) → **Q-16**

### AP-06: Autofill / trình quản lý mật khẩu của trình duyệt
**Mô tả:** Trình duyệt tự điền Email và Password đã lưu, người dùng chỉ nhấn Login.
**Kết quả mong đợi:** Đăng nhập thành công như HP-01, không bị lỗi validate.

### AP-07: Đăng nhập trên các trình duyệt / kích thước màn hình khác nhau (NFR-04)
**Mô tả:** Thực hiện HP-01 trên Chrome, Edge, Firefox, Safari và ở các độ phân giải desktop/tablet/mobile.
**Kết quả mong đợi:** Form hiển thị đúng bố cục (responsive), mọi phần tử thao tác được, đăng nhập thành công.
**Điểm cần làm rõ:** Danh sách phiên bản trình duyệt và breakpoint cụ thể chưa được định nghĩa → **Q-14**

---

## 3. EXCEPTION PATH – Luồng lỗi / bị từ chối

### EP-01: Sai cả Email và Password (FR-02, UC-02)
**Bước:** Nhập `wrong@example.com` / `wrongpass` → nhấn Login.
**Kết quả mong đợi:** Ở lại trang Login, hiển thị thông báo **"Invalid email or password"**. Không tiết lộ trường nào sai (NFR-01, BR-03).

### EP-02: Email đúng, Password sai
**Bước:** Nhập `admin@example.com` / `wrongpass` → nhấn Login.
**Kết quả mong đợi:** Thông báo **"Invalid email or password"** — **giống hệt** EP-01 và EP-03 để chống user enumeration.

### EP-03: Email không tồn tại, Password đúng của tài khoản khác
**Bước:** Nhập `notexist@example.com` / `123456` → nhấn Login.
**Kết quả mong đợi:** Thông báo **"Invalid email or password"**, nội dung và thời gian phản hồi không khác biệt so với EP-02 (tránh timing-based enumeration).

### EP-04: Bỏ trống cả hai trường (FR-03, UC-03)
**Bước:** Không nhập gì → nhấn Login.
**Kết quả mong đợi:** Hiển thị **đồng thời** 2 thông báo:
- "The Email Address field is required."
- "The Password field is required."

Form không được submit tới bước xác thực; hiển thị lại trang Login (validate phía server).

### EP-05: Chỉ bỏ trống Email
**Bước:** Để trống Email, nhập Password `123456` → nhấn Login.
**Kết quả mong đợi:** Chỉ hiển thị "The Email Address field is required."
**Điểm cần làm rõ:** Giá trị Password đã nhập có được giữ lại sau khi trang render lại không? → **Q-11**

### EP-06: Chỉ bỏ trống Password
**Bước:** Nhập Email `admin@example.com`, để trống Password → nhấn Login.
**Kết quả mong đợi:** Chỉ hiển thị "The Password field is required."
**Điểm cần làm rõ:** Giá trị Email đã nhập có được giữ lại không? → **Q-11**

### EP-07: Email sai định dạng (BR-02)
**Bước:** Nhập `abc`, `abc@`, `abc@@test.com`, `@example.com` vào trường Email → nhấn Login.
**Kết quả mong đợi:** Trình duyệt chặn submit bằng validate HTML5 của `type="email"` (tooltip native), hoặc server trả về thông báo lỗi định dạng.
**Điểm cần làm rõ:** SRS **không quy định thông báo lỗi định dạng email phía server** — chỉ nói client validate "cơ bản". Hành vi khi client validate bị bypass (gửi request trực tiếp) chưa xác định → **Q-10**

### EP-08: Nhập dữ liệu chỉ chứa khoảng trắng
**Bước:** Nhập chuỗi khoảng trắng `"   "` vào Email và/hoặc Password → nhấn Login.
**Kết quả mong đợi:** Hệ thống trim dữ liệu và báo lỗi required, hoặc báo "Invalid email or password".
**Điểm cần làm rõ:** Quy tắc trim khoảng trắng đầu/cuối cho Email và Password chưa được đặc tả → **Q-12**

### EP-09: Đăng nhập sai liên tiếp nhiều lần (NFR-06)
**Bước:** Nhập sai mật khẩu 5, 10, 20 lần liên tiếp cho cùng một tài khoản.
**Kết quả mong đợi (kỳ vọng bảo mật):** Hệ thống kích hoạt cơ chế chống brute-force: rate limiting / khóa tài khoản tạm thời / yêu cầu CAPTCHA.
**Trạng thái:** ⚠️ **CHƯA QUAN SÁT ĐƯỢC** trong khảo sát — SRS ghi nhận đây là khuyến nghị, chưa phải yêu cầu chính thức. Không có ngưỡng, thời gian khóa, hay thông báo cụ thể → **Q-03** (rủi ro cao).

### EP-10: Đăng nhập với CSRF token không hợp lệ / thiếu / hết hạn (FR-07)
**Bước:**
1. Mở trang Login, ghi lại token.
2. Sửa/xóa giá trị hidden input, hoặc để trang mở rất lâu rồi mới submit, hoặc gửi POST từ nguồn khác không kèm token.
**Kết quả mong đợi:** Hệ thống **từ chối** yêu cầu đăng nhập, không xác thực, hiển thị lỗi bảo mật hoặc tải lại trang Login với token mới.
**Điểm cần làm rõ:** Thông báo lỗi cụ thể và thời hạn sống của token chưa được đặc tả → **Q-13**

### EP-11: Tấn công injection trên trường Email/Password
**Bước:** Nhập payload SQL Injection (`' OR '1'='1`) và XSS (`<script>alert(1)</script>`) vào Email/Password → nhấn Login.
**Kết quả mong đợi:** Hệ thống không đăng nhập được, không thực thi script, không trả về lỗi hệ thống/stack trace; hiển thị thông báo lỗi thông thường ("Invalid email or password" hoặc lỗi định dạng).
**Trạng thái:** Là khuyến nghị kiểm thử bổ sung tại mục 7 của SRS, chưa có yêu cầu chức năng tương ứng.

### EP-12: Quên mật khẩu với email không tồn tại trong hệ thống (FR-05)
**Bước:** Tại trang Forgot Password, nhập `notexist@example.com` → nhấn Confirm.
**Kết quả mong đợi (theo thông lệ bảo mật):** Hiển thị thông báo thành công chung chung, không tiết lộ email có tồn tại hay không.
**Trạng thái:** ⚠️ **MÂU THUẪN TIỀM ẨN** — SRS mục 3.6 để ngỏ hai khả năng ("thành công chung chung **hoặc** báo lỗi cụ thể"), trong khi BR-03/NFR-01 yêu cầu không tiết lộ thông tin. Cần chốt → **Q-06**

---

## 4. Điểm mơ hồ, thiếu sót, mâu thuẫn – Câu hỏi cần làm rõ

### 4.1 Nhóm ưu tiên CAO (chặn thiết kế test case / ảnh hưởng bảo mật)

| Mã | Vấn đề | Câu hỏi cần làm rõ | Liên quan |
|---|---|---|---|
| **Q-01** | Thiếu sót | Sau khi bị redirect về Login do chưa đăng nhập, đăng nhập thành công thì hệ thống đưa người dùng về **URL đã yêu cầu ban đầu** hay **luôn về Dashboard**? BR-04 nói "mặc định về Dashboard" — "mặc định" ở đây có ngoại lệ nào không? | AP-01, BR-04 |
| **Q-02** | Thiếu sót | Người dùng **đã đăng nhập** truy cập lại `/admin/authentication` thì hệ thống xử lý thế nào: redirect về Dashboard, hay vẫn hiển thị form Login? | AP-04 |
| **Q-03** | Thiếu sót nghiêm trọng | Cơ chế chống brute-force (NFR-06) hiện có tồn tại trên hệ thống không? Nếu có: **ngưỡng bao nhiêu lần sai**, **thời gian khóa bao lâu**, **khóa theo tài khoản hay theo IP**, **thông báo hiển thị là gì**, và **cách mở khóa**? Nếu không có, đây có được chấp nhận là rủi ro hay cần raise defect? | EP-09, NFR-06 |
| **Q-06** | **Mâu thuẫn** | Với email **không tồn tại** ở chức năng Quên mật khẩu: hệ thống trả về thông báo thành công chung chung (đúng với NFR-01/BR-03) hay báo lỗi cụ thể "Email không tồn tại"? SRS mục 3.6 đang để ngỏ cả hai phương án — cần chốt một. | EP-12, FR-05 |
| **Q-10** | Thiếu sót | Khi bypass validate HTML5 phía client (gửi POST trực tiếp với email sai định dạng), server có validate định dạng email không? Thông báo lỗi chính xác là gì? | EP-07, BR-02 |
| **Q-13** | Thiếu sót | CSRF token có **thời hạn sống (TTL)** bao lâu? Khi token hết hạn/không khớp, thông báo lỗi hiển thị cho người dùng là gì (text chính xác)? Hệ thống trả HTTP status nào? | EP-10, FR-07 |

### 4.2 Nhóm ưu tiên TRUNG BÌNH

| Mã | Vấn đề | Câu hỏi cần làm rõ | Liên quan |
|---|---|---|---|
| **Q-04** | Mơ hồ | "Remember me" duy trì phiên trong **bao lâu cụ thể** (7 ngày / 30 ngày / khác)? Tên cookie là gì? Có thuộc tính `HttpOnly`, `Secure`, `SameSite` không? Khi không tick, session timeout do không thao tác là bao lâu? | HP-02, AP-02, FR-04 |
| **Q-05** | Thiếu sót | Trang Forgot Password có link/nút quay lại trang Login không? SRS chỉ liệt kê 2 phần tử (Email Address, Confirm). | AP-03, FR-05 |
| **Q-07** | Thiếu sót | Link đặt lại mật khẩu trong email có **thời hạn hiệu lực** bao lâu? Link có dùng được **nhiều lần** hay chỉ một lần (one-time token)? | HP-03, FR-05 |
| **Q-08** | Thiếu sót | Luồng **sau khi click link reset**: form đặt mật khẩu mới gồm những trường nào? Có **quy tắc độ mạnh mật khẩu** (độ dài tối thiểu, ký tự đặc biệt, chữ hoa/số) không? Lưu ý test data trong SRS là `123456` — mật khẩu 6 ký tự số → hệ thống hiện **không có** ràng buộc độ mạnh? | FR-05, mục 7.3 |
| **Q-09** | Thiếu sót | Chức năng Đăng xuất nằm ở **vị trí nào trên UI** (menu profile góc phải / sidebar)? URL của action logout là gì? Logout dùng phương thức GET hay POST? | HP-04, FR-06 |
| **Q-11** | Thiếu sót | Khi validate lỗi và trang render lại, giá trị đã nhập ở trường Email có được **giữ lại** không? Trường Password có bị xóa trắng không? Checkbox Remember me có giữ trạng thái đã tick không? | EP-05, EP-06 |
| **Q-12** | Mơ hồ | Hệ thống có **trim khoảng trắng** đầu/cuối cho Email không? Với Password thì sao (thường **không** nên trim)? Email có **phân biệt hoa/thường** không (`Admin@example.com` vs `admin@example.com`)? | EP-08 |
| **Q-15** | Mơ hồ | Có giới hạn **độ dài tối đa** (maxlength) cho trường Email và Password không? Nếu nhập chuỗi rất dài (255+, 1000+ ký tự) thì hệ thống xử lý thế nào? | Edge case |
| **Q-17** | Thiếu sót | Session timeout do **không thao tác (idle)** là bao lâu? Khi phiên hết hạn giữa chừng, người dùng đang thao tác sẽ thấy gì (redirect im lặng hay có thông báo)? | Mục 7.4 |

### 4.3 Nhóm ưu tiên THẤP (usability / phạm vi)

| Mã | Vấn đề | Câu hỏi cần làm rõ | Liên quan |
|---|---|---|---|
| **Q-14** | Mơ hồ | NFR-04 nêu "các trình duyệt phổ biến" và "responsive" nhưng **không nêu phiên bản tối thiểu** và **breakpoint cụ thể**. Danh sách trình duyệt/độ phân giải cần hỗ trợ chính thức là gì? | AP-07, NFR-04 |
| **Q-16** | Thiếu sót | Form có hỗ trợ submit bằng phím **Enter** không? Thứ tự **tab** giữa các trường có đúng chuẩn không? Có yêu cầu về **accessibility** (label, aria) không? | AP-05, NFR-03 |
| **Q-18** | **Mâu thuẫn / cần xác nhận** | Trang Login hiển thị **tiếng Anh** ("Login", "Email Address", "Password", "Invalid email or password") trong khi khu vực sau đăng nhập hiển thị **tiếng Việt** ("Bảng tin", "Khách hàng"). Đây là **thiết kế có chủ đích** (đa ngôn ngữ chưa đồng bộ) hay là **defect** cần raise? Nếu là defect, mức độ ưu tiên nào? Kết quả mong đợi trong test case nên viết theo ngôn ngữ nào? | Mục 2.4, NFR-05 |

### 4.4 Câu hỏi về phạm vi (Scope)

| Mã | Câu hỏi |
|---|---|
| **Q-19** | Hệ thống có kế hoạch bổ sung **2FA / SSO / Social Login** trong roadmap không? Nếu có trong sprint gần, cần chuẩn bị test case trước hay để sau? (SRS mục 1.2 và 7.7 xác nhận hiện **không có** trên UI.) |
| **Q-20** | Vai trò **Staff** dùng chung màn hình đăng nhập với **Admin** — đây mới chỉ là **giả định** trong SRS mục 2.2, chưa khảo sát. Sau khi đăng nhập, Staff được điều hướng đến đâu và thấy menu gì (khác Admin thế nào)? Cần tài khoản Staff để kiểm thử. |

---

## 5. Đánh giá rủi ro & khuyến nghị

| # | Rủi ro | Mức độ | Khuyến nghị |
|---|---|---|---|
| 1 | Không có cơ chế chống brute-force được xác nhận (Q-03) | 🔴 Cao | Ưu tiên xác minh với Dev/BA trước khi release; nếu thiếu → raise defect bảo mật. |
| 2 | Chính sách mật khẩu yếu — test data `123456` được chấp nhận (Q-08) | 🔴 Cao | Xác nhận có quy tắc độ mạnh mật khẩu ở luồng đặt lại mật khẩu và tạo tài khoản. |
| 3 | Luồng Forgot Password chưa được kiểm chứng end-to-end (HP-03, Q-06/07/08) | 🟠 Trung bình | Chuẩn bị hộp thư test, kiểm thử đầy đủ: nhận mail → click link → đặt mật khẩu mới → đăng nhập lại. |
| 4 | Hành vi Remember me chỉ là suy luận, chưa xác minh (Q-04) | 🟠 Trung bình | Kiểm thử bằng DevTools (Application → Cookies) để xác nhận thuộc tính và thời hạn cookie. |
| 5 | Chưa xác nhận redirect khi truy cập `/admin/*` lúc chưa đăng nhập (AP-01) | 🟠 Trung bình | Bổ sung test case bắt buộc; kiểm cả trường hợp session đã hết hạn. |
| 6 | Không nhất quán ngôn ngữ Anh/Việt (Q-18) | 🟡 Thấp | Chốt với BA/PO trước khi viết Expected Result cho test case. |

---

## 6. Bước tiếp theo

1. Gửi danh sách câu hỏi **Q-01 → Q-20** cho BA/PO/Dev, ưu tiên xử lý nhóm **CAO** trước.
2. Sau khi có câu trả lời cho nhóm CAO, chạy Skill `skills-generate-testcases` để sinh bộ Test Case Manual cho module Login, bám theo 23 luồng (HP/AP/EP) đã bóc tách ở trên.
3. Với các luồng còn phụ thuộc câu hỏi chưa được trả lời, đánh dấu test case là **Blocked / Pending clarification** thay vì tự suy đoán kết quả mong đợi.
4. Chuẩn bị môi trường test: tài khoản Staff (Q-20), hộp thư nhận mail khôi phục (HP-03), công cụ DevTools cho kiểm thử cookie (HP-02).

---

*Tài liệu phân tích được lập dựa trên SRS-Login-Module.md v1.0. Mọi mục đánh dấu ⚠️ là nội dung SRS ghi nhận chưa kiểm chứng thực tế — không được coi là yêu cầu đã chốt khi thiết kế test case.*
