# Test Cases — Module Xác thực & Phiên đăng nhập (`AUTH`) · Book — tổng 193 TC · 3 nền tảng (Mobile Android · API · Web) · độ hạt GỘP

| Thông tin | Nội dung |
|---|---|
| **Hệ thống** | AnhTester Book Management — mã hệ thống `BK` (namespace `_book-api/`) · danh mục TC: [../README.md](../README.md) |
| **Module** | Xác thực & Phiên đăng nhập · prefix `AUTH` |
| **Nguồn requirement** | Index [REQUIREMENTS_AUTH_SUMMARY.md](../../../requirements/_book-api/auth/REQUIREMENTS_AUTH_SUMMARY.md) (8 REQ dùng chung `Android · API · Web` · 29 REQ `Android · Web`) · [mobile/requirements_auth_mobile.md](../../../requirements/_book-api/auth/mobile/requirements_auth_mobile.md) (9 REQ) · [api/requirements_auth_api.md](../../../requirements/_book-api/auth/api/requirements_auth_api.md) (40 REQ) · [web/requirements_auth_web.md](../../../requirements/_book-api/auth/web/requirements_auth_web.md) (35 REQ) — **0 AMB treo** (chốt 25-09-2026, `DEMO-AMB-2509`) · bản đồ API [api_map.md](../../../requirements/_book-api/_discovery/api_map.md) |
| **Mode sinh** | Mobile: QUICK (`/generate-testcases-from-requirements`) · API: `/generate-testcases-api` · Web: QUICK chế độ **BỔ SUNG** — cả ba **độ hạt GỘP** |
| **Ngày sinh** | Mobile 20-09-2026 · API 20-09-2026 · Web 25-09-2026 |
| **Dải TC ID** | `BK_AUTH_TC_001` → `BK_AUTH_TC_193` — **dải chung toàn module**: Mobile `001`→`058` · API `059`→`108` · Web `109`→`193` |
| **Mã kế tiếp** | `BK_AUTH_TC_194` — **KHÔNG đánh lại từ 001** |
| **Mức rủi ro · độ sâu** | `Cao` → **Đầy đủ** — đủ 6 nhánh V1, mọi nhánh V2 có điều kiện kích hoạt, V3/V4 chấm từng nhánh.<br>Căn cứ chấm Cao (chỉ cần 1 dấu hiệu, ở đây có 3): đụng **xác thực** · là **cổng vào** mọi module khác (hỏng thì chặn cả đợt kiểm thử) · tạo bản ghi **người dùng** trên production.<br>**Hạ xuống Tiêu chuẩn khi:** không bao giờ — module xác thực luôn giữ mức Cao |
| **Môi trường** | `https://book.anhtester.com` — **production, server duy nhất**. **Không** dùng chung (user chốt 14-08-2026) nhưng vẫn áp luật: chỉ ghi/xoá bản ghi do chính lượt chạy tạo |
| **Thiết bị chuẩn** | Emulator `Pixel_10_Pro_XL_API_37` · Android 17 · `1344×2992` · dọc · locale `en-US` · app `1.0 (versionCode 1)` bản debug. **iOS chưa khảo sát** — bộ TC này **không** áp cho iOS |
| **Trình duyệt chuẩn (Web)** | Google Chrome (desktop) · viewport `1600×750` · `en-US` — trình duyệt khác / di động chưa khảo sát |
| **Tài khoản** | Mọi tài khoản do **chính TC tạo** (tiền tố `auto_auth_`) — **không** dùng tài khoản có sẵn nào. Mật khẩu `Auto@12345` là dữ liệu test tự sinh, không phải credentials thật |

## Cách đọc bộ TC này

### 1. Độ hạt GỘP

Biến thể của **cùng một trường**, **cùng loại phản hồi** nằm chung một TC, liệt kê ở **Bảng biến thể** (cột `Test Data`). TC kiểm tra tĩnh dùng **Bảng kiểm** (cột `Expected Result`).

- Mỗi biến thể có mã riêng `a`, `b`, `c`… → báo cáo FAIL **bắt buộc** ghi rõ biến thể: `BK_AUTH_TC_010-c FAIL`
- Chạy một TC là chạy **hết** biến thể của nó
- Sang automation: TC gộp → test data-driven (`@DataProvider`), mỗi biến thể một bộ dữ liệu

### 2. Dòng `🔧 Ghi chú kỹ thuật` và `⚠️ chưa có evidence`

| Ký hiệu | Nghĩa | Tester làm gì |
|---|---|---|
| `🔧 Ghi chú kỹ thuật` | Phần kiểm chứng cần Appium Inspector / `adb` / gọi API. TC mang tag `@TechCheck` | **Bỏ qua được** — phần chính vẫn chấm PASS/FAIL đầy đủ. Bỏ thì ghi `— (bỏ phần 🔧)` vào báo cáo |
| `⚠️ … chưa có evidence` | Bước / biến thể chưa được khảo sát bằng ảnh. TC mang tag `@NeedsVerify` | Chạy bình thường; kết quả **khác** kỳ vọng → ghi nguyên văn hiện tượng, **chưa** mở bug ngay — báo QA lead để chốt với PO trước (có thể kỳ vọng sai, không phải app sai) |

### 3. Trạng thái xuất phát dùng lại nhiều lần

| Ký hiệu | Trạng thái | Cách đưa app về |
|---|---|---|
| `S0` | **Chưa đăng nhập**, có mạng, dọc | Đang đăng nhập thì avatar → `Logout`. Hoặc Cài đặt → Ứng dụng → `book.anhtester.com` → Bộ nhớ → **Xoá dữ liệu**, rồi mở lại app |
| `S1` | **`TK-A` đang đăng nhập** | Từ `S0`: avatar → nhập email/mật khẩu của `TK-A` → `Login account` |

---

## Dữ liệu dùng chung

### Tài khoản `TK-A`

| Trường | Giá trị mẫu |
|---|---|
| Name | `Auto Auth 1790150400` |
| Email | `auto_auth_1790150400@auto.test` (chữ thường) |
| Password | `Auto@12345` |
| Tạo bởi | `BK_AUTH_TC_029` (chạy **đầu tiên** của lượt) — hoặc `POST /api/register` với cùng dữ liệu |

### Quy tắc số định danh — dữ liệu phải unique và truy ngược được

Mọi Name / Email trong bộ TC mang một số 10 chữ số dạng `17901504xx` — đây là **mốc mẫu** `1790150400` cộng **độ lệch** `xx` (Mobile `00` → `19` · API `20` → `49`). Khi chạy:

1. Lấy `T` = Unix timestamp tại lúc bắt đầu lượt chạy (10 chữ số)
2. Thay mọi `17901504xx` bằng `T + xx` — VD `T = 1790200000` thì `auto_auth_1790150401_full@auto.test` → `auto_auth_1790200001_full@auto.test`
3. Ghi `T` vào đầu execution report → nhìn email trong CSDL biết ngay lượt chạy nào tạo ra

### Dọn dữ liệu — BẮT BUỘC sau mỗi lượt (`RISK-BK-AUTH-04`)

TC đăng ký tạo tài khoản thật trên production. App **không** có chức năng xoá tài khoản ở phạm vi `AUTH`, nên dọn bằng API: đăng nhập `POST /api/login` bằng **chính** tài khoản đó → `DELETE /api/user/{id}` với token **của chính nó** → đăng nhập lại phải ra `User not found.`

| Độ lệch | Email | Tạo bởi |
|---|---|---|
| `00` | `auto_auth_<T>@auto.test` (`TK-A`) | TC_029 |
| `01` | `auto_auth_<T+1>_full@auto.test` | TC_030 |
| `02` · `03` · `04` | `…_vn` · `…_emoji` · `…_special` | TC_039 |
| `05` | `…_twice` | TC_053 |
| `06` | `…_flow` | TC_054 |
| `07` · `08` · `09` | `…_xss1` · `…_xss2` · `…_sqli` | TC_055 |
| `10`, `14` | chỉ tạo khi app **cho qua** ngoài dự kiến (`TC_032-b`, `TC_040-e`) | — |

🚫 **Không** đăng nhập, sửa hay xoá tài khoản nào không có tiền tố `auto_auth_` — đặc biệt `user@example.com` (`RISK-BK-AUTH-03`).

### Dữ liệu dùng chung (API) — tài khoản do chính lượt chạy tạo

| Ký hiệu | Email (độ lệch) | Mật khẩu | Dùng cho | Tạo bằng |
|---|---|---|---|---|
| `userA` | `auto_auth_<T+30>_a@auto.test` · Name `Auto Auth API A` | `Auto@12345` | Hầu hết TC API cần tài khoản sẵn | `POST /api/register` ở setup |
| `userB` | `auto_auth_<T+31>_b@auto.test` · Name `Auto Auth API B` | `Auto@12345` | TC_071 (token không lẫn tài khoản) | setup |
| `userC` | `auto_auth_<T+36>_c@auto.test` | `Auto@12345` | TC_074-b — **đăng ký rồi xoá ngay** trong TC | trong TC |
| `userD` | `auto_auth_<T+37>_d@auto.test` | `Auto@12345` | TC_097 — tài khoản bị xoá giữa TC | trong TC |
| `userE` | `auto_auth_<T+38>_e@auto.test` | `Auto@12345` | TC_102 → 104 (đổi mật khẩu) — tách riêng để không làm hỏng `userA` | setup |

- Ký hiệu `tokenA` · `rtA` = `body.accessToken` · cookie `refetchToken` của lần đăng nhập **ngay trong TC** — TC không dùng lại token của TC khác
- Header chuẩn: `Content-Type: application/json` · `Accept: application/json`
- 🔒 Token / cookie **không** ghi vào execution report — chỉ ghi hình thái (`<JWT>`, `<146 ký tự>`)

### Test Data Matrix (API)

| Model | Hợp lệ | Không hợp lệ (mỗi field một bộ) | Biên / đặc biệt |
|---|---|---|---|
| **Register body** | `name` `Auto Auth API <T+20>` · `email` `auto_auth_<T+20>_reg@auto.test` · `password` `Auto@12345` · `phone` `0912345678` · `address` `12 Tràng Tiền` (TC_059) | thiếu `name` / `name:123` (061) · thiếu `email` (062) · thiếu `password` (063) · `email` 6 dạng sai (064) · email trùng / trùng khác hoa thường (065 · 066) | `name` 10.000 ký tự · XSS · SQLi · chuỗi NoSQL (068) · trường đặc quyền `role` · `isAdmin` · `isActive` · `id` (067) · Unicode + emoji (093-c) · 3 content-type (060) |
| **Login body** | `email` + `password` của `userA` (069) | thiếu `email` (075) · thiếu `password` (076) · `email` 4 dạng sai (077) · sai mật khẩu 3 dạng (073) · email chưa có / đã xoá (074) | email khác hoa thường (072) · `password` SQLi · object `{"$ne":null}` · 10.000 ký tự (081) · 3 content-type (070) |
| **Cookie `refetchToken`** | `rtA` vừa nhận (082) | thiếu (084) · `abc` · access token · `rtA` bị sửa · rỗng (085) · `rtA` sau đăng xuất (090) | — |
| **Header `Authorization`** | `Bearer <tokenA>` | thiếu (088 · 094 · 100) · rác · chữ ký bị sửa · thiếu `Bearer` · scheme `Basic` (089) · payload bị sửa · `alg: none` (095) · chỉ gửi qua cookie (096) · token của tài khoản đã xoá (097) | — |
| **Profile body** | `{"name":"Auto Auth API Renamed <T+30>"}` (098) · `{"password":"Moi@67890","password_old":"Auto@12345"}` (102) | `email` sai định dạng 2 dạng (101) | — (nhánh ghi bị F-16 chặn) |

