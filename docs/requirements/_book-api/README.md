# Danh mục Requirements — AnhTester Book Management API

> **Điểm vào của hệ thống Book API.** Mọi workflow đụng tới `docs/**/_book-api/` đọc file này **trước tiên**: module nào đã có tài liệu · **prefix nào đã bị chiếm** · mã REQ kế tiếp · ambiguity 🔴 còn treo.
>
> Bản đồ API chi tiết: [`_discovery/api_map.md`](_discovery/api_map.md) · Bản đồ app mobile: [`_discovery/system_map.md`](_discovery/system_map.md)

> ⚠️ **Đây là hệ thống RIÊNG, không liên quan Perfex CRM.** Repo này chứa 2 hệ thống độc lập. Danh mục CRM nằm ở [`../README.md`](../README.md) và **không dùng chung dải prefix, mã REQ hay TC ID** với hệ thống này.

| Mục | Giá trị |
|---|---|
| Hệ thống | AnhTester Book Management API |
| Mã hệ thống | `BK` |
| Loại | REST API (OpenAPI 3.0.0) **+ app Android** (Hybrid Capacitor, `book.anhtester.com` 1.0 — thêm 19-09-2026) **+ Web** (`https://book.anhtester.com`, React — thêm 25-09-2026, cùng web app mà Android bọc lại). iOS: chưa khảo sát |
| Mặt | **API** — [`_discovery/api_map.md`](_discovery/api_map.md) · **Android** — [`_discovery/system_map.md`](_discovery/system_map.md) · **Web** — chưa có bản đồ tầng khám phá riêng; recon thẳng ở tầng module (`AUTH` · `USER` · `BOOK`). Chung prefix, chung dải REQ (skill 2.2) |
| Tiền tố REQ | `REQ-BK-<MODULE>-<nn>` |
| Tiền tố TC ID | `BK_<MODULE>_TC_<3 số>` |
| Base URL | `https://book.anhtester.com` — **Production, 1 server duy nhất** |
| Môi trường dùng chung | **KHÔNG** — user chốt 14-08-2026: được thao tác phá huỷ thoải mái (vẫn chỉ ghi/xoá bản ghi do chính phiên tạo — skill 3.4.4) |
| Năng lực kiểm thử của QA | Dùng cho nhánh Vòng 3 của **mọi** bộ TC hệ thống `BK`:<br>• **Gọi API: ✅** (user xác nhận 19-09-2026)<br>• **Truy vấn CSDL: ❌** (user chốt 20-09-2026 — *"Không cho QA đụng Database"*). Dữ liệu lưu kiểm gián tiếp qua API đọc (`GET /api/me` …); phần chỉ CSDL mới thấy (xoá mềm/cứng, rác sau huỷ) → đội Dev xác minh<br>• Kiểm tầng tích hợp · Xem nhật ký hoạt động: chưa hỏi |
| URL · tài khoản | `.env` (không commit) — **KHÔNG** ghi credentials vào `docs/` |
| Khởi tạo | 14-08-2026 — parse spec + kiểm chứng 20 request thật |

---

## 1. Bảng danh mục module (9 module)

