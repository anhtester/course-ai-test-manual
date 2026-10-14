---
name: skills-requirements-analyzer
description: Kỹ năng phân tích website, app mobile (Android/iOS/Flutter), đặc tả API (OpenAPI/Swagger/Scalar/Postman/tài liệu API) hoặc tài liệu nghiệp vụ và sinh ra tài liệu Yêu cầu (Requirements Document/User Stories) chuẩn mực — có gán mã REQ ID truy vết được, một prefix cho mỗi nghiệp vụ dù chạy trên bao nhiêu nền tảng, phát hiện Ambiguity/Risk, kèm ma trận phân quyền và trạng thái.
---

# Kỹ năng Phân tích Yêu cầu (Requirements Analyzer)

Kỹ năng này cung cấp các hướng dẫn chi tiết để AI (Claude Code) có thể chuyển đổi giao diện web (DOM/HTML), giao diện app mobile (UI hierarchy qua Appium), đặc tả API, hoặc tài liệu (Jira ticket, .doc, user story) thành tài liệu Yêu cầu rõ ràng, chi tiết, **truy vết được**, phục vụ trực tiếp cho QA, Tester và Developer.

## 1. Mục tiêu cốt lõi
- Xây dựng tài liệu yêu cầu bám sát thực tế hệ thống đang chạy hoặc tài liệu gốc.
- **Mọi yêu cầu đều có mã REQ ID** — để test cases, automation và RTM truy vết ngược được.
- Đảm bảo tính bao quát: Happy Path, Edge Cases, phân quyền, trạng thái, thông báo lỗi.
- Phát hiện và ghi nhận có hệ thống các điểm mơ hồ (Ambiguity) và rủi ro (Risk).

---

## 2. Quy Ước Đánh Mã (BẮT BUỘC — dùng xuyên suốt toàn chuỗi)

| Loại | Format | Ví dụ | Dùng ở đâu |
|---|---|---|---|
| **Requirement** | `REQ-<MODULE>-<SỐ>` | `REQ-LOGIN-01` | Từng yêu cầu chức năng, business rule, validation rule |
| **Story** | `STORY-<MODULE>-<SỐ>` | `STORY-PRJ-03` | Nhóm REQ thành đơn vị công việc (backlog view) — xem mục 5 |
| **Ambiguity** | `AMB-<MODULE>-<SỐ>` | `AMB-LOGIN-03` | Điểm mơ hồ cần clarify với PO/BA |
| **Risk** | `RISK-<MODULE>-<SỐ>` | `RISK-PRJ-02` | Rủi ro kiểm thử |

**Quy tắc:**
- Mỗi yêu cầu **đủ nhỏ để test được độc lập** — nếu 1 câu chứa nhiều rule, tách thành nhiều REQ
- REQ ID **không đổi** sau khi đã phát hành tài liệu (chỉ thêm mới, không đánh lại số)
- Test cases sinh ra ở bước sau **PHẢI ghi REQ ID** vào cột `REQ ID` — đây là mắt xích để kiểm chứng "đủ case" và chạy `/generate-traceability-matrix`
- **AMB và RISK mang prefix module, đánh số RIÊNG từng module từ `01`** — giống hệt REQ. Module mới luôn bắt đầu `AMB-<MODULE>-01` · `RISK-<MODULE>-01`, **không** nối tiếp số của module khác. ❌ `AMB-15` trần: mã không có prefix thì hai module đánh số độc lập sẽ va nhau (đã xảy ra — `AMB-15` vừa là câu hỏi của `LOGIN` vừa là của `CUST`, grep ra hai nghĩa)
- Hệ thống thứ hai trong namespace `_<hệ-thống>/` thêm mã hệ thống như REQ: `AMB-<HỆ_THỐNG>-<MODULE>-<SỐ>` · `RISK-<HỆ_THỐNG>-<MODULE>-<SỐ>`
- AMB/RISK **cấp hệ thống** (tầng khám phá, cắt ngang nhiều module, chưa quy được về module nào): `AMB-SYS-<SỐ>` · `RISK-SYS-<SỐ>` cho hệ thống mặc định, `AMB-<HỆ_THỐNG>-<SỐ>` cho namespace. `SYS` là prefix **dành riêng**, không cấp cho module. Khi quy được về module → mở mã mới ở module đó, dòng cũ ghi `→ chuyển thành AMB-<MODULE>-NN`
- Nhắc tới AMB/RISK ở tài liệu **cắt ngang** (danh mục README, test plan, báo cáo) → luôn ghi **đủ mã có prefix**, không viết tắt `AMB-15`

**Phân vai REQ vs STORY (quan trọng):**
- `REQ` là **lớp truy vết duy nhất** — bất biến, mọi test case / automation / RTM đều neo vào đây
- `STORY` chỉ là **lớp nhóm việc** — được phép đổi tên, gộp, tách lại theo cách team vận hành mà **không** ảnh hưởng tới REQ ID hay test case đã viết
- ❌ **TUYỆT ĐỐI KHÔNG** đánh lại số REQ khi tách file hay gom Story. REQ ID gắn với *hành vi*, không gắn với *vị trí trong tài liệu*

### 2.1. Nối tiếp mã REQ giữa các lần chạy (BẮT BUỘC — chống đụng mã)

Cùng một module có thể được phân tích **nhiều lần bằng nhiều workflow khác nhau** (`/generate-requirements-from-website` từ UI, `/analyze-requirement-document` từ Jira ticket, `/fetch-jira-requirements`…). Nếu mỗi lần đều đánh lại từ `01`, các dải mã sẽ đụng nhau và **RTM map sai hoàn toàn**.

**Quy trình bắt buộc TRƯỚC KHI gán REQ ID đầu tiên:**

1. **Đọc danh mục toàn hệ thống — LUÔN LÀM ĐẦU TIÊN:**
   ```
   docs/requirements/README.md
   ```
   Bảng danh mục cho biết: module nào đã có tài liệu · **prefix nào đã bị chiếm** · mã kế tiếp của từng module. Module mới **phải chọn prefix chưa có trong danh sách**.
   > ⚠️ **File không tồn tại (dự án mới)** → **tạo ngay** theo mục 5.7.1 trước khi đi tiếp. KHÔNG bỏ qua bước này rồi ghi thẳng tài liệu module.
2. **Kiểm tra tài liệu module:**
   ```
   docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md
   ```
3. **Nếu CHƯA có** → đánh số từ `01`.
4. **Nếu ĐÃ có** → tìm số REQ lớn nhất đang dùng và **đánh tiếp từ số kế tiếp**. Ví dụ module đã dùng tới `REQ-PRJ-65` → yêu cầu mới bắt đầu từ `REQ-PRJ-66`.
5. **Ghi rõ nguồn** vào cột `Nguồn` của mỗi REQ mới: `Ticket ABC-123` / `UI thực tế` / `AC#2` — để biết mã đến từ đợt phân tích nào.
6. **Cập nhật ngược 2 nơi** (thiếu một trong hai là lần chạy sau đánh sai số):
   - Bảng metadata của tài liệu module:
     ```markdown
     | Dải mã đã dùng | REQ-PRJ-01 → REQ-PRJ-78 (đợt 1: UI recon 01→65 · đợt 2: ticket ABC-123 66→78) |
     | Mã kế tiếp     | REQ-PRJ-79 — KHÔNG đánh lại từ 01 |
     ```
   - **Bảng danh mục** trong `docs/requirements/README.md`: cột `REQ đã dùng`, `Mã kế tiếp`, `AMB treo`, `Cập nhật`

**Ràng buộc bổ sung:**
- ❌ Không "tái sử dụng" mã của REQ đã bị xoá — mã đã cấp là **vĩnh viễn chết**, kể cả khi yêu cầu đó không còn
- ✅ `<MODULE>` phải **giống hệt** giữa các đợt (`PRJ` thì mãi là `PRJ`, không lúc `PRJ` lúc `PROJECT`)
- ✅ Cùng nguyên tắc này áp cho `AMB-<MODULE>-XX` và `RISK-<MODULE>-XX` — đánh tiếp **trong module**, không đánh lại, không nối số của module khác
- ⚠️ Nếu yêu cầu mới **thay đổi hành vi của một REQ cũ** (không phải thêm mới): **giữ nguyên mã cũ**, sửa nội dung, và ghi chú `Cập nhật bởi ticket ABC-123` — không cấp mã mới cho cùng một hành vi

### 2.2. Một nghiệp vụ = một prefix, dù chạy trên bao nhiêu nền tảng (BẮT BUỘC)

Một hệ thống thường có nhiều **mặt**: web, app Android/iOS, API công khai cho đối tác. Cùng một nghiệp vụ (Đăng nhập, Khách hàng, Đơn hàng) xuất hiện ở nhiều mặt. Tách prefix theo nền tảng sẽ nhân đôi REQ cho **cùng một rule** — sửa rule ở web quên sửa ở app, RTM báo phủ đủ trong khi hai bản đã lệch nhau.

| Quy tắc | Chi tiết |
|---|---|
| **Prefix gắn với nghiệp vụ, không gắn với nền tảng** | Đăng nhập trên web, app hay API đều là `LOGIN`. ❌ `LOGIN_WEB` · `LOGIN_APP` · `MLOGIN` · `APILOGIN` |
| **Một module = một thư mục, một index, một dải mã** | Web, mobile, API cùng nghiệp vụ chung `docs/requirements/<module>/` và chung dải REQ; nội dung riêng từng nền tảng nằm ở tầng `web/` · `mobile/` · `api/` (mục 5.3). ❌ `docs/requirements/login_mobile/` · ❌ dải `REQ-LOGIN-M01` |
| Cột **`Nền tảng`** | Giá trị: `Web` · `Android` · `iOS` · `API`, nối bằng ` · ` khi áp nhiều nền tảng, hoặc `Tất cả` = mọi nền tảng module đang có. **Bắt buộc** ở REQ trong index (REQ dùng chung) và ở file `mobile/` (phân biệt Android / iOS); file `web/` và `api/` không cần — nền tảng suy từ file |
| Rule **giống nhau** trên ≥ 2 nền tảng → **1 REQ, nằm ở index** | "Khoá tài khoản sau 5 lần sai" · `Tất cả` — thường là rule nằm ở server |
| Rule **khác nhau** → **REQ riêng cho từng nền tảng, nằm ở file nền tảng đó** | Web giữ lại email sau khi đăng nhập lỗi, app xoá trắng → 1 REQ ở `web/`, 1 REQ ở `mobile/`. Mỗi REQ vẫn là một rule kiểm độc lập (4.3.4) |
| Khác biệt **không rõ chủ đích** → `AMB-<MODULE>-XX` | Message lỗi web khác app · độ dài tối đa khác nhau · API nhận giá trị mà UI chặn → hỏi PO *"cố ý hay lỗi?"*. Mặc định nghi là lỗi |
| **Chưa khảo sát nền tảng nào thì không khai REQ cho nền tảng đó** | REQ khảo sát trên web ghi `Web`, **không** ghi `Tất cả` khi chưa mở app. Nền tảng chưa kiểm là `❔`, không phải "chắc cũng giống" — cùng tinh thần "không suy role B từ role A" (3.1.2) |
| Mở rộng REQ sang nền tảng mới | Kiểm chứng xong trên nền tảng mới → **chuyển dòng REQ cũ** từ file nền tảng lên index và sửa cột `Nền tảng` (**giữ nguyên mã**, không cấp mã mới), ghi Nhật ký (6.9) loại `🟢 Thêm` · tóm tắt *"Mở rộng nền tảng: + Android — chuyển lên index"* · cột `TC cần xử lý` = `viết mới cho Android`. Evidence cũ **ở lại** `web/evidence/` — ảnh thuộc nền tảng đã chụp ra nó |

> **Ngoại lệ duy nhất:** hệ thống **khác hẳn nghiệp vụ** nằm chung repo → namespace `_<hệ-thống>/` (CLAUDE.md mục 6b). App mobile hay API của **cùng** hệ thống **không** phải hệ thống khác — không mở namespace cho chúng.

---

## 3. Quy trình trích xuất thông tin

Skill có **4 nhánh trích xuất** tuỳ theo nguồn đầu vào. Xác định nhánh **trước khi bắt đầu**:

| Nguồn đầu vào | Nhánh | Đặc điểm |
|---|---|---|
| Website đang chạy | **3.1 — UI Recon (web)** | Sự thật nằm ở hệ thống; xác minh bằng tương tác thật qua Playwright MCP |
| Jira ticket, .docx, .pdf, .xlsx/.csv, .xml, user story | **3.2 — Document Analysis** | Sự thật nằm ở văn bản; xác minh bằng trích dẫn nguyên văn |
| Có cả hai, tài liệu phủ **đầy đủ** module | Chạy **3.2 trước** (nắm ý định) → **3.1 sau** (đối chiếu thực tế) | Mọi lệch pha giữa 2 nguồn là ambiguity, xem 3.3 |
| Có cả hai nhưng tài liệu **chỉ phủ một phần** | **3.3.1 — Tài liệu bán phần** | Tình huống phổ biến nhất ở hệ thống thiếu tài liệu. Phải chia vùng trước khi recon |
| Đặc tả API — OpenAPI/Swagger UI/Scalar/Redoc, Postman collection, **tài liệu API dạng .docx/.pdf** | **3.4 — API Spec Analysis** | Spec là **lời khai**, response thật mới là **sự thật**. Xác minh bằng gọi thật có kiểm soát |
| App mobile đang chạy — Native Android/iOS, Flutter, Hybrid | **3.5 — Mobile Recon** | Sự thật nằm ở app trên thiết bị; xác minh qua UI hierarchy bằng Appium MCP |

> 📌 **Hệ thống nhiều mặt** (web + app + API): mỗi nhánh ghi REQ của nền tảng mình vào tầng `web/` · `mobile/` · `api/` của **cùng** thư mục module, REQ dùng chung ≥ 2 nền tảng lên index `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` — áp mục **2.2** và **5.3**. Nhánh chạy sau **đọc REQ đã có trước** để nối mã và nhận ra rule trùng, không sinh REQ song song.

> ⚠️ **Chưa biết hệ thống có những module nào** → đây chưa phải việc của skill này. Chạy `/discover-system` trước để có bản đồ hệ thống + prefix, rồi mới recon từng module (xem mục **5.8**).

### 3.1. Nhánh UI Recon — phân tích website thực tế

1. **Phân tích Khung giao diện (Layout):** Header, Footer, Sidebar, Main Content, Breadcrumb
2. **Thu thập Form & Inputs:** tất cả `input`, `select`, `textarea` — ghi nhận `type`, `required`, `maxlength`, `minlength`, `pattern`, giá trị mặc định
3. **Thu thập Actions:** chức năng từng nút (Save, Submit, Cancel, Delete, Edit), alerts/toasts/validation messages khi tương tác lỗi
4. **Trích xuất Workflows:** sự phụ thuộc giữa các thành phần (VD: nút Submit chỉ enable khi tích Checkbox)
5. **Thu thập Phân quyền (nếu có nhiều role):** đăng nhập từng role (nếu được cung cấp account) — ghi nhận role nào thấy gì / làm được gì
6. **Thu thập Trạng thái (nếu entity có status):** các trạng thái quan sát được và hành động cho phép ở từng trạng thái
7. **Thu thập Thông báo lỗi:** trigger từng validation để ghi nhận nguyên văn error message
8. **Đọc tầng network** (mục **3.1.1**) — bắt buộc khi hệ thống không có tài liệu
9. **Thăm dò phân quyền khi thiếu account** (mục **3.1.2**) — chỉ khi không đủ account cho mọi role

### 3.1.1. Thu thập từ tầng Network (BẮT BUỘC khi hệ thống không có tài liệu)

DOM chỉ cho biết **hệ thống đang hiển thị gì**. Tầng network cho biết **hệ thống thật sự làm gì** — đây là nguồn quý nhất khi không có một dòng tài liệu nào, và là thứ duy nhất tiết lộ được phần backend mà UI giấu đi.

Bật `browser_network_requests` trong suốt quá trình recon (không chỉ lúc load trang — **phải bật khi submit form** mới bắt được response lỗi).

