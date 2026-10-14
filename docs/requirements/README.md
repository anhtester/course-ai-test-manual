# Danh mục Requirements — Perfex CRM (Anh Tester Demo)

> **Điểm vào cấp hệ thống.** Mọi workflow đụng tới `docs/` đọc file này **trước tiên**: module nào đã có tài liệu · **prefix nào đã bị chiếm** · mã REQ kế tiếp · ambiguity 🔴 còn treo.
>
> Bản đồ hệ thống chi tiết: [`_discovery/system_map.md`](_discovery/system_map.md)

| Mục | Giá trị |
|---|---|
| Hệ thống | Perfex CRM — Anh Tester Demo |
| Tiền tố TC ID | `CRM_` → `CRM_<MODULE>_TC_<3 số>` |
| Môi trường dùng chung | **CÓ** — cấm thao tác phá huỷ, phải dọn dữ liệu test sau khi chạy |
| URL · tài khoản | `.env` (không commit) — **KHÔNG** ghi credentials vào `docs/` |
| **Vai trò hệ thống** | **3 vai trò**, đã có tài khoản đủ cả 3 (18-08-2026): `Admin` và `Project Manager` đăng nhập ở `/admin/authentication` · `Customer` đăng nhập ở **`/login`** (cổng khách hàng, hệ thống đăng nhập **tách biệt** — không vào được `/admin`) |
| **Năng lực kiểm thử của QA** | Chốt 11-09-2026 — dùng cho nhánh **Vòng 3** của **mọi** bộ TC:<br>• Gọi API: ❌ không có quyền — **đội Dev** xác minh<br>• Truy vấn CSDL: ❌ không có quyền — **đội Dev** xác minh<br>• Kiểm tầng tích hợp: ❌ không có quyền — **đội Dev** xác minh<br>• Xem nhật ký hoạt động: ❌ **đã đo 11-09-2026** — `Utilities → Activity Log` (`/admin/utilities/activity_log`) trả trang **Từ chối truy cập** với tài khoản `Admin` demo. Cần Super Admin, **đề nghị PO cấp**<br>• DevTools trình duyệt: ✅ có — dùng cho TC gắn `@TechCheck` |
| Khởi tạo | 14-08-2026 bởi `/discover-system` (Mode UI) |

---

## 1. Bảng danh mục module (23 module)

| Module | Prefix | Trạng thái recon | Mức phủ tài liệu | Tài liệu | REQ đã dùng | Mã kế tiếp | AMB treo | Cập nhật |
|---|---|---|---|---|---|---|---|---|
| Đăng nhập / Xác thực | `LOGIN` | ✅ Đã có tài liệu | ⬜ Trắng | [login/REQUIREMENTS_LOGIN_SUMMARY.md](login/REQUIREMENTS_LOGIN_SUMMARY.md) | `REQ-LOGIN-01` → `REQ-LOGIN-44` (44) | `REQ-LOGIN-45` | **0** — đã xử lý 20/20 | 19-09-2026 |
| Khách hàng | `CUST` | ✅ Đã có tài liệu | ⬜ Trắng | [customers/REQUIREMENTS_CUSTOMERS_SUMMARY.md](customers/REQUIREMENTS_CUSTOMERS_SUMMARY.md) | `REQ-CUST-01` → `REQ-CUST-84` (84) | `REQ-CUST-85` | **0** — đã xử lý 14/14 | 19-09-2026 |
| Liên hệ khách hàng | `CONT` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-CONT-01` | — | 14-08-2026 |
| Khách hàng tiềm năng | `LEAD` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-LEAD-01` | — | 14-08-2026 |
| Dự án | `PRJ` | ✅ Đã có tài liệu | ⬜ Trắng | [projects/REQUIREMENTS_PROJECTS_SUMMARY.md](projects/REQUIREMENTS_PROJECTS_SUMMARY.md) | `REQ-PRJ-01` → `REQ-PRJ-104` (104) | `REQ-PRJ-105` | 6 🔴 (AMB-PRJ-01→04, 06, 14) · 7 🟡 · 3 🟢 | 14-08-2026 |
| Công việc | `TASK` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-TASK-01` | — | 14-08-2026 |
| Báo giá sơ bộ (Estimates) | `EST` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-EST-01` | — | 14-08-2026 |
| Đề xuất (Proposals) | `PROP` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-PROP-01` | — | 14-08-2026 |
| Hoá đơn | `INV` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-INV-01` | — | 14-08-2026 |
| Thanh toán | `PAY` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-PAY-01` | — | 14-08-2026 |
| Giấy báo có (Credit Notes) | `CN` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-CN-01` | — | 14-08-2026 |
| Đăng ký định kỳ | `SUB` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-SUB-01` | — | 14-08-2026 |
| Hợp đồng | `CTR` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-CTR-01` | — | 14-08-2026 |
| Chi phí | `EXP` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-EXP-01` | — | 14-08-2026 |
| Danh mục hàng hoá/dịch vụ | `ITEM` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-ITEM-01` | — | 14-08-2026 |
| Hỗ trợ (Tickets) | `TICK` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-TICK-01` | — | 14-08-2026 |
| Yêu cầu báo giá | `ESTREQ` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-ESTREQ-01` | — | 14-08-2026 |
| Cơ sở tri thức | `KB` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-KB-01` | — | 14-08-2026 |
| Báo cáo | `REP` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-REP-01` | — | 14-08-2026 |
| Dashboard | `DASH` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-DASH-01` | — | 14-08-2026 |
| Việc cần làm (To Do) | `TODO` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-TODO-01` | — | 14-08-2026 |
| Nhắc nhở | `REM` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-REM-01` | — | 14-08-2026 |
| Hồ sơ cá nhân & Chấm công | `PROF` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-PROF-01` | — | 14-08-2026 |

