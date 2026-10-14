---
description: Sinh automation API từ file test case API (docs/testcases/<module>/api/) — REST Assured / Playwright API / Pytest Requests / Supertest. Fixture 2 tài khoản cho BOLA/IDOR, dọn dữ liệu, attach request/response đã che, chạy và tự sửa đến khi PASS — không hạ assertion để né bug.
skills:
  - skills-qa-automation-engineer
  - skills-test-data-generator
  - skills-requirements-analyzer
---

# Workflow: Sinh Automation API

> **BẮT BUỘC (MANDATORY SKILLS):**
> - **`skills-qa-automation-engineer`** (`.claude/skills/skills-qa-automation-engineer/SKILL.md`) — quy tắc automation chung
> - **`skills-test-data-generator`** — test data unique, traceable
> - **`skills-requirements-analyzer`** mục **3.4.4** — **quy tắc dữ liệu khi gọi API thật** (nguồn duy nhất của bộ luật này)

Workflow đọc **file test case API**, sinh project automation (client · DTO · fixture · test), chạy và tự sửa đến khi PASS ổn định.

> Được gọi thẳng, hoặc qua bộ định tuyến `/generate-automation-from-testcases` khi file TC thuộc tầng `api/`. Web → `/generate-automation-web` · App mobile → `/generate-automation-mobile`.

**Vị trí trong chuỗi:**

```
/discover-system (nhánh API) → /generate-requirements-from-api → /generate-testcases-api → /generate-automation-api
        api_map.md                 REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md         test_cases_<module>_api.md     code + reports/
```

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **Đầu vào là TC, không phải spec.** Chưa có file TC API → **dừng**, đề nghị chạy `/generate-testcases-api` trước. Spec + `api_map.md` chỉ dùng để lấy schema (DTO), auth và base path — **không** tự sinh thêm kịch bản ngoài TC
- **KHÔNG đoán** schema/endpoint — lấy từ snapshot spec trong `_discovery/sources/`, resolve `$ref`
- **Chỉ gọi API khi dòng `Gọi API` ở danh mục `docs/requirements/README.md` là ✅** và đã chốt môi trường
- ⚠️ **Rule E3:** Khi test FAIL → tự đọc log → phân tích → sửa → chạy lại. KHÔNG hỏi user trong quá trình fix lỗi
- **Artifact `task.md`** — PHẢI tạo để theo dõi tiến độ

## 🚨 Quy tắc dữ liệu test (BẮT BUỘC — đọc trước request đầu tiên)

> Vi phạm từng **xoá mất tài khoản gốc của hệ thống demo**. Bảng luật đầy đủ nằm ở skill `skills-requirements-analyzer` mục **3.4.4** — đọc hết trước khi chạy. Ba luật không có ngoại lệ:

1. **Không ghi/xoá bản ghi không do chính suite tạo ra** — kể cả khi user nói "được xoá thoải mái". CẤM lấy `id` từ API danh sách rồi `PATCH`/`DELETE`
2. **BOLA/IDOR chỉ kiểm bằng 2 tài khoản suite tự tạo** (`userA`, `userB`) — token của A nhắm vào tài nguyên của B
3. **Dọn sạch sau lần chạy cuối** — báo cáo số bản ghi tạo / dọn / còn sót; lỡ đụng dữ liệu thật → báo user ngay, ghi mục **Sự cố** của `api_map.md`

## Input cần thu thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| **File test cases API** | ⭐ | `docs/testcases/<module>/api/test_cases_<module>_api.md` (+ `parts/`). Đưa file **index** → theo `## Bản đồ tài liệu` chỉ lấy file `api/` |
| **Snapshot spec + `api_map.md`** | ⭐ | Agent tự tìm trong `docs/requirements/[_<hệ-thống>/]_discovery/` — schema, auth theo operation, ghi chú automation |
| **Base URL môi trường + tài khoản lấy token** | ⭐ | Lưu `.env`, **không** commit, không ghi vào `docs/` |
| **Tech stack** | ⭕ | Detect từ project; project mới thì hỏi (bảng dưới) |

**Tech stack:**

| Framework | Ngôn ngữ | Khi nào dùng |
|---|---|---|
| **REST Assured** | Java | Mặc định cho Java projects, TestNG runner |
| **Playwright API Testing** | TypeScript | Khi user dùng Playwright hoặc TypeScript stack |
| **Supertest + Jest** | TypeScript/JS | Khi user dùng Node.js backend |
| **Requests + Pytest** | Python | Khi user dùng Python stack |

## Các bước thực hiện

### Bước 1: Đọc đầu vào & lập kế hoạch

1. Đọc file TC API — danh sách TC (TC ID · REQ ID · endpoint · điều kiện · status kỳ vọng · test data · Priority). TC có **Bảng biến thể** → sẽ thành test tham số hoá
2. Đọc `api_map.md` — auth từng operation (🌐/🔒), phát hiện `F-nn`, ghi chú automation (token ở cookie hay header, nhiều content-type, dữ liệu rác sẵn có)
3. Đọc snapshot spec — schema request/response của các operation có trong TC (**resolve `$ref`**)
4. So `sha256` snapshot với spec online: khác → spec đã đổi sau khi sinh TC, **dừng**, đề nghị `/generate-requirements-from-api` (delta) → `/update-testcases-from-impact` trước, tránh code theo kỳ vọng cũ
5. Tạo `task.md`: bảng TC → endpoint → trạng thái; đánh dấu trước TC đang **phơi bug** (TC gắn với `F-nn` hoặc AMB 🔴 kết luận là lỗi)

