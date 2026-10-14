---
description: Phân tích tính năng đi qua nhiều modules nối tiếp, xây dựng Module Map + Dimension Catalog, và sinh ma trận kết hợp (Output-Class Coverage/Pairwise/Full Cartesian). Hỗ trợ 2 modes — DOCUMENT (từ tài liệu) và BROWSER (inspect DOM thực tế).
skills:
  - skills-qa-automation-engineer
  - skills-requirements-analyzer
---

# /generate-cross-module-test-plan — Phân Tích Cross-Module & Sinh Ma Trận Kết Hợp

> **Dùng khi:** Tính năng cần test đi qua **nhiều modules nối tiếp nhau**, mỗi module có nhiều lựa chọn (dimensions), và bộ kết hợp các lựa chọn quyết định output cuối cùng.

> **BẮT BUỘC (MANDATORY):** Trước khi bắt đầu, PHẢI nạp và đọc kỹ:
> - **Skill:** `.claude/skills/skills-qa-automation-engineer/SKILL.md` — Workflow routing + automation rules
> - **Skill:** `.claude/skills/skills-requirements-analyzer/SKILL.md` — Phân tích requirements

---

## Khi nào dùng workflow này?

| Tình huống | Dùng? |
|------------|-------|
| Tính năng đi qua **1 module/form** | ❌ Dùng `/generate-testcases-manual-rbt` |
| Tính năng đi qua **nhiều modules**, mỗi module **độc lập** | ⚠️ Dùng `/generate-application-test-plan` |
| Tính năng đi qua **nhiều modules NỐI TIẾP**, output phụ thuộc **bộ kết hợp điều kiện** | ✅ **Đúng workflow này** |
| Cần **ma trận kết hợp** (Output-Class / Pairwise / Decision Table đa chiều) | ✅ **Đúng workflow này** |

---

## 2 Modes

| Mode | Khi nào dùng | Input chính |
|------|-------------|-------------|
| **DOCUMENT** (mặc định) | User cung cấp tài liệu/spec mô tả modules + business rules | File `.md`, `.doc`, Jira ticket, hoặc mô tả text |
| **BROWSER** | User cung cấp URL và muốn agent inspect DOM thực tế | URL ứng dụng + credentials (nếu cần) |

> Agent tự chọn mode:
> - User cung cấp file/text mô tả → **DOCUMENT**
> - User cung cấp URL hoặc nói "inspect", "mở app", "xem trên browser" → **BROWSER**
> - User cung cấp cả hai → Ưu tiên **BROWSER**, dùng document để cross-reference
> - Nếu không rõ → hỏi user

---

## Input cần từ User

| Input | Bắt buộc | Mô tả |
|-------|----------|-------|
| **Tên tính năng / luồng** | ✅ | VD: "Biên bản thanh toán cho đối tác" |
| **Tài liệu yêu cầu** (DOCUMENT mode) | ✅ | File `.md`, Jira ticket, user story, hoặc text mô tả |
| **URL ứng dụng** (BROWSER mode) | ✅ | Để agent inspect DOM thực tế |
| **Danh sách modules tham gia** | ⚠️ Nên có | Nếu không → agent tự extract từ document/browser |
| **Danh sách dimensions** | ⚠️ Nên có | VD: loại đối tác, loại thuế... Nếu không → agent tự extract |
| **Business rules / công thức** | ⚠️ **Rất nên có** | Quyết định Expected Output. Không có → xem Bước 0 |
| **Credentials** (BROWSER mode) | ❌ | Nếu app cần đăng nhập |
| **Chiến lược ma trận** | ❌ | `output-class` (mặc định), `pairwise`, hoặc `full-cartesian` |

---

## Các bước thực hiện

### Bước 0: Kiểm Tra Tiền Đề (PREREQUISITE ⚠️)

> Bước rẻ nhưng bắt buộc — tránh chạy hết 4 bước rồi mới phát hiện không sinh được Expected Output.