### Dependencies & Execution Order (API)

```
Setup   : POST /api/register userA · userB · userE          (tuần tự, trước mọi TC cần tài khoản)
Đợt 1   : TC_059 → 068   register        — độc lập, chạy song song được
Đợt 2   : TC_069 → 081 · 106 · 107   login — cần userA / userB (TC_106 tự đăng ký tài khoản riêng)
Đợt 3   : TC_082 → 097 · 108   refetch · logout · me — mỗi TC tự đăng nhập; TC_097 tự tạo + xoá userD
Đợt 4   : TC_098 → 099   (tuần tự, cùng userA) · TC_102 → 104 (tuần tự, cùng userE) · TC_100 · 101 · 105
Teardown: đăng nhập từng tài khoản còn sống → DELETE /api/user/{id} bằng token của CHÍNH nó
          → đăng nhập lại phải ra 404 "User not found."
          → báo cáo số tạo / số dọn / còn sót. Mật khẩu userE có thể đã đổi (khi F-16 được sửa):
            thử Moi@67890 rồi Auto@12345
```

Bộ `@Smoke` API: **TC_059 · 106 · 069 · 071 · 082 · 086 · 091** — chạy đầu tiên, fail thì dừng.

### Dọn dữ liệu (API) — bổ sung vào bảng trên

| Độ lệch | Email | Tạo bởi |
|---|---|---|
| `20` → `23` | `…_reg` · `…_json` · `…_form` · `…_multi` | TC_059 · 060 |
| `24` | `auto_auth_<T+24>@auto.test` — chỉ tạo nếu TC_061-b **cho qua** (`name:123`) | TC_061 |
| `28` | `…_mass` | TC_067 |
| `30` · `31` · `38` | `userA` · `userB` · `userE` | setup |
| `36` · `37` | `userC` · `userD` — **tự xoá trong TC** | TC_074-b · 097 |
| `41` → `44` | `…_xss` · `…_sqli` · `…_nosql` · `…_long` (chỉ khi được tạo) | TC_068 |
| `45` → `47` | `…_full` · `…_min` · `…_vn` | TC_093 |
| `48` | `…_new` | TC_106 |

### Dữ liệu dùng chung (Web) — tài khoản do chính lượt chạy tạo

| Ký hiệu | Name | Email (độ lệch) | Mật khẩu | Tạo bởi | Dùng cho |
|---|---|---|---|---|---|
| `TK-W` | `Auto Auth Web 1790150450` | `auto_auth_<T+50>_web@auto.test` | `Auto@12345` | `TC_144` (**chạy đầu tiên** lượt Web) | Hầu hết TC Web cần tài khoản · `W1` |
| `TK-W2` | `Auto Auth Web2 1790150451` | `auto_auth_<T+51>_web2@auto.test` | `Auto@12345` | Sign up ở setup | `TC_188` (email trùng) · `TC_192` |
| `TK-L` | `Auto Auth Lock 1790150452` | `auto_auth_<T+52>_lock@auto.test` | `Auto@12345` | `TK-W` → `User` → `New user` với `Active for login` **tắt** (module `USER`) | `TC_134` · `135` |
| `TK-P` | `Auto Auth Web Pw 1790150453` | `auto_auth_<T+53>_pw@auto.test` | `Auto@12345` → `Moi@67890` | Sign up ở setup | `TC_184 → 186` (đổi mật khẩu) |
| `TK-P2` | `Auto Auth Web Pw2 1790150454` | `auto_auth_<T+54>_pw2@auto.test` | `Auto@12345` | Sign up ở setup | `TC_182 → 183` |

| Ký hiệu | Trạng thái | Cách đưa về |
|---|---|---|
| `W0` | **Khách** — Chrome không có phiên (cửa sổ ẩn danh mới, hoặc đã `Logout`) | Avatar → `Logout` hoặc mở cửa sổ ẩn danh |
| `W1` | **`TK-W` đang đăng nhập** | Từ `W0`: avatar → đăng nhập `TK-W` |

- Toast web hiện **góc trên bên phải**, tự đóng sau ≈ 3 giây — đọc ngay sau thao tác (`RISK-BK-AUTH-10`)
- Luôn vào My Profile qua **menu avatar → `Profile`** (mở thẳng URL đang lỗi — `TC_176`)

```
Setup   : TC_144 tạo TK-W → Sign up TK-W2 · TK-P · TK-P2 → TK-W tạo TK-L (Active tắt) ở User Management
Part 01 : TC_109 → 140
Part 02 : TC_141 → 143 · 145 → 171   (tạo thêm tài khoản — xem bảng dọn)
Part 03 : TC_172 → 181 · 182 → 183 (TK-P2) · 184 → 186 (TK-P) · 187 → 193
Teardown: đăng nhập API từng tài khoản `auto_auth_<T+5x…6x>` → DELETE /api/user/{id} bằng token của CHÍNH nó
          (TK-L bị khoá không đăng nhập được → xoá qua giao diện User bằng TK-W TRƯỚC khi xoá TK-W)
          TK-P: thử Moi@67890 rồi Auto@12345 · TK-P2: thử Auto@12345 rồi Moi@67890 (nếu TC_183 PASS)
```

Bộ `@Smoke` Web: **TC_144 (tạo TK-W) → 109 → 115 · 130 · 141 → 143 · 145 · 146 · 172 → 175 · 177**.

### Dọn dữ liệu (Web) — bổ sung vào bảng trên

| Độ lệch | Email | Tạo bởi |
|---|---|---|
| `50` → `54` | `TK-W` · `TK-W2` · `TK-L` · `TK-P` · `TK-P2` | TC_144 · setup |
| `55` · `56` · `57` | `…_full` · `…_reg` · `…_clear` | TC_145 · 146 · 147 |
| `58` | `…_twice` | TC_168 |
| `59` · `60` | `…_xss` · `…_sqli` | TC_169 |
| `61` · `62` | `…_vn` · `…_emoji` | TC_170 |
| `63` | `…_flow` | TC_171 |
| `64` | `…_enter` — chỉ tồn tại nếu `TC_167` **gửi được** form ngoài dự kiến | TC_167 |

### TC treo — chưa viết kỳ vọng cứng

> ⚠️ **25-09-2026 — mọi mã chặn dưới đây đã có kết luận** (`DEMO-AMB-2509`). Chi tiết việc cần làm cho TC API: [Impact Report](../../../requirements/_book-api/auth/impact/impact_DEMO-AMB-2509.md) — xử lý bằng `/update-testcases-from-impact`. Bảng giữ nguyên làm vết cho tới lượt đó.

| Chủ đề | Status liên quan | Vì sao treo | Mã chặn | Việc cần làm |
|---|---|---|---|---|
| Phân quyền theo vai trò ở `logout` · `me` · `profile` | `403` | Spec **không** định nghĩa vai trò; tài khoản tự đăng ký làm được mọi thứ | `AMB-BK-01` 🔴 · `AMB-BK-AUTH-11` | PO chốt mô hình vai trò → viết ma trận role × operation |
| Content-type / Accept không hỗ trợ · payload quá lớn | `415` · `406` · `413` | Spec **không** khai 3 status này — chưa biết kỳ vọng là `415` hay `422` | `AMB-BK-AUTH-20` 🟡 | PO chốt kỳ vọng → thêm TC. `TC_068-d` · `081-d` đã kiểm **độ bền** (không `500`) |
| Chống dò mật khẩu / giới hạn tần suất | `429` | Không có căn cứ giới hạn nào trong spec | `AMB-BK-08` 🟡 | PO chốt ngưỡng → TC gửi N+1 lần sai liên tiếp |
| Đổi mật khẩu thiếu / sai `password_old` | `400` / `422` | Chưa biết có bắt buộc không; không kiểm được vì F-16 | `AMB-BK-AUTH-05` 🟠 | Chờ F-16 sửa + PO trả lời |
| Đổi `email` hồ sơ sang email của tài khoản khác (dùng `userA` → email `userB`) | `422` | Không kiểm được vì F-16 | `AMB-BK-AUTH-12` 🟡 | Chờ F-16 sửa |
| Mass Assignment qua `PATCH /api/profile` | `200` | Nhánh ghi bị F-16 chặn | F-16 | Viết khi F-16 được sửa (mẫu: TC_067) |
| Refresh token hết hạn · access token hết hạn | `404` · `401` | Thời hạn 6–7 ngày, không rút ngắn được trên production | `AMB-BK-AUTH-10` 🟡 | Cần môi trường có thời hạn ngắn |
| Token vẫn dùng sau đăng xuất · refresh token dùng lại nhiều lần | — | PO **chấp nhận là thiết kế**, không cấp REQ | `AMB-BK-AUTH-06` · `07` 🟠 | Không viết TC — đã ghi `RISK-BK-AUTH-01` |
| BOLA / IDOR | `403` | Module `AUTH` **không** có endpoint nhận `id` — mọi thao tác áp lên chính chủ token. BOLA thuộc module `USER` | — | ➖ tại `AUTH` — sinh ở `/generate-testcases-api user` |

---

## Bản đồ tài liệu

> File này là **index** — không chứa dòng TC.

| Nền tảng | File | Nhóm chức năng | Số TC | TC ID | REQ bao phủ |
|---|---|---|---|---|---|
| Mobile (Android) | [mobile/parts/part_01_mobile_dang_nhap.md](mobile/parts/part_01_mobile_dang_nhap.md) | Sign in · Dashboard sau đăng nhập · menu avatar · Đăng xuất · vòng đời phiên | 25 | 001–025 | `03 · 11 · 14 · 15 · 16 · 49 → 64` |
| Mobile (Android) | [mobile/parts/part_02_mobile_dang_ky.md](mobile/parts/part_02_mobile_dang_ky.md) | Sign up · validation · địa chỉ Division/Ward · vòng đời form | 33 | 026–058 | `01 · 03 · 08 · 09 · 11 · 59 · 60 · 62 · 65 → 86` |
| API | [api/parts/part_01_api_dang_ky_dang_nhap.md](api/parts/part_01_api_dang_ky_dang_nhap.md) | `POST /api/register` · `POST /api/login` | 25 | 059–081 · 106–107 | `01 → 23` |
| API | [api/parts/part_02_api_phien_ho_so.md](api/parts/part_02_api_phien_ho_so.md) | `POST /api/refetch-token` · `DELETE /api/logout` · `GET /api/me` · `PATCH /api/profile` · body lỗi chung | 25 | 082–105 · 108 | `24 → 48` |
| Web | [web/parts/part_01_web_dang_nhap.md](web/parts/part_01_web_dang_nhap.md) | Sign in · Dashboard sau đăng nhập · menu tài khoản · phiên · chặn trang cần đăng nhập · Đăng xuất | 32 | 109–140 | `11 · 14 · 15 · 16 · 49 → 59 · 87 · 91 → 100 · 121` |
| Web | [web/parts/part_02_web_dang_ky.md](web/parts/part_02_web_dang_ky.md) | Sign up · validation · địa chỉ Division/Ward · vòng đời form | 31 | 141–171 | `01 · 03 · 08 · 09 · 65 → 81 · 83 · 88 → 90 · 94` |
| Web | [web/parts/part_03_web_ho_so.md](web/parts/part_03_web_ho_so.md) | My Profile · đổi mật khẩu · Setting account | 22 | 172–193 | `96 · 101 → 120` |
| iOS | — | Chưa khảo sát requirements — không sinh TC | — | — | — |