| Module | Mã | Nền tảng | Số endpoint | Trạng thái | Tài liệu | REQ đã dùng | Mã kế tiếp | AMB treo | Story | Cập nhật |
|---|---|---|---|---|---|---|---|---|---|---|
| Xác thực & Phiên đăng nhập | `AUTH` | API ✅ · **Android ✅** (Sign in · Sign up · Logout — 19-09 · Profile · Settings · Exit app — 26-09; cập nhật hồ sơ thành công ❔ — REQ-122 lỗi) · **Web ✅** | 6 | ✅ Đã có tài liệu — 3 mặt | [auth/REQUIREMENTS_AUTH_SUMMARY.md](auth/REQUIREMENTS_AUTH_SUMMARY.md) | `REQ-BK-AUTH-01` → `126` (126) | `REQ-BK-AUTH-127` · `AMB-BK-AUTH-36` · `RISK-BK-AUTH-12` | **0** — 35/35 đã chốt (`DEMO-AMB-2509` · `2509B` · `2609`) | 6 | 26-09-2026 |
| Người dùng | `USER` | **API ✅** · **Android 🟨** (đọc · lọc · validation ✅ — thêm/sửa/khoá/xoá thành công ❔) · **Web ✅** | 5 | 🟨 Đang khảo sát — Android còn vế ghi dữ liệu (cần tester nhập mật khẩu) | [user/REQUIREMENTS_USER_SUMMARY.md](user/REQUIREMENTS_USER_SUMMARY.md) | `REQ-BK-USER-01` → `128` (128) | `REQ-BK-USER-129` · `AMB-BK-USER-21` · `RISK-BK-USER-10` | **0** — 20/20 đã chốt | 12 | 26-09-2026 |
| Sách | `BOOK` | **API ✅** · **Android 🟨** (đọc · lọc · form · validation ✅ — tạo sách **lỗi** REQ-147, sửa/xoá ❔) · **Web ✅** | 5 | 🟨 Đang khảo sát — Android còn vế ghi dữ liệu | [book/REQUIREMENTS_BOOK_SUMMARY.md](book/REQUIREMENTS_BOOK_SUMMARY.md) | `REQ-BK-BOOK-01` → `154` (154) | `REQ-BK-BOOK-155` · `AMB-BK-BOOK-38` · `RISK-BK-BOOK-11` | **0** — 37/37 đã chốt | 13 | 26-09-2026 |
| Danh mục sách | `CAT` | API 🟨 · Android ⬜ | 4 | 🟨 Đã lập bản đồ | — | — | `REQ-BK-CAT-01` | 0 — `AMB-BK-05` ✅ | — | 19-09-2026 |
| Khuyến mãi | `PROMO` | API 🟨 · Android ⬜ | 5 | 🟨 Đã lập bản đồ | — | — | `REQ-BK-PROMO-01` | 0 — `AMB-BK-04` · `09` ✅ | — | 19-09-2026 |
| Tệp tin | `FILE` | API 🟨 · Android ⬜ | 7 | 🟨 Đã lập bản đồ | — | — | `REQ-BK-FILE-01` | 0 — `AMB-BK-07` ✅ | — | 19-09-2026 |
| Địa chỉ hành chính | `ADDR` | API 🟨 · Android ⬜ | 2 | 🟨 Đã lập bản đồ | — | — | `REQ-BK-ADDR-01` | — | — | 19-09-2026 |
| Tiện ích hệ thống | `SYS` | API 🟨 | 1 | 🟨 Đã lập bản đồ | — | — | `REQ-BK-SYS-01` | — | — | 14-08-2026 |
| Tổng quan | `DASH` | Android ⬜ | 0 | 🟨 Đã lập bản đồ | — | — | `REQ-BK-DASH-01` | — | — | 19-09-2026 |
| | | | **35** | | | **408** | | **0 AMB treo** | | |

**Bảng mã trạng thái:** ⬜ Chưa khảo sát · 🟨 Đã lập bản đồ (có catalog / bản đồ màn hình, chưa có REQ) · ✅ Đã có tài liệu REQ · ⏸️ Hoãn

**Cột Nền tảng** mang trạng thái **riêng từng mặt**: `Android ⬜` = mới có bản đồ màn hình ở [`system_map.md`](_discovery/system_map.md), chưa sinh REQ · `Android 🟨` = có REQ nhưng còn vế chưa kiểm. Module chỉ ✅ khi **mọi** mặt đã ✅ — `AUTH` lên ✅ ngày 26-09-2026 (vế ❔ còn lại chặn bởi REQ-122, đã ghi rõ ở index module).

### Prefix đã chiếm trong hệ thống `BK`

```
AUTH · USER · BOOK · CAT · PROMO · FILE · ADDR · SYS · DASH
```

Prefix của hệ thống CRM (`LOGIN`, `CUST`, `PRJ`…) **không liên quan** — hai hệ thống nằm ở hai namespace tách biệt, mã `BK` phía trước bảo đảm không bao giờ đụng nhau khi grep.

---

## 2. Trạng thái REQ toàn hệ thống