**Bảng mã trạng thái recon:** ⬜ Chưa khảo sát · 🟨 Đang khảo sát · ✅ Đã có tài liệu · ⏸️ Hoãn · ⚪ Chưa implement
**Bảng mã mức phủ tài liệu:** 🟩 Đầy đủ · 🟨 Một phần · ⬜ Trắng · ⚠️ Nghi lỗi thời

### Prefix đã chiếm (module mới PHẢI chọn prefix ngoài danh sách này)

```
LOGIN · CUST · CONT · LEAD · PRJ · TASK · EST · PROP · INV · PAY · CN · SUB
CTR · EXP · ITEM · TICK · ESTREQ · KB · REP · DASH · TODO · REM · PROF
```

### Vùng chưa cấp prefix (ngoài phạm vi đợt 14-08-2026)

| Vùng | Lý do | Muốn đưa vào thì làm gì |
|---|---|---|
| Quản trị hệ thống (Setup: Settings · Staff · Roles · Departments · Taxes · Currencies · Payment Modes · Custom Fields · Email Templates) | 403 với tài khoản hiện tại | Xin account quyền cao hơn → chạy `/discover-system` **Mode ADD** |
| Calendar · Media · Bulk PDF Export | User chốt loại khỏi phạm vi | Chạy `/discover-system` **Mode ADD** khi cần |
| Cổng khách hàng (front-end ngoài `/admin`) | Chưa chốt phạm vi | Chốt phạm vi rồi chạy Mode ADD |

---

## 2. Trạng thái REQ toàn hệ thống

Đã recon **3/23 module**. Ước lượng khi recon xong toàn hệ thống: **~700–950 REQ** (nâng từ ~560–780 — cả ba module đã recon đều vượt xa ước lượng của tầng khám phá).

