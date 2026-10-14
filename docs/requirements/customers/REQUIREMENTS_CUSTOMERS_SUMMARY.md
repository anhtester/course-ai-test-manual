# Đặc tả Yêu cầu — Module Khách hàng (`CUST`)

> Điểm vào cấp hệ thống: [../README.md](../README.md) · Bản đồ khám phá: [../_discovery/modules/module_02_khach_hang.md](../_discovery/modules/module_02_khach_hang.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | Perfex CRM — Anh Tester Demo |
| **Module** | Khách hàng (Customers) |
| **Prefix** | `CUST` |
| **Nền tảng** | Web ✅ · Mobile — chưa có · API — chưa có |
| **Route** | `/admin/clients` · `/admin/clients/client` (tạo) · `/admin/clients/client/{id}` (chi tiết/sửa) · `/admin/clients/client/{id}?group=<tab>` · `/admin/clients/import` · `/admin/clients/delete/{id}` |
| **Nguồn phân tích** | Khảo sát UI thực tế + đọc DOM + tầng network — chi tiết trình duyệt ở file nền tảng web |
| **Ngày phân tích** | 14-08-2026 |
| **Tài khoản dùng khảo sát** | 14-08-2026: "Admin Example" (`user-id-2`) · 19-09-2026: thêm "Project Manager" (`user-id-3`, không phải quản trị viên) để dựng ma trận phân quyền |
| **Môi trường dùng chung** | **CÓ** — đợt 14-08-2026 tạo 3 khách hàng thử nghiệm (`13364`, `13365`, `13366`) và **đã xoá sạch**. Đợt 19-09-2026 nhập CSV tạo **2 khách hàng** `14625`, `14626` (`auto_import_cust_20260919034844_1/2`) — ⚠️ **chưa dọn**, xem Nhật ký thay đổi |
| **Tổng số REQ** | **84** |
| **Dải mã đã dùng** | `REQ-CUST-01` → `REQ-CUST-84` · `AMB-CUST-01` → `AMB-CUST-14` · `RISK-CUST-01` → `RISK-CUST-08` |
| **Mã kế tiếp** | Đợt phân tích sau bắt đầu từ `REQ-CUST-85` · `AMB-CUST-15` · `RISK-CUST-09` — **KHÔNG đánh lại từ 01** |

---

## 1. Tổng quan

Module Khách hàng quản lý toàn bộ vòng đời hồ sơ khách hàng của CRM. Đây là **entity trung tâm** của hệ thống: hơn 10 module khác (Hoá đơn, Dự án, Hợp đồng, Đề xuất, Báo giá, Thanh toán, Chi phí, Đăng ký định kỳ, Hỗ trợ, Công việc) đều tham chiếu tới khách hàng. Module hỏng đồng nghĩa chặn phần lớn nghiệp vụ bán hàng.

Module gồm **4 màn hình chính**:

| Màn hình | Route | Vai trò |
|---|---|---|
| Danh sách khách hàng | `/admin/clients` | Bảng dữ liệu server-side, bảng tổng quan, tìm kiếm, lọc, xuất, thao tác hàng loạt |
| Thêm khách hàng | `/admin/clients/client` | Biểu mẫu 2 tab: Customer Details · Billing & Shipping |
| Hồ sơ khách hàng | `/admin/clients/client/{id}` | 19 tab nghiệp vụ; tab Profile chứa biểu mẫu sửa 3 tab |
| Nhập từ CSV | `/admin/clients/import` | Nhập hàng loạt 27 cột, có chế độ chạy thử |

### Trong phạm vi

- Toàn bộ CRUD khách hàng: xem danh sách, tạo, sửa, xoá, bật/tắt trạng thái hoạt động
- Tìm kiếm nhanh, bộ lọc tuỳ biến 15 tiêu chí, bộ lọc lưu sẵn
- Xuất dữ liệu (Excel · CSV · PDF · Print) và thao tác hàng loạt (xoá hàng loạt · gán nhóm)
- Địa chỉ thanh toán / giao hàng và hai lối sao chép nhanh
- Kiểm tra dữ liệu đầu vào và cảnh báo trùng tên công ty
- Gán quản trị viên phụ trách (Customer Admins)
- Các tab phụ trợ thuộc **chính** module: Notes · Statement · Vault · Map · Reminders
- Nhập khách hàng từ tệp CSV

### Ngoài phạm vi

| Vùng | Lý do |
|---|---|
| Tab `Contacts` và màn hình `/admin/clients/all_contacts` | Thuộc module `CONT` — liên hệ có tài khoản đăng nhập cổng khách hàng riêng |
| Tab `Invoices` · `Payments` · `Proposals` · `Credit Notes` · `Estimates` · `Subscriptions` · `Expenses` · `Contracts` · `Projects` · `Tasks` · `Tickets` | **View chiếu** dữ liệu của module khác lọc theo khách hàng — đặc tả thuộc `INV`, `PAY`, `PROP`, `CN`, `EST`, `SUB`, `EXP`, `CTR`, `PRJ`, `TASK`, `TICK` |
| Tab `Files` (attachments) | Cơ chế đính kèm dùng chung toàn hệ thống, tách riêng khi recon module `MEDIA` |
| Quản trị nhóm khách hàng (`/admin/clients/groups`) | Thuộc khu Setup — 403 với tài khoản hiện tại |
| Cổng khách hàng (front-end ngoài `/admin`) | `system_map.md` mục 7 — chưa chốt phạm vi |
| Cột `Stripe id` của tệp CSV nhập | Chỉ phục vụ tích hợp cổng thanh toán Stripe, không có trường tương ứng trên UI — chốt `AMB-CUST-08` 19-09-2026 |
| Hiển thị bản đồ Google Maps ở tab `Map` | Môi trường thiếu khoá API Google Maps — chỉ test tới mức **lưu được toạ độ**, phần hiển thị ghi `Không test được`. Chốt `AMB-CUST-09` 19-09-2026 |

---

## Bản đồ tài liệu

| Nền tảng | File | Story | REQ bao phủ |
|---|---|---|---|
| Chung ≥ 2 nền tảng | chính file này | — | — (module mới có một nền tảng) |
| Web | [web/requirements_customers_web.md](web/requirements_customers_web.md) | STORY-CUST-01 → 10 | `REQ-CUST-01` → `REQ-CUST-84` (84) |

| Nội dung | Ở đâu |
|---|---|
| Metadata · Tổng quan & phạm vi (mục 1) · Ma trận phân quyền (6) · Ma trận trạng thái (7) · Phân rã Story (10) · AMB & RISK (11) · Nhật ký (13) | **File này** |
| Bản đồ phủ tài liệu (2) · Bảng REQ (3) · Đặc tả trường (4) · Business rules & Validation (5) · Luồng xử lý (8) · Phi chức năng quan sát được (9) · Danh mục Evidence (12) | [web/requirements_customers_web.md](web/requirements_customers_web.md) |
| Ảnh evidence | [web/evidence/](web/evidence/) |

---

## 6. Ma trận Phân quyền

> Hệ thống có đúng **3 vai trò** (danh mục `docs/requirements/README.md`): `Admin` · `Project Manager` (nhân sự **không phải** quản trị viên) · `Customer` (liên hệ khách hàng, đăng nhập cổng riêng ở `/login`). Hộp thoại `Assign Admin` (REQ-CUST-54) xác nhận chỉ có **3 nhân sự**, nên không tồn tại vai trò nhân sự thứ ba.
>
> Cột `Admin` kiểm chứng 14-08-2026. Cột `Project Manager` kiểm chứng 19-09-2026 bằng tài khoản PM (`user-id-3`, `app.user_is_admin` rỗng). Khu Setup (`/admin/roles`, `/admin/staff`) với PM **chuyển hướng về `/admin/clients`** — vẫn không đọc được màn hình cấu hình quyền.

**Ký hiệu:** ✅ đã **thực thi** thành công · ✅ᵁᴵ giao diện hiện đủ chức năng (trang mở được, nút/link có mặt) nhưng **không gửi** thao tác — tránh ghi/xoá dữ liệu trên môi trường dùng chung · ❌ bị chặn · ❌ᴾᴼ bị chặn **theo quyết định PO**, chưa thử thật · ❔ chưa kiểm chứng

| Hành động | Admin | Project Manager | Customer |
|---|---|---|---|
| Xem danh sách khách hàng | ✅ | ✅ thấy **toàn bộ** 2.031 khách hàng, không chỉ khách được gán | ❌ |
| Tìm kiếm & lọc | ✅ | ✅ | ❌ |
| Xuất dữ liệu (Excel/CSV/PDF/Print) | ✅ | ✅ᵁᴵ nút `Export` | ❌ |
| Thao tác hàng loạt (xoá / gán nhóm) | ✅ | ✅ᵁᴵ modal `Bulk Actions` có `Mass Delete` và `Groups` | ❌ |
| Tạo khách hàng mới | ✅ | ✅ᵁᴵ biểu mẫu mở được, có nút `Save` · ✅ tạo thật qua Nhập CSV | ❌ |
| Sửa hồ sơ khách hàng | ✅ | ✅ᵁᴵ biểu mẫu sửa mở được, có nút `Save` | ❌ |
| Bật/tắt trạng thái hoạt động | ✅ | ✅ gạt `14626` sang Inactive (Inactive 9 → 10) rồi bật lại (10 → 9) | ❌ |
| Xoá khách hàng | ✅ | ✅ᵁᴵ link `Delete` trên từng dòng · PO xác nhận **được phép** 19-09-2026 (`AMB-CUST-14` ✅) | ❌ |
| Gán quản trị viên phụ trách | ✅ | ✅ᵁᴵ nút `Assign Admin` | ❌ |
| Xem mục Vault mức "chỉ quản trị viên" | ✅ | ❌ᴾᴼ theo quyết định PO 19-09-2026 (`AMB-CUST-14` ✅) — chưa thử thật: chưa có mục mức 2 nào | ❌ |
| Nhập khách hàng từ CSV | ✅ | ✅ nhập thật 2 dòng, `Total Imported: 2` | ❌ |
| Tạo nhóm khách hàng nhanh từ biểu mẫu | ✅ | ✅ᵁᴵ nút `+` mở `#customer_group_modal` | ❌ |
| Số tab trong hồ sơ khách hàng | 19 (`REQ-CUST-48`) | 15 — thiếu `Payments` · `Proposals` · `Subscriptions` · `Expenses` (`REQ-CUST-83`) | ❌ |

```
Đã kiểm chứng: 38/39 ô — Admin 13 · Project Manager 12 (5 thực thi + 7 mức UI) · Customer 13
Theo quyết định PO, chưa thử thật: 1 ô — PM xem mục Vault "chỉ quản trị viên" (ᴾᴼ, AMB-CUST-14 ✅)
Chưa rõ: 0 ô
Cột Customer: ❌ toàn bộ theo REQ-LOGIN-43 — liên hệ khách hàng không đăng nhập được vào /admin
```

> ⚠️ **PM có giao diện đầy đủ như Admin với mọi thao tác phá huỷ** (xoá từng bản ghi, `Mass Delete` toàn bộ khách hàng) — trái giả định tạm của `AMB-CUST-01` (*"vai trò không phải Admin không xoá được"*). PO xác nhận 19-09-2026 đây là **cấu hình cố ý** — PM được phép xoá khách hàng (`AMB-CUST-14` ✅). Rủi ro thao tác nhầm vẫn còn — xem `RISK-CUST-08`.
>
> Riêng REQ-CUST-68 cho biết hệ thống **có** phân biệt "quản trị viên" với "nhân sự thường" ở mức dữ liệu Vault (`Visible only to administrators`).

---

## 7. Ma trận Trạng thái

Khách hàng có đúng **2 trạng thái**, điều khiển bằng công tắc ở cột `Active` của danh sách.

| Trạng thái hiện tại | Hành động cho phép | Trạng thái kế tiếp | Ai được thực hiện | REQ |
|---|---|---|---|---|
| *(chưa tồn tại)* | Tạo khách hàng mới · Nhập CSV | **Active** | Admin ✅ · PM ✅ (qua Nhập CSV) · Customer ❌ | REQ-CUST-33, 56, 79 |
| **Active** | Gạt công tắc sang tắt (`change_client_status/{id}/0`) | **Inactive** | Admin ✅ · PM ✅ · Customer ❌ | REQ-CUST-57 |
| **Active** | Sửa hồ sơ · Xoá | Active / *(bị xoá)* — bị chặn nếu đang có dữ liệu liên quan | Admin ✅ · PM ✅ᵁᴵ · Customer ❌ | REQ-CUST-50, 61, 82 |
| **Inactive** | Gạt công tắc sang bật (`change_client_status/{id}/1`) | **Active** | Admin ✅ · PM ✅ · Customer ❌ | REQ-CUST-58 |
| **Inactive** | Sửa hồ sơ · Xoá | Inactive / *(bị xoá)* — bị chặn nếu đang có dữ liệu liên quan | Admin ✅ · PM ✅ᵁᴵ · Customer ❌ | REQ-CUST-50, 61, 82 |

**Hệ quả nghiệp vụ của trạng thái Inactive:** khách hàng `Inactive` **không xuất hiện trong dropdown khi tạo bản ghi mới** ở các module khác (REQ-CUST-59). PO chốt 19-09-2026 (`AMB-CUST-10`): áp cho **mọi** dropdown chọn khách hàng ở **tất cả** module → `REQ-CUST-81` (⚪ chưa kiểm chứng).

---

## 10. Phân rã Epic / Story (Backlog View)

| Story ID | Tên Story | REQ bao phủ | Số REQ | AMB / RISK liên quan | Ghi chú phạm vi |
|---|---|---|---|---|---|
| STORY-CUST-01 | Danh sách khách hàng & bảng tổng quan | REQ-CUST-01 → 10 | 10 | RISK-CUST-05 | Nền tảng cho mọi luồng khác |
| STORY-CUST-02 | Tìm kiếm & bộ lọc | REQ-CUST-11 → 17 | 7 | RISK-CUST-05 | Bộ lọc lưu sẵn là dữ liệu dùng chung giữa các tester |
| STORY-CUST-03 | Xuất dữ liệu & thao tác hàng loạt | REQ-CUST-18 → 22 | 5 | RISK-CUST-02, RISK-CUST-06 | **Không test xoá hàng loạt** trên môi trường dùng chung |
| STORY-CUST-04 | Tạo khách hàng mới | REQ-CUST-23 → 34 | 12 | AMB-CUST-05, AMB-CUST-06, AMB-CUST-07, RISK-CUST-04 | Luồng nghiệp vụ cốt lõi |
| STORY-CUST-05 | Địa chỉ thanh toán & giao hàng | REQ-CUST-35 → 39 | 5 | — | Độc lập, test được song song |
| STORY-CUST-06 | Kiểm tra dữ liệu & cảnh báo trùng tên | REQ-CUST-40 → 46 | 7 | AMB-CUST-02, AMB-CUST-03, AMB-CUST-04, RISK-CUST-03 | `REQ-CUST-42`, `43` ghi kỳ vọng đúng mà hệ thống **chưa đạt** → TC FAIL, mở bug |
| STORY-CUST-07 | Hồ sơ khách hàng & chỉnh sửa | REQ-CUST-47 → 55, 83, 84 | 11 | AMB-CUST-13, AMB-CUST-08 | 19 tab (Admin) / 15 tab (PM) — 11 tab thuộc module khác |
| STORY-CUST-08 | Trạng thái hoạt động & xoá | REQ-CUST-56 → 62, 81, 82 | 9 | AMB-CUST-10, AMB-CUST-11, AMB-CUST-14, RISK-CUST-06, RISK-CUST-07, RISK-CUST-08 | Thao tác phá huỷ — cần dữ liệu riêng · `REQ-CUST-81`, `82` đang ⚪ |
| STORY-CUST-09 | Các tab phụ trợ của hồ sơ | REQ-CUST-63 → 71 | 9 | AMB-CUST-09 | Notes · Statement · Vault · Map · Reminders |
| STORY-CUST-10 | Nhập khách hàng từ CSV | REQ-CUST-72 → 80 | 9 | AMB-CUST-12 | Đã kiểm chứng nhập thật 19-09-2026 |

**Tổng: 10 Story / 84 REQ — mọi REQ thuộc đúng một Story, không mồ côi, không trùng.**

### 10.1. Hạng mục cấp Epic (cố ý không gán vào Story nào)

| Hạng mục | Lý do |
|---|---|
| Ma trận Phân quyền (mục 6) | Cắt ngang cả 10 Story. Đã kiểm chứng 38/39 ô ngày 19-09-2026; ô còn lại chốt theo quyết định PO (`AMB-CUST-14` ✅), chưa thử thật |
| Ma trận Trạng thái (mục 7) | Trạng thái Active/Inactive ảnh hưởng tới hành vi của Story 01, 04, 07, 08 |
| Yêu cầu phi chức năng (mục 9) | Áp cho toàn module, không thuộc một luồng cụ thể |
| Bảng Ambiguity & Risk (mục 11) | Đánh số theo toàn module |

### 10.2. Thứ tự triển khai đề xuất

| # | Story | Lý do xếp trước | Trạng thái |
|---|---|---|---|
| 1 | STORY-CUST-04 Tạo khách hàng | Mọi Story khác cần có khách hàng để thao tác | Sẵn sàng |
| 2 | STORY-CUST-06 Kiểm tra dữ liệu | Đi liền với Story 04, chứa 2 lỗi đã được PO xác nhận | Sẵn sàng — 2 TC dự kiến FAIL (`REQ-CUST-42`, `43`) |
| 3 | STORY-CUST-01 Danh sách | Nền tảng để xác minh kết quả của Story 04 | Sẵn sàng |
| 4 | STORY-CUST-05 Billing & Shipping | Độc lập, rủi ro thấp | Sẵn sàng |
| 5 | STORY-CUST-07 Hồ sơ & chỉnh sửa | Cần khách hàng đã tạo ở Story 04 | Sẵn sàng |
| 6 | STORY-CUST-02 Tìm kiếm & lọc | Cần dữ liệu đủ đa dạng | Sẵn sàng |
| 7 | STORY-CUST-08 Trạng thái & xoá | Thao tác phá huỷ — chạy sau cùng trong nhóm CRUD, cần dữ liệu riêng | Sẵn sàng · ⚠️ `REQ-CUST-82` cần môi trường riêng, `REQ-CUST-81` cần rà 11 module |
| 8 | STORY-CUST-09 Tab phụ trợ | Rủi ro thấp, không chặn ai | Sẵn sàng |
| 9 | STORY-CUST-03 Xuất & hàng loạt | Xoá hàng loạt phải hoãn trên môi trường dùng chung | ⚠️ Một phần hoãn (`RISK-CUST-02`) |
| 10 | STORY-CUST-10 Nhập CSV | Mỗi lần chạy tạo bản ghi thật — phải dọn sau khi chạy | Sẵn sàng |

> Ma trận Phân quyền **đã gỡ BLOCKED** 19-09-2026 (`AMB-CUST-01` ✅) — 38/39 ô kiểm chứng. **Không còn Story nào BLOCKED.**

---

## 11. Điểm Mơ Hồ & Rủi Ro

### 11.1. Ambiguities

| Mã | Câu hỏi | Nguy cơ | Mức độ | Assumption tạm | Trạng thái | Kết luận |
|---|---|---|---|---|---|---|
| AMB-CUST-01 | Xin tài khoản vai trò `Project Manager` và các vai trò khác để kiểm chứng 24 ô đang bỏ trống trong ma trận phân quyền của module `CUST` | Không kiểm chứng được ranh giới quyền; rò rỉ dữ liệu khách hàng cho vai trò không được phép sẽ không bị phát hiện | 🔴 | Mọi vai trò không phải Admin **không** xoá được khách hàng và **không** thấy mục Vault mức "chỉ quản trị viên" | ✅ Đã trả lời 19-09-2026 | Tài khoản PM có sẵn trong `.env`. Kiểm chứng 19-09-2026: 38/39 ô. **Khác giả định tạm** — PM có giao diện xoá / xoá hàng loạt như Admin. Phần còn treo tách sang `AMB-CUST-14` |
| AMB-CUST-02 | Company chỉ chứa khoảng trắng (`"   "`) vượt qua kiểm tra bắt buộc và tạo được khách hàng "tên rỗng" — lỗi hay cố ý? | Danh sách sinh ra bản ghi không có tên, không tìm kiếm được, hiển thị trống ở mọi dropdown của 10+ module tham chiếu | 🔴 | Đây là **lỗi** — kiểm tra bắt buộc phải cắt khoảng trắng trước khi xét | ✅ Đã trả lời 19-09-2026 | PO: **là lỗi**. `REQ-CUST-43` đổi sang kỳ vọng đúng (🟡) — hệ thống chưa đạt, cần mở bug |
| AMB-CUST-03 | Khi lỗi bắt buộc nằm ở tab không hiển thị, hệ thống chỉ đổi màu nhãn tab mà **không** tự chuyển sang tab đó — chấp nhận được không? | Người dùng bấm Save nhiều lần mà không hiểu vì sao không lưu được; test thủ công dễ báo nhầm "nút Save hỏng" | 🔴 | Đây là **lỗi trải nghiệm** — cần tự chuyển về tab chứa lỗi đầu tiên | ✅ Đã trả lời 19-09-2026 | Chốt theo giả định tạm. `REQ-CUST-42` đổi sang kỳ vọng đúng (🟡) — hệ thống chưa đạt, cần mở bug |
| AMB-CUST-04 | Cảnh báo trùng tên đôi khi chặn lần bấm `Save` đầu tiên, đôi khi không — phụ thuộc việc phản hồi AJAX về kịp hay chưa | Kết quả test không ổn định; automation sẽ flaky ở đúng bước này | 🟡 | Bấm `Save` khi request kiểm tra đang chạy thì lần bấm đó bị bỏ qua, phải bấm lại | ✅ Đã trả lời 19-09-2026 | Chốt theo giả định tạm — ghi ở mục 5.1, automation xử lý theo `RISK-CUST-03` |
| AMB-CUST-05 | Không trường text nào khai báo `maxlength`. Giới hạn độ dài thực tế của `company`, `vat`, `phonenumber`, `website`, `city`, `state`, `zip` là bao nhiêu? | Không viết được test biên; nhập quá dài có thể gây lỗi 500 hoặc cắt dữ liệu âm thầm | 🟡 | Giới hạn theo cột CSDL (thường 191–255 ký tự); test biên tạm dùng 255 và 256 | ✅ Đã trả lời 19-09-2026 | Chốt theo giả định tạm: giới hạn 255 — ghi vào Đặc tả trường mục 4.1, chưa kiểm chứng |
| AMB-CUST-06 | `Website`, `Phone`, `VAT Number` đều là `type=text` không ràng buộc định dạng. Có quy tắc định dạng nào ở phía máy chủ không? | Dữ liệu bẩn đi vào hệ thống rồi lan sang hoá đơn, hợp đồng, cổng khách hàng | 🟡 | Không có kiểm tra định dạng — nhập gì cũng lưu | ✅ Đã trả lời 19-09-2026 | Chốt theo giả định tạm — ghi vào Đặc tả trường mục 4.1 |
| AMB-CUST-07 | Danh sách Groups có **305** mục với rất nhiều tên trùng nhau (`Information Technology` xuất hiện ~50 lần, `Platinum` ~23 lần, `LUISGR` ~28 lần). Nhóm khách hàng có được phép trùng tên không? | Người dùng không phân biệt được nhóm nào là nhóm nào; báo cáo theo nhóm sai hoàn toàn | 🟡 | Là dữ liệu rác của môi trường demo, không phải quy tắc nghiệp vụ; sản phẩm thật cần chặn trùng tên nhóm | ✅ Đã trả lời 19-09-2026 | Chốt theo giả định tạm. Quản trị nhóm nằm ngoài phạm vi (khu Setup) — không sinh REQ |
| AMB-CUST-08 | Cột `Stripe id` có trong tệp CSV nhập nhưng **không** có trường tương ứng trên biểu mẫu UI | Không sửa/xem được giá trị này sau khi nhập; không biết có test được không | 🟡 | Trường chỉ dùng cho tích hợp cổng thanh toán Stripe, không thuộc phạm vi test UI | ✅ Đã trả lời 19-09-2026 | Chốt theo giả định tạm — thêm vào **Ngoài phạm vi** mục 1 |
| AMB-CUST-09 | `Longitude` / `Latitude` nhập được (qua tab Map và CSV) nhưng bản đồ **không hiển thị** vì thiếu khoá API Google Maps | Không kiểm chứng được toạ độ nhập vào có đúng không; REQ-CUST-70 chỉ test được phần nhập liệu | 🟡 | Chấp nhận test tới mức lưu được toạ độ; phần hiển thị bản đồ ghi `Không test được` | ✅ Đã trả lời 19-09-2026 | Chốt theo giả định tạm — thêm vào **Ngoài phạm vi** mục 1 |
| AMB-CUST-10 | "Khách hàng Inactive không hiện trong dropdown khi tạo bản ghi mới" — cụ thể là những màn hình nào? Hoá đơn, dự án, hợp đồng, báo giá đều áp dụng chứ? | Không biết phải kiểm chứng ở bao nhiêu module; bỏ sót là để lọt lỗi rò rỉ khách hàng đã ngừng hoạt động | 🟡 | Áp dụng cho **mọi** dropdown chọn khách hàng ở tất cả module | ✅ Đã trả lời 19-09-2026 | Chốt theo giả định tạm → `REQ-CUST-81` (⚪) |
| AMB-CUST-11 | Xoá khách hàng **đang có** hoá đơn / dự án / hợp đồng thì hệ thống xử lý ra sao — chặn, xoá lan, hay để lại bản ghi mồ côi? | Đây là kịch bản rủi ro cao nhất của module; nếu xoá lan thì mất dữ liệu tài chính | 🔴 | Hệ thống **chặn** và báo lỗi | ✅ Đã trả lời 19-09-2026 | PO: hệ thống **chặn và báo lỗi** → `REQ-CUST-82` (⚪ — cần môi trường riêng để kiểm chứng) |
| AMB-CUST-12 | Luồng nhập CSV chưa kiểm chứng (không tải tệp lên môi trường dùng chung). Thông báo kết quả nhập, cách báo dòng lỗi, hành vi của `Simulate Import` ra sao? | `REQ-CUST-79` đang ⚪; toàn bộ STORY-CUST-10 chưa test được | 🟡 | `Simulate Import` chỉ hiển thị bản xem trước, không ghi dữ liệu | ✅ Đã trả lời 19-09-2026 | PO cho phép nhập thật 2 khách hàng trên môi trường dùng chung. `Simulate Import` không ghi dữ liệu (**trùng giả định**) → `REQ-CUST-80`; nhập thật báo `Total Imported: 2` → `REQ-CUST-79` |
| AMB-CUST-13 | Checkbox `Show primary contact full name…` bị ẩn khi khách hàng chưa có liên hệ. Điều kiện hiển thị chính xác là gì — cần ≥ 1 liên hệ, hay cần một liên hệ được đánh dấu là liên hệ chính? | Viết TC sai điều kiện tiền đề, test sẽ fail giả | 🟢 | Hiện khi khách hàng có ít nhất 1 liên hệ được đánh dấu **Primary Contact** | ✅ Đã trả lời 19-09-2026 | Chốt theo giả định tạm; kiểm chứng được vế "có 1 liên hệ chính → hiện" trên `14625` → `REQ-CUST-53` 🟡 |
| AMB-CUST-14 | Tài khoản `Project Manager` thấy link `Delete` từng dòng và `Mass Delete` trong `Bulk Actions` giống hệt Admin. (1) PM có **thực sự** được phép xoá khách hàng — kể cả xoá hàng loạt toàn bộ danh sách — không? (2) PM có xem được mục Vault mức `Visible only to administrators` không? | Nhân sự không phải quản trị viên xoá được dữ liệu mà hơn 10 module tham chiếu tới | 🟡 | Đây là **cấu hình quyền cố ý** của môi trường demo (PM được cấp đủ quyền Customers) · PM **không** thấy mục Vault mức 2 | ✅ Đã trả lời 19-09-2026 | **Trùng Giả định tạm cả hai vế.** (1) PM **được phép** xoá khách hàng — cấu hình quyền cố ý. (2) PM **không** xem được mục Vault mức `Visible only to administrators`. Không đổi REQ nào; `CRM_CUST_TC_119`, `120` gỡ `@AssumptionBased`. *Cách kiểm chứng đề xuất trước đó (vẫn dùng được khi chạy TC):* (1) kiểm chứng được mà không cần môi trường riêng: dùng tài khoản PM xoá `14625` hoặc `14626` (khách hàng nhập 19-09-2026) — vừa kiểm chứng vừa dọn dữ liệu. (2) cần Admin tạo 1 mục Vault mức 2 trên khách hàng test |

### 11.2. Risks

| Mã | Rủi ro | Mô tả | Mitigation |
|---|---|---|---|
| RISK-CUST-01 | Entity trung tâm, phạm vi ảnh hưởng rất rộng | Hơn 10 module tham chiếu tới khách hàng. Một thay đổi ở `CUST` có thể làm hỏng hoá đơn, dự án, hợp đồng mà bộ test của `CUST` không phát hiện | Sau mỗi lần sửa module `CUST`, chạy kèm bộ smoke của `INV`, `PRJ`, `CTR`. Ưu tiên sinh RTM để thấy rõ liên đới |
| RISK-CUST-02 | Môi trường dùng chung chứa dữ liệu thật | 1.571 khách hàng, 361 liên hệ đang hoạt động; ảnh chụp màn hình chứa email và số điện thoại thật | **Cấm** xoá hàng loạt và xoá bản ghi không phải do mình tạo. Mọi bản ghi test dùng tiền tố `auto_recon_` + dấu thời gian và **phải xoá sau khi chạy**. Không commit ảnh evidence lên repo công khai |
| RISK-CUST-03 | Kiểm tra trùng tên gây test không ổn định | Kiểm tra chạy bất đồng bộ khi rời ô `company`; bấm `Save` quá nhanh thì lần bấm đầu bị nuốt (xem `AMB-CUST-04`) | Automation phải chờ request `check_duplicate_customer_name` kết thúc trước khi bấm `Save`; **không** dùng hard sleep mà chờ theo trạng thái phản hồi |
| RISK-CUST-04 | Dữ liệu chuẩn nằm sau khu Setup bị 403 | Danh sách nhóm khách hàng (305), tiền tệ (2), quốc gia (251) đến từ bảng chuẩn không xem/sửa được bằng tài khoản hiện tại | Giả định danh sách cố định trong đợt test; nếu số lượng option thay đổi giữa các lần chạy thì đó là dữ liệu bị người khác sửa, không phải lỗi sản phẩm |
| RISK-CUST-05 | Bảng nạp bất đồng bộ dễ gây khẳng định sai | Mọi thao tác lọc/tìm/phân trang đều đi qua `POST /admin/clients/table`; đọc DOM ngay sau thao tác sẽ thấy dữ liệu cũ | Chờ theo dòng trạng thái `Showing … entries` đổi giá trị hoặc chờ request kết thúc; **không** đọc bảng ngay sau khi gõ |
| RISK-CUST-06 | Thao tác xoá dùng GET | `GET /admin/clients/delete/{id}` xoá ngay, không cần xác nhận khi mở thẳng URL. Trình duyệt, trình thu thập hoặc một cú dán URL nhầm đều có thể xoá dữ liệu thật | **Cấm** đưa URL xoá vào bất kỳ bước điều hướng nào của automation. Chỉ xoá qua nút `Delete` + hộp thoại xác nhận, và chỉ với bản ghi do test tạo ra |
| RISK-CUST-07 | Thuộc tính HTML `checked` không phản ánh trạng thái thật của công tắc Active | Sau khi gạt công tắc, thuộc tính `checked` trong HTML **vẫn còn** trong khi thuộc tính DOM `.checked` đã là `false` | Automation phải đọc **property** `.checked`, tuyệt đối không đọc `getAttribute('checked')` hay so khớp chuỗi HTML |
| RISK-CUST-08 | Nhân sự không phải quản trị viên có giao diện xoá hàng loạt | Tài khoản `Project Manager` thấy `Mass Delete` trong `Bulk Actions` và link `Delete` trên mọi dòng (2.031 khách hàng). Nếu quyền phía server cũng mở thì một thao tác nhầm của PM xoá được dữ liệu mà hơn 10 module tham chiếu (xem `AMB-CUST-14`) | Không chạy `Mass Delete` bằng bất kỳ tài khoản nào trên môi trường dùng chung. Kiểm chứng quyền xoá của PM chỉ trên bản ghi do test tạo ra. ⚠️ **Đã chấp nhận 19-09-2026** — PO xác nhận PM được phép xoá là cấu hình cố ý (`AMB-CUST-14` ✅); rủi ro thao tác nhầm vẫn còn, không giảm thiểu thêm |

---

## 13. Nhật ký Thay đổi

| Ngày | Nguồn | REQ ảnh hưởng | Loại | Tóm tắt thay đổi | TC cần xử lý |
|---|---|---|---|---|---|
| 21-09-2026 | Quy ước đặt tên | — | ✏️ Biên tập | Đổi tên file index `requirements_customers.md` → `REQUIREMENTS_CUSTOMERS_SUMMARY.md` — quy ước mới: index IN HOA để khác hẳn file nền tảng. Nội dung, mã REQ/TC không đổi; mọi link trỏ tới đã sửa | — |
| 19-09-2026 | Quyết định PO (trả lời qua chat) | — · Ma trận Phân quyền | ✏️ Biên tập | `AMB-CUST-14` ✅ — **trùng Giả định tạm cả hai vế**: PM được phép xoá khách hàng (cấu hình cố ý), PM **không** xem được mục Vault mức "chỉ quản trị viên". Không đổi REQ nào. Ma trận: ô Vault × PM từ `❔` → `❌ᴾᴼ` (quyết định PO, chưa thử thật). `RISK-CUST-08` → **đã chấp nhận**. Module **hết ambiguity treo (14/14)** | `CRM_CUST_TC_119`, `CRM_CUST_TC_120` — gỡ `@AssumptionBased`, `ASM-10` ✅ |
| 19-09-2026 | Recon đối chiếu evidence (sau `/generate-testcases-from-requirements`) | REQ-CUST-11, 15, 16, 17, 22, 70, 84 | 🟡 Sửa · 🟢 Thêm | Bộ TC phát hiện 5 chỗ tài liệu ≠ ảnh evidence (ASM-01/02/03/04/07 của `TEST_CASES_CUSTOMERS_SUMMARY.md`); đo lại trên DOM thật bằng tài khoản `Project Manager`. **Tài liệu thiếu** → sửa: `15` cặp kiểu khớp nhãn `and`/`or`, mặc định `or`, chỉ hiện khi có điều kiện · `17` `Clear Filter`/`Edit` ẩn khi chưa áp bộ lọc, bộ lọc đã lưu khác nhau giữa tài khoản, trạng thái rỗng `No saved filters…` · `22` dòng cảnh báo đỏ gỡ hết nhóm · `70` nút `G` *Fetch from google*. **Tài liệu đúng, ảnh gây hiểu nhầm** → chỉ ghi chú (`✏️`, giữ 🟢): `11` chữ gợi ý `Search...` bị cắt còn `Search..` do ô hẹp · `16` `Save Filter` là ô tích hiển thị dạng công tắc. **Phát hiện mới** → `REQ-CUST-84` 🟢: khoá đổi tiền tệ khi khách hàng đã có giao dịch (kiểm chứng trên khách hàng `13339`). 3 ảnh evidence mới. Không tạo/sửa/xoá dữ liệu nào (hộp thoại bộ lọc đóng không Apply) | ✏️ `TC_003`, `TC_006`, `TC_025`, `TC_027`, `TC_028`, `TC_061`, `TC_072`, `TC_093` · ➕ `TC_129` cho `REQ-CUST-84` |
| 19-09-2026 | Chuyển tầng nền tảng | REQ-CUST-01 → 83 | ✏️ Biên tập | **Chuyển sang cấu trúc tầng nền tảng** (skill `skills-requirements-analyzer` mục 5.3): toàn bộ 83 REQ chỉ áp web → `web/requirements_customers_web.md` cùng mục 2, 3, 4, 5, 8, 9, 12; ảnh `evidence/` → `web/evidence/`. Index giữ metadata, phạm vi, ma trận, Story, AMB/RISK, Nhật ký và thêm `## Bản đồ tài liệu`. **Mã REQ, số mục và nội dung không đổi** | — |
| 19-09-2026 | `PO-2026-09-19` | REQ-CUST-42, 43 | 🟡 Sửa | PO chốt `AMB-CUST-02` là lỗi, `AMB-CUST-03` theo giả định — hai REQ đổi từ mô tả hành vi thực tế sang **kỳ vọng đúng**. Hệ thống hiện chưa đạt → cần mở bug | ➕ Viết mới — **dự kiến FAIL** |
| 19-09-2026 | `PO-2026-09-19` | REQ-CUST-53, 73, 79 | 🟡 Sửa | `53`: chốt điều kiện hiển thị checkbox (`AMB-CUST-13`), kiểm chứng vế có liên hệ chính. `73`: ngày ví dụ trong hướng dẫn là ngày hiện tại, không cố định. `79`: ⚪ → kiểm chứng nhập thật, `Total Imported: {n}` (`AMB-CUST-12`) | ➕ Viết mới |
| 19-09-2026 | `PO-2026-09-19` | REQ-CUST-80, 83 | 🟢 Thêm | `80`: `Simulate Import` không ghi dữ liệu, không đánh dấu dòng trùng email. `83`: PM thấy 15/19 tab hồ sơ | ➕ Viết mới |
| 19-09-2026 | `PO-2026-09-19` | REQ-CUST-81, 82 | ⚪ Thêm | Quyết định PO chưa kiểm chứng được: `81` loại khách hàng Inactive khỏi mọi dropdown (`AMB-CUST-10`) · `82` chặn xoá khách hàng có dữ liệu liên quan (`AMB-CUST-11`) | ➕ Viết mới, gắn `assumption-based` |
| 19-09-2026 | `PO-2026-09-19` | REQ-CUST-48 · mục 1, 4.1, 5, 5.1, 6, 7 | ✏️ Biên tập | `48` ghi rõ 19 tab là góc nhìn Admin. Ngoài phạm vi thêm `Stripe id` và hiển thị bản đồ (`AMB-CUST-08`, `09`). Đặc tả trường thêm giới hạn 255 và không kiểm định dạng (`AMB-CUST-05`, `06`). **Ma trận phân quyền dựng lại** bằng tài khoản PM: 38/39 ô (`AMB-CUST-01`) — PM có giao diện xoá / xoá hàng loạt → `AMB-CUST-14` (mới) + `RISK-CUST-08` (mới). `AMB-CUST-04`, `07` chốt theo giả định, không đổi REQ. **12/13 AMB đóng**, còn treo 1 (`AMB-CUST-14`). Dữ liệu tạo ra: khách hàng `14625`, `14626` — ⚠️ **chưa dọn**. Impact Report: [impact/impact_PO-2026-09-19.md](impact/impact_PO-2026-09-19.md) | — |
| 14-08-2026 | UI recon | REQ-CUST-01 → 79 | 🟢 Thêm | Khởi tạo tài liệu từ khảo sát UI thực tế, đọc DOM và tầng network. 79 REQ · 10 Story · 13 AMB (3 mức 🔴) · 7 RISK · 21 ảnh evidence. Đã tạo 3 khách hàng thử nghiệm và xoá sạch sau khi khảo sát | — (viết TC mới) |
