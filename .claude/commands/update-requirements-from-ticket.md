---
description: Cập nhật tài liệu requirements đã có từ ticket mới (chế độ delta) — nhận diện THÊM/SỬA/BỎ, giữ nguyên REQ ID, ghi Nhật ký thay đổi và xuất Impact Report cho test cases.
skills:
  - skills-requirements-analyzer
---

> **BẮT BUỘC (MANDATORY SKILL):** Nạp skill **`skills-requirements-analyzer`** trước khi bắt đầu. Workflow này chạy **nhánh Document Analysis (mục 3.2)** ở **chế độ delta**, dùng các mục: **2 + 2.1** (đánh mã) · **3.2** (đọc tài liệu) · **4** (AMB/RISK) · **6.1, 6.2, 6.7, 6.9** (schema trạng thái + nhật ký) · **7.1 + 7.3** (strict rules).

# Workflow: Cập Nhật Requirements Từ Ticket Mới (Delta Mode)

Module đang phát triển thì ticket liên tục sửa/bổ sung yêu cầu. Workflow này **cập nhật tại chỗ** tài liệu requirements đã có, thay vì phân tích lại từ đầu — giữ nguyên mã REQ, đánh dấu cái gì đã đổi, và báo cho tester biết test case nào đã stale.

## Khi nào sử dụng

- Module **đã có** `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`, và có ticket mới sửa/bổ sung yêu cầu
- PO/BA vừa trả lời một `AMB-<MODULE>-XX` đang treo → cần chốt lại thành yêu cầu chính thức
- Sprint mới thay đổi phạm vi: gỡ bớt hoặc thêm tính năng vào module đã đặc tả
- User nói: "ticket này update requirement", "yêu cầu vừa đổi", "bổ sung AC mới"

> **KHÔNG dùng workflow này khi:**
> | Tình huống | Dùng thay thế |
> |---|---|
> | Module **chưa có** tài liệu requirements | `/generate-requirements-from-website` (web) · `/generate-requirements-from-mobile` (app) · `/generate-requirements-from-api` (API) · hoặc `/analyze-requirement-document` |
> | **Spec API đổi phiên bản** (không có ticket) | `/generate-requirements-from-api` — tự chạy delta khi `sha256` spec khác snapshot |
> | Chỉ cần phân tích ticket, chưa muốn động vào tài liệu module | `/analyze-requirement-document` |
> | Cần sinh lại test case sau khi cập nhật | `/generate-testcases-manual-rbt` (chỉ cho REQ 🟡/🟢 mới) |

## Đầu vào (Input)

| # | Input | Bắt buộc | Mô tả |
|---|---|---|---|
| 1 | **Ticket mới** | ✅ | File hoặc nội dung ticket — xem bảng định dạng ở `/analyze-requirement-document` |
| 2 | **Module đích** | ✅ | Tên module để xác định `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` |
| 3 | **Thư mục test cases** | ⭕ Khuyến khích | Để sinh Impact Report chính xác. Không có thì Impact Report ghi `⚠️ chưa rà soát` |
| 4 | **Mockup/file đính kèm** | ⭕ Tùy chọn | Xử lý theo mục 3.2 Bước 2 của skill |

## Các bước thực hiện

### Bước 1: Nạp trạng thái hiện tại (BẮT BUỘC — không được bỏ qua)

1. **Đọc `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`** — nếu không tồn tại thì **DỪNG** và hướng dẫn user chạy workflow tạo mới
2. Trích ra và ghi nhớ:
   - Toàn bộ REQ hiện có: mã · tên · nội dung · trạng thái
   - Dòng metadata `Dải mã đã dùng` và `Mã kế tiếp`
   - Toàn bộ `AMB-<MODULE>-XX` kèm trạng thái (❓ / ✅ / ⏭️)
   - Nhật ký thay đổi hiện có (mục 6.9)