Tổng Mobile: **58 TC · 95 biến thể** (TC không có Bảng biến thể tính 1) · thêm **17 mục Bảng kiểm** ở `TC_001` · `TC_005` · `TC_026`. Vượt ngưỡng 50 TC của độ hạt GỘP → tách 2 part, cắt tại ranh giới **Đăng nhập | Đăng ký**.

Tổng API: **50 TC · 94 biến thể** · 6/6 endpoint · vượt ngưỡng 40 TC của file API → tách 2 part, cắt tại ranh giới **mở phiên | dùng phiên**.

Tổng Web: **85 TC · 119 biến thể** · thêm **27 mục Bảng kiểm** ở `TC_109` · `114` · `141` · `172` · `177`. Vượt ngưỡng 50 TC → tách 3 part, cắt tại ranh giới **Đăng nhập | Đăng ký | Hồ sơ**.

**Tổng module: 193 TC · 308 biến thể.**

---

## Assumptions đã áp dụng

| Mã | Điểm chưa rõ | Giả định đã áp dụng | TC bị ảnh hưởng |
|---|---|---|---|
| ASM-BK-AUTH-01 | Nhãn nhóm trên Sign up là `Infomation` (thiếu chữ `r`) — lỗi chính tả hay cố ý? | TC ghi **đúng nguyên văn** `Infomation` theo ảnh `android_signup_default_part1.png`. Dev sửa thành `Information` → sửa mục `3` Bảng kiểm `TC_026`. Đề nghị đưa vào AMB | TC_026 |
| ASM-BK-AUTH-02 | Email có khoảng trắng đầu/cuối khi đăng nhập — app cắt bỏ hay báo sai định dạng? Chưa khảo sát | App **cắt bỏ** khoảng trắng đầu/cuối rồi đăng nhập bình thường | TC_017-c |
| ASM-BK-AUTH-03 | Name chỉ gồm khoảng trắng — app coi là trống hay hợp lệ? Chưa khảo sát | App coi là **trống** → `Name is required.` | TC_032-b |
| ASM-BK-AUTH-04 | Phạm vi nền tảng | Lượt 1 chỉ Mobile (user hỏi về "Mobile Book"). **Lượt 2 (20-09-2026) bổ sung API** — 8 REQ dùng chung nay có TC ở **cả hai** nền tảng | — (đã khép) |
| ASM-BK-AUTH-06 | Web: email sai dạng khác `khong-phai-email` · mật khẩu khác hoa thường / thừa khoảng trắng · chuỗi tấn công — chưa khảo sát trên web | Bị chặn / từ chối **như** biến thể đã khảo sát (cùng bộ kiểm định dạng phía trang và cùng máy chủ với Android) | TC_119 · 122 · 138 · 139 · 155 · 156 |
| ASM-BK-AUTH-07 | Web: khách mở thẳng URL My Profile / Setting account — ma trận Web ghi *chưa thử* | Bị đưa về Sign in như trang tạo sách (REQ-96) | TC_193 |
| ASM-BK-AUTH-08 | `REQ-BK-AUTH-120` là quyết định PO chưa kiểm chứng — không biết thông báo hiện dưới ô hay nổi | TC chỉ assert **nội dung** `Email already exists.` và email không đổi | TC_188 |
| ASM-BK-AUTH-05 | Chính sách mật khẩu (độ dài, độ phức tạp) — `AMB-BK-AUTH-08` 🟡 | **Không có** chính sách: mật khẩu `a` đăng ký được (thấy ở `android_signup_invalid_fields.png` — ô Password `a` không báo lỗi). **Không** sinh TC biên độ dài mật khẩu | — (các mục Password ở đối soát Validation chấm ➖) |

**Không** phát hiện xung đột tài liệu ↔ ảnh evidence. Có 3 ảnh chỉ chứng minh **một phần** AC — xem Bảng Đối Soát Evidence.

---

## Bảng Đối Soát Coverage (Mobile 46/46 · API 48/48 · Web 72/72 — 121/121 REQ)

> REQ khai nhiều nền tảng phải có TC ở **mỗi** nền tảng đã khai. Cột ❌ là **thiếu thật**, không được tính "đã phủ" nhờ TC nền tảng khác.

### REQ dùng chung `Android · API · Web` (index mục 3.1)

| REQ ID | Mô tả ngắn | Mobile — TC | API — TC | Loại case (Mobile) | Web — TC |
|---|---|---|---|---|---|
| REQ-BK-AUTH-01 | Đăng ký thành công | TC_029 · 030 · 039 · 053 · 054 · 055 | TC_059 · 067 · 068 | P (tối thiểu · đủ trường · Unicode) · N (double submit) · Security | TC_144 · 168 · 169 (2) · 170 (2) · 171 |
| REQ-BK-AUTH-03 | Tài khoản vừa đăng ký đăng nhập được | TC_004 · 031 · 054 | TC_106 | P | TC_146 · 171 |
| REQ-BK-AUTH-08 | Không đăng ký trùng email | TC_041 | TC_065 | N | TC_157 |
| REQ-BK-AUTH-09 | Trùng email không phân biệt hoa thường | TC_042 | TC_066 (2) | N | TC_158 |
| REQ-BK-AUTH-11 | Đăng nhập thành công | TC_004 · 019 · 054 | TC_069 | P · N (double submit) | TC_112 · 136 |
| REQ-BK-AUTH-14 | Email đăng nhập không phân biệt hoa thường | TC_017 (3 biến thể) | TC_072 (2) | P · EP | TC_126 (2) |
| REQ-BK-AUTH-15 | Sai mật khẩu bị từ chối | TC_013 · 023 | TC_073 (3) · 081 (4) | N · Security | TC_122 (3) · 139 (2) |
| REQ-BK-AUTH-16 | Email chưa đăng ký bị từ chối | TC_014 | TC_074 (2) | N | TC_123 |

### REQ chỉ Android (`mobile/`)

| REQ ID | Mô tả ngắn | Số TC | TC IDs | Loại case |
|---|---|---|---|---|
| REQ-BK-AUTH-49 | Sign in đủ thành phần | 1 | TC_001 | UI (Bảng kiểm 7 mục) |
| REQ-BK-AUTH-50 | Avatar mở Sign in | 1 | TC_002 (5 biến thể) | P |
| REQ-BK-AUTH-51 | Thẻ Dashboard mở Sign in | 1 | TC_003 | P |
| REQ-BK-AUTH-52 | Sign in: Email bắt buộc | 2 | TC_007 · 009 | N |
| REQ-BK-AUTH-53 | Sign in: Password bắt buộc | 2 | TC_008 · 009 | N |
| REQ-BK-AUTH-54 | Sign in: Email sai định dạng | 2 | TC_010 (6 biến thể) · 022 (4) | N · EP · Security |
| REQ-BK-AUTH-55 | Lỗi cập nhật khi đang gõ | 1 | TC_011 | P · N |
| REQ-BK-AUTH-56 | Nút mắt hiện mật khẩu | 1 | TC_012 | P |
| REQ-BK-AUTH-57 | Thất bại giữ dữ liệu | 1 | TC_015 (2) | N |
| REQ-BK-AUTH-58 | Thông báo tự đóng | 1 | TC_016 (2) | P |
| REQ-BK-AUTH-59 | Dashboard chào đúng tên | 3 | TC_004 · 020 · 031 | P |
| REQ-BK-AUTH-60 | Menu avatar khi đã đăng nhập | 3 | TC_005 · 020 · 031 | P · Permission |
| REQ-BK-AUTH-61 | Phiên giữ sau khi tắt app | 1 | TC_024 | P |
| REQ-BK-AUTH-62 | Đăng xuất | 3 | TC_006 · 021 · 054 | P · Security |
| REQ-BK-AUTH-63 | Mất mạng khi đăng nhập | 1 | TC_025 | N |
| REQ-BK-AUTH-64 | Back ở Sign in | 1 | TC_018 (2) | P |
| REQ-BK-AUTH-65 | Sign up đủ thành phần | 3 | TC_026 · 044 · 045 | UI (Bảng kiểm 7 mục) · P |
| REQ-BK-AUTH-66 | Get started mở Sign up | 1 | TC_027 | P |
| REQ-BK-AUTH-67 | Link Sign in về Sign in | 1 | TC_028 | P |
| REQ-BK-AUTH-68 | Sign up: Name bắt buộc | 2 | TC_032 (2) · 036 | N |
| REQ-BK-AUTH-69 | Sign up: Email bắt buộc | 2 | TC_033 · 036 | N |
| REQ-BK-AUTH-70 | Sign up: Password bắt buộc | 2 | TC_034 · 036 | N |
| REQ-BK-AUTH-71 | Sign up: Confirmation bắt buộc | 2 | TC_035 · 036 | N |
| REQ-BK-AUTH-72 | Phone không bắt buộc | 3 | TC_029 · 036 · 046 (3) | P · N |
| REQ-BK-AUTH-73 🟡 | Name ≤ 191 ký tự (sửa 25-09-2026) | 2 | TC_037 (3) · 038 (4) | **B** — 1 · 190 · **191** · **192** · 250 · 251 · 300 · 🐞 `@KnownBug` (038 `a` `b`) |
| REQ-BK-AUTH-74 | Sign up: Email sai định dạng | 1 | TC_040 (5) | N · EP |
| REQ-BK-AUTH-75 | Confirmation phải khớp | 1 | TC_043 (3) | N |
| REQ-BK-AUTH-76 | Division liệt kê tỉnh/thành | 2 | TC_030 · 047 | P |
| REQ-BK-AUTH-77 | Ward khoá khi chưa chọn Division | 2 | TC_026 · 048 | N · Dependency |
| REQ-BK-AUTH-78 | Ward theo Division | 2 | TC_030 · 049 | P |
| REQ-BK-AUTH-79 | Address khoá tới khi chọn Ward | 3 | TC_026 · 030 · 048 | P · N · Dependency |
| REQ-BK-AUTH-80 | Đổi Division xoá Ward | 1 | TC_050 (2) | Dependency |
| REQ-BK-AUTH-81 | Lỗi email trùng hiện dưới ô | 2 | TC_041 · 042 | N |
| REQ-BK-AUTH-82 | Back ở Sign up không hỏi | 1 | TC_051 | P |
| REQ-BK-AUTH-83 | Dữ liệu Sign up giữ khi quay lại | 1 | TC_052 | P |
| REQ-BK-AUTH-84 | Xuống nền giữ dữ liệu | 1 | TC_056 | P |
| REQ-BK-AUTH-85 | Xoay ngang giữ dữ liệu | 1 | TC_057 | P |
| REQ-BK-AUTH-86 | Bàn phím không che ô | 1 | TC_058 | P |

**Tổng Mobile:** 46/46 REQ có ≥ 1 TC ✅ · không REQ nào 🔴.

### REQ chỉ API (`api/`)

