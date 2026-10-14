# Execution Report Viewer

Trang web nhỏ gọn để **xem và gộp kết quả kiểm thử từ file Markdown** — thống kê, lọc, so sánh giữa các lần chạy.

Dùng để đọc output của:
`/execute-test-cases` (`execution_report.md` — chạy bộ TC lẫn chạy checklist) · `/retest-fixed-bugs` (`retest_report.md`)

> 📊 **Ma trận truy vết (RTM)** có viewer riêng: [`../traceability-viewer/`](../traceability-viewer/README.md). Kéo file RTM vào trang này sẽ bị bỏ qua kèm thông báo.

---

## Dùng ngay (không cần cài gì)

Mở [`bundle.html`](bundle.html) bằng trình duyệt — double-click là được. Không cần build, không cần `node_modules`, chạy offline.

Kéo thả, hoặc bấm **+ Import thư mục** / **+ Import file .md** ở góc trên (hai nút này luôn hiện, kể cả sau khi đã nạp dữ liệu — bấm thêm được bất cứ lúc nào), ví dụ:

```
docs/executions/customers/web/run_1785700456/execution_report.md
docs/executions/customers/web/retest_1785700999/retest_report.md
docs/executions/_release/web/run_1786100000/execution_report.md      ← chạy checklist Release-readiness
```

Nạp **nhiều file/thư mục** để gộp số liệu và so sánh giữa các lần chạy — mỗi thư mục `run_*` là 1 lần chạy.

> ⚠️ **Hộp thoại "+ Import thư mục" chỉ chọn được 1 thư mục mỗi lần** — giới hạn của chính hộp thoại hệ điều hành. Muốn so sánh nhiều lần chạy (nhiều thư mục `run_*`) thì bấm nút đó lại cho từng thư mục — dữ liệu cộng dồn chứ không ghi đè. Muốn chọn nhiều thư mục trong 1 lần thì dùng kéo-thả: chọn nhiều thư mục cùng lúc trong Explorer (giữ Ctrl) rồi kéo cả cụm vào trang.

> Toàn bộ xử lý chạy trong trình duyệt, không gửi dữ liệu đi đâu. File đã import lưu vào `localStorage` nên lần mở sau vẫn còn.

---

## Tính năng

| Nhóm | Chi tiết |
|---|---|
| **Import** | Kéo thả, hoặc 2 nút cố định **+ Import thư mục** (nạp được luôn ảnh evidence trong `run_*`) / **+ Import file .md** — luôn hiện, bấm thêm được bất cứ lúc nào · import lại cùng Run ID sẽ ghi đè |
| **Thống kê** | PASS / FAIL / BLOCKED / SKIPPED · tổng TC · **pass rate = PASS / (PASS + FAIL + BLOCKED)** — SKIPPED không nằm ở mẫu số |
| **Gộp nhiều lần chạy** | Cùng module + nền tảng nạp ≥ 2 report → **mỗi TC một dòng, lấy kết quả của lần chạy mới nhất** có chạy TC đó (xếp theo số trong Run ID). Kết quả cũ hiện mờ dưới trạng thái (`trước: BLOCKED`), đủ chuỗi trong panel chi tiết và cột `Lịch sử các lần chạy` khi export. Ví dụ: `run_A` chạy TC 001–010 có TC 010 BLOCKED, `run_B` chỉ chạy lại TC 010 → PASS ⇒ hiện **10 TC**, TC 010 = PASS, không phải 11 dòng |
| **Cảnh báo tự động** | 5 loại — xem mục dưới |
| **Xoá tất cả** | Nút **Xoá tất cả** cạnh **+ Import file .md** (chỉ hiện khi đã nạp ít nhất 1 file) — xoá hết report + ảnh evidence đã nạp (kể cả trong `localStorage`), quay về màn hình kéo thả trống |
| **Sidebar** | Danh sách report đã nạp kèm nhãn `RUN` / `CHECKLIST` / `RETEST`; click để xem riêng một lần chạy, `×` để gỡ |
| **Lần chạy checklist** | Nhận diện qua ô `Loại nguồn` ở header (`Checklist <loại> · <Mã checklist>`), hoặc `Nguồn TC` nằm trong `docs/checklists/`, hoặc mọi ID đều là mã mục `CL-…-<nn>`. Checklist Release-readiness có cột `Module` → mỗi mục hiện đúng module của nó, không gom chung vào `_release` |
| **Lọc** | Theo trạng thái (chip) · theo module · tìm toàn văn trên TC ID, kịch bản, ghi chú, nguyên nhân chặn, Expected/Actual |
| **Sort** | Click header — TC ID sort theo số tự nhiên (`TC_002` trước `TC_010`) |
| **Chi tiết** | Click một dòng để mở panel: REQ ID · Priority · bước fail · Expected vs Actual · nguyên nhân chặn · evidence · file nguồn |
| **So sánh các lần chạy** | Tab riêng — 🆕 Mới fail · 🔁 Fail liên tục · ✅ Vừa được fix · ⚠️ Chuyển sang BLOCKED · 🔓 Hết BLOCKED |
| **Verify bug** | Tab riêng cho kết quả retest: FIXED / NOT_FIXED / PARTIAL / CANNOT_VERIFY |
| **Export** | **CSV** và **Excel (.xlsx)** — xuất **đúng tab đang mở** và **đúng phần đang hiển thị** sau lọc/tìm kiếm. Gộp nhiều lần chạy thì Excel có sheet `Tổng hợp` (kết quả mới nhất) + mỗi lần chạy một sheet giữ **nguyên bản** kết quả của lần đó |

