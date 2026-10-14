---
name: skills-bug-reporter
description: Skill sinh bug report chuẩn từ test FAIL — tự thu thập evidence (screenshot, log, environment), viết steps to reproduce, phân loại severity/priority, và hỗ trợ đẩy lên Jira.
---

# Bug Reporter

Purpose: Chuyển kết quả test FAIL thành bug report chuẩn, đầy đủ evidence, sẵn sàng gửi developer hoặc đẩy lên Jira.

---

## When to Use

Sử dụng skill này khi:

- Một test case (manual hoặc automation) FAIL và cần báo bug
- User yêu cầu "viết bug report", "báo bug", "tạo ticket bug"
- Sau khi chạy test suite có failure cần chuyển thành ticket
- Cần chuẩn hóa lại một bug report viết sơ sài

---

## Responsibilities

1. **Thu thập evidence** — screenshot tại thời điểm fail, error log, stack trace, console/network log, video (nếu có)
2. **Viết steps to reproduce** — các bước tối giản, ai đọc cũng tái hiện được
3. **Xác định Actual vs Expected** — rõ ràng, đo lường được
4. **Phân loại Severity / Priority** — theo bảng chuẩn bên dưới
5. **Ghi environment** — browser/version, OS, resolution, môi trường (dev/staging/prod), test data đã dùng
6. **Đẩy lên Jira** (tùy chọn) — phối hợp với skill `skills-jira-integration`

---

## Bug Report Template (BẮT BUỘC)

```markdown
# [BUG] <Tóm tắt ngắn gọn — module + hành vi sai>

## Thông tin chung
- **ID:** BUG_<module>_<timestamp>_<TC_ID> — VD `BUG_login_1787226513_TC004`. `timestamp` = epoch giây lúc sinh (chống trùng mã), `TC_ID` = mã TC ngắn không dấu gạch dưới thừa (VD `TC004`, không phải `CRM_LOGIN_TC_004`) để nhìn tên file biết ngay thuộc TC nào. Liên quan nhiều TC thì lấy TC đầu tiên/quan trọng nhất làm hậu tố, TC còn lại ghi ở dòng "Test case liên quan" bên dưới và ở danh mục. Bug từ **mục checklist**: hậu tố là `TC ID liên quan` của mục (rút gọn như trên); mục REQ-based không có TC thì hậu tố `CL<số mục>` (VD `BUG_customers_1787226513_CL03`)
- **Severity:** 🔴 Critical / 🟠 Major / 🟡 Minor / 🟢 Trivial
- **Priority:** P1 / P2 / P3
- **Nền tảng:** `web` / `mobile` / `api` — quyết định thư mục `docs/bugs/<module>/<nền-tảng>/`. Bug của rule ở server tái hiện được trên nhiều nền tảng → vẫn **một** bug, đặt ở nền tảng phát hiện đầu tiên, ghi thêm *"Cũng tái hiện trên: …"*
- **Môi trường:** <env> | <browser + version — hoặc thiết bị + OS + app version (mobile) — hoặc base URL môi trường (api)> | <OS> | <resolution>
- **Build / Version:** <build đang test khi phát hiện lỗi — BẮT BUỘC, thiếu thì không retest được>
- **Test case liên quan:** <TC ID hoặc test file path> — TC gộp thì ghi kèm **mã biến thể** fail (`CRM_LOGIN_TC_012-c`). TC ID phải đang có hiệu lực (không `@Deprecated`). Bug từ mục checklist ghi **cả** `TC ID liên quan` (nếu có) **và** mã mục (`CL-smoke_20261009-03`); checklist Release-readiness thì `<module>` của bug là cột `Module` của mục, **không** phải `_release`, evidence link về `docs/executions/_release/<nền-tảng>/run_*/evidence/`
- **REQ ID liên quan:** <mã REQ — dùng để chọn phạm vi regression khi retest>
- **Test data đã dùng:** <email/username/id — traceable>
- **Ngày phát hiện:** <DD-MM-YYYY>

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Result
<Hành vi đúng theo requirement>

## Actual Result
<Hành vi thực tế quan sát được>

## Evidence
- Screenshot: [<tên file>.png](<path/link>) — **link tới ảnh gốc** trong `docs/executions/<module>/<nền-tảng>/run_*/evidence/` (đường dẫn tương đối từ file bug: `../../../executions/<module>/<nền-tảng>/run_<timestamp>/evidence/<tên>.png`), **KHÔNG** chép ảnh sang `docs/bugs/` — một nguồn sự thật. Ảnh chụp thêm lúc tái hiện thì lưu vào `evidence/` của lần chạy tương ứng rồi link. BẮT BUỘC viết đúng cú pháp link Markdown `[]()` nếu ảnh còn xem được; `bugs-viewer` chỉ nhận diện ảnh viết theo cú pháp này làm evidence bấm-xem-được. Ảnh cũ đã mất (không còn truy cập) thì ghi tên file bằng code span `` `tên_file.png` `` (KHÔNG bọc trong `[]()`) để không hiện nhầm thành ảnh "chưa nạp, kéo vào là được"
- Error log / Stack trace: (code block)
- Console / Network log: (nếu liên quan)

## Ghi chú thêm
- **Tần suất tái hiện:** Luôn luôn / Thỉnh thoảng (x/y lần)
- **Workaround (nếu có):** ...
- **Nghi ngờ root cause (nếu phân tích được):** ...

## Lịch sử retest
<!-- Do /retest-fixed-bugs ghi. Dòng mới thêm LÊN ĐẦU bảng. Bảng rỗng = chưa retest lần nào -->

| Ngày | Build | Kết quả | Retest report | Ghi chú |
|---|---|---|---|---|
```