| Loại request | Dữ kiện rút ra được | Ghi vào mục nào |
|---|---|---|
| `GET /api/<entity>` — danh sách | Tên trường thật của entity · trường **có trong data nhưng không hiển thị** trên bảng · cấu trúc phân trang (`page`/`size`/`total`) | 6.3 Field Spec · 6.2 REQ về phân trang |
| `GET /api/<entity>/{id}` — chi tiết | Toàn bộ schema entity · quan hệ tới entity khác (`customer_id`, `owner`) | 6.3 · Bản đồ phụ thuộc |
| `POST`/`PUT` — payload submit | Tên field thật ↔ nhãn hiển thị · field ẩn được gửi kèm · **kiểu dữ liệu thật** (số vs chuỗi) | 6.3 (cột ánh xạ nhãn ↔ field) |
| Response **4xx khi submit sai** | ⭐ **Validation server-side** — rule mà UI không chặn · **nguyên văn message** trong body (thường khác message hiện trên UI) | 6.4 Validation Messages |
| Response chứa enum | Danh sách trạng thái đầy đủ — kể cả trạng thái **chưa từng thấy trên UI** | 6.6 Ma trận Trạng thái |
| Endpoint gọi khi mở dropdown | Nguồn dữ liệu của dropdown (bảng master nào) · **tổng số option thật** so với số đang hiển thị | 6.3 · phát hiện dropdown bị giới hạn |
| Endpoint **có nhưng không UI nào gọi** | Tính năng chưa build hoặc đã gỡ giao diện | 6.2 với trạng thái ⚪ + `AMB-<MODULE>-XX` |
| Response `403` khi đổi role | Ranh giới phân quyền thật ở tầng server | 6.5 Ma trận Phân quyền |

**Luật ghi nhận — bắt buộc:**

| Tình huống | Xử lý |
|---|---|
| Rule chỉ có ở server, UI **không** chặn | Vẫn gán REQ, cột `Nguồn` ghi `API response · POST /api/x · 422` + mở `AMB-<MODULE>-XX` hỏi: chặn ở UI hay cố ý để server chặn? |
| Message API **khác** message hiện trên UI | Ghi **cả hai nguyên văn** vào 6.4 + `AMB-<MODULE>-XX` 🔴 — đây là bug tiềm ẩn, không phải ambiguity thường |
| Field có trong payload nhưng **không** có trên form | Gán REQ trạng thái ⚪ hoặc mở `AMB-<MODULE>-XX` — **không** im lặng bỏ qua |
| Endpoint không có UI | Ghi nhận, **KHÔNG** gọi thử để "kiểm chứng" |

🚫 **Cấm tuyệt đối:** gọi API trực tiếp (curl/fetch/`browser_evaluate` gọi endpoint) để dò hành vi. Recon chỉ được **quan sát thụ động** request do UI tự phát sinh. Gọi thẳng API là hành vi kiểm thử xâm nhập, càng nguy hiểm trên môi trường dùng chung — và request tự tay tạo ra **không** chứng minh được điều gì về hành vi của UI.

📌 Cột `Nguồn` cho dữ kiện lấy từ network ghi rõ: `API · POST /api/customers · 422` — đủ để người review mở lại tab Network mà đối chiếu.

### 3.1.2. Phân quyền khi không đủ account cho mọi role

Thực tế hay gặp: hệ thống có 5 role nhưng QA chỉ đưa 1 account admin. Không được vì thế mà **bỏ trống** mục 6.5, cũng không được **bịa** ma trận.

**Bước 1 — Xác định hệ thống có những role nào** (không cần account vẫn làm được):

| Nguồn | Cách lấy |
|---|---|
| Màn hình quản lý người dùng / phân quyền | Đọc dropdown chọn role, bảng danh sách role — thường lộ đủ tên role |
| Màn hình cấu hình quyền | Ma trận quyền của chính hệ thống — **nguồn tốt nhất**, chép nguyên trạng |
| Response API chứa `role` / `permissions` | Mục 3.1.1 |
| Tài liệu QA cung cấp (nếu có) | Mục 3.2 |

**Bước 2 — Suy diễn có kiểm soát, theo 3 mức bằng chứng:**

| Mức | Cách có được | Ghi vào ma trận |
|---|---|---|
| ✅ **Đã kiểm chứng** | Đăng nhập đúng role đó và thử thật | `✅` / `❌` bình thường |
| ⚠️ **Suy từ cấu hình** | Đọc từ màn hình phân quyền của hệ thống, chưa đăng nhập thử | `⚠️✅` / `⚠️❌` — kèm chú thích nguồn |
| ❔ **Chưa có căn cứ** | Không có account, không có màn hình cấu hình | `❔` + **bắt buộc** mở `AMB-<MODULE>-XX` 🔴 |

**Bước 3 — Với account đang có, vẫn khai thác được:**
- Menu/nút **bị ẩn** vs **hiện nhưng disabled** — hai cái này nghĩa khác nhau, phải đọc DOM để phân biệt (ảnh không cho biết)
- Truy cập thẳng URL của chức năng bị ẩn → quan sát phản ứng (chuyển hướng · trang 403 · vẫn vào được). ⚠️ Chỉ thử với **URL chỉ đọc**, tuyệt đối không thử URL xoá/sửa
- So sánh response `permissions` trả về lúc đăng nhập với danh sách quyền đầy đủ ở màn hình cấu hình

**Luật cứng:**
- ❌ **Không** suy quyền của role B từ hành vi của role A — "admin làm được nên manager chắc cũng làm được" là bịa
- ❌ Ô `❔` **không được** làm tròn thành `❌`. "Chưa kiểm chứng" ≠ "không có quyền"
- ✅ Cuối ma trận 6.5 **bắt buộc** có dòng tổng: `Đã kiểm chứng: N ô · Suy diễn: M ô · Chưa rõ: K ô` — người đọc biết ngay tin được bao nhiêu phần
- ✅ Mỗi role **chưa có account** = 1 `AMB-<MODULE>-XX` 🔴 riêng, nội dung: *"Xin account role X để kiểm chứng N ô đang suy diễn"*

### 3.2. Nhánh Document Analysis — phân tích tài liệu có sẵn

#### Bước 0 — Đọc được file đã, đừng đoán

Mỗi định dạng có cách đọc riêng. **KHÔNG** dùng `Read` thẳng cho định dạng nhị phân:

| Định dạng | Cách xử lý bắt buộc |
|---|---|
| `.md`, `.txt`, `.html`, `.xml`, `.json` | `Read` trực tiếp. File `.doc` export từ Jira thực chất là HTML → `Read` rồi bóc tag |
| `.docx`, `.dotx` | **Ủy quyền cho skill `docx`** — là ZIP/OOXML, `Read` thẳng ra rác |
| `.xlsx`, `.xlsm`, `.csv`, `.tsv` | **Ủy quyền cho skill `xlsx`** |
| `.pdf` | **Ủy quyền cho skill `pdf`** |
| `.pptx` | **Ủy quyền cho skill `pptx`** |
| Ảnh (mockup, screenshot) | `Read` — công cụ hiển thị ảnh trực tiếp |
| URL Jira/Confluence | **KHÔNG tự fetch.** Route sang `/fetch-jira-requirements` + `skills-jira-integration`. Nếu MCP chưa authorize → **dừng và báo user**, tuyệt đối không bịa nội dung ticket |

> ⚠️ Nếu không đọc được file bằng bất kỳ cách nào → **báo user và dừng**. Không suy đoán nội dung từ tên file.

#### Bước 1 — Trích xuất theo thứ tự

1. **Metadata:** Ticket ID, Type, Priority, Status, Reporter, Assignee, Fix Version, Sprint, Labels, Epic cha
2. **User Story:** dạng "As a… I want… So that…" — trích **nguyên văn**, không diễn đạt lại
3. **Scope:** module/page/component bị ảnh hưởng. Ghi rõ cả phần **ngoài phạm vi** nếu tài liệu có nêu
4. **Acceptance Criteria:** gán `REQ-<MODULE>-<SỐ>` cho **từng rule đủ nhỏ để test độc lập** (theo mục 2 + 2.1)
5. **Dependencies:** ticket/feature được reference trong AC hoặc comment — đọc và tóm tắt
6. **Comments:** thường chứa quyết định nghiệp vụ mới nhất, **đè lên** phần mô tả gốc. KHÔNG được bỏ qua
7. **Attachments:** mockup, file CSV/XLSX đính kèm — xem bước 2
8. **Lịch sử thay đổi** (nếu có): AC nào được sửa gần đây → vùng rủi ro cao

#### Bước 2 — Khai thác file bảng (CSV/XLSX) — nguồn Field Spec tốt nhất

File bảng đính kèm thường **giá trị hơn cả phần mô tả**. Tìm và khai thác:

| Loại bảng | Dùng để sinh |
|---|---|
| Danh sách field/cột kèm kiểu dữ liệu, bắt buộc, độ dài | **Field Specifications** (mục 6.3) — gần như map 1:1 |
| Bảng thông báo lỗi / message key | **Validation Messages** (mục 6.4) |
| Ma trận role × chức năng | **Ma trận Phân quyền** (mục 6.5) |
| Bảng trạng thái × hành động | **Ma trận Trạng thái** (mục 6.6) |
| Data mẫu / test data | Đầu vào cho `/generate-test-data` — ghi chú lại, không đưa vào requirements |

Khi trích từ file bảng, **ghi rõ vị trí nguồn**: `<tên file> · sheet <tên> · dòng <n>`.

#### Bước 3 — Đối chiếu chéo các nguồn (BẮT BUỘC khi có ≥ 2 nguồn)

Lập bảng đối chiếu trước khi viết requirements:

| Hạng mục | Ticket mô tả | Comment | Mockup | File đính kèm | Kết luận |
|---|---|---|---|---|---|
| VD: độ dài tối đa của Tên | không nói | 255 | — | 200 | ⚠️ Xung đột → AMB |

**Thứ tự ưu tiên khi các nguồn mâu thuẫn** (dùng làm mặc định, luôn ghi rõ đã chọn nguồn nào và vì sao):

```
1. Comment/quyết định mới nhất có ghi ngày   ← mới nhất thắng
2. AC trong phần mô tả ticket                 ← cam kết chính thức
3. File đặc tả đính kèm (CSV/XLSX/DOCX)
4. Mockup/wireframe                           ← dễ lỗi thời nhất
```

❗ **Xung đột KHÔNG được tự giải quyết im lặng** — mọi mâu thuẫn đều phải thành một `AMB-<MODULE>-XX` kèm Assumption tạm, kể cả khi đã chọn được nguồn ưu tiên.

#### Bước 4 — Xử lý tài liệu thiếu (rất hay gặp)

| Tình huống | Cách xử lý |
|---|---|
| Ticket **không có AC nào**, chỉ 1–2 dòng mô tả | ❌ KHÔNG tự viết AC thay PO. Ghi nhận đúng những gì có, rồi liệt kê **danh sách câu hỏi cần clarify** dạng `AMB-<MODULE>-XX` mức 🔴 High. Nêu rõ trong Overview: *"Ticket chưa có AC — tài liệu này chưa đủ để sinh test case"* |
| AC viết dạng mơ hồ ("hoạt động đúng", "như module cũ") | Gán REQ ID bình thường **nhưng** kèm ngay 1 `AMB-<MODULE>-XX` hỏi tiêu chí cụ thể |
| Tham chiếu "giống module X" | Nếu module X đã có `<X>/REQUIREMENTS_<X>_SUMMARY.md` → trích REQ tương ứng và **link chéo**. Nếu chưa có → `AMB-<MODULE>-XX`, không tự suy diễn |
| Thiếu hoàn toàn thông tin phân quyền/trạng thái | Ghi "Không đề cập trong tài liệu" (khác với "Không áp dụng") + `AMB-<MODULE>-XX` |

### 3.3. Khi có cả tài liệu và UI thực tế

Chạy 3.2 trước để nắm **ý định**, rồi 3.1 để đối chiếu **thực tế**. Mọi lệch pha đều phải ghi nhận, phân loại rõ:

| Kiểu lệch | Nghĩa là | Xử lý |
|---|---|---|
| Tài liệu có, UI chưa có | Tính năng chưa build hoặc build thiếu | REQ vẫn giữ, ghi trạng thái `Chưa implement` |
| UI có, tài liệu không nói | Tính năng ngoài tài liệu (scope creep / di sản) | Vẫn gán REQ, nguồn ghi `UI thực tế — ngoài tài liệu` + `AMB-<MODULE>-XX` |
| Cả hai có nhưng khác nhau | Xung đột thật | `AMB-<MODULE>-XX` 🔴 High, ghi cả hai giá trị nguyên văn |

### 3.3.1. Tài liệu bán phần — chia vùng trước khi recon

Tình huống thực tế phổ biến nhất: QA đưa được **một phần** tài liệu (spec của 2/8 màn hình, file Excel chỉ có danh sách field, mockup cũ 6 tháng trước), phần còn lại phải tự khám phá.

Sai lầm hay gặp là xử lý cả module theo **một** cách: hoặc tin tài liệu rồi recon qua loa, hoặc bỏ tài liệu rồi recon lại từ đầu. Cả hai đều tốn công và đều sai.

**Bước 1 — Lập Bản đồ phủ tài liệu cho module, TRƯỚC khi mở browser:**

| Vùng chức năng | Tài liệu phủ | Mức phủ | Chiến lược recon |
|---|---|---|---|
| Form tạo mới | `field_spec.xlsx` sheet "Customer" dòng 3–28 | 🟩 Đầy đủ | **Đối chiếu** — mở form kiểm từng dòng spec, tìm lệch |
| Danh sách & lọc | Mockup `list_v1.png` (2026-02) | ⚠️ Nghi lỗi thời | **UI thắng** — recon đầy đủ, mọi lệch ghi `AMB` |
| Phân quyền | — | ⬜ Trắng | **Recon đầy đủ** như mode UI thuần |
| Import Excel | Ticket ABC-12 mô tả 3 dòng | 🟨 Một phần | **Bổ khuyết** — tài liệu cho luồng chính, recon lấy validation + error |

**Bước 2 — Recon theo đúng chiến lược từng vùng:**

| Mức phủ | Việc phải làm | Việc được rút gọn |
|---|---|---|
| 🟩 **Đầy đủ** | Mở màn hình, kiểm **từng** rule tài liệu nêu có đúng trên UI không. Lệch → `AMB` | Không cần dò lại từ đầu những rule đã ghi rõ và đã khớp |
| 🟨 **Một phần** | Recon **đầy đủ** phần tài liệu không nói (thường là: validation message, edge case, phân quyền) | Phần tài liệu đã nêu rõ và khớp UI → trích dẫn, không mô tả lại |
| ⬜ **Trắng** | Recon đầy đủ 9 bước mục 3.1 | Không rút gọn gì |
| ⚠️ **Nghi lỗi thời** | Recon đầy đủ như ⬜. Tài liệu chỉ dùng làm **danh sách câu hỏi**: "chỗ này tài liệu nói X, thực tế thế nào?" | Không rút gọn gì |

**Bước 3 — Ghi nguồn phân biệt được 4 mức** (cột `Nguồn` của mỗi REQ):

| Giá trị cột `Nguồn` | Nghĩa |
|---|---|
| `Tài liệu · <file> · <vị trí>` | Chỉ có trong tài liệu, **chưa** mở UI kiểm |
| `Tài liệu + kiểm chứng thực tế` | Tài liệu nêu, đã mở UI xác nhận khớp — **mức tin cậy cao nhất** |
| `UI thực tế` / `Kiểm chứng thực tế` | Chỉ có ở UI, tài liệu không nói |
| `API · <method> <endpoint>` | Lấy từ tầng network (mục 3.1.1) |

**Luật cứng của nhánh này:**
- ❌ **Không** dùng tài liệu bán phần để suy ra vùng nó không phủ. Spec form tạo mới **không** nói gì về form sửa — dù hai form nhìn giống nhau
- ❌ Vùng ⬜ Trắng **không** được rút gọn recon với lý do "module này chắc giống module kia"
- ✅ **Bản đồ phủ tài liệu phải nằm trong tài liệu đầu ra** (một mục ngay sau Tổng quan) — người đọc cần biết phần nào tin được từ spec, phần nào do agent quan sát
- ✅ Tài liệu ⚠️ nghi lỗi thời mà **khớp** UI → nâng lên `Tài liệu + kiểm chứng thực tế`; **lệch** → `AMB-<MODULE>-XX` kèm nguyên văn cả hai bên
- ✅ Khi `/discover-system` đã chạy: đọc `docs/requirements/_discovery/doc_inventory.md` — Bản đồ phủ tài liệu cấp hệ thống đã có sẵn ở đó, chỉ cần chi tiết hoá xuống cấp vùng chức năng

### 3.4. Nhánh API Spec Analysis — phân tích đặc tả API

Dùng cho: hệ thống **chỉ có API**, hoặc **mặt API** của hệ thống đã có web/app (khi đó REQ vào chung module theo 2.2). Workflow dùng nhánh này: `/discover-system` (tầng khám phá — 3.4.1 → 3.4.4), `/generate-requirements-from-api` (tầng module — cả 3.4), `/generate-testcases-api` (đọc lại 3.4.1 → 3.4.4 khi chưa có bản đồ API), `/generate-automation-api` (quy tắc dữ liệu 3.4.4).

> **Nguyên tắc gốc:** spec khai `403` không có nghĩa hệ thống **trả** `403`; spec khai `required` không có nghĩa server **chặn**. Spec là *lời khai*, response thật là *sự thật* — đúng quan hệ giữa tài liệu và UI ở mục 3.3.

#### 3.4.1. Lấy nguồn — phải là bản gốc, không phải bản đã qua xử lý

