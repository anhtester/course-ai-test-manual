# Ma Trận Truy Vết (RTM) — Perfex CRM · Module Đăng nhập (`LOGIN`)

| Thông tin | Nội dung |
|---|---|
| Ngày sinh | 09-10-2026 21:47 · **gắn kết quả thực thi 09-10-2026 22:09** |
| Mục đích | Báo cáo độ phủ trước release |
| Phạm vi | **Một module** `LOGIN` · nền tảng **web** · RTM 3 tầng REQ ↔ TC ↔ Automation + checklist làm nguồn phụ + **kết quả thực thi thủ công từng TC** |
| Executions | `R1` [run_1787215085](../../executions/login/web/run_1787215085/execution_report.md) — 20-08-2026, regression đầy đủ `001`→`041` · `R2` [run_1789759574](../../executions/login/web/run_1789759574/execution_report.md) — 19-09-2026, bổ sung `014`, `026`, `034`, `042`→`051` · `CL` [run_1791553365](../../executions/login/web/run_1791553365/execution_report.md) — 09-10-2026, checklist smoke 14 mục (nguồn phụ — **không** cộng vào số của bộ TC) |
| Requirements | [`requirements/login/web/requirements_login_web.md`](../../requirements/login/web/requirements_login_web.md) (44 REQ) · index [`REQUIREMENTS_LOGIN_SUMMARY.md`](../../requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md) |
| Test cases | [`testcases/login/web/test_cases_login_web.md`](../../testcases/login/web/test_cases_login_web.md) (51 TC, `CRM_LOGIN_TC_001` → `051`) |
| Automation | `D:\AI_Testing_Automation_Course\playwright-typescript-framework\src\tests\crm\login\crm-login.spec.ts` (20 test, map bằng `testId` trong annotation) |
| Checklist (nguồn phụ) | [`checklists/login/web/checklist_smoke_20261009.md`](../../checklists/login/web/checklist_smoke_20261009.md) — 14 mục, mã `CL-smoke_20261009` |
| Mốc git | `7bb9477` — ⚠️ toàn bộ `docs/` **chưa commit** sau mốc này nên mốc git không khoá được nội dung. Mốc thực tế theo thời điểm sửa file: requirements + TC **07-10-2026 20:16** · checklist **09-10-2026 21:10** · spec automation **03-10-2026 20:50** (repo automation **không** phải git repo). File nào sửa sau các mốc này thì RTM đã cũ |

---

## ⬛ Module chưa có tài liệu — nằm ngoài RTM

> ⚠️ **Mọi con số % bên dưới chỉ tính cho module `LOGIN`.** Hệ thống có **23 module**, `LOGIN` là 1 trong 3 module đã có tài liệu. **20 module chưa khảo sát** không có REQ nào nên không thể "chưa cover" — coverage 100% của `LOGIN` **không** nói gì về độ sẵn sàng release của toàn hệ thống.

| Module | Prefix | Trạng thái recon | Ghi chú |
|---|---|---|---|
| Khách hàng | `CUST` | ✅ Đã có tài liệu | Có REQ + TC nhưng **ngoài phạm vi RTM này** |
| Dự án | `PRJ` | ✅ Đã có tài liệu | Có REQ nhưng **ngoài phạm vi RTM này**; còn 6 AMB 🔴 treo |
| Liên hệ khách hàng | `CONT` | ⬜ Chưa khảo sát | — |
| Khách hàng tiềm năng | `LEAD` | ⬜ Chưa khảo sát | — |
| Công việc | `TASK` | ⬜ Chưa khảo sát | ⚠️ Phụ thuộc chéo: kiểm chứng đầu-cuối `REQ-LOGIN-30` (popup timer) thuộc module này (`AMB-LOGIN-14`) |
| Báo giá sơ bộ | `EST` | ⬜ Chưa khảo sát | — |
| Đề xuất | `PROP` | ⬜ Chưa khảo sát | — |
| Hoá đơn | `INV` | ⬜ Chưa khảo sát | — |
| Thanh toán | `PAY` | ⬜ Chưa khảo sát | — |
| Giấy báo có | `CN` | ⬜ Chưa khảo sát | — |
| Đăng ký định kỳ | `SUB` | ⬜ Chưa khảo sát | — |
| Hợp đồng | `CTR` | ⬜ Chưa khảo sát | — |
| Chi phí | `EXP` | ⬜ Chưa khảo sát | — |
| Danh mục hàng hoá/dịch vụ | `ITEM` | ⬜ Chưa khảo sát | — |
| Hỗ trợ (Tickets) | `TICK` | ⬜ Chưa khảo sát | — |
| Yêu cầu báo giá | `ESTREQ` | ⬜ Chưa khảo sát | — |
| Cơ sở tri thức | `KB` | ⬜ Chưa khảo sát | — |
| Báo cáo | `REP` | ⬜ Chưa khảo sát | — |
| Dashboard | `DASH` | ⬜ Chưa khảo sát | — |
| Việc cần làm | `TODO` | ⬜ Chưa khảo sát | — |
| Nhắc nhở | `REM` | ⬜ Chưa khảo sát | — |
| Hồ sơ cá nhân & Chấm công | `PROF` | ⬜ Chưa khảo sát | — |

Nguồn: [`docs/requirements/README.md`](../../requirements/README.md) mục 1.

---

## Tổng quan Coverage