### Bước 2: Thiết kế project structure

Theo skill `skills-framework-architect` (project mới) hoặc cấu trúc sẵn có (project cũ):

- **Base API client** — base URL từ env, header chung, log request/response đã che
- **Auth fixture** — lấy token động (không hardcode), làm mới khi hết hạn
- **Fixture 2 tài khoản** `userA` / `userB` do chính suite tạo, dùng cho mọi TC BOLA/IDOR
- **Model/DTO classes** — sinh từ schema của spec
- **API client classes** — mỗi nhóm tài nguyên một class, method mô tả hành vi nghiệp vụ
- **Test data generators** — `auto_<module>_<timestamp>`, unique + traceable

### Bước 3: Sinh test

1. **Mỗi TC → 1 test**; TC có Bảng biến thể → test tham số hoá, mỗi biến thể một bộ dữ liệu
2. **Assertions bắt buộc:**
   - ✅ HTTP Status Code (exact match) — theo **kỳ vọng của TC**
   - ✅ Response body structure & JSON Schema validation
   - ✅ Response time SLA (< 2 giây)
   - ✅ Headers & Sensitive Data masking check
3. **Best practices:**
   - Dynamic Auth Token (không hardcode) — base URL + credentials để ở `.env`, **không** commit
   - Parameterized tests
   - Teardown/Cleanup data sau khi test (DELETE bản ghi **vừa tạo**)
   - BOLA/IDOR chỉ qua fixture `userA` / `userB`
4. **Report** gom vào `reports/` theo [`reporting_rules.md`](../rules/reporting_rules.md): tên test Tiếng Việt · Description · Severity (theo Priority của TC) · Tags (`api` + module) · label `testId` = **TC ID** · step `Arrange` / `Act` / `Assert`. Phần thay cho screenshot là **attach request + response thật** (đã che token, cookie, dữ liệu cá nhân) ở cuối **mọi** test, cả PASS lẫn FAIL

### Bước 4: Chạy thử nghiệm & Tự sửa lỗi (Execution & Auto-Heal)

1. **Chạy test** bằng `Bash` (hoặc `PowerShell` trên Windows) — `npm test`, `mvn test`, `pytest`…
2. **Test chạy lâu** → `run_in_background: true`, nhận thông báo khi xong. **KHÔNG** poll bằng `sleep`
3. **Auto-Heal:** FAIL → tự đọc log, sửa code và chạy lại (tối đa 5 vòng) mà KHÔNG làm phiền user
4. **⚠️ Chỉ sửa test, KHÔNG sửa kỳ vọng để né bug app.** Test FAIL vì hệ thống sai (như phát hiện `F-nn`) → giữ nguyên assertion, đánh dấu TC là **đang phơi bug**, đề xuất `/create-bug-report`. Hạ assertion cho xanh báo cáo là **cấm**
5. **Verify stability** — TC mà hệ thống đúng phải PASS **2 lần liên tiếp**

### Bước 5: Dọn dữ liệu & bàn giao

1. **Dọn dữ liệu** sau lần chạy cuối — báo cáo rõ: tạo bao nhiêu bản ghi, dọn bao nhiêu, còn sót gì
2. **Code cleanup:** không debug log, không commented code, không unused import, không hardcode token/URL
3. **Báo cáo** cho user:
   - **"PASS 100%" chỉ áp dụng cho TC mà hệ thống đúng** — tách 2 nhóm: PASS · FAIL **phơi bug** (kèm đề xuất bug report), cộng SKIP (kèm lý do)
   - Danh sách files đã tạo/sửa
   - TC chưa automate được và vì sao (VD phụ thuộc AMB 🔴 chưa chốt)

## Output

- Source code automation hoàn chỉnh (client · DTO · fixture · test) + report trong `reports/`
- **Artifact `task.md`** — tiến độ + kết quả từng TC
- Báo cáo số bản ghi tạo / dọn

## Checklist trước khi báo hoàn thành

- [ ] Mọi test có label `testId` = TC ID có thật trong file TC API
- [ ] Không hardcode token / base URL / mật khẩu; `.env` không bị commit
- [ ] Mọi TC BOLA/IDOR chạy bằng 2 tài khoản suite tự tạo
- [ ] Không assertion nào bị hạ để né bug — TC phơi bug liệt kê riêng
- [ ] Attach request/response ở mọi test, đã che dữ liệu nhạy cảm; không attachment `stdout`
- [ ] Mọi bản ghi test đã dọn; số tạo / số dọn ghi rõ trong báo cáo
- [ ] **Không** bản ghi có sẵn nào của hệ thống bị sửa hoặc xoá
