---
description: Sinh API test cases từ đặc tả — Swagger UI / Scalar / Redoc / OpenAPI / Postman — neo vào REQ của /generate-requirements-from-api, có kiểm chứng bằng gọi thật. Tự nhận nguồn URL hay file. KHÔNG sinh code — automation dùng /generate-automation-api.
skills:
  - skills-requirements-analyzer
  - skills-test-data-generator
---

# Command: Sinh API Test Cases

> **BẮT BUỘC (MANDATORY SKILL):** Nạp **`skills-requirements-analyzer`** — tầng khám phá API (lấy spec · ma trận auth · gọi thật kiểm chứng · `api_map.md`) dùng **chung** luật với `/discover-system`, nguồn duy nhất là mục **3.4.1 → 3.4.4** và **5.8.2**. Tham khảo **`skills-test-data-generator`** để sinh test data đúng chuẩn.

Command này phân tích đặc tả API, xác định endpoint, và sinh **API test cases** có cấu trúc, truy vết được về REQ. **Không** sinh code — xong thì chạy `/generate-automation-api`.

**Vị trí trong chuỗi:**

```
/discover-system (nhánh API) → /generate-requirements-from-api → /generate-testcases-api → /generate-automation-api
        api_map.md                  REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md       test_cases_<module>_api.md    code + reports/
```

Chạy thẳng command này khi chưa có hai tầng trước vẫn được — Bước 1 tự làm tầng khám phá — nhưng TC sẽ **không có REQ** để neo (xem Bước 2).

> **Không có mode.** Nguồn là URL (Swagger UI, Scalar, Redoc, Stoplight, RapiDoc, URL spec `.json`/`.yaml`) hay file (OpenAPI, Postman collection) — agent tự nhận và lấy theo đúng dòng của bảng skill **3.4.1**. User không phải khai loại nguồn.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **KHÔNG đoán** schema/endpoint — phải đọc spec thực tế (JSON/YAML)
- **KHÔNG tin spec suông** — spec là *lời khai*, không phải *hành vi*. Phải gọi thật để kiểm chứng (Bước 1b)
- **Đọc trước khi làm lại:** đã có `api_map.md` và `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` thì dùng, không khám phá lại, không tự đặt prefix
- **Phải chờ user xác nhận** scope tại Bước 2 trước khi sinh chi tiết
- Nếu user chưa cung cấp nguồn spec → hỏi trước khi bắt đầu

## 🚨 Quy tắc dữ liệu khi gọi thật (BẮT BUỘC — đọc trước request đầu tiên)

> Vi phạm từng **xoá mất tài khoản gốc của hệ thống demo**. Bảng luật đầy đủ nằm ở skill `skills-requirements-analyzer` mục **3.4.4** — đọc hết trước khi gọi. Ba luật không có ngoại lệ:

1. **Không ghi/xoá bản ghi không do chính phiên này tạo ra** — kể cả khi user nói "được xoá thoải mái". CẤM lấy `id` từ API danh sách rồi `PATCH`/`DELETE`
2. **BOLA/IDOR chỉ kiểm bằng 2 tài khoản tự tạo** (`userA`, `userB`)
3. **Dọn sạch bản ghi đã tạo** — báo cáo số tạo / dọn / còn sót; lỡ đụng dữ liệu thật → báo user ngay, ghi mục **Sự cố** của `api_map.md`

## Các bước thực hiện

### Bước 1: Tiếp nhận & Phân tích Spec (Parse & Analyze)

0. **Đã có tầng khám phá?** Tìm `_discovery/api_map.md` (thư mục mặc định, hoặc namespace `_<hệ-thống>/`):
   - **Có** → tải lại spec, so `sha256` với snapshot mới nhất. Khớp → đọc `api_map.md`, **bỏ qua 1.1 → 1c**, sang Bước 2. Khác → spec đã đổi: snapshot mới, cập nhật `api_map.md` phần chênh, và đề xuất user chạy `/generate-requirements-from-api` (delta) trước khi sinh TC
   - **Chưa** → làm 1.1 → 1c bên dưới
