---
description: Khám phá hệ thống ở cấp toàn cục — web, app mobile (Android/iOS/Flutter) và API (Swagger/Scalar/Postman/tài liệu API) — lập bản đồ module, gán prefix REQ chung cho mọi nền tảng, khởi tạo danh mục. Hỗ trợ 3 modes — UI (chỉ có hệ thống chạy), HYBRID (có một phần tài liệu), DOC (chỉ có tài liệu).
skills:
  - skills-requirements-analyzer
  - skills-ui-debug-agent
  - skills-mobile-debug-agent
---

# Workflow: Khám Phá Hệ Thống (System Discovery)

> **BẮT BUỘC (MANDATORY SKILL):** Nạp và đọc kỹ **`skills-requirements-analyzer`** (`.claude/skills/skills-requirements-analyzer/SKILL.md`) — dùng mục **2 + 2.2** (quy ước mã · một nghiệp vụ một prefix trên mọi nền tảng), **3.1** (UI recon web), **3.1.1** (network), **3.3** (đối chiếu tài liệu ↔ UI), **3.4.1 → 3.4.4** (mặt API), **3.5.1 + 3.5.2** (mặt mobile), **5.3** (thư mục), **5.7** (danh mục), **5.8 + 5.8.2** (tầng khám phá · `api_map.md`), **7.1 + 7.2** (strict rules) — cộng **7.4** khi khám phá API, **7.5** khi khám phá mobile.
>
> Tham khảo **`skills-ui-debug-agent`** cho thao tác inspect DOM (web) và **`skills-mobile-debug-agent`** cho phiên Appium + nhận diện loại app (mobile).

Workflow này chạy **trước tất cả**, khi bạn mở một hệ thống lên mà **chưa biết nó có những module nào**. Đầu ra là **bản đồ hệ thống** + **danh mục module đã gán prefix** — nền tảng để chạy `/generate-requirements-from-website` (web), `/generate-requirements-from-mobile` (app) hoặc `/generate-requirements-from-api` (API) cho từng module về sau.

---

## ⚠️ Ranh giới của workflow này — đọc trước khi chạy

| Workflow này **CÓ** làm | Workflow này **KHÔNG** làm |
|---|---|
| Liệt kê toàn bộ module / trang / entity của hệ thống | ❌ Sinh `REQ-XXX-NN` — **tuyệt đối không gán mã REQ** |
| Gán **prefix** cho từng module (`LOGIN`, `CUST`…) và đăng ký chống trùng | ❌ Sinh Field Spec, validation message, ma trận phân quyền chi tiết |
| Ghi nhận độ sâu tài liệu QA cung cấp (nếu có) | ❌ Sinh test case |
| Đánh giá risk sơ bộ + đề xuất thứ tự khảo sát | ❌ Trigger validation từng field (việc của recon cấp module) |
| Khởi tạo `docs/requirements/README.md` | ❌ Thay thế `/generate-requirements-from-website` |

> **Vì sao tách bạch:** mã REQ là lớp truy vết **bất biến** (skill mục 2). Gán mã ở tầng khám phá — khi chưa mở từng form, chưa trigger validation — chắc chắn sẽ phải đánh lại số ở bước sau. Tầng khám phá **chỉ cấp prefix**, không cấp số.

---

## Mặt hệ thống — nhận diện TRƯỚC khi chọn mode

Một hệ thống có thể có nhiều **mặt**: web, app mobile, API. Mỗi mặt khám phá bằng công cụ khác nhau, nhưng **chung một bản đồ, chung một bộ prefix** (skill 2.2). Agent tự nhận diện từ đầu vào:

| Đầu vào user đưa | Mặt | Bước 3 chạy nhánh | Công cụ |
|---|---|---|---|
| URL trang web | **Web** | **Bước 3** | Playwright MCP |
| File `.apk` / `.aab` / `.ipa` · package / bundle id · *"app mobile"* · app đã cài trên máy | **Mobile** | **Bước 3-M** | Appium MCP |
| URL Swagger UI / Scalar / Redoc / Stoplight / RapiDoc · file OpenAPI `.json`/`.yaml` · Postman collection | **API** | **Bước 3-A** | `curl` + đọc spec + gọi thật có kiểm soát |
| `.docx` / `.pdf` mà nội dung là **mô tả endpoint** (bảng method/path, JSON mẫu, bảng mã lỗi) | **API** (mode DOC nếu không gọi được) | **Bước 3-A** theo skill 3.4.6 | skill `docx` / `pdf` |
| Nhiều loại cùng lúc | **Nhiều mặt** | Chạy lần lượt: **web → mobile → API** | Chung bản đồ, chung prefix |

**Vì sao thứ tự web → mobile → API:** mặt có giao diện cho **tên nghiệp vụ** mà người dùng nhìn thấy — dùng làm tên module chuẩn. Mặt API sau đó **ghép tag vào module đã có**, thay vì đặt tên module theo tên controller kỹ thuật.

**Mode ở mặt API** — spec luôn là một dạng tài liệu, nên:

| Tình huống | Mode |
|---|---|
| Có spec **và** gọi thật được (`Gọi API: ✅`, có môi trường) | **HYBRID** — spec là ý định, response thật là thực tế |
| Chỉ có spec / tài liệu, **không** gọi được | **DOC** — mọi module mặt API để `⬜`, ghi chú *"chưa gọi thật — chỉ theo spec"*, không coi là đã xác minh |
| Không có spec, chỉ có base URL | ⛔ **Không khám phá API mù.** Hỏi user nguồn spec. Có mặt web thì endpoint lộ qua tầng network (Bước 3.2) |

**Hệ thống chỉ có API** ghi vào đâu: hệ thống đầu tiên của repo → `docs/requirements/_discovery/api_map.md` (thư mục mặc định); repo đã có hệ thống khác → namespace `docs/requirements/_<hệ-thống>/_discovery/api_map.md` (CLAUDE.md mục 6b). **Mặt API hay mobile của hệ thống đang có** thì **không** mở namespace — ghi chung bản đồ.

**Công bố** mặt + mode ngay câu đầu, cùng lúc với câu công bố mode ở dưới:
> *"Chạy mode HYBRID · 2 mặt Web + API — có URL web và Swagger, gọi API được. Sẽ khám phá web trước để lấy tên module."*

---

## 3 Chế độ (Mode)

**Agent TỰ nhận diện mode ở Bước 0 — user không cần khai báo.** Mode suy ra hoàn toàn từ đầu vào:

```
Đã có docs/requirements/_discovery/system_map.md (hoặc api_map.md) ?
├─ CHƯA → khảo sát lần đầu
│         User có đưa tài liệu?     ─ có ─→ HYBRID
│                                   └ không ─→ UI
│         Không truy cập được hệ thống (chưa có URL / app / account / quyền gọi API) → DOC
├─ RỒI, nhưng user đưa thêm MẶT MỚI (app, spec API) cho hệ thống đã có bản đồ → ADD
│         (thêm nền tảng vào module đã có — không phải module mới)
└─ RỒI  → User chỉ đích danh module bị sót?  ─ có ─→ ADD
                                              └ không ─→ DELTA
```

**Trigger từ lời user:**