| Nguồn | Cách lấy spec gốc | Bẫy hay gặp |
|---|---|---|
| **URL spec trực tiếp** (`.json` / `.yaml`) | Tải thô bằng `curl -sSL -o <file>` vào `_discovery/sources/`, rồi `Read` file đó | ❌ **KHÔNG dùng `WebFetch`** — công cụ này trả nội dung đã chuyển đổi/tóm tắt, spec lớn bị cắt mà không báo lỗi, mà snapshot lại là nguồn sự thật bất biến |
| **Swagger UI** | Đọc cấu hình thật: `swagger-initializer.js` · `swagger-config` · request phát sinh khi trang load → lấy `url` hoặc `urls[]`. Chỉ thử đường mặc định (`/v3/api-docs`, `/v2/api-docs`, `/swagger.json`) khi không đọc được cấu hình | **Nhiều spec** trong dropdown `urls` (theo phiên bản hoặc theo dịch vụ) → liệt kê hết, **hỏi user phạm vi**, snapshot từng spec một. Chỉ lấy spec đang hiển thị mặc định là sót cả dịch vụ |
| **Scalar** | Thuộc tính `data-url` / `data-configuration` của thẻ `#api-reference` → URL spec. **Hoặc spec nhúng inline**: khối `<script id="api-reference" type="application/json">…</script>` hay `configuration.content` → trích nguyên khối JSON đó ra file | Trang Scalar là **renderer**, không phải spec — snapshot HTML của trang là snapshot sai |
| **Redoc** | `<redoc spec-url="…">` hoặc `Redoc.init('<url>')`. Bản standalone nhúng spec trong biến `__redoc_state` | |
| **Stoplight Elements / RapiDoc** | Thuộc tính `apiDescriptionUrl` / `spec-url` | |
| **Postman collection** (`.json` v2.x) | `Read` trực tiếp. Endpoint = `item[].request` (đệ quy qua folder) · ví dụ response ở `response[]` · auth khai ở `auth` cấp collection / folder / request — **cấp dưới đè cấp trên**, giống `security` của OpenAPI · biến `{{base_url}}` tra ở `variable[]` hoặc file environment | Collection **không có schema** — ràng buộc field chỉ thấy qua ví dụ. Không có ví dụ lỗi thì ràng buộc là `❔` |
| **Tài liệu API dạng văn bản** (`.docx` / `.pdf` / trang Confluence export) | Ủy quyền skill `docx` / `pdf` như 3.2 Bước 0 → xử lý theo **3.4.6** | Không máy đọc được — mọi dữ kiện phải trích dẫn nguyên văn kèm vị trí |
| **Trang tài liệu phải đăng nhập mới xem** | **Hỏi user** file export, hoặc tài khoản xem tài liệu (lưu `.env`) | ❌ Không tự đăng ký tài khoản hay dò đường vòng để vào |

**Sau khi lấy — kiểm trước khi dùng:**
- Snapshot đặt tên `openapi_<YYYY-MM-DD>.json` / `postman_<YYYY-MM-DD>.json`; tài liệu văn bản giữ **tên gốc**. Ghi URL nguồn + ngày tải ở bản đồ API (5.8.2)
- **Đếm số operation** (`paths` × method) trong file, so với số hiển thị trên trang tài liệu. Lệch → snapshot sai hoặc thiếu, chưa được đi tiếp
- Ghi **phiên bản đặc tả** (`swagger: 2.0` / `openapi: 3.x`) và `info.version`. Khi trích field phải **resolve `$ref`** — `$ref` không có nghĩa là "không có schema"
- Lần chạy sau: tải lại spec, so `sha256` với snapshot cũ. Khác → snapshot mới (giữ bản cũ), liệt kê operation thêm/bỏ/đổi vào Nhật ký khám phá

#### 3.4.2. Ranh giới module & prefix

| Tình huống | Cách chia module |
|---|---|
| Hệ thống **chỉ có API** | Mỗi `tag` của spec (folder của Postman, chương của tài liệu) = 1 module |
| API của hệ thống **đã có web/app** | **Ghép `tag` vào module đã có** theo nghiệp vụ — tag `Customers` ↔ module `CUST` → **cùng prefix** (2.2). Tag không khớp module nào → module mới, chốt ở checkpoint |
| Tag đặt theo kỹ thuật (`customer-controller`, `v2-internal`) | Suy nghiệp vụ từ tiền tố path (`/api/customers/...`) và entity trong schema, ghi tên tag vào cột bí danh |
| Operation **không có tag** | Nhóm theo segment đầu của path, đánh dấu `⚠️ không tag` |
| Endpoint nội bộ / tiện ích (health, metrics, seed dữ liệu test) | Gom vào một module tiện ích (`SYS`), không đẻ prefix riêng cho từng cái |

#### 3.4.3. Ma trận auth theo TỪNG operation (dễ bỏ sót nhất)

`security` khai ở cấp gốc chỉ là mặc định — **mỗi operation được ghi đè**. Operation có `security: []` là **công khai**, dù spec gốc khai `BearerAuth`. Swagger UI và Scalar đều **không** làm nổi bật khác biệt này.

```js
const congKhai = Array.isArray(op.security) && op.security.length === 0;
const theoMacDinh = op.security === undefined;   // kế thừa security cấp gốc
```

| Nguồn | Đọc auth ở đâu |
|---|---|
| OpenAPI | `op.security` → nếu `undefined` thì `security` cấp gốc |
| Postman | `auth` của request → folder → collection. `"type": "noauth"` = công khai |
| Tài liệu văn bản | Chỉ khi tài liệu nói rõ từng endpoint. Nói chung chung *"mọi API cần token"* → mỗi endpoint ghi `❔ theo mô tả chung` + kiểm chứng ở 3.4.4 |

Soi ngay: endpoint **công khai** mà trả **dữ liệu cá nhân** (user, đơn hàng, hồ sơ) → đánh 🔴, là phát hiện giá trị nhất và rẻ nhất.

Spec hầu như **không** khai role (admin/staff). Có vendor extension (`x-roles`, `x-permissions`) hoặc mô tả *"Admin only"* thì dùng, ghi nguồn. Không có → cột role của ma trận là `❔` + `AMB-<MODULE>-XX` 🔴, **không** suy từ tên endpoint.

#### 3.4.4. Kiểm chứng bằng gọi thật — luật RIÊNG của nhánh API

Khác nhánh UI (3.1.1 **cấm** gọi API trực tiếp vì UI là nguồn sự thật): ở nhánh này **không có UI**, nên gọi thật là **bắt buộc** — nhưng có kiểm soát.

**Điều kiện trước request đầu tiên:**
- Dòng **Năng lực kiểm thử của QA** ở `docs/requirements/README.md` ghi `Gọi API: ✅`. Chưa có hoặc ❌ → **không gọi**, mọi REQ dừng ở mức `Spec` (3.4.5), báo rõ ở bàn giao
- Đã chốt **môi trường** và **có dùng chung không**. Base URL + tài khoản ở `.env`

**🚨 Quy tắc dữ liệu — vi phạm đã từng xoá mất tài khoản gốc của một hệ thống demo:**

| Quy tắc | Chi tiết |
|---|---|
| **TUYỆT ĐỐI KHÔNG lấy bản ghi có sẵn làm mục tiêu ghi/xoá** | Kiểm BOLA/IDOR **phải** tự tạo **2 tài khoản của riêng mình** (`userA`, `userB`) rồi dùng token của A nhắm vào tài nguyên của B. **CẤM** lấy `id` từ API danh sách rồi `PATCH`/`DELETE` — đó là dữ liệu thật của người khác |
| **Chỉ ghi/xoá trên bản ghi do chính phiên này tạo ra** | Áp cho mọi method ghi (`POST`/`PUT`/`PATCH`/`DELETE`), kể cả khi user nói "được xoá thoải mái" |
| **Đặt tên traceable** | `auto_<module>_<timestamp>` cho mọi bản ghi sinh ra |
| **Dọn ngay sau khi xong** | Xoá hết bản ghi đã tạo trong phiên; báo cáo số tạo / số dọn / còn sót |
| **Lỡ tay đụng dữ liệu thật** | Báo user **ngay**, khôi phục tối đa, ghi mục **Sự cố** của bản đồ API: khôi phục được gì, **không** khôi phục được gì. Tạo lại y hệt **không** bằng chưa từng xoá — ID mới, bản ghi liên quan mất liên kết |

> Đây là **nguồn duy nhất** của bộ luật. `/generate-testcases-api` và `/generate-automation-api` chỉ tóm tắt 3 luật cứng rồi trỏ về đây — sửa luật thì sửa ở mục này, không chép thêm bản thứ hai.

**Nhóm probe — đọc trước, ghi sau:**

| Nhóm probe | Kiểm cái gì | Vì sao |
|---|---|---|
| GET công khai **không token** | Ma trận auth 3.4.3 có đúng không | Bắt rò rỉ dữ liệu cá nhân |
| Endpoint cần token, **không gửi token** | Có thật trả `401` không | Xác nhận hàng rào auth tồn tại |
| Tài khoản mới tự đăng ký → endpoint nhạy cảm | User quyền thấp nhất làm được gì | Lộ ra hệ thống **có** mô hình phân quyền hay không |
| Bỏ từng field `required` · bơm giá trị ngoài ràng buộc (âm, ngoài enum, quá dài, khoá ngoại không tồn tại) | Server validate thật hay chỉ khai trên giấy | Phân biệt ràng buộc **thật** với ràng buộc **trên giấy** |
| Đọc response header + `Set-Cookie` | `HttpOnly`/`Secure`/`SameSite`, header lộ phiên bản | Chỉ thấy khi gọi thật |
| Status code thực tế vs spec | `200` vs `201`, `400` vs `422` | Kỳ vọng sai là nguồn FAIL giả số 1 ở tầng TC |

Mỗi sai lệch ở tầng khám phá ghi thành **phát hiện `F-nn`** kèm bằng chứng nguyên văn (request + status + trích body, **đã che token và dữ liệu cá nhân**). Chỗ hệ thống làm **đúng** cũng ghi — đó là REQ/TC chống hồi quy.

#### 3.4.5. Trích REQ từ spec

| Dữ kiện trong spec | Thành REQ gì | Ghi chú |
|---|---|---|
| Mỗi operation — response thành công | 1 REQ: điều kiện gọi · status · **hình dạng** body chính | Status thật lệch spec → AC theo spec **và** `AMB-<MODULE>-XX` ghi cả hai nguyên văn (xem luật lệch pha dưới) |
| Mỗi field `required` (body / path / query / header) | 1 REQ mỗi field: *thiếu field → `<status>` + body lỗi* | Không gộp nhiều field vào một REQ (4.3.4) |
| Ràng buộc: `minLength` · `maxLength` · `pattern` · `enum` · `minimum` · `maximum` · `format` | 1 REQ mỗi ràng buộc; liệt kê đủ ở Field Spec (3.4.7) | Field Spec là nơi liệt kê, REQ trỏ tới dòng — không chép ràng buộc hai lần |
| Auth của operation | REQ *"không token → 401"* cho operation 🔒 · REQ *"truy cập không cần token"* cho operation 🌐 | Công khai mà trả dữ liệu cá nhân → REQ vẫn ghi đúng spec **và** mở `RISK-<MODULE>-XX` + `AMB-<MODULE>-XX` 🔴 |
| Tham số phân trang / sắp xếp / lọc | 1 REQ mỗi tham số | Giá trị mặc định chỉ ghi khi spec khai `default` |
| Schema lỗi dùng chung (error envelope) | 1 REQ cấp module về hình dạng body lỗi | |
| `enum` trạng thái + operation đổi trạng thái | Ma trận Trạng thái (6.6) | Chuyển trạng thái nào được phép — spec thường **không** nói → `AMB-<MODULE>-XX` |
| `deprecated: true` | REQ vẫn 🟢 (tính năng còn chạy) + ghi chú *"spec đánh deprecated"* + `AMB-<MODULE>-XX` hỏi lịch gỡ | Không nhầm với trạng thái 🔴 Deprecated của REQ |
| Thứ spec **không** nói: tính duy nhất · ràng buộc liên field · rule nghiệp vụ · rate limit | ❌ Không bịa REQ | `AMB-<MODULE>-XX` kèm Assumption tạm |

**Thang nguồn 4 mức cho cột `Nguồn`** (thay thang ở 3.3.1 Bước 3 khi nguồn là API):

| Giá trị | Nghĩa |
|---|---|
| `Spec · <METHOD> <path>` | Chỉ có trong spec, **chưa** gọi thật |
| `Spec + kiểm chứng thực tế · <METHOD> <path> → <status>` | Spec khai, đã gọi thật và khớp — **mức tin cậy cao nhất** |
| `Thực tế — spec không nói · <METHOD> <path> → <status>` | Chỉ quan sát được khi gọi, spec im lặng |
| `Tài liệu · <file> · <vị trí>` | Từ tài liệu API dạng văn bản (3.4.6) |

**Luật lệch pha spec ↔ thực tế:** REQ ghi theo **ý định đã công bố** (spec/tài liệu), cột `Nguồn` ghi `Spec — ❌ lệch thực tế (F-nn)`, kèm `AMB-<MODULE>-XX` 🔴 nguyên văn cả hai bên. **Không** tự hạ REQ theo hành vi thật (là che bug), cũng **không** giấu lệch pha (là để TC FAIL giả). PO trả lời AMB mới quyết định bên nào đúng.

#### 3.4.6. Tài liệu API dạng văn bản (.docx / .pdf)

Hay gặp ở dự án outsource hoặc tích hợp đối tác: không có OpenAPI, chỉ có một file Word mô tả endpoint.

1. **Đọc** bằng skill `docx` / `pdf` — không `Read` thẳng file nhị phân
2. **Tìm 4 loại nội dung:** bảng danh sách endpoint · request/response mẫu · bảng mã lỗi · mô tả xác thực
3. **Dựng Endpoint Catalog** với vị trí nguồn cụ thể: `api_spec_v3.docx · mục 4.2 · bảng 7`
4. **JSON mẫu là VÍ DỤ, không phải SCHEMA.** Field xuất hiện trong ví dụ ≠ field bắt buộc; giá trị mẫu ≠ kiểu dữ liệu duy nhất. **Không** suy `required` / kiểu / độ dài từ ví dụ → `❔` + `AMB-<MODULE>-XX`
5. **Bảng mã lỗi** trong tài liệu → Validation Messages (3.4.7), trích nguyên văn mã + message
6. ❌ **Không** sinh file OpenAPI từ tài liệu rồi đặt vào `sources/` như thể là spec gốc. Bản phác thảo để hỗ trợ automation (nếu cần) đặt ngoài `sources/` và ghi rõ *"suy từ tài liệu, không phải spec của hệ thống"*
7. Có cả tài liệu **và** spec → đối chiếu theo 3.3: tài liệu = ý định nghiệp vụ, spec = lời khai kỹ thuật, response thật = sự thật. Ba nguồn lệch nhau → `AMB-<MODULE>-XX` ghi cả ba
8. Gọi thật được (3.4.4) → kiểm chứng như spec. Không gọi được → mọi REQ dừng ở `Tài liệu · …`, **không** nâng lên mức kiểm chứng

#### 3.4.7. Mục 6 áp cho API — thay đổi so với nhánh UI

Tài liệu đầu ra theo mục 6, ghi vào **`api/requirements_<module>_api.md`** (REQ chỉ áp API) và **index** `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` (REQ dùng chung với web/mobile — mục 5.3). Khác nhánh UI ở các mục sau:

| Mục | Nhánh UI | Nhánh API |
|---|---|---|
| **6.1** metadata | Dòng `Trình duyệt khảo sát` | Thay bằng 2 dòng: **`Nguồn spec`** (URL · ngày snapshot · `openapi`/`info.version` · đường dẫn file snapshot) và **`Môi trường gọi thử`** (tên môi trường · dùng chung hay không · `Gọi API: ✅/❌`) — **không** ghi base URL có token hay tài khoản |
| **6.2** REQ | như cũ | Như cũ; module nhiều nền tảng thì có cột `Nền tảng` (2.2) |
| **6.3** Field Spec | `Field (Label) · Loại UI · Required · Ràng buộc` | **`Field (JSON path) · Vị trí (path/query/header/body) · Kiểu · Required · Ràng buộc · Operation dùng · REQ liên quan`**. Field dùng ở nhiều operation với ràng buộc khác nhau → mỗi operation một dòng |
| **6.4** Validation | Message nguyên văn từ UI | **`REQ · Điều kiện · Status · Body lỗi nguyên văn`** — trích dẫn, che dữ liệu nhạy cảm |
| **6.5** Phân quyền | Hành động × role | **Operation × (`Không token` · từng role)** — 🌐/🔒 từ spec, `✅`/`❌` khi đã gọi thật, `❔` khi chưa |
| **Mới — Endpoint Catalog** (đặt ngay sau 6.1) | — | `Method · Path · Auth · Status khai trong spec · Status thực tế · REQ bao phủ`. **Mọi operation trong phạm vi phải có ≥ 1 REQ**, hoặc ghi lý do loại khỏi phạm vi |
| **7.2.1** Evidence | Ảnh chụp | **Request/response nguyên văn** chép trong tài liệu (đã che token, cookie, dữ liệu cá nhân) — không cần ảnh |