Trước khi bắt đầu Bước 1, agent PHẢI kiểm tra:

| Tiền đề | Nếu THIẾU → agent làm gì |
|---------|--------------------------|
| **Business rules / công thức xác định output** (template nào ứng với bộ kết hợp nào, công thức tính ra sao) | ⚠️ **CẢNH BÁO NGAY cho user trước khi chạy** (xem mẫu bên dưới) |
| Danh sách modules trong chuỗi | Tự extract ở Bước 1 — không cần cảnh báo |
| Giá trị của từng dimension | Tự extract ở Bước 1/2 — không cần cảnh báo |

**Mẫu cảnh báo khi thiếu business rules:**

```
⚠️ Tôi chưa thấy business rules / công thức xác định output.

Không có phần này, ma trận sinh ra sẽ CHỈ CÓ CỘT INPUT — không có
Expected Output. Bạn vẫn phải ngồi điền tay expected cho từng bộ,
và đó thường là phần tốn thời gian nhất.

Chọn 1 trong 3:
  (A) Cung cấp business rules → tôi điền luôn Expected Output      [tốt nhất]
  (B) Chạy BROWSER mode, tôi chạy thật vài bộ để suy ra output rule
  (C) Vẫn chạy, chấp nhận ma trận chỉ có input — bạn tự điền expected

Chọn?
```

> **KHÔNG tự bịa business rules để "cho đủ"** — thà ma trận trống còn hơn ma trận sai.
> Nếu user chọn (C) → tiếp tục bình thường, nhưng ghi rõ trong artifact rằng Expected Output **chưa được xác định**.

---

### Bước 1: Module Recon — Khám phá từng Module

#### Mode DOCUMENT:

1. **Đọc tài liệu** user cung cấp (file local → `Read`, URL → `WebFetch`, inline → parse trực tiếp)
2. **Extract danh sách modules** từ tài liệu:
   - Tìm các phần (sections) mô tả từng bước/module trong luồng
   - Xác định thứ tự modules (module nào trước, module nào sau)
   - Xác định fields/controls được đề cập cho mỗi module
3. **Nếu tài liệu không rõ** → hỏi user bổ sung thông tin cụ thể

#### Mode BROWSER:

1. **Nhận danh sách modules** từ user hoặc tự khám phá qua navigation
2. **Với mỗi module** trong chuỗi:
   ```
   browser_navigate → URL module
   browser_wait_for → page load
   browser_snapshot → thu thập DOM
   ```
3. **Thu thập cho mỗi module:**
   - Tên module (từ tiêu đề trang / breadcrumb)
   - Fields / Controls (input, select, radio...)
   - Giá trị có thể chọn (mở dropdown → đọc options)
   - Validation rules (required, format, min/max)

#### Output Bước 1 — Module Inventory (cả 2 modes):

```markdown
| # | Module | URL / Path | Inputs chính | Key Dimensions | Output | → Next Module |
|---|--------|-----------|-------------|---------------|--------|---------------|
| 1 | Quản lý Đối tác | /partners | Tên, MST, Loại | **Loại đối tác** (3 values) | Partner ID | → Thanh toán |
| 2 | Tạo Thanh toán | /payments/new | Số tiền, Loại | **Loại TT** (2 values) | Payment ID | → Thuế |
| ...| ... | ... | ... | ... | ... | ... |
```

---

### Bước 2: Data Flow & Dimension Extraction

> Gộp Data Flow Mapping + Dimension Extraction vào 1 bước để giảm context switching.

1. **Xác định Data Flow** giữa các modules:
   - Module A **output** gì?
   - Output đó trở thành **input/điều kiện** module B như thế nào?

2. **Ghi Dependencies Matrix:**

   ```markdown
   | Module đích | Phụ thuộc vào | Trường phụ thuộc | Loại phụ thuộc |
   |-------------|--------------|-----------------|----------------|
   | Thanh toán | Đối tác | Partner.type | Lọc options thanh toán |
   | Thuế | Đối tác + Thanh toán | Partner.type, Payment.currency | Quyết định loại thuế |
   ```