| User nói gì | Mode |
|---|---|
| *"khám phá hệ thống này"* + đưa URL | **UI** |
| *"đây là spec tôi có"* · đính kèm file · *"tài liệu chỉ có một phần"* | **HYBRID** |
| *"chưa có account, đọc tài liệu trước"* | **DOC** |
| *"còn thiếu module X"* · *"bạn chưa khảo sát menu Báo cáo"* | **ADD** |
| *"hệ thống còn có app mobile"* · *"đây là Swagger của backend"* — khi **đã có** bản đồ | **ADD** — thêm **mặt** mới, ghép vào module đã có |
| *"rà lại xem có gì mới"* · *"vừa deploy tính năng mới"* | **DELTA** |

**Agent BẮT BUỘC công bố mode đã chọn** ngay câu đầu tiên, kèm lý do một dòng:
> *"Chạy mode HYBRID — có 2 file tài liệu bạn đưa, và hệ thống truy cập được."*

Sai mode thì bạn chặn ngay ở câu đó, chưa tốn công gì. **User luôn được quyền chỉ định đè** — nói *"chạy mode UI thôi, bỏ tài liệu đó đi, nó cũ rồi"* thì agent theo.

⚠️ Mode **không** được đổi giữa chừng. Đang HYBRID mà thấy tài liệu quá cũ → **không** tự hạ xuống UI; vẫn giữ HYBRID và đánh vùng đó `⚠️ Nghi lỗi thời` (Bước 2), vì lệch pha giữa tài liệu và UI là **thông tin có giá trị**, vứt tài liệu đi là mất luôn.

Ghi mode + mặt đã chạy vào mục 1 của `system_map.md` (hệ thống chỉ có API: bảng metadata của `api_map.md`).

| Mode | Đầu vào | Đặc điểm |
|---|---|---|
| **UI** (mặc định) | Chỉ có hệ thống đang chạy | Sự thật 100% ở UI. Mọi thứ chưa quan sát được → `❔ Chưa rõ`, không suy diễn |
| **HYBRID** | Hệ thống chạy **+ một phần tài liệu** (QA cung cấp) | Phổ biến nhất. Tài liệu cho **ý định**, UI cho **thực tế**. Bắt buộc lập **Bản đồ phủ tài liệu** (Bước 2) |
| **DOC** | Chỉ có tài liệu, chưa truy cập được hệ thống | Chỉ dựng được bản đồ dự kiến. Mọi module đánh dấu `⬜ Chưa khảo sát UI` — **không** được coi là đã xác minh |

Hai chế độ chạy bổ sung khi **đã có bản đồ từ trước** (chi tiết ở cuối tài liệu):

| Chế độ | Khi nào | Phạm vi |
|---|---|---|
| **ADD** | User chỉ đích danh module bị sót | Chỉ module đó — không crawl lại |
| **DELTA** | Hệ thống đã thay đổi, hoặc muốn rà lại toàn bộ | Crawl lại, báo phần chênh |

> Tài liệu QA cung cấp thường **không phủ hết** — vài module có spec, phần còn lại trắng. Mode HYBRID xử lý đúng tình huống này: **không** vứt tài liệu đi, cũng **không** tin tài liệu thay cho UI.

---

## Các bước thực hiện

### Bước 0: Tiếp nhận đầu vào & chốt bối cảnh

Thu thập, hỏi user thứ **không suy ra được**:

| Cần có | Nguồn | Bắt buộc |
|---|---|---|
| **Mặt web:** URL hệ thống | User | ✅ khi có mặt web (trừ mode DOC) |
| **Mặt mobile:** nền tảng (Android/iOS) · file app **hoặc** package/bundle id của app đã cài · thiết bị (bỏ trống → agent liệt kê bằng `select_device`) · bản build `release`/`debug`. **Không** cần Appium server — Appium MCP chạy nhúng; chỉ khi user dùng server/cloud riêng mới truyền `remoteServerUrl`. **iOS cần macOS** — máy Windows/Linux chỉ khám phá được Android | User | ✅ khi có mặt mobile |
| **Mặt mobile — app Flutter:** dev đã bọc `Semantics` chưa? | User (không biết thì agent tự nhận diện ở Bước 3-M) | Tuỳ |
| **Mặt mobile:** được phép **xoá dữ liệu app / cài lại** không? | **Hỏi user** — xoá dữ liệu app mới thấy lại màn hình giới thiệu lần đầu, nhưng mất phiên đăng nhập trên thiết bị | ✅ khi có mặt mobile |
| **Mặt API:** nguồn spec (URL trang tài liệu / file) · môi trường để gọi thử | User | ✅ khi có mặt API |
| Tài khoản đăng nhập — **càng nhiều role càng tốt** (web/app dùng chung tài khoản thì chỉ cần một bộ) | User | ✅ |
| Tài liệu sẵn có (nếu có): spec, user story, ticket, file bảng, mockup | User | Tuỳ mode |
| **Tên hệ thống viết tắt** — dùng làm tiền tố TC ID về sau (`CRM_`, `ERP_`, `HRM_`) | Agent đề xuất → **user xác nhận 1 câu** | ✅ |
| **Môi trường dùng chung không?** | **Hỏi user** — không suy ra được từ UI | ✅ |
| **Năng lực kiểm thử của QA** — có quyền gọi API · truy vấn CSDL · kiểm tầng tích hợp · xem nhật ký hoạt động không? | **Hỏi user một lần**, kiểm chứng được thì đo luôn (mở trang nhật ký, thử gọi một API đọc) | ✅ |

⚠️ Môi trường dùng chung = bật ngay quy tắc: **chỉ đọc, không tạo/sửa/xoá dữ liệu** trong suốt quá trình khám phá. Khám phá không cần ghi dữ liệu — mở form xem field là đủ, **KHÔNG bấm Save**.

📌 URL, tài khoản, base URL API, package/bundle id của bản build nội bộ lưu ở `.env`, **KHÔNG** ghi vào bất kỳ tài liệu nào trong `docs/`.

⚠️ **Mặt API:** chỉ gọi thật khi dòng `Gọi API` bên dưới là ✅ — quyền gọi API là thứ **phải hỏi**, không suy ra được từ việc có Swagger. Môi trường dùng chung thì mọi request ghi tuân bảng quy tắc dữ liệu ở skill **3.4.4**.

🔑 **Năng lực kiểm thử của QA phải được ghi vào bảng thuộc tính đầu `docs/requirements/README.md` ngay ở bước này.** Đây là đầu vào cho **nhánh Vòng 3** (`API` · `Database` · `Integration` · `Logging/Audit`) của mọi bộ TC sinh về sau. Không ghi ở đây thì mỗi lần sinh TC agent lại hỏi user cùng một câu — hỏi lại ở từng module là sai, vì quyền của QA giống nhau trên toàn hệ thống.

```markdown
| **Năng lực kiểm thử của QA** | Chốt <ngày> — dùng cho nhánh Vòng 3 của **mọi** bộ TC:<br>• Gọi API: ❌ không có quyền — đội Dev xác minh<br>• Truy vấn CSDL: ❌ không có quyền — đội Dev xác minh<br>• Kiểm tầng tích hợp: ❌ không có quyền — đội Dev xác minh<br>• Xem nhật ký hoạt động: ❌ tài khoản bị chặn (`<đường dẫn đã thử>` → Từ chối truy cập) — cần Super Admin, đề nghị PO cấp<br>• DevTools trình duyệt: ✅ có |
```

