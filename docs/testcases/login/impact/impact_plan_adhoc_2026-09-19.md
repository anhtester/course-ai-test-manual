# Kế hoạch cập nhật Test Cases — `adhoc_2026-09-19` · module `LOGIN`

| Mục | Giá trị |
|---|---|
| Mã delta | `adhoc_2026-09-19` — không có ticket, nguồn là quyết định PO trả lời qua chat |
| Ngày lập | 19-09-2026 |
| Mode | PLAN → **đã duyệt 19-09-2026, đã APPLY** — kết quả: [delta_tc_adhoc_2026-09-19.md](delta_tc_adhoc_2026-09-19.md) |
| Nguồn thay đổi | [REQUIREMENTS_LOGIN_SUMMARY.md](../../../requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md) — mục 13 *Nhật ký Thay đổi*, 2 dòng ngày 19-09-2026 |
| Bộ TC hiện hành | [TEST_CASES_LOGIN_SUMMARY.md](../TEST_CASES_LOGIN_SUMMARY.md) — 50 TC · 70 biến thể · độ hạt **GỘP** · chưa có tầng nền tảng |
| Automation | Chưa có script nào trỏ vào bộ TC → **không** có việc cho `/update-automation-from-impact` |

---

## 1. REQ đã đổi

| REQ | Loại | Trước 19-09-2026 | Sau 19-09-2026 |
|---|---|---|---|
| `REQ-LOGIN-42` | 🟡 Sửa | Phiên sống 1 giờ. **Chưa rõ** 1 giờ tính theo thời gian không hoạt động hay tính từ lúc đăng nhập (`AMB-LOGIN-19` ❓) → TC gắn `assumption-based` | Phiên sống 1 giờ **tính theo thời gian không hoạt động — mỗi thao tác gia hạn lại** (`AMB-LOGIN-19` ✅).<br>**AC1:** không thao tác gì quá 1 giờ → mở URL trong `/admin` bị đưa về `/admin/authentication`<br>**AC2:** đang dùng liên tục (mỗi lần cách nhau dưới 1 giờ) thì **không** bị đăng xuất, kể cả khi tổng thời gian từ lúc đăng nhập đã quá 1 giờ |
| — | Sửa ghi chép | `RISK-LOGIN-05` · `STORY-LOGIN-05` ghi `AMB-LOGIN-03` **vẫn treo 🔴** | Đồng bộ lại: `AMB-LOGIN-03` ⏭️, `RISK-LOGIN-05` chấp nhận hoàn toàn. **Không đổi REQ nào** |

## 2. Ánh xạ REQ → TC

### ✅ Mapping chắc chắn (cột `REQ ID` + Bảng Đối Soát Coverage)

| REQ | TC | Vị trí | Cách map |
|---|---|---|---|
| `REQ-LOGIN-42` | `CRM_LOGIN_TC_026` | `TEST_CASES_LOGIN_SUMMARY.md:107` (Nhóm D) | Cột `REQ ID` · dòng Coverage `:254` |
| `REQ-LOGIN-28` (liên quan `RISK-LOGIN-05`) | `CRM_LOGIN_TC_031` | `TEST_CASES_LOGIN_SUMMARY.md:119` (Nhóm E) | Cột `REQ ID` — **đã** kỳ vọng HTTP 500, khớp quyết định `AMB-LOGIN-03` ⏭️ → **không sửa** |

### ⚠️ Mapping suy luận

Không có.

### ❓ REQ chưa có TC

Không có. AC2 của `REQ-LOGIN-42` là **vế mới trong REQ 🟡**, xử lý bằng TC mới cấp tiếp dải (mục 3) — không phải REQ 🟢 mới.

## 3. Kế hoạch sửa từng TC

| # | Vị trí | TC ID | Vòng · Nhánh | Hành động | Sửa ô nào | Mở evidence? |
|---|---|---|---|---|---|---|
| 1 | `:107` | `CRM_LOGIN_TC_026` | V3 · Security (hết phiên) | ✏️ Sửa | **Expected Result:** bỏ đoạn "⚠️ Dựa trên giả định… `AMB-LOGIN-19` còn treo… cần TC bổ sung". Thay bằng một câu trỏ sang `TC_051` cho vế gia hạn.<br>**Tags:** bỏ `@AssumptionBased`.<br>**Steps · Test Data · Pre-Condition:** giữ nguyên — cách chạy "để yên 65 phút" đúng với AC1 | Không — không đụng nhãn, bố cục, mặc định hay định dạng hiển thị |
| 2 | Cuối Nhóm D (ngay sau `TC_026`) | **`CRM_LOGIN_TC_051`** (mới) | V3 · Security (hết phiên) | ➕ Mới — trong REQ 🟡 | TC mới cho **AC2**. Nháp ở mục 3.1 | Không |
| 3 | `:199` | `ASM-01` | — | ✏️ Sửa | Đánh dấu ✅ **đã giải quyết 19-09-2026** — giả định trùng quyết định PO. **Giữ dòng**, không xoá, để lần chạy trước (`run_1787215085`) vẫn truy được | Không |
| 4 | `:254` | Coverage `REQ-LOGIN-42` | — | ✏️ Sửa | `1 · TC_026 · ✅ (giới hạn bởi AMB-LOGIN-19)` → `2 · TC_026, TC_051 · ✅ (AC1 hết hạn khi để yên · AC2 gia hạn khi thao tác)` | — |

