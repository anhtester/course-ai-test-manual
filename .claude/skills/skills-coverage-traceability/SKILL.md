---
name: skills-coverage-traceability
description: Skill sinh ma trận truy vết (RTM) Requirements ↔ Test Cases ↔ Automation Scripts — chỉ ra requirement chưa được cover, TC chưa được automate, và test mồ côi không map về requirement nào.
---

# Coverage & Traceability Matrix

Purpose: Xây dựng Requirements Traceability Matrix (RTM) để trả lời 3 câu hỏi: requirement nào chưa có test? TC nào chưa automate? test nào đang mồ côi? — kèm kết quả chạy gần nhất và bug đang mở để người đọc biết **việc cần làm tiếp**.

---

## When to Use

Sử dụng skill này khi:

- User yêu cầu "ma trận truy vết", "RTM", "coverage report", "requirement nào chưa có test"
- Trước release — cần chứng minh độ phủ test cho stakeholder
- Sau khi sinh TC/automation — cần đối soát với requirements
- Audit bộ test cũ: tìm test thừa (mồ côi) và requirement bị bỏ sót

---

## Input Sources

| Nguồn | Định dạng chấp nhận | Cách nhận diện |
|---|---|---|
| **Requirements** | Markdown, Jira export, user stories, file phân tích từ `skills-requirements-analyzer` | ID dạng `REQ-xxx`, `US-xxx`, hoặc heading đánh số |
| **Manual Test Cases** | Markdown, Excel/CSV | ID dạng `TC_xxx` |
| **Automation Scripts** | `.spec.ts`, `*Test.java`, `.py` | Tên test method/block, annotation/tag chứa TC ID |
| **Checklist** *(nguồn phụ)* | `docs/checklists/<module>/<nền-tảng>/checklist_*.md` · `docs/checklists/_release/<nền-tảng>/checklist_release_*.md` | Cột `REQ ID` của từng mục · mã mục `<Mã checklist>-<nn>` (quy tắc ở skill `skills-rbt-manual-testing`, mục *Mã checklist & mã mục*) |
| **Kết quả chạy** *(nguồn phụ)* | `docs/executions/<module>/<nền-tảng>/run_*/execution_report.md` · `retest_*/retest_report.md` | Cột `TC ID` + `Kết quả`. Lấy **kết quả mới nhất của TỪNG TC**, không phải "lần chạy mới nhất" — lần chạy sau thường chỉ chạy lại một phần (cùng luật `skills-test-summary-reporter`). Lần chạy **checklist** không tính |
| **Bug** *(nguồn phụ)* | `docs/bugs/README.md` | Cột `TC liên quan` + `Trạng thái`. Bug **đang mở** → hậu tố 🐞. Bug **đã đóng** của TC đang FAIL → kết quả FAIL đã lỗi thời, đề xuất chạy lại thay vì mở bug mới. `TC liên quan` có thể mang hậu tố biến thể (`CRM_LOGIN_TC_018-a`) — so theo TC ID gốc |

> Thiếu 1 trong 3 nguồn chính → vẫn sinh RTM 2 chiều với nguồn có sẵn, ghi rõ ở ô `Nguồn đã quét`. TC/test không có ID chuẩn → đề xuất bổ sung ID trước, hoặc map tạm theo tên/mô tả (đánh dấu ⚠️ map suy luận). Nguồn phụ thiếu thì cột tương ứng **ẩn đi**, không in cột toàn `—`.

**Nguồn trong `docs/` — đọc theo `## Bản đồ tài liệu`, không dừng ở index:**