> Trả lời **kiểm chứng được thì đo thay vì tin lời** — mở đúng trang nhật ký của hệ thống, thử một lệnh gọi API chỉ đọc. Ghi **kết quả đo kèm ngày**, chính xác hơn câu trả lời từ trí nhớ.

### Bước 1: Đọc trạng thái repo hiện có (LUÔN LÀM ĐẦU TIÊN)

Trước khi khám phá bất cứ thứ gì:

1. `docs/requirements/README.md` — có tồn tại không?
   - **Có** → đọc bảng danh mục: module nào đã có, **prefix nào đã bị chiếm**. Lần chạy này là **bổ sung**, không phải khởi tạo lại
   - **Chưa** → sẽ tạo mới ở Bước 6 (skill mục 5.7.1)
2. `docs/requirements/_discovery/system_map.md` — đã khám phá lần nào chưa? Có thì đọc để **cập nhật delta**, không viết đè
3. Glob `docs/requirements/*/REQUIREMENTS_*_SUMMARY.md` — đối chiếu chéo với danh mục theo bảng dưới. Đây là **thư mục thật vs danh mục khai báo**; lệch ở đây là dấu hiệu một phiên trước đã quên cập nhật

| Điểm lệch | Xử lý ngay ở Bước 1 |
|---|---|
| Có tài liệu module nhưng **thiếu dòng** ở danh mục | Bổ sung dòng — prefix · `REQ đã dùng` · `Mã kế tiếp` lấy **từ chính tài liệu module**, không đoán. Trạng thái recon = ✅ |
| Có dòng danh mục nhưng **không có thư mục** | **KHÔNG xoá dòng** — đưa `Trạng thái recon` về ⬜, ghi lý do ở Nhật ký danh mục. Prefix đã cấp là vĩnh viễn |
| **Prefix trùng** giữa 2 module | ⛔ **DỪNG, báo user** — agent KHÔNG tự đổi. Đổi prefix là đổi mọi REQ ID của một module và mọi TC map về nó |

Sửa gì thì ghi **1 dòng vào Nhật ký danh mục**. Không lệch → nêu `Danh mục khớp thư mục thực tế` ở Bước 7.

> **Nguyên tắc phân xử:** thư mục + tài liệu module là **nguồn sự thật**, danh mục là bản phái sinh → sửa danh mục theo tài liệu, không ngược lại. Ngoại lệ duy nhất là **prefix** — lệch prefix phải hỏi user.

> ❌ **Tuyệt đối không** ghi đè `README.md` hay `system_map.md` đã có. Prefix đã cấp là **vĩnh viễn** — kể cả khi module đó đổi tên trên UI.

### Bước 2: Nạp tài liệu QA cung cấp (Mode HYBRID / DOC)

> Mode UI → bỏ qua, sang Bước 3.

1. **Đọc đúng cách theo định dạng** — theo bảng ở skill mục **3.2 Bước 0**:
   `.docx` → skill `docx` · `.xlsx/.csv` → skill `xlsx` · `.pdf` → skill `pdf` · URL Jira → `/fetch-jira-requirements`
   **Đặc tả API** (Swagger UI · Scalar · Redoc · OpenAPI · Postman · `.docx` mô tả endpoint) cũng là **tài liệu** của mode HYBRID — lấy theo skill **3.4.1** (tải thô bằng `curl`, **không** `WebFetch`), rồi xử lý ở **Bước 3-A**
   ⚠️ Không đọc được → **báo user và dừng**, không suy đoán từ tên file
2. **Lưu bản gốc** vào `docs/requirements/_discovery/sources/` — giữ nguyên tên file, để người review mở đối chiếu được
3. **Lập Bản đồ phủ tài liệu** — đây là sản phẩm chính của bước này:

| Vùng hệ thống | Tài liệu nào phủ | Mức phủ | Ghi chú |
|---|---|---|---|
| Đăng nhập / phân quyền | `spec_auth_v2.docx` mục 3 | 🟩 Đầy đủ | Có cả ma trận role |
| Quản lý khách hàng | `field_spec.xlsx` sheet "Customer" | 🟨 Một phần | Chỉ có field, thiếu business rule |
| Báo cáo | — | ⬜ Trắng | Phải recon UI hoàn toàn |
| Khách hàng — mặt API | `openapi_<ngày>.json` tag `Customers` | 🟨 Một phần | Có schema, không có rule nghiệp vụ, không có role |

**Bảng mã mức phủ:**

| Ký hiệu | Nghĩa | Hệ quả cho recon cấp module |
|---|---|---|
| 🟩 **Đầy đủ** | Có AC/field spec/rule rõ ràng | Recon để **đối chiếu**, tập trung tìm lệch pha (skill 3.3) |
| 🟨 **Một phần** | Có nhưng thiếu mảng lớn (rule, message, phân quyền) | Recon **bổ khuyết** đúng phần trắng |
| ⬜ **Trắng** | Không có gì | Recon **đầy đủ** như mode UI |
| ⚠️ **Nghi lỗi thời** | Có tài liệu nhưng ngày cũ / mô tả không khớp UI khi liếc qua | Recon với giả định **UI thắng**, mọi lệch pha ghi `AMB` ở bước sau |

4. **Rút danh sách module dự kiến** từ tài liệu — đây mới là *dự kiến*, phải đối chiếu UI ở Bước 4

### Bước 3: Khám phá UI web cấp hệ thống (Mode UI / HYBRID)

> Mode DOC → bỏ qua, sang Bước 4 với dữ liệu tài liệu.
> Không có mặt web → bỏ qua, sang **Bước 3-M** / **Bước 3-A**.

Thứ tự bắt buộc (theo `.claude/rules/playwright_rules.md`):

```
browser_navigate → chờ load → browser_snapshot
```

**3.1 — Crawl điều hướng (làm cạn kiệt, không dừng ở tầng 1):**

| Việc | Cách làm | Bẫy hay gặp |
|---|---|---|
| Menu chính (sidebar / header) | `browser_snapshot` toàn trang | Menu **cấp 2, cấp 3** chỉ hiện khi hover/click — phải mở **từng** mục cha |
| Menu bị cuộn khuất | Cuộn hết sidebar | Module cuối danh sách hay bị bỏ sót |
| Link không nằm trong menu | `browser_evaluate` gom toàn bộ `a[href]` trên các trang chính, lọc trùng | Trang chỉ tới được từ nút trong bảng (Chi tiết, Sửa) |
| Route ẩn | Đọc file JS định tuyến qua network (3.2) hoặc thử URL theo mẫu quan sát được | ⚠️ Route đoán ra mà không mở được → ghi `❔ Nghi có, chưa xác minh`, **không** đưa vào danh mục module |
| Trang chỉ vào được từ hành động | Mở 1 bản ghi bất kỳ ở chế độ xem | ⚠️ Môi trường dùng chung: **chỉ mở, không sửa** |

