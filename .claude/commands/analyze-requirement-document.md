---
description: Phân tích requirement document (Jira ticket, .docx/.pdf/.xlsx/.csv/.xml, user story) — sinh tài liệu phân tích chi tiết, KHÔNG sinh test cases.
skills:
  - skills-requirements-analyzer
---

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp skill **`skills-requirements-analyzer`** (tại `.claude/skills/skills-requirements-analyzer/SKILL.md`) trước khi bắt đầu. Workflow này chạy **nhánh Document Analysis**, chỉ dùng các mục sau của skill:
>
> | Mục skill | Dùng để |
> |---|---|
> | **2** + **2.1** | Quy ước đánh mã REQ/AMB/RISK + quy tắc nối tiếp mã giữa các đợt |
> | **3.2** | Quy trình trích xuất từ tài liệu (đọc file, đối chiếu chéo, xử lý tài liệu thiếu) |
> | **4** | Framework phát hiện Ambiguity & Risk |
> | **5** | Quy tắc quy mô/tách file |
> | **7.1** + **7.3** | Strict rules chung + strict rules riêng nhánh tài liệu |
>
> ❌ **KHÔNG dùng mục 3.1** (UI Recon) và **mục 6** (cấu trúc tài liệu đặc tả module) — workflow này có template riêng ở phần "Cấu trúc Output" bên dưới.

# Workflow: Phân Tích Requirement Document

Workflow này phân tích requirement documents (Jira tickets, .doc files, user stories, design mockups) và sinh ra một tài liệu phân tích chi tiết. **KHÔNG sinh test cases** — chỉ tập trung vào hiểu, phân rã, và phát hiện rủi ro/mơ hồ trong yêu cầu.

## Khi nào sử dụng

- User cung cấp Jira ticket hoặc requirement document (`.doc`, `.docx`, `.pdf`, `.xlsx`, `.csv`, `.xml`, `.md`) và yêu cầu "phân tích"
- User đã có sẵn bộ file đặc tả (tài liệu + file bảng field + mockup) và muốn tổng hợp thành một tài liệu phân tích
- User muốn hiểu rõ scope, acceptance criteria, và dependencies trước khi viết test
- User cần danh sách các điểm mơ hồ (ambiguities) để clarify với PO/BA
- User nói: "phân tích requirement", "review yêu cầu", "analyze this ticket"

> **KHÔNG dùng workflow này khi:**
> - Nguồn sự thật là hệ thống đang chạy (không có tài liệu) → `/generate-requirements-from-website` (web) · `/generate-requirements-from-mobile` (app mobile)
> - Đầu vào là **đặc tả API** — OpenAPI/Swagger/Scalar/Redoc, Postman collection, hoặc `.docx`/`.pdf` mô tả endpoint — mà **không** gắn với một ticket → `/generate-requirements-from-api`. Workflow đó không cần Ticket ID, và ghi vào `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` thay vì `analysis_<TICKET-ID>.md`

### ⛔ Bước 0 — Chốt chặn đầu vào (BẮT BUỘC, làm TRƯỚC mọi thứ khác)

Workflow này nhận **tài liệu nguồn** (ticket, spec, user story) và sinh ra **tài liệu phân tích**. Rất hay gặp tình huống người dùng truyền nhầm một **sản phẩm đầu ra của workflow khác** vào đây. Chạy tiếp sẽ sinh ra bản diễn đạt lại của tài liệu đã có, không mã ticket, và có nguy cơ cấp trùng dải REQ.

**Mở tệp được truyền vào và kiểm 3 dấu hiệu. Trúng bất kỳ dấu hiệu nào → DỪNG, báo user, hỏi ý định thật:**

