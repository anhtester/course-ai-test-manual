---
description: Sinh manual test cases nhanh từ requirements (QUICK mode — không qua quy trình 6 bước).
skills:
  - skills-rbt-manual-testing
---

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-rbt-manual-testing`** (tại `.claude/skills/skills-rbt-manual-testing/SKILL.md`) trước khi bắt đầu thực hiện tác vụ này. Sử dụng **Mode QUICK** của skill.

# Command: Sinh Manual Test Cases Nhanh từ Requirements

Command này sử dụng **Mode QUICK** của skill `skills-rbt-manual-testing` để sinh test cases nhanh từ requirements đã sẵn có.

## ⚠️ Nguyên tắc

- **Mode:** QUICK (1 lượt duy nhất, không chờ user giữa chừng)
- Phù hợp cho module đơn giản, requirements đã rõ ràng
- Nếu phát hiện requirements quá phức tạp hoặc mơ hồ → **trước batch đầu tiên** đề xuất chuyển sang FULL RBT và chờ user chọn (xem *Khi nào chuyển sang FULL RBT*). Đã bắt đầu sinh thì chạy thẳng tới hết
- Tất cả output bằng **Tiếng Việt**

## Độ hạt test case — tham số `GỘP` / `TÁCH`

Truyền kèm đường dẫn requirements, ví dụ:

```
/generate-testcases-from-requirements docs/requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md TÁCH
```

| Giá trị | Ý nghĩa | Số TC điển hình (module cỡ login) |
|---|---|---|
| *(bỏ trống)* · `GỘP` | ⭐ **Mặc định.** Biến thể cùng một trường, cùng loại phản hồi nằm chung 1 TC dưới dạng **Bảng biến thể** | 35–45 |
| `TÁCH` | Mỗi biến thể một TC riêng | 75–90 |

**Cả hai độ hạt phủ REQ y hệt nhau** — chỉ khác cách trình bày và cách đếm. Chọn `TÁCH` khi: khách hàng tính công theo số TC, cần pass-rate từng biến thể, hoặc module thuộc diện kiểm định/audit cần vết thực thi rời.

Quy tắc đầy đủ (2 kiểu gộp được phép · bảng CẤM gộp · trần 6 biến thể/TC · cách đổi độ hạt của bộ TC đã có) nằm ở mục **Độ Hạt Test Case — GỘP / TÁCH** trong skill. Agent **BẮT BUỘC** nêu độ hạt đang dùng ở dòng kế hoạch batch đầu tiên ra chat.

## Các bước thực hiện

0a. **Kiểm module đã có bộ TC chưa** — `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` (hoặc tên cũ `test_cases_<module>.md`). Có rồi thì **KHÔNG sinh mới**: REQ đã có TC mà vừa đổi → dừng, chuyển `/update-testcases-from-impact`; REQ chưa có TC → chạy **chế độ BỔ SUNG** của skill (chỉ sinh cho REQ đó, TC ID nối tiếp dải, giữ độ hạt đang dùng, ghi nối vào file hiện có, Nhật ký có mốc git). Nêu rõ nhánh đã chọn ở dòng kế hoạch
0. **Chốt độ hạt GỘP / TÁCH** theo tham số truyền vào (mặc định `GỘP`; chế độ BỔ SUNG thì **theo độ hạt của bộ TC đang có**) và nêu ra chat cùng kế hoạch batch. **Chưa chốt thì chưa được ghi dòng TC đầu tiên.**
1. **Đọc và hiểu requirements** được user cung cấp
   - Requirements đã có REQ ID → dùng nguyên mã; chưa có → agent tự gán `REQ-<MODULE>-<SỐ>`
2. **Mở TOÀN BỘ evidence** — liệt kê `docs/requirements/<module>/<nền-tảng>/evidence/` và `Read` từng ảnh (Quy Tắc Đối Chiếu Evidence trong skill). **Chưa mở xong thì chưa được ghi dòng TC đầu tiên.** Tài liệu ↔ ảnh mâu thuẫn → **ảnh thắng**, ghi `ASM-XX` và báo user. Vùng không có ảnh → TC gắn `@NeedsVerify`
3. **Ghi nhận Assumptions:** mọi điểm mơ hồ phải ghi rõ giả định đã dùng (`ASM-XX`) — không đoán ngầm
4. **Xác định các luồng chính:** Happy Path, Negative Path, Boundary Cases, Edge Cases
4b. **Chấm mức rủi ro rồi lập kế hoạch theo 4 vòng (BẮT BUỘC — TRƯỚC khi ghi dòng TC đầu tiên):**
   - **Chấm Risk Level** theo bảng tiêu chí mục "Độ sâu theo rủi ro" trong skill → chọn độ sâu: Cao → **Đầy đủ** (40–60 TC) · Trung bình → **Tiêu chuẩn** (20–30 TC) · Thấp → **Tối giản** (8–12 TC). Agent tự chấm, ghi căn cứ vào dòng kế hoạch batch; lưỡng lự thì chấm **mức cao hơn**
   - Đọc dòng `Năng lực kiểm thử của QA` ở `docs/requirements/README.md` cho các nhánh V3 `API` · `Database` · `Integration` · `Logging/Audit` — có sẵn thì dùng, **không** hỏi lại; chưa có thì hỏi user **một lần** rồi ghi ngay vào README
   - Duyệt **Bản Đồ Loại Kiểm Thử — 4 Vòng**, chấm sơ bộ từng nhánh `✅ sẽ sinh` / `➖ không áp dụng (lý do kỹ thuật)` / `⏭️ cố ý bỏ (lý do + ai quyết + điều kiện rà lại)`
   - Sinh **tuần tự V1 → V2 → V3 → V4**. Batch chia theo vòng, KHÔNG trộn hai vòng vào một batch
   > ⚠️ Bốn thứ **không bao giờ rút** dù rủi ro Thấp: toàn bộ V1 · `Required`+`Validation` khi có field nhập · `Permission` khi ≥2 vai trò · `Security` khi chạm dữ liệu người dùng khác
   - **V1 Smoke** luôn mở đầu bằng nhánh `UI cơ bản` — nhãn nguyên văn · thứ tự field · trạng thái mặc định · con trỏ đang ở ô nào. Đây là lớp bị bỏ sót nhiều nhất
5. **Áp dụng kỹ thuật thiết kế test case theo Quy Tắc Bắt Buộc trong skill:**
   - Equivalence Partitioning (EP) + Boundary Value Analysis (BVA) — mọi field có ràng buộc
   - Decision Table — BẮT BUỘC khi ≥3 điều kiện kết hợp
   - State Transition — BẮT BUỘC khi có status flow
6. **Validation chuyên biệt từng trường (Field-Level Validation - 15 Field Types):**
   - Liệt kê tất cả input fields trên form/UI
   - Sinh validation TCs **riêng cho TỪNG trường** theo đặc tính riêng (Text, Email, Phone, Date, Number, Dropdown, Checkbox/Radio, File Upload, Password, Textarea, OTP/MFA, Date Range, Rich Text, Multi-Select, Range Slider)
   - Áp dụng **Bảng Field-Level Validation Checklist** trong skill `skills-rbt-manual-testing` — **đối soát đủ TỪNG MỤC** của dòng loại field tương ứng, mục nào không áp dụng phải ghi lý do một dòng. `1 positive + 2 negative` là **sàn tối thiểu, không phải mức đạt**
   - **KHÔNG** gộp validation của **các trường khác nhau** vào 1 test case — biến thể **cùng một trường** thì gộp hay tách theo độ hạt đã chốt ở bước 0
7. **Bao phủ Component-Level Checklist** (trong skill): **Giao diện tĩnh của màn hình**, Data Table/List (sort/filter/search/pagination/empty state/bulk), CRUD Lifecycle, Permission/Role, Modal/Dialog, Notification, Status Flow
8. **Bao phủ Scenarios Chuyên Sâu & Non-Functional:**
   - Double Submit / Race Condition (click liên tiếp nút submit, concurrent edit).
   - Session & Network Resilience (session timeout mid-form, loss of network, slow 3G).
   - Localization & UTF-8 / Emoji (tiếng Việt có dấu, emoji, ký tự đa ngôn ngữ).
   - Keyboard Accessibility (Tab order, Enter/Space trigger, Focus state).
   - HTTP Status Codes (cho API TCs).
9. **Sinh test cases đầy đủ fields & Automation Metadata:**
   - `TC ID` (format: `[DỰ_ÁN]_[MODULE]_TC_[SỐ]`)
   - `REQ ID` (**bắt buộc** — mã requirement mà TC cover, VD `REQ-LOGIN-01`)
   - `Module`
   - `Risk Level` (High / Medium / Low)
   - `Test Scenario` / `Test Case Title`
   - `Pre-Condition`
   - `Test Steps` (**đánh số 1,2,3 — mỗi bước 1 hành động**, dùng `<br>` xuống dòng trong cell)
   - `Expected Result` (đánh số **khớp 1-1** với steps)
   - `Test Data` (**phải cụ thể**, không placeholder)
   - `Priority` (Critical / High / Medium / Low)
   - `Automation` (Yes / No / Partial)
   - `Auto Type` (UI / API / Unit / N/A)
   - `Tags` (`@Smoke`, `@Regression`, `@CriticalPath`, `@TechCheck` cho TC cần DevTools, `@NeedsVerify` cho TC chưa có evidence, tag nền tảng `@Web`/`@Android`/`@iOS`/`@API` khi module có ≥ 2 nền tảng...)
10. **Chạy Self-Quality Gate (11 Tiêu chí):** **Độ hạt nhất quán** (toàn bộ theo một độ hạt đã chốt; nếu GỘP thì mọi biến thể có mã riêng, không TC nào quá 6 biến thể, không vi phạm bảng CẤM gộp), Unique TC ID, 1-to-1 Step-Expected matching, Concrete Test Data, Field Validation Coverage, Automation Metadata Ready (cột `Automation` chấm theo `references/automation_criteria.md` của skill — không gắn `Yes` hàng loạt; index có mục `## Đối soát cột Automation`), **Requirement Coverage** (mọi REQ có ≥1 TC — kèm Bảng Đối Soát Coverage và **chiều ngược** — không TC nào gánh ≥ 2 REQ mà các REQ đó không có TC khác chống lưng (skill mục 6b; vi phạm → tách, TC mới cấp số nối tiếp dải)), **Evidence-verified** (đã mở 100% ảnh evidence — kèm Bảng Đối Soát Evidence), **Ngôn ngữ kiểm chứng** (phần TC chính không còn `document.` / `querySelector` / `checkValidity` / `className` / selector / mã HTTP; phần kỹ thuật nằm dưới `🔧 Ghi chú kỹ thuật` + tag `@TechCheck`), **Rà soát đặc tính chất lượng** (chấm đủ 9/9 đặc tính ISO/IEC 25010:2023 — ô `➖` phải ghi ai chịu trách nhiệm, ô 🔴 phải bổ sung TC trước khi xuất; bảng đặt cuối tài liệu TC), và **Đối soát loại kiểm thử 4 vòng** (mọi nhánh V1–V4 được chấm bằng **4 trạng thái** `✅ có TC` / `➖ không áp dụng + lý do kỹ thuật` / `⏭️ cố ý bỏ + lý do + ai quyết + điều kiện rà lại` / `🔴 thiếu`; `➖` và `⏭️` KHÔNG được dùng lẫn; ba nhánh `UI cơ bản`, `Validation`, `Permission` KHÔNG BAO GIỜ được `➖` hay `⏭️`; độ hạt GỘP thì ghi kèm số biến thể; mức rủi ro và độ sâu ghi ở đầu tài liệu kèm dòng "Nâng lên khi…"; bảng đặt cuối tài liệu TC, trước bảng ISO 25010).
11. **Ghi file theo Quy Tắc Xuất File & Theo Dõi Tiến Độ** (xem skill) — KHÔNG in bảng TC ra chat