**3.2 — Đọc tầng network** (skill mục **3.1.1**): bật `browser_network_requests` trong lúc crawl, gom danh sách endpoint. Đây là cách rẻ nhất để phát hiện:
- Module **có API nhưng chưa có UI** → tính năng đang build dở → ghi `⚪ Chưa implement`
- Ranh giới entity thật (`/api/customers`, `/api/customers/{id}/contacts` → Customer và Contact là 2 entity)
- Enum trạng thái trả về trong response → gợi ý module nào có status flow

**3.3 — Ghi nhận cho mỗi module phát hiện được:**

| Thông tin | Cách lấy |
|---|---|
| Tên hiển thị trên UI (nguyên văn) | Snapshot |
| URL / route | Thanh địa chỉ |
| Loại màn hình | Danh sách · Form · Dashboard · Wizard · Báo cáo · Cấu hình |
| Có CRUD không | Quan sát nút trên thanh công cụ |
| Có status flow không | Cột trạng thái trong bảng danh sách, badge màu |
| Số tab con | Đếm tab trong màn hình chi tiết |
| Ước lượng độ lớn | Số field form + số cột bảng + số tab → dùng cho ước số REQ |
| Screenshot 1 ảnh/module | `browser_take_screenshot(fullPage=true)` → `_discovery/evidence/` |

> Ở tầng khám phá, **1 ảnh full-page mỗi module là đủ** — chỉ để chứng minh module tồn tại. Chuẩn evidence đầy đủ (skill 7.2.1) áp dụng ở tầng recon cấp module, không phải ở đây.

**3.4 — Thăm dò phân quyền** (skill mục **3.1.2**): nếu user cấp nhiều account, đăng nhập lần lượt và so sánh menu nhìn thấy được. Chỉ có 1 account → áp quy tắc suy diễn ở 3.1.2 và **đánh dấu rõ là suy diễn**.

### Bước 3-M: Khám phá app mobile (mặt Mobile)

> Chỉ chạy khi có mặt mobile. Thao tác phiên + nhận diện loại app theo **`skills-mobile-debug-agent`** Bước 1–2; quy tắc nền tảng ở `appium_rules.md`.

```
select_device → appium_session_management(create) → appium_get_page_source → NHẬN DIỆN LOẠI APP → crawl
```

**3-M.1 — Nhận diện loại app trước khi crawl** (skill 3.5.1):

| Kết quả | Crawl thế nào |
|---|---|
| Native · Flutter đã bật semantics · Hybrid | Crawl theo 3-M.2 |
| **Flutter chưa bật semantics** (một `FlutterView` rỗng) | ⛔ **Không crawl tự động được.** Nhờ user dẫn đường qua từng màn hình chính, chụp ảnh từng màn. Mọi module của mặt mobile đánh `❔ Chưa đọc được phần tử`. Báo ngay việc dev phải làm (3 câu hỏi của `skills-mobile-debug-agent` mục Flutter). **CẤM** bấm theo toạ độ để tự dò |

**3-M.2 — Crawl điều hướng (làm cạn kiệt):**

| Việc | Cách làm | Bẫy hay gặp |
|---|---|---|
| Bottom navigation / tab bar | Mở **từng** tab, dump hierarchy mỗi tab | Tab thứ 5 trở đi hay gom vào mục "Thêm" |
| Drawer / menu hamburger · nút overflow `⋮` | Mở ra, cuộn hết | Mục cuối drawer hay bị sót |
| Màn hình Tài khoản / Cài đặt | Mở từng mục | Nhiều module cấu hình chỉ nằm ở đây |
| Màn hình giới thiệu lần đầu, xin quyền lúc mở app | Chỉ thấy khi cài mới / xoá dữ liệu app — `appium_app_lifecycle action=clear` | Chỉ làm khi user **đã cho phép** xoá dữ liệu app (Bước 0) |
| **Deep link** — tương đương "route ẩn" của web | Đọc `intent-filter` trong AndroidManifest (`apkanalyzer manifest print` / `aapt dump xmltree`) hoặc `CFBundleURLTypes` + associated domains trong Info.plist — **nếu** máy có công cụ; không có → hỏi user danh sách deep link | Link đoán ra mà không mở được → `❔ Nghi có, chưa xác minh`, không đưa vào danh mục module |
| Màn hình chỉ vào được bằng gesture (vuốt, nhấn giữ) | Hỏi user, hoặc thử trên một bản ghi | ⚠️ Môi trường dùng chung: **chỉ mở, không sửa** — app vẫn ghi vào backend chung |

**3-M.3 — Tầng network:** Appium **không** thấy HTTP. Có proxy (mitmproxy / Charles / HTTP Toolkit) và app không pin certificate → quan sát thụ động như Bước 3.2. Không có → ghi `Tầng network: không quan sát được` ở mục 1 của `system_map.md`, **không** suy endpoint.

**3-M.4 — Ghi nhận cho mỗi màn hình phát hiện được** — giống bảng 3.3 của web, khác 3 cột:

| Thông tin | Web | Mobile |
|---|---|---|
| Vị trí | URL / route | **Đường đi**: `Tab Đơn hàng → nút + → Tạo đơn` (và deep link nếu có) |
| Nền tảng | — | `Android` / `iOS` — khám phá **từng** nền tảng user cung cấp, không suy nền tảng này từ nền tảng kia |
| Ảnh | `browser_take_screenshot(fullPage)` | `appium_screenshot` (tự lưu, trả về đường dẫn) → **copy** thành `_discovery/evidence/<android\|ios>_<module>_overview.png`. Xoá thông báo / bật Không làm phiền trước khi chụp (skill 3.5.5) |

**3-M.5 — Ghép vào module:** đã khám phá mặt web → mỗi màn hình app **gắn vào module web cùng nghiệp vụ**, thêm nền tảng vào cột `Nền tảng` (skill 2.2). Màn hình chỉ có trên app (quét mã QR, đăng nhập vân tay, cài đặt thông báo đẩy) → gắn vào module nghiệp vụ tương ứng nếu có, không có mới đề xuất module mới.

### Bước 3-A: Khám phá API (mặt API)

> Chỉ chạy khi có mặt API. Toàn bộ quy trình lấy từ skill **3.4.1 → 3.4.4** — không tự chế cách khác.

1. **Lấy spec bản gốc** (skill 3.4.1) — tải thô bằng `curl` vào `_discovery/sources/`, **không** `WebFetch`. Trang Swagger UI / Scalar / Redoc là renderer → tìm URL spec thật hoặc khối spec nhúng inline. Swagger UI có **nhiều spec** → liệt kê, hỏi user phạm vi. Postman / `.docx` → đọc theo đúng dòng của bảng 3.4.1
2. **Kiểm snapshot:** đếm operation, đối chiếu số trên trang tài liệu; ghi phiên bản đặc tả + `sha256`
3. **Ma trận auth theo từng operation** (skill 3.4.3) — soi ngay endpoint 🌐 công khai trả dữ liệu cá nhân
4. **Ranh giới module** (skill 3.4.2):
   - Hệ thống chỉ có API → mỗi `tag` một module
   - Đã có mặt web/mobile → **ghép tag vào module đã có**, prefix giữ nguyên; tag không khớp → đề xuất ở checkpoint Bước 5
