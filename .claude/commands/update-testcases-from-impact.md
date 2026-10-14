---
description: Cập nhật manual test cases đã có theo Impact Report (chế độ delta) — sửa TC stale tại chỗ trong file nền tảng, đánh dấu @Deprecated TC của chức năng bị gỡ, ghi Nhật ký thay đổi, ghi Delta TC List ra file làm đầu vào cho automation. Hỗ trợ 2 mode — PLAN (chỉ lập kế hoạch) và APPLY (sửa + cập nhật danh mục).
skills:
  - skills-rbt-manual-testing
  - skills-coverage-traceability
  - skills-testcase-reviewer
---

# Workflow: Cập Nhật Test Cases Theo Impact Report

> **BẮT BUỘC (MANDATORY SKILLS):** Nạp và đọc kỹ trước khi bắt đầu:
> - **`skills-rbt-manual-testing`** (`.claude/skills/skills-rbt-manual-testing/SKILL.md`) — **Mode DELTA** + Quy Tắc Xuất File (index bất biến, ngưỡng tách part, Bảng Đối Soát Coverage)
> - **`skills-coverage-traceability`** (`.claude/skills/skills-coverage-traceability/SKILL.md`) — Mapping Rules để nối REQ ID ↔ TC ID

Mắt xích **giữa** của chuỗi delta 3 tầng. Requirements đổi → Impact Report chỉ ra TC stale → **workflow này** sửa đúng TC đó → `/update-automation-from-impact` sửa script tương ứng.

```
/update-requirements-from-ticket   (tầng requirements)
        ↓ docs/requirements/<module>/impact/impact_<TICKET-ID>.md
/update-testcases-from-impact      (tầng test case — WORKFLOW NÀY)
        ↓ docs/testcases/<module>/impact/delta_tc_<TICKET-ID>.md
/update-automation-from-impact     (tầng automation — web · mobile · API)
```

> **Một hậu tố cho cả chuỗi.** `<TICKET-ID>` của mọi file sau lấy **đúng hậu tố** của Impact Report nguồn: `impact_TICKET-123.md` → `impact_plan_TICKET-123.md` → `delta_tc_TICKET-123.md` → `automation_plan_TICKET-123.md`. Impact Report do spec API đổi (`impact_spec_2026-09-01.md`) → `delta_tc_spec_2026-09-01.md`. User tự liệt kê REQ, không có ticket → `adhoc_<YYYY-MM-DD>`. Một mã tra ra đủ ba tầng.

## Workflow này khác gì `/review-testcases`?

Hai workflow trả lời **hai câu hỏi khác nhau**. Chạy sai cái là bỏ sót đúng thứ cần bắt:

| | Workflow này (delta) | `/review-testcases` (chất lượng) |
|---|---|---|
| **Câu hỏi trả lời** | "TC còn khớp requirement **mới** không?" | "TC viết có đạt chuẩn không?" |
| **Input** | Impact Report + REQ đã đổi | Bộ TC (+ requirements nếu có) |
| **Bắt được** | TC **stale** — mô tả hành vi đã bị thay | TC mơ hồ, thiếu assertion, trùng lặp, thiếu boundary |
| **Bỏ sót** | Chất lượng diễn đạt của TC | **TC stale** — TC viết rất tốt về hành vi **cũ** vẫn được 12/12 điểm rubric |
| **Ghi vào đâu** | Sửa **tại chỗ**, ghi mốc git của bản cũ | Cũng sửa **tại chỗ** — nhưng chỉ các TC user duyệt sau khi chấm rubric |
| **Đầu ra cho automation** | `impact/delta_tc_<TICKET-ID>.md` — `/update-automation-from-impact` đọc file này | **Không** có Delta TC List |

