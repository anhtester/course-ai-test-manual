---
name: ban-giao-va-bao-cao
description: Cách bàn giao kết quả — file nằm trong repo, báo cáo cuối lượt, BẮT BUỘC gửi Slack #project-book sau khi chạy test cases xong / có summary report mới (quy tắc gốc ở CLAUDE.md)
type: feedback
nguon: lịch sử phiên repo này · bộ nhớ claude-ai-testing · course-ai-test-automation
cap-nhat: 07-10-2026
---

# Bàn giao & báo cáo

## File bàn giao phải nằm trong repo
Tài liệu sinh ra (requirements, TC, report, bug, plan, HTML/PDF…) ghi **thẳng vào đúng thư mục trong repo** theo cấu trúc `docs/` của `CLAUDE.md` mục 6b. Scratchpad chỉ dùng cho file trung gian (script build, file tạm).

**Why:** 24-08-2026 (repo `claude-ai-testing`, tiền thân repo này) agent build file `.docx` trong scratchpad, gửi qua SendUserFile — user không tìm thấy, phải nhắc "move it into this repo".

**How to apply:** script chuyển đổi dùng lại được (VD convert test plan → HTML/PDF ngày 18-09-2026) thì **đề xuất** đưa vào `scripts/`, không tự ý.

## Báo cáo cuối lượt
- Mở đầu bằng **kết quả** (số liệu: TC · biến thể · REQ phủ · PASS/FAIL/BLOCKED/SKIP), rồi file đã ghi (link tương đối), rồi **việc cần user quyết** (đánh số), rồi lệnh kế tiếp.
- Nói thẳng phần **chưa kiểm** ("chưa chạy thử", "chưa có ảnh") — không để user tưởng đã xong.
- Có thay đổi lớn trên `docs/` chưa commit → nhắc commit.

## Slack `#project-book` — BẮT BUỘC, quy tắc gốc nằm ở `CLAUDE.md`
Quy tắc đầy đủ: mục **"Báo cáo kết quả sang Slack"** ở đầu `CLAUDE.md` (user yêu cầu ghi vào ngày 07-10-2026). Tóm tắt:
- **Luôn gửi, không hỏi lại**, vào kênh **`#project-book`** ngay sau khi: **(1)** chạy test cases xong (manual lẫn automation, kể cả PASS hết — `/execute-test-cases`, `/retest-fixed-bugs`, `/run-and-fix-tests`…) · **(2)** có **summary report** mới (`/generate-test-summary-report`).
- Link file chỉ **đường dẫn tương đối** trong backtick · **đính ảnh evidence** của TC FAIL · cập nhật sau khi gửi → trả lời trong **thread** tin gốc · ghi link tin Slack vào báo cáo chat · Slack chưa kết nối → nói rõ chưa gửi được · không đưa nội dung `.env`.
- Channel id của `#project-book` **chưa biết** → lần gửi đầu tra theo tên kênh, rồi ghi id vào đây.

**Lịch sử (đã thay thế):** 02-10-2026 quy tắc cũ gửi vào `#project-crm` (id `C0BSZTW5NFQ`) ở 4 tình huống — test FAIL · sinh xong TC · test plan · requirements. 07-10-2026 user chốt ngắn lại thành 2 tình huống trên và đổi kênh sang `#project-book`. Sinh TC / requirements / test plan **không** còn bắt buộc gửi.

**Why:** 01-10-2026 (repo automation) agent quên gửi, user hỏi *"tại sao bạn không báo cáo cho tôi bên Slack"*; 02-10-2026 user nhắc *"Bạn cập nhật lại bên Slack luôn chứ"*.

**How to apply:** `CLAUDE.md` là nguồn sự thật. Nếu lấy bộ skills mới mà mục Slack trong `CLAUDE.md` biến mất → vẫn áp quy tắc trên và nhắc user thêm lại mục đó.

Liên quan: [[ho-so-va-giao-tiep]] · [[lich-su-repo-va-hien-trang]] · [[thuc-thi-va-bug]]