3. **Extract Dimensions** — các biến số quyết định output:

   ```markdown
   | # | Dimension (Chiều) | Module nguồn | Giá trị có thể | Số values |
   |---|------------------|-------------|----------------|-----------|
   | D1 | Loại đối tác | Đối tác | Tổ chức, Cá nhân, Hộ KD | 3 |
   | D2 | Loại thanh toán | Thanh toán | VND, USD | 2 |
   | D3 | Loại thuế | Thuế | PIT, VAT, Nhà thầu, Miễn thuế | 4 |
   ```

4. **Tính tổng tổ hợp tiềm năng:**
   ```
   Full Cartesian: D1 × D2 × D3 × ... = tổng bộ kết hợp
   ```

5. **Xác định constraints** (bộ kết hợp không hợp lệ):
   ```markdown
   | Constraint | Mô tả | Bộ bị loại |
   |-----------|-------|-----------|
   | C1 | Cá nhân + USD → không có Nhà thầu | 1 bộ |
   ```

6. **Trình bày cho user** kết quả phân tích:
   - Module Inventory
   - Dependencies Matrix
   - Dimension Catalog
   - Constraints
   - **Tiếp tục tự động** sang Bước 3 (KHÔNG dừng checkpoint — chỉ dừng nếu user chủ động nói sai)

---

### Bước 3: Sinh Ma Trận Kết Hợp (CORE OUTPUT ⭐)

Agent hỗ trợ **3 chiến lược** — user chọn hoặc agent đề xuất:

> ### ⭐ RULE BẤT BIẾN — Output Coverage (áp dụng cho MỌI chiến lược)
>
> **Mỗi giá trị Expected Output khác nhau PHẢI xuất hiện ít nhất 1 lần trong ma trận.**
>
> Nếu spec định nghĩa 6 template (BB_TC_VND_VAT, BB_CN_USD_PIT, ...) → ma trận cuối
> cùng phải chứa đủ 6, bất kể chiến lược nào được chọn.
>
> **Lý do:** Bài toán cross-module là *tổ hợp quyết định output* — tổ hợp CHÍNH LÀ spec.
> Một bộ pairwise phủ 100% *cặp* vẫn có thể bỏ sót nguyên một template, vì template là
> hàm của bộ 3-4 chiều chứ không phải của từng cặp. Phủ cặp ≠ phủ output.
>
> Agent PHẢI verify rule này ở cuối Bước 3 và báo cáo:
> `Output coverage: 6/6 template được cover ✅` hoặc liệt kê template còn thiếu + bổ sung bộ.
>
> Nếu chưa biết Expected Output (user chọn phương án (C) ở Bước 0) → rule này **tạm hoãn**,
> ghi rõ trong artifact: `⚠️ Output coverage CHƯA verify được — thiếu business rules`.

#### 3A. Output-Class Coverage (MẶC ĐỊNH — KHUYẾN NGHỊ)

> Phủ theo **lớp output**: mỗi template/công thức đầu ra khác nhau = ít nhất 1 bộ,
> cộng thêm bộ biên và bộ rủi ro cao.

**Cách thực hiện:**

1. **Liệt kê các output class** từ business rules — mỗi template/công thức riêng biệt = 1 class
2. **Với mỗi class**, chọn 1 bộ kết hợp đại diện (ưu tiên bộ phổ biến nhất trong thực tế)
3. **Bổ sung** các bộ có rủi ro cao:
   - Liên quan tiền / thuế / quyết định tài chính → High Risk
   - Bộ biên giữa các class (VD: sát ngưỡng chuyển từ VAT sang miễn thuế)
   - Bộ kết hợp hiếm nhưng hậu quả lớn
4. **(Tùy chọn) Bổ sung pairwise** cho các dimensions **không** ảnh hưởng output —
   xem 3B, chạy pairwise riêng cho nhóm dimensions đó rồi ghép vào

