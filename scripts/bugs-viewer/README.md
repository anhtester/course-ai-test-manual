# Bug Report Viewer

Trang web nhỏ gọn để **xem và lọc bug report** — thống kê theo Severity/Priority/Trạng thái, xem evidence, xuất Excel.

Dùng để đọc output của `/create-bug-report` (`docs/bugs/<module>/<nền-tảng>/BUG_*.md`) và danh mục `docs/bugs/README.md`.

---

## Dùng ngay (không cần cài gì)

Mở [`bundle.html`](bundle.html) bằng trình duyệt — double-click là được. Không cần build, không cần `node_modules`, chạy offline.

Kéo thả, hoặc bấm **+ Import thư mục** / **+ Import file .md** ở góc trên (hai nút này luôn hiện, kể cả sau khi đã nạp dữ liệu — bấm thêm được bất cứ lúc nào, không phải nạp lại từ đầu):

```
docs/bugs/README.md              ← danh mục — cho cái nhìn tổng quan ngay cả khi chưa nạp từng bug
docs/bugs/login/web/BUG_*.md     ← từng file bug, theo nền tảng web · mobile · api — đầy đủ Steps/Expected/Actual/Evidence/Lịch sử retest
```

Cách nhanh nhất: kéo thả **nguyên thư mục `docs/bugs/`** — nạp được cả danh mục lẫn mọi file bug, cả module, cùng lúc.

> ⚠️ **Hộp thoại "+ Import thư mục" chỉ chọn được 1 thư mục mỗi lần** — đây là giới hạn của chính hộp thoại chọn thư mục hệ điều hành, không phải do trang giới hạn. Cần nạp cả `docs/bugs/` lẫn `docs/executions/` (để có ảnh evidence) thì bấm nút đó **2 lần**, mỗi lần 1 thư mục — dữ liệu cộng dồn chứ không ghi đè. Muốn chọn nhiều thư mục trong **1 lần** thì dùng kéo-thả: chọn nhiều thư mục cùng lúc trong Explorer (giữ Ctrl) rồi kéo cả cụm vào trang.

> Toàn bộ xử lý chạy trong trình duyệt, không gửi dữ liệu đi đâu. File đã import lưu vào `localStorage` nên lần mở sau vẫn còn (riêng ảnh evidence phải kéo lại — xem mục dưới).

---

## Nạp từng file bug so với chỉ nạp danh mục

| | Chỉ nạp `docs/bugs/README.md` | Nạp thêm từng `BUG_*.md` |
|---|---|---|
| Mã bug, Module, Severity, Priority, Trạng thái, TC liên quan, Ngày phát hiện | ✅ | ✅ |
| Steps to Reproduce, Expected/Actual, Evidence, Ghi chú thêm, Lịch sử retest đầy đủ | ❌ (dòng hiện *"chỉ có tóm tắt"*) | ✅ |

Nạp cả hai không bị trùng — bug đã có file chi tiết sẽ **ghi đè** dòng tóm tắt cùng mã, không tạo dòng thứ hai. Đây là lý do nên kéo thả nguyên thư mục `docs/bugs/` thay vì chỉ mỗi `README.md`.

---

## Trạng thái được TÍNH LẠI, không đọc nhãn có sẵn

Với file bug chi tiết, viewer tự suy ra trạng thái từ **dòng đầu tiên** (mới nhất, theo quy ước dự án "thêm dòng mới lên đầu") của bảng **Lịch sử retest** — không đọc một nhãn trạng thái cố định nào trong file (bug report không có field "Trạng thái" riêng, đúng theo template của `skills-bug-reporter`):

| Dòng mới nhất trong Lịch sử retest | Trạng thái suy ra |
|---|---|
| Bảng rỗng — chưa retest lần nào | 🔴 Đang mở |
| ✅ FIXED | 🟢 Đã đóng |
| ❌ NOT_FIXED | 🔴 Đang mở (mở lại) |
| 🟡 PARTIAL | 🟡 Một phần (PARTIAL) |
| ⚠️ CANNOT_VERIFY | ⚠️ Không verify được |

Riêng bug **chỉ có tóm tắt** (nạp từ danh mục, chưa có file chi tiết) thì dùng thẳng cột "Trạng thái" ghi trong danh mục, vì không có Lịch sử retest nào để tính lại.

---

## Tính năng

