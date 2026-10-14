---
name: crm-perfex
description: Perfex CRM tại crm.anhtester.com — môi trường dùng chung, tài khoản, hành vi lạ đã phát hiện, luật an toàn khi test
type: project
nguon: docs/requirements/README.md · lịch sử phiên repo này · bộ nhớ claude-testing-skills (crm-demo-*)
cap-nhat: 07-10-2026
---

# Perfex CRM — `crm.anhtester.com` (hệ thống mặc định của repo)

## Thông tin "hỏi một lần" — đã chốt, KHÔNG hỏi lại
| Mục | Giá trị |
|---|---|
| Tiền tố TC ID | `CRM_` → `CRM_<MODULE>_TC_<3 số>` (user chấp nhận 14-09-2026) |
| Môi trường dùng chung | **CÓ** — nhiều học viên dùng chung. User cho phép submit form (14-09-2026), nhưng **cấm thao tác phá huỷ**, dọn dữ liệu test sau khi chạy |
| Tài khoản | `.env`: `BASE_URL` · `EMAIL_ADMIN`/`PASSWORD_ADMIN` · `EMAIL_PM`/`PASSWORD_PM` (PM thêm ngày 28-09-2026). Chưa có tài khoản Customer trong `.env` |
| Vai trò | Admin · Project Manager (đăng nhập `/admin/authentication`) · Customer (cổng riêng `/login`, không vào được `/admin`) |
| Năng lực QA | API ❌ · CSDL ❌ · tích hợp ❌ · Activity Log ❌ (bị từ chối truy cập) · DevTools ✅ — chi tiết ở đầu `docs/requirements/README.md` |
| Khu Setup | Tài khoản Admin trong `.env` bị chặn (`/admin/access_denied`, chỉ hiện "Something went wrong") — module `SETTING` hoãn |

## Luật an toàn khi test (BẮT BUỘC)
- 🔒 **Gửi mật khẩu sai chỉ dùng tài khoản Project Manager**, tối đa **4 lần sai liên tiếp**/TC, bắt đầu khi bộ đếm = 0. **Không bao giờ** gửi mật khẩu sai bằng Admin — khoá Admin là chặn cả lớp (ticket `CRM-LOGIN-101`, 28-09-2026). Brute-force chỉ dùng email **không tồn tại**.
- **Bộ đếm giờ (timer) của tài khoản Admin dùng chung:** người khác có thể đang chạy timer → bấm Logout hiện hộp thoại `Started tasks timers found!`. **Không tự dừng timer của người khác**; kết thúc phiên bằng xoá cookie thay vì bấm Logout. Tiền đề "không có timer" không đạt → TC là BLOCKED.
- **Quên mật khẩu với email có thật sẽ gửi mail thật** tới hộp thư dùng chung; chạy link đặt lại mật khẩu là **đổi mật khẩu thật** → cấm trên tài khoản dùng chung. Chưa có hộp thư test.
- Agent **không tự gõ mật khẩu** vào form đăng nhập trên host này (giới hạn an toàn) → bước "đăng nhập đúng" do user làm, gom một lèo ([[ho-so-va-giao-tiep]]).
- Dữ liệu tự tạo phải traceable (`Auto_<entity>_<timestamp>`) và xoá sạch; không Mass Delete, không xoá bản ghi không do mình tạo.
- Ảnh danh sách Customers/Contacts/Proposals chứa email dữ liệu mẫu → chụp viewport, nhắc user xem trước khi đẩy repo công khai.

## Hành vi lạ đã phát hiện (đối chiếu trước khi viết TC)
- **URL gốc `/` không có trang chủ công khai** — luôn `307 → /authentication/login` (cổng khách hàng "Please login"). Bấm logo ở trang đăng nhập admin / quên mật khẩu → rơi vào trang đó (bug TC_007, 23-09-2026). Trang công khai duy nhất khi chưa đăng nhập: `/knowledge-base`.
- **OBS-01:** mở `/` trước rồi đăng nhập Admin → bị chuyển sang trang đăng nhập cổng khách hàng dù phiên Admin đã tạo (tái hiện 5/5, 23-09-2026).
- Form `/admin/authentication/forgot_password` submit **AJAX** → ô Email không tự reset sau lỗi. Không có link quay về Login.
- Session id (`sp_session`) giữ nguyên trước/sau đăng nhập — nghi session fixation; user chốt coi là bug tiềm ẩn, **không sinh TC** (15-09-2026).
- Cookie `autologin` (Remember me) hạn ~62 ngày, JS đọc được; logout thì server vô hiệu hoá nhưng cookie còn.
- Form login không có thuộc tính `required` — validation phía server; email sai định dạng bị trình duyệt chặn trước.
- Tính năng **khoá tài khoản (CRM-LOGIN-101) chưa deploy** (AMB-LOGIN-25, 28-09-2026) → TC khoá chấm BLOCKED tới khi deploy.

Liên quan: [[login-quyet-dinh-da-chot]] · [[thuc-thi-va-bug]] · [[khao-sat-va-evidence]]
