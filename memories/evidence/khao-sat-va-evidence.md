---
name: khao-sat-va-evidence
description: Khảo sát hệ thống & chụp evidence — mở hết ảnh trước khi sinh TC, chụp xong phải mở lại, chụp mức OS khi cần thanh URL, Playwright MCP có thể ghi ảnh lạc project
type: feedback
nguon: lịch sử phiên repo này · bộ nhớ claude-testing-skills (evidence-*, playwright-mcp-cwd-*) · ClaudeBuildMemoryProject
cap-nhat: 12-10-2026
---

# Khảo sát & evidence

## Phải đọc evidence trước khi sinh TC
Mở **từng ảnh** trong `docs/requirements/<module>/<nền-tảng>/evidence/` bằng Read trước khi viết dòng TC đầu tiên (02-10-2026 sinh lại LOGIN đã mở đủ 10/10 ảnh). Xung đột tài liệu ↔ ảnh → **ảnh thắng**, ghi ASM, báo user. Vùng không có ảnh → `⚠️ chưa có evidence` (hoặc `@NeedsVerify` theo skill hiện tại).
**Why:** 05-08-2026 sinh 152 TC Projects chỉ từ markdown → sai tab mặc định, bỏ sót 8 checkbox disabled, sai định dạng tiền — user phát hiện.

## Chụp xong phải mở lại ảnh
Thao tác mở dropdown/menu có thể thất bại âm thầm (ảnh "menu đang mở" nhưng menu còn đóng, tồn tại 4 ngày). 14-09-2026 ảnh menu avatar bị chụp lúc đang hiện dần → mờ, phải chụp lại. Dòng danh mục evidence sai nguy hiểm hơn không có ảnh.

## Phạm vi chụp
Đối tượng nằm trọn trong viewport → chụp viewport; form dài bị cắt → full-page. Đừng full-page màn hình nghiệp vụ kéo theo email/tên khách hàng.

## Cần thanh URL / ổ khoá / tooltip native → chụp mức cửa sổ OS
Screenshot Playwright không có browser chrome. Dùng PowerShell + `user32.dll`: tìm cửa sổ Chrome theo title → `ShowWindow($h,3)` → `GetWindowRect` → **`PrintWindow($h,$hdc,2)`**. **Không** dùng `SetForegroundWindow` + `CopyFromScreen` (chụp nhầm cửa sổ, bị cắt biên). Áp cho TC HTTPS, tooltip validation email.

## Playwright MCP — kiểm cwd & viewport trước khi chụp hàng loạt
- **Hiện trạng (12-10-2026, user chốt):** user **không dùng `.mcp.json` trong repo** — server `playwright` khai ở `%APPDATA%\Claude\claude_desktop_config.json`: `--viewport-size=1600,770 --config %APPDATA%\Claude\playwright-mcp-desktop-config.json` (file này chép từ `.claude/playwright-mcp-config.json`: `--test-type`, `--window-position=-3,0`). Đã thử `.mcp.json` trong ngày rồi xoá theo yêu cầu user. CLAUDE.md vẫn hướng dẫn dùng `.mcp.json` — lệch với hiện trạng cho tới khi user cho sửa.
- ⚠️ **Bẫy trùng tên server (tab Code của Claude Desktop):** nếu cả config Desktop lẫn `.mcp.json` cùng khai server tên `playwright`, tool `mcp__playwright__*` của phiên **gắn vào server Desktop** — server `.mcp.json` vẫn chạy nhưng không được dùng. Câu "`.mcp.json` đè config Desktop" trong CLAUDE.md **không đúng** ở tab Code.
- ⚠️ Server khai ở Desktop không chạy với cwd = repo → ảnh tên tương đối / `.playwright-mcp/` có thể **rơi sang repo khác** (đã gặp 14-08, 06-09-2026). Chụp evidence nên dùng **đường dẫn tuyệt đối** vào `docs/.../evidence/`, chụp xong `ls` kiểm.
- **How to apply:** đầu phiên cần Playwright → `browser_evaluate` đo `inner/outer/screenX,screenY`. Kỳ vọng `1600×770` · `-3,0` (theo config Desktop hiện tại, đo đúng 12-10-2026). Lệch → lần cây tiến trình (`Get-CimInstance Win32_Process`, xem Chrome `mcp-chrome-*` là con của server nào), **không** `browser_resize` vượt cửa sổ. Sửa config Desktop phải thoát hẳn Desktop app (cả khay hệ thống) mới có hiệu lực.

## Recon tầng khám phá
`/discover-system` chỉ đọc, không bấm Save/Delete; `_discovery/` không chứa mã REQ. Phiên đăng nhập có thể bị văng do người khác dùng chung tài khoản — đó là dấu hiệu môi trường dùng chung, không phải lỗi.

Liên quan: [[crm-perfex]] · [[quy-tac-viet-tc]]