5. **Gọi thật kiểm chứng** — chỉ khi `Gọi API: ✅` (skill 3.4.4): 10–20 request, đọc trước ghi sau, tuân bảng quy tắc dữ liệu. Mỗi sai lệch thành phát hiện `F-nn` kèm bằng chứng đã che. Mode DOC → bỏ bước này, ghi rõ
6. **Ghi `api_map.md`** theo mẫu skill **5.8.2** — ghi ở **Bước 6** cùng các file khác, **sau** checkpoint

> Phát hiện `F-nn` mức 🔴 (endpoint công khai lộ dữ liệu cá nhân, không có hàng rào auth) → **báo user ngay**, đừng đợi tới checkpoint.

### Bước 4: Đối chiếu & chuẩn hoá danh sách module

**4.1 — Đối chiếu tài liệu ↔ UI (Mode HYBRID):**

| Kiểu lệch | Nghĩa | Xử lý ở tầng khám phá |
|---|---|---|
| Tài liệu có, UI không có | Chưa build / đã gỡ | Vẫn vào danh mục, trạng thái `⚪ Chưa implement`, ghi chú nguồn |
| UI có, tài liệu không nói | Tính năng ngoài tài liệu | Vào danh mục, mức phủ `⬜ Trắng` |
| Tên gọi khác nhau | Tài liệu "Đối tác" ↔ UI "Nhà cung cấp" | **Lấy tên UI làm chuẩn**, ghi tên tài liệu vào cột bí danh |
| Ranh giới module khác nhau | Tài liệu gộp, UI tách (hoặc ngược lại) | **Theo UI**, ghi 1 dòng cảnh báo trong `system_map.md` |

**4.1b — Đối chiếu giữa các mặt (khi có ≥ 2 mặt):**

| Kiểu lệch | Ví dụ | Xử lý |
|---|---|---|
| Web có, app không có | Báo cáo chỉ có trên web | Module giữ nguyên, cột `Nền tảng` chỉ ghi `Web` — **không** phải lỗi |
| App có, web không có | Quét mã QR, đăng nhập vân tay | Gắn vào module nghiệp vụ tương ứng (3-M.5) |
| Tag API không khớp module UI nào | Tag `Webhooks`, `Integrations` | Module mới **hoặc** tính năng chưa có UI → `⚪ Chưa implement` ở mặt UI |
| Module UI không có operation API nào trong spec | Màn hình gọi endpoint không khai trong spec | Ghi `⚠️ Spec thiếu` — thông tin có giá trị cho dev |
| Cùng nghiệp vụ, tên khác nhau giữa các mặt | Web "Khách hàng" · app "Liên hệ" · tag `Contacts` | **Tên mặt web làm chuẩn** (có web), các tên khác vào cột bí danh — **một** prefix |

**4.2 — Quyết định ranh giới module** (quyết định đắt nhất của cả workflow — sai là phải đánh lại prefix):

| Nguyên tắc | Áp dụng |
|---|---|
| **1 entity nghiệp vụ có vòng đời riêng = 1 module** | `Customer` và `Contact` tách, dù nằm chung menu |
| Tab con **không** có entity riêng → **không** tách | 17 tab của Project vẫn là 1 module `PRJ` |
| Tab con **có** entity riêng + CRUD riêng → tách | Tab "Hoá đơn" trong Project → module `INV` |
| Nhóm màn hình cấu hình rời rạc → gom 1 module `SETTING` | Tránh đẻ ra 20 prefix cho 20 trang cấu hình 1 field |
| Nghi ngờ → **gộp**, đừng tách | Gộp rồi tách sau vẫn giữ được REQ ID; tách rồi gộp thì vỡ |

**4.3 — Gán prefix:**
- Ngắn, **VIẾT HOA**, không dấu, 3–6 ký tự: `LOGIN`, `CUST`, `PRJ`, `INV`
- **Đối chiếu danh sách prefix đã chiếm** ở Bước 1 — trùng là phải đổi
- Prefix suy từ **tên nghiệp vụ**, không suy từ URL (URL hay đổi) hay tên controller/tag kỹ thuật
- **Một nghiệp vụ một prefix trên mọi mặt** (skill 2.2) — ❌ `CUST_APP`, `MCUST`, `CUSTAPI`
- Ghi cả **bí danh** nếu tài liệu, app hay tag API gọi tên khác

**4.4 — Đánh giá risk sơ bộ:**

| Mức | Dấu hiệu |
|---|---|
| 🔴 Cao | Liên quan tiền/quyền/dữ liệu khách hàng · nhiều module khác phụ thuộc · có status flow phức tạp · mức phủ tài liệu ⬜ Trắng |
| 🟡 Trung bình | CRUD thường · dùng hằng ngày · tài liệu 🟨 một phần |
| 🟢 Thấp | Màn hình tra cứu tĩnh · cấu hình ít đổi · tài liệu 🟩 đầy đủ |

### Bước 5: ⏸️ CHECKPOINT — chốt với user trước khi ghi file

**DỪNG LẠI.** Trình bày cho user:

1. **Bảng module phát hiện được** — tên, prefix đề xuất, loại màn hình, mức phủ tài liệu, risk, ước số REQ
2. **Danh sách nghi vấn** — route đoán được nhưng chưa mở được, module không chắc nên tách hay gộp
3. **Lệch pha tài liệu ↔ UI** (mode HYBRID) — liệt kê thẳng, đây là thứ user quan tâm nhất
4. **Bảng ghép nền tảng** (khi ≥ 2 mặt) — mỗi module có ở mặt nào, tag API / màn hình app nào ghép vào đâu, lệch giữa các mặt theo 4.1b
5. **Phát hiện `F-nn` của mặt API** (nếu có) — mức 🔴 đã báo ngay ở Bước 3-A thì nhắc lại
6. **Thứ tự khảo sát đề xuất** — xếp theo *phụ thuộc trước, risk sau*, không theo alphabet. Module nhiều mặt: ghi rõ mặt nào khảo sát trước

Hỏi đúng 3 câu (thêm câu thứ 4 khi có ≥ 2 mặt):
- Danh sách module đã đủ chưa? Có module nào tôi **không thấy được** vì thiếu quyền, nằm sâu trong menu, hoặc chỉ vào được bằng URL / deep link trực tiếp?
- Ranh giới tách/gộp có đúng cách team hiểu không?
- Thứ tự khảo sát ưu tiên thế nào?
- *(≥ 2 mặt)* Chỗ tôi ghép tag API / màn hình app vào module có đúng không? Có tag nào thực chất là nghiệp vụ riêng?

> Câu đầu là quan trọng nhất — user thường biết những module agent **không có cách nào thấy được**. Trả lời ở đây thì chưa file nào bị ghi; phát hiện sau đó phải chạy **Mode ADD** để bổ sung.

⚠️ **Chưa có phản hồi thì chưa ghi file.** Prefix ghi ra rồi là bất biến — sửa sau tốn hơn hỏi trước rất nhiều.

### Bước 6: Ghi file đầu ra

Sau khi user chốt, ghi đúng 3 nhóm file:

```
docs/requirements/
├── README.md                          ← DANH MỤC — tạo mới hoặc BỔ SUNG dòng
└── _discovery/
    ├── system_map.md                  ← INDEX — TÊN FILE BẤT BIẾN (mặt web + mobile)
    ├── api_map.md                     ← INDEX mặt API — TÊN FILE BẤT BIẾN, mẫu ở skill 5.8.2
    ├── modules/                        ← chỉ khi tách (ngưỡng 6.2)
    │   ├── module_01_dang_nhap_phan_quyen.md
    │   └── module_02_khach_hang.md
    ├── doc_inventory.md               ← chỉ mode HYBRID/DOC — bản đồ phủ tài liệu
    ├── sources/                       ← bản gốc tài liệu QA cung cấp · openapi_<ngày>.json · postman_<ngày>.json
    └── evidence/
        ├── <module>_overview_fullpage.png          ← web
        └── <android|ios>_<module>_overview.png     ← mobile
```

| Hệ thống có | Ghi file nào |
|---|---|
| Chỉ web / web + mobile | `system_map.md` |
| Chỉ API | `api_map.md` — là **điểm vào duy nhất**, không tạo `system_map.md` rỗng |
| UI (web/mobile) + API | **Cả hai**. Bảng module của `system_map.md` là nơi **duy nhất** ghi ghép prefix ↔ tag API (cột `Nền tảng`); `api_map.md` tham chiếu ngược, không nhân bản |

**6.1 — Ngưỡng tách file bản đồ** (đếm số module **sau khi** user chốt ở Bước 5):

| Số module | Cấu trúc |
|---|---|
| **≤ 8** | 1 file `system_map.md` — đủ ngắn để đọc một lượt |
| **> 8** | Tách: `system_map.md` (index) + `modules/module_NN_<slug>.md` |

Tách ngay kể cả khi ≤ 8 module, nếu gặp **bất kỳ** dấu hiệu:
- Có module ≥ 5 tab con hoặc ≥ 30 field — mô tả riêng nó đã dài hơn cả phần còn lại
- Hệ thống chia theo **phân hệ** rõ rệt (Bán hàng · Kho · Kế toán) — tách theo phân hệ đọc dễ hơn hẳn
- Nhiều người cùng khảo sát song song — mỗi người một file, tránh đụng nhau khi commit

**6.2 — `docs/requirements/README.md`** theo schema skill mục 5.7.2, bảng danh mục **thêm 2 cột** phục vụ khám phá:

| Module | Prefix | Nền tảng | Trạng thái recon | Mức phủ tài liệu | Tài liệu | REQ đã dùng | Mã kế tiếp | AMB treo | Cập nhật |
|---|---|---|---|---|---|---|---|---|---|
| Khách hàng | `CUST` | Web ⬜ · Android ⬜ · API ⬜ | ⬜ Chưa khảo sát | 🟨 Một phần | — | — | `REQ-CUST-01` | — | 10-08-2026 |
| Đăng nhập | `LOGIN` | Web ✅ · Android ⬜ | 🟨 Đang khảo sát | 🟩 Đầy đủ | `login/REQUIREMENTS_LOGIN_SUMMARY.md` | 01 → 14 | `REQ-LOGIN-15` | AMB-LOGIN-02 | 11-08-2026 |

Cột `Nền tảng` mang dấu trạng thái **riêng từng mặt** — `Trạng thái recon` tổng chỉ ✅ khi **mọi** mặt đã ✅ (hoặc ⏸️ hoãn có lý do). Hệ thống chỉ một mặt → có thể bỏ cột (skill 5.7.2).

**Bảng mã trạng thái recon:**

| Ký hiệu | Nghĩa | Hành động tiếp theo |
|---|---|---|
| ⬜ | **Chưa khảo sát** — mới chỉ phát hiện tên | Chạy `/generate-requirements-from-website` |
| 🟨 | **Đang khảo sát** — recon dở dang | Tiếp tục, nêu rõ đang dở ở đâu |
| ✅ | **Đã có tài liệu** — `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` đã phát hành | Sẵn sàng sinh test case |
| ⏸️ | **Hoãn** — user chốt ngoài phạm vi đợt này | Ghi lý do, giữ prefix |
| ⚪ | **Chưa implement** — phát hiện qua tài liệu/API, UI chưa có | Không recon được; viết TC trước, đánh `skip` |

**6.3 — Phân chia nội dung giữa index và file module (quy tắc cứng)**

Nguyên tắc: **cái gì cắt ngang nhiều module thì ở index, cái gì thuộc riêng một module thì ra file module.** Nhân bản nội dung cắt ngang vào từng file là lỗi — sửa một chỗ quên chỗ kia.

| Mục | Đặt ở đâu | Lý do |
|---|---|---|
| 1. Bối cảnh khảo sát — ngày · mode · URL · role đã dùng · môi trường dùng chung · phạm vi crawl | **Index** | Áp cho cả đợt khảo sát |
| 2. Sơ đồ điều hướng toàn hệ thống — cây menu nguyên trạng kèm route | **Index** | Chỉ có nghĩa khi nhìn tổng thể |
| 3. **Bảng module tổng** — tên UI · bí danh (kể cả tên trên app, tên tag API) · prefix · **nền tảng** · file khám phá · loại màn hình · risk · ước REQ | **Index** | Bản đồ điều hướng, thay cho việc mở từng file |
| 2b. Sơ đồ điều hướng **app mobile** — cây tab/drawer kèm đường đi, deep link, mỗi nền tảng một cây | **Index** | Cùng lý do mục 2 |
| 4. Bản đồ entity & phụ thuộc | **Index** | Bản chất là quan hệ **giữa** các module |
| 5. Ma trận phân quyền **sơ bộ** cấp module | **Index** | Cắt ngang mọi module |
| 6. Thứ tự khảo sát đã chốt + module `BLOCKED` | **Index** | Kế hoạch cấp đợt |
| 7. Nhật ký khám phá | **Index** | Một dòng cho mỗi lần chạy `/discover-system` |
| **Bản đồ tài liệu** (khi tách) | **Index** | Xem 6.3 — bắt buộc |
| Chi tiết từng module — route · loại màn hình · CRUD · status flow · số tab · số field ước lượng · risk kèm lý do | **File module** | Đơn vị chia việc |
| Phát hiện tầng network **của riêng module** — endpoint · field ẩn · enum trạng thái | **File module** | Gắn với module đó |
| Vùng chưa xác minh **của riêng module** | **File module** | Người nhận module đó cần biết |
| Link evidence của module | **File module** | Đi cùng mô tả |

> Phát hiện network **cấp hệ thống** (endpoint không thuộc module nào, ranh giới entity) vẫn ở **index** mục 4.

**6.4 — Hợp đồng đọc: index bất biến + Bản đồ tài liệu**

Giống nguyên tắc `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` ở skill mục 5.5 — workflow phía sau chỉ cần biết **một** đường dẫn:

```
docs/requirements/_discovery/system_map.md
```

Bất kể có tách hay không. Khi tách, index **BẮT BUỘC** có mục:

```markdown
## Bản đồ tài liệu
| File | Module bao phủ | Prefix | Trạng thái recon |
|---|---|---|---|
| [modules/module_01_dang_nhap_phan_quyen.md](modules/module_01_dang_nhap_phan_quyen.md) | Đăng nhập · Người dùng · Vai trò | `LOGIN` · `USER` · `ROLE` | ⬜ ⬜ ⬜ |
| [modules/module_02_khach_hang.md](modules/module_02_khach_hang.md) | Khách hàng | `CUST` | ✅ |
```

Không có mục này → workflow sau hiểu là bản đồ 1 file và **sẽ không bao giờ mở thư mục `modules/`**.

**6.5 — Quy tắc đặt tên & gộp module vào chung file**

**Đặt tên:** `module_NN_<slug>.md`
- `NN` — số thứ tự **theo thứ tự khảo sát đã chốt** ở Bước 5, không theo alphabet
- `<slug>` — tiếng Việt **không dấu**, gạch dưới, mô tả nghiệp vụ: `khach_hang`, `du_an_cong_viec`
- File gộp nhiều module → tên phải **nêu được cả nhóm**, không lấy tên module lớn nhất rồi giấu phần còn lại:

| ✅ Đúng | ❌ Sai | Vì sao |
|---|---|---|
| `module_01_dang_nhap_phan_quyen.md` | `module_01_login.md` | File còn chứa Người dùng + Vai trò, tên phải nói ra |
| `module_03_du_an_cong_viec.md` | `module_03_project.md` | Ưu tiên tiếng Việt, và Task bị giấu |
| `module_05_danh_muc_he_thong.md` | `module_05_misc.md` | "misc" không cho biết bên trong có gì |

**Khi nào được gộp** — thoả **ít nhất một**:

| Điều kiện | Ví dụ |
|---|---|
| Quan hệ **cha–con chặt**, con không tồn tại độc lập | `Dự án` ↔ `Công việc` — task luôn thuộc một project |
| **Luôn được khảo sát cùng nhau**, dùng chung màn hình cấu hình | `Đăng nhập` ↔ `Người dùng` ↔ `Vai trò` |
| Nhiều module **nhỏ cùng loại** (mỗi cái 1–2 màn hình tra cứu/cấu hình) | Các trang danh mục: Đơn vị tính · Khu vực · Nguồn khách |
| Cùng **một phân hệ** và số module trong phân hệ ≤ 3 | Kho: `Nhập kho` · `Xuất kho` · `Tồn kho` |

**Khi nào KHÔNG được gộp:**
- ❌ Chỉ vì "nằm cùng menu" — menu là cách trình bày, không phải quan hệ nghiệp vụ
- ❌ Hai module đều 🔴 risk cao — mỗi cái xứng đáng một file để soi kỹ
- ❌ Gộp **quá 3 module** vào một file — quá 3 thì file dài bằng bản đồ chưa tách, tách vô nghĩa
- ❌ Gộp module ⬜ chưa khảo sát với module ✅ đã có tài liệu — hai trạng thái tiến độ khác nhau, khó theo dõi

**Bất biến khi tách/gộp — kiểm trước khi bàn giao:**

- [ ] **Prefix giữ nguyên tuyệt đối** — gộp file **KHÔNG** gộp prefix. 3 module chung một file vẫn là 3 prefix `LOGIN` · `USER` · `ROLE`, và về sau vẫn sinh ra 3 file `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` riêng
- [ ] **Mỗi module thuộc đúng 1 file** — không mồ côi, không nằm ở 2 file
- [ ] **Tổng module trong các file = tổng module ở bảng index** — ghi rõ con số ở index để tự kiểm chứng
- [ ] **Cột `Trạng thái recon` chỉ có ở một nơi** — file `README.md` danh mục. File module ở `_discovery/` **tham chiếu**, không nhân bản (nhân bản là chắc chắn lệch nhau sau vài lần cập nhật)
- [ ] Mỗi file module có link ngược về index; index có link tới mọi file module
- [ ] Nội dung cắt ngang (mục 2 · 4 · 5 · 6) **không** bị chép vào file module

> **Tách/gộp lại về sau là an toàn** — bản đồ khám phá không mang mã REQ (Bước 0), nên chuyển module sang file khác không phá vỡ traceability. Đây chính là lý do tầng khám phá không được cấp số REQ.

**6.6 — `_discovery/doc_inventory.md`** (mode HYBRID/DOC): Bản đồ phủ tài liệu (Bước 2.3) + danh mục file gốc + bảng lệch pha tài liệu ↔ UI (Bước 4.1).

### Bước 7: Bàn giao

**Checklist trước khi báo xong:**

- [ ] Mọi module có prefix **duy nhất**, không trùng prefix đã chiếm từ trước
- [ ] Prefix của module **đã có tài liệu từ trước giữ nguyên tuyệt đối**
- [ ] **Không có mã `REQ-XXX-NN` nào** trong toàn bộ output của workflow này
- [ ] Mỗi module có ≥ 1 ảnh trong `_discovery/evidence/`, hoặc ghi rõ lý do không có
- [ ] Ô phân quyền **suy diễn** đều mang dấu ⚠️, không lẫn với ô đã kiểm chứng
- [ ] Vùng chưa xác minh được liệt kê thật, **không** làm tròn thành "đã khảo sát xong"
- [ ] `README.md` và `system_map.md` khớp nhau về số module và prefix
- [ ] **Danh mục khớp thư mục thực tế** — đã chạy đối chiếu ở Bước 1.3; lệch thì đã sửa và ghi Nhật ký danh mục, hoặc đã báo user (trường hợp trùng prefix)
- [ ] **Nếu đã tách file:** index vẫn tên `system_map.md` · có mục `## Bản đồ tài liệu` · đủ 6 bất biến ở mục **6.5** (prefix giữ nguyên · mỗi module đúng 1 file · tổng khớp · trạng thái recon chỉ ở `README.md` · link 2 chiều · không nhân bản mục cắt ngang)
- [ ] Tên file gộp **nêu đủ nhóm** module bên trong, không giấu module nào (mục 6.5)
- [ ] `.env` chứa URL/tài khoản — `docs/` **không** chứa credentials
- [ ] **Nhiều mặt:** mỗi nghiệp vụ đúng **một** prefix trên mọi mặt; cột `Nền tảng` có ở cả `README.md` lẫn bảng module của `system_map.md`, và khớp nhau
- [ ] **Mặt mobile:** loại app đã nhận diện và ghi ở mục 1 của `system_map.md`; Flutter chưa bật semantics thì đã báo việc cho dev; ảnh mobile đã xoá thông báo trước khi chụp; ghi rõ tầng network có quan sát được không
- [ ] **Mặt API:** spec tải thô, số operation khớp trang tài liệu, có `sha256` trong Nhật ký; ma trận auth theo **từng** operation; `api_map.md` đúng mẫu skill 5.8.2; mọi bản ghi tạo khi gọi thử đã dọn (số tạo / số dọn ghi trong báo cáo); **không** bản ghi có sẵn nào bị sửa/xoá

