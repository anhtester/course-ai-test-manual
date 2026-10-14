---
description: Sinh tài liệu requirements (REQ ID) cho module API từ đặc tả — OpenAPI/Swagger UI/Scalar/Redoc, Postman collection, hoặc tài liệu API dạng .docx/.pdf — có kiểm chứng bằng gọi thật. Không cần Ticket ID. KHÔNG sinh test cases.
skills:
  - skills-requirements-analyzer
---

# Workflow: Sinh Requirements từ Đặc tả API

> **BẮT BUỘC (MANDATORY SKILL):** Nạp và đọc kỹ **`skills-requirements-analyzer`** (`.claude/skills/skills-requirements-analyzer/SKILL.md`). Workflow này chạy **nhánh API Spec Analysis**, dùng các mục:
>
> | Mục skill | Dùng để |
> |---|---|
> | **2 + 2.1 + 2.2** | Đánh mã REQ/AMB/RISK · nối tiếp mã · **chung prefix với web/mobile cùng nghiệp vụ** |
> | **3.3** | Đối chiếu khi có cả tài liệu nghiệp vụ lẫn spec |
> | **3.4** (toàn bộ) | Lấy nguồn · ranh giới module · ma trận auth · kiểm chứng gọi thật · trích REQ · tài liệu API dạng văn bản · mục 6 áp cho API |
> | **4 + 4.3** | AMB/RISK + Cổng Tự Soát REQ |
> | **5** | Quy mô / tách file |
> | **5.8 + 5.8.2** | Đọc tầng khám phá · mẫu `api_map.md` |
> | **6** + bảng thay đổi **3.4.7** | Cấu trúc tài liệu đầu ra |
> | **7.1 + 7.4** | Strict rules chung + riêng nhánh API |
>
> ❌ **KHÔNG dùng** mục 3.1 (UI Recon web), 3.5 (Mobile Recon), 7.2 (luật cấm gọi API là của nhánh UI).

Đây là bản API của `/generate-requirements-from-website`: **tầng module**, đầu ra là `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` có mã REQ để tầng test case (`/generate-testcases-api`) và `/generate-traceability-matrix` neo vào.

---

## ⚠️ Ranh giới của workflow này

| Workflow này **CÓ** làm | Workflow này **KHÔNG** làm |
|---|---|
| Sinh REQ cho **một** module API (hoặc mặt API của một module đã có web/app) | ❌ Khám phá cả hệ thống, cấp prefix — việc của `/discover-system` (nhánh API) |
| Trích REQ từ spec / Postman / tài liệu văn bản, có trích dẫn vị trí | ❌ Sinh test cases — việc của `/generate-testcases-api` · sinh code — `/generate-automation-api` |
| Gọi thật **có kiểm soát** để nâng REQ lên mức kiểm chứng | ❌ Sửa/xoá bất kỳ bản ghi nào không do chính phiên này tạo |
| Ghi REQ vào tầng `api/` của **cùng** thư mục module với web/mobile, REQ dùng chung lên index | ❌ Mở prefix hay tài liệu riêng cho "phần API" của một module đã có |
| Không cần Ticket ID | ❌ Phân tích ticket — việc của `/analyze-requirement-document` |

---

## Các bước thực hiện

### Bước 0: Chốt chặn đầu vào & định vị hệ thống (BẮT BUỘC — làm trước mọi thứ)

**0.1 — Đầu vào có đúng là đặc tả API không?**

| Đầu vào | Xử lý |
|---|---|
| URL Swagger UI · Scalar · Redoc · Stoplight · RapiDoc · URL spec `.json`/`.yaml` | ✅ Chạy tiếp — lấy spec theo skill **3.4.1** |
| File OpenAPI `.json`/`.yaml` · Postman collection `.json` | ✅ Chạy tiếp |
| `.docx` / `.pdf` mô tả endpoint (bảng method/path, JSON mẫu, bảng mã lỗi) | ✅ Chạy tiếp theo skill **3.4.6** |
| Jira ticket / user story về một tính năng API | ⛔ Route `/analyze-requirement-document` (có Ticket ID) hoặc `/update-requirements-from-ticket` (module đã có tài liệu) |
| Sản phẩm đầu ra của workflow khác (`REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`, `requirements_*.md`, `api_map.md`, `TEST_CASES_<TÊN_MODULE>_SUMMARY.md`, `test_cases_*.md`) | ⛔ **DỪNG, hỏi ý định thật** — không sinh bản diễn đạt lại của tài liệu đã có. Riêng `api_map.md`: nếu user muốn "sinh REQ từ bản đồ này" → chạy tiếp, dùng nó làm đầu vào ở Bước 1 |
| Chỉ có base URL, **không** có spec hay tài liệu nào | ⛔ Hỏi user nguồn spec. Hệ thống có web → REQ server-side lấy qua tầng network của `/generate-requirements-from-website` (skill 3.1.1). **Không** dò endpoint mù |