| Nguồn | Đọc thế nào |
|---|---|
| Requirements | `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` (REQ dùng chung) → theo `## Bản đồ tài liệu` đọc **mọi** file `<nền-tảng>/requirements_<module>_<nền-tảng>.md` và `stories/`. Ghi lại **heading Story** chứa từng REQ — ma trận chi tiết nhóm theo đó |
| Test cases | `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → theo `## Bản đồ tài liệu` đọc **mọi** file `<nền-tảng>/test_cases_<module>_<nền-tảng>.md` và `parts/`. Index TC còn chứa bảng **REQ cố ý KHÔNG có TC** — nguồn của trạng thái ⏭️ |
| Checklist | Glob `docs/checklists/**/checklist_*.md`. Checklist là ảnh chụp theo thời điểm — smoke · regression: lấy file **mới nhất theo ngày** trong từng `<module>/<nền-tảng>/` · post-hotfix: lấy **mọi** file (mỗi file một ticket, vùng rà khác nhau) · release: lấy file của mốc đang làm, không chỉ định thì mốc mới nhất — quy từng mục về module theo cột `Module` |
| Phạm vi hệ thống | `docs/requirements/README.md` — danh sách module, trạng thái recon, số REQ. Nguồn của mục ⬛ |

⚠️ Index test cases **không chứa dòng TC** — chỉ đọc index là báo độ phủ 0% sai. Tài liệu cũ chưa có tầng nền tảng (không có bản đồ) thì đọc như tài liệu một file.

---

## Mapping Rules

1. **Map bằng ID là chuẩn nhất** — TC ghi `REQ-001` trong cột Requirement; automation ghi TC ID trong tag/annotation:
   ```typescript
   // Playwright — tag trong tên test
   test('TC_LOGIN_01 - đăng nhập thành công', ...)
   ```
   ```java
   // TestNG — description hoặc groups
   @Test(description = "TC_LOGIN_01")
   ```
2. **Map bằng nội dung khi thiếu ID** — so khớp mô tả TC với tên test method; kết quả đánh dấu ⚠️ cần người xác nhận
3. **1 requirement có thể map nhiều TC** và ngược lại — RTM là quan hệ n-n
4. **KHÔNG bịa mapping** — không chắc thì để trống và liệt kê vào mục "cần xác nhận"
5. **Checklist là nguồn phụ, KHÔNG thay TC.** Mục checklist map về REQ qua cột `REQ ID` và ghi vào cột `Checklist` của ma trận. Cột `Trạng thái` / `Execution ID` của file checklist là **bản sao để đọc** — kết quả chạy luôn lấy từ execution report, không đọc cột này (đọc là đếm hai lần). REQ **chỉ** có mục checklist, không có TC nào → trạng thái 🟠 **Chỉ có checklist**: không tính vào Requirement Coverage, không xếp chung 🔴 (đã có người rà, chỉ chưa có cách rà lặp lại được) — đề xuất sinh TC. Mục checklist TC-based đã có `TC ID liên quan` thì REQ đã được phủ qua TC, cột `Checklist` chỉ để tra
6. **TC mang tag `@Deprecated`** (chức năng đã gỡ — tiền tố `🗑️ Deprecated (…) —` ở `Test Scenario`) **không** được tính là đang phủ REQ và **không** vào mẫu số Automation Coverage. Liệt kê riêng: script automation còn trỏ vào TC `@Deprecated` là **script cần gỡ / skip**, không phải orphan
7. **REQ loại trừ có chủ đích → ⏭️, KHÔNG phải 🔴.** REQ không có TC **và** có căn cứ ghi sẵn trong tài liệu — dòng ở bảng *REQ cố ý KHÔNG có TC* của index TC, REQ trạng thái ⚪ *Chưa implement* hoặc 🔴 *Deprecated* — được xếp ⏭️ **Loại trừ**, ghi lý do + căn cứ (mã AMB / quyết định PO), và **trừ khỏi mẫu số** mọi chỉ số. Không có căn cứ trong tài liệu thì **vẫn là 🔴** — agent không tự quyết REQ nào được loại trừ

---

## Trạng thái của một REQ

Mỗi dòng ma trận mang đúng **một** trạng thái, suy từ dữ liệu theo thứ tự dưới (dừng ở dòng đầu tiên khớp):