| REQ ID | Mô tả ngắn | TC IDs | Loại case | Ghi chú |
|---|---|---|---|---|
| REQ-BK-AUTH-02 | Đăng ký không cần token | TC_059 | P | TC_059 gánh cả REQ-01 — REQ-01 có TC_067 · 068 chống lưng nên được phép |
| REQ-BK-AUTH-04 | Thiếu `name` | TC_061 (2) | N | |
| REQ-BK-AUTH-05 | Thiếu `email` | TC_062 | N | ⚪ `AMB-BK-AUTH-03` — dự kiến FAIL (F-19) |
| REQ-BK-AUTH-06 | Thiếu `password` | TC_063 | N | |
| REQ-BK-AUTH-07 | `email` sai định dạng | TC_064 (6) | N · EP · Security | |
| REQ-BK-AUTH-10 | 3 content-type đăng ký | TC_060 (3) | P · EP | |
| REQ-BK-AUTH-12 | Đăng nhập không cần token | TC_107 (2) | P | Tách khỏi TC_069 ngày 20-09-2026 |
| REQ-BK-AUTH-13 | Token đăng nhập dùng được | TC_071 | P · Security (không lẫn tài khoản) | |
| REQ-BK-AUTH-17 | Đăng nhập thiếu `email` | TC_075 | N | ⚪ `AMB-BK-AUTH-03` — dự kiến FAIL (F-19) |
| REQ-BK-AUTH-18 | Đăng nhập thiếu `password` | TC_076 | N | |
| REQ-BK-AUTH-19 | Đăng nhập `email` sai định dạng | TC_077 (4) | N · EP | |
| REQ-BK-AUTH-20 | Cờ cookie `refetchToken` | TC_078 | Security | |
| REQ-BK-AUTH-21 | Cookie `accessToken` = body | TC_079 | P | |
| REQ-BK-AUTH-22 | Cờ cookie `accessToken` | TC_080 | Security | 🐞 `@KnownBug` F-03 |
| REQ-BK-AUTH-23 | 3 content-type đăng nhập | TC_070 (3) | P · EP | |
| REQ-BK-AUTH-24 | Làm mới token | TC_082 | P | |
| REQ-BK-AUTH-25 | Token mới dùng được | TC_083 | P | |
| REQ-BK-AUTH-26 | Làm mới không cần `Authorization` | TC_108 (2) | P | Tách khỏi TC_082 ngày 20-09-2026 |
| REQ-BK-AUTH-27 | Thiếu cookie `refetchToken` | TC_084 (2) | N | |
| REQ-BK-AUTH-28 | Cookie `refetchToken` không hợp lệ | TC_085 (4) | N · Security | |
| REQ-BK-AUTH-29 | Đăng xuất thành công | TC_086 | P | |
| REQ-BK-AUTH-30 | Đăng xuất không token | TC_088 | N · Security | |
| REQ-BK-AUTH-31 | Đăng xuất token không hợp lệ | TC_089 (4) | N · Security | |
| REQ-BK-AUTH-32 | Đăng xuất xoá cookie | TC_087 | P · Security | |
| REQ-BK-AUTH-33 | Refresh token bị thu hồi sau đăng xuất | TC_090 | Security | 🐞 `@KnownBug` F-17 |
| REQ-BK-AUTH-34 | Lấy thông tin hiện tại | TC_091 | P | |
| REQ-BK-AUTH-35 | Không lộ khoá ngoài danh sách | TC_092 · 067 | Security | |
| REQ-BK-AUTH-36 | Thông tin khớp dữ liệu đăng ký | TC_093 (3) · 068 | P · Unicode | |
| REQ-BK-AUTH-37 | `/api/me` không token | TC_094 | N · Security | |
| REQ-BK-AUTH-38 | `/api/me` token không hợp lệ | TC_095 (4) | N · Security | |
| REQ-BK-AUTH-39 | Chỉ nhận token qua header | TC_096 | N · Security | |
| REQ-BK-AUTH-40 | Token của tài khoản đã xoá | TC_097 | N · Security | |
| REQ-BK-AUTH-41 | Cập nhật tên | TC_098 | P | 🐞 `@KnownBug` F-16 |
| REQ-BK-AUTH-42 | `/api/me` phản ánh tên mới | TC_099 | P | 🐞 `@KnownBug` F-16 |
| REQ-BK-AUTH-43 | Cập nhật hồ sơ không token | TC_100 | N · Security | |
| REQ-BK-AUTH-44 | Hồ sơ `email` sai định dạng | TC_101 (2) | N | |
| REQ-BK-AUTH-45 | Đổi mật khẩu | TC_102 | P · Security | 🐞 `@KnownBug` F-16 |
| REQ-BK-AUTH-46 | Đăng nhập bằng mật khẩu mới | TC_103 | P | 🐞 `@KnownBug` F-16 |
| REQ-BK-AUTH-47 | Mật khẩu cũ bị từ chối | TC_104 | N · Security | 🐞 `@KnownBug` F-16 |
| REQ-BK-AUTH-48 | Hình dạng body lỗi | TC_105 (6) | N | |

**Tổng API:** 48/48 REQ có ≥ 1 TC ✅ (40 REQ chỉ API + vế API của 8 REQ dùng chung). **Toàn module: 121/121 REQ** — REQ dùng chung có TC ở **mọi** nền tảng đã khai. ⚠️ `REQ-120` · `121` mới chỉ khai `Web`.

### REQ dùng chung `Android · Web` (index mục 3.2) — cột Web

Cột Mobile của 29 REQ này nằm ở bảng *REQ chỉ Android* bên dưới (lập trước khi REQ được chuyển lên index ngày 25-09-2026 — mã không đổi).

| REQ ID | Mô tả ngắn | Web — TC (số biến thể) | Loại case (Web) |
|---|---|---|---|
| REQ-BK-AUTH-49 | Sign in đủ thành phần | TC_109 · 140 | UI (Bảng kiểm 7 mục) · A11y |
| REQ-BK-AUTH-50 | Avatar mở Sign in | TC_110 (3) | P |
| REQ-BK-AUTH-51 | Thẻ Dashboard mở Sign in | TC_111 | P |
| REQ-BK-AUTH-52 | Sign in: Email bắt buộc | TC_116 · 118 | N |
| REQ-BK-AUTH-53 | Sign in: Password bắt buộc | TC_117 · 118 | N |
| REQ-BK-AUTH-54 | Sign in: Email sai định dạng | TC_119 (5) · 138 (2) | N · EP · Security |
| REQ-BK-AUTH-55 | Lỗi cập nhật khi đang gõ | TC_120 | P · N |
| REQ-BK-AUTH-56 | Nút mắt | TC_121 | P |
| REQ-BK-AUTH-57 | Thất bại giữ dữ liệu | TC_124 (2) | N |
| REQ-BK-AUTH-58 | Thông báo tự đóng | TC_125 | P |
| REQ-BK-AUTH-59 | Dashboard chào đúng tên | TC_113 | P |
| REQ-BK-AUTH-65 | Sign up đủ thành phần | TC_141 · 165 | UI (Bảng kiểm 6 mục) · P |
| REQ-BK-AUTH-66 | Get started mở Sign up | TC_142 | P |
| REQ-BK-AUTH-67 | Link Sign in về Sign in | TC_143 | P |
| REQ-BK-AUTH-68 | Sign up: Name bắt buộc | TC_148 (2) | N |
| REQ-BK-AUTH-69 | Sign up: Email bắt buộc | TC_149 | N |
| REQ-BK-AUTH-70 | Sign up: Password bắt buộc | TC_150 | N |
| REQ-BK-AUTH-71 | Sign up: Confirmation bắt buộc | TC_151 | N |
| REQ-BK-AUTH-72 | Phone không bắt buộc | TC_152 · 159 (3) | P · N |
| REQ-BK-AUTH-73 🟡 | Name ≤ 191 ký tự (sửa 25-09-2026) | TC_153 (3) · 154 (4) | **B** — 1 · 190 · **191** · **192** · 250 · 251 · 300 · 🐞 `@KnownBug` (154 `a` `b`) |
| REQ-BK-AUTH-74 | Sign up: Email sai định dạng | TC_155 (5) | N · EP |
| REQ-BK-AUTH-75 | Confirmation phải khớp | TC_156 (3) | N |
| REQ-BK-AUTH-76 | Division liệt kê tỉnh/thành | TC_160 | P |
| REQ-BK-AUTH-77 | Ward khoá khi chưa chọn Division | TC_161 | Dependency |
| REQ-BK-AUTH-78 | Ward theo Division | TC_162 | Dependency |
| REQ-BK-AUTH-79 | Address khoá tới khi chọn Ward | TC_163 | Dependency |
| REQ-BK-AUTH-80 | Đổi Division xoá Ward | TC_164 (2) | Dependency |
| REQ-BK-AUTH-81 | Lỗi email trùng dưới ô | TC_157 · 158 | N |
| REQ-BK-AUTH-83 | Dữ liệu Sign up giữ khi quay lại | TC_166 | P |

### REQ chỉ Web (`web/`)

| REQ ID | Mô tả ngắn | TC IDs (số biến thể) | Loại case | Ghi chú |
|---|---|---|---|---|
| REQ-BK-AUTH-87 | Enter gửi đăng nhập | TC_127 · 140 | P · A11y | |
| REQ-BK-AUTH-88 | Enter không gửi Sign up | TC_167 | P | |
| REQ-BK-AUTH-89 | Địa chỉ ghép 3 ô | TC_145 | P · `@TechCheck` | Kiểm hệ quả nhìn thấy ở My Profile |
| REQ-BK-AUTH-90 | Form trống sau đăng ký | TC_147 | P | |
| REQ-BK-AUTH-91 | Sign in giữ dữ liệu khi quay lại | TC_128 | P | |
| REQ-BK-AUTH-92 | Menu tài khoản web | TC_114 | UI (Bảng kiểm 4 mục) | |
| REQ-BK-AUTH-93 | Phiên giữ khi tải lại | TC_129 (2) | P | |
| REQ-BK-AUTH-94 | Đăng xuất | TC_115 · 171 | P | |
| REQ-BK-AUTH-95 | Đăng xuất gỡ token | TC_137 | Security · `@TechCheck` | |
| REQ-BK-AUTH-96 | Khách mở URL cần đăng nhập | TC_130 · 193 (2) | Permission · Security | |
| REQ-BK-AUTH-97 🟡 | `redirect` giữ cả query | TC_131 | P | 🐞 `@KnownBug` — `AMB-BK-AUTH-25` |
| REQ-BK-AUTH-98 | Không `redirect` về Dashboard | TC_132 | P | |
| REQ-BK-AUTH-99 | Đã đăng nhập mở Sign in | TC_133 | P | |
| REQ-BK-AUTH-100 | Tài khoản khoá, mật khẩu đúng | TC_134 | N · Security | |
| REQ-BK-AUTH-101 | My Profile hiển thị | TC_172 · 192 | UI (Bảng kiểm 6 mục) · Security | |
| REQ-BK-AUTH-102 | Save / Reset mờ khi chưa sửa | TC_173 | UI Behavior | |
| REQ-BK-AUTH-103 | Cập nhật hồ sơ | TC_174 | P | |
| REQ-BK-AUTH-104 | Tên mới ở Dashboard | TC_175 | P | |
| REQ-BK-AUTH-105 | Profile: Name bắt buộc | TC_178 (2) | N | |
| REQ-BK-AUTH-106 | Profile: Email sai định dạng | TC_179 (2) | N | |
| REQ-BK-AUTH-107 | Old Password bắt buộc | TC_180 | N · Security | |
| REQ-BK-AUTH-108 | Profile: Confirmation khớp | TC_181 | N | |
| REQ-BK-AUTH-109 | Old Password sai | TC_182 | N · Security | |
| REQ-BK-AUTH-110 | Đổi mật khẩu → tự đăng xuất | TC_184 | P · Security | |
| REQ-BK-AUTH-111 | Mật khẩu cũ bị từ chối | TC_185 | N · Security | |
| REQ-BK-AUTH-112 | Mật khẩu mới đăng nhập được | TC_186 | P | |
| REQ-BK-AUTH-113 | Reset | TC_187 | P | |
| REQ-BK-AUTH-114 | Save sau lần bị từ chối | TC_183 | P | 🐞 `@KnownBug` — `AMB-BK-AUTH-28` |
| REQ-BK-AUTH-115 | Mở thẳng URL My Profile | TC_176 (2) | P | 🐞 `@KnownBug` — `AMB-BK-AUTH-29` |
| REQ-BK-AUTH-116 | Setting account hiển thị | TC_177 | UI (Bảng kiểm 4 mục) | |
| REQ-BK-AUTH-117 | Theme áp dụng ngay | TC_189 (3) | P | |
| REQ-BK-AUTH-118 | Save cấu hình | TC_190 | P | 🐞 `@KnownBug` — `AMB-BK-AUTH-30` |
| REQ-BK-AUTH-119 | Reset theme | TC_191 | P | |
| REQ-BK-AUTH-120 🆕 | Profile: email trùng | TC_188 | N · Security | `@NeedsVerify` — quyết định PO chưa kiểm chứng |
| REQ-BK-AUTH-121 🆕 | Khoá + sai mật khẩu | TC_135 | N | |