Đã lập bản đồ **9/9 module** (8 mặt API · 8 mặt Android — `DASH` chỉ có Android, `SYS` chỉ có API) · có tài liệu REQ **3/9** (`AUTH` — API · Web · Android đủ màn hình · `USER` · `BOOK` — Web **và API** đủ, **Android** có REQ từ 26-09-2026 nhưng còn vế ghi dữ liệu ❔). Mặt **Web** mới recon 3 module (25-09-2026), chưa có bản đồ tầng khám phá.

| Trạng thái | `AUTH` | `USER` | `BOOK` | Toàn hệ thống |
|---|---|---|---|---|
| 🟢 Active | 124 (API 40 · Android 14 · Web 23 · dùng chung `Android · API · Web` 8 · `Android · Web` 39 — trừ `73` · `97`) | 127 (Web 7 · API 77 · Android 9 · dùng chung `Web · API` 4 · `Android · Web` 30 — trừ `30`) | 152 (Web 13 · API 94 · Android 8 · dùng chung 4 · `Android · Web` 33 — trừ `03` · `34`) | 403 |
| 🟡 Changed | 2 (`73` · `97`) | 1 (`30`) | 2 (`03` · `34`) | 5 |
| 🔴 Deprecated | 0 | 0 | 0 | 0 |
| ⚪ Chưa implement | 0 | 0 | 0 | 0 |
| Endpoint chưa sinh REQ (mặt API) | — | 0 | 0 | 19 (6 module còn lại) |
| **Tổng** | **126 REQ** | **128 REQ** | **154 REQ** | **408 REQ** |

> 26-09-2026 (Android · `DEMO-AMB-2609`): thêm **REQ Android ghi hành vi kỳ vọng mà app chưa đạt** (`@KnownBug`) — `REQ-BK-AUTH-122` (Save Profile lỗi) · `REQ-BK-USER-120` (tab User không về danh sách) · `124` (lỗi validation dính giữa các hộp thoại) · `REQ-BK-BOOK-147` (tạo sách lỗi) · `148` (tab Book không về danh sách) · `154` (breadcrumb Modify sai). REQ web mở rộng sang Android mà Android cũng chưa đạt: `REQ-BK-AUTH-118` · `REQ-BK-USER-30` · `REQ-BK-BOOK-17` · `48` · `51`.
>
> 25-09-2026 (`DEMO-AMB-2509B`): thêm **REQ mặt API ghi hành vi kỳ vọng mà hệ thống chưa đạt** (`@KnownBug`) — `USER`: `75` · `79` · `90` · `92` · `109` · `116 → 119` · `BOOK`: `51` (mở rộng `Web · API`) · `82` · `83` · `85` · `88` · `95` · `101` · `104` · `111` · `114` · `123` · `130` · `137` · `138` · `139` · `140` · `141` · `143` · `145` · `146` (`142` `@NeedsVerify`). Riêng `REQ-BK-USER-116` (F-32) **cần Dev xác minh**.
>
> 7 REQ Web ghi hành vi **kỳ vọng** mà hệ thống chưa đạt — PO đã chốt là **lỗi** (TC `@KnownBug`, mở bug bằng `/create-bug-report`): `REQ-BK-AUTH-97` · `114` · `115` · `118` · `REQ-BK-BOOK-17` · `48` · `51`. 3 REQ/vế theo **quyết định PO chưa kiểm chứng** (TC `@NeedsVerify`): `REQ-BK-AUTH-120` · `REQ-BK-BOOK-52` · vế mới của `REQ-BK-BOOK-03` · `34`.

Mặt API: `AUTH` 6 endpoint → 40 REQ riêng API · `USER` 5 endpoint → 77 · `BOOK` 5 endpoint → 94 (≈ 8 – 19 REQ mỗi endpoint vì có thêm bộ lọc JSON, biên giới hạn, ghi đè trường). 19 endpoint còn lại (`CAT` · `PROMO` · `FILE` · `ADDR` · `SYS`) dự kiến 100 – 200 REQ.

---

## 3. Ambiguity 🔴 High còn treo

