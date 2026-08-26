# Software Requirements Specification (SRS)
## Module: Đăng nhập (Login / Authentication)
### Hệ thống: Perfex CRM – Anh Tester Demo
**URL khảo sát:** https://crm.anhtester.com/admin/authentication
**Ngày biên soạn:** 26/08/2026
**Phiên bản:** 1.0

---

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu này đặc tả yêu cầu phần mềm (SRS) cho module **Đăng nhập (Login)** của hệ thống Perfex CRM, được khảo sát trực tiếp trên môi trường demo tại `https://crm.anhtester.com/admin/authentication`. Tài liệu phục vụ làm cơ sở cho việc phát triển, kiểm thử (test case, test plan) và nghiệm thu chức năng đăng nhập.

### 1.2 Phạm vi
Module Đăng nhập cho phép người dùng (Admin/Staff) xác thực danh tính bằng **Email** và **Mật khẩu** để truy cập vào khu vực quản trị (`/admin`) của hệ thống CRM. Phạm vi tài liệu bao gồm:
- Màn hình Đăng nhập (Login)
- Chức năng "Ghi nhớ đăng nhập" (Remember me)
- Chức năng "Quên mật khẩu" (Forgot Password)
- Chức năng Đăng xuất (Logout)

Không bao gồm: chức năng đăng ký tài khoản, xác thực hai lớp (2FA), đăng nhập bằng mạng xã hội (Social Login) — các chức năng này không xuất hiện trên giao diện khảo sát.

### 1.3 Đối tượng sử dụng
- QA/Tester: thiết kế test case dựa trên yêu cầu.
- Developer: đối chiếu hành vi hệ thống hiện tại.
- Business Analyst/Product Owner: rà soát và bổ sung yêu cầu.

### 1.4 Định nghĩa, thuật ngữ viết tắt
| Thuật ngữ | Giải thích |
|---|---|
| SRS | Software Requirements Specification |
| CRM | Customer Relationship Management |
| CSRF | Cross-Site Request Forgery |
| UC | Use Case |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |

---

## 2. Mô tả tổng quan

### 2.1 Bối cảnh sản phẩm
Perfex CRM là hệ thống quản lý khách hàng, dự án, hóa đơn... Module Đăng nhập là cổng vào (gateway) bắt buộc trước khi truy cập bất kỳ chức năng nào trong khu vực `/admin`. Khi người dùng chưa đăng nhập và truy cập một URL thuộc `/admin/*`, hệ thống điều hướng về trang Đăng nhập.

### 2.2 Đối tượng người dùng
- **Admin**: quản trị viên hệ thống, quyền truy cập đầy đủ.
- **Staff**: nhân viên nội bộ (không khảo sát chi tiết trong phạm vi tài liệu này, giả định dùng chung màn hình đăng nhập).

### 2.3 Môi trường khảo sát thực tế
Tài khoản dùng để kiểm thử: `admin@example.com` / `123456` — đăng nhập thành công và được điều hướng đến trang **Bảng tin (Dashboard)**.

### 2.4 Giả định và ràng buộc
- Hệ thống sử dụng giao thức HTTPS.
- Ngôn ngữ hiển thị sau đăng nhập ghi nhận là Tiếng Việt (giao diện Dashboard: "Bảng tin", "Khách hàng", "Công việc"...) trong khi màn hình Đăng nhập hiển thị tiếng Anh ("Login", "Email Address", "Password") — cần làm rõ với BA/PO liệu đây là hành vi thiết kế (đa ngôn ngữ chưa đồng bộ) hay lỗi.
- Form đăng nhập có trường ẩn (hidden input) dùng cho token bảo mật (khả năng là CSRF token), cho thấy hệ thống có cơ chế chống giả mạo yêu cầu.

---

## 3. Yêu cầu chức năng (Functional Requirements)

### 3.1 Danh sách phần tử giao diện (Login Form)
Ghi nhận thực tế trên trang `/admin/authentication`:

| # | Phần tử | Loại | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| 1 | Email Address | Input `type="email"` | Có | Placeholder/label: "Email Address" |
| 2 | Password | Input `type="password"` | Có | Label: "Password" |
| 3 | Remember me | Checkbox | Không | Ghi nhớ phiên đăng nhập |
| 4 | Login | Button `type="submit"` | — | Gửi form đăng nhập |
| 5 | Forgot Password? | Link | — | Điều hướng đến `/admin/authentication/forgot_password` |
| 6 | (hidden) CSRF token | Input `type="hidden"` | — | Token bảo mật, sinh tự động mỗi lần tải trang |