> ⚠️ **Mục `Lịch sử retest` là phần DUY NHẤT được phép thêm vào bug report sau khi đã bàn giao.** Mọi mục khác — Steps, Expected, Actual, Evidence — là **bằng chứng lịch sử tại thời điểm phát hiện**, không được sửa cho khớp hành vi build mới. Hành vi build mới lệch Expected thì đó là kết quả retest `PARTIAL`, không phải cớ để sửa bug gốc.

### 4 trạng thái retest

| Trạng thái | Nghĩa |
|---|---|
| ✅ **FIXED** | Chạy đúng Steps gốc, Actual khớp hoàn toàn Expected gốc, lặp ≥ 2 lần |
| ❌ **NOT_FIXED** | Lỗi cũ vẫn tái hiện — mở lại bug này, KHÔNG tạo bug trùng |
| 🟡 **PARTIAL** | Lỗi gốc hết nhưng hành vi vẫn lệch Expected, hoặc chỉ hết ở một phần trường hợp |
| ⚠️ **CANNOT_VERIFY** | Không dựng được pre-condition / môi trường lỗi / mất quyền — **KHÔNG** được chấm FIXED |

Chi tiết quy trình: workflow `/retest-fixed-bugs`.

---

## Severity & Priority Guide

| Severity | Định nghĩa | Ví dụ |
|---|---|---|
| 🔴 **Critical** | Chặn luồng chính, mất data, crash, security | Không login được, thanh toán sai tiền |
| 🟠 **Major** | Chức năng chính sai nhưng có workaround | Filter sai kết quả, export thiếu cột |
| 🟡 **Minor** | Chức năng phụ sai, UI lệch ảnh hưởng sử dụng | Validation message sai, sort không đúng |
| 🟢 **Trivial** | Lỗi hiển thị nhỏ, không ảnh hưởng chức năng | Sai chính tả, lệch margin |

| Priority | Định nghĩa |
|---|---|
| **P1** | Fix ngay trong sprint hiện tại / hotfix |
| **P2** | Fix trong sprint kế tiếp |
| **P3** | Fix khi có thời gian (backlog) |

> Severity đánh giá theo **mức ảnh hưởng kỹ thuật**; Priority theo **mức khẩn cấp business**. Hai giá trị độc lập nhau.

---

## Workflow

1. **Collect** — Đọc test fail: error log, screenshot, test file, test data
2. **Reproduce** — Tái hiện lỗi (chạy lại test hoặc thao tác trên browser qua MCP) để xác nhận không phải flaky. Nếu nghi flaky → chuyển sang skill `skills-flaky-test-analyzer` trước
3. **Isolate** — Rút gọn steps to reproduce về mức tối thiểu
4. **Classify** — Gán Severity/Priority theo bảng chuẩn
5. **Write** — Điền template, đính kèm evidence
6. **Deliver** — Lưu file `docs/bugs/<module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md` và cập nhật danh mục `docs/bugs/README.md` (template bên dưới); nếu user yêu cầu → đẩy lên Jira qua `skills-jira-integration`

---

## Template Danh Mục `docs/bugs/README.md` (BẮT BUỘC)

