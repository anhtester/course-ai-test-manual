# Impact Report — DEMO-AMB-2509 · 25-09-2026 · Module `AUTH`

> **Nguồn thay đổi:** quyết định **giả lập** chốt toàn bộ Ambiguity còn treo — user yêu cầu để làm **dữ liệu dạy học demo**, không phải trả lời thật của PO. Requirements: [../REQUIREMENTS_AUTH_SUMMARY.md](../REQUIREMENTS_AUTH_SUMMARY.md) · Web: [../web/requirements_auth_web.md](../web/requirements_auth_web.md)
>
> Mắt xích kế tiếp: `/update-testcases-from-impact` (TC API / Mobile đã có) · `/generate-testcases-from-requirements` chế độ BỔ SUNG (TC Web — chưa có).

## Tóm tắt

| Nhóm | Số lượng | REQ |
|---|---|---|
| 🟢 Thêm mới | 2 | `REQ-BK-AUTH-120` (My Profile — email trùng · **chưa kiểm chứng**) · `REQ-BK-AUTH-121` (khoá + sai mật khẩu) |
| 🟡 Sửa | 1 | `REQ-BK-AUTH-97` — `redirect` phải giữ cả query string (hiện chưa đạt) |
| 🔴 Bỏ | 0 | — |
| ⏸️ Trùng, không tác động | — | Mọi REQ còn lại — AMB chốt trùng Assumption tạm, AC không đổi |
| ✏️ Biên tập | 5 | `REQ-22` · `83` · `88` · `91` · `99` — "chờ PO xác nhận" → "PO chốt" |

## Test case cần xử lý

| TC ID | REQ liên quan | Hành động | Lý do |
|---|---|---|---|
| BK_AUTH_TC_062 · 075 | REQ-05 · 17 | ⚠️ Review & sửa metadata | `AMB-BK-AUTH-03` chốt là **lỗi** → bỏ trạng thái ⚪ chờ / `⏸️ Hoãn`, gắn `@KnownBug` F-19. Expected không đổi |
| BK_AUTH_TC_098 · 099 · 102 · 103 · 104 | REQ-41 · 42 · 45 · 46 · 47 | ⚠️ Review — **giữ nguyên** | `AMB-BK-AUTH-21` thu hẹp F-16: lỗi chỉ khi body **thiếu khoá**. Các TC này gửi body một phần (`{"name":…}` · `{"password","password_old"}`) → vẫn là `@KnownBug` hợp lệ. Cập nhật ghi chú lỗi trong TC cho đúng phạm vi mới |
| Index TC — mục *TC treo* | — | 🗑️ Gỡ 5 dòng | `403` (`AMB-BK-01`: không có vai trò) · `406/413/415` (`AMB-BK-AUTH-20`: không yêu cầu) · `429` (`AMB-BK-08`: không có rate limit) · refresh/access token hết hạn (`AMB-BK-AUTH-10`: không kiểm trên production) · token dùng sau đăng xuất (`06` · `07`: thiết kế) |
| Index TC — mục *TC treo* | — | ➡️ Chuyển thành việc cần làm | Thiếu / sai `password_old` (`AMB-BK-AUTH-05`) · đổi email hồ sơ trùng (`AMB-BK-AUTH-12`) · mass assignment qua profile — đã có kết luận; cần sinh REQ mặt API bằng `/generate-requirements-from-api auth` rồi `/generate-testcases-api auth` |
| — | REQ-BK-AUTH-87 → 121 (Web) · 37 REQ dùng chung | ➕ Viết mới | Mặt **Web** chưa có TC nào — sinh ở chế độ BỔ SUNG, nối tiếp dải từ `BK_AUTH_TC_109` |
| Mobile TC_001 → 058 | REQ-49 → 86 | ⏸️ Không tác động | `AMB-BK-AUTH-14` → `19` chốt **trùng** Assumption — `ASM-BK-AUTH-05` (không có chính sách mật khẩu) khớp `AMB-BK-AUTH-08` |

## Ambiguity

| Mã | Chuyển trạng thái | Ghi chú |
|---|---|---|
| AMB-BK-AUTH-01 · 02 · 04 | ✅ (giữ) | Đã chốt 20-09-2026. `01` thêm ghi chú phạm vi thu hẹp theo `21` |
| AMB-BK-AUTH-03 · 05 · 06 · 07 · 08 · 09 · 10 · 13 → 20 · 22 · 23 · 24 · 28 → 32 | ❓ → ✅ | Trùng Assumption tạm — không đổi REQ |
| AMB-BK-AUTH-11 | ❓ → ✅ | Chỉ `403` ở login (tài khoản khoá) còn hiệu lực; status khác thừa từ mẫu spec |
| AMB-BK-AUTH-12 | ❓ → ✅ | Sinh `REQ-BK-AUTH-120` |
| AMB-BK-AUTH-21 | ❓ → ✅ | F-16 thu hẹp — body thiếu khoá mới lỗi |
| AMB-BK-AUTH-25 | ❓ → ✅ | Sửa `REQ-BK-AUTH-97` 🟡 |
| AMB-BK-AUTH-26 | ❓ → ✅ | **Khác** Assumption (chấp nhận thiết kế) → sinh `REQ-BK-AUTH-121` |
| AMB-BK-AUTH-27 | ❓ → ✅ | **Khác** Assumption (chấp nhận câu chung) — REQ-109 giữ nguyên |
| AMB-BK-01 · 08 · 10 · 11 (cấp hệ thống) | ❓ → ✅ | Không có vai trò · không rate limit · `config` = `{theme, mainColor}` · "Need help?" ngoài phạm vi |

## Cảnh báo

- ⚠️ `REQ-BK-AUTH-120` là **quyết định PO chưa kiểm chứng** — vị trí hiển thị thông báo chưa khảo sát. TC Web gắn `@NeedsVerify`; chạy lần đầu mà hệ thống **cho đổi** email trùng thì đó là bug, không phải TC sai.
- ⚠️ 4 REQ Web ghi hành vi **kỳ vọng** chưa đạt: `97` · `114` · `115` · `118` — TC `@KnownBug`.
- ℹ️ Không còn AMB nào treo ở module `AUTH`.
