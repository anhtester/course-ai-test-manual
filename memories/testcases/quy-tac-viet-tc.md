---
name: quy-tac-viet-tc
description: Quy tắc viết manual TC user đã chốt — độ hạt GỘP, ngôn ngữ nhìn thấy được, format 13 cột + 4 vòng theo bộ skills mới (10 cột/2 vòng đã bỏ)
type: feedback
nguon: lịch sử phiên repo này (21-09, 02-10, 07-10-2026) · bộ nhớ claude-testing-skills (prefer-consolidated-testcases, manual-tc-user-visible-language)
cap-nhat: 07-10-2026
---

# Quy tắc viết manual test case

## 1. Mặc định độ hạt GỘP
Biến thể cùng trường, cùng loại phản hồi gom vào **1 TC có Bảng biến thể** (`a`, `b`, `c`…, tối đa 6 biến thể/TC). Chỉ TÁCH khi user yêu cầu. Lệnh: `/generate-testcases-from-requirements <đường dẫn> [GỘP|TÁCH]`.
**Why:** user: *"Login thôi mà 82 TCs kinh thật"* — gộp còn 41 TC, cùng độ phủ.
**How to apply:** tôn trọng chỗ user cố ý gộp (VD TC gộp 2 màn hình / 2 cơ chế), không ép tách khi review.

## 2. Ngôn ngữ nhìn thấy được
Phần chính của TC viết bằng thứ tester **thấy trên màn hình** — cấm `document.title`, selector, `checkValidity()`, mã HTTP, tab Network. Thứ không nhìn thấy được (cookie, CSRF, header) tách xuống dòng `🔧 Ghi chú kỹ thuật (cần DevTools):`. Phép thử: che dòng 🔧 vẫn chấm được PASS/FAIL.
**Why:** user phản hồi bộ TC "chứa các phần validate thuộc tính HTML nhiều quá".

## 3. Format & khung vòng HIỆN HÀNH — theo bộ skills mới: 13 CỘT · 4 VÒNG (user chốt 07-10-2026)
User: *"Bộ skills tôi đã lấy mới rồi nên TCs đang quy tắc là 13 cột và chạy qua 4 vòng"*.
```
| TC ID | REQ ID | Module | Risk Level | Test Scenario | Pre-Condition | Test Steps | Test Data | Expected Result | Priority | Automation | Auto Type | Tags |
```
- Sinh tuần tự **V1 Smoke → V2 Functional → V3 Technical → V4 Non-functional**, độ sâu theo `Risk Level`; chi tiết luôn đọc từ `.claude/skills/skills-rbt-manual-testing/SKILL.md` (Bảng Output Standard, Bản Đồ 4 Vòng) — **skill là nguồn sự thật**, không chép lại ở đây.
- Tag (`@Deprecated`, `@KnownBug`, `@NeedsVerify`, `@TechCheck`, `@PersonalOnly`…) nằm ở cột `Tags`, theo đúng skill.

## 4. Lịch sử: từng đổi sang 10 cột / 2 vòng (02-10 → 07-10-2026) — ĐÃ BỎ
Ngày 02-10-2026 user cho sửa skill thành bảng đúng 10 cột (bỏ `Automation | Auto Type | Tags`, dấu hiệu chuyển thành tiền tố trong ô như `🗑️ Deprecated` · `🐞 KnownBug` · `⚠️ chưa có evidence`) và chỉ 2 vòng V1/V2. Ngày 07-10-2026 user lấy bộ skills mới và **chủ động quay về 13 cột / 4 vòng**. **Không** khôi phục quy tắc 10 cột / 2 vòng, không đề xuất lại.

> ✅ **Bộ TC LOGIN đã chuyển xong 07-10-2026** (user chọn "chuyển định dạng tại chỗ, giữ TC ID"): `001` → `045` thêm 3 cột, nội dung giữ nguyên; bổ sung V3 `046` → `051`, V4 `052` → `055` → **55 TC · 104 biến thể, 48/48 REQ**. Vẫn **1 file** dù vượt ngưỡng 50 (tiền lệ user 19-09-2026; phương án tách 3 part ghi sẵn ở Bản đồ tài liệu). Cách làm này là mẫu cho module khác còn định dạng cũ.

## 5. TC ID & sinh lại
- Mẫu `<HỆ_THỐNG>_<MODULE>_TC_<3 số>` (CRM: `CRM_LOGIN_TC_001`), biến thể `CRM_LOGIN_TC_012-c`. Bổ sung thì nối tiếp dải, không chèn giữa.
- Module đã có TC mà user gọi sinh lại → workflow từ chối (để giữ liên kết TC ID). **User tự xoá bộ cũ rồi bảo "sinh mới lại"** → sinh lại từ `001` là đúng ý user (đã làm 21-09 và 02-10-2026). Sau đó dọn tham chiếu tới execution/bug đã xoá trong index.
- Phải mở hết ảnh evidence trước khi viết dòng TC đầu tiên — xem [[khao-sat-va-evidence]].

Liên quan: [[review-testcases]] · [[login-quyet-dinh-da-chot]]