| Trạng thái | Số lượng | Chi tiết |
|---|---|---|
| 🟢 Active | 199 | `LOGIN` 26 · `CUST` 73 · `PRJ` 100 |
| 🟡 Changed | 25 | `LOGIN` 16 — 15 REQ sửa trong hai đợt ngày 18-08-2026 (rà soát chất lượng + chốt quyết định PO) · `REQ-LOGIN-42` sửa 19-09-2026 (`AMB-LOGIN-19` ✅). Trong đó **`REQ-LOGIN-16` và `REQ-LOGIN-25` ghi kỳ vọng đúng mà hệ thống chưa đạt** → TC sẽ FAIL, phải mở bug · `CUST` 9 — `42`, `43`, `53`, `73`, `79` sửa 19-09-2026 (`PO-2026-09-19`) · `15`, `17`, `22`, `70` sửa 19-09-2026 (recon đối chiếu evidence). Trong đó **`REQ-CUST-42` và `REQ-CUST-43` ghi kỳ vọng đúng mà hệ thống chưa đạt** → TC sẽ FAIL, phải mở bug |
| 🔴 Deprecated | 0 | — |
| ⚪ Chưa implement | 7 | `LOGIN` 2 — `REQ-LOGIN-27` và `REQ-LOGIN-40`, **cả hai ra ngoài phạm vi kiểm thử** theo quyết định PO 18-08-2026 · `CUST` 2 — `REQ-CUST-81` (Inactive bị loại khỏi mọi dropdown, chưa rà 11 module) và `REQ-CUST-82` (chặn xoá khách hàng có dữ liệu liên quan, cần môi trường riêng) · `PRJ` 4 — `REQ-PRJ-89`, `91`, `94` (CRUD mốc tiến độ / tệp / thảo luận, không chạy trên môi trường dùng chung) và `REQ-PRJ-104` (nội dung tệp `Export project data`, không tải tệp về) |
| **Tổng** | **232** | |

> ✅ **REQ 🟡 của `LOGIN` đã có test case** trong [`testcases/login/`](../testcases/login/TEST_CASES_LOGIN_SUMMARY.md), viết theo bản đã sửa. Khi REQ đổi tiếp, cập nhật TC bằng `/update-testcases-from-impact` — **không** dùng bản trước 18-08-2026.
>
> ✅ **`LOGIN` không còn Story nào BLOCKED** sau quyết định PO 18-08-2026 — phạm vi kiểm thử gồm **42/44 REQ** (2 REQ ⚪ ra ngoài phạm vi).

---

## 3. Ambiguity 🔴 High còn treo

### 3.1. Ambiguity 🔴 High theo module