**Số lượng:** Thường 10-20 bộ. Agent đề xuất → user xác nhận ở Bước 4.

> **Khi nào KHÔNG dùng 3A:** Chưa có business rules → không xác định được output class.
> Lúc đó fallback sang 3B (pairwise) và ghi rõ giới hạn trong artifact.

#### 3B. Pairwise Testing (Bổ sung, hoặc fallback khi chưa có business rules)

> Đảm bảo mọi **cặp 2 giá trị** từ 2 dimensions bất kỳ đều được test ít nhất 1 lần.
> Giảm mạnh số bộ kết hợp.

**Dùng khi:**
- Bổ sung cho 3A — phủ nốt các dimensions **không quyết định output** (VD: nguồn quỹ, người tạo)
- Fallback khi chưa có business rules → chưa biết output class nào tồn tại
- User chỉ định rõ `pairwise`

> ⚠️ **Giới hạn phải hiểu:** Pairwise được thiết kế để bắt lỗi *tương tác ngoài ý muốn*,
> giả định các yếu tố độc lập về mặt spec. Nó **KHÔNG** đảm bảo phủ hết các output class.
> Nếu dùng 3B đơn lẻ mà đã biết business rules → vẫn phải verify RULE BẤT BIẾN ở trên
> và bổ sung bộ cho các template còn thiếu.

**Cách thực hiện — PHẢI dùng script, KHÔNG tính thủ công:**

1. Agent **sinh script Python** sử dụng thư viện `allpairspy`:

   ```python
   # pairwise_generator.py
   from allpairspy import AllPairs

   dimensions = {
       "D1_partner_type": ["Tổ chức", "Cá nhân", "Hộ KD"],
       "D2_payment_type": ["VND", "USD"],
       "D3_tax_type": ["PIT", "VAT", "Nhà thầu", "Miễn thuế"],
       # ... thêm dimensions
   }

   keys = list(dimensions.keys())
   values = list(dimensions.values())

   # Constraints (bộ không hợp lệ)
   # LƯU Ý: allpairspy gọi filter_func với row PARTIAL (chưa đủ dimensions).
   # → map theo TÊN dimension, KHÔNG dùng index vị trí (row[0], row[1]...)
   #   vì index sẽ vỡ ngay khi thêm/bớt/đổi thứ tự dimension.
   def is_valid(row):
       c = dict(zip(keys, row))   # zip dừng ở phần tử ngắn nhất → partial row an toàn

       # C1: Cá nhân + USD → không áp dụng thuế Nhà thầu
       if (c.get("D1_partner_type") == "Cá nhân"
               and c.get("D2_payment_type") == "USD"
               and c.get("D3_tax_type") == "Nhà thầu"):
           return False

       # C2: thêm constraint khác ở đây theo cùng pattern c.get("Dx_...")
       return True

   print(f"| # | {' | '.join(keys)} |")
   print(f"|{'---|' * (len(keys) + 1)}")
   for i, combo in enumerate(AllPairs(values, filter_func=is_valid)):
       print(f"| {i+1} | {' | '.join(str(v) for v in combo)} |")
   ```

2. Agent **chạy script** → đọc output → format thành bảng Markdown
3. Nếu `allpairspy` chưa cài → `pip install allpairspy` trước khi chạy
4. **Verify RULE BẤT BIẾN** — đối chiếu output classes, bổ sung bộ nếu thiếu

> **NGHIÊM CẤM** agent tự tính pairwise thủ công — LLM không đảm bảo đúng toán học.

#### 3C. Full Cartesian (Đầy đủ)

> Test TẤT CẢ bộ kết hợp hợp lệ. Dùng khi tổng bộ ≤ 50 hoặc user yêu cầu.

#### Output Bước 3 — Bảng Ma Trận:

```markdown
## Ma Trận Kết Hợp (Output-Class Coverage — N bộ)

| # | D1: Đối tác | D2: Thanh toán | D3: Thuế | D4: Công nợ | Expected Output | Risk |
|---|------------|---------------|---------|------------|-----------------|------|
| 1 | Tổ chức | VND | VAT 10% | Thường | BB_TC_VND_VAT | High |
| 2 | Tổ chức | USD | PIT 10% | Tạm ứng | BB_TC_USD_PIT | High |
| 3 | Cá nhân | VND | PIT 10% | Thường | BB_CN_VND_PIT | High |
| ... | ... | ... | ... | ... | ... | ... |

**Output coverage: 6/6 template được cover ✅**
```

> **Ghi chú về Expected Template / Formula:**
> - Nếu user cung cấp business rules → thêm cột "Expected Output" + dòng verify coverage
> - Nếu KHÔNG có → **KHÔNG thêm cột này**, thay bằng dòng:
>   `⚠️ Expected Output chưa xác định — thiếu business rules (xem Bước 0)`
> - KHÔNG điền `[Cần user xác nhận]` — nếu không biết thì bỏ trống, đừng tạo noise

---

### Bước 4: Đóng Gói Output & Sinh Data (CHECKPOINT ⏸️)

> Đây là **checkpoint DUY NHẤT** — agent dừng ở đây chờ user xác nhận.

1. **Sinh artifact chính:**

   **File: `cross_module_test_plan_<feature>.md`**
   - Module Inventory (Bước 1)
   - Dependencies Matrix (Bước 2)
   - Dimension Catalog + Constraints (Bước 2)
   - **Ma Trận Kết Hợp** (Bước 3) — ĐÂY LÀ OUTPUT CHÍNH
   - Risk Assessment cho mỗi bộ kết hợp

2. **(Optional) Sinh test data cùng lúc** nếu user yêu cầu `--with-data`:

   Với mỗi bộ kết hợp trong ma trận, sinh 1 bộ data:
   ```json
   {
     "combination_id": "COMBO_01",
     "dimensions": { "D1": "Tổ chức", "D2": "VND", "D3": "VAT 10%" },
     "supporting_data": {
       "partner_name": "auto_combo01_partner_<timestamp>",
       "tax_id": "0123456789",
       "amount": 100000000
     }
   }
   ```
   
   **Data Rules:**
   - Dimension values PHẢI đúng 100% từ ma trận — KHÔNG random
   - Supporting fields → random + unique + traceable (format `auto_combo{XX}_{module_short}_{timestamp}`)
   - Không chứa real PII

3. **⏸️ DỪNG LẠI — Trình bày cho user:**
   - Ma trận kết hợp hoàn chỉnh
   - Hỏi: "Có bộ kết hợp nào thiếu? Cần bổ sung gì?"
   - **Chờ user xác nhận**

---

## Bước tiếp theo sau workflow này

| Mục tiêu | Workflow tiếp theo |
|----------|-------------------|
| Sinh **test cases chi tiết** cho từng bộ kết hợp | `/generate-testcases-manual-rbt` — input = ma trận |
| Tạo **test data thật trên hệ thống** qua browser pipeline | `/generate-combinatorial-test-data` — mode PIPELINE |
| Sinh **automation scripts** | `/generate-automation-from-testcases` — input = test cases |

---

## Ví dụ thực tế

### Ví dụ 1: E-Commerce Order — CÓ business rules (DOCUMENT mode, 3A)

**User nói:** "Phân tích luồng đặt hàng: Chọn sản phẩm → Chọn vận chuyển → Thanh toán → Xác nhận. Quy tắc tính phí ship + thuế: [đính kèm file]"

**Agent thực hiện:**
1. **Bước 0:** Có business rules ✅ → chạy tiếp, không cảnh báo
2. Extract 4 modules từ mô tả
3. Dimensions: Loại SP (3), Vận chuyển (3), Thanh toán (4) = 36 bộ full
4. **Output classes** từ business rules: 5 công thức tính tổng khác nhau
5. Chọn 5 bộ đại diện + 4 bộ rủi ro cao (biên miễn phí ship, COD nước ngoài...) = **9 bộ**
6. Bổ sung pairwise cho dimension không ảnh hưởng output (nguồn kho) → **11 bộ**
7. Output: Ma trận 11 bộ, **coverage 5/5 công thức ✅**