**0.2 — Đặc tả thuộc hệ thống nào, ghi vào đâu:**

1. Đọc `docs/requirements/README.md` (và danh mục của các namespace `_<hệ-thống>/README.md` nếu có)
2. Quyết định theo bảng:

| Tình huống | Thư mục đầu ra | Prefix |
|---|---|---|
| API là **mặt khác** của hệ thống đã có web/app trong repo | `docs/requirements/<module>/api/requirements_<module>_api.md` + index `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` — **cùng thư mục module** với web/mobile | **Prefix của module đã có** (skill 2.2) |
| Hệ thống **chỉ có API**, là hệ thống đầu tiên của repo | `docs/requirements/<module>/api/` + index | Prefix mới, chốt ở tầng khám phá |
| Hệ thống **chỉ có API**, repo đã có hệ thống khác | `docs/requirements/_<hệ-thống>/<module>/api/` + index | `REQ-<HỆ_THỐNG>-<MODULE>-<nn>` (CLAUDE.md mục 6b) |
| Không chắc API có thuộc hệ thống đang có hay không | ⛔ **Hỏi user một câu** — đoán sai là hoặc nhân đôi REQ, hoặc trộn hai hệ thống |

**0.3 — Có bản đồ API chưa?**

- `_discovery/api_map.md` **đã có** → tải lại spec, so `sha256` với snapshot mới nhất trong `sources/`. Khớp → sang Bước 1. Khác → snapshot mới, ghi operation thêm/bỏ/đổi vào Nhật ký khám phá của `api_map.md`, rồi sang Bước 1
- Spec đổi **và** module đã có REQ API → lần chạy này là **delta**, không sinh lại: operation mới → REQ mới nối tiếp mã · operation đổi schema/status/auth → **giữ mã**, sửa nội dung, trạng thái 🟡 · operation bị gỡ → REQ 🔴 Deprecated, **không xoá dòng**. Mỗi thay đổi 1 dòng Nhật ký (skill 6.9) kèm cột `TC cần xử lý`, và xuất Impact Report `impact/impact_spec_<YYYY-MM-DD>.md` cùng mẫu của `/update-requirements-from-ticket` để `/update-testcases-from-impact` dùng được
- **Chưa có** → chạy tầng khám phá API trước theo `/discover-system` **nhánh API** (Bước 3-A) — đến hết checkpoint chốt prefix. Không tự cấp prefix trong workflow này

**0.4 — Năng lực gọi API:** đọc dòng `Năng lực kiểm thử của QA` ở danh mục.
- `Gọi API: ✅` → Bước 2 được chạy
- `❌` hoặc chưa có → **hỏi user một lần**, ghi ngay vào danh mục. Vẫn ❌ → bỏ Bước 2, mọi REQ dừng ở mức `Spec` / `Tài liệu`, nêu rõ ở bàn giao

Công bố ngay câu đầu tiên: *"Sinh REQ cho module `<PREFIX>` — nguồn `<spec/Postman/docx>` · ghi vào `<đường dẫn>` · gọi thật: có/không."*

### Bước 1: Đọc nguồn của module

1. **Bản đồ:** phần của module trong `api_map.md` — danh mục operation, ma trận auth, phát hiện `F-nn`, ambiguity
2. **Spec snapshot:** mọi operation thuộc tag của module — **resolve `$ref`** khi trích schema request/response. Postman: mọi request trong folder. Tài liệu văn bản: đúng các mục/bảng phủ module, ghi vị trí
3. **Tài liệu requirements đã có của module** (`REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`), nếu có:
   - Lấy **mã kế tiếp** (skill 2.1) — REQ API đánh **tiếp**, không mở dải riêng
   - Liệt kê REQ web/mobile có rule **nằm ở server** (khoá tài khoản, trùng email, giới hạn độ dài) — ở Bước 3 sẽ **mở rộng nền tảng** cho REQ đó thay vì sinh REQ mới