### 3.5. Nhánh Mobile Recon — phân tích app mobile thực tế

Dùng cho app **Native Android · Native iOS · Flutter · Hybrid** chạy trên emulator/simulator/thiết bị thật, qua **Appium MCP**. Workflow dùng nhánh này: `/discover-system` (Bước 3-M — tầng khám phá, 3.5.1 + 3.5.2), `/generate-requirements-from-mobile` (tầng module — cả 3.5). Là bản mobile của 3.1 — cùng mục tiêu, khác công cụ và khác những gì quan sát được.

> Thao tác phiên, nhận diện loại app, đọc thuộc tính phần tử: skill **`skills-mobile-debug-agent`** (Bước 1–3). Quy tắc nền tảng: [`appium_rules.md`](../../rules/appium_rules.md).

#### 3.5.1. Chuẩn bị & nhận diện loại app — làm TRƯỚC khi recon

```
select_device → appium_session_management(create) → appium_get_page_source → NHẬN DIỆN LOẠI APP
```

> Phiên khảo sát chạy **nhúng trong Appium MCP** — không cần chạy Appium server riêng, không truyền `remoteServerUrl` trừ khi user đưa server/cloud. iOS chỉ khảo sát được trên **macOS** — máy Windows/Linux chỉ làm được Android. Tham số từng tool: skill `skills-mobile-debug-agent` mục *Bảng tool Appium MCP theo việc*.

| Kết quả nhận diện | Recon được gì |
|---|---|
| **Native** / **Flutter đã bật semantics** | Đầy đủ theo 3.5.2 |
| **Hybrid** | Phần native theo 3.5.2; phần WebView đổi context (`appium_context`) rồi đọc như DOM. **Bắt buộc** quay về `NATIVE_APP` sau đó |
| **Flutter CHƯA bật semantics** (chỉ một `FlutterView` rỗng) | ⚠️ **Chỉ recon được mức hình ảnh**: luồng, text hiển thị, message nhìn thấy. Cột `Nguồn` = `Quan sát ảnh — chưa đọc được phần tử`. **Không** khai thuộc tính (bắt buộc, disabled, độ dài). Mở `AMB-<MODULE>-XX` 🔴 *"Dev bật semantics"* kèm 3 câu hỏi của `skills-mobile-debug-agent` mục Flutter. **CẤM** bấm theo toạ độ để dò màn hình — nhờ user dẫn đường |

Ghi vào metadata (6.1) dòng **`Thiết bị khảo sát`** thay cho `Trình duyệt khảo sát`:

```markdown
| **Thiết bị khảo sát** | Pixel 7 emulator · Android 14 · app `2.3.1 (build 231)` · bản `release` · locale `vi-VN` · `UiAutomator2` · loại app: Flutter (semantics bật) |
| **Tầng network** | ❌ Không quan sát được — chưa dựng proxy (xem 3.5.2) |
```

#### 3.5.2. Thu thập — ánh xạ từ 9 bước của 3.1

| Bước 3.1 | Web | Mobile |
|---|---|---|
| Khung giao diện | Header · sidebar · breadcrumb | App bar/toolbar · bottom navigation · drawer · tab · nút overflow `⋮` |
| Form & input | `type` · `required` · `maxlength` · `pattern` | `class` (`EditText` / `XCUIElementTypeTextField` / `XCUIElementTypeSecureTextField`) · `password` · `hint` · `enabled` · `focused`. ⚠️ **Hierarchy KHÔNG lộ** độ dài tối đa, bắt buộc, loại bàn phím → phải **thử thật** (nhập vượt độ dài, để trống rồi gửi) và ghi kết quả vào AC |
| Actions | Nút · link | Nút · **gesture không có nút** (vuốt để xoá, kéo để làm mới, nhấn giữ) — hỏi hoặc thử, không bỏ qua |
| Workflows | | Như web · thêm **nút Back hệ thống** (Android): ở mỗi màn hình Back đi đâu, form dở dang có hỏi xác nhận không |
| Thông báo lỗi | Inline · toast DOM | Lỗi inline (text lỗi dưới ô nhập) · **Toast Android** (`//android.widget.Toast`, biến mất sau ~2–3,5 giây — đọc và chụp **ngay** sau thao tác) · Snackbar · dialog |
| Tầng network (3.1.1) | `browser_network_requests` | ❌ **Appium không thấy HTTP.** Chỉ quan sát được khi QA dựng proxy (mitmproxy / Charles / HTTP Toolkit) **và** app không pin certificate. Không có → metadata ghi `Tầng network: không quan sát được`, **không** suy validation server-side. Module có mặt web/API → REQ server-side lấy từ nhánh đó |
| Phân quyền (3.1.2) | | Như web — thang 3 mức bằng chứng, mỗi role thiếu tài khoản một `AMB` |
| Trạng thái | | Như web |

#### 3.5.3. Nhóm yêu cầu riêng của mobile — cân nhắc TỪNG dòng

Đây là những nhóm `appium_rules.md` §10 bắt phải test. Không thu ở tầng requirements thì tầng test case không có REQ để neo vào. Nhóm nào không áp dụng → ghi **"Không áp dụng"** kèm lý do, **không** bỏ trống (giống quy ước 6.5/6.6).

| Nhóm | Recon gì | Cách thử an toàn |
|---|---|---|
| **Quyền runtime** | Xin quyền gì · lúc nào · từ chối thì app làm gì · chọn "không hỏi lại" thì sao | `appium_mobile_permissions` — Android `action=update` + `permissionChangeAction=revoke` · iOS Simulator `action=reset`; đọc nội dung hộp thoại bằng `appium_alert action=get_text` (chuỗi OS — không làm assertion). iOS máy thật: nhờ user |
| **Vòng đời app** | Đưa xuống nền rồi mở lại: dữ liệu đang nhập còn không · phiên còn không | `appium_app_lifecycle action=background` (+ `seconds`) |
| **Mất mạng** | Thông báo gì · dữ liệu đang nhập có mất · có tự thử lại | ⚠️ Appium MCP **không** có tool tắt mạng. Android có `adb`: `adb shell svc wifi disable` + `svc data disable` (bật lại `enable`) · iOS / không có `adb`: nhờ user bật chế độ máy bay. Không làm được → `❔` + `AMB-<MODULE>-XX`, **không** ghi đã kiểm |
| **Xoay màn hình** | Có hỗ trợ không · xoay có mất dữ liệu | `appium_orientation action=set` |
| **Bàn phím** | Có che ô nhập/nút gửi · nút Next/Done có chuyển ô | `appium_mobile_keyboard action=is_shown` + so vị trí phần tử (`bounds` Android / `rect` iOS) khi bàn phím mở |
| **Deep link** | Scheme/host app khai báo · mở link đi tới màn hình nào · chưa đăng nhập thì sao | Lấy danh sách link: `intent-filter` trong AndroidManifest / `CFBundleURLTypes` + associated domains trong Info.plist nếu có công cụ, không có → hỏi user. Mở thử bằng `appium_app_lifecycle action=deep_link` — chỉ link **đọc** |
| **Push notification** | Loại thông báo · bấm vào đi đâu | Thường không tự tạo được → `❔` + `AMB-<MODULE>-XX`. Có thông báo sẵn thì Android xem bằng `appium_mobile_device_control action=open_notifications` |
| **Phiên bản tối thiểu / cập nhật bắt buộc** | App cũ có bị chặn không | Hỏi user — không tự hạ phiên bản app |

#### 3.5.4. Android ↔ iOS

- Recon **riêng từng nền tảng** user cung cấp. ❌ Không suy iOS từ Android (và ngược lại) — cùng luật "không suy role B từ role A"
- Khác biệt ghi theo 2.2: rule giống → 1 REQ `Android · iOS`; rule khác → REQ riêng
- Chỉ có một nền tảng → REQ ghi đúng nền tảng đó; nền tảng còn lại ghi ở mục Phạm vi là *"chưa khảo sát"*, **không** là "như Android"

#### 3.5.5. Evidence mobile — khác 7.2.1 ở đâu

| Quy tắc 7.2.1 | Áp cho mobile |
|---|---|
| Ảnh chứa trọn đối tượng | `appium_screenshot` chụp **màn hình thiết bị** — không có full-page. Màn hình dài → cuộn và chụp nhiều ảnh `_part1`, `_part2`…, ghi thứ tự trong Danh mục Evidence |
| Tên ảnh | `mobile/evidence/<android\|ios>_<màn_hình>_<trạng_thái>[_partN].png` — VD `android_login_error_toast.png`. Android và iOS chung thư mục `mobile/evidence/`, phân biệt bằng tiền tố. Hậu tố `_viewport`/`_fullpage` **không** dùng cho mobile |
| 🔒 Vệ sinh dữ liệu | **Thanh trạng thái và thông báo** hay lộ tên người gửi, nội dung tin nhắn, tên mạng Wi-Fi → bật chế độ Không làm phiền / xoá thông báo **trước** khi chụp. Không tránh được → báo user trước khi commit |
| Lưu ảnh | `appium_screenshot` **không** nhận đường dẫn — nó tự lưu file và trả về đường dẫn. **Copy** file đó vào `mobile/evidence/` với tên chuẩn; chụp riêng một phần tử thì truyền `elementUUID` (đúng luật chụp đúng phạm vi) |
| Mở lại ảnh xác nhận | Giữ nguyên — `Read` bản **đã copy** vào evidence, nhất là ảnh **toast**, rất dễ chụp hụt |
| Ảnh không thay việc đọc phần tử | Thay "đọc DOM" bằng **đọc thuộc tính qua `appium_get_element_attribute`** (`enabled`, `displayed`, `password`, `content-desc`, `bounds`) và chép số liệu vào AC. **Không** lưu cả page source vào `docs/` — thường chứa dữ liệu người dùng |

---

## 4. Framework Phát Hiện Ambiguity & Risk

### 4.1. Ambiguity (AMB-<MODULE>-XX)

Với mỗi ambiguity, ghi: **Mã · Câu hỏi · Nguy cơ nếu không giải quyết · Mức độ (🔴 High / 🟡 Medium / 🟢 Low) · Assumption tạm** (nếu không được trả lời thì test theo giả định nào).

Các hướng phát hiện:
- Từ khóa mơ hồ: "where applicable", "as needed", "similar to", "hợp lý", "v.v."
- Validation rules thiếu: min/max, format, required/optional, giá trị mặc định
- Hành vi edge case chưa quy định: lỗi mạng, concurrent access, data rỗng, timeout
- Inconsistency giữa document và mockup/UI thực tế (tên cột, format, layout)
- Threshold/config chưa xác định (VD: bao nhiêu ngày = "sắp đến hạn"?)
- Phân quyền chưa rõ: role nào được thực hiện hành động này?
- Trạng thái chưa rõ: từ trạng thái X có được chuyển sang Y không?

### 4.2. Risk (RISK-<MODULE>-XX)

Với mỗi risk, ghi: **Mã · Tên rủi ro · Mô tả · Mitigation** (cách giảm thiểu khi test).

---

## 4.3. Cổng Tự Soát REQ (BẮT BUỘC — chạy trước khi ghi file)

> **Vì sao có mục này.** Ambiguity (4.1) bắt cái **tài liệu/hệ thống không nói rõ**. Mục này bắt cái **chính agent vừa viết sai** — loại lỗi nguy hiểm hơn vì nó *trông như* đã kiểm chứng, có số liệu DOM hẳn hoi, và không workflow nào phía sau phát hiện được. Test case sinh ra từ một AC sai sẽ đỏ mà không ai biết lỗi nằm ở tài liệu.
>
> Rà **từng REQ** qua 9 câu hỏi dưới. Câu nào trả lời "không" → sửa REQ, không phải mở AMB.

### 4.3.1. Tên REQ và AC phải là **cùng một mệnh đề**

Tên REQ là thứ người viết test case đọc trước tiên — và nhiều người chỉ đọc tên. Tên hứa một đằng, AC đo một nẻo là lỗi nặng nhất của tài liệu requirements.

| ❌ Sai | Vì sao | ✅ Sửa |
|---|---|---|
| Tên: *"Không giữ lại email sau khi đăng nhập lỗi"* · AC: *"HTML trả về không có thuộc tính `value`"* | Người dùng **vẫn thấy** email vì trình duyệt tự điền. Tên mô tả hành vi người dùng, AC đo tầng HTML — hai thứ khác nhau | Đổi tên thành *"Máy chủ không trả lại giá trị email…"* và ghi rõ **cấm** assert ô rỗng trên màn hình |
| Tên: *"Hai lối đăng xuất"* · AC: *"tồn tại 2 phần tử `li.header-logout`"* | Đếm node DOM ≠ người dùng dùng được 2 lối | Kiểm khả dụng thật (4.3.5) rồi đặt tên theo kết quả |

**Luật:** đọc tên REQ, tự hỏi *"AC này có chứng minh đúng câu vừa đọc không?"* Không → sửa **tên** hoặc sửa **AC**, không để lệch.

### 4.3.2. Khẳng định phủ định phải kiểm bằng **trạng thái sạch**

Mệnh đề dạng *"không sinh X"* · *"không gửi Y"* · *"không lưu Z"* **không** chứng minh được bằng cách quan sát "giá trị không đổi".

```
❌ SAI:  Đăng nhập lần 2 → giá trị cookie không đổi → kết luận "không cấp cookie mới"
         (không phân biệt được: không cấp · cấp lại trùng giá trị · không đụng tới cái cũ)

✅ ĐÚNG: (1) xoá sạch tác tạo → (2) xác nhận đã sạch → (3) thực hiện hành động
         → (4) kiểm tác tạo có xuất hiện không
```

AC phải ghi **đủ 4 bước theo thứ tự**, để người khác chạy lại được. Thiếu bước (2) là phép thử vô hiệu — trạng thái sót từ lần chạy trước sẽ làm nhiễu.

### 4.3.3. AC không được chứa giá trị **biến thiên theo phiên**

Token · session id · CSRF token · id bản ghi vừa tạo · timestamp · số thứ tự tự tăng — chép giá trị cụ thể vào AC gây **hai** hậu quả:

1. Test case sinh ra hardcode giá trị đó → hỏng ngay lần chạy sau
2. Nếu là giá trị bí mật → **phát tán credential** (xem 7.1)

**Luật:** ghi **hình thái**, không ghi giá trị. `<16 ký tự hex>` · `a:2:{s:7:"user_id";s:1:"<id>";…}` · `độ dài = 32`. Cần khẳng định tính duy nhất thì mô tả **quan hệ** (*"khác giá trị trước đó"*), không chép cả hai giá trị.

### 4.3.4. Một REQ = **một** rule kiểm được độc lập

Dấu hiệu nhận biết REQ đang gộp: tên chứa **"và"**, **"hoặc"**, dấu phẩy nối hai mệnh đề; hoặc AC dùng **một** input để kiểm **nhiều** rule cùng lúc.

```
❌ "Email không phân biệt hoa thường VÀ bỏ qua khoảng trắng"
   AC: nhập "  ADMIN@Example.COM  " → đăng nhập được
   → fail thì không biết rule nào hỏng

✅ REQ-a: không phân biệt hoa thường  → input "ADMIN@Example.COM"
   REQ-b: bỏ qua khoảng trắng đầu/cuối → input "  admin@example.com  "
```

Tách ra thì **giữ nguyên mã cũ** cho rule ở lại, cấp mã mới cho phần tách (mục 2.1) — không đánh lại cả cụm.

### 4.3.5. Tồn tại trong DOM ≠ **người dùng dùng được**

Đây là cái bẫy lớn nhất khi recon bằng `browser_evaluate`. `querySelectorAll(...).length === 2` **không** có nghĩa người dùng có 2 lựa chọn: phần tử có thể bị ẩn theo responsive, bị `display:none` ở tổ tiên, nằm ngoài luồng bố cục, hoặc bị phần tử khác che.

**Trước khi khai một phần tử là "người dùng thao tác được", BẮT BUỘC đọc thêm:**

| Kiểm | Cách đọc | Ý nghĩa khi sai |
|---|---|---|
| Có được render không | `el.offsetParent === null` | `null` → **không** render (hoặc `position:fixed`) |
| Kích thước thật | `getBoundingClientRect()` | `0×0` → không bấm được |
| Tổ tiên nào ẩn | Duyệt ngược `parentElement`, đọc `getComputedStyle().display` | Chỉ ra **lý do** ẩn: responsive · quyền · trạng thái |
| Viewport đang đo | `innerWidth × innerHeight` | Kết luận chỉ đúng với **viewport đó** — phải ghi vào AC |

