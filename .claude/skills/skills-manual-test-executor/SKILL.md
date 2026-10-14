---
name: skills-manual-test-executor
description: Skill thực thi manual test cases trực tiếp trên browser thật qua Playwright MCP — chạy từng bước theo TC, đối chiếu Expected vs Actual, chấm PASS/FAIL/BLOCKED/SKIPPED, thu evidence và xuất execution report. Dành cho tester manual, KHÔNG sinh code automation.
---

# Manual Test Executor

## Description

Skill biến bộ manual test cases thành **kết quả kiểm thử thật**. Agent mở browser, chạy đúng từng bước ghi trong TC, quan sát UI thực tế, đối chiếu với Expected Result, chấm trạng thái và xuất báo cáo.

**Dành cho tester manual thuần** — không cần biết code, không sinh script automation.

**Nguyên tắc cốt lõi:**
- **Chạy thật, không suy đoán:** mọi kết luận PASS/FAIL phải dựa trên quan sát UI thực tế qua snapshot/screenshot
- **TC là chuẩn, không phải hệ thống:** khi thực tế lệch TC → ghi FAIL. **TUYỆT ĐỐI KHÔNG sửa TC cho khớp thực tế**
- **An toàn dữ liệu trước tốc độ:** môi trường dùng chung thì thao tác phá huỷ bị chặn, dữ liệu tạo ra phải dọn

---

## When to Use

Sử dụng skill này khi:

- Đã có bộ manual test cases (từ `skills-rbt-manual-testing`) và cần **chạy kiểm chứng thật**
- Cần chạy smoke/regression bằng tay trước release
- Cần thực thi checklist (từ CHECKLIST mode) trên môi trường thật
- Cần báo cáo kết quả PASS/FAIL có evidence cho PO/QA lead
- Cần kiểm chứng nhanh một nhóm TC sau khi dev fix bug

**KHÔNG** sử dụng skill này khi:

- Cần sinh code automation → `skills-qa-automation-engineer`
- Cần phân tích report **đã có sẵn** từ automation (Playwright/Allure/JUnit) → `skills-test-report-analyzer`
- Chỉ cần inspect DOM / lấy locator → `skills-ui-debug-agent`
- Chưa có TC, cần sinh TC trước → `skills-rbt-manual-testing`

---

## Vị trí trong chuỗi công việc

```
skills-rbt-manual-testing          skills-manual-test-executor          skills-bug-reporter
  test_cases_*.md          ──→      execution_report.md         ──→      bug_*.md (mỗi TC FAIL)
  checklist_*.md                            │
                                            └──→  skills-test-report-analyzer
                                                  (khi có nhiều FAIL cần gom nhóm root cause)
```

---

## Input cần thu thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| File TC hoặc checklist | ⭐ Bắt buộc | VD `docs/testcases/customers/web/test_cases_customers_web.md` · `docs/testcases/customers/web/parts/part_01_web_danh_sach.md` · `docs/checklists/customers/web/checklist_smoke_20261009.md` · `docs/checklists/_release/web/checklist_release_release_2.0.md`. User đưa file **index** → đọc `## Bản đồ tài liệu`, chỉ lấy file `web/` |
| Phạm vi chạy | ⭐ Bắt buộc | Toàn bộ file · theo tag (`@Smoke`) · theo TC ID range · theo nhóm chức năng |
| Môi trường & tài khoản | ⭐ Bắt buộc | URL, tài khoản đăng nhập, build/version đang test |
| Mức độ dùng chung của môi trường | ⭐ Bắt buộc | Dùng chung → bật auto-skip TC phá huỷ; môi trường riêng → có thể chạy đầy đủ |

> Thiếu phạm vi chạy → agent **hỏi** thay vì mặc định chạy toàn bộ (bộ TC có thể tới hàng trăm TC).
>
> TC mang tag `@Deprecated` (chức năng đã gỡ) **bị loại khỏi phạm vi ngay lúc lọc** — không chạy, không tính vào tổng, **không** tính SKIPPED (SKIPPED là nợ kiểm thử, còn TC này không còn gì để kiểm). Header report ghi số TC Deprecated đã loại.

