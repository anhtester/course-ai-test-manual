---
name: book-anhtester
description: Hệ thống thứ hai trong repo — Book Management API + app Android (namespace docs/**/_book-api/, mã BK)
type: project
nguon: docs/requirements/_book-api/README.md · bộ nhớ claude-testing-skills (appium-mcp-desktop-config) · course-ai-test-automation (project-book-anhtester-env)
cap-nhat: 07-10-2026
---

# Book API — `book.anhtester.com` (namespace `_book-api/`)

Tài liệu nằm ở `docs/requirements/_book-api/` và `docs/testcases/_book-api/` — **chép từ repo toolkit**, chưa từng làm tại repo này. Đọc `docs/requirements/_book-api/README.md` trước khi làm gì với hệ thống này.

## Đã chốt (KHÔNG hỏi lại)
| Mục | Giá trị |
|---|---|
| Mã hệ thống | `BK` → REQ `REQ-BK-<MODULE>-<nn>` · TC `BK_<MODULE>_TC_<3 số>` (repo automation từng dùng `BOOK_` — bản cũ) |
| Mặt | REST API (OpenAPI, Scalar UI ở `/swagger`, spec `/swagger/json`, Bearer JWT) + app **Android Hybrid** (Capacitor). Web ngoài phạm vi, iOS chưa khảo sát |
| Môi trường | Production 1 server. User cho phép thao tác phá huỷ, **nhưng chỉ trên bản ghi do chính phiên tạo** — test BOLA/IDOR phải tự tạo 2 tài khoản |
| Năng lực QA | Gọi API ✅ · CSDL ❌ (*"Không cho QA đụng Database"*, 20-09-2026) |
| Tài khoản | `.env` của repo này **chưa có** biến cho Book — cần hỏi user khi làm |

## Mobile / Appium
- `appium-mcp` khai ở config **global** Claude Desktop (`%APPDATA%\Claude\claude_desktop_config.json`), env `ANDROID_HOME` + `CAPABILITIES_CONFIG` trỏ `capabilities.json` của repo toolkit. Đổi env phải **thoát hẳn** app.
- Package: README ghi `book.anhtester.com`; repo automation phát hiện package thật là `com.anhtester.book/.MainActivity` — **kiểm lại** trên thiết bị.
- APK đang cài trên `emulator-5554` chỉ có context `NATIVE_APP` (không có WebView debugging) → toast không nằm trong cây accessibility.
- `appium_screenshot` (appium-mcp 1.94.0) lỗi `structuredContent` → chụp bằng `adb -s emulator-5554 exec-out screencap -p`.

Liên quan: [[ho-so-va-giao-tiep]] · [[khao-sat-va-evidence]]