3. Nếu tài liệu **bị tách nhiều file** (có mục `## Bản đồ tài liệu`) → đọc index trước, rồi đọc các file con theo bản đồ
4. **Tóm tắt lại cho user** trước khi đi tiếp: *"Module X hiện có N REQ (a active / b changed / c deprecated), M ambiguity còn treo, mã kế tiếp là REQ-XXX-nn"*

### Bước 2: Đọc ticket mới

Theo **mục 3.2** của skill — ủy quyền skill `docx`/`xlsx`/`pdf` đúng định dạng, đọc cả comments và file đính kèm. Không tự fetch URL Jira.

### Bước 3: Phân loại delta (TRỌNG TÂM)

Đối chiếu **từng AC/rule của ticket mới** với tập REQ hiện có, phân vào đúng 1 trong 5 nhóm:

| Nhóm | Dấu hiệu nhận biết | Cách xử lý |
|---|---|---|
| 🟢 **THÊM** | Hành vi hoàn toàn mới, không REQ nào đang mô tả | Cấp mã mới từ `Mã kế tiếp`, trạng thái 🟢 |
| 🟡 **SỬA** | Cùng một hành vi nhưng đổi điều kiện/ngưỡng/thông báo | **GIỮ NGUYÊN mã cũ**, sửa nội dung, đặt trạng thái 🟡, ghi ngày + ticket vào `Cập nhật lần cuối` |
| 🔴 **BỎ** | Ticket gỡ bỏ tính năng đã đặc tả | Đặt trạng thái 🔴 Deprecated. **KHÔNG xoá dòng**, không tái dùng mã |
| ⚪ **CHƯA BUILD** | Yêu cầu được chốt nhưng hệ thống chưa implement | Cấp mã mới, trạng thái ⚪ |
| ⏸️ **TRÙNG** | Ticket nhắc lại đúng điều REQ cũ đã nói | Không đổi gì. Ghi vào báo cáo là "đã có sẵn, không tác động" |

**Quy tắc phân loại — chống cấp mã trùng lặp:**
- ❗ Trước khi xếp một AC vào nhóm **THÊM**, phải **rà soát toàn bộ REQ hiện có** xem đã có REQ nào mô tả cùng hành vi chưa. Cấp mã mới cho hành vi đã tồn tại là lỗi nặng nhất của workflow này — nó tạo REQ trùng và làm RTM đếm coverage sai.
- Ranh giới SỬA vs THÊM: **cùng hành vi, khác tham số** → SỬA. **Hành vi mới hoàn toàn** → THÊM.
  - VD: "Deadline bắt buộc sau Start Date" khi đã có REQ "Deadline là tuỳ chọn" → **SỬA** REQ cũ
  - VD: "Thêm field Priority" → **THÊM** REQ mới
- Không chắc thuộc nhóm nào → xếp tạm vào SỬA và **hỏi user**, không tự quyết.

### Bước 4: Đối chiếu với Ambiguity đang treo

Với mỗi `AMB-<MODULE>-XX` trạng thái ❓ trong tài liệu: kiểm tra ticket mới có trả lời không.

| Nếu ticket trả lời AMB | Hành động |
|---|---|
| Kết luận **trùng** với Assumption tạm | Đổi AMB sang ✅, ghi ngày + kết luận. TC hiện có vẫn đúng |
| Kết luận **khác** Assumption tạm | Đổi AMB sang ✅ + ghi kết luận. ⚠️ **Mọi TC dựa trên assumption cũ đều phải sửa** — bắt buộc đưa vào Impact Report |
| Kết luận sinh yêu cầu mới | Cấp REQ mới, link ngược `Giải quyết AMB-<MODULE>-XX` |

Ambiguity **mới** phát hiện từ ticket này → đánh số tiếp theo dải hiện có (mục 2.1), không đánh lại từ 01.

### Bước 5: Áp thay đổi vào tài liệu

Sửa **tại chỗ** `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`, theo đúng thứ tự:

1. **Bảng REQ (mục 6.2):** thêm dòng mới / sửa nội dung + trạng thái / đổi trạng thái 🔴
2. **Field Spec, Validation Messages, ma trận** (6.3–6.6): cập nhật phần bị tác động
3. **Bảng AMB (6.7):** cập nhật trạng thái, thêm AMB mới
4. **Phân rã Epic/Story (6.8):** gán REQ mới vào Story phù hợp. **Kiểm tra lại dòng tổng** — số REQ trong các Story phải khớp tổng mới
5. **Nhật ký thay đổi (6.9):** thêm dòng mới **lên đầu bảng**, một dòng cho mỗi nhóm thay đổi
6. **Metadata (6.1):** cập nhật `Dải mã đã dùng` và `Mã kế tiếp`
7. **Danh mục toàn hệ thống** `docs/requirements/README.md` — **BẮT BUỘC**, đây là chỗ hay quên nhất:
   - Bảng mục 1: cột `REQ đã dùng`, `Mã kế tiếp`, `AMB treo`, `Cập nhật`. Module mới chỉ được `/discover-system` phát hiện (đang ⬜) mà ticket này là lần đầu sinh REQ → đổi `Trạng thái recon` sang ✅ và điền `Mức phủ tài liệu`
   - Bảng mục 2: số lượng REQ theo trạng thái 🟢/🟡/🔴/⚪ của module này và dòng Tổng
   - Mục 3: thêm/gỡ ambiguity 🔴 High vừa phát sinh hoặc vừa được trả lời

> ⚠️ Nếu số REQ sau cập nhật vượt ngưỡng ở **mục 5.1** của skill → cân nhắc tách file theo mục 5.3. Báo user trước, không tự tách.

### Bước 6: Xuất Impact Report (giá trị cao nhất của workflow)

Báo cáo riêng cho tester. **PHẢI ghi ra file** `docs/requirements/<module>/impact/impact_<TICKET-ID>.md`, đồng thời hiển thị trong chat và là cột `TC cần xử lý` trong Nhật ký.

> 🚨 **Không được để Impact Report chỉ nằm trong chat.** Nó là input **bắt buộc** của `/update-testcases-from-impact`, và qua file `delta_tc_<TICKET-ID>.md` mà workflow đó ghi ra, là gốc của `/update-automation-from-impact` — hai workflow này thường chạy ở phiên khác, có khi hôm sau. Đóng phiên là mất, và không có cách nào dựng lại ngoài chạy lại cả workflow.

Nội dung file:

```markdown
## Impact Report — <TICKET-ID> · <ngày>

### Tóm tắt
| Nhóm | Số lượng | REQ |
|---|---|---|
| 🟢 Thêm mới | 3 | REQ-PRJ-79 → 81 |
| 🟡 Sửa | 2 | REQ-PRJ-42, REQ-PRJ-51 |
| 🔴 Bỏ | 5 | REQ-PRJ-58 → 62 |
| ⏸️ Trùng, không tác động | 4 | REQ-PRJ-14, 15, 22, 30 |

### Test case cần xử lý
| TC ID | REQ liên quan | Hành động | Lý do |
|---|---|---|---|
| TC-PRJ-18 | REQ-PRJ-42 | ⚠️ Review & sửa | Deadline đổi từ tuỳ chọn sang bắt buộc |
| TC-PRJ-31 | REQ-PRJ-58 | 🗑️ Deprecated | Chức năng Copy Project đã bị gỡ |
| — | REQ-PRJ-79 → 81 | ➕ Viết mới | Yêu cầu mới chưa có TC |

### Ambiguity
| Mã | Chuyển trạng thái | Ghi chú |
|---|---|---|
| AMB-PRJ-02 | ❓ → ✅ | PO xác nhận là lỗi → sinh REQ-PRJ-79 |
| AMB-PRJ-13 | (mới) ❓ | Chưa rõ Priority có ảnh hưởng sắp xếp danh sách không |

### Cảnh báo
- ⚠️ AMB-PRJ-04 vẫn treo sau 2 sprint — STORY-PRJ-03 tiếp tục BLOCKED
```