---

## Thứ tự thao tác browser (BẮT BUỘC)

Tuân thủ Browser Rules của dự án:

```
navigate → wait_for(page_load) → snapshot → interact → screenshot(on_fail)
```

- **Headed mode bắt buộc** — tester phải nhìn được agent đang làm gì
- **KHÔNG** gọi `browser_resize` — viewport đã đúng từ `--viewport-size` lúc launch MCP server. Phóng viewport vượt cửa sổ OS làm trang bị cắt bên phải, tester mất tầm nhìn (xem [`.claude/rules/playwright_rules.md`](../../rules/playwright_rules.md) mục 1)
- **KHÔNG** gọi `browser_navigate` lại nếu đã ở đúng trang — tránh reload làm mất trạng thái đang test
- Dùng `snapshot` để đọc trạng thái UI và verify; `screenshot` để lưu bằng chứng

---

## 4 Trạng thái kết quả

| Trạng thái | Khi nào | Bắt buộc kèm |
|---|---|---|
| ✅ **PASS** | **Mọi** Expected Result đánh số đều đã verify khớp thực tế | — |
| ❌ **FAIL** | Ít nhất 1 Expected Result không khớp thực tế | Screenshot tại bước fail + ghi rõ Actual vs Expected |
| ⚠️ **BLOCKED** | Không chạy được vì lý do **ngoài phạm vi TC**: pre-condition không dựng được, môi trường lỗi, TC phụ thuộc kết quả TC khác đã fail, hoặc có Expected không quan sát được | Ghi rõ nguyên nhân chặn |
| ⏭️ **SKIPPED** | Cố ý bỏ qua: TC thao tác phá huỷ trên môi trường dùng chung, TC ngoài phạm vi chạy đã chọn | Ghi rõ lý do skip |

> **Quy tắc vàng:** không verify được một Expected → TC là **BLOCKED**, KHÔNG phải PASS. Cấm suy đoán "chắc là đúng".

---

## Quy tắc Auto-Skip TC nguy hiểm (môi trường dùng chung)

Agent **tự động chuyển SKIPPED** và **KHÔNG thực thi** khi TC có bất kỳ dấu hiệu sau:

> ⚠️ `Automation = No` **KHÔNG** phải dấu hiệu bỏ qua — cột đó chỉ nói TC không làm automation, còn chạy tay vẫn chạy bình thường. Chỉ tag `@PersonalOnly` mới đưa TC ra khỏi `/execute-test-cases`.

| Dấu hiệu | Ví dụ |
|---|---|
| Tag `@PersonalOnly` — QA tự chạy và tự theo dõi ngoài workflow (TC chạy quá lâu, cần thao tác tay đặc biệt…) | TC_026 (chờ 65 phút) |
| Steps chứa thao tác xoá hàng loạt | `Mass Delete`, `Select All`, chọn nhiều bản ghi rồi xoá |
| Steps gọi trực tiếp URL phá huỷ | `/admin/clients/delete/{id}` trên thanh địa chỉ |
| Steps tải lên tệp thực thi | `.exe`, `.sh`, `.bat` |
| Steps sinh **khối lượng** dữ liệu lớn | import hàng trăm dòng, tạo hàng loạt bản ghi bằng vòng lặp |

> ⚠️ Nhập **một chuỗi dài vào một field** (VD 256 ký tự vào ô max 255) **KHÔNG** phải dấu hiệu nguy hiểm — đó là TC giá trị biên (BVA `max+1`), chỉ tạo tối đa một bản ghi và được dọn như mọi dữ liệu khác. Bỏ qua nó là rụng cả lớp kiểm tra biên mà không ai biết.

Ghi vào report: `⏭️ SKIPPED — thao tác phá huỷ trên môi trường dùng chung, cần chạy tay có giám sát`.

> Môi trường **test riêng** → tester khai báo lúc bắt đầu, agent tắt quy tắc này và ghi rõ trong header report.

---

## TC đặc biệt — cách chạy và chấm