1. **Lấy spec bản gốc** theo skill **3.4.1** — bảng xử lý đủ Swagger UI (kể cả **nhiều spec** trong dropdown `urls`), Scalar (URL **hoặc** spec nhúng inline), Redoc, Stoplight, RapiDoc, Postman collection:
   - Tải thô bằng `curl -sSL -o <file>` rồi `Read`. ❌ **KHÔNG dùng `WebFetch`** — kết quả đã qua xử lý/tóm tắt, spec lớn bị cắt âm thầm
   - VD Scalar: `https://book.anhtester.com/swagger` là renderer → spec thật tại `https://book.anhtester.com/swagger/json`
   - Đầu vào là **file `.docx`/`.pdf` mô tả API** (không có OpenAPI) → command này không sinh TC thẳng từ đó được: chạy `/generate-requirements-from-api` trước (skill 3.4.6), rồi sinh TC từ REQ
2. **Snapshot spec ngay** vào `docs/requirements/[_<hệ-thống>/]_discovery/sources/openapi_<YYYY-MM-DD>.json` — spec online sẽ đổi, tài liệu phải neo vào một bản cố định. Đếm số operation, đối chiếu trang tài liệu. Namespace `_<hệ-thống>/` **chỉ** khi API là hệ thống thứ hai của repo; API của hệ thống đã có UI ghi vào thư mục mặc định (CLAUDE.md mục 6b).
3. **Parse spec** và trích xuất thông tin:
   - Base URL, API version, authentication scheme (Bearer, API Key, OAuth2, Basic)
   - Danh sách tất cả endpoints: `method + path`
   - Request parameters: path, query, header, body (schema + required fields)
   - Response schemas: status codes, response body structure
   - Models/Definitions: reusable data models
4. **🔑 Lập ma trận Auth theo TỪNG operation (BẮT BUỘC — dễ bỏ sót nhất):**

   `security` khai ở **cấp gốc** là mặc định, nhưng **mỗi operation được ghi đè**. Operation có `security: []` là **công khai — không cần token**, dù spec gốc khai `BearerAuth`. Swagger UI **không** hiển thị rõ khác biệt này.

   ```js
   // Với mỗi operation:
   const congKhai = Array.isArray(op.security) && op.security.length === 0;
   ```

   Xuất bảng: `| Method | Path | 🌐 Công khai / 🔒 Cần token |` và **soi kỹ**: endpoint nào trả dữ liệu cá nhân (user, đơn hàng, hồ sơ) mà lại công khai → đánh dấu 🔴 ngay.

5. **Phân loại endpoints** theo nhóm:
   - **CRUD operations** — Create, Read, Update, Delete
   - **Authentication** — Login, Register, Token refresh
   - **Business Logic** — Các API xử lý nghiệp vụ phức tạp
   - **Utility** — Health check, config, metadata
6. **Gán mã module** theo skill **3.4.2**:
   - **Đọc `README.md` danh mục trước** để không trùng prefix đã chiếm
   - API của hệ thống **đã có web/app** → ghép `tag` vào module đã có, **dùng prefix cũ** (skill 2.2) — không mở prefix riêng cho API
   - Hệ thống **chỉ có API** → `tags` làm ranh giới module. Là hệ thống thứ hai của repo (namespace) thì REQ mang mã hệ thống ngắn (2–4 ký tự, VD `BK`) → `REQ-<HỆ_THỐNG>-<MODULE>-<nn>`
   - TC ID **luôn** là `<HỆ_THỐNG>_<MODULE>_TC_<nnn>` với tiền tố hệ thống đã chốt ở danh mục — dùng lại, không đặt mới

### Bước 1b: Kiểm chứng spec bằng gọi thật (BẮT BUỘC — KHÔNG được bỏ)

> Spec khai `403` không có nghĩa hệ thống **trả** `403`. Spec khai `required` không có nghĩa hệ thống **chặn**. Sinh TC từ spec chưa kiểm chứng = sinh ra một tập TC sai kỳ vọng, chạy cái nào cũng FAIL nhầm.

Điều kiện: dòng `Gọi API` ở danh mục là ✅ — chưa có thì hỏi user một lần và ghi vào danh mục.

Gọi **10–20 request thật** theo **bảng nhóm probe ở skill 3.4.4** (GET công khai không token · endpoint cần token mà không gửi token · tài khoản tự đăng ký gọi endpoint nhạy cảm · bơm giá trị ngoài ràng buộc · đọc header + `Set-Cookie` · đối chiếu status thực tế vs spec). Đọc trước, ghi sau — và ghi thì tuân thủ quy tắc dữ liệu ở trên.

Mỗi sai lệch ghi thành một **phát hiện** `F-nn` kèm **bằng chứng nguyên văn** (request + status + trích body, **đã che** token và dữ liệu cá nhân), phân mức 🔴/🟠/🟡. Chỗ nào hệ thống làm **đúng** cũng ghi lại — đó là TC chống hồi quy.