### 3.2 FR-01: Đăng nhập với thông tin hợp lệ
**Mô tả:** Người dùng nhập đúng Email và Mật khẩu đã đăng ký, nhấn nút **Login**.
**Kết quả mong đợi (đã xác nhận thực tế):**
- Hệ thống xác thực thành công.
- Điều hướng người dùng đến trang **Bảng tin (Dashboard)** tại `/admin/`.
- Hiển thị menu điều hướng đầy đủ (Khách hàng, Dự án, Công việc, Hợp đồng, Doanh số, Thuê bao, Chi phí, Hỗ trợ, Khách tiềm năng, Yêu cầu báo giá, Kiến thức, Tiện ích, Báo cáo...).

**Test data đã kiểm chứng:** `admin@example.com` / `123456` → Đăng nhập thành công.

### 3.3 FR-02: Đăng nhập với thông tin không hợp lệ
**Mô tả:** Người dùng nhập Email/Mật khẩu sai (không khớp dữ liệu hệ thống).
**Kết quả mong đợi (đã xác nhận thực tế):**
- Hệ thống **không** cho phép đăng nhập, ở lại trang Login.
- Hiển thị thông báo lỗi: **"Invalid email or password"**.
- Thông báo lỗi không tiết lộ cụ thể trường nào sai (email hay password) — phù hợp thông lệ bảo mật (tránh dò tài khoản hợp lệ - user enumeration).

**Test data đã kiểm chứng:** `wrong@example.com` / `wrongpass` → Hiển thị "Invalid email or password".

### 3.4 FR-03: Validate trường bắt buộc khi bỏ trống
**Mô tả:** Người dùng nhấn **Login** khi chưa nhập Email và/hoặc Password.
**Kết quả mong đợi (đã xác nhận thực tế):**
- Hệ thống hiển thị đồng thời các thông báo:
  - **"The Email Address field is required."**
  - **"The Password field is required."**
- Form không được submit tới bước xác thực (validate phía server, hiển thị lại trang Login).

*Lưu ý cho việc thiết kế test case:* cần bổ sung kiểm thử validate riêng lẻ (chỉ bỏ trống Email, chỉ bỏ trống Password) để xác nhận thông báo hiển thị độc lập theo từng trường.

### 3.5 FR-04: Chức năng "Remember me"
**Mô tả:** Checkbox cho phép ghi nhớ phiên đăng nhập.
**Yêu cầu:**
- Khi chọn "Remember me" và đăng nhập thành công, phiên đăng nhập cần được duy trì lâu hơn mức mặc định (ví dụ qua cookie có thời hạn dài) ngay cả sau khi đóng trình duyệt.
- Khi không chọn, phiên đăng nhập theo mặc định (session cookie, hết hạn khi đóng trình duyệt hoặc theo timeout cấu hình).

*Ghi chú:* Hành vi chi tiết về thời gian hết hạn cookie cần được xác nhận thêm ở tầng kỹ thuật (không quan sát được qua UI); đây là yêu cầu suy ra từ tên chức năng, cần QA kiểm thử bằng công cụ dev tools/network.

### 3.6 FR-05: Chức năng "Quên mật khẩu" (Forgot Password)
**Mô tả:** Từ màn hình Login, người dùng nhấn link **"Forgot Password?"**, được điều hướng đến `/admin/authentication/forgot_password`.
**Giao diện ghi nhận:**
| Phần tử | Loại |
|---|---|
| Email Address | Input |
| Confirm | Button submit |

**Kết quả mong đợi:**
- Người dùng nhập Email đã đăng ký, nhấn **Confirm**.
- Hệ thống gửi email chứa liên kết/hướng dẫn đặt lại mật khẩu đến địa chỉ email đã nhập (hành vi gửi mail chưa được kiểm chứng trực tiếp trong lần khảo sát này do không truy cập hộp thư).
- Cần bổ sung kiểm thử: nhập email không tồn tại trong hệ thống → xác nhận thông báo trả về (thành công chung chung để tránh lộ thông tin, hoặc báo lỗi cụ thể).

### 3.7 FR-06: Đăng xuất (Logout)
**Mô tả:** Người dùng đã đăng nhập có thể đăng xuất khỏi hệ thống.
**Kết quả mong đợi (đã xác nhận thực tế):**
- Truy cập chức năng đăng xuất sẽ kết thúc phiên làm việc và điều hướng người dùng trở lại trang **Login**.
- Sau khi đăng xuất, truy cập lại các URL thuộc `/admin/*` phải được điều hướng về trang Login (chưa kiểm thử trực tiếp trong phiên khảo sát này — khuyến nghị bổ sung).

### 3.8 FR-07: Bảo vệ CSRF
**Mô tả:** Form đăng nhập chứa một trường ẩn (`type="hidden"`) chứa giá trị token, được sinh mới mỗi lần tải lại trang.
**Yêu cầu:** Hệ thống phải từ chối các yêu cầu đăng nhập không kèm token hợp lệ hoặc token đã hết hạn/không khớp, nhằm chống tấn công giả mạo yêu cầu (CSRF).

