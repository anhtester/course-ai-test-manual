# Bản đồ hệ thống — Perfex CRM (Anh Tester Demo)

> **Tầng khám phá — KHÔNG chứa mã `REQ-XXX-NN`.** Ở đây chỉ cấp **prefix** cho từng module. Mã REQ được cấp ở tầng module khi chạy `/generate-requirements-from-website`.
>
> Danh mục toàn hệ thống: [../README.md](../README.md)

---

## 1. Bối cảnh khảo sát

| Mục | Giá trị |
|---|---|
| Ngày khảo sát | 14-08-2026 |
| Mode | **UI** — repo chưa có `docs/`, không có tài liệu QA kèm theo |
| Hệ thống | Perfex CRM (bản demo tuỳ biến thương hiệu "ANHTESTER") |
| Tiền tố TC ID đã chốt | `CRM_` → `CRM_<MODULE>_TC_<3 số>` (VD `CRM_LOGIN_TC_001`) |
| URL · tài khoản | Lưu ở `.env` — **KHÔNG** ghi vào `docs/` |
| Role đã dùng | 1 account duy nhất, hiển thị **Admin Example**; **không phải full admin** (xem mục 5) |
| Môi trường dùng chung | **CÓ** — khảo sát chỉ đọc: không tạo/sửa/xoá, không bấm Save |
| Phạm vi crawl | Toàn bộ menu sidebar (2 cấp) · dropdown quick-create · dropdown hồ sơ · 1 màn hình chi tiết của Khách hàng và Dự án · tầng network |
| Kỹ thuật crawl | `browser_navigate` → `browser_evaluate` gom `a[href]` + cột bảng + nút thanh công cụ → `browser_take_screenshot(fullPage)` |
| Số module phát hiện | **23 module** được cấp prefix, viết trong **21 file** khám phá |
| Ước tổng REQ | ~560–780 REQ cho toàn hệ thống |

---

## 2. Sơ đồ điều hướng (nguyên trạng menu)

```
Dashboard                       /admin/
Customers                       /admin/clients
Projects                        /admin/projects
Tasks                           /admin/tasks
Contracts                       /admin/contracts
Sales
├── Proposals                   /admin/proposals
├── Estimates                   /admin/estimates
├── Invoices                    /admin/invoices
├── Payments                    /admin/payments
├── Credit Notes                /admin/credit_notes
└── Items                       /admin/invoice_items
Subscriptions                   /admin/subscriptions
Expenses                        /admin/expenses
Support                         /admin/tickets
Leads                           /admin/leads
Estimate Request                /admin/estimate_request
Knowledge Base                  /admin/knowledge_base
Utilities                                                  ← NGOÀI PHẠM VI (mục 8)
├── Media                       /admin/utilities/media
├── Bulk PDF Export             /admin/utilities/bulk_pdf_exporter
└── Calendar                    /admin/utilities/calendar
Reports
├── Sales                       /admin/reports/sales
├── Expenses                    /admin/reports/expenses
├── Expenses vs Income          /admin/reports/expenses_vs_income
├── Leads                       /admin/reports/leads
├── Timesheets overview         /admin/staff/timesheets?view=all
└── KB Articles                 /admin/reports/knowledge_base_articles

Ngoài sidebar:
├── Quick create (+)            invoice · estimate · proposal · credit_note · customer ·
│                               subscription · project · expense · contract · article ·
│                               ticket · event
├── Dropdown hồ sơ              /admin/profile · /admin/staff/timesheets ·
│                               /admin/staff/edit_profile · /admin/staff/change_language/* (26 ngôn ngữ)
├── To Do                       /admin/todo
├── Reminders                   /admin/misc/reminders
├── Thông báo                   /admin/profile?notifications=true
└── Đăng xuất                   /admin/authentication/logout

Setup (bánh răng)               KHÔNG tồn tại trong DOM với account hiện tại — xem mục 8
```

---

## 3. Bảng module tổng (23 module)

