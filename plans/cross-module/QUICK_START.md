# 📋 Hướng Dẫn Nhanh: Cross-Module Testing & Ma Trận Kết Hợp

## 🔀 Chọn Luồng Sử Dụng

### Luồng 1: Claude Code (Slash Command) — Tự động (Đề xuất ⭐)

> Dùng khi bạn đang sử dụng **Claude Code**. Workflow có **2 modes** — chọn theo input bạn có.

#### Mode DOCUMENT (mặc định) — Có tài liệu/spec

```
/generate-cross-module-test-plan

Tính năng: [Tên tính năng, VD: "Biên bản thanh toán cho đối tác"]
Tài liệu: [đường dẫn file .md / .doc, link Jira, hoặc paste nội dung]

Các modules liên quan:
1. [Module 1: Quản lý đối tác — chọn loại đối tác]
2. [Module 2: Tạo thanh toán — chọn VND/USD]
3. [Module 3: Cấu hình thuế — chọn loại thuế]
4. [Module 4: Quản lý công nợ — chọn loại công nợ]
5. [Module cuối: Sinh biên bản — output]

Business rules: [công thức / quy tắc xác định output — QUAN TRỌNG, xem lưu ý bên dưới]
Chiến lược ma trận: output-class (mặc định) — hoặc: pairwise / full-cartesian
```

→ AI đọc tài liệu → extract modules + dimensions → sinh ma trận kết hợp.

> ⚠️ **Business rules là thứ quyết định workflow này có giá trị hay không.**
> Không có nó, bạn nhận về bảng chỉ có cột input và vẫn phải điền expected bằng tay.
> AI sẽ cảnh báo ở Bước 0 và cho bạn 3 lựa chọn thay vì chạy hết rồi mới báo.

#### Mode BROWSER — Có URL app, muốn AI inspect DOM thực tế

```
/generate-cross-module-test-plan

Tính năng: [Tên tính năng]
URL: [https://your-app.com]
Tài khoản: [admin@test.com / Test@123]
Yêu cầu: inspect DOM thực tế trên browser

Các modules liên quan:
1. [Module 1: /partners]
2. [Module 2: /payments/new]
3. [...]

Chiến lược ma trận: pairwise
```

→ AI mở browser → khám phá từng module → vẽ Data Flow → sinh ma trận kết hợp.

> 💡 Nếu bạn cung cấp **cả tài liệu và URL** → AI ưu tiên BROWSER, dùng tài liệu để đối chiếu.
> Nếu **danh sách modules/dimensions để trống** → AI tự extract từ tài liệu/DOM.

---

### Luồng 2: Copy-Paste vào Claude Desktop — Thủ công

> Dùng khi bạn muốn dùng AI khác (không phải Claude Code).

**Prompt mẫu — Copy paste vào chat AI:**

```
Bạn là Senior QA Engineer chuyên Combinatorial Testing.

Tôi có tính năng "[TÊN TÍNH NĂNG]" đi qua nhiều modules nối tiếp nhau.
Mỗi module có nhiều lựa chọn, và bộ kết hợp các lựa chọn quyết định output cuối.

Các modules và dimensions:
- Module 1 [TÊN]: dimension [TÊN CHIỀU] = [giá trị 1, giá trị 2, ...]
- Module 2 [TÊN]: dimension [TÊN CHIỀU] = [giá trị 1, giá trị 2, ...]
- Module 3 [TÊN]: dimension [TÊN CHIỀU] = [giá trị 1, giá trị 2, ...]
- ...

Hãy thực hiện:
1. Vẽ Data Flow Diagram giữa các modules (module nào output gì → input module nào)
2. Liệt kê tất cả constraints (bộ kết hợp không hợp lệ)
3. Liệt kê các Output Class (template/công thức đầu ra khác nhau)
4. Sinh bảng ma trận sao cho MỖI output class được cover ít nhất 1 lần,
   bổ sung bộ biên + bộ rủi ro cao. Chỉ dùng Pairwise cho các chiều
   KHÔNG ảnh hưởng đến output.
5. Với mỗi bộ kết hợp, ghi rõ Expected Output (template, công thức nếu có)
6. Cuối bảng, ghi dòng verify: "Output coverage: X/X class được cover"

Output dạng bảng Markdown, sẵn sàng copy sang Excel.
```