Danh mục là **điểm vào tầng bug** và cũng là file `scripts/bugs-viewer` nạp để có cái nhìn tổng quan khi chưa nạp từng file bug chi tiết. Chưa có thì tạo mới theo đúng khung này; đã có thì **chỉ thêm/sửa dòng**, không dựng lại bảng.

```markdown
# Danh mục Bug Report — <Tên hệ thống>

| Mục | Giá trị |
|---|---|
| Hệ thống | <tên + URL> |
| Quy ước mã bug | `BUG_<module>_<timestamp>_<TC_ID>` |
| Đường dẫn file | `docs/bugs/<module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md` |
| Ngày cập nhật | <DD-MM-YYYY> |

## 1. Danh mục bug

| Mã bug | Module | Nền tảng | Tiêu đề ngắn | Severity | Priority | Trạng thái | TC liên quan | Ngày phát hiện |
|---|---|---|---|---|---|---|---|---|
| [BUG_login_1787226514_TC016](login/web/BUG_login_1787226514_TC016.md) | `LOGIN` | `web` | Ô Email không giữ giá trị sau khi đăng nhập thất bại | 🟡 Minor | P2 | 🔴 **Đang mở** | `CRM_LOGIN_TC_016` | 20-08-2026 |
```

> ⚠️ **Tên cột là hợp đồng đọc, không phải nhãn trình bày.** `scripts/bugs-viewer` chỉ nhận bảng danh mục khi có **đồng thời** cột `Mã bug` **và** cột `Trạng thái` — thiếu một trong hai (hoặc dịch sang `Bug ID` / `Status`) thì viewer **bỏ toàn bộ bảng**, không báo lỗi gì. Các cột còn lại khớp theo chuỗi con (`Module`, `Tiêu đề`, `Severity`, `Priority`, `TC liên quan`, `Ngày phát hiện`) — thiếu thì chỉ mất cột đó.
>
> **Giá trị cột `Trạng thái`** phải chứa một trong các từ khoá viewer nhận: `Đang mở` · `Đã fix` / `Chờ retest` · `rà lại` · `đóng`. Viết kiểu khác thì bug bị xếp mặc định là *Đang mở*.
>
> **Ai cập nhật cột này:** `/create-bug-report` ghi `🔴 **Đang mở**` · dev báo đã fix → `🟡 Chờ retest` · `/retest-fixed-bugs` ghi theo kết quả retest (bảng ánh xạ ở Bước 5 của workflow đó). Cột này phải khớp dòng mới nhất của **Lịch sử retest** trong file bug — viewer tính trạng thái file chi tiết từ Lịch sử retest, còn bug chỉ có trong danh mục thì đọc cột này, lệch nhau là hai nơi báo hai trạng thái.
>
> **Cột `TC liên quan` với bug từ mục checklist:** ghi `TC ID liên quan` của mục; mục REQ-based không có TC thì ghi mã mục (`CL-smoke_20261009-03`). Cột `Module` là module **của mục**, kể cả khi lần chạy là checklist release (`_release`).
>
> **Cột `Mã bug` nên bọc link Markdown** trỏ tới file bug tương ứng — viewer lấy mã từ trong `[...]`, và người đọc bấm được sang chi tiết.

---

## Quality Checklist

Trước khi bàn giao bug report, verify:

- [ ] Steps to reproduce đã tối giản, người khác làm theo tái hiện được
- [ ] Đã tái hiện ít nhất 1 lần để loại trừ flaky
- [ ] Expected có căn cứ (requirement/spec), không phải suy đoán
- [ ] Có ít nhất 1 evidence (screenshot hoặc log)
- [ ] Test data traceable — dev có thể tìm đúng record trong DB
- [ ] Severity/Priority gán theo bảng chuẩn, không cảm tính
- [ ] Title đủ thông tin để tìm kiếm sau này (module + hành vi sai)
- [ ] **Có `Build / Version`** — thiếu thì `/retest-fixed-bugs` không đối chiếu được build mới, retest thành vô nghĩa
- [ ] **Có `REQ ID liên quan`** (nếu truy được) — thiếu thì retest không chọn được phạm vi regression, phải dò tay
- [ ] Có mục `Lịch sử retest` (bảng rỗng) sẵn trong file

---

## Rules References

- `.claude/rules/automation_rules.md` — Test data traceable
- `.claude/skills/skills-jira-integration/SKILL.md` — Đẩy bug lên Jira
- `.claude/skills/skills-flaky-test-analyzer/SKILL.md` — Loại trừ flaky trước khi báo bug