| Metric | Giá trị | Ghi chú |
|---|---|---|
| **Requirement Coverage** (trong phạm vi) | **40/40 (100%)** | 4 REQ ⚪ ngoài phạm vi theo quyết định PO 18-08-2026 — không tính vào mẫu số. Tính trên cả 44 REQ: 40/44 (90,9%) |
| **Platform Coverage** | **40/40 (100%)** | Mọi REQ chỉ khai nền tảng web; mọi TC chạy web |
| **Automation Coverage** (theo TC) | **20/51 (39,2%)** | Bỏ 3 TC thiết kế `Automation = No` (`026`, `051`, `044`) khỏi mẫu số: **20/48 (41,7%)** |
| REQ có ≥ 1 script | 21/40 (52,5%) | ✅ đủ 16 · 🟣 một phần 5 · 🟡 chưa script 19 |
| Bộ `@Smoke` đã automate | 5/9 TC | Còn thiếu `021`, `032`, `035`, `036` — 3 trong 4 là Critical |
| REQ chỉ có checklist | **0** | Checklist smoke là TC-based — 14/14 mục đều có `TC ID liên quan` |
| Orphan tests | **0/20** | Mọi test có `testId` trỏ đúng TC đang tồn tại |
| **Execution Coverage** (TC đã chạy thủ công ≥ 1 lần) | **51/51 (100%)** | `001`→`041` ở `R1`, `042`→`051` + chạy lại `014`, `026`, `034` ở `R2` |
| **Kết quả mới nhất theo TC** | **46 PASS · 5 FAIL** · 0 BLOCKED · 0 chưa chạy | Pass rate 46/51 = **90,2%**. 5 FAIL đều có bug đang mở: `004`, `016`, `028`, `029`, `039` |
| REQ có mọi TC PASS | **35/40 (87,5%)** | 5 REQ có TC FAIL: `REQ-LOGIN-04`, `16`, `25`, `26`, `44` |
| Độ mới của kết quả | ⚠️ Lượt chạy bộ TC gần nhất là **19-09-2026** (20 ngày trước) | `001`→`041` chạy từ **20-08-2026**. Sau đó chỉ có checklist smoke 09-10-2026 (11 TC được rà lại qua checklist, đều PASS) |
| TC `@Deprecated` | 0 | — |
| Script đỏ ở lượt chạy gần nhất (08-10-2026) | Chrome 2/20 · Firefox 3/20 | `TC_016` (bug app — đúng kỳ vọng) · `TC_014` (thiếu tài khoản test) · `TC_011-d` chỉ Firefox (script). Nguồn: `reports/run_and_fix_report.md` của repo automation |
| Bug `LOGIN` đang mở | 5 | `TC_039` 🔴 Critical/P1 · `TC_016`, `TC_028` P2 · `TC_004`, `TC_029` P3 — xem [`docs/bugs/README.md`](../../bugs/README.md) |

> 📌 **Coverage ≠ chất lượng.** 100% REQ có TC nghĩa là *đã có cách kiểm*, không phải *đã đạt*. Theo kết quả thực thi, **5 REQ chưa đạt**: `REQ-LOGIN-16`, `25`, `44` (PO xác nhận là lỗi), `REQ-LOGIN-26` (bug `TC029` mới phát hiện) và `REQ-LOGIN-04` (bug mở, xem mục ⚠️). Kết luận go/no-go thuộc `/generate-test-summary-report`.

---

## Ma trận chi tiết

> Cột `Automation` đếm **số TC của REQ đã có script** / tổng TC của REQ, chỉ dựa trên `testId` trong code thật.