**Không còn AMB nào treo** — 25-09-2026 toàn bộ AMB của `AUTH` (32) · `USER` (7) · `BOOK` (17) và AMB cấp hệ thống `AMB-BK-01` → `12` đã được chốt bằng quyết định giả lập `DEMO-AMB-2509` (dữ liệu dạy học demo). Kết luận ghi tại cột `Kết luận` của từng bảng AMB; Impact Report ở `<module>/impact/impact_DEMO-AMB-2509.md`.

| Mã (từng 🔴) | Module | Kết luận |
|---|---|---|
| AMB-BK-01 | tất cả | Hệ thống **không có** mô hình vai trò — mọi người dùng đã đăng nhập ngang quyền; F-02 là thiết kế. Cột *Vai trò khác* của mọi ma trận phân quyền → không áp dụng |
| AMB-BK-02 | `USER` | Danh sách người dùng công khai là **cố ý** — F-01 viết thành TC xác nhận hành vi |
| AMB-BK-AUTH-01 · 02 · 04 | `AUTH` | Đã chốt từ 20-09-2026 — **lỗi / áp dụng**. `AMB-BK-AUTH-21` (25-09-2026) thu hẹp F-16: lỗi chỉ khi body **thiếu khoá** |
| AMB-BK-USER-01 | `USER` | Không có vai trò quản trị — sửa/xoá người dùng khác là thiết kế |
| AMB-BK-BOOK-15 | `BOOK` | Không có vai trò — sửa/xoá sách người khác là thiết kế |
| AMB-BK-BOOK-34 | `BOOK` | (26-09-2026 · `DEMO-AMB-2609`) Tạo sách trên Android thất bại là **lỗi app** — sinh `REQ-BK-BOOK-147`; nguyên nhân cần Dev xác minh |

---

## 4. Phát hiện bảo mật đáng chú ý

