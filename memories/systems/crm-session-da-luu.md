---
name: crm-session-da-luu
description: Session/cookie Admin và PM đã lưu ở .auth/ để agent chạy test không cần user đăng nhập lại — cách dùng, luật không Logout, hành vi nhiều phiên đã đo trên crm.anhtester.com
type: project
nguon: phiên 09-10-2026 (chạy checklist smoke Login, thử session)
cap-nhat: 09-10-2026
---

# Session đã lưu — `crm.anhtester.com`

## Vì sao có
Agent **không tự gõ mật khẩu** vào crm.anhtester.com ([[crm-perfex]]). User đăng nhập **một lần**, agent lưu session bằng `context.storageState` rồi nạp lại ở các lần chạy sau — user không phải nhập lại.

## File (thư mục `.auth/`, đã `.gitignore`, **không commit, không ghi giá trị cookie vào docs/chat**)
| File | Là gì | Trạng thái (09-10-2026) |
|---|---|---|
| `.auth/admin_1.json` | Phiên Admin **giữ riêng** — không bao giờ Logout | Còn sống (kiểm 2 lần) |
| `.auth/admin_2.json` | Phiên Admin dùng thử để đăng xuất | **Đã chết** — có thể xoá |
| `.auth/admin.json` | Phiên cũ | **Đã chết** (bị Logout ở mục 13 và khi thử nhiều cửa sổ) |
| `.auth/pm.json` | Phiên Project Manager | **Chưa kiểm lại** — nhiều khả năng đã chết, kiểm trước khi dùng |

## Cách dùng lại
Playwright MCP: `browser.newContext({ storageState: '<đường dẫn file>' })` rồi `newPage()` → vào `/admin/`. Dùng cửa sổ (context) riêng, **không** thay cookie của cửa sổ chính khi user đang dùng. Trong `browser_run_code_unsafe` không có `require` / `import` — chỉ có `storageState` là đọc file được.

## Luật
- 🚫 **Không bấm `Logout`, không mở `/admin/authentication/logout`** bằng phiên `admin_1`. Logout huỷ phiên **phía máy chủ**, mọi bản sao session chết theo.
- Cần test Logout (checklist Smoke mục 13, 14 · `TC_035`, `TC_036`) → **xin user đăng nhập một phiên riêng** (tích `Remember me`), lưu file riêng, chỉ Logout trên phiên đó.
- Phiên hết hạn / bị đưa về trang đăng nhập → **báo user**, không tự xử lý.
- Phiên Admin dùng chung: kiểm huy hiệu bộ đếm giờ (`.icon-started-timers`) trước khi làm gì có thể chạm timer của người khác ([[crm-perfex]]).

## Hành vi đã đo (09-10-2026)
- **Nhiều cửa sổ nạp cùng một file** = cùng **một** phiên phía máy chủ. Logout ở một cửa sổ → mọi cửa sổ khác và file đó đều mất phiên.
- **Hai lần đăng nhập riêng = hai phiên độc lập.** Máy chủ cho nhiều phiên Admin song song; Logout phiên 2 **không** ảnh hưởng phiên 1 (kiểm cả bằng mở lại từ file).
- Tích `Remember me` mới có cookie `autologin` (~62 ngày). Không tích: phiên chỉ ~1 giờ không thao tác.
- Chưa đo hạn thật của `admin_1`.

## Cách lấy phiên mới (kịch bản gom một lèo)
User tự đăng nhập (tích `Remember me`) → nhắn "đã đăng nhập" → agent kiểm `user-id-2` (Admin) / `user-id-3` (PM) + có cookie `autologin` rồi `storageState` ra file → nếu cần phiên thứ hai: xoá cookie cửa sổ (**không** Logout), user đăng nhập lần nữa.

Liên quan: [[crm-perfex]] · [[thuc-thi-va-bug]] · [[ho-so-va-giao-tiep]]