| Mã | Module | Câu hỏi | Chặn cái gì |
|---|---|---|---|
| ~~AMB-LOGIN-01~~ | `LOGIN` | ✅ **ĐÃ GỠ 18-08-2026** — 3 vai trò `Admin` · `Project Manager` · `Customer`, **đã được cấp đủ tài khoản** | Đây là nút thắt lớn nhất của toàn dự án. Nay **mọi module đều dựng được ma trận phân quyền thật** |
| [AMB-PRJ-01](projects/REQUIREMENTS_PROJECTS_SUMMARY.md#71-ambiguities) | `PRJ` | Xin tài khoản vai trò `Project Manager` và các vai trò khác để kiểm chứng 28 ô bỏ trống trong ma trận phân quyền | Ma trận phân quyền của `PRJ` — BLOCKED hoàn toàn |
| [AMB-PRJ-02](projects/REQUIREMENTS_PROJECTS_SUMMARY.md#71-ambiguities) | `PRJ` | Bảng tổng quan đếm **67** dự án `In Progress` nhưng lọc ra đúng **60** dòng (lệch 7); 4 trạng thái còn lại khớp chính xác. Số nào đúng? | STORY-PRJ-01 · Dashboard cũng hiển thị `67 / 125` theo nguồn sai này |
| [AMB-PRJ-03](projects/REQUIREMENTS_PROJECTS_SUMMARY.md#71-ambiguities) | `PRJ` | Xoá dự án **thành công** nhưng chuyển tới `/admin/not_found` kèm `Something went wrong. Try again` — không có thông báo thành công | STORY-PRJ-10 · test thủ công sẽ chấm FAIL nhầm |
| [AMB-PRJ-04](projects/REQUIREMENTS_PROJECTS_SUMMARY.md#71-ambiguities) | `PRJ` | `Deadline` sớm hơn `Start Date` được chấp nhận ở cả client lẫn server — lỗi hay cố ý? | STORY-PRJ-04 · dữ liệu hỏng lan sang Gantt, mốc tiến độ, báo cáo |
| [AMB-PRJ-06](projects/REQUIREMENTS_PROJECTS_SUMMARY.md#71-ambiguities) | `PRJ` | Dự án **0 công việc** hiển thị `Project Progress 100%` trong khi thẻ `Open Tasks` cùng trang ghi `0%` | STORY-PRJ-07 · báo cáo tiến độ sai với mọi dự án mới |
| [AMB-PRJ-14](projects/REQUIREMENTS_PROJECTS_SUMMARY.md#71-ambiguities) | `PRJ` | `Visible Tabs` và 18 công tắc quyền khách hàng tác động tới khu quản trị hay chỉ cổng khách hàng? | STORY-PRJ-03 (11 REQ) — BLOCKED; cổng khách hàng ngoài phạm vi toàn dự án |

**Đã xử lý — không còn chặn tiến độ:**

> Bảng dưới chỉ liệt kê AMB có **hệ quả cần nhớ ở cấp hệ thống**. Đủ 20/20 AMB của `LOGIN` và 14/14 AMB của `CUST` xem ở bảng Ambiguities của [`REQUIREMENTS_LOGIN_SUMMARY.md`](login/REQUIREMENTS_LOGIN_SUMMARY.md) · [`REQUIREMENTS_CUSTOMERS_SUMMARY.md`](customers/REQUIREMENTS_CUSTOMERS_SUMMARY.md).

| Mã | Module | Trạng thái | Kết luận |
|---|---|---|---|
| AMB-LOGIN-02 | `LOGIN` | ✅ Đã trả lời 18-08-2026 | Không có cơ chế khoá tài khoản → chốt `REQ-LOGIN-41`. Kéo theo `RISK-LOGIN-03` **đóng**, `RISK-LOGIN-01` chuyển sang **xác nhận** |
| AMB-LOGIN-04 | `LOGIN` | ⏭️ Bỏ qua 18-08-2026 | Không kiểm chứng luồng gửi mail với email có thật. `REQ-LOGIN-27` ra ngoài phạm vi · `RISK-LOGIN-04` **chấp nhận** |
| AMB-LOGIN-14 | `LOGIN` | ⏭️ Chuyển module 18-08-2026 | Kiểm chứng popup cảnh báo timer giao cho module `TASK` — **nhớ cập nhật ngược `REQ-LOGIN-30`** khi recon `TASK` |
| AMB-LOGIN-15 | `LOGIN` | ⏭️ Bỏ qua 18-08-2026 | Remember Me không hoạt động → `REQ-LOGIN-40` ra ngoài phạm vi · thêm `RISK-LOGIN-08` (checkbox vẫn hiển thị và vẫn cấp cookie) |
| AMB-LOGIN-19 | `LOGIN` | ✅ Đã trả lời 19-09-2026 | Phiên 1 giờ tính theo **thời gian không hoạt động**, mỗi thao tác gia hạn lại → `REQ-LOGIN-42` thêm AC gia hạn. `LOGIN` **hết ambiguity treo** |
| AMB-LOGIN-20 | `LOGIN` | ✅ Đã trả lời 19-09-2026 | Truy cập qua `http://` **bắt buộc** tự chuyển sang HTTPS + HSTS → thêm `REQ-LOGIN-44`. Hệ thống chưa đạt (đo `curl -I`) → bug `TC039` giữ mở |
| AMB-CUST-01 | `CUST` | ✅ Đã trả lời 19-09-2026 | Dựng lại ma trận phân quyền bằng tài khoản PM: 38/39 ô. **Khác giả định tạm** — PM có giao diện xoá / `Mass Delete` như Admin → tách `AMB-CUST-14` 🟡 + `RISK-CUST-08` |
| AMB-CUST-14 | `CUST` | ✅ Đã trả lời 19-09-2026 | Trùng giả định: PM **được** xoá khách hàng (cấu hình cố ý) · PM **không** xem mục Vault mức "chỉ quản trị viên". `RISK-CUST-08` → đã chấp nhận. `CUST` **hết ambiguity treo** |
| AMB-CUST-02 | `CUST` | ✅ Đã trả lời 19-09-2026 | Company toàn khoảng trắng vẫn lưu được **là lỗi** → `REQ-CUST-43` 🟡, cần mở bug |
| AMB-CUST-03 | `CUST` | ✅ Đã trả lời 19-09-2026 | Theo giả định: phải tự chuyển về tab chứa lỗi → `REQ-CUST-42` 🟡, cần mở bug |
| AMB-CUST-11 | `CUST` | ✅ Đã trả lời 19-09-2026 | Hệ thống chặn và báo lỗi → `REQ-CUST-82` ⚪, cần môi trường riêng để kiểm chứng |

### 3.2. Vấn đề cấp hệ thống đang treo

| Vấn đề | Ảnh hưởng | Cần ai giải quyết |
|---|---|---|
| ✅ **ĐÃ GIẢI QUYẾT 18-08-2026** — chỉ có 1 account, chưa biết hệ thống có mấy role | Đã được cấp tài khoản **đủ 3 vai trò**. Ma trận phân quyền của `LOGIN` đã kiểm chứng 100%, của `CUST` 38/39 ô (19-09-2026). ⚠️ **`PRJ` vẫn còn 28 ô `❔`** — recon từ trước khi có tài khoản, cần **chạy lại phần ma trận phân quyền** bằng tài khoản `Project Manager` | Việc còn lại: cập nhật ma trận cho `PRJ` (`AMB-PRJ-01`) |
| Master data (Taxes · Payment Modes · Departments · Lead Sources · Contract Types…) nằm sau khu Setup 403 | Danh sách giá trị hợp lệ của nhiều dropdown chỉ suy được, không kiểm chứng được. ⚠️ Tài khoản `Project Manager` **cũng bị `access_denied`** ở khu Setup — vấn đề này **chưa** được gỡ | Cần account có quyền vào khu Setup |
| Không có môi trường riêng để test thao tác phá huỷ | `REQ-CUST-82` (xoá khách hàng có dữ liệu liên quan — PO đã chốt hành vi, chưa kiểm chứng), `AMB-PRJ-11` (sao chép dự án) và `AMB-PRJ-13` (CRUD các tab thuộc dự án) không kiểm chứng được. Xoá hàng loạt cũng phải hoãn. Nhập CSV **đã gỡ** — PO cho phép nhập thật trên môi trường dùng chung (19-09-2026) | Cấp một môi trường staging riêng, hoặc chốt cho phép chạy trong khung giờ thấp điểm |
| Cổng khách hàng nằm ngoài phạm vi | `AMB-PRJ-14` — toàn bộ `STORY-PRJ-03` (11 REQ về `Visible Tabs` và 18 công tắc quyền khách hàng) chỉ kiểm chứng được ở mức "biểu mẫu ghi nhận đúng", không kiểm chứng được tác dụng thật. Cùng vấn đề sẽ lặp lại ở `CTR` (khách ký hợp đồng), `PROP` (khách bình luận đề xuất), `KB` | Chốt phạm vi cổng khách hàng: đưa vào hay xác nhận loại bỏ vĩnh viễn |
| Dữ liệu rác từ các đợt automation trước | Danh sách dự án có hơn 50 bản ghi `AUTO_POM_*`, `Project Automation *`, `[AUTO_HT] *` không được dọn. Mọi khẳng định theo tổng số bản ghi đều không tin được | Thống nhất quy ước đặt tên + dọn dữ liệu cho mọi đợt chạy automation; cân nhắc một đợt dọn thủ công dữ liệu rác đang tồn |

---

## 4. Cấu trúc thư mục chuẩn

```
docs/requirements/
├── README.md                              ← file này — DANH MỤC
├── _discovery/                            ← TẦNG KHÁM PHÁ (không có mã REQ)
│   ├── system_map.md                      ← INDEX — TÊN FILE BẤT BIẾN
│   ├── modules/module_NN_<slug>.md        ← 21 file khám phá
│   └── evidence/*.png                     ← 30 ảnh full-page
└── <module>/                              ← TẦNG MODULE (sinh dần khi recon)
    ├── REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md           ← INDEX — TÊN FILE BẤT BIẾN · phần chung + ## Bản đồ tài liệu
    ├── web/                               ← TẦNG NỀN TẢNG — chỉ 3 tên: web · mobile · api
    │   ├── requirements_<module>_web.md   ← REQ chỉ áp web · Field Spec · Validation · Evidence
    │   ├── evidence/*.png
    │   └── stories/story_NN_<slug>.md     ← khi file nền tảng vượt ngưỡng
    ├── mobile/ · api/                     ← khi module có thêm nền tảng
    ├── analysis/analysis_<TICKET-ID>.md   ← cấp module
    └── impact/impact_<TICKET-ID>.md       ← Impact Report — input cho tầng test case
```

> **Trạng thái chuyển đổi tầng nền tảng:** `LOGIN` ✅ đã chuyển (19-09-2026) · `CUST` ✅ đã chuyển (19-09-2026) · `PRJ` còn cấu trúc cũ (`evidence/`, `stories/` nằm thẳng dưới thư mục module) — sẽ chuyển **một lần** ở lần đầu một workflow sinh/cập nhật chạm lại module đó.

---

## 5. Quy trình sử dụng

| Tình huống | Workflow | Ghi vào đâu |
|---|---|---|
| Khảo sát chi tiết một module | `/generate-requirements-from-website <module>` | `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` + cập nhật dòng tương ứng ở bảng mục 1 |
| Phát hiện module bị sót | `/discover-system` (Mode ADD) | `_discovery/` + thêm dòng ở mục 1 |
| Hệ thống deploy tính năng mới | `/discover-system` (Mode DELTA) | Nhật ký khám phá ở `system_map.md` |
| Có ticket sửa yêu cầu đã có | `/update-requirements-from-ticket` | Tài liệu module + Nhật ký thay đổi + `impact/impact_<TICKET-ID>.md` |
| **Requirements vừa đổi, bộ TC đã có cần đồng bộ** | `/update-testcases-from-impact` | Sửa tại chỗ `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md`, giữ nguyên TC ID |
| Sinh test case sau khi có requirements | `/generate-testcases-manual-rbt` hoặc `/generate-testcases-from-requirements` | `docs/testcases/<module>/` |

**Thứ tự recon đã chốt:** `LOGIN → CUST → CONT → LEAD → PRJ → TASK → EST → PROP → INV → PAY → CN → SUB → CTR → EXP → ITEM → TICK → ESTREQ → KB → REP → DASH → TODO → REM → PROF`

---

## 6. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 21-09-2026 | **Đồng bộ danh mục với thực tế `LOGIN`/`CUST`** — không đổi REQ nào. Mục 4: `LOGIN` đã chuyển tầng nền tảng từ 19-09-2026 (danh mục còn ghi cấu trúc cũ). Mục 2: phạm vi `LOGIN` sửa `39/41` → `42/44` (sau khi thêm `REQ-LOGIN-42`→`44`); bỏ cảnh báo "REQ 🟡 chưa có TC" vì `TEST_CASES_LOGIN_SUMMARY.md` đã có. Mục 3.1: ghi chú bảng "Đã xử lý" chỉ là bản rút gọn, trỏ về tài liệu module |
| 19-09-2026 | **Hai quyết định PO trả lời qua chat.** `AMB-LOGIN-20` (mở và đóng cùng ngày): ép HTTPS là **bắt buộc** → thêm `REQ-LOGIN-44` 🟢 — `LOGIN` 44 REQ, 40 trong phạm vi; `CRM_LOGIN_TC_039` chuyển truy vết từ `REQ-LOGIN-01` sang REQ mới. `AMB-CUST-14` ✅ trùng giả định, không đổi REQ. Active 198 → 199, Tổng 231 → 232. **Cả `LOGIN` lẫn `CUST` không còn ambiguity treo** |
| 19-09-2026 | **`CUST` đồng bộ requirements với evidence** — đo lại DOM thật 5 điểm lệch mà bộ TC phát hiện: 4 REQ 🟡 (`15`, `17`, `22`, `70`), 2 REQ chỉ ghi chú hiển thị (`11`, `16`), thêm `REQ-CUST-84` 🟢 (khoá đổi tiền tệ khi đã có giao dịch). Active 201 → 198, Changed 21 → 25, Tổng 230 → 231 |
| 19-09-2026 | **`LOGIN` và `PRJ` chuyển sang tầng nền tảng** (skill `skills-requirements-analyzer` mục 5.3), cùng chuẩn với `CUST`. `LOGIN`: 43 REQ + mục 2, 3, 4, 5, 8, 9, 12 → `login/web/requirements_login_web.md`, ảnh → `login/web/evidence/`. `PRJ`: `stories/` → `projects/web/stories/`, ảnh → `projects/web/evidence/`, mục 2, 6, 8 → `projects/web/requirements_projects_web.md`. Index giữ tên và vị trí, có `## Bản đồ tài liệu` mới. **Mã REQ, số mục, nội dung không đổi**. Thư mục cũ `login/evidence/`, `projects/evidence/`, `projects/stories/` đã bỏ |
| 19-09-2026 | **Chuyển `CUST` sang cấu trúc tầng nền tảng** — 83 REQ (toàn bộ chỉ áp web) cùng đặc tả trường, validation, luồng, NFR quan sát và danh mục evidence sang `customers/web/requirements_customers_web.md`; 26 ảnh sang `customers/web/evidence/`. Index `REQUIREMENTS_CUSTOMERS_SUMMARY.md` giữ nguyên tên và vị trí, thêm `## Bản đồ tài liệu`. Mã REQ, số mục và nội dung không đổi. Mục 4 của danh mục cập nhật sơ đồ có tầng nền tảng |
| 19-09-2026 | **Chốt 13 quyết định PO cho module `CUST`** (`/update-requirements-from-ticket`, nguồn `PO-2026-09-19`) — `AMB-CUST-01` dựng lại ma trận phân quyền bằng tài khoản `Project Manager` (38/39 ô) và phát hiện **PM có giao diện xoá / `Mass Delete` như Admin** → `AMB-CUST-14` + `RISK-CUST-08`. `AMB-CUST-12` nhập thật 2 khách hàng (`14625`, `14626` — ⚠️ **chưa dọn**). `AMB-CUST-02`, `03` chốt là lỗi → `REQ-CUST-42`, `43` ghi kỳ vọng đúng mà hệ thống chưa đạt → **cần mở bug**. Module lên **83 REQ**, ambiguity 🔴 của `CUST` về **0**, **không Story nào còn BLOCKED**. Impact Report: [customers/impact/impact_PO-2026-09-19.md](customers/impact/impact_PO-2026-09-19.md) |
| 19-09-2026 | **`LOGIN` hết ambiguity treo (19/19).** `AMB-LOGIN-19` ✅ — phiên 1 giờ tính theo thời gian không hoạt động, mỗi thao tác gia hạn lại → `REQ-LOGIN-42` chuyển 🟡 Changed (Active 204 → 203, Changed 15 → 16). Kèm sửa sót `RISK-LOGIN-05` trong `REQUIREMENTS_LOGIN_SUMMARY.md` (vẫn ghi `AMB-LOGIN-03` treo dù đã ⏭️ từ 18-08-2026). ⚠️ `CRM_LOGIN_TC_026` stale + cần thêm 1 TC cho vế gia hạn — xem Nhật ký của module |
| 11-09-2026 | **Bổ sung dòng `Năng lực kiểm thử của QA`** vào bảng thuộc tính đầu file — quyền gọi API · truy vấn CSDL · kiểm tầng tích hợp · xem nhật ký hoạt động · DevTools. Đây là đầu vào cho **nhánh Vòng 3** của mọi bộ TC; trước đây không có chỗ lưu nên agent phải hỏi user lại ở **từng module**, dù quyền của QA giống nhau trên toàn hệ thống. Mục nhật ký hoạt động là **kết quả đo thật** chứ không phải câu trả lời từ trí nhớ: `Utilities → Activity Log` trả **Từ chối truy cập** với tài khoản `Admin` demo. Luật *đọc trước · hỏi một lần · ghi lại ngay* đã đưa ngược vào `skills-rbt-manual-testing` (mục Vòng 3 + anti-pattern), `/discover-system` Bước 0 và `CLAUDE.md` — dự án sau không lặp lại |
| 18-08-2026 | **Chốt 13 quyết định PO còn lại + được cấp tài khoản 3 vai trò** (`/update-requirements-from-ticket`, nguồn `PO-2026-08-18-B`) — **`AMB-LOGIN-01` gỡ được nút thắt lớn nhất của toàn dự án**: có tài khoản `Admin` · `Project Manager` · `Customer`, ma trận phân quyền `LOGIN` kiểm chứng **100%**. Phát hiện `Customer` dùng hệ thống đăng nhập **tách biệt** ở `/login` và không vào được `/admin` → `REQ-LOGIN-43`. Phiên sống **1 giờ** → `REQ-LOGIN-42`. Module lên **43 REQ**, ambiguity còn treo **1**. ⚠️ Hai REQ (`16`, `25`) nay ghi kỳ vọng đúng mà hệ thống chưa đạt → **cần mở bug**. Impact Report: [login/impact/impact_PO-2026-08-18-B.md](login/impact/impact_PO-2026-08-18-B.md) |
| 18-08-2026 | **Chốt 4 quyết định PO cho module `LOGIN`** (`/update-requirements-from-ticket`, nguồn `PO-2026-08-18`) — `AMB-LOGIN-02` ✅ không khoá tài khoản → `REQ-LOGIN-41` · `AMB-LOGIN-04` ⏭️ bỏ qua luồng gửi mail · `AMB-LOGIN-14` ⏭️ chuyển kiểm chứng timer sang module `TASK` · `AMB-LOGIN-15` ⏭️ Remember Me không hoạt động. Module lên **41 REQ**, ambiguity 🔴 giảm từ 5 xuống **2**, **không Story nào còn BLOCKED**. Impact Report: [login/impact/impact_PO-2026-08-18.md](login/impact/impact_PO-2026-08-18.md) |
| 18-08-2026 | **Rà soát chất lượng module `LOGIN`** — 3 lỗi 🔴 (token `autologin` thật bị commit vào tài liệu · `REQ-LOGIN-09` có AC không chứng minh được kết luận · danh mục evidence khai sai trạng thái ảnh) và 5 lỗi 🟡. Kiểm chứng lại trên UI thật phát hiện thêm: `REQ-LOGIN-29` **sai** (đếm 2 phần tử DOM nhưng 1 cái `display:none` ở desktop), tiêu đề tab thật là `(16) Dashboard` chứ không phải `Dashboard`. Module lên **40 REQ** (thêm `36`→`40`), 17 AMB, 10 REQ chuyển 🟡. Thay 2 ảnh Dashboard full-page chứa dữ liệu khách hàng bằng ảnh viewport. Toàn bộ luật rút ra đã đưa ngược vào `skills-requirements-analyzer` mục 7.1/7.2/7.2.1 và mục 4.3 để không tái diễn ở module/dự án khác |
| 14-08-2026 | Recon module `PRJ` bằng `/generate-requirements-from-website` — **104 REQ**, 10 Story, 16 AMB (6 🔴), 7 RISK, 31 ảnh evidence. Module **vượt ngưỡng 80 REQ** nên **tách file** theo mục 5.1 của skill: index `REQUIREMENTS_PROJECTS_SUMMARY.md` + 10 file trong `stories/`. Đây là module đầu tiên của dự án phải tách. Đối chiếu danh mục với thư mục `docs/requirements/`: khớp, không có module lạc hay prefix trùng |
| 14-08-2026 | Recon module `CUST` bằng `/generate-requirements-from-website` — 79 REQ, 10 Story, 13 AMB (4 🔴), 7 RISK, 21 ảnh evidence. Module lớn hơn ước lượng của tầng khám phá (~45–65 → 79 REQ) nhưng vẫn dưới ngưỡng 80 nên **giữ 1 file**, không tách. Đối chiếu danh mục với thư mục `docs/requirements/`: khớp, không có module lạc hay prefix trùng |
| 14-08-2026 | Recon module `LOGIN` bằng `/generate-requirements-from-website` — 35 REQ, 6 Story, 14 AMB, 7 RISK, 9 ảnh evidence. Đối chiếu danh mục với thư mục `docs/requirements/`: khớp, không có module lạc hay prefix trùng |
| 14-08-2026 | Khởi tạo danh mục từ `/discover-system` Mode UI — 23 module, 23 prefix. Setup (403) và Calendar/Media/Bulk PDF Export **không cấp prefix**, ghi ở mục "Vùng chưa cấp prefix". Chốt tiền tố TC ID `CRM_` |
