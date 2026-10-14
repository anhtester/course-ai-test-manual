---
description: Sinh manual test cases chất lượng cao theo quy trình AI-RBT 6 bước (Risk-Based Testing) từ requirements.
skills:
  - skills-rbt-manual-testing
  - skills-requirements-analyzer
---

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-rbt-manual-testing`** (tại `.claude/skills/skills-rbt-manual-testing/SKILL.md`) trước khi bắt đầu thực hiện tác vụ này. Sử dụng **Mode FULL RBT** của skill. Ngoài ra, tham khảo thêm skill **`skills-requirements-analyzer`** để hiểu cách phân tích giao diện nếu cần.

# Command: Sinh Manual Test Cases theo AI-RBT Framework (FULL RBT Mode)

Command này sử dụng **Mode FULL RBT** của skill `skills-rbt-manual-testing` — quy trình **AI-RBT (AI-Driven Risk-Based Testing)** gồm 6 bước tuần tự để sinh manual test cases từ tài liệu yêu cầu.

> [!NOTE]
> **Luồng này dành cho Claude Code (slash command).** Agent thực hiện theo hướng dẫn trong skill, KHÔNG cần đọc file prompt.txt.
> Nếu QA team dùng AI agent khác (Codex, Antigravity, Kiro, Cursor…) không có slash command này, hãy copy-paste từng bước từ `plans/manual/01-06/prompt.txt`.

## ⚠️ Nguyên tắc thực thi

- **Mode:** FULL RBT (6 bước tuần tự)
- **BẮT BUỘC chạy tuần tự** từng bước, KHÔNG gộp nhiều bước
- **PHẢI dừng lại** chờ user phản hồi tại Bước 2 (Q&A) và Bước 4 (Review Scenarios)
- Nếu user chưa cung cấp requirements, hỏi user cung cấp trước khi bắt đầu
- Tất cả output bằng **Tiếng Việt**

## Các bước thực hiện

Thực hiện theo hướng dẫn chi tiết trong skill `skills-rbt-manual-testing` → phần **Mode 2: FULL RBT**.

### Bước 1: Khởi tạo ngữ cảnh (Context & Role-play)
1. Yêu cầu user cung cấp: tên dự án, mô tả hệ thống, mục tiêu MVP, tài liệu yêu cầu
2. **Chốt độ hạt test case `GỘP` / `TÁCH`** — mặc định `GỘP`. Nêu rõ trong phần xác nhận bối cảnh kèm số TC ước tính theo từng độ hạt, để user chặn lại được ngay ở Bước 1 thay vì sau khi đã sinh xong. Quy tắc đầy đủ ở mục **Độ Hạt Test Case — GỘP / TÁCH** trong skill
3. **Kiểm module đã có bộ TC chưa** — `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` (hoặc tên cũ `test_cases_<module>.md`). Có rồi thì **KHÔNG sinh mới**: REQ đã có TC mà vừa đổi → dừng, chuyển `/update-testcases-from-impact`; REQ chưa có TC → **chế độ BỔ SUNG** của skill (phạm vi chỉ REQ đó, TC ID nối tiếp dải, giữ độ hạt đang dùng). Nêu rõ nhánh đã chọn trong phần xác nhận bối cảnh
4. **Mở TOÀN BỘ evidence** — liệt kê `docs/requirements/<module>/<nền-tảng>/evidence/` và `Read` từng ảnh (Quy Tắc Đối Chiếu Evidence trong skill). Output Bước 1 có **Danh mục Evidence đã mở** (ảnh nào đủ / cắt cụt / thiếu). Chưa mở xong thì Bước 1 chưa xong
5. Đọc kỹ tài liệu, xác nhận hiểu bối cảnh
6. **Chờ user xác nhận** → sang Bước 2

### Bước 2: Phân tích yêu cầu (Analysis & QnA)
1. Xác định Happy Path, Alternate Paths, Exception Paths
2. Phát hiện Ambiguities (thiếu sót, mâu thuẫn, chưa rõ ràng)
3. Đặt câu hỏi Q&A có đánh số (Q1, Q2...) cho user/PO/BA, kèm ngữ cảnh + assumption
4. **DỪNG LẠI — Chờ user trả lời câu hỏi** → sang Bước 3

### Bước 3: Phân rã hệ thống (Decomposition)
1. Chia tính năng thành Modules / Sub-modules
2. Mô tả chức năng từng Module + Dependencies giữa chúng

### Bước 4: Đảm bảo độ bao phủ (Traceability)
1. Map Module → mã Yêu cầu (REQ-01, REQ-02...)
2. Cross-check thiếu sót (Gap Analysis), liệt kê High-Level Scenarios **xếp theo 4 vòng** (V1 Smoke / V2 Functional / V3 Technical / V4 Non-functional), mỗi nhánh chấm sơ bộ `✅ sẽ sinh` / `➖ không áp dụng + lý do kỹ thuật` / `⏭️ cố ý bỏ + lý do + ai quyết + điều kiện rà lại`. Nhánh V3 `API` · `Database` · `Integration` · `Logging/Audit` lấy theo dòng `Năng lực kiểm thử của QA` ở `docs/requirements/README.md` — chưa có thì hỏi user **một lần** ở checkpoint này rồi ghi vào README
3. **Chấm mức rủi ro từng Module (Cao / Trung bình / Thấp)** theo bảng tiêu chí mục "Độ sâu theo rủi ro" trong skill — agent **tự chấm và ghi căn cứ**, KHÔNG hỏi riêng — và nêu **độ sâu tương ứng** kèm số TC ước tính, để user chặn được ngay nếu thấy quá nông hoặc quá dày
4. **Chờ user review** scenarios, bảng 4 vòng và mức rủi ro → sang Bước 5
   > Đây là lúc user chặn lại rẻ nhất: nhìn bảng 4 vòng là biết ngay bộ TC sắp sinh có bỏ sót lớp nào không, trước khi tốn công sinh chi tiết.

### Bước 5: Sinh Test Case chi tiết (RBT & TC Generation)
0. **Sinh tuần tự theo 4 vòng** (**Bản Đồ Loại Kiểm Thử — 4 Vòng** trong skill): `V1 Smoke` → `V2 Functional` → `V3 Technical` → `V4 Non-functional`. Mỗi batch nằm trọn trong **một** vòng, KHÔNG trộn vòng. V1 luôn mở đầu bằng nhánh `UI cơ bản` (nhãn nguyên văn · thứ tự field · trạng thái mặc định) — đây là lớp bị bỏ sót nhiều nhất. V1 fail thì mọi TC V2 đều BLOCKED, nên phải sinh và chạy trước.
1. **Áp mức rủi ro đã được duyệt ở Bước 4** (user sửa mức nào thì theo mức đó) — mức rủi ro quyết định **độ sâu**: Cao → Đầy đủ (đủ 4 vòng, 40–60 TC) · Trung bình → Tiêu chuẩn (20–30 TC) · Thấp → Tối giản (8–12 TC).
   > ⚠️ Lưỡng lự thì chấm **mức cao hơn**. Bốn thứ **không bao giờ rút**: toàn bộ V1 · `Required`+`Validation` khi có field nhập · `Permission` khi ≥2 vai trò · `Security` khi chạm dữ liệu người dùng khác. Nhánh cố ý bỏ chấm `⏭️` kèm **lý do + ai quyết + điều kiện rà lại**, KHÔNG dùng `➖`.
2. Sinh test cases đầy đủ: **REQ ID** (từ Traceability Matrix Bước 4), Title, Pre-condition, Steps (**đánh số 1,2,3 — mỗi bước 1 hành động**), Expected (đánh số khớp 1-1), Test Data, Priority.
3. Áp dụng kỹ thuật theo **Quy Tắc Bắt Buộc** trong skill: EP+BVA (field có ràng buộc), **Decision Table** (≥3 điều kiện kết hợp), **State Transition** (có status flow).
4. **Validation chuyên biệt từng trường (Field-Level Validation - 15 Field Types):**
   - Liệt kê tất cả input fields trên form/UI đang test.
   - Sinh validation TCs **riêng cho TỪNG trường** (Text, Email, Phone, Date, Number, Dropdown, Checkbox/Radio, File Upload, Password, Textarea, OTP/MFA, Date Range, Rich Text, Multi-Select, Range Slider).
   - Tham chiếu **Bảng Field-Level Validation Checklist** trong skill `skills-rbt-manual-testing` — **đối soát đủ TỪNG MỤC** của dòng loại field tương ứng, mục không áp dụng phải ghi lý do. `1 positive + 2 negative` là **sàn tối thiểu, không phải mức đạt** (Password có 7 mục).
   - **KHÔNG** gộp validation của **các trường khác nhau** vào 1 TC. Biến thể **cùng một trường** thì gộp hay tách theo độ hạt đã chốt ở Bước 1.
5. **Bao phủ Component-Level Checklist** (trong skill): **Giao diện tĩnh của màn hình**, Data Table/List, CRUD Lifecycle, Permission/Role (đối chiếu Ma trận Phân quyền), Modal/Dialog, Notification, Status Flow (đối chiếu Ma trận Trạng thái).
6. **Bao phủ Scenarios Chuyên Sâu & Non-Functional:**
   - Double Submit / Race Condition (click liên tiếp nút submit, concurrent edit).
   - Session & Network Resilience (session timeout mid-form, loss of network, slow 3G).
   - Localization & UTF-8 / Emoji (tiếng Việt có dấu, emoji, ký tự đa ngôn ngữ).
   - Keyboard Accessibility (Tab order, Enter/Space trigger, Focus state).
   - HTTP Status Codes (cho API TCs: 200, 400, 401, 403, 404, 409, 422, 429, 500/503).
7. Test Data phải cụ thể (không placeholder chung chung).
8. **Sinh theo batch, ghi thẳng vào file** (theo Quy Tắc Xuất File & Theo Dõi Tiến Độ trong skill):
   - Công bố kế hoạch batch trước khi sinh (số batch · ước tính TC · số file)
   - Mỗi batch 15–25 TC, **chia theo vòng** (V1 → V4; vòng 2 đông thì chia con bên trong vòng theo nhóm chức năng) → ghi file → báo 1 dòng tiến độ
   - **Chạy thẳng hết mọi batch**, KHÔNG dừng hỏi giữa các batch (checkpoint của FULL RBT nằm ở Bước 2 và Bước 4, không phải trong Bước 5)
   - **KHÔNG** in toàn bộ bảng TC ra chat

### Bước 6: Chuẩn hóa Format & Metadata (Template Mapping)
1. Đóng gói toàn bộ test cases vào bảng Markdown chuẩn đầy đủ metadata cho Automation:
   `| TC ID | REQ ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data | Automation | Auto Type | Tags |`
2. **Chạy Self-Quality Gate (11 tiêu chí):** **Độ hạt nhất quán** (toàn bộ theo một độ hạt đã chốt ở Bước 1; nếu GỘP thì mọi biến thể có mã riêng, không TC nào quá 6 biến thể, không vi phạm bảng CẤM gộp), Unique TC ID, 1-to-1 Step-Expected matching (steps đánh số rõ từng bước), Concrete Test Data, Field Validation Coverage, Automation Metadata Ready (cột `Automation` chấm theo `references/automation_criteria.md` của skill — không gắn `Yes` hàng loạt; index có mục `## Đối soát cột Automation`), **Requirement Coverage** (mọi REQ có ≥1 TC — xuất Bảng Đối Soát Coverage; REQ nào 0 TC phải sinh bổ sung trước khi xuất và **chiều ngược** — không TC nào gánh ≥ 2 REQ mà các REQ đó không có TC khác chống lưng (skill mục 6b; vi phạm → tách, TC mới cấp số nối tiếp dải)), **Evidence-verified** (đã mở 100% ảnh trong `evidence/` — xuất Bảng Đối Soát Evidence; vùng không có ảnh thì TC gắn `@NeedsVerify`), và **Ngôn ngữ kiểm chứng** (phần TC chính không còn `document.` / `querySelector` / `checkValidity` / `className` / selector CSS-XPath / mã HTTP; phần cấp kỹ thuật nằm dưới `🔧 Ghi chú kỹ thuật (cần DevTools):` và TC mang tag `@TechCheck`), **Rà soát đặc tính chất lượng** (chấm đủ 9/9 đặc tính ISO/IEC 25010:2023 — ô `➖` phải ghi ai chịu trách nhiệm, ô 🔴 phải bổ sung TC trước khi xuất; bảng đặt cuối tài liệu TC), và **Đối soát loại kiểm thử 4 vòng** (mọi nhánh V1–V4 được chấm bằng **4 trạng thái** `✅ có TC` / `➖ không áp dụng + lý do kỹ thuật` / `⏭️ cố ý bỏ + lý do + ai quyết + điều kiện rà lại` / `🔴 thiếu`; `➖` và `⏭️` KHÔNG được dùng lẫn; ba nhánh `UI cơ bản`, `Validation`, `Permission` KHÔNG BAO GIỜ được `➖` hay `⏭️`; độ hạt GỘP thì ghi kèm số biến thể; mức rủi ro và độ sâu ghi ở đầu tài liệu kèm dòng "Nâng lên khi…"; bảng đặt cuối tài liệu TC, trước bảng ISO 25010).
3. ⚠️ **Kiểm tra `docs/testcases/README.md`** — chưa tồn tại (dự án mới) thì **tạo file danh mục trước** với bảng rỗng, để biết prefix TC ID nào đã bị chiếm và có chỗ theo dõi độ phủ REQ↔TC.
4. Ghi TC vào **file nền tảng** `docs/testcases/<module>/<nền-tảng>/test_cases_<module>_<nền-tảng>.md` — REQ ở `web/` → TC web · REQ ở `mobile/` → TC mobile · REQ dùng chung ở index → mỗi nền tảng nó khai một TC, cùng `REQ ID`. **Tách vào `<module>/<nền-tảng>/parts/part_NN_<nền-tảng>_<slug>.md` khi file nền tảng vượt ngưỡng** (>40 TC ở độ hạt TÁCH · >50 TC ở độ hạt GỘP) (cắt tại ranh giới nhóm chức năng); `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` **luôn là index** (giữ nguyên tên) — tổng hợp, Bản đồ tài liệu, Bảng Đối Soát Coverage theo nền tảng. Mỗi module một thư mục riêng. Xong thì **bổ sung/cập nhật dòng của module** trong danh mục.
5. Dự kiến **>30 TC** → tạo `task.md` (hoặc dùng task list của Claude Code), cập nhật sau mỗi batch.
6. Chat chỉ hiện: kế hoạch batch → tiến độ từng batch → Bảng Đối Soát Coverage + tóm tắt đường dẫn file.

## Output

- Bảng Test Cases Markdown hoàn chỉnh (có cột **REQ ID**) kèm Automation Metadata (`Automation`, `Auto Type`, `Tags`), sẵn sàng copy sang Excel/Jira/TestRail hoặc sync trực tiếp vào Google Sheets
- Traceability Matrix + **Bảng Đối Soát Coverage** (REQ × số TC × đủ Positive/Negative/Boundary)
- **Bảng Đối soát loại kiểm thử (4 vòng)** — mọi nhánh V1–V4 × ✅/➖/⏭️/🔴 × TC ID (kèm số biến thể nếu GỘP) hoặc lý do (➖) · lý do + ai quyết + điều kiện rà lại (⏭️)
- Danh sách Ambiguities đã giải quyết
- Báo cáo Self-Quality Gate Verification (11 tiêu chí)