**Tổng Web:** 72/72 REQ (8 dùng chung ba nền tảng + 29 dùng chung `Android · Web` + 35 chỉ Web) có ≥ 1 TC Web ✅. Phép thử 6b trên file Web: TC gánh ≥ 2 REQ (`TC_118` · `140` · `157` · `158` · `171`) — không TC nào có ≥ 2 REQ chỉ dựa vào nó ✅.

### Bao phủ mã HTTP (API)

| Status | Có TC? | TC / lý do |
|---|---|---|
| `200` / `201` | ✅ | TC_059 · 069 · 082 · 086 · 091 … |
| `400` | ✅ | TC_073 · 081 · 104 — hệ thống dùng `400` cho **sai mật khẩu**; lỗi dữ liệu dùng `422` |
| `401` | ✅ | TC_088 · 089 · 094 · 095 · 096 · 097 · 100 |
| `403` | ⏳ TC treo | Không có mô hình vai trò (`AMB-BK-01`); spec khai 403 ở login/logout/me/profile nhưng chưa quan sát điều kiện (`AMB-BK-AUTH-11`) |
| `404` | ✅ | TC_074 · 085 (· 090 kỳ vọng) |
| `406` · `413` · `415` | ⏳ TC treo | Spec **không** khai — `AMB-BK-AUTH-20` |
| `409` | ➖ | Hệ thống báo trùng bằng `422` (REQ-08) — TC_065 · 066 |
| `422` | ✅ | TC_061 · 063 · 064 · 076 · 077 · 084 · 101 · 105 |
| `429` | ⏳ TC treo | Không có căn cứ giới hạn tần suất (`AMB-BK-08`) |
| `500` | ✅ (âm) | TC_068 · 081 kiểm **không** xảy ra `500` với dữ liệu bất thường |

### Bảng quyết định — kết quả Sign in (3 điều kiện → 1 kết quả)

| Rule | Email đúng định dạng | Email đã đăng ký | Mật khẩu đúng | → Kết quả | TC |
|---|---|---|---|---|---|
| R1 | Không | — | — | App chặn: `Invalid email address`, không gửi máy chủ | TC_010 · 022 |
| R2 | Có | Không | — | Thông báo `User not found.` | TC_014 |
| R3 | Có | Có | Không | Thông báo `Invalid password.` | TC_013 · 023 |
| R4 | Có | Có | Có | Vào Dashboard · `Login successfully.` | TC_004 · 017 |
| R0 | Ô trống | — | — | App chặn: `… is required.` | TC_007 · 008 · 009 |

---

## Bảng Đối Soát Evidence

Đã mở **31/31** ảnh: 28 ảnh ở [`requirements/_book-api/auth/mobile/evidence/`](../../../requirements/_book-api/auth/mobile/evidence/) + 3 ảnh tổng quan ở `_discovery/evidence/` (`android_auth_overview` · `android_auth_account_menu` · `android_dash_overview`).

| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| `android_signin_default.png` | Sign in mặc định, sau Logout | TC_001 · 006 | ✅ |
| `android_auth_overview.png` *(discovery)* | Sign in mở từ avatar | TC_002 | ✅ — chỉ 1 tab xuất phát; REQ-50 khai "tab bất kỳ" |
| `android_dash_overview.png` *(discovery)* | Dashboard chưa đăng nhập, thẻ `Book management sign in` | TC_003 · 021 (bước 5) · 002 (avatar xám) | ✅ |
| `android_signin_from_dashboard_card.png` | Sign in mở từ thẻ Dashboard | TC_003 | ✅ |
| `android_signin_empty_submit.png` | Sign in gửi form trống | TC_009 · 007 · 008 | 🟡 Chỉ có trạng thái **trống cả hai** — ca trống từng ô (007 · 008) suy từ cùng ảnh |
| `android_signin_live_validation.png` | Đang gõ sau lần gửi đầu | TC_011 | 🟡 Ảnh **trùng** nội dung với `android_signin_invalid_email.png` — chỉ chứng minh trạng thái cuối bước 3, không thấy bước 2 (lỗi Password biến mất) |
| `android_signin_invalid_email.png` | Email sai định dạng | TC_010-a | ✅ |
| `android_signin_wrong_password_snackbar.png` | Thông báo `Invalid password.` | TC_013 · 015-a · 016 | ✅ |
| `android_signin_email_not_found_snackbar.png` | Thông báo `User not found.` | TC_014 · 015-b | ✅ |
| `android_signin_password_shown.png` | Mật khẩu hiện rõ, mắt mở | TC_012 (bước 3) | ✅ |
| `android_signin_offline_no_message.png` | Mất mạng, đã bấm Login | TC_025 · 016-a | 🟡 Với TC_016-a là bằng chứng **gián tiếp** (ảnh không còn thông báo ~10 giây sau) |
| `android_signin_success_dashboard.png` | Dashboard `Welcome` + `Login successfully.` | TC_004 · 031 | ✅ |
| `android_signin_uppercase_email_success.png` | Đăng nhập bằng email viết hoa | TC_017-a | ✅ |
| `android_signin_back_to_previous_tab.png` | Tab File sau Back | TC_018-a | ✅ |
| `android_session_kept_after_relaunch.png` | Dashboard sau khi tắt / mở lại app | TC_024 | ✅ |
| `android_logout_in_progress.png` | Menu, `Logout` thành vòng xoay | TC_006 | ✅ |
| `android_auth_account_menu.png` *(discovery)* | Menu avatar đầy đủ | TC_005 · 020 | ✅ |
| `android_signup_default_part1.png` · `…_part2.png` | Sign up mặc định (2 phần — cuộn) | TC_026 · 027 | ✅ |
| `android_signup_empty_submit.png` | Sign up gửi form trống | TC_036 · 032-a · 033 · 035 | 🟡 Chỉ trạng thái **trống cả 4** — ca trống từng ô suy từ cùng ảnh |
| `android_signup_invalid_fields.png` | Name 300 ký tự · Phone chữ · Email sai · Confirmation lệch | TC_038-b · 040-a · 043-a · 046-c | ✅ |
| `android_signup_division_open.png` | Danh sách Division | TC_047 (bước 1–2) | ✅ |
| `android_signup_ward_open.png` | Danh sách Ward của Hà Nội | TC_049 | ✅ |
| `android_signup_division_changed_ward_cleared.png` | Đổi Division → Ward trống | TC_050-a | ✅ |
| `android_signup_email_exists.png` | Email trùng | TC_041 | ✅ |
| `android_signup_email_exists_uppercase.png` | Email trùng viết hoa | TC_042 | ✅ |
| `android_signup_success_snackbar.png` | Sign in + `Register successfully.` | TC_029 | ✅ — ô Email **trống** (không điền sẵn) |
| `android_signup_back_no_confirm.png` | Sign in sau Back từ Sign up | TC_051 | ✅ |
| `android_signup_reopen_data_retained.png` | Sign up mở lại, còn dữ liệu | TC_052 | ✅ |
| `android_signup_landscape.png` | Sign up xoay ngang | TC_057 | 🟡 Ảnh đã cuộn qua ô Name — giá trị Name xác nhận bằng **đọc chữ trong ô**, không thấy trong ảnh |
| `android_signup_keyboard_open.png` | Bàn phím mở ở Password Confirmation | TC_058 | ✅ |
| *(đọc phần tử, không ảnh)* | Link Sign in trên Sign up · Name 250/251 · `enabled` của Ward/Address · text sau khi xuống nền | TC_028 · 038-b · 038-c · 048 · 056 | ✅ theo lần đọc phần tử ghi trong AC |

### Vùng chưa có evidence — TC / biến thể gắn `@NeedsVerify`

| TC | Phần chưa có evidence | Đề xuất recon bổ sung |
|---|---|---|
| TC_010 `b`→`f` · TC_040 `b`→`e` | Các dạng email sai khác `khong-phai-email` | 1 ảnh / dạng, cùng góc với `android_signin_invalid_email.png` |
| TC_011 bước 4 · TC_012 bước 4 | Lỗi biến mất khi sửa đúng · mắt nhắm lại lần 2 | Chụp tuần tự từng bước |
| TC_016-b | Bấm `×` đóng thông báo | 1 ảnh ngay sau khi bấm |
| TC_017 `b` `c` · TC_018-b | Email hoa-thường lẫn / thừa khoảng trắng · Back từ tab Book | Thử thật rồi chốt ASM-BK-AUTH-02 |
| TC_019 · TC_053 | Bấm gửi hai lần | Tái hiện, đối chiếu `RISK-BK-AUTH-08` |
| TC_021 | Back / mở lại app sau Logout | 2 ảnh |
| TC_022 · 023 · 055 | Chuỗi tấn công ở Email / Password / Name | Chạy thử, chụp màn hình sau khi gửi |
| TC_030 (bước 4, 7) · TC_039 | Đăng ký có địa chỉ · Name Unicode/emoji/đặc biệt | Chụp `Register successfully.` + `Welcome` |
| TC_032-b · 034 · 037 `a` `b` `c` | Name chỉ khoảng trắng · Password trống kèm Confirmation có giá trị · Name 1 / 190 / 191 ký tự | Chốt ASM-BK-AUTH-03 |
| TC_043 `b` `c` · 044 · 045 | Confirmation lệch hoa thường / khoảng trắng · nút mắt trên Sign up | 1 ảnh / trạng thái |
| TC_046 `a` `b` · 047 bước 3 · 050-b · 057 bước 5 | Phone hợp lệ · lọc Division · xoá Division bằng `×` · xoay về dọc | 1 ảnh / trạng thái |

### Evidence mặt Web

Đã mở **29/29** ảnh ở [`requirements/_book-api/auth/web/evidence/`](../../../requirements/_book-api/auth/web/evidence/) + ảnh `web_user_inactive_login_blocked_viewport.png` của module `USER`.

| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| `web_signin_default_viewport.png` | Sign in mặc định | TC_109 · 111 | ✅ |
| `web_signin_empty_submit_viewport.png` | Gửi form trống | TC_118 · 116 · 117 | 🟡 Chỉ trạng thái trống cả hai ô |
| `web_signin_live_validation_viewport.png` | Email sai sau lần gửi đầu | TC_119-a · 120 (bước 3) | ✅ |
| `web_signin_password_shown_viewport.png` | Mật khẩu hiện `Wrong@123` | TC_121 (bước 3) | ✅ |
| `web_signin_wrong_password_toast_viewport.png` | `Invalid password.`, dữ liệu giữ | TC_122-a · 124-a · 125 | ✅ |
| `web_signin_email_not_found_toast_viewport.png` | `User not found.` | TC_123 · 124-b | ✅ |
| `web_signin_success_dashboard_viewport.png` | `Login successfully.` + menu trái | TC_112 | ✅ |
| `web_dashboard_welcome_card_element.png` | Thẻ `Welcome …` | TC_113 · 146 · 175 | ✅ |
| `web_signin_uppercase_email_enter_success_viewport.png` | Email viết hoa + Enter | TC_126-a · 127 | ✅ |
| `web_account_menu_open_viewport.png` | Menu tài khoản | TC_114 | ✅ |
| `web_logout_success_toast_viewport.png` | `Logout successfully.`, 2 ô trống | TC_115 · 137 | ✅ |
| `web_guest_protected_url_signin_viewport.png` | Khách mở URL tạo sách | TC_130 | 🟡 Ảnh không có thanh địa chỉ — URL đọc bằng DOM |
| `web_signup_default_fullpage.png` | Sign up mặc định | TC_141 · 142 | ✅ |
| `web_signup_empty_submit_fullpage.png` | Gửi Sign up trống | TC_152 · 148-a · 149 → 151 | 🟡 Header dính che ô Phone — đã kiểm bằng DOM |
| `web_signup_invalid_fields_fullpage.png` | Phone chữ · Email sai · Confirmation lệch | TC_155-a · 156-a · 159-c | ✅ |
| `web_signup_division_open_viewport.png` | Division mở | TC_160 | ✅ |
| `web_signup_ward_open_viewport.png` | Ward của Hà Nội | TC_162 | ✅ |
| `web_signup_division_changed_ward_cleared_viewport.png` | Đổi Division → Ward trống | TC_164-a | ✅ |
| `web_signup_email_exists_fullpage.png` | Email trùng | TC_157 | ✅ |
| `web_signup_email_exists_uppercase_viewport.png` | Email trùng viết hoa | TC_158 | ✅ |
| `web_signup_success_redirect_signin_viewport.png` | Sau đăng ký — Sign in còn dữ liệu cũ | TC_144 · 128 | 🟡 Không bắt kịp toast `Register successfully.` — câu đọc bằng DOM |
| `web_signup_reopen_data_retained_viewport.png` | Sign up mở lại còn dữ liệu | TC_166 | ✅ |
| `web_profile_default_fullpage.png` | My Profile mặc định | TC_172 · 173 (bước 1) | ✅ |
| `web_profile_save_name_viewport.png` | `Updated profile successfully.` | TC_174 | ✅ |
| `web_profile_invalid_fields_fullpage.png` | 4 lỗi My Profile | TC_178-a · 179-a · 180 · 181 · 187 (bước 2) | ✅ |
| `web_profile_wrong_old_password_viewport.png` | Old Password sai → `Invalid data.` | TC_182 | ✅ |
| `web_profile_change_password_logout_viewport.png` | Đổi mật khẩu → `Please login first` | TC_184 | ✅ |
| `web_settings_dark_theme_viewport.png` | Setting account, chọn Dark | TC_177 · 189-a | ✅ |
| `web_settings_save_invalid_data_viewport.png` | Save → `Invalid data.` | TC_190 | ✅ |
| `user/web/evidence/web_user_inactive_login_blocked_viewport.png` | Tài khoản khoá | TC_134 | ✅ |
| *(đọc DOM / network, không ảnh)* | Avatar khách · link Sign in · Enter Sign up · địa chỉ ghép · form trống sau đăng ký · phiên F5 · token sau Logout · redirect · Name 250/251 · Ward/Address khoá · Reset · mật khẩu cũ/mới · khoá + sai mật khẩu | TC_110-a · 143 · 167 · 145 · 147 · 129-a · 137 · 131 · 132 · 133 · 153 · 154 · 161 · 163 · 185 · 186 · 187 · 191 · 135 | ✅ theo số liệu ghi trong AC |

#### Vùng chưa có evidence (Web) — TC / biến thể gắn `@NeedsVerify`

| TC | Phần chưa có evidence | Đề xuất recon bổ sung |
|---|---|---|
| TC_110 `b` `c` · 129-b | Avatar ở trang Book / Dashboard · F5 ở Book | 1 ảnh / trạng thái |
| TC_119 `b`→`e` · 155 `b`→`e` · 122 `b` `c` · 156 `b` `c` | Dạng email sai khác · mật khẩu khác hoa thường / khoảng trắng | Chốt `ASM-BK-AUTH-06` |
| TC_120 (bước 4) · 121 (bước 5) · 125 (bấm `×`) · 164-b · 165 | Lỗi biến mất · mắt nhắm lại · đóng toast · xoá Division · mắt ở Sign up | Chụp tuần tự |
| TC_126-b · 136 · 168 | Email hoa lẫn · bấm 2 lần | Tái hiện |
| TC_138 · 139 · 169 · 170 | Chuỗi tấn công · Unicode / emoji | Chạy thử, chụp |
| TC_140 · 148-b · 178-b · 179-b · 189 `b` `c` · 193 | Tab bàn phím · chỉ khoảng trắng · Light / System · khách mở URL hồ sơ | Chốt `ASM-BK-AUTH-07` |
| TC_188 | Email hồ sơ trùng — quyết định PO | Chốt `ASM-BK-AUTH-08` |

---

## Đối soát loại kiểm thử (4 vòng)

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_001 · 026 (2 TC · 14 mục Bảng kiểm) — nhãn nguyên văn · thứ tự ô · trạng thái mặc định · dấu `*` · biểu tượng mắt |
| 1 | Open form | ✅ | TC_002 · 003 · 027 · 028 (4 TC · 8 biến thể) — mọi lối vào Sign in / Sign up. Đóng bằng Back: TC_018 · 051 |
| 1 | Display | ✅ | TC_004 (Welcome + chữ cái avatar) · 005 (menu, cắt `…`) · 006 (vòng xoay đang xử lý) — 3 TC |
| 1 | Input valid data | ✅ | TC_029 (tối thiểu — chỉ ô bắt buộc) · 030 (đầy đủ mọi ô) |
| 1 | Save | ✅ | TC_029 · 030 (đăng ký) · 004 (đăng nhập) — thông báo đúng + điều hướng đúng |
| 1 | Verify data | ✅ | TC_031 · 004 — Name / email hiện đúng sau khi lưu. Phone / địa chỉ chỉ đối chiếu được qua API (🔧 TC_031) — Profile Android chưa khảo sát |
| 2 | UI Behavior | ✅ | TC_011 · 012 · 016 · 044 · 045 · 047 (6 TC · 7 biến thể) |
| 2 | Required | ✅ | TC_007 · 008 · 009 · 032 · 033 · 034 · 035 · 036 (8 TC · 9 biến thể) — từng ô + tất cả, cả 2 màn hình |
| 2 | Validation | ✅ | TC_010 · 022 · 037 · 038 · 039 · 040 · 043 · 046 · 055 (9 TC · 32 biến thể) — đối soát theo bảng 15 loại ở mục con bên dưới |
| 2 | Equivalence Partitioning | ✅ | TC_010 · 040 (lớp email sai) · 017 (lớp kiểu chữ) · 046 (lớp số điện thoại) |
| 2 | Boundary Value Analysis | ✅ | TC_037 · 038 (2 TC · 7 biến thể) — `1` · `190` · **`191`** · **`192`** · `250` · `251` · `300` (biên 191/192 theo `REQ-73` 🟡) |
| 2 | Business Rule | ✅ | TC_041 · 042 (email duy nhất) · 013 · 014 (quy tắc máy chủ) — mỗi rule có vế tuân thủ (TC_029 · 004) và vế vi phạm |
| 2 | Decision Table | ✅ | Bảng quyết định Sign in 3 điều kiện → R0–R4, mỗi rule ≥ 1 TC (bảng ở mục Coverage) |
| 2 | State Transition | ➖ | Không có entity ≥ 3 trạng thái (index requirements mục 7). Phiên chỉ có 2 trạng thái — chuyển qua lại đã phủ ở TC_004 · 006 · 021 · 024 |
| 2 | Dependency | ✅ | TC_047 · 048 · 049 · 050 (4 TC · 5 biến thể) — Division → Ward → Address, đổi / xoá nguồn |
| 2 | Use Case / Scenario | ✅ | TC_054 — đăng ký → đăng nhập → đăng xuất → đăng nhập lại |
| 2 | Save / Edit / Delete | ➖ | Mặt Android lượt này không có sửa / xoá — My Profile · Setting account **chưa khảo sát**, chưa có REQ. Rà lại khi `/generate-requirements-from-mobile auth` lượt 2 |
| 2 | Error Guessing | ✅ | TC_019 · 053 (bấm gửi 2 lần) · 052 (rời form sau lỗi) · 015 (thất bại giữ dữ liệu) |
| 3 | Permission | ✅ | Mobile: TC_002 · 020 · 021 — hệ thống **không** có vai trò (`AMB-BK-01`), quyền Android phân theo trạng thái chưa / đã đăng nhập: đủ 4/4 ô "đã kiểm chứng" của ma trận Android · API: ma trận *không token × Bearer hợp lệ* đủ 9/9 ô đã kiểm chứng (TC_059 · 069 · 082 công khai · 086/088 · 091/094 · 098/100). Cột "vai trò khác" → TC treo `AMB-BK-01` |
| 3 | Security | ✅ | Mobile: TC_021 (phiên sau đăng xuất) · 022 · 023 · 055 (chuỗi tấn công 3 ô) · 014 (lộ email — `RISK-BK-AUTH-06`) · API: 21 TC `@Security` — gồm 3 `@KnownBug` bảo mật (TC_080 F-03 · 090 F-17 · 102 → 104 F-16) |
| 3 | API | ✅ | TC_059 → TC_108 (50 TC · 94 biến thể) — 6/6 endpoint · mã `200/201/400/401/404/422` + kiểm âm `500` · ma trận auth từng operation · OWASP: injection (064 · 068 · 081) · mass assignment (067) · auth bypass / token giả (089 · 095 · 096) · lộ dữ liệu nhạy cảm (092) · cờ cookie (078 · 080). `403` · `406/413/415` · `429` → **TC treo** (mục Dữ liệu dùng chung) |
| 3 | Database | ➖ | QA **không** có quyền truy vấn CSDL (user chốt 20-09-2026, ghi ở `docs/requirements/_book-api/README.md`) — đội Dev xác minh phần chỉ CSDL mới thấy. Dữ liệu lưu được đối chiếu gián tiếp qua API đọc (🔧 TC_031 · 053) |
| 3 | Integration | ➖ | Không có tích hợp bên thứ ba trong luồng đăng ký / đăng nhập — danh sách Division / Ward lấy từ module `ADDR` cùng hệ thống |
| 3 | Logging / Audit | ➖ | Requirements không có yêu cầu nhật ký thao tác cho `AUTH` |
| 4 | Compatibility | ⏭️ Cố ý bỏ | Chỉ 1 thiết bị chuẩn (emulator Android 17, `1344×2992`) — requirements khảo sát đúng 1 cấu hình; iOS chưa khảo sát. **Quyết định:** phạm vi khảo sát `/generate-requirements-from-mobile` 19-09-2026 — cần QA lead xác nhận danh sách máy. **Rà lại khi:** có máy thật / bản build iOS / danh sách thiết bị cam kết |
| 4 | Responsive / UI Stability | ✅ | TC_057 (xoay ngang) · 058 (bàn phím không che ô) · 005 (chuỗi dài bị cắt `…`, không tràn) |
| 4 | Accessibility | ⏭️ Cố ý bỏ | Chưa có REQ trợ năng (TalkBack, cỡ chữ lớn). Đã biết nút avatar và nút mắt **không có nhãn** (`RISK-BK-AUTH-07`) → TalkBack sẽ không đọc được tên. **Quyết định:** đề xuất bỏ ở lượt này — **cần QA lead / PO xác nhận**. **Rà lại khi:** PO chốt yêu cầu trợ năng, hoặc dev thêm `content-desc` |
| 4 | Performance | ➖ | Không có ngưỡng thời gian đã cam kết — đo tải thuộc đội hiệu năng (chưa có) |
| 4 | Regression | ➖ | `docs/bugs/_book-api/` chưa có bug nào được đóng |
| 4 | E2E | ✅ / ➖ | Trong module: TC_054 ✅ · Xuyên module (đăng nhập → thao tác Book / User): ➖ chưa có REQ module khác trên Android |

