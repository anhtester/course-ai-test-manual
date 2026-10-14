# Test Cases — Module Khách hàng (`CUST`) — tổng 129 TC · 1 nền tảng · độ hạt GỘP

| Thông tin | Nội dung |
|---|---|
| **Hệ thống** | Perfex CRM — Anh Tester Demo (`https://crm.anhtester.com`) |
| **Module** | Khách hàng (Customers) · prefix `CUST` |
| **Nguồn requirement** | [REQUIREMENTS_CUSTOMERS_SUMMARY.md](../../requirements/customers/REQUIREMENTS_CUSTOMERS_SUMMARY.md) (index) · [web/requirements_customers_web.md](../../requirements/customers/web/requirements_customers_web.md) — **84 REQ**, toàn bộ trong phạm vi |
| **Mode sinh** | QUICK (`/generate-testcases-from-requirements`) · **độ hạt GỘP** · khung 4 vòng |
| **Ngày sinh** | 19-09-2026 · đồng bộ requirements với DOM thật + thêm `TC_129` 19-09-2026 |
| **Dải TC ID** | `CRM_CUST_TC_001` → `CRM_CUST_TC_129` — chung mọi nền tảng |
| **Mã kế tiếp** | `CRM_CUST_TC_130` — **KHÔNG đánh lại từ 001** |
| **Quy mô** | 129 TC · **155 biến thể** · **74 mục bảng kiểm** · 16 TC `@TechCheck` · 51 TC `@NeedsVerify` · 2 TC thiết kế để FAIL |
| **Mức rủi ro · độ sâu** | `Cao` → **Đầy đủ** — V1 đủ 6 nhánh, V2 đủ mọi nhánh có điều kiện kích hoạt, V3/V4 đủ nhánh áp dụng được.<br>Căn cứ chấm Cao (đủ **5/5** dấu hiệu, chỉ cần 1): dữ liệu cá nhân khách hàng (email, số điện thoại, thông tin đăng nhập máy chủ ở Vault) · thao tác **không hồi lại được** (xoá bằng đường dẫn không xác nhận, `Mass Delete`) · là **cổng vào** của hơn 10 module khác · đụng phân quyền 3 vai trò · sao kê công nợ là số liệu tài chính.<br>**Rà lại khi:** module có thêm nền tảng Mobile/API (`AMB-CUST-14` đã trả lời 19-09-2026 — trùng giả định, mức rủi ro giữ Cao) |
| **Môi trường** | ⚠️ **Dùng chung** — mọi TC tạo dữ liệu đều tự dọn (`D1`); `Mass Delete` và tạo nhóm khách hàng chỉ chạy trên môi trường riêng (`@PersonalOnly`) |
| **Trình duyệt chuẩn** | Google Chrome, viewport desktop `1600×750` |
| **Tài khoản** | 🔒 Lấy từ `.env` (`ADMIN_*`, `PM_*`, `CUSTOMER_*`) — **KHÔNG** ghi mật khẩu thật vào tài liệu |

## Cách đọc bộ TC này

### 1. Độ hạt GỘP

Biến thể của **cùng một trường**, **cùng loại phản hồi** nằm chung một TC trong **Bảng biến thể** (cột `Test Data`); kiểm tra tĩnh cùng màn hình nằm trong **Bảng kiểm** (cột `Expected Result`).

- Mỗi biến thể có mã riêng `a`, `b`, `c`… → báo cáo FAIL **bắt buộc** ghi rõ: `CRM_CUST_TC_051-e FAIL`
- Chạy một TC là chạy **hết** biến thể của nó
- Sang automation: TC gộp → **test data-driven** (`@DataProvider` · `test.each` · `parametrize`)

### 2. Dòng `🔧 Ghi chú kỹ thuật`

Phần chính của mọi TC **quan sát được bằng mắt**. Nội dung cần DevTools (request, class, mã CSRF) nằm ở dòng `🔧 Ghi chú kỹ thuật (cần DevTools):` và TC mang `@TechCheck`. Bỏ qua dòng 🔧 thì TC vẫn chấm được — ghi `— (bỏ phần 🔧)` vào báo cáo.

### 3. Tag đặc biệt

| Tag | Nghĩa | Người chạy làm gì |
|---|---|---|
| `@KnownBug` | TC **thiết kế để FAIL** — bám kỳ vọng đúng PO đã chốt, hệ thống chưa đạt | FAIL là kết quả đúng → mở bug, **không** sửa TC |
| `@NeedsVerify` | Có ít nhất một bước kỳ vọng **chưa có evidence** (dòng ghi `⚠️`) | Chạy bình thường; ở bước `⚠️` **ghi lại hành vi thật** và nguyên văn thông báo, chưa kết luận FAIL nếu kỳ vọng ghi "ghi nhận" |
| `@AssumptionBased` | Viết theo **quyết định PO chưa kiểm chứng** hoặc giả định tạm của AMB đang treo | FAIL → báo PO trước khi mở bug |
| `@PersonalOnly` | 🚫 **Không chạy trên môi trường dùng chung** (phá huỷ hoặc không dọn được) | `/execute-test-cases` bỏ qua; QA tự chạy trên môi trường riêng |
| `@Destructive` | Có thao tác xoá | Chỉ xoá bản ghi **do chính TC tạo** — kiểm tên và `{id}` hai lần |

### 4. Quy ước tiền đề và dọn dữ liệu (dùng xuyên suốt 5 part)