**Báo cáo cho user:**
- Số module phát hiện · số đã có tài liệu · số còn trắng — tách theo từng mặt khi có ≥ 2 mặt
- Mode + mặt đã chạy + phạm vi tài liệu/spec đã nạp
- Danh sách vùng chưa xác minh (cần thêm quyền / thêm account / thêm dữ liệu / dev bật semantics / quyền gọi API)
- **Lệnh kế tiếp**, theo đúng thứ tự đã chốt:
  ```
  /generate-requirements-from-website <module>   ← mặt web
  /generate-requirements-from-mobile <module>    ← mặt app — mỗi nền tảng một lượt
  /generate-requirements-from-api <module>       ← mặt API
  ```
  Module nhiều mặt: chạy **lần lượt từng mặt** — mỗi mặt ghi vào tầng `web/` · `mobile/` · `api/` của **cùng** thư mục module, REQ dùng chung lên index. Nhắc: mỗi lần chạy xong nhớ cập nhật cột `Nền tảng` + `Trạng thái recon` trong danh mục.

---

## Bổ sung module do user chỉ ra (Mode ADD)

> Kích hoạt khi user nói: *"còn thiếu module X"* · *"menu Báo cáo bạn chưa khảo sát"* · *"vào /admin/settings xem"* — tức **user biết có module mà agent không thấy được**.
>
> Khác với Delta bên dưới: ở đây **không crawl lại toàn hệ thống**, chỉ xử lý đúng phần user chỉ.

**Vì sao agent hay sót — hỏi lại user đúng câu để biết đường đi:**

| Nguyên nhân | Dấu hiệu | Cần user cung cấp |
|---|---|---|
| **Thiếu quyền** — account đang dùng không thấy menu | Module chỉ hiện với role cao hơn | Account có quyền, hoặc xác nhận "chỉ role X thấy" |
| **Menu chỉ hiện khi hover/click nhiều tầng** | Nằm ở menu cấp 3 trở lên | Đường đi menu: `Hệ thống → Cấu hình → Phân quyền` |
| **Route không có trong menu** | Vào được bằng URL trực tiếp | URL đầy đủ |
| **Chỉ vào được từ hành động trên bảng** | Bấm nút trong dòng dữ liệu mới ra | Mô tả thao tác để tới đó |
| **Cần dữ liệu mới hiện** | Danh sách rỗng nên không có nút/tab nào | Bản ghi mẫu để mở, hoặc xác nhận môi trường chưa có data |
| **Bị ẩn bởi feature flag / chưa bật** | Có API nhưng không có UI | Xác nhận tính năng đã bật chưa |

**Các bước:**

1. **Hỏi user đủ 2 thứ**: đường đi tới module (URL hoặc menu path) + lý do agent không thấy (theo bảng trên). Thiếu đường đi thì không tự đoán route
2. **Thử truy cập thật:**

| Kết quả | Xử lý |
|---|---|
| ✅ Vào được | Khảo sát như Bước 3, ghi nhận đầy đủ, `Nguồn` = `UI thực tế` |
| ❌ Không vào được (403 / không có quyền / chưa có data) | **Vẫn thêm vào danh mục** với `Trạng thái recon` = ⬜ và ghi rõ ở mục 7 của index: *"Chưa xác minh được — thiếu quyền, chờ account role X"*. `Nguồn` = **`User cung cấp — chưa xác minh UI`** |

3. **Cấp prefix** — đối chiếu danh sách prefix đã chiếm trong `README.md`, chọn prefix chưa dùng
4. **Ghi vào đúng file** theo bảng "Module mới xuất hiện — thêm vào đâu" ở phần Delta bên dưới
5. **Cập nhật 3 nơi**: bảng module ở index · `README.md` danh mục · **Nhật ký khám phá** (ghi rõ `Nguồn: user bổ sung`)
6. **Xem lại thứ tự khảo sát** ở mục 6 của index — module mới chen vào đâu, có `BLOCKED` module nào không

⚠️ **KHÔNG được ghi module user chỉ ra như thể đã tự khảo sát.** Vào được thì mới ghi `UI thực tế`; không vào được thì `User cung cấp — chưa xác minh UI`. Trộn hai cái là bước sinh TC sau đó sẽ tin nhầm vào thứ chưa ai nhìn thấy.

💡 **Rẻ nhất là chặn ngay ở checkpoint Bước 5** — lúc đó agent hỏi thẳng *"có module nào tôi không thấy được vì thiếu quyền?"*. Trả lời ở đó thì chưa file nào được ghi, không phải sửa gì cả.

### ADD một **mặt** mới cho hệ thống đã có bản đồ

User đưa thêm app mobile hoặc spec API cho hệ thống đã khám phá mặt web:

1. Bước 0 chỉ hỏi phần của mặt mới (bảng Bước 0, dòng Mặt mobile / Mặt API)
2. Chạy **đúng** Bước 3-M hoặc 3-A — **không** crawl lại web
3. Ghép vào module đã có theo 3-M.5 / 3-A.4 và bảng 4.1b. Prefix cũ giữ nguyên tuyệt đối
4. Checkpoint Bước 5 rút gọn: chỉ trình bảng ghép nền tảng + module mới (nếu có) + `F-nn` 🔴
5. Cập nhật cột `Nền tảng` ở `README.md` và `system_map.md`; mặt API thì tạo `api_map.md`. Module đang ✅ mà thêm mặt mới ⬜ → `Trạng thái recon` tổng về 🟨
6. Ghi Nhật ký khám phá: `Nguồn: user bổ sung mặt <Mobile/API>`

---

## Chạy lại lần sau (Delta)

> Dùng khi **hệ thống đã thay đổi** (deploy tính năng mới) hoặc muốn **rà lại toàn bộ** — agent tự crawl và so sánh. User chỉ đích danh một module thì dùng Mode ADD ở trên cho nhanh.

Hệ thống có module mới, hoặc lần trước bỏ sót:

1. Bước 1 đọc `system_map.md` cũ → biết đã có gì. Có mục `## Bản đồ tài liệu` thì đọc tiếp các file trong `modules/`
2. Crawl lại, **so sánh** với bảng module cũ
3. Chỉ báo cáo **phần chênh**: module mới · module biến mất · route đổi · menu đổi tên
4. Ghi thêm dòng vào **Nhật ký khám phá**, **không** viết đè bảng cũ
5. Module biến mất khỏi UI → **không xoá dòng**, đổi trạng thái + ghi chú ngày — cùng nguyên tắc "không xoá REQ" ở skill mục 6.2

**Module mới xuất hiện — thêm vào đâu:**

| Tình huống | Xử lý |
|---|---|
| Bản đồ **chưa tách** và tổng module vẫn ≤ 8 | Thêm dòng vào `system_map.md` |
| Bản đồ **chưa tách** nhưng thêm xong vượt 8 | Tách ngay lần này — số `NN` giữ đúng thứ tự khảo sát đã chốt trước đó |
| Bản đồ **đã tách**, module mới thuộc nhóm đã có | Thêm vào file nhóm đó (nếu file đó chưa quá 3 module), cập nhật `## Bản đồ tài liệu` |
| Bản đồ **đã tách**, module mới độc lập | File mới `module_NN_<slug>.md` với `NN` = số kế tiếp — **không** đánh lại số các file cũ |

⚠️ **Không đổi tên file module đã có** chỉ vì thứ tự ưu tiên thay đổi. Thứ tự khảo sát cập nhật ở mục 6 của index; tên file giữ nguyên để link cũ không gãy.