**Cách xác định TC bị ảnh hưởng:**
1. Nếu có thư mục test cases → tìm theo cột `REQ ID` trong các file TC
2. Nếu có RTM (`/generate-traceability-matrix`) → tra ngược từ RTM
3. Không có nguồn nào → ghi `⚠️ chưa rà soát` và **nói rõ với user** rằng cần chạy `/generate-traceability-matrix` để biết tác động thật

## Quy tắc quan trọng

### Cấm (❌)

- **KHÔNG phân tích lại từ đầu** — luôn đọc tài liệu hiện có trước (Bước 1). Bỏ qua bước này là mất toàn bộ lịch sử
- **KHÔNG đánh lại mã REQ từ `01`** — đánh tiếp từ `Mã kế tiếp` (mục 2.1 của skill)
- **KHÔNG cấp mã mới cho hành vi đã có REQ** — phải rà soát trước khi xếp vào nhóm THÊM
- **KHÔNG xoá dòng REQ** — tính năng gỡ bỏ thì đổi trạng thái 🔴, giữ nguyên dòng
- **KHÔNG tái sử dụng mã của REQ đã Deprecated**
- **KHÔNG tự quyết** khi không rõ AC thuộc nhóm SỬA hay THÊM → hỏi user
- **KHÔNG sinh test cases** — workflow này chỉ cập nhật requirements + chỉ ra TC cần xử lý

### Bắt buộc (✅)

- **PHẢI tóm tắt trạng thái hiện tại cho user** sau Bước 1, trước khi áp thay đổi
- **PHẢI ghi Nhật ký thay đổi** — mọi thay đổi, kể cả biên tập câu chữ (`✏️ Biên tập`)
- **PHẢI giữ 4 nơi khớp nhau:** Nhật ký (6.9) ↔ Trạng thái REQ (6.2) ↔ Dải mã metadata (6.1) ↔ **Danh mục `docs/requirements/README.md`**
- **PHẢI kiểm tra lại dòng tổng của Phân rã Epic/Story** sau khi thêm/bỏ REQ
- **PHẢI xuất Impact Report ra file** `docs/requirements/<module>/impact/impact_<TICKET-ID>.md` — kể cả khi không có TC nào bị ảnh hưởng (ghi rõ "không tác động")
- **PHẢI báo đường dẫn file Impact Report** ở cuối, kèm command kế tiếp `/update-testcases-from-impact`
- **PHẢI đối chiếu ticket với AMB đang treo** (Bước 4) — đây là chỗ hay bị bỏ sót nhất
- **PHẢI viết bằng Tiếng Việt**, format Markdown

## Mối quan hệ với workflows khác

| Tình huống | Workflow |
|---|---|
| Trước đó — tạo tài liệu module lần đầu | `/generate-requirements-from-website` (web) · `/generate-requirements-from-mobile` (app) · `/generate-requirements-from-api` (API) |
| Trước đó — phân tích ticket độc lập, chưa merge vào module | `/analyze-requirement-document` |
| Sau đó — **cập nhật TC bị ảnh hưởng (🟡) + đánh dấu Deprecated TC bị gỡ (🗑️)** | `/update-testcases-from-impact` ⭐ mắt xích kế tiếp |
| Sau đó — sinh TC cho REQ mới (🟢) | `/generate-testcases-manual-rbt` hoặc `/generate-testcases-from-requirements` |
| Sau đó — chấm chất lượng bộ TC **sau khi** đã đồng bộ | `/review-testcases` |
| Sau đó — cập nhật ma trận truy vết | `/generate-traceability-matrix` |
| Sau khi TC đã đồng bộ — cập nhật automation script **đã có** (đọc `delta_tc_<TICKET-ID>.md`, **không** đọc thẳng Impact Report) | `/update-automation-from-impact` |
| Sau đó — automate TC mới hoàn toàn (chưa có script) | `/generate-automation-from-testcases` |