| Loại TC | Cách chạy | Cách chấm |
|---|---|---|
| **Độ hạt GỘP — Bảng biến thể** (Kiểu A, mã `a`, `b`, `c`…) | Chạy **từng biến thể**, cùng chuỗi steps, đổi giá trị theo bảng | PASS khi **mọi** biến thể PASS. Biến thể lệch → TC `FAIL`, cột `Bước fail` ghi `<số bước> · biến thể <mã>`, chi tiết FAIL ghi mã đầy đủ `<TC ID>-<mã>` (VD `CRM_LOGIN_TC_012-c`) ở dòng `Bước fail`. Heading `### FAIL #n — <TC ID> · <kịch bản>` giữ **TC ID trần** — `scripts/execution-viewer` nối chi tiết FAIL với bảng kết quả theo TC ID. Nhiều biến thể fail → liệt kê đủ trong dòng `Bước fail` |
| **Độ hạt GỘP — Bảng kiểm** (Kiểu B, mục `1`, `2`, `3`…) | Đối chiếu từng mục trên cùng màn hình | PASS khi mọi mục đạt. Mục lệch → ghi số mục + REQ của mục đó |
| **`@TechCheck`** — có dòng `🔧 Ghi chú kỹ thuật (cần DevTools):` | Chấm phần TC chính như bình thường. Phần 🔧: agent kiểm **nếu làm được** bằng công cụ đang có (`browser_evaluate`, `browser_network_requests`, xem cookie) | Phần chính quyết định PASS/FAIL. Phần 🔧 kiểm được mà lệch → `FAIL`. Không kiểm được → vẫn chấm theo phần chính, cột Ghi chú ghi `🔧 chưa kiểm — <lý do>`. 🔒 Ghi **hình thái**, không chép giá trị cookie/token thật vào report |
| **`@NeedsVerify`** — Expected ghi `⚠️ chưa có evidence` | Chạy bình thường, **ghi lại nguyên văn** điều quan sát được ở chỗ chưa có evidence | Khớp Expected → `PASS`, ghi chú *"đã xác nhận trên UI — đề nghị gỡ `@NeedsVerify`"*. Lệch → `FAIL` kèm ghi chú *"Expected chưa có evidence — đối chiếu lại TC trước khi báo bug"*; mục Đề xuất trỏ `/review-testcases`, **không** trỏ thẳng `/create-bug-report` |
| **Mục checklist** (nguồn `checklist_*.md`) | Mỗi mục `#` là một đơn vị chạy — thao tác theo cột `Hạng mục kiểm tra`, đối chiếu cột `Kết quả kỳ vọng` | Xem mục **Chạy checklist** ngay dưới. Kết quả ghi vào execution report; chạy xong cập nhật **đúng hai cột** `Trạng thái` · `Execution ID` của checklist (luật 5). Bảng ký nhận của checklist do người chịu trách nhiệm tự điền |

### Chạy checklist — 5 luật để kết quả nối được về sau