| Nhóm | Chi tiết |
|---|---|
| **Import** | Kéo thả, hoặc 2 nút cố định **+ Import thư mục** / **+ Import file .md** — luôn hiện, bấm thêm được bất cứ lúc nào · nạp nhiều lần để gộp nhiều module |
| **Thống kê** | Tổng bug · Đang mở · Chưa xong hẳn (PARTIAL/PENDING/CANNOT_VERIFY/NEEDS_REVIEW) · Đã đóng · Critical đang mở |
| **Cảnh báo tự động** | 4 loại — xem mục dưới |
| **Lọc** | Theo Trạng thái / Severity / Priority (chip) · theo Module · tìm toàn văn trên mã bug, tiêu đề, TC/REQ, Steps, Expected/Actual, ghi chú |
| **Sort** | Click header cột |
| **Chi tiết** | Click một dòng để mở panel: đầy đủ Thông tin chung, Steps, Expected/Actual, Evidence (bấm xem ảnh), Ghi chú thêm, và bảng Lịch sử retest đầy đủ |
| **Export** | **CSV** và **Excel (.xlsx)** — xuất đúng phần đang hiển thị sau lọc/tìm kiếm |
| **Xoá tất cả** | Nút **Xoá tất cả** cạnh **+ Import file .md** (chỉ hiện khi đã nạp ít nhất 1 file) — xoá hết report + ảnh evidence đã nạp (kể cả trong `localStorage`), quay về màn hình kéo thả trống để nạp bộ report khác từ đầu |

---

## 4 cảnh báo tự động

| Cảnh báo | Kích hoạt khi | Vì sao quan trọng |
|---|---|---|
| 🔴 **Có bug Critical đang mở** | Bất kỳ bug nào Severity Critical + trạng thái ≠ Đã đóng | Ưu tiên xử lý trước tiên |
| 🟡 **NOT_FIXED lặp lại ≥ 2 lần** | Cùng 1 bug bị retest NOT_FIXED từ 2 lần trở lên | Dấu hiệu fix chưa chạm đúng root cause |
| 🟡 **Thiếu Build/Version hoặc REQ ID** | Bug chi tiết thiếu 1 trong 2 field này | Retest sau không đối chiếu được đúng phạm vi/build |
| 🔵 **Có bug chỉ có tóm tắt** | Nạp từ danh mục nhưng chưa nạp file `BUG_*.md` tương ứng | Nhắc kéo thả thêm để xem đầy đủ, tránh tưởng nhầm đã đủ dữ liệu |

---

## Evidence (ảnh)

Giống `execution-viewer`: trình duyệt không tự đọc được ảnh trên đĩa khi mở qua `file://`, nên ảnh evidence phải do người dùng kéo thả vào trang (khớp theo **tên file**, không theo đường dẫn). Cách nhanh nhất là kéo thả nguyên thư mục `docs/bugs/` **và** thư mục `docs/executions/<module>/<nền-tảng>/run_*/evidence/` chứa ảnh gốc — bug report không nhân bản ảnh, chỉ link tới `executions/`.

---

## Định dạng Markdown được hỗ trợ

| Phần | Nhận diện bằng |
|---|---|
| File bug hợp lệ | Có dòng `**ID:** BUG_` ở bất kỳ đâu trong file |
| Thông tin chung / Ghi chú thêm | Bullet `- **Key:** value` **hoặc** đoạn văn `**Key:** value` (không cần dấu `-`) — cả hai đều nhận diện được |
| Lịch sử retest | Bảng pipe thật dưới heading `## Lịch sử retest`, có cột khớp `/ngày/i` và `/kết quả/i` |
| Danh mục (`docs/bugs/README.md`) | Bảng có cột khớp `/mã bug/i` và `/trạng thái/i` |
| Module | Suy từ chính mã bug: `BUG_<module>_<timestamp>...` — không phụ thuộc đường dẫn thư mục |

Ô placeholder (`—`, `-`, `N/A`) được coi là **không có dữ liệu**, không lọt vào tìm kiếm hay CSV.

---

## Vì sao là 1 file HTML thuần

Cùng lý do với `execution-viewer` — xem [`../execution-viewer/README.md`](../execution-viewer/README.md) mục cuối. File `.xlsx` dựng thủ công bằng zip + Office Open XML (không dùng SheetJS để giữ `bundle.html` nhẹ, mở offline được).

Muốn đổi giao diện thì sửa thẳng trong `bundle.html` — CSS ở `<style>` đầu file, logic ở `<script>` cuối file, chia sẵn khối: `PARSER (generic)` · `PARSER (đặc thù bug)` · `STATE` · `DERIVED` · `RENDER` · `EXPORT` · `EVENTS`.

Màu thương hiệu `#4DBD44` (xanh) khai báo ở biến CSS `--brand`, đồng bộ với 2 viewer kia; riêng logo dùng đỏ (`--crit`) để phân biệt nhanh đây là trang bug, không phải trang kết quả test.