| # | Module (tên UI) | Bí danh | Prefix | File khám phá | Loại màn hình | Risk | Ước REQ |
|---|---|---|---|---|---|---|---|
| 1 | Login | Đăng nhập / Xác thực | `LOGIN` | [module_01](modules/module_01_dang_nhap.md) | Form | 🔴 | 12–18 |
| 2 | Customers | Khách hàng | `CUST` | [module_02](modules/module_02_khach_hang.md) | Danh sách + 19 tab | 🔴 | 45–65 |
| 3 | Contacts | Liên hệ khách hàng | `CONT` | [module_03](modules/module_03_lien_he_khach_hang.md) | Danh sách + form | 🔴 | 20–30 |
| 4 | Leads | Khách hàng tiềm năng | `LEAD` | [module_04](modules/module_04_khach_hang_tiem_nang.md) | Danh sách + Kanban | 🟡 | 30–40 |
| 5 | Projects | Dự án | `PRJ` | [module_05](modules/module_05_du_an.md) | Danh sách + 17 tab | 🔴 | 60–80 |
| 6 | Tasks | Công việc | `TASK` | [module_06](modules/module_06_cong_viec.md) | Danh sách + timer | 🔴 | 40–55 |
| 7 | Estimates | Báo giá sơ bộ | `EST` | [module_07](modules/module_07_bao_gia_so_bo.md) | Chứng từ | 🔴 | 30–40 |
| 8 | Proposals | Đề xuất | `PROP` | [module_08](modules/module_08_de_xuat_bao_gia.md) | Chứng từ | 🔴 | 30–40 |
| 9 | Invoices | Hoá đơn | `INV` | [module_09](modules/module_09_hoa_don.md) | Chứng từ + 2 màn phụ | 🔴 | 50–70 |
| 10 | Payments | Thanh toán | `PAY` | [module_10](modules/module_10_thanh_toan.md) | Danh sách tra cứu | 🔴 | 15–20 |
| 11 | Credit Notes | Giấy báo có | `CN` | [module_11](modules/module_11_giay_bao_co.md) | Chứng từ | 🔴 | 25–35 |
| 12 | Subscriptions | Đăng ký định kỳ | `SUB` | [module_12](modules/module_12_dang_ky_dinh_ky.md) | Danh sách + form | 🔴 | 25–35 |
| 13 | Contracts | Hợp đồng | `CTR` | [module_13](modules/module_13_hop_dong.md) | Danh sách + editor | 🟡 | 25–35 |
| 14 | Expenses | Chi phí | `EXP` | [module_14](modules/module_14_chi_phi.md) | Danh sách + form | 🟡 | 20–28 |
| 15 | Items | Danh mục hàng hoá/dịch vụ | `ITEM` | [module_15](modules/module_15_danh_muc_hang_hoa.md) | Danh sách + modal | 🟡 | 15–22 |
| 16 | Support Tickets | Hỗ trợ | `TICK` | [module_16](modules/module_16_ho_tro_ticket.md) | Danh sách + hội thoại | 🟡 | 30–40 |
| 17 | Estimate Request | Yêu cầu báo giá | `ESTREQ` | [module_17](modules/module_17_yeu_cau_bao_gia.md) | Form builder | 🟡 | 15–20 |
| 18 | Knowledge Base | Cơ sở tri thức | `KB` | [module_18](modules/module_18_co_so_tri_thuc.md) | Danh sách + editor | 🟢 | 12–18 |
| 19 | Reports | Báo cáo | `REP` | [module_19](modules/module_19_bao_cao.md) | Báo cáo (6 trang) | 🟡 | 20–30 |
| 20 | Dashboard | Trang tổng quan | `DASH` | [module_20](modules/module_20_dashboard_todo_nhac_nho.md) | Dashboard | 🟢 | 8–12 |
| 21 | My To Do Items | Việc cần làm | `TODO` | [module_20](modules/module_20_dashboard_todo_nhac_nho.md) | Danh sách kéo thả | 🟢 | 8–12 |
| 22 | Reminders | Nhắc nhở | `REM` | [module_20](modules/module_20_dashboard_todo_nhac_nho.md) | Danh sách | 🟢 | 8–12 |
| 23 | My Profile / Timesheets | Hồ sơ cá nhân & Chấm công | `PROF` | [module_21](modules/module_21_ho_so_ca_nhan.md) | Form + danh sách | 🟡 | 15–20 |