### Bước 1c: Ghi bản đồ API xuống đĩa

Xuất `docs/requirements/[_<hệ-thống>/]_discovery/api_map.md` — **tên file bất biến**, nội dung theo **đúng mẫu skill 5.8.2** (metadata · bảng module & prefix · danh mục operation có cột Auth · phát hiện `F-nn` · ambiguity · ghi chú automation · Nhật ký + Sự cố).

Cập nhật `README.md` danh mục hệ thống (tạo mới nếu chưa có): bảng module · prefix đã chiếm · cột `Nền tảng` thêm `API` · AMB 🔴 treo · phát hiện bảo mật.

> ⚠️ **Tầng khám phá KHÔNG cấp mã `REQ`** — chỉ cấp **mã module**. Cùng quy tắc với `_discovery/system_map.md` bên nhánh UI.

### Bước 2: Xác nhận Scope (CHECKPOINT — ⏸️ DỪNG LẠI)

1. **Trình bày tóm tắt** cho user review:
   - Tổng số endpoints phát hiện (phân nhóm) + **số công khai / số cần token**
   - Authentication method
   - Danh sách endpoint groups + số lượng API mỗi nhóm
   - **Phát hiện `F-nn` mức 🔴 từ Bước 1b** — báo ngay, đừng đợi đến báo cáo cuối
   - **Ambiguity 🔴 đang chặn** — kèm rõ nó chặn nhóm TC nào
   - **Tình trạng REQ** của từng module trong scope — đã có REQ API (`api/requirements_<module>_api.md` hoặc REQ dùng chung ở index) chưa?
2. **Hỏi user xác nhận:**
   - "Bạn muốn test tất cả endpoints hay chỉ tập trung vào nhóm nào?"
   - **Từng AMB 🔴:** hành vi quan sát được là **lỗi cần báo** hay **thiết kế cần xác nhận**? Câu trả lời đổi hẳn nội dung TC — cùng một hành vi ra TC bug hoặc TC hồi quy
3. **Chờ user xác nhận** scope trước khi sang Bước 3

> Nếu user chưa chốt được AMB 🔴 (phải hỏi dev/BA): **vẫn sinh TC** cho phần không phụ thuộc, đánh dấu phần còn lại `⚪ Chờ chốt <mã AMB>` — **không** dừng cả workflow vì một câu hỏi treo.

**Module chưa có REQ API** — mặc định đề xuất chạy `/generate-requirements-from-api <module>` trước: TC không có REQ thì `/generate-traceability-matrix` báo toàn bộ là TC mồ côi, và mọi thay đổi spec về sau không có đường báo TC nào stale. User vẫn muốn sinh TC ngay → được, nhưng cột `REQ ID` ghi `⚠️ Chưa có REQ` (không bịa mã REQ), và báo cáo cuối nêu rõ số TC chưa neo.

### Bước 3: Sinh API Test Scenarios & Test Data

1. **Bao phủ 12 HTTP Status Codes tiêu chuẩn:**
   - **200/201:** Success
   - **400:** Validation error / Malformed JSON
   - **401:** Missing / Invalid Auth Token
   - **403:** Forbidden / BOLA IDOR User A -> User B
   - **404:** Not Found
   - **406:** Not Acceptable (Accept header mismatch)
   - **409:** Conflict (Duplicate record / Race condition concurrency)
   - **413:** Payload Too Large
   - **415:** Unsupported Media Type (Content-Type mismatch)
   - **429:** Too Many Requests (Rate Limiting)
   - **500:** Server error

2. **Với mỗi endpoint** trong scope đã xác nhận, sinh test scenarios theo 7 loại:
   - **✅ Happy Path** — Request hợp lệ, response đúng schema + status code
   - **❌ Negative — Validation** — Thiếu required fields, sai data type, vượt max length
   - **❌ Negative — Auth** — Không có token, token hết hạn, token sai role
   - **🔲 Boundary** — Min/max values, empty string, null, special characters
   - **⚡ Edge Cases** — Concurrent requests, duplicate creation, large payload, unicode/emoji
   - **🔒 Security** — SQL injection, XSS, IDOR, Mass Assignment, ReDoS, sensitive data exposure
   - **📄 Pagination & Filtering** — Phân trang, sắp xếp, tìm kiếm

3. **Sinh Test Data Matrix** (sử dụng skill `skills-test-data-generator`):
   - Data valid cho Happy Path
   - Data invalid cho Negative cases (mỗi field 1 bộ negative)
   - Boundary values theo schema constraints (minLength, maxLength, min, max, pattern)
   - Data phải **unique + traceable** (VD: `auto_api_1712049200@test.com`)