> 🚨 **KHÔNG dùng `/review-testcases` mode FIX để đồng bộ TC theo ticket.** Nó chấm rubric chất lượng, không đối chiếu với REQ đã đổi, nên bỏ sót TC stale — và không sinh Delta TC List, nên `/update-automation-from-impact` không biết script nào phải sửa.
>
> Chạy `/review-testcases` **sau** workflow này thì hợp lý: đồng bộ nội dung trước, chấm chất lượng sau.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- 🚨 **CẤM sinh lại cả file/module TC.** Chỉ sửa đúng dòng của TC nằm trong delta. Sinh lại là xoá sạch công biên tập tay và các TC bổ sung đã tích luỹ
- 🚨 **CẤM đổi TC ID, CẤM đánh lại số từ `001`** — TC ID là khoá nối sang automation (`allure.label('testId', ...)`) và RTM. Đứt TC ID là vỡ truy vết cả hai chiều
- 🚨 **CẤM xoá dòng TC** — chức năng bị gỡ thì gắn tag `@Deprecated` ở cột `Tags` **và** tiền tố `🗑️ Deprecated (<TICKET-ID>, <DD-MM-YYYY>) —` ở đầu ô `Test Scenario`, giữ nguyên dòng (đối xứng quy tắc "KHÔNG xoá dòng REQ" của tầng requirements). Bảng TC không có cột trạng thái — **tag** là thứ `/execute-test-cases`, RTM và Bảng Đối Soát Coverage lọc theo
- 🚨 **CẤM sinh file `_improved` / `_v2` / `_new`** — tên index **bất biến** là `TEST_CASES_<TÊN_MODULE>_SUMMARY.md`. Bản trước khi sửa **không** chép ra đâu cả — ghi **mốc git** (hash commit) và tra bằng `git show`. **KHÔNG** tạo thư mục `archive/`
- **KHÔNG tự viết TC cho REQ mới (nhóm ➕)** — ngoài phạm vi, route sang `/generate-testcases-manual-rbt` hoặc `/generate-testcases-from-requirements`
- **KHÔNG sửa TC theo suy đoán từ tên TC** — phải đọc **nội dung REQ sau khi đổi** trong tài liệu requirements. Tên TC không chứa đủ thông tin để biết kỳ vọng mới là gì
- **KHÔNG bịa mapping REQ ↔ TC.** Không map được thì ghi vào mục "cần xác nhận", KHÔNG đoán rồi sửa nhầm TC
- 🚨 **Bám đúng độ hạt của bộ TC đang có.** Bộ TC viết ở độ hạt GỘP (có Bảng biến thể) thì TC bổ sung cũng phải gộp, và sửa một biến thể là sửa **dòng biến thể** chứ không tách nó ra thành TC mới. Bộ TC viết ở độ hạt TÁCH thì mỗi case mới là một TC. Trộn hai độ hạt trong cùng một file làm hỏng cách đếm và cách giao việc — xem mục **Độ Hạt Test Case** trong skill
- 🚨 **CẤM đổi độ hạt của cả bộ TC trong chế độ DELTA.** Đổi độ hạt là đánh lại toàn bộ TC ID, mâu thuẫn trực tiếp với quy tắc giữ nguyên TC ID ở trên. Muốn đổi thì phải là quyết định riêng, có xác nhận của user, và chỉ làm được khi chưa có script / execution report / RTM nào trỏ vào bộ TC
- 🚨 **Ticket đụng nhãn / bố cục / thứ tự field / giá trị mặc định là đụng VÒNG 1, không phải chỉ Vòng 2.** Thêm một field vào form thì sửa TC validation của field đó (V2) là **chưa xong** — bảng kiểm liệt kê thành phần màn hình ở V1 (`UI cơ bản`) cũng phải thêm dòng. Đây là chỗ DELTA hụt nhiều nhất, vì Impact Report chỉ liệt kê TC map trực tiếp với REQ
- ⚠️ **DELTA chỉ chấm lại nhánh 4 vòng mà ticket chạm tới**, giữ nguyên phần còn lại của Bảng Đối soát loại kiểm thử — KHÔNG rà lại cả module (đó là việc của `/generate-testcases-manual-rbt`)
- ⚠️ Sau khi user duyệt kế hoạch → agent tự sửa hết, KHÔNG hỏi lại giữa chừng

## 2 Chế độ (Mode)

| Mode | Khi nào sử dụng | Output |
|---|---|---|
| **PLAN** (mặc định) | Cần biết ticket này đụng tới TC nào, sửa gì | Bảng ánh xạ REQ → TC + kế hoạch sửa từng TC |
| **APPLY** | Muốn agent sửa luôn | Như PLAN + TC đã sửa + Nhật ký thay đổi + file `delta_tc_<TICKET-ID>.md` |

> User nói "sửa luôn", "cập nhật TC đi", "apply" → tự động **Mode APPLY**.