### Đối soát loại kiểm thử (4 vòng) — mặt Web

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_109 · 114 · 141 · 172 · 177 (5 TC · 27 mục Bảng kiểm) |
| 1 | Open form | ✅ | TC_110 (3) · 111 · 142 · 143 — mọi lối vào Sign in / Sign up · My Profile / Setting qua menu (TC_172 · 177) |
| 1 | Display | ✅ | TC_113 (Welcome + chữ cái avatar) · 114 (menu, cắt `…`) · 125 (toast góc trên phải) |
| 1 | Input valid data | ✅ | TC_144 (tối thiểu) · 145 (đầy đủ mọi ô) |
| 1 | Save | ✅ | TC_144 · 112 · 174 — thông báo + điều hướng đúng |
| 1 | Verify data | ✅ | TC_145 (địa chỉ tách lại ở My Profile) · 146 · 175 |
| 2 | UI Behavior | ✅ | TC_120 · 121 · 125 · 165 · 173 · 189 (6 TC · 8 biến thể) |
| 2 | Required | ✅ | TC_116 · 117 · 118 · 148 → 152 · 178 · 180 (10 TC · 11 biến thể) |
| 2 | Validation | ✅ | TC_119 · 138 · 153 · 154 · 155 · 156 · 159 · 179 · 181 (9 TC · 28 biến thể) — theo bảng 15 loại như mặt Mobile (mục trên); khác biệt: Profile Name max length ➖ không có REQ |
| 2 | Equivalence Partitioning | ✅ | TC_119 · 155 (lớp email sai) · 126 (kiểu chữ) · 159 (lớp SĐT) · 189 (3 theme) |
| 2 | Boundary Value Analysis | ✅ | TC_153 · 154 (2 TC · 7 biến thể) — `1` · `190` · **`191`** · **`192`** · `250` · `251` · `300` (biên 191/192 theo `REQ-73` 🟡) |
| 2 | Business Rule | ✅ | Email duy nhất TC_157 · 158 · 188 · khoá tài khoản TC_134 · 135 · đổi mật khẩu cần mật khẩu cũ TC_180 · 182 |
| 2 | Decision Table | ✅ | Bảng quyết định Sign in (mục Coverage) áp cho Web: R0 TC_116 → 118 · R1 TC_119 · R2 TC_123 · R3 TC_122 · R4 TC_112 · thêm luật **khoá** (TC_134 · 135) |
| 2 | State Transition | ➖ | Không có entity ≥ 3 trạng thái trong `AUTH`; khoá / mở tài khoản thuộc `USER` (ma trận trạng thái ở bộ TC `USER`) |
| 2 | Dependency | ✅ | TC_160 → 164 (Division → Ward → Address) |
| 2 | Use Case / Scenario | ✅ | TC_171 · 184 → 186 (đổi mật khẩu → đăng xuất → mật khẩu cũ / mới) |
| 2 | Save / Edit / Delete | ✅ | TC_174 · 183 · 187 (Reset) · 190 — xoá tài khoản thuộc `USER` |
| 2 | Error Guessing | ✅ | TC_136 · 168 (bấm 2 lần) · 128 · 166 (rời form) · 183 (lưu lại sau lỗi) |
| 3 | Permission | ✅ | Ma trận Web đủ **9/9** ô đã kiểm chứng: TC_110 · 130 · 133 · 114 · 115 + URL hồ sơ khi là khách TC_193. Cột *Vai trò khác*: ➖ không có vai trò (`AMB-BK-01` ✅) |
| 3 | Security | ✅ | TC_130 · 134 · 137 (phiên sau đăng xuất) · 138 · 139 · 169 (chuỗi tấn công) · 180 · 182 · 184 · 185 · 188 · 192 (không lẫn tài khoản) · 193 — 13 TC `@Security` |
| 3 | API | ✅ | Đã có bộ API riêng TC_059 → 108 (mục trên). TC Web chỉ dùng API ở 🔧 và teardown |
| 3 | Database | ➖ | QA **không** có quyền truy vấn CSDL (user chốt 20-09-2026) — đội Dev xác minh |
| 3 | Integration | ➖ | Không có tích hợp bên thứ ba |
| 3 | Logging / Audit | ➖ | Requirements không có yêu cầu nhật ký thao tác |
| 4 | Compatibility | ⏭️ Cố ý bỏ | Chỉ Chrome desktop — requirements khảo sát đúng 1 trình duyệt. **Quyết định:** phạm vi khảo sát 25-09-2026 — QA lead chốt danh sách trình duyệt. **Rà lại khi:** có cam kết đa trình duyệt |
| 4 | Responsive / UI Stability | ⏭️ Cố ý bỏ | Chỉ viewport `1600×750`. **Rà lại khi:** chốt danh sách breakpoint |
| 4 | Accessibility | ✅ | TC_140 (đăng nhập bằng bàn phím). Nhãn truy cập nút avatar khi là khách / nút mắt: ➖ không có REQ |
| 4 | Performance | ➖ | Không có ngưỡng thời gian cam kết |
| 4 | Regression | ➖ | Chưa có bug nào được đóng |
| 4 | E2E | ✅ | TC_130 → 131 (Book → Sign in → Book) · 134 (User khoá → Sign in) · 171 |

### Đối soát Validation theo bảng 15 loại field

| Ô (màn hình) | Loại | Mục của bảng | Kết quả |
|---|---|---|---|
| Email address (Sign in) | Email | Hợp lệ ✅ TC_004 · Thiếu `@` ✅ 010-a · Thiếu domain ✅ 010-b · Domain không hợp lệ ✅ 010-f · Nhiều `@` ✅ 010-d · Ký tự đặc biệt trước `@` ✅ 022-b · Hoa thường ✅ 017 · Đã tồn tại / chưa tồn tại ✅ 014 · Max length ➖ không có REQ (API không khai `maxLength`) | **8/9** mục, 1 ➖ có lý do |
| Email (Sign up) | Email | Hợp lệ ✅ 029 · Thiếu `@` ✅ 040-a · Thiếu domain ✅ 040-b · Domain không hợp lệ ✅ 040-e · Nhiều `@` ✅ 040-d · Ký tự đặc biệt trước `@` ➖ phủ ở Sign in (cùng bộ kiểm định dạng của app) · Hoa thường ✅ 042 · Đã tồn tại ✅ 041 · Max length ➖ không có REQ | **7/9**, 2 ➖ có lý do |
| Password (Sign in · Sign up) | Password | Hiện/ẩn ✅ 012 · 044 · Confirm khớp / không khớp ✅ 043 · 029 · Min/Max length · ký tự đặc biệt · hoa/thường · số ➖ **không có chính sách** (ASM-BK-AUTH-05 · `AMB-BK-AUTH-08`) · Chặn copy-paste ➖ không có REQ | **2/7** áp dụng được — cả 2 ✅; 5 mục ➖ vì hệ thống không có quy tắc |
| Password Confirmation | Password | Hiện/ẩn ✅ 045 · Khớp ✅ 043 (3 biến thể) · Bắt buộc ✅ 035 | 3/3 mục áp dụng |
| Name | Text | Bắt buộc ✅ 032-a · Min/Max ✅ 037 · 038 · Chỉ khoảng trắng ✅ 032-b · Ký tự đặc biệt ✅ 039-c · XSS ✅ 055-a/b · SQLi ✅ 055-c · Unicode/Emoji ✅ 039-a/b · Khoảng trắng đầu/cuối ➖ không có REQ về cắt khoảng trắng Name | **7/8**, 1 ➖ |
| Phone | Phone | Không bắt buộc ✅ 029 · 036 · Chấp nhận mọi định dạng ✅ 046 · Prefix / độ dài / chữ cái / dấu `-` ➖ **không có quy tắc** (`AMB-BK-AUTH-15` 🟠 chờ PO) | 2 mục áp dụng ✅ |
| Division · Ward | Dropdown | Mặc định ✅ 026 · Danh sách ✅ 047 · 049 · Bị khoá ✅ 048 · Đổi lựa chọn ✅ 050 · Bắt buộc ➖ ô tuỳ chọn | 4/4 mục áp dụng |
| Address | Textarea | Khoá / mở theo Ward ✅ 048 · Max length · xuống dòng · thẻ HTML ⏭️ chưa có REQ — rà lại khi PO chốt giới hạn ô Address | 1 mục ✅, 3 mục ⏭️ |

---

## Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)

| Đặc tính | Trạng thái | TC ID / Lý do |
|---|---|---|
| Functional Suitability | ✅ Có TC | TC_001 → TC_058 |
| Performance Efficiency | ➖ Ngoài phạm vi | Không có ngưỡng cam kết, không có công cụ đo — ghi vào mục 2.2 Master Test Plan, đội hiệu năng (chưa phân công) |
| Compatibility | ✅ Có TC (một phần) | API: 3 content-type đăng ký / đăng nhập (TC_060 · 070). Thiết bị: ➖ chỉ 1 emulator Android 17, iOS chưa khảo sát — QA lead chốt danh sách thiết bị |
| Interaction Capability | ✅ Có TC | TC_007 → 011 · 016 · 041 · 051 · 058 (thông báo lỗi rõ, chặn thao tác sai, bàn phím không che ô). Trợ năng TalkBack: ➖ chưa có REQ — QA lead / PO |
| Reliability | ✅ Có TC | Mobile: TC_025 (mất mạng) · 024 · 056 (vòng đời app) · 015 · 052 (giữ dữ liệu sau lỗi) · API: TC_068 · 081 (dữ liệu bất thường không gây `500`) |
| Security | ✅ Có TC | Mobile: TC_020 → 023 · 055 · 014 · API: TC_064 · 067 · 068 · 071 · 078 · 080 · 081 · 085 · 087 → 090 · 092 · 094 → 097 · 100 · 102 → 104. Pentest / quét lỗ hổng: ➖ chưa có đội bảo mật — QA lead phân công |
| Maintainability | ➖ Không áp dụng | Đặc tính của mã nguồn, không kiểm bằng manual TC |
| Flexibility | ✅ Có TC | TC_057 (xoay ngang) · 039 (Unicode / emoji). Đổi ngôn ngữ app: ➖ — app chỉ khảo sát locale `en-US`, QA lead |
| Safety | ➖ Không áp dụng | Ứng dụng quản lý sách, lỗi không gây thiệt hại vật lý hay tài chính |

---

## Đối soát cột Automation