| Dấu hiệu tệp là ĐẦU RA, không phải đầu vào | Thuộc workflow nào | Route đúng |
|---|---|---|
| Tên khớp `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`, hoặc có bảng `REQ ID`/`Dải mã đã dùng`/`Nhật ký thay đổi` | `/generate-requirements-from-website` | Cập nhật theo ticket → `/update-requirements-from-ticket` · Sinh TC → `/generate_testcases_*` |
| Tên khớp `system_map.md`, hoặc nằm trong `_discovery/` (trừ `sources/`) | `/discover-system` | Recon chi tiết một module → `/generate-requirements-from-website` (web) · `/generate-requirements-from-mobile` (app) |
| Tên khớp `api_map.md` | `/discover-system` nhánh API · `/generate-testcases-api` | Sinh REQ cho module API → **`/generate-requirements-from-api`** · Sinh TC API → `/generate-testcases-api` |
| Tên khớp `analysis_<TICKET-ID>.md`, `impact_<TICKET-ID>.md`, `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` | chính workflow này hoặc tầng test case | Hỏi user muốn làm gì với nó |

**Tệp là đặc tả API, không phải tài liệu ticket** — cũng dừng và route, dù không phải sản phẩm của workflow khác:

| Dấu hiệu | Route đúng |
|---|---|
| JSON/YAML có khoá `openapi` / `swagger` + `paths` · JSON có `info._postman_id` hoặc `item[].request` · snapshot trong `_discovery/sources/` · URL Swagger UI / Scalar / Redoc | `/generate-requirements-from-api` |
| `.docx`/`.pdf` mà phần chính là bảng method/path, JSON mẫu request/response, bảng mã lỗi — **không** có Ticket ID | `/generate-requirements-from-api` (skill 3.4.6) |
| Ticket (có ID) mô tả thay đổi của **một** API | ✅ Chạy tiếp ở đây — đó đúng là tài liệu ticket |

**Không xác định được ticket ID** từ tệp đầu vào cũng là dấu hiệu đủ để dừng — đầu ra bắt buộc đặt tên theo `analysis_<TICKET-ID>.md`, không có ID thì không đặt tên được. Trước khi dừng, kiểm bảng ngay trên: tệp không có ID vì là **đặc tả API** thì route sang `/generate-requirements-from-api`, không chỉ dừng suông.

❌ **Không "cố suy ra" một ticket ID** từ tên module hay ngày tháng để chạy tiếp. Dừng và hỏi.

## Đầu vào (Input)

Agent cần thu thập từ user:

| # | Input | Bắt buộc | Mô tả |
|---|---|---|---|
| 1 | **Requirement document** | ✅ | Xem bảng định dạng bên dưới |
| 2 | **Mockup/Screenshot** | ⭕ Khuyến khích | Hình ảnh UI design, wireframe, hoặc screenshot hiện tại |
| 3 | **Related tickets** | ⭕ Tùy chọn | Các ticket phụ thuộc hoặc liên quan (dependencies) |
| 4 | **File bảng đính kèm** | ⭕ Rất giá trị | `.xlsx`/`.csv` chứa danh sách field, message lỗi, ma trận phân quyền/trạng thái |
| 5 | **Context bổ sung** | ⭕ Tùy chọn | Thông tin về hệ thống hiện tại, business domain |

### Định dạng hỗ trợ & cách đọc (BẮT BUỘC tuân thủ)

| Định dạng | Cách xử lý |
|---|---|
| `.md`, `.txt`, `.html`, `.xml`, `.json` | `Read` trực tiếp |
| `.doc` export từ Jira | Thực chất là HTML → `Read` rồi bóc tag |
| `.docx`, `.dotx` | **Ủy quyền skill `docx`** — là ZIP/OOXML, `Read` thẳng ra rác |
| `.xlsx`, `.xlsm`, `.csv`, `.tsv` | **Ủy quyền skill `xlsx`** |
| `.pdf` | **Ủy quyền skill `pdf`** |
| `.pptx` | **Ủy quyền skill `pptx`** |
| Ảnh (`.png`, `.jpg`) | `Read` — công cụ hiển thị ảnh trực tiếp |
| **URL Jira / Confluence** | ❌ **KHÔNG tự fetch.** Route sang `/fetch-jira-requirements` (skill `skills-jira-integration`). Nếu MCP Atlassian chưa authorize → **dừng, báo user cần authorize**, tuyệt đối KHÔNG bịa nội dung ticket |

> [!NOTE]
> Nếu user chỉ cung cấp file tài liệu mà không có mockup, agent vẫn phải phân tích đầy đủ dựa trên nội dung document. Nếu có mockup/screenshot, agent phân tích UI chi tiết hơn.