| Mã | Nội dung |
|---|---|
| `P-ADMIN` | Đã đăng nhập khu quản trị `https://crm.anhtester.com/admin/authentication` bằng `ADMIN_EMAIL` / `ADMIN_PASSWORD` trong `.env` |
| `P-PM` | Như trên, bằng `PM_EMAIL` / `PM_PASSWORD` (vai trò `Project Manager`) |
| `KH-TEST` | Khách hàng test **do chính TC tạo** ở bước tiền đề: `/admin/clients` → `+ New Customer` → nhập các trường TC nêu → `Save`. Tên theo mẫu `auto_cust_tc{số TC}_{thời điểm YYYYMMDDHHmm}` |
| `CSV-2` · `CSV-DUP` | Tệp CSV tự soạn — mô tả ở đầu Nhóm R, [part 04](web/parts/part_04_web_trang_thai_tab_nhap.md#nhóm-r--nhập-khách-hàng-từ-csv) |
| `D1` | **Dọn dữ liệu:** ở `/admin/clients` tìm đúng tên khách hàng test → rê chuột lên dòng → `Delete` → `OK` → thấy `Customer deleted` và tìm lại ra `No matching records found`. Khách hàng có dự án/Vault/nhắc nhở test thì xoá các bản ghi con đó trước |

> 🕐 **Hậu tố thời điểm** trong Test Data (`…_202609191010`) là giá trị ví dụ tại ngày sinh TC. Mỗi lần chạy **thay bằng thời điểm chạy thật** (cùng định dạng `YYYYMMDDHHmm`) để không trùng với lần chạy trước và truy được bản ghi về đúng lần chạy.

---

## Bản đồ tài liệu

> File này là **index** — không chứa dòng TC.

| Nền tảng | File | Vòng · Nhóm chức năng | Số TC | TC ID | REQ bao phủ |
|---|---|---|---|---|---|
| Web | [web/parts/part_01_web_smoke.md](web/parts/part_01_web_smoke.md) | **V1 Smoke** — A Danh sách · B Biểu mẫu thêm mới · C Tạo & đối chiếu · D Hồ sơ & màn hình Nhập | 16 | 001–016 | 01–06, 08–11, 23–28, 30–36, 39, 47–52, 56, 72–75, 77, 78, 84 |
| Web | [web/parts/part_02_web_danh_sach.md](web/parts/part_02_web_danh_sach.md) | **V2** — E Sắp xếp & phân trang · F Tìm kiếm · G Bộ lọc · H Xuất & thao tác hàng loạt | 22 | 017–038 | 04–07, 10–22 |
| Web | [web/parts/part_03_web_bieu_mau.md](web/parts/part_03_web_bieu_mau.md) | **V2** — I Trường bắt buộc · J Company & trùng tên · K Trường tuỳ chọn · L Ô chọn · M Sao chép địa chỉ · N Sửa hồ sơ | 36 | 039–073, 129 | 25, 27–33, 35–38, 40–45, 49–55, 65, 84 |
| Web | [web/parts/part_04_web_trang_thai_tab_nhap.md](web/parts/part_04_web_trang_thai_tab_nhap.md) | **V2** — O Trạng thái · P Xoá · Q Tab phụ trợ · R Nhập CSV · S Đoán lỗi & kịch bản | 39 | 074–112 | 11, 33, 44, 50, 56–61, 63–71, 73–82 |
| Web | [web/parts/part_05_web_ky_thuat_phi_chuc_nang.md](web/parts/part_05_web_ky_thuat_phi_chuc_nang.md) | **V3** — T Phân quyền · U Bảo mật · **V4** — V Phi chức năng | 16 | 113–128 | 01, 03, 05, 07–09, 18, 21, 23, 26, 27, 29, 33, 44, 46, 49, 52, 54, 57–61, 62, 68, 79, 83 |
| Mobile | — | Module chưa có nền tảng Mobile | 0 | — | — |
| API | — | Module chưa có nền tảng API | 0 | — | — |

> Web 129 TC vượt ngưỡng 50 (độ hạt GỘP) → tách 5 part, **cắt tại ranh giới vòng / nhóm chức năng**, mỗi part ≤ 39 TC. `TC_129` bổ sung sau nên nằm trong part 03 cạnh nhóm ô chọn, số TC ID không liền dải.

---

## Assumptions đã áp dụng

> ✅ **Đã đồng bộ 19-09-2026.** 5 xung đột tài liệu ↔ ảnh (`ASM-01`, `02`, `03`, `04`, `07`) và `ASM-05` được đo lại trên DOM thật; requirements đã sửa (`REQ-CUST-15`, `17`, `22`, `70` 🟡 · `11`, `16` ghi chú · thêm `REQ-CUST-84`), TC sửa tại chỗ. ⚠️ `ASM-07` hoá ra **ảnh gây hiểu nhầm**, tài liệu đúng.

| Mã | Điểm chưa rõ / xung đột | Giả định đã dùng | TC bị ảnh hưởng |
|---|---|---|---|
| ASM-01 | ✅ **Đã giải quyết 19-09-2026** — DOM xác nhận dòng cảnh báo; `REQ-CUST-22` bổ sung. Hành vi gỡ nhóm vẫn chưa thực thi (`TC_036` giữ `@NeedsVerify`) · *Ban đầu:* 🔀 **Xung đột.** `REQ-CUST-22` không nhắc tới dòng chữ đỏ trong hộp thoại Bulk Actions; ảnh `cust_list_bulk_actions_modal_fullpage.png` và `cust_perm_pm_bulk_actions_mass_delete.png` đều có: `If you do not select any group all groups assigned to the selected customers will be removed.` | Viết theo ảnh: dòng cảnh báo là một mục của bảng kiểm, và hành vi "Confirm khi không chọn nhóm = gỡ hết nhóm" được kiểm riêng | `TC_034` mục `4` · `TC_036` |
| ASM-02 | ✅ **Đã giải quyết 19-09-2026** — `Clear Filter`/`Edit` có trong trang nhưng **ẩn khi chưa áp bộ lọc** (trùng giả định); bộ lọc đã lưu **khác nhau giữa tài khoản** (PM: `No saved filters…`) → `REQ-CUST-17` 🟡, `TC_025` viết lại 2 biến thể · *Ban đầu:* 🔀 **Xung đột.** `REQ-CUST-17` ghi dropdown bộ lọc có 3 lệnh `New Filter` · `Clear Filter` · `Edit`; ảnh `cust_list_saved_filters_dropdown_fullpage.png` chỉ có `New Filter` | Viết theo ảnh; hai lệnh còn lại coi là **chỉ hiện khi đang áp một bộ lọc** — ghi nhận khi chạy | `TC_025` · `TC_029` bước 6 |
| ASM-03 | ✅ **Đã giải quyết 19-09-2026** — `Save Filter` là ô tích hiển thị dạng công tắc; cặp radio nhãn `and`/`or`, **mặc định `or`**, hiện khi đã có điều kiện → `REQ-CUST-15` 🟡, `TC_027`, `TC_028` sửa · *Ban đầu:* 🔀 **Xung đột.** `REQ-CUST-16` gọi `Save Filter` là checkbox; ảnh `cust_list_create_filter_modal_fullpage.png` là **công tắc gạt**. Cặp radio kiểu khớp (`REQ-CUST-15`) không hiện khi chưa có điều kiện | Viết theo ảnh (công tắc gạt); kiểu khớp coi là xuất hiện khi có ≥ 2 điều kiện, nhãn nguyên văn chưa rõ | `TC_026` · `TC_028` · `TC_029` |
| ASM-04 | ✅ **Đã giải quyết 19-09-2026** — nút `G` = `Fetch from google - Fill address, city and country before fetching to get best result.` → `REQ-CUST-70` 🟡; không kiểm chức năng (ngoài phạm vi cùng `AMB-CUST-09`) · *Ban đầu:* 🔀 **Xung đột.** `REQ-CUST-70` mô tả tab Map có 2 ô + nút `Save`; ảnh `cust_detail_map_tab_fullpage.png` có thêm nút chữ `G` dính bên phải ô Latitude | Chỉ kiểm **sự có mặt** của nút `G`, không đoán chức năng | `TC_093` bước 2 |
| ASM-05 | ✅ **Đã giải quyết 19-09-2026** — chú giải nguyên văn đã lấy, kèm **quy tắc mới**: khoá đổi tiền tệ khi đã có giao dịch → `REQ-CUST-84` + `TC_129` · *Ban đầu:* Chú giải của biểu tượng dấu hỏi cạnh nhãn `Currency` (thấy trong mọi ảnh biểu mẫu) không có trong tài liệu | Kiểm sự có mặt; nội dung chú giải ghi nguyên văn khi chạy | `TC_006` mục `2` · `TC_061` bước 1 |
| ASM-06 | Sau khi gạt công tắc Active, khối `Customers Summary` có cập nhật tại chỗ không? Ảnh `cust_list_active_toggle_inactive_fullpage.png` chụp **sau** khi gạt vẫn ghi `1566 Active · 6 Inactive` | Summary **chỉ cập nhật khi nạp lại trang** — TC so số sau khi nạp lại | `TC_074` bước 4–5 · `TC_117` |
| ASM-07 | ✅ **Đã giải quyết 19-09-2026 — tài liệu đúng, ảnh gây hiểu nhầm.** DOM là `Search...`; ô rộng ~79 px nên trên màn hình bị cắt còn `Search..`. `TC_003`, `TC_072` chấm đạt cả hai · *Ban đầu:* 🔀 **Xung đột.** `REQ-CUST-11` ghi chữ gợi ý ô tìm kiếm của bảng là `Search...` (3 chấm); mọi ảnh danh sách đều là `Search..` (2 chấm). `Search...` 3 chấm là ô tìm kiếm **toàn hệ thống** ở thanh đầu trang | Viết theo ảnh: `Search..` | `TC_003` mục `2` · `TC_072` mục `2` |
| ASM-08 | `This Week` của sao kê bắt đầu từ thứ Hai hay Chủ nhật? | Không khẳng định — ghi lại ngày bắt đầu tuần khi chạy | `TC_085-b` |
| ASM-09 | Tài liệu không nêu miền giá trị của `Port` (Vault), `Latitude`, `Longitude` | Dùng miền chuẩn: cổng 1–65535, vĩ độ −90…90, kinh độ −180…180. Giá trị ngoài miền chỉ **ghi nhận** | `TC_091`, `TC_092`, `TC_094`, `TC_095` |
| ASM-10 | ✅ **Đã giải quyết 19-09-2026** — PO trả lời `AMB-CUST-14` **trùng giả định cả hai vế** · *Ban đầu:* `AMB-CUST-14` còn treo: PM có thật sự được xoá khách hàng, có xem được mục Vault mức "chỉ quản trị viên" không | Theo giả định tạm của AMB: PM **được** xoá (cấu hình cố ý) · PM **không** thấy mục Vault mức 2 | `TC_119`, `TC_120` — gỡ `@AssumptionBased` |
| ASM-11 | `REQ-CUST-81`, `REQ-CUST-82` là quyết định PO **chưa kiểm chứng** (⚪). Đường menu tới biểu mẫu tạo mới của 11 module lấy theo `system_map`, chưa mở lần nào | Viết theo quyết định PO; đường menu ghi lại đường thật nếu khác | `TC_079`, `TC_080`, `TC_081` — `@AssumptionBased` |
| ASM-12 | Giới hạn 255 ký tự (`AMB-CUST-05`) chốt theo giả định, chưa đo | TC biên 255 phải lưu nguyên vẹn; 256 phải bị chặn **hoặc** báo cắt — lưu cắt âm thầm là FAIL | `TC_045`, `TC_046`, `TC_050-e`, `TC_051-f`, `TC_052-e`, `TC_056-e` |

---

## 🐞 Hai TC thiết kế để FAIL — mở bug, KHÔNG sửa TC

| TC | REQ | Kỳ vọng đúng (PO chốt 19-09-2026) | Hiện trạng đã khảo sát | Bằng chứng |
|---|---|---|---|---|
| `CRM_CUST_TC_040` | `REQ-CUST-43` | Company toàn khoảng trắng bị chặn như ô rỗng | Tạo được khách hàng "tên rỗng" | Khảo sát 14-08-2026 · `AMB-CUST-02` |
| `CRM_CUST_TC_041` | `REQ-CUST-42` | Lỗi ở tab ẩn → tự chuyển về tab chứa lỗi | Vẫn đứng ở tab `Billing & Shipping`, lỗi nằm ở tab ẩn | `cust_new_form_required_error_hidden_tab_fullpage.png` · `AMB-CUST-03` |

> Sau lần chạy đầu: `/create-bug-report` cho 2 TC này. Khi bug được fix → nhánh `V4 · Regression` chuyển từ ➖ sang ✅.

---

## Bảng Đối Soát Coverage (84/84 REQ)

| REQ ID | Mô tả ngắn | Trạng thái REQ | Số TC | TC IDs | Đủ Positive/Negative/Boundary? |
|---|---|---|---|---|---|
| REQ-CUST-01 | Truy cập màn hình danh sách khách hàng | 🟢 | 5 | TC_001, TC_113, TC_114, TC_115, TC_127 | ✅ |
| REQ-CUST-02 | Bảng tổng quan Customers Summary | 🟢 | 2 | TC_002, TC_004 | ✅ |
| REQ-CUST-03 | Cấu trúc cột bảng danh sách | 🟢 | 2 | TC_003, TC_125 | ✅ |
| REQ-CUST-04 | Sắp xếp theo cột | 🟢 | 3 | TC_003, TC_017, TC_018 | ✅ |
| REQ-CUST-05 | Chọn số dòng mỗi trang | 🟢 | 3 | TC_003, TC_019, TC_128 | ✅ |
| REQ-CUST-06 | Phân trang danh sách | 🟢 | 3 | TC_003, TC_004, TC_020 | ✅ |
| REQ-CUST-07 | Nạp dữ liệu phía máy chủ | 🟢 | 2 | TC_020, TC_128 | ✅ |
| REQ-CUST-08 | Thanh công cụ màn hình danh sách | 🟢 | 2 | TC_002, TC_115 | ✅ |
| REQ-CUST-09 | Thao tác nhanh trên từng dòng | 🟢 | 3 | TC_004, TC_014, TC_115 | ✅ |
| REQ-CUST-10 | Nạp lại bảng không tải lại trang | 🟢 | 2 | TC_003, TC_024 | ✅ |
| REQ-CUST-11 | Tìm kiếm nhanh trên bảng | 🟢 | 5 | TC_003, TC_011, TC_021, TC_023, TC_112 | ✅ |
| REQ-CUST-12 | Hiển thị số bản ghi sau khi lọc | 🟢 | 1 | TC_021 | ✅ |
| REQ-CUST-13 | Không tìm thấy kết quả | 🟢 | 1 | TC_022 | ✅ |
| REQ-CUST-14 | Bộ lọc tuỳ biến theo điều kiện | 🟢 | 3 | TC_026, TC_027, TC_028 | ✅ |
| REQ-CUST-15 | Chọn kiểu khớp điều kiện | 🟡 | 1 | TC_028 | ✅ |
| REQ-CUST-16 | Lưu bộ lọc để dùng lại | 🟢 | 2 | TC_026, TC_029 | ✅ |
| REQ-CUST-17 | Danh sách bộ lọc đã lưu | 🟡 | 1 | TC_025 | ✅ |
| REQ-CUST-18 | Xuất danh sách khách hàng | 🟢 | 4 | TC_030, TC_031, TC_032, TC_115 | ✅ |
| REQ-CUST-19 | Cột chọn không nằm trong dữ liệu xuất | 🟢 | 1 | TC_031 | ✅ |
| REQ-CUST-20 | Chọn nhiều khách hàng | 🟢 | 1 | TC_033 | ✅ |
| REQ-CUST-21 | Mở hộp thoại thao tác hàng loạt | 🟢 | 3 | TC_034, TC_038, TC_115 | ✅ |
| REQ-CUST-22 | Nội dung thao tác hàng loạt | 🟡 | 4 | TC_034, TC_035, TC_036, TC_037 | ✅ |
| REQ-CUST-23 | Truy cập biểu mẫu thêm khách hàng | 🟢 | 3 | TC_005, TC_008, TC_121 | ✅ |
| REQ-CUST-24 | Biểu mẫu chia 2 tab ở chế độ tạo mới | 🟢 | 1 | TC_005 | ✅ |
| REQ-CUST-25 | Company là trường bắt buộc duy nhất | 🟢 | 7 | TC_005, TC_009, TC_043, TC_044, TC_045, TC_046, TC_047 | ✅ |
| REQ-CUST-26 | Con trỏ đặt sẵn ở ô Company | 🟢 | 2 | TC_005, TC_126 | ✅ |
| REQ-CUST-27 | Các trường thông tin khách hàng | 🟢 | 10 | TC_005, TC_010, TC_050, TC_051, TC_052, TC_054, TC_055, TC_056, TC_125, TC_126 | ✅ |
| REQ-CUST-28 | Gán nhiều nhóm cho khách hàng | 🟢 | 3 | TC_006, TC_057, TC_058 | ✅ |
| REQ-CUST-29 | Tạo nhanh nhóm khách hàng ngay trên biểu mẫu | 🟢 | 3 | TC_059, TC_060, TC_121 | ✅ |
| REQ-CUST-30 | Chọn tiền tệ cho khách hàng | 🟢 | 2 | TC_006, TC_061 | ✅ |
| REQ-CUST-31 | Chọn ngôn ngữ mặc định cho khách hàng | 🟢 | 2 | TC_006, TC_062 | ✅ |
| REQ-CUST-32 | Chọn quốc gia | 🟢 | 2 | TC_006, TC_063 | ✅ |
| REQ-CUST-33 | Lưu khách hàng mới | 🟢 | 10 | TC_009, TC_010, TC_011, TC_043, TC_044, TC_107, TC_109, TC_111, TC_112, TC_127 | ✅ |
| REQ-CUST-34 | Lưu rồi tạo liên hệ ngay | 🟢 | 1 | TC_012 | ✅ |
| REQ-CUST-35 | Nhóm trường Địa chỉ thanh toán | 🟢 | 2 | TC_007, TC_056 | ✅ |
| REQ-CUST-36 | Nhóm trường Địa chỉ giao hàng | 🟢 | 2 | TC_007, TC_056 | ✅ |
| REQ-CUST-37 | Sao chép địa chỉ khách hàng sang địa chỉ thanh toán | 🟢 | 2 | TC_064, TC_066 | ✅ |
| REQ-CUST-38 | Sao chép địa chỉ thanh toán sang địa chỉ giao hàng | 🟢 | 2 | TC_065, TC_066 | ✅ |
| REQ-CUST-39 | Gợi ý về việc bỏ trống địa chỉ giao hàng | 🟢 | 1 | TC_007 | ✅ |
| REQ-CUST-40 | Bỏ trống Company thì không lưu được | 🟢 | 3 | TC_039, TC_042, TC_069 | ✅ |
| REQ-CUST-41 | Nhãn tab đổi màu khi tab đó có lỗi | 🟢 | 1 | TC_039 | ✅ |
| REQ-CUST-42 | 🐞 Lỗi ở tab không hiển thị thì tự chuyển về tab chứa lỗi | 🟡 | 1 | TC_041 | ✅ (TC sẽ FAIL — đúng thiết kế) |
| REQ-CUST-43 | 🐞 Company chỉ chứa khoảng trắng phải bị chặn | 🟡 | 2 | TC_040, TC_047 | ✅ (TC sẽ FAIL — đúng thiết kế) |
| REQ-CUST-44 | Cảnh báo khi tên công ty đã tồn tại | 🟢 | 3 | TC_048, TC_108, TC_128 | ✅ |
| REQ-CUST-45 | Cảnh báo trùng tên không chặn việc lưu | 🟢 | 1 | TC_049 | ✅ |
| REQ-CUST-46 | Biểu mẫu mang mã chống CSRF | 🟢 | 1 | TC_122 | ✅ |
| REQ-CUST-47 | Mở hồ sơ khách hàng | 🟢 | 2 | TC_013, TC_014 | ✅ |
| REQ-CUST-48 | Điều hướng 19 tab nghiệp vụ | 🟢 | 1 | TC_013 | ✅ |
| REQ-CUST-49 | Biểu mẫu sửa có thêm tab Customer Admins | 🟢 | 3 | TC_013, TC_072, TC_121 | ✅ |
| REQ-CUST-50 | Biểu mẫu sửa nạp đúng dữ liệu đã lưu | 🟢 | 5 | TC_010, TC_067, TC_068, TC_110, TC_112 | ✅ |
| REQ-CUST-51 | Chế độ sửa chỉ có một nút lưu | 🟢 | 2 | TC_013, TC_067 | ✅ |
| REQ-CUST-52 | Mở nhanh website của khách hàng | 🟢 | 3 | TC_013, TC_053, TC_124 | ✅ |
| REQ-CUST-53 | Tuỳ chọn hiển thị tên liên hệ chính trên chứng từ | 🟡 | 2 | TC_070, TC_071 | ✅ |
| REQ-CUST-54 | Gán quản trị viên phụ trách khách hàng | 🟢 | 3 | TC_072, TC_073, TC_121 | ✅ |
| REQ-CUST-55 | Bảng danh sách quản trị viên phụ trách | 🟢 | 2 | TC_072, TC_073 | ✅ |
| REQ-CUST-56 | Khách hàng mới mặc định đang hoạt động | 🟢 | 3 | TC_009, TC_011, TC_074 | ✅ |
| REQ-CUST-57 | Tắt trạng thái hoạt động từ danh sách | 🟢 | 5 | TC_074, TC_075, TC_112, TC_117, TC_127 | ✅ |
| REQ-CUST-58 | Bật lại trạng thái hoạt động | 🟢 | 4 | TC_074, TC_080, TC_112, TC_117 | ✅ |
| REQ-CUST-59 | Giải thích ý nghĩa trạng thái Inactive | 🟢 | 1 | TC_074 | ✅ |
| REQ-CUST-60 | Xác nhận trước khi xoá khách hàng | 🟢 | 2 | TC_076, TC_119 | ✅ |
| REQ-CUST-61 | Xoá khách hàng thành công | 🟢 | 6 | TC_075, TC_077, TC_078, TC_112, TC_119, TC_127 | ✅ |
| REQ-CUST-62 | Xoá bằng cách mở thẳng đường dẫn | 🟢 | 1 | TC_123 | ✅ |
| REQ-CUST-63 | Ghi chú nội bộ về khách hàng | 🟢 | 2 | TC_082, TC_083 | ✅ |
| REQ-CUST-64 | Sao kê công nợ khách hàng | 🟢 | 3 | TC_084, TC_085, TC_086 | ✅ |
| REQ-CUST-65 | Tóm tắt số dư trong sao kê | 🟢 | 2 | TC_061, TC_084 | ✅ |
| REQ-CUST-66 | Gửi sao kê qua email | 🟢 | 1 | TC_087 | ✅ |
| REQ-CUST-67 | Kho lưu thông tin đăng nhập của khách hàng | 🟢 | 5 | TC_088, TC_089, TC_090, TC_091, TC_092 | ✅ |
| REQ-CUST-68 | Ba mức hiển thị của mục Vault | 🟢 | 2 | TC_088, TC_120 | ✅ |
| REQ-CUST-69 | Xác nhận mật khẩu trước khi xem mật khẩu Vault | 🟢 | 1 | TC_090 | ✅ |
| REQ-CUST-70 | Toạ độ bản đồ của khách hàng | 🟡 | 3 | TC_093, TC_094, TC_095 | ✅ |
| REQ-CUST-71 | Đặt nhắc nhở cho khách hàng | 🟢 | 4 | TC_096, TC_097, TC_098, TC_099 | ✅ |
| REQ-CUST-72 | Truy cập màn hình nhập khách hàng | 🟢 | 1 | TC_015 | ✅ |
| REQ-CUST-73 | Hướng dẫn định dạng tệp nhập | 🟡 | 2 | TC_015, TC_104 | ✅ |
| REQ-CUST-74 | Bảng cột mẫu của tệp nhập | 🟢 | 3 | TC_016, TC_101, TC_105 | ✅ |
| REQ-CUST-75 | Tải tệp CSV mẫu | 🟢 | 2 | TC_016, TC_101 | ✅ |
| REQ-CUST-76 | Tệp CSV là trường bắt buộc | 🟢 | 2 | TC_100, TC_105 | ✅ |
| REQ-CUST-77 | Thiết lập kèm theo khi nhập | 🟢 | 2 | TC_016, TC_106 | ✅ |
| REQ-CUST-78 | Chạy thử trước khi nhập thật | 🟢 | 2 | TC_016, TC_102 | ✅ |
| REQ-CUST-79 | Kết quả nhập tệp CSV | 🟡 | 2 | TC_103, TC_118 | ✅ |
| REQ-CUST-80 | Chạy thử nhập tệp không ghi dữ liệu | 🟢 | 1 | TC_102 | ✅ |
| REQ-CUST-81 | Khách hàng Inactive bị loại khỏi mọi dropdown chọn khách hàng | ⚪ | 2 | TC_079, TC_080 | ✅ `@AssumptionBased` |
| REQ-CUST-82 | Chặn xoá khách hàng đang có dữ liệu liên quan | ⚪ | 1 | TC_081 | ✅ `@AssumptionBased` |
| REQ-CUST-83 | Tab hồ sơ khách hàng thay đổi theo vai trò | 🟢 | 1 | TC_116 | ✅ |
| REQ-CUST-84 | Khoá đổi tiền tệ khi khách hàng đã có giao dịch | 🟢 | 3 | TC_006, TC_061, TC_129 | ✅ |

**Kết luận:** **84/84 REQ có ≥ 1 TC. Không có dòng 🔴.** Mọi TC trỏ về ≥ 1 REQ. 2 REQ ⚪ (`81`, `82`) có TC gắn `@AssumptionBased`; 2 REQ 🟡 kỳ vọng đúng mà hệ thống chưa đạt (`42`, `43`) có TC thiết kế để FAIL.

---

## Bảng Đối Soát Evidence (29/29 ảnh đã mở)

| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| `cust_list_default_fullpage.png` | Danh sách — mặc định, 25 dòng | TC_001, 002, 003, 004, 017, 019, 020 | ✅ full-page — đủ Summary, thanh công cụ, 9 cột, phân trang `1 2 3 4 5 … 63` |
| `cust_list_export_menu_fullpage.png` | Menu `Export` đang mở | TC_030 | ✅ — 4 mục `Excel` · `CSV` · `PDF` · `Print` |
| `cust_list_bulk_actions_modal_fullpage.png` | Hộp thoại `Bulk Actions` | TC_034, 036 | ✅ — phát hiện dòng cảnh báo đỏ (ASM-01) |
| `cust_list_saved_filters_dropdown_fullpage.png` | Dropdown bộ lọc đã lưu | TC_025 | ⚠️ — **không** có `Clear Filter` / `Edit` (ASM-02) |
| `cust_list_create_filter_modal_fullpage.png` | Hộp thoại `Create Filter` rỗng | TC_026 | ⚠️ — chưa thấy danh sách 15 tiêu chí (lấy từ DOM) và radio kiểu khớp (ASM-03) |
| `cust_list_active_toggle_inactive_fullpage.png` | Sau khi gạt Active sang tắt | TC_004 mục `5`, TC_074 | ✅ — thấy dòng `View \| Contacts \| Delete` và Summary chưa đổi số (ASM-06) |
| `cust_new_form_default_fullpage.png` | Biểu mẫu thêm mới — mặc định | TC_005, 006, 008, 126 | ✅ full-page — thứ tự 12 trường, hàng đôi Currency/Default Language, 2 nút chân biểu mẫu |
| `cust_new_form_billing_shipping_tab_fullpage.png` | Tab Billing & Shipping rỗng | TC_007 | ✅ |
| `cust_new_form_billing_shipping_filled_fullpage.png` | Sau 2 lần sao chép địa chỉ | TC_064, 065 | ✅ — đúng bộ dữ liệu `123 Auto Recon Street · Da Nang · Hai Chau · 550000 · Vietnam` |
| `cust_new_form_company_required_error_fullpage.png` | Company rỗng — lỗi ở tab đang xem | TC_039 | ✅ — chữ đỏ, viền đỏ, nhãn tab đỏ |
| `cust_new_form_required_error_hidden_tab_fullpage.png` | Lỗi ở tab ẩn | TC_041 | ✅ — bằng chứng hiện trạng FAIL |
| `cust_new_form_duplicate_name_warning_fullpage.png` | Cảnh báo trùng tên với Company toàn khoảng trắng | TC_040 | ✅ — dải xanh với tên rỗng |
| `cust_new_form_duplicate_name_warning_named_fullpage.png` | Cảnh báo trùng tên có tên công ty | TC_048, 049 | ✅ — nguyên văn, tên in đậm |
| `cust_save_and_create_contact_result_fullpage.png` | Sau `Save and create contact` | TC_012 | ✅ — hộp thoại `Add new contact` tự mở |
| `cust_detail_after_create_profile_tab_fullpage.png` | Hồ sơ — tab Profile | TC_010, 013, 014, 062 | ✅ — 19 tab, 3 tab biểu mẫu, nút quả cầu, `Vietnamese` |
| `cust_detail_customer_admins_tab_fullpage.png` | Tab Customer Admins rỗng | TC_072 | ✅ — hộp thoại `Assign Admin` **không** có trong ảnh (lấy từ DOM) |
| `cust_detail_statement_tab_fullpage.png` | Tab Statement, This Month | TC_084, 085 | ✅ — định dạng `DD-MM-YYYY`, `$0.00`, 3 nút biểu tượng |
| `cust_detail_vault_tab_fullpage.png` | Tab Vault rỗng | TC_088 | ⚠️ — chỉ có trạng thái rỗng; hộp thoại `Vault Entry` lấy từ DOM |
| `cust_detail_map_tab_fullpage.png` | Tab Map | TC_093 | ✅ — phát hiện nút `G` (ASM-04) |
| `cust_import_form_default_fullpage.png` | Màn hình Nhập — mặc định | TC_015, 016 | ✅ — 4 hướng dẫn; ⚠️ bảng mẫu bị cắt ngang ở cột `State` (27 cột lấy từ DOM) |
| `cust_import_file_required_error_fullpage.png` | Import khi chưa chọn tệp | TC_100 | ✅ |
| `cust_import_simulate_result.png` | Sau `Simulate Import` 3 dòng | TC_102 | ✅ viewport — 3 dòng như nhau, ô tệp về `No file chosen` |
| `cust_import_result_2_rows_in_list.png` | Danh sách sau nhập thật 2 dòng | TC_103, 118 | ✅ viewport |
| `cust_detail_show_primary_contact_visible.png` | Hồ sơ (PM) có liên hệ chính | TC_071, 116 | ✅ viewport — ô tích hiện, cột trái 15 tab |
| `cust_perm_pm_list.png` | Danh sách dưới quyền PM | TC_115 | ✅ viewport |
| `cust_perm_pm_bulk_actions_mass_delete.png` | Bulk Actions dưới quyền PM | TC_115 mục `4` | ✅ viewport |
| `cust_list_filter_dropdown_verify_20260919.png` | Dropdown bộ lọc (PM, chưa lưu bộ lọc nào) — **chụp 19-09-2026** | TC_025-b | ✅ viewport |
| `cust_list_create_filter_two_rules_verify_20260919.png` | Create Filter với 2 điều kiện, cặp `and`/`or` — **chụp 19-09-2026** | TC_026, 027, 028 | ✅ viewport |
| `cust_edit_currency_locked_after_invoice.png` | Ô Currency bị khoá ở khách hàng đã có hoá đơn — **chụp 19-09-2026** | TC_129 | ✅ chụp riêng hàng Currency, không kéo dữ liệu khách hàng |

### Vùng chưa có evidence — TC gắn `@NeedsVerify`

| Vùng / trạng thái | TC | Đề xuất recon bổ sung |
|---|---|---|
| Tab `Notes`, `Reminders` (không có ảnh nào) | TC_082, 083, 096–099 | Chụp tab rỗng + hộp thoại `New Note` / `Set Reminder` |
| Hộp thoại `Vault Entry`, `View Password`, `Assign Admin`, tạo nhóm nhanh | TC_059, 088–092, 120 | Chụp từng hộp thoại đang mở (viewport) |
| Bộ lọc **sau khi Apply**: kết quả lọc, `Clear Filter`/`Edit` xuất hiện, ô tên khi bật `Save Filter` (dòng điều kiện và cặp `and`/`or` đã có ảnh 19-09-2026) | TC_025, 027, 028, 029 | Áp bộ lọc trên khách hàng test, chụp dropdown và hộp thoại khi bật `Save Filter` |
| Hành vi sau khi lưu chưa thực thi lúc khảo sát: thông báo sửa hồ sơ, gán nhóm hàng loạt, gán quản trị viên, ghi chú, Vault, nhắc nhở | TC_035, 036, 067, 073, 082, 090, 098 | Chạy thật trên khách hàng test, chụp thông báo |
| Giới hạn 255/256 ký tự, khoảng trắng đầu/cuối, lỗi tự biến mất | TC_042, 045–047 | Đo trên khách hàng test |
| Quyết định PO chưa kiểm chứng | TC_079–081 | Xem ASM-11 |
| Kích thước màn hình khác `1600×750`, thứ tự Tab, `javascript:` ở Website, tab ẩn qua URL | TC_116, 124–126 | Chụp ở 4 kích thước đã chốt |
| Đoán lỗi: hồ sơ đã xoá, Back, 2 tab, Period ngược, Bulk không chọn dòng, sao chép khi ô nguồn trống, tệp CSV lỗi, dòng trùng email | TC_038, 066, 078, 086, 104, 105, 109, 110 | Ghi lại hành vi ở lần chạy đầu → chốt thành AMB/REQ |

---

## Đối soát loại kiểm thử (4 vòng)

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_002, TC_003, TC_005, TC_006, TC_007, TC_013, TC_016 (7 TC · 41 mục bảng kiểm) — nhãn nguyên văn, thứ tự cột/trường, trạng thái mặc định, con trỏ ở ô Company |
| 1 | Open form | ✅ | TC_001, TC_008, TC_014, TC_015 (4 TC · 9 biến thể) — mọi lối vào: menu, nút, liên kết tên, `View`, URL trực tiếp |
| 1 | Display | ✅ | TC_004, TC_084 (2 TC · 12 mục bảng kiểm) — ngày giờ `DD-MM-YYYY HH:MM:SS`, công tắc, tiền `$0.00`, khoảng ngày sao kê, quan hệ Total = Active + Inactive |
| 1 | Input valid data | ✅ | TC_009, TC_010 (2 TC) — bộ tối thiểu (chỉ Company) và bộ đầy đủ 22 trường |
| 1 | Save | ✅ | TC_009, TC_010, TC_012 (3 TC) |
| 1 | Verify data | ✅ | TC_010, TC_011 (2 TC) — đối chiếu ở biểu mẫu hồ sơ **và** ở danh sách |
| 2 | UI Behavior | ✅ | TC_042, TC_053, TC_057, TC_064, TC_065, TC_070, TC_071 (7 TC) |
| 2 | Required | ✅ | TC_039, TC_040, TC_041, TC_069, TC_089, TC_097, TC_100 (7 TC · 10 biến thể) — bỏ trống từng trường bắt buộc của 4 biểu mẫu: khách hàng · Vault · Reminder · Nhập CSV |
| 2 | Validation | ✅ | TC_043, TC_044, TC_045, TC_046, TC_047, TC_050, TC_051, TC_052, TC_054, TC_055, TC_056, TC_058, TC_061, TC_062, TC_063, TC_083, TC_092, TC_094, TC_095, TC_099, TC_105 (21 TC · 69 biến thể)<br>• **Text — Company: đủ 8/8 mục** (bắt buộc `039` · min/max `045`,`046` · toàn khoảng trắng `040` · ký tự đặc biệt `043-b` · XSS `044-a,b` · SQLi `044-c` · Unicode/emoji `043` · khoảng trắng đầu/cuối `047`)<br>• **Text tuỳ chọn — VAT/Website/Zip: 6/8 mục áp dụng** — *required* ➖ (tuỳ chọn, `009` lưu khi để trống) · *whitespace-only* ➖ (không bắt buộc nên không có gì để chặn). City/State + 8 ô địa chỉ: TC độ bền `056` (ngoại lệ hợp lệ của bảng CẤM gộp)<br>• **Phone: 5/6 mục** — *mã vùng không hợp lệ* ➖: hệ thống không kiểm định dạng (`AMB-CUST-06`), `051-e` đã chứng minh chữ lẫn số vẫn lưu<br>• **Textarea — Address/Note: 3/5 mục** — *resize* ➖ (không phải yêu cầu) · *bộ đếm ký tự* ➖ (không có trên giao diện)<br>• **Dropdown — Currency/Language/Country: 4/5 mục** — *option bị khoá* ➖ (không có option nào bị khoá) · *required* ➖ (cả 3 tuỳ chọn)<br>• **Multi-Select — Groups: 2/4 mục** — *giới hạn số lượng* ➖ (không giới hạn, `057` chọn tất cả 305) · *tag trùng/ký tự đặc biệt* ➖ (chọn từ danh sách, không gõ tag tự do)<br>• **Number — Vault Port: 7/8 mục** — *định dạng tiền tệ* ➖<br>• **Date — Reminder: 4/6 mục** — *timezone* ➖ (không có lựa chọn múi giờ) · *năm nhuận* ⏭️ xem dòng dưới<br>• **Date Range — Statement Period: 1/4 mục** — *khung giờ trùng* · *giới hạn khoảng* · *hạn chế quá khứ/tương lai* ➖: sao kê cho chọn khoảng tự do, không có quy tắc<br>• **File Upload — CSV: 3/6 mục** — *nhiều tệp* ➖ (ô nhận 1 tệp) · *kéo thả* ➖ (không có vùng kéo thả) · *dung lượng tối đa* ⏭️ xem dòng dưới<br>• **Password — Vault: 1/7 mục** (che ký tự `088`,`090`) — *độ dài, ký tự đặc biệt, hoa/thường, số* ➖: mật khẩu Vault là **dữ liệu lưu hộ khách hàng**, không phải mật khẩu đăng nhập nên không có chính sách · *ô xác nhận* ➖ (không có) · *chặn dán* ⏭️<br>• **Checkbox/Radio: 4/4 mục** — `070`,`071`,`088` (nhóm 3 nút chỉ chọn 1) |
| 2 | Validation — mục cố ý bỏ | ⏭️ Cố ý bỏ | (1) *Dung lượng tối đa tệp CSV* và *tệp nhiều dòng*: nhập thật tạo hàng loạt khách hàng trên môi trường dùng chung. (2) *Năm nhuận* ở ngày Reminder: rủi ro Thấp, tab phụ trợ. (3) *Chặn dán* ở mật khẩu Vault. **Quyết định: QA (agent đề xuất), 19-09-2026 — chờ QA lead duyệt.** Rà lại khi có môi trường riêng (1) hoặc khi Reminder/Vault được nâng rủi ro (2)(3) |
| 2 | Equivalence Partitioning | ✅ | TC_021, TC_022, TC_043, TC_044, TC_050, TC_051, TC_052, TC_054 (8 TC · 35 biến thể) — lớp hợp lệ/không hợp lệ của từ khoá tìm kiếm và các trường chữ |
| 2 | Boundary Value Analysis | ✅ | TC_019, TC_045, TC_046, TC_091, TC_092, TC_094, TC_095 (7 TC · 27 biến thể) — Company 1/254/255/256 · Port 0/1/65535/65536 · toạ độ ±90/±180 · số dòng 10…All |
| 2 | Business Rule | ✅ | TC_048, TC_049, TC_079, TC_080, TC_081, TC_104, TC_108, TC_129 (8 TC · 11 biến thể) — khoá đổi tiền tệ khi đã có giao dịch · trùng tên chỉ cảnh báo · Inactive khỏi dropdown · chặn xoá khi có dữ liệu liên quan · bỏ dòng trùng email |
| 2 | Decision Table | ➖ | Module không có quy tắc nào mà **≥ 3 điều kiện** cùng quyết định một kết quả. Tổ hợp gần nhất là bộ lọc 2 điều kiện × kiểu khớp AND/OR — đã phủ đủ 2 cột ở `TC_028` |
| 2 | State Transition | ✅ | TC_074, TC_075, TC_077, TC_081 (4 TC) — chỉ có 2 trạng thái (dưới ngưỡng 3) nhưng có thao tác phá huỷ nên vẫn lập **bảng chuyển trạng thái** ở đầu Nhóm O, part 04: mọi ô hợp lệ + ô bị chặn |
| 2 | Dependency | ✅ | TC_064, TC_065, TC_070, TC_071, TC_079, TC_080, TC_081, TC_129 (8 TC · 11 biến thể) |
| 2 | Use Case / Scenario | ✅ | TC_112 (1 TC) — tạo → sửa → ngừng hoạt động → tìm lại → kích hoạt → xoá |
| 2 | Save / Edit / Delete | ✅ | TC_067, TC_068, TC_069, TC_073, TC_076, TC_077, TC_082, TC_090, TC_098 (9 TC) — gồm huỷ giữa chừng (`068`, `076`) và xoá bản ghi đang liên kết (`081`) |
| 2 | Error Guessing | ✅ | TC_038, TC_066, TC_078, TC_086, TC_107, TC_108, TC_109, TC_110, TC_111 (9 TC · 3 biến thể) — bấm Save đúp · Save khi đang kiểm trùng · Back · 2 tab cùng sửa · F5 giữa chừng · mở hồ sơ đã xoá |
| 3 | Permission | ✅ | TC_113, TC_114, TC_115, TC_116, TC_117, TC_118, TC_119, TC_120, TC_121 (9 TC · 6 biến thể · 6 mục bảng kiểm) — 3 vai trò × 8 nhóm hành động + chưa đăng nhập, xem ma trận ở đầu part 05 |
| 3 | Security | ✅ | TC_022, TC_044, TC_056, TC_083, TC_122, TC_123, TC_124 (7 TC · 15 biến thể) — XSS/SQLi ở ô chữ và ô tìm kiếm · CSRF · xoá bằng đường dẫn · liên kết `javascript:` |
| 3 | API | ➖ | QA **không có quyền** gọi API — **đội Dev xác minh** (Năng lực kiểm thử của QA, chốt 11-09-2026 ở `docs/requirements/README.md`) |
| 3 | Database | ➖ | QA **không có quyền** truy vấn CSDL — **đội Dev xác minh**. Hệ quả: giới hạn 255 ký tự (`AMB-CUST-05`) chỉ chấm được qua giao diện ở `TC_045`, `TC_046` |
| 3 | Integration | ➖ | QA không có quyền kiểm tầng tích hợp — **đội Dev xác minh**. Hai điểm tích hợp của module đều **ngoài phạm vi** theo PO 19-09-2026: Google Maps (`AMB-CUST-09`) · Stripe (`AMB-CUST-08`) |
| 3 | Logging / Audit | ➖ | Tài khoản `Admin` demo bị **từ chối truy cập** `Utilities → Activity Log` (đo 11-09-2026). Cần Super Admin — **đề nghị PO cấp**, rà lại khi có quyền: tạo / sửa / xoá / đổi trạng thái khách hàng có ghi vết không |
| 4 | Compatibility | ✅ | TC_127 (1 TC · 3 biến thể) — Chrome · Edge · Firefox (chốt ở `LOGIN` 19-09-2026). Safari không kiểm |
| 4 | Responsive / UI Stability | ✅ | TC_125 (1 TC · 4 biến thể) — 1920×1080 · 1366×768 · 768×1024 · 375×812 |
| 4 | Accessibility | ✅ | TC_005, TC_126 (2 TC · 6 mục bảng kiểm) — con trỏ đặt sẵn, thứ tự Tab, viền tiêu điểm, chọn bằng phím. WCAG đầy đủ cần công cụ riêng → **đội Dev / chuyên gia a11y** |
| 4 | Performance | ✅ mức thô | TC_128 (1 TC) — đo tải thật ➖ **đội Hạ tầng**, chưa có công cụ tải |
| 4 | Regression | ➖ | Module **chưa có bug nào được đóng** — `docs/bugs/customers/` chưa tồn tại. Rà lại khi bug của `TC_040`, `TC_041` được fix |
| 4 | E2E | ✅ | TC_079, TC_080, TC_081 (3 TC · 11 biến thể) — khách hàng Inactive ở 11 module khác · xoá khi có dự án. Luồng xuyên module sâu hơn → `/generate-cross-module-test-plan` |

**Tổng: 129 TC · 155 biến thể · 74 mục bảng kiểm.** Không còn ô 🔴.

---

## Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)

| Đặc tính | Trạng thái | TC ID / Lý do |
|---|---|---|
| Functional Suitability | ✅ Có TC | TC_001–TC_112, TC_129 — phủ 84/84 REQ |
| Performance Efficiency | ✅ mức thô | TC_128 (danh sách `All` hơn 2.000 dòng, tìm kiếm, kiểm trùng tên). Đo tải thật ➖ — **đội Hạ tầng**, chưa có công cụ tải |
| Compatibility | ✅ Có TC | TC_127 (Chrome · Edge · Firefox), TC_031 (xuất Excel/CSV/PDF), TC_101–TC_105 (định dạng tệp nhập). Safari ➖ — không cam kết hỗ trợ |
| Interaction Capability | ✅ Có TC | TC_039, TC_041, TC_048 (thông báo lỗi & cảnh báo), TC_076 (xác nhận trước khi xoá), TC_084 (trạng thái rỗng), TC_126 (bàn phím). WCAG đầy đủ ➖ — **đội Dev / chuyên gia a11y** |
| Reliability | ✅ Có TC | TC_107–TC_111 (bấm đúp, kiểm trùng đang chạy, Back, 2 tab, F5). Mất mạng / phiên hết hạn giữa chừng ➖ — đã phủ ở module `LOGIN` (`CRM_LOGIN_TC_026`, `041`) |
| Security | ✅ Có TC | TC_113–TC_124 (3 vai trò, chưa đăng nhập, CSRF, xoá qua đường dẫn, `javascript:`), TC_022, TC_044, TC_056, TC_083 (XSS/SQLi). Pentest ➖ — **đội Security / Dev** |
| Maintainability | ➖ Không áp dụng | Đặc tính của mã nguồn — code review / static analysis, **đội Dev** |
| Flexibility | ✅ Có TC | TC_125 (4 kích thước màn hình), TC_043 (tiếng Việt, emoji, chữ Trung/Nhật), TC_061–TC_062 (tiền tệ, ngôn ngữ riêng từng khách hàng) |
| Safety | ✅ Có TC | TC_076 (hộp thoại xác nhận trước khi xoá), TC_081 (chặn xoá khi có dữ liệu liên quan), TC_123 (xoá không xác nhận qua đường dẫn — rủi ro `RISK-CUST-06`), TC_034 (cảnh báo gỡ hết nhóm) |

> Rà soát theo mô hình chất lượng ISO/IEC 25010:2023 — không phải tuyên bố tuân thủ.

---

## Nhật ký thay đổi

| Ngày | Nguồn | TC | Thay đổi | Mốc git |
|---|---|---|---|---|
| 21-09-2026 | Quy ước đặt tên | — | Đổi tên file index `test_cases_customers.md` → `TEST_CASES_CUSTOMERS_SUMMARY.md` — quy ước mới: index IN HOA để khác hẳn file nền tảng. Nội dung, mã REQ/TC không đổi; mọi link trỏ tới đã sửa | `e985e9d` |
| 19-09-2026 | Rà soát nhất quán index | — | Sửa số liệu dòng **Quy mô**: `@NeedsVerify` 49 → **51 TC** theo số đếm thật trong 5 part. Không đổi TC nào | `5d10845` |
| 19-09-2026 | Quyết định PO `AMB-CUST-14` (trả lời qua chat) | ✏️ `TC_119`, `TC_120` | PO trả lời **trùng giả định tạm cả hai vế**: PM được xoá khách hàng, PM không xem được mục Vault mức "chỉ quản trị viên". Gỡ `@AssumptionBased` ở 2 TC, thay ghi chú giả định bằng quyết định PO, ô ma trận phân quyền ❔ → ✅/❌. **Kỳ vọng không đổi**, TC ID giữ nguyên. `ASM-10` ✅ | `5d10845` |
| 19-09-2026 | Đồng bộ requirements với DOM thật (recon bằng tài khoản `Project Manager`, không ghi dữ liệu) | ✏️ `TC_003`, `TC_006`, `TC_025`, `TC_026`, `TC_027`, `TC_028`, `TC_061`, `TC_072`, `TC_093` · ➕ `TC_129` | Giải quyết `ASM-01`, `02`, `03`, `04`, `05`, `07`. Sửa tại chỗ, **TC ID giữ nguyên**: chữ gợi ý `Search...` (bị cắt trên màn hình) · chú giải `Currency` nguyên văn · dropdown bộ lọc theo tài khoản, `Clear Filter`/`Edit` ẩn khi chưa áp · cặp `and`/`or` mặc định `or` · chú giải nút `G`. Thêm `TC_129` cho `REQ-CUST-84` (khoá đổi tiền tệ khi đã có giao dịch). Chưa có automation/execution nào trỏ vào bộ TC nên không cần Delta TC List | (chưa commit) |
| 19-09-2026 | `/generate-testcases-from-requirements` Mode QUICK | `TC_001` → `TC_128` | **Sinh lần đầu** bộ TC module `CUST` — 128 TC · 155 biến thể · 5 part, độ hạt GỘP, rủi ro Cao → Đầy đủ. Phủ 83/83 REQ (gồm 5 REQ 🟡 và 2 REQ ⚪ của đợt `PO-2026-09-19`). Mở 26/26 ảnh evidence, ghi 12 giả định (5 xung đột tài liệu ↔ ảnh) | `5c0a0f4` (trước khi sinh) |