## Bảng Output

```markdown
| TC ID | REQ ID | Module | Risk Level | Test Scenario | Pre-Condition | Test Steps | Test Data | Expected Result | Priority | Automation | Auto Type | Tags |
```

## Quy tắc quan trọng

- Test Data phải cụ thể: `test_login_01@domain.com`, không phải "email hợp lệ"
- Phải bao gồm cả Positive, Negative, Boundary, và Edge cases
- **Phải đi hết 4 vòng, không nhảy cóc** — bộ TC không có TC nào kiểm giao diện (nhãn, thứ tự field, trạng thái mặc định) là thiếu hẳn một lớp, dù validation đầy đủ đến đâu
- Mỗi trường input phải có validation TCs riêng — **không gộp các trường khác nhau vào 1 TC**. Biến thể cùng một trường thì theo độ hạt đã chốt (GỘP: Bảng biến thể · TÁCH: mỗi biến thể 1 TC)
- TC ID theo format thống nhất do user quy ước hoặc mặc định `[DỰ_ÁN]_[MODULE]_TC_[SỐ]`
- **Mỗi TC phải trỏ về ≥1 REQ ID; mỗi REQ phải có ≥1 TC** — có REQ 0 TC thì phải sinh bổ sung trước khi xuất
- Test Steps đánh số rõ ràng từng bước — không viết đoạn văn liền
- **Viết bằng ngôn ngữ người dùng nhìn thấy** — Steps và Expected Result mô tả thao tác và hiện tượng trên màn hình, KHÔNG dùng `document.*`, `querySelector`, `checkValidity()`, `className`, selector CSS/XPath, mã HTTP hay tab Network. Yêu cầu thật sự không có biểu hiện nhìn thấy (cookie, token CSRF, header HSTS) thì tách xuống dòng `🔧 Ghi chú kỹ thuật (cần DevTools):` và gắn tag `@TechCheck`. Chi tiết: mục **Quy Tắc Ngôn Ngữ Kiểm Chứng** trong skill