**Tự kiểm chứng:** 23 module ↔ 23 prefix ↔ 21 file khám phá (file `module_20` chứa 3 module). Mọi module thuộc **đúng 1 file**, không mồ côi, không trùng.

> Cột `Trạng thái recon` **không** đặt ở đây — nguồn duy nhất là [../README.md](../README.md) để tránh lệch nhau.

---

## Bản đồ tài liệu

| File | Module bao phủ | Prefix |
|---|---|---|
| [modules/module_01_dang_nhap.md](modules/module_01_dang_nhap.md) | Đăng nhập / Xác thực | `LOGIN` |
| [modules/module_02_khach_hang.md](modules/module_02_khach_hang.md) | Khách hàng | `CUST` |
| [modules/module_03_lien_he_khach_hang.md](modules/module_03_lien_he_khach_hang.md) | Liên hệ khách hàng | `CONT` |
| [modules/module_04_khach_hang_tiem_nang.md](modules/module_04_khach_hang_tiem_nang.md) | Khách hàng tiềm năng | `LEAD` |
| [modules/module_05_du_an.md](modules/module_05_du_an.md) | Dự án | `PRJ` |
| [modules/module_06_cong_viec.md](modules/module_06_cong_viec.md) | Công việc | `TASK` |
| [modules/module_07_bao_gia_so_bo.md](modules/module_07_bao_gia_so_bo.md) | Báo giá sơ bộ (Estimates) | `EST` |
| [modules/module_08_de_xuat_bao_gia.md](modules/module_08_de_xuat_bao_gia.md) | Đề xuất (Proposals) | `PROP` |
| [modules/module_09_hoa_don.md](modules/module_09_hoa_don.md) | Hoá đơn | `INV` |
| [modules/module_10_thanh_toan.md](modules/module_10_thanh_toan.md) | Thanh toán | `PAY` |
| [modules/module_11_giay_bao_co.md](modules/module_11_giay_bao_co.md) | Giấy báo có | `CN` |
| [modules/module_12_dang_ky_dinh_ky.md](modules/module_12_dang_ky_dinh_ky.md) | Đăng ký định kỳ | `SUB` |
| [modules/module_13_hop_dong.md](modules/module_13_hop_dong.md) | Hợp đồng | `CTR` |
| [modules/module_14_chi_phi.md](modules/module_14_chi_phi.md) | Chi phí | `EXP` |
| [modules/module_15_danh_muc_hang_hoa.md](modules/module_15_danh_muc_hang_hoa.md) | Danh mục hàng hoá/dịch vụ | `ITEM` |
| [modules/module_16_ho_tro_ticket.md](modules/module_16_ho_tro_ticket.md) | Hỗ trợ (Tickets) | `TICK` |
| [modules/module_17_yeu_cau_bao_gia.md](modules/module_17_yeu_cau_bao_gia.md) | Yêu cầu báo giá | `ESTREQ` |
| [modules/module_18_co_so_tri_thuc.md](modules/module_18_co_so_tri_thuc.md) | Cơ sở tri thức | `KB` |
| [modules/module_19_bao_cao.md](modules/module_19_bao_cao.md) | Báo cáo | `REP` |
| [modules/module_20_dashboard_todo_nhac_nho.md](modules/module_20_dashboard_todo_nhac_nho.md) | Dashboard · Việc cần làm · Nhắc nhở | `DASH` · `TODO` · `REM` |
| [modules/module_21_ho_so_ca_nhan.md](modules/module_21_ho_so_ca_nhan.md) | Hồ sơ cá nhân & Chấm công | `PROF` |

---

## 4. Bản đồ entity & phụ thuộc