### 3.1. Nháp `CRM_LOGIN_TC_051`

| Cột | Nội dung |
|---|---|
| REQ ID | `REQ-LOGIN-42` |
| Risk Level · Priority | High · High |
| Test Scenario | Đang thao tác thì phiên được gia hạn — không bị đăng xuất dù đã quá 1 giờ kể từ lúc đăng nhập |
| Pre-Condition | Trình duyệt sạch, chưa đăng nhập. **TC chạy mất khoảng 70 phút** — không xếp vào bộ smoke |
| Test Steps | 1. Đăng nhập bằng `admin@example.com` + `ADMIN_PASSWORD` trong `.env`, xác nhận đang ở Dashboard. Ghi lại thời điểm đăng nhập là **T0**<br>2. Tại khoảng **T0 + 30 phút**: bấm mục `Customers` trên menu trái<br>3. Tại khoảng **T0 + 55 phút**: bấm mục `Dashboard` trên menu trái<br>4. Để yên tới **T0 + 70 phút** — lúc này đã quá 1 giờ kể từ khi đăng nhập, nhưng mới 15 phút kể từ lần thao tác cuối<br>5. Gõ thẳng `https://crm.anhtester.com/admin/clients` vào thanh địa chỉ<br>6. Đọc URL và quan sát nội dung trang |
| Test Data | Email: `admin@example.com` · Password: `ADMIN_PASSWORD` trong `.env`<br>Mốc thời gian: thao tác ở T0+30 và T0+55 · kiểm ở T0+70 — mỗi khoảng nghỉ đều **dưới 1 giờ** |
| Expected Result | 1. Đăng nhập thành công, vào Dashboard<br>2–3. Mỗi lần bấm menu đều mở đúng trang, **không** bị đưa về trang đăng nhập<br>5–6. Vẫn ở `https://crm.anhtester.com/admin/clients`, thấy danh sách khách hàng — **không** bị đưa về `/admin/authentication`, **không** phải đăng nhập lại |
| Automation · Auto Type | ~~Partial · UI~~ → **No · N/A** — user duyệt 19-09-2026: QA tự chạy và theo dõi |
| Tags | `@Regression` · `@Slow` · `@PersonalOnly` · `@Login` |

> **Vì sao là TC mới, không phải biến thể `b` của `TC_026`:** hai vế cho **khác loại phản hồi** (một bên bị đăng xuất, một bên vẫn giữ phiên) và **khác chuỗi thao tác** (để yên với thao tác định kỳ). Đây là trường hợp **CẤM gộp** của độ hạt GỘP. Bộ TC vẫn giữ độ hạt GỘP.
>
> **Vì sao `TC_026` vẫn đo đúng thứ cần đo:** hai TC bù nhau. `TC_026` không phân biệt được hai cách tính (để yên thì cả hai cách đều hết phiên), còn `TC_051` bác bỏ được cách "tính từ lúc đăng nhập": nếu hệ thống tính theo cách đó thì bước 5 sẽ bị đăng xuất → **FAIL**.

## 4. Nhánh 4 vòng bị chạm

```
Nhánh bị chạm:     V3 · Security — thêm TC_051 (8 TC → 9 TC)
Nhánh KHÔNG đụng:  toàn bộ V1 (không đổi nhãn/bố cục/mặc định/định dạng), V2, V4, và các nhánh V3 còn lại — giữ nguyên
```

Các bảng kèm theo cần cập nhật cho khớp số (không chấm lại):

| Chỗ | Thay đổi |
|---|---|
| Tiêu đề file + dòng *Dải TC ID* + *Mã kế tiếp* | 50 → **51 TC** · dải `001 → 051` · mã kế tiếp `052` |
| Bảng Đối soát loại kiểm thử — dòng tổng | `50 TC · 70 biến thể` → **`51 TC · 71 biến thể`** |
| Rà soát ISO/IEC 25010 — dòng **Reliability** | Thêm `TC_051` |
| Bộ chạy đề xuất — `@Slow` | `TC_026` → `TC_026, TC_051` · 2 TC · ~65 + ~70 phút. Regression đầy đủ **giữ nguyên 49** vì TC mới cũng là `@Slow` |