| REQ ID | Mô tả ngắn | TC IDs | Automation | Thực thi | Checklist | Trạng thái |
|---|---|---|---|---|---|---|
| REQ-LOGIN-01 | Truy cập trang đăng nhập | CRM_LOGIN_TC_001 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | CL-smoke_20261009-01 | ✅ Full |
| REQ-LOGIN-02 | Thành phần biểu mẫu đăng nhập | CRM_LOGIN_TC_002, CRM_LOGIN_TC_038, CRM_LOGIN_TC_042, CRM_LOGIN_TC_043, CRM_LOGIN_TC_044, CRM_LOGIN_TC_048, CRM_LOGIN_TC_049, CRM_LOGIN_TC_050 | crm-login.spec.ts (1/8) | ✅ 8/8 PASS | CL-smoke_20261009-02, CL-smoke_20261009-04, CL-smoke_20261009-05 | 🟣 Automate một phần |
| REQ-LOGIN-03 | Tự đặt con trỏ vào ô Email | CRM_LOGIN_TC_002 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | CL-smoke_20261009-03 | ✅ Full |
| REQ-LOGIN-04 | Logo dẫn về trang chủ | CRM_LOGIN_TC_004 | crm-login.spec.ts (1/1) | ❌ 0/1 PASS — FAIL `004` | — | ✅ Full ⚠️ script lệch kỳ vọng — xem mục ⚠️ |
| REQ-LOGIN-05 | Không có CAPTCHA | CRM_LOGIN_TC_003 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | — | ✅ Full |
| REQ-LOGIN-36 | Không có đăng nhập mạng xã hội | CRM_LOGIN_TC_003 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | — | ✅ Full |
| REQ-LOGIN-37 | Trang không nạp JavaScript | CRM_LOGIN_TC_003 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | — | ✅ Full |
| REQ-LOGIN-06 | Đăng nhập bằng thông tin hợp lệ | CRM_LOGIN_TC_005, CRM_LOGIN_TC_006, CRM_LOGIN_TC_010, CRM_LOGIN_TC_041, CRM_LOGIN_TC_050 | crm-login.spec.ts (3/5) | ✅ 5/5 PASS | CL-smoke_20261009-06, CL-smoke_20261009-07 | 🟣 Automate một phần |
| REQ-LOGIN-07 | Email không phân biệt hoa thường | CRM_LOGIN_TC_007 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | — | ✅ Full |
| REQ-LOGIN-38 | Email bỏ qua khoảng trắng đầu/cuối | CRM_LOGIN_TC_007 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | — | ✅ Full |
| REQ-LOGIN-08 | Tích Remember me sinh cookie `autologin` | CRM_LOGIN_TC_008 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS · ⚠️ chỉ chấm phần chính, phần 🔧 cookie chưa chạy tay | — | ✅ Full |
| REQ-LOGIN-09 | Không tích thì không sinh cookie | CRM_LOGIN_TC_009 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS · ⚠️ chỉ chấm phần chính, phần 🔧 cookie chưa chạy tay | — | ✅ Full |
| REQ-LOGIN-10 | Bỏ trống cả hai trường | CRM_LOGIN_TC_011, CRM_LOGIN_TC_043 | crm-login.spec.ts (1/2) | ✅ 2/2 PASS | CL-smoke_20261009-08 | 🟣 Automate một phần |
| REQ-LOGIN-11 | Bỏ trống riêng Email | CRM_LOGIN_TC_011 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | CL-smoke_20261009-08 | ✅ Full |
| REQ-LOGIN-12 | Bỏ trống riêng Mật khẩu | CRM_LOGIN_TC_011 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | CL-smoke_20261009-08 | ✅ Full |
| REQ-LOGIN-13 | Trình duyệt chặn email sai định dạng | CRM_LOGIN_TC_012, CRM_LOGIN_TC_045, CRM_LOGIN_TC_046 | crm-login.spec.ts (1/3) | ✅ 3/3 PASS | — | 🟣 Automate một phần |
| REQ-LOGIN-14 | Thông báo khi sai thông tin đăng nhập | CRM_LOGIN_TC_013, CRM_LOGIN_TC_014, CRM_LOGIN_TC_017, CRM_LOGIN_TC_018, CRM_LOGIN_TC_040, CRM_LOGIN_TC_045, CRM_LOGIN_TC_047, CRM_LOGIN_TC_050 | crm-login.spec.ts (4/8) | ✅ 8/8 PASS | CL-smoke_20261009-09 | 🟣 Automate một phần |
| REQ-LOGIN-15 | Thông báo lỗi không lộ email có thật | CRM_LOGIN_TC_013, CRM_LOGIN_TC_019 | crm-login.spec.ts (2/2) | ✅ 2/2 PASS | — | ✅ Full |
| REQ-LOGIN-41 | Không khoá tài khoản sau nhiều lần sai | CRM_LOGIN_TC_015 | crm-login.spec.ts (1/1) | ✅ 1/1 PASS | — | ✅ Full |
| REQ-LOGIN-16 | 🐞 Phải giữ lại email sau đăng nhập lỗi | CRM_LOGIN_TC_016 | crm-login.spec.ts (1/1) | ❌ 0/1 PASS — FAIL `016` | — | ✅ Full — script đỏ đúng kỳ vọng (bug mở) |
| REQ-LOGIN-17 | Chặn URL nội bộ khi chưa đăng nhập | CRM_LOGIN_TC_021 | — | ✅ 1/1 PASS | CL-smoke_20261009-10 | 🟡 Manual only |
| REQ-LOGIN-18 | Không ghi nhớ URL đích | CRM_LOGIN_TC_022 | — | ✅ 1/1 PASS | — | 🟡 Manual only |
| REQ-LOGIN-19 | Đã đăng nhập không vào lại trang đăng nhập | CRM_LOGIN_TC_023 | — | ✅ 1/1 PASS | — | 🟡 Manual only |
| REQ-LOGIN-20 | Đã đăng nhập không vào trang Quên mật khẩu | CRM_LOGIN_TC_023 | — | ✅ 1/1 PASS | — | 🟡 Manual only |
| REQ-LOGIN-43 | Tài khoản khách hàng bị từ chối ở `/admin` | CRM_LOGIN_TC_019, CRM_LOGIN_TC_020 | crm-login.spec.ts (2/2) | ✅ 2/2 PASS | — | ✅ Full |
| REQ-LOGIN-42 | Phiên hết hạn sau 1 giờ không hoạt động | CRM_LOGIN_TC_026, CRM_LOGIN_TC_051 | — | ✅ 2/2 PASS · QA tự chạy, không có ảnh evidence | — | 🟡 Manual only — cả 2 TC thiết kế `Automation = No` (`@Slow`, `@PersonalOnly`) |
| REQ-LOGIN-21 | Biểu mẫu mang mã CSRF | CRM_LOGIN_TC_024 | — | ✅ 1/1 PASS · ⚠️ chỉ chấm phần chính, phần 🔧 mã CSRF chưa chạy tay | — | 🟡 Manual only |
| REQ-LOGIN-22 | Từ chối mã CSRF sai | CRM_LOGIN_TC_025 | — | ✅ 1/1 PASS | — | 🟡 Manual only |
| REQ-LOGIN-44 | 🐞 Ép truy cập qua HTTPS | CRM_LOGIN_TC_039 | — | ❌ 0/1 PASS — FAIL `039` | — | 🟡 Manual only — bug Critical/P1 đang mở |
| REQ-LOGIN-23 | Truy cập trang Quên mật khẩu | CRM_LOGIN_TC_027 | — | ✅ 1/1 PASS | CL-smoke_20261009-11 | 🟡 Manual only |
| REQ-LOGIN-24 | Quên mật khẩu không có lối về đăng nhập | CRM_LOGIN_TC_027 | — | ✅ 1/1 PASS | — | 🟡 Manual only |
| REQ-LOGIN-25 | 🐞 Bỏ trống email ở Quên mật khẩu phải báo bắt buộc | CRM_LOGIN_TC_028 | — | ❌ 0/1 PASS — FAIL `028` | — | 🟡 Manual only — bug P2 đang mở |
| REQ-LOGIN-26 | Email không tồn tại ở Quên mật khẩu | CRM_LOGIN_TC_029, CRM_LOGIN_TC_030 | — | ❌ 1/2 PASS — FAIL `029` | — | 🟡 Manual only — bug `TC029` P3 đang mở |
| REQ-LOGIN-28 | Liên kết đặt lại sai trả HTTP 500 | CRM_LOGIN_TC_031 | — | ✅ 1/1 PASS | — | 🟡 Manual only |
| REQ-LOGIN-29 | Mỗi viewport một lối đăng xuất | CRM_LOGIN_TC_032, CRM_LOGIN_TC_033 | — | ✅ 2/2 PASS | CL-smoke_20261009-12 | 🟡 Manual only |
| REQ-LOGIN-30 | Cảnh báo khi còn timer chạy | CRM_LOGIN_TC_034 | — | ✅ 1/1 PASS | — | 🟡 Manual only |
| REQ-LOGIN-31 | Không có timer thì đăng xuất ngay | CRM_LOGIN_TC_035 | — | ✅ 1/1 PASS | CL-smoke_20261009-13 | 🟡 Manual only |
| REQ-LOGIN-32 | Kết thúc phiên, về trang đăng nhập | CRM_LOGIN_TC_036 | — | ✅ 1/1 PASS | CL-smoke_20261009-13, CL-smoke_20261009-14 | 🟡 Manual only |
| REQ-LOGIN-33 | URL nội bộ bị chặn sau đăng xuất | CRM_LOGIN_TC_036 | — | ✅ 1/1 PASS | CL-smoke_20261009-14 | 🟡 Manual only |
| REQ-LOGIN-39 | Cookie `autologin` không tự đăng nhập lại | CRM_LOGIN_TC_037 | — | ✅ 1/1 PASS | — | 🟡 Manual only |

