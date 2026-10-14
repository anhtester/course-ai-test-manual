---
name: login-quyet-dinh-da-chot
description: Module LOGIN của CRM — các quyết định user/PO đã chốt, ticket CRM-LOGIN-101, REQ đã gỡ/ngoài phạm vi, quy ước đặt tên ticket
type: project
nguon: lịch sử phiên 14-09 → 02-10-2026 · docs/requirements/README.md
cap-nhat: 09-10-2026
---

# Module LOGIN — quyết định đã chốt

> Số liệu sống (tổng REQ, mã kế tiếp, AMB treo) **luôn đọc từ** `docs/requirements/README.md` + `docs/requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md`. File này chỉ giữ **vì sao** mọi thứ như vậy.

## Tài liệu
- Index `docs/requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md` · nền tảng `web/requirements_login_web.md` · impact `impact/impact_PO-2026-08-18*.md`, `impact/impact_CRM-LOGIN-101.md`.
- TC: `docs/testcases/login/TEST_CASES_LOGIN_SUMMARY.md` + `web/test_cases_login_web.md` (55 TC · 104 biến thể, 13 cột / 4 vòng từ 07-10-2026 — xem [[quy-tac-viet-tc]] mục 4). `TC_046` cần `EMAIL_CUSTOMER` / `PASSWORD_CUSTOMER` trong `.env` (chưa có).

- ⚠️ **Kiểm lại 09-10-2026 (file thật thắng):** bộ TC hiện tại là **51 TC** (`001`→`051`), index REQ ghi **44 REQ** (`01`→`44`), **không** còn nhóm TC khoá tài khoản; `TC_015` / `REQ-LOGIN-41` vẫn mang nghĩa *không khoá*. Phần ticket `CRM-LOGIN-101` bên dưới có thể chỉ còn là lịch sử — đọc tài liệu trước khi dựa vào.
- TC trỏ biến `.env` sai tên (`ADMIN_PASSWORD`, `PM_EMAIL`, `PM_PASSWORD`); tên thật là `EMAIL_ADMIN` · `PASSWORD_ADMIN` · `EMAIL_PM` · `PASSWORD_PM`.
- Checklist Smoke đầu tiên: `docs/checklists/login/web/checklist_smoke_20261009.md` (14 mục, mã `CL-smoke_20261009`).

## Ticket `CRM-LOGIN-101` — khoá tài khoản (28-09-2026)
Ticket **do agent tự đặt mã** để dạy vòng lặp *Update REQ → Update TC → Execute → Retest* (user hỏi *"Ủa sao CRM-LOGIN-101"*). Nội dung PO chốt:
- Sai mật khẩu 5 lần liên tiếp cùng email → khoá **15 phút**. Lần sai thứ 5 vẫn hiện `Invalid email or password`; thông báo khoá `Your account is locked. Please try again in 15 minutes.` xuất hiện từ lần gửi thứ 6, số `15` **cố định** (AMB-LOGIN-21).
- Đang khoá thì nhập đúng cũng bị từ chối · đăng nhập đúng trước khi đủ 5 lần → bộ đếm về 0 · hết khoá → bộ đếm về 0 (AMB-23) · khoá theo email, không theo IP.
- Email **không tồn tại không bao giờ bị khoá** (AMB-22) → kéo theo `RISK-LOGIN-11` lộ email tồn tại; PO chưa xác nhận chấp nhận rủi ro.
- **Chưa deploy** (AMB-25) → REQ 45→52 trạng thái ⚪, TC khoá chấm BLOCKED.
- TC dùng tài khoản **PM**; Admin chỉ dùng để đăng nhập đúng (REQ-49, AMB-26).
- `REQ-LOGIN-41` đảo nghĩa từ "không khoá" (PO 18-08-2026) sang "khoá sau 5 lần sai" — **giữ nguyên mã**, đổi 🟡.
- User chọn P1 ✅ (đổi TC 013-a, 050 sang PM) · P2 ✅ (TC 047 không lặp quá 4 lần) · P3 ⏭️ (không cần random email không tồn tại).
- **`REQ-LOGIN-53`** (khoá ở cổng khách hàng `/login`) → user: *"không nằm trong phạm vi này… Bỏ REQ-53 luôn đi"* → đổi 🔴 Deprecated (không xoá dòng), AMB-LOGIN-28 chuyển ⏭️. Cổng khách hàng **ngoài phạm vi**.
- AMB còn treo: **AMB-LOGIN-27** (bộ đếm tính những lần gửi nào), **AMB-LOGIN-29** (đổi IP / mở khoá sớm).
- ⚠️ **Bẫy (kiểm 07-10-2026):** `impact_CRM-LOGIN-101.md` trỏ TC ID của **bộ TC cũ đã xoá** (68 TC, `parts/`, VD `TC_025` = khoá, `053`, `055`). Bộ hiện tại sinh lại 02-10-2026 **đã hấp thụ trọn ticket** (nhóm V2c `037`→`045`, luật chỉ sai bằng PM ≤ 4 lần). → **Không** chạy `/update-testcases-from-impact` với report này — sẽ sửa nhầm TC. Cảnh báo "chạy update-testcases trước khi thực thi" ở `docs/requirements/README.md` là **stale**. Delta sau này phải có Impact Report **mới hơn 02-10-2026**.