| Trạng thái | Điều kiện |
|---|---|
| ⏭️ Loại trừ | 0 TC, có căn cứ loại trừ (Mapping Rule 7) |
| 🔴 Chưa có TC | 0 TC, 0 mục checklist |
| 🟠 Chỉ có checklist | 0 TC, có mục checklist |
| 🟡 Thủ công | Có TC, chưa TC nào có script |
| 🟣 Automate một phần | Có script nhưng chưa phủ hết TC của REQ — ghi `login.spec.ts (1/3)` |
| ✅ Đã automate | Mọi TC của REQ đều có script |

REQ ⚪ *Chưa implement* mà **có** TC thì giữ trạng thái theo bảng trên, thêm hậu tố `· ⚪ REQ chưa implement` để người đọc biết TC đó đang chờ tính năng.

---

## Coverage Metrics

**Mẫu số mọi chỉ số REQ = REQ trong phạm vi = tổng REQ − REQ ⏭️ Loại trừ.** Số REQ loại trừ ghi kèm cạnh mẫu số (`40 (+4 loại trừ)`), không giấu.

| Metric | Công thức | Ý nghĩa |
|---|---|---|
| **Requirement Coverage** | # REQ có ≥1 TC / REQ trong phạm vi | Requirement nào chưa được test |
| **Platform Coverage** | # cặp (REQ × nền tảng REQ khai) có ≥1 TC trên đúng nền tảng đó / tổng số cặp | REQ khai `Web · Android` mà chỉ có TC web → nền tảng Android **chưa phủ**, không được tính là đã phủ nhờ TC web. Module một nền tảng: 1 dòng; nhiều nền tảng: mỗi nền tảng 1 dòng |
| **Automation Coverage** | # TC có ≥1 script / tổng TC (trừ `@Deprecated`) | TC nào còn chạy tay |
| **Pass rate lần chạy gần nhất** | # TC PASS / # TC đã có kết quả (kết quả mới nhất của từng TC) | Chỉ in khi module có ít nhất 1 lần chạy. Ghi kèm số TC **chưa từng chạy** |
| **REQ chỉ có checklist** | # REQ có mục checklist nhưng 0 TC | Vùng đã rà nhanh nhưng chưa có TC để chạy lại, chưa automate được |
| **Orphan Tests** | # test không map về REQ nào | Test thừa hoặc requirement chưa được ghi nhận |

---

## Nơi ghi file — mô hình index + chi tiết

RTM **luôn** gồm 2 tầng, cùng mô hình với `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` → file nền tảng:

```
docs/traceability/
├── traceability_matrix.md                       ← FILE CHUNG — TÊN FILE BẤT BIẾN: tổng hợp mọi module + ⬛ + Bản đồ tài liệu
└── <module>/traceability_matrix_<module>.md     ← chi tiết từng module: ma trận theo Story, TC chưa automate, gap
```

| Lần chạy | Ghi gì |
|---|---|
| **Không chỉ định module** | Mọi module có REQ **và** TC → mỗi module 1 file chi tiết + file chung dựng lại toàn bộ |
| **Chỉ định 1 hoặc nhiều module** (`login, customers`) | File chi tiết của **đúng** các module đó + **cập nhật** file chung: thay dòng của các module vừa sinh, **giữ nguyên** dòng (kèm Ngày sinh cũ) của module khác đã có RTM, tính lại dòng `Tổng`, ⬛ và Việc cần làm |
| File chung chưa tồn tại | Tạo mới — module chưa sinh RTM nằm ở mục ⬛ nhóm 🕓 *Chưa sinh RTM* |

- **File chung luôn được ghi/cập nhật**, kể cả khi chỉ sinh 1 module — đó là cửa vào duy nhất mà workflow phía sau và `traceability-viewer` đọc trước
- **Ghi đè tại chỗ** — không thêm ngày/phiên bản vào tên file; bản cũ tra bằng **lịch sử git**
- Module trong file chung có thể sinh ở các thời điểm khác nhau → cột `Ngày sinh` + `Mốc git` của **từng dòng** ở `## Bản đồ tài liệu` là bắt buộc, không chỉ ghi một ngày ở header
- Workflow đọc RTM (`/generate-test-summary-report`, `/generate-test-progress-report`, `/update-testcases-from-impact`, `/update-automation-from-impact`, `/generate-master-test-plan`): đọc **file chung** lấy số tổng → cần tới từng REQ/TC thì theo `## Bản đồ tài liệu` sang file module. Không có file chung thì đọc thẳng file module
- RTM kiểu cũ (một file phẳng, ở gốc repo hoặc rải trong `docs/`) → vẫn đọc được; lần sinh mới ghi về vị trí chuẩn, **nhắc user gỡ file cũ** (không tự xoá)