**Đối chiếu số dòng:** 40 dòng = ✅ 16 + 🟣 5 + 🟡 19 + 🔴 0 + 🟠 0 ✔ · Tổng lượt TC trong cột `TC IDs` dày hơn 51 vì một TC phủ nhiều REQ (quan hệ n-n); **mọi** TC `001` → `051` đều xuất hiện ít nhất một lần.

### ⚪ REQ ngoài phạm vi kiểm thử (quyết định PO 18-08-2026 — cố ý không có TC)

| Mã | Mô tả ngắn | Lý do |
|---|---|---|
| REQ-LOGIN-27 | Email có thật thì gửi liên kết đặt lại | `AMB-LOGIN-04` ⏭️ — không kiểm chứng luồng gửi mail thật trên môi trường dùng chung · `RISK-LOGIN-04` đã chấp nhận |
| REQ-LOGIN-34 | Cookie `autologin` không bị xoá khi đăng xuất | `AMB-LOGIN-06` ⏭️ — ghi nhận hiện trạng, không viết TC |
| REQ-LOGIN-35 | Cookie `autologin` đọc được bằng JavaScript | `AMB-LOGIN-07` ⏭️ — `RISK-LOGIN-02` đã chấp nhận |
| REQ-LOGIN-40 | Cookie `autologin` khi phiên hết hạn tự nhiên | `AMB-LOGIN-15` ⏭️ — PO xác nhận Remember me không hoạt động · `RISK-LOGIN-08` |

---

## Kết quả thực thi theo TC

> **Cách đọc:** `Thực thi gần nhất` = kết quả của lượt chạy **bộ TC** mới nhất có chạy TC đó (`R1` 20-08-2026 · `R2` 19-09-2026). Cột `Checklist 09-10` là lượt rà nhanh bằng checklist smoke (`CL`) — chỉ để tham khảo độ mới, **không** thay kết quả TC. Cột `Script 08-10` là lượt chạy automation gần nhất (Chrome / Firefox, nguồn `reports/run_and_fix_report.md` của repo automation). 🕓 = TC đã sửa **sau** lần chạy.