| # | Luật | Vì sao |
|---|---|---|
| 1 | Cột `TC ID` của report ghi **mã mục** `<Mã checklist>-<nn>` (VD `CL-smoke_20261009-03`) — lấy `Mã checklist` ở header checklist; checklist cũ không có dòng đó thì tự ghép `CL-` + phần tên file sau `checklist_`. **Cấm** ghi `#3` trần | `#3` trùng giữa mọi checklist — viewer, RTM và báo cáo tổng hợp sẽ nối nhầm mục của hai checklist khác nhau |
| 2 | Header ghi `Loại nguồn` = `Checklist <loại>` + `Mã checklist`; bảng kết quả thêm 3 cột `Priority` · `REQ ID` · `TC ID liên quan` chép từ checklist | Báo cáo tổng hợp phân loại lần chạy theo `Loại nguồn` — thiếu là lần chạy smoke 12 mục bị coi như lần chạy bộ TC và thay số của cả module |
| 3 | **Checklist Release-readiness** (`docs/checklists/_release/<nền-tảng>/`): report ghi vào `docs/executions/_release/<nền-tảng>/<run_id>/`, bảng kết quả thêm cột **`Module`** chép từ checklist | Một lần chạy trải nhiều module — `_release` là module giả, cột `Module` quy từng mục về đúng module cho bug và báo cáo tổng hợp |
| 4 | Mục checklist FAIL → bug đặt ở `docs/bugs/<module của mục>/<nền-tảng>/`, trỏ về `TC ID liên quan` (nếu có) **và** mã mục | Bug phải trỏ về TC đang có hiệu lực; mục REQ-based không có TC thì mã mục + REQ ID là neo duy nhất |
| 5 | Xuất report xong → mở lại file checklist, với **mọi mục đã chạy** ghi `Trạng thái` = nhãn kết quả (`✅ PASS` · `❌ FAIL` · `⚠️ BLOCKED` · `⏭️ SKIPPED`) và `Execution ID` = `[<run_id>](../../../executions/<module>/<nền-tảng>/<run_id>/execution_report.md)<br><sub>DD-MM-YYYY</sub>`; sửa dòng header `Trạng thái lấy từ:` sang lần chạy này. **Không** đụng cột khác, không đụng bảng ký nhận. Mục không chạy giữ nguyên giá trị cũ | Người mở checklist thấy ngay mục nào đã đạt, mục nào còn phải chạy, và bấm sang được report làm bằng chứng. Ghi đè cột khác là làm checklist lệch khỏi phiên bản đã được dùng để chạy |

---

## Quy tắc Fail-Forward

Khi một TC FAIL:

1. **Chụp screenshot ngay tại bước fail** (không chụp sau khi đã điều hướng đi nơi khác)
2. Ghi lại: bước số mấy, Expected là gì, Actual quan sát được là gì
3. Khôi phục trạng thái sạch (đóng modal, quay về trang danh sách) rồi **chạy tiếp TC sau**
4. **KHÔNG** dừng cả buổi chạy chỉ vì 1 TC fail

**Ngoại lệ — dừng và báo user ngay:**

| Điều kiện dừng | Vì sao |
|---|---|
| 3 TC liên tiếp FAIL cùng một nguyên nhân hạ tầng | Đăng nhập hỏng, server 500, mất mạng — chạy tiếp chỉ tạo báo cáo rác |
| Không đăng nhập được ngay từ đầu | Toàn bộ suite không chạy được |
| Phát hiện thao tác của mình đã ảnh hưởng dữ liệu người khác | Ưu tiên dừng và khắc phục |

---

## Quản lý Test Data & Cleanup (BẮT BUỘC)

- Mọi dữ liệu tạo ra phải **traceable**: `Auto_<Module>_<timestamp>`, `auto_<loại>_<timestamp>@auto.test`
- Agent **ghi sổ** mọi bản ghi đã tạo trong lúc chạy (tên + ID + nơi tạo)
- Cuối buổi chạy: **dọn sạch** toàn bộ dữ liệu đã tạo
- Report **bắt buộc** có mục "Dữ liệu đã tạo & dọn dẹp" — bản nào chưa xoá được phải ghi rõ để người khác xử lý

> Không bao giờ tạo dữ liệu mà không có kế hoạch xoá tương ứng.

---

## Evidence (Screenshot)

| Tình huống | Chụp? |
|---|---|
| TC FAIL | ✅ **Bắt buộc** — chụp ngay tại bước fail |
| Milestone quan trọng (tạo bản ghi thành công, hoàn tất luồng chính) | ✅ Nên chụp |
| Mỗi bước của mọi TC | ❌ **KHÔNG** — chụp tràn lan làm report nặng và khó đọc |

Lưu tại: `docs/executions/<module>/<nền-tảng>/<run_id>/evidence/<TC_ID>_<mô_tả>.png` — chạy checklist thì `<TC_ID>` là mã mục (`CL-smoke_20261009-03_<mô_tả>.png`); checklist release thì `<module>` là `_release`

---

## Quy trình thực thi

