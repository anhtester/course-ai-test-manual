# Traceability Viewer

Trang web nhỏ gọn để **xem ma trận truy vết (RTM)** — độ phủ REQ theo module và Story, TC chưa automate, gap, việc cần làm, xuất Excel.

Dùng để đọc output của `/generate-traceability-matrix` (`docs/traceability/`).

---

## Dùng ngay (không cần cài gì)

Mở [`bundle.html`](bundle.html) bằng trình duyệt — double-click là được. Không cần build, không cần `node_modules`, chạy offline.

Cách nhanh nhất: kéo thả **nguyên thư mục `docs/traceability/`** — nạp được file chung lẫn mọi file module cùng lúc:

```
docs/traceability/traceability_matrix.md                      ← FILE CHUNG — độ phủ theo module, ⬛ ngoài tầm nhìn, việc cần làm, Bản đồ tài liệu
docs/traceability/login/traceability_matrix_login.md           ← chi tiết từng module — ma trận theo Story, TC chưa automate, gap
docs/traceability/customers/traceability_matrix_customers.md
```

Hai nút **+ Import thư mục** / **+ Import file .md** luôn hiện — bấm thêm lúc nào cũng được, dữ liệu cộng dồn. File không phải RTM (tiêu đề / tên file không chứa `Ma trận truy vết` · `traceability` · `RTM`) bị bỏ qua.

> Toàn bộ xử lý chạy trong trình duyệt, không gửi dữ liệu đi đâu. File đã nạp lưu vào `localStorage` nên lần mở sau vẫn còn.

---

## Nạp file chung so với chỉ nạp file module

| | Chỉ file module | Thêm file chung |
|---|---|---|
| Ma trận REQ, trạng thái, TC chưa automate, gap của module đó | ✅ | ✅ |
| ⬛ **Ngoài tầm nhìn** — module chưa khảo sát, module có REQ mà chưa có TC | ❌ — trang cảnh báo *"Chưa nạp file chung"* | ✅ đặt **trên cùng**, trước mọi con số |
| Việc cần làm gộp mọi module | Gộp từ từng file module | ✅ lấy từ file chung |
| Phát hiện file module **lệch ngày** với Bản đồ tài liệu | — | ✅ |
| Module chưa nạp file chi tiết | — | Hiện số từ bảng tổng của file chung, gắn nhãn *"chưa nạp file chi tiết"* |

---

## Chỉ số được TÍNH LẠI, không tin bảng tổng

Trạng thái mỗi REQ suy từ **dữ liệu của dòng ma trận**, không đọc cột `Trạng thái` ghi trong file — thứ tự giống hệt bảng *Trạng thái của một REQ* trong skill `skills-coverage-traceability`:

| Trạng thái | Điều kiện |
|---|---|
| ⏭️ **Loại trừ** | 0 TC, REQ có trong bảng *REQ loại trừ có chủ đích* (hoặc cột trạng thái ghi ⏭️) — **trừ khỏi mẫu số** |
| 🔴 **Chưa có TC** | 0 TC, 0 mục checklist |
| 🟠 **Chỉ có checklist** | 0 TC, có mục checklist |
| 🟡 **Thủ công** | Có TC, chưa có script |
| 🟣 **Automate một phần** | Có script nhưng chưa phủ hết TC — `customers.spec.ts (1/3)` |
| ✅ **Đã automate** | Mọi TC đều có script |

Trạng thái ghi trong file khác trạng thái suy ra → panel chi tiết hiện **cả hai** để thấy chỗ lệch.

**Hai chỉ số KHÔNG cộng được từ ma trận** — một TC phủ nhiều REQ sẽ bị đếm lặp ở từng dòng REQ:

| Chỉ số | Lấy từ |
|---|---|
| Pass rate lần chạy gần nhất | Dòng `Pass rate lần chạy gần nhất` ở bảng **Tổng quan** của file module |
| Automation Coverage | Số TC **duy nhất** trong ma trận − số dòng bảng **TC chưa automate**. RTM kiểu cũ không có bảng đó → tính theo liên kết REQ–TC |

Bảng tổng của file chung lệch với ma trận chi tiết → cảnh báo vàng, trang hiện số tính lại.

---

## Tính năng