4. **Field-Level Validation cho Request Body (BẮT BUỘC):**

   Với mỗi endpoint có request body (POST/PUT/PATCH), agent **PHẢI liệt kê từng field** trong body và sinh negative TCs riêng cho TỪNG field (String, Email, Phone, Number, Boolean, Date, Enum, Array, Nested Object, File).

5. **OWASP API Security Testing Checklist:**

   | Loại | Test Scenarios |
   |---|---|
   | **Injection** | SQL injection trong query params (`?id=1 OR 1=1`) · SQL injection trong body fields · XSS trong input fields · Command injection (nếu API xử lý shell) |
   | **BOLA / IDOR (403)** | Truy cập resource của user khác bằng ID (`GET /users/999` khi user chỉ có quyền xem user 123) · Thay đổi ID trong PUT/DELETE để sửa/xóa resource không phải của mình — **chỉ bằng 2 tài khoản tự tạo** |
   | **Mass Assignment** | Gửi kèm trường đặc quyền trong request body (như `role: "admin"`, `is_admin: true`) xem API có tự gán quyền không |
   | **Auth Bypass (401/403)** | Gọi API không có token → 401 · Token hết hạn → 401 · Token role thấp gọi API role cao → 403 · Token bị tamper → 401 |
   | **ReDoS** | Truyền chuỗi quá dài (> 10.000 chars) vào các field validate regex để kiểm tra Denial of Service |
   | **Sensitive Data Exposure** | Response không trả về password/hash/secretKeys · Response không leak internal IDs/stack traces · Headers không leak server info (`X-Powered-By`, `Server`) |
   | **Rate Limiting (429)** | Gửi nhiều request liên tục → phải bị giới hạn (429) · Brute force login → lock account |
   | **CORS & Headers** | Kiểm tra `Access-Control-Allow-Origin` header · Content-Type header (`415`) · Accept header (`406`) |

6. **Pagination & Filtering Tests (cho GET List endpoints):**

   Pagination (page/limit), Sorting (sort/order), Filtering (by status, date, name), Search (partial match, case-insensitive).

7. **Phân biệt PUT vs PATCH (nếu API có cả 2):**
   - **PUT:** Gửi đầy đủ fields -> update toàn bộ, reset missing optional fields.
   - **PATCH:** Gửi partial fields -> chỉ update field chỉ định, giữ nguyên các field khác.

### Bước 4: Đóng gói API Test Cases

1. **Ghi file đúng chỗ — KHÔNG để lạc ra root:**

   ```
   docs/testcases/[_<hệ-thống>/]<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md               ← INDEX, TÊN FILE BẤT BIẾN — tổng hợp + Bản đồ tài liệu
   docs/testcases/[_<hệ-thống>/]<module>/api/test_cases_<module>_api.md       ← TC API của module
   docs/testcases/[_<hệ-thống>/]<module>/api/parts/part_NN_api_<slug>.md      ← khi file API > 40 TC
   ```

   **Một file mỗi module**, không gộp 35 endpoint vào một file khổng lồ. Tên file bám đúng mẫu để `/generate-traceability-matrix` map được RTM.

   **Module đã có TC của web/mobile** (chung prefix — skill 2.2) → TC API ghi vào `api/test_cases_<module>_api.md` **cùng thư mục module**, TC ID **nối tiếp** dải chung đã dùng (đọc `docs/testcases/README.md`), gắn tag `@API`, và thêm dòng API vào `## Bản đồ tài liệu` của index. ❌ Không mở dải TC ID riêng cho API.