---

## Quy tắc trình bày

RTM được đọc bởi QA lead, PM, khách — người **không** mở file TC. Mục tiêu: 10 giây đầu biết tình hình, 1 phút biết việc cần làm.

| Quy tắc | Lý do |
|---|---|
| Dòng đầu tiên sau tiêu đề là **câu tóm tắt** `> **Tóm tắt:** …` | Người đọc lướt chỉ đọc câu này |
| Tỷ lệ in kèm **thanh tiến độ** 10 ô `▰▰▰▰▰▰▰▰▱▱` (bảng con 5 ô), làm tròn tới ô gần nhất. Mẫu số 0 → `▱▱▱▱▱▱▱▱▱▱` + `—` | Nhìn thấy ngay chỗ trống, không phải so số |
| Ma trận chi tiết **nhóm theo Story** (`### <heading Story>`), mỗi nhóm có dòng tiến độ riêng. Tài liệu không có Story thì nhóm theo heading mục chứa REQ | Bảng phẳng 80+ dòng không ai đọc hết; nhóm theo Story chỉ ra **vùng** đang hở |
| **Cột không có nguồn thì ẩn** — chưa có script → bỏ cột `Automation`; chưa có checklist → bỏ cột `Checklist`; chưa chạy lần nào → bỏ cột `Kết quả gần nhất`. Ghi lý do ở ô `Nguồn đã quét` | Cột toàn `—` là nhiễu, che mất cột có thông tin |
| Mục **không có dữ liệu** không in bảng rỗng — gom vào bảng `Kiểm tra khác` một dòng `✅ Không có — <lý do>` | Bảng chỉ có tiêu đề trông như lỗi sinh file |
| Danh sách > 20 dòng bọc trong `<details><summary>…</summary>` (dòng trống trước/sau bảng), kèm **bảng đếm** đặt ngoài | Danh sách dài đẩy nội dung quan trọng xuống dưới |
| Trạng thái viết **tiếng Việt** đúng 6 nhãn ở bảng *Trạng thái của một REQ* | Không trộn `Manual only` / `NOT COVERED` |
| TC ID ghi **đầy đủ** (`CRM_LOGIN_TC_002`), phân tách bằng `, ` | Workflow delta tra ngược REQ → TC bằng ID đầy đủ; viewer tách theo dấu phẩy |
| Ô `Kết quả gần nhất`: `✅ n` PASS · `❌ n` FAIL · `🚫 n` BLOCKED · `⏩ n` SKIPPED, nối bằng ` · `, hậu tố ` 🐞` khi TC FAIL có bug đang mở. Chưa chạy → `—` | Một ô đọc được cả kết quả lẫn bug |
| Mục ⬛ nằm **trên** mọi con số ở file chung; file module chỉ ghi 1 dòng trỏ về file chung | Danh sách module chưa khảo sát là của **hệ thống**, lặp ở mỗi file module là nhiễu |

---

## RTM Template — file chung `docs/traceability/traceability_matrix.md`