## Quyết định AMB trước đó (15 → 18-09-2026)
- AMB-01: hệ thống chỉ có role Admin (sau này danh mục ghi 3 vai trò Admin/PM/Customer — theo danh mục hiện tại).
- AMB-02: staff bị vô hiệu / tài khoản khách hàng vào `/admin` → từ chối với `Invalid email or password`.
- AMB-03: session fixation → coi là bug tiềm ẩn, **không sinh TC**.
- AMB-04: hệ thống có gửi mail xác nhận và đang chạy đúng.
- AMB-05: thông báo Quên mật khẩu đúng phải là thông điệp trung lập *"Nếu địa chỉ email này có tài khoản trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu tới đó. Vui lòng kiểm tra hộp thư (và cả thư mục Spam)."* — hệ thống còn báo `Email not found` → TC sẽ FAIL đúng.
- AMB còn lại (đến AMB-24): user bảo **lấy giá trị agent gợi ý làm câu trả lời đã chốt** → sinh REQ cho CSRF sai, mật khẩu phân biệt hoa thường, không cắt khoảng trắng mật khẩu, link reset dùng 1 lần.
- REQ ngoài phạm vi kiểm thử (PO 18-08-2026): `27`, `34`, `35`, `40`.

## Quy ước mã ticket / Impact Report
- Có Jira thật → dùng đúng key Jira. PO chốt qua chat, không có ticket → `PO-<YYYY-MM-DD>` (cùng ngày nhiều đợt thêm `-B`, `-C`). Dạy học không cần Jira → kiểu `CRM-LOGIN-101`.
- Mã ticket là hậu tố của cả chuỗi file: `impact_<MÃ>.md → impact_plan_<MÃ>.md → delta_tc_<MÃ>.md → automation_plan_<MÃ>.md` — đặt một lần, dùng nguyên văn mọi bước.
- **Gợi ý bài giảng vòng lặp** (agent đề xuất 28-09-2026): 3 loại thay đổi trong 1 ticket để học viên thấy đủ 3 nhánh — SỬA đảo nghĩa (khoá tài khoản → FAIL), BỎ tính năng (gỡ Remember me → `@Deprecated` + hiệu ứng lan), THÊM (thông báo server `The Email Address field must contain a valid email address.` → PASS). User mới chạy nhánh 1.

Liên quan: [[crm-perfex]] · [[quy-tac-requirements]] · [[quy-tac-viet-tc]]
