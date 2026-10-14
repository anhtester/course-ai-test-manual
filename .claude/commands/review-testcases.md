---
description: Review chất lượng manual test cases — chấm điểm theo rubric 6 tiêu chí, phát hiện TC mơ hồ/trùng lặp, chỉ ra coverage gaps. Hỗ trợ 3 mode — REVIEW (chỉ báo cáo), FIX (báo cáo + sửa TC) và AUTOMATION (chấm độc lập TC nào làm automation được theo bảng tiêu chí).
skills:
  - skills-testcase-reviewer
  - skills-rbt-manual-testing
---

# Workflow: Review Manual Test Cases

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-testcase-reviewer`** (tại `.claude/skills/skills-testcase-reviewer/SKILL.md`) trước khi bắt đầu.

> 🚨 **KHÔNG dùng workflow này để cập nhật TC theo ticket đã đổi requirements** → dùng `/update-testcases-from-impact`.
>
> Workflow này chấm **chất lượng cách viết** theo rubric 6 tiêu chí. Một TC mô tả rất tốt về hành vi **đã bị thay đổi** vẫn đạt 12/12 điểm — rubric không đối chiếu với REQ mới, nên **không bắt được TC stale**.
>
> Thứ tự đúng: `/update-testcases-from-impact` đồng bộ nội dung **trước** → workflow này chấm chất lượng **sau**.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **Mode REVIEW không sửa file TC nào** — chỉ xuất báo cáo
- **Mode AUTOMATION không sửa file TC nào** cho tới khi user duyệt ở checkpoint — duyệt rồi cũng **chỉ** ghi ô `Automation` + mục đối soát ở index, không đụng Steps/Expected
- **Mode FIX sửa TẠI CHỖ** trong file TC đang dùng, **chỉ** các TC user đã duyệt ở checkpoint Bước 4. 🚨 **CẤM sinh bản sao** `_improved` / `_v2` / `_new` hay thư mục `archive/` — tên file TC là **bất biến**, mọi workflow phía sau (`/execute-test-cases`, `/generate-automation-*`, `/generate-traceability-matrix`) đọc theo mẫu tên; bản sao làm chúng tiếp tục đọc bản cũ và để lại hai bộ TC không ai biết bộ nào có hiệu lực. Bản trước khi sửa tra bằng **mốc git** ghi trong Nhật ký
- Mọi nhận xét phải kèm **ví dụ sửa cụ thể** — không chê chung chung
- Nếu thiếu requirements → vẫn review 5/6 tiêu chí, ghi chú rõ không đánh giá được traceability

## 3 Chế độ (Mode)

| Mode | Khi nào sử dụng | Output |
|---|---|---|
| **REVIEW** (mặc định) | User cần đánh giá chất lượng bộ TC | Báo cáo review + đề xuất sửa |
| **FIX** | User muốn agent sửa luôn các TC 🔴/🟡 | Như REVIEW + sửa tại chỗ các TC đã duyệt + dòng Nhật ký có mốc git |
| **AUTOMATION** | User cần biết TC nào làm automation được — bộ TC bất kỳ, kể cả file không có cột `Automation` | Báo cáo `automation_review_*` — Yes/Partial/No từng TC kèm căn cứ, điều kiện cần xin dev, dòng lệch với cột có sẵn. Duyệt rồi mới ghi ngược cột |

> Nếu user nói "sửa luôn", "cải thiện giùm", "viết lại giúp" → tự động chuyển sang **Mode FIX**.
>
> Nếu user nói "case nào automate được", "đánh giá khả năng automation", "chuẩn bị convert sang automation" → tự động chuyển sang **Mode AUTOMATION**.

## Input cần thu thập

| Input | Bắt buộc? |
|---|---|
| File test cases (Markdown/Excel/CSV) | ⭐ Bắt buộc |
| Requirements/user stories liên quan | Khuyến nghị — để đánh giá traceability + coverage gaps |

## Các bước thực hiện

### Bước 1: Đọc Input
1. Đọc file TC, xác định format và số lượng. File **index** `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → theo `## Bản đồ tài liệu` đọc các file nền tảng (index không chứa dòng TC); chấm riêng từng nền tảng khi chúng khác người viết/khác độ phủ
2. Đọc requirements (nếu có)
3. **Lập Danh sách loại trừ** theo mục *Phạm vi loại trừ* của skill — mục `Ngoài phạm vi`, REQ ghi ngoài phạm vi viết TC / 🔴 Deprecated, AMB `⏭️` *"không viết TC"* / *"chuyển sang module khác"*, RISK đã chấp nhận kèm quyết định không kiểm, dòng `⚪ Ngoài phạm vi` của index TC. User bảo bỏ qua index TC → vẫn lấy phần loại trừ **từ requirements**

> **Mode AUTOMATION** → bỏ Bước 2–5, làm **Bước A1–A3** (ngay sau Bước 5).

