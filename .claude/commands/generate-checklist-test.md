---
description: Sinh checklist test ngắn để tick tay (CHECKLIST mode) — smoke / post-hotfix / regression module / release-readiness. Không sinh TC chi tiết có steps.
skills:
  - skills-rbt-manual-testing
---

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-rbt-manual-testing`** (tại `.claude/skills/skills-rbt-manual-testing/SKILL.md`) trước khi bắt đầu tác vụ này. Sử dụng **Mode CHECKLIST** của skill.

# Command: Sinh Checklist Test

Command này sử dụng **Mode CHECKLIST** của skill `skills-rbt-manual-testing` để sinh **danh sách rà soát ngắn gọn, tick tay** — dùng khi chạy nhanh trước release, bàn giao cho tester thủ công, hoặc rà lại sau hotfix.

## ⚠️ Nguyên tắc

- **Mode:** CHECKLIST (1 lượt duy nhất, không chờ user giữa chừng)
- **Checklist ≠ Test Case:** checklist trả lời *"đã rà hết chưa?"*, test case trả lời *"rà bằng cách nào?"*
- **KHÔNG** viết steps đánh số trong mục checklist — nếu user cần steps chi tiết, test data đầy đủ, import Jira/TestRail hoặc giao cho automation → dùng `/generate-testcases-from-requirements` (QUICK) hoặc `/generate-testcases-manual-rbt` (FULL RBT)
- Tất cả output bằng **Tiếng Việt**

## Input cần thu thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| Module / tính năng cần rà | ⭐ Bắt buộc | Xác định scope |
| Loại checklist | ⭐ Bắt buộc | Smoke / Post-hotfix / Regression / Release-readiness — nếu user không nói, agent **hỏi** hoặc suy ra từ ngữ cảnh và ghi rõ đã chọn loại nào |
| File TC sẵn có (index `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → file nền tảng theo Bản đồ tài liệu) | Khuyến nghị | Có → dùng nguồn **TC-based**. Checklist cho một nền tảng thì chỉ rút từ file nền tảng đó |
| Requirements / REQ ID | Khuyến nghị | Để điền cột REQ ID phục vụ truy vết |
| Mô tả thay đổi của bản vá | Bắt buộc với Post-hotfix | Để khoanh vùng ảnh hưởng |

## 2 Nguồn Input — xác định trước khi sinh

| Nguồn | Khi nào | Cách làm |
|---|---|---|
| **TC-based** (ưu tiên) | Đã có bộ TC chi tiết | **Rút gọn** từ bộ TC — gom TC cùng chủ đề thành 1 mục, điền cột `TC ID liên quan` để truy ngược |
| **REQ-based** | Chưa có TC, chỉ có requirements / UI | Rút mục trực tiếp từ requirements + 3 bảng checklist chuẩn trong skill |

> Đã có bộ TC mà vẫn sinh mới từ đầu → nội dung dễ lệch với bộ TC gốc (vi phạm anti-pattern trong skill).

## 4 Loại Checklist & Ngưỡng Quy Mô

| Loại | Mục đích | Số mục | Thời gian chạy tay |
|---|---|---|---|
| **Smoke** | Xác nhận build chạy được, luồng sống còn không vỡ | 10–20 | ≤ 15 phút |
| **Post-hotfix** | Rà vùng ảnh hưởng của bản vá + vùng lân cận | 5–15 | ≤ 10 phút |
| **Regression (module)** | Rà toàn bộ 1 module trước khi bàn giao | 20–40 | ≤ 45 phút |
| **Release-readiness** | Rà toàn hệ thống trước khi lên production | 30–60 | ≤ 60 phút |

> Vượt ngưỡng → **BẮT BUỘC** tách theo module hoặc hạ scope, ghi rõ phần đã cắt. KHÔNG xuất checklist dài lê thê.

## Lấy mục từ vòng nào

Checklist không chấm bảng đối soát 4 vòng, nhưng lấy mục **theo vòng** để biết dừng ở đâu (chi tiết ở skill, Mode CHECKLIST):

