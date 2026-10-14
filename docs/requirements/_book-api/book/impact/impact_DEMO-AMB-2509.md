# Impact Report — DEMO-AMB-2509 · 25-09-2026 · Module `BOOK`

> **Nguồn thay đổi:** quyết định **giả lập** chốt toàn bộ Ambiguity còn treo — user yêu cầu để làm **dữ liệu dạy học demo**. Requirements: [../REQUIREMENTS_BOOK_SUMMARY.md](../REQUIREMENTS_BOOK_SUMMARY.md) · Web: [../web/requirements_book_web.md](../web/requirements_book_web.md)

## Tóm tắt

| Nhóm | Số lượng | REQ |
|---|---|---|
| 🟢 Thêm mới | 2 | `REQ-BK-BOOK-51` (giá bán không âm — kỳ vọng, **chưa đạt**) · `REQ-BK-BOOK-52` (danh mục tự gõ sinh danh mục mới — **chưa kiểm chứng**) |
| 🟡 Sửa | 2 | `REQ-BK-BOOK-03` (New = trong 7 ngày) · `REQ-BK-BOOK-34` (biên tên danh mục ≤ 24) |
| 🔴 Bỏ | 0 | — |
| ⏸️ Trùng, không tác động | 48 | Các REQ còn lại |

## Test case cần xử lý

| TC ID | REQ liên quan | Hành động | Lý do |
|---|---|---|---|
| — | REQ-BK-BOOK-01 → 52 | ➕ Viết mới | Module **chưa có TC** — sinh bằng `/generate-testcases-from-requirements` (Web) |
| — | REQ-17 · 48 · 51 | ➕ Viết mới — `@KnownBug` | PO chốt là **lỗi** (`AMB-BK-BOOK-02` · `08` · `01`) |
| — | REQ-03 (vế > 7 ngày) · 34 (biên 24/25) · 52 | ➕ Viết mới — `@NeedsVerify` | Quyết định PO chưa kiểm chứng trên hệ thống |

## Ambiguity

| Mã | Chuyển trạng thái | Ghi chú |
|---|---|---|
| AMB-BK-BOOK-01 | ❓ → ✅ | Lỗi — sinh `REQ-51` |
| AMB-BK-BOOK-02 · 08 | ❓ → ✅ | Lỗi — REQ-17 · 48 giữ kỳ vọng |
| AMB-BK-BOOK-03 | ❓ → ✅ | Sửa `REQ-03` 🟡 |
| AMB-BK-BOOK-06 | ❓ → ✅ | Sửa `REQ-34` 🟡 · sinh `REQ-52` |
| AMB-BK-BOOK-04 · 05 · 07 · 09 → 14 · 16 · 17 | ❓ → ✅ | Chấp nhận hiện trạng / lỗi câu chữ chấp nhận ở bản 1.0 — REQ không đổi |
| AMB-BK-BOOK-15 | ❓ → ✅ | Không có vai trò — sửa/xoá sách người khác là thiết kế |
| AMB-BK-01 · 02 · 03 (cấp hệ thống) | ❓ → ✅ | Không có vai trò · dữ liệu công khai cố ý · giá bán âm là lỗi |

## Cảnh báo

- ⚠️ `REQ-52` tạo **danh mục mới** trên production — TC phải dọn danh mục qua icon ⚙ (module `CAT`, chưa khảo sát). Chưa dọn được thì ghi *còn sót* vào execution report.
- ℹ️ Không còn AMB nào treo ở module `BOOK`.
