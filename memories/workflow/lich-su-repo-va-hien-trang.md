---
name: lich-su-repo-va-hien-trang
description: Repo này hình thành thế nào (26-08 → 07-10-2026); bộ skills mới (13 cột / 4 vòng) là nguồn sự thật, bộ TC LOGIN còn định dạng cũ 10 cột / 2 vòng
type: project
nguon: git log · lịch sử 21 phiên của repo · kiểm file ngày 07-10-2026
cap-nhat: 07-10-2026
---

# Lịch sử repo & hiện trạng

## Dòng thời gian (theo bài học của khoá)
| Ngày | Việc | Ghi chú |
|---|---|---|
| 26-08-2026 | Sinh `docs/SRS-Login-Module.md` bằng prompt tự do, tạo `README.md`, bỏ `reqs/` khỏi `.gitignore` | Bài mở đầu — chưa có skill |
| 04-09-2026 | "Bài 4 sử dụng prompts chuẩn" — TC Login dạng bảng `TCs_Login_04092026.md` (40 TC, ID `TC_LOGIN_001`) | Prompt vai trò Senior Manual QA |
| 07-09-2026 | "Bài 5 xây dựng SKILLS RULES" — commit cuối cùng (`7bb9477`). Phân tích `SRS-Login` → `docs/reqs/REQ-Analysis-Login-Module.md` | Sau mốc này **mọi thứ chưa commit** |
| 14-09-2026 | `/discover-system` Mode UI (23 module, TC prefix `CRM_`) → `/generate-requirements-from-website LOGIN` (45 REQ) | User chốt: môi trường dùng chung, được submit |
| 15 → 18-09-2026 | Chốt AMB-01→24 của LOGIN; lập Master Test Plan `release_1.0`; convert mẫu plan sang HTML/PDF | Xem [[login-quyet-dinh-da-chot]] · [[master-test-plan]] |
| 21-09-2026 | Sinh TC LOGIN lần 1 (GỘP): 60 TC · 101 biến thể, 4 vòng, 13 cột | || 23-09-2026 | `/review-testcases` REVIEW → luật phạm vi review; chạy TC 001–010; 2 bug report | Xem [[review-testcases]] · [[thuc-thi-va-bug]] |
| 28-09-2026 | Vòng lặp dạy học: ticket `CRM-LOGIN-101` (khoá tài khoản) → update REQ → update TC → sinh TC 061–068 → execute | Xem [[login-quyet-dinh-da-chot]] |
| 02-10-2026 | Đổi skill: **bảng TC đúng 10 cột** + **chỉ 2 vòng V1/V2**; thêm quy tắc Slack. User xoá TC cũ, execution, bug → sinh lại **45 TC · 84 biến thể** | Xem [[quy-tac-viet-tc]] |
| 07-10-2026 | User **chủ động lấy bộ skills mới** (`.claude/` + `CLAUDE.md` từ toolkit, mtime 20:16) → quy tắc TC quay về **13 cột / 4 vòng**; bỏ hẳn bản sửa 10 cột / 2 vòng ngày 02-10. Gom bộ nhớ vào `memories/` | Phiên này |

## Hiện trạng cần biết (kiểm 07-10-2026)
**Bộ skills hiện tại là nguồn sự thật** (user xác nhận 07-10-2026: *"TCs đang quy tắc là 13 cột và chạy qua 4 vòng"*). Chỗ còn lệch:

| Chỗ | Quy tắc hiện hành (skill) | Tài liệu cũ còn sót (`docs/testcases/login/`, sinh 02-10-2026) |
|---|---|---|
| Cột bảng TC | **13 cột** (`… Priority \| Automation \| Auto Type \| Tags`) | ✅ LOGIN đã chuyển 07-10-2026 |
| Khung vòng | **4 vòng** V1→V4 | ✅ LOGIN có V3 `046`→`051`, V4 `052`→`055` |
| Đánh dấu Deprecated/KnownBug | tag ở cột `Tags` + tiền tố trong `Test Scenario` | chỉ tiền tố trong ô |
| Slack | Đã thêm lại vào `CLAUDE.md` 07-10-2026: kênh `#project-book`, sau khi chạy TC xong / có summary report mới — xem [[ban-giao-va-bao-cao]] | — |

**How to apply:** sinh/sửa TC theo skill (13 cột / 4 vòng). Bộ TC LOGIN cũ là nợ định dạng — xử lý theo [[quy-tac-viet-tc]] mục 4, không khôi phục quy tắc 10 cột / 2 vòng.

## Nguồn của `docs/`
- `docs/requirements/customers/`, `projects/`, `_book-api/`, `docs/testcases/customers/`, `_book-api/`, `docs/user-guides/` có ngày tạo **14-08 → 19-09-2026 — sớm hơn** lần recon của repo này → được **chép từ repo toolkit** `D:\ANHTESTER\ClaudeCode\claude-testing-skills`, không phải sinh tại đây.
- Vì vậy danh mục dùng prefix Khách hàng **`CUST`**, dù ngày 14-09-2026 user từng yêu cầu `CUS` trong lần `/discover-system` của repo này (Master Test Plan `release_1.0` cũng ghi `CUS`). **Theo `docs/requirements/README.md` hiện tại** — lệch thì hỏi user, không tự đổi hàng loạt.
- Repo chứa **2 hệ thống**: Perfex CRM (mặc định) và Book API (`_book-api/`) — xem [systems/](../systems/).

Liên quan: [[bo-skills-claude]] · [[crm-perfex]]