2. Cấu trúc mỗi file:
   - **Tổng quan** — Base URL, Version, Auth method, số endpoint của module, link ngược về `_discovery/api_map.md` và `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`
   - **Endpoint Catalog** — Bảng: `| # | Method | Path | Auth | Mô tả | Số Test Cases |`
   - **Test Cases chi tiết** — theo từng endpoint, bảng TC dùng **đúng tên cột** của skill `skills-rbt-manual-testing` mục *Bảng Output Standard* (`TC ID · REQ ID · Module · Risk Level · Test Scenario · Pre-Condition · Test Steps · Test Data · Expected Result · Priority · Automation · Auto Type · Tags`) — `scripts/testcases-viewer` và `/generate-automation-api` đọc theo tên cột. `Auto Type` = `API`, `Tags` có `@API`. Mỗi TC có **TC ID** `<HỆ_THỐNG>_<MODULE>_TC_<nnn>` và **REQ ID** trỏ vào REQ API (hoặc `⚠️ Chưa có REQ` — Bước 2)
   - **Test Data Matrix** — data valid/invalid/boundary cho mỗi model
   - **Dependencies & Execution Order** — thứ tự chạy test
   - **TC treo** — TC chưa viết được, kèm mã AMB đang chặn

   > 🚨 **Một request chứng minh được nhiều REQ vẫn phải tách TC.** VD `POST /api/login` không gửi token → `200` vừa là *"đăng nhập thành công"* vừa là *"đăng nhập không cần token"* — nếu hai REQ đó **không** có TC nào khác thì phải là **hai TC**, mỗi TC một Expected cốt lõi. Gộp lại thì khi FAIL không biết REQ nào hỏng, và RTM báo cả hai "đã phủ" dù không TC nào **chỉ** kiểm riêng từng cái. Chạy phép thử **6b** của skill `skills-rbt-manual-testing` (có mẫu script) trước khi ghi file. **Số TC ít hơn số REQ không phải lỗi**, nhưng là tín hiệu bắt buộc chạy phép thử này.

3. **Cập nhật `README.md` danh mục**: dải TC ID đã dùng · mã kế tiếp · cột `Nền tảng` (số TC API) · ngày cập nhật · dòng nhật ký.

4. **Dọn bản ghi** đã tạo khi kiểm chứng ở Bước 1b. Xong → đề xuất bước kế tiếp:
   ```
   /generate-automation-api <module>   ← sinh code từ file TC vừa ghi
   ```

## Output

### Tầng khám phá (Bước 1b + 1c)

> `[_<hệ-thống>/]` chỉ có khi API là hệ thống thứ hai của repo; mặt API của hệ thống đã có UI ghi vào thư mục mặc định. Bỏ qua cả bảng này khi Bước 1.0 đã tìm thấy `api_map.md` khớp spec.

| File | Nội dung |
|---|---|
| `docs/requirements/[_<hệ-thống>/]_discovery/sources/openapi_<ngày>.json` | Snapshot spec gốc |
| `docs/requirements/[_<hệ-thống>/]_discovery/api_map.md` | Bản đồ API theo mẫu skill 5.8.2 |
| `docs/requirements/[_<hệ-thống>/]README.md` | Danh mục hệ thống — module · prefix · cột `Nền tảng` · AMB 🔴 · phát hiện bảo mật |

### Test cases

- `docs/testcases/[_<hệ-thống>/]<module>/api/test_cases_<module>_api.md` + cập nhật index `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` — mỗi module 1 file API (chung thư mục module và dải TC ID với TC web/mobile), đủ 12 Status Codes, 7 loại Test Scenarios, OWASP Security, Test Data Matrix, TC ID truy vết được.

---

## Checklist trước khi báo hoàn thành

- [ ] Spec lấy bằng tải thô (không `WebFetch`), đã snapshot xuống `_discovery/sources/`, số operation khớp trang tài liệu
- [ ] Ma trận auth lập theo **từng operation**, đã soi endpoint công khai trả dữ liệu cá nhân
- [ ] Đã gọi thật kiểm chứng, mỗi sai lệch có mã `F-nn` + bằng chứng nguyên văn
- [ ] Ambiguity ghi thành `AMB-<MODULE>-nn`, AMB 🔴 đã báo user ở checkpoint Bước 2
- [ ] File TC nằm đúng `docs/testcases/[_<hệ-thống>/]<module>/api/`, **không** lạc ra root; TC ID nối tiếp dải chung của module; index có dòng API trong `## Bản đồ tài liệu`
- [ ] Bảng TC dùng đúng tên cột của Bảng Output Standard — viewer và `/generate-automation-api` đọc được
- [ ] Mọi TC có `REQ ID` trỏ vào REQ có thật, hoặc ghi `⚠️ Chưa có REQ` và đã báo số TC chưa neo
- [ ] **Phép thử 6b** đã chạy: không TC nào gánh ≥ 2 REQ mà các REQ đó không có TC khác chống lưng — vi phạm thì đã tách, TC mới cấp số **nối tiếp** dải
- [ ] `README.md` danh mục đã cập nhật prefix · dải TC ID · nhật ký
- [ ] Mọi bản ghi tạo khi kiểm chứng đã dọn; số tạo / số dọn ghi rõ trong báo cáo
- [ ] **Không** bản ghi có sẵn nào của hệ thống bị sửa hoặc xoá