## Input cần thu thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| **Impact Report** | ⭐ Bắt buộc (hoặc thay bằng danh sách REQ dưới) | `docs/requirements/<module>/impact/impact_<TICKET-ID>.md` — do `/update-requirements-from-ticket` ghi ra, hoặc `impact_spec_<YYYY-MM-DD>.md` do `/generate-requirements-from-api` ghi ra khi spec API đổi phiên bản. Hoặc dán trực tiếp nội dung |
| **Danh sách REQ đã đổi** | Thay thế cho Impact Report | Khi user tự biết REQ nào đổi: REQ ID + đổi cái gì |
| **Tài liệu requirements hiện hành** | ⭐ Bắt buộc | Index `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` (REQ dùng chung ≥ 2 nền tảng) **và** file nền tảng `docs/requirements/<module>/<nền-tảng>/requirements_<module>_<nền-tảng>.md` của nền tảng mà REQ đổi khai áp — nguồn sự thật của kỳ vọng **mới** |
| **File test cases hiện hành** | ⭐ Bắt buộc | Index `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → theo `## Bản đồ tài liệu` mở file nền tảng `<nền-tảng>/test_cases_<module>_<nền-tảng>.md` (+ `parts/` nếu có). REQ đổi khai áp nền tảng nào thì mở **đủ** file của các nền tảng đó |
| **Evidence của module** | ⭕ Khuyến nghị · ⭐ **Bắt buộc khi ticket chạm V1** | `docs/requirements/<module>/<nền-tảng>/evidence/*.png` — **bắt buộc mở** nếu thay đổi đụng nhãn nguyên văn, bố cục, thứ tự field, giá trị mặc định hoặc định dạng hiển thị (4 nhóm không được suy diễn). Chưa có ảnh mới sau khi đổi → gắn `@NeedsVerify`, KHÔNG sửa theo suy đoán |
| **RTM** | ⭕ Khuyến nghị | Có sẵn thì map REQ → TC nhanh và chắc hơn nhiều |

> Impact Report ghi `⚠️ chưa rà soát` ở cột TC → **dừng**, báo user chạy `/generate-traceability-matrix` trước. Không có nguồn map thì workflow này chỉ đoán mò.

## Các bước thực hiện

### Bước 1: Đọc Delta

1. Đọc Impact Report, trích bảng **Test case cần xử lý** — 3 nhóm: `⚠️ Review & sửa` / `🗑️ Deprecated` / `➕ Viết mới`
2. Với mỗi REQ trong nhóm 🟡 (SỬA): đọc **nội dung REQ sau khi đổi** — REQ nằm ở index `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` hay ở file nền tảng thì đọc đúng nơi đó — để biết kỳ vọng mới là gì
3. Đọc **Nhật ký thay đổi** ở cuối tài liệu requirements — nó ghi rõ đổi từ gì sang gì, đây là nguồn chính xác nhất
4. Ghi rõ **đổi cái gì**: precondition / steps / expected result / test data / message nguyên văn / phân quyền

> Thay đổi đụng bố cục, nhãn, thứ tự field, định dạng hiển thị → **BẮT BUỘC mở evidence** theo Quy Tắc Đối Chiếu Evidence của `skills-rbt-manual-testing`. Sửa TC chỉ từ chữ là đường ngắn nhất tới TC bịa.

### Bước 2: Map REQ → TC

Áp dụng Mapping Rules của `skills-coverage-traceability`, theo thứ tự tin cậy:

| Cách map | Độ tin cậy | Dấu hiệu |
|---|---|---|
| Cột `REQ ID` trong bảng TC | ✅ Chắc chắn | TC có cột truy vết về REQ |
| RTM — file module `docs/traceability/<module>/traceability_matrix_<module>.md` (tra qua `## Bản đồ tài liệu` của file chung `docs/traceability/traceability_matrix.md`) | ✅ Chắc chắn | Tra ngược REQ → danh sách TC (cột `TC IDs` của ma trận chi tiết) |
| Bảng Đối Soát Coverage trong index | ✅ Chắc chắn | Mục "mọi REQ phải có ≥1 TC" |
| So khớp mô tả TC ↔ nội dung REQ | ⚠️ Suy luận | **Cần user xác nhận trước khi sửa** |
| Không tìm thấy TC nào | ❓ | REQ chưa có TC — chuyển sang nhóm ➕, KHÔNG sửa gì |

