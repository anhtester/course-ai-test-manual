# Impact Report — DEMO-AMB-2509 · 25-09-2026 · Module `USER`

> **Nguồn thay đổi:** quyết định **giả lập** chốt toàn bộ Ambiguity còn treo — user yêu cầu để làm **dữ liệu dạy học demo**. Requirements: [../REQUIREMENTS_USER_SUMMARY.md](../REQUIREMENTS_USER_SUMMARY.md) · Web: [../web/requirements_user_web.md](../web/requirements_user_web.md)

## Tóm tắt

| Nhóm | Số lượng | REQ |
|---|---|---|
| 🟢 Thêm mới | 0 | — |
| 🟡 Sửa | 0 | — |
| 🔴 Bỏ | 0 | — |
| ⏸️ Trùng, không tác động | 42 | `REQ-BK-USER-01` → `42` — cả 7 AMB chốt **trùng** Assumption tạm |

## Test case cần xử lý

| TC ID | REQ liên quan | Hành động | Lý do |
|---|---|---|---|
| — | REQ-BK-USER-01 → 42 | ➕ Viết mới | Module **chưa có TC** — sinh bằng `/generate-testcases-from-requirements` (Web) |
| — | REQ-19 → 23 (Story 03) | ℹ️ Bỏ nhãn `assumption-based` | `AMB-BK-USER-01` · `AMB-BK-01` chốt: không có vai trò — TC viết theo hiện trạng là hành vi **đúng** |

## Ambiguity

| Mã | Chuyển trạng thái | Ghi chú |
|---|---|---|
| AMB-BK-USER-01 | ❓ → ✅ | Không có vai trò quản trị — sửa/xoá người khác là thiết kế. Ma trận phân quyền: cột *Vai trò khác* → không áp dụng |
| AMB-BK-USER-02 | ❓ → ✅ | Web đúng (Password bắt buộc); F-07 là lỗi API |
| AMB-BK-USER-03 | ❓ → ✅ | Inactive không cắt phiên đang mở · không có trang chi tiết |
| AMB-BK-USER-04 · 06 · 07 | ❓ → ✅ | Cố ý / giữ hiện trạng |
| AMB-BK-USER-05 | ❓ → ✅ | Upload photo 3.0 MB · 7 định dạng — **để ngoài phạm vi** đợt kiểm thử web này |
| AMB-BK-01 · 02 · 12 (cấp hệ thống) | ❓ → ✅ | Không có vai trò · danh sách công khai là cố ý · lỗi điều hướng Android |

## Cảnh báo

- ℹ️ Không còn AMB nào treo ở module `USER`. Tải ảnh đại diện vẫn **ngoài phạm vi** TC (quyết định phạm vi, không phải điểm mờ).