| TC ID | Priority | REQ | Thực thi gần nhất | Lượt | Lịch sử | Checklist 09-10 | Script 08-10 | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| CRM_LOGIN_TC_001 | Critical | 01 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-01` | ✅ / ✅ | Bỏ phần 🔧 |
| CRM_LOGIN_TC_002 | Critical | 02, 03 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-02` → `-05` | ✅ / ✅ | 6/6 mục bảng kiểm · bỏ phần 🔧 |
| CRM_LOGIN_TC_003 | Medium | 05, 36, 37 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | Bỏ phần 🔧 |
| CRM_LOGIN_TC_004 | Low | 04 | ❌ FAIL | R1 · 20-08-2026 | — | — | ✅ / ✅ | Bug [BUG_login_1787226513_TC004](../../bugs/login/web/BUG_login_1787226513_TC004.md) P3 đang mở. ⚠️ Script PASS vì assert kỳ vọng khác TC — xem mục ⚠️ |
| CRM_LOGIN_TC_005 | Critical | 06 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-06` | ✅ / ✅ | Bỏ phần 🔧 |
| CRM_LOGIN_TC_006 | High | 06 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-07` | ✅ / ✅ | Menu đúng 9 mục |
| CRM_LOGIN_TC_007 | High | 07, 38 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | 4/4 biến thể |
| CRM_LOGIN_TC_008 | High | 08 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | ⚠️ Chỉ chấm tới bước 5 — **phần 🔧 cookie (kiểm chứng thật của REQ) chưa chạy tay**. Script có kiểm cookie |
| CRM_LOGIN_TC_009 | High | 09 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | ⚠️ Như `TC_008` — phần 🔧 chưa chạy tay, script có kiểm |
| CRM_LOGIN_TC_010 | Medium | 06 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | Không phát sinh trang 419 |
| CRM_LOGIN_TC_011 | Critical | 10, 11, 12 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-08` (biến thể `a`) | ✅ / ❌ | 4/4 biến thể (Chrome). 🕓 TC sửa 19-09-2026 — chỉ gỡ `@NeedsVerify`. Script Firefox đỏ biến thể `d` (khác biệt trình duyệt) |
| CRM_LOGIN_TC_012 | High | 13 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | 5/5 biến thể |
| CRM_LOGIN_TC_013 | Critical | 14, 15 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-09` (biến thể `a`, bằng PM) | ✅ / ✅ | 2/2 biến thể |
| CRM_LOGIN_TC_014 | Medium | 14 | ✅ PASS | R2 · 19-09-2026 | R1 ⚠️ BLOCKED | — | ❌ / ❌ | Người dùng chạy tay, **không có ảnh evidence**. Script đỏ ở bước tiền đề — tài khoản staff trong `.env` không đăng nhập được |
| CRM_LOGIN_TC_015 | High | 41 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | 6 + 5 lần sai, không khoá |
| CRM_LOGIN_TC_016 | High | 16 | ❌ FAIL | R1 · 20-08-2026 | — | — | ❌ / ❌ | Bug [BUG_login_1787226514_TC016](../../bugs/login/web/BUG_login_1787226514_TC016.md) P2 đang mở — FAIL đúng kỳ vọng |
| CRM_LOGIN_TC_017 | Critical | 14 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | 2/2 biến thể XSS, SQLi |
| CRM_LOGIN_TC_018 | Medium | 14 | ✅ PASS ¹ | R1 · 20-08-2026 | — | — | ✅ / ✅ | ¹ R1 ghi **FAIL** ở biến thể `a` (email 260 ký tự). 🕓 19-09-2026 biến thể `a` **bị bỏ** khỏi TC và bug `TC018` đóng — *không phải lỗi*. Biến thể còn lại (mật khẩu đa ngôn ngữ) PASS ở R1 → kết quả hiệu lực là PASS |
| CRM_LOGIN_TC_019 | High | 43, 15 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | Bỏ phần 🔧 |
| CRM_LOGIN_TC_020 | High | 43 | ✅ PASS | R1 · 20-08-2026 | — | — | ✅ / ✅ | 🕓 TC sửa 19-09-2026 — bỏ phụ thuộc `TC_019`, kỳ vọng không đổi |
| CRM_LOGIN_TC_021 | Critical | 17 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-10` (biến thể `a`) | — | 2/2 biến thể |
| CRM_LOGIN_TC_022 | Medium | 18 | ✅ PASS | R1 · 20-08-2026 | — | — | — | — |
| CRM_LOGIN_TC_023 | Medium | 19, 20 | ✅ PASS | R1 · 20-08-2026 | — | — | — | 4/4 biến thể Admin + PM |
| CRM_LOGIN_TC_024 | High | 21 | ✅ PASS | R1 · 20-08-2026 | — | — | — | ⚠️ Chỉ chấm bước 4 — **phần 🔧 mã CSRF (kiểm chứng thật của REQ) chưa chạy tay**. 🕓 19-09-2026 sửa kỳ vọng 🔧`2` |
| CRM_LOGIN_TC_025 | Critical | 22 | ✅ PASS | R1 · 20-08-2026 | — | — | — | 2/2 biến thể. 🕓 TC sửa 19-09-2026 — chỉ gỡ ghi chú |
| CRM_LOGIN_TC_026 | High | 42 | ✅ PASS | R2 · 19-09-2026 | R1 ⏭️ SKIPPED | — | — | `@PersonalOnly` — QA tự chạy, **không có ảnh evidence** |
| CRM_LOGIN_TC_027 | High | 23, 24 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-11` | — | Bỏ phần 🔧 |
| CRM_LOGIN_TC_028 | High | 25 | ❌ FAIL | R1 · 20-08-2026 | — | — | — | Bug [BUG_login_1787226516_TC028](../../bugs/login/web/BUG_login_1787226516_TC028.md) P2 đang mở — FAIL đúng kỳ vọng |
| CRM_LOGIN_TC_029 | High | 26 | ❌ FAIL | R1 · 20-08-2026 | — | — | — | Bug [BUG_login_1787226517_TC029](../../bugs/login/web/BUG_login_1787226517_TC029.md) P3 đang mở — ô Email không reset sau khi gửi |
| CRM_LOGIN_TC_030 | Medium | 26 | ✅ PASS | R1 · 20-08-2026 | — | — | — | Bỏ phần 🔧 |
| CRM_LOGIN_TC_031 | Medium | 28 | ✅ PASS | R1 · 20-08-2026 | — | — | — | 2/2 biến thể HTTP 500. 🕓 TC sửa 19-09-2026 — chỉ gỡ ghi chú |
| CRM_LOGIN_TC_032 | Critical | 29 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-12` | — | Bỏ phần 🔧 |
| CRM_LOGIN_TC_033 | Medium | 29 | ✅ PASS | R1 · 20-08-2026 | — | — | — | Viewport 375×812. 🕓 TC sửa 19-09-2026 — chỉ gỡ ghi chú |
| CRM_LOGIN_TC_034 | Medium | 30 | ✅ PASS | R2 · 19-09-2026 | R1 ⚠️ BLOCKED | — | — | Lần đầu kiểm chứng đầu-cuối popup timer; task test đã dọn |
| CRM_LOGIN_TC_035 | High | 31 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-13` | — | — |
| CRM_LOGIN_TC_036 | Critical | 32, 33 | ✅ PASS | R1 · 20-08-2026 | — | ✅ `-13`, `-14` (biến thể `a`, chưa đủ bước 4–5) | — | 2/2 biến thể |
| CRM_LOGIN_TC_037 | High | 39 | ✅ PASS | R1 · 20-08-2026 | — | — | — | Bỏ phần 🔧 cookie |
| CRM_LOGIN_TC_038 | Medium | 02 | ✅ PASS | R1 · 20-08-2026 | — | — | — | Không đo riêng màu viền tiêu điểm |
| CRM_LOGIN_TC_039 | High | 44 | ❌ FAIL | R1 · 20-08-2026 | — | — | — | Bug [BUG_login_1785678750_TC039](../../bugs/login/web/BUG_login_1785678750_TC039.md) 🔴 Critical/P1 đang mở. 🕓 TC sửa 19-09-2026 (thêm tiền đề tắt HTTPS-Upgrades) — đo lại cùng ngày bằng `curl -I` vẫn FAIL |
| CRM_LOGIN_TC_040 | Medium | 14 | ✅ PASS | R1 · 20-08-2026 | — | — | — | Giả lập offline. 🕓 TC sửa 19-09-2026 — chỉ gỡ ghi chú |
| CRM_LOGIN_TC_041 | Low | 06 | ✅ PASS | R1 · 20-08-2026 | — | — | — | Giả lập Slow 3G. 🕓 TC sửa 19-09-2026 — chỉ gỡ ghi chú |
| CRM_LOGIN_TC_042 | Medium | 02 | ✅ PASS | R2 · 19-09-2026 | — | — | — | — |
| CRM_LOGIN_TC_043 | Medium | 02, 10 | ✅ PASS | R2 · 19-09-2026 | — | — | — | 3/3 biến thể |
| CRM_LOGIN_TC_044 | Low | 02 | ✅ PASS | R2 · 19-09-2026 | — | — | — | Người dùng chạy tay, **không có ảnh evidence** |
| CRM_LOGIN_TC_045 | Medium | 13, 14 | ✅ PASS | R2 · 19-09-2026 | — | — | — | 2/2 biến thể |
| CRM_LOGIN_TC_046 | Medium | 13 | ✅ PASS | R2 · 19-09-2026 | — | — | — | 3/3 biến thể — xác nhận mốc RFC 5321 |
| CRM_LOGIN_TC_047 | Medium | 14 | ✅ PASS | R2 · 19-09-2026 | — | — | — | 2/2 biến thể · bỏ phần 🔧 |
| CRM_LOGIN_TC_048 | Low | 02 | ✅ PASS | R2 · 19-09-2026 | — | — | — | 🕓 Sau lượt chạy, biến thể `b` (ô Password) **bị bỏ**; biến thể còn lại `a` PASS |
| CRM_LOGIN_TC_049 | Medium | 02 | ✅ PASS | R2 · 19-09-2026 | — | — | — | 5/5 kích thước màn hình |
| CRM_LOGIN_TC_050 | Medium | 02, 06, 14 | ✅ PASS | R2 · 19-09-2026 | — | — | — | Chrome · Edge · Firefox |
| CRM_LOGIN_TC_051 | High | 42 | ✅ PASS | R2 · 19-09-2026 | — | — | — | `@PersonalOnly` — QA tự chạy, **không có ảnh evidence** |