> [!IMPORTANT]
> Không đọc được file bằng bất kỳ cách nào → **báo user và dừng**. KHÔNG suy đoán nội dung từ tên file. Chi tiết: **mục 3.2 Bước 0** của skill `skills-requirements-analyzer`.

## Các bước thực hiện

### Bước 1: Thu thập và đọc hiểu (Information Gathering)

1. **Đọc requirement document** theo đúng bảng định dạng ở trên — ủy quyền skill `docx`/`xlsx`/`pdf` khi cần, không `Read` thẳng file nhị phân
   - Xác định: Ticket ID, Type, Priority, Status, Reporter, Assignee, Fix Version, Sprint, Labels, Epic cha
2. **Đọc mockup/screenshot** nếu có — phân tích UI layout, components, fields
3. **Kiểm tra related tickets** nếu có trong cùng thư mục hoặc được user cung cấp
   - Đọc và tóm tắt dependencies
4. **Đọc file bảng đính kèm** (`.xlsx`/`.csv`) nếu có — đây thường là nguồn đặc tả **giá trị hơn cả phần mô tả**:
   | Loại bảng | Dùng để sinh |
   |---|---|
   | Danh sách field kèm kiểu dữ liệu, bắt buộc, độ dài | Field Specifications (map gần như 1:1) |
   | Bảng thông báo lỗi / message key | Validation Messages |
   | Ma trận role × chức năng | Ma trận Phân quyền |
   | Bảng trạng thái × hành động | Ma trận Trạng thái |
   | Data mẫu / test data | Ghi chú lại làm input cho `/generate-test-data` — KHÔNG đưa vào requirements |
5. **Đọc toàn bộ comments** — comment thường chứa quyết định mới nhất và **đè lên** phần mô tả gốc
6. **Xác nhận** đã nắm được bối cảnh → tiếp tục phân tích

> Toàn bộ Bước 1 tuân theo **mục 3.2** của skill `skills-requirements-analyzer`.

### Bước 2: Trích xuất thông tin cốt lõi (Core Analysis)

1. **Tổng quan Ticket** — Bảng metadata (ID, Type, Priority, Status, Sprint, Assignee...)
2. **User Story** — Trích xuất format "As a... I want... So that..."
3. **Phạm vi áp dụng (Scope)** — Xác định rõ các module/page/component bị ảnh hưởng
4. **Acceptance Criteria** — Phân rã từng AC thành các nhóm logic, bao gồm:
   - ⚠️ **TRƯỚC KHI GÁN MÃ — kiểm tra dải REQ đã tồn tại:** mở `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`. Nếu module đã có tài liệu, **đánh tiếp từ số cuối cùng** (VD module đã dùng tới `REQ-PRJ-65` → ticket này bắt đầu từ `REQ-PRJ-66`), **TUYỆT ĐỐI KHÔNG** đánh lại từ `01`. Xem **mục 2.1** của skill `skills-requirements-analyzer`.
   - **Gán mã `REQ-<MODULE>-<SỐ>` cho từng AC/rule** (theo Quy Ước Đánh Mã trong skill `skills-requirements-analyzer`) — mỗi rule đủ nhỏ để test độc lập; mã này sẽ được dùng lại ở cột `REQ ID` của bảng test cases
   - **Ghi nguồn** cho mỗi REQ mới: `Ticket <ID>` / `AC#<n>` — để truy được mã đến từ đợt phân tích nào
   - Nếu AC **sửa hành vi của một REQ đã có** (không phải thêm mới): giữ nguyên mã cũ, ghi chú `Cập nhật bởi ticket <ID>` — không cấp mã mới cho cùng một hành vi
   - Mô tả chi tiết từng AC
   - Bảng so sánh (nếu có cột mới, field mới, rule mới)
   - Phân biệt rõ **mặc định vs tùy chọn** (nếu applicable)

### Bước 3: Phân tích UI từ Mockup (nếu có)

Nếu user cung cấp mockup/screenshot:

1. **Mô tả layout** — Breadcrumb, header, sidebar, main content, footer
2. **Liệt kê components** — Tables, forms, modals, buttons, dropdowns, tabs
3. **Chi tiết fields** — Tên field, loại (input/dropdown/date picker), label, placeholder
4. **So sánh** mockup với document — phát hiện inconsistency
5. **Chụp quan sát** vào carousel trong artifact (nếu hình có sẵn)