Phần tử chỉ hiện ở viewport khác → **không** kết luận thay cho viewport đó. Mở một `AMB-<MODULE>-XX` yêu cầu recon riêng, đừng suy diễn.

**Nhánh Mobile (3.5) — cùng cái bẫy, khác thuộc tính:** có node trong hierarchy ≠ người dùng bấm được. Đọc `displayed` · `enabled` · `bounds` (kích thước `0×0`, hoặc nằm ngoài màn hình) · có bị **bàn phím** hay dialog che không. Kết luận chỉ đúng với **thiết bị + hướng màn hình** đang đo — ghi vào AC.

**Kèm theo — bẫy locator do cấu trúc lồng:** trước khi ghi *"mục cuối cùng của X"*, đếm phần tử **lồng bên trong**. `X li:last-child` bắt cả `<li>` lồng ở submenu; `X > li:last-child` mới là con trực tiếp. Ghi rõ dấu `>` vào AC, kèm số phần tử lồng đếm được.

### 4.3.6. Chuỗi do **trình duyệt / hệ điều hành** sinh không phải hành vi ứng dụng

Thông báo validation mặc định của HTML5, tiêu đề trang lỗi mặc định, hộp thoại `alert/confirm` gốc, định dạng ngày theo locale — tất cả **đổi theo trình duyệt, phiên bản và ngôn ngữ hệ điều hành**.

**Luật:** được phép ghi lại nguyên văn để tham khảo, nhưng **phải** kèm tên + phiên bản trình duyệt đã quan sát, và **ghi rõ cấm dùng làm assertion**. AC chỉ được assert phần ứng dụng kiểm soát (`checkValidity() === false`, request có được gửi đi không).

Bảng metadata của tài liệu (6.1) **phải** có dòng **Trình duyệt khảo sát** ghi rõ tên + viewport.

**Nhánh Mobile (3.5):** hộp thoại xin quyền, date/time picker hệ thống, bàn phím, thông báo "App không phản hồi", chuỗi của share sheet — đều do **hệ điều hành** sinh, đổi theo phiên bản OS, hãng máy và ngôn ngữ máy. Cùng luật: được ghi tham khảo kèm **OS + phiên bản + hãng máy**, cấm dùng làm assertion; dòng **Thiết bị khảo sát** thay cho Trình duyệt khảo sát.

### 4.3.7. Không assert khớp tuyệt đối lên giá trị có **phần động**

`document.title` mang tiền tố đếm thông báo · `body.className` mang token theo trình duyệt hoặc theo cấu hình · id sinh động · text có chèn số đếm.

**Luật:** đọc **giá trị đầy đủ** rồi tự hỏi *"phần nào có thể đổi giữa hai lần chạy hoặc hai môi trường?"* AC ghi `**chứa** <phần bất biến>` kèm ghi chú phần nào là động và vì sao. Ghi `= "<giá trị hôm nay>"` là bẫy cho lượt sinh TC.

### 4.3.8. Tính năng sinh ra **tác tạo** phải kiểm chứng tác tạo **có tác dụng**

Cookie ghi nhớ · email gửi đi · tệp xuất ra · bản ghi lịch sử · thông báo đẩy — recon rất dễ dừng ở *"đã được tạo ra"* rồi coi là xong. Nhưng **giá trị nghiệp vụ nằm ở chỗ nó dùng được**, và đó mới là thứ có thể hỏng âm thầm.

**Luật:** mỗi tác tạo cần **tối thiểu 2 REQ** — một cho *được tạo đúng hình thái*, một cho *dùng được đúng mục đích*. Không kiểm chứng được vế thứ hai thì vẫn **phải** cấp REQ ở trạng thái ⚪ kèm `AMB-<MODULE>-XX`, tuyệt đối không im lặng bỏ qua. Im lặng bỏ qua khiến cả tính năng không có test case nào mà bảng độ phủ vẫn báo xanh.

### 4.3.9. Mã trạng thái / hành vi kỹ thuật bất thường phải **nghi ngờ nhất quán**

Mã HTTP lệch quy ước (chuyển hướng xác thực trả `307` thay vì `302/303`; body ghi `419` nhưng header trả `403`), phản hồi rỗng, `500` ở luồng người dùng chạm tới — đều là dấu hiệu.

**Luật:** đã mở AMB cho một bất thường thì **mọi** bất thường cùng loại trong tài liệu cũng phải được đối xử như vậy. Nghi ngờ chỗ này mà chép nguyên chỗ kia là mâu thuẫn nội tại. Chưa loại trừ được khả năng do **công cụ đo** ghi nhận sai thì AC không được assert giá trị đó — assert cái quan sát được chắc chắn (điểm dừng, nội dung hiển thị).

### 4.3.10. Bảng kiểm nhanh trước khi ghi file

- [ ] Mỗi REQ: tên và AC **cùng một mệnh đề** (4.3.1)
- [ ] Mọi khẳng định phủ định có **phép thử trạng thái sạch đủ 4 bước** (4.3.2)
- [ ] Không AC nào chứa token / id / timestamp **cụ thể** (4.3.3)
- [ ] Không REQ nào có "và"/"hoặc" nối hai rule trong tên (4.3.4)
- [ ] Mọi phần tử khai là "dùng được" đã đọc `offsetParent` + kích thước + viewport (4.3.5)
- [ ] Mọi chuỗi của trình duyệt đã ghi tên trình duyệt + đánh dấu cấm assert (4.3.6)
- [ ] Mọi giá trị có phần động dùng `chứa`, không dùng `=` (4.3.7)
- [ ] Mọi tác tạo có đủ REQ *tạo ra* **và** REQ *dùng được* (4.3.8)
- [ ] Bất thường kỹ thuật được nghi ngờ nhất quán trong toàn tài liệu (4.3.9)

---

## 5. Quy Mô Tài Liệu & Quy Tắc Tách File (Scaling Rule)

Module lớn sinh ra tài liệu dài, khó review và khó chia việc. Ngược lại, tách quá sớm sẽ **làm vỡ các hạng mục cắt ngang** (ma trận phân quyền, ma trận trạng thái, AMB/RISK liên module). Quy tắc dưới đây quyết định dựa trên **số REQ**, không dựa trên dung lượng file.

### 5.1. Bảng ngưỡng (BẮT BUỘC áp dụng)

Đếm số REQ **sau khi hoàn tất recon**, trước khi ghi file — **đếm theo từng file nền tảng** (tầng nền tảng luôn có, mục 5.3; ngưỡng dưới đây chỉ quyết định file nền tảng có phải chia tiếp thành Story hay không):

| Số REQ trong file nền tảng | Cấu trúc đầu ra | Mục Phân rã Epic/Story |
|---|---|---|
| **< 25** | 1 file `<nền-tảng>/requirements_<module>_<nền-tảng>.md` | ❌ Không cần |
| **25 – 80** | 1 file nền tảng | ✅ **BẮT BUỘC** (mục 6.8) — bảng Story đặt ở index |
| **> 80** hoặc thoả điều kiện tại 5.2 | Chia tiếp vào `<nền-tảng>/stories/` theo cấu trúc 5.3 | ✅ **BẮT BUỘC** ở file index |

### 5.2. Điều kiện tách bắt buộc (kể cả khi < 80 REQ)

Tách ngay nếu gặp **bất kỳ** dấu hiệu nào sau:

- Module chứa **≥ 2 entity nghiệp vụ độc lập** có vòng đời riêng (VD: `Customer` và `Contact`, `Project` và `Task`)
- Phạm vi khảo sát mở rộng sang **sub-module/tab con** có nghiệp vụ riêng (VD: phân tích cả 17 tab của Project)
- Có **≥ 2 ma trận trạng thái** khác nhau trong cùng tài liệu
- Người dùng nêu rõ team làm việc theo Jira và cần chia việc theo Story

### 5.3. Cấu trúc thư mục (áp dụng cho MỌI module, tách hay không tách)

**Mỗi module một thư mục riêng, bên trong luôn chia tầng nền tảng.** Layout chuẩn của repo:

```
docs/requirements/
├── README.md                              ← DANH MỤC toàn hệ thống (mục 5.7)
├── <module>/
│   ├── REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md           ← INDEX — TÊN FILE BẤT BIẾN · phần dùng chung + Bản đồ tài liệu
│   ├── web/                               ← TẦNG NỀN TẢNG — chỉ nhận 3 tên: web · mobile · api
│   │   ├── requirements_<module>_web.md   ← REQ chỉ áp web · Field Spec · Validation · Trình duyệt khảo sát
│   │   ├── evidence/*.png                 ← bằng chứng khảo sát web
│   │   └── stories/story_NN_<slug>.md     ← CHỈ khi file nền tảng vượt ngưỡng (mục 5.1)
│   ├── mobile/
│   │   ├── requirements_<module>_mobile.md ← REQ Android/iOS · Yêu cầu riêng mobile · Thiết bị khảo sát
│   │   └── evidence/android_*.png · ios_*.png
│   ├── api/
│   │   └── requirements_<module>_api.md   ← Endpoint Catalog · REQ chỉ API · Field Spec JSON · Nguồn spec
│   ├── analysis/                          ← phân tích ticket — CẤP MODULE (ticket thường cắt ngang nền tảng)
│   │   └── analysis_<TICKET-ID>.md
│   └── impact/                            ← Impact Report của /update-requirements-from-ticket · /generate-requirements-from-api
│       └── impact_<TICKET-ID>.md          ← input BẮT BUỘC cho /update-testcases-from-impact
```

**Quy tắc thư mục — bất biến:**

| Quy tắc | Lý do |
|---|---|
| Tên file index **luôn** `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` — chữ IN HOA, `<TÊN_MODULE>` = tên thư mục module viết HOA, `-` đổi thành `_` (VD `login` → `LOGIN`, `customers` → `CUSTOMERS`) — **không phải** prefix REQ (`CUST`) | Mọi workflow phía sau đọc theo `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`. IN HOA để index **khác hẳn** file nền tảng `requirements_<module>_<nền-tảng>.md` — nhìn là biết file tổng, không nhầm với file web/mobile/api. Đổi tên là vỡ chuỗi (mục 5.5) |
| Tên thư mục = tên module, chữ thường, không dấu | Tra cứu bằng glob `docs/requirements/*/REQUIREMENTS_*_SUMMARY.md` |
| Evidence nằm **trong** thư mục nền tảng của module (`<module>/<nền-tảng>/evidence/`) | Tài liệu và bằng chứng đi cùng nhau; ảnh web và ảnh app không lẫn vào nhau |
| **Tầng nền tảng luôn có**, kể cả module mới chỉ có một nền tảng; chỉ nhận `web` · `mobile` · `api` | Thêm nền tảng thứ hai về sau không phải di chuyển file — di chuyển là gãy link evidence. Android và iOS chung `mobile/` — tách đôi là nhân đôi tài liệu của cùng một màn hình |
| Tên file nền tảng mang hậu tố nền tảng: `requirements_<module>_<nền-tảng>.md` | Glob `docs/requirements/*/REQUIREMENTS_*_SUMMARY.md` chỉ bắt index, `docs/requirements/*/*/requirements_*.md` chỉ bắt file nền tảng; tên riêng giúp mở nhầm file cũng biết ngay đang ở nền tảng nào |
| Tài liệu cũ còn index tên `requirements_<module>.md` / `test_cases_<module>.md` (quy ước trước 21-09-2026) | Workflow đọc **nhận cả hai tên**. Lần đầu một workflow sinh/cập nhật chạm lại module → đổi tên **một lần** sang `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` / `TEST_CASES_<TÊN_MODULE>_SUMMARY.md`, sửa mọi link trỏ tới nó, ghi Nhật ký loại `✏️ Biên tập` |
| Tài liệu cũ chưa có tầng nền tảng | Không bắt buộc sửa ngay. Lần đầu một workflow sinh/cập nhật chạm lại module → chuyển **một lần**: REQ chỉ áp một nền tảng sang file nền tảng, evidence sang `<nền-tảng>/evidence/` và sửa link, mã REQ giữ nguyên, ghi Nhật ký loại `✏️ Biên tập` |
| Phân tích ticket nằm ở `<module>/analysis/` | Giữ liên kết ticket ↔ module. **KHÔNG** đặt ở thư mục toàn cục |
| Thêm module = thêm thư mục + 1 dòng ở danh mục | Không đụng gì khác trong repo |

**Phân chia nội dung giữa index và file nền tảng — quy tắc cứng:**

| Nội dung | Đặt ở đâu | Lý do |
|---|---|---|
| Metadata cấp module (dải mã, mã kế tiếp, dòng `Nền tảng`), Tổng quan, Phạm vi | **Index** | Điểm vào duy nhất |
| `## Bản đồ tài liệu` — mọi file nền tảng + file story kèm dải REQ | **Index** | Hợp đồng đọc (5.5) |
| REQ áp **≥ 2 nền tảng** (cột `Nền tảng` bắt buộc) | **Index** | Một rule một REQ — đặt ở file của một nền tảng là giấu nó khỏi nền tảng kia |
| Ma trận phân quyền, ma trận trạng thái | **Index** | Cắt ngang mọi nền tảng. Hành động chỉ có ở một nền tảng thì ghi nền tảng ngay trong tên hành động |
| Bảng Ambiguity & Risk | **Index** | Đánh số toàn module |
| Phân rã Epic/Story · Nhật ký thay đổi · NFR chung | **Index** | Cắt ngang |
| Metadata khảo sát: `Trình duyệt khảo sát` / `Thiết bị khảo sát` + `Tầng network` / `Nguồn spec` + `Môi trường gọi thử` | **File nền tảng** | Chỉ đúng cho nền tảng đó |
| Bản đồ phủ tài liệu (6.5.1) của lượt khảo sát | **File nền tảng** | Mỗi nền tảng một mức phủ tài liệu khác nhau |
| REQ chỉ áp nền tảng đó · Field Spec · Validation Messages · User Flow | **File nền tảng** | Gắn với giao diện / giao thức của nền tảng |
| Endpoint Catalog | **File `api/`** | Mục riêng nhánh API (3.4.7) |
| Yêu cầu riêng của mobile (8 nhóm — 3.5.3) | **File `mobile/`** | Mục riêng nhánh Mobile |
| Danh mục Evidence | **File nền tảng** | Ảnh nằm ở `<nền-tảng>/evidence/` |

**Phân chia nội dung khi file nền tảng bị chia tiếp thành Story — quy tắc cứng:**

| Nội dung | Đặt ở đâu | Lý do |
|---|---|---|
| Bảng metadata, Tổng quan, Phạm vi | **Index** | Điểm vào duy nhất |
| Bảng phân rã Epic/Story + ánh xạ REQ | **Index** | Bản đồ điều hướng toàn module |
| Ma trận phân quyền | **Index** | Cắt ngang mọi Story |
| Ma trận trạng thái | **Index** | Cắt ngang mọi Story |
| Bảng Ambiguity & Risk | **Index** | Đánh số theo **toàn module**, không đánh lại theo từng file |
| Yêu cầu phi chức năng | **Index** | Áp cho toàn module |
| Bảng REQ chi tiết của từng Story | **File story** | Đơn vị chia việc |
| Đặc tả trường dữ liệu (Field Spec) | **File story** tương ứng | Đi kèm form/màn hình của Story đó |
| Validation messages | **File story** tương ứng | Gắn trực tiếp với REQ trong Story |
| User Flow | **File story** tương ứng | Mỗi flow thuộc đúng 1 Story |

### 5.4. Bất biến khi tách (Invariants — kiểm tra trước khi bàn giao)

- [ ] **REQ ID giữ nguyên tuyệt đối** — không đánh lại số, không đổi prefix, kể cả khi dòng REQ chuyển giữa file nền tảng và index
- [ ] **Mỗi REQ nằm ở đúng 1 file** — index (khi áp ≥ 2 nền tảng) **hoặc** một file nền tảng (khi chỉ áp nền tảng đó), không nằm ở cả hai
- [ ] REQ ở index có cột `Nền tảng` ghi ≥ 2 nền tảng; REQ ở file `web/` / `api/` chỉ áp đúng nền tảng đó
- [ ] **Mỗi REQ thuộc đúng 1 Story** — không REQ mồ côi, không REQ nằm ở 2 Story
- [ ] **Tổng REQ trong các Story = tổng REQ đã sinh** — nêu rõ con số trong index để tự kiểm chứng
- [ ] **AMB/RISK đánh số toàn module**, chỉ đặt ở index; file story chỉ *tham chiếu*, không nhân bản nội dung
- [ ] **Hạng mục cắt ngang không bị nhân bản** vào file story
- [ ] Mỗi file story có link ngược về index; index có link tới mọi file story

### 5.5. Hợp đồng đọc cho các workflow phía sau (Consumer Contract)

Tách file **không được** làm vỡ chuỗi `/generate-testcases-manual-rbt` → `/generate-traceability-matrix` → `/generate-automation-from-testcases`. Vì vậy:

- **Đường dẫn index LUÔN là:**
  ```
  docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md
  ```
  Bất kể tài liệu có tách hay không. Mọi workflow phía sau chỉ cần biết đúng một mẫu đường dẫn này — tra được bằng glob `docs/requirements/*/REQUIREMENTS_*_SUMMARY.md`.
- **Điểm vào cấp hệ thống là `docs/requirements/README.md`** — khi không biết module nào tồn tại hoặc prefix nào đã dùng, đọc file này trước (mục 5.7).
- Index **BẮT BUỘC** có mục `## Bản đồ tài liệu` liệt kê đầy đủ file nền tảng (và file story nếu có) kèm dải REQ mà file đó chứa:
  ```markdown
  ## Bản đồ tài liệu
  | Nền tảng | File | Story | REQ bao phủ |
  |---|---|---|---|
  | Chung ≥ 2 nền tảng | chính file này — mục 6.2 | — | REQ-PRJ-01 → 05 |
  | Web | [web/requirements_projects_web.md](web/requirements_projects_web.md) | — | REQ-PRJ-06 → 40 |
  | Web | [web/stories/story_01_danh_sach.md](web/stories/story_01_danh_sach.md) | STORY-PRJ-01 | REQ-PRJ-41 → 53 |
  | Mobile | [mobile/requirements_projects_mobile.md](mobile/requirements_projects_mobile.md) | — | REQ-PRJ-54 → 66 |
  | API | [api/requirements_projects_api.md](api/requirements_projects_api.md) | — | REQ-PRJ-67 → 88 |
  ```
- Workflow phía sau đọc index trước, rồi theo bản đồ đọc **file của nền tảng đang làm** (sinh TC web → chỉ cần index + `web/`). Index không có bản đồ → tài liệu cũ một file, chưa có tầng nền tảng (xem luật chuyển đổi ở 5.3).

### 5.6. Ưu tiên convention sẵn có

Trước khi quyết định tách, **đọc `docs/requirements/README.md` và xem các module đã có**. Nếu repo đang theo một convention khác với mục 5.3, **giữ nguyên convention đó** và chỉ bổ sung mục Phân rã Epic/Story — trừ khi người dùng yêu cầu đổi. Nhất quán trong repo quan trọng hơn ngưỡng lý thuyết.

### 5.7. Danh mục toàn hệ thống — `docs/requirements/README.md`

#### 5.7.1. Khởi tạo khi chưa tồn tại (BẮT BUỘC — dự án mới)

> ⚠️ **Đây là bước dễ bị bỏ sót nhất khi bắt đầu một dự án mới.** Không có file danh mục thì bước 1 của mục 2.1 (đọc prefix đã chiếm + mã kế tiếp) **im lặng không chạy** — cơ chế chống trùng mã và nối tiếp REQ mất tác dụng mà không có cảnh báo nào.

**Trước khi ghi tài liệu module ĐẦU TIÊN của một dự án:**

1. Kiểm tra `docs/requirements/README.md` có tồn tại không
2. **Nếu CHƯA có** → tạo ngay từ template ở mục 5.7.2, với bảng danh mục **rỗng** (chỉ có dòng tiêu đề)
3. Ghi tài liệu module
4. Bổ sung dòng đầu tiên vào bảng danh mục

Áp dụng y hệt cho `docs/testcases/README.md` ở nhánh test case (xem skill `skills-rbt-manual-testing`).

#### 5.7.2. Nội dung bắt buộc

File danh mục là **điểm vào cấp hệ thống**, phải được cập nhật mỗi khi có module mới hoặc REQ mới. Nội dung bắt buộc:

| Mục | Nội dung |
|---|---|
| **1. Bảng danh mục module** | `Module · Prefix · Nền tảng · Trạng thái recon · Mức phủ tài liệu · Tài liệu · REQ đã dùng · Mã kế tiếp · AMB treo · Story · Cập nhật` |
| **Nền tảng** | Nền tảng module **đã có** (`Web · Android · iOS · API`), kèm dấu trạng thái recon riêng khi chúng lệch nhau: `Web ✅ · Android ⬜`. Danh mục cũ chưa có cột này → hiểu là chỉ có một nền tảng; bổ sung cột ở lần đầu thêm nền tảng thứ hai (mục 2.2) |
| **Trạng thái recon** | `⬜ Chưa khảo sát` · `🟨 Đang khảo sát` · `✅ Đã có tài liệu` · `⏸️ Hoãn` · `⚪ Chưa implement` — module do `/discover-system` phát hiện vào danh mục ngay ở mức ⬜, chưa cần có tài liệu |
| **Danh sách prefix đã chiếm** | Module mới **phải** chọn prefix chưa có trong danh sách — chống trùng mã giữa các module |
| **2. Trạng thái REQ toàn hệ thống** | Tổng hợp 🟢/🟡/🔴/⚪ theo từng module |
| **3. Ambiguity 🔴 High còn treo** | Danh sách chặn tiến độ, gom từ mọi module — để đưa PO một lần thay vì hỏi lẻ tẻ |
| **4. Cấu trúc thư mục chuẩn** | Copy từ mục 5.3 |
| **5. Quy trình sử dụng** | Bảng: tình huống → workflow → ghi vào đâu |
| **6. Nhật ký danh mục** | Thay đổi cấp cấu trúc (thêm module, đổi layout) |

**Ba việc file này làm được mà thư mục không làm được:**
1. Đọc **một file** là nắm toàn cảnh, không phải quét thư mục rồi mở từng tài liệu
2. **Chống trùng prefix** giữa các module
3. Gom ambiguity 🔴 High của mọi module về một chỗ — thấy ngay vấn đề lặp lại (VD: cả 3 module đều thiếu tài khoản role thấp)

### 5.8. Tầng khám phá — `docs/requirements/_discovery/`

Skill này làm việc ở **cấp module**: đã biết module tên gì, ở đâu, thì recon và sinh REQ. Nhưng với hệ thống **không có tài liệu**, câu hỏi đầu tiên lại là *"hệ thống này có những module nào?"* — đó là việc của tầng khám phá, do workflow `/discover-system` đảm nhiệm.

```
docs/requirements/
├── README.md              ← danh mục (5.7) — do /discover-system khởi tạo
├── _discovery/            ← TẦNG KHÁM PHÁ — cấp hệ thống
│   ├── system_map.md      ← INDEX BẤT BIẾN — bản đồ module · entity · phụ thuộc · risk (web + mobile)
│   ├── api_map.md         ← INDEX BẤT BIẾN của mặt API — khi hệ thống có spec API (xem 5.8.2)
│   ├── modules/           ← chỉ khi > 8 module (xem 5.8.1)
│   │   └── module_NN_<slug>.md
│   ├── doc_inventory.md   ← bản đồ phủ tài liệu (khi QA có đưa tài liệu)
│   ├── sources/           ← bản gốc tài liệu QA cung cấp · snapshot spec API
│   └── evidence/          ← 1 ảnh tổng quan mỗi module (mỗi nền tảng)
└── <module>/              ← TẦNG MODULE — skill này làm việc ở đây
```

> Hệ thống **chỉ có API** → không có `system_map.md`, điểm vào tầng khám phá là `api_map.md`. Hệ thống có cả UI lẫn API → **cả hai file**, và bảng module của `system_map.md` là nơi duy nhất ghép prefix ↔ tag API (cột `Nền tảng`).

**Phân vai — không được lấn:**

| | Tầng khám phá (`/discover-system`) | Tầng module (skill này) |
|---|---|---|
| Đơn vị làm việc | Cả hệ thống | Một module |
| Cấp mã | **Prefix** (`CUST`) | **Số REQ** (`REQ-CUST-01`) |
| Độ sâu | Module tồn tại · loại màn hình · có CRUD không | Từng field · từng rule · từng message |
| Evidence | 1 ảnh/module, chứng minh module có thật | Chuẩn đầy đủ mục 7.2.1 |
| Đầu ra | `_discovery/` + `README.md` | `<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` |

> ❌ Tầng khám phá **không được** sinh mã `REQ-XXX-NN`. Mã REQ là bất biến (mục 2); cấp mã khi chưa mở form, chưa trigger validation thì chắc chắn phải đánh lại số — đúng thứ mục 2.1 cấm.

**Cách skill này dùng tầng khám phá — làm ở đầu mỗi lần recon module:**

1. Có `_discovery/system_map.md` → đọc phần của module sắp recon: route (web) · đường đi màn hình (mobile) · loại màn hình · số tab · risk · vùng chưa xác minh. Tiết kiệm được toàn bộ bước dò đường
2. Có `_discovery/doc_inventory.md` → lấy Bản đồ phủ tài liệu của module, chi tiết hoá xuống cấp vùng chức năng theo mục **3.3.1**
2b. Có `_discovery/api_map.md` → lấy danh mục operation, ma trận auth, phát hiện `F-nn` của module; đường dẫn snapshot spec để trích schema
3. Prefix **lấy từ danh mục**, không tự đặt lại — kể cả khi thấy prefix cũ đặt chưa hay
4. Recon xong → cập nhật cột `Trạng thái recon` trong `README.md` sang ✅, và ghi 1 dòng vào Nhật ký khám phá của `system_map.md` nếu phát hiện lệch so với bản đồ

**Không có `_discovery/` thì sao?** Vẫn recon module bình thường — tầng khám phá là bước tăng tốc, không phải điều kiện bắt buộc. Nhưng nếu user hỏi *"hệ thống có gì"* thay vì *"module X có gì"* → **route sang `/discover-system`**, đừng tự crawl rồi sinh REQ lẫn lộn hai tầng.

#### 5.8.1. Bản đồ khám phá bị tách file — cách đọc

Hệ thống > 8 module thì `/discover-system` tách bản đồ thành nhiều file. Quy tắc đọc **giống hệt** hợp đồng ở mục 5.5:

- **Điểm vào luôn là `docs/requirements/_discovery/system_map.md`** — tên bất biến, dù tách hay không
- Index có mục `## Bản đồ tài liệu` → đọc tiếp file trong `modules/` để lấy chi tiết module cần recon. Không có mục đó → hiểu là bản đồ 1 file
- **Một file `modules/module_NN_<slug>.md` có thể chứa nhiều module** khi chúng quan hệ chặt (VD `module_01_dang_nhap_phan_quyen.md` chứa cả `LOGIN` · `USER` · `ROLE`)

⚠️ **Gộp file KHÔNG gộp prefix, cũng KHÔNG gộp tài liệu requirements.** Ba module nằm chung một file khám phá vẫn sinh ra **ba** thư mục và **ba** file `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` riêng ở tầng module. Bản đồ khám phá gộp là để **đọc cho gọn**; ranh giới truy vết vẫn là **prefix**, không phải file.

| | Tầng khám phá | Tầng module |
|---|---|---|
| `LOGIN` · `USER` · `ROLE` | 1 file `module_01_dang_nhap_phan_quyen.md` | 3 file `login/REQUIREMENTS_LOGIN_SUMMARY.md` · `user/…` · `role/…` |

Bản đồ khám phá **không mang mã REQ** (mục 5.8), nên tách/gộp lại về sau là thao tác an toàn — khác hẳn tài liệu requirements, nơi REQ ID bất biến ràng buộc mọi thứ.

#### 5.8.2. `api_map.md` — bản đồ mặt API

**Nguồn duy nhất** cho nội dung file này — `/discover-system` (nhánh API) và `/generate-testcases-api` (khi chưa có bản đồ) đều ghi theo đúng mẫu dưới. Tên file **bất biến**, cùng thư mục với `system_map.md`.

| # | Mục | Nội dung |
|---|---|---|
| 0 | Bảng metadata | Tên hệ thống · loại (`chỉ API` / `mặt API của hệ thống có UI`) · phiên bản đặc tả + `info.version` · **URL nguồn spec** + ngày tải + đường dẫn snapshot · môi trường đã gọi thử · tổng số operation · phương pháp (`chỉ đọc spec` / `spec + N request gọi thật`) |
| 1 | Bảng module & prefix | Prefix · tag/folder nguồn · số operation · số 🌐 công khai · số 🔒 cần token · module UI tương ứng (nếu có — 2.2) · dải REQ · dải TC ID |
| 2 | Danh mục operation | Theo từng module: `Method · Path · Auth (theo từng operation — 3.4.3) · Status khai trong spec · Mô tả` |
| 3 | Kết quả kiểm chứng | Phát hiện `F-nn` mức 🔴/🟠/🟡 kèm request + status + trích body **đã che** — và cả những chỗ hệ thống làm đúng |
| 4 | Ambiguity | Thứ spec không trả lời được: mô hình phân quyền · ràng buộc nghiệp vụ · rate limit · giới hạn upload |
| 5 | Ghi chú kỹ thuật cho automation | Schema rỗng · nhiều content-type · token ở cookie hay header · dữ liệu rác có sẵn trên môi trường |
| 6 | Nhật ký khám phá + **Sự cố** | Một dòng mỗi lần chạy (kèm `sha256` snapshot); mục Sự cố nếu lỡ đụng dữ liệu thật (3.4.4) |

❌ **Không mã `REQ-XXX-NN` nào** trong file này — cùng luật tầng khám phá ở 5.8.

---

## 6. Cấu trúc Tài liệu Yêu cầu Đầu ra (Output Format)

> ### ⚠️ Phạm vi áp dụng — đọc trước khi dùng mục này
>
> Skill có **3 template đầu ra khác nhau** tuỳ workflow. Chọn đúng một cái, không trộn:
>
> | Workflow | Template dùng | Ghi chú |
> |---|---|---|
> | `/generate-requirements-from-website` | **Mục 6 này** — tài liệu đặc tả module | Đầu ra là `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` |
> | `/generate-requirements-from-mobile` | **Mục 6 này** + khác biệt ở **3.5** (metadata `Thiết bị khảo sát`, mục Yêu cầu riêng của mobile) | Đầu ra là `mobile/requirements_<module>_mobile.md` + index `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` — cùng thư mục module với web/API (2.2, 5.3) |
> | `/generate-requirements-from-api` | **Mục 6 này** + bảng thay đổi ở **3.4.7** | Đầu ra là `api/requirements_<module>_api.md` + index `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` — cùng thư mục module với web/mobile (2.2, 5.3) |
> | `/analyze-requirement-document` | **Template 10 mục của chính command đó** | Đầu ra là `analysis_<TICKET-ID>.md` — tài liệu phân tích ticket, KHÁC tài liệu đặc tả module |
> | `/discover-system` | **Template của chính command đó** (Bước 6) + `api_map.md` theo **5.8.2** | Đầu ra là `_discovery/system_map.md` / `api_map.md` + `README.md` — cấp hệ thống, **KHÔNG có mã REQ**. Xem mục **5.8** |
>
> Nhánh `/analyze-requirement-document` chỉ **mượn** từ skill các mục: **2 + 2.1** (đánh mã), **3.2** (quy trình trích xuất), **4 + 4.3** (AMB/RISK + Cổng Tự Soát REQ), **5** (scaling), **7.1 + 7.3** (strict rules) — **KHÔNG** dùng cấu trúc mục 6.
>
> ⚠️ **Mục 4.3 áp cho MỌI nhánh sinh REQ, không có ngoại lệ.** REQ sinh từ tài liệu cũng lệch tên/AC, cũng gộp nhiều rule vào một mã, cũng chép giá trị biến thiên — y hệt REQ sinh từ UI.
>
> Nhánh `/discover-system` mượn: **2 + 2.2** (quy ước prefix, chung prefix đa nền tảng), **3.1 + 3.1.1** (crawl UI web + network), **3.1.2** (phân quyền sơ bộ), **3.4.1 → 3.4.4** (mặt API), **3.5.1 + 3.5.2** (mặt mobile), **5.3 + 5.7 + 5.8** (thư mục, danh mục, tầng khám phá), **7.1 + 7.2 + 7.2.1** (và 7.4 / 7.5 theo mặt đang khám phá) — **KHÔNG** dùng mục 6 và **KHÔNG** cấp số REQ. Không sinh REQ nên không chạy 4.3, nhưng **vẫn phải** theo luật evidence (7.2.1) và luật cấm ghi giá trị bí mật (7.1).
>
> Riêng 2 dòng metadata `Dải mã đã dùng` / `Mã kế tiếp` ở mục 6.1 là **bắt buộc với cả hai template**, vì quy tắc nối tiếp mã (2.1) cần chúng để hoạt động.

Tài liệu format Markdown, lưu artifact (`REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`). **Nội dung bắt buộc:**

### 6.1. Bảng metadata + Tổng quan (Overview)

Mở đầu tài liệu bằng bảng metadata, trong đó **BẮT BUỘC** có 2 dòng phục vụ quy tắc nối tiếp mã (mục 2.1):