### Ví dụ 2: Insurance Contract — CHƯA có business rules (BROWSER mode, 3B fallback)

**User nói:** "Inspect app bảo hiểm tại https://example.com, luồng tạo hợp đồng"

**Agent thực hiện:**
1. **Bước 0:** Không có business rules → **cảnh báo user**, user chọn (B) — chạy thật vài bộ để suy ra rule
2. Navigate qua 3 modules, snapshot mỗi module
3. Extract dimensions từ DOM: Loại BH (3), Gói (4), Kỳ hạn (3), PTTT (2) = 72 bộ full
4. Chạy 4 bộ mẫu trên app → phát hiện 6 template hợp đồng khác nhau
5. Chuyển sang 3A với 6 output class vừa tìm được → **13 bộ**
6. Output: Ma trận 13 bộ, **coverage 6/6 template ✅** + Data Flow

> Nếu user chọn (C) ở Bước 0 → dùng 3B pairwise thuần (~15 bộ), artifact ghi rõ
> `⚠️ Output coverage CHƯA verify được — thiếu business rules`

---

## NGHIÊM CẤM

| ❌ Không được làm | ✅ Thay thế đúng |
|-------------------|-----------------| 
| Tự tính pairwise thủ công (greedy/IPOG) | Sinh script Python + `allpairspy` → chạy script |
| Dùng index vị trí (`row[0]`, `row[1]`) trong `is_valid()` | Map theo tên: `dict(zip(keys, row))` → `c.get("D1_...")` |
| Giao ma trận pairwise mà **thiếu output class** | Verify RULE BẤT BIẾN → bổ sung bộ cho template còn thiếu |
| Chạy hết 4 bước rồi mới báo thiếu business rules | **Bước 0** — cảnh báo NGAY trước khi bắt đầu |
| Đoán giá trị dimensions không có nguồn | DOCUMENT: extract từ tài liệu, BROWSER: inspect DOM |
| Tự điền Expected Template/Formula khi không biết | Bỏ trống hoặc hỏi user — KHÔNG viết `[Cần xác nhận]` |
| Bịa business rules cho "đủ bảng" | Thà ma trận trống còn hơn ma trận sai |
| Sinh Full Cartesian mặc định khi dimensions lớn | Dùng Output-Class Coverage (3A) — bám đúng spec |
| Bỏ qua constraints (bộ kết hợp không hợp lệ) | Phải xác định và loại bỏ invalid combinations |
| Load quá nhiều skills (>2) vào context | Chỉ load 2 skills bắt buộc, thêm skill khác khi cần |

---

## Checklist cuối

- [ ] **(Bước 0)** Đã kiểm tra business rules — nếu thiếu, đã cảnh báo user trước khi chạy
- [ ] Đã thu thập thông tin TỪNG module (qua tài liệu hoặc browser)
- [ ] Đã xây dựng Dependencies Matrix giữa các modules
- [ ] Đã extract đầy đủ dimensions + values + constraints
- [ ] Đã chọn chiến lược ma trận phù hợp (mặc định: Output-Class Coverage)
- [ ] **⭐ RULE BẤT BIẾN:** Mỗi Expected Output class xuất hiện ≥1 lần — đã verify và ghi số liệu coverage
- [ ] **(Pairwise)** Đã sinh và chạy script — KHÔNG tính thủ công
- [ ] **(Pairwise)** `is_valid()` map constraint theo TÊN dimension, không theo index
- [ ] Ma trận chỉ chứa bộ kết hợp hợp lệ (đã loại constraints)
- [ ] User đã xác nhận ma trận tại Bước 4
- [ ] Artifact output đã lưu đúng vị trí project