| Loại | Lấy mục từ | Bỏ qua |
|---|---|---|
| Smoke | **Chỉ V1** — UI cơ bản · mở form · hiển thị · nhập hợp lệ · lưu · đối chiếu dữ liệu | V2–V4 |
| Post-hotfix | V1 của vùng vá + nhánh V2 bản vá chạm tới | V3 · V4 |
| Regression (module) | V1 + V2 + V3 `Permission` | V4 (trừ `Regression` nếu module có bug cũ) |
| Release-readiness | V1 + nhánh sống còn của V2 + V3 `Permission`/`Security` + V4 `E2E` | Phần còn lại |

## Các bước thực hiện

0. **Mở evidence** của các màn hình có trong checklist — `docs/requirements/<module>/<nền-tảng>/evidence/` (Quy Tắc Đối Chiếu Evidence trong skill). Checklist nêu nhãn nút và dấu hiệu nhìn thấy trên UI, sai một chữ là người chạy tick nhầm. Nguồn TC-based thì evidence đã được đối chiếu lúc sinh TC — chỉ mở lại ảnh của màn hình có trong checklist
1. **Xác định loại checklist + nguồn input** (theo 2 bảng trên) — ghi rõ ở đầu output
2. **Xác định scope:** module nào, luồng nào, role nào
   - Với **Post-hotfix**: khoanh rõ **vùng ảnh hưởng** của thay đổi + vùng lân cận có rủi ro hồi quy
3. **Rút mục từ 3 bảng checklist chuẩn trong skill** — chỉ lấy mục **thực sự áp dụng** cho module:
   - **Field-Level Validation (15 loại field):** chỉ lấy **1–2 mục đại diện rủi ro cao nhất** mỗi field quan trọng — KHÔNG liệt kê hết mọi validation
   - **Component-Level:** Data Table/List, CRUD Lifecycle, Permission/Role, Modal/Dialog, Notification, Status Flow
   - **Non-Functional:** Race condition / Double submit, Session & Network, Localization & UTF-8, A11y bàn phím
   - Nguồn TC-based: **bỏ qua TC `@Deprecated`** — chức năng đã gỡ
4. **Ưu tiên theo rủi ro:** luồng liên quan **tiền, phân quyền, mất dữ liệu** luôn phải có mặt dù là loại checklist nào
5. **Viết từng mục theo Quy Tắc Viết Mục Checklist** (mục kế tiếp)
6. **Gắn metadata:** `Priority` (P1/P2/P3), `REQ ID` (nếu có), `TC ID liên quan` (nếu TC-based, không có ghi `—`)
6b. **Gắn trạng thái từ execution đã có** — quét `docs/executions/<module>/<nền-tảng>/run_*/execution_report.md`, điền cột `Trạng thái` + `Execution ID` (luật đầy đủ ở skill, mục *Cột Trạng thái & Execution ID*):
   - Nguồn 1: lần chạy **chính checklist này** (khớp mã mục `CL-…-<nn>`) · Nguồn 2 (chỉ TC-based): lần chạy **bộ TC** cùng module + nền tảng, theo `TC ID liên quan`. Checklist khác **không** là nguồn
   - Mỗi TC lấy lần chạy mới nhất khác `SKIPPED`; mục nhiều TC lấy mức xấu nhất `FAIL` > `BLOCKED` > `SKIPPED` > `PASS`; còn TC chưa chạy mà phần còn lại PASS → `☐`
   - `Execution ID` = `[<run_id>](../../../executions/<module>/<nền-tảng>/<run_id>/execution_report.md)<br><sub>DD-MM-YYYY</sub>` — lần chạy quyết định trạng thái, ngày chạy chữ nhỏ dưới ID. Chưa có kết quả → `☐` / `—`
   - Header ghi dòng `Trạng thái lấy từ:` — số mục đã có kết quả + nguồn + các `run_id`