```markdown
# Ma Trận Truy Vết (RTM) — <Tên hệ thống> · Tổng hợp

> **Tóm tắt:** 124/124 REQ trong phạm vi đã có TC (100%) · **0/180 TC có script automation** · 51/180 TC đã chạy ít nhất 1 lần · **chỉ 2/23 module** nằm trong RTM này

| Thông tin | Nội dung |
|---|---|
| Ngày cập nhật | 14-10-2026 10:20 |
| Lần sinh gần nhất | `login, customers` — module khác giữ nguyên dòng cũ |
| Mốc git | `501decf` — từng module có mốc riêng ở Bản đồ tài liệu |
| Nguồn đã quét | Automation: không tìm thấy script · Checklist: chưa có · Kết quả chạy: `docs/executions/login/web/` (2 lần chạy) · Bug: `docs/bugs/README.md` |

## ⬛ Ngoài tầm nhìn của RTM — đọc trước mọi con số

| Nhóm | Số module | Module | Ý nghĩa |
|---|:-:|---|---|
| ⬜ Chưa khảo sát | 20 | `CONT` · `LEAD` · … | Không có REQ — không xuất hiện trong mọi % |
| 📄 Có REQ, chưa có TC | 1 | `PRJ` (104 REQ) | Tính vào thì Requirement Coverage toàn hệ thống chỉ còn ~54% |
| 🕓 Chưa sinh RTM | 0 | — | Có REQ + TC nhưng chưa chạy `/generate-traceability-matrix` |

## 1. Độ phủ theo module

| Module | REQ trong phạm vi | Requirement Coverage | TC | Automation | Lần chạy gần nhất |
|---|:-:|---|:-:|---|---|
| **Đăng nhập / Xác thực** `LOGIN` | 40 (+4 loại trừ) | `▰▰▰▰▰` 40/40 | 51 | `▱▱▱▱▱` 0/51 | `▰▰▰▰▱` 45 PASS · ❌ 6 FAIL |
| **Khách hàng** `CUST` | 84 | `▰▰▰▰▰` 84/84 | 129 | `▱▱▱▱▱` 0/129 | — chưa chạy |
| **Tổng** | **124** | `▰▰▰▰▰` **124/124** | **180** | `▱▱▱▱▱` **0/180** | 45 PASS · ❌ 6 FAIL |

## 2. Việc cần làm — gộp mọi module, xếp theo mức nghiêm trọng

| # | Việc | Module | Số lượng | Command |
|:-:|---|---|:-:|---|
| 1 | 🔴 Sinh TC cho REQ chưa có TC | `PRJ` | 104 REQ | `/generate-testcases-manual-rbt` |
| 2 | ❌ Retest TC FAIL đã có bug đang mở | `LOGIN` | 5 TC | `/retest-fixed-bugs` |

## Bản đồ tài liệu

| Module | File RTM | Ngày sinh | Mốc git |
|---|---|---|---|
| `LOGIN` | [login/traceability_matrix_login.md](login/traceability_matrix_login.md) | 14-10-2026 10:20 | `501decf` |
| `PRJ` | — chưa sinh | — | — |
```

**Thứ tự Việc cần làm** (chỉ in dòng có số lượng > 0): 🔴 REQ chưa có TC → 🟠 REQ chỉ có checklist → ❌ TC FAIL, tách 3 nhánh: *có bug đang mở* → `/retest-fixed-bugs` · *chỉ có bug đã đóng* (kết quả FAIL đã lỗi thời — TC hoặc kết luận bug đổi sau lần chạy) → chạy lại bằng `/execute-test-cases` · *chưa có bug nào* → `/create-bug-report` → ▶️ TC chưa từng chạy → 🗑️ script trỏ vào TC Deprecated → ⚠️ mapping suy luận cần xác nhận → 🟡 automate TC Critical/High.

---

## RTM Template — file module `docs/traceability/<module>/traceability_matrix_<module>.md`