| Nhóm | Chi tiết |
|---|---|
| **Cảnh báo** | ⬛ ngoài tầm nhìn (đỏ, trên cùng) · chưa nạp file chung · file module có trong Bản đồ mà chưa nạp · file module lệch ngày với Bản đồ · bảng tổng lệch ma trận · REQ ⏭️ loại trừ · RTM kiểu cũ |
| **Thống kê** | Requirement Coverage · Automation Coverage · Pass rate gần nhất (kèm số TC chưa chạy) · 🔴 · 🟠 · ⏭️ |
| **Thẻ module** | Thanh tiến độ REQ có TC / Automation / Pass, dải màu phân bổ 6 trạng thái. **Bấm thẻ để lọc** mọi tab theo module đó, bấm lại để bỏ lọc |
| **Ma trận REQ** | Nhóm theo Module · Story (dòng nhóm có thanh tiến độ riêng) · lọc trạng thái (chip có số đếm) · lọc Story · tìm toàn văn · bấm header để sort (bấm 3 lần về nhóm theo Story) · **cột không có dữ liệu tự ẩn** · bấm dòng mở panel chi tiết |
| **TC chưa automate** | Bảng Priority × Automation dự kiến · lọc Priority · tìm kiếm |
| **Gap & kiểm tra** | ⬛ ngoài tầm nhìn · bảng đếm mọi hạng mục · chi tiết 🔴 · 🟠 · ⏭️ (lý do + căn cứ) · ⚪ orphan · 🧩 TC trỏ REQ không tồn tại · 🗑️ script trỏ TC Deprecated · ⚠️ mapping suy luận |
| **Việc cần làm** | Từ file chung (hoặc gộp từ file module) — kèm command |
| **Export** | **CSV** = bảng của tab đang mở, sau lọc · **Excel** nhiều sheet: `Ma trận REQ` (ô trạng thái tô màu) · `Theo module` · `TC chưa automate` · `Gap & kiểm tra` · `Ngoài tầm nhìn` |

---

## Định dạng Markdown được hỗ trợ

Parser **không phụ thuộc số thứ tự mục** — nhận diện bảng theo **tên cột**. Hợp đồng đầy đủ ở skill `skills-coverage-traceability` (mục *RTM Template*). Đổi tên cột ở đó thì phải sửa parser ở đây.

| Loại bảng | Nhận diện bằng | Lấy ra |
|---|---|---|
| Header | bảng 2 cột, cột đầu `Thông tin` | Ngày sinh · Mốc git · Phạm vi · Nguồn đã quét |
| **Ma trận chi tiết** | cột `REQ ID` **và** `TC IDs` | Story = heading `###` ngay trên bảng · Yêu cầu · TC (tách theo `,`) · Automation `file (n/m)` · Checklist · Kết quả `✅ n · ❌ n 🐞 · 🚫 n · ⏩ n` · Trạng thái ghi tay |
| Tổng quan | cột `Chỉ số` + `Giá trị` | chỉ dòng *Pass rate* |
| ⏭️ REQ loại trừ | `REQ ID` + `Lý do` | lý do · căn cứ |
| 🔴 REQ chưa có TC | `REQ ID` + `Đề xuất` | đề xuất |
| 🟠 REQ chỉ có checklist | `REQ ID` + `Mục checklist` | mục checklist |
| 🟡 TC chưa automate | `TC ID` + `Priority` | Priority · Automation dự kiến · Ghi chú |
| 🧩 TC trỏ REQ không tồn tại | `TC ID` + `REQ ghi trong TC` | — |
| 🗑️ Script trỏ TC Deprecated | `Test` + `TC Deprecated` | — |
| ⚪ Orphan test | `Test` + `File` | — |
| ⚠️ Mapping suy luận | `Căn cứ suy luận` | — |
| ⬛ Ngoài tầm nhìn *(file chung)* | `Nhóm` + `Module` | nhóm · số module · danh sách · ý nghĩa |
| Độ phủ theo module *(file chung)* | `Module` + `Requirement Coverage` | mã module trong backtick · `n/m` |
| Việc cần làm *(file chung)* | `Module` + `Việc` | việc · số lượng · command |
| Bản đồ tài liệu *(file chung)* | `Module` + `File RTM` + `Ngày sinh` | link file module · ngày sinh · mốc git |

Module của từng dòng lấy từ **REQ ID** (`REQ-LOGIN-01` → `LOGIN`), nên RTM kiểu cũ một file phẳng chứa nhiều module vẫn tách đúng. File được coi là **file chung** khi có bảng *Độ phủ theo module* / *Bản đồ tài liệu*, hoặc tiêu đề chứa `Tổng hợp`.

**RTM kiểu cũ** (cột `Mô tả ngắn`, trạng thái `Manual only` / `NOT COVERED`, bảng ⬛ một dòng một module) vẫn đọc được — gắn nhãn **KIỂU CŨ** ở sidebar, không có Story / kết quả chạy / REQ loại trừ.

---

## Vì sao là 1 file HTML thuần

Cùng lý do với `execution-viewer` và `bugs-viewer`: phải mở được bằng `file://` trên máy bất kỳ, không cần cài gì. File `.xlsx` dựng thủ công bằng zip + Office Open XML (không dùng SheetJS ~900 KB). Code chia khối `PARSER` · `STATE` · `DERIVED` · `RENDER` · `EXPORT`; màu thương hiệu ở biến CSS `--brand`.