### Bước 4: Phân tích Dependencies (Phụ thuộc)

1. Xác định các ticket/feature liên quan (referenced trong AC hoặc comments)
2. Đọc và tóm tắt nội dung ticket phụ thuộc
3. Nếu có mockup riêng cho dependency → phân tích UI chi tiết (fields, modals, interactions)
4. Tổng hợp **Business Rules** từ tất cả requirements + mockups
5. Đánh dấu rõ quy tắc nào từ ticket chính vs ticket phụ thuộc

### Bước 4b: Đối chiếu chéo các nguồn (BẮT BUỘC khi có ≥ 2 nguồn)

Khi có nhiều hơn một nguồn (mô tả ticket · comment · mockup · file đính kèm · related ticket), **PHẢI** lập bảng đối chiếu **trước khi** viết phần phân tích AC:

| Hạng mục | Ticket mô tả | Comment | Mockup | File đính kèm | Kết luận |
|---|---|---|---|---|---|
| VD: độ dài tối đa Tên | không nói | 255 | — | 200 | ⚠️ Xung đột → AMB-<MODULE>-XX |

**Thứ tự ưu tiên khi mâu thuẫn** (mục 3.2 Bước 3 của skill) — luôn ghi rõ đã chọn nguồn nào và vì sao:

```
1. Comment/quyết định mới nhất có ghi ngày   ← mới nhất thắng
2. AC trong phần mô tả ticket                 ← cam kết chính thức
3. File đặc tả đính kèm (CSV/XLSX/DOCX)
4. Mockup/wireframe                           ← dễ lỗi thời nhất
```

❗ **Xung đột KHÔNG được tự giải quyết im lặng** — mọi mâu thuẫn đều phải thành một `AMB-<MODULE>-XX`, kể cả khi đã chọn được nguồn ưu tiên.

### Bước 4c: Xử lý tài liệu thiếu (rất hay gặp)

| Tình huống | Cách xử lý |
|---|---|
| Ticket **không có AC nào**, chỉ 1–2 dòng mô tả | ❌ **KHÔNG tự viết AC thay PO/BA.** Ghi nhận đúng những gì có → liệt kê danh sách câu hỏi cần clarify dạng `AMB-<MODULE>-XX` mức 🔴 High → ghi rõ ngay đầu tài liệu: *"Ticket chưa có AC — tài liệu này CHƯA ĐỦ để sinh test case"* |
| AC mơ hồ ("hoạt động đúng", "như module cũ") | Gán REQ ID bình thường **nhưng** kèm ngay 1 `AMB-<MODULE>-XX` hỏi tiêu chí cụ thể |
| Tham chiếu "giống module X" | Nếu đã có `docs/requirements/<X>/REQUIREMENTS_<X>_SUMMARY.md` → trích REQ tương ứng và **link chéo**. Chưa có → `AMB-<MODULE>-XX`, không tự suy diễn |
| Thiếu hoàn toàn thông tin phân quyền/trạng thái | Ghi **"Không đề cập trong tài liệu"** (KHÁC với "Không áp dụng") + `AMB-<MODULE>-XX` |

### Bước 5: Phát hiện Ambiguities & Risks (Trọng tâm)

> [!IMPORTANT]
> Đây là phần **giá trị cao nhất** của workflow — phát hiện những gì requirement KHÔNG nói rõ.

**5.1. Điểm mơ hồ (Ambiguities):**

Áp dụng **Framework Phát Hiện Ambiguity & Risk (mục 4)** trong skill `skills-requirements-analyzer`. Với mỗi ambiguity, ghi rõ:
- **Mã:** AMB-<MODULE>-XX (đánh số tuần tự)
- **Câu hỏi:** Mô tả rõ ràng điều gì chưa rõ
- **Nguy cơ:** Impact nếu không được giải quyết
- **Mức độ:** 🔴 High / 🟡 Medium / 🟢 Low
- **Assumption tạm:** Nếu không được trả lời thì test theo giả định nào