```markdown
# Ma Trận Truy Vết (RTM) — Đăng nhập / Xác thực (`LOGIN`)

> **Tóm tắt:** 40/40 REQ trong phạm vi đã có TC · **0/51 TC có script automation** · lần chạy gần nhất 45 PASS / 6 FAIL · 4 REQ loại trừ theo quyết định PO

| Thông tin | Nội dung |
|---|---|
| Ngày sinh | 14-10-2026 10:20 |
| Phạm vi | Module `LOGIN` · web |
| Mốc git | `501decf` — TC/script sửa sau mốc này thì RTM đã cũ |
| Nguồn đã quét | REQ: `requirements/login/` (44 REQ) · TC: `testcases/login/web/test_cases_login_web.md` (51 TC) · Automation: không tìm thấy script · Checklist: chưa có · Kết quả chạy: `run_1787215085`, `run_1789759574` |
| Tổng hợp | [../traceability_matrix.md](../traceability_matrix.md) — ⬛ module ngoài tầm nhìn của RTM nằm ở đó |

## 1. Tổng quan

| Chỉ số | Tiến độ | Giá trị |
|---|---|---|
| Requirement Coverage | `▰▰▰▰▰▰▰▰▰▰` | **40/40** (100%) REQ trong phạm vi |
| Platform Coverage · web | `▰▰▰▰▰▰▰▰▰▰` | 40/40 cặp REQ × nền tảng |
| Automation Coverage | `▱▱▱▱▱▱▱▱▱▱` | **0/51** TC (0%) |
| Pass rate lần chạy gần nhất | `▰▰▰▰▰▰▰▰▰▱` | 45/51 (88%) · ❌ 6 FAIL · 0 TC chưa chạy |

**Phân bổ REQ theo trạng thái:**

| ✅ Đã automate | 🟣 Automate một phần | 🟡 Thủ công | 🟠 Chỉ checklist | 🔴 Chưa có TC | ⏭️ Loại trừ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 40 | 0 | 0 | 4 |

## 2. Việc cần làm

1. ❌ **6 TC FAIL ở lần chạy gần nhất** — 5 TC đã có bug đang mở → `/retest-fixed-bugs` khi Dev báo fix
2. 🟡 **Bắt đầu automate:** 22 TC Critical/High đã chấm `Automation = Yes` → `/generate-automation-from-testcases`

## 3. Ma trận chi tiết

### 3.1. Giao diện trang đăng nhập (STORY-LOGIN-01)

`▰▰▰▰▰` 7/7 REQ có TC

| REQ ID | Yêu cầu | TC IDs | Kết quả gần nhất | Trạng thái |
|---|---|---|:-:|---|
| REQ-LOGIN-01 | Truy cập trang đăng nhập | CRM_LOGIN_TC_001 | ✅ 1 | 🟡 Thủ công |
| REQ-LOGIN-04 | Logo dẫn về trang chủ | CRM_LOGIN_TC_004 | ❌ 1 🐞 | 🟡 Thủ công |

### ⏭️ REQ loại trừ có chủ đích — không tính vào mẫu số

| REQ ID | Lý do | Căn cứ |
|---|---|---|
| REQ-LOGIN-27 | Không kiểm chứng luồng gửi mail đặt lại với email có thật | `AMB-LOGIN-04` ⏭️ |

## 4. 🟡 TC chưa automate

| Priority | Automation = Yes | Partial | No | Tổng |
|---|:-:|:-:|:-:|:-:|
| Critical | 8 | 1 | 0 | 9 |

<details><summary>Danh sách đầy đủ 51 TC (xếp theo Priority)</summary>

| TC ID | Priority | Automation dự kiến | Ghi chú |
|---|---|---|---|
| CRM_LOGIN_TC_005 | Critical | Yes | — |

</details>

## 5. Kiểm tra khác

| Hạng mục | Số lượng | Kết quả |
|---|:-:|---|
| 🔴 REQ chưa có TC | 0 | ✅ Không có |
| 🟠 REQ chỉ có checklist | 0 | ✅ Không có — chưa có checklist nào cho module |
| ⚪ Orphan test (không map về REQ) | 0 | ✅ Không có — chưa có script automation |
| 🧩 TC trỏ tới REQ không tồn tại | 0 | ✅ Không có |
| 🗑️ Script trỏ vào TC Deprecated | 0 | ✅ Không có |
| ⚠️ Mapping suy luận cần xác nhận | 0 | ✅ Không có — 100% mapping theo ID |
```

**Hạng mục nào có số lượng > 0** thì cột `Kết quả` ghi `Xem bên dưới` và in bảng chi tiết ngay sau bảng `Kiểm tra khác`, đúng tên cột sau (viewer nhận diện theo tên cột):

