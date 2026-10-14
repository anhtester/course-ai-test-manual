---
description: Sinh test data cho ma trận kết hợp đa chiều bằng pipeline chạy thật qua nhiều modules. Input từ /generate-cross-module-test-plan.
skills:
  - skills-test-data-generator
  - skills-ui-debug-agent
  - skills-qa-automation-engineer
---

# /generate-combinatorial-test-data — Sinh Test Data Cho Ma Trận Kết Hợp

> **Dùng khi:** Đã có ma trận kết hợp (từ `/generate-cross-module-test-plan`) và cần **tạo test data thực tế** bằng cách chạy qua nhiều modules trên browser, hoặc sinh bộ data có cấu trúc sẵn sàng cho automation.

> **BẮT BUỘC (MANDATORY):** Trước khi bắt đầu, PHẢI nạp và đọc kỹ:
> - **Skill:** `.claude/skills/skills-test-data-generator/SKILL.md` — Quy tắc sinh data (xem phần Multi-Step Pipeline)
> - **Skill:** `.claude/skills/skills-ui-debug-agent/SKILL.md` — Inspect DOM khi chạy browser
> - **Workflow:** `.claude/commands/generate-cross-module-test-plan.md` — Hiểu cấu trúc ma trận đầu vào

---

## Mối quan hệ với các workflows khác

```
/generate-cross-module-test-plan     →  Ma trận kết hợp (input)
        ↓
/generate-combinatorial-test-data    →  Bộ test data (workflow này)
        ↓
/generate-testcases-manual-rbt       →  Test cases chi tiết
        ↓
/generate-automation-from-testcases  →  Automation scripts
```

---

## 2 Modes

| Mode | Khi nào dùng | Output |
|------|-------------|--------|
| **GENERATE** (mặc định) | Sinh bộ data có cấu trúc từ ma trận — KHÔNG chạy browser | File JSON/CSV/Markdown với data cho mỗi bộ kết hợp |
| **PIPELINE** (lựa chọn cuối) | **Bắt buộc** phải đi qua UI mới tạo được data | Data thật đã tạo + IDs + screenshots evidence |

> Agent tự chọn mode:
> - User nói "sinh data", "generate data" → **GENERATE**
> - User nói "tạo data trên hệ thống", "chạy tạo data", "setup data thật" → xem **Thứ tự ưu tiên** bên dưới
> - Nếu không rõ → hỏi user

### ⚠️ Thứ tự ưu tiên khi cần data THẬT trên hệ thống

PIPELINE (drive browser qua N modules × N combos) là cách **đắt nhất và kém ổn định nhất**.
Trước khi chọn PIPELINE, agent PHẢI hỏi user theo thứ tự:

| # | Cách | Khi nào dùng | Chi phí / Rủi ro |
|---|------|-------------|-----------------|
| 1 | **Seed qua API** | Hệ thống có API tạo record | ⭐ Rẻ, nhanh, ổn định — **luôn ưu tiên** |
| 2 | **Seed qua DB / script** | Có quyền truy cập DB test | Rẻ, nhanh — cẩn thận ràng buộc toàn vẹn |
| 3 | **Import file** | Hệ thống hỗ trợ import Excel/CSV | Trung bình |
| 4 | **PIPELINE (browser)** | 3 cách trên **không khả thi** — nghiệp vụ chỉ tồn tại ở tầng UI | ⚠️ Chậm, dễ vỡ, để lại rác data |

**Câu hỏi agent PHẢI hỏi trước khi chạy PIPELINE:**

```
Bạn cần data thật trên hệ thống. Trước khi tôi drive browser (chậm và dễ gãy),
kiểm tra giúp:

  1. Hệ thống có API tạo record không?          → seed qua API nhanh hơn nhiều
  2. Có quyền truy cập DB test không?           → seed script
  3. Có chức năng import Excel/CSV không?       → import file

Nếu cả 3 đều KHÔNG → tôi chạy PIPELINE qua browser.
```

### ⚠️ Cảnh báo môi trường dùng chung

Nếu app là **môi trường demo/staging nhiều người dùng chung**:
- PIPELINE sẽ tạo hàng chục record rác ảnh hưởng người khác
- **PHẢI** hỏi user xác nhận trước khi chạy
- **PHẢI** ghi lại toàn bộ ID đã tạo vào report để dọn dẹp sau
- Ưu tiên chạy batch nhỏ (5-10 bộ) thay vì chạy hết ma trận

---

## Input cần từ User