### Bước 2: Review Từng TC
1. Chấm điểm 6 tiêu chí (0-2 mỗi tiêu chí, tối đa 12) theo rubric trong skill — TC `@Deprecated` không chấm. Tiêu chí 2 soát ngôn ngữ DOM/HTTP ở phần TC chính; tiêu chí 6 **không** trừ điểm TC gộp đúng Kiểu A/B
   - **Expected đọc cùng Pre-Condition + Test Data** của chính TC đó (mục *Đọc Expected cùng Pre-Condition* của skill): không đòi Expected bổ sung thứ Pre-Condition đã nêu, không trừ vì Expected không lặp lại tiền đề, không gọi "mâu thuẫn" khi hai chỗ cùng dẫn tới một trạng thái
2. Xếp loại: 🟢 (10-12) / 🟡 (6-9) / 🔴 (0-5)
3. Với mỗi TC 🔴/🟡: trích nguyên văn chỗ chưa đạt + viết đề xuất sửa cụ thể

### Bước 3: Phân Tích Mức Bộ TC

> Mọi mục dưới đây **bỏ** các phần thuộc Danh sách loại trừ (Bước 1.3): không ghi vào gap, không vào cột *Mục thiếu*, không đề xuất TC / REQ mới, không nhắc ở Kết luận. Nhánh 4 vòng chỉ thiếu phần đã loại → `⏭️` kèm mã quyết định. Báo cáo chỉ ghi **một dòng** `Loại trừ theo requirements:` ở Tổng quan.

1. **Đối soát 4 vòng (BẮT BUỘC)** — duyệt mọi nhánh của **Bản Đồ Loại Kiểm Thử — 4 Vòng** trong `skills-rbt-manual-testing`, chấm `✅` / `🟡 nông` / `🔴 thiếu` / `➖ không áp dụng (lý do kỹ thuật)` / `⏭️ cố ý bỏ` (giữ nguyên nhánh bộ TC đã chấm `⏭️` hợp lệ — có lý do + ai quyết + điều kiện rà lại — **không** tính là gap; `⏭️` rơi vào thứ không bao giờ được rút thì chấm 🔴). Soi kỹ ba nhánh hay mất nhất: `UI cơ bản` (V1), `Validation` (V2), `Permission` (V3)
2. **Đối soát bảng 15 loại field** — với TỪNG field, so từng mục của dòng loại field tương ứng với TC thực có; thiếu mục nào nêu đích danh mục đó
3. Coverage gaps: liệt kê kịch bản cụ thể, **ghi kèm vòng/nhánh** tương ứng — không ghi "thiếu negative case" suông
4. TC trùng lặp → đề xuất merge: giữ một TC, TC kia đánh dấu `@Deprecated` (không xoá dòng, không đánh lại số)
5. Độ hạt GỘP → **đếm số biến thể**; tổng biến thể ít bất thường = đã rụng case dù REQ vẫn phủ đủ
6. Kiểm tra priority có hợp lý không

> 🚨 Rubric 6 tiêu chí ở Bước 2 chấm **cách viết từng TC** — một bộ TC thiếu hẳn lớp giao diện vẫn có thể 🟢 toàn bộ. Bước 3 là chỗ **duy nhất** bắt được điều đó. Bỏ qua mục 1 và 2 thì báo cáo sẽ xác nhận sai rằng bộ TC đã ổn.

### Bước 4: Báo Cáo (CHECKPOINT)
1. Xuất báo cáo theo template trong skill vào `docs/testcases/<module>/review/testcase_review_report_<nền-tảng>_<YYYYMMDD>.md` — cạnh bộ TC mà nó chấm. File TC nằm ngoài `docs/` → lưu báo cáo cạnh file đó
2. **Đối chiếu kết quả chạy** (nếu có `docs/executions/<module>/`) — ghi chú `⚠️ chưa có evidence` / tag `@NeedsVerify` mà execution report đã giải quyết là **ghi chú đã cũ**, đưa vào báo cáo để dọn
3. **⏸️ DỪNG LẠI** — trình bày kết quả. Mode REVIEW → KẾT THÚC. Mode FIX → hỏi user xác nhận danh sách TC sẽ sửa