Mỗi TC ghi lại: **file nào** (file nền tảng `<nền-tảng>/test_cases_<module>_<nền-tảng>.md` hay `<nền-tảng>/parts/part_NN_*.md` — index không chứa dòng TC; bộ TC cũ chưa có tầng nền tảng thì mới là index), **dòng nào**, TC ID.

### Bước 3: Lập Kế Hoạch Sửa Từng TC

Phân loại hành động cho TC — **khác** với hành động dành cho script:

| Delta của REQ | Vòng · Nhánh | Hành động với TC | Phạm vi chạm |
|---|---|---|---|
| Đổi **nhãn nguyên văn** (nút, tiêu đề, nhãn field, thông báo) | **V1 · UI cơ bản** | Sửa nhãn trong bảng kiểm màn hình **và** mọi Expected Result trích nhãn đó | Bảng kiểm V1 + các ô Expected liên quan |
| **Thêm / bớt field** trên form | **V1 · UI cơ bản** *(+ V2 kèm theo)* | Thêm/bớt **dòng trong bảng kiểm** thành phần màn hình, kiểm lại thứ tự field và thứ tự Tab | Bảng kiểm V1 — **cộng thêm** TC Required/Validation ở V2 |
| Đổi **giá trị mặc định** (checkbox tick sẵn, option đang chọn, con trỏ vào ô nào) | **V1 · UI cơ bản** | Sửa dòng tương ứng trong bảng kiểm | 1 dòng bảng kiểm |
| Đổi **định dạng hiển thị** (tiền tệ, ngày, giờ, badge) | **V1 · Display** | Sửa Expected Result ghi đúng định dạng mới | Nhóm TC hiển thị |
| Đổi **hành vi giao diện** (nút khoá đến khi đủ điều kiện, field bật/tắt theo lựa chọn khác) | **V2 · UI Behavior** | Sửa TC hành vi + kiểm cả hai chiều (bật điều kiện → mở khoá; tắt → khoá lại) | Nhóm TC hành vi |
| Đổi **expected result** / message | V2 · theo nhánh của TC đó | Sửa cột Expected Result, ghi message **nguyên văn** | 1 ô trong bảng |
| Field từ tuỳ chọn → **bắt buộc** | **V2 · Required** | Sửa TC happy path + **thêm TC negative** cho trường hợp để trống | 1 TC sửa + 1 TC mới cùng nhóm |
| Đổi **luật validation** (độ dài, định dạng, dải giá trị) | **V2 · Validation + BVA** | Sửa TC boundary — kiểm lại cả 3 mốc: dưới ngưỡng / đúng ngưỡng / trên ngưỡng | Nhóm TC boundary của field đó |
| Đổi **steps / luồng** | **V2 · Use Case** | Sửa cột Steps, kiểm lại Precondition còn đúng không | Steps + Precondition |
| Đổi **quy tắc nghiệp vụ / trạng thái** | **V2 · Business Rule · State Transition** | Sửa bảng quyết định / bảng transition, kiểm cả ô hợp lệ lẫn ô bị chặn | Nhóm TC tương ứng |
| Đổi **phân quyền** | **V3 · Permission** | Sửa TC phân quyền, kiểm ma trận role còn khớp | Nhóm TC phân quyền |
| Đổi **breakpoint / trình duyệt cam kết** | **V4 · Responsive · Compatibility** | Sửa danh sách kích thước/trình duyệt trong TC | Nhóm TC V4 |
| Chức năng **bị gỡ** (REQ 🔴) | Nhánh của TC đó | Gắn tag `@Deprecated` + tiền tố `🗑️ Deprecated (TICKET-XXX, <ngày>) —` ở `Test Scenario`, **KHÔNG xoá dòng** | Cột `Tags` + ô `Test Scenario` |
| REQ **mới** (🟢) | — | ❌ Ngoài phạm vi → `/generate-testcases-manual-rbt` | — |

Mỗi mục ghi: `file:dòng`, TC ID, **vòng · nhánh**, sửa ô nào, có cần mở evidence không.