| Heading | Cột |
|---|---|
| `### 🔴 REQ chưa có TC` | `REQ ID` · `Mô tả` · `Đề xuất` |
| `### 🟠 REQ chỉ có checklist` | `REQ ID` · `Mục checklist` · `Đề xuất` |
| `### ⚪ Orphan test` | `Test` · `File` · `Đề xuất` |
| `### 🧩 TC trỏ tới REQ không tồn tại` | `TC ID` · `REQ ghi trong TC` · `Đề xuất` |
| `### 🗑️ Script trỏ vào TC Deprecated` | `Test` · `File` · `TC Deprecated` |
| `### ⚠️ Mapping suy luận cần xác nhận` | `REQ` · `TC/Test` · `Căn cứ suy luận` |

**Cột ma trận chi tiết đầy đủ** (ẩn cột không có nguồn, giữ đúng thứ tự):
`REQ ID` · `Yêu cầu` · `Nền tảng` *(chỉ khi module > 1 nền tảng)* · `TC IDs` · `Automation` · `Checklist` · `Kết quả gần nhất` · `Trạng thái`. Ô `Automation`: `<file script> (<số TC có script>/<số TC của REQ>)`, nhiều file nối bằng `, `.

---

## Workflow

1. **Xác định phạm vi** — module chỉ định, hoặc mọi module có REQ + TC. Đọc `docs/requirements/README.md` lấy danh sách module cho mục ⬛
2. **Thu thập** — 3 nguồn chính + nguồn phụ (checklist · kết quả chạy · bug); xác định format ID của từng nguồn
3. **Trích xuất** — liệt kê toàn bộ REQ ID (kèm Story), TC ID, test method (kèm file path), căn cứ loại trừ
4. **Map** — nối các tầng theo Mapping Rules; tách riêng mapping chắc chắn và mapping suy luận ⚠️
5. **Tính trạng thái + metrics** — theo bảng *Trạng thái của một REQ* và *Coverage Metrics*
6. **Phát hiện gap + lập Việc cần làm** — theo thứ tự ở template file chung, mỗi việc kèm command
7. **Xuất** — file module trước, rồi cập nhật file chung (luật ở *Nơi ghi file*). CSV cùng tên nếu user cần import Excel — hoặc nhắc dùng nút Excel của `traceability-viewer`

---

## Quality Checklist

- [ ] Mọi REQ/TC/test trong nguồn input đều xuất hiện trong RTM (không bỏ sót)
- [ ] Mapping suy luận được tách riêng, không trộn với mapping có ID
- [ ] REQ ⏭️ có căn cứ ghi trong tài liệu, đã trừ khỏi mẫu số và số loại trừ ghi cạnh mẫu số
- [ ] REQ chỉ có checklist xếp 🟠, **không** tính vào Requirement Coverage
- [ ] Đã ghi **cả** file module **và** file chung; dòng của module khác trong file chung giữ nguyên
- [ ] Header có Ngày sinh · Phạm vi · Mốc git · Nguồn đã quét; Bản đồ tài liệu có Ngày sinh + Mốc git từng module
- [ ] Không có cột toàn `—`, không có bảng rỗng chỉ có tiêu đề
- [ ] Metrics khớp số dòng trong ma trận; dòng `Tổng` của file chung khớp tổng các dòng module
- [ ] Việc cần làm có command cụ thể
- [ ] Không tự ý sửa file TC/test khi chưa được yêu cầu

---

## Rules References

- `.claude/skills/skills-requirements-analyzer/SKILL.md` — Nguồn requirements chuẩn
- `.claude/skills/skills-rbt-manual-testing/SKILL.md` — Sinh TC lấp gap
- `.claude/skills/skills-testcase-reviewer/SKILL.md` — Review chất lượng TC hiện có
- `scripts/traceability-viewer/README.md` — Viewer đọc RTM; đổi tên cột ở đây thì phải sửa parser ở đó
