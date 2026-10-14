---
name: review-testcases
description: /review-testcases chỉ chuẩn hoá bộ TC trước khi thực thi — không đối chiếu execution report, bug, hay file index
type: feedback
nguon: bộ nhớ máy của repo này (review-testcases-scope, 23-09-2026)
cap-nhat: 07-10-2026
---

# Phạm vi `/review-testcases`

Khi chạy `/review-testcases` (mode REVIEW/FIX), chỉ chấm **bản thân các dòng TC** trong file nền tảng/parts. **KHÔNG** đưa vào báo cáo:
- dữ liệu execution (`docs/executions/`, `run_*`, evidence thực thi) — kể cả khi index dẫn tới run không còn tồn tại
- bug report (`docs/bugs/`, mục "Bug đang theo dõi")
- nội dung file index `TEST_CASES_<MODULE>_SUMMARY.md` (Assumptions, bảng đối soát, nhãn ✅/➖/⏭️, Nhật ký…) — bỏ qua hết

**Why:** user dùng review để chuẩn hoá bộ TC *trước* khi thực thi chạy kiểm chứng và log bug. Họ chủ động xoá bằng chứng thực thi cũ để chạy lại từ đầu (23-09-2026), nên việc thiếu execution/bug là cố ý, không phải lỗi. Nguyên văn: *"Lưu nhớ cái này cho tôi."*

**How to apply:**
- Bỏ Bước 4.2 "Đối chiếu kết quả chạy" của workflow; không báo "evidence đã mất", không đề xuất gắn lại `@NeedsVerify` vì thiếu run.
- Đối soát vòng / 15 loại field thì tự lập từ các dòng TC + requirements, không chấm lại bảng của index.
- **Không** đề xuất ghi thêm "làm gì khi Pre-Condition không thoả" vào TC — tiền đề không đạt = BLOCKED là quy ước thực thi chung (user bác góp ý kiểu này ở TC_010: *"Pre-condition đã bảo là không có Timer đang chạy rồi"*, 23-09-2026).
- Gộp TC theo chủ ý của user (VD TC gộp 2 màn hình / 2 cơ chế trong bộ LOGIN) thì tôn trọng, không ép tách. *"TC_042 không cần thiết"* = không cần sửa TC đó.

Liên quan: [[quy-tac-viet-tc]] · [[thuc-thi-va-bug]]