| Nền tảng | Yes | Partial | No | ⏸️ Hoãn |
|---|---|---|---|---|
| Mobile (Android) | 56 | 2 | 0 | 25 (nằm trong Yes / Partial) |
| API | 50 | 0 | 0 | 20 (18 `@NeedsVerify` · 2 ⚪ chờ `AMB-BK-AUTH-03`) — nằm trong Yes · ⚠️ 25-09-2026 `AMB-BK-AUTH-03` đã chốt là lỗi → TC_062 · 075 chuyển `@KnownBug`, xử lý ở `/update-testcases-from-impact` |
| Web | 83 | 2 | 0 | 25 (`@NeedsVerify` — nằm trong Yes / Partial) |

### Điều kiện cần chuẩn bị

| # | Điều kiện | Ai cấp | Trạng thái | TC phụ thuộc |
|---|---|---|---|---|
| 1 | Gọi API để dọn tài khoản test và đối chiếu dữ liệu (`POST /api/login` · `DELETE /api/user/{id}` · `GET /api/me`) | QA | ✅ Đã có (năng lực QA 19-09-2026) | TC_029 · 030 · 031 · 039 · 053 · 054 · 055 (teardown) |
| 2 | Tắt / bật mạng trên emulator (`mobile: setConnectivity` hoặc `adb shell svc`) | QA | ✅ Đã có | TC_025 |
| 4 | Tài khoản test tự đăng ký qua API + dọn bằng token chính chủ (setup / teardown) | QA | ✅ Đã có | Mọi TC API cần `userA` · `userB` · `userE` |
| 3 | Định danh ổn định cho nút avatar và nút mắt (`content-desc`) — hiện không có nhãn, `resource-id` ô nhập tự sinh | Dev app | ⏳ Chưa có — tạm bắt theo quan hệ với ô nhập (`RISK-BK-AUTH-07`) | TC_001 · 002 · 005 · 006 · 012 · 020 · 044 · 045 |

### TC Partial · No · Hoãn

| TC ID | Nền tảng | Automation | Trục chặn | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|
| BK_AUTH_TC_019 | Android | Partial | 2 · Chạy lại có cùng kết quả | Bấm 2 lần dưới 1 giây phụ thuộc tốc độ công cụ bấm vào WebView (`RISK-BK-AUTH-08`) — automation assert kết quả, lần tái hiện đầu kiểm tay · ⏸️ Hoãn — `@NeedsVerify` |
| BK_AUTH_TC_053 | Android | Partial | 2 · Chạy lại có cùng kết quả | Như TC_019; đếm số tài khoản qua API · ⏸️ Hoãn — `@NeedsVerify` |
| BK_AUTH_TC_010 · 011 · 012 · 016 · 017 · 018 · 021 · 022 · 023 · 030 · 032 · 034 · 037 · 039 · 040 · 043 · 044 · 045 · 046 · 047 · 050 · 055 · 057 | Android | Yes · ⏸️ Hoãn | — | `@NeedsVerify` — chờ recon bổ sung (bảng "Vùng chưa có evidence"). Biến thể đã có evidence automate được ngay |

| BK_AUTH_TC_060 · 061 · 064 · 066 · 067 · 068 · 070 · 072 · 073 · 077 · 081 · 085 · 089 · 093 · 095 · 101 · 107 · 108 | API | Yes · ⏸️ Hoãn | — | `@NeedsVerify` — biến thể chưa gọi thật. Biến thể đã kiểm chứng automate ngay |
| BK_AUTH_TC_062 · 075 | API | Yes · ⏸️ Hoãn | — | ⚪ Chờ chốt `AMB-BK-AUTH-03` (F-19) |

| BK_AUTH_TC_136 · 168 | Web | Partial | 2 · Chạy lại có cùng kết quả | Bấm 2 lần dưới 1 giây phụ thuộc tốc độ công cụ — assert kết quả cuối (vào Dashboard · số tài khoản); lần tái hiện đầu kiểm tay · ⏸️ Hoãn — `@NeedsVerify` |
| BK_AUTH_TC_110 · 119 · 120 · 121 · 122 · 125 · 126 · 129 · 138 · 139 · 140 · 148 · 155 · 156 · 164 · 165 · 169 · 170 · 178 · 179 · 188 · 189 · 193 | Web | Yes · ⏸️ Hoãn | — | `@NeedsVerify` — biến thể đã có evidence automate ngay |

ℹ️ 7 TC `@KnownBug` API (TC_080 · 090 · 098 · 099 · 102 · 103 · 104), 1 TC `@KnownBug` Mobile (TC_038) và 5 TC `@KnownBug` Web (TC_131 · 154 · 176 · 183 · 190) **vẫn automate** — test FAIL chính là thứ phơi bug (tiêu chí Automation mục 6).

**Thứ tự ưu tiên automate:** `@Smoke` · `@CriticalPath` (TC_001 → 006 · 026 → 031 · 054) → TC nhiều biến thể ở Validation / BVA (TC_010 · 037 · 038 · 040 · 043) → phần còn lại.

---

## Bộ chạy đề xuất

| Bộ | TC | Thời gian ước tính | Ghi chú |
|---|---|---|---|
| **Smoke** (V1) | **TC_029 trước tiên** (tạo `TK-A`) → 026 · 027 · 028 · 030 · 031 → 001 → 006 | ~20 phút | Fail ở đây → dừng, mọi TC V2 BLOCKED |
| Regression đầy đủ | Toàn bộ 58 TC theo thứ tự Part 02 V1 → Part 01 → Part 02 V2 → V3 → V4 | ~3 giờ | Kết thúc bằng **dọn dữ liệu** |
| Bảo mật | TC_014 · 020 → 023 · 055 | ~25 phút | Gắn `@Security` |
| Đặc thù mobile | TC_024 · 025 · 056 · 057 · 058 | ~15 phút | Cần quyền tắt mạng, xoay máy |
| API `@Smoke` | TC_059 · 106 · 069 · 071 · 082 · 086 · 091 | ~2 phút (automation) | Chạy trước mọi TC API |
| API đầy đủ | TC_059 → 108 theo **Dependencies & Execution Order** | ~10 phút (automation) | Kết thúc bằng teardown dọn tài khoản |
| `@TechCheck` | TC_001 · 012 · 024 · 025 · 031 · 038 · 048 · 053 · 056 · 057 · 058 | — | Phần 🔧 cần Appium Inspector / `adb` / API |
| **Web Smoke** | TC_144 (tạo `TK-W`) → 109 → 115 · 130 · 141 → 143 · 145 · 146 · 172 → 175 · 177 | ~30 phút | Fail ở đây → dừng |
| Web đầy đủ | TC_109 → 193 theo *Setup / Part* ở Dữ liệu dùng chung (Web) | ~3,5 giờ | Kết thúc bằng teardown |
| Web lỗi đã biết | TC_131 · 154 · 176 · 183 · 190 | ~15 phút | `@KnownBug` — mở bug bằng `/create-bug-report` |
| Web `@TechCheck` | TC_115 · 119 · 137 · 145 · 167 · 168 · 174 · 184 | — | Phần 🔧 cần DevTools (Network / Application) |

---

## Nhật ký thay đổi

| Ngày | Thay đổi | Mốc git |
|---|---|---|
| 25-09-2026 | **Chỉnh biên `Name`** theo `REQ-BK-AUTH-73` 🟡 (250 → **191**, `AMB-BK-AUTH-33` ✅ · `DEMO-AMB-2509B`; phát hiện khi kiểm `USER` API): `TC_037` · `038` (Mobile) · `TC_153` · `154` (Web) đổi biến thể `1 · 249 · 250 · 251 · 300` → `1 · 190 · 191` (hợp lệ) và `192 · 250 · 251 · 300` (bị chặn). `TC_038` · `154` thêm `@KnownBug`: biến thể `192` · `250` **dự kiến FAIL** — app / web chỉ chặn từ 251 ký tự, server từ chối từ 192 (`POST /api/register` → 422 `fields.fields`). Số TC **không** đổi (Mobile 58 · Web 85) | `b30eb57` (trước khi sửa) |
| 25-09-2026 | Sinh bộ TC **Web** bằng `/generate-testcases-from-requirements` Mode QUICK chế độ **BỔ SUNG** (module đã có TC Mobile + API), độ hạt GỘP giữ theo bộ đang có, rủi ro Cao → Đầy đủ. **85 TC · 119 biến thể · 27 mục Bảng kiểm**, 3 part ở `web/parts/`, nối dải `BK_AUTH_TC_109` → `193`. Phủ **72/72** REQ khai `Web` (gồm `97` 🟡 · `120` · `121` mới của `DEMO-AMB-2509`). Đã mở 29/29 ảnh evidence web, không xung đột. 4 TC `@KnownBug` · 25 `@NeedsVerify` · 8 `@TechCheck` · 3 Assumption mới (`ASM-BK-AUTH-06` → `08`). **Không** chạm dòng TC Mobile / API — ảnh hưởng của `DEMO-AMB-2509` lên TC API (TC_062 · 075 · TC treo) chờ `/update-testcases-from-impact` | `b30eb57` |
| 21-09-2026 | Đổi tên file index `test_cases_auth.md` → `TEST_CASES_AUTH_SUMMARY.md` — quy ước mới: index IN HOA để khác hẳn file nền tảng. Nội dung, mã REQ/TC không đổi; mọi link trỏ tới đã sửa | `e985e9d` |
| 20-09-2026 | **Tách TC gánh nhiều REQ không có TC chống lưng** (user phát hiện: 47 TC / 48 REQ). `TC_069` (REQ-03 · 11 · 12) → giữ REQ-11, thêm **`TC_106`** (REQ-03) · **`TC_107`** (REQ-12). `TC_082` (REQ-24 · 26) → giữ REQ-24, thêm **`TC_108`** (REQ-26). TC ID cũ giữ nguyên, mã mới nối tiếp dải. API 47 → **50 TC · 94 biến thể**; module **108 TC**. Luật đã đưa vào Self-Quality Gate của skill `skills-rbt-manual-testing` và checklist `/generate-testcases-api` | `e73e3e6` |
| 20-09-2026 | Sinh bộ TC **API** bằng `/generate-testcases-api auth`: **47 TC · 89 biến thể** (`BK_AUTH_TC_059` → `105`), 2 part ở `api/parts/`. Phủ **48/48** REQ API (40 riêng + vế API của 8 REQ dùng chung) → module đủ **86/86 REQ**. Spec online khớp snapshot 19-09-2026 (`sha256`) — không khám phá lại. User chốt: phạm vi cả 6 endpoint · `AMB-BK-AUTH-01` · `02` · `04` là **lỗi** → 7 TC `@KnownBug` · QA **không** truy vấn CSDL → nhánh Database ➖. 2 TC ⚪ chờ `AMB-BK-AUTH-03`. Mở `AMB-BK-AUTH-20` (406/413/415). Lượt này **không** gọi thật API — tạo 0 / dọn 0 bản ghi | `e73e3e6` |
| 20-09-2026 | Sinh bộ TC **Mobile (Android)** cho `AUTH` bằng `/generate-testcases-from-requirements` Mode QUICK, độ hạt GỘP, rủi ro Cao → Đầy đủ. **58 TC · 95 biến thể · 17 mục Bảng kiểm**, 2 part. Chiếm dải `BK_AUTH_TC_001` → `058`. Phủ **46/46** REQ Mobile (38 riêng + 8 dùng chung). 25 TC `@NeedsVerify`, 11 TC `@TechCheck`. Đã mở 31/31 ảnh evidence, không có xung đột tài liệu ↔ ảnh. 5 Assumption (`ASM-BK-AUTH-01` → `05`). **Chưa sinh:** TC API (48 REQ) | `e73e3e6` (trước khi tạo) |
