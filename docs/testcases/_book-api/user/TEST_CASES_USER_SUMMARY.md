# Test Cases — Module Người dùng (`USER`) · Book — tổng 149 TC · 3 nền tảng (Web · API · Mobile Android) · độ hạt GỘP

| Thông tin | Nội dung |
|---|---|
| **Hệ thống** | AnhTester Book Management — mã hệ thống `BK` (namespace `_book-api/`) · danh mục TC: [../README.md](../README.md) |
| **Module** | Người dùng — màn hình `User Management` · prefix `USER` |
| **Nguồn requirement** | Index [REQUIREMENTS_USER_SUMMARY.md](../../../requirements/_book-api/user/REQUIREMENTS_USER_SUMMARY.md) (dùng chung: 4 REQ `Web · API` mục 3.1 · 31 REQ `Android · Web` mục 3.2) · [web/requirements_user_web.md](../../../requirements/_book-api/user/web/requirements_user_web.md) (7 REQ) · [api/requirements_user_api.md](../../../requirements/_book-api/user/api/requirements_user_api.md) (77 REQ) · [mobile/requirements_user_mobile.md](../../../requirements/_book-api/user/mobile/requirements_user_mobile.md) (9 REQ) — **0 AMB treo** (chốt 25-09-2026 `DEMO-AMB-2509` · `DEMO-AMB-2509B` · 26-09-2026 `DEMO-AMB-2609`) |
| **Mode sinh** | QUICK (`/generate-testcases-from-requirements`) · độ hạt **GỘP** (mặc định) · Mobile: chế độ **BỔ SUNG** (module đã có bộ TC Web + API) |
| **Ngày sinh** | Web · API 25-09-2026 · Mobile 26-09-2026 |
| **Dải TC ID** | `BK_USER_TC_001` → `BK_USER_TC_149` (Web `001`→`050` · API `051`→`107` · **Mobile `108`→`149`**; `082`→`107` bổ sung 25-09-2026 khi có REQ mặt API — nối tiếp, không chèn giữa) |
| **Mã kế tiếp** | `BK_USER_TC_150` — **KHÔNG đánh lại từ 001** |
| **Phạm vi REQ** | Web: 42/42 REQ (7 chỉ Web + 31 `Android · Web` + 4 `Web · API`). API: **81/81** REQ (77 riêng API + 4 dùng chung) — 5 endpoint `/api/user*`. **Mobile (Android): 40/40** REQ (31 dùng chung `Android · Web` + 9 chỉ Android). Ngoài phạm vi: **tải ảnh đại diện** (`AMB-BK-USER-05` ✅ — module `FILE`) · Android: REQ **chưa khai** nền tảng Android — `01` · `33` · `35` · `38` (`Web · API`) · `19` · `32` · `34` · `37` · `39` · `40` · `42` (chỉ Web — cần tester nhập mật khẩu / tạo tài khoản, [requirements mobile mục 2](../../../requirements/_book-api/user/mobile/requirements_user_mobile.md#2-bản-đồ-phủ-tài-liệu)) · iOS chưa khảo sát |
| **Mức rủi ro · độ sâu** | `Cao` → **Đầy đủ** — đủ 6 nhánh V1, mọi nhánh V2 có điều kiện kích hoạt, V3/V4 chấm từng nhánh.<br>Căn cứ chấm Cao: chạm **dữ liệu cá nhân** (email · SĐT · địa chỉ công khai) · có thao tác **không hồi lại được** (xoá người dùng) · khoá / mở tài khoản ảnh hưởng đăng nhập.<br>**Hạ xuống Tiêu chuẩn khi:** không bao giờ — module quản lý tài khoản luôn giữ mức Cao |
| **Môi trường** | `https://book.anhtester.com` — **production, server duy nhất**. **Không** dùng chung (user chốt 14-08-2026) nhưng vẫn áp luật: chỉ ghi/xoá bản ghi do chính lượt chạy tạo |
| **Trình duyệt chuẩn** | Google Chrome (desktop) · viewport `1600×750` · `en-US`. Trình duyệt khác: chưa khảo sát |
| **Thiết bị chuẩn (Mobile)** | Emulator `Pixel_10_Pro_XL_API_37` · Android 17 · `1344×2992` · dọc · locale `en-US` · app `book.anhtester.com` `1.0 (versionCode 1)` bản debug (Hybrid — Capacitor). **iOS chưa khảo sát** — bộ TC Mobile **không** áp cho iOS |

## Cách đọc bộ TC này

Cùng quy ước với module `AUTH` — xem [TEST_CASES_AUTH_SUMMARY.md › Cách đọc bộ TC này](../auth/TEST_CASES_AUTH_SUMMARY.md#cách-đọc-bộ-tc-này): biến thể `a`/`b`/`c` (báo FAIL ghi `BK_USER_TC_018-b`), **Bảng kiểm** cho TC tĩnh, dòng `🔧 Ghi chú kỹ thuật` (bỏ qua được — tag `@TechCheck`; ở Mobile là phần cần Appium Inspector / `adb`), `⚠️ chưa có evidence` (tag `@NeedsVerify`), `🐞 Kỳ vọng FAIL` (tag `@KnownBug`). Tag nền tảng: `@Web` · `@API` · `@Android`.

---

## Dữ liệu dùng chung

### Trạng thái xuất phát

| Ký hiệu | Trạng thái | Cách đưa về |
|---|---|---|
| `U0` | **Khách** — chưa đăng nhập, ở `https://book.anhtester.com/user-management` | Đang đăng nhập thì avatar → `Logout`, rồi bấm menu trái `User` |
| `U1` | **`TK-U` đang đăng nhập**, ở `/user-management` | Từ `U0`: avatar → đăng nhập `TK-U` → menu trái `User` |

### Tài khoản & người dùng test

| Ký hiệu | Name | Email | Mật khẩu | Tạo bởi | Dùng cho |
|---|---|---|---|---|---|
| `TK-U` | `Auto User 1790150500` · Phone `0900000001` · địa chỉ `Cao Bằng` / `Phường Thục Phán` / `123 Auto Street` | `auto_user_1790150500@auto.test` | `Auto@12345` | **Sign up** ở setup (hoặc `POST /api/register`) | Tài khoản thao tác (`U1`) · dòng `You` |
| `U-B` | `Auto User B 1790150501` · Phone `0900000002` | `auto_user_1790150501_b@auto.test` | `Auto@12345` | `TC_009` | `TC_010 → 013` · `018` · `025` · `026` · `031` · `040` → `043` |
| `U-C` | `Auto User C 1790150502` | `auto_user_1790150502_c@auto.test` | `Auto@12345` | `New user` ở setup | `TC_044` → `014` → `015` (xoá) |

Mọi Name / Email mang số `17901505xx` = **mốc mẫu** `1790150500` + độ lệch `xx`. Khi chạy thay bằng `T + xx` (`T` = Unix timestamp lúc bắt đầu lượt) và ghi `T` vào đầu execution report.

### Thứ tự chạy

```
Setup   : Sign up TK-U (đủ Phone + địa chỉ) → đăng nhập → New user U-C
V1      : TC_001 → 008 → 009 (tạo U-B) → 010 → 011 → 012 → 013 → 014 (U-C) → 015 (xoá U-C)
          ⚠️ TC_044 (Cancel xoá U-C) chạy TRƯỚC TC_014
V2      : TC_016 → 043 · 045 → 049   (TC_042 → 043 tuần tự trên U-B)
V4      : TC_050
Teardown: xoá qua giao diện mọi người dùng `auto_user_<T+nn>` còn lại (⋮ → Delete)
          → TK-U không tự xoá được (REQ-22) → đăng nhập API bằng TK-U → DELETE /api/user/{id} với token của CHÍNH nó
          → báo cáo số tạo / số dọn / còn sót
```

### Dọn dữ liệu — BẮT BUỘC sau mỗi lượt (`RISK-BK-USER-04`)

| Độ lệch | Email | Tạo bởi |
|---|---|---|
| `00` | `TK-U` | setup — xoá cuối cùng bằng API (token của chính nó) |
| `01` · `02` | `U-B` · `U-C` | `TC_009` · setup (`U-C` đã xoá ở `TC_015`) |
| `03` → `07` | `…_inactive` · `…_xss` · `…_sqli` · `…_twice` · `…_flow` | `TC_047` · `048` · `046` · `049` (`…_flow` tự xoá trong TC) |
| `08` | `…_cancel` — chỉ tồn tại nếu `TC_045` **cho tạo** ngoài dự kiến | `TC_045` |
| `99` | `…_x` — chỉ tồn tại nếu form **cho qua** ngoài dự kiến | `TC_032` → `035` |

🚫 **Không** sửa / khoá / xoá người dùng nào không có tiền tố `auto_user_`. Ảnh chụp danh sách phải **làm mờ** dòng không phải dữ liệu test trước khi đính vào báo cáo (`RISK-BK-USER-01`).

---

## Dữ liệu dùng chung (API)

| Ký hiệu | Cách tạo | Dùng cho |
|---|---|---|
| `userA` | `POST /api/register` `{name:"Auto userapi_a <T>", email:"auto_userapi_a_<T>@auto.test", password:"Auto@12345", phone:"09<8 số cuối T>", address:"auto_addr_<T>"}` → `POST /api/login` lấy `tokenA` → `GET /api/me` lấy `id` | Chủ thể thao tác ghi · dữ liệu tìm kiếm `TC_054` |
| `userB` | `POST /api/register` `…_b_<T>@auto.test` → `tokenB` | Mục tiêu BOLA · nguồn email trùng (`TC_098-b`) |
| `targetU` · `targetU2` · `targetU3` | `POST /api/user` (tokenA) `auto_userapi_<T>_target*@auto.test` (mật khẩu `New@12345`) → tra `id` bằng `GET /api/user?search=<email>` | Đối tượng `GET/PATCH/DELETE /api/user/{id}` — **mỗi TC ghi/xoá dùng đích riêng** |

`<T>` = Unix timestamp lúc bắt đầu lượt, ghi vào đầu execution report. Mọi email mang `<T>` để truy vết.

**Thứ tự chạy (API):** Setup `userA` · `userB` → nhóm đọc công khai (`051`→`056` · `082`→`090` · `067`→`069`, cần `targetU` cho `067` · `069`) → `POST` (`057`→`066` · `091`→`097`, mỗi TC email riêng) → tạo `targetU` mới cho từng TC ghi → `PATCH` (`070`→`077` · `098`→`105`) → `DELETE` (`078`→`081` · `106`) → `107` → Teardown.

**Dọn dữ liệu — BẮT BUỘC (API):** cuối lượt, liệt kê **mọi** tài khoản `auto_userapi_*_<T>*` do phiên tạo (`GET /api/user?search={"AND":[{"email":{"contains":"<T>"}},{"email":{"contains":"@auto.test"}}]}`) rồi `DELETE /api/user/{id}` **từng cái** bằng token của **chính nó**; tài khoản **Inactive** (`TC_094-b` · `TC_073` · `TC_105-b`) không đăng nhập được → xoá bằng `tokenA`. Xoá `userA` · `userB` sau cùng. Báo số **tạo / dọn / còn sót** (kiểm bằng tìm kiếm hậu tố `_<T>@auto.test` → `total` = `0`). 🚫 Không đụng `user@example.com` (F-19) hay bất kỳ người dùng có sẵn nào. Lượt kiểm chứng 25-09-2026: tạo **40** · dọn **40** · sót **0**.

🔒 **Chống lộ dữ liệu:** danh sách công khai chứa email · điện thoại · địa chỉ của người thật — TC **chỉ đếm và đọc tên khoá**, không đính body vào Allure / báo cáo (`RISK-BK-USER-06`). `TC_088` · `TC_089`: **không** chép chuỗi `error`, **không** đọc `list`.

---

## Dữ liệu dùng chung (Android)

### Trạng thái xuất phát

| Ký hiệu | Trạng thái | Cách đưa app về |
|---|---|---|
| `M1` | **`TK-M` đang đăng nhập** trên app, hướng dọc, có mạng, bàn phím đóng | Mở app → avatar → đăng nhập `TK-M` → bấm tab theo Pre-Condition của TC |
| `M1r` | Như `M1` nhưng app **vừa tắt hẳn và mở lại** — chưa mở `Add user` / `Update user` lần nào trong phiên | Vuốt app khỏi danh sách ứng dụng gần đây → mở lại (phiên đăng nhập được giữ) → tab `User`. **Bắt buộc** cho mọi TC mở hộp thoại, vì lỗi validation dính giữa các lần mở (REQ-BK-USER-124 — `TC_141` `@KnownBug`) |

### Tài khoản test

| Ký hiệu | Name | Email | Mật khẩu | Tạo bởi | Dùng cho |
|---|---|---|---|---|---|
| `TK-M` | `Auto Mobile User 1790150700` | `auto_mobile_user_1790150700@auto.test` | `Auto@12345` | `POST /api/register` ở setup (hoặc Sign up trên app) — **tester** đăng nhập trên app | `M1` · dòng `You` (TC_113 · 121-a · 144) |
| `U-M2` | `Auto Mobile User B 1790150701` · Phone `0900000701` · **không** địa chỉ | `auto_mobile_user_1790150701_b@auto.test` | `Auto@12345` | `POST /api/register` ở setup | Dòng người khác: TC_109 · 116 · 117 · 121 · 129 · 130 · 141 · 145 |

Số `17901507xx` = mốc mẫu `1790150700` + độ lệch `xx` — khi chạy thay bằng `T + xx`, ghi `T` vào đầu execution report. Chuỗi không tạo bản ghi (`…90` · `…91` · `…702` · `…703`) chỉ để truy vết.

### Chuẩn bị & thứ tự chạy

```
Setup    : POST /api/register TK-M · U-M2 → tester đăng nhập TK-M trên app (gom 1 lượt, không hỏi từng bước)
V1       : TC_108 → 113 · 117 (không cần M1r) → tắt/mở app → 114 → 115 → 116 (mỗi TC mở hộp thoại: tắt/mở app trước)
V2       : TC_118 → 133 (bảng lọc — tuần tự 124 → 125) → 134 → 141 (mỗi TC: M1r) → 142 → 143
V3 · V4  : TC_144 → 146 → 147 (tắt/bật mạng) → 148 → 149
Teardown : đăng nhập API bằng U-M2 → DELETE /api/user/{id} (token của CHÍNH nó) → làm tương tự với TK-M
           → tìm hậu tố `_1790150799_x@auto.test` (chỉ tồn tại nếu TC_134 → 137 cho tạo ngoài dự kiến) → báo số tạo / dọn / còn sót
```

🚫 **Không** mở menu ⋮, sửa, khoá hay xoá người dùng nào không có tiền tố `auto_mobile_user_`. **Không** bấm `Save` / `Update` / `Delete` trên dòng người khác — bộ TC Mobile chỉ **mở rồi Cancel**. Ảnh chụp có dòng không phải dữ liệu test phải **làm mờ** (`RISK-BK-USER-01`).

---

## Bản đồ tài liệu

> File này là **index** — không chứa dòng TC.

| Nền tảng | File | Nhóm chức năng | Số TC | TC ID | REQ bao phủ |
|---|---|---|---|---|---|
| Web | [web/test_cases_user_web.md](web/test_cases_user_web.md) | Danh sách · tìm kiếm · bộ lọc · quyền theo trạng thái đăng nhập · thêm · sửa · khoá/mở · xoá | 50 | 001–050 | `REQ-BK-USER-01` → `42` |
| API | [api/parts/part_01_api_doc_danh_sach_chi_tiet.md](api/parts/part_01_api_doc_danh_sach_chi_tiet.md) | `GET /api/user` · `GET /api/user/{id}` (đọc công khai) | 18 | 051–056 · 067–069 · 082–090 | `REQ-BK-USER-01` · `43 → 68` · `116 → 119` |
| API | [api/parts/part_02_api_tao.md](api/parts/part_02_api_tao.md) | `POST /api/user` | 17 | 057–066 · 091–097 | `REQ-BK-USER-33` · `35` · `69 → 90` |
| API | [api/parts/part_03_api_sua_xoa.md](api/parts/part_03_api_sua_xoa.md) | `PATCH` · `DELETE /api/user/{id}` · quy ước chung | 22 | 070–081 · 098–107 | `REQ-BK-USER-38` · `91 → 115` |
| Mobile (Android) | [mobile/test_cases_user_mobile.md](mobile/test_cases_user_mobile.md) | Danh sách · cuộn ngang · tìm kiếm · bộ lọc · Add / Update user (validation) · Confirm delete · điều hướng · mất mạng · xuống nền · bàn phím | 42 | 108–149 | `REQ-BK-USER-02 → 18` · `20 → 31` · `36` · `41` · `120 → 128` |
| iOS | — | Chưa khảo sát — không sinh TC | — | — | — |

Tổng Web: **50 TC · 65 biến thể** + **8 mục Bảng kiểm**. Tổng API: **57 TC** (`051`→`107`, 3 part vì > 40 TC). Tổng Mobile: **42 TC · 58 biến thể** + **26 mục Bảng kiểm** (1 file — dưới ngưỡng 50 TC của độ hạt GỘP). Toàn module **149 TC**.

> **Neo REQ mặt API:** từ 25-09-2026 module `USER` **có REQ mặt API** (77 REQ + 4 dùng chung) — mọi TC API neo **1:1** vào REQ API. TC gộp nhiều REQ (`TC_053` · `055` · `057` · `094` · `098` …) ghi **biến thể → REQ** ở cột Expected; biến thể FAIL map về đúng REQ, không chẻ nhỏ. 9 TC `@KnownBug` (`061` · `062` · `071` · `088` · `089` · `090` · `092` · `097` · `105`) theo kỳ vọng đã chốt bằng `DEMO-AMB-2509B`.

---

## Assumptions đã áp dụng

| Mã | Điểm chưa rõ | Giả định đã áp dụng | TC bị ảnh hưởng |
|---|---|---|---|
| ASM-BK-USER-01 | Ô tìm kiếm ghi *"name, email, phone or address"* nhưng khảo sát chỉ thử theo email | Tìm được theo **tên** và **số điện thoại** giống email (theo chữ gợi ý trong ô) | TC_018 `b` `c` |
| ASM-BK-USER-02 | Tạo người dùng với `Active for login` **tắt** — ma trận trạng thái ghi *chưa thử* | Tạo ra ở trạng thái `Inactive` và không đăng nhập được (cùng tác dụng như REQ-39) | TC_047 |
| ASM-BK-USER-03 | Hộp thoại `Add user` đóng bằng `Esc` / bấm ra ngoài — chưa thử | Đóng được và không tạo dữ liệu (hành vi mặc định của hộp thoại MUI) | TC_045 `b` `c` |
| ASM-BK-USER-04 | Nhãn nhóm `Infomation` (thiếu `r`) | Ghi **đúng nguyên văn** theo ảnh — cùng `ASM-BK-AUTH-01` | TC_007 |

| ASM-BK-USER-05 | Danh sách trường **nội bộ** dùng cho `TC_089` (REQ-116) — tài liệu cố ý không liệt kê | **Dev cung cấp** danh sách; TC đọc từ biến môi trường / file cấu hình, không ghi vào `docs/` | TC_089 |
| ASM-BK-USER-06 | Danh sách từ khoá "tên thư viện truy cập dữ liệu" dùng cho `TC_088` (REQ-117) | **Dev cung cấp** | TC_088 |
| ASM-BK-USER-07 | Android: nhãn nguyên văn 5 mục của ô `Operator` — lúc khảo sát chỉ đọc số lượng + mục đang chọn, không có ảnh danh sách mở | **Giống web**: `Equals (=)` · `Not equal to (!=)` · `Contains (∈)` · `Starts with (→)` · `Ends with (←)` | TC_127 |
| ASM-BK-USER-08 | Android: ô cột `Active` của một dòng — không có ảnh Android nào chụp ô này | Nhãn `Active` màu xanh như web | TC_109 mục `4` |
| ASM-BK-USER-09 | Android mất mạng: ảnh `android_user_list_offline.png` chỉ thấy chữ `No` — khung trạng thái rỗng bị đẩy lệch sang phải do bảng cuộn ngang; AC ghi `No Data` | Chấm `No Data`, cho phép vuốt ngang bảng để đọc trọn chữ. **Không** phải xung đột nội dung | TC_147 |
| ASM-BK-USER-10 | Android: chuỗi tấn công / emoji ở ô tìm kiếm — không có REQ riêng | Cho kết quả như từ khoá không tồn tại (`No Data`, REQ-09); app không chạy mã, không lộ toàn bộ danh sách | TC_146 |
| ASM-BK-USER-11 | Android: tạo tài khoản bằng `Add user` chưa kiểm được (REQ-34 · 35 chưa khai Android) — cần dữ liệu người dùng khác để thao tác | Tạo `TK-M` · `U-M2` bằng `POST /api/register` ở setup; `U-M2` **không** có địa chỉ → cột `Address` và nhóm `Address` của `Update user` trống | TC_109 · 116 · 141 · 145 |

**Không** phát hiện xung đột tài liệu ↔ ảnh evidence (Web · Mobile).

---

## Bảng Đối Soát Coverage (Web 42/42 REQ)

| REQ ID | Mô tả ngắn | TC IDs (số biến thể) | Loại case |
|---|---|---|---|
| REQ-BK-USER-01 | Khách xem danh sách kèm dữ liệu cá nhân | TC_002 | P |
| REQ-BK-USER-02 | Bảng đủ cột | TC_001 | UI (Bảng kiểm 5 mục) |
| REQ-BK-USER-03 | Mặc định sắp Updated giảm dần | TC_010 | P |
| REQ-BK-USER-04 | Page size mặc định 5, 7 lựa chọn | TC_005 | UI |
| REQ-BK-USER-05 | Đổi page size tải lại trang 1 | TC_016 (2) | P |
| REQ-BK-USER-06 | Thanh phân trang | TC_006 | UI |
| REQ-BK-USER-07 | Page size về 5 khi quay lại | TC_017 | P |
| REQ-BK-USER-08 | Tìm kiếm theo từ khoá | TC_018 (3) | P · EP |
| REQ-BK-USER-09 | Không có kết quả | TC_019 | N |
| REQ-BK-USER-10 | Sắp xếp tăng / giảm theo cột | TC_020 (2) | P |
| REQ-BK-USER-11 | Mở bảng lọc | TC_021 | UI Behavior |
| REQ-BK-USER-12 | Field 7 lựa chọn | TC_022 | UI |
| REQ-BK-USER-13 | Operator 5 lựa chọn | TC_023 | UI |
| REQ-BK-USER-14 | Đổi Field reset Operator | TC_024 | Dependency |
| REQ-BK-USER-15 | Lọc tự áp dụng | TC_025 (3) | P · EP |
| REQ-BK-USER-16 | Add filter AND / OR | TC_026 (2) | P · Decision |
| REQ-BK-USER-17 | Clear filter | TC_027 | P |
| REQ-BK-USER-18 | Icon cột mở lọc đúng cột | TC_028 (2) | P |
| REQ-BK-USER-19 | Khách không có New user / ⋮ | TC_003 | Permission |
| REQ-BK-USER-20 | Đã đăng nhập có New user / ⋮ | TC_004 | Permission |
| REQ-BK-USER-21 | Nhãn `You` | TC_029 | UI |
| REQ-BK-USER-22 | Không sửa / xoá chính mình | TC_030 | N · Permission |
| REQ-BK-USER-23 | Sửa / xoá được người khác | TC_031 | Permission |
| REQ-BK-USER-24 | Hộp thoại Add user | TC_007 · 045 (3) · 050 | UI · Modal · A11y |
| REQ-BK-USER-25 | Active mặc định bật | TC_008 | UI |
| REQ-BK-USER-26 | Name bắt buộc | TC_032 | N |
| REQ-BK-USER-27 | Email bắt buộc | TC_033 | N |
| REQ-BK-USER-28 | Password bắt buộc | TC_034 | N |
| REQ-BK-USER-29 | Confirmation bắt buộc | TC_035 | N |
| REQ-BK-USER-30 | Name ≤ 191 (🟡 sửa 25-09-2026) | TC_036 (2) · 037 (3) | **B** — 190 · **191** · **192** · 250 · 251 — `037` `@KnownBug` |
| REQ-BK-USER-31 | Email sai định dạng | TC_038 (3) | N · EP |
| REQ-BK-USER-32 | Confirmation khớp | TC_039 | N |
| REQ-BK-USER-33 | Email đã tồn tại | TC_040 | N |
| REQ-BK-USER-34 | Tạo thành công | TC_009 · 046 · 047 · 048 (2) · 049 | P · Error Guessing · State · Security |
| REQ-BK-USER-35 | Người vừa tạo đăng nhập được | TC_011 | P |
| REQ-BK-USER-36 | Update điền sẵn | TC_012 | UI |
| REQ-BK-USER-37 | Cập nhật thành công | TC_013 · 049 | P |
| REQ-BK-USER-38 | Mật khẩu trống thì không đổi | TC_041 | P · Security |
| REQ-BK-USER-39 | Tắt Active → Inactive | TC_042 · 049 | State |
| REQ-BK-USER-40 | Bật lại Active | TC_043 · 049 | State |
| REQ-BK-USER-41 | Xoá cần xác nhận | TC_014 · 044 | P · N (Cancel) |
| REQ-BK-USER-42 | Xoá gỡ khỏi danh sách | TC_015 · 049 | P |

**Tổng:** 42/42 REQ có ≥ 1 TC ✅ · không REQ nào 🔴. Phép thử 6b: TC gánh ≥ 2 REQ duy nhất là `TC_049` (5 REQ) — mọi REQ đều có TC khác chống lưng ✅.

### Bảng trạng thái — người dùng (State Transition)

| Từ \ Hành động | Add (Active bật) | Add (Active tắt) | Update tắt Active | Update bật Active | Delete |
|---|---|---|---|---|---|
| — (chưa có) | ✅ → Active · TC_009 | ✅ → Inactive · TC_047 | — | — | — |
| Active | — | — | ✅ → Inactive · TC_042 | — | ✅ · TC_015 · 049 |
| Inactive | — | — | — | ✅ → Active · TC_043 | ✅ · TC_049 (sau bước 4 → 5 → 6) |
| Chính mình (`You`) | — | — | ❌ bị khoá · TC_030 | ❌ bị khoá · TC_030 | ❌ bị khoá · TC_030 |

---

## Bảng Đối Soát Coverage (API 81/81 REQ)

| REQ ID | Mô tả ngắn | TC IDs | Loại case |
|---|---|---|---|
| REQ-BK-USER-01 | Không cần đăng nhập vẫn xem được danh sách người dùng (dùng chung — TC Web: TC_002) | TC_051 · TC_056 | P |
| REQ-BK-USER-33 | Email đã tồn tại bị từ chối khi tạo người dùng (dùng chung — TC Web: TC_040) | TC_064 | P |
| REQ-BK-USER-35 | Tài khoản vừa tạo đăng nhập được bằng mật khẩu đã đặt (dùng chung — TC Web: TC_011) | TC_057 | P |
| REQ-BK-USER-38 | Để trống mật khẩu khi cập nhật thì mật khẩu không đổi (dùng chung — TC Web: TC_041) | TC_072 | P |
| REQ-BK-USER-43 | Danh sách trả `list` và `pagination` đúng hình dạng | TC_051 | P |
| REQ-BK-USER-44 | Danh sách và chi tiết không lộ mật khẩu hay khoá ngoài schema | TC_056 · TC_069 | P |
| REQ-BK-USER-45 | Mặc định `limit`=10 · `page`=1 · sắp `updatedAt` giảm dần | TC_082 | P |
| REQ-BK-USER-46 | `limit` cắt đúng số bản ghi và tính `totalPage` | TC_052 | P |
| REQ-BK-USER-47 | `limit` ngoài khoảng [1 ; 10000] bị từ chối | TC_055 | P |
| REQ-BK-USER-48 | `limit` = 10000 hợp lệ (biên trên) | TC_055 | P |
| REQ-BK-USER-49 | `limit` sai kiểu bị từ chối | TC_055 | P |
| REQ-BK-USER-50 | `page` chuyển sang trang khác trả bản ghi khác | TC_052 | P |
| REQ-BK-USER-51 | `page` < 1 bị từ chối | TC_055 | P |
| REQ-BK-USER-52 | `page` sai kiểu bị từ chối | TC_055 | P |
| REQ-BK-USER-53 | `page` vượt tổng số trang trả danh sách rỗng, không lỗi | TC_055 | P |
| REQ-BK-USER-54 | `sort` nhận 7 giá trị, `sortBy` sắp đúng chiều | TC_053 | P |
| REQ-BK-USER-55 | `sort` ngoài enum bị từ chối | TC_053 | P |
| REQ-BK-USER-56 | `sortBy` chỉ nhận `asc` hoặc `desc` | TC_053 | P |
| REQ-BK-USER-57 | `search` chuỗi thường khớp tên · email · điện thoại · địa chỉ, không phân biệt hoa thường | TC_054 | P |
| REQ-BK-USER-58 | `search` không có kết quả trả danh sách rỗng, không lỗi | TC_083 | P |
| REQ-BK-USER-59 | `search` JSON: một điều kiện với 5 toán tử | TC_084 | P |
| REQ-BK-USER-60 | `search` JSON: `AND` nhiều điều kiện là giao | TC_085 | P |
| REQ-BK-USER-61 | `search` JSON: `OR` là hợp | TC_085 | P |
| REQ-BK-USER-62 | `search` JSON: lọc theo `isActive` (boolean) | TC_086 | P |
| REQ-BK-USER-63 | `search` JSON: lọc theo ngày `createdAt` | TC_086 | P |
| REQ-BK-USER-64 | `search` JSON sai cú pháp được coi là chuỗi thường | TC_083 | P |
| REQ-BK-USER-65 | `search` JSON tham chiếu trường hoặc toán tử không tồn tại bị từ chối | TC_087 | P |
| REQ-BK-USER-66 | Chi tiết người dùng trả đủ 9 khoá | TC_067 · TC_069 | P |
| REQ-BK-USER-67 | Endpoint đọc công khai bỏ qua header `Authorization` | TC_067 | P |
| REQ-BK-USER-68 | `id` không tồn tại trả 404 | TC_068 | P |
| REQ-BK-USER-69 | Tạo người dùng thành công | TC_057 | P |
| REQ-BK-USER-70 | Người dùng vừa tạo đọc lại được với đúng dữ liệu | TC_057 | P |
| REQ-BK-USER-71 | Tạo người dùng khi không có header xác thực hợp lệ bị từ chối | TC_058 | P |
| REQ-BK-USER-72 | Tạo người dùng với token không hợp lệ bị từ chối | TC_058 | P |
| REQ-BK-USER-73 | Thiếu `name` bị từ chối | TC_060 | P |
| REQ-BK-USER-74 | `name` sai kiểu bị từ chối | TC_060 | P |
| REQ-BK-USER-75 | `name` rỗng bị từ chối | TC_092 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-USER-76 | `name` tối đa 191 ký tự | TC_091 | P |
| REQ-BK-USER-77 | Thiếu `email` bị từ chối với lỗi thiếu field | TC_061 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-USER-78 | `email` sai định dạng bị từ chối | TC_063 | P |
| REQ-BK-USER-79 | Thiếu `password` bị từ chối | TC_062 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-USER-80 | `password` rỗng không tạo được tài khoản | TC_093 | P |
| REQ-BK-USER-81 | `password` sai kiểu bị từ chối | TC_093 | P |
| REQ-BK-USER-82 | `isActive` mặc định là `true` | TC_094 | P |
| REQ-BK-USER-83 | Tạo người dùng với `isActive=false` cho người dùng Inactive | TC_094 | P |
| REQ-BK-USER-84 | `isActive` sai kiểu bị từ chối | TC_094 | P |
| REQ-BK-USER-85 | `phone` · `address` · `avatarUrl` là chuỗi tự do, lưu nguyên | TC_095 | P |
| REQ-BK-USER-86 | Tạo người dùng nhận đủ 3 content-type khai trong spec | TC_059 | P |
| REQ-BK-USER-87 | Body JSON sai cú pháp bị từ chối, body lỗi **không** phải JSON | TC_096 | P |
| REQ-BK-USER-88 | Trường ngoài schema bị bỏ qua | TC_065 | P |
| REQ-BK-USER-89 | Chuỗi tấn công và Unicode ở `name` lưu nguyên văn | TC_066 | P |
| REQ-BK-USER-90 | Không có token thì bị từ chối trước cả kiểm tra dữ liệu | TC_097 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-USER-91 | Cập nhật thành công khi gửi kèm `email` hiện tại | TC_070 | P |
| REQ-BK-USER-92 | Cập nhật một phần không cần gửi `email` | TC_071 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-USER-93 | Đổi email sang email mới | TC_098 | P |
| REQ-BK-USER-94 | Đổi sang email của người dùng khác bị từ chối | TC_098 | P |
| REQ-BK-USER-95 | Gửi lại email của chính mình khác hoa/thường được chấp nhận | TC_098 | P |
| REQ-BK-USER-96 | `email` sai định dạng bị từ chối | TC_077 | P |
| REQ-BK-USER-97 | Đổi mật khẩu: mật khẩu mới đăng nhập được | TC_099 | P |
| REQ-BK-USER-98 | Mật khẩu cũ bị từ chối sau khi đổi | TC_099 | P |
| REQ-BK-USER-99 | `isActive=false` khoá đăng nhập | TC_073 | P |
| REQ-BK-USER-100 | `isActive=true` mở lại đăng nhập | TC_073 | P |
| REQ-BK-USER-101 | `phone` · `address` · `avatarUrl` cập nhật được | TC_100 | P |
| REQ-BK-USER-102 | Sửa người dùng khi không có / sai token bị từ chối | TC_074 | P |
| REQ-BK-USER-103 | Sửa `id` không tồn tại trả 404 | TC_075 | P |
| REQ-BK-USER-104 | Người dùng đã đăng nhập sửa được người dùng khác | TC_076 | P |
| REQ-BK-USER-105 | Người dùng sửa được chính mình qua API | TC_101 | P |
| REQ-BK-USER-106 | Trường ngoài schema bị bỏ qua khi sửa | TC_102 | P |
| REQ-BK-USER-107 | Sửa người dùng nhận đủ 3 content-type | TC_103 | P |
| REQ-BK-USER-108 | `name` tối đa 191 ký tự khi sửa | TC_104 | P |
| REQ-BK-USER-109 | Sửa người dùng thu hồi refresh token cũ của họ | TC_105 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-USER-110 | Xoá người dùng thành công | TC_078 | P |
| REQ-BK-USER-111 | Xoá người dùng khi không có / sai token bị từ chối | TC_079 | P |
| REQ-BK-USER-112 | Xoá `id` không tồn tại, và xoá lần thứ hai, trả 404 | TC_080 | P |
| REQ-BK-USER-113 | Xoá người dùng xoá luôn refresh token của họ | TC_106 | P |
| REQ-BK-USER-114 | Người dùng đã đăng nhập xoá được người dùng khác | TC_081 | P |
| REQ-BK-USER-115 | Body lỗi kiểm tra dữ liệu có hình dạng `msg` + `fields` | TC_107 | P |
| REQ-BK-USER-116 | Bộ lọc `search` chỉ nhận 9 trường công khai của người dùng | TC_089 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-USER-117 | Body lỗi 400 của bộ lọc không lộ thông tin nội bộ | TC_088 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-USER-118 | `lengthData` bằng số phần tử thực trả về | TC_090 | Kỳ vọng chưa đạt · `@KnownBug` |
| REQ-BK-USER-119 | `limit` phải là số nguyên | TC_090 | Kỳ vọng chưa đạt · `@KnownBug` |

**Tổng:** 81/81 REQ có ≥ 1 TC ✅ · không REQ nào 🔴. TC gộp nhiều REQ — biến thể → REQ: `TC_055` (`a·b·e`→`47·51` · `c`→`47` · `d`→`49` · `f`→`52` · `g`→`53` · `h`→`48`) · `TC_053` (`a→d`→`54` · `e·f`→`54` · `g`→`54` · `h`→`55` · `i`→`56`) · `TC_057` (bước 2–3→`69·70` · bước 4→`35`) · `TC_058` (`a·b`→`71` · `c·d`→`72`) · `TC_060` (`a·b·c`→`73` · `d`→`74`) · `TC_093` (`a`→`80` · `b·c`→`81`) · `TC_094` (`a`→`82` · `b`→`83` · `c`→`84`) · `TC_098` (`a`→`93` · `b`→`94` · `c`→`95`) · `TC_099` (bước 2→`97` · bước 3→`98`) · `TC_073` (bước 1–3→`99` · bước 4–5→`100`) · `TC_083` (`a`→`58` · `b`→`64`) · `TC_085` (`a`→`60` · `b`→`61`) · `TC_086` (`a·b`→`62` · `c`→`63`) · `TC_090` (`a·b`→`118` · `c`→`119`) · `TC_052` (bước 1→`46` · bước 2→`50`).

### Bảng trạng thái — người dùng (mặt API)

| Từ \ Hành động | `POST` (Active mặc định) | `POST` `isActive:false` | `PATCH` `isActive:false` | `PATCH` `isActive:true` | `DELETE` |
|---|---|---|---|---|---|
| — (chưa có) | ✅ → Active · TC_057 · 094-a | ✅ → Inactive · TC_094-b | — | — | — |
| Active | — | — | ✅ → Inactive · TC_073 · 105-b | — | ✅ · TC_078 · 106 |
| Inactive | — | — | — | ✅ → Active · TC_073 | ✅ · TC_081 (`targetU2`) |

---

## Bảng Đối Soát Coverage (Mobile Android 40/40 REQ)

REQ dùng chung `Android · Web` có TC ở **cả hai** nền tảng — cột Web dẫn TC web hiện có.

| REQ ID | Mô tả ngắn | Mobile — TC IDs (số biến thể) | Loại case (Mobile) | Web — TC |
|---|---|---|---|---|
| REQ-BK-USER-02 | Bảng đủ cột (Android: cuộn ngang) | TC_109 (Bảng kiểm 5 mục) | UI | TC_001 |
| REQ-BK-USER-03 | Mặc định sắp Updated giảm dần | TC_110 | P | TC_010 |
| REQ-BK-USER-04 | Số dòng mặc định 5, 7 lựa chọn | TC_111 | UI | TC_005 |
| REQ-BK-USER-05 | Đổi số dòng tải lại trang 1 | TC_119 (2) | P | TC_016 |
| REQ-BK-USER-06 | Thanh phân trang | TC_112 | UI | TC_006 |
| REQ-BK-USER-07 | Số dòng về 5 khi quay lại | TC_120 | P | TC_017 |
| REQ-BK-USER-08 | Tìm kiếm theo từ khoá | TC_121 (4) | P · EP | TC_018 |
| REQ-BK-USER-09 | Không có kết quả | TC_122 · 146 (3) | N · Security | TC_019 |
| REQ-BK-USER-10 | Sắp xếp tăng / giảm theo cột | TC_123 | P | TC_020 |
| REQ-BK-USER-11 | Mở bảng lọc | TC_124 (Bảng kiểm 4 mục) | UI Behavior | TC_021 |
| REQ-BK-USER-12 | Field 7 lựa chọn | TC_126 | UI | TC_022 |
| REQ-BK-USER-13 | Operator 5 lựa chọn | TC_127 | UI | TC_023 |
| REQ-BK-USER-14 | Đổi Field reset Operator | TC_128 | Dependency | TC_024 |
| REQ-BK-USER-15 | Lọc tự áp dụng | TC_130 (3) | P · EP | TC_025 |
| REQ-BK-USER-16 | Add filter AND / OR | TC_131 | P | TC_026 |
| REQ-BK-USER-17 | Clear filter | TC_132 | P | TC_027 |
| REQ-BK-USER-18 | Icon cột mở lọc đúng cột | TC_133 (2) | P | TC_028 |
| REQ-BK-USER-20 | Đã đăng nhập có New user / ⋮ | TC_108 (Bảng kiểm 6 mục) | UI · Permission | TC_004 |
| REQ-BK-USER-21 | Nhãn `You` | TC_113 | UI | TC_029 |
| REQ-BK-USER-22 | Không sửa / xoá chính mình | TC_144 | N · Permission | TC_030 |
| REQ-BK-USER-23 | Mở được Edit / Delete người khác | TC_145 | Permission | TC_031 |
| REQ-BK-USER-24 | Hộp thoại Add user | TC_114 (Bảng kiểm 5 mục) | UI · Modal | TC_007 · 045 · 050 |
| REQ-BK-USER-25 | Active mặc định bật | TC_115 | UI | TC_008 |
| REQ-BK-USER-26 | Name bắt buộc | TC_134 | N | TC_032 |
| REQ-BK-USER-27 | Email bắt buộc | TC_135 | N | TC_033 |
| REQ-BK-USER-28 | Password bắt buộc | TC_136 | N | TC_034 |
| REQ-BK-USER-29 | Confirmation bắt buộc | TC_137 | N | TC_035 |
| REQ-BK-USER-30 | Name ≤ 191 (🟡) | TC_138 (2) · 139 (3) | **B** — 190 · **191** · **192** · 250 · 251 — `139` `@KnownBug` | TC_036 · 037 |
| REQ-BK-USER-31 | Email sai định dạng | TC_140 (4) | N · EP | TC_038 |
| REQ-BK-USER-36 | Update điền sẵn | TC_116 (Bảng kiểm 6 mục) | UI | TC_012 |
| REQ-BK-USER-41 | Xoá cần xác nhận · Cancel giữ nguyên | TC_117 | P · N (Cancel) | TC_014 · 044 |
| REQ-BK-USER-120 | Tab User từ My Profile / Setting về danh sách | TC_142 (2) | Kỳ vọng chưa đạt · `@KnownBug` | — (chỉ Android) |
| REQ-BK-USER-121 | Bảng cuộn ngang, ⋮ dính mép phải | TC_118 | UI Behavior | — |
| REQ-BK-USER-122 | Hàng lọc cuộn ngang tới Value · Add · Clear | TC_125 | UI Behavior | — |
| REQ-BK-USER-123 | Đổi Field xoá Value | TC_129 | Dependency | — |
| REQ-BK-USER-124 | Mở lại Add / Update user không mang lỗi cũ | TC_141 | Kỳ vọng chưa đạt · `@KnownBug` | — |
| REQ-BK-USER-125 | Mất mạng: `No Data`, không báo lỗi mạng | TC_147 | Reliability | — |
| REQ-BK-USER-126 | Add user giữ dữ liệu khi xuống nền | TC_148 | Reliability | — |
| REQ-BK-USER-127 | Bàn phím không che Email / Save | TC_149 | UI Stability | — |
| REQ-BK-USER-128 | Back hệ thống về màn hình trước | TC_143 | P | — |
| REQ-BK-USER-01 · 19 · 32 · 33 · 34 · 35 · 37 · 38 · 39 · 40 · 42 | Khách · tạo / sửa / khoá / xoá thành công · email trùng | — | ⚪ **Chưa khai Android** — REQ vẫn `Web` / `Web · API`, chưa kiểm được trên app (cần tester nhập mật khẩu / tạo tài khoản — [requirements mobile mục 2](../../../requirements/_book-api/user/mobile/requirements_user_mobile.md#2-bản-đồ-phủ-tài-liệu)). Không phải thiếu TC — sinh bổ sung khi `/generate-requirements-from-mobile user` lượt 2 chuyển lên `Android · Web` | TC web hiện có |

**Tổng Mobile:** 40/40 REQ có ≥ 1 TC ✅ · không REQ nào 🔴 · 3 TC `@KnownBug` (`139` · `141` · `142`). Phép thử 6b trên file Mobile: không TC nào gánh ≥ 2 REQ ✅.

### Bảng trạng thái — người dùng (mặt Android)

➖ Không sinh — chuyển trạng thái (tạo · khoá · mở · xoá) chưa khai Android. Chỉ phủ các **chuyển bị chặn**: dòng `You` → Edit / Delete khoá (TC_144).

---

## Bảng Đối Soát Evidence

Đã mở **17/17** ảnh ở [`requirements/_book-api/user/web/evidence/`](../../../requirements/_book-api/user/web/evidence/).

| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| `web_user_list_guest_viewport.png` | Khách xem danh sách | TC_001 · 002 · 003 | ✅ (dòng người khác đã làm mờ) |
| `web_user_pagesize_open_viewport.png` | Ô số dòng mở — 7 lựa chọn | TC_005 | ✅ |
| `web_user_search_result_viewport.png` | Tìm theo email — 1 kết quả | TC_018-a | ✅ |
| `web_user_search_no_data_viewport.png` | `No Data` | TC_019 | 🟡 Ảnh cắt trước chữ `No Data` — chữ đọc bằng DOM |
| `web_user_filter_field_open_viewport.png` | Bảng lọc mở, danh sách Field | TC_021 · 022 | ✅ |
| `web_user_filter_email_contains_viewport.png` | Email · Contains | TC_025-a · 024 | ✅ |
| `web_user_filter_two_conditions_viewport.png` | 2 điều kiện, ô nối `AND` | TC_026-a | ✅ |
| `web_user_row_menu_self_disabled_viewport.png` | Dòng `You` — Edit/Delete mờ | TC_029 · 030 | ✅ |
| `web_user_row_menu_other_enabled_viewport.png` | Dòng người khác — Edit/Delete sáng | TC_004 · 031 | ✅ |
| `web_user_add_dialog_default_viewport.png` | Add user mặc định | TC_007 · 008 | 🟡 Ô `Address` bị cắt ở đáy hộp thoại — trạng thái mờ đọc bằng DOM |
| `web_user_add_empty_submit_viewport.png` | Save trống — 4 lỗi | TC_032 → 035 | ✅ |
| `web_user_add_email_exists_viewport.png` | Email trùng | TC_040 | ✅ |
| `web_user_add_success_toast_viewport.png` | `Created successfully.` | TC_009 · 010 | ✅ |
| `web_user_update_dialog_default_viewport.png` | Update user điền sẵn | TC_012 | ✅ |
| `web_user_update_success_toast_viewport.png` | `Updated successfully.` + `Inactive` | TC_013 · 042 | ✅ |
| `web_user_inactive_login_blocked_viewport.png` | Sign in tài khoản Inactive | TC_047 (bước 4) · `BK_AUTH_TC_134` | ✅ |
| `web_user_delete_confirm_viewport.png` | `Confirm delete` | TC_014 | ✅ |
| *(đọc DOM / network, không ảnh)* | Page size 10 · phân trang · sort · Operator · Clear filter · Name 250/251 · email sai · mật khẩu trống khi Update · Active lại · xoá | TC_006 · 016-a · 017 · 020-a · 023 · 027 · 036 · 037-a · 038-a · 039 · 041 · 043 · 015 | ✅ theo số liệu ghi trong AC |

### Vùng chưa có evidence — TC / biến thể gắn `@NeedsVerify`

| TC | Phần chưa có evidence | Đề xuất recon bổ sung |
|---|---|---|
| TC_016-b · 020-b · 028-b | Page size 100 · sắp cột Created · icon lọc cột Address | 1 ảnh / trạng thái |
| TC_018 `b` `c` · 025 `b` `c` · 026-b | Tìm theo tên / SĐT · lọc Equals / Starts with · nối `OR` | Chốt `ASM-BK-USER-01` |
| TC_023 | Danh sách Operator mở | 1 ảnh |
| TC_037 `a` `b` · 038 `b` `c` | Cách web hiển thị lỗi khi Name 192 – 250 ký tự bị server từ chối · email sai dạng khác | 1 ảnh / biến thể |
| TC_045 `b` `c` · 046 · 047 · 048 · 050 | Esc / bấm ngoài · Save 2 lần · tạo Inactive · chuỗi tấn công · Tab | Chốt `ASM-BK-USER-02` · `03` |

### Bảng Đối Soát Evidence — Mobile (Android)

Đã mở **23/23** ảnh ở [`requirements/_book-api/user/mobile/evidence/`](../../../requirements/_book-api/user/mobile/evidence/) — dòng của người dùng khác đã được làm mờ sẵn trong ảnh.

| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| `android_user_list_hscroll_end.png` | Đã vuốt tới `Created` · `Updated`, ⋮ mép phải | TC_108 · 109 (mục `5`) · 110 · 112 · 118 | ✅ |
| `android_user_search_self_you.png` | Tìm email tài khoản test — dòng `You` | TC_113 · 121-a | ✅ |
| `android_user_row_menu_self_disabled.png` | ⋮ dòng `You` — Edit / Delete mờ | TC_144 | ✅ |
| `android_user_row_menu_other_enabled.png` | ⋮ dòng người khác — Edit đen, Delete đỏ | TC_145 · 108 (mục `4`) | ✅ |
| `android_user_pagesize_open.png` | Ô số dòng mở — 7 lựa chọn | TC_111 · 119-a | ✅ |
| `android_user_search_no_data.png` | `No Data`, không nút số trang | TC_122 · (hình mẫu cho 146) | ✅ |
| `android_user_filter_open.png` | Bảng lọc mở — Value lộ mép phải | TC_124 | ✅ |
| `android_user_filter_hscroll.png` | Đã vuốt — Value · Add filter · Clear filter | TC_125 · 132 | ✅ |
| `android_user_filter_field_open.png` | Danh sách Field mở | TC_126 | ✅ |
| `android_user_filter_email_contains.png` | Email · Contains · 1 dòng | TC_130-a · 129 (bước 3) | ✅ |
| `android_user_filter_two_conditions.png` | 2 điều kiện, ô nối mở `AND` / `OR` | TC_131 | ✅ |
| `android_user_add_dialog_default_part1.png` · `…_part2.png` | Add user mặc định (2 phần) | TC_114 · 115 | ✅ |
| `android_user_add_empty_submit.png` | Save trống — 4 lỗi | TC_134 → 137 | 🟡 Chỉ trạng thái **trống cả 4** — ca trống **từng** ô suy từ cùng ảnh (như `BK_AUTH_TC_032` → `035`) |
| `android_user_add_invalid_fields.png` | Name 251 · Email sai | TC_139-c · 140-a · 141 (bước 2) | ✅ |
| `android_user_add_reopen_stale_errors.png` | Mở lại sau Cancel — lỗi cũ còn | TC_141 (hiện trạng bước 5) | ✅ |
| `android_user_update_stale_errors.png` | Update user báo đỏ dữ liệu hợp lệ | TC_141 (hiện trạng bước 8) | ✅ |
| `android_user_update_dialog_default_part1.png` · `…_part2.png` | Update user điền sẵn | TC_116 · 145 | ✅ |
| `android_user_delete_confirm.png` | `Confirm delete` | TC_117 | ✅ |
| `android_user_add_keyboard_open.png` | Bàn phím mở ở ô Email | TC_149 | ✅ |
| `android_user_list_offline.png` | Mất mạng — vùng trạng thái rỗng | TC_147 | 🟡 Chỉ thấy chữ `No` (khung lệch do bảng cuộn ngang) — `ASM-BK-USER-09` |
| `android_profile_tab_user_stays.png` | Bấm tab User khi ở My Profile — vẫn hồ sơ | TC_142-a | ✅ |
| *(đọc thuộc tính, không ảnh — số liệu ghi trong AC)* | Đổi số dòng · số dòng về 5 · sort Name · Operator · reset Operator · xoá Value · Clear filter · icon cột Phone · biên Name 192 · xuống nền · Back | TC_119-a · 120 · 123 · 127 · 128 · 129 · 132 · 133-a · 139-a · 148 · 143 | ✅ theo số liệu trong AC |

**Vùng chưa có evidence (Mobile) — gắn `@NeedsVerify`:** TC_109 mục `4` (ô `Active`) · 119-b (100 dòng) · 121 `c` `d` (tìm theo tên / SĐT) · 127 (nhãn Operator) · 130 `b` `c` · 133-b · 140 `b` `c` `d` · 142-b (Setting account) · 146 (chuỗi tấn công). Đề xuất recon bổ sung: 1 ảnh / trạng thái, cùng góc chụp với ảnh gốc.

---

## Đối soát loại kiểm thử (4 vòng)

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_001 · 005 · 006 · 007 · 008 · 012 (6 TC · 8 mục Bảng kiểm) — nhãn nguyên văn, thứ tự cột / ô, trạng thái mặc định (page size `5`, Active bật, mật khẩu trống ở Update) |
| 1 | Open form | ✅ | TC_007 (Add user) · 012 (Update user) · 014 (Confirm delete) · đóng bằng Cancel / Esc / bấm ngoài: TC_045 (3 biến thể) |
| 1 | Display | ✅ | TC_001 (badge Active/Inactive, ngày `dd ThMM yyyy` + giờ AM/PM) · 002 · 019 (trạng thái rỗng `No Data`) |
| 1 | Input valid data | ✅ | TC_009 (Name + Phone + Email + mật khẩu) · Setup `TK-U` (đủ mọi ô, có địa chỉ) |
| 1 | Save | ✅ | TC_009 · 013 · 015 — thông báo đúng + hộp thoại đóng |
| 1 | Verify data | ✅ | TC_009 bước 5 · 010 · 013 bước 4 · 011 (đăng nhập bằng dữ liệu vừa lưu) |
| 2 | UI Behavior | ✅ | TC_021 · 024 · 027 · 028 (4 TC · 5 biến thể) — bảng lọc thay chỗ ô tìm kiếm, reset Operator |
| 2 | Required | ✅ | TC_032 · 033 · 034 · 035 (4 TC — từng ô) |
| 2 | Validation | ✅ | TC_036 → 040 (5 TC · 10 biến thể) — đối soát theo bảng 15 loại ở mục con bên dưới |
| 2 | Equivalence Partitioning | ✅ | TC_018 (lớp từ khoá: email · tên · SĐT) · 025 (lớp Operator) · 038 (lớp email sai) |
| 2 | Boundary Value Analysis | ✅ | TC_036 · 037 (2 TC · 5 biến thể) — `190` · **`191`** · **`192`** · `250` · `251` (biên 191/192 theo `REQ-30` 🟡) |
| 2 | Business Rule | ✅ | Email duy nhất TC_040 · không tự sửa/xoá TC_030 · mật khẩu trống giữ nguyên TC_041 |
| 2 | Decision Table | ✅ | TC_026 — 2 điều kiện × `AND`/`OR` (dưới ngưỡng 3 điều kiện; ghi để truy vết) |
| 2 | State Transition | ✅ | Bảng trạng thái ở mục Coverage — 6 chuyển hợp lệ + 3 chuyển bị chặn (dòng `You`) |
| 2 | Dependency | ✅ | TC_024 (Field → Operator) · Division → Ward → Address trong Add user: ➖ đã phủ ở `BK_AUTH_TC_160` → `164` (cùng thành phần, REQ-BK-AUTH-76 → 80) |
| 2 | Use Case / Scenario | ✅ | TC_049 — tạo → tìm → sửa → khoá → mở → xoá |
| 2 | Save / Edit / Delete | ✅ | TC_009 · 013 · 041 · 015 · 044 (huỷ xoá) · 045 (huỷ tạo) |
| 2 | Error Guessing | ✅ | TC_046 (Save 2 lần) · 040 (trùng email giữ dữ liệu) |
| 3 | Permission | ✅ | TC_003 · 004 · 030 · 031 — đủ **11/11** ô *đã kiểm chứng* của ma trận Web. Cột *Vai trò khác*: ➖ không có vai trò (`AMB-BK-01` ✅) |
| 3 | Security | ✅ | TC_003 (khách không có nút ghi) · 030 · 031 · 034 · 041 · 048 (XSS / SQLi ở Name) · dữ liệu cá nhân công khai: PO chốt là cố ý (`AMB-BK-02`) — TC_002 xác nhận hành vi |
| 3 | API | ✅ (25-09-2026) | Mặt API có **57 TC** ở [`api/parts/`](api/parts/) — 5 endpoint, phủ **81/81** REQ. Gồm: auth 401 (`058` · `074` · `079`) · BOLA F-02 (`076` · `081`) · mật khẩu mặc định F-07 (`062` `@KnownBug`) · PATCH một phần F-27 (`071` `@KnownBug`) · PII công khai F-01 (`051` · `056` · `069`) · bộ lọc JSON (`084` → `089`) · biên phân trang / sort (`053` · `055`) · Mass Assignment (`065` · `102`) · thu hồi refresh token (`105` `@KnownBug` · `106`) |
| 3 | Database | ➖ | QA **không** có quyền truy vấn CSDL (user chốt 20-09-2026) — đội Dev xác minh xoá mềm / cứng |
| 3 | Integration | ➖ | Không có tích hợp bên thứ ba — Division / Ward lấy từ module `ADDR` cùng hệ thống |
| 3 | Logging / Audit | ➖ | Requirements không có yêu cầu nhật ký thao tác cho `USER` |
| 4 | Compatibility | ⏭️ Cố ý bỏ | Chỉ Chrome desktop — requirements khảo sát đúng 1 trình duyệt. **Quyết định:** phạm vi khảo sát 25-09-2026 — cần QA lead chốt danh sách trình duyệt. **Rà lại khi:** có cam kết đa trình duyệt |
| 4 | Responsive / UI Stability | ⏭️ Cố ý bỏ | Chỉ khảo sát viewport `1600×750`; bảng 6 cột chưa kiểm ở màn hẹp. **Quyết định:** như trên. **Rà lại khi:** chốt danh sách breakpoint |
| 4 | Accessibility | ✅ | TC_050 (Tab trong Add user). Nhãn truy cập của nút ⋮ / icon lọc: ➖ không có REQ (ghi chú automation — nút không nhãn) |
| 4 | Performance | ➖ | Không có ngưỡng thời gian cam kết — đội hiệu năng (chưa phân công) |
| 4 | Regression | ➖ | `docs/bugs/_book-api/` chưa có bug nào được đóng |
| 4 | E2E | ✅ | TC_011 · 043 (User → đăng nhập — xuyên `AUTH`) · 042 ↔ `BK_AUTH_TC_134` (khoá → không đăng nhập được) |

### Đối soát Validation theo bảng 15 loại field (hộp thoại Add user)

| Ô | Loại | Mục của bảng | Kết quả |
|---|---|---|---|
| Name | Text | Bắt buộc ✅ 032 · Max length ✅ 036 · 037 · Ký tự đặc biệt / XSS / SQLi ✅ 048 · Min length ➖ không có REQ · Chỉ khoảng trắng · Unicode / Emoji · khoảng trắng đầu/cuối ⏭️ đã phủ ở Sign up (`BK_AUTH_TC_148` · `170`, cùng thành phần) | 4/8 mục ở module này, 3 ⏭️ dẫn chứng, 1 ➖ |
| Email | Email | Bắt buộc ✅ 033 · Định dạng sai ✅ 038 (3) · Đã tồn tại ✅ 040 · Hoa thường ⏭️ phủ ở `BK_AUTH_TC_158` (cùng quy tắc máy chủ) · Max length ➖ không có REQ | 3 ✅ · 1 ⏭️ · 1 ➖ |
| Password · Confirmation | Password | Bắt buộc ✅ 034 · 035 · Khớp ✅ 039 · Trống khi Update giữ nguyên ✅ 041 · Độ dài / độ phức tạp ➖ **không có chính sách** (`AMB-BK-AUTH-08` ✅) | 4 mục áp dụng ✅ |
| Phone | Phone | Tuỳ chọn ✅ 009 · Định dạng ➖ không có quy tắc (`AMB-BK-AUTH-15` ✅) | 1 ✅ |
| Active for login | Checkbox | Mặc định ✅ 008 · Bật / tắt ✅ 042 · 043 · 047 | 3/3 |
| Upload photo | File Upload | ⚪ Ngoài phạm vi — `AMB-BK-USER-05` ✅ (khảo sát cùng module `FILE`) | — |

### Đối soát loại kiểm thử (4 vòng) — mặt Mobile (Android)

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_108 · 109 · 111 · 112 · 114 · 115 · 116 (7 TC · 22 mục Bảng kiểm; thêm 4 mục ở TC_124 thuộc V2) — nhãn nguyên văn, thứ tự cột / ô, trạng thái mặc định (số dòng `5`, Active bật, Ward / Address khoá, mật khẩu trống ở Update) |
| 1 | Open form | ✅ | TC_114 (Add user) · 116 (Update user) · 117 (Confirm delete) — đóng bằng `Cancel`. Đóng bằng Back hệ thống / chạm ngoài: ➖ chưa có REQ Android |
| 1 | Display | ✅ | TC_109 (ngày `dd ThMM yyyy` + giờ AM/PM) · 110 · 113 (nhãn `You`) · 122 (trạng thái rỗng `No Data`) |
| 1 | Input valid data | ⏭️ Cố ý bỏ | Nhập đủ bộ hợp lệ rồi lưu chưa khai Android (REQ-34 chỉ Web). Một phần có ở TC_148 (nhập Name, không lưu). **Quyết định:** phạm vi REQ `/generate-requirements-from-mobile` 26-09-2026 — agent không nhập mật khẩu trên hệ thống thật. **Rà lại khi:** tester chạy REQ ❔ và REQ-34 · 37 · 42 chuyển lên `Android · Web` |
| 1 | Save | ⏭️ Cố ý bỏ | Như trên — tạo / sửa / xoá thành công (REQ-34 · 37 · 42) chưa khai Android. **Rà lại khi:** như trên. ⚠️ Save Profile và Create book đều **thất bại** trên Android — nguy cơ Add / Update user cũng lỗi |
| 1 | Verify data | ⏭️ Cố ý bỏ | Như trên |
| 2 | UI Behavior | ✅ | TC_118 · 124 · 125 · 131 · 132 (5 TC) — bảng / hàng lọc cuộn ngang, bảng lọc thay chỗ ô tìm kiếm |
| 2 | Required | ✅ | TC_134 · 135 · 136 · 137 (4 TC — từng ô) |
| 2 | Validation | ✅ | TC_138 · 139 · 140 (3 TC · 9 biến thể) + Required — đối soát theo bảng 15 loại ở mục con bên dưới |
| 2 | Equivalence Partitioning | ✅ | TC_121 (lớp từ khoá: email đủ · một phần email · tên · SĐT) · 130 (lớp Operator) · 140 (lớp email sai) |
| 2 | Boundary Value Analysis | ✅ | TC_138 · 139 (2 TC · 5 biến thể) — `190` · **`191`** · **`192`** · `250` · `251` |
| 2 | Business Rule | ✅ | Không tự sửa / xoá TC_144 · Password bắt buộc trên app TC_136 · số dòng về 5 TC_120 |
| 2 | Decision Table | ➖ | Không có ≥ 3 điều kiện kết hợp — bộ lọc 2 điều kiện × `AND`/`OR` chỉ kiểm giao diện ô nối (TC_131) |
| 2 | State Transition | ➖ | Chuyển Active / Inactive / xoá chưa khai Android — chỉ có chuyển bị chặn ở dòng `You` (TC_144) |
| 2 | Dependency | ✅ | TC_128 (Field → Operator) · 129 (Field → Value) · 114 bước 4–5 (Division trống → Ward / Address khoá) |
| 2 | Use Case / Scenario | ⏭️ Cố ý bỏ | Chuỗi tạo → sửa → khoá → xoá cần lưu thành công — chưa khai Android. **Rà lại khi:** như nhánh Save |
| 2 | Save / Edit / Delete | ⏭️ Cố ý bỏ | Chỉ có nhánh **huỷ**: TC_116 (Cancel Update) · 117 (Cancel xoá). Lưu / xoá thật: như nhánh Save |
| 2 | Error Guessing | ✅ | TC_141 (mở lại hộp thoại sau lỗi — `@KnownBug`) · 142 (tab khi đang ở hồ sơ — `@KnownBug`) · 143 (Back hệ thống) · 148 (xuống nền giữa chừng) |
| 3 | Permission | ✅ | TC_108 · 144 · 145 — đủ **4/4** ô *đã kiểm chứng* của ma trận Android. Cột *Khách*: ⏭️ lượt khảo sát chỉ có phiên đăng nhập (REQ-19 chưa khai Android) — rà lại khi recon lượt 2. *Vai trò khác*: ➖ không có vai trò (`AMB-BK-01` ✅) |
| 3 | Security | ✅ | TC_144 (không tự sửa / xoá) · 145 (quyền sửa người khác là thiết kế) · 146 (chuỗi tấn công ở ô tìm kiếm) · 136 (mật khẩu bắt buộc) |
| 3 | API | ✅ (mặt API riêng) | Không kiểm lại qua app — mặt API có 57 TC (`051` → `107`) |
| 3 | Database | ➖ | QA **không** có quyền truy vấn CSDL (user chốt 20-09-2026) — đội Dev xác minh |
| 3 | Integration | ➖ | Không có tích hợp bên thứ ba ở màn hình User |
| 3 | Logging / Audit | ➖ | Requirements không có yêu cầu nhật ký thao tác cho `USER` |
| 4 | Compatibility | ⏭️ Cố ý bỏ | Chỉ 1 thiết bị chuẩn (emulator Android 17) — iOS chưa khảo sát. **Quyết định:** phạm vi khảo sát 26-09-2026 — cần QA lead chốt danh sách máy. **Rà lại khi:** có máy thật / bản build iOS |
| 4 | Responsive / UI Stability | ✅ / ⏭️ | TC_118 · 125 (màn hẹp — cuộn ngang) · 149 (bàn phím không che). Xoay ngang ở tab User: ⏭️ chưa thử lúc khảo sát (đã có ở tab Book — `BK_BOOK_TC_180`). **Rà lại khi:** recon lượt 2 |
| 4 | Accessibility | ⏭️ Cố ý bỏ | Chưa có REQ trợ năng; đã biết nút ⋮ và icon lọc **không có nhãn** (`RISK-BK-USER-09`) → TalkBack không đọc được. **Quyết định:** cần QA lead / PO xác nhận. **Rà lại khi:** dev thêm nhãn truy cập |
| 4 | Performance | ➖ | Không có ngưỡng thời gian cam kết — đội hiệu năng (chưa phân công) |
| 4 | Regression | ➖ | `docs/bugs/_book-api/` chưa có bug nào được đóng |
| 4 | E2E | ✅ / ⏭️ | TC_142 (hồ sơ `AUTH` ↔ tab User) · 143 (Dashboard ↔ User). Khoá tài khoản → không đăng nhập được: ⏭️ cần Update thành công (chưa khai Android) |
| — | Đặc thù mobile (mất mạng · vòng đời · bàn phím) | ✅ | TC_147 · 148 · 149. Quyền runtime · deep link · push: ➖ app không có ([requirements mobile mục 6](../../../requirements/_book-api/user/mobile/requirements_user_mobile.md#6-yêu-cầu-riêng-của-mobile-skill-353)) |

#### Đối soát Validation theo bảng 15 loại field — Add user (Android)

| Ô | Loại | Mục của bảng | Kết quả |
|---|---|---|---|
| Name | Text | Bắt buộc ✅ 134 · Max length ✅ 138 · 139 · XSS / SQLi · chỉ khoảng trắng · khoảng trắng đầu/cuối ⏭️ cần **lưu thành công** mới kiểm được hiển thị (chưa khai Android — web: `BK_USER_TC_048`) · Unicode / emoji / ký tự đặc biệt ⏭️ phủ ở `BK_AUTH_TC_039` (Sign up Android, cùng thành phần Name) · Min length ➖ không có REQ | 2 ✅ · 4 ⏭️ có dẫn chứng · 1 ➖ |
| Email | Email | Bắt buộc ✅ 135 · Định dạng sai ✅ 140 (4) · Đã tồn tại ⏭️ REQ-33 chưa khai Android · Hoa thường ⏭️ phủ ở `BK_AUTH_TC_042` · Max length ➖ không có REQ | 2 ✅ · 2 ⏭️ · 1 ➖ |
| Password · Confirmation | Password | Bắt buộc ✅ 136 · 137 · Khớp ⏭️ REQ-32 chưa khai Android · Hiện / ẩn mật khẩu ⏭️ phủ ở `BK_AUTH_TC_012` (cùng thành phần) · Độ dài / độ phức tạp ➖ **không có chính sách** (`AMB-BK-AUTH-08` ✅) | 2 ✅ |
| Division · Ward · Address | Dropdown | Khoá phụ thuộc ✅ 114 · Danh sách · lọc · đổi / xoá Division ⏭️ phủ ở `BK_AUTH_TC_047` → `050` (Sign up Android, cùng thành phần địa chỉ) | 1 ✅ |
| Active for login | Checkbox | Mặc định ✅ 115 · Bật / tắt tạo tác dụng ⏭️ cần lưu thành công | 1 ✅ |
| Search user · Value | Text (tìm kiếm) | Khớp ✅ 121 · 130 · Không kết quả ✅ 122 · Ký tự đặc biệt / XSS / SQLi / emoji ✅ 146 | 3 ✅ |
| Upload photo | File Upload | ⚪ Ngoài phạm vi — `AMB-BK-USER-05` ✅ | — |

---

## Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)

| Đặc tính | Trạng thái | TC ID / Lý do |
|---|---|---|
| Functional Suitability | ✅ Có TC | TC_001 → TC_049 |
| Performance Efficiency | ➖ Ngoài phạm vi | Không có ngưỡng cam kết, danh sách ≈ 2.700 dòng chưa đo — đội hiệu năng (chưa phân công) |
| Compatibility | ➖ Ngoài phạm vi | Chỉ Chrome desktop — QA lead chốt danh sách trình duyệt |
| Interaction Capability | ✅ Có TC | TC_019 (trạng thái rỗng) · 030 (chặn tự xoá) · 040 (lỗi giữ dữ liệu) · 050 (bàn phím) |
| Reliability | ✅ Có TC (một phần) | TC_046 (Save 2 lần) · 017 (trạng thái sau điều hướng). Mất mạng khi Save: ➖ chưa có REQ — QA lead |
| Security | ✅ Có TC | TC_003 · 030 · 031 · 034 · 041 · 048. Pentest / BOLA mặt API: ➖ chờ REQ API — QA lead phân công |
| Maintainability | ➖ Không áp dụng | Đặc tính của mã nguồn |
| Flexibility | ➖ Ngoài phạm vi | Responsive / đổi ngôn ngữ chưa khảo sát — QA lead |
| Safety | ➖ Không áp dụng | Ứng dụng quản lý sách — có xác nhận trước khi xoá (TC_014), không gây thiệt hại vật lý |

**Mặt Mobile (Android) — chấm bổ sung 26-09-2026:**

| Đặc tính | Trạng thái | TC ID / Lý do |
|---|---|---|
| Functional Suitability | ✅ Có TC | TC_108 → TC_145 |
| Performance Efficiency | ➖ Ngoài phạm vi | Không có ngưỡng cam kết — đội hiệu năng (chưa phân công) |
| Compatibility | ➖ Ngoài phạm vi | 1 emulator Android 17; iOS chưa khảo sát — QA lead chốt danh sách máy |
| Interaction Capability | ✅ Có TC | TC_122 (trạng thái rỗng) · 144 (chặn tự xoá) · 125 (phải vuốt mới thấy Value — PO chấp nhận) · 149 (bàn phím không che) · 141 (lỗi dính — `@KnownBug`) |
| Reliability | ✅ Có TC | TC_147 (mất mạng) · 148 (xuống nền giữ dữ liệu) |
| Security | ✅ Có TC | TC_144 · 145 · 146 · 136 |
| Maintainability | ➖ Không áp dụng | Đặc tính của mã nguồn |
| Flexibility | ✅ / ➖ | Màn hẹp — cuộn ngang TC_118 · 125. Xoay ngang tab User: ➖ chưa khảo sát — QA lead (đã có ở `BK_BOOK_TC_180`) |
| Safety | ➖ Không áp dụng | Có xác nhận trước khi xoá (TC_117) |

---

## Đối soát cột Automation

| Nền tảng | Yes | Partial | No | ⏸️ Hoãn |
|---|---|---|---|---|
| Web | 49 | 1 | 0 | 14 (`@NeedsVerify` — nằm trong Yes / Partial) |
| API | 57 | 0 | 0 | 0 — mọi TC đã gọi thật; 9 TC `@KnownBug` chạy được, **dự kiến FAIL** |
| Mobile (Android) | 41 | 1 | 0 | 9 (`@NeedsVerify` — nằm trong Yes) · 3 TC `@KnownBug` vẫn automate — test FAIL là thứ phơi bug |

### Điều kiện cần chuẩn bị

| # | Điều kiện | Ai cấp | Trạng thái | TC phụ thuộc |
|---|---|---|---|---|
| 1 | Gọi API để dọn `TK-U` bằng token của chính nó | QA | ✅ Đã có (năng lực QA 19-09-2026) | Teardown |
| 3 | Danh sách trường **nội bộ** và danh sách từ khoá "lộ thông tin nội bộ" (`ASM-BK-USER-05` · `06`) | Dev | ⏳ Chưa có | TC_088 · 089 |
| 2 | Định danh ổn định cho nút ⋮ và icon lọc (hiện không có nhãn truy cập) | Dev | ⏳ Chưa có — tạm bắt theo quan hệ với tên / email trong dòng | TC_004 · 012 → 015 · 021 · 028 → 031 · 041 → 044 · 049 · Mobile: 116 · 117 · 124 · 133 · 141 · 144 · 145 |
| 4 | Mobile: Appium + UiAutomator2 trên emulator chuẩn · tài khoản `TK-M` · `U-M2` tạo bằng API trong `setUp` · khởi động lại app trước mỗi TC mở hộp thoại (`M1r` — REQ-124) · tắt / bật mạng bằng `mobile: setConnectivity` | QA | ✅ Đã có (appium-mcp dùng ở lượt khảo sát 26-09-2026) | TC_108 → 149 |

### TC Partial · No · Hoãn

| TC ID | Automation | Trục chặn | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|
| BK_USER_TC_046 | Partial | 2 · Chạy lại có cùng kết quả | Hai lần bấm dưới 1 giây phụ thuộc tốc độ công cụ — automation assert **số dòng** sau cùng; lần tái hiện đầu kiểm tay · ⏸️ Hoãn — `@NeedsVerify` |
| BK_USER_TC_016 · 018 · 020 · 023 · 025 · 026 · 028 · 037 · 038 · 045 · 047 · 048 · 050 | Yes · ⏸️ Hoãn | — | `@NeedsVerify` — biến thể đã có evidence automate ngay |
| BK_USER_TC_115 | Partial | 1 · Expected cốt lõi chỉ đọc được bằng mắt | Công tắc `Active for login`: thuộc tính `checked` luôn `false` trên Appium (`RISK-BK-USER-09`) → so ảnh vùng công tắc trên **một** emulator cố định; hoặc chờ Add user lưu được trên Android để chấm qua nhãn `Active` ở dòng mới |
| BK_USER_TC_109 · 119 · 121 · 127 · 130 · 133 · 140 · 142 · 146 | Yes · ⏸️ Hoãn | — | `@NeedsVerify` (Mobile) — biến thể đã có evidence automate ngay |

**Thứ tự ưu tiên automate:** `@Smoke` (TC_001 → 015) → TC nhiều biến thể ở Validation / BVA (TC_036 → 038) → bộ lọc (TC_021 → 028) → phần còn lại.

---

## Bộ chạy đề xuất

| Bộ | TC | Thời gian ước tính | Ghi chú |
|---|---|---|---|
| **Smoke** (V1) | TC_001 → 015 (theo *Thứ tự chạy*) | ~25 phút | Fail ở đây → dừng |
| **Smoke API** | TC_051 · 057 · 070 · 078 | ~3 phút | `@Smoke` mặt API |
| API đầy đủ | TC_051 → 107 | ~15 phút | Teardown bắt buộc; `@KnownBug` dự kiến FAIL |
| API `@KnownBug` | TC_061 · 062 · 071 · 088 · 089 · 090 · 092 · 097 · 105 | ~2 phút | Chạy riêng để tách khỏi kết quả hồi quy |
| Regression đầy đủ | TC_001 → 050 | ~2 giờ | Kết thúc bằng teardown |
| Bảo mật | TC_003 · 030 · 031 · 034 · 041 · 048 | ~15 phút | `@Security` |
| `@TechCheck` | TC_009 · 018 | — | Phần 🔧 cần DevTools → Network |
| **Smoke Mobile** (V1 Android) | TC_108 → 117 | ~20 phút | Tắt / mở app trước TC_114 · 115 · 116 |
| Regression Mobile | TC_108 → 149 | ~1 giờ 15 phút | Teardown xoá `U-M2` · `TK-M` bằng API |
| Mobile `@KnownBug` | TC_139 · 141 · 142 | ~8 phút | Chạy riêng — dự kiến FAIL |

---

## Nhật ký thay đổi

| Ngày | Thay đổi | Mốc git |
|---|---|---|
| 26-09-2026 | `/generate-testcases-from-requirements` Mode QUICK chế độ **BỔ SUNG** — thêm mặt **Mobile (Android)**: **42 TC · 58 biến thể · 26 mục Bảng kiểm** (`BK_USER_TC_108` → `149`, 1 file `mobile/test_cases_user_mobile.md`), độ hạt GỘP giữ theo bộ đang có, rủi ro Cao → Đầy đủ. Phủ **40/40** REQ khai Android (31 `Android · Web` + 9 chỉ Android). Đã mở 23/23 ảnh evidence Android — không xung đột tài liệu ↔ ảnh. 3 TC `@KnownBug` (`139` · `141` · `142`) · 9 `@NeedsVerify` · 7 `@TechCheck`. Thêm `ASM-BK-USER-07` → `11`, trạng thái `M1` / `M1r`, tài khoản `TK-M` · `U-M2`. **Không** chạm TC Web / API | `1c4898d` (trước khi ghi) |
| 25-09-2026 | **Chỉnh bộ TC API theo REQ mặt API** (`/generate-requirements-from-api user` + `DEMO-AMB-2509B`): 31 → **57 TC** (`BK_USER_TC_051` → `107`; thêm `082` → `107` = 26 TC), tách `api/test_cases_user_api.md` thành **3 part** ở `api/parts/` (> 40 TC). Neo **1:1** REQ API — bỏ mọi dòng `⚠️ Chưa có REQ`. Phủ **81/81** REQ. Thêm 9 TC / chuyển 4 TC sang `@KnownBug`: `061` · `062` · `071` · `088` · `089` · `090` · `092` · `097` · `105`. Bỏ `@NeedsVerify` ở các biến thể đã gọi thật. `066` bỏ biến thể name 10.000 ký tự (→ `091`, server trả **400**, không phải 201/422). **Web:** `TC_036` · `037` đổi biên **250/251 → 191/192** theo `REQ-BK-USER-30` 🟡 (`037` `@KnownBug`) | `b30eb57` (trước khi sửa) |
| 25-09-2026 | `/generate-testcases-api user` — thêm mặt **API**: **31 TC** (`BK_USER_TC_051` → `081`, 1 file `api/`), độ hạt GỘP. Kiểm chứng ~30 request thật (dữ liệu tự tạo + dọn sạch). Neo tạm REQ Web (18 REQ) · 12 TC `⚠️ Chưa có REQ`. Phát hiện mới F-26 · F-27 (ghi `api_map.md`). @KnownBug: `062` (mật khẩu mặc định F-07) · `071` (PATCH thiếu email F-27). Module `USER` **81 TC** | `b30eb57` (trước khi tạo) |
| 25-09-2026 | Khởi tạo bộ TC **Web** bằng `/generate-testcases-from-requirements` Mode QUICK, độ hạt GỘP, rủi ro Cao → Đầy đủ. **50 TC · 65 biến thể · 8 mục Bảng kiểm**, chiếm dải `BK_USER_TC_001` → `050`. Phủ **42/42** REQ Web — sinh **sau** khi chốt toàn bộ AMB (`DEMO-AMB-2509`). Đã mở 17/17 ảnh evidence, không xung đột tài liệu ↔ ảnh. 14 TC `@NeedsVerify` · 2 TC `@TechCheck` · 4 Assumption | `b30eb57` (trước khi tạo) |
