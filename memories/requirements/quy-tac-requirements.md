---
name: quy-tac-requirements
description: Cách user muốn xử lý requirements & AMB — chốt bằng giả định, chọn đúng command, phát hiện bảo mật chỉ ghi mức "cần Dev xác minh"
type: feedback
nguon: lịch sử phiên repo này · bộ nhớ claude-testing-skills (ambiguity-close-by-assumption…)
cap-nhat: 07-10-2026
---

# Quy tắc khi làm requirements

## Chọn đúng command khi user "chốt AMB"
- User dán câu trả lời AMB vào chat (không có file ticket) → dùng **`/update-requirements-from-ticket`** (đặt mã `PO-<YYYY-MM-DD>` hoặc mã user đưa), hoặc sửa thẳng file requirements + Nhật ký.
- **`/analyze-requirement-document` KHÔNG nhận** file `requirements_<module>*.md` / `REQUIREMENTS_*_SUMMARY.md` (đó là output, không phải tài liệu nguồn) → dừng và chỉ sang `/update-requirements-from-ticket` (đã xảy ra 15-09-2026).
- Câu trả lời mâu thuẫn với evidence đã ghi (VD "mail chạy đúng" vs ảnh `Error setting new password`) → không tự hạ REQ theo lời; mở AMB mới ghi cả hai, hỏi lại.

## AMB treo → tự chốt bằng giả định
Khi user bảo *"còn lại lấy giá trị gợi ý từ bạn"* hoặc môi trường demo không có PO thật → **tự chốt bằng câu trả lời giả định** có nguồn quyết định rõ (VD `DEMO-AMB-…`, `PO-<ngày>`), rồi chỉnh luôn REQ/TC liên quan; hành vi hiện tại lệch thì sinh REQ kỳ vọng (`❌ lệch`, TC `@KnownBug`/`🐞 KnownBug`), **không hạ assertion**.

**Why:** đây là môi trường dạy học, AMB treo làm TC "treo" và không sinh trọn.

## Khi cấp REQ mới từ AMB
Kiểm REQ cũ có mô tả cùng hành vi chưa — có thì sửa REQ đó, không cấp mã. Hai rule khác nhau (VD "hoa thường" và "khoảng trắng" của mật khẩu) → **2 REQ**, không gộp. User từng hỏi *"Tại sao sinh 4 REQ mới?"* → luôn **giải thích ngắn lý do cấp mã mới** trong báo cáo.

## Phát hiện bảo mật nghiêm trọng
Chỉ ghi ở mức **"cần Dev xác minh"**, không mô tả kỹ thuật khai thác / cách dò trong docs, TC hay câu trả lời (lần đầu viết chi tiết đã bị bộ lọc an toàn chặn giữa chừng).

## Phạm vi
- Cổng khách hàng (`/login`) của CRM **ngoài phạm vi** (user, 28-09-2026). Yêu cầu chạm cổng khách hàng → hỏi trước khi cấp REQ.
- Quy tắc bất biến về mã REQ, Deprecated, Nhật ký: xem `CLAUDE.md` mục 6b — không chép lại ở đây.

Liên quan: [[login-quyet-dinh-da-chot]] · [[khao-sat-va-evidence]]
