# Delta TC List — `adhoc_2026-09-19` · module `LOGIN`

| Mục | Giá trị |
|---|---|
| Mã delta | `adhoc_2026-09-19` — không có ticket, quyết định PO trả lời qua chat (`AMB-LOGIN-19`) |
| Ngày áp | 19-09-2026 |
| Nguồn thay đổi | [REQUIREMENTS_LOGIN_SUMMARY.md](../../../requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md) — mục 13 *Nhật ký Thay đổi*, dòng 19-09-2026 |
| Kế hoạch đã duyệt | [impact_plan_adhoc_2026-09-19.md](impact_plan_adhoc_2026-09-19.md) |
| Mốc git trước khi sửa | web → `TEST_CASES_LOGIN_SUMMARY.md` @ `05efd17` — lúc đó TC còn nằm trong index, chưa có tầng nền tảng |
| Trạng thái | ✅ ĐÃ ĐỒNG BỘ |

## TC đã xử lý

| TC ID | Nền tảng | Vòng · Nhánh | Hành động đã làm | Đổi cái gì (cho automation) |
|---|---|---|---|---|
| CRM_LOGIN_TC_026 | web | V3 · Security | ✏️ Đã sửa | Gỡ `@AssumptionBased` và cảnh báo `AMB-LOGIN-19` còn treo. Steps · Expected giữ nguyên. **`Automation` Partial → No**, thêm `@PersonalOnly` → **không** viết script |
| CRM_LOGIN_TC_051 | web | V3 · Security | ➕ Mới (trong REQ 🟡) | Vế gia hạn phiên của `REQ-LOGIN-42`. **`Automation = No`**, `@PersonalOnly` → **không** viết script |

> Không có việc cho `/update-automation-from-impact`: module chưa có script, và cả 2 TC đều `Automation = No`. Tag `@PersonalOnly` đưa 2 TC ra khỏi `/execute-test-cases` — QA tự chạy và theo dõi (quyết định user 19-09-2026).

## Thay đổi cấu trúc đi kèm

| Việc | Kết quả |
|---|---|
| Tầng nền tảng | 51 TC chuyển nguyên văn sang [web/test_cases_login_web.md](../web/test_cases_login_web.md), 1 file (vượt ngưỡng 50 — quyết định user). Index [TEST_CASES_LOGIN_SUMMARY.md](../TEST_CASES_LOGIN_SUMMARY.md) giữ tên, thêm `## Bản đồ tài liệu` |
| TC ID | `001` → `050` giữ nguyên · thêm `051` · mã kế tiếp `052` |
| `archive/` | Đã xoá — bản cũ tra bằng `git show 05efd17:docs/testcases/login/TEST_CASES_LOGIN_SUMMARY.md` |

## Ngoài phạm vi

| Việc | Ai |
|---|---|
| Chạy `TC_026`, `TC_051` | QA tự chạy — ghi kết quả vào execution report thủ công |
| Khớp lại ma trận truy vết | `/generate-traceability-matrix` |

## Nhật ký

| Ngày | Thay đổi |
|---|---|
| 19-09-2026 | Áp lần đầu theo `impact_plan_adhoc_2026-09-19.md` đã duyệt |
