---
name: thuc-thi-va-bug
description: Thực thi manual TC trên browser thật và tạo bug report — giới hạn mật khẩu, BLOCKED, dọn phiên, bug trỏ TC/REQ, user hay xoá executions/bugs để chạy lại
type: feedback
nguon: lịch sử phiên 23-09, 28-09, 02-10-2026
cap-nhat: 07-10-2026
---

# Thực thi TC & bug report

## `/execute-test-cases`
- User đưa **file requirements** thay vì file TC → tự suy ra file TC tương ứng của module (đã làm 23-09-2026), nói rõ đã chạy file nào.
- Phạm vi kiểu *"những cập nhật và thêm mới từ ngày 28-09-2026"* → lọc theo Nhật ký / `delta_tc_<ticket>.md`.
- Agent **không tự gõ mật khẩu thật** trên `crm.anhtester.com` → mọi bước "đăng nhập đúng" cần user. **Gom các bước cần user thành một kịch bản** đưa một lần ở đầu đợt (thứ tự TC, lần nào cần đăng nhập, lưu ý bộ đếm sai), không hỏi "xong" từng bước. Xem [[ho-so-va-giao-tiep]].
- User đăng nhập thất bại giữa chừng → dừng, cảnh báo bộ đếm sai có thể đã tăng, không gửi thêm lần sai.
- Tiền đề không đạt (VD tài khoản dùng chung đang có timer) → **BLOCKED** kèm lý do; không đụng dữ liệu người khác. User có thể tự xử lý tiền đề rồi chạy lại riêng TC đó (*"CRM_LOGIN_TC_010 Tôi đã tắt timer"*).
- Kết thúc phiên bằng xoá cookie khi Logout có thể chạm timer của người khác.
- Không ghi mật khẩu thật vào execution report (từng bị lộ ở `run_1787215085` của repo toolkit).
- Phát hiện lỗi ngoài bộ TC → ghi `OBS-xx` trong report, đề xuất `/create-bug-report` + bổ sung TC.

## `/create-bug-report`
- Tái hiện nhiều lần từ phiên sạch, ghi tỉ lệ (VD 5/5). Loại lượt thử bị nhiễu do cách dựng phép thử khỏi kết luận chính.
- Bug trỏ đúng TC ID + REQ ID đang hiệu lực; evidence chỉ **link** tới `docs/executions/.../evidence/`, không chép ảnh.
- Kết thúc bằng câu hỏi: nội dung đúng chưa, có đẩy Jira không (cần project key), build/version là gì. **Không tự đẩy Jira.**
- Liên kết logo trỏ đúng nhưng đích bị redirect → ghi câu hỏi cho PO (có "trang chủ công khai" không) thay vì kết luận lỗi code.

## User hay xoá `docs/executions/` và `docs/bugs/` để chạy lại từ đầu
Đã xảy ra 23-09 và 02-10-2026. File biến mất giữa phiên → hiểu là user xoá có chủ ý: **không tạo lại**, dọn tham chiếu gãy nếu nằm trong phạm vi việc đang làm, nói rõ chỗ còn trỏ tới file đã xoá (VD REQ-44 còn ghi mã bug cũ). Danh mục `docs/bugs/README.md` sẽ được tạo lại ở lần `/create-bug-report` kế tiếp.

Liên quan: [[crm-perfex]] · [[review-testcases]] · [[ban-giao-va-bao-cao]]