1. **Xác nhận phạm vi & môi trường** — đọc file TC, lọc TC theo phạm vi user chọn, đếm số TC sẽ chạy, công bố kế hoạch
2. **Chuẩn bị:** tạo `run_id` (`run_<timestamp>`), tạo thư mục evidence, khởi tạo file report
3. **Đăng nhập & khởi tạo môi trường:** navigate → wait_for(page_load) → đăng nhập → verify vào được hệ thống. Không vào được → dừng ngay, báo user
4. **Chạy từng TC theo thứ tự:**
   - Đọc Pre-Condition → dựng điều kiện; không dựng được → `BLOCKED`
   - Kiểm tra quy tắc Auto-Skip → khớp thì `SKIPPED`, sang TC tiếp
   - Thực hiện **đúng từng bước** trong Test Steps, không tự thêm/bớt bước
   - Sau mỗi bước có Expected tương ứng: `snapshot` để verify
   - Đối chiếu **toàn bộ** Expected Result → chấm trạng thái
   - FAIL → screenshot + ghi Actual → khôi phục trạng thái → tiếp
   - Ghi kết quả vào report **ngay sau mỗi TC** (không dồn tới cuối — mất điện là mất hết)
5. **Cập nhật tiến độ** sau mỗi 5–10 TC: `Đã chạy 12/36 — PASS 10 · FAIL 1 · BLOCKED 0 · SKIPPED 1`
6. **Teardown:** xoá toàn bộ dữ liệu đã tạo, đối chiếu số liệu hệ thống trước/sau
7. **Xuất execution report** hoàn chỉnh + đề xuất bước tiếp theo

---

## Output — Execution Report

File: `docs/executions/<module>/<nền-tảng>/<run_id>/execution_report.md` — checklist Release-readiness: `docs/executions/_release/<nền-tảng>/<run_id>/execution_report.md`

```markdown
# Execution Report — <Module> · <Loại chạy>

| Thông tin | Nội dung |
|---|---|
| Run ID | run_1785700456 |
| Nền tảng | `web` — một lần chạy thuộc đúng một nền tảng, quyết định thư mục `docs/executions/<module>/<nền-tảng>/` |
| Loại nguồn | `Bộ TC` — hoặc `Checklist <loại>` · `<Mã checklist>` (VD `Checklist smoke · CL-smoke_20261009`). Báo cáo tổng hợp dựa vào ô này để **không** cộng kết quả checklist vào pass rate của bộ TC |
| Nguồn TC | docs/testcases/customers/web/parts/part_01_web_danh_sach.md |
| Phạm vi | 36 TC (toàn bộ Part 1) · loại 2 TC `@Deprecated` |
| Môi trường | `<URL môi trường test>` — `<Staging/UAT/Production>` |
| Build / Version | (nếu có) |
| Tài khoản | `<tài khoản test>` (`<role>`) |
| Người thực hiện | <tên tester> (agent hỗ trợ) |
| Bắt đầu → Kết thúc | 02-08-2026 09:15 → 10:40 (85 phút) |
| Môi trường dùng chung? | Có — auto-skip TC phá huỷ đang BẬT |

## 1. Tổng kết

| Trạng thái | Số lượng | Tỷ lệ |
|---|---|---|
| ✅ PASS | 30 | 83.3% |
| ❌ FAIL | 3 | 8.3% |
| ⚠️ BLOCKED | 1 | 2.8% |
| ⏭️ SKIPPED | 2 | 5.6% |
| **Tổng** | **36** | 100% |

> **Pass rate (không tính SKIPPED):** 30/34 = 88.2%

## 2. Kết quả từng TC

| TC ID | Test Scenario | Kết quả | Bước fail | Ghi chú |
|---|---|---|---|---|
| CRM_CUST_TC_001 | Bảng hiển thị đủ 9 cột | ✅ PASS | — | — |
| CRM_CUST_TC_011 | Search chuỗi SQL injection | ❌ FAIL | 4 · biến thể `b` | Xem chi tiết #1 |
| CRM_CUST_TC_030 | Modal Bulk Actions | ⏭️ SKIPPED | — | Thao tác phá huỷ, môi trường dùng chung |

> **Lần chạy checklist** — bảng mục 2 đổi thành (cột `Module` chỉ có ở checklist Release-readiness):
>
> | TC ID | Hạng mục kiểm tra | Module | Kết quả | Priority | REQ ID | TC ID liên quan | Ghi chú |
> |---|---|---|---|---|---|---|---|
> | CL-release_release_2.0-03 | Tạo KH mới đủ field bắt buộc | customers | ✅ PASS | P1 | REQ-CUST-02 | CRM_CUST_TC_005 | — |
>
> Heading chi tiết FAIL giữ mẫu `### FAIL #n — <mã mục> · <hạng mục>`.