**Đối chiếu:** 51 dòng = ✅ 46 + ❌ 5 · R1 là lượt mới nhất của 38 TC, R2 của 13 TC · checklist smoke 09-10 rà lại 11 TC, đều PASS.

**Điểm cần biết trước khi dùng con số này cho release:**
- **Kết quả đã cũ:** 38/51 TC có kết quả mới nhất từ **20-08-2026**, trước cả đợt sửa TC 19-09-2026. Môi trường là môi trường dùng chung, có thể đã đổi — đề nghị chạy lại toàn bộ trước khi chốt release.
- **PASS chưa trọn:** `TC_008`, `TC_009`, `TC_024` chỉ chấm phần nhìn thấy được; chính các TC này ghi rõ *kiểm chứng thật nằm ở dòng 🔧*, mà dòng 🔧 chưa chạy tay lần nào. `REQ-LOGIN-08`, `09` có script kiểm cookie bù lại; **`REQ-LOGIN-21` (mã CSRF) thì chưa ai kiểm chứng thật**.
- **PASS không có ảnh:** `TC_014`, `026`, `044`, `051` do người dùng tự chạy và báo kết quả, không có evidence.

---

## 🔴 Requirements chưa được cover (ưu tiên xử lý)

| REQ ID | Mô tả | Đề xuất |
|---|---|---|
| — | **Không có** — 40/40 REQ trong phạm vi đều có ≥ 1 TC | — |