---

## Export CSV / Excel

Hai nút `↓ CSV` và `↓ Excel` xuất **đúng tab đang mở**, đã áp bộ lọc và tìm kiếm hiện tại.

| Định dạng | Đặc điểm |
|---|---|
| **CSV** | Một bảng (sheet Tổng hợp). Có BOM UTF-8 nên Excel trên Windows đọc đúng tiếng Việt, không lỗi font |
| **Excel** | **Nhiều sheet**, freeze dòng tiêu đề, AutoFilter, wrap text, độ rộng cột đặt sẵn, **ô trạng thái tô màu** đúng như trên web |

**Excel tách sheet thế nào:**

| Tab | Sheet |
|---|---|
| Kết quả TC | `Tổng hợp` + mỗi **lần chạy** một sheet (khi nạp > 1 lần chạy) |

Tên file dạng `execution_report_<yyyyMMdd-HHmmss>.xlsx`.

> File `.xlsx` được dựng thủ công bằng zip + Office Open XML (không dùng SheetJS — thư viện ~900 KB sẽ làm phình `bundle.html` vốn phải mở offline được). Zip ghi ở chế độ STORE (không nén) nên file to hơn bình thường.

---

## Cảnh báo tự động

Đây là phần khiến trang này khác một bảng Excel thường — nó chủ động chặn những kết luận sai hay gặp nhất:

| Cảnh báo | Kích hoạt khi | Vì sao quan trọng |
|---|---|---|
| 🔴 **BLOCKED > 20%** | Tỷ lệ BLOCKED vượt 20% | BLOCKED là **chưa test được**, không phải đạt. Trên 20% thì lần chạy không đủ dữ liệu để kết luận chất lượng |
| 🟡 **BLOCKED 5–20%** | — | Nhắc nêu rõ nguyên nhân chặn khi báo cáo |
| 🟡 **Có TC SKIPPED** | Bất kỳ TC nào bị skip | TC skip do thao tác phá huỷ trên môi trường dùng chung là **nợ kiểm thử**, dễ biến mất khỏi mọi báo cáo về sau |
| 🟡 **Dữ liệu chưa dọn** | Cột `Đã xoá?` có ô khác ✅ (ô `—` của dòng *"Không tạo bản ghi nào"* không tính) | Môi trường còn data thừa → lần chạy sau có thể fail vì lý do không liên quan đến ứng dụng |
| 🟡 **Trộn bộ TC với checklist** | Trong phạm vi đang xem có cả lần chạy bộ TC lẫn lần chạy checklist | Mục checklist không phải test case — Tổng TC và pass rate đang cộng hai loại đơn vị. Báo cáo tổng hợp tách hai bảng; chọn một lần chạy ở sidebar để xem số đúng |
| 🔵 **Gộp nhiều lần chạy cùng module** | Cùng module + nền tảng có ≥ 2 report | Báo số liệu đang là **kết quả mới nhất của từng TC**, không phải của riêng một lần chạy nào, và bao nhiêu TC có kết quả thay đổi. Chọn một lần chạy ở sidebar để xem số của riêng lần đó |

---

## Định dạng Markdown được hỗ trợ

Parser **không phụ thuộc số thứ tự mục** (`## 1.`, `## 2.`…) — nó nhận diện bảng theo **tên cột**, nên report có thêm/bớt mục vẫn đọc được.