## 3. Chi tiết TC FAIL

### FAIL #1 — CRM_CUST_TC_011 · Search chuỗi SQL injection

| | |
|---|---|
| REQ ID | REQ-CUST-04 |
| Priority | High |
| Bước fail | Bước 4 · biến thể `b` (`' OR 1=1--`) — biến thể `a`, `c` PASS |
| **Expected** | Bảng hiển thị trạng thái "không có kết quả", trang không báo lỗi |
| **Actual** | Trang hiện thông báo lỗi cơ sở dữ liệu, bảng không hiển thị |
| 🔧 Ghi chú kỹ thuật | Tab Network: request tìm kiếm trả mã `500` |
| Evidence | ![](evidence/CRM_CUST_TC_011_step4_error500.png) |
| Tái hiện được? | Có — thử lại 2 lần đều lỗi |

## 4. TC BLOCKED

| TC ID | Nguyên nhân chặn | Cần gì để chạy được |
|---|---|---|

## 5. Dữ liệu đã tạo & dọn dẹp

| Dữ liệu | ID | Nơi tạo | Đã xoá? |
|---|---|---|---|
| Auto_Customer_1785700456 | 12130 | /admin/clients | ✅ |

> Đối chiếu số liệu hệ thống: `Total Customers` trước 1431 → sau 1431 ✅ môi trường trả về nguyên trạng.

## 6. Đề xuất bước tiếp theo

- FAIL #1 (High) → sinh bug report bằng `/create-bug-report`
- 2 TC SKIPPED cần chạy tay có giám sát trên môi trường riêng
```

---

## Anti-Patterns (NGHIÊM CẤM)

- ❌ Chấm PASS khi **chưa verify hết** các Expected Result đánh số
- ❌ Suy đoán kết quả ("chắc là đúng") mà không snapshot quan sát thực tế
- ❌ **Sửa nội dung TC cho khớp hành vi thực tế** — lệch thì ghi FAIL, TC chỉ được sửa qua `/review-testcases`
- ❌ Tự thêm/bớt bước so với Test Steps rồi vẫn chấm PASS
- ❌ Thực thi TC có thao tác phá huỷ trên môi trường dùng chung
- ❌ Tạo dữ liệu test mà không dọn, hoặc dọn nhầm dữ liệu người khác
- ❌ Dừng cả buổi chạy chỉ vì 1 TC fail (trừ 3 điều kiện dừng đã nêu)
- ❌ Chụp screenshot mọi bước của mọi TC → report nặng, khó đọc
- ❌ Dồn ghi kết quả tới cuối buổi thay vì ghi ngay sau mỗi TC
- ❌ Báo cáo pass rate mà tính cả SKIPPED vào mẫu số (làm đẹp số liệu sai lệch)
- ❌ Chạy TC `@Deprecated`, hoặc đếm nó vào SKIPPED
- ❌ Tự bỏ qua TC giá trị biên vì "chuỗi dài" — chuỗi dài vào một field không phải thao tác phá huỷ
- ❌ TC gộp FAIL mà không ghi **mã biến thể** — người sửa không biết case nào hỏng
- ❌ TC `@NeedsVerify` lệch Expected rồi đề xuất báo bug ngay — Expected chưa có evidence, phải đối chiếu lại TC trước
- ❌ Bỏ qua mục "Dữ liệu đã tạo & dọn dẹp" trong report
- ❌ Chạy checklist mà ghi `#3` trần ở cột `TC ID`, hoặc bỏ trống ô `Loại nguồn` — kết quả checklist sẽ bị nối nhầm và cộng lẫn vào số của bộ TC