### Bước 5: Sửa TC (Mode FIX — chỉ khi user xác nhận)
1. Ghi lại **mốc git** của file TC trước khi sửa: `git status --short <file TC>` có dòng (thay đổi chưa commit) → **dừng**, đề nghị user commit trước, agent không tự commit; sạch thì ghi `git log -1 --format=%h -- <file TC>`. File **chưa** được git theo dõi (VD Excel/CSV khách gửi) → **hỏi user** trước khi ghi đè, vì không có cách lấy lại bản cũ
2. Sửa **tại chỗ**, chỉ các TC đã duyệt: TC 🟢 giữ nguyên; TC 🟡 sửa theo đề xuất; TC 🔴 viết lại (tuân thủ chuẩn `skills-rbt-manual-testing`)
3. **Giữ nguyên TC ID** — không đánh lại số. Tách TC → phần tách ra cấp **số mới nối tiếp dải** (không `TC_xxa`). TC bỏ hẳn → tag `@Deprecated` + tiền tố `🗑️ Deprecated (<lý do>, <ngày>) —` ở `Test Scenario`, **không** xoá dòng. Bỏ một biến thể → ghi lại lý do ngay trong Expected của TC đó
4. Bổ sung TC mới cho coverage gaps ưu tiên High (nếu user đồng ý) — **nối tiếp** mã TC kế tiếp của module, tuân thủ **Bản Đồ Loại Kiểm Thử — 4 Vòng** và **Bảng Field-Level Validation Checklist**, đặt vào đúng nhánh đã báo thiếu
5. **Đồng bộ file index** `TEST_CASES_<TÊN_MODULE>_SUMMARY.md`: Assumptions · Bảng Đối Soát Coverage · Vùng chưa có evidence · Đối soát 4 vòng · tổng số TC / biến thể · Bộ chạy đề xuất
6. Ghi **1 dòng Nhật ký thay đổi** vào index: nguồn `/review-testcases` mode FIX + link báo cáo · TC nào sửa gì · **mốc git trước khi sửa**

### Bước A1: Chấm khả năng automation (Mode AUTOMATION)
1. Đọc **[Tiêu chí chấm cột Automation](../skills/skills-rbt-manual-testing/references/automation_criteria.md)** — đủ 8 mục, trước TC đầu tiên
2. Chấm **độc lập**: bỏ qua cột `Automation` có sẵn trong lúc chấm. Mỗi TC: Expected cốt lõi → Trục 1 (bảng 3A theo dấu hiệu, không khớp thì 3B) → Trục 2 → Trục 3 → lấy mức thấp nhất
3. Kết luận khác `Yes` → trích nguyên văn chữ trong TC làm căn cứ. TC mơ hồ → `❓ Chưa chấm được`, không đoán
4. Vướng tạm thời → `⏸️ Hoãn`, không hạ giá trị. TC phơi bug không hoãn
5. Gom điều kiện của `Partial`, đếm số TC mở khoá. Điều kiện chưa rõ có sẵn hay chưa → ghi `❓ Chưa rõ`; user đã nói môi trường có sẵn → TC phụ thuộc chấm `Yes`
6. File có cột `Automation` → đối chiếu, lập bảng dòng lệch

### Bước A2: Báo Cáo (CHECKPOINT)
1. Xuất báo cáo theo **Report Template — Mode AUTOMATION** của skill vào `docs/testcases/<module>/review/automation_review_<nền-tảng>_<YYYYMMDD>.md`. File TC nằm ngoài `docs/` → lưu cạnh file đó
2. Chat chỉ hiện: số Yes/Partial/No/Hoãn/❓ · top điều kiện cần xin · số dòng lệch · đường dẫn báo cáo
3. **⏸️ DỪNG LẠI** — hỏi user có ghi ngược vào cột `Automation` không. Không → KẾT THÚC

### Bước A3: Ghi ngược cột Automation (chỉ khi user duyệt)
1. Ghi **mốc git** của file TC trước khi sửa — file đang có thay đổi chưa commit → **dừng**, đề nghị user commit trước. File chưa được git theo dõi → **hỏi user** trước khi ghi đè
2. Sửa **tại chỗ** ô `Automation` của các TC đã duyệt — đúng một từ `Yes`/`Partial`/`No`. File chưa có cột → thêm cột tên đúng `Automation`. **Không** đụng Steps/Expected
3. Ghi / cập nhật mục `## Đối soát cột Automation` ở index (mẫu mục 7.1 của tiêu chí)
4. Ghi **1 dòng Nhật ký thay đổi**: nguồn `/review-testcases` Mode AUTOMATION + link báo cáo · số TC đổi giá trị · mốc git

## Output

### Mode REVIEW
- File `review/testcase_review_report_<nền-tảng>_<YYYYMMDD>.md`: điểm từng TC, vấn đề + đề xuất sửa, **Bảng đối soát loại kiểm thử (4 vòng)**, coverage gaps (kèm vòng/nhánh), TC trùng lặp, khuyến nghị

### Mode FIX
- Tất cả output của Mode REVIEW, cộng thêm:
  - File TC **đã sửa tại chỗ** (cùng tên, cùng vị trí) + index đã đồng bộ
  - Dòng Nhật ký thay đổi có mốc git — xem bản cũ bằng `git show <mốc>:<đường dẫn file TC>`
  - Danh sách TC mới bổ sung cho gaps (nếu có)

### Mode AUTOMATION
- File `review/automation_review_<nền-tảng>_<YYYYMMDD>.md`: kết luận Yes/Partial/No/⏸️ Hoãn/❓ từng TC kèm căn cứ trích nguyên văn, **danh sách điều kiện cần chuẩn bị** xếp theo số TC mở khoá, dòng lệch với cột `Automation` có sẵn, thứ tự automate đề xuất
- Nếu user duyệt ghi ngược: cột `Automation` đã sửa tại chỗ + mục `## Đối soát cột Automation` ở index + dòng Nhật ký có mốc git
