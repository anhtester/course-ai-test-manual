---
description: Sinh bug report chuẩn từ test FAIL — thu thập evidence, viết steps to reproduce, phân loại severity/priority. Tùy chọn đẩy lên Jira.
skills:
  - skills-bug-reporter
  - skills-jira-integration
  - skills-flaky-test-analyzer
---

# Workflow: Tạo Bug Report Từ Test FAIL

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-bug-reporter`** (tại `.claude/skills/skills-bug-reporter/SKILL.md`) trước khi bắt đầu.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **Phải tái hiện lỗi ít nhất 1 lần** trước khi viết bug — nếu không tái hiện được → nghi flaky → đề xuất chạy `/analyze-flaky-tests` thay vì báo bug
- **KHÔNG bịa evidence** — chỉ đính kèm screenshot/log thực tế thu thập được
- Đẩy lên Jira chỉ khi user xác nhận nội dung bug report

## Input cần thu thập

| Input | Bắt buộc? |
|---|---|
| Test fail (test file + error log, HOẶC mô tả manual TC fail) | ⭐ Bắt buộc |
| Requirement/spec liên quan (để viết Expected có căn cứ) | Khuyến nghị |
| Môi trường (env, browser, account test) | Khuyến nghị — agent tự thu thập nếu thiếu |

## Các bước thực hiện

### Bước 1: Thu thập & Tái hiện
1. Đọc test file / mô tả lỗi, error log, screenshot có sẵn
2. Tái hiện lỗi: chạy lại test HOẶC thao tác trên browser qua Playwright MCP (`navigate → wait_for(page_load) → thao tác → screenshot khi lỗi xuất hiện`)
3. Nếu KHÔNG tái hiện được → dừng, báo user và đề xuất `/analyze-flaky-tests`

### Bước 2: Phân tích & Phân loại
1. Rút gọn steps to reproduce về mức tối thiểu
2. Xác định Expected (có căn cứ requirement) vs Actual (quan sát được)
3. Gán Severity/Priority theo bảng trong skill `skills-bug-reporter`

### Bước 3: Viết Bug Report (CHECKPOINT)
1. Điền đầy đủ template trong skill, lưu file `docs/bugs/<module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md` — `<nền-tảng>` là nền tảng của lần chạy phát hiện bug (thư mục `docs/executions/<module>/<nền-tảng>/` chứa report gốc)
2. **⏸️ DỪNG LẠI** — trình bày cho user review, hỏi: "Nội dung bug report đã chính xác chưa? Có cần đẩy lên Jira không?"

### Bước 4: Đẩy lên Jira (tùy chọn — chỉ khi user xác nhận)
- Dùng skill `skills-jira-integration` để tạo issue với đầy đủ nội dung + attachment

## Output

- File `docs/bugs/<module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md` theo template chuẩn
- Bổ sung/cập nhật dòng của bug trong danh mục `docs/bugs/README.md` — chưa tồn tại thì tạo mới theo **Template Danh Mục** trong skill `skills-bug-reporter` (cột `Mã bug` và `Trạng thái` là bắt buộc, thiếu là `scripts/bugs-viewer` bỏ cả bảng)
- Jira issue key (nếu user chọn đẩy lên Jira)