7. **Nhóm theo Module → Nhóm chức năng**, đánh số liên tục để dễ đối chiếu khi báo cáo kết quả. Release-readiness thêm cột **`Module`** cho từng mục
8. **Ghi `Mã checklist`** ở header = `CL-` + phần tên file sau `checklist_` (VD `checklist_smoke_20261009.md` → `CL-smoke_20261009`) — quy tắc đầy đủ ở skill, mục *Mã checklist & mã mục*
9. **Chạy Checklist Quality Gate (5 tiêu chí)** — chưa đạt thì sửa, KHÔNG xuất
10. **Ghi file** theo bảng *Nơi ghi file* bên dưới, kèm bảng ký nhận — theo **Write-first**: ghi thẳng vào file, chat chỉ báo số mục + đường dẫn, KHÔNG in cả bảng checklist ra chat (trừ khi user yêu cầu xem ngay)

## Quy Tắc Viết Mục Checklist (BẮT BUỘC)

- Mỗi mục **1 dòng, ≤ 20 từ**, bắt đầu bằng **động từ** (Đăng nhập, Tạo, Sửa, Xóa, Lọc, Xuất...)
- **Verify được trong ≤ 2 phút** bởi người chưa đọc requirements
- **Kết quả kỳ vọng phải quan sát được** trên UI — cấm "hoạt động đúng / bình thường / OK"
- **Test data cụ thể** ở mục phụ thuộc data (theo Quy tắc Test Data của skill)
- Mục cần **>3 thao tác** mới verify được → tách nhỏ hoặc chuyển sang mode QUICK

```markdown
❌ Sai: "Kiểm tra chức năng khách hàng hoạt động tốt"
✅ Đúng: "Tạo KH mới với đủ field bắt buộc → xuất hiện đầu danh sách, đúng tên vừa nhập"

❌ Sai: "Test phân quyền"
✅ Đúng: "Đăng nhập role Sale, mở URL /admin/settings trực tiếp → bị chặn, về trang 403"
```

## Nơi ghi file

Nhánh `docs/checklists/`, có tầng nền tảng như `docs/testcases/`:

| Loại | Đường dẫn |
|---|---|
| Smoke · Regression (module) | `docs/checklists/<module>/<nền-tảng>/checklist_<loại>_<YYYYMMDD>.md` |
| Post-hotfix | `docs/checklists/<module>/<nền-tảng>/checklist_post-hotfix_<TICKET-ID>.md` |
| Release-readiness (nhiều module) | `docs/checklists/_release/<nền-tảng>/checklist_release_<mốc>.md` — `<mốc>` cùng slug với `docs/test-plans/test_plan_<mốc>.md`. Đợt có nhiều nền tảng → mỗi nền tảng một file |

`<loại>` viết thường: `smoke` · `regression` · `post-hotfix` · `release`. Thư mục `_release/` có dấu `_` đầu = không phải module — nó đóng vai **module giả**, kết quả chạy nằm ở `docs/executions/_release/<nền-tảng>/`.

## Bảng Output

> 📄 **Checklist là tài liệu đọc/in trực tiếp, KHÔNG nạp vào `scripts/testcases-viewer`.** Viewer đó chỉ đọc bảng test case chi tiết (`test_cases_*.md` — có `Test Steps`, `Test Data`, `Risk Level`); checklist cố tình không có những cột đó nên nạp vào chỉ ra bảng rỗng. Checklist mở bằng bất kỳ trình xem Markdown nào, hoặc in ra tick tay — đó là mục đích của nó.