## 5. Tác động lan toả

| Câu hỏi | Kết luận |
|---|---|
| Có đụng thứ nhìn thấy được trên màn hình (V1)? | **Không** — chỉ đổi quy tắc tính thời gian phiên |
| TC khác dùng phiên dài ở bước phụ? | Không — mọi TC khác đều chạy xong dưới 1 giờ sau khi đăng nhập |
| TC nào lấy `TC_026` làm precondition? | Không |
| Bảng 15 loại field? | Không áp dụng — không thêm/đổi field |
| Vượt ngưỡng tách? | 51 TC **> 50** (ngưỡng GỘP) → **phải tách `parts/`** — xem mục 6 |
| Execution cũ `run_1787215085` | `TC_026` bị SKIPPED ở lần chạy đó, `TC_051` chưa từng chạy → **lần chạy tới phải chạy cả hai** |
| Bug đang mở | Không bug nào liên quan phiên đăng nhập |

## 6. Thay đổi cấu trúc bắt buộc đi kèm

Đây là **lần DELTA đầu tiên** chạm vào `LOGIN` kể từ khi quy tắc **tầng nền tảng** ra đời. Theo skill `skills-rbt-manual-testing` (*Quy Tắc Xuất File* mục 2), phải chuyển bộ TC sang tầng nền tảng **một lần**, ngay trong lượt này:

| Việc | Chi tiết |
|---|---|
| Sao lưu | ~~Chép vào `archive/`~~ → **bỏ** theo quyết định user 19-09-2026: ghi **mốc git** `05efd17`, thư mục `archive/` đã xoá |
| Chuyển TC ra file nền tảng | ~~Tách 2 part~~ → **1 file** `web/test_cases_login_web.md` (51 TC) theo quyết định user 19-09-2026 |
| Index `TEST_CASES_LOGIN_SUMMARY.md` | **Giữ tên và vị trí.** Bỏ dòng TC, thêm `## Bản đồ tài liệu`. Giữ ở index: *Cách đọc* · *Assumptions* · *Bảng Đối Soát Coverage* · *Bảng Đối Soát Evidence* · *Đối soát 4 vòng* · *ISO 25010* · *Bộ chạy đề xuất* · *Nhật ký* |
| TC ID | **Giữ nguyên toàn bộ** `001` → `050`. Chỉ thêm `051` |
| Link từ nơi khác | 6 bug, execution report, test plan và báo cáo tiến độ đều trỏ vào **tên index** (không trỏ anchor) → **không gãy**, không phải sửa |
| Danh mục `docs/testcases/README.md` | Số TC 50 → 51 · dải `001 → 051` · mã kế tiếp `052` · thêm cột Nền tảng `Web 51` · ngày 19-09-2026 · 1 dòng nhật ký |

> ⚠️ Nếu **không** muốn chuyển cấu trúc trong lượt này, lựa chọn thay thế là chỉ sửa tại chỗ trong `TEST_CASES_LOGIN_SUMMARY.md`. Nhưng file sẽ **vượt ngưỡng 50 TC** mà không tách, trái quy tắc. Khuyến nghị: **chuyển luôn**.

## 7. Ngoài phạm vi

| Việc | Command |
|---|---|
| Chạy `TC_026` và `TC_051` (khoảng 70 phút, có thể mở 2 cửa sổ riêng chạy song song) | `/execute-test-cases` |
| Khớp lại ma trận truy vết | `/generate-traceability-matrix` |
| Automation | Không có — module chưa có script |

## 8. Cần duyệt

1. Nháp `CRM_LOGIN_TC_051` ở mục 3.1 — đặc biệt mốc thời gian T0+30 / T0+55 / T0+70
2. **Chuyển cấu trúc sang `web/` + tách 2 part** ở mục 6
3. Không có TC nào bị 🗑️ Deprecated · không có mapping ⚠️ suy luận

## 9. Kết quả duyệt (19-09-2026)

| Điểm | Quyết định user |
|---|---|
| Mốc thời gian `TC_051` | ✅ Giữ T0+30 / T0+55 / T0+70 |
| `TC_026` · `TC_051` | **Không làm automation, không chạy qua `/execute-test-cases`** — QA tự chạy và theo dõi → `Automation = No` (không automation) + `@PersonalOnly` (`/execute-test-cases` bỏ qua) |
| Tầng nền tảng | ✅ Chuyển sang `web/`, **để 1 file** (không tách `parts/`) |
| `archive/` | Bỏ hẳn — bản cũ tra bằng git |