```
                    ┌──────────────┐
                    │ LEAD         │  chuyển đổi
                    └──────┬───────┘
                           ▼
   ┌──────────────────────────────────────────────┐
   │ CUST (Khách hàng)  ── 1..n ──▶ CONT (Liên hệ)│
   └───┬───────┬───────┬────────┬────────┬────────┘
       │       │       │        │        │
       ▼       ▼       ▼        ▼        ▼
     PRJ     CTR   EST/PROP   TICK    SUB
       │                │              │
       ├──▶ TASK        ▼              ▼
       │             ┌─────┐        (sinh tự động)
       └──▶ EXP ────▶│ INV │◀───────────┘
                     └──┬──┘
                        ├──▶ PAY   (ghi nhận thanh toán)
                        └──▶ CN    (điều chỉnh giảm)

ITEM   ─── dữ liệu nền cho ▶ EST · PROP · INV · CN
REP    ─── tổng hợp số liệu từ ▶ INV · EXP · LEAD · TASK · KB
REM    ─── cắt ngang: tab Reminders trong CUST · PRJ · CTR · LEAD
ESTREQ ─── biểu mẫu công khai ▶ sinh EST
```

**Căn cứ quan sát:**
- 19 tab của màn hình chi tiết Khách hàng liệt kê đúng các module phụ thuộc phía trên.
- 17 tab của màn hình chi tiết Dự án cho thấy Dự án là điểm gom của Task, chứng từ bán hàng và chi phí.
- Cột `Project` xuất hiện ở bảng danh sách của INV · EST · PROP · CN · SUB · EXP → mọi chứng từ đều gắn được vào dự án.

### Phát hiện tầng network (cấp hệ thống)

| Quan sát | Ý nghĩa |
|---|---|
| Bảng dữ liệu nạp qua `POST /admin/<module>/table` (ghi nhận `POST /admin/tasks/table`) | Ứng dụng server-render (CodeIgniter) + DataTables server-side. **Không có REST API `/api/`** → không khai thác được schema entity từ network như hệ thống SPA |
| `GET /admin/utilities/get_calendar_data?csrf_token_name=…&start=…&end=…` | Mọi request đều mang **CSRF token** — ảnh hưởng thiết kế automation/API test về sau |
| Không thấy endpoint nào không có UI tương ứng | Không phát hiện module ⚪ *Chưa implement* |

---

## 5. Ma trận phân quyền sơ bộ (cấp module)

Chỉ có **1 tài khoản**, và **chưa xác định được tên role** của nó (màn hình Roles bị 403). Vì vậy ma trận này chỉ có 1 cột kiểm chứng.

| Khu vực | Tài khoản `admin@example.com` ("Admin Example") | Role khác |
|---|---|---|
| 21 module nghiệp vụ (mục 3) | ✅ Truy cập được | ❔ |
| `/admin/settings` (Cài đặt) | ❌ **Đã kiểm chứng** — chuyển hướng `/admin/access_denied` | ❔ |
| `/admin/staff` (Nhân viên) | ❌ **Đã kiểm chứng** — `/admin/access_denied` | ❔ |
| `/admin/roles` (Vai trò) | ❌ **Đã kiểm chứng** — `/admin/access_denied` | ❔ |

**Đã kiểm chứng: 4 ô · Suy diễn: 0 ô · Chưa rõ: mọi role khác** — hệ thống có bao nhiêu role còn chưa biết vì màn hình quản lý vai trò không mở được.

> ⚠️ Ô `❔` **không** được làm tròn thành `❌`. Khi recon từng module, mỗi role thiếu account phải mở một `AMB-XX` 🔴 tại tài liệu module đó.

---

## 6. Thứ tự khảo sát đã chốt

Xếp theo **phụ thuộc trước, rủi ro sau** (user chốt ngày 14-08-2026):

```
1. LOGIN → 2. CUST → 3. CONT → 4. LEAD → 5. PRJ → 6. TASK
→ 7. EST → 8. PROP → 9. INV → 10. PAY → 11. CN → 12. SUB
→ 13. CTR → 14. EXP → 15. ITEM → 16. TICK → 17. ESTREQ
→ 18. KB → 19. REP → 20. DASH → 21. TODO → 22. REM → 23. PROF
```

