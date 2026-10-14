---
name: ho-so-va-giao-tiep
description: Người dùng là ai, dùng repo này để làm gì, và muốn được giao tiếp thế nào
type: user
nguon: lịch sử phiên repo này (26-08 → 07-10-2026) · bộ nhớ course-ai-test-automation · claude-testing-skills
cap-nhat: 09-10-2026
---

# Hồ sơ người dùng & cách giao tiếp

## Người dùng
- **Anh Tester** — giảng viên, người xây khoá học *AI Testing* (manual + automation) và bộ skills `.claude/` dùng lại cho nhiều dự án.
- Repo này (`course-ai-test-manual`) là **repo thực hành của khoá Manual Testing có AI**: dùng làm ví dụ trên lớp — sinh requirements → test case → thực thi → bug → retest. Nội dung phải **dễ dạy, dễ cho học viên đọc**.
- Thường dùng các slash command của bộ toolkit (`/discover-system`, `/generate-requirements-from-website`, `/generate-testcases-from-requirements`, `/execute-test-cases`, `/create-bug-report`, `/review-testcases`, `/update-*-from-*`, `/generate-master-test-plan`…).

## Ngôn ngữ — Tiếng Việt
Mọi báo cáo, giải thích viết **Tiếng Việt**, ngắn gọn, rõ ràng. Code, đường dẫn, định danh kỹ thuật giữ nguyên.

**Why:** `CLAUDE.md` mục 1 + user yêu cầu trực tiếp (03-09-2026, repo automation). 02-10-2026 user hỏi lại để kiểm — có lúc `CLAUDE.md` bị đổi thành "Tiếng Anh" do chép đè; nếu thấy lệch thì báo user, vẫn trả lời Tiếng Việt.

## Không bắt user ngồi canh từng bước
Bước agent không được tự làm (gõ mật khẩu thật trên `crm.anhtester.com`, tạo tài khoản ngoài localhost) → **gom thành 1 kịch bản** làm một lèo, không hỏi kiểu "làm bước 1 rồi nhắn xong".

**Why:** 26-09-2026 (khảo sát app Android) user bực: *"tôi mắc ngồi canh bạn làm hả"*. 28-09-2026 khi chạy TC khoá tài khoản ở repo này, agent cũng bắt user nhắn "xong" 4 lần liên tiếp — đúng kiểu cần tránh.

**How to apply:** tự làm hết phần không cần mật khẩu trước → phần còn lại ghi ❔/BLOCKED kèm lý do → cuối đợt đưa **một** kịch bản ngắn (giá trị cụ thể, thứ tự thao tác) → user làm xong báo một lần. Nói giới hạn an toàn **một lần**, không tranh luận lại.

## Hỏi ít, tự quyết nhiều
- Câu hỏi "hỏi một lần" (môi trường dùng chung, prefix TC ID, năng lực QA) đã có trong `docs/requirements/README.md` và [systems/](../systems/) → **không hỏi lại**.
- Có đề xuất hợp lý thì đưa luôn kèm "tôi đề xuất"; user thường chốt nhanh kiểu *"Chốt cả 3 như ý bạn"*.
- User hay cắt ngắn yêu cầu (VD *"Bỏ REQ-53 luôn đi"*) — làm đúng ý, áp quy tắc bất biến (đổi 🔴 Deprecated, không xoá dòng) và nói rõ đã làm thế.

## User tự quản lý git
User tự commit / tự xoá thư mục. Agent **không** commit, không `git pull/checkout/reset` (xem `CLAUDE.md` Git Pull Restriction). Khi sắp chạy workflow DELTA cần mốc git mà file chưa commit → **nhắc user commit trước**, không tự commit.

- **09-10-2026:** user đăng nhập một lần rồi bảo agent *lưu session để khỏi nhập lại* — xem [[crm-session-da-luu]]. User cũng hay yêu cầu agent *tự nhập mật khẩu*: agent từ chối một lần, rồi đưa kịch bản user tự gõ.

Liên quan: [[ban-giao-va-bao-cao]] · [[thuc-thi-va-bug]]
