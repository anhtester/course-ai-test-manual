# Đặc tả Yêu cầu — Module Đăng nhập / Xác thực (`LOGIN`)

> Điểm vào cấp hệ thống: [../README.md](../README.md) · Bản đồ khám phá: [../_discovery/modules/module_01_dang_nhap.md](../_discovery/modules/module_01_dang_nhap.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | Perfex CRM — Anh Tester Demo |
| **Module** | Đăng nhập / Xác thực |
| **Prefix** | `LOGIN` |
| **Route** | `/admin/authentication` · `/admin/authentication/forgot_password` · `/admin/authentication/reset_password/<id>/<key>` · `/admin/authentication/logout` |
| **Nền tảng** | Web ✅ · Mobile — chưa có · API — chưa có |
| **Nguồn phân tích** | Khảo sát UI thực tế + tầng network — chi tiết trình duyệt ở file nền tảng web |
| **Ngày phân tích** | 14-08-2026 · **rà soát và kiểm chứng lại 18-08-2026** |
| **Tài khoản dùng khảo sát** | 1 tài khoản duy nhất — hiển thị "Admin Example", `user-id-2` |
| **Môi trường dùng chung** | **CÓ** — mọi thao tác đều chỉ đọc hoặc có thể hoàn tác; không gửi mail đặt lại mật khẩu cho tài khoản thật |
| **Tổng số REQ** | **44** — trong đó **40** nằm trong phạm vi viết TC; 4 REQ ra ngoài phạm vi theo quyết định PO 18-08-2026 (`27`, `34`, `35`, `40`) |
| **Dải mã đã dùng** | `REQ-LOGIN-01` → `REQ-LOGIN-44` · `AMB-LOGIN-01` → `AMB-LOGIN-20` · `RISK-LOGIN-01` → `RISK-LOGIN-08` |
| **Mã kế tiếp** | Đợt phân tích sau bắt đầu từ `REQ-LOGIN-45` · `AMB-LOGIN-21` · `RISK-LOGIN-09` — **KHÔNG đánh lại từ 01** |
| **Ambiguity còn treo** | **0** — đã xử lý **20/20** (`AMB-LOGIN-20` ✅ 19-09-2026) |
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
| **Luồng gửi mail đặt lại mật khẩu với email có thật** (`REQ-LOGIN-27`) | ⏭️ Quyết định PO 18-08-2026 — bỏ qua case này (`AMB-LOGIN-04`). Kéo theo `RISK-LOGIN-04` chuyển sang *đã chấp nhận* |
| **Tính năng Ghi nhớ đăng nhập** (`REQ-LOGIN-40`) | ⏭️ Quyết định PO 18-08-2026 — PO xác nhận **không hoạt động** (`AMB-LOGIN-15`). Ba REQ đã kiểm chứng về cookie (`08`, `09`, `39`) **vẫn trong phạm vi**; chỉ hành vi tự đăng nhập là ngoài phạm vi |
| **Kiểm chứng đầu-cuối popup cảnh báo timer** (`REQ-LOGIN-30`) | ⏭️ Quyết định 18-08-2026 — chuyển sang module `TASK` (`AMB-LOGIN-14`). Bản thân REQ **vẫn thuộc** module này |
| Quản lý tài khoản / vai trò (`/admin/staff`, `/admin/roles`) | 403 với tài khoản hiện tại — thuộc khu Setup ngoài phạm vi |
| Đổi ngôn ngữ giao diện sau đăng nhập | Thuộc module `PROF` |

---

## Bản đồ tài liệu

| Nền tảng | File | Story | REQ bao phủ |
|---|---|---|---|
| Chung ≥ 2 nền tảng | chính file này | — | — (module mới có một nền tảng) |
| Web | [web/requirements_login_web.md](web/requirements_login_web.md) | STORY-LOGIN-01 → 06 | `REQ-LOGIN-01` → `REQ-LOGIN-44` (44) |

| Nội dung | Ở đâu |
|---|---|
| Metadata · Tổng quan & phạm vi (mục 1) · Ma trận phân quyền (6) · Ma trận trạng thái (7) · Phân rã Story (10) · AMB & RISK (11) · Nhật ký (13) | **File này** |
| Bản đồ phủ tài liệu (2) · Bảng REQ (3) · Đặc tả trường (4) · Business rules & Validation (5) · Luồng xử lý (8) · Phi chức năng quan sát được (9) · Danh mục Evidence (12) | [web/requirements_login_web.md](web/requirements_login_web.md) |
| Ảnh evidence | [web/evidence/](web/evidence/) |

---

## 6. Ma trận Phân quyền

Module Đăng nhập nằm **trước** lớp phân quyền: bản thân trang đăng nhập, trang Quên mật khẩu và điểm cuối Đăng xuất mở cho mọi người, không phụ thuộc vai trò. Phần phụ thuộc vai trò là **đích đến sau khi đăng nhập** và tập menu hiển thị — hiện chưa kiểm chứng được vì chỉ có một tài khoản.

Hệ thống có **3 vai trò**: `Admin` · `Project Manager` · `Customer` (`AMB-LOGIN-01` ✅ 18-08-2026). Đã được cấp tài khoản cả 3 vai trò và **kiểm chứng thật toàn bộ ma trận** ngày 18-08-2026.

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

> ✅ **Ma trận này là ma trận duy nhất trong dự án hiện đã kiểm chứng 100%.** Đăng nhập thật bằng cả 3 tài khoản ngày 18-08-2026, thử từng URL, không ô nào suy diễn.
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
| Phiên hết hạn tự nhiên **và còn cookie `autologin`** | Mở URL nội bộ | ⚪ **Chưa xác định** — `REQ-LOGIN-40`, chặn bởi `AMB-LOGIN-13` + `AMB-LOGIN-15` | — |

> Thời gian sống của phiên và điều kiện tự hết hạn **chưa xác định** — xem `AMB-LOGIN-13`.
>
> ⚠️ Hai dòng cuối là **hai tình huống khác nhau**, đừng gộp: đăng xuất chủ động đã kiểm chứng là **không** tự đăng nhập lại; phiên hết hạn tự nhiên thì **chưa ai biết**. Toàn bộ công dụng của tính năng Ghi nhớ đăng nhập nằm ở dòng cuối và hiện chưa có bằng chứng nào.

---

## 10. Phân rã Epic / Story

| Story ID | Tên Story | REQ bao phủ | Số REQ | AMB / RISK liên quan | Ghi chú phạm vi |
|---|---|---|---|---|---|
| STORY-LOGIN-01 | Giao diện trang đăng nhập | REQ-LOGIN-01 → 05 · **36** · **37** | 7 | AMB-LOGIN-11 · RISK-LOGIN-01 | Chỉ kiểm tra hiển thị và cấu trúc, không tương tác nghiệp vụ |
| STORY-LOGIN-02 | Đăng nhập thành công | REQ-LOGIN-06 → 09 · **38** | 5 | AMB-LOGIN-13 · RISK-LOGIN-07 | Gồm cả tuỳ chọn Ghi nhớ đăng nhập |
| STORY-LOGIN-03 | Kiểm tra dữ liệu & đăng nhập thất bại | REQ-LOGIN-10 → 16 · **41** · **43** | 9 | AMB-LOGIN-02 ✅ · AMB-LOGIN-09 ✅ · AMB-LOGIN-10 ✅ · RISK-LOGIN-01 · RISK-LOGIN-03 ✅ | ✅ Hết BLOCKED. ⚠️ Chứa `REQ-LOGIN-16` — TC **sẽ FAIL** vì hệ thống lỗi (`AMB-LOGIN-10`), phải mở bug |
| STORY-LOGIN-04 | Bảo vệ phiên & điều hướng | REQ-LOGIN-17 → 22 · **42** · **44** | 8 | AMB-LOGIN-08 ✅ · AMB-LOGIN-12 ⏭️ · AMB-LOGIN-17 ✅ · AMB-LOGIN-19 ✅ · AMB-LOGIN-20 ✅ | Gồm bảo vệ CSRF, hết hạn phiên và ép HTTPS. ⚠️ `REQ-LOGIN-44` — TC **sẽ FAIL** (chưa ép HTTPS), bug đang mở. `REQ-LOGIN-42` chạy **1 giờ** — tách khỏi bộ smoke |
| STORY-LOGIN-05 | Quên mật khẩu | REQ-LOGIN-23 → REQ-LOGIN-28 | 6 | AMB-LOGIN-03 ⏭️ · AMB-LOGIN-04 ⏭️ · AMB-LOGIN-05 ✅ · RISK-LOGIN-04 ⚠️ · RISK-LOGIN-05 ⚠️ | ⏭️ **Thu hẹp phạm vi** — `REQ-LOGIN-27` ra ngoài phạm vi (`AMB-LOGIN-04` bỏ qua). 5 REQ còn lại vẫn test bình thường. `AMB-LOGIN-03` ⏭️ — HTTP 500 với mã khoá sai là hiện trạng **được chấp nhận** (`REQ-LOGIN-28`) |
| STORY-LOGIN-06 | Đăng xuất & vòng đời cookie ghi nhớ | REQ-LOGIN-29 → 35 · **39** · **40** | 9 | AMB-LOGIN-06 · AMB-LOGIN-07 · AMB-LOGIN-14 ⏭️ · AMB-LOGIN-15 ⏭️ · AMB-LOGIN-16 · RISK-LOGIN-02 · **RISK-LOGIN-08** | ⏭️ **Thu hẹp phạm vi** — `REQ-LOGIN-40` ra ngoài phạm vi (Remember Me không hoạt động) · `REQ-LOGIN-30` giữ nguyên nhưng việc kiểm chứng đầu-cuối chuyển sang module `TASK` |

**Tổng: 6 Story / 44 REQ** — mọi REQ thuộc đúng một Story, không mồ côi, không trùng (7+5+9+8+6+9 = 44 ✔).

**Phạm vi thực tế sẽ viết TC:** 44 REQ − 4 REQ ngoài phạm vi (`REQ-LOGIN-27`, `34`, `35`, `40`) = **40 REQ**.

**Đối chiếu AMB/RISK — mọi mã đều có chỗ đứng, không mã nào mồ côi:**

| Nhóm | Mã | Nằm ở đâu |
|---|---|---|
| AMB thuộc Story | AMB-LOGIN-02…20 (trừ 01, 18) | 18 mã, phân bổ ở bảng trên |
| AMB cấp Epic | AMB-LOGIN-01 · AMB-LOGIN-18 | Ma trận Phân quyền — cả hai đã ✅, xem bảng Epic bên dưới |
| RISK thuộc Story | RISK-LOGIN-01, 02, 03, 04, 05, 07, 08 | 7 mã, phân bổ ở bảng trên |
| RISK cấp Epic | RISK-LOGIN-06 | Cắt ngang toàn module — xem bảng Epic bên dưới |

### Hạng mục cấp Epic (cố ý không gán vào Story nào)

| Hạng mục | Lý do |
|---|---|
| Ma trận Phân quyền (mục 6) | Cắt ngang mọi Story. ✅ **Đã hoàn thiện 18-08-2026** — có đủ tài khoản 3 vai trò, kiểm chứng 100% (`AMB-LOGIN-01` ✅, `AMB-LOGIN-18` ✅) |
| Ma trận Trạng thái phiên (mục 7) | Cắt ngang STORY-LOGIN-02, 04, 06 |
| Yêu cầu phi chức năng (mục 9) | Áp cho toàn module |
| Bảng Ambiguity & Risk (mục 11) | Đánh số theo toàn module |
| `RISK-LOGIN-06` — module là cổng vào toàn hệ thống | Không thuộc Story nào vì rủi ro nằm ở **mức module**, không ở một luồng cụ thể; giảm thiểu bằng cách xếp thứ tự chạy (xem bảng dưới), không bằng thêm test case |

### Thứ tự triển khai đề xuất

| Thứ tự | Story | Lý do |
|---|---|---|
| 1 | STORY-LOGIN-02 | Đường đi thuận — mọi module khác cần đăng nhập được mới test tiếp; phải xanh trước tiên |
| 2 | STORY-LOGIN-01 | Rẻ, không rủi ro, chốt nền tảng locator cho automation |
| 3 | STORY-LOGIN-03 | ✅ **Hết BLOCKED** — `AMB-LOGIN-02` đã trả lời (không khoá tài khoản). TC thử sai lặp lại chạy được an toàn trên tài khoản thật |
| 4 | STORY-LOGIN-04 | Phụ thuộc STORY-LOGIN-02 (cần phiên hợp lệ để test điều hướng khi đã đăng nhập) |
| 5 | STORY-LOGIN-06 | Phụ thuộc STORY-LOGIN-02. Hết BLOCKED — `REQ-LOGIN-30` chấp nhận bằng chứng đọc mã nguồn (`AMB-LOGIN-14` ⏭️ chuyển `TASK`), `REQ-LOGIN-40` ra ngoài phạm vi (`AMB-LOGIN-15` ⏭️) |
| 6 | STORY-LOGIN-05 | Hết BLOCKED nhưng **thu hẹp** — `REQ-LOGIN-27` ra ngoài phạm vi (`AMB-LOGIN-04` ⏭️). 5 REQ còn lại test bình thường. ⚠️ `AMB-LOGIN-03` (HTTP 500 trắng trang khi mã khoá sai) **vẫn treo 🔴** và vẫn cần trả lời |

> ✅ **Sau quyết định PO 18-08-2026: không Story nào còn BLOCKED.** Có thể chạy sinh test case cho toàn module ngay.

---

## 11. Điểm Mơ Hồ & Rủi Ro

### 11.1. Ambiguities

| Mã | Câu hỏi | Nguy cơ | Mức độ | Assumption tạm | Trạng thái | Kết luận |
|---|---|---|---|---|---|---|
| AMB-LOGIN-01 | Hệ thống có bao nhiêu vai trò, tên là gì? Xin cấp tài khoản vai trò thấp hơn để kiểm chứng 7 ô đang `❔` ở ma trận phân quyền | Không dựng được ma trận phân quyền thật cho module này và **mọi** module còn lại | 🔴 | Chỉ test với tài khoản đang có; mọi kết luận về vai trò khác đều để `❔` | ✅ Đã trả lời 18-08-2026 | **Hệ thống có 3 vai trò: `Admin` · `Project Manager` · `Customer`.** Phần *tên vai trò* đã xong. Phần *xin tài khoản để kiểm chứng* **chưa** → tách thành `AMB-LOGIN-18`. Ma trận phân quyền vẫn giữ `❔` cho vai trò chưa có tài khoản |
| AMB-LOGIN-02 | Có khoá tài khoản sau N lần đăng nhập sai không? Ngưỡng bao nhiêu, khoá bao lâu, tính theo email hay theo IP? | Không biết ngưỡng thì không viết được test case khoá tài khoản; thử mò trên môi trường dùng chung có thể khoá cả team | 🔴 | Giả định **không** có cơ chế khoá; không viết TC khoá tài khoản cho tới khi có câu trả lời | ✅ Đã trả lời 18-08-2026 | **Không có cơ chế khoá tài khoản.** Kết luận **trùng** Giả định tạm → không TC nào phải sửa. Chốt thành `REQ-LOGIN-41`. Hệ quả: `RISK-LOGIN-03` đóng (không còn nguy cơ khoá cả đội), `RISK-LOGIN-01` chuyển từ *nghi ngờ* sang **xác nhận** |
| AMB-LOGIN-03 | `reset_password` với mã khoá sai trả HTTP 500 trắng trang — đúng thiết kế hay lỗi? | Người dùng bấm liên kết hết hạn sẽ thấy trang lỗi trình duyệt, không biết phải làm gì tiếp | 🔴 | Coi là **lỗi**; TC kỳ vọng phải có trang thông báo thân thiện | ⏭️ Bỏ qua 18-08-2026 | **Quyết định: bỏ qua.** ⚠️ Giả định tạm bị **huỷ** — TC **không còn** kỳ vọng trang thông báo thân thiện, mà ghi nhận đúng hiện trạng HTTP 500 (`REQ-LOGIN-28`). `RISK-LOGIN-05` chuyển sang **chấp nhận hoàn toàn** |
| AMB-LOGIN-04 | Trang Quên mật khẩu trả gì khi email **có thật**? Có khác `Email not found` không? Kiểm chứng luồng gửi mail bằng cách nào trên môi trường dùng chung? | Nếu khác nhau thì kẻ tấn công dò được email nào có tài khoản. Và luồng khôi phục mật khẩu hiện chưa test được đầu-cuối | 🔴 | Giả định email có thật cho thông báo thành công khác hẳn → **có** lộ danh sách tài khoản | ⏭️ Bỏ qua 18-08-2026 | **Quyết định: bỏ qua case này.** Không kiểm chứng luồng gửi mail với email có thật. Hệ quả: `REQ-LOGIN-27` giữ ⚪ và ra **ngoài phạm vi kiểm thử**; `RISK-LOGIN-04` (lộ email nào có tài khoản) chuyển sang **rủi ro đã chấp nhận** — không xác minh, không viết TC |
| AMB-LOGIN-05 | Bỏ trống email ở Quên mật khẩu ra `Email not found` thay vì thông báo trường bắt buộc như trang đăng nhập — cố ý hay thiếu validate? | Thông báo sai bản chất làm người dùng tưởng email của mình không tồn tại | 🟡 | Coi là **thiếu validate**; TC kỳ vọng thông báo trường bắt buộc | ✅ Đã trả lời 18-08-2026 | **Thiếu validate trường bắt buộc — là LỖI.** Trùng Giả định tạm. `REQ-LOGIN-25` đổi sang ghi **hành vi đúng** (báo trường bắt buộc); hiện trạng `Email not found` là sai → 🐞 **cần mở bug**. TC viết theo REQ sẽ FAIL trên hệ thống hiện tại — đó là kết quả đúng |
| AMB-LOGIN-06 | Cookie `autologin` còn nguyên trong trình duyệt sau khi đăng xuất — có cần xoá không? | Máy dùng chung: cookie chứa `user_id` và `key` nằm lại sau khi người dùng tưởng đã đăng xuất | 🟡 | Coi là **cần xoá**; TC kỳ vọng cookie biến mất sau khi đăng xuất | ⏭️ Bỏ qua 18-08-2026 | **Quyết định: bỏ qua, không viết TC.** Giả định tạm bị huỷ — không kỳ vọng cookie bị xoá. `REQ-LOGIN-34` giữ nguyên là ghi nhận hiện trạng, ra **ngoài phạm vi viết TC** |
| AMB-LOGIN-07 | Cookie `autologin` không có cờ `HttpOnly` — cố ý hay sót? | Bất kỳ lỗ hổng XSS nào ở khu `/admin` đều đọc được cookie này | 🟡 | Coi là **sót**; ghi thành `RISK-LOGIN-02` để đội bảo mật xử lý | ⏭️ Bỏ qua 18-08-2026 | **Quyết định: bỏ qua, không viết TC.** `REQ-LOGIN-35` giữ nguyên là ghi nhận hiện trạng, ra **ngoài phạm vi viết TC**. `RISK-LOGIN-02` chuyển sang **rủi ro đã chấp nhận** |
| AMB-LOGIN-08 | Mã CSRF sai trả HTTP **403** nhưng nội dung ghi **419 Page Expired!** — mã nào là đúng? | Automation và giám sát bắt theo mã trạng thái sẽ phân loại nhầm | 🟡 | Kiểm theo **403** (giá trị thực tế trên tab Network) và kiểm chuỗi `419 Page Expired!` trong nội dung | ✅ Đã trả lời 18-08-2026 | **Tạm chấp nhận `419 Page Expired!`.** Trùng Giả định tạm ở phần quan trọng: TC assert **chuỗi nội dung** `419 Page Expired!`, **không** assert mã HTTP (vì header thật trả 403, lệch với nội dung và chưa được sửa) |
| AMB-LOGIN-09 | Chính sách mật khẩu (độ dài tối thiểu, ký tự bắt buộc) quy định ở đâu? Màn hình đăng nhập không ràng buộc gì | Không viết được TC biên cho trường mật khẩu | 🟡 | Màn hình **đăng nhập** không ràng buộc độ dài — mọi ràng buộc thuộc màn hình đổi/đặt mật khẩu | ✅ Đã trả lời 18-08-2026 | **Không có chính sách mật khẩu nào được quy định.** Rộng hơn Giả định tạm (vốn chỉ nói màn hình đăng nhập). Hệ quả: **không viết TC biên cho trường mật khẩu** ở bất kỳ màn hình nào. Bổ sung vào `RISK-LOGIN-01` |
| AMB-LOGIN-10 | Sau khi đăng nhập thất bại, email đã nhập bị xoá — cố ý hay thiếu? | Người dùng phải gõ lại email mỗi lần sai mật khẩu | 🟡 | Coi là **thiếu**; TC ghi nhận hiện trạng và gắn nhãn cải thiện trải nghiệm | ✅ Đã trả lời 18-08-2026 | ⚠️ **KHÁC Giả định tạm.** Hành vi đúng là **phải giữ lại email**; hiện trạng xoá đi là **LỖI hệ thống**. `REQ-LOGIN-16` đảo từ *ghi nhận hiện trạng* sang *ghi kỳ vọng đúng* → 🐞 **cần mở bug**. TC viết theo REQ sẽ FAIL trên hệ thống hiện tại |
| AMB-LOGIN-11 | Checkbox Remember me mang `value="estimate"` — giá trị này có ý nghĩa gì không? | Automation dựa vào `value` có thể hiểu sai; nếu là lỗi sao chép mã thì có thể đổi bất ngờ | 🟢 | Coi là giá trị vô nghĩa còn sót lại; automation chỉ thao tác trạng thái tích/không tích, **không** dựa vào `value` | ✅ Đã trả lời 18-08-2026 | **Không mang ý nghĩa gì.** Trùng Giả định tạm → giữ nguyên luật: automation chỉ thao tác trạng thái tích/không tích, **cấm** dựa vào `value="estimate"` |
| AMB-LOGIN-12 | Bị chuyển về trang đăng nhập thì không giữ URL đích — có kế hoạch bổ sung không? | Người dùng mở liên kết sâu (từ email, từ chat) phải tự điều hướng lại sau khi đăng nhập | 🟡 | Ghi nhận hiện trạng: **không** giữ URL đích | ⏭️ Bỏ qua 18-08-2026 | **Quyết định: bỏ qua.** Trùng Giả định tạm nên không đổi gì — `REQ-LOGIN-18` giữ nguyên là ghi nhận hiện trạng và **vẫn trong phạm vi** viết TC |
| AMB-LOGIN-13 | Phiên đăng nhập sống bao lâu? Cookie `autologin` hết hạn khi nào? Có cho phép nhiều phiên song song không? | Không viết được TC hết phiên và TC đăng nhập nhiều nơi | 🟡 | Không viết TC hết phiên cho tới khi có ngưỡng cụ thể | ✅ Đã trả lời 18-08-2026 | **Phiên đăng nhập sống 1 giờ.** Chốt thành `REQ-LOGIN-42`. ⚠️ Chưa rõ 1 giờ tính theo **không hoạt động** hay theo **tổng thời gian từ lúc đăng nhập** → `AMB-LOGIN-19`. Hai vế còn lại (hạn cookie `autologin`, nhiều phiên song song) **không được trả lời** và nay không còn cần: Remember Me đã ra ngoài phạm vi (`AMB-LOGIN-15`) |
| AMB-LOGIN-14 | Dựng dữ liệu thế nào để có task với timer đang chạy, nhằm kiểm chứng popup cảnh báo khi đăng xuất? Môi trường dùng chung nên khởi động timer sẽ ảnh hưởng người khác | `REQ-LOGIN-30` chỉ mới đọc được từ mã nguồn hàm `logout()`, chưa chạy thật đầu-cuối | 🟡 | Chấp nhận bằng chứng ở mức đọc mã nguồn; đánh dấu TC tương ứng là `assumption-based` | ⏭️ Bỏ qua ở module này 18-08-2026 | **Quyết định: chuyển việc kiểm chứng sang module `TASK`** — nơi sở hữu tính năng timer. `REQ-LOGIN-30` giữ 🟢 ở mức bằng chứng đọc mã nguồn. ⚠️ **Phụ thuộc chéo module:** khi recon `TASK`, phải kiểm chứng đầu-cuối popup này và cập nhật ngược `REQ-LOGIN-30` |
| AMB-LOGIN-15 | Tính năng **Ghi nhớ đăng nhập** rốt cuộc có tác dụng gì? Đã kiểm chứng: cookie `autologin` được cấp đúng khi tích, và **không** tự đăng nhập lại sau khi đăng xuất chủ động. Vậy nó chỉ có tác dụng khi phiên hết hạn tự nhiên? Thời gian sống của cookie là bao lâu? | Cả tính năng hiện **không có bằng chứng nào cho thấy nó hoạt động**. Nếu hỏng, người dùng tích Remember me vẫn phải đăng nhập lại mỗi lần — không ai phát hiện vì không có TC nào phủ | 🔴 | Coi tính năng là **chưa kiểm chứng**; `REQ-LOGIN-40` giữ ⚪, không viết TC khẳng định tự đăng nhập cho tới khi biết thời gian sống của phiên (`AMB-LOGIN-13`) | ⏭️ Bỏ qua 18-08-2026 | **Quyết định: Remember Me không hoạt động — bỏ qua.** `REQ-LOGIN-40` chốt ở ⚪ với ghi chú *không hoạt động*, không viết TC. `REQ-LOGIN-08`, `09`, `39` **vẫn giữ 🟢** vì là sự kiện đã kiểm chứng thật (cookie được cấp / không được cấp / không tự đăng nhập sau đăng xuất). ⚠️ Checkbox vẫn hiển thị trên UI → `RISK-LOGIN-08` |
| AMB-LOGIN-16 | Lối đăng xuất trong `div.mobile-navbar` có thật sự dùng được ở viewport mobile không? Ở desktop `1600×750` nó bị `display:none`, hộp `0×0` | Đợt khảo sát đầu đã đếm 2 phần tử DOM rồi kết luận nhầm là "2 lối đăng xuất". Nếu mobile cũng hỏng thì người dùng mobile **không có** lối đăng xuất nào | 🟡 | Coi là **chỉ dùng được ở mobile**; cần một lượt recon riêng ở viewport mobile mới khẳng định được | ✅ Đã trả lời 18-08-2026 | **Dùng được ở viewport mobile.** Trùng Giả định tạm. `REQ-LOGIN-29` cập nhật: desktop 1 lối (dropdown avatar), mobile 1 lối (`mobile-navbar`). ⚠️ Nguồn là **quyết định PO**, chưa có lượt recon mobile nào — muốn viết TC mobile thì phải recon ở viewport mobile trước |
| AMB-LOGIN-17 | `GET /admin/clients` khi chưa đăng nhập ghi nhận mã **307** trên tab Network — chuyển hướng xác thực thường là 302/303. Mã thật là gì? | Automation và giám sát bắt theo mã trạng thái sẽ phân loại nhầm — cùng loại vấn đề với `AMB-LOGIN-08` | 🟡 | **Không** assert mã chuyển hướng; chỉ assert điểm dừng là `/admin/authentication` (`REQ-LOGIN-17`) | ✅ Đã trả lời 18-08-2026 | **Tạm chấp nhận `307`.** Assert **bắt buộc**: điểm dừng là `/admin/authentication`. Assert mã `307`: **tuỳ chọn**, đã được chấp nhận — nhưng vẫn khuyến nghị không dùng làm assert chính vì giá trị này do công cụ ghi nhận, chưa đối chiếu với header thật của máy chủ |
| AMB-LOGIN-18 | Xin cấp tài khoản vai trò **Project Manager** và **Customer** để kiểm chứng ma trận phân quyền. Kèm câu hỏi: vai trò `Customer` có đăng nhập vào khu `/admin` không, hay chỉ dùng cổng khách hàng? | Tên vai trò đã biết (`AMB-LOGIN-01`) nhưng **vẫn không dựng được ma trận thật** — 14 ô đang `❔`. Áp cho **mọi** module, không riêng `LOGIN` | 🔴 | Ma trận ghi đủ 3 cột theo tên vai trò thật, ô nào chưa kiểm chứng để `❔`. **Không** suy quyền của vai trò này từ vai trò khác | ✅ Đã trả lời 18-08-2026 | **Đã được cấp đủ 3 tài khoản** (lưu ở `.env`, không ghi vào tài liệu). Ma trận phân quyền của `LOGIN` nay **kiểm chứng 100%**, không còn ô `❔`. Trả lời câu hỏi kèm theo: **`Customer` KHÔNG đăng nhập được vào `/admin`** — chốt thành `REQ-LOGIN-43`. 🔑 Tài khoản này dùng được cho **mọi module còn lại** — đây là nút thắt cấp hệ thống đã được gỡ |
| AMB-LOGIN-19 | Phiên sống **1 giờ** (`AMB-LOGIN-13`) tính theo **thời gian không hoạt động** (mỗi thao tác gia hạn lại) hay theo **tổng thời gian từ lúc đăng nhập** (hết giờ là out dù đang dùng)? | Hai cách cho **hai TC khác hẳn nhau**: một cái phải để yên 1 giờ, cái kia phải thao tác liên tục suốt 1 giờ rồi kiểm. Chọn sai là TC đo nhầm thứ | 🟡 | Giả định là **thời gian không hoạt động** (phổ biến hơn ở PHP session); TC để yên 1 giờ rồi kiểm. Gắn nhãn `assumption-based` | ✅ Đã trả lời 19-09-2026 | **Tính theo thời gian không hoạt động — mỗi thao tác gia hạn lại.** Trùng Giả định tạm → TC để yên 1 giờ rồi kiểm vẫn đúng, **gỡ nhãn `assumption-based`**. `REQ-LOGIN-42` bổ sung AC2: đang thao tác thì **không** bị đăng xuất dù tổng thời gian đã quá 1 giờ → **cần thêm 1 TC** cho vế gia hạn |
| AMB-LOGIN-20 | Truy cập trang đăng nhập bằng `http://` có **bắt buộc** tự chuyển sang `https://` (kèm HSTS) không? Tài liệu chỉ ghi "toàn bộ qua HTTPS" ở mục môi trường, không có REQ nào ràng buộc | `CRM_LOGIN_TC_039` và bug Critical/P1 `BUG_login_1785678750_TC039` dựa trên kỳ vọng chưa được chốt — dev có thể phản bác bug. TC đang truy vết nhầm về `REQ-LOGIN-01` (REQ đó không nói gì về HTTPS) | 🟡 | Viết TC theo chuẩn bảo mật (phải chuyển + HSTS) | ✅ Đã trả lời 19-09-2026 | **Bắt buộc — hệ thống phải tự chuyển sang HTTPS.** Trùng Giả định tạm. Chốt thành `REQ-LOGIN-44`; `CRM_LOGIN_TC_039` chuyển truy vết sang REQ này, bug giữ nguyên. Đo lại cùng ngày bằng `curl -I`: máy chủ **vẫn** trả `200` qua HTTP, không chuyển hướng, không HSTS → bug chưa sửa. ⚠️ Chrome tự nâng `http://` lên `https://` nên kiểm bằng mắt dễ PASS giả |

### 11.2. Risks

| Mã | Rủi ro | Mô tả | Mitigation |
|---|---|---|---|
| RISK-LOGIN-01 | **XÁC NHẬN** — hệ thống không có bất kỳ lớp chống thử vét cạn nào | Bốn dữ kiện đã chốt, không còn là nghi ngờ: không CAPTCHA (`REQ-LOGIN-05`) · không giới hạn tần suất · **không khoá tài khoản** (`AMB-LOGIN-02` ✅) · **không có chính sách mật khẩu nào được quy định** (`AMB-LOGIN-09` ✅). Cộng với mật khẩu của các tài khoản demo đều rất yếu (6 ký tự số, giống nhau ở cả 3 vai trò) → tài khoản dò được không giới hạn số lần | Báo đội bảo mật: đây là quyết định thiết kế cần được biết, không phải phát hiện của QA. Trong phạm vi test: `REQ-LOGIN-41` chốt hành vi hiện tại; TC thử sai lặp lại **nay đã an toàn để chạy** vì không có cơ chế khoá |
| RISK-LOGIN-02 | Cookie `autologin` đọc được bằng JavaScript | Không có cờ `HttpOnly`; cookie chứa `user_id` và `key` dùng để tự đăng nhập | Báo đội phát triển (`AMB-LOGIN-07`). Khi kiểm thử bảo mật, ghép với mọi điểm nghi ngờ XSS trong khu `/admin` |
| RISK-LOGIN-03 | ✅ **ĐÓNG 18-08-2026** — môi trường dùng chung, thử khoá tài khoản có thể chặn cả đội | Rủi ro này dựa trên giả thiết *có thể có* cơ chế khoá. `AMB-LOGIN-02` đã trả lời: **không có khoá** → không còn nguy cơ khoá cả đội | Không cần giảm thiểu nữa. **Gỡ ràng buộc:** TC đăng nhập sai lặp lại nay chạy được bình thường trên tài khoản thật. Vẫn giữ thói quen dùng email không tồn tại khi chỉ cần lấy thông báo lỗi |
| RISK-LOGIN-04 | ⚠️ **ĐÃ CHẤP NHẬN 18-08-2026** — luồng Quên mật khẩu có thể lộ email nào có tài khoản | `Email not found` cho email không tồn tại; phản hồi với email có thật **sẽ không được kiểm chứng** vì `AMB-LOGIN-04` ⏭️ bỏ qua | Rủi ro được chấp nhận có ý thức, **không** giảm thiểu. Nếu sau này có đợt kiểm thử bảo mật riêng thì đây là mục đầu tiên cần mở lại |
| RISK-LOGIN-05 | ⚠️ **ĐÃ CHẤP NHẬN HOÀN TOÀN 18-08-2026** — luồng khôi phục mật khẩu có thể hỏng hoàn toàn | Liên kết đặt lại với mã khoá sai trả HTTP 500 trắng trang (`REQ-LOGIN-28`); liên kết **hợp lệ** không được kiểm chứng. Cả hai vế đã có quyết định PO: `AMB-LOGIN-03` ⏭️ chấp nhận HTTP 500 là hiện trạng, `AMB-LOGIN-04` ⏭️ không kiểm chứng luồng gửi mail thật | Rủi ro được chấp nhận có ý thức, **không** giảm thiểu. TC của `REQ-LOGIN-28` ghi nhận đúng hiện trạng HTTP 500, **không** kỳ vọng trang thông báo thân thiện. Người dùng thật vẫn chạm được lỗi này khi bấm liên kết hết hạn — nếu sau này có đợt cải thiện trải nghiệm thì mở lại `AMB-LOGIN-03` trước tiên |
| RISK-LOGIN-06 | Module là cổng vào của toàn hệ thống | Bất kỳ hỏng hóc nào ở đây đều chặn kiểm thử **23 module** còn lại | Xếp STORY-LOGIN-02 chạy đầu tiên trong mọi bộ smoke; đưa vào kiểm tra sức khoẻ hằng ngày |
| RISK-LOGIN-07 | Mật khẩu tài khoản demo rất yếu và dùng chung cho cả 3 vai trò | Mật khẩu chỉ **6 ký tự số** và **giống hệt nhau** ở `Admin`, `Project Manager`, `Customer` — ai biết URL và một email là đăng nhập được. Giá trị thật lưu ở `.env` | Không commit `.env` (đã có trong `.gitignore`). **KHÔNG** ghi giá trị mật khẩu / token vào `docs/` hay ảnh chụp màn hình — chỉ mô tả hình thái. Xem `skills-requirements-analyzer` mục 7.1 |
| RISK-LOGIN-08 | ⚠️ **ĐÃ CHẤP NHẬN 18-08-2026** — checkbox Ghi nhớ đăng nhập hiển thị nhưng không hoạt động | `AMB-LOGIN-15` ⏭️ chốt tính năng **không hoạt động**, nhưng checkbox `#remember` **vẫn hiển thị và tích được** trên trang đăng nhập, và hệ thống **vẫn cấp cookie `autologin`** khi tích (`REQ-LOGIN-08` đã kiểm chứng). Người dùng tích vào và tin rằng mình sẽ không phải đăng nhập lại. Cookie cấp ra còn mang `user_id` + `key` mà không có `HttpOnly` (`RISK-LOGIN-02`) — tức vẫn có bề mặt tấn công cho một tính năng không mang lại lợi ích nào | Rủi ro được chấp nhận theo quyết định "bỏ qua". **Ghi nhận để báo dev:** nếu tính năng không dùng thì nên **gỡ checkbox** và ngừng cấp cookie, thay vì để nguyên. Không viết TC cho tính năng này |

---

## 13. Nhật ký Thay đổi

| Ngày | Nguồn | REQ ảnh hưởng | Loại | Tóm tắt thay đổi | TC cần xử lý |
|---|---|---|---|---|---|
| 21-09-2026 | Quy ước đặt tên | — | ✏️ Biên tập | Đổi tên file index `requirements_login.md` → `REQUIREMENTS_LOGIN_SUMMARY.md` — quy ước mới: index IN HOA để khác hẳn file nền tảng. Nội dung, mã REQ/TC không đổi; mọi link trỏ tới đã sửa | — |
| 19-09-2026 | Quyết định PO (trả lời qua chat) | REQ-LOGIN-44 | 🟢 Thêm | Mở và đóng ngay `AMB-LOGIN-20`: PO chốt truy cập qua `http://` **bắt buộc** tự chuyển sang `https://` → thêm `REQ-LOGIN-44` (STORY-LOGIN-04, kèm HSTS). Trước đó kỳ vọng này chỉ nằm trong `CRM_LOGIN_TC_039`, không có REQ nào ràng buộc. Đo `curl -I` cùng ngày: hệ thống **chưa đạt** → bug `TC039` giữ trạng thái đang mở. Module **44 REQ · 40 trong phạm vi**, ambiguity treo vẫn **0** | `CRM_LOGIN_TC_039` — đổi cột REQ `REQ-LOGIN-01` → `REQ-LOGIN-44`, gỡ ghi chú "chưa được xác nhận là yêu cầu" |
| 19-09-2026 | Recon bổ sung (đo trên trang đăng nhập, không đăng nhập) | REQ-LOGIN-21 | ✏️ Biên tập | Bổ sung vào AC hành vi đã đo: mã CSRF **cố định trong một phiên** (cookie `csrf_cookie_name`), nạp lại trang không đổi, phiên mới mới đổi. Khớp mô tả "đổi theo phiên" sẵn có — **không đổi nghĩa REQ**, giữ 🟢 | `CRM_LOGIN_TC_024` mục 🔧`2` — sửa kỳ vọng |
| 19-09-2026 | Chuyển tầng nền tảng | REQ-LOGIN-01 → 43 | ✏️ Biên tập | **Chuyển sang cấu trúc tầng nền tảng** (skill `skills-requirements-analyzer` mục 5.3): toàn bộ 43 REQ chỉ áp web → `web/requirements_login_web.md` cùng mục 2, 3, 4, 5, 8, 9, 12; ảnh `evidence/` → `web/evidence/`. Index giữ metadata, phạm vi, ma trận, Story, AMB/RISK, Nhật ký và thêm `## Bản đồ tài liệu`. **Mã REQ, số mục và nội dung không đổi** | — |
| 19-09-2026 | Quyết định PO (trả lời qua chat) | REQ-LOGIN-42 | 🟡 Sửa | `AMB-LOGIN-19` ✅ — phiên 1 giờ tính theo **thời gian không hoạt động**, **mỗi thao tác gia hạn lại**. Trùng Giả định tạm. `REQ-LOGIN-42` viết lại thành 2 AC: AC1 để yên quá 1 giờ thì hết phiên · AC2 thao tác liên tục thì không bị đăng xuất dù tổng thời gian đã quá 1 giờ. Module hết ambiguity treo (**19/19**) | `CRM_LOGIN_TC_026` — gỡ `@AssumptionBased`, gỡ cảnh báo `AMB-LOGIN-19` còn treo, xoá `ASM-01` · **Thêm 1 TC mới** cho AC2 (vế gia hạn) — chạy `/update-testcases-from-impact` |
| 19-09-2026 | Rà soát nhất quán tài liệu | — | 🟡 Sửa | Sửa dòng `RISK-LOGIN-05` và `STORY-LOGIN-05` còn ghi `AMB-LOGIN-03` **vẫn treo 🔴** — sót từ đợt `PO-2026-08-18-B`: bảng AMB và [impact_PO-2026-08-18-B.md](impact/impact_PO-2026-08-18-B.md) đã chốt `AMB-LOGIN-03` ⏭️ và `RISK-LOGIN-05` → **chấp nhận hoàn toàn**, nhưng chưa áp vào bảng Risk. Chỉ đồng bộ ghi chép, không đổi nội dung REQ nào | — |
| 18-08-2026 | Quyết định PO + kiểm chứng thật (`PO-2026-08-18-B`) | REQ-LOGIN-43 · Ma trận Phân quyền | 🟢 Thêm | **Được cấp tài khoản đủ 3 vai trò** (`AMB-LOGIN-01` ✅, `AMB-LOGIN-18` ✅). Đăng nhập thật cả 3 → ma trận phân quyền **kiểm chứng 100%**, từ 7 ô `❔` xuống **0**. Phát hiện: `Customer` đăng nhập ở `/login` (cổng khách hàng) và **không** vào được `/admin` kể cả khi đang có phiên khách hàng hợp lệ → chốt `REQ-LOGIN-43`. `Project Manager` là `user-id-3`, menu trái 9 mục so với 14 của Admin | — (viết TC mới) |
| 18-08-2026 | Quyết định PO (`PO-2026-08-18-B`) | REQ-LOGIN-42 | 🟢 Thêm | `AMB-LOGIN-13` ✅ — phiên đăng nhập sống **1 giờ** → chốt `REQ-LOGIN-42`. Mở `AMB-LOGIN-19`: 1 giờ tính theo thời gian không hoạt động hay tổng thời gian từ lúc đăng nhập | — (viết TC mới, gắn `assumption-based`) |
| 18-08-2026 | Quyết định PO (`PO-2026-08-18-B`) | REQ-LOGIN-16, 25 | 🟡 Sửa | ⚠️ **Hai REQ đảo từ *ghi nhận hiện trạng* sang *ghi kỳ vọng đúng*** — PO xác nhận cả hai là **lỗi hệ thống**: `REQ-16` (`AMB-LOGIN-10` — phải giữ lại email sau đăng nhập lỗi) và `REQ-25` (`AMB-LOGIN-05` — phải báo trường bắt buộc thay vì `Email not found`). 🐞 TC viết theo hai REQ này **sẽ FAIL** trên bản hiện tại — đó là kết quả đúng, phải mở bug | — (viết TC mới, gắn kèm bug) |
| 18-08-2026 | Quyết định PO (`PO-2026-08-18-B`) | REQ-LOGIN-28, 29, 34, 35 | 🟡 Sửa | `REQ-28` chốt **chấp nhận** HTTP 500 hiện trạng (`AMB-LOGIN-03` ⏭️) · `REQ-29` bổ sung nhánh mobile dùng được (`AMB-LOGIN-16` ✅) · `REQ-34`, `REQ-35` ra **ngoài phạm vi viết TC** (`AMB-LOGIN-06`, `AMB-LOGIN-07` ⏭️) | — |
| 18-08-2026 | Quyết định PO (`PO-2026-08-18-B`) | — | ✏️ Biên tập | Đóng nốt `AMB-LOGIN-08` (chấp nhận `419 Page Expired!`), `AMB-LOGIN-09` (không có chính sách mật khẩu → không viết TC biên mật khẩu), `AMB-LOGIN-11` (`value="estimate"` vô nghĩa), `AMB-LOGIN-12` ⏭️, `AMB-LOGIN-17` (chấp nhận `307`). Ambiguity còn treo: **1** | — |
| 18-08-2026 | Quyết định PO (`PO-2026-08-18`) | REQ-LOGIN-41 | 🟢 Thêm | `AMB-LOGIN-02` được trả lời: **không có cơ chế khoá tài khoản**. Chốt thành `REQ-LOGIN-41`. Kết luận **trùng** Giả định tạm nên không TC nào phải sửa. Gỡ BLOCKED cho `STORY-LOGIN-03` | — (viết TC mới) |
| 18-08-2026 | Quyết định PO (`PO-2026-08-18`) | REQ-LOGIN-27, 40 | 🟡 Sửa | Hai REQ ra **ngoài phạm vi kiểm thử** theo quyết định bỏ qua: `REQ-27` (gửi mail đặt lại, `AMB-LOGIN-04` ⏭️) và `REQ-40` (Ghi nhớ đăng nhập không hoạt động, `AMB-LOGIN-15` ⏭️). **Giữ nguyên dòng và mã**, chỉ đổi ghi chú phạm vi — không phải 🔴 Deprecated vì tính năng chưa bị gỡ khỏi hệ thống | — (không viết TC cho 2 REQ này) |
| 18-08-2026 | Quyết định PO (`PO-2026-08-18`) | REQ-LOGIN-30 | 🟡 Sửa | `AMB-LOGIN-14` ⏭️ — việc kiểm chứng đầu-cuối popup cảnh báo timer **chuyển sang module `TASK`**. REQ vẫn thuộc module `LOGIN`, bằng chứng vẫn ở mức đọc mã nguồn. Ghi phụ thuộc chéo module để khi recon `TASK` phải cập nhật ngược | ⚠️ TC gắn nhãn `assumption-based` |
| 18-08-2026 | Quyết định PO (`PO-2026-08-18`) | — | 🟢 Thêm | `RISK-LOGIN-08` mới: checkbox Ghi nhớ đăng nhập **vẫn hiển thị và vẫn cấp cookie** dù tính năng không hoạt động. `RISK-LOGIN-01` chuyển từ *nghi ngờ* sang **xác nhận** · `RISK-LOGIN-03` **đóng** (không còn nguy cơ khoá cả đội) · `RISK-LOGIN-04` và `RISK-LOGIN-05` chuyển sang **rủi ro đã chấp nhận** | — |
| 18-08-2026 | Rà soát chất lượng + kiểm chứng lại trên UI | REQ-LOGIN-29 | 🟡 Sửa | **Sửa sai sót khảo sát.** Bản cũ ghi "hai lối đăng xuất" do đếm 2 phần tử `li.header-logout` trong DOM. Kiểm chứng lại: cái trong `ul.nav.navbar-nav` có hộp `0×0` và `offsetParent === null` (tổ tiên `div.mobile-navbar` `display:none` ở desktop) → ở desktop **chỉ có 1** lối dùng được. Bổ sung cảnh báo locator: `.dropdown-menu` có 32 `<li>` lồng nhau nên phải dùng `> li:last-child` | ⚠️ chưa có TC — viết theo bản mới |
| 18-08-2026 | Rà soát chất lượng | REQ-LOGIN-09 | 🟡 Sửa | **Phép thử cũ không chứng minh được kết luận.** Bản cũ kết luận "không cấp cookie mới" dựa trên "giá trị `key` không đổi" — không phân biệt được *không cấp* với *cấp lại trùng giá trị*, và bị nhiễu bởi cookie sót từ phiên trước. Thay bằng phép thử **trạng thái sạch**. Chạy lại thực tế: kết luận **đúng**, nhưng nay đã có bằng chứng hợp lệ. Gỡ giá trị token hardcode | ⚠️ chưa có TC — viết theo bản mới |
| 18-08-2026 | Rà soát chất lượng | REQ-LOGIN-06, 19, 20 | 🟡 Sửa | Tiêu đề tab thật là `(16) Dashboard` — có tiền tố **đếm thông báo động**; `body.className` thật còn có `invoices-total-manual` và `chrome`. AC cũ ghi khớp tuyệt đối → TC sinh ra sẽ đỏ. Đổi sang assert **chứa** | ⚠️ chưa có TC — viết theo bản mới |
| 18-08-2026 | Rà soát chất lượng | REQ-LOGIN-05, 07 | 🟡 Sửa | Tách rule gộp. `REQ-05` giữ lại **chỉ** phần CAPTCHA; `REQ-07` giữ lại **chỉ** phần hoa/thường. Phần tách ra thành `REQ-36`, `REQ-37`, `REQ-38` — **giữ nguyên mã cũ** cho phần ở lại | ⚠️ chưa có TC — viết theo bản mới |
| 18-08-2026 | Rà soát chất lượng | REQ-LOGIN-13, 16, 17 | 🟡 Sửa | `REQ-13`: `validationMessage` là chuỗi của **trình duyệt**, cấm dùng làm assertion cross-browser · `REQ-16`: đổi tên cho khớp AC (máy chủ không trả `value` ≠ người dùng thấy ô rỗng — autofill vẫn điền) · `REQ-17`: không assert mã `307`, chỉ assert điểm dừng | ⚠️ chưa có TC — viết theo bản mới |
| 18-08-2026 | Kiểm chứng thực tế | REQ-LOGIN-36 → 40 | 🟢 Thêm | `36` không có đăng nhập mạng xã hội · `37` trang nạp 0 script · `38` email bỏ qua khoảng trắng · `39` cookie `autologin` **không** tự đăng nhập lại sau khi đăng xuất chủ động (kiểm chứng thật) · `40` hành vi khi phiên hết hạn tự nhiên — ⚪ chưa kiểm chứng | — (viết TC mới) |
| 18-08-2026 | Rà soát chất lượng | — | 🟢 Thêm | Mở `AMB-LOGIN-15` (Ghi nhớ đăng nhập có tác dụng gì — 🔴), `AMB-LOGIN-16` (lối đăng xuất mobile), `AMB-LOGIN-17` (mã 307). Bổ sung 2 chuyển tiếp cookie ghi nhớ vào ma trận trạng thái. Gắn `RISK-LOGIN-06` vào hạng mục cấp Epic | — |
| 18-08-2026 | Rà soát chất lượng | — | ✏️ Biên tập | 🔒 **Gỡ token `autologin` thật khỏi 2 vị trí**, thay bằng hình thái. Thay 2 ảnh Dashboard full-page (chứa tên khách hàng, số tiền, nhật ký hoạt động) bằng ảnh viewport chỉ có phần cần làm bằng chứng. Sửa dòng danh mục evidence khai sai trạng thái menu. Sửa dòng tổng ma trận phân quyền (thiếu 1 ô "không áp dụng"). Đổi "Chống nghe lại" → "Không lưu đệm trang sau đăng nhập" | — |
| 14-08-2026 | UI recon | REQ-LOGIN-01 → 35 | 🟢 Thêm | Khởi tạo tài liệu từ khảo sát UI thực tế + tầng network. Ghi nhận `REQ-LOGIN-27` ở trạng thái ⚪ (chưa kiểm chứng luồng gửi mail đặt lại trên môi trường dùng chung). Mở 14 ambiguity, 7 risk | — (viết TC mới) |