Các hướng phát hiện ambiguity:
- Từ khóa mơ hồ: "where applicable", "as needed", "similar to", "etc."
- Validation rules thiếu: min/max, format, required/optional
- Hành vi edge case: lỗi mạng, concurrent access, trống data
- Inconsistency giữa document và mockup (tên cột, format, layout)
- Threshold/config chưa xác định (ví dụ: bao nhiêu ngày = "approaching deadline"?)
- Conflict giữa requirements cũ và mới

**5.2. Rủi ro kiểm thử (Testing Risks):**

Với mỗi risk, ghi rõ:
- **Mã:** RISK-<MODULE>-XX
- **Tên rủi ro**
- **Mô tả**
- **Mitigation** (cách giảm thiểu)

### Bước 6: Tổng hợp và trình bày (Synthesis & Delivery)

1. **Ma trận trạng thái** (nếu có state transitions) — bảng mapping trạng thái → hành vi
2. **Checklist AC** — Tóm tắt tất cả AC dạng checkbox, nhóm theo chức năng
3. **Khuyến nghị kiểm thử** — Gợi ý top 10 điều cần quan tâm nhất khi test
4. **Quyết định cấu trúc đầu ra** — xem mục "Quy mô tài liệu" bên dưới trước khi ghi file
5. **Xuất Artifact** — Lưu toàn bộ phân tích vào file `.md`
6. **Cập nhật ngược dải REQ** — nếu module đã có `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`, bổ sung dòng ghi dải REQ vừa cấp thêm vào bảng metadata của file đó:
   ```markdown
   | Dải REQ đã dùng | REQ-PRJ-01 → REQ-PRJ-78 (đợt 1: UI recon 01→65 · đợt 2: ticket ABC-123 66→78) |
   ```
   Bước này giữ cho lần chạy sau biết phải đánh tiếp từ đâu — **không được bỏ qua**.

## Quy mô tài liệu (Scaling)

Một ticket đơn lẻ **tự nó đã là một Story** — KHÔNG áp quy tắc phân rã Epic/Story của skill vào đây, vì làm vậy là chồng thêm một lớp backlog lên backlog thật của team.

**Tuy nhiên** Bước 4 cho phép gộp nhiều related tickets vào cùng một tài liệu, nên tài liệu vẫn phình được. Áp ngưỡng sau:

| Điều kiện | Cấu trúc đầu ra |
|---|---|
| 1 ticket, hoặc < 25 REQ | 1 file `analysis_<TICKET-ID>.md` — giữ nguyên template 10 mục |
| Gộp từ **≥ 3 ticket** hoặc **≥ 25 REQ** | Tách: 1 file index + mỗi ticket 1 file con |

### Nơi lưu file (BẮT BUỘC)

Tài liệu phân tích ticket nằm **trong thư mục của module** mà ticket tác động — KHÔNG đặt ở thư mục toàn cục, để giữ liên kết ticket ↔ module:

```
docs/requirements/<module>/analysis/analysis_<TICKET-ID>.md
```

Chưa xác định được module đích → **hỏi user**, không tự đoán. Module chưa có thư mục → tạo mới và **bổ sung một dòng vào bảng danh mục** `docs/requirements/README.md`.

**Khi tách — dùng lại đúng hợp đồng đọc tại mục 5.5 của skill, không phát minh cấu trúc mới:**

```
docs/requirements/<module>/analysis/
├── analysis_<TICKET-ID>.md        ← INDEX (điểm vào duy nhất, tên theo ticket CHÍNH)
└── <TICKET-ID>/
    ├── ticket_<DEP-1>.md
    └── ticket_<DEP-2>.md
```

- Index giữ: metadata, User Story, Scope, **Business Rules tổng hợp**, Ma trận trạng thái, **AMB/RISK (đánh số toàn bộ phạm vi phân tích, không đánh lại theo từng file)**, Checklist AC, Khuyến nghị kiểm thử
- File con giữ: AC chi tiết + phân tích mockup của riêng ticket đó
- Index **BẮT BUỘC** có mục `## Bản đồ tài liệu` liệt kê file con kèm dải REQ mà file đó chứa

## Cấu trúc Output (Template Artifact)