> 🚨 **Bốn dòng V1 đầu bảng BẮT BUỘC mở evidence trước khi sửa** — nhãn nguyên văn, thứ tự field, giá trị mặc định, định dạng hiển thị là đúng **4 nhóm TC không được suy diễn** theo Quy Tắc Đối Chiếu Evidence trong skill. Chưa có ảnh mới của màn hình sau khi đổi thì **KHÔNG sửa**, gắn `@NeedsVerify` và báo user recon bổ sung.
>
> 🚨 **Bộ TC ở độ hạt GỘP:** thêm field = thêm **một dòng vào Bảng kiểm** của TC `UI cơ bản` (Kiểu B), **KHÔNG** tạo TC mới và **KHÔNG** tách dòng đó ra. Trần 6 biến thể/TC vẫn áp dụng — vượt thì tách theo nhóm, không nhét thêm.

**Kiểm tác động lan toả** — chỗ hay bị bỏ sót nhất:

- **Ticket có đụng thành phần nhìn thấy được trên màn hình không** (thêm/bớt field, đổi nhãn, đổi vị trí, đổi giá trị mặc định)? → TC `UI cơ bản` ở **Vòng 1** phải cập nhật, **không chỉ** TC validation ở Vòng 2. Đây là câu hỏi hay bị bỏ qua nhất
- Field đổi thành bắt buộc → có TC nào khác **dùng field đó ở bước phụ** mà giờ sẽ fail không?
- TC bị Deprecated → có TC nào **lấy nó làm precondition** không?
- Thêm field mới → **bảng 15 loại field** của loại field đó đã được đối soát đủ chưa (Password 7 mục, Email 9 mục…), hay mới sinh 2–3 TC cho xong?
- Số TC sau khi thêm có **vượt ngưỡng** của file nền tảng không (> 40 TC ở độ hạt TÁCH · > 50 TC ở độ hạt GỘP) → phải tách `parts/` theo quy tắc của skill?

### Bước 4: Báo Cáo & Xin Duyệt (CHECKPOINT)

1. Xuất `docs/testcases/<module>/impact/impact_plan_<TICKET-ID>.md`:
   - Bảng ánh xạ REQ → TC (tách riêng mapping ✅ chắc chắn / ⚠️ suy luận / ❓ chưa có TC)
   - Kế hoạch sửa từng TC **kèm cột `Vòng · Nhánh`**, đánh dấu mục cần mở evidence
   - **Danh sách nhánh 4 vòng bị ticket chạm tới** — user nhìn một dòng là biết ticket này có đụng lớp giao diện (V1) hay chỉ đụng validation (V2):
     ```
     Nhánh bị chạm: V1 · UI cơ bản (thêm field Deadline) · V2 · Required · V2 · Validation
     Nhánh KHÔNG đụng: toàn bộ V3, V4 — giữ nguyên
     ```
   - Tác động lan toả phát hiện ở Bước 3
   - Danh sách **ngoài phạm vi** kèm command tiếp theo
2. **⏸️ DỪNG LẠI**. Mode PLAN → **KẾT THÚC**. Mode APPLY → hỏi user duyệt, **đặc biệt xác nhận nhóm ⚠️ mapping suy luận, nhóm 🗑️ Deprecated, và danh sách nhánh 4 vòng bị chạm**

### Bước 5: Sửa TC (Mode APPLY — chỉ sau khi user duyệt)

1. **Ghi mốc git trước khi sửa:** với **từng file sắp sửa**, chạy `git status --short <file>`:
   - Có dòng (thay đổi chưa commit) → **dừng**, đề nghị user commit trước. Agent **không** tự commit, và sửa đè lên thay đổi chưa commit là mất bản đối chiếu
   - Sạch → ghi `git log -1 --format=%h -- <file>` làm mốc. Đây là bước không được bỏ — bản cũ xem bằng `git show <hash>:<file>`
   - File **chưa từng** được commit → ghi `chưa có trong git`, báo user
2. Sửa **tại chỗ** trong file nền tảng `<nền-tảng>/test_cases_<module>_<nền-tảng>.md` (hoặc `<nền-tảng>/parts/part_NN_*.md` nếu đã tách) — **chỉ chạm đúng ô đã liệt kê** ở Bước 3. Bộ TC cũ chưa có tầng nền tảng → sửa trong `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` rồi chuyển một lần theo skill rbt (Quy Tắc Xuất File mục 2)
3. TC bị gỡ → gắn tag + tiền tố, giữ nguyên dòng và TC ID (các cột khác không đổi):
   ```
   | CRM_PRJ_TC_031 | REQ-PRJ-12 | ... | 🗑️ Deprecated (TICKET-123, 17-08-2026) — Copy Project | ... | @Regression @Deprecated |
   ```