---

## 🎯 Luồng End-to-End — Từng bước

### Bước 1: Phân tích Cross-Module & Sinh Ma Trận

```
/generate-cross-module-test-plan

Tính năng: Biên bản thanh toán cho đối tác
Tài liệu: docs/requirements/payment_record.md
```

**Kết quả:** AI sinh ra:

- 📊 Module Inventory + Dependencies Matrix (module nào → module nào)
- 📋 Dimension Catalog (tất cả chiều + values + constraints)
- 📈 **Ma trận kết hợp** (Output-Class ~12 bộ thay vì 216 bộ Full) + dòng verify coverage

**⏸️ Checkpoint (duy nhất, ở Bước 4 của workflow):** AI dừng lại trình bày ma trận → bạn kiểm tra → bổ sung/sửa → xác nhận OK.

> Các bước 1→3 chạy **liên tục không dừng**. Nếu thấy Module Map hoặc Dimension Catalog sai giữa chừng, cứ chen ngang báo AI — không cần chờ checkpoint.

---

### Bước 2: Sinh Test Data cho Ma Trận

```
/generate-combinatorial-test-data

Ma trận: [paste bảng ma trận từ Bước 1]
Mode: GENERATE (hoặc PIPELINE nếu muốn tạo data thật trên hệ thống)
Format: json (hoặc: csv, markdown, typescript)
```

**Kết quả:**

- Mode GENERATE: File JSON/CSV chứa N bộ data, mỗi bộ = 1 combo
- Mode PIPELINE: AI chạy browser thật → tạo data trên hệ thống → report pass/fail

> ⚠️ **Trước khi chọn PIPELINE**, kiểm tra 3 thứ — cách nào cũng nhanh và ổn định hơn drive browser:
> 1. Hệ thống có **API** tạo record không?
> 2. Có quyền truy cập **DB test** không?
> 3. Có chức năng **import Excel/CSV** không?
>
> Cả 3 đều không → mới dùng PIPELINE. AI sẽ hỏi bạn đúng 3 câu này trước khi chạy.
> PIPELINE mặc định chạy **batch 10 bộ**, báo cáo, rồi hỏi có chạy tiếp không.

---

### Bước 3: Sinh Test Cases (Tùy chọn)

```
/generate-testcases-manual-rbt

Requirements: [paste requirements + ma trận kết hợp từ Bước 1]
```

→ AI sinh test cases chi tiết cho từng bộ kết hợp quan trọng.

---

### Bước 4: Sinh Automation Scripts (Tùy chọn)

```
/generate-automation-from-testcases

URL: https://example.com
Test cases: [paste test cases từ Bước 3]
Framework: Playwright TypeScript
```

→ AI sinh scripts + tự chạy + tự fix → PASS stable.

---

## 📊 Ví Dụ Thực Tế: Biên Bản Thanh Toán Đối Tác

### Input (bạn cung cấp):

```
Tính năng: Biên bản thanh toán cho đối tác
Modules:
1. Quản lý Đối tác: Loại = [Tổ chức, Cá nhân, Hộ KD]
2. Thanh toán: Loại = [VND, USD]
3. Thuế: Loại = [PIT, VAT, Nhà thầu, Miễn thuế]
4. Công nợ: Loại = [Thường, Tạm ứng, Điều chỉnh]
5. Nguồn tài sản: Loại = [Quỹ A, Quỹ B, Quỹ C]

Business rules:
- Template biên bản = f(Loại đối tác, Loại TT, Loại thuế) → 8 template
- Nguồn tài sản KHÔNG ảnh hưởng template, chỉ ghi vào phần chú thích
- Công nợ Tạm ứng → trừ số đã tạm ứng trước khi tính thuế
```