## Xuất File & Tiến Độ (theo Quy Tắc trong skill)

- ⚠️ **Trước batch đầu tiên:** kiểm tra `docs/testcases/README.md` — chưa tồn tại (dự án mới) thì **tạo file danh mục** với bảng rỗng. Ghi xong TC thì bổ sung/cập nhật dòng của module vào đó
- **Write-first:** ghi TC thẳng vào **file nền tảng** `docs/testcases/<module>/<nền-tảng>/test_cases_<module>_<nền-tảng>.md` sau mỗi batch; index `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` chỉ giữ tổng hợp + `## Bản đồ tài liệu` + Bảng Đối Soát Coverage (skill rbt — Quy Tắc Xuất File mục 2 & 4). **KHÔNG** in toàn bộ bảng TC ra chat
- **Nền tảng nào:** REQ ở file `web/` → TC web · REQ ở `mobile/` → TC mobile · REQ dùng chung ở index → **mỗi nền tảng nó khai một TC**, cùng `REQ ID`. User chỉ định một nền tảng thì chỉ sinh cho nền tảng đó và ghi rõ nền tảng còn thiếu ở coverage
- Chat chỉ hiện: kế hoạch batch (đầu) → dòng tiến độ mỗi batch → Bảng Đối Soát Coverage + tóm tắt đường dẫn file (cuối)
- **Tách file khi vượt ngưỡng** — đếm theo **từng nền tảng** (>40 TC ở độ hạt TÁCH · >50 TC ở độ hạt GỘP) → `<module>/<nền-tảng>/parts/part_01_<nền-tảng>_<slug>.md`, `part_02_...` cắt tại ranh giới nhóm chức năng; `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` **luôn là index** (giữ nguyên tên, KHÔNG đổi thành `*_index.md`)
- **Chạy thẳng hết mọi batch trong 1 lượt** — không dừng hỏi "có tiếp tục không"
- Dự kiến **>30 TC** → tạo `task.md` (hoặc dùng task list của Claude Code) và cập nhật sau mỗi batch

## Khi nào chuyển sang FULL RBT

Agent **tự động đề xuất chuyển mode** nếu phát hiện:
- Requirements mơ hồ, cần hỏi Q&A
- Scope lớn (>3 modules)
- Logic nghiệp vụ phức tạp, nhiều điều kiện chồng chéo
- User yêu cầu Traceability Matrix hoặc Risk Assessment