```markdown
## [Tên Module] — Checklist <Loại> (<số mục> mục · ~<thời gian> phút)

**Nguồn:** TC-based (`docs/testcases/<module>/<nền-tảng>/test_cases_<module>_<nền-tảng>.md`) | REQ-based
**Scope:** <module / luồng / role>
**Mã checklist:** `CL-<phần tên file sau checklist_>` (VD `CL-smoke_20261009` · `CL-post-hotfix_CRM-812`) — mã mục khi chạy = `<Mã checklist>-<số mục 2 chữ số>`
**Trạng thái lấy từ:** <n>/<tổng> mục đã có kết quả — <nguồn: lần chạy checklist này | lần chạy bộ TC> `<run_id>`, … | Chưa có lần chạy nào

### Nhóm: <Tên nhóm chức năng>

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 1 | ✅ PASS | Đăng nhập bằng tài khoản admin hợp lệ | Vào /dashboard, hiển thị tên user góc phải | P1 | REQ-LOGIN-01 | CRM_LOGIN_TC_001 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |
| 2 | ☐ | Đăng nhập sai mật khẩu 5 lần liên tiếp | Tài khoản bị khóa, hiện thông báo khóa | P1 | REQ-LOGIN-02 | CRM_LOGIN_TC_012 | — |

### Không áp dụng cho module này
- <Component trong bảng chuẩn nhưng module không có> — lý do

### Ký nhận

| Môi trường | Build / Version | Người thực hiện | Ngày | Kết quả (Pass/Fail/Blocked) |
|---|---|---|---|---|
|  |  |  |  |  |
```

## 🛡️ Checklist Quality Gate (5 Tiêu Chí — chạy trước khi xuất)

- [ ] **1. Verify được:** 100% mục có kết quả kỳ vọng quan sát được, không còn từ "hoạt động đúng / bình thường / OK"
- [ ] **2. Critical path đủ:** Mọi luồng sống còn (đăng nhập, CRUD bản ghi chính, phân quyền, thanh toán nếu có) đều có ≥1 mục P1
- [ ] **3. Component đủ:** Mỗi component có mặt trong module có ≥1 mục — component không có thì ghi vào phần "Không áp dụng", KHÔNG lặng lẽ bỏ qua
- [ ] **4. Đúng quy mô:** Số mục nằm trong ngưỡng của loại checklist đã chọn
- [ ] **5. Truy vết được:** Header có `Mã checklist` khớp tên file · mục nào có REQ thì điền `REQ ID` · TC-based thì điền `TC ID liên quan` · Release-readiness có cột `Module` ở **mọi** mục · ô `Trạng thái` khác `☐` đều có `Execution ID` mở được đúng report — thiếu là bug và RTM phía sau không quy được mục về đâu

## Quy tắc quan trọng

- Cột `Trạng thái` chỉ khác `☐` khi truy được về một execution report thật — agent **không** tự chấm khi chưa chạy. Mục chưa có kết quả để `☐` cho người chạy tay đánh dấu
- Checklist **không thay thế** bộ TC chi tiết — nó là lớp rà nhanh nằm trên bộ TC
- Checklist là **ảnh chụp tại một thời điểm** — lần rà mới sinh file mới theo ngày / ticket / mốc, **không** sửa đè checklist của lần rà trước (có thể đã có người tick tay). Cùng ngày chạy lại đúng loại đó thì ghi đè file của ngày đó
- Component không áp dụng phải **ghi rõ**, không bỏ im lặng
- **Chạy checklist bằng `/execute-test-cases`** — kết quả nằm trong execution report (mỗi mục mang mã `CL-…-<nn>`); chạy xong workflow đó cập nhật lại **đúng hai cột** `Trạng thái` · `Execution ID` của checklist. Cột này chỉ là bản sao để đọc — báo cáo tổng hợp, RTM vẫn đọc kết quả từ execution report. Từ đó RTM có cột `Checklist`, báo cáo tổng hợp có bảng kết quả checklist **riêng**, không cộng vào pass rate của bộ TC

## Khi nào chuyển sang mode khác

Agent **tự động đề xuất chuyển mode** nếu phát hiện:

| Dấu hiệu | Chuyển sang |
|---|---|
| User cần steps chi tiết / test data đầy đủ / import Jira-TestRail | `/generate-testcases-from-requirements` (QUICK) |
| Scope lớn, requirements mơ hồ, cần Risk Assessment hoặc Traceability Matrix | `/generate-testcases-manual-rbt` (FULL RBT) |
| Đã có bộ TC nhưng chất lượng kém, cần đánh giá trước khi rút checklist | `/review-testcases` |