```markdown
| **Dải mã đã dùng** | `REQ-PRJ-01` → `REQ-PRJ-65` · `AMB-PRJ-01` → `AMB-PRJ-12` · `RISK-PRJ-01` → `RISK-PRJ-12` |
| **Mã kế tiếp**     | Đợt phân tích sau bắt đầu từ `REQ-PRJ-66` · `AMB-PRJ-13` · `RISK-PRJ-13` — **KHÔNG đánh lại từ 01** |
```

Với **nhánh UI Recon**, bảng metadata còn **BẮT BUỘC** thêm một dòng nữa:

```markdown
| **Trình duyệt khảo sát** | Google Chrome (Playwright MCP), viewport `1600×750`. Mọi AC dựa trên thông báo mặc định của trình duyệt **chỉ đúng với trình duyệt này** |
```

Thiếu dòng này thì không ai biết AC nào phụ thuộc trình duyệt, và mọi kết luận về hiển thị/responsive mất ngữ cảnh viewport — xem mục **4.3.6** và **4.3.5**.

Nhánh khác thay dòng này bằng: **Mobile** → `Thiết bị khảo sát` + `Tầng network` (3.5.1) · **API** → `Nguồn spec` + `Môi trường gọi thử` (3.4.7). Các dòng khảo sát này nằm ở **file nền tảng** (5.3); index chỉ giữ dòng `Nền tảng` liệt kê nền tảng module có kèm trạng thái khảo sát từng nền tảng (2.2).

Sau bảng metadata: mô tả tóm tắt tính năng, mục đích, phạm vi module (trong phạm vi / ngoài phạm vi).

### 6.2. Yêu cầu Chức năng (Functional Requirements) — CÓ MÃ REQ
Chia thành User Stories / Use Cases, **mỗi yêu cầu 1 dòng trong bảng có mã**:

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-LOGIN-01 | Đăng nhập bằng email | Là người dùng, tôi muốn... | Nhập đúng email+password → vào Dashboard | 🟢 | — | UI thực tế / AC#1 |
| REQ-LOGIN-02 | Khóa account sau 5 lần sai | ... | ... | 🟡 | 10-08-2026 · ABC-123 | AC#3 |

**Bảng mã trạng thái REQ:**

| Ký hiệu | Nghĩa | Hệ quả với test case |
|---|---|---|
| 🟢 | **Active** — đang hiệu lực, chưa từng sửa | TC giữ nguyên |
| 🟡 | **Changed** — đã bị ticket sau sửa nội dung | ⚠️ TC map vào REQ này **phải review lại** |
| 🔴 | **Deprecated** — tính năng đã bị gỡ bỏ | TC map vào REQ này **đổi sang 🗑️ Deprecated** (không xoá dòng TC). KHÔNG xoá dòng REQ, chỉ đổi trạng thái |
| ⚪ | **Chưa implement** — tài liệu có, hệ thống chưa build | TC viết trước, đánh dấu `skip` cho tới khi build xong |

**Quy tắc:**
- Cột **`Nền tảng`** đặt ngay sau `Tên yêu cầu` — **bắt buộc** ở bảng REQ của index và của file `mobile/` (mục 2.2, 5.3). Message khác nhau giữa nền tảng thì mỗi nền tảng ghi ở file của nó, **nguyên văn**, kèm `AMB-<MODULE>-XX` nếu khác biệt không rõ chủ đích
- Mặc định mọi REQ mới là 🟢, cột `Cập nhật lần cuối` để `—`
- Trạng thái ≠ 🟢 thì **BẮT BUỘC** có dòng tương ứng trong Nhật ký thay đổi (mục 6.9) — hai nơi này phải khớp nhau
- **KHÔNG BAO GIỜ xoá dòng REQ** khỏi tài liệu, kể cả khi tính năng bị gỡ. Xoá dòng là mất dấu vết, và mã REQ đó cũng không được tái sử dụng (mục 2.1)
- Với tài liệu **đã phát hành trước khi có schema này**: không cần sửa lại toàn bộ dòng. Ghi một dòng quy ước dưới bảng — *"REQ không ghi trạng thái = 🟢 Active"* — rồi chỉ đánh dấu những REQ thực sự thay đổi về sau

### 6.3. Đặc tả Trường Dữ liệu (Field Specifications)
Bảng chi tiết từng field — phần cốt lõi cho Tester:

| Field (Label) | Loại UI | Required | Ràng buộc (min/max/format/default) | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|

### 6.4. Business Rules & Validation Messages
| REQ ID | Rule / Trigger | Thông báo lỗi mong đợi (nguyên văn) |
|---|---|---|

### 6.5. Ma trận Phân quyền (nếu có nhiều role)

| Hành động | Admin | Manager | Staff | Guest |
|---|---|---|---|---|
| Xem danh sách | ✅ | ✅ | ⚠️✅ | ❌ |
| Xóa bản ghi | ✅ | ⚠️❌ | ❔ | ❌ |

**Ký hiệu mức bằng chứng** (mục 3.1.2) — bắt buộc dùng khi không đủ account cho mọi role:

| Ký hiệu | Nghĩa |
|---|---|
| `✅` / `❌` | **Đã kiểm chứng** — đăng nhập đúng role và thử thật |
| `⚠️✅` / `⚠️❌` | **Suy từ cấu hình** — đọc từ màn hình phân quyền của hệ thống, chưa đăng nhập thử |
| `❔` | **Chưa có căn cứ** — bắt buộc kèm `AMB-<MODULE>-XX` 🔴 |

**Dòng tổng bắt buộc đặt ngay dưới bảng:**
```
Tổng 21 ô = Đã kiểm chứng 13 · Suy diễn 0 · Chưa rõ 7 · Không áp dụng 1
Ô "không áp dụng" là [<hành động> × <role>] — <lý do>. Role Staff/Guest chưa có account (AMB-PRJ-07)
```

Không có dòng tổng thì người đọc không biết ma trận này tin được bao nhiêu phần. Ô `❔` **không được** làm tròn thành `❌`.

⚠️ **Các nhóm phải cộng lại đúng bằng `số hàng × số cột`.** Ô đánh `—` (không áp dụng) cũng là một nhóm phải đếm và **phải giải thích lý do** — bỏ nó ra ngoài khiến tổng không khớp, và người đọc không phân biệt được "đã cân nhắc, không liên quan" với "quên mất".

### 6.5.1. Bản đồ phủ tài liệu — bắt buộc khi có tài liệu bán phần (mục 3.3.1)

Đặt ngay sau Tổng quan (6.1). Người đọc phải biết phần nào tin được từ spec, phần nào do agent quan sát:

| Vùng chức năng | Tài liệu phủ | Mức phủ | REQ liên quan |
|---|---|---|---|
| Form tạo mới | `field_spec.xlsx` sheet "Customer" dòng 3–28 | 🟩 Đầy đủ | REQ-CUST-01 → 14 |
| Phân quyền | — | ⬜ Trắng | REQ-CUST-30 → 33 |

Module không có tài liệu nào → ghi một dòng: *"Không có tài liệu — toàn bộ REQ sinh từ khảo sát UI thực tế"*. **KHÔNG** bỏ hẳn mục.

### 6.6. Ma trận Trạng thái (nếu entity có status flow)
| Trạng thái hiện tại | Hành động cho phép | Trạng thái kế tiếp | Ai được thực hiện |
|---|---|---|---|

### 6.7. Điểm Mơ Hồ & Rủi Ro

**Bảng Ambiguities** — có vòng đời, không phải danh sách tĩnh:

| Mã | Câu hỏi | Nguy cơ | Mức độ | Assumption tạm | Trạng thái | Kết luận |
|---|---|---|---|---|---|---|
| AMB-PRJ-04 | Visible Tabs vs quyền khách hàng, cái nào ưu tiên? | ... | 🔴 | Visible Tabs thắng | ❓ Chờ trả lời | — |
| AMB-PRJ-02 | Deadline có được sớm hơn Start Date? | ... | 🔴 | Không validate | ✅ Đã trả lời 10-08-2026 | PO xác nhận là lỗi → sinh REQ-PRJ-79 |

**Bảng mã trạng thái AMB:**

| Ký hiệu | Nghĩa | Hành động tiếp theo |
|---|---|---|
| ❓ | **Chờ trả lời** — đã gửi PO/BA, chưa có phản hồi | Test theo Assumption tạm, gắn nhãn `assumption-based` |
| ✅ | **Đã trả lời** — ghi ngày + kết luận | Nếu kết luận sinh yêu cầu mới → cấp REQ mới và ghi Nhật ký. Nếu khác Assumption tạm → **TC đang dựa trên giả định phải sửa** |
| ⏭️ | **Bỏ qua** — PO xác nhận không cần làm rõ ở giai đoạn này | Ghi rõ lý do; test theo Assumption tạm và chấp nhận rủi ro |

> AMB đã ✅ hoặc ⏭️ **không được xoá khỏi bảng** — giữ lại để biết quyết định đến từ đâu.

**Bảng Risks:** `RISK-<MODULE>-XX | Rủi ro | Mô tả | Mitigation`

### 6.8. Phân rã Epic / Story (Backlog View) — bắt buộc khi ≥ 25 REQ

Chiếu toàn bộ REQ sang cấu trúc backlog để chia việc, **không thay thế** các mục trên:

| Story ID | Tên Story | REQ bao phủ | Số REQ | AMB / RISK liên quan | Ghi chú phạm vi |
|---|---|---|---|---|---|
| STORY-PRJ-01 | Danh sách & lọc | REQ-PRJ-01 → REQ-PRJ-13 | 13 | RISK-PRJ-05 | ... |

Kèm theo bảng trên, **BẮT BUỘC** có đủ 4 phần:
1. **Dòng tổng kiểm chứng:** `Tổng: N Story / M REQ — mọi REQ thuộc đúng một Story, không mồ côi, không trùng`, kèm phép cộng hiện rõ (`7+5+7+6+6+9 = 40 ✔`)
2. **Bảng đối chiếu AMB/RISK:** **mọi** mã AMB và RISK phải xuất hiện ở đúng một trong hai chỗ — gắn vào một Story, hoặc nằm trong Hạng mục cấp Epic. Trình bày thành bảng để tự kiểm:

   | Nhóm | Mã | Nằm ở đâu |
   |---|---|---|
   | AMB thuộc Story | AMB-PRJ-02…17 | phân bổ ở bảng Story |
   | AMB cấp Epic | AMB-PRJ-01 | Ma trận Phân quyền |
   | RISK thuộc Story | RISK-PRJ-01…05, 07 | phân bổ ở bảng Story |
   | RISK cấp Epic | RISK-PRJ-06 | rủi ro mức module |

   Mã không xuất hiện ở đâu cả = **không ai chịu trách nhiệm xử lý**. Đây là lỗi hay bị bỏ sót vì bảng Story chỉ được kiểm tổng REQ, không kiểm tổng AMB/RISK.
3. **Hạng mục cấp Epic:** liệt kê những phần cắt ngang cố ý không gán vào Story nào (ma trận phân quyền, ma trận trạng thái, NFR, RISK mức module…) **kèm lý do**
4. **Thứ tự triển khai đề xuất:** xếp theo phụ thuộc và rủi ro, **không** theo thứ tự đánh số. Đánh dấu rõ Story nào đang `BLOCKED` bởi AMB nào

### 6.9. Nhật ký Thay đổi (Changelog) — BẮT BUỘC ở mọi tài liệu module

Đây là **bộ nhớ liền mạch** của tài liệu. Module đang phát triển thì ticket sẽ liên tục sửa/bổ sung yêu cầu; mục này ghi lại toàn bộ đường đi để bất kỳ ai (hoặc AI ở phiên làm việc mới) đọc một lần là nắm đủ bối cảnh.

Đặt ở **cuối tài liệu**, thứ tự **mới nhất lên trên**:

| Ngày | Nguồn | REQ ảnh hưởng | Loại | Tóm tắt thay đổi | TC cần xử lý |
|---|---|---|---|---|---|
| 15-08-2026 | ABC-140 | REQ-PRJ-58 → 62 | 🔴 Bỏ | Gỡ chức năng Copy Project khỏi phạm vi | TC-PRJ-31 → 🗑️ Deprecated |
| 10-08-2026 | ABC-123 | REQ-PRJ-42 | 🟡 Sửa | Deadline chuyển thành bắt buộc phải sau Start Date | TC-PRJ-18, TC-PRJ-19 → review |
| 10-08-2026 | ABC-123 | REQ-PRJ-79 | 🟢 Thêm | Bổ sung field Priority cho dự án | — (viết TC mới) |
| 02-08-2026 | UI recon | REQ-PRJ-01 → 65 | 🟢 Thêm | Khởi tạo tài liệu từ khảo sát UI thực tế | — |

**Quy tắc ghi Nhật ký:**
- **Mọi** thay đổi đều phải có dòng — kể cả khi chỉ sửa câu chữ mà không đổi hành vi (ghi loại `✏️ Biên tập`)
- Cột `Nguồn` ghi ticket ID hoặc `UI recon` — phải truy được về đợt phân tích nào
- Cột `TC cần xử lý` là **mắt xích cảnh báo** cho tester: `review` / `deprecated` / `viết mới`. Không biết TC nào bị ảnh hưởng thì ghi `⚠️ chưa rà soát`
- Dòng đầu tiên luôn là dòng khởi tạo tài liệu
- Nhật ký **chỉ nằm ở file index** khi tài liệu bị tách nhiều file (mục 5.3)

**Đồng bộ 3 nơi — kiểm tra trước khi bàn giao:**

```
Nhật ký (6.9)  ←→  Trạng thái REQ (6.2)  ←→  Dải mã metadata (6.1)
```
- REQ nào có trạng thái 🟡/🔴 thì phải có dòng Nhật ký tương ứng, và ngược lại
- REQ mới thêm phải nằm trong dải `Mã kế tiếp` đã công bố, và dòng `Dải mã đã dùng` phải được cập nhật

> Mục 6.5 / 6.6 ghi "Không áp dụng" nếu module không có phân quyền/trạng thái — KHÔNG được bỏ hẳn mục, để người đọc biết đã cân nhắc.

---

## 7. Bắt buộc (Strict Rules)

### 7.1. Luật chung — áp cho MỌI nhánh

- Luôn viết bằng **Tiếng Việt**.
- **Mọi yêu cầu chức năng, business rule, validation rule đều phải có mã REQ ID** — tài liệu không có mã bị coi là chưa đạt.
- **Không tự suy diễn nghiệp vụ** nếu không có căn cứ từ UI/tài liệu → đưa vào Ambiguities kèm Assumption tạm.
- **Mọi khẳng định phải truy được về nguồn.** Cột `Nguồn` của mỗi REQ là bắt buộc, không được để trống hay ghi chung chung.
- **Luôn kiểm tra `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` trước khi gán mã REQ đầu tiên** và đánh tiếp từ số cuối cùng (mục 2.1) — áp cho MỌI workflow sinh REQ, không riêng nhánh nào.
- **Dự án mới, chưa có `docs/requirements/README.md` → PHẢI tạo file danh mục trước** khi ghi tài liệu module đầu tiên (mục 5.7.1). Thiếu file này, cơ chế chống trùng prefix và nối tiếp mã REQ im lặng không hoạt động.
- **Không bao giờ đánh lại số REQ ID** khi tách file, gom Story hay tái cấu trúc tài liệu.
- **Một nghiệp vụ = một prefix, dù chạy trên web, app hay API** (mục 2.2). Không mở prefix hay tài liệu riêng theo nền tảng; khác biệt giữa nền tảng thể hiện bằng cột `Nền tảng`, khác biệt không rõ chủ đích thành `AMB-<MODULE>-XX`.
- **Không khai REQ cho nền tảng chưa khảo sát** — `Tất cả` chỉ được ghi khi đã kiểm trên từng nền tảng module có.
- **Tầng nền tảng `web/` · `mobile/` · `api/` luôn có** (mục 5.3): REQ chỉ áp một nền tảng ở file nền tảng đó, REQ dùng chung ở index, evidence ở `<nền-tảng>/evidence/`. Không tạo thư mục nền tảng nào khác ngoài 3 tên này.
- **Đếm số REQ trước khi ghi file** và áp đúng bảng ngưỡng tại mục 5.1 — không tự ý gộp hay tách ngoài quy tắc.
- Dù tách bao nhiêu file, **điểm vào luôn là `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`** kèm mục `## Bản đồ tài liệu` (mục 5.5) — để các workflow phía sau không vỡ.
- **KHÔNG BAO GIỜ xoá dòng REQ** khỏi tài liệu — tính năng bị gỡ thì đổi trạng thái sang 🔴 Deprecated (mục 6.2). Xoá dòng là mất dấu vết và làm vỡ RTM.
- **Mọi thay đổi tài liệu đều phải ghi Nhật ký thay đổi** (mục 6.9), kèm cột `TC cần xử lý` — đây là mắt xích duy nhất báo cho tester biết test case nào đã stale.
- **Ba nơi phải luôn khớp nhau:** Nhật ký (6.9) ↔ Trạng thái REQ (6.2) ↔ Dải mã metadata (6.1).
- **Chạy Cổng Tự Soát REQ (mục 4.3) TRƯỚC KHI ghi file** — 9 câu hỏi bắt lỗi do chính agent viết sai. Bỏ qua bước này thì lỗi chỉ lộ ra ở tầng test case, khi đã quá muộn để truy nguồn.
- 🔒 **CẤM ghi giá trị bí mật thật vào bất kỳ tệp nào trong `docs/`** — mật khẩu, token, cookie xác thực, session id, API key, chuỗi ký của liên kết đặt lại mật khẩu. Ghi **hình thái** thay cho giá trị (mục 4.3.3). Lý do: `docs/` được commit, và lịch sử git **không xoá được bằng cách sửa file**. Credentials sống ở `.env` (đã `.gitignore`), tài liệu chỉ mô tả *hình dạng* của chúng.
- 🔒 **Trước khi ghi tài liệu đầu tiên của dự án, kiểm `docs/` có bị `.gitignore` chặn không.** Không chặn (mặc định nên vậy — tài liệu cần được commit) thì **mọi** thứ đưa vào `docs/` là công khai với người có quyền đọc repo: cân nhắc lại từng ảnh evidence và từng giá trị chép vào AC.
- **AMB và RISK cũng không được mồ côi.** Mục 6.8 đã buộc mọi REQ thuộc đúng một Story; áp cùng nguyên tắc cho AMB/RISK — mỗi mã hoặc gắn vào một Story, hoặc nằm trong bảng **Hạng mục cấp Epic** kèm lý do. Mã không xuất hiện ở đâu cả nghĩa là không ai chịu trách nhiệm xử lý nó.