| Loại bảng | Nhận diện bằng | Lấy ra |
|---|---|---|
| Kết quả từng TC | có cột `TC ID` **và** cột `Kết quả` | TC ID · kịch bản (cột `Test Scenario` / `Hạng mục kiểm tra`) · trạng thái · bước fail · ghi chú · `Module` của từng dòng nếu có cột đó |
| TC BLOCKED | có cột `TC ID` **và** cột `Nguyên nhân chặn` | nguyên nhân chặn · cần gì để chạy được |
| Chi tiết FAIL / REG | heading `### FAIL #1 — <TC ID hoặc mã mục CL-…-<nn>> · <kịch bản>` + bảng 2 cột ngay sau | REQ ID · Priority · Expected · Actual · evidence · nghi ngờ nguyên nhân |
| Verify bug (retest) | bảng 2 cột có khoá `Bug` **và** khoá `Kết quả` | bug · kết quả retest · severity gốc · số lần lặp |
| Dữ liệu đã dọn | có cột `Đã xoá?` | đếm số dòng chưa dọn |
| Header lần chạy | bảng 2 cột đầu file (`Thông tin` / `Nội dung`) | Run ID · Retest ID · Build · `Loại nguồn` · môi trường… |

File có tiêu đề hoặc tên chứa `Ma trận truy vết` / `traceability` / `RTM` bị **bỏ qua** — xem bằng [`traceability-viewer`](../traceability-viewer/README.md).

**Quy ước khác:**

- **Module** lấy từ heading `#` đầu file: `# Execution Report — <Module> · <Loại chạy>`
- **Run ID** lấy từ khoá `Run ID` hoặc `Retest ID` trong bảng header; không có thì dùng tên file
- **Trạng thái** nhận cả dạng có emoji (`✅ PASS`, `⚠️ BLOCKED`) lẫn không; retest nhận `FIXED` / `NOT_FIXED` / `PARTIAL` / `CANNOT_VERIFY`
- Ô placeholder (`—`, `-`, `N/A`) được coi là **không có dữ liệu**, không lọt vào tìm kiếm hay CSV
- Pipe trong cell phải escape `\|` (đúng chuẩn Markdown)
- Bảng không khớp mẫu nào ở trên (Tổng kết, Đề xuất bước tiếp theo…) được **bỏ qua tự động** — số liệu tổng kết được **tính lại từ bảng TC**, không đọc từ bảng Tổng kết, nên report có số sai vẫn hiện đúng

---

## So sánh các lần chạy hoạt động thế nào

Gom report theo **module + nền tảng**, sắp theo Run ID (số trong `run_1785700456`) tăng dần, rồi so **cùng TC ID** giữa hai lần chạy gần nhất:

| Nhóm | Điều kiện |
|---|---|
| 🆕 Mới fail | lần trước PASS hoặc BLOCKED → lần này FAIL |
| 🔁 Fail liên tục | FAIL ở cả hai lần |
| ✅ Vừa được fix | lần trước FAIL → lần này PASS |
| ⚠️ Chuyển sang BLOCKED | trước chạy được → giờ bị chặn |
| 🔓 Hết BLOCKED | lần trước BLOCKED → lần này PASS (BLOCKED → FAIL xếp vào 🆕 Mới fail) |

> ⚠️ So sánh chỉ có ý nghĩa khi các lần chạy dùng **cùng nguồn TC**. File TC đã sửa giữa hai lần chạy thì đừng kết luận "chất lượng giảm" từ số thô.
>
> Mục checklist mang mã riêng của từng checklist (`CL-smoke_20261009-03`), nên mục `#3` của checklist smoke **không** bị so với mục `#3` của checklist regression. Chạy lại **đúng** một file checklist thì so được với nhau như TC.

---

## Vì sao là 1 file HTML thuần, không phải React như `testcases-viewer`

| | `testcases-viewer` | `execution-viewer` |
|---|---|---|
| Stack | React + TS + Vite + Parcel + Tailwind + shadcn/ui | HTML/CSS/JS thuần, 1 file |
| File trong repo | 71 | 2 (`bundle.html` + README) |
| Cần `pnpm install` để sửa | Có | Không — mở file, sửa, xong |

Trang này chỉ có 3 bảng và một panel chi tiết — không đủ phức tạp để cần component framework, mà lại phải sống được khi mở bằng `file://` trên máy bất kỳ. Cách dùng với người dùng cuối là **y hệt**: double-click `bundle.html`, kéo thả file `.md`.

Muốn đổi giao diện thì sửa thẳng trong `bundle.html` — CSS nằm ở `<style>` đầu file, logic ở `<script>` cuối file, chia sẵn 4 khối: `PARSER` · `STATE` · `DERIVED` · `RENDER`.

Màu thương hiệu `#4DBD44` khai báo ở biến CSS `--brand`, đồng bộ với `testcases-viewer`.