**Module bị chặn / cần điều kiện trước khi recon:**

| Module | Chặn bởi | Cần gì |
|---|---|---|
| `ESTREQ` | Bảng dữ liệu **rỗng** — không quan sát được trạng thái và thao tác trên dòng | Dữ liệu mẫu + thống nhất cách dọn (môi trường dùng chung) |
| `LEAD` · `TICK` · `EXP` · `ITEM` · `CTR` · `PAY` · `SUB` | Master data (Lead Source/Status, Departments, Services, Categories, Taxes, Payment Modes, Contract Types) nằm trong khu Setup đang 403 | Recon vẫn chạy được, nhưng danh sách giá trị chỉ suy được từ dropdown trên form — ghi rõ mức bằng chứng |
| Mọi module | Chỉ có 1 account, chưa rõ role | Account role thấp hơn để dựng ma trận phân quyền thật |

---

## 7. Vùng chưa xác minh

| Vùng | Lý do | Xử lý |
|---|---|---|
| **Khu Quản trị hệ thống (Setup)** — Settings · Staff · Roles · Departments · Taxes · Currencies · Payment Modes · Custom Fields · Email Templates · Announcements | Menu bánh răng **không có trong DOM**; thử trực tiếp `/admin/settings`, `/admin/staff`, `/admin/roles` đều bị chuyển về `/admin/access_denied` | **Ngoài phạm vi đợt này** (user chốt) — không cấp prefix. Muốn đưa vào sau: xin account quyền cao hơn rồi chạy `/discover-system` Mode ADD |
| Cổng khách hàng (front-end site) | Nằm ngoài khu `/admin`; các luồng khách ký hợp đồng, bình luận đề xuất, xem KB đều bắt nguồn từ đây | Chưa khảo sát — cần chốt phạm vi riêng |
| Form tạo/sửa của mọi module | Môi trường dùng chung, tầng khám phá chỉ quan sát danh sách | Recon cấp module sẽ mở form (chỉ xem, không Save) |
| Số lượng role của hệ thống | Màn hình Roles 403 | Chưa biết hệ thống có mấy role |

---

## 8. Vùng loại khỏi phạm vi (user chốt 14-08-2026)

| Vùng | Route | Ghi chú | Evidence đã có |
|---|---|---|---|
| Calendar (Lịch & sự kiện) | `/admin/utilities/calendar` | Loại khỏi đợt này — **không cấp prefix** | [calendar_overview_fullpage.png](evidence/calendar_overview_fullpage.png) |
| Media (File manager) | `/admin/utilities/media` | Loại khỏi đợt này — **không cấp prefix** | [media_overview_fullpage.png](evidence/media_overview_fullpage.png) |
| Bulk PDF Export | `/admin/utilities/bulk_pdf_exporter` | Loại khỏi đợt này — **không cấp prefix** | [bulk_pdf_export_form_fullpage.png](evidence/bulk_pdf_export_form_fullpage.png) |
| Quản trị hệ thống (Setup) | `/admin/settings`, `/admin/staff`, `/admin/roles`… | 403 với account hiện tại — **không cấp prefix** | [setup_access_denied_fullpage.png](evidence/setup_access_denied_fullpage.png) |

Evidence của 4 vùng này **được giữ lại** để lần sau muốn đưa vào phạm vi thì không phải khảo sát lại từ đầu.

---

## 9. Nhật ký khám phá