> [!IMPORTANT]
> **Workflow này dùng template 10 mục dưới đây — KHÔNG dùng cấu trúc mục 6 của skill.**
> Mục 6 của skill (`Field Specifications`, `Ma trận Phân quyền`…) dành cho `/generate-requirements-from-website`, đầu ra là **tài liệu đặc tả module** (`REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`). Còn workflow này sinh **tài liệu phân tích ticket** (`analysis_<TICKET-ID>.md`) — hai thứ khác nhau.
>
> Từ skill, workflow này chỉ mượn: **mục 2 + 2.1** (đánh mã), **3.2** (trích xuất tài liệu), **4** (AMB/RISK), **5** (scaling), **7.1 + 7.3** (strict rules).

Agent PHẢI xuất artifact theo cấu trúc sau:

```markdown
# 📋 Phân Tích Requirement: [TICKET-ID]
## [Ticket Title]

## 1. Tổng Quan Ticket
(Bảng metadata — BẮT BUỘC có 4 dòng sau, ngoài ID/Type/Priority/Status/Sprint/Assignee)
| **Nguồn phân tích** | Liệt kê MỌI file/nguồn đã đọc: `ABC-123.docx` · `field_spec.xlsx` · 3 comments · mockup_v2.png |
| **Dải mã đã dùng**  | `REQ-PRJ-66` → `REQ-PRJ-78` · `AMB-PRJ-01` → `AMB-PRJ-05` · `RISK-PRJ-01` → `RISK-PRJ-03` |
| **Mã kế tiếp**      | Đợt sau bắt đầu từ `REQ-PRJ-79` — KHÔNG đánh lại từ 01 |
| **Mức độ đầy đủ**   | Đủ AC để sinh test case / ⚠️ Thiếu AC — chưa đủ (xem mục 7) |

## 2. User Story
(As a... I want... So that... — trích NGUYÊN VĂN)

## 3. Phạm Vi Áp Dụng (Scope)
(Bảng liệt kê modules/pages bị ảnh hưởng — ghi cả phần NGOÀI phạm vi nếu tài liệu có nêu)

## 4. Acceptance Criteria — Phân Tích Chi Tiết
### 4.1. [Nhóm AC 1]
### 4.2. [Nhóm AC 2]
### 4.N. [Nhóm AC N]
(Mỗi rule 1 REQ ID + cột Nguồn ghi vị trí cụ thể: `AC#4` / `field_spec.xlsx · sheet "Fields" · dòng 12`)

## 4b. Đối Chiếu Chéo Nguồn (bắt buộc khi có ≥ 2 nguồn)
(Bảng: Hạng mục | Ticket | Comment | Mockup | File đính kèm | Kết luận)

## 5. Phụ Thuộc (Dependencies)
### 5.1. [Ticket phụ thuộc]
#### 5.1.1. [Chi tiết UI nếu có mockup]
#### 5.1.N. Business Rules tổng hợp

## 6. Phân Tích Mockup/Screenshot
### 6.1. [Mockup 1]
### 6.N. [Mockup N]