| Input | Bắt buộc | Mô tả |
|-------|----------|-------|
| **Ma trận kết hợp** | ✅ | File `.md` / bảng Markdown từ `/generate-cross-module-test-plan` |
| **URL ứng dụng** | ✅ (PIPELINE) | Để agent chạy browser tạo data |
| **Credentials** | ⚠️ PIPELINE | Nếu app cần đăng nhập |
| **Output format** | ❌ | `json` (mặc định), `csv`, `markdown`, `code` (TS/Java/Python) |
| **Ngôn ngữ data** | ❌ | Tiếng Việt / Tiếng Anh (mặc định: theo context) |

---

## Các bước thực hiện

### Bước 1: Đọc & Parse Ma Trận Kết Hợp

1. **Đọc file ma trận** từ user cung cấp:
   - File local → `Read`
   - Inline trong chat → parse trực tiếp
   - URL → `WebFetch`

2. **Parse và validate:**
   - Xác định danh sách dimensions (D1, D2, D3...)
   - Xác định values của mỗi dimension
   - Đọc expected template/formula cho mỗi bộ
   - Đếm tổng số bộ kết hợp cần sinh data

3. **Trình bày tóm tắt:**
   ```markdown
   📊 Ma trận đã đọc:
   - Dimensions: 5 (Đối tác, Thanh toán, Thuế, Công nợ, Nguồn TS)
   - Tổng bộ kết hợp: 20 (Pairwise)
   - Mode: GENERATE / PIPELINE
   
   Bắt đầu sinh data? (Y/N)
   ```

---

### Bước 2: Phân Tích Fields & Data Requirements Mỗi Module

1. **Với mỗi module** trong chuỗi, xác định fields cần data:

   ```markdown
   | Module | Field | Type | Required | Constraints | Data Source |
   |--------|-------|------|----------|-------------|-------------|
   | Đối tác | partner_name | string | ✅ | max: 200 | Random + prefix |
   | Đối tác | partner_type | select | ✅ | enum: [TC, CN, HKD] | Từ dimension D1 |
   | Đối tác | tax_id | string | ✅ | 10-13 digits | Random unique |
   | Thanh toán | currency | select | ✅ | enum: [VND, USD] | Từ dimension D2 |
   | Thanh toán | amount | number | ✅ | min: 1 | Business-relevant values |
   | Thuế | tax_type | select | ✅ | enum: [PIT, VAT, NT, MT] | Từ dimension D3 |
   | ...| ... | ... | ... | ... | ... |
   ```

2. **Phân loại fields:**

   | Loại | Mô tả | Cách sinh data |
   |------|-------|----------------|
   | **Dimension fields** | Giá trị thuộc dimension trong ma trận | Lấy từ bộ kết hợp (không random) |
   | **Supporting fields** | Fields bắt buộc nhưng không phải dimension | Sinh random + unique + traceable |
   | **Computed fields** | Tự tính từ formula | Tính theo business rules |
   | **Reference fields** | ID/code từ module trước | Copy từ output module trước |

---

### Bước 3: Sinh Test Data — Mode GENERATE

> Thực hiện khi mode = GENERATE (mặc định)

1. **Với mỗi bộ kết hợp** trong ma trận, sinh 1 bộ data đầy đủ:

   ```json
   {
     "combination_id": "COMBO_01",
     "dimensions": {
       "D1_partner_type": "Tổ chức",
       "D2_payment_type": "VND",
       "D3_tax_type": "VAT 10%",
       "D4_debt_type": "Thông thường",
       "D5_asset_source": "Quỹ A"
     },
     "module_data": {
       "module_1_partner": {
         "partner_name": "auto_combo01_partner_1712049200",
         "partner_type": "Tổ chức",
         "tax_id": "0123456789",
         "address": "Số 1 Nguyễn Huệ, Q1, HCM"
       },
       "module_2_payment": {
         "currency": "VND",
         "amount": 100000000,
         "payment_date": "2026-04-15",
         "description": "auto_combo01_payment_1712049200"
       },
       "module_3_tax": {
         "tax_type": "VAT",
         "tax_rate": 10,
         "tax_amount": 10000000
       },
       "module_4_debt": {
         "debt_type": "Thông thường",
         "advance_amount": 0
       }
     },
     "expected_output": {
       "template": "BB_TC_VND_VAT",
       "formula": "Amount × 1.10",
       "computed_total": 110000000,
       "expected_fields": ["partner_name", "tax_id", "amount", "tax_amount", "total"]
     }
   }
   ```

