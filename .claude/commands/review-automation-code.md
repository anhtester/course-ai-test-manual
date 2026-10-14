---
description: Review chất lượng automation script đã viết — chấm rubric 6 nhóm theo Definition of Done, bắt hard sleep/locator inline/thiếu Allure metadata/assertion yếu. Hỗ trợ 2 mode — REVIEW (chỉ báo cáo) và FIX (báo cáo + sửa code).
skills:
  - skills-automation-code-reviewer
  - skills-smart-locator-agent
---

# Workflow: Review Automation Code

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-automation-code-reviewer`** (tại `.claude/skills/skills-automation-code-reviewer/SKILL.md`) trước khi bắt đầu.

Kiểm code automation **đã tồn tại** theo Definition of Done trong `CLAUDE.md` — thứ mà test xanh không chứng minh được.

## Workflow này khác gì các workflow lân cận?

| | Workflow này | `run-and-fix-tests` | `review-testcases` |
|---|---|---|---|
| **Đối tượng** | Code automation | Kết quả chạy | Manual test case |
| **Tiền đề** | Suite xanh cũng vẫn review được | Suite đang đỏ | Có file TC |
| **Bắt được gì** | Pass giả, hard sleep, report rỗng, POM sai | Test fail | TC mơ hồ, thiếu coverage |

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- Mọi vi phạm phải có **`file:line` + trích nguyên văn code** — không nhận xét chung chung
- Mọi đề xuất phải ở dạng **code cũ → code mới** chạy được
- **Mode REVIEW KHÔNG sửa code**. Mode FIX chỉ sửa sau khi user duyệt danh sách
- **KHÔNG** đổi kỳ vọng nghiệp vụ của test khi sửa — sửa chất lượng code, không sửa ý nghĩa test
- Sửa xong **bắt buộc chạy lại** để chứng minh không làm hỏng test đang xanh

## 2 Chế độ (Mode)

| Mode | Khi nào sử dụng | Output |
|---|---|---|
| **REVIEW** (mặc định) | Cần đánh giá chất lượng bộ script | Báo cáo chấm điểm + đề xuất sửa |
| **FIX** | Muốn agent sửa luôn các vi phạm | Như REVIEW + code đã sửa + kết quả chạy lại |

> User nói "sửa luôn", "dọn giùm", "cleanup code" → tự động **Mode FIX**.

## Input cần thu thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| **Phạm vi review** | ⭐ Bắt buộc | Thư mục test, module, hoặc "toàn bộ suite" |
| **Manual test cases tương ứng** | ⭕ Khuyến nghị | Để đối chiếu TC ID trong Allure label và kiểm test có bám đúng TC không |

## Các bước thực hiện

### Bước 1: Khoanh Vùng

1. Xác định stack (Playwright TS / Selenium Java / Appium / Pytest) từ `package.json` / `pom.xml`
2. Liệt kê file trong phạm vi, tách rõ **test file** và **page object**
3. Chạy bộ pattern quét nhanh trong skill để khoanh vùng vi phạm — kết quả là **manh mối**, chưa phải kết luận

### Bước 2: Đọc & Chấm Điểm

Với mỗi file, chấm 6 nhóm (0-2 mỗi nhóm) theo rubric trong skill: **Sạch · POM & cấu trúc · Wait strategy · Test data · Report (Allure) · Assertion & độc lập**.

Mỗi điểm trừ phải kèm `file:line` + trích nguyên văn dòng vi phạm.

### Bước 3: Soi Sức Mạnh Assertion

Với mỗi test hỏi: *test này có thể PASS trong khi tính năng đang hỏng không?*

Đánh dấu riêng test chỉ assert sự tồn tại element mà không verify **thay đổi do hành động gây ra** — đây là nguồn pass giả phổ biến nhất, và là giá trị lớn nhất của workflow này.

### Bước 4: Kiểm Mức Suite

- Output có gom hết vào `reports/` không? Có `allure-results/` / `test-results/` / `playwright-report/` lạc ra root không?
- `.gitignore` đã có `reports/` chưa?
- Có credentials thật trong code / file config commit được không?
- Có test trùng lặp (2 test verify cùng một thứ) không?

### Bước 5: Báo Cáo (CHECKPOINT)

1. Xuất `reports/automation_code_review.md` theo template trong skill
2. Tách riêng **vi phạm chặn bàn giao** khỏi danh sách chung
3. **⏸️ DỪNG LẠI**. Mode REVIEW → **KẾT THÚC**. Mode FIX → hỏi user duyệt danh sách sửa

### Bước 6: Sửa (Mode FIX — chỉ sau khi user duyệt)

Thứ tự: vi phạm chặn bàn giao trước, rồi 🔴, rồi 🟡.

| Nhóm | Cách sửa |
|---|---|
| Hard sleep | Thay bằng web-first assertion / `WebDriverWait` |
| Locator inline trong test | Chuyển vào Page class, đặt tên theo convention |
| Locator dynamic class / XPath vị trí | Sinh locator mới qua `skills-smart-locator-agent` — **phải verify trên DOM thực tế**, không đoán |
| Thiếu Allure metadata | Bổ sung title Tiếng Việt, Description, Severity, Tags, TC ID |
| Test body phẳng | Bọc lại thành step `Arrange:` / `Act:` / `Assert:` |
| Thiếu screenshot | Thêm vào teardown (`afterEach` / `@AfterMethod` / fixture) — **không** rải trong thân test |
| Data hardcoded | Thay bằng random traceable `prefix_testName_timestamp` |
| Debug log / code comment-out / import thừa | Xoá |
| Assertion yếu | Bổ sung assertion verify thay đổi thật + message mô tả kỳ vọng |
| Output lạc khỏi `reports/` | Sửa config theo `.claude/rules/reporting_rules.md` mục 6 |

### Bước 7: Chạy Lại & Xác Nhận

1. Chạy toàn bộ phạm vi vừa sửa — **phải PASS 2 lần liên tiếp**
2. Test đang xanh mà sau khi sửa chuyển đỏ → rollback thay đổi đó, ghi nhận vào báo cáo
3. Mở report kiểm mắt thường theo checklist mục 7 của `reporting_rules.md`: tên test Tiếng Việt, có step, có ảnh cuối, không có `stdout`
4. Cập nhật báo cáo: điểm trước → điểm sau

## Output

### Mode REVIEW
- `reports/automation_code_review.md`: tổng quan, bảng vi phạm chặn bàn giao, bảng chấm điểm từng file, chi tiết vấn đề kèm `file:line`, danh sách assertion yếu, kiểm mức suite, thứ tự xử lý

### Mode FIX
- Tất cả output Mode REVIEW, cộng thêm:
  - Code đã sửa (`file:line`, code cũ → mới)
  - Kết quả chạy lại 2 lần
  - Bảng điểm trước/sau
  - Trạng thái: ✅ ĐẠT DoD / ⚠️ CÒN VI PHẠM CHƯA SỬA / ❌ CHƯA ĐẠT