## 🟠 REQ chỉ có checklist (đã rà nhanh, chưa có TC)

| REQ ID | Mục checklist | Đề xuất |
|---|---|---|
| — | **Không có** — checklist smoke là TC-based, mọi mục đã có `TC ID liên quan` | — |

---

## 🟡 TC chưa automate (đề xuất thứ tự theo priority)

**31 TC chưa có script** = 28 TC automate được + 3 TC thiết kế không automate.

| TC ID | Priority | Ghi chú |
|---|---|---|
| CRM_LOGIN_TC_021 | Critical | `@Smoke` — chặn URL nội bộ khi chưa đăng nhập (REQ-17). Rẻ, nên làm đầu tiên |
| CRM_LOGIN_TC_032 | Critical | `@Smoke` — lối đăng xuất desktop (REQ-29). Locator đã chốt trong TC: `.dropdown-menu > li.header-logout` |
| CRM_LOGIN_TC_036 | Critical | `@Smoke` — đăng xuất kết thúc phiên + nút Back (REQ-32, 33) |
| CRM_LOGIN_TC_025 | Critical | CSRF sai bị chặn (REQ-22) — sửa trường ẩn bằng `locator.evaluate`, assert chuỗi `419 Page Expired!`, **không** assert mã HTTP |
| CRM_LOGIN_TC_035 | High | `@Smoke` — đăng xuất không hỏi lại khi không có timer. ⚠️ Admin dùng chung, người khác có thể đang chạy timer → cần tài khoản riêng hoặc chấp nhận skip |
| CRM_LOGIN_TC_039 | High | `@KnownBug` — ép HTTPS (REQ-44). Kiểm ở tầng API (`request.get` với `maxRedirects: 0`), tránh Chrome tự nâng cấp HTTPS. Bug Critical/P1 đang mở → script sẽ đỏ đúng kỳ vọng |
| CRM_LOGIN_TC_028 | High | `@KnownBug` — Quên mật khẩu bỏ trống email (REQ-25). Sẽ đỏ đúng kỳ vọng |
| CRM_LOGIN_TC_027 | High | Trang Quên mật khẩu (REQ-23, 24) |
| CRM_LOGIN_TC_029 | High | Email không tồn tại ở Quên mật khẩu (REQ-26) — bug `TC029` P3 đang mở |
| CRM_LOGIN_TC_024 | High | `Partial` — kiểm hình thái mã CSRF + thân POST (REQ-21) |
| CRM_LOGIN_TC_037 | High | `Partial` — cookie `autologin` vô hiệu sau đăng xuất (REQ-39) |
| CRM_LOGIN_TC_022 | Medium | Không giữ URL đích (REQ-18) |
| CRM_LOGIN_TC_023 | Medium | Đang có phiên mở lại trang đăng nhập / Quên mật khẩu — Admin + PM (REQ-19, 20) |
| CRM_LOGIN_TC_030 | Medium | Email sai định dạng ở Quên mật khẩu (REQ-26) |
| CRM_LOGIN_TC_031 | Medium | `Auto Type = API` — HTTP 500 thân rỗng (REQ-28) |
| CRM_LOGIN_TC_033 | Medium | Đăng xuất ở viewport mobile (REQ-29) |
| CRM_LOGIN_TC_034 | Medium | Popup timer (REQ-30) — phải tự tạo + dọn task trên môi trường dùng chung |
| CRM_LOGIN_TC_038 | Medium | Điều hướng bàn phím (REQ-02) |
| CRM_LOGIN_TC_040 | Medium | `Partial` — mất mạng khi gửi biểu mẫu (`context.setOffline`) |
| CRM_LOGIN_TC_042 | Medium | Ô mật khẩu che ký tự, dán được (REQ-02) |
| CRM_LOGIN_TC_043 | Medium | Nút Login luôn bấm được (REQ-02, 10) |
| CRM_LOGIN_TC_045 | Medium | Biên 63/64 ký tự trước `@` (REQ-13, 14) |
| CRM_LOGIN_TC_046 | Medium | Vượt 64 ký tự trước `@` (REQ-13) — cặp với `045` |
| CRM_LOGIN_TC_047 | Medium | Mật khẩu 256 / 1000 ký tự (REQ-14) |
| CRM_LOGIN_TC_049 | Medium | Responsive 5 kích thước (REQ-02) |
| CRM_LOGIN_TC_050 | Medium | Đa trình duyệt Chrome · Edge · Firefox — xem mục ⚠️ |
| CRM_LOGIN_TC_041 | Low | `Partial` — mạng chậm (CDP throttling, chỉ Chromium) |
| CRM_LOGIN_TC_048 | Low | Ô Email nhận trọn 300 ký tự (REQ-02) |
| CRM_LOGIN_TC_026 | High | 🚫 **Không automate theo thiết kế** — `@Slow` 65 phút, `@PersonalOnly` |
| CRM_LOGIN_TC_051 | High | 🚫 **Không automate theo thiết kế** — `@Slow` ~70 phút, `@PersonalOnly`. Hệ quả: `REQ-LOGIN-42` vĩnh viễn chỉ kiểm tay |
| CRM_LOGIN_TC_044 | Low | 🚫 **Không automate theo thiết kế** — hộp lưu mật khẩu của trình duyệt nằm ngoài DOM |