4. TC negative/boundary **mới sinh trong phạm vi REQ 🟡** → cấp TC ID **tiếp theo dải hiện có** của module, KHÔNG chèn số vào giữa
5. Cập nhật **Bảng Đối Soát Coverage** ở index — **không đếm** TC `@Deprecated`. REQ 🔴 không còn TC active là **đúng**, phải ghi rõ lý do; REQ 🟡 vẫn phải có ≥1 TC active; REQ 🟢 ghi *"chưa có TC — ngoài phạm vi DELTA"* kèm command sinh bổ sung
6. Cập nhật **Bảng Đối soát loại kiểm thử (4 vòng)** ở cuối index — **chỉ những nhánh ticket chạm tới**, giữ nguyên phần còn lại:
   - Nhánh có TC bị sửa/thêm → cập nhật lại dải TC ID và **số biến thể** (độ hạt GỘP)
   - Nhánh mà ticket vừa làm phát sinh nhu cầu mới nhưng chưa có TC → chấm `🔴 Thiếu`, bổ sung trước khi kết thúc
   - Nhánh mà chức năng vừa bị gỡ khiến không còn TC active → chuyển `➖` kèm lý do *"chức năng gỡ theo TICKET-XXX"*, **không** xoá dòng khỏi bảng

### Bước 6: Nhật Ký & Delta TC List

1. Ghi **Nhật ký thay đổi** vào cuối `TEST_CASES_<TÊN_MODULE>_SUMMARY.md`:

```markdown
## Nhật ký thay đổi

| Ngày | Ticket | TC bị ảnh hưởng | Thay đổi | Mốc git trước khi sửa |
|---|---|---|---|---|
| 17-08-2026 | TICKET-123 | CRM_PRJ_TC_002 | V1 · UI cơ bản: thêm dòng bảng kiểm cho field `Deadline`, cập nhật thứ tự field | `web/test_cases_project_web.md` @ `a1b2c3d` |
| 17-08-2026 | TICKET-123 | CRM_PRJ_TC_018 | V2 · Required: Deadline tuỳ chọn → bắt buộc — sửa expected result + thêm TC_077 negative | ↑ |
| 17-08-2026 | TICKET-123 | CRM_PRJ_TC_031 | 🗑️ Deprecated — chức năng Copy Project đã gỡ | ↑ |
```

2. **Ghi Delta TC List ra file** `docs/testcases/<module>/impact/delta_tc_<TICKET-ID>.md` — đầu vào **bắt buộc** của `/update-automation-from-impact`:

```markdown
# Delta TC List — TICKET-123 · module `project`

| Mục | Giá trị |
|---|---|
| Ticket | TICKET-123 |
| Ngày áp | 17-08-2026 |
| Impact Report nguồn | [`impact_TICKET-123.md`](../../../requirements/project/impact/impact_TICKET-123.md) |
| Kế hoạch đã duyệt | [`impact_plan_TICKET-123.md`](impact_plan_TICKET-123.md) |
| Mốc git trước khi sửa | web → `web/test_cases_project_web.md` @ `a1b2c3d` · mobile → `mobile/test_cases_project_mobile.md` @ `e4f5a6b` |
| Trạng thái | ⚠️ CÒN VIỆC NGOÀI PHẠM VI |

## TC đã xử lý

| TC ID | Nền tảng | Vòng · Nhánh | Hành động đã làm | Đổi cái gì (cho automation) |
|---|---|---|---|---|
| CRM_PRJ_TC_002 | web | V1 · UI cơ bản | ✏️ Đã sửa | Thêm dòng bảng kiểm cho field `Deadline` → sửa assertion danh sách thành phần màn hình |
| CRM_PRJ_TC_018 | web | V2 · Required | ✏️ Đã sửa | Expected result: giờ báo lỗi khi Deadline trống → sửa assertion |
| CRM_PRJ_TC_052 | mobile · @Android @iOS | V2 · Required | ✏️ Đã sửa | Như TC_018 trên app — lỗi hiện dưới ô Deadline → sửa assertion cả hai nền tảng |
| CRM_PRJ_TC_077 | web | V2 · Required | ➕ Mới (trong REQ 🟡) | TC negative mới → cần viết script mới |
| CRM_PRJ_TC_031 | web | V2 · Save/Edit/Delete | 🗑️ Deprecated | Script tương ứng đánh dấu skip, KHÔNG xoá file |
| CRM_PRJ_TC_060 | mobile · @Android | V1 · UI cơ bản | ⏸️ @NeedsVerify — chưa sửa | Chưa có ảnh màn hình sau khi đổi → KHÔNG sửa script |

## Ngoài phạm vi

| REQ | Việc còn lại | Command |
|---|---|---|
| REQ-PRJ-79 → 81 | Chưa có TC | `/generate-testcases-manual-rbt` |

## Nhật ký

| Ngày | Thay đổi |
|---|---|
| 17-08-2026 | Áp lần đầu theo `impact_plan_TICKET-123.md` đã duyệt |
```