4. **Tài liệu nghiệp vụ khác** user đưa (spec chức năng, ticket) → đối chiếu theo skill 3.3

### Bước 2: Kiểm chứng bằng gọi thật — mức module

> Chỉ chạy khi Bước 0.4 là `Gọi API: ✅`. Tuân **tuyệt đối** bảng quy tắc dữ liệu ở skill **3.4.4**.

Tầng khám phá đã gọi 10–20 request cho cả hệ thống. Ở đây kiểm **sâu cho module**, để từng REQ lên được mức `Spec + kiểm chứng thực tế`:

| Kiểm | Cho REQ nào |
|---|---|
| Gọi đúng — status + hình dạng body | REQ happy path của từng operation |
| Bỏ **từng** field `required` một | Mỗi REQ field bắt buộc |
| Vi phạm **từng** ràng buộc một (quá dài, sai `pattern`, ngoài `enum`, âm) | Mỗi REQ ràng buộc |
| Không token / token của user khác (2 tài khoản **tự tạo**) | REQ auth · ma trận phân quyền |
| Tham số phân trang/lọc biên (`limit=0`, trang vượt tổng) | REQ phân trang |

- **Đọc trước, ghi sau.** Operation ghi (`POST`/`PUT`/`PATCH`/`DELETE`) chỉ nhắm vào bản ghi **do chính bước này tạo**, tên `auto_<module>_<timestamp>`
- Môi trường dùng chung → hạn chế tối đa operation ghi; bản ghi tạo ra phải dọn ngay
- Kết quả **mỗi** request ghi lại (request + status + trích body **đã che**) để chép vào AC ở Bước 3 — không dựa vào trí nhớ

### Bước 3: Soạn REQ

Theo skill **3.4.5** (dữ kiện nào thành REQ nào) và **3.4.7** (mục 6 áp cho API):

- **Endpoint Catalog** ngay sau metadata — mọi operation trong phạm vi có ≥ 1 REQ, hoặc ghi lý do loại
- **Field Spec** theo JSON path · vị trí · kiểu · ràng buộc · operation dùng
- **Validation** theo `Điều kiện · Status · Body lỗi nguyên văn`
- **Ma trận phân quyền** theo operation × (`Không token` · từng role) — cột role chưa có căn cứ là `❔` + `AMB` 🔴, không suy từ tên endpoint
- **Ma trận trạng thái** khi có `enum` trạng thái + operation đổi trạng thái
- Cột `Nguồn` dùng **thang 4 mức API** của skill 3.4.5

**Nối với REQ web/mobile đã có (skill 2.2):**

| Tình huống | Xử lý |
|---|---|
| Rule API **trùng** một REQ đã có, và gọi thật cho kết quả khớp | **Không** cấp mã mới — REQ cũ đang ở `web/` / `mobile/` thì **chuyển dòng lên index**, cột `Nền tảng` thêm `API`; đã ở index thì chỉ sửa cột. Nhật ký loại `🟢 Thêm` · *"Mở rộng nền tảng: + API"* |
| Rule trùng nhưng hành vi **khác** (UI chặn, API nhận) | REQ riêng ở `api/` + `AMB-<MODULE>-XX` 🔴 *"cố ý hay lỗi?"* — mặc định nghi là lỗi, thường là lỗ hổng bỏ qua validation phía client |
| Module cũ chưa có tầng nền tảng (tài liệu một file) | Chuyển một lần theo skill mục 5.3 (REQ chỉ áp web sang `web/`, mã giữ nguyên, ghi Nhật ký) rồi mới ghi phần API |
| Rule chỉ có ở API | REQ mới nối tiếp mã, ghi ở `api/` |

**Lệch pha spec ↔ thực tế:** REQ theo spec, `Nguồn` = `Spec — ❌ lệch thực tế (F-nn)`, `AMB-<MODULE>-XX` 🔴 ghi nguyên văn cả hai (skill 3.4.5). Không hạ REQ theo hành vi thật.

### Bước 4: Cổng Tự Soát REQ (skill 4.3) — và 4 điểm riêng của API

Chạy đủ 9 câu của skill 4.3, **cộng**:

- [ ] Status code trong AC khớp **kết quả gọi thật** (khi đã gọi); chỗ lệch spec đã có AMB — không để AC im lặng theo một bên
- [ ] AC **không** chứa token, id bản ghi, timestamp cụ thể — chỉ hình thái (4.3.3)
- [ ] AC về body response dùng **hình dạng/chứa**, không so khớp nguyên cả body — body có phần động (id, thời gian) (4.3.7)
- [ ] Mỗi REQ field/ràng buộc kiểm **một** field, **một** ràng buộc (4.3.4)

### Bước 5: Ghi file & cập nhật danh mục

1. **Đếm REQ của file API** → áp bảng ngưỡng skill 5.1. File API lớn thường vượt 25 REQ → Phân rã Story theo **nhóm tài nguyên** (VD `/users` · `/users/{id}/roles`); vượt 80 thì chia tiếp vào `api/stories/`
2. **Ghi** `api/requirements_<module>_api.md` đúng thư mục đã chốt ở Bước 0.2 (Endpoint Catalog · REQ chỉ áp API · Field Spec JSON · Validation · `Nguồn spec` + `Môi trường gọi thử`), và cập nhật **index** `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` (REQ chuyển lên dùng chung · dòng `Nền tảng` · `## Bản đồ tài liệu` thêm dòng API · AMB/RISK · Nhật ký). Chưa có index → tạo trước (skill 5.3)
3. **Danh mục** `README.md` (của hệ thống tương ứng): `Nền tảng` thêm `API ✅` · `Trạng thái recon` · `REQ đã dùng` · `Mã kế tiếp` · `AMB treo` · `Cập nhật`
4. **Đối chiếu danh mục** với thư mục thực tế — đúng khối "Đối chiếu danh mục" của `/generate-requirements-from-website`
5. **`api_map.md`:** bảng module cột `Dải REQ` cập nhật dải vừa cấp · 1 dòng Nhật ký khám phá nếu phát hiện lệch so với bản đồ
6. **Dọn dữ liệu test** (Bước 2) — báo số tạo / số dọn / còn sót

### Checklist bàn giao

- [ ] Spec lấy bằng tải thô, số operation khớp trang tài liệu; snapshot có ngày + `sha256` trong Nhật ký
- [ ] Prefix lấy từ danh mục, **không** tự đặt; REQ API nối tiếp **dải mã chung** của module, nằm ở `api/` hoặc index; index có dòng API trong `## Bản đồ tài liệu`
- [ ] Mọi operation trong phạm vi có ≥ 1 REQ ở Endpoint Catalog
- [ ] Cột `Nguồn` dùng thang 4 mức API; lệch spec ↔ thực tế đều có `AMB` 🔴
- [ ] Không REQ nào suy `required`/kiểu/độ dài từ JSON mẫu của tài liệu văn bản
- [ ] Ma trận phân quyền có dòng tổng `Đã kiểm chứng / Suy diễn / Chưa rõ`
- [ ] Không token, cookie, mật khẩu, dữ liệu cá nhân nào trong `docs/`
- [ ] Không bản ghi có sẵn nào bị sửa/xoá; mọi bản ghi test đã dọn
- [ ] Danh mục, `api_map.md`, Nhật ký thay đổi của module khớp nhau

**Báo cáo cho user:** số REQ mới · số REQ web/mobile được mở rộng sang API · số REQ ở từng mức nguồn · phát hiện lệch pha · AMB 🔴 cần PO trả lời · **lệnh kế tiếp**:

```
/generate-testcases-api   ← sinh TC API neo vào REQ vừa sinh
```

---

## Mối quan hệ với workflows khác

```
/discover-system (nhánh API) ──→ /generate-requirements-from-api ──→ /generate-testcases-api ──→ /generate-automation-api
       api_map.md                    REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md        test_cases_<module>_api.md    code + reports/
```

| Sau khi xong | Workflow tiếp theo |
|---|---|
| Sinh TC API | `/generate-testcases-api` |
| Sinh automation API từ TC | `/generate-automation-api` |
| Sinh TC manual gồm cả luồng UI lẫn API | `/generate-testcases-manual-rbt` |
| Spec đổi phiên bản | Chạy lại workflow này — Bước 0.3 tự chuyển sang delta |
| Ticket sửa hành vi API | `/update-requirements-from-ticket` |
| Impact Report sinh ra → cập nhật TC | `/update-testcases-from-impact` |
| Kiểm độ phủ REQ ↔ TC | `/generate-traceability-matrix` |