---

## 4. Yêu cầu phi chức năng (Non-Functional Requirements)

| Mã | Hạng mục | Mô tả |
|---|---|---|
| NFR-01 | Bảo mật | Mật khẩu phải được truyền qua HTTPS và không hiển thị dạng plain text trên giao diện (input type="password" đã xác nhận). Không được để lộ nguyên nhân đăng nhập thất bại cụ thể (email sai hay password sai). |
| NFR-02 | Hiệu năng | Thời gian phản hồi từ khi nhấn "Login" đến khi hiển thị Dashboard hoặc thông báo lỗi nên dưới 3 giây trong điều kiện mạng bình thường. |
| NFR-03 | Khả năng sử dụng (Usability) | Thông báo lỗi rõ ràng, hiển thị ngay trên form, không yêu cầu người dùng phải suy đoán. |
| NFR-04 | Khả năng tương thích | Form đăng nhập cần hoạt động đúng trên các trình duyệt phổ biến (Chrome, Edge, Firefox, Safari) và trên các kích thước màn hình khác nhau (responsive). |
| NFR-05 | Đa ngôn ngữ | Cần rà soát tính nhất quán ngôn ngữ giữa trang Login (tiếng Anh) và khu vực sau đăng nhập (tiếng Việt). |
| NFR-06 | Khả năng chịu tấn công brute-force | Hệ thống nên có cơ chế giới hạn số lần đăng nhập sai liên tiếp (rate limiting/khóa tài khoản tạm thời/CAPTCHA) — **chưa quan sát được trong phạm vi khảo sát**, khuyến nghị bổ sung yêu cầu và kiểm thử riêng. |

---

## 5. Quy tắc nghiệp vụ (Business Rules)

1. Email và Mật khẩu là hai trường bắt buộc để thực hiện đăng nhập.
2. Định dạng trường Email phải hợp lệ (input HTML5 `type="email"` hỗ trợ validate định dạng cơ bản ở phía client).
3. Đăng nhập thất bại không được tiết lộ trường nào (email/password) gây ra lỗi.
4. Sau khi đăng nhập thành công, người dùng được điều hướng mặc định đến trang Bảng tin (Dashboard).
5. Người dùng chưa đăng nhập không được phép truy cập trực tiếp các trang trong khu vực `/admin/*` (cần bổ sung kiểm thử xác nhận).

---

## 6. Ma trận Use Case tóm tắt

| Use Case | Actor | Điều kiện tiên quyết | Kết quả |
|---|---|---|---|
| UC-01 Đăng nhập thành công | Admin/Staff | Có tài khoản hợp lệ | Vào Dashboard |
| UC-02 Đăng nhập thất bại | Admin/Staff | Nhập sai email/password | Thông báo "Invalid email or password" |
| UC-03 Bỏ trống trường bắt buộc | Admin/Staff | Không nhập email/password | Thông báo lỗi required cho từng trường |
| UC-04 Ghi nhớ đăng nhập | Admin/Staff | Chọn checkbox Remember me | Duy trì phiên đăng nhập dài hạn |
| UC-05 Quên mật khẩu | Admin/Staff | Nhấn "Forgot Password?" | Chuyển đến form nhập email khôi phục |
| UC-06 Đăng xuất | Admin/Staff | Đã đăng nhập | Kết thúc phiên, quay lại trang Login |

---

## 7. Vấn đề còn mở / Khuyến nghị kiểm thử bổ sung

1. Kiểm tra cơ chế khóa tài khoản/giới hạn số lần đăng nhập sai (chống brute-force).
2. Kiểm tra hành vi thực tế của "Remember me" (thời hạn cookie) bằng công cụ Network/Application của trình duyệt.
3. Kiểm tra luồng đặt lại mật khẩu đầy đủ: nhận email, click link, đặt mật khẩu mới, đăng nhập lại bằng mật khẩu mới.
4. Kiểm tra truy cập trực tiếp URL `/admin/*` khi chưa đăng nhập (redirect về Login) và khi phiên đã hết hạn.
5. Kiểm tra tính nhất quán ngôn ngữ (Anh/Việt) giữa trang Login và khu vực quản trị.
6. Kiểm tra khả năng chống SQL Injection/XSS trên các trường Email, Password.
7. Xác nhận với BA/PO về việc có hỗ trợ xác thực hai lớp (2FA) hoặc đăng nhập qua SSO/Social Login trong roadmap hay không (hiện chưa có trên UI).

---

*Tài liệu được biên soạn dựa trên khảo sát thực tế giao diện tại `https://crm.anhtester.com/admin/authentication` ngày 26/08/2026, sử dụng tài khoản kiểm thử `admin@example.com`.*