**Luật của file này:**

| Luật | Vì sao |
|---|---|
| Chỉ ghi ở **Mode APPLY**, sau khi TC đã sửa xong. Mode PLAN **không** ghi | `impact_plan_` là kế hoạch — có thể bị user gạch bớt khi duyệt. Automation chỉ được đọc thứ **đã thật sự sửa** |
| Cột **Nền tảng** bắt buộc: `web` · `mobile · @Android` / `@iOS` / `@Android @iOS` · `api` | Dải TC ID chung toàn module nên nhìn mã không biết TC thuộc nền tảng nào — thiếu cột này automation không biết chuyển sang Playwright, Appium hay API client, và không biết phải chạy lại trên Android, iOS hay cả hai |
| Cột **Vòng · Nhánh** bắt buộc | Giúp chọn đúng kiểu sửa script: `V1 · UI cơ bản` thường là assertion trên danh sách phần tử (`Automation: Partial`), `V2 · Validation` thường map sang test data-driven |
| TC không sửa được vì thiếu evidence → vẫn ghi, hành động `⏸️ @NeedsVerify — chưa sửa` | Bỏ dòng đi thì automation tưởng TC không bị ảnh hưởng. Ghi rõ để automation **biết mà không chạm** |
| Dòng **Mốc git trước khi sửa** ghi đúng hash của từng file nền tảng | Automation chạy `git diff <hash> -- <file>` ra đúng ô đã đổi, không phải đoán từ cột mô tả |
| Chạy APPLY lại cho **cùng ticket** (VD recon xong TC `⏸️`) → sửa **tại chỗ** dòng tương ứng + thêm dòng Nhật ký. KHÔNG tạo `delta_tc_<TICKET-ID>_v2.md` | Một ticket một file — automation chạy lại chỉ nhận những dòng đã đổi hành động |

3. Sau khi Quality Gate ở Bước 7 đạt, chat chỉ hiện **tóm tắt theo nền tảng** (VD *"web 3 TC · mobile 1 TC `@Android @iOS` · 1 TC ⏸️ chưa sửa"*) + đường dẫn file. Nhắc user chuỗi tiếp theo: module đã có automation → `/update-automation-from-impact` (đọc đúng file vừa ghi) → `/generate-traceability-matrix` (khớp lại RTM)

> 🚨 **Không được để Delta TC List chỉ nằm trong chat.** `/update-automation-from-impact` thường chạy ở phiên khác, có khi do người khác chạy — đóng phiên là mất, và dựng lại từ Nhật ký thì mất cột Nền tảng lẫn trạng thái `⏸️`.

### Bước 7: Quality Gate Delta

Chạy **sau** khi đã ghi Nhật ký và Delta TC List — kiểm đủ 8 mục (khớp Quality Gate DELTA của skill), thiếu mục nào là chưa xong:

- [ ] **1. Mọi TC ID giữ nguyên** — không TC nào bị đổi số hay đánh lại
- [ ] **2. Tên file index không đổi** — không sinh `_improved` / `_v2` / thư mục `archive/`
- [ ] **3. Không dòng TC nào bị xoá** — TC gỡ đều mang **cả** tag `@Deprecated` **và** tiền tố `🗑️ Deprecated (<mã ticket>, <ngày>) —` ở `Test Scenario`
- [ ] **4. Bảng Đối Soát Coverage** khớp lại: mọi REQ 🟡 và REQ chưa đổi còn active có ≥1 TC **không** `@Deprecated`; REQ 🔴 không còn TC active có ghi lý do; REQ 🟢 **không** chấm ở gate này — nằm ở *Ngoài phạm vi*
- [ ] **5. Bảng Đối soát loại kiểm thử (4 vòng)** đã cập nhật **đúng những nhánh ticket chạm tới** — không rà lại cả module, không để nhánh nào rơi vào trạng thái sai sau khi sửa. Ticket đụng thành phần màn hình mà nhánh `V1 · UI cơ bản` không đổi gì = **dấu hiệu đã bỏ sót**
- [ ] **6.** Số TC ở index (Bản đồ tài liệu) **khớp** tổng số TC của các file nền tảng / `parts/`, tách rõ số TC `@Deprecated`
- [ ] **7. `docs/testcases/README.md`** (danh mục) đã cập nhật: số TC, REQ bao phủ, ngày cập nhật
- [ ] **8. Nhật ký thay đổi** ở cuối index + **`impact/delta_tc_<TICKET-ID>.md`** đã ghi ra file — có cột Nền tảng, Vòng · Nhánh, đủ dòng `⏸️ @NeedsVerify`, mốc git từng file nền tảng

## Output

### Mode PLAN
- `docs/testcases/<module>/impact/impact_plan_<TICKET-ID>.md`: bảng ánh xạ REQ → TC, kế hoạch sửa từng TC (kèm `Vòng · Nhánh`), **danh sách nhánh 4 vòng bị chạm**, tác động lan toả, danh sách ngoài phạm vi

> Phân biệt các file cùng gắn với một ticket:
>
> | File | Loại | Nói gì | Ai đọc |
> |---|---|---|---|
> | `requirements/<module>/impact/impact_<TICKET-ID>.md` | **Báo cáo** | *Cái gì đã đổi* | Workflow này |
> | `testcases/<module>/impact/impact_plan_<TICKET-ID>.md` | **Kế hoạch** — trước khi duyệt | *Sẽ sửa TC nào, sửa gì* | User duyệt |
> | `testcases/<module>/impact/delta_tc_<TICKET-ID>.md` | **Kết quả** — sau khi áp | *Đã sửa TC nào, ở nền tảng nào, automation phải làm gì* | `/update-automation-from-impact` |
> | `testcases/<module>/impact/automation_plan_<TICKET-ID>.md` | Kế hoạch + kết quả tầng automation | *Script nào đã sửa* | Do `/update-automation-from-impact` ghi |

### Mode APPLY
- Tất cả output Mode PLAN, cộng thêm:
  - File nền tảng đã sửa **tại chỗ** (tên file không đổi) · index `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` cập nhật Bản đồ tài liệu + Nhật ký
  - Mốc git trước khi sửa của từng file — ghi ở Nhật ký và `delta_tc_`
  - **Bảng Đối soát loại kiểm thử (4 vòng)** đã cập nhật đúng nhánh bị chạm
  - Nhật ký thay đổi ở cuối file TC
  - `docs/testcases/README.md` đã cập nhật
  - **`impact/delta_tc_<TICKET-ID>.md`** — Delta TC List có cột Nền tảng + Vòng · Nhánh; chat chỉ hiện tóm tắt + đường dẫn
  - Trạng thái: ✅ ĐÃ ĐỒNG BỘ / ⚠️ CÒN VIỆC NGOÀI PHẠM VI / ❌ CHƯA XỬ LÝ XONG

## Command liên quan

| Tình huống | Command |
|---|---|
| Trước đó — cập nhật requirements từ ticket | `/update-requirements-from-ticket` |
| Trước đó — chưa có nguồn map REQ ↔ TC | `/generate-traceability-matrix` |
| REQ mới hoàn toàn, chưa có TC | `/generate-testcases-manual-rbt` · `/generate-testcases-from-requirements` |
| Sau đó — cập nhật automation script **đã có** (đọc `delta_tc_<TICKET-ID>.md`) | `/update-automation-from-impact` |
| Sau đó — automate TC mới hoàn toàn | `/generate-automation-from-testcases` (tự chuyển sang command web / mobile / API) |
| Sau đó — chấm chất lượng bộ TC vừa sửa | `/review-testcases` |
| Sau đó — chạy lại phần TC bị ảnh hưởng | `/execute-test-cases` |
| Sau đó — khớp lại ma trận truy vết | `/generate-traceability-matrix` |