---

## ⚪ Orphan tests (không map về REQ nào)

| Test | File | Đề xuất |
|---|---|---|
| — | — | **Không có** — 20/20 test mang `testId` hợp lệ, tiêu đề test khớp `Test Scenario` của TC (trừ `TC_004`, xem dưới) |

---

## ⚠️ Mapping cần người xác nhận

> Không có mapping **suy luận** — mọi mapping trong RTM đều đi bằng ID (`REQ ID` của TC, `testId` của script, `REQ ID` của checklist). Các mục dưới là mapping **có ID nhưng nội dung lệch**, hoặc rủi ro làm con số automation đẹp hơn thực tế.

| REQ | TC/Test | Căn cứ |
|---|---|---|
| REQ-LOGIN-04 | `CRM_LOGIN_TC_004` ↔ script `TC_004` | 🔴 **Script kiểm kỳ vọng khác TC.** REQ + TC kỳ vọng bấm logo về trang chủ `https://crm.anhtester.com/`. Script đổi tiêu đề thành *"…chuyển sang trang đăng nhập khu khách hàng"* và assert URL `/authentication/login` (comment trong code: *"đã chốt với user 24-09-2026"*). Song song đó [BUG_login_1787226513_TC004](../../bugs/login/web/BUG_login_1787226513_TC004.md) vẫn **đang mở** cho đúng hành vi này. → Script đang **PASS trên hành vi mà bug coi là lỗi**. Cần chốt một trong hai: (a) hành vi hiện tại là đúng → sửa `REQ-LOGIN-04` bằng `/update-requirements-from-ticket` rồi đóng bug; (b) bug là thật → đưa assertion của script về kỳ vọng của TC. Cho tới khi chốt, **không nên** tính `REQ-LOGIN-04` là ✅ đã automate |
| REQ-LOGIN-14 | `CRM_LOGIN_TC_014` ↔ script `TC_014` | Có script nhưng **không bao giờ xanh** được: `.env` thiếu tài khoản staff có mật khẩu chứa chữ cái (`RISK-LOGIN-07`) — lượt 08-10-2026 đỏ ở bước tiền đề. Tính là "đã automate" nhưng chưa chạy được thật |
| REQ-LOGIN-10/11/12 | `CRM_LOGIN_TC_011-d` ↔ script `TC_011` | Biến thể `d` (toàn khoảng trắng) đỏ trên **Firefox**: Firefox chặn ở trình duyệt, Chrome gửi lên máy chủ. TC viết theo hành vi Chrome — cần user chọn cách sửa (đang chờ ở `run_and_fix_report.md` mục 4 của repo automation) |
| REQ-LOGIN-02/06/14 | `CRM_LOGIN_TC_050` | Suite automation đã chạy trên Chrome + Firefox nhưng **không** gắn `testId` `TC_050` và chưa chạy Edge → **không** tính là đã automate `TC_050`. Muốn tính thì thêm project Edge + một test mang `testId: 'CRM_LOGIN_TC_050'` |
| REQ-LOGIN-41 | `CRM_LOGIN_TC_015` (TC + script) | Không lệch mapping, nhưng **lệch quy tắc vận hành**: TC và script gửi **6 lần sai mật khẩu bằng tài khoản Admin**, trong khi checklist smoke 09-10-2026 quy định *mật khẩu sai chỉ thử bằng PM, không dùng Admin — tài khoản cả lớp dùng chung*. `REQ-LOGIN-41` hiện vẫn ghi *không khoá* nên chạy được, nhưng nếu cơ chế khoá tài khoản được deploy, script này sẽ khoá Admin của cả lớp. Đề nghị chuyển biến thể `a` sang tài khoản PM |

---

## Đề xuất bước tiếp theo

| # | Việc | Lệnh |
|---|---|---|
| 1 | Chốt mâu thuẫn `REQ-LOGIN-04` / `TC_004` / bug `TC004` (mục ⚠️ dòng 1) — **trước** khi báo cáo release | `/update-requirements-from-ticket` (nếu hành vi hiện tại là đúng) |
| 2 | Chạy lại bộ TC trước release — 38/51 TC mới có kết quả từ 20-08-2026; lần này **chạy cả phần 🔧** của `TC_008`, `009`, `024` (DevTools) | `/execute-test-cases` |
| 3 | Automate 4 TC `@Smoke` còn thiếu (`021`, `032`, `035`, `036`) + `025` để bộ smoke tự động đủ 9/9 | `/generate-automation-from-testcases` |
| 4 | Cấp tài khoản staff có mật khẩu chứa chữ cái vào `.env` để `TC_014` chạy được | — (user) |
| 5 | Tổng hợp kết quả chạy + bug đang mở + RTM này thành báo cáo go/no-go | `/generate-test-summary-report` |
| 6 | Muốn RTM toàn hệ thống: khảo sát 20 module ⬜ theo thứ tự đã chốt (`CONT` → `LEAD` → `TASK` …) | `/generate-requirements-from-website` |