| Ngày | Mode | Phạm vi | Kết quả |
|---|---|---|---|
| 14-08-2026 | Recon `PRJ` | Module 5 | **Lệch so với bản đồ:** ước 60–80 REQ, thực tế **104 REQ** — lần thứ ba liên tiếp thực tế vượt ước lượng. Nguyên nhân bổ sung: bản đồ đếm 17 tab nhưng không tính **biểu mẫu 2 tab** (`Project` · `Project Settings` — riêng tab cấu hình đã 11 REQ với 18 công tắc quyền), **4 hộp thoại** (`Copy Project` · `Additional action required!` · `Project Invoice Info` · `Members`) và lớp kiểm tra dữ liệu. **Module đầu tiên phải tách file** (> 80 REQ). **Xác nhận đúng bản đồ:** route, 17 tab, CRUD gồm Copy/Export, có status flow, risk 🔴, `POST /admin/projects/table`. **Bổ sung cho bản đồ:** (1) thanh tab **không dàn phẳng 17 mục** mà gom 6 tab bán hàng vào nhóm `Sales` → hiển thị 12 mục; (2) có thêm **trang Gantt tổng** `/admin/projects/gantt` mà bản đồ chưa ghi; (3) tồn tại các điểm cuối `pin_action`, `remove_team_member`, `save_note`, `get_pre_invoice_project_info`, `export_project_data`. **Đã gỡ 3/4 vùng chưa xác minh** mà bản đồ nêu (field spec biểu mẫu · danh sách trạng thái và quy tắc chuyển · cơ chế `Visible Tabs`); còn lại **hành vi Copy Project** chưa chạy được — xem `AMB-PRJ-11`. **Cảnh báo cho các module sau:** ước lượng REQ ở tầng khám phá đang **thấp hơn thực tế 30–190%** một cách hệ thống vì chỉ đếm màn hình và tab, bỏ qua hộp thoại · trường điều kiện · thông báo lỗi · cấu hình |
| 14-08-2026 | Recon `CUST` | Module 2 | **Lệch so với bản đồ:** ước 45–65 REQ, thực tế **79 REQ** — lặp lại đúng xu hướng đã ghi nhận ở `LOGIN`. Nguyên nhân bổ sung: bản đồ đếm 19 tab nhưng không đếm **màn hình Import CSV** (8 REQ) và các **tab phụ trợ thuộc chính module** (Notes · Statement · Vault · Map · Reminders — 9 REQ). **Xác nhận đúng bản đồ:** route, 19 tab, risk 🔴, cơ chế `POST /admin/clients/table` không có REST API. **Bổ sung cho bản đồ:** biểu mẫu tạo mới có 2 tab, biểu mẫu sửa có 3 tab (thêm `Customer Admins`); tồn tại endpoint `check_duplicate_customer_name` và `change_client_status`. **Đã gỡ 3/3 vùng chưa xác minh** mà bản đồ nêu (field spec biểu mẫu · nội dung `Vault`/`Statement`/`Map` · luồng Import — luồng Import mới tới mức đặc tả giao diện, chưa chạy được, xem `AMB-CUST-12`) |
| 14-08-2026 | Recon `LOGIN` | Module 1 | **Lệch so với bản đồ:** ước 12–18 REQ, thực tế **35 REQ**. Nguyên nhân: bản đồ chỉ đếm 2 form/5 field, chưa tính lớp bảo vệ phiên (chuyển hướng 2 chiều, CSRF), luồng đăng xuất có nhánh cảnh báo timer, và điểm cuối `reset_password`. **Rút kinh nghiệm cho các module sau: ước lượng REQ ở tầng khám phá đang thấp hơn thực tế vì chỉ đếm field trên form, bỏ qua điều hướng · phân quyền · thông báo lỗi.** Xác nhận đúng bản đồ: route, loại màn hình, số tab (0), risk 🔴 |
| 14-08-2026 | UI | Toàn bộ menu sidebar + quick-create + dropdown hồ sơ + chi tiết `CUST`/`PRJ` + tầng network | Khởi tạo bản đồ: **23 module** được cấp prefix, 21 file khám phá, 30 ảnh evidence. Xác định khu Setup bị 403 → ngoài phạm vi. Loại Calendar/Media/Bulk PDF khỏi phạm vi theo chốt của user. Chốt tiền tố TC ID `CRM_` và thứ tự khảo sát *phụ thuộc → rủi ro* |