### 7.2. Chỉ áp cho nhánh UI Recon web (3.1)

- Nếu có Playwright MCP: mở browser thật (`navigate → wait_for(page_load) → snapshot`) để capture giao diện — **KHÔNG đoán field/validation**. KHÔNG gọi `browser_resize`; viewport đã đúng từ `--viewport-size` lúc launch.
- Error messages ghi **nguyên văn từ UI thực tế**, không diễn đạt lại.
- **Trigger từng validation** để lấy message thật — không chép từ code cũ, không suy ra từ tên field.
- Cột `Nguồn` ghi `UI thực tế` (chỉ quan sát) hoặc `Kiểm chứng thực tế` (đã tương tác và xác nhận) — **phân biệt rõ hai mức này**. Có tài liệu kèm thì dùng thang 4 mức ở **3.3.1 Bước 3**.
- Lưu evidence screenshot vào `docs/requirements/<module>/web/evidence/` — **trong** thư mục nền tảng của module, không tách ra ngoài (mục 5.3).
- **Bật `browser_network_requests` trong suốt recon** (mục 3.1.1) — kể cả lúc submit form. Hệ thống không có tài liệu mà bỏ tầng network là bỏ mất validation server-side và trạng thái ẩn.
- 🚫 **CẤM gọi API trực tiếp** (curl / fetch / `browser_evaluate` gọi endpoint) để dò hành vi. Chỉ **quan sát thụ động** request do UI tự phát sinh — gọi thẳng API là kiểm thử xâm nhập, và không chứng minh được gì về hành vi UI.
- **Không đủ account cho mọi role → KHÔNG bỏ trống mục 6.5, cũng KHÔNG bịa.** Áp thang 3 mức bằng chứng ở mục 3.1.2, kèm dòng tổng `Đã kiểm chứng / Suy diễn / Chưa rõ`, và mỗi role thiếu account = 1 `AMB-<MODULE>-XX` 🔴.
- **Ô `❔` không được làm tròn thành `❌`** — "chưa kiểm chứng" khác hẳn "không có quyền".
- **Có tài liệu bán phần → lập Bản đồ phủ tài liệu TRƯỚC khi mở browser** (mục 3.3.1) và đưa vào tài liệu đầu ra ở mục 6.5.1. Không được recon cả module theo một chiến lược duy nhất.
- **Không dùng tài liệu của vùng này để suy ra vùng khác** — spec form tạo mới không nói gì về form sửa, dù hai form trông giống nhau.
- **Đọc `docs/requirements/_discovery/` trước khi recon nếu đã chạy `/discover-system`** (mục 5.8) — lấy route, prefix, bản đồ phủ tài liệu; **không tự đặt lại prefix**.
- **User hỏi "hệ thống có gì" (chưa biết module nào) → route sang `/discover-system`**, không tự crawl rồi sinh REQ lẫn hai tầng.

#### 7.2.1. Chuẩn Evidence (BẮT BUỘC) — evidence thiếu thì bước sinh TC sẽ bịa

Evidence là **nguồn sự thật** cho mọi workflow phía sau (`/generate_testcases_*`, `/generate_automation_*`). Ảnh cắt cụt khiến agent sinh TC phải suy diễn phần không nhìn thấy — và **không ai phát hiện được chỗ nào là suy diễn**.

| Quy tắc | Chi tiết |
|---|---|
| **Ảnh phải chứa trọn đối tượng cần chứng minh** | Mặc định `browser_take_screenshot(fullPage=true)`, vì form dài chụp viewport luôn bị cắt mất nút Save, checkbox cuối, editor. **Mục đích của luật là không cắt cụt đối tượng — không phải chụp càng nhiều càng tốt.** Đối tượng là một widget nằm trọn trong viewport (thanh đầu trang, dropdown, hộp thoại) thì chụp viewport/element là **đủ và đúng phạm vi** — xem luật vệ sinh dữ liệu bên dưới |
| **Chụp theo trạng thái, không chỉ trạng thái mặc định** | Mỗi trạng thái động = 1 ảnh riêng: dropdown **đang mở** (thấy đủ options), field sau khi **đổi giá trị điều khiển** (Billing Type → Total Rate hiện), checkbox **disabled vs enabled**, form **sau khi submit lỗi** (thấy message inline) |
| **🔍 BẮT BUỘC mở lại ảnh xác nhận trước khi ghi danh mục** | Chụp xong phải **`Read` lại chính tệp đó** và xác nhận nó thật sự thể hiện trạng thái sắp khai. Rất hay gặp: bấm mở dropdown nhưng ảnh chụp trước khi menu kịp render, hoặc thao tác mở thất bại mà không ai biết → danh mục ghi *"menu đang mở"* trong khi ảnh là menu đóng. Dòng danh mục sai **nguy hiểm hơn không có ảnh**, vì nó tạo cảm giác REQ đã có bằng chứng |
| **Chụp đủ mọi tab** | Form/trang nhiều tab → mỗi tab 1 ảnh full-page. Tab chưa active thì nội dung bên trong **không render đúng** |
| **Bảng danh sách chụp cả phần điều khiển** | Phải thấy: toàn bộ hàng tiêu đề, dropdown page size, mọi nút thanh công cụ (kể cả nút icon không nhãn), ô tìm kiếm, khu vực phân trang |
| **Đặt tên nêu rõ trạng thái VÀ phạm vi chụp** | `<màn_hình>_<trạng_thái>_<fullpage\|viewport>.png` — VD `project_new_form_default_fullpage.png`, `dashboard_logout_menu_open_viewport.png`. Hậu tố phải khớp cách chụp thật; đặt `_fullpage` cho ảnh viewport là khai sai |
| **🔒 Vệ sinh dữ liệu — evidence là tệp sẽ được commit** | Ảnh chụp hệ thống thật thường kéo theo **dữ liệu không liên quan tới REQ**: tên khách hàng, số tiền, email, nhật ký hoạt động, nội dung công việc. Luật: **chụp đúng phạm vi đối tượng cần chứng minh, không chụp thừa.** Đối tượng nằm trong viewport mà ảnh full-page kéo theo cả trang dữ liệu nghiệp vụ → **chụp viewport**, và ghi một dòng lý do trong Danh mục Evidence. Buộc phải full-page mà không tránh được dữ liệu nhạy cảm → báo user trước khi commit |
| **Ghi bảng Danh mục Evidence vào tài liệu** | Mỗi ảnh 1 dòng: tên tệp · màn hình · trạng thái · REQ mà nó làm bằng chứng. REQ không có ảnh nào chống lưng thì cột `Nguồn` **không được** ghi `Kiểm chứng thực tế` |
| **Ảnh KHÔNG thay được việc đọc DOM** | Ảnh không cho biết `disabled` hay chỉ là `không tick`, không đếm được option nào `selected`, không đọc được `value` / `data-*`. Những dữ kiện này **bắt buộc đọc bằng `browser_evaluate`** và **chép nguyên số liệu vào Acceptance Criteria** — vì ảnh lưu lại cũng không kiểm chứng lại được |
| **DOM cũng KHÔNG thay được ảnh** | Chiều ngược lại cũng đúng: đếm được phần tử trong DOM **không** chứng minh người dùng nhìn thấy nó. Hai nguồn bổ sung cho nhau, không thay thế nhau — xem mục **4.3.5** |

**Dữ kiện bắt buộc đọc từ DOM (ảnh không thể hiện được):**

| Dữ kiện | Vì sao ảnh không đủ |
|---|---|
| Số `<option>` thật của mỗi `<select>` | Option rỗng đầu danh sách không hiển thị trên UI nhưng vẫn đếm khi automation |
| Option nào đang `selected` (nhất là multi-select) | Multi-select hiển thị dạng chuỗi bị cắt `...` — không đếm được |
| `disabled` vs `checked` của từng checkbox | Xám mờ trên ảnh có thể là disabled, cũng có thể chỉ là màu nhạt |
| `value` của option (ánh xạ nhãn ↔ giá trị) | Không bao giờ hiện trên UI, nhưng automation phải chọn theo `value` |
| Thứ tự focus thật của form | Bố cục nhiều cột làm thứ tự Tab khác thứ tự đọc từ trên xuống |
| Phần tử ẩn bằng class nhưng vẫn trong DOM | Ảnh chỉ cho biết "không thấy", không cho biết "không tồn tại" |
| `offsetParent` + `getBoundingClientRect()` của **mọi** phần tử khai là "dùng được" | Đếm được node **không** nghĩa là người dùng bấm được — node có thể bị tổ tiên `display:none` (responsive, quyền, trạng thái). Bắt buộc theo mục **4.3.5** |
| Số phần tử **lồng bên trong** khi khai vị trí ("mục cuối cùng", "dòng đầu") | `X li:last-child` bắt cả `<li>` ở submenu; phải dùng `X > li:last-child`. Sai chỗ này thì locator trong TC trỏ nhầm phần tử |
| Giá trị **đầy đủ** của `document.title` và `body.className` | Thường có phần động (số đếm thông báo, token theo trình duyệt/cấu hình) — chép thiếu là AC assert khớp tuyệt đối sẽ đỏ. Xem mục **4.3.7** |
| Viewport đang đo (`innerWidth × innerHeight`) | Mọi kết luận về hiển thị **chỉ đúng với viewport đó** — phải ghi vào AC, và phần tử responsive cần recon riêng ở viewport khác |

**Checklist trước khi đóng recon:**
- Mọi REQ có cột `Nguồn` = `UI thực tế` / `Kiểm chứng thực tế` đều phải truy được về ít nhất 1 ảnh trong Danh mục Evidence **hoặc 1 lần đọc DOM có ghi số liệu trong Acceptance Criteria**. Không truy được → hạ về `Chưa kiểm chứng` + mở `AMB-<MODULE>-XX`.
- **Mọi ảnh trong Danh mục Evidence đã được `Read` lại** và xác nhận đúng trạng thái đang khai.
- **Đã chạy Cổng Tự Soát REQ (mục 4.3)** trên toàn bộ REQ vừa sinh.

### 7.3. Chỉ áp cho nhánh Document Analysis (3.2)

- **KHÔNG đọc file nhị phân bằng `Read`** — ủy quyền đúng skill theo bảng ở mục 3.2 Bước 0. Không đọc được thì **dừng và báo user**, không suy đoán từ tên file.
- **KHÔNG tự viết AC thay PO/BA.** Tài liệu thiếu AC → ghi nhận đúng thực trạng + `AMB-<MODULE>-XX` 🔴 High (mục 3.2 Bước 4). Đây là luật tương đương với "không đoán locator" của nhánh UI.
- **Trích dẫn nguyên văn** mọi rule, message, giá trị ngưỡng — cấm diễn đạt lại rồi gán REQ.
- **Ghi vị trí nguồn cụ thể** trong cột `Nguồn`, đủ để người review mở đúng chỗ mà đối chiếu:
  ```
  ✅ Ticket ABC-123 · AC#4          ✅ field_spec.xlsx · sheet "Fields" · dòng 12
  ✅ Comment của PO ngày 15-07-2026  ❌ "theo tài liệu"   ❌ "trong ticket"
  ```
- **KHÔNG bỏ qua comments** — comment thường là quyết định mới nhất và **đè lên** phần mô tả gốc.
- **Xung đột giữa các nguồn KHÔNG được tự giải quyết im lặng** — luôn thành `AMB-<MODULE>-XX`, kể cả khi đã áp thứ tự ưu tiên ở mục 3.2 Bước 3.
- Phân biệt **"Không đề cập trong tài liệu"** (tài liệu thiếu → cần hỏi) với **"Không áp dụng"** (đã cân nhắc và xác định không liên quan). Hai câu này nghĩa khác hẳn nhau.
- **KHÔNG tự fetch URL Jira/Confluence** — route sang `/fetch-jira-requirements`. MCP chưa authorize thì báo user, tuyệt đối không bịa nội dung ticket.

### 7.4. Chỉ áp cho nhánh API Spec Analysis (3.4)

- **Lấy spec bản gốc bằng tải thô** (`curl` → `sources/`), **KHÔNG dùng `WebFetch`** — kết quả đã qua xử lý, spec lớn bị cắt âm thầm. Đếm số operation đối chiếu trang tài liệu trước khi dùng (3.4.1).
- **Trang tài liệu (Swagger UI, Scalar, Redoc) là renderer, không phải spec** — tìm URL spec gốc hoặc khối spec nhúng inline; Swagger UI nhiều spec thì hỏi phạm vi, snapshot từng spec.
- **Ma trận auth lập theo TỪNG operation** — `security: []` ghi đè cấp gốc; Postman thì auth cấp dưới đè cấp trên (3.4.3).
- **Gọi thật chỉ khi `Gọi API: ✅`** ở danh mục, và tuân **tuyệt đối** bảng quy tắc dữ liệu 3.4.4: không ghi/xoá bản ghi không do phiên này tạo, BOLA/IDOR chỉ bằng 2 tài khoản tự tạo, dọn sạch và báo số tạo/dọn.
- Luật "cấm gọi API trực tiếp" của 7.2 **không** áp cho nhánh này — nhưng cũng **không** được mang quyền gọi API sang nhánh UI.
- **Spec ↔ thực tế lệch → REQ theo spec + `AMB-<MODULE>-XX` 🔴 nguyên văn cả hai** (3.4.5). Không tự hạ REQ theo hành vi thật, không giấu lệch pha.
- **JSON mẫu trong tài liệu văn bản là ví dụ, không phải schema** — không suy `required`/kiểu/độ dài từ ví dụ (3.4.6). Không đặt OpenAPI tự dựng vào `sources/`.
- **Mọi operation trong phạm vi phải có ≥ 1 REQ** trong Endpoint Catalog, hoặc ghi lý do loại khỏi phạm vi.
- 🔒 Request/response chép vào tài liệu **phải che** token, cookie, mật khẩu, dữ liệu cá nhân — ghi hình thái (4.3.3).

### 7.5. Chỉ áp cho nhánh Mobile Recon (3.5)

- **Nhận diện loại app TRƯỚC khi recon** (3.5.1). Flutter chưa bật semantics → chỉ recon mức hình ảnh, không khai thuộc tính phần tử, mở `AMB` 🔴 cho dev.
- **CẤM bấm theo toạ độ để dò màn hình** — không tìm được phần tử thì nhờ user dẫn đường, không đoán.
- **Hierarchy không lộ độ dài tối đa / bắt buộc / loại bàn phím** → phải thử thật, ghi kết quả vào AC; không suy từ nhãn.
- **Toast đọc và chụp ngay sau thao tác**, mở lại ảnh xác nhận đã bắt được (7.2.1).
- **Không có proxy thì không có tầng network** — ghi rõ ở metadata, không suy validation server-side.
- **Recon riêng từng nền tảng** — không suy iOS từ Android (3.5.4).
- **Cân nhắc đủ 8 nhóm yêu cầu riêng của mobile** (3.5.3) — không áp dụng thì ghi lý do, không bỏ trống.
- Môi trường dùng chung: app vẫn gọi backend chung → **cùng luật chỉ đọc** như web, không bấm Lưu/Xoá trên dữ liệu thật.
- 🔒 Xoá thông báo / bật Không làm phiền trước khi chụp; **không** lưu page source vào `docs/` (3.5.5).