Đã kiểm chứng bằng gọi thật, **không** phải suy đoán từ spec. Chi tiết + bằng chứng: [`_discovery/api_map.md` mục 3](_discovery/api_map.md#3-kết-quả-kiểm-chứng-bằng-gọi-thật).

| Mã | Mức | Tóm tắt |
|---|---|---|
| F-01 | 🔴 | `GET /api/user` công khai → rò rỉ email/phone/address toàn bộ user |
| F-02 | 🔴 | Không có phân quyền — user vừa đăng ký xoá/sửa được user khác, tạo được sách |
| F-03 | 🔴 | Cookie `accessToken` thiếu `HttpOnly`/`Secure`/`SameSite` |
| F-04 | 🟠 | `price` âm được chấp nhận |
| F-05 | 🟠 | `categories` không tồn tại vẫn tạo được sách |
| F-06 | 🟠 | Xoá user làm sách của họ mồ côi (`auth: null`) |
| F-07 | 🟠 | `POST /api/user` gán mật khẩu mặc định đoán được (`anhtester.com`) |
| F-32 | 🔴 | `GET /api/user?search=` (công khai) chấp nhận điều kiện lọc trên trường nội bộ — **cần Dev xác minh** *(25-09-2026)* |
| F-35 | 🔴 | `currentPrice` của mọi sách mới áp **mọi khuyến mãi hiệu lực toàn hệ thống** → âm (nguyên nhân gốc giá âm trên web) *(25-09-2026)* |
| F-16 | 🔴 | `PATCH /api/profile` không dùng được — mọi body đều 422 *(19-09-2026)* |
| F-17 | 🔴 | Đăng xuất không thu hồi refresh token phía server *(19-09-2026)* |
| F-18 | 🟠 | Refresh token không xoay vòng, dùng lại được nhiều lần *(19-09-2026)* |
| F-19 | 🟠 | Thiếu `email` → server dùng `default` `user@example.com` thay vì báo thiếu field *(19-09-2026)* |
| F-20 | 🟠 | Đăng nhập lộ email nào đã đăng ký (400 vs 404) *(19-09-2026)* |
| F-23 | 🟠 | Access token vẫn dùng được sau đăng xuất *(19-09-2026)* |
| F-33 · 34 · 36 · 37 · 42 · 45 | 🟠 | Body 400 lộ đường dẫn máy chủ · sửa người dùng không thu hồi refresh token · sửa giá không tính lại giá bán · sửa danh mục cộng dồn · giới hạn cột lưu trữ (191) · giá số lẻ bị cắt *(25-09-2026)* |
| F-38 · 39 · 40 · 41 · 43 · 44 · 46 | 🟡 | Xem [`api_map.md` mục 3.3c](_discovery/api_map.md#33c-phát-hiện-bổ-sung--kiểm-chứng-module-api-user--book-25-09-2026--generate-requirements-from-api-800-request-dữ-liệu-tự-tạo-đã-dọn) *(25-09-2026)* |

---

## 5. Cấu trúc thư mục

```
docs/
├── requirements/
│   ├── README.md                      ← danh mục Perfex CRM (hệ thống khác)
│   ├── login/ customers/ projects/    ← module CRM
│   └── _book-api/                     ← HỆ THỐNG NÀY
│       ├── README.md                  ← file này — DANH MỤC
│       ├── _discovery/
│       │   ├── api_map.md             ← INDEX bản đồ API — TÊN FILE BẤT BIẾN
│       │   ├── system_map.md          ← INDEX bản đồ app mobile — TÊN FILE BẤT BIẾN
│       │   ├── modules/module_NN_*.md ← chi tiết màn hình theo nhóm module (9 module > ngưỡng 8)
│       │   ├── evidence/android_*.png ← 1 ảnh tổng quan mỗi module
│       │   └── sources/openapi_*.json ← snapshot spec gốc
│       └── <module>/                  ← sinh dần khi sinh REQ (VD `auth/` · `user/` · `book/`)
│           ├── REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md       ← INDEX — metadata · REQ dùng chung · phân quyền · Story · AMB/RISK · Nhật ký
│           ├── api/requirements_<module>_api.md ← Endpoint Catalog · REQ · Field Spec · Validation · Nhật ký kiểm chứng
│           ├── mobile/requirements_<module>_mobile.md + evidence/android_*.png
│           └── web/requirements_<module>_web.md + evidence/web_*.png
└── testcases/
    └── _book-api/<module>/
        ├── TEST_CASES_<TÊN_MODULE>_SUMMARY.md             ← INDEX
        └── api/test_cases_<module>_api.md
```

> Dấu `_` đầu tên thư mục đánh dấu **"không phải module"** — cùng quy ước với `_discovery/`. Nhờ đó `_book-api/` không bị workflow nhầm là một module của CRM.

---

## 6. Quy trình sử dụng

| Tình huống | Workflow | Ghi vào đâu |
|---|---|---|
| Sinh REQ chi tiết cho 1 module API | `/generate-requirements-from-api <module>` — đọc `api_map.md` + spec đã snapshot, không cần Ticket ID | `_book-api/<module>/api/requirements_<module>_api.md` + index `_book-api/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` + cập nhật bảng mục 1 |
| Sinh API test cases | `/generate-testcases-api` — **sau** khi module đã có REQ | `docs/testcases/_book-api/<module>/api/` |
| Sinh automation script | `/generate-automation-api` — từ file TC API | Source code + `reports/` |
| Spec đổi phiên bản | `/generate-requirements-from-api <module>` — tự phát hiện `sha256` khác snapshot, chạy delta | Snapshot mới ở `_discovery/sources/` · Nhật ký khám phá ở `api_map.md` · Impact Report `impact_spec_<ngày>.md` |
| Báo lỗi bảo mật F-01…F-07 | `/create-bug-report` | `docs/bugs/_book-api/<module>/` |
| Sinh REQ mặt Web cho 1 module | `/generate-requirements-from-website <module>` — đọc index module trước để nối mã và chuyển REQ trùng lên index | `_book-api/<module>/web/requirements_<module>_web.md` + REQ dùng chung lên index + cập nhật cột `Nền tảng` |
| Sinh REQ mặt Android cho 1 module | `/generate-requirements-from-mobile <module>` — đọc `system_map.md` + file `modules/` của module | `_book-api/<module>/mobile/requirements_<module>_mobile.md` + REQ dùng chung lên index + cập nhật cột `Nền tảng` |

**Thứ tự đề xuất (mặt API):** `AUTH → USER → BOOK → CAT → PROMO → FILE → ADDR → SYS`
`AUTH` đi đầu vì mọi module còn lại cần token. `SYS` để cuối vì là tiện ích test, không phải nghiệp vụ.

**Thứ tự đã chốt (mặt Android):** `AUTH (+ ADDR) → USER → BOOK · CAT → PROMO → FILE → DASH` — xem [`system_map.md` mục 6](_discovery/system_map.md#6-thứ-tự-khảo-sát-đã-chốt).

---

## 7. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 26-09-2026 | `/generate-requirements-from-mobile` (Android lượt 2) cho `AUTH` (My Profile · Setting account · Exit app) · `USER` · `BOOK` — tổng **+22 REQ** Android-only (`AUTH-122 → 126` · `USER-120 → 128` · `BOOK-147 → 154`) và **76 REQ web mở rộng sang Android** (chuyển lên index: `AUTH` 11 · `USER` 31 · `BOOK` 34; `BOOK-51` thành `Android · Web · API`). Tạo `user/mobile/` · `book/mobile/` · 55 ảnh (dòng người khác làm mờ). Chốt 9 AMB mới bằng `DEMO-AMB-2609` (1 🔴 `AMB-BK-BOOK-34`). Phát hiện: **Save Profile** và **Create book** trên Android đều thất bại · lỗi validation dính giữa các hộp thoại User · hộp xoá sách hiện tên form khác · tab User/Book không về danh sách từ màn con (`AMB-BK-12`). **Chưa kiểm được trên Android**: mọi luồng cần nhập mật khẩu / tạo tài khoản (agent không làm trên hệ thống thật) — chờ tester. Tổng hệ thống 386 → **408 REQ**. Không tạo/xoá bản ghi nào; phát hiện 2 bản ghi test sót cũ (`auto_web_<timestamp>_b` · sách `Auto BKAPI NoPrice <timestamp>`) |
| 25-09-2026 | `/generate-requirements-from-api user` · `book` — sinh REQ **mặt API** cho `USER` (73 REQ `43 → 115`) và `BOOK` (84 REQ `53 → 136`); 4 + 4 REQ web kiểm khớp trên API chuyển lên index (`Web · API`). Spec không đổi (`sha256` trùng). ≈ 800 request gọi thật, dữ liệu tự tạo đã dọn (có thể sót 1 danh mục tên rỗng). Chốt 26 AMB mới bằng `DEMO-AMB-2509B` (`USER` `08 → 17` · `BOOK` `18 → 33`) + `AMB-BK-AUTH-33` → sinh thêm `USER` `116 → 119` · `BOOK` `137 → 146`; sửa `REQ-BK-USER-30` · `REQ-BK-AUTH-73` (Name 250 → 191). Hệ thống **386 REQ**. Phát hiện **F-32 → F-46** (2 🔴). Đã chỉnh bộ TC API `USER` · `BOOK` (xem [`docs/testcases/_book-api/README.md`](../../testcases/_book-api/README.md)) |
| 25-09-2026 | `/update-requirements-from-ticket` — **chốt toàn bộ AMB** bằng quyết định giả lập `DEMO-AMB-2509` (user yêu cầu, dữ liệu dạy học demo): `AUTH` 29 · `USER` 7 · `BOOK` 17 · cấp hệ thống `AMB-BK-01` → `12` — **0 AMB treo**. REQ: `AUTH` +2 (`120` · `121`) · 🟡 `97` · `BOOK` +2 (`51` · `52`) · 🟡 `03` · `34` · `USER` không đổi → hệ thống **215 REQ**. Impact Report: `auth/` · `user/` · `book/impact/impact_DEMO-AMB-2509.md` |
| 25-09-2026 | `/generate-requirements-from-website` — thêm **mặt Web** (`https://book.anhtester.com`) cho `AUTH` · `USER` · `BOOK`. `AUTH`: +33 REQ web (`87 → 119`), 29 REQ Android chuyển lên index thành `Android · Web`, 8 REQ dùng chung thành `Android · API · Web`, +`STORY-BK-AUTH-06`, AMB `21 → 32`. `USER`: khởi tạo 42 REQ / 6 Story / 7 AMB (🔴 `USER-01`). `BOOK`: khởi tạo 50 REQ / 7 Story / 17 AMB (🔴 `BOOK-15`). Tổng hệ thống 86 → **211 REQ**. Phát hiện: `PATCH /api/profile` **thành công** từ web với body đủ khoá (`AMB-BK-AUTH-21` — nghi vấn F-16) · login trả **403** cho tài khoản bị khoá · lọc khoảng giá sách mất cận dưới (`AMB-BK-BOOK-02`). Web có menu **`Database`** (`/db-management`) chưa thuộc module nào — **chưa cấp prefix**, cần `/discover-system` mode ADD. Dữ liệu: còn sót 1 tài khoản `auto_web_<timestamp>_b@auto.test` + có thể 1 ảnh bìa |
| 20-09-2026 | `/generate-testcases-api auth` + `/generate-testcases-from-requirements` (Mobile): module `AUTH` có **105 TC** (Mobile 58 · API 47) ở [`docs/testcases/_book-api/auth/`](../../testcases/_book-api/auth/TEST_CASES_AUTH_SUMMARY.md) — phủ 86/86 REQ. User chốt `AMB-BK-AUTH-01` · `02` · `04` là **lỗi**; QA **không** truy vấn CSDL. Mở `AMB-BK-AUTH-20` 🟡 |
| 19-09-2026 | `/generate-requirements-from-mobile auth` (Android — Đăng ký · Đăng nhập · Đăng xuất): tạo [auth/mobile/requirements_auth_mobile.md](auth/mobile/requirements_auth_mobile.md) — `REQ-BK-AUTH-49 → 86` (38) + 28 ảnh. 8 REQ server-side kiểm khớp trên app chuyển từ `api/` lên index (dùng chung `Android · API`). Mở `AMB-BK-AUTH-14 → 19` (không 🔴 mới) · `RISK-BK-AUTH-07 · 08` |
| 19-09-2026 | `/discover-system` mode ADD — thêm **mặt Android** (app `book.anhtester.com` 1.0, Hybrid Capacitor). Tạo [`_discovery/system_map.md`](_discovery/system_map.md) + 6 file `modules/` + 9 ảnh `_discovery/evidence/android_*`. Ghép 8 module vào module sẵn có; **cấp prefix mới `DASH`** (Dashboard, chỉ có trên app — user chốt). Cột `Nền tảng` thêm `Android ⬜`; `AUTH` về 🟨 vì còn thiếu mặt Android. Mở `AMB-BK-11` · `AMB-BK-12`. Tạo 1 tài khoản test trên app (lưu `.env`) |
| 19-09-2026 | Module `AUTH` có tài liệu REQ: `REQ-BK-AUTH-01 → 48` · 5 Story · 13 AMB (3 🔴) · 6 RISK. Thêm cột `Nền tảng` + `Story` vào bảng mục 1, dòng `Năng lực kiểm thử của QA` vào metadata. Spec đổi `sha256` (35 op giữ nguyên, 11 op đổi schema) → snapshot `openapi_2026-09-19.json`. Phát hiện mới F-16 → F-25 |
| 15-09-2026 | Sửa mục 6: sinh REQ cho module API chuyển sang `/generate-requirements-from-api` — route cũ `/analyze-requirement-document` bị Bước 0 của nó chặn (spec không có Ticket ID). Luật đã đưa ngược vào skill `skills-requirements-analyzer` mục 3.4 và command mới |
| 14-08-2026 | Khởi tạo danh mục hệ thống `BK`. Lập bản đồ 35 endpoint / 8 module bằng parse spec + 20 request kiểm chứng. Ghi nhận 15 phát hiện (3 🔴) và 10 ambiguity. **Chưa sinh REQ nào** — chờ chốt AMB-BK-01 và AMB-BK-02 |