### Output (AI sinh ra):

**Data Flow:**

```
Đối tác → Thanh toán → Thuế → Công nợ → Biên bản
(type)     (currency)   (Phụ thuộc     (Phụ thuộc
                         type+currency)  tất cả)
```

**Ma trận Output-Class Coverage (12 bộ thay vì 3×2×4×3×3 = 216 bộ):**

| #   | Đối tác | TT  | Thuế     | Công nợ    | Nguồn | Expected      | Ghi chú          |
| --- | ------- | --- | -------- | ---------- | ----- | ------------- | ---------------- |
| 1   | Tổ chức | VND | VAT      | Thường     | Quỹ A | BB_TC_VND_VAT | Class 1          |
| 2   | Tổ chức | USD | PIT      | Tạm ứng    | Quỹ B | BB_TC_USD_PIT | Class 2 + tạm ứng |
| 3   | Cá nhân | VND | PIT      | Thường     | Quỹ A | BB_CN_VND_PIT | Class 3          |
| 4   | Cá nhân | USD | VAT      | Điều chỉnh | Quỹ C | BB_CN_USD_VAT | Class 4          |
| 5   | Hộ KD   | VND | Nhà thầu | Thường     | Quỹ B | BB_HKD_VND_NT | Class 5          |
| ... | ...     | ... | ...      | ...        | ...   | ...           | ...              |

**Output coverage: 8/8 template được cover ✅**

→ Mỗi template xuất hiện ≥1 lần. Chiều "Nguồn tài sản" không ảnh hưởng template
→ chỉ cần pairwise phủ nốt, không nhân bộ.

> ⚠️ Nếu dùng Pairwise thuần cho ví dụ này: phủ 100% *cặp* với ~15 bộ, nhưng **có thể
> thiếu vài template** — vì template là hàm của bộ **3 chiều** (đối tác × TT × thuế),
> không phải của từng cặp. Đó là lý do Output-Class là mặc định.

---

## 💡 Mẹo Tối Ưu

1. **Bắt đầu với Output-Class Coverage** (mặc định) — bám đúng spec. Pairwise chỉ dùng để *bổ sung* cho các chiều không quyết định output, hoặc khi chưa có business rules
2. **Cung cấp business rules/công thức** nếu có — AI mới điền được cột "Expected Output". Không có → AI để trống, **không tự đoán** template/công thức
3. **Review kỹ Dependencies Matrix + Dimension Catalog** khi AI trình bày — sai ở đây → ma trận sẽ sai. Chen ngang báo AI ngay, đừng đợi đến checkpoint cuối
4. **PIPELINE là lựa chọn cuối** — ưu tiên seed qua API / DB / import Excel. Chỉ drive browser khi nghiệp vụ chỉ tồn tại ở tầng UI
5. **Chạy trong cùng 1 conversation** với Claude Code để AI giữ context xuyên suốt
6. **Chia batch 10 bộ** khi chạy PIPELINE — phát hiện lỗi sớm, đỡ để lại rác data

---

## ⚠️ Phân Biệt: Khi Nào KHÔNG Cần Workflow Này?

| Tình huống                                                  | Dùng workflow nào?                                                            |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Test 1 module đơn lẻ, form đơn giản                         | `/generate-testcases-manual-rbt` hoặc `/generate-testcases-from-requirements` |
| Nhiều modules nhưng **độc lập** (không ảnh hưởng lẫn nhau)  | `/generate-application-test-plan`                                             |
| Nhiều modules **nối tiếp**, output phụ thuộc **bộ kết hợp** | ✅ `/generate-cross-module-test-plan` ← **Dùng workflow này**                 |
| Chỉ cần test data cho 1 form                                | `/generate-test-data`                                                         |