## 7. Các Điểm Mơ Hồ & Rủi Ro
### 7.1. Điểm Mơ Hồ (Ambiguities)
(Bảng: #, Câu hỏi, Nguy cơ, Mức độ)
### 7.2. Rủi Ro Kiểm Thử
(Bảng: #, Rủi ro, Mô tả, Mitigation)

## 8. Ma Trận Trạng Thái (nếu applicable)
(Bảng state → behavior)

## 9. Tóm Tắt Acceptance Criteria (Checklist)
(Checkbox nhóm theo chức năng)

## 10. Khuyến Nghị Cho Kiểm Thử
(Danh sách gợi ý, KHÔNG phải test cases)
```

## Quy tắc quan trọng

### Cấm (❌)

- **KHÔNG sinh test cases** — workflow này chỉ phân tích, không tạo TC
- **KHÔNG chạy khi đầu vào là sản phẩm đầu ra của workflow khác** (`REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`, `requirements_*.md`, `system_map.md`, `analysis_*.md`, `TEST_CASES_<TÊN_MODULE>_SUMMARY.md`, `test_cases_*.md`) — xem **Bước 0**. Dừng và hỏi ý định thật, tuyệt đối không sinh một bản diễn đạt lại của tài liệu đã có
- **KHÔNG tự viết AC thay PO/BA.** Ticket thiếu AC → ghi nhận đúng thực trạng + `AMB-<MODULE>-XX` 🔴 High. Đây là luật tương đương "không đoán locator" của nhánh UI — vi phạm là tài liệu mất giá trị hoàn toàn
- **KHÔNG đánh lại mã REQ từ `01`** nếu module đã có tài liệu — luôn đánh tiếp từ số cuối (mục 2.1 của skill). Đụng mã là vỡ toàn bộ RTM
- **KHÔNG đọc file nhị phân bằng `Read`** (`.docx`/`.xlsx`/`.pdf`/`.pptx`) — ủy quyền đúng skill. Đọc không được thì **dừng và báo user**, không suy đoán từ tên file
- **KHÔNG tự fetch URL Jira/Confluence** — route sang `/fetch-jira-requirements`. MCP chưa authorize thì báo user, tuyệt đối không bịa nội dung ticket
- **KHÔNG tự đoán** business logic nếu document không nói rõ → đưa vào Ambiguities
- **KHÔNG bỏ qua comments** trong Jira ticket — comments thường là quyết định mới nhất và **đè lên** phần mô tả gốc
- **KHÔNG tự giải quyết im lặng xung đột giữa các nguồn** — luôn thành `AMB-<MODULE>-XX`, kể cả khi đã áp thứ tự ưu tiên

### Bắt buộc (✅)

- **PHẢI chạy Cổng Tự Soát REQ (mục 4.3 của skill) trước khi ghi file** — 9 câu hỏi bắt lỗi do chính agent viết sai: tên REQ lệch AC, gộp nhiều rule vào một mã, chép giá trị biến thiên theo phiên, assert khớp tuyệt đối lên giá trị có phần động. REQ sinh từ tài liệu mắc y hệt các lỗi này như REQ sinh từ UI
- **PHẢI trích dẫn nguyên văn** mọi rule, message, giá trị ngưỡng — cấm diễn đạt lại rồi gán REQ
- **PHẢI ghi vị trí nguồn cụ thể** ở cột `Nguồn`, đủ để người review mở đúng chỗ đối chiếu:
  ```
  ✅ Ticket ABC-123 · AC#4           ✅ field_spec.xlsx · sheet "Fields" · dòng 12
  ✅ Comment của PO ngày 15-07-2026   ❌ "theo tài liệu"    ❌ "trong ticket"
  ```
- **PHẢI đọc related tickets** nếu được reference trong AC
- **PHẢI khai thác file bảng đính kèm** (`.xlsx`/`.csv`) — nguồn Field Spec / Validation Message / ma trận tốt nhất
- **PHẢI phân tích mockup** chi tiết nếu được cung cấp (fields, layout, interactions)
- **PHẢI lập bảng đối chiếu chéo** (Bước 4b) khi có ≥ 2 nguồn
- **PHẢI phân biệt "Không đề cập trong tài liệu"** (thiếu → cần hỏi) với **"Không áp dụng"** (đã cân nhắc, không liên quan)
- **PHẢI ghi rõ mức độ đầy đủ** ở bảng metadata — nếu thiếu AC thì nói thẳng "chưa đủ để sinh test case"
- **PHẢI cập nhật ngược dải REQ** vào `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` sau khi phân tích xong (Bước 6.6)
- **PHẢI viết bằng Tiếng Việt**, format Markdown, xuất Artifact
- **PHẢI copy hình ảnh** vào thư mục artifacts nếu cần embed trong artifact

## Mối quan hệ với workflows khác

| Sau khi phân tích xong | Workflow tiếp theo |
|---|---|
| Cần sinh test cases nhanh | `/generate-testcases-from-requirements` |
| Cần sinh test cases bài bản (RBT 6 bước) | `/generate-testcases-manual-rbt` |
| Cần sinh automation scripts | `/generate-automation-from-testcases` |
| Cần phân tích cross-module | `/generate-cross-module-test-plan` |
| Ticket có đính kèm spec API (OpenAPI, Postman, file mô tả endpoint) | Phân tích ticket ở đây, **đặc tả đính kèm** chạy `/generate-requirements-from-api` để REQ của từng endpoint vào tài liệu module |