2. **Sinh đủ data cho TẤT CẢ bộ kết hợp** → đóng gói vào 1 file output

3. **Đảm bảo data rules:**
   - Unique per combo (không trùng giữa các bộ)
   - Traceable: prefix `auto_combo{XX}_{module_short}_{timestamp}`
   - No real PII
   - Computed values phải đúng theo formula

---

### Bước 3P: Sinh Test Data — Mode PIPELINE (chạy thật trên browser)

> Thực hiện khi mode = PIPELINE

1. **Mở browser bằng MCP:**
   ```
   browser_navigate → URL ứng dụng
   browser_wait_for → page load
   ```

2. **Loop qua từng bộ kết hợp:**

   ```
   FOR each combo in matrix:
     FOR each module in chain:
       1. Navigate → module URL
       2. browser_snapshot → xác nhận state
       3. Điền data theo bộ combo:
          - Dimension fields → chọn giá trị theo combo
          - Supporting fields → sinh random + traceable
       4. Submit / Save
       5. browser_wait_for → confirm success
       6. browser_snapshot → capture kết quả
       7. Extract output (ID, code...) → lưu cho module tiếp theo
     END FOR
     
     // Ở module cuối — verify output
     8. Capture biên bản / output cuối
     9. browser_take_screenshot → evidence
     10. Ghi nhận: combo_id, created_ids, template_found, formula_verified
   END FOR
   ```

3. **Xử lý lỗi trong pipeline:**

   | Lỗi | Cách xử lý |
   |-----|-----------|
   | Submit fail (validation) | Screenshot → ghi log → skip combo → báo user |
   | Module load chậm | `browser_wait_for` với timeout tăng dần |
   | Session expired | Re-login → retry từ module bị fail |
   | Data trùng | Sinh lại data unique, retry |
   | Combo không hợp lệ (constraint) | Skip → đánh dấu "INVALID" trong report |

4. **Giới hạn pipeline:**
   - **Mặc định tối đa 10 bộ kết hợp / phiên chạy** — batch nhỏ để phát hiện lỗi sớm, giảm rác data
   - Nếu > 10 → dừng, báo cáo kết quả batch, hỏi user "Chạy batch tiếp theo?"
   - Trần cứng: **30 bộ / phiên** kể cả khi user yêu cầu chạy liên tục (tránh timeout)
   - Sau mỗi 5 bộ → báo progress cho user
   - **Ghi lại mọi ID đã tạo** ngay khi tạo — kể cả khi pipeline gãy giữa chừng, user vẫn dọn được

---

### Bước 4: Đóng Gói Output & Báo Cáo

#### Output cho Mode GENERATE:

Tạo artifact file(s) theo format user yêu cầu:

**JSON (mặc định):**
```json
{
  "feature": "Biên bản thanh toán đối tác",
  "generated_at": "2026-04-15T17:00:00Z",
  "strategy": "pairwise",
  "total_combinations": 20,
  "dimensions": ["partner_type", "payment_type", "tax_type", "debt_type", "asset_source"],
  "data_sets": [
    { "combination_id": "COMBO_01", "dimensions": {...}, "module_data": {...}, "expected_output": {...} },
    { "combination_id": "COMBO_02", ... }
  ]
}
```

**Markdown Table:**
```markdown
| Combo | Đối tác | Thanh toán | Thuế | Công nợ | Nguồn | Partner Name | Amount | Expected Template | Expected Total |
|-------|---------|-----------|------|---------|-------|-------------|--------|------------------|----------------|
| 01 | Tổ chức | VND | VAT | Thường | Quỹ A | auto_combo01_partner | 100M | BB_TC_VND_VAT | 110M |
| 02 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
```

**Code (TypeScript example):**
```typescript
// test-data/payment-record.data.ts
export const combinatorialData = [
  {
    id: 'COMBO_01',
    partner: { name: `auto_combo01_partner_${Date.now()}`, type: 'Tổ chức', taxId: '0123456789' },
    payment: { currency: 'VND', amount: 100_000_000 },
    tax: { type: 'VAT', rate: 10 },
    expected: { template: 'BB_TC_VND_VAT', total: 110_000_000 },
  },
  // ... more combos
];
```

#### Output cho Mode PIPELINE:

```markdown
## Pipeline Execution Report

| # | Combo | Status | Module 1 ID | Module 2 ID | Module 3 ID | Output Template | Formula ✓ | Screenshot |
|---|-------|--------|------------|------------|------------|-----------------|-----------|------------|
| 1 | COMBO_01 | ✅ PASS | PTR-001 | PAY-001 | TAX-001 | BB_TC_VND_VAT | ✅ Match | combo01.png |
| 2 | COMBO_02 | ✅ PASS | PTR-002 | PAY-002 | TAX-002 | BB_TC_USD_PIT | ✅ Match | combo02.png |
| 3 | COMBO_03 | ❌ FAIL | PTR-003 | PAY-003 | — | — | — | combo03_fail.png |

### Summary (Batch 1/2 — 10 bộ)
- ✅ Passed: 9/10
- ❌ Failed: 1/10 (COMBO_03: Tax module validation error)
- 📊 Data created: 9 partners, 9 payments, 9 tax configs, 9 biên bản

### 🧹 Data cần dọn dẹp
| Module | IDs đã tạo |
|--------|-----------|
| Đối tác | PTR-001 → PTR-009 |
| Thanh toán | PAY-001 → PAY-009 |
| Thuế | TAX-001, TAX-002, TAX-004 → TAX-009 |

> ⚠️ COMBO_03 tạo dở dang (PTR-003, PAY-003 đã tạo nhưng chưa có TAX) — cần dọn thủ công.

**Chạy batch 2 (10 bộ còn lại)?**
```

---

## Data Rules (BẮT BUỘC)

| # | Rule | Mô tả |
|---|------|-------|
| 1 | **Unique per combo** | Mỗi bộ kết hợp dùng data riêng — không chia sẻ giữa combos |
| 2 | **Traceable** | Prefix: `auto_combo{XX}_{module_short}_{timestamp}` — xem [skills-test-data-generator/SKILL.md](../skills/skills-test-data-generator/SKILL.md) mục *Data Chain Tracing Format* |
| 3 | **Dimension values exact** | Giá trị dimension PHẢI đúng như trong ma trận — KHÔNG random |
| 4 | **Supporting fields random** | Fields không thuộc dimension → sinh random + unique |
| 5 | **Computed values verified** | Giá trị tính toán phải đúng theo formula trong ma trận |
| 6 | **No real PII** | KHÔNG dùng dữ liệu cá nhân thật |
| 7 | **Include expected output** | Mỗi combo PHẢI có expected template + formula + computed values |

---

## NGHIÊM CẤM

| ❌ Không được làm | ✅ Thay thế đúng |
|-------------------|-----------------|
| Random dimension values | Dimension values lấy chính xác từ ma trận |
| Hardcode data giống nhau cho mọi combo | Data unique per combo với traceable prefix |
| Bỏ qua expected output | Mỗi combo PHẢI có expected template + values |
| Chạy PIPELINE ngay khi user nói "tạo data thật" | Hỏi API / DB / import trước — PIPELINE là lựa chọn cuối |
| Chạy pipeline > 10 combos / batch không hỏi | Chia batch 10, báo cáo, hỏi user tiếp tục |
| Chạy PIPELINE trên môi trường dùng chung mà không xác nhận | Hỏi user + ghi lại ID để dọn dẹp |
| Kết thúc PIPELINE mà không liệt kê ID đã tạo | Report PHẢI có mục "Data cần dọn dẹp" |
| Bỏ qua combo fail, không report | Ghi log đầy đủ: combo nào fail, tại sao, screenshot |
| Đọc `.env` để lấy credentials | Hỏi User hoặc dùng fixture sẵn có |

---

## Checklist cuối

- [ ] Đã đọc và parse ma trận kết hợp đầy đủ
- [ ] Phân loại fields: dimension / supporting / computed / reference
- [ ] Data sinh ra unique per combo + traceable
- [ ] Dimension values đúng 100% so với ma trận
- [ ] Computed values đúng theo formula
- [ ] **(PIPELINE)** Đã hỏi API / DB / import trước khi quyết định drive browser
- [ ] **(PIPELINE)** Nếu môi trường dùng chung → đã xác nhận với user trước khi chạy
- [ ] **(PIPELINE)** Batch ≤ 10 bộ, đã báo cáo trước khi chạy batch tiếp
- [ ] **(PIPELINE)** Report có mục "🧹 Data cần dọn dẹp" liệt kê đủ ID đã tạo
- [ ] (PIPELINE) Screenshots evidence cho mỗi combo
- [ ] (PIPELINE) Report pass/fail cho mỗi combo
- [ ] Không chứa real PII
- [ ] Output file đúng format user yêu cầu
